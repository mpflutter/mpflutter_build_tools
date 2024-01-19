// Copyright 2023 The MPFlutter Authors. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0 that can be
// found in the LICENSE file.

const { Event } = require("./event");

export class FileReader {
  constructor() {
    this.$$clazz$$ = "FileReader";
  }

  readAsArrayBuffer(blob) {
    const ab = blob.arrayBuffer();
    this.result = ab;
    setTimeout(() => {
      if (this.onload) {
        const event = new Event();
        event.target = {
          result: ab,
        };
        this.onload(event);
      }
    }, 10);
  }

  readAsText(blob) {
    const text = blob.text();
    this.result = text;
    setTimeout(() => {
      if (this.onload) {
        const event = new Event();
        event.target = {
          result: text,
        };
        this.onload(event);
      }
    }, 10);
  }

  abort() {}

  addEventListener(event, callback) {
    if (event === "load") {
      this.onload = callback;
    }
  }

  removeEventListener(event, callback) {
    if (event === "load" && this.onload === callback) {
      this.onload = undefined;
    }
  }
}
