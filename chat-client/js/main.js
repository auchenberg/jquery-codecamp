(function (window, $, undefined) {

	var socket, myUsername;
	var elmInput, elmChatList;
	
	function onDomReady() {

		elmInput = $('input[type=text]').val('');
		elmChatList = $('#chat-list').html('');

		$('#composer').bind('submit', onFormSubmit);
			
	    socket = new io.Socket('localhost', {port: '8080', transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling', 'jsonp-polling']});
	    socket.on('message', onDataReceived);

	    socket.connect();

	    var username = 'auchenberg';
	    if (username && username != "") {
            socket.send("USERNAME:"+username);
			myUsername = username;

	    }
	
		renderChatData({announcement: myUsername + ' joined'});
	}

	function onDataReceived(data) {
	    if ("string"===typeof(data)) {
	        data = JSON.parse(data);
	    }
	    return renderChatData(data);
	}

    function onFormSubmit() {	
		var message = $.trim(elmInput.val());
	    if (message.length > 0) {
	        renderChatData({message: message, username: myUsername});
	        elmInput.val('');
			
			socket.send(message);
	    }
	
	    elmInput.focus();
	
		return false;
	}

    function renderMessage(message) {
        var userName = (message.username);
		var elmChatItem = $('<li>').addClass('chat');
        
        if (userName) {
			var elmUser = $('<span class="user">').text( userName + ": ");
            elmChatItem.addClass('chat');

            elmChatItem.append(elmUser);
        }

		var messageText;
		if(message.position) {
			messageText = message.message + ' (position: lat:' + message.position.lat + ', lng:' + message.position.lng + ')';
		}
		else {
			messageText = message.message + ' (position: unknown)';
		}

		var elmMessage = $('<span class=message></span>').text(messageText);		
        elmChatItem.append(elmMessage);

        elmChatList.append(elmChatItem);
    }

	function renderChatData(data) {
                
        if (data && data.message) {        
            renderMessage(data);
        } else if (data && data.messages) {
			for (var i = 0, message; message = data.messages[i]; i++) {
				renderMessage(message);
			}
        } else if (data && data.announcement) {
			var elmItem = $('<li class="information"></li>').text(data.announcement);
            elmChatList.append(elmItem);
    	}

		// stay at bottom
        elmChatList[0].scrollTop = elmChatList[0].scrollHeight;
	}
	
	
	$(document).ready(onDomReady);
	

})(window, jQuery);