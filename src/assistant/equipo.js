//require('dotenv').config({path:'./.env',encoding:'utf8'})
const env = process.env;
const request = require('request');

console.log("ENV: ",env.API_URL);
const device = {};

device.getDeviceAvailability = async (number_device) => {
	return new Promise((resolve, reject) => {
		request(
			{
				url: `${env.API_URL}/services/device/${number_device}`,
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'GET',
				timeout: 50000
			},
			(err, res, body) => {
				if (err) {
					console.error('Error at Device getDeviceAvailability');
					return reject(err);
				} else if (res.body.error) {
					console.error('Error at Device getDeviceAvailability');
					return reject(res.body.error);
				}
				resolve(body);
			}
		);
	});
};

module.exports = device;
