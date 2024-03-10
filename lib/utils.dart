import 'dart:convert';
import 'dart:io';
import 'package:path/path.dart';

Future<String?> getIP() async {
  try {
    final addresses = await NetworkInterface.list();
    for (var interface in addresses) {
      for (var address in interface.addresses) {
        if (address.type == InternetAddressType.IPv4) {
          return address.address;
        }
      }
    }
  } catch (e) {}
  return null;
}

int compareVersions(String version1, String version2) {
  final parts1 = version1.split('.');
  final parts2 = version2.split('.');

  for (var i = 0; i < 3; i++) {
    final part1 = int.parse(parts1[i]);
    final part2 = int.parse(parts2[i]);

    if (part1 < part2) {
      return -1;
    } else if (part1 > part2) {
      return 1;
    }
  }

  return 0;
}

String fixRootUri(String rootUriOrigin) {
  var rootUri = rootUriOrigin;
  if (rootUri.isEmpty) return rootUri;
  if (rootUri.startsWith("../")) {
    rootUri = rootUri.replaceFirst('../', '');
  }
  if (rootUri.startsWith("..\\")) {
    rootUri = rootUri.replaceFirst('..\\', '');
  }
  return rootUri;
}

String fixSourceMap(String content) {
  final obj = json.decode(content);
  obj['sourceRoot'] = 'http://localhost:10706/';
  final sources = obj['sources'] as List<dynamic>;
  for (var i = 0; i < sources.length; i++) {
    final uri = sources[i] as String;
    if (uri.startsWith('../')) {
      final newUri = 'dart-package:///' + uri;
      obj['sources'][i] = newUri.replaceAll('..', '__');
    }
  }
  return json.encode(obj);
}

void copyDirectory(Directory source, Directory destination) {
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
      copyDirectory(entity, newDirectory);
    }
  });
}

int calculateDirectorySizeSync(Directory directory) {
  int totalSize = 0;
  final entities = directory.listSync();
  for (var entity in entities) {
    if (entity is File) {
      totalSize += entity.lengthSync();
    } else if (entity is Directory) {
      totalSize += calculateDirectorySizeSync(entity);
    }
  }
  return totalSize;
}
