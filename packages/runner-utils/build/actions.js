(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/actions/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../node_modules/path-browserify/index.js":
/*!************************************************************************************!*\
  !*** /Users/utkarsh/Desktop/crusher/crusher/node_modules/path-browserify/index.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../process/browser.js */ "../../node_modules/process/browser.js")))

/***/ }),

/***/ "../../node_modules/process/browser.js":
/*!******************************************************************************!*\
  !*** /Users/utkarsh/Desktop/crusher/crusher/node_modules/process/browser.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./src/actions/addInput.ts":
/*!*********************************!*\
  !*** ./src/actions/addInput.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
function addInput(action, page) {
    return new Promise(async (success, error) => {
        try {
            const selectors = action.payload.selectors;
            const inputKeys = action.payload.meta.value;
            const selector = await functions_1.waitForSelectors(page, selectors);
            if (!selector || typeof selector !== "string") {
                return error(`Invalid selector`);
            }
            const elementHandle = await page.$(selector);
            if (!elementHandle) {
                return error(`Attempt to press keycodes on element with invalid selector: ${selector}`);
            }
            await elementHandle.scrollIntoViewIfNeeded();
            await functions_1.type(elementHandle, inputKeys);
            return success({
                message: `Pressed keys on the element ${selector}`,
            });
        }
        catch (err) {
            return error("Some issue occurred while adding input to element");
        }
    });
}
exports.default = addInput;


/***/ }),

/***/ "./src/actions/assertElement.ts":
/*!**************************************!*\
  !*** ./src/actions/assertElement.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
const functions_2 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
function assert(action, page) {
    return new Promise(async (success, error) => {
        try {
            const selectors = action.payload.selectors;
            const selector = await functions_2.waitForSelectors(page, selectors);
            if (!selector || typeof selector !== "string") {
                return error(`Invalid selector`);
            }
            const validationRows = action.payload.meta.validationRows;
            const output = await functions_1.assertElement(page, selector, validationRows);
            return success({
                message: `Successfully asserted element ${selector}`,
                meta: { output }
            });
        }
        catch (err) {
            console.error(err);
            return error("Some issue occurred while asserting element");
        }
    });
}
exports.default = assert;


/***/ }),

/***/ "./src/actions/click.ts":
/*!******************************!*\
  !*** ./src/actions/click.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
function click(action, page) {
    return new Promise(async (success, error) => {
        try {
            const selectors = action.payload.selectors;
            const selector = await functions_1.waitForSelectors(page, selectors);
            if (!selector || typeof selector !== "string") {
                return error(`Invalid selector`);
            }
            const elementHandle = await page.$(selector);
            if (!elementHandle) {
                return error(`No element with selector as ${selector} exists`);
            }
            await elementHandle.scrollIntoViewIfNeeded();
            await elementHandle.dispatchEvent("click");
            // If under navigation wait for load state to complete.
            await page.waitForLoadState();
            return success({
                message: `Clicked on the element ${selector}`,
            });
        }
        catch (err) {
            return error("Some issue occurred while clicking on element");
        }
    });
}
exports.default = click;


/***/ }),

/***/ "./src/actions/elementScreenshot.ts":
/*!******************************************!*\
  !*** ./src/actions/elementScreenshot.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
const path = __importStar(__webpack_require__(/*! path */ "../../node_modules/path-browserify/index.js"));
function generateScreenshotName(selector, stepIndex) {
    return selector.replace(/[^\w\s]/gi, '').replace(/ /g, '_') + `_${stepIndex}.png`;
}
function elementScreenshot(action, page, stepIndex, assetsDir) {
    return new Promise(async (success, error) => {
        try {
            const selectors = action.payload.selectors;
            const selector = await functions_1.waitForSelectors(page, selectors);
            if (!selector || typeof selector !== 'string') {
                return error(`Invalid selector`);
            }
            const elementHandle = await page.$(selector);
            if (!elementHandle) {
                return error(`Attempt to capture screenshot of element with invalid selector: ${selector}`);
            }
            await elementHandle.screenshot({
                path: path.resolve(assetsDir, generateScreenshotName(selector, stepIndex)),
            });
            return success({
                message: `Captured element screenshot for ${selector}`,
            });
        }
        catch (err) {
            return error('Some issue occurred while capturing screenshot of element');
        }
    });
}
exports.default = elementScreenshot;


/***/ }),

/***/ "./src/actions/elementScroll.ts":
/*!**************************************!*\
  !*** ./src/actions/elementScroll.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
function capturePageScreenshot(action, page) {
    return new Promise(async (success, error) => {
        try {
            const selectors = action.payload.selectors;
            const selector = await functions_1.waitForSelectors(page, selectors);
            if (!selector || typeof selector !== "string") {
                return error(`Invalid selector`);
            }
            if (!selector) {
                return error(`Attempt to scroll element with invalid selector: ${selector}`);
            }
            const scrollDelta = action.payload.meta.value;
            const pageUrl = await page.url();
            await functions_1.scroll(page, selector, scrollDelta);
            return success({
                message: `Scrolled successfully on ${pageUrl}`,
            });
        }
        catch (err) {
            return error("Some issue occurred while scrolling on element");
        }
    });
}
exports.default = capturePageScreenshot;


/***/ }),

/***/ "./src/actions/hover.ts":
/*!******************************!*\
  !*** ./src/actions/hover.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
async function hover(action, page) {
    return new Promise(async (success, error) => {
        try {
            const selectors = action.payload.selectors;
            const selector = await functions_1.waitForSelectors(page, selectors);
            if (!selector || typeof selector !== "string") {
                return error(`Invalid selector`);
            }
            await page.hover(selector);
            return success({
                message: `Hovered on the element ${selector}`,
            });
        }
        catch (err) {
            return error("Some issue occurred while hovering on element");
        }
    });
}
exports.default = hover;


/***/ }),

/***/ "./src/actions/index.ts":
/*!******************************!*\
  !*** ./src/actions/index.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const addInput_1 = __importDefault(__webpack_require__(/*! ./addInput */ "./src/actions/addInput.ts"));
const click_1 = __importDefault(__webpack_require__(/*! ./click */ "./src/actions/click.ts"));
const hover_1 = __importDefault(__webpack_require__(/*! ./hover */ "./src/actions/hover.ts"));
const elementScreenshot_1 = __importDefault(__webpack_require__(/*! ./elementScreenshot */ "./src/actions/elementScreenshot.ts"));
const pageScreenshot_1 = __importDefault(__webpack_require__(/*! ./pageScreenshot */ "./src/actions/pageScreenshot.ts"));
const elementScroll_1 = __importDefault(__webpack_require__(/*! ./elementScroll */ "./src/actions/elementScroll.ts"));
const pageScroll_1 = __importDefault(__webpack_require__(/*! ./pageScroll */ "./src/actions/pageScroll.ts"));
const navigateUrl_1 = __importDefault(__webpack_require__(/*! ./navigateUrl */ "./src/actions/navigateUrl.ts"));
const setDevice_1 = __importDefault(__webpack_require__(/*! ./setDevice */ "./src/actions/setDevice.ts"));
const assertElement_1 = __importDefault(__webpack_require__(/*! ./assertElement */ "./src/actions/assertElement.ts"));
module.exports = {
    Element: {
        addInput: addInput_1.default,
        click: click_1.default,
        hover: hover_1.default,
        scroll: elementScroll_1.default,
        screenshot: elementScreenshot_1.default,
        elementScroll: elementScroll_1.default,
        assertElement: assertElement_1.default
    },
    Page: {
        screenshot: pageScreenshot_1.default,
        scroll: pageScroll_1.default,
        navigate: navigateUrl_1.default,
    },
    Browser: {
        setDevice: setDevice_1.default,
    },
};


/***/ }),

/***/ "./src/actions/navigateUrl.ts":
/*!************************************!*\
  !*** ./src/actions/navigateUrl.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
async function navigateUrl(action, page) {
    return new Promise(async (success, error) => {
        try {
            const urlToGo = action.payload.meta.value;
            await page.goto(urlToGo);
            return success({
                message: `Navigated successfully to ${urlToGo}`,
            });
        }
        catch (err) {
            console.error(err);
            return error('Some issue occurred while navigating to webpage');
        }
    });
}
exports.default = navigateUrl;


/***/ }),

/***/ "./src/actions/pageScreenshot.ts":
/*!***************************************!*\
  !*** ./src/actions/pageScreenshot.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(__webpack_require__(/*! path */ "../../node_modules/path-browserify/index.js"));
function generatePageScreenshotName(title, stepIndex) {
    return title.replace(/[^\\w\\s]/gi, '').replace(/ /g, '_') + `_${stepIndex}.png`;
}
function capturePageScreenshot(page, stepIndex, assetsDir) {
    return new Promise(async (success, error) => {
        try {
            const pageTitle = await page.title();
            const pageUrl = await page.url();
            await page.screenshot({ path: path.resolve(assetsDir, generatePageScreenshotName(pageTitle, stepIndex)) });
            return success({
                message: `Clicked page screenshot for ${pageUrl}`,
            });
        }
        catch (err) {
            return error('Some issue occurred while capturing screenshot of page');
        }
    });
}
exports.default = capturePageScreenshot;


/***/ }),

/***/ "./src/actions/pageScroll.ts":
/*!***********************************!*\
  !*** ./src/actions/pageScroll.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = __webpack_require__(/*! ../functions */ "./src/functions/index.ts");
