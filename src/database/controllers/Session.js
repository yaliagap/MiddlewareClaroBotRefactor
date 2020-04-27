const moment = require('moment')
const {Session} = require('../models')

module.exports = {

	/* Controller */

	create(values){
		return new Promise(async (resolve,reject) => {
			try{
				const res = await Session.upsert(values,{returning:true})
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
				const res = await Session.findAll({order:[['created_at','asc']]})
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
				const res = await Session.update(values,{where})
				resolve(res)
			}catch(err){
				console.error(err)
				reject(err)
			}
		})
	},

	findByUserId(user_id){
		return new Promise(async (resolve,reject) => {
			try{
				resolve(await Session.findOne({where:{user_id}}))
			}catch(err){
				console.error(err)
				reject(err)
			}
		})
	}
}