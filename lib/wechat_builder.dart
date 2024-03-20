part of 'main.dart';

final webOut = Directory(join('build', 'web'));
final wechatSrc = Directory('wechat');
final wechatTmpDir = Directory(join('build', 'wechat_tmp'));
final wechatOutDir = Directory(join('build', 'wechat'));

class WechatBuilder {
  List<String> findNonCompatiblesPackagesNames() {
    final List<String> result = [];
    final pkgConfig = File(join('.dart_tool', 'package_config.json'));
    final pkgConfigData = json.decode(pkgConfig.readAsStringSync());
    (pkgConfigData["packages"] as List).forEach((it) {
      if (_nonCompatiblesPackages[it['name']] != null) {
        final srcRoot = Directory.fromUri(Uri.parse(fixRootUri(it['rootUri'])));
        if (File(join(srcRoot.path, "pubspec.bak.yaml")).existsSync()) {
          File(join(srcRoot.path, "pubspec.bak.yaml"))
              .copySync(join(srcRoot.path, "pubspec.yaml"));
        }
        final yamlFile = File(join(srcRoot.path, "pubspec.yaml"));
        yamlFile.copySync(join(srcRoot.path, "pubspec.bak.yaml"));
        if (yamlFile.existsSync()) {
          String yamlContent = yamlFile.readAsStringSync();
          final yamlEditor = YamlEditor(yamlContent);
          try {
            String webClass = yamlEditor.parseAt(
                ['flutter', 'plugin', 'platforms', 'web', 'pluginClass']).value;
            result.add(webClass);
          } catch (e) {}
        }
      }
    });
    return result;
  }

  void createEntryIfNeeded() {
    final mainFile = File(join('lib', 'main.mpflutter.dart'));
    if (!mainFile.existsSync()) {
      mainFile
          .writeAsStringSync("""import './main.dart' deferred as origin_main;

void main(List<String> args) async {
  await origin_main.loadLibrary();
  origin_main.main();
}
""");
    }
  }

  Future buildFlutterWeb(List<String> arguments) async {
    print("[INFO] 正在构建 flutter for web 产物");

    createEntryIfNeeded();

    // remove flutter build dir
    final flutterBuildDir = Directory(join('.dart_tool', 'flutter_build'));
    List<String> currentBuilds = flutterBuildDir.existsSync()
        ? flutterBuildDir.listSync().map((e) => e.path).toList()
        : <String>[];

    // create wechat dir
    if (webOut.existsSync()) {
      webOut.deleteSync(recursive: true);
    }

    final buildWeb = () async {
      final completer = Completer();
      // 转发请求至Flutter命令
      final flutterProcess = await Process.start(
          'flutter',
          [
            'build',
            'web',
            ...([...arguments]..removeWhere((element) =>
                element == "--devmode" ||
                element == "--wechat" ||
                element == "--debug" ||
                element == '--printstack')),
            ...[
              '--target=lib/main.mpflutter.dart',
              '--web-renderer',
              'canvaskit',
              '--dart-define=mpflutter.library.core=true',
              '--dart-define=mpflutter.buildtools.deferloadmain=true'
            ],
            ...arguments.contains('--debug')
                ? ['--source-maps', '--dart2js-optimization', 'O1']
                : [],
          ],
          runInShell: true);

      // 获取Flutter命令的输出
      flutterProcess.stdout.transform(utf8.decoder).listen((data) {
        print(data);
      });

      // 获取Flutter命令的错误输出
      flutterProcess.stderr.transform(utf8.decoder).listen((data) {
        print(data);
      });

      // 等待Flutter命令完成
      flutterProcess.exitCode.then((exitCode) {
        if (exitCode != 0) {
          completer.completeError("exit code = " + exitCode.toString());
        } else {
          completer.complete(exitCode);
        }
      });

      return completer.future;
    };

    await buildWeb();

    final newBuilds = flutterBuildDir.listSync().map((e) => e.path).toList();
    final targetBuild = newBuilds
        .where((element) => !currentBuilds.contains(element))
        .firstOrNull;
    if (targetBuild == null) {
      return;
    }

    final webPluginRegistrant =
        File(join(targetBuild, 'web_plugin_registrant.dart'));
    final content = webPluginRegistrant.readAsStringSync();
    if (content.contains("// MPFlutter Generated") ||
        !content.contains("registerWith(registrar)")) {
      return;
    }
    final nonCompatiblesPackagesNames = findNonCompatiblesPackagesNames();
    var newWebPluginRegistrantContent = "";
    webPluginRegistrant.readAsLinesSync().forEach((line) {
      for (var element in nonCompatiblesPackagesNames) {
        if (line.contains(element)) {
          return;
        }
      }
      if (line.contains('.registerWith(registrar)')) {
        newWebPluginRegistrantContent +=
            '''try {${line}} catch (e) { print("${line} 插件注册失败，可能是该插件未适配 MPFlutter 导致。"); }\n''';
      } else {
        newWebPluginRegistrantContent += line + "\n";
      }
    });
    webPluginRegistrant.writeAsStringSync(
        "// MPFlutter Generated\n" + newWebPluginRegistrantContent);
    await buildWeb();
  }