function capturePageScreenshot(action, page) {
    return new Promise(async (success, error) => {
        try {
            const scrollDelta = action.payload.meta.value;
            const pageUrl = await page.url();
            await functions_1.scroll(page, "window", scrollDelta);
            return success({
                message: `Scrolled successfully on ${pageUrl}`,
            });
        }
        catch (err) {
            return error("Some issue occurred while scrolling the page");
        }
    });
}
exports.default = capturePageScreenshot;


/***/ }),

/***/ "./src/actions/setDevice.ts":
/*!**********************************!*\
  !*** ./src/actions/setDevice.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
async function setDevice(action) {
    return new Promise(async (success, error) => {
        try {
            const device = action.payload.meta.device;
            const userAgent = action.payload.meta.userAgent;
            return success({
                message: "Setup device for testing",
                meta: {
                    width: device.width,
                    height: device.height,
                    userAgent: userAgent.value,
                },
            });
        }
        catch (err) {
            return error("Some issue occurred while setting the device");
        }
    });
}
exports.default = setDevice;


/***/ }),

/***/ "./src/functions/assertElement.ts":
/*!****************************************!*\
  !*** ./src/functions/assertElement.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
async function assertElementAttributes(page, selector, assertions) {
    const elHandle = await page.$(selector);
    let hasPassed = true;
    const logs = [];
    for (let i = 0; i < assertions.length; i++) {
        const { validation, operation, field } = assertions[i];
        const elementAttributeValue = await elHandle.getAttribute(field.name);
        if (operation === "matches") {
            if (elementAttributeValue !== validation) {
                hasPassed = false;
                logs.push({ status: "FAILED", message: "Failed to assert attribute=" + validation + " of " + selector + "", meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue } });
            }
            else {
                logs.push({ status: "DONE", message: "Asserted attribute=" + validation + " of " + selector + "", meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue } });
            }
        }
        else if (operation === "contains") {
            const doesContain = elementAttributeValue.includes(validation);
            if (!doesContain) {
                hasPassed = false;
                logs.push({ status: "FAILED", message: "Failed to assert attribute contains " + validation + " of " + selector + "", meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue } });
            }
            else {
                logs.push({ status: "DONE", message: "Asserted attribute contains " + validation + " of " + selector + "", meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue } });
            }
        }
        else if (operation === "regex") {
            const rgx = new RegExp(validation);
            if (!rgx.test(elementAttributeValue)) {
                hasPassed = false;
                logs.push({ status: "FAILED", message: "Failed to assert attribute matches regex: " + validation + " of " + selector + "", meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue } });
            }
            else {
                logs.push({ status: "DONE", message: "Asserted attribute matches regex: " + validation + " of " + selector + "", meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue } });
            }
        }
    }
    return [hasPassed, logs];
}
exports.default = assertElementAttributes;


/***/ }),

/***/ "./src/functions/index.ts":
/*!********************************!*\
  !*** ./src/functions/index.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertElement = exports.sleep = exports.waitForSelectors = exports.type = exports.scroll = void 0;
const scroll_1 = __importDefault(__webpack_require__(/*! ./scroll */ "./src/functions/scroll.ts"));
exports.scroll = scroll_1.default;
const type_1 = __importDefault(__webpack_require__(/*! ./type */ "./src/functions/type.ts"));
exports.type = type_1.default;
const waitForSelectors_1 = __importDefault(__webpack_require__(/*! ./waitForSelectors */ "./src/functions/waitForSelectors.ts"));
exports.waitForSelectors = waitForSelectors_1.default;
const sleep_1 = __importDefault(__webpack_require__(/*! ./sleep */ "./src/functions/sleep.ts"));
exports.sleep = sleep_1.default;
const assertElement_1 = __importDefault(__webpack_require__(/*! ./assertElement */ "./src/functions/assertElement.ts"));
exports.assertElement = assertElement_1.default;


/***/ }),

/***/ "./src/functions/scroll.ts":
/*!*********************************!*\
  !*** ./src/functions/scroll.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
async function scroll(page, selector, scrollDeltaArr) {
    await page.evaluate(([scrollDeltaArr, selectorKey]) => {
        const scrollTo = function (element, offset) {
            const fixedOffset = offset.toFixed();
            const onScroll = () => {
                if (element.pageYOffset.toFixed() === fixedOffset) {
                    element.removeEventListener("scroll", onScroll);
                    return true;
                }
                return false;
            };
            element.addEventListener("scroll", onScroll);
            onScroll();
            element.scrollTo({
                top: offset,
                behavior: "smooth",
            });
        };
        const element = selectorKey === "window" ? window : document.querySelector(selectorKey);
        for (let i = 0; i < scrollDeltaArr.length; i++) {
            scrollTo(element, scrollDeltaArr[i]);
        }
    }, [scrollDeltaArr, selector]);
}
exports.default = scroll;


/***/ }),

/***/ "./src/functions/sleep.ts":
/*!********************************!*\
  !*** ./src/functions/sleep.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
}
exports.default = sleep;


/***/ }),

/***/ "./src/functions/type.ts":
/*!*******************************!*\
  !*** ./src/functions/type.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
async function type(elHandle, keyCodes) {
    for (let i = 0; i < keyCodes.length; i++) {
        await elHandle.press(String.fromCharCode(keyCodes[i]));
    }
    return true;
}
exports.default = type;


/***/ }),

/***/ "./src/functions/waitForSelectors.ts":
/*!*******************************************!*\
  !*** ./src/functions/waitForSelectors.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const dom_1 = __webpack_require__(/*! ../utils/dom */ "./src/utils/dom.ts");
async function waitForSelectors(page, selectors, defaultSelector = null) {
    if (!defaultSelector) {
        defaultSelector = selectors[0].value;
    }
    try {
        await page.waitForSelector(defaultSelector, { state: "attached" });
        return defaultSelector;
    }
    catch (_a) {
        const validSelector = await page.evaluate((selectors) => {
            for (const selector of selectors) {
                try {
                    if (selector.type === "xpath") {
                        const elements = dom_1.getElementsByXPath(selector.value);
                        if (elements.length) {
                            const elementSelectorFromXpath = dom_1.generateQuerySelector(elements[0]);
                            return elementSelectorFromXpath;
                        }
                    }
                    else if (document.querySelector(selector.value)) {
                        return selector.value;
                    }
                }
                catch (ex) {
                    console.debug("Caught exception", ex);
                }
            }
            return null;
        }, selectors);
        if (typeof validSelector === "undefined") {
            throw new Error("This is not working");
        }
        return validSelector;
    }
}
exports.default = waitForSelectors;


/***/ }),

/***/ "./src/utils/dom.ts":
/*!**************************!*\
  !*** ./src/utils/dom.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQuerySelector = exports.getElementsByXPath = void 0;
const getElementsByXPath = (xpath, parent = null) => {
    const results = [];
    const query = document.evaluate(xpath, parent || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0, length = query.snapshotLength; i < length; ++i) {
        const item = query.snapshotItem(i);
        if (item)
            results.push(item);
    }
    return results;
};
exports.getElementsByXPath = getElementsByXPath;
const generateQuerySelector = (el) => {
    if (el.tagName.toLowerCase() == "html")
        return "HTML";
    let str = el.tagName;
    str += el.id != "" ? "#" + el.id : "";
    if (el.className) {
        const classes = el.className.split(/\s/);
        for (let i = 0; i < classes.length; i++) {
            str += "." + classes[i];
        }
    }
    return generateQuerySelector(el.parentNode) + " > " + str;
};
exports.generateQuerySelector = generateQuerySelector;


/***/ })

