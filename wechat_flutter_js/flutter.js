// Copyright 2014 The Flutter Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Copyright 2023 MPFlutter Author. All rights reserved.
// For MiniProgram polyfill code is governed by a Apache-2.0 license.

const { wxSystemInfo } = require("./system_info");

var _flutter = getApp()._flutter;

if (!_flutter) {
  _flutter = {};
  getApp()._flutter = _flutter;
}

_flutter.loader = null;
_flutter.imageCache = {};
_flutter.imageCacheNextIndex = 0;

export class FlutterHostView {
  static shared = new FlutterHostView();

  static transformTouchEvent = (event) => {
    if (event.touches) {
      for (let index = 0; index < event.touches.length; index++) {
        const touch = event.touches[index];
        touch.clientX = touch.pageX ?? touch.x;
        touch.clientY = touch.pageY ?? touch.y;
      }
      event.touches.item = function (index) {
        return event.touches[index];
      };
    }
    if (event.changedTouches) {
      for (let index = 0; index < event.changedTouches.length; index++) {
        const touch = event.changedTouches[index];
        touch.clientX = touch.pageX ?? touch.x;
        touch.clientY = touch.pageY ?? touch.y;
      }
      event.changedTouches.item = function (index) {
        return event.changedTouches[index];
      };
    }
    event.altKey = false;
    event.ctrlKey = false;
    event.metaKey = false;
    event.shiftKey = false;
    event.preventDefault = function () {};
    return event;
  };

  ontouchstart = undefined;
  ontouchmove = undefined;
  ontouchend = undefined;
  ontouchcancel = undefined;
  oninputinput = undefined;
  oninputblur = undefined;
  oninputkeydown = undefined;
  onkeyboardheightchange = undefined;
  onshow = undefined;
  onhide = undefined;
  onshareappmessage = undefined;
  onAndroidBackPressed = undefined;
}
globalThis.FlutterHostView = FlutterHostView;

