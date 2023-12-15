// index.ts
// 获取应用实例
const { FlutterHostView } = require("./flutter");

let resumeTimer = undefined;

Page({
  data: {
    inputValue: "",
    inputType: "",
    inputPassword: false,
    inputConfirmType: "",
    inputFocus: false,
    textareaFocus: false,
    inputHoldKeyboard: true,
    inputSelectionStart: -1,
    inputSelectionEnd: -1,
    readyToDisplay: false,
    shouldCatchBack: false,
  },

  async onLoad() {
    require("./mpjs");
    await loadAssetPages();
    await loadCanvasKitPages();

    setupFlutterHostView(this);

    wx.createSelectorQuery()
      .select("#my_canvas") // 在 WXML 中填入的 id
      .fields({ node: true, size: true })
      .exec(async (res) => {
        // Canvas 对象
        let canvas = res[0].node;
        resizeCanvas(canvas);

        await setupFlutterApp(canvas);
        setTimeout(() => {
          this.setData({ readyToDisplay: true });
        }, 1000);
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
    callFlutterTouchEvent("ontouchend", arguments);
  },

  ontouchcancel() {
    if (this.data.shouldCatchBack) return;
    FlutterHostView.shared.touching = false;
    callFlutterTouchEvent("ontouchcancel", arguments);
  },

  ontouchstart2() {
    FlutterHostView.shared.touching = true;
    callFlutterTouchEvent("ontouchstart", arguments);
  },

  ontouchmove2() {
    FlutterHostView.shared.lastTouchTime = new Date().getTime();
    callFlutterTouchEvent("ontouchmove", arguments);
  },

  ontouchend2() {
    FlutterHostView.shared.touching = false;
    FlutterHostView.shared.lastTouchTime = new Date().getTime();
    callFlutterTouchEvent("ontouchend", arguments);
  },

  ontouchcancel2() {
    FlutterHostView.shared.touching = false;
    FlutterHostView.shared.lastTouchTime = new Date().getTime();
    callFlutterTouchEvent("ontouchcancel", arguments);
  },

  oninputinput() {
    const self = FlutterHostView.shared.self;
    self.setData({
      inputValue: arguments[0].detail.value,
    });
    FlutterHostView.shared.oninputinput.apply(null, arguments);
    simulateKeyDownEvent(arguments[0].detail.keyCode);
  },

  oninputblur() {
    let a = arguments;
    if (shouldDelayBlurEvent(arguments[0])) {
      setTimeout(() => {
        if (!FlutterHostView.shared.inputHasFocus) {
          FlutterHostView.shared.oninputblur.apply(null, a);
        }
      }, 100);
      return;
    }
    FlutterHostView.shared.oninputblur.apply(null, arguments);
  },

  oninputconfirm() {
    simulateKeyDownEvent(13);
  },

  onkeyboardheightchange() {
    let a = arguments;
    if (shouldDelayKeyboardHeightChange()) {
      setTimeout(() => {
        if (!FlutterHostView.shared.inputHasFocus) {
          FlutterHostView.shared.onkeyboardheightchange.apply(null, a);
        }
      }, 100);
      return;
    }
    FlutterHostView.shared.onkeyboardheightchange.apply(null, arguments);
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

  onShow() {
    wx.mpcb?.onShow?.();
  },

  onHide() {
    wx.mpcb?.onHide?.();
  },

  onShareAppMessage() {
    return {
      ...wx.mpcb.onShareAppMessage(),
      promise: wx.mpcb.onShareAppMessage(),
    };
  },
});

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

function setupFlutterHostView(self) {
  FlutterHostView.shared.self = self;
  FlutterHostView.shared.resetInputValues = () => {
    self.setData({
      inputType: "text",
      inputConfirmType: "",
      inputValue: "",
      inputSelectionStart: -1,
      inputSelectionEnd: -1,
      inputPassword: false,
    });
  };

  FlutterHostView.shared.requireSetInputValue = (value) => {
    const self = FlutterHostView.shared.self;
    if (self.data.inputValue === value) return;
    self.setData({ inputValue: value });
  };

  FlutterHostView.shared.requireInputFocus = (value, tag) => {
    const self = FlutterHostView.shared.self;
    FlutterHostView.shared.inputHasFocus = value;
    if (self.data.inputFocus === value) return;
    if (value) {
      if (tag === "textarea") {
        self.setData({
          inputHoldKeyboard: true,
          inputFocus: false,
          textareaFocus: true,
        });
      } else {
        self.setData({
          inputHoldKeyboard: true,
          inputFocus: true,
          textareaFocus: false,
        });
      }
    } else {
      self.setData({
        inputHoldKeyboard: true,
        inputFocus: false,
        textareaFocus: false,
      });
    }
  };

  FlutterHostView.shared.requireSetInputType = (value) => {
    const self = FlutterHostView.shared.self;
    if (self.data.inputType === value) return;
    self.setData({ inputType: value });
  };

  FlutterHostView.shared.requireSetInputPassword = (value) => {
    const self = FlutterHostView.shared.self;
    if (self.data.inputPassword === value) return;
    self.setData({ inputPassword: value });
  };

  FlutterHostView.shared.requireSetConfirmType = (value) => {
    const self = FlutterHostView.shared.self;
    if (self.data.inputConfirmType === value) return;
    self.setData({ inputConfirmType: value });
  };

  FlutterHostView.shared.requireSelectionRange = (start, end) => {
    const self = FlutterHostView.shared.self;
    const oldInputFocus = self.data.inputFocus;
    const oldTextareaFocus = self.data.textareaFocus;
    self.setData({
      inputSelectionStart: start,
      inputSelectionEnd: end,
      inputFocus: false,
    });

    const setupResumeTimer = () => {
      if (resumeTimer) return;
      resumeTimer = setTimeout(() => {
        resumeTimer = null;
        if (FlutterHostView.shared.touching) {
          setupResumeTimer();
          return;
        }
        self.setData({
          inputFocus: oldInputFocus,
          textareaFocus: oldTextareaFocus,
        });
      }, 64);
    };
    setupResumeTimer();
  };

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
  canvas.width = canvas.width * wx.getSystemInfoSync().pixelRatio;
  canvas.height = canvas.height * wx.getSystemInfoSync().pixelRatio;
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

function simulateKeyDownEvent(keyCode) {
  const keyboardEvent = new globalThis.KeyboardEvent();
  keyboardEvent.keyCode = keyCode;
  FlutterHostView.shared.oninputkeydown.apply(null, [keyboardEvent]);
}

function shouldDelayBlurEvent() {
  return (
    FlutterHostView.shared.inputHasFocus && arguments[0].detail.height <= 0
  );
}

function shouldDelayKeyboardHeightChange() {
  return (
    FlutterHostView.shared.inputHasFocus && arguments[0].detail.height <= 0
  );
}
