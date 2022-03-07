'use strict';

var TD = require('../models/td');

var utils = require('../utils/serialize.js');

/**
 * Retrieves the list of Thing Descriptions
 *
 * no response value expected for this operation
 **/
exports.tdGET = function() {
  return new Promise(function(resolve, reject) {
    // find a TD based on the Id; 
      TD.find({},{_id:0, __v:0}, function (err, docs) {
      	 if (err){ 
        	console.log(err) 
    	}

    	if(docs === null){
    		reject({
		  "code": 404,
		  "message": "Not found"
		});	
    	}else{
    		resolve(docs);	

    	}
    	
  	
	});
  });
}


/**
 * Deletes the Thing Description
 *
 * id String id of the Thing Description
 * no response value expected for this operation
 **/
exports.tdIdDELETE = function(id) {
  return new Promise(function(resolve, reject) {
	
	  TD.findOneAndDelete({id: id}, {_id:0, __v:0}, function (err, docs) {
      	 if (err){ 
        	console.log(err) 
    	}
	console.log(docs);
    	if(docs === null){
    		reject({
		  "code": 404,
		  "message": "Not found"
		});	
    	}else{
    		//remove the triple; 
   	utils.remove(id);
        		resolve();	
    	} 	
	});	   
 });
}


/**
 * Retrieves a Thing Description
 *
 * id String id of the Thing Description
 * returns Object
 **/
exports.tdIdGET = function(id) {
  return new Promise(function(resolve, reject) {
 // console.log(id);
 
      // find a TD based on the Id; 
      TD.findOne({id: id}, {_id:0, __v:0}, function (err, docs) {
      	 if (err){ 
        	console.log(err) 
    	}

    	if(docs === null){
    		reject({
		  "code": 404,
		  "message": "Not found"
		});	
    	}else{
    		resolve(docs);	

    	}
    	
  	
	});

  });
}


/**
 * Creates a new Thing Description, or updates an existing one
 *
 * body Object The Thing Description object
 * id String id of the Thing Description
 * no response value expected for this operation
 **/
exports.tdIdPUT = function(body,id) {
       
  return new Promise(function(resolve, reject) {
  
 var condition = {'id':id};
 var doc = body;
 TD.findOneAndUpdate(condition,doc,{upsert:true},function(err,doc){
    if (err){
    	console.log(err);
    	reject();
   }else{
   	//remove the triple in case of update; 
   	utils.remove(id);
   	
   	//serialize
   	utils.store(JSON.stringify(body));
   	resolve();
   }
 });

  });
}