(function () {
  "use strict";

  const baseUri = "";

  /**
   * Handles injecting the main Flutter web entrypoint (main.dart.js), and notifying
   * the user when Flutter is ready, through `didCreateEngineInitializer`.
   *
   * @see https://docs.flutter.dev/development/platform-integration/web/initialization
   */
  class FlutterEntrypointLoader {
    /**
     * Creates a FlutterEntrypointLoader.
     */
    constructor() {
      // Watchdog to prevent injecting the main entrypoint multiple times.
      this._scriptLoaded = false;
    }

    /**
     * Injects a TrustedTypesPolicy (or undefined if the feature is not supported).
     * @param {TrustedTypesPolicy | undefined} policy
     */
    setTrustedTypesPolicy(policy) {
      this._ttPolicy = policy;
    }

    /**
     * Loads flutter main entrypoint, specified by `entrypointUrl`, and calls a
     * user-specified `onEntrypointLoaded` callback with an EngineInitializer
     * object when it's done.
     *
     * @param {*} options
     * @returns {Promise | undefined} that will eventually resolve with an
     * EngineInitializer, or will be rejected with the error caused by the loader.
     * Returns undefined when an `onEntrypointLoaded` callback is supplied in `options`.
     */
    async loadEntrypoint(options) {
      const { entrypointUrl = `${baseUri}main.dart.js`, onEntrypointLoaded } =
        options || {};

      return this._loadEntrypoint(entrypointUrl, onEntrypointLoaded);
    }

    /**
     * Resolves the promise created by loadEntrypoint, and calls the `onEntrypointLoaded`
     * function supplied by the user (if needed).
     *
     * Called by Flutter through `_flutter.loader.didCreateEngineInitializer` method,
     * which is bound to the correct instance of the FlutterEntrypointLoader by
     * the FlutterLoader object.
     *
     * @param {Function} engineInitializer @see https://github.com/flutter/engine/blob/main/lib/web_ui/lib/src/engine/js_interop/js_loader.dart#L42
     */
    didCreateEngineInitializer(engineInitializer) {
      if (typeof this._didCreateEngineInitializerResolve === "function") {
        this._didCreateEngineInitializerResolve(engineInitializer);
        // Remove the resolver after the first time, so Flutter Web can hot restart.
        this._didCreateEngineInitializerResolve = null;
        // Make the engine revert to "auto" initialization on hot restart.
        delete _flutter.loader.didCreateEngineInitializer;
      }
      if (typeof this._onEntrypointLoaded === "function") {
        this._onEntrypointLoaded(engineInitializer);
      }
    }

    /**
     * Injects a script tag into the DOM, and configures this loader to be able to
     * handle the "entrypoint loaded" notifications received from Flutter web.
     *
     * @param {string} entrypointUrl the URL of the script that will initialize
     *                 Flutter.
     * @param {Function} onEntrypointLoaded a callback that will be called when
     *                   Flutter web notifies this object that the entrypoint is
     *                   loaded.
     * @returns {Promise | undefined} a Promise that resolves when the entrypoint
     *                                is loaded, or undefined if `onEntrypointLoaded`
     *                                is a function.
     */
    _loadEntrypoint(entrypointUrl, onEntrypointLoaded) {
      const useCallback = typeof onEntrypointLoaded === "function";

      if (!this._scriptLoaded) {
        this._scriptLoaded = true;
        if (useCallback) {
          this._onEntrypointLoaded = onEntrypointLoaded;
          try {
            require("./main.dart");
          } catch (e) {
            console.error(e);
          }
        } else {
          throw "use callback";
        }
      }
    }
  }

  /**
   * The public interface of _flutter.loader. Exposes two methods:
   * * loadEntrypoint (which coordinates the default Flutter web loading procedure)
   * * didCreateEngineInitializer (which is called by Flutter to notify that its
   *                              Engine is ready to be initialized)
   */
  class FlutterLoader {
    /**
     * Initializes the Flutter web app.
     * @param {*} options
     * @returns {Promise?} a (Deprecated) Promise that will eventually resolve
     *                     with an EngineInitializer, or will be rejected with
     *                     any error caused by the loader. Or Null, if the user
     *                     supplies an `onEntrypointLoaded` Function as an option.
     */
    async loadEntrypoint(options) {
      if (wxSystemInfo.safeArea) {
        _flutter.self.safeAreaInsetTop = Math.max(wxSystemInfo.safeArea.top, wxSystemInfo.statusBarHeight);
        _flutter.self.safeAreaInsetBottom =
          wxSystemInfo.windowHeight - wxSystemInfo.safeArea.bottom;
      }
      else {
        _flutter.self.safeAreaInsetTop = 0;
        _flutter.self.safeAreaInsetBottom = 0;
      }
      const { ...entrypoint } = options || {};
      // The FlutterEntrypointLoader instance could be injected as a dependency
      // (and dynamically imported from a module if not present).
      const entrypointLoader = new FlutterEntrypointLoader();
      // Install the `didCreateEngineInitializer` listener where Flutter web expects it to be.
      this.didCreateEngineInitializer =
        entrypointLoader.didCreateEngineInitializer.bind(entrypointLoader);
      return entrypointLoader.loadEntrypoint(entrypoint);
    }
  }

  const oriDefineProperty = Object.defineProperty.bind(Object);
  Object.defineProperty = function () {
    try {
      oriDefineProperty.apply(Object, arguments);
    } catch (error) {}
  };

  Array.prototype.item = function (index) {
    if (index < 0 || index >= this.length) {
      throw new Error("索引超出范围");
    }
    return this[index];
  };

  _flutter.loader = new FlutterLoader();
  _flutter.window =
    new (require("./flutter_bom/window").FlutterMiniProgramMockWindow)();
  _flutter.document =
    new (require("./flutter_bom/document").FlutterMiniProgramMockDocument)();
  _flutter.window.document = _flutter.document;
  _flutter.self = {
    FlutterHostView: FlutterHostView,
    wx: wx,
    Object: Object,
    Promise: Promise,
    Array: Array,
    Uint8Array: Uint8Array,
    platformViewManager:
      new (require("./platform_view").FlutterPlatformViewManager)(
        FlutterHostView
      ),
    crypto: require("./flutter_bom/crypto"),
    _flutter: _flutter,
    window: _flutter.window,
    location: _flutter.window.location,
    document: _flutter.document,
    setTimeout: setTimeout,
    setInterval: setInterval,
    localStorage: new (require("./flutter_bom/storage").LocalStorage)(),
    Blob: require("./flutter_bom/blob").Blob,
    FileReader: require("./flutter_bom/file-reader").FileReader,
    clearTimeout: clearTimeout,
    clearInterval: clearInterval,
    Float32Array: Float32Array,
    encodeURIComponent: encodeURIComponent,
    Intl: {},
    HTMLTextAreaElement: require("./flutter_bom/input")
      .FlutterMiniProgramMockInputElement,
    encodeImage: require("./flutter_bom/image_encoder").encodeImage,
    encodeImageToFilePath: require("./flutter_bom/image_encoder").encodeImageToFilePath,
    $__dart_deferred_initializers__: [],
    dartDeferredLibraryLoader: function (uri, res, rej) {
      const pkgs = require("./pkgs").default;
      if (
        typeof require === "function" &&
        typeof require.async === "function"
      ) {
        if (pkgs[uri]) {
          require("../../" +
            pkgs[uri] +
            "/pages" +
            uri.replace(".part.js", ".part"), function () {
            // console.log(uri, "done");
            res();
          }, function (err) {
            console.error(err);
          });
        } else {
          require("./" + uri, function () {
            // console.log(uri, "done");
            res();
          });
        }
      }
    },
    XMLHttpRequest: require("./flutter_bom/xml-http-request").XMLHttpRequest,
  };
  FlutterHostView.shared.onkeyboardheightchange = (e) => {
    if (e.detail.height != null && e.detail.height != undefined) {
      _flutter.self.keyboardHeightChanged(e.detail.height);
    }
  };
  FlutterHostView.shared.onAndroidBackPressed = () => {
    _flutter.self.androidBackPressed();
  };
  globalThis.HTMLTextAreaElement =
    require("./flutter_bom/input").FlutterMiniProgramMockInputElement;
  globalThis.MutationObserver = function () {
    return {
      observe: function () {},
    };
  };
  globalThis.KeyboardEvent = class KeyboardEvent {
    preventDefault() {}
  };
  globalThis.XMLHttpRequest =
    require("./flutter_bom/xml-http-request").XMLHttpRequest;
  globalThis.crypto = _flutter.self.crypto;
  globalThis.localStorage = _flutter.self.localStorage;
  globalThis.Blob = _flutter.self.Blob;
  globalThis.FileReader = _flutter.self.FileReader;
  globalThis.performance = _flutter.self.window.performance;

  let originObjectStringFunction = Object.prototype.toString;
  Object.prototype.toString = function () {
    try {
      if (this.$$clazz$$) {
        return `[object ${this.$$clazz$$}]`;
      }
    } catch (error) {}
    return originObjectStringFunction.apply(this, arguments);
  };
})();
