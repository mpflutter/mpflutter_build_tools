class MPJSClientImpl {
  constructor() {
    this.objectRefSeq = 0;
    this.objectMap = {
      "ref:globalThis": globalThis,
    };
    this.funcCallPromiseMap = {};
  }

  start() {
    this.connectSocket();
  }

  connectSocket() {
    if (this.socket) {
      this.socket.close();
    }
    this.socket = wx.connectSocket({
      url: "ws://127.0.0.1:9898/",
    });
    let socketError = () => {
      wx.showToast({ title: "正在尝试连接到调试器...", icon: "none" });
      console.info("正在尝试连接到调试器...");
      setTimeout(() => {
        this.connectSocket();
      }, 1000);
    };
    this.socket.onError(socketError);
    this.socket.onClose(socketError);
    this.socket.onOpen(() => {
      wx.showToast({ title: "已连接到调试器", icon: "success" });
      wx.setKeepScreenOn({ keepScreenOn: true });
      console.info("已连接到调试器");
    });
    this.socket.onMessage(this.onSocketMessage.bind(this));
  }

  onSocketMessage(res) {
    const data = res.data;
    if (typeof data === "string") {
      const dataObj = JSON.parse(data);
      if (dataObj.id && dataObj.method) {
        this.onMethodInvoke(dataObj.id, dataObj.method, dataObj.params);
      }
    }
  }

  async onMethodInvoke(id, method, params) {
    let result;
    let error;
    try {
      if (method === "mpjs.newObject") {
        result = this.onNewObject(params);
      } else if (method === "mpjs.valueOfObject") {
        result = this.onValueOfObject(params);
      } else if (method === "mpjs.setValueOfObject") {
        result = this.onSetValueOfObject(params);
      } else if (method === "mpjs.callMethod") {
        result = this.onCallMethod(params);
      } else if (method === "mpjs.applyFunction") {
        result = this.onApplyFunction(params);
      } else if (method === "mpjs.returnCallDartFunctionResult") {
        this.onReturnCallDartFunctionResult(params);
      } else if (method === "mpjs.plainValueOfObject") {
        result = this.onPlainValueOfObject(params);
      }
    } catch (_error) {
      error = `${_error}`;
      console.error(_error);
    }

    this.socket.send({
      data: JSON.stringify({
        id: id,
        result: result,
        error: error,
      }),
    });
  }

  callDartFunction(funcRef, args) {
    const funcCallId = "func_call_" + Math.random().toString();
    return new Promise((resolve, reject) => {
      this.funcCallPromiseMap[funcCallId] = { resolve, reject };
      this.socket.send({
        data: JSON.stringify({
          method: "mpjs.callDartFunction",
          params: {
            funcCallId: funcCallId,
            funcRef: funcRef,
            args: args,
          },
        }),
      });
    });
  }

  onNewObject(params) {
    const clazz = params.clazz;
    const args = params.arguments;
    let realClazz = globalThis[clazz];
    if (!realClazz) {
      if (typeof wx === "object") {
        realClazz = wx[clazz];
      }
    }
    const result = new realClazz(
      ...(args ? args.map((it) => this.tranformRefToObject(it)) : [])
    );
    return this.tranformObjectToRef(result);
  }

  onValueOfObject(params) {
    const key = params.key;
    const objectRef = params.objectRef;
    const realObject = this.tranformRefToObject(objectRef);
    if (realObject) {
      return this.tranformObjectToRef(realObject[key]);
    }
    return undefined;
  }

  onPlainValueOfObject(params) {
    const objectRef = params.objectRef;
    const realObject = this.tranformRefToObject(objectRef);
    if (realObject) {
      return realObject;
    }
    return undefined;
  }

  onSetValueOfObject(params) {
    const key = params.key;
    const value = params.value;
    const objectRef = params.objectRef;
    const realObject = this.tranformRefToObject(objectRef);
    if (realObject) {
      realObject[key] = this.tranformRefToObject(value);
    }
    return undefined;
  }

  onCallMethod(params) {
    const method = params.method;
    const args = params.arguments;
    const objectRef = params.objectRef;
    const realObject = this.tranformRefToObject(objectRef);
    if (realObject && realObject[method]) {
      const result = realObject[method].apply(
        realObject,
        args ? args.map((it) => this.tranformRefToObject(it)) : []
      );
      return this.tranformObjectToRef(result);
    }
    return undefined;
  }

  onApplyFunction(params) {
    const thisRef = params.thisRef;
    const args = params.arguments;
    const objectRef = params.objectRef;
    const realObject = this.tranformRefToObject(objectRef);
    if (realObject) {
      const result = realObject.apply(
        this.tranformRefToObject(thisRef),
        args ? args.map((it) => this.tranformRefToObject(it)) : []
      );
      return this.tranformObjectToRef(result);
    }
    return undefined;
  }

  onReturnCallDartFunctionResult(params) {
    const funcCallId = params["funcCallId"];
    const result = params["result"];
    const promise = this.funcCallPromiseMap[funcCallId];
    if (promise) {
      promise.resolve(result);
      delete this.funcCallPromiseMap[funcCallId];
    }
  }

  tranformRefToObject(objectRef) {
    if (objectRef?.["clazz"] === "function") {
      if (!this.objectMap[objectRef.ref]) {
        const funcRef = objectRef.ref;
        const self = this;
        this.objectMap[funcRef] = function () {
          let callArgs = [];
          for (let index = 0; index < arguments.length; index++) {
            callArgs.push(self.tranformObjectToRef(arguments[index]));
          }
          return impl.callDartFunction(funcRef, callArgs);
        };
      }
      return this.objectMap[objectRef.ref];
    }
    if (this.objectMap[objectRef]) {
      return this.objectMap[objectRef];
    } else if (typeof objectRef === "object") {
      let result = {};
      for (const key in objectRef) {
        result[key] = this.tranformRefToObject(objectRef[key]);
      }
      return result;
    } else {
      return objectRef;
    }
  }

  tranformObjectToRef(value) {
    if (value?.$ref$) {
      return value.$ref$;
    } else if (typeof value === "object" || typeof value === "function") {
      const objectRef =
        "ref:" + Math.random().toString() + "_" + this.objectRefSeq;
      this.objectRefSeq++;
      this.objectMap[objectRef] = value;
      const returnValue = {
        clazz:
          typeof value === "function"
            ? "function"
            : value instanceof Array
            ? "array"
            : "object",
        ref: objectRef,
      };
      value.$ref$ = returnValue;
      return returnValue;
    } else {
      return value;
    }
  }
}

const impl = new MPJSClientImpl();
impl.start();

Array.prototype.$mpjs_value = function () {
  return this;
};
