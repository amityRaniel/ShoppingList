var mysql = require('mysql');
var http = require('http');

http.createServer(function(req, res) {

//create connection
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '123123',
	database: 'myDB'
});
 //connect
connection.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}
	console.log('connected as id ' + connection.threadId);
});

//make a query
var queryString = 'SELECT * FROM Items';
connection.query(queryString, function(err, results) {
	if (err) throw err;

	var obj = {};
	for (var i in results) {
		obj["row" + i] = results[i];
	}

	var json = JSON.stringify({ 
    	rows: obj
  	});
 res.setHeader('Content-Type', 'application/json');
 res.setHeader("Access-Control-Allow-Origin", "*");
 res.end(json);
});

connection.end();

}).listen(8081);
console.log("listening to 8081");