/******/ })));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy91dGthcnNoL0Rlc2t0b3AvY3J1c2hlci9jcnVzaGVyL25vZGVfbW9kdWxlcy9wYXRoLWJyb3dzZXJpZnkvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy91dGthcnNoL0Rlc2t0b3AvY3J1c2hlci9jcnVzaGVyL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FjdGlvbnMvYWRkSW5wdXQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FjdGlvbnMvYXNzZXJ0RWxlbWVudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYWN0aW9ucy9jbGljay50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYWN0aW9ucy9lbGVtZW50U2NyZWVuc2hvdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYWN0aW9ucy9lbGVtZW50U2Nyb2xsLnRzIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb25zL2hvdmVyLnRzIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb25zL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb25zL25hdmlnYXRlVXJsLnRzIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb25zL3BhZ2VTY3JlZW5zaG90LnRzIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb25zL3BhZ2VTY3JvbGwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FjdGlvbnMvc2V0RGV2aWNlLnRzIiwid2VicGFjazovLy8uL3NyYy9mdW5jdGlvbnMvYXNzZXJ0RWxlbWVudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZnVuY3Rpb25zL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9mdW5jdGlvbnMvc2Nyb2xsLnRzIiwid2VicGFjazovLy8uL3NyYy9mdW5jdGlvbnMvc2xlZXAudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Z1bmN0aW9ucy90eXBlLnRzIiwid2VicGFjazovLy8uL3NyYy9mdW5jdGlvbnMvd2FpdEZvclNlbGVjdG9ycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvZG9tLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsUUFBUTtBQUN4QztBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVSxNQUFNO0FBQ2hCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0NBQW9DLDhCQUE4QjtBQUNsRTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVUsb0JBQW9CO0FBQzlCO0FBQ0E7O0FBRUE7QUFDQSxVQUFVLFVBQVU7QUFDcEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLFlBQVk7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLCtCQUErQixzQkFBc0I7QUFDckQ7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsUUFBUTtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDJCQUEyQixRQUFRO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixRQUFRO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixlQUFlO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQzdTQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNB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QUFFLENBQUMsU0FBUyxFQUFFO1FBQ2pCLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3hDLEdBQUcsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3hCO0tBQ0Q7SUFDRCxPQUFPLHFCQUFxQixDQUFFLEVBQVUsQ0FBQyxVQUFVLENBQUMsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ3BFLENBQUMsQ0FBQztBQUUyQixzREFBcUIiLCJmaWxlIjoiYWN0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2FjdGlvbnMvaW5kZXgudHNcIik7XG4iLCIvLyAuZGlybmFtZSwgLmJhc2VuYW1lLCBhbmQgLmV4dG5hbWUgbWV0aG9kcyBhcmUgZXh0cmFjdGVkIGZyb20gTm9kZS5qcyB2OC4xMS4xLFxuLy8gYmFja3BvcnRlZCBhbmQgdHJhbnNwbGl0ZWQgd2l0aCBCYWJlbCwgd2l0aCBiYWNrd2FyZHMtY29tcGF0IGZpeGVzXG5cbi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vLyByZXNvbHZlcyAuIGFuZCAuLiBlbGVtZW50cyBpbiBhIHBhdGggYXJyYXkgd2l0aCBkaXJlY3RvcnkgbmFtZXMgdGhlcmVcbi8vIG11c3QgYmUgbm8gc2xhc2hlcywgZW1wdHkgZWxlbWVudHMsIG9yIGRldmljZSBuYW1lcyAoYzpcXCkgaW4gdGhlIGFycmF5XG4vLyAoc28gYWxzbyBubyBsZWFkaW5nIGFuZCB0cmFpbGluZyBzbGFzaGVzIC0gaXQgZG9lcyBub3QgZGlzdGluZ3Vpc2hcbi8vIHJlbGF0aXZlIGFuZCBhYnNvbHV0ZSBwYXRocylcbmZ1bmN0aW9uIG5vcm1hbGl6ZUFycmF5KHBhcnRzLCBhbGxvd0Fib3ZlUm9vdCkge1xuICAvLyBpZiB0aGUgcGF0aCB0cmllcyB0byBnbyBhYm92ZSB0aGUgcm9vdCwgYHVwYCBlbmRzIHVwID4gMFxuICB2YXIgdXAgPSAwO1xuICBmb3IgKHZhciBpID0gcGFydHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICB2YXIgbGFzdCA9IHBhcnRzW2ldO1xuICAgIGlmIChsYXN0ID09PSAnLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICB9IGVsc2UgaWYgKGxhc3QgPT09ICcuLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCkge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXAtLTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiB0aGUgcGF0aCBpcyBhbGxvd2VkIHRvIGdvIGFib3ZlIHRoZSByb290LCByZXN0b3JlIGxlYWRpbmcgLi5zXG4gIGlmIChhbGxvd0Fib3ZlUm9vdCkge1xuICAgIGZvciAoOyB1cC0tOyB1cCkge1xuICAgICAgcGFydHMudW5zaGlmdCgnLi4nKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcGFydHM7XG59XG5cbi8vIHBhdGgucmVzb2x2ZShbZnJvbSAuLi5dLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVzb2x2ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzb2x2ZWRQYXRoID0gJycsXG4gICAgICByZXNvbHZlZEFic29sdXRlID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID49IC0xICYmICFyZXNvbHZlZEFic29sdXRlOyBpLS0pIHtcbiAgICB2YXIgcGF0aCA9IChpID49IDApID8gYXJndW1lbnRzW2ldIDogcHJvY2Vzcy5jd2QoKTtcblxuICAgIC8vIFNraXAgZW1wdHkgYW5kIGludmFsaWQgZW50cmllc1xuICAgIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLnJlc29sdmUgbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfSBlbHNlIGlmICghcGF0aCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgcmVzb2x2ZWRQYXRoID0gcGF0aCArICcvJyArIHJlc29sdmVkUGF0aDtcbiAgICByZXNvbHZlZEFic29sdXRlID0gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbiAgfVxuXG4gIC8vIEF0IHRoaXMgcG9pbnQgdGhlIHBhdGggc2hvdWxkIGJlIHJlc29sdmVkIHRvIGEgZnVsbCBhYnNvbHV0ZSBwYXRoLCBidXRcbiAgLy8gaGFuZGxlIHJlbGF0aXZlIHBhdGhzIHRvIGJlIHNhZmUgKG1pZ2h0IGhhcHBlbiB3aGVuIHByb2Nlc3MuY3dkKCkgZmFpbHMpXG5cbiAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gIHJlc29sdmVkUGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihyZXNvbHZlZFBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhcmVzb2x2ZWRBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIHJldHVybiAoKHJlc29sdmVkQWJzb2x1dGUgPyAnLycgOiAnJykgKyByZXNvbHZlZFBhdGgpIHx8ICcuJztcbn07XG5cbi8vIHBhdGgubm9ybWFsaXplKHBhdGgpXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIGlzQWJzb2x1dGUgPSBleHBvcnRzLmlzQWJzb2x1dGUocGF0aCksXG4gICAgICB0cmFpbGluZ1NsYXNoID0gc3Vic3RyKHBhdGgsIC0xKSA9PT0gJy8nO1xuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICBwYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhaXNBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIGlmICghcGF0aCAmJiAhaXNBYnNvbHV0ZSkge1xuICAgIHBhdGggPSAnLic7XG4gIH1cbiAgaWYgKHBhdGggJiYgdHJhaWxpbmdTbGFzaCkge1xuICAgIHBhdGggKz0gJy8nO1xuICB9XG5cbiAgcmV0dXJuIChpc0Fic29sdXRlID8gJy8nIDogJycpICsgcGF0aDtcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMuaXNBYnNvbHV0ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgcmV0dXJuIHBhdGguY2hhckF0KDApID09PSAnLyc7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmpvaW4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHBhdGhzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgcmV0dXJuIGV4cG9ydHMubm9ybWFsaXplKGZpbHRlcihwYXRocywgZnVuY3Rpb24ocCwgaW5kZXgpIHtcbiAgICBpZiAodHlwZW9mIHAgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5qb2luIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH1cbiAgICByZXR1cm4gcDtcbiAgfSkuam9pbignLycpKTtcbn07XG5cblxuLy8gcGF0aC5yZWxhdGl2ZShmcm9tLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVsYXRpdmUgPSBmdW5jdGlvbihmcm9tLCB0bykge1xuICBmcm9tID0gZXhwb3J0cy5yZXNvbHZlKGZyb20pLnN1YnN0cigxKTtcbiAgdG8gPSBleHBvcnRzLnJlc29sdmUodG8pLnN1YnN0cigxKTtcblxuICBmdW5jdGlvbiB0cmltKGFycikge1xuICAgIHZhciBzdGFydCA9IDA7XG4gICAgZm9yICg7IHN0YXJ0IDwgYXJyLmxlbmd0aDsgc3RhcnQrKykge1xuICAgICAgaWYgKGFycltzdGFydF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICB2YXIgZW5kID0gYXJyLmxlbmd0aCAtIDE7XG4gICAgZm9yICg7IGVuZCA+PSAwOyBlbmQtLSkge1xuICAgICAgaWYgKGFycltlbmRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0ID4gZW5kKSByZXR1cm4gW107XG4gICAgcmV0dXJuIGFyci5zbGljZShzdGFydCwgZW5kIC0gc3RhcnQgKyAxKTtcbiAgfVxuXG4gIHZhciBmcm9tUGFydHMgPSB0cmltKGZyb20uc3BsaXQoJy8nKSk7XG4gIHZhciB0b1BhcnRzID0gdHJpbSh0by5zcGxpdCgnLycpKTtcblxuICB2YXIgbGVuZ3RoID0gTWF0aC5taW4oZnJvbVBhcnRzLmxlbmd0aCwgdG9QYXJ0cy5sZW5ndGgpO1xuICB2YXIgc2FtZVBhcnRzTGVuZ3RoID0gbGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGZyb21QYXJ0c1tpXSAhPT0gdG9QYXJ0c1tpXSkge1xuICAgICAgc2FtZVBhcnRzTGVuZ3RoID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHZhciBvdXRwdXRQYXJ0cyA9IFtdO1xuICBmb3IgKHZhciBpID0gc2FtZVBhcnRzTGVuZ3RoOyBpIDwgZnJvbVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgb3V0cHV0UGFydHMucHVzaCgnLi4nKTtcbiAgfVxuXG4gIG91dHB1dFBhcnRzID0gb3V0cHV0UGFydHMuY29uY2F0KHRvUGFydHMuc2xpY2Uoc2FtZVBhcnRzTGVuZ3RoKSk7XG5cbiAgcmV0dXJuIG91dHB1dFBhcnRzLmpvaW4oJy8nKTtcbn07XG5cbmV4cG9ydHMuc2VwID0gJy8nO1xuZXhwb3J0cy5kZWxpbWl0ZXIgPSAnOic7XG5cbmV4cG9ydHMuZGlybmFtZSA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHBhdGggPSBwYXRoICsgJyc7XG4gIGlmIChwYXRoLmxlbmd0aCA9PT0gMCkgcmV0dXJuICcuJztcbiAgdmFyIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoMCk7XG4gIHZhciBoYXNSb290ID0gY29kZSA9PT0gNDcgLyovKi87XG4gIHZhciBlbmQgPSAtMTtcbiAgdmFyIG1hdGNoZWRTbGFzaCA9IHRydWU7XG4gIGZvciAodmFyIGkgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPj0gMTsgLS1pKSB7XG4gICAgY29kZSA9IHBhdGguY2hhckNvZGVBdChpKTtcbiAgICBpZiAoY29kZSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgaWYgKCFtYXRjaGVkU2xhc2gpIHtcbiAgICAgICAgICBlbmQgPSBpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgLy8gV2Ugc2F3IHRoZSBmaXJzdCBub24tcGF0aCBzZXBhcmF0b3JcbiAgICAgIG1hdGNoZWRTbGFzaCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGlmIChlbmQgPT09IC0xKSByZXR1cm4gaGFzUm9vdCA/ICcvJyA6ICcuJztcbiAgaWYgKGhhc1Jvb3QgJiYgZW5kID09PSAxKSB7XG4gICAgLy8gcmV0dXJuICcvLyc7XG4gICAgLy8gQmFja3dhcmRzLWNvbXBhdCBmaXg6XG4gICAgcmV0dXJuICcvJztcbiAgfVxuICByZXR1cm4gcGF0aC5zbGljZSgwLCBlbmQpO1xufTtcblxuZnVuY3Rpb24gYmFzZW5hbWUocGF0aCkge1xuICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSBwYXRoID0gcGF0aCArICcnO1xuXG4gIHZhciBzdGFydCA9IDA7XG4gIHZhciBlbmQgPSAtMTtcbiAgdmFyIG1hdGNoZWRTbGFzaCA9IHRydWU7XG4gIHZhciBpO1xuXG4gIGZvciAoaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICBpZiAocGF0aC5jaGFyQ29kZUF0KGkpID09PSA0NyAvKi8qLykge1xuICAgICAgICAvLyBJZiB3ZSByZWFjaGVkIGEgcGF0aCBzZXBhcmF0b3IgdGhhdCB3YXMgbm90IHBhcnQgb2YgYSBzZXQgb2YgcGF0aFxuICAgICAgICAvLyBzZXBhcmF0b3JzIGF0IHRoZSBlbmQgb2YgdGhlIHN0cmluZywgc3RvcCBub3dcbiAgICAgICAgaWYgKCFtYXRjaGVkU2xhc2gpIHtcbiAgICAgICAgICBzdGFydCA9IGkgKyAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGVuZCA9PT0gLTEpIHtcbiAgICAgIC8vIFdlIHNhdyB0aGUgZmlyc3Qgbm9uLXBhdGggc2VwYXJhdG9yLCBtYXJrIHRoaXMgYXMgdGhlIGVuZCBvZiBvdXJcbiAgICAgIC8vIHBhdGggY29tcG9uZW50XG4gICAgICBtYXRjaGVkU2xhc2ggPSBmYWxzZTtcbiAgICAgIGVuZCA9IGkgKyAxO1xuICAgIH1cbiAgfVxuXG4gIGlmIChlbmQgPT09IC0xKSByZXR1cm4gJyc7XG4gIHJldHVybiBwYXRoLnNsaWNlKHN0YXJ0LCBlbmQpO1xufVxuXG4vLyBVc2VzIGEgbWl4ZWQgYXBwcm9hY2ggZm9yIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5LCBhcyBleHQgYmVoYXZpb3IgY2hhbmdlZFxuLy8gaW4gbmV3IE5vZGUuanMgdmVyc2lvbnMsIHNvIG9ubHkgYmFzZW5hbWUoKSBhYm92ZSBpcyBiYWNrcG9ydGVkIGhlcmVcbmV4cG9ydHMuYmFzZW5hbWUgPSBmdW5jdGlvbiAocGF0aCwgZXh0KSB7XG4gIHZhciBmID0gYmFzZW5hbWUocGF0aCk7XG4gIGlmIChleHQgJiYgZi5zdWJzdHIoLTEgKiBleHQubGVuZ3RoKSA9PT0gZXh0KSB7XG4gICAgZiA9IGYuc3Vic3RyKDAsIGYubGVuZ3RoIC0gZXh0Lmxlbmd0aCk7XG4gIH1cbiAgcmV0dXJuIGY7XG59O1xuXG5leHBvcnRzLmV4dG5hbWUgPSBmdW5jdGlvbiAocGF0aCkge1xuICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSBwYXRoID0gcGF0aCArICcnO1xuICB2YXIgc3RhcnREb3QgPSAtMTtcbiAgdmFyIHN0YXJ0UGFydCA9IDA7XG4gIHZhciBlbmQgPSAtMTtcbiAgdmFyIG1hdGNoZWRTbGFzaCA9IHRydWU7XG4gIC8vIFRyYWNrIHRoZSBzdGF0ZSBvZiBjaGFyYWN0ZXJzIChpZiBhbnkpIHdlIHNlZSBiZWZvcmUgb3VyIGZpcnN0IGRvdCBhbmRcbiAgLy8gYWZ0ZXIgYW55IHBhdGggc2VwYXJhdG9yIHdlIGZpbmRcbiAgdmFyIHByZURvdFN0YXRlID0gMDtcbiAgZm9yICh2YXIgaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICB2YXIgY29kZSA9IHBhdGguY2hhckNvZGVBdChpKTtcbiAgICBpZiAoY29kZSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgLy8gSWYgd2UgcmVhY2hlZCBhIHBhdGggc2VwYXJhdG9yIHRoYXQgd2FzIG5vdCBwYXJ0IG9mIGEgc2V0IG9mIHBhdGhcbiAgICAgICAgLy8gc2VwYXJhdG9ycyBhdCB0aGUgZW5kIG9mIHRoZSBzdHJpbmcsIHN0b3Agbm93XG4gICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XG4gICAgICAgICAgc3RhcnRQYXJ0ID0gaSArIDE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgaWYgKGVuZCA9PT0gLTEpIHtcbiAgICAgIC8vIFdlIHNhdyB0aGUgZmlyc3Qgbm9uLXBhdGggc2VwYXJhdG9yLCBtYXJrIHRoaXMgYXMgdGhlIGVuZCBvZiBvdXJcbiAgICAgIC8vIGV4dGVuc2lvblxuICAgICAgbWF0Y2hlZFNsYXNoID0gZmFsc2U7XG4gICAgICBlbmQgPSBpICsgMTtcbiAgICB9XG4gICAgaWYgKGNvZGUgPT09IDQ2IC8qLiovKSB7XG4gICAgICAgIC8vIElmIHRoaXMgaXMgb3VyIGZpcnN0IGRvdCwgbWFyayBpdCBhcyB0aGUgc3RhcnQgb2Ygb3VyIGV4dGVuc2lvblxuICAgICAgICBpZiAoc3RhcnREb3QgPT09IC0xKVxuICAgICAgICAgIHN0YXJ0RG90ID0gaTtcbiAgICAgICAgZWxzZSBpZiAocHJlRG90U3RhdGUgIT09IDEpXG4gICAgICAgICAgcHJlRG90U3RhdGUgPSAxO1xuICAgIH0gZWxzZSBpZiAoc3RhcnREb3QgIT09IC0xKSB7XG4gICAgICAvLyBXZSBzYXcgYSBub24tZG90IGFuZCBub24tcGF0aCBzZXBhcmF0b3IgYmVmb3JlIG91ciBkb3QsIHNvIHdlIHNob3VsZFxuICAgICAgLy8gaGF2ZSBhIGdvb2QgY2hhbmNlIGF0IGhhdmluZyBhIG5vbi1lbXB0eSBleHRlbnNpb25cbiAgICAgIHByZURvdFN0YXRlID0gLTE7XG4gICAgfVxuICB9XG5cbiAgaWYgKHN0YXJ0RG90ID09PSAtMSB8fCBlbmQgPT09IC0xIHx8XG4gICAgICAvLyBXZSBzYXcgYSBub24tZG90IGNoYXJhY3RlciBpbW1lZGlhdGVseSBiZWZvcmUgdGhlIGRvdFxuICAgICAgcHJlRG90U3RhdGUgPT09IDAgfHxcbiAgICAgIC8vIFRoZSAocmlnaHQtbW9zdCkgdHJpbW1lZCBwYXRoIGNvbXBvbmVudCBpcyBleGFjdGx5ICcuLidcbiAgICAgIHByZURvdFN0YXRlID09PSAxICYmIHN0YXJ0RG90ID09PSBlbmQgLSAxICYmIHN0YXJ0RG90ID09PSBzdGFydFBhcnQgKyAxKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIHJldHVybiBwYXRoLnNsaWNlKHN0YXJ0RG90LCBlbmQpO1xufTtcblxuZnVuY3Rpb24gZmlsdGVyICh4cywgZikge1xuICAgIGlmICh4cy5maWx0ZXIpIHJldHVybiB4cy5maWx0ZXIoZik7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGYoeHNbaV0sIGksIHhzKSkgcmVzLnB1c2goeHNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuXG4vLyBTdHJpbmcucHJvdG90eXBlLnN1YnN0ciAtIG5lZ2F0aXZlIGluZGV4IGRvbid0IHdvcmsgaW4gSUU4XG52YXIgc3Vic3RyID0gJ2FiJy5zdWJzdHIoLTEpID09PSAnYidcbiAgICA/IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHsgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbikgfVxuICAgIDogZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IHN0ci5sZW5ndGggKyBzdGFydDtcbiAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbik7XG4gICAgfVxuO1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG5pbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm9cIjtcbmltcG9ydCB7IHR5cGUsIHdhaXRGb3JTZWxlY3RvcnMgfSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkZElucHV0KGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHNlbGVjdG9ycyA9IGFjdGlvbi5wYXlsb2FkLnNlbGVjdG9ycyBhcyBpU2VsZWN0b3JJbmZvW107XG5cdFx0XHRjb25zdCBpbnB1dEtleXMgPSBhY3Rpb24ucGF5bG9hZC5tZXRhLnZhbHVlO1xuXG5cdFx0XHRjb25zdCBzZWxlY3RvciA9IGF3YWl0IHdhaXRGb3JTZWxlY3RvcnMocGFnZSwgc2VsZWN0b3JzKTtcblxuXHRcdFx0aWYoIXNlbGVjdG9yIHx8IHR5cGVvZiBzZWxlY3RvciAhPT0gXCJzdHJpbmdcIil7XG5cdFx0XHRcdHJldHVybiBlcnJvcihgSW52YWxpZCBzZWxlY3RvcmApO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBlbGVtZW50SGFuZGxlID0gYXdhaXQgcGFnZS4kKHNlbGVjdG9yIGFzIHN0cmluZyk7XG5cdFx0XHRpZiAoIWVsZW1lbnRIYW5kbGUpIHtcblx0XHRcdFx0cmV0dXJuIGVycm9yKFxuXHRcdFx0XHRcdGBBdHRlbXB0IHRvIHByZXNzIGtleWNvZGVzIG9uIGVsZW1lbnQgd2l0aCBpbnZhbGlkIHNlbGVjdG9yOiAke3NlbGVjdG9yfWAsXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cblx0XHRcdGF3YWl0IGVsZW1lbnRIYW5kbGUuc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCgpO1xuXHRcdFx0YXdhaXQgdHlwZShlbGVtZW50SGFuZGxlLCBpbnB1dEtleXMpO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBQcmVzc2VkIGtleXMgb24gdGhlIGVsZW1lbnQgJHtzZWxlY3Rvcn1gLFxuXHRcdFx0fSk7XG5cdFx0fSBjYXRjaChlcnIpe1xuXHRcdFx0cmV0dXJuIGVycm9yKFwiU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBhZGRpbmcgaW5wdXQgdG8gZWxlbWVudFwiKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiIGltcG9ydCB7YXNzZXJ0RWxlbWVudH0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xuIGltcG9ydCB7IHdhaXRGb3JTZWxlY3RvcnMgfSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XG4gaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG4gaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCIuLi8uLi8uLi9jcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb25cIjtcbiBpbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSBcIi4uLy4uLy4uL2NydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mb1wiO1xuXG4gZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYXNzZXJ0KGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHQgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdCB0cnl7XG5cdFx0XHQgY29uc3Qgc2VsZWN0b3JzID0gYWN0aW9uLnBheWxvYWQuc2VsZWN0b3JzIGFzIGlTZWxlY3RvckluZm9bXTtcblx0XHRcdCBjb25zdCBzZWxlY3RvciA9IGF3YWl0IHdhaXRGb3JTZWxlY3RvcnMocGFnZSwgc2VsZWN0b3JzKTtcblxuXHRcdFx0IGlmKCFzZWxlY3RvciB8fCB0eXBlb2Ygc2VsZWN0b3IgIT09IFwic3RyaW5nXCIpe1xuXHRcdFx0XHQgcmV0dXJuIGVycm9yKGBJbnZhbGlkIHNlbGVjdG9yYCk7XG5cdFx0XHQgfVxuXG5cdFx0XHQgY29uc3QgdmFsaWRhdGlvblJvd3MgPSBhY3Rpb24ucGF5bG9hZC5tZXRhLnZhbGlkYXRpb25Sb3dzO1xuXHRcdFx0IGNvbnN0IG91dHB1dCA9IGF3YWl0IGFzc2VydEVsZW1lbnQocGFnZSwgc2VsZWN0b3IsIHZhbGlkYXRpb25Sb3dzKTtcblxuXHRcdFx0IHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0IG1lc3NhZ2U6IGBTdWNjZXNzZnVsbHkgYXNzZXJ0ZWQgZWxlbWVudCAke3NlbGVjdG9yfWAsXG5cdFx0XHRcdCBtZXRhOiB7b3V0cHV0fVxuXHRcdFx0IH0pO1xuXHRcdCB9IGNhdGNoKGVycil7XG5cdFx0IFx0Y29uc29sZS5lcnJvcihlcnIpO1xuXHRcdFx0IHJldHVybiBlcnJvcihcIlNvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgYXNzZXJ0aW5nIGVsZW1lbnRcIik7XG5cdFx0IH1cblx0IH0pO1xuIH1cbiIsImltcG9ydCB7IHdhaXRGb3JTZWxlY3RvcnMgfSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNsaWNrKGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5e1xuXHRcdGNvbnN0IHNlbGVjdG9ycyA9IGFjdGlvbi5wYXlsb2FkLnNlbGVjdG9ycyBhcyBpU2VsZWN0b3JJbmZvW107XG5cdFx0Y29uc3Qgc2VsZWN0b3IgPSBhd2FpdCB3YWl0Rm9yU2VsZWN0b3JzKHBhZ2UsIHNlbGVjdG9ycyk7XG5cblx0XHRpZighc2VsZWN0b3IgfHwgdHlwZW9mIHNlbGVjdG9yICE9PSBcInN0cmluZ1wiKXtcblx0XHRcdHJldHVybiBlcnJvcihgSW52YWxpZCBzZWxlY3RvcmApO1xuXHRcdH1cblx0XHRjb25zdCBlbGVtZW50SGFuZGxlID0gYXdhaXQgcGFnZS4kKHNlbGVjdG9yIGFzIHN0cmluZyk7XG5cdFx0aWYgKCFlbGVtZW50SGFuZGxlKSB7XG5cdFx0XHRyZXR1cm4gZXJyb3IoYE5vIGVsZW1lbnQgd2l0aCBzZWxlY3RvciBhcyAke3NlbGVjdG9yfSBleGlzdHNgKTtcblx0XHR9XG5cblx0XHRhd2FpdCBlbGVtZW50SGFuZGxlLnNjcm9sbEludG9WaWV3SWZOZWVkZWQoKTtcblx0XHRhd2FpdCBlbGVtZW50SGFuZGxlLmRpc3BhdGNoRXZlbnQoXCJjbGlja1wiKTtcblxuXHRcdC8vIElmIHVuZGVyIG5hdmlnYXRpb24gd2FpdCBmb3IgbG9hZCBzdGF0ZSB0byBjb21wbGV0ZS5cblx0XHRhd2FpdCBwYWdlLndhaXRGb3JMb2FkU3RhdGUoKTtcblxuXHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdG1lc3NhZ2U6IGBDbGlja2VkIG9uIHRoZSBlbGVtZW50ICR7c2VsZWN0b3J9YCxcblx0XHR9KTtcblx0XHR9IGNhdGNoKGVycil7XG5cdFx0XHRyZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIGNsaWNraW5nIG9uIGVsZW1lbnRcIik7XG5cdFx0fVxuXHR9KTtcbn1cbiIsImltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tICdAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvJztcbmltcG9ydCB7IHdhaXRGb3JTZWxlY3RvcnMgfSBmcm9tICcuLi9mdW5jdGlvbnMnO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gJ3BsYXl3cmlnaHQnO1xuaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gJ0BjcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb24nO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcblxuZnVuY3Rpb24gZ2VuZXJhdGVTY3JlZW5zaG90TmFtZShzZWxlY3Rvcjogc3RyaW5nLCBzdGVwSW5kZXg6IG51bWJlcik6IHN0cmluZyB7XG5cdHJldHVybiBzZWxlY3Rvci5yZXBsYWNlKC9bXlxcd1xcc10vZ2ksICcnKS5yZXBsYWNlKC8gL2csICdfJykgKyBgXyR7c3RlcEluZGV4fS5wbmdgO1xufVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZWxlbWVudFNjcmVlbnNob3QoYWN0aW9uOiBpQWN0aW9uLCBwYWdlOiBQYWdlLCBzdGVwSW5kZXg6IG51bWJlciwgYXNzZXRzRGlyOiBzdHJpbmcpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBzZWxlY3RvcnMgPSBhY3Rpb24ucGF5bG9hZC5zZWxlY3RvcnMgYXMgaVNlbGVjdG9ySW5mb1tdO1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3IgPSBhd2FpdCB3YWl0Rm9yU2VsZWN0b3JzKHBhZ2UsIHNlbGVjdG9ycyk7XG5cblx0XHRcdGlmICghc2VsZWN0b3IgfHwgdHlwZW9mIHNlbGVjdG9yICE9PSAnc3RyaW5nJykge1xuXHRcdFx0XHRyZXR1cm4gZXJyb3IoYEludmFsaWQgc2VsZWN0b3JgKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZWxlbWVudEhhbmRsZSA9IGF3YWl0IHBhZ2UuJChzZWxlY3RvciBhcyBzdHJpbmcpO1xuXHRcdFx0aWYgKCFlbGVtZW50SGFuZGxlKSB7XG5cdFx0XHRcdHJldHVybiBlcnJvcihgQXR0ZW1wdCB0byBjYXB0dXJlIHNjcmVlbnNob3Qgb2YgZWxlbWVudCB3aXRoIGludmFsaWQgc2VsZWN0b3I6ICR7c2VsZWN0b3J9YCk7XG5cdFx0XHR9XG5cblx0XHRcdGF3YWl0IGVsZW1lbnRIYW5kbGUuc2NyZWVuc2hvdCh7XG5cdFx0XHRcdHBhdGg6IHBhdGgucmVzb2x2ZShhc3NldHNEaXIsIGdlbmVyYXRlU2NyZWVuc2hvdE5hbWUoc2VsZWN0b3IgYXMgc3RyaW5nLCBzdGVwSW5kZXgpKSxcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBDYXB0dXJlZCBlbGVtZW50IHNjcmVlbnNob3QgZm9yICR7c2VsZWN0b3J9YCxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0cmV0dXJuIGVycm9yKCdTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIGNhcHR1cmluZyBzY3JlZW5zaG90IG9mIGVsZW1lbnQnKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5pbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb25cIjtcbmltcG9ydCB7IHNjcm9sbCwgd2FpdEZvclNlbGVjdG9ycyB9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcbmltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mb1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjYXB0dXJlUGFnZVNjcmVlbnNob3QoYWN0aW9uOiBpQWN0aW9uLCBwYWdlOiBQYWdlKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3JzID0gYWN0aW9uLnBheWxvYWQuc2VsZWN0b3JzIGFzIGlTZWxlY3RvckluZm9bXTtcblx0XHRcdGNvbnN0IHNlbGVjdG9yID0gYXdhaXQgd2FpdEZvclNlbGVjdG9ycyhwYWdlLCBzZWxlY3RvcnMpO1xuXG5cdFx0XHRpZighc2VsZWN0b3IgfHwgdHlwZW9mIHNlbGVjdG9yICE9PSBcInN0cmluZ1wiKXtcblx0XHRcdFx0cmV0dXJuIGVycm9yKGBJbnZhbGlkIHNlbGVjdG9yYCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghc2VsZWN0b3IpIHtcblx0XHRcdFx0cmV0dXJuIGVycm9yKGBBdHRlbXB0IHRvIHNjcm9sbCBlbGVtZW50IHdpdGggaW52YWxpZCBzZWxlY3RvcjogJHtzZWxlY3Rvcn1gKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc2Nyb2xsRGVsdGEgPSBhY3Rpb24ucGF5bG9hZC5tZXRhLnZhbHVlO1xuXHRcdFx0Y29uc3QgcGFnZVVybCA9IGF3YWl0IHBhZ2UudXJsKCk7XG5cdFx0XHRhd2FpdCBzY3JvbGwocGFnZSwgc2VsZWN0b3IsIHNjcm9sbERlbHRhKTtcblxuXHRcdFx0cmV0dXJuIHN1Y2Nlc3Moe1xuXHRcdFx0XHRtZXNzYWdlOiBgU2Nyb2xsZWQgc3VjY2Vzc2Z1bGx5IG9uICR7cGFnZVVybH1gLFxuXHRcdFx0fSk7XG5cdFx0fSBjYXRjaChlcnIpe1xuXHRcdFx0cmV0dXJuIGVycm9yKFwiU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBzY3JvbGxpbmcgb24gZWxlbWVudFwiKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgd2FpdEZvclNlbGVjdG9ycyB9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG5pbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm9cIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaG92ZXIoYWN0aW9uOiBpQWN0aW9uLCBwYWdlOiBQYWdlKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3JzID0gYWN0aW9uLnBheWxvYWQuc2VsZWN0b3JzIGFzIGlTZWxlY3RvckluZm9bXTtcblx0XHRcdGNvbnN0IHNlbGVjdG9yID0gYXdhaXQgd2FpdEZvclNlbGVjdG9ycyhwYWdlLCBzZWxlY3RvcnMpO1xuXG5cblx0XHRcdGlmKCFzZWxlY3RvciB8fCB0eXBlb2Ygc2VsZWN0b3IgIT09IFwic3RyaW5nXCIpe1xuXHRcdFx0XHRyZXR1cm4gZXJyb3IoYEludmFsaWQgc2VsZWN0b3JgKTtcblx0XHRcdH1cblxuXHRcdFx0YXdhaXQgcGFnZS5ob3ZlcihzZWxlY3Rvcik7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogYEhvdmVyZWQgb24gdGhlIGVsZW1lbnQgJHtzZWxlY3Rvcn1gLFxuXHRcdFx0fSk7XG5cdFx0fSBjYXRjaChlcnIpe1xuXHRcdFx0cmV0dXJuIGVycm9yKFwiU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBob3ZlcmluZyBvbiBlbGVtZW50XCIpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgYWRkSW5wdXQgZnJvbSBcIi4vYWRkSW5wdXRcIjtcbmltcG9ydCBjbGljayBmcm9tIFwiLi9jbGlja1wiO1xuaW1wb3J0IGhvdmVyIGZyb20gXCIuL2hvdmVyXCI7XG5pbXBvcnQgY2FwdHVyZUVsZW1lbnRTY3JlZW5zaG90IGZyb20gXCIuL2VsZW1lbnRTY3JlZW5zaG90XCI7XG5pbXBvcnQgY2FwdHVyZVBhZ2VTY3JlZW5zaG90IGZyb20gXCIuL3BhZ2VTY3JlZW5zaG90XCI7XG5pbXBvcnQgZWxlbWVudFNjcm9sbCBmcm9tIFwiLi9lbGVtZW50U2Nyb2xsXCI7XG5pbXBvcnQgcGFnZVNjcm9sbCBmcm9tIFwiLi9wYWdlU2Nyb2xsXCI7XG5pbXBvcnQgbmF2aWdhdGVVcmwgZnJvbSBcIi4vbmF2aWdhdGVVcmxcIjtcbmltcG9ydCBzZXREZXZpY2UgZnJvbSBcIi4vc2V0RGV2aWNlXCI7XG5pbXBvcnQgYXNzZXJ0RWxlbWVudCBmcm9tICcuL2Fzc2VydEVsZW1lbnQnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0RWxlbWVudDoge1xuXHRcdGFkZElucHV0LFxuXHRcdGNsaWNrLFxuXHRcdGhvdmVyLFxuXHRcdHNjcm9sbDogZWxlbWVudFNjcm9sbCxcblx0XHRzY3JlZW5zaG90OiBjYXB0dXJlRWxlbWVudFNjcmVlbnNob3QsXG5cdFx0ZWxlbWVudFNjcm9sbCxcblx0XHRhc3NlcnRFbGVtZW50XG5cdH0sXG5cdFBhZ2U6IHtcblx0XHRzY3JlZW5zaG90OiBjYXB0dXJlUGFnZVNjcmVlbnNob3QsXG5cdFx0c2Nyb2xsOiBwYWdlU2Nyb2xsLFxuXHRcdG5hdmlnYXRlOiBuYXZpZ2F0ZVVybCxcblx0fSxcblx0QnJvd3Nlcjoge1xuXHRcdHNldERldmljZSxcblx0fSxcbn07XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSAncGxheXdyaWdodCc7XG5pbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSAnQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIG5hdmlnYXRlVXJsKGFjdGlvbjogaUFjdGlvbiwgcGFnZTogUGFnZSkge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHVybFRvR28gPSBhY3Rpb24ucGF5bG9hZC5tZXRhLnZhbHVlO1xuXG5cdFx0XHRhd2FpdCBwYWdlLmdvdG8odXJsVG9Hbyk7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogYE5hdmlnYXRlZCBzdWNjZXNzZnVsbHkgdG8gJHt1cmxUb0dvfWAsXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyKTtcblx0XHRcdHJldHVybiBlcnJvcignU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBuYXZpZ2F0aW5nIHRvIHdlYnBhZ2UnKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgUGFnZSB9IGZyb20gJ3BsYXl3cmlnaHQnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcblxuZnVuY3Rpb24gZ2VuZXJhdGVQYWdlU2NyZWVuc2hvdE5hbWUodGl0bGU6IHN0cmluZywgc3RlcEluZGV4OiBudW1iZXIpOiBzdHJpbmcge1xuXHRyZXR1cm4gdGl0bGUucmVwbGFjZSgvW15cXFxcd1xcXFxzXS9naSwgJycpLnJlcGxhY2UoLyAvZywgJ18nKSArIGBfJHtzdGVwSW5kZXh9LnBuZ2A7XG59XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjYXB0dXJlUGFnZVNjcmVlbnNob3QocGFnZTogUGFnZSwgc3RlcEluZGV4OiBudW1iZXIsIGFzc2V0c0Rpcjogc3RyaW5nKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgcGFnZVRpdGxlID0gYXdhaXQgcGFnZS50aXRsZSgpO1xuXHRcdFx0Y29uc3QgcGFnZVVybCA9IGF3YWl0IHBhZ2UudXJsKCk7XG5cdFx0XHRhd2FpdCBwYWdlLnNjcmVlbnNob3QoeyBwYXRoOiBwYXRoLnJlc29sdmUoYXNzZXRzRGlyLCBnZW5lcmF0ZVBhZ2VTY3JlZW5zaG90TmFtZShwYWdlVGl0bGUsIHN0ZXBJbmRleCkpIH0pO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBDbGlja2VkIHBhZ2Ugc2NyZWVuc2hvdCBmb3IgJHtwYWdlVXJsfWAsXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdHJldHVybiBlcnJvcignU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBjYXB0dXJpbmcgc2NyZWVuc2hvdCBvZiBwYWdlJyk7XG5cdFx0fVxuXHR9KTtcbn1cbiIsImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG5pbXBvcnQgeyBzY3JvbGwgfSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNhcHR1cmVQYWdlU2NyZWVuc2hvdChhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBzY3JvbGxEZWx0YSA9IGFjdGlvbi5wYXlsb2FkLm1ldGEudmFsdWU7XG5cdFx0XHRjb25zdCBwYWdlVXJsID0gYXdhaXQgcGFnZS51cmwoKTtcblx0XHRcdGF3YWl0IHNjcm9sbChwYWdlLCBcIndpbmRvd1wiLCBzY3JvbGxEZWx0YSk7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogYFNjcm9sbGVkIHN1Y2Nlc3NmdWxseSBvbiAke3BhZ2VVcmx9YCxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2goZXJyKXtcblx0XHRcdHJldHVybiBlcnJvcihcIlNvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgc2Nyb2xsaW5nIHRoZSBwYWdlXCIpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb25cIjtcbmltcG9ydCB7IGlEZXZpY2UgfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2V4dGVuc2lvbi9kZXZpY2VcIjtcbmltcG9ydCB7IGlVc2VyQWdlbnQgfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL2NvbnN0YW50cy91c2VyQWdlbnRzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHNldERldmljZShhY3Rpb246IGlBY3Rpb24pIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBkZXZpY2UgPSBhY3Rpb24ucGF5bG9hZC5tZXRhLmRldmljZSBhcyBpRGV2aWNlO1xuXHRcdFx0Y29uc3QgdXNlckFnZW50ID0gYWN0aW9uLnBheWxvYWQubWV0YS51c2VyQWdlbnQgYXMgaVVzZXJBZ2VudDtcblxuXHRcdFx0cmV0dXJuIHN1Y2Nlc3Moe1xuXHRcdFx0XHRtZXNzYWdlOiBcIlNldHVwIGRldmljZSBmb3IgdGVzdGluZ1wiLFxuXHRcdFx0XHRtZXRhOiB7XG5cdFx0XHRcdFx0d2lkdGg6IGRldmljZS53aWR0aCxcblx0XHRcdFx0XHRoZWlnaHQ6IGRldmljZS5oZWlnaHQsXG5cdFx0XHRcdFx0dXNlckFnZW50OiB1c2VyQWdlbnQudmFsdWUsXG5cdFx0XHRcdH0sXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoKGVycil7XG5cdFx0XHRyZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIHNldHRpbmcgdGhlIGRldmljZVwiKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5pbXBvcnQgeyBpQXNzZXJ0aW9uUm93IH0gZnJvbSAnLi4vLi4vLi4vY3J1c2hlci1zaGFyZWQvdHlwZXMvYXNzZXJ0aW9uUm93JztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gYXNzZXJ0RWxlbWVudEF0dHJpYnV0ZXMocGFnZTogUGFnZSwgc2VsZWN0b3I6IHN0cmluZywgYXNzZXJ0aW9uczogQXJyYXk8aUFzc2VydGlvblJvdz4pe1xuXHRjb25zdCBlbEhhbmRsZSA9IGF3YWl0IHBhZ2UuJChzZWxlY3Rvcik7XG5cdGxldCBoYXNQYXNzZWQgPSB0cnVlO1xuXHRjb25zdCBsb2dzID0gW107XG5cblx0Zm9yKGxldCBpID0gMDsgaSA8IGFzc2VydGlvbnMubGVuZ3RoOyBpKyspIHtcblx0XHRjb25zdCB7dmFsaWRhdGlvbiwgb3BlcmF0aW9uLCBmaWVsZH0gPSBhc3NlcnRpb25zW2ldO1xuXHRcdGNvbnN0IGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZSA9IGF3YWl0IGVsSGFuZGxlIS5nZXRBdHRyaWJ1dGUoZmllbGQubmFtZSk7XG5cdFx0aWYob3BlcmF0aW9uID09PSBcIm1hdGNoZXNcIikge1xuXHRcdFx0aWYoZWxlbWVudEF0dHJpYnV0ZVZhbHVlICE9PSB2YWxpZGF0aW9uKXtcblx0XHRcdFx0aGFzUGFzc2VkID0gZmFsc2U7XG5cdFx0XHRcdGxvZ3MucHVzaCh7c3RhdHVzOiBcIkZBSUxFRFwiLCBtZXNzYWdlOiBcIkZhaWxlZCB0byBhc3NlcnQgYXR0cmlidXRlPVwiK3ZhbGlkYXRpb24rXCIgb2YgXCIgKyBzZWxlY3RvciArIFwiXCIsIG1ldGE6IHtvcGVyYXRpb24sIHZhbHVlVG9NYXRjaDogdmFsaWRhdGlvbiwgZmllbGQ6IGZpZWxkLm5hbWUsIGVsZW1lbnRWYWx1ZTogZWxlbWVudEF0dHJpYnV0ZVZhbHVlfX0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGxvZ3MucHVzaCh7c3RhdHVzOiBcIkRPTkVcIiwgbWVzc2FnZTogXCJBc3NlcnRlZCBhdHRyaWJ1dGU9XCIrdmFsaWRhdGlvbitcIiBvZiBcIiArIHNlbGVjdG9yICsgXCJcIiwgbWV0YToge29wZXJhdGlvbiwgdmFsdWVUb01hdGNoOiB2YWxpZGF0aW9uLCBmaWVsZDogZmllbGQubmFtZSwgZWxlbWVudFZhbHVlOiBlbGVtZW50QXR0cmlidXRlVmFsdWV9fSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmKG9wZXJhdGlvbiA9PT0gXCJjb250YWluc1wiKSB7XG5cdFx0XHRjb25zdCBkb2VzQ29udGFpbiA9ICBlbGVtZW50QXR0cmlidXRlVmFsdWUhLmluY2x1ZGVzKHZhbGlkYXRpb24pO1xuXHRcdFx0aWYoIWRvZXNDb250YWluICl7XG5cdFx0XHRcdGhhc1Bhc3NlZCA9IGZhbHNlO1xuXHRcdFx0XHRsb2dzLnB1c2goe3N0YXR1czogXCJGQUlMRURcIiwgbWVzc2FnZTogXCJGYWlsZWQgdG8gYXNzZXJ0IGF0dHJpYnV0ZSBjb250YWlucyBcIit2YWxpZGF0aW9uK1wiIG9mIFwiICsgc2VsZWN0b3IgKyBcIlwiLCBtZXRhOiB7b3BlcmF0aW9uLCB2YWx1ZVRvTWF0Y2g6IHZhbGlkYXRpb24sIGZpZWxkOiBmaWVsZC5uYW1lLCBlbGVtZW50VmFsdWU6IGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZX19KTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRsb2dzLnB1c2goe3N0YXR1czogXCJET05FXCIsIG1lc3NhZ2U6IFwiQXNzZXJ0ZWQgYXR0cmlidXRlIGNvbnRhaW5zIFwiK3ZhbGlkYXRpb24rXCIgb2YgXCIgKyBzZWxlY3RvciArIFwiXCIsIG1ldGE6IHtvcGVyYXRpb24sIHZhbHVlVG9NYXRjaDogdmFsaWRhdGlvbiwgZmllbGQ6IGZpZWxkLm5hbWUsIGVsZW1lbnRWYWx1ZTogZWxlbWVudEF0dHJpYnV0ZVZhbHVlfX0pO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZihvcGVyYXRpb24gPT09IFwicmVnZXhcIiApe1xuXHRcdFx0Y29uc3Qgcmd4ID0gbmV3IFJlZ0V4cCh2YWxpZGF0aW9uKTtcblx0XHRcdGlmICghcmd4LnRlc3QoZWxlbWVudEF0dHJpYnV0ZVZhbHVlISkpIHtcblx0XHRcdFx0aGFzUGFzc2VkID0gZmFsc2U7XG5cdFx0XHRcdGxvZ3MucHVzaCh7c3RhdHVzOiBcIkZBSUxFRFwiLCBtZXNzYWdlOiBcIkZhaWxlZCB0byBhc3NlcnQgYXR0cmlidXRlIG1hdGNoZXMgcmVnZXg6IFwiK3ZhbGlkYXRpb24rXCIgb2YgXCIgKyBzZWxlY3RvciArIFwiXCIsIG1ldGE6IHtvcGVyYXRpb24sIHZhbHVlVG9NYXRjaDogdmFsaWRhdGlvbiwgZmllbGQ6IGZpZWxkLm5hbWUsIGVsZW1lbnRWYWx1ZTogZWxlbWVudEF0dHJpYnV0ZVZhbHVlfX0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bG9ncy5wdXNoKHtzdGF0dXM6IFwiRE9ORVwiLCBtZXNzYWdlOiBcIkFzc2VydGVkIGF0dHJpYnV0ZSBtYXRjaGVzIHJlZ2V4OiBcIit2YWxpZGF0aW9uK1wiIG9mIFwiICsgc2VsZWN0b3IgKyBcIlwiLCBtZXRhOiB7b3BlcmF0aW9uLCB2YWx1ZVRvTWF0Y2g6IHZhbGlkYXRpb24sIGZpZWxkOiBmaWVsZC5uYW1lLCBlbGVtZW50VmFsdWU6IGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZX19KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gW2hhc1Bhc3NlZCwgbG9nc107XG59XG4iLCJpbXBvcnQgc2Nyb2xsIGZyb20gXCIuL3Njcm9sbFwiO1xuaW1wb3J0IHR5cGUgZnJvbSBcIi4vdHlwZVwiO1xuaW1wb3J0IHdhaXRGb3JTZWxlY3RvcnMgZnJvbSBcIi4vd2FpdEZvclNlbGVjdG9yc1wiO1xuaW1wb3J0IHNsZWVwIGZyb20gXCIuL3NsZWVwXCI7XG5pbXBvcnQgYXNzZXJ0RWxlbWVudCBmcm9tICcuL2Fzc2VydEVsZW1lbnQnO1xuXG5leHBvcnQgeyBzY3JvbGwsIHR5cGUsIHdhaXRGb3JTZWxlY3RvcnMsIHNsZWVwLCBhc3NlcnRFbGVtZW50IH07XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gc2Nyb2xsKFxuXHRwYWdlOiBQYWdlLFxuXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRzY3JvbGxEZWx0YUFycjogQXJyYXk8bnVtYmVyPixcbikge1xuXHRhd2FpdCBwYWdlLmV2YWx1YXRlKFxuXHRcdCAoW3Njcm9sbERlbHRhQXJyLCBzZWxlY3RvcktleV06IFtudW1iZXJbXSwgc3RyaW5nXSkgPT4ge1xuXHRcdFx0Y29uc3Qgc2Nyb2xsVG8gPSAgZnVuY3Rpb24gKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBvZmZzZXQ6IG51bWJlcikge1xuXHRcdFx0XHRjb25zdCBmaXhlZE9mZnNldCA9IG9mZnNldC50b0ZpeGVkKCk7XG5cdFx0XHRcdGNvbnN0IG9uU2Nyb2xsID0gKCkgPT4ge1xuXHRcdFx0XHRcdGlmICgoZWxlbWVudCBhcyBhbnkpLnBhZ2VZT2Zmc2V0LnRvRml4ZWQoKSA9PT0gZml4ZWRPZmZzZXQpIHtcblx0XHRcdFx0XHRcdGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBvblNjcm9sbCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBvblNjcm9sbCk7XG5cdFx0XHRcdG9uU2Nyb2xsKCk7XG5cdFx0XHRcdGVsZW1lbnQuc2Nyb2xsVG8oe1xuXHRcdFx0XHRcdHRvcDogb2Zmc2V0LFxuXHRcdFx0XHRcdGJlaGF2aW9yOiBcInNtb290aFwiLFxuXHRcdFx0XHR9KTtcblx0XHRcdH07XG5cblx0XHRcdGNvbnN0IGVsZW1lbnQgPVxuXHRcdFx0XHRzZWxlY3RvcktleSA9PT0gXCJ3aW5kb3dcIiA/IHdpbmRvdyA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JLZXkpO1xuXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNjcm9sbERlbHRhQXJyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdCBzY3JvbGxUbyhlbGVtZW50IGFzIEhUTUxFbGVtZW50LCBzY3JvbGxEZWx0YUFycltpXSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRbc2Nyb2xsRGVsdGFBcnIsIHNlbGVjdG9yXSxcblx0KTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNsZWVwKHRpbWU6IG51bWJlcikge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHJlc29sdmUodHJ1ZSk7XG5cdFx0fSwgdGltZSk7XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgRWxlbWVudEhhbmRsZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHR5cGUoXG5cdGVsSGFuZGxlOiBFbGVtZW50SGFuZGxlLFxuXHRrZXlDb2RlczogQXJyYXk8bnVtYmVyPixcbikge1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGtleUNvZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0YXdhaXQgZWxIYW5kbGUucHJlc3MoU3RyaW5nLmZyb21DaGFyQ29kZShrZXlDb2Rlc1tpXSkpO1xuXHR9XG5cdHJldHVybiB0cnVlO1xufVxuIiwiaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvXCI7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGdlbmVyYXRlUXVlcnlTZWxlY3RvciwgZ2V0RWxlbWVudHNCeVhQYXRoIH0gZnJvbSBcIi4uL3V0aWxzL2RvbVwiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiB3YWl0Rm9yU2VsZWN0b3JzKFxuXHRwYWdlOiBQYWdlLFxuXHRzZWxlY3RvcnM6IEFycmF5PGlTZWxlY3RvckluZm8+LFxuXHRkZWZhdWx0U2VsZWN0b3IgPSBudWxsIGFzIHN0cmluZyB8IG51bGwsXG4pIHtcblx0aWYgKCFkZWZhdWx0U2VsZWN0b3IpIHtcblx0XHRkZWZhdWx0U2VsZWN0b3IgPSBzZWxlY3RvcnNbMF0udmFsdWU7XG5cdH1cblxuXHR0cnkge1xuXHRcdGF3YWl0IHBhZ2Uud2FpdEZvclNlbGVjdG9yKGRlZmF1bHRTZWxlY3RvciwgeyBzdGF0ZTogXCJhdHRhY2hlZFwiIH0pO1xuXHRcdHJldHVybiBkZWZhdWx0U2VsZWN0b3I7XG5cdH0gY2F0Y2gge1xuXHRcdGNvbnN0IHZhbGlkU2VsZWN0b3IgPSBhd2FpdCBwYWdlLmV2YWx1YXRlKChzZWxlY3RvcnMpID0+IHtcblx0XHRcdGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0aWYgKHNlbGVjdG9yLnR5cGUgPT09IFwieHBhdGhcIikge1xuXHRcdFx0XHRcdFx0Y29uc3QgZWxlbWVudHMgPSBnZXRFbGVtZW50c0J5WFBhdGgoc2VsZWN0b3IudmFsdWUpO1xuXHRcdFx0XHRcdFx0aWYgKGVsZW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBlbGVtZW50U2VsZWN0b3JGcm9tWHBhdGggPSBnZW5lcmF0ZVF1ZXJ5U2VsZWN0b3IoXG5cdFx0XHRcdFx0XHRcdFx0ZWxlbWVudHNbMF0gYXMgSFRNTEVsZW1lbnQsXG5cdFx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIGVsZW1lbnRTZWxlY3RvckZyb21YcGF0aDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2UgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IudmFsdWUpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gc2VsZWN0b3IudmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoIChleCkge1xuXHRcdFx0XHRcdGNvbnNvbGUuZGVidWcoXCJDYXVnaHQgZXhjZXB0aW9uXCIsIGV4KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fSwgc2VsZWN0b3JzKTtcblx0XHRpZiAodHlwZW9mIHZhbGlkU2VsZWN0b3IgPT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIlRoaXMgaXMgbm90IHdvcmtpbmdcIik7XG5cdFx0fVxuXHRcdHJldHVybiB2YWxpZFNlbGVjdG9yO1xuXHR9XG59XG4iLCJjb25zdCBnZXRFbGVtZW50c0J5WFBhdGggPSAoXG5cdHhwYXRoOiBzdHJpbmcsXG5cdHBhcmVudDogTm9kZSB8IG51bGwgPSBudWxsLFxuKTogTm9kZVtdID0+IHtcblx0Y29uc3QgcmVzdWx0cyA9IFtdO1xuXHRjb25zdCBxdWVyeSA9IGRvY3VtZW50LmV2YWx1YXRlKFxuXHRcdHhwYXRoLFxuXHRcdHBhcmVudCB8fCBkb2N1bWVudCxcblx0XHRudWxsLFxuXHRcdFhQYXRoUmVzdWx0Lk9SREVSRURfTk9ERV9TTkFQU0hPVF9UWVBFLFxuXHRcdG51bGwsXG5cdCk7XG5cdGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBxdWVyeS5zbmFwc2hvdExlbmd0aDsgaSA8IGxlbmd0aDsgKytpKSB7XG5cdFx0Y29uc3QgaXRlbSA9IHF1ZXJ5LnNuYXBzaG90SXRlbShpKTtcblx0XHRpZiAoaXRlbSkgcmVzdWx0cy5wdXNoKGl0ZW0pO1xuXHR9XG5cdHJldHVybiByZXN1bHRzO1xufTtcblxuY29uc3QgZ2VuZXJhdGVRdWVyeVNlbGVjdG9yID0gKGVsOiBIVE1MRWxlbWVudCk6IHN0cmluZyA9PiB7XG5cdGlmIChlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT0gXCJodG1sXCIpIHJldHVybiBcIkhUTUxcIjtcblx0bGV0IHN0ciA9IGVsLnRhZ05hbWU7XG5cdHN0ciArPSBlbC5pZCAhPSBcIlwiID8gXCIjXCIgKyBlbC5pZCA6IFwiXCI7XG5cdGlmIChlbC5jbGFzc05hbWUpIHtcblx0XHRjb25zdCBjbGFzc2VzID0gZWwuY2xhc3NOYW1lLnNwbGl0KC9cXHMvKTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHN0ciArPSBcIi5cIiArIGNsYXNzZXNbaV07XG5cdFx0fVxuXHR9XG5cdHJldHVybiBnZW5lcmF0ZVF1ZXJ5U2VsZWN0b3IoKGVsIGFzIGFueSkucGFyZW50Tm9kZSkgKyBcIiA+IFwiICsgc3RyO1xufTtcblxuZXhwb3J0IHsgZ2V0RWxlbWVudHNCeVhQYXRoLCBnZW5lcmF0ZVF1ZXJ5U2VsZWN0b3IgfTtcbiJdLCJzb3VyY2VSb290IjoiIn0=