var _flutter=getApp()._flutter;if(!_flutter){_flutter={};getApp()._flutter=_flutter}_flutter.loader=null;export class FlutterHostView{static shared=new FlutterHostView;static transformTouchEvent=event=>{if(event.touches){for(let index=0;index<event.touches.length;index++){const touch=event.touches[index];touch.clientX=touch.pageX;touch.clientY=touch.pageY}event.touches.item=function(index){return event.touches[index]}}if(event.changedTouches){for(let index=0;index<event.changedTouches.length;index++){const touch=event.changedTouches[index];touch.clientX=touch.pageX;touch.clientY=touch.pageY}event.changedTouches.item=function(index){return event.changedTouches[index]}}event.altKey=false;event.ctrlKey=false;event.metaKey=false;event.shiftKey=false;event.preventDefault=function(){};return event};ontouchstart=undefined;ontouchmove=undefined;ontouchend=undefined;ontouchcancel=undefined;oninputinput=undefined;oninputblur=undefined;oninputkeydown=undefined;onkeyboardheightchange=undefined;onshow=undefined;onhide=undefined;onshareappmessage=undefined;onAndroidBackPressed=undefined}globalThis.FlutterHostView=FlutterHostView;(function(){"use strict";const baseUri="";class FlutterEntrypointLoader{constructor(){this._scriptLoaded=false}setTrustedTypesPolicy(policy){this._ttPolicy=policy}async loadEntrypoint(options){const{entrypointUrl=`${baseUri}main.dart.js`,onEntrypointLoaded}=options||{};return this._loadEntrypoint(entrypointUrl,onEntrypointLoaded)}didCreateEngineInitializer(engineInitializer){if(typeof this._didCreateEngineInitializerResolve==="function"){this._didCreateEngineInitializerResolve(engineInitializer);this._didCreateEngineInitializerResolve=null;delete _flutter.loader.didCreateEngineInitializer}if(typeof this._onEntrypointLoaded==="function"){this._onEntrypointLoaded(engineInitializer)}}_loadEntrypoint(entrypointUrl,onEntrypointLoaded){const useCallback=typeof onEntrypointLoaded==="function";if(!this._scriptLoaded){this._scriptLoaded=true;if(useCallback){this._onEntrypointLoaded=onEntrypointLoaded;try{require("./main.dart")}catch(e){console.error(e)}}else{throw"use callback"}}}}class FlutterLoader{async loadEntrypoint(options){const{...entrypoint}=options||{};const entrypointLoader=new FlutterEntrypointLoader;this.didCreateEngineInitializer=entrypointLoader.didCreateEngineInitializer.bind(entrypointLoader);return entrypointLoader.loadEntrypoint(entrypoint)}}const oriDefineProperty=Object.defineProperty.bind(Object);Object.defineProperty=function(){try{oriDefineProperty.apply(Object,arguments)}catch(error){}};Array.prototype.item=function(index){if(index<0||index>=this.length){throw new Error("索引超出范围")}return this[index]};_flutter.loader=new FlutterLoader;_flutter.window=new(require("./flutter_bom/window").FlutterMiniProgramMockWindow);_flutter.document=new(require("./flutter_bom/document").FlutterMiniProgramMockDocument);_flutter.window.document=_flutter.document;_flutter.self={FlutterHostView:FlutterHostView,wx:wx,Object:Object,Promise:Promise,crypto:require("./flutter_bom/crypto"),_flutter:_flutter,window:_flutter.window,location:_flutter.window.location,document:_flutter.document,setTimeout:setTimeout,setInterval:setInterval,localStorage:new(require("./flutter_bom/storage").LocalStorage),clearTimeout:clearTimeout,clearInterval:clearInterval,Float32Array:Float32Array,encodeURIComponent:encodeURIComponent,Intl:{},HTMLTextAreaElement:require("./flutter_bom/input").FlutterMiniProgramMockInputElement,$__dart_deferred_initializers__:[],dartDeferredLibraryLoader:function(uri,res,rej){const pkgs=require("./pkgs").default;if(typeof require==="function"&&typeof require.async==="function"){if(pkgs[uri]){require("../../"+pkgs[uri]+"/pages"+uri.replace(".part.js",".part"),function(){console.log(uri,"done");res()},function(err){console.error(err)})}else{require("./"+uri,function(){console.log(uri,"done");res()})}}},XMLHttpRequest:require("./flutter_bom/xml-http-request").XMLHttpRequest};_flutter.self.safeAreaInsetTop=wx.getSystemInfoSync().safeArea.top;_flutter.self.safeAreaInsetBottom=wx.getSystemInfoSync().windowHeight-wx.getSystemInfoSync().safeArea.bottom;FlutterHostView.shared.onkeyboardheightchange=e=>{_flutter.self.keyboardHeightChanged(e.detail.height)};FlutterHostView.shared.onAndroidBackPressed=()=>{_flutter.self.androidBackPressed()};globalThis.HTMLTextAreaElement=require("./flutter_bom/input").FlutterMiniProgramMockInputElement;globalThis.MutationObserver=function(){return{observe:function(){}}};globalThis.KeyboardEvent=class KeyboardEvent{preventDefault(){}};globalThis.XMLHttpRequest=require("./flutter_bom/xml-http-request").XMLHttpRequest;globalThis.crypto=_flutter.self.crypto;globalThis.localStorage=_flutter.self.localStorage;let originObjectStringFunction=Object.prototype.toString;Object.prototype.toString=function(){if(this.$$clazz$$){return`[object ${this.$$clazz$$}]`}return originObjectStringFunction.apply(this,arguments)}})();