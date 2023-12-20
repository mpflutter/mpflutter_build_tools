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
    let found = false;
    let targetElement;
    for (let index = 0; index < viewInstances.length; index++) {
      const element = viewInstances[index];
      if (element.pvid === viewOption.pvid) {
        targetElement = element;
        found = true;
        break;
      }
    }
    if (!found) {
      targetElement = { pvid: viewOption.pvid };
      viewInstances.push(targetElement);
    }
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
    self.setData({ [blockName]: viewInstances });
  }

  disposeView(viewOption) {
    const self = this.FlutterHostView.shared.self;
    const blockName = viewOption.viewClazz + "_Block";
    let viewInstances = self.data[blockName] ?? [];
    viewInstances = viewInstances.filter((item) => {
      return item.pvid !== viewOption.pvid;
    });
    self.setData({ [blockName]: viewInstances });
    delete this[viewOption.pvid + "_pvcb"];
  }
}
