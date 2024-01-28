const WebAssembly = WXWebAssembly
var requestAnimationFrame = undefined
const GLVersion = 1

var CanvasKitInit = (() => {
  var _scriptDir =
    typeof document !== "undefined" && document.currentScript ?
    document.currentScript.src :
    undefined;
  if (typeof __filename !== "undefined") _scriptDir = _scriptDir || __filename;
  return function (moduleArg = {}) {
    var w = moduleArg,
      ba,
      fa;
    w.ready = new Promise((a, b) => {
      ba = a;
      fa = b;
    });
    (function (a) {
      a.Rd = a.Rd || [];
      a.Rd.push(function () {
        a.MakeSWCanvasSurface = function (b) {
          var c = b,
            f =
            "undefined" !== typeof OffscreenCanvas &&
            c instanceof OffscreenCanvas;
          if (
            !(
              ("undefined" !== typeof HTMLCanvasElement &&
                c instanceof HTMLCanvasElement) ||
              f ||
              ((c = document.getElementById(b)), c)
            )
          )
            throw "Canvas with id " + b + " was not found";
          if ((b = a.MakeSurface(c.width, c.height))) b.Jd = c;
          return b;
        };
        a.MakeCanvasSurface || (a.MakeCanvasSurface = a.MakeSWCanvasSurface);
        a.MakeSurface = function (b, c) {
          var f = {
              width: b,
              height: c,
              colorType: a.ColorType.RGBA_8888,
              alphaType: a.AlphaType.Unpremul,
              colorSpace: a.ColorSpace.SRGB,
            },
            h = b * c * 4,
            m = a._malloc(h);
          if ((f = a.Surface._makeRasterDirect(f, m, 4 * b)))
            (f.Jd = null),
            (f.Ff = b),
            (f.Bf = c),
            (f.Df = h),
            (f.$e = m),
            f.getCanvas().clear(a.TRANSPARENT);
          return f;
        };
        a.MakeRasterDirectSurface = function (b, c, f) {
          return a.Surface._makeRasterDirect(b, c.byteOffset, f);
        };
        a.Surface.prototype.flush = function (b) {
          a.Kd(this.Id);
          this._flush();
          if (this.Jd) {
            var c = new Uint8ClampedArray(a.HEAPU8.buffer, this.$e, this.Df);
            c = new ImageData(c, this.Ff, this.Bf);
            b
              ?
              this.Jd.getContext("2d").putImageData(
                c,
                0,
                0,
                b[0],
                b[1],
                b[2] - b[0],
                b[3] - b[1]
              ) :
              this.Jd.getContext("2d").putImageData(c, 0, 0);
          }
        };
        a.Surface.prototype.dispose = function () {
          this.$e && a._free(this.$e);
          this.delete();
        };
        a.Kd = a.Kd || function () {};
        a.Re =
          a.Re ||
          function () {
            return null;
          };
      });
    })(w);
    (function (a) {
      a.Rd = a.Rd || [];
      a.Rd.push(function () {
        function b(n, q, v) {
          return n && n.hasOwnProperty(q) ? n[q] : v;
        }

        function c(n) {
          var q = ha(ia);
          ia[q] = n;
          return q;
        }

        function f(n) {
          return (
            n.naturalHeight || n.videoHeight || n.displayHeight || n.height
          );
        }

        function h(n) {
          return n.naturalWidth || n.videoWidth || n.displayWidth || n.width;
        }

        function m(n, q, v, E) {
          n.bindTexture(n.TEXTURE_2D, q);
          E ||
            v.alphaType !== a.AlphaType.Premul ||
            n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0);
          return q;
        }

        function u(n, q, v) {
          v ||
            q.alphaType !== a.AlphaType.Premul ||
            n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1);
          n.bindTexture(n.TEXTURE_2D, null);
        }
        a.GetWebGLContext = function (n, q) {
          if (!n) throw "null canvas passed into makeWebGLContext";
          var v = {
            alpha: b(q, "alpha", 1),
            depth: b(q, "depth", 1),
            stencil: b(q, "stencil", 8),
            antialias: b(q, "antialias", 0),
            premultipliedAlpha: b(q, "premultipliedAlpha", 1),
            preserveDrawingBuffer: b(q, "preserveDrawingBuffer", 0),
            preferLowPowerToHighPerformance: b(
              q,
              "preferLowPowerToHighPerformance",
              0
            ),
            failIfMajorPerformanceCaveat: b(
              q,
              "failIfMajorPerformanceCaveat",
              0
            ),
            enableExtensionsByDefault: b(q, "enableExtensionsByDefault", 1),
            explicitSwapControl: b(q, "explicitSwapControl", 0),
            renderViaOffscreenBackBuffer: b(
              q,
              "renderViaOffscreenBackBuffer",
              0
            ),
          };
          v.majorVersion =
            q && q.majorVersion ?
            q.majorVersion :
            GLVersion > 1 ?
            2 :
            1;
          if (v.explicitSwapControl)
            throw "explicitSwapControl is not supported";
          n = na(n, v);
          if (!n) return 0;
          oa(n);
          A.de.getExtension("WEBGL_debug_renderer_info");
          return n;
        };
        a.deleteContext = function (n) {
          A === qa[n] && (A = null);
          "object" == typeof JSEvents && JSEvents.sg(qa[n].de.canvas);
          qa[n] && qa[n].de.canvas && (qa[n].de.canvas.xf = void 0);
          qa[n] = null;
        };
        a._setTextureCleanup({
          deleteTexture: function (n, q) {
            var v = ia[q];
            v && qa[n].de.deleteTexture(v);
            ia[q] = null;
          },
        });
        a.MakeWebGLContext = function (n) {
          if (!this.Kd(n)) return null;
          var q = this._MakeGrContext();
          if (!q) return null;
          q.Id = n;
          var v = q.delete.bind(q);
          q["delete"] = function () {
            a.Kd(this.Id);
            v();
          }.bind(q);
          return (A.df = q);
        };
        a.MakeGrContext = a.MakeWebGLContext;
        a.GrDirectContext.prototype.getResourceCacheLimitBytes = function () {
          a.Kd(this.Id);
          this._getResourceCacheLimitBytes();
        };
        a.GrDirectContext.prototype.getResourceCacheUsageBytes = function () {
          a.Kd(this.Id);
          this._getResourceCacheUsageBytes();
        };
        a.GrDirectContext.prototype.releaseResourcesAndAbandonContext =
          function () {
            a.Kd(this.Id);
            this._releaseResourcesAndAbandonContext();
          };
        a.GrDirectContext.prototype.setResourceCacheLimitBytes = function (n) {
          a.Kd(this.Id);
          this._setResourceCacheLimitBytes(n);
        };
        a.MakeOnScreenGLSurface = function (n, q, v, E, I, L) {
          if (!this.Kd(n.Id)) return null;
          q =
            void 0 === I || void 0 === L ?
            this._MakeOnScreenGLSurface(n, q, v, E) :
            this._MakeOnScreenGLSurface(n, q, v, E, I, L);
          if (!q) return null;
          q.Id = n.Id;
          return q;
        };
        a.MakeRenderTarget = function () {
          var n = arguments[0];
          if (!this.Kd(n.Id)) return null;
          if (3 === arguments.length) {
            var q = this._MakeRenderTargetWH(n, arguments[1], arguments[2]);
            if (!q) return null;
          } else if (2 === arguments.length) {
            if (((q = this._MakeRenderTargetII(n, arguments[1])), !q))
              return null;
          } else return null;
          q.Id = n.Id;
          return q;
        };
        a.MakeWebGLCanvasSurface = function (n, q, v) {
          requestAnimationFrame = n.requestAnimationFrame;
          q = q || null;
          var E = n;
          n = this.GetWebGLContext(E, v);
          if (!n || 0 > n) throw "failed to create webgl context: err " + n;
          n = this.MakeWebGLContext(n);
          q = this.MakeOnScreenGLSurface(n, E.width, E.height, q);
          return q ?
            q :
            ((q = E.cloneNode(!0)),
              E.parentNode.replaceChild(q, E),
              q.classList.add("ck-replaced"),
              a.MakeSWCanvasSurface(q));
        };
        a.MakeCanvasSurface = a.MakeWebGLCanvasSurface;
        a.Surface.prototype.makeImageFromTexture = function (n, q) {
          a.Kd(this.Id);
          n = c(n);
          if ((q = this._makeImageFromTexture(this.Id, n, q))) q.Je = n;
          return q;
        };
        a.Surface.prototype.makeImageFromTextureSource = function (n, q, v) {
          q ||
            (q = {
              height: f(n),
              width: h(n),
              colorType: a.ColorType.RGBA_8888,
              alphaType: v ? a.AlphaType.Premul : a.AlphaType.Unpremul,
            });
          q.colorSpace || (q.colorSpace = a.ColorSpace.SRGB);
          a.Kd(this.Id);
          var E = A.de;
          v = m(E, E.createTexture(), q, v);
          2 === A.version ?
            E.texImage2D(
              E.TEXTURE_2D,
              0,
              E.RGBA,
              q.width,
              q.height,
              0,
              E.RGBA,
              E.UNSIGNED_BYTE,
              n
            ) :
            E.texImage2D(E.TEXTURE_2D, 0, E.RGBA, E.RGBA, E.UNSIGNED_BYTE, n);
          u(E, q);
          this._resetContext();
          return this.makeImageFromTexture(v, q);
        };
        a.Surface.prototype.updateTextureFromSource = function (n, q, v) {
          if (n.Je) {
            a.Kd(this.Id);
            var E = n.getImageInfo(),
              I = A.de,
              L = m(I, ia[n.Je], E, v);
            2 === A.version ?
              I.texImage2D(
                I.TEXTURE_2D,
                0,
                I.RGBA,
                h(q),
                f(q),
                0,
                I.RGBA,
                I.UNSIGNED_BYTE,
                q
              ) :
              I.texImage2D(
                I.TEXTURE_2D,
                0,
                I.RGBA,
                I.RGBA,
                I.UNSIGNED_BYTE,
                q
              );
            u(I, E, v);
            this._resetContext();
            ia[n.Je] = null;
            n.Je = c(L);
            E.colorSpace = n.getColorSpace();
            q = this._makeImageFromTexture(this.Id, n.Je, E);
            v = n.Hd.Pd;
            I = n.Hd.Wd;
            n.Hd.Pd = q.Hd.Pd;
            n.Hd.Wd = q.Hd.Wd;
            q.Hd.Pd = v;
            q.Hd.Wd = I;
            q.delete();
            E.colorSpace.delete();
          }
        };
        a.MakeLazyImageFromTextureSource = function (n, q, v) {
          q ||
            (q = {
              height: f(n),
              width: h(n),
              colorType: a.ColorType.RGBA_8888,
              alphaType: v ? a.AlphaType.Premul : a.AlphaType.Unpremul,
            });
          q.colorSpace || (q.colorSpace = a.ColorSpace.SRGB);
          var E = {
            makeTexture: function () {
              var I = A,
                L = I.de,
                y = m(L, L.createTexture(), q, v);
              2 === I.version ?
                L.texImage2D(
                  L.TEXTURE_2D,
                  0,
                  L.RGBA,
                  q.width,
                  q.height,
                  0,
                  L.RGBA,
                  L.UNSIGNED_BYTE,
                  n
                ) :
                L.texImage2D(
                  L.TEXTURE_2D,
                  0,
                  L.RGBA,
                  L.RGBA,
                  L.UNSIGNED_BYTE,
                  n
                );
              u(L, q, v);
              return c(y);
            },
            freeSrc: function () {},
          };
          "VideoFrame" === n.constructor.name &&
            (E.freeSrc = function () {
              n.close();
            });
          return a.Image._makeFromGenerator(q, E);
        };
        a.Kd = function (n) {
          return n ? oa(n) : !1;
        };
        a.Re = function () {
          return A && A.df && !A.df.isDeleted() ? A.df : null;
        };
      });
    })(w);
    (function (a) {
      function b(e, d, g, l, t) {
        for (var x = 0; x < e.length; x++)
          d[x * g + ((x * t + l + g) % g)] = e[x];
        return d;
      }

      function c(e) {
        for (var d = e * e, g = Array(d); d--;)
          g[d] = 0 === d % (e + 1) ? 1 : 0;
        return g;
      }

      function f(e) {
        return e ? e.constructor === Float32Array && 4 === e.length : !1;
      }

      function h(e) {
        return (
          ((n(255 * e[3]) << 24) |
            (n(255 * e[0]) << 16) |
            (n(255 * e[1]) << 8) |
            (n(255 * e[2]) << 0)) >>>
          0
        );
      }

      function m(e) {
        if (e && e._ck) return e;
        if (e instanceof Float32Array) {
          for (
            var d = Math.floor(e.length / 4), g = new Uint32Array(d), l = 0; l < d; l++
          )
            g[l] = h(e.slice(4 * l, 4 * (l + 1)));
          return g;
        }
        if (e instanceof Uint32Array) return e;
        if (e instanceof Array && e[0] instanceof Float32Array) return e.map(h);
      }

      function u(e) {
        if (void 0 === e) return 1;
        var d = parseFloat(e);
        return e && -1 !== e.indexOf("%") ? d / 100 : d;
      }

      function n(e) {
        return Math.round(Math.max(0, Math.min(e || 0, 255)));
      }

      function q(e, d) {
        (d && d._ck) || a._free(e);
      }

      function v(e, d, g) {
        if (!e || !e.length) return W;
        if (e && e._ck) return e.byteOffset;
        var l = a[d].BYTES_PER_ELEMENT;
        g || (g = a._malloc(e.length * l));
        a[d].set(e, g / l);
        return g;
      }

      function E(e) {
        var d = {
          $d: W,
          count: e.length,
          colorType: a.ColorType.RGBA_F32
        };
        if (e instanceof Float32Array)
          (d.$d = v(e, "HEAPF32")), (d.count = e.length / 4);
        else if (e instanceof Uint32Array)
          (d.$d = v(e, "HEAPU32")), (d.colorType = a.ColorType.RGBA_8888);
        else if (e instanceof Array) {
          if (e && e.length) {
            for (
              var g = a._malloc(16 * e.length), l = 0, t = g / 4, x = 0; x < e.length; x++
            )
              for (var C = 0; 4 > C; C++)(a.HEAPF32[t + l] = e[x][C]), l++;
            e = g;
          } else e = W;
          d.$d = e;
        } else
          throw (
            "Invalid argument to copyFlexibleColorArray, Not a color array " +
            typeof e
          );
        return d;
      }

      function I(e) {
        if (!e) return W;
        var d = Vb.toTypedArray();
        if (e.length) {
          if (6 === e.length || 9 === e.length)
            return (
              v(e, "HEAPF32", Na),
              6 === e.length && a.HEAPF32.set(wd, 6 + Na / 4),
              Na
            );
          if (16 === e.length)
            return (
              (d[0] = e[0]),
              (d[1] = e[1]),
              (d[2] = e[3]),
              (d[3] = e[4]),
              (d[4] = e[5]),
              (d[5] = e[7]),
              (d[6] = e[12]),
              (d[7] = e[13]),
              (d[8] = e[15]),
              Na
            );
          throw "invalid matrix size";
        }
        if (void 0 === e.m11) throw "invalid matrix argument";
        d[0] = e.m11;
        d[1] = e.m21;
        d[2] = e.m41;
        d[3] = e.m12;
        d[4] = e.m22;
        d[5] = e.m42;
        d[6] = e.m14;
        d[7] = e.m24;
        d[8] = e.m44;
        return Na;
      }

      function L(e) {
        if (!e) return W;
        var d = Wb.toTypedArray();
        if (e.length) {
          if (16 !== e.length && 6 !== e.length && 9 !== e.length)
            throw "invalid matrix size";
          if (16 === e.length) return v(e, "HEAPF32", $a);
          d.fill(0);
          d[0] = e[0];
          d[1] = e[1];
          d[3] = e[2];
          d[4] = e[3];
          d[5] = e[4];
          d[7] = e[5];
          d[10] = 1;
          d[12] = e[6];
          d[13] = e[7];
          d[15] = e[8];
          6 === e.length && ((d[12] = 0), (d[13] = 0), (d[15] = 1));
          return $a;
        }
        if (void 0 === e.m11) throw "invalid matrix argument";
        d[0] = e.m11;
        d[1] = e.m21;
        d[2] = e.m31;
        d[3] = e.m41;
        d[4] = e.m12;
        d[5] = e.m22;
        d[6] = e.m32;
        d[7] = e.m42;
        d[8] = e.m13;
        d[9] = e.m23;
        d[10] = e.m33;
        d[11] = e.m43;
        d[12] = e.m14;
        d[13] = e.m24;
        d[14] = e.m34;
        d[15] = e.m44;
        return $a;
      }

      function y(e, d) {
        return v(e, "HEAPF32", d || Ta);
      }

      function N(e, d, g, l) {
        var t = Xb.toTypedArray();
        t[0] = e;
        t[1] = d;
        t[2] = g;
        t[3] = l;
        return Ta;
      }

      function T(e) {
        for (var d = new Float32Array(4), g = 0; 4 > g; g++)
          d[g] = a.HEAPF32[e / 4 + g];
        return d;
      }

      function S(e, d) {
        return v(e, "HEAPF32", d || ja);
      }

      function pa(e, d) {
        return v(e, "HEAPF32", d || Yb);
      }

      function la() {
        for (var e = 0, d = 0; d < arguments.length - 1; d += 2)
          e += arguments[d] * arguments[d + 1];
        return e;
      }

      function gb(e, d, g) {
        for (var l = Array(e.length), t = 0; t < g; t++)
          for (var x = 0; x < g; x++) {
            for (var C = 0, J = 0; J < g; J++) C += e[g * t + J] * d[g * J + x];
            l[t * g + x] = C;
          }
        return l;
      }

      function hb(e, d) {
        for (var g = gb(d[0], d[1], e), l = 2; l < d.length;)
          (g = gb(g, d[l], e)), l++;
        return g;
      }
      a.Color = function (e, d, g, l) {
        void 0 === l && (l = 1);
        return a.Color4f(n(e) / 255, n(d) / 255, n(g) / 255, l);
      };
      a.ColorAsInt = function (e, d, g, l) {
        void 0 === l && (l = 255);
        return (
          ((n(l) << 24) |
            (n(e) << 16) |
            (n(d) << 8) |
            ((n(g) << 0) & 268435455)) >>>
          0
        );
      };
      a.Color4f = function (e, d, g, l) {
        void 0 === l && (l = 1);
        return Float32Array.of(e, d, g, l);
      };
      Object.defineProperty(a, "TRANSPARENT", {
        get: function () {
          return a.Color4f(0, 0, 0, 0);
        },
      });
      Object.defineProperty(a, "BLACK", {
        get: function () {
          return a.Color4f(0, 0, 0, 1);
        },
      });
      Object.defineProperty(a, "WHITE", {
        get: function () {
          return a.Color4f(1, 1, 1, 1);
        },
      });
      Object.defineProperty(a, "RED", {
        get: function () {
          return a.Color4f(1, 0, 0, 1);
        },
      });
      Object.defineProperty(a, "GREEN", {
        get: function () {
          return a.Color4f(0, 1, 0, 1);
        },
      });
      Object.defineProperty(a, "BLUE", {
        get: function () {
          return a.Color4f(0, 0, 1, 1);
        },
      });
      Object.defineProperty(a, "YELLOW", {
        get: function () {
          return a.Color4f(1, 1, 0, 1);
        },
      });
      Object.defineProperty(a, "CYAN", {
        get: function () {
          return a.Color4f(0, 1, 1, 1);
        },
      });
      Object.defineProperty(a, "MAGENTA", {
        get: function () {
          return a.Color4f(1, 0, 1, 1);
        },
      });
      a.getColorComponents = function (e) {
        return [
          Math.floor(255 * e[0]),
          Math.floor(255 * e[1]),
          Math.floor(255 * e[2]),
          e[3],
        ];
      };
      a.parseColorString = function (e, d) {
        e = e.toLowerCase();
        if (e.startsWith("#")) {
          d = 255;
          switch (e.length) {
            case 9:
              d = parseInt(e.slice(7, 9), 16);
            case 7:
              var g = parseInt(e.slice(1, 3), 16);
              var l = parseInt(e.slice(3, 5), 16);
              var t = parseInt(e.slice(5, 7), 16);
              break;
            case 5:
              d = 17 * parseInt(e.slice(4, 5), 16);
            case 4:
              (g = 17 * parseInt(e.slice(1, 2), 16)),
              (l = 17 * parseInt(e.slice(2, 3), 16)),
              (t = 17 * parseInt(e.slice(3, 4), 16));
          }
          return a.Color(g, l, t, d / 255);
        }
        return e.startsWith("rgba") ?
          ((e = e.slice(5, -1)),
            (e = e.split(",")),
            a.Color(+e[0], +e[1], +e[2], u(e[3]))) :
          e.startsWith("rgb") ?
          ((e = e.slice(4, -1)),
            (e = e.split(",")),
            a.Color(+e[0], +e[1], +e[2], u(e[3]))) :
          e.startsWith("gray(") ||
          e.startsWith("hsl") ||
          !d ||
          ((e = d[e]), void 0 === e) ?
          a.BLACK :
          e;
      };
      a.multiplyByAlpha = function (e, d) {
        e = e.slice();
        e[3] = Math.max(0, Math.min(e[3] * d, 1));
        return e;
      };
      a.Malloc = function (e, d) {
        var g = a._malloc(d * e.BYTES_PER_ELEMENT);
        return {
          _ck: !0,
          length: d,
          byteOffset: g,
          oe: null,
          subarray: function (l, t) {
            l = this.toTypedArray().subarray(l, t);
            l._ck = !0;
            return l;
          },
          toTypedArray: function () {
            if (this.oe && this.oe.length) return this.oe;
            this.oe = new e(a.HEAPU8.buffer, g, d);
            this.oe._ck = !0;
            return this.oe;
          },
        };
      };
      a.Free = function (e) {
        a._free(e.byteOffset);
        e.byteOffset = W;
        e.toTypedArray = null;
        e.oe = null;
      };
      var Na = W,
        Vb,
        $a = W,
        Wb,
        Ta = W,
        Xb,
        Ba,
        ja = W,
        xc,
        Oa = W,
        yc,
        Zb = W,
        zc,
        $b = W,
        yb,
        ib = W,
        Ac,
        Yb = W,
        Bc,
        Cc = W,
        wd = Float32Array.of(0, 0, 1),
        W = 0;
      a.onRuntimeInitialized = function () {
        function e(d, g, l, t, x, C, J) {
          C ||
            ((C = 4 * t.width),
              t.colorType === a.ColorType.RGBA_F16 ?
              (C *= 2) :
              t.colorType === a.ColorType.RGBA_F32 && (C *= 4));
          var P = C * t.height;
          var O = x ? x.byteOffset : a._malloc(P);
          if (
            J ? !d._readPixels(t, O, C, g, l, J) : !d._readPixels(t, O, C, g, l)
          )
            return x || a._free(O), null;
          if (x) return x.toTypedArray();
          switch (t.colorType) {
            case a.ColorType.RGBA_8888:
            case a.ColorType.RGBA_F16:
              d = new Uint8Array(a.HEAPU8.buffer, O, P).slice();
              break;
            case a.ColorType.RGBA_F32:
              d = new Float32Array(a.HEAPU8.buffer, O, P).slice();
              break;
            default:
              return null;
          }
          a._free(O);
          return d;
        }
        Xb = a.Malloc(Float32Array, 4);
        Ta = Xb.byteOffset;
        Wb = a.Malloc(Float32Array, 16);
        $a = Wb.byteOffset;
        Vb = a.Malloc(Float32Array, 9);
        Na = Vb.byteOffset;
        Ac = a.Malloc(Float32Array, 12);
        Yb = Ac.byteOffset;
        Bc = a.Malloc(Float32Array, 12);
        Cc = Bc.byteOffset;
        Ba = a.Malloc(Float32Array, 4);
        ja = Ba.byteOffset;
        xc = a.Malloc(Float32Array, 4);
        Oa = xc.byteOffset;
        yc = a.Malloc(Float32Array, 3);
        Zb = yc.byteOffset;
        zc = a.Malloc(Float32Array, 3);
        $b = zc.byteOffset;
        yb = a.Malloc(Int32Array, 4);
        ib = yb.byteOffset;
        a.ColorSpace.SRGB = a.ColorSpace._MakeSRGB();
        a.ColorSpace.DISPLAY_P3 = a.ColorSpace._MakeDisplayP3();
        a.ColorSpace.ADOBE_RGB = a.ColorSpace._MakeAdobeRGB();
        a.GlyphRunFlags = {
          IsWhiteSpace: a._GlyphRunFlags_isWhiteSpace
        };
        a.Path.MakeFromCmds = function (d) {
          var g = v(d, "HEAPF32"),
            l = a.Path._MakeFromCmds(g, d.length);
          q(g, d);
          return l;
        };
        a.Path.MakeFromVerbsPointsWeights = function (d, g, l) {
          var t = v(d, "HEAPU8"),
            x = v(g, "HEAPF32"),
            C = v(l, "HEAPF32"),
            J = a.Path._MakeFromVerbsPointsWeights(
              t,
              d.length,
              x,
              g.length,
              C,
              (l && l.length) || 0
            );
          q(t, d);
          q(x, g);
          q(C, l);
          return J;
        };
        a.Path.prototype.addArc = function (d, g, l) {
          d = S(d);
          this._addArc(d, g, l);
          return this;
        };
        a.Path.prototype.addCircle = function (d, g, l, t) {
          this._addCircle(d, g, l, !!t);
          return this;
        };
        a.Path.prototype.addOval = function (d, g, l) {
          void 0 === l && (l = 1);
          d = S(d);
          this._addOval(d, !!g, l);
          return this;
        };
        a.Path.prototype.addPath = function () {
          var d = Array.prototype.slice.call(arguments),
            g = d[0],
            l = !1;
          "boolean" === typeof d[d.length - 1] && (l = d.pop());
          if (1 === d.length) this._addPath(g, 1, 0, 0, 0, 1, 0, 0, 0, 1, l);
          else if (2 === d.length)
            (d = d[1]),
            this._addPath(
              g,
              d[0],
              d[1],
              d[2],
              d[3],
              d[4],
              d[5],
              d[6] || 0,
              d[7] || 0,
              d[8] || 1,
              l
            );
          else if (7 === d.length || 10 === d.length)
            this._addPath(
              g,
              d[1],
              d[2],
              d[3],
              d[4],
              d[5],
              d[6],
              d[7] || 0,
              d[8] || 0,
              d[9] || 1,
              l
            );
          else return null;
          return this;
        };
        a.Path.prototype.addPoly = function (d, g) {
          var l = v(d, "HEAPF32");
          this._addPoly(l, d.length / 2, g);
          q(l, d);
          return this;
        };
        a.Path.prototype.addRect = function (d, g) {
          d = S(d);
          this._addRect(d, !!g);
          return this;
        };
        a.Path.prototype.addRRect = function (d, g) {
          d = pa(d);
          this._addRRect(d, !!g);
          return this;
        };
        a.Path.prototype.addVerbsPointsWeights = function (d, g, l) {
          var t = v(d, "HEAPU8"),
            x = v(g, "HEAPF32"),
            C = v(l, "HEAPF32");
          this._addVerbsPointsWeights(
            t,
            d.length,
            x,
            g.length,
            C,
            (l && l.length) || 0
          );
          q(t, d);
          q(x, g);
          q(C, l);
        };
        a.Path.prototype.arc = function (d, g, l, t, x, C) {
          d = a.LTRBRect(d - l, g - l, d + l, g + l);
          x = ((x - t) / Math.PI) * 180 - 360 * !!C;
          C = new a.Path();
          C.addArc(d, (t / Math.PI) * 180, x);
          this.addPath(C, !0);
          C.delete();
          return this;
        };
        a.Path.prototype.arcToOval = function (d, g, l, t) {
          d = S(d);
          this._arcToOval(d, g, l, t);
          return this;
        };
        a.Path.prototype.arcToRotated = function (d, g, l, t, x, C, J) {
          this._arcToRotated(d, g, l, !!t, !!x, C, J);
          return this;
        };
        a.Path.prototype.arcToTangent = function (d, g, l, t, x) {
          this._arcToTangent(d, g, l, t, x);
          return this;
        };
        a.Path.prototype.close = function () {
          this._close();
          return this;
        };
        a.Path.prototype.conicTo = function (d, g, l, t, x) {
          this._conicTo(d, g, l, t, x);
          return this;
        };
        a.Path.prototype.computeTightBounds = function (d) {
          this._computeTightBounds(ja);
          var g = Ba.toTypedArray();
          return d ? (d.set(g), d) : g.slice();
        };
        a.Path.prototype.cubicTo = function (d, g, l, t, x, C) {
          this._cubicTo(d, g, l, t, x, C);
          return this;
        };
        a.Path.prototype.dash = function (d, g, l) {
          return this._dash(d, g, l) ? this : null;
        };
        a.Path.prototype.getBounds = function (d) {
          this._getBounds(ja);
          var g = Ba.toTypedArray();
          return d ? (d.set(g), d) : g.slice();
        };
        a.Path.prototype.lineTo = function (d, g) {
          this._lineTo(d, g);
          return this;
        };
        a.Path.prototype.moveTo = function (d, g) {
          this._moveTo(d, g);
          return this;
        };
        a.Path.prototype.offset = function (d, g) {
          this._transform(1, 0, d, 0, 1, g, 0, 0, 1);
          return this;
        };
        a.Path.prototype.quadTo = function (d, g, l, t) {
          this._quadTo(d, g, l, t);
          return this;
        };
        a.Path.prototype.rArcTo = function (d, g, l, t, x, C, J) {
          this._rArcTo(d, g, l, t, x, C, J);
          return this;
        };
        a.Path.prototype.rConicTo = function (d, g, l, t, x) {
          this._rConicTo(d, g, l, t, x);
          return this;
        };
        a.Path.prototype.rCubicTo = function (d, g, l, t, x, C) {
          this._rCubicTo(d, g, l, t, x, C);
          return this;
        };
        a.Path.prototype.rLineTo = function (d, g) {
          this._rLineTo(d, g);
          return this;
        };
        a.Path.prototype.rMoveTo = function (d, g) {
          this._rMoveTo(d, g);
          return this;
        };
        a.Path.prototype.rQuadTo = function (d, g, l, t) {
          this._rQuadTo(d, g, l, t);
          return this;
        };
        a.Path.prototype.stroke = function (d) {
          d = d || {};
          d.width = d.width || 1;
          d.miter_limit = d.miter_limit || 4;
          d.cap = d.cap || a.StrokeCap.Butt;
          d.join = d.join || a.StrokeJoin.Miter;
          d.precision = d.precision || 1;
          return this._stroke(d) ? this : null;
        };
        a.Path.prototype.transform = function () {
          if (1 === arguments.length) {
            var d = arguments[0];
            this._transform(
              d[0],
              d[1],
              d[2],
              d[3],
              d[4],
              d[5],
              d[6] || 0,
              d[7] || 0,
              d[8] || 1
            );
          } else if (6 === arguments.length || 9 === arguments.length)
            (d = arguments),
            this._transform(
              d[0],
              d[1],
              d[2],
              d[3],
              d[4],
              d[5],
              d[6] || 0,
              d[7] || 0,
              d[8] || 1
            );
          else
            throw (
              "transform expected to take 1 or 9 arguments. Got " +
              arguments.length
            );
          return this;
        };
        a.Path.prototype.trim = function (d, g, l) {
          return this._trim(d, g, !!l) ? this : null;
        };
        a.Image.prototype.encodeToBytes = function (d, g) {
          var l = a.Re();
          d = d || a.ImageFormat.PNG;
          g = g || 100;
          return l ? this._encodeToBytes(d, g, l) : this._encodeToBytes(d, g);
        };
        a.Image.prototype.makeShaderCubic = function (d, g, l, t, x) {
          x = I(x);
          return this._makeShaderCubic(d, g, l, t, x);
        };
        a.Image.prototype.makeShaderOptions = function (d, g, l, t, x) {
          x = I(x);
          return this._makeShaderOptions(d, g, l, t, x);
        };
        a.Image.prototype.readPixels = function (d, g, l, t, x) {
          var C = a.Re();
          return e(this, d, g, l, t, x, C);
        };
        a.Canvas.prototype.clear = function (d) {
          a.Kd(this.Id);
          d = y(d);
          this._clear(d);
        };
        a.Canvas.prototype.clipRRect = function (d, g, l) {
          a.Kd(this.Id);
          d = pa(d);
          this._clipRRect(d, g, l);
        };
        a.Canvas.prototype.clipRect = function (d, g, l) {
          a.Kd(this.Id);
          d = S(d);
          this._clipRect(d, g, l);
        };
        a.Canvas.prototype.concat = function (d) {
          a.Kd(this.Id);
          d = L(d);
          this._concat(d);
        };
        a.Canvas.prototype.drawArc = function (d, g, l, t, x) {
          a.Kd(this.Id);
          d = S(d);
          this._drawArc(d, g, l, t, x);
        };
        a.Canvas.prototype.drawAtlas = function (d, g, l, t, x, C, J) {
          if (d && t && g && l && g.length === l.length) {
            a.Kd(this.Id);
            x || (x = a.BlendMode.SrcOver);
            var P = v(g, "HEAPF32"),
              O = v(l, "HEAPF32"),
              Y = l.length / 4,
              aa = v(m(C), "HEAPU32");
            if (J && "B" in J && "C" in J)
              this._drawAtlasCubic(d, O, P, aa, Y, x, J.B, J.C, t);
            else {
              let r = a.FilterMode.Linear,
                D = a.MipmapMode.None;
              J && ((r = J.filter), "mipmap" in J && (D = J.mipmap));
              this._drawAtlasOptions(d, O, P, aa, Y, x, r, D, t);
            }
            q(P, g);
            q(O, l);
            q(aa, C);
          }
        };
        a.Canvas.prototype.drawCircle = function (d, g, l, t) {
          a.Kd(this.Id);
          this._drawCircle(d, g, l, t);
        };
        a.Canvas.prototype.drawColor = function (d, g) {
          a.Kd(this.Id);
          d = y(d);
          void 0 !== g ? this._drawColor(d, g) : this._drawColor(d);
        };
        a.Canvas.prototype.drawColorInt = function (d, g) {
          a.Kd(this.Id);
          this._drawColorInt(d, g || a.BlendMode.SrcOver);
        };
        a.Canvas.prototype.drawColorComponents = function (d, g, l, t, x) {
          a.Kd(this.Id);
          d = N(d, g, l, t);
          void 0 !== x ? this._drawColor(d, x) : this._drawColor(d);
        };
        a.Canvas.prototype.drawDRRect = function (d, g, l) {
          a.Kd(this.Id);
          d = pa(d, Yb);
          g = pa(g, Cc);
          this._drawDRRect(d, g, l);
        };
        a.Canvas.prototype.drawImage = function (d, g, l, t) {
          a.Kd(this.Id);
          this._drawImage(d, g, l, t || null);
        };
        a.Canvas.prototype.drawImageCubic = function (d, g, l, t, x, C) {
          a.Kd(this.Id);
          this._drawImageCubic(d, g, l, t, x, C || null);
        };
        a.Canvas.prototype.drawImageOptions = function (d, g, l, t, x, C) {
          a.Kd(this.Id);
          this._drawImageOptions(d, g, l, t, x, C || null);
        };
        a.Canvas.prototype.drawImageNine = function (d, g, l, t, x) {
          a.Kd(this.Id);
          g = v(g, "HEAP32", ib);
          l = S(l);
          this._drawImageNine(d, g, l, t, x || null);
        };
        a.Canvas.prototype.drawImageRect = function (d, g, l, t, x) {
          a.Kd(this.Id);
          S(g, ja);
          S(l, Oa);
          this._drawImageRect(d, ja, Oa, t, !!x);
        };
        a.Canvas.prototype.drawImageRectCubic = function (d, g, l, t, x, C) {
          a.Kd(this.Id);
          S(g, ja);
          S(l, Oa);
          this._drawImageRectCubic(d, ja, Oa, t, x, C || null);
        };
        a.Canvas.prototype.drawImageRectOptions = function (d, g, l, t, x, C) {
          a.Kd(this.Id);
          S(g, ja);
          S(l, Oa);
          this._drawImageRectOptions(d, ja, Oa, t, x, C || null);
        };
        a.Canvas.prototype.drawLine = function (d, g, l, t, x) {
          a.Kd(this.Id);
          this._drawLine(d, g, l, t, x);
        };
        a.Canvas.prototype.drawOval = function (d, g) {
          a.Kd(this.Id);
          d = S(d);
          this._drawOval(d, g);
        };
        a.Canvas.prototype.drawPaint = function (d) {
          a.Kd(this.Id);
          this._drawPaint(d);
        };
        a.Canvas.prototype.drawParagraph = function (d, g, l) {
          a.Kd(this.Id);
          this._drawParagraph(d, g, l);
        };
        a.Canvas.prototype.drawPatch = function (d, g, l, t, x) {
          if (24 > d.length) throw "Need 12 cubic points";
          if (g && 4 > g.length) throw "Need 4 colors";
          if (l && 8 > l.length) throw "Need 4 shader coordinates";
          a.Kd(this.Id);
          const C = v(d, "HEAPF32"),
            J = g ? v(m(g), "HEAPU32") : W,
            P = l ? v(l, "HEAPF32") : W;
          t || (t = a.BlendMode.Modulate);
          this._drawPatch(C, J, P, t, x);
          q(P, l);
          q(J, g);
          q(C, d);
        };
        a.Canvas.prototype.drawPath = function (d, g) {
          a.Kd(this.Id);
          this._drawPath(d, g);
        };
        a.Canvas.prototype.drawPicture = function (d) {
          a.Kd(this.Id);
          this._drawPicture(d);
        };
        a.Canvas.prototype.drawPoints = function (d, g, l) {
          a.Kd(this.Id);
          var t = v(g, "HEAPF32");
          this._drawPoints(d, t, g.length / 2, l);
          q(t, g);
        };
        a.Canvas.prototype.drawRRect = function (d, g) {
          a.Kd(this.Id);
          d = pa(d);
          this._drawRRect(d, g);
        };
        a.Canvas.prototype.drawRect = function (d, g) {
          a.Kd(this.Id);
          d = S(d);
          this._drawRect(d, g);
        };
        a.Canvas.prototype.drawRect4f = function (d, g, l, t, x) {
          a.Kd(this.Id);
          this._drawRect4f(d, g, l, t, x);
        };
        a.Canvas.prototype.drawShadow = function (d, g, l, t, x, C, J) {
          a.Kd(this.Id);
          var P = v(x, "HEAPF32"),
            O = v(C, "HEAPF32");
          g = v(g, "HEAPF32", Zb);
          l = v(l, "HEAPF32", $b);
          this._drawShadow(d, g, l, t, P, O, J);
          q(P, x);
          q(O, C);
        };
        a.getShadowLocalBounds = function (d, g, l, t, x, C, J) {
          d = I(d);
          l = v(l, "HEAPF32", Zb);
          t = v(t, "HEAPF32", $b);
          if (!this._getShadowLocalBounds(d, g, l, t, x, C, ja)) return null;
          g = Ba.toTypedArray();
          return J ? (J.set(g), J) : g.slice();
        };
        a.Canvas.prototype.drawTextBlob = function (d, g, l, t) {
          a.Kd(this.Id);
          this._drawTextBlob(d, g, l, t);
        };
        a.Canvas.prototype.drawVertices = function (d, g, l) {
          a.Kd(this.Id);
          this._drawVertices(d, g, l);
        };
        a.Canvas.prototype.getDeviceClipBounds = function (d) {
          this._getDeviceClipBounds(ib);
          var g = yb.toTypedArray();
          d ? d.set(g) : (d = g.slice());
          return d;
        };
        a.Canvas.prototype.getLocalToDevice = function () {
          this._getLocalToDevice($a);
          for (var d = $a, g = Array(16), l = 0; 16 > l; l++)
            g[l] = a.HEAPF32[d / 4 + l];
          return g;
        };
        a.Canvas.prototype.getTotalMatrix = function () {
          this._getTotalMatrix(Na);
          for (var d = Array(9), g = 0; 9 > g; g++)
            d[g] = a.HEAPF32[Na / 4 + g];
          return d;
        };
        a.Canvas.prototype.makeSurface = function (d) {
          d = this._makeSurface(d);
          d.Id = this.Id;
          return d;
        };
        a.Canvas.prototype.readPixels = function (d, g, l, t, x) {
          a.Kd(this.Id);
          return e(this, d, g, l, t, x);
        };
        a.Canvas.prototype.saveLayer = function (d, g, l, t) {
          g = S(g);
          return this._saveLayer(d || null, g, l || null, t || 0);
        };
        a.Canvas.prototype.writePixels = function (d, g, l, t, x, C, J, P) {
          if (d.byteLength % (g * l))
            throw "pixels length must be a multiple of the srcWidth * srcHeight";
          a.Kd(this.Id);
          var O = d.byteLength / (g * l);
          C = C || a.AlphaType.Unpremul;
          J = J || a.ColorType.RGBA_8888;
          P = P || a.ColorSpace.SRGB;
          var Y = O * g;
          O = v(d, "HEAPU8");
          g = this._writePixels({
              width: g,
              height: l,
              colorType: J,
              alphaType: C,
              colorSpace: P
            },
            O,
            Y,
            t,
            x
          );
          q(O, d);
          return g;
        };
        a.ColorFilter.MakeBlend = function (d, g, l) {
          d = y(d);
          l = l || a.ColorSpace.SRGB;
          return a.ColorFilter._MakeBlend(d, g, l);
        };
        a.ColorFilter.MakeMatrix = function (d) {
          if (!d || 20 !== d.length) throw "invalid color matrix";
          var g = v(d, "HEAPF32"),
            l = a.ColorFilter._makeMatrix(g);
          q(g, d);
          return l;
        };
        a.ContourMeasure.prototype.getPosTan = function (d, g) {
          this._getPosTan(d, ja);
          d = Ba.toTypedArray();
          return g ? (g.set(d), g) : d.slice();
        };
        a.ImageFilter.prototype.getOutputBounds = function (d, g, l) {
          d = S(d, ja);
          g = I(g);
          this._getOutputBounds(d, g, ib);
          g = yb.toTypedArray();
          return l ? (l.set(g), l) : g.slice();
        };
        a.ImageFilter.MakeDropShadow = function (d, g, l, t, x, C) {
          x = y(x, Ta);
          return a.ImageFilter._MakeDropShadow(d, g, l, t, x, C);
        };
        a.ImageFilter.MakeDropShadowOnly = function (d, g, l, t, x, C) {
          x = y(x, Ta);
          return a.ImageFilter._MakeDropShadowOnly(d, g, l, t, x, C);
        };
        a.ImageFilter.MakeImage = function (d, g, l, t) {
          l = S(l, ja);
          t = S(t, Oa);
          if ("B" in g && "C" in g)
            return a.ImageFilter._MakeImageCubic(d, g.B, g.C, l, t);
          const x = g.filter;
          let C = a.MipmapMode.None;
          "mipmap" in g && (C = g.mipmap);
          return a.ImageFilter._MakeImageOptions(d, x, C, l, t);
        };
        a.ImageFilter.MakeMatrixTransform = function (d, g, l) {
          d = I(d);
          if ("B" in g && "C" in g)
            return a.ImageFilter._MakeMatrixTransformCubic(d, g.B, g.C, l);
          const t = g.filter;
          let x = a.MipmapMode.None;
          "mipmap" in g && (x = g.mipmap);
          return a.ImageFilter._MakeMatrixTransformOptions(d, t, x, l);
        };
        a.Paint.prototype.getColor = function () {
          this._getColor(Ta);
          return T(Ta);
        };
        a.Paint.prototype.setColor = function (d, g) {
          g = g || null;
          d = y(d);
          this._setColor(d, g);
        };
        a.Paint.prototype.setColorComponents = function (d, g, l, t, x) {
          x = x || null;
          d = N(d, g, l, t);
          this._setColor(d, x);
        };
        a.Path.prototype.getPoint = function (d, g) {
          this._getPoint(d, ja);
          d = Ba.toTypedArray();
          return g ? ((g[0] = d[0]), (g[1] = d[1]), g) : d.slice(0, 2);
        };
        a.Picture.prototype.makeShader = function (d, g, l, t, x) {
          t = I(t);
          x = S(x);
          return this._makeShader(d, g, l, t, x);
        };
        a.Picture.prototype.cullRect = function (d) {
          this._cullRect(ja);
          var g = Ba.toTypedArray();
          return d ? (d.set(g), d) : g.slice();
        };
        a.PictureRecorder.prototype.beginRecording = function (d, g) {
          d = S(d);
          return this._beginRecording(d, !!g);
        };
        a.Surface.prototype.getCanvas = function () {
          var d = this._getCanvas();
          d.Id = this.Id;
          return d;
        };
        a.Surface.prototype.makeImageSnapshot = function (d) {
          a.Kd(this.Id);
          d = v(d, "HEAP32", ib);
          return this._makeImageSnapshot(d);
        };
        a.Surface.prototype.makeSurface = function (d) {
          a.Kd(this.Id);
          d = this._makeSurface(d);
          d.Id = this.Id;
          return d;
        };
        a.Surface.prototype.Ef = function (d, g) {
          this.Fe || (this.Fe = this.getCanvas());
          return requestAnimationFrame(
            function () {
              a.Kd(this.Id);
              d(this.Fe);
              this.flush(g);
            }.bind(this)
          );
        };
        a.Surface.prototype.requestAnimationFrame ||
          (a.Surface.prototype.requestAnimationFrame = a.Surface.prototype.Ef);
        a.Surface.prototype.Af = function (d, g) {
          this.Fe || (this.Fe = this.getCanvas());
          requestAnimationFrame(
            function () {
              a.Kd(this.Id);
              d(this.Fe);
              this.flush(g);
              this.dispose();
            }.bind(this)
          );
        };
        a.Surface.prototype.drawOnce ||
          (a.Surface.prototype.drawOnce = a.Surface.prototype.Af);
        a.PathEffect.MakeDash = function (d, g) {
          g || (g = 0);
          if (!d.length || 1 === d.length % 2)
            throw "Intervals array must have even length";
          var l = v(d, "HEAPF32");
          g = a.PathEffect._MakeDash(l, d.length, g);
          q(l, d);
          return g;
        };
        a.PathEffect.MakeLine2D = function (d, g) {
          g = I(g);
          return a.PathEffect._MakeLine2D(d, g);
        };
        a.PathEffect.MakePath2D = function (d, g) {
          d = I(d);
          return a.PathEffect._MakePath2D(d, g);
        };
        a.Shader.MakeColor = function (d, g) {
          g = g || null;
          d = y(d);
          return a.Shader._MakeColor(d, g);
        };
        a.Shader.Blend = a.Shader.MakeBlend;
        a.Shader.Color = a.Shader.MakeColor;
        a.Shader.MakeLinearGradient = function (d, g, l, t, x, C, J, P) {
          P = P || null;
          var O = E(l),
            Y = v(t, "HEAPF32");
          J = J || 0;
          C = I(C);
          var aa = Ba.toTypedArray();
          aa.set(d);
          aa.set(g, 2);
          d = a.Shader._MakeLinearGradient(
            ja,
            O.$d,
            O.colorType,
            Y,
            O.count,
            x,
            J,
            C,
            P
          );
          q(O.$d, l);
          t && q(Y, t);
          return d;
        };
        a.Shader.MakeRadialGradient = function (d, g, l, t, x, C, J, P) {
          P = P || null;
          var O = E(l),
            Y = v(t, "HEAPF32");
          J = J || 0;
          C = I(C);
          d = a.Shader._MakeRadialGradient(
            d[0],
            d[1],
            g,
            O.$d,
            O.colorType,
            Y,
            O.count,
            x,
            J,
            C,
            P
          );
          q(O.$d, l);
          t && q(Y, t);
          return d;
        };
        a.Shader.MakeSweepGradient = function (d, g, l, t, x, C, J, P, O, Y) {
          Y = Y || null;
          var aa = E(l),
            r = v(t, "HEAPF32");
          J = J || 0;
          P = P || 0;
          O = O || 360;
          C = I(C);
          d = a.Shader._MakeSweepGradient(
            d,
            g,
            aa.$d,
            aa.colorType,
            r,
            aa.count,
            x,
            P,
            O,
            J,
            C,
            Y
          );
          q(aa.$d, l);
          t && q(r, t);
          return d;
        };
        a.Shader.MakeTwoPointConicalGradient = function (
          d,
          g,
          l,
          t,
          x,
          C,
          J,
          P,
          O,
          Y
        ) {
          Y = Y || null;
          var aa = E(x),
            r = v(C, "HEAPF32");
          O = O || 0;
          P = I(P);
          var D = Ba.toTypedArray();
          D.set(d);
          D.set(l, 2);
          d = a.Shader._MakeTwoPointConicalGradient(
            ja,
            g,
            t,
            aa.$d,
            aa.colorType,
            r,
            aa.count,
            J,
            O,
            P,
            Y
          );
          q(aa.$d, x);
          C && q(r, C);
          return d;
        };
        a.Vertices.prototype.bounds = function (d) {
          this._bounds(ja);
          var g = Ba.toTypedArray();
          return d ? (d.set(g), d) : g.slice();
        };
        a.Rd &&
          a.Rd.forEach(function (d) {
            d();
          });
      };
      a.computeTonalColors = function (e) {
        var d = v(e.ambient, "HEAPF32"),
          g = v(e.spot, "HEAPF32");
        this._computeTonalColors(d, g);
        var l = {
          ambient: T(d),
          spot: T(g)
        };
        q(d, e.ambient);
        q(g, e.spot);
        return l;
      };
      a.LTRBRect = function (e, d, g, l) {
        return Float32Array.of(e, d, g, l);
      };
      a.XYWHRect = function (e, d, g, l) {
        return Float32Array.of(e, d, e + g, d + l);
      };
      a.LTRBiRect = function (e, d, g, l) {
        return Int32Array.of(e, d, g, l);
      };
      a.XYWHiRect = function (e, d, g, l) {
        return Int32Array.of(e, d, e + g, d + l);
      };
      a.RRectXY = function (e, d, g) {
        return Float32Array.of(e[0], e[1], e[2], e[3], d, g, d, g, d, g, d, g);
      };
      a.MakeAnimatedImageFromEncoded = function (e) {
        e = new Uint8Array(e);
        if (e[0] === 1 && e[1] === 6 && e[2] === 0 && e[3] === 7) {
          const imageIndex = (e[4] << 24) | (e[5] << 16) | (e[6] << 8) | e[7];
          const image = getApp()._flutter.imageCache[imageIndex];
          if (image && image.width > 0 && image.height > 0) {
            try {
              const skimage = a.MakeLazyImageFromTextureSource(image);
              const animatedImage = {
                delete: () => {},
                getFrameCount: () => 1,
                getRepetitionCount: () => 1,
                currentFrameDuration: () => 1000,
                getCurrentFrame: () => skimage,
                makeImageAtCurrentFrame: () => skimage,
                decodeNextFrame: () => -1,
              };
              getApp()._flutter.imageCache[imageIndex] = undefined;
              return animatedImage;
            } catch (error) {
              console.error(error);
            }
          }
        }
        var d = a._malloc(e.byteLength);
        a.HEAPU8.set(e, d);
        const eee = (e = a._decodeAnimatedImage(d, e.byteLength)) ? e : null;
        return eee;
      };
      a.MakeImageFromEncoded = function (e) {
        e = new Uint8Array(e);
        var d = a._malloc(e.byteLength);
        a.HEAPU8.set(e, d);
        return (e = a._decodeImage(d, e.byteLength)) ? e : null;
      };
      var jb = null;
      a.MakeImageFromCanvasImageSource = function (e) {
        var d = e.width,
          g = e.height;
        jb || (jb = document.createElement("canvas"));
        jb.width = d;
        jb.height = g;
        var l = jb.getContext("2d", {
          willReadFrequently: !0
        });
        l.drawImage(e, 0, 0);
        e = l.getImageData(0, 0, d, g);
        return a.MakeImage({
            width: d,
            height: g,
            alphaType: a.AlphaType.Unpremul,
            colorType: a.ColorType.RGBA_8888,
            colorSpace: a.ColorSpace.SRGB,
          },
          e.data,
          4 * d
        );
      };
      a.MakeImage = function (e, d, g) {
        var l = a._malloc(d.length);
        a.HEAPU8.set(d, l);
        return a._MakeImage(e, l, d.length, g);
      };
      a.MakeVertices = function (e, d, g, l, t, x) {
        var C = (t && t.length) || 0,
          J = 0;
        g && g.length && (J |= 1);
        l && l.length && (J |= 2);
        void 0 === x || x || (J |= 4);
        e = new a._VerticesBuilder(e, d.length / 2, C, J);
        v(d, "HEAPF32", e.positions());
        e.texCoords() && v(g, "HEAPF32", e.texCoords());
        e.colors() && v(m(l), "HEAPU32", e.colors());
        e.indices() && v(t, "HEAPU16", e.indices());
        return e.detach();
      };
      a.Matrix = {};
      a.Matrix.identity = function () {
        return c(3);
      };
      a.Matrix.invert = function (e) {
        var d =
          e[0] * e[4] * e[8] +
          e[1] * e[5] * e[6] +
          e[2] * e[3] * e[7] -
          e[2] * e[4] * e[6] -
          e[1] * e[3] * e[8] -
          e[0] * e[5] * e[7];
        return d ?
          [
            (e[4] * e[8] - e[5] * e[7]) / d,
            (e[2] * e[7] - e[1] * e[8]) / d,
            (e[1] * e[5] - e[2] * e[4]) / d,
            (e[5] * e[6] - e[3] * e[8]) / d,
            (e[0] * e[8] - e[2] * e[6]) / d,
            (e[2] * e[3] - e[0] * e[5]) / d,
            (e[3] * e[7] - e[4] * e[6]) / d,
            (e[1] * e[6] - e[0] * e[7]) / d,
            (e[0] * e[4] - e[1] * e[3]) / d,
          ] :
          null;
      };
      a.Matrix.mapPoints = function (e, d) {
        for (var g = 0; g < d.length; g += 2) {
          var l = d[g],
            t = d[g + 1],
            x = e[6] * l + e[7] * t + e[8],
            C = e[3] * l + e[4] * t + e[5];
          d[g] = (e[0] * l + e[1] * t + e[2]) / x;
          d[g + 1] = C / x;
        }
        return d;
      };
      a.Matrix.multiply = function () {
        return hb(3, arguments);
      };
      a.Matrix.rotated = function (e, d, g) {
        d = d || 0;
        g = g || 0;
        var l = Math.sin(e);
        e = Math.cos(e);
        return [e, -l, la(l, g, 1 - e, d), l, e, la(-l, d, 1 - e, g), 0, 0, 1];
      };
      a.Matrix.scaled = function (e, d, g, l) {
        g = g || 0;
        l = l || 0;
        var t = b([e, d], c(3), 3, 0, 1);
        return b([g - e * g, l - d * l], t, 3, 2, 0);
      };
      a.Matrix.skewed = function (e, d, g, l) {
        g = g || 0;
        l = l || 0;
        var t = b([e, d], c(3), 3, 1, -1);
        return b([-e * g, -d * l], t, 3, 2, 0);
      };
      a.Matrix.translated = function (e, d) {
        return b(arguments, c(3), 3, 2, 0);
      };
      a.Vector = {};
      a.Vector.dot = function (e, d) {
        return e
          .map(function (g, l) {
            return g * d[l];
          })
          .reduce(function (g, l) {
            return g + l;
          });
      };
      a.Vector.lengthSquared = function (e) {
        return a.Vector.dot(e, e);
      };
      a.Vector.length = function (e) {
        return Math.sqrt(a.Vector.lengthSquared(e));
      };
      a.Vector.mulScalar = function (e, d) {
        return e.map(function (g) {
          return g * d;
        });
      };
      a.Vector.add = function (e, d) {
        return e.map(function (g, l) {
          return g + d[l];
        });
      };
      a.Vector.sub = function (e, d) {
        return e.map(function (g, l) {
          return g - d[l];
        });
      };
      a.Vector.dist = function (e, d) {
        return a.Vector.length(a.Vector.sub(e, d));
      };
      a.Vector.normalize = function (e) {
        return a.Vector.mulScalar(e, 1 / a.Vector.length(e));
      };
      a.Vector.cross = function (e, d) {
        return [
          e[1] * d[2] - e[2] * d[1],
          e[2] * d[0] - e[0] * d[2],
          e[0] * d[1] - e[1] * d[0],
        ];
      };
      a.M44 = {};
      a.M44.identity = function () {
        return c(4);
      };
      a.M44.translated = function (e) {
        return b(e, c(4), 4, 3, 0);
      };
      a.M44.scaled = function (e) {
        return b(e, c(4), 4, 0, 1);
      };
      a.M44.rotated = function (e, d) {
        return a.M44.rotatedUnitSinCos(
          a.Vector.normalize(e),
          Math.sin(d),
          Math.cos(d)
        );
      };
      a.M44.rotatedUnitSinCos = function (e, d, g) {
        var l = e[0],
          t = e[1];
        e = e[2];
        var x = 1 - g;
        return [
          x * l * l + g,
          x * l * t - d * e,
          x * l * e + d * t,
          0,
          x * l * t + d * e,
          x * t * t + g,
          x * t * e - d * l,
          0,
          x * l * e - d * t,
          x * t * e + d * l,
          x * e * e + g,
          0,
          0,
          0,
          0,
          1,
        ];
      };
      a.M44.lookat = function (e, d, g) {
        d = a.Vector.normalize(a.Vector.sub(d, e));
        g = a.Vector.normalize(g);
        g = a.Vector.normalize(a.Vector.cross(d, g));
        var l = a.M44.identity();
        b(g, l, 4, 0, 0);
        b(a.Vector.cross(g, d), l, 4, 1, 0);
        b(a.Vector.mulScalar(d, -1), l, 4, 2, 0);
        b(e, l, 4, 3, 0);
        e = a.M44.invert(l);
        return null === e ? a.M44.identity() : e;
      };
      a.M44.perspective = function (e, d, g) {
        var l = 1 / (d - e);
        g /= 2;
        g = Math.cos(g) / Math.sin(g);
        return [
          g,
          0,
          0,
          0,
          0,
          g,
          0,
          0,
          0,
          0,
          (d + e) * l,
          2 * d * e * l,
          0,
          0,
          -1,
          1,
        ];
      };
      a.M44.rc = function (e, d, g) {
        return e[4 * d + g];
      };
      a.M44.multiply = function () {
        return hb(4, arguments);
      };
      a.M44.invert = function (e) {
        var d = e[0],
          g = e[4],
          l = e[8],
          t = e[12],
          x = e[1],
          C = e[5],
          J = e[9],
          P = e[13],
          O = e[2],
          Y = e[6],
          aa = e[10],
          r = e[14],
          D = e[3],
          U = e[7],
          ca = e[11];
        e = e[15];
        var ka = d * C - g * x,
          va = d * J - l * x,
          wa = d * P - t * x,
          ma = g * J - l * C,
          G = g * P - t * C,
          k = l * P - t * J,
          p = O * U - Y * D,
          z = O * ca - aa * D,
          B = O * e - r * D,
          F = Y * ca - aa * U,
          H = Y * e - r * U,
          M = aa * e - r * ca,
          da = ka * M - va * H + wa * F + ma * B - G * z + k * p,
          ea = 1 / da;
        if (0 === da || Infinity === ea) return null;
        ka *= ea;
        va *= ea;
        wa *= ea;
        ma *= ea;
        G *= ea;
        k *= ea;
        p *= ea;
        z *= ea;
        B *= ea;
        F *= ea;
        H *= ea;
        M *= ea;
        d = [
          C * M - J * H + P * F,
          J * B - x * M - P * z,
          x * H - C * B + P * p,
          C * z - x * F - J * p,
          l * H - g * M - t * F,
          d * M - l * B + t * z,
          g * B - d * H - t * p,
          d * F - g * z + l * p,
          U * k - ca * G + e * ma,
          ca * wa - D * k - e * va,
          D * G - U * wa + e * ka,
          U * va - D * ma - ca * ka,
          aa * G - Y * k - r * ma,
          O * k - aa * wa + r * va,
          Y * wa - O * G - r * ka,
          O * ma - Y * va + aa * ka,
        ];
        return d.every(function (Ia) {
            return !isNaN(Ia) && Infinity !== Ia && -Infinity !== Ia;
          }) ?
          d :
          null;
      };
      a.M44.transpose = function (e) {
        return [
          e[0],
          e[4],
          e[8],
          e[12],
          e[1],
          e[5],
          e[9],
          e[13],
          e[2],
          e[6],
          e[10],
          e[14],
          e[3],
          e[7],
          e[11],
          e[15],
        ];
      };
      a.M44.mustInvert = function (e) {
        e = a.M44.invert(e);
        if (null === e) throw "Matrix not invertible";
        return e;
      };
      a.M44.setupCamera = function (e, d, g) {
        var l = a.M44.lookat(g.eye, g.coa, g.up);
        g = a.M44.perspective(g.near, g.far, g.angle);
        d = [(e[2] - e[0]) / 2, (e[3] - e[1]) / 2, d];
        e = a.M44.multiply(
          a.M44.translated([(e[0] + e[2]) / 2, (e[1] + e[3]) / 2, 0]),
          a.M44.scaled(d)
        );
        return a.M44.multiply(e, g, l, a.M44.mustInvert(e));
      };
      a.ColorMatrix = {};
      a.ColorMatrix.identity = function () {
        var e = new Float32Array(20);
        e[0] = 1;
        e[6] = 1;
        e[12] = 1;
        e[18] = 1;
        return e;
      };
      a.ColorMatrix.scaled = function (e, d, g, l) {
        var t = new Float32Array(20);
        t[0] = e;
        t[6] = d;
        t[12] = g;
        t[18] = l;
        return t;
      };
      var xd = [
        [6, 7, 11, 12],
        [0, 10, 2, 12],
        [0, 1, 5, 6],
      ];
      a.ColorMatrix.rotated = function (e, d, g) {
        var l = a.ColorMatrix.identity();
        e = xd[e];
        l[e[0]] = g;
        l[e[1]] = d;
        l[e[2]] = -d;
        l[e[3]] = g;
        return l;
      };
      a.ColorMatrix.postTranslate = function (e, d, g, l, t) {
        e[4] += d;
        e[9] += g;
        e[14] += l;
        e[19] += t;
        return e;
      };
      a.ColorMatrix.concat = function (e, d) {
        for (var g = new Float32Array(20), l = 0, t = 0; 20 > t; t += 5) {
          for (var x = 0; 4 > x; x++)
            g[l++] =
            e[t] * d[x] +
            e[t + 1] * d[x + 5] +
            e[t + 2] * d[x + 10] +
            e[t + 3] * d[x + 15];
          g[l++] =
            e[t] * d[4] +
            e[t + 1] * d[9] +
            e[t + 2] * d[14] +
            e[t + 3] * d[19] +
            e[t + 4];
        }
        return g;
      };
      (function (e) {
        e.Rd = e.Rd || [];
        e.Rd.push(function () {
          function d(r) {
            r &&
              (r.dir = 0 === r.dir ? e.TextDirection.RTL : e.TextDirection.LTR);
            return r;
          }

          function g(r) {
            if (!r || !r.length) return [];
            for (var D = [], U = 0; U < r.length; U += 5) {
              var ca = e.LTRBRect(r[U], r[U + 1], r[U + 2], r[U + 3]),
                ka = e.TextDirection.LTR;
              0 === r[U + 4] && (ka = e.TextDirection.RTL);
              D.push({
                rect: ca,
                dir: ka
              });
            }
            e._free(r.byteOffset);
            return D;
          }

          function l(r) {
            r = r || {};
            void 0 === r.weight && (r.weight = e.FontWeight.Normal);
            r.width = r.width || e.FontWidth.Normal;
            r.slant = r.slant || e.FontSlant.Upright;
            return r;
          }

          function t(r) {
            if (!r || !r.length) return W;
            for (var D = [], U = 0; U < r.length; U++) {
              var ca = x(r[U]);
              D.push(ca);
            }
            return v(D, "HEAPU32");
          }

          function x(r) {
            if (P[r]) return P[r];
            var D = ra(r) + 1,
              U = e._malloc(D);
            sa(r, K, U, D);
            return (P[r] = U);
          }

          function C(r) {
            r._colorPtr = y(r.color);
            r._foregroundColorPtr = W;
            r._backgroundColorPtr = W;
            r._decorationColorPtr = W;
            r.foregroundColor &&
              (r._foregroundColorPtr = y(r.foregroundColor, O));
            r.backgroundColor &&
              (r._backgroundColorPtr = y(r.backgroundColor, Y));
            r.decorationColor &&
              (r._decorationColorPtr = y(r.decorationColor, aa));
            Array.isArray(r.fontFamilies) && r.fontFamilies.length ?
              ((r._fontFamiliesPtr = t(r.fontFamilies)),
                (r._fontFamiliesLen = r.fontFamilies.length)) :
              ((r._fontFamiliesPtr = W), (r._fontFamiliesLen = 0));
            if (r.locale) {
              var D = r.locale;
              r._localePtr = x(D);
              r._localeLen = ra(D) + 1;
            } else(r._localePtr = W), (r._localeLen = 0);
            if (Array.isArray(r.shadows) && r.shadows.length) {
              D = r.shadows;
              var U = D.map(function (G) {
                  return G.color || e.BLACK;
                }),
                ca = D.map(function (G) {
                  return G.blurRadius || 0;
                });
              r._shadowLen = D.length;
              for (
                var ka = e._malloc(8 * D.length), va = ka / 4, wa = 0; wa < D.length; wa++
              ) {
                var ma = D[wa].offset || [0, 0];
                e.HEAPF32[va] = ma[0];
                e.HEAPF32[va + 1] = ma[1];
                va += 2;
              }
              r._shadowColorsPtr = E(U).$d;
              r._shadowOffsetsPtr = ka;
              r._shadowBlurRadiiPtr = v(ca, "HEAPF32");
            } else(r._shadowLen = 0), (r._shadowColorsPtr = W), (r._shadowOffsetsPtr = W), (r._shadowBlurRadiiPtr = W);
            Array.isArray(r.fontFeatures) && r.fontFeatures.length ?
              ((D = r.fontFeatures),
                (U = D.map(function (G) {
                  return G.name;
                })),
                (ca = D.map(function (G) {
                  return G.value;
                })),
                (r._fontFeatureLen = D.length),
                (r._fontFeatureNamesPtr = t(U)),
                (r._fontFeatureValuesPtr = v(ca, "HEAPU32"))) :
              ((r._fontFeatureLen = 0),
                (r._fontFeatureNamesPtr = W),
                (r._fontFeatureValuesPtr = W));
            Array.isArray(r.fontVariations) && r.fontVariations.length ?
              ((D = r.fontVariations),
                (U = D.map(function (G) {
                  return G.axis;
                })),
                (ca = D.map(function (G) {
                  return G.value;
                })),
                (r._fontVariationLen = D.length),
                (r._fontVariationAxesPtr = t(U)),
                (r._fontVariationValuesPtr = v(ca, "HEAPF32"))) :
              ((r._fontVariationLen = 0),
                (r._fontVariationAxesPtr = W),
                (r._fontVariationValuesPtr = W));
          }

          function J(r) {
            e._free(r._fontFamiliesPtr);
            e._free(r._shadowColorsPtr);
            e._free(r._shadowOffsetsPtr);
            e._free(r._shadowBlurRadiiPtr);
            e._free(r._fontFeatureNamesPtr);
            e._free(r._fontFeatureValuesPtr);
            e._free(r._fontVariationAxesPtr);
            e._free(r._fontVariationValuesPtr);
          }
          e.Paragraph.prototype.getRectsForRange = function (r, D, U, ca) {
            r = this._getRectsForRange(r, D, U, ca);
            return g(r);
          };
          e.Paragraph.prototype.getRectsForPlaceholders = function () {
            var r = this._getRectsForPlaceholders();
            return g(r);
          };
          e.Paragraph.prototype.getGlyphInfoAt = function (r) {
            return d(this._getGlyphInfoAt(r));
          };
          e.Paragraph.prototype.getClosestGlyphInfoAtCoordinate = function (
            r,
            D
          ) {
            return d(this._getClosestGlyphInfoAtCoordinate(r, D));
          };
          e.TypefaceFontProvider.prototype.registerFont = function (r, D) {
            r = e.Typeface.MakeFreeTypeFaceFromData(r);
            if (!r) return null;
            D = x(D);
            this._registerFont(r, D);
          };
          e.ParagraphStyle = function (r) {
            r.disableHinting = r.disableHinting || !1;
            if (r.ellipsis) {
              var D = r.ellipsis;
              r._ellipsisPtr = x(D);
              r._ellipsisLen = ra(D) + 1;
            } else(r._ellipsisPtr = W), (r._ellipsisLen = 0);
            null == r.heightMultiplier && (r.heightMultiplier = -1);
            r.maxLines = r.maxLines || 0;
            r.replaceTabCharacters = r.replaceTabCharacters || !1;
            D = (D = r.strutStyle) || {};
            D.strutEnabled = D.strutEnabled || !1;
            D.strutEnabled &&
              Array.isArray(D.fontFamilies) &&
              D.fontFamilies.length ?
              ((D._fontFamiliesPtr = t(D.fontFamilies)),
                (D._fontFamiliesLen = D.fontFamilies.length)) :
              ((D._fontFamiliesPtr = W), (D._fontFamiliesLen = 0));
            D.fontStyle = l(D.fontStyle);
            null == D.fontSize && (D.fontSize = -1);
            null == D.heightMultiplier && (D.heightMultiplier = -1);
            D.halfLeading = D.halfLeading || !1;
            D.leading = D.leading || 0;
            D.forceStrutHeight = D.forceStrutHeight || !1;
            r.strutStyle = D;
            r.textAlign = r.textAlign || e.TextAlign.Start;
            r.textDirection = r.textDirection || e.TextDirection.LTR;
            r.textHeightBehavior =
              r.textHeightBehavior || e.TextHeightBehavior.All;
            r.textStyle = e.TextStyle(r.textStyle);
            r.applyRoundingHack = !1 !== r.applyRoundingHack;
            return r;
          };
          e.TextStyle = function (r) {
            r.color || (r.color = e.BLACK);
            r.decoration = r.decoration || 0;
            r.decorationThickness = r.decorationThickness || 0;
            r.decorationStyle = r.decorationStyle || e.DecorationStyle.Solid;
            r.textBaseline = r.textBaseline || e.TextBaseline.Alphabetic;
            null == r.fontSize && (r.fontSize = -1);
            r.letterSpacing = r.letterSpacing || 0;
            r.wordSpacing = r.wordSpacing || 0;
            null == r.heightMultiplier && (r.heightMultiplier = -1);
            r.halfLeading = r.halfLeading || !1;
            r.fontStyle = l(r.fontStyle);
            return r;
          };
          var P = {},
            O = e._malloc(16),
            Y = e._malloc(16),
            aa = e._malloc(16);
          e.ParagraphBuilder.Make = function (r, D) {
            C(r.textStyle);
            D = e.ParagraphBuilder._Make(r, D);
            J(r.textStyle);
            return D;
          };
          e.ParagraphBuilder.MakeFromFontProvider = function (r, D) {
            C(r.textStyle);
            D = e.ParagraphBuilder._MakeFromFontProvider(r, D);
            J(r.textStyle);
            return D;
          };
          e.ParagraphBuilder.MakeFromFontCollection = function (r, D) {
            C(r.textStyle);
            D = e.ParagraphBuilder._MakeFromFontCollection(r, D);
            J(r.textStyle);
            return D;
          };
          e.ParagraphBuilder.ShapeText = function (r, D, U) {
            let ca = 0;
            for (const ka of D) ca += ka.length;
            if (ca !== r.length)
              throw "Accumulated block lengths must equal text.length";
            return e.ParagraphBuilder._ShapeText(r, D, U);
          };
          e.ParagraphBuilder.prototype.pushStyle = function (r) {
            C(r);
            this._pushStyle(r);
            J(r);
          };
          e.ParagraphBuilder.prototype.pushPaintStyle = function (r, D, U) {
            C(r);
            this._pushPaintStyle(r, D, U);
            J(r);
          };
          e.ParagraphBuilder.prototype.addPlaceholder = function (
            r,
            D,
            U,
            ca,
            ka
          ) {
            U = U || e.PlaceholderAlignment.Baseline;
            ca = ca || e.TextBaseline.Alphabetic;
            this._addPlaceholder(r || 0, D || 0, U, ca, ka || 0);
          };
          e.ParagraphBuilder.prototype.setWordsUtf8 = function (r) {
            var D = v(r, "HEAPU32");
            this._setWordsUtf8(D, (r && r.length) || 0);
            q(D, r);
          };
          e.ParagraphBuilder.prototype.setWordsUtf16 = function (r) {
            var D = v(r, "HEAPU32");
            this._setWordsUtf16(D, (r && r.length) || 0);
            q(D, r);
          };
          e.ParagraphBuilder.prototype.setGraphemeBreaksUtf8 = function (r) {
            var D = v(r, "HEAPU32");
            this._setGraphemeBreaksUtf8(D, (r && r.length) || 0);
            q(D, r);
          };
          e.ParagraphBuilder.prototype.setGraphemeBreaksUtf16 = function (r) {
            var D = v(r, "HEAPU32");
            this._setGraphemeBreaksUtf16(D, (r && r.length) || 0);
            q(D, r);
          };
          e.ParagraphBuilder.prototype.setLineBreaksUtf8 = function (r) {
            var D = v(r, "HEAPU32");
            this._setLineBreaksUtf8(D, (r && r.length) || 0);
            q(D, r);
          };
          e.ParagraphBuilder.prototype.setLineBreaksUtf16 = function (r) {
            var D = v(r, "HEAPU32");
            this._setLineBreaksUtf16(D, (r && r.length) || 0);
            q(D, r);
          };
        });
      })(w);
      a.Rd = a.Rd || [];
      a.Rd.push(function () {
        a.Path.prototype.op = function (e, d) {
          return this._op(e, d) ? this : null;
        };
        a.Path.prototype.simplify = function () {
          return this._simplify() ? this : null;
        };
      });
      a.Rd = a.Rd || [];
      a.Rd.push(function () {
        a.Canvas.prototype.drawText = function (e, d, g, l, t) {
          var x = ra(e),
            C = a._malloc(x + 1);
          sa(e, K, C, x + 1);
          this._drawSimpleText(C, x, d, g, t, l);
          a._free(C);
        };
        a.Canvas.prototype.drawGlyphs = function (e, d, g, l, t, x) {
          if (!(2 * e.length <= d.length))
            throw "Not enough positions for the array of gyphs";
          a.Kd(this.Id);
          const C = v(e, "HEAPU16"),
            J = v(d, "HEAPF32");
          this._drawGlyphs(e.length, C, J, g, l, t, x);
          q(J, d);
          q(C, e);
        };
        a.Font.prototype.getGlyphBounds = function (e, d, g) {
          var l = v(e, "HEAPU16"),
            t = a._malloc(16 * e.length);
          this._getGlyphWidthBounds(l, e.length, W, t, d || null);
          d = new Float32Array(a.HEAPU8.buffer, t, 4 * e.length);
          q(l, e);
          if (g) return g.set(d), a._free(t), g;
          e = Float32Array.from(d);
          a._free(t);
          return e;
        };
        a.Font.prototype.getGlyphIDs = function (e, d, g) {
          d || (d = e.length);
          var l = ra(e) + 1,
            t = a._malloc(l);
          sa(e, K, t, l);
          e = a._malloc(2 * d);
          d = this._getGlyphIDs(t, l - 1, d, e);
          a._free(t);
          if (0 > d) return a._free(e), null;
          t = new Uint16Array(a.HEAPU8.buffer, e, d);
          if (g) return g.set(t), a._free(e), g;
          g = Uint16Array.from(t);
          a._free(e);
          return g;
        };
        a.Font.prototype.getGlyphIntercepts = function (e, d, g, l) {
          var t = v(e, "HEAPU16"),
            x = v(d, "HEAPF32");
          return this._getGlyphIntercepts(
            t,
            e.length,
            !(e && e._ck),
            x,
            d.length,
            !(d && d._ck),
            g,
            l
          );
        };
        a.Font.prototype.getGlyphWidths = function (e, d, g) {
          var l = v(e, "HEAPU16"),
            t = a._malloc(4 * e.length);
          this._getGlyphWidthBounds(l, e.length, t, W, d || null);
          d = new Float32Array(a.HEAPU8.buffer, t, e.length);
          q(l, e);
          if (g) return g.set(d), a._free(t), g;
          e = Float32Array.from(d);
          a._free(t);
          return e;
        };
        a.FontMgr.FromData = function () {
          if (!arguments.length) return null;
          var e = arguments;
          1 === e.length && Array.isArray(e[0]) && (e = arguments[0]);
          if (!e.length) return null;
          for (var d = [], g = [], l = 0; l < e.length; l++) {
            var t = new Uint8Array(e[l]),
              x = v(t, "HEAPU8");
            d.push(x);
            g.push(t.byteLength);
          }
          d = v(d, "HEAPU32");
          g = v(g, "HEAPU32");
          e = a.FontMgr._fromData(d, g, e.length);
          a._free(d);
          a._free(g);
          return e;
        };
        a.Typeface.MakeFreeTypeFaceFromData = function (e) {
          e = new Uint8Array(e);
          var d = v(e, "HEAPU8");
          return (e = a.Typeface._MakeFreeTypeFaceFromData(d, e.byteLength)) ?
            e :
            null;
        };
        a.Typeface.prototype.getGlyphIDs = function (e, d, g) {
          d || (d = e.length);
          var l = ra(e) + 1,
            t = a._malloc(l);
          sa(e, K, t, l);
          e = a._malloc(2 * d);
          d = this._getGlyphIDs(t, l - 1, d, e);
          a._free(t);
          if (0 > d) return a._free(e), null;
          t = new Uint16Array(a.HEAPU8.buffer, e, d);
          if (g) return g.set(t), a._free(e), g;
          g = Uint16Array.from(t);
          a._free(e);
          return g;
        };
        a.TextBlob.MakeOnPath = function (e, d, g, l) {
          if (e && e.length && d && d.countPoints()) {
            if (1 === d.countPoints()) return this.MakeFromText(e, g);
            l || (l = 0);
            var t = g.getGlyphIDs(e);
            t = g.getGlyphWidths(t);
            var x = [];
            d = new a.ContourMeasureIter(d, !1, 1);
            for (
              var C = d.next(), J = new Float32Array(4), P = 0; P < e.length && C; P++
            ) {
              var O = t[P];
              l += O / 2;
              if (l > C.length()) {
                C.delete();
                C = d.next();
                if (!C) {
                  e = e.substring(0, P);
                  break;
                }
                l = O / 2;
              }
              C.getPosTan(l, J);
              var Y = J[2],
                aa = J[3];
              x.push(Y, aa, J[0] - (O / 2) * Y, J[1] - (O / 2) * aa);
              l += O / 2;
            }
            e = this.MakeFromRSXform(e, x, g);
            C && C.delete();
            d.delete();
            return e;
          }
        };
        a.TextBlob.MakeFromRSXform = function (e, d, g) {
          var l = ra(e) + 1,
            t = a._malloc(l);
          sa(e, K, t, l);
          e = v(d, "HEAPF32");
          g = a.TextBlob._MakeFromRSXform(t, l - 1, e, g);
          a._free(t);
          return g ? g : null;
        };
        a.TextBlob.MakeFromRSXformGlyphs = function (e, d, g) {
          var l = v(e, "HEAPU16");
          d = v(d, "HEAPF32");
          g = a.TextBlob._MakeFromRSXformGlyphs(l, 2 * e.length, d, g);
          q(l, e);
          return g ? g : null;
        };
        a.TextBlob.MakeFromGlyphs = function (e, d) {
          var g = v(e, "HEAPU16");
          d = a.TextBlob._MakeFromGlyphs(g, 2 * e.length, d);
          q(g, e);
          return d ? d : null;
        };
        a.TextBlob.MakeFromText = function (e, d) {
          var g = ra(e) + 1,
            l = a._malloc(g);
          sa(e, K, l, g);
          e = a.TextBlob._MakeFromText(l, g - 1, d);
          a._free(l);
          return e ? e : null;
        };
        a.MallocGlyphIDs = function (e) {
          return a.Malloc(Uint16Array, e);
        };
      });
      a.Rd = a.Rd || [];
      a.Rd.push(function () {
        a.MakePicture = function (e) {
          e = new Uint8Array(e);
          var d = a._malloc(e.byteLength);
          a.HEAPU8.set(e, d);
          return (e = a._MakePicture(d, e.byteLength)) ? e : null;
        };
      });
      a.Rd = a.Rd || [];
      a.Rd.push(function () {
        a.RuntimeEffect.Make = function (e, d) {
          return a.RuntimeEffect._Make(e, {
            onError: d ||
              function (g) {
                console.log("RuntimeEffect error", g);
              },
          });
        };
        a.RuntimeEffect.MakeForBlender = function (e, d) {
          return a.RuntimeEffect._MakeForBlender(e, {
            onError: d ||
              function (g) {
                console.log("RuntimeEffect error", g);
              },
          });
        };
        a.RuntimeEffect.prototype.makeShader = function (e, d) {
          var g = !e._ck,
            l = v(e, "HEAPF32");
          d = I(d);
          return this._makeShader(l, 4 * e.length, g, d);
        };
        a.RuntimeEffect.prototype.makeShaderWithChildren = function (e, d, g) {
          var l = !e._ck,
            t = v(e, "HEAPF32");
          g = I(g);
          for (var x = [], C = 0; C < d.length; C++) x.push(d[C].Hd.Pd);
          d = v(x, "HEAPU32");
          return this._makeShaderWithChildren(
            t,
            4 * e.length,
            l,
            d,
            x.length,
            g
          );
        };
        a.RuntimeEffect.prototype.makeBlender = function (e) {
          var d = !e._ck,
            g = v(e, "HEAPF32");
          return this._makeBlender(g, 4 * e.length, d);
        };
      });
      (function () {
        function e(G) {
          for (var k = 0; k < G.length; k++)
            if (void 0 !== G[k] && !Number.isFinite(G[k])) return !1;
          return !0;
        }

        function d(G) {
          var k = a.getColorComponents(G);
          G = k[0];
          var p = k[1],
            z = k[2];
          k = k[3];
          if (1 === k)
            return (
              (G = G.toString(16).toLowerCase()),
              (p = p.toString(16).toLowerCase()),
              (z = z.toString(16).toLowerCase()),
              (G = 1 === G.length ? "0" + G : G),
              (p = 1 === p.length ? "0" + p : p),
              (z = 1 === z.length ? "0" + z : z),
              "#" + G + p + z
            );
          k = 0 === k || 1 === k ? k : k.toFixed(8);
          return "rgba(" + G + ", " + p + ", " + z + ", " + k + ")";
        }

        function g(G) {
          return a.parseColorString(G, va);
        }

        function l(G) {
          G = wa.exec(G);
          if (!G) return null;
          var k = parseFloat(G[4]),
            p = 16;
          switch (G[5]) {
            case "em":
            case "rem":
              p = 16 * k;
              break;
            case "pt":
              p = (4 * k) / 3;
              break;
            case "px":
              p = k;
              break;
            case "pc":
              p = 16 * k;
              break;
            case "in":
              p = 96 * k;
              break;
            case "cm":
              p = (96 * k) / 2.54;
              break;
            case "mm":
              p = (96 / 25.4) * k;
              break;
            case "q":
              p = (96 / 25.4 / 4) * k;
              break;
            case "%":
              p = (16 / 75) * k;
          }
          return {
            style: G[1],
            variant: G[2],
            weight: G[3],
            sizePx: p,
            family: G[6].trim(),
          };
        }

        function t(G) {
          this.Jd = G;
          this.Md = new a.Paint();
          this.Md.setAntiAlias(!0);
          this.Md.setStrokeMiter(10);
          this.Md.setStrokeCap(a.StrokeCap.Butt);
          this.Md.setStrokeJoin(a.StrokeJoin.Miter);
          this.Pe = "10px monospace";
          this.ke = new a.Font(null, 10);
          this.ke.setSubpixel(!0);
          this.Zd = this.ee = a.BLACK;
          this.te = 0;
          this.He = a.TRANSPARENT;
          this.ve = this.ue = 0;
          this.Ie = this.ge = 1;
          this.Ge = 0;
          this.se = [];
          this.Ld = a.BlendMode.SrcOver;
          this.Md.setStrokeWidth(this.Ie);
          this.Md.setBlendMode(this.Ld);
          this.Od = new a.Path();
          this.Qd = a.Matrix.identity();
          this.jf = [];
          this.ze = [];
          this.je = function () {
            this.Od.delete();
            this.Md.delete();
            this.ke.delete();
            this.ze.forEach(function (k) {
              k.je();
            });
          };
          Object.defineProperty(this, "currentTransform", {
            enumerable: !0,
            get: function () {
              return {
                a: this.Qd[0],
                c: this.Qd[1],
                e: this.Qd[2],
                b: this.Qd[3],
                d: this.Qd[4],
                f: this.Qd[5],
              };
            },
            set: function (k) {
              k.a && this.setTransform(k.a, k.b, k.c, k.d, k.e, k.f);
            },
          });
          Object.defineProperty(this, "fillStyle", {
            enumerable: !0,
            get: function () {
              return f(this.Zd) ? d(this.Zd) : this.Zd;
            },
            set: function (k) {
              "string" === typeof k ? (this.Zd = g(k)) : k.re && (this.Zd = k);
            },
          });
          Object.defineProperty(this, "font", {
            enumerable: !0,
            get: function () {
              return this.Pe;
            },
            set: function (k) {
              var p = l(k),
                z = p.family;
              p.typeface = ma[z] ?
                ma[z][
                  (p.style || "normal") +
                  "|" +
                  (p.variant || "normal") +
                  "|" +
                  (p.weight || "normal")
                ] || ma[z]["*"] :
                null;
              p &&
                (this.ke.setSize(p.sizePx),
                  this.ke.setTypeface(p.typeface),
                  (this.Pe = k));
            },
          });
          Object.defineProperty(this, "globalAlpha", {
            enumerable: !0,
            get: function () {
              return this.ge;
            },
            set: function (k) {
              !isFinite(k) || 0 > k || 1 < k || (this.ge = k);
            },
          });
          Object.defineProperty(this, "globalCompositeOperation", {
            enumerable: !0,
            get: function () {
              switch (this.Ld) {
                case a.BlendMode.SrcOver:
                  return "source-over";
                case a.BlendMode.DstOver:
                  return "destination-over";
                case a.BlendMode.Src:
                  return "copy";
                case a.BlendMode.Dst:
                  return "destination";
                case a.BlendMode.Clear:
                  return "clear";
                case a.BlendMode.SrcIn:
                  return "source-in";
                case a.BlendMode.DstIn:
                  return "destination-in";
                case a.BlendMode.SrcOut:
                  return "source-out";
                case a.BlendMode.DstOut:
                  return "destination-out";
                case a.BlendMode.SrcATop:
                  return "source-atop";
                case a.BlendMode.DstATop:
                  return "destination-atop";
                case a.BlendMode.Xor:
                  return "xor";
                case a.BlendMode.Plus:
                  return "lighter";
                case a.BlendMode.Multiply:
                  return "multiply";
                case a.BlendMode.Screen:
                  return "screen";
                case a.BlendMode.Overlay:
                  return "overlay";
                case a.BlendMode.Darken:
                  return "darken";
                case a.BlendMode.Lighten:
                  return "lighten";
                case a.BlendMode.ColorDodge:
                  return "color-dodge";
                case a.BlendMode.ColorBurn:
                  return "color-burn";
                case a.BlendMode.HardLight:
                  return "hard-light";
                case a.BlendMode.SoftLight:
                  return "soft-light";
                case a.BlendMode.Difference:
                  return "difference";
                case a.BlendMode.Exclusion:
                  return "exclusion";
                case a.BlendMode.Hue:
                  return "hue";
                case a.BlendMode.Saturation:
                  return "saturation";
                case a.BlendMode.Color:
                  return "color";
                case a.BlendMode.Luminosity:
                  return "luminosity";
              }
            },
            set: function (k) {
              switch (k) {
                case "source-over":
                  this.Ld = a.BlendMode.SrcOver;
                  break;
                case "destination-over":
                  this.Ld = a.BlendMode.DstOver;
                  break;
                case "copy":
                  this.Ld = a.BlendMode.Src;
                  break;
                case "destination":
                  this.Ld = a.BlendMode.Dst;
                  break;
                case "clear":
                  this.Ld = a.BlendMode.Clear;
                  break;
                case "source-in":
                  this.Ld = a.BlendMode.SrcIn;
                  break;
                case "destination-in":
                  this.Ld = a.BlendMode.DstIn;
                  break;
                case "source-out":
                  this.Ld = a.BlendMode.SrcOut;
                  break;
                case "destination-out":
                  this.Ld = a.BlendMode.DstOut;
                  break;
                case "source-atop":
                  this.Ld = a.BlendMode.SrcATop;
                  break;
                case "destination-atop":
                  this.Ld = a.BlendMode.DstATop;
                  break;
                case "xor":
                  this.Ld = a.BlendMode.Xor;
                  break;
                case "lighter":
                  this.Ld = a.BlendMode.Plus;
                  break;
                case "plus-lighter":
                  this.Ld = a.BlendMode.Plus;
                  break;
                case "plus-darker":
                  throw "plus-darker is not supported";
                case "multiply":
                  this.Ld = a.BlendMode.Multiply;
                  break;
                case "screen":
                  this.Ld = a.BlendMode.Screen;
                  break;
                case "overlay":
                  this.Ld = a.BlendMode.Overlay;
                  break;
                case "darken":
                  this.Ld = a.BlendMode.Darken;
                  break;
                case "lighten":
                  this.Ld = a.BlendMode.Lighten;
                  break;
                case "color-dodge":
                  this.Ld = a.BlendMode.ColorDodge;
                  break;
                case "color-burn":
                  this.Ld = a.BlendMode.ColorBurn;
                  break;
                case "hard-light":
                  this.Ld = a.BlendMode.HardLight;
                  break;
                case "soft-light":
                  this.Ld = a.BlendMode.SoftLight;
                  break;
                case "difference":
                  this.Ld = a.BlendMode.Difference;
                  break;
                case "exclusion":
                  this.Ld = a.BlendMode.Exclusion;
                  break;
                case "hue":
                  this.Ld = a.BlendMode.Hue;
                  break;
                case "saturation":
                  this.Ld = a.BlendMode.Saturation;
                  break;
                case "color":
                  this.Ld = a.BlendMode.Color;
                  break;
                case "luminosity":
                  this.Ld = a.BlendMode.Luminosity;
                  break;
                default:
                  return;
              }
              this.Md.setBlendMode(this.Ld);
            },
          });
          Object.defineProperty(this, "imageSmoothingEnabled", {
            enumerable: !0,
            get: function () {
              return !0;
            },
            set: function () {},
          });
          Object.defineProperty(this, "imageSmoothingQuality", {
            enumerable: !0,
            get: function () {
              return "high";
            },
            set: function () {},
          });
          Object.defineProperty(this, "lineCap", {
            enumerable: !0,
            get: function () {
              switch (this.Md.getStrokeCap()) {
                case a.StrokeCap.Butt:
                  return "butt";
                case a.StrokeCap.Round:
                  return "round";
                case a.StrokeCap.Square:
                  return "square";
              }
            },
            set: function (k) {
              switch (k) {
                case "butt":
                  this.Md.setStrokeCap(a.StrokeCap.Butt);
                  break;
                case "round":
                  this.Md.setStrokeCap(a.StrokeCap.Round);
                  break;
                case "square":
                  this.Md.setStrokeCap(a.StrokeCap.Square);
              }
            },
          });
          Object.defineProperty(this, "lineDashOffset", {
            enumerable: !0,
            get: function () {
              return this.Ge;
            },
            set: function (k) {
              isFinite(k) && (this.Ge = k);
            },
          });
          Object.defineProperty(this, "lineJoin", {
            enumerable: !0,
            get: function () {
              switch (this.Md.getStrokeJoin()) {
                case a.StrokeJoin.Miter:
                  return "miter";
                case a.StrokeJoin.Round:
                  return "round";
                case a.StrokeJoin.Bevel:
                  return "bevel";
              }
            },
            set: function (k) {
              switch (k) {
                case "miter":
                  this.Md.setStrokeJoin(a.StrokeJoin.Miter);
                  break;
                case "round":
                  this.Md.setStrokeJoin(a.StrokeJoin.Round);
                  break;
                case "bevel":
                  this.Md.setStrokeJoin(a.StrokeJoin.Bevel);
              }
            },
          });
          Object.defineProperty(this, "lineWidth", {
            enumerable: !0,
            get: function () {
              return this.Md.getStrokeWidth();
            },
            set: function (k) {
              0 >= k || !k || ((this.Ie = k), this.Md.setStrokeWidth(k));
            },
          });
          Object.defineProperty(this, "miterLimit", {
            enumerable: !0,
            get: function () {
              return this.Md.getStrokeMiter();
            },
            set: function (k) {
              0 >= k || !k || this.Md.setStrokeMiter(k);
            },
          });
          Object.defineProperty(this, "shadowBlur", {
            enumerable: !0,
            get: function () {
              return this.te;
            },
            set: function (k) {
              0 > k || !isFinite(k) || (this.te = k);
            },
          });
          Object.defineProperty(this, "shadowColor", {
            enumerable: !0,
            get: function () {
              return d(this.He);
            },
            set: function (k) {
              this.He = g(k);
            },
          });
          Object.defineProperty(this, "shadowOffsetX", {
            enumerable: !0,
            get: function () {
              return this.ue;
            },
            set: function (k) {
              isFinite(k) && (this.ue = k);
            },
          });
          Object.defineProperty(this, "shadowOffsetY", {
            enumerable: !0,
            get: function () {
              return this.ve;
            },
            set: function (k) {
              isFinite(k) && (this.ve = k);
            },
          });
          Object.defineProperty(this, "strokeStyle", {
            enumerable: !0,
            get: function () {
              return d(this.ee);
            },
            set: function (k) {
              "string" === typeof k ? (this.ee = g(k)) : k.re && (this.ee = k);
            },
          });
          this.arc = function (k, p, z, B, F, H) {
            r(this.Od, k, p, z, z, 0, B, F, H);
          };
          this.arcTo = function (k, p, z, B, F) {
            O(this.Od, k, p, z, B, F);
          };
          this.beginPath = function () {
            this.Od.delete();
            this.Od = new a.Path();
          };
          this.bezierCurveTo = function (k, p, z, B, F, H) {
            var M = this.Od;
            e([k, p, z, B, F, H]) &&
              (M.isEmpty() && M.moveTo(k, p), M.cubicTo(k, p, z, B, F, H));
          };
          this.clearRect = function (k, p, z, B) {
            this.Md.setStyle(a.PaintStyle.Fill);
            this.Md.setBlendMode(a.BlendMode.Clear);
            this.Jd.drawRect(a.XYWHRect(k, p, z, B), this.Md);
            this.Md.setBlendMode(this.Ld);
          };
          this.clip = function (k, p) {
            "string" === typeof k
              ?
              ((p = k), (k = this.Od)) :
              k && k.Ze && (k = k.Sd);
            k || (k = this.Od);
            k = k.copy();
            p && "evenodd" === p.toLowerCase() ?
              k.setFillType(a.FillType.EvenOdd) :
              k.setFillType(a.FillType.Winding);
            this.Jd.clipPath(k, a.ClipOp.Intersect, !0);
            k.delete();
          };
          this.closePath = function () {
            Y(this.Od);
          };
          this.createImageData = function () {
            if (1 === arguments.length) {
              var k = arguments[0];
              return new J(
                new Uint8ClampedArray(4 * k.width * k.height),
                k.width,
                k.height
              );
            }
            if (2 === arguments.length) {
              k = arguments[0];
              var p = arguments[1];
              return new J(new Uint8ClampedArray(4 * k * p), k, p);
            }
            throw (
              "createImageData expects 1 or 2 arguments, got " +
              arguments.length
            );
          };
          this.createLinearGradient = function (k, p, z, B) {
            if (e(arguments)) {
              var F = new P(k, p, z, B);
              this.ze.push(F);
              return F;
            }
          };
          this.createPattern = function (k, p) {
            k = new ca(k, p);
            this.ze.push(k);
            return k;
          };
          this.createRadialGradient = function (k, p, z, B, F, H) {
            if (e(arguments)) {
              var M = new ka(k, p, z, B, F, H);
              this.ze.push(M);
              return M;
            }
          };
          this.drawImage = function (k) {
            k instanceof C && (k = k.rf());
            var p = this.Oe();
            if (3 === arguments.length || 5 === arguments.length)
              var z = a.XYWHRect(
                  arguments[1],
                  arguments[2],
                  arguments[3] || k.width(),
                  arguments[4] || k.height()
                ),
                B = a.XYWHRect(0, 0, k.width(), k.height());
            else if (9 === arguments.length)
              (z = a.XYWHRect(
                arguments[5],
                arguments[6],
                arguments[7],
                arguments[8]
              )),
              (B = a.XYWHRect(
                arguments[1],
                arguments[2],
                arguments[3],
                arguments[4]
              ));
            else
              throw (
                "invalid number of args for drawImage, need 3, 5, or 9; got " +
                arguments.length
              );
            this.Jd.drawImageRect(k, B, z, p, !1);
            p.dispose();
          };
          this.ellipse = function (k, p, z, B, F, H, M, da) {
            r(this.Od, k, p, z, B, F, H, M, da);
          };
          this.Oe = function () {
            var k = this.Md.copy();
            k.setStyle(a.PaintStyle.Fill);
            if (f(this.Zd)) {
              var p = a.multiplyByAlpha(this.Zd, this.ge);
              k.setColor(p);
            } else
              (p = this.Zd.re(this.Qd)),
              k.setColor(a.Color(0, 0, 0, this.ge)),
              k.setShader(p);
            k.dispose = function () {
              this.delete();
            };
            return k;
          };
          this.fill = function (k, p) {
            "string" === typeof k
              ?
              ((p = k), (k = this.Od)) :
              k && k.Ze && (k = k.Sd);
            if ("evenodd" === p) this.Od.setFillType(a.FillType.EvenOdd);
            else {
              if ("nonzero" !== p && p) throw "invalid fill rule";
              this.Od.setFillType(a.FillType.Winding);
            }
            k || (k = this.Od);
            p = this.Oe();
            var z = this.we(p);
            z &&
              (this.Jd.save(),
                this.pe(),
                this.Jd.drawPath(k, z),
                this.Jd.restore(),
                z.dispose());
            this.Jd.drawPath(k, p);
            p.dispose();
          };
          this.fillRect = function (k, p, z, B) {
            var F = this.Oe(),
              H = this.we(F);
            H &&
              (this.Jd.save(),
                this.pe(),
                this.Jd.drawRect(a.XYWHRect(k, p, z, B), H),
                this.Jd.restore(),
                H.dispose());
            this.Jd.drawRect(a.XYWHRect(k, p, z, B), F);
            F.dispose();
          };
          this.fillText = function (k, p, z) {
            var B = this.Oe();
            k = a.TextBlob.MakeFromText(k, this.ke);
            var F = this.we(B);
            F &&
              (this.Jd.save(),
                this.pe(),
                this.Jd.drawTextBlob(k, p, z, F),
                this.Jd.restore(),
                F.dispose());
            this.Jd.drawTextBlob(k, p, z, B);
            k.delete();
            B.dispose();
          };
          this.getImageData = function (k, p, z, B) {
            return (k = this.Jd.readPixels(k, p, {
                width: z,
                height: B,
                colorType: a.ColorType.RGBA_8888,
                alphaType: a.AlphaType.Unpremul,
                colorSpace: a.ColorSpace.SRGB,
              })) ?
              new J(new Uint8ClampedArray(k.buffer), z, B) :
              null;
          };
          this.getLineDash = function () {
            return this.se.slice();
          };
          this.kf = function (k) {
            var p = a.Matrix.invert(this.Qd);
            a.Matrix.mapPoints(p, k);
            return k;
          };
          this.isPointInPath = function (k, p, z) {
            var B = arguments;
            if (3 === B.length) var F = this.Od;
            else if (4 === B.length)
              (F = B[0]), (k = B[1]), (p = B[2]), (z = B[3]);
            else throw "invalid arg count, need 3 or 4, got " + B.length;
            if (!isFinite(k) || !isFinite(p)) return !1;
            z = z || "nonzero";
            if ("nonzero" !== z && "evenodd" !== z) return !1;
            B = this.kf([k, p]);
            k = B[0];
            p = B[1];
            F.setFillType(
              "nonzero" === z ? a.FillType.Winding : a.FillType.EvenOdd
            );
            return F.contains(k, p);
          };
          this.isPointInStroke = function (k, p) {
            var z = arguments;
            if (2 === z.length) var B = this.Od;
            else if (3 === z.length)(B = z[0]), (k = z[1]), (p = z[2]);
            else throw "invalid arg count, need 2 or 3, got " + z.length;
            if (!isFinite(k) || !isFinite(p)) return !1;
            z = this.kf([k, p]);
            k = z[0];
            p = z[1];
            B = B.copy();
            B.setFillType(a.FillType.Winding);
            B.stroke({
              width: this.lineWidth,
              miter_limit: this.miterLimit,
              cap: this.Md.getStrokeCap(),
              join: this.Md.getStrokeJoin(),
              precision: 0.3,
            });
            z = B.contains(k, p);
            B.delete();
            return z;
          };
          this.lineTo = function (k, p) {
            D(this.Od, k, p);
          };
          this.measureText = function (k) {
            k = this.ke.getGlyphIDs(k);
            k = this.ke.getGlyphWidths(k);
            let p = 0;
            for (const z of k) p += z;
            return {
              width: p
            };
          };
          this.moveTo = function (k, p) {
            var z = this.Od;
            e([k, p]) && z.moveTo(k, p);
          };
          this.putImageData = function (k, p, z, B, F, H, M) {
            if (e([p, z, B, F, H, M]))
              if (void 0 === B)
                this.Jd.writePixels(k.data, k.width, k.height, p, z);
              else if (
              ((B = B || 0),
                (F = F || 0),
                (H = H || k.width),
                (M = M || k.height),
                0 > H && ((B += H), (H = Math.abs(H))),
                0 > M && ((F += M), (M = Math.abs(M))),
                0 > B && ((H += B), (B = 0)),
                0 > F && ((M += F), (F = 0)),
                !(0 >= H || 0 >= M))
            ) {
              k = a.MakeImage({
                  width: k.width,
                  height: k.height,
                  alphaType: a.AlphaType.Unpremul,
                  colorType: a.ColorType.RGBA_8888,
                  colorSpace: a.ColorSpace.SRGB,
                },
                k.data,
                4 * k.width
              );
              var da = a.XYWHRect(B, F, H, M);
              p = a.XYWHRect(p + B, z + F, H, M);
              z = a.Matrix.invert(this.Qd);
              this.Jd.save();
              this.Jd.concat(z);
              this.Jd.drawImageRect(k, da, p, null, !1);
              this.Jd.restore();
              k.delete();
            }
          };
          this.quadraticCurveTo = function (k, p, z, B) {
            var F = this.Od;
            e([k, p, z, B]) &&
              (F.isEmpty() && F.moveTo(k, p), F.quadTo(k, p, z, B));
          };
          this.rect = function (k, p, z, B) {
            var F = this.Od;
            k = a.XYWHRect(k, p, z, B);
            e(k) && F.addRect(k);
          };
          this.resetTransform = function () {
            this.Od.transform(this.Qd);
            var k = a.Matrix.invert(this.Qd);
            this.Jd.concat(k);
            this.Qd = this.Jd.getTotalMatrix();
          };
          this.restore = function () {
            var k = this.jf.pop();
            if (k) {
              var p = a.Matrix.multiply(this.Qd, a.Matrix.invert(k.Hf));
              this.Od.transform(p);
              this.Md.delete();
              this.Md = k.Zf;
              this.se = k.Xf;
              this.Ie = k.kg;
              this.ee = k.jg;
              this.Zd = k.fs;
              this.ue = k.hg;
              this.ve = k.ig;
              this.te = k.sb;
              this.He = k.gg;
              this.ge = k.ga;
              this.Ld = k.Of;
              this.Ge = k.Yf;
              this.Pe = k.Nf;
              this.Jd.restore();
              this.Qd = this.Jd.getTotalMatrix();
            }
          };
          this.rotate = function (k) {
            if (isFinite(k)) {
              var p = a.Matrix.rotated(-k);
              this.Od.transform(p);
              this.Jd.rotate((k / Math.PI) * 180, 0, 0);
              this.Qd = this.Jd.getTotalMatrix();
            }
          };
          this.save = function () {
            if (this.Zd.qe) {
              var k = this.Zd.qe();
              this.ze.push(k);
            } else k = this.Zd;
            if (this.ee.qe) {
              var p = this.ee.qe();
              this.ze.push(p);
            } else p = this.ee;
            this.jf.push({
              Hf: this.Qd.slice(),
              Xf: this.se.slice(),
              kg: this.Ie,
              jg: p,
              fs: k,
              hg: this.ue,
              ig: this.ve,
              sb: this.te,
              gg: this.He,
              ga: this.ge,
              Yf: this.Ge,
              Of: this.Ld,
              Zf: this.Md.copy(),
              Nf: this.Pe,
            });
            this.Jd.save();
          };
          this.scale = function (k, p) {
            if (e(arguments)) {
              var z = a.Matrix.scaled(1 / k, 1 / p);
              this.Od.transform(z);
              this.Jd.scale(k, p);
              this.Qd = this.Jd.getTotalMatrix();
            }
          };
          this.setLineDash = function (k) {
            for (var p = 0; p < k.length; p++)
              if (!isFinite(k[p]) || 0 > k[p]) return;
            1 === k.length % 2 && Array.prototype.push.apply(k, k);
            this.se = k;
          };
          this.setTransform = function (k, p, z, B, F, H) {
            e(arguments) &&
              (this.resetTransform(), this.transform(k, p, z, B, F, H));
          };
          this.pe = function () {
            var k = a.Matrix.invert(this.Qd);
            this.Jd.concat(k);
            this.Jd.concat(a.Matrix.translated(this.ue, this.ve));
            this.Jd.concat(this.Qd);
          };
          this.we = function (k) {
            var p = a.multiplyByAlpha(this.He, this.ge);
            if (!a.getColorComponents(p)[3] || !(this.te || this.ve || this.ue))
              return null;
            k = k.copy();
            k.setColor(p);
            var z = a.MaskFilter.MakeBlur(a.BlurStyle.Normal, this.te / 2, !1);
            k.setMaskFilter(z);
            k.dispose = function () {
              z.delete();
              this.delete();
            };
            return k;
          };
          this.af = function () {
            var k = this.Md.copy();
            k.setStyle(a.PaintStyle.Stroke);
            if (f(this.ee)) {
              var p = a.multiplyByAlpha(this.ee, this.ge);
              k.setColor(p);
            } else
              (p = this.ee.re(this.Qd)),
              k.setColor(a.Color(0, 0, 0, this.ge)),
              k.setShader(p);
            k.setStrokeWidth(this.Ie);
            if (this.se.length) {
              var z = a.PathEffect.MakeDash(this.se, this.Ge);
              k.setPathEffect(z);
            }
            k.dispose = function () {
              z && z.delete();
              this.delete();
            };
            return k;
          };
          this.stroke = function (k) {
            k = k ? k.Sd : this.Od;
            var p = this.af(),
              z = this.we(p);
            z &&
              (this.Jd.save(),
                this.pe(),
                this.Jd.drawPath(k, z),
                this.Jd.restore(),
                z.dispose());
            this.Jd.drawPath(k, p);
            p.dispose();
          };
          this.strokeRect = function (k, p, z, B) {
            var F = this.af(),
              H = this.we(F);
            H &&
              (this.Jd.save(),
                this.pe(),
                this.Jd.drawRect(a.XYWHRect(k, p, z, B), H),
                this.Jd.restore(),
                H.dispose());
            this.Jd.drawRect(a.XYWHRect(k, p, z, B), F);
            F.dispose();
          };
          this.strokeText = function (k, p, z) {
            var B = this.af();
            k = a.TextBlob.MakeFromText(k, this.ke);
            var F = this.we(B);
            F &&
              (this.Jd.save(),
                this.pe(),
                this.Jd.drawTextBlob(k, p, z, F),
                this.Jd.restore(),
                F.dispose());
            this.Jd.drawTextBlob(k, p, z, B);
            k.delete();
            B.dispose();
          };
          this.translate = function (k, p) {
            if (e(arguments)) {
              var z = a.Matrix.translated(-k, -p);
              this.Od.transform(z);
              this.Jd.translate(k, p);
              this.Qd = this.Jd.getTotalMatrix();
            }
          };
          this.transform = function (k, p, z, B, F, H) {
            k = [k, z, F, p, B, H, 0, 0, 1];
            p = a.Matrix.invert(k);
            this.Od.transform(p);
            this.Jd.concat(k);
            this.Qd = this.Jd.getTotalMatrix();
          };
          this.addHitRegion = function () {};
          this.clearHitRegions = function () {};
          this.drawFocusIfNeeded = function () {};
          this.removeHitRegion = function () {};
          this.scrollPathIntoView = function () {};
          Object.defineProperty(this, "canvas", {
            value: null,
            writable: !1
          });
        }

        function x(G) {
          this.bf = G;
          this.Id = new t(G.getCanvas());
          this.Qe = [];
          this.decodeImage = function (k) {
            k = a.MakeImageFromEncoded(k);
            if (!k) throw "Invalid input";
            this.Qe.push(k);
            return new C(k);
          };
          this.loadFont = function (k, p) {
            k = a.Typeface.MakeFreeTypeFaceFromData(k);
            if (!k) return null;
            this.Qe.push(k);
            var z =
              (p.style || "normal") +
              "|" +
              (p.variant || "normal") +
              "|" +
              (p.weight || "normal");
            p = p.family;
            ma[p] || (ma[p] = {
              "*": k
            });
            ma[p][z] = k;
          };
          this.makePath2D = function (k) {
            k = new U(k);
            this.Qe.push(k.Sd);
            return k;
          };
          this.getContext = function (k) {
            return "2d" === k ? this.Id : null;
          };
          this.toDataURL = function (k, p) {
            this.bf.flush();
            var z = this.bf.makeImageSnapshot();
            if (z) {
              k = k || "image/png";
              var B = a.ImageFormat.PNG;
              "image/jpeg" === k && (B = a.ImageFormat.JPEG);
              if ((p = z.encodeToBytes(B, p || 0.92))) {
                z.delete();
                k = "data:" + k + ";base64,";
                if ("undefined" !== typeof Buffer)
                  p = Buffer.from(p).toString("base64");
                else {
                  z = 0;
                  B = p.length;
                  for (var F = "", H; z < B;)
                    (H = p.slice(z, Math.min(z + 32768, B))),
                    (F += String.fromCharCode.apply(null, H)),
                    (z += 32768);
                  p = btoa(F);
                }
                return k + p;
              }
            }
          };
          this.dispose = function () {
            this.Id.je();
            this.Qe.forEach(function (k) {
              k.delete();
            });
            this.bf.dispose();
          };
        }

        function C(G) {
          this.width = G.width();
          this.height = G.height();
          this.naturalWidth = this.width;
          this.naturalHeight = this.height;
          this.rf = function () {
            return G;
          };
        }

        function J(G, k, p) {
          if (!k || 0 === p)
            throw "invalid dimensions, width and height must be non-zero";
          if (G.length % 4) throw "arr must be a multiple of 4";
          p = p || G.length / (4 * k);
          Object.defineProperty(this, "data", {
            value: G,
            writable: !1
          });
          Object.defineProperty(this, "height", {
            value: p,
            writable: !1
          });
          Object.defineProperty(this, "width", {
            value: k,
            writable: !1
          });
        }

        function P(G, k, p, z) {
          this.Ud = null;
          this.ae = [];
          this.Xd = [];
          this.addColorStop = function (B, F) {
            if (0 > B || 1 < B || !isFinite(B))
              throw "offset must be between 0 and 1 inclusively";
            F = g(F);
            var H = this.Xd.indexOf(B);
            if (-1 !== H) this.ae[H] = F;
            else {
              for (H = 0; H < this.Xd.length && !(this.Xd[H] > B); H++);
              this.Xd.splice(H, 0, B);
              this.ae.splice(H, 0, F);
            }
          };
          this.qe = function () {
            var B = new P(G, k, p, z);
            B.ae = this.ae.slice();
            B.Xd = this.Xd.slice();
            return B;
          };
          this.je = function () {
            this.Ud && (this.Ud.delete(), (this.Ud = null));
          };
          this.re = function (B) {
            var F = [G, k, p, z];
            a.Matrix.mapPoints(B, F);
            B = F[0];
            var H = F[1],
              M = F[2];
            F = F[3];
            this.je();
            return (this.Ud = a.Shader.MakeLinearGradient(
              [B, H],
              [M, F],
              this.ae,
              this.Xd,
              a.TileMode.Clamp
            ));
          };
        }

        function O(G, k, p, z, B, F) {
          if (e([k, p, z, B, F])) {
            if (0 > F) throw "radii cannot be negative";
            G.isEmpty() && G.moveTo(k, p);
            G.arcToTangent(k, p, z, B, F);
          }
        }

        function Y(G) {
          if (!G.isEmpty()) {
            var k = G.getBounds();
            (k[3] - k[1] || k[2] - k[0]) && G.close();
          }
        }

        function aa(G, k, p, z, B, F, H) {
          H = ((H - F) / Math.PI) * 180;
          F = (F / Math.PI) * 180;
          k = a.LTRBRect(k - z, p - B, k + z, p + B);
          1e-5 > Math.abs(Math.abs(H) - 360) ?
            ((p = H / 2),
              G.arcToOval(k, F, p, !1),
              G.arcToOval(k, F + p, p, !1)) :
            G.arcToOval(k, F, H, !1);
        }

        function r(G, k, p, z, B, F, H, M, da) {
          if (e([k, p, z, B, F, H, M])) {
            if (0 > z || 0 > B) throw "radii cannot be negative";
            var ea = 2 * Math.PI,
              Ia = H % ea;
            0 > Ia && (Ia += ea);
            var ab = Ia - H;
            H = Ia;
            M += ab;
            !da && M - H >= ea ?
              (M = H + ea) :
              da && H - M >= ea ?
              (M = H - ea) :
              !da && H > M ?
              (M = H + (ea - ((H - M) % ea))) :
              da && H < M && (M = H - (ea - ((M - H) % ea)));
            F
              ?
              ((da = a.Matrix.rotated(F, k, p)),
                (F = a.Matrix.rotated(-F, k, p)),
                G.transform(F),
                aa(G, k, p, z, B, H, M),
                G.transform(da)) :
              aa(G, k, p, z, B, H, M);
          }
        }

        function D(G, k, p) {
          e([k, p]) && (G.isEmpty() && G.moveTo(k, p), G.lineTo(k, p));
        }

        function U(G) {
          this.Sd = null;
          this.Sd =
            "string" === typeof G ?
            a.Path.MakeFromSVGString(G) :
            G && G.Ze ?
            G.Sd.copy() :
            new a.Path();
          this.Ze = function () {
            return this.Sd;
          };
          this.addPath = function (k, p) {
            p || (p = {
              a: 1,
              c: 0,
              e: 0,
              b: 0,
              d: 1,
              f: 0
            });
            this.Sd.addPath(k.Sd, [p.a, p.c, p.e, p.b, p.d, p.f]);
          };
          this.arc = function (k, p, z, B, F, H) {
            r(this.Sd, k, p, z, z, 0, B, F, H);
          };
          this.arcTo = function (k, p, z, B, F) {
            O(this.Sd, k, p, z, B, F);
          };
          this.bezierCurveTo = function (k, p, z, B, F, H) {
            var M = this.Sd;
            e([k, p, z, B, F, H]) &&
              (M.isEmpty() && M.moveTo(k, p), M.cubicTo(k, p, z, B, F, H));
          };
          this.closePath = function () {
            Y(this.Sd);
          };
          this.ellipse = function (k, p, z, B, F, H, M, da) {
            r(this.Sd, k, p, z, B, F, H, M, da);
          };
          this.lineTo = function (k, p) {
            D(this.Sd, k, p);
          };
          this.moveTo = function (k, p) {
            var z = this.Sd;
            e([k, p]) && z.moveTo(k, p);
          };
          this.quadraticCurveTo = function (k, p, z, B) {
            var F = this.Sd;
            e([k, p, z, B]) &&
              (F.isEmpty() && F.moveTo(k, p), F.quadTo(k, p, z, B));
          };
          this.rect = function (k, p, z, B) {
            var F = this.Sd;
            k = a.XYWHRect(k, p, z, B);
            e(k) && F.addRect(k);
          };
        }

        function ca(G, k) {
          this.Ud = null;
          G instanceof C && (G = G.rf());
          this.Cf = G;
          this._transform = a.Matrix.identity();
          "" === k && (k = "repeat");
          switch (k) {
            case "repeat-x":
              this.xe = a.TileMode.Repeat;
              this.ye = a.TileMode.Decal;
              break;
            case "repeat-y":
              this.xe = a.TileMode.Decal;
              this.ye = a.TileMode.Repeat;
              break;
            case "repeat":
              this.ye = this.xe = a.TileMode.Repeat;
              break;
            case "no-repeat":
              this.ye = this.xe = a.TileMode.Decal;
              break;
            default:
              throw "invalid repetition mode " + k;
          }
          this.setTransform = function (p) {
            p = [p.a, p.c, p.e, p.b, p.d, p.f, 0, 0, 1];
            e(p) && (this._transform = p);
          };
          this.qe = function () {
            var p = new ca();
            p.xe = this.xe;
            p.ye = this.ye;
            return p;
          };
          this.je = function () {
            this.Ud && (this.Ud.delete(), (this.Ud = null));
          };
          this.re = function () {
            this.je();
            return (this.Ud = this.Cf.makeShaderCubic(
              this.xe,
              this.ye,
              1 / 3,
              1 / 3,
              this._transform
            ));
          };
        }

        function ka(G, k, p, z, B, F) {
          this.Ud = null;
          this.ae = [];
          this.Xd = [];
          this.addColorStop = function (H, M) {
            if (0 > H || 1 < H || !isFinite(H))
              throw "offset must be between 0 and 1 inclusively";
            M = g(M);
            var da = this.Xd.indexOf(H);
            if (-1 !== da) this.ae[da] = M;
            else {
              for (da = 0; da < this.Xd.length && !(this.Xd[da] > H); da++);
              this.Xd.splice(da, 0, H);
              this.ae.splice(da, 0, M);
            }
          };
          this.qe = function () {
            var H = new ka(G, k, p, z, B, F);
            H.ae = this.ae.slice();
            H.Xd = this.Xd.slice();
            return H;
          };
          this.je = function () {
            this.Ud && (this.Ud.delete(), (this.Ud = null));
          };
          this.re = function (H) {
            var M = [G, k, z, B];
            a.Matrix.mapPoints(H, M);
            var da = M[0],
              ea = M[1],
              Ia = M[2];
            M = M[3];
            var ab = (Math.abs(H[0]) + Math.abs(H[4])) / 2;
            H = p * ab;
            ab *= F;
            this.je();
            return (this.Ud = a.Shader.MakeTwoPointConicalGradient(
              [da, ea],
              H,
              [Ia, M],
              ab,
              this.ae,
              this.Xd,
              a.TileMode.Clamp
            ));
          };
        }
        a._testing = {};
        var va = {
          aliceblue: Float32Array.of(0.941, 0.973, 1, 1),
          antiquewhite: Float32Array.of(0.98, 0.922, 0.843, 1),
          aqua: Float32Array.of(0, 1, 1, 1),
          aquamarine: Float32Array.of(0.498, 1, 0.831, 1),
          azure: Float32Array.of(0.941, 1, 1, 1),
          beige: Float32Array.of(0.961, 0.961, 0.863, 1),
          bisque: Float32Array.of(1, 0.894, 0.769, 1),
          black: Float32Array.of(0, 0, 0, 1),
          blanchedalmond: Float32Array.of(1, 0.922, 0.804, 1),
          blue: Float32Array.of(0, 0, 1, 1),
          blueviolet: Float32Array.of(0.541, 0.169, 0.886, 1),
          brown: Float32Array.of(0.647, 0.165, 0.165, 1),
          burlywood: Float32Array.of(0.871, 0.722, 0.529, 1),
          cadetblue: Float32Array.of(0.373, 0.62, 0.627, 1),
          chartreuse: Float32Array.of(0.498, 1, 0, 1),
          chocolate: Float32Array.of(0.824, 0.412, 0.118, 1),
          coral: Float32Array.of(1, 0.498, 0.314, 1),
          cornflowerblue: Float32Array.of(0.392, 0.584, 0.929, 1),
          cornsilk: Float32Array.of(1, 0.973, 0.863, 1),
          crimson: Float32Array.of(0.863, 0.078, 0.235, 1),
          cyan: Float32Array.of(0, 1, 1, 1),
          darkblue: Float32Array.of(0, 0, 0.545, 1),
          darkcyan: Float32Array.of(0, 0.545, 0.545, 1),
          darkgoldenrod: Float32Array.of(0.722, 0.525, 0.043, 1),
          darkgray: Float32Array.of(0.663, 0.663, 0.663, 1),
          darkgreen: Float32Array.of(0, 0.392, 0, 1),
          darkgrey: Float32Array.of(0.663, 0.663, 0.663, 1),
          darkkhaki: Float32Array.of(0.741, 0.718, 0.42, 1),
          darkmagenta: Float32Array.of(0.545, 0, 0.545, 1),
          darkolivegreen: Float32Array.of(0.333, 0.42, 0.184, 1),
          darkorange: Float32Array.of(1, 0.549, 0, 1),
          darkorchid: Float32Array.of(0.6, 0.196, 0.8, 1),
          darkred: Float32Array.of(0.545, 0, 0, 1),
          darksalmon: Float32Array.of(0.914, 0.588, 0.478, 1),
          darkseagreen: Float32Array.of(0.561, 0.737, 0.561, 1),
          darkslateblue: Float32Array.of(0.282, 0.239, 0.545, 1),
          darkslategray: Float32Array.of(0.184, 0.31, 0.31, 1),
          darkslategrey: Float32Array.of(0.184, 0.31, 0.31, 1),
          darkturquoise: Float32Array.of(0, 0.808, 0.82, 1),
          darkviolet: Float32Array.of(0.58, 0, 0.827, 1),
          deeppink: Float32Array.of(1, 0.078, 0.576, 1),
          deepskyblue: Float32Array.of(0, 0.749, 1, 1),
          dimgray: Float32Array.of(0.412, 0.412, 0.412, 1),
          dimgrey: Float32Array.of(0.412, 0.412, 0.412, 1),
          dodgerblue: Float32Array.of(0.118, 0.565, 1, 1),
          firebrick: Float32Array.of(0.698, 0.133, 0.133, 1),
          floralwhite: Float32Array.of(1, 0.98, 0.941, 1),
          forestgreen: Float32Array.of(0.133, 0.545, 0.133, 1),
          fuchsia: Float32Array.of(1, 0, 1, 1),
          gainsboro: Float32Array.of(0.863, 0.863, 0.863, 1),
          ghostwhite: Float32Array.of(0.973, 0.973, 1, 1),
          gold: Float32Array.of(1, 0.843, 0, 1),
          goldenrod: Float32Array.of(0.855, 0.647, 0.125, 1),
          gray: Float32Array.of(0.502, 0.502, 0.502, 1),
          green: Float32Array.of(0, 0.502, 0, 1),
          greenyellow: Float32Array.of(0.678, 1, 0.184, 1),
          grey: Float32Array.of(0.502, 0.502, 0.502, 1),
          honeydew: Float32Array.of(0.941, 1, 0.941, 1),
          hotpink: Float32Array.of(1, 0.412, 0.706, 1),
          indianred: Float32Array.of(0.804, 0.361, 0.361, 1),
          indigo: Float32Array.of(0.294, 0, 0.51, 1),
          ivory: Float32Array.of(1, 1, 0.941, 1),
          khaki: Float32Array.of(0.941, 0.902, 0.549, 1),
          lavender: Float32Array.of(0.902, 0.902, 0.98, 1),
          lavenderblush: Float32Array.of(1, 0.941, 0.961, 1),
          lawngreen: Float32Array.of(0.486, 0.988, 0, 1),
          lemonchiffon: Float32Array.of(1, 0.98, 0.804, 1),
          lightblue: Float32Array.of(0.678, 0.847, 0.902, 1),
          lightcoral: Float32Array.of(0.941, 0.502, 0.502, 1),
          lightcyan: Float32Array.of(0.878, 1, 1, 1),
          lightgoldenrodyellow: Float32Array.of(0.98, 0.98, 0.824, 1),
          lightgray: Float32Array.of(0.827, 0.827, 0.827, 1),
          lightgreen: Float32Array.of(0.565, 0.933, 0.565, 1),
          lightgrey: Float32Array.of(0.827, 0.827, 0.827, 1),
          lightpink: Float32Array.of(1, 0.714, 0.757, 1),
          lightsalmon: Float32Array.of(1, 0.627, 0.478, 1),
          lightseagreen: Float32Array.of(0.125, 0.698, 0.667, 1),
          lightskyblue: Float32Array.of(0.529, 0.808, 0.98, 1),
          lightslategray: Float32Array.of(0.467, 0.533, 0.6, 1),
          lightslategrey: Float32Array.of(0.467, 0.533, 0.6, 1),
          lightsteelblue: Float32Array.of(0.69, 0.769, 0.871, 1),
          lightyellow: Float32Array.of(1, 1, 0.878, 1),
          lime: Float32Array.of(0, 1, 0, 1),
          limegreen: Float32Array.of(0.196, 0.804, 0.196, 1),
          linen: Float32Array.of(0.98, 0.941, 0.902, 1),
          magenta: Float32Array.of(1, 0, 1, 1),
          maroon: Float32Array.of(0.502, 0, 0, 1),
          mediumaquamarine: Float32Array.of(0.4, 0.804, 0.667, 1),
          mediumblue: Float32Array.of(0, 0, 0.804, 1),
          mediumorchid: Float32Array.of(0.729, 0.333, 0.827, 1),
          mediumpurple: Float32Array.of(0.576, 0.439, 0.859, 1),
          mediumseagreen: Float32Array.of(0.235, 0.702, 0.443, 1),
          mediumslateblue: Float32Array.of(0.482, 0.408, 0.933, 1),
          mediumspringgreen: Float32Array.of(0, 0.98, 0.604, 1),
          mediumturquoise: Float32Array.of(0.282, 0.82, 0.8, 1),
          mediumvioletred: Float32Array.of(0.78, 0.082, 0.522, 1),
          midnightblue: Float32Array.of(0.098, 0.098, 0.439, 1),
          mintcream: Float32Array.of(0.961, 1, 0.98, 1),
          mistyrose: Float32Array.of(1, 0.894, 0.882, 1),
          moccasin: Float32Array.of(1, 0.894, 0.71, 1),
          navajowhite: Float32Array.of(1, 0.871, 0.678, 1),
          navy: Float32Array.of(0, 0, 0.502, 1),
          oldlace: Float32Array.of(0.992, 0.961, 0.902, 1),
          olive: Float32Array.of(0.502, 0.502, 0, 1),
          olivedrab: Float32Array.of(0.42, 0.557, 0.137, 1),
          orange: Float32Array.of(1, 0.647, 0, 1),
          orangered: Float32Array.of(1, 0.271, 0, 1),
          orchid: Float32Array.of(0.855, 0.439, 0.839, 1),
          palegoldenrod: Float32Array.of(0.933, 0.91, 0.667, 1),
          palegreen: Float32Array.of(0.596, 0.984, 0.596, 1),
          paleturquoise: Float32Array.of(0.686, 0.933, 0.933, 1),
          palevioletred: Float32Array.of(0.859, 0.439, 0.576, 1),
          papayawhip: Float32Array.of(1, 0.937, 0.835, 1),
          peachpuff: Float32Array.of(1, 0.855, 0.725, 1),
          peru: Float32Array.of(0.804, 0.522, 0.247, 1),
          pink: Float32Array.of(1, 0.753, 0.796, 1),
          plum: Float32Array.of(0.867, 0.627, 0.867, 1),
          powderblue: Float32Array.of(0.69, 0.878, 0.902, 1),
          purple: Float32Array.of(0.502, 0, 0.502, 1),
          rebeccapurple: Float32Array.of(0.4, 0.2, 0.6, 1),
          red: Float32Array.of(1, 0, 0, 1),
          rosybrown: Float32Array.of(0.737, 0.561, 0.561, 1),
          royalblue: Float32Array.of(0.255, 0.412, 0.882, 1),
          saddlebrown: Float32Array.of(0.545, 0.271, 0.075, 1),
          salmon: Float32Array.of(0.98, 0.502, 0.447, 1),
          sandybrown: Float32Array.of(0.957, 0.643, 0.376, 1),
          seagreen: Float32Array.of(0.18, 0.545, 0.341, 1),
          seashell: Float32Array.of(1, 0.961, 0.933, 1),
          sienna: Float32Array.of(0.627, 0.322, 0.176, 1),
          silver: Float32Array.of(0.753, 0.753, 0.753, 1),
          skyblue: Float32Array.of(0.529, 0.808, 0.922, 1),
          slateblue: Float32Array.of(0.416, 0.353, 0.804, 1),
          slategray: Float32Array.of(0.439, 0.502, 0.565, 1),
          slategrey: Float32Array.of(0.439, 0.502, 0.565, 1),
          snow: Float32Array.of(1, 0.98, 0.98, 1),
          springgreen: Float32Array.of(0, 1, 0.498, 1),
          steelblue: Float32Array.of(0.275, 0.51, 0.706, 1),
          tan: Float32Array.of(0.824, 0.706, 0.549, 1),
          teal: Float32Array.of(0, 0.502, 0.502, 1),
          thistle: Float32Array.of(0.847, 0.749, 0.847, 1),
          tomato: Float32Array.of(1, 0.388, 0.278, 1),
          transparent: Float32Array.of(0, 0, 0, 0),
          turquoise: Float32Array.of(0.251, 0.878, 0.816, 1),
          violet: Float32Array.of(0.933, 0.51, 0.933, 1),
          wheat: Float32Array.of(0.961, 0.871, 0.702, 1),
          white: Float32Array.of(1, 1, 1, 1),
          whitesmoke: Float32Array.of(0.961, 0.961, 0.961, 1),
          yellow: Float32Array.of(1, 1, 0, 1),
          yellowgreen: Float32Array.of(0.604, 0.804, 0.196, 1),
        };
        a._testing.parseColor = g;
        a._testing.colorToString = d;
        var wa = RegExp(
            "(italic|oblique|normal|)\\s*(small-caps|normal|)\\s*(bold|bolder|lighter|[1-9]00|normal|)\\s*([\\d\\.]+)(px|pt|pc|in|cm|mm|%|em|ex|ch|rem|q)(.+)"
          ),
          ma = {
            "Noto Mono": {
              "*": null
            },
            monospace: {
              "*": null
            }
          };
        a._testing.parseFontString = l;
        a.MakeCanvas = function (G, k) {
          return (G = a.MakeSurface(G, k)) ? new x(G) : null;
        };
        a.ImageData = function () {
          if (2 === arguments.length) {
            var G = arguments[0],
              k = arguments[1];
            return new J(new Uint8ClampedArray(4 * G * k), G, k);
          }
          if (3 === arguments.length) {
            var p = arguments[0];
            if (p.prototype.constructor !== Uint8ClampedArray)
              throw "bytes must be given as a Uint8ClampedArray";
            G = arguments[1];
            k = arguments[2];
            if (p % 4) throw "bytes must be given in a multiple of 4";
            if (p % G) throw "bytes must divide evenly by width";
            if (k && k !== p / (4 * G)) throw "invalid height given";
            return new J(p, G, p / (4 * G));
          }
          throw (
            "invalid number of arguments - takes 2 or 3, saw " +
            arguments.length
          );
        };
      })();
    })(w);
    var ta = Object.assign({}, w),
      ua = "./this.program",
      xa = (a, b) => {
        throw b;
      },
      ya = "object" == typeof window,
      za = "function" == typeof importScripts,
      Aa =
      "object" == typeof process &&
      "object" == typeof process.versions &&
      "string" == typeof process.versions.node,
      Ca = "",
      Da,
      Ea,
      Fa;
    if (Aa) {
      var fs = require("fs"),
        Ga = require("path");
      Ca = za ? Ga.dirname(Ca) + "/" : __dirname + "/";
      Da = (a, b) => {
        a = a.startsWith("file://") ? new URL(a) : Ga.normalize(a);
        return fs.readFileSync(a, b ? void 0 : "utf8");
      };
      Fa = (a) => {
        a = Da(a, !0);
        a.buffer || (a = new Uint8Array(a));
        return a;
      };
      Ea = (a, b, c, f = !0) => {
        a = a.startsWith("file://") ? new URL(a) : Ga.normalize(a);
        fs.readFile(a, f ? void 0 : "utf8", (h, m) => {
          h ? c(h) : b(f ? m.buffer : m);
        });
      };
      !w.thisProgram &&
        1 < process.argv.length &&
        (ua = process.argv[1].replace(/\\/g, "/"));
      process.argv.slice(2);
      xa = (a, b) => {
        process.exitCode = a;
        throw b;
      };
      w.inspect = () => "[Emscripten Module object]";
    } else if (ya || za)
      za ?
      (Ca = self.location.href) :
      "undefined" != typeof document &&
      document.currentScript &&
      (Ca = document.currentScript.src),
      _scriptDir && (Ca = _scriptDir),
      0 !== Ca.indexOf("blob:") ?
      (Ca = Ca.substr(0, Ca.replace(/[?#].*/, "").lastIndexOf("/") + 1)) :
      (Ca = ""),
      (Da = (a) => {
        var b = new XMLHttpRequest();
        b.open("GET", a, !1);
        b.send(null);
        return b.responseText;
      }),
      za &&
      (Fa = (a) => {
        var b = new XMLHttpRequest();
        b.open("GET", a, !1);
        b.responseType = "arraybuffer";
        b.send(null);
        return new Uint8Array(b.response);
      }),
      (Ea = (a, b, c) => {
        var f = new XMLHttpRequest();
        f.open("GET", a, !0);
        f.responseType = "arraybuffer";
        f.onload = () => {
          200 == f.status || (0 == f.status && f.response) ?
            b(f.response) :
            c();
        };
        f.onerror = c;
        f.send(null);
      });
    var Ha = w.print || console.log.bind(console),
      Ja = w.printErr || console.error.bind(console);
    Object.assign(w, ta);
    ta = null;
    w.thisProgram && (ua = w.thisProgram);
    w.quit && (xa = w.quit);
    var Ka;
    w.wasmBinary && (Ka = w.wasmBinary);
    var noExitRuntime = w.noExitRuntime || !0;
    "object" != typeof WebAssembly && La("no native wasm support detected");
    var Ma,
      Q,
      Pa = !1,
      Qa,
      K,
      Ra,
      Sa,
      R,
      Ua,
      V,
      Va;

    function Wa() {
      var a = Ma.buffer;
      w.HEAP8 = Qa = new Int8Array(a);
      w.HEAP16 = Ra = new Int16Array(a);
      w.HEAP32 = R = new Int32Array(a);
      w.HEAPU8 = K = new Uint8Array(a);
      w.HEAPU16 = Sa = new Uint16Array(a);
      w.HEAPU32 = Ua = new Uint32Array(a);
      w.HEAPF32 = V = new Float32Array(a);
      w.HEAPF64 = Va = new Float64Array(a);
    }
    var Xa,
      Ya = [],
      Za = [],
      bb = [];

    function cb() {
      var a = w.preRun.shift();
      Ya.unshift(a);
    }
    var db = 0,
      eb = null,
      fb = null;

    function La(a) {
      if (w.onAbort) w.onAbort(a);
      a = "Aborted(" + a + ")";
      Ja(a);
      Pa = !0;
      a = new WebAssembly.RuntimeError(
        a + ". Build with -sASSERTIONS for more info."
      );
      fa(a);
      throw a;
    }

    function kb(a) {
      return a.startsWith("data:application/octet-stream;base64,");
    }
    var lb;
    lb = "canvaskit.wasm";
    if (!kb(lb)) {
      var mb = lb;
      lb = w.locateFile ? w.locateFile(mb, Ca) : Ca + mb;
    }

    function nb(a) {
      if (a == lb && Ka) return new Uint8Array(Ka);
      if (Fa) return Fa(a);
      throw "both async and sync fetching of the wasm failed";
    }

    function ob(a) {
      if (!Ka && (ya || za)) {
        if ("function" == typeof fetch && !a.startsWith("file://"))
          return fetch(a, {
              credentials: "same-origin"
            })
            .then((b) => {
              if (!b.ok) throw "failed to load wasm binary file at '" + a + "'";
              return b.arrayBuffer();
            })
            .catch(() => nb(a));
        if (Ea)
          return new Promise((b, c) => {
            Ea(a, (f) => b(new Uint8Array(f)), c);
          });
      }
      return Promise.resolve().then(() => nb(a));
    }

    function pb(a, b, c) {
      return WebAssembly.instantiate('/canvaskit/pages/canvaskit.wasm.br', b)
        .then((f) => f)
        .then(c, (f) => {
          Ja("failed to asynchronously prepare wasm: " + f);
          La(f);
        });
    }

    function qb(a, b) {
      var c = lb;
      return Ka ||
        "function" != typeof WebAssembly.instantiateStreaming ||
        kb(c) ||
        c.startsWith("file://") ||
        Aa ||
        "function" != typeof fetch ?
        pb(c, a, b) :
        fetch(c, {
          credentials: "same-origin"
        }).then((f) =>
          WebAssembly.instantiateStreaming(f, a).then(b, function (h) {
            Ja("wasm streaming compile failed: " + h);
            Ja("falling back to ArrayBuffer instantiation");
            return pb(c, a, b);
          })
        );
    }

    function rb(a) {
      this.name = "ExitStatus";
      this.message = `Program terminated with exit(${a})`;
      this.status = a;
    }
    var sb = (a) => {
        for (; 0 < a.length;) a.shift()(w);
      },
      tb = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0,
      ub = (a, b, c) => {
        var f = b + c;
        for (c = b; a[c] && !(c >= f);) ++c;
        if (16 < c - b && a.buffer && tb) return tb.decode(a.subarray(b, c));
        for (f = ""; b < c;) {
          var h = a[b++];
          if (h & 128) {
            var m = a[b++] & 63;
            if (192 == (h & 224)) f += String.fromCharCode(((h & 31) << 6) | m);
            else {
              var u = a[b++] & 63;
              h =
                224 == (h & 240) ?
                ((h & 15) << 12) | (m << 6) | u :
                ((h & 7) << 18) | (m << 12) | (u << 6) | (a[b++] & 63);
              65536 > h ?
                (f += String.fromCharCode(h)) :
                ((h -= 65536),
                  (f += String.fromCharCode(
                    55296 | (h >> 10),
                    56320 | (h & 1023)
                  )));
            }
          } else f += String.fromCharCode(h);
        }
        return f;
      },
      vb = {};

    function wb(a) {
      for (; a.length;) {
        var b = a.pop();
        a.pop()(b);
      }
    }

    function xb(a) {
      return this.fromWireType(R[a >> 2]);
    }
    var zb = {},
      Ab = {},
      Bb = {},
      Cb = void 0;

    function Db(a) {
      throw new Cb(a);
    }

    function Eb(a, b, c) {
      function f(n) {
        n = c(n);
        n.length !== a.length && Db("Mismatched type converter count");
        for (var q = 0; q < a.length; ++q) Fb(a[q], n[q]);
      }
      a.forEach(function (n) {
        Bb[n] = b;
      });
      var h = Array(b.length),
        m = [],
        u = 0;
      b.forEach((n, q) => {
        Ab.hasOwnProperty(n) ?
          (h[q] = Ab[n]) :
          (m.push(n),
            zb.hasOwnProperty(n) || (zb[n] = []),
            zb[n].push(() => {
              h[q] = Ab[n];
              ++u;
              u === m.length && f(h);
            }));
      });
      0 === m.length && f(h);
    }

    function Gb(a) {
      switch (a) {
        case 1:
          return 0;
        case 2:
          return 1;
        case 4:
          return 2;
        case 8:
          return 3;
        default:
          throw new TypeError(`Unknown type size: ${a}`);
      }
    }
    var Hb = void 0;

    function Ib(a) {
      for (var b = ""; K[a];) b += Hb[K[a++]];
      return b;
    }
    var Jb = void 0;

    function X(a) {
      throw new Jb(a);
    }

    function Kb(a, b, c = {}) {
      var f = b.name;
      a || X(`type "${f}" must have a positive integer typeid pointer`);
      if (Ab.hasOwnProperty(a)) {
        if (c.Uf) return;
        X(`Cannot register type '${f}' twice`);
      }
      Ab[a] = b;
      delete Bb[a];
      zb.hasOwnProperty(a) &&
        ((b = zb[a]), delete zb[a], b.forEach((h) => h()));
    }

    function Fb(a, b, c = {}) {
      if (!("argPackAdvance" in b))
        throw new TypeError(
          "registerType registeredInstance requires argPackAdvance"
        );
      Kb(a, b, c);
    }

    function Lb(a) {
      X(a.Hd.Td.Nd.name + " instance already deleted");
    }
    var Mb = !1;

    function Nb() {}

    function Ob(a) {
      --a.count.value;
      0 === a.count.value && (a.Wd ? a.ce.ie(a.Wd) : a.Td.Nd.ie(a.Pd));
    }

    function Pb(a, b, c) {
      if (b === c) return a;
      if (void 0 === c.Yd) return null;
      a = Pb(a, b, c.Yd);
      return null === a ? null : c.Kf(a);
    }
    var Qb = {},
      Rb = [];

    function Sb() {
      for (; Rb.length;) {
        var a = Rb.pop();
        a.Hd.Ce = !1;
        a["delete"]();
      }
    }
    var Tb = void 0,
      Ub = {};

    function ac(a, b) {
      for (void 0 === b && X("ptr should not be undefined"); a.Yd;)
        (b = a.Me(b)), (a = a.Yd);
      return Ub[b];
    }

    function bc(a, b) {
      (b.Td && b.Pd) || Db("makeClassHandle requires ptr and ptrType");
      !!b.ce !== !!b.Wd &&
        Db("Both smartPtrType and smartPtr must be specified");
      b.count = {
        value: 1
      };
      return cc(Object.create(a, {
        Hd: {
          value: b
        }
      }));
    }

    function cc(a) {
      if ("undefined" === typeof FinalizationRegistry)
        return (cc = (b) => b), a;
      Mb = new FinalizationRegistry((b) => {
        Ob(b.Hd);
      });
      cc = (b) => {
        var c = b.Hd;
        c.Wd && Mb.register(b, {
          Hd: c
        }, b);
        return b;
      };
      Nb = (b) => {
        Mb.unregister(b);
      };
      return cc(a);
    }

    function dc() {}

    function ec(a) {
      if (void 0 === a) return "_unknown";
      a = a.replace(/[^a-zA-Z0-9_]/g, "$");
      var b = a.charCodeAt(0);
      return 48 <= b && 57 >= b ? `_${a}` : a;
    }

    function fc(a, b) {
      a = ec(a);
      return {
        [a]: function () {
          return b.apply(this, arguments);
        },
      } [a];
    }

    function gc(a, b, c) {
      if (void 0 === a[b].Vd) {
        var f = a[b];
        a[b] = function () {
          a[b].Vd.hasOwnProperty(arguments.length) ||
            X(
              `Function '${c}' called with an invalid number of arguments (${arguments.length}) - expects one of (${a[b].Vd})!`
            );
          return a[b].Vd[arguments.length].apply(this, arguments);
        };
        a[b].Vd = [];
        a[b].Vd[f.Ae] = f;
      }
    }

    function hc(a, b, c) {
      w.hasOwnProperty(a) ?
        ((void 0 === c || (void 0 !== w[a].Vd && void 0 !== w[a].Vd[c])) &&
          X(`Cannot register public name '${a}' twice`),
          gc(w, a, a),
          w.hasOwnProperty(c) &&
          X(
            `Cannot register multiple overloads of a function with the same number of arguments (${c})!`
          ),
          (w[a].Vd[c] = b)) :
        ((w[a] = b), void 0 !== c && (w[a].rg = c));
    }

    function ic(a, b, c, f, h, m, u, n) {
      this.name = a;
      this.constructor = b;
      this.De = c;
      this.ie = f;
      this.Yd = h;
      this.Pf = m;
      this.Me = u;
      this.Kf = n;
      this.ag = [];
    }

    function jc(a, b, c) {
      for (; b !== c;)
        b.Me ||
        X(
          `Expected null or instance of ${c.name}, got an instance of ${b.name}`
        ),
        (a = b.Me(a)),
        (b = b.Yd);
      return a;
    }

    function kc(a, b) {
      if (null === b)
        return this.ef && X(`null is not a valid ${this.name}`), 0;
      b.Hd || X(`Cannot pass "${lc(b)}" as a ${this.name}`);
      b.Hd.Pd ||
        X(`Cannot pass deleted object as a pointer of type ${this.name}`);
      return jc(b.Hd.Pd, b.Hd.Td.Nd, this.Nd);
    }

    function mc(a, b) {
      if (null === b) {
        this.ef && X(`null is not a valid ${this.name}`);
        if (this.Te) {
          var c = this.ff();
          null !== a && a.push(this.ie, c);
          return c;
        }
        return 0;
      }
      b.Hd || X(`Cannot pass "${lc(b)}" as a ${this.name}`);
      b.Hd.Pd ||
        X(`Cannot pass deleted object as a pointer of type ${this.name}`);
      !this.Se &&
        b.Hd.Td.Se &&
        X(
          `Cannot convert argument of type ${
            b.Hd.ce ? b.Hd.ce.name : b.Hd.Td.name
          } to parameter type ${this.name}`
        );
      c = jc(b.Hd.Pd, b.Hd.Td.Nd, this.Nd);
      if (this.Te)
        switch (
          (void 0 === b.Hd.Wd &&
            X("Passing raw pointer to smart pointer is illegal"),
            this.fg)
        ) {
          case 0:
            b.Hd.ce === this ?
              (c = b.Hd.Wd) :
              X(
                `Cannot convert argument of type ${
                    b.Hd.ce ? b.Hd.ce.name : b.Hd.Td.name
                  } to parameter type ${this.name}`
              );
            break;
          case 1:
            c = b.Hd.Wd;
            break;
          case 2:
            if (b.Hd.ce === this) c = b.Hd.Wd;
            else {
              var f = b.clone();
              c = this.bg(
                c,
                nc(function () {
                  f["delete"]();
                })
              );
              null !== a && a.push(this.ie, c);
            }
            break;
          default:
            X("Unsupporting sharing policy");
        }
      return c;
    }

    function oc(a, b) {
      if (null === b)
        return this.ef && X(`null is not a valid ${this.name}`), 0;
      b.Hd || X(`Cannot pass "${lc(b)}" as a ${this.name}`);
      b.Hd.Pd ||
        X(`Cannot pass deleted object as a pointer of type ${this.name}`);
      b.Hd.Td.Se &&
        X(
          `Cannot convert argument of type ${b.Hd.Td.name} to parameter type ${this.name}`
        );
      return jc(b.Hd.Pd, b.Hd.Td.Nd, this.Nd);
    }

    function pc(a, b, c, f, h, m, u, n, q, v, E) {
      this.name = a;
      this.Nd = b;
      this.ef = c;
      this.Se = f;
      this.Te = h;
      this.$f = m;
      this.fg = u;
      this.tf = n;
      this.ff = q;
      this.bg = v;
      this.ie = E;
      h || void 0 !== b.Yd ?
        (this.toWireType = mc) :
        ((this.toWireType = f ? kc : oc), (this.be = null));
    }

    function qc(a, b, c) {
      w.hasOwnProperty(a) || Db("Replacing nonexistant public symbol");
      void 0 !== w[a].Vd && void 0 !== c ?
        (w[a].Vd[c] = b) :
        ((w[a] = b), (w[a].Ae = c));
    }
    var rc = (a, b) => {
      var c = [];
      return function () {
        c.length = 0;
        Object.assign(c, arguments);
        if (a.includes("j")) {
          var f = w["dynCall_" + a];
          f = c && c.length ? f.apply(null, [b].concat(c)) : f.call(null, b);
        } else f = Xa.get(b).apply(null, c);
        return f;
      };
    };

    function sc(a, b) {
      a = Ib(a);
      var c = a.includes("j") ? rc(a, b) : Xa.get(b);
      "function" != typeof c &&
        X(`unknown function pointer with signature ${a}: ${b}`);
      return c;
    }
    var tc = void 0;

    function uc(a) {
      a = vc(a);
      var b = Ib(a);
      wc(a);
      return b;
    }

    function Dc(a, b) {
      function c(m) {
        h[m] || Ab[m] || (Bb[m] ? Bb[m].forEach(c) : (f.push(m), (h[m] = !0)));
      }
      var f = [],
        h = {};
      b.forEach(c);
      throw new tc(`${a}: ` + f.map(uc).join([", "]));
    }

    function Ec(a, b, c, f, h) {
      var m = b.length;
      2 > m &&
        X(
          "argTypes array size mismatch! Must at least get return value and 'this' types!"
        );
      var u = null !== b[1] && null !== c,
        n = !1;
      for (c = 1; c < b.length; ++c)
        if (null !== b[c] && void 0 === b[c].be) {
          n = !0;
          break;
        }
      var q = "void" !== b[0].name,
        v = m - 2,
        E = Array(v),
        I = [],
        L = [];
      return function () {
        arguments.length !== v &&
          X(
            `function ${a} called with ${arguments.length} arguments, expected ${v} args!`
          );
        L.length = 0;
        I.length = u ? 2 : 1;
        I[0] = h;
        if (u) {
          var y = b[1].toWireType(L, this);
          I[1] = y;
        }
        for (var N = 0; N < v; ++N)
          (E[N] = b[N + 2].toWireType(L, arguments[N])), I.push(E[N]);
        N = f.apply(null, I);
        if (n) wb(L);
        else
          for (var T = u ? 1 : 2; T < b.length; T++) {
            var S = 1 === T ? y : E[T - 2];
            null !== b[T].be && b[T].be(S);
          }
        y = q ? b[0].fromWireType(N) : void 0;
        return y;
      };
    }

    function Fc(a, b) {
      for (var c = [], f = 0; f < a; f++) c.push(Ua[(b + 4 * f) >> 2]);
      return c;
    }

    function Gc() {
      this.he = [void 0];
      this.qf = [];
    }
    var Hc = new Gc();

    function Ic(a) {
      a >= Hc.Ee && 0 === --Hc.get(a).uf && Hc.zf(a);
    }
    var Jc = (a) => {
        a || X("Cannot use deleted val. handle = " + a);
        return Hc.get(a).value;
      },
      nc = (a) => {
        switch (a) {
          case void 0:
            return 1;
          case null:
            return 2;
          case !0:
            return 3;
          case !1:
            return 4;
          default:
            return Hc.yf({
              uf: 1,
              value: a
            });
        }
      };

    function Kc(a, b, c) {
      switch (b) {
        case 0:
          return function (f) {
            return this.fromWireType((c ? Qa : K)[f]);
          };
        case 1:
          return function (f) {
            return this.fromWireType((c ? Ra : Sa)[f >> 1]);
          };
        case 2:
          return function (f) {
            return this.fromWireType((c ? R : Ua)[f >> 2]);
          };
        default:
          throw new TypeError("Unknown integer type: " + a);
      }
    }

    function Lc(a, b) {
      var c = Ab[a];
      void 0 === c && X(b + " has unknown type " + uc(a));
      return c;
    }

    function lc(a) {
      if (null === a) return "null";
      var b = typeof a;
      return "object" === b || "array" === b || "function" === b ?
        a.toString() :
        "" + a;
    }

    function Mc(a, b) {
      switch (b) {
        case 2:
          return function (c) {
            return this.fromWireType(V[c >> 2]);
          };
        case 3:
          return function (c) {
            return this.fromWireType(Va[c >> 3]);
          };
        default:
          throw new TypeError("Unknown float type: " + a);
      }
    }

    function Nc(a, b, c) {
      switch (b) {
        case 0:
          return c ?
            function (f) {
              return Qa[f];
            } :
            function (f) {
              return K[f];
            };
        case 1:
          return c ?
            function (f) {
              return Ra[f >> 1];
            } :
            function (f) {
              return Sa[f >> 1];
            };
        case 2:
          return c ?
            function (f) {
              return R[f >> 2];
            } :
            function (f) {
              return Ua[f >> 2];
            };
        default:
          throw new TypeError("Unknown integer type: " + a);
      }
    }
    var sa = (a, b, c, f) => {
        if (!(0 < f)) return 0;
        var h = c;
        f = c + f - 1;
        for (var m = 0; m < a.length; ++m) {
          var u = a.charCodeAt(m);
          if (55296 <= u && 57343 >= u) {
            var n = a.charCodeAt(++m);
            u = (65536 + ((u & 1023) << 10)) | (n & 1023);
          }
          if (127 >= u) {
            if (c >= f) break;
            b[c++] = u;
          } else {
            if (2047 >= u) {
              if (c + 1 >= f) break;
              b[c++] = 192 | (u >> 6);
            } else {
              if (65535 >= u) {
                if (c + 2 >= f) break;
                b[c++] = 224 | (u >> 12);
              } else {
                if (c + 3 >= f) break;
                b[c++] = 240 | (u >> 18);
                b[c++] = 128 | ((u >> 12) & 63);
              }
              b[c++] = 128 | ((u >> 6) & 63);
            }
            b[c++] = 128 | (u & 63);
          }
        }
        b[c] = 0;
        return c - h;
      },
      ra = (a) => {
        for (var b = 0, c = 0; c < a.length; ++c) {
          var f = a.charCodeAt(c);
          127 >= f ?
            b++
            :
            2047 >= f ?
            (b += 2) :
            55296 <= f && 57343 >= f ?
            ((b += 4), ++c) :
            (b += 3);
        }
        return b;
      },
      Oc =
      "undefined" != typeof TextDecoder ?
      new TextDecoder("utf-16le") :
      void 0,
      Pc = (a, b) => {
        var c = a >> 1;
        for (var f = c + b / 2; !(c >= f) && Sa[c];) ++c;
        c <<= 1;
        if (32 < c - a && Oc) return Oc.decode(K.subarray(a, c));
        c = "";
        for (f = 0; !(f >= b / 2); ++f) {
          var h = Ra[(a + 2 * f) >> 1];
          if (0 == h) break;
          c += String.fromCharCode(h);
        }
        return c;
      },
      Qc = (a, b, c) => {
        void 0 === c && (c = 2147483647);
        if (2 > c) return 0;
        c -= 2;
        var f = b;
        c = c < 2 * a.length ? c / 2 : a.length;
        for (var h = 0; h < c; ++h)(Ra[b >> 1] = a.charCodeAt(h)), (b += 2);
        Ra[b >> 1] = 0;
        return b - f;
      },
      Rc = (a) => 2 * a.length,
      Sc = (a, b) => {
        for (var c = 0, f = ""; !(c >= b / 4);) {
          var h = R[(a + 4 * c) >> 2];
          if (0 == h) break;
          ++c;
          65536 <= h ?
            ((h -= 65536),
              (f += String.fromCharCode(55296 | (h >> 10), 56320 | (h & 1023)))) :
            (f += String.fromCharCode(h));
        }
        return f;
      },
      Tc = (a, b, c) => {
        void 0 === c && (c = 2147483647);
        if (4 > c) return 0;
        var f = b;
        c = f + c - 4;
        for (var h = 0; h < a.length; ++h) {
          var m = a.charCodeAt(h);
          if (55296 <= m && 57343 >= m) {
            var u = a.charCodeAt(++h);
            m = (65536 + ((m & 1023) << 10)) | (u & 1023);
          }
          R[b >> 2] = m;
          b += 4;
          if (b + 4 > c) break;
        }
        R[b >> 2] = 0;
        return b - f;
      },
      Uc = (a) => {
        for (var b = 0, c = 0; c < a.length; ++c) {
          var f = a.charCodeAt(c);
          55296 <= f && 57343 >= f && ++c;
          b += 4;
        }
        return b;
      },
      Vc = {};

    function Wc(a) {
      var b = Vc[a];
      return void 0 === b ? Ib(a) : b;
    }
    var Xc = [];

    function Yc() {
      function a(b) {
        b.$$$embind_global$$$ = b;
        var c =
          "object" == typeof $$$embind_global$$$ && b.$$$embind_global$$$ == b;
        c || delete b.$$$embind_global$$$;
        return c;
      }
      if ("object" == typeof globalThis) return globalThis;
      if ("object" == typeof $$$embind_global$$$) return $$$embind_global$$$;
      "object" == typeof global && a(global) ?
        ($$$embind_global$$$ = global) :
        "object" == typeof self && a(self) && ($$$embind_global$$$ = self);
      if ("object" == typeof $$$embind_global$$$) return $$$embind_global$$$;
      throw Error("unable to get global object.");
    }

    function Zc(a) {
      var b = Xc.length;
      Xc.push(a);
      return b;
    }

    function $c(a, b) {
      for (var c = Array(a), f = 0; f < a; ++f)
        c[f] = Lc(Ua[(b + 4 * f) >> 2], "parameter " + f);
      return c;
    }
    var ad = [];

    function bd(a) {
      var b = Array(a + 1);
      return function (c, f, h) {
        b[0] = c;
        for (var m = 0; m < a; ++m) {
          var u = Lc(Ua[(f + 4 * m) >> 2], "parameter " + m);
          b[m + 1] = u.readValueFromPointer(h);
          h += u.argPackAdvance;
        }
        c = new(c.bind.apply(c, b))();
        return nc(c);
      };
    }
    var cd = {};

    function dd(a) {
      var b = a.getExtension("ANGLE_instanced_arrays");
      b &&
        ((a.vertexAttribDivisor = function (c, f) {
            b.vertexAttribDivisorANGLE(c, f);
          }),
          (a.drawArraysInstanced = function (c, f, h, m) {
            b.drawArraysInstancedANGLE(c, f, h, m);
          }),
          (a.drawElementsInstanced = function (c, f, h, m, u) {
            b.drawElementsInstancedANGLE(c, f, h, m, u);
          }));
    }

    function ed(a) {
      var b = a.getExtension("OES_vertex_array_object");
      b &&
        ((a.createVertexArray = function () {
            return b.createVertexArrayOES();
          }),
          (a.deleteVertexArray = function (c) {
            b.deleteVertexArrayOES(c);
          }),
          (a.bindVertexArray = function (c) {
            b.bindVertexArrayOES(c);
          }),
          (a.isVertexArray = function (c) {
            return b.isVertexArrayOES(c);
          }));
    }

    function fd(a) {
      var b = a.getExtension("WEBGL_draw_buffers");
      b &&
        (a.drawBuffers = function (c, f) {
          b.drawBuffersWEBGL(c, f);
        });
    }
    var gd = 1,
      hd = [],
      jd = [],
      kd = [],
      ld = [],
      ia = [],
      md = [],
      nd = [],
      qa = [],
      od = [],
      pd = [],
      qd = {},
      rd = {},
      sd = 4;

    function td(a) {
      ud || (ud = a);
    }

    function ha(a) {
      for (var b = gd++, c = a.length; c < b; c++) a[c] = null;
      return b;
    }

    function na(a, b) {
      var c = a.getContext(GLVersion > 1 ? "webgl2" : "webgl", b);
      return c ? vd(c, b) : 0;
    }

    function vd(a, b) {
      var c = ha(qa),
        f = {
          handle: c,
          attributes: b,
          version: b.majorVersion,
          de: a
        };
      a.canvas && (a.canvas.xf = f);
      qa[c] = f;
      ("undefined" == typeof b.Lf || b.Lf) && yd(f);
      return c;
    }

    function oa(a) {
      A = qa[a];
      w.pg = Z = A && A.de;
      return !(a && !Z);
    }

    function yd(a) {
      a || (a = A);
      if (!a.Vf) {
        a.Vf = !0;
        var b = a.de;
        dd(b);
        ed(b);
        fd(b);
        b.mf = b.getExtension("WEBGL_draw_instanced_base_vertex_base_instance");
        b.sf = b.getExtension(
          "WEBGL_multi_draw_instanced_base_vertex_base_instance"
        );
        2 <= a.version &&
          (b.nf = b.getExtension("EXT_disjoint_timer_query_webgl2"));
        if (2 > a.version || !b.nf)
          b.nf = b.getExtension("EXT_disjoint_timer_query");
        b.qg = b.getExtension("WEBGL_multi_draw");
        (b.getSupportedExtensions() || []).forEach(function (c) {
          c.includes("lose_context") ||
            c.includes("debug") ||
            b.getExtension(c);
        });
      }
    }
    var A,
      ud,
      zd = {},
      Bd = () => {
        if (!Ad) {
          var a = {
              USER: "web_user",
              LOGNAME: "web_user",
              PATH: "/",
              PWD: "/",
              HOME: "/home/web_user",
              LANG: (
                ("object" == typeof navigator &&
                  navigator.languages &&
                  navigator.languages[0]) ||
                "C"
              ).replace("-", "_") + ".UTF-8",
              _: ua || "./this.program",
            },
            b;
          for (b in zd) void 0 === zd[b] ? delete a[b] : (a[b] = zd[b]);
          var c = [];
          for (b in a) c.push(`${b}=${a[b]}`);
          Ad = c;
        }
        return Ad;
      },
      Ad,
      Cd = [null, [],
        []
      ];

    function Dd(a) {
      Z.bindVertexArray(nd[a]);
    }

    function Ed(a, b) {
      for (var c = 0; c < a; c++) {
        var f = R[(b + 4 * c) >> 2];
        Z.deleteVertexArray(nd[f]);
        nd[f] = null;
      }
    }
    var Fd = [];

    function Gd(a, b, c, f) {
      Z.drawElements(a, b, c, f);
    }

    function Hd(a, b, c, f) {
      for (var h = 0; h < a; h++) {
        var m = Z[c](),
          u = m && ha(f);
        m ? ((m.name = u), (f[u] = m)) : td(1282);
        R[(b + 4 * h) >> 2] = u;
      }
    }

    function Id(a, b) {
      Hd(a, b, "createVertexArray", nd);
    }

    function Jd(a, b, c) {
      if (b) {
        var f = void 0;
        switch (a) {
          case 36346:
            f = 1;
            break;
          case 36344:
            0 != c && 1 != c && td(1280);
            return;
          case 34814:
          case 36345:
            f = 0;
            break;
          case 34466:
            var h = Z.getParameter(34467);
            f = h ? h.length : 0;
            break;
          case 33309:
            if (2 > A.version) {
              td(1282);
              return;
            }
            f = 2 * (Z.getSupportedExtensions() || []).length;
            break;
          case 33307:
          case 33308:
            if (2 > A.version) {
              td(1280);
              return;
            }
            f = 33307 == a ? 3 : 0;
        }
        if (void 0 === f)
          switch (((h = Z.getParameter(a)), typeof h)) {
            case "number":
              f = h;
              break;
            case "boolean":
              f = h ? 1 : 0;
              break;
            case "string":
              td(1280);
              return;
            case "object":
              if (null === h)
                switch (a) {
                  case 34964:
                  case 35725:
                  case 34965:
                  case 36006:
                  case 36007:
                  case 32873:
                  case 34229:
                  case 36662:
                  case 36663:
                  case 35053:
                  case 35055:
                  case 36010:
                  case 35097:
                  case 35869:
                  case 32874:
                  case 36389:
                  case 35983:
                  case 35368:
                  case 34068:
                    f = 0;
                    break;
                  default:
                    td(1280);
                    return;
                }
              else {
                if (
                  h instanceof Float32Array ||
                  h instanceof Uint32Array ||
                  h instanceof Int32Array ||
                  h instanceof Array
                ) {
                  for (a = 0; a < h.length; ++a)
                    switch (c) {
                      case 0:
                        R[(b + 4 * a) >> 2] = h[a];
                        break;
                      case 2:
                        V[(b + 4 * a) >> 2] = h[a];
                        break;
                      case 4:
                        Qa[(b + a) >> 0] = h[a] ? 1 : 0;
                    }
                  return;
                }
                try {
                  f = h.name | 0;
                } catch (m) {
                  td(1280);
                  Ja(
                    "GL_INVALID_ENUM in glGet" +
                    c +
                    "v: Unknown object returned from WebGL getParameter(" +
                    a +
                    ")! (error: " +
                    m +
                    ")"
                  );
                  return;
                }
              }
              break;
            default:
              td(1280);
              Ja(
                "GL_INVALID_ENUM in glGet" +
                c +
                "v: Native code calling glGet" +
                c +
                "v(" +
                a +
                ") and it returns " +
                h +
                " of type " +
                typeof h +
                "!"
              );
              return;
          }
        switch (c) {
          case 1:
            c = f;
            Ua[b >> 2] = c;
            Ua[(b + 4) >> 2] = (c - Ua[b >> 2]) / 4294967296;
            break;
          case 0:
            R[b >> 2] = f;
            break;
          case 2:
            V[b >> 2] = f;
            break;
          case 4:
            Qa[b >> 0] = f ? 1 : 0;
        }
      } else td(1281);
    }
    var Ld = (a) => {
      var b = ra(a) + 1,
        c = Kd(b);
      c && sa(a, K, c, b);
      return c;
    };

    function Md(a) {
      return "]" == a.slice(-1) && a.lastIndexOf("[");
    }

    function Nd(a) {
      a -= 5120;
      return 0 == a ?
        Qa :
        1 == a ?
        K :
        2 == a ?
        Ra :
        4 == a ?
        R :
        6 == a ?
        V :
        5 == a || 28922 == a || 28520 == a || 30779 == a || 30782 == a ?
        Ua :
        Sa;
    }

    function Od(a, b, c, f, h) {
      a = Nd(a);
      var m = 31 - Math.clz32(a.BYTES_PER_ELEMENT),
        u = sd;
      return a.subarray(
        h >> m,
        (h +
          f *
          ((c *
              ({
                5: 3,
                6: 4,
                8: 2,
                29502: 3,
                29504: 4,
                26917: 2,
                26918: 2,
                29846: 3,
                29847: 4,
              } [b - 6402] || 1) *
              (1 << m) +
              u -
              1) &
            -u)) >>
        m
      );
    }

    function Pd(a) {
      var b = Z.If;
      if (b) {
        var c = b.Le[a];
        "number" == typeof c &&
          (b.Le[a] = c =
            Z.getUniformLocation(b, b.vf[a] + (0 < c ? "[" + c + "]" : "")));
        return c;
      }
      td(1282);
    }
    var Qd = [],
      Rd = [],
      Sd = (a) => 0 === a % 4 && (0 !== a % 100 || 0 === a % 400),
      Td = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      Ud = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    function Vd(a) {
      var b = Array(ra(a) + 1);
      sa(a, b, 0, b.length);
      return b;
    }
    var Wd = (a, b, c, f) => {
      function h(y, N, T) {
        for (y = "number" == typeof y ? y.toString() : y || ""; y.length < N;)
          y = T[0] + y;
        return y;
      }

      function m(y, N) {
        return h(y, N, "0");
      }

      function u(y, N) {
        function T(pa) {
          return 0 > pa ? -1 : 0 < pa ? 1 : 0;
        }
        var S;
        0 === (S = T(y.getFullYear() - N.getFullYear())) &&
          0 === (S = T(y.getMonth() - N.getMonth())) &&
          (S = T(y.getDate() - N.getDate()));
        return S;
      }

      function n(y) {
        switch (y.getDay()) {
          case 0:
            return new Date(y.getFullYear() - 1, 11, 29);
          case 1:
            return y;
          case 2:
            return new Date(y.getFullYear(), 0, 3);
          case 3:
            return new Date(y.getFullYear(), 0, 2);
          case 4:
            return new Date(y.getFullYear(), 0, 1);
          case 5:
            return new Date(y.getFullYear() - 1, 11, 31);
          case 6:
            return new Date(y.getFullYear() - 1, 11, 30);
        }
      }

      function q(y) {
        var N = y.me;
        for (y = new Date(new Date(y.ne + 1900, 0, 1).getTime()); 0 < N;) {
          var T = y.getMonth(),
            S = (Sd(y.getFullYear()) ? Td : Ud)[T];
          if (N > S - y.getDate())
            (N -= S - y.getDate() + 1),
            y.setDate(1),
            11 > T ?
            y.setMonth(T + 1) :
            (y.setMonth(0), y.setFullYear(y.getFullYear() + 1));
          else {
            y.setDate(y.getDate() + N);
            break;
          }
        }
        T = new Date(y.getFullYear() + 1, 0, 4);
        N = n(new Date(y.getFullYear(), 0, 4));
        T = n(T);
        return 0 >= u(N, y) ?
          0 >= u(T, y) ?
          y.getFullYear() + 1 :
          y.getFullYear() :
          y.getFullYear() - 1;
      }
      var v = R[(f + 40) >> 2];
      f = {
        ng: R[f >> 2],
        mg: R[(f + 4) >> 2],
        Xe: R[(f + 8) >> 2],
        gf: R[(f + 12) >> 2],
        Ye: R[(f + 16) >> 2],
        ne: R[(f + 20) >> 2],
        fe: R[(f + 24) >> 2],
        me: R[(f + 28) >> 2],
        tg: R[(f + 32) >> 2],
        lg: R[(f + 36) >> 2],
        og: v ? (v ? ub(K, v) : "") : "",
      };
      c = c ? ub(K, c) : "";
      v = {
        "%c": "%a %b %d %H:%M:%S %Y",
        "%D": "%m/%d/%y",
        "%F": "%Y-%m-%d",
        "%h": "%b",
        "%r": "%I:%M:%S %p",
        "%R": "%H:%M",
        "%T": "%H:%M:%S",
        "%x": "%m/%d/%y",
        "%X": "%H:%M:%S",
        "%Ec": "%c",
        "%EC": "%C",
        "%Ex": "%m/%d/%y",
        "%EX": "%H:%M:%S",
        "%Ey": "%y",
        "%EY": "%Y",
        "%Od": "%d",
        "%Oe": "%e",
        "%OH": "%H",
        "%OI": "%I",
        "%Om": "%m",
        "%OM": "%M",
        "%OS": "%S",
        "%Ou": "%u",
        "%OU": "%U",
        "%OV": "%V",
        "%Ow": "%w",
        "%OW": "%W",
        "%Oy": "%y",
      };
      for (var E in v) c = c.replace(new RegExp(E, "g"), v[E]);
      var I = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(
          " "
        ),
        L =
        "January February March April May June July August September October November December".split(
          " "
        );
      v = {
        "%a": (y) => I[y.fe].substring(0, 3),
        "%A": (y) => I[y.fe],
        "%b": (y) => L[y.Ye].substring(0, 3),
        "%B": (y) => L[y.Ye],
        "%C": (y) => m(((y.ne + 1900) / 100) | 0, 2),
        "%d": (y) => m(y.gf, 2),
        "%e": (y) => h(y.gf, 2, " "),
        "%g": (y) => q(y).toString().substring(2),
        "%G": (y) => q(y),
        "%H": (y) => m(y.Xe, 2),
        "%I": (y) => {
          y = y.Xe;
          0 == y ? (y = 12) : 12 < y && (y -= 12);
          return m(y, 2);
        },
        "%j": (y) => {
          for (
            var N = 0, T = 0; T <= y.Ye - 1; N += (Sd(y.ne + 1900) ? Td : Ud)[T++]
          );
          return m(y.gf + N, 3);
        },
        "%m": (y) => m(y.Ye + 1, 2),
        "%M": (y) => m(y.mg, 2),
        "%n": () => "\n",
        "%p": (y) => (0 <= y.Xe && 12 > y.Xe ? "AM" : "PM"),
        "%S": (y) => m(y.ng, 2),
        "%t": () => "\t",
        "%u": (y) => y.fe || 7,
        "%U": (y) => m(Math.floor((y.me + 7 - y.fe) / 7), 2),
        "%V": (y) => {
          var N = Math.floor((y.me + 7 - ((y.fe + 6) % 7)) / 7);
          2 >= (y.fe + 371 - y.me - 2) % 7 && N++;
          if (N)
            53 == N &&
            ((T = (y.fe + 371 - y.me) % 7),
              4 == T || (3 == T && Sd(y.ne)) || (N = 1));
          else {
            N = 52;
            var T = (y.fe + 7 - y.me - 1) % 7;
            (4 == T || (5 == T && Sd((y.ne % 400) - 1))) && N++;
          }
          return m(N, 2);
        },
        "%w": (y) => y.fe,
        "%W": (y) => m(Math.floor((y.me + 7 - ((y.fe + 6) % 7)) / 7), 2),
        "%y": (y) => (y.ne + 1900).toString().substring(2),
        "%Y": (y) => y.ne + 1900,
        "%z": (y) => {
          y = y.lg;
          var N = 0 <= y;
          y = Math.abs(y) / 60;
          return (
            (N ? "+" : "-") +
            String("0000" + ((y / 60) * 100 + (y % 60))).slice(-4)
          );
        },
        "%Z": (y) => y.og,
        "%%": () => "%",
      };
      c = c.replace(/%%/g, "\x00\x00");
      for (E in v)
        c.includes(E) && (c = c.replace(new RegExp(E, "g"), v[E](f)));
      c = c.replace(/\0\0/g, "%");
      E = Vd(c);
      if (E.length > b) return 0;
      Qa.set(E, a);
      return E.length - 1;
    };
    Cb = w.InternalError = class extends Error {
      constructor(a) {
        super(a);
        this.name = "InternalError";
      }
    };
    for (var Xd = Array(256), Yd = 0; 256 > Yd; ++Yd)
      Xd[Yd] = String.fromCharCode(Yd);
    Hb = Xd;
    Jb = w.BindingError = class extends Error {
      constructor(a) {
        super(a);
        this.name = "BindingError";
      }
    };
    dc.prototype.isAliasOf = function (a) {
      if (!(this instanceof dc && a instanceof dc)) return !1;
      var b = this.Hd.Td.Nd,
        c = this.Hd.Pd,
        f = a.Hd.Td.Nd;
      for (a = a.Hd.Pd; b.Yd;)(c = b.Me(c)), (b = b.Yd);
      for (; f.Yd;)(a = f.Me(a)), (f = f.Yd);
      return b === f && c === a;
    };
    dc.prototype.clone = function () {
      this.Hd.Pd || Lb(this);
      if (this.Hd.Ke) return (this.Hd.count.value += 1), this;
      var a = cc,
        b = Object,
        c = b.create,
        f = Object.getPrototypeOf(this),
        h = this.Hd;
      a = a(
        c.call(b, f, {
          Hd: {
            value: {
              count: h.count,
              Ce: h.Ce,
              Ke: h.Ke,
              Pd: h.Pd,
              Td: h.Td,
              Wd: h.Wd,
              ce: h.ce,
            },
          },
        })
      );
      a.Hd.count.value += 1;
      a.Hd.Ce = !1;
      return a;
    };
    dc.prototype["delete"] = function () {
      this.Hd.Pd || Lb(this);
      this.Hd.Ce && !this.Hd.Ke && X("Object already scheduled for deletion");
      Nb(this);
      Ob(this.Hd);
      this.Hd.Ke || ((this.Hd.Wd = void 0), (this.Hd.Pd = void 0));
    };
    dc.prototype.isDeleted = function () {
      return !this.Hd.Pd;
    };
    dc.prototype.deleteLater = function () {
      this.Hd.Pd || Lb(this);
      this.Hd.Ce && !this.Hd.Ke && X("Object already scheduled for deletion");
      Rb.push(this);
      1 === Rb.length && Tb && Tb(Sb);
      this.Hd.Ce = !0;
      return this;
    };
    w.getInheritedInstanceCount = function () {
      return Object.keys(Ub).length;
    };
    w.getLiveInheritedInstances = function () {
      var a = [],
        b;
      for (b in Ub) Ub.hasOwnProperty(b) && a.push(Ub[b]);
      return a;
    };
    w.flushPendingDeletes = Sb;
    w.setDelayFunction = function (a) {
      Tb = a;
      Rb.length && Tb && Tb(Sb);
    };
    pc.prototype.Qf = function (a) {
      this.tf && (a = this.tf(a));
      return a;
    };
    pc.prototype.lf = function (a) {
      this.ie && this.ie(a);
    };
    pc.prototype.argPackAdvance = 8;
    pc.prototype.readValueFromPointer = xb;
    pc.prototype.deleteObject = function (a) {
      if (null !== a) a["delete"]();
    };
    pc.prototype.fromWireType = function (a) {
      function b() {
        return this.Te ?
          bc(this.Nd.De, {
            Td: this.$f,
            Pd: c,
            ce: this,
            Wd: a
          }) :
          bc(this.Nd.De, {
            Td: this,
            Pd: a
          });
      }
      var c = this.Qf(a);
      if (!c) return this.lf(a), null;
      var f = ac(this.Nd, c);
      if (void 0 !== f) {
        if (0 === f.Hd.count.value)
          return (f.Hd.Pd = c), (f.Hd.Wd = a), f.clone();
        f = f.clone();
        this.lf(a);
        return f;
      }
      f = this.Nd.Pf(c);
      f = Qb[f];
      if (!f) return b.call(this);
      f = this.Se ? f.Gf : f.pointerType;
      var h = Pb(c, this.Nd, f.Nd);
      return null === h ?
        b.call(this) :
        this.Te ?
        bc(f.Nd.De, {
          Td: f,
          Pd: h,
          ce: this,
          Wd: a
        }) :
        bc(f.Nd.De, {
          Td: f,
          Pd: h
        });
    };
    tc = w.UnboundTypeError = (function (a, b) {
      var c = fc(b, function (f) {
        this.name = b;
        this.message = f;
        f = Error(f).stack;
        void 0 !== f &&
          (this.stack =
            this.toString() + "\n" + f.replace(/^Error(:[^\n]*)?\n/, ""));
      });
      c.prototype = Object.create(a.prototype);
      c.prototype.constructor = c;
      c.prototype.toString = function () {
        return void 0 === this.message ?
          this.name :
          `${this.name}: ${this.message}`;
      };
      return c;
    })(Error, "UnboundTypeError");
    Object.assign(Gc.prototype, {
      get(a) {
        return this.he[a];
      },
      has(a) {
        return void 0 !== this.he[a];
      },
      yf(a) {
        var b = this.qf.pop() || this.he.length;
        this.he[b] = a;
        return b;
      },
      zf(a) {
        this.he[a] = void 0;
        this.qf.push(a);
      },
    });
    Hc.he.push({
      value: void 0
    }, {
      value: null
    }, {
      value: !0
    }, {
      value: !1
    });
    Hc.Ee = Hc.he.length;
    w.count_emval_handles = function () {
      for (var a = 0, b = Hc.Ee; b < Hc.he.length; ++b)
        void 0 !== Hc.he[b] && ++a;
      return a;
    };
    for (var Z, Zd = 0; 32 > Zd; ++Zd) Fd.push(Array(Zd));
    var $d = new Float32Array(288);
    for (Zd = 0; 288 > Zd; ++Zd) Qd[Zd] = $d.subarray(0, Zd + 1);
    var ae = new Int32Array(288);
    for (Zd = 0; 288 > Zd; ++Zd) Rd[Zd] = ae.subarray(0, Zd + 1);
    var oe = {
      S: function () {
        return 0;
      },
      Bb: () => {},
      Db: function () {
        return 0;
      },
      yb: () => {},
      zb: () => {},
      T: function () {},
      Ab: () => {},
      C: function (a) {
        var b = vb[a];
        delete vb[a];
        var c = b.ff,
          f = b.ie,
          h = b.pf,
          m = h.map((u) => u.Tf).concat(h.map((u) => u.dg));
        Eb([a], m, (u) => {
          var n = {};
          h.forEach((q, v) => {
            var E = u[v],
              I = q.Rf,
              L = q.Sf,
              y = u[v + h.length],
              N = q.cg,
              T = q.eg;
            n[q.Mf] = {
              read: (S) => E.fromWireType(I(L, S)),
              write: (S, pa) => {
                var la = [];
                N(T, S, y.toWireType(la, pa));
                wb(la);
              },
            };
          });
          return [{
            name: b.name,
            fromWireType: function (q) {
              var v = {},
                E;
              for (E in n) v[E] = n[E].read(q);
              f(q);
              return v;
            },
            toWireType: function (q, v) {
              for (var E in n)
                if (!(E in v)) throw new TypeError(`Missing field: "${E}"`);
              var I = c();
              for (E in n) n[E].write(I, v[E]);
              null !== q && q.push(f, I);
              return I;
            },
            argPackAdvance: 8,
            readValueFromPointer: xb,
            be: f,
          }, ];
        });
      },
      qb: function () {},
      Hb: function (a, b, c, f, h) {
        var m = Gb(c);
        b = Ib(b);
        Fb(a, {
          name: b,
          fromWireType: function (u) {
            return !!u;
          },
          toWireType: function (u, n) {
            return n ? f : h;
          },
          argPackAdvance: 8,
          readValueFromPointer: function (u) {
            if (1 === c) var n = Qa;
            else if (2 === c) n = Ra;
            else if (4 === c) n = R;
            else throw new TypeError("Unknown boolean type size: " + b);
            return this.fromWireType(n[u >> m]);
          },
          be: null,
        });
      },
      k: function (a, b, c, f, h, m, u, n, q, v, E, I, L) {
        E = Ib(E);
        m = sc(h, m);
        n && (n = sc(u, n));
        v && (v = sc(q, v));
        L = sc(I, L);
        var y = ec(E);
        hc(y, function () {
          Dc(`Cannot construct ${E} due to unbound types`, [f]);
        });
        Eb([a, b, c], f ? [f] : [], function (N) {
          N = N[0];
          if (f) {
            var T = N.Nd;
            var S = T.De;
          } else S = dc.prototype;
          N = fc(y, function () {
            if (Object.getPrototypeOf(this) !== pa)
              throw new Jb("Use 'new' to construct " + E);
            if (void 0 === la.le)
              throw new Jb(E + " has no accessible constructor");
            var hb = la.le[arguments.length];
            if (void 0 === hb)
              throw new Jb(
                `Tried to invoke ctor of ${E} with invalid number of parameters (${
                  arguments.length
                }) - expected (${Object.keys(
                  la.le
                ).toString()}) parameters instead!`
              );
            return hb.apply(this, arguments);
          });
          var pa = Object.create(S, {
            constructor: {
              value: N
            }
          });
          N.prototype = pa;
          var la = new ic(E, N, pa, L, T, m, n, v);
          la.Yd && (void 0 === la.Yd.Ne && (la.Yd.Ne = []), la.Yd.Ne.push(la));
          T = new pc(E, la, !0, !1, !1);
          S = new pc(E + "*", la, !1, !1, !1);
          var gb = new pc(E + " const*", la, !1, !0, !1);
          Qb[a] = {
            pointerType: S,
            Gf: gb
          };
          qc(y, N);
          return [T, S, gb];
        });
      },
      f: function (a, b, c, f, h, m, u) {
        var n = Fc(c, f);
        b = Ib(b);
        m = sc(h, m);
        Eb([], [a], function (q) {
          function v() {
            Dc(`Cannot call ${E} due to unbound types`, n);
          }
          q = q[0];
          var E = `${q.name}.${b}`;
          b.startsWith("@@") && (b = Symbol[b.substring(2)]);
          var I = q.Nd.constructor;
          void 0 === I[b] ?
            ((v.Ae = c - 1), (I[b] = v)) :
            (gc(I, b, E), (I[b].Vd[c - 1] = v));
          Eb([], n, function (L) {
            L = [L[0], null].concat(L.slice(1));
            L = Ec(E, L, null, m, u);
            void 0 === I[b].Vd ?
              ((L.Ae = c - 1), (I[b] = L)) :
              (I[b].Vd[c - 1] = L);
            if (q.Nd.Ne)
              for (const y of q.Nd.Ne)
                y.constructor.hasOwnProperty(b) || (y.constructor[b] = L);
            return [];
          });
          return [];
        });
      },
      z: function (a, b, c, f, h, m) {
        var u = Fc(b, c);
        h = sc(f, h);
        Eb([], [a], function (n) {
          n = n[0];
          var q = `constructor ${n.name}`;
          void 0 === n.Nd.le && (n.Nd.le = []);
          if (void 0 !== n.Nd.le[b - 1])
            throw new Jb(
              `Cannot register multiple constructors with identical number of parameters (${
                b - 1
              }) for class '${
                n.name
              }'! Overload resolution is currently only performed using the parameter count, not actual type info!`
            );
          n.Nd.le[b - 1] = () => {
            Dc(`Cannot construct ${n.name} due to unbound types`, u);
          };
          Eb([], u, function (v) {
            v.splice(1, 0, null);
            n.Nd.le[b - 1] = Ec(q, v, null, h, m);
            return [];
          });
          return [];
        });
      },
      b: function (a, b, c, f, h, m, u, n) {
        var q = Fc(c, f);
        b = Ib(b);
        m = sc(h, m);
        Eb([], [a], function (v) {
          function E() {
            Dc(`Cannot call ${I} due to unbound types`, q);
          }
          v = v[0];
          var I = `${v.name}.${b}`;
          b.startsWith("@@") && (b = Symbol[b.substring(2)]);
          n && v.Nd.ag.push(b);
          var L = v.Nd.De,
            y = L[b];
          void 0 === y ||
            (void 0 === y.Vd && y.className !== v.name && y.Ae === c - 2) ?
            ((E.Ae = c - 2), (E.className = v.name), (L[b] = E)) :
            (gc(L, b, I), (L[b].Vd[c - 2] = E));
          Eb([], q, function (N) {
            N = Ec(I, N, v, m, u);
            void 0 === L[b].Vd ?
              ((N.Ae = c - 2), (L[b] = N)) :
              (L[b].Vd[c - 2] = N);
            return [];
          });
          return [];
        });
      },
      s: function (a, b, c) {
        a = Ib(a);
        Eb([], [b], function (f) {
          f = f[0];
          w[a] = f.fromWireType(c);
          return [];
        });
      },
      Gb: function (a, b) {
        b = Ib(b);
        Fb(a, {
          name: b,
          fromWireType: function (c) {
            var f = Jc(c);
            Ic(c);
            return f;
          },
          toWireType: function (c, f) {
            return nc(f);
          },
          argPackAdvance: 8,
          readValueFromPointer: xb,
          be: null,
        });
      },
      j: function (a, b, c, f) {
        function h() {}
        c = Gb(c);
        b = Ib(b);
        h.values = {};
        Fb(a, {
          name: b,
          constructor: h,
          fromWireType: function (m) {
            return this.constructor.values[m];
          },
          toWireType: function (m, u) {
            return u.value;
          },
          argPackAdvance: 8,
          readValueFromPointer: Kc(b, c, f),
          be: null,
        });
        hc(b, h);
      },
      c: function (a, b, c) {
        var f = Lc(a, "enum");
        b = Ib(b);
        a = f.constructor;
        f = Object.create(f.constructor.prototype, {
          value: {
            value: c
          },
          constructor: {
            value: fc(`${f.name}_${b}`, function () {})
          },
        });
        a.values[c] = f;
        a[b] = f;
      },
      V: function (a, b, c) {
        c = Gb(c);
        b = Ib(b);
        Fb(a, {
          name: b,
          fromWireType: function (f) {
            return f;
          },
          toWireType: function (f, h) {
            return h;
          },
          argPackAdvance: 8,
          readValueFromPointer: Mc(b, c),
          be: null,
        });
      },
      w: function (a, b, c, f, h, m) {
        var u = Fc(b, c);
        a = Ib(a);
        h = sc(f, h);
        hc(
          a,
          function () {
            Dc(`Cannot call ${a} due to unbound types`, u);
          },
          b - 1
        );
        Eb([], u, function (n) {
          n = [n[0], null].concat(n.slice(1));
          qc(a, Ec(a, n, null, h, m), b - 1);
          return [];
        });
      },
      E: function (a, b, c, f, h) {
        b = Ib(b); -
        1 === h && (h = 4294967295);
        h = Gb(c);
        var m = (n) => n;
        if (0 === f) {
          var u = 32 - 8 * c;
          m = (n) => (n << u) >>> u;
        }
        c = b.includes("unsigned") ?
          function (n, q) {
            return q >>> 0;
          } :
          function (n, q) {
            return q;
          };
        Fb(a, {
          name: b,
          fromWireType: m,
          toWireType: c,
          argPackAdvance: 8,
          readValueFromPointer: Nc(b, h, 0 !== f),
          be: null,
        });
      },
      r: function (a, b, c) {
        function f(m) {
          m >>= 2;
          var u = Ua;
          return new h(u.buffer, u[m + 1], u[m]);
        }
        var h = [
          Int8Array,
          Uint8Array,
          Int16Array,
          Uint16Array,
          Int32Array,
          Uint32Array,
          Float32Array,
          Float64Array,
        ][b];
        c = Ib(c);
        Fb(
          a, {
            name: c,
            fromWireType: f,
            argPackAdvance: 8,
            readValueFromPointer: f,
          }, {
            Uf: !0
          }
        );
      },
      p: function (a, b, c, f, h, m, u, n, q, v, E, I) {
        c = Ib(c);
        m = sc(h, m);
        n = sc(u, n);
        v = sc(q, v);
        I = sc(E, I);
        Eb([a], [b], function (L) {
          L = L[0];
          return [new pc(c, L.Nd, !1, !1, !0, L, f, m, n, v, I)];
        });
      },
      U: function (a, b) {
        b = Ib(b);
        var c = "std::string" === b;
        Fb(a, {
          name: b,
          fromWireType: function (f) {
            var h = Ua[f >> 2],
              m = f + 4;
            if (c)
              for (var u = m, n = 0; n <= h; ++n) {
                var q = m + n;
                if (n == h || 0 == K[q]) {
                  u = u ? ub(K, u, q - u) : "";
                  if (void 0 === v) var v = u;
                  else(v += String.fromCharCode(0)), (v += u);
                  u = q + 1;
                }
              }
            else {
              v = Array(h);
              for (n = 0; n < h; ++n) v[n] = String.fromCharCode(K[m + n]);
              v = v.join("");
            }
            wc(f);
            return v;
          },
          toWireType: function (f, h) {
            h instanceof ArrayBuffer && (h = new Uint8Array(h));
            var m = "string" == typeof h;
            m ||
              h instanceof Uint8Array ||
              h instanceof Uint8ClampedArray ||
              h instanceof Int8Array ||
              X("Cannot pass non-string to std::string");
            var u = c && m ? ra(h) : h.length;
            var n = Kd(4 + u + 1),
              q = n + 4;
            Ua[n >> 2] = u;
            if (c && m) sa(h, K, q, u + 1);
            else if (m)
              for (m = 0; m < u; ++m) {
                var v = h.charCodeAt(m);
                255 < v &&
                  (wc(q),
                    X("String has UTF-16 code units that do not fit in 8 bits"));
                K[q + m] = v;
              }
            else
              for (m = 0; m < u; ++m) K[q + m] = h[m];
            null !== f && f.push(wc, n);
            return n;
          },
          argPackAdvance: 8,
          readValueFromPointer: xb,
          be: function (f) {
            wc(f);
          },
        });
      },
      M: function (a, b, c) {
        c = Ib(c);
        if (2 === b) {
          var f = Pc;
          var h = Qc;
          var m = Rc;
          var u = () => Sa;
          var n = 1;
        } else
          4 === b && ((f = Sc), (h = Tc), (m = Uc), (u = () => Ua), (n = 2));
        Fb(a, {
          name: c,
          fromWireType: function (q) {
            for (
              var v = Ua[q >> 2], E = u(), I, L = q + 4, y = 0; y <= v;
              ++y
            ) {
              var N = q + 4 + y * b;
              if (y == v || 0 == E[N >> n])
                (L = f(L, N - L)),
                void 0 === I ?
                (I = L) :
                ((I += String.fromCharCode(0)), (I += L)),
                (L = N + b);
            }
            wc(q);
            return I;
          },
          toWireType: function (q, v) {
            "string" != typeof v &&
              X(`Cannot pass non-string to C++ string type ${c}`);
            var E = m(v),
              I = Kd(4 + E + b);
            Ua[I >> 2] = E >> n;
            h(v, I + 4, E + b);
            null !== q && q.push(wc, I);
            return I;
          },
          argPackAdvance: 8,
          readValueFromPointer: xb,
          be: function (q) {
            wc(q);
          },
        });
      },
      D: function (a, b, c, f, h, m) {
        vb[a] = {
          name: Ib(b),
          ff: sc(c, f),
          ie: sc(h, m),
          pf: []
        };
      },
      e: function (a, b, c, f, h, m, u, n, q, v) {
        vb[a].pf.push({
          Mf: Ib(b),
          Tf: c,
          Rf: sc(f, h),
          Sf: m,
          dg: u,
          cg: sc(n, q),
          eg: v,
        });
      },
      Ib: function (a, b) {
        b = Ib(b);
        Fb(a, {
          Wf: !0,
          name: b,
          argPackAdvance: 0,
          fromWireType: function () {},
          toWireType: function () {},
        });
      },
      Fb: () => !0,
      ub: () => {
        throw Infinity;
      },
      F: function (a, b, c) {
        a = Jc(a);
        b = Lc(b, "emval::as");
        var f = [],
          h = nc(f);
        Ua[c >> 2] = h;
        return b.toWireType(f, a);
      },
      Z: function (a, b, c, f, h) {
        a = Xc[a];
        b = Jc(b);
        c = Wc(c);
        var m = [];
        Ua[f >> 2] = nc(m);
        return a(b, c, m, h);
      },
      u: function (a, b, c, f) {
        a = Xc[a];
        b = Jc(b);
        c = Wc(c);
        a(b, c, null, f);
      },
      d: Ic,
      J: function (a) {
        if (0 === a) return nc(Yc());
        a = Wc(a);
        return nc(Yc()[a]);
      },
      t: function (a, b) {
        var c = $c(a, b),
          f = c[0];
        b =
          f.name +
          "_$" +
          c
          .slice(1)
          .map(function (u) {
            return u.name;
          })
          .join("_") +
          "$";
        var h = ad[b];
        if (void 0 !== h) return h;
        var m = Array(a - 1);
        h = Zc((u, n, q, v) => {
          for (var E = 0, I = 0; I < a - 1; ++I)
            (m[I] = c[I + 1].readValueFromPointer(v + E)),
            (E += c[I + 1].argPackAdvance);
          u = u[n].apply(u, m);
          for (I = 0; I < a - 1; ++I) c[I + 1].Jf && c[I + 1].Jf(m[I]);
          if (!f.Wf) return f.toWireType(q, u);
        });
        return (ad[b] = h);
      },
      y: function (a, b) {
        a = Jc(a);
        b = Jc(b);
        return nc(a[b]);
      },
      o: function (a) {
        4 < a && (Hc.get(a).uf += 1);
      },
      I: function (a, b, c, f) {
        a = Jc(a);
        var h = cd[b];
        h || ((h = bd(b)), (cd[b] = h));
        return h(a, c, f);
      },
      H: function () {
        return nc([]);
      },
      g: function (a) {
        return nc(Wc(a));
      },
      G: function () {
        return nc({});
      },
      kb: function (a) {
        a = Jc(a);
        return !a;
      },
      B: function (a) {
        var b = Jc(a);
        wb(b);
        Ic(a);
      },
      i: function (a, b, c) {
        a = Jc(a);
        b = Jc(b);
        c = Jc(c);
        a[b] = c;
      },
      h: function (a, b) {
        a = Lc(a, "_emval_take_value");
        a = a.readValueFromPointer(b);
        return nc(a);
      },
      nb: function () {
        return -52;
      },
      ob: function () {},
      a: () => {
        La("");
      },
      Eb: () => new Date().getTime(),
      vb: (a) => {
        var b = K.length;
        a >>>= 0;
        if (2147483648 < a) return !1;
        for (var c = 1; 4 >= c; c *= 2) {
          var f = b * (1 + 0.2 / c);
          f = Math.min(f, a + 100663296);
          var h = Math;
          f = Math.max(a, f);
          a: {
            h =
            (h.min.call(h, 2147483648, f + ((65536 - (f % 65536)) % 65536)) -
              Ma.buffer.byteLength +
              65535) >>>
            16;
            try {
              Ma.grow(h);
              Wa();
              var m = 1;
              break a;
            } catch (u) {}
            m = void 0;
          }
          if (m) return !0;
        }
        return !1;
      },
      lb: function () {
        return A ? A.handle : 0;
      },
      wb: (a, b) => {
        var c = 0;
        Bd().forEach(function (f, h) {
          var m = b + c;
          h = Ua[(a + 4 * h) >> 2] = m;
          for (m = 0; m < f.length; ++m) Qa[h++ >> 0] = f.charCodeAt(m);
          Qa[h >> 0] = 0;
          c += f.length + 1;
        });
        return 0;
      },
      xb: (a, b) => {
        var c = Bd();
        Ua[a >> 2] = c.length;
        var f = 0;
        c.forEach(function (h) {
          f += h.length + 1;
        });
        Ua[b >> 2] = f;
        return 0;
      },
      Jb: (a) => {
        if (!noExitRuntime) {
          if (w.onExit) w.onExit(a);
          Pa = !0;
        }
        xa(a, new rb(a));
      },
      L: () => 52,
      mb: function () {
        return 52;
      },
      Cb: () => 52,
      pb: function () {
        return 70;
      },
      R: (a, b, c, f) => {
        for (var h = 0, m = 0; m < c; m++) {
          var u = Ua[b >> 2],
            n = Ua[(b + 4) >> 2];
          b += 8;
          for (var q = 0; q < n; q++) {
            var v = K[u + q],
              E = Cd[a];
            0 === v || 10 === v ?
              ((1 === a ? Ha : Ja)(ub(E, 0)), (E.length = 0)) :
              E.push(v);
          }
          h += n;
        }
        Ua[f >> 2] = h;
        return 0;
      },
      aa: function (a) {
        Z.activeTexture(a);
      },
      ba: function (a, b) {
        Z.attachShader(jd[a], md[b]);
      },
      ca: function (a, b, c) {
        Z.bindAttribLocation(jd[a], b, c ? ub(K, c) : "");
      },
      da: function (a, b) {
        35051 == a ? (Z.cf = b) : 35052 == a && (Z.Be = b);
        Z.bindBuffer(a, hd[b]);
      },
      $: function (a, b) {
        Z.bindFramebuffer(a, kd[b]);
      },
      dc: function (a, b) {
        Z.bindRenderbuffer(a, ld[b]);
      },
      Pb: function (a, b) {
        Z.bindSampler(a, od[b]);
      },
      ea: function (a, b) {
        Z.bindTexture(a, ia[b]);
      },
      xc: Dd,
      Ac: Dd,
      fa: function (a, b, c, f) {
        Z.blendColor(a, b, c, f);
      },
      ga: function (a) {
        Z.blendEquation(a);
      },
      ha: function (a, b) {
        Z.blendFunc(a, b);
      },
      Zb: function (a, b, c, f, h, m, u, n, q, v) {
        Z.blitFramebuffer(a, b, c, f, h, m, u, n, q, v);
      },
      ia: function (a, b, c, f) {
        2 <= A.version ?
          c && b ?
          Z.bufferData(a, K, f, c, b) :
          Z.bufferData(a, b, f) :
          Z.bufferData(a, c ? K.subarray(c, c + b) : b, f);
      },
      ja: function (a, b, c, f) {
        2 <= A.version ?
          c && Z.bufferSubData(a, b, K, f, c) :
          Z.bufferSubData(a, b, K.subarray(f, f + c));
      },
      ec: function (a) {
        return Z.checkFramebufferStatus(a);
      },
      P: function (a) {
        Z.clear(a);
      },
      _: function (a, b, c, f) {
        Z.clearColor(a, b, c, f);
      },
      Q: function (a) {
        Z.clearStencil(a);
      },
      sb: function (a, b, c, f) {
        return Z.clientWaitSync(pd[a], b, (c >>> 0) + 4294967296 * f);
      },
      ka: function (a, b, c, f) {
        Z.colorMask(!!a, !!b, !!c, !!f);
      },
      la: function (a) {
        Z.compileShader(md[a]);
      },
      ma: function (a, b, c, f, h, m, u, n) {
        2 <= A.version ?
          Z.Be || !u ?
          Z.compressedTexImage2D(a, b, c, f, h, m, u, n) :
          Z.compressedTexImage2D(a, b, c, f, h, m, K, n, u) :
          Z.compressedTexImage2D(
            a,
            b,
            c,
            f,
            h,
            m,
            n ? K.subarray(n, n + u) : null
          );
      },
      na: function (a, b, c, f, h, m, u, n, q) {
        2 <= A.version ?
          Z.Be || !n ?
          Z.compressedTexSubImage2D(a, b, c, f, h, m, u, n, q) :
          Z.compressedTexSubImage2D(a, b, c, f, h, m, u, K, q, n) :
          Z.compressedTexSubImage2D(
            a,
            b,
            c,
            f,
            h,
            m,
            u,
            q ? K.subarray(q, q + n) : null
          );
      },
      Xb: function (a, b, c, f, h) {
        Z.copyBufferSubData(a, b, c, f, h);
      },
      oa: function (a, b, c, f, h, m, u, n) {
        Z.copyTexSubImage2D(a, b, c, f, h, m, u, n);
      },
      pa: function () {
        var a = ha(jd),
          b = Z.createProgram();
        b.name = a;
        b.We = b.Ue = b.Ve = 0;
        b.hf = 1;
        jd[a] = b;
        return a;
      },
      qa: function (a) {
        var b = ha(md);
        md[b] = Z.createShader(a);
        return b;
      },
      ra: function (a) {
        Z.cullFace(a);
      },
      sa: function (a, b) {
        for (var c = 0; c < a; c++) {
          var f = R[(b + 4 * c) >> 2],
            h = hd[f];
          h &&
            (Z.deleteBuffer(h),
              (h.name = 0),
              (hd[f] = null),
              f == Z.cf && (Z.cf = 0),
              f == Z.Be && (Z.Be = 0));
        }
      },
      fc: function (a, b) {
        for (var c = 0; c < a; ++c) {
          var f = R[(b + 4 * c) >> 2],
            h = kd[f];
          h && (Z.deleteFramebuffer(h), (h.name = 0), (kd[f] = null));
        }
      },
      ta: function (a) {
        if (a) {
          var b = jd[a];
          b ? (Z.deleteProgram(b), (b.name = 0), (jd[a] = null)) : td(1281);
        }
      },
      gc: function (a, b) {
        for (var c = 0; c < a; c++) {
          var f = R[(b + 4 * c) >> 2],
            h = ld[f];
          h && (Z.deleteRenderbuffer(h), (h.name = 0), (ld[f] = null));
        }
      },
      Qb: function (a, b) {
        for (var c = 0; c < a; c++) {
          var f = R[(b + 4 * c) >> 2],
            h = od[f];
          h && (Z.deleteSampler(h), (h.name = 0), (od[f] = null));
        }
      },
      ua: function (a) {
        if (a) {
          var b = md[a];
          b ? (Z.deleteShader(b), (md[a] = null)) : td(1281);
        }
      },
      Yb: function (a) {
        if (a) {
          var b = pd[a];
          b ? (Z.deleteSync(b), (b.name = 0), (pd[a] = null)) : td(1281);
        }
      },
      va: function (a, b) {
        for (var c = 0; c < a; c++) {
          var f = R[(b + 4 * c) >> 2],
            h = ia[f];
          h && (Z.deleteTexture(h), (h.name = 0), (ia[f] = null));
        }
      },
      yc: Ed,
      Bc: Ed,
      wa: function (a) {
        Z.depthMask(!!a);
      },
      xa: function (a) {
        Z.disable(a);
      },
      ya: function (a) {
        Z.disableVertexAttribArray(a);
      },
      za: function (a, b, c) {
        Z.drawArrays(a, b, c);
      },
      vc: function (a, b, c, f) {
        Z.drawArraysInstanced(a, b, c, f);
      },
      tc: function (a, b, c, f, h) {
        Z.mf.drawArraysInstancedBaseInstanceWEBGL(a, b, c, f, h);
      },
      rc: function (a, b) {
        for (var c = Fd[a], f = 0; f < a; f++) c[f] = R[(b + 4 * f) >> 2];
        Z.drawBuffers(c);
      },
      Aa: Gd,
      wc: function (a, b, c, f, h) {
        Z.drawElementsInstanced(a, b, c, f, h);
      },
      uc: function (a, b, c, f, h, m, u) {
        Z.mf.drawElementsInstancedBaseVertexBaseInstanceWEBGL(
          a,
          b,
          c,
          f,
          h,
          m,
          u
        );
      },
      lc: function (a, b, c, f, h, m) {
        Gd(a, f, h, m);
      },
      Ba: function (a) {
        Z.enable(a);
      },
      Ca: function (a) {
        Z.enableVertexAttribArray(a);
      },
      Vb: function (a, b) {
        return (a = Z.fenceSync(a, b)) ?
          ((b = ha(pd)), (a.name = b), (pd[b] = a), b) :
          0;
      },
      Da: function () {
        Z.finish();
      },
      Ea: function () {
        Z.flush();
      },
      hc: function (a, b, c, f) {
        Z.framebufferRenderbuffer(a, b, c, ld[f]);
      },
      ic: function (a, b, c, f, h) {
        Z.framebufferTexture2D(a, b, c, ia[f], h);
      },
      Fa: function (a) {
        Z.frontFace(a);
      },
      Ga: function (a, b) {
        Hd(a, b, "createBuffer", hd);
      },
      jc: function (a, b) {
        Hd(a, b, "createFramebuffer", kd);
      },
      kc: function (a, b) {
        Hd(a, b, "createRenderbuffer", ld);
      },
      Rb: function (a, b) {
        Hd(a, b, "createSampler", od);
      },
      Ha: function (a, b) {
        Hd(a, b, "createTexture", ia);
      },
      zc: Id,
      Cc: Id,
      $b: function (a) {
        Z.generateMipmap(a);
      },
      Ia: function (a, b, c) {
        c ? (R[c >> 2] = Z.getBufferParameter(a, b)) : td(1281);
      },
      Ja: function () {
        var a = Z.getError() || ud;
        ud = 0;
        return a;
      },
      Ka: function (a, b) {
        Jd(a, b, 2);
      },
      ac: function (a, b, c, f) {
        a = Z.getFramebufferAttachmentParameter(a, b, c);
        if (a instanceof WebGLRenderbuffer || a instanceof WebGLTexture)
          a = a.name | 0;
        R[f >> 2] = a;
      },
      K: function (a, b) {
        Jd(a, b, 0);
      },
      La: function (a, b, c, f) {
        a = Z.getProgramInfoLog(jd[a]);
        null === a && (a = "(unknown error)");
        b = 0 < b && f ? sa(a, K, f, b) : 0;
        c && (R[c >> 2] = b);
      },
      Ma: function (a, b, c) {
        if (c)
          if (a >= gd) td(1281);
          else if (((a = jd[a]), 35716 == b))
          (a = Z.getProgramInfoLog(a)),
          null === a && (a = "(unknown error)"),
          (R[c >> 2] = a.length + 1);
        else if (35719 == b) {
          if (!a.We)
            for (b = 0; b < Z.getProgramParameter(a, 35718); ++b)
              a.We = Math.max(a.We, Z.getActiveUniform(a, b).name.length + 1);
          R[c >> 2] = a.We;
        } else if (35722 == b) {
          if (!a.Ue)
            for (b = 0; b < Z.getProgramParameter(a, 35721); ++b)
              a.Ue = Math.max(a.Ue, Z.getActiveAttrib(a, b).name.length + 1);
          R[c >> 2] = a.Ue;
        } else if (35381 == b) {
          if (!a.Ve)
            for (b = 0; b < Z.getProgramParameter(a, 35382); ++b)
              a.Ve = Math.max(
                a.Ve,
                Z.getActiveUniformBlockName(a, b).length + 1
              );
          R[c >> 2] = a.Ve;
        } else R[c >> 2] = Z.getProgramParameter(a, b);
        else td(1281);
      },
      bc: function (a, b, c) {
        c ? (R[c >> 2] = Z.getRenderbufferParameter(a, b)) : td(1281);
      },
      Na: function (a, b, c, f) {
        a = Z.getShaderInfoLog(md[a]);
        null === a && (a = "(unknown error)");
        b = 0 < b && f ? sa(a, K, f, b) : 0;
        c && (R[c >> 2] = b);
      },
      Mb: function (a, b, c, f) {
        a = Z.getShaderPrecisionFormat(a, b);
        R[c >> 2] = a.rangeMin;
        R[(c + 4) >> 2] = a.rangeMax;
        R[f >> 2] = a.precision;
      },
      Oa: function (a, b, c) {
        c
          ?
          35716 == b ?
          ((a = Z.getShaderInfoLog(md[a])),
            null === a && (a = "(unknown error)"),
            (R[c >> 2] = a ? a.length + 1 : 0)) :
          35720 == b ?
          ((a = Z.getShaderSource(md[a])),
            (R[c >> 2] = a ? a.length + 1 : 0)) :
          (R[c >> 2] = Z.getShaderParameter(md[a], b)) :
          td(1281);
      },
      O: function (a) {
        var b = qd[a];
        if (!b) {
          switch (a) {
            case 7939:
              b = Z.getSupportedExtensions() || [];
              b = b.concat(
                b.map(function (f) {
                  return "GL_" + f;
                })
              );
              b = Ld(b.join(" "));
              break;
            case 7936:
            case 7937:
            case 37445:
            case 37446:
              (b = Z.getParameter(a)) || td(1280);
              b = b && Ld(b);
              break;
            case 7938:
              b = Z.getParameter(7938);
              b =
                2 <= A.version ?
                "OpenGL ES 3.0 (" + b + ")" :
                "OpenGL ES 2.0 (" + b + ")";
              b = Ld(b);
              break;
            case 35724:
              b = Z.getParameter(35724);
              var c = b.match(/^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/);
              null !== c &&
                (3 == c[1].length && (c[1] += "0"),
                  (b = "OpenGL ES GLSL ES " + c[1] + " (" + b + ")"));
              b = Ld(b);
              break;
            default:
              td(1280);
          }
          qd[a] = b;
        }
        return b;
      },
      jb: function (a, b) {
        if (2 > A.version) return td(1282), 0;
        var c = rd[a];
        if (c) return 0 > b || b >= c.length ? (td(1281), 0) : c[b];
        switch (a) {
          case 7939:
            return (
              (c = Z.getSupportedExtensions() || []),
              (c = c.concat(
                c.map(function (f) {
                  return "GL_" + f;
                })
              )),
              (c = c.map(function (f) {
                return Ld(f);
              })),
              (c = rd[a] = c),
              0 > b || b >= c.length ? (td(1281), 0) : c[b]
            );
          default:
            return td(1280), 0;
        }
      },
      Pa: function (a, b) {
        b = b ? ub(K, b) : "";
        if ((a = jd[a])) {
          var c = a,
            f = c.Le,
            h = c.wf,
            m;
          if (!f)
            for (
              c.Le = f = {}, c.vf = {}, m = 0; m < Z.getProgramParameter(c, 35718);
              ++m
            ) {
              var u = Z.getActiveUniform(c, m);
              var n = u.name;
              u = u.size;
              var q = Md(n);
              q = 0 < q ? n.slice(0, q) : n;
              var v = c.hf;
              c.hf += u;
              h[q] = [u, v];
              for (n = 0; n < u; ++n)(f[v] = n), (c.vf[v++] = q);
            }
          c = a.Le;
          f = 0;
          h = b;
          m = Md(b);
          0 < m && ((f = parseInt(b.slice(m + 1)) >>> 0), (h = b.slice(0, m)));
          if (
            (h = a.wf[h]) &&
            f < h[0] &&
            ((f += h[1]), (c[f] = c[f] || Z.getUniformLocation(a, b)))
          )
            return f;
        } else td(1281);
        return -1;
      },
      Nb: function (a, b, c) {
        for (var f = Fd[b], h = 0; h < b; h++) f[h] = R[(c + 4 * h) >> 2];
        Z.invalidateFramebuffer(a, f);
      },
      Ob: function (a, b, c, f, h, m, u) {
        for (var n = Fd[b], q = 0; q < b; q++) n[q] = R[(c + 4 * q) >> 2];
        Z.invalidateSubFramebuffer(a, n, f, h, m, u);
      },
      Wb: function (a) {
        return Z.isSync(pd[a]);
      },
      Qa: function (a) {
        return (a = ia[a]) ? Z.isTexture(a) : 0;
      },
      Ra: function (a) {
        Z.lineWidth(a);
      },
      Sa: function (a) {
        a = jd[a];
        Z.linkProgram(a);
        a.Le = 0;
        a.wf = {};
      },
      pc: function (a, b, c, f, h, m) {
        Z.sf.multiDrawArraysInstancedBaseInstanceWEBGL(
          a,
          R,
          b >> 2,
          R,
          c >> 2,
          R,
          f >> 2,
          Ua,
          h >> 2,
          m
        );
      },
      qc: function (a, b, c, f, h, m, u, n) {
        Z.sf.multiDrawElementsInstancedBaseVertexBaseInstanceWEBGL(
          a,
          R,
          b >> 2,
          c,
          R,
          f >> 2,
          R,
          h >> 2,
          R,
          m >> 2,
          Ua,
          u >> 2,
          n
        );
      },
      Ta: function (a, b) {
        3317 == a && (sd = b);
        Z.pixelStorei(a, b);
      },
      sc: function (a) {
        Z.readBuffer(a);
      },
      Ua: function (a, b, c, f, h, m, u) {
        if (2 <= A.version)
          if (Z.cf) Z.readPixels(a, b, c, f, h, m, u);
          else {
            var n = Nd(m);
            Z.readPixels(
              a,
              b,
              c,
              f,
              h,
              m,
              n,
              u >> (31 - Math.clz32(n.BYTES_PER_ELEMENT))
            );
          }
        else
          (u = Od(m, h, c, f, u)) ?
          Z.readPixels(a, b, c, f, h, m, u) :
          td(1280);
      },
      cc: function (a, b, c, f) {
        Z.renderbufferStorage(a, b, c, f);
      },
      _b: function (a, b, c, f, h) {
        Z.renderbufferStorageMultisample(a, b, c, f, h);
      },
      Sb: function (a, b, c) {
        Z.samplerParameterf(od[a], b, c);
      },
      Tb: function (a, b, c) {
        Z.samplerParameteri(od[a], b, c);
      },
      Ub: function (a, b, c) {
        Z.samplerParameteri(od[a], b, R[c >> 2]);
      },
      Va: function (a, b, c, f) {
        Z.scissor(a, b, c, f);
      },
      Wa: function (a, b, c, f) {
        for (var h = "", m = 0; m < b; ++m) {
          var u = f ? R[(f + 4 * m) >> 2] : -1,
            n = R[(c + 4 * m) >> 2];
          u = n ? ub(K, n, 0 > u ? void 0 : u) : "";
          h += u;
        }
        Z.shaderSource(md[a], h);
      },
      Xa: function (a, b, c) {
        Z.stencilFunc(a, b, c);
      },
      Ya: function (a, b, c, f) {
        Z.stencilFuncSeparate(a, b, c, f);
      },
      Za: function (a) {
        Z.stencilMask(a);
      },
      _a: function (a, b) {
        Z.stencilMaskSeparate(a, b);
      },
      $a: function (a, b, c) {
        Z.stencilOp(a, b, c);
      },
      ab: function (a, b, c, f) {
        Z.stencilOpSeparate(a, b, c, f);
      },
      bb: function (a, b, c, f, h, m, u, n, q) {
        if (2 <= A.version)
          if (Z.Be) Z.texImage2D(a, b, c, f, h, m, u, n, q);
          else if (q) {
          var v = Nd(n);
          Z.texImage2D(
            a,
            b,
            c,
            f,
            h,
            m,
            u,
            n,
            v,
            q >> (31 - Math.clz32(v.BYTES_PER_ELEMENT))
          );
        } else Z.texImage2D(a, b, c, f, h, m, u, n, null);
        else Z.texImage2D(a, b, c, f, h, m, u, n, q ? Od(n, u, f, h, q) : null);
      },
      cb: function (a, b, c) {
        Z.texParameterf(a, b, c);
      },
      db: function (a, b, c) {
        Z.texParameterf(a, b, V[c >> 2]);
      },
      eb: function (a, b, c) {
        Z.texParameteri(a, b, c);
      },
      fb: function (a, b, c) {
        Z.texParameteri(a, b, R[c >> 2]);
      },
      mc: function (a, b, c, f, h) {
        Z.texStorage2D(a, b, c, f, h);
      },
      gb: function (a, b, c, f, h, m, u, n, q) {
        if (2 <= A.version)
          if (Z.Be) Z.texSubImage2D(a, b, c, f, h, m, u, n, q);
          else if (q) {
          var v = Nd(n);
          Z.texSubImage2D(
            a,
            b,
            c,
            f,
            h,
            m,
            u,
            n,
            v,
            q >> (31 - Math.clz32(v.BYTES_PER_ELEMENT))
          );
        } else Z.texSubImage2D(a, b, c, f, h, m, u, n, null);
        else
          (v = null),
          q && (v = Od(n, u, h, m, q)),
          Z.texSubImage2D(a, b, c, f, h, m, u, n, v);
      },
      hb: function (a, b) {
        Z.uniform1f(Pd(a), b);
      },
      ib: function (a, b, c) {
        if (2 <= A.version) b && Z.uniform1fv(Pd(a), V, c >> 2, b);
        else {
          if (288 >= b)
            for (var f = Qd[b - 1], h = 0; h < b; ++h)
              f[h] = V[(c + 4 * h) >> 2];
          else f = V.subarray(c >> 2, (c + 4 * b) >> 2);
          Z.uniform1fv(Pd(a), f);
        }
      },
      Xc: function (a, b) {
        Z.uniform1i(Pd(a), b);
      },
      Yc: function (a, b, c) {
        if (2 <= A.version) b && Z.uniform1iv(Pd(a), R, c >> 2, b);
        else {
          if (288 >= b)
            for (var f = Rd[b - 1], h = 0; h < b; ++h)
              f[h] = R[(c + 4 * h) >> 2];
          else f = R.subarray(c >> 2, (c + 4 * b) >> 2);
          Z.uniform1iv(Pd(a), f);
        }
      },
      Zc: function (a, b, c) {
        Z.uniform2f(Pd(a), b, c);
      },
      _c: function (a, b, c) {
        if (2 <= A.version) b && Z.uniform2fv(Pd(a), V, c >> 2, 2 * b);
        else {
          if (144 >= b)
            for (var f = Qd[2 * b - 1], h = 0; h < 2 * b; h += 2)
              (f[h] = V[(c + 4 * h) >> 2]),
              (f[h + 1] = V[(c + (4 * h + 4)) >> 2]);
          else f = V.subarray(c >> 2, (c + 8 * b) >> 2);
          Z.uniform2fv(Pd(a), f);
        }
      },
      Wc: function (a, b, c) {
        Z.uniform2i(Pd(a), b, c);
      },
      Vc: function (a, b, c) {
        if (2 <= A.version) b && Z.uniform2iv(Pd(a), R, c >> 2, 2 * b);
        else {
          if (144 >= b)
            for (var f = Rd[2 * b - 1], h = 0; h < 2 * b; h += 2)
              (f[h] = R[(c + 4 * h) >> 2]),
              (f[h + 1] = R[(c + (4 * h + 4)) >> 2]);
          else f = R.subarray(c >> 2, (c + 8 * b) >> 2);
          Z.uniform2iv(Pd(a), f);
        }
      },
      Uc: function (a, b, c, f) {
        Z.uniform3f(Pd(a), b, c, f);
      },
      Tc: function (a, b, c) {
        if (2 <= A.version) b && Z.uniform3fv(Pd(a), V, c >> 2, 3 * b);
        else {
          if (96 >= b)
            for (var f = Qd[3 * b - 1], h = 0; h < 3 * b; h += 3)
              (f[h] = V[(c + 4 * h) >> 2]),
              (f[h + 1] = V[(c + (4 * h + 4)) >> 2]),
              (f[h + 2] = V[(c + (4 * h + 8)) >> 2]);
          else f = V.subarray(c >> 2, (c + 12 * b) >> 2);
          Z.uniform3fv(Pd(a), f);
        }
      },
      Sc: function (a, b, c, f) {
        Z.uniform3i(Pd(a), b, c, f);
      },
      Rc: function (a, b, c) {
        if (2 <= A.version) b && Z.uniform3iv(Pd(a), R, c >> 2, 3 * b);
        else {
          if (96 >= b)
            for (var f = Rd[3 * b - 1], h = 0; h < 3 * b; h += 3)
              (f[h] = R[(c + 4 * h) >> 2]),
              (f[h + 1] = R[(c + (4 * h + 4)) >> 2]),
              (f[h + 2] = R[(c + (4 * h + 8)) >> 2]);
          else f = R.subarray(c >> 2, (c + 12 * b) >> 2);
          Z.uniform3iv(Pd(a), f);
        }
      },
      Qc: function (a, b, c, f, h) {
        Z.uniform4f(Pd(a), b, c, f, h);
      },
      Pc: function (a, b, c) {
        if (2 <= A.version) b && Z.uniform4fv(Pd(a), V, c >> 2, 4 * b);
        else {
          if (72 >= b) {
            var f = Qd[4 * b - 1],
              h = V;
            c >>= 2;
            for (var m = 0; m < 4 * b; m += 4) {
              var u = c + m;
              f[m] = h[u];
              f[m + 1] = h[u + 1];
              f[m + 2] = h[u + 2];
              f[m + 3] = h[u + 3];
            }
          } else f = V.subarray(c >> 2, (c + 16 * b) >> 2);
          Z.uniform4fv(Pd(a), f);
        }
      },
      Dc: function (a, b, c, f, h) {
        Z.uniform4i(Pd(a), b, c, f, h);
      },
      Ec: function (a, b, c) {
        if (2 <= A.version) b && Z.uniform4iv(Pd(a), R, c >> 2, 4 * b);
        else {
          if (72 >= b)
            for (var f = Rd[4 * b - 1], h = 0; h < 4 * b; h += 4)
              (f[h] = R[(c + 4 * h) >> 2]),
              (f[h + 1] = R[(c + (4 * h + 4)) >> 2]),
              (f[h + 2] = R[(c + (4 * h + 8)) >> 2]),
              (f[h + 3] = R[(c + (4 * h + 12)) >> 2]);
          else f = R.subarray(c >> 2, (c + 16 * b) >> 2);
          Z.uniform4iv(Pd(a), f);
        }
      },
      Fc: function (a, b, c, f) {
        if (2 <= A.version)
          b && Z.uniformMatrix2fv(Pd(a), !!c, V, f >> 2, 4 * b);
        else {
          if (72 >= b)
            for (var h = Qd[4 * b - 1], m = 0; m < 4 * b; m += 4)
              (h[m] = V[(f + 4 * m) >> 2]),
              (h[m + 1] = V[(f + (4 * m + 4)) >> 2]),
              (h[m + 2] = V[(f + (4 * m + 8)) >> 2]),
              (h[m + 3] = V[(f + (4 * m + 12)) >> 2]);
          else h = V.subarray(f >> 2, (f + 16 * b) >> 2);
          Z.uniformMatrix2fv(Pd(a), !!c, h);
        }
      },
      Gc: function (a, b, c, f) {
        if (2 <= A.version)
          b && Z.uniformMatrix3fv(Pd(a), !!c, V, f >> 2, 9 * b);
        else {
          if (32 >= b)
            for (var h = Qd[9 * b - 1], m = 0; m < 9 * b; m += 9)
              (h[m] = V[(f + 4 * m) >> 2]),
              (h[m + 1] = V[(f + (4 * m + 4)) >> 2]),
              (h[m + 2] = V[(f + (4 * m + 8)) >> 2]),
              (h[m + 3] = V[(f + (4 * m + 12)) >> 2]),
              (h[m + 4] = V[(f + (4 * m + 16)) >> 2]),
              (h[m + 5] = V[(f + (4 * m + 20)) >> 2]),
              (h[m + 6] = V[(f + (4 * m + 24)) >> 2]),
              (h[m + 7] = V[(f + (4 * m + 28)) >> 2]),
              (h[m + 8] = V[(f + (4 * m + 32)) >> 2]);
          else h = V.subarray(f >> 2, (f + 36 * b) >> 2);
          Z.uniformMatrix3fv(Pd(a), !!c, h);
        }
      },
      Hc: function (a, b, c, f) {
        if (2 <= A.version)
          b && Z.uniformMatrix4fv(Pd(a), !!c, V, f >> 2, 16 * b);
        else {
          if (18 >= b) {
            var h = Qd[16 * b - 1],
              m = V;
            f >>= 2;
            for (var u = 0; u < 16 * b; u += 16) {
              var n = f + u;
              h[u] = m[n];
              h[u + 1] = m[n + 1];
              h[u + 2] = m[n + 2];
              h[u + 3] = m[n + 3];
              h[u + 4] = m[n + 4];
              h[u + 5] = m[n + 5];
              h[u + 6] = m[n + 6];
              h[u + 7] = m[n + 7];
              h[u + 8] = m[n + 8];
              h[u + 9] = m[n + 9];
              h[u + 10] = m[n + 10];
              h[u + 11] = m[n + 11];
              h[u + 12] = m[n + 12];
              h[u + 13] = m[n + 13];
              h[u + 14] = m[n + 14];
              h[u + 15] = m[n + 15];
            }
          } else h = V.subarray(f >> 2, (f + 64 * b) >> 2);
          Z.uniformMatrix4fv(Pd(a), !!c, h);
        }
      },
      Ic: function (a) {
        a = jd[a];
        Z.useProgram(a);
        Z.If = a;
      },
      Jc: function (a, b) {
        Z.vertexAttrib1f(a, b);
      },
      Kc: function (a, b) {
        Z.vertexAttrib2f(a, V[b >> 2], V[(b + 4) >> 2]);
      },
      Lc: function (a, b) {
        Z.vertexAttrib3f(a, V[b >> 2], V[(b + 4) >> 2], V[(b + 8) >> 2]);
      },
      Mc: function (a, b) {
        Z.vertexAttrib4f(
          a,
          V[b >> 2],
          V[(b + 4) >> 2],
          V[(b + 8) >> 2],
          V[(b + 12) >> 2]
        );
      },
      nc: function (a, b) {
        Z.vertexAttribDivisor(a, b);
      },
      oc: function (a, b, c, f, h) {
        Z.vertexAttribIPointer(a, b, c, f, h);
      },
      Nc: function (a, b, c, f, h, m) {
        Z.vertexAttribPointer(a, b, c, !!f, h, m);
      },
      Oc: function (a, b, c, f) {
        Z.viewport(a, b, c, f);
      },
      rb: function (a, b, c, f) {
        Z.waitSync(pd[a], b, (c >>> 0) + 4294967296 * f);
      },
      q: be,
      m: ce,
      l: de,
      N: ee,
      Lb: fe,
      Y: ge,
      X: he,
      W: ie,
      n: je,
      A: ke,
      x: le,
      v: me,
      Kb: ne,
      tb: (a, b, c, f) => Wd(a, b, c, f),
    };
    (function () {
      function a(c) {
        Q = c = c.exports;
        Ma = Q.$c;
        Wa();
        Xa = Q.bd;
        Za.unshift(Q.ad);
        db--;
        w.monitorRunDependencies && w.monitorRunDependencies(db);
        if (0 == db && (null !== eb && (clearInterval(eb), (eb = null)), fb)) {
          var f = fb;
          fb = null;
          f();
        }
        return c;
      }
      var b = {
        a: oe
      };
      db++;
      w.monitorRunDependencies && w.monitorRunDependencies(db);
      if (w.instantiateWasm)
        try {
          return w.instantiateWasm(b, a);
        } catch (c) {
          Ja("Module.instantiateWasm callback failed with error: " + c), fa(c);
        }
      qb(b, function (c) {
        a(c.instance);
      }).catch(fa);
      return {};
    })();
    var wc = (w._free = (a) => (wc = w._free = Q.cd)(a)),
      Kd = (w._malloc = (a) => (Kd = w._malloc = Q.dd)(a)),
      vc = (a) => (vc = Q.ed)(a);
    w.__embind_initialize_bindings = () =>
      (w.__embind_initialize_bindings = Q.fd)();
    var pe = (a, b) => (pe = Q.gd)(a, b),
      qe = () => (qe = Q.hd)(),
      re = (a) => (re = Q.id)(a);
    w.dynCall_viji = (a, b, c, f, h) => (w.dynCall_viji = Q.jd)(a, b, c, f, h);
    w.dynCall_vijiii = (a, b, c, f, h, m, u) =>
      (w.dynCall_vijiii = Q.kd)(a, b, c, f, h, m, u);
    w.dynCall_viiiiij = (a, b, c, f, h, m, u, n) =>
      (w.dynCall_viiiiij = Q.ld)(a, b, c, f, h, m, u, n);
    w.dynCall_jiiiijiiiii = (a, b, c, f, h, m, u, n, q, v, E, I) =>
      (w.dynCall_jiiiijiiiii = Q.md)(a, b, c, f, h, m, u, n, q, v, E, I);
    w.dynCall_viiij = (a, b, c, f, h, m) =>
      (w.dynCall_viiij = Q.nd)(a, b, c, f, h, m);
    w.dynCall_jii = (a, b, c) => (w.dynCall_jii = Q.od)(a, b, c);
    w.dynCall_vij = (a, b, c, f) => (w.dynCall_vij = Q.pd)(a, b, c, f);
    w.dynCall_iiij = (a, b, c, f, h) => (w.dynCall_iiij = Q.qd)(a, b, c, f, h);
    w.dynCall_iiiij = (a, b, c, f, h, m) =>
      (w.dynCall_iiiij = Q.rd)(a, b, c, f, h, m);
    w.dynCall_viij = (a, b, c, f, h) => (w.dynCall_viij = Q.sd)(a, b, c, f, h);
    w.dynCall_ji = (a, b) => (w.dynCall_ji = Q.td)(a, b);
    w.dynCall_iij = (a, b, c, f) => (w.dynCall_iij = Q.ud)(a, b, c, f);
    w.dynCall_jiiiiii = (a, b, c, f, h, m, u) =>
      (w.dynCall_jiiiiii = Q.vd)(a, b, c, f, h, m, u);
    w.dynCall_jiiiiji = (a, b, c, f, h, m, u, n) =>
      (w.dynCall_jiiiiji = Q.wd)(a, b, c, f, h, m, u, n);
    w.dynCall_iijj = (a, b, c, f, h, m) =>
      (w.dynCall_iijj = Q.xd)(a, b, c, f, h, m);
    w.dynCall_iiiji = (a, b, c, f, h, m) =>
      (w.dynCall_iiiji = Q.yd)(a, b, c, f, h, m);
    w.dynCall_iiji = (a, b, c, f, h) => (w.dynCall_iiji = Q.zd)(a, b, c, f, h);
    w.dynCall_iijjiii = (a, b, c, f, h, m, u, n, q) =>
      (w.dynCall_iijjiii = Q.Ad)(a, b, c, f, h, m, u, n, q);
    w.dynCall_vijjjii = (a, b, c, f, h, m, u, n, q, v) =>
      (w.dynCall_vijjjii = Q.Bd)(a, b, c, f, h, m, u, n, q, v);
    w.dynCall_jiji = (a, b, c, f, h) => (w.dynCall_jiji = Q.Cd)(a, b, c, f, h);
    w.dynCall_viijii = (a, b, c, f, h, m, u) =>
      (w.dynCall_viijii = Q.Dd)(a, b, c, f, h, m, u);
    w.dynCall_iiiiij = (a, b, c, f, h, m, u) =>
      (w.dynCall_iiiiij = Q.Ed)(a, b, c, f, h, m, u);
    w.dynCall_iiiiijj = (a, b, c, f, h, m, u, n, q) =>
      (w.dynCall_iiiiijj = Q.Fd)(a, b, c, f, h, m, u, n, q);
    w.dynCall_iiiiiijj = (a, b, c, f, h, m, u, n, q, v) =>
      (w.dynCall_iiiiiijj = Q.Gd)(a, b, c, f, h, m, u, n, q, v);

    function be(a, b) {
      var c = qe();
      try {
        return Xa.get(a)(b);
      } catch (f) {
        re(c);
        if (f !== f + 0) throw f;
        pe(1, 0);
      }
    }

    function ce(a, b, c) {
      var f = qe();
      try {
        return Xa.get(a)(b, c);
      } catch (h) {
        re(f);
        if (h !== h + 0) throw h;
        pe(1, 0);
      }
    }

    function de(a, b, c, f) {
      var h = qe();
      try {
        return Xa.get(a)(b, c, f);
      } catch (m) {
        re(h);
        if (m !== m + 0) throw m;
        pe(1, 0);
      }
    }

    function je(a, b) {
      var c = qe();
      try {
        Xa.get(a)(b);
      } catch (f) {
        re(c);
        if (f !== f + 0) throw f;
        pe(1, 0);
      }
    }

    function le(a, b, c, f) {
      var h = qe();
      try {
        Xa.get(a)(b, c, f);
      } catch (m) {
        re(h);
        if (m !== m + 0) throw m;
        pe(1, 0);
      }
    }

    function ke(a, b, c) {
      var f = qe();
      try {
        Xa.get(a)(b, c);
      } catch (h) {
        re(f);
        if (h !== h + 0) throw h;
        pe(1, 0);
      }
    }

    function fe(a, b, c, f, h, m) {
      var u = qe();
      try {
        return Xa.get(a)(b, c, f, h, m);
      } catch (n) {
        re(u);
        if (n !== n + 0) throw n;
        pe(1, 0);
      }
    }

    function me(a, b, c, f, h) {
      var m = qe();
      try {
        Xa.get(a)(b, c, f, h);
      } catch (u) {
        re(m);
        if (u !== u + 0) throw u;
        pe(1, 0);
      }
    }

    function ge(a, b, c, f, h, m, u) {
      var n = qe();
      try {
        return Xa.get(a)(b, c, f, h, m, u);
      } catch (q) {
        re(n);
        if (q !== q + 0) throw q;
        pe(1, 0);
      }
    }

    function ne(a, b, c, f, h, m) {
      var u = qe();
      try {
        Xa.get(a)(b, c, f, h, m);
      } catch (n) {
        re(u);
        if (n !== n + 0) throw n;
        pe(1, 0);
      }
    }

    function ee(a, b, c, f, h) {
      var m = qe();
      try {
        return Xa.get(a)(b, c, f, h);
      } catch (u) {
        re(m);
        if (u !== u + 0) throw u;
        pe(1, 0);
      }
    }

    function he(a, b, c, f, h, m, u, n, q, v) {
      var E = qe();
      try {
        return Xa.get(a)(b, c, f, h, m, u, n, q, v);
      } catch (I) {
        re(E);
        if (I !== I + 0) throw I;
        pe(1, 0);
      }
    }

    function ie(a) {
      var b = qe();
      try {
        Xa.get(a)();
      } catch (c) {
        re(b);
        if (c !== c + 0) throw c;
        pe(1, 0);
      }
    }
    var se;
    fb = function te() {
      se || ue();
      se || (fb = te);
    };

    function ue() {
      function a() {
        if (!se && ((se = !0), (w.calledRun = !0), !Pa)) {
          sb(Za);
          ba(w);
          if (w.onRuntimeInitialized) w.onRuntimeInitialized();
          if (w.postRun)
            for (
              "function" == typeof w.postRun && (w.postRun = [w.postRun]); w.postRun.length;

            ) {
              var b = w.postRun.shift();
              bb.unshift(b);
            }
          sb(bb);
        }
      }
      if (!(0 < db)) {
        if (w.preRun)
          for (
            "function" == typeof w.preRun && (w.preRun = [w.preRun]); w.preRun.length;

          )
            cb();
        sb(Ya);
        0 < db ||
          (w.setStatus ?
            (w.setStatus("Running..."),
              setTimeout(function () {
                setTimeout(function () {
                  w.setStatus("");
                }, 1);
                a();
              }, 1)) :
            a());
      }
    }
    if (w.preInit)
      for (
        "function" == typeof w.preInit && (w.preInit = [w.preInit]); 0 < w.preInit.length;

      )
        w.preInit.pop()();
    ue();

    return moduleArg.ready;
  };
})();
if (typeof exports === "object" && typeof module === "object")
  module.exports = {
    CanvasKitInit,
    GLVersion
  };
else if (typeof define === "function" && define["amd"])
  define([], () => {
    CanvasKitInit,
    GLVersion
  });