  Future buildFlutterWechat(List<String> arguments) async {
    print("[INFO] 正在构建 wechat 产物");
    // create wechat dir
    if (wechatOutDir.existsSync()) {
      wechatOutDir.deleteSync(recursive: true);
    }
    if (wechatTmpDir.existsSync()) {
      wechatTmpDir.deleteSync(recursive: true);
    }
    // copy src dir to build
    final wechatSrc = Directory('wechat');
    if (!wechatSrc.existsSync()) {
      throw '工程目录下不存在 wechat 文件夹，请先按照教程初始化 wechat 工程。';
    }
    wechatTmpDir.createSync();
    wechatOutDir.createSync();
    copyDirectory(wechatSrc, wechatTmpDir);
    _copyCanvaskitWasm(arguments);
    _copyFlutterSkeleton(arguments);
    _copyAssets(arguments);
    await _generateMiniTexIconFonts();
    _compressAssets(arguments);
    _copyDartJS(arguments);
    _copyPubPackagesToWechat(arguments);
    await _openDevMode(arguments);
    _addLogStack(arguments);
    _fixEnterkeyhint();
    _fixCanvasReuseContextIssue();
    _makeDisableFeatures();
    _makeShadowPages();
    _enableMiniTex();
    _mergeSubpackages();
    _removeLicenseTipsFlag();
    wechatOutDir.deleteSync();
    wechatTmpDir.renameSync(wechatOutDir.path);
  }

  void _copyCanvaskitWasm(List<String> arguments) {
    final canvaskitSrc = Directory(join(_mpflutterSrcRoot.path, 'canvaskit'));
    final canvaskitOut =
        Directory(join(wechatTmpDir.path, 'canvaskit', 'pages'));
    canvaskitOut.createSync(recursive: true);
    copyDirectory(canvaskitSrc, canvaskitOut);
    if (useMiniTex && useNoFontCanvasKit) {
      final noFontCanvaskitSrc =
          Directory(join(_mpflutterSrcRoot.path, 'canvaskit_no_font'));
      copyDirectory(noFontCanvaskitSrc, canvaskitOut);
    }
  }

  void _copyFlutterSkeleton(List<String> arguments) {
    final wechatFlutterJSSrc =
        Directory(join(_mpflutterSrcRoot.path, 'wechat_flutter_js'));
    final wechatFlutterJSOut =
        Directory(join(wechatTmpDir.path, 'pages', 'index'));
    copyDirectory(wechatFlutterJSSrc, wechatFlutterJSOut);
  }

