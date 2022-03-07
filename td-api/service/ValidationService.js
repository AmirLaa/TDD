'use strict';

const Ajv = require("ajv").default;
//use to get the schema
const schema = require('../models/schema.json');

/**
 * Retrieves the validation result for a given Thing Description
 * The Thing Description should be provided as JSON in the request body.<br> Note: This is currently not supported using Swagger UI. 
 *
 * returns ValidationResult
 **/
exports.validationGET = function(data) {

  return new Promise(function(resolve, reject) {
 // console.log(data);
	
  var ajv = new Ajv({strict: false, validateFormats: false}); 
  var validate = ajv.compile(schema);
  var valid = validate(JSON.parse(data));
  if (!valid) console.log(validate.errors);
 
  if(!valid){
    		reject({
		  "valid": false,
		  "message": validate.errors
		});	
    	}else{
    		resolve({
		  "valid": true,
		  "message": validate.errors
		});	

    	}


  });
}

