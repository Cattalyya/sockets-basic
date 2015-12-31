var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname+'/public'));

var clientInfo = {}; // store {socket.id: {name:, room:} } of all users

function sendCurrentUsers (socket) {
	// pass socket, instead of id, in to find what room the user in
	var info = clientInfo[socket.id];
	var users = [];

	if (typeof info === 'undefined') {
		return;
		// to stop searching users if the room does not exist
	}

	Object.keys(clientInfo).forEach(function (socketId) {
		var userInfo = clientInfo[socketId];

		if(info.room === userInfo.room) {
			users.push(userInfo.name);
		}

	}); // Object.keys(obj) return all attributes of that obj 

	socket.emit('message', {
		name: 'System',
		text: 'Current Users: '+ users.join(', '),
		timestamp: moment.valueOf()
	})

}

io.on('connection', function (socket) {
	console.log('User connected via socket.io');

	socket.on('disconnect', function() {
		var userData = clientInfo[socket.id]
		if (typeof userData !== 'undefined') {
			socket.leave(userData.room);
			io.to(userData.room).emit('message', {
				name: 'System',
				text: userData.name + ' has left!',
				timestamp: moment().valueOf()
			});
			delete clientInfo[socket.id]; //delete socket.id from clientInfo
		}
	});

	socket.on('joinRoom', function (req) {
		clientInfo[socket.id] = req;
		socket.join(req.room); // add this socket to a specific room
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' has joined!',
			timestamp: moment().valueOf()
		}) // broadcast = to all other 
	});

	socket.on('message', function (message){
		console.log('Message received: '+message.text);
		// io.emit = send to everybody including sender
		// socket.broadcast.emit = send to all other people
		if (message.text === '@currentUsers') {
			// cmd to see all current users in that chat room
			sendCurrentUsers(socket);
		} else {
			message.timestamp = moment().valueOf();
			io.to(clientInfo[socket.id].room).emit('message', message);
		}

	});

	socket.emit('message', {
		name: 'System',
		text: 'Welcome to the chat application',
		timestamp: moment().valueOf()
	}); // emit event (type, piece of info to send)
});

http.listen(PORT, function() {
	console.log('Server started');
});

