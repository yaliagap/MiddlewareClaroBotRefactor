const env = process.env
const request = require('request')

const f = {}
f.getPropertiesFacebook = async () => {
	try{
		console.log(await f.getGetStartedPropertyFacebook())
		console.log(await f.getPersistentMenuPropertyFacebook())
		console.log(await f.getWhitelistedDomainsPropertyFacebook())
	}catch(err){
		console.error(err)
	}
}
f.enablePropertiesFacebook = async () => {
	try{
		await f.enableGetStartedPropertyFacebook('hi')
		await f.enableWhiteListedDomainsPropertyFacebook([
			'https://www.apropo.org.pe',
			'https://sexoseguro.pe'
		])
		await f.enablePersistentMenuPropertyFacebook([
			{
				type: 'postback',
				title: '👂 Derivar con Asesor',
				payload: 'asesor'
			},
			{
				type: 'postback',
				title: '🤳 Regresar con Asistente',
				payload: 'asistente'
			},
			{
				type: 'nested',
				title: 'Más',
				call_to_actions: [
					{
						type: 'postback',
						title: '👀 Quiero información',
						payload: 'quiero información'
					},
					{
						type: 'postback',
						title: '❤️‍ Efectos secundarios',
						payload: 'efectos secundarios'
					},
					{
						type: 'web_url',
						title: '🌎 Apropo',
						url: 'http://www.apropo.org.pe',
						webview_height_ratio: 'full'
					},
					{
						type: 'web_url',
						title: '🌎 Sexo Seguro',
						url: 'https://www.sexoseguro.pe',
						webview_height_ratio: 'full'
					}
				]
			}
		])
	}catch(err){
		console.error(err)
	}
}
f.disablePropertiesFacebook = async () => {
	try{
		await f.disablePersistentMenuPropertyFacebook()
		await f.disableGetStartedPropertyFacebook()
		await f.disableWhiteListedDomainsPropertyFacebook()
	}catch(err){
		console.error(err)
	}
}
f.getUserFacebook = (id) => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/${id}`,
			qs: {
				fields: 'id,first_name,last_name,profile_pic',
				access_token: env.FB_ACCESS_TOKEN
			},
			method: 'GET',
			timeout: 10000
		},(err,res,body) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(JSON.parse(body))
		})
	})
}
f.sendSenderActionMarkSeenFacebook = (recipientId) => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/me/messages`,
			qs: {access_token:env.FB_ACCESS_TOKEN},
			method: 'POST',
			json: {
				recipient: {id:recipientId},
				sender_action: 'mark_seen'
			},
			timeout: 10000
		},(err,res) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(res)
		})
	})
}
f.sendSenderActionTypingOnFacebook = (recipientId) => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/me/messages`,
			qs: {access_token:env.FB_ACCESS_TOKEN},
			method: 'POST',
			json: {
				recipient: {id:recipientId},
				sender_action: 'typing_on'
			},
			timeout: 10000
		},(err,res) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(res)
		})
	})
}
f.sendSenderActionTypingOffFacebook = (recipientId) => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/me/messages`,
			qs: {access_token:env.FB_ACCESS_TOKEN},
			method: 'POST',
			json: {
				recipient: {id:recipientId},
				sender_action: 'typing_off'
			},
			timeout: 10000
		},(err,res) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(res)
		})
	})
}
f.sendMessageTextFacebook = (recipientId,messageText) => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/me/messages`,
			qs: {access_token:env.FB_ACCESS_TOKEN},
			method: 'POST',
			json: {
				recipient: {id:recipientId},
				message: {text:messageText}
			},
			timeout: 10000
		},(err,res) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(res)
		})
	})
}
f.sendMessageTextWithTypingFacebook = async (recipientId,messages) => {
	try{
		for(const message of messages){
			await f.sendSenderActionTypingOnFacebook(recipientId)
			await f.sendMessageTextFacebook(recipientId,message)
		}
	}catch(err){
		console.error(err)
	}
}
f.sendMessageTextQuickRepliesFacebook = (recipientId,message) => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/me/messages`,
			qs: {access_token:env.FB_ACCESS_TOKEN},
			method: 'POST',
			json: {
				recipient: {id:recipientId},
				message: {
					text: message.text,
					quick_replies: message.quick_replies
				}
			},
			timeout: 10000
		},(err,res) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(res)
		})
	})
}
f.sendMessageTextQuickRepliesLocationFacebook = (recipientId,messageText) => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/me/messages`,
			qs: {access_token:env.FB_ACCESS_TOKEN},
			method: 'POST',
			json: {
				recipient: {id:recipientId},
				message: {
					text: messageText,
					quick_replies: [{
						content_type: 'location'
					}]
				}
			},
			timeout: 10000
		},(err,res) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(res)
		})
	})
}
f.sendMessageAttachmentAudioFacebook = (recipientId,payload) => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/me/messages`,
			qs: {access_token:env.FB_ACCESS_TOKEN},
			method: 'POST',
			json: {
				recipient: {id:recipientId},
				message: {
					attachment: {
						type: 'audio',
						payload
					}
				}
			},
			timeout: 10000
		},(err,res) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(res)
		})
	})
}
f.sendMessageAttachmentFileFacebook = (recipientId,payload) => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/me/messages`,
			qs: {access_token:env.FB_ACCESS_TOKEN},
			method: 'POST',
			json: {
				recipient: {id:recipientId},
				message: {
					attachment: {
						type: 'file',
						payload
					}
				}
			},
			timeout: 10000
		},(err,res) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(res)
		})
	})
}
f.sendMessageAttachmentImageFacebook = (recipientId,payload) => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/me/messages`,
			qs: {access_token:env.FB_ACCESS_TOKEN},
			method: 'POST',
			json: {
				recipient: {id:recipientId},
				message: {
					attachment: {
						type: 'image',
						payload
					}
				}
			},
			timeout: 10000
		},(err,res) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(res)
		})
	})
}
f.sendMessageAttachmentImageFromURLWithReausableFacebook = (recipientId,url) => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/me/messages`,
			qs: {access_token:env.FB_ACCESS_TOKEN},
			method: 'POST',
			json: {
				recipient: {id:recipientId},
				message: {
					attachment: {
						type: 'image',
						payload: {
							url,
							is_reusable: true
						}
					}
				}
			},
			timeout: 10000
		},(err,res) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(res)
		})
	})
}
f.sendMessageAttachmentImageFromURLWithoutReausableFacebook = (recipientId,url) => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/me/messages`,
			qs: {access_token:env.FB_ACCESS_TOKEN},
			method: 'POST',
			json: {
				recipient: {id:recipientId},
				message: {
					attachment: {
						type: 'image',
						payload: {
							url,
							is_reusable: false
						}
					}
				}
			},
			timeout: 10000
		},(err,res) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(res)
		})
	})
}
f.sendMessageAttachmentImageFromAttachmentIdFacebook = (recipientId,attachment_id) => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/me/messages`,
			qs: {access_token:env.FB_ACCESS_TOKEN},
			method: 'POST',
			json: {
				recipient: {id:recipientId},
				message: {
					attachment: {
						type: 'image',
						payload: {attachment_id}
					}
				}
			},
			timeout: 10000
		},(err,res) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(res)
		})
	})
}
f.sendMessageAttachmentVideoFacebook = (recipientId,payload) => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/me/messages`,
			qs: {access_token:env.FB_ACCESS_TOKEN},
			method: 'POST',
			json: {
				recipient: {id:recipientId},
				message: {
					attachment: {
						type: 'video',
						payload
					}
				}
			},
			timeout: 10000
		},(err,res) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(res)
		})
	})
}
f.uploadImageFacebook = (recipientId,url) => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/me/message_attachments`,
			qs: {access_token:env.FB_ACCESS_TOKEN},
			method: 'POST',
			json: {
				recipient: {id:recipientId},
				message: {
					attachment: {
						type: 'image',
						payload: {
							is_reusable: true,
							url
						}
					}
				}
			},
			timeout: 10000
		},(err,res) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(res)
		})
	})
}
f.uploadVideoFacebook = (recipientId,url) => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/me/message_attachments`,
			qs: {access_token:env.FB_ACCESS_TOKEN},
			method: 'POST',
			json: {
				recipient: {id:recipientId},
				message: {
					attachment: {
						type: 'video',
						payload: {
							is_reusable: true,
							url
						}
					}
				}
			},
			timeout: 10000
		},(err,res) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(res)
		})
	})
}
f.sendMessageAttachmentTemplateFacebook = (recipientId,payload) => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/me/messages`,
			qs: {access_token:env.FB_ACCESS_TOKEN},
			method: 'POST',
			json: {
				recipient: {id:recipientId},
				message: {
					attachment: {
						type: 'template',
						payload
					}
				}
			},
			timeout: 10000
		},(err,res) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(res)
		})
	})
}
f.sendMessageAttachmentTemplateGenericFacebook = (recipientId,elements) => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/me/messages`,
			qs: {access_token:env.FB_ACCESS_TOKEN},
			method: 'POST',
			json: {
				recipient: {id:recipientId},
				message: {
					attachment: {
						type: 'template',
						payload: {
							template_type: 'generic',
							elements
						}
					}
				}
			},
			timeout: 10000
		},(err,res) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(res)
		})
	})
}
f.sendMessageAttachmentTemplateOpenGraphFacebook = (recipientId,elements) => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/me/messages`,
			qs: {access_token:env.FB_ACCESS_TOKEN},
			method: 'POST',
			json: {
				recipient: {id:recipientId},
				message: {
					attachment: {
						type: 'template',
						payload: {
							template_type: 'open_graph',
							elements
						}
					}
				}
			},
			timeout: 10000
		},(err,res) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(res)
		})
	})
}
f.getGetStartedPropertyFacebook = () => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/me/messenger_profile`,
			qs: {
				fields: 'get_started',
				access_token: env.FB_ACCESS_TOKEN
			},
			method: 'GET',
			timeout: 10000
		},(err,res) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(JSON.parse(res.body).data[0]['get_started'])
		})
	})
}
f.enableGetStartedPropertyFacebook = (payload) => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/me/messenger_profile`,
			qs: {access_token:env.FB_ACCESS_TOKEN},
			method: 'POST',
			json: {get_started:{payload}},
			timeout: 10000
		},(err,res) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(res)
		})
	})
}
f.disableGetStartedPropertyFacebook = () => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/me/messenger_profile`,
			qs: {access_token:env.FB_ACCESS_TOKEN},
			method: 'DELETE',
			json: {fields:['get_started']},
			timeout: 10000
		},(err,res) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(res)
		})
	})
}
f.getPersistentMenuPropertyFacebook = () => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/me/messenger_profile`,
			qs: {
				fields: 'persistent_menu',
				access_token: env.FB_ACCESS_TOKEN
			},
			method: 'GET',
			timeout: 10000
		},(err,res) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(JSON.parse(res.body).data[0]['persistent_menu'])
		})
	})
}
f.enablePersistentMenuPropertyFacebook = (call_to_actions) => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/me/messenger_profile`,
			qs: {access_token:env.FB_ACCESS_TOKEN},
			method: 'POST',
			json: {persistent_menu: [
				{
					locale: 'default',
					composer_input_disabled: false,
					call_to_actions
				}
			]},
			timeout: 10000
		},(err,res) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(res)
		})
	})
}
f.disablePersistentMenuPropertyFacebook = () => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/me/messenger_profile`,
			qs: {access_token:env.FB_ACCESS_TOKEN},
			method: 'DELETE',
			json: {fields:['persistent_menu']},
			timeout: 10000
		},(err,res) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(res)
		})
	})
}
f.getWhitelistedDomainsPropertyFacebook = () => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/me/messenger_profile`,
			qs: {
				fields: 'whitelisted_domains',
				access_token: env.FB_ACCESS_TOKEN
			},
			method: 'GET',
			timeout: 10000
		},(err,res) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(JSON.parse(res.body).data[0]['whitelisted_domains'])
		})
	})
}
f.enableWhiteListedDomainsPropertyFacebook = (whitelisted_domains) => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/me/messenger_profile`,
			qs: {access_token:env.FB_ACCESS_TOKEN},
			method: 'POST',
			json: {whitelisted_domains},
			timeout: 10000
		},(err,res) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(res)
		})
	})
}
f.disableWhiteListedDomainsPropertyFacebook = () => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/me/messenger_profile`,
			qs: {access_token:env.FB_ACCESS_TOKEN},
			method: 'DELETE',
			json: {fields:['whitelisted_domains']},
			timeout: 10000
		},(err,res) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(res)
		})
	})
}
f.sendPrivateRepliesFacebook = (comment_id,messageText) => {
	return new Promise((resolve,reject) => {
		request({
			headers: {'Content-Type':'application/json'},
			url: `${env.FB_API_URL}/${comment_id}/private_replies`,
			qs: {access_token:env.FB_ACCESS_TOKEN},
			method: 'POST',
			json: {
				message: {text:messageText}
			},
			timeout: 10000
		},(err,res) => {
			if(err){
				console.error(`Error: ${err}`)
				return reject(err)
			}else if(res.body.error){
				console.error(`Error: ${res.body.error}`)
				return reject(res.body.error)
			}
			resolve(res)
		})
	})
}

module.exports = f