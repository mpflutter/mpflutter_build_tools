// Copyright 2023 The MPFlutter Authors. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0 that can be
// found in the LICENSE file.

const { wxSystemInfo } = require("./system_info");

function deepCompare(value1, value2) {
  if (typeof value1 !== typeof value2) {
    return false;
  }

  if (
    typeof value1 === "number" ||
    typeof value1 === "string" ||
    typeof value1 === "boolean" ||
    value1 === null ||
    value1 === undefined
  ) {
    return value1 === value2;
  }

  if (Array.isArray(value1)) {
    if (value1.length !== value2.length) {
      return false;
    }

    for (let i = 0; i < value1.length; i++) {
      if (!deepCompare(value1[i], value2[i])) {
        return false;
      }
    }

    return true;
  }

  if (typeof value1 === "object") {
    const keys1 = Object.keys(value1);
    const keys2 = Object.keys(value2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (!deepCompare(value1[key], value2[key])) {
        return false;
      }
    }

    return true;
  }

  return false;
}

export class FlutterPlatformViewManager {
  constructor(FlutterHostView) {
    this.FlutterHostView = FlutterHostView;
    this.devtools = wxSystemInfo.platform === "devtools";
    setTimeout(() => {
      this.devtools = wxSystemInfo.platform === "devtools";
    }, 300);
  }

  onPVCB(option) {
    if (this[option.pvid + "_pvcb"]) {
      this[option.pvid + "_pvcb"](option.event, option.detail ?? {});
    }
  }

  addCBListenner(pvid, callback) {
    this[pvid + "_pvcb"] = callback;
  }

  updateView(viewOption) {
    if (viewOption && this[viewOption.pvid + "_deleted"]) return;
    const self = this.FlutterHostView.shared.self;
    const blockName = viewOption.viewClazz + "_Block";
    const viewInstances = self.data[blockName] ?? [];
    let targetElement;
    let targetIndex;
    let nextIndex;
    for (let index = 0; index < 100; index++) {
      const element = viewInstances[index];
      if (
        (element === undefined && nextIndex === undefined) ||
        element?.removed === true
      ) {
        nextIndex = index;
      }
      if (element && element.pvid === viewOption.pvid) {
        targetElement = element;
        targetIndex = index;
        break;
      }
    }
    if (!targetElement) {
      targetElement = { pvid: viewOption.pvid };
      targetIndex = nextIndex;
      targetElement.removed = false;
      let style =
        `position: absolute;` +
        `left:${viewOption.frame.x}px;` +
        `top:${viewOption.frame.y}px;` +
        `width:${viewOption.frame.width}px;` +
        `height:${viewOption.frame.height}px;` +
        `opacity: ${viewOption.opacity};` +
        `z-index: 9999;`;
      if (viewOption.ignorePlatformTouch === true) {
        style += `pointer-events:none;`;
      }
      if (viewOption.opacity <= 0.01) {
        style += "top: -1000px;pointer-events:none;";
      }
      targetElement.style = style;
      targetElement.props = { ...viewOption.props };
      const keyPath = blockName + `.[${targetIndex}]`;
      self.setData({ [keyPath]: targetElement });
      // wrapper
      this.updateWrapper(viewOption);
    } else {
      // style
      const styleKeyPath = blockName + `.[${targetIndex}].style`;
      let style =
        `position: absolute;` +
        `left:${viewOption.frame.x}px;` +
        `top:${viewOption.frame.y}px;` +
        `width:${viewOption.frame.width}px;` +
        `height:${viewOption.frame.height}px;` +
        `opacity: ${viewOption.opacity};`;
      if (viewOption.ignorePlatformTouch === true) {
        style += `pointer-events:none;`;
      }
      if (viewOption.opacity <= 0.01) {
        style += "top: -1000px;pointer-events:none;";
      }
      if (targetElement.style !== style) {
        self.setData({
          [styleKeyPath]: style,
        });
      }
      // props
      if (targetElement.props) {
        for (const targetKey in {
          ...targetElement.props,
          ...viewOption.props,
        }) {
          if (
            !deepCompare(
              targetElement.props[targetKey],
              viewOption.props[targetKey]
            )
          ) {
            const keyPath = blockName + `.[${targetIndex}].props.${targetKey}`;
            self.setData({
              [keyPath]: viewOption.props[targetKey],
            });
          }
        }
      }
      // wrapper
      this.updateWrapper(viewOption);
    }
  }

  disposeView(viewOption) {
    const self = this.FlutterHostView.shared.self;
    const blockName = viewOption.viewClazz + "_Block";
    const viewInstances = self.data[blockName] ?? [];
    let targetIndex;
    for (let index = 0; index < 100; index++) {
      const element = viewInstances[index];
      if (element && element.pvid === viewOption.pvid) {
        targetIndex = index;
        break;
      }
    }
    if (targetIndex !== undefined) {
      const keyPath = blockName + `.[${targetIndex}].removed`;
      self.setData({ [keyPath]: true });
    }
    this[viewOption.pvid + "_deleted"] = true;
    delete this[viewOption.pvid + "_pvcb"];
    this.updateWrapper({});
  }

  updateWrapper(viewOption) {
    const self = this.FlutterHostView.shared.self;
    const hasPV =
      Object.keys(this).filter((it) => it.endsWith("_pvcb")).length > 0;
    if (hasPV) {
      if (viewOption.wrapper) {
        const windowHeight = wxSystemInfo.windowHeight;
        let wrapperTop = viewOption.wrapper.top / windowHeight;
        let wrapperBottom = viewOption.wrapper.bottom / windowHeight;
        let wrapper = `position: absolute;top:0px;left:0px;width:100%;height:100%;mask-image: linear-gradient(to bottom, transparent, transparent ${(
          wrapperTop * 100
        ).toFixed(0)}%, black ${(wrapperBottom * 100).toFixed(
          0
        )}%);-webkit-mask-image: linear-gradient(to bottom, transparent, transparent ${(
          wrapperTop * 100
        ).toFixed(0)}%, black ${(wrapperBottom * 100).toFixed(0)}%);`;
        if (
          self.data.PVWrapper.removed === false &&
          self.data.PVWrapper.style === wrapper
        )
          return;
        self.setData({
          "PVWrapper.removed": false,
          "PVWrapper.style": wrapper,
        });
      }
    } else {
      if (self.data.PVWrapper.removed === true) return;
      self.setData({ "PVWrapper.removed": true });
    }
  }
}
