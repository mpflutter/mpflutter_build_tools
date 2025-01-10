// Copyright 2023 MPFlutter Authors. All rights reserved.
// Use of this source code is governed by a Apache-2.0 license that can be
// found in the LICENSE file.

const { wxSystemInfo } = require("../system_info");
const { useMiniTex, embeddingFonts } = require("../minitex");
const {
  isAsset,
  isAssetExist,
  readAssetAsBuffer,
  readAssetAsText,
} = require("./asset_reader");
const { Event } = require("./event");

function arrayBufferToUtf8String(arrayBuffer) {
  const uint8Array = new Uint8Array(arrayBuffer);
  let utf8String = "";

  for (let i = 0; i < uint8Array.length; i++) {
    utf8String += String.fromCharCode(uint8Array[i]);
  }

  return decodeURIComponent(escape(utf8String));
}

export class FlutterMiniProgramMockWindow {
  // globals
  parseFloat = parseFloat;
  parseInt = parseInt;
  console = console;
  requestAnimationFrame;
  TouchEvent = {};
  PointerEvent = {};
  performance = {
    now: () => new Date().getTime(),
  };

  // screens
  get devicePixelRatio() {
    return wxSystemInfo.pixelRatio;
  }

  get innerWidth() {
    return wxSystemInfo.windowWidth;
  }

  get innerHeight() {
    return wxSystemInfo.windowHeight - this._keyboardHeight;
  }

  get flutterCanvasKitLoaded() {
    let p = this._flutterCanvasKitLoadedPromise ?? new Promise(async (resolve) => {
      resolve(await this.CanvasKitInit())
    })
    this._flutterCanvasKitLoadedPromise = p
    return p
  }

  // keyboard

  _keyboardHeight = 0;

  keyboardHeightChanged(height) {
    this._keyboardHeight = height;
    if (this.onResize) {
      this.onResize(new Event());
    }
  }

