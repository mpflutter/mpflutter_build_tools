part of 'main.dart';

final douyinSrc = Directory('douyin');
final douyinTmpDir = Directory(join('build', 'douyin_tmp'));
final douyinOutDir = Directory(join('build', 'douyin'));

class DouyinBuilder {
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

    // create douyin dir
    if (webOut.existsSync()) {
      webOut.deleteSync(recursive: true);
    }

    final buildWeb = () async {
      final completer = Completer();
      // 转发请求至Flutter命令
      final flutterProcess = await Process.start(
          useFvm() ? 'fvm' : 'flutter',
          [
            useFvm() ? 'flutter' : '',
            'build',
            'web',
            ...([...arguments]..removeWhere((element) =>
                element == "--devmode" ||
                element == "--douyin" ||
                element == "--debug" ||
                element == '--printstack')),
            ...[
              '--target=lib/main.mpflutter.dart',
              '--web-renderer',
              'canvaskit',
              '--dart-define=mpflutter.library.core=true',
              '--dart-define=mpflutter.library.target.douyin=true',
            ],
            ...arguments.contains('--debug')
                ? ['--source-maps', '--dart2js-optimization', 'O1']
                : [],
          ]..removeWhere((element) => element.isEmpty),
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

  Future buildFlutterDouyin(List<String> arguments) async {
    print("[INFO] 正在构建 douyin 产物");
    // create douyin dir
    if (douyinOutDir.existsSync()) {
      douyinOutDir.deleteSync(recursive: true);
    }
    if (douyinTmpDir.existsSync()) {
      douyinTmpDir.deleteSync(recursive: true);
    }
    // copy src dir to build
    final douyinSrc = Directory('douyin');
    if (!douyinSrc.existsSync()) {
      throw '工程目录下不存在 douyin 文件夹，请先按照教程初始化 douyin 工程。';
    }
    douyinTmpDir.createSync();
    douyinOutDir.createSync();
    copyDirectory(douyinSrc, douyinTmpDir);
    _copyCanvaskitWasm(arguments);
    _copyFlutterSkeleton(arguments);
    _copyAssets(arguments);
    await _generateMiniTexIconFonts();
    _compressAssets(arguments);
    _copyDartJS(arguments);
    _copyPubPackagesToDouyin(arguments);
    await _openDevMode(arguments);
    _addLogStack(arguments);
    _fixEnterkeyhint();
    _fixCanvasReuseContextIssue();
    _makeDisableFeatures();
    _makeShadowPages();
    _enableMiniTex();
    _mergeSubpackages();
    _removeRepeatPages();
    _removeLicenseTipsFlag();
    douyinOutDir.deleteSync();
    douyinTmpDir.renameSync(douyinOutDir.path);
  }

  void _copyCanvaskitWasm(List<String> arguments) {
    final canvaskitSrc = Directory(join(_mpflutterSrcRoot.path, 'canvaskit'));
    final canvaskitOut =
        Directory(join(douyinTmpDir.path, 'canvaskit', 'pages'));
    canvaskitOut.createSync(recursive: true);
    copyDirectory(canvaskitSrc, canvaskitOut);
    if (useMiniTex && useNoFontCanvasKit) {
      final noFontCanvaskitSrc =
          Directory(join(_mpflutterSrcRoot.path, 'canvaskit_no_font'));
      copyDirectory(noFontCanvaskitSrc, canvaskitOut);
    }
    final canvaskitJSFile =
        File(join(douyinTmpDir.path, 'canvaskit', 'pages', 'canvaskit.js'));
    canvaskitJSFile.writeAsStringSync(canvaskitJSFile
        .readAsStringSync()
        .replaceFirst("GLVersion = 2", "GLVersion = 1"));
  }

  void _copyFlutterSkeleton(List<String> arguments) {
    final douyinFlutterJSSrc =
        Directory(join(_mpflutterSrcRoot.path, 'douyin_flutter_js'));
    final douyinFlutterJSOut =
        Directory(join(douyinTmpDir.path, 'pages', 'index'));
    copyDirectory(douyinFlutterJSSrc, douyinFlutterJSOut);
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
      if (currentPkgSize + element.statSync().size > 2.0 * 1000 * 1000) {
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
      final pkgDirRoot = join(douyinTmpDir.path, 'assets' + keyId);
      Directory(pkgDirRoot).createSync();
      Directory(join(pkgDirRoot, 'pages')).createSync();
      File(join(pkgDirRoot, 'pages', 'index.js')).writeAsStringSync('Page({})');
      File(join(pkgDirRoot, 'pages', 'index.json')).writeAsStringSync('{}');
      File(join(pkgDirRoot, 'pages', 'index.ttml'))
          .writeAsStringSync('<view></view>');
      value.forEach((element) {
        var srcOut = element.replaceFirst(join(webOut.path, "assets"),
            join(douyinTmpDir.path, "assets${keyId}"));
        srcOut = srcOut.replaceAllMapped(RegExp(r'(\d)\.(\d)x'), (Match match) {
          return match.group(1)! + "_" + match.group(2)! + "x";
        });
        Directory(srcOut).parent.createSync(recursive: true);
        File(element).copySync(srcOut);
      });
    });

    var subPkgAsset = '';
    subPkgs.asMap().forEach((key, value) {
      final keyId = key == 0 ? "" : key.toString();
      value.forEach((element) {
        var srcOut = element;
        srcOut = srcOut.replaceAllMapped(RegExp(r'(\d)\.(\d)x'), (Match match) {
          return match.group(1)! + "_" + match.group(2)! + "x";
        });
        if (element.contains("\\")) {
          srcOut = srcOut
              .replaceAll("\\", "/")
              .replaceFirst("build/web/assets/", "/assets${keyId}/");
          subPkgAsset +=
              '"${element.replaceAll("\\", "/").replaceFirst("build/web/", "/")}": "${srcOut}",\n';
        } else {
          srcOut = srcOut.replaceFirst("build/web/assets/", "/assets${keyId}/");
          subPkgAsset +=
              '"${element.replaceFirst("build/web/", "/")}": "${srcOut}",\n';
        }
      });
    });
    File(join(douyinTmpDir.path, 'pages', 'index', 'assets.js'))
        .writeAsStringSync('''
export default {
$subPkgAsset
}
''');

    final appJSONData = json
        .decode(File(join(douyinTmpDir.path, 'app.json')).readAsStringSync());
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
    File(join(douyinTmpDir.path, 'app.json'))
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
        .copySync(join(douyinTmpDir.path, 'pages', 'index', 'main.dart.js'));
    if (File(join(webOut.path, 'main.dart.js.map')).existsSync()) {
      File(join(webOut.path, 'main.dart.js.map')).copySync(
          join(douyinTmpDir.path, 'pages', 'index', 'main.dart.js.map'));
      String fileContent =
          File(join(douyinTmpDir.path, 'pages', 'index', 'main.dart.js.map'))
              .readAsStringSync();
      fileContent = fixSourceMap(fileContent);
      File(join(douyinTmpDir.path, 'pages', 'index', 'main.dart.js.map'))
          .writeAsStringSync(fileContent);
    }
    subPkgs.asMap().forEach((key, value) {
      final pkgDirRoot = join(douyinTmpDir.path, 'pkg' + key.toString());
      Directory(pkgDirRoot).createSync();
      Directory(join(pkgDirRoot, 'pages')).createSync();
      File(join(pkgDirRoot, 'pages', 'index.js')).writeAsStringSync('Page({})');
      File(join(pkgDirRoot, 'pages', 'index.json')).writeAsStringSync('{}');
      File(join(pkgDirRoot, 'pages', 'index.ttml'))
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
    File(join(douyinTmpDir.path, 'pages', 'index', 'pkgs.js'))
        .writeAsStringSync('''
export default {
$subPkgJS
}
''');
    final appJSONData = json
        .decode(File(join(douyinTmpDir.path, 'app.json')).readAsStringSync());
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
    File(join(douyinTmpDir.path, 'app.json'))
        .writeAsStringSync(json.encode(appJSONData));
    // 添加环境变量到 js 头部
    _insertJSVars(join(douyinTmpDir.path, 'pages', 'index', 'main.dart.js'));
    subPkgs.asMap().forEach((key, value) {
      value.forEach((element) {
        _insertJSVars(
            join(douyinTmpDir.path, 'pkg' + key.toString(), 'pages', element));
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
        File(join(douyinTmpDir.path, 'project.config.json'))
            .readAsStringSync());
    final originIgnoreList =
        projectConfigJSONData["setting"]["babelSetting"]["ignore"] as List;
    originIgnoreList.addAll(ignoreList);
    File(join(douyinTmpDir.path, 'project.config.json')).writeAsStringSync(
      JsonEncoder.withIndent("  ").convert(projectConfigJSONData),
    );
  }

  void _copyPubPackagesToDouyin(List<String> arguments) {
    Map<String, Directory> maybeDouyinPkgs = {};
    final pkgConfig = File(join('.dart_tool', 'package_config.json'));
    final pkgConfigData = json.decode(pkgConfig.readAsStringSync());
    (pkgConfigData["packages"] as List).forEach((it) {
      final name = it['name'];
      final rootUri = fixRootUri(it['rootUri']);
      if (rootUri.isEmpty) return;
      if (File(
        join(Directory.fromUri(Uri.parse(rootUri)).path, 'douyin', 'main.js'),
      ).existsSync()) {
        maybeDouyinPkgs[name] = Directory.fromUri(Uri.parse(rootUri));
      }
    });
    if (maybeDouyinPkgs.length > 0) {
      print("发现 ${maybeDouyinPkgs.length} 个 MPFlutter 微信插件，它们将被添加到产物中。");
    }
    maybeDouyinPkgs.forEach((name, dir) {
      _copyPubPackageToDouyin(name, dir);
    });
    // rewrite the app.json of subPackages
    final appJSONData = json
        .decode(File(join(douyinTmpDir.path, 'app.json')).readAsStringSync());
    final appJSONSubpackages = appJSONData['subpackages'] as List<dynamic>;
    maybeDouyinPkgs.forEach((name, dir) {
      appJSONSubpackages.add({
        "name": name,
        "root": name,
        "pages": ["pages/index"]
      });
    });
    appJSONData["subpackages"] = appJSONSubpackages;
    File(join(douyinTmpDir.path, 'app.json'))
        .writeAsStringSync(json.encode(appJSONData));
    // load main.js in index.js
    final indexJSFile =
        File(join(douyinTmpDir.path, 'pages', 'index', 'index.js'));
    var indexJS = indexJSFile.readAsStringSync();
    indexJS = indexJS.replaceAll("// loadPlugins", """
await Promise.all([
${maybeDouyinPkgs.map((key, value) => MapEntry(key, 'new Promise((resolve) => {require("../../$key/pages/main", resolve);}),')).values.join("\n")}
])
""");
    indexJSFile.writeAsStringSync(indexJS);
    // add main.ttml to index.ttml
    final indexWxmlFile =
        File(join(douyinTmpDir.path, 'pages', 'index', 'index.ttml'));
    var indexWxmlContent = indexWxmlFile.readAsStringSync();
    indexWxmlContent = indexWxmlContent.replaceAll(
      "<!--PlatformViewBlocks-->",
      maybeDouyinPkgs
          .map((key, value) => MapEntry(key,
              File(join(value.path, 'douyin', 'main.ttml')).readAsStringSync()))
          .values
          .join("\n"),
    );
    indexWxmlFile.writeAsStringSync(indexWxmlContent);
  }

  void _copyPubPackageToDouyin(String pkgName, Directory pkgSrc) {
    final pkgOut = Directory(join(douyinTmpDir.path, pkgName, 'pages'));
    pkgOut.createSync(recursive: true);
    File(join(pkgOut.path, 'index.js')).writeAsStringSync('Page({})');
    File(join(pkgOut.path, 'index.json')).writeAsStringSync('{}');
    File(join(pkgOut.path, 'index.ttml')).writeAsStringSync('<view></view>');
    copyDirectory(
      Directory(join(pkgSrc.path, 'douyin')),
      Directory(pkgOut.path),
    );
  }

  Future<void> _openDevMode(List<String> arguments) async {
    if (arguments.contains('--devmode')) {
      // add ip to mpjs
      final myIP = await getIP();
      if (myIP == null) {
        print(
          "[WARN] 无法获取本地局域网 IP 地址，请自行在 build/douyin/pages/index/mpjs.js 中修改 127.0.0.1 为你的 IP。",
        );
        return;
      }
      print(
        "[INFO] 已获取到你的局域网 IP：$myIP",
      );
      print(
        "[INFO] 已替换 build/douyin/pages/index/mpjs.js 文件中的 IP 地址",
      );
      var content = File(join(douyinTmpDir.path, 'pages', 'index', 'mpjs.js'))
          .readAsStringSync();
      content = content.replaceAll("127.0.0.1", myIP);
      File(join(douyinTmpDir.path, 'pages', 'index', 'mpjs.js'))
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
    File(join(douyinTmpDir.path, 'pages', 'index', 'mpjs.js'))
        .writeAsStringSync("");
  }

  void _insertJSVars(String filePath) {
    String content = File(filePath).readAsStringSync();
    content = content.replaceAll('return !!J.getInterceptor\$(object)[tag];',
        'if (object.\$\$clazz\$\$) {return true;}return !!J.getInterceptor\$(object)[tag];');
    content = content.replaceAll(
        'new self.MutationObserver', 'new globalThis.MutationObserver');
    File(filePath).writeAsStringSync(
        '''var globalThis = global;var self = getApp()._flutter.self;var XMLHttpRequest = self.XMLHttpRequest;var \$__dart_deferred_initializers__ = self.\$__dart_deferred_initializers__;var document = self.document;var window = self.window;var crypto = self.crypto;''' +
            content);
  }

  void _compressAssets(List<String> arguments) {
    for (var i = 0; i < 100; i++) {
      final keyId = i == 0 ? "" : i.toString();
      final dir = Directory(join(douyinTmpDir.path, 'assets${keyId}'));
      if (dir.existsSync()) {
        dir.listSync(recursive: true).forEach((element) {
          if (element.statSync().type == FileSystemEntityType.directory) return;
          if (element.path.endsWith('index.js') ||
              element.path.endsWith('index.json') ||
              element.path.endsWith('index.ttml')) return;
          try {
            final codec = ZLibCodec();
            final encoded = codec.encode(
              File(element.path).readAsBytesSync().toList(),
            );
            File(element.path + ".zlib.png").writeAsBytesSync(encoded);
            element.deleteSync();
          } catch (e) {
            File(element.path).renameSync(element.path + ".ab.png");
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
        File(join(douyinTmpDir.path, 'pages', 'index', 'main.dart.js'));
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
        File(join(douyinTmpDir.path, 'pages', 'index', 'main.dart.js'));
    var content = mainDartJSFile.readAsStringSync();
    if (content.contains(
      RegExp("if\\([a-z]\\)(\\{[a-z]=this..*\\(\\)\n.\\.toString)",
          multiLine: true),
    )) {
      content = content.replaceAllMapped(
          RegExp("if\\([a-z]\\)(\\{[a-z]=this..*\\(\\)\n.\\.toString)",
              multiLine: true),
          (match) => "if(true)${match.group(1)}");
      mainDartJSFile.writeAsStringSync(content);
    }
  }

  // https://github.com/mpflutter/mpflutter/issues/552
  void _fixCanvasReuseContextIssue() {
    final mainDartJSFile =
        File(join(douyinTmpDir.path, 'pages', 'index', 'main.dart.js'));
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
        File(join(douyinTmpDir.path, 'pages', 'index', 'index.js'));
    var changed = false;
    var content = indexJSFile.readAsStringSync();
    if (_disableFeatures["douyin_share_app_message"] == true) {
      changed = true;
      content = content.replaceAll(
          "onShareAppMessage(detail)", "_onShareAppMessage(detail)");
    }
    if (_disableFeatures["douyin_share_timeline"] == true) {
      changed = true;
      content = content.replaceAll(
          "onShareTimeline(detail)", "_onShareTimeline(detail)");
    }
    if (_disableFeatures["douyin_add_to_favorites"] == true) {
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
        join(douyinTmpDir.path, 'pages', 'index', 'index.json'),
      ).copySync(
        join(douyinTmpDir.path, 'pages', 'index', '$shadowPage.json'),
      );
      File(join(douyinTmpDir.path, 'pages', 'index', '$shadowPage.ttml'))
          .writeAsStringSync(
        '<include src="index.ttml"/>',
      );
      File(join(douyinTmpDir.path, 'pages', 'index', '$shadowPage.js'))
          .writeAsStringSync(
        "Page(require('./index').main)",
      );
    });
    if (_shadowPages.length > 0) {
      final appJSONData = json
          .decode(File(join(douyinTmpDir.path, 'app.json')).readAsStringSync());
      final appJSONPages = appJSONData['pages'] as List<dynamic>;
      _shadowPages.forEach((element) {
        appJSONPages.add('pages/index/$element');
      });
      appJSONData["pages"] = appJSONPages;
      File(join(douyinTmpDir.path, 'app.json'))
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
        join(douyinTmpDir.path, 'pages', 'index', 'minitex.js'),
      ).writeAsStringSync(
          """export const useMiniTex = true;\nexport const embeddingFonts = [${embeddingFonts.join(",")}]""");
    } else {
      Directory(join(douyinTmpDir.path, "canvaskit", "pages", "minitex"))
          .deleteSync(recursive: true);
    }
  }

  Future _generateMiniTexIconFonts() async {
    final requireMiniTex = useMiniTex;
    if (requireMiniTex) {
      final files =
          Directory(join(douyinTmpDir.path)).listSync(recursive: true);
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
          File(join(file.path + ".svg.png"))
              .writeAsStringSync(fontPathRes.data!);
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
          File(join(file.path + ".svg.png"))
              .writeAsStringSync(fontPathRes.data!);
        }
      }
    }
  }

  void _mergeSubpackages() {
    final appJSONData = json
        .decode(File(join(douyinTmpDir.path, 'app.json')).readAsStringSync());
    final newAppJSONSubpackages = [];
    final appJSONSubpackages = appJSONData["subpackages"];
    var mainPkgSize =
        calculateDirectorySizeSync(Directory(join(douyinTmpDir.path, "pages")));
    if (appJSONSubpackages is List) {
      appJSONSubpackages.sort((aPkg, bPkg) {
        final a = aPkg["name"] as String;
        final b = bPkg["name"] as String;
        if (a.startsWith('canvaskit') && !b.startsWith('canvaskit')) {
          return -1; // a排在b前面
        } else if (b.startsWith('canvaskit') && !a.startsWith('canvaskit')) {
          return 1; // b排在a前面
        } else if (a.startsWith('mpflutter_douyin_') &&
            !b.startsWith('mpflutter_douyin_')) {
          return -1; // a排在b前面
        } else if (b.startsWith('mpflutter_douyin_') &&
            !a.startsWith('mpflutter_douyin_')) {
          return 1; // b排在a前面
        } else {
          return 0; // 保持原有顺序
        }
      });
      appJSONSubpackages.forEach((curPkg) {
        final root = curPkg["root"] as String;
        final rootDir = Directory(join(douyinTmpDir.path, root));
        final mustBeSubpackage = (() {
          try {
            final wxmlContent =
                File(join(douyinTmpDir.path, root, 'pages', 'index.ttml'))
                    .readAsStringSync();
            return wxmlContent.isNotEmpty && wxmlContent != "<view></view>";
          } catch (e) {
            return false;
          }
        })();
        final rootDirSize = calculateDirectorySizeSync(rootDir);
        if (mainPkgSize + rootDirSize < 2 * 1000 * 1000 && !mustBeSubpackage) {
          File(join(douyinTmpDir.path, root, 'pages', 'index.js'))
              .writeAsStringSync('');
          mainPkgSize += rootDirSize;
        } else {
          newAppJSONSubpackages.add(curPkg);
        }
      });
      appJSONData["subpackages"] = newAppJSONSubpackages;
      File(join(douyinTmpDir.path, 'app.json'))
          .writeAsStringSync(json.encode(appJSONData));
    }
  }

  void _removeRepeatPages() {
    final appJSONData = json
        .decode(File(join(douyinTmpDir.path, 'app.json')).readAsStringSync());
    appJSONData["pages"] = Set.from(appJSONData["pages"]).toList();
    File(join(douyinTmpDir.path, 'app.json'))
        .writeAsStringSync(json.encode(appJSONData));
  }

  void _removeLicenseTipsFlag() {
    if (!licenseGrant) return;
    final file = File(join(douyinTmpDir.path, 'pages', 'index', 'index.ttml'));
    var content = file.readAsStringSync();
    content = content.replaceAll(
        '<image style="position: absolute;right:0;top:0;width:66px;height:66px;z-index: 10000" src="{{licenseUrl}}" />',
        '');
    file.writeAsStringSync(content);
  }
}
