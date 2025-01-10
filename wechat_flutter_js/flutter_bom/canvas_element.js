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
        this.backendCanvas = wx.createOffscreenCanvas({
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
        if (GLVersion >= 2) {
          const ctx = this.backendCanvas.getContext("webgl2", {
            alpha: true,
          });
          const originGetParameter = ctx.getParameter.bind(ctx);
          ctx.getParameter = function (v) {
            if (v === 7938) {
              const value = originGetParameter(v);
              if (value.indexOf("OpenGL ES 3.2") > 0) {
                return "WebGL 2.0 (OpenGL ES 3.2 Chromium)";
              } else {
                return value;
              }
            } else if (v === 35724) {
              const value = originGetParameter(v);
              if (value.indexOf("GLSL ES") < 0) {
                return "WebGL GLSL ES 3.00 (OpenGL ES GLSL ES 3.2 Chromium)";
              }
              else if (value.indexOf("OpenGL ES 3.2") > 0) {
                return "WebGL GLSL ES 3.00 (OpenGL ES GLSL ES 3.2 Chromium)";
              } else {
                return value;
              }
            } else if (v === 3415) {
              return 0;
            }
            return originGetParameter(v);
          };
        }
        setTimeout(() => {
          this.onwebglcontextlost?.()
        }, 0);
      } else {
        const _flutter = getApp()._flutter;
        this.backendCanvas = _flutter.activeCanvas;
      }
    }
    if (!this.isOffscreenCanvas) {
      getApp()._flutter.activeCanvasBinded = true;
    }
    if (attrs) {
      attrs.alpha = true;
    }
    else {
      attrs = { alpha: true };
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