  void _copyAssets(List<String> arguments) {
    final assetsSrc = Directory(join(webOut.path, 'assets'));
    File(join(assetsSrc.path, 'NOTICES')).deleteSync();

    List<List<String>> subPkgs = [];
    List<String> currentPkgFiles = [];
    var currentPkgSize = 0;
    final firstly = ["Manifest", "fonts"];
    final files =
        Directory(join(webOut.path, 'assets')).listSync(recursive: true);
    files.sort((a, b) {
      for (var i = 0; i < firstly.length; i++) {
        if (a.path.contains(firstly[i]) && !b.path.contains(firstly[i])) {
          return -1;
        } else if (b.path.contains(firstly[i]) &&
            !a.path.contains(firstly[i])) {
          return 1;
        } else if (b.path.contains(firstly[i]) && a.path.contains(firstly[i])) {
          return -1;
        }
      }
      return 1;
    });
    files.forEach((element) {
      if (element.statSync().type == FileSystemEntityType.directory) return;
      if (element.path.endsWith(".DS_Store")) return;
      if (element.path.contains('/packages/window_manager/')) return;
      if (currentPkgSize + element.statSync().size > 2.5 * 1000 * 1000) {
        // brotli 压缩，预估 2.5M -> 2.0M。
        subPkgs.add(currentPkgFiles);
        currentPkgFiles = [];
        currentPkgSize = 0;
      }
      currentPkgFiles.add(element.path);
      currentPkgSize += element.statSync().size;
    });
    if (currentPkgFiles.isNotEmpty) {
      subPkgs.add(currentPkgFiles);
    }

    subPkgs.asMap().forEach((key, value) {
      final keyId = key == 0 ? "" : key.toString();
      final pkgDirRoot = join(wechatTmpDir.path, 'assets' + keyId);
      Directory(pkgDirRoot).createSync();
      Directory(join(pkgDirRoot, 'pages')).createSync();
      File(join(pkgDirRoot, 'pages', 'index.js')).writeAsStringSync('Page({})');
      File(join(pkgDirRoot, 'pages', 'index.json')).writeAsStringSync('{}');
      File(join(pkgDirRoot, 'pages', 'index.wxml'))
          .writeAsStringSync('<view></view>');
      value.forEach((element) {
        final srcOut = element.replaceFirst(join(webOut.path, "assets"),
            join(wechatTmpDir.path, "assets${keyId}"));
        Directory(srcOut).parent.createSync(recursive: true);
        File(element).copySync(srcOut);
      });
    });

    var subPkgAsset = '';
    subPkgs.asMap().forEach((key, value) {
      final keyId = key == 0 ? "" : key.toString();
      value.forEach((element) {
        if (element.contains("\\")) {
          subPkgAsset +=
              '"${element.replaceAll("\\", "/").replaceFirst("build/web/", "/")}": "${element.replaceAll("\\", "/").replaceFirst("build/web/assets/", "/assets${keyId}/")}",\n';
        } else {
          subPkgAsset +=
              '"${element.replaceFirst("build/web/", "/")}": "${element.replaceFirst("build/web/assets/", "/assets${keyId}/")}",\n';
        }
      });
    });
    File(join(wechatTmpDir.path, 'pages', 'index', 'assets.js'))
        .writeAsStringSync('''
export default {
$subPkgAsset
}
''');

    final appJSONData = json
        .decode(File(join(wechatTmpDir.path, 'app.json')).readAsStringSync());
    final appJSONSubpackages = appJSONData["subpackages"] ??
        [
          {
            "name": "canvaskit",
            "root": "canvaskit",
            "pages": ["pages/index"]
          },
        ];
    subPkgs.asMap().forEach((key, value) {
      final keyId = key == 0 ? "" : key.toString();
      appJSONSubpackages.add({
        "name": "assets" + keyId.toString(),
        "root": "assets" + keyId.toString(),
        "pages": ["pages/index"]
      });
    });
    appJSONData["subpackages"] = appJSONSubpackages;
    File(join(wechatTmpDir.path, 'app.json'))
        .writeAsStringSync(json.encode(appJSONData));
  }

