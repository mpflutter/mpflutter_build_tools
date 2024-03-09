const WebAssembly = WXWebAssembly;
var requestAnimationFrame = undefined;
const GLVersion = 2;
var CanvasKitInit = (() => {
  var _scriptDir =
    typeof document !== "undefined" && document.currentScript
      ? document.currentScript.src
      : undefined;
  if (typeof __filename !== "undefined") _scriptDir = _scriptDir || __filename;
  return function (moduleArg = {}) {
    var w = moduleArg,
      aa,
      ba;
    w.ready = new Promise((a, b) => {
      aa = a;
      ba = b;
    });
    (function (a) {
      a.vd = a.vd || [];
      a.vd.push(function () {
        a.MakeSWCanvasSurface = function (b) {
          var c = b,
            e =
              "undefined" !== typeof OffscreenCanvas &&
              c instanceof OffscreenCanvas;
          if (
            !(
              ("undefined" !== typeof HTMLCanvasElement &&
                c instanceof HTMLCanvasElement) ||
              e ||
              ((c = document.getElementById(b)), c)
            )
          )
            throw "Canvas with id " + b + " was not found";
          if ((b = a.MakeSurface(c.width, c.height))) b.nd = c;
          return b;
        };
        a.MakeCanvasSurface || (a.MakeCanvasSurface = a.MakeSWCanvasSurface);
        a.MakeSurface = function (b, c) {
          var e = {
              width: b,
              height: c,
              colorType: a.ColorType.RGBA_8888,
              alphaType: a.AlphaType.Unpremul,
              colorSpace: a.ColorSpace.SRGB,
            },
            g = b * c * 4,
            m = a._malloc(g);
          if ((e = a.Surface._makeRasterDirect(e, m, 4 * b)))
            (e.nd = null),
              (e.ff = b),
              (e.bf = c),
              (e.df = g),
              (e.Ee = m),
              e.getCanvas().clear(a.TRANSPARENT);
          return e;
        };
        a.MakeRasterDirectSurface = function (b, c, e) {
          return a.Surface._makeRasterDirect(b, c.byteOffset, e);
        };
        a.Surface.prototype.flush = function (b) {
          a.od(this.md);
          this._flush();
          if (this.nd) {
            var c = new Uint8ClampedArray(a.HEAPU8.buffer, this.Ee, this.df);
            c = new ImageData(c, this.ff, this.bf);
            b
              ? this.nd
                  .getContext("2d")
                  .putImageData(c, 0, 0, b[0], b[1], b[2] - b[0], b[3] - b[1])
              : this.nd.getContext("2d").putImageData(c, 0, 0);
          }
        };
        a.Surface.prototype.dispose = function () {
          this.Ee && a._free(this.Ee);
          this.delete();
        };
        a.od = a.od || function () {};
        a.ve =
          a.ve ||
          function () {
            return null;
          };
      });
    })(w);
    (function (a) {
      a.vd = a.vd || [];
      a.vd.push(function () {
        function b(n, q, v) {
          return n && n.hasOwnProperty(q) ? n[q] : v;
        }
        function c(n) {
          var q = fa(ha);
          ha[q] = n;
          return q;
        }
        function e(n) {
          return (
            n.naturalHeight || n.videoHeight || n.displayHeight || n.height
          );
        }
        function g(n) {
          return n.naturalWidth || n.videoWidth || n.displayWidth || n.width;
        }
        function m(n, q, v, G) {
          n.bindTexture(n.TEXTURE_2D, q);
          G ||
            v.alphaType !== a.AlphaType.Premul ||
            n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0);
          return q;
        }
        function t(n, q, v) {
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
          v.majorVersion = GLVersion;
          if (v.explicitSwapControl)
            throw "explicitSwapControl is not supported";
          n = ia(n, v);
          if (!n) return 0;
          na(n);
          B.Id.getExtension("WEBGL_debug_renderer_info");
          return n;
        };
        a.deleteContext = function (n) {
          B === oa[n] && (B = null);
          "object" == typeof JSEvents && JSEvents.Xf(oa[n].Id.canvas);
          oa[n] && oa[n].Id.canvas && (oa[n].Id.canvas.$e = void 0);
          oa[n] = null;
        };
        a._setTextureCleanup({
          deleteTexture: function (n, q) {
            var v = ha[q];
            v && oa[n].Id.deleteTexture(v);
            ha[q] = null;
          },
        });
        a.MakeWebGLContext = function (n) {
          if (!this.od(n)) return null;
          var q = this._MakeGrContext();
          if (!q) return null;
          q.md = n;
          var v = q.delete.bind(q);
          q["delete"] = function () {
            a.od(this.md);
            v();
          }.bind(q);
          return (B.Ie = q);
        };
        a.MakeGrContext = a.MakeWebGLContext;
        a.GrDirectContext.prototype.getResourceCacheLimitBytes = function () {
          a.od(this.md);
          this._getResourceCacheLimitBytes();
        };
        a.GrDirectContext.prototype.getResourceCacheUsageBytes = function () {
          a.od(this.md);
          this._getResourceCacheUsageBytes();
        };
        a.GrDirectContext.prototype.releaseResourcesAndAbandonContext =
          function () {
            a.od(this.md);
            this._releaseResourcesAndAbandonContext();
          };
        a.GrDirectContext.prototype.setResourceCacheLimitBytes = function (n) {
          a.od(this.md);
          this._setResourceCacheLimitBytes(n);
        };
        a.MakeOnScreenGLSurface = function (n, q, v, G, I, L) {
          if (!this.od(n.md)) return null;
          q =
            void 0 === I || void 0 === L
              ? this._MakeOnScreenGLSurface(n, q, v, G)
              : this._MakeOnScreenGLSurface(n, q, v, G, I, L);
          if (!q) return null;
          q.md = n.md;
          return q;
        };
        a.MakeRenderTarget = function () {
          var n = arguments[0];
          if (!this.od(n.md)) return null;
          if (3 === arguments.length) {
            var q = this._MakeRenderTargetWH(n, arguments[1], arguments[2]);
            if (!q) return null;
          } else if (2 === arguments.length) {
            if (((q = this._MakeRenderTargetII(n, arguments[1])), !q))
              return null;
          } else return null;
          q.md = n.md;
          return q;
        };
        a.MakeWebGLCanvasSurface = function (n, q, v) {
          requestAnimationFrame = n.requestAnimationFrame;
          q = q || null;
          v = this.GetWebGLContext(n, v);
          if (!v || 0 > v) throw "failed to create webgl context: err " + v;
          v = this.MakeWebGLContext(v);
          q = this.MakeOnScreenGLSurface(v, n.width, n.height, q);
          return q
            ? q
            : ((q = n.cloneNode(!0)),
              n.parentNode.replaceChild(q, n),
              q.classList.add("ck-replaced"),
              a.MakeSWCanvasSurface(q));
        };
        a.MakeCanvasSurface = a.MakeWebGLCanvasSurface;
        a.Surface.prototype.makeImageFromTexture = function (n, q) {
          a.od(this.md);
          n = c(n);
          if ((q = this._makeImageFromTexture(this.md, n, q))) q.me = n;
          return q;
        };
        a.Surface.prototype.makeImageFromTextureSource = function (n, q, v) {
          q ||
            (q = {
              height: e(n),
              width: g(n),
              colorType: a.ColorType.RGBA_8888,
              alphaType: v ? a.AlphaType.Premul : a.AlphaType.Unpremul,
            });
          q.colorSpace || (q.colorSpace = a.ColorSpace.SRGB);
          a.od(this.md);
          var G = B.Id;
          v = m(G, G.createTexture(), q, v);
          2 === B.version
            ? G.texImage2D(
                G.TEXTURE_2D,
                0,
                G.RGBA,
                q.width,
                q.height,
                0,
                G.RGBA,
                G.UNSIGNED_BYTE,
                n
              )
            : G.texImage2D(G.TEXTURE_2D, 0, G.RGBA, G.RGBA, G.UNSIGNED_BYTE, n);
          t(G, q);
          this._resetContext();
          return this.makeImageFromTexture(v, q);
        };
        a.Surface.prototype.updateTextureFromSource = function (n, q, v) {
          if (n.me) {
            a.od(this.md);
            var G = n.getImageInfo(),
              I = B.Id,
              L = m(I, ha[n.me], G, v);
            2 === B.version
              ? I.texImage2D(
                  I.TEXTURE_2D,
                  0,
                  I.RGBA,
                  g(q),
                  e(q),
                  0,
                  I.RGBA,
                  I.UNSIGNED_BYTE,
                  q
                )
              : I.texImage2D(
                  I.TEXTURE_2D,
                  0,
                  I.RGBA,
                  I.RGBA,
                  I.UNSIGNED_BYTE,
                  q
                );
            t(I, G, v);
            this._resetContext();
            ha[n.me] = null;
            n.me = c(L);
            G.colorSpace = n.getColorSpace();
            q = this._makeImageFromTexture(this.md, n.me, G);
            v = n.ld.td;
            I = n.ld.Ad;
            n.ld.td = q.ld.td;
            n.ld.Ad = q.ld.Ad;
            q.ld.td = v;
            q.ld.Ad = I;
            q.delete();
            G.colorSpace.delete();
          }
        };
        a.MakeLazyImageFromTextureSource = function (n, q, v) {
          q ||
            (q = {
              height: e(n),
              width: g(n),
              colorType: a.ColorType.RGBA_8888,
              alphaType: v ? a.AlphaType.Premul : a.AlphaType.Unpremul,
            });
          q.colorSpace || (q.colorSpace = a.ColorSpace.SRGB);
          var G = {
            makeTexture: function () {
              var I = B,
                L = I.Id,
                y = m(L, L.createTexture(), q, v);
              2 === I.version
                ? L.texImage2D(
                    L.TEXTURE_2D,
                    0,
                    L.RGBA,
                    q.width,
                    q.height,
                    0,
                    L.RGBA,
                    L.UNSIGNED_BYTE,
                    n
                  )
                : L.texImage2D(
                    L.TEXTURE_2D,
                    0,
                    L.RGBA,
                    L.RGBA,
                    L.UNSIGNED_BYTE,
                    n
                  );
              t(L, q, v);
              return c(y);
            },
            freeSrc: function () {},
          };
          "VideoFrame" === n.constructor.name &&
            (G.freeSrc = function () {
              n.close();
            });
          return a.Image._makeFromGenerator(q, G);
        };
        a.od = function (n) {
          return n ? na(n) : !1;
        };
        a.ve = function () {
          return B && B.Ie && !B.Ie.isDeleted() ? B.Ie : null;
        };
      });
    })(w);
    (function (a) {
      function b(f, d, h, l, u) {
        for (var x = 0; x < f.length; x++)
          d[x * h + ((x * u + l + h) % h)] = f[x];
        return d;
      }
      function c(f) {
        for (var d = f * f, h = Array(d); d--; )
          h[d] = 0 === d % (f + 1) ? 1 : 0;
        return h;
      }
      function e(f) {
        return f ? f.constructor === Float32Array && 4 === f.length : !1;
      }
      function g(f) {
        return (
          ((n(255 * f[3]) << 24) |
            (n(255 * f[0]) << 16) |
            (n(255 * f[1]) << 8) |
            (n(255 * f[2]) << 0)) >>>
          0
        );
      }
      function m(f) {
        if (f && f._ck) return f;
        if (f instanceof Float32Array) {
          for (
            var d = Math.floor(f.length / 4), h = new Uint32Array(d), l = 0;
            l < d;
            l++
          )
            h[l] = g(f.slice(4 * l, 4 * (l + 1)));
          return h;
        }
        if (f instanceof Uint32Array) return f;
        if (f instanceof Array && f[0] instanceof Float32Array) return f.map(g);
      }
      function t(f) {
        if (void 0 === f) return 1;
        var d = parseFloat(f);
        return f && -1 !== f.indexOf("%") ? d / 100 : d;
      }
      function n(f) {
        return Math.round(Math.max(0, Math.min(f || 0, 255)));
      }
      function q(f, d) {
        (d && d._ck) || a._free(f);
      }
      function v(f, d, h) {
        if (!f || !f.length) return W;
        if (f && f._ck) return f.byteOffset;
        var l = a[d].BYTES_PER_ELEMENT;
        h || (h = a._malloc(f.length * l));
        a[d].set(f, h / l);
        return h;
      }
      function G(f) {
        var d = { Ed: W, count: f.length, colorType: a.ColorType.RGBA_F32 };
        if (f instanceof Float32Array)
          (d.Ed = v(f, "HEAPF32")), (d.count = f.length / 4);
        else if (f instanceof Uint32Array)
          (d.Ed = v(f, "HEAPU32")), (d.colorType = a.ColorType.RGBA_8888);
        else if (f instanceof Array) {
          if (f && f.length) {
            for (
              var h = a._malloc(16 * f.length), l = 0, u = h / 4, x = 0;
              x < f.length;
              x++
            )
              for (var E = 0; 4 > E; E++) (a.HEAPF32[u + l] = f[x][E]), l++;
            f = h;
          } else f = W;
          d.Ed = f;
        } else
          throw (
            "Invalid argument to copyFlexibleColorArray, Not a color array " +
            typeof f
          );
        return d;
      }
      function I(f) {
        if (!f) return W;
        var d = Wb.toTypedArray();
        if (f.length) {
          if (6 === f.length || 9 === f.length)
            return (
              v(f, "HEAPF32", Ka),
              6 === f.length && a.HEAPF32.set(xd, 6 + Ka / 4),
              Ka
            );
          if (16 === f.length)
            return (
              (d[0] = f[0]),
              (d[1] = f[1]),
              (d[2] = f[3]),
              (d[3] = f[4]),
              (d[4] = f[5]),
              (d[5] = f[7]),
              (d[6] = f[12]),
              (d[7] = f[13]),
              (d[8] = f[15]),
              Ka
            );
          throw "invalid matrix size";
        }
        if (void 0 === f.m11) throw "invalid matrix argument";
        d[0] = f.m11;
        d[1] = f.m21;
        d[2] = f.m41;
        d[3] = f.m12;
        d[4] = f.m22;
        d[5] = f.m42;
        d[6] = f.m14;
        d[7] = f.m24;
        d[8] = f.m44;
        return Ka;
      }
      function L(f) {
        if (!f) return W;
        var d = Xb.toTypedArray();
        if (f.length) {
          if (16 !== f.length && 6 !== f.length && 9 !== f.length)
            throw "invalid matrix size";
          if (16 === f.length) return v(f, "HEAPF32", Ya);
          d.fill(0);
          d[0] = f[0];
          d[1] = f[1];
          d[3] = f[2];
          d[4] = f[3];
          d[5] = f[4];
          d[7] = f[5];
          d[10] = 1;
          d[12] = f[6];
          d[13] = f[7];
          d[15] = f[8];
          6 === f.length && ((d[12] = 0), (d[13] = 0), (d[15] = 1));
          return Ya;
        }
        if (void 0 === f.m11) throw "invalid matrix argument";
        d[0] = f.m11;
        d[1] = f.m21;
        d[2] = f.m31;
        d[3] = f.m41;
        d[4] = f.m12;
        d[5] = f.m22;
        d[6] = f.m32;
        d[7] = f.m42;
        d[8] = f.m13;
        d[9] = f.m23;
        d[10] = f.m33;
        d[11] = f.m43;
        d[12] = f.m14;
        d[13] = f.m24;
        d[14] = f.m34;
        d[15] = f.m44;
        return Ya;
      }
      function y(f, d) {
        return v(f, "HEAPF32", d || Ra);
      }
      function M(f, d, h, l) {
        var u = Yb.toTypedArray();
        u[0] = f;
        u[1] = d;
        u[2] = h;
        u[3] = l;
        return Ra;
      }
      function T(f) {
        for (var d = new Float32Array(4), h = 0; 4 > h; h++)
          d[h] = a.HEAPF32[f / 4 + h];
        return d;
      }
      function S(f, d) {
        return v(f, "HEAPF32", d || ja);
      }
      function pa(f, d) {
        return v(f, "HEAPF32", d || Zb);
      }
      function la() {
        for (var f = 0, d = 0; d < arguments.length - 1; d += 2)
          f += arguments[d] * arguments[d + 1];
        return f;
      }
      function hb(f, d, h) {
        for (var l = Array(f.length), u = 0; u < h; u++)
          for (var x = 0; x < h; x++) {
            for (var E = 0, K = 0; K < h; K++) E += f[h * u + K] * d[h * K + x];
            l[u * h + x] = E;
          }
        return l;
      }
      function ib(f, d) {
        for (var h = hb(d[0], d[1], f), l = 2; l < d.length; )
          (h = hb(h, d[l], f)), l++;
        return h;
      }
      a.Color = function (f, d, h, l) {
        void 0 === l && (l = 1);
        return a.Color4f(n(f) / 255, n(d) / 255, n(h) / 255, l);
      };
      a.ColorAsInt = function (f, d, h, l) {
        void 0 === l && (l = 255);
        return (
          ((n(l) << 24) |
            (n(f) << 16) |
            (n(d) << 8) |
            ((n(h) << 0) & 268435455)) >>>
          0
        );
      };
      a.Color4f = function (f, d, h, l) {
        void 0 === l && (l = 1);
        return Float32Array.of(f, d, h, l);
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
      a.getColorComponents = function (f) {
        return [
          Math.floor(255 * f[0]),
          Math.floor(255 * f[1]),
          Math.floor(255 * f[2]),
          f[3],
        ];
      };
      a.parseColorString = function (f, d) {
        f = f.toLowerCase();
        if (f.startsWith("#")) {
          d = 255;
          switch (f.length) {
            case 9:
              d = parseInt(f.slice(7, 9), 16);
            case 7:
              var h = parseInt(f.slice(1, 3), 16);
              var l = parseInt(f.slice(3, 5), 16);
              var u = parseInt(f.slice(5, 7), 16);
              break;
            case 5:
              d = 17 * parseInt(f.slice(4, 5), 16);
            case 4:
              (h = 17 * parseInt(f.slice(1, 2), 16)),
                (l = 17 * parseInt(f.slice(2, 3), 16)),
                (u = 17 * parseInt(f.slice(3, 4), 16));
          }
          return a.Color(h, l, u, d / 255);
        }
        return f.startsWith("rgba")
          ? ((f = f.slice(5, -1)),
            (f = f.split(",")),
            a.Color(+f[0], +f[1], +f[2], t(f[3])))
          : f.startsWith("rgb")
          ? ((f = f.slice(4, -1)),
            (f = f.split(",")),
            a.Color(+f[0], +f[1], +f[2], t(f[3])))
          : f.startsWith("gray(") ||
            f.startsWith("hsl") ||
            !d ||
            ((f = d[f]), void 0 === f)
          ? a.BLACK
          : f;
      };
      a.multiplyByAlpha = function (f, d) {
        f = f.slice();
        f[3] = Math.max(0, Math.min(f[3] * d, 1));
        return f;
      };
      a.Malloc = function (f, d) {
        var h = a._malloc(d * f.BYTES_PER_ELEMENT);
        return {
          _ck: !0,
          length: d,
          byteOffset: h,
          Td: null,
          subarray: function (l, u) {
            l = this.toTypedArray().subarray(l, u);
            l._ck = !0;
            return l;
          },
          toTypedArray: function () {
            if (this.Td && this.Td.length) return this.Td;
            this.Td = new f(a.HEAPU8.buffer, h, d);
            this.Td._ck = !0;
            return this.Td;
          },
        };
      };
      a.Free = function (f) {
        a._free(f.byteOffset);
        f.byteOffset = W;
        f.toTypedArray = null;
        f.Td = null;
      };
      var Ka = W,
        Wb,
        Ya = W,
        Xb,
        Ra = W,
        Yb,
        za,
        ja = W,
        yc,
        La = W,
        zc,
        $b = W,
        Ac,
        ac = W,
        yb,
        jb = W,
        Bc,
        Zb = W,
        Cc,
        Dc = W,
        xd = Float32Array.of(0, 0, 1),
        W = 0;
      a.onRuntimeInitialized = function () {
        function f(d, h, l, u, x, E, K) {
          E ||
            ((E = 4 * u.width),
            u.colorType === a.ColorType.RGBA_F16
              ? (E *= 2)
              : u.colorType === a.ColorType.RGBA_F32 && (E *= 4));
          var O = E * u.height;
          var Q = x ? x.byteOffset : a._malloc(O);
          if (
            K ? !d._readPixels(u, Q, E, h, l, K) : !d._readPixels(u, Q, E, h, l)
          )
            return x || a._free(Q), null;
          if (x) return x.toTypedArray();
          switch (u.colorType) {
            case a.ColorType.RGBA_8888:
            case a.ColorType.RGBA_F16:
              d = new Uint8Array(a.HEAPU8.buffer, Q, O).slice();
              break;
            case a.ColorType.RGBA_F32:
              d = new Float32Array(a.HEAPU8.buffer, Q, O).slice();
              break;
            default:
              return null;
          }
          a._free(Q);
          return d;
        }
        Yb = a.Malloc(Float32Array, 4);
        Ra = Yb.byteOffset;
        Xb = a.Malloc(Float32Array, 16);
        Ya = Xb.byteOffset;
        Wb = a.Malloc(Float32Array, 9);
        Ka = Wb.byteOffset;
        Bc = a.Malloc(Float32Array, 12);
        Zb = Bc.byteOffset;
        Cc = a.Malloc(Float32Array, 12);
        Dc = Cc.byteOffset;
        za = a.Malloc(Float32Array, 4);
        ja = za.byteOffset;
        yc = a.Malloc(Float32Array, 4);
        La = yc.byteOffset;
        zc = a.Malloc(Float32Array, 3);
        $b = zc.byteOffset;
        Ac = a.Malloc(Float32Array, 3);
        ac = Ac.byteOffset;
        yb = a.Malloc(Int32Array, 4);
        jb = yb.byteOffset;
        a.ColorSpace.SRGB = a.ColorSpace._MakeSRGB();
        a.ColorSpace.DISPLAY_P3 = a.ColorSpace._MakeDisplayP3();
        a.ColorSpace.ADOBE_RGB = a.ColorSpace._MakeAdobeRGB();
        a.GlyphRunFlags = { IsWhiteSpace: a._GlyphRunFlags_isWhiteSpace };
        a.Path.MakeFromCmds = function (d) {
          var h = v(d, "HEAPF32"),
            l = a.Path._MakeFromCmds(h, d.length);
          q(h, d);
          return l;
        };
        a.Path.MakeFromVerbsPointsWeights = function (d, h, l) {
          var u = v(d, "HEAPU8"),
            x = v(h, "HEAPF32"),
            E = v(l, "HEAPF32"),
            K = a.Path._MakeFromVerbsPointsWeights(
              u,
              d.length,
              x,
              h.length,
              E,
              (l && l.length) || 0
            );
          q(u, d);
          q(x, h);
          q(E, l);
          return K;
        };
        a.Path.prototype.addArc = function (d, h, l) {
          d = S(d);
          this._addArc(d, h, l);
          return this;
        };
        a.Path.prototype.addCircle = function (d, h, l, u) {
          this._addCircle(d, h, l, !!u);
          return this;
        };
        a.Path.prototype.addOval = function (d, h, l) {
          void 0 === l && (l = 1);
          d = S(d);
          this._addOval(d, !!h, l);
          return this;
        };
        a.Path.prototype.addPath = function () {
          var d = Array.prototype.slice.call(arguments),
            h = d[0],
            l = !1;
          "boolean" === typeof d[d.length - 1] && (l = d.pop());
          if (1 === d.length) this._addPath(h, 1, 0, 0, 0, 1, 0, 0, 0, 1, l);
          else if (2 === d.length)
            (d = d[1]),
              this._addPath(
                h,
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
              h,
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
        a.Path.prototype.addPoly = function (d, h) {
          var l = v(d, "HEAPF32");
          this._addPoly(l, d.length / 2, h);
          q(l, d);
          return this;
        };
        a.Path.prototype.addRect = function (d, h) {
          d = S(d);
          this._addRect(d, !!h);
          return this;
        };
        a.Path.prototype.addRRect = function (d, h) {
          d = pa(d);
          this._addRRect(d, !!h);
          return this;
        };
        a.Path.prototype.addVerbsPointsWeights = function (d, h, l) {
          var u = v(d, "HEAPU8"),
            x = v(h, "HEAPF32"),
            E = v(l, "HEAPF32");
          this._addVerbsPointsWeights(
            u,
            d.length,
            x,
            h.length,
            E,
            (l && l.length) || 0
          );
          q(u, d);
          q(x, h);
          q(E, l);
        };
        a.Path.prototype.arc = function (d, h, l, u, x, E) {
          d = a.LTRBRect(d - l, h - l, d + l, h + l);
          x = ((x - u) / Math.PI) * 180 - 360 * !!E;
          E = new a.Path();
          E.addArc(d, (u / Math.PI) * 180, x);
          this.addPath(E, !0);
          E.delete();
          return this;
        };
        a.Path.prototype.arcToOval = function (d, h, l, u) {
          d = S(d);
          this._arcToOval(d, h, l, u);
          return this;
        };
        a.Path.prototype.arcToRotated = function (d, h, l, u, x, E, K) {
          this._arcToRotated(d, h, l, !!u, !!x, E, K);
          return this;
        };
        a.Path.prototype.arcToTangent = function (d, h, l, u, x) {
          this._arcToTangent(d, h, l, u, x);
          return this;
        };
        a.Path.prototype.close = function () {
          this._close();
          return this;
        };
        a.Path.prototype.conicTo = function (d, h, l, u, x) {
          this._conicTo(d, h, l, u, x);
          return this;
        };
        a.Path.prototype.computeTightBounds = function (d) {
          this._computeTightBounds(ja);
          var h = za.toTypedArray();
          return d ? (d.set(h), d) : h.slice();
        };
        a.Path.prototype.cubicTo = function (d, h, l, u, x, E) {
          this._cubicTo(d, h, l, u, x, E);
          return this;
        };
        a.Path.prototype.dash = function (d, h, l) {
          return this._dash(d, h, l) ? this : null;
        };
        a.Path.prototype.getBounds = function (d) {
          this._getBounds(ja);
          var h = za.toTypedArray();
          return d ? (d.set(h), d) : h.slice();
        };
        a.Path.prototype.lineTo = function (d, h) {
          this._lineTo(d, h);
          return this;
        };
        a.Path.prototype.moveTo = function (d, h) {
          this._moveTo(d, h);
          return this;
        };
        a.Path.prototype.offset = function (d, h) {
          this._transform(1, 0, d, 0, 1, h, 0, 0, 1);
          return this;
        };
        a.Path.prototype.quadTo = function (d, h, l, u) {
          this._quadTo(d, h, l, u);
          return this;
        };
        a.Path.prototype.rArcTo = function (d, h, l, u, x, E, K) {
          this._rArcTo(d, h, l, u, x, E, K);
          return this;
        };
        a.Path.prototype.rConicTo = function (d, h, l, u, x) {
          this._rConicTo(d, h, l, u, x);
          return this;
        };
        a.Path.prototype.rCubicTo = function (d, h, l, u, x, E) {
          this._rCubicTo(d, h, l, u, x, E);
          return this;
        };
        a.Path.prototype.rLineTo = function (d, h) {
          this._rLineTo(d, h);
          return this;
        };
        a.Path.prototype.rMoveTo = function (d, h) {
          this._rMoveTo(d, h);
          return this;
        };
        a.Path.prototype.rQuadTo = function (d, h, l, u) {
          this._rQuadTo(d, h, l, u);
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
        a.Path.prototype.trim = function (d, h, l) {
          return this._trim(d, h, !!l) ? this : null;
        };
        a.Image.prototype.encodeToBytes = function (d, h) {
          var l = a.ve();
          d = d || a.ImageFormat.PNG;
          h = h || 100;
          return l ? this._encodeToBytes(d, h, l) : this._encodeToBytes(d, h);
        };
        a.Image.prototype.makeShaderCubic = function (d, h, l, u, x) {
          x = I(x);
          return this._makeShaderCubic(d, h, l, u, x);
        };
        a.Image.prototype.makeShaderOptions = function (d, h, l, u, x) {
          x = I(x);
          return this._makeShaderOptions(d, h, l, u, x);
        };
        a.Image.prototype.readPixels = function (d, h, l, u, x) {
          var E = a.ve();
          return f(this, d, h, l, u, x, E);
        };
        a.Canvas.prototype.clear = function (d) {
          a.od(this.md);
          d = y(d);
          this._clear(d);
        };
        a.Canvas.prototype.clipRRect = function (d, h, l) {
          a.od(this.md);
          d = pa(d);
          this._clipRRect(d, h, l);
        };
        a.Canvas.prototype.clipRect = function (d, h, l) {
          a.od(this.md);
          d = S(d);
          this._clipRect(d, h, l);
        };
        a.Canvas.prototype.concat = function (d) {
          a.od(this.md);
          d = L(d);
          this._concat(d);
        };
        a.Canvas.prototype.drawArc = function (d, h, l, u, x) {
          a.od(this.md);
          d = S(d);
          this._drawArc(d, h, l, u, x);
        };
        a.Canvas.prototype.drawAtlas = function (d, h, l, u, x, E, K) {
          if (d && u && h && l && h.length === l.length) {
            a.od(this.md);
            x || (x = a.BlendMode.SrcOver);
            var O = v(h, "HEAPF32"),
              Q = v(l, "HEAPF32"),
              Z = l.length / 4,
              ca = v(m(E), "HEAPU32");
            if (K && "B" in K && "C" in K)
              this._drawAtlasCubic(d, Q, O, ca, Z, x, K.B, K.C, u);
            else {
              let r = a.FilterMode.Linear,
                C = a.MipmapMode.None;
              K && ((r = K.filter), "mipmap" in K && (C = K.mipmap));
              this._drawAtlasOptions(d, Q, O, ca, Z, x, r, C, u);
            }
            q(O, h);
            q(Q, l);
            q(ca, E);
          }
        };
        a.Canvas.prototype.drawCircle = function (d, h, l, u) {
          a.od(this.md);
          this._drawCircle(d, h, l, u);
        };
        a.Canvas.prototype.drawColor = function (d, h) {
          a.od(this.md);
          d = y(d);
          void 0 !== h ? this._drawColor(d, h) : this._drawColor(d);
        };
        a.Canvas.prototype.drawColorInt = function (d, h) {
          a.od(this.md);
          this._drawColorInt(d, h || a.BlendMode.SrcOver);
        };
        a.Canvas.prototype.drawColorComponents = function (d, h, l, u, x) {
          a.od(this.md);
          d = M(d, h, l, u);
          void 0 !== x ? this._drawColor(d, x) : this._drawColor(d);
        };
        a.Canvas.prototype.drawDRRect = function (d, h, l) {
          a.od(this.md);
          d = pa(d, Zb);
          h = pa(h, Dc);
          this._drawDRRect(d, h, l);
        };
        a.Canvas.prototype.drawImage = function (d, h, l, u) {
          a.od(this.md);
          this._drawImage(d, h, l, u || null);
        };
        a.Canvas.prototype.drawImageCubic = function (d, h, l, u, x, E) {
          a.od(this.md);
          this._drawImageCubic(d, h, l, u, x, E || null);
        };
        a.Canvas.prototype.drawImageOptions = function (d, h, l, u, x, E) {
          a.od(this.md);
          this._drawImageOptions(d, h, l, u, x, E || null);
        };
        a.Canvas.prototype.drawImageNine = function (d, h, l, u, x) {
          a.od(this.md);
          h = v(h, "HEAP32", jb);
          l = S(l);
          this._drawImageNine(d, h, l, u, x || null);
        };
        a.Canvas.prototype.drawImageRect = function (d, h, l, u, x) {
          a.od(this.md);
          S(h, ja);
          S(l, La);
          this._drawImageRect(d, ja, La, u, !!x);
        };
        a.Canvas.prototype.drawImageRectCubic = function (d, h, l, u, x, E) {
          a.od(this.md);
          S(h, ja);
          S(l, La);
          this._drawImageRectCubic(d, ja, La, u, x, E || null);
        };
        a.Canvas.prototype.drawImageRectOptions = function (d, h, l, u, x, E) {
          a.od(this.md);
          S(h, ja);
          S(l, La);
          this._drawImageRectOptions(d, ja, La, u, x, E || null);
        };
        a.Canvas.prototype.drawLine = function (d, h, l, u, x) {
          a.od(this.md);
          this._drawLine(d, h, l, u, x);
        };
        a.Canvas.prototype.drawOval = function (d, h) {
          a.od(this.md);
          d = S(d);
          this._drawOval(d, h);
        };
        a.Canvas.prototype.drawPaint = function (d) {
          a.od(this.md);
          this._drawPaint(d);
        };
        a.Canvas.prototype.drawParagraph = function (d, h, l) {
          a.od(this.md);
          this._drawParagraph(d, h, l);
        };
        a.Canvas.prototype.drawPatch = function (d, h, l, u, x) {
          if (24 > d.length) throw "Need 12 cubic points";
          if (h && 4 > h.length) throw "Need 4 colors";
          if (l && 8 > l.length) throw "Need 4 shader coordinates";
          a.od(this.md);
          const E = v(d, "HEAPF32"),
            K = h ? v(m(h), "HEAPU32") : W,
            O = l ? v(l, "HEAPF32") : W;
          u || (u = a.BlendMode.Modulate);
          this._drawPatch(E, K, O, u, x);
          q(O, l);
          q(K, h);
          q(E, d);
        };
        a.Canvas.prototype.drawPath = function (d, h) {
          a.od(this.md);
          this._drawPath(d, h);
        };
        a.Canvas.prototype.drawPicture = function (d) {
          a.od(this.md);
          this._drawPicture(d);
        };
        a.Canvas.prototype.drawPoints = function (d, h, l) {
          a.od(this.md);
          var u = v(h, "HEAPF32");
          this._drawPoints(d, u, h.length / 2, l);
          q(u, h);
        };
        a.Canvas.prototype.drawRRect = function (d, h) {
          a.od(this.md);
          d = pa(d);
          this._drawRRect(d, h);
        };
        a.Canvas.prototype.drawRect = function (d, h) {
          a.od(this.md);
          d = S(d);
          this._drawRect(d, h);
        };
        a.Canvas.prototype.drawRect4f = function (d, h, l, u, x) {
          a.od(this.md);
          this._drawRect4f(d, h, l, u, x);
        };
        a.Canvas.prototype.drawShadow = function (d, h, l, u, x, E, K) {
          a.od(this.md);
          var O = v(x, "HEAPF32"),
            Q = v(E, "HEAPF32");
          h = v(h, "HEAPF32", $b);
          l = v(l, "HEAPF32", ac);
          this._drawShadow(d, h, l, u, O, Q, K);
          q(O, x);
          q(Q, E);
        };
        a.getShadowLocalBounds = function (d, h, l, u, x, E, K) {
          d = I(d);
          l = v(l, "HEAPF32", $b);
          u = v(u, "HEAPF32", ac);
          if (!this._getShadowLocalBounds(d, h, l, u, x, E, ja)) return null;
          h = za.toTypedArray();
          return K ? (K.set(h), K) : h.slice();
        };
        a.Canvas.prototype.drawTextBlob = function (d, h, l, u) {
          a.od(this.md);
          this._drawTextBlob(d, h, l, u);
        };
        a.Canvas.prototype.drawVertices = function (d, h, l) {
          a.od(this.md);
          this._drawVertices(d, h, l);
        };
        a.Canvas.prototype.getDeviceClipBounds = function (d) {
          this._getDeviceClipBounds(jb);
          var h = yb.toTypedArray();
          d ? d.set(h) : (d = h.slice());
          return d;
        };
        a.Canvas.prototype.getLocalToDevice = function () {
          this._getLocalToDevice(Ya);
          for (var d = Ya, h = Array(16), l = 0; 16 > l; l++)
            h[l] = a.HEAPF32[d / 4 + l];
          return h;
        };
        a.Canvas.prototype.getTotalMatrix = function () {
          this._getTotalMatrix(Ka);
          for (var d = Array(9), h = 0; 9 > h; h++)
            d[h] = a.HEAPF32[Ka / 4 + h];
          return d;
        };
        a.Canvas.prototype.makeSurface = function (d) {
          d = this._makeSurface(d);
          d.md = this.md;
          return d;
        };
        a.Canvas.prototype.readPixels = function (d, h, l, u, x) {
          a.od(this.md);
          return f(this, d, h, l, u, x);
        };
        a.Canvas.prototype.saveLayer = function (d, h, l, u) {
          h = S(h);
          return this._saveLayer(d || null, h, l || null, u || 0);
        };
        a.Canvas.prototype.writePixels = function (d, h, l, u, x, E, K, O) {
          if (d.byteLength % (h * l))
            throw "pixels length must be a multiple of the srcWidth * srcHeight";
          a.od(this.md);
          var Q = d.byteLength / (h * l);
          E = E || a.AlphaType.Unpremul;
          K = K || a.ColorType.RGBA_8888;
          O = O || a.ColorSpace.SRGB;
          var Z = Q * h;
          Q = v(d, "HEAPU8");
          h = this._writePixels(
            { width: h, height: l, colorType: K, alphaType: E, colorSpace: O },
            Q,
            Z,
            u,
            x
          );
          q(Q, d);
          return h;
        };
        a.ColorFilter.MakeBlend = function (d, h, l) {
          d = y(d);
          l = l || a.ColorSpace.SRGB;
          return a.ColorFilter._MakeBlend(d, h, l);
        };
        a.ColorFilter.MakeMatrix = function (d) {
          if (!d || 20 !== d.length) throw "invalid color matrix";
          var h = v(d, "HEAPF32"),
            l = a.ColorFilter._makeMatrix(h);
          q(h, d);
          return l;
        };
        a.ContourMeasure.prototype.getPosTan = function (d, h) {
          this._getPosTan(d, ja);
          d = za.toTypedArray();
          return h ? (h.set(d), h) : d.slice();
        };
        a.ImageFilter.prototype.getOutputBounds = function (d, h, l) {
          d = S(d, ja);
          h = I(h);
          this._getOutputBounds(d, h, jb);
          h = yb.toTypedArray();
          return l ? (l.set(h), l) : h.slice();
        };
        a.ImageFilter.MakeDropShadow = function (d, h, l, u, x, E) {
          x = y(x, Ra);
          return a.ImageFilter._MakeDropShadow(d, h, l, u, x, E);
        };
        a.ImageFilter.MakeDropShadowOnly = function (d, h, l, u, x, E) {
          x = y(x, Ra);
          return a.ImageFilter._MakeDropShadowOnly(d, h, l, u, x, E);
        };
        a.ImageFilter.MakeImage = function (d, h, l, u) {
          l = S(l, ja);
          u = S(u, La);
          if ("B" in h && "C" in h)
            return a.ImageFilter._MakeImageCubic(d, h.B, h.C, l, u);
          const x = h.filter;
          let E = a.MipmapMode.None;
          "mipmap" in h && (E = h.mipmap);
          return a.ImageFilter._MakeImageOptions(d, x, E, l, u);
        };
        a.ImageFilter.MakeMatrixTransform = function (d, h, l) {
          d = I(d);
          if ("B" in h && "C" in h)
            return a.ImageFilter._MakeMatrixTransformCubic(d, h.B, h.C, l);
          const u = h.filter;
          let x = a.MipmapMode.None;
          "mipmap" in h && (x = h.mipmap);
          return a.ImageFilter._MakeMatrixTransformOptions(d, u, x, l);
        };
        a.Paint.prototype.getColor = function () {
          this._getColor(Ra);
          return T(Ra);
        };
        a.Paint.prototype.setColor = function (d, h) {
          h = h || null;
          d = y(d);
          this._setColor(d, h);
        };
        a.Paint.prototype.setColorComponents = function (d, h, l, u, x) {
          x = x || null;
          d = M(d, h, l, u);
          this._setColor(d, x);
        };
        a.Path.prototype.getPoint = function (d, h) {
          this._getPoint(d, ja);
          d = za.toTypedArray();
          return h ? ((h[0] = d[0]), (h[1] = d[1]), h) : d.slice(0, 2);
        };
        a.Picture.prototype.makeShader = function (d, h, l, u, x) {
          u = I(u);
          x = S(x);
          return this._makeShader(d, h, l, u, x);
        };
        a.Picture.prototype.cullRect = function (d) {
          this._cullRect(ja);
          var h = za.toTypedArray();
          return d ? (d.set(h), d) : h.slice();
        };
        a.PictureRecorder.prototype.beginRecording = function (d, h) {
          d = S(d);
          return this._beginRecording(d, !!h);
        };
        a.Surface.prototype.getCanvas = function () {
          var d = this._getCanvas();
          d.md = this.md;
          return d;
        };
        a.Surface.prototype.makeImageSnapshot = function (d) {
          a.od(this.md);
          d = v(d, "HEAP32", jb);
          return this._makeImageSnapshot(d);
        };
        a.Surface.prototype.makeSurface = function (d) {
          a.od(this.md);
          d = this._makeSurface(d);
          d.md = this.md;
          return d;
        };
        a.Surface.prototype.ef = function (d, h) {
          this.ie || (this.ie = this.getCanvas());
          return requestAnimationFrame(
            function () {
              a.od(this.md);
              d(this.ie);
              this.flush(h);
            }.bind(this)
          );
        };
        a.Surface.prototype.requestAnimationFrame ||
          (a.Surface.prototype.requestAnimationFrame = a.Surface.prototype.ef);
        a.Surface.prototype.af = function (d, h) {
          this.ie || (this.ie = this.getCanvas());
          requestAnimationFrame(
            function () {
              a.od(this.md);
              d(this.ie);
              this.flush(h);
              this.dispose();
            }.bind(this)
          );
        };
        a.Surface.prototype.drawOnce ||
          (a.Surface.prototype.drawOnce = a.Surface.prototype.af);
        a.PathEffect.MakeDash = function (d, h) {
          h || (h = 0);
          if (!d.length || 1 === d.length % 2)
            throw "Intervals array must have even length";
          var l = v(d, "HEAPF32");
          h = a.PathEffect._MakeDash(l, d.length, h);
          q(l, d);
          return h;
        };
        a.PathEffect.MakeLine2D = function (d, h) {
          h = I(h);
          return a.PathEffect._MakeLine2D(d, h);
        };
        a.PathEffect.MakePath2D = function (d, h) {
          d = I(d);
          return a.PathEffect._MakePath2D(d, h);
        };
        a.Shader.MakeColor = function (d, h) {
          h = h || null;
          d = y(d);
          return a.Shader._MakeColor(d, h);
        };
        a.Shader.Blend = a.Shader.MakeBlend;
        a.Shader.Color = a.Shader.MakeColor;
        a.Shader.MakeLinearGradient = function (d, h, l, u, x, E, K, O) {
          O = O || null;
          var Q = G(l),
            Z = v(u, "HEAPF32");
          K = K || 0;
          E = I(E);
          var ca = za.toTypedArray();
          ca.set(d);
          ca.set(h, 2);
          d = a.Shader._MakeLinearGradient(
            ja,
            Q.Ed,
            Q.colorType,
            Z,
            Q.count,
            x,
            K,
            E,
            O
          );
          q(Q.Ed, l);
          u && q(Z, u);
          return d;
        };
        a.Shader.MakeRadialGradient = function (d, h, l, u, x, E, K, O) {
          O = O || null;
          var Q = G(l),
            Z = v(u, "HEAPF32");
          K = K || 0;
          E = I(E);
          d = a.Shader._MakeRadialGradient(
            d[0],
            d[1],
            h,
            Q.Ed,
            Q.colorType,
            Z,
            Q.count,
            x,
            K,
            E,
            O
          );
          q(Q.Ed, l);
          u && q(Z, u);
          return d;
        };
        a.Shader.MakeSweepGradient = function (d, h, l, u, x, E, K, O, Q, Z) {
          Z = Z || null;
          var ca = G(l),
            r = v(u, "HEAPF32");
          K = K || 0;
          O = O || 0;
          Q = Q || 360;
          E = I(E);
          d = a.Shader._MakeSweepGradient(
            d,
            h,
            ca.Ed,
            ca.colorType,
            r,
            ca.count,
            x,
            O,
            Q,
            K,
            E,
            Z
          );
          q(ca.Ed, l);
          u && q(r, u);
          return d;
        };
        a.Shader.MakeTwoPointConicalGradient = function (
          d,
          h,
          l,
          u,
          x,
          E,
          K,
          O,
          Q,
          Z
        ) {
          Z = Z || null;
          var ca = G(x),
            r = v(E, "HEAPF32");
          Q = Q || 0;
          O = I(O);
          var C = za.toTypedArray();
          C.set(d);
          C.set(l, 2);
          d = a.Shader._MakeTwoPointConicalGradient(
            ja,
            h,
            u,
            ca.Ed,
            ca.colorType,
            r,
            ca.count,
            K,
            Q,
            O,
            Z
          );
          q(ca.Ed, x);
          E && q(r, E);
          return d;
        };
        a.Vertices.prototype.bounds = function (d) {
          this._bounds(ja);
          var h = za.toTypedArray();
          return d ? (d.set(h), d) : h.slice();
        };
        a.vd &&
          a.vd.forEach(function (d) {
            d();
          });
      };
      a.computeTonalColors = function (f) {
        var d = v(f.ambient, "HEAPF32"),
          h = v(f.spot, "HEAPF32");
        this._computeTonalColors(d, h);
        var l = { ambient: T(d), spot: T(h) };
        q(d, f.ambient);
        q(h, f.spot);
        return l;
      };
      a.LTRBRect = function (f, d, h, l) {
        return Float32Array.of(f, d, h, l);
      };
      a.XYWHRect = function (f, d, h, l) {
        return Float32Array.of(f, d, f + h, d + l);
      };
      a.LTRBiRect = function (f, d, h, l) {
        return Int32Array.of(f, d, h, l);
      };
      a.XYWHiRect = function (f, d, h, l) {
        return Int32Array.of(f, d, f + h, d + l);
      };
      a.RRectXY = function (f, d, h) {
        return Float32Array.of(f[0], f[1], f[2], f[3], d, h, d, h, d, h, d, h);
      };
      a.MakeAnimatedImageFromEncoded = function (f) {
        f = new Uint8Array(f);
        var d = a._malloc(f.byteLength);
        a.HEAPU8.set(f, d);
        return (f = a._decodeAnimatedImage(d, f.byteLength)) ? f : null;
      };
      a.MakeImageFromEncoded = function (f) {
        f = new Uint8Array(f);
        var d = a._malloc(f.byteLength);
        a.HEAPU8.set(f, d);
        return (f = a._decodeImage(d, f.byteLength)) ? f : null;
      };
      var kb = null;
      a.MakeImageFromCanvasImageSource = function (f) {
        var d = f.width,
          h = f.height;
        kb || (kb = document.createElement("canvas"));
        kb.width = d;
        kb.height = h;
        var l = kb.getContext("2d", { willReadFrequently: !0 });
        l.drawImage(f, 0, 0);
        f = l.getImageData(0, 0, d, h);
        return a.MakeImage(
          {
            width: d,
            height: h,
            alphaType: a.AlphaType.Unpremul,
            colorType: a.ColorType.RGBA_8888,
            colorSpace: a.ColorSpace.SRGB,
          },
          f.data,
          4 * d
        );
      };
      a.MakeImage = function (f, d, h) {
        var l = a._malloc(d.length);
        a.HEAPU8.set(d, l);
        return a._MakeImage(f, l, d.length, h);
      };
      a.MakeVertices = function (f, d, h, l, u, x) {
        var E = (u && u.length) || 0,
          K = 0;
        h && h.length && (K |= 1);
        l && l.length && (K |= 2);
        void 0 === x || x || (K |= 4);
        f = new a._VerticesBuilder(f, d.length / 2, E, K);
        v(d, "HEAPF32", f.positions());
        f.texCoords() && v(h, "HEAPF32", f.texCoords());
        f.colors() && v(m(l), "HEAPU32", f.colors());
        f.indices() && v(u, "HEAPU16", f.indices());
        return f.detach();
      };
      a.Matrix = {};
      a.Matrix.identity = function () {
        return c(3);
      };
      a.Matrix.invert = function (f) {
        var d =
          f[0] * f[4] * f[8] +
          f[1] * f[5] * f[6] +
          f[2] * f[3] * f[7] -
          f[2] * f[4] * f[6] -
          f[1] * f[3] * f[8] -
          f[0] * f[5] * f[7];
        return d
          ? [
              (f[4] * f[8] - f[5] * f[7]) / d,
              (f[2] * f[7] - f[1] * f[8]) / d,
              (f[1] * f[5] - f[2] * f[4]) / d,
              (f[5] * f[6] - f[3] * f[8]) / d,
              (f[0] * f[8] - f[2] * f[6]) / d,
              (f[2] * f[3] - f[0] * f[5]) / d,
              (f[3] * f[7] - f[4] * f[6]) / d,
              (f[1] * f[6] - f[0] * f[7]) / d,
              (f[0] * f[4] - f[1] * f[3]) / d,
            ]
          : null;
      };
      a.Matrix.mapPoints = function (f, d) {
        for (var h = 0; h < d.length; h += 2) {
          var l = d[h],
            u = d[h + 1],
            x = f[6] * l + f[7] * u + f[8],
            E = f[3] * l + f[4] * u + f[5];
          d[h] = (f[0] * l + f[1] * u + f[2]) / x;
          d[h + 1] = E / x;
        }
        return d;
      };
      a.Matrix.multiply = function () {
        return ib(3, arguments);
      };
      a.Matrix.rotated = function (f, d, h) {
        d = d || 0;
        h = h || 0;
        var l = Math.sin(f);
        f = Math.cos(f);
        return [f, -l, la(l, h, 1 - f, d), l, f, la(-l, d, 1 - f, h), 0, 0, 1];
      };
      a.Matrix.scaled = function (f, d, h, l) {
        h = h || 0;
        l = l || 0;
        var u = b([f, d], c(3), 3, 0, 1);
        return b([h - f * h, l - d * l], u, 3, 2, 0);
      };
      a.Matrix.skewed = function (f, d, h, l) {
        h = h || 0;
        l = l || 0;
        var u = b([f, d], c(3), 3, 1, -1);
        return b([-f * h, -d * l], u, 3, 2, 0);
      };
      a.Matrix.translated = function (f, d) {
        return b(arguments, c(3), 3, 2, 0);
      };
      a.Vector = {};
      a.Vector.dot = function (f, d) {
        return f
          .map(function (h, l) {
            return h * d[l];
          })
          .reduce(function (h, l) {
            return h + l;
          });
      };
      a.Vector.lengthSquared = function (f) {
        return a.Vector.dot(f, f);
      };
      a.Vector.length = function (f) {
        return Math.sqrt(a.Vector.lengthSquared(f));
      };
      a.Vector.mulScalar = function (f, d) {
        return f.map(function (h) {
          return h * d;
        });
      };
      a.Vector.add = function (f, d) {
        return f.map(function (h, l) {
          return h + d[l];
        });
      };
      a.Vector.sub = function (f, d) {
        return f.map(function (h, l) {
          return h - d[l];
        });
      };
      a.Vector.dist = function (f, d) {
        return a.Vector.length(a.Vector.sub(f, d));
      };
      a.Vector.normalize = function (f) {
        return a.Vector.mulScalar(f, 1 / a.Vector.length(f));
      };
      a.Vector.cross = function (f, d) {
        return [
          f[1] * d[2] - f[2] * d[1],
          f[2] * d[0] - f[0] * d[2],
          f[0] * d[1] - f[1] * d[0],
        ];
      };
      a.M44 = {};
      a.M44.identity = function () {
        return c(4);
      };
      a.M44.translated = function (f) {
        return b(f, c(4), 4, 3, 0);
      };
      a.M44.scaled = function (f) {
        return b(f, c(4), 4, 0, 1);
      };
      a.M44.rotated = function (f, d) {
        return a.M44.rotatedUnitSinCos(
          a.Vector.normalize(f),
          Math.sin(d),
          Math.cos(d)
        );
      };
      a.M44.rotatedUnitSinCos = function (f, d, h) {
        var l = f[0],
          u = f[1];
        f = f[2];
        var x = 1 - h;
        return [
          x * l * l + h,
          x * l * u - d * f,
          x * l * f + d * u,
          0,
          x * l * u + d * f,
          x * u * u + h,
          x * u * f - d * l,
          0,
          x * l * f - d * u,
          x * u * f + d * l,
          x * f * f + h,
          0,
          0,
          0,
          0,
          1,
        ];
      };
      a.M44.lookat = function (f, d, h) {
        d = a.Vector.normalize(a.Vector.sub(d, f));
        h = a.Vector.normalize(h);
        h = a.Vector.normalize(a.Vector.cross(d, h));
        var l = a.M44.identity();
        b(h, l, 4, 0, 0);
        b(a.Vector.cross(h, d), l, 4, 1, 0);
        b(a.Vector.mulScalar(d, -1), l, 4, 2, 0);
        b(f, l, 4, 3, 0);
        f = a.M44.invert(l);
        return null === f ? a.M44.identity() : f;
      };
      a.M44.perspective = function (f, d, h) {
        var l = 1 / (d - f);
        h /= 2;
        h = Math.cos(h) / Math.sin(h);
        return [
          h,
          0,
          0,
          0,
          0,
          h,
          0,
          0,
          0,
          0,
          (d + f) * l,
          2 * d * f * l,
          0,
          0,
          -1,
          1,
        ];
      };
      a.M44.rc = function (f, d, h) {
        return f[4 * d + h];
      };
      a.M44.multiply = function () {
        return ib(4, arguments);
      };
      a.M44.invert = function (f) {
        var d = f[0],
          h = f[4],
          l = f[8],
          u = f[12],
          x = f[1],
          E = f[5],
          K = f[9],
          O = f[13],
          Q = f[2],
          Z = f[6],
          ca = f[10],
          r = f[14],
          C = f[3],
          U = f[7],
          da = f[11];
        f = f[15];
        var ka = d * E - h * x,
          qa = d * K - l * x,
          wa = d * O - u * x,
          Aa = h * K - l * E,
          ea = h * O - u * E,
          H = l * O - u * K,
          k = Q * U - Z * C,
          p = Q * da - ca * C,
          z = Q * f - r * C,
          A = Z * da - ca * U,
          D = Z * f - r * U,
          F = ca * f - r * da,
          N = ka * F - qa * D + wa * A + Aa * z - ea * p + H * k,
          V = 1 / N;
        if (0 === N || Infinity === V) return null;
        ka *= V;
        qa *= V;
        wa *= V;
        Aa *= V;
        ea *= V;
        H *= V;
        k *= V;
        p *= V;
        z *= V;
        A *= V;
        D *= V;
        F *= V;
        d = [
          E * F - K * D + O * A,
          K * z - x * F - O * p,
          x * D - E * z + O * k,
          E * p - x * A - K * k,
          l * D - h * F - u * A,
          d * F - l * z + u * p,
          h * z - d * D - u * k,
          d * A - h * p + l * k,
          U * H - da * ea + f * Aa,
          da * wa - C * H - f * qa,
          C * ea - U * wa + f * ka,
          U * qa - C * Aa - da * ka,
          ca * ea - Z * H - r * Aa,
          Q * H - ca * wa + r * qa,
          Z * wa - Q * ea - r * ka,
          Q * Aa - Z * qa + ca * ka,
        ];
        return d.every(function (ma) {
          return !isNaN(ma) && Infinity !== ma && -Infinity !== ma;
        })
          ? d
          : null;
      };
      a.M44.transpose = function (f) {
        return [
          f[0],
          f[4],
          f[8],
          f[12],
          f[1],
          f[5],
          f[9],
          f[13],
          f[2],
          f[6],
          f[10],
          f[14],
          f[3],
          f[7],
          f[11],
          f[15],
        ];
      };
      a.M44.mustInvert = function (f) {
        f = a.M44.invert(f);
        if (null === f) throw "Matrix not invertible";
        return f;
      };
      a.M44.setupCamera = function (f, d, h) {
        var l = a.M44.lookat(h.eye, h.coa, h.up);
        h = a.M44.perspective(h.near, h.far, h.angle);
        d = [(f[2] - f[0]) / 2, (f[3] - f[1]) / 2, d];
        f = a.M44.multiply(
          a.M44.translated([(f[0] + f[2]) / 2, (f[1] + f[3]) / 2, 0]),
          a.M44.scaled(d)
        );
        return a.M44.multiply(f, h, l, a.M44.mustInvert(f));
      };
      a.ColorMatrix = {};
      a.ColorMatrix.identity = function () {
        var f = new Float32Array(20);
        f[0] = 1;
        f[6] = 1;
        f[12] = 1;
        f[18] = 1;
        return f;
      };
      a.ColorMatrix.scaled = function (f, d, h, l) {
        var u = new Float32Array(20);
        u[0] = f;
        u[6] = d;
        u[12] = h;
        u[18] = l;
        return u;
      };
      var yd = [
        [6, 7, 11, 12],
        [0, 10, 2, 12],
        [0, 1, 5, 6],
      ];
      a.ColorMatrix.rotated = function (f, d, h) {
        var l = a.ColorMatrix.identity();
        f = yd[f];
        l[f[0]] = h;
        l[f[1]] = d;
        l[f[2]] = -d;
        l[f[3]] = h;
        return l;
      };
      a.ColorMatrix.postTranslate = function (f, d, h, l, u) {
        f[4] += d;
        f[9] += h;
        f[14] += l;
        f[19] += u;
        return f;
      };
      a.ColorMatrix.concat = function (f, d) {
        for (var h = new Float32Array(20), l = 0, u = 0; 20 > u; u += 5) {
          for (var x = 0; 4 > x; x++)
            h[l++] =
              f[u] * d[x] +
              f[u + 1] * d[x + 5] +
              f[u + 2] * d[x + 10] +
              f[u + 3] * d[x + 15];
          h[l++] =
            f[u] * d[4] +
            f[u + 1] * d[9] +
            f[u + 2] * d[14] +
            f[u + 3] * d[19] +
            f[u + 4];
        }
        return h;
      };
      (function (f) {
        f.vd = f.vd || [];
        f.vd.push(function () {
          function d(r) {
            r &&
              (r.dir = 0 === r.dir ? f.TextDirection.RTL : f.TextDirection.LTR);
            return r;
          }
          function h(r) {
            if (!r || !r.length) return [];
            for (var C = [], U = 0; U < r.length; U += 5) {
              var da = f.LTRBRect(r[U], r[U + 1], r[U + 2], r[U + 3]),
                ka = f.TextDirection.LTR;
              0 === r[U + 4] && (ka = f.TextDirection.RTL);
              C.push({ rect: da, dir: ka });
            }
            f._free(r.byteOffset);
            return C;
          }
          function l(r) {
            r = r || {};
            void 0 === r.weight && (r.weight = f.FontWeight.Normal);
            r.width = r.width || f.FontWidth.Normal;
            r.slant = r.slant || f.FontSlant.Upright;
            return r;
          }
          function u(r) {
            if (!r || !r.length) return W;
            for (var C = [], U = 0; U < r.length; U++) {
              var da = x(r[U]);
              C.push(da);
            }
            return v(C, "HEAPU32");
          }
          function x(r) {
            if (O[r]) return O[r];
            var C = ra(r) + 1,
              U = f._malloc(C);
            sa(r, J, U, C);
            return (O[r] = U);
          }
          function E(r) {
            r._colorPtr = y(r.color);
            r._foregroundColorPtr = W;
            r._backgroundColorPtr = W;
            r._decorationColorPtr = W;
            r.foregroundColor &&
              (r._foregroundColorPtr = y(r.foregroundColor, Q));
            r.backgroundColor &&
              (r._backgroundColorPtr = y(r.backgroundColor, Z));
            r.decorationColor &&
              (r._decorationColorPtr = y(r.decorationColor, ca));
            Array.isArray(r.fontFamilies) && r.fontFamilies.length
              ? ((r._fontFamiliesPtr = u(r.fontFamilies)),
                (r._fontFamiliesLen = r.fontFamilies.length))
              : ((r._fontFamiliesPtr = W), (r._fontFamiliesLen = 0));
            if (r.locale) {
              var C = r.locale;
              r._localePtr = x(C);
              r._localeLen = ra(C);
            } else (r._localePtr = W), (r._localeLen = 0);
            if (Array.isArray(r.shadows) && r.shadows.length) {
              C = r.shadows;
              var U = C.map(function (ea) {
                  return ea.color || f.BLACK;
                }),
                da = C.map(function (ea) {
                  return ea.blurRadius || 0;
                });
              r._shadowLen = C.length;
              for (
                var ka = f._malloc(8 * C.length), qa = ka / 4, wa = 0;
                wa < C.length;
                wa++
              ) {
                var Aa = C[wa].offset || [0, 0];
                f.HEAPF32[qa] = Aa[0];
                f.HEAPF32[qa + 1] = Aa[1];
                qa += 2;
              }
              r._shadowColorsPtr = G(U).Ed;
              r._shadowOffsetsPtr = ka;
              r._shadowBlurRadiiPtr = v(da, "HEAPF32");
            } else (r._shadowLen = 0), (r._shadowColorsPtr = W), (r._shadowOffsetsPtr = W), (r._shadowBlurRadiiPtr = W);
            Array.isArray(r.fontFeatures) && r.fontFeatures.length
              ? ((C = r.fontFeatures),
                (U = C.map(function (ea) {
                  return ea.name;
                })),
                (da = C.map(function (ea) {
                  return ea.value;
                })),
                (r._fontFeatureLen = C.length),
                (r._fontFeatureNamesPtr = u(U)),
                (r._fontFeatureValuesPtr = v(da, "HEAPU32")))
              : ((r._fontFeatureLen = 0),
                (r._fontFeatureNamesPtr = W),
                (r._fontFeatureValuesPtr = W));
            Array.isArray(r.fontVariations) && r.fontVariations.length
              ? ((C = r.fontVariations),
                (U = C.map(function (ea) {
                  return ea.axis;
                })),
                (da = C.map(function (ea) {
                  return ea.value;
                })),
                (r._fontVariationLen = C.length),
                (r._fontVariationAxesPtr = u(U)),
                (r._fontVariationValuesPtr = v(da, "HEAPF32")))
              : ((r._fontVariationLen = 0),
                (r._fontVariationAxesPtr = W),
                (r._fontVariationValuesPtr = W));
          }
          function K(r) {
            f._free(r._fontFamiliesPtr);
            f._free(r._shadowColorsPtr);
            f._free(r._shadowOffsetsPtr);
            f._free(r._shadowBlurRadiiPtr);
            f._free(r._fontFeatureNamesPtr);
            f._free(r._fontFeatureValuesPtr);
            f._free(r._fontVariationAxesPtr);
            f._free(r._fontVariationValuesPtr);
          }
          f.Paragraph.prototype.getRectsForRange = function (r, C, U, da) {
            r = this._getRectsForRange(r, C, U, da);
            return h(r);
          };
          f.Paragraph.prototype.getRectsForPlaceholders = function () {
            var r = this._getRectsForPlaceholders();
            return h(r);
          };
          f.Paragraph.prototype.getGlyphInfoAt = function (r) {
            return d(this._getGlyphInfoAt(r));
          };
          f.Paragraph.prototype.getClosestGlyphInfoAtCoordinate = function (
            r,
            C
          ) {
            return d(this._getClosestGlyphInfoAtCoordinate(r, C));
          };
          f.TypefaceFontProvider.prototype.registerFont = function (r, C) {
            r = f.Typeface.MakeTypefaceFromData(r);
            if (!r) return null;
            C = x(C);
            this._registerFont(r, C);
          };
          f.ParagraphStyle = function (r) {
            r.disableHinting = r.disableHinting || !1;
            if (r.ellipsis) {
              var C = r.ellipsis;
              r._ellipsisPtr = x(C);
              r._ellipsisLen = ra(C);
            } else (r._ellipsisPtr = W), (r._ellipsisLen = 0);
            null == r.heightMultiplier && (r.heightMultiplier = -1);
            r.maxLines = r.maxLines || 0;
            r.replaceTabCharacters = r.replaceTabCharacters || !1;
            C = (C = r.strutStyle) || {};
            C.strutEnabled = C.strutEnabled || !1;
            C.strutEnabled &&
            Array.isArray(C.fontFamilies) &&
            C.fontFamilies.length
              ? ((C._fontFamiliesPtr = u(C.fontFamilies)),
                (C._fontFamiliesLen = C.fontFamilies.length))
              : ((C._fontFamiliesPtr = W), (C._fontFamiliesLen = 0));
            C.fontStyle = l(C.fontStyle);
            null == C.fontSize && (C.fontSize = -1);
            null == C.heightMultiplier && (C.heightMultiplier = -1);
            C.halfLeading = C.halfLeading || !1;
            C.leading = C.leading || 0;
            C.forceStrutHeight = C.forceStrutHeight || !1;
            r.strutStyle = C;
            r.textAlign = r.textAlign || f.TextAlign.Start;
            r.textDirection = r.textDirection || f.TextDirection.LTR;
            r.textHeightBehavior =
              r.textHeightBehavior || f.TextHeightBehavior.All;
            r.textStyle = f.TextStyle(r.textStyle);
            r.applyRoundingHack = !1 !== r.applyRoundingHack;
            return r;
          };
          f.TextStyle = function (r) {
            r.color || (r.color = f.BLACK);
            r.decoration = r.decoration || 0;
            r.decorationThickness = r.decorationThickness || 0;
            r.decorationStyle = r.decorationStyle || f.DecorationStyle.Solid;
            r.textBaseline = r.textBaseline || f.TextBaseline.Alphabetic;
            null == r.fontSize && (r.fontSize = -1);
            r.letterSpacing = r.letterSpacing || 0;
            r.wordSpacing = r.wordSpacing || 0;
            null == r.heightMultiplier && (r.heightMultiplier = -1);
            r.halfLeading = r.halfLeading || !1;
            r.fontStyle = l(r.fontStyle);
            return r;
          };
          var O = {},
            Q = f._malloc(16),
            Z = f._malloc(16),
            ca = f._malloc(16);
          f.ParagraphBuilder.Make = function (r, C) {
            E(r.textStyle);
            C = f.ParagraphBuilder._Make(r, C);
            K(r.textStyle);
            return C;
          };
          f.ParagraphBuilder.MakeFromFontProvider = function (r, C) {
            E(r.textStyle);
            C = f.ParagraphBuilder._MakeFromFontProvider(r, C);
            K(r.textStyle);
            return C;
          };
          f.ParagraphBuilder.MakeFromFontCollection = function (r, C) {
            E(r.textStyle);
            C = f.ParagraphBuilder._MakeFromFontCollection(r, C);
            K(r.textStyle);
            return C;
          };
          f.ParagraphBuilder.ShapeText = function (r, C, U) {
            let da = 0;
            for (const ka of C) da += ka.length;
            if (da !== r.length)
              throw "Accumulated block lengths must equal text.length";
            return f.ParagraphBuilder._ShapeText(r, C, U);
          };
          f.ParagraphBuilder.prototype.pushStyle = function (r) {
            E(r);
            this._pushStyle(r);
            K(r);
          };
          f.ParagraphBuilder.prototype.pushPaintStyle = function (r, C, U) {
            E(r);
            this._pushPaintStyle(r, C, U);
            K(r);
          };
          f.ParagraphBuilder.prototype.addPlaceholder = function (
            r,
            C,
            U,
            da,
            ka
          ) {
            U = U || f.PlaceholderAlignment.Baseline;
            da = da || f.TextBaseline.Alphabetic;
            this._addPlaceholder(r || 0, C || 0, U, da, ka || 0);
          };
          f.ParagraphBuilder.prototype.setWordsUtf8 = function (r) {
            var C = v(r, "HEAPU32");
            this._setWordsUtf8(C, (r && r.length) || 0);
            q(C, r);
          };
          f.ParagraphBuilder.prototype.setWordsUtf16 = function (r) {
            var C = v(r, "HEAPU32");
            this._setWordsUtf16(C, (r && r.length) || 0);
            q(C, r);
          };
          f.ParagraphBuilder.prototype.setGraphemeBreaksUtf8 = function (r) {
            var C = v(r, "HEAPU32");
            this._setGraphemeBreaksUtf8(C, (r && r.length) || 0);
            q(C, r);
          };
          f.ParagraphBuilder.prototype.setGraphemeBreaksUtf16 = function (r) {
            var C = v(r, "HEAPU32");
            this._setGraphemeBreaksUtf16(C, (r && r.length) || 0);
            q(C, r);
          };
          f.ParagraphBuilder.prototype.setLineBreaksUtf8 = function (r) {
            var C = v(r, "HEAPU32");
            this._setLineBreaksUtf8(C, (r && r.length) || 0);
            q(C, r);
          };
          f.ParagraphBuilder.prototype.setLineBreaksUtf16 = function (r) {
            var C = v(r, "HEAPU32");
            this._setLineBreaksUtf16(C, (r && r.length) || 0);
            q(C, r);
          };
        });
      })(w);
      a.vd = a.vd || [];
      a.vd.push(function () {
        a.Path.prototype.op = function (f, d) {
          return this._op(f, d) ? this : null;
        };
        a.Path.prototype.simplify = function () {
          return this._simplify() ? this : null;
        };
      });
      a.vd = a.vd || [];
      a.vd.push(function () {
        a.MakePicture = function (f) {
          f = new Uint8Array(f);
          var d = a._malloc(f.byteLength);
          a.HEAPU8.set(f, d);
          return (f = a._MakePicture(d, f.byteLength)) ? f : null;
        };
      });
      a.vd = a.vd || [];
      a.vd.push(function () {
        a.RuntimeEffect.Make = function (f, d) {
          return a.RuntimeEffect._Make(f, {
            onError:
              d ||
              function (h) {
                console.log("RuntimeEffect error", h);
              },
          });
        };
        a.RuntimeEffect.MakeForBlender = function (f, d) {
          return a.RuntimeEffect._MakeForBlender(f, {
            onError:
              d ||
              function (h) {
                console.log("RuntimeEffect error", h);
              },
          });
        };
        a.RuntimeEffect.prototype.makeShader = function (f, d) {
          var h = !f._ck,
            l = v(f, "HEAPF32");
          d = I(d);
          return this._makeShader(l, 4 * f.length, h, d);
        };
        a.RuntimeEffect.prototype.makeShaderWithChildren = function (f, d, h) {
          var l = !f._ck,
            u = v(f, "HEAPF32");
          h = I(h);
          for (var x = [], E = 0; E < d.length; E++) x.push(d[E].ld.td);
          d = v(x, "HEAPU32");
          return this._makeShaderWithChildren(
            u,
            4 * f.length,
            l,
            d,
            x.length,
            h
          );
        };
        a.RuntimeEffect.prototype.makeBlender = function (f) {
          var d = !f._ck,
            h = v(f, "HEAPF32");
          return this._makeBlender(h, 4 * f.length, d);
        };
      });
      (function () {
        function f(H) {
          for (var k = 0; k < H.length; k++)
            if (void 0 !== H[k] && !Number.isFinite(H[k])) return !1;
          return !0;
        }
        function d(H) {
          var k = a.getColorComponents(H);
          H = k[0];
          var p = k[1],
            z = k[2];
          k = k[3];
          if (1 === k)
            return (
              (H = H.toString(16).toLowerCase()),
              (p = p.toString(16).toLowerCase()),
              (z = z.toString(16).toLowerCase()),
              (H = 1 === H.length ? "0" + H : H),
              (p = 1 === p.length ? "0" + p : p),
              (z = 1 === z.length ? "0" + z : z),
              "#" + H + p + z
            );
          k = 0 === k || 1 === k ? k : k.toFixed(8);
          return "rgba(" + H + ", " + p + ", " + z + ", " + k + ")";
        }
        function h(H) {
          return a.parseColorString(H, wa);
        }
        function l(H) {
          H = Aa.exec(H);
          if (!H) return null;
          var k = parseFloat(H[4]),
            p = 16;
          switch (H[5]) {
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
            style: H[1],
            variant: H[2],
            weight: H[3],
            sizePx: p,
            family: H[6].trim(),
          };
        }
        function u() {
          ea ||
            (ea = {
              "Noto Mono": { "*": a.Typeface.GetDefault() },
              monospace: { "*": a.Typeface.GetDefault() },
            });
        }
        function x(H) {
          this.nd = H;
          this.qd = new a.Paint();
          this.qd.setAntiAlias(!0);
          this.qd.setStrokeMiter(10);
          this.qd.setStrokeCap(a.StrokeCap.Butt);
          this.qd.setStrokeJoin(a.StrokeJoin.Miter);
          this.te = "10px monospace";
          this.Pd = new a.Font(a.Typeface.GetDefault(), 10);
          this.Pd.setSubpixel(!0);
          this.Dd = this.Jd = a.BLACK;
          this.Yd = 0;
          this.ke = a.TRANSPARENT;
          this.$d = this.Zd = 0;
          this.le = this.Ld = 1;
          this.je = 0;
          this.Xd = [];
          this.pd = a.BlendMode.SrcOver;
          this.qd.setStrokeWidth(this.le);
          this.qd.setBlendMode(this.pd);
          this.sd = new a.Path();
          this.ud = a.Matrix.identity();
          this.Ne = [];
          this.de = [];
          this.Od = function () {
            this.sd.delete();
            this.qd.delete();
            this.Pd.delete();
            this.de.forEach(function (k) {
              k.Od();
            });
          };
          Object.defineProperty(this, "currentTransform", {
            enumerable: !0,
            get: function () {
              return {
                a: this.ud[0],
                c: this.ud[1],
                e: this.ud[2],
                b: this.ud[3],
                d: this.ud[4],
                f: this.ud[5],
              };
            },
            set: function (k) {
              k.a && this.setTransform(k.a, k.b, k.c, k.d, k.e, k.f);
            },
          });
          Object.defineProperty(this, "fillStyle", {
            enumerable: !0,
            get: function () {
              return e(this.Dd) ? d(this.Dd) : this.Dd;
            },
            set: function (k) {
              "string" === typeof k ? (this.Dd = h(k)) : k.Wd && (this.Dd = k);
            },
          });
          Object.defineProperty(this, "font", {
            enumerable: !0,
            get: function () {
              return this.te;
            },
            set: function (k) {
              var p = l(k);
              var z =
                (p.style || "normal") +
                "|" +
                (p.variant || "normal") +
                "|" +
                (p.weight || "normal");
              var A = p.family;
              u();
              z = ea[A] ? ea[A][z] || ea[A]["*"] : a.Typeface.GetDefault();
              p.typeface = z;
              p &&
                (this.Pd.setSize(p.sizePx),
                this.Pd.setTypeface(p.typeface),
                (this.te = k));
            },
          });
          Object.defineProperty(this, "globalAlpha", {
            enumerable: !0,
            get: function () {
              return this.Ld;
            },
            set: function (k) {
              !isFinite(k) || 0 > k || 1 < k || (this.Ld = k);
            },
          });
          Object.defineProperty(this, "globalCompositeOperation", {
            enumerable: !0,
            get: function () {
              switch (this.pd) {
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
                  this.pd = a.BlendMode.SrcOver;
                  break;
                case "destination-over":
                  this.pd = a.BlendMode.DstOver;
                  break;
                case "copy":
                  this.pd = a.BlendMode.Src;
                  break;
                case "destination":
                  this.pd = a.BlendMode.Dst;
                  break;
                case "clear":
                  this.pd = a.BlendMode.Clear;
                  break;
                case "source-in":
                  this.pd = a.BlendMode.SrcIn;
                  break;
                case "destination-in":
                  this.pd = a.BlendMode.DstIn;
                  break;
                case "source-out":
                  this.pd = a.BlendMode.SrcOut;
                  break;
                case "destination-out":
                  this.pd = a.BlendMode.DstOut;
                  break;
                case "source-atop":
                  this.pd = a.BlendMode.SrcATop;
                  break;
                case "destination-atop":
                  this.pd = a.BlendMode.DstATop;
                  break;
                case "xor":
                  this.pd = a.BlendMode.Xor;
                  break;
                case "lighter":
                  this.pd = a.BlendMode.Plus;
                  break;
                case "plus-lighter":
                  this.pd = a.BlendMode.Plus;
                  break;
                case "plus-darker":
                  throw "plus-darker is not supported";
                case "multiply":
                  this.pd = a.BlendMode.Multiply;
                  break;
                case "screen":
                  this.pd = a.BlendMode.Screen;
                  break;
                case "overlay":
                  this.pd = a.BlendMode.Overlay;
                  break;
                case "darken":
                  this.pd = a.BlendMode.Darken;
                  break;
                case "lighten":
                  this.pd = a.BlendMode.Lighten;
                  break;
                case "color-dodge":
                  this.pd = a.BlendMode.ColorDodge;
                  break;
                case "color-burn":
                  this.pd = a.BlendMode.ColorBurn;
                  break;
                case "hard-light":
                  this.pd = a.BlendMode.HardLight;
                  break;
                case "soft-light":
                  this.pd = a.BlendMode.SoftLight;
                  break;
                case "difference":
                  this.pd = a.BlendMode.Difference;
                  break;
                case "exclusion":
                  this.pd = a.BlendMode.Exclusion;
                  break;
                case "hue":
                  this.pd = a.BlendMode.Hue;
                  break;
                case "saturation":
                  this.pd = a.BlendMode.Saturation;
                  break;
                case "color":
                  this.pd = a.BlendMode.Color;
                  break;
                case "luminosity":
                  this.pd = a.BlendMode.Luminosity;
                  break;
                default:
                  return;
              }
              this.qd.setBlendMode(this.pd);
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
              switch (this.qd.getStrokeCap()) {
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
                  this.qd.setStrokeCap(a.StrokeCap.Butt);
                  break;
                case "round":
                  this.qd.setStrokeCap(a.StrokeCap.Round);
                  break;
                case "square":
                  this.qd.setStrokeCap(a.StrokeCap.Square);
              }
            },
          });
          Object.defineProperty(this, "lineDashOffset", {
            enumerable: !0,
            get: function () {
              return this.je;
            },
            set: function (k) {
              isFinite(k) && (this.je = k);
            },
          });
          Object.defineProperty(this, "lineJoin", {
            enumerable: !0,
            get: function () {
              switch (this.qd.getStrokeJoin()) {
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
                  this.qd.setStrokeJoin(a.StrokeJoin.Miter);
                  break;
                case "round":
                  this.qd.setStrokeJoin(a.StrokeJoin.Round);
                  break;
                case "bevel":
                  this.qd.setStrokeJoin(a.StrokeJoin.Bevel);
              }
            },
          });
          Object.defineProperty(this, "lineWidth", {
            enumerable: !0,
            get: function () {
              return this.qd.getStrokeWidth();
            },
            set: function (k) {
              0 >= k || !k || ((this.le = k), this.qd.setStrokeWidth(k));
            },
          });
          Object.defineProperty(this, "miterLimit", {
            enumerable: !0,
            get: function () {
              return this.qd.getStrokeMiter();
            },
            set: function (k) {
              0 >= k || !k || this.qd.setStrokeMiter(k);
            },
          });
          Object.defineProperty(this, "shadowBlur", {
            enumerable: !0,
            get: function () {
              return this.Yd;
            },
            set: function (k) {
              0 > k || !isFinite(k) || (this.Yd = k);
            },
          });
          Object.defineProperty(this, "shadowColor", {
            enumerable: !0,
            get: function () {
              return d(this.ke);
            },
            set: function (k) {
              this.ke = h(k);
            },
          });
          Object.defineProperty(this, "shadowOffsetX", {
            enumerable: !0,
            get: function () {
              return this.Zd;
            },
            set: function (k) {
              isFinite(k) && (this.Zd = k);
            },
          });
          Object.defineProperty(this, "shadowOffsetY", {
            enumerable: !0,
            get: function () {
              return this.$d;
            },
            set: function (k) {
              isFinite(k) && (this.$d = k);
            },
          });
          Object.defineProperty(this, "strokeStyle", {
            enumerable: !0,
            get: function () {
              return d(this.Jd);
            },
            set: function (k) {
              "string" === typeof k ? (this.Jd = h(k)) : k.Wd && (this.Jd = k);
            },
          });
          this.arc = function (k, p, z, A, D, F) {
            C(this.sd, k, p, z, z, 0, A, D, F);
          };
          this.arcTo = function (k, p, z, A, D) {
            Z(this.sd, k, p, z, A, D);
          };
          this.beginPath = function () {
            this.sd.delete();
            this.sd = new a.Path();
          };
          this.bezierCurveTo = function (k, p, z, A, D, F) {
            var N = this.sd;
            f([k, p, z, A, D, F]) &&
              (N.isEmpty() && N.moveTo(k, p), N.cubicTo(k, p, z, A, D, F));
          };
          this.clearRect = function (k, p, z, A) {
            this.qd.setStyle(a.PaintStyle.Fill);
            this.qd.setBlendMode(a.BlendMode.Clear);
            this.nd.drawRect(a.XYWHRect(k, p, z, A), this.qd);
            this.qd.setBlendMode(this.pd);
          };
          this.clip = function (k, p) {
            "string" === typeof k
              ? ((p = k), (k = this.sd))
              : k && k.De && (k = k.wd);
            k || (k = this.sd);
            k = k.copy();
            p && "evenodd" === p.toLowerCase()
              ? k.setFillType(a.FillType.EvenOdd)
              : k.setFillType(a.FillType.Winding);
            this.nd.clipPath(k, a.ClipOp.Intersect, !0);
            k.delete();
          };
          this.closePath = function () {
            ca(this.sd);
          };
          this.createImageData = function () {
            if (1 === arguments.length) {
              var k = arguments[0];
              return new O(
                new Uint8ClampedArray(4 * k.width * k.height),
                k.width,
                k.height
              );
            }
            if (2 === arguments.length) {
              k = arguments[0];
              var p = arguments[1];
              return new O(new Uint8ClampedArray(4 * k * p), k, p);
            }
            throw (
              "createImageData expects 1 or 2 arguments, got " +
              arguments.length
            );
          };
          this.createLinearGradient = function (k, p, z, A) {
            if (f(arguments)) {
              var D = new Q(k, p, z, A);
              this.de.push(D);
              return D;
            }
          };
          this.createPattern = function (k, p) {
            k = new ka(k, p);
            this.de.push(k);
            return k;
          };
          this.createRadialGradient = function (k, p, z, A, D, F) {
            if (f(arguments)) {
              var N = new qa(k, p, z, A, D, F);
              this.de.push(N);
              return N;
            }
          };
          this.drawImage = function (k) {
            k instanceof K && (k = k.Ue());
            var p = this.se();
            if (3 === arguments.length || 5 === arguments.length)
              var z = a.XYWHRect(
                  arguments[1],
                  arguments[2],
                  arguments[3] || k.width(),
                  arguments[4] || k.height()
                ),
                A = a.XYWHRect(0, 0, k.width(), k.height());
            else if (9 === arguments.length)
              (z = a.XYWHRect(
                arguments[5],
                arguments[6],
                arguments[7],
                arguments[8]
              )),
                (A = a.XYWHRect(
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
            this.nd.drawImageRect(k, A, z, p, !1);
            p.dispose();
          };
          this.ellipse = function (k, p, z, A, D, F, N, V) {
            C(this.sd, k, p, z, A, D, F, N, V);
          };
          this.se = function () {
            var k = this.qd.copy();
            k.setStyle(a.PaintStyle.Fill);
            if (e(this.Dd)) {
              var p = a.multiplyByAlpha(this.Dd, this.Ld);
              k.setColor(p);
            } else
              (p = this.Dd.Wd(this.ud)),
                k.setColor(a.Color(0, 0, 0, this.Ld)),
                k.setShader(p);
            k.dispose = function () {
              this.delete();
            };
            return k;
          };
          this.fill = function (k, p) {
            "string" === typeof k
              ? ((p = k), (k = this.sd))
              : k && k.De && (k = k.wd);
            if ("evenodd" === p) this.sd.setFillType(a.FillType.EvenOdd);
            else {
              if ("nonzero" !== p && p) throw "invalid fill rule";
              this.sd.setFillType(a.FillType.Winding);
            }
            k || (k = this.sd);
            p = this.se();
            var z = this.ae(p);
            z &&
              (this.nd.save(),
              this.Ud(),
              this.nd.drawPath(k, z),
              this.nd.restore(),
              z.dispose());
            this.nd.drawPath(k, p);
            p.dispose();
          };
          this.fillRect = function (k, p, z, A) {
            var D = this.se(),
              F = this.ae(D);
            F &&
              (this.nd.save(),
              this.Ud(),
              this.nd.drawRect(a.XYWHRect(k, p, z, A), F),
              this.nd.restore(),
              F.dispose());
            this.nd.drawRect(a.XYWHRect(k, p, z, A), D);
            D.dispose();
          };
          this.fillText = function (k, p, z) {
            var A = this.se();
            k = a.TextBlob.MakeFromText(k, this.Pd);
            var D = this.ae(A);
            D &&
              (this.nd.save(),
              this.Ud(),
              this.nd.drawTextBlob(k, p, z, D),
              this.nd.restore(),
              D.dispose());
            this.nd.drawTextBlob(k, p, z, A);
            k.delete();
            A.dispose();
          };
          this.getImageData = function (k, p, z, A) {
            return (k = this.nd.readPixels(k, p, {
              width: z,
              height: A,
              colorType: a.ColorType.RGBA_8888,
              alphaType: a.AlphaType.Unpremul,
              colorSpace: a.ColorSpace.SRGB,
            }))
              ? new O(new Uint8ClampedArray(k.buffer), z, A)
              : null;
          };
          this.getLineDash = function () {
            return this.Xd.slice();
          };
          this.Oe = function (k) {
            var p = a.Matrix.invert(this.ud);
            a.Matrix.mapPoints(p, k);
            return k;
          };
          this.isPointInPath = function (k, p, z) {
            var A = arguments;
            if (3 === A.length) var D = this.sd;
            else if (4 === A.length)
              (D = A[0]), (k = A[1]), (p = A[2]), (z = A[3]);
            else throw "invalid arg count, need 3 or 4, got " + A.length;
            if (!isFinite(k) || !isFinite(p)) return !1;
            z = z || "nonzero";
            if ("nonzero" !== z && "evenodd" !== z) return !1;
            A = this.Oe([k, p]);
            k = A[0];
            p = A[1];
            D.setFillType(
              "nonzero" === z ? a.FillType.Winding : a.FillType.EvenOdd
            );
            return D.contains(k, p);
          };
          this.isPointInStroke = function (k, p) {
            var z = arguments;
            if (2 === z.length) var A = this.sd;
            else if (3 === z.length) (A = z[0]), (k = z[1]), (p = z[2]);
            else throw "invalid arg count, need 2 or 3, got " + z.length;
            if (!isFinite(k) || !isFinite(p)) return !1;
            z = this.Oe([k, p]);
            k = z[0];
            p = z[1];
            A = A.copy();
            A.setFillType(a.FillType.Winding);
            A.stroke({
              width: this.lineWidth,
              miter_limit: this.miterLimit,
              cap: this.qd.getStrokeCap(),
              join: this.qd.getStrokeJoin(),
              precision: 0.3,
            });
            z = A.contains(k, p);
            A.delete();
            return z;
          };
          this.lineTo = function (k, p) {
            U(this.sd, k, p);
          };
          this.measureText = function (k) {
            k = this.Pd.getGlyphIDs(k);
            k = this.Pd.getGlyphWidths(k);
            let p = 0;
            for (const z of k) p += z;
            return { width: p };
          };
          this.moveTo = function (k, p) {
            var z = this.sd;
            f([k, p]) && z.moveTo(k, p);
          };
          this.putImageData = function (k, p, z, A, D, F, N) {
            if (f([p, z, A, D, F, N]))
              if (void 0 === A)
                this.nd.writePixels(k.data, k.width, k.height, p, z);
              else if (
                ((A = A || 0),
                (D = D || 0),
                (F = F || k.width),
                (N = N || k.height),
                0 > F && ((A += F), (F = Math.abs(F))),
                0 > N && ((D += N), (N = Math.abs(N))),
                0 > A && ((F += A), (A = 0)),
                0 > D && ((N += D), (D = 0)),
                !(0 >= F || 0 >= N))
              ) {
                k = a.MakeImage(
                  {
                    width: k.width,
                    height: k.height,
                    alphaType: a.AlphaType.Unpremul,
                    colorType: a.ColorType.RGBA_8888,
                    colorSpace: a.ColorSpace.SRGB,
                  },
                  k.data,
                  4 * k.width
                );
                var V = a.XYWHRect(A, D, F, N);
                p = a.XYWHRect(p + A, z + D, F, N);
                z = a.Matrix.invert(this.ud);
                this.nd.save();
                this.nd.concat(z);
                this.nd.drawImageRect(k, V, p, null, !1);
                this.nd.restore();
                k.delete();
              }
          };
          this.quadraticCurveTo = function (k, p, z, A) {
            var D = this.sd;
            f([k, p, z, A]) &&
              (D.isEmpty() && D.moveTo(k, p), D.quadTo(k, p, z, A));
          };
          this.rect = function (k, p, z, A) {
            var D = this.sd;
            k = a.XYWHRect(k, p, z, A);
            f(k) && D.addRect(k);
          };
          this.resetTransform = function () {
            this.sd.transform(this.ud);
            var k = a.Matrix.invert(this.ud);
            this.nd.concat(k);
            this.ud = this.nd.getTotalMatrix();
          };
          this.restore = function () {
            var k = this.Ne.pop();
            if (k) {
              var p = a.Matrix.multiply(this.ud, a.Matrix.invert(k.hf));
              this.sd.transform(p);
              this.qd.delete();
              this.qd = k.Df;
              this.Xd = k.zf;
              this.le = k.Pf;
              this.Jd = k.Of;
              this.Dd = k.fs;
              this.Zd = k.Mf;
              this.$d = k.Nf;
              this.Yd = k.sb;
              this.ke = k.Lf;
              this.Ld = k.ga;
              this.pd = k.qf;
              this.je = k.Af;
              this.te = k.pf;
              this.nd.restore();
              this.ud = this.nd.getTotalMatrix();
            }
          };
          this.rotate = function (k) {
            if (isFinite(k)) {
              var p = a.Matrix.rotated(-k);
              this.sd.transform(p);
              this.nd.rotate((k / Math.PI) * 180, 0, 0);
              this.ud = this.nd.getTotalMatrix();
            }
          };
          this.save = function () {
            if (this.Dd.Vd) {
              var k = this.Dd.Vd();
              this.de.push(k);
            } else k = this.Dd;
            if (this.Jd.Vd) {
              var p = this.Jd.Vd();
              this.de.push(p);
            } else p = this.Jd;
            this.Ne.push({
              hf: this.ud.slice(),
              zf: this.Xd.slice(),
              Pf: this.le,
              Of: p,
              fs: k,
              Mf: this.Zd,
              Nf: this.$d,
              sb: this.Yd,
              Lf: this.ke,
              ga: this.Ld,
              Af: this.je,
              qf: this.pd,
              Df: this.qd.copy(),
              pf: this.te,
            });
            this.nd.save();
          };
          this.scale = function (k, p) {
            if (f(arguments)) {
              var z = a.Matrix.scaled(1 / k, 1 / p);
              this.sd.transform(z);
              this.nd.scale(k, p);
              this.ud = this.nd.getTotalMatrix();
            }
          };
          this.setLineDash = function (k) {
            for (var p = 0; p < k.length; p++)
              if (!isFinite(k[p]) || 0 > k[p]) return;
            1 === k.length % 2 && Array.prototype.push.apply(k, k);
            this.Xd = k;
          };
          this.setTransform = function (k, p, z, A, D, F) {
            f(arguments) &&
              (this.resetTransform(), this.transform(k, p, z, A, D, F));
          };
          this.Ud = function () {
            var k = a.Matrix.invert(this.ud);
            this.nd.concat(k);
            this.nd.concat(a.Matrix.translated(this.Zd, this.$d));
            this.nd.concat(this.ud);
          };
          this.ae = function (k) {
            var p = a.multiplyByAlpha(this.ke, this.Ld);
            if (!a.getColorComponents(p)[3] || !(this.Yd || this.$d || this.Zd))
              return null;
            k = k.copy();
            k.setColor(p);
            var z = a.MaskFilter.MakeBlur(a.BlurStyle.Normal, this.Yd / 2, !1);
            k.setMaskFilter(z);
            k.dispose = function () {
              z.delete();
              this.delete();
            };
            return k;
          };
          this.Fe = function () {
            var k = this.qd.copy();
            k.setStyle(a.PaintStyle.Stroke);
            if (e(this.Jd)) {
              var p = a.multiplyByAlpha(this.Jd, this.Ld);
              k.setColor(p);
            } else
              (p = this.Jd.Wd(this.ud)),
                k.setColor(a.Color(0, 0, 0, this.Ld)),
                k.setShader(p);
            k.setStrokeWidth(this.le);
            if (this.Xd.length) {
              var z = a.PathEffect.MakeDash(this.Xd, this.je);
              k.setPathEffect(z);
            }
            k.dispose = function () {
              z && z.delete();
              this.delete();
            };
            return k;
          };
          this.stroke = function (k) {
            k = k ? k.wd : this.sd;
            var p = this.Fe(),
              z = this.ae(p);
            z &&
              (this.nd.save(),
              this.Ud(),
              this.nd.drawPath(k, z),
              this.nd.restore(),
              z.dispose());
            this.nd.drawPath(k, p);
            p.dispose();
          };
          this.strokeRect = function (k, p, z, A) {
            var D = this.Fe(),
              F = this.ae(D);
            F &&
              (this.nd.save(),
              this.Ud(),
              this.nd.drawRect(a.XYWHRect(k, p, z, A), F),
              this.nd.restore(),
              F.dispose());
            this.nd.drawRect(a.XYWHRect(k, p, z, A), D);
            D.dispose();
          };
          this.strokeText = function (k, p, z) {
            var A = this.Fe();
            k = a.TextBlob.MakeFromText(k, this.Pd);
            var D = this.ae(A);
            D &&
              (this.nd.save(),
              this.Ud(),
              this.nd.drawTextBlob(k, p, z, D),
              this.nd.restore(),
              D.dispose());
            this.nd.drawTextBlob(k, p, z, A);
            k.delete();
            A.dispose();
          };
          this.translate = function (k, p) {
            if (f(arguments)) {
              var z = a.Matrix.translated(-k, -p);
              this.sd.transform(z);
              this.nd.translate(k, p);
              this.ud = this.nd.getTotalMatrix();
            }
          };
          this.transform = function (k, p, z, A, D, F) {
            k = [k, z, D, p, A, F, 0, 0, 1];
            p = a.Matrix.invert(k);
            this.sd.transform(p);
            this.nd.concat(k);
            this.ud = this.nd.getTotalMatrix();
          };
          this.addHitRegion = function () {};
          this.clearHitRegions = function () {};
          this.drawFocusIfNeeded = function () {};
          this.removeHitRegion = function () {};
          this.scrollPathIntoView = function () {};
          Object.defineProperty(this, "canvas", { value: null, writable: !1 });
        }
        function E(H) {
          this.Ge = H;
          this.md = new x(H.getCanvas());
          this.ue = [];
          this.decodeImage = function (k) {
            k = a.MakeImageFromEncoded(k);
            if (!k) throw "Invalid input";
            this.ue.push(k);
            return new K(k);
          };
          this.loadFont = function (k, p) {
            k = a.Typeface.MakeTypefaceFromData(k);
            if (!k) return null;
            this.ue.push(k);
            var z =
              (p.style || "normal") +
              "|" +
              (p.variant || "normal") +
              "|" +
              (p.weight || "normal");
            p = p.family;
            u();
            ea[p] || (ea[p] = { "*": k });
            ea[p][z] = k;
          };
          this.makePath2D = function (k) {
            k = new da(k);
            this.ue.push(k.wd);
            return k;
          };
          this.getContext = function (k) {
            return "2d" === k ? this.md : null;
          };
          this.toDataURL = function (k, p) {
            this.Ge.flush();
            var z = this.Ge.makeImageSnapshot();
            if (z) {
              k = k || "image/png";
              var A = a.ImageFormat.PNG;
              "image/jpeg" === k && (A = a.ImageFormat.JPEG);
              if ((p = z.encodeToBytes(A, p || 0.92))) {
                z.delete();
                k = "data:" + k + ";base64,";
                if ("undefined" !== typeof Buffer)
                  p = Buffer.from(p).toString("base64");
                else {
                  z = 0;
                  A = p.length;
                  for (var D = "", F; z < A; )
                    (F = p.slice(z, Math.min(z + 32768, A))),
                      (D += String.fromCharCode.apply(null, F)),
                      (z += 32768);
                  p = btoa(D);
                }
                return k + p;
              }
            }
          };
          this.dispose = function () {
            this.md.Od();
            this.ue.forEach(function (k) {
              k.delete();
            });
            this.Ge.dispose();
          };
        }
        function K(H) {
          this.width = H.width();
          this.height = H.height();
          this.naturalWidth = this.width;
          this.naturalHeight = this.height;
          this.Ue = function () {
            return H;
          };
        }
        function O(H, k, p) {
          if (!k || 0 === p)
            throw "invalid dimensions, width and height must be non-zero";
          if (H.length % 4) throw "arr must be a multiple of 4";
          p = p || H.length / (4 * k);
          Object.defineProperty(this, "data", { value: H, writable: !1 });
          Object.defineProperty(this, "height", { value: p, writable: !1 });
          Object.defineProperty(this, "width", { value: k, writable: !1 });
        }
        function Q(H, k, p, z) {
          this.yd = null;
          this.Fd = [];
          this.Bd = [];
          this.addColorStop = function (A, D) {
            if (0 > A || 1 < A || !isFinite(A))
              throw "offset must be between 0 and 1 inclusively";
            D = h(D);
            var F = this.Bd.indexOf(A);
            if (-1 !== F) this.Fd[F] = D;
            else {
              for (F = 0; F < this.Bd.length && !(this.Bd[F] > A); F++);
              this.Bd.splice(F, 0, A);
              this.Fd.splice(F, 0, D);
            }
          };
          this.Vd = function () {
            var A = new Q(H, k, p, z);
            A.Fd = this.Fd.slice();
            A.Bd = this.Bd.slice();
            return A;
          };
          this.Od = function () {
            this.yd && (this.yd.delete(), (this.yd = null));
          };
          this.Wd = function (A) {
            var D = [H, k, p, z];
            a.Matrix.mapPoints(A, D);
            A = D[0];
            var F = D[1],
              N = D[2];
            D = D[3];
            this.Od();
            return (this.yd = a.Shader.MakeLinearGradient(
              [A, F],
              [N, D],
              this.Fd,
              this.Bd,
              a.TileMode.Clamp
            ));
          };
        }
        function Z(H, k, p, z, A, D) {
          if (f([k, p, z, A, D])) {
            if (0 > D) throw "radii cannot be negative";
            H.isEmpty() && H.moveTo(k, p);
            H.arcToTangent(k, p, z, A, D);
          }
        }
        function ca(H) {
          if (!H.isEmpty()) {
            var k = H.getBounds();
            (k[3] - k[1] || k[2] - k[0]) && H.close();
          }
        }
        function r(H, k, p, z, A, D, F) {
          F = ((F - D) / Math.PI) * 180;
          D = (D / Math.PI) * 180;
          k = a.LTRBRect(k - z, p - A, k + z, p + A);
          1e-5 > Math.abs(Math.abs(F) - 360)
            ? ((p = F / 2),
              H.arcToOval(k, D, p, !1),
              H.arcToOval(k, D + p, p, !1))
            : H.arcToOval(k, D, F, !1);
        }
        function C(H, k, p, z, A, D, F, N, V) {
          if (f([k, p, z, A, D, F, N])) {
            if (0 > z || 0 > A) throw "radii cannot be negative";
            var ma = 2 * Math.PI,
              ab = F % ma;
            0 > ab && (ab += ma);
            var bb = ab - F;
            F = ab;
            N += bb;
            !V && N - F >= ma
              ? (N = F + ma)
              : V && F - N >= ma
              ? (N = F - ma)
              : !V && F > N
              ? (N = F + (ma - ((F - N) % ma)))
              : V && F < N && (N = F - (ma - ((N - F) % ma)));
            D
              ? ((V = a.Matrix.rotated(D, k, p)),
                (D = a.Matrix.rotated(-D, k, p)),
                H.transform(D),
                r(H, k, p, z, A, F, N),
                H.transform(V))
              : r(H, k, p, z, A, F, N);
          }
        }
        function U(H, k, p) {
          f([k, p]) && (H.isEmpty() && H.moveTo(k, p), H.lineTo(k, p));
        }
        function da(H) {
          this.wd = null;
          this.wd =
            "string" === typeof H
              ? a.Path.MakeFromSVGString(H)
              : H && H.De
              ? H.wd.copy()
              : new a.Path();
          this.De = function () {
            return this.wd;
          };
          this.addPath = function (k, p) {
            p || (p = { a: 1, c: 0, e: 0, b: 0, d: 1, f: 0 });
            this.wd.addPath(k.wd, [p.a, p.c, p.e, p.b, p.d, p.f]);
          };
          this.arc = function (k, p, z, A, D, F) {
            C(this.wd, k, p, z, z, 0, A, D, F);
          };
          this.arcTo = function (k, p, z, A, D) {
            Z(this.wd, k, p, z, A, D);
          };
          this.bezierCurveTo = function (k, p, z, A, D, F) {
            var N = this.wd;
            f([k, p, z, A, D, F]) &&
              (N.isEmpty() && N.moveTo(k, p), N.cubicTo(k, p, z, A, D, F));
          };
          this.closePath = function () {
            ca(this.wd);
          };
          this.ellipse = function (k, p, z, A, D, F, N, V) {
            C(this.wd, k, p, z, A, D, F, N, V);
          };
          this.lineTo = function (k, p) {
            U(this.wd, k, p);
          };
          this.moveTo = function (k, p) {
            var z = this.wd;
            f([k, p]) && z.moveTo(k, p);
          };
          this.quadraticCurveTo = function (k, p, z, A) {
            var D = this.wd;
            f([k, p, z, A]) &&
              (D.isEmpty() && D.moveTo(k, p), D.quadTo(k, p, z, A));
          };
          this.rect = function (k, p, z, A) {
            var D = this.wd;
            k = a.XYWHRect(k, p, z, A);
            f(k) && D.addRect(k);
          };
        }
        function ka(H, k) {
          this.yd = null;
          H instanceof K && (H = H.Ue());
          this.cf = H;
          this._transform = a.Matrix.identity();
          "" === k && (k = "repeat");
          switch (k) {
            case "repeat-x":
              this.be = a.TileMode.Repeat;
              this.ce = a.TileMode.Decal;
              break;
            case "repeat-y":
              this.be = a.TileMode.Decal;
              this.ce = a.TileMode.Repeat;
              break;
            case "repeat":
              this.ce = this.be = a.TileMode.Repeat;
              break;
            case "no-repeat":
              this.ce = this.be = a.TileMode.Decal;
              break;
            default:
              throw "invalid repetition mode " + k;
          }
          this.setTransform = function (p) {
            p = [p.a, p.c, p.e, p.b, p.d, p.f, 0, 0, 1];
            f(p) && (this._transform = p);
          };
          this.Vd = function () {
            var p = new ka();
            p.be = this.be;
            p.ce = this.ce;
            return p;
          };
          this.Od = function () {
            this.yd && (this.yd.delete(), (this.yd = null));
          };
          this.Wd = function () {
            this.Od();
            return (this.yd = this.cf.makeShaderCubic(
              this.be,
              this.ce,
              1 / 3,
              1 / 3,
              this._transform
            ));
          };
        }
        function qa(H, k, p, z, A, D) {
          this.yd = null;
          this.Fd = [];
          this.Bd = [];
          this.addColorStop = function (F, N) {
            if (0 > F || 1 < F || !isFinite(F))
              throw "offset must be between 0 and 1 inclusively";
            N = h(N);
            var V = this.Bd.indexOf(F);
            if (-1 !== V) this.Fd[V] = N;
            else {
              for (V = 0; V < this.Bd.length && !(this.Bd[V] > F); V++);
              this.Bd.splice(V, 0, F);
              this.Fd.splice(V, 0, N);
            }
          };
          this.Vd = function () {
            var F = new qa(H, k, p, z, A, D);
            F.Fd = this.Fd.slice();
            F.Bd = this.Bd.slice();
            return F;
          };
          this.Od = function () {
            this.yd && (this.yd.delete(), (this.yd = null));
          };
          this.Wd = function (F) {
            var N = [H, k, z, A];
            a.Matrix.mapPoints(F, N);
            var V = N[0],
              ma = N[1],
              ab = N[2];
            N = N[3];
            var bb = (Math.abs(F[0]) + Math.abs(F[4])) / 2;
            F = p * bb;
            bb *= D;
            this.Od();
            return (this.yd = a.Shader.MakeTwoPointConicalGradient(
              [V, ma],
              F,
              [ab, N],
              bb,
              this.Fd,
              this.Bd,
              a.TileMode.Clamp
            ));
          };
        }
        a._testing = {};
        var wa = {
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
        a._testing.parseColor = h;
        a._testing.colorToString = d;
        var Aa = RegExp(
            "(italic|oblique|normal|)\\s*(small-caps|normal|)\\s*(bold|bolder|lighter|[1-9]00|normal|)\\s*([\\d\\.]+)(px|pt|pc|in|cm|mm|%|em|ex|ch|rem|q)(.+)"
          ),
          ea;
        a._testing.parseFontString = l;
        a.MakeCanvas = function (H, k) {
          return (H = a.MakeSurface(H, k)) ? new E(H) : null;
        };
        a.ImageData = function () {
          if (2 === arguments.length) {
            var H = arguments[0],
              k = arguments[1];
            return new O(new Uint8ClampedArray(4 * H * k), H, k);
          }
          if (3 === arguments.length) {
            var p = arguments[0];
            if (p.prototype.constructor !== Uint8ClampedArray)
              throw "bytes must be given as a Uint8ClampedArray";
            H = arguments[1];
            k = arguments[2];
            if (p % 4) throw "bytes must be given in a multiple of 4";
            if (p % H) throw "bytes must divide evenly by width";
            if (k && k !== p / (4 * H)) throw "invalid height given";
            return new O(p, H, p / (4 * H));
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
      va = (a, b) => {
        throw b;
      },
      xa = "object" == typeof window,
      ya = "function" == typeof importScripts,
      Ba =
        "object" == typeof process &&
        "object" == typeof process.versions &&
        "string" == typeof process.versions.node,
      Ca = "",
      Da,
      Ea,
      Fa;
    if (Ba) {
      var fs = require("fs"),
        Ga = require("path");
      Ca = ya ? Ga.dirname(Ca) + "/" : __dirname + "/";
      Da = (a, b) => {
        a = a.startsWith("file://") ? new URL(a) : Ga.normalize(a);
        return fs.readFileSync(a, b ? void 0 : "utf8");
      };
      Fa = (a) => {
        a = Da(a, !0);
        a.buffer || (a = new Uint8Array(a));
        return a;
      };
      Ea = (a, b, c, e = !0) => {
        a = a.startsWith("file://") ? new URL(a) : Ga.normalize(a);
        fs.readFile(a, e ? void 0 : "utf8", (g, m) => {
          g ? c(g) : b(e ? m.buffer : m);
        });
      };
      !w.thisProgram &&
        1 < process.argv.length &&
        (ua = process.argv[1].replace(/\\/g, "/"));
      process.argv.slice(2);
      va = (a, b) => {
        process.exitCode = a;
        throw b;
      };
      w.inspect = () => "[Emscripten Module object]";
    } else if (xa || ya)
      ya
        ? (Ca = self.location.href)
        : "undefined" != typeof document &&
          document.currentScript &&
          (Ca = document.currentScript.src),
        _scriptDir && (Ca = _scriptDir),
        0 !== Ca.indexOf("blob:")
          ? (Ca = Ca.substr(0, Ca.replace(/[?#].*/, "").lastIndexOf("/") + 1))
          : (Ca = ""),
        (Da = (a) => {
          var b = new XMLHttpRequest();
          b.open("GET", a, !1);
          b.send(null);
          return b.responseText;
        }),
        ya &&
          (Fa = (a) => {
            var b = new XMLHttpRequest();
            b.open("GET", a, !1);
            b.responseType = "arraybuffer";
            b.send(null);
            return new Uint8Array(b.response);
          }),
        (Ea = (a, b, c) => {
          var e = new XMLHttpRequest();
          e.open("GET", a, !0);
          e.responseType = "arraybuffer";
          e.onload = () => {
            200 == e.status || (0 == e.status && e.response)
              ? b(e.response)
              : c();
          };
          e.onerror = c;
          e.send(null);
        });
    var Ha = w.print || console.log.bind(console),
      Ia = w.printErr || console.error.bind(console);
    Object.assign(w, ta);
    ta = null;
    w.thisProgram && (ua = w.thisProgram);
    w.quit && (va = w.quit);
    var Ja;
    w.wasmBinary && (Ja = w.wasmBinary);
    var noExitRuntime = w.noExitRuntime || !0;
    "object" != typeof WebAssembly && Ma("no native wasm support detected");
    var Na,
      Oa,
      Pa = !1,
      Qa,
      J,
      Sa,
      Ta,
      P,
      Ua,
      R,
      Va;
    function Wa() {
      var a = Na.buffer;
      w.HEAP8 = Qa = new Int8Array(a);
      w.HEAP16 = Sa = new Int16Array(a);
      w.HEAP32 = P = new Int32Array(a);
      w.HEAPU8 = J = new Uint8Array(a);
      w.HEAPU16 = Ta = new Uint16Array(a);
      w.HEAPU32 = Ua = new Uint32Array(a);
      w.HEAPF32 = R = new Float32Array(a);
      w.HEAPF64 = Va = new Float64Array(a);
    }
    var Xa,
      Za = [],
      $a = [],
      cb = [];
    function db() {
      var a = w.preRun.shift();
      Za.unshift(a);
    }
    var eb = 0,
      fb = null,
      gb = null;
    function Ma(a) {
      if (w.onAbort) w.onAbort(a);
      a = "Aborted(" + a + ")";
      Ia(a);
      Pa = !0;
      a = new WebAssembly.RuntimeError(
        a + ". Build with -sASSERTIONS for more info."
      );
      ba(a);
      throw a;
    }
    function lb(a) {
      return a.startsWith("data:application/octet-stream;base64,");
    }
    var mb;
    mb = "canvaskit.wasm";
    if (!lb(mb)) {
      var nb = mb;
      mb = w.locateFile ? w.locateFile(nb, Ca) : Ca + nb;
    }
    function ob(a) {
      if (a == mb && Ja) return new Uint8Array(Ja);
      if (Fa) return Fa(a);
      throw "both async and sync fetching of the wasm failed";
    }
    function pb(a) {
      if (!Ja && (xa || ya)) {
        if ("function" == typeof fetch && !a.startsWith("file://"))
          return fetch(a, { credentials: "same-origin" })
            .then((b) => {
              if (!b.ok) throw "failed to load wasm binary file at '" + a + "'";
              return b.arrayBuffer();
            })
            .catch(() => ob(a));
        if (Ea)
          return new Promise((b, c) => {
            Ea(a, (e) => b(new Uint8Array(e)), c);
          });
      }
      return Promise.resolve().then(() => ob(a));
    }
    function qb(a, b, c) {
      return WebAssembly.instantiate("/canvaskit/pages/canvaskit.wasm.br", b)
        .then((f) => f)
        .then(c, (e) => {
          Ia("failed to asynchronously prepare wasm: " + e);
          Ma(e);
        });
    }
    function rb(a, b) {
      var c = mb;
      return Ja ||
        "function" != typeof WebAssembly.instantiateStreaming ||
        lb(c) ||
        c.startsWith("file://") ||
        Ba ||
        "function" != typeof fetch
        ? qb(c, a, b)
        : fetch(c, { credentials: "same-origin" }).then((e) =>
            WebAssembly.instantiateStreaming(e, a).then(b, function (g) {
              Ia("wasm streaming compile failed: " + g);
              Ia("falling back to ArrayBuffer instantiation");
              return qb(c, a, b);
            })
          );
    }
    function sb(a) {
      this.name = "ExitStatus";
      this.message = `Program terminated with exit(${a})`;
      this.status = a;
    }
    var tb = (a) => {
        for (; 0 < a.length; ) a.shift()(w);
      },
      ub = {};
    function vb(a) {
      for (; a.length; ) {
        var b = a.pop();
        a.pop()(b);
      }
    }
    function wb(a) {
      return this.fromWireType(P[a >> 2]);
    }
    var xb = {},
      zb = {},
      Ab = {},
      Bb = void 0;
    function Cb(a) {
      throw new Bb(a);
    }
    function Db(a, b, c) {
      function e(n) {
        n = c(n);
        n.length !== a.length && Cb("Mismatched type converter count");
        for (var q = 0; q < a.length; ++q) Eb(a[q], n[q]);
      }
      a.forEach(function (n) {
        Ab[n] = b;
      });
      var g = Array(b.length),
        m = [],
        t = 0;
      b.forEach((n, q) => {
        zb.hasOwnProperty(n)
          ? (g[q] = zb[n])
          : (m.push(n),
            xb.hasOwnProperty(n) || (xb[n] = []),
            xb[n].push(() => {
              g[q] = zb[n];
              ++t;
              t === m.length && e(g);
            }));
      });
      0 === m.length && e(g);
    }
    function Fb(a) {
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
    var Gb = void 0;
    function Hb(a) {
      for (var b = ""; J[a]; ) b += Gb[J[a++]];
      return b;
    }
    var Ib = void 0;
    function X(a) {
      throw new Ib(a);
    }
    function Jb(a, b, c = {}) {
      var e = b.name;
      a || X(`type "${e}" must have a positive integer typeid pointer`);
      if (zb.hasOwnProperty(a)) {
        if (c.wf) return;
        X(`Cannot register type '${e}' twice`);
      }
      zb[a] = b;
      delete Ab[a];
      xb.hasOwnProperty(a) &&
        ((b = xb[a]), delete xb[a], b.forEach((g) => g()));
    }
    function Eb(a, b, c = {}) {
      if (!("argPackAdvance" in b))
        throw new TypeError(
          "registerType registeredInstance requires argPackAdvance"
        );
      Jb(a, b, c);
    }
    function Kb(a) {
      X(a.ld.xd.rd.name + " instance already deleted");
    }
    var Lb = !1;
    function Mb() {}
    function Nb(a) {
      --a.count.value;
      0 === a.count.value && (a.Ad ? a.Hd.Nd(a.Ad) : a.xd.rd.Nd(a.td));
    }
    function Ob(a, b, c) {
      if (b === c) return a;
      if (void 0 === c.Cd) return null;
      a = Ob(a, b, c.Cd);
      return null === a ? null : c.lf(a);
    }
    var Pb = {},
      Qb = [];
    function Rb() {
      for (; Qb.length; ) {
        var a = Qb.pop();
        a.ld.ge = !1;
        a["delete"]();
      }
    }
    var Sb = void 0,
      Tb = {};
    function Ub(a, b) {
      for (void 0 === b && X("ptr should not be undefined"); a.Cd; )
        (b = a.qe(b)), (a = a.Cd);
      return Tb[b];
    }
    function Vb(a, b) {
      (b.xd && b.td) || Cb("makeClassHandle requires ptr and ptrType");
      !!b.Hd !== !!b.Ad &&
        Cb("Both smartPtrType and smartPtr must be specified");
      b.count = { value: 1 };
      return bc(Object.create(a, { ld: { value: b } }));
    }
    function bc(a) {
      if ("undefined" === typeof FinalizationRegistry)
        return (bc = (b) => b), a;
      Lb = new FinalizationRegistry((b) => {
        Nb(b.ld);
      });
      bc = (b) => {
        var c = b.ld;
        c.Ad && Lb.register(b, { ld: c }, b);
        return b;
      };
      Mb = (b) => {
        Lb.unregister(b);
      };
      return bc(a);
    }
    function cc() {}
    function dc(a) {
      if (void 0 === a) return "_unknown";
      a = a.replace(/[^a-zA-Z0-9_]/g, "$");
      var b = a.charCodeAt(0);
      return 48 <= b && 57 >= b ? `_${a}` : a;
    }
    function ec(a, b) {
      a = dc(a);
      return {
        [a]: function () {
          return b.apply(this, arguments);
        },
      }[a];
    }
    function fc(a, b, c) {
      if (void 0 === a[b].zd) {
        var e = a[b];
        a[b] = function () {
          a[b].zd.hasOwnProperty(arguments.length) ||
            X(
              `Function '${c}' called with an invalid number of arguments (${arguments.length}) - expects one of (${a[b].zd})!`
            );
          return a[b].zd[arguments.length].apply(this, arguments);
        };
        a[b].zd = [];
        a[b].zd[e.ee] = e;
      }
    }
    function gc(a, b, c) {
      w.hasOwnProperty(a)
        ? ((void 0 === c || (void 0 !== w[a].zd && void 0 !== w[a].zd[c])) &&
            X(`Cannot register public name '${a}' twice`),
          fc(w, a, a),
          w.hasOwnProperty(c) &&
            X(
              `Cannot register multiple overloads of a function with the same number of arguments (${c})!`
            ),
          (w[a].zd[c] = b))
        : ((w[a] = b), void 0 !== c && (w[a].Wf = c));
    }
    function hc(a, b, c, e, g, m, t, n) {
      this.name = a;
      this.constructor = b;
      this.he = c;
      this.Nd = e;
      this.Cd = g;
      this.rf = m;
      this.qe = t;
      this.lf = n;
      this.Ff = [];
    }
    function ic(a, b, c) {
      for (; b !== c; )
        b.qe ||
          X(
            `Expected null or instance of ${c.name}, got an instance of ${b.name}`
          ),
          (a = b.qe(a)),
          (b = b.Cd);
      return a;
    }
    function jc(a, b) {
      if (null === b)
        return this.Je && X(`null is not a valid ${this.name}`), 0;
      b.ld || X(`Cannot pass "${kc(b)}" as a ${this.name}`);
      b.ld.td ||
        X(`Cannot pass deleted object as a pointer of type ${this.name}`);
      return ic(b.ld.td, b.ld.xd.rd, this.rd);
    }
    function lc(a, b) {
      if (null === b) {
        this.Je && X(`null is not a valid ${this.name}`);
        if (this.xe) {
          var c = this.Ke();
          null !== a && a.push(this.Nd, c);
          return c;
        }
        return 0;
      }
      b.ld || X(`Cannot pass "${kc(b)}" as a ${this.name}`);
      b.ld.td ||
        X(`Cannot pass deleted object as a pointer of type ${this.name}`);
      !this.we &&
        b.ld.xd.we &&
        X(
          `Cannot convert argument of type ${
            b.ld.Hd ? b.ld.Hd.name : b.ld.xd.name
          } to parameter type ${this.name}`
        );
      c = ic(b.ld.td, b.ld.xd.rd, this.rd);
      if (this.xe)
        switch (
          (void 0 === b.ld.Ad &&
            X("Passing raw pointer to smart pointer is illegal"),
          this.Kf)
        ) {
          case 0:
            b.ld.Hd === this
              ? (c = b.ld.Ad)
              : X(
                  `Cannot convert argument of type ${
                    b.ld.Hd ? b.ld.Hd.name : b.ld.xd.name
                  } to parameter type ${this.name}`
                );
            break;
          case 1:
            c = b.ld.Ad;
            break;
          case 2:
            if (b.ld.Hd === this) c = b.ld.Ad;
            else {
              var e = b.clone();
              c = this.Gf(
                c,
                mc(function () {
                  e["delete"]();
                })
              );
              null !== a && a.push(this.Nd, c);
            }
            break;
          default:
            X("Unsupporting sharing policy");
        }
      return c;
    }
    function nc(a, b) {
      if (null === b)
        return this.Je && X(`null is not a valid ${this.name}`), 0;
      b.ld || X(`Cannot pass "${kc(b)}" as a ${this.name}`);
      b.ld.td ||
        X(`Cannot pass deleted object as a pointer of type ${this.name}`);
      b.ld.xd.we &&
        X(
          `Cannot convert argument of type ${b.ld.xd.name} to parameter type ${this.name}`
        );
      return ic(b.ld.td, b.ld.xd.rd, this.rd);
    }
    function oc(a, b, c, e, g, m, t, n, q, v, G) {
      this.name = a;
      this.rd = b;
      this.Je = c;
      this.we = e;
      this.xe = g;
      this.Ef = m;
      this.Kf = t;
      this.We = n;
      this.Ke = q;
      this.Gf = v;
      this.Nd = G;
      g || void 0 !== b.Cd
        ? (this.toWireType = lc)
        : ((this.toWireType = e ? jc : nc), (this.Gd = null));
    }
    function pc(a, b, c) {
      w.hasOwnProperty(a) || Cb("Replacing nonexistant public symbol");
      void 0 !== w[a].zd && void 0 !== c
        ? (w[a].zd[c] = b)
        : ((w[a] = b), (w[a].ee = c));
    }
    var qc = (a, b) => {
      var c = [];
      return function () {
        c.length = 0;
        Object.assign(c, arguments);
        if (a.includes("j")) {
          var e = w["dynCall_" + a];
          e = c && c.length ? e.apply(null, [b].concat(c)) : e.call(null, b);
        } else e = Xa.get(b).apply(null, c);
        return e;
      };
    };
    function rc(a, b) {
      a = Hb(a);
      var c = a.includes("j") ? qc(a, b) : Xa.get(b);
      "function" != typeof c &&
        X(`unknown function pointer with signature ${a}: ${b}`);
      return c;
    }
    var sc = void 0;
    function tc(a) {
      a = uc(a);
      var b = Hb(a);
      vc(a);
      return b;
    }
    function wc(a, b) {
      function c(m) {
        g[m] || zb[m] || (Ab[m] ? Ab[m].forEach(c) : (e.push(m), (g[m] = !0)));
      }
      var e = [],
        g = {};
      b.forEach(c);
      throw new sc(`${a}: ` + e.map(tc).join([", "]));
    }
    function xc(a, b, c, e, g) {
      var m = b.length;
      2 > m &&
        X(
          "argTypes array size mismatch! Must at least get return value and 'this' types!"
        );
      var t = null !== b[1] && null !== c,
        n = !1;
      for (c = 1; c < b.length; ++c)
        if (null !== b[c] && void 0 === b[c].Gd) {
          n = !0;
          break;
        }
      var q = "void" !== b[0].name,
        v = m - 2,
        G = Array(v),
        I = [],
        L = [];
      return function () {
        arguments.length !== v &&
          X(
            `function ${a} called with ${arguments.length} arguments, expected ${v} args!`
          );
        L.length = 0;
        I.length = t ? 2 : 1;
        I[0] = g;
        if (t) {
          var y = b[1].toWireType(L, this);
          I[1] = y;
        }
        for (var M = 0; M < v; ++M)
          (G[M] = b[M + 2].toWireType(L, arguments[M])), I.push(G[M]);
        M = e.apply(null, I);
        if (n) vb(L);
        else
          for (var T = t ? 1 : 2; T < b.length; T++) {
            var S = 1 === T ? y : G[T - 2];
            null !== b[T].Gd && b[T].Gd(S);
          }
        y = q ? b[0].fromWireType(M) : void 0;
        return y;
      };
    }
    function Ec(a, b) {
      for (var c = [], e = 0; e < a; e++) c.push(Ua[(b + 4 * e) >> 2]);
      return c;
    }
    function Fc() {
      this.Md = [void 0];
      this.Te = [];
    }
    var Gc = new Fc();
    function Hc(a) {
      a >= Gc.ne && 0 === --Gc.get(a).Xe && Gc.Cf(a);
    }
    var Ic = (a) => {
        a || X("Cannot use deleted val. handle = " + a);
        return Gc.get(a).value;
      },
      mc = (a) => {
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
            return Gc.Bf({ Xe: 1, value: a });
        }
      };
    function Jc(a, b, c) {
      switch (b) {
        case 0:
          return function (e) {
            return this.fromWireType((c ? Qa : J)[e]);
          };
        case 1:
          return function (e) {
            return this.fromWireType((c ? Sa : Ta)[e >> 1]);
          };
        case 2:
          return function (e) {
            return this.fromWireType((c ? P : Ua)[e >> 2]);
          };
        default:
          throw new TypeError("Unknown integer type: " + a);
      }
    }
    function Kc(a, b) {
      var c = zb[a];
      void 0 === c && X(b + " has unknown type " + tc(a));
      return c;
    }
    function kc(a) {
      if (null === a) return "null";
      var b = typeof a;
      return "object" === b || "array" === b || "function" === b
        ? a.toString()
        : "" + a;
    }
    function Lc(a, b) {
      switch (b) {
        case 2:
          return function (c) {
            return this.fromWireType(R[c >> 2]);
          };
        case 3:
          return function (c) {
            return this.fromWireType(Va[c >> 3]);
          };
        default:
          throw new TypeError("Unknown float type: " + a);
      }
    }
    function Mc(a, b, c) {
      switch (b) {
        case 0:
          return c
            ? function (e) {
                return Qa[e];
              }
            : function (e) {
                return J[e];
              };
        case 1:
          return c
            ? function (e) {
                return Sa[e >> 1];
              }
            : function (e) {
                return Ta[e >> 1];
              };
        case 2:
          return c
            ? function (e) {
                return P[e >> 2];
              }
            : function (e) {
                return Ua[e >> 2];
              };
        default:
          throw new TypeError("Unknown integer type: " + a);
      }
    }
    var sa = (a, b, c, e) => {
        if (!(0 < e)) return 0;
        var g = c;
        e = c + e - 1;
        for (var m = 0; m < a.length; ++m) {
          var t = a.charCodeAt(m);
          if (55296 <= t && 57343 >= t) {
            var n = a.charCodeAt(++m);
            t = (65536 + ((t & 1023) << 10)) | (n & 1023);
          }
          if (127 >= t) {
            if (c >= e) break;
            b[c++] = t;
          } else {
            if (2047 >= t) {
              if (c + 1 >= e) break;
              b[c++] = 192 | (t >> 6);
            } else {
              if (65535 >= t) {
                if (c + 2 >= e) break;
                b[c++] = 224 | (t >> 12);
              } else {
                if (c + 3 >= e) break;
                b[c++] = 240 | (t >> 18);
                b[c++] = 128 | ((t >> 12) & 63);
              }
              b[c++] = 128 | ((t >> 6) & 63);
            }
            b[c++] = 128 | (t & 63);
          }
        }
        b[c] = 0;
        return c - g;
      },
      ra = (a) => {
        for (var b = 0, c = 0; c < a.length; ++c) {
          var e = a.charCodeAt(c);
          127 >= e
            ? b++
            : 2047 >= e
            ? (b += 2)
            : 55296 <= e && 57343 >= e
            ? ((b += 4), ++c)
            : (b += 3);
        }
        return b;
      },
      Nc = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0,
      Oc = (a, b, c) => {
        var e = b + c;
        for (c = b; a[c] && !(c >= e); ) ++c;
        if (16 < c - b && a.buffer && Nc) return Nc.decode(a.subarray(b, c));
        for (e = ""; b < c; ) {
          var g = a[b++];
          if (g & 128) {
            var m = a[b++] & 63;
            if (192 == (g & 224)) e += String.fromCharCode(((g & 31) << 6) | m);
            else {
              var t = a[b++] & 63;
              g =
                224 == (g & 240)
                  ? ((g & 15) << 12) | (m << 6) | t
                  : ((g & 7) << 18) | (m << 12) | (t << 6) | (a[b++] & 63);
              65536 > g
                ? (e += String.fromCharCode(g))
                : ((g -= 65536),
                  (e += String.fromCharCode(
                    55296 | (g >> 10),
                    56320 | (g & 1023)
                  )));
            }
          } else e += String.fromCharCode(g);
        }
        return e;
      },
      Pc =
        "undefined" != typeof TextDecoder
          ? new TextDecoder("utf-16le")
          : void 0,
      Qc = (a, b) => {
        var c = a >> 1;
        for (var e = c + b / 2; !(c >= e) && Ta[c]; ) ++c;
        c <<= 1;
        if (32 < c - a && Pc) return Pc.decode(J.subarray(a, c));
        c = "";
        for (e = 0; !(e >= b / 2); ++e) {
          var g = Sa[(a + 2 * e) >> 1];
          if (0 == g) break;
          c += String.fromCharCode(g);
        }
        return c;
      },
      Rc = (a, b, c) => {
        void 0 === c && (c = 2147483647);
        if (2 > c) return 0;
        c -= 2;
        var e = b;
        c = c < 2 * a.length ? c / 2 : a.length;
        for (var g = 0; g < c; ++g) (Sa[b >> 1] = a.charCodeAt(g)), (b += 2);
        Sa[b >> 1] = 0;
        return b - e;
      },
      Sc = (a) => 2 * a.length,
      Tc = (a, b) => {
        for (var c = 0, e = ""; !(c >= b / 4); ) {
          var g = P[(a + 4 * c) >> 2];
          if (0 == g) break;
          ++c;
          65536 <= g
            ? ((g -= 65536),
              (e += String.fromCharCode(55296 | (g >> 10), 56320 | (g & 1023))))
            : (e += String.fromCharCode(g));
        }
        return e;
      },
      Uc = (a, b, c) => {
        void 0 === c && (c = 2147483647);
        if (4 > c) return 0;
        var e = b;
        c = e + c - 4;
        for (var g = 0; g < a.length; ++g) {
          var m = a.charCodeAt(g);
          if (55296 <= m && 57343 >= m) {
            var t = a.charCodeAt(++g);
            m = (65536 + ((m & 1023) << 10)) | (t & 1023);
          }
          P[b >> 2] = m;
          b += 4;
          if (b + 4 > c) break;
        }
        P[b >> 2] = 0;
        return b - e;
      },
      Vc = (a) => {
        for (var b = 0, c = 0; c < a.length; ++c) {
          var e = a.charCodeAt(c);
          55296 <= e && 57343 >= e && ++c;
          b += 4;
        }
        return b;
      },
      Wc = {};
    function Xc(a) {
      var b = Wc[a];
      return void 0 === b ? Hb(a) : b;
    }
    var Yc = [];
    function Zc() {
      function a(b) {
        b.$$$embind_global$$$ = b;
        var c =
          "object" == typeof $$$embind_global$$$ && b.$$$embind_global$$$ == b;
        c || delete b.$$$embind_global$$$;
        return c;
      }
      if ("object" == typeof globalThis) return globalThis;
      if ("object" == typeof $$$embind_global$$$) return $$$embind_global$$$;
      "object" == typeof global && a(global)
        ? ($$$embind_global$$$ = global)
        : "object" == typeof self && a(self) && ($$$embind_global$$$ = self);
      if ("object" == typeof $$$embind_global$$$) return $$$embind_global$$$;
      throw Error("unable to get global object.");
    }
    function $c(a) {
      var b = Yc.length;
      Yc.push(a);
      return b;
    }
    function ad(a, b) {
      for (var c = Array(a), e = 0; e < a; ++e)
        c[e] = Kc(Ua[(b + 4 * e) >> 2], "parameter " + e);
      return c;
    }
    var bd = [];
    function cd(a) {
      var b = Array(a + 1);
      return function (c, e, g) {
        b[0] = c;
        for (var m = 0; m < a; ++m) {
          var t = Kc(Ua[(e + 4 * m) >> 2], "parameter " + m);
          b[m + 1] = t.readValueFromPointer(g);
          g += t.argPackAdvance;
        }
        c = new (c.bind.apply(c, b))();
        return mc(c);
      };
    }
    var dd = {};
    function ed(a) {
      var b = a.getExtension("ANGLE_instanced_arrays");
      b &&
        ((a.vertexAttribDivisor = function (c, e) {
          b.vertexAttribDivisorANGLE(c, e);
        }),
        (a.drawArraysInstanced = function (c, e, g, m) {
          b.drawArraysInstancedANGLE(c, e, g, m);
        }),
        (a.drawElementsInstanced = function (c, e, g, m, t) {
          b.drawElementsInstancedANGLE(c, e, g, m, t);
        }));
    }
    function fd(a) {
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
    function gd(a) {
      var b = a.getExtension("WEBGL_draw_buffers");
      b &&
        (a.drawBuffers = function (c, e) {
          b.drawBuffersWEBGL(c, e);
        });
    }
    var hd = 1,
      jd = [],
      kd = [],
      ld = [],
      md = [],
      ha = [],
      nd = [],
      od = [],
      oa = [],
      pd = [],
      qd = [],
      rd = {},
      sd = {},
      td = 4;
    function ud(a) {
      vd || (vd = a);
    }
    function fa(a) {
      for (var b = hd++, c = a.length; c < b; c++) a[c] = null;
      return b;
    }
    function ia(a, b) {
      // a.ne ||
      //   ((a.ne = a.getContext),
      //   (a.getContext = function (e, g) {
      //     g = a.ne(e, g);
      //     return ("webgl" == e) == g instanceof WebGLRenderingContext
      //       ? g
      //       : null;
      //   }));
      var c =
        1 < b.majorVersion
          ? a.getContext("webgl2", b)
          : a.getContext("webgl", b);
      return c ? wd(c, b) : 0;
    }
    function wd(a, b) {
      var c = fa(oa),
        e = { handle: c, attributes: b, version: b.majorVersion, Id: a };
      a.canvas && (a.canvas.$e = e);
      oa[c] = e;
      ("undefined" == typeof b.mf || b.mf) && zd(e);
      return c;
    }
    function na(a) {
      B = oa[a];
      w.Uf = Y = B && B.Id;
      return !(a && !Y);
    }
    function zd(a) {
      a || (a = B);
      if (!a.xf) {
        a.xf = !0;
        var b = a.Id;
        ed(b);
        fd(b);
        gd(b);
        b.Qe = b.getExtension("WEBGL_draw_instanced_base_vertex_base_instance");
        b.Ve = b.getExtension(
          "WEBGL_multi_draw_instanced_base_vertex_base_instance"
        );
        2 <= a.version &&
          (b.Re = b.getExtension("EXT_disjoint_timer_query_webgl2"));
        if (2 > a.version || !b.Re)
          b.Re = b.getExtension("EXT_disjoint_timer_query");
        b.Vf = b.getExtension("WEBGL_multi_draw");
        (b.getSupportedExtensions() || []).forEach(function (c) {
          c.includes("lose_context") ||
            c.includes("debug") ||
            b.getExtension(c);
        });
      }
    }
    var B,
      vd,
      Ad = {},
      Cd = () => {
        if (!Bd) {
          var a = {
              USER: "web_user",
              LOGNAME: "web_user",
              PATH: "/",
              PWD: "/",
              HOME: "/home/web_user",
              LANG:
                (
                  ("object" == typeof navigator &&
                    navigator.languages &&
                    navigator.languages[0]) ||
                  "C"
                ).replace("-", "_") + ".UTF-8",
              _: ua || "./this.program",
            },
            b;
          for (b in Ad) void 0 === Ad[b] ? delete a[b] : (a[b] = Ad[b]);
          var c = [];
          for (b in a) c.push(`${b}=${a[b]}`);
          Bd = c;
        }
        return Bd;
      },
      Bd,
      Dd = [null, [], []];
    function Ed(a) {
      Y.bindVertexArray(od[a]);
    }
    function Fd(a, b) {
      for (var c = 0; c < a; c++) {
        var e = P[(b + 4 * c) >> 2];
        Y.deleteVertexArray(od[e]);
        od[e] = null;
      }
    }
    var Gd = [];
    function Hd(a, b, c, e) {
      Y.drawElements(a, b, c, e);
    }
    function Id(a, b, c, e) {
      for (var g = 0; g < a; g++) {
        var m = Y[c](),
          t = m && fa(e);
        m ? ((m.name = t), (e[t] = m)) : ud(1282);
        P[(b + 4 * g) >> 2] = t;
      }
    }
    function Jd(a, b) {
      Id(a, b, "createVertexArray", od);
    }
    function Kd(a, b, c) {
      if (b) {
        var e = void 0;
        switch (a) {
          case 36346:
            e = 1;
            break;
          case 36344:
            0 != c && 1 != c && ud(1280);
            return;
          case 34814:
          case 36345:
            e = 0;
            break;
          case 34466:
            var g = Y.getParameter(34467);
            e = g ? g.length : 0;
            break;
          case 33309:
            if (2 > B.version) {
              ud(1282);
              return;
            }
            e = 2 * (Y.getSupportedExtensions() || []).length;
            break;
          case 33307:
          case 33308:
            if (2 > B.version) {
              ud(1280);
              return;
            }
            e = 33307 == a ? 3 : 0;
        }
        if (void 0 === e)
          switch (((g = Y.getParameter(a)), typeof g)) {
            case "number":
              e = g;
              break;
            case "boolean":
              e = g ? 1 : 0;
              break;
            case "string":
              ud(1280);
              return;
            case "object":
              if (null === g)
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
                    e = 0;
                    break;
                  default:
                    ud(1280);
                    return;
                }
              else {
                if (
                  g instanceof Float32Array ||
                  g instanceof Uint32Array ||
                  g instanceof Int32Array ||
                  g instanceof Array
                ) {
                  for (a = 0; a < g.length; ++a)
                    switch (c) {
                      case 0:
                        P[(b + 4 * a) >> 2] = g[a];
                        break;
                      case 2:
                        R[(b + 4 * a) >> 2] = g[a];
                        break;
                      case 4:
                        Qa[(b + a) >> 0] = g[a] ? 1 : 0;
                    }
                  return;
                }
                try {
                  e = g.name | 0;
                } catch (m) {
                  ud(1280);
                  Ia(
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
              ud(1280);
              Ia(
                "GL_INVALID_ENUM in glGet" +
                  c +
                  "v: Native code calling glGet" +
                  c +
                  "v(" +
                  a +
                  ") and it returns " +
                  g +
                  " of type " +
                  typeof g +
                  "!"
              );
              return;
          }
        switch (c) {
          case 1:
            c = e;
            Ua[b >> 2] = c;
            Ua[(b + 4) >> 2] = (c - Ua[b >> 2]) / 4294967296;
            break;
          case 0:
            P[b >> 2] = e;
            break;
          case 2:
            R[b >> 2] = e;
            break;
          case 4:
            Qa[b >> 0] = e ? 1 : 0;
        }
      } else ud(1281);
    }
    var Md = (a) => {
      var b = ra(a) + 1,
        c = Ld(b);
      c && sa(a, J, c, b);
      return c;
    };
    function Nd(a) {
      return "]" == a.slice(-1) && a.lastIndexOf("[");
    }
    function Od(a) {
      a -= 5120;
      return 0 == a
        ? Qa
        : 1 == a
        ? J
        : 2 == a
        ? Sa
        : 4 == a
        ? P
        : 6 == a
        ? R
        : 5 == a || 28922 == a || 28520 == a || 30779 == a || 30782 == a
        ? Ua
        : Ta;
    }
    function Pd(a, b, c, e, g) {
      a = Od(a);
      var m = 31 - Math.clz32(a.BYTES_PER_ELEMENT),
        t = td;
      return a.subarray(
        g >> m,
        (g +
          e *
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
              }[b - 6402] || 1) *
              (1 << m) +
              t -
              1) &
              -t)) >>
          m
      );
    }
    function Qd(a) {
      var b = Y.jf;
      if (b) {
        var c = b.pe[a];
        "number" == typeof c &&
          (b.pe[a] = c =
            Y.getUniformLocation(b, b.Ye[a] + (0 < c ? "[" + c + "]" : "")));
        return c;
      }
      ud(1282);
    }
    var Rd = [],
      Sd = [],
      Td = (a) => 0 === a % 4 && (0 !== a % 100 || 0 === a % 400),
      Ud = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      Vd = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function Wd(a) {
      var b = Array(ra(a) + 1);
      sa(a, b, 0, b.length);
      return b;
    }
    var Xd = (a, b, c, e) => {
      function g(y, M, T) {
        for (y = "number" == typeof y ? y.toString() : y || ""; y.length < M; )
          y = T[0] + y;
        return y;
      }
      function m(y, M) {
        return g(y, M, "0");
      }
      function t(y, M) {
        function T(pa) {
          return 0 > pa ? -1 : 0 < pa ? 1 : 0;
        }
        var S;
        0 === (S = T(y.getFullYear() - M.getFullYear())) &&
          0 === (S = T(y.getMonth() - M.getMonth())) &&
          (S = T(y.getDate() - M.getDate()));
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
        var M = y.Rd;
        for (y = new Date(new Date(y.Sd + 1900, 0, 1).getTime()); 0 < M; ) {
          var T = y.getMonth(),
            S = (Td(y.getFullYear()) ? Ud : Vd)[T];
          if (M > S - y.getDate())
            (M -= S - y.getDate() + 1),
              y.setDate(1),
              11 > T
                ? y.setMonth(T + 1)
                : (y.setMonth(0), y.setFullYear(y.getFullYear() + 1));
          else {
            y.setDate(y.getDate() + M);
            break;
          }
        }
        T = new Date(y.getFullYear() + 1, 0, 4);
        M = n(new Date(y.getFullYear(), 0, 4));
        T = n(T);
        return 0 >= t(M, y)
          ? 0 >= t(T, y)
            ? y.getFullYear() + 1
            : y.getFullYear()
          : y.getFullYear() - 1;
      }
      var v = P[(e + 40) >> 2];
      e = {
        Sf: P[e >> 2],
        Rf: P[(e + 4) >> 2],
        Be: P[(e + 8) >> 2],
        Le: P[(e + 12) >> 2],
        Ce: P[(e + 16) >> 2],
        Sd: P[(e + 20) >> 2],
        Kd: P[(e + 24) >> 2],
        Rd: P[(e + 28) >> 2],
        Yf: P[(e + 32) >> 2],
        Qf: P[(e + 36) >> 2],
        Tf: v ? (v ? Oc(J, v) : "") : "",
      };
      c = c ? Oc(J, c) : "";
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
      for (var G in v) c = c.replace(new RegExp(G, "g"), v[G]);
      var I = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(
          " "
        ),
        L =
          "January February March April May June July August September October November December".split(
            " "
          );
      v = {
        "%a": (y) => I[y.Kd].substring(0, 3),
        "%A": (y) => I[y.Kd],
        "%b": (y) => L[y.Ce].substring(0, 3),
        "%B": (y) => L[y.Ce],
        "%C": (y) => m(((y.Sd + 1900) / 100) | 0, 2),
        "%d": (y) => m(y.Le, 2),
        "%e": (y) => g(y.Le, 2, " "),
        "%g": (y) => q(y).toString().substring(2),
        "%G": (y) => q(y),
        "%H": (y) => m(y.Be, 2),
        "%I": (y) => {
          y = y.Be;
          0 == y ? (y = 12) : 12 < y && (y -= 12);
          return m(y, 2);
        },
        "%j": (y) => {
          for (
            var M = 0, T = 0;
            T <= y.Ce - 1;
            M += (Td(y.Sd + 1900) ? Ud : Vd)[T++]
          );
          return m(y.Le + M, 3);
        },
        "%m": (y) => m(y.Ce + 1, 2),
        "%M": (y) => m(y.Rf, 2),
        "%n": () => "\n",
        "%p": (y) => (0 <= y.Be && 12 > y.Be ? "AM" : "PM"),
        "%S": (y) => m(y.Sf, 2),
        "%t": () => "\t",
        "%u": (y) => y.Kd || 7,
        "%U": (y) => m(Math.floor((y.Rd + 7 - y.Kd) / 7), 2),
        "%V": (y) => {
          var M = Math.floor((y.Rd + 7 - ((y.Kd + 6) % 7)) / 7);
          2 >= (y.Kd + 371 - y.Rd - 2) % 7 && M++;
          if (M)
            53 == M &&
              ((T = (y.Kd + 371 - y.Rd) % 7),
              4 == T || (3 == T && Td(y.Sd)) || (M = 1));
          else {
            M = 52;
            var T = (y.Kd + 7 - y.Rd - 1) % 7;
            (4 == T || (5 == T && Td((y.Sd % 400) - 1))) && M++;
          }
          return m(M, 2);
        },
        "%w": (y) => y.Kd,
        "%W": (y) => m(Math.floor((y.Rd + 7 - ((y.Kd + 6) % 7)) / 7), 2),
        "%y": (y) => (y.Sd + 1900).toString().substring(2),
        "%Y": (y) => y.Sd + 1900,
        "%z": (y) => {
          y = y.Qf;
          var M = 0 <= y;
          y = Math.abs(y) / 60;
          return (
            (M ? "+" : "-") +
            String("0000" + ((y / 60) * 100 + (y % 60))).slice(-4)
          );
        },
        "%Z": (y) => y.Tf,
        "%%": () => "%",
      };
      c = c.replace(/%%/g, "\x00\x00");
      for (G in v)
        c.includes(G) && (c = c.replace(new RegExp(G, "g"), v[G](e)));
      c = c.replace(/\0\0/g, "%");
      G = Wd(c);
      if (G.length > b) return 0;
      Qa.set(G, a);
      return G.length - 1;
    };
    Bb = w.InternalError = class extends Error {
      constructor(a) {
        super(a);
        this.name = "InternalError";
      }
    };
    for (var Yd = Array(256), Zd = 0; 256 > Zd; ++Zd)
      Yd[Zd] = String.fromCharCode(Zd);
    Gb = Yd;
    Ib = w.BindingError = class extends Error {
      constructor(a) {
        super(a);
        this.name = "BindingError";
      }
    };
    cc.prototype.isAliasOf = function (a) {
      if (!(this instanceof cc && a instanceof cc)) return !1;
      var b = this.ld.xd.rd,
        c = this.ld.td,
        e = a.ld.xd.rd;
      for (a = a.ld.td; b.Cd; ) (c = b.qe(c)), (b = b.Cd);
      for (; e.Cd; ) (a = e.qe(a)), (e = e.Cd);
      return b === e && c === a;
    };
    cc.prototype.clone = function () {
      this.ld.td || Kb(this);
      if (this.ld.oe) return (this.ld.count.value += 1), this;
      var a = bc,
        b = Object,
        c = b.create,
        e = Object.getPrototypeOf(this),
        g = this.ld;
      a = a(
        c.call(b, e, {
          ld: {
            value: {
              count: g.count,
              ge: g.ge,
              oe: g.oe,
              td: g.td,
              xd: g.xd,
              Ad: g.Ad,
              Hd: g.Hd,
            },
          },
        })
      );
      a.ld.count.value += 1;
      a.ld.ge = !1;
      return a;
    };
    cc.prototype["delete"] = function () {
      this.ld.td || Kb(this);
      this.ld.ge && !this.ld.oe && X("Object already scheduled for deletion");
      Mb(this);
      Nb(this.ld);
      this.ld.oe || ((this.ld.Ad = void 0), (this.ld.td = void 0));
    };
    cc.prototype.isDeleted = function () {
      return !this.ld.td;
    };
    cc.prototype.deleteLater = function () {
      this.ld.td || Kb(this);
      this.ld.ge && !this.ld.oe && X("Object already scheduled for deletion");
      Qb.push(this);
      1 === Qb.length && Sb && Sb(Rb);
      this.ld.ge = !0;
      return this;
    };
    w.getInheritedInstanceCount = function () {
      return Object.keys(Tb).length;
    };
    w.getLiveInheritedInstances = function () {
      var a = [],
        b;
      for (b in Tb) Tb.hasOwnProperty(b) && a.push(Tb[b]);
      return a;
    };
    w.flushPendingDeletes = Rb;
    w.setDelayFunction = function (a) {
      Sb = a;
      Qb.length && Sb && Sb(Rb);
    };
    oc.prototype.sf = function (a) {
      this.We && (a = this.We(a));
      return a;
    };
    oc.prototype.Pe = function (a) {
      this.Nd && this.Nd(a);
    };
    oc.prototype.argPackAdvance = 8;
    oc.prototype.readValueFromPointer = wb;
    oc.prototype.deleteObject = function (a) {
      if (null !== a) a["delete"]();
    };
    oc.prototype.fromWireType = function (a) {
      function b() {
        return this.xe
          ? Vb(this.rd.he, { xd: this.Ef, td: c, Hd: this, Ad: a })
          : Vb(this.rd.he, { xd: this, td: a });
      }
      var c = this.sf(a);
      if (!c) return this.Pe(a), null;
      var e = Ub(this.rd, c);
      if (void 0 !== e) {
        if (0 === e.ld.count.value)
          return (e.ld.td = c), (e.ld.Ad = a), e.clone();
        e = e.clone();
        this.Pe(a);
        return e;
      }
      e = this.rd.rf(c);
      e = Pb[e];
      if (!e) return b.call(this);
      e = this.we ? e.gf : e.pointerType;
      var g = Ob(c, this.rd, e.rd);
      return null === g
        ? b.call(this)
        : this.xe
        ? Vb(e.rd.he, { xd: e, td: g, Hd: this, Ad: a })
        : Vb(e.rd.he, { xd: e, td: g });
    };
    sc = w.UnboundTypeError = (function (a, b) {
      var c = ec(b, function (e) {
        this.name = b;
        this.message = e;
        e = Error(e).stack;
        void 0 !== e &&
          (this.stack =
            this.toString() + "\n" + e.replace(/^Error(:[^\n]*)?\n/, ""));
      });
      c.prototype = Object.create(a.prototype);
      c.prototype.constructor = c;
      c.prototype.toString = function () {
        return void 0 === this.message
          ? this.name
          : `${this.name}: ${this.message}`;
      };
      return c;
    })(Error, "UnboundTypeError");
    Object.assign(Fc.prototype, {
      get(a) {
        return this.Md[a];
      },
      has(a) {
        return void 0 !== this.Md[a];
      },
      Bf(a) {
        var b = this.Te.pop() || this.Md.length;
        this.Md[b] = a;
        return b;
      },
      Cf(a) {
        this.Md[a] = void 0;
        this.Te.push(a);
      },
    });
    Gc.Md.push(
      { value: void 0 },
      { value: null },
      { value: !0 },
      { value: !1 }
    );
    Gc.ne = Gc.Md.length;
    w.count_emval_handles = function () {
      for (var a = 0, b = Gc.ne; b < Gc.Md.length; ++b)
        void 0 !== Gc.Md[b] && ++a;
      return a;
    };
    for (var Y, $d = 0; 32 > $d; ++$d) Gd.push(Array($d));
    var ae = new Float32Array(288);
    for ($d = 0; 288 > $d; ++$d) Rd[$d] = ae.subarray(0, $d + 1);
    var be = new Int32Array(288);
    for ($d = 0; 288 > $d; ++$d) Sd[$d] = be.subarray(0, $d + 1);
    var oe = {
      D: function (a) {
        var b = ub[a];
        delete ub[a];
        var c = b.Ke,
          e = b.Nd,
          g = b.Se,
          m = g.map((t) => t.vf).concat(g.map((t) => t.If));
        Db([a], m, (t) => {
          var n = {};
          g.forEach((q, v) => {
            var G = t[v],
              I = q.tf,
              L = q.uf,
              y = t[v + g.length],
              M = q.Hf,
              T = q.Jf;
            n[q.nf] = {
              read: (S) => G.fromWireType(I(L, S)),
              write: (S, pa) => {
                var la = [];
                M(T, S, y.toWireType(la, pa));
                vb(la);
              },
            };
          });
          return [
            {
              name: b.name,
              fromWireType: function (q) {
                var v = {},
                  G;
                for (G in n) v[G] = n[G].read(q);
                e(q);
                return v;
              },
              toWireType: function (q, v) {
                for (var G in n)
                  if (!(G in v)) throw new TypeError(`Missing field: "${G}"`);
                var I = c();
                for (G in n) n[G].write(I, v[G]);
                null !== q && q.push(e, I);
                return I;
              },
              argPackAdvance: 8,
              readValueFromPointer: wb,
              Gd: e,
            },
          ];
        });
      },
      hb: function () {},
      tb: function (a, b, c, e, g) {
        var m = Fb(c);
        b = Hb(b);
        Eb(a, {
          name: b,
          fromWireType: function (t) {
            return !!t;
          },
          toWireType: function (t, n) {
            return n ? e : g;
          },
          argPackAdvance: 8,
          readValueFromPointer: function (t) {
            if (1 === c) var n = Qa;
            else if (2 === c) n = Sa;
            else if (4 === c) n = P;
            else throw new TypeError("Unknown boolean type size: " + b);
            return this.fromWireType(n[t >> m]);
          },
          Gd: null,
        });
      },
      f: function (a, b, c, e, g, m, t, n, q, v, G, I, L) {
        G = Hb(G);
        m = rc(g, m);
        n && (n = rc(t, n));
        v && (v = rc(q, v));
        L = rc(I, L);
        var y = dc(G);
        gc(y, function () {
          wc(`Cannot construct ${G} due to unbound types`, [e]);
        });
        Db([a, b, c], e ? [e] : [], function (M) {
          M = M[0];
          if (e) {
            var T = M.rd;
            var S = T.he;
          } else S = cc.prototype;
          M = ec(y, function () {
            if (Object.getPrototypeOf(this) !== pa)
              throw new Ib("Use 'new' to construct " + G);
            if (void 0 === la.Qd)
              throw new Ib(G + " has no accessible constructor");
            var ib = la.Qd[arguments.length];
            if (void 0 === ib)
              throw new Ib(
                `Tried to invoke ctor of ${G} with invalid number of parameters (${
                  arguments.length
                }) - expected (${Object.keys(
                  la.Qd
                ).toString()}) parameters instead!`
              );
            return ib.apply(this, arguments);
          });
          var pa = Object.create(S, { constructor: { value: M } });
          M.prototype = pa;
          var la = new hc(G, M, pa, L, T, m, n, v);
          la.Cd && (void 0 === la.Cd.re && (la.Cd.re = []), la.Cd.re.push(la));
          T = new oc(G, la, !0, !1, !1);
          S = new oc(G + "*", la, !1, !1, !1);
          var hb = new oc(G + " const*", la, !1, !0, !1);
          Pb[a] = { pointerType: S, gf: hb };
          pc(y, M);
          return [T, S, hb];
        });
      },
      c: function (a, b, c, e, g, m, t) {
        var n = Ec(c, e);
        b = Hb(b);
        m = rc(g, m);
        Db([], [a], function (q) {
          function v() {
            wc(`Cannot call ${G} due to unbound types`, n);
          }
          q = q[0];
          var G = `${q.name}.${b}`;
          b.startsWith("@@") && (b = Symbol[b.substring(2)]);
          var I = q.rd.constructor;
          void 0 === I[b]
            ? ((v.ee = c - 1), (I[b] = v))
            : (fc(I, b, G), (I[b].zd[c - 1] = v));
          Db([], n, function (L) {
            L = [L[0], null].concat(L.slice(1));
            L = xc(G, L, null, m, t);
            void 0 === I[b].zd
              ? ((L.ee = c - 1), (I[b] = L))
              : (I[b].zd[c - 1] = L);
            if (q.rd.re)
              for (const y of q.rd.re)
                y.constructor.hasOwnProperty(b) || (y.constructor[b] = L);
            return [];
          });
          return [];
        });
      },
      t: function (a, b, c, e, g, m) {
        var t = Ec(b, c);
        g = rc(e, g);
        Db([], [a], function (n) {
          n = n[0];
          var q = `constructor ${n.name}`;
          void 0 === n.rd.Qd && (n.rd.Qd = []);
          if (void 0 !== n.rd.Qd[b - 1])
            throw new Ib(
              `Cannot register multiple constructors with identical number of parameters (${
                b - 1
              }) for class '${
                n.name
              }'! Overload resolution is currently only performed using the parameter count, not actual type info!`
            );
          n.rd.Qd[b - 1] = () => {
            wc(`Cannot construct ${n.name} due to unbound types`, t);
          };
          Db([], t, function (v) {
            v.splice(1, 0, null);
            n.rd.Qd[b - 1] = xc(q, v, null, g, m);
            return [];
          });
          return [];
        });
      },
      a: function (a, b, c, e, g, m, t, n) {
        var q = Ec(c, e);
        b = Hb(b);
        m = rc(g, m);
        Db([], [a], function (v) {
          function G() {
            wc(`Cannot call ${I} due to unbound types`, q);
          }
          v = v[0];
          var I = `${v.name}.${b}`;
          b.startsWith("@@") && (b = Symbol[b.substring(2)]);
          n && v.rd.Ff.push(b);
          var L = v.rd.he,
            y = L[b];
          void 0 === y ||
          (void 0 === y.zd && y.className !== v.name && y.ee === c - 2)
            ? ((G.ee = c - 2), (G.className = v.name), (L[b] = G))
            : (fc(L, b, I), (L[b].zd[c - 2] = G));
          Db([], q, function (M) {
            M = xc(I, M, v, m, t);
            void 0 === L[b].zd
              ? ((M.ee = c - 2), (L[b] = M))
              : (L[b].zd[c - 2] = M);
            return [];
          });
          return [];
        });
      },
      N: function (a, b, c) {
        a = Hb(a);
        Db([], [b], function (e) {
          e = e[0];
          w[a] = e.fromWireType(c);
          return [];
        });
      },
      sb: function (a, b) {
        b = Hb(b);
        Eb(a, {
          name: b,
          fromWireType: function (c) {
            var e = Ic(c);
            Hc(c);
            return e;
          },
          toWireType: function (c, e) {
            return mc(e);
          },
          argPackAdvance: 8,
          readValueFromPointer: wb,
          Gd: null,
        });
      },
      i: function (a, b, c, e) {
        function g() {}
        c = Fb(c);
        b = Hb(b);
        g.values = {};
        Eb(a, {
          name: b,
          constructor: g,
          fromWireType: function (m) {
            return this.constructor.values[m];
          },
          toWireType: function (m, t) {
            return t.value;
          },
          argPackAdvance: 8,
          readValueFromPointer: Jc(b, c, e),
          Gd: null,
        });
        gc(b, g);
      },
      b: function (a, b, c) {
        var e = Kc(a, "enum");
        b = Hb(b);
        a = e.constructor;
        e = Object.create(e.constructor.prototype, {
          value: { value: c },
          constructor: { value: ec(`${e.name}_${b}`, function () {}) },
        });
        a.values[c] = e;
        a[b] = e;
      },
      L: function (a, b, c) {
        c = Fb(c);
        b = Hb(b);
        Eb(a, {
          name: b,
          fromWireType: function (e) {
            return e;
          },
          toWireType: function (e, g) {
            return g;
          },
          argPackAdvance: 8,
          readValueFromPointer: Lc(b, c),
          Gd: null,
        });
      },
      l: function (a, b, c, e, g, m) {
        var t = Ec(b, c);
        a = Hb(a);
        g = rc(e, g);
        gc(
          a,
          function () {
            wc(`Cannot call ${a} due to unbound types`, t);
          },
          b - 1
        );
        Db([], t, function (n) {
          n = [n[0], null].concat(n.slice(1));
          pc(a, xc(a, n, null, g, m), b - 1);
          return [];
        });
      },
      o: function (a, b, c, e, g) {
        b = Hb(b);
        -1 === g && (g = 4294967295);
        g = Fb(c);
        var m = (n) => n;
        if (0 === e) {
          var t = 32 - 8 * c;
          m = (n) => (n << t) >>> t;
        }
        c = b.includes("unsigned")
          ? function (n, q) {
              return q >>> 0;
            }
          : function (n, q) {
              return q;
            };
        Eb(a, {
          name: b,
          fromWireType: m,
          toWireType: c,
          argPackAdvance: 8,
          readValueFromPointer: Mc(b, g, 0 !== e),
          Gd: null,
        });
      },
      h: function (a, b, c) {
        function e(m) {
          m >>= 2;
          var t = Ua;
          return new g(t.buffer, t[m + 1], t[m]);
        }
        var g = [
          Int8Array,
          Uint8Array,
          Int16Array,
          Uint16Array,
          Int32Array,
          Uint32Array,
          Float32Array,
          Float64Array,
        ][b];
        c = Hb(c);
        Eb(
          a,
          {
            name: c,
            fromWireType: e,
            argPackAdvance: 8,
            readValueFromPointer: e,
          },
          { wf: !0 }
        );
      },
      k: function (a, b, c, e, g, m, t, n, q, v, G, I) {
        c = Hb(c);
        m = rc(g, m);
        n = rc(t, n);
        v = rc(q, v);
        I = rc(G, I);
        Db([a], [b], function (L) {
          L = L[0];
          return [new oc(c, L.rd, !1, !1, !0, L, e, m, n, v, I)];
        });
      },
      K: function (a, b) {
        b = Hb(b);
        var c = "std::string" === b;
        Eb(a, {
          name: b,
          fromWireType: function (e) {
            var g = Ua[e >> 2],
              m = e + 4;
            if (c)
              for (var t = m, n = 0; n <= g; ++n) {
                var q = m + n;
                if (n == g || 0 == J[q]) {
                  t = t ? Oc(J, t, q - t) : "";
                  if (void 0 === v) var v = t;
                  else (v += String.fromCharCode(0)), (v += t);
                  t = q + 1;
                }
              }
            else {
              v = Array(g);
              for (n = 0; n < g; ++n) v[n] = String.fromCharCode(J[m + n]);
              v = v.join("");
            }
            vc(e);
            return v;
          },
          toWireType: function (e, g) {
            g instanceof ArrayBuffer && (g = new Uint8Array(g));
            var m = "string" == typeof g;
            m ||
              g instanceof Uint8Array ||
              g instanceof Uint8ClampedArray ||
              g instanceof Int8Array ||
              X("Cannot pass non-string to std::string");
            var t = c && m ? ra(g) : g.length;
            var n = Ld(4 + t + 1),
              q = n + 4;
            Ua[n >> 2] = t;
            if (c && m) sa(g, J, q, t + 1);
            else if (m)
              for (m = 0; m < t; ++m) {
                var v = g.charCodeAt(m);
                255 < v &&
                  (vc(q),
                  X("String has UTF-16 code units that do not fit in 8 bits"));
                J[q + m] = v;
              }
            else for (m = 0; m < t; ++m) J[q + m] = g[m];
            null !== e && e.push(vc, n);
            return n;
          },
          argPackAdvance: 8,
          readValueFromPointer: wb,
          Gd: function (e) {
            vc(e);
          },
        });
      },
      B: function (a, b, c) {
        c = Hb(c);
        if (2 === b) {
          var e = Qc;
          var g = Rc;
          var m = Sc;
          var t = () => Ta;
          var n = 1;
        } else
          4 === b && ((e = Tc), (g = Uc), (m = Vc), (t = () => Ua), (n = 2));
        Eb(a, {
          name: c,
          fromWireType: function (q) {
            for (
              var v = Ua[q >> 2], G = t(), I, L = q + 4, y = 0;
              y <= v;
              ++y
            ) {
              var M = q + 4 + y * b;
              if (y == v || 0 == G[M >> n])
                (L = e(L, M - L)),
                  void 0 === I
                    ? (I = L)
                    : ((I += String.fromCharCode(0)), (I += L)),
                  (L = M + b);
            }
            vc(q);
            return I;
          },
          toWireType: function (q, v) {
            "string" != typeof v &&
              X(`Cannot pass non-string to C++ string type ${c}`);
            var G = m(v),
              I = Ld(4 + G + b);
            Ua[I >> 2] = G >> n;
            g(v, I + 4, G + b);
            null !== q && q.push(vc, I);
            return I;
          },
          argPackAdvance: 8,
          readValueFromPointer: wb,
          Gd: function (q) {
            vc(q);
          },
        });
      },
      C: function (a, b, c, e, g, m) {
        ub[a] = { name: Hb(b), Ke: rc(c, e), Nd: rc(g, m), Se: [] };
      },
      u: function (a, b, c, e, g, m, t, n, q, v) {
        ub[a].Se.push({
          nf: Hb(b),
          vf: c,
          tf: rc(e, g),
          uf: m,
          If: t,
          Hf: rc(n, q),
          Jf: v,
        });
      },
      ub: function (a, b) {
        b = Hb(b);
        Eb(a, {
          yf: !0,
          name: b,
          argPackAdvance: 0,
          fromWireType: function () {},
          toWireType: function () {},
        });
      },
      nb: () => !0,
      lb: () => {
        throw Infinity;
      },
      H: function (a, b, c, e, g) {
        a = Yc[a];
        b = Ic(b);
        c = Xc(c);
        var m = [];
        Ua[e >> 2] = mc(m);
        return a(b, c, m, g);
      },
      z: function (a, b, c, e) {
        a = Yc[a];
        b = Ic(b);
        c = Xc(c);
        a(b, c, null, e);
      },
      e: Hc,
      sa: function (a) {
        if (0 === a) return mc(Zc());
        a = Xc(a);
        return mc(Zc()[a]);
      },
      w: function (a, b) {
        var c = ad(a, b),
          e = c[0];
        b =
          e.name +
          "_$" +
          c
            .slice(1)
            .map(function (t) {
              return t.name;
            })
            .join("_") +
          "$";
        var g = bd[b];
        if (void 0 !== g) return g;
        var m = Array(a - 1);
        g = $c((t, n, q, v) => {
          for (var G = 0, I = 0; I < a - 1; ++I)
            (m[I] = c[I + 1].readValueFromPointer(v + G)),
              (G += c[I + 1].argPackAdvance);
          t = t[n].apply(t, m);
          for (I = 0; I < a - 1; ++I) c[I + 1].kf && c[I + 1].kf(m[I]);
          if (!e.yf) return e.toWireType(q, t);
        });
        return (bd[b] = g);
      },
      n: function (a) {
        4 < a && (Gc.get(a).Xe += 1);
      },
      eb: function (a, b, c, e) {
        a = Ic(a);
        var g = dd[b];
        g || ((g = cd(b)), (dd[b] = g));
        return g(a, c, e);
      },
      r: function (a) {
        return mc(Xc(a));
      },
      fb: function () {
        return mc({});
      },
      G: function (a) {
        var b = Ic(a);
        vb(b);
        Hc(a);
      },
      A: function (a, b, c) {
        a = Ic(a);
        b = Ic(b);
        c = Ic(c);
        a[b] = c;
      },
      s: function (a, b) {
        a = Kc(a, "_emval_take_value");
        a = a.readValueFromPointer(b);
        return mc(a);
      },
      d: () => {
        Ma("");
      },
      ob: () => new Date().getTime(),
      mb: (a) => {
        var b = J.length;
        a >>>= 0;
        if (2147483648 < a) return !1;
        for (var c = 1; 4 >= c; c *= 2) {
          var e = b * (1 + 0.2 / c);
          e = Math.min(e, a + 100663296);
          var g = Math;
          e = Math.max(a, e);
          a: {
            g =
              (g.min.call(g, 2147483648, e + ((65536 - (e % 65536)) % 65536)) -
                Na.buffer.byteLength +
                65535) >>>
              16;
            try {
              Na.grow(g);
              Wa();
              var m = 1;
              break a;
            } catch (t) {}
            m = void 0;
          }
          if (m) return !0;
        }
        return !1;
      },
      db: function () {
        return B ? B.handle : 0;
      },
      pb: (a, b) => {
        var c = 0;
        Cd().forEach(function (e, g) {
          var m = b + c;
          g = Ua[(a + 4 * g) >> 2] = m;
          for (m = 0; m < e.length; ++m) Qa[g++ >> 0] = e.charCodeAt(m);
          Qa[g >> 0] = 0;
          c += e.length + 1;
        });
        return 0;
      },
      qb: (a, b) => {
        var c = Cd();
        Ua[a >> 2] = c.length;
        var e = 0;
        c.forEach(function (g) {
          e += g.length + 1;
        });
        Ua[b >> 2] = e;
        return 0;
      },
      vb: (a) => {
        if (!noExitRuntime) {
          if (w.onExit) w.onExit(a);
          Pa = !0;
        }
        va(a, new sb(a));
      },
      rb: () => 52,
      gb: function () {
        return 70;
      },
      J: (a, b, c, e) => {
        for (var g = 0, m = 0; m < c; m++) {
          var t = Ua[b >> 2],
            n = Ua[(b + 4) >> 2];
          b += 8;
          for (var q = 0; q < n; q++) {
            var v = J[t + q],
              G = Dd[a];
            0 === v || 10 === v
              ? ((1 === a ? Ha : Ia)(Oc(G, 0)), (G.length = 0))
              : G.push(v);
          }
          g += n;
        }
        Ua[e >> 2] = g;
        return 0;
      },
      U: function (a) {
        Y.activeTexture(a);
      },
      V: function (a, b) {
        Y.attachShader(kd[a], nd[b]);
      },
      W: function (a, b, c) {
        Y.bindAttribLocation(kd[a], b, c ? Oc(J, c) : "");
      },
      X: function (a, b) {
        35051 == a ? (Y.He = b) : 35052 == a && (Y.fe = b);
        Y.bindBuffer(a, jd[b]);
      },
      P: function (a, b) {
        Y.bindFramebuffer(a, ld[b]);
      },
      Tb: function (a, b) {
        Y.bindRenderbuffer(a, md[b]);
      },
      Db: function (a, b) {
        Y.bindSampler(a, pd[b]);
      },
      Y: function (a, b) {
        Y.bindTexture(a, ha[b]);
      },
      lc: Ed,
      oc: Ed,
      Z: function (a, b, c, e) {
        Y.blendColor(a, b, c, e);
      },
      _: function (a) {
        Y.blendEquation(a);
      },
      $: function (a, b) {
        Y.blendFunc(a, b);
      },
      Nb: function (a, b, c, e, g, m, t, n, q, v) {
        Y.blitFramebuffer(a, b, c, e, g, m, t, n, q, v);
      },
      aa: function (a, b, c, e) {
        2 <= B.version
          ? c && b
            ? Y.bufferData(a, J, e, c, b)
            : Y.bufferData(a, b, e)
          : Y.bufferData(a, c ? J.subarray(c, c + b) : b, e);
      },
      ba: function (a, b, c, e) {
        2 <= B.version
          ? c && Y.bufferSubData(a, b, J, e, c)
          : Y.bufferSubData(a, b, J.subarray(e, e + c));
      },
      Ub: function (a) {
        return Y.checkFramebufferStatus(a);
      },
      F: function (a) {
        Y.clear(a);
      },
      O: function (a, b, c, e) {
        Y.clearColor(a, b, c, e);
      },
      I: function (a) {
        Y.clearStencil(a);
      },
      jb: function (a, b, c, e) {
        return Y.clientWaitSync(qd[a], b, (c >>> 0) + 4294967296 * e);
      },
      ca: function (a, b, c, e) {
        Y.colorMask(!!a, !!b, !!c, !!e);
      },
      da: function (a) {
        Y.compileShader(nd[a]);
      },
      ea: function (a, b, c, e, g, m, t, n) {
        2 <= B.version
          ? Y.fe || !t
            ? Y.compressedTexImage2D(a, b, c, e, g, m, t, n)
            : Y.compressedTexImage2D(a, b, c, e, g, m, J, n, t)
          : Y.compressedTexImage2D(
              a,
              b,
              c,
              e,
              g,
              m,
              n ? J.subarray(n, n + t) : null
            );
      },
      fa: function (a, b, c, e, g, m, t, n, q) {
        2 <= B.version
          ? Y.fe || !n
            ? Y.compressedTexSubImage2D(a, b, c, e, g, m, t, n, q)
            : Y.compressedTexSubImage2D(a, b, c, e, g, m, t, J, q, n)
          : Y.compressedTexSubImage2D(
              a,
              b,
              c,
              e,
              g,
              m,
              t,
              q ? J.subarray(q, q + n) : null
            );
      },
      Lb: function (a, b, c, e, g) {
        Y.copyBufferSubData(a, b, c, e, g);
      },
      ga: function (a, b, c, e, g, m, t, n) {
        Y.copyTexSubImage2D(a, b, c, e, g, m, t, n);
      },
      ha: function () {
        var a = fa(kd),
          b = Y.createProgram();
        b.name = a;
        b.Ae = b.ye = b.ze = 0;
        b.Me = 1;
        kd[a] = b;
        return a;
      },
      ia: function (a) {
        var b = fa(nd);
        nd[b] = Y.createShader(a);
        return b;
      },
      ja: function (a) {
        Y.cullFace(a);
      },
      ka: function (a, b) {
        for (var c = 0; c < a; c++) {
          var e = P[(b + 4 * c) >> 2],
            g = jd[e];
          g &&
            (Y.deleteBuffer(g),
            (g.name = 0),
            (jd[e] = null),
            e == Y.He && (Y.He = 0),
            e == Y.fe && (Y.fe = 0));
        }
      },
      Vb: function (a, b) {
        for (var c = 0; c < a; ++c) {
          var e = P[(b + 4 * c) >> 2],
            g = ld[e];
          g && (Y.deleteFramebuffer(g), (g.name = 0), (ld[e] = null));
        }
      },
      la: function (a) {
        if (a) {
          var b = kd[a];
          b ? (Y.deleteProgram(b), (b.name = 0), (kd[a] = null)) : ud(1281);
        }
      },
      Wb: function (a, b) {
        for (var c = 0; c < a; c++) {
          var e = P[(b + 4 * c) >> 2],
            g = md[e];
          g && (Y.deleteRenderbuffer(g), (g.name = 0), (md[e] = null));
        }
      },
      Eb: function (a, b) {
        for (var c = 0; c < a; c++) {
          var e = P[(b + 4 * c) >> 2],
            g = pd[e];
          g && (Y.deleteSampler(g), (g.name = 0), (pd[e] = null));
        }
      },
      ma: function (a) {
        if (a) {
          var b = nd[a];
          b ? (Y.deleteShader(b), (nd[a] = null)) : ud(1281);
        }
      },
      Mb: function (a) {
        if (a) {
          var b = qd[a];
          b ? (Y.deleteSync(b), (b.name = 0), (qd[a] = null)) : ud(1281);
        }
      },
      na: function (a, b) {
        for (var c = 0; c < a; c++) {
          var e = P[(b + 4 * c) >> 2],
            g = ha[e];
          g && (Y.deleteTexture(g), (g.name = 0), (ha[e] = null));
        }
      },
      mc: Fd,
      pc: Fd,
      oa: function (a) {
        Y.depthMask(!!a);
      },
      pa: function (a) {
        Y.disable(a);
      },
      qa: function (a) {
        Y.disableVertexAttribArray(a);
      },
      ra: function (a, b, c) {
        Y.drawArrays(a, b, c);
      },
      jc: function (a, b, c, e) {
        Y.drawArraysInstanced(a, b, c, e);
      },
      hc: function (a, b, c, e, g) {
        Y.Qe.drawArraysInstancedBaseInstanceWEBGL(a, b, c, e, g);
      },
      fc: function (a, b) {
        for (var c = Gd[a], e = 0; e < a; e++) c[e] = P[(b + 4 * e) >> 2];
        Y.drawBuffers(c);
      },
      ta: Hd,
      kc: function (a, b, c, e, g) {
        Y.drawElementsInstanced(a, b, c, e, g);
      },
      ic: function (a, b, c, e, g, m, t) {
        Y.Qe.drawElementsInstancedBaseVertexBaseInstanceWEBGL(
          a,
          b,
          c,
          e,
          g,
          m,
          t
        );
      },
      $b: function (a, b, c, e, g, m) {
        Hd(a, e, g, m);
      },
      ua: function (a) {
        Y.enable(a);
      },
      va: function (a) {
        Y.enableVertexAttribArray(a);
      },
      Jb: function (a, b) {
        return (a = Y.fenceSync(a, b))
          ? ((b = fa(qd)), (a.name = b), (qd[b] = a), b)
          : 0;
      },
      wa: function () {
        Y.finish();
      },
      xa: function () {
        Y.flush();
      },
      Xb: function (a, b, c, e) {
        Y.framebufferRenderbuffer(a, b, c, md[e]);
      },
      Yb: function (a, b, c, e, g) {
        Y.framebufferTexture2D(a, b, c, ha[e], g);
      },
      ya: function (a) {
        Y.frontFace(a);
      },
      za: function (a, b) {
        Id(a, b, "createBuffer", jd);
      },
      Zb: function (a, b) {
        Id(a, b, "createFramebuffer", ld);
      },
      _b: function (a, b) {
        Id(a, b, "createRenderbuffer", md);
      },
      Fb: function (a, b) {
        Id(a, b, "createSampler", pd);
      },
      Aa: function (a, b) {
        Id(a, b, "createTexture", ha);
      },
      nc: Jd,
      qc: Jd,
      Pb: function (a) {
        Y.generateMipmap(a);
      },
      Ba: function (a, b, c) {
        c ? (P[c >> 2] = Y.getBufferParameter(a, b)) : ud(1281);
      },
      Ca: function () {
        var a = Y.getError() || vd;
        vd = 0;
        return a;
      },
      Da: function (a, b) {
        Kd(a, b, 2);
      },
      Qb: function (a, b, c, e) {
        a = Y.getFramebufferAttachmentParameter(a, b, c);
        if (a instanceof WebGLRenderbuffer || a instanceof WebGLTexture)
          a = a.name | 0;
        P[e >> 2] = a;
      },
      y: function (a, b) {
        Kd(a, b, 0);
      },
      Ea: function (a, b, c, e) {
        a = Y.getProgramInfoLog(kd[a]);
        null === a && (a = "(unknown error)");
        b = 0 < b && e ? sa(a, J, e, b) : 0;
        c && (P[c >> 2] = b);
      },
      Fa: function (a, b, c) {
        if (c)
          if (a >= hd) ud(1281);
          else if (((a = kd[a]), 35716 == b))
            (a = Y.getProgramInfoLog(a)),
              null === a && (a = "(unknown error)"),
              (P[c >> 2] = a.length + 1);
          else if (35719 == b) {
            if (!a.Ae)
              for (b = 0; b < Y.getProgramParameter(a, 35718); ++b)
                a.Ae = Math.max(a.Ae, Y.getActiveUniform(a, b).name.length + 1);
            P[c >> 2] = a.Ae;
          } else if (35722 == b) {
            if (!a.ye)
              for (b = 0; b < Y.getProgramParameter(a, 35721); ++b)
                a.ye = Math.max(a.ye, Y.getActiveAttrib(a, b).name.length + 1);
            P[c >> 2] = a.ye;
          } else if (35381 == b) {
            if (!a.ze)
              for (b = 0; b < Y.getProgramParameter(a, 35382); ++b)
                a.ze = Math.max(
                  a.ze,
                  Y.getActiveUniformBlockName(a, b).length + 1
                );
            P[c >> 2] = a.ze;
          } else P[c >> 2] = Y.getProgramParameter(a, b);
        else ud(1281);
      },
      Rb: function (a, b, c) {
        c ? (P[c >> 2] = Y.getRenderbufferParameter(a, b)) : ud(1281);
      },
      Ga: function (a, b, c, e) {
        a = Y.getShaderInfoLog(nd[a]);
        null === a && (a = "(unknown error)");
        b = 0 < b && e ? sa(a, J, e, b) : 0;
        c && (P[c >> 2] = b);
      },
      Ab: function (a, b, c, e) {
        a = Y.getShaderPrecisionFormat(a, b);
        P[c >> 2] = a.rangeMin;
        P[(c + 4) >> 2] = a.rangeMax;
        P[e >> 2] = a.precision;
      },
      Ha: function (a, b, c) {
        c
          ? 35716 == b
            ? ((a = Y.getShaderInfoLog(nd[a])),
              null === a && (a = "(unknown error)"),
              (P[c >> 2] = a ? a.length + 1 : 0))
            : 35720 == b
            ? ((a = Y.getShaderSource(nd[a])),
              (P[c >> 2] = a ? a.length + 1 : 0))
            : (P[c >> 2] = Y.getShaderParameter(nd[a], b))
          : ud(1281);
      },
      E: function (a) {
        var b = rd[a];
        if (!b) {
          switch (a) {
            case 7939:
              b = Y.getSupportedExtensions() || [];
              b = b.concat(
                b.map(function (e) {
                  return "GL_" + e;
                })
              );
              b = Md(b.join(" "));
              break;
            case 7936:
            case 7937:
            case 37445:
            case 37446:
              (b = Y.getParameter(a)) || ud(1280);
              b = b && Md(b);
              break;
            case 7938:
              b = Y.getParameter(7938);
              b =
                2 <= B.version
                  ? "OpenGL ES 3.0 (" + b + ")"
                  : "OpenGL ES 2.0 (" + b + ")";
              b = Md(b);
              break;
            case 35724:
              b = Y.getParameter(35724);
              var c = b.match(/^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/);
              null !== c &&
                (3 == c[1].length && (c[1] += "0"),
                (b = "OpenGL ES GLSL ES " + c[1] + " (" + b + ")"));
              b = Md(b);
              break;
            default:
              ud(1280);
          }
          rd[a] = b;
        }
        return b;
      },
      cb: function (a, b) {
        if (2 > B.version) return ud(1282), 0;
        var c = sd[a];
        if (c) return 0 > b || b >= c.length ? (ud(1281), 0) : c[b];
        switch (a) {
          case 7939:
            return (
              (c = Y.getSupportedExtensions() || []),
              (c = c.concat(
                c.map(function (e) {
                  return "GL_" + e;
                })
              )),
              (c = c.map(function (e) {
                return Md(e);
              })),
              (c = sd[a] = c),
              0 > b || b >= c.length ? (ud(1281), 0) : c[b]
            );
          default:
            return ud(1280), 0;
        }
      },
      Ia: function (a, b) {
        b = b ? Oc(J, b) : "";
        if ((a = kd[a])) {
          var c = a,
            e = c.pe,
            g = c.Ze,
            m;
          if (!e)
            for (
              c.pe = e = {}, c.Ye = {}, m = 0;
              m < Y.getProgramParameter(c, 35718);
              ++m
            ) {
              var t = Y.getActiveUniform(c, m);
              var n = t.name;
              t = t.size;
              var q = Nd(n);
              q = 0 < q ? n.slice(0, q) : n;
              var v = c.Me;
              c.Me += t;
              g[q] = [t, v];
              for (n = 0; n < t; ++n) (e[v] = n), (c.Ye[v++] = q);
            }
          c = a.pe;
          e = 0;
          g = b;
          m = Nd(b);
          0 < m && ((e = parseInt(b.slice(m + 1)) >>> 0), (g = b.slice(0, m)));
          if (
            (g = a.Ze[g]) &&
            e < g[0] &&
            ((e += g[1]), (c[e] = c[e] || Y.getUniformLocation(a, b)))
          )
            return e;
        } else ud(1281);
        return -1;
      },
      Bb: function (a, b, c) {
        for (var e = Gd[b], g = 0; g < b; g++) e[g] = P[(c + 4 * g) >> 2];
        Y.invalidateFramebuffer(a, e);
      },
      Cb: function (a, b, c, e, g, m, t) {
        for (var n = Gd[b], q = 0; q < b; q++) n[q] = P[(c + 4 * q) >> 2];
        Y.invalidateSubFramebuffer(a, n, e, g, m, t);
      },
      Kb: function (a) {
        return Y.isSync(qd[a]);
      },
      Ja: function (a) {
        return (a = ha[a]) ? Y.isTexture(a) : 0;
      },
      Ka: function (a) {
        Y.lineWidth(a);
      },
      La: function (a) {
        a = kd[a];
        Y.linkProgram(a);
        a.pe = 0;
        a.Ze = {};
      },
      dc: function (a, b, c, e, g, m) {
        Y.Ve.multiDrawArraysInstancedBaseInstanceWEBGL(
          a,
          P,
          b >> 2,
          P,
          c >> 2,
          P,
          e >> 2,
          Ua,
          g >> 2,
          m
        );
      },
      ec: function (a, b, c, e, g, m, t, n) {
        Y.Ve.multiDrawElementsInstancedBaseVertexBaseInstanceWEBGL(
          a,
          P,
          b >> 2,
          c,
          P,
          e >> 2,
          P,
          g >> 2,
          P,
          m >> 2,
          Ua,
          t >> 2,
          n
        );
      },
      Ma: function (a, b) {
        3317 == a && (td = b);
        Y.pixelStorei(a, b);
      },
      gc: function (a) {
        Y.readBuffer(a);
      },
      Na: function (a, b, c, e, g, m, t) {
        if (2 <= B.version)
          if (Y.He) Y.readPixels(a, b, c, e, g, m, t);
          else {
            var n = Od(m);
            Y.readPixels(
              a,
              b,
              c,
              e,
              g,
              m,
              n,
              t >> (31 - Math.clz32(n.BYTES_PER_ELEMENT))
            );
          }
        else
          (t = Pd(m, g, c, e, t))
            ? Y.readPixels(a, b, c, e, g, m, t)
            : ud(1280);
      },
      Sb: function (a, b, c, e) {
        Y.renderbufferStorage(a, b, c, e);
      },
      Ob: function (a, b, c, e, g) {
        Y.renderbufferStorageMultisample(a, b, c, e, g);
      },
      Gb: function (a, b, c) {
        Y.samplerParameterf(pd[a], b, c);
      },
      Hb: function (a, b, c) {
        Y.samplerParameteri(pd[a], b, c);
      },
      Ib: function (a, b, c) {
        Y.samplerParameteri(pd[a], b, P[c >> 2]);
      },
      Oa: function (a, b, c, e) {
        Y.scissor(a, b, c, e);
      },
      Pa: function (a, b, c, e) {
        for (var g = "", m = 0; m < b; ++m) {
          var t = e ? P[(e + 4 * m) >> 2] : -1,
            n = P[(c + 4 * m) >> 2];
          t = n ? Oc(J, n, 0 > t ? void 0 : t) : "";
          g += t;
        }
        Y.shaderSource(nd[a], g);
      },
      Qa: function (a, b, c) {
        Y.stencilFunc(a, b, c);
      },
      Ra: function (a, b, c, e) {
        Y.stencilFuncSeparate(a, b, c, e);
      },
      Sa: function (a) {
        Y.stencilMask(a);
      },
      Ta: function (a, b) {
        Y.stencilMaskSeparate(a, b);
      },
      Ua: function (a, b, c) {
        Y.stencilOp(a, b, c);
      },
      Va: function (a, b, c, e) {
        Y.stencilOpSeparate(a, b, c, e);
      },
      Wa: function (a, b, c, e, g, m, t, n, q) {
        if (2 <= B.version)
          if (Y.fe) Y.texImage2D(a, b, c, e, g, m, t, n, q);
          else if (q) {
            var v = Od(n);
            Y.texImage2D(
              a,
              b,
              c,
              e,
              g,
              m,
              t,
              n,
              v,
              q >> (31 - Math.clz32(v.BYTES_PER_ELEMENT))
            );
          } else Y.texImage2D(a, b, c, e, g, m, t, n, null);
        else Y.texImage2D(a, b, c, e, g, m, t, n, q ? Pd(n, t, e, g, q) : null);
      },
      Xa: function (a, b, c) {
        Y.texParameterf(a, b, c);
      },
      Ya: function (a, b, c) {
        Y.texParameterf(a, b, R[c >> 2]);
      },
      Za: function (a, b, c) {
        Y.texParameteri(a, b, c);
      },
      _a: function (a, b, c) {
        Y.texParameteri(a, b, P[c >> 2]);
      },
      ac: function (a, b, c, e, g) {
        Y.texStorage2D(a, b, c, e, g);
      },
      $a: function (a, b, c, e, g, m, t, n, q) {
        if (2 <= B.version)
          if (Y.fe) Y.texSubImage2D(a, b, c, e, g, m, t, n, q);
          else if (q) {
            var v = Od(n);
            Y.texSubImage2D(
              a,
              b,
              c,
              e,
              g,
              m,
              t,
              n,
              v,
              q >> (31 - Math.clz32(v.BYTES_PER_ELEMENT))
            );
          } else Y.texSubImage2D(a, b, c, e, g, m, t, n, null);
        else
          (v = null),
            q && (v = Pd(n, t, g, m, q)),
            Y.texSubImage2D(a, b, c, e, g, m, t, n, v);
      },
      ab: function (a, b) {
        Y.uniform1f(Qd(a), b);
      },
      bb: function (a, b, c) {
        if (2 <= B.version) b && Y.uniform1fv(Qd(a), R, c >> 2, b);
        else {
          if (288 >= b)
            for (var e = Rd[b - 1], g = 0; g < b; ++g)
              e[g] = R[(c + 4 * g) >> 2];
          else e = R.subarray(c >> 2, (c + 4 * b) >> 2);
          Y.uniform1fv(Qd(a), e);
        }
      },
      Q: function (a, b) {
        Y.uniform1i(Qd(a), b);
      },
      R: function (a, b, c) {
        if (2 <= B.version) b && Y.uniform1iv(Qd(a), P, c >> 2, b);
        else {
          if (288 >= b)
            for (var e = Sd[b - 1], g = 0; g < b; ++g)
              e[g] = P[(c + 4 * g) >> 2];
          else e = P.subarray(c >> 2, (c + 4 * b) >> 2);
          Y.uniform1iv(Qd(a), e);
        }
      },
      S: function (a, b, c) {
        Y.uniform2f(Qd(a), b, c);
      },
      T: function (a, b, c) {
        if (2 <= B.version) b && Y.uniform2fv(Qd(a), R, c >> 2, 2 * b);
        else {
          if (144 >= b)
            for (var e = Rd[2 * b - 1], g = 0; g < 2 * b; g += 2)
              (e[g] = R[(c + 4 * g) >> 2]),
                (e[g + 1] = R[(c + (4 * g + 4)) >> 2]);
          else e = R.subarray(c >> 2, (c + 8 * b) >> 2);
          Y.uniform2fv(Qd(a), e);
        }
      },
      Kc: function (a, b, c) {
        Y.uniform2i(Qd(a), b, c);
      },
      Jc: function (a, b, c) {
        if (2 <= B.version) b && Y.uniform2iv(Qd(a), P, c >> 2, 2 * b);
        else {
          if (144 >= b)
            for (var e = Sd[2 * b - 1], g = 0; g < 2 * b; g += 2)
              (e[g] = P[(c + 4 * g) >> 2]),
                (e[g + 1] = P[(c + (4 * g + 4)) >> 2]);
          else e = P.subarray(c >> 2, (c + 8 * b) >> 2);
          Y.uniform2iv(Qd(a), e);
        }
      },
      Ic: function (a, b, c, e) {
        Y.uniform3f(Qd(a), b, c, e);
      },
      Hc: function (a, b, c) {
        if (2 <= B.version) b && Y.uniform3fv(Qd(a), R, c >> 2, 3 * b);
        else {
          if (96 >= b)
            for (var e = Rd[3 * b - 1], g = 0; g < 3 * b; g += 3)
              (e[g] = R[(c + 4 * g) >> 2]),
                (e[g + 1] = R[(c + (4 * g + 4)) >> 2]),
                (e[g + 2] = R[(c + (4 * g + 8)) >> 2]);
          else e = R.subarray(c >> 2, (c + 12 * b) >> 2);
          Y.uniform3fv(Qd(a), e);
        }
      },
      Gc: function (a, b, c, e) {
        Y.uniform3i(Qd(a), b, c, e);
      },
      Fc: function (a, b, c) {
        if (2 <= B.version) b && Y.uniform3iv(Qd(a), P, c >> 2, 3 * b);
        else {
          if (96 >= b)
            for (var e = Sd[3 * b - 1], g = 0; g < 3 * b; g += 3)
              (e[g] = P[(c + 4 * g) >> 2]),
                (e[g + 1] = P[(c + (4 * g + 4)) >> 2]),
                (e[g + 2] = P[(c + (4 * g + 8)) >> 2]);
          else e = P.subarray(c >> 2, (c + 12 * b) >> 2);
          Y.uniform3iv(Qd(a), e);
        }
      },
      Ec: function (a, b, c, e, g) {
        Y.uniform4f(Qd(a), b, c, e, g);
      },
      Dc: function (a, b, c) {
        if (2 <= B.version) b && Y.uniform4fv(Qd(a), R, c >> 2, 4 * b);
        else {
          if (72 >= b) {
            var e = Rd[4 * b - 1],
              g = R;
            c >>= 2;
            for (var m = 0; m < 4 * b; m += 4) {
              var t = c + m;
              e[m] = g[t];
              e[m + 1] = g[t + 1];
              e[m + 2] = g[t + 2];
              e[m + 3] = g[t + 3];
            }
          } else e = R.subarray(c >> 2, (c + 16 * b) >> 2);
          Y.uniform4fv(Qd(a), e);
        }
      },
      rc: function (a, b, c, e, g) {
        Y.uniform4i(Qd(a), b, c, e, g);
      },
      sc: function (a, b, c) {
        if (2 <= B.version) b && Y.uniform4iv(Qd(a), P, c >> 2, 4 * b);
        else {
          if (72 >= b)
            for (var e = Sd[4 * b - 1], g = 0; g < 4 * b; g += 4)
              (e[g] = P[(c + 4 * g) >> 2]),
                (e[g + 1] = P[(c + (4 * g + 4)) >> 2]),
                (e[g + 2] = P[(c + (4 * g + 8)) >> 2]),
                (e[g + 3] = P[(c + (4 * g + 12)) >> 2]);
          else e = P.subarray(c >> 2, (c + 16 * b) >> 2);
          Y.uniform4iv(Qd(a), e);
        }
      },
      tc: function (a, b, c, e) {
        if (2 <= B.version)
          b && Y.uniformMatrix2fv(Qd(a), !!c, R, e >> 2, 4 * b);
        else {
          if (72 >= b)
            for (var g = Rd[4 * b - 1], m = 0; m < 4 * b; m += 4)
              (g[m] = R[(e + 4 * m) >> 2]),
                (g[m + 1] = R[(e + (4 * m + 4)) >> 2]),
                (g[m + 2] = R[(e + (4 * m + 8)) >> 2]),
                (g[m + 3] = R[(e + (4 * m + 12)) >> 2]);
          else g = R.subarray(e >> 2, (e + 16 * b) >> 2);
          Y.uniformMatrix2fv(Qd(a), !!c, g);
        }
      },
      uc: function (a, b, c, e) {
        if (2 <= B.version)
          b && Y.uniformMatrix3fv(Qd(a), !!c, R, e >> 2, 9 * b);
        else {
          if (32 >= b)
            for (var g = Rd[9 * b - 1], m = 0; m < 9 * b; m += 9)
              (g[m] = R[(e + 4 * m) >> 2]),
                (g[m + 1] = R[(e + (4 * m + 4)) >> 2]),
                (g[m + 2] = R[(e + (4 * m + 8)) >> 2]),
                (g[m + 3] = R[(e + (4 * m + 12)) >> 2]),
                (g[m + 4] = R[(e + (4 * m + 16)) >> 2]),
                (g[m + 5] = R[(e + (4 * m + 20)) >> 2]),
                (g[m + 6] = R[(e + (4 * m + 24)) >> 2]),
                (g[m + 7] = R[(e + (4 * m + 28)) >> 2]),
                (g[m + 8] = R[(e + (4 * m + 32)) >> 2]);
          else g = R.subarray(e >> 2, (e + 36 * b) >> 2);
          Y.uniformMatrix3fv(Qd(a), !!c, g);
        }
      },
      vc: function (a, b, c, e) {
        if (2 <= B.version)
          b && Y.uniformMatrix4fv(Qd(a), !!c, R, e >> 2, 16 * b);
        else {
          if (18 >= b) {
            var g = Rd[16 * b - 1],
              m = R;
            e >>= 2;
            for (var t = 0; t < 16 * b; t += 16) {
              var n = e + t;
              g[t] = m[n];
              g[t + 1] = m[n + 1];
              g[t + 2] = m[n + 2];
              g[t + 3] = m[n + 3];
              g[t + 4] = m[n + 4];
              g[t + 5] = m[n + 5];
              g[t + 6] = m[n + 6];
              g[t + 7] = m[n + 7];
              g[t + 8] = m[n + 8];
              g[t + 9] = m[n + 9];
              g[t + 10] = m[n + 10];
              g[t + 11] = m[n + 11];
              g[t + 12] = m[n + 12];
              g[t + 13] = m[n + 13];
              g[t + 14] = m[n + 14];
              g[t + 15] = m[n + 15];
            }
          } else g = R.subarray(e >> 2, (e + 64 * b) >> 2);
          Y.uniformMatrix4fv(Qd(a), !!c, g);
        }
      },
      wc: function (a) {
        a = kd[a];
        Y.useProgram(a);
        Y.jf = a;
      },
      xc: function (a, b) {
        Y.vertexAttrib1f(a, b);
      },
      yc: function (a, b) {
        Y.vertexAttrib2f(a, R[b >> 2], R[(b + 4) >> 2]);
      },
      zc: function (a, b) {
        Y.vertexAttrib3f(a, R[b >> 2], R[(b + 4) >> 2], R[(b + 8) >> 2]);
      },
      Ac: function (a, b) {
        Y.vertexAttrib4f(
          a,
          R[b >> 2],
          R[(b + 4) >> 2],
          R[(b + 8) >> 2],
          R[(b + 12) >> 2]
        );
      },
      bc: function (a, b) {
        Y.vertexAttribDivisor(a, b);
      },
      cc: function (a, b, c, e, g) {
        Y.vertexAttribIPointer(a, b, c, e, g);
      },
      Bc: function (a, b, c, e, g, m) {
        Y.vertexAttribPointer(a, b, c, !!e, g, m);
      },
      Cc: function (a, b, c, e) {
        Y.viewport(a, b, c, e);
      },
      ib: function (a, b, c, e) {
        Y.waitSync(qd[a], b, (c >>> 0) + 4294967296 * e);
      },
      j: ce,
      m: de,
      g: ee,
      wb: fe,
      M: ge,
      yb: he,
      x: ie,
      v: je,
      q: ke,
      p: le,
      xb: me,
      zb: ne,
      kb: (a, b, c, e) => Xd(a, b, c, e),
    };
    (function () {
      function a(c) {
        Oa = c = c.exports;
        Na = Oa.Lc;
        Wa();
        Xa = Oa.Nc;
        $a.unshift(Oa.Mc);
        eb--;
        w.monitorRunDependencies && w.monitorRunDependencies(eb);
        if (0 == eb && (null !== fb && (clearInterval(fb), (fb = null)), gb)) {
          var e = gb;
          gb = null;
          e();
        }
        return c;
      }
      var b = { a: oe };
      eb++;
      w.monitorRunDependencies && w.monitorRunDependencies(eb);
      if (w.instantiateWasm)
        try {
          return w.instantiateWasm(b, a);
        } catch (c) {
          Ia("Module.instantiateWasm callback failed with error: " + c), ba(c);
        }
      rb(b, function (c) {
        a(c.instance);
      }).catch(ba);
      return {};
    })();
    var vc = (w._free = (a) => (vc = w._free = Oa.Oc)(a)),
      Ld = (w._malloc = (a) => (Ld = w._malloc = Oa.Pc)(a)),
      uc = (a) => (uc = Oa.Qc)(a);
    w.__embind_initialize_bindings = () =>
      (w.__embind_initialize_bindings = Oa.Rc)();
    var pe = (a, b) => (pe = Oa.Sc)(a, b),
      qe = () => (qe = Oa.Tc)(),
      re = (a) => (re = Oa.Uc)(a);
    w.dynCall_viji = (a, b, c, e, g) => (w.dynCall_viji = Oa.Vc)(a, b, c, e, g);
    w.dynCall_vijiii = (a, b, c, e, g, m, t) =>
      (w.dynCall_vijiii = Oa.Wc)(a, b, c, e, g, m, t);
    w.dynCall_viiiiij = (a, b, c, e, g, m, t, n) =>
      (w.dynCall_viiiiij = Oa.Xc)(a, b, c, e, g, m, t, n);
    w.dynCall_jii = (a, b, c) => (w.dynCall_jii = Oa.Yc)(a, b, c);
    w.dynCall_vij = (a, b, c, e) => (w.dynCall_vij = Oa.Zc)(a, b, c, e);
    w.dynCall_iiij = (a, b, c, e, g) => (w.dynCall_iiij = Oa._c)(a, b, c, e, g);
    w.dynCall_iiiij = (a, b, c, e, g, m) =>
      (w.dynCall_iiiij = Oa.$c)(a, b, c, e, g, m);
    w.dynCall_viij = (a, b, c, e, g) => (w.dynCall_viij = Oa.ad)(a, b, c, e, g);
    w.dynCall_viiij = (a, b, c, e, g, m) =>
      (w.dynCall_viiij = Oa.bd)(a, b, c, e, g, m);
    w.dynCall_jiiiiji = (a, b, c, e, g, m, t, n) =>
      (w.dynCall_jiiiiji = Oa.cd)(a, b, c, e, g, m, t, n);
    w.dynCall_jiiiiii = (a, b, c, e, g, m, t) =>
      (w.dynCall_jiiiiii = Oa.dd)(a, b, c, e, g, m, t);
    w.dynCall_ji = (a, b) => (w.dynCall_ji = Oa.ed)(a, b);
    w.dynCall_iijj = (a, b, c, e, g, m) =>
      (w.dynCall_iijj = Oa.fd)(a, b, c, e, g, m);
    w.dynCall_jiji = (a, b, c, e, g) => (w.dynCall_jiji = Oa.gd)(a, b, c, e, g);
    w.dynCall_viijii = (a, b, c, e, g, m, t) =>
      (w.dynCall_viijii = Oa.hd)(a, b, c, e, g, m, t);
    w.dynCall_iiiiij = (a, b, c, e, g, m, t) =>
      (w.dynCall_iiiiij = Oa.id)(a, b, c, e, g, m, t);
    w.dynCall_iiiiijj = (a, b, c, e, g, m, t, n, q) =>
      (w.dynCall_iiiiijj = Oa.jd)(a, b, c, e, g, m, t, n, q);
    w.dynCall_iiiiiijj = (a, b, c, e, g, m, t, n, q, v) =>
      (w.dynCall_iiiiiijj = Oa.kd)(a, b, c, e, g, m, t, n, q, v);
    function ce(a, b) {
      var c = qe();
      try {
        return Xa.get(a)(b);
      } catch (e) {
        re(c);
        if (e !== e + 0) throw e;
        pe(1, 0);
      }
    }
    function de(a, b, c) {
      var e = qe();
      try {
        return Xa.get(a)(b, c);
      } catch (g) {
        re(e);
        if (g !== g + 0) throw g;
        pe(1, 0);
      }
    }
    function ee(a, b, c, e) {
      var g = qe();
      try {
        return Xa.get(a)(b, c, e);
      } catch (m) {
        re(g);
        if (m !== m + 0) throw m;
        pe(1, 0);
      }
    }
    function ie(a, b) {
      var c = qe();
      try {
        Xa.get(a)(b);
      } catch (e) {
        re(c);
        if (e !== e + 0) throw e;
        pe(1, 0);
      }
    }
    function ke(a, b, c, e) {
      var g = qe();
      try {
        Xa.get(a)(b, c, e);
      } catch (m) {
        re(g);
        if (m !== m + 0) throw m;
        pe(1, 0);
      }
    }
    function je(a, b, c) {
      var e = qe();
      try {
        Xa.get(a)(b, c);
      } catch (g) {
        re(e);
        if (g !== g + 0) throw g;
        pe(1, 0);
      }
    }
    function ne(a, b, c, e, g, m, t, n) {
      var q = qe();
      try {
        Xa.get(a)(b, c, e, g, m, t, n);
      } catch (v) {
        re(q);
        if (v !== v + 0) throw v;
        pe(1, 0);
      }
    }
    function ge(a, b, c, e, g, m) {
      var t = qe();
      try {
        return Xa.get(a)(b, c, e, g, m);
      } catch (n) {
        re(t);
        if (n !== n + 0) throw n;
        pe(1, 0);
      }
    }
    function le(a, b, c, e, g) {
      var m = qe();
      try {
        Xa.get(a)(b, c, e, g);
      } catch (t) {
        re(m);
        if (t !== t + 0) throw t;
        pe(1, 0);
      }
    }
    function he(a, b, c, e, g, m, t) {
      var n = qe();
      try {
        return Xa.get(a)(b, c, e, g, m, t);
      } catch (q) {
        re(n);
        if (q !== q + 0) throw q;
        pe(1, 0);
      }
    }
    function me(a, b, c, e, g, m) {
      var t = qe();
      try {
        Xa.get(a)(b, c, e, g, m);
      } catch (n) {
        re(t);
        if (n !== n + 0) throw n;
        pe(1, 0);
      }
    }
    function fe(a, b, c, e, g) {
      var m = qe();
      try {
        return Xa.get(a)(b, c, e, g);
      } catch (t) {
        re(m);
        if (t !== t + 0) throw t;
        pe(1, 0);
      }
    }
    var se;
    gb = function te() {
      se || ue();
      se || (gb = te);
    };
    function ue() {
      function a() {
        if (!se && ((se = !0), (w.calledRun = !0), !Pa)) {
          tb($a);
          aa(w);
          if (w.onRuntimeInitialized) w.onRuntimeInitialized();
          if (w.postRun)
            for (
              "function" == typeof w.postRun && (w.postRun = [w.postRun]);
              w.postRun.length;

            ) {
              var b = w.postRun.shift();
              cb.unshift(b);
            }
          tb(cb);
        }
      }
      if (!(0 < eb)) {
        if (w.preRun)
          for (
            "function" == typeof w.preRun && (w.preRun = [w.preRun]);
            w.preRun.length;

          )
            db();
        tb(Za);
        0 < eb ||
          (w.setStatus
            ? (w.setStatus("Running..."),
              setTimeout(function () {
                setTimeout(function () {
                  w.setStatus("");
                }, 1);
                a();
              }, 1))
            : a());
      }
    }
    if (w.preInit)
      for (
        "function" == typeof w.preInit && (w.preInit = [w.preInit]);
        0 < w.preInit.length;

      )
        w.preInit.pop()();
    ue();

    return moduleArg.ready;
  };
})();
if (typeof exports === "object" && typeof module === "object")
  module.exports = CanvasKitInit;
else if (typeof define === "function" && define["amd"])
  define([], () => CanvasKitInit);

if (typeof exports === "object" && typeof module === "object")
  module.exports = {
    CanvasKitInit,
    GLVersion,
  };
else if (typeof define === "function" && define["amd"])
  define([], () => {
    CanvasKitInit, GLVersion;
  });
