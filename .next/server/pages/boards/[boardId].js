(() => {
var exports = {};
exports.id = "pages/boards/[boardId]";
exports.ids = ["pages/boards/[boardId]"];
exports.modules = {

/***/ "./node_modules/next/dist/client/normalize-trailing-slash.js":
/*!*******************************************************************!*\
  !*** ./node_modules/next/dist/client/normalize-trailing-slash.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.removePathTrailingSlash = removePathTrailingSlash;
exports.normalizePathTrailingSlash = void 0;

function removePathTrailingSlash(path) {
  return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
}

const normalizePathTrailingSlash =  false ? 0 : removePathTrailingSlash;
exports.normalizePathTrailingSlash = normalizePathTrailingSlash;

/***/ }),

/***/ "./node_modules/next/dist/client/request-idle-callback.js":
/*!****************************************************************!*\
  !*** ./node_modules/next/dist/client/request-idle-callback.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.requestIdleCallback = exports.cancelIdleCallback = void 0;

const requestIdleCallback = typeof self !== 'undefined' && self.requestIdleCallback && self.requestIdleCallback.bind(window) || function (cb) {
  let start = Date.now();
  return setTimeout(function () {
    cb({
      didTimeout: false,
      timeRemaining: function () {
        return Math.max(0, 50 - (Date.now() - start));
      }
    });
  }, 1);
};

exports.requestIdleCallback = requestIdleCallback;

const cancelIdleCallback = typeof self !== 'undefined' && self.cancelIdleCallback && self.cancelIdleCallback.bind(window) || function (id) {
  return clearTimeout(id);
};

exports.cancelIdleCallback = cancelIdleCallback;

/***/ }),

/***/ "./node_modules/next/dist/client/route-loader.js":
/*!*******************************************************!*\
  !*** ./node_modules/next/dist/client/route-loader.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.markAssetError = markAssetError;
exports.isAssetError = isAssetError;
exports.getClientBuildManifest = getClientBuildManifest;
exports.createRouteLoader = createRouteLoader;

var _getAssetPathFromRoute = _interopRequireDefault(__webpack_require__(/*! ../shared/lib/router/utils/get-asset-path-from-route */ "../shared/lib/router/utils/get-asset-path-from-route"));

var _requestIdleCallback = __webpack_require__(/*! ./request-idle-callback */ "./node_modules/next/dist/client/request-idle-callback.js");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
} // 3.8s was arbitrarily chosen as it's what https://web.dev/interactive
// considers as "Good" time-to-interactive. We must assume something went
// wrong beyond this point, and then fall-back to a full page transition to
// show the user something of value.


const MS_MAX_IDLE_DELAY = 3800;

function withFuture(key, map, generator) {
  let entry = map.get(key);

  if (entry) {
    if ('future' in entry) {
      return entry.future;
    }

    return Promise.resolve(entry);
  }

  let resolver;
  const prom = new Promise(resolve => {
    resolver = resolve;
  });
  map.set(key, entry = {
    resolve: resolver,
    future: prom
  });
  return generator ? generator().then(value => (resolver(value), value)) : prom;
}

function hasPrefetch(link) {
  try {
    link = document.createElement('link');
    return (// detect IE11 since it supports prefetch but isn't detected
      // with relList.support
      !!window.MSInputMethodContext && !!document.documentMode || link.relList.supports('prefetch')
    );
  } catch (e) {
    return false;
  }
}

const canPrefetch = hasPrefetch();

function prefetchViaDom(href, as, link) {
  return new Promise((res, rej) => {
    if (document.querySelector(`link[rel="prefetch"][href^="${href}"]`)) {
      return res();
    }

    link = document.createElement('link'); // The order of property assignment here is intentional:

    if (as) link.as = as;
    link.rel = `prefetch`;
    link.crossOrigin = undefined;
    link.onload = res;
    link.onerror = rej; // `href` should always be last:

    link.href = href;
    document.head.appendChild(link);
  });
}

const ASSET_LOAD_ERROR = Symbol('ASSET_LOAD_ERROR');

function markAssetError(err) {
  return Object.defineProperty(err, ASSET_LOAD_ERROR, {});
}

function isAssetError(err) {
  return err && ASSET_LOAD_ERROR in err;
}

function appendScript(src, script) {
  return new Promise((resolve, reject) => {
    script = document.createElement('script'); // The order of property assignment here is intentional.
    // 1. Setup success/failure hooks in case the browser synchronously
    //    executes when `src` is set.

    script.onload = resolve;

    script.onerror = () => reject(markAssetError(new Error(`Failed to load script: ${src}`))); // 2. Configure the cross-origin attribute before setting `src` in case the
    //    browser begins to fetch.


    script.crossOrigin = undefined; // 3. Finally, set the source and inject into the DOM in case the child
    //    must be appended for fetching to start.

    script.src = src;
    document.body.appendChild(script);
  });
} // We wait for pages to be built in dev before we start the route transition
// timeout to prevent an un-necessary hard navigation in development.


let devBuildPromise; // Resolve a promise that times out after given amount of milliseconds.

function resolvePromiseWithTimeout(p, ms, err) {
  return new Promise((resolve, reject) => {
    let cancelled = false;
    p.then(r => {
      // Resolved, cancel the timeout
      cancelled = true;
      resolve(r);
    }).catch(reject); // We wrap these checks separately for better dead-code elimination in
    // production bundles.

    if (true) {
      (devBuildPromise || Promise.resolve()).then(() => {
        (0, _requestIdleCallback).requestIdleCallback(() => setTimeout(() => {
          if (!cancelled) {
            reject(err);
          }
        }, ms));
      });
    }

    if (false) {}
  });
}

function getClientBuildManifest() {
  if (self.__BUILD_MANIFEST) {
    return Promise.resolve(self.__BUILD_MANIFEST);
  }

  const onBuildManifest = new Promise(resolve => {
    // Mandatory because this is not concurrent safe:
    const cb = self.__BUILD_MANIFEST_CB;

    self.__BUILD_MANIFEST_CB = () => {
      resolve(self.__BUILD_MANIFEST);
      cb && cb();
    };
  });
  return resolvePromiseWithTimeout(onBuildManifest, MS_MAX_IDLE_DELAY, markAssetError(new Error('Failed to load client build manifest')));
}

function getFilesForRoute(assetPrefix, route) {
  if (true) {
    return Promise.resolve({
      scripts: [assetPrefix + '/_next/static/chunks/pages' + encodeURI((0, _getAssetPathFromRoute).default(route, '.js'))],
      // Styles are handled by `style-loader` in development:
      css: []
    });
  }

  return getClientBuildManifest().then(manifest => {
    if (!(route in manifest)) {
      throw markAssetError(new Error(`Failed to lookup route: ${route}`));
    }

    const allFiles = manifest[route].map(entry => assetPrefix + '/_next/' + encodeURI(entry));
    return {
      scripts: allFiles.filter(v => v.endsWith('.js')),
      css: allFiles.filter(v => v.endsWith('.css'))
    };
  });
}

function createRouteLoader(assetPrefix) {
  const entrypoints = new Map();
  const loadedScripts = new Map();
  const styleSheets = new Map();
  const routes = new Map();

  function maybeExecuteScript(src) {
    let prom = loadedScripts.get(src);

    if (prom) {
      return prom;
    } // Skip executing script if it's already in the DOM:


    if (document.querySelector(`script[src^="${src}"]`)) {
      return Promise.resolve();
    }

    loadedScripts.set(src, prom = appendScript(src));
    return prom;
  }

  function fetchStyleSheet(href) {
    let prom = styleSheets.get(href);

    if (prom) {
      return prom;
    }

    styleSheets.set(href, prom = fetch(href).then(res => {
      if (!res.ok) {
        throw new Error(`Failed to load stylesheet: ${href}`);
      }

      return res.text().then(text => ({
        href: href,
        content: text
      }));
    }).catch(err => {
      throw markAssetError(err);
    }));
    return prom;
  }

  return {
    whenEntrypoint(route) {
      return withFuture(route, entrypoints);
    },

    onEntrypoint(route, execute) {
      Promise.resolve(execute).then(fn => fn()).then(exports => ({
        component: exports && exports.default || exports,
        exports: exports
      }), err => ({
        error: err
      })).then(input => {
        const old = entrypoints.get(route);
        entrypoints.set(route, input);
        if (old && 'resolve' in old) old.resolve(input);
      });
    },

    loadRoute(route, prefetch) {
      return withFuture(route, routes, () => {
        const routeFilesPromise = getFilesForRoute(assetPrefix, route).then(({
          scripts,
          css
        }) => {
          return Promise.all([entrypoints.has(route) ? [] : Promise.all(scripts.map(maybeExecuteScript)), Promise.all(css.map(fetchStyleSheet))]);
        }).then(res => {
          return this.whenEntrypoint(route).then(entrypoint => ({
            entrypoint,
            styles: res[1]
          }));
        });

        if (true) {
          devBuildPromise = new Promise(resolve => {
            if (routeFilesPromise) {
              return routeFilesPromise.finally(() => {
                resolve();
              });
            }
          });
        }

        return resolvePromiseWithTimeout(routeFilesPromise, MS_MAX_IDLE_DELAY, markAssetError(new Error(`Route did not complete loading: ${route}`))).then(({
          entrypoint,
          styles
        }) => {
          const res = Object.assign({
            styles: styles
          }, entrypoint);
          return 'error' in entrypoint ? entrypoint : res;
        }).catch(err => {
          if (prefetch) {
            // we don't want to cache errors during prefetch
            throw err;
          }

          return {
            error: err
          };
        });
      });
    },

    prefetch(route) {
      // https://github.com/GoogleChromeLabs/quicklink/blob/453a661fa1fa940e2d2e044452398e38c67a98fb/src/index.mjs#L115-L118
      // License: Apache 2.0
      let cn;

      if (cn = navigator.connection) {
        // Don't prefetch if using 2G or if Save-Data is enabled.
        if (cn.saveData || /2g/.test(cn.effectiveType)) return Promise.resolve();
      }

      return getFilesForRoute(assetPrefix, route).then(output => Promise.all(canPrefetch ? output.scripts.map(script => prefetchViaDom(script, 'script')) : [])).then(() => {
        (0, _requestIdleCallback).requestIdleCallback(() => this.loadRoute(route, true).catch(() => {}));
      }).catch( // swallow prefetch errors
      () => {});
    }

  };
}

/***/ }),

/***/ "./node_modules/next/dist/client/router.js":
/*!*************************************************!*\
  !*** ./node_modules/next/dist/client/router.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "Router", ({
  enumerable: true,
  get: function () {
    return _router.default;
  }
}));
Object.defineProperty(exports, "withRouter", ({
  enumerable: true,
  get: function () {
    return _withRouter.default;
  }
}));
exports.useRouter = useRouter;
exports.createRouter = createRouter;
exports.makePublicRouterInstance = makePublicRouterInstance;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));

var _router = _interopRequireDefault(__webpack_require__(/*! ../shared/lib/router/router */ "./node_modules/next/dist/shared/lib/router/router.js"));

var _routerContext = __webpack_require__(/*! ../shared/lib/router-context */ "../shared/lib/router-context");

var _withRouter = _interopRequireDefault(__webpack_require__(/*! ./with-router */ "./node_modules/next/dist/client/with-router.js"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

const singletonRouter = {
  router: null,
  readyCallbacks: [],

  ready(cb) {
    if (this.router) return cb();

    if (false) {}
  }

}; // Create public properties and methods of the router in the singletonRouter

const urlPropertyFields = ['pathname', 'route', 'query', 'asPath', 'components', 'isFallback', 'basePath', 'locale', 'locales', 'defaultLocale', 'isReady', 'isPreview', 'isLocaleDomain', 'domainLocales'];
const routerEvents = ['routeChangeStart', 'beforeHistoryChange', 'routeChangeComplete', 'routeChangeError', 'hashChangeStart', 'hashChangeComplete'];
const coreMethodFields = ['push', 'replace', 'reload', 'back', 'prefetch', 'beforePopState']; // Events is a static property on the router, the router doesn't have to be initialized to use it

Object.defineProperty(singletonRouter, 'events', {
  get() {
    return _router.default.events;
  }

});
urlPropertyFields.forEach(field => {
  // Here we need to use Object.defineProperty because we need to return
  // the property assigned to the actual router
  // The value might get changed as we change routes and this is the
  // proper way to access it
  Object.defineProperty(singletonRouter, field, {
    get() {
      const router = getRouter();
      return router[field];
    }

  });
});
coreMethodFields.forEach(field => {
  singletonRouter[field] = (...args) => {
    const router = getRouter();
    return router[field](...args);
  };
});
routerEvents.forEach(event => {
  singletonRouter.ready(() => {
    _router.default.events.on(event, (...args) => {
      const eventField = `on${event.charAt(0).toUpperCase()}${event.substring(1)}`;
      const _singletonRouter = singletonRouter;

      if (_singletonRouter[eventField]) {
        try {
          _singletonRouter[eventField](...args);
        } catch (err) {
          console.error(`Error when running the Router event: ${eventField}`);
          console.error(`${err.message}\n${err.stack}`);
        }
      }
    });
  });
});

function getRouter() {
  if (!singletonRouter.router) {
    const message = 'No router instance found.\n' + 'You should only use "next/router" on the client side of your app.\n';
    throw new Error(message);
  }

  return singletonRouter.router;
}

var _default = singletonRouter;
exports.default = _default;

function useRouter() {
  return _react.default.useContext(_routerContext.RouterContext);
}

function createRouter(...args) {
  singletonRouter.router = new _router.default(...args);
  singletonRouter.readyCallbacks.forEach(cb => cb());
  singletonRouter.readyCallbacks = [];
  return singletonRouter.router;
}

function makePublicRouterInstance(router) {
  const _router1 = router;
  const instance = {};

  for (const property of urlPropertyFields) {
    if (typeof _router1[property] === 'object') {
      instance[property] = Object.assign(Array.isArray(_router1[property]) ? [] : {}, _router1[property]) // makes sure query is not stateful
      ;
      continue;
    }

    instance[property] = _router1[property];
  } // Events is a static property on the router, the router doesn't have to be initialized to use it


  instance.events = _router.default.events;
  coreMethodFields.forEach(field => {
    instance[field] = (...args) => {
      return _router1[field](...args);
    };
  });
  return instance;
}

/***/ }),

/***/ "./node_modules/next/dist/client/with-router.js":
/*!******************************************************!*\
  !*** ./node_modules/next/dist/client/with-router.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = withRouter;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));

var _router = __webpack_require__(/*! ./router */ "./node_modules/next/dist/client/router.js");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function withRouter(ComposedComponent) {
  function WithRouterWrapper(props) {
    return /*#__PURE__*/_react.default.createElement(ComposedComponent, Object.assign({
      router: (0, _router).useRouter()
    }, props));
  }

  WithRouterWrapper.getInitialProps = ComposedComponent.getInitialProps;
  WithRouterWrapper.origGetInitialProps = ComposedComponent.origGetInitialProps;

  if (true) {
    const name = ComposedComponent.displayName || ComposedComponent.name || 'Unknown';
    WithRouterWrapper.displayName = `withRouter(${name})`;
  }

  return WithRouterWrapper;
}

/***/ }),

/***/ "./node_modules/next/dist/shared/lib/router/router.js":
/*!************************************************************!*\
  !*** ./node_modules/next/dist/shared/lib/router/router.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getDomainLocale = getDomainLocale;
exports.addLocale = addLocale;
exports.delLocale = delLocale;
exports.hasBasePath = hasBasePath;
exports.addBasePath = addBasePath;
exports.delBasePath = delBasePath;
exports.isLocalURL = isLocalURL;
exports.interpolateAs = interpolateAs;
exports.resolveHref = resolveHref;
exports.default = void 0;

var _normalizeTrailingSlash = __webpack_require__(/*! ../../../client/normalize-trailing-slash */ "./node_modules/next/dist/client/normalize-trailing-slash.js");

var _routeLoader = __webpack_require__(/*! ../../../client/route-loader */ "./node_modules/next/dist/client/route-loader.js");

var _denormalizePagePath = __webpack_require__(/*! ../../../server/denormalize-page-path */ "../../../server/denormalize-page-path");

var _normalizeLocalePath = __webpack_require__(/*! ../i18n/normalize-locale-path */ "../i18n/normalize-locale-path");

var _mitt = _interopRequireDefault(__webpack_require__(/*! ../mitt */ "../mitt"));

var _utils = __webpack_require__(/*! ../utils */ "../shared/lib/utils");

var _isDynamic = __webpack_require__(/*! ./utils/is-dynamic */ "./utils/is-dynamic");

var _parseRelativeUrl = __webpack_require__(/*! ./utils/parse-relative-url */ "./utils/parse-relative-url");

var _querystring = __webpack_require__(/*! ./utils/querystring */ "./utils/querystring");

var _resolveRewrites = _interopRequireDefault(__webpack_require__(/*! ./utils/resolve-rewrites */ "?5c99"));

var _routeMatcher = __webpack_require__(/*! ./utils/route-matcher */ "./utils/route-matcher");

var _routeRegex = __webpack_require__(/*! ./utils/route-regex */ "./utils/route-regex");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

let detectDomainLocale;

if (false) {}

const basePath =  false || '';

function buildCancellationError() {
  return Object.assign(new Error('Route Cancelled'), {
    cancelled: true
  });
}

function addPathPrefix(path, prefix) {
  return prefix && path.startsWith('/') ? path === '/' ? (0, _normalizeTrailingSlash).normalizePathTrailingSlash(prefix) : `${prefix}${pathNoQueryHash(path) === '/' ? path.substring(1) : path}` : path;
}

function getDomainLocale(path, locale, locales, domainLocales) {
  if (false) {} else {
    return false;
  }
}

function addLocale(path, locale, defaultLocale) {
  if (false) {}

  return path;
}

function delLocale(path, locale) {
  if (false) {}

  return path;
}

function pathNoQueryHash(path) {
  const queryIndex = path.indexOf('?');
  const hashIndex = path.indexOf('#');

  if (queryIndex > -1 || hashIndex > -1) {
    path = path.substring(0, queryIndex > -1 ? queryIndex : hashIndex);
  }

  return path;
}

function hasBasePath(path) {
  path = pathNoQueryHash(path);
  return path === basePath || path.startsWith(basePath + '/');
}

function addBasePath(path) {
  // we only add the basepath on relative urls
  return addPathPrefix(path, basePath);
}

function delBasePath(path) {
  path = path.slice(basePath.length);
  if (!path.startsWith('/')) path = `/${path}`;
  return path;
}

function isLocalURL(url) {
  // prevent a hydration mismatch on href for url with anchor refs
  if (url.startsWith('/') || url.startsWith('#') || url.startsWith('?')) return true;

  try {
    // absolute urls can be local if they are on the same origin
    const locationOrigin = (0, _utils).getLocationOrigin();
    const resolved = new URL(url, locationOrigin);
    return resolved.origin === locationOrigin && hasBasePath(resolved.pathname);
  } catch (_) {
    return false;
  }
}

function interpolateAs(route, asPathname, query) {
  let interpolatedRoute = '';
  const dynamicRegex = (0, _routeRegex).getRouteRegex(route);
  const dynamicGroups = dynamicRegex.groups;
  const dynamicMatches = // Try to match the dynamic route against the asPath
  (asPathname !== route ? (0, _routeMatcher).getRouteMatcher(dynamicRegex)(asPathname) : '') || // Fall back to reading the values from the href
  // TODO: should this take priority; also need to change in the router.
  query;
  interpolatedRoute = route;
  const params = Object.keys(dynamicGroups);

  if (!params.every(param => {
    let value = dynamicMatches[param] || '';
    const {
      repeat,
      optional
    } = dynamicGroups[param]; // support single-level catch-all
    // TODO: more robust handling for user-error (passing `/`)

    let replaced = `[${repeat ? '...' : ''}${param}]`;

    if (optional) {
      replaced = `${!value ? '/' : ''}[${replaced}]`;
    }

    if (repeat && !Array.isArray(value)) value = [value];
    return (optional || param in dynamicMatches) && (interpolatedRoute = interpolatedRoute.replace(replaced, repeat ? value.map( // these values should be fully encoded instead of just
    // path delimiter escaped since they are being inserted
    // into the URL and we expect URL encoded segments
    // when parsing dynamic route params
    segment => encodeURIComponent(segment)).join('/') : encodeURIComponent(value)) || '/');
  })) {
    interpolatedRoute = '' // did not satisfy all requirements
    ; // n.b. We ignore this error because we handle warning for this case in
    // development in the `<Link>` component directly.
  }

  return {
    params,
    result: interpolatedRoute
  };
}

function omitParmsFromQuery(query, params) {
  const filteredQuery = {};
  Object.keys(query).forEach(key => {
    if (!params.includes(key)) {
      filteredQuery[key] = query[key];
    }
  });
  return filteredQuery;
}

function resolveHref(router, href, resolveAs) {
  // we use a dummy base url for relative urls
  let base;
  let urlAsString = typeof href === 'string' ? href : (0, _utils).formatWithValidation(href); // repeated slashes and backslashes in the URL are considered
  // invalid and will never match a Next.js page/file

  const urlProtoMatch = urlAsString.match(/^[a-zA-Z]{1,}:\/\//);
  const urlAsStringNoProto = urlProtoMatch ? urlAsString.substr(urlProtoMatch[0].length) : urlAsString;
  const urlParts = urlAsStringNoProto.split('?');

  if ((urlParts[0] || '').match(/(\/\/|\\)/)) {
    console.error(`Invalid href passed to next/router: ${urlAsString}, repeated forward-slashes (//) or backslashes \\ are not valid in the href`);
    const normalizedUrl = (0, _utils).normalizeRepeatedSlashes(urlAsStringNoProto);
    urlAsString = (urlProtoMatch ? urlProtoMatch[0] : '') + normalizedUrl;
  } // Return because it cannot be routed by the Next.js router


  if (!isLocalURL(urlAsString)) {
    return resolveAs ? [urlAsString] : urlAsString;
  }

  try {
    base = new URL(urlAsString.startsWith('#') ? router.asPath : router.pathname, 'http://n');
  } catch (_) {
    // fallback to / for invalid asPath values e.g. //
    base = new URL('/', 'http://n');
  }

  try {
    const finalUrl = new URL(urlAsString, base);
    finalUrl.pathname = (0, _normalizeTrailingSlash).normalizePathTrailingSlash(finalUrl.pathname);
    let interpolatedAs = '';

    if ((0, _isDynamic).isDynamicRoute(finalUrl.pathname) && finalUrl.searchParams && resolveAs) {
      const query = (0, _querystring).searchParamsToUrlQuery(finalUrl.searchParams);
      const {
        result,
        params
      } = interpolateAs(finalUrl.pathname, finalUrl.pathname, query);

      if (result) {
        interpolatedAs = (0, _utils).formatWithValidation({
          pathname: result,
          hash: finalUrl.hash,
          query: omitParmsFromQuery(query, params)
        });
      }
    } // if the origin didn't change, it means we received a relative href


    const resolvedHref = finalUrl.origin === base.origin ? finalUrl.href.slice(finalUrl.origin.length) : finalUrl.href;
    return resolveAs ? [resolvedHref, interpolatedAs || resolvedHref] : resolvedHref;
  } catch (_) {
    return resolveAs ? [urlAsString] : urlAsString;
  }
}

function stripOrigin(url) {
  const origin = (0, _utils).getLocationOrigin();
  return url.startsWith(origin) ? url.substring(origin.length) : url;
}

function prepareUrlAs(router, url, as) {
  // If url and as provided as an object representation,
  // we'll format them into the string version here.
  let [resolvedHref, resolvedAs] = resolveHref(router, url, true);
  const origin = (0, _utils).getLocationOrigin();
  const hrefHadOrigin = resolvedHref.startsWith(origin);
  const asHadOrigin = resolvedAs && resolvedAs.startsWith(origin);
  resolvedHref = stripOrigin(resolvedHref);
  resolvedAs = resolvedAs ? stripOrigin(resolvedAs) : resolvedAs;
  const preparedUrl = hrefHadOrigin ? resolvedHref : addBasePath(resolvedHref);
  const preparedAs = as ? stripOrigin(resolveHref(router, as)) : resolvedAs || resolvedHref;
  return {
    url: preparedUrl,
    as: asHadOrigin ? preparedAs : addBasePath(preparedAs)
  };
}

function resolveDynamicRoute(pathname, pages) {
  const cleanPathname = (0, _normalizeTrailingSlash).removePathTrailingSlash((0, _denormalizePagePath).denormalizePagePath(pathname));

  if (cleanPathname === '/404' || cleanPathname === '/_error') {
    return pathname;
  } // handle resolving href for dynamic routes


  if (!pages.includes(cleanPathname)) {
    // eslint-disable-next-line array-callback-return
    pages.some(page => {
      if ((0, _isDynamic).isDynamicRoute(page) && (0, _routeRegex).getRouteRegex(page).re.test(cleanPathname)) {
        pathname = page;
        return true;
      }
    });
  }

  return (0, _normalizeTrailingSlash).removePathTrailingSlash(pathname);
}

const manualScrollRestoration =  false && 0;
const SSG_DATA_NOT_FOUND = Symbol('SSG_DATA_NOT_FOUND');

function fetchRetry(url, attempts) {
  return fetch(url, {
    // Cookies are required to be present for Next.js' SSG "Preview Mode".
    // Cookies may also be required for `getServerSideProps`.
    //
    // > `fetch` won’t send cookies, unless you set the credentials init
    // > option.
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    //
    // > For maximum browser compatibility when it comes to sending &
    // > receiving cookies, always supply the `credentials: 'same-origin'`
    // > option instead of relying on the default.
    // https://github.com/github/fetch#caveats
    credentials: 'same-origin'
  }).then(res => {
    if (!res.ok) {
      if (attempts > 1 && res.status >= 500) {
        return fetchRetry(url, attempts - 1);
      }

      if (res.status === 404) {
        return res.json().then(data => {
          if (data.notFound) {
            return {
              notFound: SSG_DATA_NOT_FOUND
            };
          }

          throw new Error(`Failed to load static props`);
        });
      }

      throw new Error(`Failed to load static props`);
    }

    return res.json();
  });
}

function fetchNextData(dataHref, isServerRender) {
  return fetchRetry(dataHref, isServerRender ? 3 : 1).catch(err => {
    // We should only trigger a server-side transition if this was caused
    // on a client-side transition. Otherwise, we'd get into an infinite
    // loop.
    if (!isServerRender) {
      (0, _routeLoader).markAssetError(err);
    }

    throw err;
  });
}

class Router {
  constructor(pathname1, query1, as1, {
    initialProps,
    pageLoader,
    App,
    wrapApp,
    Component: Component1,
    err: err1,
    subscription,
    isFallback,
    locale,
    locales,
    defaultLocale,
    domainLocales,
    isPreview
  }) {
    // Static Data Cache
    this.sdc = {}; // In-flight Server Data Requests, for deduping

    this.sdr = {};
    this._idx = 0;

    this.onPopState = e => {
      const state = e.state;

      if (!state) {
        // We get state as undefined for two reasons.
        //  1. With older safari (< 8) and older chrome (< 34)
        //  2. When the URL changed with #
        //
        // In the both cases, we don't need to proceed and change the route.
        // (as it's already changed)
        // But we can simply replace the state with the new changes.
        // Actually, for (1) we don't need to nothing. But it's hard to detect that event.
        // So, doing the following for (1) does no harm.
        const {
          pathname: pathname1,
          query: query1
        } = this;
        this.changeState('replaceState', (0, _utils).formatWithValidation({
          pathname: addBasePath(pathname1),
          query: query1
        }), (0, _utils).getURL());
        return;
      }

      if (!state.__N) {
        return;
      }

      let forcedScroll;
      const {
        url,
        as: as1,
        options,
        idx
      } = state;

      if (false) {}

      this._idx = idx;
      const {
        pathname: pathname1
      } = (0, _parseRelativeUrl).parseRelativeUrl(url); // Make sure we don't re-render on initial load,
      // can be caused by navigating back from an external site

      if (this.isSsr && as1 === this.asPath && pathname1 === this.pathname) {
        return;
      } // If the downstream application returns falsy, return.
      // They will then be responsible for handling the event.


      if (this._bps && !this._bps(state)) {
        return;
      }

      this.change('replaceState', url, as1, Object.assign({}, options, {
        shallow: options.shallow && this._shallow,
        locale: options.locale || this.defaultLocale
      }), forcedScroll);
    }; // represents the current component key


    this.route = (0, _normalizeTrailingSlash).removePathTrailingSlash(pathname1); // set up the component cache (by route keys)

    this.components = {}; // We should not keep the cache, if there's an error
    // Otherwise, this cause issues when when going back and
    // come again to the errored page.

    if (pathname1 !== '/_error') {
      this.components[this.route] = {
        Component: Component1,
        initial: true,
        props: initialProps,
        err: err1,
        __N_SSG: initialProps && initialProps.__N_SSG,
        __N_SSP: initialProps && initialProps.__N_SSP
      };
    }

    this.components['/_app'] = {
      Component: App,
      styleSheets: []
    }; // Backwards compat for Router.router.events
    // TODO: Should be remove the following major version as it was never documented

    this.events = Router.events;
    this.pageLoader = pageLoader;
    this.pathname = pathname1;
    this.query = query1; // if auto prerendered and dynamic route wait to update asPath
    // until after mount to prevent hydration mismatch

    const autoExportDynamic = (0, _isDynamic).isDynamicRoute(pathname1) && self.__NEXT_DATA__.autoExport;

    this.asPath = autoExportDynamic ? pathname1 : as1;
    this.basePath = basePath;
    this.sub = subscription;
    this.clc = null;
    this._wrapApp = wrapApp; // make sure to ignore extra popState in safari on navigating
    // back from external site

    this.isSsr = true;
    this.isFallback = isFallback;
    this.isReady = !!(self.__NEXT_DATA__.gssp || self.__NEXT_DATA__.gip || self.__NEXT_DATA__.appGip && !self.__NEXT_DATA__.gsp || !autoExportDynamic && !self.location.search && !false);
    this.isPreview = !!isPreview;
    this.isLocaleDomain = false;

    if (false) {}

    if (false) {}
  }

  reload() {
    window.location.reload();
  }
  /**
  * Go back in history
  */


  back() {
    window.history.back();
  }
  /**
  * Performs a `pushState` with arguments
  * @param url of the route
  * @param as masks `url` for the browser
  * @param options object you can define `shallow` and other options
  */


  push(url, as, options = {}) {
    if (false) {}

    ({
      url,
      as
    } = prepareUrlAs(this, url, as));
    return this.change('pushState', url, as, options);
  }
  /**
  * Performs a `replaceState` with arguments
  * @param url of the route
  * @param as masks `url` for the browser
  * @param options object you can define `shallow` and other options
  */


  replace(url, as, options = {}) {
    ({
      url,
      as
    } = prepareUrlAs(this, url, as));
    return this.change('replaceState', url, as, options);
  }

  async change(method, url, as, options, forcedScroll) {
    if (!isLocalURL(url)) {
      window.location.href = url;
      return false;
    }

    const shouldResolveHref = url === as || options._h || options._shouldResolveHref; // for static pages with query params in the URL we delay
    // marking the router ready until after the query is updated

    if (options._h) {
      this.isReady = true;
    }

    const prevLocale = this.locale;

    if (false) { var ref; }

    if (!options._h) {
      this.isSsr = false;
    } // marking route changes as a navigation start entry


    if (_utils.ST) {
      performance.mark('routeChange');
    }

    const {
      shallow = false
    } = options;
    const routeProps = {
      shallow
    };

    if (this._inFlightRoute) {
      this.abortComponentLoad(this._inFlightRoute, routeProps);
    }

    as = addBasePath(addLocale(hasBasePath(as) ? delBasePath(as) : as, options.locale, this.defaultLocale));
    const cleanedAs = delLocale(hasBasePath(as) ? delBasePath(as) : as, this.locale);
    this._inFlightRoute = as;
    let localeChange = prevLocale !== this.locale; // If the url change is only related to a hash change
    // We should not proceed. We should only change the state.
    // WARNING: `_h` is an internal option for handing Next.js client-side
    // hydration. Your app should _never_ use this property. It may change at
    // any time without notice.

    if (!options._h && this.onlyAHashChange(cleanedAs) && !localeChange) {
      this.asPath = cleanedAs;
      Router.events.emit('hashChangeStart', as, routeProps); // TODO: do we need the resolved href when only a hash change?

      this.changeState(method, url, as, options);
      this.scrollToHash(cleanedAs);
      this.notify(this.components[this.route], null);
      Router.events.emit('hashChangeComplete', as, routeProps);
      return true;
    }

    let parsed = (0, _parseRelativeUrl).parseRelativeUrl(url);
    let {
      pathname: pathname1,
      query: query1
    } = parsed; // The build manifest needs to be loaded before auto-static dynamic pages
    // get their query parameters to allow ensuring they can be parsed properly
    // when rewritten to

    let pages, rewrites;

    try {
      pages = await this.pageLoader.getPageList();
      ({
        __rewrites: rewrites
      } = await (0, _routeLoader).getClientBuildManifest());
    } catch (err1) {
      // If we fail to resolve the page list or client-build manifest, we must
      // do a server-side transition:
      window.location.href = as;
      return false;
    } // If asked to change the current URL we should reload the current page
    // (not location.reload() but reload getInitialProps and other Next.js stuffs)
    // We also need to set the method = replaceState always
    // as this should not go into the history (That's how browsers work)
    // We should compare the new asPath to the current asPath, not the url


    if (!this.urlIsNew(cleanedAs) && !localeChange) {
      method = 'replaceState';
    } // we need to resolve the as value using rewrites for dynamic SSG
    // pages to allow building the data URL correctly


    let resolvedAs = as; // url and as should always be prefixed with basePath by this
    // point by either next/link or router.push/replace so strip the
    // basePath from the pathname to match the pages dir 1-to-1

    pathname1 = pathname1 ? (0, _normalizeTrailingSlash).removePathTrailingSlash(delBasePath(pathname1)) : pathname1;

    if (shouldResolveHref && pathname1 !== '/_error') {
      options._shouldResolveHref = true;

      if (false) {} else {
        parsed.pathname = resolveDynamicRoute(pathname1, pages);

        if (parsed.pathname !== pathname1) {
          pathname1 = parsed.pathname;
          parsed.pathname = addBasePath(pathname1);
          url = (0, _utils).formatWithValidation(parsed);
        }
      }
    }

    const route = (0, _normalizeTrailingSlash).removePathTrailingSlash(pathname1);

    if (!isLocalURL(as)) {
      if (true) {
        throw new Error(`Invalid href: "${url}" and as: "${as}", received relative href and external as` + `\nSee more info: https://nextjs.org/docs/messages/invalid-relative-url-external-as`);
      }

      window.location.href = as;
      return false;
    }

    resolvedAs = delLocale(delBasePath(resolvedAs), this.locale);

    if ((0, _isDynamic).isDynamicRoute(route)) {
      const parsedAs = (0, _parseRelativeUrl).parseRelativeUrl(resolvedAs);
      const asPathname = parsedAs.pathname;
      const routeRegex = (0, _routeRegex).getRouteRegex(route);
      const routeMatch = (0, _routeMatcher).getRouteMatcher(routeRegex)(asPathname);
      const shouldInterpolate = route === asPathname;
      const interpolatedAs = shouldInterpolate ? interpolateAs(route, asPathname, query1) : {};

      if (!routeMatch || shouldInterpolate && !interpolatedAs.result) {
        const missingParams = Object.keys(routeRegex.groups).filter(param => !query1[param]);

        if (missingParams.length > 0) {
          if (true) {
            console.warn(`${shouldInterpolate ? `Interpolating href` : `Mismatching \`as\` and \`href\``} failed to manually provide ` + `the params: ${missingParams.join(', ')} in the \`href\`'s \`query\``);
          }

          throw new Error((shouldInterpolate ? `The provided \`href\` (${url}) value is missing query values (${missingParams.join(', ')}) to be interpolated properly. ` : `The provided \`as\` value (${asPathname}) is incompatible with the \`href\` value (${route}). `) + `Read more: https://nextjs.org/docs/messages/${shouldInterpolate ? 'href-interpolation-failed' : 'incompatible-href-as'}`);
        }
      } else if (shouldInterpolate) {
        as = (0, _utils).formatWithValidation(Object.assign({}, parsedAs, {
          pathname: interpolatedAs.result,
          query: omitParmsFromQuery(query1, interpolatedAs.params)
        }));
      } else {
        // Merge params into `query`, overwriting any specified in search
        Object.assign(query1, routeMatch);
      }
    }

    Router.events.emit('routeChangeStart', as, routeProps);

    try {
      var ref, ref1;
      let routeInfo = await this.getRouteInfo(route, pathname1, query1, as, resolvedAs, routeProps);
      let {
        error,
        props,
        __N_SSG,
        __N_SSP
      } = routeInfo; // handle redirect on client-transition

      if ((__N_SSG || __N_SSP) && props) {
        if (props.pageProps && props.pageProps.__N_REDIRECT) {
          const destination = props.pageProps.__N_REDIRECT; // check if destination is internal (resolves to a page) and attempt
          // client-navigation if it is falling back to hard navigation if
          // it's not

          if (destination.startsWith('/')) {
            const parsedHref = (0, _parseRelativeUrl).parseRelativeUrl(destination);
            parsedHref.pathname = resolveDynamicRoute(parsedHref.pathname, pages);
            const {
              url: newUrl,
              as: newAs
            } = prepareUrlAs(this, destination, destination);
            return this.change(method, newUrl, newAs, options);
          }

          window.location.href = destination;
          return new Promise(() => {});
        }

        this.isPreview = !!props.__N_PREVIEW; // handle SSG data 404

        if (props.notFound === SSG_DATA_NOT_FOUND) {
          let notFoundRoute;

          try {
            await this.fetchComponent('/404');
            notFoundRoute = '/404';
          } catch (_) {
            notFoundRoute = '/_error';
          }

          routeInfo = await this.getRouteInfo(notFoundRoute, notFoundRoute, query1, as, resolvedAs, {
            shallow: false
          });
        }
      }

      Router.events.emit('beforeHistoryChange', as, routeProps);
      this.changeState(method, url, as, options);

      if (true) {
        const appComp = this.components['/_app'].Component;
        window.next.isPrerendered = appComp.getInitialProps === appComp.origGetInitialProps && !routeInfo.Component.getInitialProps;
      }

      if (options._h && pathname1 === '/_error' && ((ref = self.__NEXT_DATA__.props) === null || ref === void 0 ? void 0 : (ref1 = ref.pageProps) === null || ref1 === void 0 ? void 0 : ref1.statusCode) === 500 && (props === null || props === void 0 ? void 0 : props.pageProps)) {
        // ensure statusCode is still correct for static 500 page
        // when updating query information
        props.pageProps.statusCode = 500;
      } // shallow routing is only allowed for same page URL changes.


      const isValidShallowRoute = options.shallow && this.route === route;

      var _scroll;

      const shouldScroll = (_scroll = options.scroll) !== null && _scroll !== void 0 ? _scroll : !isValidShallowRoute;
      const resetScroll = shouldScroll ? {
        x: 0,
        y: 0
      } : null;
      await this.set(route, pathname1, query1, cleanedAs, routeInfo, forcedScroll !== null && forcedScroll !== void 0 ? forcedScroll : resetScroll).catch(e => {
        if (e.cancelled) error = error || e;else throw e;
      });

      if (error) {
        Router.events.emit('routeChangeError', error, cleanedAs, routeProps);
        throw error;
      }

      if (false) {}

      Router.events.emit('routeChangeComplete', as, routeProps);
      return true;
    } catch (err1) {
      if (err1.cancelled) {
        return false;
      }

      throw err1;
    }
  }

  changeState(method, url, as, options = {}) {
    if (true) {
      if (typeof window.history === 'undefined') {
        console.error(`Warning: window.history is not available.`);
        return;
      }

      if (typeof window.history[method] === 'undefined') {
        console.error(`Warning: window.history.${method} is not available`);
        return;
      }
    }

    if (method !== 'pushState' || (0, _utils).getURL() !== as) {
      this._shallow = options.shallow;
      window.history[method]({
        url,
        as,
        options,
        __N: true,
        idx: this._idx = method !== 'pushState' ? this._idx : this._idx + 1
      }, // Most browsers currently ignores this parameter, although they may use it in the future.
      // Passing the empty string here should be safe against future changes to the method.
      // https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState
      '', as);
    }
  }

  async handleRouteInfoError(err, pathname, query, as, routeProps, loadErrorFail) {
    if (err.cancelled) {
      // bubble up cancellation errors
      throw err;
    }

    if ((0, _routeLoader).isAssetError(err) || loadErrorFail) {
      Router.events.emit('routeChangeError', err, as, routeProps); // If we can't load the page it could be one of following reasons
      //  1. Page doesn't exists
      //  2. Page does exist in a different zone
      //  3. Internal error while loading the page
      // So, doing a hard reload is the proper way to deal with this.

      window.location.href = as; // Changing the URL doesn't block executing the current code path.
      // So let's throw a cancellation error stop the routing logic.

      throw buildCancellationError();
    }

    try {
      let Component1;
      let styleSheets;
      let props;

      if (typeof Component1 === 'undefined' || typeof styleSheets === 'undefined') {
        ({
          page: Component1,
          styleSheets
        } = await this.fetchComponent('/_error'));
      }

      const routeInfo = {
        props,
        Component: Component1,
        styleSheets,
        err,
        error: err
      };

      if (!routeInfo.props) {
        try {
          routeInfo.props = await this.getInitialProps(Component1, {
            err,
            pathname,
            query
          });
        } catch (gipErr) {
          console.error('Error in error page `getInitialProps`: ', gipErr);
          routeInfo.props = {};
        }
      }

      return routeInfo;
    } catch (routeInfoErr) {
      return this.handleRouteInfoError(routeInfoErr, pathname, query, as, routeProps, true);
    }
  }

  async getRouteInfo(route, pathname, query, as, resolvedAs, routeProps) {
    try {
      const existingRouteInfo = this.components[route];

      if (routeProps.shallow && existingRouteInfo && this.route === route) {
        return existingRouteInfo;
      }

      const cachedRouteInfo = existingRouteInfo && 'initial' in existingRouteInfo ? undefined : existingRouteInfo;
      const routeInfo = cachedRouteInfo ? cachedRouteInfo : await this.fetchComponent(route).then(res => ({
        Component: res.page,
        styleSheets: res.styleSheets,
        __N_SSG: res.mod.__N_SSG,
        __N_SSP: res.mod.__N_SSP
      }));
      const {
        Component: Component1,
        __N_SSG,
        __N_SSP
      } = routeInfo;

      if (true) {
        const {
          isValidElementType
        } = __webpack_require__(/*! react-is */ "react-is");

        if (!isValidElementType(Component1)) {
          throw new Error(`The default export is not a React Component in page: "${pathname}"`);
        }
      }

      let dataHref;

      if (__N_SSG || __N_SSP) {
        dataHref = this.pageLoader.getDataHref((0, _utils).formatWithValidation({
          pathname,
          query
        }), resolvedAs, __N_SSG, this.locale);
      }

      const props = await this._getData(() => __N_SSG ? this._getStaticData(dataHref) : __N_SSP ? this._getServerData(dataHref) : this.getInitialProps(Component1, // we provide AppTree later so this needs to be `any`
      {
        pathname,
        query,
        asPath: as,
        locale: this.locale,
        locales: this.locales,
        defaultLocale: this.defaultLocale
      }));
      routeInfo.props = props;
      this.components[route] = routeInfo;
      return routeInfo;
    } catch (err2) {
      return this.handleRouteInfoError(err2, pathname, query, as, routeProps);
    }
  }

  set(route, pathname, query, as, data, resetScroll) {
    this.isFallback = false;
    this.route = route;
    this.pathname = pathname;
    this.query = query;
    this.asPath = as;
    return this.notify(data, resetScroll);
  }
  /**
  * Callback to execute before replacing router state
  * @param cb callback to be executed
  */


  beforePopState(cb) {
    this._bps = cb;
  }

  onlyAHashChange(as) {
    if (!this.asPath) return false;
    const [oldUrlNoHash, oldHash] = this.asPath.split('#');
    const [newUrlNoHash, newHash] = as.split('#'); // Makes sure we scroll to the provided hash if the url/hash are the same

    if (newHash && oldUrlNoHash === newUrlNoHash && oldHash === newHash) {
      return true;
    } // If the urls are change, there's more than a hash change


    if (oldUrlNoHash !== newUrlNoHash) {
      return false;
    } // If the hash has changed, then it's a hash only change.
    // This check is necessary to handle both the enter and
    // leave hash === '' cases. The identity case falls through
    // and is treated as a next reload.


    return oldHash !== newHash;
  }

  scrollToHash(as) {
    const [, hash] = as.split('#'); // Scroll to top if the hash is just `#` with no value or `#top`
    // To mirror browsers

    if (hash === '' || hash === 'top') {
      window.scrollTo(0, 0);
      return;
    } // First we check if the element by id is found


    const idEl = document.getElementById(hash);

    if (idEl) {
      idEl.scrollIntoView();
      return;
    } // If there's no element with the id, we check the `name` property
    // To mirror browsers


    const nameEl = document.getElementsByName(hash)[0];

    if (nameEl) {
      nameEl.scrollIntoView();
    }
  }

  urlIsNew(asPath) {
    return this.asPath !== asPath;
  }
  /**
  * Prefetch page code, you may wait for the data during page rendering.
  * This feature only works in production!
  * @param url the href of prefetched page
  * @param asPath the as path of the prefetched page
  */


  async prefetch(url, asPath = url, options = {}) {
    let parsed = (0, _parseRelativeUrl).parseRelativeUrl(url);
    let {
      pathname: pathname2
    } = parsed;

    if (false) {}

    const pages = await this.pageLoader.getPageList();
    let resolvedAs = asPath;

    if (false) {} else {
      parsed.pathname = resolveDynamicRoute(parsed.pathname, pages);

      if (parsed.pathname !== pathname2) {
        pathname2 = parsed.pathname;
        parsed.pathname = pathname2;
        url = (0, _utils).formatWithValidation(parsed);
      }
    }

    const route = (0, _normalizeTrailingSlash).removePathTrailingSlash(pathname2); // Prefetch is not supported in development mode because it would trigger on-demand-entries

    if (true) {
      return;
    }

    await Promise.all([this.pageLoader._isSsg(route).then(isSsg => {
      return isSsg ? this._getStaticData(this.pageLoader.getDataHref(url, resolvedAs, true, typeof options.locale !== 'undefined' ? options.locale : this.locale)) : false;
    }), this.pageLoader[options.priority ? 'loadPage' : 'prefetch'](route)]);
  }

  async fetchComponent(route) {
    let cancelled = false;

    const cancel = this.clc = () => {
      cancelled = true;
    };

    const componentResult = await this.pageLoader.loadPage(route);

    if (cancelled) {
      const error = new Error(`Abort fetching component for route: "${route}"`);
      error.cancelled = true;
      throw error;
    }

    if (cancel === this.clc) {
      this.clc = null;
    }

    return componentResult;
  }

  _getData(fn) {
    let cancelled = false;

    const cancel = () => {
      cancelled = true;
    };

    this.clc = cancel;
    return fn().then(data => {
      if (cancel === this.clc) {
        this.clc = null;
      }

      if (cancelled) {
        const err2 = new Error('Loading initial props cancelled');
        err2.cancelled = true;
        throw err2;
      }

      return data;
    });
  }

  _getStaticData(dataHref) {
    const {
      href: cacheKey
    } = new URL(dataHref, window.location.href);

    if (false) {}

    return fetchNextData(dataHref, this.isSsr).then(data => {
      this.sdc[cacheKey] = data;
      return data;
    });
  }

  _getServerData(dataHref) {
    const {
      href: resourceKey
    } = new URL(dataHref, window.location.href);

    if (this.sdr[resourceKey]) {
      return this.sdr[resourceKey];
    }

    return this.sdr[resourceKey] = fetchNextData(dataHref, this.isSsr).then(data => {
      delete this.sdr[resourceKey];
      return data;
    }).catch(err2 => {
      delete this.sdr[resourceKey];
      throw err2;
    });
  }

  getInitialProps(Component, ctx) {
    const {
      Component: App1
    } = this.components['/_app'];

    const AppTree = this._wrapApp(App1);

    ctx.AppTree = AppTree;
    return (0, _utils).loadGetInitialProps(App1, {
      AppTree,
      Component,
      router: this,
      ctx
    });
  }

  abortComponentLoad(as, routeProps) {
    if (this.clc) {
      Router.events.emit('routeChangeError', buildCancellationError(), as, routeProps);
      this.clc();
      this.clc = null;
    }
  }

  notify(data, resetScroll) {
    return this.sub(data, this.components['/_app'].Component, resetScroll);
  }

}