  void _copyDartJS(List<String> arguments) {
    List<List<String>> subPkgs = [];
    List<String> currentPkgFiles = [];
    var currentPkgSize = 0;
    Directory(join(webOut.path))
        .listSync()
        .where((element) => element.path.endsWith('.part.js'))
        .forEach((element) {
      if (currentPkgSize + element.statSync().size > 2 * 1000 * 1000) {
        subPkgs.add(currentPkgFiles);
        currentPkgFiles = [];
        currentPkgSize = 0;
      }
      currentPkgFiles.add(element.path.split(separator).last);
      currentPkgSize += element.statSync().size;
    });
    if (currentPkgFiles.isNotEmpty) {
      subPkgs.add(currentPkgFiles);
    }
    File(join(webOut.path, 'main.dart.js'))
        .copySync(join(wechatTmpDir.path, 'pages', 'index', 'main.dart.js'));
    if (File(join(webOut.path, 'main.dart.js.map')).existsSync()) {
      File(join(webOut.path, 'main.dart.js.map')).copySync(
          join(wechatTmpDir.path, 'pages', 'index', 'main.dart.js.map'));
      String fileContent =
          File(join(wechatTmpDir.path, 'pages', 'index', 'main.dart.js.map'))
              .readAsStringSync();
      fileContent = fixSourceMap(fileContent);
      File(join(wechatTmpDir.path, 'pages', 'index', 'main.dart.js.map'))
          .writeAsStringSync(fileContent);
    }
    subPkgs.asMap().forEach((key, value) {
      final pkgDirRoot = join(wechatTmpDir.path, 'pkg' + key.toString());
      Directory(pkgDirRoot).createSync();
      Directory(join(pkgDirRoot, 'pages')).createSync();
      File(join(pkgDirRoot, 'pages', 'index.js')).writeAsStringSync('Page({})');
      File(join(pkgDirRoot, 'pages', 'index.json')).writeAsStringSync('{}');
      File(join(pkgDirRoot, 'pages', 'index.wxml'))
          .writeAsStringSync('<view></view>');
      value.forEach((element) {
        File(join(webOut.path, element))
            .copySync(join(pkgDirRoot, 'pages', element));
        if (File(join(webOut.path, element + ".map")).existsSync()) {
          File(join(webOut.path, element + ".map"))
              .copySync(join(pkgDirRoot, 'pages', element + ".map"));
          String fileContent = File(join(pkgDirRoot, 'pages', element + ".map"))
              .readAsStringSync();
          fileContent = fileContent.replaceAll(
              '"sourceRoot": ""', '"sourceRoot": "http://localhost:10706/"');
          File(join(pkgDirRoot, 'pages', element + ".map"))
              .writeAsStringSync(fileContent);
        }
      });
    });
    var subPkgJS = '';
    subPkgs.asMap().forEach((key, value) {
      value.forEach((element) {
        subPkgJS += '"/$element": "pkg$key",\n';
      });
    });
    File(join(wechatTmpDir.path, 'pages', 'index', 'pkgs.js'))
        .writeAsStringSync('''
export default {
$subPkgJS
}
''');
    final appJSONData = json
        .decode(File(join(wechatTmpDir.path, 'app.json')).readAsStringSync());
    final appJSONSubpackages = appJSONData["subpackages"] ??
        [
          {
            "name": "canvaskit",
            "root": "canvaskit",
            "pages": ["pages/index"]
          },
          {
            "name": "assets",
            "root": "assets",
            "pages": ["pages/index"]
          }
        ];
    subPkgs.asMap().forEach((key, value) {
      appJSONSubpackages.add({
        "name": "pkg" + key.toString(),
        "root": "pkg" + key.toString(),
        "pages": ["pages/index"]
      });
    });
    appJSONData["subpackages"] = appJSONSubpackages;
    File(join(wechatTmpDir.path, 'app.json'))
        .writeAsStringSync(json.encode(appJSONData));
    // 添加环境变量到 js 头部
    _insertJSVars(join(wechatTmpDir.path, 'pages', 'index', 'main.dart.js'));
    subPkgs.asMap().forEach((key, value) {
      value.forEach((element) {
        _insertJSVars(
            join(wechatTmpDir.path, 'pkg' + key.toString(), 'pages', element));
      });
    });
    // Ignore ES6 -> ES5
    final ignoreList = ["pages/index/main.dart.js"];
    subPkgs.asMap().forEach((key, value) {
      value.forEach((element) {
        ignoreList.add("pkg" + key.toString() + "/pages/" + element);
      });
    });
    final projectConfigJSONData = json.decode(
        File(join(wechatTmpDir.path, 'project.config.json'))
            .readAsStringSync());
    final originIgnoreList =
        projectConfigJSONData["setting"]["babelSetting"]["ignore"] as List;
    originIgnoreList.addAll(ignoreList);
    File(join(wechatTmpDir.path, 'project.config.json')).writeAsStringSync(
      JsonEncoder.withIndent("  ").convert(projectConfigJSONData),
    );
  }

