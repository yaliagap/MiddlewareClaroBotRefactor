const utils = require('../utils/')

module.exports = (app) => {

    /*Chip*/
    app.get('/services/chip/:number',async (req,res) => {
        let number = req.params.number;

        let responses = [
            { "status" : -2, "message" : "Mensaje de excepción a nivel del servicio en consulta", "data" : null },
            { "status" : -1, "message" : "El usuario no está permitido para realizar esta operación", "data" : null },
            { "status" : 0, "message" : "Respuesta exitosa", "data" : { "estado" :  "Libre", "msisdn" : "", "fechaventa" : "" } },
            { "status" : 0, "message" : "Respuesta exitosa", "data" : { "estado" :  "Reservado", "msisdn" : "", "fechaventa": "" } },
            { "status" : 0, "message" : "Respuesta exitosa", "data" : { "estado" :  "Vendido", "msisdn" : "941928806", "fechaventa": "2020-04-15 12:20:00" } }
        ]

        let response = {};

        switch(number){
            case '895110022917568209':{
                response = responses[4];
                break;
            }
            case '895110022917568208':{
                response = responses[3];
                break;
            }
            case '895110022917568207':{
                response = responses[2];
                break;
            }
            default:{
                response = responses[1];
            }
        }
		res.status(200).send(response)
    })
    
    app.get('/services/device/:number',async (req,res) => {
        let number = req.params.number;

        let responses = [
            { "status" : -2, "message" : "Mensaje de excepción a nivel del servicio en consulta", "data" : null },
            { "status" : -1, "message" : "El usuario no está permitido para realizar esta operación", "data" : null },
            { "status" : 0, "message" : "Respuesta exitosa", "data" : { "estado" :  "Libre", "msisdn" : "", "fechaventa" : "" } },
            { "status" : 0, "message" : "Respuesta exitosa", "data" : { "estado" :  "Reservado", "msisdn" : "", "fechaventa": "" } },
            { "status" : 0, "message" : "Respuesta exitosa", "data" : { "estado" :  "Vendido", "msisdn" : "941928806", "fechaventa": "2020-04-15 12:20:00" } }
        ]

        let response = {};

        switch(number){
            case '000353383080245668':{
                response = responses[4];
                break;
            }
            case '000353383080245667':{
                response = responses[3];
                break;
            }
            case '000353383080245666':{
                response = responses[2];
                break;
            }
            default:{
                response = responses[1];
            }
        }
		res.status(200).send(response)
    })
    
    app.post('/services/sec/cancel',async (req,res) => {
        let number = req.body.nro_sec;

        let responses = [
            { "status" : -2, "message" : "Mensaje de excepción a nivel del servicio en consulta", "data" : null },
            { "status" : -1, "message" : "El usuario no está permitido para realizar esta operación", "data" : null },
            { "status" : -1, "message" : "No se puede anular la SEC, canalizar la atención con Soporte TI", "data" : null },
            { "status" : 0, "message" : "La SEC fue anulada de manera exitosa", "data" : null }
        ]

        let response = {};

        switch(number){
            case '41505321':{
                response = responses[3];
                break;
            }
            case '41505320':{
                response = responses[2];
                break;
            }
            case '41505319':{
                response = responses[1];
                break;
            }
            default:{
                response = responses[0];
            }
        }
		res.status(200).send(response)
	})
}