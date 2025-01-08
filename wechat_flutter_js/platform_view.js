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
    this.cacheBlockNames = [];
    this.cacheBlockViews = [];
    this.cachePVWrapper = {};
    this.devtools = wxSystemInfo.platform === "devtools";
    setTimeout(() => {
      this.devtools = wxSystemInfo.platform === "devtools";
    }, 300);
  }

  saveViews() {
    const self = this.FlutterHostView.shared.self;
    for (let index = 0; index < this.cacheBlockNames.length; index++) {
      const blockName = this.cacheBlockNames[index];
      this.cacheBlockViews[blockName] = self.data[blockName];
    }
    this.cachePVWrapper = self.data.PVWrapper;
  }

  restoreViews() {
    const self = this.FlutterHostView.shared.self;
    for (let index = 0; index < this.cacheBlockNames.length; index++) {
      const blockName = this.cacheBlockNames[index];
      self.setData({
        [blockName]: this.cacheBlockViews[blockName],
      })
    }
    self.setData({
      PVWrapper: this.cachePVWrapper,
    })
  }

  onPVCB(option) {
    if (this[option.pvid + "_pvcb"]) {
      return this[option.pvid + "_pvcb"](option.event, option.detail ?? {});
    }
  }

  setWindowLevel(windowLevel) {
    const self = this.FlutterHostView.shared.self;
    self.setData({ windowLevel: windowLevel });
  }

  setDisplayOverlayModalLayer(displayOverlayModalLayer) {
    const self = this.FlutterHostView.shared.self;
    self.setData({ displayOverlayModalLayer: displayOverlayModalLayer });
  }

  addCBListenner(pvid, callback) {
    this[pvid + "_pvcb"] = callback;
  }

  updateView(viewOption) {
    if (viewOption && this[viewOption.pvid + "_deleted"]) return;
    const self = this.FlutterHostView.shared.self;
    const blockName = viewOption.viewClazz + "_Block";
    if (this.cacheBlockNames.indexOf(blockName) < 0) {
      this.cacheBlockNames.push(blockName)
    }
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
      targetElement = {
        pvid: viewOption.pvid,
      };
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
      targetElement.props = {
        ...viewOption.props,
      };
      const keyPath = blockName + `.[${targetIndex}]`;
      this.setData(
        {
          [keyPath]: targetElement,
        },
        true
      );
      // wrapper
      this.updateWrapper(viewOption, true);
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
        this.setData({
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
            this.setData({
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
      this.setData({
        [keyPath]: true,
      });
    }
    this[viewOption.pvid + "_deleted"] = true;
    delete this[viewOption.pvid + "_pvcb"];
    this.updateWrapper({});
  }

  updateWrapper(viewOption, ignoreBatching) {
    const self = this.FlutterHostView.shared.self;
    const hasPV =
      Object.keys(this).filter((it) => it.endsWith("_pvcb")).length > 0;
    if (hasPV) {
      if (viewOption.wrapper) {
        const windowHeight = wxSystemInfo.windowHeight;
        let wrapperTop = viewOption.wrapper.top / windowHeight;
        let wrapperBottom = viewOption.wrapper.bottom / windowHeight;
        let wrapper = `z-index:-1;position: absolute;top:0px;left:0px;width:100%;height:100%;mask-image: linear-gradient(to bottom, transparent, transparent ${(
          wrapperTop * 100
        ).toFixed(0)}%, black ${(wrapperBottom * 100).toFixed(
          0
        )}%);-webkit-mask-image: linear-gradient(to bottom, transparent, transparent ${(
          wrapperTop * 100
        ).toFixed(0)}%, black ${(wrapperBottom * 100).toFixed(0)}%);`;
        if (
          self.data.PVWrapper.removed === false &&
          self.data.PVWrapper.style === wrapper &&
          self.data.PVWrapper.top === viewOption.wrapper.top &&
          self.data.PVWrapper.bottom === viewOption.wrapper.bottom
        )
          return;
        this.setData(
          {
            "PVWrapper.removed": false,
            "PVWrapper.style": wrapper,
            "PVWrapper.top": viewOption.wrapper.top,
            "PVWrapper.bottom": viewOption.wrapper.bottom,
          },
          ignoreBatching
        );
      }
    } else {
      if (self.data.PVWrapper.removed === true) return;
      this.setData(
        {
          "PVWrapper.removed": true,
        },
        ignoreBatching
      );
    }
  }

  batchSetDataBegin() {
    this.batching = true;
    this.batchData = {};
  }

  batchSetDataCommit() {
    if (Object.keys(this.batchData).length > 0) {
      const self = this.FlutterHostView.shared.self;
      self.setData(this.batchData);
    }
    this.batching = false;
    this.batchData = {};
  }

  setData(data, ignoreBatching) {
    if (this.batching === true && !ignoreBatching) {
      Object.assign(this.batchData, data);
    } else {
      const self = this.FlutterHostView.shared.self;
      self.setData(data);
    }
  }

  // MARK: PlatformOveraly
  updateOverlay(viewOption) {
    const self = this.FlutterHostView.shared.self;
    const overlayList = self.data.MPFlutter_Wechat_PlatformOverlay ?? [];
    let found = false;
    overlayList.forEach((it) => {
      if (it.pvid === viewOption.pvid) {
        found = true;
        Object.assign(it, viewOption);
      }
    });
    if (!found) {
      overlayList.push(viewOption);
    }
    self.setData({
      MPFlutter_Wechat_PlatformOverlay: overlayList,
    });
    this.refreshOverlay(viewOption);
  }

  disposeOverlay(viewOption) {
    const self = this.FlutterHostView.shared.self;
    let overlayList = self.data.MPFlutter_Wechat_PlatformOverlay ?? [];
    overlayList = overlayList.filter((it) => {
      return !(it.pvid === viewOption.pvid);
    });
    self.setData({
      MPFlutter_Wechat_PlatformOverlay: overlayList,
    });
  }

  refreshOverlay(viewOption) {}
}
