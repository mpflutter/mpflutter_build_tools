// Copyright 2023 MPFlutter Authors. All rights reserved.
// Use of this source code is governed by a Apache-2.0 license that can be
// found in the LICENSE file.

const FlutterMiniProgramMockElement =
  require("./element").FlutterMiniProgramMockElement;

export class FlutterMiniProgramMockInputElement extends FlutterMiniProgramMockElement {
  constructor(viewClazz) {
    super();
    if (viewClazz === "Form") return;
    this.viewOption = {
      viewClazz: viewClazz ?? "MPFlutter_Wechat_Input",
      pvid: Math.random().toString(),
      frame: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
      opacity: 0.0,
      wrapper: {
        top: 0,
        bottom: 0,
      },
      props: {},
    };
    this.platformViewManager = getApp()._flutter.self.platformViewManager;
    this.platformViewManager.addCBListenner(
      this.viewOption.pvid,
      (event, detail) => {
        if (event === "input") {
          this.onInput?.(detail);
        } else if (event === "blur") {
          this.onBlur?.(detail);
          this.blur();
        } else if (event === "confirm") {
          const keyboardEvent = new globalThis.KeyboardEvent();
          keyboardEvent.keyCode = 13;
          this.onKeydown?.(keyboardEvent);
        }
      }
    );
  }

  disabled = false;

  _value = "";

  get value() {
    return this._value;
  }

  set value(v) {
    this._value = v;
    wx.updateKeyboard({ value: v });
  }

  get inputmode() {
    return this._type;
  }

  _type = "";

  set inputmode(v) {
    let newValue = v;
    if (newValue === "numberic") {
      newValue = "number";
    } else if (newValue === "decimal") {
      newValue = "digit";
    } else {
      newValue = "text";
    }
    this._type = newValue;
  }

  _password = false;

  set type(v) {
    if (v === "password") {
      this._password = true;
    } else {
      this._password = false;
    }
  }

  get enterkeyhint() {
    return "none";
  }

  _confirmType = "";

  set enterkeyhint(v) {
    this._confirmType = v;
  }

  selectionStart = 0;
  selectionEnd = 0;
  setSelectionRange(start, end) {
    this.selectionStart = start;
    this.selectionEnd = end;
  }
  focus = () => {
    this._completed = false;
    wx.showKeyboard({
      defaultValue: this._value,
      confirmType: this._confirmType,
      multiple: this.$$clazz$$ === "MPFlutter_Wechat_TextArea",
    });
    wx.offKeyboardInput(this.onKeyboardInput.bind(this));
    wx.offKeyboardConfirm(this.onKeyboardConfirm.bind(this));
    wx.offKeyboardComplete(this.onKeyboardComplete.bind(this));
    wx.onKeyboardInput(this.onKeyboardInput.bind(this));
    wx.onKeyboardConfirm(this.onKeyboardConfirm.bind(this));
    wx.onKeyboardComplete(this.onKeyboardComplete.bind(this));
  };
  select = () => {};
  blur = () => {
    wx.hideKeyboard({});
  };
  remove = () => {
    wx.hideKeyboard({});
  };
  onKeyboardInput = (detail) => {
    this.onInput?.(detail);
  };
  onKeyboardConfirm = (detail) => {
    if (this._completed) return;
    this._completed = true;
    const keyboardEvent = new globalThis.KeyboardEvent();
    keyboardEvent.keyCode = 13;
    this.onKeydown?.(keyboardEvent);
  };
  onKeyboardComplete = (detail) => {
    if (this._completed) return;
    this._completed = true;
    this.onBlur?.();
    wx.offKeyboardInput(this.onKeyboardInput.bind(this));
    wx.offKeyboardConfirm(this.onKeyboardConfirm.bind(this));
    wx.offKeyboardComplete(this.onKeyboardComplete.bind(this));
  };
  addEventListener = (event, callback) => {
    let self = this;
    if (event === "input") {
      this.onInput = (detail) => {
        self._value = detail.value;
        self.selectionStart = detail.value.length;
        self.selectionEnd = detail.value.length;
        callback.apply(callback, [detail]);
      };
    } else if (event === "blur") {
      this.onBlur = () => {
        if (this.preventDispose) return;
        callback.apply(callback, [{}]);
      };
    } else if (event === "keydown") {
      this.onKeydown = callback;
    }
  };
}

export class FlutterMiniProgramMockTextAreaElement extends FlutterMiniProgramMockInputElement {
  constructor() {
    super("MPFlutter_Wechat_TextArea");
    this.$$clazz$$ = "MPFlutter_Wechat_TextArea";
  }
}

export class FlutterMiniProgramMockFormElement extends FlutterMiniProgramMockElement {
  constructor() {
    super("Form");
  }

  focus() {}
  addEventListener = (event, callback) => {};
}
