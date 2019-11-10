const WindowController = require('./window-controller');

// Initialize window controller on DOM Content Load.
window.addEventListener('DOMContentLoaded', function (e) {
	WindowController.init();
});
