import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:path/path.dart';

late Directory mpflutterSrcRoot;

void main(List<String> arguments) async {
  init();

  print("====== 欢迎使用 MPFlutter Build Tools ======");
  print("特别提示你：");
  print("1. MPFlutter Build Tools 目前不是开源项目");
  print("2. 禁止反编译、修改 MPFlutter Build Tools 程序（在获得 MPFlutter 团队同意的情况下除外）");
  print("3. 禁止在未获取授权的情况下，移除 UNLICENSED 标识");
  print("4. MPFlutter Build Tools 会上传埋点信息，用于营销分析，如果你不同意该行为，应停止使用。");
  print("===========================================");

  if (arguments.contains("--wechat")) {
    print("[INFO] 正在构建 wechat 小程序");
    final builder = WechatBuilder();
    try {
      await builder.buildFlutterWeb(arguments);
      await builder.buildFlutterWechat(arguments);
      print("[INFO] 构建成功，产物在 build/wechat 目录，使用微信开发者工具导入预览、上传、发布。");
    } catch (e) {
      print("[ERROR] 构建失败，失败信息： $e");
    }
  }
}

void init() {
  final pkgConfig = File(join('.dart_tool', 'package_config.json'));
  final pkgConfigData = json.decode(pkgConfig.readAsStringSync());
  (pkgConfigData["packages"] as List).forEach((it) {
    if (it['name'] == "mpflutter_build_tools") {
      mpflutterSrcRoot = Directory.fromUri(Uri.parse(it['rootUri']));
    }
  });
}

class WechatBuilder {
  Future buildFlutterWeb(List<String> arguments) async {
    print("[INFO] 正在构建 flutter for web 产物");
    // create wechat dir
    final webOut = Directory(join('build', 'web'));
    if (webOut.existsSync()) {
      webOut.deleteSync(recursive: true);
    }

    final completer = Completer();
    // 转发请求至Flutter命令
    final flutterProcess = await Process.start('flutter', [
      'build',
      'web',
      ...([...arguments]..removeWhere((element) =>
          element == "--mpjs" ||
          element == "--wechat" ||
          element == "--debug")),
      ...['--web-renderer', 'canvaskit'],
      ...arguments.contains('--debug')
          ? ['--source-maps', '--dart2js-optimization', 'O1']
          : [],
    ]);

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
  }

  Future buildFlutterWechat(List<String> arguments) async {
    print("[INFO] 正在构建 wechat 产物");
    // create wechat dir
    final wechatOut = Directory(join('build', 'wechat'));
    if (wechatOut.existsSync()) {
      wechatOut.deleteSync(recursive: true);
    }
    final wechatTmp = Directory(join('build', 'wechat_tmp'));
    if (wechatTmp.existsSync()) {
      wechatTmp.deleteSync(recursive: true);
    }
    // copy src dir to build
    final wechatSrc = Directory('wechat');
    if (!wechatSrc.existsSync()) {
      throw '工程目录下不存在 wechat 文件夹，请先按照教程初始化 wechat 工程。';
    }
    wechatTmp.createSync();
    wechatOut.createSync();
    _copyDirectory(wechatSrc, wechatTmp);
    _copyCanvaskitWasm(arguments);
    _copyFlutterSkeleton(arguments);
    _copyAssets(arguments);
    _compressAssets(arguments);
    _copyDartJS(arguments);
    _removeMPJS(arguments);
    wechatOut.deleteSync();
    wechatTmp.renameSync(wechatOut.path);
  }

  void _copyCanvaskitWasm(List<String> arguments) {
    final canvaskitSrc = Directory(join(mpflutterSrcRoot.path, 'canvaskit'));
    final canvaskitOut =
        Directory(join('build', 'wechat_tmp', 'canvaskit', 'pages'));
    canvaskitOut.createSync(recursive: true);
    _copyDirectory(canvaskitSrc, canvaskitOut);
  }

  void _copyFlutterSkeleton(List<String> arguments) {
    final wechatFlutterJSSrc =
        Directory(join(mpflutterSrcRoot.path, 'wechat_flutter_js'));
    final wechatFlutterJSOut =
        Directory(join('build', 'wechat_tmp', 'pages', 'index'));
    _copyDirectory(wechatFlutterJSSrc, wechatFlutterJSOut);
  }

  void _copyAssets(List<String> arguments) {
    final assetsSrc = Directory(join('build', 'web', 'assets'));
    final assetsOut = Directory(join('build', 'wechat_tmp', 'assets'));
    assetsOut.createSync();
    Directory(join(assetsOut.path, 'pages')).createSync();
    File(join(assetsOut.path, 'pages', 'index.js'))
        .writeAsStringSync('Page({})');
    File(join(assetsOut.path, 'pages', 'index.json')).writeAsStringSync('{}');
    File(join(assetsOut.path, 'pages', 'index.wxml'))
        .writeAsStringSync('<view></view>');
    _copyDirectory(assetsSrc, assetsOut);
    File(join(assetsOut.path, 'NOTICES')).deleteSync();
  }

