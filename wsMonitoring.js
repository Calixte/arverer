function checkConfig(config) {
	if (config == undefined) {
		config = {}
	}
	if (config.host == undefined) {
		config.host = 'localhost';
	}
	if (config.port == undefined) {
		config.port = '8080';
	}
	if (config.path == undefined) {
		config.path = '/echo';
	}
	if (config.secure == undefined) {
		config.secure = false;
	}
	return config;
}
function arvererInit(c) {
	var config = checkConfig(c);
	var url = (config.secure ? 'wss' : 'ws') + '://' + config.host + ':' + config.port + config.path;
    var arverer = new WebSocket(url);
	arverer.onmessage = function(event) {
		
	};
	arverer.sendMousePosition = function(mouseEvent) {
		arverer.send(JSON.stringify({x:mouseEvent.x, y:mouseEvent.y}));
	};
	addEventListener('mousemove', arverer.sendMousePosition)
}