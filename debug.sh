rm -f lib/main.jit
dart compile jit-snapshot src/lib/main.dart
mv src/lib/main.jit lib/main.jit

rm -rf wechat_flutter_js
cp -rf src/wechat_flutter_js ./wechat_flutter_js