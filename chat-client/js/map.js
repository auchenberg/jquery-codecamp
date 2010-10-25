(function (window, $, undefined) {

	var socket, myUsername;
	var map, _userclicked = false;
	
	function onDomReady() {

	    socket = new io.Socket('localhost', {port: '8080', transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling', 'jsonp-polling']});
	    socket.on('message', onDataReceived);

	    socket.connect();

	    var username = 'Google Maps';
	    if (username && username != "") {
            socket.send("USERNAME:"+username);
			myUsername = username;

	    }
	
		var myLatlng = new google.maps.LatLng(55.680742, 12.45327);
		var myOptions = {
		  zoom: 8,
		  center: myLatlng,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		}
		map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

		google.maps.event.addListener(map, 'dragend', map_dragend );
		google.maps.event.addListener(map, 'dblclick', map_dblclicked );
		google.maps.event.addListener(map, 'zoom_changed', map_zoom_changed );			
	}
	
	function parseMapData(data) {
		var dataArray = data.split(';');
		
		if(dataArray[0] == 'pos') {
			var lat = parseFloat(dataArray[1]);
			var lng = parseFloat(dataArray[2]);
			var centerLatlng = new google.maps.LatLng(lat, lng);
			map.panTo(centerLatlng);
		} else if(dataArray[0] == 'zoom') {
			var zoom_level = parseInt(dataArray[1]);
			var lat = parseFloat(dataArray[2]);
			var lng = parseFloat(dataArray[3]);
			var centerLatlng = new google.maps.LatLng(lat, lng);
			
			if(map.getZoom() != zoom_level) {
				map.setZoom(zoom_level);
				map.panTo(centerLatlng);
			}
			
		}		
	}

	function onDataReceived(data) {
	    if ("string"===typeof(data)) {
	        data = JSON.parse(data);
	    }
	
		if(data.message) {
			parseMapData(data.message);
		}
	
		if(data.messages) {
			$.each(data.messages, function() { parseMapData(this.message); });
		}
	}
	
	function map_dragend() {
	
		var center = map.getCenter();
		var stringCenter = 'pos;' + center.lat() + ';' + center.lng();
		
		console.log('center changed', stringCenter);
		
        socket.send(stringCenter);
	}

	function map_dblclicked() {
		_userclicked = true;
	}	
	
	function map_zoom_changed() {
		var zoom_level = map.getZoom();
		$('#zoom_level').text(zoom_level);
		
		if(_userclicked){
			var zoom_level = map.getZoom();
			var center = map.getCenter();
			var data = 'zoom;' + zoom_level + ';' + center.lat() + ';' + center.lng();
		
			console.log('zoom_level changed', data);
		
			socket.send(data);
		
			_userclicked = false;
		}
		
	}	

	
	$(document).ready(onDomReady);
	

})(window, jQuery);