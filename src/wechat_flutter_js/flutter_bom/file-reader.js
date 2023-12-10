export class FileReader {
  constructor() {
    this.$$clazz$$ = "FileReader";
  }

  readAsArrayBuffer(blob) {
    const ab = blob.arrayBuffer();
    this.result = ab;
    setTimeout(() => {
      if (this.onload) {
        this.onload({
          $$clazz$$: "Event",
          target: {
            result: ab,
          },
        });
      }
    }, 10);
  }

  readAsText(blob) {
    const text = blob.text();
    this.result = text;
    setTimeout(() => {
      if (this.onload) {
        this.onload({
          $$clazz$$: "Event",
          target: {
            result: text,
          },
        });
      }
    }, 10);
  }

  abort() {}

  addEventListener(event, callback) {
    if (event === "load") {
      this.onload = callback;
    }
  }

  removeEventListener(event, callback) {
    if (event === "load" && this.onload === callback) {
      this.onload = undefined;
    }
  }
}
