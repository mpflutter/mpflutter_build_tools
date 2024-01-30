// Copyright 2023 The MPFlutter Authors. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0 that can be
// found in the LICENSE file.

// index.ts
// 获取应用实例
const { FlutterHostView } = require("./flutter");
const { wxSystemInfo } = require("./system_info");

export const main = {
  data: {
    windowHeight: 0,
    readyToDisplay: false,
    shouldCatchBack: false,
    PVWrapper: { removed: true, style: "" },
  },

  onUnload() {
    FlutterHostView.shared.onwebglcontextlost?.();
    wx.offKeyboardHeightChange(this.onkeyboardheightchange.bind(this));
  },

  async onLoad() {
    await new Promise((resolve) => {
      wx.getSystemInfoAsync({
        success: (res) => {
          Object.assign(wxSystemInfo, res);
          resolve();
        },
      });
    });
    this.setData({ windowHeight: wxSystemInfo.windowHeight });
    if (FlutterHostView.shared.onwebglcontextrestored) {
      this.restoreCanvas();
      setupFlutterHostView(this);
      this.setData({
        readyToDisplay: true,
        shouldCatchBack: FlutterHostView.shared.shouldCatchBack,
      });
      this.onEnter();
      return;
    }
    require("./mpjs");
    await loadAssetPages();
    await loadCanvasKitPages();
    await loadPlugins();

    setupFlutterHostView(this);
    setupAppLifeCycleListener();

    wx.mpcbExitState = this.exitState;
    wx.createSelectorQuery()
      .select("#my_canvas") // 在 WXML 中填入的 id
      .fields({ node: true, size: true })
      .exec(async (res) => {
        // Canvas 对象
        let canvas = res[0].node;
        resizeCanvas(canvas);

        await setupFlutterApp(canvas);
      });

    wx.onKeyboardHeightChange(this.onkeyboardheightchange.bind(this));
  },

  onEnter() {
    const enterQuery = wx.getEnterOptionsSync().query;
    wx.mpcb.onEnter(enterQuery);
  },

  onSaveExitState() {
    return wx.mpcb?.onSaveExitState();
  },

  restoreCanvas() {
    wx.createSelectorQuery()
      .select("#my_canvas") // 在 WXML 中填入的 id
      .fields({ node: true, size: true })
      .exec(async (res) => {
        // Canvas 对象
        let canvas = res[0].node;
        resizeCanvas(canvas);
        getApp()._flutter.activeCanvas = canvas;
        getApp()._flutter.activeCanvasBinded = false;
        FlutterHostView.shared.onwebglcontextlost?.();
        FlutterHostView.shared.onwebglcontextrestored?.();
      });
  },

  ontouchstart() {
    if (this.data.shouldCatchBack) return;
    FlutterHostView.shared.touching = true;
    callFlutterTouchEvent("ontouchstart", arguments);
  },

  ontouchmove() {
    if (this.data.shouldCatchBack) return;
    callFlutterTouchEvent("ontouchmove", arguments);
  },

  ontouchend() {
    if (this.data.shouldCatchBack) return;
    FlutterHostView.shared.touching = false;
    let moveEvent = {...arguments[0]};
    moveEvent.type = "touchmove"
    callFlutterTouchEvent("ontouchmove", [moveEvent]);
    callFlutterTouchEvent("ontouchend", arguments);
  },

  ontouchcancel() {
    if (this.data.shouldCatchBack) return;
    FlutterHostView.shared.touching = false;
    callFlutterTouchEvent("ontouchcancel", arguments);
  },

  ontouchstart2() {
    if (FlutterHostView.shared.textareaHasFocus) return;
    FlutterHostView.shared.touching = true;
    callFlutterTouchEvent("ontouchstart", arguments);
  },

  ontouchmove2() {
    if (FlutterHostView.shared.textareaHasFocus) return;
    FlutterHostView.shared.lastTouchTime = new Date().getTime();
    callFlutterTouchEvent("ontouchmove", arguments);
  },

  ontouchend2() {
    if (FlutterHostView.shared.textareaHasFocus) return;
    FlutterHostView.shared.touching = false;
    FlutterHostView.shared.lastTouchTime = new Date().getTime();
    let moveEvent = {...arguments[0]};
    moveEvent.type = "touchmove"
    callFlutterTouchEvent("ontouchmove", [moveEvent]);
    callFlutterTouchEvent("ontouchend", arguments);
  },

  ontouchcancel2() {
    if (FlutterHostView.shared.textareaHasFocus) return;
    FlutterHostView.shared.touching = false;
    FlutterHostView.shared.lastTouchTime = new Date().getTime();
    callFlutterTouchEvent("ontouchcancel", arguments);
  },

  onkeyboardheightchange(detail) {
    let a = { detail: detail };
    if (shouldDelayKeyboardHeightChange()) {
      setTimeout(() => {
        if (!FlutterHostView.shared.inputHasFocus) {
          FlutterHostView.shared.onkeyboardheightchange.apply(null, [a]);
        }
      }, 100);
      return;
    }
    FlutterHostView.shared.onkeyboardheightchange.apply(null, [a]);
  },

  onPageContainerHide() {
    if (
      this.data.shouldCatchBack &&
      new Date().getTime() - (FlutterHostView.shared.lastTouchTime ?? 0) > 1000
    ) {
      // Android Back Pressed
      FlutterHostView.shared.onAndroidBackPressed?.();
    }
    if (FlutterHostView.shared.shouldCatchBack) {
      this.setData({
        shouldCatchBack: false,
      });
      setTimeout(() => {
        this.setData({
          shouldCatchBack: true,
        });
      }, 100);
    } else {
      this.setData({
        shouldCatchBack: false,
      });
    }
  },

  onShareAppMessage(detail) {
    if (wx.mpcb.onShareAppMessage) {
      return {
        ...wx.mpcb.onShareAppMessage(detail),
      };
    } else if (wx.mpcb.onShareAppMessageAsync) {
      return {
        promise: new Promise((resolve) => {
          wx.mpcb.onShareAppMessageAsync(detail, (result) => {
            resolve(result);
          });
        }),
      };
    }
  },

  onShareTimeline(detail) {
    if (wx.mpcb.onShareTimeline) {
      return {
        ...wx.mpcb.onShareTimeline(detail),
      };
    } else if (wx.mpcb.onShareTimelineAsync) {
      return {
        promise: new Promise((resolve) => {
          wx.mpcb.onShareTimelineAsync(detail, (result) => {
            resolve(result);
          });
        }),
      };
    }
  },

  onAddToFavorites(detail) {
    if (wx.mpcb.onAddToFavorites) {
      return {
        ...wx.mpcb.onAddToFavorites(detail),
      };
    } else if (wx.mpcb.onAddToFavoritesAsync) {
      return {
        promise: new Promise((resolve) => {
          wx.mpcb.onAddToFavoritesAsync(detail, (result) => {
            resolve(result);
          });
        }),
      };
    }
  },

  onPVCB(e) {
    if (e.target) {
      const event = e.type;
      const pvid = e.target.id;
      const detail = e.detail;
      getApp()._flutter.self.platformViewManager.onPVCB({
        pvid,
        event,
        detail,
      });
    }
  },
};

