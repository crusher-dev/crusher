/*!
 * Picker.js v1.2.0
 * https://fengyuanchen.github.io/pickerjs
 *
 * Copyright 2016-present Chen Fengyuan
 * Released under the MIT license
 *
 * Date: 2018-12-16T14:10:26.813Z
 */

function _typeof(obj) {
	if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
		_typeof = function (obj) {
			return typeof obj;
		};
	} else {
		_typeof = function (obj) {
			return obj &&
				typeof Symbol === 'function' &&
				obj.constructor === Symbol &&
				obj !== Symbol.prototype
				? 'symbol'
				: typeof obj;
		};
	}

	return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError('Cannot call a class as a function');
	}
}

function _defineProperties(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ('value' in descriptor) descriptor.writable = true;
		Object.defineProperty(target, descriptor.key, descriptor);
	}
}

function _createClass(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties(Constructor, staticProps);
	return Constructor;
}

function _toConsumableArray(arr) {
	return (
		_arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
	);
}

function _arrayWithoutHoles(arr) {
	if (Array.isArray(arr)) {
		for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)
			arr2[i] = arr[i];

		return arr2;
	}
}

function _iterableToArray(iter) {
	if (
		Symbol.iterator in Object(iter) ||
		Object.prototype.toString.call(iter) === '[object Arguments]'
	)
		return Array.from(iter);
}

function _nonIterableSpread() {
	throw new TypeError('Invalid attempt to spread non-iterable instance');
}

var DEFAULTS = {
	// Define the containers for putting the picker.
	container: null,
	// Indicate whether show the prev and next arrow controls on each column.
	controls: false,
	// The initial date. If not present, use the current date.
	date: null,
	// The date string format, also as the sorting order for columns.
	format: 'YYYY-MM-DD HH:mm',
	// Indicate whether show the column header.
	headers: false,
	// Define the increment for each date / time part.
	increment: 1,
	// Enable inline mode.
	inline: false,
	// Define the language. (An ISO language code).
	language: '',
	// Months' name.
	months: [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	],
	// Shorter months' name.
	monthsShort: [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	],
	// Define the number of rows for showing.
	rows: 5,
	// Define the text of the picker.
	text: {
		title: 'Pick a date and time',
		cancel: 'Cancel',
		confirm: 'OK',
		year: 'Year',
		month: 'Month',
		day: 'Day',
		hour: 'Hour',
		minute: 'Minute',
		second: 'Second',
		millisecond: 'Millisecond',
	},
	// Translate date / time text.
	translate: function translate(type, text) {
		return text;
	},
	// Shortcuts of custom events.
	show: null,
	shown: null,
	hide: null,
	hidden: null,
	pick: null,
};

var TEMPLATE =
	'<div class="picker" data-picker-action="hide" touch-action="none" tabindex="-1" role="dialog">' +
	'<div class="picker-dialog" role="document">' +
	'<div class="picker-header">' +
	'<h4 class="picker-title">{{ title }}</h4>' +
	'<button type="button" class="picker-close" data-picker-action="hide" aria-label="Close">&times;</button>' +
	'</div>' +
	'<div class="picker-body">' +
	'<div class="picker-grid"></div>' +
	'</div>' +
	'<div class="picker-footer">' +
	'<button type="button" class="picker-cancel" data-picker-action="hide">{{ cancel }}</button>' +
	'<button type="button" class="picker-confirm" data-picker-action="pick">{{ confirm }}</button>' +
	'</div>' +
	'</div>' +
	'</div>';

var IS_BROWSER = typeof window !== 'undefined';
var WINDOW = IS_BROWSER ? window : {};
var IS_TOUCH_DEVICE = IS_BROWSER
	? 'ontouchstart' in WINDOW.document.documentElement
	: false;
var HAS_POINTER_EVENT = IS_BROWSER ? 'PointerEvent' in WINDOW : false;
var NAMESPACE = 'picker';
var LANGUAGES = {}; // Actions

var ACTION_HIDE = 'hide';
var ACTION_NEXT = 'next';
var ACTION_PICK = 'pick';
var ACTION_PREV = 'prev'; // Classes

var CLASS_OPEN = ''.concat(NAMESPACE, '-open');
var CLASS_OPENED = ''.concat(NAMESPACE, '-opened');
var CLASS_PICKED = ''.concat(NAMESPACE, '-picked'); // Data keys
// Add namespace to avoid to conflict to some other libraries.

var DATA_ACTION = ''.concat(NAMESPACE, 'Action');
var DATA_TOKEN = 'token';
var DATA_TYPE = 'type';
var DATA_NAME = 'name';
var DATA_VALUE = 'value'; // Events

var EVENT_CLICK = 'click';
var EVENT_FOCUS = 'focus';
var EVENT_HIDDEN = 'hidden';
var EVENT_HIDE = 'hide';
var EVENT_KEY_DOWN = 'keydown';
var EVENT_PICK = 'pick';
var EVENT_TOUCH_START = IS_TOUCH_DEVICE ? 'touchstart' : 'mousedown';
var EVENT_TOUCH_MOVE = IS_TOUCH_DEVICE ? 'touchmove' : 'mousemove';
var EVENT_TOUCH_END = IS_TOUCH_DEVICE ? 'touchend touchcancel' : 'mouseup';
var EVENT_POINTER_DOWN = HAS_POINTER_EVENT ? 'pointerdown' : EVENT_TOUCH_START;
var EVENT_POINTER_MOVE = HAS_POINTER_EVENT ? 'pointermove' : EVENT_TOUCH_MOVE;
var EVENT_POINTER_UP = HAS_POINTER_EVENT
	? 'pointerup pointercancel'
	: EVENT_TOUCH_END;
