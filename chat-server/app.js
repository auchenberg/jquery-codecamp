require.paths.unshift(__dirname + '/lib');
var express = require('express'),
    connect = require('connect'),
         io = require('socket.io');

var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
    app.set('views', __dirname + '/views');
    app.use(connect.bodyDecoder());
    app.use(connect.methodOverride());
    app.use(connect.compiler({ src: __dirname + '/public', enable: ['less'] }));
    app.use(app.router);
    app.use(connect.staticProvider(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(connect.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
   app.use(connect.errorHandler()); 
});

// Routes
app.get('/', function(req, res){
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('<h1>Socket.IO Chat server.</h1><h2>Im alive</h2>');
	res.end();
});

var socket = io.listen(app, {
		transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling', 'jsonp-polling']
});

// Chat server
var buffer = [], MAXBUF = 32;
var clients = [];

socket.on('connection', function(client) {

    client.send(JSON.stringify({messages:buffer}));
    
    client.on('message', function(data) {
        if (/^(USERNAME:).*$/ig.test(data)) {
            client.username = data.split(":")[1];
            client.broadcast(JSON.stringify({announcement:client.username+' joined'}));
			console.log('Username', client.username);
            return;
        }
  
        if (/^(POSITION=).*$/ig.test(data)) {
            client.position = JSON.parse(data.split("=")[1]);
			console.log('Position updated for ' + client.username + ' :', client.position);
			return;
        }  

        if (/^(@).*$/ig.test(data)) {
            var tagetName = data.split("@")[1];
			var message = {'user':client.sessionId, 'username':client.username, 'message':data , 'position' : client.position, 'isPrivate': true};
			console.log('Private message sent to: ' + tagetName + ' :', JSON.stringify(message));
			
			client.privateMessage(JSON.stringify(message), tagetName);	
			return;
        }
    
        var message = {'user':client.sessionId, 'username':client.username, 'message':data , 'position' : client.position, 'isPrivate': false};
		console.log('User: ' + (client.username || client.sessionId) + ' sent message:' + data);
        buffer.push(message);
        if (buffer.length > MAXBUF) {
            buffer.shift();
        }

        client.broadcast(JSON.stringify(message));
    });
    
    client.on('disconnect', function() {
        client.broadcast(JSON.stringify( { announcement: (client.username||client.sessionId) + ' left chat' } ));
    });
    
    clients.push(client);
});

// Only listen on $ node app.js

if (!module.parent) {
    app.listen(8080);
    console.log("Socket-Chat listening on port 8080.. Go to http://<this-host>:8080");
}