Router.events = (0, _mitt).default();
exports.default = Router;

/***/ }),

/***/ "./pages/boards/[boardId]/index.jsx":
/*!******************************************!*\
  !*** ./pages/boards/[boardId]/index.jsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _src_feature_board_template_BoardDetailPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../src/feature/board/template/BoardDetailPage */ "./src/feature/board/template/BoardDetailPage.jsx");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__);
var _jsxFileName = "C:\\Users\\qht6\\Desktop\\PBP\\board_project_week1\\pages\\boards\\[boardId]\\index.jsx";




const index = () => {
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(_src_feature_board_template_BoardDetailPage__WEBPACK_IMPORTED_MODULE_1__.default, {}, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 5,
    columnNumber: 10
  }, undefined);
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (index);

/***/ }),

/***/ "./src/common/data/dummyBoardData.js":
/*!*******************************************!*\
  !*** ./src/common/data/dummyBoardData.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "dummyBoardList": () => (/* binding */ dummyBoardList),
/* harmony export */   "dummyBoardEntities": () => (/* binding */ dummyBoardEntities)
/* harmony export */ });
const dummyBoardList = [{
  id: 1,
  title: "와 대박",
  writer: "손흥민"
}, {
  id: 2,
  title: "와 미쳤다",
  writer: "안정환"
}, {
  id: 3,
  title: "와 어떻게 이럴 수가",
  writer: "김민재"
}, {
  id: 4,
  title: "와 그리즈만 미쳤다",
  writer: "황의조"
}, {
  id: 5,
  title: "와 손흥민 미쳤다",
  writer: "홍명보 "
}];
const dummyBoardEntities = {
  1: {
    id: 1,
    title: "와 대박",
    content: "어떻게 저걸 저렇게 차냐",
    password: "1234",
    writer: "손흥민",
    createdAt: "2021.10.07 14:46:37",
    updatedAt: "2021.10.07 14:46:37"
  },
  2: {
    id: 2,
    title: "와 미쳤다",
    content: "어떻게 저걸 저렇게 차냐",
    password: "1234",
    writer: "안정환",
    createdAt: "2021.10.07 14:46:37",
    updatedAt: "2021.10.07 14:46:37"
  },
  3: {
    id: 3,
    title: "와 어떻게 이럴 수가",
    content: "어떻게 저걸 저렇게 차냐",
    password: "1234",
    writer: "이을용",
    createdAt: "2021.10.07 14:46:37",
    updatedAt: "2021.10.07 14:46:37"
  },
  4: {
    id: 4,
    title: "와 그리즈만 미쳤다",
    content: "어떻게 저걸 저렇게 차냐",
    password: "1234",
    writer: "기성룡",
    createdAt: "2021.10.07 14:46:37",
    updatedAt: "2021.10.07 14:46:37"
  },
  5: {
    id: 5,
    title: "와 손흥민 미쳤다",
    content: "어떻게 저걸 저렇게 차냐",
    password: "1234",
    writer: "박지성",
    createdAt: "2021.10.07 14:46:37",
    updatedAt: "2021.10.07 14:46:37"
  }
};

/***/ }),

/***/ "./src/common/data/dummyReplyData.js":
/*!*******************************************!*\
  !*** ./src/common/data/dummyReplyData.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "dummyReplyList": () => (/* binding */ dummyReplyList),
/* harmony export */   "getReplyList": () => (/* binding */ getReplyList)
/* harmony export */ });
const dummyReplyList = [{
  id: 1,
  boardId: 1,
  content: "ㄹㅇㅋㅋ",
  writer: "이준희",
  updateTime: "2021.10.07 16:51:00"
}, {
  id: 2,
  boardId: 1,
  content: "ㄹㅇㅋㅋ",
  writer: "황동욱",
  updateTime: "2021.10.07 16:51:00"
}, {
  id: 3,
  boardId: 1,
  content: "ㄹㅇㅋㅋ",
  writer: "최국철",
  updateTime: "2021.10.07 16:51:00"
}, {
  id: 4,
  boardId: 1,
  content: "ㄹㅇㅋㅋ",
  writer: "기호영",
  updateTime: "2021.10.07 16:51:00"
}];
const getReplyList = Id => {
  const result = dummyReplyList.filter(reply => reply.boardId === parseInt(Id, 10));
  return result;
};

/***/ }),

/***/ "./src/feature/board/component/DetailHeader.jsx":
/*!******************************************************!*\
  !*** ./src/feature/board/component/DetailHeader.jsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! styled-components */ "styled-components");
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(styled_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__);
var _jsxFileName = "C:\\Users\\qht6\\Desktop\\PBP\\board_project_week1\\src\\feature\\board\\component\\DetailHeader.jsx";



const Container = styled_components__WEBPACK_IMPORTED_MODULE_1___default().div.withConfig({
  displayName: "DetailHeader__Container",
  componentId: "sc-14v4ll7-0"
})(["width:100%;height:60px;display:flex;flex-direction:column;justify-content:space-around;align-items:flex-start;padding:10px 5px 10px 5px;margin-bottom:20px;border-bottom:1px solid #ccc;"]);
const Title = styled_components__WEBPACK_IMPORTED_MODULE_1___default().div.withConfig({
  displayName: "DetailHeader__Title",
  componentId: "sc-14v4ll7-1"
})(["color:#080808;font-size:20px;font-weight:bold;"]);
const Writer = styled_components__WEBPACK_IMPORTED_MODULE_1___default().span.withConfig({
  displayName: "DetailHeader__Writer",
  componentId: "sc-14v4ll7-2"
})(["color:#080808;font-size:12px;font-weight:lighter;"]);

const DetailHeader = ({
  title,
  writer,
  updatedAt
}) => {
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(Container, {
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(Title, {
      children: title
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 33,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(Writer, {
      children: `${writer} |  ${updatedAt}`
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 34,
      columnNumber: 7
    }, undefined)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 32,
    columnNumber: 5
  }, undefined);
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DetailHeader);

/***/ }),

/***/ "./src/feature/board/template/BoardDetailPage.jsx":
/*!********************************************************!*\
  !*** ./src/feature/board/template/BoardDetailPage.jsx ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var next_dist_client_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/client/router */ "./node_modules/next/dist/client/router.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! styled-components */ "styled-components");
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(styled_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _common_data_dummyBoardData__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../common/data/dummyBoardData */ "./src/common/data/dummyBoardData.js");
/* harmony import */ var _component_DetailHeader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../component/DetailHeader */ "./src/feature/board/component/DetailHeader.jsx");
/* harmony import */ var _reply_template_Reply__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../reply/template/Reply */ "./src/feature/reply/template/Reply.jsx");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__);
var _jsxFileName = "C:\\Users\\qht6\\Desktop\\PBP\\board_project_week1\\src\\feature\\board\\template\\BoardDetailPage.jsx";







const Container = styled_components__WEBPACK_IMPORTED_MODULE_2___default().div.withConfig({
  displayName: "BoardDetailPage__Container",
  componentId: "sc-1i8vxt4-0"
})(["width:80%;height:100%;display:flex;flex-direction:column;justify-content:flex-start;align-items:center;margin-right:auto;margin-left:auto;"]);
const Content = styled_components__WEBPACK_IMPORTED_MODULE_2___default().div.withConfig({
  displayName: "BoardDetailPage__Content",
  componentId: "sc-1i8vxt4-1"
})(["width:100%;min-height:300px;display:flex;flex-direction:column;justify-content:flex-start;align-items:flex-start;margin-bottom:20px;color:#000;"]);

const BoardDetailPage = () => {
  const router = (0,next_dist_client_router__WEBPACK_IMPORTED_MODULE_0__.useRouter)();
  const {
    boardId
  } = router.query;
  const {
    0: board,
    1: setBoard
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    setBoard(_common_data_dummyBoardData__WEBPACK_IMPORTED_MODULE_3__.dummyBoardEntities[boardId]);
  }, [boardId]);
  return board ? /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)(Container, {
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)(_component_DetailHeader__WEBPACK_IMPORTED_MODULE_4__.default, {
      title: board.title,
      writer: board.writer,
      updatedAt: board.updatedAt
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 46,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)(Content, {
      children: board.content
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 51,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)(_reply_template_Reply__WEBPACK_IMPORTED_MODULE_5__.default, {}, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 52,
      columnNumber: 7
    }, undefined)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 45,
    columnNumber: 5
  }, undefined) : null;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BoardDetailPage);

/***/ }),

/***/ "./src/feature/reply/component/ReplyInput.jsx":
/*!****************************************************!*\
  !*** ./src/feature/reply/component/ReplyInput.jsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! styled-components */ "styled-components");
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(styled_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__);
var _jsxFileName = "C:\\Users\\qht6\\Desktop\\PBP\\board_project_week1\\src\\feature\\reply\\component\\ReplyInput.jsx";



const Container = styled_components__WEBPACK_IMPORTED_MODULE_1___default().div.withConfig({
  displayName: "ReplyInput__Container",
  componentId: "sc-9wk741-0"
})(["width:100%;height:80px;display:flex;flex-direction:row;justify-content:flex-start;align-items:center;padding:8px;"]);
const UserInfoSection = styled_components__WEBPACK_IMPORTED_MODULE_1___default().div.withConfig({
  displayName: "ReplyInput__UserInfoSection",
  componentId: "sc-9wk741-1"
})(["display:flex;flex-direction:column;justify-content:flex-start;align-items:center;margin-right:20px;"]);
const UserInfoInput = styled_components__WEBPACK_IMPORTED_MODULE_1___default().input.withConfig({
  displayName: "ReplyInput__UserInfoInput",
  componentId: "sc-9wk741-2"
})(["width:80px;margin-bottom:8px;"]);
const ContentInput = styled_components__WEBPACK_IMPORTED_MODULE_1___default().textarea.withConfig({
  displayName: "ReplyInput__ContentInput",
  componentId: "sc-9wk741-3"
})(["height:80%;flex:1;margin-right:8px;"]);

const ReplyInput = ({
  addReply
}) => {
  const {
    0: writer,
    1: setWriter
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  const {
    0: password,
    1: setPassword
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  const {
    0: content,
    1: setContent
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("");

  const onClick = () => {
    addReply(writer, content, password, new Date().toLocaleDateString());
    setWriter("");
    setPassword("");
    setContent("");
  };

  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(Container, {
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(UserInfoSection, {
      children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(UserInfoInput, {
        placeholder: "\uC791\uC131\uC790",
        value: writer,
        onChange: e => setWriter(e.target.value)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 52,
        columnNumber: 9
      }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(UserInfoInput, {
        placeholder: "\uBE44\uBC00\uBC88\uD638",
        value: password,
        onChange: e => setPassword(e.target.value)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 57,
        columnNumber: 9
      }, undefined)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 51,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(ContentInput, {
      value: content,
      onChange: e => {
        setContent(e.target.value);
      }
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 63,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("button", {
      type: "button",
      onClick: onClick,
      children: "\uC791\uC131"
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 69,
      columnNumber: 7
    }, undefined)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 50,
    columnNumber: 5
  }, undefined);
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ReplyInput);

/***/ }),

/***/ "./src/feature/reply/component/ReplyItem.jsx":
/*!***************************************************!*\
  !*** ./src/feature/reply/component/ReplyItem.jsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! styled-components */ "styled-components");
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(styled_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__);
var _jsxFileName = "C:\\Users\\qht6\\Desktop\\PBP\\board_project_week1\\src\\feature\\reply\\component\\ReplyItem.jsx";



const Container = styled_components__WEBPACK_IMPORTED_MODULE_1___default().div.withConfig({
  displayName: "ReplyItem__Container",
  componentId: "sc-1h95ewt-0"
})(["width:100%;display:flex;flex-direction:row;justify-content:flex-start;align-items:flex-start;padding:5px;border-bottom:1px solid #cdcdcd;"]);
const Writer = styled_components__WEBPACK_IMPORTED_MODULE_1___default().div.withConfig({
  displayName: "ReplyItem__Writer",
  componentId: "sc-1h95ewt-1"
})(["flex:0 0 100px;"]);
const Content = styled_components__WEBPACK_IMPORTED_MODULE_1___default().div.withConfig({
  displayName: "ReplyItem__Content",
  componentId: "sc-1h95ewt-2"
})(["flex:1 1 100px;"]);
const Time = styled_components__WEBPACK_IMPORTED_MODULE_1___default().div.withConfig({
  displayName: "ReplyItem__Time",
  componentId: "sc-1h95ewt-3"
})(["flex:0 0 150px;"]);

const ReplyItem = ({
  writer,
  content,
  time
}) => {
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(Container, {
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(Writer, {
      children: writer
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 30,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(Content, {
      children: content
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 31,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)(Time, {
      children: time
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 32,
      columnNumber: 7
    }, undefined)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 29,
    columnNumber: 5
  }, undefined);
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ReplyItem);

/***/ }),

/***/ "./src/feature/reply/component/ReplyList.jsx":
/*!***************************************************!*\
  !*** ./src/feature/reply/component/ReplyList.jsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! styled-components */ "styled-components");
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(styled_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ReplyItem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ReplyItem */ "./src/feature/reply/component/ReplyItem.jsx");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__);
var _jsxFileName = "C:\\Users\\qht6\\Desktop\\PBP\\board_project_week1\\src\\feature\\reply\\component\\ReplyList.jsx";




const Container = styled_components__WEBPACK_IMPORTED_MODULE_1___default().div.withConfig({
  displayName: "ReplyList__Container",
  componentId: "sc-164sdyf-0"
})(["width:100%;display:flex;flex-direction:column;"]);

const ReplyList = ({
  replies
}) => {
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(Container, {
    children: replies.map(reply => /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxDEV)(_ReplyItem__WEBPACK_IMPORTED_MODULE_2__.default, {
      writer: reply.writer,
      content: reply.content,
      time: reply.updateTime
    }, reply.id, false, {
      fileName: _jsxFileName,
      lineNumber: 16,
      columnNumber: 9
    }, undefined))
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 14,
    columnNumber: 5
  }, undefined);
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ReplyList);

/***/ }),

/***/ "./src/feature/reply/template/Reply.jsx":
/*!**********************************************!*\
  !*** ./src/feature/reply/template/Reply.jsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var next_dist_client_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/client/router */ "./node_modules/next/dist/client/router.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! styled-components */ "styled-components");
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(styled_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _common_data_dummyReplyData__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../common/data/dummyReplyData */ "./src/common/data/dummyReplyData.js");
/* harmony import */ var _component_ReplyInput__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../component/ReplyInput */ "./src/feature/reply/component/ReplyInput.jsx");
/* harmony import */ var _component_ReplyList__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../component/ReplyList */ "./src/feature/reply/component/ReplyList.jsx");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__);
var _jsxFileName = "C:\\Users\\qht6\\Desktop\\PBP\\board_project_week1\\src\\feature\\reply\\template\\Reply.jsx";







const Container = styled_components__WEBPACK_IMPORTED_MODULE_2___default().div.withConfig({
  displayName: "Reply__Container",
  componentId: "sc-edfae1-0"
})(["width:100%;"]);

const Reply = () => {
  const router = (0,next_dist_client_router__WEBPACK_IMPORTED_MODULE_0__.useRouter)();
  const {
    boardId
  } = router.query;
  const {
    0: replies,
    1: setReplies
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    setReplies((0,_common_data_dummyReplyData__WEBPACK_IMPORTED_MODULE_3__.getReplyList)(boardId));
  }, [boardId]);

  const addReply = (writer, content, password, time) => {
    setReplies([{
      writer,
      content,
      password,
      updateTime: time
    }, ...replies]);
  };

  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)(Container, {
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)(_component_ReplyInput__WEBPACK_IMPORTED_MODULE_4__.default, {
      addReply: addReply
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 28,
      columnNumber: 7
    }, undefined), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxDEV)(_component_ReplyList__WEBPACK_IMPORTED_MODULE_5__.default, {
      replies: replies
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 29,
      columnNumber: 7
    }, undefined)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 27,
    columnNumber: 5
  }, undefined);
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Reply);

/***/ }),

/***/ "../../../server/denormalize-page-path":
/*!************************************************************!*\
  !*** external "next/dist/server/denormalize-page-path.js" ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/denormalize-page-path.js");

/***/ }),

/***/ "../i18n/normalize-locale-path":
/*!*********************************************************************!*\
  !*** external "next/dist/shared/lib/i18n/normalize-locale-path.js" ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/i18n/normalize-locale-path.js");

/***/ }),

/***/ "../mitt":
/*!***********************************************!*\
  !*** external "next/dist/shared/lib/mitt.js" ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/mitt.js");

/***/ }),

/***/ "../shared/lib/router-context":
/*!*********************************************************!*\
  !*** external "next/dist/shared/lib/router-context.js" ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router-context.js");

/***/ }),

/***/ "../shared/lib/router/utils/get-asset-path-from-route":
/*!*********************************************************************************!*\
  !*** external "next/dist/shared/lib/router/utils/get-asset-path-from-route.js" ***!
  \*********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/get-asset-path-from-route.js");

/***/ }),

/***/ "./utils/is-dynamic":
/*!******************************************************************!*\
  !*** external "next/dist/shared/lib/router/utils/is-dynamic.js" ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/is-dynamic.js");

/***/ }),

/***/ "./utils/parse-relative-url":
/*!**************************************************************************!*\
  !*** external "next/dist/shared/lib/router/utils/parse-relative-url.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/parse-relative-url.js");

/***/ }),

/***/ "./utils/querystring":
/*!*******************************************************************!*\
  !*** external "next/dist/shared/lib/router/utils/querystring.js" ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/querystring.js");

/***/ }),

/***/ "./utils/route-matcher":
/*!*********************************************************************!*\
  !*** external "next/dist/shared/lib/router/utils/route-matcher.js" ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/route-matcher.js");

/***/ }),

/***/ "./utils/route-regex":
/*!*******************************************************************!*\
  !*** external "next/dist/shared/lib/router/utils/route-regex.js" ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/route-regex.js");

/***/ }),

/***/ "../shared/lib/utils":
/*!************************************************!*\
  !*** external "next/dist/shared/lib/utils.js" ***!
  \************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/utils.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-is":
/*!***************************!*\
  !*** external "react-is" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-is");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "styled-components":
/*!************************************!*\
  !*** external "styled-components" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("styled-components");

/***/ }),

/***/ "?5c99":
/*!******************************************!*\
  !*** ./utils/resolve-rewrites (ignored) ***!
  \******************************************/
