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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
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
let screenshotIndex = 0;
function generateScreenshotName(selector) {
    return selector.replace(/[^\w\s]/gi, '').replace(/ /g, '_') + `_${screenshotIndex++}.png`;
}
function elementScreenshot(action, page, assetsDir) {
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
                path: path.resolve(assetsDir, generateScreenshotName(selector)),
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
            return error("Some issue occurred while navigating to webpage");
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
let screenshotIndex = 0;
function generatePageScreenshotName(title) {
    return title.replace(/[^\\w\\s]/gi, '').replace(/ /g, '_') + `_${screenshotIndex++}.png`;
}
function capturePageScreenshot(page, assetsDir) {
    return new Promise(async (success, error) => {
        try {
            const pageTitle = await page.title();
            const pageUrl = await page.url();
            await page.screenshot({ path: path.resolve(assetsDir, generatePageScreenshotName(pageTitle)) });
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

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
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
const actions = __importStar(__webpack_require__(/*! ./actions */ "./src/actions/index.ts"));
module.exports = actions;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy91dGthcnNoL0Rlc2t0b3AvY3J1c2hlci9jcnVzaGVyL25vZGVfbW9kdWxlcy9wYXRoLWJyb3dzZXJpZnkvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy91dGthcnNoL0Rlc2t0b3AvY3J1c2hlci9jcnVzaGVyL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FjdGlvbnMvYWRkSW5wdXQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FjdGlvbnMvYXNzZXJ0RWxlbWVudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYWN0aW9ucy9jbGljay50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYWN0aW9ucy9lbGVtZW50U2NyZWVuc2hvdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYWN0aW9ucy9lbGVtZW50U2Nyb2xsLnRzIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb25zL2hvdmVyLnRzIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb25zL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb25zL25hdmlnYXRlVXJsLnRzIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb25zL3BhZ2VTY3JlZW5zaG90LnRzIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb25zL3BhZ2VTY3JvbGwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FjdGlvbnMvc2V0RGV2aWNlLnRzIiwid2VicGFjazovLy8uL3NyYy9mdW5jdGlvbnMvYXNzZXJ0RWxlbWVudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZnVuY3Rpb25zL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9mdW5jdGlvbnMvc2Nyb2xsLnRzIiwid2VicGFjazovLy8uL3NyYy9mdW5jdGlvbnMvc2xlZXAudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Z1bmN0aW9ucy90eXBlLnRzIiwid2VicGFjazovLy8uL3NyYy9mdW5jdGlvbnMvd2FpdEZvclNlbGVjdG9ycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2RvbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLFFBQVE7QUFDeEM7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVUsTUFBTTtBQUNoQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9DQUFvQyw4QkFBOEI7QUFDbEU7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFVLG9CQUFvQjtBQUM5QjtBQUNBOztBQUVBO0FBQ0EsVUFBVSxVQUFVO0FBQ3BCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixZQUFZO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwrQkFBK0Isc0JBQXNCO0FBQ3JEO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLFFBQVE7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkIsUUFBUTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsUUFBUTtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsZUFBZTtBQUNsQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUM3U0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FB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Q0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUN0QyxJQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUU7UUFDakIsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDeEMsR0FBRyxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDeEI7S0FDRDtJQUNELE9BQU8scUJBQXFCLENBQUUsRUFBVSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDcEUsQ0FBQyxDQUFDO0FBRTJCLHNEQUFxQiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiLy8gLmRpcm5hbWUsIC5iYXNlbmFtZSwgYW5kIC5leHRuYW1lIG1ldGhvZHMgYXJlIGV4dHJhY3RlZCBmcm9tIE5vZGUuanMgdjguMTEuMSxcbi8vIGJhY2twb3J0ZWQgYW5kIHRyYW5zcGxpdGVkIHdpdGggQmFiZWwsIHdpdGggYmFja3dhcmRzLWNvbXBhdCBmaXhlc1xuXG4vLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLy8gcmVzb2x2ZXMgLiBhbmQgLi4gZWxlbWVudHMgaW4gYSBwYXRoIGFycmF5IHdpdGggZGlyZWN0b3J5IG5hbWVzIHRoZXJlXG4vLyBtdXN0IGJlIG5vIHNsYXNoZXMsIGVtcHR5IGVsZW1lbnRzLCBvciBkZXZpY2UgbmFtZXMgKGM6XFwpIGluIHRoZSBhcnJheVxuLy8gKHNvIGFsc28gbm8gbGVhZGluZyBhbmQgdHJhaWxpbmcgc2xhc2hlcyAtIGl0IGRvZXMgbm90IGRpc3Rpbmd1aXNoXG4vLyByZWxhdGl2ZSBhbmQgYWJzb2x1dGUgcGF0aHMpXG5mdW5jdGlvbiBub3JtYWxpemVBcnJheShwYXJ0cywgYWxsb3dBYm92ZVJvb3QpIHtcbiAgLy8gaWYgdGhlIHBhdGggdHJpZXMgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIGB1cGAgZW5kcyB1cCA+IDBcbiAgdmFyIHVwID0gMDtcbiAgZm9yICh2YXIgaSA9IHBhcnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgdmFyIGxhc3QgPSBwYXJ0c1tpXTtcbiAgICBpZiAobGFzdCA9PT0gJy4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChsYXN0ID09PSAnLi4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cCsrO1xuICAgIH0gZWxzZSBpZiAodXApIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwLS07XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgdGhlIHBhdGggaXMgYWxsb3dlZCB0byBnbyBhYm92ZSB0aGUgcm9vdCwgcmVzdG9yZSBsZWFkaW5nIC4uc1xuICBpZiAoYWxsb3dBYm92ZVJvb3QpIHtcbiAgICBmb3IgKDsgdXAtLTsgdXApIHtcbiAgICAgIHBhcnRzLnVuc2hpZnQoJy4uJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHBhcnRzO1xufVxuXG4vLyBwYXRoLnJlc29sdmUoW2Zyb20gLi4uXSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlc29sdmUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlc29sdmVkUGF0aCA9ICcnLFxuICAgICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaSA+PSAtMSAmJiAhcmVzb2x2ZWRBYnNvbHV0ZTsgaS0tKSB7XG4gICAgdmFyIHBhdGggPSAoaSA+PSAwKSA/IGFyZ3VtZW50c1tpXSA6IHByb2Nlc3MuY3dkKCk7XG5cbiAgICAvLyBTa2lwIGVtcHR5IGFuZCBpbnZhbGlkIGVudHJpZXNcbiAgICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5yZXNvbHZlIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH0gZWxzZSBpZiAoIXBhdGgpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHJlc29sdmVkUGF0aCA9IHBhdGggKyAnLycgKyByZXNvbHZlZFBhdGg7XG4gICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IHBhdGguY2hhckF0KDApID09PSAnLyc7XG4gIH1cblxuICAvLyBBdCB0aGlzIHBvaW50IHRoZSBwYXRoIHNob3VsZCBiZSByZXNvbHZlZCB0byBhIGZ1bGwgYWJzb2x1dGUgcGF0aCwgYnV0XG4gIC8vIGhhbmRsZSByZWxhdGl2ZSBwYXRocyB0byBiZSBzYWZlIChtaWdodCBoYXBwZW4gd2hlbiBwcm9jZXNzLmN3ZCgpIGZhaWxzKVxuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICByZXNvbHZlZFBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocmVzb2x2ZWRQYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIXJlc29sdmVkQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICByZXR1cm4gKChyZXNvbHZlZEFic29sdXRlID8gJy8nIDogJycpICsgcmVzb2x2ZWRQYXRoKSB8fCAnLic7XG59O1xuXG4vLyBwYXRoLm5vcm1hbGl6ZShwYXRoKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5ub3JtYWxpemUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciBpc0Fic29sdXRlID0gZXhwb3J0cy5pc0Fic29sdXRlKHBhdGgpLFxuICAgICAgdHJhaWxpbmdTbGFzaCA9IHN1YnN0cihwYXRoLCAtMSkgPT09ICcvJztcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihwYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIWlzQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICBpZiAoIXBhdGggJiYgIWlzQWJzb2x1dGUpIHtcbiAgICBwYXRoID0gJy4nO1xuICB9XG4gIGlmIChwYXRoICYmIHRyYWlsaW5nU2xhc2gpIHtcbiAgICBwYXRoICs9ICcvJztcbiAgfVxuXG4gIHJldHVybiAoaXNBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHBhdGg7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmlzQWJzb2x1dGUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xufTtcblxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5qb2luID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwYXRocyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gIHJldHVybiBleHBvcnRzLm5vcm1hbGl6ZShmaWx0ZXIocGF0aHMsIGZ1bmN0aW9uKHAsIGluZGV4KSB7XG4gICAgaWYgKHR5cGVvZiBwICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGguam9pbiBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9XG4gICAgcmV0dXJuIHA7XG4gIH0pLmpvaW4oJy8nKSk7XG59O1xuXG5cbi8vIHBhdGgucmVsYXRpdmUoZnJvbSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlbGF0aXZlID0gZnVuY3Rpb24oZnJvbSwgdG8pIHtcbiAgZnJvbSA9IGV4cG9ydHMucmVzb2x2ZShmcm9tKS5zdWJzdHIoMSk7XG4gIHRvID0gZXhwb3J0cy5yZXNvbHZlKHRvKS5zdWJzdHIoMSk7XG5cbiAgZnVuY3Rpb24gdHJpbShhcnIpIHtcbiAgICB2YXIgc3RhcnQgPSAwO1xuICAgIGZvciAoOyBzdGFydCA8IGFyci5sZW5ndGg7IHN0YXJ0KyspIHtcbiAgICAgIGlmIChhcnJbc3RhcnRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgdmFyIGVuZCA9IGFyci5sZW5ndGggLSAxO1xuICAgIGZvciAoOyBlbmQgPj0gMDsgZW5kLS0pIHtcbiAgICAgIGlmIChhcnJbZW5kXSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChzdGFydCA+IGVuZCkgcmV0dXJuIFtdO1xuICAgIHJldHVybiBhcnIuc2xpY2Uoc3RhcnQsIGVuZCAtIHN0YXJ0ICsgMSk7XG4gIH1cblxuICB2YXIgZnJvbVBhcnRzID0gdHJpbShmcm9tLnNwbGl0KCcvJykpO1xuICB2YXIgdG9QYXJ0cyA9IHRyaW0odG8uc3BsaXQoJy8nKSk7XG5cbiAgdmFyIGxlbmd0aCA9IE1hdGgubWluKGZyb21QYXJ0cy5sZW5ndGgsIHRvUGFydHMubGVuZ3RoKTtcbiAgdmFyIHNhbWVQYXJ0c0xlbmd0aCA9IGxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmIChmcm9tUGFydHNbaV0gIT09IHRvUGFydHNbaV0pIHtcbiAgICAgIHNhbWVQYXJ0c0xlbmd0aCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB2YXIgb3V0cHV0UGFydHMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IHNhbWVQYXJ0c0xlbmd0aDsgaSA8IGZyb21QYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIG91dHB1dFBhcnRzLnB1c2goJy4uJyk7XG4gIH1cblxuICBvdXRwdXRQYXJ0cyA9IG91dHB1dFBhcnRzLmNvbmNhdCh0b1BhcnRzLnNsaWNlKHNhbWVQYXJ0c0xlbmd0aCkpO1xuXG4gIHJldHVybiBvdXRwdXRQYXJ0cy5qb2luKCcvJyk7XG59O1xuXG5leHBvcnRzLnNlcCA9ICcvJztcbmV4cG9ydHMuZGVsaW1pdGVyID0gJzonO1xuXG5leHBvcnRzLmRpcm5hbWUgPSBmdW5jdGlvbiAocGF0aCkge1xuICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSBwYXRoID0gcGF0aCArICcnO1xuICBpZiAocGF0aC5sZW5ndGggPT09IDApIHJldHVybiAnLic7XG4gIHZhciBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KDApO1xuICB2YXIgaGFzUm9vdCA9IGNvZGUgPT09IDQ3IC8qLyovO1xuICB2YXIgZW5kID0gLTE7XG4gIHZhciBtYXRjaGVkU2xhc2ggPSB0cnVlO1xuICBmb3IgKHZhciBpID0gcGF0aC5sZW5ndGggLSAxOyBpID49IDE7IC0taSkge1xuICAgIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKGNvZGUgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XG4gICAgICAgICAgZW5kID0gaTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgIC8vIFdlIHNhdyB0aGUgZmlyc3Qgbm9uLXBhdGggc2VwYXJhdG9yXG4gICAgICBtYXRjaGVkU2xhc2ggPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBpZiAoZW5kID09PSAtMSkgcmV0dXJuIGhhc1Jvb3QgPyAnLycgOiAnLic7XG4gIGlmIChoYXNSb290ICYmIGVuZCA9PT0gMSkge1xuICAgIC8vIHJldHVybiAnLy8nO1xuICAgIC8vIEJhY2t3YXJkcy1jb21wYXQgZml4OlxuICAgIHJldHVybiAnLyc7XG4gIH1cbiAgcmV0dXJuIHBhdGguc2xpY2UoMCwgZW5kKTtcbn07XG5cbmZ1bmN0aW9uIGJhc2VuYW1lKHBhdGgpIHtcbiAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykgcGF0aCA9IHBhdGggKyAnJztcblxuICB2YXIgc3RhcnQgPSAwO1xuICB2YXIgZW5kID0gLTE7XG4gIHZhciBtYXRjaGVkU2xhc2ggPSB0cnVlO1xuICB2YXIgaTtcblxuICBmb3IgKGkgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgaWYgKHBhdGguY2hhckNvZGVBdChpKSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgLy8gSWYgd2UgcmVhY2hlZCBhIHBhdGggc2VwYXJhdG9yIHRoYXQgd2FzIG5vdCBwYXJ0IG9mIGEgc2V0IG9mIHBhdGhcbiAgICAgICAgLy8gc2VwYXJhdG9ycyBhdCB0aGUgZW5kIG9mIHRoZSBzdHJpbmcsIHN0b3Agbm93XG4gICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XG4gICAgICAgICAgc3RhcnQgPSBpICsgMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChlbmQgPT09IC0xKSB7XG4gICAgICAvLyBXZSBzYXcgdGhlIGZpcnN0IG5vbi1wYXRoIHNlcGFyYXRvciwgbWFyayB0aGlzIGFzIHRoZSBlbmQgb2Ygb3VyXG4gICAgICAvLyBwYXRoIGNvbXBvbmVudFxuICAgICAgbWF0Y2hlZFNsYXNoID0gZmFsc2U7XG4gICAgICBlbmQgPSBpICsgMTtcbiAgICB9XG4gIH1cblxuICBpZiAoZW5kID09PSAtMSkgcmV0dXJuICcnO1xuICByZXR1cm4gcGF0aC5zbGljZShzdGFydCwgZW5kKTtcbn1cblxuLy8gVXNlcyBhIG1peGVkIGFwcHJvYWNoIGZvciBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eSwgYXMgZXh0IGJlaGF2aW9yIGNoYW5nZWRcbi8vIGluIG5ldyBOb2RlLmpzIHZlcnNpb25zLCBzbyBvbmx5IGJhc2VuYW1lKCkgYWJvdmUgaXMgYmFja3BvcnRlZCBoZXJlXG5leHBvcnRzLmJhc2VuYW1lID0gZnVuY3Rpb24gKHBhdGgsIGV4dCkge1xuICB2YXIgZiA9IGJhc2VuYW1lKHBhdGgpO1xuICBpZiAoZXh0ICYmIGYuc3Vic3RyKC0xICogZXh0Lmxlbmd0aCkgPT09IGV4dCkge1xuICAgIGYgPSBmLnN1YnN0cigwLCBmLmxlbmd0aCAtIGV4dC5sZW5ndGgpO1xuICB9XG4gIHJldHVybiBmO1xufTtcblxuZXhwb3J0cy5leHRuYW1lID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykgcGF0aCA9IHBhdGggKyAnJztcbiAgdmFyIHN0YXJ0RG90ID0gLTE7XG4gIHZhciBzdGFydFBhcnQgPSAwO1xuICB2YXIgZW5kID0gLTE7XG4gIHZhciBtYXRjaGVkU2xhc2ggPSB0cnVlO1xuICAvLyBUcmFjayB0aGUgc3RhdGUgb2YgY2hhcmFjdGVycyAoaWYgYW55KSB3ZSBzZWUgYmVmb3JlIG91ciBmaXJzdCBkb3QgYW5kXG4gIC8vIGFmdGVyIGFueSBwYXRoIHNlcGFyYXRvciB3ZSBmaW5kXG4gIHZhciBwcmVEb3RTdGF0ZSA9IDA7XG4gIGZvciAodmFyIGkgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgdmFyIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKGNvZGUgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgIC8vIElmIHdlIHJlYWNoZWQgYSBwYXRoIHNlcGFyYXRvciB0aGF0IHdhcyBub3QgcGFydCBvZiBhIHNldCBvZiBwYXRoXG4gICAgICAgIC8vIHNlcGFyYXRvcnMgYXQgdGhlIGVuZCBvZiB0aGUgc3RyaW5nLCBzdG9wIG5vd1xuICAgICAgICBpZiAoIW1hdGNoZWRTbGFzaCkge1xuICAgICAgICAgIHN0YXJ0UGFydCA9IGkgKyAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIGlmIChlbmQgPT09IC0xKSB7XG4gICAgICAvLyBXZSBzYXcgdGhlIGZpcnN0IG5vbi1wYXRoIHNlcGFyYXRvciwgbWFyayB0aGlzIGFzIHRoZSBlbmQgb2Ygb3VyXG4gICAgICAvLyBleHRlbnNpb25cbiAgICAgIG1hdGNoZWRTbGFzaCA9IGZhbHNlO1xuICAgICAgZW5kID0gaSArIDE7XG4gICAgfVxuICAgIGlmIChjb2RlID09PSA0NiAvKi4qLykge1xuICAgICAgICAvLyBJZiB0aGlzIGlzIG91ciBmaXJzdCBkb3QsIG1hcmsgaXQgYXMgdGhlIHN0YXJ0IG9mIG91ciBleHRlbnNpb25cbiAgICAgICAgaWYgKHN0YXJ0RG90ID09PSAtMSlcbiAgICAgICAgICBzdGFydERvdCA9IGk7XG4gICAgICAgIGVsc2UgaWYgKHByZURvdFN0YXRlICE9PSAxKVxuICAgICAgICAgIHByZURvdFN0YXRlID0gMTtcbiAgICB9IGVsc2UgaWYgKHN0YXJ0RG90ICE9PSAtMSkge1xuICAgICAgLy8gV2Ugc2F3IGEgbm9uLWRvdCBhbmQgbm9uLXBhdGggc2VwYXJhdG9yIGJlZm9yZSBvdXIgZG90LCBzbyB3ZSBzaG91bGRcbiAgICAgIC8vIGhhdmUgYSBnb29kIGNoYW5jZSBhdCBoYXZpbmcgYSBub24tZW1wdHkgZXh0ZW5zaW9uXG4gICAgICBwcmVEb3RTdGF0ZSA9IC0xO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzdGFydERvdCA9PT0gLTEgfHwgZW5kID09PSAtMSB8fFxuICAgICAgLy8gV2Ugc2F3IGEgbm9uLWRvdCBjaGFyYWN0ZXIgaW1tZWRpYXRlbHkgYmVmb3JlIHRoZSBkb3RcbiAgICAgIHByZURvdFN0YXRlID09PSAwIHx8XG4gICAgICAvLyBUaGUgKHJpZ2h0LW1vc3QpIHRyaW1tZWQgcGF0aCBjb21wb25lbnQgaXMgZXhhY3RseSAnLi4nXG4gICAgICBwcmVEb3RTdGF0ZSA9PT0gMSAmJiBzdGFydERvdCA9PT0gZW5kIC0gMSAmJiBzdGFydERvdCA9PT0gc3RhcnRQYXJ0ICsgMSkge1xuICAgIHJldHVybiAnJztcbiAgfVxuICByZXR1cm4gcGF0aC5zbGljZShzdGFydERvdCwgZW5kKTtcbn07XG5cbmZ1bmN0aW9uIGZpbHRlciAoeHMsIGYpIHtcbiAgICBpZiAoeHMuZmlsdGVyKSByZXR1cm4geHMuZmlsdGVyKGYpO1xuICAgIHZhciByZXMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChmKHhzW2ldLCBpLCB4cykpIHJlcy5wdXNoKHhzW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxuLy8gU3RyaW5nLnByb3RvdHlwZS5zdWJzdHIgLSBuZWdhdGl2ZSBpbmRleCBkb24ndCB3b3JrIGluIElFOFxudmFyIHN1YnN0ciA9ICdhYicuc3Vic3RyKC0xKSA9PT0gJ2InXG4gICAgPyBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7IHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pIH1cbiAgICA6IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSBzdHIubGVuZ3RoICsgc3RhcnQ7XG4gICAgICAgIHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pO1xuICAgIH1cbjtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvXCI7XG5pbXBvcnQgeyB0eXBlLCB3YWl0Rm9yU2VsZWN0b3JzIH0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGRJbnB1dChhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBzZWxlY3RvcnMgPSBhY3Rpb24ucGF5bG9hZC5zZWxlY3RvcnMgYXMgaVNlbGVjdG9ySW5mb1tdO1xuXHRcdFx0Y29uc3QgaW5wdXRLZXlzID0gYWN0aW9uLnBheWxvYWQubWV0YS52YWx1ZTtcblxuXHRcdFx0Y29uc3Qgc2VsZWN0b3IgPSBhd2FpdCB3YWl0Rm9yU2VsZWN0b3JzKHBhZ2UsIHNlbGVjdG9ycyk7XG5cblx0XHRcdGlmKCFzZWxlY3RvciB8fCB0eXBlb2Ygc2VsZWN0b3IgIT09IFwic3RyaW5nXCIpe1xuXHRcdFx0XHRyZXR1cm4gZXJyb3IoYEludmFsaWQgc2VsZWN0b3JgKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgZWxlbWVudEhhbmRsZSA9IGF3YWl0IHBhZ2UuJChzZWxlY3RvciBhcyBzdHJpbmcpO1xuXHRcdFx0aWYgKCFlbGVtZW50SGFuZGxlKSB7XG5cdFx0XHRcdHJldHVybiBlcnJvcihcblx0XHRcdFx0XHRgQXR0ZW1wdCB0byBwcmVzcyBrZXljb2RlcyBvbiBlbGVtZW50IHdpdGggaW52YWxpZCBzZWxlY3RvcjogJHtzZWxlY3Rvcn1gLFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRhd2FpdCBlbGVtZW50SGFuZGxlLnNjcm9sbEludG9WaWV3SWZOZWVkZWQoKTtcblx0XHRcdGF3YWl0IHR5cGUoZWxlbWVudEhhbmRsZSwgaW5wdXRLZXlzKTtcblxuXHRcdFx0cmV0dXJuIHN1Y2Nlc3Moe1xuXHRcdFx0XHRtZXNzYWdlOiBgUHJlc3NlZCBrZXlzIG9uIHRoZSBlbGVtZW50ICR7c2VsZWN0b3J9YCxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2goZXJyKXtcblx0XHRcdHJldHVybiBlcnJvcihcIlNvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgYWRkaW5nIGlucHV0IHRvIGVsZW1lbnRcIik7XG5cdFx0fVxuXHR9KTtcbn1cbiIsIiBpbXBvcnQge2Fzc2VydEVsZW1lbnR9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcbiBpbXBvcnQgeyB3YWl0Rm9yU2VsZWN0b3JzIH0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xuIGltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuIGltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiLi4vLi4vLi4vY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG4gaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCIuLi8uLi8uLi9jcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm9cIjtcblxuIGV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFzc2VydChhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0IHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHQgdHJ5e1xuXHRcdFx0IGNvbnN0IHNlbGVjdG9ycyA9IGFjdGlvbi5wYXlsb2FkLnNlbGVjdG9ycyBhcyBpU2VsZWN0b3JJbmZvW107XG5cdFx0XHQgY29uc3Qgc2VsZWN0b3IgPSBhd2FpdCB3YWl0Rm9yU2VsZWN0b3JzKHBhZ2UsIHNlbGVjdG9ycyk7XG5cblx0XHRcdCBpZighc2VsZWN0b3IgfHwgdHlwZW9mIHNlbGVjdG9yICE9PSBcInN0cmluZ1wiKXtcblx0XHRcdFx0IHJldHVybiBlcnJvcihgSW52YWxpZCBzZWxlY3RvcmApO1xuXHRcdFx0IH1cblxuXHRcdFx0IGNvbnN0IHZhbGlkYXRpb25Sb3dzID0gYWN0aW9uLnBheWxvYWQubWV0YS52YWxpZGF0aW9uUm93cztcblx0XHRcdCBjb25zdCBvdXRwdXQgPSBhd2FpdCBhc3NlcnRFbGVtZW50KHBhZ2UsIHNlbGVjdG9yLCB2YWxpZGF0aW9uUm93cyk7XG5cblx0XHRcdCByZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdCBtZXNzYWdlOiBgU3VjY2Vzc2Z1bGx5IGFzc2VydGVkIGVsZW1lbnQgJHtzZWxlY3Rvcn1gLFxuXHRcdFx0XHQgbWV0YToge291dHB1dH1cblx0XHRcdCB9KTtcblx0XHQgfSBjYXRjaChlcnIpe1xuXHRcdCBcdGNvbnNvbGUuZXJyb3IoZXJyKTtcblx0XHRcdCByZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIGFzc2VydGluZyBlbGVtZW50XCIpO1xuXHRcdCB9XG5cdCB9KTtcbiB9XG4iLCJpbXBvcnQgeyB3YWl0Rm9yU2VsZWN0b3JzIH0gZnJvbSBcIi4uL2Z1bmN0aW9uc1wiO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5pbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb25cIjtcbmltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mb1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjbGljayhhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeXtcblx0XHRjb25zdCBzZWxlY3RvcnMgPSBhY3Rpb24ucGF5bG9hZC5zZWxlY3RvcnMgYXMgaVNlbGVjdG9ySW5mb1tdO1xuXHRcdGNvbnN0IHNlbGVjdG9yID0gYXdhaXQgd2FpdEZvclNlbGVjdG9ycyhwYWdlLCBzZWxlY3RvcnMpO1xuXG5cdFx0aWYoIXNlbGVjdG9yIHx8IHR5cGVvZiBzZWxlY3RvciAhPT0gXCJzdHJpbmdcIil7XG5cdFx0XHRyZXR1cm4gZXJyb3IoYEludmFsaWQgc2VsZWN0b3JgKTtcblx0XHR9XG5cdFx0Y29uc3QgZWxlbWVudEhhbmRsZSA9IGF3YWl0IHBhZ2UuJChzZWxlY3RvciBhcyBzdHJpbmcpO1xuXHRcdGlmICghZWxlbWVudEhhbmRsZSkge1xuXHRcdFx0cmV0dXJuIGVycm9yKGBObyBlbGVtZW50IHdpdGggc2VsZWN0b3IgYXMgJHtzZWxlY3Rvcn0gZXhpc3RzYCk7XG5cdFx0fVxuXG5cdFx0YXdhaXQgZWxlbWVudEhhbmRsZS5zY3JvbGxJbnRvVmlld0lmTmVlZGVkKCk7XG5cdFx0YXdhaXQgZWxlbWVudEhhbmRsZS5kaXNwYXRjaEV2ZW50KFwiY2xpY2tcIik7XG5cblx0XHQvLyBJZiB1bmRlciBuYXZpZ2F0aW9uIHdhaXQgZm9yIGxvYWQgc3RhdGUgdG8gY29tcGxldGUuXG5cdFx0YXdhaXQgcGFnZS53YWl0Rm9yTG9hZFN0YXRlKCk7XG5cblx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRtZXNzYWdlOiBgQ2xpY2tlZCBvbiB0aGUgZWxlbWVudCAke3NlbGVjdG9yfWAsXG5cdFx0fSk7XG5cdFx0fSBjYXRjaChlcnIpe1xuXHRcdFx0cmV0dXJuIGVycm9yKFwiU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBjbGlja2luZyBvbiBlbGVtZW50XCIpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSAnQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mbyc7XG5pbXBvcnQgeyB3YWl0Rm9yU2VsZWN0b3JzIH0gZnJvbSAnLi4vZnVuY3Rpb25zJztcbmltcG9ydCB7IFBhZ2UgfSBmcm9tICdwbGF5d3JpZ2h0JztcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tICdAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cbmxldCBzY3JlZW5zaG90SW5kZXggPSAwO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZVNjcmVlbnNob3ROYW1lKHNlbGVjdG9yOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRyZXR1cm4gc2VsZWN0b3IucmVwbGFjZSgvW15cXHdcXHNdL2dpLCAnJykucmVwbGFjZSgvIC9nLCAnXycpICsgYF8ke3NjcmVlbnNob3RJbmRleCsrfS5wbmdgO1xufVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZWxlbWVudFNjcmVlbnNob3QoYWN0aW9uOiBpQWN0aW9uLCBwYWdlOiBQYWdlLCBhc3NldHNEaXI6IHN0cmluZykge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHN1Y2Nlc3MsIGVycm9yKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHNlbGVjdG9ycyA9IGFjdGlvbi5wYXlsb2FkLnNlbGVjdG9ycyBhcyBpU2VsZWN0b3JJbmZvW107XG5cdFx0XHRjb25zdCBzZWxlY3RvciA9IGF3YWl0IHdhaXRGb3JTZWxlY3RvcnMocGFnZSwgc2VsZWN0b3JzKTtcblxuXHRcdFx0aWYgKCFzZWxlY3RvciB8fCB0eXBlb2Ygc2VsZWN0b3IgIT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdHJldHVybiBlcnJvcihgSW52YWxpZCBzZWxlY3RvcmApO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBlbGVtZW50SGFuZGxlID0gYXdhaXQgcGFnZS4kKHNlbGVjdG9yIGFzIHN0cmluZyk7XG5cdFx0XHRpZiAoIWVsZW1lbnRIYW5kbGUpIHtcblx0XHRcdFx0cmV0dXJuIGVycm9yKGBBdHRlbXB0IHRvIGNhcHR1cmUgc2NyZWVuc2hvdCBvZiBlbGVtZW50IHdpdGggaW52YWxpZCBzZWxlY3RvcjogJHtzZWxlY3Rvcn1gKTtcblx0XHRcdH1cblxuXHRcdFx0YXdhaXQgZWxlbWVudEhhbmRsZS5zY3JlZW5zaG90KHtcblx0XHRcdFx0cGF0aDogcGF0aC5yZXNvbHZlKGFzc2V0c0RpciwgZ2VuZXJhdGVTY3JlZW5zaG90TmFtZShzZWxlY3RvciBhcyBzdHJpbmcpKSxcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBDYXB0dXJlZCBlbGVtZW50IHNjcmVlbnNob3QgZm9yICR7c2VsZWN0b3J9YCxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0cmV0dXJuIGVycm9yKCdTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIGNhcHR1cmluZyBzY3JlZW5zaG90IG9mIGVsZW1lbnQnKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5pbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb25cIjtcbmltcG9ydCB7IHNjcm9sbCwgd2FpdEZvclNlbGVjdG9ycyB9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcbmltcG9ydCB7IGlTZWxlY3RvckluZm8gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL3NlbGVjdG9ySW5mb1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjYXB0dXJlUGFnZVNjcmVlbnNob3QoYWN0aW9uOiBpQWN0aW9uLCBwYWdlOiBQYWdlKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3JzID0gYWN0aW9uLnBheWxvYWQuc2VsZWN0b3JzIGFzIGlTZWxlY3RvckluZm9bXTtcblx0XHRcdGNvbnN0IHNlbGVjdG9yID0gYXdhaXQgd2FpdEZvclNlbGVjdG9ycyhwYWdlLCBzZWxlY3RvcnMpO1xuXG5cdFx0XHRpZighc2VsZWN0b3IgfHwgdHlwZW9mIHNlbGVjdG9yICE9PSBcInN0cmluZ1wiKXtcblx0XHRcdFx0cmV0dXJuIGVycm9yKGBJbnZhbGlkIHNlbGVjdG9yYCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghc2VsZWN0b3IpIHtcblx0XHRcdFx0cmV0dXJuIGVycm9yKGBBdHRlbXB0IHRvIHNjcm9sbCBlbGVtZW50IHdpdGggaW52YWxpZCBzZWxlY3RvcjogJHtzZWxlY3Rvcn1gKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3Qgc2Nyb2xsRGVsdGEgPSBhY3Rpb24ucGF5bG9hZC5tZXRhLnZhbHVlO1xuXHRcdFx0Y29uc3QgcGFnZVVybCA9IGF3YWl0IHBhZ2UudXJsKCk7XG5cdFx0XHRhd2FpdCBzY3JvbGwocGFnZSwgc2VsZWN0b3IsIHNjcm9sbERlbHRhKTtcblxuXHRcdFx0cmV0dXJuIHN1Y2Nlc3Moe1xuXHRcdFx0XHRtZXNzYWdlOiBgU2Nyb2xsZWQgc3VjY2Vzc2Z1bGx5IG9uICR7cGFnZVVybH1gLFxuXHRcdFx0fSk7XG5cdFx0fSBjYXRjaChlcnIpe1xuXHRcdFx0cmV0dXJuIGVycm9yKFwiU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBzY3JvbGxpbmcgb24gZWxlbWVudFwiKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgd2FpdEZvclNlbGVjdG9ycyB9IGZyb20gXCIuLi9mdW5jdGlvbnNcIjtcbmltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG5pbXBvcnQgeyBpU2VsZWN0b3JJbmZvIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9zZWxlY3RvckluZm9cIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaG92ZXIoYWN0aW9uOiBpQWN0aW9uLCBwYWdlOiBQYWdlKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAoc3VjY2VzcywgZXJyb3IpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3Qgc2VsZWN0b3JzID0gYWN0aW9uLnBheWxvYWQuc2VsZWN0b3JzIGFzIGlTZWxlY3RvckluZm9bXTtcblx0XHRcdGNvbnN0IHNlbGVjdG9yID0gYXdhaXQgd2FpdEZvclNlbGVjdG9ycyhwYWdlLCBzZWxlY3RvcnMpO1xuXG5cblx0XHRcdGlmKCFzZWxlY3RvciB8fCB0eXBlb2Ygc2VsZWN0b3IgIT09IFwic3RyaW5nXCIpe1xuXHRcdFx0XHRyZXR1cm4gZXJyb3IoYEludmFsaWQgc2VsZWN0b3JgKTtcblx0XHRcdH1cblxuXHRcdFx0YXdhaXQgcGFnZS5ob3ZlcihzZWxlY3Rvcik7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogYEhvdmVyZWQgb24gdGhlIGVsZW1lbnQgJHtzZWxlY3Rvcn1gLFxuXHRcdFx0fSk7XG5cdFx0fSBjYXRjaChlcnIpe1xuXHRcdFx0cmV0dXJuIGVycm9yKFwiU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBob3ZlcmluZyBvbiBlbGVtZW50XCIpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgYWRkSW5wdXQgZnJvbSBcIi4vYWRkSW5wdXRcIjtcbmltcG9ydCBjbGljayBmcm9tIFwiLi9jbGlja1wiO1xuaW1wb3J0IGhvdmVyIGZyb20gXCIuL2hvdmVyXCI7XG5pbXBvcnQgY2FwdHVyZUVsZW1lbnRTY3JlZW5zaG90IGZyb20gXCIuL2VsZW1lbnRTY3JlZW5zaG90XCI7XG5pbXBvcnQgY2FwdHVyZVBhZ2VTY3JlZW5zaG90IGZyb20gXCIuL3BhZ2VTY3JlZW5zaG90XCI7XG5pbXBvcnQgZWxlbWVudFNjcm9sbCBmcm9tIFwiLi9lbGVtZW50U2Nyb2xsXCI7XG5pbXBvcnQgcGFnZVNjcm9sbCBmcm9tIFwiLi9wYWdlU2Nyb2xsXCI7XG5pbXBvcnQgbmF2aWdhdGVVcmwgZnJvbSBcIi4vbmF2aWdhdGVVcmxcIjtcbmltcG9ydCBzZXREZXZpY2UgZnJvbSBcIi4vc2V0RGV2aWNlXCI7XG5pbXBvcnQgYXNzZXJ0RWxlbWVudCBmcm9tICcuL2Fzc2VydEVsZW1lbnQnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0RWxlbWVudDoge1xuXHRcdGFkZElucHV0LFxuXHRcdGNsaWNrLFxuXHRcdGhvdmVyLFxuXHRcdHNjcm9sbDogZWxlbWVudFNjcm9sbCxcblx0XHRzY3JlZW5zaG90OiBjYXB0dXJlRWxlbWVudFNjcmVlbnNob3QsXG5cdFx0ZWxlbWVudFNjcm9sbCxcblx0XHRhc3NlcnRFbGVtZW50XG5cdH0sXG5cdFBhZ2U6IHtcblx0XHRzY3JlZW5zaG90OiBjYXB0dXJlUGFnZVNjcmVlbnNob3QsXG5cdFx0c2Nyb2xsOiBwYWdlU2Nyb2xsLFxuXHRcdG5hdmlnYXRlOiBuYXZpZ2F0ZVVybCxcblx0fSxcblx0QnJvd3Nlcjoge1xuXHRcdHNldERldmljZSxcblx0fSxcbn07XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGlBY3Rpb24gfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2FjdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBuYXZpZ2F0ZVVybChhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCB1cmxUb0dvID0gYWN0aW9uLnBheWxvYWQubWV0YS52YWx1ZTtcblxuXHRcdFx0YXdhaXQgcGFnZS5nb3RvKHVybFRvR28pO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBOYXZpZ2F0ZWQgc3VjY2Vzc2Z1bGx5IHRvICR7dXJsVG9Hb31gLFxuXHRcdFx0fSk7XG5cdFx0fSBjYXRjaChlcnIpe1xuXHRcdFx0cmV0dXJuIGVycm9yKFwiU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBuYXZpZ2F0aW5nIHRvIHdlYnBhZ2VcIik7XG5cdFx0fVxuXHR9KTtcbn1cbiIsImltcG9ydCB7IFBhZ2UgfSBmcm9tICdwbGF5d3JpZ2h0JztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cbmxldCBzY3JlZW5zaG90SW5kZXggPSAwO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZVBhZ2VTY3JlZW5zaG90TmFtZSh0aXRsZTogc3RyaW5nKTogc3RyaW5nIHtcblx0cmV0dXJuIHRpdGxlLnJlcGxhY2UoL1teXFxcXHdcXFxcc10vZ2ksICcnKS5yZXBsYWNlKC8gL2csICdfJykgKyBgXyR7c2NyZWVuc2hvdEluZGV4Kyt9LnBuZ2A7XG59XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjYXB0dXJlUGFnZVNjcmVlbnNob3QocGFnZTogUGFnZSwgYXNzZXRzRGlyOiBzdHJpbmcpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBwYWdlVGl0bGUgPSBhd2FpdCBwYWdlLnRpdGxlKCk7XG5cdFx0XHRjb25zdCBwYWdlVXJsID0gYXdhaXQgcGFnZS51cmwoKTtcblx0XHRcdGF3YWl0IHBhZ2Uuc2NyZWVuc2hvdCh7IHBhdGg6IHBhdGgucmVzb2x2ZShhc3NldHNEaXIsIGdlbmVyYXRlUGFnZVNjcmVlbnNob3ROYW1lKHBhZ2VUaXRsZSkpIH0pO1xuXG5cdFx0XHRyZXR1cm4gc3VjY2Vzcyh7XG5cdFx0XHRcdG1lc3NhZ2U6IGBDbGlja2VkIHBhZ2Ugc2NyZWVuc2hvdCBmb3IgJHtwYWdlVXJsfWAsXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdHJldHVybiBlcnJvcignU29tZSBpc3N1ZSBvY2N1cnJlZCB3aGlsZSBjYXB0dXJpbmcgc2NyZWVuc2hvdCBvZiBwYWdlJyk7XG5cdFx0fVxuXHR9KTtcbn1cbiIsImltcG9ydCB7IFBhZ2UgfSBmcm9tIFwicGxheXdyaWdodFwiO1xuaW1wb3J0IHsgaUFjdGlvbiB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvYWN0aW9uXCI7XG5pbXBvcnQgeyBzY3JvbGwgfSBmcm9tIFwiLi4vZnVuY3Rpb25zXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNhcHR1cmVQYWdlU2NyZWVuc2hvdChhY3Rpb246IGlBY3Rpb24sIHBhZ2U6IFBhZ2UpIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBzY3JvbGxEZWx0YSA9IGFjdGlvbi5wYXlsb2FkLm1ldGEudmFsdWU7XG5cdFx0XHRjb25zdCBwYWdlVXJsID0gYXdhaXQgcGFnZS51cmwoKTtcblx0XHRcdGF3YWl0IHNjcm9sbChwYWdlLCBcIndpbmRvd1wiLCBzY3JvbGxEZWx0YSk7XG5cblx0XHRcdHJldHVybiBzdWNjZXNzKHtcblx0XHRcdFx0bWVzc2FnZTogYFNjcm9sbGVkIHN1Y2Nlc3NmdWxseSBvbiAke3BhZ2VVcmx9YCxcblx0XHRcdH0pO1xuXHRcdH0gY2F0Y2goZXJyKXtcblx0XHRcdHJldHVybiBlcnJvcihcIlNvbWUgaXNzdWUgb2NjdXJyZWQgd2hpbGUgc2Nyb2xsaW5nIHRoZSBwYWdlXCIpO1xuXHRcdH1cblx0fSk7XG59XG4iLCJpbXBvcnQgeyBpQWN0aW9uIH0gZnJvbSBcIkBjcnVzaGVyLXNoYXJlZC90eXBlcy9hY3Rpb25cIjtcbmltcG9ydCB7IGlEZXZpY2UgfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL3R5cGVzL2V4dGVuc2lvbi9kZXZpY2VcIjtcbmltcG9ydCB7IGlVc2VyQWdlbnQgfSBmcm9tIFwiQGNydXNoZXItc2hhcmVkL2NvbnN0YW50cy91c2VyQWdlbnRzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHNldERldmljZShhY3Rpb246IGlBY3Rpb24pIHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChzdWNjZXNzLCBlcnJvcikgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBkZXZpY2UgPSBhY3Rpb24ucGF5bG9hZC5tZXRhLmRldmljZSBhcyBpRGV2aWNlO1xuXHRcdFx0Y29uc3QgdXNlckFnZW50ID0gYWN0aW9uLnBheWxvYWQubWV0YS51c2VyQWdlbnQgYXMgaVVzZXJBZ2VudDtcblxuXHRcdFx0cmV0dXJuIHN1Y2Nlc3Moe1xuXHRcdFx0XHRtZXNzYWdlOiBcIlNldHVwIGRldmljZSBmb3IgdGVzdGluZ1wiLFxuXHRcdFx0XHRtZXRhOiB7XG5cdFx0XHRcdFx0d2lkdGg6IGRldmljZS53aWR0aCxcblx0XHRcdFx0XHRoZWlnaHQ6IGRldmljZS5oZWlnaHQsXG5cdFx0XHRcdFx0dXNlckFnZW50OiB1c2VyQWdlbnQudmFsdWUsXG5cdFx0XHRcdH0sXG5cdFx0XHR9KTtcblx0XHR9IGNhdGNoKGVycil7XG5cdFx0XHRyZXR1cm4gZXJyb3IoXCJTb21lIGlzc3VlIG9jY3VycmVkIHdoaWxlIHNldHRpbmcgdGhlIGRldmljZVwiKTtcblx0XHR9XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgUGFnZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5pbXBvcnQgeyBpQXNzZXJ0aW9uUm93IH0gZnJvbSAnLi4vLi4vLi4vY3J1c2hlci1zaGFyZWQvdHlwZXMvYXNzZXJ0aW9uUm93JztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gYXNzZXJ0RWxlbWVudEF0dHJpYnV0ZXMocGFnZTogUGFnZSwgc2VsZWN0b3I6IHN0cmluZywgYXNzZXJ0aW9uczogQXJyYXk8aUFzc2VydGlvblJvdz4pe1xuXHRjb25zdCBlbEhhbmRsZSA9IGF3YWl0IHBhZ2UuJChzZWxlY3Rvcik7XG5cdGxldCBoYXNQYXNzZWQgPSB0cnVlO1xuXHRjb25zdCBsb2dzID0gW107XG5cblx0Zm9yKGxldCBpID0gMDsgaSA8IGFzc2VydGlvbnMubGVuZ3RoOyBpKyspIHtcblx0XHRjb25zdCB7dmFsaWRhdGlvbiwgb3BlcmF0aW9uLCBmaWVsZH0gPSBhc3NlcnRpb25zW2ldO1xuXHRcdGNvbnN0IGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZSA9IGF3YWl0IGVsSGFuZGxlIS5nZXRBdHRyaWJ1dGUoZmllbGQubmFtZSk7XG5cdFx0aWYob3BlcmF0aW9uID09PSBcIm1hdGNoZXNcIikge1xuXHRcdFx0aWYoZWxlbWVudEF0dHJpYnV0ZVZhbHVlICE9PSB2YWxpZGF0aW9uKXtcblx0XHRcdFx0aGFzUGFzc2VkID0gZmFsc2U7XG5cdFx0XHRcdGxvZ3MucHVzaCh7c3RhdHVzOiBcIkZBSUxFRFwiLCBtZXNzYWdlOiBcIkZhaWxlZCB0byBhc3NlcnQgYXR0cmlidXRlPVwiK3ZhbGlkYXRpb24rXCIgb2YgXCIgKyBzZWxlY3RvciArIFwiXCIsIG1ldGE6IHtvcGVyYXRpb24sIHZhbHVlVG9NYXRjaDogdmFsaWRhdGlvbiwgZmllbGQ6IGZpZWxkLm5hbWUsIGVsZW1lbnRWYWx1ZTogZWxlbWVudEF0dHJpYnV0ZVZhbHVlfX0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGxvZ3MucHVzaCh7c3RhdHVzOiBcIkRPTkVcIiwgbWVzc2FnZTogXCJBc3NlcnRlZCBhdHRyaWJ1dGU9XCIrdmFsaWRhdGlvbitcIiBvZiBcIiArIHNlbGVjdG9yICsgXCJcIiwgbWV0YToge29wZXJhdGlvbiwgdmFsdWVUb01hdGNoOiB2YWxpZGF0aW9uLCBmaWVsZDogZmllbGQubmFtZSwgZWxlbWVudFZhbHVlOiBlbGVtZW50QXR0cmlidXRlVmFsdWV9fSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmKG9wZXJhdGlvbiA9PT0gXCJjb250YWluc1wiKSB7XG5cdFx0XHRjb25zdCBkb2VzQ29udGFpbiA9ICBlbGVtZW50QXR0cmlidXRlVmFsdWUhLmluY2x1ZGVzKHZhbGlkYXRpb24pO1xuXHRcdFx0aWYoIWRvZXNDb250YWluICl7XG5cdFx0XHRcdGhhc1Bhc3NlZCA9IGZhbHNlO1xuXHRcdFx0XHRsb2dzLnB1c2goe3N0YXR1czogXCJGQUlMRURcIiwgbWVzc2FnZTogXCJGYWlsZWQgdG8gYXNzZXJ0IGF0dHJpYnV0ZSBjb250YWlucyBcIit2YWxpZGF0aW9uK1wiIG9mIFwiICsgc2VsZWN0b3IgKyBcIlwiLCBtZXRhOiB7b3BlcmF0aW9uLCB2YWx1ZVRvTWF0Y2g6IHZhbGlkYXRpb24sIGZpZWxkOiBmaWVsZC5uYW1lLCBlbGVtZW50VmFsdWU6IGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZX19KTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRsb2dzLnB1c2goe3N0YXR1czogXCJET05FXCIsIG1lc3NhZ2U6IFwiQXNzZXJ0ZWQgYXR0cmlidXRlIGNvbnRhaW5zIFwiK3ZhbGlkYXRpb24rXCIgb2YgXCIgKyBzZWxlY3RvciArIFwiXCIsIG1ldGE6IHtvcGVyYXRpb24sIHZhbHVlVG9NYXRjaDogdmFsaWRhdGlvbiwgZmllbGQ6IGZpZWxkLm5hbWUsIGVsZW1lbnRWYWx1ZTogZWxlbWVudEF0dHJpYnV0ZVZhbHVlfX0pO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZihvcGVyYXRpb24gPT09IFwicmVnZXhcIiApe1xuXHRcdFx0Y29uc3Qgcmd4ID0gbmV3IFJlZ0V4cCh2YWxpZGF0aW9uKTtcblx0XHRcdGlmICghcmd4LnRlc3QoZWxlbWVudEF0dHJpYnV0ZVZhbHVlISkpIHtcblx0XHRcdFx0aGFzUGFzc2VkID0gZmFsc2U7XG5cdFx0XHRcdGxvZ3MucHVzaCh7c3RhdHVzOiBcIkZBSUxFRFwiLCBtZXNzYWdlOiBcIkZhaWxlZCB0byBhc3NlcnQgYXR0cmlidXRlIG1hdGNoZXMgcmVnZXg6IFwiK3ZhbGlkYXRpb24rXCIgb2YgXCIgKyBzZWxlY3RvciArIFwiXCIsIG1ldGE6IHtvcGVyYXRpb24sIHZhbHVlVG9NYXRjaDogdmFsaWRhdGlvbiwgZmllbGQ6IGZpZWxkLm5hbWUsIGVsZW1lbnRWYWx1ZTogZWxlbWVudEF0dHJpYnV0ZVZhbHVlfX0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bG9ncy5wdXNoKHtzdGF0dXM6IFwiRE9ORVwiLCBtZXNzYWdlOiBcIkFzc2VydGVkIGF0dHJpYnV0ZSBtYXRjaGVzIHJlZ2V4OiBcIit2YWxpZGF0aW9uK1wiIG9mIFwiICsgc2VsZWN0b3IgKyBcIlwiLCBtZXRhOiB7b3BlcmF0aW9uLCB2YWx1ZVRvTWF0Y2g6IHZhbGlkYXRpb24sIGZpZWxkOiBmaWVsZC5uYW1lLCBlbGVtZW50VmFsdWU6IGVsZW1lbnRBdHRyaWJ1dGVWYWx1ZX19KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gW2hhc1Bhc3NlZCwgbG9nc107XG59XG4iLCJpbXBvcnQgc2Nyb2xsIGZyb20gXCIuL3Njcm9sbFwiO1xuaW1wb3J0IHR5cGUgZnJvbSBcIi4vdHlwZVwiO1xuaW1wb3J0IHdhaXRGb3JTZWxlY3RvcnMgZnJvbSBcIi4vd2FpdEZvclNlbGVjdG9yc1wiO1xuaW1wb3J0IHNsZWVwIGZyb20gXCIuL3NsZWVwXCI7XG5pbXBvcnQgYXNzZXJ0RWxlbWVudCBmcm9tICcuL2Fzc2VydEVsZW1lbnQnO1xuXG5leHBvcnQgeyBzY3JvbGwsIHR5cGUsIHdhaXRGb3JTZWxlY3RvcnMsIHNsZWVwLCBhc3NlcnRFbGVtZW50IH07XG4iLCJpbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gc2Nyb2xsKFxuXHRwYWdlOiBQYWdlLFxuXHRzZWxlY3Rvcjogc3RyaW5nLFxuXHRzY3JvbGxEZWx0YUFycjogQXJyYXk8bnVtYmVyPixcbikge1xuXHRhd2FpdCBwYWdlLmV2YWx1YXRlKFxuXHRcdCAoW3Njcm9sbERlbHRhQXJyLCBzZWxlY3RvcktleV06IFtudW1iZXJbXSwgc3RyaW5nXSkgPT4ge1xuXHRcdFx0Y29uc3Qgc2Nyb2xsVG8gPSAgZnVuY3Rpb24gKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBvZmZzZXQ6IG51bWJlcikge1xuXHRcdFx0XHRjb25zdCBmaXhlZE9mZnNldCA9IG9mZnNldC50b0ZpeGVkKCk7XG5cdFx0XHRcdGNvbnN0IG9uU2Nyb2xsID0gKCkgPT4ge1xuXHRcdFx0XHRcdGlmICgoZWxlbWVudCBhcyBhbnkpLnBhZ2VZT2Zmc2V0LnRvRml4ZWQoKSA9PT0gZml4ZWRPZmZzZXQpIHtcblx0XHRcdFx0XHRcdGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBvblNjcm9sbCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBvblNjcm9sbCk7XG5cdFx0XHRcdG9uU2Nyb2xsKCk7XG5cdFx0XHRcdGVsZW1lbnQuc2Nyb2xsVG8oe1xuXHRcdFx0XHRcdHRvcDogb2Zmc2V0LFxuXHRcdFx0XHRcdGJlaGF2aW9yOiBcInNtb290aFwiLFxuXHRcdFx0XHR9KTtcblx0XHRcdH07XG5cblx0XHRcdGNvbnN0IGVsZW1lbnQgPVxuXHRcdFx0XHRzZWxlY3RvcktleSA9PT0gXCJ3aW5kb3dcIiA/IHdpbmRvdyA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JLZXkpO1xuXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNjcm9sbERlbHRhQXJyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdCBzY3JvbGxUbyhlbGVtZW50IGFzIEhUTUxFbGVtZW50LCBzY3JvbGxEZWx0YUFycltpXSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRbc2Nyb2xsRGVsdGFBcnIsIHNlbGVjdG9yXSxcblx0KTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNsZWVwKHRpbWU6IG51bWJlcikge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdHJlc29sdmUodHJ1ZSk7XG5cdFx0fSwgdGltZSk7XG5cdH0pO1xufVxuIiwiaW1wb3J0IHsgRWxlbWVudEhhbmRsZSB9IGZyb20gXCJwbGF5d3JpZ2h0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHR5cGUoXG5cdGVsSGFuZGxlOiBFbGVtZW50SGFuZGxlLFxuXHRrZXlDb2RlczogQXJyYXk8bnVtYmVyPixcbikge1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGtleUNvZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0YXdhaXQgZWxIYW5kbGUucHJlc3MoU3RyaW5nLmZyb21DaGFyQ29kZShrZXlDb2Rlc1tpXSkpO1xuXHR9XG5cdHJldHVybiB0cnVlO1xufVxuIiwiaW1wb3J0IHsgaVNlbGVjdG9ySW5mbyB9IGZyb20gXCJAY3J1c2hlci1zaGFyZWQvdHlwZXMvc2VsZWN0b3JJbmZvXCI7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSBcInBsYXl3cmlnaHRcIjtcbmltcG9ydCB7IGdlbmVyYXRlUXVlcnlTZWxlY3RvciwgZ2V0RWxlbWVudHNCeVhQYXRoIH0gZnJvbSBcIi4uL3V0aWxzL2RvbVwiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiB3YWl0Rm9yU2VsZWN0b3JzKFxuXHRwYWdlOiBQYWdlLFxuXHRzZWxlY3RvcnM6IEFycmF5PGlTZWxlY3RvckluZm8+LFxuXHRkZWZhdWx0U2VsZWN0b3IgPSBudWxsIGFzIHN0cmluZyB8IG51bGwsXG4pIHtcblx0aWYgKCFkZWZhdWx0U2VsZWN0b3IpIHtcblx0XHRkZWZhdWx0U2VsZWN0b3IgPSBzZWxlY3RvcnNbMF0udmFsdWU7XG5cdH1cblxuXHR0cnkge1xuXHRcdGF3YWl0IHBhZ2Uud2FpdEZvclNlbGVjdG9yKGRlZmF1bHRTZWxlY3RvciwgeyBzdGF0ZTogXCJhdHRhY2hlZFwiIH0pO1xuXHRcdHJldHVybiBkZWZhdWx0U2VsZWN0b3I7XG5cdH0gY2F0Y2gge1xuXHRcdGNvbnN0IHZhbGlkU2VsZWN0b3IgPSBhd2FpdCBwYWdlLmV2YWx1YXRlKChzZWxlY3RvcnMpID0+IHtcblx0XHRcdGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0aWYgKHNlbGVjdG9yLnR5cGUgPT09IFwieHBhdGhcIikge1xuXHRcdFx0XHRcdFx0Y29uc3QgZWxlbWVudHMgPSBnZXRFbGVtZW50c0J5WFBhdGgoc2VsZWN0b3IudmFsdWUpO1xuXHRcdFx0XHRcdFx0aWYgKGVsZW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBlbGVtZW50U2VsZWN0b3JGcm9tWHBhdGggPSBnZW5lcmF0ZVF1ZXJ5U2VsZWN0b3IoXG5cdFx0XHRcdFx0XHRcdFx0ZWxlbWVudHNbMF0gYXMgSFRNTEVsZW1lbnQsXG5cdFx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIGVsZW1lbnRTZWxlY3RvckZyb21YcGF0aDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2UgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IudmFsdWUpKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gc2VsZWN0b3IudmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoIChleCkge1xuXHRcdFx0XHRcdGNvbnNvbGUuZGVidWcoXCJDYXVnaHQgZXhjZXB0aW9uXCIsIGV4KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fSwgc2VsZWN0b3JzKTtcblx0XHRpZiAodHlwZW9mIHZhbGlkU2VsZWN0b3IgPT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIlRoaXMgaXMgbm90IHdvcmtpbmdcIik7XG5cdFx0fVxuXHRcdHJldHVybiB2YWxpZFNlbGVjdG9yO1xuXHR9XG59XG4iLCJpbXBvcnQgKiAgYXMgYWN0aW9ucyBmcm9tIFwiLi9hY3Rpb25zXCI7XG5cbm1vZHVsZS5leHBvcnRzID0gYWN0aW9ucztcbiIsImNvbnN0IGdldEVsZW1lbnRzQnlYUGF0aCA9IChcblx0eHBhdGg6IHN0cmluZyxcblx0cGFyZW50OiBOb2RlIHwgbnVsbCA9IG51bGwsXG4pOiBOb2RlW10gPT4ge1xuXHRjb25zdCByZXN1bHRzID0gW107XG5cdGNvbnN0IHF1ZXJ5ID0gZG9jdW1lbnQuZXZhbHVhdGUoXG5cdFx0eHBhdGgsXG5cdFx0cGFyZW50IHx8IGRvY3VtZW50LFxuXHRcdG51bGwsXG5cdFx0WFBhdGhSZXN1bHQuT1JERVJFRF9OT0RFX1NOQVBTSE9UX1RZUEUsXG5cdFx0bnVsbCxcblx0KTtcblx0Zm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IHF1ZXJ5LnNuYXBzaG90TGVuZ3RoOyBpIDwgbGVuZ3RoOyArK2kpIHtcblx0XHRjb25zdCBpdGVtID0gcXVlcnkuc25hcHNob3RJdGVtKGkpO1xuXHRcdGlmIChpdGVtKSByZXN1bHRzLnB1c2goaXRlbSk7XG5cdH1cblx0cmV0dXJuIHJlc3VsdHM7XG59O1xuXG5jb25zdCBnZW5lcmF0ZVF1ZXJ5U2VsZWN0b3IgPSAoZWw6IEhUTUxFbGVtZW50KTogc3RyaW5nID0+IHtcblx0aWYgKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PSBcImh0bWxcIikgcmV0dXJuIFwiSFRNTFwiO1xuXHRsZXQgc3RyID0gZWwudGFnTmFtZTtcblx0c3RyICs9IGVsLmlkICE9IFwiXCIgPyBcIiNcIiArIGVsLmlkIDogXCJcIjtcblx0aWYgKGVsLmNsYXNzTmFtZSkge1xuXHRcdGNvbnN0IGNsYXNzZXMgPSBlbC5jbGFzc05hbWUuc3BsaXQoL1xccy8pO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0c3RyICs9IFwiLlwiICsgY2xhc3Nlc1tpXTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGdlbmVyYXRlUXVlcnlTZWxlY3RvcigoZWwgYXMgYW55KS5wYXJlbnROb2RlKSArIFwiID4gXCIgKyBzdHI7XG59O1xuXG5leHBvcnQgeyBnZXRFbGVtZW50c0J5WFBhdGgsIGdlbmVyYXRlUXVlcnlTZWxlY3RvciB9O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==