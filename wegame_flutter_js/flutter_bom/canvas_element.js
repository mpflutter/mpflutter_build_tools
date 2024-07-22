// Copyright 2023 MPFlutter Authors. All rights reserved.
// Use of this source code is governed by a Apache-2.0 license that can be
// found in the LICENSE file.

const { FlutterMiniProgramMockElement } = require("./element");

export class FlutterMiniProgramMockCanvasElement extends FlutterMiniProgramMockElement {
  constructor() {
    super();
    this.$$clazz$$ = "Element";
  }

  tagName = "canvas";
  isOffscreenCanvas = true;
  backendCanvas = undefined;

  setAttribute = (key, value) => {
    this[key] = value;
    if (key === 'aria-hidden') {
      if (getApp()._flutter.activeCanvasBinded) {
        this.isOffscreenCanvas = true;
      } else {
        this.isOffscreenCanvas = false;
      }
    }
  };

  getContext(eagerType, attrs) {
    const GLVersion = getApp()._FlutterGLVersion;
    if (this.backendCanvas && this.isOffscreenCanvas) {
      if (this.backendCanvas.width != this.width || this.backendCanvas.height != this.height) {
        this.backendCanvas = undefined;
      }
    }
    if (!this.backendCanvas) {
      if (this.isOffscreenCanvas) {
        this.backendCanvas = wx.createCanvas({
          type: (() => {
            if (eagerType.indexOf("webgl") >= 0) {
              return GLVersion >= 2 ? "webgl2" : "webgl";
            } else {
              return eagerType;
            }
          })(),
          width: this.width,
          height: this.height,
        });
      } else {
        const _flutter = getApp()._flutter;
        this.backendCanvas = _flutter.activeCanvas;
      }
    }
    if (!this.isOffscreenCanvas) {
      getApp()._flutter.activeCanvasBinded = true;
    }
    if (eagerType.indexOf("webgl") >= 0) {
      return this.backendCanvas.getContext(
        GLVersion >= 2 ? "webgl2" : "webgl",
        attrs
      );
    } else {
      return this.backendCanvas.getContext(eagerType, attrs);
    }
  }
}
