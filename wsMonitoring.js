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
	arverer.onmessage = function(messageEvent) {
		if (messageEvent.data == 'demat') {
			addEventListener('mousemove', mouseMove);
			addEventListener('click', mouseClick);
		} else if (messageEvent.data == 'kenavo') {
			removeEventListener('mousemove', mouseMove);
			removeEventListener('click', mouseClick);
		} else {
			console.log(messageEvent.data)
		}
	};
	var sendAction = function(action, x, y) {
		arverer.send(JSON.stringify({
			action: action,
			x: x,
			y: y
		}));
	};

	var mouseMove = function(mouseEvent) {
		sendAction('move', mouseEvent.x, mouseEvent.y);
	};

	var mouseClick = function(mouseEvent) {
		sendAction('click', mouseEvent.x, mouseEvent.y);
	};
}