  void _copyPubPackagesToWechat(List<String> arguments) {
    Map<String, Directory> maybeWeChatPkgs = {};
    final pkgConfig = File(join('.dart_tool', 'package_config.json'));
    final pkgConfigData = json.decode(pkgConfig.readAsStringSync());
    (pkgConfigData["packages"] as List).forEach((it) {
      final name = it['name'];
      if (name is String && name.startsWith('mpflutter_')) {
        final rootUri = fixRootUri(it['rootUri']);
        if (rootUri.isEmpty) return;
        if (File(
          join(Directory.fromUri(Uri.parse(rootUri)).path, 'wechat', 'main.js'),
        ).existsSync()) {
          maybeWeChatPkgs[name] = Directory.fromUri(Uri.parse(rootUri));
        }
      }
    });
    if (maybeWeChatPkgs.length > 0) {
      print("发现 ${maybeWeChatPkgs.length} 个 MPFlutter 微信插件，它们将被添加到产物中。");
    }
    maybeWeChatPkgs.forEach((name, dir) {
      _copyPubPackageToWechat(name, dir);
    });
    // rewrite the app.json of subPackages
    final appJSONData = json
        .decode(File(join(wechatTmpDir.path, 'app.json')).readAsStringSync());
    final appJSONSubpackages = appJSONData['subpackages'] as List<dynamic>;
    maybeWeChatPkgs.forEach((name, dir) {
      appJSONSubpackages.add({
        "name": name,
        "root": name,
        "pages": ["pages/index"]
      });
    });
    appJSONData["subpackages"] = appJSONSubpackages;
    File(join(wechatTmpDir.path, 'app.json'))
        .writeAsStringSync(json.encode(appJSONData));
    // load main.js in index.js
    final indexJSFile =
        File(join(wechatTmpDir.path, 'pages', 'index', 'index.js'));
    var indexJS = indexJSFile.readAsStringSync();
    indexJS = indexJS.replaceAll("// loadPlugins", """
await Promise.all([
${maybeWeChatPkgs.map((key, value) => MapEntry(key, 'new Promise((resolve) => {require("../../$key/pages/main", resolve);}),')).values.join("\n")}
])
""");
    indexJSFile.writeAsStringSync(indexJS);
    // add main.wxml to index.wxml
    final indexWxmlFile =
        File(join(wechatTmpDir.path, 'pages', 'index', 'index.wxml'));
    var indexWxmlContent = indexWxmlFile.readAsStringSync();
    indexWxmlContent = indexWxmlContent.replaceAll(
      "<!--PlatformViewBlocks-->",
      maybeWeChatPkgs
          .map((key, value) => MapEntry(key,
              File(join(value.path, 'wechat', 'main.wxml')).readAsStringSync()))
          .values
          .join("\n"),
    );
    indexWxmlFile.writeAsStringSync(indexWxmlContent);
  }

  void _copyPubPackageToWechat(String pkgName, Directory pkgSrc) {
    final pkgOut = Directory(join(wechatTmpDir.path, pkgName, 'pages'));
    pkgOut.createSync(recursive: true);
    File(join(pkgOut.path, 'index.js')).writeAsStringSync('Page({})');
    File(join(pkgOut.path, 'index.json')).writeAsStringSync('{}');
    File(join(pkgOut.path, 'index.wxml')).writeAsStringSync('<view></view>');
    copyDirectory(
      Directory(join(pkgSrc.path, 'wechat')),
      Directory(pkgOut.path),
    );
  }

