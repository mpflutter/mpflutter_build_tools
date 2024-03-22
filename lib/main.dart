// Copyright 2023 The MPFlutter Authors. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0 that can be
// found in the LICENSE file.

library mpflutter_build_tools;

import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:dio/dio.dart' as dio;
import 'package:es_compression/brotli.dart';
import 'package:path/path.dart';
import 'package:yaml_edit/yaml_edit.dart';
import './sourcemap.server.dart';
import 'utils.dart';

part 'wechat_builder.dart';
part 'wegame_builder.dart';

/// 当前 MPFlutter 支持的最高版本 Flutter SDK
final compactVersion = '3.16.7';

/// 声明已获取 MPFlutter 使用授权
bool licenseGrant = false;

/// 使用 MiniTex 字体渲染器
bool useMiniTex = false;

/// 使用无字体支持的 CanvasKit，可以缩小 wasm 体积
bool useNoFontCanvasKit = false;

/// 不受 MPFlutter 编译支持的 dart package
Map<String, List<String>> _nonCompatiblesPackages = {
  "fluwx": [],
  "file_picker": [],
  "image_picker_for_web": [],
  "flutter_inappwebview_web": [],
};

/// 声明某个 dart package 不受 MPFlutter 编译支持
void addNonCompatiblesPackage(String pkgName) {
  _nonCompatiblesPackages[pkgName] = [];
}

/// 禁用的功能
Map<String, bool> _disableFeatures = {};

/// 禁用某功能，具体使用说明阅读文档。
void disableFeature(String featureName) {
  _disableFeatures[featureName] = true;
}

/// 影子页
List<String> _shadowPages = [];

/// 添加一个影子页，一般用于微信订单中心页。
void addShadowPage(String pageName) {
  _shadowPages.add(pageName);
}

// === 以下是编译程序主逻辑 ===

late Directory _mpflutterSrcRoot;

Future main(List<String> arguments) async {
  checkFlutterVersion();
  init();

  print("====== 欢迎使用 MPFlutter Build Tools ======");
  print("特别提示你：");
  print("1. MPFlutter Build Tools 目前不是开源项目");
  print("2. 禁止反编译、修改 MPFlutter Build Tools 程序（在获得 MPFlutter 团队同意的情况下除外）");
  print("3. 禁止在未获取授权的情况下，移除 UNLICENSED 标识");
  print("4. MPFlutter Build Tools 会上传埋点信息，用于营销分析，如果你不同意该行为，应停止使用。");
  print("===========================================");

  if (licenseGrant) {
    print("提示：你已声明获得 MPFlutter 2.0 授权，角标将被移除。");
  }

  if (arguments.contains("--wechat")) {
    print("[INFO] 正在构建 wechat 小程序");
    final builder = WechatBuilder();
    try {
      await builder.buildFlutterWeb(arguments);
      await builder.buildFlutterWechat(arguments);
      print("[INFO] 构建成功，产物在 build/wechat 目录，使用微信开发者工具导入预览、上传、发布。");
      if (arguments.contains('--debug')) {
        runSourceMapServer();
      }
    } catch (e) {
      print("[ERROR] 构建失败，失败信息： $e");
    }
  } else if (arguments.contains("--wegame")) {
    print("[INFO] 正在构建 wegame 小程序");
    final builder = WegameBuilder();
    try {
      await builder.buildFlutterWeb(arguments);
      await builder.buildFlutterWegame(arguments);
      print("[INFO] 构建成功，产物在 build/wegame 目录，使用微信开发者工具导入预览、上传、发布。");
      if (arguments.contains('--debug')) {
        runSourceMapServer();
      }
    } catch (e) {
      print("[ERROR] 构建失败，失败信息： $e");
    }
  }
}

void checkFlutterVersion() async {
  final process =
      await Process.start('flutter', ['--version'], runInShell: true);
  final output = await process.stdout.transform(utf8.decoder).join();
  final versionPattern = RegExp(r'Flutter\s+(\d+\.\d+\.\d+)');
  final match = versionPattern.firstMatch(output);

  if (match != null) {
    final flutterVersion = match.group(1);

    if (flutterVersion != null &&
        compareVersions(flutterVersion, compactVersion) > 0) {
      throw "你当前的 Flutter SDK 版本是 $flutterVersion，请勿使用高于 $compactVersion 版本的 Flutter SDK，MPFlutter 尚未兼容你当前的版本。";
    }
  }
}

void init() {
  final pkgConfig = File(join('.dart_tool', 'package_config.json'));
  final pkgConfigData = json.decode(pkgConfig.readAsStringSync());
  (pkgConfigData["packages"] as List).forEach((it) {
    if (it['name'] == "mpflutter_build_tools") {
      _mpflutterSrcRoot =
          Directory.fromUri(Uri.parse(fixRootUri(it['rootUri'])));
    }
  });
}

final webOut = Directory(join('build', 'web'));
