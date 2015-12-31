var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
var socket = io();

console.log(name + ' wants to join'+ room);
jQuery('.room-title').text(room); //.html 

/////////// Connection ///////////
socket.on('connect',function (){
// successfully connected on front end part
// console.log to the JavaScript Console in Developer tools
	console.log('Connected to socket.io server');
	socket.emit('joinRoom', {
		name: name,
		room: room
	});
});


/////////// Messages come in ///////////
socket.on('message', function (message) {
	var momentTimestamp = moment.utc(message.timestamp);
	var $message = jQuery('.messages');

	console.log('New message: ');
	console.log(message.text);

	$message.append('<p><strong>'+message.name+' '+momentTimestamp.local().format('h:mm a')+'</strong></p>');
	$message.append('<p>'+message.text+'</p>');
});


/////////// Submit message ///////////
// Handle submitting of new message
var $form = jQuery('#message-form'); // jQuery(selector => tag of CSS)
// $ = store jQuery instance of element => this var has ability to access the jQuery instance

$form.on('submit', function (event) {
	event.preventDefault(); // handle form on your own
	socket.emit('message', {
		name: name,
		text: $form.find('input[name=message]').val() //find by tag[attribute]
	});
	$form.find('input[name=message]').val('');
});
