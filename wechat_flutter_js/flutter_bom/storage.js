// Copyright 2023 The MPFlutter Authors. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0 that can be
// found in the LICENSE file.

class Storage {
  constructor() {
    this.$$clazz$$ = "Storage";
    this.$_keys = wx.getStorageInfoSync().keys;
  }
  get length() {
    return this.$_keys && this.$_keys.length || 0
  }
  key(num) {
    if (typeof num !== "number" || !isFinite(num) || num < 0) return null;
    return this.$_keys[num] || null
  }
  set $$keys(keys) {
    this.$_keys = keys
  }
  getItem(key) {
    if (!key || typeof key !== "string") return null;
    return wx.getStorageSync(key) || null
  }
  setItem(key, data) {
    if (!key || typeof key !== "string") return;
    data = "" + data;
    wx.setStorageSync(key, data)
  }
  removeItem(key) {
    if (!key || typeof key !== "string") return;
    wx.removeStorageSync(key)
  }
  clear() {
    wx.clearStorageSync()
  }
}
module.exports = {
  LocalStorage: Storage
};