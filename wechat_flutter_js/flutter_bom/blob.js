function mergeArrayBuffers(buffers){let totalLength=0;for(let index=0;index<buffers.length;index++){const buffer=buffers[index];totalLength+=buffer.byteLength}const mergedBuffer=new ArrayBuffer(totalLength);const mergedView=new Uint8Array(mergedBuffer);let offset=0;for(let index=0;index<buffers.length;index++){const buffer=buffers[index];const view=new Uint8Array(buffer);mergedView.set(view,offset);offset+=view.length}return mergedBuffer}export class Blob{constructor(blobParts,type){this.$$clazz$$="Blob";this.originArrayBuffer=mergeArrayBuffers(blobParts);this.size=this.originArrayBuffer.byteLength;this.type=type}arrayBuffer(){return this.originArrayBuffer}text(){const tmpFile=wx.env.USER_DATA_PATH+"/brtext_tmp";fs.writeFileSync(tmpFile,this.originArrayBuffer);const localFileText=fs.readFileSync(tmpFile,"utf8");fs.removeSavedFile({filePath:tmpFile});return localFileText}}