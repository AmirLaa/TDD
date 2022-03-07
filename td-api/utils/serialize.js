// Extract the exec function from the child_process module
const exec = require("child_process").exec;
var fs = require('fs');


//Save the TD to tmp.json

/*
try {  
    var content = fs.readFileSync('td.json', 'utf8');
    
    store(content);
    
} catch(e) {
    console.log('Error:', e.stack);
}
*/

var store = exports.store = function (content){


exec("sudo touch tmp.json tmp.rdf",function(err,stdout,stderr) {
  // If there is an error executing then
  if(err) {
    throw err;
 }
 console.log(stdout);
});



fs.writeFileSync('tmp.json', content, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;
});



 //Call the serializer ..
exec("sudo python3 ./utils/serilizer.py -inputFile tmp.json -outputFile tmp.rdf",function(err,stdout,stderr) {
  // If there is an error executing then
  if(err) {
    throw err;
 }

});

try {  
    var data = fs.readFileSync('tmp.rdf', 'utf8');
    
    //INSERT data through SPARQL to the ontology
    
     var url_to_endpoint = "http://localhost:3030/PoCv2/update";
    
    var query = 'PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX dco:<https://www.dco.domos-project.eu/#> INSERT DATA { ' + data + '}' ; 
    
   
    var cmd = 'curl '+ url_to_endpoint + ' -X POST --data ' + '"update=' + encodeURIComponent(query) + '" -H "Accept: text/plain,*/*;q=0.9"';
    
  //call curl to execute the update ... 
  exec(cmd ,function(err,stdout,stderr) {
  // If there is an error executing then
  if(err) {
    throw err;
 }
 console.log(stdout);
});

    
} catch(e) {
    console.log('Error:', e.stack);
}

}



var remove = exports.remove = function (id){
	  
    var url_to_endpoint = "http://localhost:3030/PoCv2/update";  
    var query = 'PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX dco: <https://www.dco.domos-project.eu/#> DELETE WHERE {   ?SensorName dco:hasID "'+ id +'".  ?SensorName dco:hasProperty ?prop.  ?prop ?x ?y.  ?SensorName        ?property      ?value . } ';
    
   
    var cmd = 'curl '+ url_to_endpoint + ' -X POST --data ' + '"update=' + encodeURIComponent(query) + '" -H "Accept: text/plain,*/*;q=0.9"';
    
  //call curl to execute the update ... 
  exec(cmd ,function(err,stdout,stderr) {
  // If there is an error executing then
  if(err) {
    throw err;
  }
 	console.log(stdout);
 });




}



