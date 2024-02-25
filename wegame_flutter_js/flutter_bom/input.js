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
    this.viewOption.props.value = v;
    this.platformViewManager.updateView(this.viewOption);
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
    this.preventDispose = true;
    this.selectionStart = start;
    this.selectionEnd = end;
    this.viewOption.props.selectionStart = start;
    this.viewOption.props.selectionEnd = end;
    this.viewOption.props.focus = false;
    this.platformViewManager.updateView(this.viewOption);
    setTimeout(() => {
      this.preventDispose = false;
      this.viewOption.props.focus = true;
      this.platformViewManager.updateView(this.viewOption);
    }, 64);
  }
  focus = () => {
    this.viewOption.props.focus = true;
    this.platformViewManager.updateView(this.viewOption);
  };
  select = () => {};
  blur = () => {
    if (this.preventDispose) return;
    this.viewOption.props.focus = false;
    this.platformViewManager.updateView(this.viewOption);
  };
  remove = () => {
    if (this.preventDispose) return;
    this.viewOption.props.focus = false;
    this.platformViewManager.updateView(this.viewOption);
    setTimeout(() => {
      this.platformViewManager.disposeView(this.viewOption);
    }, 32);
  };
  addEventListener = (event, callback) => {
    let self = this;
    if (event === "input") {
      this.onInput = (detail) => {
        self._value = detail.value;
        self.selectionStart = detail.cursor;
        self.selectionEnd = detail.cursor;
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
  }
}

export class FlutterMiniProgramMockFormElement extends FlutterMiniProgramMockElement {
  constructor() {
    super("Form");
  }

  focus() {}
  addEventListener = (event, callback) => {};
}
