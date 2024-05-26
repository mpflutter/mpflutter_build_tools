// Copyright 2023 The MPFlutter Authors. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0 that can be
// found in the LICENSE file.

function mergeArrayBuffers(buffers) {
    // 计算总长度
    let totalLength = 0;
  
    for (let index = 0; index < buffers.length; index++) {
        const buffer = buffers[index];
        totalLength += buffer.byteLength;
    }
  
    // 创建一个新的ArrayBuffer来容纳合并后的数据
    const mergedBuffer = new ArrayBuffer(totalLength);
  
    // 使用TypedArray视图或DataView来操作二进制数据
    const mergedView = new Uint8Array(mergedBuffer);
  
    // 拷贝每个ArrayBuffer的数据到合并后的ArrayBuffer
    let offset = 0;
    for (let index = 0; index < buffers.length; index++) {
      const buffer = buffers[index];
      const view = new Uint8Array(buffer);
      mergedView.set(view, offset);
      offset += view.length;
    }
  
    return mergedBuffer;
  }
  
  export class Blob {
    constructor(blobParts, type) {
      this.$$clazz$$ = "Blob";
      this.originArrayBuffer = mergeArrayBuffers(blobParts);
      this.size = this.originArrayBuffer.byteLength;
      this.type = type;
    }
  
    arrayBuffer() {
      return this.originArrayBuffer;
    }
  
    text() {
      const tmpFile = wx.env.USER_DATA_PATH + "/brtext_tmp";
      fs.writeFileSync(tmpFile, this.originArrayBuffer);
      const localFileText = fs.readFileSync(tmpFile, "utf8");
      fs.removeSavedFile({
        filePath: tmpFile,
      });
      return localFileText;
    }
  }
  