/***/ (() => {

/* (ignored) */

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/boards/[boardId]/index.jsx"));
module.exports = __webpack_exports__;

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUZNLENBQVQ7O0FBSUEsUUFBTXdCLFFBQVEsR0FBRyxDQUFDOUIsTUFBRCxFQUFTN1csT0FBVCxFQUFrQitXLFFBQWxCLEVBQTRCcUMsSUFBNUIsS0FBcUM7QUFDcERHLElBQUFBLFVBQVUsQ0FBQyxDQUFDO0FBQUUxQyxNQUFBQSxNQUFGO0FBQVU3VyxNQUFBQSxPQUFWO0FBQW1CK1csTUFBQUEsUUFBbkI7QUFBNkJLLE1BQUFBLFVBQVUsRUFBRWdDO0FBQXpDLEtBQUQsRUFBa0QsR0FBR0UsT0FBckQsQ0FBRCxDQUFWO0FBQ0QsR0FGRDs7QUFJQSxzQkFDRSw4REFBQyxTQUFEO0FBQUEsNEJBQ0UsOERBQUMsMERBQUQ7QUFBWSxjQUFRLEVBQUVYO0FBQXRCO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBREYsZUFFRSw4REFBQyx5REFBRDtBQUFXLGFBQU8sRUFBRVc7QUFBcEI7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFGRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFERjtBQU1ELENBbkJEOztBQXFCQSxpRUFBZXBCLEtBQWY7Ozs7Ozs7Ozs7O0FDakNBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9pbml0aWFsaXplZF9wcm9qZWN0Ly4vbm9kZV9tb2R1bGVzL25leHQvZGlzdC9jbGllbnQvbm9ybWFsaXplLXRyYWlsaW5nLXNsYXNoLmpzIiwid2VicGFjazovL2luaXRpYWxpemVkX3Byb2plY3QvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2NsaWVudC9yZXF1ZXN0LWlkbGUtY2FsbGJhY2suanMiLCJ3ZWJwYWNrOi8vaW5pdGlhbGl6ZWRfcHJvamVjdC8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvY2xpZW50L3JvdXRlLWxvYWRlci5qcyIsIndlYnBhY2s6Ly9pbml0aWFsaXplZF9wcm9qZWN0Ly4vbm9kZV9tb2R1bGVzL25leHQvZGlzdC9jbGllbnQvcm91dGVyLmpzIiwid2VicGFjazovL2luaXRpYWxpemVkX3Byb2plY3QvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2NsaWVudC93aXRoLXJvdXRlci5qcyIsIndlYnBhY2s6Ly9pbml0aWFsaXplZF9wcm9qZWN0Ly4vbm9kZV9tb2R1bGVzL25leHQvZGlzdC9zaGFyZWQvbGliL3JvdXRlci9yb3V0ZXIuanMiLCJ3ZWJwYWNrOi8vaW5pdGlhbGl6ZWRfcHJvamVjdC8uL3BhZ2VzL2JvYXJkcy9bYm9hcmRJZF0vaW5kZXguanN4Iiwid2VicGFjazovL2luaXRpYWxpemVkX3Byb2plY3QvLi9zcmMvY29tbW9uL2RhdGEvZHVtbXlCb2FyZERhdGEuanMiLCJ3ZWJwYWNrOi8vaW5pdGlhbGl6ZWRfcHJvamVjdC8uL3NyYy9jb21tb24vZGF0YS9kdW1teVJlcGx5RGF0YS5qcyIsIndlYnBhY2s6Ly9pbml0aWFsaXplZF9wcm9qZWN0Ly4vc3JjL2ZlYXR1cmUvYm9hcmQvY29tcG9uZW50L0RldGFpbEhlYWRlci5qc3giLCJ3ZWJwYWNrOi8vaW5pdGlhbGl6ZWRfcHJvamVjdC8uL3NyYy9mZWF0dXJlL2JvYXJkL3RlbXBsYXRlL0JvYXJkRGV0YWlsUGFnZS5qc3giLCJ3ZWJwYWNrOi8vaW5pdGlhbGl6ZWRfcHJvamVjdC8uL3NyYy9mZWF0dXJlL3JlcGx5L2NvbXBvbmVudC9SZXBseUlucHV0LmpzeCIsIndlYnBhY2s6Ly9pbml0aWFsaXplZF9wcm9qZWN0Ly4vc3JjL2ZlYXR1cmUvcmVwbHkvY29tcG9uZW50L1JlcGx5SXRlbS5qc3giLCJ3ZWJwYWNrOi8vaW5pdGlhbGl6ZWRfcHJvamVjdC8uL3NyYy9mZWF0dXJlL3JlcGx5L2NvbXBvbmVudC9SZXBseUxpc3QuanN4Iiwid2VicGFjazovL2luaXRpYWxpemVkX3Byb2plY3QvLi9zcmMvZmVhdHVyZS9yZXBseS90ZW1wbGF0ZS9SZXBseS5qc3giLCJ3ZWJwYWNrOi8vaW5pdGlhbGl6ZWRfcHJvamVjdC9leHRlcm5hbCBcIm5leHQvZGlzdC9zZXJ2ZXIvZGVub3JtYWxpemUtcGFnZS1wYXRoLmpzXCIiLCJ3ZWJwYWNrOi8vaW5pdGlhbGl6ZWRfcHJvamVjdC9leHRlcm5hbCBcIm5leHQvZGlzdC9zaGFyZWQvbGliL2kxOG4vbm9ybWFsaXplLWxvY2FsZS1wYXRoLmpzXCIiLCJ3ZWJwYWNrOi8vaW5pdGlhbGl6ZWRfcHJvamVjdC9leHRlcm5hbCBcIm5leHQvZGlzdC9zaGFyZWQvbGliL21pdHQuanNcIiIsIndlYnBhY2s6Ly9pbml0aWFsaXplZF9wcm9qZWN0L2V4dGVybmFsIFwibmV4dC9kaXN0L3NoYXJlZC9saWIvcm91dGVyLWNvbnRleHQuanNcIiIsIndlYnBhY2s6Ly9pbml0aWFsaXplZF9wcm9qZWN0L2V4dGVybmFsIFwibmV4dC9kaXN0L3NoYXJlZC9saWIvcm91dGVyL3V0aWxzL2dldC1hc3NldC1wYXRoLWZyb20tcm91dGUuanNcIiIsIndlYnBhY2s6Ly9pbml0aWFsaXplZF9wcm9qZWN0L2V4dGVybmFsIFwibmV4dC9kaXN0L3NoYXJlZC9saWIvcm91dGVyL3V0aWxzL2lzLWR5bmFtaWMuanNcIiIsIndlYnBhY2s6Ly9pbml0aWFsaXplZF9wcm9qZWN0L2V4dGVybmFsIFwibmV4dC9kaXN0L3NoYXJlZC9saWIvcm91dGVyL3V0aWxzL3BhcnNlLXJlbGF0aXZlLXVybC5qc1wiIiwid2VicGFjazovL2luaXRpYWxpemVkX3Byb2plY3QvZXh0ZXJuYWwgXCJuZXh0L2Rpc3Qvc2hhcmVkL2xpYi9yb3V0ZXIvdXRpbHMvcXVlcnlzdHJpbmcuanNcIiIsIndlYnBhY2s6Ly9pbml0aWFsaXplZF9wcm9qZWN0L2V4dGVybmFsIFwibmV4dC9kaXN0L3NoYXJlZC9saWIvcm91dGVyL3V0aWxzL3JvdXRlLW1hdGNoZXIuanNcIiIsIndlYnBhY2s6Ly9pbml0aWFsaXplZF9wcm9qZWN0L2V4dGVybmFsIFwibmV4dC9kaXN0L3NoYXJlZC9saWIvcm91dGVyL3V0aWxzL3JvdXRlLXJlZ2V4LmpzXCIiLCJ3ZWJwYWNrOi8vaW5pdGlhbGl6ZWRfcHJvamVjdC9leHRlcm5hbCBcIm5leHQvZGlzdC9zaGFyZWQvbGliL3V0aWxzLmpzXCIiLCJ3ZWJwYWNrOi8vaW5pdGlhbGl6ZWRfcHJvamVjdC9leHRlcm5hbCBcInJlYWN0XCIiLCJ3ZWJwYWNrOi8vaW5pdGlhbGl6ZWRfcHJvamVjdC9leHRlcm5hbCBcInJlYWN0LWlzXCIiLCJ3ZWJwYWNrOi8vaW5pdGlhbGl6ZWRfcHJvamVjdC9leHRlcm5hbCBcInJlYWN0L2pzeC1kZXYtcnVudGltZVwiIiwid2VicGFjazovL2luaXRpYWxpemVkX3Byb2plY3QvZXh0ZXJuYWwgXCJzdHlsZWQtY29tcG9uZW50c1wiIiwid2VicGFjazovL2luaXRpYWxpemVkX3Byb2plY3QvaWdub3JlZHxDOlxcVXNlcnNcXHFodDZcXERlc2t0b3BcXFBCUFxcYm9hcmRfcHJvamVjdF93ZWVrMVxcbm9kZV9tb2R1bGVzXFxuZXh0XFxkaXN0XFxzaGFyZWRcXGxpYlxccm91dGVyfC4vdXRpbHMvcmVzb2x2ZS1yZXdyaXRlcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMucmVtb3ZlUGF0aFRyYWlsaW5nU2xhc2ggPSByZW1vdmVQYXRoVHJhaWxpbmdTbGFzaDtcbmV4cG9ydHMubm9ybWFsaXplUGF0aFRyYWlsaW5nU2xhc2ggPSB2b2lkIDA7XG5mdW5jdGlvbiByZW1vdmVQYXRoVHJhaWxpbmdTbGFzaChwYXRoKSB7XG4gICAgcmV0dXJuIHBhdGguZW5kc1dpdGgoJy8nKSAmJiBwYXRoICE9PSAnLycgPyBwYXRoLnNsaWNlKDAsIC0xKSA6IHBhdGg7XG59XG5jb25zdCBub3JtYWxpemVQYXRoVHJhaWxpbmdTbGFzaCA9IHByb2Nlc3MuZW52Ll9fTkVYVF9UUkFJTElOR19TTEFTSCA/IChwYXRoKT0+e1xuICAgIGlmICgvXFwuW14vXStcXC8/JC8udGVzdChwYXRoKSkge1xuICAgICAgICByZXR1cm4gcmVtb3ZlUGF0aFRyYWlsaW5nU2xhc2gocGF0aCk7XG4gICAgfSBlbHNlIGlmIChwYXRoLmVuZHNXaXRoKCcvJykpIHtcbiAgICAgICAgcmV0dXJuIHBhdGg7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHBhdGggKyAnLyc7XG4gICAgfVxufSA6IHJlbW92ZVBhdGhUcmFpbGluZ1NsYXNoO1xuZXhwb3J0cy5ub3JtYWxpemVQYXRoVHJhaWxpbmdTbGFzaCA9IG5vcm1hbGl6ZVBhdGhUcmFpbGluZ1NsYXNoO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1ub3JtYWxpemUtdHJhaWxpbmctc2xhc2guanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLnJlcXVlc3RJZGxlQ2FsbGJhY2sgPSBleHBvcnRzLmNhbmNlbElkbGVDYWxsYmFjayA9IHZvaWQgMDtcbmNvbnN0IHJlcXVlc3RJZGxlQ2FsbGJhY2sgPSB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5yZXF1ZXN0SWRsZUNhbGxiYWNrICYmIHNlbGYucmVxdWVzdElkbGVDYWxsYmFjay5iaW5kKHdpbmRvdykgfHwgZnVuY3Rpb24oY2IpIHtcbiAgICBsZXQgc3RhcnQgPSBEYXRlLm5vdygpO1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBjYih7XG4gICAgICAgICAgICBkaWRUaW1lb3V0OiBmYWxzZSxcbiAgICAgICAgICAgIHRpbWVSZW1haW5pbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLm1heCgwLCA1MCAtIChEYXRlLm5vdygpIC0gc3RhcnQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSwgMSk7XG59O1xuZXhwb3J0cy5yZXF1ZXN0SWRsZUNhbGxiYWNrID0gcmVxdWVzdElkbGVDYWxsYmFjaztcbmNvbnN0IGNhbmNlbElkbGVDYWxsYmFjayA9IHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyAmJiBzZWxmLmNhbmNlbElkbGVDYWxsYmFjayAmJiBzZWxmLmNhbmNlbElkbGVDYWxsYmFjay5iaW5kKHdpbmRvdykgfHwgZnVuY3Rpb24oaWQpIHtcbiAgICByZXR1cm4gY2xlYXJUaW1lb3V0KGlkKTtcbn07XG5leHBvcnRzLmNhbmNlbElkbGVDYWxsYmFjayA9IGNhbmNlbElkbGVDYWxsYmFjaztcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVxdWVzdC1pZGxlLWNhbGxiYWNrLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5tYXJrQXNzZXRFcnJvciA9IG1hcmtBc3NldEVycm9yO1xuZXhwb3J0cy5pc0Fzc2V0RXJyb3IgPSBpc0Fzc2V0RXJyb3I7XG5leHBvcnRzLmdldENsaWVudEJ1aWxkTWFuaWZlc3QgPSBnZXRDbGllbnRCdWlsZE1hbmlmZXN0O1xuZXhwb3J0cy5jcmVhdGVSb3V0ZUxvYWRlciA9IGNyZWF0ZVJvdXRlTG9hZGVyO1xudmFyIF9nZXRBc3NldFBhdGhGcm9tUm91dGUgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuLi9zaGFyZWQvbGliL3JvdXRlci91dGlscy9nZXQtYXNzZXQtcGF0aC1mcm9tLXJvdXRlXCIpKTtcbnZhciBfcmVxdWVzdElkbGVDYWxsYmFjayA9IHJlcXVpcmUoXCIuL3JlcXVlc3QtaWRsZS1jYWxsYmFja1wiKTtcbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7XG4gICAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHtcbiAgICAgICAgZGVmYXVsdDogb2JqXG4gICAgfTtcbn1cbi8vIDMuOHMgd2FzIGFyYml0cmFyaWx5IGNob3NlbiBhcyBpdCdzIHdoYXQgaHR0cHM6Ly93ZWIuZGV2L2ludGVyYWN0aXZlXG4vLyBjb25zaWRlcnMgYXMgXCJHb29kXCIgdGltZS10by1pbnRlcmFjdGl2ZS4gV2UgbXVzdCBhc3N1bWUgc29tZXRoaW5nIHdlbnRcbi8vIHdyb25nIGJleW9uZCB0aGlzIHBvaW50LCBhbmQgdGhlbiBmYWxsLWJhY2sgdG8gYSBmdWxsIHBhZ2UgdHJhbnNpdGlvbiB0b1xuLy8gc2hvdyB0aGUgdXNlciBzb21ldGhpbmcgb2YgdmFsdWUuXG5jb25zdCBNU19NQVhfSURMRV9ERUxBWSA9IDM4MDA7XG5mdW5jdGlvbiB3aXRoRnV0dXJlKGtleSwgbWFwLCBnZW5lcmF0b3IpIHtcbiAgICBsZXQgZW50cnkgPSBtYXAuZ2V0KGtleSk7XG4gICAgaWYgKGVudHJ5KSB7XG4gICAgICAgIGlmICgnZnV0dXJlJyBpbiBlbnRyeSkge1xuICAgICAgICAgICAgcmV0dXJuIGVudHJ5LmZ1dHVyZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGVudHJ5KTtcbiAgICB9XG4gICAgbGV0IHJlc29sdmVyO1xuICAgIGNvbnN0IHByb20gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSk9PntcbiAgICAgICAgcmVzb2x2ZXIgPSByZXNvbHZlO1xuICAgIH0pO1xuICAgIG1hcC5zZXQoa2V5LCBlbnRyeSA9IHtcbiAgICAgICAgcmVzb2x2ZTogcmVzb2x2ZXIsXG4gICAgICAgIGZ1dHVyZTogcHJvbVxuICAgIH0pO1xuICAgIHJldHVybiBnZW5lcmF0b3IgPyBnZW5lcmF0b3IoKS50aGVuKCh2YWx1ZSk9PihyZXNvbHZlcih2YWx1ZSksIHZhbHVlKVxuICAgICkgOiBwcm9tO1xufVxuZnVuY3Rpb24gaGFzUHJlZmV0Y2gobGluaykge1xuICAgIHRyeSB7XG4gICAgICAgIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XG4gICAgICAgIHJldHVybigvLyBkZXRlY3QgSUUxMSBzaW5jZSBpdCBzdXBwb3J0cyBwcmVmZXRjaCBidXQgaXNuJ3QgZGV0ZWN0ZWRcbiAgICAgICAgLy8gd2l0aCByZWxMaXN0LnN1cHBvcnRcbiAgICAgICAgKCEhd2luZG93Lk1TSW5wdXRNZXRob2RDb250ZXh0ICYmICEhZG9jdW1lbnQuZG9jdW1lbnRNb2RlKSB8fCBsaW5rLnJlbExpc3Quc3VwcG9ydHMoJ3ByZWZldGNoJykpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cbmNvbnN0IGNhblByZWZldGNoID0gaGFzUHJlZmV0Y2goKTtcbmZ1bmN0aW9uIHByZWZldGNoVmlhRG9tKGhyZWYsIGFzLCBsaW5rKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaik9PntcbiAgICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGxpbmtbcmVsPVwicHJlZmV0Y2hcIl1baHJlZl49XCIke2hyZWZ9XCJdYCkpIHtcbiAgICAgICAgICAgIHJldHVybiByZXMoKTtcbiAgICAgICAgfVxuICAgICAgICBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuICAgICAgICAvLyBUaGUgb3JkZXIgb2YgcHJvcGVydHkgYXNzaWdubWVudCBoZXJlIGlzIGludGVudGlvbmFsOlxuICAgICAgICBpZiAoYXMpIGxpbmsuYXMgPSBhcztcbiAgICAgICAgbGluay5yZWwgPSBgcHJlZmV0Y2hgO1xuICAgICAgICBsaW5rLmNyb3NzT3JpZ2luID0gcHJvY2Vzcy5lbnYuX19ORVhUX0NST1NTX09SSUdJTjtcbiAgICAgICAgbGluay5vbmxvYWQgPSByZXM7XG4gICAgICAgIGxpbmsub25lcnJvciA9IHJlajtcbiAgICAgICAgLy8gYGhyZWZgIHNob3VsZCBhbHdheXMgYmUgbGFzdDpcbiAgICAgICAgbGluay5ocmVmID0gaHJlZjtcbiAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICB9KTtcbn1cbmNvbnN0IEFTU0VUX0xPQURfRVJST1IgPSBTeW1ib2woJ0FTU0VUX0xPQURfRVJST1InKTtcbmZ1bmN0aW9uIG1hcmtBc3NldEVycm9yKGVycikge1xuICAgIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXJyLCBBU1NFVF9MT0FEX0VSUk9SLCB7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBpc0Fzc2V0RXJyb3IoZXJyKSB7XG4gICAgcmV0dXJuIGVyciAmJiBBU1NFVF9MT0FEX0VSUk9SIGluIGVycjtcbn1cbmZ1bmN0aW9uIGFwcGVuZFNjcmlwdChzcmMsIHNjcmlwdCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xuICAgICAgICBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgLy8gVGhlIG9yZGVyIG9mIHByb3BlcnR5IGFzc2lnbm1lbnQgaGVyZSBpcyBpbnRlbnRpb25hbC5cbiAgICAgICAgLy8gMS4gU2V0dXAgc3VjY2Vzcy9mYWlsdXJlIGhvb2tzIGluIGNhc2UgdGhlIGJyb3dzZXIgc3luY2hyb25vdXNseVxuICAgICAgICAvLyAgICBleGVjdXRlcyB3aGVuIGBzcmNgIGlzIHNldC5cbiAgICAgICAgc2NyaXB0Lm9ubG9hZCA9IHJlc29sdmU7XG4gICAgICAgIHNjcmlwdC5vbmVycm9yID0gKCk9PnJlamVjdChtYXJrQXNzZXRFcnJvcihuZXcgRXJyb3IoYEZhaWxlZCB0byBsb2FkIHNjcmlwdDogJHtzcmN9YCkpKVxuICAgICAgICA7XG4gICAgICAgIC8vIDIuIENvbmZpZ3VyZSB0aGUgY3Jvc3Mtb3JpZ2luIGF0dHJpYnV0ZSBiZWZvcmUgc2V0dGluZyBgc3JjYCBpbiBjYXNlIHRoZVxuICAgICAgICAvLyAgICBicm93c2VyIGJlZ2lucyB0byBmZXRjaC5cbiAgICAgICAgc2NyaXB0LmNyb3NzT3JpZ2luID0gcHJvY2Vzcy5lbnYuX19ORVhUX0NST1NTX09SSUdJTjtcbiAgICAgICAgLy8gMy4gRmluYWxseSwgc2V0IHRoZSBzb3VyY2UgYW5kIGluamVjdCBpbnRvIHRoZSBET00gaW4gY2FzZSB0aGUgY2hpbGRcbiAgICAgICAgLy8gICAgbXVzdCBiZSBhcHBlbmRlZCBmb3IgZmV0Y2hpbmcgdG8gc3RhcnQuXG4gICAgICAgIHNjcmlwdC5zcmMgPSBzcmM7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICB9KTtcbn1cbi8vIFdlIHdhaXQgZm9yIHBhZ2VzIHRvIGJlIGJ1aWx0IGluIGRldiBiZWZvcmUgd2Ugc3RhcnQgdGhlIHJvdXRlIHRyYW5zaXRpb25cbi8vIHRpbWVvdXQgdG8gcHJldmVudCBhbiB1bi1uZWNlc3NhcnkgaGFyZCBuYXZpZ2F0aW9uIGluIGRldmVsb3BtZW50LlxubGV0IGRldkJ1aWxkUHJvbWlzZTtcbi8vIFJlc29sdmUgYSBwcm9taXNlIHRoYXQgdGltZXMgb3V0IGFmdGVyIGdpdmVuIGFtb3VudCBvZiBtaWxsaXNlY29uZHMuXG5mdW5jdGlvbiByZXNvbHZlUHJvbWlzZVdpdGhUaW1lb3V0KHAsIG1zLCBlcnIpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcbiAgICAgICAgbGV0IGNhbmNlbGxlZCA9IGZhbHNlO1xuICAgICAgICBwLnRoZW4oKHIpPT57XG4gICAgICAgICAgICAvLyBSZXNvbHZlZCwgY2FuY2VsIHRoZSB0aW1lb3V0XG4gICAgICAgICAgICBjYW5jZWxsZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmVzb2x2ZShyKTtcbiAgICAgICAgfSkuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgLy8gV2Ugd3JhcCB0aGVzZSBjaGVja3Mgc2VwYXJhdGVseSBmb3IgYmV0dGVyIGRlYWQtY29kZSBlbGltaW5hdGlvbiBpblxuICAgICAgICAvLyBwcm9kdWN0aW9uIGJ1bmRsZXMuXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgICAgICAgICAgKGRldkJ1aWxkUHJvbWlzZSB8fCBQcm9taXNlLnJlc29sdmUoKSkudGhlbigoKT0+e1xuICAgICAgICAgICAgICAgICgwLCBfcmVxdWVzdElkbGVDYWxsYmFjaykucmVxdWVzdElkbGVDYWxsYmFjaygoKT0+c2V0VGltZW91dCgoKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjYW5jZWxsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwgbXMpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ2RldmVsb3BtZW50Jykge1xuICAgICAgICAgICAgKDAsIF9yZXF1ZXN0SWRsZUNhbGxiYWNrKS5yZXF1ZXN0SWRsZUNhbGxiYWNrKCgpPT5zZXRUaW1lb3V0KCgpPT57XG4gICAgICAgICAgICAgICAgICAgIGlmICghY2FuY2VsbGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIG1zKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuZnVuY3Rpb24gZ2V0Q2xpZW50QnVpbGRNYW5pZmVzdCgpIHtcbiAgICBpZiAoc2VsZi5fX0JVSUxEX01BTklGRVNUKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoc2VsZi5fX0JVSUxEX01BTklGRVNUKTtcbiAgICB9XG4gICAgY29uc3Qgb25CdWlsZE1hbmlmZXN0ID0gbmV3IFByb21pc2UoKHJlc29sdmUpPT57XG4gICAgICAgIC8vIE1hbmRhdG9yeSBiZWNhdXNlIHRoaXMgaXMgbm90IGNvbmN1cnJlbnQgc2FmZTpcbiAgICAgICAgY29uc3QgY2IgPSBzZWxmLl9fQlVJTERfTUFOSUZFU1RfQ0I7XG4gICAgICAgIHNlbGYuX19CVUlMRF9NQU5JRkVTVF9DQiA9ICgpPT57XG4gICAgICAgICAgICByZXNvbHZlKHNlbGYuX19CVUlMRF9NQU5JRkVTVCk7XG4gICAgICAgICAgICBjYiAmJiBjYigpO1xuICAgICAgICB9O1xuICAgIH0pO1xuICAgIHJldHVybiByZXNvbHZlUHJvbWlzZVdpdGhUaW1lb3V0KG9uQnVpbGRNYW5pZmVzdCwgTVNfTUFYX0lETEVfREVMQVksIG1hcmtBc3NldEVycm9yKG5ldyBFcnJvcignRmFpbGVkIHRvIGxvYWQgY2xpZW50IGJ1aWxkIG1hbmlmZXN0JykpKTtcbn1cbmZ1bmN0aW9uIGdldEZpbGVzRm9yUm91dGUoYXNzZXRQcmVmaXgsIHJvdXRlKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe1xuICAgICAgICAgICAgc2NyaXB0czogW1xuICAgICAgICAgICAgICAgIGFzc2V0UHJlZml4ICsgJy9fbmV4dC9zdGF0aWMvY2h1bmtzL3BhZ2VzJyArIGVuY29kZVVSSSgoMCwgX2dldEFzc2V0UGF0aEZyb21Sb3V0ZSkuZGVmYXVsdChyb3V0ZSwgJy5qcycpKSwgXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgLy8gU3R5bGVzIGFyZSBoYW5kbGVkIGJ5IGBzdHlsZS1sb2FkZXJgIGluIGRldmVsb3BtZW50OlxuICAgICAgICAgICAgY3NzOiBbXVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGdldENsaWVudEJ1aWxkTWFuaWZlc3QoKS50aGVuKChtYW5pZmVzdCk9PntcbiAgICAgICAgaWYgKCEocm91dGUgaW4gbWFuaWZlc3QpKSB7XG4gICAgICAgICAgICB0aHJvdyBtYXJrQXNzZXRFcnJvcihuZXcgRXJyb3IoYEZhaWxlZCB0byBsb29rdXAgcm91dGU6ICR7cm91dGV9YCkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFsbEZpbGVzID0gbWFuaWZlc3Rbcm91dGVdLm1hcCgoZW50cnkpPT5hc3NldFByZWZpeCArICcvX25leHQvJyArIGVuY29kZVVSSShlbnRyeSlcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNjcmlwdHM6IGFsbEZpbGVzLmZpbHRlcigodik9PnYuZW5kc1dpdGgoJy5qcycpXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgY3NzOiBhbGxGaWxlcy5maWx0ZXIoKHYpPT52LmVuZHNXaXRoKCcuY3NzJylcbiAgICAgICAgICAgIClcbiAgICAgICAgfTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVJvdXRlTG9hZGVyKGFzc2V0UHJlZml4KSB7XG4gICAgY29uc3QgZW50cnlwb2ludHMgPSBuZXcgTWFwKCk7XG4gICAgY29uc3QgbG9hZGVkU2NyaXB0cyA9IG5ldyBNYXAoKTtcbiAgICBjb25zdCBzdHlsZVNoZWV0cyA9IG5ldyBNYXAoKTtcbiAgICBjb25zdCByb3V0ZXMgPSBuZXcgTWFwKCk7XG4gICAgZnVuY3Rpb24gbWF5YmVFeGVjdXRlU2NyaXB0KHNyYykge1xuICAgICAgICBsZXQgcHJvbSA9IGxvYWRlZFNjcmlwdHMuZ2V0KHNyYyk7XG4gICAgICAgIGlmIChwcm9tKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvbTtcbiAgICAgICAgfVxuICAgICAgICAvLyBTa2lwIGV4ZWN1dGluZyBzY3JpcHQgaWYgaXQncyBhbHJlYWR5IGluIHRoZSBET006XG4gICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBzY3JpcHRbc3JjXj1cIiR7c3JjfVwiXWApKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgbG9hZGVkU2NyaXB0cy5zZXQoc3JjLCBwcm9tID0gYXBwZW5kU2NyaXB0KHNyYykpO1xuICAgICAgICByZXR1cm4gcHJvbTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZmV0Y2hTdHlsZVNoZWV0KGhyZWYpIHtcbiAgICAgICAgbGV0IHByb20gPSBzdHlsZVNoZWV0cy5nZXQoaHJlZik7XG4gICAgICAgIGlmIChwcm9tKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvbTtcbiAgICAgICAgfVxuICAgICAgICBzdHlsZVNoZWV0cy5zZXQoaHJlZiwgcHJvbSA9IGZldGNoKGhyZWYpLnRoZW4oKHJlcyk9PntcbiAgICAgICAgICAgIGlmICghcmVzLm9rKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gbG9hZCBzdHlsZXNoZWV0OiAke2hyZWZ9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzLnRleHQoKS50aGVuKCh0ZXh0KT0+KHtcbiAgICAgICAgICAgICAgICAgICAgaHJlZjogaHJlZixcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogdGV4dFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9KS5jYXRjaCgoZXJyKT0+e1xuICAgICAgICAgICAgdGhyb3cgbWFya0Fzc2V0RXJyb3IoZXJyKTtcbiAgICAgICAgfSkpO1xuICAgICAgICByZXR1cm4gcHJvbTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgd2hlbkVudHJ5cG9pbnQgKHJvdXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gd2l0aEZ1dHVyZShyb3V0ZSwgZW50cnlwb2ludHMpO1xuICAgICAgICB9LFxuICAgICAgICBvbkVudHJ5cG9pbnQgKHJvdXRlLCBleGVjdXRlKSB7XG4gICAgICAgICAgICBQcm9taXNlLnJlc29sdmUoZXhlY3V0ZSkudGhlbigoZm4pPT5mbigpXG4gICAgICAgICAgICApLnRoZW4oKGV4cG9ydHMpPT4oe1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQ6IGV4cG9ydHMgJiYgZXhwb3J0cy5kZWZhdWx0IHx8IGV4cG9ydHMsXG4gICAgICAgICAgICAgICAgICAgIGV4cG9ydHM6IGV4cG9ydHNcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgLCAoZXJyKT0+KHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGVyclxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApLnRoZW4oKGlucHV0KT0+e1xuICAgICAgICAgICAgICAgIGNvbnN0IG9sZCA9IGVudHJ5cG9pbnRzLmdldChyb3V0ZSk7XG4gICAgICAgICAgICAgICAgZW50cnlwb2ludHMuc2V0KHJvdXRlLCBpbnB1dCk7XG4gICAgICAgICAgICAgICAgaWYgKG9sZCAmJiAncmVzb2x2ZScgaW4gb2xkKSBvbGQucmVzb2x2ZShpbnB1dCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgbG9hZFJvdXRlIChyb3V0ZSwgcHJlZmV0Y2gpIHtcbiAgICAgICAgICAgIHJldHVybiB3aXRoRnV0dXJlKHJvdXRlLCByb3V0ZXMsICgpPT57XG4gICAgICAgICAgICAgICAgY29uc3Qgcm91dGVGaWxlc1Byb21pc2UgPSBnZXRGaWxlc0ZvclJvdXRlKGFzc2V0UHJlZml4LCByb3V0ZSkudGhlbigoeyBzY3JpcHRzICwgY3NzICB9KT0+e1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgICAgICAgICAgICAgZW50cnlwb2ludHMuaGFzKHJvdXRlKSA/IFtdIDogUHJvbWlzZS5hbGwoc2NyaXB0cy5tYXAobWF5YmVFeGVjdXRlU2NyaXB0KSksXG4gICAgICAgICAgICAgICAgICAgICAgICBQcm9taXNlLmFsbChjc3MubWFwKGZldGNoU3R5bGVTaGVldCkpLCBcbiAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgfSkudGhlbigocmVzKT0+e1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy53aGVuRW50cnlwb2ludChyb3V0ZSkudGhlbigoZW50cnlwb2ludCk9Pih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50cnlwb2ludCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZXM6IHJlc1sxXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICAgICAgICAgICAgICAgICAgZGV2QnVpbGRQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm91dGVGaWxlc1Byb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcm91dGVGaWxlc1Byb21pc2UuZmluYWxseSgoKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZVByb21pc2VXaXRoVGltZW91dChyb3V0ZUZpbGVzUHJvbWlzZSwgTVNfTUFYX0lETEVfREVMQVksIG1hcmtBc3NldEVycm9yKG5ldyBFcnJvcihgUm91dGUgZGlkIG5vdCBjb21wbGV0ZSBsb2FkaW5nOiAke3JvdXRlfWApKSkudGhlbigoeyBlbnRyeXBvaW50ICwgc3R5bGVzICB9KT0+e1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlczogc3R5bGVzXG4gICAgICAgICAgICAgICAgICAgIH0sIGVudHJ5cG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2Vycm9yJyBpbiBlbnRyeXBvaW50ID8gZW50cnlwb2ludCA6IHJlcztcbiAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyKT0+e1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJlZmV0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIGRvbid0IHdhbnQgdG8gY2FjaGUgZXJyb3JzIGR1cmluZyBwcmVmZXRjaFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgcHJlZmV0Y2ggKHJvdXRlKSB7XG4gICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vR29vZ2xlQ2hyb21lTGFicy9xdWlja2xpbmsvYmxvYi80NTNhNjYxZmExZmE5NDBlMmQyZTA0NDQ1MjM5OGUzOGM2N2E5OGZiL3NyYy9pbmRleC5tanMjTDExNS1MMTE4XG4gICAgICAgICAgICAvLyBMaWNlbnNlOiBBcGFjaGUgMi4wXG4gICAgICAgICAgICBsZXQgY247XG4gICAgICAgICAgICBpZiAoY24gPSBuYXZpZ2F0b3IuY29ubmVjdGlvbikge1xuICAgICAgICAgICAgICAgIC8vIERvbid0IHByZWZldGNoIGlmIHVzaW5nIDJHIG9yIGlmIFNhdmUtRGF0YSBpcyBlbmFibGVkLlxuICAgICAgICAgICAgICAgIGlmIChjbi5zYXZlRGF0YSB8fCAvMmcvLnRlc3QoY24uZWZmZWN0aXZlVHlwZSkpIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBnZXRGaWxlc0ZvclJvdXRlKGFzc2V0UHJlZml4LCByb3V0ZSkudGhlbigob3V0cHV0KT0+UHJvbWlzZS5hbGwoY2FuUHJlZmV0Y2ggPyBvdXRwdXQuc2NyaXB0cy5tYXAoKHNjcmlwdCk9PnByZWZldGNoVmlhRG9tKHNjcmlwdCwgJ3NjcmlwdCcpXG4gICAgICAgICAgICAgICAgKSA6IFtdKVxuICAgICAgICAgICAgKS50aGVuKCgpPT57XG4gICAgICAgICAgICAgICAgKDAsIF9yZXF1ZXN0SWRsZUNhbGxiYWNrKS5yZXF1ZXN0SWRsZUNhbGxiYWNrKCgpPT50aGlzLmxvYWRSb3V0ZShyb3V0ZSwgdHJ1ZSkuY2F0Y2goKCk9PntcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSkuY2F0Y2goLy8gc3dhbGxvdyBwcmVmZXRjaCBlcnJvcnNcbiAgICAgICAgICAgICgpPT57XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJvdXRlLWxvYWRlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIlJvdXRlclwiLCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gX3JvdXRlci5kZWZhdWx0O1xuICAgIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwid2l0aFJvdXRlclwiLCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gX3dpdGhSb3V0ZXIuZGVmYXVsdDtcbiAgICB9XG59KTtcbmV4cG9ydHMudXNlUm91dGVyID0gdXNlUm91dGVyO1xuZXhwb3J0cy5jcmVhdGVSb3V0ZXIgPSBjcmVhdGVSb3V0ZXI7XG5leHBvcnRzLm1ha2VQdWJsaWNSb3V0ZXJJbnN0YW5jZSA9IG1ha2VQdWJsaWNSb3V0ZXJJbnN0YW5jZTtcbmV4cG9ydHMuZGVmYXVsdCA9IHZvaWQgMDtcbnZhciBfcmVhY3QgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJyZWFjdFwiKSk7XG52YXIgX3JvdXRlciA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uL3NoYXJlZC9saWIvcm91dGVyL3JvdXRlclwiKSk7XG52YXIgX3JvdXRlckNvbnRleHQgPSByZXF1aXJlKFwiLi4vc2hhcmVkL2xpYi9yb3V0ZXItY29udGV4dFwiKTtcbnZhciBfd2l0aFJvdXRlciA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vd2l0aC1yb3V0ZXJcIikpO1xuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgICByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDoge1xuICAgICAgICBkZWZhdWx0OiBvYmpcbiAgICB9O1xufVxuY29uc3Qgc2luZ2xldG9uUm91dGVyID0ge1xuICAgIHJvdXRlcjogbnVsbCxcbiAgICByZWFkeUNhbGxiYWNrczogW10sXG4gICAgcmVhZHkgKGNiKSB7XG4gICAgICAgIGlmICh0aGlzLnJvdXRlcikgcmV0dXJuIGNiKCk7XG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5yZWFkeUNhbGxiYWNrcy5wdXNoKGNiKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG4vLyBDcmVhdGUgcHVibGljIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMgb2YgdGhlIHJvdXRlciBpbiB0aGUgc2luZ2xldG9uUm91dGVyXG5jb25zdCB1cmxQcm9wZXJ0eUZpZWxkcyA9IFtcbiAgICAncGF0aG5hbWUnLFxuICAgICdyb3V0ZScsXG4gICAgJ3F1ZXJ5JyxcbiAgICAnYXNQYXRoJyxcbiAgICAnY29tcG9uZW50cycsXG4gICAgJ2lzRmFsbGJhY2snLFxuICAgICdiYXNlUGF0aCcsXG4gICAgJ2xvY2FsZScsXG4gICAgJ2xvY2FsZXMnLFxuICAgICdkZWZhdWx0TG9jYWxlJyxcbiAgICAnaXNSZWFkeScsXG4gICAgJ2lzUHJldmlldycsXG4gICAgJ2lzTG9jYWxlRG9tYWluJyxcbiAgICAnZG9tYWluTG9jYWxlcycsIFxuXTtcbmNvbnN0IHJvdXRlckV2ZW50cyA9IFtcbiAgICAncm91dGVDaGFuZ2VTdGFydCcsXG4gICAgJ2JlZm9yZUhpc3RvcnlDaGFuZ2UnLFxuICAgICdyb3V0ZUNoYW5nZUNvbXBsZXRlJyxcbiAgICAncm91dGVDaGFuZ2VFcnJvcicsXG4gICAgJ2hhc2hDaGFuZ2VTdGFydCcsXG4gICAgJ2hhc2hDaGFuZ2VDb21wbGV0ZScsIFxuXTtcbmNvbnN0IGNvcmVNZXRob2RGaWVsZHMgPSBbXG4gICAgJ3B1c2gnLFxuICAgICdyZXBsYWNlJyxcbiAgICAncmVsb2FkJyxcbiAgICAnYmFjaycsXG4gICAgJ3ByZWZldGNoJyxcbiAgICAnYmVmb3JlUG9wU3RhdGUnLCBcbl07XG4vLyBFdmVudHMgaXMgYSBzdGF0aWMgcHJvcGVydHkgb24gdGhlIHJvdXRlciwgdGhlIHJvdXRlciBkb2Vzbid0IGhhdmUgdG8gYmUgaW5pdGlhbGl6ZWQgdG8gdXNlIGl0XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoc2luZ2xldG9uUm91dGVyLCAnZXZlbnRzJywge1xuICAgIGdldCAoKSB7XG4gICAgICAgIHJldHVybiBfcm91dGVyLmRlZmF1bHQuZXZlbnRzO1xuICAgIH1cbn0pO1xudXJsUHJvcGVydHlGaWVsZHMuZm9yRWFjaCgoZmllbGQpPT57XG4gICAgLy8gSGVyZSB3ZSBuZWVkIHRvIHVzZSBPYmplY3QuZGVmaW5lUHJvcGVydHkgYmVjYXVzZSB3ZSBuZWVkIHRvIHJldHVyblxuICAgIC8vIHRoZSBwcm9wZXJ0eSBhc3NpZ25lZCB0byB0aGUgYWN0dWFsIHJvdXRlclxuICAgIC8vIFRoZSB2YWx1ZSBtaWdodCBnZXQgY2hhbmdlZCBhcyB3ZSBjaGFuZ2Ugcm91dGVzIGFuZCB0aGlzIGlzIHRoZVxuICAgIC8vIHByb3BlciB3YXkgdG8gYWNjZXNzIGl0XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHNpbmdsZXRvblJvdXRlciwgZmllbGQsIHtcbiAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgIGNvbnN0IHJvdXRlciA9IGdldFJvdXRlcigpO1xuICAgICAgICAgICAgcmV0dXJuIHJvdXRlcltmaWVsZF07XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuY29yZU1ldGhvZEZpZWxkcy5mb3JFYWNoKChmaWVsZCk9PntcbiAgICBzaW5nbGV0b25Sb3V0ZXJbZmllbGRdID0gKC4uLmFyZ3MpPT57XG4gICAgICAgIGNvbnN0IHJvdXRlciA9IGdldFJvdXRlcigpO1xuICAgICAgICByZXR1cm4gcm91dGVyW2ZpZWxkXSguLi5hcmdzKTtcbiAgICB9O1xufSk7XG5yb3V0ZXJFdmVudHMuZm9yRWFjaCgoZXZlbnQpPT57XG4gICAgc2luZ2xldG9uUm91dGVyLnJlYWR5KCgpPT57XG4gICAgICAgIF9yb3V0ZXIuZGVmYXVsdC5ldmVudHMub24oZXZlbnQsICguLi5hcmdzKT0+e1xuICAgICAgICAgICAgY29uc3QgZXZlbnRGaWVsZCA9IGBvbiR7ZXZlbnQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCl9JHtldmVudC5zdWJzdHJpbmcoMSl9YDtcbiAgICAgICAgICAgIGNvbnN0IF9zaW5nbGV0b25Sb3V0ZXIgPSBzaW5nbGV0b25Sb3V0ZXI7XG4gICAgICAgICAgICBpZiAoX3NpbmdsZXRvblJvdXRlcltldmVudEZpZWxkXSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIF9zaW5nbGV0b25Sb3V0ZXJbZXZlbnRGaWVsZF0oLi4uYXJncyk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIHdoZW4gcnVubmluZyB0aGUgUm91dGVyIGV2ZW50OiAke2V2ZW50RmllbGR9YCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7ZXJyLm1lc3NhZ2V9XFxuJHtlcnIuc3RhY2t9YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuZnVuY3Rpb24gZ2V0Um91dGVyKCkge1xuICAgIGlmICghc2luZ2xldG9uUm91dGVyLnJvdXRlcikge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gJ05vIHJvdXRlciBpbnN0YW5jZSBmb3VuZC5cXG4nICsgJ1lvdSBzaG91bGQgb25seSB1c2UgXCJuZXh0L3JvdXRlclwiIG9uIHRoZSBjbGllbnQgc2lkZSBvZiB5b3VyIGFwcC5cXG4nO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfVxuICAgIHJldHVybiBzaW5nbGV0b25Sb3V0ZXIucm91dGVyO1xufVxudmFyIF9kZWZhdWx0ID0gc2luZ2xldG9uUm91dGVyO1xuZXhwb3J0cy5kZWZhdWx0ID0gX2RlZmF1bHQ7XG5mdW5jdGlvbiB1c2VSb3V0ZXIoKSB7XG4gICAgcmV0dXJuIF9yZWFjdC5kZWZhdWx0LnVzZUNvbnRleHQoX3JvdXRlckNvbnRleHQuUm91dGVyQ29udGV4dCk7XG59XG5mdW5jdGlvbiBjcmVhdGVSb3V0ZXIoLi4uYXJncykge1xuICAgIHNpbmdsZXRvblJvdXRlci5yb3V0ZXIgPSBuZXcgX3JvdXRlci5kZWZhdWx0KC4uLmFyZ3MpO1xuICAgIHNpbmdsZXRvblJvdXRlci5yZWFkeUNhbGxiYWNrcy5mb3JFYWNoKChjYik9PmNiKClcbiAgICApO1xuICAgIHNpbmdsZXRvblJvdXRlci5yZWFkeUNhbGxiYWNrcyA9IFtdO1xuICAgIHJldHVybiBzaW5nbGV0b25Sb3V0ZXIucm91dGVyO1xufVxuZnVuY3Rpb24gbWFrZVB1YmxpY1JvdXRlckluc3RhbmNlKHJvdXRlcikge1xuICAgIGNvbnN0IF9yb3V0ZXIxID0gcm91dGVyO1xuICAgIGNvbnN0IGluc3RhbmNlID0ge1xuICAgIH07XG4gICAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiB1cmxQcm9wZXJ0eUZpZWxkcyl7XG4gICAgICAgIGlmICh0eXBlb2YgX3JvdXRlcjFbcHJvcGVydHldID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaW5zdGFuY2VbcHJvcGVydHldID0gT2JqZWN0LmFzc2lnbihBcnJheS5pc0FycmF5KF9yb3V0ZXIxW3Byb3BlcnR5XSkgPyBbXSA6IHtcbiAgICAgICAgICAgIH0sIF9yb3V0ZXIxW3Byb3BlcnR5XSkgLy8gbWFrZXMgc3VyZSBxdWVyeSBpcyBub3Qgc3RhdGVmdWxcbiAgICAgICAgICAgIDtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGluc3RhbmNlW3Byb3BlcnR5XSA9IF9yb3V0ZXIxW3Byb3BlcnR5XTtcbiAgICB9XG4gICAgLy8gRXZlbnRzIGlzIGEgc3RhdGljIHByb3BlcnR5IG9uIHRoZSByb3V0ZXIsIHRoZSByb3V0ZXIgZG9lc24ndCBoYXZlIHRvIGJlIGluaXRpYWxpemVkIHRvIHVzZSBpdFxuICAgIGluc3RhbmNlLmV2ZW50cyA9IF9yb3V0ZXIuZGVmYXVsdC5ldmVudHM7XG4gICAgY29yZU1ldGhvZEZpZWxkcy5mb3JFYWNoKChmaWVsZCk9PntcbiAgICAgICAgaW5zdGFuY2VbZmllbGRdID0gKC4uLmFyZ3MpPT57XG4gICAgICAgICAgICByZXR1cm4gX3JvdXRlcjFbZmllbGRdKC4uLmFyZ3MpO1xuICAgICAgICB9O1xuICAgIH0pO1xuICAgIHJldHVybiBpbnN0YW5jZTtcbn1cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cm91dGVyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gd2l0aFJvdXRlcjtcbnZhciBfcmVhY3QgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCJyZWFjdFwiKSk7XG52YXIgX3JvdXRlciA9IHJlcXVpcmUoXCIuL3JvdXRlclwiKTtcbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7XG4gICAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHtcbiAgICAgICAgZGVmYXVsdDogb2JqXG4gICAgfTtcbn1cbmZ1bmN0aW9uIHdpdGhSb3V0ZXIoQ29tcG9zZWRDb21wb25lbnQpIHtcbiAgICBmdW5jdGlvbiBXaXRoUm91dGVyV3JhcHBlcihwcm9wcykge1xuICAgICAgICByZXR1cm4oLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KENvbXBvc2VkQ29tcG9uZW50LCBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgIHJvdXRlcjogKDAsIF9yb3V0ZXIpLnVzZVJvdXRlcigpXG4gICAgICAgIH0sIHByb3BzKSkpO1xuICAgIH1cbiAgICBXaXRoUm91dGVyV3JhcHBlci5nZXRJbml0aWFsUHJvcHMgPSBDb21wb3NlZENvbXBvbmVudC5nZXRJbml0aWFsUHJvcHM7XG4gICAgV2l0aFJvdXRlcldyYXBwZXIub3JpZ0dldEluaXRpYWxQcm9wcyA9IENvbXBvc2VkQ29tcG9uZW50Lm9yaWdHZXRJbml0aWFsUHJvcHM7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IENvbXBvc2VkQ29tcG9uZW50LmRpc3BsYXlOYW1lIHx8IENvbXBvc2VkQ29tcG9uZW50Lm5hbWUgfHwgJ1Vua25vd24nO1xuICAgICAgICBXaXRoUm91dGVyV3JhcHBlci5kaXNwbGF5TmFtZSA9IGB3aXRoUm91dGVyKCR7bmFtZX0pYDtcbiAgICB9XG4gICAgcmV0dXJuIFdpdGhSb3V0ZXJXcmFwcGVyO1xufVxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD13aXRoLXJvdXRlci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZ2V0RG9tYWluTG9jYWxlID0gZ2V0RG9tYWluTG9jYWxlO1xuZXhwb3J0cy5hZGRMb2NhbGUgPSBhZGRMb2NhbGU7XG5leHBvcnRzLmRlbExvY2FsZSA9IGRlbExvY2FsZTtcbmV4cG9ydHMuaGFzQmFzZVBhdGggPSBoYXNCYXNlUGF0aDtcbmV4cG9ydHMuYWRkQmFzZVBhdGggPSBhZGRCYXNlUGF0aDtcbmV4cG9ydHMuZGVsQmFzZVBhdGggPSBkZWxCYXNlUGF0aDtcbmV4cG9ydHMuaXNMb2NhbFVSTCA9IGlzTG9jYWxVUkw7XG5leHBvcnRzLmludGVycG9sYXRlQXMgPSBpbnRlcnBvbGF0ZUFzO1xuZXhwb3J0cy5yZXNvbHZlSHJlZiA9IHJlc29sdmVIcmVmO1xuZXhwb3J0cy5kZWZhdWx0ID0gdm9pZCAwO1xudmFyIF9ub3JtYWxpemVUcmFpbGluZ1NsYXNoID0gcmVxdWlyZShcIi4uLy4uLy4uL2NsaWVudC9ub3JtYWxpemUtdHJhaWxpbmctc2xhc2hcIik7XG52YXIgX3JvdXRlTG9hZGVyID0gcmVxdWlyZShcIi4uLy4uLy4uL2NsaWVudC9yb3V0ZS1sb2FkZXJcIik7XG52YXIgX2Rlbm9ybWFsaXplUGFnZVBhdGggPSByZXF1aXJlKFwiLi4vLi4vLi4vc2VydmVyL2Rlbm9ybWFsaXplLXBhZ2UtcGF0aFwiKTtcbnZhciBfbm9ybWFsaXplTG9jYWxlUGF0aCA9IHJlcXVpcmUoXCIuLi9pMThuL25vcm1hbGl6ZS1sb2NhbGUtcGF0aFwiKTtcbnZhciBfbWl0dCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uL21pdHRcIikpO1xudmFyIF91dGlscyA9IHJlcXVpcmUoXCIuLi91dGlsc1wiKTtcbnZhciBfaXNEeW5hbWljID0gcmVxdWlyZShcIi4vdXRpbHMvaXMtZHluYW1pY1wiKTtcbnZhciBfcGFyc2VSZWxhdGl2ZVVybCA9IHJlcXVpcmUoXCIuL3V0aWxzL3BhcnNlLXJlbGF0aXZlLXVybFwiKTtcbnZhciBfcXVlcnlzdHJpbmcgPSByZXF1aXJlKFwiLi91dGlscy9xdWVyeXN0cmluZ1wiKTtcbnZhciBfcmVzb2x2ZVJld3JpdGVzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi91dGlscy9yZXNvbHZlLXJld3JpdGVzXCIpKTtcbnZhciBfcm91dGVNYXRjaGVyID0gcmVxdWlyZShcIi4vdXRpbHMvcm91dGUtbWF0Y2hlclwiKTtcbnZhciBfcm91dGVSZWdleCA9IHJlcXVpcmUoXCIuL3V0aWxzL3JvdXRlLXJlZ2V4XCIpO1xuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgICByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDoge1xuICAgICAgICBkZWZhdWx0OiBvYmpcbiAgICB9O1xufVxubGV0IGRldGVjdERvbWFpbkxvY2FsZTtcbmlmIChwcm9jZXNzLmVudi5fX05FWFRfSTE4Tl9TVVBQT1JUKSB7XG4gICAgZGV0ZWN0RG9tYWluTG9jYWxlID0gcmVxdWlyZSgnLi4vaTE4bi9kZXRlY3QtZG9tYWluLWxvY2FsZScpLmRldGVjdERvbWFpbkxvY2FsZTtcbn1cbmNvbnN0IGJhc2VQYXRoID0gcHJvY2Vzcy5lbnYuX19ORVhUX1JPVVRFUl9CQVNFUEFUSCB8fCAnJztcbmZ1bmN0aW9uIGJ1aWxkQ2FuY2VsbGF0aW9uRXJyb3IoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24obmV3IEVycm9yKCdSb3V0ZSBDYW5jZWxsZWQnKSwge1xuICAgICAgICBjYW5jZWxsZWQ6IHRydWVcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGFkZFBhdGhQcmVmaXgocGF0aCwgcHJlZml4KSB7XG4gICAgcmV0dXJuIHByZWZpeCAmJiBwYXRoLnN0YXJ0c1dpdGgoJy8nKSA/IHBhdGggPT09ICcvJyA/ICgwLCBfbm9ybWFsaXplVHJhaWxpbmdTbGFzaCkubm9ybWFsaXplUGF0aFRyYWlsaW5nU2xhc2gocHJlZml4KSA6IGAke3ByZWZpeH0ke3BhdGhOb1F1ZXJ5SGFzaChwYXRoKSA9PT0gJy8nID8gcGF0aC5zdWJzdHJpbmcoMSkgOiBwYXRofWAgOiBwYXRoO1xufVxuZnVuY3Rpb24gZ2V0RG9tYWluTG9jYWxlKHBhdGgsIGxvY2FsZSwgbG9jYWxlcywgZG9tYWluTG9jYWxlcykge1xuICAgIGlmIChwcm9jZXNzLmVudi5fX05FWFRfSTE4Tl9TVVBQT1JUKSB7XG4gICAgICAgIGxvY2FsZSA9IGxvY2FsZSB8fCAoMCwgX25vcm1hbGl6ZUxvY2FsZVBhdGgpLm5vcm1hbGl6ZUxvY2FsZVBhdGgocGF0aCwgbG9jYWxlcykuZGV0ZWN0ZWRMb2NhbGU7XG4gICAgICAgIGNvbnN0IGRldGVjdGVkRG9tYWluID0gZGV0ZWN0RG9tYWluTG9jYWxlKGRvbWFpbkxvY2FsZXMsIHVuZGVmaW5lZCwgbG9jYWxlKTtcbiAgICAgICAgaWYgKGRldGVjdGVkRG9tYWluKSB7XG4gICAgICAgICAgICByZXR1cm4gYGh0dHAke2RldGVjdGVkRG9tYWluLmh0dHAgPyAnJyA6ICdzJ306Ly8ke2RldGVjdGVkRG9tYWluLmRvbWFpbn0ke2Jhc2VQYXRoIHx8ICcnfSR7bG9jYWxlID09PSBkZXRlY3RlZERvbWFpbi5kZWZhdWx0TG9jYWxlID8gJycgOiBgLyR7bG9jYWxlfWB9JHtwYXRofWA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5mdW5jdGlvbiBhZGRMb2NhbGUocGF0aCwgbG9jYWxlLCBkZWZhdWx0TG9jYWxlKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Ll9fTkVYVF9JMThOX1NVUFBPUlQpIHtcbiAgICAgICAgY29uc3QgcGF0aG5hbWUgPSBwYXRoTm9RdWVyeUhhc2gocGF0aCk7XG4gICAgICAgIGNvbnN0IHBhdGhMb3dlciA9IHBhdGhuYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IGxvY2FsZUxvd2VyID0gbG9jYWxlICYmIGxvY2FsZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICByZXR1cm4gbG9jYWxlICYmIGxvY2FsZSAhPT0gZGVmYXVsdExvY2FsZSAmJiAhcGF0aExvd2VyLnN0YXJ0c1dpdGgoJy8nICsgbG9jYWxlTG93ZXIgKyAnLycpICYmIHBhdGhMb3dlciAhPT0gJy8nICsgbG9jYWxlTG93ZXIgPyBhZGRQYXRoUHJlZml4KHBhdGgsICcvJyArIGxvY2FsZSkgOiBwYXRoO1xuICAgIH1cbiAgICByZXR1cm4gcGF0aDtcbn1cbmZ1bmN0aW9uIGRlbExvY2FsZShwYXRoLCBsb2NhbGUpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuX19ORVhUX0kxOE5fU1VQUE9SVCkge1xuICAgICAgICBjb25zdCBwYXRobmFtZSA9IHBhdGhOb1F1ZXJ5SGFzaChwYXRoKTtcbiAgICAgICAgY29uc3QgcGF0aExvd2VyID0gcGF0aG5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgY29uc3QgbG9jYWxlTG93ZXIgPSBsb2NhbGUgJiYgbG9jYWxlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIHJldHVybiBsb2NhbGUgJiYgKHBhdGhMb3dlci5zdGFydHNXaXRoKCcvJyArIGxvY2FsZUxvd2VyICsgJy8nKSB8fCBwYXRoTG93ZXIgPT09ICcvJyArIGxvY2FsZUxvd2VyKSA/IChwYXRobmFtZS5sZW5ndGggPT09IGxvY2FsZS5sZW5ndGggKyAxID8gJy8nIDogJycpICsgcGF0aC5zdWJzdHIobG9jYWxlLmxlbmd0aCArIDEpIDogcGF0aDtcbiAgICB9XG4gICAgcmV0dXJuIHBhdGg7XG59XG5mdW5jdGlvbiBwYXRoTm9RdWVyeUhhc2gocGF0aCkge1xuICAgIGNvbnN0IHF1ZXJ5SW5kZXggPSBwYXRoLmluZGV4T2YoJz8nKTtcbiAgICBjb25zdCBoYXNoSW5kZXggPSBwYXRoLmluZGV4T2YoJyMnKTtcbiAgICBpZiAocXVlcnlJbmRleCA+IC0xIHx8IGhhc2hJbmRleCA+IC0xKSB7XG4gICAgICAgIHBhdGggPSBwYXRoLnN1YnN0cmluZygwLCBxdWVyeUluZGV4ID4gLTEgPyBxdWVyeUluZGV4IDogaGFzaEluZGV4KTtcbiAgICB9XG4gICAgcmV0dXJuIHBhdGg7XG59XG5mdW5jdGlvbiBoYXNCYXNlUGF0aChwYXRoKSB7XG4gICAgcGF0aCA9IHBhdGhOb1F1ZXJ5SGFzaChwYXRoKTtcbiAgICByZXR1cm4gcGF0aCA9PT0gYmFzZVBhdGggfHwgcGF0aC5zdGFydHNXaXRoKGJhc2VQYXRoICsgJy8nKTtcbn1cbmZ1bmN0aW9uIGFkZEJhc2VQYXRoKHBhdGgpIHtcbiAgICAvLyB3ZSBvbmx5IGFkZCB0aGUgYmFzZXBhdGggb24gcmVsYXRpdmUgdXJsc1xuICAgIHJldHVybiBhZGRQYXRoUHJlZml4KHBhdGgsIGJhc2VQYXRoKTtcbn1cbmZ1bmN0aW9uIGRlbEJhc2VQYXRoKHBhdGgpIHtcbiAgICBwYXRoID0gcGF0aC5zbGljZShiYXNlUGF0aC5sZW5ndGgpO1xuICAgIGlmICghcGF0aC5zdGFydHNXaXRoKCcvJykpIHBhdGggPSBgLyR7cGF0aH1gO1xuICAgIHJldHVybiBwYXRoO1xufVxuZnVuY3Rpb24gaXNMb2NhbFVSTCh1cmwpIHtcbiAgICAvLyBwcmV2ZW50IGEgaHlkcmF0aW9uIG1pc21hdGNoIG9uIGhyZWYgZm9yIHVybCB3aXRoIGFuY2hvciByZWZzXG4gICAgaWYgKHVybC5zdGFydHNXaXRoKCcvJykgfHwgdXJsLnN0YXJ0c1dpdGgoJyMnKSB8fCB1cmwuc3RhcnRzV2l0aCgnPycpKSByZXR1cm4gdHJ1ZTtcbiAgICB0cnkge1xuICAgICAgICAvLyBhYnNvbHV0ZSB1cmxzIGNhbiBiZSBsb2NhbCBpZiB0aGV5IGFyZSBvbiB0aGUgc2FtZSBvcmlnaW5cbiAgICAgICAgY29uc3QgbG9jYXRpb25PcmlnaW4gPSAoMCwgX3V0aWxzKS5nZXRMb2NhdGlvbk9yaWdpbigpO1xuICAgICAgICBjb25zdCByZXNvbHZlZCA9IG5ldyBVUkwodXJsLCBsb2NhdGlvbk9yaWdpbik7XG4gICAgICAgIHJldHVybiByZXNvbHZlZC5vcmlnaW4gPT09IGxvY2F0aW9uT3JpZ2luICYmIGhhc0Jhc2VQYXRoKHJlc29sdmVkLnBhdGhuYW1lKTtcbiAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5mdW5jdGlvbiBpbnRlcnBvbGF0ZUFzKHJvdXRlLCBhc1BhdGhuYW1lLCBxdWVyeSkge1xuICAgIGxldCBpbnRlcnBvbGF0ZWRSb3V0ZSA9ICcnO1xuICAgIGNvbnN0IGR5bmFtaWNSZWdleCA9ICgwLCBfcm91dGVSZWdleCkuZ2V0Um91dGVSZWdleChyb3V0ZSk7XG4gICAgY29uc3QgZHluYW1pY0dyb3VwcyA9IGR5bmFtaWNSZWdleC5ncm91cHM7XG4gICAgY29uc3QgZHluYW1pY01hdGNoZXMgPSAvLyBUcnkgdG8gbWF0Y2ggdGhlIGR5bmFtaWMgcm91dGUgYWdhaW5zdCB0aGUgYXNQYXRoXG4gICAgKGFzUGF0aG5hbWUgIT09IHJvdXRlID8gKDAsIF9yb3V0ZU1hdGNoZXIpLmdldFJvdXRlTWF0Y2hlcihkeW5hbWljUmVnZXgpKGFzUGF0aG5hbWUpIDogJycpIHx8IC8vIEZhbGwgYmFjayB0byByZWFkaW5nIHRoZSB2YWx1ZXMgZnJvbSB0aGUgaHJlZlxuICAgIC8vIFRPRE86IHNob3VsZCB0aGlzIHRha2UgcHJpb3JpdHk7IGFsc28gbmVlZCB0byBjaGFuZ2UgaW4gdGhlIHJvdXRlci5cbiAgICBxdWVyeTtcbiAgICBpbnRlcnBvbGF0ZWRSb3V0ZSA9IHJvdXRlO1xuICAgIGNvbnN0IHBhcmFtcyA9IE9iamVjdC5rZXlzKGR5bmFtaWNHcm91cHMpO1xuICAgIGlmICghcGFyYW1zLmV2ZXJ5KChwYXJhbSk9PntcbiAgICAgICAgbGV0IHZhbHVlID0gZHluYW1pY01hdGNoZXNbcGFyYW1dIHx8ICcnO1xuICAgICAgICBjb25zdCB7IHJlcGVhdCAsIG9wdGlvbmFsICB9ID0gZHluYW1pY0dyb3Vwc1twYXJhbV07XG4gICAgICAgIC8vIHN1cHBvcnQgc2luZ2xlLWxldmVsIGNhdGNoLWFsbFxuICAgICAgICAvLyBUT0RPOiBtb3JlIHJvYnVzdCBoYW5kbGluZyBmb3IgdXNlci1lcnJvciAocGFzc2luZyBgL2ApXG4gICAgICAgIGxldCByZXBsYWNlZCA9IGBbJHtyZXBlYXQgPyAnLi4uJyA6ICcnfSR7cGFyYW19XWA7XG4gICAgICAgIGlmIChvcHRpb25hbCkge1xuICAgICAgICAgICAgcmVwbGFjZWQgPSBgJHshdmFsdWUgPyAnLycgOiAnJ31bJHtyZXBsYWNlZH1dYDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVwZWF0ICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSkgdmFsdWUgPSBbXG4gICAgICAgICAgICB2YWx1ZVxuICAgICAgICBdO1xuICAgICAgICByZXR1cm4gKG9wdGlvbmFsIHx8IHBhcmFtIGluIGR5bmFtaWNNYXRjaGVzKSAmJiAvLyBJbnRlcnBvbGF0ZSBncm91cCBpbnRvIGRhdGEgVVJMIGlmIHByZXNlbnRcbiAgICAgICAgKGludGVycG9sYXRlZFJvdXRlID0gaW50ZXJwb2xhdGVkUm91dGUucmVwbGFjZShyZXBsYWNlZCwgcmVwZWF0ID8gdmFsdWUubWFwKC8vIHRoZXNlIHZhbHVlcyBzaG91bGQgYmUgZnVsbHkgZW5jb2RlZCBpbnN0ZWFkIG9mIGp1c3RcbiAgICAgICAgLy8gcGF0aCBkZWxpbWl0ZXIgZXNjYXBlZCBzaW5jZSB0aGV5IGFyZSBiZWluZyBpbnNlcnRlZFxuICAgICAgICAvLyBpbnRvIHRoZSBVUkwgYW5kIHdlIGV4cGVjdCBVUkwgZW5jb2RlZCBzZWdtZW50c1xuICAgICAgICAvLyB3aGVuIHBhcnNpbmcgZHluYW1pYyByb3V0ZSBwYXJhbXNcbiAgICAgICAgKHNlZ21lbnQpPT5lbmNvZGVVUklDb21wb25lbnQoc2VnbWVudClcbiAgICAgICAgKS5qb2luKCcvJykgOiBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKSB8fCAnLycpO1xuICAgIH0pKSB7XG4gICAgICAgIGludGVycG9sYXRlZFJvdXRlID0gJycgLy8gZGlkIG5vdCBzYXRpc2Z5IGFsbCByZXF1aXJlbWVudHNcbiAgICAgICAgO1xuICAgIC8vIG4uYi4gV2UgaWdub3JlIHRoaXMgZXJyb3IgYmVjYXVzZSB3ZSBoYW5kbGUgd2FybmluZyBmb3IgdGhpcyBjYXNlIGluXG4gICAgLy8gZGV2ZWxvcG1lbnQgaW4gdGhlIGA8TGluaz5gIGNvbXBvbmVudCBkaXJlY3RseS5cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGFyYW1zLFxuICAgICAgICByZXN1bHQ6IGludGVycG9sYXRlZFJvdXRlXG4gICAgfTtcbn1cbmZ1bmN0aW9uIG9taXRQYXJtc0Zyb21RdWVyeShxdWVyeSwgcGFyYW1zKSB7XG4gICAgY29uc3QgZmlsdGVyZWRRdWVyeSA9IHtcbiAgICB9O1xuICAgIE9iamVjdC5rZXlzKHF1ZXJ5KS5mb3JFYWNoKChrZXkpPT57XG4gICAgICAgIGlmICghcGFyYW1zLmluY2x1ZGVzKGtleSkpIHtcbiAgICAgICAgICAgIGZpbHRlcmVkUXVlcnlba2V5XSA9IHF1ZXJ5W2tleV07XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZmlsdGVyZWRRdWVyeTtcbn1cbmZ1bmN0aW9uIHJlc29sdmVIcmVmKHJvdXRlciwgaHJlZiwgcmVzb2x2ZUFzKSB7XG4gICAgLy8gd2UgdXNlIGEgZHVtbXkgYmFzZSB1cmwgZm9yIHJlbGF0aXZlIHVybHNcbiAgICBsZXQgYmFzZTtcbiAgICBsZXQgdXJsQXNTdHJpbmcgPSB0eXBlb2YgaHJlZiA9PT0gJ3N0cmluZycgPyBocmVmIDogKDAsIF91dGlscykuZm9ybWF0V2l0aFZhbGlkYXRpb24oaHJlZik7XG4gICAgLy8gcmVwZWF0ZWQgc2xhc2hlcyBhbmQgYmFja3NsYXNoZXMgaW4gdGhlIFVSTCBhcmUgY29uc2lkZXJlZFxuICAgIC8vIGludmFsaWQgYW5kIHdpbGwgbmV2ZXIgbWF0Y2ggYSBOZXh0LmpzIHBhZ2UvZmlsZVxuICAgIGNvbnN0IHVybFByb3RvTWF0Y2ggPSB1cmxBc1N0cmluZy5tYXRjaCgvXlthLXpBLVpdezEsfTpcXC9cXC8vKTtcbiAgICBjb25zdCB1cmxBc1N0cmluZ05vUHJvdG8gPSB1cmxQcm90b01hdGNoID8gdXJsQXNTdHJpbmcuc3Vic3RyKHVybFByb3RvTWF0Y2hbMF0ubGVuZ3RoKSA6IHVybEFzU3RyaW5nO1xuICAgIGNvbnN0IHVybFBhcnRzID0gdXJsQXNTdHJpbmdOb1Byb3RvLnNwbGl0KCc/Jyk7XG4gICAgaWYgKCh1cmxQYXJ0c1swXSB8fCAnJykubWF0Y2goLyhcXC9cXC98XFxcXCkvKSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBJbnZhbGlkIGhyZWYgcGFzc2VkIHRvIG5leHQvcm91dGVyOiAke3VybEFzU3RyaW5nfSwgcmVwZWF0ZWQgZm9yd2FyZC1zbGFzaGVzICgvLykgb3IgYmFja3NsYXNoZXMgXFxcXCBhcmUgbm90IHZhbGlkIGluIHRoZSBocmVmYCk7XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRVcmwgPSAoMCwgX3V0aWxzKS5ub3JtYWxpemVSZXBlYXRlZFNsYXNoZXModXJsQXNTdHJpbmdOb1Byb3RvKTtcbiAgICAgICAgdXJsQXNTdHJpbmcgPSAodXJsUHJvdG9NYXRjaCA/IHVybFByb3RvTWF0Y2hbMF0gOiAnJykgKyBub3JtYWxpemVkVXJsO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gYmVjYXVzZSBpdCBjYW5ub3QgYmUgcm91dGVkIGJ5IHRoZSBOZXh0LmpzIHJvdXRlclxuICAgIGlmICghaXNMb2NhbFVSTCh1cmxBc1N0cmluZykpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmVBcyA/IFtcbiAgICAgICAgICAgIHVybEFzU3RyaW5nXG4gICAgICAgIF0gOiB1cmxBc1N0cmluZztcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgYmFzZSA9IG5ldyBVUkwodXJsQXNTdHJpbmcuc3RhcnRzV2l0aCgnIycpID8gcm91dGVyLmFzUGF0aCA6IHJvdXRlci5wYXRobmFtZSwgJ2h0dHA6Ly9uJyk7XG4gICAgfSBjYXRjaCAoXykge1xuICAgICAgICAvLyBmYWxsYmFjayB0byAvIGZvciBpbnZhbGlkIGFzUGF0aCB2YWx1ZXMgZS5nLiAvL1xuICAgICAgICBiYXNlID0gbmV3IFVSTCgnLycsICdodHRwOi8vbicpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBjb25zdCBmaW5hbFVybCA9IG5ldyBVUkwodXJsQXNTdHJpbmcsIGJhc2UpO1xuICAgICAgICBmaW5hbFVybC5wYXRobmFtZSA9ICgwLCBfbm9ybWFsaXplVHJhaWxpbmdTbGFzaCkubm9ybWFsaXplUGF0aFRyYWlsaW5nU2xhc2goZmluYWxVcmwucGF0aG5hbWUpO1xuICAgICAgICBsZXQgaW50ZXJwb2xhdGVkQXMgPSAnJztcbiAgICAgICAgaWYgKCgwLCBfaXNEeW5hbWljKS5pc0R5bmFtaWNSb3V0ZShmaW5hbFVybC5wYXRobmFtZSkgJiYgZmluYWxVcmwuc2VhcmNoUGFyYW1zICYmIHJlc29sdmVBcykge1xuICAgICAgICAgICAgY29uc3QgcXVlcnkgPSAoMCwgX3F1ZXJ5c3RyaW5nKS5zZWFyY2hQYXJhbXNUb1VybFF1ZXJ5KGZpbmFsVXJsLnNlYXJjaFBhcmFtcyk7XG4gICAgICAgICAgICBjb25zdCB7IHJlc3VsdCAsIHBhcmFtcyAgfSA9IGludGVycG9sYXRlQXMoZmluYWxVcmwucGF0aG5hbWUsIGZpbmFsVXJsLnBhdGhuYW1lLCBxdWVyeSk7XG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgaW50ZXJwb2xhdGVkQXMgPSAoMCwgX3V0aWxzKS5mb3JtYXRXaXRoVmFsaWRhdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIHBhdGhuYW1lOiByZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgIGhhc2g6IGZpbmFsVXJsLmhhc2gsXG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5OiBvbWl0UGFybXNGcm9tUXVlcnkocXVlcnksIHBhcmFtcylcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBpZiB0aGUgb3JpZ2luIGRpZG4ndCBjaGFuZ2UsIGl0IG1lYW5zIHdlIHJlY2VpdmVkIGEgcmVsYXRpdmUgaHJlZlxuICAgICAgICBjb25zdCByZXNvbHZlZEhyZWYgPSBmaW5hbFVybC5vcmlnaW4gPT09IGJhc2Uub3JpZ2luID8gZmluYWxVcmwuaHJlZi5zbGljZShmaW5hbFVybC5vcmlnaW4ubGVuZ3RoKSA6IGZpbmFsVXJsLmhyZWY7XG4gICAgICAgIHJldHVybiByZXNvbHZlQXMgPyBbXG4gICAgICAgICAgICByZXNvbHZlZEhyZWYsXG4gICAgICAgICAgICBpbnRlcnBvbGF0ZWRBcyB8fCByZXNvbHZlZEhyZWZcbiAgICAgICAgXSA6IHJlc29sdmVkSHJlZjtcbiAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlQXMgPyBbXG4gICAgICAgICAgICB1cmxBc1N0cmluZ1xuICAgICAgICBdIDogdXJsQXNTdHJpbmc7XG4gICAgfVxufVxuZnVuY3Rpb24gc3RyaXBPcmlnaW4odXJsKSB7XG4gICAgY29uc3Qgb3JpZ2luID0gKDAsIF91dGlscykuZ2V0TG9jYXRpb25PcmlnaW4oKTtcbiAgICByZXR1cm4gdXJsLnN0YXJ0c1dpdGgob3JpZ2luKSA/IHVybC5zdWJzdHJpbmcob3JpZ2luLmxlbmd0aCkgOiB1cmw7XG59XG5mdW5jdGlvbiBwcmVwYXJlVXJsQXMocm91dGVyLCB1cmwsIGFzKSB7XG4gICAgLy8gSWYgdXJsIGFuZCBhcyBwcm92aWRlZCBhcyBhbiBvYmplY3QgcmVwcmVzZW50YXRpb24sXG4gICAgLy8gd2UnbGwgZm9ybWF0IHRoZW0gaW50byB0aGUgc3RyaW5nIHZlcnNpb24gaGVyZS5cbiAgICBsZXQgW3Jlc29sdmVkSHJlZiwgcmVzb2x2ZWRBc10gPSByZXNvbHZlSHJlZihyb3V0ZXIsIHVybCwgdHJ1ZSk7XG4gICAgY29uc3Qgb3JpZ2luID0gKDAsIF91dGlscykuZ2V0TG9jYXRpb25PcmlnaW4oKTtcbiAgICBjb25zdCBocmVmSGFkT3JpZ2luID0gcmVzb2x2ZWRIcmVmLnN0YXJ0c1dpdGgob3JpZ2luKTtcbiAgICBjb25zdCBhc0hhZE9yaWdpbiA9IHJlc29sdmVkQXMgJiYgcmVzb2x2ZWRBcy5zdGFydHNXaXRoKG9yaWdpbik7XG4gICAgcmVzb2x2ZWRIcmVmID0gc3RyaXBPcmlnaW4ocmVzb2x2ZWRIcmVmKTtcbiAgICByZXNvbHZlZEFzID0gcmVzb2x2ZWRBcyA/IHN0cmlwT3JpZ2luKHJlc29sdmVkQXMpIDogcmVzb2x2ZWRBcztcbiAgICBjb25zdCBwcmVwYXJlZFVybCA9IGhyZWZIYWRPcmlnaW4gPyByZXNvbHZlZEhyZWYgOiBhZGRCYXNlUGF0aChyZXNvbHZlZEhyZWYpO1xuICAgIGNvbnN0IHByZXBhcmVkQXMgPSBhcyA/IHN0cmlwT3JpZ2luKHJlc29sdmVIcmVmKHJvdXRlciwgYXMpKSA6IHJlc29sdmVkQXMgfHwgcmVzb2x2ZWRIcmVmO1xuICAgIHJldHVybiB7XG4gICAgICAgIHVybDogcHJlcGFyZWRVcmwsXG4gICAgICAgIGFzOiBhc0hhZE9yaWdpbiA/IHByZXBhcmVkQXMgOiBhZGRCYXNlUGF0aChwcmVwYXJlZEFzKVxuICAgIH07XG59XG5mdW5jdGlvbiByZXNvbHZlRHluYW1pY1JvdXRlKHBhdGhuYW1lLCBwYWdlcykge1xuICAgIGNvbnN0IGNsZWFuUGF0aG5hbWUgPSAoMCwgX25vcm1hbGl6ZVRyYWlsaW5nU2xhc2gpLnJlbW92ZVBhdGhUcmFpbGluZ1NsYXNoKCgwLCBfZGVub3JtYWxpemVQYWdlUGF0aCkuZGVub3JtYWxpemVQYWdlUGF0aChwYXRobmFtZSkpO1xuICAgIGlmIChjbGVhblBhdGhuYW1lID09PSAnLzQwNCcgfHwgY2xlYW5QYXRobmFtZSA9PT0gJy9fZXJyb3InKSB7XG4gICAgICAgIHJldHVybiBwYXRobmFtZTtcbiAgICB9XG4gICAgLy8gaGFuZGxlIHJlc29sdmluZyBocmVmIGZvciBkeW5hbWljIHJvdXRlc1xuICAgIGlmICghcGFnZXMuaW5jbHVkZXMoY2xlYW5QYXRobmFtZSkpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGFycmF5LWNhbGxiYWNrLXJldHVyblxuICAgICAgICBwYWdlcy5zb21lKChwYWdlKT0+e1xuICAgICAgICAgICAgaWYgKCgwLCBfaXNEeW5hbWljKS5pc0R5bmFtaWNSb3V0ZShwYWdlKSAmJiAoMCwgX3JvdXRlUmVnZXgpLmdldFJvdXRlUmVnZXgocGFnZSkucmUudGVzdChjbGVhblBhdGhuYW1lKSkge1xuICAgICAgICAgICAgICAgIHBhdGhuYW1lID0gcGFnZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiAoMCwgX25vcm1hbGl6ZVRyYWlsaW5nU2xhc2gpLnJlbW92ZVBhdGhUcmFpbGluZ1NsYXNoKHBhdGhuYW1lKTtcbn1cbmNvbnN0IG1hbnVhbFNjcm9sbFJlc3RvcmF0aW9uID0gcHJvY2Vzcy5lbnYuX19ORVhUX1NDUk9MTF9SRVNUT1JBVElPTiAmJiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiAnc2Nyb2xsUmVzdG9yYXRpb24nIGluIHdpbmRvdy5oaXN0b3J5ICYmICEhZnVuY3Rpb24oKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgbGV0IHYgPSAnX19uZXh0JztcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlcXVlbmNlc1xuICAgICAgICByZXR1cm4gc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSh2LCB2KSwgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSh2KSwgdHJ1ZTtcbiAgICB9IGNhdGNoIChuKSB7XG4gICAgfVxufSgpO1xuY29uc3QgU1NHX0RBVEFfTk9UX0ZPVU5EID0gU3ltYm9sKCdTU0dfREFUQV9OT1RfRk9VTkQnKTtcbmZ1bmN0aW9uIGZldGNoUmV0cnkodXJsLCBhdHRlbXB0cykge1xuICAgIHJldHVybiBmZXRjaCh1cmwsIHtcbiAgICAgICAgLy8gQ29va2llcyBhcmUgcmVxdWlyZWQgdG8gYmUgcHJlc2VudCBmb3IgTmV4dC5qcycgU1NHIFwiUHJldmlldyBNb2RlXCIuXG4gICAgICAgIC8vIENvb2tpZXMgbWF5IGFsc28gYmUgcmVxdWlyZWQgZm9yIGBnZXRTZXJ2ZXJTaWRlUHJvcHNgLlxuICAgICAgICAvL1xuICAgICAgICAvLyA+IGBmZXRjaGAgd29u4oCZdCBzZW5kIGNvb2tpZXMsIHVubGVzcyB5b3Ugc2V0IHRoZSBjcmVkZW50aWFscyBpbml0XG4gICAgICAgIC8vID4gb3B0aW9uLlxuICAgICAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmV0Y2hfQVBJL1VzaW5nX0ZldGNoXG4gICAgICAgIC8vXG4gICAgICAgIC8vID4gRm9yIG1heGltdW0gYnJvd3NlciBjb21wYXRpYmlsaXR5IHdoZW4gaXQgY29tZXMgdG8gc2VuZGluZyAmXG4gICAgICAgIC8vID4gcmVjZWl2aW5nIGNvb2tpZXMsIGFsd2F5cyBzdXBwbHkgdGhlIGBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ2BcbiAgICAgICAgLy8gPiBvcHRpb24gaW5zdGVhZCBvZiByZWx5aW5nIG9uIHRoZSBkZWZhdWx0LlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZ2l0aHViL2ZldGNoI2NhdmVhdHNcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcbiAgICB9KS50aGVuKChyZXMpPT57XG4gICAgICAgIGlmICghcmVzLm9rKSB7XG4gICAgICAgICAgICBpZiAoYXR0ZW1wdHMgPiAxICYmIHJlcy5zdGF0dXMgPj0gNTAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZldGNoUmV0cnkodXJsLCBhdHRlbXB0cyAtIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXMgPT09IDQwNCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXMuanNvbigpLnRoZW4oKGRhdGEpPT57XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLm5vdEZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdEZvdW5kOiBTU0dfREFUQV9OT1RfRk9VTkRcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gbG9hZCBzdGF0aWMgcHJvcHNgKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGxvYWQgc3RhdGljIHByb3BzYCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBmZXRjaE5leHREYXRhKGRhdGFIcmVmLCBpc1NlcnZlclJlbmRlcikge1xuICAgIHJldHVybiBmZXRjaFJldHJ5KGRhdGFIcmVmLCBpc1NlcnZlclJlbmRlciA/IDMgOiAxKS5jYXRjaCgoZXJyKT0+e1xuICAgICAgICAvLyBXZSBzaG91bGQgb25seSB0cmlnZ2VyIGEgc2VydmVyLXNpZGUgdHJhbnNpdGlvbiBpZiB0aGlzIHdhcyBjYXVzZWRcbiAgICAgICAgLy8gb24gYSBjbGllbnQtc2lkZSB0cmFuc2l0aW9uLiBPdGhlcndpc2UsIHdlJ2QgZ2V0IGludG8gYW4gaW5maW5pdGVcbiAgICAgICAgLy8gbG9vcC5cbiAgICAgICAgaWYgKCFpc1NlcnZlclJlbmRlcikge1xuICAgICAgICAgICAgKDAsIF9yb3V0ZUxvYWRlcikubWFya0Fzc2V0RXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBlcnI7XG4gICAgfSk7XG59XG5jbGFzcyBSb3V0ZXIge1xuICAgIGNvbnN0cnVjdG9yKHBhdGhuYW1lMSwgcXVlcnkxLCBhczEsIHsgaW5pdGlhbFByb3BzICwgcGFnZUxvYWRlciAsIEFwcCAsIHdyYXBBcHAgLCBDb21wb25lbnQ6IENvbXBvbmVudDEgLCBlcnI6IGVycjEgLCBzdWJzY3JpcHRpb24gLCBpc0ZhbGxiYWNrICwgbG9jYWxlICwgbG9jYWxlcyAsIGRlZmF1bHRMb2NhbGUgLCBkb21haW5Mb2NhbGVzICwgaXNQcmV2aWV3ICB9KXtcbiAgICAgICAgLy8gU3RhdGljIERhdGEgQ2FjaGVcbiAgICAgICAgdGhpcy5zZGMgPSB7XG4gICAgICAgIH07XG4gICAgICAgIC8vIEluLWZsaWdodCBTZXJ2ZXIgRGF0YSBSZXF1ZXN0cywgZm9yIGRlZHVwaW5nXG4gICAgICAgIHRoaXMuc2RyID0ge1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9pZHggPSAwO1xuICAgICAgICB0aGlzLm9uUG9wU3RhdGUgPSAoZSk9PntcbiAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gZS5zdGF0ZTtcbiAgICAgICAgICAgIGlmICghc3RhdGUpIHtcbiAgICAgICAgICAgICAgICAvLyBXZSBnZXQgc3RhdGUgYXMgdW5kZWZpbmVkIGZvciB0d28gcmVhc29ucy5cbiAgICAgICAgICAgICAgICAvLyAgMS4gV2l0aCBvbGRlciBzYWZhcmkgKDwgOCkgYW5kIG9sZGVyIGNocm9tZSAoPCAzNClcbiAgICAgICAgICAgICAgICAvLyAgMi4gV2hlbiB0aGUgVVJMIGNoYW5nZWQgd2l0aCAjXG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAvLyBJbiB0aGUgYm90aCBjYXNlcywgd2UgZG9uJ3QgbmVlZCB0byBwcm9jZWVkIGFuZCBjaGFuZ2UgdGhlIHJvdXRlLlxuICAgICAgICAgICAgICAgIC8vIChhcyBpdCdzIGFscmVhZHkgY2hhbmdlZClcbiAgICAgICAgICAgICAgICAvLyBCdXQgd2UgY2FuIHNpbXBseSByZXBsYWNlIHRoZSBzdGF0ZSB3aXRoIHRoZSBuZXcgY2hhbmdlcy5cbiAgICAgICAgICAgICAgICAvLyBBY3R1YWxseSwgZm9yICgxKSB3ZSBkb24ndCBuZWVkIHRvIG5vdGhpbmcuIEJ1dCBpdCdzIGhhcmQgdG8gZGV0ZWN0IHRoYXQgZXZlbnQuXG4gICAgICAgICAgICAgICAgLy8gU28sIGRvaW5nIHRoZSBmb2xsb3dpbmcgZm9yICgxKSBkb2VzIG5vIGhhcm0uXG4gICAgICAgICAgICAgICAgY29uc3QgeyBwYXRobmFtZTogcGF0aG5hbWUxICwgcXVlcnk6IHF1ZXJ5MSAgfSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VTdGF0ZSgncmVwbGFjZVN0YXRlJywgKDAsIF91dGlscykuZm9ybWF0V2l0aFZhbGlkYXRpb24oe1xuICAgICAgICAgICAgICAgICAgICBwYXRobmFtZTogYWRkQmFzZVBhdGgocGF0aG5hbWUxKSxcbiAgICAgICAgICAgICAgICAgICAgcXVlcnk6IHF1ZXJ5MVxuICAgICAgICAgICAgICAgIH0pLCAoMCwgX3V0aWxzKS5nZXRVUkwoKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFzdGF0ZS5fX04pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgZm9yY2VkU2Nyb2xsO1xuICAgICAgICAgICAgY29uc3QgeyB1cmwgLCBhczogYXMxICwgb3B0aW9ucyAsIGlkeCAgfSA9IHN0YXRlO1xuICAgICAgICAgICAgaWYgKHByb2Nlc3MuZW52Ll9fTkVYVF9TQ1JPTExfUkVTVE9SQVRJT04pIHtcbiAgICAgICAgICAgICAgICBpZiAobWFudWFsU2Nyb2xsUmVzdG9yYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lkeCAhPT0gaWR4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTbmFwc2hvdCBjdXJyZW50IHNjcm9sbCBwb3NpdGlvbjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnX19uZXh0X3Njcm9sbF8nICsgdGhpcy5faWR4LCBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IHNlbGYucGFnZVhPZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IHNlbGYucGFnZVlPZmZzZXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBSZXN0b3JlIG9sZCBzY3JvbGwgcG9zaXRpb246XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHYgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdfX25leHRfc2Nyb2xsXycgKyBpZHgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmNlZFNjcm9sbCA9IEpTT04ucGFyc2Uodik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yY2VkU2Nyb2xsID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2lkeCA9IGlkeDtcbiAgICAgICAgICAgIGNvbnN0IHsgcGF0aG5hbWU6IHBhdGhuYW1lMSAgfSA9ICgwLCBfcGFyc2VSZWxhdGl2ZVVybCkucGFyc2VSZWxhdGl2ZVVybCh1cmwpO1xuICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHdlIGRvbid0IHJlLXJlbmRlciBvbiBpbml0aWFsIGxvYWQsXG4gICAgICAgICAgICAvLyBjYW4gYmUgY2F1c2VkIGJ5IG5hdmlnYXRpbmcgYmFjayBmcm9tIGFuIGV4dGVybmFsIHNpdGVcbiAgICAgICAgICAgIGlmICh0aGlzLmlzU3NyICYmIGFzMSA9PT0gdGhpcy5hc1BhdGggJiYgcGF0aG5hbWUxID09PSB0aGlzLnBhdGhuYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSWYgdGhlIGRvd25zdHJlYW0gYXBwbGljYXRpb24gcmV0dXJucyBmYWxzeSwgcmV0dXJuLlxuICAgICAgICAgICAgLy8gVGhleSB3aWxsIHRoZW4gYmUgcmVzcG9uc2libGUgZm9yIGhhbmRsaW5nIHRoZSBldmVudC5cbiAgICAgICAgICAgIGlmICh0aGlzLl9icHMgJiYgIXRoaXMuX2JwcyhzdGF0ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNoYW5nZSgncmVwbGFjZVN0YXRlJywgdXJsLCBhczEsIE9iamVjdC5hc3NpZ24oe1xuICAgICAgICAgICAgfSwgb3B0aW9ucywge1xuICAgICAgICAgICAgICAgIHNoYWxsb3c6IG9wdGlvbnMuc2hhbGxvdyAmJiB0aGlzLl9zaGFsbG93LFxuICAgICAgICAgICAgICAgIGxvY2FsZTogb3B0aW9ucy5sb2NhbGUgfHwgdGhpcy5kZWZhdWx0TG9jYWxlXG4gICAgICAgICAgICB9KSwgZm9yY2VkU2Nyb2xsKTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gcmVwcmVzZW50cyB0aGUgY3VycmVudCBjb21wb25lbnQga2V5XG4gICAgICAgIHRoaXMucm91dGUgPSAoMCwgX25vcm1hbGl6ZVRyYWlsaW5nU2xhc2gpLnJlbW92ZVBhdGhUcmFpbGluZ1NsYXNoKHBhdGhuYW1lMSk7XG4gICAgICAgIC8vIHNldCB1cCB0aGUgY29tcG9uZW50IGNhY2hlIChieSByb3V0ZSBrZXlzKVxuICAgICAgICB0aGlzLmNvbXBvbmVudHMgPSB7XG4gICAgICAgIH07XG4gICAgICAgIC8vIFdlIHNob3VsZCBub3Qga2VlcCB0aGUgY2FjaGUsIGlmIHRoZXJlJ3MgYW4gZXJyb3JcbiAgICAgICAgLy8gT3RoZXJ3aXNlLCB0aGlzIGNhdXNlIGlzc3VlcyB3aGVuIHdoZW4gZ29pbmcgYmFjayBhbmRcbiAgICAgICAgLy8gY29tZSBhZ2FpbiB0byB0aGUgZXJyb3JlZCBwYWdlLlxuICAgICAgICBpZiAocGF0aG5hbWUxICE9PSAnL19lcnJvcicpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50c1t0aGlzLnJvdXRlXSA9IHtcbiAgICAgICAgICAgICAgICBDb21wb25lbnQ6IENvbXBvbmVudDEsXG4gICAgICAgICAgICAgICAgaW5pdGlhbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwcm9wczogaW5pdGlhbFByb3BzLFxuICAgICAgICAgICAgICAgIGVycjogZXJyMSxcbiAgICAgICAgICAgICAgICBfX05fU1NHOiBpbml0aWFsUHJvcHMgJiYgaW5pdGlhbFByb3BzLl9fTl9TU0csXG4gICAgICAgICAgICAgICAgX19OX1NTUDogaW5pdGlhbFByb3BzICYmIGluaXRpYWxQcm9wcy5fX05fU1NQXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29tcG9uZW50c1snL19hcHAnXSA9IHtcbiAgICAgICAgICAgIENvbXBvbmVudDogQXBwLFxuICAgICAgICAgICAgc3R5bGVTaGVldHM6IFtdXG4gICAgICAgIH07XG4gICAgICAgIC8vIEJhY2t3YXJkcyBjb21wYXQgZm9yIFJvdXRlci5yb3V0ZXIuZXZlbnRzXG4gICAgICAgIC8vIFRPRE86IFNob3VsZCBiZSByZW1vdmUgdGhlIGZvbGxvd2luZyBtYWpvciB2ZXJzaW9uIGFzIGl0IHdhcyBuZXZlciBkb2N1bWVudGVkXG4gICAgICAgIHRoaXMuZXZlbnRzID0gUm91dGVyLmV2ZW50cztcbiAgICAgICAgdGhpcy5wYWdlTG9hZGVyID0gcGFnZUxvYWRlcjtcbiAgICAgICAgdGhpcy5wYXRobmFtZSA9IHBhdGhuYW1lMTtcbiAgICAgICAgdGhpcy5xdWVyeSA9IHF1ZXJ5MTtcbiAgICAgICAgLy8gaWYgYXV0byBwcmVyZW5kZXJlZCBhbmQgZHluYW1pYyByb3V0ZSB3YWl0IHRvIHVwZGF0ZSBhc1BhdGhcbiAgICAgICAgLy8gdW50aWwgYWZ0ZXIgbW91bnQgdG8gcHJldmVudCBoeWRyYXRpb24gbWlzbWF0Y2hcbiAgICAgICAgY29uc3QgYXV0b0V4cG9ydER5bmFtaWMgPSAoMCwgX2lzRHluYW1pYykuaXNEeW5hbWljUm91dGUocGF0aG5hbWUxKSAmJiBzZWxmLl9fTkVYVF9EQVRBX18uYXV0b0V4cG9ydDtcbiAgICAgICAgdGhpcy5hc1BhdGggPSBhdXRvRXhwb3J0RHluYW1pYyA/IHBhdGhuYW1lMSA6IGFzMTtcbiAgICAgICAgdGhpcy5iYXNlUGF0aCA9IGJhc2VQYXRoO1xuICAgICAgICB0aGlzLnN1YiA9IHN1YnNjcmlwdGlvbjtcbiAgICAgICAgdGhpcy5jbGMgPSBudWxsO1xuICAgICAgICB0aGlzLl93cmFwQXBwID0gd3JhcEFwcDtcbiAgICAgICAgLy8gbWFrZSBzdXJlIHRvIGlnbm9yZSBleHRyYSBwb3BTdGF0ZSBpbiBzYWZhcmkgb24gbmF2aWdhdGluZ1xuICAgICAgICAvLyBiYWNrIGZyb20gZXh0ZXJuYWwgc2l0ZVxuICAgICAgICB0aGlzLmlzU3NyID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5pc0ZhbGxiYWNrID0gaXNGYWxsYmFjaztcbiAgICAgICAgdGhpcy5pc1JlYWR5ID0gISEoc2VsZi5fX05FWFRfREFUQV9fLmdzc3AgfHwgc2VsZi5fX05FWFRfREFUQV9fLmdpcCB8fCBzZWxmLl9fTkVYVF9EQVRBX18uYXBwR2lwICYmICFzZWxmLl9fTkVYVF9EQVRBX18uZ3NwIHx8ICFhdXRvRXhwb3J0RHluYW1pYyAmJiAhc2VsZi5sb2NhdGlvbi5zZWFyY2ggJiYgIXByb2Nlc3MuZW52Ll9fTkVYVF9IQVNfUkVXUklURVMpO1xuICAgICAgICB0aGlzLmlzUHJldmlldyA9ICEhaXNQcmV2aWV3O1xuICAgICAgICB0aGlzLmlzTG9jYWxlRG9tYWluID0gZmFsc2U7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5fX05FWFRfSTE4Tl9TVVBQT1JUKSB7XG4gICAgICAgICAgICB0aGlzLmxvY2FsZSA9IGxvY2FsZTtcbiAgICAgICAgICAgIHRoaXMubG9jYWxlcyA9IGxvY2FsZXM7XG4gICAgICAgICAgICB0aGlzLmRlZmF1bHRMb2NhbGUgPSBkZWZhdWx0TG9jYWxlO1xuICAgICAgICAgICAgdGhpcy5kb21haW5Mb2NhbGVzID0gZG9tYWluTG9jYWxlcztcbiAgICAgICAgICAgIHRoaXMuaXNMb2NhbGVEb21haW4gPSAhIWRldGVjdERvbWFpbkxvY2FsZShkb21haW5Mb2NhbGVzLCBzZWxmLmxvY2F0aW9uLmhvc3RuYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSBcImFzXCIgZG9lc24ndCBzdGFydCB3aXRoIGRvdWJsZSBzbGFzaGVzIG9yIGVsc2UgaXQgY2FuXG4gICAgICAgICAgICAvLyB0aHJvdyBhbiBlcnJvciBhcyBpdCdzIGNvbnNpZGVyZWQgaW52YWxpZFxuICAgICAgICAgICAgaWYgKGFzMS5zdWJzdHIoMCwgMikgIT09ICcvLycpIHtcbiAgICAgICAgICAgICAgICAvLyBpbiBvcmRlciBmb3IgYGUuc3RhdGVgIHRvIHdvcmsgb24gdGhlIGBvbnBvcHN0YXRlYCBldmVudFxuICAgICAgICAgICAgICAgIC8vIHdlIGhhdmUgdG8gcmVnaXN0ZXIgdGhlIGluaXRpYWwgcm91dGUgdXBvbiBpbml0aWFsaXphdGlvblxuICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5fc2hvdWxkUmVzb2x2ZUhyZWYgPSBhczEgIT09IHBhdGhuYW1lMTtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZVN0YXRlKCdyZXBsYWNlU3RhdGUnLCAoMCwgX3V0aWxzKS5mb3JtYXRXaXRoVmFsaWRhdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIHBhdGhuYW1lOiBhZGRCYXNlUGF0aChwYXRobmFtZTEpLFxuICAgICAgICAgICAgICAgICAgICBxdWVyeTogcXVlcnkxXG4gICAgICAgICAgICAgICAgfSksICgwLCBfdXRpbHMpLmdldFVSTCgpLCBvcHRpb25zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIHRoaXMub25Qb3BTdGF0ZSk7XG4gICAgICAgICAgICAvLyBlbmFibGUgY3VzdG9tIHNjcm9sbCByZXN0b3JhdGlvbiBoYW5kbGluZyB3aGVuIGF2YWlsYWJsZVxuICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIGZhbGxiYWNrIHRvIGJyb3dzZXIncyBkZWZhdWx0IGhhbmRsaW5nXG4gICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuX19ORVhUX1NDUk9MTF9SRVNUT1JBVElPTikge1xuICAgICAgICAgICAgICAgIGlmIChtYW51YWxTY3JvbGxSZXN0b3JhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5zY3JvbGxSZXN0b3JhdGlvbiA9ICdtYW51YWwnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZWxvYWQoKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9XG4gICAgLyoqXG4gICAqIEdvIGJhY2sgaW4gaGlzdG9yeVxuICAgKi8gYmFjaygpIHtcbiAgICAgICAgd2luZG93Lmhpc3RvcnkuYmFjaygpO1xuICAgIH1cbiAgICAvKipcbiAgICogUGVyZm9ybXMgYSBgcHVzaFN0YXRlYCB3aXRoIGFyZ3VtZW50c1xuICAgKiBAcGFyYW0gdXJsIG9mIHRoZSByb3V0ZVxuICAgKiBAcGFyYW0gYXMgbWFza3MgYHVybGAgZm9yIHRoZSBicm93c2VyXG4gICAqIEBwYXJhbSBvcHRpb25zIG9iamVjdCB5b3UgY2FuIGRlZmluZSBgc2hhbGxvd2AgYW5kIG90aGVyIG9wdGlvbnNcbiAgICovIHB1c2godXJsLCBhcywgb3B0aW9ucyA9IHtcbiAgICB9KSB7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5fX05FWFRfU0NST0xMX1JFU1RPUkFUSU9OKSB7XG4gICAgICAgICAgICAvLyBUT0RPOiByZW1vdmUgaW4gdGhlIGZ1dHVyZSB3aGVuIHdlIHVwZGF0ZSBoaXN0b3J5IGJlZm9yZSByb3V0ZSBjaGFuZ2VcbiAgICAgICAgICAgIC8vIGlzIGNvbXBsZXRlLCBhcyB0aGUgcG9wc3RhdGUgZXZlbnQgc2hvdWxkIGhhbmRsZSB0aGlzIGNhcHR1cmUuXG4gICAgICAgICAgICBpZiAobWFudWFsU2Nyb2xsUmVzdG9yYXRpb24pIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTbmFwc2hvdCBzY3JvbGwgcG9zaXRpb24gcmlnaHQgYmVmb3JlIG5hdmlnYXRpbmcgdG8gYSBuZXcgcGFnZTpcbiAgICAgICAgICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnX19uZXh0X3Njcm9sbF8nICsgdGhpcy5faWR4LCBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB4OiBzZWxmLnBhZ2VYT2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgeTogc2VsZi5wYWdlWU9mZnNldFxuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAge1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAoeyB1cmwgLCBhcyAgfSA9IHByZXBhcmVVcmxBcyh0aGlzLCB1cmwsIGFzKSk7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYW5nZSgncHVzaFN0YXRlJywgdXJsLCBhcywgb3B0aW9ucyk7XG4gICAgfVxuICAgIC8qKlxuICAgKiBQZXJmb3JtcyBhIGByZXBsYWNlU3RhdGVgIHdpdGggYXJndW1lbnRzXG4gICAqIEBwYXJhbSB1cmwgb2YgdGhlIHJvdXRlXG4gICAqIEBwYXJhbSBhcyBtYXNrcyBgdXJsYCBmb3IgdGhlIGJyb3dzZXJcbiAgICogQHBhcmFtIG9wdGlvbnMgb2JqZWN0IHlvdSBjYW4gZGVmaW5lIGBzaGFsbG93YCBhbmQgb3RoZXIgb3B0aW9uc1xuICAgKi8gcmVwbGFjZSh1cmwsIGFzLCBvcHRpb25zID0ge1xuICAgIH0pIHtcbiAgICAgICAgKHsgdXJsICwgYXMgIH0gPSBwcmVwYXJlVXJsQXModGhpcywgdXJsLCBhcykpO1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFuZ2UoJ3JlcGxhY2VTdGF0ZScsIHVybCwgYXMsIG9wdGlvbnMpO1xuICAgIH1cbiAgICBhc3luYyBjaGFuZ2UobWV0aG9kLCB1cmwsIGFzLCBvcHRpb25zLCBmb3JjZWRTY3JvbGwpIHtcbiAgICAgICAgaWYgKCFpc0xvY2FsVVJMKHVybCkpIHtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJsO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNob3VsZFJlc29sdmVIcmVmID0gdXJsID09PSBhcyB8fCBvcHRpb25zLl9oIHx8IG9wdGlvbnMuX3Nob3VsZFJlc29sdmVIcmVmO1xuICAgICAgICAvLyBmb3Igc3RhdGljIHBhZ2VzIHdpdGggcXVlcnkgcGFyYW1zIGluIHRoZSBVUkwgd2UgZGVsYXlcbiAgICAgICAgLy8gbWFya2luZyB0aGUgcm91dGVyIHJlYWR5IHVudGlsIGFmdGVyIHRoZSBxdWVyeSBpcyB1cGRhdGVkXG4gICAgICAgIGlmIChvcHRpb25zLl9oKSB7XG4gICAgICAgICAgICB0aGlzLmlzUmVhZHkgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHByZXZMb2NhbGUgPSB0aGlzLmxvY2FsZTtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Ll9fTkVYVF9JMThOX1NVUFBPUlQpIHtcbiAgICAgICAgICAgIHRoaXMubG9jYWxlID0gb3B0aW9ucy5sb2NhbGUgPT09IGZhbHNlID8gdGhpcy5kZWZhdWx0TG9jYWxlIDogb3B0aW9ucy5sb2NhbGUgfHwgdGhpcy5sb2NhbGU7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMubG9jYWxlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMubG9jYWxlID0gdGhpcy5sb2NhbGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwYXJzZWRBcyA9ICgwLCBfcGFyc2VSZWxhdGl2ZVVybCkucGFyc2VSZWxhdGl2ZVVybChoYXNCYXNlUGF0aChhcykgPyBkZWxCYXNlUGF0aChhcykgOiBhcyk7XG4gICAgICAgICAgICBjb25zdCBsb2NhbGVQYXRoUmVzdWx0ID0gKDAsIF9ub3JtYWxpemVMb2NhbGVQYXRoKS5ub3JtYWxpemVMb2NhbGVQYXRoKHBhcnNlZEFzLnBhdGhuYW1lLCB0aGlzLmxvY2FsZXMpO1xuICAgICAgICAgICAgaWYgKGxvY2FsZVBhdGhSZXN1bHQuZGV0ZWN0ZWRMb2NhbGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvY2FsZSA9IGxvY2FsZVBhdGhSZXN1bHQuZGV0ZWN0ZWRMb2NhbGU7XG4gICAgICAgICAgICAgICAgcGFyc2VkQXMucGF0aG5hbWUgPSBhZGRCYXNlUGF0aChwYXJzZWRBcy5wYXRobmFtZSk7XG4gICAgICAgICAgICAgICAgYXMgPSAoMCwgX3V0aWxzKS5mb3JtYXRXaXRoVmFsaWRhdGlvbihwYXJzZWRBcyk7XG4gICAgICAgICAgICAgICAgdXJsID0gYWRkQmFzZVBhdGgoKDAsIF9ub3JtYWxpemVMb2NhbGVQYXRoKS5ub3JtYWxpemVMb2NhbGVQYXRoKGhhc0Jhc2VQYXRoKHVybCkgPyBkZWxCYXNlUGF0aCh1cmwpIDogdXJsLCB0aGlzLmxvY2FsZXMpLnBhdGhuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBkaWROYXZpZ2F0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gd2UgbmVlZCB0byB3cmFwIHRoaXMgaW4gdGhlIGVudiBjaGVjayBhZ2FpbiBzaW5jZSByZWdlbmVyYXRvciBydW50aW1lXG4gICAgICAgICAgICAvLyBtb3ZlcyB0aGlzIG9uIGl0cyBvd24gZHVlIHRvIHRoZSByZXR1cm5cbiAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5fX05FWFRfSTE4Tl9TVVBQT1JUKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlZjtcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgbG9jYWxlIGlzbid0IGNvbmZpZ3VyZWQgaGFyZCBuYXZpZ2F0ZSB0byBzaG93IDQwNCBwYWdlXG4gICAgICAgICAgICAgICAgaWYgKCEoKHJlZiA9IHRoaXMubG9jYWxlcykgPT09IG51bGwgfHwgcmVmID09PSB2b2lkIDAgPyB2b2lkIDAgOiByZWYuaW5jbHVkZXModGhpcy5sb2NhbGUpKSkge1xuICAgICAgICAgICAgICAgICAgICBwYXJzZWRBcy5wYXRobmFtZSA9IGFkZExvY2FsZShwYXJzZWRBcy5wYXRobmFtZSwgdGhpcy5sb2NhbGUpO1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICgwLCBfdXRpbHMpLmZvcm1hdFdpdGhWYWxpZGF0aW9uKHBhcnNlZEFzKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcyB3YXMgcHJldmlvdXNseSBhIHJldHVybiBidXQgd2FzIHJlbW92ZWQgaW4gZmF2b3JcbiAgICAgICAgICAgICAgICAgICAgLy8gb2YgYmV0dGVyIGRlYWQgY29kZSBlbGltaW5hdGlvbiB3aXRoIHJlZ2VuZXJhdG9yIHJ1bnRpbWVcbiAgICAgICAgICAgICAgICAgICAgZGlkTmF2aWdhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGRldGVjdGVkRG9tYWluID0gZGV0ZWN0RG9tYWluTG9jYWxlKHRoaXMuZG9tYWluTG9jYWxlcywgdW5kZWZpbmVkLCB0aGlzLmxvY2FsZSk7XG4gICAgICAgICAgICAvLyB3ZSBuZWVkIHRvIHdyYXAgdGhpcyBpbiB0aGUgZW52IGNoZWNrIGFnYWluIHNpbmNlIHJlZ2VuZXJhdG9yIHJ1bnRpbWVcbiAgICAgICAgICAgIC8vIG1vdmVzIHRoaXMgb24gaXRzIG93biBkdWUgdG8gdGhlIHJldHVyblxuICAgICAgICAgICAgaWYgKHByb2Nlc3MuZW52Ll9fTkVYVF9JMThOX1NVUFBPUlQpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiB3ZSBhcmUgbmF2aWdhdGluZyB0byBhIGRvbWFpbiBsb2NhbGUgZW5zdXJlIHdlIHJlZGlyZWN0IHRvIHRoZVxuICAgICAgICAgICAgICAgIC8vIGNvcnJlY3QgZG9tYWluXG4gICAgICAgICAgICAgICAgaWYgKCFkaWROYXZpZ2F0ZSAmJiBkZXRlY3RlZERvbWFpbiAmJiB0aGlzLmlzTG9jYWxlRG9tYWluICYmIHNlbGYubG9jYXRpb24uaG9zdG5hbWUgIT09IGRldGVjdGVkRG9tYWluLmRvbWFpbikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhc05vQmFzZVBhdGggPSBkZWxCYXNlUGF0aChhcyk7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gYGh0dHAke2RldGVjdGVkRG9tYWluLmh0dHAgPyAnJyA6ICdzJ306Ly8ke2RldGVjdGVkRG9tYWluLmRvbWFpbn0ke2FkZEJhc2VQYXRoKGAke3RoaXMubG9jYWxlID09PSBkZXRlY3RlZERvbWFpbi5kZWZhdWx0TG9jYWxlID8gJycgOiBgLyR7dGhpcy5sb2NhbGV9YH0ke2FzTm9CYXNlUGF0aCA9PT0gJy8nID8gJycgOiBhc05vQmFzZVBhdGh9YCB8fCAnLycpfWA7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgd2FzIHByZXZpb3VzbHkgYSByZXR1cm4gYnV0IHdhcyByZW1vdmVkIGluIGZhdm9yXG4gICAgICAgICAgICAgICAgICAgIC8vIG9mIGJldHRlciBkZWFkIGNvZGUgZWxpbWluYXRpb24gd2l0aCByZWdlbmVyYXRvciBydW50aW1lXG4gICAgICAgICAgICAgICAgICAgIGRpZE5hdmlnYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGlkTmF2aWdhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKCk9PntcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIW9wdGlvbnMuX2gpIHtcbiAgICAgICAgICAgIHRoaXMuaXNTc3IgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBtYXJraW5nIHJvdXRlIGNoYW5nZXMgYXMgYSBuYXZpZ2F0aW9uIHN0YXJ0IGVudHJ5XG4gICAgICAgIGlmIChfdXRpbHMuU1QpIHtcbiAgICAgICAgICAgIHBlcmZvcm1hbmNlLm1hcmsoJ3JvdXRlQ2hhbmdlJyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeyBzaGFsbG93ID1mYWxzZSAgfSA9IG9wdGlvbnM7XG4gICAgICAgIGNvbnN0IHJvdXRlUHJvcHMgPSB7XG4gICAgICAgICAgICBzaGFsbG93XG4gICAgICAgIH07XG4gICAgICAgIGlmICh0aGlzLl9pbkZsaWdodFJvdXRlKSB7XG4gICAgICAgICAgICB0aGlzLmFib3J0Q29tcG9uZW50TG9hZCh0aGlzLl9pbkZsaWdodFJvdXRlLCByb3V0ZVByb3BzKTtcbiAgICAgICAgfVxuICAgICAgICBhcyA9IGFkZEJhc2VQYXRoKGFkZExvY2FsZShoYXNCYXNlUGF0aChhcykgPyBkZWxCYXNlUGF0aChhcykgOiBhcywgb3B0aW9ucy5sb2NhbGUsIHRoaXMuZGVmYXVsdExvY2FsZSkpO1xuICAgICAgICBjb25zdCBjbGVhbmVkQXMgPSBkZWxMb2NhbGUoaGFzQmFzZVBhdGgoYXMpID8gZGVsQmFzZVBhdGgoYXMpIDogYXMsIHRoaXMubG9jYWxlKTtcbiAgICAgICAgdGhpcy5faW5GbGlnaHRSb3V0ZSA9IGFzO1xuICAgICAgICBsZXQgbG9jYWxlQ2hhbmdlID0gcHJldkxvY2FsZSAhPT0gdGhpcy5sb2NhbGU7XG4gICAgICAgIC8vIElmIHRoZSB1cmwgY2hhbmdlIGlzIG9ubHkgcmVsYXRlZCB0byBhIGhhc2ggY2hhbmdlXG4gICAgICAgIC8vIFdlIHNob3VsZCBub3QgcHJvY2VlZC4gV2Ugc2hvdWxkIG9ubHkgY2hhbmdlIHRoZSBzdGF0ZS5cbiAgICAgICAgLy8gV0FSTklORzogYF9oYCBpcyBhbiBpbnRlcm5hbCBvcHRpb24gZm9yIGhhbmRpbmcgTmV4dC5qcyBjbGllbnQtc2lkZVxuICAgICAgICAvLyBoeWRyYXRpb24uIFlvdXIgYXBwIHNob3VsZCBfbmV2ZXJfIHVzZSB0aGlzIHByb3BlcnR5LiBJdCBtYXkgY2hhbmdlIGF0XG4gICAgICAgIC8vIGFueSB0aW1lIHdpdGhvdXQgbm90aWNlLlxuICAgICAgICBpZiAoIW9wdGlvbnMuX2ggJiYgdGhpcy5vbmx5QUhhc2hDaGFuZ2UoY2xlYW5lZEFzKSAmJiAhbG9jYWxlQ2hhbmdlKSB7XG4gICAgICAgICAgICB0aGlzLmFzUGF0aCA9IGNsZWFuZWRBcztcbiAgICAgICAgICAgIFJvdXRlci5ldmVudHMuZW1pdCgnaGFzaENoYW5nZVN0YXJ0JywgYXMsIHJvdXRlUHJvcHMpO1xuICAgICAgICAgICAgLy8gVE9ETzogZG8gd2UgbmVlZCB0aGUgcmVzb2x2ZWQgaHJlZiB3aGVuIG9ubHkgYSBoYXNoIGNoYW5nZT9cbiAgICAgICAgICAgIHRoaXMuY2hhbmdlU3RhdGUobWV0aG9kLCB1cmwsIGFzLCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG9IYXNoKGNsZWFuZWRBcyk7XG4gICAgICAgICAgICB0aGlzLm5vdGlmeSh0aGlzLmNvbXBvbmVudHNbdGhpcy5yb3V0ZV0sIG51bGwpO1xuICAgICAgICAgICAgUm91dGVyLmV2ZW50cy5lbWl0KCdoYXNoQ2hhbmdlQ29tcGxldGUnLCBhcywgcm91dGVQcm9wcyk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcGFyc2VkID0gKDAsIF9wYXJzZVJlbGF0aXZlVXJsKS5wYXJzZVJlbGF0aXZlVXJsKHVybCk7XG4gICAgICAgIGxldCB7IHBhdGhuYW1lOiBwYXRobmFtZTEgLCBxdWVyeTogcXVlcnkxICB9ID0gcGFyc2VkO1xuICAgICAgICAvLyBUaGUgYnVpbGQgbWFuaWZlc3QgbmVlZHMgdG8gYmUgbG9hZGVkIGJlZm9yZSBhdXRvLXN0YXRpYyBkeW5hbWljIHBhZ2VzXG4gICAgICAgIC8vIGdldCB0aGVpciBxdWVyeSBwYXJhbWV0ZXJzIHRvIGFsbG93IGVuc3VyaW5nIHRoZXkgY2FuIGJlIHBhcnNlZCBwcm9wZXJseVxuICAgICAgICAvLyB3aGVuIHJld3JpdHRlbiB0b1xuICAgICAgICBsZXQgcGFnZXMsIHJld3JpdGVzO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcGFnZXMgPSBhd2FpdCB0aGlzLnBhZ2VMb2FkZXIuZ2V0UGFnZUxpc3QoKTtcbiAgICAgICAgICAgICh7IF9fcmV3cml0ZXM6IHJld3JpdGVzICB9ID0gYXdhaXQgKDAsIF9yb3V0ZUxvYWRlcikuZ2V0Q2xpZW50QnVpbGRNYW5pZmVzdCgpKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyMSkge1xuICAgICAgICAgICAgLy8gSWYgd2UgZmFpbCB0byByZXNvbHZlIHRoZSBwYWdlIGxpc3Qgb3IgY2xpZW50LWJ1aWxkIG1hbmlmZXN0LCB3ZSBtdXN0XG4gICAgICAgICAgICAvLyBkbyBhIHNlcnZlci1zaWRlIHRyYW5zaXRpb246XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGFzO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIGFza2VkIHRvIGNoYW5nZSB0aGUgY3VycmVudCBVUkwgd2Ugc2hvdWxkIHJlbG9hZCB0aGUgY3VycmVudCBwYWdlXG4gICAgICAgIC8vIChub3QgbG9jYXRpb24ucmVsb2FkKCkgYnV0IHJlbG9hZCBnZXRJbml0aWFsUHJvcHMgYW5kIG90aGVyIE5leHQuanMgc3R1ZmZzKVxuICAgICAgICAvLyBXZSBhbHNvIG5lZWQgdG8gc2V0IHRoZSBtZXRob2QgPSByZXBsYWNlU3RhdGUgYWx3YXlzXG4gICAgICAgIC8vIGFzIHRoaXMgc2hvdWxkIG5vdCBnbyBpbnRvIHRoZSBoaXN0b3J5IChUaGF0J3MgaG93IGJyb3dzZXJzIHdvcmspXG4gICAgICAgIC8vIFdlIHNob3VsZCBjb21wYXJlIHRoZSBuZXcgYXNQYXRoIHRvIHRoZSBjdXJyZW50IGFzUGF0aCwgbm90IHRoZSB1cmxcbiAgICAgICAgaWYgKCF0aGlzLnVybElzTmV3KGNsZWFuZWRBcykgJiYgIWxvY2FsZUNoYW5nZSkge1xuICAgICAgICAgICAgbWV0aG9kID0gJ3JlcGxhY2VTdGF0ZSc7XG4gICAgICAgIH1cbiAgICAgICAgLy8gd2UgbmVlZCB0byByZXNvbHZlIHRoZSBhcyB2YWx1ZSB1c2luZyByZXdyaXRlcyBmb3IgZHluYW1pYyBTU0dcbiAgICAgICAgLy8gcGFnZXMgdG8gYWxsb3cgYnVpbGRpbmcgdGhlIGRhdGEgVVJMIGNvcnJlY3RseVxuICAgICAgICBsZXQgcmVzb2x2ZWRBcyA9IGFzO1xuICAgICAgICAvLyB1cmwgYW5kIGFzIHNob3VsZCBhbHdheXMgYmUgcHJlZml4ZWQgd2l0aCBiYXNlUGF0aCBieSB0aGlzXG4gICAgICAgIC8vIHBvaW50IGJ5IGVpdGhlciBuZXh0L2xpbmsgb3Igcm91dGVyLnB1c2gvcmVwbGFjZSBzbyBzdHJpcCB0aGVcbiAgICAgICAgLy8gYmFzZVBhdGggZnJvbSB0aGUgcGF0aG5hbWUgdG8gbWF0Y2ggdGhlIHBhZ2VzIGRpciAxLXRvLTFcbiAgICAgICAgcGF0aG5hbWUxID0gcGF0aG5hbWUxID8gKDAsIF9ub3JtYWxpemVUcmFpbGluZ1NsYXNoKS5yZW1vdmVQYXRoVHJhaWxpbmdTbGFzaChkZWxCYXNlUGF0aChwYXRobmFtZTEpKSA6IHBhdGhuYW1lMTtcbiAgICAgICAgaWYgKHNob3VsZFJlc29sdmVIcmVmICYmIHBhdGhuYW1lMSAhPT0gJy9fZXJyb3InKSB7XG4gICAgICAgICAgICBvcHRpb25zLl9zaG91bGRSZXNvbHZlSHJlZiA9IHRydWU7XG4gICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuX19ORVhUX0hBU19SRVdSSVRFUyAmJiBhcy5zdGFydHNXaXRoKCcvJykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXdyaXRlc1Jlc3VsdCA9ICgwLCBfcmVzb2x2ZVJld3JpdGVzKS5kZWZhdWx0KGFkZEJhc2VQYXRoKGFkZExvY2FsZShjbGVhbmVkQXMsIHRoaXMubG9jYWxlKSksIHBhZ2VzLCByZXdyaXRlcywgcXVlcnkxLCAocCk9PnJlc29sdmVEeW5hbWljUm91dGUocCwgcGFnZXMpXG4gICAgICAgICAgICAgICAgLCB0aGlzLmxvY2FsZXMpO1xuICAgICAgICAgICAgICAgIHJlc29sdmVkQXMgPSByZXdyaXRlc1Jlc3VsdC5hc1BhdGg7XG4gICAgICAgICAgICAgICAgaWYgKHJld3JpdGVzUmVzdWx0Lm1hdGNoZWRQYWdlICYmIHJld3JpdGVzUmVzdWx0LnJlc29sdmVkSHJlZikge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGlzIGRpcmVjdGx5IG1hdGNoZXMgYSBwYWdlIHdlIG5lZWQgdG8gdXBkYXRlIHRoZSBocmVmIHRvXG4gICAgICAgICAgICAgICAgICAgIC8vIGFsbG93IHRoZSBjb3JyZWN0IHBhZ2UgY2h1bmsgdG8gYmUgbG9hZGVkXG4gICAgICAgICAgICAgICAgICAgIHBhdGhuYW1lMSA9IHJld3JpdGVzUmVzdWx0LnJlc29sdmVkSHJlZjtcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VkLnBhdGhuYW1lID0gYWRkQmFzZVBhdGgocGF0aG5hbWUxKTtcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gKDAsIF91dGlscykuZm9ybWF0V2l0aFZhbGlkYXRpb24ocGFyc2VkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhcnNlZC5wYXRobmFtZSA9IHJlc29sdmVEeW5hbWljUm91dGUocGF0aG5hbWUxLCBwYWdlcyk7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlZC5wYXRobmFtZSAhPT0gcGF0aG5hbWUxKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGhuYW1lMSA9IHBhcnNlZC5wYXRobmFtZTtcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VkLnBhdGhuYW1lID0gYWRkQmFzZVBhdGgocGF0aG5hbWUxKTtcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gKDAsIF91dGlscykuZm9ybWF0V2l0aFZhbGlkYXRpb24ocGFyc2VkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgcm91dGUgPSAoMCwgX25vcm1hbGl6ZVRyYWlsaW5nU2xhc2gpLnJlbW92ZVBhdGhUcmFpbGluZ1NsYXNoKHBhdGhuYW1lMSk7XG4gICAgICAgIGlmICghaXNMb2NhbFVSTChhcykpIHtcbiAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGhyZWY6IFwiJHt1cmx9XCIgYW5kIGFzOiBcIiR7YXN9XCIsIHJlY2VpdmVkIHJlbGF0aXZlIGhyZWYgYW5kIGV4dGVybmFsIGFzYCArIGBcXG5TZWUgbW9yZSBpbmZvOiBodHRwczovL25leHRqcy5vcmcvZG9jcy9tZXNzYWdlcy9pbnZhbGlkLXJlbGF0aXZlLXVybC1leHRlcm5hbC1hc2ApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBhcztcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlZEFzID0gZGVsTG9jYWxlKGRlbEJhc2VQYXRoKHJlc29sdmVkQXMpLCB0aGlzLmxvY2FsZSk7XG4gICAgICAgIGlmICgoMCwgX2lzRHluYW1pYykuaXNEeW5hbWljUm91dGUocm91dGUpKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJzZWRBcyA9ICgwLCBfcGFyc2VSZWxhdGl2ZVVybCkucGFyc2VSZWxhdGl2ZVVybChyZXNvbHZlZEFzKTtcbiAgICAgICAgICAgIGNvbnN0IGFzUGF0aG5hbWUgPSBwYXJzZWRBcy5wYXRobmFtZTtcbiAgICAgICAgICAgIGNvbnN0IHJvdXRlUmVnZXggPSAoMCwgX3JvdXRlUmVnZXgpLmdldFJvdXRlUmVnZXgocm91dGUpO1xuICAgICAgICAgICAgY29uc3Qgcm91dGVNYXRjaCA9ICgwLCBfcm91dGVNYXRjaGVyKS5nZXRSb3V0ZU1hdGNoZXIocm91dGVSZWdleCkoYXNQYXRobmFtZSk7XG4gICAgICAgICAgICBjb25zdCBzaG91bGRJbnRlcnBvbGF0ZSA9IHJvdXRlID09PSBhc1BhdGhuYW1lO1xuICAgICAgICAgICAgY29uc3QgaW50ZXJwb2xhdGVkQXMgPSBzaG91bGRJbnRlcnBvbGF0ZSA/IGludGVycG9sYXRlQXMocm91dGUsIGFzUGF0aG5hbWUsIHF1ZXJ5MSkgOiB7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKCFyb3V0ZU1hdGNoIHx8IHNob3VsZEludGVycG9sYXRlICYmICFpbnRlcnBvbGF0ZWRBcy5yZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtaXNzaW5nUGFyYW1zID0gT2JqZWN0LmtleXMocm91dGVSZWdleC5ncm91cHMpLmZpbHRlcigocGFyYW0pPT4hcXVlcnkxW3BhcmFtXVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgaWYgKG1pc3NpbmdQYXJhbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGAke3Nob3VsZEludGVycG9sYXRlID8gYEludGVycG9sYXRpbmcgaHJlZmAgOiBgTWlzbWF0Y2hpbmcgXFxgYXNcXGAgYW5kIFxcYGhyZWZcXGBgfSBmYWlsZWQgdG8gbWFudWFsbHkgcHJvdmlkZSBgICsgYHRoZSBwYXJhbXM6ICR7bWlzc2luZ1BhcmFtcy5qb2luKCcsICcpfSBpbiB0aGUgXFxgaHJlZlxcYCdzIFxcYHF1ZXJ5XFxgYCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKChzaG91bGRJbnRlcnBvbGF0ZSA/IGBUaGUgcHJvdmlkZWQgXFxgaHJlZlxcYCAoJHt1cmx9KSB2YWx1ZSBpcyBtaXNzaW5nIHF1ZXJ5IHZhbHVlcyAoJHttaXNzaW5nUGFyYW1zLmpvaW4oJywgJyl9KSB0byBiZSBpbnRlcnBvbGF0ZWQgcHJvcGVybHkuIGAgOiBgVGhlIHByb3ZpZGVkIFxcYGFzXFxgIHZhbHVlICgke2FzUGF0aG5hbWV9KSBpcyBpbmNvbXBhdGlibGUgd2l0aCB0aGUgXFxgaHJlZlxcYCB2YWx1ZSAoJHtyb3V0ZX0pLiBgKSArIGBSZWFkIG1vcmU6IGh0dHBzOi8vbmV4dGpzLm9yZy9kb2NzL21lc3NhZ2VzLyR7c2hvdWxkSW50ZXJwb2xhdGUgPyAnaHJlZi1pbnRlcnBvbGF0aW9uLWZhaWxlZCcgOiAnaW5jb21wYXRpYmxlLWhyZWYtYXMnfWApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2hvdWxkSW50ZXJwb2xhdGUpIHtcbiAgICAgICAgICAgICAgICBhcyA9ICgwLCBfdXRpbHMpLmZvcm1hdFdpdGhWYWxpZGF0aW9uKE9iamVjdC5hc3NpZ24oe1xuICAgICAgICAgICAgICAgIH0sIHBhcnNlZEFzLCB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGhuYW1lOiBpbnRlcnBvbGF0ZWRBcy5yZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5OiBvbWl0UGFybXNGcm9tUXVlcnkocXVlcnkxLCBpbnRlcnBvbGF0ZWRBcy5wYXJhbXMpXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBNZXJnZSBwYXJhbXMgaW50byBgcXVlcnlgLCBvdmVyd3JpdGluZyBhbnkgc3BlY2lmaWVkIGluIHNlYXJjaFxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ocXVlcnkxLCByb3V0ZU1hdGNoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBSb3V0ZXIuZXZlbnRzLmVtaXQoJ3JvdXRlQ2hhbmdlU3RhcnQnLCBhcywgcm91dGVQcm9wcyk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgcmVmLCByZWYxO1xuICAgICAgICAgICAgbGV0IHJvdXRlSW5mbyA9IGF3YWl0IHRoaXMuZ2V0Um91dGVJbmZvKHJvdXRlLCBwYXRobmFtZTEsIHF1ZXJ5MSwgYXMsIHJlc29sdmVkQXMsIHJvdXRlUHJvcHMpO1xuICAgICAgICAgICAgbGV0IHsgZXJyb3IgLCBwcm9wcyAsIF9fTl9TU0cgLCBfX05fU1NQICB9ID0gcm91dGVJbmZvO1xuICAgICAgICAgICAgLy8gaGFuZGxlIHJlZGlyZWN0IG9uIGNsaWVudC10cmFuc2l0aW9uXG4gICAgICAgICAgICBpZiAoKF9fTl9TU0cgfHwgX19OX1NTUCkgJiYgcHJvcHMpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvcHMucGFnZVByb3BzICYmIHByb3BzLnBhZ2VQcm9wcy5fX05fUkVESVJFQ1QpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVzdGluYXRpb24gPSBwcm9wcy5wYWdlUHJvcHMuX19OX1JFRElSRUNUO1xuICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiBkZXN0aW5hdGlvbiBpcyBpbnRlcm5hbCAocmVzb2x2ZXMgdG8gYSBwYWdlKSBhbmQgYXR0ZW1wdFxuICAgICAgICAgICAgICAgICAgICAvLyBjbGllbnQtbmF2aWdhdGlvbiBpZiBpdCBpcyBmYWxsaW5nIGJhY2sgdG8gaGFyZCBuYXZpZ2F0aW9uIGlmXG4gICAgICAgICAgICAgICAgICAgIC8vIGl0J3Mgbm90XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXN0aW5hdGlvbi5zdGFydHNXaXRoKCcvJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcnNlZEhyZWYgPSAoMCwgX3BhcnNlUmVsYXRpdmVVcmwpLnBhcnNlUmVsYXRpdmVVcmwoZGVzdGluYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VkSHJlZi5wYXRobmFtZSA9IHJlc29sdmVEeW5hbWljUm91dGUocGFyc2VkSHJlZi5wYXRobmFtZSwgcGFnZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyB1cmw6IG5ld1VybCAsIGFzOiBuZXdBcyAgfSA9IHByZXBhcmVVcmxBcyh0aGlzLCBkZXN0aW5hdGlvbiwgZGVzdGluYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hhbmdlKG1ldGhvZCwgbmV3VXJsLCBuZXdBcywgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBkZXN0aW5hdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCgpPT57XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmlzUHJldmlldyA9ICEhcHJvcHMuX19OX1BSRVZJRVc7XG4gICAgICAgICAgICAgICAgLy8gaGFuZGxlIFNTRyBkYXRhIDQwNFxuICAgICAgICAgICAgICAgIGlmIChwcm9wcy5ub3RGb3VuZCA9PT0gU1NHX0RBVEFfTk9UX0ZPVU5EKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBub3RGb3VuZFJvdXRlO1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5mZXRjaENvbXBvbmVudCgnLzQwNCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbm90Rm91bmRSb3V0ZSA9ICcvNDA0JztcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm90Rm91bmRSb3V0ZSA9ICcvX2Vycm9yJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByb3V0ZUluZm8gPSBhd2FpdCB0aGlzLmdldFJvdXRlSW5mbyhub3RGb3VuZFJvdXRlLCBub3RGb3VuZFJvdXRlLCBxdWVyeTEsIGFzLCByZXNvbHZlZEFzLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFsbG93OiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBSb3V0ZXIuZXZlbnRzLmVtaXQoJ2JlZm9yZUhpc3RvcnlDaGFuZ2UnLCBhcywgcm91dGVQcm9wcyk7XG4gICAgICAgICAgICB0aGlzLmNoYW5nZVN0YXRlKG1ldGhvZCwgdXJsLCBhcywgb3B0aW9ucyk7XG4gICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFwcENvbXAgPSB0aGlzLmNvbXBvbmVudHNbJy9fYXBwJ10uQ29tcG9uZW50O1xuICAgICAgICAgICAgICAgIHdpbmRvdy5uZXh0LmlzUHJlcmVuZGVyZWQgPSBhcHBDb21wLmdldEluaXRpYWxQcm9wcyA9PT0gYXBwQ29tcC5vcmlnR2V0SW5pdGlhbFByb3BzICYmICFyb3V0ZUluZm8uQ29tcG9uZW50LmdldEluaXRpYWxQcm9wcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLl9oICYmIHBhdGhuYW1lMSA9PT0gJy9fZXJyb3InICYmICgocmVmID0gc2VsZi5fX05FWFRfREFUQV9fLnByb3BzKSA9PT0gbnVsbCB8fCByZWYgPT09IHZvaWQgMCA/IHZvaWQgMCA6IChyZWYxID0gcmVmLnBhZ2VQcm9wcykgPT09IG51bGwgfHwgcmVmMSA9PT0gdm9pZCAwID8gdm9pZCAwIDogcmVmMS5zdGF0dXNDb2RlKSA9PT0gNTAwICYmIChwcm9wcyA9PT0gbnVsbCB8fCBwcm9wcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogcHJvcHMucGFnZVByb3BzKSkge1xuICAgICAgICAgICAgICAgIC8vIGVuc3VyZSBzdGF0dXNDb2RlIGlzIHN0aWxsIGNvcnJlY3QgZm9yIHN0YXRpYyA1MDAgcGFnZVxuICAgICAgICAgICAgICAgIC8vIHdoZW4gdXBkYXRpbmcgcXVlcnkgaW5mb3JtYXRpb25cbiAgICAgICAgICAgICAgICBwcm9wcy5wYWdlUHJvcHMuc3RhdHVzQ29kZSA9IDUwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNoYWxsb3cgcm91dGluZyBpcyBvbmx5IGFsbG93ZWQgZm9yIHNhbWUgcGFnZSBVUkwgY2hhbmdlcy5cbiAgICAgICAgICAgIGNvbnN0IGlzVmFsaWRTaGFsbG93Um91dGUgPSBvcHRpb25zLnNoYWxsb3cgJiYgdGhpcy5yb3V0ZSA9PT0gcm91dGU7XG4gICAgICAgICAgICB2YXIgX3Njcm9sbDtcbiAgICAgICAgICAgIGNvbnN0IHNob3VsZFNjcm9sbCA9IChfc2Nyb2xsID0gb3B0aW9ucy5zY3JvbGwpICE9PSBudWxsICYmIF9zY3JvbGwgIT09IHZvaWQgMCA/IF9zY3JvbGwgOiAhaXNWYWxpZFNoYWxsb3dSb3V0ZTtcbiAgICAgICAgICAgIGNvbnN0IHJlc2V0U2Nyb2xsID0gc2hvdWxkU2Nyb2xsID8ge1xuICAgICAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICAgICAgeTogMFxuICAgICAgICAgICAgfSA6IG51bGw7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnNldChyb3V0ZSwgcGF0aG5hbWUxLCBxdWVyeTEsIGNsZWFuZWRBcywgcm91dGVJbmZvLCBmb3JjZWRTY3JvbGwgIT09IG51bGwgJiYgZm9yY2VkU2Nyb2xsICE9PSB2b2lkIDAgPyBmb3JjZWRTY3JvbGwgOiByZXNldFNjcm9sbCkuY2F0Y2goKGUpPT57XG4gICAgICAgICAgICAgICAgaWYgKGUuY2FuY2VsbGVkKSBlcnJvciA9IGVycm9yIHx8IGU7XG4gICAgICAgICAgICAgICAgZWxzZSB0aHJvdyBlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBSb3V0ZXIuZXZlbnRzLmVtaXQoJ3JvdXRlQ2hhbmdlRXJyb3InLCBlcnJvciwgY2xlYW5lZEFzLCByb3V0ZVByb3BzKTtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5fX05FWFRfSTE4Tl9TVVBQT1JUKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubG9jYWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5sYW5nID0gdGhpcy5sb2NhbGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgUm91dGVyLmV2ZW50cy5lbWl0KCdyb3V0ZUNoYW5nZUNvbXBsZXRlJywgYXMsIHJvdXRlUHJvcHMpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gY2F0Y2ggKGVycjEpIHtcbiAgICAgICAgICAgIGlmIChlcnIxLmNhbmNlbGxlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGVycjE7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2hhbmdlU3RhdGUobWV0aG9kLCB1cmwsIGFzLCBvcHRpb25zID0ge1xuICAgIH0pIHtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd2luZG93Lmhpc3RvcnkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgV2FybmluZzogd2luZG93Lmhpc3RvcnkgaXMgbm90IGF2YWlsYWJsZS5gKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5oaXN0b3J5W21ldGhvZF0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgV2FybmluZzogd2luZG93Lmhpc3RvcnkuJHttZXRob2R9IGlzIG5vdCBhdmFpbGFibGVgKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1ldGhvZCAhPT0gJ3B1c2hTdGF0ZScgfHwgKDAsIF91dGlscykuZ2V0VVJMKCkgIT09IGFzKSB7XG4gICAgICAgICAgICB0aGlzLl9zaGFsbG93ID0gb3B0aW9ucy5zaGFsbG93O1xuICAgICAgICAgICAgd2luZG93Lmhpc3RvcnlbbWV0aG9kXSh7XG4gICAgICAgICAgICAgICAgdXJsLFxuICAgICAgICAgICAgICAgIGFzLFxuICAgICAgICAgICAgICAgIG9wdGlvbnMsXG4gICAgICAgICAgICAgICAgX19OOiB0cnVlLFxuICAgICAgICAgICAgICAgIGlkeDogdGhpcy5faWR4ID0gbWV0aG9kICE9PSAncHVzaFN0YXRlJyA/IHRoaXMuX2lkeCA6IHRoaXMuX2lkeCArIDFcbiAgICAgICAgICAgIH0sIC8vIE1vc3QgYnJvd3NlcnMgY3VycmVudGx5IGlnbm9yZXMgdGhpcyBwYXJhbWV0ZXIsIGFsdGhvdWdoIHRoZXkgbWF5IHVzZSBpdCBpbiB0aGUgZnV0dXJlLlxuICAgICAgICAgICAgLy8gUGFzc2luZyB0aGUgZW1wdHkgc3RyaW5nIGhlcmUgc2hvdWxkIGJlIHNhZmUgYWdhaW5zdCBmdXR1cmUgY2hhbmdlcyB0byB0aGUgbWV0aG9kLlxuICAgICAgICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0hpc3RvcnkvcmVwbGFjZVN0YXRlXG4gICAgICAgICAgICAnJywgYXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzeW5jIGhhbmRsZVJvdXRlSW5mb0Vycm9yKGVyciwgcGF0aG5hbWUsIHF1ZXJ5LCBhcywgcm91dGVQcm9wcywgbG9hZEVycm9yRmFpbCkge1xuICAgICAgICBpZiAoZXJyLmNhbmNlbGxlZCkge1xuICAgICAgICAgICAgLy8gYnViYmxlIHVwIGNhbmNlbGxhdGlvbiBlcnJvcnNcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKDAsIF9yb3V0ZUxvYWRlcikuaXNBc3NldEVycm9yKGVycikgfHwgbG9hZEVycm9yRmFpbCkge1xuICAgICAgICAgICAgUm91dGVyLmV2ZW50cy5lbWl0KCdyb3V0ZUNoYW5nZUVycm9yJywgZXJyLCBhcywgcm91dGVQcm9wcyk7XG4gICAgICAgICAgICAvLyBJZiB3ZSBjYW4ndCBsb2FkIHRoZSBwYWdlIGl0IGNvdWxkIGJlIG9uZSBvZiBmb2xsb3dpbmcgcmVhc29uc1xuICAgICAgICAgICAgLy8gIDEuIFBhZ2UgZG9lc24ndCBleGlzdHNcbiAgICAgICAgICAgIC8vICAyLiBQYWdlIGRvZXMgZXhpc3QgaW4gYSBkaWZmZXJlbnQgem9uZVxuICAgICAgICAgICAgLy8gIDMuIEludGVybmFsIGVycm9yIHdoaWxlIGxvYWRpbmcgdGhlIHBhZ2VcbiAgICAgICAgICAgIC8vIFNvLCBkb2luZyBhIGhhcmQgcmVsb2FkIGlzIHRoZSBwcm9wZXIgd2F5IHRvIGRlYWwgd2l0aCB0aGlzLlxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBhcztcbiAgICAgICAgICAgIC8vIENoYW5naW5nIHRoZSBVUkwgZG9lc24ndCBibG9jayBleGVjdXRpbmcgdGhlIGN1cnJlbnQgY29kZSBwYXRoLlxuICAgICAgICAgICAgLy8gU28gbGV0J3MgdGhyb3cgYSBjYW5jZWxsYXRpb24gZXJyb3Igc3RvcCB0aGUgcm91dGluZyBsb2dpYy5cbiAgICAgICAgICAgIHRocm93IGJ1aWxkQ2FuY2VsbGF0aW9uRXJyb3IoKTtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IENvbXBvbmVudDE7XG4gICAgICAgICAgICBsZXQgc3R5bGVTaGVldHM7XG4gICAgICAgICAgICBsZXQgcHJvcHM7XG4gICAgICAgICAgICBpZiAodHlwZW9mIENvbXBvbmVudDEgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBzdHlsZVNoZWV0cyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAoeyBwYWdlOiBDb21wb25lbnQxICwgc3R5bGVTaGVldHMgIH0gPSBhd2FpdCB0aGlzLmZldGNoQ29tcG9uZW50KCcvX2Vycm9yJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgcm91dGVJbmZvID0ge1xuICAgICAgICAgICAgICAgIHByb3BzLFxuICAgICAgICAgICAgICAgIENvbXBvbmVudDogQ29tcG9uZW50MSxcbiAgICAgICAgICAgICAgICBzdHlsZVNoZWV0cyxcbiAgICAgICAgICAgICAgICBlcnIsXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVyclxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICghcm91dGVJbmZvLnByb3BzKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcm91dGVJbmZvLnByb3BzID0gYXdhaXQgdGhpcy5nZXRJbml0aWFsUHJvcHMoQ29tcG9uZW50MSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChnaXBFcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgaW4gZXJyb3IgcGFnZSBgZ2V0SW5pdGlhbFByb3BzYDogJywgZ2lwRXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcm91dGVJbmZvLnByb3BzID0ge1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByb3V0ZUluZm87XG4gICAgICAgIH0gY2F0Y2ggKHJvdXRlSW5mb0Vycikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlUm91dGVJbmZvRXJyb3Iocm91dGVJbmZvRXJyLCBwYXRobmFtZSwgcXVlcnksIGFzLCByb3V0ZVByb3BzLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhc3luYyBnZXRSb3V0ZUluZm8ocm91dGUsIHBhdGhuYW1lLCBxdWVyeSwgYXMsIHJlc29sdmVkQXMsIHJvdXRlUHJvcHMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nUm91dGVJbmZvID0gdGhpcy5jb21wb25lbnRzW3JvdXRlXTtcbiAgICAgICAgICAgIGlmIChyb3V0ZVByb3BzLnNoYWxsb3cgJiYgZXhpc3RpbmdSb3V0ZUluZm8gJiYgdGhpcy5yb3V0ZSA9PT0gcm91dGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXhpc3RpbmdSb3V0ZUluZm87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBjYWNoZWRSb3V0ZUluZm8gPSBleGlzdGluZ1JvdXRlSW5mbyAmJiAnaW5pdGlhbCcgaW4gZXhpc3RpbmdSb3V0ZUluZm8gPyB1bmRlZmluZWQgOiBleGlzdGluZ1JvdXRlSW5mbztcbiAgICAgICAgICAgIGNvbnN0IHJvdXRlSW5mbyA9IGNhY2hlZFJvdXRlSW5mbyA/IGNhY2hlZFJvdXRlSW5mbyA6IGF3YWl0IHRoaXMuZmV0Y2hDb21wb25lbnQocm91dGUpLnRoZW4oKHJlcyk9Pih7XG4gICAgICAgICAgICAgICAgICAgIENvbXBvbmVudDogcmVzLnBhZ2UsXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlU2hlZXRzOiByZXMuc3R5bGVTaGVldHMsXG4gICAgICAgICAgICAgICAgICAgIF9fTl9TU0c6IHJlcy5tb2QuX19OX1NTRyxcbiAgICAgICAgICAgICAgICAgICAgX19OX1NTUDogcmVzLm1vZC5fX05fU1NQXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCB7IENvbXBvbmVudDogQ29tcG9uZW50MSAsIF9fTl9TU0cgLCBfX05fU1NQICB9ID0gcm91dGVJbmZvO1xuICAgICAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGlzVmFsaWRFbGVtZW50VHlwZSAgfSA9IHJlcXVpcmUoJ3JlYWN0LWlzJyk7XG4gICAgICAgICAgICAgICAgaWYgKCFpc1ZhbGlkRWxlbWVudFR5cGUoQ29tcG9uZW50MSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgZGVmYXVsdCBleHBvcnQgaXMgbm90IGEgUmVhY3QgQ29tcG9uZW50IGluIHBhZ2U6IFwiJHtwYXRobmFtZX1cImApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBkYXRhSHJlZjtcbiAgICAgICAgICAgIGlmIChfX05fU1NHIHx8IF9fTl9TU1ApIHtcbiAgICAgICAgICAgICAgICBkYXRhSHJlZiA9IHRoaXMucGFnZUxvYWRlci5nZXREYXRhSHJlZigoMCwgX3V0aWxzKS5mb3JtYXRXaXRoVmFsaWRhdGlvbih7XG4gICAgICAgICAgICAgICAgICAgIHBhdGhuYW1lLFxuICAgICAgICAgICAgICAgICAgICBxdWVyeVxuICAgICAgICAgICAgICAgIH0pLCByZXNvbHZlZEFzLCBfX05fU1NHLCB0aGlzLmxvY2FsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwcm9wcyA9IGF3YWl0IHRoaXMuX2dldERhdGEoKCk9Pl9fTl9TU0cgPyB0aGlzLl9nZXRTdGF0aWNEYXRhKGRhdGFIcmVmKSA6IF9fTl9TU1AgPyB0aGlzLl9nZXRTZXJ2ZXJEYXRhKGRhdGFIcmVmKSA6IHRoaXMuZ2V0SW5pdGlhbFByb3BzKENvbXBvbmVudDEsIC8vIHdlIHByb3ZpZGUgQXBwVHJlZSBsYXRlciBzbyB0aGlzIG5lZWRzIHRvIGJlIGBhbnlgXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBwYXRobmFtZSxcbiAgICAgICAgICAgICAgICAgICAgcXVlcnksXG4gICAgICAgICAgICAgICAgICAgIGFzUGF0aDogYXMsXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsZTogdGhpcy5sb2NhbGUsXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsZXM6IHRoaXMubG9jYWxlcyxcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdExvY2FsZTogdGhpcy5kZWZhdWx0TG9jYWxlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByb3V0ZUluZm8ucHJvcHMgPSBwcm9wcztcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50c1tyb3V0ZV0gPSByb3V0ZUluZm87XG4gICAgICAgICAgICByZXR1cm4gcm91dGVJbmZvO1xuICAgICAgICB9IGNhdGNoIChlcnIyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVSb3V0ZUluZm9FcnJvcihlcnIyLCBwYXRobmFtZSwgcXVlcnksIGFzLCByb3V0ZVByb3BzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzZXQocm91dGUsIHBhdGhuYW1lLCBxdWVyeSwgYXMsIGRhdGEsIHJlc2V0U2Nyb2xsKSB7XG4gICAgICAgIHRoaXMuaXNGYWxsYmFjayA9IGZhbHNlO1xuICAgICAgICB0aGlzLnJvdXRlID0gcm91dGU7XG4gICAgICAgIHRoaXMucGF0aG5hbWUgPSBwYXRobmFtZTtcbiAgICAgICAgdGhpcy5xdWVyeSA9IHF1ZXJ5O1xuICAgICAgICB0aGlzLmFzUGF0aCA9IGFzO1xuICAgICAgICByZXR1cm4gdGhpcy5ub3RpZnkoZGF0YSwgcmVzZXRTY3JvbGwpO1xuICAgIH1cbiAgICAvKipcbiAgICogQ2FsbGJhY2sgdG8gZXhlY3V0ZSBiZWZvcmUgcmVwbGFjaW5nIHJvdXRlciBzdGF0ZVxuICAgKiBAcGFyYW0gY2IgY2FsbGJhY2sgdG8gYmUgZXhlY3V0ZWRcbiAgICovIGJlZm9yZVBvcFN0YXRlKGNiKSB7XG4gICAgICAgIHRoaXMuX2JwcyA9IGNiO1xuICAgIH1cbiAgICBvbmx5QUhhc2hDaGFuZ2UoYXMpIHtcbiAgICAgICAgaWYgKCF0aGlzLmFzUGF0aCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBjb25zdCBbb2xkVXJsTm9IYXNoLCBvbGRIYXNoXSA9IHRoaXMuYXNQYXRoLnNwbGl0KCcjJyk7XG4gICAgICAgIGNvbnN0IFtuZXdVcmxOb0hhc2gsIG5ld0hhc2hdID0gYXMuc3BsaXQoJyMnKTtcbiAgICAgICAgLy8gTWFrZXMgc3VyZSB3ZSBzY3JvbGwgdG8gdGhlIHByb3ZpZGVkIGhhc2ggaWYgdGhlIHVybC9oYXNoIGFyZSB0aGUgc2FtZVxuICAgICAgICBpZiAobmV3SGFzaCAmJiBvbGRVcmxOb0hhc2ggPT09IG5ld1VybE5vSGFzaCAmJiBvbGRIYXNoID09PSBuZXdIYXNoKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB0aGUgdXJscyBhcmUgY2hhbmdlLCB0aGVyZSdzIG1vcmUgdGhhbiBhIGhhc2ggY2hhbmdlXG4gICAgICAgIGlmIChvbGRVcmxOb0hhc2ggIT09IG5ld1VybE5vSGFzaCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIHRoZSBoYXNoIGhhcyBjaGFuZ2VkLCB0aGVuIGl0J3MgYSBoYXNoIG9ubHkgY2hhbmdlLlxuICAgICAgICAvLyBUaGlzIGNoZWNrIGlzIG5lY2Vzc2FyeSB0byBoYW5kbGUgYm90aCB0aGUgZW50ZXIgYW5kXG4gICAgICAgIC8vIGxlYXZlIGhhc2ggPT09ICcnIGNhc2VzLiBUaGUgaWRlbnRpdHkgY2FzZSBmYWxscyB0aHJvdWdoXG4gICAgICAgIC8vIGFuZCBpcyB0cmVhdGVkIGFzIGEgbmV4dCByZWxvYWQuXG4gICAgICAgIHJldHVybiBvbGRIYXNoICE9PSBuZXdIYXNoO1xuICAgIH1cbiAgICBzY3JvbGxUb0hhc2goYXMpIHtcbiAgICAgICAgY29uc3QgWywgaGFzaF0gPSBhcy5zcGxpdCgnIycpO1xuICAgICAgICAvLyBTY3JvbGwgdG8gdG9wIGlmIHRoZSBoYXNoIGlzIGp1c3QgYCNgIHdpdGggbm8gdmFsdWUgb3IgYCN0b3BgXG4gICAgICAgIC8vIFRvIG1pcnJvciBicm93c2Vyc1xuICAgICAgICBpZiAoaGFzaCA9PT0gJycgfHwgaGFzaCA9PT0gJ3RvcCcpIHtcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBGaXJzdCB3ZSBjaGVjayBpZiB0aGUgZWxlbWVudCBieSBpZCBpcyBmb3VuZFxuICAgICAgICBjb25zdCBpZEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaGFzaCk7XG4gICAgICAgIGlmIChpZEVsKSB7XG4gICAgICAgICAgICBpZEVsLnNjcm9sbEludG9WaWV3KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgdGhlcmUncyBubyBlbGVtZW50IHdpdGggdGhlIGlkLCB3ZSBjaGVjayB0aGUgYG5hbWVgIHByb3BlcnR5XG4gICAgICAgIC8vIFRvIG1pcnJvciBicm93c2Vyc1xuICAgICAgICBjb25zdCBuYW1lRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZShoYXNoKVswXTtcbiAgICAgICAgaWYgKG5hbWVFbCkge1xuICAgICAgICAgICAgbmFtZUVsLnNjcm9sbEludG9WaWV3KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdXJsSXNOZXcoYXNQYXRoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFzUGF0aCAhPT0gYXNQYXRoO1xuICAgIH1cbiAgICAvKipcbiAgICogUHJlZmV0Y2ggcGFnZSBjb2RlLCB5b3UgbWF5IHdhaXQgZm9yIHRoZSBkYXRhIGR1cmluZyBwYWdlIHJlbmRlcmluZy5cbiAgICogVGhpcyBmZWF0dXJlIG9ubHkgd29ya3MgaW4gcHJvZHVjdGlvbiFcbiAgICogQHBhcmFtIHVybCB0aGUgaHJlZiBvZiBwcmVmZXRjaGVkIHBhZ2VcbiAgICogQHBhcmFtIGFzUGF0aCB0aGUgYXMgcGF0aCBvZiB0aGUgcHJlZmV0Y2hlZCBwYWdlXG4gICAqLyBhc3luYyBwcmVmZXRjaCh1cmwsIGFzUGF0aCA9IHVybCwgb3B0aW9ucyA9IHtcbiAgICB9KSB7XG4gICAgICAgIGxldCBwYXJzZWQgPSAoMCwgX3BhcnNlUmVsYXRpdmVVcmwpLnBhcnNlUmVsYXRpdmVVcmwodXJsKTtcbiAgICAgICAgbGV0IHsgcGF0aG5hbWU6IHBhdGhuYW1lMiAgfSA9IHBhcnNlZDtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Ll9fTkVYVF9JMThOX1NVUFBPUlQpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmxvY2FsZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBwYXRobmFtZTIgPSAoMCwgX25vcm1hbGl6ZUxvY2FsZVBhdGgpLm5vcm1hbGl6ZUxvY2FsZVBhdGgocGF0aG5hbWUyLCB0aGlzLmxvY2FsZXMpLnBhdGhuYW1lO1xuICAgICAgICAgICAgICAgIHBhcnNlZC5wYXRobmFtZSA9IHBhdGhuYW1lMjtcbiAgICAgICAgICAgICAgICB1cmwgPSAoMCwgX3V0aWxzKS5mb3JtYXRXaXRoVmFsaWRhdGlvbihwYXJzZWQpO1xuICAgICAgICAgICAgICAgIGxldCBwYXJzZWRBcyA9ICgwLCBfcGFyc2VSZWxhdGl2ZVVybCkucGFyc2VSZWxhdGl2ZVVybChhc1BhdGgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxvY2FsZVBhdGhSZXN1bHQgPSAoMCwgX25vcm1hbGl6ZUxvY2FsZVBhdGgpLm5vcm1hbGl6ZUxvY2FsZVBhdGgocGFyc2VkQXMucGF0aG5hbWUsIHRoaXMubG9jYWxlcyk7XG4gICAgICAgICAgICAgICAgcGFyc2VkQXMucGF0aG5hbWUgPSBsb2NhbGVQYXRoUmVzdWx0LnBhdGhuYW1lO1xuICAgICAgICAgICAgICAgIG9wdGlvbnMubG9jYWxlID0gbG9jYWxlUGF0aFJlc3VsdC5kZXRlY3RlZExvY2FsZSB8fCB0aGlzLmRlZmF1bHRMb2NhbGU7XG4gICAgICAgICAgICAgICAgYXNQYXRoID0gKDAsIF91dGlscykuZm9ybWF0V2l0aFZhbGlkYXRpb24ocGFyc2VkQXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBhZ2VzID0gYXdhaXQgdGhpcy5wYWdlTG9hZGVyLmdldFBhZ2VMaXN0KCk7XG4gICAgICAgIGxldCByZXNvbHZlZEFzID0gYXNQYXRoO1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuX19ORVhUX0hBU19SRVdSSVRFUyAmJiBhc1BhdGguc3RhcnRzV2l0aCgnLycpKSB7XG4gICAgICAgICAgICBsZXQgcmV3cml0ZXM7XG4gICAgICAgICAgICAoeyBfX3Jld3JpdGVzOiByZXdyaXRlcyAgfSA9IGF3YWl0ICgwLCBfcm91dGVMb2FkZXIpLmdldENsaWVudEJ1aWxkTWFuaWZlc3QoKSk7XG4gICAgICAgICAgICBjb25zdCByZXdyaXRlc1Jlc3VsdCA9ICgwLCBfcmVzb2x2ZVJld3JpdGVzKS5kZWZhdWx0KGFkZEJhc2VQYXRoKGFkZExvY2FsZShhc1BhdGgsIHRoaXMubG9jYWxlKSksIHBhZ2VzLCByZXdyaXRlcywgcGFyc2VkLnF1ZXJ5LCAocCk9PnJlc29sdmVEeW5hbWljUm91dGUocCwgcGFnZXMpXG4gICAgICAgICAgICAsIHRoaXMubG9jYWxlcyk7XG4gICAgICAgICAgICByZXNvbHZlZEFzID0gZGVsTG9jYWxlKGRlbEJhc2VQYXRoKHJld3JpdGVzUmVzdWx0LmFzUGF0aCksIHRoaXMubG9jYWxlKTtcbiAgICAgICAgICAgIGlmIChyZXdyaXRlc1Jlc3VsdC5tYXRjaGVkUGFnZSAmJiByZXdyaXRlc1Jlc3VsdC5yZXNvbHZlZEhyZWYpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGlzIGRpcmVjdGx5IG1hdGNoZXMgYSBwYWdlIHdlIG5lZWQgdG8gdXBkYXRlIHRoZSBocmVmIHRvXG4gICAgICAgICAgICAgICAgLy8gYWxsb3cgdGhlIGNvcnJlY3QgcGFnZSBjaHVuayB0byBiZSBsb2FkZWRcbiAgICAgICAgICAgICAgICBwYXRobmFtZTIgPSByZXdyaXRlc1Jlc3VsdC5yZXNvbHZlZEhyZWY7XG4gICAgICAgICAgICAgICAgcGFyc2VkLnBhdGhuYW1lID0gcGF0aG5hbWUyO1xuICAgICAgICAgICAgICAgIHVybCA9ICgwLCBfdXRpbHMpLmZvcm1hdFdpdGhWYWxpZGF0aW9uKHBhcnNlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXJzZWQucGF0aG5hbWUgPSByZXNvbHZlRHluYW1pY1JvdXRlKHBhcnNlZC5wYXRobmFtZSwgcGFnZXMpO1xuICAgICAgICAgICAgaWYgKHBhcnNlZC5wYXRobmFtZSAhPT0gcGF0aG5hbWUyKSB7XG4gICAgICAgICAgICAgICAgcGF0aG5hbWUyID0gcGFyc2VkLnBhdGhuYW1lO1xuICAgICAgICAgICAgICAgIHBhcnNlZC5wYXRobmFtZSA9IHBhdGhuYW1lMjtcbiAgICAgICAgICAgICAgICB1cmwgPSAoMCwgX3V0aWxzKS5mb3JtYXRXaXRoVmFsaWRhdGlvbihwYXJzZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJvdXRlID0gKDAsIF9ub3JtYWxpemVUcmFpbGluZ1NsYXNoKS5yZW1vdmVQYXRoVHJhaWxpbmdTbGFzaChwYXRobmFtZTIpO1xuICAgICAgICAvLyBQcmVmZXRjaCBpcyBub3Qgc3VwcG9ydGVkIGluIGRldmVsb3BtZW50IG1vZGUgYmVjYXVzZSBpdCB3b3VsZCB0cmlnZ2VyIG9uLWRlbWFuZC1lbnRyaWVzXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgdGhpcy5wYWdlTG9hZGVyLl9pc1NzZyhyb3V0ZSkudGhlbigoaXNTc2cpPT57XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzU3NnID8gdGhpcy5fZ2V0U3RhdGljRGF0YSh0aGlzLnBhZ2VMb2FkZXIuZ2V0RGF0YUhyZWYodXJsLCByZXNvbHZlZEFzLCB0cnVlLCB0eXBlb2Ygb3B0aW9ucy5sb2NhbGUgIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucy5sb2NhbGUgOiB0aGlzLmxvY2FsZSkpIDogZmFsc2U7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHRoaXMucGFnZUxvYWRlcltvcHRpb25zLnByaW9yaXR5ID8gJ2xvYWRQYWdlJyA6ICdwcmVmZXRjaCddKHJvdXRlKSwgXG4gICAgICAgIF0pO1xuICAgIH1cbiAgICBhc3luYyBmZXRjaENvbXBvbmVudChyb3V0ZSkge1xuICAgICAgICBsZXQgY2FuY2VsbGVkID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IGNhbmNlbCA9IHRoaXMuY2xjID0gKCk9PntcbiAgICAgICAgICAgIGNhbmNlbGxlZCA9IHRydWU7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudFJlc3VsdCA9IGF3YWl0IHRoaXMucGFnZUxvYWRlci5sb2FkUGFnZShyb3V0ZSk7XG4gICAgICAgIGlmIChjYW5jZWxsZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKGBBYm9ydCBmZXRjaGluZyBjb21wb25lbnQgZm9yIHJvdXRlOiBcIiR7cm91dGV9XCJgKTtcbiAgICAgICAgICAgIGVycm9yLmNhbmNlbGxlZCA9IHRydWU7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2FuY2VsID09PSB0aGlzLmNsYykge1xuICAgICAgICAgICAgdGhpcy5jbGMgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21wb25lbnRSZXN1bHQ7XG4gICAgfVxuICAgIF9nZXREYXRhKGZuKSB7XG4gICAgICAgIGxldCBjYW5jZWxsZWQgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgY2FuY2VsID0gKCk9PntcbiAgICAgICAgICAgIGNhbmNlbGxlZCA9IHRydWU7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2xjID0gY2FuY2VsO1xuICAgICAgICByZXR1cm4gZm4oKS50aGVuKChkYXRhKT0+e1xuICAgICAgICAgICAgaWYgKGNhbmNlbCA9PT0gdGhpcy5jbGMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsYyA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2FuY2VsbGVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXJyMiA9IG5ldyBFcnJvcignTG9hZGluZyBpbml0aWFsIHByb3BzIGNhbmNlbGxlZCcpO1xuICAgICAgICAgICAgICAgIGVycjIuY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnIyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBfZ2V0U3RhdGljRGF0YShkYXRhSHJlZikge1xuICAgICAgICBjb25zdCB7IGhyZWY6IGNhY2hlS2V5ICB9ID0gbmV3IFVSTChkYXRhSHJlZiwgd2luZG93LmxvY2F0aW9uLmhyZWYpO1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyAmJiAhdGhpcy5pc1ByZXZpZXcgJiYgdGhpcy5zZGNbY2FjaGVLZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuc2RjW2NhY2hlS2V5XSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZldGNoTmV4dERhdGEoZGF0YUhyZWYsIHRoaXMuaXNTc3IpLnRoZW4oKGRhdGEpPT57XG4gICAgICAgICAgICB0aGlzLnNkY1tjYWNoZUtleV0gPSBkYXRhO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBfZ2V0U2VydmVyRGF0YShkYXRhSHJlZikge1xuICAgICAgICBjb25zdCB7IGhyZWY6IHJlc291cmNlS2V5ICB9ID0gbmV3IFVSTChkYXRhSHJlZiwgd2luZG93LmxvY2F0aW9uLmhyZWYpO1xuICAgICAgICBpZiAodGhpcy5zZHJbcmVzb3VyY2VLZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZHJbcmVzb3VyY2VLZXldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnNkcltyZXNvdXJjZUtleV0gPSBmZXRjaE5leHREYXRhKGRhdGFIcmVmLCB0aGlzLmlzU3NyKS50aGVuKChkYXRhKT0+e1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuc2RyW3Jlc291cmNlS2V5XTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9KS5jYXRjaCgoZXJyMik9PntcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnNkcltyZXNvdXJjZUtleV07XG4gICAgICAgICAgICB0aHJvdyBlcnIyO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0SW5pdGlhbFByb3BzKENvbXBvbmVudCwgY3R4KSB7XG4gICAgICAgIGNvbnN0IHsgQ29tcG9uZW50OiBBcHAxICB9ID0gdGhpcy5jb21wb25lbnRzWycvX2FwcCddO1xuICAgICAgICBjb25zdCBBcHBUcmVlID0gdGhpcy5fd3JhcEFwcChBcHAxKTtcbiAgICAgICAgY3R4LkFwcFRyZWUgPSBBcHBUcmVlO1xuICAgICAgICByZXR1cm4gKDAsIF91dGlscykubG9hZEdldEluaXRpYWxQcm9wcyhBcHAxLCB7XG4gICAgICAgICAgICBBcHBUcmVlLFxuICAgICAgICAgICAgQ29tcG9uZW50LFxuICAgICAgICAgICAgcm91dGVyOiB0aGlzLFxuICAgICAgICAgICAgY3R4XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhYm9ydENvbXBvbmVudExvYWQoYXMsIHJvdXRlUHJvcHMpIHtcbiAgICAgICAgaWYgKHRoaXMuY2xjKSB7XG4gICAgICAgICAgICBSb3V0ZXIuZXZlbnRzLmVtaXQoJ3JvdXRlQ2hhbmdlRXJyb3InLCBidWlsZENhbmNlbGxhdGlvbkVycm9yKCksIGFzLCByb3V0ZVByb3BzKTtcbiAgICAgICAgICAgIHRoaXMuY2xjKCk7XG4gICAgICAgICAgICB0aGlzLmNsYyA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbm90aWZ5KGRhdGEsIHJlc2V0U2Nyb2xsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN1YihkYXRhLCB0aGlzLmNvbXBvbmVudHNbJy9fYXBwJ10uQ29tcG9uZW50LCByZXNldFNjcm9sbCk7XG4gICAgfVxufVxuUm91dGVyLmV2ZW50cyA9ICgwLCBfbWl0dCkuZGVmYXVsdCgpO1xuZXhwb3J0cy5kZWZhdWx0ID0gUm91dGVyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1yb3V0ZXIuanMubWFwIiwiaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgQm9hcmREZXRhaWxQYWdlIGZyb20gXCIuLi8uLi8uLi9zcmMvZmVhdHVyZS9ib2FyZC90ZW1wbGF0ZS9Cb2FyZERldGFpbFBhZ2VcIjtcclxuXHJcbmNvbnN0IGluZGV4ID0gKCkgPT4ge1xyXG4gIHJldHVybiA8Qm9hcmREZXRhaWxQYWdlIC8+O1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgaW5kZXg7XHJcbiIsImV4cG9ydCBjb25zdCBkdW1teUJvYXJkTGlzdCA9IFtcclxuICB7XHJcbiAgICBpZDogMSxcclxuICAgIHRpdGxlOiBcIuyZgCDrjIDrsJVcIixcclxuICAgIHdyaXRlcjogXCLshpDtnaXrr7xcIixcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAyLFxyXG4gICAgdGl0bGU6IFwi7JmAIOuvuOyzpOuLpFwiLFxyXG4gICAgd3JpdGVyOiBcIuyViOygle2ZmFwiLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6IDMsXHJcbiAgICB0aXRsZTogXCLsmYAg7Ja065a76rKMIOydtOuftCDsiJjqsIBcIixcclxuICAgIHdyaXRlcjogXCLquYDrr7zsnqxcIixcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiA0LFxyXG4gICAgdGl0bGU6IFwi7JmAIOq3uOumrOymiOunjCDrr7jss6Tri6RcIixcclxuICAgIHdyaXRlcjogXCLtmansnZjsobBcIixcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiA1LFxyXG4gICAgdGl0bGU6IFwi7JmAIOyGkO2dpeuvvCDrr7jss6Tri6RcIixcclxuICAgIHdyaXRlcjogXCLtmY3rqoXrs7QgXCIsXHJcbiAgfSxcclxuXTtcclxuXHJcbmV4cG9ydCBjb25zdCBkdW1teUJvYXJkRW50aXRpZXMgPSB7XHJcbiAgMToge1xyXG4gICAgaWQ6IDEsXHJcbiAgICB0aXRsZTogXCLsmYAg64yA67CVXCIsXHJcbiAgICBjb250ZW50OiBcIuyWtOuWu+qyjCDsoIDqsbgg7KCA66CH6rKMIOywqOuDkFwiLFxyXG4gICAgcGFzc3dvcmQ6IFwiMTIzNFwiLFxyXG4gICAgd3JpdGVyOiBcIuyGkO2dpeuvvFwiLFxyXG4gICAgY3JlYXRlZEF0OiBcIjIwMjEuMTAuMDcgMTQ6NDY6MzdcIixcclxuICAgIHVwZGF0ZWRBdDogXCIyMDIxLjEwLjA3IDE0OjQ2OjM3XCIsXHJcbiAgfSxcclxuICAyOiB7XHJcbiAgICBpZDogMixcclxuICAgIHRpdGxlOiBcIuyZgCDrr7jss6Tri6RcIixcclxuICAgIGNvbnRlbnQ6IFwi7Ja065a76rKMIOyggOqxuCDsoIDroIfqsowg7LCo64OQXCIsXHJcbiAgICBwYXNzd29yZDogXCIxMjM0XCIsXHJcbiAgICB3cml0ZXI6IFwi7JWI7KCV7ZmYXCIsXHJcbiAgICBjcmVhdGVkQXQ6IFwiMjAyMS4xMC4wNyAxNDo0NjozN1wiLFxyXG4gICAgdXBkYXRlZEF0OiBcIjIwMjEuMTAuMDcgMTQ6NDY6MzdcIixcclxuICB9LFxyXG4gIDM6IHtcclxuICAgIGlkOiAzLFxyXG4gICAgdGl0bGU6IFwi7JmAIOyWtOuWu+qyjCDsnbTrn7Qg7IiY6rCAXCIsXHJcbiAgICBjb250ZW50OiBcIuyWtOuWu+qyjCDsoIDqsbgg7KCA66CH6rKMIOywqOuDkFwiLFxyXG4gICAgcGFzc3dvcmQ6IFwiMTIzNFwiLFxyXG4gICAgd3JpdGVyOiBcIuydtOydhOyaqVwiLFxyXG4gICAgY3JlYXRlZEF0OiBcIjIwMjEuMTAuMDcgMTQ6NDY6MzdcIixcclxuICAgIHVwZGF0ZWRBdDogXCIyMDIxLjEwLjA3IDE0OjQ2OjM3XCIsXHJcbiAgfSxcclxuICA0OiB7XHJcbiAgICBpZDogNCxcclxuICAgIHRpdGxlOiBcIuyZgCDqt7jrpqzspojrp4wg66+47LOk64ukXCIsXHJcbiAgICBjb250ZW50OiBcIuyWtOuWu+qyjCDsoIDqsbgg7KCA66CH6rKMIOywqOuDkFwiLFxyXG4gICAgcGFzc3dvcmQ6IFwiMTIzNFwiLFxyXG4gICAgd3JpdGVyOiBcIuq4sOyEseujoVwiLFxyXG4gICAgY3JlYXRlZEF0OiBcIjIwMjEuMTAuMDcgMTQ6NDY6MzdcIixcclxuICAgIHVwZGF0ZWRBdDogXCIyMDIxLjEwLjA3IDE0OjQ2OjM3XCIsXHJcbiAgfSxcclxuICA1OiB7XHJcbiAgICBpZDogNSxcclxuICAgIHRpdGxlOiBcIuyZgCDshpDtnaXrr7wg66+47LOk64ukXCIsXHJcbiAgICBjb250ZW50OiBcIuyWtOuWu+qyjCDsoIDqsbgg7KCA66CH6rKMIOywqOuDkFwiLFxyXG4gICAgcGFzc3dvcmQ6IFwiMTIzNFwiLFxyXG4gICAgd3JpdGVyOiBcIuuwleyngOyEsVwiLFxyXG4gICAgY3JlYXRlZEF0OiBcIjIwMjEuMTAuMDcgMTQ6NDY6MzdcIixcclxuICAgIHVwZGF0ZWRBdDogXCIyMDIxLjEwLjA3IDE0OjQ2OjM3XCIsXHJcbiAgfSxcclxufTtcclxuIiwiZXhwb3J0IGNvbnN0IGR1bW15UmVwbHlMaXN0ID0gW1xyXG4gIHtcclxuICAgIGlkOiAxLFxyXG4gICAgYm9hcmRJZDogMSxcclxuICAgIGNvbnRlbnQ6IFwi44S544WH44WL44WLXCIsXHJcbiAgICB3cml0ZXI6IFwi7J207KSA7Z2sXCIsXHJcbiAgICB1cGRhdGVUaW1lOiBcIjIwMjEuMTAuMDcgMTY6NTE6MDBcIixcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAyLFxyXG4gICAgYm9hcmRJZDogMSxcclxuICAgIGNvbnRlbnQ6IFwi44S544WH44WL44WLXCIsXHJcbiAgICB3cml0ZXI6IFwi7Zmp64+Z7JqxXCIsXHJcbiAgICB1cGRhdGVUaW1lOiBcIjIwMjEuMTAuMDcgMTY6NTE6MDBcIixcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAzLFxyXG4gICAgYm9hcmRJZDogMSxcclxuICAgIGNvbnRlbnQ6IFwi44S544WH44WL44WLXCIsXHJcbiAgICB3cml0ZXI6IFwi7LWc6rWt7LKgXCIsXHJcbiAgICB1cGRhdGVUaW1lOiBcIjIwMjEuMTAuMDcgMTY6NTE6MDBcIixcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiA0LFxyXG4gICAgYm9hcmRJZDogMSxcclxuICAgIGNvbnRlbnQ6IFwi44S544WH44WL44WLXCIsXHJcbiAgICB3cml0ZXI6IFwi6riw7Zi47JiBXCIsXHJcbiAgICB1cGRhdGVUaW1lOiBcIjIwMjEuMTAuMDcgMTY6NTE6MDBcIixcclxuICB9LFxyXG5dO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFJlcGx5TGlzdCA9IChJZCkgPT4ge1xyXG4gIGNvbnN0IHJlc3VsdCA9IGR1bW15UmVwbHlMaXN0LmZpbHRlcihcclxuICAgIChyZXBseSkgPT4gcmVwbHkuYm9hcmRJZCA9PT0gcGFyc2VJbnQoSWQsIDEwKVxyXG4gICk7XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuIiwiaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgc3R5bGVkIGZyb20gXCJzdHlsZWQtY29tcG9uZW50c1wiO1xyXG5cclxuY29uc3QgQ29udGFpbmVyID0gc3R5bGVkLmRpdmBcclxuICB3aWR0aDogMTAwJTtcclxuICBoZWlnaHQ6IDYwcHg7XHJcblxyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcclxuICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcclxuXHJcbiAgcGFkZGluZzogMTBweCA1cHggMTBweCA1cHg7XHJcbiAgbWFyZ2luLWJvdHRvbTogMjBweDtcclxuXHJcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNjY2M7XHJcbmA7XHJcblxyXG5jb25zdCBUaXRsZSA9IHN0eWxlZC5kaXZgXHJcbiAgY29sb3I6ICMwODA4MDg7XHJcbiAgZm9udC1zaXplOiAyMHB4O1xyXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG5gO1xyXG5jb25zdCBXcml0ZXIgPSBzdHlsZWQuc3BhbmBcclxuICBjb2xvcjogIzA4MDgwODtcclxuICBmb250LXNpemU6IDEycHg7XHJcbiAgZm9udC13ZWlnaHQ6IGxpZ2h0ZXI7XHJcbmA7XHJcblxyXG5jb25zdCBEZXRhaWxIZWFkZXIgPSAoeyB0aXRsZSwgd3JpdGVyLCB1cGRhdGVkQXQgfSkgPT4ge1xyXG4gIHJldHVybiAoXHJcbiAgICA8Q29udGFpbmVyPlxyXG4gICAgICA8VGl0bGU+e3RpdGxlfTwvVGl0bGU+XHJcbiAgICAgIDxXcml0ZXI+e2Ake3dyaXRlcn0gfCAgJHt1cGRhdGVkQXR9YH08L1dyaXRlcj5cclxuICAgIDwvQ29udGFpbmVyPlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEZXRhaWxIZWFkZXI7XHJcbiIsImltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gXCJuZXh0L2Rpc3QvY2xpZW50L3JvdXRlclwiO1xyXG5pbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgc3R5bGVkIGZyb20gXCJzdHlsZWQtY29tcG9uZW50c1wiO1xyXG5cclxuaW1wb3J0IHsgZHVtbXlCb2FyZEVudGl0aWVzIH0gZnJvbSBcIi4uLy4uLy4uL2NvbW1vbi9kYXRhL2R1bW15Qm9hcmREYXRhXCI7XHJcbmltcG9ydCBEZXRhaWxIZWFkZXIgZnJvbSBcIi4uL2NvbXBvbmVudC9EZXRhaWxIZWFkZXJcIjtcclxuaW1wb3J0IFJlcGx5IGZyb20gXCIuLi8uLi9yZXBseS90ZW1wbGF0ZS9SZXBseVwiO1xyXG5cclxuY29uc3QgQ29udGFpbmVyID0gc3R5bGVkLmRpdmBcclxuICB3aWR0aDogODAlO1xyXG4gIGhlaWdodDogMTAwJTtcclxuXHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG5cclxuICBtYXJnaW4tcmlnaHQ6IGF1dG87XHJcbiAgbWFyZ2luLWxlZnQ6IGF1dG87XHJcbmA7XHJcbmNvbnN0IENvbnRlbnQgPSBzdHlsZWQuZGl2YFxyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIG1pbi1oZWlnaHQ6IDMwMHB4O1xyXG5cclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xyXG4gIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xyXG5cclxuICBtYXJnaW4tYm90dG9tOiAyMHB4O1xyXG5cclxuICBjb2xvcjogIzAwMDtcclxuYDtcclxuXHJcbmNvbnN0IEJvYXJkRGV0YWlsUGFnZSA9ICgpID0+IHtcclxuICBjb25zdCByb3V0ZXIgPSB1c2VSb3V0ZXIoKTtcclxuICBjb25zdCB7IGJvYXJkSWQgfSA9IHJvdXRlci5xdWVyeTtcclxuXHJcbiAgY29uc3QgW2JvYXJkLCBzZXRCb2FyZF0gPSB1c2VTdGF0ZShudWxsKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgc2V0Qm9hcmQoZHVtbXlCb2FyZEVudGl0aWVzW2JvYXJkSWRdKTtcclxuICB9LCBbYm9hcmRJZF0pO1xyXG5cclxuICByZXR1cm4gYm9hcmQgPyAoXHJcbiAgICA8Q29udGFpbmVyPlxyXG4gICAgICA8RGV0YWlsSGVhZGVyXHJcbiAgICAgICAgdGl0bGU9e2JvYXJkLnRpdGxlfVxyXG4gICAgICAgIHdyaXRlcj17Ym9hcmQud3JpdGVyfVxyXG4gICAgICAgIHVwZGF0ZWRBdD17Ym9hcmQudXBkYXRlZEF0fVxyXG4gICAgICAvPlxyXG4gICAgICA8Q29udGVudD57Ym9hcmQuY29udGVudH08L0NvbnRlbnQ+XHJcbiAgICAgIDxSZXBseSAvPlxyXG4gICAgPC9Db250YWluZXI+XHJcbiAgKSA6IG51bGw7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBCb2FyZERldGFpbFBhZ2U7XHJcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSB9IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgc3R5bGVkIGZyb20gXCJzdHlsZWQtY29tcG9uZW50c1wiO1xyXG5cclxuY29uc3QgQ29udGFpbmVyID0gc3R5bGVkLmRpdmBcclxuICB3aWR0aDogMTAwJTtcclxuICBoZWlnaHQ6IDgwcHg7XHJcblxyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuXHJcbiAgcGFkZGluZzogOHB4O1xyXG5gO1xyXG5jb25zdCBVc2VySW5mb1NlY3Rpb24gPSBzdHlsZWQuZGl2YFxyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuXHJcbiAgbWFyZ2luLXJpZ2h0OiAyMHB4O1xyXG5gO1xyXG5cclxuY29uc3QgVXNlckluZm9JbnB1dCA9IHN0eWxlZC5pbnB1dGBcclxuICB3aWR0aDogODBweDtcclxuXHJcbiAgbWFyZ2luLWJvdHRvbTogOHB4O1xyXG5gO1xyXG5cclxuY29uc3QgQ29udGVudElucHV0ID0gc3R5bGVkLnRleHRhcmVhYFxyXG4gIGhlaWdodDogODAlO1xyXG5cclxuICBmbGV4OiAxO1xyXG4gIG1hcmdpbi1yaWdodDogOHB4O1xyXG5gO1xyXG5cclxuY29uc3QgUmVwbHlJbnB1dCA9ICh7IGFkZFJlcGx5IH0pID0+IHtcclxuICBjb25zdCBbd3JpdGVyLCBzZXRXcml0ZXJdID0gdXNlU3RhdGUoXCJcIik7XHJcbiAgY29uc3QgW3Bhc3N3b3JkLCBzZXRQYXNzd29yZF0gPSB1c2VTdGF0ZShcIlwiKTtcclxuICBjb25zdCBbY29udGVudCwgc2V0Q29udGVudF0gPSB1c2VTdGF0ZShcIlwiKTtcclxuXHJcbiAgY29uc3Qgb25DbGljayA9ICgpID0+IHtcclxuICAgIGFkZFJlcGx5KHdyaXRlciwgY29udGVudCwgcGFzc3dvcmQsIG5ldyBEYXRlKCkudG9Mb2NhbGVEYXRlU3RyaW5nKCkpO1xyXG4gICAgc2V0V3JpdGVyKFwiXCIpO1xyXG4gICAgc2V0UGFzc3dvcmQoXCJcIik7XHJcbiAgICBzZXRDb250ZW50KFwiXCIpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8Q29udGFpbmVyPlxyXG4gICAgICA8VXNlckluZm9TZWN0aW9uPlxyXG4gICAgICAgIDxVc2VySW5mb0lucHV0XHJcbiAgICAgICAgICBwbGFjZWhvbGRlcj1cIuyekeyEseyekFwiXHJcbiAgICAgICAgICB2YWx1ZT17d3JpdGVyfVxyXG4gICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRXcml0ZXIoZS50YXJnZXQudmFsdWUpfVxyXG4gICAgICAgIC8+XHJcbiAgICAgICAgPFVzZXJJbmZvSW5wdXRcclxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwi67mE67CA67KI7Zi4XCJcclxuICAgICAgICAgIHZhbHVlPXtwYXNzd29yZH1cclxuICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0UGFzc3dvcmQoZS50YXJnZXQudmFsdWUpfVxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvVXNlckluZm9TZWN0aW9uPlxyXG4gICAgICA8Q29udGVudElucHV0XHJcbiAgICAgICAgdmFsdWU9e2NvbnRlbnR9XHJcbiAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB7XHJcbiAgICAgICAgICBzZXRDb250ZW50KGUudGFyZ2V0LnZhbHVlKTtcclxuICAgICAgICB9fVxyXG4gICAgICAvPlxyXG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXtvbkNsaWNrfT5cclxuICAgICAgICDsnpHshLFcclxuICAgICAgPC9idXR0b24+XHJcbiAgICA8L0NvbnRhaW5lcj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmVwbHlJbnB1dDtcclxuIiwiaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgc3R5bGVkIGZyb20gXCJzdHlsZWQtY29tcG9uZW50c1wiO1xyXG5cclxuY29uc3QgQ29udGFpbmVyID0gc3R5bGVkLmRpdmBcclxuICB3aWR0aDogMTAwJTtcclxuXHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcclxuICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcclxuXHJcbiAgcGFkZGluZzogNXB4O1xyXG5cclxuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2NkY2RjZDtcclxuYDtcclxuXHJcbmNvbnN0IFdyaXRlciA9IHN0eWxlZC5kaXZgXHJcbiAgZmxleDogMCAwIDEwMHB4O1xyXG5gO1xyXG5jb25zdCBDb250ZW50ID0gc3R5bGVkLmRpdmBcclxuICBmbGV4OiAxIDEgMTAwcHg7XHJcbmA7XHJcbmNvbnN0IFRpbWUgPSBzdHlsZWQuZGl2YFxyXG4gIGZsZXg6IDAgMCAxNTBweDtcclxuYDtcclxuXHJcbmNvbnN0IFJlcGx5SXRlbSA9ICh7IHdyaXRlciwgY29udGVudCwgdGltZSB9KSA9PiB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxDb250YWluZXI+XHJcbiAgICAgIDxXcml0ZXI+e3dyaXRlcn08L1dyaXRlcj5cclxuICAgICAgPENvbnRlbnQ+e2NvbnRlbnR9PC9Db250ZW50PlxyXG4gICAgICA8VGltZT57dGltZX08L1RpbWU+XHJcbiAgICA8L0NvbnRhaW5lcj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmVwbHlJdGVtO1xyXG4iLCJpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCBzdHlsZWQgZnJvbSBcInN0eWxlZC1jb21wb25lbnRzXCI7XHJcbmltcG9ydCBSZXBseUl0ZW0gZnJvbSBcIi4vUmVwbHlJdGVtXCI7XHJcblxyXG5jb25zdCBDb250YWluZXIgPSBzdHlsZWQuZGl2YFxyXG4gIHdpZHRoOiAxMDAlO1xyXG5cclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbmA7XHJcblxyXG5jb25zdCBSZXBseUxpc3QgPSAoeyByZXBsaWVzIH0pID0+IHtcclxuICByZXR1cm4gKFxyXG4gICAgPENvbnRhaW5lcj5cclxuICAgICAge3JlcGxpZXMubWFwKChyZXBseSkgPT4gKFxyXG4gICAgICAgIDxSZXBseUl0ZW1cclxuICAgICAgICAgIGtleT17cmVwbHkuaWR9XHJcbiAgICAgICAgICB3cml0ZXI9e3JlcGx5LndyaXRlcn1cclxuICAgICAgICAgIGNvbnRlbnQ9e3JlcGx5LmNvbnRlbnR9XHJcbiAgICAgICAgICB0aW1lPXtyZXBseS51cGRhdGVUaW1lfVxyXG4gICAgICAgIC8+XHJcbiAgICAgICkpfVxyXG4gICAgPC9Db250YWluZXI+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFJlcGx5TGlzdDtcclxuIiwiaW1wb3J0IHsgdXNlUm91dGVyIH0gZnJvbSBcIm5leHQvZGlzdC9jbGllbnQvcm91dGVyXCI7XHJcbmltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCBzdHlsZWQgZnJvbSBcInN0eWxlZC1jb21wb25lbnRzXCI7XHJcbmltcG9ydCB7IGdldFJlcGx5TGlzdCB9IGZyb20gXCIuLi8uLi8uLi9jb21tb24vZGF0YS9kdW1teVJlcGx5RGF0YVwiO1xyXG5cclxuaW1wb3J0IFJlcGx5SW5wdXQgZnJvbSBcIi4uL2NvbXBvbmVudC9SZXBseUlucHV0XCI7XHJcbmltcG9ydCBSZXBseUxpc3QgZnJvbSBcIi4uL2NvbXBvbmVudC9SZXBseUxpc3RcIjtcclxuXHJcbmNvbnN0IENvbnRhaW5lciA9IHN0eWxlZC5kaXZgXHJcbiAgd2lkdGg6IDEwMCU7XHJcbmA7XHJcblxyXG5jb25zdCBSZXBseSA9ICgpID0+IHtcclxuICBjb25zdCByb3V0ZXIgPSB1c2VSb3V0ZXIoKTtcclxuICBjb25zdCB7IGJvYXJkSWQgfSA9IHJvdXRlci5xdWVyeTtcclxuXHJcbiAgY29uc3QgW3JlcGxpZXMsIHNldFJlcGxpZXNdID0gdXNlU3RhdGUoW10pO1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBzZXRSZXBsaWVzKGdldFJlcGx5TGlzdChib2FyZElkKSk7XHJcbiAgfSwgW2JvYXJkSWRdKTtcclxuXHJcbiAgY29uc3QgYWRkUmVwbHkgPSAod3JpdGVyLCBjb250ZW50LCBwYXNzd29yZCwgdGltZSkgPT4ge1xyXG4gICAgc2V0UmVwbGllcyhbeyB3cml0ZXIsIGNvbnRlbnQsIHBhc3N3b3JkLCB1cGRhdGVUaW1lOiB0aW1lIH0sIC4uLnJlcGxpZXNdKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPENvbnRhaW5lcj5cclxuICAgICAgPFJlcGx5SW5wdXQgYWRkUmVwbHk9e2FkZFJlcGx5fSAvPlxyXG4gICAgICA8UmVwbHlMaXN0IHJlcGxpZXM9e3JlcGxpZXN9IC8+XHJcbiAgICA8L0NvbnRhaW5lcj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmVwbHk7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5leHQvZGlzdC9zZXJ2ZXIvZGVub3JtYWxpemUtcGFnZS1wYXRoLmpzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5leHQvZGlzdC9zaGFyZWQvbGliL2kxOG4vbm9ybWFsaXplLWxvY2FsZS1wYXRoLmpzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5leHQvZGlzdC9zaGFyZWQvbGliL21pdHQuanNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibmV4dC9kaXN0L3NoYXJlZC9saWIvcm91dGVyLWNvbnRleHQuanNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibmV4dC9kaXN0L3NoYXJlZC9saWIvcm91dGVyL3V0aWxzL2dldC1hc3NldC1wYXRoLWZyb20tcm91dGUuanNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibmV4dC9kaXN0L3NoYXJlZC9saWIvcm91dGVyL3V0aWxzL2lzLWR5bmFtaWMuanNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibmV4dC9kaXN0L3NoYXJlZC9saWIvcm91dGVyL3V0aWxzL3BhcnNlLXJlbGF0aXZlLXVybC5qc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJuZXh0L2Rpc3Qvc2hhcmVkL2xpYi9yb3V0ZXIvdXRpbHMvcXVlcnlzdHJpbmcuanNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibmV4dC9kaXN0L3NoYXJlZC9saWIvcm91dGVyL3V0aWxzL3JvdXRlLW1hdGNoZXIuanNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibmV4dC9kaXN0L3NoYXJlZC9saWIvcm91dGVyL3V0aWxzL3JvdXRlLXJlZ2V4LmpzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5leHQvZGlzdC9zaGFyZWQvbGliL3V0aWxzLmpzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlYWN0XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlYWN0LWlzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlYWN0L2pzeC1kZXYtcnVudGltZVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzdHlsZWQtY29tcG9uZW50c1wiKTsiLCIvKiAoaWdub3JlZCkgKi8iXSwibmFtZXMiOlsiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJleHBvcnRzIiwidmFsdWUiLCJyZW1vdmVQYXRoVHJhaWxpbmdTbGFzaCIsIm5vcm1hbGl6ZVBhdGhUcmFpbGluZ1NsYXNoIiwicGF0aCIsImVuZHNXaXRoIiwic2xpY2UiLCJwcm9jZXNzIiwiZW52IiwiX19ORVhUX1RSQUlMSU5HX1NMQVNIIiwidGVzdCIsInJlcXVlc3RJZGxlQ2FsbGJhY2siLCJjYW5jZWxJZGxlQ2FsbGJhY2siLCJzZWxmIiwiYmluZCIsIndpbmRvdyIsImNiIiwic3RhcnQiLCJEYXRlIiwibm93Iiwic2V0VGltZW91dCIsImRpZFRpbWVvdXQiLCJ0aW1lUmVtYWluaW5nIiwiTWF0aCIsIm1heCIsImlkIiwiY2xlYXJUaW1lb3V0IiwibWFya0Fzc2V0RXJyb3IiLCJpc0Fzc2V0RXJyb3IiLCJnZXRDbGllbnRCdWlsZE1hbmlmZXN0IiwiY3JlYXRlUm91dGVMb2FkZXIiLCJfZ2V0QXNzZXRQYXRoRnJvbVJvdXRlIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsInJlcXVpcmUiLCJfcmVxdWVzdElkbGVDYWxsYmFjayIsIm9iaiIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiTVNfTUFYX0lETEVfREVMQVkiLCJ3aXRoRnV0dXJlIiwia2V5IiwibWFwIiwiZ2VuZXJhdG9yIiwiZW50cnkiLCJnZXQiLCJmdXR1cmUiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlc29sdmVyIiwicHJvbSIsInNldCIsInRoZW4iLCJoYXNQcmVmZXRjaCIsImxpbmsiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJNU0lucHV0TWV0aG9kQ29udGV4dCIsImRvY3VtZW50TW9kZSIsInJlbExpc3QiLCJzdXBwb3J0cyIsImUiLCJjYW5QcmVmZXRjaCIsInByZWZldGNoVmlhRG9tIiwiaHJlZiIsImFzIiwicmVzIiwicmVqIiwicXVlcnlTZWxlY3RvciIsInJlbCIsImNyb3NzT3JpZ2luIiwiX19ORVhUX0NST1NTX09SSUdJTiIsIm9ubG9hZCIsIm9uZXJyb3IiLCJoZWFkIiwiYXBwZW5kQ2hpbGQiLCJBU1NFVF9MT0FEX0VSUk9SIiwiU3ltYm9sIiwiZXJyIiwiYXBwZW5kU2NyaXB0Iiwic3JjIiwic2NyaXB0IiwicmVqZWN0IiwiRXJyb3IiLCJib2R5IiwiZGV2QnVpbGRQcm9taXNlIiwicmVzb2x2ZVByb21pc2VXaXRoVGltZW91dCIsInAiLCJtcyIsImNhbmNlbGxlZCIsInIiLCJjYXRjaCIsIl9fQlVJTERfTUFOSUZFU1QiLCJvbkJ1aWxkTWFuaWZlc3QiLCJfX0JVSUxEX01BTklGRVNUX0NCIiwiZ2V0RmlsZXNGb3JSb3V0ZSIsImFzc2V0UHJlZml4Iiwicm91dGUiLCJzY3JpcHRzIiwiZW5jb2RlVVJJIiwiY3NzIiwibWFuaWZlc3QiLCJhbGxGaWxlcyIsImZpbHRlciIsInYiLCJlbnRyeXBvaW50cyIsIk1hcCIsImxvYWRlZFNjcmlwdHMiLCJzdHlsZVNoZWV0cyIsInJvdXRlcyIsIm1heWJlRXhlY3V0ZVNjcmlwdCIsImZldGNoU3R5bGVTaGVldCIsImZldGNoIiwib2siLCJ0ZXh0IiwiY29udGVudCIsIndoZW5FbnRyeXBvaW50Iiwib25FbnRyeXBvaW50IiwiZXhlY3V0ZSIsImZuIiwiY29tcG9uZW50IiwiZXJyb3IiLCJpbnB1dCIsIm9sZCIsImxvYWRSb3V0ZSIsInByZWZldGNoIiwicm91dGVGaWxlc1Byb21pc2UiLCJhbGwiLCJoYXMiLCJlbnRyeXBvaW50Iiwic3R5bGVzIiwiZmluYWxseSIsImFzc2lnbiIsImNuIiwibmF2aWdhdG9yIiwiY29ubmVjdGlvbiIsInNhdmVEYXRhIiwiZWZmZWN0aXZlVHlwZSIsIm91dHB1dCIsImVudW1lcmFibGUiLCJfcm91dGVyIiwiX3dpdGhSb3V0ZXIiLCJ1c2VSb3V0ZXIiLCJjcmVhdGVSb3V0ZXIiLCJtYWtlUHVibGljUm91dGVySW5zdGFuY2UiLCJfcmVhY3QiLCJfcm91dGVyQ29udGV4dCIsInNpbmdsZXRvblJvdXRlciIsInJvdXRlciIsInJlYWR5Q2FsbGJhY2tzIiwicmVhZHkiLCJwdXNoIiwidXJsUHJvcGVydHlGaWVsZHMiLCJyb3V0ZXJFdmVudHMiLCJjb3JlTWV0aG9kRmllbGRzIiwiZXZlbnRzIiwiZm9yRWFjaCIsImZpZWxkIiwiZ2V0Um91dGVyIiwiYXJncyIsImV2ZW50Iiwib24iLCJldmVudEZpZWxkIiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzdWJzdHJpbmciLCJfc2luZ2xldG9uUm91dGVyIiwiY29uc29sZSIsIm1lc3NhZ2UiLCJzdGFjayIsIl9kZWZhdWx0IiwidXNlQ29udGV4dCIsIlJvdXRlckNvbnRleHQiLCJfcm91dGVyMSIsImluc3RhbmNlIiwicHJvcGVydHkiLCJBcnJheSIsImlzQXJyYXkiLCJ3aXRoUm91dGVyIiwiQ29tcG9zZWRDb21wb25lbnQiLCJXaXRoUm91dGVyV3JhcHBlciIsInByb3BzIiwiZ2V0SW5pdGlhbFByb3BzIiwib3JpZ0dldEluaXRpYWxQcm9wcyIsIm5hbWUiLCJkaXNwbGF5TmFtZSIsImdldERvbWFpbkxvY2FsZSIsImFkZExvY2FsZSIsImRlbExvY2FsZSIsImhhc0Jhc2VQYXRoIiwiYWRkQmFzZVBhdGgiLCJkZWxCYXNlUGF0aCIsImlzTG9jYWxVUkwiLCJpbnRlcnBvbGF0ZUFzIiwicmVzb2x2ZUhyZWYiLCJfbm9ybWFsaXplVHJhaWxpbmdTbGFzaCIsIl9yb3V0ZUxvYWRlciIsIl9kZW5vcm1hbGl6ZVBhZ2VQYXRoIiwiX25vcm1hbGl6ZUxvY2FsZVBhdGgiLCJfbWl0dCIsIl91dGlscyIsIl9pc0R5bmFtaWMiLCJfcGFyc2VSZWxhdGl2ZVVybCIsIl9xdWVyeXN0cmluZyIsIl9yZXNvbHZlUmV3cml0ZXMiLCJfcm91dGVNYXRjaGVyIiwiX3JvdXRlUmVnZXgiLCJkZXRlY3REb21haW5Mb2NhbGUiLCJfX05FWFRfSTE4Tl9TVVBQT1JUIiwiYmFzZVBhdGgiLCJfX05FWFRfUk9VVEVSX0JBU0VQQVRIIiwiYnVpbGRDYW5jZWxsYXRpb25FcnJvciIsImFkZFBhdGhQcmVmaXgiLCJwcmVmaXgiLCJzdGFydHNXaXRoIiwicGF0aE5vUXVlcnlIYXNoIiwibG9jYWxlIiwibG9jYWxlcyIsImRvbWFpbkxvY2FsZXMiLCJub3JtYWxpemVMb2NhbGVQYXRoIiwiZGV0ZWN0ZWRMb2NhbGUiLCJkZXRlY3RlZERvbWFpbiIsInVuZGVmaW5lZCIsImh0dHAiLCJkb21haW4iLCJkZWZhdWx0TG9jYWxlIiwicGF0aG5hbWUiLCJwYXRoTG93ZXIiLCJ0b0xvd2VyQ2FzZSIsImxvY2FsZUxvd2VyIiwibGVuZ3RoIiwic3Vic3RyIiwicXVlcnlJbmRleCIsImluZGV4T2YiLCJoYXNoSW5kZXgiLCJ1cmwiLCJsb2NhdGlvbk9yaWdpbiIsImdldExvY2F0aW9uT3JpZ2luIiwicmVzb2x2ZWQiLCJVUkwiLCJvcmlnaW4iLCJfIiwiYXNQYXRobmFtZSIsInF1ZXJ5IiwiaW50ZXJwb2xhdGVkUm91dGUiLCJkeW5hbWljUmVnZXgiLCJnZXRSb3V0ZVJlZ2V4IiwiZHluYW1pY0dyb3VwcyIsImdyb3VwcyIsImR5bmFtaWNNYXRjaGVzIiwiZ2V0Um91dGVNYXRjaGVyIiwicGFyYW1zIiwia2V5cyIsImV2ZXJ5IiwicGFyYW0iLCJyZXBlYXQiLCJvcHRpb25hbCIsInJlcGxhY2VkIiwicmVwbGFjZSIsInNlZ21lbnQiLCJlbmNvZGVVUklDb21wb25lbnQiLCJqb2luIiwicmVzdWx0Iiwib21pdFBhcm1zRnJvbVF1ZXJ5IiwiZmlsdGVyZWRRdWVyeSIsImluY2x1ZGVzIiwicmVzb2x2ZUFzIiwiYmFzZSIsInVybEFzU3RyaW5nIiwiZm9ybWF0V2l0aFZhbGlkYXRpb24iLCJ1cmxQcm90b01hdGNoIiwibWF0Y2giLCJ1cmxBc1N0cmluZ05vUHJvdG8iLCJ1cmxQYXJ0cyIsInNwbGl0Iiwibm9ybWFsaXplZFVybCIsIm5vcm1hbGl6ZVJlcGVhdGVkU2xhc2hlcyIsImFzUGF0aCIsImZpbmFsVXJsIiwiaW50ZXJwb2xhdGVkQXMiLCJpc0R5bmFtaWNSb3V0ZSIsInNlYXJjaFBhcmFtcyIsInNlYXJjaFBhcmFtc1RvVXJsUXVlcnkiLCJoYXNoIiwicmVzb2x2ZWRIcmVmIiwic3RyaXBPcmlnaW4iLCJwcmVwYXJlVXJsQXMiLCJyZXNvbHZlZEFzIiwiaHJlZkhhZE9yaWdpbiIsImFzSGFkT3JpZ2luIiwicHJlcGFyZWRVcmwiLCJwcmVwYXJlZEFzIiwicmVzb2x2ZUR5bmFtaWNSb3V0ZSIsInBhZ2VzIiwiY2xlYW5QYXRobmFtZSIsImRlbm9ybWFsaXplUGFnZVBhdGgiLCJzb21lIiwicGFnZSIsInJlIiwibWFudWFsU2Nyb2xsUmVzdG9yYXRpb24iLCJfX05FWFRfU0NST0xMX1JFU1RPUkFUSU9OIiwiaGlzdG9yeSIsInNlc3Npb25TdG9yYWdlIiwic2V0SXRlbSIsInJlbW92ZUl0ZW0iLCJuIiwiU1NHX0RBVEFfTk9UX0ZPVU5EIiwiZmV0Y2hSZXRyeSIsImF0dGVtcHRzIiwiY3JlZGVudGlhbHMiLCJzdGF0dXMiLCJqc29uIiwiZGF0YSIsIm5vdEZvdW5kIiwiZmV0Y2hOZXh0RGF0YSIsImRhdGFIcmVmIiwiaXNTZXJ2ZXJSZW5kZXIiLCJSb3V0ZXIiLCJjb25zdHJ1Y3RvciIsInBhdGhuYW1lMSIsInF1ZXJ5MSIsImFzMSIsImluaXRpYWxQcm9wcyIsInBhZ2VMb2FkZXIiLCJBcHAiLCJ3cmFwQXBwIiwiQ29tcG9uZW50IiwiQ29tcG9uZW50MSIsImVycjEiLCJzdWJzY3JpcHRpb24iLCJpc0ZhbGxiYWNrIiwiaXNQcmV2aWV3Iiwic2RjIiwic2RyIiwiX2lkeCIsIm9uUG9wU3RhdGUiLCJzdGF0ZSIsImNoYW5nZVN0YXRlIiwiZ2V0VVJMIiwiX19OIiwiZm9yY2VkU2Nyb2xsIiwib3B0aW9ucyIsImlkeCIsIkpTT04iLCJzdHJpbmdpZnkiLCJ4IiwicGFnZVhPZmZzZXQiLCJ5IiwicGFnZVlPZmZzZXQiLCJnZXRJdGVtIiwicGFyc2UiLCJwYXJzZVJlbGF0aXZlVXJsIiwiaXNTc3IiLCJfYnBzIiwiY2hhbmdlIiwic2hhbGxvdyIsIl9zaGFsbG93IiwiY29tcG9uZW50cyIsImluaXRpYWwiLCJfX05fU1NHIiwiX19OX1NTUCIsImF1dG9FeHBvcnREeW5hbWljIiwiX19ORVhUX0RBVEFfXyIsImF1dG9FeHBvcnQiLCJzdWIiLCJjbGMiLCJfd3JhcEFwcCIsImlzUmVhZHkiLCJnc3NwIiwiZ2lwIiwiYXBwR2lwIiwiZ3NwIiwibG9jYXRpb24iLCJzZWFyY2giLCJfX05FWFRfSEFTX1JFV1JJVEVTIiwiaXNMb2NhbGVEb21haW4iLCJob3N0bmFtZSIsIl9zaG91bGRSZXNvbHZlSHJlZiIsImFkZEV2ZW50TGlzdGVuZXIiLCJzY3JvbGxSZXN0b3JhdGlvbiIsInJlbG9hZCIsImJhY2siLCJtZXRob2QiLCJzaG91bGRSZXNvbHZlSHJlZiIsIl9oIiwicHJldkxvY2FsZSIsInBhcnNlZEFzIiwibG9jYWxlUGF0aFJlc3VsdCIsImRpZE5hdmlnYXRlIiwicmVmIiwiYXNOb0Jhc2VQYXRoIiwiU1QiLCJwZXJmb3JtYW5jZSIsIm1hcmsiLCJyb3V0ZVByb3BzIiwiX2luRmxpZ2h0Um91dGUiLCJhYm9ydENvbXBvbmVudExvYWQiLCJjbGVhbmVkQXMiLCJsb2NhbGVDaGFuZ2UiLCJvbmx5QUhhc2hDaGFuZ2UiLCJlbWl0Iiwic2Nyb2xsVG9IYXNoIiwibm90aWZ5IiwicGFyc2VkIiwicmV3cml0ZXMiLCJnZXRQYWdlTGlzdCIsIl9fcmV3cml0ZXMiLCJ1cmxJc05ldyIsInJld3JpdGVzUmVzdWx0IiwibWF0Y2hlZFBhZ2UiLCJyb3V0ZVJlZ2V4Iiwicm91dGVNYXRjaCIsInNob3VsZEludGVycG9sYXRlIiwibWlzc2luZ1BhcmFtcyIsIndhcm4iLCJyZWYxIiwicm91dGVJbmZvIiwiZ2V0Um91dGVJbmZvIiwicGFnZVByb3BzIiwiX19OX1JFRElSRUNUIiwiZGVzdGluYXRpb24iLCJwYXJzZWRIcmVmIiwibmV3VXJsIiwibmV3QXMiLCJfX05fUFJFVklFVyIsIm5vdEZvdW5kUm91dGUiLCJmZXRjaENvbXBvbmVudCIsImFwcENvbXAiLCJuZXh0IiwiaXNQcmVyZW5kZXJlZCIsInN0YXR1c0NvZGUiLCJpc1ZhbGlkU2hhbGxvd1JvdXRlIiwiX3Njcm9sbCIsInNob3VsZFNjcm9sbCIsInNjcm9sbCIsInJlc2V0U2Nyb2xsIiwiZG9jdW1lbnRFbGVtZW50IiwibGFuZyIsImhhbmRsZVJvdXRlSW5mb0Vycm9yIiwibG9hZEVycm9yRmFpbCIsImdpcEVyciIsInJvdXRlSW5mb0VyciIsImV4aXN0aW5nUm91dGVJbmZvIiwiY2FjaGVkUm91dGVJbmZvIiwibW9kIiwiaXNWYWxpZEVsZW1lbnRUeXBlIiwiZ2V0RGF0YUhyZWYiLCJfZ2V0RGF0YSIsIl9nZXRTdGF0aWNEYXRhIiwiX2dldFNlcnZlckRhdGEiLCJlcnIyIiwiYmVmb3JlUG9wU3RhdGUiLCJvbGRVcmxOb0hhc2giLCJvbGRIYXNoIiwibmV3VXJsTm9IYXNoIiwibmV3SGFzaCIsInNjcm9sbFRvIiwiaWRFbCIsImdldEVsZW1lbnRCeUlkIiwic2Nyb2xsSW50b1ZpZXciLCJuYW1lRWwiLCJnZXRFbGVtZW50c0J5TmFtZSIsInBhdGhuYW1lMiIsIl9pc1NzZyIsImlzU3NnIiwicHJpb3JpdHkiLCJjYW5jZWwiLCJjb21wb25lbnRSZXN1bHQiLCJsb2FkUGFnZSIsImNhY2hlS2V5IiwicmVzb3VyY2VLZXkiLCJjdHgiLCJBcHAxIiwiQXBwVHJlZSIsImxvYWRHZXRJbml0aWFsUHJvcHMiLCJSZWFjdCIsIkJvYXJkRGV0YWlsUGFnZSIsImluZGV4IiwiZHVtbXlCb2FyZExpc3QiLCJ0aXRsZSIsIndyaXRlciIsImR1bW15Qm9hcmRFbnRpdGllcyIsInBhc3N3b3JkIiwiY3JlYXRlZEF0IiwidXBkYXRlZEF0IiwiZHVtbXlSZXBseUxpc3QiLCJib2FyZElkIiwidXBkYXRlVGltZSIsImdldFJlcGx5TGlzdCIsIklkIiwicmVwbHkiLCJwYXJzZUludCIsInN0eWxlZCIsIkNvbnRhaW5lciIsImRpdiIsIlRpdGxlIiwiV3JpdGVyIiwic3BhbiIsIkRldGFpbEhlYWRlciIsInVzZUVmZmVjdCIsInVzZVN0YXRlIiwiUmVwbHkiLCJDb250ZW50IiwiYm9hcmQiLCJzZXRCb2FyZCIsIlVzZXJJbmZvU2VjdGlvbiIsIlVzZXJJbmZvSW5wdXQiLCJDb250ZW50SW5wdXQiLCJ0ZXh0YXJlYSIsIlJlcGx5SW5wdXQiLCJhZGRSZXBseSIsInNldFdyaXRlciIsInNldFBhc3N3b3JkIiwic2V0Q29udGVudCIsIm9uQ2xpY2siLCJ0b0xvY2FsZURhdGVTdHJpbmciLCJ0YXJnZXQiLCJUaW1lIiwiUmVwbHlJdGVtIiwidGltZSIsIlJlcGx5TGlzdCIsInJlcGxpZXMiLCJzZXRSZXBsaWVzIl0sInNvdXJjZVJvb3QiOiIifQ==