'use strict';

var utils = require('../utils/writer.js');
var Td = require('../service/TdService');

const Ajv = require("ajv").default;
//use to get the schema
const schema = require('../models/schema.json');



//Get all things descriptions
module.exports.tdGET = function tdGET (req, res, next) {
  Td.tdGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

//delete a thing description using its ID
module.exports.tdIdDELETE = function tdIdDELETE (req, res, next, id) {
  Td.tdIdDELETE(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
    
    var ret = JSON.parse(JSON.stringify(response));
      utils.writeJson(res, response, ret.code);
    });
};

//Get thing description by Id
module.exports.tdIdGET = function tdIdGET (req, res, next, id) {
// Call the service related to that ...
  Td.tdIdGET(id)
    .then(function (response) {
     
      	utils.writeJson(res, response);
      
    })
    .catch(function (response) {
    
    	var ret = JSON.parse(JSON.stringify(response));
  
        utils.writeJson(res, response, ret.code);
    });
};

//Create or update thing description
module.exports.tdIdPUT = function tdIdPUT (req, res, next, body, id) {

       var value = req.body;
	var data = JSON.stringify(value);
	
	//Validare Thing Description
	var ajv = new Ajv({strict: false, validateFormats: false}); 
  	var validate = ajv.compile(schema);
  	var valid = validate(JSON.parse(data));
  	console.log(valid);
  	if (valid){ 
  	
   
		Td.tdIdPUT(value, id)

		.then(function (response) {
		utils.writeJson(res, response);
		})
		.catch(function (response) {
		utils.writeJson(res, response);
		});
		
	}
	else{
	
		utils.writeJson(res, validate.errors);
	
	}

};
