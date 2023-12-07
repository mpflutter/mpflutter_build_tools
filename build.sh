rm -f lib/main.dart
cp src/lib/main.dart lib/main.dart

rm -rf wechat_flutter_js
mkdir -p wechat_flutter_js
mkdir -p wechat_flutter_js/flutter_bom
cd src/wechat_flutter_js
find . -type f -name "*.js" -exec uglifyjs {} -o ../../wechat_flutter_js/{} \;
cp index.json ../../wechat_flutter_js/index.json
cp index.wxml ../../wechat_flutter_js/index.wxml