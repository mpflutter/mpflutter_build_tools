// Copyright 2023 The MPFlutter Authors. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0 that can be
// found in the LICENSE file.

const { Blob } = require("./blob");
const { Event } = require("./event");
const { isAsset, isAssetExist, readAssetAsBuffer } = require("./asset_reader");
const SUPPORT_METHOD = [
  "OPTIONS",
  "GET",
  "HEAD",
  "POST",
  "PUT",
  "DELETE",
  "TRACE",
  "CONNECT",
  "PATCH",
];
const STATUS_TEXT_MAP = {
  100: "Continue",
  101: "Switching protocols",
  200: "OK",
  201: "Created",
  202: "Accepted",
  203: "Non-Authoritative Information",
  204: "No Content",
  205: "Reset Content",
  206: "Partial Content",
  300: "Multiple Choices",
  301: "Moved Permanently",
  302: "Found",
  303: "See Other",
  304: "Not Modified",
  305: "Use Proxy",
  307: "Temporary Redirect",
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Failed",
  413: "Request Entity Too Large",
  414: "Request-URI Too Long",
  415: "Unsupported Media Type",
  416: "Requested Range Not Suitable",
  417: "Expectation Failed",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
};
class XMLHttpRequestUpload {
  constructor() {
    this.$$clazz$$ = "XMLHttpRequestUpload";
  }
  addEventListener(event, callback) {}
  removeEventListener() {}
}

