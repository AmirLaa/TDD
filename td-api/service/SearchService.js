'use strict';

const Ajv = require("ajv").default;
//use to get the schema
const schema = require('../models/schema.json');

var axios = require('axios');

/**
 * Retrieves the validation result for a given Thing Description
 * The Thing Description should be provided as JSON in the request body.<br> Note: This is currently not supported using Swagger UI. 
 *
 * returns SearchResult
 **/
exports.searchGET = function(data) {

  return new Promise(function(resolve, reject) {
  console.log(" Serv " + data);
 //Here send the query to the tripple store Apache Jena 
 
 
 


//var query = 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> SELECT ?subject WHERE {  ?subject rdf:type <http://www.domos-project.eu/dCO_PoC/0.0.1#Equipement> . } ';
var url_to_endpoint = "http://localhost:3030/PoCv2/query";

console.log(url_to_endpoint );
var queryUrl = url_to_endpoint + "?query=" + encodeURIComponent(data);

console.log(queryUrl);



var config = {
  method: 'post',
  url: queryUrl,
  headers: { 
    'Accept': 'application/sparql-results+json,*/*;q=0.9'
  }
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
  resolve(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
  reject(error);
});




  });
}

