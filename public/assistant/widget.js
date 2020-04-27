const W = {}
W.chat = document.getElementById('demo-conversation')

/* Functions */

W.config = {
	local: 'http://localhost:4000',
	dev: 'https://clarosoportebot.mybluemix.net',
	uat: 'https://clarosoportebot.mybluemix.net',
	prd: 'https://clarosoportebot.mybluemix.net',
}
W.env = W.chat.getAttribute('env')
//eslint-disable-next-line no-undef
const socket = io(W.config[W.env])
const CDN_IMAGE_URL='https://cdn.sexoseguro.pe'
const CDN_VIDEO_URL='https://facebook.com/seseguroperu'

W.DOM = {
	userMessage: (content) => {
		const el = document.createElement('div')
		const time = document.createElement('div')
		const message = document.createElement('div')

		el.className = 'cuerpopregunta'
		time.className = 'horapregunta'
		message.className = 'respuestausuarioch'

		time.appendChild(document.createTextNode(W.utils.getTime()))
		message.appendChild(document.createTextNode(content))
		el.append(time,message)
		return el
	},
	separator: () => {
		const sep = document.createElement('div')
		sep.className ='separacionchat'
		return sep
	},
	AVMessage: (content) => {
		const elem = document.createElement('div')

		const AV = document.createElement('div')
		AV.className = 'AV'

		const time = document.createElement('span')
		time.className = 'horach'
		time.appendChild(document.createTextNode(W.utils.getTime()))

		const message = document.createElement('div')
		message.className = 'respuestaAV'
		message.innerHTML = content

		AV.append(document.createTextNode('Clarita'),time)
		elem.append(AV,message)
		return elem
	},
	AVMessageWithImage: (content,url) => {
		const elem = document.createElement('div')
		const message = W.DOM.AVMessage(content)

		const image = document.createElement('div')
		image.className = 'imageWatson'
		image.innerHTML =
			`<a href="${url}" target="_blank" rel="nofollow">
				<img src="${url}" alt="imagen" style="max-height:250px;max-width:250px;margin-top:5px,margin-bottom:5px" />
			</a>`

		elem.append(message,image)
		return elem
	},
	AVMessageWithQuickReplies: (content,quickReplies) => {
		const elem = document.createElement('div')
		const message = W.DOM.AVMessage(content)

		const optionsQR = document.createElement('div')
		optionsQR.className = 'quickReplies'
		const optionsQRScroll = document.createElement('div')
		optionsQRScroll.className = 'quickRepliesScroll'
		optionsQRScroll.append(optionsQR)
		//console.log(quickReplies)
		quickReplies.forEach((e) => {
			const option = document.createElement('div')
			option.className = 'replyOption'
			option.innerHTML = e
			optionsQR.append(option)
		})

		elem.append(message,optionsQRScroll)
		return elem
	},
	AVMessageWithVideo: (content,url,height,width) => {
		const elem = document.createElement('div')
		const message = W.DOM.AVMessage(content)

		const urlEncoded = encodeURIComponent(url)
		const video = document.createElement('div')
		video.className = 'iframeVideo'
		video.innerHTML =
			`<iframe
				src="https://www.facebook.com/plugins/video.php?href=${urlEncoded}%2F&show_text=0"
				height="${height}"
				width="${width}"
				style="border:none;overflow:hidden"
				scrolling="no"
				frameborder="0"
				allowTransparency="true"
				allowFullScreen="true"
			>
			</iframe>`

		elem.append(message,video)
		return elem
	},
	AVMessageWithTemplateGeneric: (content,elements) => {
		//console.log(elements)

		const elem = document.createElement('div')
		const message = W.DOM.AVMessage(content)

		const selectList = document.createElement('select')
		selectList.className = 'departmentsSelect'

		for(let i = 0; i < elements.length; i++){
			const option = document.createElement('option')
			option.value = elements[i]
			option.text = elements[i]
			selectList.appendChild(option)
		}

		elem.append(message,selectList)
		return elem
	}
}
W.toggleChat = () => {
	W.chat.style = ''
	if(W.open){
		W.chat.classList.remove('w-bounceInUp')
		W.chat.classList.add('w-bounceOutDown')
		setTimeout(() => W.chat.style = 'display:none;',1000)
	}else{
		W.chat.classList.remove('w-bounceOutDown')
		W.chat.classList.add('w-bounceInUp')
		setTimeout(() => W.chat.style = 'display:inherit;',1000)
		startConversation()
	}
	W.open = !W.open
}
W.utils = {
	getTime: (date = null) => {
		if(!date) date = new Date()
		if(typeof date !== 'object') console.error('Variable "date" no es un objecto!')
		const addZero = (i) => {
			if(i < 10) i = `0${i}`
			return i
		}
		return `${addZero(date.getHours())}:${addZero(date.getMinutes())}`
	},
	loader: (status = true) => {
		W.loader.className = (status) ? 'loader-on' : 'loader-off'
	}
}