Page(main);

function loadAssetPages() {
  return new Promise((resolve) => {
    require("../../assets/pages/index", resolve);
  });
}

function loadCanvasKitPages() {
  return new Promise((resolve) => {
    require("../../canvaskit/pages/index", resolve);
  });
}

async function loadPlugins() {
  // loadPlugins
}

function setupAppLifeCycleListener() {
  wx.onAppShow(() => {
    wx.mpcb?.onShow?.();
  });
  wx.onAppHide(() => {
    wx.mpcb?.onHide?.();
  });
}

function setupFlutterHostView(self) {
  FlutterHostView.shared.self = self;

  FlutterHostView.shared.requireCatchBack = (shouldCatchBack) => {
    FlutterHostView.shared.shouldCatchBack = shouldCatchBack;
    const self = FlutterHostView.shared.self;
    setTimeout(() => {
      self.setData({
        shouldCatchBack: !self.data.shouldCatchBack,
      });
      setTimeout(() => {
        self.setData({
          shouldCatchBack: shouldCatchBack,
        });
      }, 100);
    }, 200);
  };

  FlutterHostView.shared.self.setData({
    licenseUrl:
      "https://license.mpflutter.com/" +
      wx.getAccountInfoSync().miniProgram.appId +
      ".png",
  });
}

function resizeCanvas(canvas) {
  canvas.width = canvas.width * wxSystemInfo.pixelRatio;
  canvas.height = canvas.height * wxSystemInfo.pixelRatio;
  getApp()._flutter.window.requestAnimationFrame = canvas.requestAnimationFrame;
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

function shouldDelayKeyboardHeightChange() {
  return (
    FlutterHostView.shared.inputHasFocus && arguments[0].detail.height <= 0
  );
}
