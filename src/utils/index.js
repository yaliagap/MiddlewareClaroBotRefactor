const env = process.env
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const facebook = require('./facebook')

const f = {...facebook}
f.verifyApiKeyAssistantWeb = (req,res,next) => {
	if(req.headers.authorization === env.API_KEY_ASSISTANT_WEB){
		next()
	}else{
		console.error('Credenciales incorrectas')
		res.status(200).send({ok:false,message:'Credenciales incorrectas'})
	}
}
f.verifyApiKeyAssistantFacebook = (req,res,next) => {
	const xHubSignature = req.headers['x-hub-signature']
	if(xHubSignature){
		const signature = xHubSignature.split('sha1=')[1]
		const expectedSignature = crypto.createHmac('sha1',env.FB_APP_SECRET)
			.update(req.rawBody,'utf-8')
			.digest('hex')
		if(signature === expectedSignature){
			next()
		}else{
			console.error('Credenciales incorrectas')
			res.sendStatus(200)
		}
	}else{
		console.error('Credenciales incorrectas')
		res.sendStatus(200)
	}
}
f.verifyAccessTokenDashboard = (req,res,next) => {
	const token = req.headers['x-access-token']
	if(token){
		jwt.verify(token,env.API_SECRET_KEY_DASHBOARD,(err) => {
			if(err){
				res.status(500).send({ok:false,message:'Token no válido'})
			}else{
				next()
			}
		})
	}else{
		res.status(403).send({ok:false,message:'Token no está en headers'})
	}
}
f.encode = (object) => {
	const iv = crypto.randomBytes(16).toString('hex').slice(0,16)
	const cipher = crypto.createCipheriv(env.CRYPTO_ALGORITHM,env.CRYPTO_PRIVATE_KEY,iv)
	let encrypted = cipher.update(JSON.stringify(object),'utf8','hex')
	encrypted += cipher.final('hex')
	return `${iv}:${encrypted}`
}
f.decode = (hash) => {
	const iv = hash.split(':')[0]
	const decipher = crypto.createDecipheriv(env.CRYPTO_ALGORITHM,env.CRYPTO_PRIVATE_KEY,iv)
	const encrypted = hash.split(':')[1]
	let decrypted = decipher.update(encrypted,'hex','utf8')
	decrypted += decipher.final('utf8')
	return JSON.parse(decrypted)
}
f.clearVariable = () => null
f.cloneVariable = (v) => JSON.parse(JSON.stringify(v))
f.getOffsetToSeconds = () => {
	const offset = env.OFFSET.split(':')
	const factor = [3600,60]
	let seconds = 0
	offset.forEach((e,i) => {
		seconds += parseInt(e) * factor[i]
	})
	return seconds
}
f.getOffsetUtcToSeconds = () => {
	const offset = env.OFFSET_UTC.split(':')
	const factor = [3600,60]
	let seconds = 0
	offset.forEach((e,i) => {
		seconds += parseInt(e) * factor[i]
	})
	return seconds
}
f.convertToDate = (date) => {
	return moment(date).format('YYYY-MM-DD HH:mm:ss')
}
f.getSecondsBetweenDates = (date1,date2) => {
	date1 = f.convertToDate(date1)
	date2 = f.convertToDate(date2)
	return moment(date2).diff(date1,'seconds')
}
f.addSecondsToDate = (date,seconds) => {
	return moment(date).add(seconds,'seconds').format('YYYY-MM-DD HH:mm:ss')
}

module.exports = f