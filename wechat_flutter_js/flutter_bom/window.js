export class FlutterMiniProgramMockWindow{parseFloat=parseFloat;parseInt=parseInt;console=console;requestAnimationFrame;TouchEvent={};performance={now:()=>(new Date).getTime()};devicePixelRatio=wx.getSystemInfoSync().pixelRatio;innerWidth=wx.getSystemInfoSync().windowWidth;innerHeight=wx.getSystemInfoSync().windowHeight;navigator={platform:"",userAgent:"",vendor:"",language:"zh"};location={href:"",hash:"",search:"",pathname:""};localStorage=new(require("./storage").LocalStorage);performance={now:()=>{return(new Date).getTime()},mark:function(){},measure:function(){}};history={replaceState:()=>{},pushState:()=>{},state:{}};dispatchEvent(){return true}addEventListener(event,callback){}removeEventListener(){}getComputedStyle(){return{getPropertyValue:()=>{return""}}}matchMedia(){return{matches:false,addListener:()=>{}}}fetch=(url,options)=>{console.log("fetch",url,options);if(!options){options={}}return new Promise(async(resolve,reject)=>{if(url.endsWith("k3kXo84MPvpLmixcA63oeALhL4iJ-Q7m8w.otf")){const fs=wx.getFileSystemManager();const brExists=await new Promise(resolve=>{fs.getFileInfo({filePath:"/assets/fonts/NotoSansSC-Regular.ttf"+".br",success:()=>{resolve(true)},fail:()=>{resolve(false)}})});if(brExists){url="/assets/fonts/NotoSansSC-Regular.ttf"}}if(url.startsWith("/")){let br=false;const fs=wx.getFileSystemManager();const brExists=await new Promise(resolve=>{fs.getFileInfo({filePath:url+".br",success:()=>{resolve(true)},fail:()=>{resolve(false)}})});if(brExists){br=true;url=url+".br"}let bodyReadDone=false;const body={getReader:()=>{return{read:async()=>{if(bodyReadDone){return{done:true}}const result={done:false,value:new Uint8Array(br?fs.readCompressedFileSync({filePath:url,compressionAlgorithm:"br"}):fs.readFileSync(url))};bodyReadDone=true;return result}}}};const arrayBuffer=async()=>{const originBuffer=br?fs.readCompressedFileSync({filePath:url,compressionAlgorithm:"br"}):fs.readFileSync(url);const newBuffer=new ArrayBuffer(originBuffer.byteLength);const sourceArray=new Uint8Array(originBuffer);const targetArray=new Uint8Array(newBuffer);targetArray.set(sourceArray);return newBuffer};const text=async()=>{if(br){const tmpFile=wx.env.USER_DATA_PATH+"/brtext_tmp";fs.writeFileSync(tmpFile,fs.readCompressedFileSync({filePath:url,compressionAlgorithm:"br"}));const localFileText=fs.readFileSync(tmpFile,"utf8");fs.removeSavedFile({filePath:tmpFile});return localFileText}const localFileText=fs.readFileSync(url,"utf-8");return localFileText};const json=async()=>{const localFileText=await text();return JSON.parse(localFileText)};const clone=async()=>fetch(url,options);const responseData={ok:true,status:200,statusText:"OK",headers:{},arrayBuffer:arrayBuffer,text:text,json:json,clone:clone,body:body};setTimeout(()=>{resolve(responseData)},32);return}wx.request({url:url,method:options.method||"GET",data:options.body,header:options.headers,responseType:"arraybuffer",success:response=>{const headers=response.header;const status=response.statusCode;const statusText="OK";const abData=response.data;const text=async()=>{const tmpFile=wx.env.USER_DATA_PATH+"/brtext_tmp";fs.writeFileSync(tmpFile,abData);const localFileText=fs.readFileSync(tmpFile,"utf8");fs.removeSavedFile({filePath:tmpFile});return localFileText};const json=async()=>{const localFileText=await text();return JSON.parse(localFileText)};const arrayBuffer=()=>Promise.resolve(abData);const clone=()=>fetch(url,options);const responseData={ok:status>=200&&status<300,status:status,statusText:statusText,headers:headers,text:text,json:json,clone:clone,arrayBuffer:arrayBuffer};resolve(responseData)},fail:error=>{reject(error)}})})};flutterConfiguration={assetBase:"/"};CanvasKitInit(){return new Promise(resolve=>{wx.createSelectorQuery().select("#my_canvas").fields({node:true,size:true}).exec(res=>{const{CanvasKitInit,GLVersion}=require("../canvaskit");const _flutter=getApp()._flutter;let canvas=res[0].node;if(GLVersion>1){const ctx=canvas.getContext("webgl2");const originGetParameter=ctx.getParameter.bind(ctx);ctx.getParameter=function(v){if(v===7938){const value=originGetParameter(v);if(value.indexOf("OpenGL ES 3.2")>0){return"WebGL 2.0 (OpenGL ES 3.2 Chromium)"}else{return value}}else if(v===35724){const value=originGetParameter(v);if(value.indexOf("OpenGL ES 3.2")>0){return"WebGL GLSL ES 3.00 (OpenGL ES GLSL ES 3.2 Chromium)"}else{return value}}return originGetParameter(v)}}_flutter.activeCanvas=canvas;const ckLoaded=CanvasKitInit(canvas);ckLoaded.then(CanvasKit=>{const surface=CanvasKit.MakeCanvasSurface(canvas);_flutter.window.flutterCanvasKit=CanvasKit;if(!globalThis.window){globalThis.window=_flutter.window}globalThis.window.flutterCanvasKit=CanvasKit;resolve(CanvasKit)})})})}}