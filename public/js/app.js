var socket = io();


socket.on('connect',function (){
// successfully connected on front end part
// console.log to the JavaScript Console in Developer tools
	console.log('Connected to socket.io server');
});

socket.on('message', function (message) {
	console.log('New message: ');
	console.log(message.text);
});

// Handle submitting of new message
var $form = jQuery('#message-form'); // jQuery(selector => tag of CSS)
// $ = store jQuery instance of element => this var has ability to access the jQuery instance

// name of event
$form.on('submit', function (event) {
	event.preventDefault(); // handle form on your own
	socket.emit('message', {
		text: $form.find('input[name=message]').val() //find by tag[attribute]
	});
	$form.find('input[name=message]').val('');
});
