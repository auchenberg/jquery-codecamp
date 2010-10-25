(function (window, $, undefined) {

	var socket;
	
	function onDomReady() {
	    socket = new io.Socket('localhost', {port: '8080', transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling', 'jsonp-polling']});
	    socket.on('message', onDataReceived);

	    socket.connect();

	    var username = navigator.userAgent;
	    if (username && username != "") {
            socket.send("USERNAME:"+username);
	    }
	}

	function onDataReceived(data) {
	    if ("string"===typeof(data)) {
	        data = JSON.parse(data);
	    }
	
		// Do rendering here 
	}

    function sendMessage(message) {	
		var message = $.trim(message);
	    if (message.length > 0) {
			socket.send(message);
	    }
	}
	
	
	$(document).ready(onDomReady);
	

})(window, jQuery);