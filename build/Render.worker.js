var worker=function(e){"use strict";let t;const n=new Array(32).fill(void 0);function r(e){return n[e]}n.push(void 0,null,!0,!1);let a=n.length;function i(e){const t=r(e);return function(e){e<36||(n[e]=a,a=e)}(e),t}let s=new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0});s.decode();let o=null;function c(){return null!==o&&o.buffer===t.memory.buffer||(o=new Uint8Array(t.memory.buffer)),o}function _(e,t){return s.decode(c().subarray(e,e+t))}let l=null;function u(){return null!==l&&l.buffer===t.memory.buffer||(l=new Int32Array(t.memory.buffer)),l}let d=0,f=new TextEncoder("utf-8");const w="function"==typeof f.encodeInto?function(e,t){return f.encodeInto(e,t)}:function(e,t){const n=f.encode(e);return t.set(n),{read:e.length,written:n.length}};function b(e,t,n){if(void 0===n){const n=f.encode(e),r=t(n.length);return c().subarray(r,r+n.length).set(n),d=n.length,r}let r=e.length,a=t(r);const i=c();let s=0;for(;s<r;s++){const t=e.charCodeAt(s);if(t>127)break;i[a+s]=t}if(s!==r){0!==s&&(e=e.slice(s)),a=n(a,r,r=s+3*e.length);const t=c().subarray(a+s,a+r);s+=w(e,t).written}return d=s,a}function g(e){a===n.length&&n.push(n.length+1);const t=a;return a=n[t],n[t]=e,t}let h=null;function m(e,n){return(null!==h&&h.buffer===t.memory.buffer||(h=new Uint8ClampedArray(t.memory.buffer)),h).subarray(e/1,e/1+n)}class p{static __wrap(e){const t=Object.create(p.prototype);return t.ptr=e,t}toJSON(){return{id:this.id,width:this.width,height:this.height}}toString(){return JSON.stringify(this)}__destroy_into_raw(){const e=this.ptr;return this.ptr=0,e}free(){const e=this.__destroy_into_raw();t.__wbg_camera_free(e)}get id(){try{const r=t.__wbindgen_add_to_stack_pointer(-16);t.__wbg_get_camera_id(r,this.ptr);var e=u()[r/4+0],n=u()[r/4+1];return _(e,n)}finally{t.__wbindgen_add_to_stack_pointer(16),t.__wbindgen_free(e,n)}}set id(e){var n=b(e,t.__wbindgen_malloc,t.__wbindgen_realloc),r=d;t.__wbg_set_camera_id(this.ptr,n,r)}get width(){return t.__wbg_get_camera_width(this.ptr)>>>0}set width(e){t.__wbg_set_camera_width(this.ptr,e)}get height(){return t.__wbg_get_camera_height(this.ptr)>>>0}set height(e){t.__wbg_set_camera_height(this.ptr,e)}constructor(e,n,r){var a=b(e,t.__wbindgen_malloc,t.__wbindgen_realloc),i=d,s=t.camera_new(a,i,n,r);return p.__wrap(s)}}class y{static __wrap(e){const t=Object.create(y.prototype);return t.ptr=e,t}__destroy_into_raw(){const e=this.ptr;return this.ptr=0,e}free(){const e=this.__destroy_into_raw();t.__wbg_world_free(e)}constructor(e){try{const o=t.__wbindgen_add_to_stack_pointer(-16);var n=b(e,t.__wbindgen_malloc,t.__wbindgen_realloc),r=d;t.world_new(o,n,r);var a=u()[o/4+0],s=u()[o/4+1];if(u()[o/4+2])throw i(s);return y.__wrap(a)}finally{t.__wbindgen_add_to_stack_pointer(16)}}getCameras(){try{const r=t.__wbindgen_add_to_stack_pointer(-16);t.world_getCameras(r,this.ptr);var e=u()[r/4+0],n=u()[r/4+1];if(u()[r/4+2])throw i(n);return i(e)}finally{t.__wbindgen_add_to_stack_pointer(16)}}render(e,n,r,a,s){try{const g=t.__wbindgen_add_to_stack_pointer(-16);var o=b(e,t.__wbindgen_malloc,t.__wbindgen_realloc),c=d;t.world_render(g,this.ptr,o,c,n,r,a,s);var _=u()[g/4+0],l=u()[g/4+1],f=u()[g/4+2];if(u()[g/4+3])throw i(f);var w=m(_,l).slice();return t.__wbindgen_free(_,1*l),w}finally{t.__wbindgen_add_to_stack_pointer(16)}}}async function v(e){void 0===e&&(e=new URL("raytracer_bg.wasm",document.currentScript&&document.currentScript.src||new URL("Render.worker.js",document.baseURI).href));const n={wbg:{}};n.wbg.__wbg_camera_new=function(e){return g(p.__wrap(e))},n.wbg.__wbindgen_object_drop_ref=function(e){i(e)},n.wbg.__wbg_new_693216e109162396=function(){return g(new Error)},n.wbg.__wbg_stack_0ddaca5d1abfb52f=function(e,n){var a=b(r(n).stack,t.__wbindgen_malloc,t.__wbindgen_realloc),i=d;u()[e/4+1]=i,u()[e/4+0]=a},n.wbg.__wbg_error_09919627ac0992f5=function(e,n){try{console.error(_(e,n))}finally{t.__wbindgen_free(e,n)}},n.wbg.__wbg_new_16f24b0728c5e67b=function(){return g(new Array)},n.wbg.__wbg_push_a72df856079e6930=function(e,t){return r(e).push(r(t))},n.wbg.__wbg_new_55259b13834a484c=function(e,t){return g(new Error(_(e,t)))},n.wbg.__wbindgen_throw=function(e,t){throw new Error(_(e,t))},("string"==typeof e||"function"==typeof Request&&e instanceof Request||"function"==typeof URL&&e instanceof URL)&&(e=fetch(e));const{instance:a,module:s}=await async function(e,t){if("function"==typeof Response&&e instanceof Response){if("function"==typeof WebAssembly.instantiateStreaming)try{return await WebAssembly.instantiateStreaming(e,t)}catch(t){if("application/wasm"==e.headers.get("Content-Type"))throw t;console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",t)}const n=await e.arrayBuffer();return await WebAssembly.instantiate(n,t)}{const n=await WebAssembly.instantiate(e,t);return n instanceof WebAssembly.Instance?{instance:n,module:e}:n}}(await e,n);return t=a.exports,v.__wbindgen_wasm_module=s,t.__wbindgen_start(),t}function A(e){return function(e,t,n,r){function a(e,t,n){var r=n?WebAssembly.instantiateStreaming:WebAssembly.instantiate,a=n?WebAssembly.compileStreaming:WebAssembly.compile;return t?r(e,t):a(e)}var i=null,s="undefined"!=typeof process&&null!=process.versions&&null!=process.versions.node;if(t&&s){var o=require("fs"),c=require("path");return new Promise(((e,n)=>{o.readFile(c.resolve(__dirname,t),((t,i)=>{null!=t&&n(t),e(a(i,r,!1))}))}))}if(t)return a(fetch(t),r,!0);if(s)i=Buffer.from(n,"base64");else{var _=globalThis.atob(n),l=_.length;i=new Uint8Array(new ArrayBuffer(l));for(var u=0;u<l;u++)i[u]=_.charCodeAt(u)}if(e){var d=new WebAssembly.Module(i);return r?new WebAssembly.Instance(d,r):d}return a(i,r,!1)}(0,"e377155bf7a9fa74.wasm",null,e)}const E=Symbol("Comlink.proxy"),k=Symbol("Comlink.endpoint"),S=Symbol("Comlink.releaseProxy"),C=Symbol("Comlink.thrown"),R=e=>"object"==typeof e&&null!==e||"function"==typeof e,I=new Map([["proxy",{canHandle:e=>R(e)&&e[E],serialize(e){const{port1:t,port2:n}=new MessageChannel;return L(e,t),[n,[n]]},deserialize(e){return e.start(),M(e,[],t);var t}}],["throw",{canHandle:e=>R(e)&&C in e,serialize({value:e}){let t;return t=e instanceof Error?{isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:{isError:!1,value:e},[t,[]]},deserialize(e){if(e.isError)throw Object.assign(new Error(e.value.message),e.value);throw e.value}}]]);function L(e,t=self){t.addEventListener("message",(function n(r){if(!r||!r.data)return;const{id:a,type:i,path:s}=Object.assign({path:[]},r.data),o=(r.data.argumentList||[]).map(N);let c;try{const t=s.slice(0,-1).reduce(((e,t)=>e[t]),e),n=s.reduce(((e,t)=>e[t]),e);switch(i){case"GET":c=n;break;case"SET":t[s.slice(-1)[0]]=N(r.data.value),c=!0;break;case"APPLY":c=n.apply(t,o);break;case"CONSTRUCT":c=function(e){return Object.assign(e,{[E]:!0})}(new n(...o));break;case"ENDPOINT":{const{port1:t,port2:n}=new MessageChannel;L(e,n),c=P(t,[t])}break;case"RELEASE":c=void 0;break;default:return}}catch(e){c={value:e,[C]:0}}Promise.resolve(c).catch((e=>({value:e,[C]:0}))).then((e=>{const[r,s]=j(e);t.postMessage(Object.assign(Object.assign({},r),{id:a}),s),"RELEASE"===i&&(t.removeEventListener("message",n),O(t))}))})),t.start&&t.start()}function O(e){(function(e){return"MessagePort"===e.constructor.name})(e)&&e.close()}function W(e){if(e)throw new Error("Proxy has been released and is not useable")}function M(e,t=[],n=function(){}){let r=!1;const a=new Proxy(n,{get(n,i){if(W(r),i===S)return()=>U(e,{type:"RELEASE",path:t.map((e=>e.toString()))}).then((()=>{O(e),r=!0}));if("then"===i){if(0===t.length)return{then:()=>a};const n=U(e,{type:"GET",path:t.map((e=>e.toString()))}).then(N);return n.then.bind(n)}return M(e,[...t,i])},set(n,a,i){W(r);const[s,o]=j(i);return U(e,{type:"SET",path:[...t,a].map((e=>e.toString())),value:s},o).then(N)},apply(n,a,i){W(r);const s=t[t.length-1];if(s===k)return U(e,{type:"ENDPOINT"}).then(N);if("bind"===s)return M(e,t.slice(0,-1));const[o,c]=z(i);return U(e,{type:"APPLY",path:t.map((e=>e.toString())),argumentList:o},c).then(N)},construct(n,a){W(r);const[i,s]=z(a);return U(e,{type:"CONSTRUCT",path:t.map((e=>e.toString())),argumentList:i},s).then(N)}});return a}function z(e){const t=e.map(j);return[t.map((e=>e[0])),(n=t.map((e=>e[1])),Array.prototype.concat.apply([],n))];var n}const T=new WeakMap;function P(e,t){return T.set(e,t),e}function j(e){for(const[t,n]of I)if(n.canHandle(e)){const[r,a]=n.serialize(e);return[{type:"HANDLER",name:t,value:r},a]}return[{type:"RAW",value:e},T.get(e)||[]]}function N(e){switch(e.type){case"HANDLER":return I.get(e.name).deserialize(e.value);case"RAW":return e.value}}function U(e,t,n){return new Promise((r=>{const a=new Array(4).fill(0).map((()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16))).join("-");e.addEventListener("message",(function t(n){n.data&&n.data.id&&n.data.id===a&&(e.removeEventListener("message",t),r(n.data))})),e.start&&e.start(),e.postMessage(Object.assign({id:a},t),n)}))}class x{constructor(){this.initialized=!1}assertIsInitialized(){if(!this.initialized)throw new Error("Worker not initialized!")}async initialize(){if(this.initialized)return;const e=await A();await v(e),this.cameras=new Map,this.initialized=!0}loadYaml(e){this.assertIsInitialized(),this.world=new y(e),this.cameras=new Map(this.world.getCameras().map((e=>[e.id,e.toJSON()])))}getCameras(){return this.assertIsInitialized(),Array.from(this.cameras.values())}renderForCamera(e,t,n,r,a){this.assertIsInitialized();const i=this.world.render(e,t,n,r,a),s=new ArrayBuffer(i.byteLength),o=new Uint8ClampedArray(s);return o.set(new Uint8ClampedArray(i)),P(new ImageData(o,r-t,a-n),[s])}}return L(new x),e.RenderWorker=x,Object.defineProperty(e,"__esModule",{value:!0}),e}({});
