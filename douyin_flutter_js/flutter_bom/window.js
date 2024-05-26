// Copyright 2023 MPFlutter Authors. All rights reserved.
// Use of this source code is governed by a Apache-2.0 license that can be
// found in the LICENSE file.

const { wxSystemInfo } = require("../system_info");

export class FlutterMiniProgramMockWindow {
  // globals
  parseFloat = parseFloat;
  parseInt = parseInt;
  console = console;
  requestAnimationFrame;
  TouchEvent = {};
  performance = {
    now: () => new Date().getTime(),
  };

  // screens
  get devicePixelRatio() {
    return 1;
    // return wxSystemInfo.pixelRatio;
  }

  get innerWidth() {
    return wxSystemInfo.windowWidth;
  }

  get innerHeight() {
    return wxSystemInfo.windowHeight;
  }

  // webs
  navigator = {
    appVersion: "",
    platform: "",
    userAgent: "",
    vendor: "",
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
    mark: function () { },
    measure: function () { },
  };
  history = {
    replaceState: () => { },
    pushState: () => { },
    state: {},
  };
  dispatchEvent() {
    return true;
  }
  addEventListener(event, callback) { }
  removeEventListener() { }
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
      addListener: () => { },
    };
  }
  fetch = (url, options) => {
    if (!options) {
      options = {};
    }
    return new Promise(async (resolve, reject) => {
      if (
        url.startsWith("https://fonts.gstatic.com/s/notosanssc/") &&
        (url.endsWith(".otf") || url.endsWith(".ttf"))
      ) {
        let mUrl = "/assets/fonts/NotoSansSC-Regular.ttf";
        let subPackageUrl = require("../assets").default[mUrl] ?? mUrl;
        await new Promise((resolve) => {
          require(`../../../${subPackageUrl.split("/")[1]
            }/pages/index`, resolve);
        });
        const fs = tt.getFileSystemManager();
        const brExists = await new Promise((resolve) => {
          fs.getFileInfo({
            filePath: subPackageUrl + ".br",
            success: () => {
              resolve(true);
            },
            fail: () => {
              resolve(false);
            },
          });
        });
        if (brExists) {
          url = mUrl;
        }
        const abPngExists = await new Promise((resolve) => {
          fs.getFileInfo({
            filePath: subPackageUrl + ".ab.png",
            success: () => {
              resolve(true);
            },
            fail: () => {
              resolve(false);
            },
          });
        });
        if (abPngExists) {
          url = mUrl;
        }
      }
      if (url.startsWith("/")) {
        let subPackageUrl = require("../assets").default[url] ?? url;
        await new Promise((resolve) => {
          require(`../../../${subPackageUrl.split("/")[1]
            }/pages/index`, resolve);
        });
        let br = false;
        let abPng = false;
        const fs = tt.getFileSystemManager();

        const brExists = await new Promise((resolve) => {
          fs.getFileInfo({
            filePath: subPackageUrl + ".br",
            success: () => {
              resolve(true);
            },
            fail: () => {
              resolve(false);
            },
          });
        });
        if (brExists) {
          br = true;
          subPackageUrl = subPackageUrl + ".br";
        }

        const abPngExists = await new Promise((resolve) => {
          fs.getFileInfo({
            filePath: subPackageUrl + ".ab.png",
            success: () => {
              resolve(true);
            },
            fail: () => {
              resolve(false);
            },
          });
        });
        if (abPngExists) {
          abPng = true;
          subPackageUrl = subPackageUrl + ".ab.png";
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
                const result = {
                  done: false,
                  value: new Uint8Array(
                    (() => {
                      if (br) {
                        return fs.readCompressedFileSync({
                          filePath: subPackageUrl,
                          compressionAlgorithm: "br",
                        });
                      } else if (abPng) {
                        return fs.readFileSync(subPackageUrl);
                      } else {
                        return fs.readFileSync(subPackageUrl);
                      }
                    })()
                  ),
                };
                bodyReadDone = true;
                return result;
              },
            };
          },
        };
        const arrayBuffer = async () => {
          const originBuffer = (() => {
            if (br) {
              return fs.readCompressedFileSync({
                filePath: subPackageUrl,
                compressionAlgorithm: "br",
              });
            } else if (abPng) {
              return fs.readFileSync(subPackageUrl);
            } else {
              return fs.readFileSync(subPackageUrl);
            }
          })();
          const newBuffer = new ArrayBuffer(originBuffer.byteLength);
          const sourceArray = new Uint8Array(originBuffer);
          const targetArray = new Uint8Array(newBuffer);
          targetArray.set(sourceArray);
          return newBuffer;
        };
        const text = async () => {
          if (br) {
            const tmpFile = tt.env.USER_DATA_PATH + "/brtext_tmp";
            fs.writeFileSync(
              tmpFile,
              fs.readCompressedFileSync({
                filePath: subPackageUrl,
                compressionAlgorithm: "br",
              })
            );
            const localFileText = fs.readFileSync(tmpFile, "utf8");
            fs.removeSavedFile({
              filePath: tmpFile,
            });
            return localFileText;
          }
          const localFileText = fs.readFileSync(subPackageUrl, "utf-8");
          return localFileText;
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
      tt.request({
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
            const tmpFile = tt.env.USER_DATA_PATH + "/brtext_tmp";
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
  // bizs
  flutterConfiguration = {
    assetBase: "/",
  };
  CanvasKitInit() {
    return new Promise((resolve) => {
      tt.createSelectorQuery()
        .select("#my_canvas") // 在 WXML 中填入的 id
        .fields({
          node: true,
          size: true,
        })
        .exec((res) => {
          const { CanvasKitInit, GLVersion, GlobalModules } = require("../canvaskit");
          const _flutter = getApp()._flutter;
          // Canvas 对象
          let canvas = res[0].node;

          if (GLVersion == 1) {
            const ctx = canvas.getContext("webgl");
            const originGetParameter = ctx.getParameter.bind(ctx);
            ctx.getParameter = function (v) {
              if (v === 7938) {
                return "OpenGL ES 3.0 Metal - 99";
              }
              if (v === 35724) {
                return "OpenGL ES GLSL ES 1.00";
              }
              else if (v === 7937) {
                return "Apple A15 GPU";
              }
              else if (v === 7936) {
                return "Apple Inc.";
              }
              else if (v === 36183) {
                return 4;
              }
              else if (v === 32937) {
                return 1;
              }
              return originGetParameter(v);
            };
          }

          _flutter.activeCanvas = canvas;
          // 渲染上下文

          const SkslInit = require("../sksl");
          SkslInit().then((skslModule) => {
            GlobalModules.skslModule = skslModule;
            const ckLoaded = CanvasKitInit(canvas);
            ckLoaded.then((CanvasKit) => {
              const surface = CanvasKit.MakeCanvasSurface(canvas);
              _flutter.window.flutterCanvasKit = CanvasKit;
              if (!global.window) {
                global.window = _flutter.window;
              }
              global.window.flutterCanvasKit = CanvasKit;
              resolve(CanvasKit);
            });
          })
        });
    });
  }
}