  Future<void> _openDevMode(List<String> arguments) async {
    if (arguments.contains('--devmode')) {
      // add ip to mpjs
      final myIP = await getIP();
      if (myIP == null) {
        print(
          "[WARN] 无法获取本地局域网 IP 地址，请自行在 build/wechat/pages/index/mpjs.js 中修改 127.0.0.1 为你的 IP。",
        );
        return;
      }
      print(
        "[INFO] 已获取到你的局域网 IP：$myIP",
      );
      print(
        "[INFO] 已替换 build/wechat/pages/index/mpjs.js 文件中的 IP 地址",
      );
      var content = File(join(wechatTmpDir.path, 'pages', 'index', 'mpjs.js'))
          .readAsStringSync();
      content = content.replaceAll("127.0.0.1", myIP);
      File(join(wechatTmpDir.path, 'pages', 'index', 'mpjs.js'))
          .writeAsStringSync(content);
      if (File(join('macos', 'Runner', 'DebugProfile.entitlements'))
          .existsSync()) {
        File(join('macos', 'Runner', 'DebugProfile.entitlements'))
            .writeAsStringSync('''
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>com.apple.security.app-sandbox</key>
	<true/>
	<key>com.apple.security.cs.allow-jit</key>
	<true/>
	<key>com.apple.security.files.downloads.read-write</key>
	<true/>
	<key>com.apple.security.network.client</key>
	<true/>
	<key>com.apple.security.network.server</key>
	<true/>
</dict>
</plist>
''');
      }
      return;
    }
    File(join(wechatTmpDir.path, 'pages', 'index', 'mpjs.js'))
        .writeAsStringSync("");
  }

  void _insertJSVars(String filePath) {
    String content = File(filePath).readAsStringSync();
    content = content.replaceAll('return !!J.getInterceptor\$(object)[tag];',
        'if (object.\$\$clazz\$\$) {return true;}return !!J.getInterceptor\$(object)[tag];');
    content = content.replaceAll(
        'new self.MutationObserver', 'new globalThis.MutationObserver');
    File(filePath).writeAsStringSync(
        '''var self = getApp()._flutter.self;var XMLHttpRequest = self.XMLHttpRequest;var \$__dart_deferred_initializers__ = self.\$__dart_deferred_initializers__;var document = self.document;var window = self.window;''' +
            content);
  }

  void _compressAssets(List<String> arguments) {
    for (var i = 0; i < 100; i++) {
      final keyId = i == 0 ? "" : i.toString();
      final dir = Directory(join(wechatTmpDir.path, 'assets${keyId}'));
      if (dir.existsSync()) {
        dir.listSync(recursive: true).forEach((element) {
          if (element.statSync().type == FileSystemEntityType.directory) return;
          if (element.path.endsWith('index.js') ||
              element.path.endsWith('index.json') ||
              element.path.endsWith('index.wxml')) return;
          try {
            final codec = BrotliCodec(level: BrotliOption.maxLevel);
            final encoded = codec.encode(
              File(element.path).readAsBytesSync().toList(),
            );
            File(element.path + ".br").writeAsBytesSync(encoded);
            element.deleteSync();
          } catch (e) {
            // print(
            //     "[INFO] 内置 brotli 压缩 ${element.path} 失败，回退至 native command 执行。");
            Process.runSync(
              'brotli',
              [element.path, '-o', element.path + ".br"],
              runInShell: true,
            );
            if (!File(element.path + ".br").existsSync()) {
              throw 'brotli 执行失败，请检查 brotli 是否正确安装。\n参考文档：https://mpflutter.feishu.cn/wiki/HsMzwcGKNioPlAkh9pPc8NfznIf';
            }
            element.deleteSync();
          }
        });
      }
    }
  }

  void _addLogStack(List<String> arguments) {
    if (!arguments.contains('--debug')) {
      return;
    }
    if (!arguments.contains('--printstack')) {
      return;
    }
    final mainDartJSFile =
        File(join(wechatTmpDir.path, 'pages', 'index', 'main.dart.js'));
    var content = mainDartJSFile.readAsStringSync();
    content = content.replaceAll("console.log(string);",
        'const error = new Error();console.log(string);console.info("=== 这是本次 Log 堆栈信息（不是错误） ===", error);');
    content = content.replaceAll(
        "return A.initializeExceptionWrapper(new Error(), ex);",
        "console.error(ex, new Error()); return ex;");
    mainDartJSFile.writeAsStringSync(content);
  }

