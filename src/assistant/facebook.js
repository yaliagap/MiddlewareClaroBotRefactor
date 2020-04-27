const env = process.env
const moment = require('moment')
const utils = require('../utils/')
const {Session} = require('../database/controllers/')

const f = {}
f.getSession = (senderId) => {
	return new Promise(async (resolve,reject) => {
		try{
			resolve(await Session.findByUserId(senderId))
		}catch(err){
			console.error(err)
			reject(err)
		}
	})
}
f.getContext = (senderId) => {
	return new Promise(async (resolve,reject) => {
		try{
			let context = null
			const session = await f.getSession(senderId)
			if(session){
				const updated_at = moment.utc(session.dataValues.updated_at).format('YYYY-MM-DD HH:mm:ss')
				const now = moment.utc().format('YYYY-MM-DD HH:mm:ss')
				const seconds = utils.getSecondsBetweenDates(updated_at,now)
				if(seconds < parseInt(env.FB_NEW_CONVERSATION_ID_SECONDS)) context = session.dataValues.context
			}
			resolve(context)
		}catch(err){
			console.error(err)
			reject(err)
		}
	})
}
f.createOrUpdateSession = (p) => {
	return new Promise(async (resolve,reject) => {
		try{
			let res = ''
			const session = await f.getSession(p.user_id)
			if(session){
				await Session.update({
					context: p.context,
					utc_offset: p.utc_offset,
					created_at: p.created_at
				},{
					user_id: p.user_id
				})
				res = 'Session Facebook was updated'
			}else{
				await Session.create({
					user_id: p.user_id,
					context: p.context,
					utc_offset: p.utc_offset,
					created_at: p.created_at
				})
				res = 'Session Facebook was created'
			}
			console.log(res)
			resolve(res)
		}catch(err){
			console.error(err)
			reject(err)
		}
	})
}

module.exports = f