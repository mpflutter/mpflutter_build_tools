// Copyright 2023 MPFlutter Authors. All rights reserved.
// Use of this source code is governed by a Apache-2.0 license that can be
// found in the LICENSE file.

const GLVersion = 1;

export class FlutterMiniProgramMockDocument {
  addEventListener(event, callback) {}
  removeEventListener(event, callback) {}

  documentElement = {};

  body = new (require("./element").FlutterMiniProgramMockElement)();

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
      const el = new(require("./canvas_element").FlutterMiniProgramMockCanvasElement)();
      return el;
    } else if (tag === "flutter-view") {
      const el = new (require("./element").FlutterMiniProgramMockElement)();
      el.tagName = "flutter-view";
      return el;
    } else if (tag === "input") {
      const el = new (require("./input").FlutterMiniProgramMockInputElement)();
      el.tagName = "input";
      return el;
    } else if (tag === "textarea") {
      const el =
        new (require("./input").FlutterMiniProgramMockTextAreaElement)();
      el.tagName = "textarea";
      return el;
    } else if (tag === "form") {
      const el = new (require("./input").FlutterMiniProgramMockFormElement)();
      el.tagName = "form";
      return el;
    } else {
      const el = new (require("./element").FlutterMiniProgramMockElement)();
      el.tagName = tag;
      return el;
    }
  }

  createTextNode() {
    const el = new(require("./element").FlutterMiniProgramMockElement)();
    el.tagName = 'text';
    return el;
  }

  hasFocus() {
    return false;
  }

  createEvent() {
    return {
      initEvent: function () {},
    };
  }

  head = new (require("./element").FlutterMiniProgramMockElement)();

  querySelector() {}

  createMockElement() {
    // 实现 createMockElement 函数的逻辑
  }

  execCommand(command) {
    console.log("execCommand", command);
  }
}