var EVENT_SHOW = 'show';
var EVENT_SHOWN = 'shown';
var EVENT_WHEEL = 'wheel mousewheel DOMMouseScroll';

var _Object$prototype = Object.prototype,
	hasOwnProperty = _Object$prototype.hasOwnProperty,
	toString = _Object$prototype.toString;
/**
 * Detect the type of the given value.
 * @param {*} value - The value to detect.
 * @returns {string} Returns the type.
 */

function typeOf(value) {
	return toString.call(value).slice(8, -1).toLowerCase();
}
/**
 * Check if the given value is a string.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is a string, else `false`.
 */

function isString(value) {
	return typeof value === 'string';
}
/**
 * Check if the given value is finite.
 */

var isFinite = Number.isFinite || WINDOW.isFinite;
/**
 * Check if the given value is not a number.
 */

var isNaN = Number.isNaN || WINDOW.isNaN;
/**
 * Check if the given value is a number.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is a number, else `false`.
 */

function isNumber(value) {
	return typeof value === 'number' && !isNaN(value);
}
/**
 * Check if the given value is an object.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is an object, else `false`.
 */

function isObject(value) {
	return _typeof(value) === 'object' && value !== null;
}
/**
 * Check if the given value is a plain object.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is a plain object, else `false`.
 */

function isPlainObject(value) {
	if (!isObject(value)) {
		return false;
	}

	try {
		var _constructor = value.constructor;
		var prototype = _constructor.prototype;
		return (
			_constructor && prototype && hasOwnProperty.call(prototype, 'isPrototypeOf')
		);
	} catch (error) {
		return false;
	}
}
/**
 * Check if the given value is a function.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is a function, else `false`.
 */

function isFunction(value) {
	return typeof value === 'function';
}
/**
 * Check if the given value is a date.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is a date, else `false`.
 */

function isDate(value) {
	return typeOf(value) === 'date';
}
/**
 * Check if the given value is a valid date.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is a valid date, else `false`.
 */

function isValidDate(value) {
	return isDate(value) && value.toString() !== 'Invalid Date';
}
/**
 * Iterate the given data.
 * @param {*} data - The data to iterate.
 * @param {Function} callback - The process function for each element.
 * @returns {*} The original data.
 */

function forEach(data, callback) {
	if (data && isFunction(callback)) {
		if (
			Array.isArray(data) ||
			isNumber(data.length)
			/* array-like */
		) {
			var length = data.length;
			var i;

			for (i = 0; i < length; i += 1) {
				if (callback.call(data, data[i], i, data) === false) {
					break;
				}
			}
		} else if (isObject(data)) {
			Object.keys(data).forEach(function (key) {
				callback.call(data, data[key], key, data);
			});
		}
	}

	return data;
}
/**
 * Recursively assigns own enumerable properties of source objects to the target object.
 * @param {Object} target - The target object.
 * @param {Object[]} sources - The source objects.
 * @returns {Object} The target object.
 */

function deepAssign(target) {
	for (
		var _len = arguments.length,
			sources = new Array(_len > 1 ? _len - 1 : 0),
			_key = 1;
		_key < _len;
		_key++
	) {
		sources[_key - 1] = arguments[_key];
	}

	if (isObject(target) && sources.length > 0) {
		sources.forEach(function (source) {
			if (isObject(source)) {
				Object.keys(source).forEach(function (key) {
					if (isPlainObject(target[key]) && isPlainObject(source[key])) {
						target[key] = deepAssign({}, target[key], source[key]);
					} else {
						target[key] = source[key];
					}
				});
			}
		});
	}

	return target;
}
/**
 * Add classes to the given element.
 * @param {Element} element - The target element.
 * @param {string} value - The classes to be added.
 */

function addClass(element, value) {
	if (!value) {
		return;
	}

	if (isNumber(element.length)) {
		forEach(element, function (elem) {
			addClass(elem, value);
		});
		return;
	}

	if (element.classList) {
		element.classList.add(value);
		return;
	}

	var className = element.className.trim();

	if (!className) {
		element.className = value;
	} else if (className.indexOf(value) < 0) {
		element.className = ''.concat(className, ' ').concat(value);
	}
}
/**
 * Remove classes from the given element.
 * @param {Element} element - The target element.
 * @param {string} value - The classes to be removed.
 */

function removeClass(element, value) {
	if (!value) {
		return;
	}

	if (isNumber(element.length)) {
		forEach(element, function (elem) {
			removeClass(elem, value);
		});
		return;
	}

	if (element.classList) {
		element.classList.remove(value);
		return;
	}

	if (element.className.indexOf(value) >= 0) {
		element.className = element.className.replace(value, '');
	}
}
var REGEXP_HYPHENATE = /([a-z\d])([A-Z])/g;
/**
 * Transform the given string from camelCase to kebab-case
 * @param {string} value - The value to transform.
 * @returns {string} The transformed value.
 */

function hyphenate(value) {
	return value.replace(REGEXP_HYPHENATE, '$1-$2').toLowerCase();
}
/**
 * Get data from the given element.
 * @param {Element} element - The target element.
 * @param {string} name - The data key to get.
 * @returns {string} The data value.
 */