  void _copyDartJS(List<String> arguments) {
    List<List<String>> subPkgs = [];
    List<String> currentPkgFiles = [];
    var currentPkgSize = 0;
    Directory(join('build', 'web'))
        .listSync()
        .where((element) => element.path.endsWith('.part.js'))
        .forEach((element) {
      if (currentPkgSize + element.statSync().size > 2 * 1000 * 1000) {
        subPkgs.add(currentPkgFiles);
        currentPkgFiles = [];
        currentPkgSize = 0;
      } else {
        currentPkgFiles.add(element.path.split(separator).last);
        currentPkgSize += element.statSync().size;
      }
    });
    if (currentPkgFiles.isNotEmpty) {
      subPkgs.add(currentPkgFiles);
    }
    File(join('build', 'web', 'main.dart.js')).copySync(
        join('build', 'wechat_tmp', 'pages', 'index', 'main.dart.js'));
    if (File(join('build', 'web', 'main.dart.js.map')).existsSync()) {
      File(join('build', 'web', 'main.dart.js.map')).copySync(
          join('build', 'wechat_tmp', 'pages', 'index', 'main.dart.js.map'));
    }
    subPkgs.asMap().forEach((key, value) {
      final pkgDirRoot = join('build', 'wechat_tmp', 'pkg' + key.toString());
      Directory(pkgDirRoot).createSync();
      Directory(join(pkgDirRoot, 'pages')).createSync();
      File(join(pkgDirRoot, 'pages', 'index.js')).writeAsStringSync('Page({})');
      File(join(pkgDirRoot, 'pages', 'index.json')).writeAsStringSync('{}');
      File(join(pkgDirRoot, 'pages', 'index.wxml'))
          .writeAsStringSync('<view></view>');
      value.forEach((element) {
        File(join('build', 'web', element))
            .copySync(join(pkgDirRoot, 'pages', element));
        if (File(join('build', 'web', element + ".map")).existsSync()) {
          File(join('build', 'web', element + ".map"))
              .copySync(join(pkgDirRoot, 'pages', element + ".map"));
        }
      });
    });
    var subPkgJS = '';
    subPkgs.asMap().forEach((key, value) {
      value.forEach((element) {
        subPkgJS += '"/$element": "pkg$key",\n';
      });
    });
    File(join('build', 'wechat_tmp', 'pages', 'index', 'pkgs.js'))
        .writeAsStringSync('''
export default {
$subPkgJS
}
''');
    final appJSONData = json.decode(
        File(join('build', 'wechat_tmp', 'app.json')).readAsStringSync());
    final appJSONSubpackages = [
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
    File(join('build', 'wechat_tmp', 'app.json'))
        .writeAsStringSync(json.encode(appJSONData));
    // 添加环境变量到 js 头部
    _insertJSVars(
        join('build', 'wechat_tmp', 'pages', 'index', 'main.dart.js'));
    subPkgs.asMap().forEach((key, value) {
      value.forEach((element) {
        _insertJSVars(join(
            'build', 'wechat_tmp', 'pkg' + key.toString(), 'pages', element));
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
        File(join('build', 'wechat_tmp', 'project.config.json'))
            .readAsStringSync());
    final originIgnoreList =
        projectConfigJSONData["setting"]["babelSetting"]["ignore"] as List;
    originIgnoreList.addAll(ignoreList);
    File(join('build', 'wechat_tmp', 'project.config.json')).writeAsStringSync(
      JsonEncoder.withIndent("  ").convert(projectConfigJSONData),
    );
  }

  void _removeMPJS(List<String> arguments) {
    if (arguments.contains('--mpjs')) {
      return;
    }
    File(join('build', 'wechat_tmp', 'pages', 'index', 'mpjs.js'))
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
    Directory(join('build', 'wechat_tmp', 'assets'))
        .listSync(recursive: true)
        .forEach((element) {
      if (element.statSync().type == FileSystemEntityType.directory) return;
      if (element.path.endsWith('index.js') ||
          element.path.endsWith('index.json') ||
          element.path.endsWith('index.wxml')) return;
      Process.runSync('brotli', [element.path, '-o', element.path + ".br"]);
      element.deleteSync();
    });
  }

  void _copyDirectory(Directory source, Directory destination) {
    // 获取源文件夹中的所有内容
    source.listSync().forEach((entity) {
      if (entity is File) {
        // 如果是文件，则复制到目标文件夹中
        final newPath = join(destination.path, basename(entity.path));
        entity.copySync(newPath);
      } else if (entity is Directory) {
        // 如果是文件夹，则递归复制子文件夹
        final newDirectory =
            Directory(join(destination.path, basename(entity.path)));
        newDirectory.createSync();
        _copyDirectory(entity, newDirectory);
      }
    });
  }
}
