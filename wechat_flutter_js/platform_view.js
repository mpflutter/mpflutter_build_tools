export class FlutterPlatformViewManager {
  constructor(FlutterHostView) {
    this.FlutterHostView = FlutterHostView;
    this.devtools = wx.getSystemInfoSync().platform === "devtools";
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
    const self = this.FlutterHostView.shared.self;
    const blockName = viewOption.viewClazz + "_Block";
    const viewInstances = self.data[blockName] ?? [];
    let targetElement;
    let targetIndex;
    let nextIndex;
    for (let index = 0; index < 100; index++) {
      const element = viewInstances[index];
      if (element === undefined && nextIndex === undefined) {
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
      targetElement.style =
        `position: absolute;` +
        `left:${viewOption.frame.x}px;` +
        `top:${viewOption.frame.y}px;` +
        `width:${viewOption.frame.width}px;` +
        `height:${viewOption.frame.height}px;` +
        `opacity: ${viewOption.opacity};`;
      const windowHeight = wx.getSystemInfoSync().windowHeight;
      let wrapperTop = viewOption.wrapper.top / windowHeight;
      let wrapperBottom = viewOption.wrapper.bottom / windowHeight;
      targetElement.wrapper = `position: absolute;top:0px;left:0px;width:100%;height:100%;mask-image: linear-gradient(to bottom, transparent, transparent ${(
        wrapperTop * 100
      ).toFixed(0)}%, black ${(wrapperBottom * 100).toFixed(
        0
      )}%);-webkit-mask-image: linear-gradient(to bottom, transparent, transparent ${(
        wrapperTop * 100
      ).toFixed(0)}%, black ${(wrapperBottom * 100).toFixed(0)}%);`;
      if (viewOption.ignorePlatformTouch === true) {
        targetElement.wrapper += `pointer-events:none;`;
      }
      if (viewOption.opacity <= 0.01) {
        targetElement.wrapper += "visibility:hidden;pointer-events:none;";
      }
      targetElement.props = viewOption.props;
      const keyPath = blockName + `.[${targetIndex}]`;
      self.setData({ [keyPath]: targetElement });
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
      if (targetElement.style !== style) {
        self.setData({
          [styleKeyPath]: style,
        });
      }
      // wrapper
      const wrapperKeyPath = blockName + `.[${targetIndex}].wrapper`;
      const windowHeight = wx.getSystemInfoSync().windowHeight;
      let wrapperTop = viewOption.wrapper.top / windowHeight;
      let wrapperBottom = viewOption.wrapper.bottom / windowHeight;
      let wrapper = `position: absolute;top:0px;left:0px;width:100%;height:100%;mask-image: linear-gradient(to bottom, transparent, transparent ${(
        wrapperTop * 100
      ).toFixed(0)}%, black ${(wrapperBottom * 100).toFixed(
        0
      )}%);-webkit-mask-image: linear-gradient(to bottom, transparent, transparent ${(
        wrapperTop * 100
      ).toFixed(0)}%, black ${(wrapperBottom * 100).toFixed(0)}%);`;
      if (viewOption.ignorePlatformTouch === true) {
        wrapper += `pointer-events:none;`;
      }
      if (viewOption.opacity <= 0.01) {
        wrapper += "visibility:hidden;pointer-events:none;";
      }
      if (targetElement.wrapper !== wrapper) {
        self.setData({
          [wrapperKeyPath]: wrapper,
        });
      }
      // props
      if (targetElement.props) {
        for (const targetKey in targetElement.props) {
          if (
            JSON.stringify(targetElement.props[targetKey]) !==
            JSON.stringify(viewOption.props[targetKey])
          ) {
            const keyPath = blockName + `.[${targetIndex}].props.${targetKey}`;
            console.log(
              "set keypath",
              keyPath,
              targetElement.props[targetKey],
              viewOption.props[targetKey]
            );
            self.setData({
              [keyPath]: viewOption.props[targetKey],
            });
          }
        }
      }
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
      const keyPath = blockName + `.[${targetIndex}]`;
      self.setData({ [keyPath]: undefined });
    }
    delete this[viewOption.pvid + "_pvcb"];
  }
}
