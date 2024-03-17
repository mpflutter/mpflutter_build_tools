// Copyright 2023 The MPFlutter Authors. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0 that can be
// found in the LICENSE file.

const { FlutterHostView } = require("./flutter");
const { wxSystemInfo } = require("./system_info");

export class Main {
  constructor(canvas) {
    this.canvas = canvas;
    this.canvas.requestAnimationFrame = (cb) => {
      requestAnimationFrame(cb);
      return 0.0;
    };
    this.addEventListeners();
  }

  async run() {
    await new Promise((resolve) => {
      // 微信小程序 getSystemInfoAsync 接口在 PC 上是存在 BUG 的
      // https://developers.weixin.qq.com/community/develop/doc/000e46e65dc4e0be8a305ecb161c00?highLine=getsysteminfoasync%2520fail
      const res = wx.getSystemInfoSync();
      Object.assign(wxSystemInfo, res);
      resolve();
    });
    await Promise.all([loadAssetPages(), loadCanvasKitPages(), loadPlugins()]);
    FlutterHostView.shared.self = this;
    getApp()._flutter.window.requestAnimationFrame =
      this.canvas.requestAnimationFrame;
    getApp()._flutter.activeCanvas = this.canvas;
    this.canvas.width = this.canvas.width * wxSystemInfo.pixelRatio;
    this.canvas.height = this.canvas.height * wxSystemInfo.pixelRatio;
    setupFlutterApp(this.canvas);

    for (var i = 0; i < 10; i++) {
      setTimeout(() => {
        FlutterHostView.shared.onwebglcontextlost?.();
        FlutterHostView.shared.onwebglcontextrestored?.();
      }, i * 100);
    }
  }

  setData() {}

  addEventListeners() {
    wx.onTouchStart(this.ontouchstart.bind(this));
    wx.onTouchMove(this.ontouchmove.bind(this));
    wx.onTouchEnd(this.ontouchend.bind(this));
    wx.onTouchCancel(this.ontouchcancel.bind(this));
  }

  ontouchstart() {
    FlutterHostView.shared.touching = true;
    callFlutterTouchEvent("ontouchstart", arguments);
  }

  ontouchmove() {
    callFlutterTouchEvent("ontouchmove", arguments);
  }

  ontouchend() {
    FlutterHostView.shared.touching = false;
    callFlutterTouchEvent("ontouchend", arguments);
  }

  ontouchcancel() {
    FlutterHostView.shared.touching = false;
    callFlutterTouchEvent("ontouchcancel", arguments);
  }
}

function loadAssetPages() {
  return new Promise((resolve) => {
    wx.loadSubpackage({
      name: "assets",
      success: function () {
        resolve();
      },
      fail: function () {
        resolve();
      },
    });
  });
}

function loadCanvasKitPages() {
  return new Promise((resolve) => {
    wx.loadSubpackage({
      name: "canvaskit",
      success: function () {
        resolve();
      },
      fail: function () {
        resolve();
      },
    });
  });
}

async function loadPlugins() {
  // loadPlugins
}

function setupFlutterApp(canvas) {
  return new Promise((resolve) => {
    getApp()._flutter.loader.loadEntrypoint({
      onEntrypointLoaded: function (engineInitializer) {
        engineInitializer
          .initializeEngine()
          .then(function (appRunner) {
            appRunner.runApp();
            resolve();
          })
          .catch(function (e) {
            console.error(e);
          });
      },
    });
  });
}

function callFlutterTouchEvent(eventName, args) {
  if (FlutterHostView.shared[eventName]) {
    FlutterHostView.shared[eventName].apply(null, [
      FlutterHostView.transformTouchEvent(args[0]),
    ]);
  }
}
