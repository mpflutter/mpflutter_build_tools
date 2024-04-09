export function isAsset(key) {
  return key.startsWith("/assets/") || key.startsWith("assets/");
}

export async function getAssetPath(key) {
  let normalizeKey = key;
  if (!key.startsWith("/")) {
    normalizeKey = "/" + key;
  }
  let subPackageUrl = require("../assets").default[normalizeKey] ?? normalizeKey;
  if (subPackageUrl === undefined) {
    if (normalizeKey.startsWith("/assets/assets/")) {
      normalizeKey = normalizeKey.replace(/\/assets\/assets\//, "/assets/");
    } else {
      normalizeKey = "/assets" + normalizeKey;
    }
    subPackageUrl = require("../assets").default[normalizeKey] ?? normalizeKey;
  }
  await new Promise((resolve) => {
    wx.loadSubpackage({
      name: subPackageUrl.split("/")[1],
      success: function () {
        setTimeout(() => {
          resolve();
        }, 10);
      },
      fail: function () {
        setTimeout(() => {
          resolve();
        }, 10);
      },
    });
  });
  return subPackageUrl + ".br";
}

export async function isAssetExist(key) {
  const filePath = await getAssetPath(key);
  const fs = wx.getFileSystemManager();
  const brExists = await new Promise((resolve) => {
    fs.getFileInfo({
      filePath: filePath,
      success: () => {
        resolve(true);
      },
      fail: () => {
        resolve(false);
      },
    });
  });
  return brExists;
}

export async function readAssetAsBuffer(key) {
  const filePath = await getAssetPath(key);
  const fs = wx.getFileSystemManager();
  return fs.readCompressedFileSync({
    filePath: filePath,
    compressionAlgorithm: "br",
  });
}

export async function readAssetAsText(key) {
  const filePath = await getAssetPath(key);
  const tmpFile = wx.env.USER_DATA_PATH + "/brtext_tmp";
  fs.writeFileSync(
    tmpFile,
    fs.readCompressedFileSync({
      filePath: filePath,
      compressionAlgorithm: "br",
    })
  );
  const localFileText = fs.readFileSync(tmpFile, "utf8");
  fs.removeSavedFile({
    filePath: tmpFile,
  });
  return localFileText;
}
