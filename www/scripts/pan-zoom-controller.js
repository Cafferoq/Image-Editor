/** Controller for panning and zooming the layers. */
export default function () {
	this._frame = null;		// The pan-zoom frame to which to bind.

	this._height = null;	// The height of the canvas.
	this._width = null;		// The width of the canvas.

	this._top = 0;			// The current top coordinate of the schematic.
	this._left = 0;			// The current left coordinate of teh schematic.

	/**
	 * Constructor for pan-zoom controller.
	 * @param  {DOM Node} frame The pan zoom frame to control.
	 * @param  {JSON} dim   The initial dimensions of the image.
	 */
	let _ctor = function (frame, dim) {
		this._frame = frame;

		this._height = dim.height;
		this._width = dim.width;

		this._scaleDisplay = frame.parentNode.querySelector('#scale');

		_resize.call(this);
		window.addEventListener('resize', _resize.bind(this));
	};

	/** Helper function to recenter layers. */
	let _recenter = function () {
		let bounds = this._frame.getBoundingClientRect();

		this._top = (window.innerHeight - bounds.height) / 2;
		this._left = (window.innerWidth - bounds.width) / 2;

		_updatePos.call(this);
	};

	/** Handler for resize event. Scales and re-centers canvas. */
	let _resize = function () {
		let bounds = this._frame.getBoundingClientRect();

		let imgR = this._width / this._height;
		let boundsR = bounds.width / bounds.height;

		var scale = boundsR < imgR
			? bounds.width / this._width
			: bounds.height / this._height;

		scale = Math.min(scale, 1);

		scale = Math.floor(scale * 100);
		_updateScale.call(this, scale);
		_recenter.call(this);
	};

	/** Helper function to move layers to the current top and left position. */
	let _updatePos = function () {
		this._frame.style.top = this._top + 'px';
		this._frame.style.left = this._left + 'px';
	};

	/**
	 * Helper function to update the scale on the layers.
	 * @param  {Number} scale The scale value to which to set the layers.
	 */
	let _updateScale = function (scale) {
		let canvases = this._frame.querySelectorAll('canvas.layer');
		Array.prototype.forEach.call(canvases, (canvas) => {
			canvas.style.transform = 'scale(#)'.replace('#', scale / 100);
		});

		this._scaleDisplay.innerHTML = scale + '%';
	};

	/**
	 * Changes the layer location by the given amounts.
	 * @param  {Number} dx The amount to move in the X direction.
	 * @param  {Number} dy The amount to move in the Y direction.
	 */
	this.pan = function (dx, dy) {
		this._left += dx;
		this._top += dy;

		_updatePos.call(this);
	};

	_ctor.apply(this, arguments);
};