  void _fixEnterkeyhint() {
    final mainDartJSFile =
        File(join(wechatTmpDir.path, 'pages', 'index', 'main.dart.js'));
    var content = mainDartJSFile.readAsStringSync();
    if (content.contains("if(s){s=this.gjH()")) {
      content =
          content.replaceAll("if(s){s=this.gjH()", "if(true){s=this.gjH()");
      mainDartJSFile.writeAsStringSync(content);
    }
  }

  // https://github.com/mpflutter/mpflutter/issues/552
  void _fixCanvasReuseContextIssue() {
    final mainDartJSFile =
        File(join(wechatTmpDir.path, 'pages', 'index', 'main.dart.js'));
    var content = mainDartJSFile.readAsStringSync();
    if (content.contains("factory.isLive\$1(_this)")) {
      content = content.replaceAll("factory.isLive\$1(_this)", "true");
      mainDartJSFile.writeAsStringSync(content);
    } else if (content.contains(RegExp(
        "if\\(.*\\(.*\\)\\)\\{(.*\\..*=!0\n.*\\.preventDefault\\(\\)\\}else .*\\..*\\(\\)\\},)",
        multiLine: true))) {
      content = content.replaceFirstMapped(
          RegExp(
              "if\\(.*\\(.*\\)\\)\\{(.*\\..*=!0\n.*\\.preventDefault\\(\\)\\}else .*\\..*\\(\\)\\},)",
              multiLine: true),
          (match) => "if(true){${match.group(1)}");
      mainDartJSFile.writeAsStringSync(content);
    }
  }

  void _makeDisableFeatures() {
    final indexJSFile =
        File(join(wechatTmpDir.path, 'pages', 'index', 'index.js'));
    var changed = false;
    var content = indexJSFile.readAsStringSync();
    if (_disableFeatures["wechat_share_app_message"] == true) {
      changed = true;
      content = content.replaceAll(
          "onShareAppMessage(detail)", "_onShareAppMessage(detail)");
    }
    if (_disableFeatures["wechat_share_timeline"] == true) {
      changed = true;
      content = content.replaceAll(
          "onShareTimeline(detail)", "_onShareTimeline(detail)");
    }
    if (_disableFeatures["wechat_add_to_favorites"] == true) {
      changed = true;
      content = content.replaceAll(
          "onAddToFavorites(detail)", "_onAddToFavorites(detail)");
    }
    if (changed) {
      indexJSFile.writeAsStringSync(content);
    }
  }

  void _makeShadowPages() {
    _shadowPages.forEach((shadowPage) {
      File(
        join(wechatTmpDir.path, 'pages', 'index', 'index.json'),
      ).copySync(
        join(wechatTmpDir.path, 'pages', 'index', '$shadowPage.json'),
      );
      File(join(wechatTmpDir.path, 'pages', 'index', '$shadowPage.wxml'))
          .writeAsStringSync(
        '<include src="index.wxml"/>',
      );
      File(join(wechatTmpDir.path, 'pages', 'index', '$shadowPage.js'))
          .writeAsStringSync(
        "Page(require('./index').main)",
      );
    });
    if (_shadowPages.length > 0) {
      final appJSONData = json
          .decode(File(join(wechatTmpDir.path, 'app.json')).readAsStringSync());
      final appJSONPages = appJSONData['pages'] as List<dynamic>;
      _shadowPages.forEach((element) {
        appJSONPages.add('pages/index/$element');
      });
      appJSONData["pages"] = appJSONPages;
      File(join(wechatTmpDir.path, 'app.json'))
          .writeAsStringSync(json.encode(appJSONData));
    }
  }

  void _enableMiniTex() {
    if (useMiniTex) {
      final fontManifestFile = File(
        join(webOut.path, 'assets', 'FontManifest.json'),
      );
      final fontManifestData =
          json.decode(fontManifestFile.readAsStringSync()) as List;
      final embeddingFonts =
          fontManifestData.map((it) => '"' + it['family'] + '"');
      File(
        join(wechatTmpDir.path, 'pages', 'index', 'minitex.js'),
      ).writeAsStringSync(
          """export const useMiniTex = true;\nexport const embeddingFonts = [${embeddingFonts.join(",")}]""");
    } else {
      Directory(join(wechatTmpDir.path, "canvaskit", "pages", "minitex"))
          .deleteSync(recursive: true);
    }
  }