/* Chat */

W.chat.className = 'w-animated cuerpochat'
W.chat.style = 'display:none;'
W.chat.innerHTML = '\
	<div class="cabecerachat">\
		<img src="/img/claro2.png" class="displaychat logo" />\
		<div class="IANombre">Clarita</div>\
		<img src="/img/close.png" class="botonclosechat" />\
	</div>\
	<div id="loader" class="loader-on"></div>\
	<div class="cuerporespuesta scrollbar" id="scrollAV"></div>\
	<div class="inline">\
		<div id="mensajechat" class="enviarmensajeAV" contenteditable="true"></div>\
		<div id="enviar-chat">\
			<button type="button"><img src="/img/send-button.svg"/></button>\
		</div>\
	</div>'
W.open = false
W.chat.querySelector('.cabecerachat').addEventListener('click',() => W.toggleChat())

W.triggers = document.getElementsByClassName(W.chat.getAttribute('trigger'))
for(let i = 0;i < W.triggers.length;i++){
	W.triggers[i].addEventListener('click',() => W.toggleChat())
}

W.input = W.chat.querySelector('#mensajechat')
W.enviarChat = W.chat.querySelector('#enviar-chat button')
W.body = W.chat.querySelector('#scrollAV')
W.loader = W.chat.querySelector('#loader')

