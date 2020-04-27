const env = process.env
const moment = require('moment')
const utils = require('../../utils/')
const {Log} = require('../models/')
const sequelize = Log.sequelize
const Op = require('sequelize').Op

module.exports = {
	create(values){
		return new Promise(async (resolve,reject) => {
			try{
				const res = await Log.upsert(values,{returning:true})
				resolve(res)
			}catch(err){
				console.error(err)
				reject(err)
			}
		})
	},
	read(){
		return new Promise(async (resolve,reject) => {
			try{
				const res = await Log.findAll({order:[['created_at','asc']]})
				resolve(res)
			}catch(err){
				console.error(err)
				reject(err)
			}
		})
	},
	update(values,where){
		return new Promise(async (resolve,reject) => {
			try{
				values.updated_at = moment().utc().format('YYYY-MM-DD HH:mm:ss')
				const res = await Log.update(values,{where})
				resolve(res)
			}catch(err){
				console.error(err)
				reject(err)
			}
		})
	},
	/* Omnibox */
	findByConversationIdForOmnibox(conversation_id){
		return new Promise(async (resolve,reject) => {
			try{
				const sql =
					'select '+
						'watson_conversation_id as conversation_id,'+
						'channel_id,'+
						'user_id,'+
						'user_first_name,'+
						'user_last_name,'+
						'user_text as text,'+
						`'customer' as type,`+
						'utc_offset,'+
						'created_at '+
					'from '+
						`${env.PG_SCHEMA}.logs `+
					'where '+
						`watson_conversation_id = '${conversation_id}' `+
					'union all '+
					'select '+
						'watson_conversation_id,'+
						'channel_id,'+
						'null,'+
						'null,'+
						'null,'+
						'watson_text,'+
						`'watson',`+
						'utc_offset,'+
						'created_at '+
					'from '+
						`${env.PG_SCHEMA}.logs `+
					'where '+
						`watson_conversation_id = '${conversation_id}' `+
					'union all '+
					'select '+
						'watson_conversation_id,'+
						'channel_id,'+
						'null,'+
						'null,'+
						'null,'+
						`watson_json->'context'->'errors'->0->>'message',`+
						`'watson_error',`+
						'utc_offset,'+
						'created_at '+
					'from '+
						`${env.PG_SCHEMA}.logs `+
					'where '+
						`watson_conversation_id = '${conversation_id}' and `+
						`watson_json->'context'->'errors'->0 is not null `+
					'union all '+
					'select '+
						'log.watson_conversation_id,'+
						'log.channel_id,'+
						'log.user_id,'+
						'null,'+
						'null,'+
						'log.user_text,'+
						'users.name,'+
						'log.utc_offset,'+
						'log.created_at '+
					'from '+
						`${env.PG_SCHEMA}.logs_omnibox log `+
							`inner join ${env.PG_SCHEMA}.users_type_omnibox users on `+
								'users.id = log.user_type_omnibox_id '+
					'where '+
						`log.watson_conversation_id = '${conversation_id}' `+
					'order by '+
						'created_at asc,'+
						'type asc'
				const res = await Log.sequelize.query(sql,{type:Log.sequelize.QueryTypes.SELECT})
				resolve(res)
			}catch(err){
				console.error(err)
				reject(err)
			}
		})
	},
	findLastByConversationIdForOmnibox(watson_conversation_id){
		return new Promise(async (resolve,reject) => {
			try{
				const res = await Log.findOne({
					attributes: ['id','watson_json'],
					where: {watson_conversation_id},
					order: [['created_at','desc']]
				})
				resolve(res)
			}catch(err){
				console.error(err)
				reject(err)
			}
		})
	},
}
