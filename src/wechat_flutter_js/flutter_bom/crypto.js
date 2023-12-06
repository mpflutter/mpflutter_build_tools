let lastRandomValues = undefined;

export const genRandomValues = () => {
  if (wx && wx.getRandomValues) {
    wx.getRandomValues({
      length: 32,
      success: (res) => {
        lastRandomValues = new Uint8Array(res.randomValues);
      },
    });
  } else {
    console.warn("不存在 wx.getRandomValues 接口，正在使用伪随机数。");
    let arr = [];
    for (let index = 0; index < 32; index++) {
      arr.push(Math.floor(Math.random() * 255));
    }
    lastRandomValues = new Uint8Array(arr);
  }
};

export const randomFillSync = (buffer) => {
  genRandomValues();
  if (lastRandomValues) {
    for (let index = 0; index < lastRandomValues.length; index++) {
      buffer[index] = lastRandomValues[index];
    }
  }
};

export const getRandomValues = (ab) => {
  randomFillSync(ab);
};

genRandomValues();