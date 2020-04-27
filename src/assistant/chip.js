//require('dotenv').config({path:'./.env',encoding:'utf8'})
const env = process.env;
const request = require('request');

console.log("ENV: ",env.API_URL);
const chip = {};

chip.getChipAvailability = async (number_chip) => {
	return new Promise((resolve, reject) => {
		request(
			{
				url: `${env.API_URL}/services/chip/${number_chip}`,
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'GET',
				timeout: 50000
			},
			(err, res, body) => {
				if (err) {
					console.error('Error at Chip getChipAvailability');
					return reject(err);
				} else if (res.body.error) {
					console.error('Error at Chip getChipAvailability');
					return reject(res.body.error);
				}
				resolve(body);
			}
		);
	});
};

module.exports = chip;
