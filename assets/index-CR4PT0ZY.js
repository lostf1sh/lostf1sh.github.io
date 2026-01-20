(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function n(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(o){if(o.ep)return;o.ep=!0;const r=n(o);fetch(o.href,r)}})();/**
* @vue/shared v3.4.19
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function fo(e,t){const n=new Set(e.split(","));return s=>n.has(s)}const _e={},Vt=[],qe=()=>{},ac=()=>!1,ss=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97),po=e=>e.startsWith("onUpdate:"),Re=Object.assign,ho=(e,t)=>{const n=e.indexOf(t);n>-1&&e.splice(n,1)},cc=Object.prototype.hasOwnProperty,ie=(e,t)=>cc.call(e,t),G=Array.isArray,Kt=e=>os(e)==="[object Map]",ri=e=>os(e)==="[object Set]",ee=e=>typeof e=="function",xe=e=>typeof e=="string",en=e=>typeof e=="symbol",ge=e=>e!==null&&typeof e=="object",ii=e=>(ge(e)||ee(e))&&ee(e.then)&&ee(e.catch),ai=Object.prototype.toString,os=e=>ai.call(e),lc=e=>os(e).slice(8,-1),ci=e=>os(e)==="[object Object]",mo=e=>xe(e)&&e!=="NaN"&&e[0]!=="-"&&""+parseInt(e,10)===e,un=fo(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),rs=e=>{const t=Object.create(null);return n=>t[n]||(t[n]=e(n))},uc=/-(\w)/g,ct=rs(e=>e.replace(uc,(t,n)=>n?n.toUpperCase():"")),fc=/\B([A-Z])/g,tn=rs(e=>e.replace(fc,"-$1").toLowerCase()),is=rs(e=>e.charAt(0).toUpperCase()+e.slice(1)),Ts=rs(e=>e?`on${is(e)}`:""),Ct=(e,t)=>!Object.is(e,t),As=(e,t)=>{for(let n=0;n<e.length;n++)e[n](t)},Yn=(e,t,n)=>{Object.defineProperty(e,t,{configurable:!0,enumerable:!1,value:n})},dc=e=>{const t=parseFloat(e);return isNaN(t)?e:t},pc=e=>{const t=xe(e)?Number(e):NaN;return isNaN(t)?e:t};let Do;const li=()=>Do||(Do=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function bn(e){if(G(e)){const t={};for(let n=0;n<e.length;n++){const s=e[n],o=xe(s)?bc(s):bn(s);if(o)for(const r in o)t[r]=o[r]}return t}else if(xe(e)||ge(e))return e}const hc=/;(?![^(]*\))/g,mc=/:([^]+)/,gc=/\/\*[^]*?\*\//g;function bc(e){const t={};return e.replace(gc,"").split(hc).forEach(n=>{if(n){const s=n.split(mc);s.length>1&&(t[s[0].trim()]=s[1].trim())}}),t}function yn(e){let t="";if(xe(e))t=e;else if(G(e))for(let n=0;n<e.length;n++){const s=yn(e[n]);s&&(t+=s+" ")}else if(ge(e))for(const n in e)e[n]&&(t+=n+" ");return t.trim()}const yc="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",_c=fo(yc);function ui(e){return!!e||e===""}const ue=e=>xe(e)?e:e==null?"":G(e)||ge(e)&&(e.toString===ai||!ee(e.toString))?JSON.stringify(e,fi,2):String(e),fi=(e,t)=>t&&t.__v_isRef?fi(e,t.value):Kt(t)?{[`Map(${t.size})`]:[...t.entries()].reduce((n,[s,o],r)=>(n[Os(s,r)+" =>"]=o,n),{})}:ri(t)?{[`Set(${t.size})`]:[...t.values()].map(n=>Os(n))}:en(t)?Os(t):ge(t)&&!G(t)&&!ci(t)?String(t):t,Os=(e,t="")=>{var n;return en(e)?`Symbol(${(n=e.description)!=null?n:t})`:e};/**
* @vue/reactivity v3.4.19
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Ye;class vc{constructor(t=!1){this.detached=t,this._active=!0,this.effects=[],this.cleanups=[],this.parent=Ye,!t&&Ye&&(this.index=(Ye.scopes||(Ye.scopes=[])).push(this)-1)}get active(){return this._active}run(t){if(this._active){const n=Ye;try{return Ye=this,t()}finally{Ye=n}}}on(){Ye=this}off(){Ye=this.parent}stop(t){if(this._active){let n,s;for(n=0,s=this.effects.length;n<s;n++)this.effects[n].stop();for(n=0,s=this.cleanups.length;n<s;n++)this.cleanups[n]();if(this.scopes)for(n=0,s=this.scopes.length;n<s;n++)this.scopes[n].stop(!0);if(!this.detached&&this.parent&&!t){const o=this.parent.scopes.pop();o&&o!==this&&(this.parent.scopes[this.index]=o,o.index=this.index)}this.parent=void 0,this._active=!1}}}function wc(e,t=Ye){t&&t.active&&t.effects.push(e)}function xc(){return Ye}let Lt;class go{constructor(t,n,s,o){this.fn=t,this.trigger=n,this.scheduler=s,this.active=!0,this.deps=[],this._dirtyLevel=4,this._trackId=0,this._runnings=0,this._shouldSchedule=!1,this._depsLength=0,wc(this,o)}get dirty(){if(this._dirtyLevel===2||this._dirtyLevel===3){this._dirtyLevel=1,jt();for(let t=0;t<this._depsLength;t++){const n=this.deps[t];if(n.computed&&(Ec(n.computed),this._dirtyLevel>=4))break}this._dirtyLevel===1&&(this._dirtyLevel=0),Dt()}return this._dirtyLevel>=4}set dirty(t){this._dirtyLevel=t?4:0}run(){if(this._dirtyLevel=0,!this.active)return this.fn();let t=Et,n=Lt;try{return Et=!0,Lt=this,this._runnings++,Bo(this),this.fn()}finally{Uo(this),this._runnings--,Lt=n,Et=t}}stop(){var t;this.active&&(Bo(this),Uo(this),(t=this.onStop)==null||t.call(this),this.active=!1)}}function Ec(e){return e.value}function Bo(e){e._trackId++,e._depsLength=0}function Uo(e){if(e.deps.length>e._depsLength){for(let t=e._depsLength;t<e.deps.length;t++)di(e.deps[t],e);e.deps.length=e._depsLength}}function di(e,t){const n=e.get(t);n!==void 0&&t._trackId!==n&&(e.delete(t),e.size===0&&e.cleanup())}let Et=!0,Vs=0;const pi=[];function jt(){pi.push(Et),Et=!1}function Dt(){const e=pi.pop();Et=e===void 0?!0:e}function bo(){Vs++}function yo(){for(Vs--;!Vs&&Ks.length;)Ks.shift()()}function hi(e,t,n){if(t.get(e)!==e._trackId){t.set(e,e._trackId);const s=e.deps[e._depsLength];s!==t?(s&&di(s,e),e.deps[e._depsLength++]=t):e._depsLength++}}const Ks=[];function mi(e,t,n){bo();for(const s of e.keys()){let o;s._dirtyLevel<t&&(o??(o=e.get(s)===s._trackId))&&(s._shouldSchedule||(s._shouldSchedule=s._dirtyLevel===0),s._dirtyLevel=t),s._shouldSchedule&&(o??(o=e.get(s)===s._trackId))&&(s.trigger(),(!s._runnings||s.allowRecurse)&&s._dirtyLevel!==2&&(s._shouldSchedule=!1,s.scheduler&&Ks.push(s.scheduler)))}yo()}const gi=(e,t)=>{const n=new Map;return n.cleanup=e,n.computed=t,n},Ws=new WeakMap,Ft=Symbol(""),Js=Symbol("");function De(e,t,n){if(Et&&Lt){let s=Ws.get(e);s||Ws.set(e,s=new Map);let o=s.get(n);o||s.set(n,o=gi(()=>s.delete(n))),hi(Lt,o)}}function dt(e,t,n,s,o,r){const i=Ws.get(e);if(!i)return;let a=[];if(t==="clear")a=[...i.values()];else if(n==="length"&&G(e)){const c=Number(s);i.forEach((l,u)=>{(u==="length"||!en(u)&&u>=c)&&a.push(l)})}else switch(n!==void 0&&a.push(i.get(n)),t){case"add":G(e)?mo(n)&&a.push(i.get("length")):(a.push(i.get(Ft)),Kt(e)&&a.push(i.get(Js)));break;case"delete":G(e)||(a.push(i.get(Ft)),Kt(e)&&a.push(i.get(Js)));break;case"set":Kt(e)&&a.push(i.get(Ft));break}bo();for(const c of a)c&&mi(c,4);yo()}const Sc=fo("__proto__,__v_isRef,__isVue"),bi=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!=="arguments"&&e!=="caller").map(e=>Symbol[e]).filter(en)),zo=Cc();function Cc(){const e={};return["includes","indexOf","lastIndexOf"].forEach(t=>{e[t]=function(...n){const s=ae(this);for(let r=0,i=this.length;r<i;r++)De(s,"get",r+"");const o=s[t](...n);return o===-1||o===!1?s[t](...n.map(ae)):o}}),["push","pop","shift","unshift","splice"].forEach(t=>{e[t]=function(...n){jt(),bo();const s=ae(this)[t].apply(this,n);return yo(),Dt(),s}}),e}function Rc(e){const t=ae(this);return De(t,"has",e),t.hasOwnProperty(e)}class yi{constructor(t=!1,n=!1){this._isReadonly=t,this._shallow=n}get(t,n,s){const o=this._isReadonly,r=this._shallow;if(n==="__v_isReactive")return!o;if(n==="__v_isReadonly")return o;if(n==="__v_isShallow")return r;if(n==="__v_raw")return s===(o?r?Dc:xi:r?wi:vi).get(t)||Object.getPrototypeOf(t)===Object.getPrototypeOf(s)?t:void 0;const i=G(t);if(!o){if(i&&ie(zo,n))return Reflect.get(zo,n,s);if(n==="hasOwnProperty")return Rc}const a=Reflect.get(t,n,s);return(en(n)?bi.has(n):Sc(n))||(o||De(t,"get",n),r)?a:Be(a)?i&&mo(n)?a:a.value:ge(a)?o?Si(a):Tn(a):a}}class _i extends yi{constructor(t=!1){super(!1,t)}set(t,n,s,o){let r=t[n];if(!this._shallow){const c=Gt(r);if(!Qn(s)&&!Gt(s)&&(r=ae(r),s=ae(s)),!G(t)&&Be(r)&&!Be(s))return c?!1:(r.value=s,!0)}const i=G(t)&&mo(n)?Number(n)<t.length:ie(t,n),a=Reflect.set(t,n,s,o);return t===ae(o)&&(i?Ct(s,r)&&dt(t,"set",n,s):dt(t,"add",n,s)),a}deleteProperty(t,n){const s=ie(t,n);t[n];const o=Reflect.deleteProperty(t,n);return o&&s&&dt(t,"delete",n,void 0),o}has(t,n){const s=Reflect.has(t,n);return(!en(n)||!bi.has(n))&&De(t,"has",n),s}ownKeys(t){return De(t,"iterate",G(t)?"length":Ft),Reflect.ownKeys(t)}}class kc extends yi{constructor(t=!1){super(!0,t)}set(t,n){return!0}deleteProperty(t,n){return!0}}const Tc=new _i,Ac=new kc,Oc=new _i(!0),_o=e=>e,as=e=>Reflect.getPrototypeOf(e);function Ln(e,t,n=!1,s=!1){e=e.__v_raw;const o=ae(e),r=ae(t);n||(Ct(t,r)&&De(o,"get",t),De(o,"get",r));const{has:i}=as(o),a=s?_o:n?xo:_n;if(i.call(o,t))return a(e.get(t));if(i.call(o,r))return a(e.get(r));e!==o&&e.get(t)}function Fn(e,t=!1){const n=this.__v_raw,s=ae(n),o=ae(e);return t||(Ct(e,o)&&De(s,"has",e),De(s,"has",o)),e===o?n.has(e):n.has(e)||n.has(o)}function In(e,t=!1){return e=e.__v_raw,!t&&De(ae(e),"iterate",Ft),Reflect.get(e,"size",e)}function Ho(e){e=ae(e);const t=ae(this);return as(t).has.call(t,e)||(t.add(e),dt(t,"add",e,e)),this}function qo(e,t){t=ae(t);const n=ae(this),{has:s,get:o}=as(n);let r=s.call(n,e);r||(e=ae(e),r=s.call(n,e));const i=o.call(n,e);return n.set(e,t),r?Ct(t,i)&&dt(n,"set",e,t):dt(n,"add",e,t),this}function Vo(e){const t=ae(this),{has:n,get:s}=as(t);let o=n.call(t,e);o||(e=ae(e),o=n.call(t,e)),s&&s.call(t,e);const r=t.delete(e);return o&&dt(t,"delete",e,void 0),r}function Ko(){const e=ae(this),t=e.size!==0,n=e.clear();return t&&dt(e,"clear",void 0,void 0),n}function Mn(e,t){return function(s,o){const r=this,i=r.__v_raw,a=ae(i),c=t?_o:e?xo:_n;return!e&&De(a,"iterate",Ft),i.forEach((l,u)=>s.call(o,c(l),c(u),r))}}function jn(e,t,n){return function(...s){const o=this.__v_raw,r=ae(o),i=Kt(r),a=e==="entries"||e===Symbol.iterator&&i,c=e==="keys"&&i,l=o[e](...s),u=n?_o:t?xo:_n;return!t&&De(r,"iterate",c?Js:Ft),{next(){const{value:f,done:p}=l.next();return p?{value:f,done:p}:{value:a?[u(f[0]),u(f[1])]:u(f),done:p}},[Symbol.iterator](){return this}}}}function ht(e){return function(...t){return e==="delete"?!1:e==="clear"?void 0:this}}function Pc(){const e={get(r){return Ln(this,r)},get size(){return In(this)},has:Fn,add:Ho,set:qo,delete:Vo,clear:Ko,forEach:Mn(!1,!1)},t={get(r){return Ln(this,r,!1,!0)},get size(){return In(this)},has:Fn,add:Ho,set:qo,delete:Vo,clear:Ko,forEach:Mn(!1,!0)},n={get(r){return Ln(this,r,!0)},get size(){return In(this,!0)},has(r){return Fn.call(this,r,!0)},add:ht("add"),set:ht("set"),delete:ht("delete"),clear:ht("clear"),forEach:Mn(!0,!1)},s={get(r){return Ln(this,r,!0,!0)},get size(){return In(this,!0)},has(r){return Fn.call(this,r,!0)},add:ht("add"),set:ht("set"),delete:ht("delete"),clear:ht("clear"),forEach:Mn(!0,!0)};return["keys","values","entries",Symbol.iterator].forEach(r=>{e[r]=jn(r,!1,!1),n[r]=jn(r,!0,!1),t[r]=jn(r,!1,!0),s[r]=jn(r,!0,!0)}),[e,n,t,s]}const[$c,Nc,Lc,Fc]=Pc();function vo(e,t){const n=t?e?Fc:Lc:e?Nc:$c;return(s,o,r)=>o==="__v_isReactive"?!e:o==="__v_isReadonly"?e:o==="__v_raw"?s:Reflect.get(ie(n,o)&&o in s?n:s,o,r)}const Ic={get:vo(!1,!1)},Mc={get:vo(!1,!0)},jc={get:vo(!0,!1)},vi=new WeakMap,wi=new WeakMap,xi=new WeakMap,Dc=new WeakMap;function Bc(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function Uc(e){return e.__v_skip||!Object.isExtensible(e)?0:Bc(lc(e))}function Tn(e){return Gt(e)?e:wo(e,!1,Tc,Ic,vi)}function Ei(e){return wo(e,!1,Oc,Mc,wi)}function Si(e){return wo(e,!0,Ac,jc,xi)}function wo(e,t,n,s,o){if(!ge(e)||e.__v_raw&&!(t&&e.__v_isReactive))return e;const r=o.get(e);if(r)return r;const i=Uc(e);if(i===0)return e;const a=new Proxy(e,i===2?s:n);return o.set(e,a),a}function Wt(e){return Gt(e)?Wt(e.__v_raw):!!(e&&e.__v_isReactive)}function Gt(e){return!!(e&&e.__v_isReadonly)}function Qn(e){return!!(e&&e.__v_isShallow)}function Ci(e){return Wt(e)||Gt(e)}function ae(e){const t=e&&e.__v_raw;return t?ae(t):e}function Ri(e){return Object.isExtensible(e)&&Yn(e,"__v_skip",!0),e}const _n=e=>ge(e)?Tn(e):e,xo=e=>ge(e)?Si(e):e;class ki{constructor(t,n,s,o){this._setter=n,this.dep=void 0,this.__v_isRef=!0,this.__v_isReadonly=!1,this.effect=new go(()=>t(this._value),()=>zn(this,this.effect._dirtyLevel===2?2:3)),this.effect.computed=this,this.effect.active=this._cacheable=!o,this.__v_isReadonly=s}get value(){const t=ae(this);return(!t._cacheable||t.effect.dirty)&&Ct(t._value,t._value=t.effect.run())&&zn(t,4),Ti(t),t.effect._dirtyLevel>=2&&zn(t,2),t._value}set value(t){this._setter(t)}get _dirty(){return this.effect.dirty}set _dirty(t){this.effect.dirty=t}}function zc(e,t,n=!1){let s,o;const r=ee(e);return r?(s=e,o=qe):(s=e.get,o=e.set),new ki(s,o,r||!o,n)}function Ti(e){var t;Et&&Lt&&(e=ae(e),hi(Lt,(t=e.dep)!=null?t:e.dep=gi(()=>e.dep=void 0,e instanceof ki?e:void 0)))}function zn(e,t=4,n){e=ae(e);const s=e.dep;s&&mi(s,t)}function Be(e){return!!(e&&e.__v_isRef===!0)}function Le(e){return Ai(e,!1)}function Hc(e){return Ai(e,!0)}function Ai(e,t){return Be(e)?e:new qc(e,t)}class qc{constructor(t,n){this.__v_isShallow=n,this.dep=void 0,this.__v_isRef=!0,this._rawValue=n?t:ae(t),this._value=n?t:_n(t)}get value(){return Ti(this),this._value}set value(t){const n=this.__v_isShallow||Qn(t)||Gt(t);t=n?t:ae(t),Ct(t,this._rawValue)&&(this._rawValue=t,this._value=n?t:_n(t),zn(this,4))}}function Ve(e){return Be(e)?e.value:e}const Vc={get:(e,t,n)=>Ve(Reflect.get(e,t,n)),set:(e,t,n,s)=>{const o=e[t];return Be(o)&&!Be(n)?(o.value=n,!0):Reflect.set(e,t,n,s)}};function Oi(e){return Wt(e)?e:new Proxy(e,Vc)}/**
* @vue/runtime-core v3.4.19
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function St(e,t,n,s){try{return s?e(...s):e()}catch(o){cs(o,t,n)}}function We(e,t,n,s){if(ee(e)){const r=St(e,t,n,s);return r&&ii(r)&&r.catch(i=>{cs(i,t,n)}),r}const o=[];for(let r=0;r<e.length;r++)o.push(We(e[r],t,n,s));return o}function cs(e,t,n,s=!0){const o=t?t.vnode:null;if(t){let r=t.parent;const i=t.proxy,a=`https://vuejs.org/error-reference/#runtime-${n}`;for(;r;){const l=r.ec;if(l){for(let u=0;u<l.length;u++)if(l[u](e,i,a)===!1)return}r=r.parent}const c=t.appContext.config.errorHandler;if(c){St(c,null,10,[e,i,a]);return}}Kc(e,n,o,s)}function Kc(e,t,n,s=!0){console.error(e)}let vn=!1,Gs=!1;const Oe=[];let at=0;const Jt=[];let yt=null,Pt=0;const Pi=Promise.resolve();let Eo=null;function $i(e){const t=Eo||Pi;return e?t.then(this?e.bind(this):e):t}function Wc(e){let t=at+1,n=Oe.length;for(;t<n;){const s=t+n>>>1,o=Oe[s],r=wn(o);r<e||r===e&&o.pre?t=s+1:n=s}return t}function So(e){(!Oe.length||!Oe.includes(e,vn&&e.allowRecurse?at+1:at))&&(e.id==null?Oe.push(e):Oe.splice(Wc(e.id),0,e),Ni())}function Ni(){!vn&&!Gs&&(Gs=!0,Eo=Pi.then(Fi))}function Jc(e){const t=Oe.indexOf(e);t>at&&Oe.splice(t,1)}function Gc(e){G(e)?Jt.push(...e):(!yt||!yt.includes(e,e.allowRecurse?Pt+1:Pt))&&Jt.push(e),Ni()}function Wo(e,t,n=vn?at+1:0){for(;n<Oe.length;n++){const s=Oe[n];if(s&&s.pre){if(e&&s.id!==e.uid)continue;Oe.splice(n,1),n--,s()}}}function Li(e){if(Jt.length){const t=[...new Set(Jt)].sort((n,s)=>wn(n)-wn(s));if(Jt.length=0,yt){yt.push(...t);return}for(yt=t,Pt=0;Pt<yt.length;Pt++)yt[Pt]();yt=null,Pt=0}}const wn=e=>e.id==null?1/0:e.id,Yc=(e,t)=>{const n=wn(e)-wn(t);if(n===0){if(e.pre&&!t.pre)return-1;if(t.pre&&!e.pre)return 1}return n};function Fi(e){Gs=!1,vn=!0,Oe.sort(Yc);try{for(at=0;at<Oe.length;at++){const t=Oe[at];t&&t.active!==!1&&St(t,null,14)}}finally{at=0,Oe.length=0,Li(),vn=!1,Eo=null,(Oe.length||Jt.length)&&Fi()}}function Qc(e,t,...n){if(e.isUnmounted)return;const s=e.vnode.props||_e;let o=n;const r=t.startsWith("update:"),i=r&&t.slice(7);if(i&&i in s){const u=`${i==="modelValue"?"model":i}Modifiers`,{number:f,trim:p}=s[u]||_e;p&&(o=n.map(m=>xe(m)?m.trim():m)),f&&(o=n.map(dc))}let a,c=s[a=Ts(t)]||s[a=Ts(ct(t))];!c&&r&&(c=s[a=Ts(tn(t))]),c&&We(c,e,6,o);const l=s[a+"Once"];if(l){if(!e.emitted)e.emitted={};else if(e.emitted[a])return;e.emitted[a]=!0,We(l,e,6,o)}}function Ii(e,t,n=!1){const s=t.emitsCache,o=s.get(e);if(o!==void 0)return o;const r=e.emits;let i={},a=!1;if(!ee(e)){const c=l=>{const u=Ii(l,t,!0);u&&(a=!0,Re(i,u))};!n&&t.mixins.length&&t.mixins.forEach(c),e.extends&&c(e.extends),e.mixins&&e.mixins.forEach(c)}return!r&&!a?(ge(e)&&s.set(e,null),null):(G(r)?r.forEach(c=>i[c]=null):Re(i,r),ge(e)&&s.set(e,i),i)}function ls(e,t){return!e||!ss(t)?!1:(t=t.slice(2).replace(/Once$/,""),ie(e,t[0].toLowerCase()+t.slice(1))||ie(e,tn(t))||ie(e,t))}let Ke=null,us=null;function Xn(e){const t=Ke;return Ke=e,us=e&&e.type.__scopeId||null,t}function Mi(e){us=e}function ji(){us=null}function Ie(e,t=Ke,n){if(!t||e._n)return e;const s=(...o)=>{s._d&&ir(-1);const r=Xn(t);let i;try{i=e(...o)}finally{Xn(r),s._d&&ir(1)}return i};return s._n=!0,s._c=!0,s._d=!0,s}function Jo(e){const{type:t,vnode:n,proxy:s,withProxy:o,props:r,propsOptions:[i],slots:a,attrs:c,emit:l,render:u,renderCache:f,data:p,setupState:m,ctx:g,inheritAttrs:y}=e;let v,k;const N=Xn(e);try{if(n.shapeFlag&4){const D=o||s,W=D;v=it(u.call(W,D,f,r,m,p,g)),k=c}else{const D=t;v=it(D.length>1?D(r,{attrs:c,slots:a,emit:l}):D(r,null)),k=t.props?c:Xc(c)}}catch(D){hn.length=0,cs(D,e,1),v=me(Ze)}let T=v;if(k&&y!==!1){const D=Object.keys(k),{shapeFlag:W}=T;D.length&&W&7&&(i&&D.some(po)&&(k=Zc(k,i)),T=Rt(T,k))}return n.dirs&&(T=Rt(T),T.dirs=T.dirs?T.dirs.concat(n.dirs):n.dirs),n.transition&&(T.transition=n.transition),v=T,Xn(N),v}const Xc=e=>{let t;for(const n in e)(n==="class"||n==="style"||ss(n))&&((t||(t={}))[n]=e[n]);return t},Zc=(e,t)=>{const n={};for(const s in e)(!po(s)||!(s.slice(9)in t))&&(n[s]=e[s]);return n};function el(e,t,n){const{props:s,children:o,component:r}=e,{props:i,children:a,patchFlag:c}=t,l=r.emitsOptions;if(t.dirs||t.transition)return!0;if(n&&c>=0){if(c&1024)return!0;if(c&16)return s?Go(s,i,l):!!i;if(c&8){const u=t.dynamicProps;for(let f=0;f<u.length;f++){const p=u[f];if(i[p]!==s[p]&&!ls(l,p))return!0}}}else return(o||a)&&(!a||!a.$stable)?!0:s===i?!1:s?i?Go(s,i,l):!0:!!i;return!1}function Go(e,t,n){const s=Object.keys(t);if(s.length!==Object.keys(e).length)return!0;for(let o=0;o<s.length;o++){const r=s[o];if(t[r]!==e[r]&&!ls(n,r))return!0}return!1}function tl({vnode:e,parent:t},n){for(;t;){const s=t.subTree;if(s.suspense&&s.suspense.activeBranch===e&&(s.el=e.el),s===e)(e=t.vnode).el=n,t=t.parent;else break}}const Di="components";function fs(e,t){return Ui(Di,e,!0,t)||e}const Bi=Symbol.for("v-ndc");function nl(e){return xe(e)?Ui(Di,e,!1)||e:e||Bi}function Ui(e,t,n=!0,s=!1){const o=Ke||ke;if(o){const r=o.type;{const a=Jl(r,!1);if(a&&(a===t||a===ct(t)||a===is(ct(t))))return r}const i=Yo(o[e]||r[e],t)||Yo(o.appContext[e],t);return!i&&s?r:i}}function Yo(e,t){return e&&(e[t]||e[ct(t)]||e[is(ct(t))])}const sl=e=>e.__isSuspense;function ol(e,t){t&&t.pendingBranch?G(e)?t.effects.push(...e):t.effects.push(e):Gc(e)}const rl=Symbol.for("v-scx"),il=()=>Xe(rl),Dn={};function fn(e,t,n){return zi(e,t,n)}function zi(e,t,{immediate:n,deep:s,flush:o,once:r,onTrack:i,onTrigger:a}=_e){if(t&&r){const L=t;t=(...Y)=>{L(...Y),W()}}const c=ke,l=L=>s===!0?L:Ht(L,s===!1?1:void 0);let u,f=!1,p=!1;if(Be(e)?(u=()=>e.value,f=Qn(e)):Wt(e)?(u=()=>l(e),f=!0):G(e)?(p=!0,f=e.some(L=>Wt(L)||Qn(L)),u=()=>e.map(L=>{if(Be(L))return L.value;if(Wt(L))return l(L);if(ee(L))return St(L,c,2)})):ee(e)?t?u=()=>St(e,c,2):u=()=>(m&&m(),We(e,c,3,[g])):u=qe,t&&s){const L=u;u=()=>Ht(L())}let m,g=L=>{m=T.onStop=()=>{St(L,c,4),m=T.onStop=void 0}},y;if(_s)if(g=qe,t?n&&We(t,c,3,[u(),p?[]:void 0,g]):u(),o==="sync"){const L=il();y=L.__watcherHandles||(L.__watcherHandles=[])}else return qe;let v=p?new Array(e.length).fill(Dn):Dn;const k=()=>{if(!(!T.active||!T.dirty))if(t){const L=T.run();(s||f||(p?L.some((Y,B)=>Ct(Y,v[B])):Ct(L,v)))&&(m&&m(),We(t,c,3,[L,v===Dn?void 0:p&&v[0]===Dn?[]:v,g]),v=L)}else T.run()};k.allowRecurse=!!t;let N;o==="sync"?N=k:o==="post"?N=()=>Fe(k,c&&c.suspense):(k.pre=!0,c&&(k.id=c.uid),N=()=>So(k));const T=new go(u,qe,N),D=xc(),W=()=>{T.stop(),D&&ho(D.effects,T)};return t?n?k():v=T.run():o==="post"?Fe(T.run.bind(T),c&&c.suspense):T.run(),y&&y.push(W),W}function al(e,t,n){const s=this.proxy,o=xe(e)?e.includes(".")?Hi(s,e):()=>s[e]:e.bind(s,s);let r;ee(t)?r=t:(r=t.handler,n=t);const i=An(this),a=zi(o,r.bind(s),n);return i(),a}function Hi(e,t){const n=t.split(".");return()=>{let s=e;for(let o=0;o<n.length&&s;o++)s=s[n[o]];return s}}function Ht(e,t,n=0,s){if(!ge(e)||e.__v_skip)return e;if(t&&t>0){if(n>=t)return e;n++}if(s=s||new Set,s.has(e))return e;if(s.add(e),Be(e))Ht(e.value,t,n,s);else if(G(e))for(let o=0;o<e.length;o++)Ht(e[o],t,n,s);else if(ri(e)||Kt(e))e.forEach(o=>{Ht(o,t,n,s)});else if(ci(e))for(const o in e)Ht(e[o],t,n,s);return e}function Tt(e,t,n,s){const o=e.dirs,r=t&&t.dirs;for(let i=0;i<o.length;i++){const a=o[i];r&&(a.oldValue=r[i].value);let c=a.dir[s];c&&(jt(),We(c,n,8,[e.el,a,e,t]),Dt())}}const _t=Symbol("_leaveCb"),Bn=Symbol("_enterCb");function qi(){const e={isMounted:!1,isLeaving:!1,isUnmounting:!1,leavingVNodes:new Map};return hs(()=>{e.isMounted=!0}),ms(()=>{e.isUnmounting=!0}),e}const He=[Function,Array],Vi={mode:String,appear:Boolean,persisted:Boolean,onBeforeEnter:He,onEnter:He,onAfterEnter:He,onEnterCancelled:He,onBeforeLeave:He,onLeave:He,onAfterLeave:He,onLeaveCancelled:He,onBeforeAppear:He,onAppear:He,onAfterAppear:He,onAppearCancelled:He},cl={name:"BaseTransition",props:Vi,setup(e,{slots:t}){const n=la(),s=qi();let o;return()=>{const r=t.default&&Co(t.default(),!0);if(!r||!r.length)return;let i=r[0];if(r.length>1){for(const y of r)if(y.type!==Ze){i=y;break}}const a=ae(e),{mode:c}=a;if(s.isLeaving)return Ps(i);const l=Qo(i);if(!l)return Ps(i);const u=xn(l,a,s,n);En(l,u);const f=n.subTree,p=f&&Qo(f);let m=!1;const{getTransitionKey:g}=l.type;if(g){const y=g();o===void 0?o=y:y!==o&&(o=y,m=!0)}if(p&&p.type!==Ze&&(!$t(l,p)||m)){const y=xn(p,a,s,n);if(En(p,y),c==="out-in")return s.isLeaving=!0,y.afterLeave=()=>{s.isLeaving=!1,n.update.active!==!1&&(n.effect.dirty=!0,n.update())},Ps(i);c==="in-out"&&l.type!==Ze&&(y.delayLeave=(v,k,N)=>{const T=Ki(s,p);T[String(p.key)]=p,v[_t]=()=>{k(),v[_t]=void 0,delete u.delayedLeave},u.delayedLeave=N})}return i}}},ll=cl;function Ki(e,t){const{leavingVNodes:n}=e;let s=n.get(t.type);return s||(s=Object.create(null),n.set(t.type,s)),s}function xn(e,t,n,s){const{appear:o,mode:r,persisted:i=!1,onBeforeEnter:a,onEnter:c,onAfterEnter:l,onEnterCancelled:u,onBeforeLeave:f,onLeave:p,onAfterLeave:m,onLeaveCancelled:g,onBeforeAppear:y,onAppear:v,onAfterAppear:k,onAppearCancelled:N}=t,T=String(e.key),D=Ki(n,e),W=(B,re)=>{B&&We(B,s,9,re)},L=(B,re)=>{const te=re[1];W(B,re),G(B)?B.every(he=>he.length<=1)&&te():B.length<=1&&te()},Y={mode:r,persisted:i,beforeEnter(B){let re=a;if(!n.isMounted)if(o)re=y||a;else return;B[_t]&&B[_t](!0);const te=D[T];te&&$t(e,te)&&te.el[_t]&&te.el[_t](),W(re,[B])},enter(B){let re=c,te=l,he=u;if(!n.isMounted)if(o)re=v||c,te=k||l,he=N||u;else return;let j=!1;const ne=B[Bn]=J=>{j||(j=!0,J?W(he,[B]):W(te,[B]),Y.delayedLeave&&Y.delayedLeave(),B[Bn]=void 0)};re?L(re,[B,ne]):ne()},leave(B,re){const te=String(e.key);if(B[Bn]&&B[Bn](!0),n.isUnmounting)return re();W(f,[B]);let he=!1;const j=B[_t]=ne=>{he||(he=!0,re(),ne?W(g,[B]):W(m,[B]),B[_t]=void 0,D[te]===e&&delete D[te])};D[te]=e,p?L(p,[B,j]):j()},clone(B){return xn(B,t,n,s)}};return Y}function Ps(e){if(ds(e))return e=Rt(e),e.children=null,e}function Qo(e){return ds(e)?e.children?e.children[0]:void 0:e}function En(e,t){e.shapeFlag&6&&e.component?En(e.component.subTree,t):e.shapeFlag&128?(e.ssContent.transition=t.clone(e.ssContent),e.ssFallback.transition=t.clone(e.ssFallback)):e.transition=t}function Co(e,t=!1,n){let s=[],o=0;for(let r=0;r<e.length;r++){let i=e[r];const a=n==null?i.key:String(n)+String(i.key!=null?i.key:r);i.type===we?(i.patchFlag&128&&o++,s=s.concat(Co(i.children,t,a))):(t||i.type!==Ze)&&s.push(a!=null?Rt(i,{key:a}):i)}if(o>1)for(let r=0;r<s.length;r++)s[r].patchFlag=-2;return s}/*! #__NO_SIDE_EFFECTS__ */function Wi(e,t){return ee(e)?Re({name:e.name},t,{setup:e}):e}const Hn=e=>!!e.type.__asyncLoader,ds=e=>e.type.__isKeepAlive;function ul(e,t){Ji(e,"a",t)}function fl(e,t){Ji(e,"da",t)}function Ji(e,t,n=ke){const s=e.__wdc||(e.__wdc=()=>{let o=n;for(;o;){if(o.isDeactivated)return;o=o.parent}return e()});if(ps(t,s,n),n){let o=n.parent;for(;o&&o.parent;)ds(o.parent.vnode)&&dl(s,t,n,o),o=o.parent}}function dl(e,t,n,s){const o=ps(t,e,s,!0);Yi(()=>{ho(s[t],o)},n)}function ps(e,t,n=ke,s=!1){if(n){const o=n[e]||(n[e]=[]),r=t.__weh||(t.__weh=(...i)=>{if(n.isUnmounted)return;jt();const a=An(n),c=We(t,n,e,i);return a(),Dt(),c});return s?o.unshift(r):o.push(r),r}}const pt=e=>(t,n=ke)=>(!_s||e==="sp")&&ps(e,(...s)=>t(...s),n),pl=pt("bm"),hs=pt("m"),hl=pt("bu"),Gi=pt("u"),ms=pt("bum"),Yi=pt("um"),ml=pt("sp"),gl=pt("rtg"),bl=pt("rtc");function yl(e,t=ke){ps("ec",e,t)}function ft(e,t,n,s){let o;const r=n;if(G(e)||xe(e)){o=new Array(e.length);for(let i=0,a=e.length;i<a;i++)o[i]=t(e[i],i,void 0,r)}else if(typeof e=="number"){o=new Array(e);for(let i=0;i<e;i++)o[i]=t(i+1,i,void 0,r)}else if(ge(e))if(e[Symbol.iterator])o=Array.from(e,(i,a)=>t(i,a,void 0,r));else{const i=Object.keys(e);o=new Array(i.length);for(let a=0,c=i.length;a<c;a++){const l=i[a];o[a]=t(e[l],l,a,r)}}else o=[];return o}const Ys=e=>e?ua(e)?To(e)||e.proxy:Ys(e.parent):null,dn=Re(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>Ys(e.parent),$root:e=>Ys(e.root),$emit:e=>e.emit,$options:e=>Xi(e),$forceUpdate:e=>e.f||(e.f=()=>{e.effect.dirty=!0,So(e.update)}),$nextTick:e=>e.n||(e.n=$i.bind(e.proxy)),$watch:e=>al.bind(e)}),$s=(e,t)=>e!==_e&&!e.__isScriptSetup&&ie(e,t),_l={get({_:e},t){const{ctx:n,setupState:s,data:o,props:r,accessCache:i,type:a,appContext:c}=e;let l;if(t[0]!=="$"){const m=i[t];if(m!==void 0)switch(m){case 1:return s[t];case 2:return o[t];case 4:return n[t];case 3:return r[t]}else{if($s(s,t))return i[t]=1,s[t];if(o!==_e&&ie(o,t))return i[t]=2,o[t];if((l=e.propsOptions[0])&&ie(l,t))return i[t]=3,r[t];if(n!==_e&&ie(n,t))return i[t]=4,n[t];Qs&&(i[t]=0)}}const u=dn[t];let f,p;if(u)return t==="$attrs"&&De(e,"get",t),u(e);if((f=a.__cssModules)&&(f=f[t]))return f;if(n!==_e&&ie(n,t))return i[t]=4,n[t];if(p=c.config.globalProperties,ie(p,t))return p[t]},set({_:e},t,n){const{data:s,setupState:o,ctx:r}=e;return $s(o,t)?(o[t]=n,!0):s!==_e&&ie(s,t)?(s[t]=n,!0):ie(e.props,t)||t[0]==="$"&&t.slice(1)in e?!1:(r[t]=n,!0)},has({_:{data:e,setupState:t,accessCache:n,ctx:s,appContext:o,propsOptions:r}},i){let a;return!!n[i]||e!==_e&&ie(e,i)||$s(t,i)||(a=r[0])&&ie(a,i)||ie(s,i)||ie(dn,i)||ie(o.config.globalProperties,i)},defineProperty(e,t,n){return n.get!=null?e._.accessCache[t]=0:ie(n,"value")&&this.set(e,t,n.value,null),Reflect.defineProperty(e,t,n)}};function Xo(e){return G(e)?e.reduce((t,n)=>(t[n]=null,t),{}):e}let Qs=!0;function vl(e){const t=Xi(e),n=e.proxy,s=e.ctx;Qs=!1,t.beforeCreate&&Zo(t.beforeCreate,e,"bc");const{data:o,computed:r,methods:i,watch:a,provide:c,inject:l,created:u,beforeMount:f,mounted:p,beforeUpdate:m,updated:g,activated:y,deactivated:v,beforeDestroy:k,beforeUnmount:N,destroyed:T,unmounted:D,render:W,renderTracked:L,renderTriggered:Y,errorCaptured:B,serverPrefetch:re,expose:te,inheritAttrs:he,components:j,directives:ne,filters:J}=t;if(l&&wl(l,s,null),i)for(const F in i){const z=i[F];ee(z)&&(s[F]=z.bind(n))}if(o){const F=o.call(n,n);ge(F)&&(e.data=Tn(F))}if(Qs=!0,r)for(const F in r){const z=r[F],ce=ee(z)?z.bind(n,n):ee(z.get)?z.get.bind(n,n):qe,Te=!ee(z)&&ee(z.set)?z.set.bind(n):qe,pe=ye({get:ce,set:Te});Object.defineProperty(s,F,{enumerable:!0,configurable:!0,get:()=>pe.value,set:be=>pe.value=be})}if(a)for(const F in a)Qi(a[F],s,n,F);if(c){const F=ee(c)?c.call(n):c;Reflect.ownKeys(F).forEach(z=>{qn(z,F[z])})}u&&Zo(u,e,"c");function q(F,z){G(z)?z.forEach(ce=>F(ce.bind(n))):z&&F(z.bind(n))}if(q(pl,f),q(hs,p),q(hl,m),q(Gi,g),q(ul,y),q(fl,v),q(yl,B),q(bl,L),q(gl,Y),q(ms,N),q(Yi,D),q(ml,re),G(te))if(te.length){const F=e.exposed||(e.exposed={});te.forEach(z=>{Object.defineProperty(F,z,{get:()=>n[z],set:ce=>n[z]=ce})})}else e.exposed||(e.exposed={});W&&e.render===qe&&(e.render=W),he!=null&&(e.inheritAttrs=he),j&&(e.components=j),ne&&(e.directives=ne)}function wl(e,t,n=qe){G(e)&&(e=Xs(e));for(const s in e){const o=e[s];let r;ge(o)?"default"in o?r=Xe(o.from||s,o.default,!0):r=Xe(o.from||s):r=Xe(o),Be(r)?Object.defineProperty(t,s,{enumerable:!0,configurable:!0,get:()=>r.value,set:i=>r.value=i}):t[s]=r}}function Zo(e,t,n){We(G(e)?e.map(s=>s.bind(t.proxy)):e.bind(t.proxy),t,n)}function Qi(e,t,n,s){const o=s.includes(".")?Hi(n,s):()=>n[s];if(xe(e)){const r=t[e];ee(r)&&fn(o,r)}else if(ee(e))fn(o,e.bind(n));else if(ge(e))if(G(e))e.forEach(r=>Qi(r,t,n,s));else{const r=ee(e.handler)?e.handler.bind(n):t[e.handler];ee(r)&&fn(o,r,e)}}function Xi(e){const t=e.type,{mixins:n,extends:s}=t,{mixins:o,optionsCache:r,config:{optionMergeStrategies:i}}=e.appContext,a=r.get(t);let c;return a?c=a:!o.length&&!n&&!s?c=t:(c={},o.length&&o.forEach(l=>Zn(c,l,i,!0)),Zn(c,t,i)),ge(t)&&r.set(t,c),c}function Zn(e,t,n,s=!1){const{mixins:o,extends:r}=t;r&&Zn(e,r,n,!0),o&&o.forEach(i=>Zn(e,i,n,!0));for(const i in t)if(!(s&&i==="expose")){const a=xl[i]||n&&n[i];e[i]=a?a(e[i],t[i]):t[i]}return e}const xl={data:er,props:tr,emits:tr,methods:ln,computed:ln,beforeCreate:Ne,created:Ne,beforeMount:Ne,mounted:Ne,beforeUpdate:Ne,updated:Ne,beforeDestroy:Ne,beforeUnmount:Ne,destroyed:Ne,unmounted:Ne,activated:Ne,deactivated:Ne,errorCaptured:Ne,serverPrefetch:Ne,components:ln,directives:ln,watch:Sl,provide:er,inject:El};function er(e,t){return t?e?function(){return Re(ee(e)?e.call(this,this):e,ee(t)?t.call(this,this):t)}:t:e}function El(e,t){return ln(Xs(e),Xs(t))}function Xs(e){if(G(e)){const t={};for(let n=0;n<e.length;n++)t[e[n]]=e[n];return t}return e}function Ne(e,t){return e?[...new Set([].concat(e,t))]:t}function ln(e,t){return e?Re(Object.create(null),e,t):t}function tr(e,t){return e?G(e)&&G(t)?[...new Set([...e,...t])]:Re(Object.create(null),Xo(e),Xo(t??{})):t}function Sl(e,t){if(!e)return t;if(!t)return e;const n=Re(Object.create(null),e);for(const s in t)n[s]=Ne(e[s],t[s]);return n}function Zi(){return{app:null,config:{isNativeTag:ac,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let Cl=0;function Rl(e,t){return function(s,o=null){ee(s)||(s=Re({},s)),o!=null&&!ge(o)&&(o=null);const r=Zi(),i=new WeakSet;let a=!1;const c=r.app={_uid:Cl++,_component:s,_props:o,_container:null,_context:r,_instance:null,version:Yl,get config(){return r.config},set config(l){},use(l,...u){return i.has(l)||(l&&ee(l.install)?(i.add(l),l.install(c,...u)):ee(l)&&(i.add(l),l(c,...u))),c},mixin(l){return r.mixins.includes(l)||r.mixins.push(l),c},component(l,u){return u?(r.components[l]=u,c):r.components[l]},directive(l,u){return u?(r.directives[l]=u,c):r.directives[l]},mount(l,u,f){if(!a){const p=me(s,o);return p.appContext=r,f===!0?f="svg":f===!1&&(f=void 0),e(p,l,f),a=!0,c._container=l,l.__vue_app__=c,To(p.component)||p.component.proxy}},unmount(){a&&(e(null,c._container),delete c._container.__vue_app__)},provide(l,u){return r.provides[l]=u,c},runWithContext(l){const u=pn;pn=c;try{return l()}finally{pn=u}}};return c}}let pn=null;function qn(e,t){if(ke){let n=ke.provides;const s=ke.parent&&ke.parent.provides;s===n&&(n=ke.provides=Object.create(s)),n[e]=t}}function Xe(e,t,n=!1){const s=ke||Ke;if(s||pn){const o=s?s.parent==null?s.vnode.appContext&&s.vnode.appContext.provides:s.parent.provides:pn._context.provides;if(o&&e in o)return o[e];if(arguments.length>1)return n&&ee(t)?t.call(s&&s.proxy):t}}function kl(e,t,n,s=!1){const o={},r={};Yn(r,bs,1),e.propsDefaults=Object.create(null),ea(e,t,o,r);for(const i in e.propsOptions[0])i in o||(o[i]=void 0);n?e.props=s?o:Ei(o):e.type.props?e.props=o:e.props=r,e.attrs=r}function Tl(e,t,n,s){const{props:o,attrs:r,vnode:{patchFlag:i}}=e,a=ae(o),[c]=e.propsOptions;let l=!1;if((s||i>0)&&!(i&16)){if(i&8){const u=e.vnode.dynamicProps;for(let f=0;f<u.length;f++){let p=u[f];if(ls(e.emitsOptions,p))continue;const m=t[p];if(c)if(ie(r,p))m!==r[p]&&(r[p]=m,l=!0);else{const g=ct(p);o[g]=Zs(c,a,g,m,e,!1)}else m!==r[p]&&(r[p]=m,l=!0)}}}else{ea(e,t,o,r)&&(l=!0);let u;for(const f in a)(!t||!ie(t,f)&&((u=tn(f))===f||!ie(t,u)))&&(c?n&&(n[f]!==void 0||n[u]!==void 0)&&(o[f]=Zs(c,a,f,void 0,e,!0)):delete o[f]);if(r!==a)for(const f in r)(!t||!ie(t,f))&&(delete r[f],l=!0)}l&&dt(e,"set","$attrs")}function ea(e,t,n,s){const[o,r]=e.propsOptions;let i=!1,a;if(t)for(let c in t){if(un(c))continue;const l=t[c];let u;o&&ie(o,u=ct(c))?!r||!r.includes(u)?n[u]=l:(a||(a={}))[u]=l:ls(e.emitsOptions,c)||(!(c in s)||l!==s[c])&&(s[c]=l,i=!0)}if(r){const c=ae(n),l=a||_e;for(let u=0;u<r.length;u++){const f=r[u];n[f]=Zs(o,c,f,l[f],e,!ie(l,f))}}return i}function Zs(e,t,n,s,o,r){const i=e[n];if(i!=null){const a=ie(i,"default");if(a&&s===void 0){const c=i.default;if(i.type!==Function&&!i.skipFactory&&ee(c)){const{propsDefaults:l}=o;if(n in l)s=l[n];else{const u=An(o);s=l[n]=c.call(null,t),u()}}else s=c}i[0]&&(r&&!a?s=!1:i[1]&&(s===""||s===tn(n))&&(s=!0))}return s}function ta(e,t,n=!1){const s=t.propsCache,o=s.get(e);if(o)return o;const r=e.props,i={},a=[];let c=!1;if(!ee(e)){const u=f=>{c=!0;const[p,m]=ta(f,t,!0);Re(i,p),m&&a.push(...m)};!n&&t.mixins.length&&t.mixins.forEach(u),e.extends&&u(e.extends),e.mixins&&e.mixins.forEach(u)}if(!r&&!c)return ge(e)&&s.set(e,Vt),Vt;if(G(r))for(let u=0;u<r.length;u++){const f=ct(r[u]);nr(f)&&(i[f]=_e)}else if(r)for(const u in r){const f=ct(u);if(nr(f)){const p=r[u],m=i[f]=G(p)||ee(p)?{type:p}:Re({},p);if(m){const g=rr(Boolean,m.type),y=rr(String,m.type);m[0]=g>-1,m[1]=y<0||g<y,(g>-1||ie(m,"default"))&&a.push(f)}}}const l=[i,a];return ge(e)&&s.set(e,l),l}function nr(e){return e[0]!=="$"&&!un(e)}function sr(e){return e===null?"null":typeof e=="function"?e.name||"":typeof e=="object"&&e.constructor&&e.constructor.name||""}function or(e,t){return sr(e)===sr(t)}function rr(e,t){return G(t)?t.findIndex(n=>or(n,e)):ee(t)&&or(t,e)?0:-1}const na=e=>e[0]==="_"||e==="$stable",Ro=e=>G(e)?e.map(it):[it(e)],Al=(e,t,n)=>{if(t._n)return t;const s=Ie((...o)=>Ro(t(...o)),n);return s._c=!1,s},sa=(e,t,n)=>{const s=e._ctx;for(const o in e){if(na(o))continue;const r=e[o];if(ee(r))t[o]=Al(o,r,s);else if(r!=null){const i=Ro(r);t[o]=()=>i}}},oa=(e,t)=>{const n=Ro(t);e.slots.default=()=>n},Ol=(e,t)=>{if(e.vnode.shapeFlag&32){const n=t._;n?(e.slots=ae(t),Yn(t,"_",n)):sa(t,e.slots={})}else e.slots={},t&&oa(e,t);Yn(e.slots,bs,1)},Pl=(e,t,n)=>{const{vnode:s,slots:o}=e;let r=!0,i=_e;if(s.shapeFlag&32){const a=t._;a?n&&a===1?r=!1:(Re(o,t),!n&&a===1&&delete o._):(r=!t.$stable,sa(t,o)),i=t}else t&&(oa(e,t),i={default:1});if(r)for(const a in o)!na(a)&&i[a]==null&&delete o[a]};function eo(e,t,n,s,o=!1){if(G(e)){e.forEach((p,m)=>eo(p,t&&(G(t)?t[m]:t),n,s,o));return}if(Hn(s)&&!o)return;const r=s.shapeFlag&4?To(s.component)||s.component.proxy:s.el,i=o?null:r,{i:a,r:c}=e,l=t&&t.r,u=a.refs===_e?a.refs={}:a.refs,f=a.setupState;if(l!=null&&l!==c&&(xe(l)?(u[l]=null,ie(f,l)&&(f[l]=null)):Be(l)&&(l.value=null)),ee(c))St(c,a,12,[i,u]);else{const p=xe(c),m=Be(c);if(p||m){const g=()=>{if(e.f){const y=p?ie(f,c)?f[c]:u[c]:c.value;o?G(y)&&ho(y,r):G(y)?y.includes(r)||y.push(r):p?(u[c]=[r],ie(f,c)&&(f[c]=u[c])):(c.value=[r],e.k&&(u[e.k]=c.value))}else p?(u[c]=i,ie(f,c)&&(f[c]=i)):m&&(c.value=i,e.k&&(u[e.k]=i))};i?(g.id=-1,Fe(g,n)):g()}}}const Fe=ol;function $l(e){return Nl(e)}function Nl(e,t){const n=li();n.__VUE__=!0;const{insert:s,remove:o,patchProp:r,createElement:i,createText:a,createComment:c,setText:l,setElementText:u,parentNode:f,nextSibling:p,setScopeId:m=qe,insertStaticContent:g}=e,y=(d,h,b,x=null,S=null,C=null,$=void 0,A=null,O=!!h.dynamicChildren)=>{if(d===h)return;d&&!$t(d,h)&&(x=E(d),be(d,S,C,!0),d=null),h.patchFlag===-2&&(O=!1,h.dynamicChildren=null);const{type:R,ref:M,shapeFlag:V}=h;switch(R){case gs:v(d,h,b,x);break;case Ze:k(d,h,b,x);break;case Vn:d==null&&N(h,b,x,$);break;case we:j(d,h,b,x,S,C,$,A,O);break;default:V&1?W(d,h,b,x,S,C,$,A,O):V&6?ne(d,h,b,x,S,C,$,A,O):(V&64||V&128)&&R.process(d,h,b,x,S,C,$,A,O,U)}M!=null&&S&&eo(M,d&&d.ref,C,h||d,!h)},v=(d,h,b,x)=>{if(d==null)s(h.el=a(h.children),b,x);else{const S=h.el=d.el;h.children!==d.children&&l(S,h.children)}},k=(d,h,b,x)=>{d==null?s(h.el=c(h.children||""),b,x):h.el=d.el},N=(d,h,b,x)=>{[d.el,d.anchor]=g(d.children,h,b,x,d.el,d.anchor)},T=({el:d,anchor:h},b,x)=>{let S;for(;d&&d!==h;)S=p(d),s(d,b,x),d=S;s(h,b,x)},D=({el:d,anchor:h})=>{let b;for(;d&&d!==h;)b=p(d),o(d),d=b;o(h)},W=(d,h,b,x,S,C,$,A,O)=>{h.type==="svg"?$="svg":h.type==="math"&&($="mathml"),d==null?L(h,b,x,S,C,$,A,O):re(d,h,S,C,$,A,O)},L=(d,h,b,x,S,C,$,A)=>{let O,R;const{props:M,shapeFlag:V,transition:H,dirs:Q}=d;if(O=d.el=i(d.type,C,M&&M.is,M),V&8?u(O,d.children):V&16&&B(d.children,O,null,x,S,Ns(d,C),$,A),Q&&Tt(d,null,x,"created"),Y(O,d,d.scopeId,$,x),M){for(const fe in M)fe!=="value"&&!un(fe)&&r(O,fe,null,M[fe],C,d.children,x,S,Ae);"value"in M&&r(O,"value",null,M.value,C),(R=M.onVnodeBeforeMount)&&st(R,x,d)}Q&&Tt(d,null,x,"beforeMount");const oe=Ll(S,H);oe&&H.beforeEnter(O),s(O,h,b),((R=M&&M.onVnodeMounted)||oe||Q)&&Fe(()=>{R&&st(R,x,d),oe&&H.enter(O),Q&&Tt(d,null,x,"mounted")},S)},Y=(d,h,b,x,S)=>{if(b&&m(d,b),x)for(let C=0;C<x.length;C++)m(d,x[C]);if(S){let C=S.subTree;if(h===C){const $=S.vnode;Y(d,$,$.scopeId,$.slotScopeIds,S.parent)}}},B=(d,h,b,x,S,C,$,A,O=0)=>{for(let R=O;R<d.length;R++){const M=d[R]=A?vt(d[R]):it(d[R]);y(null,M,h,b,x,S,C,$,A)}},re=(d,h,b,x,S,C,$)=>{const A=h.el=d.el;let{patchFlag:O,dynamicChildren:R,dirs:M}=h;O|=d.patchFlag&16;const V=d.props||_e,H=h.props||_e;let Q;if(b&&At(b,!1),(Q=H.onVnodeBeforeUpdate)&&st(Q,b,h,d),M&&Tt(h,d,b,"beforeUpdate"),b&&At(b,!0),R?te(d.dynamicChildren,R,A,b,x,Ns(h,S),C):$||z(d,h,A,null,b,x,Ns(h,S),C,!1),O>0){if(O&16)he(A,h,V,H,b,x,S);else if(O&2&&V.class!==H.class&&r(A,"class",null,H.class,S),O&4&&r(A,"style",V.style,H.style,S),O&8){const oe=h.dynamicProps;for(let fe=0;fe<oe.length;fe++){const ve=oe[fe],$e=V[ve],Ge=H[ve];(Ge!==$e||ve==="value")&&r(A,ve,$e,Ge,S,d.children,b,x,Ae)}}O&1&&d.children!==h.children&&u(A,h.children)}else!$&&R==null&&he(A,h,V,H,b,x,S);((Q=H.onVnodeUpdated)||M)&&Fe(()=>{Q&&st(Q,b,h,d),M&&Tt(h,d,b,"updated")},x)},te=(d,h,b,x,S,C,$)=>{for(let A=0;A<h.length;A++){const O=d[A],R=h[A],M=O.el&&(O.type===we||!$t(O,R)||O.shapeFlag&70)?f(O.el):b;y(O,R,M,null,x,S,C,$,!0)}},he=(d,h,b,x,S,C,$)=>{if(b!==x){if(b!==_e)for(const A in b)!un(A)&&!(A in x)&&r(d,A,b[A],null,$,h.children,S,C,Ae);for(const A in x){if(un(A))continue;const O=x[A],R=b[A];O!==R&&A!=="value"&&r(d,A,R,O,$,h.children,S,C,Ae)}"value"in x&&r(d,"value",b.value,x.value,$)}},j=(d,h,b,x,S,C,$,A,O)=>{const R=h.el=d?d.el:a(""),M=h.anchor=d?d.anchor:a("");let{patchFlag:V,dynamicChildren:H,slotScopeIds:Q}=h;Q&&(A=A?A.concat(Q):Q),d==null?(s(R,b,x),s(M,b,x),B(h.children||[],b,M,S,C,$,A,O)):V>0&&V&64&&H&&d.dynamicChildren?(te(d.dynamicChildren,H,b,S,C,$,A),(h.key!=null||S&&h===S.subTree)&&ra(d,h,!0)):z(d,h,b,M,S,C,$,A,O)},ne=(d,h,b,x,S,C,$,A,O)=>{h.slotScopeIds=A,d==null?h.shapeFlag&512?S.ctx.activate(h,b,x,$,O):J(h,b,x,S,C,$,O):se(d,h,O)},J=(d,h,b,x,S,C,$)=>{const A=d.component=Hl(d,x,S);if(ds(d)&&(A.ctx.renderer=U),ql(A),A.asyncDep){if(S&&S.registerDep(A,q),!d.el){const O=A.subTree=me(Ze);k(null,O,h,b)}}else q(A,d,h,b,S,C,$)},se=(d,h,b)=>{const x=h.component=d.component;if(el(d,h,b))if(x.asyncDep&&!x.asyncResolved){F(x,h,b);return}else x.next=h,Jc(x.update),x.effect.dirty=!0,x.update();else h.el=d.el,x.vnode=h},q=(d,h,b,x,S,C,$)=>{const A=()=>{if(d.isMounted){let{next:M,bu:V,u:H,parent:Q,vnode:oe}=d;{const Ut=ia(d);if(Ut){M&&(M.el=oe.el,F(d,M,$)),Ut.asyncDep.then(()=>{d.isUnmounted||A()});return}}let fe=M,ve;At(d,!1),M?(M.el=oe.el,F(d,M,$)):M=oe,V&&As(V),(ve=M.props&&M.props.onVnodeBeforeUpdate)&&st(ve,Q,M,oe),At(d,!0);const $e=Jo(d),Ge=d.subTree;d.subTree=$e,y(Ge,$e,f(Ge.el),E(Ge),d,S,C),M.el=$e.el,fe===null&&tl(d,$e.el),H&&Fe(H,S),(ve=M.props&&M.props.onVnodeUpdated)&&Fe(()=>st(ve,Q,M,oe),S)}else{let M;const{el:V,props:H}=h,{bm:Q,m:oe,parent:fe}=d,ve=Hn(h);At(d,!1),Q&&As(Q),!ve&&(M=H&&H.onVnodeBeforeMount)&&st(M,fe,h),At(d,!0);{const $e=d.subTree=Jo(d);y(null,$e,b,x,d,S,C),h.el=$e.el}if(oe&&Fe(oe,S),!ve&&(M=H&&H.onVnodeMounted)){const $e=h;Fe(()=>st(M,fe,$e),S)}(h.shapeFlag&256||fe&&Hn(fe.vnode)&&fe.vnode.shapeFlag&256)&&d.a&&Fe(d.a,S),d.isMounted=!0,h=b=x=null}},O=d.effect=new go(A,qe,()=>So(R),d.scope),R=d.update=()=>{O.dirty&&O.run()};R.id=d.uid,At(d,!0),R()},F=(d,h,b)=>{h.component=d;const x=d.vnode.props;d.vnode=h,d.next=null,Tl(d,h.props,x,b),Pl(d,h.children,b),jt(),Wo(d),Dt()},z=(d,h,b,x,S,C,$,A,O=!1)=>{const R=d&&d.children,M=d?d.shapeFlag:0,V=h.children,{patchFlag:H,shapeFlag:Q}=h;if(H>0){if(H&128){Te(R,V,b,x,S,C,$,A,O);return}else if(H&256){ce(R,V,b,x,S,C,$,A,O);return}}Q&8?(M&16&&Ae(R,S,C),V!==R&&u(b,V)):M&16?Q&16?Te(R,V,b,x,S,C,$,A,O):Ae(R,S,C,!0):(M&8&&u(b,""),Q&16&&B(V,b,x,S,C,$,A,O))},ce=(d,h,b,x,S,C,$,A,O)=>{d=d||Vt,h=h||Vt;const R=d.length,M=h.length,V=Math.min(R,M);let H;for(H=0;H<V;H++){const Q=h[H]=O?vt(h[H]):it(h[H]);y(d[H],Q,b,null,S,C,$,A,O)}R>M?Ae(d,S,C,!0,!1,V):B(h,b,x,S,C,$,A,O,V)},Te=(d,h,b,x,S,C,$,A,O)=>{let R=0;const M=h.length;let V=d.length-1,H=M-1;for(;R<=V&&R<=H;){const Q=d[R],oe=h[R]=O?vt(h[R]):it(h[R]);if($t(Q,oe))y(Q,oe,b,null,S,C,$,A,O);else break;R++}for(;R<=V&&R<=H;){const Q=d[V],oe=h[H]=O?vt(h[H]):it(h[H]);if($t(Q,oe))y(Q,oe,b,null,S,C,$,A,O);else break;V--,H--}if(R>V){if(R<=H){const Q=H+1,oe=Q<M?h[Q].el:x;for(;R<=H;)y(null,h[R]=O?vt(h[R]):it(h[R]),b,oe,S,C,$,A,O),R++}}else if(R>H)for(;R<=V;)be(d[R],S,C,!0),R++;else{const Q=R,oe=R,fe=new Map;for(R=oe;R<=H;R++){const ze=h[R]=O?vt(h[R]):it(h[R]);ze.key!=null&&fe.set(ze.key,R)}let ve,$e=0;const Ge=H-oe+1;let Ut=!1,Io=0;const on=new Array(Ge);for(R=0;R<Ge;R++)on[R]=0;for(R=Q;R<=V;R++){const ze=d[R];if($e>=Ge){be(ze,S,C,!0);continue}let nt;if(ze.key!=null)nt=fe.get(ze.key);else for(ve=oe;ve<=H;ve++)if(on[ve-oe]===0&&$t(ze,h[ve])){nt=ve;break}nt===void 0?be(ze,S,C,!0):(on[nt-oe]=R+1,nt>=Io?Io=nt:Ut=!0,y(ze,h[nt],b,null,S,C,$,A,O),$e++)}const Mo=Ut?Fl(on):Vt;for(ve=Mo.length-1,R=Ge-1;R>=0;R--){const ze=oe+R,nt=h[ze],jo=ze+1<M?h[ze+1].el:x;on[R]===0?y(null,nt,b,jo,S,C,$,A,O):Ut&&(ve<0||R!==Mo[ve]?pe(nt,b,jo,2):ve--)}}},pe=(d,h,b,x,S=null)=>{const{el:C,type:$,transition:A,children:O,shapeFlag:R}=d;if(R&6){pe(d.component.subTree,h,b,x);return}if(R&128){d.suspense.move(h,b,x);return}if(R&64){$.move(d,h,b,U);return}if($===we){s(C,h,b);for(let V=0;V<O.length;V++)pe(O[V],h,b,x);s(d.anchor,h,b);return}if($===Vn){T(d,h,b);return}if(x!==2&&R&1&&A)if(x===0)A.beforeEnter(C),s(C,h,b),Fe(()=>A.enter(C),S);else{const{leave:V,delayLeave:H,afterLeave:Q}=A,oe=()=>s(C,h,b),fe=()=>{V(C,()=>{oe(),Q&&Q()})};H?H(C,oe,fe):fe()}else s(C,h,b)},be=(d,h,b,x=!1,S=!1)=>{const{type:C,props:$,ref:A,children:O,dynamicChildren:R,shapeFlag:M,patchFlag:V,dirs:H}=d;if(A!=null&&eo(A,null,b,d,!0),M&256){h.ctx.deactivate(d);return}const Q=M&1&&H,oe=!Hn(d);let fe;if(oe&&(fe=$&&$.onVnodeBeforeUnmount)&&st(fe,h,d),M&6)kt(d.component,b,x);else{if(M&128){d.suspense.unmount(b,x);return}Q&&Tt(d,null,h,"beforeUnmount"),M&64?d.type.remove(d,h,b,S,U,x):R&&(C!==we||V>0&&V&64)?Ae(R,h,b,!1,!0):(C===we&&V&384||!S&&M&16)&&Ae(O,h,b),x&&Ue(d)}(oe&&(fe=$&&$.onVnodeUnmounted)||Q)&&Fe(()=>{fe&&st(fe,h,d),Q&&Tt(d,null,h,"unmounted")},b)},Ue=d=>{const{type:h,el:b,anchor:x,transition:S}=d;if(h===we){Je(b,x);return}if(h===Vn){D(d);return}const C=()=>{o(b),S&&!S.persisted&&S.afterLeave&&S.afterLeave()};if(d.shapeFlag&1&&S&&!S.persisted){const{leave:$,delayLeave:A}=S,O=()=>$(b,C);A?A(d.el,C,O):O()}else C()},Je=(d,h)=>{let b;for(;d!==h;)b=p(d),o(d),d=b;o(h)},kt=(d,h,b)=>{const{bum:x,scope:S,update:C,subTree:$,um:A}=d;x&&As(x),S.stop(),C&&(C.active=!1,be($,d,h,b)),A&&Fe(A,h),Fe(()=>{d.isUnmounted=!0},h),h&&h.pendingBranch&&!h.isUnmounted&&d.asyncDep&&!d.asyncResolved&&d.suspenseId===h.pendingId&&(h.deps--,h.deps===0&&h.resolve())},Ae=(d,h,b,x=!1,S=!1,C=0)=>{for(let $=C;$<d.length;$++)be(d[$],h,b,x,S)},E=d=>d.shapeFlag&6?E(d.component.subTree):d.shapeFlag&128?d.suspense.next():p(d.anchor||d.el);let I=!1;const P=(d,h,b)=>{d==null?h._vnode&&be(h._vnode,null,null,!0):y(h._vnode||null,d,h,null,null,null,b),I||(I=!0,Wo(),Li(),I=!1),h._vnode=d},U={p:y,um:be,m:pe,r:Ue,mt:J,mc:B,pc:z,pbc:te,n:E,o:e};return{render:P,hydrate:void 0,createApp:Rl(P)}}function Ns({type:e,props:t},n){return n==="svg"&&e==="foreignObject"||n==="mathml"&&e==="annotation-xml"&&t&&t.encoding&&t.encoding.includes("html")?void 0:n}function At({effect:e,update:t},n){e.allowRecurse=t.allowRecurse=n}function Ll(e,t){return(!e||e&&!e.pendingBranch)&&t&&!t.persisted}function ra(e,t,n=!1){const s=e.children,o=t.children;if(G(s)&&G(o))for(let r=0;r<s.length;r++){const i=s[r];let a=o[r];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=o[r]=vt(o[r]),a.el=i.el),n||ra(i,a)),a.type===gs&&(a.el=i.el)}}function Fl(e){const t=e.slice(),n=[0];let s,o,r,i,a;const c=e.length;for(s=0;s<c;s++){const l=e[s];if(l!==0){if(o=n[n.length-1],e[o]<l){t[s]=o,n.push(s);continue}for(r=0,i=n.length-1;r<i;)a=r+i>>1,e[n[a]]<l?r=a+1:i=a;l<e[n[r]]&&(r>0&&(t[s]=n[r-1]),n[r]=s)}}for(r=n.length,i=n[r-1];r-- >0;)n[r]=i,i=t[i];return n}function ia(e){const t=e.subTree.component;if(t)return t.asyncDep&&!t.asyncResolved?t:ia(t)}const Il=e=>e.__isTeleport,we=Symbol.for("v-fgt"),gs=Symbol.for("v-txt"),Ze=Symbol.for("v-cmt"),Vn=Symbol.for("v-stc"),hn=[];let Qe=null;function K(e=!1){hn.push(Qe=e?null:[])}function Ml(){hn.pop(),Qe=hn[hn.length-1]||null}let Sn=1;function ir(e){Sn+=e}function aa(e){return e.dynamicChildren=Sn>0?Qe||Vt:null,Ml(),Sn>0&&Qe&&Qe.push(e),e}function X(e,t,n,s,o,r){return aa(w(e,t,n,s,o,r,!0))}function Cn(e,t,n,s,o){return aa(me(e,t,n,s,o,!0))}function to(e){return e?e.__v_isVNode===!0:!1}function $t(e,t){return e.type===t.type&&e.key===t.key}const bs="__vInternal",ca=({key:e})=>e??null,Kn=({ref:e,ref_key:t,ref_for:n})=>(typeof e=="number"&&(e=""+e),e!=null?xe(e)||Be(e)||ee(e)?{i:Ke,r:e,k:t,f:!!n}:e:null);function w(e,t=null,n=null,s=0,o=null,r=e===we?0:1,i=!1,a=!1){const c={__v_isVNode:!0,__v_skip:!0,type:e,props:t,key:t&&ca(t),ref:t&&Kn(t),scopeId:us,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetAnchor:null,staticCount:0,shapeFlag:r,patchFlag:s,dynamicProps:o,dynamicChildren:null,appContext:null,ctx:Ke};return a?(ko(c,n),r&128&&e.normalize(c)):n&&(c.shapeFlag|=xe(n)?8:16),Sn>0&&!i&&Qe&&(c.patchFlag>0||r&6)&&c.patchFlag!==32&&Qe.push(c),c}const me=jl;function jl(e,t=null,n=null,s=0,o=null,r=!1){if((!e||e===Bi)&&(e=Ze),to(e)){const a=Rt(e,t,!0);return n&&ko(a,n),Sn>0&&!r&&Qe&&(a.shapeFlag&6?Qe[Qe.indexOf(e)]=a:Qe.push(a)),a.patchFlag|=-2,a}if(Gl(e)&&(e=e.__vccOpts),t){t=Dl(t);let{class:a,style:c}=t;a&&!xe(a)&&(t.class=yn(a)),ge(c)&&(Ci(c)&&!G(c)&&(c=Re({},c)),t.style=bn(c))}const i=xe(e)?1:sl(e)?128:Il(e)?64:ge(e)?4:ee(e)?2:0;return w(e,t,n,s,o,i,r,!0)}function Dl(e){return e?Ci(e)||bs in e?Re({},e):e:null}function Rt(e,t,n=!1){const{props:s,ref:o,patchFlag:r,children:i}=e,a=t?Bl(s||{},t):s;return{__v_isVNode:!0,__v_skip:!0,type:e.type,props:a,key:a&&ca(a),ref:t&&t.ref?n&&o?G(o)?o.concat(Kn(t)):[o,Kn(t)]:Kn(t):o,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:i,target:e.target,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:t&&e.type!==we?r===-1?16:r|16:r,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:e.transition,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&Rt(e.ssContent),ssFallback:e.ssFallback&&Rt(e.ssFallback),el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce}}function qt(e=" ",t=0){return me(gs,null,e,t)}function ys(e,t){const n=me(Vn,null,e);return n.staticCount=t,n}function rt(e="",t=!1){return t?(K(),Cn(Ze,null,e)):me(Ze,null,e)}function it(e){return e==null||typeof e=="boolean"?me(Ze):G(e)?me(we,null,e.slice()):typeof e=="object"?vt(e):me(gs,null,String(e))}function vt(e){return e.el===null&&e.patchFlag!==-1||e.memo?e:Rt(e)}function ko(e,t){let n=0;const{shapeFlag:s}=e;if(t==null)t=null;else if(G(t))n=16;else if(typeof t=="object")if(s&65){const o=t.default;o&&(o._c&&(o._d=!1),ko(e,o()),o._c&&(o._d=!0));return}else{n=32;const o=t._;!o&&!(bs in t)?t._ctx=Ke:o===3&&Ke&&(Ke.slots._===1?t._=1:(t._=2,e.patchFlag|=1024))}else ee(t)?(t={default:t,_ctx:Ke},n=32):(t=String(t),s&64?(n=16,t=[qt(t)]):n=8);e.children=t,e.shapeFlag|=n}function Bl(...e){const t={};for(let n=0;n<e.length;n++){const s=e[n];for(const o in s)if(o==="class")t.class!==s.class&&(t.class=yn([t.class,s.class]));else if(o==="style")t.style=bn([t.style,s.style]);else if(ss(o)){const r=t[o],i=s[o];i&&r!==i&&!(G(r)&&r.includes(i))&&(t[o]=r?[].concat(r,i):i)}else o!==""&&(t[o]=s[o])}return t}function st(e,t,n,s=null){We(e,t,7,[n,s])}const Ul=Zi();let zl=0;function Hl(e,t,n){const s=e.type,o=(t?t.appContext:e.appContext)||Ul,r={uid:zl++,vnode:e,type:s,parent:t,appContext:o,root:null,next:null,subTree:null,effect:null,update:null,scope:new vc(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:t?t.provides:Object.create(o.provides),accessCache:null,renderCache:[],components:null,directives:null,propsOptions:ta(s,o),emitsOptions:Ii(s,o),emit:null,emitted:null,propsDefaults:_e,inheritAttrs:s.inheritAttrs,ctx:_e,data:_e,props:_e,attrs:_e,slots:_e,refs:_e,setupState:_e,setupContext:null,attrsProxy:null,slotsProxy:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return r.ctx={_:r},r.root=t?t.root:r,r.emit=Qc.bind(null,r),e.ce&&e.ce(r),r}let ke=null;const la=()=>ke||Ke;let es,no;{const e=li(),t=(n,s)=>{let o;return(o=e[n])||(o=e[n]=[]),o.push(s),r=>{o.length>1?o.forEach(i=>i(r)):o[0](r)}};es=t("__VUE_INSTANCE_SETTERS__",n=>ke=n),no=t("__VUE_SSR_SETTERS__",n=>_s=n)}const An=e=>{const t=ke;return es(e),e.scope.on(),()=>{e.scope.off(),es(t)}},ar=()=>{ke&&ke.scope.off(),es(null)};function ua(e){return e.vnode.shapeFlag&4}let _s=!1;function ql(e,t=!1){t&&no(t);const{props:n,children:s}=e.vnode,o=ua(e);kl(e,n,o,t),Ol(e,s);const r=o?Vl(e,t):void 0;return t&&no(!1),r}function Vl(e,t){const n=e.type;e.accessCache=Object.create(null),e.proxy=Ri(new Proxy(e.ctx,_l));const{setup:s}=n;if(s){const o=e.setupContext=s.length>1?Wl(e):null,r=An(e);jt();const i=St(s,e,0,[e.props,o]);if(Dt(),r(),ii(i)){if(i.then(ar,ar),t)return i.then(a=>{cr(e,a)}).catch(a=>{cs(a,e,0)});e.asyncDep=i}else cr(e,i)}else fa(e)}function cr(e,t,n){ee(t)?e.type.__ssrInlineRender?e.ssrRender=t:e.render=t:ge(t)&&(e.setupState=Oi(t)),fa(e)}function fa(e,t,n){const s=e.type;e.render||(e.render=s.render||qe);{const o=An(e);jt();try{vl(e)}finally{Dt(),o()}}}function Kl(e){return e.attrsProxy||(e.attrsProxy=new Proxy(e.attrs,{get(t,n){return De(e,"get","$attrs"),t[n]}}))}function Wl(e){const t=n=>{e.exposed=n||{}};return{get attrs(){return Kl(e)},slots:e.slots,emit:e.emit,expose:t}}function To(e){if(e.exposed)return e.exposeProxy||(e.exposeProxy=new Proxy(Oi(Ri(e.exposed)),{get(t,n){if(n in t)return t[n];if(n in dn)return dn[n](e)},has(t,n){return n in t||n in dn}}))}function Jl(e,t=!0){return ee(e)?e.displayName||e.name:e.name||t&&e.__name}function Gl(e){return ee(e)&&"__vccOpts"in e}const ye=(e,t)=>zc(e,t,_s);function Ao(e,t,n){const s=arguments.length;return s===2?ge(t)&&!G(t)?to(t)?me(e,null,[t]):me(e,t):me(e,null,t):(s>3?n=Array.prototype.slice.call(arguments,2):s===3&&to(n)&&(n=[n]),me(e,t,n))}const Yl="3.4.19";/**
* @vue/runtime-dom v3.4.19
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/const Ql="http://www.w3.org/2000/svg",Xl="http://www.w3.org/1998/Math/MathML",wt=typeof document<"u"?document:null,lr=wt&&wt.createElement("template"),Zl={insert:(e,t,n)=>{t.insertBefore(e,n||null)},remove:e=>{const t=e.parentNode;t&&t.removeChild(e)},createElement:(e,t,n,s)=>{const o=t==="svg"?wt.createElementNS(Ql,e):t==="mathml"?wt.createElementNS(Xl,e):wt.createElement(e,n?{is:n}:void 0);return e==="select"&&s&&s.multiple!=null&&o.setAttribute("multiple",s.multiple),o},createText:e=>wt.createTextNode(e),createComment:e=>wt.createComment(e),setText:(e,t)=>{e.nodeValue=t},setElementText:(e,t)=>{e.textContent=t},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>wt.querySelector(e),setScopeId(e,t){e.setAttribute(t,"")},insertStaticContent(e,t,n,s,o,r){const i=n?n.previousSibling:t.lastChild;if(o&&(o===r||o.nextSibling))for(;t.insertBefore(o.cloneNode(!0),n),!(o===r||!(o=o.nextSibling)););else{lr.innerHTML=s==="svg"?`<svg>${e}</svg>`:s==="mathml"?`<math>${e}</math>`:e;const a=lr.content;if(s==="svg"||s==="mathml"){const c=a.firstChild;for(;c.firstChild;)a.appendChild(c.firstChild);a.removeChild(c)}t.insertBefore(a,n)}return[i?i.nextSibling:t.firstChild,n?n.previousSibling:t.lastChild]}},mt="transition",rn="animation",Yt=Symbol("_vtc"),vs=(e,{slots:t})=>Ao(ll,pa(e),t);vs.displayName="Transition";const da={name:String,type:String,css:{type:Boolean,default:!0},duration:[String,Number,Object],enterFromClass:String,enterActiveClass:String,enterToClass:String,appearFromClass:String,appearActiveClass:String,appearToClass:String,leaveFromClass:String,leaveActiveClass:String,leaveToClass:String},eu=vs.props=Re({},Vi,da),Ot=(e,t=[])=>{G(e)?e.forEach(n=>n(...t)):e&&e(...t)},ur=e=>e?G(e)?e.some(t=>t.length>1):e.length>1:!1;function pa(e){const t={};for(const j in e)j in da||(t[j]=e[j]);if(e.css===!1)return t;const{name:n="v",type:s,duration:o,enterFromClass:r=`${n}-enter-from`,enterActiveClass:i=`${n}-enter-active`,enterToClass:a=`${n}-enter-to`,appearFromClass:c=r,appearActiveClass:l=i,appearToClass:u=a,leaveFromClass:f=`${n}-leave-from`,leaveActiveClass:p=`${n}-leave-active`,leaveToClass:m=`${n}-leave-to`}=e,g=tu(o),y=g&&g[0],v=g&&g[1],{onBeforeEnter:k,onEnter:N,onEnterCancelled:T,onLeave:D,onLeaveCancelled:W,onBeforeAppear:L=k,onAppear:Y=N,onAppearCancelled:B=T}=t,re=(j,ne,J)=>{bt(j,ne?u:a),bt(j,ne?l:i),J&&J()},te=(j,ne)=>{j._isLeaving=!1,bt(j,f),bt(j,m),bt(j,p),ne&&ne()},he=j=>(ne,J)=>{const se=j?Y:N,q=()=>re(ne,j,J);Ot(se,[ne,q]),fr(()=>{bt(ne,j?c:r),ut(ne,j?u:a),ur(se)||dr(ne,s,y,q)})};return Re(t,{onBeforeEnter(j){Ot(k,[j]),ut(j,r),ut(j,i)},onBeforeAppear(j){Ot(L,[j]),ut(j,c),ut(j,l)},onEnter:he(!1),onAppear:he(!0),onLeave(j,ne){j._isLeaving=!0;const J=()=>te(j,ne);ut(j,f),ma(),ut(j,p),fr(()=>{j._isLeaving&&(bt(j,f),ut(j,m),ur(D)||dr(j,s,v,J))}),Ot(D,[j,J])},onEnterCancelled(j){re(j,!1),Ot(T,[j])},onAppearCancelled(j){re(j,!0),Ot(B,[j])},onLeaveCancelled(j){te(j),Ot(W,[j])}})}function tu(e){if(e==null)return null;if(ge(e))return[Ls(e.enter),Ls(e.leave)];{const t=Ls(e);return[t,t]}}function Ls(e){return pc(e)}function ut(e,t){t.split(/\s+/).forEach(n=>n&&e.classList.add(n)),(e[Yt]||(e[Yt]=new Set)).add(t)}function bt(e,t){t.split(/\s+/).forEach(s=>s&&e.classList.remove(s));const n=e[Yt];n&&(n.delete(t),n.size||(e[Yt]=void 0))}function fr(e){requestAnimationFrame(()=>{requestAnimationFrame(e)})}let nu=0;function dr(e,t,n,s){const o=e._endId=++nu,r=()=>{o===e._endId&&s()};if(n)return setTimeout(r,n);const{type:i,timeout:a,propCount:c}=ha(e,t);if(!i)return s();const l=i+"end";let u=0;const f=()=>{e.removeEventListener(l,p),r()},p=m=>{m.target===e&&++u>=c&&f()};setTimeout(()=>{u<c&&f()},a+1),e.addEventListener(l,p)}function ha(e,t){const n=window.getComputedStyle(e),s=g=>(n[g]||"").split(", "),o=s(`${mt}Delay`),r=s(`${mt}Duration`),i=pr(o,r),a=s(`${rn}Delay`),c=s(`${rn}Duration`),l=pr(a,c);let u=null,f=0,p=0;t===mt?i>0&&(u=mt,f=i,p=r.length):t===rn?l>0&&(u=rn,f=l,p=c.length):(f=Math.max(i,l),u=f>0?i>l?mt:rn:null,p=u?u===mt?r.length:c.length:0);const m=u===mt&&/\b(transform|all)(,|$)/.test(s(`${mt}Property`).toString());return{type:u,timeout:f,propCount:p,hasTransform:m}}function pr(e,t){for(;e.length<t.length;)e=e.concat(e);return Math.max(...t.map((n,s)=>hr(n)+hr(e[s])))}function hr(e){return e==="auto"?0:Number(e.slice(0,-1).replace(",","."))*1e3}function ma(){return document.body.offsetHeight}function su(e,t,n){const s=e[Yt];s&&(t=(t?[t,...s]:[...s]).join(" ")),t==null?e.removeAttribute("class"):n?e.setAttribute("class",t):e.className=t}const mr=Symbol("_vod"),ou=Symbol(""),ru=/(^|;)\s*display\s*:/;function iu(e,t,n){const s=e.style,o=xe(n),r=s.display;let i=!1;if(n&&!o){if(t&&!xe(t))for(const a in t)n[a]==null&&so(s,a,"");for(const a in n)a==="display"&&(i=!0),so(s,a,n[a])}else if(o){if(t!==n){const a=s[ou];a&&(n+=";"+a),s.cssText=n,i=ru.test(n)}}else t&&e.removeAttribute("style");mr in e&&(e[mr]=i?s.display:"",s.display=r)}const gr=/\s*!important$/;function so(e,t,n){if(G(n))n.forEach(s=>so(e,t,s));else if(n==null&&(n=""),t.startsWith("--"))e.setProperty(t,n);else{const s=au(e,t);gr.test(n)?e.setProperty(tn(s),n.replace(gr,""),"important"):e[s]=n}}const br=["Webkit","Moz","ms"],Fs={};function au(e,t){const n=Fs[t];if(n)return n;let s=ct(t);if(s!=="filter"&&s in e)return Fs[t]=s;s=is(s);for(let o=0;o<br.length;o++){const r=br[o]+s;if(r in e)return Fs[t]=r}return t}const yr="http://www.w3.org/1999/xlink";function cu(e,t,n,s,o){if(s&&t.startsWith("xlink:"))n==null?e.removeAttributeNS(yr,t.slice(6,t.length)):e.setAttributeNS(yr,t,n);else{const r=_c(t);n==null||r&&!ui(n)?e.removeAttribute(t):e.setAttribute(t,r?"":n)}}function lu(e,t,n,s,o,r,i){if(t==="innerHTML"||t==="textContent"){s&&i(s,o,r),e[t]=n??"";return}const a=e.tagName;if(t==="value"&&a!=="PROGRESS"&&!a.includes("-")){e._value=n;const l=a==="OPTION"?e.getAttribute("value"):e.value,u=n??"";l!==u&&(e.value=u),n==null&&e.removeAttribute(t);return}let c=!1;if(n===""||n==null){const l=typeof e[t];l==="boolean"?n=ui(n):n==null&&l==="string"?(n="",c=!0):l==="number"&&(n=0,c=!0)}try{e[t]=n}catch{}c&&e.removeAttribute(t)}function uu(e,t,n,s){e.addEventListener(t,n,s)}function fu(e,t,n,s){e.removeEventListener(t,n,s)}const _r=Symbol("_vei");function du(e,t,n,s,o=null){const r=e[_r]||(e[_r]={}),i=r[t];if(s&&i)i.value=s;else{const[a,c]=pu(t);if(s){const l=r[t]=gu(s,o);uu(e,a,l,c)}else i&&(fu(e,a,i,c),r[t]=void 0)}}const vr=/(?:Once|Passive|Capture)$/;function pu(e){let t;if(vr.test(e)){t={};let s;for(;s=e.match(vr);)e=e.slice(0,e.length-s[0].length),t[s[0].toLowerCase()]=!0}return[e[2]===":"?e.slice(3):tn(e.slice(2)),t]}let Is=0;const hu=Promise.resolve(),mu=()=>Is||(hu.then(()=>Is=0),Is=Date.now());function gu(e,t){const n=s=>{if(!s._vts)s._vts=Date.now();else if(s._vts<=n.attached)return;We(bu(s,n.value),t,5,[s])};return n.value=e,n.attached=mu(),n}function bu(e,t){if(G(t)){const n=e.stopImmediatePropagation;return e.stopImmediatePropagation=()=>{n.call(e),e._stopped=!0},t.map(s=>o=>!o._stopped&&s&&s(o))}else return t}const wr=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,yu=(e,t,n,s,o,r,i,a,c)=>{const l=o==="svg";t==="class"?su(e,s,l):t==="style"?iu(e,n,s):ss(t)?po(t)||du(e,t,n,s,i):(t[0]==="."?(t=t.slice(1),!0):t[0]==="^"?(t=t.slice(1),!1):_u(e,t,s,l))?lu(e,t,s,r,i,a,c):(t==="true-value"?e._trueValue=s:t==="false-value"&&(e._falseValue=s),cu(e,t,s,l))};function _u(e,t,n,s){if(s)return!!(t==="innerHTML"||t==="textContent"||t in e&&wr(t)&&ee(n));if(t==="spellcheck"||t==="draggable"||t==="translate"||t==="form"||t==="list"&&e.tagName==="INPUT"||t==="type"&&e.tagName==="TEXTAREA")return!1;if(t==="width"||t==="height"){const o=e.tagName;if(o==="IMG"||o==="VIDEO"||o==="CANVAS"||o==="SOURCE")return!1}return wr(t)&&xe(n)?!1:t in e}const ga=new WeakMap,ba=new WeakMap,ts=Symbol("_moveCb"),xr=Symbol("_enterCb"),ya={name:"TransitionGroup",props:Re({},eu,{tag:String,moveClass:String}),setup(e,{slots:t}){const n=la(),s=qi();let o,r;return Gi(()=>{if(!o.length)return;const i=e.moveClass||`${e.name||"v"}-move`;if(!Su(o[0].el,n.vnode.el,i))return;o.forEach(wu),o.forEach(xu);const a=o.filter(Eu);ma(),a.forEach(c=>{const l=c.el,u=l.style;ut(l,i),u.transform=u.webkitTransform=u.transitionDuration="";const f=l[ts]=p=>{p&&p.target!==l||(!p||/transform$/.test(p.propertyName))&&(l.removeEventListener("transitionend",f),l[ts]=null,bt(l,i))};l.addEventListener("transitionend",f)})}),()=>{const i=ae(e),a=pa(i);let c=i.tag||we;o=r,r=t.default?Co(t.default()):[];for(let l=0;l<r.length;l++){const u=r[l];u.key!=null&&En(u,xn(u,a,s,n))}if(o)for(let l=0;l<o.length;l++){const u=o[l];En(u,xn(u,a,s,n)),ga.set(u,u.el.getBoundingClientRect())}return me(c,null,r)}}},vu=e=>delete e.mode;ya.props;const Er=ya;function wu(e){const t=e.el;t[ts]&&t[ts](),t[xr]&&t[xr]()}function xu(e){ba.set(e,e.el.getBoundingClientRect())}function Eu(e){const t=ga.get(e),n=ba.get(e),s=t.left-n.left,o=t.top-n.top;if(s||o){const r=e.el.style;return r.transform=r.webkitTransform=`translate(${s}px,${o}px)`,r.transitionDuration="0s",e}}function Su(e,t,n){const s=e.cloneNode(),o=e[Yt];o&&o.forEach(a=>{a.split(/\s+/).forEach(c=>c&&s.classList.remove(c))}),n.split(/\s+/).forEach(a=>a&&s.classList.add(a)),s.style.display="none";const r=t.nodeType===1?t:t.parentNode;r.appendChild(s);const{hasTransform:i}=ha(s);return r.removeChild(s),i}const Cu=Re({patchProp:yu},Zl);let Sr;function Ru(){return Sr||(Sr=$l(Cu))}const ku=(...e)=>{const t=Ru().createApp(...e),{mount:n}=t;return t.mount=s=>{const o=Au(s);if(!o)return;const r=t._component;!ee(r)&&!r.render&&!r.template&&(r.template=o.innerHTML),o.innerHTML="";const i=n(o,!1,Tu(o));return o instanceof Element&&(o.removeAttribute("v-cloak"),o.setAttribute("data-v-app","")),i},t};function Tu(e){if(e instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&e instanceof MathMLElement)return"mathml"}function Au(e){return xe(e)?document.querySelector(e):e}/*!
  * vue-router v4.5.1
  * (c) 2025 Eduardo San Martin Morote
  * @license MIT
  */const zt=typeof document<"u";function _a(e){return typeof e=="object"||"displayName"in e||"props"in e||"__vccOpts"in e}function Ou(e){return e.__esModule||e[Symbol.toStringTag]==="Module"||e.default&&_a(e.default)}const le=Object.assign;function Ms(e,t){const n={};for(const s in t){const o=t[s];n[s]=et(o)?o.map(e):e(o)}return n}const mn=()=>{},et=Array.isArray,va=/#/g,Pu=/&/g,$u=/\//g,Nu=/=/g,Lu=/\?/g,wa=/\+/g,Fu=/%5B/g,Iu=/%5D/g,xa=/%5E/g,Mu=/%60/g,Ea=/%7B/g,ju=/%7C/g,Sa=/%7D/g,Du=/%20/g;function Oo(e){return encodeURI(""+e).replace(ju,"|").replace(Fu,"[").replace(Iu,"]")}function Bu(e){return Oo(e).replace(Ea,"{").replace(Sa,"}").replace(xa,"^")}function oo(e){return Oo(e).replace(wa,"%2B").replace(Du,"+").replace(va,"%23").replace(Pu,"%26").replace(Mu,"`").replace(Ea,"{").replace(Sa,"}").replace(xa,"^")}function Uu(e){return oo(e).replace(Nu,"%3D")}function zu(e){return Oo(e).replace(va,"%23").replace(Lu,"%3F")}function Hu(e){return e==null?"":zu(e).replace($u,"%2F")}function Rn(e){try{return decodeURIComponent(""+e)}catch{}return""+e}const qu=/\/$/,Vu=e=>e.replace(qu,"");function js(e,t,n="/"){let s,o={},r="",i="";const a=t.indexOf("#");let c=t.indexOf("?");return a<c&&a>=0&&(c=-1),c>-1&&(s=t.slice(0,c),r=t.slice(c+1,a>-1?a:t.length),o=e(r)),a>-1&&(s=s||t.slice(0,a),i=t.slice(a,t.length)),s=Gu(s??t,n),{fullPath:s+(r&&"?")+r+i,path:s,query:o,hash:Rn(i)}}function Ku(e,t){const n=t.query?e(t.query):"";return t.path+(n&&"?")+n+(t.hash||"")}function Cr(e,t){return!t||!e.toLowerCase().startsWith(t.toLowerCase())?e:e.slice(t.length)||"/"}function Wu(e,t,n){const s=t.matched.length-1,o=n.matched.length-1;return s>-1&&s===o&&Qt(t.matched[s],n.matched[o])&&Ca(t.params,n.params)&&e(t.query)===e(n.query)&&t.hash===n.hash}function Qt(e,t){return(e.aliasOf||e)===(t.aliasOf||t)}function Ca(e,t){if(Object.keys(e).length!==Object.keys(t).length)return!1;for(const n in e)if(!Ju(e[n],t[n]))return!1;return!0}function Ju(e,t){return et(e)?Rr(e,t):et(t)?Rr(t,e):e===t}function Rr(e,t){return et(t)?e.length===t.length&&e.every((n,s)=>n===t[s]):e.length===1&&e[0]===t}function Gu(e,t){if(e.startsWith("/"))return e;if(!e)return t;const n=t.split("/"),s=e.split("/"),o=s[s.length-1];(o===".."||o===".")&&s.push("");let r=n.length-1,i,a;for(i=0;i<s.length;i++)if(a=s[i],a!==".")if(a==="..")r>1&&r--;else break;return n.slice(0,r).join("/")+"/"+s.slice(i).join("/")}const gt={path:"/",name:void 0,params:{},query:{},hash:"",fullPath:"/",matched:[],meta:{},redirectedFrom:void 0};var kn;(function(e){e.pop="pop",e.push="push"})(kn||(kn={}));var gn;(function(e){e.back="back",e.forward="forward",e.unknown=""})(gn||(gn={}));function Yu(e){if(!e)if(zt){const t=document.querySelector("base");e=t&&t.getAttribute("href")||"/",e=e.replace(/^\w+:\/\/[^\/]+/,"")}else e="/";return e[0]!=="/"&&e[0]!=="#"&&(e="/"+e),Vu(e)}const Qu=/^[^#]+#/;function Xu(e,t){return e.replace(Qu,"#")+t}function Zu(e,t){const n=document.documentElement.getBoundingClientRect(),s=e.getBoundingClientRect();return{behavior:t.behavior,left:s.left-n.left-(t.left||0),top:s.top-n.top-(t.top||0)}}const ws=()=>({left:window.scrollX,top:window.scrollY});function ef(e){let t;if("el"in e){const n=e.el,s=typeof n=="string"&&n.startsWith("#"),o=typeof n=="string"?s?document.getElementById(n.slice(1)):document.querySelector(n):n;if(!o)return;t=Zu(o,e)}else t=e;"scrollBehavior"in document.documentElement.style?window.scrollTo(t):window.scrollTo(t.left!=null?t.left:window.scrollX,t.top!=null?t.top:window.scrollY)}function kr(e,t){return(history.state?history.state.position-t:-1)+e}const ro=new Map;function tf(e,t){ro.set(e,t)}function nf(e){const t=ro.get(e);return ro.delete(e),t}let sf=()=>location.protocol+"//"+location.host;function Ra(e,t){const{pathname:n,search:s,hash:o}=t,r=e.indexOf("#");if(r>-1){let a=o.includes(e.slice(r))?e.slice(r).length:1,c=o.slice(a);return c[0]!=="/"&&(c="/"+c),Cr(c,"")}return Cr(n,e)+s+o}function of(e,t,n,s){let o=[],r=[],i=null;const a=({state:p})=>{const m=Ra(e,location),g=n.value,y=t.value;let v=0;if(p){if(n.value=m,t.value=p,i&&i===g){i=null;return}v=y?p.position-y.position:0}else s(m);o.forEach(k=>{k(n.value,g,{delta:v,type:kn.pop,direction:v?v>0?gn.forward:gn.back:gn.unknown})})};function c(){i=n.value}function l(p){o.push(p);const m=()=>{const g=o.indexOf(p);g>-1&&o.splice(g,1)};return r.push(m),m}function u(){const{history:p}=window;p.state&&p.replaceState(le({},p.state,{scroll:ws()}),"")}function f(){for(const p of r)p();r=[],window.removeEventListener("popstate",a),window.removeEventListener("beforeunload",u)}return window.addEventListener("popstate",a),window.addEventListener("beforeunload",u,{passive:!0}),{pauseListeners:c,listen:l,destroy:f}}function Tr(e,t,n,s=!1,o=!1){return{back:e,current:t,forward:n,replaced:s,position:window.history.length,scroll:o?ws():null}}function rf(e){const{history:t,location:n}=window,s={value:Ra(e,n)},o={value:t.state};o.value||r(s.value,{back:null,current:s.value,forward:null,position:t.length-1,replaced:!0,scroll:null},!0);function r(c,l,u){const f=e.indexOf("#"),p=f>-1?(n.host&&document.querySelector("base")?e:e.slice(f))+c:sf()+e+c;try{t[u?"replaceState":"pushState"](l,"",p),o.value=l}catch(m){console.error(m),n[u?"replace":"assign"](p)}}function i(c,l){const u=le({},t.state,Tr(o.value.back,c,o.value.forward,!0),l,{position:o.value.position});r(c,u,!0),s.value=c}function a(c,l){const u=le({},o.value,t.state,{forward:c,scroll:ws()});r(u.current,u,!0);const f=le({},Tr(s.value,c,null),{position:u.position+1},l);r(c,f,!1),s.value=c}return{location:s,state:o,push:a,replace:i}}function af(e){e=Yu(e);const t=rf(e),n=of(e,t.state,t.location,t.replace);function s(r,i=!0){i||n.pauseListeners(),history.go(r)}const o=le({location:"",base:e,go:s,createHref:Xu.bind(null,e)},t,n);return Object.defineProperty(o,"location",{enumerable:!0,get:()=>t.location.value}),Object.defineProperty(o,"state",{enumerable:!0,get:()=>t.state.value}),o}function cf(e){return typeof e=="string"||e&&typeof e=="object"}function ka(e){return typeof e=="string"||typeof e=="symbol"}const Ta=Symbol("");var Ar;(function(e){e[e.aborted=4]="aborted",e[e.cancelled=8]="cancelled",e[e.duplicated=16]="duplicated"})(Ar||(Ar={}));function Xt(e,t){return le(new Error,{type:e,[Ta]:!0},t)}function lt(e,t){return e instanceof Error&&Ta in e&&(t==null||!!(e.type&t))}const Or="[^/]+?",lf={sensitive:!1,strict:!1,start:!0,end:!0},uf=/[.+*?^${}()[\]/\\]/g;function ff(e,t){const n=le({},lf,t),s=[];let o=n.start?"^":"";const r=[];for(const l of e){const u=l.length?[]:[90];n.strict&&!l.length&&(o+="/");for(let f=0;f<l.length;f++){const p=l[f];let m=40+(n.sensitive?.25:0);if(p.type===0)f||(o+="/"),o+=p.value.replace(uf,"\\$&"),m+=40;else if(p.type===1){const{value:g,repeatable:y,optional:v,regexp:k}=p;r.push({name:g,repeatable:y,optional:v});const N=k||Or;if(N!==Or){m+=10;try{new RegExp(`(${N})`)}catch(D){throw new Error(`Invalid custom RegExp for param "${g}" (${N}): `+D.message)}}let T=y?`((?:${N})(?:/(?:${N}))*)`:`(${N})`;f||(T=v&&l.length<2?`(?:/${T})`:"/"+T),v&&(T+="?"),o+=T,m+=20,v&&(m+=-8),y&&(m+=-20),N===".*"&&(m+=-50)}u.push(m)}s.push(u)}if(n.strict&&n.end){const l=s.length-1;s[l][s[l].length-1]+=.7000000000000001}n.strict||(o+="/?"),n.end?o+="$":n.strict&&!o.endsWith("/")&&(o+="(?:/|$)");const i=new RegExp(o,n.sensitive?"":"i");function a(l){const u=l.match(i),f={};if(!u)return null;for(let p=1;p<u.length;p++){const m=u[p]||"",g=r[p-1];f[g.name]=m&&g.repeatable?m.split("/"):m}return f}function c(l){let u="",f=!1;for(const p of e){(!f||!u.endsWith("/"))&&(u+="/"),f=!1;for(const m of p)if(m.type===0)u+=m.value;else if(m.type===1){const{value:g,repeatable:y,optional:v}=m,k=g in l?l[g]:"";if(et(k)&&!y)throw new Error(`Provided param "${g}" is an array but it is not repeatable (* or + modifiers)`);const N=et(k)?k.join("/"):k;if(!N)if(v)p.length<2&&(u.endsWith("/")?u=u.slice(0,-1):f=!0);else throw new Error(`Missing required param "${g}"`);u+=N}}return u||"/"}return{re:i,score:s,keys:r,parse:a,stringify:c}}function df(e,t){let n=0;for(;n<e.length&&n<t.length;){const s=t[n]-e[n];if(s)return s;n++}return e.length<t.length?e.length===1&&e[0]===80?-1:1:e.length>t.length?t.length===1&&t[0]===80?1:-1:0}function Aa(e,t){let n=0;const s=e.score,o=t.score;for(;n<s.length&&n<o.length;){const r=df(s[n],o[n]);if(r)return r;n++}if(Math.abs(o.length-s.length)===1){if(Pr(s))return 1;if(Pr(o))return-1}return o.length-s.length}function Pr(e){const t=e[e.length-1];return e.length>0&&t[t.length-1]<0}const pf={type:0,value:""},hf=/[a-zA-Z0-9_]/;function mf(e){if(!e)return[[]];if(e==="/")return[[pf]];if(!e.startsWith("/"))throw new Error(`Invalid path "${e}"`);function t(m){throw new Error(`ERR (${n})/"${l}": ${m}`)}let n=0,s=n;const o=[];let r;function i(){r&&o.push(r),r=[]}let a=0,c,l="",u="";function f(){l&&(n===0?r.push({type:0,value:l}):n===1||n===2||n===3?(r.length>1&&(c==="*"||c==="+")&&t(`A repeatable param (${l}) must be alone in its segment. eg: '/:ids+.`),r.push({type:1,value:l,regexp:u,repeatable:c==="*"||c==="+",optional:c==="*"||c==="?"})):t("Invalid state to consume buffer"),l="")}function p(){l+=c}for(;a<e.length;){if(c=e[a++],c==="\\"&&n!==2){s=n,n=4;continue}switch(n){case 0:c==="/"?(l&&f(),i()):c===":"?(f(),n=1):p();break;case 4:p(),n=s;break;case 1:c==="("?n=2:hf.test(c)?p():(f(),n=0,c!=="*"&&c!=="?"&&c!=="+"&&a--);break;case 2:c===")"?u[u.length-1]=="\\"?u=u.slice(0,-1)+c:n=3:u+=c;break;case 3:f(),n=0,c!=="*"&&c!=="?"&&c!=="+"&&a--,u="";break;default:t("Unknown state");break}}return n===2&&t(`Unfinished custom RegExp for param "${l}"`),f(),i(),o}function gf(e,t,n){const s=ff(mf(e.path),n),o=le(s,{record:e,parent:t,children:[],alias:[]});return t&&!o.record.aliasOf==!t.record.aliasOf&&t.children.push(o),o}function bf(e,t){const n=[],s=new Map;t=Fr({strict:!1,end:!0,sensitive:!1},t);function o(f){return s.get(f)}function r(f,p,m){const g=!m,y=Nr(f);y.aliasOf=m&&m.record;const v=Fr(t,f),k=[y];if("alias"in f){const D=typeof f.alias=="string"?[f.alias]:f.alias;for(const W of D)k.push(Nr(le({},y,{components:m?m.record.components:y.components,path:W,aliasOf:m?m.record:y})))}let N,T;for(const D of k){const{path:W}=D;if(p&&W[0]!=="/"){const L=p.record.path,Y=L[L.length-1]==="/"?"":"/";D.path=p.record.path+(W&&Y+W)}if(N=gf(D,p,v),m?m.alias.push(N):(T=T||N,T!==N&&T.alias.push(N),g&&f.name&&!Lr(N)&&i(f.name)),Oa(N)&&c(N),y.children){const L=y.children;for(let Y=0;Y<L.length;Y++)r(L[Y],N,m&&m.children[Y])}m=m||N}return T?()=>{i(T)}:mn}function i(f){if(ka(f)){const p=s.get(f);p&&(s.delete(f),n.splice(n.indexOf(p),1),p.children.forEach(i),p.alias.forEach(i))}else{const p=n.indexOf(f);p>-1&&(n.splice(p,1),f.record.name&&s.delete(f.record.name),f.children.forEach(i),f.alias.forEach(i))}}function a(){return n}function c(f){const p=vf(f,n);n.splice(p,0,f),f.record.name&&!Lr(f)&&s.set(f.record.name,f)}function l(f,p){let m,g={},y,v;if("name"in f&&f.name){if(m=s.get(f.name),!m)throw Xt(1,{location:f});v=m.record.name,g=le($r(p.params,m.keys.filter(T=>!T.optional).concat(m.parent?m.parent.keys.filter(T=>T.optional):[]).map(T=>T.name)),f.params&&$r(f.params,m.keys.map(T=>T.name))),y=m.stringify(g)}else if(f.path!=null)y=f.path,m=n.find(T=>T.re.test(y)),m&&(g=m.parse(y),v=m.record.name);else{if(m=p.name?s.get(p.name):n.find(T=>T.re.test(p.path)),!m)throw Xt(1,{location:f,currentLocation:p});v=m.record.name,g=le({},p.params,f.params),y=m.stringify(g)}const k=[];let N=m;for(;N;)k.unshift(N.record),N=N.parent;return{name:v,path:y,params:g,matched:k,meta:_f(k)}}e.forEach(f=>r(f));function u(){n.length=0,s.clear()}return{addRoute:r,resolve:l,removeRoute:i,clearRoutes:u,getRoutes:a,getRecordMatcher:o}}function $r(e,t){const n={};for(const s of t)s in e&&(n[s]=e[s]);return n}function Nr(e){const t={path:e.path,redirect:e.redirect,name:e.name,meta:e.meta||{},aliasOf:e.aliasOf,beforeEnter:e.beforeEnter,props:yf(e),children:e.children||[],instances:{},leaveGuards:new Set,updateGuards:new Set,enterCallbacks:{},components:"components"in e?e.components||null:e.component&&{default:e.component}};return Object.defineProperty(t,"mods",{value:{}}),t}function yf(e){const t={},n=e.props||!1;if("component"in e)t.default=n;else for(const s in e.components)t[s]=typeof n=="object"?n[s]:n;return t}function Lr(e){for(;e;){if(e.record.aliasOf)return!0;e=e.parent}return!1}function _f(e){return e.reduce((t,n)=>le(t,n.meta),{})}function Fr(e,t){const n={};for(const s in e)n[s]=s in t?t[s]:e[s];return n}function vf(e,t){let n=0,s=t.length;for(;n!==s;){const r=n+s>>1;Aa(e,t[r])<0?s=r:n=r+1}const o=wf(e);return o&&(s=t.lastIndexOf(o,s-1)),s}function wf(e){let t=e;for(;t=t.parent;)if(Oa(t)&&Aa(e,t)===0)return t}function Oa({record:e}){return!!(e.name||e.components&&Object.keys(e.components).length||e.redirect)}function xf(e){const t={};if(e===""||e==="?")return t;const s=(e[0]==="?"?e.slice(1):e).split("&");for(let o=0;o<s.length;++o){const r=s[o].replace(wa," "),i=r.indexOf("="),a=Rn(i<0?r:r.slice(0,i)),c=i<0?null:Rn(r.slice(i+1));if(a in t){let l=t[a];et(l)||(l=t[a]=[l]),l.push(c)}else t[a]=c}return t}function Ir(e){let t="";for(let n in e){const s=e[n];if(n=Uu(n),s==null){s!==void 0&&(t+=(t.length?"&":"")+n);continue}(et(s)?s.map(r=>r&&oo(r)):[s&&oo(s)]).forEach(r=>{r!==void 0&&(t+=(t.length?"&":"")+n,r!=null&&(t+="="+r))})}return t}function Ef(e){const t={};for(const n in e){const s=e[n];s!==void 0&&(t[n]=et(s)?s.map(o=>o==null?null:""+o):s==null?s:""+s)}return t}const Sf=Symbol(""),Mr=Symbol(""),xs=Symbol(""),Po=Symbol(""),io=Symbol("");function an(){let e=[];function t(s){return e.push(s),()=>{const o=e.indexOf(s);o>-1&&e.splice(o,1)}}function n(){e=[]}return{add:t,list:()=>e.slice(),reset:n}}function xt(e,t,n,s,o,r=i=>i()){const i=s&&(s.enterCallbacks[o]=s.enterCallbacks[o]||[]);return()=>new Promise((a,c)=>{const l=p=>{p===!1?c(Xt(4,{from:n,to:t})):p instanceof Error?c(p):cf(p)?c(Xt(2,{from:t,to:p})):(i&&s.enterCallbacks[o]===i&&typeof p=="function"&&i.push(p),a())},u=r(()=>e.call(s&&s.instances[o],t,n,l));let f=Promise.resolve(u);e.length<3&&(f=f.then(l)),f.catch(p=>c(p))})}function Ds(e,t,n,s,o=r=>r()){const r=[];for(const i of e)for(const a in i.components){let c=i.components[a];if(!(t!=="beforeRouteEnter"&&!i.instances[a]))if(_a(c)){const u=(c.__vccOpts||c)[t];u&&r.push(xt(u,n,s,i,a,o))}else{let l=c();r.push(()=>l.then(u=>{if(!u)throw new Error(`Couldn't resolve component "${a}" at "${i.path}"`);const f=Ou(u)?u.default:u;i.mods[a]=u,i.components[a]=f;const m=(f.__vccOpts||f)[t];return m&&xt(m,n,s,i,a,o)()}))}}return r}function jr(e){const t=Xe(xs),n=Xe(Po),s=ye(()=>{const c=Ve(e.to);return t.resolve(c)}),o=ye(()=>{const{matched:c}=s.value,{length:l}=c,u=c[l-1],f=n.matched;if(!u||!f.length)return-1;const p=f.findIndex(Qt.bind(null,u));if(p>-1)return p;const m=Dr(c[l-2]);return l>1&&Dr(u)===m&&f[f.length-1].path!==m?f.findIndex(Qt.bind(null,c[l-2])):p}),r=ye(()=>o.value>-1&&Af(n.params,s.value.params)),i=ye(()=>o.value>-1&&o.value===n.matched.length-1&&Ca(n.params,s.value.params));function a(c={}){if(Tf(c)){const l=t[Ve(e.replace)?"replace":"push"](Ve(e.to)).catch(mn);return e.viewTransition&&typeof document<"u"&&"startViewTransition"in document&&document.startViewTransition(()=>l),l}return Promise.resolve()}return{route:s,href:ye(()=>s.value.href),isActive:r,isExactActive:i,navigate:a}}function Cf(e){return e.length===1?e[0]:e}const Rf=Wi({name:"RouterLink",compatConfig:{MODE:3},props:{to:{type:[String,Object],required:!0},replace:Boolean,activeClass:String,exactActiveClass:String,custom:Boolean,ariaCurrentValue:{type:String,default:"page"},viewTransition:Boolean},useLink:jr,setup(e,{slots:t}){const n=Tn(jr(e)),{options:s}=Xe(xs),o=ye(()=>({[Br(e.activeClass,s.linkActiveClass,"router-link-active")]:n.isActive,[Br(e.exactActiveClass,s.linkExactActiveClass,"router-link-exact-active")]:n.isExactActive}));return()=>{const r=t.default&&Cf(t.default(n));return e.custom?r:Ao("a",{"aria-current":n.isExactActive?e.ariaCurrentValue:null,href:n.href,onClick:n.navigate,class:o.value},r)}}}),kf=Rf;function Tf(e){if(!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)&&!e.defaultPrevented&&!(e.button!==void 0&&e.button!==0)){if(e.currentTarget&&e.currentTarget.getAttribute){const t=e.currentTarget.getAttribute("target");if(/\b_blank\b/i.test(t))return}return e.preventDefault&&e.preventDefault(),!0}}function Af(e,t){for(const n in t){const s=t[n],o=e[n];if(typeof s=="string"){if(s!==o)return!1}else if(!et(o)||o.length!==s.length||s.some((r,i)=>r!==o[i]))return!1}return!0}function Dr(e){return e?e.aliasOf?e.aliasOf.path:e.path:""}const Br=(e,t,n)=>e??t??n,Of=Wi({name:"RouterView",inheritAttrs:!1,props:{name:{type:String,default:"default"},route:Object},compatConfig:{MODE:3},setup(e,{attrs:t,slots:n}){const s=Xe(io),o=ye(()=>e.route||s.value),r=Xe(Mr,0),i=ye(()=>{let l=Ve(r);const{matched:u}=o.value;let f;for(;(f=u[l])&&!f.components;)l++;return l}),a=ye(()=>o.value.matched[i.value]);qn(Mr,ye(()=>i.value+1)),qn(Sf,a),qn(io,o);const c=Le();return fn(()=>[c.value,a.value,e.name],([l,u,f],[p,m,g])=>{u&&(u.instances[f]=l,m&&m!==u&&l&&l===p&&(u.leaveGuards.size||(u.leaveGuards=m.leaveGuards),u.updateGuards.size||(u.updateGuards=m.updateGuards))),l&&u&&(!m||!Qt(u,m)||!p)&&(u.enterCallbacks[f]||[]).forEach(y=>y(l))},{flush:"post"}),()=>{const l=o.value,u=e.name,f=a.value,p=f&&f.components[u];if(!p)return Ur(n.default,{Component:p,route:l});const m=f.props[u],g=m?m===!0?l.params:typeof m=="function"?m(l):m:null,v=Ao(p,le({},g,t,{onVnodeUnmounted:k=>{k.component.isUnmounted&&(f.instances[u]=null)},ref:c}));return Ur(n.default,{Component:v,route:l})||v}}});function Ur(e,t){if(!e)return null;const n=e(t);return n.length===1?n[0]:n}const Pf=Of;function $f(e){const t=bf(e.routes,e),n=e.parseQuery||xf,s=e.stringifyQuery||Ir,o=e.history,r=an(),i=an(),a=an(),c=Hc(gt);let l=gt;zt&&e.scrollBehavior&&"scrollRestoration"in history&&(history.scrollRestoration="manual");const u=Ms.bind(null,E=>""+E),f=Ms.bind(null,Hu),p=Ms.bind(null,Rn);function m(E,I){let P,U;return ka(E)?(P=t.getRecordMatcher(E),U=I):U=E,t.addRoute(U,P)}function g(E){const I=t.getRecordMatcher(E);I&&t.removeRoute(I)}function y(){return t.getRoutes().map(E=>E.record)}function v(E){return!!t.getRecordMatcher(E)}function k(E,I){if(I=le({},I||c.value),typeof E=="string"){const b=js(n,E,I.path),x=t.resolve({path:b.path},I),S=o.createHref(b.fullPath);return le(b,x,{params:p(x.params),hash:Rn(b.hash),redirectedFrom:void 0,href:S})}let P;if(E.path!=null)P=le({},E,{path:js(n,E.path,I.path).path});else{const b=le({},E.params);for(const x in b)b[x]==null&&delete b[x];P=le({},E,{params:f(b)}),I.params=f(I.params)}const U=t.resolve(P,I),de=E.hash||"";U.params=u(p(U.params));const d=Ku(s,le({},E,{hash:Bu(de),path:U.path})),h=o.createHref(d);return le({fullPath:d,hash:de,query:s===Ir?Ef(E.query):E.query||{}},U,{redirectedFrom:void 0,href:h})}function N(E){return typeof E=="string"?js(n,E,c.value.path):le({},E)}function T(E,I){if(l!==E)return Xt(8,{from:I,to:E})}function D(E){return Y(E)}function W(E){return D(le(N(E),{replace:!0}))}function L(E){const I=E.matched[E.matched.length-1];if(I&&I.redirect){const{redirect:P}=I;let U=typeof P=="function"?P(E):P;return typeof U=="string"&&(U=U.includes("?")||U.includes("#")?U=N(U):{path:U},U.params={}),le({query:E.query,hash:E.hash,params:U.path!=null?{}:E.params},U)}}function Y(E,I){const P=l=k(E),U=c.value,de=E.state,d=E.force,h=E.replace===!0,b=L(P);if(b)return Y(le(N(b),{state:typeof b=="object"?le({},de,b.state):de,force:d,replace:h}),I||P);const x=P;x.redirectedFrom=I;let S;return!d&&Wu(s,U,P)&&(S=Xt(16,{to:x,from:U}),pe(U,U,!0,!1)),(S?Promise.resolve(S):te(x,U)).catch(C=>lt(C)?lt(C,2)?C:Te(C):z(C,x,U)).then(C=>{if(C){if(lt(C,2))return Y(le({replace:h},N(C.to),{state:typeof C.to=="object"?le({},de,C.to.state):de,force:d}),I||x)}else C=j(x,U,!0,h,de);return he(x,U,C),C})}function B(E,I){const P=T(E,I);return P?Promise.reject(P):Promise.resolve()}function re(E){const I=Je.values().next().value;return I&&typeof I.runWithContext=="function"?I.runWithContext(E):E()}function te(E,I){let P;const[U,de,d]=Nf(E,I);P=Ds(U.reverse(),"beforeRouteLeave",E,I);for(const b of U)b.leaveGuards.forEach(x=>{P.push(xt(x,E,I))});const h=B.bind(null,E,I);return P.push(h),Ae(P).then(()=>{P=[];for(const b of r.list())P.push(xt(b,E,I));return P.push(h),Ae(P)}).then(()=>{P=Ds(de,"beforeRouteUpdate",E,I);for(const b of de)b.updateGuards.forEach(x=>{P.push(xt(x,E,I))});return P.push(h),Ae(P)}).then(()=>{P=[];for(const b of d)if(b.beforeEnter)if(et(b.beforeEnter))for(const x of b.beforeEnter)P.push(xt(x,E,I));else P.push(xt(b.beforeEnter,E,I));return P.push(h),Ae(P)}).then(()=>(E.matched.forEach(b=>b.enterCallbacks={}),P=Ds(d,"beforeRouteEnter",E,I,re),P.push(h),Ae(P))).then(()=>{P=[];for(const b of i.list())P.push(xt(b,E,I));return P.push(h),Ae(P)}).catch(b=>lt(b,8)?b:Promise.reject(b))}function he(E,I,P){a.list().forEach(U=>re(()=>U(E,I,P)))}function j(E,I,P,U,de){const d=T(E,I);if(d)return d;const h=I===gt,b=zt?history.state:{};P&&(U||h?o.replace(E.fullPath,le({scroll:h&&b&&b.scroll},de)):o.push(E.fullPath,de)),c.value=E,pe(E,I,P,h),Te()}let ne;function J(){ne||(ne=o.listen((E,I,P)=>{if(!kt.listening)return;const U=k(E),de=L(U);if(de){Y(le(de,{replace:!0,force:!0}),U).catch(mn);return}l=U;const d=c.value;zt&&tf(kr(d.fullPath,P.delta),ws()),te(U,d).catch(h=>lt(h,12)?h:lt(h,2)?(Y(le(N(h.to),{force:!0}),U).then(b=>{lt(b,20)&&!P.delta&&P.type===kn.pop&&o.go(-1,!1)}).catch(mn),Promise.reject()):(P.delta&&o.go(-P.delta,!1),z(h,U,d))).then(h=>{h=h||j(U,d,!1),h&&(P.delta&&!lt(h,8)?o.go(-P.delta,!1):P.type===kn.pop&&lt(h,20)&&o.go(-1,!1)),he(U,d,h)}).catch(mn)}))}let se=an(),q=an(),F;function z(E,I,P){Te(E);const U=q.list();return U.length?U.forEach(de=>de(E,I,P)):console.error(E),Promise.reject(E)}function ce(){return F&&c.value!==gt?Promise.resolve():new Promise((E,I)=>{se.add([E,I])})}function Te(E){return F||(F=!E,J(),se.list().forEach(([I,P])=>E?P(E):I()),se.reset()),E}function pe(E,I,P,U){const{scrollBehavior:de}=e;if(!zt||!de)return Promise.resolve();const d=!P&&nf(kr(E.fullPath,0))||(U||!P)&&history.state&&history.state.scroll||null;return $i().then(()=>de(E,I,d)).then(h=>h&&ef(h)).catch(h=>z(h,E,I))}const be=E=>o.go(E);let Ue;const Je=new Set,kt={currentRoute:c,listening:!0,addRoute:m,removeRoute:g,clearRoutes:t.clearRoutes,hasRoute:v,getRoutes:y,resolve:k,options:e,push:D,replace:W,go:be,back:()=>be(-1),forward:()=>be(1),beforeEach:r.add,beforeResolve:i.add,afterEach:a.add,onError:q.add,isReady:ce,install(E){const I=this;E.component("RouterLink",kf),E.component("RouterView",Pf),E.config.globalProperties.$router=I,Object.defineProperty(E.config.globalProperties,"$route",{enumerable:!0,get:()=>Ve(c)}),zt&&!Ue&&c.value===gt&&(Ue=!0,D(o.location).catch(de=>{}));const P={};for(const de in gt)Object.defineProperty(P,de,{get:()=>c.value[de],enumerable:!0});E.provide(xs,I),E.provide(Po,Ei(P)),E.provide(io,c);const U=E.unmount;Je.add(E),E.unmount=function(){Je.delete(E),Je.size<1&&(l=gt,ne&&ne(),ne=null,c.value=gt,Ue=!1,F=!1),U()}}};function Ae(E){return E.reduce((I,P)=>I.then(()=>re(P)),Promise.resolve())}return kt}function Nf(e,t){const n=[],s=[],o=[],r=Math.max(t.matched.length,e.matched.length);for(let i=0;i<r;i++){const a=t.matched[i];a&&(e.matched.find(l=>Qt(l,a))?s.push(a):n.push(a));const c=e.matched[i];c&&(t.matched.find(l=>Qt(l,c))||o.push(c))}return[n,s,o]}function Pa(){return Xe(xs)}function $a(e){return Xe(Po)}const Lf={__name:"App",setup(e){const t=Pa(),n=Le(!0);return t.isReady().then(()=>{setTimeout(()=>{n.value=!1},100)}),(s,o)=>{const r=fs("router-view");return K(),Cn(r,null,{default:Ie(({Component:i,route:a})=>[me(vs,{name:n.value?"":"page",mode:"out-in"},{default:Ie(()=>[(K(),Cn(nl(i),{key:a.path}))]),_:2},1032,["name"])]),_:1})}}},Ce=Tn({discordUser:null,spotify:null,discordStatus:"offline",discordStatusColor:"text-catppuccin-subtle",editorActivity:null,isConnected:!1,isLoading:!0});class Ff{constructor(){this.ws=null,this.heartbeat=null,this.reconnectTimeout=null,this.reconnectAttempts=0,this.maxAttempts=5,this.userId="470904884946796544",this.isConnecting=!1}connect(){if(!(this.isConnecting||this.ws&&this.ws.readyState===WebSocket.OPEN)){this.isConnecting=!0,Ce.isLoading=!0;try{this.ws=new WebSocket("wss://api.lanyard.rest/socket"),this.ws.onopen=()=>{this.isConnecting=!1,this.reconnectAttempts=0,Ce.isConnected=!0,this.ws.send(JSON.stringify({op:2,d:{subscribe_to_id:this.userId}}))},this.ws.onmessage=t=>{try{this.handleMessage(JSON.parse(t.data))}catch{}},this.ws.onclose=t=>{this.isConnecting=!1,Ce.isConnected=!1,this.heartbeat&&(clearInterval(this.heartbeat),this.heartbeat=null),t.code!==1e3&&this.reconnectAttempts<this.maxAttempts&&this.scheduleReconnect()},this.ws.onerror=()=>{this.isConnecting=!1,Ce.isConnected=!1}}catch{this.isConnecting=!1,Ce.isLoading=!1,this.scheduleReconnect()}}}handleMessage(t){t.op===1?this.startHeartbeat(t.d.heartbeat_interval):t.op===0&&(t.t==="INIT_STATE"||t.t==="PRESENCE_UPDATE")&&(this.updatePresence(t.d),Ce.isLoading=!1)}updatePresence(t){var n;t.discord_user&&(Ce.discordUser={username:t.discord_user.username,discriminator:t.discord_user.discriminator,avatar:t.discord_user.avatar,id:t.discord_user.id}),Ce.spotify=t.spotify?{song:t.spotify.song,artist:t.spotify.artist,track_id:t.spotify.track_id}:null,t.discord_status&&(Ce.discordStatus=t.discord_status,Ce.discordStatusColor=t.discord_status==="online"?"text-catppuccin-gold":"text-catppuccin-subtle"),Ce.editorActivity=(n=t.activities)==null?void 0:n.find(s=>s.name==="Visual Studio Code"||s.name==="Code"||s.name==="Zed")}startHeartbeat(t){this.heartbeat&&clearInterval(this.heartbeat),this.heartbeat=setInterval(()=>{var n;((n=this.ws)==null?void 0:n.readyState)===WebSocket.OPEN&&this.ws.send(JSON.stringify({op:3}))},t)}scheduleReconnect(){this.reconnectTimeout&&clearTimeout(this.reconnectTimeout),this.reconnectAttempts++;const t=Math.min(1e3*Math.pow(2,this.reconnectAttempts-1),3e4);this.reconnectTimeout=setTimeout(()=>this.connect(),t)}disconnect(){this.reconnectTimeout&&(clearTimeout(this.reconnectTimeout),this.reconnectTimeout=null),this.heartbeat&&(clearInterval(this.heartbeat),this.heartbeat=null),this.ws&&(this.ws.close(1e3,"Manual disconnect"),this.ws=null),Ce.isConnected=!1}}const If=new Ff;If.connect();function Na(e,t){return function(){return e.apply(t,arguments)}}const{toString:Mf}=Object.prototype,{getPrototypeOf:$o}=Object,{iterator:Es,toStringTag:La}=Symbol,Ss=(e=>t=>{const n=Mf.call(t);return e[n]||(e[n]=n.slice(8,-1).toLowerCase())})(Object.create(null)),tt=e=>(e=e.toLowerCase(),t=>Ss(t)===e),Cs=e=>t=>typeof t===e,{isArray:nn}=Array,Zt=Cs("undefined");function On(e){return e!==null&&!Zt(e)&&e.constructor!==null&&!Zt(e.constructor)&&Me(e.constructor.isBuffer)&&e.constructor.isBuffer(e)}const Fa=tt("ArrayBuffer");function jf(e){let t;return typeof ArrayBuffer<"u"&&ArrayBuffer.isView?t=ArrayBuffer.isView(e):t=e&&e.buffer&&Fa(e.buffer),t}const Df=Cs("string"),Me=Cs("function"),Ia=Cs("number"),Pn=e=>e!==null&&typeof e=="object",Bf=e=>e===!0||e===!1,Wn=e=>{if(Ss(e)!=="object")return!1;const t=$o(e);return(t===null||t===Object.prototype||Object.getPrototypeOf(t)===null)&&!(La in e)&&!(Es in e)},Uf=e=>{if(!Pn(e)||On(e))return!1;try{return Object.keys(e).length===0&&Object.getPrototypeOf(e)===Object.prototype}catch{return!1}},zf=tt("Date"),Hf=tt("File"),qf=tt("Blob"),Vf=tt("FileList"),Kf=e=>Pn(e)&&Me(e.pipe),Wf=e=>{let t;return e&&(typeof FormData=="function"&&e instanceof FormData||Me(e.append)&&((t=Ss(e))==="formdata"||t==="object"&&Me(e.toString)&&e.toString()==="[object FormData]"))},Jf=tt("URLSearchParams"),[Gf,Yf,Qf,Xf]=["ReadableStream","Request","Response","Headers"].map(tt),Zf=e=>e.trim?e.trim():e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"");function $n(e,t,{allOwnKeys:n=!1}={}){if(e===null||typeof e>"u")return;let s,o;if(typeof e!="object"&&(e=[e]),nn(e))for(s=0,o=e.length;s<o;s++)t.call(null,e[s],s,e);else{if(On(e))return;const r=n?Object.getOwnPropertyNames(e):Object.keys(e),i=r.length;let a;for(s=0;s<i;s++)a=r[s],t.call(null,e[a],a,e)}}function Ma(e,t){if(On(e))return null;t=t.toLowerCase();const n=Object.keys(e);let s=n.length,o;for(;s-- >0;)if(o=n[s],t===o.toLowerCase())return o;return null}const Nt=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:global,ja=e=>!Zt(e)&&e!==Nt;function ao(){const{caseless:e,skipUndefined:t}=ja(this)&&this||{},n={},s=(o,r)=>{const i=e&&Ma(n,r)||r;Wn(n[i])&&Wn(o)?n[i]=ao(n[i],o):Wn(o)?n[i]=ao({},o):nn(o)?n[i]=o.slice():(!t||!Zt(o))&&(n[i]=o)};for(let o=0,r=arguments.length;o<r;o++)arguments[o]&&$n(arguments[o],s);return n}const ed=(e,t,n,{allOwnKeys:s}={})=>($n(t,(o,r)=>{n&&Me(o)?e[r]=Na(o,n):e[r]=o},{allOwnKeys:s}),e),td=e=>(e.charCodeAt(0)===65279&&(e=e.slice(1)),e),nd=(e,t,n,s)=>{e.prototype=Object.create(t.prototype,s),e.prototype.constructor=e,Object.defineProperty(e,"super",{value:t.prototype}),n&&Object.assign(e.prototype,n)},sd=(e,t,n,s)=>{let o,r,i;const a={};if(t=t||{},e==null)return t;do{for(o=Object.getOwnPropertyNames(e),r=o.length;r-- >0;)i=o[r],(!s||s(i,e,t))&&!a[i]&&(t[i]=e[i],a[i]=!0);e=n!==!1&&$o(e)}while(e&&(!n||n(e,t))&&e!==Object.prototype);return t},od=(e,t,n)=>{e=String(e),(n===void 0||n>e.length)&&(n=e.length),n-=t.length;const s=e.indexOf(t,n);return s!==-1&&s===n},rd=e=>{if(!e)return null;if(nn(e))return e;let t=e.length;if(!Ia(t))return null;const n=new Array(t);for(;t-- >0;)n[t]=e[t];return n},id=(e=>t=>e&&t instanceof e)(typeof Uint8Array<"u"&&$o(Uint8Array)),ad=(e,t)=>{const s=(e&&e[Es]).call(e);let o;for(;(o=s.next())&&!o.done;){const r=o.value;t.call(e,r[0],r[1])}},cd=(e,t)=>{let n;const s=[];for(;(n=e.exec(t))!==null;)s.push(n);return s},ld=tt("HTMLFormElement"),ud=e=>e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,function(n,s,o){return s.toUpperCase()+o}),zr=(({hasOwnProperty:e})=>(t,n)=>e.call(t,n))(Object.prototype),fd=tt("RegExp"),Da=(e,t)=>{const n=Object.getOwnPropertyDescriptors(e),s={};$n(n,(o,r)=>{let i;(i=t(o,r,e))!==!1&&(s[r]=i||o)}),Object.defineProperties(e,s)},dd=e=>{Da(e,(t,n)=>{if(Me(e)&&["arguments","caller","callee"].indexOf(n)!==-1)return!1;const s=e[n];if(Me(s)){if(t.enumerable=!1,"writable"in t){t.writable=!1;return}t.set||(t.set=()=>{throw Error("Can not rewrite read-only method '"+n+"'")})}})},pd=(e,t)=>{const n={},s=o=>{o.forEach(r=>{n[r]=!0})};return nn(e)?s(e):s(String(e).split(t)),n},hd=()=>{},md=(e,t)=>e!=null&&Number.isFinite(e=+e)?e:t;function gd(e){return!!(e&&Me(e.append)&&e[La]==="FormData"&&e[Es])}const bd=e=>{const t=new Array(10),n=(s,o)=>{if(Pn(s)){if(t.indexOf(s)>=0)return;if(On(s))return s;if(!("toJSON"in s)){t[o]=s;const r=nn(s)?[]:{};return $n(s,(i,a)=>{const c=n(i,o+1);!Zt(c)&&(r[a]=c)}),t[o]=void 0,r}}return s};return n(e,0)},yd=tt("AsyncFunction"),_d=e=>e&&(Pn(e)||Me(e))&&Me(e.then)&&Me(e.catch),Ba=((e,t)=>e?setImmediate:t?((n,s)=>(Nt.addEventListener("message",({source:o,data:r})=>{o===Nt&&r===n&&s.length&&s.shift()()},!1),o=>{s.push(o),Nt.postMessage(n,"*")}))(`axios@${Math.random()}`,[]):n=>setTimeout(n))(typeof setImmediate=="function",Me(Nt.postMessage)),vd=typeof queueMicrotask<"u"?queueMicrotask.bind(Nt):typeof process<"u"&&process.nextTick||Ba,wd=e=>e!=null&&Me(e[Es]),_={isArray:nn,isArrayBuffer:Fa,isBuffer:On,isFormData:Wf,isArrayBufferView:jf,isString:Df,isNumber:Ia,isBoolean:Bf,isObject:Pn,isPlainObject:Wn,isEmptyObject:Uf,isReadableStream:Gf,isRequest:Yf,isResponse:Qf,isHeaders:Xf,isUndefined:Zt,isDate:zf,isFile:Hf,isBlob:qf,isRegExp:fd,isFunction:Me,isStream:Kf,isURLSearchParams:Jf,isTypedArray:id,isFileList:Vf,forEach:$n,merge:ao,extend:ed,trim:Zf,stripBOM:td,inherits:nd,toFlatObject:sd,kindOf:Ss,kindOfTest:tt,endsWith:od,toArray:rd,forEachEntry:ad,matchAll:cd,isHTMLForm:ld,hasOwnProperty:zr,hasOwnProp:zr,reduceDescriptors:Da,freezeMethods:dd,toObjectSet:pd,toCamelCase:ud,noop:hd,toFiniteNumber:md,findKey:Ma,global:Nt,isContextDefined:ja,isSpecCompliantForm:gd,toJSONObject:bd,isAsyncFn:yd,isThenable:_d,setImmediate:Ba,asap:vd,isIterable:wd};function Z(e,t,n,s,o){Error.call(this),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack,this.message=e,this.name="AxiosError",t&&(this.code=t),n&&(this.config=n),s&&(this.request=s),o&&(this.response=o,this.status=o.status?o.status:null)}_.inherits(Z,Error,{toJSON:function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:_.toJSONObject(this.config),code:this.code,status:this.status}}});const Ua=Z.prototype,za={};["ERR_BAD_OPTION_VALUE","ERR_BAD_OPTION","ECONNABORTED","ETIMEDOUT","ERR_NETWORK","ERR_FR_TOO_MANY_REDIRECTS","ERR_DEPRECATED","ERR_BAD_RESPONSE","ERR_BAD_REQUEST","ERR_CANCELED","ERR_NOT_SUPPORT","ERR_INVALID_URL"].forEach(e=>{za[e]={value:e}});Object.defineProperties(Z,za);Object.defineProperty(Ua,"isAxiosError",{value:!0});Z.from=(e,t,n,s,o,r)=>{const i=Object.create(Ua);_.toFlatObject(e,i,function(u){return u!==Error.prototype},l=>l!=="isAxiosError");const a=e&&e.message?e.message:"Error",c=t==null&&e?e.code:t;return Z.call(i,a,c,n,s,o),e&&i.cause==null&&Object.defineProperty(i,"cause",{value:e,configurable:!0}),i.name=e&&e.name||"Error",r&&Object.assign(i,r),i};const xd=null;function co(e){return _.isPlainObject(e)||_.isArray(e)}function Ha(e){return _.endsWith(e,"[]")?e.slice(0,-2):e}function Hr(e,t,n){return e?e.concat(t).map(function(o,r){return o=Ha(o),!n&&r?"["+o+"]":o}).join(n?".":""):t}function Ed(e){return _.isArray(e)&&!e.some(co)}const Sd=_.toFlatObject(_,{},null,function(t){return/^is[A-Z]/.test(t)});function Rs(e,t,n){if(!_.isObject(e))throw new TypeError("target must be an object");t=t||new FormData,n=_.toFlatObject(n,{metaTokens:!0,dots:!1,indexes:!1},!1,function(y,v){return!_.isUndefined(v[y])});const s=n.metaTokens,o=n.visitor||u,r=n.dots,i=n.indexes,c=(n.Blob||typeof Blob<"u"&&Blob)&&_.isSpecCompliantForm(t);if(!_.isFunction(o))throw new TypeError("visitor must be a function");function l(g){if(g===null)return"";if(_.isDate(g))return g.toISOString();if(_.isBoolean(g))return g.toString();if(!c&&_.isBlob(g))throw new Z("Blob is not supported. Use a Buffer instead.");return _.isArrayBuffer(g)||_.isTypedArray(g)?c&&typeof Blob=="function"?new Blob([g]):Buffer.from(g):g}function u(g,y,v){let k=g;if(g&&!v&&typeof g=="object"){if(_.endsWith(y,"{}"))y=s?y:y.slice(0,-2),g=JSON.stringify(g);else if(_.isArray(g)&&Ed(g)||(_.isFileList(g)||_.endsWith(y,"[]"))&&(k=_.toArray(g)))return y=Ha(y),k.forEach(function(T,D){!(_.isUndefined(T)||T===null)&&t.append(i===!0?Hr([y],D,r):i===null?y:y+"[]",l(T))}),!1}return co(g)?!0:(t.append(Hr(v,y,r),l(g)),!1)}const f=[],p=Object.assign(Sd,{defaultVisitor:u,convertValue:l,isVisitable:co});function m(g,y){if(!_.isUndefined(g)){if(f.indexOf(g)!==-1)throw Error("Circular reference detected in "+y.join("."));f.push(g),_.forEach(g,function(k,N){(!(_.isUndefined(k)||k===null)&&o.call(t,k,_.isString(N)?N.trim():N,y,p))===!0&&m(k,y?y.concat(N):[N])}),f.pop()}}if(!_.isObject(e))throw new TypeError("data must be an object");return m(e),t}function qr(e){const t={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+","%00":"\0"};return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g,function(s){return t[s]})}function No(e,t){this._pairs=[],e&&Rs(e,this,t)}const qa=No.prototype;qa.append=function(t,n){this._pairs.push([t,n])};qa.toString=function(t){const n=t?function(s){return t.call(this,s,qr)}:qr;return this._pairs.map(function(o){return n(o[0])+"="+n(o[1])},"").join("&")};function Cd(e){return encodeURIComponent(e).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+")}function Va(e,t,n){if(!t)return e;const s=n&&n.encode||Cd;_.isFunction(n)&&(n={serialize:n});const o=n&&n.serialize;let r;if(o?r=o(t,n):r=_.isURLSearchParams(t)?t.toString():new No(t,n).toString(s),r){const i=e.indexOf("#");i!==-1&&(e=e.slice(0,i)),e+=(e.indexOf("?")===-1?"?":"&")+r}return e}class Vr{constructor(){this.handlers=[]}use(t,n,s){return this.handlers.push({fulfilled:t,rejected:n,synchronous:s?s.synchronous:!1,runWhen:s?s.runWhen:null}),this.handlers.length-1}eject(t){this.handlers[t]&&(this.handlers[t]=null)}clear(){this.handlers&&(this.handlers=[])}forEach(t){_.forEach(this.handlers,function(s){s!==null&&t(s)})}}const Ka={silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1},Rd=typeof URLSearchParams<"u"?URLSearchParams:No,kd=typeof FormData<"u"?FormData:null,Td=typeof Blob<"u"?Blob:null,Ad={isBrowser:!0,classes:{URLSearchParams:Rd,FormData:kd,Blob:Td},protocols:["http","https","file","blob","url","data"]},Lo=typeof window<"u"&&typeof document<"u",lo=typeof navigator=="object"&&navigator||void 0,Od=Lo&&(!lo||["ReactNative","NativeScript","NS"].indexOf(lo.product)<0),Pd=typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope&&typeof self.importScripts=="function",$d=Lo&&window.location.href||"http://localhost",Nd=Object.freeze(Object.defineProperty({__proto__:null,hasBrowserEnv:Lo,hasStandardBrowserEnv:Od,hasStandardBrowserWebWorkerEnv:Pd,navigator:lo,origin:$d},Symbol.toStringTag,{value:"Module"})),Pe={...Nd,...Ad};function Ld(e,t){return Rs(e,new Pe.classes.URLSearchParams,{visitor:function(n,s,o,r){return Pe.isNode&&_.isBuffer(n)?(this.append(s,n.toString("base64")),!1):r.defaultVisitor.apply(this,arguments)},...t})}function Fd(e){return _.matchAll(/\w+|\[(\w*)]/g,e).map(t=>t[0]==="[]"?"":t[1]||t[0])}function Id(e){const t={},n=Object.keys(e);let s;const o=n.length;let r;for(s=0;s<o;s++)r=n[s],t[r]=e[r];return t}function Wa(e){function t(n,s,o,r){let i=n[r++];if(i==="__proto__")return!0;const a=Number.isFinite(+i),c=r>=n.length;return i=!i&&_.isArray(o)?o.length:i,c?(_.hasOwnProp(o,i)?o[i]=[o[i],s]:o[i]=s,!a):((!o[i]||!_.isObject(o[i]))&&(o[i]=[]),t(n,s,o[i],r)&&_.isArray(o[i])&&(o[i]=Id(o[i])),!a)}if(_.isFormData(e)&&_.isFunction(e.entries)){const n={};return _.forEachEntry(e,(s,o)=>{t(Fd(s),o,n,0)}),n}return null}function Md(e,t,n){if(_.isString(e))try{return(t||JSON.parse)(e),_.trim(e)}catch(s){if(s.name!=="SyntaxError")throw s}return(n||JSON.stringify)(e)}const Nn={transitional:Ka,adapter:["xhr","http","fetch"],transformRequest:[function(t,n){const s=n.getContentType()||"",o=s.indexOf("application/json")>-1,r=_.isObject(t);if(r&&_.isHTMLForm(t)&&(t=new FormData(t)),_.isFormData(t))return o?JSON.stringify(Wa(t)):t;if(_.isArrayBuffer(t)||_.isBuffer(t)||_.isStream(t)||_.isFile(t)||_.isBlob(t)||_.isReadableStream(t))return t;if(_.isArrayBufferView(t))return t.buffer;if(_.isURLSearchParams(t))return n.setContentType("application/x-www-form-urlencoded;charset=utf-8",!1),t.toString();let a;if(r){if(s.indexOf("application/x-www-form-urlencoded")>-1)return Ld(t,this.formSerializer).toString();if((a=_.isFileList(t))||s.indexOf("multipart/form-data")>-1){const c=this.env&&this.env.FormData;return Rs(a?{"files[]":t}:t,c&&new c,this.formSerializer)}}return r||o?(n.setContentType("application/json",!1),Md(t)):t}],transformResponse:[function(t){const n=this.transitional||Nn.transitional,s=n&&n.forcedJSONParsing,o=this.responseType==="json";if(_.isResponse(t)||_.isReadableStream(t))return t;if(t&&_.isString(t)&&(s&&!this.responseType||o)){const i=!(n&&n.silentJSONParsing)&&o;try{return JSON.parse(t,this.parseReviver)}catch(a){if(i)throw a.name==="SyntaxError"?Z.from(a,Z.ERR_BAD_RESPONSE,this,null,this.response):a}}return t}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,env:{FormData:Pe.classes.FormData,Blob:Pe.classes.Blob},validateStatus:function(t){return t>=200&&t<300},headers:{common:{Accept:"application/json, text/plain, */*","Content-Type":void 0}}};_.forEach(["delete","get","head","post","put","patch"],e=>{Nn.headers[e]={}});const jd=_.toObjectSet(["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"]),Dd=e=>{const t={};let n,s,o;return e&&e.split(`
`).forEach(function(i){o=i.indexOf(":"),n=i.substring(0,o).trim().toLowerCase(),s=i.substring(o+1).trim(),!(!n||t[n]&&jd[n])&&(n==="set-cookie"?t[n]?t[n].push(s):t[n]=[s]:t[n]=t[n]?t[n]+", "+s:s)}),t},Kr=Symbol("internals");function cn(e){return e&&String(e).trim().toLowerCase()}function Jn(e){return e===!1||e==null?e:_.isArray(e)?e.map(Jn):String(e)}function Bd(e){const t=Object.create(null),n=/([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;let s;for(;s=n.exec(e);)t[s[1]]=s[2];return t}const Ud=e=>/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());function Bs(e,t,n,s,o){if(_.isFunction(s))return s.call(this,t,n);if(o&&(t=n),!!_.isString(t)){if(_.isString(s))return t.indexOf(s)!==-1;if(_.isRegExp(s))return s.test(t)}}function zd(e){return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g,(t,n,s)=>n.toUpperCase()+s)}function Hd(e,t){const n=_.toCamelCase(" "+t);["get","set","has"].forEach(s=>{Object.defineProperty(e,s+n,{value:function(o,r,i){return this[s].call(this,t,o,r,i)},configurable:!0})})}let je=class{constructor(t){t&&this.set(t)}set(t,n,s){const o=this;function r(a,c,l){const u=cn(c);if(!u)throw new Error("header name must be a non-empty string");const f=_.findKey(o,u);(!f||o[f]===void 0||l===!0||l===void 0&&o[f]!==!1)&&(o[f||c]=Jn(a))}const i=(a,c)=>_.forEach(a,(l,u)=>r(l,u,c));if(_.isPlainObject(t)||t instanceof this.constructor)i(t,n);else if(_.isString(t)&&(t=t.trim())&&!Ud(t))i(Dd(t),n);else if(_.isObject(t)&&_.isIterable(t)){let a={},c,l;for(const u of t){if(!_.isArray(u))throw TypeError("Object iterator must return a key-value pair");a[l=u[0]]=(c=a[l])?_.isArray(c)?[...c,u[1]]:[c,u[1]]:u[1]}i(a,n)}else t!=null&&r(n,t,s);return this}get(t,n){if(t=cn(t),t){const s=_.findKey(this,t);if(s){const o=this[s];if(!n)return o;if(n===!0)return Bd(o);if(_.isFunction(n))return n.call(this,o,s);if(_.isRegExp(n))return n.exec(o);throw new TypeError("parser must be boolean|regexp|function")}}}has(t,n){if(t=cn(t),t){const s=_.findKey(this,t);return!!(s&&this[s]!==void 0&&(!n||Bs(this,this[s],s,n)))}return!1}delete(t,n){const s=this;let o=!1;function r(i){if(i=cn(i),i){const a=_.findKey(s,i);a&&(!n||Bs(s,s[a],a,n))&&(delete s[a],o=!0)}}return _.isArray(t)?t.forEach(r):r(t),o}clear(t){const n=Object.keys(this);let s=n.length,o=!1;for(;s--;){const r=n[s];(!t||Bs(this,this[r],r,t,!0))&&(delete this[r],o=!0)}return o}normalize(t){const n=this,s={};return _.forEach(this,(o,r)=>{const i=_.findKey(s,r);if(i){n[i]=Jn(o),delete n[r];return}const a=t?zd(r):String(r).trim();a!==r&&delete n[r],n[a]=Jn(o),s[a]=!0}),this}concat(...t){return this.constructor.concat(this,...t)}toJSON(t){const n=Object.create(null);return _.forEach(this,(s,o)=>{s!=null&&s!==!1&&(n[o]=t&&_.isArray(s)?s.join(", "):s)}),n}[Symbol.iterator](){return Object.entries(this.toJSON())[Symbol.iterator]()}toString(){return Object.entries(this.toJSON()).map(([t,n])=>t+": "+n).join(`
`)}getSetCookie(){return this.get("set-cookie")||[]}get[Symbol.toStringTag](){return"AxiosHeaders"}static from(t){return t instanceof this?t:new this(t)}static concat(t,...n){const s=new this(t);return n.forEach(o=>s.set(o)),s}static accessor(t){const s=(this[Kr]=this[Kr]={accessors:{}}).accessors,o=this.prototype;function r(i){const a=cn(i);s[a]||(Hd(o,i),s[a]=!0)}return _.isArray(t)?t.forEach(r):r(t),this}};je.accessor(["Content-Type","Content-Length","Accept","Accept-Encoding","User-Agent","Authorization"]);_.reduceDescriptors(je.prototype,({value:e},t)=>{let n=t[0].toUpperCase()+t.slice(1);return{get:()=>e,set(s){this[n]=s}}});_.freezeMethods(je);function Us(e,t){const n=this||Nn,s=t||n,o=je.from(s.headers);let r=s.data;return _.forEach(e,function(a){r=a.call(n,r,o.normalize(),t?t.status:void 0)}),o.normalize(),r}function Ja(e){return!!(e&&e.__CANCEL__)}function sn(e,t,n){Z.call(this,e??"canceled",Z.ERR_CANCELED,t,n),this.name="CanceledError"}_.inherits(sn,Z,{__CANCEL__:!0});function Ga(e,t,n){const s=n.config.validateStatus;!n.status||!s||s(n.status)?e(n):t(new Z("Request failed with status code "+n.status,[Z.ERR_BAD_REQUEST,Z.ERR_BAD_RESPONSE][Math.floor(n.status/100)-4],n.config,n.request,n))}function qd(e){const t=/^([-+\w]{1,25})(:?\/\/|:)/.exec(e);return t&&t[1]||""}function Vd(e,t){e=e||10;const n=new Array(e),s=new Array(e);let o=0,r=0,i;return t=t!==void 0?t:1e3,function(c){const l=Date.now(),u=s[r];i||(i=l),n[o]=c,s[o]=l;let f=r,p=0;for(;f!==o;)p+=n[f++],f=f%e;if(o=(o+1)%e,o===r&&(r=(r+1)%e),l-i<t)return;const m=u&&l-u;return m?Math.round(p*1e3/m):void 0}}function Kd(e,t){let n=0,s=1e3/t,o,r;const i=(l,u=Date.now())=>{n=u,o=null,r&&(clearTimeout(r),r=null),e(...l)};return[(...l)=>{const u=Date.now(),f=u-n;f>=s?i(l,u):(o=l,r||(r=setTimeout(()=>{r=null,i(o)},s-f)))},()=>o&&i(o)]}const ns=(e,t,n=3)=>{let s=0;const o=Vd(50,250);return Kd(r=>{const i=r.loaded,a=r.lengthComputable?r.total:void 0,c=i-s,l=o(c),u=i<=a;s=i;const f={loaded:i,total:a,progress:a?i/a:void 0,bytes:c,rate:l||void 0,estimated:l&&a&&u?(a-i)/l:void 0,event:r,lengthComputable:a!=null,[t?"download":"upload"]:!0};e(f)},n)},Wr=(e,t)=>{const n=e!=null;return[s=>t[0]({lengthComputable:n,total:e,loaded:s}),t[1]]},Jr=e=>(...t)=>_.asap(()=>e(...t)),Wd=Pe.hasStandardBrowserEnv?((e,t)=>n=>(n=new URL(n,Pe.origin),e.protocol===n.protocol&&e.host===n.host&&(t||e.port===n.port)))(new URL(Pe.origin),Pe.navigator&&/(msie|trident)/i.test(Pe.navigator.userAgent)):()=>!0,Jd=Pe.hasStandardBrowserEnv?{write(e,t,n,s,o,r,i){if(typeof document>"u")return;const a=[`${e}=${encodeURIComponent(t)}`];_.isNumber(n)&&a.push(`expires=${new Date(n).toUTCString()}`),_.isString(s)&&a.push(`path=${s}`),_.isString(o)&&a.push(`domain=${o}`),r===!0&&a.push("secure"),_.isString(i)&&a.push(`SameSite=${i}`),document.cookie=a.join("; ")},read(e){if(typeof document>"u")return null;const t=document.cookie.match(new RegExp("(?:^|; )"+e+"=([^;]*)"));return t?decodeURIComponent(t[1]):null},remove(e){this.write(e,"",Date.now()-864e5,"/")}}:{write(){},read(){return null},remove(){}};function Gd(e){return/^([a-z][a-z\d+\-.]*:)?\/\//i.test(e)}function Yd(e,t){return t?e.replace(/\/?\/$/,"")+"/"+t.replace(/^\/+/,""):e}function Ya(e,t,n){let s=!Gd(t);return e&&(s||n==!1)?Yd(e,t):t}const Gr=e=>e instanceof je?{...e}:e;function Mt(e,t){t=t||{};const n={};function s(l,u,f,p){return _.isPlainObject(l)&&_.isPlainObject(u)?_.merge.call({caseless:p},l,u):_.isPlainObject(u)?_.merge({},u):_.isArray(u)?u.slice():u}function o(l,u,f,p){if(_.isUndefined(u)){if(!_.isUndefined(l))return s(void 0,l,f,p)}else return s(l,u,f,p)}function r(l,u){if(!_.isUndefined(u))return s(void 0,u)}function i(l,u){if(_.isUndefined(u)){if(!_.isUndefined(l))return s(void 0,l)}else return s(void 0,u)}function a(l,u,f){if(f in t)return s(l,u);if(f in e)return s(void 0,l)}const c={url:r,method:r,data:r,baseURL:i,transformRequest:i,transformResponse:i,paramsSerializer:i,timeout:i,timeoutMessage:i,withCredentials:i,withXSRFToken:i,adapter:i,responseType:i,xsrfCookieName:i,xsrfHeaderName:i,onUploadProgress:i,onDownloadProgress:i,decompress:i,maxContentLength:i,maxBodyLength:i,beforeRedirect:i,transport:i,httpAgent:i,httpsAgent:i,cancelToken:i,socketPath:i,responseEncoding:i,validateStatus:a,headers:(l,u,f)=>o(Gr(l),Gr(u),f,!0)};return _.forEach(Object.keys({...e,...t}),function(u){const f=c[u]||o,p=f(e[u],t[u],u);_.isUndefined(p)&&f!==a||(n[u]=p)}),n}const Qa=e=>{const t=Mt({},e);let{data:n,withXSRFToken:s,xsrfHeaderName:o,xsrfCookieName:r,headers:i,auth:a}=t;if(t.headers=i=je.from(i),t.url=Va(Ya(t.baseURL,t.url,t.allowAbsoluteUrls),e.params,e.paramsSerializer),a&&i.set("Authorization","Basic "+btoa((a.username||"")+":"+(a.password?unescape(encodeURIComponent(a.password)):""))),_.isFormData(n)){if(Pe.hasStandardBrowserEnv||Pe.hasStandardBrowserWebWorkerEnv)i.setContentType(void 0);else if(_.isFunction(n.getHeaders)){const c=n.getHeaders(),l=["content-type","content-length"];Object.entries(c).forEach(([u,f])=>{l.includes(u.toLowerCase())&&i.set(u,f)})}}if(Pe.hasStandardBrowserEnv&&(s&&_.isFunction(s)&&(s=s(t)),s||s!==!1&&Wd(t.url))){const c=o&&r&&Jd.read(r);c&&i.set(o,c)}return t},Qd=typeof XMLHttpRequest<"u",Xd=Qd&&function(e){return new Promise(function(n,s){const o=Qa(e);let r=o.data;const i=je.from(o.headers).normalize();let{responseType:a,onUploadProgress:c,onDownloadProgress:l}=o,u,f,p,m,g;function y(){m&&m(),g&&g(),o.cancelToken&&o.cancelToken.unsubscribe(u),o.signal&&o.signal.removeEventListener("abort",u)}let v=new XMLHttpRequest;v.open(o.method.toUpperCase(),o.url,!0),v.timeout=o.timeout;function k(){if(!v)return;const T=je.from("getAllResponseHeaders"in v&&v.getAllResponseHeaders()),W={data:!a||a==="text"||a==="json"?v.responseText:v.response,status:v.status,statusText:v.statusText,headers:T,config:e,request:v};Ga(function(Y){n(Y),y()},function(Y){s(Y),y()},W),v=null}"onloadend"in v?v.onloadend=k:v.onreadystatechange=function(){!v||v.readyState!==4||v.status===0&&!(v.responseURL&&v.responseURL.indexOf("file:")===0)||setTimeout(k)},v.onabort=function(){v&&(s(new Z("Request aborted",Z.ECONNABORTED,e,v)),v=null)},v.onerror=function(D){const W=D&&D.message?D.message:"Network Error",L=new Z(W,Z.ERR_NETWORK,e,v);L.event=D||null,s(L),v=null},v.ontimeout=function(){let D=o.timeout?"timeout of "+o.timeout+"ms exceeded":"timeout exceeded";const W=o.transitional||Ka;o.timeoutErrorMessage&&(D=o.timeoutErrorMessage),s(new Z(D,W.clarifyTimeoutError?Z.ETIMEDOUT:Z.ECONNABORTED,e,v)),v=null},r===void 0&&i.setContentType(null),"setRequestHeader"in v&&_.forEach(i.toJSON(),function(D,W){v.setRequestHeader(W,D)}),_.isUndefined(o.withCredentials)||(v.withCredentials=!!o.withCredentials),a&&a!=="json"&&(v.responseType=o.responseType),l&&([p,g]=ns(l,!0),v.addEventListener("progress",p)),c&&v.upload&&([f,m]=ns(c),v.upload.addEventListener("progress",f),v.upload.addEventListener("loadend",m)),(o.cancelToken||o.signal)&&(u=T=>{v&&(s(!T||T.type?new sn(null,e,v):T),v.abort(),v=null)},o.cancelToken&&o.cancelToken.subscribe(u),o.signal&&(o.signal.aborted?u():o.signal.addEventListener("abort",u)));const N=qd(o.url);if(N&&Pe.protocols.indexOf(N)===-1){s(new Z("Unsupported protocol "+N+":",Z.ERR_BAD_REQUEST,e));return}v.send(r||null)})},Zd=(e,t)=>{const{length:n}=e=e?e.filter(Boolean):[];if(t||n){let s=new AbortController,o;const r=function(l){if(!o){o=!0,a();const u=l instanceof Error?l:this.reason;s.abort(u instanceof Z?u:new sn(u instanceof Error?u.message:u))}};let i=t&&setTimeout(()=>{i=null,r(new Z(`timeout ${t} of ms exceeded`,Z.ETIMEDOUT))},t);const a=()=>{e&&(i&&clearTimeout(i),i=null,e.forEach(l=>{l.unsubscribe?l.unsubscribe(r):l.removeEventListener("abort",r)}),e=null)};e.forEach(l=>l.addEventListener("abort",r));const{signal:c}=s;return c.unsubscribe=()=>_.asap(a),c}},ep=function*(e,t){let n=e.byteLength;if(n<t){yield e;return}let s=0,o;for(;s<n;)o=s+t,yield e.slice(s,o),s=o},tp=async function*(e,t){for await(const n of np(e))yield*ep(n,t)},np=async function*(e){if(e[Symbol.asyncIterator]){yield*e;return}const t=e.getReader();try{for(;;){const{done:n,value:s}=await t.read();if(n)break;yield s}}finally{await t.cancel()}},Yr=(e,t,n,s)=>{const o=tp(e,t);let r=0,i,a=c=>{i||(i=!0,s&&s(c))};return new ReadableStream({async pull(c){try{const{done:l,value:u}=await o.next();if(l){a(),c.close();return}let f=u.byteLength;if(n){let p=r+=f;n(p)}c.enqueue(new Uint8Array(u))}catch(l){throw a(l),l}},cancel(c){return a(c),o.return()}},{highWaterMark:2})},Qr=64*1024,{isFunction:Un}=_,sp=(({Request:e,Response:t})=>({Request:e,Response:t}))(_.global),{ReadableStream:Xr,TextEncoder:Zr}=_.global,ei=(e,...t)=>{try{return!!e(...t)}catch{return!1}},op=e=>{e=_.merge.call({skipUndefined:!0},sp,e);const{fetch:t,Request:n,Response:s}=e,o=t?Un(t):typeof fetch=="function",r=Un(n),i=Un(s);if(!o)return!1;const a=o&&Un(Xr),c=o&&(typeof Zr=="function"?(g=>y=>g.encode(y))(new Zr):async g=>new Uint8Array(await new n(g).arrayBuffer())),l=r&&a&&ei(()=>{let g=!1;const y=new n(Pe.origin,{body:new Xr,method:"POST",get duplex(){return g=!0,"half"}}).headers.has("Content-Type");return g&&!y}),u=i&&a&&ei(()=>_.isReadableStream(new s("").body)),f={stream:u&&(g=>g.body)};o&&["text","arrayBuffer","blob","formData","stream"].forEach(g=>{!f[g]&&(f[g]=(y,v)=>{let k=y&&y[g];if(k)return k.call(y);throw new Z(`Response type '${g}' is not supported`,Z.ERR_NOT_SUPPORT,v)})});const p=async g=>{if(g==null)return 0;if(_.isBlob(g))return g.size;if(_.isSpecCompliantForm(g))return(await new n(Pe.origin,{method:"POST",body:g}).arrayBuffer()).byteLength;if(_.isArrayBufferView(g)||_.isArrayBuffer(g))return g.byteLength;if(_.isURLSearchParams(g)&&(g=g+""),_.isString(g))return(await c(g)).byteLength},m=async(g,y)=>{const v=_.toFiniteNumber(g.getContentLength());return v??p(y)};return async g=>{let{url:y,method:v,data:k,signal:N,cancelToken:T,timeout:D,onDownloadProgress:W,onUploadProgress:L,responseType:Y,headers:B,withCredentials:re="same-origin",fetchOptions:te}=Qa(g),he=t||fetch;Y=Y?(Y+"").toLowerCase():"text";let j=Zd([N,T&&T.toAbortSignal()],D),ne=null;const J=j&&j.unsubscribe&&(()=>{j.unsubscribe()});let se;try{if(L&&l&&v!=="get"&&v!=="head"&&(se=await m(B,k))!==0){let pe=new n(y,{method:"POST",body:k,duplex:"half"}),be;if(_.isFormData(k)&&(be=pe.headers.get("content-type"))&&B.setContentType(be),pe.body){const[Ue,Je]=Wr(se,ns(Jr(L)));k=Yr(pe.body,Qr,Ue,Je)}}_.isString(re)||(re=re?"include":"omit");const q=r&&"credentials"in n.prototype,F={...te,signal:j,method:v.toUpperCase(),headers:B.normalize().toJSON(),body:k,duplex:"half",credentials:q?re:void 0};ne=r&&new n(y,F);let z=await(r?he(ne,te):he(y,F));const ce=u&&(Y==="stream"||Y==="response");if(u&&(W||ce&&J)){const pe={};["status","statusText","headers"].forEach(kt=>{pe[kt]=z[kt]});const be=_.toFiniteNumber(z.headers.get("content-length")),[Ue,Je]=W&&Wr(be,ns(Jr(W),!0))||[];z=new s(Yr(z.body,Qr,Ue,()=>{Je&&Je(),J&&J()}),pe)}Y=Y||"text";let Te=await f[_.findKey(f,Y)||"text"](z,g);return!ce&&J&&J(),await new Promise((pe,be)=>{Ga(pe,be,{data:Te,headers:je.from(z.headers),status:z.status,statusText:z.statusText,config:g,request:ne})})}catch(q){throw J&&J(),q&&q.name==="TypeError"&&/Load failed|fetch/i.test(q.message)?Object.assign(new Z("Network Error",Z.ERR_NETWORK,g,ne),{cause:q.cause||q}):Z.from(q,q&&q.code,g,ne)}}},rp=new Map,Xa=e=>{let t=e&&e.env||{};const{fetch:n,Request:s,Response:o}=t,r=[s,o,n];let i=r.length,a=i,c,l,u=rp;for(;a--;)c=r[a],l=u.get(c),l===void 0&&u.set(c,l=a?new Map:op(t)),u=l;return l};Xa();const Fo={http:xd,xhr:Xd,fetch:{get:Xa}};_.forEach(Fo,(e,t)=>{if(e){try{Object.defineProperty(e,"name",{value:t})}catch{}Object.defineProperty(e,"adapterName",{value:t})}});const ti=e=>`- ${e}`,ip=e=>_.isFunction(e)||e===null||e===!1;function ap(e,t){e=_.isArray(e)?e:[e];const{length:n}=e;let s,o;const r={};for(let i=0;i<n;i++){s=e[i];let a;if(o=s,!ip(s)&&(o=Fo[(a=String(s)).toLowerCase()],o===void 0))throw new Z(`Unknown adapter '${a}'`);if(o&&(_.isFunction(o)||(o=o.get(t))))break;r[a||"#"+i]=o}if(!o){const i=Object.entries(r).map(([c,l])=>`adapter ${c} `+(l===!1?"is not supported by the environment":"is not available in the build"));let a=n?i.length>1?`since :
`+i.map(ti).join(`
`):" "+ti(i[0]):"as no adapter specified";throw new Z("There is no suitable adapter to dispatch the request "+a,"ERR_NOT_SUPPORT")}return o}const Za={getAdapter:ap,adapters:Fo};function zs(e){if(e.cancelToken&&e.cancelToken.throwIfRequested(),e.signal&&e.signal.aborted)throw new sn(null,e)}function ni(e){return zs(e),e.headers=je.from(e.headers),e.data=Us.call(e,e.transformRequest),["post","put","patch"].indexOf(e.method)!==-1&&e.headers.setContentType("application/x-www-form-urlencoded",!1),Za.getAdapter(e.adapter||Nn.adapter,e)(e).then(function(s){return zs(e),s.data=Us.call(e,e.transformResponse,s),s.headers=je.from(s.headers),s},function(s){return Ja(s)||(zs(e),s&&s.response&&(s.response.data=Us.call(e,e.transformResponse,s.response),s.response.headers=je.from(s.response.headers))),Promise.reject(s)})}const ec="1.13.2",ks={};["object","boolean","number","function","string","symbol"].forEach((e,t)=>{ks[e]=function(s){return typeof s===e||"a"+(t<1?"n ":" ")+e}});const si={};ks.transitional=function(t,n,s){function o(r,i){return"[Axios v"+ec+"] Transitional option '"+r+"'"+i+(s?". "+s:"")}return(r,i,a)=>{if(t===!1)throw new Z(o(i," has been removed"+(n?" in "+n:"")),Z.ERR_DEPRECATED);return n&&!si[i]&&(si[i]=!0,console.warn(o(i," has been deprecated since v"+n+" and will be removed in the near future"))),t?t(r,i,a):!0}};ks.spelling=function(t){return(n,s)=>(console.warn(`${s} is likely a misspelling of ${t}`),!0)};function cp(e,t,n){if(typeof e!="object")throw new Z("options must be an object",Z.ERR_BAD_OPTION_VALUE);const s=Object.keys(e);let o=s.length;for(;o-- >0;){const r=s[o],i=t[r];if(i){const a=e[r],c=a===void 0||i(a,r,e);if(c!==!0)throw new Z("option "+r+" must be "+c,Z.ERR_BAD_OPTION_VALUE);continue}if(n!==!0)throw new Z("Unknown option "+r,Z.ERR_BAD_OPTION)}}const Gn={assertOptions:cp,validators:ks},ot=Gn.validators;let It=class{constructor(t){this.defaults=t||{},this.interceptors={request:new Vr,response:new Vr}}async request(t,n){try{return await this._request(t,n)}catch(s){if(s instanceof Error){let o={};Error.captureStackTrace?Error.captureStackTrace(o):o=new Error;const r=o.stack?o.stack.replace(/^.+\n/,""):"";try{s.stack?r&&!String(s.stack).endsWith(r.replace(/^.+\n.+\n/,""))&&(s.stack+=`
`+r):s.stack=r}catch{}}throw s}}_request(t,n){typeof t=="string"?(n=n||{},n.url=t):n=t||{},n=Mt(this.defaults,n);const{transitional:s,paramsSerializer:o,headers:r}=n;s!==void 0&&Gn.assertOptions(s,{silentJSONParsing:ot.transitional(ot.boolean),forcedJSONParsing:ot.transitional(ot.boolean),clarifyTimeoutError:ot.transitional(ot.boolean)},!1),o!=null&&(_.isFunction(o)?n.paramsSerializer={serialize:o}:Gn.assertOptions(o,{encode:ot.function,serialize:ot.function},!0)),n.allowAbsoluteUrls!==void 0||(this.defaults.allowAbsoluteUrls!==void 0?n.allowAbsoluteUrls=this.defaults.allowAbsoluteUrls:n.allowAbsoluteUrls=!0),Gn.assertOptions(n,{baseUrl:ot.spelling("baseURL"),withXsrfToken:ot.spelling("withXSRFToken")},!0),n.method=(n.method||this.defaults.method||"get").toLowerCase();let i=r&&_.merge(r.common,r[n.method]);r&&_.forEach(["delete","get","head","post","put","patch","common"],g=>{delete r[g]}),n.headers=je.concat(i,r);const a=[];let c=!0;this.interceptors.request.forEach(function(y){typeof y.runWhen=="function"&&y.runWhen(n)===!1||(c=c&&y.synchronous,a.unshift(y.fulfilled,y.rejected))});const l=[];this.interceptors.response.forEach(function(y){l.push(y.fulfilled,y.rejected)});let u,f=0,p;if(!c){const g=[ni.bind(this),void 0];for(g.unshift(...a),g.push(...l),p=g.length,u=Promise.resolve(n);f<p;)u=u.then(g[f++],g[f++]);return u}p=a.length;let m=n;for(;f<p;){const g=a[f++],y=a[f++];try{m=g(m)}catch(v){y.call(this,v);break}}try{u=ni.call(this,m)}catch(g){return Promise.reject(g)}for(f=0,p=l.length;f<p;)u=u.then(l[f++],l[f++]);return u}getUri(t){t=Mt(this.defaults,t);const n=Ya(t.baseURL,t.url,t.allowAbsoluteUrls);return Va(n,t.params,t.paramsSerializer)}};_.forEach(["delete","get","head","options"],function(t){It.prototype[t]=function(n,s){return this.request(Mt(s||{},{method:t,url:n,data:(s||{}).data}))}});_.forEach(["post","put","patch"],function(t){function n(s){return function(r,i,a){return this.request(Mt(a||{},{method:t,headers:s?{"Content-Type":"multipart/form-data"}:{},url:r,data:i}))}}It.prototype[t]=n(),It.prototype[t+"Form"]=n(!0)});let lp=class tc{constructor(t){if(typeof t!="function")throw new TypeError("executor must be a function.");let n;this.promise=new Promise(function(r){n=r});const s=this;this.promise.then(o=>{if(!s._listeners)return;let r=s._listeners.length;for(;r-- >0;)s._listeners[r](o);s._listeners=null}),this.promise.then=o=>{let r;const i=new Promise(a=>{s.subscribe(a),r=a}).then(o);return i.cancel=function(){s.unsubscribe(r)},i},t(function(r,i,a){s.reason||(s.reason=new sn(r,i,a),n(s.reason))})}throwIfRequested(){if(this.reason)throw this.reason}subscribe(t){if(this.reason){t(this.reason);return}this._listeners?this._listeners.push(t):this._listeners=[t]}unsubscribe(t){if(!this._listeners)return;const n=this._listeners.indexOf(t);n!==-1&&this._listeners.splice(n,1)}toAbortSignal(){const t=new AbortController,n=s=>{t.abort(s)};return this.subscribe(n),t.signal.unsubscribe=()=>this.unsubscribe(n),t.signal}static source(){let t;return{token:new tc(function(o){t=o}),cancel:t}}};function up(e){return function(n){return e.apply(null,n)}}function fp(e){return _.isObject(e)&&e.isAxiosError===!0}const uo={Continue:100,SwitchingProtocols:101,Processing:102,EarlyHints:103,Ok:200,Created:201,Accepted:202,NonAuthoritativeInformation:203,NoContent:204,ResetContent:205,PartialContent:206,MultiStatus:207,AlreadyReported:208,ImUsed:226,MultipleChoices:300,MovedPermanently:301,Found:302,SeeOther:303,NotModified:304,UseProxy:305,Unused:306,TemporaryRedirect:307,PermanentRedirect:308,BadRequest:400,Unauthorized:401,PaymentRequired:402,Forbidden:403,NotFound:404,MethodNotAllowed:405,NotAcceptable:406,ProxyAuthenticationRequired:407,RequestTimeout:408,Conflict:409,Gone:410,LengthRequired:411,PreconditionFailed:412,PayloadTooLarge:413,UriTooLong:414,UnsupportedMediaType:415,RangeNotSatisfiable:416,ExpectationFailed:417,ImATeapot:418,MisdirectedRequest:421,UnprocessableEntity:422,Locked:423,FailedDependency:424,TooEarly:425,UpgradeRequired:426,PreconditionRequired:428,TooManyRequests:429,RequestHeaderFieldsTooLarge:431,UnavailableForLegalReasons:451,InternalServerError:500,NotImplemented:501,BadGateway:502,ServiceUnavailable:503,GatewayTimeout:504,HttpVersionNotSupported:505,VariantAlsoNegotiates:506,InsufficientStorage:507,LoopDetected:508,NotExtended:510,NetworkAuthenticationRequired:511,WebServerIsDown:521,ConnectionTimedOut:522,OriginIsUnreachable:523,TimeoutOccurred:524,SslHandshakeFailed:525,InvalidSslCertificate:526};Object.entries(uo).forEach(([e,t])=>{uo[t]=e});function nc(e){const t=new It(e),n=Na(It.prototype.request,t);return _.extend(n,It.prototype,t,{allOwnKeys:!0}),_.extend(n,t,null,{allOwnKeys:!0}),n.create=function(o){return nc(Mt(e,o))},n}const Ee=nc(Nn);Ee.Axios=It;Ee.CanceledError=sn;Ee.CancelToken=lp;Ee.isCancel=Ja;Ee.VERSION=ec;Ee.toFormData=Rs;Ee.AxiosError=Z;Ee.Cancel=Ee.CanceledError;Ee.all=function(t){return Promise.all(t)};Ee.spread=up;Ee.isAxiosError=fp;Ee.mergeConfig=Mt;Ee.AxiosHeaders=je;Ee.formToJSON=e=>Wa(_.isHTMLForm(e)?new FormData(e):e);Ee.getAdapter=Za.getAdapter;Ee.HttpStatusCode=uo;Ee.default=Ee;const{Axios:$g,AxiosError:Ng,CanceledError:Lg,isCancel:Fg,CancelToken:Ig,VERSION:Mg,all:jg,Cancel:Dg,isAxiosError:Bg,spread:Ug,toFormData:zg,AxiosHeaders:Hg,HttpStatusCode:qg,formToJSON:Vg,getAdapter:Kg,mergeConfig:Wg}=Ee,dp="c9ee964e5a0bffdb2aba28397f852bbf",pp="molishu",hp="https://ws.audioscrobbler.com/2.0/",mp=async()=>(await Ee.get(hp,{params:{method:"user.getrecenttracks",user:pp,api_key:dp,format:"json",limit:50}})).data.recenttracks.track,sc="lostf1sh",gp=async()=>{const t=new Date;t.getFullYear();try{const n=await fetch(`https://github-contributions-api.jogruber.de/v4/${sc}?y=last`);if(!n.ok)throw new Error("Failed to fetch contribution data");const s=await n.json(),o=[];if(s.contributions&&s.contributions.forEach(r=>{o.push({date:r.date,count:r.count})}),o.length>0){const i=new Date(t);i.setDate(i.getDate()-371+1);const a=[];for(let c=0;c<371;c++){const l=new Date(i);l.setDate(l.getDate()+c);const u=l.toISOString().split("T")[0],f=o.find(p=>p.date===u);a.push({date:u,count:f?f.count:0})}return a}throw new Error("No contributions data available")}catch(n){console.error("Error fetching contribution data:",n);const s=new Map;for(let o=53*7-1;o>=0;o--){const r=new Date(t);r.setDate(r.getDate()-o);const i=r.toISOString().split("T")[0];s.set(i,0)}return Array.from(s.entries()).sort((o,r)=>o[0].localeCompare(r[0])).map(([o,r])=>({date:o,count:r}))}},Hs=e=>e===0?0:e<=2?1:e<=5?2:e<=8?3:4,bp=e=>`https://github.com/${sc}?tab=overview&from=${e}&to=${e}`,oc=(e,t)=>{const n=e.__vccOpts||e;for(const[s,o]of t)n[s]=o;return n},Se=e=>(Mi("data-v-3bbf4010"),e=e(),ji(),e),yp={class:"w-full min-h-screen overflow-x-hidden font-mono"},_p={class:"max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"},vp={class:"mb-12"},wp={class:"mb-8"},xp=ys('<div class="text-catppuccin-subtle text-sm mb-2" data-v-3bbf4010> ~$ whoami </div><h1 class="text-3xl md:text-4xl font-bold text-catppuccin-text mb-2" data-v-3bbf4010><span class="text-catppuccin-mauve" data-v-3bbf4010>duhan</span><span class="text-catppuccin-subtle" data-v-3bbf4010>@</span><span class="text-catppuccin-blue" data-v-3bbf4010>f1sh.dev</span></h1>',2),Ep={class:"text-sm text-catppuccin-gray mb-4 flex items-center gap-2"},Sp=Se(()=>w("span",{class:"text-catppuccin-subtle"},"aka ",-1)),Cp=Se(()=>w("span",{class:"text-catppuccin-green"},"moli",-1)),Rp=Se(()=>w("span",{class:"text-catppuccin-surface"},"|",-1)),kp={class:"text-catppuccin-peach"},Tp=Se(()=>w("span",{class:"text-catppuccin-subtle text-xs"},"TRT",-1)),Ap={class:"flex items-center flex-wrap gap-4 text-sm"},Op=Se(()=>w("a",{href:"https://open.spotify.com/user/31q6jft6qtkzisve7zu2o2mytyry?si=1c9f27a30d25435b",target:"_blank",class:"text-catppuccin-subtle hover:text-catppuccin-green transition-colors"}," [spotify] ",-1)),Pp={class:"border-l-2 border-catppuccin-surface pl-4 mb-4"},$p=Se(()=>w("div",{class:"text-catppuccin-subtle text-sm mb-2"}," ~$ cat about.txt ",-1)),Np={class:"text-catppuccin-text leading-relaxed mb-4"},Lp={class:"text-catppuccin-yellow"},Fp={class:"border-l-2 border-catppuccin-surface pl-4 mb-4"},Ip=Se(()=>w("div",{class:"text-catppuccin-subtle text-sm mb-2"}," ~$ ps aux | grep duhan ",-1)),Mp={class:"space-y-1 text-sm"},jp={key:0,class:"flex items-center gap-2"},Dp=Se(()=>w("span",{class:"text-catppuccin-blue"},"discord",-1)),Bp=Se(()=>w("span",{class:"text-catppuccin-subtle"},":",-1)),Up={class:"text-catppuccin-text"},zp={class:"flex items-center gap-2"},Hp=Se(()=>w("span",{class:"text-catppuccin-green"},"spotify",-1)),qp=Se(()=>w("span",{class:"text-catppuccin-subtle"},":",-1)),Vp={key:0,class:"text-catppuccin-text truncate"},Kp={key:1,class:"text-catppuccin-subtle"},Wp={key:1,class:"flex items-center gap-2"},Jp={class:"text-catppuccin-blue"},Gp=Se(()=>w("span",{class:"text-catppuccin-subtle"},":",-1)),Yp={class:"text-catppuccin-text truncate"},Qp={key:0},Xp={key:1,class:"text-catppuccin-subtle"},Zp={key:2},eh=Se(()=>w("div",{class:"border-l-2 border-catppuccin-surface pl-4 mb-4"},[w("div",{class:"text-catppuccin-subtle text-sm mb-2"}," ~$ ls ~/tools "),w("div",{class:"text-sm text-catppuccin-text"}," vue | git | nextjs | dart | python | js/ts | docker | bash | ")],-1)),th={class:"grid lg:grid-cols-2 gap-6"},nh={class:"border-l-2 border-catppuccin-surface pl-4 min-w-0"},sh=Se(()=>w("div",{class:"text-catppuccin-subtle text-sm mb-3"}," ~$ ls ~/projects ",-1)),oh={key:0,class:"space-y-2"},rh=ys('<div class="flex items-start gap-3" data-v-3bbf4010><span class="text-catppuccin-subtle" data-v-3bbf4010>&gt;</span><div class="flex-1 min-w-0" data-v-3bbf4010><div class="h-3 bg-catppuccin-surface/70 rounded w-2/3 mb-2 cursor-blink" data-v-3bbf4010></div><div class="h-2 bg-catppuccin-surface/50 rounded w-1/3 cursor-blink" data-v-3bbf4010></div></div></div>',1),ih=[rh],ah={key:1,class:"text-sm text-catppuccin-subtle"},ch=["href"],lh={class:"flex items-start gap-3 text-sm hover:text-catppuccin-mauve transition-colors px-3 py-2"},uh=Se(()=>w("span",{class:"text-catppuccin-subtle group-hover:text-catppuccin-mauve transition-colors"},">",-1)),fh={class:"flex-1 min-w-0"},dh={class:"flex items-center gap-2"},ph=["title"],hh={key:0,class:"text-catppuccin-yellow text-xs flex-shrink-0"},mh=["title"],gh={key:3,class:"text-sm text-catppuccin-subtle"},bh={class:"border-l-2 border-catppuccin-surface pl-4 min-w-0"},yh=Se(()=>w("div",{class:"text-catppuccin-subtle text-sm mb-3"}," ~$ cat recent_tracks.log ",-1)),_h={key:0,class:"space-y-2"},vh=ys('<div class="flex items-start gap-3" data-v-3bbf4010><span class="text-catppuccin-subtle" data-v-3bbf4010>&gt;</span><div class="flex-1 min-w-0" data-v-3bbf4010><div class="h-3 bg-catppuccin-surface/70 rounded w-2/3 mb-2 cursor-blink" data-v-3bbf4010></div><div class="h-2 bg-catppuccin-surface/50 rounded w-1/3 cursor-blink" data-v-3bbf4010></div></div></div>',1),wh=[vh],xh={key:1,class:"text-sm text-catppuccin-red"},Eh={key:2,class:"text-sm text-catppuccin-subtle"},Sh=["href"],Ch={class:"flex items-start gap-3 text-sm px-3 py-2"},Rh=Se(()=>w("span",{class:"text-catppuccin-green"},"♪",-1)),kh={class:"flex-1 min-w-0"},Th={class:"flex items-center gap-2"},Ah=["title"],Oh=Se(()=>w("span",{class:"text-catppuccin-green text-xs flex-shrink-0"},"[now]",-1)),Ph=["title"],$h=["href"],Nh={class:"flex items-start gap-3 text-sm px-3 py-2"},Lh=Se(()=>w("span",{class:"text-catppuccin-subtle group-hover:text-catppuccin-green transition-colors"},">",-1)),Fh={class:"flex-1 min-w-0"},Ih={class:"flex items-center gap-2"},Mh=["title"],jh={key:0,class:"text-catppuccin-yellow text-xs flex-shrink-0"},Dh=["title"],Bh={class:"mt-6 border-l-2 border-catppuccin-surface pl-4"},Uh={class:"flex items-center justify-between mb-3"},zh=Se(()=>w("div",{class:"text-catppuccin-subtle text-sm"},' ~$ git log --oneline --since="1.year.ago" | wc -l ',-1)),Hh={key:0,class:"flex items-center gap-1 text-[10px] text-catppuccin-subtle"},qh=ys('<span data-v-3bbf4010>less</span><div class="flex gap-[1px]" data-v-3bbf4010><div class="w-2 h-2 rounded-[2px] bg-catppuccin-surface/50" data-v-3bbf4010></div><div class="w-2 h-2 rounded-[2px] bg-catppuccin-green/30" data-v-3bbf4010></div><div class="w-2 h-2 rounded-[2px] bg-catppuccin-green/50" data-v-3bbf4010></div><div class="w-2 h-2 rounded-[2px] bg-catppuccin-green/70" data-v-3bbf4010></div><div class="w-2 h-2 rounded-[2px] bg-catppuccin-green" data-v-3bbf4010></div></div><span data-v-3bbf4010>more</span>',3),Vh=[qh],Kh={key:0},Wh=Se(()=>w("div",{class:"h-[60px] bg-catppuccin-surface/30 rounded cursor-blink"},null,-1)),Jh=[Wh],Gh={key:1},Yh={class:"overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-thin"},Qh={class:"inline-flex md:flex gap-[3px] md:gap-1",style:{"min-width":"max-content"}},Xh=["href","title"],Zh=["title"],em={class:"text-xs text-catppuccin-gray mt-2"},tm={__name:"Home",setup(e){const t=ye(()=>Ce.discordStatusColor),n=ye(()=>Ce.spotify),s=ye(()=>Ce.discordStatus),o=ye(()=>Ce.discordUser),r=ye(()=>Ce.editorActivity),i=ye(()=>Ce.isLoading),a=ye(()=>{if(!r.value)return null;if(r.value.details&&r.value.details.toLowerCase().includes("idling"))return"idling";const J=r.value.name,se=J==="Zed";let q=se?r.value.state||"":r.value.details||"",F=se?r.value.details||"":r.value.state||"";return q=q.replace(/editing /i,"").replace(/working on /i,"").trim(),F=F.replace(/in /i,"").replace(/workspace: /i,"").trim(),{name:J,workspace:F,filename:q}}),c=Le([]),l=Le(!0),u=Le([]),f=Le(!0),p=Le(!0),m=Le(null),g=Le([]),y=Le(!0);let v=null;const k=ye(()=>u.value.find(J=>{var se;return(se=J["@attr"])==null?void 0:se.nowplaying})),N=ye(()=>{const J=u.value.filter(z=>{var ce;return!((ce=z["@attr"])!=null&&ce.nowplaying)}),se=[];let q=null,F=1;return J.forEach((z,ce)=>{var pe,be;const Te=`${z.name}-${z.artist["#text"]}`;if(q===Te)F++;else{if(q){const Ue=J[ce-1];se.push({...Ue,playcount:F,date:(pe=Ue.date)==null?void 0:pe["#text"]})}q=Te,F=1}ce===J.length-1&&se.push({...z,playcount:F,date:(be=z.date)==null?void 0:be["#text"]})}),se.slice(0,10)}),T=ye(()=>c.value.length?[...c.value].sort((J,se)=>se.stargazers_count-J.stargazers_count).slice(0,6):[]),D=async()=>{try{f.value=!0,u.value=await mp(),m.value=null}catch{m.value="couldn't load tracks"}finally{f.value=!1,p.value=!1}},W=async()=>{try{l.value=!0;const se=await(await fetch("https://api.github.com/users/lostf1sh/repos")).json();c.value=Array.isArray(se)?se:[]}catch{}finally{l.value=!1}},L=async()=>{try{y.value=!0,g.value=await gp()}catch{}finally{y.value=!1}},Y=ye(()=>{const J=[];for(let se=0;se<g.value.length;se+=7)J.push(g.value.slice(se,se+7));return J}),B=ye(()=>g.value.reduce((J,se)=>J+se.count,0));ye(()=>{if(!g.value.length)return[];const J=[],se=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];let q=-1;return Y.value.forEach((F,z)=>{const ce=F[0];if(ce){const pe=new Date(ce.date).getMonth();pe!==q&&(J.push({name:se[pe],weekIndex:z}),q=pe)}}),J}),hs(()=>{document.body.classList.add("allow-scroll"),W(),D(),L(),v=setInterval(D,3e4)}),ms(()=>{document.body.classList.remove("allow-scroll"),v&&clearInterval(v)});const re=new Date("2008-06-06T00:00:00"),te=Le(0),he=Le(""),j=()=>{const q=(new Date-re)/(1e3*60*60*24);te.value=q/365.25,requestAnimationFrame(j)},ne=()=>{const J=new Date;he.value=J.toLocaleTimeString("en-US",{hour12:!1,hour:"2-digit",minute:"2-digit",second:"2-digit"}),requestAnimationFrame(ne)};return j(),ne(),(J,se)=>{const q=fs("router-link");return K(),X("div",yp,[w("div",_p,[w("div",vp,[w("div",wp,[xp,w("div",Ep,[Sp,Cp,Rp,w("span",kp,ue(he.value),1),Tp]),w("div",Ap,[me(q,{to:"/blog",class:"text-catppuccin-subtle hover:text-catppuccin-mauve transition-colors"},{default:Ie(()=>[qt(" [blog] ")]),_:1}),me(q,{to:"/github",class:"text-catppuccin-subtle hover:text-catppuccin-text transition-colors"},{default:Ie(()=>[qt(" [github] ")]),_:1}),me(q,{to:"/instagram",class:"text-catppuccin-subtle hover:text-catppuccin-pink transition-colors"},{default:Ie(()=>[qt(" [instagram] ")]),_:1}),Op])]),w("div",Pp,[$p,w("p",Np,[w("span",Lp,ue(te.value.toFixed(10)),1),qt(" y/o junior dev. building stuff and learning along the way. code, table tennis, cooking. based in turkey. ")])]),w("div",Fp,[Ip,w("div",Mp,[!i.value&&o.value?(K(),X("div",jp,[Dp,Bp,w("span",Up,ue(o.value.username),1),w("span",{class:yn(t.value)},"["+ue(s.value)+"]",3)])):rt("",!0),w("div",zp,[Hp,qp,!i.value&&n.value?(K(),X("span",Vp,ue(n.value.song)+" - "+ue(n.value.artist),1)):(K(),X("span",Kp,"not playing"))]),!i.value&&r.value&&a.value&&(a.value.workspace||a.value.filename)?(K(),X("div",Wp,[w("span",Jp,ue(a.value.name==="Zed"?"zed":"vscode"),1),Gp,w("span",Yp,[a.value.workspace?(K(),X("span",Qp,ue(a.value.workspace.toLowerCase()),1)):rt("",!0),a.value.workspace&&a.value.filename?(K(),X("span",Xp," / ")):rt("",!0),a.value.filename?(K(),X("span",Zp,ue(a.value.filename.toLowerCase()),1)):rt("",!0)])])):rt("",!0)])]),eh]),w("div",th,[w("div",nh,[sh,l.value?(K(),X("div",oh,[(K(),X(we,null,ft(6,F=>w("div",{key:`repo-loading-${F}`,class:"rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 p-3"},ih)),64))])):c.value.length?T.value.length?(K(),Cn(Er,{key:2,name:"list",tag:"div",class:"space-y-2"},{default:Ie(()=>[(K(!0),X(we,null,ft(T.value,(F,z)=>(K(),X("a",{key:F.id,href:F.html_url,target:"_blank",style:bn({transitionDelay:`${z*50}ms`}),class:"block group rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 hover:bg-catppuccin-base/30 hover:border-catppuccin-mauve/40"},[w("div",lh,[uh,w("div",fh,[w("div",dh,[w("span",{class:"text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors font-medium truncate",title:F.name},ue(F.name),9,ph),F.stargazers_count>0?(K(),X("span",hh," ★"+ue(F.stargazers_count),1)):rt("",!0)]),w("p",{class:"text-xs text-catppuccin-gray truncate",title:F.description},ue(F.description||"no description"),9,mh)])])],12,ch))),128))]),_:1})):(K(),X("div",gh," no repositories found ")):(K(),X("div",ah," no projects found "))]),w("div",bh,[yh,f.value?(K(),X("div",_h,[(K(),X(we,null,ft(6,F=>w("div",{key:`loading-${F}`,class:"rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 p-3"},wh)),64))])):m.value?(K(),X("div",xh," error: "+ue(m.value),1)):!N.value.length&&!k.value?(K(),X("div",Eh," no tracks found ")):(K(),Cn(Er,{key:3,name:p.value?"":"list",tag:"div",class:"space-y-2"},{default:Ie(()=>[k.value?(K(),X("a",{href:k.value.url,target:"_blank",key:`current-${k.value.name}-${k.value.artist["#text"]}`,class:"block group rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 hover:bg-catppuccin-base/30 hover:border-catppuccin-mauve/40"},[w("div",Ch,[Rh,w("div",kh,[w("div",Th,[w("span",{class:"text-catppuccin-text group-hover:text-catppuccin-green transition-colors truncate",title:k.value.name},ue(k.value.name),9,Ah),Oh]),w("p",{class:"text-xs text-catppuccin-gray truncate",title:k.value.artist["#text"]},ue(k.value.artist["#text"]),9,Ph)])])],8,Sh)):rt("",!0),(K(!0),X(we,null,ft(N.value.slice(0,k.value?5:6),(F,z)=>(K(),X("a",{key:`${F.name}-${F.artist["#text"]}-${F.date}`,href:F.url,target:"_blank",style:bn({transitionDelay:`${(z+(k.value?1:0))*50}ms`}),class:"block group rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 hover:bg-catppuccin-base/30 hover:border-catppuccin-mauve/40"},[w("div",Nh,[Lh,w("div",Fh,[w("div",Ih,[w("span",{class:"text-catppuccin-text group-hover:text-catppuccin-green transition-colors truncate",title:F.name},ue(F.name),9,Mh),F.playcount>1?(K(),X("span",jh," ×"+ue(F.playcount),1)):rt("",!0)]),w("p",{class:"text-xs text-catppuccin-gray truncate",title:F.artist["#text"]},ue(F.artist["#text"]),9,Dh)])])],12,$h))),128))]),_:1},8,["name"]))])]),w("div",Bh,[w("div",Uh,[zh,y.value?rt("",!0):(K(),X("div",Hh,Vh))]),y.value?(K(),X("div",Kh,Jh)):(K(),X("div",Gh,[w("div",Yh,[w("div",Qh,[(K(!0),X(we,null,ft(Y.value,(F,z)=>(K(),X("div",{key:z,class:"flex flex-col gap-[3px] md:gap-1 md:flex-1"},[(K(!0),X(we,null,ft(F,(ce,Te)=>(K(),X(we,{key:Te},[ce.count>0?(K(),X("a",{key:0,href:Ve(bp)(ce.date),target:"_blank",rel:"noopener noreferrer",class:yn(["w-[10px] h-[10px] md:w-auto md:h-auto md:aspect-square rounded-sm transition-all hover:ring-1 hover:ring-catppuccin-green hover:scale-110 cursor-pointer",[Ve(Hs)(ce.count)===1?"bg-catppuccin-green/30 hover:bg-catppuccin-green/40":Ve(Hs)(ce.count)===2?"bg-catppuccin-green/50 hover:bg-catppuccin-green/60":Ve(Hs)(ce.count)===3?"bg-catppuccin-green/70 hover:bg-catppuccin-green/80":"bg-catppuccin-green hover:bg-catppuccin-green"]]),title:`${ce.date}: ${ce.count} contributions - Click to view on GitHub`},null,10,Xh)):(K(),X("div",{key:1,class:"w-[10px] h-[10px] md:w-auto md:h-auto md:aspect-square rounded-sm bg-catppuccin-surface/50",title:`${ce.date}: ${ce.count} contributions`},null,8,Zh))],64))),128))]))),128))])]),w("div",em,ue(B.value)+" contributions in the last year ",1)]))])])])}}},nm=oc(tm,[["__scopeId","data-v-3bbf4010"]]),sm=`---
title: ai browsers are just chromium
date: 2025-10-19
tags: [browsers, ai, tech-criticism]
excerpt: stop shipping chromium with a chatbot sidebar and calling it revolutionary. please.
---

# ai browsers are just chromium

another day, another "revolutionary ai browser" launches. it's just chromium with a sidebar. again.

## the pattern

1. take chromium
2. add ai chatbot in sidebar
3. maybe throw in some "smart" features
4. call it the future of browsing
5. raise $20m

looking at you, comet. and atlas. and literally every other "ai-first" browser.

## what they promise

- "revolutionary browsing experience"
- "ai-powered productivity"
- "the browser reimagined"
- "intelligent web companion"

## what you get

- chromium (again)
- chatgpt/claude in a sidebar
- maybe some summarization features
- 500mb of electron bloat
- another app eating your ram

## the real innovation would be

actually rethinking browsing. not just bolting ai onto the side.

**ideas that would actually be interesting:**
- ai that understands page structure beyond just text
- intelligent tab management that actually works
- privacy-first ai that runs locally
- new ways to navigate the web beyond urls

but no. we get chromium + sidebar. revolutionary.

## why this matters

every new "browser" is just chromium. the web is becoming a monoculture. firefox is hanging on by a thread. safari exists only because apple.

and now ai browsers are making it worse by pretending a wrapper is innovation.

## the sidebar problem

you know what i can do? open chatgpt in a tab. or use raycast. or literally any other tool. 

putting it in a sidebar doesn't make it special. it makes it annoying.

## what i actually want

give me a browser that:
- respects my ram
- doesn't track everything
- has actual innovation in navigation
- integrates ai thoughtfully, not just as a bolt-on
- isn't just chromium in a trench coat

## the truth

these aren't ai browsers. they're chromium distributions with a chatbot. 

stop calling it innovation. it's not. it's lazy.

real innovation would be building something new. but that's hard. wrapping chromium is easy. and vcs love easy.

-- moli`,om=`---
title: designing a terminal aesthetic without going full retro
date: 2025-10-20
tags: [design, ui, tailwind, catppuccin]
excerpt: balancing nostalgia and usability while building the new theme for this site.
---

# designing a terminal aesthetic without going full retro

my site looks like a shell prompt, but that does not mean i want to live in vt100 land. here is how i kept the vibe without the eye strain.

## color choices

- base palette from catppuccin mocha.
- bumped contrast on text by 6 percent for accessibility.
- reserved neon colors for accents only.

## typography

- jetbrains mono for everything, but with tighter letter spacing above 26px.
- headlines use uppercase sparingly to avoid shouting.
- paragraphs stay at 14px with 1.6 line height to mimic terminal proportions.

## micro interactions

- focus rings get a subtle mauve outline instead of pure white.
- list animations use \`transition-delay\` to feel like commands printing.
- cards tilt between 2 and 4 degrees on hover, nodding to crt jitter.

## pitfalls avoided

- no fake scanlines. they age poorly and hurt readability.
- refused to add artificial typing animations on every section.
- kept layout responsive; terminal does not mean fixed width.

## tools

- tailwind for spacing and responsive helpers.
- \`@headlessui/vue\` for accessible menus (even if they look old school).
- figma variables to experiment with contrast quickly.

keeping the aesthetic light enough means i can enjoy the nostalgia while staying productive. feels like the right balance for now.

-- moli
`,rm=`---
title: managing dotfiles with chezmoi
date: 2025-11-20
tags: [dotfiles, chezmoi, automation, dotfiles]
excerpt: finally a dotfiles manager that does not feel like a second job.
---

# managing dotfiles with chezmoi

i tried symlinking manually. i tried git bare repo tricks. i tried ansible. chezmoi is the only one that stuck.

## why it works

chezmoi is idempotent. running it twice does nothing bad. it respects \`$HOME\` and creates symlinks or copies based on your preference.

\`\`\`bash
chezmoi add ~/.zshrc
chezmoi apply
\`\`\`

that's it. no \`Makefile\` gymnastics, no \`stow\` confusion.

## the templating

need different configs for work and home? chezmoi templates with sprig functions.

\`\`\`
{{- if eq .hostname "work-laptop" }}
# work settings
{{- end }}
\`\`\`

handles per-machine config without branching repositories.

## the diff

\`chezmoi diff\` shows exactly what will change before you apply. safety net for people who fear ruining their shell config.

## getting started

\`\`\`bash
brew install chezmoi
chezmoi init --apply https://github.com/yourusername/dotfiles
\`\`\`

migrate existing configs:
\`\`\`bash
chezmoi add ~/.config/alacritty/alacritty.toml
chezmoi status
chezmoi apply
\`\`\`

-- moli
`,im=`---
title: building a heatmap for github contributions
date: 2025-12-10
tags: [visualization, github, vue, d3]
excerpt: recreating the github contribution graph from scratch for my personal website.
---

# building a heatmap for github contributions

github's contribution graph is iconic. i wanted it on my site without their api rate limits.

## the data

github exposes contribution counts at \`https://github.com/users/{username}/contributions\`.

a quick scrape gives you the raw data in html. parsing it is straightforward:

\`\`\`javascript
const data = Array.from(document.querySelectorAll('.day'))
  .map(day => ({
    date: day.dataset.date,
    count: parseInt(day.dataset.count, 10)
  }))
\`\`\`

## the grid

52 weeks × 7 days = 364 squares. css grid makes this trivial:

\`\`\`
display: grid;
grid-template-rows: repeat(7, 1fr);
grid-auto-flow: column;
\`\`\`

this creates the left-to-right week flow with days stacked vertically.

## color scale

contribution counts map to colors. catppuccin palette works well:

\`\`\`
0: crust
1-3: base
4-6: overlay
7-9: mauve
10+: pink
\`\`\`

## interactivity

hover shows the date and count. click could link to that day's github profile.

\`\`\`
title = \`\${date}: \${count} contributions\`
\`\`\`

simple and effective.

## deployment

fetch on build time. cache the json. no client-side api calls, no rate limit issues.

-- moli
`,am=`---
title: last.fm is still goated
date: 2025-11-25
tags: [music, api, webdev]
excerpt: why i still use last.fm in 2025 and how i added it to my site.
---

# last.fm is still goated

in a world of spotify wrapped once a year, last.fm just keeps scrobbling. every single track. forever.

## why last.fm in 2025?

spotify gives you stats once a year. last.fm gives you stats every second.

- **real-time tracking** - see what you're listening to right now
- **historical data** - years of listening history
- **open api** - actually lets you build stuff
- **cross-platform** - works with everything, not just spotify

## the api is actually good

\`\`\`js
const response = await axios.get('https://ws.audioscrobbler.com/2.0/', {
    params: {
        method: 'user.getrecenttracks',
        user: 'yourusername',
        api_key: 'your_key',
        format: 'json',
        limit: 10
    }
});
\`\`\`

that's it. no oauth dance. no token refresh hell. just an api key and you're good.

## what you get back

- track name
- artist
- album
- album art
- timestamp
- whether it's currently playing

everything you need to show "now playing" on your site.

## my setup

i added a recent tracks section to my site. updates every 30 seconds. shows what i'm listening to in real-time.

the cool part: consolidating repeat plays. if i listen to the same song 5 times in a row (no judgment), it shows \`×5\` instead of listing it five times.

## the scrobbling ecosystem

last.fm works with basically everything:
- spotify (native)
- apple music (via apps)
- youtube music
- local files
- literally anything with a scrobbler

## vs spotify wrapped

| last.fm | spotify wrapped |
|---------|-----------------|
| real-time | once a year |
| all platforms | spotify only |
| open api | lol no |
| years of data | current year |
| free | "free" |

## the vibe

there's something nice about having a complete record of everything you've ever listened to. not just for stats, but for the memories.

looking at my scrobbles from 2020 hits different.

## add it to your site

if you're building a personal site, add your recent tracks. it's:
- easy to implement
- shows personality
- actually useful
- free api

## the truth

last.fm has been doing "music tracking" since 2002. spotify wrapped is just last.fm once a year with better marketing.

real ones know.

-- moli
`,cm=`---
title: coding with llms for a year
date: 2025-12-28
tags: [ai, llm, coding, productivity]
excerpt: what got faster, what stayed the same, and what got harder.
---

# coding with llms for a year

using claude (and others) for code daily. here is the honest assessment.

## what got faster

**boilerplate**: generate sql schemas, api types, test setups. 10 seconds vs 10 minutes.

**searching**: "how do i configure vite for multiple entry points" returns the exact config in seconds instead of digging through docs.

**refactoring**: "rename this function and update all call sites" across 20 files. done.

**documentation**: explain what this regex does, what this error means, why this type error appears.

## what stayed the same

**architecture**: choosing between database approaches, api design patterns, library selection. llms give options but you must judge them.

**debugging**: weird runtime errors, race conditions, deployment failures. llms guess wrong as often as they guess right.

**creative work**: novel features, unique solutions, edge cases. llms remix existing patterns.

## what got harder

**reading code**: i rely on llms to explain code. without them, i struggle to parse unfamiliar codebases.

**writing from scratch**: starting a project from zero feels harder because i default to "ask first" instead of "figure it out".

**attention span**: quick answers mean less deep thinking. sometimes you need to struggle with a problem to understand it.

## the balance

i use llms for:
- repetitive tasks
- documentation lookup
- small refactors
- one-off scripts

i avoid llms for:
- security-critical code
- learning new concepts
- architectural decisions
- unfamiliar codebases

## the future

the good developers will use llms as force multipliers. the bad ones will depend on them completely.

the skill is knowing when to ask and when to figure it out yourself.

-- moli
`,lm=`---
title: 2025 reflections and 2026 goals
date: 2026-01-05
tags: [reflection, goals, personal]
excerpt: what i learned, what i built, and what i am aiming for this year.
---

# 2025 reflections

another year of code, mistakes, and small victories.

## what went well

finally shipped the personal website. it sat in drafts for 2 years. this year i stopped polishing and just released.

switched to zed full time. neovim config was a second job. not missing it.

started using chezmoi for dotfiles. should have done this 5 years ago.

## what did not

too many half-finished projects. the graveyard has 7 repos with 3 commits each.

 neglected the blog. 10 posts was the goal, hit 6. better than zero but not what i wanted.

## numbers

\`\`\`
github contributions: 847
repos created: 12
repos deleted: 7
blog posts: 6
\`\`\`

# 2026 goals

## writing

12 blog posts. one per month. topics: rust, devops, tooling, and fewer opinion pieces.

## code

ship 4 cli tools. small, focused, documented.

get comfortable with rust ownership. stop fighting the borrow checker.

## learning

go deeper on systems programming. currently surface level with too many languages.

## health

less screen time outside of work. the eyes notice.

# the plan

nothing revolutionary. just show up more consistently.

happy new year.

-- moli
`,um=`---
title: how i sync obsidian notes into vue
date: 2025-10-28
tags: [tooling, automation, obsidian, vue]
excerpt: wiring a tiny pipeline that turns my messy vault into clean blog-ready markdown.
---

# how i sync obsidian notes into vue

i finally automated the thing i always complained about: moving notes from obsidian into this site without copy paste misery.

## the rough edges

- obsidian makes it easy to write, hard to export.
- backlinks, custom callouts, and dataview blocks break vite builds.
- manual cleanup means i forget to publish at all.

## the new flow

1. tag a note with \`#publish\`.
2. run \`bun sync:notes\`.
3. script converts frontmatter, strips obsidian syntax, and drops the file into \`posts/\`.
4. vite hot reloads and i get instant preview.

## key pieces

\`\`\`text
scripts/
  sync-notes.ts      # pulls marked notes over fs
  render-snippets.ts # converts callouts -> blockquotes
\`\`\`

- parses the first heading for the title.
- default excerpt comes from the first paragraph.
- preserves code blocks and inline formatting.

## why bun

- fast fs operations.
- typescript without extra config.
- easy to ship a single command.

## what needs polish

- images still require hand uploading.
- dataview tables get downgraded to plain lists.
- i want a diff preview before overwriting an existing post.

for now, it feels like magic compared to the old workflow. more excuses to write.

-- moli
`,fm=`---
title: rust for js developers
date: 2025-12-15
tags: [rust, javascript, learning, tutorial]
excerpt: the mental shift from garbage collection to ownership.
---

# rust for js developers

moving from javascript to rust felt like learning to code again. here is what clicked for me.

## no garbage collector

in js, you forget about memory. in rust, you own it.

\`\`\`rust
let mut vec = Vec::new();
vec.push("hello");
\`\`\`

the vector owns its memory. when it goes out of scope, memory is freed. no leaks, no gc pauses.

## ownership is the key

every value has one owner. when the owner is dropped, the value is dropped.

\`\`\`rust
let s1 = String::from("hello");
let s2 = s1; // s1 is moved to s2
// println!("{}", s1); // error! s1 is no longer valid
\`\`\`

this is not a reference. this is ownership transfer.

## borrowing

\`\`\`rust
fn calculate_length(s: &String) -> usize {
    s.len()
} // s goes out of scope but nothing is dropped
\`\`\`

references are borrowing. you cannot modify what you borrow unless you use \`&mut\`.

## the compiler is your friend

rust compiler errors are incredibly helpful:

\`\`\`
error[E0382]: use of moved value: \`vec\`
   --> src/main.rs:10:13
    |
8  |     let vec = vec![1, 2, 3];
    |         --- move occurs because \`vec\` has type \`Vec<i32>\`, which does not implement the \`Copy\` trait
9  |     let vec2 = vec;
    |             --- value moved here
10 |     println!("{:?}", vec);
    |                     ^^^ value used after move
\`\`\`

it tells you exactly what happened and how to fix it.

## tooling

- \`cargo\`: package manager, build tool, test runner
- \`rustfmt\`: automatic formatting
- \`clippy\`: linting
- \`rust-analyzer\`: the best language server i have ever used

## getting started

\`\`\`bash
rustup init
cargo new my_project
cd my_project
cargo run
\`\`\`

start small. the book is free at doc.rust-lang.org.

-- moli
`,dm=`---
title: shipping tiny cli tools on a weekend
date: 2025-10-26
tags: [cli, shipping, weekend-project]
excerpt: notes on building opinionated little binaries fast and keeping scope under control.
---

# shipping tiny cli tools on a weekend

there is something addictive about finishing a small cli tool before monday hits. no roadmap, just a scratch to itch.

## the idea bank

- convert spotify playlists to mp3 tags.
- wrap openapi specs into copy pasteable markdown.
- run \`npm audit\` across multiple repos with one command.

i keep them in a \`todo.md\` file, label the ones that can be done in under 6 hours, and pick one on friday night.

## constraints i set

1. only one external dependency allowed.
2. must build on macos and linux without extra steps.
3. readme and gif demo required before calling it done.

with rules in place, i avoid feature creep and focus on the happy path.

## tooling

- language: go for binaries, bun for scripts.
- tests: snapshot helpers with \`@vitest/ui\` for quick feedback.
- packaging: \`goreleaser\` for go, \`bun build\` for js.

## releasing

- tag \`v0.x.0\` even if it is just a prototype.
- publish binaries on github releases.
- write a short blog post describing the problem solved.

## lessons

- single purpose tools invite fewer bug reports.
- shipping early surfaces real workflows that docs ignore.
- saying "no" to extra flags keeps the interface friendly.

if i can keep this streak going, i will end the year with a neat toolbox instead of an idea backlog.

-- moli
`,pm=`---
title: the case for smaller containers
date: 2025-12-01
tags: [docker, containers, optimization, devops]
excerpt: building images under 50mb instead of gigabytes and why it matters.
---

# the case for smaller containers

a 1.2gb python image for a 10mb script is ridiculous. here is how i shrank my deployments.

## start small

\`\`\`
FROM python:3.12-slim
# vs
FROM python:3.12
\`\`\`

slim saves 800mb immediately. alpine saves more but brings libc compatibility issues.

for go binaries:
\`\`\`
FROM scratch
COPY main /main
\`\`\`

zero runtime dependencies. the image is just your binary.

## multi-stage builds

\`\`\`
FROM golang:1.21 AS builder
COPY . .
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o main main.go

FROM alpine:latest
COPY --from=builder /main /main
CMD ["/main"]
\`\`\`

builder stage is discarded. final image contains only what runs.

## tooling

- \`dive\`: inspect layer contents
- \`docker-slim\`: auto-optimize
- \`grype\`: scan for vulnerabilities in thin images

## numbers

| stack | before | after |
|-------|--------|-------|
| go api | 950mb | 12mb |
| node scraper | 1.1gb | 145mb |
| python etl | 2.3gb | 89mb |

smaller images deploy faster, scan faster, and have smaller attack surfaces.

-- moli
`,hm=`---
title: why i switched from neovim to zed
date: 2025-11-15
tags: [zed, editor, neovim, rust]
excerpt: giving up 5 years of modal editing for a mouse-friendly rust-based editor.
---

# why i switched from neovim to zed

after 5 years of muscle memory, i deleted my \`.config/nvim\` folder. here is what led me there.

## the problem with plugins

neovim plugins are amazing until one breaks after an update. lsp configurations drift, treesitter parsers desync, and suddenly you spend a saturday debugging instead of coding.

zed has zero config out of the box. language servers just work. no \`PackerSync\`, no \`MasonInstallAll\`, no \`checkhealth\`.

## the mouse thing

i thought i hated the mouse. turns out i just never had a good one.

zed's multi cursor with mouse support is faster than any vim motions for repetitive edits. select, alt+click more, type. done.

## the tradeoffs

missing:
- \`:terminal\`
- \`:G\` for git (though zed's built-in git is surprisingly good)
- tmux integration

gaining:
- no startup time
- collaboration features (remote sessions are wild)
- vim mode that actually feels complete

## verdict

zed is not for everyone. if you live in terminal, stick with neovim. if you want a fast editor that feels like 2025, try it for a week.

i am not looking back.

-- moli
`,mm=`---
title: my terminal setup 2025
date: 2025-12-25
tags: [terminal, setup, productivity,ricing]
excerpt: alacritty, zsh, tmux, and the small configs that make it work.
---

# my terminal setup 2025

minimal, fast, keyboard-driven.

## terminal

alacritty with gpu acceleration. 60fps scrolling on 4k monitors.

\`\`\`toml
[font]
size = 13
offset = { y = 1 }

[window]
opacity = 0.9
decorations = "None"
\`\`\`

no title bar, slight transparency, monospace font.

## shell

zsh with oh-my-zsh stripped down.

\`\`\`
plugins=(git python docker)
\`\`\`

prompt is minimal:

\`\`\`
╭─ user@host ~/project ────────────────────────────────────
╰─ $
\`\`\`

no fortune, no cowsay, no ascii art on start.

## multiplexing

tmux with prefix changed to \`Ctrl+a\`.

\`\`\`
set -g mouse on
set -g status-style "bg=#1e1e2e"
set -g window-style "bg=#1e1e2e"
set -g pane-border-style "fg=#313244"
\`\`\`

copy mode with mouse works. scrolling works. it feels like a gui.

## the workflow

\`\`\`
Ctrl+a + c     # new window
Ctrl+a + n     # next window
Ctrl+a + |     # horizontal split
Ctrl+a + _     # vertical split
Ctrl+a + arrow # navigate panes
\`\`\`

all keyboard. hands never leave home row.

## tools

| tool | purpose |
|------|---------|
| fzf | fuzzy finding |
| ripgrep | searching |
| bat | syntax highlighted cat |
| eza | ls replacement |
| bottom | system monitor |

small binaries that do one thing well.

## config location

\`\`\`
~/.config/
  alacritty/
  tmux/
  zsh/
\`\`\`

all version controlled. chezmoi manages the sync.

-- moli
`,gm=`---
title: welcome to my blog
date: 2025-10-17
tags: [meta, personal]
excerpt: first post on this new blog. thoughts on why i'm writing and what to expect.
---

# welcome to my blog

decided to start writing down my thoughts and experiences. mostly tech stuff, but also random things i find interesting.

## why blog?

- document my learning journey
- share solutions to problems i've faced
- practice writing and articulating ideas
- connect with other devs

## what to expect

posts about web dev, projects i'm working on, tools i discover, and occasional random thoughts. no fixed schedule - i'll write when i have something worth sharing.

thanks for reading.

-- moli
`,bm=`---
title: bypassing dpi with zapret on linux
date: 2026-01-10
tags: [linux, privacy, networking, censorship]
excerpt: step by step zapret installation to bypass isp deep packet inspection.
---

# bypassing dpi with zapret on linux

isps use dpi (deep packet inspection) to analyze traffic and block certain sites. zapret bypasses these restrictions.

## what we're doing

1. dns over tls setup
2. zapret installation
3. isp-specific parameter detection
4. profit

## required packages

\`\`\`bash
# debian/ubuntu
sudo apt install -y curl dnsutils nftables unzip

# fedora/rhel
sudo dnf install -y bind-utils curl nftables unzip

# arch
sudo pacman -S --noconfirm bind-tools curl nftables unzip
\`\`\`

## dns setup

zapret only bypasses dpi. we need to set up dns ourselves. using yandex dns here, alternatives:

- [cloudflare dns](https://keift.gitbook.io/blog/linux/use-dns-over-tls#alternative-cloudflare-dns-recommended) (recommended)
- [mullvad dns](https://keift.gitbook.io/blog/linux/use-dns-over-tls#alternative-mullvad-dns)
- [google dns](https://keift.gitbook.io/blog/linux/use-dns-over-tls#alternative-google-dns)

\`\`\`bash
# enable systemd-resolved
sudo systemctl enable --now systemd-resolved

# write dns config
sudo tee /etc/systemd/resolved.conf &>/dev/null << EOF
[Resolve]
DNS=77.88.8.8#common.dot.dns.yandex.net
DNS=2a02:6b8::feed:0ff#common.dot.dns.yandex.net
DNSOverTLS=yes
EOF

# symlink resolv.conf
sudo ln -sf /run/systemd/resolve/stub-resolv.conf /etc/resolv.conf

# restart
sudo systemctl restart systemd-resolved
\`\`\`

## download zapret

\`\`\`bash
# clean start
sudo rm -rf /tmp/zapret-v72.7*

# download and extract
sudo wget -P /tmp https://github.com/bol-van/zapret/releases/download/v72.7/zapret-v72.7.zip
sudo unzip -d /tmp /tmp/zapret-v72.7.zip
sudo rm /tmp/zapret-v72.7.zip
\`\`\`

## pre-installation

\`\`\`bash
# remove old installation
sudo /opt/zapret/uninstall_easy.sh 2>/dev/null
sudo rm -rf /opt/zapret

# install requirements
sudo /tmp/zapret-v72.7/install_prereq.sh
sudo /tmp/zapret-v72.7/install_bin.sh
\`\`\`

firewall question: **leave blank** (nftables will be selected)

## blockcheck - isp analysis

detect the dpi method your isp uses:

\`\`\`bash
sudo /tmp/zapret-v72.7/blockcheck.sh
\`\`\`

answers:

| question | answer |
|----------|--------|
| domain | a blocked site (e.g. discord.com) |
| ip version | leave blank |
| check http/https | leave blank |
| repeat count | leave blank |
| scan mode | leave blank (standard) |

test takes a few minutes. you'll get output like:

\`\`\`
curl_test_https_tls12 ipv4 discord.com : nfqws --dpi-desync=fakeddisorder --dpi-desync-ttl=1 --dpi-desync-autottl=-5 --dpi-desync-split-pos=1
\`\`\`

note the part starting with \`nfqws\`. these are your isp-specific bypass parameters.

## zapret installation

\`\`\`bash
sudo /tmp/zapret-v72.7/install_easy.sh
\`\`\`

| question | answer |
|----------|--------|
| copy for you | **Y** |
| firewall type | leave blank |
| ipv6 support | leave blank |
| flow offloading | leave blank |
| filtering | leave blank |
| tpws socks | leave blank |
| tpws transparent | leave blank |
| enable nfqws | **Y** |
| edit options | **Y** |

nano will open. find \`NFQWS_OPT\` and paste your blockcheck parameters:

\`\`\`ini
NFQWS_OPT="--dpi-desync=fakeddisorder --dpi-desync-ttl=1 --dpi-desync-autottl=-5 --dpi-desync-split-pos=1"
\`\`\`

save: \`Ctrl+S\`, exit: \`Ctrl+X\`

leave the remaining questions blank.

## cleanup

\`\`\`bash
sudo rm -rf /tmp/zapret-v72.7
\`\`\`

done. 🎉

## uninstalling

\`\`\`bash
# remove zapret
sudo /opt/zapret/uninstall_easy.sh
sudo rm -rf /opt/zapret

# reset dns
sudo tee /etc/systemd/resolved.conf &>/dev/null <<< ""
sudo systemctl restart systemd-resolved
\`\`\`

-- moli
`,ym=Object.assign({"/posts/ai-browsers-are-just-chromium.md":sm,"/posts/designing-terminal-aesthetic-ui.md":om,"/posts/dotfiles-with-chezmoi.md":rm,"/posts/github-contribution-heatmap.md":im,"/posts/lastfm-is-still-goated.md":am,"/posts/llm-coding.md":cm,"/posts/new-year-2026.md":lm,"/posts/obsidian-to-vue-notes-pipeline.md":um,"/posts/rust-for-js-developers.md":fm,"/posts/shipping-small-cli-tools.md":dm,"/posts/smaller-containers.md":pm,"/posts/switching-from-neovim-to-zed.md":hm,"/posts/terminal-setup-2025.md":mm,"/posts/welcome-to-my-blog.md":gm,"/posts/zapret-installation.md":bm}),_m=e=>{const t=e.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);if(!t)return{frontmatter:{},content:e};const[,n,s]=t,o={};return n.split(`
`).forEach(r=>{const[i,...a]=r.split(":");if(!i||a.length===0)return;const c=a.join(":").trim();c.startsWith("[")&&c.endsWith("]")?o[i.trim()]=c.slice(1,-1).split(",").map(l=>l.trim()):o[i.trim()]=c}),{frontmatter:o,content:s}},vm=()=>{const e=[];let t=1;return Object.entries(ym).forEach(([n,s])=>{const{frontmatter:o,content:r}=_m(s),i=n.split("/").pop().replace(".md","");e.push({id:t++,slug:i,title:o.title||i,date:o.date||new Date().toISOString().split("T")[0],tags:o.tags||[],excerpt:o.excerpt||"",content:r.trim()})}),e};let qs=null;const rc=()=>(qs||(qs=vm()),[...qs].sort((e,t)=>new Date(t.date)-new Date(e.date))),wm=e=>rc().find(t=>t.slug===e),oi=e=>new Date(e).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),Bt=e=>(Mi("data-v-622c7dcb"),e=e(),ji(),e),xm={class:"w-full min-h-screen overflow-x-hidden overflow-y-auto font-mono"},Em={class:"max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-4"},Sm={key:"list"},Cm={class:"mb-12"},Rm=Bt(()=>w("div",{class:"text-catppuccin-subtle text-sm mb-2"}," ~$ cd ~/blog ",-1)),km=Bt(()=>w("h1",{class:"text-3xl md:text-4xl font-bold text-catppuccin-text mb-4"},[w("span",{class:"text-catppuccin-mauve"},"blog")],-1)),Tm=Bt(()=>w("p",{class:"text-sm text-catppuccin-gray leading-relaxed mb-6"}," thoughts on code, tools, and random stuff i find interesting. ",-1)),Am={class:"flex items-center gap-4 text-sm mb-6"},Om={class:"border-l-2 border-catppuccin-surface pl-4"},Pm=Bt(()=>w("div",{class:"text-catppuccin-subtle text-sm mb-3"}," ~$ ls -la posts/ ",-1)),$m={key:0,class:"text-sm text-catppuccin-subtle"},Nm={key:1,class:"space-y-3"},Lm=["onClick"],Fm={class:"px-4 py-3"},Im={class:"flex items-start justify-between gap-4 mb-2"},Mm={class:"text-base font-semibold text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors"},jm={class:"text-xs text-catppuccin-subtle flex-shrink-0"},Dm={class:"text-sm text-catppuccin-gray mb-3 leading-relaxed"},Bm={class:"flex items-center gap-2"},Um={class:"flex flex-wrap gap-1.5"},zm=Bt(()=>w("span",{class:"ml-auto text-catppuccin-subtle group-hover:text-catppuccin-mauve transition-colors text-sm"}," read → ",-1)),Hm={key:"post"},qm={class:"mb-8"},Vm={class:"text-catppuccin-subtle text-sm mb-2"},Km={class:"text-3xl md:text-4xl font-bold text-catppuccin-text mb-3"},Wm={class:"flex items-center gap-4 text-sm text-catppuccin-subtle mb-4"},Jm=Bt(()=>w("span",{class:"text-catppuccin-surface"},"•",-1)),Gm=Bt(()=>w("span",{class:"text-catppuccin-surface"},"•",-1)),Ym={class:"flex gap-2"},Qm={class:"border-l-2 border-catppuccin-surface pl-4 mb-8"},Xm=["innerHTML"],Zm={__name:"Blog",setup(e){const t=Le("list"),n=Le(null),s=Le([]),o=$a(),r=Pa(),i=()=>{s.value=rc()},a=p=>{if(n.value=wm(p),n.value)t.value="post",window.scrollTo({top:0,behavior:"smooth"}),o.query.post!==p&&r.replace({name:"Blog",query:{...o.query,post:p}});else if(o.query.post){const m={...o.query};delete m.post,r.replace({name:"Blog",query:m})}},c=({skipQueryUpdate:p=!1}={})=>{if(t.value="list",n.value=null,window.scrollTo({top:0,behavior:"smooth"}),!p&&"post"in o.query){const m={...o.query};delete m.post,r.replace({name:"Blog",query:m})}},l=p=>{const g=p.trim().split(/\s+/).length;return Math.ceil(g/200)},u=p=>{let m=p;const g=[];m=m.replace(/```(\w*)\s*\n?([\s\S]*?)```/g,(v,k,N)=>{const T=`__CODEBLOCK_${g.length}__`,D=N.trim().replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),W=k?`language-${k.toLowerCase()}`:"",L=`code-block-${g.length}`;return g.push(`<div class="relative group">
                <button data-clipboard-target="#${L}" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-catppuccin-subtle hover:text-catppuccin-mauve px-2 py-1 bg-catppuccin-crust border border-catppuccin-surface rounded hover:bg-catppuccin-mauve/10 cursor-pointer z-10">
                    copy
                </button>
                <pre class="bg-catppuccin-surface/50 border border-catppuccin-overlay/30 rounded p-4 overflow-x-auto my-4"><code id="${L}" class="${W}">${D}</code></pre>
            </div>`),T});const y=[];return m=m.replace(/((?:\|[^\n]+\|\r?\n?)+)/g,v=>{const k=v.trim().split(/\r?\n/);if(k.length<2||!/^\|[\s\-:|]+\|$/.test(k[1]))return v;const T=`__TABLE_${y.length}__`,D=k[0],W=k.slice(2);let L='<table class="w-full my-4 text-sm border-collapse">';const Y=D.split("|").filter(B=>B.trim());return L+="<thead><tr>",Y.forEach(B=>{L+=`<th class="border border-catppuccin-surface px-3 py-2 text-left text-catppuccin-mauve bg-catppuccin-surface/30">${B.trim()}</th>`}),L+="</tr></thead>",L+="<tbody>",W.forEach(B=>{if(B.trim()&&!/^\|[\s\-:|]+\|$/.test(B)){const re=B.split("|").filter(te=>te.trim());L+="<tr>",re.forEach(te=>{L+=`<td class="border border-catppuccin-surface px-3 py-2 text-catppuccin-text">${te.trim()}</td>`}),L+="</tr>"}}),L+="</tbody></table>",y.push(L),T}),m=m.replace(/^### (.*$)/gim,'<h3 class="text-lg font-semibold text-catppuccin-mauve mt-6 mb-3">$1</h3>'),m=m.replace(/^## (.*$)/gim,'<h2 class="text-xl font-semibold text-catppuccin-blue mt-8 mb-4">$1</h2>'),m=m.replace(/^# (.*$)/gim,'<h1 class="text-2xl font-bold text-catppuccin-text mt-8 mb-4">$1</h1>'),m=m.replace(/\*\*(.*?)\*\*/g,'<strong class="text-catppuccin-mauve font-semibold">$1</strong>'),m=m.replace(/`([^`]+)`/g,'<code class="bg-catppuccin-surface/50 px-2 py-0.5 rounded text-catppuccin-pink text-sm">$1</code>'),m=m.replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" class="text-catppuccin-blue hover:text-catppuccin-mauve underline transition-colors">$1</a>'),m=m.replace(/^\- (.*$)/gim,'<li class="ml-6 list-disc text-catppuccin-text mb-1">$1</li>'),m=m.split(`

`).map(v=>!v.trim().startsWith("<")&&!v.trim().startsWith("__CODEBLOCK_")&&!v.trim().startsWith("__TABLE_")?`<p class="text-catppuccin-text leading-relaxed mb-4">${v}</p>`:v).join(`
`),g.forEach((v,k)=>{m=m.replace(`__CODEBLOCK_${k}__`,v)}),y.forEach((v,k)=>{m=m.replace(`__TABLE_${k}__`,v)}),m},f=p=>{const m=p.replace(/```[\s\S]*?```/g,"").replace(/[^\w\s]/g," ").replace(/\s+/g," ").trim();return l(m)};return hs(()=>{i(),document.documentElement.style.overflowY="auto",document.body.style.overflowY="auto",new ClipboardJS("[data-clipboard-target]").on("success",function(g){const y=g.trigger,v=y.textContent;y.textContent="copied!",y.classList.add("text-catppuccin-green"),setTimeout(()=>{y.textContent=v,y.classList.remove("text-catppuccin-green")},2e3),g.clearSelection()}),setTimeout(()=>{window.Prism&&Prism.highlightAll()},100);const m=o.query.post;m&&a(m)}),ms(()=>{document.documentElement.style.overflowY="",document.body.style.overflowY=""}),fn(()=>o.query.post,(p,m)=>{p&&p!==m?a(p):!p&&t.value==="post"&&c({skipQueryUpdate:!0})}),(p,m)=>{const g=fs("router-link");return K(),X("div",xm,[w("div",Em,[me(vs,{name:"fade",mode:"out-in"},{default:Ie(()=>[t.value==="list"?(K(),X("div",Sm,[w("div",Cm,[Rm,km,Tm,w("div",Am,[me(g,{to:"/",class:"text-catppuccin-subtle hover:text-catppuccin-text transition-colors"},{default:Ie(()=>[qt(" [← home] ")]),_:1})])]),w("div",Om,[Pm,s.value.length?(K(),X("div",Nm,[(K(!0),X(we,null,ft(s.value,y=>(K(),X("div",{key:y.id,onClick:v=>a(y.slug),class:"block group rounded-md border border-catppuccin-surface/60 bg-catppuccin-base/20 hover:bg-catppuccin-base/30 hover:border-catppuccin-mauve/40 transition-all cursor-pointer"},[w("div",Fm,[w("div",Im,[w("h2",Mm,ue(y.title),1),w("span",jm,ue(Ve(oi)(y.date)),1)]),w("p",Dm,ue(y.excerpt),1),w("div",Bm,[w("div",Um,[(K(!0),X(we,null,ft(y.tags,v=>(K(),X("span",{key:v,class:"px-2 py-0.5 rounded text-xs bg-catppuccin-surface/60 text-catppuccin-subtle"}," #"+ue(v),1))),128))]),zm])])],8,Lm))),128))])):(K(),X("div",$m," no posts found "))])])):t.value==="post"&&n.value?(K(),X("div",Hm,[w("div",qm,[w("div",Vm," ~$ cat "+ue(n.value.slug)+".md ",1),w("button",{onClick:c,class:"text-sm text-catppuccin-subtle hover:text-catppuccin-text transition-colors mb-6 inline-flex items-center gap-1"}," ← back to posts "),w("h1",Km,ue(n.value.title),1),w("div",Wm,[w("span",null,ue(Ve(oi)(n.value.date)),1),Jm,w("span",null,"~"+ue(f(n.value.content))+" min read",1),Gm,w("div",Ym,[(K(!0),X(we,null,ft(n.value.tags,y=>(K(),X("span",{key:y,class:"text-catppuccin-gray"}," #"+ue(y),1))),128))])])]),w("article",Qm,[w("div",{class:"prose prose-invert max-w-none text-catppuccin-text",innerHTML:u(n.value.content)},null,8,Xm)]),w("div",{class:"border-l-2 border-catppuccin-surface pl-4"},[w("button",{onClick:c,class:"text-sm text-catppuccin-subtle hover:text-catppuccin-mauve transition-colors inline-flex items-center gap-1"}," ← back to all posts ")])])):rt("",!0)]),_:1})])])}}},eg=oc(Zm,[["__scopeId","data-v-622c7dcb"]]),tg={class:"w-full min-h-screen overflow-x-hidden font-mono"},ng={class:"max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16"},sg={class:"mb-12"},og=w("div",{class:"text-catppuccin-subtle text-sm mb-2"}," ~$ cd / ",-1),rg=w("h1",{class:"text-3xl md:text-4xl font-bold text-catppuccin-text mb-2"},[w("span",{class:"text-catppuccin-red"},"404")],-1),ig={class:"border-l-2 border-catppuccin-surface pl-4 mb-6"},ag=w("div",{class:"text-catppuccin-subtle text-sm mb-2"}," ~$ cat error.txt ",-1),cg={class:"space-y-1 text-catppuccin-text"},lg={class:"flex items-center gap-2"},ug=w("span",{class:"text-catppuccin-red"},"bash:",-1),fg={class:"text-catppuccin-text"},dg=w("div",{class:"flex items-center gap-2"},[w("span",{class:"text-catppuccin-subtle"},"hint:"),w("span",{class:"text-catppuccin-gray"},"the requested page was not found")],-1),pg={class:"border-l-2 border-catppuccin-surface pl-4"},hg=w("div",{class:"text-catppuccin-subtle text-sm mb-3"}," ~$ ls valid_directories/ ",-1),mg={class:"grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm"},gg=w("span",{class:"text-catppuccin-blue"},"/",-1),bg=w("span",{class:"text-catppuccin-subtle"},"→",-1),yg=w("span",null,"home",-1),_g=w("span",{class:"text-catppuccin-blue"},"/blog",-1),vg=w("span",{class:"text-catppuccin-subtle"},"→",-1),wg=w("span",null,"blog posts",-1),xg=w("span",{class:"text-catppuccin-blue"},"/github",-1),Eg=w("span",{class:"text-catppuccin-subtle"},"→",-1),Sg=w("span",null,"projects",-1),Cg=w("span",{class:"text-catppuccin-blue"},"/instagram",-1),Rg=w("span",{class:"text-catppuccin-subtle"},"→",-1),kg=w("span",null,"photos",-1),Tg={__name:"NotFound",setup(e){return $a(),(t,n)=>{const s=fs("router-link");return K(),X("div",tg,[w("div",ng,[w("div",sg,[og,rg,w("div",ig,[ag,w("div",cg,[w("div",lg,[ug,w("span",fg,"cd: "+ue(t.$route.path)+": No such file or directory",1)]),dg])]),w("div",pg,[hg,w("div",mg,[me(s,{to:"/",class:"flex items-center gap-2 text-catppuccin-text hover:text-catppuccin-mauve transition-colors"},{default:Ie(()=>[gg,bg,yg]),_:1}),me(s,{to:"/blog",class:"flex items-center gap-2 text-catppuccin-text hover:text-catppuccin-mauve transition-colors"},{default:Ie(()=>[_g,vg,wg]),_:1}),me(s,{to:"/github",class:"flex items-center gap-2 text-catppuccin-text hover:text-catppuccin-mauve transition-colors"},{default:Ie(()=>[xg,Eg,Sg]),_:1}),me(s,{to:"/instagram",class:"flex items-center gap-2 text-catppuccin-text hover:text-catppuccin-mauve transition-colors"},{default:Ie(()=>[Cg,Rg,kg]),_:1})])])])])])}}},Ag=[{path:"/",name:"Home",component:nm,meta:{title:"Personal Website | f1sh.dev"}},{path:"/blog",name:"Blog",component:eg,meta:{title:"Blog | f1sh.dev"}},{path:"/github",name:"GitHubRedirect",beforeEnter(){window.location.href="https://github.com/lostf1sh"}},{path:"/instagram",name:"InstagramRedirect",beforeEnter(){window.location.href="https://www.instagram.com/kawaiimoli"}},{path:"/:pathMatch(.*)*",name:"NotFound",component:Tg,meta:{title:"404 Not Found | f1sh.dev"}}],ic=$f({history:af(),routes:Ag,scrollBehavior(e,t,n){return n||{top:0}}});ic.beforeEach((e,t,n)=>{document.title=e.meta.title||"f1sh.dev",n()});ku(Lf).use(ic).mount("#app");