export class XMLHttpRequest {
  constructor(pageId) {
    this.$$clazz$$ = "XMLHttpRequest";
    this.$_pageId = pageId;
    this.$_method = "";
    this.$_url = "";
    this.$_data = null;
    this.$_status = 0;
    this.$_statusText = "";
    this.$_readyState = XMLHttpRequest.UNSENT;
    this.$_header = {
      Accept: "*/*",
    };
    this.$_responseType = "";
    this.$_resHeader = null;
    this.$_response = null;
    this.$_timeout = 0;
    this.$_startTime = null;
    this.$_withCredentials = true;
    this.$_requestTask = null;
    this.$_requestSuccess = this.$_requestSuccess.bind(this);
    this.$_requestFail = this.$_requestFail.bind(this);
    this.$_requestComplete = this.$_requestComplete.bind(this);
    this.eventCallbacks = {};
    this.upload = new XMLHttpRequestUpload();
  }
  addEventListener(event, callback) {
    this.eventCallbacks[event] = callback;
  }
  removeEventListener() {}
  $$trigger(event) {
    const cb = this.eventCallbacks[event];
    if (cb) {
      cb(new Event());
    }
  }
  $_callReadyStateChange(readyState) {
    const hasChange = readyState !== this.$_readyState;
    this.$_readyState = readyState;
    if (hasChange) this.$$trigger("readystatechange");
  }
  $_callRequest() {
    if (this.$_timeout) {
      this.$_startTime = +new Date();
      setTimeout(() => {
        if (!this.$_status && this.$_readyState !== XMLHttpRequest.DONE) {
          if (this.$_requestTask) this.$_requestTask.abort();
          this.$_callReadyStateChange(XMLHttpRequest.DONE);
          this.$$trigger("timeout");
        }
      }, this.$_timeout);
    }
    this.$_status = 0;
    this.$_statusText = "";
    this.$_readyState = XMLHttpRequest.OPENED;
    this.$_resHeader = null;
    this.$_response = null;
    let url = this.$_url;
    url = url.indexOf("//") === -1 ? window.location.origin + url : url;
    const header = Object.assign({}, this.$_header);
    this.$_requestTask = wx.request({
      url: url,
      data: this.$_data || {},
      header: header,
      method: this.$_method,
      dataType: this.$_responseType === "json" ? "json" : "text",
      responseType:
        this.$_responseType === "arraybuffer" || this.$_responseType === "blob"
          ? "arraybuffer"
          : "text",
      success: this.$_requestSuccess,
      fail: this.$_requestFail,
      complete: this.$_requestComplete,
    });
  }
  $_requestSuccess({ data, statusCode, header }) {
    this.$_status = statusCode;
    this.$_resHeader = header;
    this.$_callReadyStateChange(XMLHttpRequest.HEADERS_RECEIVED);
    if (data) {
      this.$_callReadyStateChange(XMLHttpRequest.LOADING);
      this.$$trigger("loadstart");
      if (this.$_responseType === "blob") {
        this.$_response = new Blob([data]);
      } else {
        this.$_response = data;
      }
      this.$$trigger("loadend");
    }
  }
  $_requestFail({ errMsg }) {
    this.$_status = 0;
    this.$_statusText = errMsg;
    this.$$trigger("error");
  }
  $_requestComplete() {
    this.$_startTime = null;
    this.$_requestTask = null;
    this.$_callReadyStateChange(XMLHttpRequest.DONE);
    if (this.$_status) {
      this.$$trigger("load");
    }
  }
  get timeout() {
    return this.$_timeout;
  }
  set timeout(timeout) {
    if (typeof timeout !== "number" || !isFinite(timeout) || timeout <= 0)
      return;
    this.$_timeout = timeout;
  }
  get status() {
    return this.$_status;
  }
  get statusText() {
    if (
      this.$_readyState === XMLHttpRequest.UNSENT ||
      this.$_readyState === XMLHttpRequest.OPENED
    )
      return "";
    return STATUS_TEXT_MAP[this.$_status + ""] || this.$_statusText || "";
  }
  get readyState() {
    return this.$_readyState;
  }
  get responseType() {
    return this.$_responseType;
  }
  set responseType(value) {
    if (typeof value !== "string") return;
    this.$_responseType = value;
  }
  get responseText() {
    if (!this.$_responseType || this.$_responseType === "text") {
      return this.$_response;
    }
    return null;
  }
  get responseURL() {
    return this.$_url;
  }
  get response() {
    return this.$_response;
  }
  get withCredentials() {
    return this.$_withCredentials;
  }
  set withCredentials(value) {
    this.$_withCredentials = !!value;
  }
  abort() {
    if (this.$_requestTask) {
      this.$_requestTask.abort();
      this.$$trigger("abort");
    }
  }
  getAllResponseHeaders() {
    if (
      this.$_readyState === XMLHttpRequest.UNSENT ||
      this.$_readyState === XMLHttpRequest.OPENED ||
      !this.$_resHeader
    )
      return "";
    return Object.keys(this.$_resHeader)
      .map((key) => `${key}: ${this.$_resHeader[key]}`)
      .join("\r\n");
  }
  getResponseHeader(name) {
    if (
      this.$_readyState === XMLHttpRequest.UNSENT ||
      this.$_readyState === XMLHttpRequest.OPENED ||
      !this.$_resHeader
    )
      return null;
    const key = Object.keys(this.$_resHeader).find(
      (item) => item.toLowerCase() === name.toLowerCase()
    );
    const value = key ? this.$_resHeader[key] : null;
    return typeof value === "string" ? value : null;
  }
  open(method, url) {
    if (typeof method === "string") method = method.toUpperCase();
    if (SUPPORT_METHOD.indexOf(method) < 0) {
      console.error(`url = ${url}, method = ${method}, invalid method.`)
      return;
    }
    if (!url || typeof url !== "string") {
      console.error(`url = ${url}, invalid url.`)
      return;
    }
    this.$_method = method;
    this.$_url = url;
    this.$_callReadyStateChange(XMLHttpRequest.OPENED);
  }
  setRequestHeader(header, value) {
    if (typeof header === "string" && typeof value === "string") {
      this.$_header[header] = value;
    }
  }
  async send(data) {
    if (this.$_url.indexOf("?use-native-codec=true") >= 0) {
      if (this.$_url.endsWith("?use-native-codec=true")) {
        this.$_url = this.$_url.replace("?use-native-codec=true", "");
      }
      else {
        this.$_url = this.$_url.replace("?use-native-codec=true&", "?").replace("?use-native-codec=true", "");
      }
      const imageIndex = getApp()._flutter.imageCacheNextIndex;
      getApp()._flutter.imageCacheNextIndex++;
      const img = wx.createImage();
      getApp()._flutter.imageCache[imageIndex] = img;
      img.onload = () => {
        this.$_status = 200;
        this.$_resHeader = {};
        this.$_callReadyStateChange(XMLHttpRequest.HEADERS_RECEIVED);
        this.$_callReadyStateChange(XMLHttpRequest.LOADING);
        this.$$trigger("loadstart");
        const uint8Array = new Uint8Array([
          1,
          6,
          0,
          7,
          ...(() => {
            const buffer = new ArrayBuffer(4);
            const dataView = new DataView(buffer);
            dataView.setUint32(0, imageIndex);
            return new Uint8Array(buffer);
          })(),
        ]);
        this.$_response = uint8Array.buffer;
        this.$$trigger("loadend");
        setTimeout(() => {
          this.$_callReadyStateChange(XMLHttpRequest.DONE);
          this.$$trigger("load");
        }, 50); // 过快地回调会导致 Texture 未准备完成，WebGL 出错。
      };
      img.onerror = () => {
        this.$_status = 0;
        this.$_statusText = "image load failed";
        this.$$trigger("error");
      };
      img.src = this.$_url;
      return;
    }
    if (
      this.$_url.indexOf("wxfile://") === 0 ||
      this.$_url.indexOf("http://tmp/") === 0
    ) {
      // weixin local file
      const fs = wx.getFileSystemManager();
      this.$$trigger("loadstart");
      fs.readFile({
        filePath: this.$_url,
        success: (res) => {
          this.$_status = 200;
          this.$_resHeader = {};
          this.$_callReadyStateChange(XMLHttpRequest.HEADERS_RECEIVED);
          this.$_callReadyStateChange(XMLHttpRequest.LOADING);
          this.$_response = res.data;
          this.$$trigger("loadend");
          setTimeout(() => {
            this.$_callReadyStateChange(XMLHttpRequest.DONE);
            this.$$trigger("load");
          }, 50);
        },
        fail: (err) => {
          this.$_status = 0;
          this.$_statusText = "local file load failed";
          this.$$trigger("error");
        },
      });
      return;
    }
    if (isAsset(this.$_url)) {
      if (!(await isAssetExist(this.$_url))) return;
      this.$$trigger("loadstart");
      try {
        const arrayBuffer = await readAssetAsBuffer(this.$_url);
        this.$_status = 200;
        this.$_resHeader = {};
        this.$_callReadyStateChange(XMLHttpRequest.HEADERS_RECEIVED);
        this.$_callReadyStateChange(XMLHttpRequest.LOADING);
        this.$_response = arrayBuffer;
        this.$$trigger("loadend");
        setTimeout(() => {
          this.$_callReadyStateChange(XMLHttpRequest.DONE);
          this.$$trigger("load");
        }, 50);
      } catch (error) {
        this.$_status = 0;
        this.$_statusText = "local file load failed";
        this.$$trigger("error");
      }
    }
    if (this.$_readyState !== XMLHttpRequest.OPENED) return;
    if (data instanceof Uint8Array) {
      data = data.buffer;
    }
    this.$_data = data;
    this.$_callRequest();
  }
}
XMLHttpRequest.UNSENT = 0;
XMLHttpRequest.OPENED = 1;
XMLHttpRequest.HEADERS_RECEIVED = 2;
XMLHttpRequest.LOADING = 3;
XMLHttpRequest.DONE = 4;