W.context = {}
W.sendOptionMessage = (e) => {
	W.body.querySelectorAll('.quickRepliesScroll').forEach((e) => e.remove())
	W.sendMessageWatson(e.target ? e.target.innerHTML : e.toUpperCase())
	document.getElementById('mensajechat').focus()
}
W.sendMessageWatson = (message) => {
	W.body.append(W.DOM.separator(),W.DOM.userMessage(message))
	W.body.scrollTop = W.body.scrollHeight
	W.api(message,(res) => {
		//console.log(res)
		let i = 0
		switch(res.output.action){
			case 'ACTION_handover':{
				while(i < res.output.text.length){
					W.receiveMessage(res.output.text[i++])
				}
				W.context = res.context
				if(!W.context.errors.length){
					const p = {
						user_id: W.context.user.id,
						conversation_id: W.context.conversation_id
					}
					socket.emit('start-conversation',p)
				}
				break
			}
			case 'ACTION_start_survey':{
				while(i < res.output.text.length){
					W.receiveMessage(res.output.text[i++])
				}
				if(res.context.survey){
					const survey = res.context.survey
					i = 0
					while(i < survey.output.text.length){
						if(i === (survey.output.text.length - 1)){
							W.receiveQuickReplies(survey.output.text[i++],survey.output.quick_replies)
						}else{
							W.receiveMessage(survey.output.text[i++])
						}
					}
					W.context = survey.context
				}else{
					W.context = res.context
				}
				break
			}
			/*case 'ACTION_show_image':{//eliminar
				while(i < res.output.text.length){
					if(i === (res.output.text.length - 1)){
						W.receiveImage(res.output.text[i++],res.output.image.url)
					}else{
						W.receiveMessage(res.output.text[i++])
					}
				}
				W.context = res.context
				break
			}*/
			case 'ACTION_show_video':{
				while(i < res.output.text.length){
					if(i === (res.output.text.length - 1)){
						W.receiveVideo(res.output.text[i++],`${CDN_VIDEO_URL}/${res.output.video.url}`,res.output.video.height,res.output.video.width)
					}else{
						W.receiveMessage(res.output.text[i++])
					}
				}
				W.context = res.context
				break
			}
			/*case 'ACTION_show_quick_replies':{//eliminar
				while(i < res.output.text.length){
					if(i === (res.output.text.length - 1)){
						W.receiveQuickReplies(res.output.text[i++],res.output.quick_replies)
					}else{
						W.receiveMessage(res.output.text[i++])
					}
				}
				W.context = res.context
				break
			}*/
			case 'ACTION_show_template_generic':{
				while(i < res.output.text.length){
					if(i === (res.output.text.length - 1)){
						W.receiveTemplateGeneric(res.output.text[i++],res.output.elements_web)
					}else{
						W.receiveMessage(res.output.text[i++])
					}
				}
				W.context = res.context
				break
			}
			default:{
				/*while(i < res.output.text.length){
					W.receiveMessage(res.output.text[i++])
				}*/
				const generic = res.output.generic
				let i = 0
				while(i < generic.length){
					switch(generic[i].response_type){
						case 'text':{
							let j = 0
							const text = generic[i].text.split('\n')
							while(j < text.length){
								W.receiveMessage(text[j++])
							}
							break
						}
						case 'image':{
							W.receiveImage('',`${CDN_IMAGE_URL}/${generic[i].source}`)
							break
						}
						case 'option':{
							const quickReplies = generic[i].options.map((e) => e.label)
							W.receiveQuickReplies(generic[i].title,quickReplies)
							break
						}
					}
					i++
				}
				W.context = res.context
			}
		}
		W.context.errors.forEach((e) => {
			console.error(e)
			W.receiveMessage(e.message)

			if(W.context.survey){
				const survey = res.context.survey
				const generic = survey.output.generic
				let i = 0
				while(i < generic.length){
					switch(generic[i].response_type){
						case 'text':{
							let j = 0
							const text = generic[i].text.split('\n')
							while(j < text.length){
								W.receiveMessage(text[j++])
							}
							break
						}
						case 'option':{
							const quickReplies = generic[i].options.map((e) => e.label)
							W.receiveQuickReplies(generic[i].title,quickReplies)
							break
						}
					}
					i++
				}
				W.context = survey.context
			}
		})
	})
	//console.log(W.context.handover)
}
W.sendMessageAdviser = (message) => {
	W.body.append(W.DOM.separator(),W.DOM.userMessage(message))
	W.body.scrollTop = W.body.scrollHeight

	const question = {
		channel_id: parseInt(W.context.channel_id),
		user_id: W.context.user.id,
		user_text: message,
		conversation_id: W.context.conversation_id,
		watson_conversation_id: W.context.conversation_id
	}
	//console.log(question)
	socket.emit('send-message-customer',question)
	//console.log(W.context.handover)
}
W.receiveMessage = (message) => {
	W.body.append(W.DOM.separator(),W.DOM.AVMessage(message))
	W.body.scrollTop = W.body.scrollHeight
}
W.receiveImage = (message,url) => {
	W.body.append(W.DOM.separator(),W.DOM.AVMessageWithImage(message,url))
	//console.log(W.body.scrollHeight)
	//setTimeout(function(){},2500)
	W.body.scrollTop = W.body.scrollHeight
}
W.receiveQuickReplies = (message,elements) => {
	//console.log('elements: '+elements)
	W.body.append(W.DOM.separator(),W.DOM.AVMessageWithQuickReplies(message,elements))
	W.body.scrollTop = W.body.scrollHeight
	W.body.querySelectorAll('.replyOption').forEach((a) => {
		a.addEventListener('click',W.sendOptionMessage)
	})
}
W.receiveTemplateGeneric = (message,elements) => {
	W.body.append(W.DOM.separator(),W.DOM.AVMessageWithTemplateGeneric(message,elements))
	W.body.scrollTop = W.body.scrollHeight
	const lastSelect = W.body.querySelectorAll('.departmentsSelect')[W.body.querySelectorAll('.departmentsSelect').length-1]
	lastSelect.addEventListener('change',() => {
		const value = lastSelect[lastSelect.selectedIndex].value
		W.sendOptionMessage(value)
	})
}
W.receiveVideo = (message,url,height,width) => {
	W.body.append(W.DOM.separator(),W.DOM.AVMessageWithVideo(message,url,height,width))
	W.body.scrollTop = W.body.scrollHeight
}
W.input.addEventListener('keydown',(e) => {
	switch(e.key){
		case ' ':{
			if(e.target.innerText.trim() === '') e.preventDefault()
			break
		}
		case 'Enter':{
			e.preventDefault()
			if(e.target.innerText.trim() !== ''){
				switch(W.context.handover){
					case 'adviser':
						W.sendMessageAdviser(W.input.innerText)
						W.input.innerText = ''
						break
					case 'watson':
						W.sendMessageWatson(W.input.innerText)
						W.input.innerText = ''
						break
				}
			}
			document.getElementById('mensajechat').focus()
			break
		}
	}
})
W.enviarChat.addEventListener('click',() => {
	if(W.input.innerText.trim() !== ''){
		switch(W.context.handover){
			case 'adviser':
				W.sendMessageAdviser(W.input.innerText)
				W.input.innerText = ''
				break
			case 'watson':
				W.sendMessageWatson(W.input.innerText)
				W.input.innerText = ''
				break
		}
	}
	document.getElementById('mensajechat').focus()
})
W.api = (message = '',callback) => {
	W.utils.loader(true)
	const x = new XMLHttpRequest()
	const url = `${W.config[W.env]}/web/receive`
	//console.log(`url: ${url}`)
	x.open('POST',url,true)
	x.setRequestHeader('Content-type','application/json')
	x.setRequestHeader('Authorization',W.chat.getAttribute('api-key'))
	x.send(JSON.stringify({input:{text:message},context:W.context}))
	x.onreadystatechange = () => {
		if(x.readyState === 4 && x.status === 200 && x.responseText){
			callback(JSON.parse(x.responseText))
			W.utils.loader(false)
		}
	}
}

if(localStorage.getItem('user_id')){
	W.context.user = {id:localStorage.getItem('user_id')}
}

let flag = true
//eslint-disable-next-line no-unused-vars
const startConversation = () => {
	if(flag){
		W.context.handover = 'watson'
		W.api('hi',(res) => {
			let i = 0
			while(i < res.output.text.length){
				W.body.append(W.DOM.AVMessage(res.output.text[i++]))
				W.body.scrollTop = W.body.scrollHeight
			}
			W.context = res.context
			localStorage.setItem('user_id',W.context.user.id)
			W.context.errors.forEach((e) => {
				console.error(e)
				W.receiveMessage(e.message)
			})
			document.getElementById('mensajechat').focus()
		})
		flag = false
	}
}

/* Socket */

socket.on('send-message-adviser',(answer) => {
	//console.log(answer)
	W.receiveMessage(answer.user_text)
	W.context.handover = answer.handover
})

window.onbeforeunload = () => {
	const question = {
		channel_id: parseInt(W.context.channel_id),
		user_id: W.context.user.id,
		user_text: 'El usuario ha salido de la Web',
		conversation_id: W.context.conversation_id,
		watson_conversation_id: W.context.conversation_id
	}
	socket.emit('disconnect-customer',question)
}