import 'package:dio/dio.dart';

class EventLog {
  final _uploader = _EventLogUploader();
  final Map commonParams;
  DateTime? buildStartTime;

  EventLog(this.commonParams);

  void buildStart() {
    buildStartTime = DateTime.now();
  }

  Future buildSuccess() async {
    final costTime = DateTime.now().millisecondsSinceEpoch -
        (buildStartTime?.millisecondsSinceEpoch ?? 0);
    await _uploader.sendEvent("build_success", {
      ...commonParams,
      "build": {
        "costTime": costTime,
      },
    });
  }

  Future buildFail(String code, String desc) async {
    final costTime = DateTime.now().millisecondsSinceEpoch -
        (buildStartTime?.millisecondsSinceEpoch ?? 0);
    await _uploader.sendEvent("build_fail", {
      ...commonParams,
      "build": {
        "error": {
          "code": code,
          "desc": desc,
        },
        "costTime": costTime,
      },
    });
  }
}

class _EventLogUploader {
  final dio = Dio();
  final endpoint = "https://api.mpflutter.com/eventlog";

  Future sendEvent(String name, Map params) async {
    try {
      await dio.post(
        endpoint,
        data: {
          "event_name": name,
          "event_params": params,
        },
        options: Options(
          sendTimeout: Duration(seconds: 3),
          receiveTimeout: Duration(seconds: 3),
        ),
      );
    } catch (e) {}
  }
}