function getData(element, name) {
	if (isObject(element[name])) {
		return element[name];
	}

	if (element.dataset) {
		return element.dataset[name];
	}

	return element.getAttribute('data-'.concat(hyphenate(name)));
}
/**
 * Set data to the given element.
 * @param {Element} element - The target element.
 * @param {string} name - The data key to set.
 * @param {string} data - The data value.
 */

function setData(element, name, data) {
	if (isObject(data)) {
		element[name] = data;
	} else if (element.dataset) {
		element.dataset[name] = data;
	} else {
		element.setAttribute('data-'.concat(hyphenate(name)), data);
	}
}
/**
 * Remove data from the given element.
 * @param {Element} element - The target element.
 * @param {string} name - The data key to remove.
 */

function removeData(element, name) {
	if (isObject(element[name])) {
		try {
			delete element[name];
		} catch (error) {
			element[name] = undefined;
		}
	} else if (element.dataset) {
		// #128 Safari not allows to delete dataset property
		try {
			delete element.dataset[name];
		} catch (error) {
			element.dataset[name] = undefined;
		}
	} else {
		element.removeAttribute('data-'.concat(hyphenate(name)));
	}
}
var REGEXP_SPACES = /\s\s*/;

var onceSupported = (function () {
	var supported = false;

	if (IS_BROWSER) {
		var once = false;

		var listener = function listener() {};

		var options = Object.defineProperty({}, 'once', {
			get: function get() {
				supported = true;
				return once;
			},

			/**
			 * This setter can fix a `TypeError` in strict mode
			 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Getter_only}
			 * @param {boolean} value - The value to set
			 */
			set: function set(value) {
				once = value;
			},
		});
		WINDOW.addEventListener('test', listener, options);
		WINDOW.removeEventListener('test', listener, options);
	}

	return supported;
})();
/**
 * Remove event listener from the target element.
 * @param {Element} element - The event target.
 * @param {string} type - The event type(s).
 * @param {Function} listener - The event listener.
 * @param {Object} options - The event options.
 */

function removeListener(element, type, listener) {
	var options =
		arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	var handler = listener;
	type
		.trim()
		.split(REGEXP_SPACES)
		.forEach(function (event) {
			if (!onceSupported) {
				var listeners = element.listeners;

				if (listeners && listeners[event] && listeners[event][listener]) {
					handler = listeners[event][listener];
					delete listeners[event][listener];

					if (Object.keys(listeners[event]).length === 0) {
						delete listeners[event];
					}

					if (Object.keys(listeners).length === 0) {
						delete element.listeners;
					}
				}
			}

			element.removeEventListener(event, handler, options);
		});
}
/**
 * Add event listener to the target element.
 * @param {Element} element - The event target.
 * @param {string} type - The event type(s).
 * @param {Function} listener - The event listener.
 * @param {Object} options - The event options.
 */

function addListener(element, type, listener) {
	var options =
		arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	var _handler = listener;
	type
		.trim()
		.split(REGEXP_SPACES)
		.forEach(function (event) {
			if (options.once && !onceSupported) {
				var _element$listeners = element.listeners,
					listeners = _element$listeners === void 0 ? {} : _element$listeners;

				_handler = function handler() {
					delete listeners[event][listener];
					element.removeEventListener(event, _handler, options);

					for (
						var _len2 = arguments.length, args = new Array(_len2), _key2 = 0;
						_key2 < _len2;
						_key2++
					) {
						args[_key2] = arguments[_key2];
					}

					listener.apply(element, args);
				};

				if (!listeners[event]) {
					listeners[event] = {};
				}

				if (listeners[event][listener]) {
					element.removeEventListener(event, listeners[event][listener], options);
				}

				listeners[event][listener] = _handler;
				element.listeners = listeners;
			}

			element.addEventListener(event, _handler, options);
		});
}
/**
 * Dispatch event on the target element.
 * @param {Element} element - The event target.
 * @param {string} type - The event type(s).
 * @param {Object} data - The additional event data.
 * @returns {boolean} Indicate if the event is default prevented or not.
 */

function dispatchEvent(element, type, data) {
	var event; // Event and CustomEvent on IE9-11 are global objects, not constructors

	if (isFunction(Event) && isFunction(CustomEvent)) {
		event = new CustomEvent(type, {
			detail: data,
			bubbles: true,
			cancelable: true,
		});
	} else {
		event = document.createEvent('CustomEvent');
		event.initCustomEvent(type, true, true, data);
	}

	return element.dispatchEvent(event);
}
/**
 * Check if the given year is a leap year.
 * @param {number} year - The year to check.
 * @returns {boolean} Returns `true` if the given year is a leap year, else `false`.
 */

