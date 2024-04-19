import 'dart:io';

bool useFvm() {
  return File(".fvmrc").existsSync();
}
