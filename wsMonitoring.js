function checkConfig(config) {
	if (config == undefined) {
		config = {}
	}
	if (config.host == undefined) {
		config.host = location.hostname;
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
	arverer = new WebSocket(url);
	arverer.onmessage = function(messageEvent) {
		if (messageEvent.data == 'demat') {
			windowResize();
			sendContent();
			initMutationObserver();
			addEventListener('mousemove', mouseMove);
			addEventListener('click', mouseClick);
			addEventListener('resize', windowResize);
			addEventListener('mouseout', mouseOut);
			addEventListener('mouseover', mouseOver);
		} else if (messageEvent.data == 'kenavo') {
			stopMutationObserver();
			removeEventListener('mousemove', mouseMove);
			removeEventListener('click', mouseClick);
			removeEventListener('resize', windowResize);
			removeEventListener('mouseout', mouseOut);
			addEventListener('mouseover', mouseOver);
		} else {
			console.log('Unknown command : ');
			console.log(messageEvent.data)
		}
	};
	arverer.onclose = function(event) {
		console.log("onClose");
		console.log(event);
	};
	arverer.onerror = function(event) {
		console.log("onError");
		console.log(event);
	};
	var mo;
	var initMutationObserver = function() {
		mo = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if (arverer.readyState == arverer.OPEN) {
					sendContent();
				}
			})
		});
		var config = {attributes: true, childList: true, characterData: true, subtree: true};
		mo.observe(document, config);
	};
	var stopMutationObserver = function() {
		mo.disconnect();
	};
	initMutationObserver();
	var sendCoord = function(action, x, y) {
		arverer.send(JSON.stringify({
			action: action,
			x: x,
			y: y
		}));
	};
	var sendData = function(action, data) {
		arverer.send(JSON.stringify({
			action: action,
			data: data
		}));
	};
	var mouseMove = function(mouseEvent) {
		sendCoord('move', mouseEvent.x, mouseEvent.y);
	};

	var mouseClick = function(mouseEvent) {
		sendCoord('click', mouseEvent.x, mouseEvent.y);
	};
	var windowResize = function() {
		var body = document.body, html = document.documentElement;
		var height = Math.max(body.clientHeight, html.clientHeight);
		var width = Math.max(body.clientWidth, html.clientWidth);
		sendCoord('resize', width, height);
	};
	var mouseOut = function() {
		sendData('out');
	};
	var mouseOver = function() {
		sendData('over');
	};
	var sendContent = function() {
		sendData('content', document.documentElement.innerHTML);
	}
}
function disable() {
	console.log('disable');
}