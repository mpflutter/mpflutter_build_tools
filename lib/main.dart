import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:path/path.dart';

late Directory mpflutterSrcRoot;

void main(List<String> arguments) async {
  init();
  if (arguments.contains("--wechat")) {
    final builder = WechatBuilder();
    await builder.buildFlutterWeb(arguments);
    await builder.buildFlutterWechat(arguments);
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
    final completer = Completer();
    // 转发请求至Flutter命令
    final flutterProcess = await Process.start('flutter', [
      'build',
      'web',
      ...([...arguments]..removeWhere(
          (element) => element == "--mpjs" || element == "--wechat")),
      ...['--web-renderer', 'canvaskit'],
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
    print("start build buildFlutterWechat");
    // create wechat dir
    final wechatOut = Directory(join('build', 'wechat'));
    if (wechatOut.existsSync()) {
      wechatOut.deleteSync(recursive: true);
    }
    // copy src dir to build
    final wechatSrc = Directory('wechat');
    if (!wechatSrc.existsSync()) {
      print('工程目录下不存在 wechat 文件夹，请先按照教程初始化 wechat 工程。');
      return;
    }
    wechatOut.createSync();
    _copyDirectory(wechatSrc, wechatOut);
    _copyCanvaskitWasm(arguments);
    _copyFlutterSkeleton(arguments);
    _copyAssets(arguments);
    _compressAssets(arguments);
    _copyDartJS(arguments);
    _removeMPJS(arguments);
  }

  void _copyCanvaskitWasm(List<String> arguments) {
    final canvaskitSrc = Directory(join(mpflutterSrcRoot.path, 'canvaskit'));
    final canvaskitOut =
        Directory(join('build', 'wechat', 'canvaskit', 'pages'));
    canvaskitOut.createSync(recursive: true);
    _copyDirectory(canvaskitSrc, canvaskitOut);
  }

  void _copyFlutterSkeleton(List<String> arguments) {
    final wechatFlutterJSSrc =
        Directory(join(mpflutterSrcRoot.path, 'wechat_flutter_js'));
    final wechatFlutterJSOut =
        Directory(join('build', 'wechat', 'pages', 'index'));
    _copyDirectory(wechatFlutterJSSrc, wechatFlutterJSOut);
  }

  void _copyAssets(List<String> arguments) {
    final assetsSrc = Directory(join('build', 'web', 'assets'));
    final assetsOut = Directory(join('build', 'wechat', 'assets'));
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
    File(join('build', 'web', 'main.dart.js'))
        .copySync(join('build', 'wechat', 'pages', 'index', 'main.dart.js'));
    subPkgs.asMap().forEach((key, value) {
      final pkgDirRoot = join('build', 'wechat', 'pkg' + key.toString());
      Directory(pkgDirRoot).createSync();
      Directory(join(pkgDirRoot, 'pages')).createSync();
      File(join(pkgDirRoot, 'pages', 'index.js')).writeAsStringSync('Page({})');
      File(join(pkgDirRoot, 'pages', 'index.json')).writeAsStringSync('{}');
      File(join(pkgDirRoot, 'pages', 'index.wxml'))
          .writeAsStringSync('<view></view>');
      value.forEach((element) {
        File(join('build', 'web', element))
            .copySync(join(pkgDirRoot, 'pages', element));
      });
    });
    var subPkgJS = '';
    subPkgs.asMap().forEach((key, value) {
      value.forEach((element) {
        subPkgJS += '"/$element": "pkg$key",\n';
      });
    });
    File(join('build', 'wechat', 'pages', 'index', 'pkgs.js'))
        .writeAsStringSync('''
export default {
$subPkgJS
}
''');
    final appJSONData = json
        .decode(File(join('build', 'wechat', 'app.json')).readAsStringSync());
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
    File(join('build', 'wechat', 'app.json'))
        .writeAsStringSync(json.encode(appJSONData));
    // 添加环境变量到 js 头部
    _insertJSVars(join('build', 'wechat', 'pages', 'index', 'main.dart.js'));
    subPkgs.asMap().forEach((key, value) {
      value.forEach((element) {
        _insertJSVars(
            join('build', 'wechat', 'pkg' + key.toString(), 'pages', element));
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
        File(join('build', 'wechat', 'project.config.json'))
            .readAsStringSync());
    final originIgnoreList =
        projectConfigJSONData["setting"]["babelSetting"]["ignore"] as List;
    originIgnoreList.addAll(ignoreList);
    File(join('build', 'wechat', 'project.config.json')).writeAsStringSync(
      JsonEncoder.withIndent("  ").convert(projectConfigJSONData),
    );
  }

  void _removeMPJS(List<String> arguments) {
    if (arguments.contains('--mpjs')) {
      return;
    }
    File(join('build', 'wechat', 'pages', 'index', 'mpjs.js'))
        .writeAsStringSync("");
  }

  void _insertJSVars(String filePath) {
    final content = File(filePath).readAsStringSync();
    File(filePath).writeAsStringSync(
        '''var self = getApp()._flutter.self; var \$__dart_deferred_initializers__ = self.\$__dart_deferred_initializers__; var document = self.document;''' +
            content);
  }

  void _compressAssets(List<String> arguments) {
    Directory(join('build', 'wechat', 'assets'))
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
