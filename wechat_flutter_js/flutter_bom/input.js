// Copyright 2023 MPFlutter Authors. All rights reserved.
// Use of this source code is governed by a Apache-2.0 license that can be
// found in the LICENSE file.

const FlutterMiniProgramMockElement =
  require("./element").FlutterMiniProgramMockElement;

export class FlutterMiniProgramMockInputElement extends FlutterMiniProgramMockElement {
  constructor(viewClazz) {
    super();
    if (viewClazz === "Form") return;
    this.firstFocus = false;
    this.preventUpdateView = true;
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
          return this.onInput?.(detail);
        } else if (event === "focus") {
          wx._mpflutter_focusNode = this.viewOption.pvid;
          wx._mpflutter_hasFocus = true;
        } else if (event === "blur") {
          if (!this.preventDispose && wx._mpflutter_focusNode === this.viewOption.pvid) {
            wx._mpflutter_focusNode = null;
            wx._mpflutter_hasFocus = false;
          }
          this.onBlur?.(detail);
          this.blur();
        } else if (event === "confirm") {
          if (this.viewClazz === "MPFlutter_Wechat_TextArea") {
            this.blur();
            return;
          }
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
    this.viewOption.props.value = v;
    this.updateView();
  }

  get inputmode() {
    return this.viewOption.props.type;
  }

  set inputmode(v) {
    let newValue = v;
    if (newValue === "numberic") {
      newValue = "number";
    } else if (newValue === "decimal") {
      newValue = "digit";
    } else {
      newValue = "text";
    }
    this.viewOption.props.type = newValue;
  }

  set type(v) {
    if (v === "password") {
      this.viewOption.props.password = true;
    } else {
      this.viewOption.props.password = false;
    }
  }

  get enterkeyhint() {
    return "none";
  }

  set enterkeyhint(v) {
    this.viewOption.props.confirmType = v;
  }

  selectionStart = 0;
  selectionEnd = 0;
  setSelectionRange(start, end) {
    if (!this.viewOption.props.focus) {
      this.selectionStart = start;
      this.selectionEnd = end;
      this.viewOption.props.selectionStart = start;
      this.viewOption.props.selectionEnd = end;
      this.updateView();
      return;
    }
    this.preventDispose = true;
    this.selectionStart = start;
    this.selectionEnd = end;
    this.viewOption.props.selectionStart = start;
    this.viewOption.props.selectionEnd = end;
    this.viewOption.props.focus = false;
    this.updateView();
    setTimeout(() => {
      this.preventDispose = false;
      this.viewOption.props.focus = true;
      this.updateView();
    }, 500);
  }
  focus = () => {
    FlutterMiniProgramMockInputElement.activeInput = this.viewOption.pvid;
    wx._mpflutter_focusNode = this.viewOption.pvid;
    wx._mpflutter_hasFocus = true;
    this.viewOption.props.focus = true;
    this.updateView();
    if (!this.firstFocus) {
      this.firstFocus = true;
      setTimeout(() => {
        this.preventUpdateView = false;
        this.updateView();
      }, 300);
    }
  };
  select = () => {};
  blur = () => {
    if (this.preventDispose) return;
    this.viewOption.props.focus = false;
    this.updateView();
  };
  remove = () => {
    if (this.preventDispose) return;
    this.viewOption.props.focus = false;
    this.updateView();
    setTimeout(() => {
      this.platformViewManager.disposeView(this.viewOption);
    }, 32);
  };
  addEventListener = (event, callback) => {
    let self = this;
    if (event === "input") {
      this.onInput = (detail) => {
        try {
          this.preventUpdateView = true;
          self._value = detail.value;
          self.selectionStart = detail.cursor;
          self.selectionEnd = detail.cursor;
          callback.apply(callback, [detail]);
          return self._value;
        } catch (error) {
        } finally {
          this.preventUpdateView = false;
        }
      };
    } else if (event === "blur") {
      this.onBlur = () => {
        if (this.preventDispose) return;
        if (
          FlutterMiniProgramMockInputElement.activeInput !==
          this.viewOption.pvid
        )
          return;
        setTimeout(() => {
          callback.apply(callback, [{}]);
        }, 100);
      };
    } else if (event === "keydown") {
      this.onKeydown = callback;
    }
  };
  updateView = () => {
    if (this.preventUpdateView) return;
    this.platformViewManager.updateView(this.viewOption);
  };
}

export class FlutterMiniProgramMockTextAreaElement extends FlutterMiniProgramMockInputElement {
  constructor() {
    super("MPFlutter_Wechat_TextArea");
  }
}

export class FlutterMiniProgramMockFormElement extends FlutterMiniProgramMockElement {
  constructor() {
    super("Form");
  }

  focus() {}
  addEventListener = (event, callback) => {};
}
