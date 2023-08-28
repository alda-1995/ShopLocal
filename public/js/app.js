/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports["default"] = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var validator = __webpack_require__(/*! ../helpers/validator */ "./node_modules/axios/lib/helpers/validator.js");

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      forcedJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      clarifyTimeoutError: validators.transitional(validators.boolean, '1.0.0')
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var defaults = __webpack_require__(/*! ./../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var process = __webpack_require__(/*! process/browser.js */ "./node_modules/process/browser.js");


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");
var enhanceError = __webpack_require__(/*! ./core/enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/validator.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/validator.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var pkg = __webpack_require__(/*! ./../../package.json */ "./node_modules/axios/package.json");

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};
var currentVerArr = pkg.version.split('.');

/**
 * Compare package versions
 * @param {string} version
 * @param {string?} thanVersion
 * @returns {boolean}
 */
function isOlderVersion(version, thanVersion) {
  var pkgVersionArr = thanVersion ? thanVersion.split('.') : currentVerArr;
  var destVer = version.split('.');
  for (var i = 0; i < 3; i++) {
    if (pkgVersionArr[i] > destVer[i]) {
      return true;
    } else if (pkgVersionArr[i] < destVer[i]) {
      return false;
    }
  }
  return false;
}

/**
 * Transitional option validator
 * @param {function|boolean?} validator
 * @param {string?} version
 * @param {string} message
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  var isDeprecated = version && isOlderVersion(version);

  function formatMessage(opt, desc) {
    return '[Axios v' + pkg.version + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed in ' + version));
    }

    if (isDeprecated && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  isOlderVersion: isOlderVersion,
  assertOptions: assertOptions,
  validators: validators
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "./resources/js/alerts.js":
/*!********************************!*\
  !*** ./resources/js/alerts.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addConfirmDelete: () => (/* binding */ addConfirmDelete)
/* harmony export */ });
function addConfirmDelete() {
  var formsConfirm = document.querySelectorAll('.form-confirms');
  if (formsConfirm.length > 0) {
    formsConfirm.forEach(function (formElement) {
      var mensaje = formElement.getAttribute('data-message');
      console.log(mensaje);
      formElement.addEventListener('submit', function (e) {
        e.preventDefault();
        Swal.fire({
          title: "Estas seguro de eliminar?",
          text: '',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        }).then(function (result) {
          if (result.isConfirmed) {
            formElement.submit();
          }
        });
      });
    });
  }
}

/***/ }),

/***/ "./resources/js/app.js":
/*!*****************************!*\
  !*** ./resources/js/app.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var tw_elements__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tw-elements */ "./node_modules/tw-elements/dist/js/tw-elements.es.min.js");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _alerts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./alerts */ "./resources/js/alerts.js");

(0,tw_elements__WEBPACK_IMPORTED_MODULE_0__.initTE)({
  Sidenav: tw_elements__WEBPACK_IMPORTED_MODULE_0__.Sidenav,
  Dropdown: tw_elements__WEBPACK_IMPORTED_MODULE_0__.Dropdown,
  Ripple: tw_elements__WEBPACK_IMPORTED_MODULE_0__.Ripple,
  Input: tw_elements__WEBPACK_IMPORTED_MODULE_0__.Input
});



//seguridad para formularios
(axios__WEBPACK_IMPORTED_MODULE_2___default().defaults).headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
window.axios = (axios__WEBPACK_IMPORTED_MODULE_2___default());
window.Swal = (sweetalert2__WEBPACK_IMPORTED_MODULE_1___default());
var sidenav2 = document.getElementById("sidenav-1");
var sidenavInstance2 = tw_elements__WEBPACK_IMPORTED_MODULE_0__.Sidenav.getInstance(sidenav2);
document.addEventListener('DOMContentLoaded', function () {
  (0,_alerts__WEBPACK_IMPORTED_MODULE_3__.addConfirmDelete)();
});
var innerWidth2 = null;
var setMode2 = function setMode2(e) {
  // Check necessary for Android devices
  if (window.innerWidth === innerWidth2) {
    return;
  }
  innerWidth2 = window.innerWidth;
  if (window.innerWidth < sidenavInstance2.getBreakpoint("xl")) {
    sidenavInstance2.changeMode("over");
    sidenavInstance2.hide();
  } else {
    sidenavInstance2.changeMode("side");
    sidenavInstance2.show();
  }
};
if (window.innerWidth < sidenavInstance2.getBreakpoint("sm")) {
  setMode2();
}

// Event listeners
window.addEventListener("resize", setMode2);

/***/ }),

/***/ "./resources/css/app.css":
/*!*******************************!*\
  !*** ./resources/css/app.css ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/***/ ((module) => {

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

/***/ "./node_modules/sweetalert2/dist/sweetalert2.all.js":
/*!**********************************************************!*\
  !*** ./node_modules/sweetalert2/dist/sweetalert2.all.js ***!
  \**********************************************************/
/***/ (function(module) {

/*!
* sweetalert2 v11.7.27
* Released under the MIT License.
*/
(function (global, factory) {
   true ? module.exports = factory() :
  0;
})(this, (function () { 'use strict';

  function _classPrivateFieldGet(receiver, privateMap) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
    return _classApplyDescriptorGet(receiver, descriptor);
  }
  function _classPrivateFieldSet(receiver, privateMap, value) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
    _classApplyDescriptorSet(receiver, descriptor, value);
    return value;
  }
  function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) {
      throw new TypeError("attempted to " + action + " private field on non-instance");
    }
    return privateMap.get(receiver);
  }
  function _classApplyDescriptorGet(receiver, descriptor) {
    if (descriptor.get) {
      return descriptor.get.call(receiver);
    }
    return descriptor.value;
  }
  function _classApplyDescriptorSet(receiver, descriptor, value) {
    if (descriptor.set) {
      descriptor.set.call(receiver, value);
    } else {
      if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
      }
      descriptor.value = value;
    }
  }
  function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
      throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
  }
  function _classPrivateFieldInitSpec(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
  }

  const RESTORE_FOCUS_TIMEOUT = 100;

  /** @type {GlobalState} */
  const globalState = {};
  const focusPreviousActiveElement = () => {
    if (globalState.previousActiveElement instanceof HTMLElement) {
      globalState.previousActiveElement.focus();
      globalState.previousActiveElement = null;
    } else if (document.body) {
      document.body.focus();
    }
  };

  /**
   * Restore previous active (focused) element
   *
   * @param {boolean} returnFocus
   * @returns {Promise<void>}
   */
  const restoreActiveElement = returnFocus => {
    return new Promise(resolve => {
      if (!returnFocus) {
        return resolve();
      }
      const x = window.scrollX;
      const y = window.scrollY;
      globalState.restoreFocusTimeout = setTimeout(() => {
        focusPreviousActiveElement();
        resolve();
      }, RESTORE_FOCUS_TIMEOUT); // issues/900

      window.scrollTo(x, y);
    });
  };

  /**
   * This module contains `WeakMap`s for each effectively-"private  property" that a `Swal` has.
   * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
   * This is the approach that Babel will probably take to implement private methods/fields
   *   https://github.com/tc39/proposal-private-methods
   *   https://github.com/babel/babel/pull/7555
   * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
   *   then we can use that language feature.
   */

  var privateProps = {
    innerParams: new WeakMap(),
    domCache: new WeakMap()
  };

  const swalPrefix = 'swal2-';

  /**
   * @typedef
   * { | 'container'
   *   | 'shown'
   *   | 'height-auto'
   *   | 'iosfix'
   *   | 'popup'
   *   | 'modal'
   *   | 'no-backdrop'
   *   | 'no-transition'
   *   | 'toast'
   *   | 'toast-shown'
   *   | 'show'
   *   | 'hide'
   *   | 'close'
   *   | 'title'
   *   | 'html-container'
   *   | 'actions'
   *   | 'confirm'
   *   | 'deny'
   *   | 'cancel'
   *   | 'default-outline'
   *   | 'footer'
   *   | 'icon'
   *   | 'icon-content'
   *   | 'image'
   *   | 'input'
   *   | 'file'
   *   | 'range'
   *   | 'select'
   *   | 'radio'
   *   | 'checkbox'
   *   | 'label'
   *   | 'textarea'
   *   | 'inputerror'
   *   | 'input-label'
   *   | 'validation-message'
   *   | 'progress-steps'
   *   | 'active-progress-step'
   *   | 'progress-step'
   *   | 'progress-step-line'
   *   | 'loader'
   *   | 'loading'
   *   | 'styled'
   *   | 'top'
   *   | 'top-start'
   *   | 'top-end'
   *   | 'top-left'
   *   | 'top-right'
   *   | 'center'
   *   | 'center-start'
   *   | 'center-end'
   *   | 'center-left'
   *   | 'center-right'
   *   | 'bottom'
   *   | 'bottom-start'
   *   | 'bottom-end'
   *   | 'bottom-left'
   *   | 'bottom-right'
   *   | 'grow-row'
   *   | 'grow-column'
   *   | 'grow-fullscreen'
   *   | 'rtl'
   *   | 'timer-progress-bar'
   *   | 'timer-progress-bar-container'
   *   | 'scrollbar-measure'
   *   | 'icon-success'
   *   | 'icon-warning'
   *   | 'icon-info'
   *   | 'icon-question'
   *   | 'icon-error'
   * } SwalClass
   * @typedef {Record<SwalClass, string>} SwalClasses
   */

  /**
   * @typedef {'success' | 'warning' | 'info' | 'question' | 'error'} SwalIcon
   * @typedef {Record<SwalIcon, string>} SwalIcons
   */

  /** @type {SwalClass[]} */
  const classNames = ['container', 'shown', 'height-auto', 'iosfix', 'popup', 'modal', 'no-backdrop', 'no-transition', 'toast', 'toast-shown', 'show', 'hide', 'close', 'title', 'html-container', 'actions', 'confirm', 'deny', 'cancel', 'default-outline', 'footer', 'icon', 'icon-content', 'image', 'input', 'file', 'range', 'select', 'radio', 'checkbox', 'label', 'textarea', 'inputerror', 'input-label', 'validation-message', 'progress-steps', 'active-progress-step', 'progress-step', 'progress-step-line', 'loader', 'loading', 'styled', 'top', 'top-start', 'top-end', 'top-left', 'top-right', 'center', 'center-start', 'center-end', 'center-left', 'center-right', 'bottom', 'bottom-start', 'bottom-end', 'bottom-left', 'bottom-right', 'grow-row', 'grow-column', 'grow-fullscreen', 'rtl', 'timer-progress-bar', 'timer-progress-bar-container', 'scrollbar-measure', 'icon-success', 'icon-warning', 'icon-info', 'icon-question', 'icon-error'];
  const swalClasses = classNames.reduce((acc, className) => {
    acc[className] = swalPrefix + className;
    return acc;
  }, /** @type {SwalClasses} */{});

  /** @type {SwalIcon[]} */
  const icons = ['success', 'warning', 'info', 'question', 'error'];
  const iconTypes = icons.reduce((acc, icon) => {
    acc[icon] = swalPrefix + icon;
    return acc;
  }, /** @type {SwalIcons} */{});

  const consolePrefix = 'SweetAlert2:';

  /**
   * Capitalize the first letter of a string
   *
   * @param {string} str
   * @returns {string}
   */
  const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);

  /**
   * Standardize console warnings
   *
   * @param {string | string[]} message
   */
  const warn = message => {
    console.warn("".concat(consolePrefix, " ").concat(typeof message === 'object' ? message.join(' ') : message));
  };

  /**
   * Standardize console errors
   *
   * @param {string} message
   */
  const error = message => {
    console.error("".concat(consolePrefix, " ").concat(message));
  };

  /**
   * Private global state for `warnOnce`
   *
   * @type {string[]}
   * @private
   */
  const previousWarnOnceMessages = [];

  /**
   * Show a console warning, but only if it hasn't already been shown
   *
   * @param {string} message
   */
  const warnOnce = message => {
    if (!previousWarnOnceMessages.includes(message)) {
      previousWarnOnceMessages.push(message);
      warn(message);
    }
  };

  /**
   * Show a one-time console warning about deprecated params/methods
   *
   * @param {string} deprecatedParam
   * @param {string} useInstead
   */
  const warnAboutDeprecation = (deprecatedParam, useInstead) => {
    warnOnce("\"".concat(deprecatedParam, "\" is deprecated and will be removed in the next major release. Please use \"").concat(useInstead, "\" instead."));
  };

  /**
   * If `arg` is a function, call it (with no arguments or context) and return the result.
   * Otherwise, just pass the value through
   *
   * @param {Function | any} arg
   * @returns {any}
   */
  const callIfFunction = arg => typeof arg === 'function' ? arg() : arg;

  /**
   * @param {any} arg
   * @returns {boolean}
   */
  const hasToPromiseFn = arg => arg && typeof arg.toPromise === 'function';

  /**
   * @param {any} arg
   * @returns {Promise<any>}
   */
  const asPromise = arg => hasToPromiseFn(arg) ? arg.toPromise() : Promise.resolve(arg);

  /**
   * @param {any} arg
   * @returns {boolean}
   */
  const isPromise = arg => arg && Promise.resolve(arg) === arg;

  /**
   * Gets the popup container which contains the backdrop and the popup itself.
   *
   * @returns {HTMLElement | null}
   */
  const getContainer = () => document.body.querySelector(".".concat(swalClasses.container));

  /**
   * @param {string} selectorString
   * @returns {HTMLElement | null}
   */
  const elementBySelector = selectorString => {
    const container = getContainer();
    return container ? container.querySelector(selectorString) : null;
  };

  /**
   * @param {string} className
   * @returns {HTMLElement | null}
   */
  const elementByClass = className => {
    return elementBySelector(".".concat(className));
  };

  /**
   * @returns {HTMLElement | null}
   */
  const getPopup = () => elementByClass(swalClasses.popup);

  /**
   * @returns {HTMLElement | null}
   */
  const getIcon = () => elementByClass(swalClasses.icon);

  /**
   * @returns {HTMLElement | null}
   */
  const getIconContent = () => elementByClass(swalClasses['icon-content']);

  /**
   * @returns {HTMLElement | null}
   */
  const getTitle = () => elementByClass(swalClasses.title);

  /**
   * @returns {HTMLElement | null}
   */
  const getHtmlContainer = () => elementByClass(swalClasses['html-container']);

  /**
   * @returns {HTMLElement | null}
   */
  const getImage = () => elementByClass(swalClasses.image);

  /**
   * @returns {HTMLElement | null}
   */
  const getProgressSteps = () => elementByClass(swalClasses['progress-steps']);

  /**
   * @returns {HTMLElement | null}
   */
  const getValidationMessage = () => elementByClass(swalClasses['validation-message']);

  /**
   * @returns {HTMLButtonElement | null}
   */
  const getConfirmButton = () => /** @type {HTMLButtonElement} */elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.confirm));

  /**
   * @returns {HTMLButtonElement | null}
   */
  const getCancelButton = () => /** @type {HTMLButtonElement} */elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.cancel));

  /**
   * @returns {HTMLButtonElement | null}
   */
  const getDenyButton = () => /** @type {HTMLButtonElement} */elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.deny));

  /**
   * @returns {HTMLElement | null}
   */
  const getInputLabel = () => elementByClass(swalClasses['input-label']);

  /**
   * @returns {HTMLElement | null}
   */
  const getLoader = () => elementBySelector(".".concat(swalClasses.loader));

  /**
   * @returns {HTMLElement | null}
   */
  const getActions = () => elementByClass(swalClasses.actions);

  /**
   * @returns {HTMLElement | null}
   */
  const getFooter = () => elementByClass(swalClasses.footer);

  /**
   * @returns {HTMLElement | null}
   */
  const getTimerProgressBar = () => elementByClass(swalClasses['timer-progress-bar']);

  /**
   * @returns {HTMLElement | null}
   */
  const getCloseButton = () => elementByClass(swalClasses.close);

  // https://github.com/jkup/focusable/blob/master/index.js
  const focusable = "\n  a[href],\n  area[href],\n  input:not([disabled]),\n  select:not([disabled]),\n  textarea:not([disabled]),\n  button:not([disabled]),\n  iframe,\n  object,\n  embed,\n  [tabindex=\"0\"],\n  [contenteditable],\n  audio[controls],\n  video[controls],\n  summary\n";
  /**
   * @returns {HTMLElement[]}
   */
  const getFocusableElements = () => {
    const popup = getPopup();
    if (!popup) {
      return [];
    }
    /** @type {NodeListOf<HTMLElement>} */
    const focusableElementsWithTabindex = popup.querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])');
    const focusableElementsWithTabindexSorted = Array.from(focusableElementsWithTabindex)
    // sort according to tabindex
    .sort((a, b) => {
      const tabindexA = parseInt(a.getAttribute('tabindex') || '0');
      const tabindexB = parseInt(b.getAttribute('tabindex') || '0');
      if (tabindexA > tabindexB) {
        return 1;
      } else if (tabindexA < tabindexB) {
        return -1;
      }
      return 0;
    });

    /** @type {NodeListOf<HTMLElement>} */
    const otherFocusableElements = popup.querySelectorAll(focusable);
    const otherFocusableElementsFiltered = Array.from(otherFocusableElements).filter(el => el.getAttribute('tabindex') !== '-1');
    return [...new Set(focusableElementsWithTabindexSorted.concat(otherFocusableElementsFiltered))].filter(el => isVisible$1(el));
  };

  /**
   * @returns {boolean}
   */
  const isModal = () => {
    return hasClass(document.body, swalClasses.shown) && !hasClass(document.body, swalClasses['toast-shown']) && !hasClass(document.body, swalClasses['no-backdrop']);
  };

  /**
   * @returns {boolean}
   */
  const isToast = () => {
    const popup = getPopup();
    if (!popup) {
      return false;
    }
    return hasClass(popup, swalClasses.toast);
  };

  /**
   * @returns {boolean}
   */
  const isLoading = () => {
    const popup = getPopup();
    if (!popup) {
      return false;
    }
    return popup.hasAttribute('data-loading');
  };

  /**
   * Securely set innerHTML of an element
   * https://github.com/sweetalert2/sweetalert2/issues/1926
   *
   * @param {HTMLElement} elem
   * @param {string} html
   */
  const setInnerHtml = (elem, html) => {
    elem.textContent = '';
    if (html) {
      const parser = new DOMParser();
      const parsed = parser.parseFromString(html, "text/html");
      const head = parsed.querySelector('head');
      head && Array.from(head.childNodes).forEach(child => {
        elem.appendChild(child);
      });
      const body = parsed.querySelector('body');
      body && Array.from(body.childNodes).forEach(child => {
        if (child instanceof HTMLVideoElement || child instanceof HTMLAudioElement) {
          elem.appendChild(child.cloneNode(true)); // https://github.com/sweetalert2/sweetalert2/issues/2507
        } else {
          elem.appendChild(child);
        }
      });
    }
  };

  /**
   * @param {HTMLElement} elem
   * @param {string} className
   * @returns {boolean}
   */
  const hasClass = (elem, className) => {
    if (!className) {
      return false;
    }
    const classList = className.split(/\s+/);
    for (let i = 0; i < classList.length; i++) {
      if (!elem.classList.contains(classList[i])) {
        return false;
      }
    }
    return true;
  };

  /**
   * @param {HTMLElement} elem
   * @param {SweetAlertOptions} params
   */
  const removeCustomClasses = (elem, params) => {
    Array.from(elem.classList).forEach(className => {
      if (!Object.values(swalClasses).includes(className) && !Object.values(iconTypes).includes(className) && !Object.values(params.showClass || {}).includes(className)) {
        elem.classList.remove(className);
      }
    });
  };

  /**
   * @param {HTMLElement} elem
   * @param {SweetAlertOptions} params
   * @param {string} className
   */
  const applyCustomClass = (elem, params, className) => {
    removeCustomClasses(elem, params);
    if (params.customClass && params.customClass[className]) {
      if (typeof params.customClass[className] !== 'string' && !params.customClass[className].forEach) {
        warn("Invalid type of customClass.".concat(className, "! Expected string or iterable object, got \"").concat(typeof params.customClass[className], "\""));
        return;
      }
      addClass(elem, params.customClass[className]);
    }
  };

  /**
   * @param {HTMLElement} popup
   * @param {import('./renderers/renderInput').InputClass} inputClass
   * @returns {HTMLInputElement | null}
   */
  const getInput$1 = (popup, inputClass) => {
    if (!inputClass) {
      return null;
    }
    switch (inputClass) {
      case 'select':
      case 'textarea':
      case 'file':
        return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses[inputClass]));
      case 'checkbox':
        return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.checkbox, " input"));
      case 'radio':
        return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.radio, " input:checked")) || popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.radio, " input:first-child"));
      case 'range':
        return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.range, " input"));
      default:
        return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.input));
    }
  };

  /**
   * @param {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} input
   */
  const focusInput = input => {
    input.focus();

    // place cursor at end of text in text input
    if (input.type !== 'file') {
      // http://stackoverflow.com/a/2345915
      const val = input.value;
      input.value = '';
      input.value = val;
    }
  };

  /**
   * @param {HTMLElement | HTMLElement[] | null} target
   * @param {string | string[] | readonly string[] | undefined} classList
   * @param {boolean} condition
   */
  const toggleClass = (target, classList, condition) => {
    if (!target || !classList) {
      return;
    }
    if (typeof classList === 'string') {
      classList = classList.split(/\s+/).filter(Boolean);
    }
    classList.forEach(className => {
      if (Array.isArray(target)) {
        target.forEach(elem => {
          condition ? elem.classList.add(className) : elem.classList.remove(className);
        });
      } else {
        condition ? target.classList.add(className) : target.classList.remove(className);
      }
    });
  };

  /**
   * @param {HTMLElement | HTMLElement[] | null} target
   * @param {string | string[] | readonly string[] | undefined} classList
   */
  const addClass = (target, classList) => {
    toggleClass(target, classList, true);
  };

  /**
   * @param {HTMLElement | HTMLElement[] | null} target
   * @param {string | string[] | readonly string[] | undefined} classList
   */
  const removeClass = (target, classList) => {
    toggleClass(target, classList, false);
  };

  /**
   * Get direct child of an element by class name
   *
   * @param {HTMLElement} elem
   * @param {string} className
   * @returns {HTMLElement | undefined}
   */
  const getDirectChildByClass = (elem, className) => {
    const children = Array.from(elem.children);
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child instanceof HTMLElement && hasClass(child, className)) {
        return child;
      }
    }
  };

  /**
   * @param {HTMLElement} elem
   * @param {string} property
   * @param {*} value
   */
  const applyNumericalStyle = (elem, property, value) => {
    if (value === "".concat(parseInt(value))) {
      value = parseInt(value);
    }
    if (value || parseInt(value) === 0) {
      elem.style[property] = typeof value === 'number' ? "".concat(value, "px") : value;
    } else {
      elem.style.removeProperty(property);
    }
  };

  /**
   * @param {HTMLElement | null} elem
   * @param {string} display
   */
  const show = function (elem) {
    let display = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'flex';
    elem && (elem.style.display = display);
  };

  /**
   * @param {HTMLElement | null} elem
   */
  const hide = elem => {
    elem && (elem.style.display = 'none');
  };

  /**
   * @param {HTMLElement} parent
   * @param {string} selector
   * @param {string} property
   * @param {string} value
   */
  const setStyle = (parent, selector, property, value) => {
    /** @type {HTMLElement} */
    const el = parent.querySelector(selector);
    if (el) {
      el.style[property] = value;
    }
  };

  /**
   * @param {HTMLElement} elem
   * @param {any} condition
   * @param {string} display
   */
  const toggle = function (elem, condition) {
    let display = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'flex';
    condition ? show(elem, display) : hide(elem);
  };

  /**
   * borrowed from jquery $(elem).is(':visible') implementation
   *
   * @param {HTMLElement | null} elem
   * @returns {boolean}
   */
  const isVisible$1 = elem => !!(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));

  /**
   * @returns {boolean}
   */
  const allButtonsAreHidden = () => !isVisible$1(getConfirmButton()) && !isVisible$1(getDenyButton()) && !isVisible$1(getCancelButton());

  /**
   * @param {HTMLElement} elem
   * @returns {boolean}
   */
  const isScrollable = elem => !!(elem.scrollHeight > elem.clientHeight);

  /**
   * borrowed from https://stackoverflow.com/a/46352119
   *
   * @param {HTMLElement} elem
   * @returns {boolean}
   */
  const hasCssAnimation = elem => {
    const style = window.getComputedStyle(elem);
    const animDuration = parseFloat(style.getPropertyValue('animation-duration') || '0');
    const transDuration = parseFloat(style.getPropertyValue('transition-duration') || '0');
    return animDuration > 0 || transDuration > 0;
  };

  /**
   * @param {number} timer
   * @param {boolean} reset
   */
  const animateTimerProgressBar = function (timer) {
    let reset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const timerProgressBar = getTimerProgressBar();
    if (!timerProgressBar) {
      return;
    }
    if (isVisible$1(timerProgressBar)) {
      if (reset) {
        timerProgressBar.style.transition = 'none';
        timerProgressBar.style.width = '100%';
      }
      setTimeout(() => {
        timerProgressBar.style.transition = "width ".concat(timer / 1000, "s linear");
        timerProgressBar.style.width = '0%';
      }, 10);
    }
  };
  const stopTimerProgressBar = () => {
    const timerProgressBar = getTimerProgressBar();
    if (!timerProgressBar) {
      return;
    }
    const timerProgressBarWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
    timerProgressBar.style.removeProperty('transition');
    timerProgressBar.style.width = '100%';
    const timerProgressBarFullWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
    const timerProgressBarPercent = timerProgressBarWidth / timerProgressBarFullWidth * 100;
    timerProgressBar.style.width = "".concat(timerProgressBarPercent, "%");
  };

  /**
   * Detect Node env
   *
   * @returns {boolean}
   */
  const isNodeEnv = () => typeof window === 'undefined' || typeof document === 'undefined';

  const sweetHTML = "\n <div aria-labelledby=\"".concat(swalClasses.title, "\" aria-describedby=\"").concat(swalClasses['html-container'], "\" class=\"").concat(swalClasses.popup, "\" tabindex=\"-1\">\n   <button type=\"button\" class=\"").concat(swalClasses.close, "\"></button>\n   <ul class=\"").concat(swalClasses['progress-steps'], "\"></ul>\n   <div class=\"").concat(swalClasses.icon, "\"></div>\n   <img class=\"").concat(swalClasses.image, "\" />\n   <h2 class=\"").concat(swalClasses.title, "\" id=\"").concat(swalClasses.title, "\"></h2>\n   <div class=\"").concat(swalClasses['html-container'], "\" id=\"").concat(swalClasses['html-container'], "\"></div>\n   <input class=\"").concat(swalClasses.input, "\" id=\"").concat(swalClasses.input, "\" />\n   <input type=\"file\" class=\"").concat(swalClasses.file, "\" />\n   <div class=\"").concat(swalClasses.range, "\">\n     <input type=\"range\" />\n     <output></output>\n   </div>\n   <select class=\"").concat(swalClasses.select, "\" id=\"").concat(swalClasses.select, "\"></select>\n   <div class=\"").concat(swalClasses.radio, "\"></div>\n   <label class=\"").concat(swalClasses.checkbox, "\">\n     <input type=\"checkbox\" id=\"").concat(swalClasses.checkbox, "\" />\n     <span class=\"").concat(swalClasses.label, "\"></span>\n   </label>\n   <textarea class=\"").concat(swalClasses.textarea, "\" id=\"").concat(swalClasses.textarea, "\"></textarea>\n   <div class=\"").concat(swalClasses['validation-message'], "\" id=\"").concat(swalClasses['validation-message'], "\"></div>\n   <div class=\"").concat(swalClasses.actions, "\">\n     <div class=\"").concat(swalClasses.loader, "\"></div>\n     <button type=\"button\" class=\"").concat(swalClasses.confirm, "\"></button>\n     <button type=\"button\" class=\"").concat(swalClasses.deny, "\"></button>\n     <button type=\"button\" class=\"").concat(swalClasses.cancel, "\"></button>\n   </div>\n   <div class=\"").concat(swalClasses.footer, "\"></div>\n   <div class=\"").concat(swalClasses['timer-progress-bar-container'], "\">\n     <div class=\"").concat(swalClasses['timer-progress-bar'], "\"></div>\n   </div>\n </div>\n").replace(/(^|\n)\s*/g, '');

  /**
   * @returns {boolean}
   */
  const resetOldContainer = () => {
    const oldContainer = getContainer();
    if (!oldContainer) {
      return false;
    }
    oldContainer.remove();
    removeClass([document.documentElement, document.body], [swalClasses['no-backdrop'], swalClasses['toast-shown'], swalClasses['has-column']]);
    return true;
  };
  const resetValidationMessage$1 = () => {
    globalState.currentInstance.resetValidationMessage();
  };
  const addInputChangeListeners = () => {
    const popup = getPopup();
    const input = getDirectChildByClass(popup, swalClasses.input);
    const file = getDirectChildByClass(popup, swalClasses.file);
    /** @type {HTMLInputElement} */
    const range = popup.querySelector(".".concat(swalClasses.range, " input"));
    /** @type {HTMLOutputElement} */
    const rangeOutput = popup.querySelector(".".concat(swalClasses.range, " output"));
    const select = getDirectChildByClass(popup, swalClasses.select);
    /** @type {HTMLInputElement} */
    const checkbox = popup.querySelector(".".concat(swalClasses.checkbox, " input"));
    const textarea = getDirectChildByClass(popup, swalClasses.textarea);
    input.oninput = resetValidationMessage$1;
    file.onchange = resetValidationMessage$1;
    select.onchange = resetValidationMessage$1;
    checkbox.onchange = resetValidationMessage$1;
    textarea.oninput = resetValidationMessage$1;
    range.oninput = () => {
      resetValidationMessage$1();
      rangeOutput.value = range.value;
    };
    range.onchange = () => {
      resetValidationMessage$1();
      rangeOutput.value = range.value;
    };
  };

  /**
   * @param {string | HTMLElement} target
   * @returns {HTMLElement}
   */
  const getTarget = target => typeof target === 'string' ? document.querySelector(target) : target;

  /**
   * @param {SweetAlertOptions} params
   */
  const setupAccessibility = params => {
    const popup = getPopup();
    popup.setAttribute('role', params.toast ? 'alert' : 'dialog');
    popup.setAttribute('aria-live', params.toast ? 'polite' : 'assertive');
    if (!params.toast) {
      popup.setAttribute('aria-modal', 'true');
    }
  };

  /**
   * @param {HTMLElement} targetElement
   */
  const setupRTL = targetElement => {
    if (window.getComputedStyle(targetElement).direction === 'rtl') {
      addClass(getContainer(), swalClasses.rtl);
    }
  };

  /**
   * Add modal + backdrop + no-war message for Russians to DOM
   *
   * @param {SweetAlertOptions} params
   */
  const init = params => {
    // Clean up the old popup container if it exists
    const oldContainerExisted = resetOldContainer();
    if (isNodeEnv()) {
      error('SweetAlert2 requires document to initialize');
      return;
    }
    const container = document.createElement('div');
    container.className = swalClasses.container;
    if (oldContainerExisted) {
      addClass(container, swalClasses['no-transition']);
    }
    setInnerHtml(container, sweetHTML);
    const targetElement = getTarget(params.target);
    targetElement.appendChild(container);
    setupAccessibility(params);
    setupRTL(targetElement);
    addInputChangeListeners();
  };

  /**
   * @param {HTMLElement | object | string} param
   * @param {HTMLElement} target
   */
  const parseHtmlToContainer = (param, target) => {
    // DOM element
    if (param instanceof HTMLElement) {
      target.appendChild(param);
    }

    // Object
    else if (typeof param === 'object') {
      handleObject(param, target);
    }

    // Plain string
    else if (param) {
      setInnerHtml(target, param);
    }
  };

  /**
   * @param {any} param
   * @param {HTMLElement} target
   */
  const handleObject = (param, target) => {
    // JQuery element(s)
    if (param.jquery) {
      handleJqueryElem(target, param);
    }

    // For other objects use their string representation
    else {
      setInnerHtml(target, param.toString());
    }
  };

  /**
   * @param {HTMLElement} target
   * @param {any} elem
   */
  const handleJqueryElem = (target, elem) => {
    target.textContent = '';
    if (0 in elem) {
      for (let i = 0; (i in elem); i++) {
        target.appendChild(elem[i].cloneNode(true));
      }
    } else {
      target.appendChild(elem.cloneNode(true));
    }
  };

  /**
   * @returns {'webkitAnimationEnd' | 'animationend' | false}
   */
  const animationEndEvent = (() => {
    // Prevent run in Node env
    if (isNodeEnv()) {
      return false;
    }
    const testEl = document.createElement('div');

    // Chrome, Safari and Opera
    if (typeof testEl.style.webkitAnimation !== 'undefined') {
      return 'webkitAnimationEnd';
    }

    // Standard syntax
    if (typeof testEl.style.animation !== 'undefined') {
      return 'animationend';
    }
    return false;
  })();

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderActions = (instance, params) => {
    const actions = getActions();
    const loader = getLoader();
    if (!actions || !loader) {
      return;
    }

    // Actions (buttons) wrapper
    if (!params.showConfirmButton && !params.showDenyButton && !params.showCancelButton) {
      hide(actions);
    } else {
      show(actions);
    }

    // Custom class
    applyCustomClass(actions, params, 'actions');

    // Render all the buttons
    renderButtons(actions, loader, params);

    // Loader
    setInnerHtml(loader, params.loaderHtml || '');
    applyCustomClass(loader, params, 'loader');
  };

  /**
   * @param {HTMLElement} actions
   * @param {HTMLElement} loader
   * @param {SweetAlertOptions} params
   */
  function renderButtons(actions, loader, params) {
    const confirmButton = getConfirmButton();
    const denyButton = getDenyButton();
    const cancelButton = getCancelButton();
    if (!confirmButton || !denyButton || !cancelButton) {
      return;
    }

    // Render buttons
    renderButton(confirmButton, 'confirm', params);
    renderButton(denyButton, 'deny', params);
    renderButton(cancelButton, 'cancel', params);
    handleButtonsStyling(confirmButton, denyButton, cancelButton, params);
    if (params.reverseButtons) {
      if (params.toast) {
        actions.insertBefore(cancelButton, confirmButton);
        actions.insertBefore(denyButton, confirmButton);
      } else {
        actions.insertBefore(cancelButton, loader);
        actions.insertBefore(denyButton, loader);
        actions.insertBefore(confirmButton, loader);
      }
    }
  }

  /**
   * @param {HTMLElement} confirmButton
   * @param {HTMLElement} denyButton
   * @param {HTMLElement} cancelButton
   * @param {SweetAlertOptions} params
   */
  function handleButtonsStyling(confirmButton, denyButton, cancelButton, params) {
    if (!params.buttonsStyling) {
      removeClass([confirmButton, denyButton, cancelButton], swalClasses.styled);
      return;
    }
    addClass([confirmButton, denyButton, cancelButton], swalClasses.styled);

    // Buttons background colors
    if (params.confirmButtonColor) {
      confirmButton.style.backgroundColor = params.confirmButtonColor;
      addClass(confirmButton, swalClasses['default-outline']);
    }
    if (params.denyButtonColor) {
      denyButton.style.backgroundColor = params.denyButtonColor;
      addClass(denyButton, swalClasses['default-outline']);
    }
    if (params.cancelButtonColor) {
      cancelButton.style.backgroundColor = params.cancelButtonColor;
      addClass(cancelButton, swalClasses['default-outline']);
    }
  }

  /**
   * @param {HTMLElement} button
   * @param {'confirm' | 'deny' | 'cancel'} buttonType
   * @param {SweetAlertOptions} params
   */
  function renderButton(button, buttonType, params) {
    const buttonName = /** @type {'Confirm' | 'Deny' | 'Cancel'} */capitalizeFirstLetter(buttonType);
    toggle(button, params["show".concat(buttonName, "Button")], 'inline-block');
    setInnerHtml(button, params["".concat(buttonType, "ButtonText")] || ''); // Set caption text
    button.setAttribute('aria-label', params["".concat(buttonType, "ButtonAriaLabel")] || ''); // ARIA label

    // Add buttons custom classes
    button.className = swalClasses[buttonType];
    applyCustomClass(button, params, "".concat(buttonType, "Button"));
  }

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderCloseButton = (instance, params) => {
    const closeButton = getCloseButton();
    if (!closeButton) {
      return;
    }
    setInnerHtml(closeButton, params.closeButtonHtml || '');

    // Custom class
    applyCustomClass(closeButton, params, 'closeButton');
    toggle(closeButton, params.showCloseButton);
    closeButton.setAttribute('aria-label', params.closeButtonAriaLabel || '');
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderContainer = (instance, params) => {
    const container = getContainer();
    if (!container) {
      return;
    }
    handleBackdropParam(container, params.backdrop);
    handlePositionParam(container, params.position);
    handleGrowParam(container, params.grow);

    // Custom class
    applyCustomClass(container, params, 'container');
  };

  /**
   * @param {HTMLElement} container
   * @param {SweetAlertOptions['backdrop']} backdrop
   */
  function handleBackdropParam(container, backdrop) {
    if (typeof backdrop === 'string') {
      container.style.background = backdrop;
    } else if (!backdrop) {
      addClass([document.documentElement, document.body], swalClasses['no-backdrop']);
    }
  }

  /**
   * @param {HTMLElement} container
   * @param {SweetAlertOptions['position']} position
   */
  function handlePositionParam(container, position) {
    if (!position) {
      return;
    }
    if (position in swalClasses) {
      addClass(container, swalClasses[position]);
    } else {
      warn('The "position" parameter is not valid, defaulting to "center"');
      addClass(container, swalClasses.center);
    }
  }

  /**
   * @param {HTMLElement} container
   * @param {SweetAlertOptions['grow']} grow
   */
  function handleGrowParam(container, grow) {
    if (!grow) {
      return;
    }
    addClass(container, swalClasses["grow-".concat(grow)]);
  }

  /// <reference path="../../../../sweetalert2.d.ts"/>


  /** @type {InputClass[]} */
  const inputClasses = ['input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea'];

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderInput = (instance, params) => {
    const popup = getPopup();
    if (!popup) {
      return;
    }
    const innerParams = privateProps.innerParams.get(instance);
    const rerender = !innerParams || params.input !== innerParams.input;
    inputClasses.forEach(inputClass => {
      const inputContainer = getDirectChildByClass(popup, swalClasses[inputClass]);
      if (!inputContainer) {
        return;
      }

      // set attributes
      setAttributes(inputClass, params.inputAttributes);

      // set class
      inputContainer.className = swalClasses[inputClass];
      if (rerender) {
        hide(inputContainer);
      }
    });
    if (params.input) {
      if (rerender) {
        showInput(params);
      }
      // set custom class
      setCustomClass(params);
    }
  };

  /**
   * @param {SweetAlertOptions} params
   */
  const showInput = params => {
    if (!params.input) {
      return;
    }
    if (!renderInputType[params.input]) {
      error("Unexpected type of input! Expected \"text\", \"email\", \"password\", \"number\", \"tel\", \"select\", \"radio\", \"checkbox\", \"textarea\", \"file\" or \"url\", got \"".concat(params.input, "\""));
      return;
    }
    const inputContainer = getInputContainer(params.input);
    const input = renderInputType[params.input](inputContainer, params);
    show(inputContainer);

    // input autofocus
    if (params.inputAutoFocus) {
      setTimeout(() => {
        focusInput(input);
      });
    }
  };

  /**
   * @param {HTMLInputElement} input
   */
  const removeAttributes = input => {
    for (let i = 0; i < input.attributes.length; i++) {
      const attrName = input.attributes[i].name;
      if (!['id', 'type', 'value', 'style'].includes(attrName)) {
        input.removeAttribute(attrName);
      }
    }
  };

  /**
   * @param {InputClass} inputClass
   * @param {SweetAlertOptions['inputAttributes']} inputAttributes
   */
  const setAttributes = (inputClass, inputAttributes) => {
    const input = getInput$1(getPopup(), inputClass);
    if (!input) {
      return;
    }
    removeAttributes(input);
    for (const attr in inputAttributes) {
      input.setAttribute(attr, inputAttributes[attr]);
    }
  };

  /**
   * @param {SweetAlertOptions} params
   */
  const setCustomClass = params => {
    const inputContainer = getInputContainer(params.input);
    if (typeof params.customClass === 'object') {
      addClass(inputContainer, params.customClass.input);
    }
  };

  /**
   * @param {HTMLInputElement | HTMLTextAreaElement} input
   * @param {SweetAlertOptions} params
   */
  const setInputPlaceholder = (input, params) => {
    if (!input.placeholder || params.inputPlaceholder) {
      input.placeholder = params.inputPlaceholder;
    }
  };

  /**
   * @param {Input} input
   * @param {Input} prependTo
   * @param {SweetAlertOptions} params
   */
  const setInputLabel = (input, prependTo, params) => {
    if (params.inputLabel) {
      const label = document.createElement('label');
      const labelClass = swalClasses['input-label'];
      label.setAttribute('for', input.id);
      label.className = labelClass;
      if (typeof params.customClass === 'object') {
        addClass(label, params.customClass.inputLabel);
      }
      label.innerText = params.inputLabel;
      prependTo.insertAdjacentElement('beforebegin', label);
    }
  };

  /**
   * @param {SweetAlertOptions['input']} inputType
   * @returns {HTMLElement}
   */
  const getInputContainer = inputType => {
    return getDirectChildByClass(getPopup(), swalClasses[inputType] || swalClasses.input);
  };

  /**
   * @param {HTMLInputElement | HTMLOutputElement | HTMLTextAreaElement} input
   * @param {SweetAlertOptions['inputValue']} inputValue
   */
  const checkAndSetInputValue = (input, inputValue) => {
    if (['string', 'number'].includes(typeof inputValue)) {
      input.value = "".concat(inputValue);
    } else if (!isPromise(inputValue)) {
      warn("Unexpected type of inputValue! Expected \"string\", \"number\" or \"Promise\", got \"".concat(typeof inputValue, "\""));
    }
  };

  /** @type {Record<SweetAlertInput, (input: Input | HTMLElement, params: SweetAlertOptions) => Input>} */
  const renderInputType = {};

  /**
   * @param {HTMLInputElement} input
   * @param {SweetAlertOptions} params
   * @returns {HTMLInputElement}
   */
  renderInputType.text = renderInputType.email = renderInputType.password = renderInputType.number = renderInputType.tel = renderInputType.url = (input, params) => {
    checkAndSetInputValue(input, params.inputValue);
    setInputLabel(input, input, params);
    setInputPlaceholder(input, params);
    input.type = params.input;
    return input;
  };

  /**
   * @param {HTMLInputElement} input
   * @param {SweetAlertOptions} params
   * @returns {HTMLInputElement}
   */
  renderInputType.file = (input, params) => {
    setInputLabel(input, input, params);
    setInputPlaceholder(input, params);
    return input;
  };

  /**
   * @param {HTMLInputElement} range
   * @param {SweetAlertOptions} params
   * @returns {HTMLInputElement}
   */
  renderInputType.range = (range, params) => {
    const rangeInput = range.querySelector('input');
    const rangeOutput = range.querySelector('output');
    checkAndSetInputValue(rangeInput, params.inputValue);
    rangeInput.type = params.input;
    checkAndSetInputValue(rangeOutput, params.inputValue);
    setInputLabel(rangeInput, range, params);
    return range;
  };

  /**
   * @param {HTMLSelectElement} select
   * @param {SweetAlertOptions} params
   * @returns {HTMLSelectElement}
   */
  renderInputType.select = (select, params) => {
    select.textContent = '';
    if (params.inputPlaceholder) {
      const placeholder = document.createElement('option');
      setInnerHtml(placeholder, params.inputPlaceholder);
      placeholder.value = '';
      placeholder.disabled = true;
      placeholder.selected = true;
      select.appendChild(placeholder);
    }
    setInputLabel(select, select, params);
    return select;
  };

  /**
   * @param {HTMLInputElement} radio
   * @returns {HTMLInputElement}
   */
  renderInputType.radio = radio => {
    radio.textContent = '';
    return radio;
  };

  /**
   * @param {HTMLLabelElement} checkboxContainer
   * @param {SweetAlertOptions} params
   * @returns {HTMLInputElement}
   */
  renderInputType.checkbox = (checkboxContainer, params) => {
    const checkbox = getInput$1(getPopup(), 'checkbox');
    checkbox.value = '1';
    checkbox.checked = Boolean(params.inputValue);
    const label = checkboxContainer.querySelector('span');
    setInnerHtml(label, params.inputPlaceholder);
    return checkbox;
  };

  /**
   * @param {HTMLTextAreaElement} textarea
   * @param {SweetAlertOptions} params
   * @returns {HTMLTextAreaElement}
   */
  renderInputType.textarea = (textarea, params) => {
    checkAndSetInputValue(textarea, params.inputValue);
    setInputPlaceholder(textarea, params);
    setInputLabel(textarea, textarea, params);

    /**
     * @param {HTMLElement} el
     * @returns {number}
     */
    const getMargin = el => parseInt(window.getComputedStyle(el).marginLeft) + parseInt(window.getComputedStyle(el).marginRight);

    // https://github.com/sweetalert2/sweetalert2/issues/2291
    setTimeout(() => {
      // https://github.com/sweetalert2/sweetalert2/issues/1699
      if ('MutationObserver' in window) {
        const initialPopupWidth = parseInt(window.getComputedStyle(getPopup()).width);
        const textareaResizeHandler = () => {
          // check if texarea is still in document (i.e. popup wasn't closed in the meantime)
          if (!document.body.contains(textarea)) {
            return;
          }
          const textareaWidth = textarea.offsetWidth + getMargin(textarea);
          if (textareaWidth > initialPopupWidth) {
            getPopup().style.width = "".concat(textareaWidth, "px");
          } else {
            applyNumericalStyle(getPopup(), 'width', params.width);
          }
        };
        new MutationObserver(textareaResizeHandler).observe(textarea, {
          attributes: true,
          attributeFilter: ['style']
        });
      }
    });
    return textarea;
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderContent = (instance, params) => {
    const htmlContainer = getHtmlContainer();
    if (!htmlContainer) {
      return;
    }
    applyCustomClass(htmlContainer, params, 'htmlContainer');

    // Content as HTML
    if (params.html) {
      parseHtmlToContainer(params.html, htmlContainer);
      show(htmlContainer, 'block');
    }

    // Content as plain text
    else if (params.text) {
      htmlContainer.textContent = params.text;
      show(htmlContainer, 'block');
    }

    // No content
    else {
      hide(htmlContainer);
    }
    renderInput(instance, params);
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderFooter = (instance, params) => {
    const footer = getFooter();
    if (!footer) {
      return;
    }
    toggle(footer, params.footer, 'block');
    if (params.footer) {
      parseHtmlToContainer(params.footer, footer);
    }

    // Custom class
    applyCustomClass(footer, params, 'footer');
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderIcon = (instance, params) => {
    const innerParams = privateProps.innerParams.get(instance);
    const icon = getIcon();
    if (!icon) {
      return;
    }

    // if the given icon already rendered, apply the styling without re-rendering the icon
    if (innerParams && params.icon === innerParams.icon) {
      // Custom or default content
      setContent(icon, params);
      applyStyles(icon, params);
      return;
    }
    if (!params.icon && !params.iconHtml) {
      hide(icon);
      return;
    }
    if (params.icon && Object.keys(iconTypes).indexOf(params.icon) === -1) {
      error("Unknown icon! Expected \"success\", \"error\", \"warning\", \"info\" or \"question\", got \"".concat(params.icon, "\""));
      hide(icon);
      return;
    }
    show(icon);

    // Custom or default content
    setContent(icon, params);
    applyStyles(icon, params);

    // Animate icon
    addClass(icon, params.showClass && params.showClass.icon);
  };

  /**
   * @param {HTMLElement} icon
   * @param {SweetAlertOptions} params
   */
  const applyStyles = (icon, params) => {
    for (const [iconType, iconClassName] of Object.entries(iconTypes)) {
      if (params.icon !== iconType) {
        removeClass(icon, iconClassName);
      }
    }
    addClass(icon, params.icon && iconTypes[params.icon]);

    // Icon color
    setColor(icon, params);

    // Success icon background color
    adjustSuccessIconBackgroundColor();

    // Custom class
    applyCustomClass(icon, params, 'icon');
  };

  // Adjust success icon background color to match the popup background color
  const adjustSuccessIconBackgroundColor = () => {
    const popup = getPopup();
    if (!popup) {
      return;
    }
    const popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue('background-color');
    /** @type {NodeListOf<HTMLElement>} */
    const successIconParts = popup.querySelectorAll('[class^=swal2-success-circular-line], .swal2-success-fix');
    for (let i = 0; i < successIconParts.length; i++) {
      successIconParts[i].style.backgroundColor = popupBackgroundColor;
    }
  };
  const successIconHtml = "\n  <div class=\"swal2-success-circular-line-left\"></div>\n  <span class=\"swal2-success-line-tip\"></span> <span class=\"swal2-success-line-long\"></span>\n  <div class=\"swal2-success-ring\"></div> <div class=\"swal2-success-fix\"></div>\n  <div class=\"swal2-success-circular-line-right\"></div>\n";
  const errorIconHtml = "\n  <span class=\"swal2-x-mark\">\n    <span class=\"swal2-x-mark-line-left\"></span>\n    <span class=\"swal2-x-mark-line-right\"></span>\n  </span>\n";

  /**
   * @param {HTMLElement} icon
   * @param {SweetAlertOptions} params
   */
  const setContent = (icon, params) => {
    if (!params.icon && !params.iconHtml) {
      return;
    }
    let oldContent = icon.innerHTML;
    let newContent = '';
    if (params.iconHtml) {
      newContent = iconContent(params.iconHtml);
    } else if (params.icon === 'success') {
      newContent = successIconHtml;
      oldContent = oldContent.replace(/ style=".*?"/g, ''); // undo adjustSuccessIconBackgroundColor()
    } else if (params.icon === 'error') {
      newContent = errorIconHtml;
    } else if (params.icon) {
      const defaultIconHtml = {
        question: '?',
        warning: '!',
        info: 'i'
      };
      newContent = iconContent(defaultIconHtml[params.icon]);
    }
    if (oldContent.trim() !== newContent.trim()) {
      setInnerHtml(icon, newContent);
    }
  };

  /**
   * @param {HTMLElement} icon
   * @param {SweetAlertOptions} params
   */
  const setColor = (icon, params) => {
    if (!params.iconColor) {
      return;
    }
    icon.style.color = params.iconColor;
    icon.style.borderColor = params.iconColor;
    for (const sel of ['.swal2-success-line-tip', '.swal2-success-line-long', '.swal2-x-mark-line-left', '.swal2-x-mark-line-right']) {
      setStyle(icon, sel, 'backgroundColor', params.iconColor);
    }
    setStyle(icon, '.swal2-success-ring', 'borderColor', params.iconColor);
  };

  /**
   * @param {string} content
   * @returns {string}
   */
  const iconContent = content => "<div class=\"".concat(swalClasses['icon-content'], "\">").concat(content, "</div>");

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderImage = (instance, params) => {
    const image = getImage();
    if (!image) {
      return;
    }
    if (!params.imageUrl) {
      hide(image);
      return;
    }
    show(image, '');

    // Src, alt
    image.setAttribute('src', params.imageUrl);
    image.setAttribute('alt', params.imageAlt || '');

    // Width, height
    applyNumericalStyle(image, 'width', params.imageWidth);
    applyNumericalStyle(image, 'height', params.imageHeight);

    // Class
    image.className = swalClasses.image;
    applyCustomClass(image, params, 'image');
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderPopup = (instance, params) => {
    const container = getContainer();
    const popup = getPopup();
    if (!container || !popup) {
      return;
    }

    // Width
    // https://github.com/sweetalert2/sweetalert2/issues/2170
    if (params.toast) {
      applyNumericalStyle(container, 'width', params.width);
      popup.style.width = '100%';
      const loader = getLoader();
      loader && popup.insertBefore(loader, getIcon());
    } else {
      applyNumericalStyle(popup, 'width', params.width);
    }

    // Padding
    applyNumericalStyle(popup, 'padding', params.padding);

    // Color
    if (params.color) {
      popup.style.color = params.color;
    }

    // Background
    if (params.background) {
      popup.style.background = params.background;
    }
    hide(getValidationMessage());

    // Classes
    addClasses$1(popup, params);
  };

  /**
   * @param {HTMLElement} popup
   * @param {SweetAlertOptions} params
   */
  const addClasses$1 = (popup, params) => {
    const showClass = params.showClass || {};
    // Default Class + showClass when updating Swal.update({})
    popup.className = "".concat(swalClasses.popup, " ").concat(isVisible$1(popup) ? showClass.popup : '');
    if (params.toast) {
      addClass([document.documentElement, document.body], swalClasses['toast-shown']);
      addClass(popup, swalClasses.toast);
    } else {
      addClass(popup, swalClasses.modal);
    }

    // Custom class
    applyCustomClass(popup, params, 'popup');
    if (typeof params.customClass === 'string') {
      addClass(popup, params.customClass);
    }

    // Icon class (#1842)
    if (params.icon) {
      addClass(popup, swalClasses["icon-".concat(params.icon)]);
    }
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderProgressSteps = (instance, params) => {
    const progressStepsContainer = getProgressSteps();
    if (!progressStepsContainer) {
      return;
    }
    const {
      progressSteps,
      currentProgressStep
    } = params;
    if (!progressSteps || progressSteps.length === 0 || currentProgressStep === undefined) {
      hide(progressStepsContainer);
      return;
    }
    show(progressStepsContainer);
    progressStepsContainer.textContent = '';
    if (currentProgressStep >= progressSteps.length) {
      warn('Invalid currentProgressStep parameter, it should be less than progressSteps.length ' + '(currentProgressStep like JS arrays starts from 0)');
    }
    progressSteps.forEach((step, index) => {
      const stepEl = createStepElement(step);
      progressStepsContainer.appendChild(stepEl);
      if (index === currentProgressStep) {
        addClass(stepEl, swalClasses['active-progress-step']);
      }
      if (index !== progressSteps.length - 1) {
        const lineEl = createLineElement(params);
        progressStepsContainer.appendChild(lineEl);
      }
    });
  };

  /**
   * @param {string} step
   * @returns {HTMLLIElement}
   */
  const createStepElement = step => {
    const stepEl = document.createElement('li');
    addClass(stepEl, swalClasses['progress-step']);
    setInnerHtml(stepEl, step);
    return stepEl;
  };

  /**
   * @param {SweetAlertOptions} params
   * @returns {HTMLLIElement}
   */
  const createLineElement = params => {
    const lineEl = document.createElement('li');
    addClass(lineEl, swalClasses['progress-step-line']);
    if (params.progressStepsDistance) {
      applyNumericalStyle(lineEl, 'width', params.progressStepsDistance);
    }
    return lineEl;
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const renderTitle = (instance, params) => {
    const title = getTitle();
    if (!title) {
      return;
    }
    toggle(title, params.title || params.titleText, 'block');
    if (params.title) {
      parseHtmlToContainer(params.title, title);
    }
    if (params.titleText) {
      title.innerText = params.titleText;
    }

    // Custom class
    applyCustomClass(title, params, 'title');
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const render = (instance, params) => {
    renderPopup(instance, params);
    renderContainer(instance, params);
    renderProgressSteps(instance, params);
    renderIcon(instance, params);
    renderImage(instance, params);
    renderTitle(instance, params);
    renderCloseButton(instance, params);
    renderContent(instance, params);
    renderActions(instance, params);
    renderFooter(instance, params);
    const popup = getPopup();
    if (typeof params.didRender === 'function' && popup) {
      params.didRender(popup);
    }
  };

  /*
   * Global function to determine if SweetAlert2 popup is shown
   */
  const isVisible = () => {
    return isVisible$1(getPopup());
  };

  /*
   * Global function to click 'Confirm' button
   */
  const clickConfirm = () => {
    var _dom$getConfirmButton;
    return (_dom$getConfirmButton = getConfirmButton()) === null || _dom$getConfirmButton === void 0 ? void 0 : _dom$getConfirmButton.click();
  };

  /*
   * Global function to click 'Deny' button
   */
  const clickDeny = () => {
    var _dom$getDenyButton;
    return (_dom$getDenyButton = getDenyButton()) === null || _dom$getDenyButton === void 0 ? void 0 : _dom$getDenyButton.click();
  };

  /*
   * Global function to click 'Cancel' button
   */
  const clickCancel = () => {
    var _dom$getCancelButton;
    return (_dom$getCancelButton = getCancelButton()) === null || _dom$getCancelButton === void 0 ? void 0 : _dom$getCancelButton.click();
  };

  /** @typedef {'cancel' | 'backdrop' | 'close' | 'esc' | 'timer'} DismissReason */

  /** @type {Record<DismissReason, DismissReason>} */
  const DismissReason = Object.freeze({
    cancel: 'cancel',
    backdrop: 'backdrop',
    close: 'close',
    esc: 'esc',
    timer: 'timer'
  });

  /**
   * @param {GlobalState} globalState
   */
  const removeKeydownHandler = globalState => {
    if (globalState.keydownTarget && globalState.keydownHandlerAdded) {
      globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
        capture: globalState.keydownListenerCapture
      });
      globalState.keydownHandlerAdded = false;
    }
  };

  /**
   * @param {SweetAlert} instance
   * @param {GlobalState} globalState
   * @param {SweetAlertOptions} innerParams
   * @param {*} dismissWith
   */
  const addKeydownHandler = (instance, globalState, innerParams, dismissWith) => {
    removeKeydownHandler(globalState);
    if (!innerParams.toast) {
      globalState.keydownHandler = e => keydownHandler(instance, e, dismissWith);
      globalState.keydownTarget = innerParams.keydownListenerCapture ? window : getPopup();
      globalState.keydownListenerCapture = innerParams.keydownListenerCapture;
      globalState.keydownTarget.addEventListener('keydown', globalState.keydownHandler, {
        capture: globalState.keydownListenerCapture
      });
      globalState.keydownHandlerAdded = true;
    }
  };

  /**
   * @param {number} index
   * @param {number} increment
   */
  const setFocus = (index, increment) => {
    const focusableElements = getFocusableElements();
    // search for visible elements and select the next possible match
    if (focusableElements.length) {
      index = index + increment;

      // rollover to first item
      if (index === focusableElements.length) {
        index = 0;

        // go to last item
      } else if (index === -1) {
        index = focusableElements.length - 1;
      }
      focusableElements[index].focus();
      return;
    }
    // no visible focusable elements, focus the popup
    getPopup().focus();
  };
  const arrowKeysNextButton = ['ArrowRight', 'ArrowDown'];
  const arrowKeysPreviousButton = ['ArrowLeft', 'ArrowUp'];

  /**
   * @param {SweetAlert} instance
   * @param {KeyboardEvent} event
   * @param {Function} dismissWith
   */
  const keydownHandler = (instance, event, dismissWith) => {
    const innerParams = privateProps.innerParams.get(instance);
    if (!innerParams) {
      return; // This instance has already been destroyed
    }

    // Ignore keydown during IME composition
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event#ignoring_keydown_during_ime_composition
    // https://github.com/sweetalert2/sweetalert2/issues/720
    // https://github.com/sweetalert2/sweetalert2/issues/2406
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    if (innerParams.stopKeydownPropagation) {
      event.stopPropagation();
    }

    // ENTER
    if (event.key === 'Enter') {
      handleEnter(instance, event, innerParams);
    }

    // TAB
    else if (event.key === 'Tab') {
      handleTab(event);
    }

    // ARROWS - switch focus between buttons
    else if ([...arrowKeysNextButton, ...arrowKeysPreviousButton].includes(event.key)) {
      handleArrows(event.key);
    }

    // ESC
    else if (event.key === 'Escape') {
      handleEsc(event, innerParams, dismissWith);
    }
  };

  /**
   * @param {SweetAlert} instance
   * @param {KeyboardEvent} event
   * @param {SweetAlertOptions} innerParams
   */
  const handleEnter = (instance, event, innerParams) => {
    // https://github.com/sweetalert2/sweetalert2/issues/2386
    if (!callIfFunction(innerParams.allowEnterKey)) {
      return;
    }
    if (event.target && instance.getInput() && event.target instanceof HTMLElement && event.target.outerHTML === instance.getInput().outerHTML) {
      if (['textarea', 'file'].includes(innerParams.input)) {
        return; // do not submit
      }

      clickConfirm();
      event.preventDefault();
    }
  };

  /**
   * @param {KeyboardEvent} event
   */
  const handleTab = event => {
    const targetElement = event.target;
    const focusableElements = getFocusableElements();
    let btnIndex = -1;
    for (let i = 0; i < focusableElements.length; i++) {
      if (targetElement === focusableElements[i]) {
        btnIndex = i;
        break;
      }
    }

    // Cycle to the next button
    if (!event.shiftKey) {
      setFocus(btnIndex, 1);
    }

    // Cycle to the prev button
    else {
      setFocus(btnIndex, -1);
    }
    event.stopPropagation();
    event.preventDefault();
  };

  /**
   * @param {string} key
   */
  const handleArrows = key => {
    const confirmButton = getConfirmButton();
    const denyButton = getDenyButton();
    const cancelButton = getCancelButton();
    /** @type HTMLElement[] */
    const buttons = [confirmButton, denyButton, cancelButton];
    if (document.activeElement instanceof HTMLElement && !buttons.includes(document.activeElement)) {
      return;
    }
    const sibling = arrowKeysNextButton.includes(key) ? 'nextElementSibling' : 'previousElementSibling';
    let buttonToFocus = document.activeElement;
    for (let i = 0; i < getActions().children.length; i++) {
      buttonToFocus = buttonToFocus[sibling];
      if (!buttonToFocus) {
        return;
      }
      if (buttonToFocus instanceof HTMLButtonElement && isVisible$1(buttonToFocus)) {
        break;
      }
    }
    if (buttonToFocus instanceof HTMLButtonElement) {
      buttonToFocus.focus();
    }
  };

  /**
   * @param {KeyboardEvent} event
   * @param {SweetAlertOptions} innerParams
   * @param {Function} dismissWith
   */
  const handleEsc = (event, innerParams, dismissWith) => {
    if (callIfFunction(innerParams.allowEscapeKey)) {
      event.preventDefault();
      dismissWith(DismissReason.esc);
    }
  };

  /**
   * This module contains `WeakMap`s for each effectively-"private  property" that a `Swal` has.
   * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
   * This is the approach that Babel will probably take to implement private methods/fields
   *   https://github.com/tc39/proposal-private-methods
   *   https://github.com/babel/babel/pull/7555
   * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
   *   then we can use that language feature.
   */

  var privateMethods = {
    swalPromiseResolve: new WeakMap(),
    swalPromiseReject: new WeakMap()
  };

  // From https://developer.paciellogroup.com/blog/2018/06/the-current-state-of-modal-dialog-accessibility/
  // Adding aria-hidden="true" to elements outside of the active modal dialog ensures that
  // elements not within the active modal dialog will not be surfaced if a user opens a screen
  // reader’s list of elements (headings, form controls, landmarks, etc.) in the document.

  const setAriaHidden = () => {
    const bodyChildren = Array.from(document.body.children);
    bodyChildren.forEach(el => {
      if (el === getContainer() || el.contains(getContainer())) {
        return;
      }
      if (el.hasAttribute('aria-hidden')) {
        el.setAttribute('data-previous-aria-hidden', el.getAttribute('aria-hidden') || '');
      }
      el.setAttribute('aria-hidden', 'true');
    });
  };
  const unsetAriaHidden = () => {
    const bodyChildren = Array.from(document.body.children);
    bodyChildren.forEach(el => {
      if (el.hasAttribute('data-previous-aria-hidden')) {
        el.setAttribute('aria-hidden', el.getAttribute('data-previous-aria-hidden') || '');
        el.removeAttribute('data-previous-aria-hidden');
      } else {
        el.removeAttribute('aria-hidden');
      }
    });
  };

  // @ts-ignore
  const isSafariOrIOS = typeof window !== 'undefined' && !!window.GestureEvent; // true for Safari desktop + all iOS browsers https://stackoverflow.com/a/70585394

  /**
   * Fix iOS scrolling
   * http://stackoverflow.com/q/39626302
   */
  const iOSfix = () => {
    if (isSafariOrIOS && !hasClass(document.body, swalClasses.iosfix)) {
      const offset = document.body.scrollTop;
      document.body.style.top = "".concat(offset * -1, "px");
      addClass(document.body, swalClasses.iosfix);
      lockBodyScroll();
    }
  };

  /**
   * https://github.com/sweetalert2/sweetalert2/issues/1246
   */
  const lockBodyScroll = () => {
    const container = getContainer();
    if (!container) {
      return;
    }
    /** @type {boolean} */
    let preventTouchMove;
    /**
     * @param {TouchEvent} event
     */
    container.ontouchstart = event => {
      preventTouchMove = shouldPreventTouchMove(event);
    };
    /**
     * @param {TouchEvent} event
     */
    container.ontouchmove = event => {
      if (preventTouchMove) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
  };

  /**
   * @param {TouchEvent} event
   * @returns {boolean}
   */
  const shouldPreventTouchMove = event => {
    const target = event.target;
    const container = getContainer();
    const htmlContainer = getHtmlContainer();
    if (!container || !htmlContainer) {
      return false;
    }
    if (isStylus(event) || isZoom(event)) {
      return false;
    }
    if (target === container) {
      return true;
    }
    if (!isScrollable(container) && target instanceof HTMLElement && target.tagName !== 'INPUT' &&
    // #1603
    target.tagName !== 'TEXTAREA' &&
    // #2266
    !(isScrollable(htmlContainer) &&
    // #1944
    htmlContainer.contains(target))) {
      return true;
    }
    return false;
  };

  /**
   * https://github.com/sweetalert2/sweetalert2/issues/1786
   *
   * @param {*} event
   * @returns {boolean}
   */
  const isStylus = event => {
    return event.touches && event.touches.length && event.touches[0].touchType === 'stylus';
  };

  /**
   * https://github.com/sweetalert2/sweetalert2/issues/1891
   *
   * @param {TouchEvent} event
   * @returns {boolean}
   */
  const isZoom = event => {
    return event.touches && event.touches.length > 1;
  };
  const undoIOSfix = () => {
    if (hasClass(document.body, swalClasses.iosfix)) {
      const offset = parseInt(document.body.style.top, 10);
      removeClass(document.body, swalClasses.iosfix);
      document.body.style.top = '';
      document.body.scrollTop = offset * -1;
    }
  };

  /**
   * Measure scrollbar width for padding body during modal show/hide
   * https://github.com/twbs/bootstrap/blob/master/js/src/modal.js
   *
   * @returns {number}
   */
  const measureScrollbar = () => {
    const scrollDiv = document.createElement('div');
    scrollDiv.className = swalClasses['scrollbar-measure'];
    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
  };

  /**
   * Remember state in cases where opening and handling a modal will fiddle with it.
   * @type {number | null}
   */
  let previousBodyPadding = null;

  /**
   * @param {string} initialBodyOverflow
   */
  const replaceScrollbarWithPadding = initialBodyOverflow => {
    // for queues, do not do this more than once
    if (previousBodyPadding !== null) {
      return;
    }
    // if the body has overflow
    if (document.body.scrollHeight > window.innerHeight || initialBodyOverflow === 'scroll' // https://github.com/sweetalert2/sweetalert2/issues/2663
    ) {
      // add padding so the content doesn't shift after removal of scrollbar
      previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue('padding-right'));
      document.body.style.paddingRight = "".concat(previousBodyPadding + measureScrollbar(), "px");
    }
  };
  const undoReplaceScrollbarWithPadding = () => {
    if (previousBodyPadding !== null) {
      document.body.style.paddingRight = "".concat(previousBodyPadding, "px");
      previousBodyPadding = null;
    }
  };

  /**
   * @param {SweetAlert} instance
   * @param {HTMLElement} container
   * @param {boolean} returnFocus
   * @param {Function} didClose
   */
  function removePopupAndResetState(instance, container, returnFocus, didClose) {
    if (isToast()) {
      triggerDidCloseAndDispose(instance, didClose);
    } else {
      restoreActiveElement(returnFocus).then(() => triggerDidCloseAndDispose(instance, didClose));
      removeKeydownHandler(globalState);
    }

    // workaround for https://github.com/sweetalert2/sweetalert2/issues/2088
    // for some reason removing the container in Safari will scroll the document to bottom
    if (isSafariOrIOS) {
      container.setAttribute('style', 'display:none !important');
      container.removeAttribute('class');
      container.innerHTML = '';
    } else {
      container.remove();
    }
    if (isModal()) {
      undoReplaceScrollbarWithPadding();
      undoIOSfix();
      unsetAriaHidden();
    }
    removeBodyClasses();
  }

  /**
   * Remove SweetAlert2 classes from body
   */
  function removeBodyClasses() {
    removeClass([document.documentElement, document.body], [swalClasses.shown, swalClasses['height-auto'], swalClasses['no-backdrop'], swalClasses['toast-shown']]);
  }

  /**
   * Instance method to close sweetAlert
   *
   * @param {any} resolveValue
   */
  function close(resolveValue) {
    resolveValue = prepareResolveValue(resolveValue);
    const swalPromiseResolve = privateMethods.swalPromiseResolve.get(this);
    const didClose = triggerClosePopup(this);
    if (this.isAwaitingPromise) {
      // A swal awaiting for a promise (after a click on Confirm or Deny) cannot be dismissed anymore #2335
      if (!resolveValue.isDismissed) {
        handleAwaitingPromise(this);
        swalPromiseResolve(resolveValue);
      }
    } else if (didClose) {
      // Resolve Swal promise
      swalPromiseResolve(resolveValue);
    }
  }
  const triggerClosePopup = instance => {
    const popup = getPopup();
    if (!popup) {
      return false;
    }
    const innerParams = privateProps.innerParams.get(instance);
    if (!innerParams || hasClass(popup, innerParams.hideClass.popup)) {
      return false;
    }
    removeClass(popup, innerParams.showClass.popup);
    addClass(popup, innerParams.hideClass.popup);
    const backdrop = getContainer();
    removeClass(backdrop, innerParams.showClass.backdrop);
    addClass(backdrop, innerParams.hideClass.backdrop);
    handlePopupAnimation(instance, popup, innerParams);
    return true;
  };

  /**
   * @param {any} error
   */
  function rejectPromise(error) {
    const rejectPromise = privateMethods.swalPromiseReject.get(this);
    handleAwaitingPromise(this);
    if (rejectPromise) {
      // Reject Swal promise
      rejectPromise(error);
    }
  }

  /**
   * @param {SweetAlert} instance
   */
  const handleAwaitingPromise = instance => {
    if (instance.isAwaitingPromise) {
      delete instance.isAwaitingPromise;
      // The instance might have been previously partly destroyed, we must resume the destroy process in this case #2335
      if (!privateProps.innerParams.get(instance)) {
        instance._destroy();
      }
    }
  };

  /**
   * @param {any} resolveValue
   * @returns {SweetAlertResult}
   */
  const prepareResolveValue = resolveValue => {
    // When user calls Swal.close()
    if (typeof resolveValue === 'undefined') {
      return {
        isConfirmed: false,
        isDenied: false,
        isDismissed: true
      };
    }
    return Object.assign({
      isConfirmed: false,
      isDenied: false,
      isDismissed: false
    }, resolveValue);
  };

  /**
   * @param {SweetAlert} instance
   * @param {HTMLElement} popup
   * @param {SweetAlertOptions} innerParams
   */
  const handlePopupAnimation = (instance, popup, innerParams) => {
    const container = getContainer();
    // If animation is supported, animate
    const animationIsSupported = animationEndEvent && hasCssAnimation(popup);
    if (typeof innerParams.willClose === 'function') {
      innerParams.willClose(popup);
    }
    if (animationIsSupported) {
      animatePopup(instance, popup, container, innerParams.returnFocus, innerParams.didClose);
    } else {
      // Otherwise, remove immediately
      removePopupAndResetState(instance, container, innerParams.returnFocus, innerParams.didClose);
    }
  };

  /**
   * @param {SweetAlert} instance
   * @param {HTMLElement} popup
   * @param {HTMLElement} container
   * @param {boolean} returnFocus
   * @param {Function} didClose
   */
  const animatePopup = (instance, popup, container, returnFocus, didClose) => {
    if (!animationEndEvent) {
      return;
    }
    globalState.swalCloseEventFinishedCallback = removePopupAndResetState.bind(null, instance, container, returnFocus, didClose);
    popup.addEventListener(animationEndEvent, function (e) {
      if (e.target === popup) {
        globalState.swalCloseEventFinishedCallback();
        delete globalState.swalCloseEventFinishedCallback;
      }
    });
  };

  /**
   * @param {SweetAlert} instance
   * @param {Function} didClose
   */
  const triggerDidCloseAndDispose = (instance, didClose) => {
    setTimeout(() => {
      if (typeof didClose === 'function') {
        didClose.bind(instance.params)();
      }
      // instance might have been destroyed already
      if (instance._destroy) {
        instance._destroy();
      }
    });
  };

  /**
   * Shows loader (spinner), this is useful with AJAX requests.
   * By default the loader be shown instead of the "Confirm" button.
   *
   * @param {HTMLButtonElement | null} [buttonToReplace]
   */
  const showLoading = buttonToReplace => {
    let popup = getPopup();
    if (!popup) {
      new Swal(); // eslint-disable-line no-new
    }

    popup = getPopup();
    if (!popup) {
      return;
    }
    const loader = getLoader();
    if (isToast()) {
      hide(getIcon());
    } else {
      replaceButton(popup, buttonToReplace);
    }
    show(loader);
    popup.setAttribute('data-loading', 'true');
    popup.setAttribute('aria-busy', 'true');
    popup.focus();
  };

  /**
   * @param {HTMLElement} popup
   * @param {HTMLButtonElement | null} [buttonToReplace]
   */
  const replaceButton = (popup, buttonToReplace) => {
    const actions = getActions();
    const loader = getLoader();
    if (!actions || !loader) {
      return;
    }
    if (!buttonToReplace && isVisible$1(getConfirmButton())) {
      buttonToReplace = getConfirmButton();
    }
    show(actions);
    if (buttonToReplace) {
      hide(buttonToReplace);
      loader.setAttribute('data-button-to-replace', buttonToReplace.className);
      actions.insertBefore(loader, buttonToReplace);
    }
    addClass([popup, actions], swalClasses.loading);
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const handleInputOptionsAndValue = (instance, params) => {
    if (params.input === 'select' || params.input === 'radio') {
      handleInputOptions(instance, params);
    } else if (['text', 'email', 'number', 'tel', 'textarea'].some(i => i === params.input) && (hasToPromiseFn(params.inputValue) || isPromise(params.inputValue))) {
      showLoading(getConfirmButton());
      handleInputValue(instance, params);
    }
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} innerParams
   * @returns {SweetAlertInputValue}
   */
  const getInputValue = (instance, innerParams) => {
    const input = instance.getInput();
    if (!input) {
      return null;
    }
    switch (innerParams.input) {
      case 'checkbox':
        return getCheckboxValue(input);
      case 'radio':
        return getRadioValue(input);
      case 'file':
        return getFileValue(input);
      default:
        return innerParams.inputAutoTrim ? input.value.trim() : input.value;
    }
  };

  /**
   * @param {HTMLInputElement} input
   * @returns {number}
   */
  const getCheckboxValue = input => input.checked ? 1 : 0;

  /**
   * @param {HTMLInputElement} input
   * @returns {string | null}
   */
  const getRadioValue = input => input.checked ? input.value : null;

  /**
   * @param {HTMLInputElement} input
   * @returns {FileList | File | null}
   */
  const getFileValue = input => input.files && input.files.length ? input.getAttribute('multiple') !== null ? input.files : input.files[0] : null;

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const handleInputOptions = (instance, params) => {
    const popup = getPopup();
    if (!popup) {
      return;
    }
    /**
     * @param {Record<string, any>} inputOptions
     */
    const processInputOptions = inputOptions => {
      if (params.input === 'select') {
        populateSelectOptions(popup, formatInputOptions(inputOptions), params);
      } else if (params.input === 'radio') {
        populateRadioOptions(popup, formatInputOptions(inputOptions), params);
      }
    };
    if (hasToPromiseFn(params.inputOptions) || isPromise(params.inputOptions)) {
      showLoading(getConfirmButton());
      asPromise(params.inputOptions).then(inputOptions => {
        instance.hideLoading();
        processInputOptions(inputOptions);
      });
    } else if (typeof params.inputOptions === 'object') {
      processInputOptions(params.inputOptions);
    } else {
      error("Unexpected type of inputOptions! Expected object, Map or Promise, got ".concat(typeof params.inputOptions));
    }
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertOptions} params
   */
  const handleInputValue = (instance, params) => {
    const input = instance.getInput();
    if (!input) {
      return;
    }
    hide(input);
    asPromise(params.inputValue).then(inputValue => {
      input.value = params.input === 'number' ? "".concat(parseFloat(inputValue) || 0) : "".concat(inputValue);
      show(input);
      input.focus();
      instance.hideLoading();
    }).catch(err => {
      error("Error in inputValue promise: ".concat(err));
      input.value = '';
      show(input);
      input.focus();
      instance.hideLoading();
    });
  };

  /**
   * @param {HTMLElement} popup
   * @param {InputOptionFlattened[]} inputOptions
   * @param {SweetAlertOptions} params
   */
  function populateSelectOptions(popup, inputOptions, params) {
    const select = getDirectChildByClass(popup, swalClasses.select);
    if (!select) {
      return;
    }
    /**
     * @param {HTMLElement} parent
     * @param {string} optionLabel
     * @param {string} optionValue
     */
    const renderOption = (parent, optionLabel, optionValue) => {
      const option = document.createElement('option');
      option.value = optionValue;
      setInnerHtml(option, optionLabel);
      option.selected = isSelected(optionValue, params.inputValue);
      parent.appendChild(option);
    };
    inputOptions.forEach(inputOption => {
      const optionValue = inputOption[0];
      const optionLabel = inputOption[1];
      // <optgroup> spec:
      // https://www.w3.org/TR/html401/interact/forms.html#h-17.6
      // "...all OPTGROUP elements must be specified directly within a SELECT element (i.e., groups may not be nested)..."
      // check whether this is a <optgroup>
      if (Array.isArray(optionLabel)) {
        // if it is an array, then it is an <optgroup>
        const optgroup = document.createElement('optgroup');
        optgroup.label = optionValue;
        optgroup.disabled = false; // not configurable for now
        select.appendChild(optgroup);
        optionLabel.forEach(o => renderOption(optgroup, o[1], o[0]));
      } else {
        // case of <option>
        renderOption(select, optionLabel, optionValue);
      }
    });
    select.focus();
  }

  /**
   * @param {HTMLElement} popup
   * @param {InputOptionFlattened[]} inputOptions
   * @param {SweetAlertOptions} params
   */
  function populateRadioOptions(popup, inputOptions, params) {
    const radio = getDirectChildByClass(popup, swalClasses.radio);
    if (!radio) {
      return;
    }
    inputOptions.forEach(inputOption => {
      const radioValue = inputOption[0];
      const radioLabel = inputOption[1];
      const radioInput = document.createElement('input');
      const radioLabelElement = document.createElement('label');
      radioInput.type = 'radio';
      radioInput.name = swalClasses.radio;
      radioInput.value = radioValue;
      if (isSelected(radioValue, params.inputValue)) {
        radioInput.checked = true;
      }
      const label = document.createElement('span');
      setInnerHtml(label, radioLabel);
      label.className = swalClasses.label;
      radioLabelElement.appendChild(radioInput);
      radioLabelElement.appendChild(label);
      radio.appendChild(radioLabelElement);
    });
    const radios = radio.querySelectorAll('input');
    if (radios.length) {
      radios[0].focus();
    }
  }

  /**
   * Converts `inputOptions` into an array of `[value, label]`s
   *
   * @param {Record<string, any>} inputOptions
   * @typedef {string[]} InputOptionFlattened
   * @returns {InputOptionFlattened[]}
   */
  const formatInputOptions = inputOptions => {
    /** @type {InputOptionFlattened[]} */
    const result = [];
    if (inputOptions instanceof Map) {
      inputOptions.forEach((value, key) => {
        let valueFormatted = value;
        if (typeof valueFormatted === 'object') {
          // case of <optgroup>
          valueFormatted = formatInputOptions(valueFormatted);
        }
        result.push([key, valueFormatted]);
      });
    } else {
      Object.keys(inputOptions).forEach(key => {
        let valueFormatted = inputOptions[key];
        if (typeof valueFormatted === 'object') {
          // case of <optgroup>
          valueFormatted = formatInputOptions(valueFormatted);
        }
        result.push([key, valueFormatted]);
      });
    }
    return result;
  };

  /**
   * @param {string} optionValue
   * @param {SweetAlertInputValue} inputValue
   * @returns {boolean}
   */
  const isSelected = (optionValue, inputValue) => {
    return !!inputValue && inputValue.toString() === optionValue.toString();
  };

  /**
   * @param {SweetAlert} instance
   */
  const handleConfirmButtonClick = instance => {
    const innerParams = privateProps.innerParams.get(instance);
    instance.disableButtons();
    if (innerParams.input) {
      handleConfirmOrDenyWithInput(instance, 'confirm');
    } else {
      confirm(instance, true);
    }
  };

  /**
   * @param {SweetAlert} instance
   */
  const handleDenyButtonClick = instance => {
    const innerParams = privateProps.innerParams.get(instance);
    instance.disableButtons();
    if (innerParams.returnInputValueOnDeny) {
      handleConfirmOrDenyWithInput(instance, 'deny');
    } else {
      deny(instance, false);
    }
  };

  /**
   * @param {SweetAlert} instance
   * @param {Function} dismissWith
   */
  const handleCancelButtonClick = (instance, dismissWith) => {
    instance.disableButtons();
    dismissWith(DismissReason.cancel);
  };

  /**
   * @param {SweetAlert} instance
   * @param {'confirm' | 'deny'} type
   */
  const handleConfirmOrDenyWithInput = (instance, type) => {
    const innerParams = privateProps.innerParams.get(instance);
    if (!innerParams.input) {
      error("The \"input\" parameter is needed to be set when using returnInputValueOn".concat(capitalizeFirstLetter(type)));
      return;
    }
    const input = instance.getInput();
    const inputValue = getInputValue(instance, innerParams);
    if (innerParams.inputValidator) {
      handleInputValidator(instance, inputValue, type);
    } else if (input && !input.checkValidity()) {
      instance.enableButtons();
      instance.showValidationMessage(innerParams.validationMessage);
    } else if (type === 'deny') {
      deny(instance, inputValue);
    } else {
      confirm(instance, inputValue);
    }
  };

  /**
   * @param {SweetAlert} instance
   * @param {SweetAlertInputValue | null} inputValue
   * @param {'confirm' | 'deny'} type
   */
  const handleInputValidator = (instance, inputValue, type) => {
    const innerParams = privateProps.innerParams.get(instance);
    instance.disableInput();
    const validationPromise = Promise.resolve().then(() => asPromise(innerParams.inputValidator(inputValue, innerParams.validationMessage)));
    validationPromise.then(validationMessage => {
      instance.enableButtons();
      instance.enableInput();
      if (validationMessage) {
        instance.showValidationMessage(validationMessage);
      } else if (type === 'deny') {
        deny(instance, inputValue);
      } else {
        confirm(instance, inputValue);
      }
    });
  };

  /**
   * @param {SweetAlert} instance
   * @param {any} value
   */
  const deny = (instance, value) => {
    const innerParams = privateProps.innerParams.get(instance || undefined);
    if (innerParams.showLoaderOnDeny) {
      showLoading(getDenyButton());
    }
    if (innerParams.preDeny) {
      instance.isAwaitingPromise = true; // Flagging the instance as awaiting a promise so it's own promise's reject/resolve methods doesn't get destroyed until the result from this preDeny's promise is received
      const preDenyPromise = Promise.resolve().then(() => asPromise(innerParams.preDeny(value, innerParams.validationMessage)));
      preDenyPromise.then(preDenyValue => {
        if (preDenyValue === false) {
          instance.hideLoading();
          handleAwaitingPromise(instance);
        } else {
          instance.close({
            isDenied: true,
            value: typeof preDenyValue === 'undefined' ? value : preDenyValue
          });
        }
      }).catch(error => rejectWith(instance || undefined, error));
    } else {
      instance.close({
        isDenied: true,
        value
      });
    }
  };

  /**
   * @param {SweetAlert} instance
   * @param {any} value
   */
  const succeedWith = (instance, value) => {
    instance.close({
      isConfirmed: true,
      value
    });
  };

  /**
   *
   * @param {SweetAlert} instance
   * @param {string} error
   */
  const rejectWith = (instance, error) => {
    instance.rejectPromise(error);
  };

  /**
   *
   * @param {SweetAlert} instance
   * @param {any} value
   */
  const confirm = (instance, value) => {
    const innerParams = privateProps.innerParams.get(instance || undefined);
    if (innerParams.showLoaderOnConfirm) {
      showLoading();
    }
    if (innerParams.preConfirm) {
      instance.resetValidationMessage();
      instance.isAwaitingPromise = true; // Flagging the instance as awaiting a promise so it's own promise's reject/resolve methods doesn't get destroyed until the result from this preConfirm's promise is received
      const preConfirmPromise = Promise.resolve().then(() => asPromise(innerParams.preConfirm(value, innerParams.validationMessage)));
      preConfirmPromise.then(preConfirmValue => {
        if (isVisible$1(getValidationMessage()) || preConfirmValue === false) {
          instance.hideLoading();
          handleAwaitingPromise(instance);
        } else {
          succeedWith(instance, typeof preConfirmValue === 'undefined' ? value : preConfirmValue);
        }
      }).catch(error => rejectWith(instance || undefined, error));
    } else {
      succeedWith(instance, value);
    }
  };

  /**
   * Hides loader and shows back the button which was hidden by .showLoading()
   */
  function hideLoading() {
    // do nothing if popup is closed
    const innerParams = privateProps.innerParams.get(this);
    if (!innerParams) {
      return;
    }
    const domCache = privateProps.domCache.get(this);
    hide(domCache.loader);
    if (isToast()) {
      if (innerParams.icon) {
        show(getIcon());
      }
    } else {
      showRelatedButton(domCache);
    }
    removeClass([domCache.popup, domCache.actions], swalClasses.loading);
    domCache.popup.removeAttribute('aria-busy');
    domCache.popup.removeAttribute('data-loading');
    domCache.confirmButton.disabled = false;
    domCache.denyButton.disabled = false;
    domCache.cancelButton.disabled = false;
  }
  const showRelatedButton = domCache => {
    const buttonToReplace = domCache.popup.getElementsByClassName(domCache.loader.getAttribute('data-button-to-replace'));
    if (buttonToReplace.length) {
      show(buttonToReplace[0], 'inline-block');
    } else if (allButtonsAreHidden()) {
      hide(domCache.actions);
    }
  };

  /**
   * Gets the input DOM node, this method works with input parameter.
   *
   * @returns {HTMLInputElement | null}
   */
  function getInput() {
    const innerParams = privateProps.innerParams.get(this);
    const domCache = privateProps.domCache.get(this);
    if (!domCache) {
      return null;
    }
    return getInput$1(domCache.popup, innerParams.input);
  }

  /**
   * @param {SweetAlert} instance
   * @param {string[]} buttons
   * @param {boolean} disabled
   */
  function setButtonsDisabled(instance, buttons, disabled) {
    const domCache = privateProps.domCache.get(instance);
    buttons.forEach(button => {
      domCache[button].disabled = disabled;
    });
  }

  /**
   * @param {HTMLInputElement | null} input
   * @param {boolean} disabled
   */
  function setInputDisabled(input, disabled) {
    const popup = getPopup();
    if (!popup || !input) {
      return;
    }
    if (input.type === 'radio') {
      /** @type {NodeListOf<HTMLInputElement>} */
      const radios = popup.querySelectorAll("[name=\"".concat(swalClasses.radio, "\"]"));
      for (let i = 0; i < radios.length; i++) {
        radios[i].disabled = disabled;
      }
    } else {
      input.disabled = disabled;
    }
  }

  /**
   * Enable all the buttons
   * @this {SweetAlert}
   */
  function enableButtons() {
    setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], false);
  }

  /**
   * Disable all the buttons
   * @this {SweetAlert}
   */
  function disableButtons() {
    setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], true);
  }

  /**
   * Enable the input field
   * @this {SweetAlert}
   */
  function enableInput() {
    setInputDisabled(this.getInput(), false);
  }

  /**
   * Disable the input field
   * @this {SweetAlert}
   */
  function disableInput() {
    setInputDisabled(this.getInput(), true);
  }

  /**
   * Show block with validation message
   *
   * @param {string} error
   */
  function showValidationMessage(error) {
    const domCache = privateProps.domCache.get(this);
    const params = privateProps.innerParams.get(this);
    setInnerHtml(domCache.validationMessage, error);
    domCache.validationMessage.className = swalClasses['validation-message'];
    if (params.customClass && params.customClass.validationMessage) {
      addClass(domCache.validationMessage, params.customClass.validationMessage);
    }
    show(domCache.validationMessage);
    const input = this.getInput();
    if (input) {
      input.setAttribute('aria-invalid', true);
      input.setAttribute('aria-describedby', swalClasses['validation-message']);
      focusInput(input);
      addClass(input, swalClasses.inputerror);
    }
  }

  /**
   * Hide block with validation message
   */
  function resetValidationMessage() {
    const domCache = privateProps.domCache.get(this);
    if (domCache.validationMessage) {
      hide(domCache.validationMessage);
    }
    const input = this.getInput();
    if (input) {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
      removeClass(input, swalClasses.inputerror);
    }
  }

  const defaultParams = {
    title: '',
    titleText: '',
    text: '',
    html: '',
    footer: '',
    icon: undefined,
    iconColor: undefined,
    iconHtml: undefined,
    template: undefined,
    toast: false,
    showClass: {
      popup: 'swal2-show',
      backdrop: 'swal2-backdrop-show',
      icon: 'swal2-icon-show'
    },
    hideClass: {
      popup: 'swal2-hide',
      backdrop: 'swal2-backdrop-hide',
      icon: 'swal2-icon-hide'
    },
    customClass: {},
    target: 'body',
    color: undefined,
    backdrop: true,
    heightAuto: true,
    allowOutsideClick: true,
    allowEscapeKey: true,
    allowEnterKey: true,
    stopKeydownPropagation: true,
    keydownListenerCapture: false,
    showConfirmButton: true,
    showDenyButton: false,
    showCancelButton: false,
    preConfirm: undefined,
    preDeny: undefined,
    confirmButtonText: 'OK',
    confirmButtonAriaLabel: '',
    confirmButtonColor: undefined,
    denyButtonText: 'No',
    denyButtonAriaLabel: '',
    denyButtonColor: undefined,
    cancelButtonText: 'Cancel',
    cancelButtonAriaLabel: '',
    cancelButtonColor: undefined,
    buttonsStyling: true,
    reverseButtons: false,
    focusConfirm: true,
    focusDeny: false,
    focusCancel: false,
    returnFocus: true,
    showCloseButton: false,
    closeButtonHtml: '&times;',
    closeButtonAriaLabel: 'Close this dialog',
    loaderHtml: '',
    showLoaderOnConfirm: false,
    showLoaderOnDeny: false,
    imageUrl: undefined,
    imageWidth: undefined,
    imageHeight: undefined,
    imageAlt: '',
    timer: undefined,
    timerProgressBar: false,
    width: undefined,
    padding: undefined,
    background: undefined,
    input: undefined,
    inputPlaceholder: '',
    inputLabel: '',
    inputValue: '',
    inputOptions: {},
    inputAutoFocus: true,
    inputAutoTrim: true,
    inputAttributes: {},
    inputValidator: undefined,
    returnInputValueOnDeny: false,
    validationMessage: undefined,
    grow: false,
    position: 'center',
    progressSteps: [],
    currentProgressStep: undefined,
    progressStepsDistance: undefined,
    willOpen: undefined,
    didOpen: undefined,
    didRender: undefined,
    willClose: undefined,
    didClose: undefined,
    didDestroy: undefined,
    scrollbarPadding: true
  };
  const updatableParams = ['allowEscapeKey', 'allowOutsideClick', 'background', 'buttonsStyling', 'cancelButtonAriaLabel', 'cancelButtonColor', 'cancelButtonText', 'closeButtonAriaLabel', 'closeButtonHtml', 'color', 'confirmButtonAriaLabel', 'confirmButtonColor', 'confirmButtonText', 'currentProgressStep', 'customClass', 'denyButtonAriaLabel', 'denyButtonColor', 'denyButtonText', 'didClose', 'didDestroy', 'footer', 'hideClass', 'html', 'icon', 'iconColor', 'iconHtml', 'imageAlt', 'imageHeight', 'imageUrl', 'imageWidth', 'preConfirm', 'preDeny', 'progressSteps', 'returnFocus', 'reverseButtons', 'showCancelButton', 'showCloseButton', 'showConfirmButton', 'showDenyButton', 'text', 'title', 'titleText', 'willClose'];

  /** @type {Record<string, string>} */
  const deprecatedParams = {};
  const toastIncompatibleParams = ['allowOutsideClick', 'allowEnterKey', 'backdrop', 'focusConfirm', 'focusDeny', 'focusCancel', 'returnFocus', 'heightAuto', 'keydownListenerCapture'];

  /**
   * Is valid parameter
   *
   * @param {string} paramName
   * @returns {boolean}
   */
  const isValidParameter = paramName => {
    return Object.prototype.hasOwnProperty.call(defaultParams, paramName);
  };

  /**
   * Is valid parameter for Swal.update() method
   *
   * @param {string} paramName
   * @returns {boolean}
   */
  const isUpdatableParameter = paramName => {
    return updatableParams.indexOf(paramName) !== -1;
  };

  /**
   * Is deprecated parameter
   *
   * @param {string} paramName
   * @returns {string | undefined}
   */
  const isDeprecatedParameter = paramName => {
    return deprecatedParams[paramName];
  };

  /**
   * @param {string} param
   */
  const checkIfParamIsValid = param => {
    if (!isValidParameter(param)) {
      warn("Unknown parameter \"".concat(param, "\""));
    }
  };

  /**
   * @param {string} param
   */
  const checkIfToastParamIsValid = param => {
    if (toastIncompatibleParams.includes(param)) {
      warn("The parameter \"".concat(param, "\" is incompatible with toasts"));
    }
  };

  /**
   * @param {string} param
   */
  const checkIfParamIsDeprecated = param => {
    const isDeprecated = isDeprecatedParameter(param);
    if (isDeprecated) {
      warnAboutDeprecation(param, isDeprecated);
    }
  };

  /**
   * Show relevant warnings for given params
   *
   * @param {SweetAlertOptions} params
   */
  const showWarningsForParams = params => {
    if (params.backdrop === false && params.allowOutsideClick) {
      warn('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`');
    }
    for (const param in params) {
      checkIfParamIsValid(param);
      if (params.toast) {
        checkIfToastParamIsValid(param);
      }
      checkIfParamIsDeprecated(param);
    }
  };

  /**
   * Updates popup parameters.
   *
   * @param {SweetAlertOptions} params
   */
  function update(params) {
    const popup = getPopup();
    const innerParams = privateProps.innerParams.get(this);
    if (!popup || hasClass(popup, innerParams.hideClass.popup)) {
      warn("You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.");
      return;
    }
    const validUpdatableParams = filterValidParams(params);
    const updatedParams = Object.assign({}, innerParams, validUpdatableParams);
    render(this, updatedParams);
    privateProps.innerParams.set(this, updatedParams);
    Object.defineProperties(this, {
      params: {
        value: Object.assign({}, this.params, params),
        writable: false,
        enumerable: true
      }
    });
  }

  /**
   * @param {SweetAlertOptions} params
   * @returns {SweetAlertOptions}
   */
  const filterValidParams = params => {
    const validUpdatableParams = {};
    Object.keys(params).forEach(param => {
      if (isUpdatableParameter(param)) {
        validUpdatableParams[param] = params[param];
      } else {
        warn("Invalid parameter to update: ".concat(param));
      }
    });
    return validUpdatableParams;
  };

  /**
   * Dispose the current SweetAlert2 instance
   */
  function _destroy() {
    const domCache = privateProps.domCache.get(this);
    const innerParams = privateProps.innerParams.get(this);
    if (!innerParams) {
      disposeWeakMaps(this); // The WeakMaps might have been partly destroyed, we must recall it to dispose any remaining WeakMaps #2335
      return; // This instance has already been destroyed
    }

    // Check if there is another Swal closing
    if (domCache.popup && globalState.swalCloseEventFinishedCallback) {
      globalState.swalCloseEventFinishedCallback();
      delete globalState.swalCloseEventFinishedCallback;
    }
    if (typeof innerParams.didDestroy === 'function') {
      innerParams.didDestroy();
    }
    disposeSwal(this);
  }

  /**
   * @param {SweetAlert} instance
   */
  const disposeSwal = instance => {
    disposeWeakMaps(instance);
    // Unset this.params so GC will dispose it (#1569)
    delete instance.params;
    // Unset globalState props so GC will dispose globalState (#1569)
    delete globalState.keydownHandler;
    delete globalState.keydownTarget;
    // Unset currentInstance
    delete globalState.currentInstance;
  };

  /**
   * @param {SweetAlert} instance
   */
  const disposeWeakMaps = instance => {
    // If the current instance is awaiting a promise result, we keep the privateMethods to call them once the promise result is retrieved #2335
    if (instance.isAwaitingPromise) {
      unsetWeakMaps(privateProps, instance);
      instance.isAwaitingPromise = true;
    } else {
      unsetWeakMaps(privateMethods, instance);
      unsetWeakMaps(privateProps, instance);
      delete instance.isAwaitingPromise;
      // Unset instance methods
      delete instance.disableButtons;
      delete instance.enableButtons;
      delete instance.getInput;
      delete instance.disableInput;
      delete instance.enableInput;
      delete instance.hideLoading;
      delete instance.disableLoading;
      delete instance.showValidationMessage;
      delete instance.resetValidationMessage;
      delete instance.close;
      delete instance.closePopup;
      delete instance.closeModal;
      delete instance.closeToast;
      delete instance.rejectPromise;
      delete instance.update;
      delete instance._destroy;
    }
  };

  /**
   * @param {object} obj
   * @param {SweetAlert} instance
   */
  const unsetWeakMaps = (obj, instance) => {
    for (const i in obj) {
      obj[i].delete(instance);
    }
  };

  var instanceMethods = /*#__PURE__*/Object.freeze({
    __proto__: null,
    _destroy: _destroy,
    close: close,
    closeModal: close,
    closePopup: close,
    closeToast: close,
    disableButtons: disableButtons,
    disableInput: disableInput,
    disableLoading: hideLoading,
    enableButtons: enableButtons,
    enableInput: enableInput,
    getInput: getInput,
    handleAwaitingPromise: handleAwaitingPromise,
    hideLoading: hideLoading,
    rejectPromise: rejectPromise,
    resetValidationMessage: resetValidationMessage,
    showValidationMessage: showValidationMessage,
    update: update
  });

  const handlePopupClick = (instance, domCache, dismissWith) => {
    const innerParams = privateProps.innerParams.get(instance);
    if (innerParams.toast) {
      handleToastClick(instance, domCache, dismissWith);
    } else {
      // Ignore click events that had mousedown on the popup but mouseup on the container
      // This can happen when the user drags a slider
      handleModalMousedown(domCache);

      // Ignore click events that had mousedown on the container but mouseup on the popup
      handleContainerMousedown(domCache);
      handleModalClick(instance, domCache, dismissWith);
    }
  };
  const handleToastClick = (instance, domCache, dismissWith) => {
    // Closing toast by internal click
    domCache.popup.onclick = () => {
      const innerParams = privateProps.innerParams.get(instance);
      if (innerParams && (isAnyButtonShown(innerParams) || innerParams.timer || innerParams.input)) {
        return;
      }
      dismissWith(DismissReason.close);
    };
  };

  /**
   * @param {*} innerParams
   * @returns {boolean}
   */
  const isAnyButtonShown = innerParams => {
    return innerParams.showConfirmButton || innerParams.showDenyButton || innerParams.showCancelButton || innerParams.showCloseButton;
  };
  let ignoreOutsideClick = false;
  const handleModalMousedown = domCache => {
    domCache.popup.onmousedown = () => {
      domCache.container.onmouseup = function (e) {
        domCache.container.onmouseup = undefined;
        // We only check if the mouseup target is the container because usually it doesn't
        // have any other direct children aside of the popup
        if (e.target === domCache.container) {
          ignoreOutsideClick = true;
        }
      };
    };
  };
  const handleContainerMousedown = domCache => {
    domCache.container.onmousedown = () => {
      domCache.popup.onmouseup = function (e) {
        domCache.popup.onmouseup = undefined;
        // We also need to check if the mouseup target is a child of the popup
        if (e.target === domCache.popup || domCache.popup.contains(e.target)) {
          ignoreOutsideClick = true;
        }
      };
    };
  };
  const handleModalClick = (instance, domCache, dismissWith) => {
    domCache.container.onclick = e => {
      const innerParams = privateProps.innerParams.get(instance);
      if (ignoreOutsideClick) {
        ignoreOutsideClick = false;
        return;
      }
      if (e.target === domCache.container && callIfFunction(innerParams.allowOutsideClick)) {
        dismissWith(DismissReason.backdrop);
      }
    };
  };

  const isJqueryElement = elem => typeof elem === 'object' && elem.jquery;
  const isElement = elem => elem instanceof Element || isJqueryElement(elem);
  const argsToParams = args => {
    const params = {};
    if (typeof args[0] === 'object' && !isElement(args[0])) {
      Object.assign(params, args[0]);
    } else {
      ['title', 'html', 'icon'].forEach((name, index) => {
        const arg = args[index];
        if (typeof arg === 'string' || isElement(arg)) {
          params[name] = arg;
        } else if (arg !== undefined) {
          error("Unexpected type of ".concat(name, "! Expected \"string\" or \"Element\", got ").concat(typeof arg));
        }
      });
    }
    return params;
  };

  /**
   * Main method to create a new SweetAlert2 popup
   *
   * @param  {...SweetAlertOptions} args
   * @returns {Promise<SweetAlertResult>}
   */
  function fire() {
    const Swal = this; // eslint-disable-line @typescript-eslint/no-this-alias
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return new Swal(...args);
  }

  /**
   * Returns an extended version of `Swal` containing `params` as defaults.
   * Useful for reusing Swal configuration.
   *
   * For example:
   *
   * Before:
   * const textPromptOptions = { input: 'text', showCancelButton: true }
   * const {value: firstName} = await Swal.fire({ ...textPromptOptions, title: 'What is your first name?' })
   * const {value: lastName} = await Swal.fire({ ...textPromptOptions, title: 'What is your last name?' })
   *
   * After:
   * const TextPrompt = Swal.mixin({ input: 'text', showCancelButton: true })
   * const {value: firstName} = await TextPrompt('What is your first name?')
   * const {value: lastName} = await TextPrompt('What is your last name?')
   *
   * @param {SweetAlertOptions} mixinParams
   * @returns {SweetAlert}
   */
  function mixin(mixinParams) {
    class MixinSwal extends this {
      _main(params, priorityMixinParams) {
        return super._main(params, Object.assign({}, mixinParams, priorityMixinParams));
      }
    }
    // @ts-ignore
    return MixinSwal;
  }

  /**
   * If `timer` parameter is set, returns number of milliseconds of timer remained.
   * Otherwise, returns undefined.
   *
   * @returns {number | undefined}
   */
  const getTimerLeft = () => {
    return globalState.timeout && globalState.timeout.getTimerLeft();
  };

  /**
   * Stop timer. Returns number of milliseconds of timer remained.
   * If `timer` parameter isn't set, returns undefined.
   *
   * @returns {number | undefined}
   */
  const stopTimer = () => {
    if (globalState.timeout) {
      stopTimerProgressBar();
      return globalState.timeout.stop();
    }
  };

  /**
   * Resume timer. Returns number of milliseconds of timer remained.
   * If `timer` parameter isn't set, returns undefined.
   *
   * @returns {number | undefined}
   */
  const resumeTimer = () => {
    if (globalState.timeout) {
      const remaining = globalState.timeout.start();
      animateTimerProgressBar(remaining);
      return remaining;
    }
  };

  /**
   * Resume timer. Returns number of milliseconds of timer remained.
   * If `timer` parameter isn't set, returns undefined.
   *
   * @returns {number | undefined}
   */
  const toggleTimer = () => {
    const timer = globalState.timeout;
    return timer && (timer.running ? stopTimer() : resumeTimer());
  };

  /**
   * Increase timer. Returns number of milliseconds of an updated timer.
   * If `timer` parameter isn't set, returns undefined.
   *
   * @param {number} n
   * @returns {number | undefined}
   */
  const increaseTimer = n => {
    if (globalState.timeout) {
      const remaining = globalState.timeout.increase(n);
      animateTimerProgressBar(remaining, true);
      return remaining;
    }
  };

  /**
   * Check if timer is running. Returns true if timer is running
   * or false if timer is paused or stopped.
   * If `timer` parameter isn't set, returns undefined
   *
   * @returns {boolean}
   */
  const isTimerRunning = () => {
    return !!(globalState.timeout && globalState.timeout.isRunning());
  };

  let bodyClickListenerAdded = false;
  const clickHandlers = {};

  /**
   * @param {string} attr
   */
  function bindClickHandler() {
    let attr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'data-swal-template';
    clickHandlers[attr] = this;
    if (!bodyClickListenerAdded) {
      document.body.addEventListener('click', bodyClickListener);
      bodyClickListenerAdded = true;
    }
  }
  const bodyClickListener = event => {
    for (let el = event.target; el && el !== document; el = el.parentNode) {
      for (const attr in clickHandlers) {
        const template = el.getAttribute(attr);
        if (template) {
          clickHandlers[attr].fire({
            template
          });
          return;
        }
      }
    }
  };

  var staticMethods = /*#__PURE__*/Object.freeze({
    __proto__: null,
    argsToParams: argsToParams,
    bindClickHandler: bindClickHandler,
    clickCancel: clickCancel,
    clickConfirm: clickConfirm,
    clickDeny: clickDeny,
    enableLoading: showLoading,
    fire: fire,
    getActions: getActions,
    getCancelButton: getCancelButton,
    getCloseButton: getCloseButton,
    getConfirmButton: getConfirmButton,
    getContainer: getContainer,
    getDenyButton: getDenyButton,
    getFocusableElements: getFocusableElements,
    getFooter: getFooter,
    getHtmlContainer: getHtmlContainer,
    getIcon: getIcon,
    getIconContent: getIconContent,
    getImage: getImage,
    getInputLabel: getInputLabel,
    getLoader: getLoader,
    getPopup: getPopup,
    getProgressSteps: getProgressSteps,
    getTimerLeft: getTimerLeft,
    getTimerProgressBar: getTimerProgressBar,
    getTitle: getTitle,
    getValidationMessage: getValidationMessage,
    increaseTimer: increaseTimer,
    isDeprecatedParameter: isDeprecatedParameter,
    isLoading: isLoading,
    isTimerRunning: isTimerRunning,
    isUpdatableParameter: isUpdatableParameter,
    isValidParameter: isValidParameter,
    isVisible: isVisible,
    mixin: mixin,
    resumeTimer: resumeTimer,
    showLoading: showLoading,
    stopTimer: stopTimer,
    toggleTimer: toggleTimer
  });

  class Timer {
    /**
     * @param {Function} callback
     * @param {number} delay
     */
    constructor(callback, delay) {
      this.callback = callback;
      this.remaining = delay;
      this.running = false;
      this.start();
    }

    /**
     * @returns {number}
     */
    start() {
      if (!this.running) {
        this.running = true;
        this.started = new Date();
        this.id = setTimeout(this.callback, this.remaining);
      }
      return this.remaining;
    }

    /**
     * @returns {number}
     */
    stop() {
      if (this.started && this.running) {
        this.running = false;
        clearTimeout(this.id);
        this.remaining -= new Date().getTime() - this.started.getTime();
      }
      return this.remaining;
    }

    /**
     * @param {number} n
     * @returns {number}
     */
    increase(n) {
      const running = this.running;
      if (running) {
        this.stop();
      }
      this.remaining += n;
      if (running) {
        this.start();
      }
      return this.remaining;
    }

    /**
     * @returns {number}
     */
    getTimerLeft() {
      if (this.running) {
        this.stop();
        this.start();
      }
      return this.remaining;
    }

    /**
     * @returns {boolean}
     */
    isRunning() {
      return this.running;
    }
  }

  const swalStringParams = ['swal-title', 'swal-html', 'swal-footer'];

  /**
   * @param {SweetAlertOptions} params
   * @returns {SweetAlertOptions}
   */
  const getTemplateParams = params => {
    /** @type {HTMLTemplateElement} */
    const template = typeof params.template === 'string' ? document.querySelector(params.template) : params.template;
    if (!template) {
      return {};
    }
    /** @type {DocumentFragment} */
    const templateContent = template.content;
    showWarningsForElements(templateContent);
    const result = Object.assign(getSwalParams(templateContent), getSwalFunctionParams(templateContent), getSwalButtons(templateContent), getSwalImage(templateContent), getSwalIcon(templateContent), getSwalInput(templateContent), getSwalStringParams(templateContent, swalStringParams));
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   * @returns {SweetAlertOptions}
   */
  const getSwalParams = templateContent => {
    const result = {};
    /** @type {HTMLElement[]} */
    const swalParams = Array.from(templateContent.querySelectorAll('swal-param'));
    swalParams.forEach(param => {
      showWarningsForAttributes(param, ['name', 'value']);
      const paramName = param.getAttribute('name');
      const value = param.getAttribute('value');
      if (typeof defaultParams[paramName] === 'boolean') {
        result[paramName] = value !== 'false';
      } else if (typeof defaultParams[paramName] === 'object') {
        result[paramName] = JSON.parse(value);
      } else {
        result[paramName] = value;
      }
    });
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   * @returns {SweetAlertOptions}
   */
  const getSwalFunctionParams = templateContent => {
    const result = {};
    /** @type {HTMLElement[]} */
    const swalFunctions = Array.from(templateContent.querySelectorAll('swal-function-param'));
    swalFunctions.forEach(param => {
      const paramName = param.getAttribute('name');
      const value = param.getAttribute('value');
      result[paramName] = new Function("return ".concat(value))();
    });
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   * @returns {SweetAlertOptions}
   */
  const getSwalButtons = templateContent => {
    const result = {};
    /** @type {HTMLElement[]} */
    const swalButtons = Array.from(templateContent.querySelectorAll('swal-button'));
    swalButtons.forEach(button => {
      showWarningsForAttributes(button, ['type', 'color', 'aria-label']);
      const type = button.getAttribute('type');
      result["".concat(type, "ButtonText")] = button.innerHTML;
      result["show".concat(capitalizeFirstLetter(type), "Button")] = true;
      if (button.hasAttribute('color')) {
        result["".concat(type, "ButtonColor")] = button.getAttribute('color');
      }
      if (button.hasAttribute('aria-label')) {
        result["".concat(type, "ButtonAriaLabel")] = button.getAttribute('aria-label');
      }
    });
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   * @returns {SweetAlertOptions}
   */
  const getSwalImage = templateContent => {
    const result = {};
    /** @type {HTMLElement} */
    const image = templateContent.querySelector('swal-image');
    if (image) {
      showWarningsForAttributes(image, ['src', 'width', 'height', 'alt']);
      if (image.hasAttribute('src')) {
        result.imageUrl = image.getAttribute('src');
      }
      if (image.hasAttribute('width')) {
        result.imageWidth = image.getAttribute('width');
      }
      if (image.hasAttribute('height')) {
        result.imageHeight = image.getAttribute('height');
      }
      if (image.hasAttribute('alt')) {
        result.imageAlt = image.getAttribute('alt');
      }
    }
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   * @returns {SweetAlertOptions}
   */
  const getSwalIcon = templateContent => {
    const result = {};
    /** @type {HTMLElement} */
    const icon = templateContent.querySelector('swal-icon');
    if (icon) {
      showWarningsForAttributes(icon, ['type', 'color']);
      if (icon.hasAttribute('type')) {
        /** @type {SweetAlertIcon} */
        // @ts-ignore
        result.icon = icon.getAttribute('type');
      }
      if (icon.hasAttribute('color')) {
        result.iconColor = icon.getAttribute('color');
      }
      result.iconHtml = icon.innerHTML;
    }
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   * @returns {SweetAlertOptions}
   */
  const getSwalInput = templateContent => {
    const result = {};
    /** @type {HTMLElement} */
    const input = templateContent.querySelector('swal-input');
    if (input) {
      showWarningsForAttributes(input, ['type', 'label', 'placeholder', 'value']);
      /** @type {SweetAlertInput} */
      // @ts-ignore
      result.input = input.getAttribute('type') || 'text';
      if (input.hasAttribute('label')) {
        result.inputLabel = input.getAttribute('label');
      }
      if (input.hasAttribute('placeholder')) {
        result.inputPlaceholder = input.getAttribute('placeholder');
      }
      if (input.hasAttribute('value')) {
        result.inputValue = input.getAttribute('value');
      }
    }
    /** @type {HTMLElement[]} */
    const inputOptions = Array.from(templateContent.querySelectorAll('swal-input-option'));
    if (inputOptions.length) {
      result.inputOptions = {};
      inputOptions.forEach(option => {
        showWarningsForAttributes(option, ['value']);
        const optionValue = option.getAttribute('value');
        const optionName = option.innerHTML;
        result.inputOptions[optionValue] = optionName;
      });
    }
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   * @param {string[]} paramNames
   * @returns {SweetAlertOptions}
   */
  const getSwalStringParams = (templateContent, paramNames) => {
    const result = {};
    for (const i in paramNames) {
      const paramName = paramNames[i];
      /** @type {HTMLElement} */
      const tag = templateContent.querySelector(paramName);
      if (tag) {
        showWarningsForAttributes(tag, []);
        result[paramName.replace(/^swal-/, '')] = tag.innerHTML.trim();
      }
    }
    return result;
  };

  /**
   * @param {DocumentFragment} templateContent
   */
  const showWarningsForElements = templateContent => {
    const allowedElements = swalStringParams.concat(['swal-param', 'swal-function-param', 'swal-button', 'swal-image', 'swal-icon', 'swal-input', 'swal-input-option']);
    Array.from(templateContent.children).forEach(el => {
      const tagName = el.tagName.toLowerCase();
      if (!allowedElements.includes(tagName)) {
        warn("Unrecognized element <".concat(tagName, ">"));
      }
    });
  };

  /**
   * @param {HTMLElement} el
   * @param {string[]} allowedAttributes
   */
  const showWarningsForAttributes = (el, allowedAttributes) => {
    Array.from(el.attributes).forEach(attribute => {
      if (allowedAttributes.indexOf(attribute.name) === -1) {
        warn(["Unrecognized attribute \"".concat(attribute.name, "\" on <").concat(el.tagName.toLowerCase(), ">."), "".concat(allowedAttributes.length ? "Allowed attributes are: ".concat(allowedAttributes.join(', ')) : 'To set the value, use HTML within the element.')]);
      }
    });
  };

  const SHOW_CLASS_TIMEOUT = 10;

  /**
   * Open popup, add necessary classes and styles, fix scrollbar
   *
   * @param {SweetAlertOptions} params
   */
  const openPopup = params => {
    const container = getContainer();
    const popup = getPopup();
    if (typeof params.willOpen === 'function') {
      params.willOpen(popup);
    }
    const bodyStyles = window.getComputedStyle(document.body);
    const initialBodyOverflow = bodyStyles.overflowY;
    addClasses(container, popup, params);

    // scrolling is 'hidden' until animation is done, after that 'auto'
    setTimeout(() => {
      setScrollingVisibility(container, popup);
    }, SHOW_CLASS_TIMEOUT);
    if (isModal()) {
      fixScrollContainer(container, params.scrollbarPadding, initialBodyOverflow);
      setAriaHidden();
    }
    if (!isToast() && !globalState.previousActiveElement) {
      globalState.previousActiveElement = document.activeElement;
    }
    if (typeof params.didOpen === 'function') {
      setTimeout(() => params.didOpen(popup));
    }
    removeClass(container, swalClasses['no-transition']);
  };

  /**
   * @param {AnimationEvent} event
   */
  const swalOpenAnimationFinished = event => {
    const popup = getPopup();
    if (event.target !== popup || !animationEndEvent) {
      return;
    }
    const container = getContainer();
    popup.removeEventListener(animationEndEvent, swalOpenAnimationFinished);
    container.style.overflowY = 'auto';
  };

  /**
   * @param {HTMLElement} container
   * @param {HTMLElement} popup
   */
  const setScrollingVisibility = (container, popup) => {
    if (animationEndEvent && hasCssAnimation(popup)) {
      container.style.overflowY = 'hidden';
      popup.addEventListener(animationEndEvent, swalOpenAnimationFinished);
    } else {
      container.style.overflowY = 'auto';
    }
  };

  /**
   * @param {HTMLElement} container
   * @param {boolean} scrollbarPadding
   * @param {string} initialBodyOverflow
   */
  const fixScrollContainer = (container, scrollbarPadding, initialBodyOverflow) => {
    iOSfix();
    if (scrollbarPadding && initialBodyOverflow !== 'hidden') {
      replaceScrollbarWithPadding(initialBodyOverflow);
    }

    // sweetalert2/issues/1247
    setTimeout(() => {
      container.scrollTop = 0;
    });
  };

  /**
   * @param {HTMLElement} container
   * @param {HTMLElement} popup
   * @param {SweetAlertOptions} params
   */
  const addClasses = (container, popup, params) => {
    addClass(container, params.showClass.backdrop);
    // this workaround with opacity is needed for https://github.com/sweetalert2/sweetalert2/issues/2059
    popup.style.setProperty('opacity', '0', 'important');
    show(popup, 'grid');
    setTimeout(() => {
      // Animate popup right after showing it
      addClass(popup, params.showClass.popup);
      // and remove the opacity workaround
      popup.style.removeProperty('opacity');
    }, SHOW_CLASS_TIMEOUT); // 10ms in order to fix #2062

    addClass([document.documentElement, document.body], swalClasses.shown);
    if (params.heightAuto && params.backdrop && !params.toast) {
      addClass([document.documentElement, document.body], swalClasses['height-auto']);
    }
  };

  var defaultInputValidators = {
    /**
     * @param {string} string
     * @param {string} [validationMessage]
     * @returns {Promise<string | void>}
     */
    email: (string, validationMessage) => {
      return /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid email address');
    },
    /**
     * @param {string} string
     * @param {string} [validationMessage]
     * @returns {Promise<string | void>}
     */
    url: (string, validationMessage) => {
      // taken from https://stackoverflow.com/a/3809435 with a small change from #1306 and #2013
      return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid URL');
    }
  };

  /**
   * @param {SweetAlertOptions} params
   */
  function setDefaultInputValidators(params) {
    // Use default `inputValidator` for supported input types if not provided
    if (params.inputValidator) {
      return;
    }
    if (params.input === 'email') {
      params.inputValidator = defaultInputValidators['email'];
    }
    if (params.input === 'url') {
      params.inputValidator = defaultInputValidators['url'];
    }
  }

  /**
   * @param {SweetAlertOptions} params
   */
  function validateCustomTargetElement(params) {
    // Determine if the custom target element is valid
    if (!params.target || typeof params.target === 'string' && !document.querySelector(params.target) || typeof params.target !== 'string' && !params.target.appendChild) {
      warn('Target parameter is not valid, defaulting to "body"');
      params.target = 'body';
    }
  }

  /**
   * Set type, text and actions on popup
   *
   * @param {SweetAlertOptions} params
   */
  function setParameters(params) {
    setDefaultInputValidators(params);

    // showLoaderOnConfirm && preConfirm
    if (params.showLoaderOnConfirm && !params.preConfirm) {
      warn('showLoaderOnConfirm is set to true, but preConfirm is not defined.\n' + 'showLoaderOnConfirm should be used together with preConfirm, see usage example:\n' + 'https://sweetalert2.github.io/#ajax-request');
    }
    validateCustomTargetElement(params);

    // Replace newlines with <br> in title
    if (typeof params.title === 'string') {
      params.title = params.title.split('\n').join('<br />');
    }
    init(params);
  }

  /** @type {SweetAlert} */
  let currentInstance;
  var _promise = /*#__PURE__*/new WeakMap();
  class SweetAlert {
    /**
     * @param {...any} args
     * @this {SweetAlert}
     */
    constructor() {
      /**
       * @type {Promise<SweetAlertResult>}
       */
      _classPrivateFieldInitSpec(this, _promise, {
        writable: true,
        value: void 0
      });
      // Prevent run in Node env
      if (typeof window === 'undefined') {
        return;
      }
      currentInstance = this;

      // @ts-ignore
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      const outerParams = Object.freeze(this.constructor.argsToParams(args));

      /** @type {Readonly<SweetAlertOptions>} */
      this.params = outerParams;

      /** @type {boolean} */
      this.isAwaitingPromise = false;
      _classPrivateFieldSet(this, _promise, this._main(currentInstance.params));
    }
    _main(userParams) {
      let mixinParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      showWarningsForParams(Object.assign({}, mixinParams, userParams));
      if (globalState.currentInstance) {
        globalState.currentInstance._destroy();
        if (isModal()) {
          unsetAriaHidden();
        }
      }
      globalState.currentInstance = currentInstance;
      const innerParams = prepareParams(userParams, mixinParams);
      setParameters(innerParams);
      Object.freeze(innerParams);

      // clear the previous timer
      if (globalState.timeout) {
        globalState.timeout.stop();
        delete globalState.timeout;
      }

      // clear the restore focus timeout
      clearTimeout(globalState.restoreFocusTimeout);
      const domCache = populateDomCache(currentInstance);
      render(currentInstance, innerParams);
      privateProps.innerParams.set(currentInstance, innerParams);
      return swalPromise(currentInstance, domCache, innerParams);
    }

    // `catch` cannot be the name of a module export, so we define our thenable methods here instead
    then(onFulfilled) {
      return _classPrivateFieldGet(this, _promise).then(onFulfilled);
    }
    finally(onFinally) {
      return _classPrivateFieldGet(this, _promise).finally(onFinally);
    }
  }

  /**
   * @param {SweetAlert} instance
   * @param {DomCache} domCache
   * @param {SweetAlertOptions} innerParams
   * @returns {Promise}
   */
  const swalPromise = (instance, domCache, innerParams) => {
    return new Promise((resolve, reject) => {
      // functions to handle all closings/dismissals
      /**
       * @param {DismissReason} dismiss
       */
      const dismissWith = dismiss => {
        instance.close({
          isDismissed: true,
          dismiss
        });
      };
      privateMethods.swalPromiseResolve.set(instance, resolve);
      privateMethods.swalPromiseReject.set(instance, reject);
      domCache.confirmButton.onclick = () => {
        handleConfirmButtonClick(instance);
      };
      domCache.denyButton.onclick = () => {
        handleDenyButtonClick(instance);
      };
      domCache.cancelButton.onclick = () => {
        handleCancelButtonClick(instance, dismissWith);
      };
      domCache.closeButton.onclick = () => {
        dismissWith(DismissReason.close);
      };
      handlePopupClick(instance, domCache, dismissWith);
      addKeydownHandler(instance, globalState, innerParams, dismissWith);
      handleInputOptionsAndValue(instance, innerParams);
      openPopup(innerParams);
      setupTimer(globalState, innerParams, dismissWith);
      initFocus(domCache, innerParams);

      // Scroll container to top on open (#1247, #1946)
      setTimeout(() => {
        domCache.container.scrollTop = 0;
      });
    });
  };

  /**
   * @param {SweetAlertOptions} userParams
   * @param {SweetAlertOptions} mixinParams
   * @returns {SweetAlertOptions}
   */
  const prepareParams = (userParams, mixinParams) => {
    const templateParams = getTemplateParams(userParams);
    const params = Object.assign({}, defaultParams, mixinParams, templateParams, userParams); // precedence is described in #2131
    params.showClass = Object.assign({}, defaultParams.showClass, params.showClass);
    params.hideClass = Object.assign({}, defaultParams.hideClass, params.hideClass);
    return params;
  };

  /**
   * @param {SweetAlert} instance
   * @returns {DomCache}
   */
  const populateDomCache = instance => {
    const domCache = {
      popup: getPopup(),
      container: getContainer(),
      actions: getActions(),
      confirmButton: getConfirmButton(),
      denyButton: getDenyButton(),
      cancelButton: getCancelButton(),
      loader: getLoader(),
      closeButton: getCloseButton(),
      validationMessage: getValidationMessage(),
      progressSteps: getProgressSteps()
    };
    privateProps.domCache.set(instance, domCache);
    return domCache;
  };

  /**
   * @param {GlobalState} globalState
   * @param {SweetAlertOptions} innerParams
   * @param {Function} dismissWith
   */
  const setupTimer = (globalState, innerParams, dismissWith) => {
    const timerProgressBar = getTimerProgressBar();
    hide(timerProgressBar);
    if (innerParams.timer) {
      globalState.timeout = new Timer(() => {
        dismissWith('timer');
        delete globalState.timeout;
      }, innerParams.timer);
      if (innerParams.timerProgressBar) {
        show(timerProgressBar);
        applyCustomClass(timerProgressBar, innerParams, 'timerProgressBar');
        setTimeout(() => {
          if (globalState.timeout && globalState.timeout.running) {
            // timer can be already stopped or unset at this point
            animateTimerProgressBar(innerParams.timer);
          }
        });
      }
    }
  };

  /**
   * @param {DomCache} domCache
   * @param {SweetAlertOptions} innerParams
   */
  const initFocus = (domCache, innerParams) => {
    if (innerParams.toast) {
      return;
    }
    if (!callIfFunction(innerParams.allowEnterKey)) {
      blurActiveElement();
      return;
    }
    if (!focusButton(domCache, innerParams)) {
      setFocus(-1, 1);
    }
  };

  /**
   * @param {DomCache} domCache
   * @param {SweetAlertOptions} innerParams
   * @returns {boolean}
   */
  const focusButton = (domCache, innerParams) => {
    if (innerParams.focusDeny && isVisible$1(domCache.denyButton)) {
      domCache.denyButton.focus();
      return true;
    }
    if (innerParams.focusCancel && isVisible$1(domCache.cancelButton)) {
      domCache.cancelButton.focus();
      return true;
    }
    if (innerParams.focusConfirm && isVisible$1(domCache.confirmButton)) {
      domCache.confirmButton.focus();
      return true;
    }
    return false;
  };
  const blurActiveElement = () => {
    if (document.activeElement instanceof HTMLElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
  };

  // Dear russian users visiting russian sites. Let's have fun.
  if (typeof window !== 'undefined' && /^ru\b/.test(navigator.language) && location.host.match(/\.(ru|su|by|xn--p1ai)$/)) {
    const now = new Date();
    const initiationDate = localStorage.getItem('swal-initiation');
    if (!initiationDate) {
      localStorage.setItem('swal-initiation', "".concat(now));
    } else if ((now.getTime() - Date.parse(initiationDate)) / (1000 * 60 * 60 * 24) > 3) {
      setTimeout(() => {
        document.body.style.pointerEvents = 'none';
        const ukrainianAnthem = document.createElement('audio');
        ukrainianAnthem.src = 'https://flag-gimn.ru/wp-content/uploads/2021/09/Ukraina.mp3';
        ukrainianAnthem.loop = true;
        document.body.appendChild(ukrainianAnthem);
        setTimeout(() => {
          ukrainianAnthem.play().catch(() => {
            // ignore
          });
        }, 2500);
      }, 500);
    }
  }

  // Assign instance methods from src/instanceMethods/*.js to prototype
  SweetAlert.prototype.disableButtons = disableButtons;
  SweetAlert.prototype.enableButtons = enableButtons;
  SweetAlert.prototype.getInput = getInput;
  SweetAlert.prototype.disableInput = disableInput;
  SweetAlert.prototype.enableInput = enableInput;
  SweetAlert.prototype.hideLoading = hideLoading;
  SweetAlert.prototype.disableLoading = hideLoading;
  SweetAlert.prototype.showValidationMessage = showValidationMessage;
  SweetAlert.prototype.resetValidationMessage = resetValidationMessage;
  SweetAlert.prototype.close = close;
  SweetAlert.prototype.closePopup = close;
  SweetAlert.prototype.closeModal = close;
  SweetAlert.prototype.closeToast = close;
  SweetAlert.prototype.rejectPromise = rejectPromise;
  SweetAlert.prototype.update = update;
  SweetAlert.prototype._destroy = _destroy;

  // Assign static methods from src/staticMethods/*.js to constructor
  Object.assign(SweetAlert, staticMethods);

  // Proxy to instance methods to constructor, for now, for backwards compatibility
  Object.keys(instanceMethods).forEach(key => {
    /**
     * @param {...any} args
     * @returns {any | undefined}
     */
    SweetAlert[key] = function () {
      if (currentInstance && currentInstance[key]) {
        return currentInstance[key](...arguments);
      }
      return null;
    };
  });
  SweetAlert.DismissReason = DismissReason;
  SweetAlert.version = '11.7.27';

  const Swal = SweetAlert;
  // @ts-ignore
  Swal.default = Swal;

  return Swal;

}));
if (typeof this !== 'undefined' && this.Sweetalert2){this.swal = this.sweetAlert = this.Swal = this.SweetAlert = this.Sweetalert2}
"undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t}catch(e){n.innerText=t}}(document,".swal2-popup.swal2-toast{box-sizing:border-box;grid-column:1/4 !important;grid-row:1/4 !important;grid-template-columns:min-content auto min-content;padding:1em;overflow-y:hidden;background:#fff;box-shadow:0 0 1px rgba(0,0,0,.075),0 1px 2px rgba(0,0,0,.075),1px 2px 4px rgba(0,0,0,.075),1px 3px 8px rgba(0,0,0,.075),2px 4px 16px rgba(0,0,0,.075);pointer-events:all}.swal2-popup.swal2-toast>*{grid-column:2}.swal2-popup.swal2-toast .swal2-title{margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-loading{justify-content:center}.swal2-popup.swal2-toast .swal2-input{height:2em;margin:.5em;font-size:1em}.swal2-popup.swal2-toast .swal2-validation-message{font-size:1em}.swal2-popup.swal2-toast .swal2-footer{margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-popup.swal2-toast .swal2-close{grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-popup.swal2-toast .swal2-html-container{margin:.5em 1em;padding:0;overflow:initial;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-html-container:empty{padding:0}.swal2-popup.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-popup.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:bold}.swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-popup.swal2-toast .swal2-actions{justify-content:flex-start;height:auto;margin:0;margin-top:.5em;padding:0 .5em}.swal2-popup.swal2-toast .swal2-styled{margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-popup.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;transform:rotate(45deg);border-radius:50%}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.8em;left:-0.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-popup.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-toast-animate-success-line-tip .75s}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-toast-animate-success-line-long .75s}.swal2-popup.swal2-toast.swal2-show{animation:swal2-toast-show .5s}.swal2-popup.swal2-toast.swal2-hide{animation:swal2-toast-hide .1s forwards}div:where(.swal2-container){display:grid;position:fixed;z-index:1060;inset:0;box-sizing:border-box;grid-template-areas:\"top-start     top            top-end\" \"center-start  center         center-end\" \"bottom-start  bottom-center  bottom-end\";grid-template-rows:minmax(min-content, auto) minmax(min-content, auto) minmax(min-content, auto);height:100%;padding:.625em;overflow-x:hidden;transition:background-color .1s;-webkit-overflow-scrolling:touch}div:where(.swal2-container).swal2-backdrop-show,div:where(.swal2-container).swal2-noanimation{background:rgba(0,0,0,.4)}div:where(.swal2-container).swal2-backdrop-hide{background:rgba(0,0,0,0) !important}div:where(.swal2-container).swal2-top-start,div:where(.swal2-container).swal2-center-start,div:where(.swal2-container).swal2-bottom-start{grid-template-columns:minmax(0, 1fr) auto auto}div:where(.swal2-container).swal2-top,div:where(.swal2-container).swal2-center,div:where(.swal2-container).swal2-bottom{grid-template-columns:auto minmax(0, 1fr) auto}div:where(.swal2-container).swal2-top-end,div:where(.swal2-container).swal2-center-end,div:where(.swal2-container).swal2-bottom-end{grid-template-columns:auto auto minmax(0, 1fr)}div:where(.swal2-container).swal2-top-start>.swal2-popup{align-self:start}div:where(.swal2-container).swal2-top>.swal2-popup{grid-column:2;align-self:start;justify-self:center}div:where(.swal2-container).swal2-top-end>.swal2-popup,div:where(.swal2-container).swal2-top-right>.swal2-popup{grid-column:3;align-self:start;justify-self:end}div:where(.swal2-container).swal2-center-start>.swal2-popup,div:where(.swal2-container).swal2-center-left>.swal2-popup{grid-row:2;align-self:center}div:where(.swal2-container).swal2-center>.swal2-popup{grid-column:2;grid-row:2;align-self:center;justify-self:center}div:where(.swal2-container).swal2-center-end>.swal2-popup,div:where(.swal2-container).swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;align-self:center;justify-self:end}div:where(.swal2-container).swal2-bottom-start>.swal2-popup,div:where(.swal2-container).swal2-bottom-left>.swal2-popup{grid-column:1;grid-row:3;align-self:end}div:where(.swal2-container).swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;justify-self:center;align-self:end}div:where(.swal2-container).swal2-bottom-end>.swal2-popup,div:where(.swal2-container).swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;align-self:end;justify-self:end}div:where(.swal2-container).swal2-grow-row>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-column:1/4;width:100%}div:where(.swal2-container).swal2-grow-column>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}div:where(.swal2-container).swal2-no-transition{transition:none !important}div:where(.swal2-container) div:where(.swal2-popup){display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0, 100%);width:32em;max-width:100%;padding:0 0 1.25em;border:none;border-radius:5px;background:#fff;color:#545454;font-family:inherit;font-size:1rem}div:where(.swal2-container) div:where(.swal2-popup):focus{outline:none}div:where(.swal2-container) div:where(.swal2-popup).swal2-loading{overflow-y:hidden}div:where(.swal2-container) h2:where(.swal2-title){position:relative;max-width:100%;margin:0;padding:.8em 1em 0;color:inherit;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;word-wrap:break-word}div:where(.swal2-container) div:where(.swal2-actions){display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:center;width:auto;margin:1.25em auto 0;padding:0}div:where(.swal2-container) div:where(.swal2-actions):not(.swal2-loading) .swal2-styled[disabled]{opacity:.4}div:where(.swal2-container) div:where(.swal2-actions):not(.swal2-loading) .swal2-styled:hover{background-image:linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))}div:where(.swal2-container) div:where(.swal2-actions):not(.swal2-loading) .swal2-styled:active{background-image:linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))}div:where(.swal2-container) div:where(.swal2-loader){display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 rgba(0,0,0,0) #2778c4 rgba(0,0,0,0)}div:where(.swal2-container) button:where(.swal2-styled){margin:.3125em;padding:.625em 1.1em;transition:box-shadow .1s;box-shadow:0 0 0 3px rgba(0,0,0,0);font-weight:500}div:where(.swal2-container) button:where(.swal2-styled):not([disabled]){cursor:pointer}div:where(.swal2-container) button:where(.swal2-styled).swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:#7066e0;color:#fff;font-size:1em}div:where(.swal2-container) button:where(.swal2-styled).swal2-confirm:focus{box-shadow:0 0 0 3px rgba(112,102,224,.5)}div:where(.swal2-container) button:where(.swal2-styled).swal2-deny{border:0;border-radius:.25em;background:initial;background-color:#dc3741;color:#fff;font-size:1em}div:where(.swal2-container) button:where(.swal2-styled).swal2-deny:focus{box-shadow:0 0 0 3px rgba(220,55,65,.5)}div:where(.swal2-container) button:where(.swal2-styled).swal2-cancel{border:0;border-radius:.25em;background:initial;background-color:#6e7881;color:#fff;font-size:1em}div:where(.swal2-container) button:where(.swal2-styled).swal2-cancel:focus{box-shadow:0 0 0 3px rgba(110,120,129,.5)}div:where(.swal2-container) button:where(.swal2-styled).swal2-default-outline:focus{box-shadow:0 0 0 3px rgba(100,150,200,.5)}div:where(.swal2-container) button:where(.swal2-styled):focus{outline:none}div:where(.swal2-container) button:where(.swal2-styled)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-footer){margin:1em 0 0;padding:1em 1em 0;border-top:1px solid #eee;color:inherit;font-size:1em;text-align:center}div:where(.swal2-container) .swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto !important;overflow:hidden;border-bottom-right-radius:5px;border-bottom-left-radius:5px}div:where(.swal2-container) div:where(.swal2-timer-progress-bar){width:100%;height:.25em;background:rgba(0,0,0,.2)}div:where(.swal2-container) img:where(.swal2-image){max-width:100%;margin:2em auto 1em}div:where(.swal2-container) button:where(.swal2-close){z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:color .1s,box-shadow .1s;border:none;border-radius:5px;background:rgba(0,0,0,0);color:#ccc;font-family:monospace;font-size:2.5em;cursor:pointer;justify-self:end}div:where(.swal2-container) button:where(.swal2-close):hover{transform:none;background:rgba(0,0,0,0);color:#f27474}div:where(.swal2-container) button:where(.swal2-close):focus{outline:none;box-shadow:inset 0 0 0 3px rgba(100,150,200,.5)}div:where(.swal2-container) button:where(.swal2-close)::-moz-focus-inner{border:0}div:where(.swal2-container) .swal2-html-container{z-index:1;justify-content:center;margin:1em 1.6em .3em;padding:0;overflow:auto;color:inherit;font-size:1.125em;font-weight:normal;line-height:normal;text-align:center;word-wrap:break-word;word-break:break-word}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea),div:where(.swal2-container) select:where(.swal2-select),div:where(.swal2-container) div:where(.swal2-radio),div:where(.swal2-container) label:where(.swal2-checkbox){margin:1em 2em 3px}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea){box-sizing:border-box;width:auto;transition:border-color .1s,box-shadow .1s;border:1px solid #d9d9d9;border-radius:.1875em;background:rgba(0,0,0,0);box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px rgba(0,0,0,0);color:inherit;font-size:1.125em}div:where(.swal2-container) input:where(.swal2-input).swal2-inputerror,div:where(.swal2-container) input:where(.swal2-file).swal2-inputerror,div:where(.swal2-container) textarea:where(.swal2-textarea).swal2-inputerror{border-color:#f27474 !important;box-shadow:0 0 2px #f27474 !important}div:where(.swal2-container) input:where(.swal2-input):focus,div:where(.swal2-container) input:where(.swal2-file):focus,div:where(.swal2-container) textarea:where(.swal2-textarea):focus{border:1px solid #b4dbed;outline:none;box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px rgba(100,150,200,.5)}div:where(.swal2-container) input:where(.swal2-input)::placeholder,div:where(.swal2-container) input:where(.swal2-file)::placeholder,div:where(.swal2-container) textarea:where(.swal2-textarea)::placeholder{color:#ccc}div:where(.swal2-container) .swal2-range{margin:1em 2em 3px;background:#fff}div:where(.swal2-container) .swal2-range input{width:80%}div:where(.swal2-container) .swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}div:where(.swal2-container) .swal2-range input,div:where(.swal2-container) .swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}div:where(.swal2-container) .swal2-input{height:2.625em;padding:0 .75em}div:where(.swal2-container) .swal2-file{width:75%;margin-right:auto;margin-left:auto;background:rgba(0,0,0,0);font-size:1.125em}div:where(.swal2-container) .swal2-textarea{height:6.75em;padding:.75em}div:where(.swal2-container) .swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:rgba(0,0,0,0);color:inherit;font-size:1.125em}div:where(.swal2-container) .swal2-radio,div:where(.swal2-container) .swal2-checkbox{align-items:center;justify-content:center;background:#fff;color:inherit}div:where(.swal2-container) .swal2-radio label,div:where(.swal2-container) .swal2-checkbox label{margin:0 .6em;font-size:1.125em}div:where(.swal2-container) .swal2-radio input,div:where(.swal2-container) .swal2-checkbox input{flex-shrink:0;margin:0 .4em}div:where(.swal2-container) label:where(.swal2-input-label){display:flex;justify-content:center;margin:1em auto 0}div:where(.swal2-container) div:where(.swal2-validation-message){align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:#f0f0f0;color:#666;font-size:1em;font-weight:300}div:where(.swal2-container) div:where(.swal2-validation-message)::before{content:\"!\";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}div:where(.swal2-container) .swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:rgba(0,0,0,0);font-weight:600}div:where(.swal2-container) .swal2-progress-steps li{display:inline-block;position:relative}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:#add8e6;color:#fff}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:#add8e6}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}div:where(.swal2-icon){position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;border:0.25em solid rgba(0,0,0,0);border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;user-select:none}div:where(.swal2-icon) .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}div:where(.swal2-icon).swal2-error{border-color:#f27474;color:#f27474}div:where(.swal2-icon).swal2-error .swal2-x-mark{position:relative;flex-grow:1}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-error.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-error.swal2-icon-show .swal2-x-mark{animation:swal2-animate-error-x-mark .5s}div:where(.swal2-icon).swal2-warning{border-color:#facea8;color:#f8bb86}div:where(.swal2-icon).swal2-warning.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-warning.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .5s}div:where(.swal2-icon).swal2-info{border-color:#9de0f6;color:#3fc3ee}div:where(.swal2-icon).swal2-info.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-info.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .8s}div:where(.swal2-icon).swal2-question{border-color:#c9dae1;color:#87adbd}div:where(.swal2-icon).swal2-question.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-question.swal2-icon-show .swal2-icon-content{animation:swal2-animate-question-mark .8s}div:where(.swal2-icon).swal2-success{border-color:#a5dc86;color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;transform:rotate(45deg);border-radius:50%}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}div:where(.swal2-icon).swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-0.25em;left:-0.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}div:where(.swal2-icon).swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-animate-success-line-tip .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-animate-success-line-long .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-circular-line-right{animation:swal2-rotate-success-circular-line 4.25s ease-in}[class^=swal2]{-webkit-tap-highlight-color:rgba(0,0,0,0)}.swal2-show{animation:swal2-show .3s}.swal2-hide{animation:swal2-hide .15s forwards}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}@keyframes swal2-toast-show{0%{transform:translateY(-0.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(0.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0deg)}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-0.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@keyframes swal2-show{0%{transform:scale(0.7)}45%{transform:scale(1.05)}80%{transform:scale(0.95)}100%{transform:scale(1)}}@keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(0.5);opacity:0}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-0.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(0.4);opacity:0}50%{margin-top:1.625em;transform:scale(0.4);opacity:0}80%{margin-top:-0.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0deg);opacity:1}}@keyframes swal2-rotate-loading{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto !important}body.swal2-no-backdrop .swal2-container{background-color:rgba(0,0,0,0) !important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:all}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px rgba(0,0,0,.4)}@media print{body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow-y:scroll !important}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) .swal2-container{position:static !important}}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:rgba(0,0,0,0);pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{inset:0 auto auto 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{inset:0 0 auto auto}body.swal2-toast-shown .swal2-container.swal2-top-start,body.swal2-toast-shown .swal2-container.swal2-top-left{inset:0 auto auto 0}body.swal2-toast-shown .swal2-container.swal2-center-start,body.swal2-toast-shown .swal2-container.swal2-center-left{inset:50% auto auto 0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{inset:50% auto auto 50%;transform:translate(-50%, -50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{inset:50% 0 auto auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-start,body.swal2-toast-shown .swal2-container.swal2-bottom-left{inset:auto auto 0 0}body.swal2-toast-shown .swal2-container.swal2-bottom{inset:auto auto 0 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{inset:auto 0 0 auto}");

/***/ }),

/***/ "./node_modules/tw-elements/dist/js/tw-elements.es.min.js":
/*!****************************************************************!*\
  !*** ./node_modules/tw-elements/dist/js/tw-elements.es.min.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Alert: () => (/* binding */ Hl),
/* harmony export */   Animate: () => (/* binding */ Jl),
/* harmony export */   Button: () => (/* binding */ dl),
/* harmony export */   Carousel: () => (/* binding */ Ut),
/* harmony export */   Chart: () => (/* binding */ vc),
/* harmony export */   Chip: () => (/* binding */ hi),
/* harmony export */   ChipsInput: () => (/* binding */ K0),
/* harmony export */   Collapse: () => (/* binding */ qt),
/* harmony export */   Datatable: () => (/* binding */ wc),
/* harmony export */   Datepicker: () => (/* binding */ F0),
/* harmony export */   Dropdown: () => (/* binding */ It),
/* harmony export */   Input: () => (/* binding */ W),
/* harmony export */   Lightbox: () => (/* binding */ Ls),
/* harmony export */   Modal: () => (/* binding */ Fl),
/* harmony export */   Offcanvas: () => (/* binding */ no),
/* harmony export */   PerfectScrollbar: () => (/* binding */ yc),
/* harmony export */   Popconfirm: () => (/* binding */ kc),
/* harmony export */   Popover: () => (/* binding */ Yl),
/* harmony export */   Rating: () => (/* binding */ z0),
/* harmony export */   Ripple: () => (/* binding */ Ue),
/* harmony export */   ScrollSpy: () => (/* binding */ zl),
/* harmony export */   Select: () => (/* binding */ $o),
/* harmony export */   Sidenav: () => (/* binding */ pi),
/* harmony export */   Stepper: () => (/* binding */ j0),
/* harmony export */   Tab: () => (/* binding */ Ul),
/* harmony export */   Timepicker: () => (/* binding */ Y0),
/* harmony export */   Toast: () => (/* binding */ Xl),
/* harmony export */   Tooltip: () => (/* binding */ Qe),
/* harmony export */   initTE: () => (/* binding */ U0)
/* harmony export */ });
/*!
* Tailwind Elements 1.0.0-beta3
* 
* Tailwind Elements is an open-source UI kit of advanced components for TailwindCSS.
* Copyright © 2023 MDBootstrap.com
* 
* Unless a custom, individually assigned license has been granted, this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
* In addition, a custom license may be available upon request, subject to the terms and conditions of that license. Please contact tailwind@mdbootstrap.com for more information on obtaining a custom license.
* This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
* 
*/
var Nc = Object.defineProperty;
var Rc = (s, t, e) => t in s ? Nc(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var At = (s, t, e) => (Rc(s, typeof t != "symbol" ? t + "" : t, e), e);
const Zs = (() => {
  const s = {};
  let t = 1;
  return {
    set(e, i, n) {
      typeof e[i] > "u" && (e[i] = {
        key: i,
        id: t
      }, t++), s[e[i].id] = n;
    },
    get(e, i) {
      if (!e || typeof e[i] > "u")
        return null;
      const n = e[i];
      return n.key === i ? s[n.id] : null;
    },
    delete(e, i) {
      if (typeof e[i] > "u")
        return;
      const n = e[i];
      n.key === i && (delete s[n.id], delete e[i]);
    }
  };
})(), I = {
  setData(s, t, e) {
    Zs.set(s, t, e);
  },
  getData(s, t) {
    return Zs.get(s, t);
  },
  removeData(s, t) {
    Zs.delete(s, t);
  }
}, Pc = 1e6, Bc = 1e3, Qn = "transitionend", Hc = (s) => s == null ? `${s}` : {}.toString.call(s).match(/\s([a-z]+)/i)[1].toLowerCase(), bt = (s) => {
  do
    s += Math.floor(Math.random() * Pc);
  while (document.getElementById(s));
  return s;
}, Qa = (s) => {
  let t = s.getAttribute("data-te-target");
  if (!t || t === "#") {
    let e = s.getAttribute("href");
    if (!e || !e.includes("#") && !e.startsWith("."))
      return null;
    e.includes("#") && !e.startsWith("#") && (e = `#${e.split("#")[1]}`), t = e && e !== "#" ? e.trim() : null;
  }
  return t;
}, fo = (s) => {
  const t = Qa(s);
  return t && document.querySelector(t) ? t : null;
}, Qt = (s) => {
  const t = Qa(s);
  return t ? document.querySelector(t) : null;
}, Wc = (s) => {
  if (!s)
    return 0;
  let { transitionDuration: t, transitionDelay: e } = window.getComputedStyle(s);
  const i = Number.parseFloat(t), n = Number.parseFloat(e);
  return !i && !n ? 0 : (t = t.split(",")[0], e = e.split(",")[0], (Number.parseFloat(t) + Number.parseFloat(e)) * Bc);
}, Ja = (s) => {
  s.dispatchEvent(new Event(Qn));
}, Ve = (s) => !s || typeof s != "object" ? !1 : (typeof s.jquery < "u" && (s = s[0]), typeof s.nodeType < "u"), Jt = (s) => Ve(s) ? s.jquery ? s[0] : s : typeof s == "string" && s.length > 0 ? document.querySelector(s) : null, L = (s, t, e) => {
  Object.keys(e).forEach((i) => {
    const n = e[i], o = t[i], r = o && Ve(o) ? "element" : Hc(o);
    if (!new RegExp(n).test(r))
      throw new Error(
        `${s.toUpperCase()}: Option "${i}" provided type "${r}" but expected type "${n}".`
      );
  });
}, Lt = (s) => {
  if (!s || s.getClientRects().length === 0)
    return !1;
  if (s.style && s.parentNode && s.parentNode.style) {
    const t = getComputedStyle(s), e = getComputedStyle(s.parentNode);
    return getComputedStyle(s).getPropertyValue("visibility") === "visible" || t.display !== "none" && e.display !== "none" && t.visibility !== "hidden";
  }
  return !1;
}, me = (s) => !s || s.nodeType !== Node.ELEMENT_NODE || s.classList.contains("disabled") ? !0 : typeof s.disabled < "u" ? s.disabled : s.hasAttribute("disabled") && s.getAttribute("disabled") !== "false", tl = (s) => {
  if (!document.documentElement.attachShadow)
    return null;
  if (typeof s.getRootNode == "function") {
    const t = s.getRootNode();
    return t instanceof ShadowRoot ? t : null;
  }
  return s instanceof ShadowRoot ? s : s.parentNode ? tl(s.parentNode) : null;
}, Ms = () => function() {
}, Ge = (s) => {
  s.offsetHeight;
}, el = () => {
  const { jQuery: s } = window;
  return s && !document.body.hasAttribute("data-te-no-jquery") ? s : null;
}, Qs = [], il = (s) => {
  document.readyState === "loading" ? (Qs.length || document.addEventListener("DOMContentLoaded", () => {
    Qs.forEach((t) => t());
  }), Qs.push(s)) : s();
}, F = () => document.documentElement.dir === "rtl", Vc = (s) => Array.from(s), D = (s) => document.createElement(s), fe = (s) => {
  typeof s == "function" && s();
}, sl = (s, t, e = !0) => {
  if (!e) {
    fe(s);
    return;
  }
  const i = 5, n = Wc(t) + i;
  let o = !1;
  const r = ({ target: a }) => {
    a === t && (o = !0, t.removeEventListener(Qn, r), fe(s));
  };
  t.addEventListener(Qn, r), setTimeout(() => {
    o || Ja(t);
  }, n);
}, nl = (s, t, e, i) => {
  let n = s.indexOf(t);
  if (n === -1)
    return s[!e && i ? s.length - 1 : 0];
  const o = s.length;
  return n += e ? 1 : -1, i && (n = (n + o) % o), s[Math.max(0, Math.min(n, o - 1))];
}, Fc = /[^.]*(?=\..*)\.|.*/, Yc = /\..*/, jc = /::\d+$/, Js = {};
let Yo = 1;
const Kc = {
  mouseenter: "mouseover",
  mouseleave: "mouseout"
}, zc = /^(mouseenter|mouseleave)/i, ol = /* @__PURE__ */ new Set([
  "click",
  "dblclick",
  "mouseup",
  "mousedown",
  "contextmenu",
  "mousewheel",
  "DOMMouseScroll",
  "mouseover",
  "mouseout",
  "mousemove",
  "selectstart",
  "selectend",
  "keydown",
  "keypress",
  "keyup",
  "orientationchange",
  "touchstart",
  "touchmove",
  "touchend",
  "touchcancel",
  "pointerdown",
  "pointermove",
  "pointerup",
  "pointerleave",
  "pointercancel",
  "gesturestart",
  "gesturechange",
  "gestureend",
  "focus",
  "blur",
  "change",
  "reset",
  "select",
  "submit",
  "focusin",
  "focusout",
  "load",
  "unload",
  "beforeunload",
  "resize",
  "move",
  "DOMContentLoaded",
  "readystatechange",
  "error",
  "abort",
  "scroll"
]);
function rl(s, t) {
  return t && `${t}::${Yo++}` || s.uidEvent || Yo++;
}
function al(s) {
  const t = rl(s);
  return s.uidEvent = t, Js[t] = Js[t] || {}, Js[t];
}
function Uc(s, t) {
  return function e(i) {
    return i.delegateTarget = s, e.oneOff && h.off(s, i.type, t), t.apply(s, [i]);
  };
}
function Xc(s, t, e) {
  return function i(n) {
    const o = s.querySelectorAll(t);
    for (let { target: r } = n; r && r !== this; r = r.parentNode)
      for (let a = o.length; a--; "")
        if (o[a] === r)
          return n.delegateTarget = r, i.oneOff && h.off(s, n.type, e), e.apply(r, [n]);
    return null;
  };
}
function ll(s, t, e = null) {
  const i = Object.keys(s);
  for (let n = 0, o = i.length; n < o; n++) {
    const r = s[i[n]];
    if (r.originalHandler === t && r.delegationSelector === e)
      return r;
  }
  return null;
}
function cl(s, t, e) {
  const i = typeof t == "string", n = i ? e : t;
  let o = hl(s);
  return ol.has(o) || (o = s), [i, n, o];
}
function jo(s, t, e, i, n) {
  if (typeof t != "string" || !s)
    return;
  if (e || (e = i, i = null), zc.test(t)) {
    const m = (g) => function(v) {
      if (!v.relatedTarget || v.relatedTarget !== v.delegateTarget && !v.delegateTarget.contains(v.relatedTarget))
        return g.call(this, v);
    };
    i ? i = m(i) : e = m(e);
  }
  const [o, r, a] = cl(
    t,
    e,
    i
  ), l = al(s), p = l[a] || (l[a] = {}), u = ll(
    p,
    r,
    o ? e : null
  );
  if (u) {
    u.oneOff = u.oneOff && n;
    return;
  }
  const f = rl(
    r,
    t.replace(Fc, "")
  ), _ = o ? Xc(s, e, i) : Uc(s, e);
  _.delegationSelector = o ? e : null, _.originalHandler = r, _.oneOff = n, _.uidEvent = f, p[f] = _, s.addEventListener(a, _, o);
}
function Jn(s, t, e, i, n) {
  const o = ll(t[e], i, n);
  o && (s.removeEventListener(e, o, !!n), delete t[e][o.uidEvent]);
}
function Gc(s, t, e, i) {
  const n = t[e] || {};
  Object.keys(n).forEach((o) => {
    if (o.includes(i)) {
      const r = n[o];
      Jn(
        s,
        t,
        e,
        r.originalHandler,
        r.delegationSelector
      );
    }
  });
}
function hl(s) {
  return s = s.replace(Yc, ""), Kc[s] || s;
}
const h = {
  on(s, t, e, i) {
    jo(s, t, e, i, !1);
  },
  one(s, t, e, i) {
    jo(s, t, e, i, !0);
  },
  off(s, t, e, i) {
    if (typeof t != "string" || !s)
      return;
    const [n, o, r] = cl(
      t,
      e,
      i
    ), a = r !== t, l = al(s), p = t.startsWith(".");
    if (typeof o < "u") {
      if (!l || !l[r])
        return;
      Jn(
        s,
        l,
        r,
        o,
        n ? e : null
      );
      return;
    }
    p && Object.keys(l).forEach((f) => {
      Gc(
        s,
        l,
        f,
        t.slice(1)
      );
    });
    const u = l[r] || {};
    Object.keys(u).forEach((f) => {
      const _ = f.replace(jc, "");
      if (!a || t.includes(_)) {
        const m = u[f];
        Jn(
          s,
          l,
          r,
          m.originalHandler,
          m.delegationSelector
        );
      }
    });
  },
  trigger(s, t, e) {
    if (typeof t != "string" || !s)
      return null;
    const i = el(), n = hl(t), o = t !== n, r = ol.has(n);
    let a, l = !0, p = !0, u = !1, f = null;
    return o && i && (a = i.Event(t, e), i(s).trigger(a), l = !a.isPropagationStopped(), p = !a.isImmediatePropagationStopped(), u = a.isDefaultPrevented()), r ? (f = document.createEvent("HTMLEvents"), f.initEvent(n, l, !0)) : f = new CustomEvent(t, {
      bubbles: l,
      cancelable: !0
    }), typeof e < "u" && Object.keys(e).forEach((_) => {
      Object.defineProperty(f, _, {
        get() {
          return e[_];
        }
      });
    }), u && f.preventDefault(), p && s.dispatchEvent(f), f.defaultPrevented && typeof a < "u" && a.preventDefault(), f;
  }
}, oe = {
  on(s, t, e, i) {
    const n = t.split(" ");
    for (let o = 0; o < n.length; o++)
      h.on(s, n[o], e, i);
  },
  off(s, t, e, i) {
    const n = t.split(" ");
    for (let o = 0; o < n.length; o++)
      h.off(s, n[o], e, i);
  }
}, qc = "5.1.3";
class Et {
  constructor(t) {
    t = Jt(t), t && (this._element = t, I.setData(this._element, this.constructor.DATA_KEY, this));
  }
  dispose() {
    I.removeData(this._element, this.constructor.DATA_KEY), h.off(this._element, this.constructor.EVENT_KEY), Object.getOwnPropertyNames(this).forEach((t) => {
      this[t] = null;
    });
  }
  _queueCallback(t, e, i = !0) {
    sl(t, e, i);
  }
  /** Static */
  static getInstance(t) {
    return I.getData(Jt(t), this.DATA_KEY);
  }
  static getOrCreateInstance(t, e = {}) {
    return this.getInstance(t) || new this(t, typeof e == "object" ? e : null);
  }
  static get VERSION() {
    return qc;
  }
  static get NAME() {
    throw new Error(
      'You have to implement the static method "NAME", for each component!'
    );
  }
  static get DATA_KEY() {
    return `te.${this.NAME}`;
  }
  static get EVENT_KEY() {
    return `.${this.DATA_KEY}`;
  }
}
const Zc = "button", Qc = "active";
class dl extends Et {
  // Getters
  static get NAME() {
    return Zc;
  }
  // Public
  toggle() {
    this._element.setAttribute(
      "aria-pressed",
      this._element.classList.toggle(Qc)
    );
  }
  // Static
  static jQueryInterface(t) {
    return this.each(function() {
      const e = dl.getOrCreateInstance(this);
      t === "toggle" && e[t]();
    });
  }
}
var Q = "top", ht = "bottom", dt = "right", J = "left", Ii = "auto", qe = [Q, ht, dt, J], ve = "start", Fe = "end", ul = "clippingParents", mo = "viewport", Ie = "popper", pl = "reference", to = /* @__PURE__ */ qe.reduce(function(s, t) {
  return s.concat([t + "-" + ve, t + "-" + Fe]);
}, []), go = /* @__PURE__ */ [].concat(qe, [Ii]).reduce(function(s, t) {
  return s.concat([t, t + "-" + ve, t + "-" + Fe]);
}, []), _l = "beforeRead", fl = "read", ml = "afterRead", gl = "beforeMain", bl = "main", vl = "afterMain", Tl = "beforeWrite", El = "write", Cl = "afterWrite", Ns = [_l, fl, ml, gl, bl, vl, Tl, El, Cl];
function Nt(s) {
  return s ? (s.nodeName || "").toLowerCase() : null;
}
function ut(s) {
  if (s == null)
    return window;
  if (s.toString() !== "[object Window]") {
    var t = s.ownerDocument;
    return t && t.defaultView || window;
  }
  return s;
}
function Te(s) {
  var t = ut(s).Element;
  return s instanceof t || s instanceof Element;
}
function ct(s) {
  var t = ut(s).HTMLElement;
  return s instanceof t || s instanceof HTMLElement;
}
function bo(s) {
  if (typeof ShadowRoot > "u")
    return !1;
  var t = ut(s).ShadowRoot;
  return s instanceof t || s instanceof ShadowRoot;
}
function Jc(s) {
  var t = s.state;
  Object.keys(t.elements).forEach(function(e) {
    var i = t.styles[e] || {}, n = t.attributes[e] || {}, o = t.elements[e];
    !ct(o) || !Nt(o) || (Object.assign(o.style, i), Object.keys(n).forEach(function(r) {
      var a = n[r];
      a === !1 ? o.removeAttribute(r) : o.setAttribute(r, a === !0 ? "" : a);
    }));
  });
}
function th(s) {
  var t = s.state, e = {
    popper: {
      position: t.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  return Object.assign(t.elements.popper.style, e.popper), t.styles = e, t.elements.arrow && Object.assign(t.elements.arrow.style, e.arrow), function() {
    Object.keys(t.elements).forEach(function(i) {
      var n = t.elements[i], o = t.attributes[i] || {}, r = Object.keys(t.styles.hasOwnProperty(i) ? t.styles[i] : e[i]), a = r.reduce(function(l, p) {
        return l[p] = "", l;
      }, {});
      !ct(n) || !Nt(n) || (Object.assign(n.style, a), Object.keys(o).forEach(function(l) {
        n.removeAttribute(l);
      }));
    });
  };
}
const vo = {
  name: "applyStyles",
  enabled: !0,
  phase: "write",
  fn: Jc,
  effect: th,
  requires: ["computeStyles"]
};
function vt(s) {
  return s.split("-")[0];
}
var ge = Math.max, Rs = Math.min, Ye = Math.round;
function eo() {
  var s = navigator.userAgentData;
  return s != null && s.brands && Array.isArray(s.brands) ? s.brands.map(function(t) {
    return t.brand + "/" + t.version;
  }).join(" ") : navigator.userAgent;
}
function Al() {
  return !/^((?!chrome|android).)*safari/i.test(eo());
}
function je(s, t, e) {
  t === void 0 && (t = !1), e === void 0 && (e = !1);
  var i = s.getBoundingClientRect(), n = 1, o = 1;
  t && ct(s) && (n = s.offsetWidth > 0 && Ye(i.width) / s.offsetWidth || 1, o = s.offsetHeight > 0 && Ye(i.height) / s.offsetHeight || 1);
  var r = Te(s) ? ut(s) : window, a = r.visualViewport, l = !Al() && e, p = (i.left + (l && a ? a.offsetLeft : 0)) / n, u = (i.top + (l && a ? a.offsetTop : 0)) / o, f = i.width / n, _ = i.height / o;
  return {
    width: f,
    height: _,
    top: u,
    right: p + f,
    bottom: u + _,
    left: p,
    x: p,
    y: u
  };
}
function To(s) {
  var t = je(s), e = s.offsetWidth, i = s.offsetHeight;
  return Math.abs(t.width - e) <= 1 && (e = t.width), Math.abs(t.height - i) <= 1 && (i = t.height), {
    x: s.offsetLeft,
    y: s.offsetTop,
    width: e,
    height: i
  };
}
function yl(s, t) {
  var e = t.getRootNode && t.getRootNode();
  if (s.contains(t))
    return !0;
  if (e && bo(e)) {
    var i = t;
    do {
      if (i && s.isSameNode(i))
        return !0;
      i = i.parentNode || i.host;
    } while (i);
  }
  return !1;
}
function Tt(s) {
  return ut(s).getComputedStyle(s);
}
function eh(s) {
  return ["table", "td", "th"].indexOf(Nt(s)) >= 0;
}
function te(s) {
  return ((Te(s) ? s.ownerDocument : (
    // $FlowFixMe[prop-missing]
    s.document
  )) || window.document).documentElement;
}
function Hs(s) {
  return Nt(s) === "html" ? s : (
    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    s.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    s.parentNode || // DOM Element detected
    (bo(s) ? s.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    te(s)
  );
}
function Ko(s) {
  return !ct(s) || // https://github.com/popperjs/popper-core/issues/837
  Tt(s).position === "fixed" ? null : s.offsetParent;
}
function ih(s) {
  var t = /firefox/i.test(eo()), e = /Trident/i.test(eo());
  if (e && ct(s)) {
    var i = Tt(s);
    if (i.position === "fixed")
      return null;
  }
  var n = Hs(s);
  for (bo(n) && (n = n.host); ct(n) && ["html", "body"].indexOf(Nt(n)) < 0; ) {
    var o = Tt(n);
    if (o.transform !== "none" || o.perspective !== "none" || o.contain === "paint" || ["transform", "perspective"].indexOf(o.willChange) !== -1 || t && o.willChange === "filter" || t && o.filter && o.filter !== "none")
      return n;
    n = n.parentNode;
  }
  return null;
}
function Di(s) {
  for (var t = ut(s), e = Ko(s); e && eh(e) && Tt(e).position === "static"; )
    e = Ko(e);
  return e && (Nt(e) === "html" || Nt(e) === "body" && Tt(e).position === "static") ? t : e || ih(s) || t;
}
function Eo(s) {
  return ["top", "bottom"].indexOf(s) >= 0 ? "x" : "y";
}
function Ei(s, t, e) {
  return ge(s, Rs(t, e));
}
function sh(s, t, e) {
  var i = Ei(s, t, e);
  return i > e ? e : i;
}
function wl() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function xl(s) {
  return Object.assign({}, wl(), s);
}
function kl(s, t) {
  return t.reduce(function(e, i) {
    return e[i] = s, e;
  }, {});
}
var nh = function(t, e) {
  return t = typeof t == "function" ? t(Object.assign({}, e.rects, {
    placement: e.placement
  })) : t, xl(typeof t != "number" ? t : kl(t, qe));
};
function oh(s) {
  var t, e = s.state, i = s.name, n = s.options, o = e.elements.arrow, r = e.modifiersData.popperOffsets, a = vt(e.placement), l = Eo(a), p = [J, dt].indexOf(a) >= 0, u = p ? "height" : "width";
  if (!(!o || !r)) {
    var f = nh(n.padding, e), _ = To(o), m = l === "y" ? Q : J, g = l === "y" ? ht : dt, v = e.rects.reference[u] + e.rects.reference[l] - r[l] - e.rects.popper[u], b = r[l] - e.rects.reference[l], C = Di(o), y = C ? l === "y" ? C.clientHeight || 0 : C.clientWidth || 0 : 0, E = v / 2 - b / 2, T = f[m], A = y - _[u] - f[g], w = y / 2 - _[u] / 2 + E, S = Ei(T, w, A), k = l;
    e.modifiersData[i] = (t = {}, t[k] = S, t.centerOffset = S - w, t);
  }
}
function rh(s) {
  var t = s.state, e = s.options, i = e.element, n = i === void 0 ? "[data-popper-arrow]" : i;
  if (n != null && !(typeof n == "string" && (n = t.elements.popper.querySelector(n), !n))) {
    if ({}.NODE_ENV !== "production" && (ct(n) || console.error(['Popper: "arrow" element must be an HTMLElement (not an SVGElement).', "To use an SVG arrow, wrap it in an HTMLElement that will be used as", "the arrow."].join(" "))), !yl(t.elements.popper, n)) {
      ({}).NODE_ENV !== "production" && console.error(['Popper: "arrow" modifier\'s `element` must be a child of the popper', "element."].join(" "));
      return;
    }
    t.elements.arrow = n;
  }
}
const Ol = {
  name: "arrow",
  enabled: !0,
  phase: "main",
  fn: oh,
  effect: rh,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
function Ke(s) {
  return s.split("-")[1];
}
var ah = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function lh(s, t) {
  var e = s.x, i = s.y, n = t.devicePixelRatio || 1;
  return {
    x: Ye(e * n) / n || 0,
    y: Ye(i * n) / n || 0
  };
}
function zo(s) {
  var t, e = s.popper, i = s.popperRect, n = s.placement, o = s.variation, r = s.offsets, a = s.position, l = s.gpuAcceleration, p = s.adaptive, u = s.roundOffsets, f = s.isFixed, _ = r.x, m = _ === void 0 ? 0 : _, g = r.y, v = g === void 0 ? 0 : g, b = typeof u == "function" ? u({
    x: m,
    y: v
  }) : {
    x: m,
    y: v
  };
  m = b.x, v = b.y;
  var C = r.hasOwnProperty("x"), y = r.hasOwnProperty("y"), E = J, T = Q, A = window;
  if (p) {
    var w = Di(e), S = "clientHeight", k = "clientWidth";
    if (w === ut(e) && (w = te(e), Tt(w).position !== "static" && a === "absolute" && (S = "scrollHeight", k = "scrollWidth")), w = w, n === Q || (n === J || n === dt) && o === Fe) {
      T = ht;
      var x = f && w === A && A.visualViewport ? A.visualViewport.height : (
        // $FlowFixMe[prop-missing]
        w[S]
      );
      v -= x - i.height, v *= l ? 1 : -1;
    }
    if (n === J || (n === Q || n === ht) && o === Fe) {
      E = dt;
      var $ = f && w === A && A.visualViewport ? A.visualViewport.width : (
        // $FlowFixMe[prop-missing]
        w[k]
      );
      m -= $ - i.width, m *= l ? 1 : -1;
    }
  }
  var O = Object.assign({
    position: a
  }, p && ah), M = u === !0 ? lh({
    x: m,
    y: v
  }, ut(e)) : {
    x: m,
    y: v
  };
  if (m = M.x, v = M.y, l) {
    var P;
    return Object.assign({}, O, (P = {}, P[T] = y ? "0" : "", P[E] = C ? "0" : "", P.transform = (A.devicePixelRatio || 1) <= 1 ? "translate(" + m + "px, " + v + "px)" : "translate3d(" + m + "px, " + v + "px, 0)", P));
  }
  return Object.assign({}, O, (t = {}, t[T] = y ? v + "px" : "", t[E] = C ? m + "px" : "", t.transform = "", t));
}
function ch(s) {
  var t = s.state, e = s.options, i = e.gpuAcceleration, n = i === void 0 ? !0 : i, o = e.adaptive, r = o === void 0 ? !0 : o, a = e.roundOffsets, l = a === void 0 ? !0 : a;
  if ({}.NODE_ENV !== "production") {
    var p = Tt(t.elements.popper).transitionProperty || "";
    r && ["transform", "top", "right", "bottom", "left"].some(function(f) {
      return p.indexOf(f) >= 0;
    }) && console.warn(["Popper: Detected CSS transitions on at least one of the following", 'CSS properties: "transform", "top", "right", "bottom", "left".', `

`, 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', "for smooth transitions, or remove these properties from the CSS", "transition declaration on the popper element if only transitioning", "opacity or background-color for example.", `

`, "We recommend using the popper element as a wrapper around an inner", "element that can have any CSS property transitioned for animations."].join(" "));
  }
  var u = {
    placement: vt(t.placement),
    variation: Ke(t.placement),
    popper: t.elements.popper,
    popperRect: t.rects.popper,
    gpuAcceleration: n,
    isFixed: t.options.strategy === "fixed"
  };
  t.modifiersData.popperOffsets != null && (t.styles.popper = Object.assign({}, t.styles.popper, zo(Object.assign({}, u, {
    offsets: t.modifiersData.popperOffsets,
    position: t.options.strategy,
    adaptive: r,
    roundOffsets: l
  })))), t.modifiersData.arrow != null && (t.styles.arrow = Object.assign({}, t.styles.arrow, zo(Object.assign({}, u, {
    offsets: t.modifiersData.arrow,
    position: "absolute",
    adaptive: !1,
    roundOffsets: l
  })))), t.attributes.popper = Object.assign({}, t.attributes.popper, {
    "data-popper-placement": t.placement
  });
}
const Co = {
  name: "computeStyles",
  enabled: !0,
  phase: "beforeWrite",
  fn: ch,
  data: {}
};
var ji = {
  passive: !0
};
function hh(s) {
  var t = s.state, e = s.instance, i = s.options, n = i.scroll, o = n === void 0 ? !0 : n, r = i.resize, a = r === void 0 ? !0 : r, l = ut(t.elements.popper), p = [].concat(t.scrollParents.reference, t.scrollParents.popper);
  return o && p.forEach(function(u) {
    u.addEventListener("scroll", e.update, ji);
  }), a && l.addEventListener("resize", e.update, ji), function() {
    o && p.forEach(function(u) {
      u.removeEventListener("scroll", e.update, ji);
    }), a && l.removeEventListener("resize", e.update, ji);
  };
}
const Ao = {
  name: "eventListeners",
  enabled: !0,
  phase: "write",
  fn: function() {
  },
  effect: hh,
  data: {}
};
var dh = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function bs(s) {
  return s.replace(/left|right|bottom|top/g, function(t) {
    return dh[t];
  });
}
var uh = {
  start: "end",
  end: "start"
};
function Uo(s) {
  return s.replace(/start|end/g, function(t) {
    return uh[t];
  });
}
function yo(s) {
  var t = ut(s), e = t.pageXOffset, i = t.pageYOffset;
  return {
    scrollLeft: e,
    scrollTop: i
  };
}
function wo(s) {
  return je(te(s)).left + yo(s).scrollLeft;
}
function ph(s, t) {
  var e = ut(s), i = te(s), n = e.visualViewport, o = i.clientWidth, r = i.clientHeight, a = 0, l = 0;
  if (n) {
    o = n.width, r = n.height;
    var p = Al();
    (p || !p && t === "fixed") && (a = n.offsetLeft, l = n.offsetTop);
  }
  return {
    width: o,
    height: r,
    x: a + wo(s),
    y: l
  };
}
function _h(s) {
  var t, e = te(s), i = yo(s), n = (t = s.ownerDocument) == null ? void 0 : t.body, o = ge(e.scrollWidth, e.clientWidth, n ? n.scrollWidth : 0, n ? n.clientWidth : 0), r = ge(e.scrollHeight, e.clientHeight, n ? n.scrollHeight : 0, n ? n.clientHeight : 0), a = -i.scrollLeft + wo(s), l = -i.scrollTop;
  return Tt(n || e).direction === "rtl" && (a += ge(e.clientWidth, n ? n.clientWidth : 0) - o), {
    width: o,
    height: r,
    x: a,
    y: l
  };
}
function xo(s) {
  var t = Tt(s), e = t.overflow, i = t.overflowX, n = t.overflowY;
  return /auto|scroll|overlay|hidden/.test(e + n + i);
}
function Sl(s) {
  return ["html", "body", "#document"].indexOf(Nt(s)) >= 0 ? s.ownerDocument.body : ct(s) && xo(s) ? s : Sl(Hs(s));
}
function Ci(s, t) {
  var e;
  t === void 0 && (t = []);
  var i = Sl(s), n = i === ((e = s.ownerDocument) == null ? void 0 : e.body), o = ut(i), r = n ? [o].concat(o.visualViewport || [], xo(i) ? i : []) : i, a = t.concat(r);
  return n ? a : (
    // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    a.concat(Ci(Hs(r)))
  );
}
function io(s) {
  return Object.assign({}, s, {
    left: s.x,
    top: s.y,
    right: s.x + s.width,
    bottom: s.y + s.height
  });
}
function fh(s, t) {
  var e = je(s, !1, t === "fixed");
  return e.top = e.top + s.clientTop, e.left = e.left + s.clientLeft, e.bottom = e.top + s.clientHeight, e.right = e.left + s.clientWidth, e.width = s.clientWidth, e.height = s.clientHeight, e.x = e.left, e.y = e.top, e;
}
function Xo(s, t, e) {
  return t === mo ? io(ph(s, e)) : Te(t) ? fh(t, e) : io(_h(te(s)));
}
function mh(s) {
  var t = Ci(Hs(s)), e = ["absolute", "fixed"].indexOf(Tt(s).position) >= 0, i = e && ct(s) ? Di(s) : s;
  return Te(i) ? t.filter(function(n) {
    return Te(n) && yl(n, i) && Nt(n) !== "body";
  }) : [];
}
function gh(s, t, e, i) {
  var n = t === "clippingParents" ? mh(s) : [].concat(t), o = [].concat(n, [e]), r = o[0], a = o.reduce(function(l, p) {
    var u = Xo(s, p, i);
    return l.top = ge(u.top, l.top), l.right = Rs(u.right, l.right), l.bottom = Rs(u.bottom, l.bottom), l.left = ge(u.left, l.left), l;
  }, Xo(s, r, i));
  return a.width = a.right - a.left, a.height = a.bottom - a.top, a.x = a.left, a.y = a.top, a;
}
function Il(s) {
  var t = s.reference, e = s.element, i = s.placement, n = i ? vt(i) : null, o = i ? Ke(i) : null, r = t.x + t.width / 2 - e.width / 2, a = t.y + t.height / 2 - e.height / 2, l;
  switch (n) {
    case Q:
      l = {
        x: r,
        y: t.y - e.height
      };
      break;
    case ht:
      l = {
        x: r,
        y: t.y + t.height
      };
      break;
    case dt:
      l = {
        x: t.x + t.width,
        y: a
      };
      break;
    case J:
      l = {
        x: t.x - e.width,
        y: a
      };
      break;
    default:
      l = {
        x: t.x,
        y: t.y
      };
  }
  var p = n ? Eo(n) : null;
  if (p != null) {
    var u = p === "y" ? "height" : "width";
    switch (o) {
      case ve:
        l[p] = l[p] - (t[u] / 2 - e[u] / 2);
        break;
      case Fe:
        l[p] = l[p] + (t[u] / 2 - e[u] / 2);
        break;
    }
  }
  return l;
}
function ze(s, t) {
  t === void 0 && (t = {});
  var e = t, i = e.placement, n = i === void 0 ? s.placement : i, o = e.strategy, r = o === void 0 ? s.strategy : o, a = e.boundary, l = a === void 0 ? ul : a, p = e.rootBoundary, u = p === void 0 ? mo : p, f = e.elementContext, _ = f === void 0 ? Ie : f, m = e.altBoundary, g = m === void 0 ? !1 : m, v = e.padding, b = v === void 0 ? 0 : v, C = xl(typeof b != "number" ? b : kl(b, qe)), y = _ === Ie ? pl : Ie, E = s.rects.popper, T = s.elements[g ? y : _], A = gh(Te(T) ? T : T.contextElement || te(s.elements.popper), l, u, r), w = je(s.elements.reference), S = Il({
    reference: w,
    element: E,
    strategy: "absolute",
    placement: n
  }), k = io(Object.assign({}, E, S)), x = _ === Ie ? k : w, $ = {
    top: A.top - x.top + C.top,
    bottom: x.bottom - A.bottom + C.bottom,
    left: A.left - x.left + C.left,
    right: x.right - A.right + C.right
  }, O = s.modifiersData.offset;
  if (_ === Ie && O) {
    var M = O[n];
    Object.keys($).forEach(function(P) {
      var tt = [dt, ht].indexOf(P) >= 0 ? 1 : -1, et = [Q, ht].indexOf(P) >= 0 ? "y" : "x";
      $[P] += M[et] * tt;
    });
  }
  return $;
}
function bh(s, t) {
  t === void 0 && (t = {});
  var e = t, i = e.placement, n = e.boundary, o = e.rootBoundary, r = e.padding, a = e.flipVariations, l = e.allowedAutoPlacements, p = l === void 0 ? go : l, u = Ke(i), f = u ? a ? to : to.filter(function(g) {
    return Ke(g) === u;
  }) : qe, _ = f.filter(function(g) {
    return p.indexOf(g) >= 0;
  });
  _.length === 0 && (_ = f, {}.NODE_ENV !== "production" && console.error(["Popper: The `allowedAutoPlacements` option did not allow any", "placements. Ensure the `placement` option matches the variation", "of the allowed placements.", 'For example, "auto" cannot be used to allow "bottom-start".', 'Use "auto-start" instead.'].join(" ")));
  var m = _.reduce(function(g, v) {
    return g[v] = ze(s, {
      placement: v,
      boundary: n,
      rootBoundary: o,
      padding: r
    })[vt(v)], g;
  }, {});
  return Object.keys(m).sort(function(g, v) {
    return m[g] - m[v];
  });
}
function vh(s) {
  if (vt(s) === Ii)
    return [];
  var t = bs(s);
  return [Uo(s), t, Uo(t)];
}
function Th(s) {
  var t = s.state, e = s.options, i = s.name;
  if (!t.modifiersData[i]._skip) {
    for (var n = e.mainAxis, o = n === void 0 ? !0 : n, r = e.altAxis, a = r === void 0 ? !0 : r, l = e.fallbackPlacements, p = e.padding, u = e.boundary, f = e.rootBoundary, _ = e.altBoundary, m = e.flipVariations, g = m === void 0 ? !0 : m, v = e.allowedAutoPlacements, b = t.options.placement, C = vt(b), y = C === b, E = l || (y || !g ? [bs(b)] : vh(b)), T = [b].concat(E).reduce(function(Ae, Ht) {
      return Ae.concat(vt(Ht) === Ii ? bh(t, {
        placement: Ht,
        boundary: u,
        rootBoundary: f,
        padding: p,
        flipVariations: g,
        allowedAutoPlacements: v
      }) : Ht);
    }, []), A = t.rects.reference, w = t.rects.popper, S = /* @__PURE__ */ new Map(), k = !0, x = T[0], $ = 0; $ < T.length; $++) {
      var O = T[$], M = vt(O), P = Ke(O) === ve, tt = [Q, ht].indexOf(M) >= 0, et = tt ? "width" : "height", U = ze(t, {
        placement: O,
        boundary: u,
        rootBoundary: f,
        altBoundary: _,
        padding: p
      }), mt = tt ? P ? dt : J : P ? ht : Q;
      A[et] > w[et] && (mt = bs(mt));
      var Hi = bs(mt), ie = [];
      if (o && ie.push(U[M] <= 0), a && ie.push(U[mt] <= 0, U[Hi] <= 0), ie.every(function(Ae) {
        return Ae;
      })) {
        x = O, k = !1;
        break;
      }
      S.set(O, ie);
    }
    if (k)
      for (var Wi = g ? 3 : 1, Us = function(Ht) {
        var ii = T.find(function(Fi) {
          var se = S.get(Fi);
          if (se)
            return se.slice(0, Ht).every(function(Xs) {
              return Xs;
            });
        });
        if (ii)
          return x = ii, "break";
      }, ei = Wi; ei > 0; ei--) {
        var Vi = Us(ei);
        if (Vi === "break")
          break;
      }
    t.placement !== x && (t.modifiersData[i]._skip = !0, t.placement = x, t.reset = !0);
  }
}
const Dl = {
  name: "flip",
  enabled: !0,
  phase: "main",
  fn: Th,
  requiresIfExists: ["offset"],
  data: {
    _skip: !1
  }
};
function Go(s, t, e) {
  return e === void 0 && (e = {
    x: 0,
    y: 0
  }), {
    top: s.top - t.height - e.y,
    right: s.right - t.width + e.x,
    bottom: s.bottom - t.height + e.y,
    left: s.left - t.width - e.x
  };
}
function qo(s) {
  return [Q, dt, ht, J].some(function(t) {
    return s[t] >= 0;
  });
}
function Eh(s) {
  var t = s.state, e = s.name, i = t.rects.reference, n = t.rects.popper, o = t.modifiersData.preventOverflow, r = ze(t, {
    elementContext: "reference"
  }), a = ze(t, {
    altBoundary: !0
  }), l = Go(r, i), p = Go(a, n, o), u = qo(l), f = qo(p);
  t.modifiersData[e] = {
    referenceClippingOffsets: l,
    popperEscapeOffsets: p,
    isReferenceHidden: u,
    hasPopperEscaped: f
  }, t.attributes.popper = Object.assign({}, t.attributes.popper, {
    "data-popper-reference-hidden": u,
    "data-popper-escaped": f
  });
}
const $l = {
  name: "hide",
  enabled: !0,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: Eh
};
function Ch(s, t, e) {
  var i = vt(s), n = [J, Q].indexOf(i) >= 0 ? -1 : 1, o = typeof e == "function" ? e(Object.assign({}, t, {
    placement: s
  })) : e, r = o[0], a = o[1];
  return r = r || 0, a = (a || 0) * n, [J, dt].indexOf(i) >= 0 ? {
    x: a,
    y: r
  } : {
    x: r,
    y: a
  };
}
function Ah(s) {
  var t = s.state, e = s.options, i = s.name, n = e.offset, o = n === void 0 ? [0, 0] : n, r = go.reduce(function(u, f) {
    return u[f] = Ch(f, t.rects, o), u;
  }, {}), a = r[t.placement], l = a.x, p = a.y;
  t.modifiersData.popperOffsets != null && (t.modifiersData.popperOffsets.x += l, t.modifiersData.popperOffsets.y += p), t.modifiersData[i] = r;
}
const Ll = {
  name: "offset",
  enabled: !0,
  phase: "main",
  requires: ["popperOffsets"],
  fn: Ah
};
function yh(s) {
  var t = s.state, e = s.name;
  t.modifiersData[e] = Il({
    reference: t.rects.reference,
    element: t.rects.popper,
    strategy: "absolute",
    placement: t.placement
  });
}
const ko = {
  name: "popperOffsets",
  enabled: !0,
  phase: "read",
  fn: yh,
  data: {}
};
function wh(s) {
  return s === "x" ? "y" : "x";
}
function xh(s) {
  var t = s.state, e = s.options, i = s.name, n = e.mainAxis, o = n === void 0 ? !0 : n, r = e.altAxis, a = r === void 0 ? !1 : r, l = e.boundary, p = e.rootBoundary, u = e.altBoundary, f = e.padding, _ = e.tether, m = _ === void 0 ? !0 : _, g = e.tetherOffset, v = g === void 0 ? 0 : g, b = ze(t, {
    boundary: l,
    rootBoundary: p,
    padding: f,
    altBoundary: u
  }), C = vt(t.placement), y = Ke(t.placement), E = !y, T = Eo(C), A = wh(T), w = t.modifiersData.popperOffsets, S = t.rects.reference, k = t.rects.popper, x = typeof v == "function" ? v(Object.assign({}, t.rects, {
    placement: t.placement
  })) : v, $ = typeof x == "number" ? {
    mainAxis: x,
    altAxis: x
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, x), O = t.modifiersData.offset ? t.modifiersData.offset[t.placement] : null, M = {
    x: 0,
    y: 0
  };
  if (w) {
    if (o) {
      var P, tt = T === "y" ? Q : J, et = T === "y" ? ht : dt, U = T === "y" ? "height" : "width", mt = w[T], Hi = mt + b[tt], ie = mt - b[et], Wi = m ? -k[U] / 2 : 0, Us = y === ve ? S[U] : k[U], ei = y === ve ? -k[U] : -S[U], Vi = t.elements.arrow, Ae = m && Vi ? To(Vi) : {
        width: 0,
        height: 0
      }, Ht = t.modifiersData["arrow#persistent"] ? t.modifiersData["arrow#persistent"].padding : wl(), ii = Ht[tt], Fi = Ht[et], se = Ei(0, S[U], Ae[U]), Xs = E ? S[U] / 2 - Wi - se - ii - $.mainAxis : Us - se - ii - $.mainAxis, Sc = E ? -S[U] / 2 + Wi + se + Fi + $.mainAxis : ei + se + Fi + $.mainAxis, Gs = t.elements.arrow && Di(t.elements.arrow), Ic = Gs ? T === "y" ? Gs.clientTop || 0 : Gs.clientLeft || 0 : 0, Mo = (P = O == null ? void 0 : O[T]) != null ? P : 0, Dc = mt + Xs - Mo - Ic, $c = mt + Sc - Mo, No = Ei(m ? Rs(Hi, Dc) : Hi, mt, m ? ge(ie, $c) : ie);
      w[T] = No, M[T] = No - mt;
    }
    if (a) {
      var Ro, Lc = T === "x" ? Q : J, Mc = T === "x" ? ht : dt, ne = w[A], Yi = A === "y" ? "height" : "width", Po = ne + b[Lc], Bo = ne - b[Mc], qs = [Q, J].indexOf(C) !== -1, Ho = (Ro = O == null ? void 0 : O[A]) != null ? Ro : 0, Wo = qs ? Po : ne - S[Yi] - k[Yi] - Ho + $.altAxis, Vo = qs ? ne + S[Yi] + k[Yi] - Ho - $.altAxis : Bo, Fo = m && qs ? sh(Wo, ne, Vo) : Ei(m ? Wo : Po, ne, m ? Vo : Bo);
      w[A] = Fo, M[A] = Fo - ne;
    }
    t.modifiersData[i] = M;
  }
}
const Ml = {
  name: "preventOverflow",
  enabled: !0,
  phase: "main",
  fn: xh,
  requiresIfExists: ["offset"]
};
function kh(s) {
  return {
    scrollLeft: s.scrollLeft,
    scrollTop: s.scrollTop
  };
}
function Oh(s) {
  return s === ut(s) || !ct(s) ? yo(s) : kh(s);
}
function Sh(s) {
  var t = s.getBoundingClientRect(), e = Ye(t.width) / s.offsetWidth || 1, i = Ye(t.height) / s.offsetHeight || 1;
  return e !== 1 || i !== 1;
}
function Ih(s, t, e) {
  e === void 0 && (e = !1);
  var i = ct(t), n = ct(t) && Sh(t), o = te(t), r = je(s, n, e), a = {
    scrollLeft: 0,
    scrollTop: 0
  }, l = {
    x: 0,
    y: 0
  };
  return (i || !i && !e) && ((Nt(t) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
  xo(o)) && (a = Oh(t)), ct(t) ? (l = je(t, !0), l.x += t.clientLeft, l.y += t.clientTop) : o && (l.x = wo(o))), {
    x: r.left + a.scrollLeft - l.x,
    y: r.top + a.scrollTop - l.y,
    width: r.width,
    height: r.height
  };
}
function Dh(s) {
  var t = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Set(), i = [];
  s.forEach(function(o) {
    t.set(o.name, o);
  });
  function n(o) {
    e.add(o.name);
    var r = [].concat(o.requires || [], o.requiresIfExists || []);
    r.forEach(function(a) {
      if (!e.has(a)) {
        var l = t.get(a);
        l && n(l);
      }
    }), i.push(o);
  }
  return s.forEach(function(o) {
    e.has(o.name) || n(o);
  }), i;
}
function $h(s) {
  var t = Dh(s);
  return Ns.reduce(function(e, i) {
    return e.concat(t.filter(function(n) {
      return n.phase === i;
    }));
  }, []);
}
function Lh(s) {
  var t;
  return function() {
    return t || (t = new Promise(function(e) {
      Promise.resolve().then(function() {
        t = void 0, e(s());
      });
    })), t;
  };
}
function Wt(s) {
  for (var t = arguments.length, e = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    e[i - 1] = arguments[i];
  return [].concat(e).reduce(function(n, o) {
    return n.replace(/%s/, o);
  }, s);
}
var re = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s', Mh = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available', Zo = ["name", "enabled", "phase", "fn", "effect", "requires", "options"];
function Nh(s) {
  s.forEach(function(t) {
    [].concat(Object.keys(t), Zo).filter(function(e, i, n) {
      return n.indexOf(e) === i;
    }).forEach(function(e) {
      switch (e) {
        case "name":
          typeof t.name != "string" && console.error(Wt(re, String(t.name), '"name"', '"string"', '"' + String(t.name) + '"'));
          break;
        case "enabled":
          typeof t.enabled != "boolean" && console.error(Wt(re, t.name, '"enabled"', '"boolean"', '"' + String(t.enabled) + '"'));
          break;
        case "phase":
          Ns.indexOf(t.phase) < 0 && console.error(Wt(re, t.name, '"phase"', "either " + Ns.join(", "), '"' + String(t.phase) + '"'));
          break;
        case "fn":
          typeof t.fn != "function" && console.error(Wt(re, t.name, '"fn"', '"function"', '"' + String(t.fn) + '"'));
          break;
        case "effect":
          t.effect != null && typeof t.effect != "function" && console.error(Wt(re, t.name, '"effect"', '"function"', '"' + String(t.fn) + '"'));
          break;
        case "requires":
          t.requires != null && !Array.isArray(t.requires) && console.error(Wt(re, t.name, '"requires"', '"array"', '"' + String(t.requires) + '"'));
          break;
        case "requiresIfExists":
          Array.isArray(t.requiresIfExists) || console.error(Wt(re, t.name, '"requiresIfExists"', '"array"', '"' + String(t.requiresIfExists) + '"'));
          break;
        case "options":
        case "data":
          break;
        default:
          console.error('PopperJS: an invalid property has been provided to the "' + t.name + '" modifier, valid properties are ' + Zo.map(function(i) {
            return '"' + i + '"';
          }).join(", ") + '; but "' + e + '" was provided.');
      }
      t.requires && t.requires.forEach(function(i) {
        s.find(function(n) {
          return n.name === i;
        }) == null && console.error(Wt(Mh, String(t.name), i, i));
      });
    });
  });
}
function Rh(s, t) {
  var e = /* @__PURE__ */ new Set();
  return s.filter(function(i) {
    var n = t(i);
    if (!e.has(n))
      return e.add(n), !0;
  });
}
function Ph(s) {
  var t = s.reduce(function(e, i) {
    var n = e[i.name];
    return e[i.name] = n ? Object.assign({}, n, i, {
      options: Object.assign({}, n.options, i.options),
      data: Object.assign({}, n.data, i.data)
    }) : i, e;
  }, {});
  return Object.keys(t).map(function(e) {
    return t[e];
  });
}
var Qo = "Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.", Bh = "Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.", Jo = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function tr() {
  for (var s = arguments.length, t = new Array(s), e = 0; e < s; e++)
    t[e] = arguments[e];
  return !t.some(function(i) {
    return !(i && typeof i.getBoundingClientRect == "function");
  });
}
function Ws(s) {
  s === void 0 && (s = {});
  var t = s, e = t.defaultModifiers, i = e === void 0 ? [] : e, n = t.defaultOptions, o = n === void 0 ? Jo : n;
  return function(a, l, p) {
    p === void 0 && (p = o);
    var u = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, Jo, o),
      modifiersData: {},
      elements: {
        reference: a,
        popper: l
      },
      attributes: {},
      styles: {}
    }, f = [], _ = !1, m = {
      state: u,
      setOptions: function(C) {
        var y = typeof C == "function" ? C(u.options) : C;
        v(), u.options = Object.assign({}, o, u.options, y), u.scrollParents = {
          reference: Te(a) ? Ci(a) : a.contextElement ? Ci(a.contextElement) : [],
          popper: Ci(l)
        };
        var E = $h(Ph([].concat(i, u.options.modifiers)));
        if (u.orderedModifiers = E.filter(function(O) {
          return O.enabled;
        }), {}.NODE_ENV !== "production") {
          var T = Rh([].concat(E, u.options.modifiers), function(O) {
            var M = O.name;
            return M;
          });
          if (Nh(T), vt(u.options.placement) === Ii) {
            var A = u.orderedModifiers.find(function(O) {
              var M = O.name;
              return M === "flip";
            });
            A || console.error(['Popper: "auto" placements require the "flip" modifier be', "present and enabled to work."].join(" "));
          }
          var w = Tt(l), S = w.marginTop, k = w.marginRight, x = w.marginBottom, $ = w.marginLeft;
          [S, k, x, $].some(function(O) {
            return parseFloat(O);
          }) && console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', "between the popper and its reference element or boundary.", "To replicate margin, use the `offset` modifier, as well as", "the `padding` option in the `preventOverflow` and `flip`", "modifiers."].join(" "));
        }
        return g(), m.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function() {
        if (!_) {
          var C = u.elements, y = C.reference, E = C.popper;
          if (!tr(y, E)) {
            ({}).NODE_ENV !== "production" && console.error(Qo);
            return;
          }
          u.rects = {
            reference: Ih(y, Di(E), u.options.strategy === "fixed"),
            popper: To(E)
          }, u.reset = !1, u.placement = u.options.placement, u.orderedModifiers.forEach(function(O) {
            return u.modifiersData[O.name] = Object.assign({}, O.data);
          });
          for (var T = 0, A = 0; A < u.orderedModifiers.length; A++) {
            if ({}.NODE_ENV !== "production" && (T += 1, T > 100)) {
              console.error(Bh);
              break;
            }
            if (u.reset === !0) {
              u.reset = !1, A = -1;
              continue;
            }
            var w = u.orderedModifiers[A], S = w.fn, k = w.options, x = k === void 0 ? {} : k, $ = w.name;
            typeof S == "function" && (u = S({
              state: u,
              options: x,
              name: $,
              instance: m
            }) || u);
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: Lh(function() {
        return new Promise(function(b) {
          m.forceUpdate(), b(u);
        });
      }),
      destroy: function() {
        v(), _ = !0;
      }
    };
    if (!tr(a, l))
      return {}.NODE_ENV !== "production" && console.error(Qo), m;
    m.setOptions(p).then(function(b) {
      !_ && p.onFirstUpdate && p.onFirstUpdate(b);
    });
    function g() {
      u.orderedModifiers.forEach(function(b) {
        var C = b.name, y = b.options, E = y === void 0 ? {} : y, T = b.effect;
        if (typeof T == "function") {
          var A = T({
            state: u,
            name: C,
            instance: m,
            options: E
          }), w = function() {
          };
          f.push(A || w);
        }
      });
    }
    function v() {
      f.forEach(function(b) {
        return b();
      }), f = [];
    }
    return m;
  };
}
var Hh = /* @__PURE__ */ Ws(), Wh = [Ao, ko, Co, vo], Vh = /* @__PURE__ */ Ws({
  defaultModifiers: Wh
}), Fh = [Ao, ko, Co, vo, Ll, Dl, Ml, Ol, $l], Ee = /* @__PURE__ */ Ws({
  defaultModifiers: Fh
});
const Nl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  afterMain: vl,
  afterRead: ml,
  afterWrite: Cl,
  applyStyles: vo,
  arrow: Ol,
  auto: Ii,
  basePlacements: qe,
  beforeMain: gl,
  beforeRead: _l,
  beforeWrite: Tl,
  bottom: ht,
  clippingParents: ul,
  computeStyles: Co,
  createPopper: Ee,
  createPopperBase: Hh,
  createPopperLite: Vh,
  detectOverflow: ze,
  end: Fe,
  eventListeners: Ao,
  flip: Dl,
  hide: $l,
  left: J,
  main: bl,
  modifierPhases: Ns,
  offset: Ll,
  placements: go,
  popper: Ie,
  popperGenerator: Ws,
  popperOffsets: ko,
  preventOverflow: Ml,
  read: fl,
  reference: pl,
  right: dt,
  start: ve,
  top: Q,
  variationPlacements: to,
  viewport: mo,
  write: El
}, Symbol.toStringTag, { value: "Module" }));
function tn(s) {
  return s === "true" ? !0 : s === "false" ? !1 : s === Number(s).toString() ? Number(s) : s === "" || s === "null" ? null : s;
}
function en(s) {
  return s.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
const c = {
  setDataAttribute(s, t, e) {
    s.setAttribute(`data-te-${en(t)}`, e);
  },
  removeDataAttribute(s, t) {
    s.removeAttribute(`data-te-${en(t)}`);
  },
  getDataAttributes(s) {
    if (!s)
      return {};
    const t = {};
    return Object.keys(s.dataset).filter((e) => e.startsWith("te")).forEach((e) => {
      if (e.startsWith("teClass"))
        return;
      let i = e.replace(/^te/, "");
      i = i.charAt(0).toLowerCase() + i.slice(1, i.length), t[i] = tn(s.dataset[e]);
    }), t;
  },
  getDataClassAttributes(s) {
    if (!s)
      return {};
    const t = {
      ...s.dataset
    };
    return Object.keys(t).filter((e) => e.startsWith("teClass")).forEach((e) => {
      let i = e.replace(/^teClass/, "");
      i = i.charAt(0).toLowerCase() + i.slice(1, i.length), t[i] = tn(t[e]);
    }), t;
  },
  getDataAttribute(s, t) {
    return tn(
      s.getAttribute(`data-te-${en(t)}`)
    );
  },
  offset(s) {
    const t = s.getBoundingClientRect();
    return {
      top: t.top + document.body.scrollTop,
      left: t.left + document.body.scrollLeft
    };
  },
  position(s) {
    return {
      top: s.offsetTop,
      left: s.offsetLeft
    };
  },
  style(s, t) {
    Object.assign(s.style, t);
  },
  toggleClass(s, t) {
    s && sn(t).forEach((e) => {
      s.classList.contains(e) ? s.classList.remove(e) : s.classList.add(e);
    });
  },
  addClass(s, t) {
    sn(t).forEach(
      (e) => !s.classList.contains(e) && s.classList.add(e)
    );
  },
  addStyle(s, t) {
    Object.keys(t).forEach((e) => {
      s.style[e] = t[e];
    });
  },
  removeClass(s, t) {
    sn(t).forEach(
      (e) => s.classList.contains(e) && s.classList.remove(e)
    );
  },
  hasClass(s, t) {
    return s.classList.contains(t);
  },
  maxOffset(s) {
    const t = s.getBoundingClientRect();
    return {
      top: t.top + Math.max(
        document.body.scrollTop,
        document.documentElement.scrollTop,
        window.scrollY
      ),
      left: t.left + Math.max(
        document.body.scrollLeft,
        document.documentElement.scrollLeft,
        window.scrollX
      )
    };
  }
};
function sn(s) {
  return typeof s == "string" ? s.split(" ") : Array.isArray(s) ? s : !1;
}
const Yh = 3, d = {
  closest(s, t) {
    return s.closest(t);
  },
  matches(s, t) {
    return s.matches(t);
  },
  find(s, t = document.documentElement) {
    return [].concat(
      ...Element.prototype.querySelectorAll.call(t, s)
    );
  },
  findOne(s, t = document.documentElement) {
    return Element.prototype.querySelector.call(t, s);
  },
  children(s, t) {
    return [].concat(...s.children).filter((i) => i.matches(t));
  },
  parents(s, t) {
    const e = [];
    let i = s.parentNode;
    for (; i && i.nodeType === Node.ELEMENT_NODE && i.nodeType !== Yh; )
      this.matches(i, t) && e.push(i), i = i.parentNode;
    return e;
  },
  prev(s, t) {
    let e = s.previousElementSibling;
    for (; e; ) {
      if (e.matches(t))
        return [e];
      e = e.previousElementSibling;
    }
    return [];
  },
  next(s, t) {
    let e = s.nextElementSibling;
    for (; e; ) {
      if (this.matches(e, t))
        return [e];
      e = e.nextElementSibling;
    }
    return [];
  },
  focusableChildren(s) {
    const t = [
      "a",
      "button",
      "input",
      "textarea",
      "select",
      "details",
      "[tabindex]",
      '[contenteditable="true"]'
    ].map((e) => `${e}:not([tabindex^="-"])`).join(", ");
    return this.find(t, s).filter(
      (e) => !me(e) && Lt(e)
    );
  }
}, nn = "dropdown", jh = "te.dropdown", Ce = `.${jh}`, Oo = ".data-api", vs = "Escape", er = "Space", ir = "Tab", so = "ArrowUp", Ts = "ArrowDown", Kh = 2, zh = new RegExp(
  `${so}|${Ts}|${vs}`
), Uh = `hide${Ce}`, Xh = `hidden${Ce}`, Gh = `show${Ce}`, qh = `shown${Ce}`, Zh = `click${Ce}${Oo}`, sr = `keydown${Ce}${Oo}`, Qh = `keyup${Ce}${Oo}`, Vt = "show", Jh = "dropup", td = "dropend", ed = "dropstart", id = "[data-te-navbar-ref]", Ki = "[data-te-dropdown-toggle-ref]", on = "[data-te-dropdown-menu-ref]", sd = "[data-te-navbar-nav-ref]", nd = "[data-te-dropdown-menu-ref] [data-te-dropdown-item-ref]:not(.disabled):not(:disabled)", od = F() ? "top-end" : "top-start", rd = F() ? "top-start" : "top-end", ad = F() ? "bottom-end" : "bottom-start", ld = F() ? "bottom-start" : "bottom-end", cd = F() ? "left-start" : "right-start", hd = F() ? "right-start" : "left-start", dd = [{ opacity: "0" }, { opacity: "1" }], ud = [{ opacity: "1" }, { opacity: "0" }], zi = {
  duration: 550,
  iterations: 1,
  easing: "ease",
  fill: "both"
}, pd = {
  offset: [0, 2],
  boundary: "clippingParents",
  reference: "toggle",
  display: "dynamic",
  popperConfig: null,
  autoClose: !0,
  dropdownAnimation: "on"
}, _d = {
  offset: "(array|string|function)",
  boundary: "(string|element)",
  reference: "(string|element|object)",
  display: "string",
  popperConfig: "(null|object|function)",
  autoClose: "(boolean|string)",
  dropdownAnimation: "string"
};
class It extends Et {
  constructor(t, e) {
    super(t), this._popper = null, this._config = this._getConfig(e), this._menu = this._getMenuElement(), this._inNavbar = this._detectNavbar(), this._fadeOutAnimate = null;
    const i = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    this._animationCanPlay = this._config.dropdownAnimation === "on" && !i, this._didInit = !1, this._init();
  }
  // Getters
  static get Default() {
    return pd;
  }
  static get DefaultType() {
    return _d;
  }
  static get NAME() {
    return nn;
  }
  // Public
  toggle() {
    return this._isShown() ? this.hide() : this.show();
  }
  show() {
    if (me(this._element) || this._isShown(this._menu))
      return;
    const t = {
      relatedTarget: this._element
    };
    if (h.trigger(
      this._element,
      Gh,
      t
    ).defaultPrevented)
      return;
    const i = It.getParentFromElement(this._element);
    this._inNavbar ? c.setDataAttribute(this._menu, "popper", "none") : this._createPopper(i), "ontouchstart" in document.documentElement && !i.closest(sd) && [].concat(...document.body.children).forEach((n) => h.on(n, "mouseover", Ms)), this._element.focus(), this._element.setAttribute("aria-expanded", !0), this._menu.setAttribute(`data-te-dropdown-${Vt}`, ""), this._animationCanPlay && this._menu.animate(dd, zi), this._element.setAttribute(`data-te-dropdown-${Vt}`, ""), setTimeout(
      () => {
        h.trigger(this._element, qh, t);
      },
      this._animationCanPlay ? zi.duration : 0
    );
  }
  hide() {
    if (me(this._element) || !this._isShown(this._menu))
      return;
    const t = {
      relatedTarget: this._element
    };
    this._completeHide(t);
  }
  dispose() {
    this._popper && this._popper.destroy(), super.dispose();
  }
  update() {
    this._inNavbar = this._detectNavbar(), this._popper && this._popper.update();
  }
  // Private
  _init() {
    this._didInit || (h.on(
      document,
      sr,
      Ki,
      It.dataApiKeydownHandler
    ), h.on(
      document,
      sr,
      on,
      It.dataApiKeydownHandler
    ), h.on(document, Zh, It.clearMenus), h.on(document, Qh, It.clearMenus), this._didInit = !0);
  }
  _completeHide(t) {
    this._fadeOutAnimate && this._fadeOutAnimate.playState === "running" || h.trigger(
      this._element,
      Uh,
      t
    ).defaultPrevented || ("ontouchstart" in document.documentElement && [].concat(...document.body.children).forEach((i) => h.off(i, "mouseover", Ms)), this._animationCanPlay && (this._fadeOutAnimate = this._menu.animate(
      ud,
      zi
    )), setTimeout(
      () => {
        this._popper && this._popper.destroy(), this._menu.removeAttribute(`data-te-dropdown-${Vt}`), this._element.removeAttribute(`data-te-dropdown-${Vt}`), this._element.setAttribute("aria-expanded", "false"), c.removeDataAttribute(this._menu, "popper"), h.trigger(this._element, Xh, t);
      },
      this._animationCanPlay ? zi.duration : 0
    ));
  }
  _getConfig(t) {
    if (t = {
      ...this.constructor.Default,
      ...c.getDataAttributes(this._element),
      ...t
    }, L(nn, t, this.constructor.DefaultType), typeof t.reference == "object" && !Ve(t.reference) && typeof t.reference.getBoundingClientRect != "function")
      throw new TypeError(
        `${nn.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`
      );
    return t;
  }
  _createPopper(t) {
    if (typeof Nl > "u")
      throw new TypeError(
        "Bootstrap's dropdowns require Popper (https://popper.js.org)"
      );
    let e = this._element;
    this._config.reference === "parent" ? e = t : Ve(this._config.reference) ? e = Jt(this._config.reference) : typeof this._config.reference == "object" && (e = this._config.reference);
    const i = this._getPopperConfig(), n = i.modifiers.find(
      (o) => o.name === "applyStyles" && o.enabled === !1
    );
    this._popper = Ee(
      e,
      this._menu,
      i
    ), n && c.setDataAttribute(this._menu, "popper", "static");
  }
  _isShown(t = this._element) {
    return t.dataset[`teDropdown${Vt.charAt(0).toUpperCase() + Vt.slice(1)}`] === "";
  }
  _getMenuElement() {
    return d.next(this._element, on)[0];
  }
  _getPlacement() {
    const t = this._element.parentNode;
    if (t.dataset.teDropdownPosition === td)
      return cd;
    if (t.dataset.teDropdownPosition === ed)
      return hd;
    const e = getComputedStyle(this._menu).getPropertyValue("--te-position").trim() === "end";
    return t.dataset.teDropdownPosition === Jh ? e ? rd : od : e ? ld : ad;
  }
  _detectNavbar() {
    return this._element.closest(id) !== null;
  }
  _getOffset() {
    const { offset: t } = this._config;
    return typeof t == "string" ? t.split(",").map((e) => Number.parseInt(e, 10)) : typeof t == "function" ? (e) => t(e, this._element) : t;
  }
  _getPopperConfig() {
    const t = {
      placement: this._getPlacement(),
      modifiers: [
        {
          name: "preventOverflow",
          options: {
            boundary: this._config.boundary
          }
        },
        {
          name: "offset",
          options: {
            offset: this._getOffset()
          }
        }
      ]
    };
    return this._config.display === "static" && (t.modifiers = [
      {
        name: "applyStyles",
        enabled: !1
      }
    ]), {
      ...t,
      ...typeof this._config.popperConfig == "function" ? this._config.popperConfig(t) : this._config.popperConfig
    };
  }
  _selectMenuItem({ key: t, target: e }) {
    const i = d.find(
      nd,
      this._menu
    ).filter(Lt);
    i.length && nl(
      i,
      e,
      t === Ts,
      !i.includes(e)
    ).focus();
  }
  // Static
  static jQueryInterface(t) {
    return this.each(function() {
      const e = It.getOrCreateInstance(this, t);
      if (typeof t == "string") {
        if (typeof e[t] > "u")
          throw new TypeError(`No method named "${t}"`);
        e[t]();
      }
    });
  }
  static clearMenus(t) {
    if (t && (t.button === Kh || t.type === "keyup" && t.key !== ir))
      return;
    const e = d.find(Ki);
    for (let i = 0, n = e.length; i < n; i++) {
      const o = It.getInstance(e[i]);
      if (!o || o._config.autoClose === !1 || !o._isShown())
        continue;
      const r = {
        relatedTarget: o._element
      };
      if (t) {
        const a = t.composedPath(), l = a.includes(o._menu);
        if (a.includes(o._element) || o._config.autoClose === "inside" && !l || o._config.autoClose === "outside" && l || o._menu.contains(t.target) && (t.type === "keyup" && t.key === ir || /input|select|option|textarea|form/i.test(t.target.tagName)))
          continue;
        t.type === "click" && (r.clickEvent = t);
      }
      o._completeHide(r);
    }
  }
  static getParentFromElement(t) {
    return Qt(t) || t.parentNode;
  }
  static dataApiKeydownHandler(t) {
    if (/input|textarea/i.test(t.target.tagName) ? t.key === er || t.key !== vs && (t.key !== Ts && t.key !== so || t.target.closest(on)) : !zh.test(t.key))
      return;
    const e = this.dataset[`teDropdown${Vt.charAt(0).toUpperCase() + Vt.slice(1)}`] === "";
    if (!e && t.key === vs || (t.preventDefault(), t.stopPropagation(), me(this)))
      return;
    const i = this.matches(Ki) ? this : d.prev(this, Ki)[0], n = It.getOrCreateInstance(i);
    if (t.key === vs) {
      n.hide();
      return;
    }
    if (t.key === so || t.key === Ts) {
      e || n.show(), n._selectMenuItem(t);
      return;
    }
    (!e || t.key === er) && It.clearMenus();
  }
}
const rn = "collapse", Rl = "te.collapse", Vs = `.${Rl}`, nr = {
  toggle: !0,
  parent: null
}, fd = {
  toggle: "boolean",
  parent: "(null|element)"
}, md = `show${Vs}`, gd = `shown${Vs}`, bd = `hide${Vs}`, vd = `hidden${Vs}`, an = "data-te-collapse-show", or = "data-te-collapse-collapsed", Ui = "data-te-collapse-collapsing", Td = "data-te-collapse-horizontal", Le = "data-te-collapse-item", rr = `:scope [${Le}] [${Le}]`, Ed = "width", Cd = "height", Ad = "[data-te-collapse-item][data-te-collapse-show], [data-te-collapse-item][data-te-collapse-collapsing]", ar = "[data-te-collapse-init]", yd = {
  visible: "!visible",
  hidden: "hidden",
  baseTransition: "overflow-hidden duration-[350ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none",
  collapsing: "h-0 transition-[height] overflow-hidden duration-[350ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none",
  collapsingHorizontal: "w-0 h-auto transition-[width] overflow-hidden duration-[350ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none"
}, wd = {
  visible: "string",
  hidden: "string",
  baseTransition: "string",
  collapsing: "string",
  collapsingHorizontal: "string"
};
class qt extends Et {
  constructor(t, e, i) {
    super(t), this._isTransitioning = !1, this._config = this._getConfig(e), this._classes = this._getClasses(i), this._triggerArray = [];
    const n = d.find(ar);
    for (let o = 0, r = n.length; o < r; o++) {
      const a = n[o], l = fo(a), p = d.find(l).filter(
        (u) => u === this._element
      );
      l !== null && p.length && (this._selector = l, this._triggerArray.push(a));
    }
    this._initializeChildren(), this._config.parent || this._addAriaAndCollapsedClass(this._triggerArray, this._isShown()), this._config.toggle && this.toggle();
  }
  // Getters
  static get Default() {
    return nr;
  }
  static get NAME() {
    return rn;
  }
  // Public
  toggle() {
    this._isShown() ? this.hide() : this.show();
  }
  show() {
    if (this._isTransitioning || this._isShown())
      return;
    let t = [], e;
    if (this._config.parent) {
      const u = d.find(
        rr,
        this._config.parent
      );
      t = d.find(
        Ad,
        this._config.parent
      ).filter((f) => !u.includes(f));
    }
    const i = d.findOne(this._selector);
    if (t.length) {
      const u = t.find((f) => i !== f);
      if (e = u ? qt.getInstance(u) : null, e && e._isTransitioning)
        return;
    }
    if (h.trigger(this._element, md).defaultPrevented)
      return;
    t.forEach((u) => {
      i !== u && qt.getOrCreateInstance(u, { toggle: !1 }).hide(), e || I.setData(u, Rl, null);
    });
    const o = this._getDimension(), r = o === "height" ? this._classes.collapsing : this._classes.collapsingHorizontal;
    c.removeClass(this._element, this._classes.visible), c.removeClass(this._element, this._classes.hidden), c.addClass(this._element, r), this._element.removeAttribute(Le), this._element.setAttribute(Ui, ""), this._element.style[o] = 0, this._addAriaAndCollapsedClass(this._triggerArray, !0), this._isTransitioning = !0;
    const a = () => {
      this._isTransitioning = !1, c.removeClass(this._element, this._classes.hidden), c.removeClass(this._element, r), c.addClass(this._element, this._classes.visible), this._element.removeAttribute(Ui), this._element.setAttribute(Le, ""), this._element.setAttribute(an, ""), this._element.style[o] = "", h.trigger(this._element, gd);
    }, p = `scroll${o[0].toUpperCase() + o.slice(1)}`;
    this._queueCallback(a, this._element, !0), this._element.style[o] = `${this._element[p]}px`;
  }
  hide() {
    if (this._isTransitioning || !this._isShown() || h.trigger(this._element, bd).defaultPrevented)
      return;
    const e = this._getDimension(), i = e === "height" ? this._classes.collapsing : this._classes.collapsingHorizontal;
    this._element.style[e] = `${this._element.getBoundingClientRect()[e]}px`, Ge(this._element), c.addClass(this._element, i), c.removeClass(this._element, this._classes.visible), c.removeClass(this._element, this._classes.hidden), this._element.setAttribute(Ui, ""), this._element.removeAttribute(Le), this._element.removeAttribute(an);
    const n = this._triggerArray.length;
    for (let r = 0; r < n; r++) {
      const a = this._triggerArray[r], l = Qt(a);
      l && !this._isShown(l) && this._addAriaAndCollapsedClass([a], !1);
    }
    this._isTransitioning = !0;
    const o = () => {
      this._isTransitioning = !1, c.removeClass(this._element, i), c.addClass(this._element, this._classes.visible), c.addClass(this._element, this._classes.hidden), this._element.removeAttribute(Ui), this._element.setAttribute(Le, ""), h.trigger(this._element, vd);
    };
    this._element.style[e] = "", this._queueCallback(o, this._element, !0);
  }
  _isShown(t = this._element) {
    return t.hasAttribute(an);
  }
  // Private
  _getConfig(t) {
    return t = {
      ...nr,
      ...c.getDataAttributes(this._element),
      ...t
    }, t.toggle = !!t.toggle, t.parent = Jt(t.parent), L(rn, t, fd), t;
  }
  _getClasses(t) {
    const e = c.getDataClassAttributes(this._element);
    return t = {
      ...yd,
      ...e,
      ...t
    }, L(rn, t, wd), t;
  }
  _getDimension() {
    return this._element.hasAttribute(Td) ? Ed : Cd;
  }
  _initializeChildren() {
    if (!this._config.parent)
      return;
    const t = d.find(
      rr,
      this._config.parent
    );
    d.find(ar, this._config.parent).filter((e) => !t.includes(e)).forEach((e) => {
      const i = Qt(e);
      i && this._addAriaAndCollapsedClass([e], this._isShown(i));
    });
  }
  _addAriaAndCollapsedClass(t, e) {
    t.length && t.forEach((i) => {
      e ? i.removeAttribute(or) : i.setAttribute(`${or}`, ""), i.setAttribute("aria-expanded", e);
    });
  }
  // Static
  static jQueryInterface(t) {
    return this.each(function() {
      const e = {};
      typeof t == "string" && /show|hide/.test(t) && (e.toggle = !1);
      const i = qt.getOrCreateInstance(this, e);
      if (typeof t == "string") {
        if (typeof i[t] > "u")
          throw new TypeError(`No method named "${t}"`);
        i[t]();
      }
    });
  }
}
const lr = ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top", cr = ".sticky-top";
class ki {
  constructor() {
    this._element = document.body;
  }
  getWidth() {
    const t = document.documentElement.clientWidth;
    return Math.abs(window.innerWidth - t);
  }
  hide() {
    const t = this.getWidth();
    this._disableOverFlow(), this._setElementAttributes(
      this._element,
      "paddingRight",
      (e) => e + t
    ), this._setElementAttributes(
      lr,
      "paddingRight",
      (e) => e + t
    ), this._setElementAttributes(
      cr,
      "marginRight",
      (e) => e - t
    );
  }
  _disableOverFlow() {
    this._saveInitialAttribute(this._element, "overflow"), this._element.style.overflow = "hidden";
  }
  _setElementAttributes(t, e, i) {
    const n = this.getWidth(), o = (r) => {
      if (r !== this._element && window.innerWidth > r.clientWidth + n)
        return;
      this._saveInitialAttribute(r, e);
      const a = window.getComputedStyle(r)[e];
      r.style[e] = `${i(
        Number.parseFloat(a)
      )}px`;
    };
    this._applyManipulationCallback(t, o);
  }
  reset() {
    this._resetElementAttributes(this._element, "overflow"), this._resetElementAttributes(this._element, "paddingRight"), this._resetElementAttributes(lr, "paddingRight"), this._resetElementAttributes(cr, "marginRight");
  }
  _saveInitialAttribute(t, e) {
    const i = t.style[e];
    i && c.setDataAttribute(t, e, i);
  }
  _resetElementAttributes(t, e) {
    const i = (n) => {
      const o = c.getDataAttribute(n, e);
      typeof o > "u" ? n.style.removeProperty(e) : (c.removeDataAttribute(n, e), n.style[e] = o);
    };
    this._applyManipulationCallback(t, i);
  }
  _applyManipulationCallback(t, e) {
    Ve(t) ? e(t) : d.find(t, this._element).forEach(e);
  }
  isOverflowing() {
    return this.getWidth() > 0;
  }
}
const xd = {
  isVisible: !0,
  // if false, we use the backdrop helper without adding any element to the dom
  isAnimated: !1,
  rootElement: "body",
  // give the choice to place backdrop under different elements
  clickCallback: null,
  backdropClasses: null
}, kd = {
  isVisible: "boolean",
  isAnimated: "boolean",
  rootElement: "(element|string)",
  clickCallback: "(function|null)",
  backdropClasses: "(array|null)"
}, Pl = "backdrop", hr = `mousedown.te.${Pl}`;
class So {
  constructor(t) {
    this._config = this._getConfig(t), this._isAppended = !1, this._element = null;
  }
  show(t) {
    if (!this._config.isVisible) {
      fe(t);
      return;
    }
    this._append(), this._config.isAnimated && Ge(this._getElement());
    const e = this._config.backdropClasses || [
      "opacity-50",
      "transition-all",
      "duration-300",
      "ease-in-out",
      "fixed",
      "top-0",
      "left-0",
      "z-[1040]",
      "bg-black",
      "w-screen",
      "h-screen"
    ];
    c.removeClass(this._getElement(), "opacity-0"), c.addClass(this._getElement(), e), this._element.setAttribute("data-te-backdrop-show", ""), this._emulateAnimation(() => {
      fe(t);
    });
  }
  hide(t) {
    if (!this._config.isVisible) {
      fe(t);
      return;
    }
    this._element.removeAttribute("data-te-backdrop-show"), this._getElement().classList.add("opacity-0"), this._getElement().classList.remove("opacity-50"), this._emulateAnimation(() => {
      this.dispose(), fe(t);
    });
  }
  // Private
  _getElement() {
    if (!this._element) {
      const t = document.createElement("div");
      t.className = this._config.className, this._config.isAnimated && t.classList.add("opacity-50"), this._element = t;
    }
    return this._element;
  }
  _getConfig(t) {
    return t = {
      ...xd,
      ...typeof t == "object" ? t : {}
    }, t.rootElement = Jt(t.rootElement), L(Pl, t, kd), t;
  }
  _append() {
    this._isAppended || (this._config.rootElement.append(this._getElement()), h.on(this._getElement(), hr, () => {
      fe(this._config.clickCallback);
    }), this._isAppended = !0);
  }
  dispose() {
    this._isAppended && (h.off(this._element, hr), this._element.remove(), this._isAppended = !1);
  }
  _emulateAnimation(t) {
    sl(
      t,
      this._getElement(),
      this._config.isAnimated
    );
  }
}
class $i {
  constructor(t, e = {}, i) {
    this._element = t, this._toggler = i, this._event = e.event || "blur", this._condition = e.condition || (() => !0), this._selector = e.selector || 'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])', this._onlyVisible = e.onlyVisible || !1, this._focusableElements = [], this._firstElement = null, this._lastElement = null, this.handler = (n) => {
      this._condition(n) && !n.shiftKey && n.target === this._lastElement ? (n.preventDefault(), this._firstElement.focus()) : this._condition(n) && n.shiftKey && n.target === this._firstElement && (n.preventDefault(), this._lastElement.focus());
    };
  }
  trap() {
    this._setElements(), this._init(), this._setFocusTrap();
  }
  disable() {
    this._focusableElements.forEach((t) => {
      t.removeEventListener(this._event, this.handler);
    }), this._toggler && this._toggler.focus();
  }
  update() {
    this._setElements(), this._setFocusTrap();
  }
  _init() {
    const t = (e) => {
      !this._firstElement || e.key !== "Tab" || this._focusableElements.includes(e.target) || (e.preventDefault(), this._firstElement.focus(), window.removeEventListener("keydown", t));
    };
    window.addEventListener("keydown", t);
  }
  _filterVisible(t) {
    return t.filter((e) => {
      if (!Lt(e))
        return !1;
      const i = d.parents(e, "*");
      for (let n = 0; n < i.length; n++) {
        const o = window.getComputedStyle(i[n]);
        if (o && (o.display === "none" || o.visibility === "hidden"))
          return !1;
      }
      return !0;
    });
  }
  _setElements() {
    this._focusableElements = d.focusableChildren(this._element), this._onlyVisible && (this._focusableElements = this._filterVisible(this._focusableElements)), this._firstElement = this._focusableElements[0], this._lastElement = this._focusableElements[this._focusableElements.length - 1];
  }
  _setFocusTrap() {
    this._focusableElements.forEach((t, e) => {
      e === this._focusableElements.length - 1 || e === 0 ? t.addEventListener(this._event, this.handler) : t.removeEventListener(this._event, this.handler);
    });
  }
}
const dr = "offcanvas", Od = "te.offcanvas", Ze = `.${Od}`, Sd = ".data-api", Id = `load${Ze}${Sd}`, Dd = "Escape", ur = {
  backdrop: !0,
  keyboard: !0,
  scroll: !1
}, $d = {
  backdrop: "boolean",
  keyboard: "boolean",
  scroll: "boolean"
}, pr = "show", Ld = "[data-te-offcanvas-init][data-te-offcanvas-show]", Md = `show${Ze}`, Nd = `shown${Ze}`, Rd = `hide${Ze}`, Pd = `hidden${Ze}`, Bd = `keydown.dismiss${Ze}`;
class no extends Et {
  constructor(t, e) {
    super(t), this._config = this._getConfig(e), this._isShown = !1, this._backdrop = this._initializeBackDrop(), this._focustrap = this._initializeFocusTrap(), this._addEventListeners(), this._didInit = !1, this._init();
  }
  // Getters
  static get NAME() {
    return dr;
  }
  static get Default() {
    return ur;
  }
  // Public
  toggle(t) {
    return this._isShown ? this.hide() : this.show(t);
  }
  show(t) {
    if (this._isShown || h.trigger(this._element, Md, {
      relatedTarget: t
    }).defaultPrevented)
      return;
    this._isShown = !0, this._element.style.visibility = "visible", this._backdrop.show(), this._config.scroll || new ki().hide(), this._element.removeAttribute("aria-hidden"), this._element.setAttribute("aria-modal", !0), this._element.setAttribute("role", "dialog"), this._element.setAttribute(`data-te-offcanvas-${pr}`, "");
    const i = () => {
      this._config.scroll || this._focustrap.trap(), h.trigger(this._element, Nd, { relatedTarget: t });
    };
    this._queueCallback(i, this._element, !0);
  }
  hide() {
    if (!this._isShown || h.trigger(this._element, Rd).defaultPrevented)
      return;
    this._focustrap.disable(), this._element.blur(), this._isShown = !1, this._element.removeAttribute(`data-te-offcanvas-${pr}`), this._backdrop.hide();
    const e = () => {
      this._element.setAttribute("aria-hidden", !0), this._element.removeAttribute("aria-modal"), this._element.removeAttribute("role"), this._element.style.visibility = "hidden", this._config.scroll || new ki().reset(), h.trigger(this._element, Pd);
    };
    this._queueCallback(e, this._element, !0);
  }
  dispose() {
    this._backdrop.dispose(), this._focustrap.disable(), super.dispose();
  }
  // Private
  _init() {
    this._didInit || (h.on(
      window,
      Id,
      () => d.find(Ld).forEach(
        (t) => no.getOrCreateInstance(t).show()
      )
    ), this._didInit = !0);
  }
  _getConfig(t) {
    return t = {
      ...ur,
      ...c.getDataAttributes(this._element),
      ...typeof t == "object" ? t : {}
    }, L(dr, t, $d), t;
  }
  _initializeBackDrop() {
    return new So({
      isVisible: this._config.backdrop,
      isAnimated: !0,
      rootElement: this._element.parentNode,
      clickCallback: () => this.hide()
    });
  }
  _initializeFocusTrap() {
    return new $i(this._element, {
      event: "keydown",
      condition: (t) => t.key === "Tab"
    });
  }
  _addEventListeners() {
    h.on(this._element, Bd, (t) => {
      this._config.keyboard && t.key === Dd && this.hide();
    });
  }
  // Static
  static jQueryInterface(t) {
    return this.each(function() {
      const e = no.getOrCreateInstance(this, t);
      if (typeof t == "string") {
        if (e[t] === void 0 || t.startsWith("_") || t === "constructor")
          throw new TypeError(`No method named "${t}"`);
        e[t](this);
      }
    });
  }
}
const ln = "alert", Hd = "te.alert", Bl = `.${Hd}`, Wd = `close${Bl}`, Vd = `closed${Bl}`, si = "data-te-alert-show", Fd = {
  animation: "boolean",
  autohide: "boolean",
  delay: "number"
}, _r = {
  animation: !0,
  autohide: !0,
  delay: 1e3
}, Yd = {
  fadeIn: "animate-[fade-in_0.3s_both] p-[auto] motion-reduce:transition-none motion-reduce:animate-none",
  fadeOut: "animate-[fade-out_0.3s_both] p-[auto] motion-reduce:transition-none motion-reduce:animate-none"
}, jd = {
  fadeIn: "string",
  fadeOut: "string"
};
class Hl extends Et {
  constructor(t, e, i) {
    super(t), this._element = t, this._config = this._getConfig(e), this._classes = this._getClasses(i);
  }
  // Getters
  static get DefaultType() {
    return Fd;
  }
  static get Default() {
    return _r;
  }
  static get NAME() {
    return ln;
  }
  // Public
  close() {
    if (h.trigger(this._element, Wd).defaultPrevented)
      return;
    let e = 0;
    this._config.animation && (e = 300, c.addClass(this._element, this._classes.fadeOut)), this._element.removeAttribute(si), setTimeout(() => {
      this._queueCallback(
        () => this._destroyElement(),
        this._element,
        this._config.animation
      );
    }, e);
  }
  show() {
    if (this._element) {
      if (this._config.autohide && this._setupAutohide(), !this._element.hasAttribute(si) && (c.removeClass(this._element, "hidden"), c.addClass(this._element, "block"), Lt(this._element))) {
        const t = (e) => {
          c.removeClass(this._element, "hidden"), c.addClass(this._element, "block"), h.off(e.target, "animationend", t);
        };
        this._element.setAttribute(si, ""), h.on(this._element, "animationend", t);
      }
      this._config.animation && (c.removeClass(this._element, this._classes.fadeOut), c.addClass(this._element, this._classes.fadeIn));
    }
  }
  hide() {
    if (this._element && this._element.hasAttribute(si)) {
      this._element.removeAttribute(si);
      const t = (e) => {
        c.addClass(this._element, "hidden"), c.removeClass(this._element, "block"), this._timeout !== null && (clearTimeout(this._timeout), this._timeout = null), h.off(e.target, "animationend", t);
      };
      h.on(this._element, "animationend", t), c.removeClass(this._element, this._classes.fadeIn), c.addClass(this._element, this._classes.fadeOut);
    }
  }
  // Private
  _getConfig(t) {
    return t = {
      ..._r,
      ...c.getDataAttributes(this._element),
      ...typeof t == "object" && t ? t : {}
    }, L(ln, t, this.constructor.DefaultType), t;
  }
  _getClasses(t) {
    const e = c.getDataClassAttributes(this._element);
    return t = {
      ...Yd,
      ...e,
      ...t
    }, L(ln, t, jd), t;
  }
  _setupAutohide() {
    this._timeout = setTimeout(() => {
      this.hide();
    }, this._config.delay);
  }
  _destroyElement() {
    this._element.remove(), h.trigger(this._element, Vd), this.dispose();
  }
  // Static
  static jQueryInterface(t) {
    return this.each(function() {
      const e = Hl.getOrCreateInstance(this);
      if (typeof t == "string") {
        if (e[t] === void 0 || t.startsWith("_") || t === "constructor")
          throw new TypeError(`No method named "${t}"`);
        e[t](this);
      }
    });
  }
}
const cn = "carousel", Kd = "te.carousel", pt = `.${Kd}`, Wl = ".data-api", zd = "ArrowLeft", Ud = "ArrowRight", Xd = 500, Gd = 40, fr = {
  interval: 5e3,
  keyboard: !0,
  ride: !1,
  pause: "hover",
  wrap: !0,
  touch: !0
}, qd = {
  interval: "(number|boolean)",
  keyboard: "boolean",
  ride: "(boolean|string)",
  pause: "(string|boolean)",
  wrap: "boolean",
  touch: "boolean"
}, Zd = {
  pointer: "touch-pan-y",
  block: "!block",
  visible: "data-[te-carousel-fade]:opacity-100 data-[te-carousel-fade]:z-[1]",
  invisible: "data-[te-carousel-fade]:z-0 data-[te-carousel-fade]:opacity-0 data-[te-carousel-fade]:duration-[600ms] data-[te-carousel-fade]:delay-600",
  slideRight: "translate-x-full",
  slideLeft: "-translate-x-full"
}, Qd = {
  pointer: "string",
  block: "string",
  visible: "string",
  invisible: "string",
  slideRight: "string",
  slideLeft: "string"
}, ae = "next", le = "prev", pe = "left", ui = "right", Jd = {
  [zd]: ui,
  [Ud]: pe
}, tu = `slide${pt}`, hn = `slid${pt}`, eu = `keydown${pt}`, iu = `mouseenter${pt}`, su = `mouseleave${pt}`, nu = `touchstart${pt}`, ou = `touchmove${pt}`, ru = `touchend${pt}`, au = `pointerdown${pt}`, lu = `pointerup${pt}`, cu = `dragstart${pt}`, hu = `load${pt}${Wl}`, du = `click${pt}${Wl}`, mr = "data-te-carousel-init", ce = "data-te-carousel-active", uu = "data-te-carousel-item-end", dn = "data-te-carousel-item-start", pu = "data-te-carousel-item-next", _u = "data-te-carousel-item-prev", fu = "data-te-carousel-pointer-event", mu = "[data-te-carousel-init]", Vl = "[data-te-carousel-active]", Io = "[data-te-carousel-item]", ye = `${Vl}${Io}`, gu = `${Io} img`, bu = "[data-te-carousel-item-next], [data-te-carousel-item-prev]", vu = "[data-te-carousel-indicators]", Tu = "[data-te-target]", Eu = "[data-te-slide], [data-te-slide-to]", Cu = "touch", Au = "pen";
class Ut extends Et {
  constructor(t, e, i) {
    super(t), this._items = null, this._interval = null, this._activeElement = null, this._isPaused = !1, this._isSliding = !1, this.touchTimeout = null, this.touchStartX = 0, this.touchDeltaX = 0, this._config = this._getConfig(e), this._classes = this._getClasses(i), this._indicatorsElement = d.findOne(
      vu,
      this._element
    ), this._touchSupported = "ontouchstart" in document.documentElement || navigator.maxTouchPoints > 0, this._pointerEvent = !!window.PointerEvent, this._setActiveElementClass(), this._addEventListeners(), this._didInit = !1, this._init(), this._config.ride === "carousel" && this.cycle();
  }
  // Getters
  static get Default() {
    return fr;
  }
  static get NAME() {
    return cn;
  }
  // Public
  next() {
    this._slide(ae);
  }
  nextWhenVisible() {
    !document.hidden && Lt(this._element) && this.next();
  }
  prev() {
    this._slide(le);
  }
  pause(t) {
    t || (this._isPaused = !0), d.findOne(bu, this._element) && (Ja(this._element), this.cycle(!0)), clearInterval(this._interval), this._interval = null;
  }
  cycle(t) {
    t || (this._isPaused = !1), this._interval && (clearInterval(this._interval), this._interval = null), this._config && this._config.interval && !this._isPaused && (this._updateInterval(), this._interval = setInterval(
      (document.visibilityState ? this.nextWhenVisible : this.next).bind(
        this
      ),
      this._config.interval
    ));
  }
  to(t) {
    this._activeElement = d.findOne(
      ye,
      this._element
    );
    const e = this._getItemIndex(this._activeElement);
    if (t > this._items.length - 1 || t < 0)
      return;
    if (this._isSliding) {
      h.one(this._element, hn, () => this.to(t));
      return;
    }
    if (e === t) {
      this.pause(), this.cycle();
      return;
    }
    const i = t > e ? ae : le;
    this._slide(i, this._items[t]);
  }
  // Private
  _init() {
    this._didInit || (h.on(
      document,
      du,
      Eu,
      Ut.dataApiClickHandler
    ), h.on(window, hu, () => {
      const t = d.find(mu);
      for (let e = 0, i = t.length; e < i; e++)
        Ut.carouselInterface(
          t[e],
          Ut.getInstance(t[e])
        );
    }), this._didInit = !0);
  }
  _getConfig(t) {
    return t = {
      ...fr,
      ...c.getDataAttributes(this._element),
      ...typeof t == "object" ? t : {}
    }, L(cn, t, qd), t;
  }
  _getClasses(t) {
    const e = c.getDataClassAttributes(this._element);
    return t = {
      ...Zd,
      ...e,
      ...t
    }, L(cn, t, Qd), t;
  }
  _enableCycle() {
    if (this._config.ride) {
      if (this._isSliding) {
        h.one(this._element, hn, () => this.cycle());
        return;
      }
      this.cycle();
    }
  }
  _applyInitialClasses() {
    const t = d.findOne(
      ye,
      this._element
    );
    t.classList.add(
      this._classes.block,
      ...this._classes.visible.split(" ")
    ), this._setActiveIndicatorElement(t);
  }
  _handleSwipe() {
    const t = Math.abs(this.touchDeltaX);
    if (t <= Gd)
      return;
    const e = t / this.touchDeltaX;
    this.touchDeltaX = 0, e && this._slide(e > 0 ? ui : pe);
  }
  _setActiveElementClass() {
    this._activeElement = d.findOne(
      ye,
      this._element
    ), c.addClass(this._activeElement, "hidden");
  }
  _addEventListeners() {
    this._config.keyboard && h.on(
      this._element,
      eu,
      (t) => this._keydown(t)
    ), this._config.pause === "hover" && (h.on(
      this._element,
      iu,
      (t) => this.pause(t)
    ), h.on(
      this._element,
      su,
      (t) => this._enableCycle(t)
    )), this._config.touch && this._touchSupported && this._addTouchEventListeners(), this._applyInitialClasses();
  }
  _addTouchEventListeners() {
    const t = (o) => this._pointerEvent && (o.pointerType === Au || o.pointerType === Cu), e = (o) => {
      t(o) ? this.touchStartX = o.clientX : this._pointerEvent || (this.touchStartX = o.touches[0].clientX);
    }, i = (o) => {
      this.touchDeltaX = o.touches && o.touches.length > 1 ? 0 : o.touches[0].clientX - this.touchStartX;
    }, n = (o) => {
      t(o) && (this.touchDeltaX = o.clientX - this.touchStartX), this._handleSwipe(), this._config.pause === "hover" && (this.pause(), this.touchTimeout && clearTimeout(this.touchTimeout), this.touchTimeout = setTimeout(
        (r) => this._enableCycle(r),
        Xd + this._config.interval
      ));
    };
    d.find(gu, this._element).forEach(
      (o) => {
        h.on(
          o,
          cu,
          (r) => r.preventDefault()
        );
      }
    ), this._pointerEvent ? (h.on(
      this._element,
      au,
      (o) => e(o)
    ), h.on(this._element, lu, (o) => n(o)), this._element.classList.add(this._classes.pointer), this._element.setAttribute(`${fu}`, "")) : (h.on(this._element, nu, (o) => e(o)), h.on(this._element, ou, (o) => i(o)), h.on(this._element, ru, (o) => n(o)));
  }
  _keydown(t) {
    if (/input|textarea/i.test(t.target.tagName))
      return;
    const e = Jd[t.key];
    e && (t.preventDefault(), this._slide(e));
  }
  _getItemIndex(t) {
    return this._items = t && t.parentNode ? d.find(Io, t.parentNode) : [], this._items.indexOf(t);
  }
  _getItemByOrder(t, e) {
    const i = t === ae;
    return nl(
      this._items,
      e,
      i,
      this._config.wrap
    );
  }
  _triggerSlideEvent(t, e) {
    const i = this._getItemIndex(t), n = this._getItemIndex(
      d.findOne(ye, this._element)
    );
    return h.trigger(this._element, tu, {
      relatedTarget: t,
      direction: e,
      from: n,
      to: i
    });
  }
  _setActiveIndicatorElement(t) {
    if (this._indicatorsElement) {
      const e = d.findOne(
        Vl,
        this._indicatorsElement
      );
      e.removeAttribute(ce), e.removeAttribute("aria-current"), e.classList.remove("!opacity-100");
      const i = d.find(
        Tu,
        this._indicatorsElement
      );
      for (let n = 0; n < i.length; n++)
        if (Number.parseInt(
          i[n].getAttribute("data-te-slide-to"),
          10
        ) === this._getItemIndex(t)) {
          i[n].setAttribute(`${ce}`, ""), i[n].setAttribute("aria-current", "true"), i[n].classList.add("!opacity-100");
          break;
        }
    }
  }
  _updateInterval() {
    const t = this._activeElement || d.findOne(ye, this._element);
    if (!t)
      return;
    const e = Number.parseInt(
      t.getAttribute("data-te-interval"),
      10
    );
    e ? (this._config.defaultInterval = this._config.defaultInterval || this._config.interval, this._config.interval = e) : this._config.interval = this._config.defaultInterval || this._config.interval;
  }
  _slide(t, e) {
    const i = this._directionToOrder(t), n = d.findOne(
      ye,
      this._element
    ), o = this._getItemIndex(n), r = e || this._getItemByOrder(i, n), a = this._getItemIndex(r), l = !!this._interval, p = i === ae, u = p ? dn : uu, f = p ? pu : _u, _ = this._orderToDirection(i), m = u === dn ? this._classes.slideLeft : this._classes.slideRight, g = u !== dn ? this._classes.slideLeft : this._classes.slideRight;
    if (r && r.hasAttribute(ce)) {
      this._isSliding = !1;
      return;
    }
    if (this._isSliding || this._triggerSlideEvent(r, _).defaultPrevented || !n || !r)
      return;
    this._isSliding = !0, l && this.pause(), this._setActiveIndicatorElement(r), this._activeElement = r;
    const b = () => {
      h.trigger(this._element, hn, {
        relatedTarget: r,
        direction: _,
        from: o,
        to: a
      });
    };
    if (this._element.hasAttribute(mr)) {
      r.setAttribute(`${f}`, ""), r.classList.add(this._classes.block, g), Ge(r), n.setAttribute(`${u}`, ""), n.classList.add(
        m,
        ...this._classes.invisible.split(" ")
      ), n.classList.remove(...this._classes.visible.split(" ")), r.setAttribute(`${u}`, ""), r.classList.add(...this._classes.visible.split(" ")), r.classList.remove(
        this._classes.slideRight,
        this._classes.slideLeft
      );
      const C = () => {
        r.removeAttribute(u), r.removeAttribute(f), r.setAttribute(`${ce}`, ""), n.removeAttribute(ce), n.classList.remove(
          m,
          ...this._classes.invisible.split(" "),
          this._classes.block
        ), n.removeAttribute(f), n.removeAttribute(u), this._isSliding = !1, setTimeout(b, 0);
      };
      this._queueCallback(C, n, !0);
    } else
      n.removeAttribute(ce), n.classList.remove(this._classes.block), r.setAttribute(`${ce}`, ""), r.classList.add(this._classes.block), this._isSliding = !1, b();
    l && this.cycle();
  }
  _directionToOrder(t) {
    return [ui, pe].includes(t) ? F() ? t === pe ? le : ae : t === pe ? ae : le : t;
  }
  _orderToDirection(t) {
    return [ae, le].includes(t) ? F() ? t === le ? pe : ui : t === le ? ui : pe : t;
  }
  // Static
  static carouselInterface(t, e) {
    const i = Ut.getOrCreateInstance(t, e);
    let { _config: n } = i;
    typeof e == "object" && (n = {
      ...n,
      ...e
    });
    const o = typeof e == "string" ? e : e.slide;
    if (typeof e == "number") {
      i.to(e);
      return;
    }
    if (typeof o == "string") {
      if (typeof i[o] > "u")
        throw new TypeError(`No method named "${o}"`);
      i[o]();
    } else
      n.interval && n.ride === !0 && i.pause();
  }
  static jQueryInterface(t) {
    return this.each(function() {
      Ut.carouselInterface(this, t);
    });
  }
  static dataApiClickHandler(t) {
    const e = Qt(this);
    if (!e || !e.hasAttribute(mr))
      return;
    const i = {
      ...c.getDataAttributes(e),
      ...c.getDataAttributes(this)
    }, n = this.getAttribute("data-te-slide-to");
    n && (i.interval = !1), Ut.carouselInterface(e, i), n && Ut.getInstance(e).to(n), t.preventDefault();
  }
}
const un = "modal", yu = "te.modal", Ct = `.${yu}`, gr = "Escape", br = {
  backdrop: !0,
  keyboard: !0,
  focus: !0
}, wu = {
  backdrop: "(boolean|string)",
  keyboard: "boolean",
  focus: "boolean"
}, xu = {
  show: "transform-none",
  static: "scale-[1.02]",
  staticProperties: "transition-scale duration-300 ease-in-out"
}, ku = {
  show: "string",
  static: "string",
  staticProperties: "string"
}, Ou = `hide${Ct}`, Su = `hidePrevented${Ct}`, Iu = `hidden${Ct}`, Du = `show${Ct}`, $u = `shown${Ct}`, vr = `resize${Ct}`, Tr = `click.dismiss${Ct}`, Er = `keydown.dismiss${Ct}`, Lu = `mouseup.dismiss${Ct}`, Cr = `mousedown.dismiss${Ct}`, Ar = "data-te-modal-open", yr = "data-te-open", ni = "[data-te-modal-dialog-ref]", Mu = "[data-te-modal-body-ref]";
class Fl extends Et {
  constructor(t, e, i) {
    super(t), this._config = this._getConfig(e), this._classes = this._getClasses(i), this._dialog = d.findOne(ni, this._element), this._backdrop = this._initializeBackDrop(), this._focustrap = this._initializeFocusTrap(), this._isShown = !1, this._ignoreBackdropClick = !1, this._isTransitioning = !1, this._scrollBar = new ki();
  }
  // Getters
  static get Default() {
    return br;
  }
  static get NAME() {
    return un;
  }
  // Public
  toggle(t) {
    return this._isShown ? this.hide() : this.show(t);
  }
  show(t) {
    this._isShown || this._isTransitioning || h.trigger(this._element, Du, {
      relatedTarget: t
    }).defaultPrevented || (this._isShown = !0, this._isAnimated() && (this._isTransitioning = !0), this._scrollBar.hide(), document.body.setAttribute(Ar, "true"), this._adjustDialog(), this._setEscapeEvent(), this._setResizeEvent(), h.on(this._dialog, Cr, () => {
      h.one(this._element, Lu, (i) => {
        i.target === this._element && (this._ignoreBackdropClick = !0);
      });
    }), this._showElement(t), this._showBackdrop());
  }
  hide() {
    if (!this._isShown || this._isTransitioning || h.trigger(this._element, Ou).defaultPrevented)
      return;
    this._isShown = !1;
    const e = this._isAnimated();
    e && (this._isTransitioning = !0), this._setEscapeEvent(), this._setResizeEvent(), this._focustrap.disable(), d.findOne(ni, this._element).classList.remove(this._classes.show), h.off(this._element, Tr), h.off(this._dialog, Cr), this._queueCallback(() => this._hideModal(), this._element, e), this._element.removeAttribute(yr);
  }
  dispose() {
    [window, this._dialog].forEach(
      (t) => h.off(t, Ct)
    ), this._backdrop.dispose(), this._focustrap.disable(), super.dispose();
  }
  handleUpdate() {
    this._adjustDialog();
  }
  // Private
  _initializeBackDrop() {
    return new So({
      isVisible: !!this._config.backdrop,
      // 'static' option will be translated to true, and booleans will keep their value
      isAnimated: this._isAnimated()
    });
  }
  _initializeFocusTrap() {
    return new $i(this._element, {
      event: "keydown",
      condition: (t) => t.key === "Tab"
    });
  }
  _getConfig(t) {
    return t = {
      ...br,
      ...c.getDataAttributes(this._element),
      ...typeof t == "object" ? t : {}
    }, L(un, t, wu), t;
  }
  _getClasses(t) {
    const e = c.getDataClassAttributes(this._element);
    return t = {
      ...xu,
      ...e,
      ...t
    }, L(un, t, ku), t;
  }
  _showElement(t) {
    const e = this._isAnimated(), i = d.findOne(Mu, this._dialog);
    (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) && document.body.append(this._element), this._element.style.display = "block", this._element.classList.remove("hidden"), this._element.removeAttribute("aria-hidden"), this._element.setAttribute("aria-modal", !0), this._element.setAttribute("role", "dialog"), this._element.setAttribute(`${yr}`, "true"), this._element.scrollTop = 0;
    const n = d.findOne(ni, this._element);
    n.classList.add(this._classes.show), n.classList.remove("opacity-0"), n.classList.add("opacity-100"), i && (i.scrollTop = 0), e && Ge(this._element);
    const o = () => {
      this._config.focus && this._focustrap.trap(), this._isTransitioning = !1, h.trigger(this._element, $u, {
        relatedTarget: t
      });
    };
    this._queueCallback(o, this._dialog, e);
  }
  _setEscapeEvent() {
    this._isShown ? h.on(document, Er, (t) => {
      this._config.keyboard && t.key === gr ? (t.preventDefault(), this.hide()) : !this._config.keyboard && t.key === gr && this._triggerBackdropTransition();
    }) : h.off(this._element, Er);
  }
  _setResizeEvent() {
    this._isShown ? h.on(window, vr, () => this._adjustDialog()) : h.off(window, vr);
  }
  _hideModal() {
    const t = d.findOne(ni, this._element);
    t.classList.remove(this._classes.show), t.classList.remove("opacity-100"), t.classList.add("opacity-0"), setTimeout(() => {
      this._element.style.display = "none";
    }, 300), this._element.setAttribute("aria-hidden", !0), this._element.removeAttribute("aria-modal"), this._element.removeAttribute("role"), this._isTransitioning = !1, this._backdrop.hide(() => {
      document.body.removeAttribute(Ar), this._resetAdjustments(), this._scrollBar.reset(), h.trigger(this._element, Iu);
    });
  }
  _showBackdrop(t) {
    h.on(this._element, Tr, (e) => {
      if (this._ignoreBackdropClick) {
        this._ignoreBackdropClick = !1;
        return;
      }
      e.target === e.currentTarget && (this._config.backdrop === !0 ? this.hide() : this._config.backdrop === "static" && this._triggerBackdropTransition());
    }), this._backdrop.show(t);
  }
  _isAnimated() {
    return !!d.findOne(ni, this._element);
  }
  _triggerBackdropTransition() {
    if (h.trigger(this._element, Su).defaultPrevented)
      return;
    const { classList: e, scrollHeight: i, style: n } = this._element, o = i > document.documentElement.clientHeight;
    !o && n.overflowY === "hidden" || e.contains(this._classes.static) || (o || (n.overflowY = "hidden"), e.add(...this._classes.static.split(" ")), e.add(...this._classes.staticProperties.split(" ")), this._queueCallback(() => {
      e.remove(this._classes.static), setTimeout(() => {
        e.remove(...this._classes.staticProperties.split(" "));
      }, 300), o || this._queueCallback(() => {
        n.overflowY = "";
      }, this._dialog);
    }, this._dialog), this._element.focus());
  }
  // ----------------------------------------------------------------------
  // the following methods are used to handle overflowing modals
  // ----------------------------------------------------------------------
  _adjustDialog() {
    const t = this._element.scrollHeight > document.documentElement.clientHeight, e = this._scrollBar.getWidth(), i = e > 0;
    (!i && t && !F() || i && !t && F()) && (this._element.style.paddingLeft = `${e}px`), (i && !t && !F() || !i && t && F()) && (this._element.style.paddingRight = `${e}px`);
  }
  _resetAdjustments() {
    this._element.style.paddingLeft = "", this._element.style.paddingRight = "";
  }
  // Static
  static jQueryInterface(t, e) {
    return this.each(function() {
      const i = Fl.getOrCreateInstance(this, t);
      if (typeof t == "string") {
        if (typeof i[t] > "u")
          throw new TypeError(`No method named "${t}"`);
        i[t](e);
      }
    });
  }
}
const Nu = /* @__PURE__ */ new Set([
  "background",
  "cite",
  "href",
  "itemtype",
  "longdesc",
  "poster",
  "src",
  "xlink:href"
]), Ru = /^aria-[\w-]*$/i, Pu = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^#&/:?]*(?:[#/?]|$))/i, Bu = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i, Hu = (s, t) => {
  const e = s.nodeName.toLowerCase();
  if (t.includes(e))
    return Nu.has(e) ? !!(Pu.test(s.nodeValue) || Bu.test(s.nodeValue)) : !0;
  const i = t.filter(
    (n) => n instanceof RegExp
  );
  for (let n = 0, o = i.length; n < o; n++)
    if (i[n].test(e))
      return !0;
  return !1;
}, Wu = {
  // Global attributes allowed on any supplied element below.
  "*": ["class", "dir", "id", "lang", "role", Ru],
  a: ["target", "href", "title", "rel"],
  area: [],
  b: [],
  br: [],
  col: [],
  code: [],
  div: [],
  em: [],
  hr: [],
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
  i: [],
  img: ["src", "srcset", "alt", "title", "width", "height"],
  li: [],
  ol: [],
  p: [],
  pre: [],
  s: [],
  small: [],
  span: [],
  sub: [],
  sup: [],
  strong: [],
  u: [],
  ul: []
};
function wr(s, t, e) {
  if (!s.length)
    return s;
  if (e && typeof e == "function")
    return e(s);
  const n = new window.DOMParser().parseFromString(s, "text/html"), o = [].concat(...n.body.querySelectorAll("*"));
  for (let r = 0, a = o.length; r < a; r++) {
    const l = o[r], p = l.nodeName.toLowerCase();
    if (!Object.keys(t).includes(p)) {
      l.remove();
      continue;
    }
    const u = [].concat(...l.attributes), f = [].concat(
      t["*"] || [],
      t[p] || []
    );
    u.forEach((_) => {
      Hu(_, f) || l.removeAttribute(_.nodeName);
    });
  }
  return n.body.innerHTML;
}
const xr = "tooltip", Vu = "te.tooltip", yt = `.${Vu}`, Fu = "te-tooltip", Yu = /* @__PURE__ */ new Set(["sanitize", "allowList", "sanitizeFn"]), ju = {
  animation: "boolean",
  template: "string",
  title: "(string|element|function)",
  trigger: "string",
  delay: "(number|object)",
  html: "boolean",
  selector: "(string|boolean)",
  placement: "(string|function)",
  offset: "(array|string|function)",
  container: "(string|element|boolean)",
  fallbackPlacements: "array",
  boundary: "(string|element)",
  customClass: "(string|function)",
  sanitize: "boolean",
  sanitizeFn: "(null|function)",
  allowList: "object",
  popperConfig: "(null|object|function)"
}, Ku = {
  AUTO: "auto",
  TOP: "top",
  RIGHT: F() ? "left" : "right",
  BOTTOM: "bottom",
  LEFT: F() ? "right" : "left"
}, zu = {
  animation: !0,
  template: '<div class="opacity-0 transition-opacity duration-300 ease-in-out absolute z-[1080] block m-0 text-sm not-italic font-normal text-left no-underline underline-offset-auto normal-case leading-6 tracking-normal break-normal whitespace-normal" role="tooltip"><div data-te-tooltip-inner-ref class="tooltip-inner max-w-[200px] text-sm py-1.5 px-4 text-white text-center bg-[#6d6d6d] rounded"></div></div>',
  trigger: "hover focus",
  title: "",
  delay: 0,
  html: !1,
  selector: !1,
  placement: "top",
  offset: [0, 0],
  container: !1,
  fallbackPlacements: ["top", "right", "bottom", "left"],
  boundary: "clippingParents",
  customClass: "",
  sanitize: !0,
  sanitizeFn: null,
  allowList: Wu,
  popperConfig: { hide: !0 }
}, Uu = {
  HIDE: `hide${yt}`,
  HIDDEN: `hidden${yt}`,
  SHOW: `show${yt}`,
  SHOWN: `shown${yt}`,
  INSERTED: `inserted${yt}`,
  CLICK: `click${yt}`,
  FOCUSIN: `focusin${yt}`,
  FOCUSOUT: `focusout${yt}`,
  MOUSEENTER: `mouseenter${yt}`,
  MOUSELEAVE: `mouseleave${yt}`
}, Xu = "fade", Gu = "modal", pn = "show", oi = "show", _n = "out", kr = ".tooltip-inner", Or = `.${Gu}`, Sr = "hide.te.modal", ri = "hover", fn = "focus", qu = "click", Zu = "manual";
class Qe extends Et {
  constructor(t, e) {
    if (typeof Nl > "u")
      throw new TypeError(
        "Bootstrap's tooltips require Popper (https://popper.js.org)"
      );
    super(t), this._isEnabled = !0, this._timeout = 0, this._hoverState = "", this._activeTrigger = {}, this._popper = null, this._config = this._getConfig(e), this.tip = null, this._setListeners();
  }
  // Getters
  static get Default() {
    return zu;
  }
  static get NAME() {
    return xr;
  }
  static get Event() {
    return Uu;
  }
  static get DefaultType() {
    return ju;
  }
  // Public
  enable() {
    this._isEnabled = !0;
  }
  disable() {
    this._isEnabled = !1;
  }
  toggleEnabled() {
    this._isEnabled = !this._isEnabled;
  }
  toggle(t) {
    if (this._isEnabled)
      if (t) {
        const e = this._initializeOnDelegatedTarget(t);
        e._activeTrigger.click = !e._activeTrigger.click, e._isWithActiveTrigger() ? e._enter(null, e) : e._leave(null, e);
      } else {
        if (this.getTipElement().classList.contains(pn)) {
          this._leave(null, this);
          return;
        }
        this._enter(null, this);
      }
  }
  dispose() {
    clearTimeout(this._timeout), h.off(
      this._element.closest(Or),
      Sr,
      this._hideModalHandler
    ), this.tip && this.tip.remove(), this._disposePopper(), super.dispose();
  }
  show() {
    if (this._element.style.display === "none")
      throw new Error("Please use show on visible elements");
    if (!(this.isWithContent() && this._isEnabled))
      return;
    const t = h.trigger(
      this._element,
      this.constructor.Event.SHOW
    ), e = tl(this._element), i = e === null ? this._element.ownerDocument.documentElement.contains(this._element) : e.contains(this._element);
    if (t.defaultPrevented || !i)
      return;
    this.constructor.NAME === "tooltip" && this.tip && this.getTitle() !== this.tip.querySelector(kr).innerHTML && (this._disposePopper(), this.tip.remove(), this.tip = null);
    const n = this.getTipElement(), o = bt(this.constructor.NAME);
    n.setAttribute("id", o), this._element.setAttribute("aria-describedby", o), this._config.animation && setTimeout(() => {
      this.tip.classList.add("opacity-100"), this.tip.classList.remove("opacity-0");
    }, 100);
    const r = typeof this._config.placement == "function" ? this._config.placement.call(this, n, this._element) : this._config.placement, a = this._getAttachment(r);
    this._addAttachmentClass(a);
    const { container: l } = this._config;
    if (I.setData(n, this.constructor.DATA_KEY, this), this._element.ownerDocument.documentElement.contains(this.tip) || (l.append(n), h.trigger(this._element, this.constructor.Event.INSERTED)), this._popper ? this._popper.update() : this._popper = Ee(
      this._element,
      n,
      this._getPopperConfig(a)
    ), n.getAttribute("id").includes("tooltip"))
      switch (r) {
        case "bottom":
          n.classList.add("py-[0.4rem]");
          break;
        case "left":
          n.classList.add("px-[0.4rem]");
          break;
        case "right":
          n.classList.add("px-[0.4rem]");
          break;
        default:
          n.classList.add("py-[0.4rem]");
          break;
      }
    const u = this._resolvePossibleFunction(this._config.customClass);
    u && n.classList.add(...u.split(" ")), "ontouchstart" in document.documentElement && [].concat(...document.body.children).forEach((m) => {
      h.on(m, "mouseover", Ms);
    });
    const f = () => {
      const m = this._hoverState;
      this._hoverState = null, h.trigger(this._element, this.constructor.Event.SHOWN), m === _n && this._leave(null, this);
    }, _ = this.tip.classList.contains("transition-opacity");
    this._queueCallback(f, this.tip, _);
  }
  hide() {
    if (!this._popper)
      return;
    const t = this.getTipElement(), e = () => {
      this._isWithActiveTrigger() || (this._hoverState !== oi && t.remove(), this._cleanTipClass(), this._element.removeAttribute("aria-describedby"), h.trigger(this._element, this.constructor.Event.HIDDEN), this._disposePopper());
    };
    if (h.trigger(
      this._element,
      this.constructor.Event.HIDE
    ).defaultPrevented)
      return;
    t.classList.add("opacity-0"), t.classList.remove("opacity-100"), "ontouchstart" in document.documentElement && [].concat(...document.body.children).forEach((o) => h.off(o, "mouseover", Ms)), this._activeTrigger[qu] = !1, this._activeTrigger[fn] = !1, this._activeTrigger[ri] = !1;
    const n = this.tip.classList.contains("opacity-0");
    this._queueCallback(e, this.tip, n), this._hoverState = "";
  }
  update() {
    this._popper !== null && this._popper.update();
  }
  // Protected
  isWithContent() {
    return !!this.getTitle();
  }
  getTipElement() {
    if (this.tip)
      return this.tip;
    const t = document.createElement("div");
    t.innerHTML = this._config.template;
    const e = t.children[0];
    return this.setContent(e), e.classList.remove(Xu, pn), this.tip = e, this.tip;
  }
  setContent(t) {
    this._sanitizeAndSetContent(t, this.getTitle(), kr);
  }
  _sanitizeAndSetContent(t, e, i) {
    const n = d.findOne(i, t);
    if (!e && n) {
      n.remove();
      return;
    }
    this.setElementContent(n, e);
  }
  setElementContent(t, e) {
    if (t !== null) {
      if (Ve(e)) {
        e = Jt(e), this._config.html ? e.parentNode !== t && (t.innerHTML = "", t.append(e)) : t.textContent = e.textContent;
        return;
      }
      this._config.html ? (this._config.sanitize && (e = wr(
        e,
        this._config.allowList,
        this._config.sanitizeFn
      )), t.innerHTML = e) : t.textContent = e;
    }
  }
  getTitle() {
    const t = this._element.getAttribute("data-te-original-title") || this._config.title;
    return this._resolvePossibleFunction(t);
  }
  updateAttachment(t) {
    return t === "right" ? "end" : t === "left" ? "start" : t;
  }
  // Private
  _initializeOnDelegatedTarget(t, e) {
    return e || this.constructor.getOrCreateInstance(
      t.delegateTarget,
      this._getDelegateConfig()
    );
  }
  _getOffset() {
    const { offset: t } = this._config;
    return typeof t == "string" ? t.split(",").map((e) => Number.parseInt(e, 10)) : typeof t == "function" ? (e) => t(e, this._element) : t;
  }
  _resolvePossibleFunction(t) {
    return typeof t == "function" ? t.call(this._element) : t;
  }
  _getPopperConfig(t) {
    const e = {
      placement: t,
      modifiers: [
        {
          name: "flip",
          options: {
            fallbackPlacements: this._config.fallbackPlacements
          }
        },
        {
          name: "offset",
          options: {
            offset: this._getOffset()
          }
        },
        {
          name: "preventOverflow",
          options: {
            boundary: this._config.boundary
          }
        },
        {
          name: "arrow",
          options: {
            element: `.${this.constructor.NAME}-arrow`
          }
        },
        {
          name: "onChange",
          enabled: !0,
          phase: "afterWrite",
          fn: (i) => this._handlePopperPlacementChange(i)
        }
      ],
      onFirstUpdate: (i) => {
        i.options.placement !== i.placement && this._handlePopperPlacementChange(i);
      }
    };
    return {
      ...e,
      ...typeof this._config.popperConfig == "function" ? this._config.popperConfig(e) : this._config.popperConfig
    };
  }
  _addAttachmentClass(t) {
    this.getTipElement().classList.add(
      `${this._getBasicClassPrefix()}-${this.updateAttachment(t)}`
    );
  }
  _getAttachment(t) {
    return Ku[t.toUpperCase()];
  }
  _setListeners() {
    this._config.trigger.split(" ").forEach((e) => {
      if (e === "click")
        h.on(
          this._element,
          this.constructor.Event.CLICK,
          this._config.selector,
          (i) => this.toggle(i)
        );
      else if (e !== Zu) {
        const i = e === ri ? this.constructor.Event.MOUSEENTER : this.constructor.Event.FOCUSIN, n = e === ri ? this.constructor.Event.MOUSELEAVE : this.constructor.Event.FOCUSOUT;
        h.on(
          this._element,
          i,
          this._config.selector,
          (o) => this._enter(o)
        ), h.on(
          this._element,
          n,
          this._config.selector,
          (o) => this._leave(o)
        );
      }
    }), this._hideModalHandler = () => {
      this._element && this.hide();
    }, h.on(
      this._element.closest(Or),
      Sr,
      this._hideModalHandler
    ), this._config.selector ? this._config = {
      ...this._config,
      trigger: "manual",
      selector: ""
    } : this._fixTitle();
  }
  _fixTitle() {
    const t = this._element.getAttribute("title"), e = typeof this._element.getAttribute(
      "data-te-original-title"
    );
    (t || e !== "string") && (this._element.setAttribute("data-te-original-title", t || ""), t && !this._element.getAttribute("aria-label") && !this._element.textContent && this._element.setAttribute("aria-label", t), this._element.setAttribute("title", ""));
  }
  _enter(t, e) {
    if (e = this._initializeOnDelegatedTarget(t, e), t && (e._activeTrigger[t.type === "focusin" ? fn : ri] = !0), e.getTipElement().classList.contains(pn) || e._hoverState === oi) {
      e._hoverState = oi;
      return;
    }
    if (clearTimeout(e._timeout), e._hoverState = oi, !e._config.delay || !e._config.delay.show) {
      e.show();
      return;
    }
    e._timeout = setTimeout(() => {
      e._hoverState === oi && e.show();
    }, e._config.delay.show);
  }
  _leave(t, e) {
    if (e = this._initializeOnDelegatedTarget(t, e), t && (e._activeTrigger[t.type === "focusout" ? fn : ri] = e._element.contains(t.relatedTarget)), !e._isWithActiveTrigger()) {
      if (clearTimeout(e._timeout), e._hoverState = _n, !e._config.delay || !e._config.delay.hide) {
        e.hide();
        return;
      }
      e._timeout = setTimeout(() => {
        e._hoverState === _n && e.hide();
      }, e._config.delay.hide);
    }
  }
  _isWithActiveTrigger() {
    for (const t in this._activeTrigger)
      if (this._activeTrigger[t])
        return !0;
    return !1;
  }
  _getConfig(t) {
    const e = c.getDataAttributes(this._element);
    return Object.keys(e).forEach((i) => {
      Yu.has(i) && delete e[i];
    }), t = {
      ...this.constructor.Default,
      ...e,
      ...typeof t == "object" && t ? t : {}
    }, t.container = t.container === !1 ? document.body : Jt(t.container), typeof t.delay == "number" && (t.delay = {
      show: t.delay,
      hide: t.delay
    }), typeof t.title == "number" && (t.title = t.title.toString()), typeof t.content == "number" && (t.content = t.content.toString()), L(xr, t, this.constructor.DefaultType), t.sanitize && (t.template = wr(
      t.template,
      t.allowList,
      t.sanitizeFn
    )), t;
  }
  _getDelegateConfig() {
    const t = {};
    for (const e in this._config)
      this.constructor.Default[e] !== this._config[e] && (t[e] = this._config[e]);
    return t;
  }
  _cleanTipClass() {
    const t = this.getTipElement(), e = new RegExp(
      `(^|\\s)${this._getBasicClassPrefix()}\\S+`,
      "g"
    ), i = t.getAttribute("class").match(e);
    i !== null && i.length > 0 && i.map((n) => n.trim()).forEach((n) => t.classList.remove(n));
  }
  _getBasicClassPrefix() {
    return Fu;
  }
  _handlePopperPlacementChange(t) {
    const { state: e } = t;
    e && (this.tip = e.elements.popper, this._cleanTipClass(), this._addAttachmentClass(this._getAttachment(e.placement)));
  }
  _disposePopper() {
    this._popper && (this._popper.destroy(), this._popper = null);
  }
  // Static
  static jQueryInterface(t) {
    return this.each(function() {
      const e = Qe.getOrCreateInstance(this, t);
      if (typeof t == "string") {
        if (typeof e[t] > "u")
          throw new TypeError(`No method named "${t}"`);
        e[t]();
      }
    });
  }
}
const Qu = "popover", Ju = "te.popover", wt = `.${Ju}`, tp = "te-popover", ep = {
  ...Qe.Default,
  placement: "right",
  offset: [0, 8],
  trigger: "click",
  content: "",
  template: '<div class="opacity-0 transition-opacity duration-150 ease-in-out absolute top-0 left-0 z-[1070] block max-w-[267px] break-words bg-white bg-clip-padding border border-neutral-100 rounded-lg shadow-[0_0px_3px_0_rgba(0,0,0,0.07),0_2px_2px_0_rgba(0,0,0,0.04)] text-sm not-italic font-normal text-left no-underline underline-offset-auto normal-case leading-6 tracking-normal break-normal whitespace-normal dark:bg-neutral-700 dark:border-0 dark:text-white data-[popper-reference-hidden]:hidden" role="tooltip"><h3 class="popover-header py-2 px-4 mb-0 border-b-2 border-neutral-100 rounded-t-lg font-medium empty:hidden dark:border-neutral-500"></h3><div class="popover-body p-4 text-[#212529] dark:text-white"></div></div>'
}, ip = {
  ...Qe.DefaultType,
  content: "(string|element|function)"
}, sp = {
  HIDE: `hide${wt}`,
  HIDDEN: `hidden${wt}`,
  SHOW: `show${wt}`,
  SHOWN: `shown${wt}`,
  INSERTED: `inserted${wt}`,
  CLICK: `click${wt}`,
  FOCUSIN: `focusin${wt}`,
  FOCUSOUT: `focusout${wt}`,
  MOUSEENTER: `mouseenter${wt}`,
  MOUSELEAVE: `mouseleave${wt}`
}, np = ".popover-header", op = ".popover-body";
class Yl extends Qe {
  // Getters
  static get Default() {
    return ep;
  }
  static get NAME() {
    return Qu;
  }
  static get Event() {
    return sp;
  }
  static get DefaultType() {
    return ip;
  }
  // Overrides
  isWithContent() {
    return this.getTitle() || this._getContent();
  }
  setContent(t) {
    this._sanitizeAndSetContent(t, this.getTitle(), np), this._sanitizeAndSetContent(t, this._getContent(), op);
  }
  // Private
  _getContent() {
    return this._resolvePossibleFunction(this._config.content);
  }
  _getBasicClassPrefix() {
    return tp;
  }
  // Static
  static jQueryInterface(t) {
    return this.each(function() {
      const e = Yl.getOrCreateInstance(this, t);
      if (typeof t == "string") {
        if (typeof e[t] > "u")
          throw new TypeError(`No method named "${t}"`);
        e[t]();
      }
    });
  }
}
const mn = "scrollspy", rp = "te.scrollspy", Do = `.${rp}`, Ir = {
  offset: 10,
  method: "auto",
  target: ""
}, ap = {
  offset: "number",
  method: "string",
  target: "(string|element)"
}, lp = {
  active: "!text-primary dark:!text-primary-400 font-semibold border-l-[0.125rem] border-solid border-primary dark:border-primary-400"
}, cp = {
  active: "string"
}, hp = `activate${Do}`, dp = `scroll${Do}`, gn = "data-te-nav-link-active", jl = "[data-te-dropdown-item-ref]", up = "[data-te-nav-list-ref]", oo = "[data-te-nav-link-ref]", pp = "[data-te-nav-item-ref]", Kl = "[data-te-list-group-item-ref]", bn = `${oo}, ${Kl}, ${jl}`, _p = "[data-te-dropdown-ref]", fp = "[data-te-dropdown-toggle-ref]", mp = "maxOffset", Dr = "position";
class zl extends Et {
  constructor(t, e, i) {
    super(t), this._scrollElement = this._element.tagName === "BODY" ? window : this._element, this._config = this._getConfig(e), this._classes = this._getClasses(i), this._offsets = [], this._targets = [], this._activeTarget = null, this._scrollHeight = 0, h.on(this._scrollElement, dp, () => this._process()), this.refresh(), this._process();
  }
  // Getters
  static get Default() {
    return Ir;
  }
  static get NAME() {
    return mn;
  }
  // Public
  refresh() {
    const t = this._scrollElement === this._scrollElement.window ? mp : Dr, e = this._config.method === "auto" ? t : this._config.method, i = e === Dr ? this._getScrollTop() : 0;
    this._offsets = [], this._targets = [], this._scrollHeight = this._getScrollHeight(), d.find(
      bn,
      this._config.target
    ).map((o) => {
      const r = fo(o), a = r ? d.findOne(r) : null;
      if (a) {
        const l = a.getBoundingClientRect();
        if (l.width || l.height)
          return [
            c[e](a).top + i,
            r
          ];
      }
      return null;
    }).filter((o) => o).sort((o, r) => o[0] - r[0]).forEach((o) => {
      this._offsets.push(o[0]), this._targets.push(o[1]);
    });
  }
  dispose() {
    h.off(this._scrollElement, Do), super.dispose();
  }
  // Private
  _getConfig(t) {
    return t = {
      ...Ir,
      ...c.getDataAttributes(this._element),
      ...typeof t == "object" && t ? t : {}
    }, t.target = Jt(t.target) || document.documentElement, L(mn, t, ap), t;
  }
  _getClasses(t) {
    const e = c.getDataClassAttributes(this._element);
    return t = {
      ...lp,
      ...e,
      ...t
    }, L(mn, t, cp), t;
  }
  _getScrollTop() {
    return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
  }
  _getScrollHeight() {
    return this._scrollElement.scrollHeight || Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
  }
  _getOffsetHeight() {
    return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
  }
  _process() {
    const t = this._getScrollTop() + this._config.offset, e = this._getScrollHeight(), i = this._config.offset + e - this._getOffsetHeight();
    if (this._scrollHeight !== e && this.refresh(), t >= i) {
      const n = this._targets[this._targets.length - 1];
      this._activeTarget !== n && this._activate(n);
      return;
    }
    if (this._activeTarget && t < this._offsets[0] && this._offsets[0] > 0) {
      this._activeTarget = null, this._clear();
      return;
    }
    for (let n = this._offsets.length; n--; )
      this._activeTarget !== this._targets[n] && t >= this._offsets[n] && (typeof this._offsets[n + 1] > "u" || t < this._offsets[n + 1]) && this._activate(this._targets[n]);
  }
  _activate(t) {
    this._activeTarget = t, this._clear();
    const e = bn.split(",").map(
      (n) => `${n}[data-te-target="${t}"],${n}[href="${t}"]`
    ), i = d.findOne(e.join(","), this._config.target);
    i.classList.add(...this._classes.active.split(" ")), i.setAttribute(gn, ""), i.getAttribute(jl) ? d.findOne(
      fp,
      i.closest(_p)
    ).classList.add(...this._classes.active.split(" ")) : d.parents(i, up).forEach(
      (n) => {
        d.prev(
          n,
          `${oo}, ${Kl}`
        ).forEach((o) => {
          o.classList.add(...this._classes.active.split(" ")), o.setAttribute(gn, "");
        }), d.prev(n, pp).forEach(
          (o) => {
            d.children(o, oo).forEach(
              (r) => r.classList.add(...this._classes.active.split(" "))
            );
          }
        );
      }
    ), h.trigger(this._scrollElement, hp, {
      relatedTarget: t
    });
  }
  _clear() {
    d.find(bn, this._config.target).filter(
      (t) => t.classList.contains(...this._classes.active.split(" "))
    ).forEach((t) => {
      t.classList.remove(...this._classes.active.split(" ")), t.removeAttribute(gn);
    });
  }
  // Static
  static jQueryInterface(t) {
    return this.each(function() {
      const e = zl.getOrCreateInstance(this, t);
      if (typeof t == "string") {
        if (typeof e[t] > "u")
          throw new TypeError(`No method named "${t}"`);
        e[t]();
      }
    });
  }
}
const $r = "tab", gp = "te.tab", Fs = `.${gp}`, bp = `hide${Fs}`, vp = `hidden${Fs}`, Tp = `show${Fs}`, Ep = `shown${Fs}`, Cp = "data-te-dropdown-menu-ref", De = "data-te-tab-active", Es = "data-te-nav-active", Ap = "[data-te-dropdown-ref]", yp = "[data-te-nav-ref]", Lr = `[${De}]`, wp = `[${Es}]`, Mr = ":scope > li > .active", xp = "[data-te-dropdown-toggle-ref]", kp = ":scope > [data-te-dropdown-menu-ref] [data-te-dropdown-show]", Op = {
  show: "opacity-100",
  hide: "opacity-0"
}, Sp = {
  show: "string",
  hide: "string"
};
class Ul extends Et {
  constructor(t, e) {
    super(t), this._classes = this._getClasses(e);
  }
  // Getters
  static get NAME() {
    return $r;
  }
  // Public
  show() {
    if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && this._element.getAttribute(Es) === "")
      return;
    let t;
    const e = Qt(this._element), i = this._element.closest(yp), n = d.findOne(
      wp,
      i
    );
    if (i) {
      const l = i.nodeName === "UL" || i.nodeName === "OL" ? Mr : Lr;
      t = d.find(l, i), t = t[t.length - 1];
    }
    const o = t ? h.trigger(t, bp, {
      relatedTarget: this._element
    }) : null;
    if (h.trigger(this._element, Tp, {
      relatedTarget: t
    }).defaultPrevented || o !== null && o.defaultPrevented)
      return;
    this._activate(
      this._element,
      i,
      null,
      n,
      this._element
    );
    const a = () => {
      h.trigger(t, vp, {
        relatedTarget: this._element
      }), h.trigger(this._element, Ep, {
        relatedTarget: t
      });
    };
    e ? this._activate(
      e,
      e.parentNode,
      a,
      n,
      this._element
    ) : a();
  }
  // Private
  _getClasses(t) {
    const e = c.getDataClassAttributes(this._element);
    return t = {
      ...Op,
      ...e,
      ...t
    }, L($r, t, Sp), t;
  }
  _activate(t, e, i, n, o) {
    const a = (e && (e.nodeName === "UL" || e.nodeName === "OL") ? d.find(Mr, e) : d.children(e, Lr))[0], l = i && a && a.hasAttribute(De), p = () => this._transitionComplete(
      t,
      a,
      i,
      n,
      o
    );
    a && l ? (c.removeClass(a, this._classes.show), c.addClass(a, this._classes.hide), this._queueCallback(p, t, !0)) : p();
  }
  _transitionComplete(t, e, i, n, o) {
    if (e && n) {
      e.removeAttribute(De), n.removeAttribute(Es);
      const a = d.findOne(
        kp,
        e.parentNode
      );
      a && a.removeAttribute(De), e.getAttribute("role") === "tab" && e.setAttribute("aria-selected", !1);
    }
    t.setAttribute(De, ""), o.setAttribute(Es, ""), t.getAttribute("role") === "tab" && t.setAttribute("aria-selected", !0), Ge(t), t.classList.contains(this._classes.hide) && (c.removeClass(t, this._classes.hide), c.addClass(t, this._classes.show));
    let r = t.parentNode;
    if (r && r.nodeName === "LI" && (r = r.parentNode), r && r.hasAttribute(Cp)) {
      const a = t.closest(Ap);
      a && d.find(xp, a).forEach(
        (l) => l.setAttribute(De, "")
      ), t.setAttribute("aria-expanded", !0);
    }
    i && i();
  }
  // Static
  static jQueryInterface(t) {
    return this.each(function() {
      const e = Ul.getOrCreateInstance(this);
      if (typeof t == "string") {
        if (typeof e[t] > "u")
          throw new TypeError(`No method named "${t}"`);
        e[t]();
      }
    });
  }
}
const vn = "toast", Ip = "te.toast", ee = `.${Ip}`, Dp = `mouseover${ee}`, $p = `mouseout${ee}`, Lp = `focusin${ee}`, Mp = `focusout${ee}`, Np = `hide${ee}`, Rp = `hidden${ee}`, Pp = `show${ee}`, Bp = `shown${ee}`, Nr = "data-te-toast-hide", Tn = "data-te-toast-show", Xi = "data-te-toast-showing", Hp = {
  animation: "boolean",
  autohide: "boolean",
  delay: "number"
}, Rr = {
  animation: !0,
  autohide: !0,
  delay: 5e3
}, Wp = {
  fadeIn: "animate-[fade-in_0.3s_both] p-[auto] motion-reduce:transition-none motion-reduce:animate-none",
  fadeOut: "animate-[fade-out_0.3s_both] p-[auto] motion-reduce:transition-none motion-reduce:animate-none"
}, Vp = {
  fadeIn: "string",
  fadeOut: "string"
};
class Xl extends Et {
  constructor(t, e, i) {
    super(t), this._config = this._getConfig(e), this._classes = this._getClasses(i), this._timeout = null, this._hasMouseInteraction = !1, this._hasKeyboardInteraction = !1, this._setListeners();
  }
  // Getters
  static get DefaultType() {
    return Hp;
  }
  static get Default() {
    return Rr;
  }
  static get NAME() {
    return vn;
  }
  // Public
  show() {
    if (h.trigger(this._element, Pp).defaultPrevented)
      return;
    this._clearTimeout(), this._config.animation && (c.removeClass(this._element, this._classes.fadeOut), c.addClass(this._element, this._classes.fadeIn));
    const e = () => {
      this._element.removeAttribute(Xi), h.trigger(this._element, Bp), this._maybeScheduleHide();
    };
    this._element.removeAttribute(Nr), Ge(this._element), this._element.setAttribute(Tn, ""), this._element.setAttribute(Xi, ""), this._queueCallback(e, this._element, this._config.animation);
  }
  hide() {
    if (!this._element || this._element.dataset.teToastShow === void 0 || h.trigger(this._element, Np).defaultPrevented)
      return;
    const e = () => {
      let i = 0;
      this._config.animation && (i = 300, c.removeClass(this._element, this._classes.fadeIn), c.addClass(this._element, this._classes.fadeOut)), setTimeout(() => {
        this._element.setAttribute(Nr, ""), this._element.removeAttribute(Xi), this._element.removeAttribute(Tn), h.trigger(this._element, Rp);
      }, i);
    };
    this._element.setAttribute(Xi, ""), this._queueCallback(e, this._element, this._config.animation);
  }
  dispose() {
    this._clearTimeout(), this._element.dataset.teToastShow !== void 0 && this._element.removeAttribute(Tn), super.dispose();
  }
  // Private
  _getConfig(t) {
    return t = {
      ...Rr,
      ...c.getDataAttributes(this._element),
      ...typeof t == "object" && t ? t : {}
    }, L(vn, t, this.constructor.DefaultType), t;
  }
  _getClasses(t) {
    const e = c.getDataClassAttributes(this._element);
    return t = {
      ...Wp,
      ...e,
      ...t
    }, L(vn, t, Vp), t;
  }
  _maybeScheduleHide() {
    this._config.autohide && (this._hasMouseInteraction || this._hasKeyboardInteraction || (this._timeout = setTimeout(() => {
      this.hide();
    }, this._config.delay)));
  }
  _onInteraction(t, e) {
    switch (t.type) {
      case "mouseover":
      case "mouseout":
        this._hasMouseInteraction = e;
        break;
      case "focusin":
      case "focusout":
        this._hasKeyboardInteraction = e;
        break;
    }
    if (e) {
      this._clearTimeout();
      return;
    }
    const i = t.relatedTarget;
    this._element === i || this._element.contains(i) || this._maybeScheduleHide();
  }
  _setListeners() {
    h.on(
      this._element,
      Dp,
      (t) => this._onInteraction(t, !0)
    ), h.on(
      this._element,
      $p,
      (t) => this._onInteraction(t, !1)
    ), h.on(
      this._element,
      Lp,
      (t) => this._onInteraction(t, !0)
    ), h.on(
      this._element,
      Mp,
      (t) => this._onInteraction(t, !1)
    );
  }
  _clearTimeout() {
    clearTimeout(this._timeout), this._timeout = null;
  }
  // Static
  static jQueryInterface(t) {
    return this.each(function() {
      const e = Xl.getOrCreateInstance(this, t);
      if (typeof t == "string") {
        if (typeof e[t] > "u")
          throw new TypeError(`No method named "${t}"`);
        e[t](this);
      }
    });
  }
}
(() => {
  var s = { 454: (i, n, o) => {
    o.d(n, { Z: () => l });
    var r = o(645), a = o.n(r)()(function(p) {
      return p[1];
    });
    a.push([i.id, "INPUT:-webkit-autofill,SELECT:-webkit-autofill,TEXTAREA:-webkit-autofill{animation-name:onautofillstart}INPUT:not(:-webkit-autofill),SELECT:not(:-webkit-autofill),TEXTAREA:not(:-webkit-autofill){animation-name:onautofillcancel}@keyframes onautofillstart{}@keyframes onautofillcancel{}", ""]);
    const l = a;
  }, 645: (i) => {
    i.exports = function(n) {
      var o = [];
      return o.toString = function() {
        return this.map(function(r) {
          var a = n(r);
          return r[2] ? "@media ".concat(r[2], " {").concat(a, "}") : a;
        }).join("");
      }, o.i = function(r, a, l) {
        typeof r == "string" && (r = [[null, r, ""]]);
        var p = {};
        if (l)
          for (var u = 0; u < this.length; u++) {
            var f = this[u][0];
            f != null && (p[f] = !0);
          }
        for (var _ = 0; _ < r.length; _++) {
          var m = [].concat(r[_]);
          l && p[m[0]] || (a && (m[2] ? m[2] = "".concat(a, " and ").concat(m[2]) : m[2] = a), o.push(m));
        }
      }, o;
    };
  }, 810: () => {
    (function() {
      if (typeof window < "u")
        try {
          var i = new window.CustomEvent("test", { cancelable: !0 });
          if (i.preventDefault(), i.defaultPrevented !== !0)
            throw new Error("Could not prevent default");
        } catch {
          var n = function(r, a) {
            var l, p;
            return (a = a || {}).bubbles = !!a.bubbles, a.cancelable = !!a.cancelable, (l = document.createEvent("CustomEvent")).initCustomEvent(r, a.bubbles, a.cancelable, a.detail), p = l.preventDefault, l.preventDefault = function() {
              p.call(this);
              try {
                Object.defineProperty(this, "defaultPrevented", { get: function() {
                  return !0;
                } });
              } catch {
                this.defaultPrevented = !0;
              }
            }, l;
          };
          n.prototype = window.Event.prototype, window.CustomEvent = n;
        }
    })();
  }, 379: (i, n, o) => {
    var r, a = function() {
      var E = {};
      return function(T) {
        if (E[T] === void 0) {
          var A = document.querySelector(T);
          if (window.HTMLIFrameElement && A instanceof window.HTMLIFrameElement)
            try {
              A = A.contentDocument.head;
            } catch {
              A = null;
            }
          E[T] = A;
        }
        return E[T];
      };
    }(), l = [];
    function p(E) {
      for (var T = -1, A = 0; A < l.length; A++)
        if (l[A].identifier === E) {
          T = A;
          break;
        }
      return T;
    }
    function u(E, T) {
      for (var A = {}, w = [], S = 0; S < E.length; S++) {
        var k = E[S], x = T.base ? k[0] + T.base : k[0], $ = A[x] || 0, O = "".concat(x, " ").concat($);
        A[x] = $ + 1;
        var M = p(O), P = { css: k[1], media: k[2], sourceMap: k[3] };
        M !== -1 ? (l[M].references++, l[M].updater(P)) : l.push({ identifier: O, updater: y(P, T), references: 1 }), w.push(O);
      }
      return w;
    }
    function f(E) {
      var T = document.createElement("style"), A = E.attributes || {};
      if (A.nonce === void 0) {
        var w = o.nc;
        w && (A.nonce = w);
      }
      if (Object.keys(A).forEach(function(k) {
        T.setAttribute(k, A[k]);
      }), typeof E.insert == "function")
        E.insert(T);
      else {
        var S = a(E.insert || "head");
        if (!S)
          throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
        S.appendChild(T);
      }
      return T;
    }
    var _, m = (_ = [], function(E, T) {
      return _[E] = T, _.filter(Boolean).join(`
`);
    });
    function g(E, T, A, w) {
      var S = A ? "" : w.media ? "@media ".concat(w.media, " {").concat(w.css, "}") : w.css;
      if (E.styleSheet)
        E.styleSheet.cssText = m(T, S);
      else {
        var k = document.createTextNode(S), x = E.childNodes;
        x[T] && E.removeChild(x[T]), x.length ? E.insertBefore(k, x[T]) : E.appendChild(k);
      }
    }
    function v(E, T, A) {
      var w = A.css, S = A.media, k = A.sourceMap;
      if (S ? E.setAttribute("media", S) : E.removeAttribute("media"), k && typeof btoa < "u" && (w += `
/*# sourceMappingURL=data:application/json;base64,`.concat(btoa(unescape(encodeURIComponent(JSON.stringify(k)))), " */")), E.styleSheet)
        E.styleSheet.cssText = w;
      else {
        for (; E.firstChild; )
          E.removeChild(E.firstChild);
        E.appendChild(document.createTextNode(w));
      }
    }
    var b = null, C = 0;
    function y(E, T) {
      var A, w, S;
      if (T.singleton) {
        var k = C++;
        A = b || (b = f(T)), w = g.bind(null, A, k, !1), S = g.bind(null, A, k, !0);
      } else
        A = f(T), w = v.bind(null, A, T), S = function() {
          (function(x) {
            if (x.parentNode === null)
              return !1;
            x.parentNode.removeChild(x);
          })(A);
        };
      return w(E), function(x) {
        if (x) {
          if (x.css === E.css && x.media === E.media && x.sourceMap === E.sourceMap)
            return;
          w(E = x);
        } else
          S();
      };
    }
    i.exports = function(E, T) {
      (T = T || {}).singleton || typeof T.singleton == "boolean" || (T.singleton = (r === void 0 && (r = !!(window && document && document.all && !window.atob)), r));
      var A = u(E = E || [], T);
      return function(w) {
        if (w = w || [], Object.prototype.toString.call(w) === "[object Array]") {
          for (var S = 0; S < A.length; S++) {
            var k = p(A[S]);
            l[k].references--;
          }
          for (var x = u(w, T), $ = 0; $ < A.length; $++) {
            var O = p(A[$]);
            l[O].references === 0 && (l[O].updater(), l.splice(O, 1));
          }
          A = x;
        }
      };
    };
  } }, t = {};
  function e(i) {
    var n = t[i];
    if (n !== void 0)
      return n.exports;
    var o = t[i] = { id: i, exports: {} };
    return s[i](o, o.exports, e), o.exports;
  }
  e.n = (i) => {
    var n = i && i.__esModule ? () => i.default : () => i;
    return e.d(n, { a: n }), n;
  }, e.d = (i, n) => {
    for (var o in n)
      e.o(n, o) && !e.o(i, o) && Object.defineProperty(i, o, { enumerable: !0, get: n[o] });
  }, e.o = (i, n) => Object.prototype.hasOwnProperty.call(i, n), (() => {
    var i = e(379), n = e.n(i), o = e(454);
    function r(l) {
      if (!l.hasAttribute("autocompleted")) {
        l.setAttribute("autocompleted", "");
        var p = new window.CustomEvent("onautocomplete", { bubbles: !0, cancelable: !0, detail: null });
        l.dispatchEvent(p) || (l.value = "");
      }
    }
    function a(l) {
      l.hasAttribute("autocompleted") && (l.removeAttribute("autocompleted"), l.dispatchEvent(new window.CustomEvent("onautocomplete", { bubbles: !0, cancelable: !1, detail: null })));
    }
    n()(o.Z, { insert: "head", singleton: !1 }), o.Z.locals, e(810), document.addEventListener("animationstart", function(l) {
      l.animationName === "onautofillstart" ? r(l.target) : a(l.target);
    }, !0), document.addEventListener("input", function(l) {
      l.inputType !== "insertReplacementText" && "data" in l ? a(l.target) : r(l.target);
    }, !0);
  })();
})();
const En = "input", Gi = "te.input", Gl = "data-te-input-wrapper-init", ql = "data-te-input-notch-ref", Zl = "data-te-input-notch-leading-ref", Ql = "data-te-input-notch-middle-ref", Fp = "data-te-input-notch-trailing-ref", Yp = "data-te-input-helper-ref", jp = "data-te-input-placeholder-active", Ft = "data-te-input-state-active", Pr = "data-te-input-focused", Br = "data-te-input-form-counter", he = `[${Gl}] input`, de = `[${Gl}] textarea`, we = `[${ql}]`, Hr = `[${Zl}]`, Wr = `[${Ql}]`, Kp = `[${Yp}]`, zp = {
  inputFormWhite: !1
}, Up = {
  inputFormWhite: "(boolean)"
}, Xp = {
  notch: "group flex absolute left-0 top-0 w-full max-w-full h-full text-left pointer-events-none",
  notchLeading: "pointer-events-none border border-solid box-border bg-transparent transition-all duration-200 ease-linear motion-reduce:transition-none left-0 top-0 h-full w-2 border-r-0 rounded-l-[0.25rem] group-data-[te-input-focused]:border-r-0 group-data-[te-input-state-active]:border-r-0",
  notchLeadingNormal: "border-neutral-300 dark:border-neutral-600 group-data-[te-input-focused]:shadow-[-1px_0_0_#3b71ca,_0_1px_0_0_#3b71ca,_0_-1px_0_0_#3b71ca] group-data-[te-input-focused]:border-primary",
  notchLeadingWhite: "border-neutral-200 group-data-[te-input-focused]:shadow-[-1px_0_0_#ffffff,_0_1px_0_0_#ffffff,_0_-1px_0_0_#ffffff] group-data-[te-input-focused]:border-white",
  notchMiddle: "pointer-events-none border border-solid box-border bg-transparent transition-all duration-200 ease-linear motion-reduce:transition-none grow-0 shrink-0 basis-auto w-auto max-w-[calc(100%-1rem)] h-full border-r-0 border-l-0 group-data-[te-input-focused]:border-x-0 group-data-[te-input-state-active]:border-x-0 group-data-[te-input-focused]:border-t group-data-[te-input-state-active]:border-t group-data-[te-input-focused]:border-solid group-data-[te-input-state-active]:border-solid group-data-[te-input-focused]:border-t-transparent group-data-[te-input-state-active]:border-t-transparent",
  notchMiddleNormal: "border-neutral-300 dark:border-neutral-600 group-data-[te-input-focused]:shadow-[0_1px_0_0_#3b71ca] group-data-[te-input-focused]:border-primary",
  notchMiddleWhite: "border-neutral-200 group-data-[te-input-focused]:shadow-[0_1px_0_0_#ffffff] group-data-[te-input-focused]:border-white",
  notchTrailing: "pointer-events-none border border-solid box-border bg-transparent transition-all duration-200 ease-linear motion-reduce:transition-none grow h-full border-l-0 rounded-r-[0.25rem] group-data-[te-input-focused]:border-l-0 group-data-[te-input-state-active]:border-l-0",
  notchTrailingNormal: "border-neutral-300 dark:border-neutral-600 group-data-[te-input-focused]:shadow-[1px_0_0_#3b71ca,_0_-1px_0_0_#3b71ca,_0_1px_0_0_#3b71ca] group-data-[te-input-focused]:border-primary",
  notchTrailingWhite: "border-neutral-200 group-data-[te-input-focused]:shadow-[1px_0_0_#ffffff,_0_-1px_0_0_#ffffff,_0_1px_0_0_#ffffff] group-data-[te-input-focused]:border-white",
  counter: "text-right leading-[1.6]"
}, Gp = {
  notch: "string",
  notchLeading: "string",
  notchLeadingNormal: "string",
  notchLeadingWhite: "string",
  notchMiddle: "string",
  notchMiddleNormal: "string",
  notchMiddleWhite: "string",
  notchTrailing: "string",
  notchTrailingNormal: "string",
  notchTrailingWhite: "string",
  counter: "string"
};
class W {
  constructor(t, e, i) {
    this._config = this._getConfig(e, t), this._element = t, this._classes = this._getClasses(i), this._label = null, this._labelWidth = 0, this._labelMarginLeft = 0, this._notchLeading = null, this._notchMiddle = null, this._notchTrailing = null, this._initiated = !1, this._helper = null, this._counter = !1, this._counterElement = null, this._maxLength = 0, this._leadingIcon = null, this._element && (I.setData(t, Gi, this), this.init());
  }
  // Getters
  static get NAME() {
    return En;
  }
  get input() {
    return d.findOne("input", this._element) || d.findOne("textarea", this._element);
  }
  // Public
  init() {
    this._initiated || (this._getLabelData(), this._applyDivs(), this._applyNotch(), this._activate(), this._getHelper(), this._getCounter(), this._getEvents(), this._initiated = !0);
  }
  update() {
    this._getLabelData(), this._getNotchData(), this._applyNotch(), this._activate(), this._getHelper(), this._getCounter();
  }
  forceActive() {
    this.input.setAttribute(Ft, ""), d.findOne(we, this.input.parentNode).setAttribute(
      Ft,
      ""
    );
  }
  forceInactive() {
    this.input.removeAttribute(Ft), d.findOne(
      we,
      this.input.parentNode
    ).removeAttribute(Ft);
  }
  dispose() {
    this._removeBorder(), I.removeData(this._element, Gi), this._element = null;
  }
  // Private
  _getConfig(t, e) {
    return t = {
      ...zp,
      ...c.getDataAttributes(e),
      ...typeof t == "object" ? t : {}
    }, L(En, t, Up), t;
  }
  _getClasses(t) {
    const e = c.getDataClassAttributes(this._element);
    return t = {
      ...Xp,
      ...e,
      ...t
    }, L(En, t, Gp), t;
  }
  _getLabelData() {
    this._label = d.findOne("label", this._element), this._label === null ? this._showPlaceholder() : (this._getLabelWidth(), this._getLabelPositionInInputGroup(), this._toggleDefaultDatePlaceholder());
  }
  _getHelper() {
    this._helper = d.findOne(Kp, this._element);
  }
  _getCounter() {
    this._counter = c.getDataAttribute(
      this.input,
      "inputShowcounter"
    ), this._counter && (this._maxLength = this.input.maxLength, this._showCounter());
  }
  _getEvents() {
    h.on(
      document,
      "focus",
      he,
      W.activate(new W())
    ), h.on(
      document,
      "input",
      he,
      W.activate(new W())
    ), h.on(
      document,
      "blur",
      he,
      W.deactivate(new W())
    ), h.on(
      document,
      "focus",
      de,
      W.activate(new W())
    ), h.on(
      document,
      "input",
      de,
      W.activate(new W())
    ), h.on(
      document,
      "blur",
      de,
      W.deactivate(new W())
    ), h.on(window, "shown.te.modal", (t) => {
      d.find(he, t.target).forEach(
        (e) => {
          const i = W.getInstance(e.parentNode);
          i && i.update();
        }
      ), d.find(de, t.target).forEach(
        (e) => {
          const i = W.getInstance(e.parentNode);
          i && i.update();
        }
      );
    }), h.on(window, "shown.te.dropdown", (t) => {
      const e = t.target.parentNode.querySelector(
        "[data-te-dropdown-menu-ref]"
      );
      e && (d.find(he, e).forEach(
        (i) => {
          const n = W.getInstance(i.parentNode);
          n && n.update();
        }
      ), d.find(de, e).forEach(
        (i) => {
          const n = W.getInstance(i.parentNode);
          n && n.update();
        }
      ));
    }), h.on(window, "shown.te.tab", (t) => {
      let e;
      t.target.href ? e = t.target.href.split("#")[1] : e = c.getDataAttribute(t.target, "target").split(
        "#"
      )[1];
      const i = d.findOne(`#${e}`);
      d.find(he, i).forEach((n) => {
        const o = W.getInstance(n.parentNode);
        o && o.update();
      }), d.find(de, i).forEach(
        (n) => {
          const o = W.getInstance(n.parentNode);
          o && o.update();
        }
      );
    }), h.on(window, "reset", (t) => {
      d.find(he, t.target).forEach(
        (e) => {
          const i = W.getInstance(e.parentNode);
          i && i.forceInactive();
        }
      ), d.find(de, t.target).forEach(
        (e) => {
          const i = W.getInstance(e.parentNode);
          i && i.forceInactive();
        }
      );
    }), h.on(window, "onautocomplete", (t) => {
      const e = W.getInstance(t.target.parentNode);
      !e || !t.cancelable || e.forceActive();
    });
  }
  _showCounter() {
    if (d.find(
      `[${Br}]`,
      this._element
    ).length > 0)
      return;
    this._counterElement = document.createElement("div"), c.addClass(this._counterElement, this._classes.counter), this._counterElement.setAttribute(Br, "");
    const e = this.input.value.length;
    this._counterElement.innerHTML = `${e} / ${this._maxLength}`, this._helper.appendChild(this._counterElement), this._bindCounter();
  }
  _bindCounter() {
    h.on(this.input, "input", () => {
      const t = this.input.value.length;
      this._counterElement.innerHTML = `${t} / ${this._maxLength}`;
    });
  }
  _toggleDefaultDatePlaceholder(t = this.input) {
    if (!(t.getAttribute("type") === "date"))
      return;
    !(document.activeElement === t) && !t.value ? t.style.opacity = 0 : t.style.opacity = 1;
  }
  _showPlaceholder() {
    this.input.setAttribute(jp, "");
  }
  _getNotchData() {
    this._notchMiddle = d.findOne(
      Wr,
      this._element
    ), this._notchLeading = d.findOne(
      Hr,
      this._element
    );
  }
  _getLabelWidth() {
    this._labelWidth = this._label.clientWidth * 0.8 + 8;
  }
  _getLabelPositionInInputGroup() {
    if (this._labelMarginLeft = 0, !this._element.hasAttribute("data-te-input-group-ref"))
      return;
    const t = this.input, e = d.prev(
      t,
      "[data-te-input-group-text-ref]"
    )[0];
    e === void 0 ? this._labelMarginLeft = 0 : this._labelMarginLeft = e.offsetWidth - 1;
  }
  _applyDivs() {
    const t = this._config.inputFormWhite ? this._classes.notchLeadingWhite : this._classes.notchLeadingNormal, e = this._config.inputFormWhite ? this._classes.notchMiddleWhite : this._classes.notchMiddleNormal, i = this._config.inputFormWhite ? this._classes.notchTrailingWhite : this._classes.notchTrailingNormal, n = d.find(we, this._element), o = D("div");
    c.addClass(o, this._classes.notch), o.setAttribute(ql, ""), this._notchLeading = D("div"), c.addClass(
      this._notchLeading,
      `${this._classes.notchLeading} ${t}`
    ), this._notchLeading.setAttribute(Zl, ""), this._notchMiddle = D("div"), c.addClass(
      this._notchMiddle,
      `${this._classes.notchMiddle} ${e}`
    ), this._notchMiddle.setAttribute(Ql, ""), this._notchTrailing = D("div"), c.addClass(
      this._notchTrailing,
      `${this._classes.notchTrailing} ${i}`
    ), this._notchTrailing.setAttribute(Fp, ""), !(n.length >= 1) && (o.append(this._notchLeading), o.append(this._notchMiddle), o.append(this._notchTrailing), this._element.append(o));
  }
  _applyNotch() {
    this._notchMiddle.style.width = `${this._labelWidth}px`, this._notchLeading.style.width = `${this._labelMarginLeft + 9}px`, this._label !== null && (this._label.style.marginLeft = `${this._labelMarginLeft}px`);
  }
  _removeBorder() {
    const t = d.findOne(we, this._element);
    t && t.remove();
  }
  _activate(t) {
    il(() => {
      this._getElements(t);
      const e = t ? t.target : this.input, i = d.findOne(
        we,
        this._element
      );
      t && t.type === "focus" && i.setAttribute(Pr, ""), e.value !== "" && (e.setAttribute(Ft, ""), i.setAttribute(Ft, "")), this._toggleDefaultDatePlaceholder(e);
    });
  }
  _getElements(t) {
    if (t && (this._element = t.target.parentNode, this._label = d.findOne("label", this._element)), t && this._label) {
      const e = this._labelWidth;
      this._getLabelData(), e !== this._labelWidth && (this._notchMiddle = d.findOne(
        Wr,
        t.target.parentNode
      ), this._notchLeading = d.findOne(
        Hr,
        t.target.parentNode
      ), this._applyNotch());
    }
  }
  _deactivate(t) {
    const e = t ? t.target : this.input, i = d.findOne(
      we,
      e.parentNode
    );
    i.removeAttribute(Pr), e.value === "" && (e.removeAttribute(Ft), i.removeAttribute(Ft)), this._toggleDefaultDatePlaceholder(e);
  }
  static activate(t) {
    return function(e) {
      t._activate(e);
    };
  }
  static deactivate(t) {
    return function(e) {
      t._deactivate(e);
    };
  }
  static jQueryInterface(t, e) {
    return this.each(function() {
      let i = I.getData(this, Gi);
      const n = typeof t == "object" && t;
      if (!(!i && /dispose/.test(t)) && (i || (i = new W(this, n)), typeof t == "string")) {
        if (typeof i[t] > "u")
          throw new TypeError(`No method named "${t}"`);
        i[t](e);
      }
    });
  }
  static getInstance(t) {
    return I.getData(t, Gi);
  }
  static getOrCreateInstance(t, e = {}) {
    return this.getInstance(t) || new this(t, typeof e == "object" ? e : null);
  }
}
const Vr = "animation", Cn = "te.animation", qp = {
  animation: "string",
  animationStart: "string",
  animationShowOnLoad: "boolean",
  onStart: "(null|function)",
  onEnd: "(null|function)",
  onHide: "(null|function)",
  onShow: "(null|function)",
  animationOnScroll: "(string)",
  animationWindowHeight: "number",
  animationOffset: "(number|string)",
  animationDelay: "(number|string)",
  animationReverse: "boolean",
  animationInterval: "(number|string)",
  animationRepeat: "(number|boolean)",
  animationReset: "boolean"
}, Zp = {
  animation: "fade",
  animationStart: "onClick",
  animationShowOnLoad: !0,
  onStart: null,
  onEnd: null,
  onHide: null,
  onShow: null,
  animationOnScroll: "once",
  animationWindowHeight: 0,
  animationOffset: 0,
  animationDelay: 0,
  animationReverse: !1,
  animationInterval: 0,
  animationRepeat: !1,
  animationReset: !1
};
class Jl {
  constructor(t, e) {
    this._element = t, this._animateElement = this._getAnimateElement(), this._isFirstScroll = !0, this._repeatAnimateOnScroll = !0, this._options = this._getConfig(e), this._element && (I.setData(t, Cn, this), this._init());
  }
  // Getters
  static get NAME() {
    return Vr;
  }
  // Public
  init() {
    this._init();
  }
  startAnimation() {
    this._startAnimation();
  }
  stopAnimation() {
    this._clearAnimationClass();
  }
  changeAnimationType(t) {
    this._options.animation = t;
  }
  dispose() {
    h.off(this._element, "mousedown"), h.off(this._animateElement, "animationend"), h.off(window, "scroll"), h.off(this._element, "mouseover"), I.removeData(this._element, Cn), this._element = null, this._animateElement = null, this._isFirstScroll = null, this._repeatAnimateOnScroll = null, this._options = null;
  }
  // Private
  _init() {
    switch (this._options.animationStart) {
      case "onHover":
        this._bindHoverEvents();
        break;
      case "onLoad":
        this._startAnimation();
        break;
      case "onScroll":
        this._bindScrollEvents();
        break;
      case "onClick":
        this._bindClickEvents();
        break;
    }
    this._bindTriggerOnEndCallback(), this._options.animationReset && this._bindResetAnimationAfterFinish();
  }
  _getAnimateElement() {
    const t = c.getDataAttribute(
      this._element,
      "animation-target"
    );
    return t ? d.find(t)[0] : this._element;
  }
  _getConfig(t) {
    const e = c.getDataAttributes(this._animateElement);
    return t = {
      ...Zp,
      ...e,
      ...t
    }, L(Vr, t, qp), t;
  }
  _animateOnScroll() {
    const t = c.offset(this._animateElement).top, e = this._animateElement.offsetHeight, i = window.innerHeight, n = t + this._options.animationOffset <= i && t + this._options.animationOffset + e >= 0, o = this._animateElement.style.visibility === "visible";
    switch (!0) {
      case (n && this._isFirstScroll):
        this._isFirstScroll = !1, this._startAnimation();
        break;
      case (!n && this._isFirstScroll):
        this._isFirstScroll = !1, this._hideAnimateElement();
        break;
      case (n && !o && this._repeatAnimateOnScroll):
        this._options.animationOnScroll !== "repeat" && (this._repeatAnimateOnScroll = !1), this._callback(this._options.onShow), this._showAnimateElement(), this._startAnimation();
        break;
      case (!n && o && this._repeatAnimateOnScroll):
        this._hideAnimateElement(), this._clearAnimationClass(), this._callback(this._options.onHide);
        break;
    }
  }
  _addAnimatedClass() {
    c.addClass(
      this._animateElement,
      `animate-${this._options.animation}`
    );
  }
  _clearAnimationClass() {
    this._animateElement.classList.remove(`animate-${this._options.animation}`);
  }
  _startAnimation() {
    this._callback(this._options.onStart), this._addAnimatedClass(), this._options.animationRepeat && !this._options.animationInterval && this._setAnimationRepeat(), this._options.animationReverse && this._setAnimationReverse(), this._options.animationDelay && this._setAnimationDelay(), this._options.animationDuration && this._setAnimationDuration(), this._options.animationInterval && this._setAnimationInterval();
  }
  _setAnimationReverse() {
    c.style(this._animateElement, {
      animationIterationCount: this._options.animationRepeat === !0 ? "infinite" : "2",
      animationDirection: "alternate"
    });
  }
  _setAnimationDuration() {
    c.style(this._animateElement, {
      animationDuration: `${this._options.animationDuration}ms`
    });
  }
  _setAnimationDelay() {
    c.style(this._animateElement, {
      animationDelay: `${this._options.animationDelay}ms`
    });
  }
  _setAnimationRepeat() {
    c.style(this._animateElement, {
      animationIterationCount: this._options.animationRepeat === !0 ? "infinite" : this._options.animationRepeat
    });
  }
  _setAnimationInterval() {
    h.on(this._animateElement, "click", () => {
      this._clearAnimationClass(), setTimeout(() => {
        this._addAnimatedClass();
      }, this._options.animationInterval);
    });
  }
  _hideAnimateElement() {
    c.style(this._animateElement, { visibility: "hidden" });
  }
  _showAnimateElement() {
    c.style(this._animateElement, { visibility: "visible" });
  }
  _bindResetAnimationAfterFinish() {
    h.on(this._animateElement, "animationend", () => {
      this._clearAnimationClass();
    });
  }
  _bindTriggerOnEndCallback() {
    h.on(this._animateElement, "animationend", () => {
      this._callback(this._options.onEnd);
    });
  }
  _bindScrollEvents() {
    this._options.animationShowOnLoad || this._animateOnScroll(), h.on(window, "scroll", () => {
      this._animateOnScroll();
    });
  }
  _bindClickEvents() {
    h.on(this._element, "mousedown", () => {
      this._startAnimation();
    });
  }
  _bindHoverEvents() {
    h.one(this._element, "mouseover", () => {
      this._startAnimation();
    }), h.one(this._animateElement, "animationend", () => {
      setTimeout(() => {
        this._bindHoverEvents();
      }, 100);
    });
  }
  _callback(t) {
    t instanceof Function && t();
  }
  // Static
  static autoInit(t) {
    t._init();
  }
  static jQueryInterface(t) {
    new Jl(this[0], t).init();
  }
  static getInstance(t) {
    return I.getData(t, Cn);
  }
  static getOrCreateInstance(t, e = {}) {
    return this.getInstance(t) || new this(t, typeof e == "object" ? e : null);
  }
}
const An = "ripple", qi = "te.ripple", Qp = "rgba({{color}}, 0.2) 0, rgba({{color}}, 0.3) 40%, rgba({{color}}, 0.4) 50%, rgba({{color}}, 0.5) 60%, rgba({{color}}, 0) 70%", Jp = ["[data-te-ripple-init]"], Zi = [0, 0, 0], t_ = [
  { name: "primary", gradientColor: "#3B71CA" },
  { name: "secondary", gradientColor: "#9FA6B2" },
  { name: "success", gradientColor: "#14A44D" },
  { name: "danger", gradientColor: "#DC4C64" },
  { name: "warning", gradientColor: "#E4A11B" },
  { name: "info", gradientColor: "#54B4D3" },
  { name: "light", gradientColor: "#fbfbfb" },
  { name: "dark", gradientColor: "#262626" }
], Fr = 0.5, e_ = {
  rippleCentered: !1,
  rippleColor: "",
  rippleColorDark: "",
  rippleDuration: "500ms",
  rippleRadius: 0,
  rippleUnbound: !1
}, i_ = {
  rippleCentered: "boolean",
  rippleColor: "string",
  rippleColorDark: "string",
  rippleDuration: "string",
  rippleRadius: "number",
  rippleUnbound: "boolean"
}, s_ = {
  ripple: "relative overflow-hidden inline-block align-bottom",
  rippleWave: "rounded-[50%] opacity-50 pointer-events-none absolute touch-none scale-0 transition-[transform,_opacity] ease-[cubic-bezier(0,0,0.15,1),_cubic-bezier(0,0,0.15,1)] z-[999]",
  unbound: "overflow-visible"
}, n_ = {
  ripple: "string",
  rippleWave: "string",
  unbound: "string"
};
class Ue {
  constructor(t, e, i) {
    this._element = t, this._options = this._getConfig(e), this._classes = this._getClasses(i), this._element && (I.setData(t, qi, this), c.addClass(this._element, this._classes.ripple)), this._clickHandler = this._createRipple.bind(this), this._rippleTimer = null, this._isMinWidthSet = !1, this._initialClasses = null, this.init();
  }
  // Getters
  static get NAME() {
    return An;
  }
  // Public
  init() {
    this._addClickEvent(this._element);
  }
  dispose() {
    I.removeData(this._element, qi), h.off(this._element, "click", this._clickHandler), this._element = null, this._options = null;
  }
  // Private
  _autoInit(t) {
    Jp.forEach((e) => {
      d.closest(t.target, e) && (this._element = d.closest(t.target, e));
    }), this._element.style.minWidth || (c.style(this._element, {
      "min-width": getComputedStyle(this._element).width
    }), this._isMinWidthSet = !0), this._options = this._getConfig(), this._classes = this._getClasses(), this._initialClasses = [...this._element.classList], c.addClass(this._element, this._classes.ripple), this._createRipple(t);
  }
  _addClickEvent(t) {
    h.on(t, "mousedown", this._clickHandler);
  }
  _createRipple(t) {
    this._element.className.indexOf(this._classes.ripple) < 0 && c.addClass(this._element, this._classes.ripple);
    const { layerX: e, layerY: i } = t, n = t.offsetX || e, o = t.offsetY || i, r = this._element.offsetHeight, a = this._element.offsetWidth, l = this._durationToMsNumber(this._options.rippleDuration), p = {
      offsetX: this._options.rippleCentered ? r / 2 : n,
      offsetY: this._options.rippleCentered ? a / 2 : o,
      height: r,
      width: a
    }, u = this._getDiameter(p), f = this._options.rippleRadius || u / 2, _ = {
      delay: l * Fr,
      duration: l - l * Fr
    }, m = {
      left: this._options.rippleCentered ? `${a / 2 - f}px` : `${n - f}px`,
      top: this._options.rippleCentered ? `${r / 2 - f}px` : `${o - f}px`,
      height: `${this._options.rippleRadius * 2 || u}px`,
      width: `${this._options.rippleRadius * 2 || u}px`,
      transitionDelay: `0s, ${_.delay}ms`,
      transitionDuration: `${l}ms, ${_.duration}ms`
    }, g = D("div");
    this._createHTMLRipple({
      wrapper: this._element,
      ripple: g,
      styles: m
    }), this._removeHTMLRipple({ ripple: g, duration: l });
  }
  _createHTMLRipple({ wrapper: t, ripple: e, styles: i }) {
    Object.keys(i).forEach(
      (n) => e.style[n] = i[n]
    ), c.addClass(e, this._classes.rippleWave), e.setAttribute("data-te-ripple-ref", ""), this._addColor(e, t), this._toggleUnbound(t), this._appendRipple(e, t);
  }
  _removeHTMLRipple({ ripple: t, duration: e }) {
    this._rippleTimer && (clearTimeout(this._rippleTimer), this._rippleTimer = null), t && setTimeout(() => {
      t.classList.add("!opacity-0");
    }, 10), this._rippleTimer = setTimeout(() => {
      if (t && (t.remove(), this._element)) {
        d.find("[data-te-ripple-ref]", this._element).forEach(
          (n) => {
            n.remove();
          }
        ), this._isMinWidthSet && (c.style(this._element, { "min-width": "" }), this._isMinWidthSet = !1);
        const i = this._initialClasses ? this._addedNewRippleClasses(
          this._classes.ripple,
          this._initialClasses
        ) : this._classes.ripple.split(" ");
        c.removeClass(this._element, i);
      }
    }, e);
  }
  _addedNewRippleClasses(t, e) {
    return t.split(" ").filter(
      (i) => e.findIndex((n) => i === n) === -1
    );
  }
  _durationToMsNumber(t) {
    return Number(t.replace("ms", "").replace("s", "000"));
  }
  _getConfig(t = {}) {
    const e = c.getDataAttributes(this._element);
    return t = {
      ...e_,
      ...e,
      ...t
    }, L(An, t, i_), t;
  }
  _getClasses(t = {}) {
    const e = c.getDataClassAttributes(this._element);
    return t = {
      ...s_,
      ...e,
      ...t
    }, L(An, t, n_), t;
  }
  _getDiameter({ offsetX: t, offsetY: e, height: i, width: n }) {
    const o = e <= i / 2, r = t <= n / 2, a = (_, m) => Math.sqrt(_ ** 2 + m ** 2), l = e === i / 2 && t === n / 2, p = {
      first: o === !0 && r === !1,
      second: o === !0 && r === !0,
      third: o === !1 && r === !0,
      fourth: o === !1 && r === !1
    }, u = {
      topLeft: a(t, e),
      topRight: a(n - t, e),
      bottomLeft: a(t, i - e),
      bottomRight: a(n - t, i - e)
    };
    let f = 0;
    return l || p.fourth ? f = u.topLeft : p.third ? f = u.topRight : p.second ? f = u.bottomRight : p.first && (f = u.bottomLeft), f * 2;
  }
  _appendRipple(t, e) {
    e.appendChild(t), setTimeout(() => {
      c.addClass(t, "opacity-0 scale-100");
    }, 50);
  }
  _toggleUnbound(t) {
    this._options.rippleUnbound === !0 ? c.addClass(t, this._classes.unbound) : c.removeClass(t, this._classes.unbound);
  }
  _addColor(t) {
    let e = this._options.rippleColor || "rgb(0,0,0)";
    (localStorage.theme === "dark" || !("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches) && (e = this._options.rippleColorDark || this._options.rippleColor);
    const i = t_.find(
      (r) => r.name === e.toLowerCase()
    ), n = i ? this._colorToRGB(i.gradientColor).join(",") : this._colorToRGB(e).join(","), o = Qp.split("{{color}}").join(`${n}`);
    t.style.backgroundImage = `radial-gradient(circle, ${o})`;
  }
  _colorToRGB(t) {
    function e(o) {
      return o.length < 7 && (o = `#${o[1]}${o[1]}${o[2]}${o[2]}${o[3]}${o[3]}`), [
        parseInt(o.substr(1, 2), 16),
        parseInt(o.substr(3, 2), 16),
        parseInt(o.substr(5, 2), 16)
      ];
    }
    function i(o) {
      const r = document.body.appendChild(
        document.createElement("fictum")
      ), a = "rgb(1, 2, 3)";
      return r.style.color = a, r.style.color !== a || (r.style.color = o, r.style.color === a || r.style.color === "") ? Zi : (o = getComputedStyle(r).color, document.body.removeChild(r), o);
    }
    function n(o) {
      return o = o.match(/[.\d]+/g).map((r) => +Number(r)), o.length = 3, o;
    }
    return t.toLowerCase() === "transparent" ? Zi : t[0] === "#" ? e(t) : (t.indexOf("rgb") === -1 && (t = i(t)), t.indexOf("rgb") === 0 ? n(t) : Zi);
  }
  // Static
  static autoInitial(t) {
    return function(e) {
      t._autoInit(e);
    };
  }
  static jQueryInterface(t) {
    return this.each(function() {
      return I.getData(this, qi) ? null : new Ue(this, t);
    });
  }
  static getInstance(t) {
    return I.getData(t, qi);
  }
  static getOrCreateInstance(t, e = {}) {
    return this.getInstance(t) || new this(t, typeof e == "object" ? e : null);
  }
}
function Z(s) {
  return s.getDate();
}
function Cs(s) {
  return s.getDay();
}
function Y(s) {
  return s.getMonth();
}
function B(s) {
  return s.getFullYear();
}
function o_(s, t, e) {
  const i = e.startDay, n = i > 0 ? 7 - i : 0, r = new Date(s, t).getDay() + n;
  return r >= 7 ? r - 7 : r;
}
function ro(s) {
  return r_(s).getDate();
}
function r_(s) {
  return Mt(s.getFullYear(), s.getMonth() + 1, 0);
}
function Re() {
  return /* @__PURE__ */ new Date();
}
function it(s, t) {
  return nt(s, t * 12);
}
function nt(s, t) {
  const e = Mt(
    s.getFullYear(),
    s.getMonth() + t,
    s.getDate()
  ), i = Z(s), n = Z(e);
  return i !== n && e.setDate(0), e;
}
function xe(s, t) {
  return Mt(s.getFullYear(), s.getMonth(), s.getDate() + t);
}
function Mt(s, t, e) {
  const i = new Date(s, t, e);
  return s >= 0 && s < 100 && i.setFullYear(i.getFullYear() - 1900), i;
}
function Yr(s) {
  const t = s.split("-"), e = t[0], i = t[1], n = t[2];
  return Mt(e, i, n);
}
function a_(s) {
  return !Number.isNaN(s.getTime());
}
function Me(s, t) {
  return B(s) - B(t) || Y(s) - Y(t) || Z(s) - Z(t);
}
function _e(s, t) {
  return s.setHours(0, 0, 0, 0), t.setHours(0, 0, 0, 0), s.getTime() === t.getTime();
}
function As(s, t) {
  const i = B(s) - c_();
  return l_(i, t);
}
function l_(s, t) {
  return (s % t + t) % t;
}
function c_(s, t, e) {
  let i = 0;
  return e ? i = B(e) - s + 1 : t && (i = B(t)), i;
}
function Ps(s, t, e, i, n, o) {
  const r = /* @__PURE__ */ new Date();
  r.setHours(0, 0, 0, 0);
  const a = t && Me(s, t) <= -1, l = e && Me(s, e) >= 1, p = n && Me(s, r) <= -1, u = o && Me(s, r) >= 1, f = i && i(s) === !1;
  return a || l || f || p || u;
}
function tc(s, t, e, i, n, o) {
  const r = /* @__PURE__ */ new Date(), a = i && B(i), l = i && Y(i), p = e && B(e), u = e && Y(e), f = B(r), _ = Y(r), m = l && a && (t > a || t === a && s > l), g = u && p && (t < p || t === p && s < u), v = n && (t < f || t === f && s < _), b = o && (t > f || t === f && s > _);
  return m || g || v || b;
}
function ao(s, t, e, i, n) {
  const o = t && B(t), r = e && B(e), a = B(/* @__PURE__ */ new Date()), l = r && s > r, p = o && s < o, u = i && s < a, f = n && s > a;
  return l || p || u || f;
}
function h_(s, t, e, i, n, o, r, a) {
  const l = /* @__PURE__ */ new Date();
  return l.setHours(0, 0, 0, 0), (s && o && Me(o, l) < 0 || s) && (o = l), o && Ai(
    t,
    o,
    e,
    i,
    n,
    o,
    r,
    a
  );
}
function d_(s, t, e, i, n, o, r, a) {
  const l = /* @__PURE__ */ new Date();
  return l.setHours(0, 0, 0, 0), (s && n && Me(n, l) < 0 || s) && (n = l), n && Ai(
    t,
    n,
    e,
    i,
    n,
    o,
    r,
    a
  );
}
function Ai(s, t, e, i, n, o, r, a) {
  return e === "days" ? B(s) === B(t) && Y(s) === Y(t) : e === "months" ? B(s) === B(t) : e === "years" ? B(t) >= a && B(t) <= r : !1;
}
const u_ = "data-te-datepicker-modal-container-ref", p_ = "data-te-datepicker-dropdown-container-ref", __ = "data-te-dropdown-backdrop-ref", f_ = "data-te-datepicker-date-text-ref", jr = "data-te-datepicker-view-ref", m_ = "data-te-datepicker-previous-button-ref", g_ = "data-te-datepicker-next-button-ref", b_ = "data-te-datepicker-ok-button-ref", v_ = "data-te-datepicker-cancel-button-ref", T_ = "data-te-datepicker-clear-button-ref", E_ = "data-te-datepicker-view-change-button-ref";
function C_(s, t, e, i, n, o, r, a, l, p) {
  const u = Y(s), f = B(s), _ = Z(s), m = Cs(s), g = D("div"), v = `
        ${Kr(
    s,
    u,
    f,
    t,
    e,
    i,
    n,
    o,
    r,
    a,
    p
  )}
    `, b = `
      ${y_(_, m, u, n, p)}
      ${Kr(
    s,
    u,
    f,
    t,
    e,
    i,
    n,
    o,
    r,
    a,
    p
  )}
    `;
  return n.inline ? (c.addClass(g, p.datepickerDropdownContainer), g.setAttribute(p_, l), g.innerHTML = v) : (c.addClass(g, p.modalContainer), g.setAttribute(u_, l), g.innerHTML = b), g;
}
function A_(s) {
  const t = D("div");
  return c.addClass(t, s), t.setAttribute(__, ""), t;
}
function y_(s, t, e, i, n) {
  return `
      <div class="${n.datepickerHeader}">
        <div class="${n.datepickerTitle}">
          <span class="${n.datepickerTitleText}">${i.title}</span>
        </div>
        <div class="${n.datepickerDate}">
          <span class="${n.datepickerDateText}" ${f_} >${i.weekdaysShort[t]}, ${i.monthsShort[e]} ${s}</span>
        </div>
      </div>
    `;
}
function Kr(s, t, e, i, n, o, r, a, l, p, u) {
  let f;
  return r.inline ? f = `
    <div class="${u.datepickerMain}">
      ${Ur(t, e, r, u)}
      <div class="${u.datepickerView}" ${jr} tabindex="0">
        ${zr(
    s,
    e,
    i,
    n,
    o,
    r,
    a,
    l,
    p,
    u
  )}
      </div>
    </div>
  ` : f = `
    <div class="${u.datepickerMain}">
      ${Ur(t, e, r, u)}
      <div class="${u.datepickerView}" ${jr} tabindex="0">
        ${zr(
    s,
    e,
    i,
    n,
    o,
    r,
    a,
    l,
    p,
    u
  )}
      </div>
      ${w_(r, u)}
    </div>
  `, f;
}
function zr(s, t, e, i, n, o, r, a, l, p) {
  let u;
  return o.view === "days" ? u = ys(s, e, o, p) : o.view === "months" ? u = ws(
    t,
    i,
    n,
    o,
    r,
    p
  ) : u = xs(
    s,
    i,
    o,
    a,
    l,
    p
  ), u;
}
function Ur(s, t, e, i) {
  return `
    <div class="${i.datepickerDateControls}">
      <button class="${i.datepickerViewChangeButton}" aria-label="${e.switchToMultiYearViewLabel}" ${E_}>
        ${e.monthsFull[s]} ${t} ${Dt(
    e,
    i
  )}
      </button>
      <div class="${i.datepickerArrowControls}">
        <button class="${i.datepickerPreviousButton}" aria-label="${e.prevMonthLabel}" ${m_}>${e.changeMonthIconTemplate}</button>
        <button class="${i.datepickerNextButton}" aria-label="${e.nextMonthLabel}" ${g_}>${e.changeMonthIconTemplate}</button>
      </div>
    </div>
    `;
}
function Dt(s, t) {
  return `
  <span class="${t.datepickerViewChangeIcon}">
  ${s.viewChangeIconTemplate}
  </span>
  `;
}
function w_(s, t) {
  const e = `<button class="${t.datepickerFooterBtn}" aria-label="${s.okBtnLabel}" ${b_}>${s.okBtnText}</button>`, i = `<button class="${t.datepickerFooterBtn}" aria-label="${s.cancelBtnLabel}" ${v_}>${s.cancelBtnText}</button>`, n = `<button class="${t.datepickerFooterBtn} ${t.datepickerClearBtn}" aria-label="${s.clearBtnLabel}" ${T_}>${s.clearBtnText}</button>`;
  return `
        <div class="${t.datepickerFooter}">
          
        ${s.removeClearBtn ? "" : n}
        ${s.removeCancelBtn ? "" : i}
        ${s.removeOkBtn ? "" : e}
        </div>
      `;
}
function ys(s, t, e, i) {
  const n = x_(s, t, e), r = `
      <tr>
        ${e.weekdaysNarrow.map((l, p) => `<th class="${i.datepickerDayHeading}" scope="col" aria-label="${e.weekdaysFull[p]}">${l}</th>`).join("")}
      </tr>
    `, a = n.map((l) => `
        <tr>
          ${l.map((p) => `
              <td
              class="${i.datepickerCell} ${i.datepickerCellSmall}"
              data-te-date="${B(p.date)}-${Y(
    p.date
  )}-${Z(p.date)}"
              aria-label="${p.date}"
              aria-selected="${p.isSelected}"
              ${p.isSelected ? "data-te-datepicker-cell-selected" : ""}
              ${!p.currentMonth || p.disabled ? "data-te-datepicker-cell-disabled" : ""}
              ${p.isToday ? "data-te-datepicker-cell-current" : ""}
              >
                <div
                  class="${i.datepickerCellContent} ${i.datepickerCellContentSmall}"
                  style="${p.currentMonth ? "display: block" : "display: none"}"
                  >
                  ${p.dayNumber}
                  </div>
              </td>
            `).join("")}
        </tr>
      `).join("");
  return `
      <table class="${i.datepickerTable}">
        <thead>
          ${r}
        </thead>
        <tbody>
         ${a}
        </tbody>
      </table>
    `;
}
function x_(s, t, e) {
  const i = [], n = Y(s), o = Y(nt(s, -1)), r = Y(nt(s, 1)), a = B(s), l = o_(a, n, e), p = ro(s), u = ro(nt(s, -1)), f = 7;
  let _ = 1, m = !1;
  for (let g = 1; g < f; g++) {
    const v = [];
    if (g === 1) {
      const b = u - l + 1;
      for (let y = b; y <= u; y++) {
        const E = Mt(a, o, y);
        v.push({
          date: E,
          currentMonth: m,
          isSelected: t && _e(E, t),
          isToday: _e(E, Re()),
          dayNumber: Z(E)
        });
      }
      m = !0;
      const C = f - v.length;
      for (let y = 0; y < C; y++) {
        const E = Mt(a, n, _);
        v.push({
          date: E,
          currentMonth: m,
          isSelected: t && _e(E, t),
          isToday: _e(E, Re()),
          dayNumber: Z(E),
          disabled: Ps(
            E,
            e.min,
            e.max,
            e.filter,
            e.disablePast,
            e.disableFuture
          )
        }), _++;
      }
    } else
      for (let b = 1; b < 8; b++) {
        _ > p && (_ = 1, m = !1);
        const C = Mt(
          a,
          m ? n : r,
          _
        );
        v.push({
          date: C,
          currentMonth: m,
          isSelected: t && _e(C, t),
          isToday: _e(C, Re()),
          dayNumber: Z(C),
          disabled: Ps(
            C,
            e.min,
            e.max,
            e.filter,
            e.disablePast,
            e.disableFuture
          )
        }), _++;
      }
    i.push(v);
  }
  return i;
}
function ws(s, t, e, i, n, o) {
  const r = k_(i, n), a = Y(Re()), l = B(Re()), p = `
      ${r.map((u) => `
          <tr>
            ${u.map((f) => {
    const _ = i.monthsShort.indexOf(f);
    return `
                <td class="${o.datepickerCell} ${o.datepickerCellLarge}"
                ${tc(
      _,
      s,
      i.min,
      i.max,
      i.disablePast,
      i.disableFuture
    ) ? "data-te-datepicker-cell-disabled" : ""}
                
                data-te-month="${_}" data-te-year="${s}" aria-label="${f}, ${s}"
                ${_ === e && s === t ? "data-te-datepicker-cell-selected" : ""}
                ${_ === a && s === l ? "data-te-datepicker-cell-current" : ""}" data-te-month="${_}" data-te-year="${s}" aria-label="${f}, ${s}">
                  <div class="${o.datepickerCellContent} ${o.datepickerCellContentLarge}">${f}</div>
                </td>
              `;
  }).join("")}
          </tr>
        `).join("")}
    `;
  return `
      <table class="${o.datepickerTable}">
        <tbody>
         ${p}
        </tbody>
      </table>
    `;
}
function k_(s, t) {
  const e = [];
  let i = [];
  for (let n = 0; n < s.monthsShort.length; n++)
    if (i.push(s.monthsShort[n]), i.length === t) {
      const o = i;
      e.push(o), i = [];
    }
  return e;
}
function xs(s, t, e, i, n, o) {
  const r = O_(s, i, n), a = B(Re()), l = `
    ${r.map((p) => `
        <tr>
          ${p.map((u) => `
              <td class="${o.datepickerCell} ${o.datepickerCellLarge}"  aria-label="${u}" data-te-year="${u}"
              ${ao(
    u,
    e.min,
    e.max,
    e.disablePast,
    e.disableFuture
  ) ? "data-te-datepicker-cell-disabled" : ""}
              ${u === t ? "data-te-datepicker-cell-selected" : ""}
              ${u === a ? "data-te-datepicker-cell-current" : ""}
              >
                <div class="${o.datepickerCellContent} ${o.datepickerCellContentLarge}">${u}</div>
              </td>
            `).join("")}
        </tr>
      `).join("")}
  `;
  return `
      <table class="${o.datepickerTable}">
        <tbody>
        ${l}
        </tbody>
      </table>
    `;
}
function O_(s, t, e) {
  const i = [], n = B(s), o = As(s, t), r = n - o;
  let a = [];
  for (let l = 0; l < t; l++)
    if (a.push(r + l), a.length === e) {
      const p = a;
      i.push(p), a = [];
    }
  return i;
}
function S_(s, t) {
  return `
    <button id="${s}" type="button" class="${t}" data-te-datepicker-toggle-button-ref data-te-datepicker-toggle-ref>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clip-rule="evenodd" />
      </svg>  
    </button>
  `;
}
const Pe = 37, rt = 38, Be = 39, z = 40, He = 36, We = 35, yn = 33, wn = 34, lt = 13, ks = 32, Li = 27, Oi = 9, I_ = 8, D_ = 46, gt = 24, Qi = 4, Ji = 4, xn = "datepicker", Os = "te.datepicker", Ys = `.${Os}`, $_ = ".data-api", L_ = `close${Ys}`, M_ = `open${Ys}`, N_ = `dateChange${Ys}`, ts = `click${Ys}${$_}`, ec = "data-te-datepicker-modal-container-ref", ic = "data-te-datepicker-dropdown-container-ref", es = "[data-te-datepicker-toggle-ref]", R_ = `[${ec}]`, P_ = `[${ic}]`, B_ = "[data-te-datepicker-view-change-button-ref]", H_ = "[data-te-datepicker-previous-button-ref]", W_ = "[data-te-datepicker-next-button-ref]", V_ = "[data-te-datepicker-ok-button-ref]", F_ = "[data-te-datepicker-cancel-button-ref]", Y_ = "[data-te-datepicker-clear-button-ref]", j_ = "[data-te-datepicker-view-ref]", K_ = "[data-te-datepicker-toggle-button-ref]", z_ = "[data-te-datepicker-date-text-ref]", U_ = "[data-te-dropdown-backdrop-ref]", X_ = "animate-[fade-in_0.3s_both] px-[auto] motion-reduce:transition-none motion-reduce:animate-none", G_ = "animate-[fade-out_0.3s_both] px-[auto] motion-reduce:transition-none motion-reduce:animate-none", q_ = "animate-[fade-in_0.15s_both] px-[auto] motion-reduce:transition-none motion-reduce:animate-none", Z_ = "animate-[fade-out_0.15s_both] px-[auto] motion-reduce:transition-none motion-reduce:animate-none", Q_ = "flex flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[328px] h-[512px] bg-white rounded-[0.6rem] shadow-lg z-[1066] xs:max-md:landscape:w-[475px] xs:max-md:landscape:h-[360px] xs:max-md:landscape:flex-row dark:bg-zinc-700", J_ = "w-full h-full fixed top-0 right-0 left-0 bottom-0 bg-black/40 z-[1065]", tf = "relative h-full", ef = "xs:max-md:landscape:h-full h-[120px] px-6 bg-primary flex flex-col rounded-t-lg dark:bg-zinc-800", sf = "h-8 flex flex-col justify-end", nf = "text-[10px] font-normal uppercase tracking-[1.7px] text-white", of = "xs:max-md:landscape:mt-24 h-[72px] flex flex-col justify-end", rf = "text-[34px] font-normal text-white", af = "outline-none px-3", lf = "px-3 pt-2.5 pb-0 flex justify-between text-black/[64]", cf = "flex items-center outline-none p-2.5 text-neutral-500 font-medium text-[0.9rem] rounded-xl shadow-none bg-transparent m-0 border-none hover:bg-neutral-200 focus:bg-neutral-200  dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10", hf = "mt-2.5", df = "p-0 w-10 h-10 leading-10 border-none outline-none m-0 text-gray-600 bg-transparent mr-6 hover:bg-neutral-200 hover:rounded-[50%] focus:bg-neutral-200 focus:rounded-[50%] dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10 [&>svg]:w-4 [&>svg]:h-4 [&>svg]:mx-auto", uf = "p-0 w-10 h-10 leading-10 border-none outline-none m-0 text-gray-600 bg-transparent hover:bg-neutral-200 hover:rounded-[50%] focus:bg-neutral-200 focus:rounded-[50%] dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10 [&>svg]:w-4 [&>svg]:h-4 [&>svg]:rotate-180 [&>svg]:mx-auto", pf = "h-14 flex absolute w-full bottom-0 justify-end items-center px-3", _f = "outline-none bg-white text-primary border-none cursor-pointer py-0 px-2.5 uppercase text-[0.8rem] leading-10 font-medium h-10 tracking-[.1rem] rounded-[10px] mb-2.5 hover:bg-neutral-200 focus:bg-neutral-200 dark:bg-transparent dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10", ff = "mr-auto", mf = "w-10 h-10 text-center text-[12px] font-normal dark:text-white", gf = "text-center data-[te-datepicker-cell-disabled]:text-neutral-300 data-[te-datepicker-cell-disabled]:cursor-default data-[te-datepicker-cell-disabled]:pointer-events-none data-[te-datepicker-cell-disabled]:hover:cursor-default hover:cursor-pointer group", bf = "w-10 h-10 xs:max-md:landscape:w-8 xs:max-md:landscape:h-8", vf = "w-[76px] h-[42px]", Tf = "mx-auto group-[:not([data-te-datepicker-cell-disabled]):not([data-te-datepicker-cell-selected]):hover]:bg-neutral-300 group-[[data-te-datepicker-cell-selected]]:bg-primary group-[[data-te-datepicker-cell-selected]]:text-white group-[:not([data-te-datepicker-cell-selected])[data-te-datepicker-cell-focused]]:bg-neutral-100 group-[[data-te-datepicker-cell-focused]]:data-[te-datepicker-cell-selected]:bg-primary group-[[data-te-datepicker-cell-current]]:border-solid group-[[data-te-datepicker-cell-current]]:border-black group-[[data-te-datepicker-cell-current]]:border dark:group-[:not([data-te-datepicker-cell-disabled]):not([data-te-datepicker-cell-selected]):hover]:bg-white/10 dark:group-[[data-te-datepicker-cell-current]]:border-white dark:text-white dark:group-[:not([data-te-datepicker-cell-selected])[data-te-datepicker-cell-focused]]:bg-white/10 dark:group-[[data-te-datepicker-cell-disabled]]:text-neutral-500", Ef = "w-9 h-9 leading-9 rounded-[50%] text-[13px]", Cf = "w-[72px] h-10 leading-10 py-[1px] px-0.5 rounded-[999px]", Af = "mx-auto w-[304px]", yf = "flex items-center justify-content-center [&>svg]:w-5 [&>svg]:h-5 absolute outline-none border-none bg-transparent right-0.5 top-1/2 -translate-x-1/2 -translate-y-1/2 hover:text-primary focus:text-primary dark:hover:text-primary-400 dark:focus:text-primary-400 dark:text-neutral-200", wf = "inline-block pointer-events-none ml-[3px] [&>svg]:w-4 [&>svg]:h-4 [&>svg]:fill-neutral-500 dark:[&>svg]:fill-white", xf = "w-[328px] h-[380px] bg-white rounded-lg shadow-[0px_2px_15px_-3px_rgba(0,0,0,.07),_0px_10px_20px_-2px_rgba(0,0,0,.04)] z-[1066] dark:bg-zinc-700", kf = {
  title: "Select date",
  container: "body",
  disablePast: !1,
  disableFuture: !1,
  monthsFull: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ],
  monthsShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],
  weekdaysFull: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ],
  weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  weekdaysNarrow: ["S", "M", "T", "W", "T", "F", "S"],
  okBtnText: "Ok",
  clearBtnText: "Clear",
  cancelBtnText: "Cancel",
  okBtnLabel: "Confirm selection",
  clearBtnLabel: "Clear selection",
  cancelBtnLabel: "Cancel selection",
  nextMonthLabel: "Next month",
  prevMonthLabel: "Previous month",
  nextYearLabel: "Next year",
  prevYearLabel: "Previous year",
  changeMonthIconTemplate: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
  `,
  nextMultiYearLabel: "Next 24 years",
  prevMultiYearLabel: "Previous 24 years",
  switchToMultiYearViewLabel: "Choose year and month",
  switchToMonthViewLabel: "Choose date",
  switchToDayViewLabel: "Choose date",
  startDate: null,
  startDay: 0,
  format: "dd/mm/yyyy",
  view: "days",
  viewChangeIconTemplate: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="0" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
  `,
  min: null,
  max: null,
  filter: null,
  inline: !1,
  toggleButton: !0,
  disableToggleButton: !1,
  disableInput: !1,
  animations: !0,
  confirmDateOnSelect: !1,
  removeOkBtn: !1,
  removeCancelBtn: !1,
  removeClearBtn: !1
}, Of = {
  title: "string",
  container: "string",
  disablePast: "boolean",
  disableFuture: "boolean",
  monthsFull: "array",
  monthsShort: "array",
  weekdaysFull: "array",
  weekdaysShort: "array",
  weekdaysNarrow: "array",
  okBtnText: "string",
  clearBtnText: "string",
  cancelBtnText: "string",
  okBtnLabel: "string",
  clearBtnLabel: "string",
  cancelBtnLabel: "string",
  nextMonthLabel: "string",
  prevMonthLabel: "string",
  nextYearLabel: "string",
  prevYearLabel: "string",
  nextMultiYearLabel: "string",
  prevMultiYearLabel: "string",
  changeMonthIconTemplate: "string",
  switchToMultiYearViewLabel: "string",
  switchToMonthViewLabel: "string",
  switchToDayViewLabel: "string",
  startDate: "(null|string|date)",
  startDay: "number",
  format: "string",
  view: "string",
  viewChangeIconTemplate: "string",
  min: "(null|string|date)",
  max: "(null|string|date)",
  filter: "(null|function)",
  inline: "boolean",
  toggleButton: "boolean",
  disableToggleButton: "boolean",
  disableInput: "boolean",
  animations: "boolean",
  confirmDateOnSelect: "boolean",
  removeOkBtn: "boolean",
  removeCancelBtn: "boolean",
  removeClearBtn: "boolean"
}, Sf = {
  fadeIn: X_,
  fadeOut: G_,
  fadeInShort: q_,
  fadeOutShort: Z_,
  modalContainer: Q_,
  datepickerBackdrop: J_,
  datepickerMain: tf,
  datepickerHeader: ef,
  datepickerTitle: sf,
  datepickerTitleText: nf,
  datepickerDate: of,
  datepickerDateText: rf,
  datepickerView: af,
  datepickerDateControls: lf,
  datepickerViewChangeButton: cf,
  datepickerViewChangeIcon: wf,
  datepickerArrowControls: hf,
  datepickerPreviousButton: df,
  datepickerNextButton: uf,
  datepickerFooter: pf,
  datepickerFooterBtn: _f,
  datepickerClearBtn: ff,
  datepickerDayHeading: mf,
  datepickerCell: gf,
  datepickerCellSmall: bf,
  datepickerCellLarge: vf,
  datepickerCellContent: Tf,
  datepickerCellContentSmall: Ef,
  datepickerCellContentLarge: Cf,
  datepickerTable: Af,
  datepickerToggleButton: yf,
  datepickerDropdownContainer: xf
}, If = {
  fadeIn: "string",
  fadeOut: "string",
  fadeInShort: "string",
  fadeOutShort: "string",
  modalContainer: "string",
  datepickerBackdrop: "string",
  datepickerMain: "string",
  datepickerHeader: "string",
  datepickerTitle: "string",
  datepickerTitleText: "string",
  datepickerDate: "string",
  datepickerDateText: "string",
  datepickerView: "string",
  datepickerDateControls: "string",
  datepickerViewChangeButton: "string",
  datepickerArrowControls: "string",
  datepickerPreviousButton: "string",
  datepickerNextButton: "string",
  datepickerFooter: "string",
  datepickerFooterBtn: "string",
  datepickerClearBtn: "string",
  datepickerDayHeading: "string",
  datepickerCell: "string",
  datepickerCellSmall: "string",
  datepickerCellLarge: "string",
  datepickerCellContent: "string",
  datepickerCellContentSmall: "string",
  datepickerCellContentLarge: "string",
  datepickerTable: "string",
  datepickerToggleButton: "string",
  datepickerDropdownContainer: "string"
};
class F0 {
  constructor(t, e, i) {
    this._element = t, this._input = d.findOne("input", this._element), this._options = this._getConfig(e), this._classes = this._getClasses(i), this._activeDate = /* @__PURE__ */ new Date(), this._selectedDate = null, this._selectedYear = null, this._selectedMonth = null, this._headerDate = null, this._headerYear = null, this._headerMonth = null, this._view = this._options.view, this._popper = null, this._focusTrap = null, this._isOpen = !1, this._toggleButtonId = bt("datepicker-toggle-"), this._animations = !window.matchMedia("(prefers-reduced-motion: reduce)").matches && this._options.animations, this._scrollBar = new ki(), this._element && I.setData(t, Os, this), this._init(), this.toggleButton && this._options.disableToggle && (this.toggleButton.disabled = "true"), this._options.disableInput && (this._input.disabled = "true");
  }
  // Getters
  static get NAME() {
    return xn;
  }
  get container() {
    return d.findOne(
      `[${ec}='${this._toggleButtonId}']`
    ) || d.findOne(
      `[${ic}='${this._toggleButtonId}']`
    );
  }
  get options() {
    return this._options;
  }
  get activeCell() {
    let t;
    return this._view === "days" && (t = this._getActiveDayCell()), this._view === "months" && (t = this._getActiveMonthCell()), this._view === "years" && (t = this._getActiveYearCell()), t;
  }
  get activeDay() {
    return Z(this._activeDate);
  }
  get activeMonth() {
    return Y(this._activeDate);
  }
  get activeYear() {
    return B(this._activeDate);
  }
  get firstYearInView() {
    return this.activeYear - As(this._activeDate, gt);
  }
  get lastYearInView() {
    return this.firstYearInView + gt - 1;
  }
  get viewChangeButton() {
    return d.findOne(B_, this.container);
  }
  get previousButton() {
    return d.findOne(H_, this.container);
  }
  get nextButton() {
    return d.findOne(W_, this.container);
  }
  get okButton() {
    return d.findOne(V_, this.container);
  }
  get cancelButton() {
    return d.findOne(F_, this.container);
  }
  get clearButton() {
    return d.findOne(Y_, this.container);
  }
  get datesContainer() {
    return d.findOne(j_, this.container);
  }
  get toggleButton() {
    return d.findOne(K_, this._element);
  }
  update(t = {}) {
    this._options = this._getConfig({ ...this._options, ...t });
  }
  _getConfig(t) {
    const e = c.getDataAttributes(this._element);
    if (t = {
      ...kf,
      ...e,
      ...t
    }, L(xn, t, Of), t.max && typeof t.max == "string" && (t.max = new Date(t.max)), t.min && typeof t.min == "string" && (t.min = new Date(t.min)), t.startDay && t.startDay !== 0) {
      const i = this._getNewDaysOrderArray(t);
      t.weekdaysNarrow = i;
    }
    return t;
  }
  _getClasses(t) {
    const e = c.getDataClassAttributes(this._element);
    return t = {
      ...Sf,
      ...e,
      ...t
    }, L(xn, t, If), t;
  }
  _getContainer() {
    return d.findOne(this._options.container);
  }
  _getNewDaysOrderArray(t) {
    const e = t.startDay, i = t.weekdaysNarrow;
    return i.slice(e).concat(i.slice(0, e));
  }
  _init() {
    !this.toggleButton && this._options.toggleButton && (this._appendToggleButton(), (this._input.readOnly || this._input.disabled) && (this.toggleButton.style.pointerEvents = "none")), this._listenToUserInput(), this._listenToToggleClick(), this._listenToToggleKeydown();
  }
  _appendToggleButton() {
    const t = S_(
      this._toggleButtonId,
      this._classes.datepickerToggleButton
    );
    this._element.insertAdjacentHTML("beforeend", t);
  }
  open() {
    if (this._input.readOnly || this._input.disabled)
      return;
    const t = h.trigger(this._element, M_);
    if (this._isOpen || t.defaultPrevented)
      return;
    this._setInitialDate();
    const e = A_(this._classes.datepickerBackdrop), i = C_(
      this._activeDate,
      this._selectedDate,
      this._selectedYear,
      this._selectedMonth,
      this._options,
      Ji,
      gt,
      Qi,
      this._toggleButtonId,
      this._classes
    );
    this._options.inline ? this._openDropdown(i) : (this._openModal(e, i), this._scrollBar.hide()), this._animations && (c.addClass(this.container, this._classes.fadeIn), c.addClass(e, this._classes.fadeInShort)), this._setFocusTrap(this.container), this._listenToDateSelection(), this._addControlsListeners(), this._updateControlsDisabledState(), this._listenToEscapeClick(), this._listenToKeyboardNavigation(), this._listenToDatesContainerFocus(), this._listenToDatesContainerBlur(), this._asyncFocusDatesContainer(), this._updateViewControlsAndAttributes(this._view), this._isOpen = !0, setTimeout(() => {
      this._listenToOutsideClick();
    }, 0);
  }
  _openDropdown(t) {
    this._popper = Ee(this._input, t, {
      placement: "bottom-start"
    }), this._getContainer().appendChild(t);
  }
  _openModal(t, e) {
    const i = this._getContainer();
    i.appendChild(t), i.appendChild(e);
  }
  _setFocusTrap(t) {
    this._focusTrap = new $i(t, {
      event: "keydown",
      condition: (e) => e.key === "Tab"
    }), this._focusTrap.trap();
  }
  _listenToUserInput() {
    h.on(this._input, "input", (t) => {
      this._handleUserInput(t.target.value);
    });
  }
  _listenToToggleClick() {
    h.on(
      this._element,
      ts,
      es,
      (t) => {
        t.preventDefault(), this.open();
      }
    );
  }
  _listenToToggleKeydown() {
    h.on(
      this._element,
      "keydown",
      es,
      (t) => {
        t.keyCode === lt && !this._isOpen && this.open();
      }
    );
  }
  _listenToDateSelection() {
    h.on(this.datesContainer, "click", (t) => {
      this._handleDateSelection(t);
    });
  }
  _handleDateSelection(t) {
    const e = t.target.nodeName === "DIV" ? t.target.parentNode.dataset : t.target.dataset, i = t.target.nodeName === "DIV" ? t.target.parentNode : t.target;
    if (e.teDate && this._pickDay(e.teDate, i), e.teMonth && e.teYear) {
      const n = parseInt(e.teMonth, 10), o = parseInt(e.teYear, 10);
      this._pickMonth(n, o);
    }
    if (e.teYear && !e.teMonth) {
      const n = parseInt(e.teYear, 10);
      this._pickYear(n);
    }
    this._options.inline || this._updateHeaderDate(
      this._activeDate,
      this._options.monthsShort,
      this._options.weekdaysShort
    );
  }
  _updateHeaderDate(t, e, i) {
    const n = d.findOne(
      z_,
      this.container
    ), o = Y(t), r = Z(t), a = Cs(t);
    n.innerHTML = `${i[a]}, ${e[o]} ${r}`;
  }
  _addControlsListeners() {
    h.on(this.nextButton, "click", () => {
      this._view === "days" ? this.nextMonth() : this._view === "years" ? this.nextYears() : this.nextYear(), this._updateControlsDisabledState();
    }), h.on(this.previousButton, "click", () => {
      this._view === "days" ? this.previousMonth() : this._view === "years" ? this.previousYears() : this.previousYear(), this._updateControlsDisabledState();
    }), h.on(this.viewChangeButton, "click", () => {
      this._view === "days" ? this._changeView("years") : (this._view === "years" || this._view === "months") && this._changeView("days");
    }), this._options.inline || this._listenToFooterButtonsClick();
  }
  _listenToFooterButtonsClick() {
    h.on(this.okButton, "click", () => this.handleOk()), h.on(this.cancelButton, "click", () => this.handleCancel()), h.on(this.clearButton, "click", () => this.handleClear());
  }
  _listenToOutsideClick() {
    h.on(document, ts, (t) => {
      const e = t.target === this.container, i = this.container && this.container.contains(t.target);
      !e && !i && this.close();
    });
  }
  _listenToEscapeClick() {
    h.on(document, "keydown", (t) => {
      t.keyCode === Li && this._isOpen && this.close();
    });
  }
  _listenToKeyboardNavigation() {
    h.on(this.datesContainer, "keydown", (t) => {
      this._handleKeydown(t);
    });
  }
  _listenToDatesContainerFocus() {
    h.on(this.datesContainer, "focus", () => {
      this._focusActiveCell(this.activeCell);
    });
  }
  _listenToDatesContainerBlur() {
    h.on(this.datesContainer, "blur", () => {
      this._removeCurrentFocusStyles();
    });
  }
  _handleKeydown(t) {
    this._view === "days" && this._handleDaysViewKeydown(t), this._view === "months" && this._handleMonthsViewKeydown(t), this._view === "years" && this._handleYearsViewKeydown(t);
  }
  _handleDaysViewKeydown(t) {
    const e = this._activeDate, i = this.activeCell;
    switch (t.keyCode) {
      case Pe:
        this._activeDate = xe(this._activeDate, F() ? 1 : -1);
        break;
      case Be:
        this._activeDate = xe(this._activeDate, F() ? -1 : 1);
        break;
      case rt:
        this._activeDate = xe(this._activeDate, -7);
        break;
      case z:
        this._activeDate = xe(this._activeDate, 7);
        break;
      case He:
        this._activeDate = xe(
          this._activeDate,
          1 - Z(this._activeDate)
        );
        break;
      case We:
        this._activeDate = xe(
          this._activeDate,
          ro(this._activeDate) - Z(this._activeDate)
        );
        break;
      case yn:
        this._activeDate = nt(this._activeDate, -1);
        break;
      case wn:
        this._activeDate = nt(this._activeDate, 1);
        break;
      case lt:
      case ks:
        this._selectDate(this._activeDate), this._handleDateSelection(t), t.preventDefault();
        return;
      default:
        return;
    }
    Ai(
      e,
      this._activeDate,
      this._view,
      gt,
      this._options.min,
      this._options.max
    ) || this._changeView("days"), this._removeHighlightFromCell(i), this._focusActiveCell(this.activeCell), t.preventDefault();
  }
  _asyncFocusDatesContainer() {
    setTimeout(() => {
      this.datesContainer.focus();
    }, 0);
  }
  _focusActiveCell(t) {
    t && t.setAttribute("data-te-datepicker-cell-focused", "");
  }
  _removeHighlightFromCell(t) {
    t && t.removeAttribute("data-te-datepicker-cell-focused");
  }
  _getActiveDayCell() {
    const t = d.find("td", this.datesContainer);
    return Array.from(t).find((i) => {
      const n = Yr(i.dataset.teDate);
      return _e(n, this._activeDate);
    });
  }
  _handleMonthsViewKeydown(t) {
    const e = this._activeDate, i = this.activeCell;
    switch (t.keyCode) {
      case Pe:
        this._activeDate = nt(this._activeDate, F() ? 1 : -1);
        break;
      case Be:
        this._activeDate = nt(this._activeDate, F() ? -1 : 1);
        break;
      case rt:
        this._activeDate = nt(this._activeDate, -4);
        break;
      case z:
        this._activeDate = nt(this._activeDate, 4);
        break;
      case He:
        this._activeDate = nt(this._activeDate, -this.activeMonth);
        break;
      case We:
        this._activeDate = nt(this._activeDate, 11 - this.activeMonth);
        break;
      case yn:
        this._activeDate = it(this._activeDate, -1);
        break;
      case wn:
        this._activeDate = it(this._activeDate, 1);
        break;
      case lt:
      case ks:
        this._selectMonth(this.activeMonth);
        return;
      default:
        return;
    }
    Ai(
      e,
      this._activeDate,
      this._view,
      gt,
      this._options.min,
      this._options.max
    ) || this._changeView("months"), this._removeHighlightFromCell(i), this._focusActiveCell(this.activeCell), t.preventDefault();
  }
  _getActiveMonthCell() {
    const t = d.find("td", this.datesContainer);
    return Array.from(t).find((i) => {
      const n = parseInt(i.dataset.teYear, 10), o = parseInt(i.dataset.teMonth, 10);
      return n === this.activeYear && o === this.activeMonth;
    });
  }
  _handleYearsViewKeydown(t) {
    const e = this._activeDate, i = this.activeCell, n = 4, o = 24;
    switch (t.keyCode) {
      case Pe:
        this._activeDate = it(this._activeDate, F() ? 1 : -1);
        break;
      case Be:
        this._activeDate = it(this._activeDate, F() ? -1 : 1);
        break;
      case rt:
        this._activeDate = it(this._activeDate, -n);
        break;
      case z:
        this._activeDate = it(this._activeDate, n);
        break;
      case He:
        this._activeDate = it(
          this._activeDate,
          -As(this._activeDate, o)
        );
        break;
      case We:
        this._activeDate = it(
          this._activeDate,
          o - As(this._activeDate, o) - 1
        );
        break;
      case yn:
        this._activeDate = it(this._activeDate, -o);
        break;
      case wn:
        this._activeDate = it(this._activeDate, o);
        break;
      case lt:
      case ks:
        this._selectYear(this.activeYear);
        return;
      default:
        return;
    }
    Ai(
      e,
      this._activeDate,
      this._view,
      gt,
      this._options.min,
      this._options.max
    ) || this._changeView("years"), this._removeHighlightFromCell(i), this._focusActiveCell(this.activeCell), t.preventDefault();
  }
  _getActiveYearCell() {
    const t = d.find("td", this.datesContainer);
    return Array.from(t).find((i) => parseInt(i.dataset.teYear, 10) === this.activeYear);
  }
  _setInitialDate() {
    this._input.value ? this._handleUserInput(this._input.value) : this._options.startDate ? this._activeDate = new Date(this._options.startDate) : this._activeDate = /* @__PURE__ */ new Date();
  }
  close() {
    const t = h.trigger(this._element, L_);
    !this._isOpen || t.defaultPrevented || (this._removeDatepickerListeners(), this._animations && c.addClass(this.container, this._classes.fadeOut), this._options.inline ? this._closeDropdown() : this._closeModal(), this._isOpen = !1, this._view = this._options.view, this.toggleButton ? this.toggleButton.focus() : this._input.focus());
  }
  _closeDropdown() {
    const t = d.findOne(P_), e = this._getContainer();
    window.matchMedia("(prefers-reduced-motion: reduce)").matches && (t && e.removeChild(t), this._popper && this._popper.destroy()), t.addEventListener("animationend", () => {
      t && e.removeChild(t), this._popper && this._popper.destroy();
    }), this._removeFocusTrap();
  }
  _closeModal() {
    const t = d.findOne(U_), e = d.findOne(R_);
    !e || !t || (this._animations ? (c.addClass(t, this._classes.fadeOutShort), t.addEventListener("animationend", () => {
      this._removePicker(t, e), this._scrollBar.reset();
    })) : (this._removePicker(t, e), this._scrollBar.reset()));
  }
  _removePicker(t, e) {
    const i = this._getContainer();
    i.removeChild(t), i.removeChild(e);
  }
  _removeFocusTrap() {
    this._focusTrap && (this._focusTrap.disable(), this._focusTrap = null);
  }
  _removeDatepickerListeners() {
    h.off(this.nextButton, "click"), h.off(this.previousButton, "click"), h.off(this.viewChangeButton, "click"), h.off(this.okButton, "click"), h.off(this.cancelButton, "click"), h.off(this.clearButton, "click"), h.off(this.datesContainer, "click"), h.off(this.datesContainer, "keydown"), h.off(this.datesContainer, "focus"), h.off(this.datesContainer, "blur"), h.off(document, ts);
  }
  dispose() {
    this._isOpen && this.close(), this._removeInputAndToggleListeners();
    const t = d.findOne(
      `#${this._toggleButtonId}`
    );
    t && this._element.removeChild(t), I.removeData(this._element, Os), this._element = null, this._input = null, this._options = null, this._activeDate = null, this._selectedDate = null, this._selectedYear = null, this._selectedMonth = null, this._headerDate = null, this._headerYear = null, this._headerMonth = null, this._view = null, this._popper = null, this._focusTrap = null;
  }
  _removeInputAndToggleListeners() {
    h.off(this._input, "input"), h.off(
      this._element,
      ts,
      es
    ), h.off(this._element, "keydown", es);
  }
  handleOk() {
    this._confirmSelection(this._headerDate), this.close();
  }
  _selectDate(t, e = this.activeCell) {
    const { min: i, max: n, filter: o, disablePast: r, disableFuture: a } = this._options;
    Ps(t, i, n, o, r, a) || (this._removeCurrentSelectionStyles(), this._removeCurrentFocusStyles(), this._addSelectedStyles(e), this._selectedDate = t, this._selectedYear = B(t), this._selectedMonth = Y(t), this._headerDate = t, (this._options.inline || this.options.confirmDateOnSelect) && (this._confirmSelection(t), this.close()));
  }
  _selectYear(t, e = this.activeCell) {
    this._removeCurrentSelectionStyles(), this._removeCurrentFocusStyles(), this._addSelectedStyles(e), this._headerYear = t, this._asyncChangeView("months");
  }
  _selectMonth(t, e = this.activeCell) {
    this._removeCurrentSelectionStyles(), this._removeCurrentFocusStyles(), this._addSelectedStyles(e), this._headerMonth = t, this._asyncChangeView("days");
  }
  _removeSelectedStyles(t) {
    t && t.removeAttribute("data-te-datepicker-cell-selected");
  }
  _addSelectedStyles(t) {
    t && t.setAttribute("data-te-datepicker-cell-selected", "");
  }
  _confirmSelection(t) {
    if (t) {
      const e = this.formatDate(t);
      this._input.value = e, h.trigger(this._element, N_, { date: t }), h.trigger(this._input, "input");
    }
  }
  handleCancel() {
    this._selectedDate = null, this._selectedYear = null, this._selectedMonth = null, this.close();
  }
  handleClear() {
    this._selectedDate = null, this._selectedMonth = null, this._selectedYear = null, this._headerDate = null, this._headerMonth = null, this._headerYear = null, this._removeCurrentSelectionStyles(), this._input.value = "", this._setInitialDate(), this._changeView("days"), this._updateHeaderDate(
      this._activeDate,
      this._options.monthsShort,
      this._options.weekdaysShort
    );
  }
  _removeCurrentSelectionStyles() {
    const t = d.findOne(
      "[data-te-datepicker-cell-selected]",
      this.container
    );
    t && t.removeAttribute("data-te-datepicker-cell-selected");
  }
  _removeCurrentFocusStyles() {
    const t = d.findOne(
      "[data-te-datepicker-cell-focused]",
      this.container
    );
    t && t.removeAttribute("data-te-datepicker-cell-focused");
  }
  formatDate(t) {
    const e = Z(t), i = this._addLeadingZero(Z(t)), n = this._options.weekdaysShort[Cs(t)], o = this._options.weekdaysFull[Cs(t)], r = Y(t) + 1, a = this._addLeadingZero(Y(t) + 1), l = this._options.monthsShort[Y(t)], p = this._options.monthsFull[Y(t)], u = B(t).toString().length === 2 ? B(t) : B(t).toString().slice(2, 4), f = B(t), _ = this._options.format.split(
      /(d{1,4}|m{1,4}|y{4}|yy|!.)/g
    );
    let m = "";
    return _.forEach((g) => {
      switch (g) {
        case "dddd":
          g = g.replace(g, o);
          break;
        case "ddd":
          g = g.replace(g, n);
          break;
        case "dd":
          g = g.replace(g, i);
          break;
        case "d":
          g = g.replace(g, e);
          break;
        case "mmmm":
          g = g.replace(g, p);
          break;
        case "mmm":
          g = g.replace(g, l);
          break;
        case "mm":
          g = g.replace(g, a);
          break;
        case "m":
          g = g.replace(g, r);
          break;
        case "yyyy":
          g = g.replace(g, f);
          break;
        case "yy":
          g = g.replace(g, u);
          break;
      }
      m += g;
    }), m;
  }
  _addLeadingZero(t) {
    return parseInt(t, 10) < 10 ? `0${t}` : t;
  }
  _pickDay(t, e) {
    const i = Yr(t), { min: n, max: o, filter: r, disablePast: a, disableFuture: l } = this._options;
    Ps(i, n, o, r, a, l) || (this._activeDate = i, this._selectDate(i, e));
  }
  _pickYear(t) {
    const { min: e, max: i, disablePast: n, disableFuture: o } = this._options;
    if (ao(t, e, i, n, o))
      return;
    const r = Mt(t, this.activeMonth, this.activeDay);
    this._activeDate = r, this._selectedDate = r, this._selectYear(t);
  }
  _pickMonth(t, e) {
    const { min: i, max: n, disablePast: o, disableFuture: r } = this._options;
    if (tc(t, e, i, n, o, r) || ao(e, i, n, o, r))
      return;
    const a = Mt(e, t, this.activeDay);
    this._activeDate = a, this._selectMonth(t);
  }
  nextMonth() {
    const t = nt(this._activeDate, 1), e = ys(
      t,
      this._headerDate,
      this._options,
      this._classes
    );
    this._activeDate = t, this.viewChangeButton.textContent = `${this._options.monthsFull[this.activeMonth]} ${this.activeYear}`, this.viewChangeButton.innerHTML += Dt(
      this._options,
      this._classes
    ), this.datesContainer.innerHTML = e;
  }
  previousMonth() {
    const t = nt(this._activeDate, -1);
    this._activeDate = t;
    const e = ys(
      t,
      this._headerDate,
      this._options,
      this._classes
    );
    this.viewChangeButton.textContent = `${this._options.monthsFull[this.activeMonth]} ${this.activeYear}`, this.viewChangeButton.innerHTML += Dt(
      this._options,
      this._classes
    ), this.datesContainer.innerHTML = e;
  }
  nextYear() {
    const t = it(this._activeDate, 1);
    this._activeDate = t, this.viewChangeButton.textContent = `${this.activeYear}`, this.viewChangeButton.innerHTML += Dt(
      this._options,
      this._classes
    );
    const e = ws(
      this.activeYear,
      this._selectedYear,
      this._selectedMonth,
      this._options,
      Ji,
      this._classes
    );
    this.datesContainer.innerHTML = e;
  }
  previousYear() {
    const t = it(this._activeDate, -1);
    this._activeDate = t, this.viewChangeButton.textContent = `${this.activeYear}`, this.viewChangeButton.innerHTML += Dt(
      this._options,
      this._classes
    );
    const e = ws(
      this.activeYear,
      this._selectedYear,
      this._selectedMonth,
      this._options,
      Ji,
      this._classes
    );
    this.datesContainer.innerHTML = e;
  }
  nextYears() {
    const t = it(this._activeDate, 24);
    this._activeDate = t;
    const e = xs(
      t,
      this._selectedYear,
      this._options,
      gt,
      Qi,
      this._classes
    );
    this.viewChangeButton.textContent = `${this.firstYearInView} - ${this.lastYearInView}`, this.viewChangeButton.innerHTML += Dt(
      this._options,
      this._classes
    ), this.datesContainer.innerHTML = e;
  }
  previousYears() {
    const t = it(this._activeDate, -24);
    this._activeDate = t;
    const e = xs(
      t,
      this._selectedYear,
      this._options,
      gt,
      Qi,
      this._classes
    );
    this.viewChangeButton.textContent = `${this.firstYearInView} - ${this.lastYearInView}`, this.viewChangeButton.innerHTML += Dt(
      this._options,
      this._classes
    ), this.datesContainer.innerHTML = e;
  }
  _asyncChangeView(t) {
    setTimeout(() => {
      this._changeView(t);
    }, 0);
  }
  _changeView(t) {
    this._view = t, this.datesContainer.blur(), t === "days" && (this.datesContainer.innerHTML = ys(
      this._activeDate,
      this._headerDate,
      this._options,
      this._classes
    )), t === "months" && (this.datesContainer.innerHTML = ws(
      this.activeYear,
      this._selectedYear,
      this._selectedMonth,
      this._options,
      Ji,
      this._classes
    )), t === "years" && (this.datesContainer.innerHTML = xs(
      this._activeDate,
      this._selectedYear,
      this._options,
      gt,
      Qi,
      this._classes
    )), this.datesContainer.focus(), this._updateViewControlsAndAttributes(t), this._updateControlsDisabledState();
  }
  _updateViewControlsAndAttributes(t) {
    t === "days" && (this.viewChangeButton.textContent = `${this._options.monthsFull[this.activeMonth]} ${this.activeYear}`, this.viewChangeButton.innerHTML += Dt(
      this._options,
      this._classes
    ), this.viewChangeButton.setAttribute(
      "aria-label",
      this._options.switchToMultiYearViewLabel
    ), this.previousButton.setAttribute(
      "aria-label",
      this._options.prevMonthLabel
    ), this.nextButton.setAttribute("aria-label", this._options.nextMonthLabel)), t === "months" && (this.viewChangeButton.textContent = `${this.activeYear}`, this.viewChangeButton.innerHTML += Dt(
      this._options,
      this._classes
    ), this.viewChangeButton.setAttribute(
      "aria-label",
      this._options.switchToDayViewLabel
    ), this.previousButton.setAttribute(
      "aria-label",
      this._options.prevYearLabel
    ), this.nextButton.setAttribute("aria-label", this._options.nextYearLabel)), t === "years" && (this.viewChangeButton.textContent = `${this.firstYearInView} - ${this.lastYearInView}`, this.viewChangeButton.innerHTML += Dt(
      this._options,
      this._classes
    ), this.viewChangeButton.setAttribute(
      "aria-label",
      this._options.switchToMonthViewLabel
    ), this.previousButton.setAttribute(
      "aria-label",
      this._options.prevMultiYearLabel
    ), this.nextButton.setAttribute(
      "aria-label",
      this._options.nextMultiYearLabel
    ));
  }
  _updateControlsDisabledState() {
    h_(
      this._options.disableFuture,
      this._activeDate,
      this._view,
      gt,
      this._options.min,
      this._options.max,
      this.lastYearInView,
      this.firstYearInView
    ) ? this.nextButton.disabled = !0 : this.nextButton.disabled = !1, d_(
      this._options.disablePast,
      this._activeDate,
      this._view,
      gt,
      this._options.min,
      this._options.max,
      this.lastYearInView,
      this.firstYearInView
    ) ? this.previousButton.disabled = !0 : this.previousButton.disabled = !1;
  }
  _handleUserInput(t) {
    const e = this._getDelimeters(this._options.format), i = this._parseDate(t, this._options.format, e);
    a_(i) ? (this._activeDate = i, this._selectedDate = i, this._selectedYear = B(i), this._selectedMonth = Y(i), this._headerDate = i) : (this._activeDate = /* @__PURE__ */ new Date(), this._selectedDate = null, this._selectedMonth = null, this._selectedYear = null, this._headerDate = null, this._headerMonth = null, this._headerYear = null);
  }
  _getDelimeters(t) {
    return t.match(/[^(dmy)]{1,}/g);
  }
  _parseDate(t, e, i) {
    let n;
    i[0] !== i[1] ? n = i[0] + i[1] : n = i[0];
    const o = new RegExp(`[${n}]`), r = t.split(o), a = e.split(o), l = e.indexOf("mmm") !== -1, p = [];
    for (let v = 0; v < a.length; v++)
      a[v].indexOf("yy") !== -1 && (p[0] = { value: r[v], format: a[v] }), a[v].indexOf("m") !== -1 && (p[1] = { value: r[v], format: a[v] }), a[v].indexOf("d") !== -1 && a[v].length <= 2 && (p[2] = { value: r[v], format: a[v] });
    let u;
    e.indexOf("mmmm") !== -1 ? u = this._options.monthsFull : u = this._options.monthsShort;
    const f = Number(p[0].value), _ = l ? this.getMonthNumberByMonthName(p[1].value, u) : Number(p[1].value) - 1, m = Number(p[2].value);
    return Mt(f, _, m);
  }
  getMonthNumberByMonthName(t, e) {
    return e.findIndex((i) => i === t);
  }
  static getInstance(t) {
    return I.getData(t, Os);
  }
  static getOrCreateInstance(t, e = {}) {
    return this.getInstance(t) || new this(t, typeof e == "object" ? e : null);
  }
}
const Df = ({
  format24: s,
  okLabel: t,
  cancelLabel: e,
  headID: i,
  footerID: n,
  bodyID: o,
  pickerID: r,
  clearLabel: a,
  inline: l,
  showClearBtn: p,
  amLabel: u,
  pmLabel: f
}, _) => {
  const m = `<div id='${r}' class='${_.timepickerWrapper}' data-te-timepicker-wrapper>
      <div class="${_.timepickerContainer}">
        <div class="${_.timepickerElements}">
        <div id='${i}' class='${_.timepickerHead}' style='padding-right:${s ? 50 : 10}px'>
        <div class='${_.timepickerHeadContent}'>
            <div class="${_.timepickerCurrentWrapper}">
              <span class="${_.timepickerCurrentButtonWrapper}">
                <button type='button' class='${_.timepickerCurrentButton}' tabindex="0" data-te-timepicker-active data-te-timepicker-current data-te-timepicker-hour data-te-ripple-init>21</button>
              </span>
              <button type='button' class='${_.timepickerDot}' disabled>:</button>
            <span class="${_.timepickerCurrentButtonWrapper}">
              <button type='button' class='${_.timepickerCurrentButton}' tabindex="0" data-te-timepicker-current data-te-timepicker-minute data-te-ripple-init>21</button>
            </span>
            </div>
            ${s ? "" : `<div class="${_.timepickerModeWrapper}">
                  <button type='button' class="${_.timepickerModeAm}" tabindex="0" data-te-timepicker-am data-te-timepicker-hour-mode data-te-ripple-init>${u}</button>
                  <button class="${_.timepickerModePm}" tabindex="0" data-te-timepicker-pm data-te-timepicker-hour-mode data-te-ripple-init>${f}</button>
                </div>`}
        </div>
      </div>
      ${l ? "" : `<div id='${o}' class='${_.timepickerClockWrapper}' data-te-timepicker-clock-wrapper>
            <div class='${_.timepickerClock}' data-te-timepicker-clock>
              <span class='${_.timepickerMiddleDot}' data-te-timepicker-middle-dot></span>
              <div class='${_.timepickerHandPointer}' data-te-timepicker-hand-pointer>
                <div class='${_.timepickerPointerCircle}' data-te-timepicker-circle></div>
              </div>
              ${s ? '<div class="' + _.timepickerClockInner + '" data-te-timepicker-clock-inner></div>' : ""}
            </div>
          </div>`}
    </div>
    <div id='${n}' class='${_.timepickerFooterWrapper}'>
      <div class="${_.timepickerFooter}">
        ${p ? `<button type='button' class='${_.timepickerFooterButton}' data-te-timepicker-clear tabindex="0" data-te-ripple-init>${a}</button>` : ""}
        <button type='button' class='${_.timepickerFooterButton}' data-te-timepicker-cancel tabindex="0" data-te-ripple-init>${e}</button>
        <button type='button' class='${_.timepickerFooterButton}' data-te-timepicker-submit tabindex="0" data-te-ripple-init>${t}</button>
      </div>
    </div>
  </div>
</div>`, g = `<div id='${r}' class='${_.timepickerInlineWrapper}' data-te-timepicker-wrapper>
        <div class="${_.timepickerInlineContainer}">
          <div class="${_.timepickerInlineElements}">
          <div id='${i}' class='${_.timepickerInlineHead}'
          style='padding-right:10px'>
          <div class='${_.timepickerInlineHeadContent}'>
              <div class="${_.timepickerCurrentWrapper}">
                <span class="${_.timepickerInlineHourWrapper}" data-te-timepicker-inline-hour-icons>
                  <span class="${_.timepickerInlineIconUp}" data-te-timepicker-icon-up data-te-timepicker-icon-inline-hour>
                    <span class="${_.timepickerInlineIconSvg}">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                      </svg>   
                    </span>
                  </span>
                  <button type='button' class='${_.timepickerInlineCurrentButton}' data-te-timepicker-hour data-te-timepicker-current data-te-timepicker-current-inline tabindex="0" data-te-ripple-init>21</button>
                  <span class="${_.timepickerInlineIconDown}" data-te-timepicker-icon-inline-hour data-te-timepicker-icon-down>
                    <span class="${_.timepickerInlineIconSvg}">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>  
                    </span>
                  </span>
                </span>
                <button type='button' class='${_.timepickerInlineDot}' data-te-timepicker-current-inline disabled>:</button>
              <span class="${_.timepickerCurrentMinuteWrapper}">
                <span class="${_.timepickerInlineIconUp}" data-te-timepicker-icon-up data-te-timepicker-icon-inline-minute>
                  <span class="${_.timepickerInlineIconSvg}">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                    </svg>
                  </span>
                </span>
                <button type='button' class='${_.timepickerInlineCurrentButton}' data-te-timepicker-minute data-te-timepicker-current data-te-timepicker-current-inline tabindex="0" data-te-ripple-init>21</button>
                <span class="${_.timepickerInlineIconDown}" data-te-timepicker-icon-inline-minute data-te-timepicker-icon-down>
                  <span class="${_.timepickerInlineIconSvg}">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg> 
                  </span>
                </span>
              </span>
              </div>
              ${s ? "" : `<div class="${_.timepickerInlineModeWrapper}">
                      <button type='button' class="${_.timepickerInlineModeAm}" data-te-timepicker-am data-te-timepicker-hour-mode tabindex="0" data-te-ripple-init>${u}</button>
                      <button class="${_.timepickerInlineModePm}" data-te-timepicker-hour-mode data-te-timepicker-pm tabindex="0" data-te-ripple-init>${f}</button>
                      <button type='button' class='${_.timepickerInlineSubmitButton}' data-te-timepicker-submit tabindex="0" data-te-ripple-init>${t}</button>
                    </div>`}
              ${s ? `<button class='${_.timepickerInlineSubmitButton}' data-te-timepicker-submit tabindex="0" data-te-ripple-init>${t}</button>` : ""}
          </div>
        </div>
      </div>
    </div>
</div>`;
  return l ? g : m;
}, $f = (s, t, e) => {
  const { iconSVG: i } = s;
  return `
  <button id="${t}" tabindex="0" type="button" class="${e.timepickerToggleButton}" data-te-toggle="timepicker" data-te-timepicker-toggle-button data-te-timepicker-icon>
    ${i}
  </button>
`;
}, js = "data-te-timepicker-disabled", is = "data-te-timepicker-active", be = (s) => {
  if (s === "")
    return;
  let t, e, i, n;
  return sc(s) ? (t = s.getHours(), n = t, e = s.getMinutes(), t %= 12, n === 0 && t === 0 && (i = "AM"), t = t || 12, i === void 0 && (i = Number(n) >= 12 ? "PM" : "AM"), e = e < 10 ? `0${e}` : e) : ([t, e, i] = R(s, !1), n = t, t %= 12, n === 0 && t === 0 && (i = "AM"), t = t || 12, i === void 0 && (i = Number(n) >= 12 ? "PM" : "AM")), {
    hours: t,
    minutes: e,
    amOrPm: i
  };
}, sc = (s) => s && Object.prototype.toString.call(s) === "[object Date]" && !Number.isNaN(s), Xr = (s) => {
  if (s === "")
    return;
  let t, e;
  return sc(s) ? (t = s.getHours(), e = s.getMinutes()) : [t, e] = R(s, !1), e = Number(e) < 10 ? `0${Number(e)}` : e, {
    hours: t,
    minutes: e
  };
}, Lf = (s, t, e) => h.on(document, s, t, ({ target: i }) => {
  if (i.hasAttribute(is))
    return;
  document.querySelectorAll(t).forEach((o) => {
    o.hasAttribute(is) && (c.removeClass(o, e.opacity), o.removeAttribute(is));
  }), c.addClass(i, e.opacity), i.setAttribute(is, "");
}), Gr = ({ clientX: s, clientY: t, touches: e }, i, n = !1) => {
  const { left: o, top: r } = i.getBoundingClientRect();
  let a = {};
  return !n || !e ? a = {
    x: s - o,
    y: t - r
  } : n && Object.keys(e).length > 0 && (a = {
    x: e[0].clientX - o,
    y: e[0].clientY - r
  }), a;
}, ss = () => navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform) || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
), R = (s, t = !0) => t ? s.value.replace(/:/gi, " ").split(" ") : s.replace(/:/gi, " ").split(" "), nc = (s, t) => {
  const [e, i, n] = R(s, !1), [o, r, a] = R(t, !1);
  return n === "PM" && a === "AM" || n === a && e > o || i > r;
}, oc = () => {
  const s = /* @__PURE__ */ new Date(), t = s.getHours(), e = s.getMinutes();
  return `${t}:${e < 10 ? `0${e}` : e}`;
}, Xt = (s, t, e) => {
  if (!t)
    return s;
  let i = oc();
  return e && (i = `${be(i).hours}:${be(i).minutes} ${be(i).amOrPm}`), (s !== "" && nc(i, s) || s === "") && (s = i), s;
}, Gt = (s, t, e) => {
  if (!t)
    return s;
  let i = oc();
  return e && (i = `${be(i).hours}:${be(i).minutes} ${be(i).amOrPm}`), (s !== "" && !nc(i, s) || s === "") && (s = i), s;
}, Mf = ({ format12: s, maxTime: t, minTime: e, disablePast: i, disableFuture: n }, o, r) => {
  const a = R(o)[1];
  e = Xt(e, i, s), t = Gt(t, n, s);
  const [l, p, u] = R(t, !1), [f, _, m] = R(e, !1);
  if (u !== void 0 || m !== void 0)
    return [r, a];
  if (!(l !== "" && f === "" && Number(r) > Number(l)) && !(l === "" && f !== "" && p === void 0 && _ !== "" && Number(r) < Number(f)))
    return [r, a];
}, qr = (s, t, e, i) => {
  s.forEach((n) => {
    t = t === "12" && i ? "0" : t, (n.textContent === "00" || Number(n.textContent === "12" && i ? "0" : n.textContent) > t) && (c.addClass(n, e.tipsDisabled), n.setAttribute(js, ""));
  });
}, Zr = (s, t, e, i) => {
  s.forEach((n) => {
    t = t === "12" && i ? "0" : t, n.textContent !== "00" && Number(n.textContent === "12" && i ? "0" : n.textContent) < Number(t) && (c.addClass(n, e.tipsDisabled), n.setAttribute(js, ""));
  });
}, rc = (s, t, e, i) => {
  if (t === "12" || t === "24")
    return;
  const n = e ? 12 : 24;
  return i === "max" ? (Number(s) === n ? 0 : Number(s)) > Number(t) : (Number(s) === n ? 0 : Number(s)) < Number(t);
}, Nf = (s, t, e, i, n, o) => {
  s.forEach((r) => {
    (rc(i, e, o, "max") || Number(r.textContent) > t && Number(i) === Number(e)) && (c.addClass(r, n.tipsDisabled), r.setAttribute(js, ""));
  });
}, Rf = (s, t, e, i, n, o) => {
  s.forEach((r) => {
    (rc(i, e, o, "min") || Number(r.textContent) < t && Number(i) === Number(e)) && (c.addClass(r, n.tipsDisabled), r.setAttribute(js, ""));
  });
}, Pf = (s) => s.startsWith("0") ? Number(s.slice(1)) : Number(s), yi = "timepicker", N = `data-te-${yi}`, Qr = "[data-te-toggle]", Ss = `te.${yi}`, Rt = `.${Ss}`, Pt = ".data-api", Jr = `click${Rt}${Pt}`, ns = `keydown${Rt}${Pt}`, ta = `mousedown${Rt}${Pt}`, ea = `mouseup${Rt}${Pt}`, ia = `mousemove${Rt}${Pt}`, sa = `mouseleave${Rt}${Pt}`, na = `mouseover${Rt}${Pt}`, oa = `touchmove${Rt}${Pt}`, ra = `touchend${Rt}${Pt}`, aa = `touchstart${Rt}${Pt}`, Bf = `[${N}-am]`, Hf = `[${N}-pm]`, Wf = `[${N}-format24]`, os = `[${N}-current]`, rs = `[${N}-hour-mode]`, Vf = `[${N}-toggle-button]`, kn = `${N}-cancel`, la = `${N}-clear`, On = `${N}-submit`, Ff = `${N}-icon`, Sn = `${N}-icon-up`, In = `${N}-icon-down`, Yf = `${N}-icon-inline-hour`, jf = `${N}-icon-inline-minute`, ca = `${N}-inline-hour-icons`, Kf = `${N}-current-inline`, zf = "readonly", ha = `${N}-invalid-feedback`, Dn = `${N}-is-invalid`, Yt = `${N}-disabled`, H = `${N}-active`, Uf = `${N}-input`, ue = `${N}-clock`, ai = `${N}-clock-inner`, $n = `${N}-wrapper`, da = `${N}-clock-wrapper`, as = `${N}-hour`, Ln = `${N}-minute`, ls = `${N}-tips-element`, K = `${N}-tips-hours`, X = `${N}-tips-minutes`, at = `${N}-tips-inner`, cs = `${N}-tips-inner-element`, ua = `${N}-middle-dot`, Mn = `${N}-hand-pointer`, Nn = `${N}-circle`, pa = `${N}-modal`, Xf = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>`, Gf = {
  appendValidationInfo: !0,
  bodyID: "",
  cancelLabel: "Cancel",
  clearLabel: "Clear",
  closeModalOnBackdropClick: !0,
  closeModalOnMinutesClick: !1,
  container: "body",
  defaultTime: "",
  disabled: !1,
  disablePast: !1,
  disableFuture: !1,
  enableValidation: !0,
  focusInputAfterApprove: !1,
  footerID: "",
  format12: !0,
  format24: !1,
  headID: "",
  increment: !1,
  inline: !1,
  invalidLabel: "Invalid Time Format",
  maxTime: "",
  minTime: "",
  modalID: "",
  okLabel: "Ok",
  overflowHidden: !0,
  pickerID: "",
  readOnly: !1,
  showClearBtn: !0,
  switchHoursToMinutesOnClick: !0,
  iconSVG: Xf,
  withIcon: !0,
  pmLabel: "PM",
  amLabel: "AM",
  animations: !0
}, qf = {
  appendValidationInfo: "boolean",
  bodyID: "string",
  cancelLabel: "string",
  clearLabel: "string",
  closeModalOnBackdropClick: "boolean",
  closeModalOnMinutesClick: "boolean",
  container: "string",
  disabled: "boolean",
  disablePast: "boolean",
  disableFuture: "boolean",
  enableValidation: "boolean",
  footerID: "string",
  format12: "boolean",
  format24: "boolean",
  headID: "string",
  increment: "boolean",
  inline: "boolean",
  invalidLabel: "string",
  modalID: "string",
  okLabel: "string",
  overflowHidden: "boolean",
  pickerID: "string",
  readOnly: "boolean",
  showClearBtn: "boolean",
  switchHoursToMinutesOnClick: "boolean",
  defaultTime: "(string|date|number)",
  iconSVG: "string",
  withIcon: "boolean",
  pmLabel: "string",
  amLabel: "string",
  animations: "boolean"
}, Zf = {
  tips: "absolute rounded-[100%] w-[32px] h-[32px] text-center cursor-pointer text-[1.1rem] rounded-[100%] bg-transparent flex justify-center items-center font-light focus:outline-none selection:bg-transparent",
  tipsActive: "text-white bg-[#3b71ca] font-normal",
  tipsDisabled: "text-[#b3afaf] pointer-events-none bg-transparent",
  transform: "transition-[transform,height] ease-in-out duration-[400ms]",
  modal: "z-[1065]",
  clockAnimation: "animate-[show-up-clock_350ms_linear]",
  opacity: "!opacity-100",
  timepickerWrapper: "touch-none opacity-100 z-[1065] inset-0 bg-[#00000066] h-full flex items-center justify-center flex-col fixed",
  timepickerContainer: "flex items-center justify-center flex-col max-h-[calc(100%-64px)] overflow-y-auto shadow-[0_10px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)] min-[320px]:max-[825px]:landscape:rounded-lg",
  timepickerElements: "flex flex-col min-w-[310px] min-h-[325px] bg-white rounded-t-[0.6rem] min-[320px]:max-[825px]:landscape:!flex-row min-[320px]:max-[825px]:landscape:min-w-[auto] min-[320px]:max-[825px]:landscape:min-h-[auto] min-[320px]:max-[825px]:landscape:overflow-y-auto justify-around",
  timepickerHead: "bg-[#3b71ca] dark:bg-zinc-700 h-[100px] rounded-t-lg pr-[24px] pl-[50px] py-[10px] min-[320px]:max-[825px]:landscape:rounded-tr-none min-[320px]:max-[825px]:landscape:rounded-bl-none min-[320px]:max-[825px]:landscape:p-[10px] min-[320px]:max-[825px]:landscape:pr-[10px] min-[320px]:max-[825px]:landscape:h-auto min-[320px]:max-[825px]:landscape:min-h-[305px] flex flex-row items-center justify-center",
  timepickerHeadContent: "min-[320px]:max-[825px]:landscape:flex-col flex w-full justify-evenly",
  timepickerCurrentWrapper: "[direction:ltr] rtl:[direction:rtl]",
  timepickerCurrentButtonWrapper: "relative h-full",
  timepickerCurrentButton: "text-[3.75rem] font-light leading-[1.2] tracking-[-0.00833em] text-white opacity-[.54] border-none bg-transparent p-0 min-[320px]:max-[825px]:landscape:text-5xl min-[320px]:max-[825px]:landscape:font-normal cursor-pointer hover:bg-[#00000026] hover:outline-none focus:bg-[#00000026] focus:outline-none ",
  timepickerDot: "font-light leading-[1.2] tracking-[-0.00833em] text-[3.75rem] opacity-[.54] border-none bg-transparent p-0 text-white min-[320px]:max-[825px]:landscape:text-[3rem] min-[320px]:max-[825px]:landscape:font-normal",
  timepickerModeWrapper: "flex flex-col justify-center text-[18px] text-[#ffffff8a] min-[320px]:max-[825px]:landscape:!justify-around min-[320px]:max-[825px]:landscape:!flex-row",
  timepickerModeAm: "p-0 bg-transparent border-none text-white opacity-[.54] cursor-pointer hover:bg-[#00000026] hover:outline-none focus:bg-[#00000026] focus:outline-none",
  timepickerModePm: "p-0 bg-transparent border-none text-white opacity-[.54] cursor-pointer hover:bg-[#00000026] hover:outline-none focus:bg-[#00000026] focus:outline-none",
  timepickerClockWrapper: "min-w-[310px] max-w-[325px] min-h-[305px] overflow-x-hidden h-full flex justify-center flex-col items-center dark:bg-zinc-500",
  timepickerClock: "relative rounded-[100%] w-[260px] h-[260px] cursor-default my-0 mx-auto bg-[#00000012] dark:bg-zinc-600/50",
  timepickerMiddleDot: "top-1/2 left-1/2 w-[6px] h-[6px] -translate-y-1/2 -translate-x-1/2 rounded-[50%] bg-[#3b71ca] absolute",
  timepickerHandPointer: "bg-[#3b71ca] bottom-1/2 h-2/5 left-[calc(50%-1px)] rtl:!left-auto origin-[center_bottom_0] rtl:!origin-[50%_50%_0] w-[2px] absolute",
  timepickerPointerCircle: "-top-[21px] -left-[15px] w-[4px] border-[14px] border-solid border-[#3b71ca] h-[4px] box-content rounded-[100%] absolute",
  timepickerClockInner: "absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[160px] h-[160px] rounded-[100%]",
  timepickerFooterWrapper: "rounded-b-lg flex justify-between items-center w-full h-[56px] px-[12px] bg-white dark:bg-zinc-500",
  timepickerFooter: "w-full flex justify-between",
  timepickerFooterButton: "text-[0.8rem] min-w-[64px] box-border font-medium leading-[40px] rounded-[10px] tracking-[0.1rem] uppercase text-[#3b71ca] dark:text-white border-none bg-transparent transition-[background-color,box-shadow,border] duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] delay-[0ms] outline-none py-0 px-[10px] h-[40px] mb-[10px] hover:bg-[#00000014] focus:bg-[#00000014] focus:outline-none",
  timepickerInlineWrapper: "touch-none opacity-100 z-[1065] inset-0 bg-[#00000066] h-full flex items-center justify-center flex-col rounded-lg",
  timepickerInlineContainer: "flex items-center justify-center flex-col max-h-[calc(100%-64px)] overflow-y-auto shadow-[0_10px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)]",
  timepickerInlineElements: "flex flex-col min-h-[auto] min-w-[310px] bg-white rounded-[0.6rem] min-[320px]:max-[825px]:landscape:!flex-row min-[320px]:max-[825px]:landscape:rounded-bl-lg min-[320px]:max-[825px]:landscape:min-w-[auto] min-[320px]:max-[825px]:landscape::min-h-[auto] min-[320px]:max-[825px]:landscape:overflow-y-auto justify-around",
  timepickerInlineHead: "bg-[#3b71ca] dark:bg-zinc-700 h-[100px] rounded-t-lg min-[320px]:max-[825px]:landscape:rounded-tr-none min-[320px]:max-[825px]:landscape:rounded-bl-none min-[320px]:max-[825px]:landscape:p-[10px] min-[320px]:max-[825px]:landscape:pr-[10px] min-[320px]:max-[825px]:landscape:h-auto min-[320px]:max-[825px]:landscape:min-h-[305px] flex flex-row items-center justify-center p-0 rounded-b-lg",
  timepickerInlineHeadContent: "min-[320px]:max-[825px]:landscape:flex-col flex w-full justify-evenly items-center",
  timepickerInlineHourWrapper: "relative h-full !opacity-100",
  timepickerCurrentMinuteWrapper: "relative h-full",
  timepickerInlineIconUp: "absolute fill-white -top-[35px] opacity-0 hover:opacity-100 transition-all duration-200 ease-[ease] cursor-pointer -translate-x-1/2 -translate-y-1/2 left-1/2 w-[30px] h-[30px] flex justify-center items-center",
  timepickerInlineIconSvg: "h-4 w-4",
  timepickerInlineCurrentButton: "font-light leading-[1.2] tracking-[-0.00833em] text-white border-none bg-transparent p-0 min-[320px]:max-[825px]:landscape:text-5xl min-[320px]:max-[825px]:landscape:font-normal !opacity-100 cursor-pointer focus:bg-[#00000026] hover:outline-none focus:outline-none text-[2.5rem] hover:bg-[unset]",
  timepickerInlineIconDown: "absolute fill-white -bottom-[47px] opacity-0 hover:opacity-100 transition-all duration-200 ease-[ease] cursor-pointer -translate-x-1/2 -translate-y-1/2 left-1/2 w-[30px] h-[30px] flex justify-center items-center",
  timepickerInlineDot: "font-light leading-[1.2] tracking-[-0.00833em] opacity-[.54] border-none bg-transparent p-0 text-white min-[320px]:max-[825px]:landscape:text-[3rem] min-[320px]:max-[825px]:landscape:font-normal text-[2.5rem]",
  timepickerInlineModeWrapper: "flex justify-center text-[18px] text-[#ffffff8a] min-[320px]:max-[825px]:landscape:!justify-around min-[320px]:max-[825px]:landscape:!flex-row",
  timepickerInlineModeAm: "hover:bg-[#00000026] hover:outline-none focus:bg-[#00000026] focus:outline-none p-0 bg-transparent border-none text-white opacity-[.54] cursor-pointer mr-2 ml-6",
  timepickerInlineModePm: "hover:bg-[#00000026] hover:outline-none focus:bg-[#00000026] focus:outline-none p-0 bg-transparent border-none text-white opacity-[.54] cursor-pointer",
  timepickerInlineSubmitButton: "hover:bg-[#00000014] focus:bg-[#00000014] focus:outline-none text-[0.8rem] box-border font-medium leading-[40px] tracking-[.1rem] uppercase border-none bg-transparent [transition:background-color_250ms_cubic-bezier(0.4,0,0.2,1)_0ms,box-shadow_250ms_cubic-bezier(0.4,0,0.2,1)_0ms,border_250ms_cubic-bezier(0.4,0,0.2,1)_0ms] outline-none rounded-[100%] h-[48px] min-w-[48px] inline-block ml-[30px] text-white py-1 px-2 mb-0",
  timepickerToggleButton: "h-4 w-4 ml-auto absolute outline-none border-none bg-transparent right-1.5 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] cursor-pointer hover:text-[#3b71ca] focus:text-[#3b71ca] dark:hover:text-[#3b71ca] dark:focus:text-[#3b71ca] dark:text-white",
  invalidFeedback: "block absolute text-sm text-red-500 dark:text-red-300"
}, Qf = {
  tips: "string",
  tipsActive: "string",
  tipsDisabled: "string",
  transform: "string",
  modal: "string",
  clockAnimation: "string",
  opacity: "string",
  timepickerWrapper: "string",
  timepickerContainer: "string",
  timepickerElements: "string",
  timepickerHead: "string",
  timepickerHeadContent: "string",
  timepickerCurrentWrapper: "string",
  timepickerCurrentButtonWrapper: "string",
  timepickerCurrentButton: "string",
  timepickerDot: "string",
  timepickerModeWrapper: "string",
  timepickerModeAm: "string",
  timepickerModePm: "string",
  timepickerClockWrapper: "string",
  timepickerClock: "string",
  timepickerMiddleDot: "string",
  timepickerHandPointer: "string",
  timepickerPointerCircle: "string",
  timepickerClockInner: "string",
  timepickerFooterWrapper: "string",
  timepickerFooterButton: "string",
  timepickerInlineWrapper: "string",
  timepickerInlineContainer: "string",
  timepickerInlineElements: "string",
  timepickerInlineHead: "string",
  timepickerInlineHeadContent: "string",
  timepickerInlineHourWrapper: "string",
  timepickerCurrentMinuteWrapper: "string",
  timepickerInlineIconUp: "string",
  timepickerInlineIconSvg: "string",
  timepickerInlineCurrentButton: "string",
  timepickerInlineIconDown: "string",
  timepickerInlineDot: "string",
  timepickerInlineModeWrapper: "string",
  timepickerInlineModeAm: "string",
  timepickerInlineModePm: "string",
  timepickerInlineSubmitButton: "string",
  timepickerToggleButton: "string",
  invalidFeedback: "string"
};
class Y0 {
  constructor(t, e = {}, i) {
    At(this, "_toggleAmPm", (t) => {
      t === "PM" ? (this._isPmEnabled = !0, this._isAmEnabled = !1) : t === "AM" && (this._isPmEnabled = !1, this._isAmEnabled = !0);
    });
    At(this, "_toggleBackgroundColorCircle", (t) => {
      if (this._modal.querySelector(`${t}[${H}]`) !== null) {
        c.addStyle(this._circle, {
          backgroundColor: "#1976d2"
        });
        return;
      }
      c.addStyle(this._circle, {
        backgroundColor: "transparent"
      });
    });
    At(this, "_toggleClassActive", (t, { textContent: e }, i) => {
      const n = [...t].find(
        (o) => Number(o) === Number(e)
      );
      return i.forEach((o) => {
        if (!o.hasAttribute(Yt)) {
          if (o.textContent === n) {
            c.addClass(o, this._classes.tipsActive), o.setAttribute(H, "");
            return;
          }
          c.removeClass(o, this._classes.tipsActive), o.removeAttribute(H);
        }
      });
    });
    At(this, "_makeMinutesDegrees", (t, e) => {
      const { increment: i } = this._options;
      return t < 0 ? (e = Math.round(360 + t / 6) % 60, t = 360 + Math.round(t / 6) * 6) : (e = Math.round(t / 6) % 60, t = Math.round(t / 6) * 6), i && (t = Math.round(t / 30) * 30, e = Math.round(t / 6) * 6 / 6, e === 60 && (e = "00")), t >= 360 && (t = 0), {
        degrees: t,
        minute: e,
        addDegrees: i ? 30 : 6
      };
    });
    At(this, "_makeHourDegrees", (t, e, i) => {
      if (t)
        return this._hasTargetInnerClass(t) ? e < 0 ? (i = Math.round(360 + e / 30) % 24, e = 360 + e) : (i = Math.round(e / 30) + 12, i === 12 && (i = "00")) : e < 0 ? (i = Math.round(360 + e / 30) % 12, e = 360 + e) : (i = Math.round(e / 30) % 12, (i === 0 || i > 12) && (i = 12)), e >= 360 && (e = 0), {
          degrees: e,
          hour: i,
          addDegrees: 30
        };
    });
    At(this, "_makeInnerHoursDegrees", (t, e) => (t < 0 ? (e = Math.round(360 + t / 30) % 24, t = 360 + t) : (e = Math.round(t / 30) + 12, e === 12 && (e = "00")), {
      degrees: t,
      hour: e,
      addDegrees: 30
    }));
    At(this, "_getAppendClock", (t = [], e = `[${ue}]`, i) => {
      let { minTime: n, maxTime: o } = this._options;
      const { inline: r, format12: a, disablePast: l, disableFuture: p } = this._options;
      n = Xt(n, l, a), o = Gt(o, p, a);
      const [u, f, _] = R(
        o,
        !1
      ), [m, g, v] = R(
        n,
        !1
      );
      !r && a && this._isInvalidTimeFormat && !this._AM.hasAttribute(H) && (c.addClass(this._PM, this._classes.opacity), this._PM.setAttribute(H, ""));
      const b = d.findOne(e), C = 360 / t.length;
      function y(w) {
        return w * (Math.PI / 180);
      }
      if (b === null)
        return;
      const E = (b.offsetWidth - 32) / 2, T = (b.offsetHeight - 32) / 2, A = E - 4;
      setTimeout(() => {
        let w;
        a && (w = d.findOne(
          `${rs}[${H}]`
        ).textContent), this._handleDisablingTipsMinTime(
          w,
          v,
          g,
          m
        ), this._handleDisablingTipsMaxTime(
          w,
          _,
          f,
          u
        );
      }, 0), [...t].forEach((w, S) => {
        const k = y(S * C), x = D("span"), $ = D("span");
        $.innerHTML = w, c.addClass(x, this._classes.tips), x.setAttribute(i, "");
        const O = x.offsetWidth, M = x.offsetHeight;
        return c.addStyle(x, {
          left: `${E + Math.sin(k) * A - O}px`,
          bottom: `${T + Math.cos(k) * A - M}px`
        }), t.includes("05") && x.setAttribute(X, ""), t.includes("13") ? $.setAttribute(cs, "") : $.setAttribute(ls, ""), x.appendChild($), b.appendChild(x);
      });
    });
    this._element = t, this._element && I.setData(t, Ss, this), this._document = document, this._options = this._getConfig(e), this._classes = this._getClasses(i), this._currentTime = null, this._toggleButtonId = bt("timepicker-toggle-"), this.hoursArray = [
      "12",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11"
    ], this.innerHours = [
      "00",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23"
    ], this.minutesArray = [
      "00",
      "05",
      "10",
      "15",
      "20",
      "25",
      "30",
      "35",
      "40",
      "45",
      "50",
      "55"
    ], this.input = d.findOne("input", this._element), this.dataWithIcon = t.dataset.withIcon, this.dataToggle = t.dataset.toggle, this.customIcon = d.findOne(
      Vf,
      this._element
    ), this._checkToggleButton(), this.inputFormatShow = d.findOne(
      Wf,
      this._element
    ), this.inputFormat = this.inputFormatShow === null ? "" : Object.values(this.inputFormatShow.dataset)[0], this.elementToggle = d.findOne(
      Qr,
      this._element
    ), this.toggleElement = Object.values(
      t.querySelector(Qr).dataset
    )[0], this._hour = null, this._minutes = null, this._AM = null, this._PM = null, this._wrapper = null, this._modal = null, this._hand = null, this._circle = null, this._focusTrap = null, this._popper = null, this._interval = null, this._inputValue = this._options.defaultTime !== "" ? this._options.defaultTime : this.input.value, this._options.format24 && (this._options.format12 = !1, this._currentTime = Xr(this._inputValue)), this._options.format12 && (this._options.format24 = !1, this._currentTime = be(this._inputValue)), this._options.readOnly && this.input.setAttribute(zf, !0), this.inputFormat === "true" && this.inputFormat !== "" && (this._options.format12 = !1, this._options.format24 = !0, this._currentTime = Xr(this._inputValue)), this._animations = !window.matchMedia("(prefers-reduced-motion: reduce)").matches && this._options.animations, this.init(), this._isHours = !0, this._isMinutes = !1, this._isInvalidTimeFormat = !1, this._isMouseMove = !1, this._isInner = !1, this._isAmEnabled = !1, this._isPmEnabled = !1, this._options.format12 && !this._options.defaultTime && (this._isPmEnabled = !0), this._objWithDataOnChange = { degrees: null }, this._scrollBar = new ki();
  }
  // Getters
  static get NAME() {
    return yi;
  }
  // Public
  init() {
    const { format12: t, format24: e, enableValidation: i } = this._options;
    let n, o, r;
    if (this.input.setAttribute(Uf, ""), this._currentTime !== void 0) {
      const { hours: a, minutes: l, amOrPm: p } = this._currentTime;
      n = Number(a) < 10 ? 0 : "", o = `${n}${Number(a)}:${l}`, r = p, t ? this.input.value = `${o} ${r}` : e && (this.input.value = `${o}`);
    } else
      n = "", o = "", r = "", this.input.value = "";
    this.input.value.length > 0 && this.input.value !== "" && (this.input.setAttribute(H, ""), h.trigger(this.input, "input")), !(this._options === null && this._element === null) && (i && this._getValidate("keydown change blur focus"), this._handleOpen(), this._listenToToggleKeydown());
  }
  dispose() {
    this._removeModal(), this._element !== null && I.removeData(this._element, Ss), setTimeout(() => {
      this._element = null, this._options = null, this.input = null, this._focusTrap = null;
    }, 350), h.off(
      this._document,
      "click",
      `[data-te-toggle='${this.toggleElement}']`
    ), h.off(
      this._element,
      "keydown",
      `[data-te-toggle='${this.toggleElement}']`
    );
  }
  update(t = {}) {
    this._options = this._getConfig({ ...this._options, ...t });
  }
  // private
  _checkToggleButton() {
    this.customIcon === null && (this.dataWithIcon !== void 0 && (this._options.withIcon = null, this.dataWithIcon === "true" && this._appendToggleButton(this._options)), this._options.withIcon && this._appendToggleButton(this._options));
  }
  _appendToggleButton() {
    const t = $f(
      this._options,
      this._toggleButtonId,
      this._classes
    );
    this.input.insertAdjacentHTML("afterend", t);
  }
  _getDomElements() {
    this._hour = d.findOne(`[${as}]`), this._minutes = d.findOne(`[${Ln}]`), this._AM = d.findOne(Bf), this._PM = d.findOne(Hf), this._wrapper = d.findOne(`[${$n}]`), this._modal = d.findOne(`[${pa}]`), this._hand = d.findOne(`[${Mn}]`), this._circle = d.findOne(`[${Nn}]`), this._clock = d.findOne(`[${ue}]`), this._clockInner = d.findOne(
      `[${ai}]`
    );
  }
  _handlerMaxMinHoursOptions(t, e, i, n, o, r) {
    if (!e && !i)
      return !0;
    const { format24: a, format12: l, disablePast: p, disableFuture: u } = this._options, { _isAmEnabled: f, _isPmEnabled: _ } = this, m = r.keyCode, g = r.target.hasAttribute(ai) || r.target.hasAttribute(at) || r.target.hasAttribute(cs);
    i = Xt(i, p, l), e = Gt(e, u, l), typeof e != "number" && (e = R(e, !1)[0]);
    const v = e !== "" ? e * 30 : "", b = i !== "" ? i * 30 : "";
    t < 0 && (t = 360 + t), t = t === 360 ? 0 : t;
    const C = () => {
      const S = document.querySelectorAll(
        `[${ls}]`
      ), k = document.querySelectorAll(
        `[${cs}]`
      ), x = Pf(this._hour.innerText);
      let $, O, M;
      return m === rt ? O = 1 : m === z && (O = -1), x === 12 && m === rt ? M = 1 : x === 0 && m === rt ? M = 13 : x === 0 && m === z ? M = 23 : x === 13 && m === z ? M = 0 : x === 1 && m === z ? M = 12 : M = x + O, S.forEach((P) => {
        Number(P.textContent) === M && ($ = P);
      }), k.forEach((P) => {
        Number(P.textContent) === M && ($ = P);
      }), !$.parentElement.hasAttribute(Yt);
    }, y = () => {
      const S = i !== "" && i > 12 ? (i - 12) * 30 : "", k = e !== "" && e > 12 ? (e - 12) * 30 : "";
      if (!(S && t < S || k && t > k || e && e < 12))
        return !0;
    };
    if (a && r.type !== "keydown" && g)
      return y();
    if (r.type === "keydown")
      return C();
    const E = !o || o === "PM" && _ || i !== "" && o === "AM" && f, T = !n || n === "PM" && _ || e !== "" && n === "AM" && f, A = () => {
      const S = b === 360 && l ? 0 : b;
      if (i) {
        if (o === "PM" && f || E && t < S)
          return;
      } else
        return !0;
      return !0;
    }, w = () => {
      const S = v === 360 && l ? 0 : v;
      if (e) {
        if (n === "AM" && _ || T && t > S)
          return;
      } else
        return !0;
      return !0;
    };
    return A() && w();
  }
  _handleKeyboard() {
    h.on(this._document, ns, "", (t) => {
      let e, i, n;
      const {
        increment: o,
        maxTime: r,
        minTime: a,
        format12: l,
        disablePast: p,
        disableFuture: u
      } = this._options;
      let f = R(a, !1)[0], _ = R(r, !1)[0];
      const m = R(a, !1)[2], g = R(r, !1)[2];
      f = Xt(f, p, l), _ = Gt(_, u, l), typeof _ != "number" && (_ = R(_, !1)[0]);
      const v = d.findOne(`[${X}]`) === null, b = d.findOne(`[${at}]`) !== null, C = Number(this._hand.style.transform.replace(/[^\d-]/g, "")), y = d.find(
        `[${X}]`,
        this._modal
      ), E = d.find(
        `[${K}]`,
        this._modal
      ), T = d.find(
        `[${at}]`,
        this._modal
      );
      let A = this._makeHourDegrees(t.target, C, e).hour;
      const { degrees: w, addDegrees: S } = this._makeHourDegrees(
        t.target,
        C,
        e
      );
      let { minute: k, degrees: x } = this._makeMinutesDegrees(C, i);
      const $ = this._makeMinutesDegrees(
        C,
        i
      ).addDegrees;
      let { hour: O } = this._makeInnerHoursDegrees(
        C,
        n
      );
      if (t.keyCode === Li) {
        const M = d.findOne(
          `[${kn}]`,
          this._modal
        );
        h.trigger(M, "click");
      } else if (v) {
        if (b && (t.keyCode === Be && (this._isInner = !1, c.addStyle(this._hand, {
          height: "calc(40% + 1px)"
        }), this._hour.textContent = this._setHourOrMinute(
          A > 12 ? 1 : A
        ), this._toggleClassActive(this.hoursArray, this._hour, E), this._toggleClassActive(this.innerHours, this._hour, T)), t.keyCode === Pe && (this._isInner = !0, c.addStyle(this._hand, {
          height: "21.5%"
        }), this._hour.textContent = this._setHourOrMinute(
          O >= 24 || O === "00" ? 0 : O
        ), this._toggleClassActive(this.innerHours, this._hour, T), this._toggleClassActive(
          this.hoursArray,
          this._hour - 1,
          E
        ))), t.keyCode === rt) {
          if (!this._handlerMaxMinHoursOptions(
            w + 30,
            _,
            f,
            g,
            m,
            t
          ))
            return;
          c.addStyle(this._hand, {
            transform: `rotateZ(${w + S}deg)`
          }), this._isInner ? (O += 1, O === 24 ? O = 0 : (O === 25 || O === "001") && (O = 13), this._hour.textContent = this._setHourOrMinute(O), this._toggleClassActive(this.innerHours, this._hour, T)) : (A += 1, this._hour.textContent = this._setHourOrMinute(
            A > 12 ? 1 : A
          ), this._toggleClassActive(this.hoursArray, this._hour, E));
        }
        if (t.keyCode === z) {
          if (!this._handlerMaxMinHoursOptions(
            w - 30,
            _,
            f,
            g,
            m,
            t
          ))
            return;
          c.addStyle(this._hand, {
            transform: `rotateZ(${w - S}deg)`
          }), this._isInner ? (O -= 1, O === 12 ? O = 0 : O === -1 && (O = 23), this._hour.textContent = this._setHourOrMinute(O), this._toggleClassActive(this.innerHours, this._hour, T)) : (A -= 1, this._hour.textContent = this._setHourOrMinute(
            A === 0 ? 12 : A
          ), this._toggleClassActive(this.hoursArray, this._hour, E));
        }
      } else
        t.keyCode === rt && (x += $, c.addStyle(this._hand, {
          transform: `rotateZ(${x}deg)`
        }), k += 1, o && (k += 4, k === "0014" && (k = 5)), this._minutes.textContent = this._setHourOrMinute(
          k > 59 ? 0 : k
        ), this._toggleClassActive(
          this.minutesArray,
          this._minutes,
          y
        ), this._toggleBackgroundColorCircle(
          `[${X}]`
        )), t.keyCode === z && (x -= $, c.addStyle(this._hand, {
          transform: `rotateZ(${x}deg)`
        }), o ? k -= 5 : k -= 1, k === -1 ? k = 59 : k === -5 && (k = 55), this._minutes.textContent = this._setHourOrMinute(k), this._toggleClassActive(
          this.minutesArray,
          this._minutes,
          y
        ), this._toggleBackgroundColorCircle(
          `[${X}]`
        ));
    });
  }
  _setActiveClassToTipsOnOpen(t, ...e) {
    if (!this._isInvalidTimeFormat)
      if (this._options.format24) {
        const i = d.find(
          `[${K}]`,
          this._modal
        ), n = d.find(
          `[${at}]`,
          this._modal
        );
        this._addActiveClassToTip(i, t), this._addActiveClassToTip(n, t);
      } else {
        [...e].filter((n) => (n === "PM" ? (c.addClass(this._PM, this._classes.opacity), this._PM.setAttribute(H, "")) : n === "AM" ? (c.addClass(this._AM, this._classes.opacity), this._AM.setAttribute(H, "")) : (c.removeClass(this._AM, this._classes.opacity), c.removeClass(this._PM, this._classes.opacity), this._AM.removeAttribute(H), this._PM.removeAttribute(H)), n));
        const i = d.find(
          `[${K}]`,
          this._modal
        );
        this._addActiveClassToTip(i, t);
      }
  }
  _setTipsAndTimesDependOnInputValue(t, e) {
    const { inline: i, format12: n } = this._options;
    if (this._isInvalidTimeFormat)
      this._hour.textContent = "12", this._minutes.textContent = "00", i || c.addStyle(this._hand, {
        transform: "rotateZ(0deg)"
      }), n && (c.addClass(this._PM, this._classes.opacity), this._PM.setAttribute(H, ""));
    else {
      const o = t > 12 ? t * 30 - 360 : t * 30;
      this._hour.textContent = t, this._minutes.textContent = e, i || (c.addStyle(this._hand, {
        transform: `rotateZ(${o}deg)`
      }), c.addStyle(this._circle, {
        backgroundColor: "#1976d2"
      }), (Number(t) > 12 || t === "00") && c.addStyle(this._hand, {
        height: "21.5%"
      }));
    }
  }
  _listenToToggleKeydown() {
    h.on(
      this._element,
      "keydown",
      `[data-te-toggle='${this.toggleElement}']`,
      (t) => {
        t.keyCode === lt && (t.preventDefault(), h.trigger(this.elementToggle, "click"));
      }
    );
  }
  _handleOpen() {
    const t = this._getContainer();
    oe.on(
      this._element,
      "click",
      `[data-te-toggle='${this.toggleElement}']`,
      (e) => {
        if (this._options === null)
          return;
        const i = c.getDataAttribute(this.input, "toggle") !== null ? 200 : 0;
        setTimeout(() => {
          c.addStyle(this.elementToggle, {
            pointerEvents: "none"
          }), this.elementToggle.blur();
          let n;
          R(this.input)[0] === "" ? n = ["12", "00", "PM"] : n = R(this.input);
          const { modalID: o, inline: r, format12: a } = this._options, [l, p, u] = n, f = D("div");
          if ((Number(l) > 12 || l === "00") && (this._isInner = !0), this.input.blur(), e.target.blur(), f.innerHTML = Df(this._options, this._classes), c.addClass(f, this._classes.modal), f.setAttribute(pa, ""), f.setAttribute("role", "dialog"), f.setAttribute("tabIndex", "-1"), f.setAttribute("id", o), r ? (this._popper = Ee(this.input, f, {
            placement: "bottom-start"
          }), t.appendChild(f)) : (t.appendChild(f), this._scrollBar.hide()), this._getDomElements(), this._animations ? this._toggleBackdropAnimation() : c.addClass(this._wrapper, this._classes.opacity), this._setActiveClassToTipsOnOpen(l, p, u), this._appendTimes(), this._setActiveClassToTipsOnOpen(l, p, u), this._setTipsAndTimesDependOnInputValue(l, p), this.input.value === "") {
            const _ = d.find(
              `[${K}]`,
              this._modal
            );
            a && (c.addClass(this._PM, this._classes.opacity), this._PM.setAttribute(H, "")), this._hour.textContent = "12", this._minutes.textContent = "00", this._addActiveClassToTip(
              _,
              Number(this._hour.textContent)
            );
          }
          if (this._handleSwitchTimeMode(), this._handleOkButton(), this._handleClose(), r)
            this._handleHoverInlineBtn(), this._handleDocumentClickInline(), this._handleInlineClicks();
          else {
            this._handleSwitchHourMinute(), this._handleClockClick(), this._handleKeyboard();
            const _ = document.querySelector(
              `${os}[${H}]`
            );
            c.addClass(_, this._classes.opacity), c.addStyle(this._hour, {
              pointerEvents: "none"
            }), c.addStyle(this._minutes, {
              pointerEvents: ""
            });
          }
          this._focusTrap = new $i(this._wrapper, {
            event: "keydown",
            condition: ({ key: _ }) => _ === "Tab"
          }), this._focusTrap.trap();
        }, i);
      }
    );
  }
  _handleInlineClicks() {
    let t, e;
    const i = (_) => {
      let m = _;
      return m > 59 ? m = 0 : m < 0 && (m = 59), m;
    }, n = (_) => {
      let m = _;
      return this._options.format24 ? (m > 24 ? m = 1 : m < 0 && (m = 23), m > 23 && (m = 0)) : (m > 12 ? m = 1 : m < 1 && (m = 12), m > 12 && (m = 1)), m;
    }, o = (_) => {
      const m = n(_);
      this._hour.textContent = this._setHourOrMinute(m);
    }, r = (_) => {
      const m = i(_);
      this._minutes.textContent = this._setHourOrMinute(m);
    }, a = () => {
      t += 1, o(t);
    }, l = () => {
      e += 1, r(e);
    }, p = () => {
      t -= 1, o(t);
    }, u = () => {
      e -= 1, r(e);
    }, f = (_) => {
      clearInterval(this._interval), this._interval = setInterval(_, 100);
    };
    oe.on(
      this._modal,
      "click mousedown mouseup touchstart touchend contextmenu",
      `[${Sn}], [${In}]`,
      (_) => {
        t = Number(this._hour.textContent), e = Number(this._minutes.textContent);
        const { target: m, type: g } = _, v = g === "mousedown" || g === "touchstart";
        m.closest(`[${Sn}]`) ? m.closest(`[${Sn}]`).parentNode.hasAttribute(ca) ? v ? f(a) : g === "mouseup" || g === "touchend" || g === "contextmenu" ? clearInterval(this._interval) : a() : v ? f(l) : g === "mouseup" || g === "touchend" || g === "contextmenu" ? clearInterval(this._interval) : l() : m.closest(`[${In}]`) && (m.closest(`[${In}]`).parentNode.hasAttribute(ca) ? v ? f(p) : g === "mouseup" || g === "touchend" ? clearInterval(this._interval) : p() : v ? f(u) : g === "mouseup" || g === "touchend" ? clearInterval(this._interval) : u());
      }
    ), h.on(window, ns, (_) => {
      const m = _.code, g = document.activeElement.hasAttribute(as), v = document.activeElement.hasAttribute(
        Ln
      ), b = document.activeElement === document.body;
      switch (t = Number(this._hour.textContent), e = Number(this._minutes.textContent), m) {
        case "ArrowUp":
          _.preventDefault(), b || g ? (this._hour.focus(), a()) : v && l();
          break;
        case "ArrowDown":
          _.preventDefault(), b || g ? (this._hour.focus(), p()) : v && u();
          break;
      }
    });
  }
  _handleClose() {
    h.on(
      this._modal,
      "click",
      `[${$n}], [${kn}], [${la}]`,
      ({ target: t }) => {
        const { closeModalOnBackdropClick: e } = this._options, i = () => {
          var n;
          c.addStyle(this.elementToggle, {
            pointerEvents: "auto"
          }), this._animations && this._toggleBackdropAnimation(!0), this._removeModal(), (n = this._focusTrap) == null || n.disable(), this._focusTrap = null, this.elementToggle ? this.elementToggle.focus() : this.input && this.input.focus();
        };
        if (t.hasAttribute(la)) {
          this._toggleAmPm("PM"), this.input.value = "", this.input.removeAttribute(H);
          let n;
          R(this.input)[0] === "" ? n = ["12", "00", "PM"] : n = R(this.input);
          const [o, r, a] = n;
          this._setTipsAndTimesDependOnInputValue("12", "00"), this._setActiveClassToTipsOnOpen(o, r, a), this._hour.click();
        } else
          (t.hasAttribute(kn) || t.hasAttribute(On) || t.hasAttribute($n) && e) && i();
      }
    );
  }
  showValueInput() {
    return this.input.value;
  }
  _handleOkButton() {
    oe.on(
      this._modal,
      "click",
      `[${On}]`,
      () => {
        let { maxTime: t, minTime: e } = this._options;
        const {
          format12: i,
          format24: n,
          readOnly: o,
          focusInputAfterApprove: r,
          disablePast: a,
          disableFuture: l
        } = this._options, p = this._document.querySelector(
          `${rs}[${H}]`
        ), u = `${this._hour.textContent}:${this._minutes.textContent}`, f = Number(this._hour.textContent), _ = f === 12 && i ? 0 : f, m = Number(this._minutes.textContent);
        e = Xt(e, a, i), t = Gt(t, l, i);
        let [g, v, b] = R(
          t,
          !1
        ), [C, y, E] = R(
          e,
          !1
        );
        C = C === "12" && i ? "00" : C, g = g === "12" && i ? "00" : g;
        const T = _ < Number(C), A = _ > Number(g);
        let w = !0;
        p && (w = b === p.textContent);
        let S = !0;
        p && (S = E === p.textContent);
        const k = m > v && _ === Number(g), x = m < y && _ === Number(C);
        if (this.input.setAttribute(H, ""), c.addStyle(this.elementToggle, {
          pointerEvents: "auto"
        }), t !== "") {
          if (w && (A || k))
            return;
          if (b === "AM" && p.textContent === "PM")
            return;
        }
        e !== "" && (S && (T || x) || E === "PM" && p.textContent === "AM") || Mf(
          this._options,
          this.input,
          this._hour.textContent
        ) !== void 0 && (this._isInvalidTimeFormat && this.input.removeAttribute(Dn), !o && r && this.input.focus(), c.addStyle(this.elementToggle, {
          pointerEvents: "auto"
        }), n ? this.input.value = u : p === null ? this.input.value = `${u} PM` : this.input.value = `${u} ${p.textContent}`, this._animations && this._toggleBackdropAnimation(!0), this._removeModal(), h.trigger(this.input, "input.te.timepicker"), h.trigger(this.input, "input"));
      }
    );
  }
  _handleHoverInlineBtn() {
    oe.on(
      this._modal,
      "mouseover mouseleave",
      `[${Kf}]`,
      ({ type: t, target: e }) => {
        const i = d.find(
          `[${Yf}]`,
          this._modal
        ), n = d.find(
          `[${jf}]`,
          this._modal
        ), o = (l, p) => l.forEach((u) => {
          if (p) {
            c.addClass(u, this._classes.opacity), u.setAttribute(H, "");
            return;
          }
          c.removeClass(u, this._classes.opacity), u.removeAttribute(H);
        }), a = e.hasAttribute(as) ? i : n;
        o(a, t === "mouseover");
      }
    );
  }
  _handleDocumentClickInline() {
    h.on(document, Jr, ({ target: t }) => {
      if (this._modal && !this._modal.contains(t) && !t.hasAttribute(Ff)) {
        if (clearInterval(this._interval), c.addStyle(this.elementToggle, {
          pointerEvents: "auto"
        }), this._removeModal(), !this._animations)
          return;
        this._toggleBackdropAnimation(!0);
      }
    });
  }
  _handleSwitchHourMinute() {
    Lf(
      "click",
      os,
      this._classes
    ), h.on(
      this._modal,
      "click",
      os,
      () => {
        const { format24: t } = this._options, e = d.find(
          os,
          this._modal
        ), i = d.find(
          `[${X}]`,
          this._modal
        ), n = d.find(
          `[${K}]`,
          this._modal
        ), o = d.find(
          `[${at}]`,
          this._modal
        ), r = Number(this._hour.textContent), a = Number(this._minutes.textContent), l = (p, u) => {
          n.forEach((_) => _.remove()), i.forEach((_) => _.remove()), c.addClass(this._hand, this._classes.transform), setTimeout(() => {
            c.removeClass(this._hand, this._classes.transform);
          }, 401), this._getAppendClock(p, `[${ue}]`, u);
          const f = () => {
            const _ = d.find(
              `[${K}]`,
              this._modal
            ), m = d.find(
              `[${X}]`,
              this._modal
            );
            this._addActiveClassToTip(_, r), this._addActiveClassToTip(m, a);
          };
          if (!t)
            setTimeout(() => {
              f();
            }, 401);
          else {
            const _ = d.find(
              `[${at}]`,
              this._modal
            );
            setTimeout(() => {
              this._addActiveClassToTip(_, r), f();
            }, 401);
          }
        };
        e.forEach((p) => {
          p.hasAttribute(H) && (p.hasAttribute(Ln) ? (c.addClass(this._hand, this._classes.transform), c.addStyle(this._hand, {
            transform: `rotateZ(${this._minutes.textContent * 6}deg)`,
            height: "calc(40% + 1px)"
          }), t && o.length > 0 && o.forEach((u) => u.remove()), l(
            this.minutesArray,
            X
          ), this._hour.style.pointerEvents = "", this._minutes.style.pointerEvents = "none") : p.hasAttribute(as) && (c.addStyle(this._hand, {
            transform: `rotateZ(${this._hour.textContent * 30}deg)`
          }), Number(this._hour.textContent) > 12 ? (c.addStyle(this._hand, {
            transform: `rotateZ(${this._hour.textContent * 30 - 360}deg)`,
            height: "21.5%"
          }), Number(this._hour.textContent) > 12 && c.addStyle(this._hand, {
            height: "21.5%"
          })) : c.addStyle(this._hand, {
            height: "calc(40% + 1px)"
          }), t && this._getAppendClock(
            this.innerHours,
            `[${ai}]`,
            at
          ), o.length > 0 && o.forEach((u) => u.remove()), l(
            this.hoursArray,
            K
          ), c.addStyle(this._hour, {
            pointerEvents: "none"
          }), c.addStyle(this._minutes, {
            pointerEvents: ""
          })));
        });
      }
    );
  }
  _handleDisablingTipsMaxTime(t, e, i, n) {
    if (!this._options.maxTime && !this._options.disableFuture)
      return;
    const o = d.find(
      `[${K}]`
    ), r = d.find(
      `[${at}]`
    ), a = d.find(
      `[${X}]`
    );
    if (!e || e === t) {
      qr(
        r,
        n,
        this._classes,
        this._options.format12
      ), qr(
        o,
        n,
        this._classes,
        this._options.format12
      ), Nf(
        a,
        i,
        n,
        this._hour.textContent,
        this._classes,
        this._options.format12
      );
      return;
    }
    e === "AM" && t === "PM" && (o.forEach((l) => {
      c.addClass(l, this._classes.tipsDisabled), l.setAttribute(Yt, "");
    }), a.forEach((l) => {
      c.addClass(l, this._classes.tipsDisabled), l.setAttribute(Yt, "");
    }));
  }
  _handleDisablingTipsMinTime(t, e, i, n) {
    if (!this._options.minTime && !this._options.disablePast)
      return;
    const o = d.find(
      `[${K}]`
    ), r = d.find(
      `[${at}]`
    ), a = d.find(
      `[${X}]`
    );
    !e || e === t ? (Zr(
      o,
      n,
      this._classes,
      this._options.format12
    ), Zr(
      r,
      n,
      this._classes,
      this._options.format12
    ), Rf(
      a,
      i,
      n,
      this._hour.textContent,
      this._classes,
      this._options.format12
    )) : e === "PM" && t === "AM" && (o.forEach((l) => {
      c.addClass(l, this._classes.tipsDisabled), l.setAttribute(Yt, "");
    }), a.forEach((l) => {
      c.addClass(l, this._classes.tipsDisabled), l.setAttribute(Yt, "");
    }));
  }
  _handleSwitchTimeMode() {
    h.on(
      document,
      "click",
      rs,
      ({ target: t }) => {
        let { maxTime: e, minTime: i } = this._options;
        const { disablePast: n, disableFuture: o, format12: r } = this._options;
        i = Xt(i, n, r), e = Gt(e, o, r);
        const [a, l, p] = R(
          e,
          !1
        ), [u, f, _] = R(
          i,
          !1
        ), m = d.find(
          `[${K}]`
        ), g = d.find(
          `[${X}]`
        );
        (() => {
          m.forEach((b) => {
            c.removeClass(b, this._classes.tipsDisabled), b.removeAttribute(Yt);
          }), g.forEach((b) => {
            c.removeClass(b, this._classes.tipsDisabled), b.removeAttribute(Yt);
          });
        })(), this._handleDisablingTipsMinTime(
          t.textContent,
          _,
          f,
          u
        ), this._handleDisablingTipsMaxTime(
          t.textContent,
          p,
          l,
          a
        ), this._toggleAmPm(t.textContent), t.hasAttribute(H) || (d.find(
          rs
        ).forEach((C) => {
          C.hasAttribute(H) && (c.removeClass(C, this._classes.opacity), C.removeAttribute(H));
        }), c.addClass(t, this._classes.opacity), t.setAttribute(H, ""));
      }
    );
  }
  _handleClockClick() {
    let { maxTime: t, minTime: e } = this._options;
    const { disablePast: i, disableFuture: n, format12: o } = this._options;
    e = Xt(e, i, o), t = Gt(t, n, o);
    const r = R(t, !1)[2], a = R(e, !1)[2], l = R(t, !1)[0], p = R(e, !1)[0], u = d.findOne(
      `[${da}]`
    );
    oe.on(
      document,
      `${ta} ${ea} ${ia} ${sa} ${na} ${aa} ${oa} ${ra}`,
      "",
      (f) => {
        ss() || f.preventDefault();
        const { type: _, target: m } = f, { closeModalOnMinutesClick: g, switchHoursToMinutesOnClick: v } = this._options, b = d.findOne(
          `[${X}]`,
          this._modal
        ) !== null, C = d.findOne(
          `[${K}]`,
          this._modal
        ) !== null, y = d.findOne(
          `[${at}]`,
          this._modal
        ) !== null, E = d.find(
          `[${X}]`,
          this._modal
        ), T = Gr(f, u), A = u.offsetWidth / 2;
        let w = Math.atan2(T.y - A, T.x - A);
        if (ss()) {
          const $ = Gr(f, u, !0);
          w = Math.atan2($.y - A, $.x - A);
        }
        let S = null, k = null, x = null;
        if (_ === "mousedown" || _ === "mousemove" || _ === "touchmove" || _ === "touchstart")
          (_ === "mousedown" || _ === "touchstart" || _ === "touchmove") && (this._hasTargetInnerClass(m) || m.hasAttribute(da) || m.hasAttribute(ue) || m.hasAttribute(X) || m.hasAttribute(K) || m.hasAttribute(Nn) || m.hasAttribute(Mn) || m.hasAttribute(ua) || m.hasAttribute(ls)) && (this._isMouseMove = !0, ss() && f.touches && (S = f.touches[0].clientX, k = f.touches[0].clientY, x = document.elementFromPoint(S, k)));
        else if (_ === "mouseup" || _ === "touchend") {
          if (this._isMouseMove = !1, this._hasTargetInnerClass(m) || m.hasAttribute(ue) || m.hasAttribute(K) || m.hasAttribute(Nn) || m.hasAttribute(Mn) || m.hasAttribute(ua) || m.hasAttribute(ls)) {
            if ((C || y) && v) {
              const $ = Number(this._hour.textContent) > l || Number(this._hour.textContent) < p;
              if (this._options.format24 && l !== "" && p !== "" && $)
                return;
              if (this._options.format24 && p !== "" && Number(this._hour.textContent) < p)
                return;
            }
            h.trigger(this._minutes, "click");
          }
          if (b && g) {
            const $ = d.findOne(
              `[${On}]`,
              this._modal
            );
            h.trigger($, "click");
          }
        }
        if (b) {
          let $;
          const O = Math.trunc(w * 180 / Math.PI) + 90, { degrees: M, minute: P } = this._makeMinutesDegrees(O, $);
          if (this._handlerMaxMinMinutesOptions(M, P) === void 0)
            return;
          const { degrees: tt, minute: et } = this._handlerMaxMinMinutesOptions(M, P);
          if (this._isMouseMove) {
            if (c.addStyle(this._hand, {
              transform: `rotateZ(${tt}deg)`
            }), et === void 0)
              return;
            const U = () => et >= 10 || et === "00" ? et : `0${et}`;
            this._minutes.textContent = U(), this._toggleClassActive(
              this.minutesArray,
              this._minutes,
              E
            ), this._toggleBackgroundColorCircle(
              `[${X}]`
            ), this._objWithDataOnChange.degreesMinutes = tt, this._objWithDataOnChange.minutes = et;
          }
        }
        if (C || y) {
          let $, O = Math.trunc(w * 180 / Math.PI) + 90;
          if (O = Math.round(O / 30) * 30, c.addStyle(this._circle, {
            backgroundColor: "#1976d2"
          }), this._makeHourDegrees(m, O, $) === void 0)
            return;
          const M = () => {
            if (ss() && O && x) {
              const { degrees: P, hour: tt } = this._makeHourDegrees(x, O, $);
              return this._handleMoveHand(
                x,
                tt,
                P
              );
            } else {
              const { degrees: P, hour: tt } = this._makeHourDegrees(m, O, $);
              return this._handleMoveHand(m, tt, P);
            }
          };
          this._objWithDataOnChange.degreesHours = O, this._handlerMaxMinHoursOptions(
            O,
            l,
            p,
            r,
            a,
            f
          ) && M();
        }
        f.stopPropagation();
      }
    );
  }
  _hasTargetInnerClass(t) {
    return t.hasAttribute(ai) || t.hasAttribute(at) || t.hasAttribute(cs);
  }
  _handleMoveHand(t, e, i) {
    const n = d.find(
      `[${K}]`,
      this._modal
    ), o = d.find(
      `[${at}]`,
      this._modal
    );
    this._isMouseMove && (this._hasTargetInnerClass(t) ? c.addStyle(this._hand, {
      height: "21.5%"
    }) : c.addStyle(this._hand, {
      height: "calc(40% + 1px)"
    }), c.addStyle(this._hand, {
      transform: `rotateZ(${i}deg)`
    }), this._hour.textContent = e >= 10 || e === "00" ? e : `0${e}`, this._toggleClassActive(this.hoursArray, this._hour, n), this._toggleClassActive(this.innerHours, this._hour, o), this._objWithDataOnChange.hour = e >= 10 || e === "00" ? e : `0${e}`);
  }
  _handlerMaxMinMinutesOptions(t, e) {
    let { maxTime: i, minTime: n } = this._options;
    const { format12: o, increment: r, disablePast: a, disableFuture: l } = this._options;
    n = Xt(n, a, o), i = Gt(i, l, o);
    const p = R(i, !1)[1], u = R(n, !1)[1], f = R(i, !1)[0], _ = R(n, !1)[0], m = _ === "12" && o ? "0" : _, g = f === "12" && o ? "0" : f, v = R(i, !1)[2], b = R(n, !1)[2], C = p !== "" ? p * 6 : "", y = u !== "" ? u * 6 : "", E = Number(this._hour.textContent), T = E === 12 && o ? 0 : E;
    if (!v && !b) {
      if (i !== "" && n !== "") {
        if (Number(g) === T && t > C || Number(m) === T && t < y)
          return t;
      } else if (n !== "" && T <= Number(m)) {
        if (t <= y - 6)
          return t;
      } else if (i !== "" && T >= Number(g) && t >= C + 6)
        return t;
    } else {
      if (n !== "") {
        if (b === "PM" && this._isAmEnabled)
          return;
        if (b === "PM" && this._isPmEnabled) {
          if (T < Number(m))
            return;
          if (T <= Number(m) && t <= y - 6)
            return t;
        } else if (b === "AM" && this._isAmEnabled) {
          if (T < Number(m))
            return;
          if (T <= Number(m) && t <= y - 6)
            return t;
        }
      }
      if (i !== "") {
        if (v === "AM" && this._isPmEnabled)
          return;
        if (v === "PM" && this._isPmEnabled) {
          if (T >= Number(g) && t >= C + 6)
            return t;
        } else if (v === "AM" && this._isAmEnabled && T >= Number(g) && t >= C + 6)
          return t;
      }
    }
    return r && (t = Math.round(t / 30) * 30), t < 0 ? t = 360 + t : t >= 360 && (t = 0), {
      degrees: t,
      minute: e
    };
  }
  _removeModal() {
    this._animations ? setTimeout(() => {
      this._removeModalElements(), this._scrollBar.reset();
    }, 300) : (this._removeModalElements(), this._scrollBar.reset()), oe.off(
      this._document,
      `${Jr} ${ns} ${ta} ${ea} ${ia} ${sa} ${na} ${aa} ${oa} ${ra}`
    ), h.off(window, ns);
  }
  _removeModalElements() {
    this._modal && this._modal.remove();
  }
  _toggleBackdropAnimation(t = !1) {
    t ? this._wrapper.classList.add("animate-[fade-out_350ms_ease-in-out]") : (this._wrapper.classList.add("animate-[fade-in_350ms_ease-in-out]"), this._options.inline || c.addClass(this._clock, this._classes.clockAnimation)), setTimeout(() => {
      this._wrapper.classList.remove(
        "animate-[fade-out_350ms_ease-in-out]",
        "animate-[fade-in_350ms_ease-in-out]"
      );
    }, 351);
  }
  _addActiveClassToTip(t, e) {
    t.forEach((i) => {
      Number(i.textContent) === Number(e) && (c.addClass(i, this._classes.tipsActive), i.setAttribute(H, ""));
    });
  }
  _setHourOrMinute(t) {
    return t < 10 ? `0${t}` : t;
  }
  _appendTimes() {
    const { format24: t } = this._options;
    if (t) {
      this._getAppendClock(
        this.hoursArray,
        `[${ue}]`,
        K
      ), this._getAppendClock(
        this.innerHours,
        `[${ai}]`,
        at
      );
      return;
    }
    this._getAppendClock(
      this.hoursArray,
      `[${ue}]`,
      K
    );
  }
  _getConfig(t) {
    const e = c.getDataAttributes(this._element);
    return t = {
      ...Gf,
      ...e,
      ...t
    }, L(yi, t, qf), t;
  }
  _getClasses(t) {
    const e = c.getDataClassAttributes(this._element);
    return t = {
      ...Zf,
      ...e,
      ...t
    }, L(yi, t, Qf), t;
  }
  _getContainer() {
    return d.findOne(this._options.container);
  }
  _getValidate(t) {
    const { invalidLabel: e, format24: i, format12: n, appendValidationInfo: o } = this._options;
    let r;
    o && (r = D("div"), r.setAttribute(ha, ""), c.addClass(r, this._classes.invalidFeedback), r.innerHTML = e), oe.on(this.input, t, ({ target: a }) => {
      if (this._options === null || this.input.value === "")
        return;
      const l = /^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/, p = /^([01]\d|2[0-3])(:[0-5]\d)$/, u = l.test(a.value);
      if (p.test(a.value) !== !0 && i || u !== !0 && n) {
        o && (this.input.setAttribute(Dn, ""), this.input.parentNode.insertBefore(
          r,
          this.input.nextSibling
        )), c.addStyle(a, { marginBottom: 0 }), c.addStyle(r, { bottom: "-23px" }), this._isInvalidTimeFormat = !0;
        return;
      }
      this.input.removeAttribute(Dn), this._isInvalidTimeFormat = !1;
      const _ = d.findOne(
        `[${ha}]`
      );
      _ !== null && _.remove();
    });
  }
  // Static
  static getInstance(t) {
    return I.getData(t, Ss);
  }
  static getOrCreateInstance(t, e = {}) {
    return this.getInstance(t) || new this(t, typeof e == "object" ? e : null);
  }
}
const Jf = {
  threshold: 10,
  direction: "all"
};
class tm {
  constructor(t, e) {
    this._element = t, this._startPosition = null, this._options = {
      ...Jf,
      ...e
    };
  }
  handleTouchStart(t) {
    this._startPosition = this._getCoordinates(t);
  }
  handleTouchMove(t) {
    if (!this._startPosition)
      return;
    const e = this._getCoordinates(t), i = {
      x: e.x - this._startPosition.x,
      y: e.y - this._startPosition.y
    }, n = this._getDirection(i);
    if (this._options.direction === "all") {
      if (n.y.value < this._options.threshold && n.x.value < this._options.threshold)
        return;
      const r = n.y.value > n.x.value ? n.y.direction : n.x.direction;
      h.trigger(this._element, `swipe${r}`), h.trigger(this._element, "swipe", { direction: r }), this._startPosition = null;
      return;
    }
    const o = this._options.direction === "left" || this._options === "right" ? "x" : "y";
    n[o].direction === this._options.direction && n[o].value > this._options.threshold && (h.trigger(this._element, `swipe${n[o].direction}`), this._startPosition = null);
  }
  handleTouchEnd() {
    this._startPosition = null;
  }
  _getCoordinates(t) {
    const [e] = t.touches;
    return {
      x: e.clientX,
      y: e.clientY
    };
  }
  _getDirection(t) {
    return {
      x: {
        direction: t.x < 0 ? "left" : "right",
        value: Math.abs(t.x)
      },
      y: {
        direction: t.y < 0 ? "up" : "down",
        value: Math.abs(t.y)
      }
    };
  }
}
class em {
  constructor(t, e = "swipe", i = {}) {
    this._element = t, this._event = e, this.swipe = new tm(t, i), this._touchStartHandler = this._handleTouchStart.bind(this), this._touchMoveHandler = this._handleTouchMove.bind(this), this._touchEndHandler = this._handleTouchEnd.bind(this);
  }
  dispose() {
    this._element.removeEventListener("touchstart", this._touchStartHandler), this._element.removeEventListener("touchmove", this._touchMoveHandler), window.removeEventListener("touchend", this._touchEndHandler);
  }
  init() {
    this._element.addEventListener(
      "touchstart",
      (t) => this._handleTouchStart(t)
    ), this._element.addEventListener(
      "touchmove",
      (t) => this._handleTouchMove(t)
    ), window.addEventListener("touchend", (t) => this._handleTouchEnd(t));
  }
  _handleTouchStart(t) {
    this[this._event].handleTouchStart(t);
  }
  _handleTouchMove(t) {
    this[this._event].handleTouchMove(t);
  }
  _handleTouchEnd(t) {
    this[this._event].handleTouchEnd(t);
  }
}
const _a = "sidenav", hs = "te.sidenav", im = "data-te-sidenav-rotate-icon-ref", Rn = "[data-te-sidenav-toggle-ref]", sm = "[data-te-collapse-init]", nm = '[data-te-sidenav-slim="true"]', om = '[data-te-sidenav-slim="false"]', rm = "[data-te-sidenav-menu-ref]", ke = "[data-te-sidenav-collapse-ref]", li = "[data-te-sidenav-link-ref]", am = F() ? 100 : -100, lm = F() ? -100 : 100, cm = {
  sidenavAccordion: "(boolean)",
  sidenavBackdrop: "(boolean)",
  sidenavBackdropClass: "(null|string)",
  sidenavCloseOnEsc: "(boolean)",
  sidenavColor: "(string)",
  sidenavContent: "(null|string)",
  sidenavExpandable: "(boolean)",
  sidenavExpandOnHover: "(boolean)",
  sidenavFocusTrap: "(boolean)",
  sidenavHidden: "(boolean)",
  sidenavMode: "(string)",
  sidenavModeBreakpointOver: "(null|string|number)",
  sidenavModeBreakpointSide: "(null|string|number)",
  sidenavModeBreakpointPush: "(null|string|number)",
  sidenavBreakpointSm: "(number)",
  sidenavBreakpointMd: "(number)",
  sidenavBreakpointLg: "(number)",
  sidenavBreakpointXl: "(number)",
  sidenavBreakpoint2xl: "(number)",
  sidenavScrollContainer: "(null|string)",
  sidenavSlim: "(boolean)",
  sidenavSlimCollapsed: "(boolean)",
  sidenavSlimWidth: "(number)",
  sidenavPosition: "(string)",
  sidenavRight: "(boolean)",
  sidenavTransitionDuration: "(number)",
  sidenavWidth: "(number)"
}, hm = {
  sidenavAccordion: !1,
  sidenavBackdrop: !0,
  sidenavBackdropClass: null,
  sidenavCloseOnEsc: !0,
  sidenavColor: "primary",
  sidenavContent: null,
  sidenavExpandable: !0,
  sidenavExpandOnHover: !1,
  sidenavFocusTrap: !0,
  sidenavHidden: !0,
  sidenavMode: "over",
  sidenavModeBreakpointOver: null,
  sidenavModeBreakpointSide: null,
  sidenavModeBreakpointPush: null,
  sidenavBreakpointSm: 640,
  sidenavBreakpointMd: 768,
  sidenavBreakpointLg: 1024,
  sidenavBreakpointXl: 1280,
  sidenavBreakpoint2xl: 1536,
  sidenavScrollContainer: null,
  sidenavSlim: !1,
  sidenavSlimCollapsed: !1,
  sidenavSlimWidth: 77,
  sidenavPosition: "fixed",
  sidenavRight: !1,
  sidenavTransitionDuration: 300,
  sidenavWidth: 240
};
class pi {
  constructor(t, e = {}) {
    At(this, "_addBackdropOnInit", () => {
      this._options.sidenavHidden || (this._backdrop.show(), h.off(this._element, "transitionend", this._addBackdropOnInit));
    });
    this._element = t, this._options = e, this._ID = bt(""), this._content = null, this._initialContentStyle = null, this._slimCollapsed = !1, this._activeNode = null, this._tempSlim = !1, this._backdrop = this._initializeBackDrop(), this._focusTrap = null, this._perfectScrollbar = null, this._touch = null, this._setModeFromBreakpoints(), this.escHandler = (i) => {
      i.keyCode === Li && this.toggler && Lt(this.toggler) && (this._update(!1), h.off(window, "keydown", this.escHandler));
    }, this.hashHandler = () => {
      this._setActiveElements();
    }, t && (I.setData(t, hs, this), this._setup()), this.options.sidenavBackdrop && !this.options.sidenavHidden && this.options.sidenavMode === "over" && h.on(this._element, "transitionend", this._addBackdropOnInit), this._didInit = !1, this._init();
  }
  // Getters
  static get NAME() {
    return _a;
  }
  get container() {
    if (this.options.sidenavPosition === "fixed")
      return d.findOne("body");
    const t = (e) => !e.parentNode || e.parentNode === document ? e : e.parentNode.style.position === "relative" || e.parentNode.classList.contains("relative") ? e.parentNode : t(e.parentNode);
    return t(this._element);
  }
  get isVisible() {
    let t = 0, e = window.innerWidth;
    if (this.options.sidenavPosition !== "fixed") {
      const n = this.container.getBoundingClientRect();
      t = n.x, e = n.x + n.width;
    }
    const { x: i } = this._element.getBoundingClientRect();
    return this.options.sidenavRight ? Math.abs(i - e) > 10 : Math.abs(i - t) < 10;
  }
  get links() {
    return d.find(li, this._element);
  }
  get navigation() {
    return d.find(rm, this._element);
  }
  get options() {
    const t = {
      ...hm,
      ...c.getDataAttributes(this._element),
      ...this._options
    };
    return L(_a, t, cm), t;
  }
  get sidenavStyle() {
    return {
      width: `${this.width}px`,
      height: this.options.sidenavPosition === "fixed" ? "100vh" : "100%",
      position: this.options.sidenavPosition,
      transition: `all ${this.transitionDuration} linear`
    };
  }
  get toggler() {
    return d.find(Rn).find(
      (e) => {
        const i = c.getDataAttribute(e, "target");
        return d.findOne(i) === this._element;
      }
    );
  }
  get transitionDuration() {
    return `${this.options.sidenavTransitionDuration / 1e3}s`;
  }
  get translation() {
    return this.options.sidenavRight ? lm : am;
  }
  get width() {
    return this._slimCollapsed ? this.options.sidenavSlimWidth : this.options.sidenavWidth;
  }
  get isBackdropVisible() {
    return !!this._backdrop._element;
  }
  // Public
  changeMode(t) {
    this._setMode(t);
  }
  dispose() {
    h.off(window, "keydown", this.escHandler), this.options.sidenavBackdrop && this._backdrop.dispose(), h.off(window, "hashchange", this.hashHandler), this._touch.dispose(), I.removeData(this._element, hs), this._element = null;
  }
  hide() {
    this._emitEvents(!1), this._update(!1), this._options.sidenavBackdrop && this.isBackdropVisible && this._backdrop.hide();
  }
  show() {
    this._emitEvents(!0), this._update(!0), this._options.sidenavBackdrop && this._options.sidenavMode === "over" && this._backdrop.show();
  }
  toggle() {
    this._emitEvents(!this.isVisible), this._update(!this.isVisible);
  }
  toggleSlim() {
    this._setSlim(!this._slimCollapsed);
  }
  update(t) {
    this._options = t, this._setup();
  }
  getBreakpoint(t) {
    return this._transformBreakpointValuesToObject()[t];
  }
  // Private
  _init() {
    this._didInit || (h.on(
      document,
      "click",
      Rn,
      pi.toggleSidenav()
    ), this._didInit = !0);
  }
  _transformBreakpointValuesToObject() {
    return {
      sm: this.options.sidenavBreakpointSm,
      md: this.options.sidenavBreakpointMd,
      lg: this.options.sidenavBreakpointLg,
      xl: this.options.sidenavBreakpointXl,
      "2xl": this.options.sidenavBreakpoint2xl
    };
  }
  _setModeFromBreakpoints() {
    const t = window.innerWidth, e = this._transformBreakpointValuesToObject();
    if (t === void 0 || !e)
      return;
    const i = typeof this.options.sidenavModeBreakpointOver == "number" ? t - this.options.sidenavModeBreakpointOver : t - e[this.options.sidenavModeBreakpointOver], n = typeof this.options.sidenavModeBreakpointSide == "number" ? t - this.options.sidenavModeBreakpointSide : t - e[this.options.sidenavModeBreakpointSide], o = typeof this.options.sidenavModeBreakpointPush == "number" ? t - this.options.sidenavModeBreakpointPush : t - e[this.options.sidenavModeBreakpointPush], r = (l, p) => l - p < 0 ? -1 : p - l < 0 ? 1 : 0, a = [i, n, o].filter((l) => l != null && l >= 0).sort(r)[0];
    i > 0 && i === a ? (this._options.sidenavMode = "over", this._options.sidenavHidden = !0) : n > 0 && n === a ? this._options.sidenavMode = "side" : o > 0 && o === a && (this._options.sidenavMode = "push");
  }
  _collapseItems() {
    this.navigation.forEach((t) => {
      d.find(ke, t).forEach((i) => {
        qt.getInstance(i).hide();
      });
    });
  }
  _getOffsetValue(t, { index: e, property: i, offsets: n }) {
    const o = this._getPxValue(
      this._initialContentStyle[e][n[i].property]
    ), r = t ? n[i].value : 0;
    return o + r;
  }
  _getProperty(...t) {
    return t.map((e, i) => i === 0 ? e : e[0].toUpperCase().concat(e.slice(1))).join("");
  }
  _getPxValue(t) {
    return t ? parseFloat(t) : 0;
  }
  _handleSwipe(t, e) {
    e && this._slimCollapsed && this.options.sidenavSlim && this.options.sidenavExpandable ? this.toggleSlim() : e || (this._slimCollapsed || !this.options.sidenavSlim || !this.options.sidenavExpandable ? this.toggler && Lt(this.toggler) && this.toggle() : this.toggleSlim());
  }
  _isActive(t, e) {
    return e ? e === t : t.attributes.href ? new URL(t, window.location.href).href === window.location.href : !1;
  }
  _isAllToBeCollapsed() {
    return d.find(
      sm,
      this._element
    ).filter(
      (i) => i.getAttribute("aria-expanded") === "true"
    ).length === 0;
  }
  _isAllCollapsed() {
    return d.find(ke, this._element).filter(
      (t) => Lt(t)
    ).length === 0;
  }
  _initializeBackDrop() {
    if (!this.options.sidenavBackdrop)
      return;
    const t = this.options.sidenavBackdropClass ? this.options.sidenavBackdropClass.split(" ") : this.options.sidenavPosition ? [
      "opacity-50",
      "transition-all",
      "duration-300",
      "ease-in-out",
      this.options.sidenavPosition,
      "top-0",
      "left-0",
      "z-50",
      "bg-black/10",
      "dark:bg-black-60",
      "w-full",
      "h-full",
      this._element.id
    ] : null;
    return new So({
      isVisible: this.options.sidenavBackdrop,
      isAnimated: !0,
      rootElement: this._element.parentNode,
      backdropClasses: t,
      clickCallback: () => this.hide()
    });
  }
  _updateBackdrop(t) {
    if (this.options.sidenavMode === "over") {
      t ? this._backdrop.show() : this.isBackdropVisible && this._backdrop.hide();
      return;
    }
    this.isBackdropVisible && this._backdrop.hide();
  }
  _setup() {
    this._setupTouch(), this.options.sidenavFocusTrap && this._setupFocusTrap(), this._setupCollapse(), this.options.sidenavSlim && this._setupSlim(), this._setupInitialStyling(), this._setupScrolling(), this.options.sidenavContent && this._setupContent(), this._setupActiveState(), this._setupRippleEffect(), this.options.sidenavHidden || this._updateOffsets(!0, !0), this.options.sidenavMode === "over" && this._setTabindex(!0);
  }
  _setupActiveState() {
    this._setActiveElements(), this.links.forEach((t) => {
      h.on(t, "click", () => this._setActiveElements(t)), h.on(t, "keydown", (e) => {
        e.keyCode === lt && this._setActiveElements(t);
      });
    }), h.on(window, "hashchange", this.hashHandler);
  }
  _setupCollapse() {
    this.navigation.forEach((t, e) => {
      d.find(ke, t).forEach(
        (n, o) => this._setupCollapseList({ list: n, index: o, menu: t, menuIndex: e })
      );
    });
  }
  _generateCollpaseID(t, e) {
    return `sidenav-collapse-${this._ID}-${e}-${t}`;
  }
  _setupCollapseList({ list: t, index: e, menu: i, menuIndex: n }) {
    const o = this._generateCollpaseID(e, n);
    t.setAttribute("id", o), t.setAttribute("data-te-collapse-item", "");
    const [r] = d.prev(t, li);
    c.setDataAttribute(r, "collapse-init", ""), r.setAttribute("href", `#${o}`), r.setAttribute("role", "button");
    const a = qt.getInstance(t) || new qt(t, {
      toggle: !1,
      parent: this.options.sidenavAccordion ? i : t
    });
    (t.dataset.teSidenavStateShow === "" || t.dataset.teCollapseShow === "") && this._rotateArrow(r, !1), h.on(r, "click", (l) => {
      this._toggleCategory(l, a, t), this._tempSlim && this._isAllToBeCollapsed() && (this._setSlim(!0), this._tempSlim = !1), this.options.sidenavMode === "over" && this._focusTrap && this._focusTrap.update();
    }), h.on(
      t,
      "show.te.collapse",
      () => this._rotateArrow(r, !1)
    ), h.on(
      t,
      "hide.te.collapse",
      () => this._rotateArrow(r, !0)
    ), h.on(t, "shown.te.collapse", () => {
      this.options.sidenavMode === "over" && this._focusTrap && this._focusTrap.update();
    }), h.on(t, "hidden.te.collapse", () => {
      this._tempSlim && this._isAllCollapsed() && (this._setSlim(!0), this._tempSlim = !1), this.options.sidenavMode === "over" && this._focusTrap && this._focusTrap.update();
    });
  }
  _setupContent() {
    this._content = d.find(this.options.sidenavContent), this._content.forEach((t) => {
      const e = [
        "!p",
        "!m",
        "!px",
        "!pl",
        "!pr",
        "!mx",
        "!ml",
        "!mr",
        "!-p",
        "!-m",
        "!-px",
        "!-pl",
        "!-pr",
        "!-mx",
        "!-ml",
        "!-mr"
      ];
      [...t.classList].filter(
        (n) => e.findIndex((o) => n.includes(o)) >= 0
      ).forEach((n) => t.classList.remove(n));
    }), this._initialContentStyle = this._content.map((t) => {
      const { paddingLeft: e, paddingRight: i, marginLeft: n, marginRight: o, transition: r } = window.getComputedStyle(t);
      return { paddingLeft: e, paddingRight: i, marginLeft: n, marginRight: o, transition: r };
    });
  }
  _setupFocusTrap() {
    this._focusTrap = new $i(
      this._element,
      {
        event: "keydown",
        condition: (t) => t.keyCode === Oi,
        onlyVisible: !0
      },
      this.toggler
    );
  }
  _setupInitialStyling() {
    this._setColor(), c.style(this._element, this.sidenavStyle);
  }
  _setupScrolling() {
    let t = this._element;
    if (this.options.sidenavScrollContainer) {
      t = d.findOne(
        this.options.sidenavScrollContainer,
        this._element
      );
      const i = Vc(t.parentNode.children).filter(
        (n) => n !== t
      ).reduce((n, o) => n + o.clientHeight, 0);
      c.style(t, {
        maxHeight: `calc(100% - ${i}px)`,
        position: "relative"
      });
    }
    this._perfectScrollbar = new yc(t, {
      suppressScrollX: !0,
      handlers: ["click-rail", "drag-thumb", "wheel", "touch"]
    });
  }
  _setupSlim() {
    this._slimCollapsed = this.options.sidenavSlimCollapsed, this._toggleSlimDisplay(this._slimCollapsed), this.options.sidenavExpandOnHover && (this._element.addEventListener("mouseenter", () => {
      this._slimCollapsed && this._setSlim(!1);
    }), this._element.addEventListener("mouseleave", () => {
      this._slimCollapsed || this._setSlim(!0);
    }));
  }
  _setupRippleEffect() {
    this.links.forEach((t) => {
      let e = Ue.getInstance(t), i = this.options.sidenavColor;
      if (e && e._options.sidenavColor !== this.options.sidenavColor)
        e.dispose();
      else if (e)
        return;
      (localStorage.theme === "dark" || !("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches) && (i = "white"), e = new Ue(t, { rippleColor: i });
    });
  }
  _setupTouch() {
    this._touch = new em(this._element, "swipe", { threshold: 20 }), this._touch.init(), h.on(
      this._element,
      "swipeleft",
      (t) => this._handleSwipe(t, this.options.sidenavRight)
    ), h.on(
      this._element,
      "swiperight",
      (t) => this._handleSwipe(t, !this.options.sidenavRight)
    );
  }
  _setActive(t, e) {
    t.setAttribute("data-te-sidebar-state-active", ""), this._activeNode && t.removeAttribute("data-te-sidebar-state-active"), this._activeNode = t;
    const [i] = d.parents(
      this._activeNode,
      ke
    );
    if (!i) {
      this._setActiveCategory();
      return;
    }
    const [n] = d.prev(i, li);
    this._setActiveCategory(n), !e && !this._slimCollapsed && qt.getInstance(i).show();
  }
  _setActiveCategory(t) {
    this.navigation.forEach((e) => {
      d.find(ke, e).forEach((n) => {
        const [o] = d.prev(n, li);
        o !== t ? o.removeAttribute("data-te-sidenav-state-active") : o.setAttribute("data-te-sidenav-state-active", "");
      });
    });
  }
  _setActiveElements(t) {
    this.navigation.forEach((e) => {
      d.find(li, e).filter((n) => d.next(n, ke).length === 0).forEach((n) => {
        this._isActive(n, t) && n !== this._activeNode && this._setActive(n, t);
      });
    }), t && this._updateFocus(this.isVisible);
  }
  _setColor() {
    const t = [
      "primary",
      "secondary",
      "success",
      "info",
      "warning",
      "danger",
      "light",
      "dark"
    ], { sidenavColor: e } = this.options, i = t.includes(e) ? e : "primary";
    t.forEach((n) => {
      this._element.classList.remove(`sidenav-${n}`);
    }), c.addClass(this._element, `sidenav-${i}`);
  }
  _setContentOffsets(t, e, i) {
    this._content.forEach((n, o) => {
      const r = this._getOffsetValue(t, {
        index: o,
        property: "padding",
        offsets: e
      }), a = this._getOffsetValue(t, {
        index: o,
        property: "margin",
        offsets: e
      }), l = {};
      if (i || (l.transition = `all ${this.transitionDuration} linear`), l[e.padding.property] = `${r}px`, l[e.margin.property] = `${a}px`, c.style(n, l), !!t) {
        if (i) {
          c.style(n, {
            transition: this._initialContentStyle[o].transition
          });
          return;
        }
        h.on(n, "transitionend", () => {
          c.style(n, {
            transition: this._initialContentStyle[o].transition
          });
        });
      }
    });
  }
  _setMode(t) {
    this.options.sidenavMode !== t && (this._options.sidenavMode = t, this._update(this.isVisible));
  }
  _setSlim(t) {
    const e = t ? ["collapse", "collapsed"] : ["expand", "expanded"];
    this._triggerEvents(...e), t && this._collapseItems(), this._slimCollapsed = t, this._toggleSlimDisplay(t), c.style(this._element, { width: `${this.width}px` }), this._updateOffsets(this.isVisible);
  }
  _setTabindex(t) {
    this.links.forEach((e) => {
      e.tabIndex = t ? 0 : -1;
    });
  }
  _emitEvents(t) {
    const e = t ? ["show", "shown"] : ["hide", "hidden"];
    this._triggerEvents(...e);
  }
  _rotateArrow(t, e) {
    const [i] = d.children(t, `[${im}]`);
    i && (e ? c.removeClass(i, "rotate-180") : c.addClass(i, "rotate-180"));
  }
  _toggleCategory(t, e) {
    t.preventDefault(), e.toggle(), this._slimCollapsed && this.options.sidenavExpandable && (this._tempSlim = !0, this._setSlim(!1));
  }
  _toggleSlimDisplay(t) {
    const e = d.find(
      nm,
      this._element
    ), i = d.find(
      om,
      this._element
    ), n = () => {
      e.forEach((o) => {
        c.style(o, {
          display: this._slimCollapsed ? "unset" : "none"
        });
      }), i.forEach((o) => {
        c.style(o, {
          display: this._slimCollapsed ? "none" : "unset"
        });
      });
    };
    t ? setTimeout(
      () => n(),
      this.options.sidenavTransitionDuration
    ) : n();
  }
  async _triggerEvents(t, e) {
    h.trigger(this._element, `${t}.te.sidenav`), e && await setTimeout(() => {
      h.trigger(this._element, `${e}.te.sidenav`);
    }, this.options.sidenavTransitionDuration + 5);
  }
  _isiPhone() {
    return /iPhone|iPod/i.test(navigator.userAgent);
  }
  _update(t) {
    t && this._isiPhone() && c.addClass(this._element, "ps--scrolling-y"), this.toggler && this._updateTogglerAria(t), this._updateDisplay(t), this.options.sidenavBackdrop && this._updateBackdrop(t), this._updateOffsets(t), t && this.options.sidenavCloseOnEsc && this.options.sidenavMode !== "side" && h.on(window, "keydown", this.escHandler), this.options.sidenavFocusTrap && this._updateFocus(t);
  }
  _updateDisplay(t) {
    const e = t ? 0 : this.translation;
    c.style(this._element, {
      transform: `translateX(${e}%)`
    });
  }
  _updateFocus(t) {
    if (this._setTabindex(t), this.options.sidenavMode === "over" && this.options.sidenavFocusTrap) {
      if (t) {
        this._focusTrap.trap();
        return;
      }
      this._focusTrap.disable();
    }
    this._focusTrap.disable();
  }
  _updateOffsets(t, e = !1) {
    const [i, n] = this.options.sidenavRight ? ["right", "left"] : ["left", "right"], o = {
      property: this._getProperty("padding", i),
      value: this.options.sidenavMode === "over" ? 0 : this.width
    }, r = {
      property: this._getProperty("margin", n),
      value: this.options.sidenavMode === "push" ? -1 * this.width : 0
    };
    h.trigger(this._element, "update.te.sidenav", {
      margin: r,
      padding: o
    }), this._content && (this._content.className = "", this._setContentOffsets(t, { padding: o, margin: r }, e));
  }
  _updateTogglerAria(t) {
    this.toggler.setAttribute("aria-expanded", t);
  }
  // Static
  static toggleSidenav() {
    return function(t) {
      const e = d.closest(t.target, Rn), i = c.getDataAttributes(e).target;
      d.find(i).forEach((n) => {
        (pi.getInstance(n) || new pi(n)).toggle();
      });
    };
  }
  static jQueryInterface(t, e) {
    return this.each(function() {
      let i = I.getData(this, hs);
      const n = typeof t == "object" && t;
      if (!(!i && /dispose/.test(t)) && (i || (i = new pi(this, n)), typeof t == "string")) {
        if (typeof i[t] > "u")
          throw new TypeError(`No method named "${t}"`);
        i[t](e);
      }
    });
  }
  static getInstance(t) {
    return I.getData(t, hs);
  }
  static getOrCreateInstance(t, e = {}) {
    return this.getInstance(t) || new this(t, typeof e == "object" ? e : null);
  }
}
const lo = "stepper", Is = "te.stepper", Ks = `.${Is}`, Mi = `data-te-${lo}`, _i = "horizontal", xt = "vertical", dm = {
  stepperType: "string",
  stepperLinear: "boolean",
  stepperNoEditable: "boolean",
  stepperActive: "string",
  stepperCompleted: "string",
  stepperInvalid: "string",
  stepperDisabled: "string",
  stepperVerticalBreakpoint: "number",
  stepperMobileBreakpoint: "number",
  stepperMobileBarBreakpoint: "number"
}, um = {
  stepperType: _i,
  stepperLinear: !1,
  stepperNoEditable: !1,
  stepperActive: "",
  stepperCompleted: "",
  stepperInvalid: "",
  stepperDisabled: "",
  stepperVerticalBreakpoint: 0,
  stepperMobileBreakpoint: 0,
  stepperMobileBarBreakpoint: 4
}, fa = `mousedown${Ks}`, ma = `keydown${Ks}`, pm = `keyup${Ks}`, ga = `resize${Ks}`, jt = `[${Mi}-step-ref]`, G = `[${Mi}-head-ref]`, ba = `[${Mi}-head-text-ref]`, ds = `[${Mi}-head-icon-ref]`, st = `[${Mi}-content-ref]`;
class j0 {
  constructor(t, e) {
    this._element = t, this._options = this._getConfig(e), this._elementHeight = 0, this._steps = d.find(`${jt}`, this._element), this._currentView = "", this._activeStepIndex = 0, this._verticalStepperStyles = [], this._element && (I.setData(t, Is, this), this._init());
  }
  // Getters
  static get NAME() {
    return lo;
  }
  get activeStep() {
    return this._steps[this._activeStepIndex];
  }
  get activeStepIndex() {
    return this._activeStepIndex;
  }
  // Public
  dispose() {
    this._steps.forEach((t) => {
      h.off(t, fa), h.off(t, ma);
    }), h.off(window, ga), I.removeData(this._element, Is), this._element = null;
  }
  changeStep(t) {
    this._toggleStep(t);
  }
  nextStep() {
    this._toggleStep(this._activeStepIndex + 1);
  }
  previousStep() {
    this._toggleStep(this._activeStepIndex - 1);
  }
  // Private
  _init() {
    const t = d.find(`${jt}`, this._element)[this._activeStepIndex].setAttribute("data-te", "active-step"), e = d.find(
      `${ba}`,
      this._element
    ), i = d.find(
      `${ds}`,
      this._element
    );
    switch (t ? (this._activeStepIndex = this._steps.indexOf(t), this._toggleStepClass(
      this._activeStepIndex,
      "add",
      this._options.stepperActive
    ), e[this._activeStepIndex].classList.add("font-medium"), i[this._activeStepIndex].classList.add("!bg-primary-100"), i[this._activeStepIndex].classList.add("!text-primary-700")) : (e[this._activeStepIndex].classList.add("font-medium"), i[this._activeStepIndex].classList.add("!bg-primary-100"), i[this._activeStepIndex].classList.add("!text-primary-700"), this._toggleStepClass(
      this._activeStepIndex,
      "add",
      this._options.stepperActive
    )), this._bindMouseDown(), this._bindKeysNavigation(), this._options.stepperType) {
      case xt:
        this._toggleVertical();
        break;
      default:
        this._toggleHorizontal();
        break;
    }
    (this._options.stepperVerticalBreakpoint || this._options.stepperMobileBreakpoint) && this._toggleStepperView(), this._bindResize();
  }
  _getConfig(t) {
    const e = c.getDataAttributes(this._element);
    return t = {
      ...um,
      ...e,
      ...t
    }, L(lo, t, dm), t;
  }
  _bindMouseDown() {
    this._steps.forEach((t) => {
      const e = d.findOne(`${G}`, t);
      h.on(e, fa, (i) => {
        const n = d.parents(i.target, `${jt}`)[0], o = this._steps.indexOf(n);
        i.preventDefault(), this._toggleStep(o);
      });
    });
  }
  _bindResize() {
    h.on(window, ga, () => {
      this._currentView === xt && this._setSingleStepHeight(this.activeStep), this._currentView === _i && this._setHeight(this.activeStep), (this._options.stepperVerticalBreakpoint || this._options.stepperMobileBreakpoint) && this._toggleStepperView();
    });
  }
  _toggleStepperView() {
    const t = this._options.stepperVerticalBreakpoint < window.innerWidth, e = this._options.stepperVerticalBreakpoint > window.innerWidth, i = this._options.stepperMobileBreakpoint > window.innerWidth;
    t && this._currentView !== _i && this._toggleHorizontal(), e && !i && this._currentView !== xt && (this._steps.forEach((n) => {
      const o = d.findOne(`${st}`, n);
      this._resetStepperHeight(), this._showElement(o);
    }), this._toggleVertical());
  }
  _toggleStep(t) {
    this._activeStepIndex !== t && (this._options.stepperNoEditable && this._toggleDisabled(), this._showElement(
      d.findOne(`${st}`, this._steps[t])
    ), this._toggleActive(t), t > this._activeStepIndex && this._toggleCompleted(this._activeStepIndex), this._currentView === _i ? this._animateHorizontalStep(t) : (this._animateVerticalStep(t), this._setSingleStepHeight(this._steps[t])), this._toggleStepTabIndex(
      d.findOne(`${G}`, this.activeStep),
      d.findOne(`${G}`, this._steps[t])
    ), this._activeStepIndex = t, this._steps[this._activeStepIndex].setAttribute("data-te", "active-step"), this._steps.forEach((e, i) => {
      e[this._activeStepIndex] !== i && e.removeAttribute("data-te");
    }));
  }
  _resetStepperHeight() {
    this._element.style.height = "";
  }
  _setStepsHeight() {
    this._steps.forEach((t) => {
      const e = d.findOne(`${st}`, t), i = window.getComputedStyle(e);
      this._verticalStepperStyles.push({
        paddingTop: parseFloat(i.paddingTop),
        paddingBottom: parseFloat(i.paddingBottom)
      });
      const n = e.scrollHeight;
      e.style.height = `${n}px`;
    });
  }
  _setSingleStepHeight(t) {
    const e = d.findOne(`${st}`, t), i = this.activeStep === t, n = this._steps.indexOf(t);
    let o;
    i ? (e.style.height = "", o = e.scrollHeight) : o = e.scrollHeight + this._verticalStepperStyles[n].paddingTop + this._verticalStepperStyles[n].paddingBottom, e.style.height = `${o}px`;
  }
  _toggleVertical() {
    this._currentView = xt, this._setStepsHeight(), this._hideInactiveSteps();
  }
  _toggleHorizontal() {
    this._currentView = _i, this._setHeight(this.activeStep), this._hideInactiveSteps();
  }
  _toggleStepperClass() {
    d.findOne(
      "[data-te-stepper-type]",
      this._element
    ) !== null && this._steps.forEach((e) => {
      d.findOne(`${st}`, e).classList.remove("!my-0"), d.findOne(`${st}`, e).classList.remove("!py-0"), d.findOne(`${st}`, e).classList.remove("!h-0");
    });
  }
  _toggleStepClass(t, e, i) {
    i && this._steps[t].classList[e](i);
  }
  _bindKeysNavigation() {
    this._toggleStepTabIndex(
      !1,
      d.findOne(`${G}`, this.activeStep)
    ), this._steps.forEach((t) => {
      const e = d.findOne(`${G}`, t);
      h.on(e, ma, (i) => {
        const n = d.parents(
          i.currentTarget,
          `${jt}`
        )[0], o = d.next(n, `${jt}`)[0], r = d.prev(n, `${jt}`)[0], a = d.findOne(
          `${G}`,
          n
        ), l = d.findOne(
          `${G}`,
          this.activeStep
        );
        let p = null, u = null;
        if (o && (p = d.findOne(`${G}`, o)), r && (u = d.findOne(`${G}`, r)), i.keyCode === Pe && this._currentView !== xt && (u ? (this._toggleStepTabIndex(a, u), this._toggleOutlineStyles(a, u), u.focus()) : p && (this._toggleStepTabIndex(a, p), this._toggleOutlineStyles(a, p), p.focus())), i.keyCode === Be && this._currentView !== xt && (p ? (this._toggleStepTabIndex(a, p), this._toggleOutlineStyles(a, p), p.focus()) : u && (this._toggleStepTabIndex(a, u), this._toggleOutlineStyles(a, u), u.focus())), i.keyCode === z && this._currentView === xt && (i.preventDefault(), p && (this._toggleStepTabIndex(a, p), this._toggleOutlineStyles(a, p), p.focus())), i.keyCode === rt && this._currentView === xt && (i.preventDefault(), u && (this._toggleStepTabIndex(a, u), this._toggleOutlineStyles(a, u), u.focus())), i.keyCode === He) {
          const f = d.findOne(
            `${G}`,
            this._steps[0]
          );
          this._toggleStepTabIndex(a, f), this._toggleOutlineStyles(a, f), f.focus();
        }
        if (i.keyCode === We) {
          const f = this._steps[this._steps.length - 1], _ = d.findOne(`${G}`, f);
          this._toggleStepTabIndex(a, _), this._toggleOutlineStyles(a, _), _.focus();
        }
        (i.keyCode === lt || i.keyCode === ks) && (i.preventDefault(), this.changeStep(this._steps.indexOf(n))), i.keyCode === Oi && (this._toggleStepTabIndex(a, l), this._toggleOutlineStyles(a, !1), l.focus());
      }), h.on(e, pm, (i) => {
        const n = d.parents(
          i.currentTarget,
          `${jt}`
        )[0], o = d.findOne(
          `${G}`,
          n
        ), r = d.findOne(
          `${G}`,
          this.activeStep
        );
        i.keyCode === Oi && (this._toggleStepTabIndex(o, r), this._toggleOutlineStyles(!1, r), r.focus());
      });
    });
  }
  _toggleStepTabIndex(t, e) {
    t && t.setAttribute("tabIndex", -1), e && e.setAttribute("tabIndex", 0);
  }
  _toggleOutlineStyles(t, e) {
    t && (t.style.outline = ""), e && (e.style.outline = "revert");
  }
  _toggleDisabled() {
    const t = d.find(`${G}`, this._element), e = d.find(
      `${ds}`,
      this._element
    );
    t[this._activeStepIndex].classList.add("color-[#858585]"), t[this._activeStepIndex].classList.add("cursor-default"), e[this._activeStepIndex].classList.add("!bg-[#858585]"), this._toggleStepClass(
      this._activeStepIndex,
      "add",
      this._options.stepperDisabled
    );
  }
  _toggleActive(t) {
    const e = d.find(
      `${ba}`,
      this._element
    ), i = d.find(
      `${ds}`,
      this._element
    );
    e[t].classList.add("font-medium"), i[t].classList.add("!bg-primary-100"), i[t].classList.add("!text-primary-700"), i[t].classList.remove("!bg-success-100"), i[t].classList.remove("!text-success-700"), e[this._activeStepIndex].classList.remove("font-medium"), i[this._activeStepIndex].classList.remove("!bg-primary-100"), i[this._activeStepIndex].classList.remove(
      "!text-primary-700"
    ), this._toggleStepClass(t, "add", this._options.stepperActive), this._toggleStepClass(
      this._activeStepIndex,
      "remove",
      this._options.stepperActive
    );
  }
  _toggleCompleted(t) {
    const e = d.find(
      `${ds}`,
      this._element
    );
    e[t].classList.add("!bg-success-100"), e[t].classList.add("!text-success-700"), e[t].classList.remove("!bg-danger-100"), e[t].classList.remove("!text-danger-700"), this._toggleStepClass(t, "add", this._options.stepperCompleted), this._toggleStepClass(t, "remove", this._options.stepperInvalid);
  }
  _hideInactiveSteps() {
    this._steps.forEach((t) => {
      t.getAttribute("data-te") || this._hideElement(d.findOne(`${st}`, t));
    });
  }
  _setHeight(t) {
    const e = d.findOne(`${st}`, t), i = getComputedStyle(e), n = d.findOne(`${G}`, t), o = getComputedStyle(n), r = e.offsetHeight + parseFloat(i.marginTop) + parseFloat(i.marginBottom), a = n.offsetHeight + parseFloat(o.marginTop) + parseFloat(o.marginBottom);
    this._element.style.height = `${a + r}px`;
  }
  _hideElement(t) {
    !d.parents(
      t,
      `${jt}`
    )[0].getAttribute("data-te") && this._currentView !== xt || (t.classList.add("!my-0"), t.classList.add("!py-0"), t.classList.add("!h-0"));
  }
  _showElement(t) {
    this._currentView === xt ? (t.classList.remove("!my-0"), t.classList.remove("!py-0"), t.classList.remove("!h-0")) : t.style.display = "block";
  }
  _animateHorizontalStep(t) {
    const e = t > this._activeStepIndex, i = d.findOne(
      `${st}`,
      this._steps[t]
    ), n = d.findOne(
      `${st}`,
      this.activeStep
    );
    let o, r;
    this._steps.forEach((u, f) => {
      const _ = d.findOne(`${st}`, u);
      f !== t && f !== this._activeStepIndex && this._hideElement(_);
    });
    const a = "translate-x-[150%]", l = "-translate-x-[150%]", p = "translate-0";
    e ? (r = l, o = p, i.classList.remove("translate-x-[150%]"), i.classList.remove("-translate-x-[150%]")) : (r = a, o = p, i.classList.remove("-translate-x-[150%]"), i.classList.remove("translate-x-[150%]")), n.classList.add(r), i.classList.add(o), this._setHeight(this._steps[t]);
  }
  _animateVerticalStep(t) {
    const e = d.findOne(
      `${st}`,
      this._steps[t]
    ), i = d.findOne(
      `${st}`,
      this.activeStep
    );
    this._hideElement(i), this._showElement(e);
  }
  static getInstance(t) {
    return I.getData(t, Is);
  }
  static getOrCreateInstance(t, e = {}) {
    return this.getInstance(t) || new this(t, typeof e == "object" ? e : null);
  }
}
const va = "data-te-input-state-active", us = "data-te-input-selected", Ta = "data-te-input-multiple-active", Ea = "[data-te-form-check-input]";
class Ca {
  constructor(t, e, i, n, o, r, a, l, p, u, f) {
    this.id = t, this.nativeOption = e, this.multiple = i, this.value = n, this.label = o, this.selected = r, this.disabled = a, this.hidden = l, this.secondaryText = p, this.groupId = u, this.icon = f, this.node = null, this.active = !1;
  }
  select() {
    this.multiple ? this._selectMultiple() : this._selectSingle();
  }
  _selectSingle() {
    this.selected || (this.node.setAttribute(us, ""), this.node.setAttribute("aria-selected", !0), this.selected = !0, this.nativeOption && (this.nativeOption.selected = !0));
  }
  _selectMultiple() {
    if (!this.selected) {
      const t = d.findOne(
        Ea,
        this.node
      );
      t.checked = !0, this.node.setAttribute(us, ""), this.node.setAttribute("aria-selected", !0), this.selected = !0, this.nativeOption && (this.nativeOption.selected = !0);
    }
  }
  deselect() {
    this.multiple ? this._deselectMultiple() : this._deselectSingle();
  }
  _deselectSingle() {
    this.selected && (this.node.removeAttribute(us), this.node.setAttribute("aria-selected", !1), this.selected = !1, this.nativeOption && (this.nativeOption.selected = !1));
  }
  _deselectMultiple() {
    if (this.selected) {
      const t = d.findOne(
        Ea,
        this.node
      );
      t.checked = !1, this.node.removeAttribute(us), this.node.setAttribute("aria-selected", !1), this.selected = !1, this.nativeOption && (this.nativeOption.selected = !1);
    }
  }
  setNode(t) {
    this.node = t;
  }
  setActiveStyles() {
    if (!this.active) {
      if (this.multiple) {
        this.node.setAttribute(Ta, "");
        return;
      }
      this.active = !0, this.node.setAttribute(va, "");
    }
  }
  removeActiveStyles() {
    this.active && (this.active = !1, this.node.removeAttribute(va)), this.multiple && this.node.removeAttribute(Ta);
  }
}
class _m {
  constructor(t = !1) {
    this._multiple = t, this._selections = [];
  }
  select(t) {
    this._multiple ? this._selections.push(t) : this._selections = [t];
  }
  deselect(t) {
    if (this._multiple) {
      const e = this._selections.findIndex(
        (i) => t === i
      );
      this._selections.splice(e, 1);
    } else
      this._selections = [];
  }
  clear() {
    this._selections = [];
  }
  get selection() {
    return this._selections[0];
  }
  get selections() {
    return this._selections;
  }
  get label() {
    return this._selections[0] && this.selection.label;
  }
  get labels() {
    return this._selections.map((t) => t.label).join(", ");
  }
  get value() {
    return this.selections[0] && this.selection.value;
  }
  get values() {
    return this._selections.map((t) => t.value);
  }
}
function co(s) {
  return s.filter((t) => !t.disabled).every((t) => t.selected);
}
const fm = "data-te-select-form-outline-ref", mm = "data-te-select-wrapper-ref", gm = "data-te-select-input-ref", bm = "data-te-select-clear-btn-ref", vm = "data-te-select-dropdown-container-ref", Tm = "data-te-select-dropdown-ref", Em = "data-te-select-options-wrapper-ref", Cm = "data-te-select-options-list-ref", Am = "data-te-select-input-filter-ref", ac = "data-te-select-option-ref", ym = "data-te-select-option-all-ref", wm = "data-te-select-option-text-ref", xm = "data-te-form-check-input", km = "data-te-select-option-group-ref", Om = "data-te-select-option-group-label-ref", lc = "data-te-select-selected", Sm = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
</svg>
`, Im = (s) => {
  s.code === "Tab" || s.code === "Esc" || s.preventDefault();
};
function ps(s, t, e, i, n) {
  t.selectSize === "default" && c.addClass(s, e), t.selectSize === "sm" && c.addClass(s, i), t.selectSize === "lg" && c.addClass(s, n);
}
function Dm(s, t, e, i) {
  const n = document.createElement("div");
  n.setAttribute("id", s), n.setAttribute(mm, "");
  const o = D("div");
  o.setAttribute(fm, ""), c.addClass(o, i.formOutline);
  const r = D("input"), a = t.selectFilter ? "combobox" : "listbox", l = t.multiple ? "true" : "false", p = t.disabled ? "true" : "false";
  r.setAttribute(gm, ""), c.addClass(r, i.selectInput), ps(
    r,
    t,
    i.selectInputSizeDefault,
    i.selectInputSizeSm,
    i.selectInputSizeLg
  ), t.selectFormWhite && c.addClass(r, i.selectInputWhite), r.setAttribute("type", "text"), r.setAttribute("role", a), r.setAttribute("aria-multiselectable", l), r.setAttribute("aria-disabled", p), r.setAttribute("aria-haspopup", "true"), r.setAttribute("aria-expanded", !1), t.tabIndex && r.setAttribute("tabIndex", t.tabIndex), t.disabled && r.setAttribute("disabled", ""), t.selectPlaceholder !== "" && r.setAttribute("placeholder", t.selectPlaceholder), t.selectValidation ? (c.addStyle(r, {
    "pointer-events": "none",
    "caret-color": "transparent"
  }), c.addStyle(o, { cursor: "pointer" })) : r.setAttribute("readonly", "true"), t.selectValidation && (r.setAttribute("required", "true"), r.setAttribute("aria-required", "true"), r.addEventListener("keydown", Im));
  const u = D("div");
  c.addClass(u, i.selectValidationValid);
  const f = document.createTextNode(
    `${t.selectValidFeedback}`
  );
  u.appendChild(f);
  const _ = D("div");
  c.addClass(_, i.selectValidationInvalid);
  const m = document.createTextNode(
    `${t.selectInvalidFeedback}`
  );
  _.appendChild(m);
  const g = D("span");
  g.setAttribute(bm, ""), c.addClass(g, i.selectClearBtn), ps(
    g,
    t,
    i.selectClearBtnDefault,
    i.selectClearBtnSm,
    i.selectClearBtnLg
  ), t.selectFormWhite && c.addClass(g, i.selectClearBtnWhite);
  const v = document.createTextNode("✕");
  g.appendChild(v), g.setAttribute("tabindex", "0");
  const b = D("span");
  return c.addClass(b, i.selectArrow), ps(
    b,
    t,
    i.selectArrowDefault,
    i.selectArrowSm,
    i.selectArrowLg
  ), t.selectFormWhite && c.addClass(b, i.selectArrowWhite), b.innerHTML = Sm, o.appendChild(r), e && (c.addClass(e, i.selectLabel), ps(
    e,
    t,
    i.selectLabelSizeDefault,
    i.selectLabelSizeSm,
    i.selectLabelSizeLg
  ), t.selectFormWhite && c.addClass(e, i.selectLabelWhite), o.appendChild(e)), t.selectValidation && (o.appendChild(u), o.appendChild(_)), t.selectClearButton && o.appendChild(g), o.appendChild(b), n.appendChild(o), n;
}
function Aa(s, t, e, i, n, o, r, a) {
  const l = document.createElement("div");
  l.setAttribute(vm, ""), c.addClass(l, a.selectDropdownContainer), l.setAttribute("id", `${s}`), l.style.width = `${e}px`;
  const p = document.createElement("div");
  p.setAttribute("tabindex", 0), p.setAttribute(Tm, ""), c.addClass(p, a.dropdown);
  const u = D("div");
  u.setAttribute(Em, ""), c.addClass(u, a.optionsWrapper), c.addClass(u, a.optionsWrapperScrollbar), u.style.maxHeight = `${i}px`;
  const f = cc(
    o,
    n,
    t,
    a
  );
  return u.appendChild(f), t.selectFilter && p.appendChild(
    $m(t.selectSearchPlaceholder, a)
  ), p.appendChild(u), r && p.appendChild(r), l.appendChild(p), l;
}
function cc(s, t, e, i) {
  const n = D("div");
  n.setAttribute(Cm, ""), c.addClass(n, i.optionsList);
  let o;
  return e.multiple ? o = Mm(
    s,
    t,
    e,
    i
  ) : o = Lm(s, e, i), o.forEach((r) => {
    n.appendChild(r);
  }), n;
}
function $m(s, t) {
  const e = D("div");
  c.addClass(e, t.inputGroup);
  const i = D("input");
  return i.setAttribute(Am, ""), c.addClass(i, t.selectFilterInput), i.placeholder = s, i.setAttribute("role", "searchbox"), i.setAttribute("type", "text"), e.appendChild(i), e;
}
function Lm(s, t, e) {
  return hc(s, t, e);
}
function Mm(s, t, e, i) {
  let n = null;
  e.selectAll && (n = Nm(
    t,
    s,
    e,
    i
  ));
  const o = hc(s, e, i);
  return n ? [n, ...o] : o;
}
function hc(s, t, e) {
  const i = [];
  return s.forEach((n) => {
    if (Object.prototype.hasOwnProperty.call(
      n,
      "options"
    )) {
      const r = Hm(n, t, e);
      i.push(r);
    } else
      i.push(dc(n, t, e));
  }), i;
}
function Nm(s, t, e, i) {
  const n = co(t), o = D("div");
  return o.setAttribute(ac, ""), c.addClass(o, i.selectOption), o.setAttribute(ym, ""), c.addStyle(o, {
    height: `${e.selectOptionHeight}px`
  }), o.setAttribute("role", "option"), o.setAttribute("aria-selected", n), n && o.setAttribute(lc, ""), o.appendChild(uc(s, e, i)), s.setNode(o), o;
}
function dc(s, t, e) {
  if (s.node)
    return s.node;
  const i = D("div");
  return i.setAttribute(ac, ""), c.addClass(i, e.selectOption), c.addStyle(i, {
    height: `${t.selectOptionHeight}px`
  }), c.setDataAttribute(i, "id", s.id), i.setAttribute("role", "option"), i.setAttribute("aria-selected", s.selected), i.setAttribute("aria-disabled", s.disabled), s.selected && i.setAttribute(lc, ""), s.disabled && i.setAttribute("data-te-select-option-disabled", !0), s.hidden && c.addClass(i, "hidden"), i.appendChild(uc(s, t, e)), s.icon && i.appendChild(Bm(s, e)), s.setNode(i), i;
}
function uc(s, t, e) {
  const i = D("span");
  i.setAttribute(wm, ""), c.addClass(i, e.selectOptionText);
  const n = document.createTextNode(s.label);
  return t.multiple && i.appendChild(Pm(s, e)), i.appendChild(n), (s.secondaryText || typeof s.secondaryText == "number") && i.appendChild(
    Rm(s.secondaryText, e)
  ), i;
}
function Rm(s, t) {
  const e = D("span");
  c.addClass(e, t.selectOptionSecondaryText);
  const i = document.createTextNode(s);
  return e.appendChild(i), e;
}
function Pm(s, t) {
  const e = D("input");
  e.setAttribute("type", "checkbox"), c.addClass(e, t.formCheckInput), e.setAttribute(xm, "");
  const i = D("label");
  return s.selected && e.setAttribute("checked", !0), s.disabled && e.setAttribute("disabled", !0), e.appendChild(i), e;
}
function Bm(s, t) {
  const e = D("span"), i = D("img");
  return c.addClass(i, t.selectOptionIcon), i.src = s.icon, e.appendChild(i), e;
}
function Hm(s, t, e) {
  const i = D("div");
  i.setAttribute(km, ""), c.addClass(i, e.selectOptionGroup), i.setAttribute("role", "group"), i.setAttribute("id", s.id), s.hidden && c.addClass(i, "hidden");
  const n = D("label");
  return n.setAttribute(Om, ""), c.addClass(n, e.selectOptionGroupLabel), c.addStyle(n, { height: `${t.selectOptionHeight}px` }), n.setAttribute("for", s.id), n.textContent = s.label, i.appendChild(n), s.options.forEach((o) => {
    i.appendChild(dc(o, t, e));
  }), i;
}
function Wm(s, t) {
  const e = D("div");
  return e.innerHTML = s, c.addClass(e, t.selectLabel), c.addClass(e, t.selectFakeValue), e;
}
const Pn = "select", fi = "te.select", Ni = `.${fi}`, Vm = `close${Ni}`, Fm = `open${Ni}`, ya = `optionSelect${Ni}`, wa = `optionDeselect${Ni}`, Ym = `valueChange${Ni}`, jm = "change", xa = "data-te-select-init", pc = "data-te-select-no-results-ref", ka = "data-te-select-open", q = "data-te-input-state-active", Kt = "data-te-input-focused", Bn = "data-te-input-disabled", Km = "data-te-select-option-group-label-ref", zm = "data-te-select-option-all-ref", ci = "data-te-select-selected", Um = "[data-te-select-label-ref]", Oa = "[data-te-select-input-ref]", Xm = "[data-te-select-input-filter-ref]", Gm = "[data-te-select-dropdown-ref]", qm = "[data-te-select-options-wrapper-ref]", Sa = "[data-te-select-options-list-ref]", Zm = "[data-te-select-option-ref]", Qm = "[data-te-select-clear-btn-ref]", Jm = "[data-te-select-custom-content-ref]", tg = `[${pc}]`, Ia = "[data-te-select-form-outline-ref]", eg = "[data-te-select-toggle]", Hn = "[data-te-input-notch-ref]", ig = 200, sg = {
  selectAutoSelect: !1,
  selectContainer: "body",
  selectClearButton: !1,
  disabled: !1,
  selectDisplayedLabels: 5,
  selectFormWhite: !1,
  multiple: !1,
  selectOptionsSelectedLabel: "options selected",
  selectOptionHeight: 38,
  selectAll: !0,
  selectAllLabel: "Select all",
  selectSearchPlaceholder: "Search...",
  selectSize: "default",
  selectVisibleOptions: 5,
  selectFilter: !1,
  selectFilterDebounce: 300,
  selectNoResultText: "No results",
  selectValidation: !1,
  selectValidFeedback: "Valid",
  selectInvalidFeedback: "Invalid",
  selectPlaceholder: ""
}, ng = {
  selectAutoSelect: "boolean",
  selectContainer: "string",
  selectClearButton: "boolean",
  disabled: "boolean",
  selectDisplayedLabels: "number",
  selectFormWhite: "boolean",
  multiple: "boolean",
  selectOptionsSelectedLabel: "string",
  selectOptionHeight: "number",
  selectAll: "boolean",
  selectAllLabel: "string",
  selectSearchPlaceholder: "string",
  selectSize: "string",
  selectVisibleOptions: "number",
  selectFilter: "boolean",
  selectFilterDebounce: "number",
  selectNoResultText: "string",
  selectValidation: "boolean",
  selectValidFeedback: "string",
  selectInvalidFeedback: "string",
  selectPlaceholder: "string"
}, og = {
  dropdown: "relative outline-none min-w-[100px] m-0 scale-[0.8] opacity-0 bg-white shadow-[0_2px_5px_0_rgba(0,0,0,0.16),_0_2px_10px_0_rgba(0,0,0,0.12)] transition duration-200 motion-reduce:transition-none data-[te-select-open]:scale-100 data-[te-select-open]:opacity-100 dark:bg-zinc-700",
  formCheckInput: "relative float-left mt-[0.15rem] mr-[8px] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 dark:border-neutral-600 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary dark:checked:border-primary checked:bg-primary dark:checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:ml-[0.25rem] checked:after:-mt-px checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-t-0 checked:after:border-l-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:ml-[0.25rem] checked:focus:after:-mt-px checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-t-0 checked:focus:after:border-l-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent",
  formOutline: "relative",
  initialized: "hidden",
  inputGroup: "flex items-center whitespace-nowrap p-2.5 text-center text-base font-normal leading-[1.6] text-gray-700 dark:bg-zinc-800 dark:text-gray-200 dark:placeholder:text-gray-200",
  noResult: "flex items-center px-4",
  optionsList: "list-none m-0 p-0",
  optionsWrapper: "overflow-y-auto",
  optionsWrapperScrollbar: "[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-button]:block [&::-webkit-scrollbar-button]:h-0 [&::-webkit-scrollbar-button]:bg-transparent [&::-webkit-scrollbar-track-piece]:bg-transparent [&::-webkit-scrollbar-track-piece]:rounded-none [&::-webkit-scrollbar-track-piece]: [&::-webkit-scrollbar-track-piece]:rounded-l [&::-webkit-scrollbar-thumb]:h-[50px] [&::-webkit-scrollbar-thumb]:bg-[#999] [&::-webkit-scrollbar-thumb]:rounded",
  selectArrow: "absolute right-3 text-[0.8rem] cursor-pointer peer-focus:text-primary peer-data-[te-input-focused]:text-primary group-data-[te-was-validated]/validation:peer-valid:text-green-600 group-data-[te-was-validated]/validation:peer-invalid:text-[rgb(220,76,100)] w-5 h-5",
  selectArrowWhite: "text-gray-50 peer-focus:!text-white peer-data-[te-input-focused]:!text-white",
  selectArrowDefault: "top-2",
  selectArrowLg: "top-[13px]",
  selectArrowSm: "top-1",
  selectClearBtn: "absolute top-2 right-9 text-black cursor-pointer focus:text-primary outline-none dark:text-gray-200",
  selectClearBtnWhite: "!text-gray-50",
  selectClearBtnDefault: "top-2 text-base",
  selectClearBtnLg: "top-[11px] text-base",
  selectClearBtnSm: "top-1 text-[0.8rem]",
  selectDropdownContainer: "z-[1070]",
  selectFakeValue: "transform-none hidden data-[te-input-state-active]:block",
  selectFilterInput: "relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-gray-300 bg-transparent bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition duration-300 ease-in-out motion-reduce:transition-none focus:border-primary focus:text-gray-700 focus:shadow-te-primary focus:outline-none dark:text-gray-200 dark:placeholder:text-gray-200",
  selectInput: "peer block min-h-[auto] w-full rounded border-0 bg-transparent outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-gray-200 dark:placeholder:text-gray-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0 cursor-pointer data-[te-input-disabled]:bg-[#e9ecef] data-[te-input-disabled]:cursor-default group-data-[te-was-validated]/validation:mb-4 dark:data-[te-input-disabled]:bg-zinc-600",
  selectInputWhite: "!text-gray-50",
  selectInputSizeDefault: "py-[0.32rem] px-3 leading-[1.6]",
  selectInputSizeLg: "py-[0.32rem] px-3 leading-[2.15]",
  selectInputSizeSm: "py-[0.33rem] px-3 text-xs leading-[1.5]",
  selectLabel: "pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate text-gray-500 transition-all duration-200 ease-out peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-gray-200 dark:peer-focus:text-gray-200 data-[te-input-state-active]:scale-[0.8] dark:peer-focus:text-primary",
  selectLabelWhite: "!text-gray-50",
  selectLabelSizeDefault: "pt-[0.37rem] leading-[1.6] peer-focus:-translate-y-[0.9rem] peer-data-[te-input-state-active]:-translate-y-[0.9rem] data-[te-input-state-active]:-translate-y-[0.9rem]",
  selectLabelSizeLg: "pt-[0.37rem] leading-[2.15] peer-focus:-translate-y-[1.15rem] peer-data-[te-input-state-active]:-translate-y-[1.15rem] data-[te-input-state-active]:-translate-y-[1.15rem]",
  selectLabelSizeSm: "pt-[0.37rem] text-xs leading-[1.5] peer-focus:-translate-y-[0.75rem] peer-data-[te-input-state-active]:-translate-y-[0.75rem] data-[te-input-state-active]:-translate-y-[0.75rem]",
  selectOption: "flex flex-row items-center justify-between w-full px-4 truncate text-gray-700 bg-transparent select-none cursor-pointer data-[te-input-multiple-active]:bg-black/5 hover:[&:not([data-te-select-option-disabled])]:bg-black/5 data-[te-input-state-active]:bg-black/5 data-[te-select-option-selected]:data-[te-input-state-active]:bg-black/5 data-[te-select-selected]:data-[te-select-option-disabled]:cursor-default data-[te-select-selected]:data-[te-select-option-disabled]:text-gray-400 data-[te-select-selected]:data-[te-select-option-disabled]:bg-transparent data-[te-select-option-selected]:bg-black/[0.02] data-[te-select-option-disabled]:text-gray-400 data-[te-select-option-disabled]:cursor-default group-data-[te-select-option-group-ref]/opt:pl-7 dark:text-gray-200 dark:hover:[&:not([data-te-select-option-disabled])]:bg-white/30 dark:data-[te-input-state-active]:bg-white/30 dark:data-[te-select-option-selected]:data-[te-input-state-active]:bg-white/30 dark:data-[te-select-option-disabled]:text-gray-400 dark:data-[te-input-multiple-active]:bg-white/30",
  selectOptionGroup: "group/opt",
  selectOptionGroupLabel: "flex flex-row items-center w-full px-4 truncate bg-transparent text-black/50 select-none dark:text-gray-300",
  selectOptionIcon: "w-7 h-7 rounded-full",
  selectOptionSecondaryText: "block text-[0.8rem] text-gray-500 dark:text-gray-300",
  selectOptionText: "group",
  selectValidationValid: "hidden absolute -mt-3 w-auto text-sm text-green-600 cursor-pointer group-data-[te-was-validated]/validation:peer-valid:block",
  selectValidationInvalid: "hidden absolute -mt-3 w-auto text-sm text-[rgb(220,76,100)] cursor-pointer group-data-[te-was-validated]/validation:peer-invalid:block"
}, rg = {
  dropdown: "string",
  formCheckInput: "string",
  formOutline: "string",
  initialized: "string",
  inputGroup: "string",
  noResult: "string",
  optionsList: "string",
  optionsWrapper: "string",
  optionsWrapperScrollbar: "string",
  selectArrow: "string",
  selectArrowDefault: "string",
  selectArrowLg: "string",
  selectArrowSm: "string",
  selectClearBtn: "string",
  selectClearBtnDefault: "string",
  selectClearBtnLg: "string",
  selectClearBtnSm: "string",
  selectDropdownContainer: "string",
  selectFakeValue: "string",
  selectFilterInput: "string",
  selectInput: "string",
  selectInputSizeDefault: "string",
  selectInputSizeLg: "string",
  selectInputSizeSm: "string",
  selectLabel: "string",
  selectLabelSizeDefault: "string",
  selectLabelSizeLg: "string",
  selectLabelSizeSm: "string",
  selectOption: "string",
  selectOptionGroup: "string",
  selectOptionGroupLabel: "string",
  selectOptionIcon: "string",
  selectOptionSecondaryText: "string",
  selectOptionText: "string"
};
class $o {
  constructor(t, e, i) {
    this._element = t, this._config = this._getConfig(e), this._classes = this._getClasses(i), this._config.selectPlaceholder && !this._config.multiple && this._addPlaceholderOption(), this._optionsToRender = this._getOptionsToRender(t), this._plainOptions = this._getPlainOptions(this._optionsToRender), this._filteredOptionsList = null, this._selectionModel = new _m(this.multiple), this._activeOptionIndex = -1, this._activeOption = null, this._wrapperId = bt("select-wrapper-"), this._dropdownContainerId = bt("select-dropdown-container-"), this._selectAllId = bt("select-all-"), this._debounceTimeoutId = null, this._dropdownHeight = this._config.selectOptionHeight * this._config.selectVisibleOptions, this._popper = null, this._input = null, this._label = d.next(this._element, Um)[0], this._notch = null, this._fakeValue = null, this._isFakeValueActive = !1, this._customContent = d.next(
      t,
      Jm
    )[0], this._toggleButton = null, this._elementToggle = null, this._wrapper = null, this._inputEl = null, this._dropdownContainer = null, this._container = null, this._selectAllOption = null, this._init(), this._mutationObserver = null, this._isOpen = !1, this._addMutationObserver(), this._element && I.setData(t, fi, this);
  }
  static get NAME() {
    return Pn;
  }
  get filterInput() {
    return d.findOne(
      Xm,
      this._dropdownContainer
    );
  }
  get dropdown() {
    return d.findOne(Gm, this._dropdownContainer);
  }
  get optionsList() {
    return d.findOne(
      Sa,
      this._dropdownContainer
    );
  }
  get optionsWrapper() {
    return d.findOne(
      qm,
      this._dropdownContainer
    );
  }
  get clearButton() {
    return d.findOne(Qm, this._wrapper);
  }
  get options() {
    return this._filteredOptionsList ? this._filteredOptionsList : this._plainOptions;
  }
  get value() {
    return this.multiple ? this._selectionModel.values : this._selectionModel.value;
  }
  get multiple() {
    return this._config.multiple;
  }
  get hasSelectAll() {
    return this.multiple && this._config.selectAll;
  }
  get hasSelection() {
    return this._selectionModel.selection || this._selectionModel.selections.length > 0;
  }
  _getConfig(t) {
    const e = c.getDataAttributes(this._element);
    return t = {
      ...sg,
      ...e,
      ...t
    }, this._element.hasAttribute("multiple") && (t.multiple = !0), this._element.hasAttribute("disabled") && (t.disabled = !0), this._element.tabIndex && (t.tabIndex = this._element.getAttribute("tabIndex")), L(Pn, t, ng), t;
  }
  _getClasses(t) {
    const e = c.getDataClassAttributes(this._element);
    return t = {
      ...og,
      ...e,
      ...t
    }, L(Pn, t, rg), t;
  }
  _addPlaceholderOption() {
    const t = new Option("", "", !0, !0);
    t.hidden = !0, t.selected = !0, this._element.prepend(t);
  }
  _getOptionsToRender(t) {
    const e = [];
    return t.childNodes.forEach((n) => {
      if (n.nodeName === "OPTGROUP") {
        const o = {
          id: bt("group-"),
          label: n.label,
          disabled: n.hasAttribute("disabled"),
          hidden: n.hasAttribute("hidden"),
          options: []
        };
        n.childNodes.forEach((a) => {
          a.nodeName === "OPTION" && o.options.push(
            this._createOptionObject(a, o)
          );
        }), e.push(o);
      } else
        n.nodeName === "OPTION" && e.push(this._createOptionObject(n));
    }), e;
  }
  _getPlainOptions(t) {
    if (!d.findOne("optgroup", this._element))
      return t;
    const i = [];
    return t.forEach((n) => {
      Object.prototype.hasOwnProperty.call(
        n,
        "options"
      ) ? n.options.forEach((r) => {
        i.push(r);
      }) : i.push(n);
    }), i;
  }
  _createOptionObject(t, e = {}) {
    const i = bt("option-"), n = e.id ? e.id : null, o = e.disabled ? e.disabled : !1, r = t.selected || t.hasAttribute(ci), a = t.hasAttribute("disabled") || o, l = t.hasAttribute("hidden") || e && e.hidden, p = this.multiple, u = t.value, f = t.label, _ = c.getDataAttribute(
      t,
      "selectSecondaryText"
    ), m = c.getDataAttribute(t, "select-icon");
    return new Ca(
      i,
      t,
      p,
      u,
      f,
      r,
      a,
      l,
      _,
      n,
      m
    );
  }
  _getNavigationOptions() {
    const t = this.options.filter((e) => !e.hidden);
    return this.hasSelectAll ? [this._selectAllOption, ...t] : t;
  }
  _init() {
    this._renderMaterialWrapper(), this._wrapper = d.findOne(`#${this._wrapperId}`), this._input = d.findOne(Oa, this._wrapper), this._config.disabled && this._input.setAttribute(Bn, "");
    const t = this._config.selectContainer;
    t === "body" ? this._container = document.body : this._container = d.findOne(t), this._initOutlineInput(), this._setDefaultSelections(), this._updateInputValue(), this._appendFakeValue(), this._updateFakeLabelPosition(), this._updateLabelPosition(), this._updateClearButtonVisibility(), this._bindComponentEvents(), this.hasSelectAll && (this._selectAllOption = this._createSelectAllOption()), this._dropdownContainer = Aa(
      this._dropdownContainerId,
      this._config,
      this._input.offsetWidth,
      this._dropdownHeight,
      this._selectAllOption,
      this._optionsToRender,
      this._customContent,
      this._classes
    ), this._setFirstActiveOption(), this._listenToFocusChange();
  }
  _renderMaterialWrapper() {
    const t = Dm(
      this._wrapperId,
      this._config,
      this._label,
      this._classes
    );
    this._element.parentNode.insertBefore(t, this._element), c.addClass(this._element, this._classes.initialized), t.appendChild(this._element);
  }
  _initOutlineInput() {
    const t = d.findOne(
      Ia,
      this._wrapper
    );
    new W(
      t,
      {
        inputFormWhite: this._config.selectFormWhite
      },
      this._classes
    ).init(), this._notch = d.findOne(Hn, this._wrapper);
  }
  _bindComponentEvents() {
    this._listenToComponentKeydown(), this._listenToWrapperClick(), this._listenToClearBtnClick(), this._listenToClearBtnKeydown();
  }
  _setDefaultSelections() {
    this.options.forEach((t) => {
      t.selected && this._selectionModel.select(t);
    });
  }
  _listenToComponentKeydown() {
    h.on(this._wrapper, "keydown", this._handleKeydown.bind(this));
  }
  _handleKeydown(t) {
    this._isOpen && !this._config.selectFilter ? this._handleOpenKeydown(t) : this._handleClosedKeydown(t);
  }
  _handleOpenKeydown(t) {
    const e = t.keyCode, i = e === Li || e === rt && t.altKey || e === Oi;
    if (e === Oi && this._config.selectAutoSelect && !this.multiple && this._handleAutoSelection(this._activeOption), i) {
      this.close(), this._input.focus();
      return;
    }
    switch (e) {
      case z:
        this._setNextOptionActive(), this._scrollToOption(this._activeOption);
        break;
      case rt:
        this._setPreviousOptionActive(), this._scrollToOption(this._activeOption);
        break;
      case He:
        this._setFirstOptionActive(), this._scrollToOption(this._activeOption);
        break;
      case We:
        this._setLastOptionActive(), this._scrollToOption(this._activeOption);
        break;
      case lt:
        t.preventDefault(), this._activeOption && (this.hasSelectAll && this._activeOptionIndex === 0 ? this._handleSelectAll() : this._handleSelection(this._activeOption));
        return;
      default:
        return;
    }
    t.preventDefault();
  }
  _handleClosedKeydown(t) {
    const e = t.keyCode;
    if (e === lt && t.preventDefault(), (e === lt || e === z && t.altKey || e === z && this.multiple) && this.open(), this.multiple)
      switch (e) {
        case z:
          this.open();
          break;
        case rt:
          this.open();
          break;
        default:
          return;
      }
    else
      switch (e) {
        case z:
          this._setNextOptionActive(), this._handleSelection(this._activeOption);
          break;
        case rt:
          this._setPreviousOptionActive(), this._handleSelection(this._activeOption);
          break;
        case He:
          this._setFirstOptionActive(), this._handleSelection(this._activeOption);
          break;
        case We:
          this._setLastOptionActive(), this._handleSelection(this._activeOption);
          break;
        default:
          return;
      }
    t.preventDefault();
  }
  _scrollToOption(t) {
    if (!t)
      return;
    let e;
    const i = this.options.filter((u) => !u.hidden);
    this.hasSelectAll ? e = i.indexOf(t) + 1 : e = i.indexOf(t);
    const n = this._getNumberOfGroupsBeforeOption(e), o = e + n, r = this.optionsWrapper, a = r.offsetHeight, l = this._config.selectOptionHeight, p = r.scrollTop;
    if (e > -1) {
      const u = o * l, f = u + l > p + a;
      u < p ? r.scrollTop = u : f ? r.scrollTop = u - a + l : r.scrollTop = p;
    }
  }
  _getNumberOfGroupsBeforeOption(t) {
    const e = this.options.filter((r) => !r.hidden), i = this._optionsToRender.filter((r) => !r.hidden), n = this.hasSelectAll ? t - 1 : t;
    let o = 0;
    for (let r = 0; r <= n; r++)
      e[r].groupId && i[o] && i[o].id && e[r].groupId === i[o].id && o++;
    return o;
  }
  _setNextOptionActive() {
    let t = this._activeOptionIndex + 1;
    const e = this._getNavigationOptions();
    if (e[t]) {
      for (; e[t].disabled; )
        if (t += 1, !e[t])
          return;
      this._updateActiveOption(e[t], t);
    }
  }
  _setPreviousOptionActive() {
    let t = this._activeOptionIndex - 1;
    const e = this._getNavigationOptions();
    if (e[t]) {
      for (; e[t].disabled; )
        if (t -= 1, !e[t])
          return;
      this._updateActiveOption(e[t], t);
    }
  }
  _setFirstOptionActive() {
    const e = this._getNavigationOptions();
    this._updateActiveOption(e[0], 0);
  }
  _setLastOptionActive() {
    const t = this._getNavigationOptions(), e = t.length - 1;
    this._updateActiveOption(t[e], e);
  }
  _updateActiveOption(t, e) {
    const i = this._activeOption;
    i && i.removeActiveStyles(), t.setActiveStyles(), this._activeOptionIndex = e, this._activeOption = t;
  }
  _listenToWrapperClick() {
    h.on(this._wrapper, "click", () => {
      this.toggle();
    });
  }
  _listenToClearBtnClick() {
    h.on(this.clearButton, "click", (t) => {
      t.preventDefault(), t.stopPropagation(), this._handleClear();
    });
  }
  _listenToClearBtnKeydown() {
    h.on(this.clearButton, "keydown", (t) => {
      t.keyCode === lt && (this._handleClear(), t.preventDefault(), t.stopPropagation());
    });
  }
  _handleClear() {
    if (this.multiple)
      this._selectionModel.clear(), this._deselectAllOptions(this.options), this.hasSelectAll && this._updateSelectAllState();
    else {
      const t = this._selectionModel.selection;
      this._selectionModel.clear(), t.deselect();
    }
    this._fakeValue.innerHTML = "", this._updateInputValue(), this._updateFakeLabelPosition(), this._updateLabelPosition(), this._updateClearButtonVisibility(), this._emitValueChangeEvent(null), this._emitNativeChangeEvent();
  }
  _listenToOptionsClick() {
    h.on(this.optionsWrapper, "click", (t) => {
      if (t.target.hasAttribute(
        Km
      ))
        return;
      const i = t.target.nodeName === "DIV" ? t.target : d.closest(t.target, Zm);
      if (i.hasAttribute(zm)) {
        this._handleSelectAll();
        return;
      }
      const o = i.dataset.teId, r = this.options.find((a) => a.id === o);
      r && !r.disabled && this._handleSelection(r);
    });
  }
  _handleSelectAll() {
    this._selectAllOption.selected ? (this._deselectAllOptions(this.options), this._selectAllOption.deselect()) : (this._selectAllOptions(this.options), this._selectAllOption.select()), this._updateInputValue(), this._updateFakeLabelPosition(), this._updateLabelPosition(), this._updateClearButtonVisibility(), this._emitValueChangeEvent(this.value), this._emitNativeChangeEvent();
  }
  _selectAllOptions(t) {
    t.forEach((e) => {
      !e.selected && !e.disabled && (this._selectionModel.select(e), e.select());
    });
  }
  _deselectAllOptions(t) {
    t.forEach((e) => {
      e.selected && !e.disabled && (this._selectionModel.deselect(e), e.deselect());
    });
  }
  _handleSelection(t) {
    this.multiple ? (this._handleMultiSelection(t), this.hasSelectAll && this._updateSelectAllState()) : this._handleSingleSelection(t), this._updateInputValue(), this._updateFakeLabelPosition(), this._updateLabelPosition(), this._updateClearButtonVisibility();
  }
  _handleAutoSelection(t) {
    this._singleOptionSelect(t), this._updateInputValue(), this._updateFakeLabelPosition(), this._updateLabelPosition(), this._updateClearButtonVisibility();
  }
  _handleSingleSelection(t) {
    this._singleOptionSelect(t), this.close(), this._input.focus();
  }
  _singleOptionSelect(t) {
    const e = this._selectionModel.selections[0];
    e && e !== t && (this._selectionModel.deselect(e), e.deselect(), e.node.setAttribute(ci, !1), h.trigger(this._element, wa, {
      value: e.value
    })), (!e || e && t !== e) && (this._selectionModel.select(t), t.select(), t.node.setAttribute(ci, !0), h.trigger(this._element, ya, {
      value: t.value
    }), this._emitValueChangeEvent(this.value), this._emitNativeChangeEvent());
  }
  _handleMultiSelection(t) {
    t.selected ? (this._selectionModel.deselect(t), t.deselect(), t.node.setAttribute(ci, !1), h.trigger(this._element, wa, {
      value: t.value
    })) : (this._selectionModel.select(t), t.select(), t.node.setAttribute(ci, !0), h.trigger(this._element, ya, {
      value: t.value
    })), this._emitValueChangeEvent(this.value), this._emitNativeChangeEvent();
  }
  _emitValueChangeEvent(t) {
    h.trigger(this._element, Ym, { value: t });
  }
  _emitNativeChangeEvent() {
    h.trigger(this._element, jm);
  }
  _updateInputValue() {
    const t = this.multiple ? this._selectionModel.labels : this._selectionModel.label;
    let e;
    this.multiple && this._config.selectDisplayedLabels !== -1 && this._selectionModel.selections.length > this._config.selectDisplayedLabels ? e = `${this._selectionModel.selections.length} ${this._config.selectOptionsSelectedLabel}` : e = t, !this.multiple && !this._isSelectionValid(this._selectionModel.selection) ? this._input.value = "" : this._isLabelEmpty(this._selectionModel.selection) ? this._input.value = " " : e ? this._input.value = e : this.multiple || !this._optionsToRender[0] ? this._input.value = "" : this._input.value = this._optionsToRender[0].label;
  }
  _isSelectionValid(t) {
    return !(t && (t.disabled || t.value === ""));
  }
  _isLabelEmpty(t) {
    return !!(t && t.label === "");
  }
  _appendFakeValue() {
    if (!this._selectionModel.selection || this._selectionModel._multiple)
      return;
    const t = this._selectionModel.selection.label;
    this._fakeValue = Wm(t, this._classes), d.findOne(
      Ia,
      this._wrapper
    ).appendChild(this._fakeValue);
  }
  _updateLabelPosition() {
    const t = this._element.hasAttribute(xa), e = this._input.value !== "";
    this._label && (t && (e || this._isOpen || this._isFakeValueActive) ? (this._label.setAttribute(q, ""), this._notch.setAttribute(q, "")) : (this._label.removeAttribute(q), this._notch.removeAttribute(q, "")));
  }
  _updateLabelPositionWhileClosing() {
    this._label && (this._input.value !== "" || this._isFakeValueActive ? (this._label.setAttribute(q, ""), this._notch.setAttribute(q, "")) : (this._label.removeAttribute(q), this._notch.removeAttribute(q)));
  }
  _updateFakeLabelPosition() {
    this._fakeValue && (this._input.value === "" && this._fakeValue.innerHTML !== "" && !this._config.selectPlaceholder ? (this._isFakeValueActive = !0, this._fakeValue.setAttribute(q, "")) : (this._isFakeValueActive = !1, this._fakeValue.removeAttribute(q)));
  }
  _updateClearButtonVisibility() {
    if (!this.clearButton)
      return;
    this._selectionModel.selection || this._selectionModel.selections.length > 0 ? c.addStyle(this.clearButton, { display: "block" }) : c.addStyle(this.clearButton, { display: "none" });
  }
  _updateSelectAllState() {
    const t = this._selectAllOption.selected, e = co(this.options);
    !e && t ? this._selectAllOption.deselect() : e && !t && this._selectAllOption.select();
  }
  toggle() {
    this._isOpen ? this.close() : this.open();
  }
  open() {
    const t = this._config.disabled, e = h.trigger(this._element, Fm);
    this._isOpen || t || e.defaultPrevented || (this._openDropdown(), this._updateDropdownWidth(), this._setFirstActiveOption(), this._scrollToOption(this._activeOption), this._config.selectFilter && (setTimeout(() => {
      this.filterInput.focus();
    }, 0), this._listenToSelectSearch(), this._listenToDropdownKeydown()), this._listenToOptionsClick(), this._listenToOutsideClick(), this._listenToWindowResize(), this._isOpen = !0, this._updateLabelPosition(), this._setInputActiveStyles());
  }
  _openDropdown() {
    this._popper = Ee(this._input, this._dropdownContainer, {
      placement: "bottom-start",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 1]
          }
        }
      ]
    }), this._container.appendChild(this._dropdownContainer), setTimeout(() => {
      this.dropdown.setAttribute(ka, "");
    }, 0);
  }
  _updateDropdownWidth() {
    const t = this._input.offsetWidth;
    c.addStyle(this._dropdownContainer, { width: `${t}px` });
  }
  _setFirstActiveOption() {
    const t = this._getNavigationOptions(), e = this._activeOption;
    e && e.removeActiveStyles();
    const i = this.multiple ? this._selectionModel.selections[0] : this._selectionModel.selection;
    i ? (this._activeOption = i, i.setActiveStyles(), this._activeOptionIndex = t.findIndex(
      (n) => n === i
    )) : (this._activeOption = null, this._activeOptionIndex = -1);
  }
  _setInputActiveStyles() {
    this._input.setAttribute(Kt, ""), d.findOne(Hn, this._wrapper).setAttribute(
      Kt,
      ""
    );
  }
  _listenToWindowResize() {
    h.on(window, "resize", this._handleWindowResize.bind(this));
  }
  _handleWindowResize() {
    this._dropdownContainer && this._updateDropdownWidth();
  }
  _listenToSelectSearch() {
    this.filterInput.addEventListener("input", (t) => {
      const e = t.target.value, i = this._config.selectFilterDebounce;
      this._debounceFilter(e, i);
    });
  }
  _debounceFilter(t, e) {
    this._debounceTimeoutId && clearTimeout(this._debounceTimeoutId), this._debounceTimeoutId = setTimeout(() => {
      this._filterOptions(t);
    }, e);
  }
  _filterOptions(t) {
    const e = [];
    this._optionsToRender.forEach((o) => {
      const r = Object.prototype.hasOwnProperty.call(
        o,
        "options"
      ), a = !r && o.label.toLowerCase().includes(t.toLowerCase()), l = {};
      r && (l.label = o.label, l.options = this._filter(t, o.options), l.options.length > 0 && e.push(l)), a && e.push(o);
    });
    const i = this._config.selectNoResultText !== "", n = e.length !== 0;
    if (n)
      this._updateOptionsListTemplate(e), this._popper.forceUpdate(), this._filteredOptionsList = this._getPlainOptions(e), this.hasSelectAll && this._updateSelectAllState(), this._setFirstActiveOption();
    else if (!n && i) {
      const o = this._getNoResultTemplate();
      this.optionsWrapper.innerHTML = o;
    }
  }
  _updateOptionsListTemplate(t) {
    const e = d.findOne(Sa, this._dropdownContainer) || d.findOne(tg, this._dropdownContainer), i = cc(
      t,
      this._selectAllOption,
      this._config,
      this._classes
    );
    this.optionsWrapper.removeChild(e), this.optionsWrapper.appendChild(i);
  }
  _getNoResultTemplate() {
    return `<div class="${this._classes.noResult}" ${pc} style="height: ${this._config.selectOptionHeight}px">${this._config.selectNoResultText}</div>`;
  }
  _filter(t, e) {
    const i = t.toLowerCase();
    return e.filter(
      (n) => n.label.toLowerCase().includes(i)
    );
  }
  _listenToDropdownKeydown() {
    h.on(
      this.dropdown,
      "keydown",
      this._handleOpenKeydown.bind(this)
    );
  }
  _listenToOutsideClick() {
    this._outsideClick = this._handleOutSideClick.bind(this), h.on(document, "click", this._outsideClick);
  }
  _listenToFocusChange(t = !0) {
    if (t === !1) {
      h.off(
        this._input,
        "focus",
        () => this._notch.setAttribute(Kt, "")
      ), h.off(
        this._input,
        "blur",
        () => this._notch.removeAttribute(Kt)
      );
      return;
    }
    h.on(
      this._input,
      "focus",
      () => this._notch.setAttribute(Kt, "")
    ), h.on(
      this._input,
      "blur",
      () => this._notch.removeAttribute(Kt)
    );
  }
  _handleOutSideClick(t) {
    const e = this._wrapper && this._wrapper.contains(t.target), i = t.target === this._dropdownContainer, n = this._dropdownContainer && this._dropdownContainer.contains(t.target);
    let o;
    this._toggleButton || (this._elementToggle = d.find(eg)), this._elementToggle && this._elementToggle.forEach((r) => {
      const a = c.getDataAttribute(
        r,
        "select-toggle"
      );
      (a === this._element.id || this._element.classList.contains(a)) && (this._toggleButton = r, o = this._toggleButton.contains(t.target));
    }), !e && !i && !n && !o && this.close();
  }
  close() {
    const t = h.trigger(this._element, Vm);
    !this._isOpen || t.defaultPrevented || (this._config.selectFilter && this.hasSelectAll && (this._resetFilterState(), this._updateOptionsListTemplate(this._optionsToRender), this._config.multiple && this._updateSelectAllState()), this._removeDropdownEvents(), this.dropdown.removeAttribute(ka), setTimeout(() => {
      this._input.removeAttribute(Kt), this._input.blur(), d.findOne(Hn, this._wrapper).removeAttribute(
        Kt
      ), this._label && !this.hasSelection && (this._label.removeAttribute(q), this._notch.setAttribute(q, ""), this._input.removeAttribute(q), this._notch.removeAttribute(q)), this._updateLabelPositionWhileClosing();
    }, 0), setTimeout(() => {
      this._container && this._dropdownContainer.parentNode === this._container && this._container.removeChild(this._dropdownContainer), this._popper.destroy(), this._isOpen = !1, h.off(this.dropdown, "transitionend");
    }, ig));
  }
  _resetFilterState() {
    this.filterInput.value = "", this._filteredOptionsList = null;
  }
  _removeDropdownEvents() {
    h.off(document, "click", this._outsideClick), this._config.selectFilter && h.off(this.dropdown, "keydown"), h.off(this.optionsWrapper, "click");
  }
  _addMutationObserver() {
    this._mutationObserver = new MutationObserver(() => {
      this._wrapper && (this._updateSelections(), this._updateDisabledState());
    }), this._observeMutationObserver();
  }
  _updateSelections() {
    this._optionsToRender = this._getOptionsToRender(this._element), this._plainOptions = this._getPlainOptions(this._optionsToRender), this._selectionModel.clear(), this._setDefaultSelections(), this._updateInputValue(), this._updateFakeLabelPosition(), this._updateLabelPosition(), this._updateClearButtonVisibility(), this.hasSelectAll && this._updateSelectAllState();
    const t = this._config.filter && this.filterInput && this.filterInput.value;
    this._isOpen && !t ? (this._updateOptionsListTemplate(this._optionsToRender), this._setFirstActiveOption()) : this._isOpen && t ? (this._filterOptions(this.filterInput.value), this._setFirstActiveOption()) : this._dropdownContainer = Aa(
      this._dropdownContainerId,
      this._config,
      this._input.offsetWidth,
      this._dropdownHeight,
      this._selectAllOption,
      this._optionsToRender,
      this._customContent,
      this._classes
    );
  }
  _updateDisabledState() {
    const t = d.findOne(Oa, this._wrapper);
    this._element.hasAttribute("disabled") ? (this._config.disabled = !0, t.setAttribute("disabled", ""), t.setAttribute(Bn, "")) : (this._config.disabled = !1, t.removeAttribute("disabled"), t.removeAttribute(Bn));
  }
  _observeMutationObserver() {
    this._mutationObserver && this._mutationObserver.observe(this._element, {
      attributes: !0,
      childList: !0,
      characterData: !0,
      subtree: !0
    });
  }
  _disconnectMutationObserver() {
    this.mutationObserver && (this._mutationObserver.disconnect(), this._mutationObserver = null);
  }
  _createSelectAllOption() {
    const t = this._selectAllId, e = null, i = !0, n = "select-all", o = this._config.selectAllLabel, r = co(this.options), a = !1, l = !1, p = null, u = null, f = null;
    return new Ca(
      t,
      e,
      i,
      n,
      o,
      r,
      a,
      l,
      p,
      u,
      f
    );
  }
  dispose() {
    this._removeComponentEvents(), this._destroyMaterialSelect(), this._listenToFocusChange(!1), I.removeData(this._element, fi);
  }
  _removeComponentEvents() {
    h.off(this.input, "click"), h.off(this.wrapper, this._handleKeydown.bind(this)), h.off(this.clearButton, "click"), h.off(this.clearButton, "keydown"), h.off(window, "resize", this._handleWindowResize.bind(this));
  }
  _destroyMaterialSelect() {
    this._isOpen && this.close(), this._destroyMaterialTemplate();
  }
  _destroyMaterialTemplate() {
    const t = this._wrapper.parentNode, e = d.find("label", this._wrapper);
    t.appendChild(this._element), e.forEach((i) => {
      t.appendChild(i);
    }), e.forEach((i) => {
      i.removeAttribute(q);
    }), c.removeClass(this._element, this._classes.initialized), this._element.removeAttribute(xa), t.removeChild(this._wrapper);
  }
  setValue(t) {
    this.options.filter((i) => i.selected).forEach((i) => i.nativeOption.selected = !1), Array.isArray(t) ? t.forEach((i) => {
      this._selectByValue(i);
    }) : this._selectByValue(t), this._updateSelections();
  }
  _selectByValue(t) {
    const e = this.options.find(
      (i) => i.value === t
    );
    return e ? (e.nativeOption.selected = !0, !0) : !1;
  }
  static jQueryInterface(t, e) {
    return this.each(function() {
      let i = I.getData(this, fi);
      const n = typeof t == "object" && t;
      if (!(!i && /dispose/.test(t)) && (i || (i = new $o(this, n)), typeof t == "string")) {
        if (typeof i[t] > "u")
          throw new TypeError(`No method named "${t}"`);
        i[t](e);
      }
    });
  }
  static getInstance(t) {
    return I.getData(t, fi);
  }
  static getOrCreateInstance(t, e = {}) {
    return this.getInstance(t) || new this(t, typeof e == "object" ? e : null);
  }
}
const ag = ({ inputID: s, labelText: t }, e) => `<div data-te-chips-input-wrapper data-te-input-wrapper-init class="${e.chipsInputWrapper}">
      <input
          type="text"
          class="${e.chipsInput}"
          id="${s}"
          placeholder="Example label" />
        <label
          for="${s}"
          class="${e.chipsLabel}"
          >${t}
        </label>
      </div>
    </div>`, lg = ({ text: s, iconSVG: t }, e) => `<div data-te-chip-init data-te-ripple-init class="${e.chipElement}">
    <span data-te-chip-text>${s}</span> 
      <span data-te-chip-close class="${e.chipCloseIcon}">
        ${t}
      </span>
  </div>`, Ds = "chip", cg = `te.${Ds}`, _c = "data-te-chip-close", Wn = `[${_c}]`, hg = "delete.te.chips", dg = "select.te.chip", ug = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3"> <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>', pg = {
  text: "string",
  closeIcon: "boolean",
  img: "object",
  iconSVG: "string"
}, _g = {
  text: "",
  closeIcon: !1,
  img: { path: "", alt: "" },
  iconSVG: ug
}, fg = {
  icon: "float-right pl-[8px] text-[16px] opacity-[.53] cursor-pointer fill-[#afafaf] hover:text-[#8b8b8b] transition-all duration-200 ease-in-out",
  chipElement: "flex justify-between items-center h-[32px] leading-loose py-[5px] px-[12px] mr-4 my-[5px] text-[13px] font-normal text-[#4f4f4f] cursor-pointer bg-[#eceff1] dark:text-white dark:bg-neutral-600 rounded-[16px] transition-[opacity] duration-300 ease-linear [word-wrap: break-word] shadow-none normal-case hover:!shadow-none active:bg-[#cacfd1] inline-block font-medium leading-normal text-[#4f4f4f] text-center no-underline align-middle cursor-pointer select-none border-[.125rem] border-solid border-transparent py-1.5 px-3 text-xs rounded",
  chipCloseIcon: "w-4 float-right pl-[8px] text-[16px] opacity-[.53] cursor-pointer fill-[#afafaf] hover:fill-[#8b8b8b] dark:fill-gray-400 dark:hover:fill-gray-100 transition-all duration-200 ease-in-out"
}, mg = {
  icon: "string",
  chipElement: "string",
  chipCloseIcon: "string"
};
class hi {
  constructor(t, e = {}, i) {
    this._element = t, this._options = this._getConfig(e), this._classes = this._getClasses(i);
  }
  // Getters
  static get NAME() {
    return Ds;
  }
  // Public
  init() {
    this._appendCloseIcon(), this._handleDelete(), this._handleTextChip(), this._handleClickOnChip();
  }
  dispose() {
    this._element = null, this._options = null, h.off(this._element, "click");
  }
  appendChip() {
    const { text: t, closeIcon: e, iconSVG: i } = this._options;
    return lg({ text: t, closeIcon: e, iconSVG: i }, this._classes);
  }
  // Private
  _appendCloseIcon(t = this._element) {
    if (!(d.find(Wn, this._element).length > 0) && this._options.closeIcon) {
      const e = D("span");
      e.classList = this._classes.icon, e.setAttribute(_c), e.innerHTML = this._options.iconSVG, t.insertAdjacentElement("beforeend", e);
    }
  }
  _handleClickOnChip() {
    h.on(this._element, "click", (t) => {
      const { textContent: e } = t.target, i = {};
      i.tag = e.trim(), h.trigger(dg, { event: t, obj: i });
    });
  }
  _handleDelete() {
    d.find(
      Wn,
      this._element
    ).length !== 0 && h.on(this._element, "click", Wn, () => {
      h.trigger(this._element, hg), this._element.remove();
    });
  }
  _handleTextChip() {
    this._element.innerText === "" && (this._element.innerText = this._options.text);
  }
  _getConfig(t) {
    const e = {
      ..._g,
      ...c.getDataAttributes(this._element),
      ...t
    };
    return L(Ds, e, pg), e;
  }
  _getClasses(t) {
    const e = c.getDataClassAttributes(this._element);
    return t = {
      ...fg,
      ...e,
      ...t
    }, L(Ds, t, mg), t;
  }
  static getInstance(t) {
    return I.getData(t, cg);
  }
  static getOrCreateInstance(t, e = {}) {
    return this.getInstance(t) || new this(t, typeof e == "object" ? e : null);
  }
}
const wi = "chips", Ri = `data-te-${wi}`, Da = `te.${wi}`, gg = `${Ri}-input-init`, ft = `${Ri}-active`, $a = `${Ri}-initial`, fc = `${Ri}-placeholder`, bg = `${Ri}-input-wrapper`, ho = "data-te-chip-init", mc = "data-te-chip-close", gc = "data-te-chip-text", vg = `[${ft}]`, uo = `[${ho}]`, Tg = `${uo}${vg}`, Vn = `[${mc}]`, Eg = `[${bg}]`, Cg = `[${gc}]`, Ag = `[${fc}]`, yg = "data-te-input-notch-leading-ref", wg = "data-te-input-notch-middle-ref", xg = `[${yg}]`, kg = `[${wg}]`, Oe = "data-te-input-state-active", Fn = "[data-te-input-notch-ref]", Og = "add.te.chips", Sg = "arrowDown.te.chips", Ig = "arrowLeft.te.chips", Dg = "arrowRight.te.chips", $g = "arrowUp.te.chips", La = "delete.te.chips", Ma = "select.te.chips", Lg = {
  inputID: "string",
  parentSelector: "string",
  initialValues: "array",
  editable: "boolean",
  labelText: "string",
  inputClasses: "object",
  inputOptions: "object"
}, Mg = {
  inputID: bt("chips-input-"),
  parentSelector: "",
  initialValues: [{ tag: "init1" }, { tag: "init2" }],
  editable: !1,
  labelText: "Example label",
  inputClasses: {},
  inputOptions: {}
}, Ng = {
  opacity: "opacity-0",
  inputWrapperPadding: "p-[5px]",
  transition: "transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
  contentEditable: "outline-none !border-[3px] !border-solid !border-[#b2b3b4]",
  chipsInputWrapper: "relative flex items-center flex-wrap transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
  chipsInput: "peer block min-h-[auto] w-[150px] rounded border-0 bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-gray-200 dark:placeholder:text-gray-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0",
  chipsLabel: "pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-gray-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-gray-200 dark:peer-focus:text-gray-200"
}, Rg = {
  opacity: "string",
  inputWrapperPadding: "string",
  transition: "string",
  contentEditable: "string",
  chipsInputWrapper: "string",
  chipsInput: "string",
  chipsLabel: "string"
};
class K0 extends hi {
  constructor(e, i = {}, n) {
    super(e, i);
    At(this, "_handleBlurInput", ({ target: e }) => {
      e.value.length > 0 && this._handleCreateChip(e, e.value), this.allChips.length > 0 ? (e.setAttribute(ft, ""), this.input.setAttribute(Oe, ""), d.findOne(
        Fn,
        this.input.parentNode
      ).setAttribute(Oe, ""), this.chipsInputWrapper.classList.add(
        ...this._classes.inputWrapperPadding.split(" ")
      )) : (e.removeAttribute(ft), this.input.removeAttribute(Oe), d.findOne(
        Fn,
        this.input.parentNode
      ).removeAttribute(Oe), this.chipsInputWrapper.classList.remove(
        ...this._classes.inputWrapperPadding.split(" ")
      )), this.allChips.forEach((i) => i.removeAttribute(ft));
    });
    this._element = e, this._inputInstance = null, this._element && I.setData(e, Da, this), this._options = this._getConfig(i), this._classes = this._getClasses(n), this.numberClicks = 0, this.init();
  }
  // Getters
  static get NAME() {
    return wi;
  }
  get activeChip() {
    return d.findOne(Tg, this._element);
  }
  get input() {
    return d.findOne("input", this._element);
  }
  get allChips() {
    return d.find(uo, this._element);
  }
  get chipsInputWrapper() {
    return d.findOne(Eg, this._element);
  }
  // Public
  init() {
    this._setChipsClass(), this._appendInputToElement(fc), this._handleInitialValue(), this._handleInputText(), this._handleKeyboard(), this._handleChipsOnSelect(), this._handleEditable(), this._handleChipsFocus(), this._handleClicksOnChips(), this._inputInstance._getLabelWidth(), this._inputInstance._applyNotch();
  }
  dispose() {
    this._element = null, this._options = null;
  }
  // Private
  _getNotchData() {
    this._notchMiddle = d.findOne(
      kg,
      this._element
    ), this._notchLeading = d.findOne(
      xg,
      this._element
    );
  }
  _setChipsClass() {
    this._element.setAttribute(gg, "");
  }
  _handleDeleteEvents(e) {
    const [i] = this.allChips.slice(-1);
    if (this.activeChip === null)
      i.remove(), this._handleEvents(e, La);
    else {
      const n = this.allChips.findIndex((a) => a === this.activeChip), o = this._handleActiveChipAfterRemove(n), r = [];
      if (this.activeChip === null)
        return;
      this.activeChip.remove(), this._handleEvents(e, La), this.numberClicks = n, o.setAttribute(ft, ""), this.allChips.forEach((a) => {
        a.hasAttribute(ft) && (r.push(a), r.length > 1 && this.allChips.forEach((l) => l.remove()));
      });
    }
  }
  _handleUpEvents(e) {
    this.numberClicks += 1, this.numberClicks === this.allChips.length + 1 && (this.numberClicks = 0), this._handleRightKeyboardArrow(this.numberClicks), this._handleEvents(e, Dg), this._handleEvents(e, $g);
  }
  _handleDownEvents(e) {
    this.numberClicks -= 1, this.numberClicks <= 0 && (this.numberClicks = this.allChips.length), this._handleLeftKeyboardArrow(this.numberClicks), this._handleEvents(e, Ig), this._handleEvents(e, Sg);
  }
  _keyboardEvents(e) {
    const { target: i, keyCode: n, ctrlKey: o } = e;
    i.value.length > 0 || this.allChips.length === 0 || (n === I_ || n === D_ ? this._handleDeleteEvents(e) : n === Be || n === rt ? this._handleUpEvents(e) : n === Pe || n === z ? this._handleDownEvents(e) : n === 65 && o && this._handleAddActiveClass());
  }
  _handleKeyboard() {
    h.on(
      this.input,
      "keydown",
      (e) => this._keyboardEvents(e)
    );
  }
  _handleEditable() {
    const { editable: e } = this._options;
    e && this.allChips.forEach((i) => {
      h.on(i, "dblclick", (n) => {
        const o = d.findOne(Vn, i);
        i.classList.add(...this._classes.contentEditable.split(" ")), i.contentEditable = !0, i.focus(), setTimeout(() => {
          c.addStyle(o, { display: "none" });
        }, 200), o.classList.add(...this._classes.opacity.split(" ")), n.target.textContent, h.trigger(i, Ma, {
          event: n,
          allChips: this.allChips
        });
      }), h.on(document, "click", ({ target: n }) => {
        const o = d.findOne(Vn, i), r = d.findOne(Cg, i), a = n === i, l = i && i.contains(n);
        !a && !l && (i.contentEditable = !1, i.classList.remove(...this._classes.contentEditable.split(" ")), r.textContent !== "" && setTimeout(() => {
          c.addStyle(o, { display: "block" }), o.classList.remove(...this._classes.opacity.split(" "));
        }, 160)), r.textContent === "" && (setTimeout(() => {
          i.classList.add(...this._classes.opacity.split(" "));
        }, 200), setTimeout(() => {
          i.remove();
        }, 300));
      });
    });
  }
  _handleRemoveActiveClass() {
    this.allChips.forEach((e) => e.removeAttribute(ft));
  }
  _handleAddActiveClass() {
    this.allChips.forEach((e) => e.setAttribute(ft, ""));
  }
  _handleRightKeyboardArrow(e) {
    this._handleRemoveActiveClass(), e === 0 && (e = 1), this._handleAddActiveClassWithKebyboard(e);
  }
  _handleLeftKeyboardArrow(e) {
    this._handleRemoveActiveClass(), this._handleAddActiveClassWithKebyboard(e);
  }
  _handleActiveChipAfterRemove(e) {
    const i = e === 0 ? 1 : e - 1;
    return this.allChips[i];
  }
  _handleClicksOnChips() {
    h.on(this._element, "click", () => {
      this.allChips.length === 0 && (this.chipsInputWrapper.classList.remove(
        ...this._classes.inputWrapperPadding.split(" ")
      ), this.input.removeAttribute(ft));
    });
  }
  _handleTextContent() {
    const e = [];
    return this.allChips.forEach((i) => e.push({ tag: i.textContent.trim() })), e;
  }
  _handleEvents(e, i) {
    const n = this._handleTextContent(), o = this.allChips.filter(
      (r) => r.hasAttribute(ft) && r
    );
    h.trigger(this._element, i, {
      event: e,
      allChips: this.allChips,
      arrOfObjects: n,
      active: o,
      activeObj: {
        tag: o.length <= 0 ? "" : o[0].textContent.trim()
      }
    });
  }
  _handleChipsFocus() {
    h.on(this._element, "click", ({ target: { attributes: e } }) => {
      const i = [...e];
      i.includes(ho) || i.includes(mc) || i.includes(gc) || this.input.focus();
    });
  }
  _handleInitialValue() {
    if (this._appendInputToElement($a), this._element.hasAttribute($a)) {
      const { initialValues: e } = this._options;
      e.forEach(
        ({ tag: i }) => this._handleCreateChip(this.input, i)
      ), d.findOne(
        Fn,
        this.input.parentNode
      ).setAttribute(Oe, ""), this.input.setAttribute(ft, ""), this.input.setAttribute(Oe, "");
    }
    this.allChips.length > 0 && (this.chipsInputWrapper.classList.add(
      ...this._classes.inputWrapperPadding.split(" ")
    ), this.chipsInputWrapper.classList.add(
      ...this._classes.transition.split(" ")
    ));
  }
  _handleKeysInputToElement(e) {
    const { keyCode: i, target: n } = e;
    if (n.hasAttribute(ho)) {
      const o = d.findOne(Vn, n);
      i === lt && (n.contentEditable = !1, n.classList.remove(...this._classes.contentEditable.split(" ")), n.textContent !== "" ? setTimeout(() => {
        c.addStyle(o, { display: "block" }), o.classList.remove(...this._classes.opacity.split(" "));
      }, 160) : n.textContent === "" && (setTimeout(() => {
        n.classList.add(...this._classes.opacity.split(" "));
      }, 200), setTimeout(() => {
        n.remove();
      }, 300)));
      return;
    }
    if (i === lt) {
      if (n.value === "")
        return;
      this._handleCreateChip(n, n.value), this._handleRemoveActiveClass(), this.numberClicks = this.allChips.length + 1, this._handleEvents(e, Og);
    }
    this.allChips.length > 0 ? (this.chipsInputWrapper.classList.add(
      ...this._classes.inputWrapperPadding.split(" ")
    ), this.chipsInputWrapper.classList.add(
      ...this._classes.transition.split(" ")
    )) : this.chipsInputWrapper.classList.remove(
      ...this._classes.inputWrapperPadding.split(" ")
    );
  }
  _handleInputText() {
    const e = d.findOne(
      Ag,
      this._element
    );
    h.on(
      this._element,
      "keyup",
      e,
      (i) => this._handleKeysInputToElement(i)
    ), h.on(this.input, "blur", (i) => this._handleBlurInput(i));
  }
  _appendInputToElement(e) {
    if (!this._element.hasAttribute(e))
      return;
    const i = ag(this._options, this._classes);
    this._element.insertAdjacentHTML("beforeend", i);
    const n = d.findOne(
      "[data-te-chips-input-wrapper]",
      this._element
    );
    this._inputInstance = new W(
      n,
      this._options.inputOptions,
      this._options.inputClasses
    );
  }
  _handleCreateChip(e, i) {
    const n = D("div"), o = hi.getInstance(n), r = new hi(o, { text: i }, this._classes);
    this._options.parentSelector !== "" ? document.querySelector(this._options.parentSelector).insertAdjacentHTML("beforeend", r.appendChip()) : e.insertAdjacentHTML("beforebegin", r.appendChip()), e.value = "", d.find(uo).forEach((a) => {
      let l = hi.getInstance(a);
      return l || (l = new hi(a, {}, this._classes)), l.init();
    }), this._handleEditable();
  }
  _handleChipsOnSelect() {
    this.allChips.forEach((e) => {
      h.on(this._element, "click", (i) => {
        h.trigger(e, Ma, {
          event: i,
          allChips: this.allChips
        });
      });
    });
  }
  _handleAddActiveClassWithKebyboard(e) {
    let i;
    this.allChips[e - 1] === void 0 ? i = this.allChips[e - 2] : i = this.allChips[e - 1], i.setAttribute(ft);
  }
  _getConfig(e) {
    const i = {
      ...Mg,
      ...c.getDataAttributes(this._element),
      ...e
    };
    return L(wi, i, Lg), i;
  }
  _getClasses(e) {
    const i = c.getDataClassAttributes(this._element);
    return e = {
      ...Ng,
      ...i,
      ...e
    }, L(wi, e, Rg), e;
  }
  static getInstance(e) {
    return I.getData(e, Da);
  }
  static getOrCreateInstance(e, i = {}) {
    return this.getInstance(e) || new this(e, typeof i == "object" ? i : null);
  }
}
const zt = {
  plugins: {
    legend: {
      labels: {
        color: "rgb(102,102,102)"
      }
    }
  }
}, mi = {
  line: {
    options: {
      ...zt,
      elements: {
        line: {
          backgroundColor: "rgba(59, 112, 202, 0.0)",
          borderColor: "rgb(59, 112, 202)",
          borderWidth: 2,
          tension: 0
        },
        point: {
          borderColor: "rgb(59, 112, 202)",
          backgroundColor: "rgb(59, 112, 202)"
        }
      },
      responsive: !0,
      legend: {
        display: !0
      },
      tooltips: {
        intersect: !1,
        mode: "index"
      },
      datasets: {
        borderColor: "red"
      },
      scales: {
        x: {
          stacked: !0,
          grid: {
            display: !1
          },
          ticks: {
            fontColor: "rgba(0,0,0, 0.5)"
          }
        },
        y: {
          stacked: !1,
          grid: {
            borderDash: [2],
            drawBorder: !1,
            zeroLineColor: "rgba(0,0,0,0)",
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2]
          },
          ticks: {
            fontColor: "rgba(0,0,0, 0.5)"
          }
        }
      }
    }
  },
  bar: {
    options: {
      ...zt,
      backgroundColor: "rgb(59, 112, 202)",
      borderWidth: 0,
      responsive: !0,
      legend: {
        display: !0
      },
      tooltips: {
        intersect: !1,
        mode: "index"
      },
      scales: {
        x: {
          stacked: !0,
          grid: {
            display: !1
          },
          ticks: {
            fontColor: "rgba(0,0,0, 0.5)"
          }
        },
        y: {
          stacked: !0,
          grid: {
            borderDash: [2],
            drawBorder: !1,
            zeroLineColor: "rgba(0,0,0,0)",
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2]
          },
          ticks: {
            fontColor: "rgba(0,0,0, 0.5)"
          }
        }
      }
    }
  },
  pie: {
    options: {
      ...zt,
      elements: {
        arc: { backgroundColor: "rgb(59, 112, 202)" }
      },
      responsive: !0,
      legend: {
        display: !0
      }
    }
  },
  doughnut: {
    options: {
      ...zt,
      elements: {
        arc: { backgroundColor: "rgb(59, 112, 202)" }
      },
      responsive: !0,
      legend: {
        display: !0
      }
    }
  },
  polarArea: {
    options: {
      ...zt,
      elements: {
        arc: { backgroundColor: "rgba(59, 112, 202, 0.5)" }
      },
      responsive: !0,
      legend: {
        display: !0
      }
    }
  },
  radar: {
    options: {
      ...zt,
      elements: {
        line: {
          backgroundColor: "rgba(59, 112, 202, 0.5)",
          borderColor: "rgb(59, 112, 202)",
          borderWidth: 2
        },
        point: {
          borderColor: "rgb(59, 112, 202)",
          backgroundColor: "rgb(59, 112, 202)"
        }
      },
      responsive: !0,
      legend: {
        display: !0
      }
    }
  },
  scatter: {
    options: {
      ...zt,
      elements: {
        line: {
          backgroundColor: "rgba(59, 112, 202, 0.5)",
          borderColor: "rgb(59, 112, 202)",
          borderWidth: 2,
          tension: 0
        },
        point: {
          borderColor: "rgb(59, 112, 202)",
          backgroundColor: "rgba(59, 112, 202, 0.5)"
        }
      },
      responsive: !0,
      legend: {
        display: !0
      },
      tooltips: {
        intersect: !1,
        mode: "index"
      },
      datasets: {
        borderColor: "red"
      },
      scales: {
        x: {
          stacked: !0,
          grid: {
            display: !1
          },
          ticks: {
            fontColor: "rgba(0,0,0, 0.5)"
          }
        },
        y: {
          stacked: !1,
          grid: {
            borderDash: [2],
            drawBorder: !1,
            zeroLineColor: "rgba(0,0,0,0)",
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2]
          },
          ticks: {
            fontColor: "rgba(0,0,0, 0.5)"
          }
        }
      }
    }
  },
  bubble: {
    options: {
      ...zt,
      elements: {
        point: {
          borderColor: "rgb(59, 112, 202)",
          backgroundColor: "rgba(59, 112, 202, 0.5)"
        }
      },
      responsive: !0,
      legend: {
        display: !0
      },
      scales: {
        x: {
          grid: {
            display: !1
          },
          ticks: {
            fontColor: "rgba(0,0,0, 0.5)"
          }
        },
        y: {
          grid: {
            borderDash: [2],
            drawBorder: !1,
            zeroLineColor: "rgba(0,0,0,0)",
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2]
          },
          ticks: {
            fontColor: "rgba(0,0,0, 0.5)"
          }
        }
      }
    }
  }
};
var Pg = function(t) {
  return Bg(t) && !Hg(t);
};
function Bg(s) {
  return !!s && typeof s == "object";
}
function Hg(s) {
  var t = Object.prototype.toString.call(s);
  return t === "[object RegExp]" || t === "[object Date]" || Fg(s);
}
var Wg = typeof Symbol == "function" && Symbol.for, Vg = Wg ? Symbol.for("react.element") : 60103;
function Fg(s) {
  return s.$$typeof === Vg;
}
function Yg(s) {
  return Array.isArray(s) ? [] : {};
}
function Si(s, t) {
  return t.clone !== !1 && t.isMergeableObject(s) ? Xe(Yg(s), s, t) : s;
}
function jg(s, t, e) {
  return s.concat(t).map(function(i) {
    return Si(i, e);
  });
}
function Kg(s, t) {
  if (!t.customMerge)
    return Xe;
  var e = t.customMerge(s);
  return typeof e == "function" ? e : Xe;
}
function zg(s) {
  return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(s).filter(function(t) {
    return Object.propertyIsEnumerable.call(s, t);
  }) : [];
}
function Na(s) {
  return Object.keys(s).concat(zg(s));
}
function bc(s, t) {
  try {
    return t in s;
  } catch {
    return !1;
  }
}
function Ug(s, t) {
  return bc(s, t) && !(Object.hasOwnProperty.call(s, t) && Object.propertyIsEnumerable.call(s, t));
}
function Xg(s, t, e) {
  var i = {};
  return e.isMergeableObject(s) && Na(s).forEach(function(n) {
    i[n] = Si(s[n], e);
  }), Na(t).forEach(function(n) {
    Ug(s, n) || (bc(s, n) && e.isMergeableObject(t[n]) ? i[n] = Kg(n, e)(s[n], t[n], e) : i[n] = Si(t[n], e));
  }), i;
}
function Xe(s, t, e) {
  e = e || {}, e.arrayMerge = e.arrayMerge || jg, e.isMergeableObject = e.isMergeableObject || Pg, e.cloneUnlessOtherwiseSpecified = Si;
  var i = Array.isArray(t), n = Array.isArray(s), o = i === n;
  return o ? i ? e.arrayMerge(s, t, e) : Xg(s, t, e) : Si(t, e);
}
Xe.all = function(t, e) {
  if (!Array.isArray(t))
    throw new Error("first argument should be an array");
  return t.reduce(function(i, n) {
    return Xe(i, n, e);
  }, {});
};
var Gg = Xe, po = Gg;
const Ra = "chart", _s = "te.chart", qg = "chart", Yn = (s, t, e) => {
  const i = (n, o, r) => {
    const a = n.slice();
    return o.forEach((l, p) => {
      typeof a[p] > "u" ? a[p] = r.cloneUnlessOtherwiseSpecified(
        l,
        r
      ) : r.isMergeableObject(l) ? a[p] = po(n[p], l, r) : n.indexOf(l) === -1 && a.push(l);
    }), a;
  };
  return po(e[t], s, {
    arrayMerge: i
  });
}, Zg = {
  darkTicksColor: "#fff",
  darkLabelColor: "#fff",
  darkGridLinesColor: "#555",
  darkmodeOff: "undefined",
  darkMode: null,
  darkBgColor: "#262626",
  darkBgColorLight: "#fff",
  options: null
}, Qg = {
  darkTicksColor: "string",
  darkLabelColor: "string",
  darkGridLinesColor: "string",
  darkmodeOff: "(string|null)",
  darkMode: "(string|null)",
  darkBgColor: "string",
  darkBgColorLight: "string",
  options: "(object|null)"
};
class vc {
  constructor(t, e, i = {}, n = {}) {
    this._waitForCharts(t, e, i, n);
  }
  async _getChartjs() {
    const {
      Chart: t,
      ArcElement: e,
      LineElement: i,
      BarElement: n,
      PointElement: o,
      BarController: r,
      BubbleController: a,
      DoughnutController: l,
      LineController: p,
      PieController: u,
      PolarAreaController: f,
      RadarController: _,
      ScatterController: m,
      CategoryScale: g,
      LinearScale: v,
      LogarithmicScale: b,
      RadialLinearScale: C,
      TimeScale: y,
      TimeSeriesScale: E,
      Decimation: T,
      Filler: A,
      Legend: w,
      Title: S,
      Tooltip: k,
      SubTitle: x
    } = await __webpack_require__.e(/*! import() */ "node_modules_tw-elements_dist_js_chart_es_js").then(__webpack_require__.bind(__webpack_require__, /*! ./chart.es.js */ "./node_modules/tw-elements/dist/js/chart.es.js")).then(($) => $.f);
    return t.register(
      e,
      i,
      n,
      o,
      r,
      a,
      l,
      p,
      u,
      f,
      _,
      m,
      g,
      v,
      b,
      C,
      y,
      E,
      T,
      A,
      w,
      S,
      k,
      x
    ), t;
  }
  async _getChartDataLabels() {
    return await __webpack_require__.e(/*! import() */ "node_modules_tw-elements_dist_js_chartjs-plugin-datalabels_es_js").then(__webpack_require__.bind(__webpack_require__, /*! ./chartjs-plugin-datalabels.es.js */ "./node_modules/tw-elements/dist/js/chartjs-plugin-datalabels.es.js"));
  }
  async _waitForCharts(t, e, i = {}, n = {}) {
    if (this._Chartjs = await this._getChartjs(), this._ChartDataLabels = await this._getChartDataLabels(), this._element = t, this._data = e, this._options = i, this._type = e.type, this._canvas = null, this._chart = null, this._darkOptions = this._getDarkConfig(n), this._darkModeClassContainer = document.querySelector("html"), this._prevConfig = null, this._observer = null, this._element && (I.setData(t, _s, this), c.addClass(this._element, qg), this._chartConstructor()), this._darkOptions.darkmodeOff !== null) {
      const o = this._darkOptions.darkMode === "dark" ? "dark" : this._darkOptions.darkMode === "light" ? "light" : this.systemColorMode;
      this._handleMode(o), this._observer = new MutationObserver(this._observerCallback.bind(this)), this._observer.observe(this._darkModeClassContainer, {
        attributes: !0
      });
    }
  }
  // Getters
  static get NAME() {
    return Ra;
  }
  get systemColorMode() {
    return localStorage.theme || (this._darkModeClassContainer.classList.contains("dark") ? "dark" : "light");
  }
  // Public
  dispose() {
    this._observer.disconnect(), I.removeData(this._element, _s), this._element = null;
  }
  update(t, e) {
    t && (this._data = { ...this._data, ...t }, this._chart.data = this._data);
    const i = Object.prototype.hasOwnProperty.call(
      e,
      "options"
    ) ? e : { options: { ...e } };
    this._options = po(this._options, i), this._chart.options = Yn(
      this._options,
      this._type,
      mi
    ).options, this._chart.update();
  }
  setTheme(t) {
    t !== "dark" && t !== "light" || !this._data || this._handleMode(t);
  }
  // Private
  _getDarkConfig(t) {
    let e = {};
    const i = c.getDataAttributes(this._element);
    Object.keys(i).forEach(
      (p) => p.startsWith("dark") && (e[p] = i[p])
    ), e = {
      ...Zg,
      ...e
    };
    const n = {
      y: {
        ticks: {
          color: e.darkTicksColor
        },
        grid: {
          color: e.darkGridLinesColor
        }
      },
      x: {
        ticks: {
          color: e.darkTicksColor
        },
        grid: {
          color: e.darkGridLinesColor
        }
      }
    }, o = {
      r: {
        ticks: {
          color: e.darkTicksColor,
          backdropColor: e.darkBgColor
        },
        grid: {
          color: e.darkGridLinesColor
        },
        pointLabels: {
          color: e.darkTicksColor
        }
      }
    }, l = {
      scales: ["pie", "doughnut", "polarArea", "radar"].includes(this._type) ? ["polarArea", "radar"].includes(this._type) ? o : {} : n,
      plugins: {
        legend: {
          labels: {
            color: e.darkLabelColor
          }
        }
      }
    };
    return t = {
      ...e,
      options: {
        ...l
      },
      ...t
    }, L(Ra, t, Qg), t;
  }
  _chartConstructor() {
    if (this._data) {
      this._createCanvas();
      const t = Yn(this._options, this._type, mi), e = [];
      t.dataLabelsPlugin && e.push(this._ChartDataLabels.default), this._prevConfig = t, this._chart = new this._Chartjs(this._canvas, {
        ...this._data,
        ...t,
        plugins: e
      });
    }
  }
  _createCanvas() {
    this._canvas || (this._element.nodeName === "CANVAS" ? this._canvas = this._element : (this._canvas = D("canvas"), this._element.appendChild(this._canvas)));
  }
  _handleMode(t) {
    t === "dark" ? (this._changeDatasetBorderColor(), this.update(null, this._darkOptions.options)) : (this._changeDatasetBorderColor(!1), this._prevConfig && this.update(null, this._prevConfig));
  }
  _observerCallback(t) {
    for (const e of t)
      e.type === "attributes" && this._handleMode(this.systemColorMode);
  }
  _changeDatasetBorderColor(t = !0) {
    [...this._data.data.datasets].forEach(
      (e) => ["pie", "doughnut", "polarArea"].includes(this._type) && (e.borderColor = t ? this._darkOptions.darkBgColor : this._darkOptions.darkBgColorLight)
    );
  }
  static jQueryInterface(t, e, i) {
    return this.each(function() {
      let n = I.getData(this, _s);
      if (!(!n && /dispose/.test(t))) {
        if (!n) {
          const o = e ? Yn(e, i, mi) : mi[i];
          n = new vc(this, {
            ...t,
            ...o
          });
        }
        if (typeof t == "string") {
          if (typeof n[t] > "u")
            throw new TypeError(`No method named "${t}"`);
          n[t](e, i);
        }
      }
    });
  }
  static getInstance(t) {
    return I.getData(t, _s);
  }
  static getOrCreateInstance(t, e = {}) {
    return this.getInstance(t) || new this(t, typeof e == "object" ? e : null);
  }
}
/*!
 * perfect-scrollbar v1.5.3
 * Copyright 2021 Hyunje Jun, MDBootstrap and Contributors
 * Licensed under MIT
 */
function $t(s) {
  return getComputedStyle(s);
}
function ot(s, t) {
  for (var e in t) {
    var i = t[e];
    typeof i == "number" && (i = i + "px"), s.style[e] = i;
  }
  return s;
}
function fs(s) {
  var t = document.createElement("div");
  return t.className = s, t;
}
var Pa = typeof Element < "u" && (Element.prototype.matches || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector);
function Zt(s, t) {
  if (!Pa)
    throw new Error("No element matching method supported");
  return Pa.call(s, t);
}
function Ne(s) {
  s.remove ? s.remove() : s.parentNode && s.parentNode.removeChild(s);
}
function Ba(s, t) {
  return Array.prototype.filter.call(
    s.children,
    function(e) {
      return Zt(e, t);
    }
  );
}
var j = {
  main: "ps",
  rtl: "ps__rtl",
  element: {
    thumb: function(s) {
      return "ps__thumb-" + s;
    },
    rail: function(s) {
      return "ps__rail-" + s;
    },
    consuming: "ps__child--consume"
  },
  state: {
    focus: "ps--focus",
    clicking: "ps--clicking",
    active: function(s) {
      return "ps--active-" + s;
    },
    scrolling: function(s) {
      return "ps--scrolling-" + s;
    }
  }
}, Tc = { x: null, y: null };
function Ec(s, t) {
  var e = s.element.classList, i = j.state.scrolling(t);
  e.contains(i) ? clearTimeout(Tc[t]) : e.add(i);
}
function Cc(s, t) {
  Tc[t] = setTimeout(
    function() {
      return s.isAlive && s.element.classList.remove(j.state.scrolling(t));
    },
    s.settings.scrollingThreshold
  );
}
function Jg(s, t) {
  Ec(s, t), Cc(s, t);
}
var Pi = function(t) {
  this.element = t, this.handlers = {};
}, Ac = { isEmpty: { configurable: !0 } };
Pi.prototype.bind = function(t, e) {
  typeof this.handlers[t] > "u" && (this.handlers[t] = []), this.handlers[t].push(e), this.element.addEventListener(t, e, !1);
};
Pi.prototype.unbind = function(t, e) {
  var i = this;
  this.handlers[t] = this.handlers[t].filter(function(n) {
    return e && n !== e ? !0 : (i.element.removeEventListener(t, n, !1), !1);
  });
};
Pi.prototype.unbindAll = function() {
  for (var t in this.handlers)
    this.unbind(t);
};
Ac.isEmpty.get = function() {
  var s = this;
  return Object.keys(this.handlers).every(
    function(t) {
      return s.handlers[t].length === 0;
    }
  );
};
Object.defineProperties(Pi.prototype, Ac);
var Je = function() {
  this.eventElements = [];
};
Je.prototype.eventElement = function(t) {
  var e = this.eventElements.filter(function(i) {
    return i.element === t;
  })[0];
  return e || (e = new Pi(t), this.eventElements.push(e)), e;
};
Je.prototype.bind = function(t, e, i) {
  this.eventElement(t).bind(e, i);
};
Je.prototype.unbind = function(t, e, i) {
  var n = this.eventElement(t);
  n.unbind(e, i), n.isEmpty && this.eventElements.splice(this.eventElements.indexOf(n), 1);
};
Je.prototype.unbindAll = function() {
  this.eventElements.forEach(function(t) {
    return t.unbindAll();
  }), this.eventElements = [];
};
Je.prototype.once = function(t, e, i) {
  var n = this.eventElement(t), o = function(r) {
    n.unbind(e, o), i(r);
  };
  n.bind(e, o);
};
function ms(s) {
  if (typeof window.CustomEvent == "function")
    return new CustomEvent(s);
  var t = document.createEvent("CustomEvent");
  return t.initCustomEvent(s, !1, !1, void 0), t;
}
function Bs(s, t, e, i, n) {
  i === void 0 && (i = !0), n === void 0 && (n = !1);
  var o;
  if (t === "top")
    o = [
      "contentHeight",
      "containerHeight",
      "scrollTop",
      "y",
      "up",
      "down"
    ];
  else if (t === "left")
    o = [
      "contentWidth",
      "containerWidth",
      "scrollLeft",
      "x",
      "left",
      "right"
    ];
  else
    throw new Error("A proper axis should be provided");
  tb(s, e, o, i, n);
}
function tb(s, t, e, i, n) {
  var o = e[0], r = e[1], a = e[2], l = e[3], p = e[4], u = e[5];
  i === void 0 && (i = !0), n === void 0 && (n = !1);
  var f = s.element;
  s.reach[l] = null, f[a] < 1 && (s.reach[l] = "start"), f[a] > s[o] - s[r] - 1 && (s.reach[l] = "end"), t && (f.dispatchEvent(ms("ps-scroll-" + l)), t < 0 ? f.dispatchEvent(ms("ps-scroll-" + p)) : t > 0 && f.dispatchEvent(ms("ps-scroll-" + u)), i && Jg(s, l)), s.reach[l] && (t || n) && f.dispatchEvent(ms("ps-" + l + "-reach-" + s.reach[l]));
}
function V(s) {
  return parseInt(s, 10) || 0;
}
function eb(s) {
  return Zt(s, "input,[contenteditable]") || Zt(s, "select,[contenteditable]") || Zt(s, "textarea,[contenteditable]") || Zt(s, "button,[contenteditable]");
}
function ib(s) {
  var t = $t(s);
  return V(t.width) + V(t.paddingLeft) + V(t.paddingRight) + V(t.borderLeftWidth) + V(t.borderRightWidth);
}
var $e = {
  isWebKit: typeof document < "u" && "WebkitAppearance" in document.documentElement.style,
  supportsTouch: typeof window < "u" && ("ontouchstart" in window || "maxTouchPoints" in window.navigator && window.navigator.maxTouchPoints > 0 || window.DocumentTouch && document instanceof window.DocumentTouch),
  supportsIePointer: typeof navigator < "u" && navigator.msMaxTouchPoints,
  isChrome: typeof navigator < "u" && /Chrome/i.test(navigator && navigator.userAgent)
};
function Bt(s) {
  var t = s.element, e = Math.floor(t.scrollTop), i = t.getBoundingClientRect();
  s.containerWidth = Math.round(i.width), s.containerHeight = Math.round(i.height), s.contentWidth = t.scrollWidth, s.contentHeight = t.scrollHeight, t.contains(s.scrollbarXRail) || (Ba(t, j.element.rail("x")).forEach(
    function(n) {
      return Ne(n);
    }
  ), t.appendChild(s.scrollbarXRail)), t.contains(s.scrollbarYRail) || (Ba(t, j.element.rail("y")).forEach(
    function(n) {
      return Ne(n);
    }
  ), t.appendChild(s.scrollbarYRail)), !s.settings.suppressScrollX && s.containerWidth + s.settings.scrollXMarginOffset < s.contentWidth ? (s.scrollbarXActive = !0, s.railXWidth = s.containerWidth - s.railXMarginWidth, s.railXRatio = s.containerWidth / s.railXWidth, s.scrollbarXWidth = Ha(
    s,
    V(s.railXWidth * s.containerWidth / s.contentWidth)
  ), s.scrollbarXLeft = V(
    (s.negativeScrollAdjustment + t.scrollLeft) * (s.railXWidth - s.scrollbarXWidth) / (s.contentWidth - s.containerWidth)
  )) : s.scrollbarXActive = !1, !s.settings.suppressScrollY && s.containerHeight + s.settings.scrollYMarginOffset < s.contentHeight ? (s.scrollbarYActive = !0, s.railYHeight = s.containerHeight - s.railYMarginHeight, s.railYRatio = s.containerHeight / s.railYHeight, s.scrollbarYHeight = Ha(
    s,
    V(s.railYHeight * s.containerHeight / s.contentHeight)
  ), s.scrollbarYTop = V(
    e * (s.railYHeight - s.scrollbarYHeight) / (s.contentHeight - s.containerHeight)
  )) : s.scrollbarYActive = !1, s.scrollbarXLeft >= s.railXWidth - s.scrollbarXWidth && (s.scrollbarXLeft = s.railXWidth - s.scrollbarXWidth), s.scrollbarYTop >= s.railYHeight - s.scrollbarYHeight && (s.scrollbarYTop = s.railYHeight - s.scrollbarYHeight), sb(t, s), s.scrollbarXActive ? t.classList.add(j.state.active("x")) : (t.classList.remove(j.state.active("x")), s.scrollbarXWidth = 0, s.scrollbarXLeft = 0, t.scrollLeft = s.isRtl === !0 ? s.contentWidth : 0), s.scrollbarYActive ? t.classList.add(j.state.active("y")) : (t.classList.remove(j.state.active("y")), s.scrollbarYHeight = 0, s.scrollbarYTop = 0, t.scrollTop = 0);
}
function Ha(s, t) {
  return s.settings.minScrollbarLength && (t = Math.max(t, s.settings.minScrollbarLength)), s.settings.maxScrollbarLength && (t = Math.min(t, s.settings.maxScrollbarLength)), t;
}
function sb(s, t) {
  var e = { width: t.railXWidth }, i = Math.floor(s.scrollTop);
  t.isRtl ? e.left = t.negativeScrollAdjustment + s.scrollLeft + t.containerWidth - t.contentWidth : e.left = s.scrollLeft, t.isScrollbarXUsingBottom ? e.bottom = t.scrollbarXBottom - i : e.top = t.scrollbarXTop + i, ot(t.scrollbarXRail, e);
  var n = { top: i, height: t.railYHeight };
  t.isScrollbarYUsingRight ? t.isRtl ? n.right = t.contentWidth - (t.negativeScrollAdjustment + s.scrollLeft) - t.scrollbarYRight - t.scrollbarYOuterWidth - 9 : n.right = t.scrollbarYRight - s.scrollLeft : t.isRtl ? n.left = t.negativeScrollAdjustment + s.scrollLeft + t.containerWidth * 2 - t.contentWidth - t.scrollbarYLeft - t.scrollbarYOuterWidth : n.left = t.scrollbarYLeft + s.scrollLeft, ot(t.scrollbarYRail, n), ot(t.scrollbarX, {
    left: t.scrollbarXLeft,
    width: t.scrollbarXWidth - t.railBorderXWidth
  }), ot(t.scrollbarY, {
    top: t.scrollbarYTop,
    height: t.scrollbarYHeight - t.railBorderYWidth
  });
}
function nb(s) {
  s.element, s.event.bind(s.scrollbarY, "mousedown", function(t) {
    return t.stopPropagation();
  }), s.event.bind(s.scrollbarYRail, "mousedown", function(t) {
    var e = t.pageY - window.pageYOffset - s.scrollbarYRail.getBoundingClientRect().top, i = e > s.scrollbarYTop ? 1 : -1;
    s.element.scrollTop += i * s.containerHeight, Bt(s), t.stopPropagation();
  }), s.event.bind(s.scrollbarX, "mousedown", function(t) {
    return t.stopPropagation();
  }), s.event.bind(s.scrollbarXRail, "mousedown", function(t) {
    var e = t.pageX - window.pageXOffset - s.scrollbarXRail.getBoundingClientRect().left, i = e > s.scrollbarXLeft ? 1 : -1;
    s.element.scrollLeft += i * s.containerWidth, Bt(s), t.stopPropagation();
  });
}
function ob(s) {
  Wa(s, [
    "containerWidth",
    "contentWidth",
    "pageX",
    "railXWidth",
    "scrollbarX",
    "scrollbarXWidth",
    "scrollLeft",
    "x",
    "scrollbarXRail"
  ]), Wa(s, [
    "containerHeight",
    "contentHeight",
    "pageY",
    "railYHeight",
    "scrollbarY",
    "scrollbarYHeight",
    "scrollTop",
    "y",
    "scrollbarYRail"
  ]);
}
function Wa(s, t) {
  var e = t[0], i = t[1], n = t[2], o = t[3], r = t[4], a = t[5], l = t[6], p = t[7], u = t[8], f = s.element, _ = null, m = null, g = null;
  function v(y) {
    y.touches && y.touches[0] && (y[n] = y.touches[0].pageY), f[l] = _ + g * (y[n] - m), Ec(s, p), Bt(s), y.stopPropagation(), y.type.startsWith("touch") && y.changedTouches.length > 1 && y.preventDefault();
  }
  function b() {
    Cc(s, p), s[u].classList.remove(j.state.clicking), s.event.unbind(s.ownerDocument, "mousemove", v);
  }
  function C(y, E) {
    _ = f[l], E && y.touches && (y[n] = y.touches[0].pageY), m = y[n], g = (s[i] - s[e]) / (s[o] - s[a]), E ? s.event.bind(s.ownerDocument, "touchmove", v) : (s.event.bind(s.ownerDocument, "mousemove", v), s.event.once(s.ownerDocument, "mouseup", b), y.preventDefault()), s[u].classList.add(j.state.clicking), y.stopPropagation();
  }
  s.event.bind(s[r], "mousedown", function(y) {
    C(y);
  }), s.event.bind(s[r], "touchstart", function(y) {
    C(y, !0);
  });
}
function rb(s) {
  var t = s.element, e = function() {
    return Zt(t, ":hover");
  }, i = function() {
    return Zt(s.scrollbarX, ":focus") || Zt(s.scrollbarY, ":focus");
  };
  function n(o, r) {
    var a = Math.floor(t.scrollTop);
    if (o === 0) {
      if (!s.scrollbarYActive)
        return !1;
      if (a === 0 && r > 0 || a >= s.contentHeight - s.containerHeight && r < 0)
        return !s.settings.wheelPropagation;
    }
    var l = t.scrollLeft;
    if (r === 0) {
      if (!s.scrollbarXActive)
        return !1;
      if (l === 0 && o < 0 || l >= s.contentWidth - s.containerWidth && o > 0)
        return !s.settings.wheelPropagation;
    }
    return !0;
  }
  s.event.bind(s.ownerDocument, "keydown", function(o) {
    if (!(o.isDefaultPrevented && o.isDefaultPrevented() || o.defaultPrevented) && !(!e() && !i())) {
      var r = document.activeElement ? document.activeElement : s.ownerDocument.activeElement;
      if (r) {
        if (r.tagName === "IFRAME")
          r = r.contentDocument.activeElement;
        else
          for (; r.shadowRoot; )
            r = r.shadowRoot.activeElement;
        if (eb(r))
          return;
      }
      var a = 0, l = 0;
      switch (o.which) {
        case 37:
          o.metaKey ? a = -s.contentWidth : o.altKey ? a = -s.containerWidth : a = -30;
          break;
        case 38:
          o.metaKey ? l = s.contentHeight : o.altKey ? l = s.containerHeight : l = 30;
          break;
        case 39:
          o.metaKey ? a = s.contentWidth : o.altKey ? a = s.containerWidth : a = 30;
          break;
        case 40:
          o.metaKey ? l = -s.contentHeight : o.altKey ? l = -s.containerHeight : l = -30;
          break;
        case 32:
          o.shiftKey ? l = s.containerHeight : l = -s.containerHeight;
          break;
        case 33:
          l = s.containerHeight;
          break;
        case 34:
          l = -s.containerHeight;
          break;
        case 36:
          l = s.contentHeight;
          break;
        case 35:
          l = -s.contentHeight;
          break;
        default:
          return;
      }
      s.settings.suppressScrollX && a !== 0 || s.settings.suppressScrollY && l !== 0 || (t.scrollTop -= l, t.scrollLeft += a, Bt(s), n(a, l) && o.preventDefault());
    }
  });
}
function ab(s) {
  var t = s.element;
  function e(r, a) {
    var l = Math.floor(t.scrollTop), p = t.scrollTop === 0, u = l + t.offsetHeight === t.scrollHeight, f = t.scrollLeft === 0, _ = t.scrollLeft + t.offsetWidth === t.scrollWidth, m;
    return Math.abs(a) > Math.abs(r) ? m = p || u : m = f || _, m ? !s.settings.wheelPropagation : !0;
  }
  function i(r) {
    var a = r.deltaX, l = -1 * r.deltaY;
    return (typeof a > "u" || typeof l > "u") && (a = -1 * r.wheelDeltaX / 6, l = r.wheelDeltaY / 6), r.deltaMode && r.deltaMode === 1 && (a *= 10, l *= 10), a !== a && l !== l && (a = 0, l = r.wheelDelta), r.shiftKey ? [-l, -a] : [a, l];
  }
  function n(r, a, l) {
    if (!$e.isWebKit && t.querySelector("select:focus"))
      return !0;
    if (!t.contains(r))
      return !1;
    for (var p = r; p && p !== t; ) {
      if (p.classList.contains(j.element.consuming))
        return !0;
      var u = $t(p);
      if (l && u.overflowY.match(/(scroll|auto)/)) {
        var f = p.scrollHeight - p.clientHeight;
        if (f > 0 && (p.scrollTop > 0 && l < 0 || p.scrollTop < f && l > 0))
          return !0;
      }
      if (a && u.overflowX.match(/(scroll|auto)/)) {
        var _ = p.scrollWidth - p.clientWidth;
        if (_ > 0 && (p.scrollLeft > 0 && a < 0 || p.scrollLeft < _ && a > 0))
          return !0;
      }
      p = p.parentNode;
    }
    return !1;
  }
  function o(r) {
    var a = i(r), l = a[0], p = a[1];
    if (!n(r.target, l, p)) {
      var u = !1;
      s.settings.useBothWheelAxes ? s.scrollbarYActive && !s.scrollbarXActive ? (p ? t.scrollTop -= p * s.settings.wheelSpeed : t.scrollTop += l * s.settings.wheelSpeed, u = !0) : s.scrollbarXActive && !s.scrollbarYActive && (l ? t.scrollLeft += l * s.settings.wheelSpeed : t.scrollLeft -= p * s.settings.wheelSpeed, u = !0) : (t.scrollTop -= p * s.settings.wheelSpeed, t.scrollLeft += l * s.settings.wheelSpeed), Bt(s), u = u || e(l, p), u && !r.ctrlKey && (r.stopPropagation(), r.preventDefault());
    }
  }
  typeof window.onwheel < "u" ? s.event.bind(t, "wheel", o) : typeof window.onmousewheel < "u" && s.event.bind(t, "mousewheel", o);
}
function lb(s) {
  if (!$e.supportsTouch && !$e.supportsIePointer)
    return;
  var t = s.element;
  function e(g, v) {
    var b = Math.floor(t.scrollTop), C = t.scrollLeft, y = Math.abs(g), E = Math.abs(v);
    if (E > y) {
      if (v < 0 && b === s.contentHeight - s.containerHeight || v > 0 && b === 0)
        return window.scrollY === 0 && v > 0 && $e.isChrome;
    } else if (y > E && (g < 0 && C === s.contentWidth - s.containerWidth || g > 0 && C === 0))
      return !0;
    return !0;
  }
  function i(g, v) {
    t.scrollTop -= v, t.scrollLeft -= g, Bt(s);
  }
  var n = {}, o = 0, r = {}, a = null;
  function l(g) {
    return g.targetTouches ? g.targetTouches[0] : g;
  }
  function p(g) {
    return g.pointerType && g.pointerType === "pen" && g.buttons === 0 ? !1 : !!(g.targetTouches && g.targetTouches.length === 1 || g.pointerType && g.pointerType !== "mouse" && g.pointerType !== g.MSPOINTER_TYPE_MOUSE);
  }
  function u(g) {
    if (p(g)) {
      var v = l(g);
      n.pageX = v.pageX, n.pageY = v.pageY, o = (/* @__PURE__ */ new Date()).getTime(), a !== null && clearInterval(a);
    }
  }
  function f(g, v, b) {
    if (!t.contains(g))
      return !1;
    for (var C = g; C && C !== t; ) {
      if (C.classList.contains(j.element.consuming))
        return !0;
      var y = $t(C);
      if (b && y.overflowY.match(/(scroll|auto)/)) {
        var E = C.scrollHeight - C.clientHeight;
        if (E > 0 && (C.scrollTop > 0 && b < 0 || C.scrollTop < E && b > 0))
          return !0;
      }
      if (v && y.overflowX.match(/(scroll|auto)/)) {
        var T = C.scrollWidth - C.clientWidth;
        if (T > 0 && (C.scrollLeft > 0 && v < 0 || C.scrollLeft < T && v > 0))
          return !0;
      }
      C = C.parentNode;
    }
    return !1;
  }
  function _(g) {
    if (p(g)) {
      var v = l(g), b = { pageX: v.pageX, pageY: v.pageY }, C = b.pageX - n.pageX, y = b.pageY - n.pageY;
      if (f(g.target, C, y))
        return;
      i(C, y), n = b;
      var E = (/* @__PURE__ */ new Date()).getTime(), T = E - o;
      T > 0 && (r.x = C / T, r.y = y / T, o = E), e(C, y) && g.preventDefault();
    }
  }
  function m() {
    s.settings.swipeEasing && (clearInterval(a), a = setInterval(function() {
      if (s.isInitialized) {
        clearInterval(a);
        return;
      }
      if (!r.x && !r.y) {
        clearInterval(a);
        return;
      }
      if (Math.abs(r.x) < 0.01 && Math.abs(r.y) < 0.01) {
        clearInterval(a);
        return;
      }
      if (!s.element) {
        clearInterval(a);
        return;
      }
      i(r.x * 30, r.y * 30), r.x *= 0.8, r.y *= 0.8;
    }, 10));
  }
  $e.supportsTouch ? (s.event.bind(t, "touchstart", u), s.event.bind(t, "touchmove", _), s.event.bind(t, "touchend", m)) : $e.supportsIePointer && (window.PointerEvent ? (s.event.bind(t, "pointerdown", u), s.event.bind(t, "pointermove", _), s.event.bind(t, "pointerup", m)) : window.MSPointerEvent && (s.event.bind(t, "MSPointerDown", u), s.event.bind(t, "MSPointerMove", _), s.event.bind(t, "MSPointerUp", m)));
}
var cb = function() {
  return {
    handlers: ["click-rail", "drag-thumb", "keyboard", "wheel", "touch"],
    maxScrollbarLength: null,
    minScrollbarLength: null,
    scrollingThreshold: 1e3,
    scrollXMarginOffset: 0,
    scrollYMarginOffset: 0,
    suppressScrollX: !1,
    suppressScrollY: !1,
    swipeEasing: !0,
    useBothWheelAxes: !1,
    wheelPropagation: !0,
    wheelSpeed: 1
  };
}, hb = {
  "click-rail": nb,
  "drag-thumb": ob,
  keyboard: rb,
  wheel: ab,
  touch: lb
}, Bi = function(t, e) {
  var i = this;
  if (e === void 0 && (e = {}), typeof t == "string" && (t = document.querySelector(t)), !t || !t.nodeName)
    throw new Error("no element is specified to initialize PerfectScrollbar");
  this.element = t, t.classList.add(j.main), this.settings = cb();
  for (var n in e)
    this.settings[n] = e[n];
  this.containerWidth = null, this.containerHeight = null, this.contentWidth = null, this.contentHeight = null;
  var o = function() {
    return t.classList.add(j.state.focus);
  }, r = function() {
    return t.classList.remove(j.state.focus);
  };
  this.isRtl = $t(t).direction === "rtl", this.isRtl === !0 && t.classList.add(j.rtl), this.isNegativeScroll = function() {
    var p = t.scrollLeft, u = null;
    return t.scrollLeft = -1, u = t.scrollLeft < 0, t.scrollLeft = p, u;
  }(), this.negativeScrollAdjustment = this.isNegativeScroll ? t.scrollWidth - t.clientWidth : 0, this.event = new Je(), this.ownerDocument = t.ownerDocument || document, this.scrollbarXRail = fs(j.element.rail("x")), t.appendChild(this.scrollbarXRail), this.scrollbarX = fs(j.element.thumb("x")), this.scrollbarXRail.appendChild(this.scrollbarX), this.scrollbarX.setAttribute("tabindex", 0), this.event.bind(this.scrollbarX, "focus", o), this.event.bind(this.scrollbarX, "blur", r), this.scrollbarXActive = null, this.scrollbarXWidth = null, this.scrollbarXLeft = null;
  var a = $t(this.scrollbarXRail);
  this.scrollbarXBottom = parseInt(a.bottom, 10), isNaN(this.scrollbarXBottom) ? (this.isScrollbarXUsingBottom = !1, this.scrollbarXTop = V(a.top)) : this.isScrollbarXUsingBottom = !0, this.railBorderXWidth = V(a.borderLeftWidth) + V(a.borderRightWidth), ot(this.scrollbarXRail, { display: "block" }), this.railXMarginWidth = V(a.marginLeft) + V(a.marginRight), ot(this.scrollbarXRail, { display: "" }), this.railXWidth = null, this.railXRatio = null, this.scrollbarYRail = fs(j.element.rail("y")), t.appendChild(this.scrollbarYRail), this.scrollbarY = fs(j.element.thumb("y")), this.scrollbarYRail.appendChild(this.scrollbarY), this.scrollbarY.setAttribute("tabindex", 0), this.event.bind(this.scrollbarY, "focus", o), this.event.bind(this.scrollbarY, "blur", r), this.scrollbarYActive = null, this.scrollbarYHeight = null, this.scrollbarYTop = null;
  var l = $t(this.scrollbarYRail);
  this.scrollbarYRight = parseInt(l.right, 10), isNaN(this.scrollbarYRight) ? (this.isScrollbarYUsingRight = !1, this.scrollbarYLeft = V(l.left)) : this.isScrollbarYUsingRight = !0, this.scrollbarYOuterWidth = this.isRtl ? ib(this.scrollbarY) : null, this.railBorderYWidth = V(l.borderTopWidth) + V(l.borderBottomWidth), ot(this.scrollbarYRail, { display: "block" }), this.railYMarginHeight = V(l.marginTop) + V(l.marginBottom), ot(this.scrollbarYRail, { display: "" }), this.railYHeight = null, this.railYRatio = null, this.reach = {
    x: t.scrollLeft <= 0 ? "start" : t.scrollLeft >= this.contentWidth - this.containerWidth ? "end" : null,
    y: t.scrollTop <= 0 ? "start" : t.scrollTop >= this.contentHeight - this.containerHeight ? "end" : null
  }, this.isAlive = !0, this.settings.handlers.forEach(function(p) {
    return hb[p](i);
  }), this.lastScrollTop = Math.floor(t.scrollTop), this.lastScrollLeft = t.scrollLeft, this.event.bind(this.element, "scroll", function(p) {
    return i.onScroll(p);
  }), Bt(this);
};
Bi.prototype.update = function() {
  this.isAlive && (this.negativeScrollAdjustment = this.isNegativeScroll ? this.element.scrollWidth - this.element.clientWidth : 0, ot(this.scrollbarXRail, { display: "block" }), ot(this.scrollbarYRail, { display: "block" }), this.railXMarginWidth = V($t(this.scrollbarXRail).marginLeft) + V($t(this.scrollbarXRail).marginRight), this.railYMarginHeight = V($t(this.scrollbarYRail).marginTop) + V($t(this.scrollbarYRail).marginBottom), ot(this.scrollbarXRail, { display: "none" }), ot(this.scrollbarYRail, { display: "none" }), Bt(this), Bs(this, "top", 0, !1, !0), Bs(this, "left", 0, !1, !0), ot(this.scrollbarXRail, { display: "" }), ot(this.scrollbarYRail, { display: "" }));
};
Bi.prototype.onScroll = function(t) {
  this.isAlive && (Bt(this), Bs(this, "top", this.element.scrollTop - this.lastScrollTop), Bs(
    this,
    "left",
    this.element.scrollLeft - this.lastScrollLeft
  ), this.lastScrollTop = Math.floor(this.element.scrollTop), this.lastScrollLeft = this.element.scrollLeft);
};
Bi.prototype.destroy = function() {
  this.isAlive && (this.event.unbindAll(), Ne(this.scrollbarX), Ne(this.scrollbarY), Ne(this.scrollbarXRail), Ne(this.scrollbarYRail), this.removePsClasses(), this.element = null, this.scrollbarX = null, this.scrollbarY = null, this.scrollbarXRail = null, this.scrollbarYRail = null, this.isAlive = !1);
};
Bi.prototype.removePsClasses = function() {
  this.element.className = this.element.className.split(" ").filter(function(t) {
    return !t.match(/^ps([-_].+|)$/);
  }).join(" ");
};
const jn = "perfectScrollbar", db = "perfect-scrollbar", gs = "te.perfectScrollbar", kt = "te", Ot = "ps", Kn = [
  { te: `scrollX.${kt}.${Ot}`, ps: "ps-scroll-x" },
  { te: `scrollY.${kt}.${Ot}`, ps: "ps-scroll-y" },
  { te: `scrollUp.${kt}.${Ot}`, ps: "ps-scroll-up" },
  { te: `scrollDown.${kt}.${Ot}`, ps: "ps-scroll-down" },
  { te: `scrollLeft.${kt}.${Ot}`, ps: "ps-scroll-left" },
  { te: `scrollRight.${kt}.${Ot}`, ps: "ps-scroll-right" },
  { te: `scrollXEnd.${kt}.${Ot}`, ps: "ps-x-reach-end" },
  { te: `scrollYEnd.${kt}.${Ot}`, ps: "ps-y-reach-end" },
  { te: `scrollXStart.${kt}.${Ot}`, ps: "ps-x-reach-start" },
  { te: `scrollYStart.${kt}.${Ot}`, ps: "ps-y-reach-start" }
], ub = {
  handlers: ["click-rail", "drag-thumb", "keyboard", "wheel", "touch"],
  wheelSpeed: 1,
  wheelPropagation: !0,
  swipeEasing: !0,
  minScrollbarLength: null,
  maxScrollbarLength: null,
  scrollingThreshold: 1e3,
  useBothWheelAxes: !1,
  suppressScrollX: !1,
  suppressScrollY: !1,
  scrollXMarginOffset: 0,
  scrollYMarginOffset: 0,
  positionRight: !0
}, pb = {
  handlers: "(string|array)",
  wheelSpeed: "number",
  wheelPropagation: "boolean",
  swipeEasing: "boolean",
  minScrollbarLength: "(number|null)",
  maxScrollbarLength: "(number|null)",
  scrollingThreshold: "number",
  useBothWheelAxes: "boolean",
  suppressScrollX: "boolean",
  suppressScrollY: "boolean",
  scrollXMarginOffset: "number",
  scrollYMarginOffset: "number",
  positionRight: "boolean"
}, _b = {
  ps: "group/ps overflow-hidden [overflow-anchor:none] touch-none",
  railX: "group/x absolute bottom-0 h-[0.9375rem] hidden opacity-0 transition-[background-color,_opacity] duration-200 ease-linear motion-reduce:transition-none z-[1035] group-[&.ps--active-x]/ps:block group-hover/ps:opacity-60 group-focus/ps:opacity-60 group-[&.ps--scrolling-x]/ps:opacity-60 hover:!opacity-90 focus:!opacity-90 [&.ps--clicking]:!opacity-90 outline-none",
  railXColors: "group-[&.ps--active-x]/ps:bg-transparent hover:!bg-[#eee] focus:!bg-[#eee] [&.ps--clicking]:!bg-[#eee] dark:hover:!bg-[#555] dark:focus:!bg-[#555] dark:[&.ps--clicking]:!bg-[#555]",
  railXThumb: "absolute bottom-0.5 rounded-md h-1.5 group-focus/ps:opacity-100 group-active/ps:opacity-100 [transition:background-color_.2s_linear,_height_.2s_ease-in-out] group-hover/x:h-[11px] group-focus/x:h-[0.6875rem] group-[&.ps--clicking]/x:bg-[#999] group-[&.ps--clicking]/x:h-[11px] outline-none",
  railXThumbColors: "bg-[#aaa] group-hover/x:bg-[#999] group-focus/x:bg-[#999]",
  railY: "group/y absolute right-0 w-[0.9375rem] hidden opacity-0 transition-[background-color,_opacity] duration-200 ease-linear motion-reduce:transition-none z-[1035] group-[&.ps--active-y]/ps:block group-hover/ps:opacity-60 group-focus/ps:opacity-60 group-[&.ps--scrolling-y]/ps:opacity-60 hover:!opacity-90 focus:!opacity-90 [&.ps--clicking]:!opacity-90 outline-none",
  railYColors: "group-[&.ps--active-y]/ps:bg-transparent hover:!bg-[#eee] focus:!bg-[#eee] [&.ps--clicking]:!bg-[#eee] dark:hover:!bg-[#555] dark:focus:!bg-[#555] dark:[&.ps--clicking]:!bg-[#555]",
  railYThumb: "absolute right-0.5 rounded-md w-1.5 group-focus/ps:opacity-100 group-active/ps:opacity-100 [transition:background-color_.2s_linear,_width_.2s_ease-in-out,_opacity] group-hover/y:w-[11px] group-focus/y:w-[0.6875rem] group-[&.ps--clicking]/y:w-[11px] outline-none",
  railYThumbColors: "bg-[#aaa] group-hover/y:bg-[#999] group-focus/y:bg-[#999] group-[&.ps--clicking]/y:bg-[#999]"
}, fb = {
  ps: "string",
  railX: "string",
  railXColors: "string",
  railXThumb: "string",
  railXThumbColors: "string",
  railY: "string",
  railYColors: "string",
  railYThumb: "string",
  railYThumbColors: "string"
};
class Lo {
  constructor(t, e = {}, i = {}) {
    this._element = t, this._options = this._getConfig(e), this._classes = this._getClasses(i), this.perfectScrollbar = null, this._observer = null, this._psClasses = [
      {
        ps: "ps__rail-x",
        te: this._classes.railX,
        teColor: this._classes.railXColors
      },
      {
        ps: "ps__rail-y",
        te: this._classes.railY,
        teColor: this._classes.railYColors
      },
      {
        ps: "ps__thumb-x",
        te: this._classes.railXThumb,
        teColor: this._classes.railXThumbColors
      },
      {
        ps: "ps__thumb-y",
        te: this._classes.railYThumb,
        teColor: this._classes.railYThumbColors
      }
    ], this._element && (I.setData(t, gs, this), c.addClass(this._element, db)), this.init();
  }
  // Getters
  static get NAME() {
    return jn;
  }
  get railX() {
    return d.findOne(".ps__rail-x", this._element);
  }
  get railY() {
    return d.findOne(".ps__rail-y", this._element);
  }
  _getConfig(t) {
    const e = c.getDataAttributes(this._element);
    return e.handlers !== void 0 && (e.handlers = e.handlers.split(" ")), t = {
      ...ub,
      ...e,
      ...t
    }, L(jn, t, pb), t;
  }
  _getClasses(t) {
    const e = c.getDataClassAttributes(this._element);
    return t = {
      ..._b,
      ...e,
      ...t
    }, L(jn, t, fb), t;
  }
  // Public
  dispose() {
    this._options.positionRight && this._observer.disconnect(), I.removeData(this._element, gs), this._element = null, this._dataAttrOptions = null, this._options = null, this.perfectScrollbar.destroy(), this.removeEvent(Kn), this.perfectScrollbar = null;
  }
  init() {
    if (this.perfectScrollbar = new Bi(this._element, this._options), this._addPerfectScrollbarStyles(), this._updateScrollPosition(), this.perfectScrollbar.update(), this._initEvents(Kn), this._options.positionRight) {
      this._observer = new ResizeObserver(() => {
        setTimeout(() => {
          this._updateScrollPosition();
        }, 100);
      });
      const t = {
        attributes: !0,
        attributeFilter: ["class", "className"]
      };
      this._observer.observe(this._element, t);
    }
  }
  _updateScrollPosition() {
    const t = getComputedStyle(this._element).getPropertyValue("height"), e = getComputedStyle(this._element).getPropertyValue("width");
    this.railX && (this.railX.style.transform = `translateY(calc(-100% + ${this._canTransform(t) ? t : "0px"}))`), this.railY && (this.railY.style.transform = `translateX(calc(-100% + ${this._canTransform(e) ? e : "0px"}))`);
  }
  _canTransform(t) {
    return t && t.includes("px");
  }
  update() {
    return this.perfectScrollbar.update();
  }
  _initEvents(t = []) {
    t.forEach(
      ({ ps: e, te: i }) => h.on(
        this._element,
        e,
        (n) => h.trigger(this._element, i, { e: n })
      )
    );
  }
  _addPerfectScrollbarStyles() {
    this._psClasses.forEach((t) => {
      const e = d.findOne(`.${t.ps}`, this._element);
      c.addClass(e, t.te), c.addClass(e, t.teColor);
    }), c.addClass(this._element, this._classes.ps), c.removeClass(this._element, "ps");
  }
  removeEvent(t) {
    let e = [];
    typeof t == "string" && (e = Kn.filter(({ te: i }) => i === t)), e.forEach(({ ps: i, te: n }) => {
      h.off(this._element, i), h.off(this._element, n);
    });
  }
  // Static
  static jQueryInterface(t) {
    return this.each(function() {
      let e = I.getData(this, gs);
      const i = typeof t == "object" && t;
      if (!(!e && /dispose|hide/.test(t)) && (e || (e = new Lo(this, i)), typeof t == "string")) {
        if (typeof e[t] > "u")
          throw new TypeError(`No method named "${t}"`);
        e[t]();
      }
    });
  }
  static getInstance(t) {
    return I.getData(t, gs);
  }
  static getOrCreateInstance(t, e = {}) {
    return this.getInstance(t) || new this(t, typeof e == "object" ? e : null);
  }
}
const yc = Lo, mb = "data-te-datatable-select-ref", gb = "data-te-datatable-pagination-nav-ref", bb = "data-te-datatable-pagination-right-ref", vb = "data-te-datatable-pagination-left-ref", Tb = "data-te-datatable-pagination-start-ref", Eb = "data-te-datatable-pagination-end-ref", Cb = ({
  text: s,
  entries: t,
  entriesOptions: e,
  fullPagination: i,
  rowsText: n,
  allText: o,
  paginationStartIconTemplate: r,
  paginationLeftIconTemplate: a,
  paginationRightIconTemplate: l,
  paginationEndIconTemplate: p,
  classes: u
}, f, _) => {
  const m = e.map((g) => g === "All" ? `<option value="${g}" ${g === t ? "selected" : ""}>${o}</option>` : `<option value="${g}" ${g === t ? "selected" : ""}>${g}</option>`).join(`
`);
  return `
<div class="${u.pagination} ${_ ? `${u.paginationBordered}` : ""} ${u.borderColor} ${u.color}">
  <div class="${u.selectItemsWrapper}">  
    <p class="${u.paginationRowsText} ${f ? `${u.loadingPaginationRowsText}` : ""}">${n}</p>
    <div class="${u.selectWrapper} ${f ? `${u.loadingPaginationSelectWrapper}` : ""}">
      <select name="entries"
        ${f ? "disabled" : ""} class="select" ${mb}>
        ${m}
      </select>
    </div>
  </div>
  <div class="${u.paginationNav} ${f ? `${u.loadingPaginationNav}` : ""}" ${gb}>
  ${s}
  </div>
  <div class="${u.paginationButtonsWrapper}">
    ${i ? `<button data-te-ripple-init data-te-ripple-color="dark" class="${u.paginationStartButton}" ${Tb}>
           ${r}
          </button>` : ""}
    <button data-te-ripple-init data-te-ripple-color="dark" class="${u.paginationLeftButton}" ${vb}>
      ${a}
  </button>
    <button data-te-ripple-init data-te-ripple-color="dark" class="${u.paginationRightButton}" ${bb}>
      ${l}
  </button>
    ${i ? `<button data-te-ripple-init data-te-ripple-color="dark" class="${u.paginationEndButton}" ${Eb}>
           ${p}
          </button>` : ""}
  </div>
</div>
`;
}, Ab = "data-te-datatable-sort-icon-ref", yb = "data-te-datatable-header-checkbox-ref", wb = (s, t, e, i, n, o, r, a) => {
  const l = e ? `
  <th scope="col">
    <div class="${a.checkboxHeaderWrapper}">
      <input
        class="${a.checkboxHeader}"
        type="checkbox"
        value=""
        ${yb}
        />
    </div>
  </th>
  ` : '<th scope="col"></th>', p = s.map((u, f) => {
    const _ = u.fixed ? s.filter((m, g) => m.fixed === u.fixed && g < f).reduce((m, g) => m + g.width, 0) : null;
    return `<th class="${a.column} ${i ? `${a.tableBordered}` : ""} ${a.borderColor} ${n ? `${a.sm}` : ""} ${u.fixed ? `${a.fixedHeader} ${a.color}` : ""} ${o ? `${a.loadingColumn}` : ""}" style="${u.fixed ? `${u.fixed === "right" ? "right" : "left"}: ${_}px;` : ""}" scope="col">${u.sort ? `<div class="${a.sortIconWrapper}"><span class="${a.sortIcon} ${o ? "invisible" : ""}" data-te-sort="${u.field}" ${Ab}>${r}</span>` : ""} <span class="${u.sort ? "" : "pl-[18px]"}">${u.label}</span></div></th>`;
  });
  return [t ? l : "", ...p].join(`
`);
}, xb = "data-te-datatable-row-ref", kb = "data-te-datatable-row-checkbox-ref", Ob = "data-te-datatable-cell-ref", Sb = ({
  rows: s,
  columns: t,
  noFoundMessage: e,
  edit: i,
  selectable: n,
  loading: o,
  bordered: r,
  borderless: a,
  striped: l,
  hover: p,
  sm: u,
  classes: f
}) => {
  const _ = s.map((m) => {
    const g = `
      <td data-te-field="checkbox" class="${r ? `${f.tableBordered} ${f.borderColor}` : ""}">
        <div class="${f.checkboxRowWrapper}">
          <input
            class="${f.checkboxRow}"
            type="checkbox"
            value=""
            data-te-row-index="${m.rowIndex}"  ${kb}/>
        </div>
      </td>`, v = t.map((b, C) => {
      const y = {};
      if (b.width && (y["min-width"] = `${b.width - 1}px`, y["max-width"] = `${b.width}px`, y.width = `${b.width}px`), b.fixed) {
        const T = t.filter((A, w) => A.fixed === b.fixed && w < C).reduce((A, w) => A + w.width, 0);
        y[b.fixed === "right" ? "right" : "left"] = `${T}px`;
      }
      return `<td style="${Object.keys(y).map((T) => `${T}: ${y[T]}`).join("; ")}" class="${f.rowItem} ${f.borderColor} ${i ? `${f.edit}` : ""} ${r ? `${f.tableBordered}` : ""} ${u ? `${f.sm}` : ""} ${b.fixed ? `${f.fixedHeader} ${f.color}` : ""}" ${Ob} data-te-field="${b.field}" ${i && 'contenteditable="true"'}>${m[b.field]}</td>`;
    }).join("");
    return `<tr scope="row" class="${f.row} ${f.borderColor} ${f.rowAnimation} ${l ? `${f.striped}` : ""} ${a ? `${f.borderless}` : ""} ${p ? `${f.hoverRow}` : ""}" data-te-index="${m.rowIndex}" ${xb}>${n ? g : ""}${v}</tr>`;
  });
  return s.length > 0 || o ? _.join(`
`) : `<tr class="${f.noFoundMessageWrapper} ${f.borderColor}"><td class="${f.noFoundMessage}">${e}</td></tr>`;
}, Ib = "data-te-datatable-inner-ref", Db = "data-te-datatable-header-ref", Va = ({
  columns: s,
  rows: t,
  noFoundMessage: e,
  edit: i,
  multi: n,
  selectable: o,
  loading: r,
  loadingMessage: a,
  pagination: l,
  bordered: p,
  borderless: u,
  striped: f,
  hover: _,
  fixedHeader: m,
  sm: g,
  sortIconTemplate: v,
  classes: b
}) => {
  const C = Sb({
    rows: t,
    columns: s,
    noFoundMessage: e,
    edit: i,
    loading: r,
    selectable: o,
    bordered: p,
    borderless: u,
    striped: f,
    hover: _,
    sm: g,
    classes: b
  }), y = wb(
    s,
    o,
    n,
    p,
    g,
    r,
    v,
    b
  );
  return { table: `
<div class="${b.color}" ${Ib}>
  <table class="${b.table}">
    <thead class="${b.tableHeader} ${p ? `${b.tableBordered}` : ""} ${u ? `${b.borderless}` : ""} ${b.borderColor}" ${Db}>
      <tr>
        ${y}
      </tr>
    </thead>
    <tbody class="${m ? `${b.fixedHeaderBody}` : ""}">
      ${r ? "" : C}
    </tbody>
  </table>
</div>
${r ? `
  <div class="${b.loadingItemsWrapper}">
    <div class="${b.loadingProgressBarWrapper}">
      <div class="${b.loadingProgressBar}"></div>
    </div>
  </div>
<p class="${b.loadingMessage}">${a}</p>
` : ""}
${l.enable ? Cb(l, r, p) : ""}
  `, rows: C, column: y };
}, $b = ({ rows: s, field: t, order: e }) => s.sort((n, o) => {
  let r = n[t], a = o[t];
  return typeof r == "string" && (r = r.toLowerCase()), typeof a == "string" && (a = a.toLowerCase()), r < a ? e === "desc" ? 1 : -1 : r > a ? e === "desc" ? -1 : 1 : 0;
}), Lb = (s, t, e) => {
  if (!t)
    return s;
  const i = (n) => {
    const o = document.createElement("div");
    return o.innerHTML = n, n = o.textContent || o.innerText || "", n.toString().toLowerCase().match(t.toLowerCase());
  };
  return s.filter((n) => {
    if (e && typeof e == "string")
      return i(n[e]);
    let o = Object.values(n);
    return e && Array.isArray(e) && (o = Object.keys(n).filter((r) => e.includes(r)).map((r) => n[r])), o.filter((r) => i(r)).length > 0;
  });
}, Fa = ({ rows: s, entries: t, activePage: e }) => {
  const i = e * t;
  return s.slice(i, i + Number(t));
}, xi = "datatable", _t = `data-te-${xi}`, gi = `te.${xi}`, zs = `.${gi}`, Mb = `[${_t}-inner-ref]`, zn = `[${_t}-cell-ref]`, Nb = `[${_t}-header-ref]`, Rb = `[${_t}-header-checkbox-ref]`, Pb = `[${_t}-pagination-right-ref]`, Bb = `[${_t}-pagination-left-ref]`, Hb = `[${_t}-pagination-start-ref]`, Wb = `[${_t}-pagination-end-ref]`, Vb = `[${_t}-pagination-nav-ref]`, Fb = `[${_t}-select-ref]`, Un = `[${_t}-sort-icon-ref]`, di = `[${_t}-row-ref]`, Xn = `[${_t}-row-checkbox-ref]`, Yb = `selectRows${zs}`, Ya = `render${zs}`, jb = `rowClick${zs}`, Kb = `update${zs}`, zb = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
</svg>`, Ub = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
</svg>`, Xb = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
</svg>`, Gb = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
</svg>`, qb = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"/>
</svg>`, Zb = "border-neutral-200 dark:border-neutral-500", Qb = "border-none", Jb = "relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] dark:border-neutral-400", tv = "mb-[0.125rem] min-h-[1.5rem] pl-[1.5rem] ml-3 flex items-center", ev = "relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] dark:border-neutral-400", iv = "mb-[0.125rem] min-h-[1.5rem] pl-[1.5rem] ml-3 flex items-center", sv = "bg-white dark:bg-neutral-800", nv = "py-4 pl-1 text-clip overflow-hidden text-[#212529] dark:text-white", ov = "focus:outline-none", rv = "sticky top-0 z-30", av = "sticky z-10 bg-inherit", lv = "hover:bg-neutral-100 dark:hover:bg-neutral-700", cv = "pointer-events-none cursor-none text-neutral-400 dark:text-neutral-300", hv = "h-[2px] relative w-full overflow-hidden", dv = "text-center text-neutral-500 font-ligh text-sm my-4 dark:text-neutral-400", uv = "text-neutral-500 dark:text-neutral-300", pv = "text-neutral-500 dark:text-neutral-300", _v = "pointer-events-none cursor-none", fv = "h-full w-[45%] bg-primary-400 dark:bg-primary-600", mv = "h-full animate-[progress_3s_ease-in-out_infinite]", gv = "pl-2 py-3 font-light text-sm dark:text-neutral-300", bv = "border-b", vv = "flex md:flex-row justify-end items-center py-2 space-x-4 text-sm flex-col leading-[1.6]", Tv = "border border-t-0", Ev = "order-1 my-3 md:order-none md:my-0 md:pr-1", Cv = "inline-block rounded p-2.5 text-xs font-medium uppercase leading-normal transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700 disabled:text-slate-300 disabled:hover:bg-transparent dark:hover:bg-neutral-500 dark:disabled:hover:bg-transparent dark:disabled:text-neutral-600", Av = "inline-block rounded p-2.5 font-medium uppercase leading-normal transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700 disabled:text-slate-300 disabled:hover:bg-transparent dark:hover:bg-neutral-500 dark:disabled:hover:bg-transparent dark:disabled:text-neutral-600", yv = "font-normal order-2 mb-3 md:order-none md:mb-0", wv = "inline-block rounded p-2.5 font-medium uppercase leading-normal transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700 disabled:text-slate-300 disabled:hover:bg-transparent dark:hover:bg-neutral-500 dark:disabled:hover:bg-transparent dark:disabled:text-neutral-600", xv = "font-light", kv = "inline-block rounded p-2.5 font-medium uppercase leading-normal transition duration-150 ease-in-out hover:bg-neutral-100 hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700 disabled:text-slate-300 disabled:hover:bg-transparent dark:hover:bg-neutral-500 dark:disabled:hover:bg-transparent dark:disabled:text-neutral-600", Ov = "border-b", Sv = "transition ease-in-out duration-300 motion-reduce:transition-none", Iv = "whitespace-nowrap text-clip overflow-hidden px-[1.4rem] py-4", Dv = "relative", $v = "!bg-neutral-100 dark:!bg-neutral-600", Lv = "flex items-center space-x-4 order-3 md:order-none", Mv = "w-[70px]", Nv = "!py-2", Rv = "w-[15px] h-[10px] origin-bottom font-black mr-1 opacity-0 text-neutral-500 group-hover:opacity-100 transition hover:ease-in-out transform ease-linear duration-300 motion-reduce:transition-none dark:text-neutral-400", Pv = "flex flex-row group", Bv = "[&:nth-child(odd)]:bg-neutral-50 [&:nth-child(odd)]:dark:bg-neutral-700", Hv = "border", Wv = "border-b font-normal px-[1.4rem]", Vv = "text-left text-sm font-light w-full leading-[1.6]", Fv = {
  bordered: "boolean",
  borderless: "boolean",
  clickableRows: "boolean",
  defaultValue: "string",
  edit: "boolean",
  entries: "(number|string)",
  entriesOptions: "array",
  fullPagination: "boolean",
  hover: "boolean",
  loading: "boolean",
  loadingMessage: "string",
  maxWidth: "(null|number|string)",
  maxHeight: "(null|number|string)",
  multi: "boolean",
  noFoundMessage: "string",
  pagination: "boolean",
  selectable: "boolean",
  sm: "boolean",
  sortField: "(null|string)",
  sortOrder: "string",
  fixedHeader: "boolean",
  striped: "boolean",
  rowsText: "string",
  ofText: "string",
  allText: "string",
  forceSort: "boolean",
  sortIconTemplate: "string",
  paginationStartIconTemplate: "string",
  paginationEndIconTemplate: "string",
  paginationLeftIconTemplate: "string",
  paginationRightIconTemplate: "string"
}, Yv = {
  bordered: !1,
  borderless: !1,
  clickableRows: !1,
  defaultValue: "-",
  edit: !1,
  entries: 10,
  entriesOptions: [10, 25, 50, 200],
  fixedHeader: !1,
  fullPagination: !1,
  hover: !1,
  loading: !1,
  loadingMessage: "Loading results...",
  maxWidth: null,
  maxHeight: null,
  multi: !1,
  noFoundMessage: "No matching results found",
  pagination: !0,
  selectable: !1,
  sm: !1,
  sortField: null,
  sortOrder: "asc",
  striped: !1,
  rowsText: "Rows per page:",
  ofText: "of",
  allText: "All",
  forceSort: !1,
  sortIconTemplate: zb,
  paginationStartIconTemplate: Ub,
  paginationEndIconTemplate: qb,
  paginationLeftIconTemplate: Xb,
  paginationRightIconTemplate: Gb
}, jv = {
  label: "string",
  field: "string",
  fixed: "(boolean|string)",
  format: "(function|null)",
  width: "(number|null)",
  sort: "boolean",
  columnIndex: "number"
}, Kv = {
  label: "",
  field: "",
  fixed: !1,
  format: null,
  width: null,
  sort: !0,
  columnIndex: 0
}, zv = {
  table: Vv,
  tableHeader: Wv,
  column: nv,
  pagination: vv,
  selectWrapper: Mv,
  scroll: Dv,
  tableBordered: Hv,
  paginationBordered: Tv,
  borderless: Qb,
  checkboxRowWrapper: iv,
  checkboxRow: ev,
  checkboxHeaderWrapper: tv,
  checkboxHeader: Jb,
  row: Ov,
  rowItem: Iv,
  striped: Bv,
  sortIconWrapper: Pv,
  sortIcon: Rv,
  paginationRowsText: xv,
  paginationNav: yv,
  paginationButtonsWrapper: Ev,
  hoverRow: lv,
  borderColor: Zb,
  color: sv,
  fixedHeader: rv,
  fixedHeaderBody: av,
  selectableRow: $v,
  rowAnimation: Sv,
  sm: Nv,
  edit: ov,
  selectItemsWrapper: Lv,
  paginationStartButton: kv,
  paginationLeftButton: Av,
  paginationRightButton: wv,
  paginationEndButton: Cv,
  loadingItemsWrapper: hv,
  loadingProgressBarWrapper: mv,
  loadingProgressBar: fv,
  loadingMessage: dv,
  loadingPaginationRowsText: pv,
  loadingPaginationSelectWrapper: _v,
  loadingPaginationNav: uv,
  loadingColumn: cv,
  noFoundMessageWrapper: bv,
  noFoundMessage: gv
}, Uv = {
  table: "string",
  tableHeader: "string",
  column: "string",
  pagination: "string",
  selectWrapper: "string",
  scroll: "string",
  tableBordered: "string",
  paginationBordered: "string",
  borderless: "string",
  checkboxRowWrapper: "string",
  checkboxRow: "string",
  checkboxHeaderWrapper: "string",
  checkboxHeader: "string",
  row: "string",
  rowItem: "string",
  striped: "string",
  sortIconWrapper: "string",
  sortIcon: "string",
  paginationRowsText: "string",
  paginationNav: "string",
  paginationButtonsWrapper: "string",
  hoverRow: "string",
  borderColor: "string",
  color: "string",
  fixedHeader: "string",
  fixedHeaderBody: "string",
  selectableRow: "string",
  rowAnimation: "string",
  sm: "string",
  edit: "string",
  selectItemsWrapper: "string",
  paginationStartButton: "string",
  paginationLeftButton: "string",
  paginationRightButton: "string",
  paginationEndButton: "string",
  loadingItemsWrapper: "string",
  loadingProgressBarWrapper: "string",
  loadingProgressBar: "string",
  loadingMessage: "string",
  loadingPaginationRowsText: "string",
  loadingPaginationSelectWrapper: "string",
  loadingPaginationNav: "string",
  loadingColumn: "string",
  noFoundMessageWrapper: "string",
  noFoundMessage: "string"
};
class wc {
  constructor(t, e = {}, i = {}, n = {}) {
    this._element = t, this._options = this._getOptions(i), this._classes = this._getClasses(n), this._sortReverse = !1, this._activePage = 0, this._search = "", this._searchColumn = null, this._paginationLeft = null, this._paginationRight = null, this._paginationStart = null, this._paginationEnd = null, this._select = null, this._selectInstance = null, this._selected = [], this._checkboxes = null, this._headerCheckbox = null, this._rows = this._getRows(e.rows), this._columns = this._getColumns(e.columns), this._element && (I.setData(t, gi, this), this._perfectScrollbar = null, this._setup());
  }
  // Getters
  static get NAME() {
    return xi;
  }
  get columns() {
    return this._columns.map((t, e) => {
      let i = {
        ...Kv,
        field: `field_${e}`,
        columnIndex: e
      };
      return typeof t == "string" ? i.label = t : typeof t == "object" && (i = {
        ...i,
        ...t
      }), L("column", i, jv), i;
    });
  }
  get rows() {
    return this._rows.map((t, e) => {
      const i = {
        rowIndex: e
      };
      return Array.isArray(t) ? this.columns.forEach((n, o) => {
        t[o] === 0 ? i[n.field] = t[o] : i[n.field] = t[o] || this._options.defaultValue;
      }) : typeof t == "object" && this.columns.forEach((n) => {
        t[n.field] === 0 ? i[n.field] = t[n.field] : i[n.field] = t[n.field] || this._options.defaultValue;
      }), i;
    });
  }
  get searchResult() {
    return Lb(this.rows, this._search, this._searchColumn);
  }
  get computedRows() {
    let t = [...this.searchResult];
    return this._options.sortOrder && (t = $b({
      rows: t,
      field: this._options.sortField,
      order: this._options.sortOrder
    })), this._options.pagination && (this._options.entries === "All" ? t = Fa({
      rows: t,
      entries: t.length,
      activePage: this._activePage
    }) : t = Fa({
      rows: t,
      entries: this._options.entries,
      activePage: this._activePage
    })), t;
  }
  get pages() {
    return this._options.entries === "All" ? 1 : Math.ceil(this.searchResult.length / this._options.entries);
  }
  get navigationText() {
    const t = this._activePage * this._options.entries;
    return this.searchResult.length === 0 ? `0 ${this._options.ofText} 0` : this._options.entries === "All" ? `1 - ${this.searchResult.length} ${this._options.ofText} ${this.searchResult.length}` : `${t + 1} - ${this.computedRows.length + t} ${this._options.ofText} ${this.searchResult.length}`;
  }
  get tableOptions() {
    return {
      classes: this._classes,
      columns: this.columns,
      rows: this.computedRows,
      noFoundMessage: this._options.noFoundMessage,
      edit: this._options.edit,
      loading: this._options.loading,
      loaderClass: this._options.loaderClass,
      loadingMessage: this._options.loadingMessage,
      selectable: this._options.selectable,
      multi: this._options.multi,
      bordered: this._options.bordered,
      borderless: this._options.borderless,
      striped: this._options.striped,
      hover: this._options.hover,
      fixedHeader: this._options.fixedHeader,
      sm: this._options.sm,
      sortIconTemplate: this._options.sortIconTemplate,
      pagination: {
        enable: this._options.pagination,
        text: this.navigationText,
        entries: this._options.entries,
        entriesOptions: this._options.entriesOptions,
        fullPagination: this._options.fullPagination,
        rowsText: this._options.rowsText,
        ofText: this._options.ofText,
        allText: this._options.allText,
        paginationStartIconTemplate: this._options.paginationStartIconTemplate,
        paginationLeftIconTemplate: this._options.paginationLeftIconTemplate,
        paginationRightIconTemplate: this._options.paginationRightIconTemplate,
        paginationEndIconTemplate: this._options.paginationEndIconTemplate,
        classes: this._classes
      },
      forceSort: this._options.forceSort
    };
  }
  // Public
  update(t, e = {}) {
    t && t.rows && (this._rows = t.rows), t && t.columns && (this._columns = t.columns), this._clearClassList(e), this._options = this._getOptions({ ...this._options, ...e }), this._setup(), this._performSort();
  }
  dispose() {
    this._selectInstance && this._selectInstance.dispose(), I.removeData(this._element, gi), this._removeEventListeners(), this._perfectScrollbar.destroy(), this._element = null;
  }
  search(t, e) {
    this._search = t, this._searchColumn = e, this._activePage = 0, this._options.pagination && this._toggleDisableState(), this._renderRows(), this._options.maxHeight && (this._perfectScrollbar.element.scrollTop = 0, this._perfectScrollbar.update());
  }
  sort(t, e = "asc") {
    this._options.sortOrder = e, typeof t == "string" ? this._options.sortField = this.columns.find(
      (n) => n.label === t
    ).field : this._options.sortField = t.field;
    const i = d.findOne(
      `[data-te-sort="${this._options.sortField}"]`,
      this._element
    );
    this._activePage = 0, this._toggleDisableState(), this._renderRows(), this._setActiveSortIcon(i);
  }
  setActivePage(t) {
    t < this.pages && this._changeActivePage(t);
  }
  // Private
  _getClasses(t) {
    const e = c.getDataClassAttributes(this._element);
    return t = {
      ...zv,
      ...e,
      ...t
    }, L(xi, t, Uv), t;
  }
  _changeActivePage(t) {
    this._activePage = t, this._toggleDisableState(), this._renderRows();
  }
  _clearClassList(t) {
    ["hover", "bordered", "borderless", "sm", "striped"].forEach((e) => {
      this._options[e] && !t[e] && c.removeDataAttribute(`data-te-${e}`);
    });
  }
  _emitSelectEvent() {
    h.trigger(this._element, Yb, {
      selectedRows: this.rows.filter(
        (t) => this._selected.indexOf(t.rowIndex) !== -1
      ),
      selectedIndexes: this._selected,
      allSelected: this._selected.length === this.rows.length
    });
  }
  _getRows(t = []) {
    const e = d.findOne("tbody", this._element);
    return e ? [...d.find("tr", e).map((n) => d.find("td", n).map((o) => o.innerHTML)), ...t] : t;
  }
  _getColumns(t = []) {
    const e = d.findOne("thead", this._element);
    if (!e)
      return t;
    const i = d.findOne("tr", e);
    return [...d.find("th", i).map((o) => ({
      label: o.innerHTML,
      ...c.getDataAttributes(o)
    })), ...t];
  }
  _getCSSValue(t) {
    return typeof t == "string" ? t : `${t}px`;
  }
  _getOptions(t) {
    const e = {
      ...Yv,
      ...c.getDataAttributes(this._element),
      ...t
    };
    return L(xi, e, Fv), e;
  }
  _setActiveRows() {
    d.find(di, this._element).forEach((t) => {
      this._selected.includes(c.getDataAttribute(t, "index")) ? c.addClass(t, `active ${this._classes.selectableRow}`) : c.removeClass(t, `active ${this._classes.selectableRow}`);
    });
  }
  _setEntries(t) {
    this._options = this._getOptions({
      ...this._options,
      entries: t.target.value
    }), this._activePage > this.pages - 1 && (this._activePage = this.pages - 1), this._toggleDisableState(), this._renderRows();
  }
  _setSelected() {
    d.find(Xn, this._element).forEach(
      (t) => {
        const e = c.getDataAttribute(t, "rowIndex");
        t.checked = this._selected.includes(e);
      }
    ), this._setActiveRows();
  }
  _setActiveSortIcon(t) {
    d.find(Un, this._element).forEach((e) => {
      const i = this._options.sortOrder === "desc" && e === t ? 180 : 0;
      c.style(e, {
        transform: `rotate(${i}deg)`
      }), e === t && this._options.sortOrder ? c.addClass(e, "opacity-100") : c.removeClass(e, "opacity-100");
    });
  }
  _setup() {
    this._renderTable(), this._options.pagination && this._setupPagination(), this._options.edit && this._setupEditable(), this._options.clickableRows && this._setupClickableRows(), this._options.selectable && this._setupSelectable(), this._setupScroll(), this._setupSort();
  }
  _setupClickableRows() {
    d.find(di, this._element).forEach((t) => {
      const e = c.getDataAttribute(t, "index");
      c.addClass(t, "cursor-pointer"), h.on(t, "click", (i) => {
        d.matches(i.target, Xn) || h.trigger(this._element, jb, {
          index: e,
          row: this.rows[e]
        });
      });
    });
  }
  _setupEditable() {
    d.find(di, this._element).forEach((t) => {
      const e = c.getDataAttribute(t, "index");
      d.find(zn, t).forEach((i) => {
        h.on(i, "input", (n) => this._updateRow(n, e));
      });
    });
  }
  _setupScroll() {
    const t = d.findOne(Mb, this._element), e = {};
    if (this._options.maxHeight && (e.maxHeight = this._getCSSValue(this._options.maxHeight)), this._options.maxWidth) {
      const i = this._getCSSValue(this._options.maxWidth);
      e.maxWidth = i, c.style(this._element, { maxWidth: i });
    }
    if (c.style(t, e), c.addClass(t, `${this._classes.scroll}`), this._options.fixedHeader) {
      let i = d.find(Nb, this._element);
      this._options.selectable && (i = i.filter((n, o) => (c.addClass(
        n,
        `${this._classes.fixedHeader} ${this._classes.color}`
      ), o !== 0))), i.forEach((n, o) => {
        c.addClass(
          n,
          `${this._classes.fixedHeader} ${this._classes.color}`
        ), this.columns[o].fixed && c.addClass(n, "!z-40");
      });
    }
    this._perfectScrollbar = new yc(t);
  }
  _setupSort() {
    d.find(Un, this._element).forEach((t) => {
      const e = c.getDataAttribute(t, "sort"), [i] = d.parents(t, "th");
      if (this.columns.sort)
        c.addClass(i, "cursor-pointer");
      else
        return;
      e === this._options.sortField && this._setActiveSortIcon(t), h.on(i, "click", () => {
        this._options.sortField === e && this._options.sortOrder === "asc" ? this._options.sortOrder = "desc" : this._options.sortField === e && this._options.sortOrder === "desc" ? this._options.sortOrder = this._options.forceSort ? "asc" : null : this._options.sortOrder = "asc", this._options.sortField = e, this._activePage = 0, this._performSort(), this._setActiveSortIcon(t);
      });
    });
  }
  _performSort() {
    this._toggleDisableState(), this._renderRows();
  }
  _setupSelectable() {
    this._checkboxes = d.find(Xn, this._element), this._headerCheckbox = d.findOne(
      Rb,
      this._element
    ), h.on(
      this._headerCheckbox,
      "input",
      (t) => this._toggleSelectAll(t)
    ), this._checkboxes.forEach((t) => {
      const e = c.getDataAttribute(t, "rowIndex");
      h.on(
        t,
        "input",
        (i) => this._toggleSelectRow(i, e)
      );
    });
  }
  _setupPagination() {
    this._paginationRight = d.findOne(
      Pb,
      this._element
    ), this._paginationLeft = d.findOne(
      Bb,
      this._element
    ), h.on(
      this._paginationRight,
      "click",
      () => this._changeActivePage(this._activePage + 1)
    ), h.on(
      this._paginationLeft,
      "click",
      () => this._changeActivePage(this._activePage - 1)
    ), this._options.fullPagination && (this._paginationStart = d.findOne(
      Hb,
      this._element
    ), this._paginationEnd = d.findOne(
      Wb,
      this._element
    ), h.on(
      this._paginationStart,
      "click",
      () => this._changeActivePage(0)
    ), h.on(
      this._paginationEnd,
      "click",
      () => this._changeActivePage(this.pages - 1)
    )), this._toggleDisableState(), this._setupPaginationSelect();
  }
  _setupPaginationSelect() {
    this._select = d.findOne(Fb, this._element), this._selectInstance = new $o(this._select), h.on(
      this._select,
      "valueChange.te.select",
      (t) => this._setEntries(t)
    );
  }
  _removeEventListeners() {
    this._options.pagination && (h.off(this._paginationRight, "click"), h.off(this._paginationLeft, "click"), h.off(this._select, "valueChange.te.select"), this._options.fullPagination && (h.off(this._paginationStart, "click"), h.off(this._paginationEnd, "click"))), this._options.edit && d.find(zn, this._element).forEach((t) => {
      h.off(t, "input");
    }), this._options.clickableRows && d.find(di, this._element).forEach((t) => {
      h.off(t, "click");
    }), d.find(Un, this._element).forEach((t) => {
      const [e] = d.parents(t, "th");
      h.off(e, "click");
    }), this._options.selectable && (h.off(this._headerCheckbox, "input"), this._checkboxes.forEach((t) => {
      h.off(t, "input");
    }));
  }
  _renderTable() {
    this._element.innerHTML = Va(this.tableOptions).table, this._formatCells(), h.trigger(this._element, Ya);
  }
  _renderRows() {
    const t = d.findOne("tbody", this._element);
    if (this._options.pagination) {
      const e = d.findOne(
        Vb,
        this._element
      );
      e.innerText = this.navigationText;
    }
    t.innerHTML = Va(this.tableOptions).rows, this._formatCells(), this._options.edit && this._setupEditable(), this._options.selectable && (this._setupSelectable(), this._setSelected()), this._options.clickableRows && this._setupClickableRows(), h.trigger(this._element, Ya);
  }
  _formatCells() {
    d.find(di, this._element).forEach((e) => {
      const i = c.getDataAttribute(e, "index");
      d.find(zn, e).forEach((o) => {
        const r = c.getDataAttribute(o, "field"), a = this.columns.find((l) => l.field === r);
        a && a.format !== null && a.format(o, this.rows[i][r]);
      });
    });
  }
  _toggleDisableState() {
    this._options.pagination !== !1 && (this._activePage === 0 || this._options.loading ? (this._paginationLeft.setAttribute("disabled", ""), this._options.fullPagination && this._paginationStart.setAttribute("disabled", "")) : (this._paginationLeft.removeAttribute("disabled"), this._options.fullPagination && this._paginationStart.removeAttribute("disabled")), this._activePage === this.pages - 1 || this._options.loading || this.pages === 0 ? (this._paginationRight.setAttribute("disabled", ""), this._options.fullPagination && this._paginationEnd.setAttribute("disabled", "")) : (this._paginationRight.removeAttribute("disabled"), this._options.fullPagination && this._paginationEnd.removeAttribute("disabled")));
  }
  _toggleSelectAll(t) {
    t.target.checked ? this._selected = this.rows.map((e) => e.rowIndex) : this._selected = [], this._setSelected(), this._emitSelectEvent();
  }
  _toggleSelectRow(t, e) {
    t.target.checked ? this._options.multi && !this._selected.includes(e) ? this._selected = [...this._selected, e] : (this._selected = [e], this._checkboxes.forEach((i) => {
      i !== t.target && (i.checked = !1);
    })) : this._selected = this._selected.filter((i) => i !== e), this._options.multi && !t.target.checked && (this._headerCheckbox.checked = !1), this._setActiveRows(), this._emitSelectEvent();
  }
  _updateRow(t, e) {
    const i = c.getDataAttribute(t.target, "field"), n = t.target.textContent, o = this._rows[e];
    if (Array.isArray(o)) {
      const a = this.columns.find((l) => l.field === i).columnIndex;
      o[a] = n;
    } else
      o[i] = n;
    h.trigger(this._element, Kb, {
      rows: this._rows,
      columns: this._columns
    });
  }
  static jQueryInterface(t, e, i) {
    return this.each(function() {
      let n = I.getData(this, gi);
      const o = typeof t == "object" && t;
      if (!(!n && /dispose/.test(t)) && (n || (n = new wc(this, o, e)), typeof t == "string")) {
        if (typeof n[t] > "u")
          throw new TypeError(`No method named "${t}"`);
        n[t](e, i);
      }
    });
  }
  static getInstance(t) {
    return I.getData(t, gi);
  }
  static getOrCreateInstance(t, e = {}) {
    return this.getInstance(t) || new this(t, typeof e == "object" ? e : null);
  }
}
const ja = "rating", $s = "te.rating", Xv = "data-te-rating-init", Gv = "[data-te-rating-icon-ref]", ti = `.${$s}`, qv = "ArrowLeft", Zv = "ArrowRight", Qv = {
  tooltip: "string",
  value: "(string|number)",
  readonly: "boolean",
  after: "string",
  before: "string",
  dynamic: "boolean",
  active: "string"
}, Jv = {
  tooltip: "top",
  value: "",
  readonly: !1,
  after: "",
  before: "",
  dynamic: !1,
  active: "fill-current"
}, Ka = `onSelect${ti}`, t0 = `onHover${ti}`, za = `keyup${ti}`, Ua = `focusout${ti}`, Xa = `keydown${ti}`, Ga = `mousedown${ti}`;
class z0 {
  constructor(t, e) {
    this._element = t, this._icons = d.find(Gv, this._element), this._options = this._getConfig(e), this._index = -1, this._savedIndex = null, this._originalClassList = [], this._originalIcons = [], this._fn = {}, this._tooltips = [], this._element && (I.setData(t, $s, this), this._init());
  }
  // Getters
  static get NAME() {
    return ja;
  }
  dispose() {
    I.removeData(this._element, $s), this._options.readonly || (h.off(this._element, za), h.off(this._element, Ua), h.off(this._element, Xa), this._element.removeEventListener("mouseleave", this._fn.mouseleave), this._icons.forEach((t, e) => {
      h.off(t, Ga), t.removeEventListener("mouseenter", this._fn.mouseenter[e]), c.removeClass(t, "cursor-pointer");
    }), this._tooltips.forEach((t) => {
      t._element.removeAttribute(Xv), t.dispose();
    }), this._icons.removeAttribute("tabIndex")), this._element = null;
  }
  // Private
  _init() {
    this._options.readonly || (this._bindMouseEnter(), this._bindMouseLeave(), this._bindMouseDown(), this._bindKeyDown(), this._bindKeyUp(), this._bindFocusLost(), this._icons.forEach((t) => {
      c.addClass(t, "cursor-pointer");
    })), this._options.dynamic && (this._saveOriginalClassList(), this._saveOriginalIcons()), this._setCustomText(), this._setToolTips(), this._options.value && (this._index = this._options.value - 1, this._updateRating(this._index));
  }
  _getConfig(t) {
    const e = c.getDataAttributes(this._element);
    return t = {
      ...Jv,
      ...e,
      ...t
    }, L(ja, t, Qv), t;
  }
  _bindMouseEnter() {
    this._fn.mouseenter = [], this._icons.forEach((t, e) => {
      t.addEventListener(
        "mouseenter",
        // this._fn.mouseenter[i] is needed to create reference and unpin events after call dispose
        // prettier-ignore
        this._fn.mouseenter[e] = (i) => {
          this._index = this._icons.indexOf(i.target), this._updateRating(this._index), this._triggerEvents(t, t0);
        }
      );
    });
  }
  _bindMouseLeave() {
    this._element.addEventListener(
      "mouseleave",
      // this._fn.mouseleave is needed to create reference and unpin events after call dispose
      // prettier-ignore
      this._fn.mouseleave = () => {
        this._savedIndex !== null ? (this._updateRating(this._savedIndex), this._index = this._savedIndex) : this._options.value ? (this._updateRating(this._options.value - 1), this._index = this._options.value - 1) : (this._index = -1, this._clearRating());
      }
    );
  }
  _bindMouseDown() {
    this._icons.forEach((t) => {
      h.on(t, Ga, () => {
        this._setElementOutline("none"), this._savedIndex = this._index, this._triggerEvents(t, Ka);
      });
    });
  }
  _bindKeyDown() {
    this._element.tabIndex = 0, h.on(
      this._element,
      Xa,
      (t) => this._updateAfterKeyDown(t)
    );
  }
  _bindKeyUp() {
    h.on(
      this._element,
      za,
      () => this._setElementOutline("auto")
    );
  }
  _bindFocusLost() {
    h.on(
      this._element,
      Ua,
      () => this._setElementOutline("none")
    );
  }
  _setElementOutline(t) {
    this._element.style.outline = t;
  }
  _triggerEvents(t, e) {
    h.trigger(t, e, {
      value: this._index + 1
    });
  }
  _updateAfterKeyDown(t) {
    const e = this._icons.length - 1, i = this._index;
    t.key === Zv && this._index < e && (this._index += 1), t.key === qv && this._index > -1 && (this._index -= 1), i !== this._index && (this._savedIndex = this._index, this._updateRating(this._savedIndex), this._triggerEvents(this._icons[this._savedIndex], Ka));
  }
  _updateRating(t) {
    this._clearRating(), this._options.dynamic && this._restoreOriginalIcon(t), this._icons.forEach((e, i) => {
      i <= t && c.addClass(e.querySelector("svg"), this._options.active);
    });
  }
  _clearRating() {
    this._icons.forEach((t, e) => {
      const i = t.querySelector("svg");
      this._options.dynamic && (t.classList = this._originalClassList[e], i.innerHTML = this._originalIcons[e]), c.removeClass(i, this._options.active);
    });
  }
  _setToolTips() {
    this._icons.forEach((t, e) => {
      const i = c.getDataAttribute(t, "toggle");
      t.title && !i && (c.setDataAttribute(t, "toggle", "tooltip"), this._tooltips[e] = new Qe(t, {
        placement: this._options.tooltip
      }));
    });
  }
  _setCustomText() {
    this._icons.forEach((t) => {
      const e = c.getDataAttribute(t, "after"), i = c.getDataAttribute(t, "before");
      e && t.insertAdjacentHTML("afterEnd", e), i && t.insertAdjacentHTML("beforeBegin", i);
    });
  }
  _saveOriginalClassList() {
    this._icons.forEach((t) => {
      const e = t.classList.value;
      this._originalClassList.push(e);
    });
  }
  _saveOriginalIcons() {
    this._icons.forEach((t) => {
      const e = t.querySelector("svg").innerHTML;
      this._originalIcons.push(e);
    });
  }
  _restoreOriginalIcon(t) {
    const e = this._originalClassList[t], i = this._originalIcons[t];
    this._icons.forEach((n, o) => {
      if (o <= t) {
        const r = n.querySelector("svg");
        r.innerHTML = i, n.classList = e;
      }
    });
  }
  // Static
  static getInstance(t) {
    return I.getData(t, $s);
  }
  static getOrCreateInstance(t, e = {}) {
    return this.getInstance(t) || new this(t, typeof e == "object" ? e : null);
  }
}
const Gn = "popconfirm", bi = "te.popconfirm", xc = `.${bi}`, e0 = `cancel${xc}`, i0 = `confirm${xc}`, s0 = "[data-te-popconfirm-body]", qn = "data-te-popconfirm-popover", n0 = "data-te-popconfirm-modal", qa = "data-te-popconfirm-backdrop", o0 = {
  popconfirmMode: "string",
  message: "string",
  cancelText: "(null|string)",
  okText: "(null|string)",
  popconfirmIconTemplate: "string",
  cancelLabel: "(null|string)",
  confirmLabel: "(null|string)",
  position: "(null|string)"
}, r0 = {
  popconfirmMode: "inline",
  message: "Are you sure?",
  cancelText: "Cancel",
  okText: "OK",
  popconfirmIconTemplate: "",
  cancelLabel: "Cancel",
  confirmLabel: "Confirm",
  position: "bottom"
}, a0 = {
  backdrop: "string",
  body: "string",
  btnCancel: "string",
  btnConfirm: "string",
  btnsContainer: "string",
  fade: "string",
  icon: "string",
  message: "string",
  messageText: "string",
  modal: "string",
  popover: "string"
}, l0 = {
  backdrop: "h-full w-full z-[1070] fixed top-0 left-0 bg-[#00000066] flex justify-center items-center",
  body: "p-[1rem] bg-white rounded-[0.5rem] opacity-0 dark:bg-neutral-700",
  btnCancel: "inline-block rounded bg-primary-100 px-4 pb-[5px] pt-[6px] text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200",
  btnConfirm: "inline-block rounded bg-primary px-4 pb-[5px] pt-[6px] text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]",
  btnsContainer: "flex justify-end space-x-2",
  fade: "transition-opacity duration-[150ms] ease-linear",
  icon: "pr-2",
  message: "flex mb-3",
  messageText: "text-neutral-600 dark:text-white",
  modal: "absolute w-[300px] z-[1080] shadow-sm rounded-[0.5rem]",
  popover: "w-[300px] border-0 rounded-[0.5rem] z-[1080] shadow-sm"
};
class kc {
  constructor(t, e, i) {
    this._element = t, this._options = this._getConfig(e), this._classes = this._getClasses(i), this._popper = null, this._cancelButton = "", this._confirmButton = "", this._isOpen = !1, this._uid = this._element.id ? `popconfirm-${this._element.id}` : bt("popconfirm-"), t && I.setData(t, bi, this), this._clickHandler = this.open.bind(this), h.on(this._element, "click", this._clickHandler);
  }
  // Getters
  static get NAME() {
    return Gn;
  }
  get container() {
    return d.findOne(`#${this._uid}`);
  }
  get popconfirmBody() {
    return d.findOne(
      s0,
      this.container
    );
  }
  // Public
  dispose() {
    (this._isOpen || this.container !== null) && this.close(), I.removeData(this._element, bi), h.off(this._element, "click", this._clickHandler), this._element = null;
  }
  open() {
    this._isOpen || (this._options.popconfirmMode === "inline" ? this._openPopover(this._getPopoverTemplate()) : this._openModal(this._getModalTemplate()), this._handleCancelButtonClick(), this._handleConfirmButtonClick(), this._listenToEscapeKey(), this._listenToOutsideClick());
  }
  close() {
    if (this._isOpen) {
      if (this._popper !== null || d.findOne(`[${qn}]`) !== null)
        h.on(
          this.popconfirmBody,
          "transitionend",
          this._handlePopconfirmTransitionEnd.bind(this)
        ), c.removeClass(this.popconfirmBody, "opacity-100");
      else {
        const t = d.findOne(
          `[${qa}]`
        );
        c.removeClass(this.popconfirmBody, "opacity-100"), document.body.removeChild(t), this._isOpen = !1;
      }
      h.off(document, "click", this._handleOutsideClick.bind(this)), h.off(document, "keydown", this._handleEscapeKey.bind(this));
    }
  }
  _handlePopconfirmTransitionEnd(t) {
    if (t.target !== this.popconfirmBody)
      return;
    const e = d.findOne(
      `[${qn}]`
    );
    h.off(this.popconfirmBody, "transitionend"), this._isOpen && t && t.propertyName === "opacity" && (this._popper.destroy(), e && document.body.removeChild(e), this._isOpen = !1);
  }
  // Private
  _getPopoverTemplate() {
    const t = D("div"), e = this._getPopconfirmTemplate();
    return t.setAttribute(qn, ""), c.addClass(t, this._classes.popover), t.id = this._uid, t.innerHTML = e, t;
  }
  _getModalTemplate() {
    const t = D("div"), e = this._getPopconfirmTemplate();
    return t.setAttribute(n0, ""), c.addClass(t, `${this._classes.modal}`), t.id = this._uid, t.innerHTML = e, t;
  }
  _getPopconfirmTemplate() {
    return `<div data-te-popconfirm-body class="${this._classes.body}">
      <p class="${this._classes.message}">
      ${this._options.popconfirmIconTemplate ? `<span class="${this._classes.icon}">${this._options.popconfirmIconTemplate}</span>` : ""}
      <span class="${this._classes.messageText}">${this._options.message}</span>
      </p>
      <div class="${this._classes.btnsContainer}">
      ${this._options.cancelText ? `<button type="button" data-te-ripple-init data-te-ripple-color="light" id="popconfirm-button-cancel" aria-label="${this._options.cancelLabel}"
        class="${this._classes.btnCancel}">${this._options.cancelText}</button>` : ""}
      <button type="button" data-te-ripple-init data-te-ripple-color="light" id="popconfirm-button-confirm"
      aria-label="${this._options.confirmLabel}"
      class="${this._classes.btnConfirm}">${this._options.okText ? this._options.okText : "Ok"}</button>
      </div>
    </div>`;
  }
  _getConfig(t) {
    return t = {
      ...r0,
      ...c.getDataAttributes(this._element),
      ...t
    }, L(Gn, t, o0), t;
  }
  _getClasses(t) {
    const e = c.getDataClassAttributes(this._element);
    return t = {
      ...l0,
      ...e,
      ...t
    }, L(Gn, t, a0), t;
  }
  _openPopover(t) {
    this._popper = Ee(this._element, t, {
      placement: this._translatePositionValue(),
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 5]
          }
        }
      ]
    }), document.body.appendChild(t), setTimeout(() => {
      c.addClass(
        this.popconfirmBody,
        `${this._classes.fade} opacity-100`
      ), this._isOpen = !0;
    }, 0);
  }
  _openModal(t) {
    const e = D("div");
    e.setAttribute(qa, ""), c.addClass(e, this._classes.backdrop), document.body.appendChild(e), e.appendChild(t), c.addClass(this.popconfirmBody, "opacity-100"), this._isOpen = !0;
  }
  _handleCancelButtonClick() {
    const t = this.container;
    this._cancelButton = d.findOne(
      "#popconfirm-button-cancel",
      t
    ), Ue.getOrCreateInstance(this._cancelButton, { rippleColor: "light" }), this._cancelButton !== null && h.on(this._cancelButton, "click", () => {
      this.close(), h.trigger(this._element, e0);
    });
  }
  _handleConfirmButtonClick() {
    const t = this.container;
    this._confirmButton = d.findOne(
      "#popconfirm-button-confirm",
      t
    ), Ue.getOrCreateInstance(this._confirmButton, { rippleColor: "light" }), h.on(this._confirmButton, "click", () => {
      this.close(), h.trigger(this._element, i0);
    });
  }
  _listenToEscapeKey() {
    h.on(document, "keydown", this._handleEscapeKey.bind(this));
  }
  _handleEscapeKey(t) {
    t.keyCode === Li && this.close();
  }
  _listenToOutsideClick() {
    h.on(document, "click", this._handleOutsideClick.bind(this));
  }
  _handleOutsideClick(t) {
    const e = this.container, i = t.target === e, n = e && e.contains(t.target), o = t.target === this._element, r = this._element && this._element.contains(t.target);
    !i && !n && !o && !r && this.close();
  }
  _translatePositionValue() {
    switch (this._options.position) {
      case "top left":
        return "top-end";
      case "top":
        return "top";
      case "top right":
        return "top-start";
      case "bottom left":
        return "bottom-end";
      case "bottom":
        return "bottom";
      case "bottom right":
        return "bottom-start";
      case "left":
        return "left";
      case "left top":
        return "left-end";
      case "left bottom":
        return "left-start";
      case "right":
        return "right";
      case "right top":
        return "right-end";
      case "right bottom":
        return "right-start";
      case void 0:
        return "bottom";
      default:
        return "bottom";
    }
  }
  // Static
  static jQueryInterface(t, e) {
    return this.each(function() {
      const i = I.getData(this, bi), n = typeof t == "object" && t;
      if (!(!i && /dispose/.test(t))) {
        if (!i)
          return new kc(this, n);
        if (typeof t == "string") {
          if (typeof i[t] > "u")
            throw new TypeError(`No method named "${t}"`);
          i[t](e);
        }
      }
    });
  }
  static getInstance(t) {
    return I.getData(t, bi);
  }
  static getOrCreateInstance(t, e = {}) {
    return this.getInstance(t) || new this(t, typeof e == "object" ? e : null);
  }
}
const Zn = "lightbox", vi = "te.lightbox", c0 = `.${vi}`, h0 = ".data-api", Se = `click${c0}${h0}`, Oc = "[data-te-lightbox-init]", d0 = `${Oc} img:not([data-te-lightbox-disabled])`, Za = "data-te-lightbox-caption", u0 = "data-te-lightbox-disabled", St = "data-te-lightbox-active", p0 = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
</svg>
`, _0 = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
</svg>
`, f0 = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
</svg>
`, m0 = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
</svg>
`, g0 = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
</svg>
`, b0 = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" />
</svg>
`, v0 = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>
`, T0 = {
  container: "string",
  zoomLevel: "(number|string)",
  prevIconTemplate: "string",
  nextIconTemplate: "string",
  showFullscreenIconTemplate: "string",
  hideFullscreenIconTemplate: "string",
  zoomInIconTemplate: "string",
  closeIconTemplate: "string",
  zoomOutIconTemplate: "string",
  spinnerContent: "string"
}, E0 = {
  container: "body",
  zoomLevel: 1,
  prevIconTemplate: p0,
  nextIconTemplate: _0,
  showFullscreenIconTemplate: f0,
  hideFullscreenIconTemplate: m0,
  zoomInIconTemplate: g0,
  zoomOutIconTemplate: b0,
  closeIconTemplate: v0,
  spinnerContent: "Loading..."
}, C0 = {
  caption: "text-white text-ellipsis overflow-hidden whitespace-nowrap mx-[10px] text-center",
  captionWrapper: "fixed left-0 bottom-0 w-full h-[50px] flex justify-center items-center",
  closeBtn: "border-none bg-transparent w-[50px] h-[50px] px-4 text-[#b3b3b3] transition-colors duration-200 ease-in-out hover:text-white focus:text-white motion-reduce:transition-none outline-none",
  fullscreenBtn: "border-none bg-transparent w-[50px] h-[50px] px-4 text-[#b3b3b3] transition-colors duration-200 ease-in-out hover:text-white focus:text-white motion-reduce:transition-none outline-none",
  gallery: "invisible fixed left-0 top-0 w-full h-full z-[1100] pointer-events-none opacity-0 bg-[#000000e6] transition-all duration-[400ms] motion-reduce:transition-none",
  galleryContent: "fixed top-[50px] left-[50px] w-[calc(100%-100px)] h-[calc(100%-100px)]",
  galleryCounter: "flex justify-center items-center px-[10px] mb-0 h-full text-[#b3b3b3]",
  img: "absolute left-0 top-0 w-full max-h-full h-auto cursor-pointer pointer-events-auto",
  imgWrapper: "absolute top-0 left-0 w-full h-full opacity-0 transform scale-[0.25] transition-all duration-[400ms] ease-out pointer-events-none motion-reduce:transition-none motion-reduce:transform-none",
  leftTools: "float-left h-full",
  loader: "fixed left-0 top-0 z-[2] w-full h-full text-neutral-50 opacity-1 flex justify-center items-center pointer-events-none transition-opacity duration-[1000ms] motion-reduce:transition-none",
  nextBtn: "border-none bg-transparent w-full h-[50px] flex justify-center items-center text-[#b3b3b3] transition-colors duration-200 ease-in-out hover:text-white focus:text-white motion-reduce:transition-none outline-none",
  nextBtnWrapper: "fixed right-0 top-0 w-[50px] h-full flex justify-center items-center transition-opacity duration-[400ms] motion-reduce:transition-none",
  prevBtn: "border-none bg-transparent w-full h-[50px] flex justify-center items-center text-[#b3b3b3] transition-colors duration-200 ease-in-out hover:text-white focus:text-white motion-reduce:transition-none outline-none",
  prevBtnWrapper: "fixed left-0 top-0 w-[50px] h-full flex justify-center items-center transition-opacity duration-[400ms] motion-reduce:transition-none",
  rightTools: "float-right",
  spinner: "inline-block h-8 w-8 animate-[spinner-grow_0.75s_linear_infinite] rounded-full bg-current align-[-0.125em] motion-reduce:animate-[spinner-grow_1.5s_linear_infinite]",
  spinnerContent: "!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]",
  toolbar: "absolute top-0 left-0 w-full h-[50px] z-20 transition-opacity duration-[400ms] motion-reduce:transition-none",
  vertical: "h-full max-h-full w-auto",
  zoomBtn: "border-none bg-transparent w-[50px] h-[50px] px-4 text-[#b3b3b3] transition-colors duration-200 ease-in-out hover:text-white focus:text-white motion-reduce:transition-none outline-none"
}, A0 = {
  caption: "string",
  captionWrapper: "string",
  closeBtn: "string",
  fullscreenBtn: "string",
  gallery: "string",
  galleryContent: "string",
  galleryCounter: "string",
  img: "string",
  imgWrapper: "string",
  leftTools: "string",
  loader: "string",
  nextBtn: "string",
  nextBtnWrapper: "string",
  prevBtn: "string",
  prevBtnWrapper: "string",
  rightTools: "string",
  spinner: "string",
  spinnerContent: "string",
  toolbar: "string",
  vertical: "string",
  zoomBtn: "string"
};
class Ls {
  constructor(t, e = {}, i) {
    this._element = t, this._options = e, this._classes = this._getClasses(i), this._getContainer(), this._id = `lightbox-${Math.random().toString(36).substr(2, 9)}`, this._activeImg = 0, this._images = [], this._zoom = 1, this._gallery = null, this._galleryToolbar = null, this._galleryContent = null, this._loader = null, this._imgCounter = null, this._animating = !1, this._fullscreen = !1, this._zoomBtn = null, this._fullscreenBtn = null, this._toolsToggleTimer = 0, this._mousedown = !1, this._mousedownPositionX = 0, this._mousedownPositionY = 0, this._originalPositionX = 0, this._originalPositionY = 0, this._positionX = 0, this._positionY = 0, this._zoomTimer = 0, this._tapCounter = 0, this._tapTime = 0, this._rightArrow = null, this._leftArrowWrapper = null, this._rightArrowWrapper = null, this._initiated = !1, this._multitouch = !1, this._touchZoomPosition = [], this._element && (I.setData(t, vi, this), this.init());
  }
  // Getters
  static get NAME() {
    return Zn;
  }
  get activeImg() {
    return this._activeImg;
  }
  get currentImg() {
    return d.findOne(
      `[${St}]`,
      this._galleryContent
    );
  }
  get options() {
    const t = {
      ...E0,
      ...c.getDataAttributes(this._element),
      ...this._options
    };
    return L(Zn, t, T0), t;
  }
  // Public
  init() {
    this._initiated || (this._appendTemplate(), this._initiated = !0);
  }
  open(t = 0) {
    this._getImages(), this._setActiveImg(t), this._sortImages(), this._triggerEvents("open", "opened"), this._loadImages().then((e) => {
      this._resizeImages(e), this._toggleTemplate(), this._addEvents(), this._focusFullscreenBtn();
    });
  }
  close() {
    this.reset(), this._removeEvents(), this._toggleTemplate(), this._triggerEvents("close", "closed");
  }
  slide(t = "right") {
    this._animating === !0 || this._images.length <= 1 || (this._triggerEvents("slide", "slided"), this._beforeSlideEvents(), t === "right" && this._slideHorizontally(t), t === "left" && this._slideHorizontally(t), t === "first" && this._slideToTarget(t), t === "last" && this._slideToTarget(t), this._afterSlideEvents());
  }
  zoomIn() {
    this._zoom >= 3 || (this._triggerEvents("zoomIn", "zoomedIn"), this._zoom += parseFloat(this.options.zoomLevel), c.style(this.currentImg.parentNode, {
      transform: `scale(${this._zoom})`
    }), this._updateZoomBtn());
  }
  zoomOut() {
    this._zoom <= 1 || (this._triggerEvents("zoomOut", "zoomedOut"), this._zoom -= parseFloat(this.options.zoomLevel), c.style(this.currentImg.parentNode, {
      transform: `scale(${this._zoom})`
    }), this._updateZoomBtn(), this._updateImgPosition());
  }
  toggleFullscreen() {
    this._fullscreen === !1 ? (this._fullscreenBtn.setAttribute(St, ""), this._fullscreenBtn.innerHTML = this.options.hideFullscreenIconTemplate, this._gallery.requestFullscreen && this._gallery.requestFullscreen(), this._fullscreen = !0) : (this._fullscreenBtn.removeAttribute(St), document.exitFullscreen && document.exitFullscreen(), this._fullscreen = !1);
  }
  reset() {
    this._restoreDefaultFullscreen(), this._restoreDefaultPosition(), this._restoreDefaultZoom(), clearTimeout(this._toolsToggleTimer), clearTimeout(this._doubleTapTimer);
  }
  dispose() {
    h.off(
      document,
      Se,
      d0,
      this.toggle
    ), this._galleryContent && this._removeEvents(), this._gallery && this._gallery.remove(), I.removeData(this._element, vi), this._element = null;
  }
  // Private
  _getClasses(t) {
    const e = c.getDataClassAttributes(this._element);
    return t = {
      ...C0,
      ...e,
      ...t
    }, L(Zn, t, A0), t;
  }
  _getImages() {
    const e = d.find("img", this._element).filter(
      (i) => !i.hasAttribute(u0)
    );
    this._images = e;
  }
  _getContainer() {
    this._container = d.findOne(this.options.container);
  }
  _setActiveImg(t) {
    this._activeImg = typeof t == "number" ? t : this._images.indexOf(t.target);
  }
  _appendTemplate() {
    this._gallery = D("div"), c.addClass(this._gallery, `${this._classes.gallery}`), this._element.dataset.id = this._id, this._gallery.id = this._id, this._appendLoader(), this._appendToolbar(), this._appendContent(), this._appendArrows(), this._appendCaption(), this._container.append(this._gallery);
  }
  _appendToolbar() {
    this._galleryToolbar = D("div"), this._imgCounter = D("p"), this._fullscreenBtn = D("button"), this._zoomBtn = D("button");
    const t = D("button"), e = D("div"), i = D("div");
    c.addClass(this._galleryToolbar, `${this._classes.toolbar}`), c.addClass(this._imgCounter, `${this._classes.galleryCounter}`), c.addClass(this._fullscreenBtn, `${this._classes.fullscreenBtn}`), c.addClass(this._zoomBtn, `${this._classes.zoomInBtn}`), c.addClass(this._zoomBtn, this._classes.zoomBtn), c.addClass(e, `${this._classes.leftTools}`), c.addClass(i, `${this._classes.rightTools}`), c.addClass(t, `${this._classes.closeBtn}`), this._fullscreenBtn.innerHTML = this.options.showFullscreenIconTemplate, t.innerHTML = this.options.closeIconTemplate, this._zoomBtn.innerHTML = this.options.zoomInIconTemplate, this._fullscreenBtn.setAttribute("aria-label", "Toggle fullscreen"), this._zoomBtn.setAttribute("aria-label", "Zoom in"), t.setAttribute("aria-label", "Close"), h.on(
      this._fullscreenBtn,
      Se,
      () => this.toggleFullscreen()
    ), h.on(
      this._zoomBtn,
      Se,
      () => this._toggleZoom()
    ), h.on(t, Se, () => this.close()), e.append(this._imgCounter), i.append(this._fullscreenBtn), i.append(this._zoomBtn), i.append(t), this._galleryToolbar.append(e), this._galleryToolbar.append(i), this._gallery.append(this._galleryToolbar);
  }
  _appendContent() {
    this._galleryContent = D("div"), c.addClass(
      this._galleryContent,
      `${this._classes.galleryContent}`
    ), this._gallery.append(this._galleryContent);
  }
  _appendLoader() {
    this._loader = D("div");
    const t = D("div"), e = D("span");
    c.addClass(this._loader, `${this._classes.loader}`), c.addClass(t, `${this._classes.spinner}`), c.addClass(e, `${this._classes.spinnerContent}`), t.setAttribute("role", "status"), e.innerHTML = this.options.spinnerContent, t.append(e), this._loader.append(t), this._gallery.append(this._loader);
  }
  _appendArrows() {
    this._leftArrowWrapper = D("div"), c.addClass(
      this._leftArrowWrapper,
      `${this._classes.prevBtnWrapper}`
    );
    const t = D("button");
    t.setAttribute("aria-label", "Previous"), c.addClass(t, `${this._classes.prevBtn}`), h.on(t, Se, () => this.slide("left")), this._leftArrowWrapper.append(t), this._rightArrowWrapper = D("div"), c.addClass(
      this._rightArrowWrapper,
      `${this._classes.nextBtnWrapper}`
    ), this._rightArrow = D("button"), this._rightArrow.setAttribute("aria-label", "Next"), c.addClass(this._rightArrow, `${this._classes.nextBtn}`), h.on(this._rightArrow, Se, () => this.slide()), this._rightArrowWrapper.append(this._rightArrow), this._rightArrow.innerHTML = this.options.nextIconTemplate, t.innerHTML = this.options.prevIconTemplate, this._getImages(), !(this._images.length <= 1) && (this._gallery.append(this._leftArrowWrapper), this._gallery.append(this._rightArrowWrapper));
  }
  _appendCaption() {
    const t = D("div"), e = D("p");
    e.setAttribute(Za, ""), c.addClass(t, `${this._classes.captionWrapper}`), c.addClass(e, `${this._classes.caption}`), t.append(e), this._gallery.append(t);
  }
  _sortImages() {
    for (let t = 0; t < this._activeImg; t++)
      this._images.push(this._images.shift());
  }
  async _loadImages() {
    const t = [], e = [];
    this._galleryContent.innerHTML = "";
    let i = 0;
    return this._images.forEach((n, o) => {
      t.push(
        new Promise((r) => {
          const a = new Image(), l = D("div");
          c.addClass(l, `${this._classes.imgWrapper}`), c.addClass(a, `${this._classes.img}`), this._addImgStyles(a, l, i, o, n), l.append(a), this._galleryContent.append(l), a.onload = r, a.src = n.dataset.teImg || n.src, e.push(a), i += 100;
        })
      );
    }), await Promise.all(t), e;
  }
  _addImgStyles(t, e, i, n, o) {
    t.alt = o.alt, t.draggable = !1, c.style(e, {
      position: "absolute",
      left: `${i}%`,
      top: 0
    }), (o.dataset.teCaption || o.dataset.teCaption === "") && (t.dataset.caption = o.dataset.teCaption), i === 0 ? (o.width < o.height && c.addClass(t, `${this._classes.vertical}`), c.style(e, { opacity: 1 }), t.setAttribute(St, "")) : t.removeAttribute(St), n === this._images.length - 1 && this._images.length > 1 && c.style(e, { left: "-100%" });
  }
  _resizeImages(t) {
    t.forEach((e) => {
      this._calculateImgSize(e);
    });
  }
  _calculateImgSize(t) {
    t.width >= t.height ? (t.style.width = "100%", t.style.maxWidth = "100%", t.style.height = "auto", t.style.top = `${(t.parentNode.offsetHeight - t.height) / 2}px`, t.style.left = 0) : (t.style.height = "100%", t.style.maxHeight = "100%", t.style.width = "auto", t.style.left = `${(t.parentNode.offsetWidth - t.width) / 2}px`, t.style.top = 0), t.width >= t.parentNode.offsetWidth && (t.style.width = `${t.parentNode.offsetWidth}px`, t.style.height = "auto", t.style.left = 0, t.style.top = `${(t.parentNode.offsetHeight - t.height) / 2}px`), t.height >= t.parentNode.offsetHeight && (t.style.height = `${t.parentNode.offsetHeight}px`, t.style.width = "auto", t.style.top = 0, t.style.left = `${(t.parentNode.offsetWidth - t.width) / 2}px`), this._positionX = parseFloat(t.style.left) || 0, this._positionY = parseFloat(t.style.top) || 0;
  }
  _onResize() {
    this._images = d.find("img", this._galleryContent), this._images.forEach((t) => {
      this._calculateImgSize(t);
    });
  }
  _onFullscreenChange() {
    (document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement) === void 0 && (this._fullscreen = !1, this._fullscreenBtn.innerHTML = this.options.showFullscreenIconTemplate, this._fullscreenBtn.removeAttribute(St));
  }
  _beforeSlideEvents() {
    this._animationStart(), this._restoreDefaultZoom(), this._restoreDefaultPosition(), this._resetDoubleTap();
  }
  _slideHorizontally(t) {
    this._images = d.find("img", this._galleryContent), this._images.forEach((e) => {
      let i;
      t === "right" ? (i = parseInt(e.parentNode.style.left, 10) - 100, i < -100 && (i = (this._images.length - 2) * 100)) : (i = parseInt(e.parentNode.style.left, 10) + 100, i === (this._images.length - 1) * 100 && (i = -100)), this._slideImg(e, i);
    }), this._updateActiveImg(t);
  }
  _slideImg(t, e) {
    e === 0 ? (t.setAttribute(St, ""), c.style(t.parentNode, { opacity: 1, transform: "scale(1)" })) : (t.removeAttribute(St), c.style(t.parentNode, {
      opacity: 0,
      transform: "scale(0.25)"
    })), t.parentNode.style.left = `${e}%`;
  }
  _slideToTarget(t) {
    t === "first" && this._activeImg === 0 || t === "last" && this._activeImg === this._images.length - 1 || (this.reset(), this._removeEvents(), this._showLoader(), this._getImages(), this._activeImg = t === "first" ? 0 : this._images.length - 1, this._sortImages(), c.style(this.currentImg.parentNode, {
      transform: "scale(0.25)",
      opacity: 0
    }), setTimeout(() => {
      this._loadImages().then((e) => {
        this._resizeImages(e), this._addEvents(), this._updateCaption(), this._hideLoader(), setTimeout(() => {
          c.style(this.currentImg.parentNode, {
            transform: "scale(1)",
            opacity: 1
          });
        }, 10);
      });
    }, 400));
  }
  _updateActiveImg(t) {
    t === "right" && (this._activeImg === this._images.length - 1 ? this._activeImg = 0 : this._activeImg++), t === "left" && (this._activeImg === 0 ? this._activeImg = this._images.length - 1 : this._activeImg--);
  }
  _afterSlideEvents() {
    this._updateCounter(), this._updateCaption();
  }
  _updateCounter() {
    this._images.length <= 1 || setTimeout(() => {
      this._imgCounter.innerHTML = `${this._activeImg + 1} / ${this._images.length}`;
    }, 200);
  }
  _updateCaption() {
    setTimeout(() => {
      let t = this.currentImg.alt;
      (this.currentImg.dataset.caption || this.currentImg.dataset.caption === "") && (t = this.currentImg.dataset.caption), d.findOne(
        `[${Za}]`,
        this._gallery
      ).innerHTML = t;
    }, 200);
  }
  _toggleTemplate() {
    this._gallery.style.visibility === "visible" ? (c.style(this.currentImg.parentNode, {
      transform: "scale(0.25)"
    }), setTimeout(() => {
      this._hideGallery(), this._enableScroll(), this._showLoader();
    }, 100)) : (this._showGallery(), this._disableScroll(), this._updateCounter(), this._updateCaption(), this._setToolsToggleTimout(), this._hideLoader());
  }
  _showLoader() {
    c.style(this._loader, { opacity: 1 });
  }
  _hideLoader() {
    c.style(this._loader, { opacity: 0 });
  }
  _hideGallery() {
    c.style(this._gallery, {
      opacity: 0,
      pointerEvents: "none",
      visibility: "hidden"
    });
  }
  _showGallery() {
    c.style(this._gallery, {
      opacity: 1,
      pointerEvents: "initial",
      visibility: "visible"
    }), setTimeout(() => {
      c.style(this.currentImg.parentNode, { transform: "scale(1)" });
    }, 50);
  }
  _toggleZoom() {
    this._zoom !== 1 ? this.zoomOut() : this.zoomIn();
  }
  _updateZoomBtn() {
    this._zoom > 1 ? (this._zoomBtn.setAttribute(St, ""), this._zoomBtn.setAttribute("aria-label", "Zoom out"), this._zoomBtn.innerHTML = this.options.zoomOutIconTemplate) : (this._zoomBtn.removeAttribute(St), this._zoomBtn.setAttribute("aria-label", "Zoom in"), this._zoomBtn.innerHTML = this.options.zoomInIconTemplate);
  }
  _updateImgPosition() {
    this._zoom === 1 && this._restoreDefaultPosition();
  }
  _addEvents() {
    const t = d.find("img", this._galleryContent);
    this._onWindowTouchmove = this._onWindowTouchmove.bind(this), this._onWindowTouchstart = this._onWindowTouchstart.bind(this), this._onImgMousedown = this._onMousedown.bind(this), this._onImgMousemove = this._onMousemove.bind(this), this._onImgWheel = this._onZoom.bind(this), this._onImgMouseup = this._onMouseup.bind(this), this._onImgTouchend = this._onTouchend.bind(this), this._onImgDoubleClick = this._onDoubleClick.bind(this), this._onWindowResize = this._onResize.bind(this), this._onWindowFullscreenChange = this._onFullscreenChange.bind(this), this._onAnyImgAction = this._resetToolsToggler.bind(this), this._onGalleryClick = this._onBackdropClick.bind(this), this._onKeyupEvent = this._onKeyup.bind(this), this._onRightArrowKeydownEvent = this._onRightArrowKeydown.bind(this), this._onFullscreenBtnKeydownEvent = this._onFullscreenBtnKeydown.bind(this), t.forEach((e) => {
      h.on(e, "mousedown", this._onImgMousedown, {
        passive: !0
      }), h.on(e, "touchstart", this._onImgMousedown, {
        passive: !0
      }), h.on(e, "mousemove", this._onImgMousemove, {
        passive: !0
      }), h.on(e, "touchmove", this._onImgMousemove, {
        passive: !0
      }), h.on(e, "wheel", this._onImgWheel, { passive: !0 }), h.on(e, "dblclick", this._onImgDoubleClick, {
        passive: !0
      });
    }), document.addEventListener("touchmove", this._onWindowTouchmove, {
      passive: !1
    }), h.on(window, "touchstart", this._onWindowTouchstart), h.on(window, "mouseup", this._onImgMouseup), h.on(window, "touchend", this._onImgTouchend), h.on(window, "resize", this._onWindowResize), h.on(window, "orientationchange", this._onWindowResize), h.on(window, "keyup", this._onKeyupEvent), h.on(window, "fullscreenchange", this._onWindowFullscreenChange), h.on(this._gallery, "mousemove", this._onAnyImgAction), h.on(this._gallery, "click", this._onGalleryClick), h.on(
      this._rightArrow,
      "keydown",
      this._onRightArrowKeydownEvent
    ), h.on(
      this._fullscreenBtn,
      "keydown",
      this._onFullscreenBtnKeydownEvent
    );
  }
  _removeEvents() {
    d.find("img", this._galleryContent).forEach((e) => {
      h.off(e, "mousedown", this._onImgMousedown), h.off(e, "touchstart", this._onImgMousedown), h.off(e, "mousemove", this._onImgMousemove), h.off(e, "touchmove", this._onImgMousemove), h.off(e, "wheel", this._onImgWheel), h.off(e, "dblclick", this._onImgDoubleClick);
    }), document.removeEventListener("touchmove", this._onWindowTouchmove, {
      passive: !1
    }), h.off(window, "touchstart", this._onWindowTouchstart), h.off(window, "mouseup", this._onImgMouseup), h.off(window, "touchend", this._onImgTouchend), h.off(window, "resize", this._onWindowResize), h.off(window, "orientationchange", this._onWindowResize), h.off(window, "keyup", this._onKeyupEvent), h.off(
      window,
      "fullscreenchange",
      this._onWindowFullscreenChange
    ), h.off(this._gallery, "mousemove", this._onAnyImgAction), h.off(this._gallery, "click", this._onGalleryClick), h.off(
      this._rightArrow,
      "keydown",
      this._onRightArrowKeydownEvent
    ), h.off(
      this._fullscreenBtn,
      "keydown",
      this._onFullscreenBtnKeydownEvent
    );
  }
  _onMousedown(t) {
    const e = t.touches, i = e ? e[0].clientX : t.clientX, n = e ? e[0].clientY : t.clientY;
    this._originalPositionX = parseFloat(this.currentImg.style.left) || 0, this._originalPositionY = parseFloat(this.currentImg.style.top) || 0, this._positionX = this._originalPositionX, this._positionY = this._originalPositionY, this._mousedownPositionX = i * (1 / this._zoom) - this._positionX, this._mousedownPositionY = n * (1 / this._zoom) - this._positionY, this._mousedown = !0, t.type === "touchstart" && t.touches.length > 1 && (this._multitouch = !0, this._touchZoomPosition = t.touches);
  }
  _onMousemove(t) {
    if (!this._mousedown)
      return;
    const e = t.touches, i = e ? e[0].clientX : t.clientX, n = e ? e[0].clientY : t.clientY;
    if (e && this._resetToolsToggler(), !this._multitouch)
      if (this._zoom !== 1)
        this._positionX = i * (1 / this._zoom) - this._mousedownPositionX, this._positionY = n * (1 / this._zoom) - this._mousedownPositionY, c.style(this.currentImg, {
          left: `${this._positionX}px`,
          top: `${this._positionY}px`
        });
      else {
        if (this._images.length <= 1)
          return;
        this._positionX = i * (1 / this._zoom) - this._mousedownPositionX, c.style(this.currentImg, { left: `${this._positionX}px` });
      }
  }
  _onMouseup(t) {
    this._mousedown = !1, this._moveImg(t.target);
  }
  _onTouchend(t) {
    this._mousedown = !1, this._multitouch ? t.targetTouches.length === 0 && (this._multitouch = !1, this._touchZoomPosition = []) : this._multitouch || (this._checkDoubleTap(t), this._moveImg(t.target));
  }
  _calculateTouchZoom(t) {
    const e = Math.hypot(
      this._touchZoomPosition[1].pageX - this._touchZoomPosition[0].pageX,
      this._touchZoomPosition[1].pageY - this._touchZoomPosition[0].pageY
    ), i = Math.hypot(
      t.touches[1].pageX - t.touches[0].pageX,
      t.touches[1].pageY - t.touches[0].pageY
    ), n = Math.abs(e - i), o = t.view.screen.width;
    n > o * 0.03 && (e <= i ? this.zoomIn() : this.zoomOut(), this._touchZoomPosition = t.touches);
  }
  _onWindowTouchstart(t) {
    t.touches.length > 1 && (this._multitouch = !0, this._touchZoomPosition = t.touches);
  }
  _onWindowTouchmove(t) {
    t.preventDefault(), t.type === "touchmove" && t.targetTouches.length > 1 && this._calculateTouchZoom(t);
  }
  _onRightArrowKeydown(t) {
    switch (t.keyCode) {
      case 9:
        if (t.shiftKey)
          break;
        t.preventDefault(), this._focusFullscreenBtn();
        break;
    }
  }
  _onFullscreenBtnKeydown(t) {
    switch (t.keyCode) {
      case 9:
        if (!t.shiftKey)
          break;
        t.preventDefault(), this._focusRightArrow();
        break;
    }
  }
  _onKeyup(t) {
    switch (this._resetToolsToggler(), t.keyCode) {
      case 39:
        this.slide();
        break;
      case 37:
        this.slide("left");
        break;
      case 27:
        this.close();
        break;
      case 36:
        this.slide("first");
        break;
      case 35:
        this.slide("last");
        break;
      case 38:
        this.zoomIn();
        break;
      case 40:
        this.zoomOut();
        break;
    }
  }
  _focusFullscreenBtn() {
    setTimeout(() => {
      this._fullscreenBtn.focus();
    }, 100);
  }
  _focusRightArrow() {
    this._rightArrow.focus();
  }
  _moveImg(t) {
    if (this._multitouch || this._zoom !== 1 || t !== this.currentImg || this._images.length <= 1)
      return;
    const e = this._positionX - this._originalPositionX;
    e > 0 ? this.slide("left") : e < 0 && this.slide();
  }
  _checkDoubleTap(t) {
    clearTimeout(this._doubleTapTimer);
    const i = (/* @__PURE__ */ new Date()).getTime() - this._tapTime;
    this._tapCounter > 0 && i < 500 ? (this._onDoubleClick(t), this._doubleTapTimer = setTimeout(() => {
      this._tapTime = (/* @__PURE__ */ new Date()).getTime(), this._tapCounter = 0;
    }, 300)) : (this._tapCounter++, this._tapTime = (/* @__PURE__ */ new Date()).getTime());
  }
  _resetDoubleTap() {
    this._tapTime = 0, this._tapCounter = 0, clearTimeout(this._doubleTapTimer);
  }
  _onDoubleClick(t) {
    this._multitouch || (t.touches || this._setNewPositionOnZoomIn(t), this._zoom !== 1 ? this._restoreDefaultZoom() : this.zoomIn());
  }
  _onZoom(t) {
    if (t.deltaY > 0)
      this.zoomOut();
    else {
      if (this._zoom >= 3)
        return;
      this._setNewPositionOnZoomIn(t), this.zoomIn();
    }
  }
  _onBackdropClick(t) {
    this._resetToolsToggler(), t.target.tagName === "DIV" && this.close();
  }
  _setNewPositionOnZoomIn(t) {
    clearTimeout(this._zoomTimer), this._positionX = window.innerWidth / 2 - t.offsetX - 50, this._positionY = window.innerHeight / 2 - t.offsetY - 50, this.currentImg.style.transition = "all 0.5s ease-out", this.currentImg.style.left = `${this._positionX}px`, this.currentImg.style.top = `${this._positionY}px`, this._zoomTimer = setTimeout(() => {
      this.currentImg.style.transition = "none";
    }, 500);
  }
  _resetToolsToggler() {
    this._showTools(), clearTimeout(this._toolsToggleTimer), this._setToolsToggleTimout();
  }
  _setToolsToggleTimout() {
    this._toolsToggleTimer = setTimeout(() => {
      this._hideTools(), clearTimeout(this._toolsToggleTimer);
    }, 4e3);
  }
  _hideTools() {
    c.style(this._galleryToolbar, { opacity: 0 }), c.style(this._leftArrowWrapper, { opacity: 0 }), c.style(this._rightArrowWrapper, { opacity: 0 });
  }
  _showTools() {
    c.style(this._galleryToolbar, { opacity: 1 }), c.style(this._leftArrowWrapper, { opacity: 1 }), c.style(this._rightArrowWrapper, { opacity: 1 });
  }
  _disableScroll() {
    c.addClass(document.body, "overflow-y-hidden relative"), document.documentElement.scrollHeight > document.documentElement.clientHeight && c.addClass(document.body, "md:pr-[17px]");
  }
  _enableScroll() {
    setTimeout(() => {
      c.removeClass(document.body, "overflow-y-hidden relative"), c.removeClass(document.body, "md:pr-[17px]");
    }, 300);
  }
  _animationStart() {
    this._animating = !0, setTimeout(() => {
      this._animating = !1;
    }, 400);
  }
  _restoreDefaultZoom() {
    this._zoom !== 1 && (this._zoom = 1, c.style(this.currentImg.parentNode, {
      transform: `scale(${this._zoom})`
    }), this._updateZoomBtn(), this._updateImgPosition());
  }
  _restoreDefaultFullscreen() {
    this._fullscreen && this.toggleFullscreen();
  }
  _restoreDefaultPosition() {
    clearTimeout(this._zoomTimer);
    const t = this.currentImg;
    c.style(this.currentImg.parentNode, { left: 0, top: 0 }), c.style(this.currentImg, {
      transition: "all 0.5s ease-out",
      left: 0,
      top: 0
    }), this._calculateImgSize(t), setTimeout(() => {
      c.style(this.currentImg, { transition: "none" });
    }, 500);
  }
  async _triggerEvents(t, e) {
    h.trigger(this._element, `${t}.te.lightbox`), e && await setTimeout(() => {
      h.trigger(this._element, `${e}.te.lightbox`);
    }, 505);
  }
  static getInstance(t) {
    return I.getData(t, vi);
  }
  static getOrCreateInstance(t, e = {}) {
    return this.getInstance(t) || new this(t, typeof e == "object" ? e : null);
  }
  static toggle() {
    return function(t) {
      const e = d.closest(
        t.target,
        `${Oc}`
      );
      (Ls.getInstance(e) || new Ls(e)).open(t);
    };
  }
  static jQueryInterface(t, e) {
    return this.each(function() {
      let i = I.getData(this, vi);
      const n = typeof t == "object" && t;
      if (!(!i && /dispose/.test(t)) && (i || (i = new Ls(this, n)), typeof t == "string")) {
        if (typeof i[t] > "u")
          throw new TypeError(`No method named "${t}"`);
        i[t](e);
      }
    });
  }
}
const y0 = (s, t = "hide") => {
  const e = `click.dismiss${s.EVENT_KEY}`, i = s.NAME;
  h.on(
    document,
    e,
    `[data-te-${i}-dismiss]`,
    function(n) {
      if (["A", "AREA"].includes(this.tagName) && n.preventDefault(), me(this))
        return;
      const o = Qt(this) || this.closest(`.${i}`) || this.closest(`[data-te-${i}-init]`);
      if (!o)
        return;
      s.getOrCreateInstance(o)[t]();
    }
  );
}, w0 = (s) => {
  il(() => {
    const t = el();
    if (t) {
      const e = s.NAME, i = t.fn[e];
      t.fn[e] = s.jQueryInterface, t.fn[e].Constructor = s, t.fn[e].noConflict = () => (t.fn[e] = i, s.jQueryInterface);
    }
  });
}, x0 = (s, t) => {
  h.on(
    document,
    `click.te.${s.NAME}`,
    t,
    function(e) {
      e.preventDefault(), s.getOrCreateInstance(this).toggle();
    }
  );
}, k0 = (s, t) => {
  h.on(
    document,
    `click.te.${s.NAME}.data-api`,
    t,
    function(e) {
      if (["A", "AREA"].includes(this.tagName) && e.preventDefault(), me(this))
        return;
      s.getOrCreateInstance(this).show();
    }
  );
}, O0 = (s, t) => {
  h.on(
    document,
    `click.te.${s.NAME}.data-api`,
    t,
    function(e) {
      const i = Qt(this);
      if (["A", "AREA"].includes(this.tagName) && e.preventDefault(), me(this))
        return;
      h.one(i, s.EVENT_HIDDEN, () => {
        Lt(this) && this.focus();
      });
      const n = d.findOne(s.OPEN_SELECTOR);
      n && n !== i && s.getInstance(n).hide(), s.getOrCreateInstance(i).toggle(this);
    }
  );
}, S0 = (s, t) => {
  h.on(
    document,
    `click.te.${s.NAME}`,
    t,
    (e) => {
      e.preventDefault();
      const i = e.target.closest(t);
      s.getOrCreateInstance(i).toggle();
    }
  );
}, I0 = (s, t) => {
  h.on(
    document,
    `click.te.${s.NAME}`,
    t,
    function(e) {
      const i = Qt(this);
      ["A", "AREA"].includes(this.tagName) && e.preventDefault(), h.one(i, s.EVENT_SHOW, (r) => {
        r.defaultPrevented || h.one(i, s.EVENT_HIDDEN, () => {
          Lt(this) && this.focus();
        });
      });
      const n = d.findOne(
        `[${s.OPEN_SELECTOR}="true"]`
      );
      n && s.getInstance(n).hide(), s.getOrCreateInstance(i).toggle(this);
    }
  );
}, D0 = (s, t) => {
  h.one(
    document,
    "mousedown",
    t,
    s.autoInitial(new s())
  );
}, $0 = (s, t) => {
  h.on(
    document,
    `click.te.${s.NAME}.data-api`,
    t,
    function(e) {
      (e.target.tagName === "A" || e.delegateTarget && e.delegateTarget.tagName === "A") && e.preventDefault();
      const i = fo(this);
      d.find(i).forEach((o) => {
        s.getOrCreateInstance(o, { toggle: !1 }).toggle();
      });
    }
  );
}, L0 = (s, t) => {
  [].slice.call(
    document.querySelectorAll(t)
  ).map(function(i) {
    return new s(i);
  });
}, M0 = (s, t) => {
  [].slice.call(
    document.querySelectorAll(t)
  ).map(function(i) {
    return new s(i);
  });
}, N0 = (s, t) => {
  d.find(t).forEach((e) => {
    new s(e);
  }), h.on(
    document,
    `click.te.${s.NAME}.data-api`,
    `${t} img:not([data-te-lightbox-disabled])`,
    s.toggle()
  );
}, R0 = (s, t) => {
  const e = (o) => o[0] === "{" && o[o.length - 1] === "}" || o[0] === "[" && o[o.length - 1] === "]", i = (o) => typeof o != "string" ? o : e(o) ? JSON.parse(o.replace(/'/g, '"')) : o, n = (o) => {
    const r = {};
    return Object.keys(o).forEach((a) => {
      if (a.match(/dataset.*/)) {
        const l = a.slice(7, 8).toLowerCase().concat(a.slice(8));
        r[l] = i(o[a]);
      }
    }), r;
  };
  d.find(t).forEach((o) => {
    if (c.getDataAttribute(o, "chart") !== "bubble" && c.getDataAttribute(o, "chart") !== "scatter") {
      const r = c.getDataAttributes(o), a = {
        data: {
          datasets: [n(r)]
        }
      };
      return r.chart && (a.type = r.chart), r.labels && (a.data.labels = JSON.parse(r.labels.replace(/'/g, '"'))), new s(o, {
        ...a,
        ...mi[a.type]
      });
    }
    return null;
  });
};
class P0 {
  constructor() {
    this.inits = [];
  }
  get initialized() {
    return this.inits;
  }
  isInited(t) {
    return this.inits.includes(t);
  }
  add(t) {
    this.inits.push(t);
  }
}
const _o = new P0(), Ti = {
  alert: {
    name: "Alert",
    selector: "[data-te-alert-init]",
    isToggler: !1,
    dismissMethod: "close"
  },
  animation: {
    name: "Animate",
    selector: "[data-te-animation-init]",
    isToggler: !1
  },
  carousel: {
    name: "Carousel",
    selector: "[data-te-carousel-init]",
    isToggler: !1
  },
  chips: {
    name: "ChipsInput",
    selector: "[data-te-chips-input-init]",
    isToggler: !1
  },
  chip: {
    name: "Chip",
    selector: "[data-te-chip-init]",
    isToggler: !1,
    onInit: "init"
  },
  datepicker: {
    name: "Datepicker",
    selector: "[data-te-datepicker-init]",
    isToggler: !1
  },
  input: {
    name: "Input",
    selector: "[data-te-input-wrapper-init]",
    isToggler: !1
  },
  perfectScrollbar: {
    name: "PerfectScrollbar",
    selector: "[data-te-perfect-scrollbar-init]",
    isToggler: !1
  },
  rating: {
    name: "Rating",
    selector: "[data-te-rating-init]",
    isToggler: !1
  },
  scrollspy: {
    name: "ScrollSpy",
    selector: "[data-te-spy='scroll']",
    isToggler: !1
  },
  select: {
    name: "Select",
    selector: "[data-te-select-init]",
    isToggler: !1
  },
  sidenav: {
    name: "Sidenav",
    selector: "[data-te-sidenav-init]",
    isToggler: !1
  },
  stepper: {
    name: "Stepper",
    selector: "[data-te-stepper-init]",
    isToggler: !1
  },
  timepicker: {
    name: "Timepicker",
    selector: "[data-te-timepicker-init]",
    isToggler: !1
  },
  toast: {
    name: "Toast",
    selector: "[data-te-toast-init]",
    isToggler: !1,
    dismissMethod: "hide"
  },
  datatable: {
    name: "Datatable",
    selector: "[data-te-datatable-init]"
  },
  popconfirm: {
    name: "Popconfirm",
    selector: "[data-te-toggle='popconfirm']"
  },
  // advancedInits
  chart: {
    name: "Chart",
    selector: "[data-te-chart]",
    isToggler: !1,
    advanced: R0
  },
  // togglers
  button: {
    name: "Button",
    selector: "[data-te-toggle='button']",
    isToggler: !0,
    callback: S0
  },
  collapse: {
    name: "Collapse",
    selector: "[data-te-collapse-init]",
    isToggler: !0,
    callback: $0
  },
  dropdown: {
    name: "Dropdown",
    selector: "[data-te-dropdown-toggle-ref]",
    isToggler: !0,
    callback: x0
  },
  modal: {
    name: "Modal",
    selector: "[data-te-toggle='modal']",
    dismissMethod: "hide",
    isToggler: !0,
    callback: I0
  },
  ripple: {
    name: "Ripple",
    selector: "[data-te-ripple-init]",
    isToggler: !0,
    callback: D0
  },
  offcanvas: {
    name: "Offcanvas",
    selector: "[data-te-offcanvas-toggle]",
    dismissMethod: "hide",
    isToggler: !0,
    callback: O0
  },
  tab: {
    name: "Tab",
    selector: "[data-te-toggle='tab'], [data-te-toggle='pill'], [data-te-toggle='list']",
    isToggler: !0,
    callback: k0
  },
  tooltip: {
    name: "Tooltip",
    selector: "[data-te-toggle='tooltip']",
    isToggler: !1,
    callback: L0
  },
  popover: {
    name: "Popover",
    selector: "[data-te-toggle='popover']",
    isToggler: !0,
    callback: M0
  },
  lightbox: {
    name: "Lightbox",
    selector: "[data-te-lightbox-init]",
    isToggler: !0,
    callback: N0
  }
}, B0 = (s) => Ti[s.NAME] || null, H0 = (s) => {
  if (!s || _o.isInited(s.NAME))
    return;
  _o.add(s.NAME);
  const t = B0(s), e = (t == null ? void 0 : t.isToggler) || !1;
  if (w0(s), t != null && t.dismissMethod && y0(s, t.dismissMethod), t != null && t.advanced) {
    t == null || t.advanced(s, t == null ? void 0 : t.selector);
    return;
  }
  if (e) {
    t == null || t.callback(s, t == null ? void 0 : t.selector);
    return;
  }
  d.find(t == null ? void 0 : t.selector).forEach((i) => {
    let n = s.getInstance(i);
    n || (n = new s(i), t != null && t.onInit && n[t.onInit]());
  });
}, W0 = (s) => {
  s.forEach((t) => H0(t));
}, U0 = (s, t = !1) => {
  const e = Object.keys(Ti).map((i) => {
    if (!!document.querySelector(Ti[i].selector)) {
      const o = s[Ti[i].name];
      return !o && !_o.isInited(i) && t && console.warn(
        `Please import ${Ti[i].name} from "tw-elements" package and add it to a object parameter inside "initTE" function`
      ), o;
    }
  });
  W0(e);
};

//# sourceMappingURL=tw-elements.es.min.js.map


/***/ }),

/***/ "./node_modules/axios/package.json":
/*!*****************************************!*\
  !*** ./node_modules/axios/package.json ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"axios","version":"0.21.4","description":"Promise based HTTP client for the browser and node.js","main":"index.js","scripts":{"test":"grunt test","start":"node ./sandbox/server.js","build":"NODE_ENV=production grunt build","preversion":"npm test","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json","postversion":"git push && git push --tags","examples":"node ./examples/server.js","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","fix":"eslint --fix lib/**/*.js"},"repository":{"type":"git","url":"https://github.com/axios/axios.git"},"keywords":["xhr","http","ajax","promise","node"],"author":"Matt Zabriskie","license":"MIT","bugs":{"url":"https://github.com/axios/axios/issues"},"homepage":"https://axios-http.com","devDependencies":{"coveralls":"^3.0.0","es6-promise":"^4.2.4","grunt":"^1.3.0","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^23.0.0","grunt-karma":"^4.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^4.0.2","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^6.3.2","karma-chrome-launcher":"^3.1.0","karma-firefox-launcher":"^2.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^4.3.6","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.8","karma-webpack":"^4.0.2","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","mocha":"^8.2.1","sinon":"^4.5.0","terser-webpack-plugin":"^4.2.3","typescript":"^4.0.5","url-search-params":"^0.10.0","webpack":"^4.44.2","webpack-dev-server":"^3.11.0"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"jsdelivr":"dist/axios.min.js","unpkg":"dist/axios.min.js","typings":"./index.d.ts","dependencies":{"follow-redirects":"^1.14.0"},"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}]}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames not based on template
/******/ 			if ({"node_modules_tw-elements_dist_js_chart_es_js":1,"node_modules_tw-elements_dist_js_chartjs-plugin-datalabels_es_js":1}[chunkId]) return "js/" + chunkId + ".js";
/******/ 			// return url for filenames based on template
/******/ 			return undefined;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.miniCssF = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".css";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		// data-webpack is not used as build has no uniqueName
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 		
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "/";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/js/app": 0,
/******/ 			"css/app": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if("css/app" != chunkId) {
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						} else installedChunks[chunkId] = 0;
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["css/app"], () => (__webpack_require__("./resources/js/app.js")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["css/app"], () => (__webpack_require__("./resources/css/app.css")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;