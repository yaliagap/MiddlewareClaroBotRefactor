//require('dotenv').config({path:'./.env',encoding:'utf8'})
const env = process.env;
const request = require('request');

console.log("ENV: ",env.API_URL);
const sec = {};

sec.cancelSec = async (number_sec) => {
	return new Promise((resolve, reject) => {
		request(
			{
				url: `${env.API_URL}/services/sec/cancel`,
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'POST',
				json: {
					nro_sec: number_sec
				},
				timeout: 50000
			},
			(err, res, body) => {
				if (err) {
					console.error('Error at SEC cancelSec');
					return reject(err);
				} else if (res.body.error) {
					console.error('Error at SEC cancelSec');
					return reject(res.body.error);
				}
				resolve(body);
			}
		);
	});
};

module.exports = sec;
