require('dotenv').config({path:'./.env',encoding:'utf8'})
const env = process.env
const moment = require('moment')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.set('port',env.PORT || env.NODE_PORT)
app.use((req,res,next) => {
	res.set('Access-Control-Allow-Origin','*')
	res.set('Access-Control-Allow-Methods','GET,POST')
	res.set('Access-Control-Allow-Headers','Authorization,Content-Type,charset,x-access-token')
	/*res.set('X-RateLimit-Limit',limit.total)
	res.set('X-RateLimit-Remaining',limit.remaining - 1)
	res.set('X-RateLimit-Reset',limit.reset)*/
	if(env.NODE_ENV === 'local' || req.headers['x-forwarded-proto'] === 'https'){
		next()
	}else{
		res.redirect(`https://${req.headers.host+req.url}`)
	}
})
app.use(bodyParser.json({
	type: 'application/json',
	verify(req,res,buf){
		req.rawBody = buf
	}
}))
app.use(express.static('./public/'))

require('./src/assistant/')(app)
require('./src/services/')(app)

const http = require('http').createServer(app)
const io = require('socket.io')(http)
//require('./src/assistant/adviser')(app,io)

const server = http.listen(app.get('port'),() => {
	console.log(moment().utcOffset('-05:00').format('DD/MM/YYYY hh:mm:ss.SSS A'))
	console.log(`Server listening on port ${server.address().port} (${env.NODE_ENV})`)
})