function isLeapYear(year) {
	return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
/**
 * Get days number of the given month.
 * @param {number} year - The target year.
 * @param {number} month - The target month.
 * @returns {number} Returns days number.
 */

function getDaysInMonth(year, month) {
	return [
		31,
		isLeapYear(year) ? 29 : 28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31,
	][month];
}
/**
 * Add leading zeroes to the given value
 * @param {number} value - The value to add.
 * @param {number} [length=1] - The number of the leading zeroes.
 * @returns {string} Returns converted value.
 */

function addLeadingZero(value) {
	var length =
		arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
	var str = String(Math.abs(value));
	var i = str.length;
	var result = '';

	if (value < 0) {
		result += '-';
	}

	while (i < length) {
		i += 1;
		result += '0';
	}

	return result + str;
}
/**
 * Map token to type name
 * @param {string} token - The token to map.
 * @returns {string} Returns mapped type name.
 */

function tokenToType(token) {
	return {
		Y: 'year',
		M: 'month',
		D: 'day',
		H: 'hour',
		m: 'minute',
		s: 'second',
		S: 'millisecond',
	}[token.charAt(0)];
}
var REGEXP_TOKENS = /(Y|M|D|H|m|s|S)\1*/g;
/**
 * Parse date format.
 * @param {string} format - The format to parse.
 * @returns {Object} Returns parsed format data.
 */

function parseFormat(format) {
	var tokens = format.match(REGEXP_TOKENS);

	if (!tokens) {
		throw new Error('Invalid format.');
	}

	var result = {
		tokens: tokens,
	};
	tokens.forEach(function (token) {
		result[tokenToType(token)] = token;
	});
	return result;
}

var events = {
	bind: function bind() {
		var element = this.element,
			options = this.options,
			grid = this.grid;

		if (isFunction(options.show)) {
			addListener(element, EVENT_SHOW, options.show);
		}

		if (isFunction(options.shown)) {
			addListener(element, EVENT_SHOWN, options.shown);
		}

		if (isFunction(options.hide)) {
			addListener(element, EVENT_HIDE, options.hide);
		}

		if (isFunction(options.hidden)) {
			addListener(element, EVENT_HIDDEN, options.hidden);
		}

		if (isFunction(options.pick)) {
			addListener(element, EVENT_PICK, options.pick);
		}

		addListener(element, EVENT_FOCUS, (this.onFocus = this.focus.bind(this)));
		addListener(element, EVENT_CLICK, this.onFocus);
		addListener(this.picker, EVENT_CLICK, (this.onClick = this.click.bind(this)));
		addListener(grid, EVENT_WHEEL, (this.onWheel = this.wheel.bind(this)));
		addListener(
			grid,
			EVENT_POINTER_DOWN,
			(this.onPointerDown = this.pointerdown.bind(this)),
		);
		addListener(
			document,
			EVENT_POINTER_MOVE,
			(this.onPointerMove = this.pointermove.bind(this)),
		);
		addListener(
			document,
			EVENT_POINTER_UP,
			(this.onPointerUp = this.pointerup.bind(this)),
		);
		addListener(
			document,
			EVENT_KEY_DOWN,
			(this.onKeyDown = this.keydown.bind(this)),
		);
	},
	unbind: function unbind() {
		var element = this.element,
			options = this.options,
			grid = this.grid;

		if (isFunction(options.show)) {
			removeListener(element, EVENT_SHOW, options.show);
		}

		if (isFunction(options.shown)) {
			removeListener(element, EVENT_SHOWN, options.shown);
		}

		if (isFunction(options.hide)) {
			removeListener(element, EVENT_HIDE, options.hide);
		}

		if (isFunction(options.hidden)) {
			removeListener(element, EVENT_HIDDEN, options.hidden);
		}

		if (isFunction(options.pick)) {
			removeListener(element, EVENT_PICK, options.pick);
		}

		removeListener(element, EVENT_FOCUS, this.onFocus);
		removeListener(element, EVENT_CLICK, this.onFocus);
		removeListener(this.picker, EVENT_CLICK, this.onClick);
		removeListener(grid, EVENT_WHEEL, this.onWheel);
		removeListener(grid, EVENT_POINTER_DOWN, this.onPointerDown);
		removeListener(document, EVENT_POINTER_MOVE, this.onPointerMove);
		removeListener(document, EVENT_POINTER_UP, this.onPointerUp);
		removeListener(document, EVENT_KEY_DOWN, this.onKeyDown);
	},
};

var handlers = {
	focus: function focus(event) {
		event.target.blur();
		this.show();
	},
	click: function click(event) {
		var target = event.target;
		var action = getData(target, DATA_ACTION);

		switch (action) {
			case ACTION_HIDE:
				this.hide();
				break;

			case ACTION_PICK:
				this.pick();
				break;

			case ACTION_PREV:
			case ACTION_NEXT:
				this[action](getData(target.parentElement, DATA_TYPE));
				break;

			default:
		}
	},
	wheel: function wheel(event) {
		var target = event.target;

		if (target === this.grid) {
			return;
		}

		event.preventDefault();

		while (target.parentElement && target.parentElement !== this.grid) {
			target = target.parentElement;
		}

		var type = getData(target, DATA_TYPE);

		if (event.deltaY < 0) {
			this.prev(type);
		} else {
			this.next(type);
		}
	},
	pointerdown: function pointerdown(event) {
		var target = event.target;

		if (target === this.grid || getData(target, DATA_ACTION)) {
			return;
		} // This line is required for preventing page scrolling in iOS browsers

		event.preventDefault();

		while (target.parentElement && target.parentElement !== this.grid) {
			target = target.parentElement;
		}

		var list = target.querySelector('.'.concat(NAMESPACE, '-list'));
		var itemHeight = list.firstElementChild.offsetHeight;
		this.cell = {
			elem: target,
			list: list,
			moveY: 0,
			maxMoveY: itemHeight,
			minMoveY: itemHeight / 2,
			startY: event.changedTouches ? event.changedTouches[0].pageY : event.pageY,
			type: getData(target, DATA_TYPE),
		};
	},
	pointermove: function pointermove(event) {
		var cell = this.cell;

		if (!cell) {
			return;
		}

		event.preventDefault();
		var endY = event.changedTouches ? event.changedTouches[0].pageY : event.pageY;
		var moveY = cell.moveY + (endY - cell.startY);
		cell.startY = endY;
		cell.moveY = moveY;

		if (Math.abs(moveY) < cell.maxMoveY) {
			cell.list.style.top = ''.concat(moveY, 'px');
			return;
		}

		cell.list.style.top = 0;
		cell.moveY = 0;

		if (moveY >= cell.maxMoveY) {
			this.prev(cell.type);
		} else if (moveY <= -cell.maxMoveY) {
			this.next(cell.type);
		}
	},
	pointerup: function pointerup(event) {
		var cell = this.cell;

		if (!cell) {
			return;
		}

		event.preventDefault();
		cell.list.style.top = 0;

		if (cell.moveY >= cell.minMoveY) {
			this.prev(cell.type);
		} else if (cell.moveY <= -cell.minMoveY) {
			this.next(cell.type);
		}

		this.cell = null;
	},
	keydown: function keydown(event) {
		if (this.shown && (event.key === 'Escape' || event.keyCode === 27)) {
			this.hide();
		}
	},
};

var helpers = {
	render: function render(type) {
		var _this = this;

		if (!type) {
			this.format.tokens.forEach(function (token) {
				return _this.render(tokenToType(token));
			});
			return;
		}

		var options = this.options;
		var data = this.data[type];
		var current = this.current(type);
		var max = isFunction(data.max) ? data.max() : data.max;
		var min = isFunction(data.min) ? data.min() : data.min;
		var base = 0;

		if (isFinite(max)) {
			base = min > 0 ? max : max + 1;
		}

		data.list.innerHTML = '';
		data.current = current;

		for (var i = 0; i < options.rows + 2; i += 1) {
			var item = document.createElement('li');
			var position = i - data.index;
			var newValue = current + position * data.increment;

			if (base) {
				newValue %= base;

				if (newValue < min) {
					newValue += base;
				}
			}

			item.textContent = options.translate(
				type,
				data.aliases
					? data.aliases[newValue]
					: addLeadingZero(newValue + data.offset, data.digit),
			);
			setData(item, DATA_NAME, type);
			setData(item, DATA_VALUE, newValue);
			addClass(item, ''.concat(NAMESPACE, '-item'));

			if (position === 0) {
				addClass(item, CLASS_PICKED);
				data.item = item;
			}

			data.list.appendChild(item);
		}
	},
	current: function current(type, value) {
		var date = this.date;
		var format = this.format;
		var token = format[type];

		switch (token.charAt(0)) {
			case 'Y':
				if (isNumber(value)) {
					date.setFullYear(token.length === 2 ? 2000 + value : value);

					if (format.month) {
						this.render(tokenToType(format.month));
					}

					if (format.day) {
						this.render(tokenToType(format.day));
					}
				}

				return date.getFullYear();

			case 'M':
				if (isNumber(value)) {
					date.setMonth(
						value, // The current day should not exceed its maximum day in current month
						Math.min(date.getDate(), getDaysInMonth(date.getFullYear(), value)),
					);

					if (format.day) {
						this.render(tokenToType(format.day));
					}
				}

				return date.getMonth();

			case 'D':
				if (isNumber(value)) {
					date.setDate(value);
				}

				return date.getDate();

			case 'H':
				if (isNumber(value)) {
					date.setHours(value);
				}

				return date.getHours();

			case 'm':
				if (isNumber(value)) {
					date.setMinutes(value);
				}

				return date.getMinutes();

			case 's':
				if (isNumber(value)) {
					date.setSeconds(value);
				}

				return date.getSeconds();

			case 'S':
				if (isNumber(value)) {
					date.setMilliseconds(value);
				}

				return date.getMilliseconds();

			default:
		}

		return date;
	},
	getValue: function getValue() {
		var element = this.element;
		return this.isInput ? element.value : element.textContent;
	},
	setValue: function setValue(value) {
		var element = this.element;

		if (this.isInput) {
			element.value = value;
		} else if (this.options.container) {
			element.textContent = value;
		}
	},
	open: function open() {
		var body = this.body;
		body.style.overflow = 'hidden';
		body.style.paddingRight = ''.concat(
			this.scrollBarWidth + (parseFloat(this.initialBodyPaddingRight) || 0),
			'px',
		);
	},
	close: function close() {
		var body = this.body;
		body.style.overflow = '';
		body.style.paddingRight = this.initialBodyPaddingRight;
	},
};

var methods = {
	/**
	 * Show the picker.
	 * @param {boolean} [immediate=false] - Indicate if show the picker immediately or not.
	 * @returns {Picker} this
	 */
	show: function show() {
		var immediate =
			arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
		var element = this.element,
			picker = this.picker;

		if (this.inline || this.shown) {
			return this;
		}

		if (dispatchEvent(element, EVENT_SHOW) === false) {
			return this;
		}

		this.shown = true;
		this.open();
		addClass(picker, CLASS_OPEN);

		var done = function done() {
			dispatchEvent(element, EVENT_SHOWN);
		};

		if (!immediate) {
			// Reflow to enable transition
			// eslint-disable-next-line
			picker.offsetWidth;
		}

		addClass(picker, CLASS_OPENED);

		if (immediate) {
			done();
		} else {
			setTimeout(done, 300);
		}

		return this;
	},

	/**
	 * Hide the picker.
	 * @param {boolean} [immediate=false] - Indicate if hide the picker immediately or not.
	 * @returns {Picker} this
	 */
	hide: function hide() {
		var _this = this;

		var immediate =
			arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
		var element = this.element,
			picker = this.picker;

		if (this.inline || !this.shown) {
			return this;
		}

		if (dispatchEvent(element, EVENT_HIDE) === false) {
			return this;
		}

		this.shown = false;
		removeClass(picker, CLASS_OPENED);

		var done = function done() {
			_this.close();

			removeClass(picker, CLASS_OPEN);
			dispatchEvent(element, EVENT_HIDDEN);
		};

		if (immediate) {
			done();
		} else {
			setTimeout(done, 300);
		}

		return this;
	},

	/**
	 * Pick to the previous item.
	 * @param {string} type - The column type.
	 * @returns {Picker} this
	 */
	prev: function prev(type) {
		var options = this.options;
		var token = this.format[type];
		var data = this.data[type];
		var list = data.list;
		var item = list.lastElementChild;
		var max = isFunction(data.max) ? data.max() : data.max;
		var min = isFunction(data.min) ? data.min() : data.min;
		var prev = data.item.previousElementSibling;
		var value =
			Number(getData(list.firstElementChild, DATA_VALUE)) - data.increment;

		if (value < min) {
			value += max - min + 1;
		}

		item.textContent = options.translate(
			type,
			data.aliases
				? data.aliases[value]
				: addLeadingZero(value + data.offset, token.length),
		);
		setData(item, DATA_VALUE, value);

		if (prev) {
			removeClass(data.item, CLASS_PICKED);
			addClass(prev, CLASS_PICKED);
			data.item = prev;
		}

		list.insertBefore(item, list.firstElementChild);
		data.current = Number(getData(data.item, DATA_VALUE));
		this.current(type, data.current);

		if (this.inline && options.container) {
			this.pick();
		}

		return this;
	},

	/**
	 * Pick to the next item.
	 * @param {String} type - The column type.
	 * @returns {Picker} this
	 */
	next: function next(type) {
		var options = this.options;
		var token = this.format[type];
		var data = this.data[type];
		var list = data.list;
		var item = list.firstElementChild;
		var max = isFunction(data.max) ? data.max() : data.max;
		var min = isFunction(data.min) ? data.min() : data.min;
		var next = data.item.nextElementSibling;
		var value =
			Number(getData(list.lastElementChild, DATA_VALUE)) + data.increment;

		if (value > max) {
			value -= max - min + 1;
		}

		item.textContent = options.translate(
			type,
			data.aliases
				? data.aliases[value]
				: addLeadingZero(value + data.offset, token.length),
		);
		setData(item, DATA_VALUE, value);
		list.appendChild(item);

		if (next) {
			removeClass(data.item, CLASS_PICKED);
			addClass(next, CLASS_PICKED);
			data.item = next;
		}

		data.current = Number(getData(data.item, DATA_VALUE));
		this.current(type, data.current);

		if (this.inline && options.container) {
			this.pick();
		}

		return this;
	},
	// Pick the current date to the target element.
	pick: function pick() {
		var element = this.element;

		if (dispatchEvent(element, EVENT_PICK) === false) {
			return this;
		}

		var value = this.formatDate(this.date);
		this.setValue(value);

		if (this.isInput && dispatchEvent(element, 'change') === false) {
			this.reset();
		}

		this.hide();
		return this;
	},

	/**
	 * Get the current date.
	 * @param {boolean} [formatted=false] - Indicate if format the date or not.
	 * @return {Date|string} The output date.
	 */
	getDate: function getDate() {
		var formatted =
			arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
		var date = this.date;
		return formatted ? this.formatDate(date) : new Date(date);
	},

	/**
	 * Override the current date with a new date.
	 * @param {Date|string} date - The date to set.
	 * @returns {Picker} this
	 */
	setDate: function setDate(date) {
		if (date) {
			this.date = this.parseDate(date);
			this.render();
		}

		return this;
	},
	// Update the picker with the current element value / text.
	update: function update() {
		this.date = this.parseDate(this.getValue());
		this.render();
		return this;
	},
	// Reset the picker and element value / text.
	reset: function reset() {
		this.setValue(this.initialValue);
		this.date = new Date(this.initialDate);
		this.render();
		return this;
	},

	/**
	 * Parse a date with the set date format.
	 * @param {Date|string} date - The date to parse.
	 * @returns {Date} The parsed date object.
	 */
	parseDate: function parseDate(date) {
		var options = this.options,
			format = this.format;
		var digits = [];

		if (isDate(date)) {
			return new Date(date);
		}

		if (isString(date)) {
			var groups = _toConsumableArray(options.months).concat(
				_toConsumableArray(options.monthsShort),
				['\\d+'],
			);

			digits = date.match(new RegExp('('.concat(groups.join('|'), ')'), 'g')); // Parse `11111111` (YYYYMMDD) to ['1111', '11', '11']

			if (
				digits &&
				date.length === options.format.length &&
				digits.length !== format.tokens.length
			) {
				digits = format.tokens.map(function (token) {
					return date.substr(options.format.indexOf(token), token.length);
				});
			}

			if (!digits || digits.length !== format.tokens.length) {
				return new Date();
			}
		}

		var parsedDate = new Date();
		digits.forEach(function (digit, i) {
			var token = format.tokens[i];
			var n = Number(digit);

			switch (token) {
				case 'YYYY':
				case 'YYY':
				case 'Y': {
					var index = date.indexOf(digit);
					var isHyphen = date.substr(index - 1, 1) === '-';
					var isBC =
						(index > 1 && isHyphen && /\S/.test(date.substr(index - 2, 1))) ||
						(index === 1 && isHyphen);
					parsedDate.setFullYear(isBC ? -n : n);
					break;
				}

				case 'YY':
					parsedDate.setFullYear(2000 + n);
					break;

				case 'MMMM':
					parsedDate.setMonth(options.months.indexOf(digit));
					break;

				case 'MMM':
					parsedDate.setMonth(options.monthsShort.indexOf(digit));
					break;

				case 'MM':
				case 'M':
					parsedDate.setMonth(n - 1);
					break;

				case 'DD':
				case 'D':
					parsedDate.setDate(n);
					break;

				case 'HH':
				case 'H':
					parsedDate.setHours(n);
					break;

				case 'mm':
				case 'm':
					parsedDate.setMinutes(n);
					break;

				case 'ss':
				case 's':
					parsedDate.setSeconds(n);
					break;

				case 'SSS':
				case 'SS':
				case 'S':
					parsedDate.setMilliseconds(n);
					break;

				default:
			}
		});
		return parsedDate;
	},

	/**
	 * Format a date object to a string with the set date format.
	 * @param {Date} date - The date to format.
	 * @return {string} THe formatted date.
	 */
	formatDate: function formatDate(date) {
		var options = this.options,
			format = this.format;
		var formatted = '';

		if (isValidDate(date)) {
			var year = date.getFullYear();
			var month = date.getMonth();
			var day = date.getDate();
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var seconds = date.getSeconds();
			var milliseconds = date.getMilliseconds();
			formatted = options.format;
			format.tokens.forEach(function (token) {
				var replacement = '';

				switch (token) {
					case 'YYYY':
					case 'YYY':
					case 'Y':
						replacement = addLeadingZero(year, token.length);
						break;

					case 'YY':
						replacement = addLeadingZero(year % 100, 2);
						break;

					case 'MMMM':
						replacement = options.months[month];
						break;

					case 'MMM':
						replacement = options.monthsShort[month];
						break;

					case 'MM':
					case 'M':
						replacement = addLeadingZero(month + 1, token.length);
						break;

					case 'DD':
					case 'D':
						replacement = addLeadingZero(day, token.length);
						break;

					case 'HH':
					case 'H':
						replacement = addLeadingZero(hours, token.length);
						break;

					case 'mm':
					case 'm':
						replacement = addLeadingZero(minutes, token.length);
						break;

					case 'ss':
					case 's':
						replacement = addLeadingZero(seconds, token.length);
						break;

					case 'SSS':
					case 'SS':
					case 'S':
						replacement = addLeadingZero(milliseconds, token.length);
						break;

					default:
				}

				formatted = formatted.replace(token, replacement);
			});
		}

		return formatted;
	},
	// Destroy the picker and remove the instance from the target element.
	destroy: function destroy() {
		var element = this.element,
			picker = this.picker;

		if (!getData(element, NAMESPACE)) {
			return this;
		}

		this.hide(true);
		this.unbind();
		removeData(element, NAMESPACE);
		picker.parentNode.removeChild(picker);
		return this;
	},
};

var REGEXP_DELIMITER = /\{\{\s*(\w+)\s*\}\}/g;
var REGEXP_INPUTS = /input|textarea/i;
var AnotherPicker = WINDOW.Picker;

var Picker =
	/*#__PURE__*/
	(function () {
		/**
		 * Create a new Picker.
		 * @param {Element} element - The target element for picking.
		 * @param {Object} [options={}] - The configuration options.
		 */
		function Picker(element) {
			var options =
				arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			_classCallCheck(this, Picker);

			if (!element || element.nodeType !== 1) {
				throw new Error('The first argument is required and must be an element.');
			}

			this.element = element;
			this.options = deepAssign(
				{},
				DEFAULTS,
				LANGUAGES[options.language],
				isPlainObject(options) && options,
			);
			this.shown = false;
			this.init();
		}

		_createClass(
			Picker,
			[
				{
					key: 'init',
					value: function init() {
						var _this = this;

						var element = this.element;

						if (getData(element, NAMESPACE)) {
							return;
						}

						setData(element, NAMESPACE, this);
						var options = this.options;
						var isInput = REGEXP_INPUTS.test(element.tagName);
						var inline = options.inline && (options.container || !isInput);
						var template = document.createElement('div');
						template.insertAdjacentHTML(
							'afterbegin',
							TEMPLATE.replace(REGEXP_DELIMITER, function () {
								for (
									var _len = arguments.length, args = new Array(_len), _key = 0;
									_key < _len;
									_key++
								) {
									args[_key] = arguments[_key];
								}

								return options.text[args[1]];
							}),
						);
						var picker = template.getElementsByClassName(NAMESPACE)[0];
						var grid = picker.getElementsByClassName(
							''.concat(NAMESPACE, '-grid'),
						)[0];
						var container = options.container;

						if (isString(container)) {
							container = document.querySelector(container);
						}

						if (inline) {
							addClass(picker, CLASS_OPEN);
							addClass(picker, CLASS_OPENED);

							if (!container) {
								container = element;
							}
						} else {
							var ownerDocument = element.ownerDocument;
							var body = ownerDocument.body || ownerDocument.documentElement;
							this.body = body;
							this.scrollBarWidth =
								WINDOW.innerWidth - ownerDocument.documentElement.clientWidth;
							this.initialBodyPaddingRight = WINDOW.getComputedStyle(
								body,
							).paddingRight;
							addClass(picker, ''.concat(NAMESPACE, '-fixed'));

							if (!container) {
								container = document.body;
							}
						}

						this.isInput = isInput;
						this.inline = inline;
						this.container = container;
						this.picker = picker;
						this.grid = grid;
						this.cell = null;
						this.format = parseFormat(options.format);
						var initialValue = this.getValue();
						var date = this.parseDate(options.date || initialValue);
						this.date = date;
						this.initialDate = new Date(date);
						this.initialValue = initialValue;
						this.data = {};
						var rows = Number(options.rows);

						if (!(rows % 2)) {
							rows += 1;
						}

						options.rows = rows || 5;
						addClass(
							grid,
							''
								.concat(NAMESPACE, '-')
								.concat(options.rows > 1 ? 'multiple' : 'single'),
						);

						if (options.controls) {
							addClass(grid, ''.concat(NAMESPACE, '-controls'));
						}

						var headers = options.headers,
							increment = options.increment;

						if (headers) {
							addClass(grid, ''.concat(NAMESPACE, '-header')); // TODO: Drop the `header` option's object support in v2.

							headers = isPlainObject(headers) ? headers : options.text;
						}

						if (!isPlainObject(increment)) {
							increment = {
								year: increment,
								month: increment,
								day: increment,
								hour: increment,
								minute: increment,
								second: increment,
								millisecond: increment,
							};
						}

						this.format.tokens.forEach(function (token) {
							var type = tokenToType(token);
							var cell = document.createElement('div');
							var cellBody = document.createElement('div');
							var list = document.createElement('ul');
							var data = {
								digit: token.length,
								increment: Math.abs(Number(increment[type])) || 1,
								list: list,
								max: Infinity,
								min: -Infinity,
								index: Math.floor((options.rows + 2) / 2),
								offset: 0,
							};

							switch (token.charAt(0)) {
								case 'Y':
									if (data.digit === 2) {
										data.max = 99;
										data.min = 0;
									}

									break;

								case 'M':
									data.max = 11;
									data.min = 0;
									data.offset = 1;

									if (data.digit === 3) {
										data.aliases = options.monthsShort;
									} else if (data.digit === 4) {
										data.aliases = options.months;
									}

									break;

								case 'D':
									data.max = function () {
										return getDaysInMonth(date.getFullYear(), date.getMonth());
									};

									data.min = 1;
									break;

								case 'H':
									data.max = 23;
									data.min = 0;
									break;

								case 'm':
									data.max = 59;
									data.min = 0;
									break;

								case 's':
									data.max = 59;
									data.min = 0;
									break;

								case 'S':
									data.max = 999;
									data.min = 0;
									break;

								default:
							}

							setData(cell, DATA_TYPE, type);
							setData(cell, DATA_TOKEN, token);

							if (headers) {
								var cellHeader = document.createElement('div');
								addClass(cellHeader, ''.concat(NAMESPACE, '-cell__header'));
								cellHeader.textContent =
									headers[type] || type[0].toUpperCase() + type.substr(1);
								cell.appendChild(cellHeader);
							}

							if (options.controls) {
								var prev = document.createElement('div');
								addClass(prev, ''.concat(NAMESPACE, '-cell__control'));
								addClass(prev, ''.concat(NAMESPACE, '-cell__control--prev'));
								setData(prev, DATA_ACTION, ACTION_PREV);
								cell.appendChild(prev);
							}

							addClass(list, ''.concat(NAMESPACE, '-list'));
							addClass(cellBody, ''.concat(NAMESPACE, '-cell__body'));
							addClass(cell, ''.concat(NAMESPACE, '-cell'));
							addClass(cell, ''.concat(NAMESPACE, '-').concat(type, 's'));
							cellBody.appendChild(list);
							cell.appendChild(cellBody);

							if (options.controls) {
								var next = document.createElement('div');
								addClass(next, ''.concat(NAMESPACE, '-cell__control'));
								addClass(next, ''.concat(NAMESPACE, '-cell__control--next'));
								setData(next, DATA_ACTION, ACTION_NEXT);
								cell.appendChild(next);
							}

							grid.appendChild(cell);
							_this.data[type] = data;

							_this.render(type);
						});

						if (inline) {
							container.innerHTML = '';
						}

						container.appendChild(picker);
						this.bind();
					},
					/**
					 * Get the no conflict picker class.
					 * @returns {Picker} The picker class.
					 */
				},
			],
			[
				{
					key: 'noConflict',
					value: function noConflict() {
						WINDOW.Picker = AnotherPicker;
						return Picker;
					},
					/**
					 * Change the default options.
					 * @param {Object} options - The new default options.
					 */
				},
				{
					key: 'setDefaults',
					value: function setDefaults(options) {
						deepAssign(
							DEFAULTS,
							LANGUAGES[options.language],
							isPlainObject(options) && options,
						);
					},
				},
			],
		);

		return Picker;
	})();

deepAssign(Picker.prototype, events, handlers, helpers, methods);
Picker.languages = LANGUAGES;

export default Picker;
