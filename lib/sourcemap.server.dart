import 'dart:io';
import 'dart:convert';
import 'package:path/path.dart';

String flutterRoot = (() {
  final pkgConfig = File(join('.dart_tool', 'package_config.json'));
  final pkgConfigData = json.decode(pkgConfig.readAsStringSync());
  final pkgs = (pkgConfigData["packages"] as List);
  for (var i = 0; i < pkgs.length; i++) {
    final it = pkgs[i];
    if (it['name'] == "flutter") {
      return File(join(
              Directory.fromUri(Uri.parse(it['rootUri'])).path, '../', '../'))
          .path;
    }
  }
  throw '找不到 Flutter 路径';
})();
final dartSDKRoot = flutterRoot + "bin/cache/dart-sdk/";
final webSDKRoot = flutterRoot + "bin/cache/flutter_web_sdk/";

void runSourceMapServer() {
  print(flutterRoot);
  HttpServer.bind('localhost', 10706).then((server) {
    print('已创建 sourcemap 代码阅读服务 => localhost:${server.port}');
    print('你可以在微信开发者工具 > Source Tab 中，针对 dart 代码进行断点调试。');
    print('如果你需要退出调试，或者需要重新构建，请按 Ctrl + C 退出。');
    server.listen((request) {
      handleRequest(request);
    });
  });
}

void handleRequest(HttpRequest request) {
  if (request.uri.path.startsWith("/org-dartlang-sdk:///dart-sdk/")) {
    final filePath = request.uri.path.replaceFirst(
      "/org-dartlang-sdk:///dart-sdk/",
      "",
    );
    final file = File(dartSDKRoot + filePath);
    if (file.existsSync()) {
      request.response.headers.contentType = ContentType.text;
      request.response.write(file.readAsStringSync());
      request.response.close();
    } else {
      request.response.statusCode = 404;
      request.response.close();
    }
  } else if (request.uri.path.startsWith("/org-dartlang-sdk:///lib/")) {
    final filePath = request.uri.path.replaceFirst(
      "/org-dartlang-sdk:///lib/",
      "/lib/",
    );
    final file = File(webSDKRoot + filePath);
    if (file.existsSync()) {
      request.response.headers.contentType = ContentType.text;
      request.response.write(file.readAsStringSync());
      request.response.close();
    } else {
      request.response.statusCode = 404;
      request.response.close();
    }
  } else if (request.uri.path.startsWith("/dart-package:///")) {
    final trimedPath = request.uri.path
        .replaceFirst('/dart-package:///', '')
        .replaceAll("__", "..")
        .replaceFirst('../../../', '');
    final file = File(trimedPath);
    if (file.existsSync()) {
      request.response.headers.contentType = ContentType.text;
      request.response.write(file.readAsStringSync());
      request.response.close();
    } else {
      request.response.statusCode = 404;
      request.response.close();
    }
  } else {
    request.response.statusCode = 404;
    request.response.close();
  }
}
