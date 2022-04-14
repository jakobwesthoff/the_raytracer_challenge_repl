try{self["workbox:core:6.4.1"]&&_()}catch(t){}const t=(t,...e)=>{let s=t;return e.length>0&&(s+=` :: ${JSON.stringify(e)}`),s};class e extends Error{constructor(e,s){super(t(e,s)),this.name=e,this.details=s}}try{self["workbox:routing:6.4.1"]&&_()}catch(t){}const s=t=>t&&"object"==typeof t?t:{handle:t};class n{constructor(t,e,n="GET"){this.handler=s(e),this.match=t,this.method=n}setCatchHandler(t){this.catchHandler=s(t)}}class i extends n{constructor(t,e,s){super((({url:e})=>{const s=t.exec(e.href);if(s&&(e.origin===location.origin||0===s.index))return s.slice(1)}),e,s)}}class r{constructor(){this.t=new Map,this.i=new Map}get routes(){return this.t}addFetchListener(){self.addEventListener("fetch",(t=>{const{request:e}=t,s=this.handleRequest({request:e,event:t});s&&t.respondWith(s)}))}addCacheListener(){self.addEventListener("message",(t=>{if(t.data&&"CACHE_URLS"===t.data.type){const{payload:e}=t.data,s=Promise.all(e.urlsToCache.map((e=>{"string"==typeof e&&(e=[e]);const s=new Request(...e);return this.handleRequest({request:s,event:t})})));t.waitUntil(s),t.ports&&t.ports[0]&&s.then((()=>t.ports[0].postMessage(!0)))}}))}handleRequest({request:t,event:e}){const s=new URL(t.url,location.href);if(!s.protocol.startsWith("http"))return;const n=s.origin===location.origin,{params:i,route:r}=this.findMatchingRoute({event:e,request:t,sameOrigin:n,url:s});let c=r&&r.handler;const a=t.method;if(!c&&this.i.has(a)&&(c=this.i.get(a)),!c)return;let o;try{o=c.handle({url:s,request:t,event:e,params:i})}catch(t){o=Promise.reject(t)}const h=r&&r.catchHandler;return o instanceof Promise&&(this.o||h)&&(o=o.catch((async n=>{if(h)try{return await h.handle({url:s,request:t,event:e,params:i})}catch(t){t instanceof Error&&(n=t)}if(this.o)return this.o.handle({url:s,request:t,event:e});throw n}))),o}findMatchingRoute({url:t,sameOrigin:e,request:s,event:n}){const i=this.t.get(s.method)||[];for(const r of i){let i;const c=r.match({url:t,sameOrigin:e,request:s,event:n});if(c)return i=c,(Array.isArray(i)&&0===i.length||c.constructor===Object&&0===Object.keys(c).length||"boolean"==typeof c)&&(i=void 0),{route:r,params:i}}return{}}setDefaultHandler(t,e="GET"){this.i.set(e,s(t))}setCatchHandler(t){this.o=s(t)}registerRoute(t){this.t.has(t.method)||this.t.set(t.method,[]),this.t.get(t.method).push(t)}unregisterRoute(t){if(!this.t.has(t.method))throw new e("unregister-route-but-not-found-with-method",{method:t.method});const s=this.t.get(t.method).indexOf(t);if(!(s>-1))throw new e("unregister-route-route-not-registered");this.t.get(t.method).splice(s,1)}}let c;const a={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},o=t=>[a.prefix,t,a.suffix].filter((t=>t&&t.length>0)).join("-"),h=t=>t||o(a.precache),u=t=>t||o(a.runtime);function l(t,e){const s=e();return t.waitUntil(s),s}try{self["workbox:precaching:6.4.1"]&&_()}catch(t){}function f(t){if(!t)throw new e("add-to-cache-list-unexpected-type",{entry:t});if("string"==typeof t){const e=new URL(t,location.href);return{cacheKey:e.href,url:e.href}}const{revision:s,url:n}=t;if(!n)throw new e("add-to-cache-list-unexpected-type",{entry:t});if(!s){const t=new URL(n,location.href);return{cacheKey:t.href,url:t.href}}const i=new URL(n,location.href),r=new URL(n,location.href);return i.searchParams.set("__WB_REVISION__",s),{cacheKey:i.href,url:r.href}}class d{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:t,state:e})=>{e&&(e.originalRequest=t)},this.cachedResponseWillBeUsed=async({event:t,state:e,cachedResponse:s})=>{if("install"===t.type&&e&&e.originalRequest&&e.originalRequest instanceof Request){const t=e.originalRequest.url;s?this.notUpdatedURLs.push(t):this.updatedURLs.push(t)}return s}}}class w{constructor({precacheController:t}){this.cacheKeyWillBeUsed=async({request:t,params:e})=>{const s=(null==e?void 0:e.cacheKey)||this.h.getCacheKeyForURL(t.url);return s?new Request(s,{headers:t.headers}):t},this.h=t}}let p;async function y(t,s){let n=null;if(t.url){n=new URL(t.url).origin}if(n!==self.location.origin)throw new e("cross-origin-copy-response",{origin:n});const i=t.clone(),r={headers:new Headers(i.headers),status:i.status,statusText:i.statusText},c=s?s(r):r,a=function(){if(void 0===p){const t=new Response("");if("body"in t)try{new Response(t.body),p=!0}catch(t){p=!1}p=!1}return p}()?i.body:await i.blob();return new Response(a,c)}function g(t,e){const s=new URL(t);for(const t of e)s.searchParams.delete(t);return s.href}class b{constructor(){this.promise=new Promise(((t,e)=>{this.resolve=t,this.reject=e}))}}const v=new Set;try{self["workbox:strategies:6.4.1"]&&_()}catch(t){}function R(t){return"string"==typeof t?new Request(t):t}class m{constructor(t,e){this.u={},Object.assign(this,e),this.event=e.event,this.l=t,this.p=new b,this.g=[],this.v=[...t.plugins],this.R=new Map;for(const t of this.v)this.R.set(t,{});this.event.waitUntil(this.p.promise)}async fetch(t){const{event:s}=this;let n=R(t);if("navigate"===n.mode&&s instanceof FetchEvent&&s.preloadResponse){const t=await s.preloadResponse;if(t)return t}const i=this.hasCallback("fetchDidFail")?n.clone():null;try{for(const t of this.iterateCallbacks("requestWillFetch"))n=await t({request:n.clone(),event:s})}catch(t){if(t instanceof Error)throw new e("plugin-error-request-will-fetch",{thrownErrorMessage:t.message})}const r=n.clone();try{let t;t=await fetch(n,"navigate"===n.mode?void 0:this.l.fetchOptions);for(const e of this.iterateCallbacks("fetchDidSucceed"))t=await e({event:s,request:r,response:t});return t}catch(t){throw i&&await this.runCallbacks("fetchDidFail",{error:t,event:s,originalRequest:i.clone(),request:r.clone()}),t}}async fetchAndCachePut(t){const e=await this.fetch(t),s=e.clone();return this.waitUntil(this.cachePut(t,s)),e}async cacheMatch(t){const e=R(t);let s;const{cacheName:n,matchOptions:i}=this.l,r=await this.getCacheKey(e,"read"),c=Object.assign(Object.assign({},i),{cacheName:n});s=await caches.match(r,c);for(const t of this.iterateCallbacks("cachedResponseWillBeUsed"))s=await t({cacheName:n,matchOptions:i,cachedResponse:s,request:r,event:this.event})||void 0;return s}async cachePut(t,s){const n=R(t);var i;await(i=0,new Promise((t=>setTimeout(t,i))));const r=await this.getCacheKey(n,"write");if(!s)throw new e("cache-put-with-no-response",{url:(c=r.url,new URL(String(c),location.href).href.replace(new RegExp(`^${location.origin}`),""))});var c;const a=await this.m(s);if(!a)return!1;const{cacheName:o,matchOptions:h}=this.l,u=await self.caches.open(o),l=this.hasCallback("cacheDidUpdate"),f=l?await async function(t,e,s,n){const i=g(e.url,s);if(e.url===i)return t.match(e,n);const r=Object.assign(Object.assign({},n),{ignoreSearch:!0}),c=await t.keys(e,r);for(const e of c)if(i===g(e.url,s))return t.match(e,n)}(u,r.clone(),["__WB_REVISION__"],h):null;try{await u.put(r,l?a.clone():a)}catch(t){if(t instanceof Error)throw"QuotaExceededError"===t.name&&await async function(){for(const t of v)await t()}(),t}for(const t of this.iterateCallbacks("cacheDidUpdate"))await t({cacheName:o,oldResponse:f,newResponse:a.clone(),request:r,event:this.event});return!0}async getCacheKey(t,e){const s=`${t.url} | ${e}`;if(!this.u[s]){let n=t;for(const t of this.iterateCallbacks("cacheKeyWillBeUsed"))n=R(await t({mode:e,request:n,event:this.event,params:this.params}));this.u[s]=n}return this.u[s]}hasCallback(t){for(const e of this.l.plugins)if(t in e)return!0;return!1}async runCallbacks(t,e){for(const s of this.iterateCallbacks(t))await s(e)}*iterateCallbacks(t){for(const e of this.l.plugins)if("function"==typeof e[t]){const s=this.R.get(e),n=n=>{const i=Object.assign(Object.assign({},n),{state:s});return e[t](i)};yield n}}waitUntil(t){return this.g.push(t),t}async doneWaiting(){let t;for(;t=this.g.shift();)await t}destroy(){this.p.resolve(null)}async m(t){let e=t,s=!1;for(const t of this.iterateCallbacks("cacheWillUpdate"))if(e=await t({request:this.request,response:e,event:this.event})||void 0,s=!0,!e)break;return s||e&&200!==e.status&&(e=void 0),e}}class q extends class{constructor(t={}){this.cacheName=u(t.cacheName),this.plugins=t.plugins||[],this.fetchOptions=t.fetchOptions,this.matchOptions=t.matchOptions}handle(t){const[e]=this.handleAll(t);return e}handleAll(t){t instanceof FetchEvent&&(t={event:t,request:t.request});const e=t.event,s="string"==typeof t.request?new Request(t.request):t.request,n="params"in t?t.params:void 0,i=new m(this,{event:e,request:s,params:n}),r=this.q(i,s,e);return[r,this.U(r,i,s,e)]}async q(t,s,n){let i;await t.runCallbacks("handlerWillStart",{event:n,request:s});try{if(i=await this.L(s,t),!i||"error"===i.type)throw new e("no-response",{url:s.url})}catch(e){if(e instanceof Error)for(const r of t.iterateCallbacks("handlerDidError"))if(i=await r({error:e,event:n,request:s}),i)break;if(!i)throw e}for(const e of t.iterateCallbacks("handlerWillRespond"))i=await e({event:n,request:s,response:i});return i}async U(t,e,s,n){let i,r;try{i=await t}catch(r){}try{await e.runCallbacks("handlerDidRespond",{event:n,request:s,response:i}),await e.doneWaiting()}catch(t){t instanceof Error&&(r=t)}if(await e.runCallbacks("handlerDidComplete",{event:n,request:s,response:i,error:r}),e.destroy(),r)throw r}}{constructor(t={}){t.cacheName=h(t.cacheName),super(t),this._=!1!==t.fallbackToNetwork,this.plugins.push(q.copyRedirectedCacheableResponsesPlugin)}async L(t,e){const s=await e.cacheMatch(t);return s||(e.event&&"install"===e.event.type?await this.C(t,e):await this.O(t,e))}async O(t,s){let n;const i=s.params||{};if(!this._)throw new e("missing-precache-entry",{cacheName:this.cacheName,url:t.url});{const e=i.integrity,r=t.integrity,c=!r||r===e;n=await s.fetch(new Request(t,{integrity:r||e})),e&&c&&(this.N(),await s.cachePut(t,n.clone()))}return n}async C(t,s){this.N();const n=await s.fetch(t);if(!await s.cachePut(t,n.clone()))throw new e("bad-precaching-response",{url:t.url,status:n.status});return n}N(){let t=null,e=0;for(const[s,n]of this.plugins.entries())n!==q.copyRedirectedCacheableResponsesPlugin&&(n===q.defaultPrecacheCacheabilityPlugin&&(t=s),n.cacheWillUpdate&&e++);0===e?this.plugins.push(q.defaultPrecacheCacheabilityPlugin):e>1&&null!==t&&this.plugins.splice(t,1)}}q.defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:t})=>!t||t.status>=400?null:t},q.copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:t})=>t.redirected?await y(t):t};class U{constructor({cacheName:t,plugins:e=[],fallbackToNetwork:s=!0}={}){this.j=new Map,this.k=new Map,this.K=new Map,this.l=new q({cacheName:h(t),plugins:[...e,new w({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this.l}precache(t){this.addToCacheList(t),this.T||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this.T=!0)}addToCacheList(t){const s=[];for(const n of t){"string"==typeof n?s.push(n):n&&void 0===n.revision&&s.push(n.url);const{cacheKey:t,url:i}=f(n),r="string"!=typeof n&&n.revision?"reload":"default";if(this.j.has(i)&&this.j.get(i)!==t)throw new e("add-to-cache-list-conflicting-entries",{firstEntry:this.j.get(i),secondEntry:t});if("string"!=typeof n&&n.integrity){if(this.K.has(t)&&this.K.get(t)!==n.integrity)throw new e("add-to-cache-list-conflicting-integrities",{url:i});this.K.set(t,n.integrity)}if(this.j.set(i,t),this.k.set(i,r),s.length>0){const t=`Workbox is precaching URLs without revision info: ${s.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(t)}}}install(t){return l(t,(async()=>{const e=new d;this.strategy.plugins.push(e);for(const[e,s]of this.j){const n=this.K.get(s),i=this.k.get(e),r=new Request(e,{integrity:n,cache:i,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:s},request:r,event:t}))}const{updatedURLs:s,notUpdatedURLs:n}=e;return{updatedURLs:s,notUpdatedURLs:n}}))}activate(t){return l(t,(async()=>{const t=await self.caches.open(this.strategy.cacheName),e=await t.keys(),s=new Set(this.j.values()),n=[];for(const i of e)s.has(i.url)||(await t.delete(i),n.push(i.url));return{deletedURLs:n}}))}getURLsToCacheKeys(){return this.j}getCachedURLs(){return[...this.j.keys()]}getCacheKeyForURL(t){const e=new URL(t,location.href);return this.j.get(e.href)}getIntegrityForCacheKey(t){return this.K.get(t)}async matchPrecache(t){const e=t instanceof Request?t.url:t,s=this.getCacheKeyForURL(e);if(s){return(await self.caches.open(this.strategy.cacheName)).match(s)}}createHandlerBoundToURL(t){const s=this.getCacheKeyForURL(t);if(!s)throw new e("non-precached-url",{url:t});return e=>(e.request=new Request(t),e.params=Object.assign({cacheKey:s},e.params),this.strategy.handle(e))}}let L;const x=()=>(L||(L=new U),L);class C extends n{constructor(t,e){super((({request:s})=>{const n=t.getURLsToCacheKeys();for(const i of function*(t,{ignoreURLParametersMatching:e=[/^utm_/,/^fbclid$/],directoryIndex:s="index.html",cleanURLs:n=!0,urlManipulation:i}={}){const r=new URL(t,location.href);r.hash="",yield r.href;const c=function(t,e=[]){for(const s of[...t.searchParams.keys()])e.some((t=>t.test(s)))&&t.searchParams.delete(s);return t}(r,e);if(yield c.href,s&&c.pathname.endsWith("/")){const t=new URL(c.href);t.pathname+=s,yield t.href}if(n){const t=new URL(c.href);t.pathname+=".html",yield t.href}if(i){const t=i({url:r});for(const e of t)yield e.href}}(s.url,e)){const e=n.get(i);if(e){return{cacheKey:e,integrity:t.getIntegrityForCacheKey(e)}}}}),t.strategy)}}function E(t){const s=x();!function(t,s,a){let o;if("string"==typeof t){const e=new URL(t,location.href);o=new n((({url:t})=>t.href===e.href),s,a)}else if(t instanceof RegExp)o=new i(t,s,a);else if("function"==typeof t)o=new n(t,s,a);else{if(!(t instanceof n))throw new e("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});o=t}(c||(c=new r,c.addFetchListener(),c.addCacheListener()),c).registerRoute(o)}(new C(s,t))}var O;self.skipWaiting(),self.addEventListener("activate",(()=>self.clients.claim())),O={},function(t){x().precache(t)}([{url:"android-chrome-192x192.png",revision:"a392751f45ae0050899a2f11135527d9"},{url:"android-chrome-512x512.png",revision:"33f9627c2b69967e37f03d31235daa2b"},{url:"apple-touch-icon.png",revision:"73301b46ee02dcb383cb2e649c53f459"},{url:"build/bundle.3f8e668c3bf3650550406d33df2c8bf1.css",revision:"3f8e668c3bf3650550406d33df2c8bf1"},{url:"build/bundle.99098f4afcd22f0b0d44e4cd27c91d45.js",revision:"99098f4afcd22f0b0d44e4cd27c91d45"},{url:"build/fc1ad9f669828661.wasm",revision:"edb77f1590d13eed337b867a7315cb4b"},{url:"build/Render.worker.js",revision:"b5c30f1e517bec018cf7c23de15c078b"},{url:"favicon-16x16.png",revision:"778a18013b64dbb32364d3c491eab9ce"},{url:"favicon-32x32.png",revision:"4ff32519ad31dde4f2b550a55f3c53a5"},{url:"favicon.ico",revision:"cc7d3be22cff8e224b9b75ac05baa0a5"},{url:"global.css",revision:"45a73d66d77f73e2984f6f8941df21c5"},{url:"index.html",revision:"cfe8745182dae1ab9dec19569973dd78"}]),E(O);