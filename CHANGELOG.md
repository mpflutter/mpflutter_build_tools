# ChangeLog

## 2.7.5

fix:
- 修正透明画布未正确展示的问题

## 2.7.4

fix:
- 修正 pointerup 没有正确回调的问题

## 2.7.3

fix:
- 修正白屏问题
- 修正 PlatformView 在热启动后无效的问题

## 2.7.1

feat:
- 新增 Flutter SDK 3.22+ 支持
- 新增 PlatformView 置于下层支持

## 2.6.5

fix:
- 修复因微信官方 3.4.8 基础库 BUG 导致的安卓返回键点击后无响应问题。

## 2.6.4

fix:
- 修复因微信官方 3.4.8 基础库 BUG 导致的屏幕无法触摸问题。

## 2.6.3

fix:
- 修复 iOS 14.4 以下版本打开小程序黑屏的问题。

## 2.6.2

fix:
- 修正合并到主包后，开发者工具加载异常的问题。
- 修正小游戏 minitex 加载问题。
- 修正缩放倍率图片无法加载的问题。

## 2.6.1

fix:
- 某些分包不应被合并到主包中

## 2.6.0

feat:
- 新增 FVM 支持。

## 2.5.0

feat:
- 新增微信小游戏支持。
- 新增 MPFlutterNetworkImage 用于修正 Flutter Web 无 LoadingBuilder 的支持。

## 2.4.2

fix:
- 修复一个因字体加载导致严重性能问题的 BUG。

## 2.4.1

fix:
- 修正 MiniTex utf-16 图标绘制问题。
- 修正 Text height 未垂直居中问题。

## 2.4.0

feat: 
- 新增无字体渲染能力的 Skia CanvasKit 产物，并且在 MiniTex 启用的情况下，可以使用该产物。
- 新增 main.mpflutter.dart 分包策略，默认 main.dart.js 将不大于 700K。
- 智能分包策略调整，在主包大小保持 2M 的情况下，去除不必要的子分包。

## 2.3.4

fix:
- Keyboard 高度获取问题

## 2.3.3

fix:
- Keyboard 高度获取问题

## 2.3.2

fix:
- TextField 设置 keyboardType 不生效的问题
- 修复微信小程序在 Windows / macOS 微信上无法运行的问题（关联微信官方 BUG ）
- (MiniTex) 目标字体不存在内置字体时，直接使用 MiniTex 进行渲染。
- 修复 viewPadding 数值不正确导致安全区域异常的问题。
- 修复 HTTP 空返回值导出请求异常的问题。
- 修复 Editable inputFormatter 和 enable 属性无效的问题。
- 修复 flutter_widget_from_html_core 无法使用的问题。
- 新增 MPFlutterImageEncoder.encodeToFilePath 和 MPFlutterImageEncoder.encodeToBase64。

## 2.3.1

fix:
- Windows 构建异常
- 修改 Flutter Web Plugin 非兼容的处理方法，避免因不兼容插件导致的白屏出现。

## 2.3.0

fix:
- frameOnWindow x and y nan issue

feat:
- 添加 MiniTex 文本渲染器
- mpflutter_build_tools 强制 Flutter SDK 版本检测

## 2.2.0

fix:
- PlatformView 无法显示的问题。【已发布至  mpflutter_build_tools: 2.1.3 】
- 使用 GetConnect 请求时，Response 内容为空的问题。【已发布至  mpflutter_build_tools: 2.1.3 】

feat:
- 优化 Skia CanvasKit 产物大小

## 2.1.3

fix:
- 修正 PlatformView 无法显示的问题
- 修正 GetX 网络请求无法进行的问题

## 2.1.2

fix:
- MPFlutterWechatAppShareManager 未正确拼接分享参数
- 同一页面多个 PlatformView 无法同时响应触摸

## 2.1.1

fix:
- 修正一个因 XMLHttpRequest 导致的 js.context 失效问题

## 2.1.0

fix:
- mpflutter_wechat_api Array 类型统一修改为 List
- mpflutter_wechat_api IncludePointsOption set points 缺失

feature:
- 新增 Image 解码器
- 新增 Image 编码器
- 新增分享朋友圈、收藏支持
- 新增 DarkMode 支持

## 2.0.2

- fix: Windows 构建小程序，资源分包存在问题
- fix: 小程序启动过程可能有黑色闪屏
- fix: Hot Reload 无法使用
- feat: 内置 brotli 于 mpflutter_build_tools 中，优先使用这个内置的工具。

## 2.0.1

修正 windows 资源编译问题

## 2.0.0

MPFlutter 2.0.0 正式发布

## 2.0.0-alpha.7

feat: 添加 PlatformView 支持
feat: 添加 Flutter Plugin 支持
feat: 添加微信分享等能力支持
feat: 添加 Hot Reload 联机调试支持

## 2.0.0-alpha.5

fix: 默认字体加载未加载内置字体的问题
feat: 添加 --debug 构建参数

## 2.0.0-alpha.4

feat: mpjs 添加 ArrayBuffer 便捷方法

## 2.0.0-alpha.3

适配 Flutter 3.16

## 2.0.0-alpha.2

首次发布