  // webs
  navigator = {
    appVersion: "",
    platform: "iPhone",
    userAgent: "",
    vendor: "Apple Computer, Inc.",
    language: "zh",
    geolocation: {},
  };
  location = {
    href: "",
    hash: "",
    search: "",
    pathname: "",
  };
  localStorage = new (require("./storage").LocalStorage)();
  performance = {
    now: () => {
      return new Date().getTime();
    },
    mark: function () {},
    measure: function () {},
  };
  history = {
    replaceState: () => {},
    pushState: () => {},
    state: {},
  };
  dispatchEvent() {
    return true;
  }
  addEventListener(event, callback) {
    if (event === "resize") {
      this.onResize = callback;
    } else if (event === "pointermove") {
      FlutterHostView.shared.ontouchmove = callback;
    } else if (event === "pointerup") {
      FlutterHostView.shared.onpointerup = callback;
    }
  }
  removeEventListener(event) {
    if (event === "resize") {
      this.onResize = undefined;
    }
  }
  getComputedStyle() {
    return {
      getPropertyValue: () => {
        return "";
      },
    };
  }
  matchMedia() {
    return {
      matches: false,
      addListener: () => {},
    };
  }
  fetch = (url, options) => {
    if (!options) {
      options = {};
    }
    return new Promise(async (resolve, reject) => {
      if (useMiniTex && url.startsWith("https://fonts.gstatic.com/s/")) {
        const responseData = {
          ok: true,
          status: 200,
          statusText: "OK",
          headers: {},
          arrayBuffer: async function () {
            return new ArrayBuffer(0);
          },
          text: async function () {
            return "";
          },
        };
        setTimeout(() => {
          resolve(responseData);
        }, 32);
        return;
      }
      if (
        url.startsWith("https://fonts.gstatic.com/s/") &&
        (url.endsWith(".otf") || url.endsWith(".ttf"))
      ) {
        url = "/assets/fonts/NotoSansSC-Regular.ttf";
      }
      if (isAsset(url)) {
        if (!(await isAssetExist(url))) {
          reject(new Error("404"));
          return;
        }
        let bodyReadDone = false;
        const body = {
          getReader: () => {
            return {
              read: async () => {
                if (bodyReadDone) {
                  return {
                    done: true,
                  };
                }
                const arrayBuffer = await readAssetAsBuffer(url);
                const result = {
                  done: false,
                  value: new Uint8Array(arrayBuffer),
                };
                bodyReadDone = true;
                return result;
              },
            };
          },
        };
        const arrayBuffer = async () => {
          const originBuffer = await readAssetAsBuffer(url);
          const newBuffer = new ArrayBuffer(originBuffer.byteLength);
          const sourceArray = new Uint8Array(originBuffer);
          const targetArray = new Uint8Array(newBuffer);
          targetArray.set(sourceArray);
          return newBuffer;
        };
        const text = async () => {
          return await readAssetAsText(url);
        };
        const json = async () => {
          const localFileText = await text();
          return JSON.parse(localFileText);
        };

        const clone = async () => fetch(subPackageUrl, options);

        const responseData = {
          ok: true,
          status: 200,
          statusText: "OK",
          headers: {},
          arrayBuffer: arrayBuffer,
          text: text,
          json: json,
          clone: clone,
          body: body,
        };
        setTimeout(() => {
          resolve(responseData);
        }, 32);
        return;
      }
      wx.request({
        url: url,
        method: options.method || "GET",
        data: options.body,
        header: options.headers,
        responseType: "arraybuffer",
        success: (response) => {
          const headers = response.header;
          const status = response.statusCode;
          const statusText = "OK"; // 在微信小程序中，没有直接获取状态文本的方法，因此使用'OK'作为默认值

          const abData = response.data;

          const text = async () => {
            const tmpFile = wx.env.USER_DATA_PATH + "/brtext_tmp";
            fs.writeFileSync(tmpFile, abData);
            const localFileText = fs.readFileSync(tmpFile, "utf8");
            fs.removeSavedFile({
              filePath: tmpFile,
            });
            return localFileText;
          };

          const json = async () => {
            const localFileText = await text();
            return JSON.parse(localFileText);
          };

          const arrayBuffer = () => Promise.resolve(abData);

          const clone = () => fetch(url, options);

          const responseData = {
            ok: status >= 200 && status < 300,
            status: status,
            statusText: statusText,
            headers: headers,
            text: text,
            json: json,
            clone: clone,
            arrayBuffer: arrayBuffer,
          };

          resolve(responseData);
        },
        fail: (error) => {
          reject(error);
        },
      });
    });
  };
  // MiniTex
  async MiniTexInit(CanvasKit) {
    const { MiniTex } = await new Promise((resolve) => {
      require("../../../canvaskit/pages/minitex/index", resolve);
    });
    let iconDatas = {};
    const fs = wx.getFileSystemManager();

    const loadSVGFont = async (iconPath) => {
      await new Promise((resolve) => {
        require(`../../../${iconPath.split("/")[1]}/pages/index`, resolve);
      });
      const svgExists = await new Promise((resolve) => {
        fs.getFileInfo({
          filePath: iconPath + ".svg.br",
          success: () => {
            resolve(true);
          },
          fail: () => {
            resolve(false);
          },
        });
      });
      if (svgExists) {
        return wx.getFileSystemManager().readCompressedFileSync({
          filePath: iconPath + ".svg.br",
          compressionAlgorithm: "br",
        });
      }
    };
    const materialIconPath =
      require("../assets").default["/assets/fonts/MaterialIcons-Regular.otf"];
    if (materialIconPath) {
      const materialIconsData = await loadSVGFont(materialIconPath);
      if (materialIconsData) {
        iconDatas["MaterialIcons"] = arrayBufferToUtf8String(materialIconsData);
      }
    }
    const cupertinoIconPath =
      require("../assets").default[
        "/assets/packages/cupertino_icons/assets/CupertinoIcons.ttf"
      ];
    if (cupertinoIconPath) {
      const cupertinoIconData = await loadSVGFont(cupertinoIconPath);
      if (cupertinoIconData) {
        iconDatas["packages/cupertino_icons/CupertinoIcons"] =
          arrayBufferToUtf8String(cupertinoIconData);
      }
    }
    MiniTex.install(
      CanvasKit,
      wxSystemInfo.devicePixelRatio,
      embeddingFonts,
      iconDatas
    );
  }
  // bizs
  flutterConfiguration = {
    assetBase: "/",
  };
  CanvasKitInit() {
    return new Promise((resolve) => {
      wx.createSelectorQuery()
        .select("#my_canvas") // 在 WXML 中填入的 id
        .fields({
          node: true,
          size: true,
        })
        .exec(async (res) => {
          const { CanvasKitInit, GLInfo } = await new Promise((resolve) => {
            require("../../../canvaskit/pages/canvaskit", resolve);
          });
          const _flutter = getApp()._flutter;
          GLInfo.GLVersion = getApp()._FlutterGLVersion;
          // Canvas 对象
          let canvas = res[0].node;

          if (GLInfo.GLVersion > 1) {
            const ctx = canvas.getContext("webgl2", {
              // preserveDrawingBuffer: true,
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
          } else {
            canvas.getContext("webgl", {
              // preserveDrawingBuffer: true,
              alpha: true,
            });
          }

          _flutter.activeCanvas = canvas;
          // 渲染上下文
          const ckLoaded = CanvasKitInit(canvas);
          ckLoaded.then(async (CanvasKit) => {
            if (useMiniTex) {
              await this.MiniTexInit(CanvasKit);
            }
            const surface = CanvasKit.MakeCanvasSurface(canvas);
            _flutter.window.flutterCanvasKit = CanvasKit;
            if (!globalThis.window) {
              globalThis.window = _flutter.window;
            }
            globalThis.window.flutterCanvasKit = CanvasKit;
            resolve(CanvasKit);
          }).catch(e => {
            console.error(e);
          });
        });
    });
  }
}
