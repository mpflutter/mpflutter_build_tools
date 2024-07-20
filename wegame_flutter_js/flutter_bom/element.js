// Copyright 2023 MPFlutter Authors. All rights reserved.
// Use of this source code is governed by a Apache-2.0 license that can be
// found in the LICENSE file.

const { Event } = require("./event");

export class FlutterMiniProgramMockElement {
  constructor() {
    this.$$clazz$$ = "Element";
  }

  tagName = "";
  attachShadow = () => {
    return new FlutterMiniProgramMockElement();
  };
  append = (child) => {
    if (child.tagName === "canvas") {
      child.isOffscreenCanvas = false;
    }
    return {};
  };
  prepend = () => {
    return {};
  };
  insertBefore = () => {
    return {};
  };
  appendChild = (child) => {
    if (child.tagName === "canvas") {
      child.isOffscreenCanvas = false;
    }
    return {};
  };
  getAttribute = (key) => {
    return this[key];
  };
  setAttribute = (key, value) => {
    this[key] = value;
  };
  removeAttribute = () => {};
  style = {
    setProperty: () => {},
  };
  querySelectorAll = () => {
    return [];
  };
  sheet = {
    cssRules: [],
    insertRule: () => {
      return 0.0;
    },
  };
  addEventListener = (event, callback) => {
    if (this.tagName === "flutter-view") {
      if (event === "touchstart" || event === "pointerdown") {
        FlutterHostView.shared.ontouchstart = callback;
      } else if (event === "touchmove" || event === "pointermove") {
        FlutterHostView.shared.ontouchmove = callback;
      } else if (event === "touchend" || event === "pointercancel") {
        FlutterHostView.shared.ontouchend = callback;
      } else if (event === "touchcancel") {
        FlutterHostView.shared.ontouchcancel = callback;
      }
    } else if (this.tagName === "canvas") {
      if (event === "webglcontextlost") {
        if (!this.isOffscreenCanvas) {
          FlutterHostView.shared.onwebglcontextlost = () => {
            const event = new Event();
            event.target = this;
            callback(event);
          };
        }
        this.onwebglcontextlost = () => {
          const event = new Event();
          event.target = this;
          callback(event);
        }
      } else if (event === "webglcontextrestored") {
        if (!this.isOffscreenCanvas) {
          FlutterHostView.shared.onwebglcontextrestored = () => {
            const event = new Event();
            event.target = this;
            callback(event);
          };
        }
        this.onwebglcontextrestored = () => {
          const event = new Event();
          event.target = this;
          callback(event);
        }
      }
    }
  };
  removeEventListener = () => {};
  getBoundingClientRect = () => {
    return {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
    };
  };
  remove = () => {};
  contains = () => false;
  classList = {
    add: function () {},
  };
}
