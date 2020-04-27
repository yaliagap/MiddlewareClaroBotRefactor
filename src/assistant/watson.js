const env = process.env
const moment = require('moment')
const AssistantV1 = require('ibm-watson/assistant/v1')
const {Log} = require('../database/controllers')
const facebook = require('./facebook')
const utils = require('../utils/')
const chip = require('./chip');
const equipo = require('./equipo');
const sec = require('./sec');

const assistantV1 = new AssistantV1({
	username: env.ASSISTANT_USERNAME,
	password: env.ASSISTANT_PASSWORD,
	url: env.ASSISTANT_URL,
	version: env.ASSISTANT_VERSION
})

const f = {}
f.beforeSendMessageWebV1 = (payload) => {
	return new Promise(async (resolve,reject) => {
		try{
			resolve(payload)
		}catch(err){
			console.error(err)
			reject(err)
		}
	})
}
f.sendMessageWebV1 = (payload) => {
	return new Promise((resolve,reject) => {
		payload.workspace_id = env.WORKSPACE_ID
		let question = payload.input.text.toLowerCase();

		try{
			switch (question) {
				case (question.match(/\bhi\b|\bhola\b|menu|menú/)|| {}).input:
					payload.output = {"generic":[{"response_type":"text","text":"¡Hola! Soy Clarita, tu asistente virtual"},{"response_type":"text","text":"¿En qué puedo ayudarte el día de hoy?"},{"title":"Selecciona un tema o escribe tu consulta","options":[{"label":"Venta","value":{"input":{"text":"Venta"}}},{"label":"Postventa","value":{"input":{"text":"Postventa"}}},{"label":"Provisión","value":{"input":{"text":"Provisión"}}},{"label":"Portabilidad","value":{"input":{"text":"Portabilidad"}}}],"response_type":"option"}],"text":["¡Hola! Soy Clarita, tu asistente virtual","¿En qué puedo ayudarte el día de hoy?"]};
					payload.context.main = "chitchat";
					payload.context.submain = "saludo";
					payload.context.detail = "";
					payload.context.understanding = true;
					break;
				case (question.match(/\bgracia\b|\bgracias\b/)|| {}).input:
					payload.output = {"generic":[{"response_type":"text","text":"Muchas gracias a ti."}],"text":["Muchas gracias a ti."]};
					payload.context.main = "chitchat";
					payload.context.submain = "agradecimiento";
					payload.context.detail = "";
					payload.context.understanding = true;
					break;
				case (question.match(/\badios\b|\badiós\b|bye|chau|chao/)|| {}).input:
					payload.output = {"generic":[{"response_type":"text","text":"Hasta pronto, que tengas un buen día"}],"text":["Hasta pronto, que tengas un buen día"]};
					payload.context.main = "chitchat";
					payload.context.submain = "despedida";
					payload.context.detail = "";
					payload.context.understanding = true;
					break;
				case (question.match(/venta/)|| {}).input:
					console.log("Matched the 'test' substring");
					payload.output = {"generic":[{"title":"¿Qué tipo de acción deseas realizar?","options":[{"label":"Consulta","value":{"input":{"text":"Consulta"}}},{"label":"Transacción","value":{"input":{"text":"Transacción"}}}],"response_type":"option"}],"text":[]};    
					payload.context.main = "venta";
					payload.context.submain = "";
					payload.context.detail = "";
					payload.context.understanding = true;
					break;
				case (question.match(/((consultar|consulta)(.|\n)*chip)|(chip(.|\n)*(consultar|consulta))/)|| {}).input:
					payload.output = {"generic":[{"response_type":"text","text":"¡Perfecto! Te ayudaré con la consulta de disponibilidad del chip"},{"response_type":"text","text":"Ingresa el número de chip a consultar"}],"text":["¡Perfecto! Te ayudaré con la consulta de disponibilidad del chip","Ingresa el número de chip a consultar"]};
					payload.context.main = "venta";
					payload.context.submain = "chip";
					payload.context.detail = "consulta disponibilidad";
					payload.context.understanding = true;
					break;
				case (question.match(/((consultar|consulta)(.|\n)*equipo)|(equipo(.|\n)*(consultar|consulta))/)|| {}).input:
					payload.output = {"generic":[{"response_type":"text","text":"¡Perfecto! Te ayudaré con la consulta de disponibilidad del equipo"},{"response_type":"text","text":"Ingresa el codigo IMEI"}],"text":["¡Perfecto! Te ayudaré con la consulta de disponibilidad del equipo","Ingresa el codigo IMEI"]};
					payload.context.main = "venta";
					payload.context.submain = "equipo";
					payload.context.detail = "consulta disponibilidad";
					payload.context.understanding = true;
					break;
				case (question.match(/((anular|anulación|anulacion)(.|\n)*sec)|(sec(.|\n)*(anular|anulación|anulacion))/)|| {}).input:
					payload.output = {"generic":[{"response_type":"text","text":"¡Perfecto! Te ayudaré con la anulación de SEC"},{"response_type":"text","text":"Ingresa el número de SEC a anular"}],"text":["¡Perfecto! Te ayudaré con la anulación de SEC","Ingresa el número de SEC a anular"]};
					payload.context.main = "venta";
					payload.context.submain = "sec";
					payload.context.detail = "anulacion";
					payload.context.understanding = true;
					break;
				case (question.match(/sí|si/)|| {}).input:
					{
						switch(payload.context.submain){
							case 'sec':{
								if(payload.context.response){
									//let sec = question.match(/\b[0-9]{8,8}\b/)[0];
									switch(payload.context.response.status){
										case -2:
											break;
										case -1:
											payload.output = {"generic":[{"response_type":"text","text":"Esto puede demorar unos segundos..."},{"response_type":"text","text":"¡"+payload.context.response.message+"!"}],"text":["Esto puede demorar unos segundos...","¡"+payload.context.response.message+"!"]};
											break;
										case 0:
											payload.output = {"generic":[{"response_type":"text","text":"Esto puede demorar unos segundos..."},{"response_type":"text","text":"¡"+ payload.context.response.message+ "!"}],"text":["Esto puede demorar unos segundos...","¡"+payload.context.response.message+"!"]};
											break;
											
									}
									payload.context.response = null;
								}else{
									//let sec = question.match(/\b[0-9]{8,8}\b/)[0];
									payload.output = {"generic":[{"response_type":"text","text":"Esto puede demorar unos segundos..."}],"text":["Esto puede demorar unos segundos..."],"action_backend":"ACTION_ANULACION_SEC"};
									payload.context.main = "venta";
									payload.context.submain = "sec";
									payload.context.detail = "anulacion";
									payload.context.understanding = true;
									//payload.context.sec = sec;
								}
								break;
							}
						}	
						break;
					}
				case (question.match(/consulta|consultar/)|| {}).input:
					{
						switch(payload.context.main){
							case 'venta':{
								payload.output = {"generic":[{"response_type":"text","text":"¡Entendido! "},{"title":"Estas son las consultas en las que puedo ayudarte","options":[{"label":"Consultar chip","value":{"input":{"text":"Consultar chip"}}},{"label":"Consultar equipo","value":{"input":{"text":"Consultar equipo"}}}],"response_type":"option"}],"text":["¡Entendido! "]};
								payload.context.main = "venta";
								payload.context.submain = "";
								payload.context.detail = "";
								payload.context.understanding = true;
								break;
							}
						}
						break;
					}
				case (question.match(/transaccion|transacción|transacciones/)|| {}).input:
					{
						switch(payload.context.main){
							case 'venta':{
								payload.output = {"generic":[{"title":"Estas son las transacciones en las que puedo ayudarte","options":[{"label":"Anular SEC","value":{"input":{"text":"Anular SEC"}}},{"label":"Reactivar SEC","value":{"input":{"text":"Reactivar SEC"}}},{"label":"Liberar chip","value":{"input":{"text":"Liberar chip"}}},{"label":"Liberar equipo","value":{"input":{"text":"Liberar equipo"}}},{"label":"Limpiar SEC","value":{"input":{"text":"Limpiar SEC"}}}],"response_type":"option"}],"text":[]};
								payload.context.main = "venta";
								payload.context.submain = "";
								payload.context.detail = "";
								payload.context.understanding = true;
								break;
							}
						}
						break;
					}
				case (question.match(/\b[0-9]{8,8}\b/)|| {}).input:
					{
						switch(payload.context.submain){
							case 'sec':{
								if(payload.context.response){
									let sec = question.match(/\b[0-9]{8,8}\b/)[0];
									switch(payload.context.response.status){
										case -2:
											break;
										case -1:
											payload.output = {"generic":[{"response_type":"text","text":"Esto puede demorar unos segundos..."},{"response_type":"text","text":"¡"+payload.context.response.message+"!"}],"text":["Esto puede demorar unos segundos...","¡"+payload.context.response.message+"!"]};
											break;
										case 0:
											payload.output = {"generic":[{"response_type":"text","text":"Esto puede demorar unos segundos..."},{"response_type":"text","text":"¡"+payload.context.response.message+"!"}],"text":["Esto puede demorar unos segundos...","¡"+payload.context.response.message+"!"]};
											break;
											
									}
									payload.context.response = null;
								}else{
									let sec = question.match(/\b[0-9]{8,8}\b/)[0];
									payload.output = {"generic":[{"title":"¿Está seguro de proceder con la anulación del SEC "+sec+"?","options":[{"label":"Sí","value":{"input":{"text":"Sí"}}},{"label":"No","value":{"input":{"text":"No"}}}],"response_type":"option"}],"text":[]};
									payload.context.main = "venta";
									payload.context.submain = "sec";
									payload.context.detail = "anulacion";
									payload.context.understanding = true;
									payload.context.sec = sec;
								}
								break;
							}
						}	
						break;
					}
				case (question.match(/\b[0-9]{18,18}\b/)|| {}).input:
					{
						switch(payload.context.submain){
							case 'chip':{
								if(payload.context.response){
									let chip = question.match(/\b[0-9]{18,18}\b/)[0];
									switch(payload.context.response.status){
										case -2:
											break;
										case -1:
											break;
										case 0:
											{
												if(payload.context.response.data.fechaventa){
													payload.output = {"generic":[{"response_type":"text","text":"¡Entendido!  "},{"response_type":"text","text":"Un momento mientras consulto la disponibilidad del chip "+chip},{"response_type":"text","text":"El chip consultado tiene el estado de: "+payload.context.response.data.estado},{"response_type":"text","text":"Número: "+ payload.context.response.data.msisdn +"- Fecha de venta: "+payload.context.response.data.msisdn}],"text":["¡Entendido!  ","Un momento mientras consulto la disponibilidad del chip <span>895110022917568209</span>","El chip consultado tiene el estado de: VENDIDO","Número: 941928806 - Fecha de venta: 2020-04-15 12:20:00"]};
												}else{
													payload.output = {"generic":[{"response_type":"text","text":"¡Entendido!  "},{"response_type":"text","text":"Un momento mientras consulto la disponibilidad del chip "+chip},{"response_type":"text","text":"El chip consultado tiene el estado de: "+payload.context.response.data.estado}],"text":["¡Entendido!  ","Un momento mientras consulto la disponibilidad del chip <span>895110022917568208</span>","El chip consultado tiene el estado de: RESERVADO"]};
												
												}
												break;
											}
											
									}
									payload.context.response = null;
								}else{
									let chip = question.match(/\b[0-9]{18,18}\b/)[0];
									payload.output = {"generic":[{"response_type":"text","text":"¡Entendido!  "},{"response_type":"text","text":"Un momento mientras consulto la disponibilidad del chip "+chip}],"text":["¡Entendido!  ","Un momento mientras consulto la disponibilidad del chip "+chip],"action_backend":"ACTION_GET_INFO_CHIP"};
									payload.context.main = "venta";
									payload.context.submain = "chip";
									payload.context.detail = "consulta disponibilidad";
									payload.context.understanding = true;
									payload.context.chip = chip;
								}
								break;
							}
							case 'equipo':{
								if(payload.context.response){
									let imei = question.match(/\b[0-9]{18,18}\b/)[0];
									switch(payload.context.response.status){
										case -2:
											break;
										case -1:
											break;
										case 0:
											{
												if(payload.context.response.data.fechaventa){
													payload.output = {"generic":[{"response_type":"text","text":"¡Entendido!  "},{"response_type":"text","text":"Un momento mientras consulto la disponibilidad del equipo con IMEI "+imei},{"response_type":"text","text":"El equipo consultado tiene el estado de: "+payload.context.response.data.estado},{"response_type":"text","text":"Número: "+ payload.context.response.data.msisdn +"- Fecha de venta: "+payload.context.response.data.msisdn}],"text":["¡Entendido!  ","Un momento mientras consulto la disponibilidad del chip <span>895110022917568209</span>","El chip consultado tiene el estado de: VENDIDO","Número: 941928806 - Fecha de venta: 2020-04-15 12:20:00"]};
												}else{
													payload.output = {"generic":[{"response_type":"text","text":"¡Entendido!  "},{"response_type":"text","text":"Un momento mientras consulto la disponibilidad del equipo con IMEI "+imei},{"response_type":"text","text":"El equipo consultado tiene el estado de: "+payload.context.response.data.estado}],"text":["¡Entendido!  ","Un momento mientras consulto la disponibilidad del equipo con IMEI","El equipo consultado tiene el estado de: "+payload.context.response.data.estado]};
												
												}
												break;
											}
											
									}
									payload.context.response = null;
								}else{
									let imei = question.match(/\b[0-9]{18,18}\b/)[0];
									payload.output = {"generic":[{"response_type":"text","text":"¡Entendido!  "},{"response_type":"text","text":"Un momento mientras consulto la disponibilidad del equipo con IMEI "+imei}],"text":["¡Entendido!  ","Un momento mientras consulto la disponibilidad del equipo con IMEI "+imei],"action_backend":"ACTION_GET_INFO_EQUIPO"};
									payload.context.main = "venta";
									payload.context.submain = "equipo";
									payload.context.detail = "consulta disponibilidad";
									payload.context.understanding = true;
									payload.context.imei = imei;
								}
								break;
							}
						}	
						break;
					}
				default:
					console.log("Didn't match");
					payload.output = {"generic":[{"response_type":"text","text":"No le he entendido. Intente reformular la consulta."}],"text":["No le he entendido. Intente reformular la consulta."]};
					payload.context.main = "no_entiendo";
					payload.context.submain = "";
					payload.context.detail = "";
					payload.context.understanding = false;
					break;
			}
			resolve(payload);

		}catch(err){
			console.error(err)
			reject(err)
		}

		/*
		assistantV1.message(payload,async (err,res) => {
			try{
				if(err){
					console.error(err)
					res = utils.cloneVariable(payload)
					res.context.main = ''
					res.context.submain = ''
					res.context.detail = ''
					res.output = {text:[]}
					res.context.errors.push({id:100,message:'Lo siento, no hemos podido enviar tu mensaje. Por favor intenta nuevamente'})
				}
				console.log('Input: ',payload.input);
				console.log('Res: ',JSON.stringify(res));
				resolve(res)
				
			}catch(err){
				console.error(err)
				reject(err)
			}
		})
		*/
		
	})
}
f.afterSendMessageWebV1 = (payload) => {
	return new Promise(async (resolve,reject) => {
		try{
			const context = payload.context
			/* Log */
			let log = {}

			log.channel_id = context.channel_id;
			log.user_json = payload.input;
			log.user_text = payload.input.text;
			log.user_id = context.user.id

			log.watson_json = payload
			if(typeof(context.conversation_id) === 'undefined'){
				log.watson_conversation_id = '00000000-0000-0000-0000-000000000000'
			}else{
				log.watson_conversation_id = context.conversation_id
			}

			log.watson_text = payload.output.text.join(' ')

			if(payload.intents && payload.intents.length){
				log.watson_intent_name = payload.intents[0].intent
				log.watson_intent_confidence = payload.intents[0].confidence.toFixed(4)
			}

			log.user_agent = context.user_agent
			log.public_ip = context.public_ip

			log.utc_offset = '-05:00'

			log.main = context.main;
			log.submain = context.submain;
			log.detail = context.detail;
			log.understanding = context.understanding;

			log = await Log.create(log)
			console.log('LOG CREADO: ',log);
			/*	
			log = log[0].dataValues
			payload.context.log = {
				id: log.id,
				user_id: log.user_id,
				utc_offset: log.utc_offset,
				created_at: log.created_at
			}
			*/
			console.log('Log was created')

			resolve(payload)
		}catch(err){
			console.error(err)
			reject(err)
		}
	})
}
f.handleActionsWebV1 = (payload) => {
	return new Promise(async (resolve,reject) => {
		try{
			const context = payload.context
			switch(payload.output.action_backend){
				case 'ACTION_GET_INFO_EQUIPO':{

					const info_equipo = await equipo.getDeviceAvailability(context.imei)
					
					
					console.log('Info Equipo: ', info_equipo);

					payload.context.response = JSON.parse(info_equipo);

					payload = await f.sendMessageWebV1(payload);
					await f.afterSendMessageWebV1(payload);
					console.log("Payload: ",payload)
					break;
				}

				case 'ACTION_GET_INFO_CHIP':{

					const info_chip = await chip.getChipAvailability(context.chip)
					
					
					console.log('Info chip: ', info_chip);

					payload.context.response = JSON.parse(info_chip);

					payload = await f.sendMessageWebV1(payload);
					await f.afterSendMessageWebV1(payload);
					console.log("Payload: ",payload)
					break;
				}

				case 'ACTION_ANULACION_SEC':{

					const info_sec = await sec.cancelSec(context.sec)
					
					
					console.log('Info SEC: ', info_sec);

					payload.context.response = info_sec;

					payload = await f.sendMessageWebV1(payload);
					await f.afterSendMessageWebV1(payload);
					console.log("Payload: ",payload)
					break;
				}
			}
			resolve(payload)
		}catch(err){
			console.error('Error at handleActionsWebV1')
			console.error(err)
			reject(err)
		}
	})
}
f.startSurveyWebV1 = (payload) => {
	return new Promise(async (resolve,reject) => {
		try{
			const survey = await Survey.findByUserId(payload.context.user.id)
			if(!survey){
				delete payload.intents
				delete payload.entities
				delete payload.output
				delete payload.context.system
				payload.input = {text:'encuesta'}
				console.log(payload.input.text)
				payload = await f.sendMessageWebV1(payload)
				console.log(payload.output.text)
				await f.afterSendMessageWebV1(payload)
				resolve(payload)
			}
			resolve(false)
		}catch(err){
			console.error(err)
			reject(err)
		}
	})
}
f.beforeSendMessageFacebookV1 = (payload) => {
	return new Promise(async (resolve,reject) => {
		try{
			resolve(payload)
		}catch(err){
			console.error(err)
			reject(err)
		}
	})
}
f.sendMessageFacebookV1 = (payload) => {
	return new Promise((resolve,reject) => {
		payload.workspace_id = env.WORKSPACE_ID
		assistantV1.message(payload,(err,res) => {
			try{
				if(err){
					console.error(err)
					res = utils.cloneVariable(payload)
					res.context.main = ''
					res.context.submain = ''
					res.context.detail = ''
					res.output = {text:[]}
					res.context.errors.push({id:100,message:'Lo siento, no hemos podido enviar tu mensaje. Por favor intenta nuevamente'})
				}
				resolve(res)
			}catch(err){
				console.error(err)
				reject(err)
			}
		})
	})
}
f.afterSendMessageFacebookV1 = (payload) => {
	return new Promise(async (resolve,reject) => {
		try{
			const context = payload.context
			/* Log */
			let log = {}

			log.channel_id = context.channel_id

			const category = await Category.findByName(context.main)
			log.category_id = category.ok ? category.data.dataValues.id : 1
			const subcategory = await Subcategory.findByName(context.submain)
			log.subcategory_id = subcategory.ok ? subcategory.data.dataValues.id : 1
			const detail = await Detail.findByName(context.detail)
			log.detail_id = detail.ok ? detail.data.dataValues.id : 1

			log.user_json = context.user_json
			log.user_text = payload.input.text
			log.user_id = context.user.id
			log.user_first_name = context.user.first_name
			log.user_last_name = context.user.last_name
			log.user_profile_pic = context.user.profile_pic

			log.watson_json = payload
			if(typeof(context.conversation_id) === 'undefined'){
				log.watson_conversation_id = '00000000-0000-0000-0000-000000000000'
			}else{
				log.watson_conversation_id = context.conversation_id
			}
			log.watson_text = payload.output.text.join(' ')
			if(payload.intents && payload.intents.length){
				log.watson_intent_name = payload.intents[0].intent
				log.watson_intent_confidence = payload.intents[0].confidence
			}

			log.user_agent = context.user_agent
			log.public_ip = context.public_ip

			log.utc_offset = '-05:00'

			log = await Log.create(log)
			log = log[0].dataValues
			payload.context.log = {
				id: log.id,
				user_id: log.user_id,
				utc_offset: log.utc_offset,
				created_at: log.created_at
			}
			console.log('Log was created')

			resolve(payload)
		}catch(err){
			console.error(err)
			reject(err)
		}
	})
}
f.handleActionsFacebookV1 = (payload) => {
	return new Promise(async (resolve,reject) => {
		try{
			const context = payload.context
			const userId = context.user.id
			const output = payload.output
			switch(output.action){
				case 'ACTION_create_survey':{
					await utils.sendMessageTextWithTypingFacebook(userId,output.text)
					const survey = {
						channel_id: context.channel_id,
						conversation_id: context.conversation_id,
						user_id: context.user.id,
						sex: context.survey.sex,
						age: context.survey.age,
						department: context.survey.department
					}
					await Survey.create(survey)
					break
				}
				case 'ACTION_handover':{
					await utils.sendMessageTextWithTypingFacebook(userId,output.text)
					const logs = await Log.findByConversationIdForOmnibox(context.conversation_id)
					const p = {
						conversation_id: logs[0].conversation_id,
						channel_id: logs[0].channel_id,
						user_id: logs[0].user_id,
						user_first_name: logs[0].user_first_name,
						user_last_name: logs[0].user_last_name,
						messages: logs.map((e) => {
							const created_at = moment
								.utc(e.created_at,'YYYY-MM-DDTHH:mm:ss.SSSZ')
								.utcOffset(e.utc_offset).format('YYYY-MM-DD HH:mm:ss')
							return {
								type: e.type,
								text: e.text,
								created_at
							}
						})
					}
					try{
						const res = await omnibox.handover(p)
						console.log(res)
						if(res.ok){
							payload.context.handover = 'adviser'
						}else{
							payload.context.errors.push({id:parseInt(res.id),message:res.message})
							await Log.update({watson_json:payload},{id:context.log.id})
						}
					}catch(err){
						console.error('Error at handleActionsFacebookV1 - ACTION_handover')
						console.error(err)
						payload.context.errors.push({id:200,message:'Disculpe no podemos transferirlo por el momento a una orientadora'})
						await Log.update({watson_json:payload},{id:context.log.id})
					}
					break
				}
				case 'ACTION_show_image':{
					await utils.sendMessageTextWithTypingFacebook(userId,output.text)
					await utils.sendSenderActionTypingOnFacebook(userId)
					await utils.sendMessageAttachmentImageFromURLWithoutReausableFacebook(userId,output.image.url)
					break
				}
				case 'ACTION_show_video':{
					await utils.sendMessageTextWithTypingFacebook(userId,output.text)
					await utils.sendSenderActionTypingOnFacebook(userId)
					await utils.sendMessageAttachmentTemplateOpenGraphFacebook(userId,output.video.elements)
					break
				}
				case 'ACTION_show_quick_replies':{
					let i = 0
					while(i < output.text.length){
						await utils.sendSenderActionTypingOnFacebook(userId)
						if(i === (output.text.length - 1)){
							await utils.sendMessageTextQuickRepliesFacebook(userId,{
								text: output.text[i++],
								quick_replies: output.quick_replies
							})
						}else{
							await utils.sendMessageTextFacebook(userId,output.text[i++])
						}
					}
					break
				}
				case 'ACTION_show_template_generic':{
					await utils.sendMessageTextWithTypingFacebook(userId,output.text)
					await utils.sendSenderActionTypingOnFacebook(userId)
					await utils.sendMessageAttachmentTemplateGenericFacebook(userId,output.elements_facebook)
					break
				}
				case 'ACTION_start_survey':{
					await utils.sendMessageTextWithTypingFacebook(userId,output.text)
					const payloadSurvey = utils.cloneVariable(payload)
					payload = await f.startSurveyFacebookV1(payloadSurvey)
					break
				}
				default:{
					await utils.sendMessageTextWithTypingFacebook(userId,output.text)
				}
			}

			/* Session */
			const p = {
				user_id: context.log.user_id,
				context: payload.context,
				utc_offset: context.log.utc_offset,
				created_at: context.log.created_at
			}
			await facebook.createOrUpdateSession(p)
			resolve(payload)
		}catch(err){
			console.error('Error at handleActionsFacebookV1')
			console.error(err)
			reject(err)
		}
	})
}
f.startSurveyFacebookV1 = (payload) => {
	return new Promise(async (resolve,reject) => {
		try{
			const survey = await Survey.findByUserId(payload.context.user.id)
			if(!survey){
				delete payload.intents
				delete payload.entities
				delete payload.output
				delete payload.context.system
				payload.input = {text:'encuesta'}
				console.log(payload.input)
				payload = await f.sendMessageFacebookV1(payload)
				console.log(payload.output.text)
				await f.afterSendMessageFacebookV1(payload)
				await f.handleActionsFacebookV1(payload)
			}
			resolve(payload)
		}catch(err){
			console.error(err)
			reject(err)
		}
	})
}

module.exports = f