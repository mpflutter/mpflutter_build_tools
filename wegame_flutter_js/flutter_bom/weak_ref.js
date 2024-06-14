/*! (c) Andrea Giammarchi - ISC */
var self = this || /* istanbul ignore next */ {};
try {
  self.WeakRef = WeakRef;
  /* istanbul ignore next */
  self.FinalizationGroup = FinalizationGroup;
}
catch (o_O) {
  // requires a global WeakMap (IE11+)
  (function (WeakMap, defineProperties) {
    var wr = new WeakMap;
    function WeakRef(value) {
      wr.set(this, value);
    }
    defineProperties(
      WeakRef.prototype,
      {
        deref: {
          value: function deref() {
            return wr.get(this);
          }
        }
      }
    );

    var fg = new WeakMap;
    function FinalizationGroup(fn) {
      fg.set(this, []);
    }
    defineProperties(
      FinalizationGroup.prototype,
      {
        register: {
          value: function register(value, name) {
            var names = fg.get(this);
            if (names.indexOf(name) < 0)
              names.push(name);
          }
        },
        unregister: {
          value: function unregister(value, name) {
            var names = fg.get(this);
            var i = names.indexOf(name);
            if (-1 < i)
              names.splice(i, 1);
            return -1 < i;
          }
        },
        cleanupSome: {
          value: function cleanupSome(fn) {
            fn(fg.get(this));
          }
        }
      }
    );

    self.WeakRef = WeakRef;
    self.FinalizationGroup = FinalizationGroup;

  }(WeakMap, Object.defineProperties));
}
module.exports = self;