// Copyright 2023 MPFlutter Authors. All rights reserved.
// Use of this source code is governed by a Apache-2.0 license that can be
// found in the LICENSE file.

const GLVersion = 2;

export class FlutterMiniProgramMockDocument {
  addEventListener(event, callback) {}
  removeEventListener(event, callback) {}

  documentElement = {};

  body = new(require("./element").FlutterMiniProgramMockElement)();

  currentScript = {
    src: "/",
    getAttribute: function () {},
  };

  createElement(tag) {
    if (tag === "script") {
      let successCallback;
      const element = {
        addEventListener(event, callback) {
          if (event === "load") {
            successCallback = callback;
          }
        },
        remove() {},
      };
      setTimeout(() => {
        successCallback({});
      }, 32);
      element.tagName = tag;
      return element;
    } else if (tag === "canvas") {
      const _flutter = getApp()._flutter;
      const isOffScreen = _flutter.activeCanvasBinded === true;
      let canvas = !isOffScreen ? _flutter.activeCanvas : wx.createOffscreenCanvas({
        type: GLVersion >= 2 ? "webgl2" : "webgl",
        width: 1,
        height: 1
      });
      setTimeout(() => {
        _flutter.activeCanvasBinded = true;
      }, 0);
      let mockElement =
        new(require("./element").FlutterMiniProgramMockElement)();
      mockElement.tagName = "canvas";
      mockElement.isOffscreenCanvas = isOffScreen;
      for (const key in mockElement) {
        canvas[key] = mockElement[key];
      }
      let recreateOffScrrenCanvas;
      if (!isOffScreen) {
        let oriGetContext = canvas.getContext.bind(canvas);
        canvas.getContext = function (type) {
          if (GLVersion > 1) {
            return oriGetContext("webgl2", {alpha: true});
          } else {
            return oriGetContext("webgl", {alpha: true});
          }
        };
      } else {
        recreateOffScrrenCanvas = function() {
          mockElement.onwebglcontextlost?.();
          mockElement.onwebglcontextrestored?.();
          let newCanvas = wx.createOffscreenCanvas({
            type: GLVersion >= 2 ? "webgl2" : "webgl",
            width: canvas._width,
            height: canvas._height
          });
          let oriGetContext = newCanvas.getContext.bind(newCanvas);
          canvas.getContext = function (type) {
            if (GLVersion > 1) {
              return oriGetContext("webgl2", {alpha: true});
            } else {
              return oriGetContext("webgl", {alpha: true});
            }
          };
        }
      }
      Object.defineProperty(canvas, "width", {
        get: function () {
          return canvas.width;
        },
        set: function (value) {
          if (isOffScreen) {
            this._width = value;
          }
          if (isOffScreen && this._width && this._height) {
            recreateOffScrrenCanvas();
          }
        },
        enumerable: true,
        configurable: true,
      });
      Object.defineProperty(canvas, "height", {
        get: function () {
          return canvas.height;
        },
        set: function (value) {
          if (isOffScreen) {
            this._height = value;
          }
          if (isOffScreen && this._width && this._height) {
            recreateOffScrrenCanvas();
          }
        },
        enumerable: true,
        configurable: true,
      });
      return canvas;
    } else if (tag === "flutter-view") {
      const el = new(require("./element").FlutterMiniProgramMockElement)();
      el.tagName = "flutter-view";
      return el;
    } else if (tag === "input") {
      const el = new(require("./input").FlutterMiniProgramMockInputElement)();
      el.tagName = "input";
      return el;
    } else if (tag === "textarea") {
      const el =
        new(require("./input").FlutterMiniProgramMockTextAreaElement)();
      el.tagName = "textarea";
      return el;
    } else if (tag === "form") {
      const el = new(require("./input").FlutterMiniProgramMockFormElement)();
      el.tagName = "form";
      return el;
    } else {
      const el = new(require("./element").FlutterMiniProgramMockElement)();
      el.tagName = tag;
      return el;
    }
  }

  hasFocus() {
    return wx._mpflutter_hasFocus === true;
  }

  createEvent() {
    return {
      initEvent: function () {},
    };
  }

  head = new(require("./element").FlutterMiniProgramMockElement)();

  querySelector() {}

  createMockElement() {
    // 实现 createMockElement 函数的逻辑
  }

  execCommand(command) {
    console.log("execCommand", command);
  }
}