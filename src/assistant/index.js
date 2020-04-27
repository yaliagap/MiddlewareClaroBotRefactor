const env = process.env
const uuidv4 = require('uuid/v4')
const facebook = require('./facebook')
const utils = require('../utils/')
const watson = require('./watson')

if(JSON.parse(env.FB_GET_PROPERTIES)) utils.getPropertiesFacebook()
if(JSON.parse(env.FB_ENABLE_PROPERTIES)){
	utils.enablePropertiesFacebook()
	console.log('Properties enabled on Facebook')
}
if(JSON.parse(env.FB_DISABLE_PROPERTIES)){
	utils.disablePropertiesFacebook()
	console.log('Properties disabled on Facebook')
}

module.exports = (app) => {
	/* Web */

	app.post('/web/receive',utils.verifyApiKeyAssistantWeb,async (req,res) => {
		try{
			let payload = {
				context: req.body.context || {},
				input: req.body.input
			}
			payload.context.user_json = payload.input
			payload.context.channel_id = 1
			payload.context.user_agent = req.headers['user-agent']
			payload.context.public_ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(',')[0]
			payload.context.errors = []
			if(!payload.context.user) payload.context.user = {id:uuidv4()}
			console.log(payload.context.handover)

			console.log(payload.input.text)
			payload = await watson.sendMessageWebV1(payload)
			console.log(payload.output.text)
			await watson.afterSendMessageWebV1(payload)
			payload = await watson.handleActionsWebV1(payload)

			/* Errors */
			payload.context.errors.forEach((e) => console.error(e))

			/* After errors */
			let i = 0
			while(i < payload.context.errors.length){
				const error = payload.context.errors[i++]
				if([200,201,202,203,204].indexOf(error.id) > -1){
					const payloadSurvey = utils.cloneVariable(payload)
					payload.context.survey = await watson.startSurveyWebV1(payloadSurvey)
					break
				}
			}
			res.status(200).send(payload)
		}catch(err){
			const location = 'Error at app.post /web/receive'
			console.error(location)
			console.error(err)
			if(!res.headersSent){
				user = {id: (req.body.context.user) ? req.body.context.user : uuidv4()}
				res.status(200).send({
					output: {text:[]},
					context: {
						user,
						errors: [{
							id:100,
							message:'Lo siento, no hemos podido enviar tu mensaje. Por favor intenta nuevamente'
						}]
					}
				})
			}
			const error = require('../database/controllers/Error')
			error.create({location,text:err.toString()})
		}
	})

	/* Facebook */

	app.get('/facebook/receive',(req,res) => {
		console.log(JSON.stringify(req.query,null,2))
		if(req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === env.FB_VERIFY_TOKEN){
			console.log('WEBHOOK_VERIFIED')
			res.status(200).send(req.query['hub.challenge'])
		}else{
			res.status(403).send('Error')
		}
	})

	// AssistantV1
	app.post('/facebook/receive',utils.verifyApiKeyAssistantFacebook,async (req,res) => {
		try{
			res.sendStatus(200)
			//console.log(req.body)
			const entries = req.body.entry
			let i = 0
			switch(req.body.object){
				case 'page':{
					while(i < entries.length){
						const entry = entries[i++]
						if(entry.messaging){
							let payload = {context:{}}
							payload.context.channel_id = 2
							payload.context.handover = 'watson'

							const messaging = entry.messaging[0]
							const senderId = messaging.sender.id
							let text = null
							if(messaging.message){
								if(messaging.message.text){
									text = messaging.message.text.replace(/\n/g,' ')
								}else if(messaging.message.attachments){
									//console.log(messaging.message.attachments)
									const attachment = messaging.message.attachments[0]
									switch(attachment.type){
										case 'audio':
											await utils.sendMessageTextWithTypingFacebook(senderId,['Audio recibido'])
											break
										case 'file':
											await utils.sendMessageTextWithTypingFacebook(senderId,['Archivo recibido'])
											break
										case 'image':
											if(attachment.payload.sticker_id){
												await utils.sendMessageTextWithTypingFacebook(senderId,['Sticker recibido'])
											}else{
												await utils.sendMessageTextWithTypingFacebook(senderId,['Imagen recibida'])
											}
											break
										case 'location':
											//console.log(attachment.payload.coordinates)
											break
										case 'video':
											await utils.sendMessageTextWithTypingFacebook(senderId,['Video recibido'])
											break
									}
									//return res.sendStatus(200)
								}
							}else if(messaging.postback){
								text = messaging.postback.payload
							}
							payload.input = {text}

							const context = await facebook.getContext(senderId)
							if(context && payload.input.text !== 'asistente'){
								payload.context = context
							}else{
								payload.context.user = await utils.getUserFacebook(senderId)
							}
							console.log(payload.context.handover)

							payload.context.user_json = messaging
							payload.context.user_agent = req.headers['user-agent']
							payload.context.public_ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(',')[0]
							payload.context.errors = []
							//console.log(payload.context)

							switch(payload.context.handover){
								case 'adviser':{
									const question = {
										channel_id: payload.context.channel_id,
										user_id: senderId,
										user_first_name: payload.context.user.first_name,
										user_last_name: payload.context.user.last_name,
										user_text: payload.input.text,
										watson_conversation_id: payload.context.conversation_id,
										conversation_id: payload.context.conversation_id
									}
									console.log(question)
									const messageCustomer = await omnibox.sendMessageCustomer(question)
									if(!messageCustomer.ok){
										payload.context.errors.push({id:301,message:messageCustomer.message})
									}
									await omnibox.afterSendMessageCustomer(question)
									break
								}
								case 'watson':{
									console.log(payload.input.text)
									payload = await watson.sendMessageFacebookV1(payload)
									console.log(payload.output.text)
									await watson.afterSendMessageFacebookV1(payload)
									await watson.handleActionsFacebookV1(payload)
								}
							}

							/* Errors */

							//console.log(`\nErrors:\n${JSON.stringify(payload.context.errors,null,2)}`)
							for(const error of payload.context.errors){
								console.error(error)
								await utils.sendMessageTextWithTypingFacebook(senderId,[error.message])
							}

							/* After errors */

							let i = 0
							while(i < payload.context.errors.length){
								const error = payload.context.errors[i++]
								if([200,201,202,203,204].indexOf(error.id) > -1){
									const payloadSurvey = utils.cloneVariable(payload)
									await watson.startSurveyFacebookV1(payloadSurvey)
									break
								}
							}

							await utils.sendSenderActionTypingOffFacebook(senderId)
						}else if(entry.changes){
							const changes = entry.changes[0]
							switch(changes.field){
								case 'bio': break
								case 'birthday': break
								case 'conversations':{
									console.log(changes.value)
									break
								}
								case 'feed':{
									console.log(changes.value)
									//const items = ['comment','reaction']
									//if(items.indexOf(changes.value.item) >= 0){
									//console.log(changes)
									//console.log(changes.value)
									//console.log(changes.value.comment_id)
									//await utils.sendPrivateRepliesFacebook(changes.value.comment_id,'gracias por tu comentario')
									//await utils.sendMessageTextFacebook(changes.value.from.id,'gracias por tu comentario')
									//}
									break
								}
								case 'mention':{
									console.log(changes.value)
									break
								}
							}
						}else{
							console.log('Unknown entry')
							console.log(entry)
						}
					}
					break
				}
				case 'user':{
					console.log(req.body)
					break
				}
				default:{
					console.log(req.body)
				}
			}
		}catch(err){
			console.error('Error at app.post /facebook/receive')
			console.error(err)
			/* eslint-disable no-undef */
			if(typeof(senderId) !== 'undefined'){
				await utils.sendMessageTextWithTypingFacebook(senderId,['Disculpa pero por motivos técnicos no he podido responder tu consulta. Por favor intenta nuevamente.'])
			}
			/* eslint-enable no-undef */
		}
	})

	// AssistantV2
	app.post('/facebook/receive2',async (req,res) => {
		try{
			if(req.body.object === 'page'){
				let payload = {context:{skills:{'main skill':{user_defined:{}}}}}
				let context = payload.context.skills['main skill'].user_defined
				context.channel_id = 2
				context.handover = 'watson'
				const messaging_events = req.body.entry[0].messaging

				let i = 0
				while(i < messaging_events.length){
					const event = messaging_events[i++]
					let text = null
					if(event.message && event.message.text){
						text = event.message.text.replace(/\n/g,'')
					}else if(event.postback){
						text = event.postback.payload
					}else{
						res.sendStatus(200)
						break
					}
					payload.input = {
						message_type: 'text',
						text,
						options: {
							return_context: true
						}
					}
					//console.log(event.sender.id);
					//console.log(payload.input);

					const sessionFacebook = await facebook.getSession(event.sender.id)
					if(sessionFacebook) context = sessionFacebook
					context.senderId = event.sender.id
					context.user_json = event
					context.userAgent = req.headers['user-agent']
					context.publicIp = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(',')[0]
					context.errors = []
					console.log(JSON.stringify(payload,null,2))

					payload = await watson.sendMessageFacebookV2(payload)
					//console.log(payload);
					await watson.afterSendMessageFacebookV2(payload)
					res.sendStatus(200)
					break
				}
			}
		}catch(err){
			console.error(err)
			res.sendStatus(200)
		}
	})
}