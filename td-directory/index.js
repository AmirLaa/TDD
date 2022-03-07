//use path module
const path = require('path');
//use express module
const express = require('express');
//use hbs view engine
const hbs = require('hbs');
//use bodyParser middleware
const bodyParser = require('body-parser');

const app = express();
const fs = require('fs');
//use to get the list of the TD
const things = require('./files/things.json');


//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//set folder public as static folder for static file
app.use('/assets',express.static(__dirname + '/public'));

//set folder files as static folder for thing descriptions file
app.use('/td',express.static(__dirname + '/files'));

//route for homepage
app.get('/',(req, res) => {
var fullUrl = req.protocol + '://' + req.get('host');
      res.render('td_view',{
      things: things
    });
  
});

//route for insert a TD
app.post('/save',(req, res) => {
  let data = JSON.parse(req.body.td);
  let loc = JSON.parse(JSON.stringify(data["located-in"]));
  
  var id = data["id"];

  var type =  data["@type"].split(":")[1];
  var room = loc[0].room_location_uri.split(":")[1];
  var building = loc[0].building_location_uri.split(":")[1];
  var fullUrl = req.protocol + '://' + req.get('host')+'/td/'+building+'/'+room+'/'+id;
  var fullUrl = req.protocol + '://' + req.get('host')+'/td/'+id;
  console.log(fullUrl);
  let thing = {"id":id, "building":building, "room":room, "thing":type, "url":fullUrl};
  
  things.push(thing);
 // console.log(things);
  
  	// write things to file
	var jsonContent = JSON.stringify(things);
	//console.log(jsonContent);
	 
	fs.writeFile("./files/things.json", jsonContent, 'utf8', function (err) {
	    if (err) {
		console.log("An error occured while writing JSON Object to File.");
		return console.log(err);
	    }
	 
	    console.log("Things file has been saved.");
	});
 
//	 const folderName = process.cwd()+'/files/'+building+'/'+room;
	 const folderName = process.cwd()+'/files/';

	try {
	  if (!fs.existsSync(folderName)) {
	    fs.mkdirSync(folderName, { recursive: true });
	  }
	} catch (err) {
	  console.error(err);
	}
	//Write the thing description
	var tdContent = JSON.stringify(data);
	fs.writeFile(folderName+'/'+id, tdContent, 'utf8', function (err) {
	    if (err) {
		console.log("An error occured while writing the Thing Description to File.");
		return console.log(err);
	    }
	 
	    console.log("Things Description file has been saved.");
	});
  
    res.redirect('/');
  
});

//route for update Thing Description
app.post('/update',(req, res) => {
   
   
   //retrieve old id and remove entry in the things.json
   var old = req.body.old;
   
   	for (let [i, thing] of things.entries()) {
	    if (thing.id == old) {
		things.splice(i, 1); 
	    }
   	}
   //remove the td file
   	const path = process.cwd()+'/files/'+old;

	try {
	  fs.unlinkSync(path)
	  //file removed
	} catch(err) {
	  console.error(err)
	}
   //parse the new td to save;
   
   //Code for save; Reogarnisation later
   //
   
   let data = JSON.parse(req.body.td);
  let loc = JSON.parse(JSON.stringify(data["located-in"]));
  
  var id = data["id"];

  var type =  data["@type"].split(":")[1];
  var room = loc[0].room_location_uri.split(":")[1];
  var building = loc[0].building_location_uri.split(":")[1];
  var fullUrl = req.protocol + '://' + req.get('host')+'/td/'+building+'/'+room+'/'+id;
  var fullUrl = req.protocol + '://' + req.get('host')+'/td/'+id;
  console.log(fullUrl);
  let thing = {"id":id, "building":building, "room":room, "thing":type, "url":fullUrl};
  
  things.push(thing);
  
  	// write things to file
	var jsonContent = JSON.stringify(things);
	
	 
	fs.writeFile("./files/things.json", jsonContent, 'utf8', function (err) {
	    if (err) {
		console.log("An error occured while writing JSON Object to File.");
		return console.log(err);
	    }
	 
	    console.log("Things file has been saved.");
	});
 
	 const folderName = process.cwd()+'/files/';

	try {
	  if (!fs.existsSync(folderName)) {
	    fs.mkdirSync(folderName, { recursive: true });
	  }
	} catch (err) {
	  console.error(err);
	}
	//Write the thing description
	var tdContent = JSON.stringify(data);
	fs.writeFile(folderName+'/'+id, tdContent, 'utf8', function (err) {
	    if (err) {
		console.log("An error occured while writing the Thing Description to File.");
		return console.log(err);
	    }
	 
	    console.log("Things Description file has been saved.");
	});
   
   //
   

    res.redirect('/');
 
});

//route for delete a Thing Description
app.post('/delete',(req, res) => {

 //retrieve id and remove entry in the things.json
   var old = req.body.id;
   
   	for (let [i, thing] of things.entries()) {
	    if (thing.id == old) {
		things.splice(i, 1); 
	    }
   	}
   //remove the td file
   	const path = process.cwd()+'/files/'+old;

	try {
	  fs.unlinkSync(path)
	  //file removed
	} catch(err) {
	  console.error(err)
	}


      res.redirect('/');
});


//server listening
app.listen(8000, () => {
  console.log('Server is running at port 8000');
});
