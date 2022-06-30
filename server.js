

// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config()//this will load Api key file
// }
// const WEATHER_API_KEY = process.env.WEATHER_API_KEY // calling api key here
// const express = require('express');
// const app = express();

// app.use(express.json());
// app.use(express.static('public'))

// app.post('/WWATHER APP', (req, res) => {
//     console.log(req.body);
// })

// app.listen(3000, () => {
//     console.log('Server Started')
// })


var http = require('http');  
//var url = require('url'); 
var fs = require('fs');  
var server = http.createServer(function(request, response) { 
    console.log('request was made:' + request.url);
    response.writeHead(200, {'Content-Type': 'text/html'});
    var myReadStream = fs.createReadStream(__dirname + '/index.html', 'utf8');
    myReadStream.pipe(response);
}); 

server.listen(3000, '127.0.0.1');
console.log('server started, now listenning to port 3000');