  Future _generateMiniTexIconFonts() async {
    final requireMiniTex = useMiniTex;
    if (requireMiniTex) {
      final files =
          Directory(join(wechatTmpDir.path)).listSync(recursive: true);
      for (var file in files) {
        if (file.path.endsWith("MaterialIcons-Regular.otf")) {
          final materialIcons = File(file.path);
          final fontPathRes = (await dio.Dio().post<String>(
            "https://1253771526-dsp9b2x9az-gz.scf.tencentcs.com/fontpath?name=materialicons-regular",
            data: Stream.fromIterable(
                materialIcons.readAsBytesSync().map((e) => [e])),
            options: dio.Options(
              responseType: dio.ResponseType.plain,
              headers: {
                "Content-Type": "application/stream",
              },
            ),
          ));
          File(join(file.path + ".svg")).writeAsStringSync(fontPathRes.data!);
        } else if (file.path.endsWith("CupertinoIcons.ttf")) {
          final cupertinoIcons = File(file.path);
          final fontPathRes = (await dio.Dio().post<String>(
            "https://1253771526-dsp9b2x9az-gz.scf.tencentcs.com/fontpath?name=cupertinoicons",
            data: Stream.fromIterable(
                cupertinoIcons.readAsBytesSync().map((e) => [e])),
            options: dio.Options(
              responseType: dio.ResponseType.plain,
              headers: {
                "Content-Type": "application/stream",
              },
            ),
          ));
          File(join(file.path + ".svg")).writeAsStringSync(fontPathRes.data!);
        }
      }
    }
  }

  void _mergeSubpackages() {
    final appJSONData = json
        .decode(File(join(wechatTmpDir.path, 'app.json')).readAsStringSync());
    final newAppJSONSubpackages = [];
    final appJSONSubpackages = appJSONData["subpackages"];
    var mainPkgSize =
        calculateDirectorySizeSync(Directory(join(wechatTmpDir.path, "pages")));
    if (appJSONSubpackages is List) {
      appJSONSubpackages.sort((aPkg, bPkg) {
        final a = aPkg["name"] as String;
        final b = bPkg["name"] as String;
        if (a.startsWith('canvaskit') && !b.startsWith('canvaskit')) {
          return -1; // a排在b前面
        } else if (b.startsWith('canvaskit') && !a.startsWith('canvaskit')) {
          return 1; // b排在a前面
        } else if (a.startsWith('mpflutter_wechat_') &&
            !b.startsWith('mpflutter_wechat_')) {
          return -1; // a排在b前面
        } else if (b.startsWith('mpflutter_wechat_') &&
            !a.startsWith('mpflutter_wechat_')) {
          return 1; // b排在a前面
        } else {
          return 0; // 保持原有顺序
        }
      });
      appJSONSubpackages.forEach((curPkg) {
        final root = curPkg["root"] as String;
        final rootDir = Directory(join(wechatTmpDir.path, root));
        final rootDirSize = calculateDirectorySizeSync(rootDir);
        if (mainPkgSize + rootDirSize < 2 * 1000 * 1000) {
          mainPkgSize += rootDirSize;
        } else {
          newAppJSONSubpackages.add(curPkg);
        }
      });
      appJSONData["subpackages"] = newAppJSONSubpackages;
      File(join(wechatTmpDir.path, 'app.json'))
          .writeAsStringSync(json.encode(appJSONData));
    }
  }

  void _removeLicenseTipsFlag() {
    if (!licenseGrant) return;
    final file = File(join(wechatTmpDir.path, 'pages', 'index', 'index.wxml'));
    var content = file.readAsStringSync();
    content = content.replaceAll(
        '<image style="position: absolute;right:0;top:0;width:66px;height:66px;z-index: 10000" src="{{licenseUrl}}" />',
        '');
    file.writeAsStringSync(content);
  }
}
