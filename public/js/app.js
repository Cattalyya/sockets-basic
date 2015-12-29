var socket = io();


socket.on('connect',function(){
// successfully connected on front end part
// console.log to the JavaScript Console in Developer tools
	console.log('Connected to socket.io server');
});