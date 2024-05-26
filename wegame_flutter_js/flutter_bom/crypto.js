// Copyright 2023 The MPFlutter Authors. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0 that can be
// found in the LICENSE file.

let randomValuesBuf = [];

export const genRandomValues = (forceUseMock, batchCount) => {
  if (!forceUseMock && wx && wx.getRandomValues) {
    if (batchCount !== undefined) {
      wx.getRandomValues({
        length: 32 * batchCount,
        success: (res) => {
          let randomValuesUint8Array = new Uint8Array(res.randomValues);
          for (let index = 0; index < 32 * batchCount; index += 32) {
            randomValuesBuf.push(
              new Uint8Array(randomValuesUint8Array.subarray(index, index + 32))
            );
          }
        },
      });
    } else {
      wx.getRandomValues({
        length: 32,
        success: (res) => {
          randomValuesBuf.push(new Uint8Array(res.randomValues));
        },
      });
    }
  } else {
    let arr = [];
    for (let index = 0; index < 32; index++) {
      arr.push(Math.floor(Math.random() * 255));
    }
    randomValuesBuf.push(new Uint8Array(arr));
  }
};

export const randomFillSync = (buffer) => {
  if (randomValuesBuf.length < 1) {
    genRandomValues(true);
  }
  const currentValue = randomValuesBuf.shift();
  if (currentValue) {
    for (let index = 0; index < currentValue.length; index++) {
      buffer[index] = currentValue[index];
    }
  }
  genRandomValues(false);
};

export const getRandomValues = (ab) => {
  randomFillSync(ab);
};

genRandomValues(false, 1024);
