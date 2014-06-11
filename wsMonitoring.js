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
			initInputObserver();
			inputChange();
			inputFocus();
			addEventListener('mousemove', mouseMove);
			addEventListener('click', mouseClick);
			addEventListener('resize', windowResize);
			addEventListener('mouseout', mouseOut);
			addEventListener('mouseover', mouseOver);
		} else if (messageEvent.data == 'kenavo') {
			stopMutationObserver();
			stopInputObserver();
			removeEventListener('mousemove', mouseMove);
			removeEventListener('click', mouseClick);
			removeEventListener('resize', windowResize);
			removeEventListener('mouseout', mouseOut);
			removeEventListener('mouseover', mouseOver);
		} else if(messageEvent.data == 'enrollan') {
			windowResize();
			sendContent();
		} else{
			console.log('Unknown command : ');
			console.log(messageEvent.data)
		}
	};
	arverer.onclose = function(event) {
		stopMutationObserver();
		stopInputObserver();
		removeEventListener('mousemove', mouseMove);
		removeEventListener('click', mouseClick);
		removeEventListener('resize', windowResize);
		removeEventListener('mouseout', mouseOut);
		removeEventListener('mouseover', mouseOver);
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
	var inputChange = function(event) {
		var inputs = document.querySelectorAll('input');
		for (var i = 0; i < inputs.length; i++) {
			if (event && inputs[i] == event.target) {
				sendAction('input', {
					i: i,
					value: inputs[i].value
				});
				return;
			} else if (event == undefined) {
				sendAction('input', {
					i: i,
					value: inputs[i].value
				});
			}
		}
	};
	var inputFocus = function() {
		var inputs = document.querySelectorAll('input');
		for (var i = 0; i < inputs.length; i++) {
			if (event && inputs[i] == event.target) {
				sendAction('focus', {i: i});
				return;
			} else if (event == undefined && inputs[i] == document.activeElement) {
				sendAction('focus', {i: i});
				return;
			}
		}
	};
	var inputBlur = function() {
		sendAction('blur');
	};
	var initInputObserver = function() {
		var inputs = document.querySelectorAll('input');
		for (var i = 0; i < inputs.length; i++) {
			inputs[i].addEventListener('keypress', inputChange);
			inputs[i].addEventListener('keyup', inputChange);
			inputs[i].addEventListener('focus', inputFocus);
			inputs[i].addEventListener('blur', inputBlur);
		}
	};
	var stopInputObserver = function() {
		var inputs = document.querySelectorAll('input');
		for (var i = 0; i < inputs.length; i++) {
			inputs[i].removeEventListener('keypress', inputChange);
			inputs[i].removeEventListener('keyup', inputChange);
			inputs[i].removeEventListener('focus', inputFocus);
			inputs[i].removeEventListener('blur', inputBlur);
		}
	};
	var sendCoord = function(action, x, y) {
		sendAction(action, {
			x: x,
			y: y
		});
	};
	var sendAction = function(action, obj) {
		obj = obj || {};
		obj.action = action;
		arverer.send(JSON.stringify(obj));
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
		sendAction('out');
	};
	var mouseOver = function() {
		sendAction('over');
	};
	var sendContent = function() {
		sendAction('content', {data: document.documentElement.innerHTML});
	}
}
function disable() {
	console.log('disable');
}