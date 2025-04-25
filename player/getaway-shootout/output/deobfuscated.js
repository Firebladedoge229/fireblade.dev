/*! For license information please see bundle.js.LICENSE.txt */
(() => {
  var e = {
    63: (e, t) => {
      "use strict";

      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.getContainerInfo = undefined;
      t.getContainerInfo = async function (e) {
        const t = document.getElementById(e);
        if (t) {
          return async function (e) {
            return new Promise(t => {
              const n = new IntersectionObserver(([r]) => {
                const i = window.getComputedStyle(e);
                const o = r.intersectionRatio > 0.95;
                t({
                  visibleState: o ? "visible" : "notVisible",
                  size: {
                    width: Math.ceil(i.width !== "auto" ? parseFloat(i.width) : r.boundingClientRect.width),
                    height: Math.ceil(i.height !== "auto" ? parseFloat(i.height) : r.boundingClientRect.height)
                  }
                });
                n.disconnect();
              });
              n.observe(e);
            });
          }(t);
        } else {
          return {
            visibleState: "notCreated",
            size: {
              width: 0,
              height: 0
            }
          };
        }
      };
    },
    65: (e, t, n) => {
      "use strict";

      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.OverlayBanner = undefined;
      const r = n(918);
      t.OverlayBanner = class {
        constructor(e, t, n, i) {
          this.bannerRequest = e;
          this.onWindowResize = () => {
            this.setContainerPosition();
          };
          this.containerElement = document.createElement("div");
          this.containerId = "overlay-banner-" + e.id;
          this.containerElement.id = this.containerId;
          this.bannerRequest = e;
          this.containerElement.style.position = "absolute";
          this.containerElement.style.transformOrigin = "top left";
          this.containerElement.style.userSelect = "none";
          const o = document.getElementById("gfMainContainer");
          if (o) {
            o.appendChild(this.containerElement);
          } else {
            document.body.appendChild(this.containerElement);
          }
          const s = e.size.split("x");
          this.onScreenSize = {
            width: parseInt(s[0]),
            height: parseInt(s[1])
          };
          this.bannerModule = n;
          this.callback = i;
          this.disableBannerCheck = t;
          this.debouncedWindowResize = (0, r.debounce)(this.onWindowResize, 200);
          window.addEventListener("resize", this.debouncedWindowResize);
          this.renderBanner();
        }
        isVisible() {
          const e = this.computeOverlay();
          if (this.disableBannerCheck) {
            return true;
          }
          const t = e.left + e.width * e.scale;
          const n = e.top + e.height * e.scale;
          const r = this.getGameContainerDimensions();
          return !(e.top < -4) && !(e.left < -4) && !(t > window.innerWidth + 4) && !(n > r.height + 4);
        }
        computeOverlay() {
          const e = this.getScale();
          const t = this.getOnScreenPosition();
          return {
            width: this.onScreenSize.width,
            height: this.onScreenSize.height,
            top: t.y,
            left: t.x,
            scale: e
          };
        }
        getGameContainerDimensions() {
          const e = document.getElementById("game-container");
          if (e) {
            return {
              width: e.clientWidth,
              height: e.clientHeight
            };
          } else {
            return {
              width: window.innerWidth,
              height: window.innerHeight
            };
          }
        }
        getScale() {
          return this.getGameContainerDimensions().width / 922;
        }
        getOnScreenPosition() {
          const e = this.getGameContainerDimensions();
          const t = this.bannerRequest.anchor.x * e.width;
          const n = (1 - this.bannerRequest.anchor.y) * e.height;
          const r = this.getScale();
          const i = this.onScreenSize;
          const o = i.width * r;
          const s = i.height * r;
          const a = this.bannerRequest.pivot || {
            x: 0.5,
            y: 0.5
          };
          return {
            x: t + this.bannerRequest.position.x * r - o * a.x,
            y: n - this.bannerRequest.position.y * r - s * (1 - a.y)
          };
        }
        setContainerPosition() {
          const e = this.computeOverlay();
          this.containerElement.style.width = `${e.width}px`;
          this.containerElement.style.height = `${e.height}px`;
          this.containerElement.style.top = `${e.top}px`;
          this.containerElement.style.left = `${e.left}px`;
          this.containerElement.style.transform = `scale(${e.scale})`;
          this.containerElement.style.display = "block";
        }
        async renderBanner() {
          this.setContainerPosition();
          if (!this.isVisible()) {
            this.callback(this.bannerRequest.id, "bannerError", "bannerNotEntirelyVisible");
            this.containerElement.style.display = "none";
            return;
          }
          try {
            await this.bannerModule.requestBanner({
              id: this.containerId,
              ...this.onScreenSize
            });
            this.callback(this.bannerRequest.id, "bannerRendered");
          } catch (e) {
            this.callback(this.bannerRequest.id, "bannerError", `${e}`);
          }
        }
        destroy() {
          if (this.containerElement) {
            this.containerElement.remove();
          }
          window.removeEventListener("resize", this.debouncedWindowResize);
        }
      };
    },
    67: function (e, t, n) {
      "use strict";

      var r = this && this.__importDefault || function (e) {
        if (e && e.__esModule) {
          return e;
        } else {
          return {
            default: e
          };
        }
      };
      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.checkIsCrazyGames = t.checkIsLocalhost = t.fetchSdkUser = t.initSdk = t.GF_WINDOW = undefined;
      const i = n(342);
      const o = n(726);
      const s = r(n(922));
      const a = n(557);
      const u = n(561);
      const l = new s.default("user");
      const c = new s.default("none");
      t.GF_WINDOW = null;
      t.initSdk = function (e) {
        return new Promise(n => {
          const r = window.setTimeout(() => {
            window.removeEventListener("message", i, false);
            (0, a.sendErrorToGf)("gf-init-response-timeout", null, {
              timeoutMs: 5000
            });
            c.error("Gf Init response timeout 5000ms");
            n(null);
          }, 5000);
          const i = async e => {
            if (e.data.type === "initialized") {
              c.verbose("Received init from GF", e.data);
              window.clearTimeout(r);
              window.removeEventListener("message", i, false);
              const t = e.data.data;
              n(t);
            }
          };
          window.addEventListener("message", i, false);
          t.GF_WINDOW.postMessage({
            type: "init-js-sdk",
            data: {
              version: o.SDK_VERSION,
              sdkType: "js",
              ...e
            }
          }, "*");
        });
      };
      t.fetchSdkUser = function () {
        return new Promise(e => {
          const t = window.setTimeout(() => {
            window.removeEventListener("message", n, false);
            (0, a.sendErrorToGf)("gf-user-response-timeout", null, {
              timeoutMs: 5000
            });
            c.error("Gf user response timeout 5000ms, continuing with \"null\" (signed out) user");
            e(null);
          }, 5000);
          const n = async r => {
            if (!(0, i.isGfToSdkEvent)(r.data)) {
              return;
            }
            const s = r.data;
            if (s.type === "initialUserSet") {
              l.verbose("Received initial user from GF", s);
              window.clearTimeout(t);
              window.removeEventListener("message", n, false);
              const r = s.data.user ?? null;
              e(r);
            }
          };
          window.addEventListener("message", n, false);
        });
      };
      t.checkIsLocalhost = async function () {
        if (["http://localhost:4000/gameframe-unity56-standalone/", "http://localhost:4000/gameframe-unity56/", "http://localhost:4000/gameframe-standalone/", "http://localhost:4000/gameframe/"].some(e => window.location.href.startsWith(e))) {
          return false;
        }
        const e = ["localhost", "127.0.0.1", "preview.construct.net"].includes(window.location.hostname) || (0, a.getQueryStringValue)("useLocalSdk") === "true";
        if (e) {
          await (0, u.wait)(500);
        }
        return e;
      };
      t.checkIsCrazyGames = async function () {
        let e;
        let n = false;
        const r = new Promise(t => {
          e = t;
        });
        const i = r => {
          if ((r == null ? undefined : r.data)?.type === "crazyGamesGFConfirmation") {
            t.GF_WINDOW = r.source;
            n = true;
            e();
          }
        };
        const o = new Promise(async e => {
          await (0, u.wait)(3000);
          e();
        });
        window.addEventListener("message", i, false);
        const s = {
          type: "checkCrazyGamesGF"
        };
        window.postMessage(s, "*");
        window.parent.postMessage(s, "*");
        window.parent.parent.postMessage(s, "*");
        window.parent.parent.parent.postMessage(s, "*");
        await Promise.race([r, o]);
        window.removeEventListener("message", i);
        return {
          isOnCrazyGames: n
        };
      };
    },
    88: function (e, t, n) {
      "use strict";

      var r = this && this.__importDefault || function (e) {
        if (e && e.__esModule) {
          return e;
        } else {
          return {
            default: e
          };
        }
      };
      Object.defineProperty(t, "__esModule", {
        value: true
      });
      const i = n(557);
      const o = r(n(922));
      const s = n(684);
      const a = {
        adFinished: () => {},
        adError: () => {},
        adStarted: () => {}
      };
      t.default = class {
        constructor(e) {
          this.sdk = e;
          this.adCallbacks = a;
          this.requestInProgress = false;
          this.adblockDetectionResolvers = [];
          this.logger = new o.default("ad");
          this.adPlaying = false;
          this.adblockDetectionTimeout = window.setTimeout(() => {
            this.logger.log("Adblock timeout executed since there wasn't an adblock event in 5000ms");
            this.setAdblockDetectionResult(false);
          }, 5000);
        }
        prefetchAd(e) {
          this.logger.log(`Prefetching ${e} ad`);
          this.sdk.postMessage("prefetchAd", {
            adType: e
          });
        }
        async requestAd(e, t) {
          this.logger.log(`Requesting ${e} ad`);
          this.adCallbacks = {
            adFinished: (t == null ? undefined : t.adFinished) || a.adFinished,
            adError: (t == null ? undefined : t.adError) || (t == null ? undefined : t.adFinished) || a.adFinished,
            adStarted: (t == null ? undefined : t.adStarted) || a.adStarted
          };
          if (this.requestInProgress) {
            this.logger.log("Ad already requested");
            const e = new s.AdError("other", "An ad request is already in progress");
            return (0, i.wrapUserFn)(this.adCallbacks.adError)(e);
          }
          this.requestInProgress = true;
          this.sdk.postMessage("requestAd", {
            adType: e
          });
        }
        async hasAdblock() {
          if (this.adblockDetectionResult !== undefined) {
            return this.adblockDetectionResult;
          } else {
            this.sdk.postMessage("hasAdblock", {});
            this.logger.log("Requesting adblock status");
            return new Promise(e => {
              this.adblockDetectionResolvers.push(e);
            });
          }
        }
        handleEvent(e) {
          switch (e.type) {
            case "adblockDetectionExecuted":
              return this.handleAdBlockDetectionExecutedEvent(e);
            case "adError":
              this.requestInProgress = false;
              const r = new s.AdError(e.error?.reason || "other", e.error?.message || "Unknown message");
              this.adPlaying = false;
              return (0, i.wrapUserFn)(this.adCallbacks.adError)(r);
            case "adFinished":
              this.adPlaying = false;
              this.requestInProgress = false;
              return (0, i.wrapUserFn)(this.adCallbacks.adFinished)();
            case "adStarted":
              this.adPlaying = true;
              if (this.sdk.banner.activeBannersCount > 0) {
                this.sdk.banner.clearAllBanners();
              }
              return (0, i.wrapUserFn)(this.adCallbacks.adStarted)();
          }
        }
        handleAdBlockDetectionExecutedEvent(e) {
          const {
            hasAdblock: t
          } = e;
          const n = !!t;
          if (this.adblockDetectionResult !== undefined) {
            this.logger.log(`Received update for adblock state: (${n}).`);
            this.adblockDetectionResult = n;
            return;
          }
          this.setAdblockDetectionResult(n);
          clearTimeout(this.adblockDetectionTimeout);
        }
        setAdblockDetectionResult(e) {
          this.adblockDetectionResult = e;
          this.adblockDetectionResolvers.forEach(t => t(e));
          this.adblockDetectionResolvers = [];
        }
        get isAdPlaying() {
          return this.adPlaying;
        }
      };
    },
    100: (e, t) => {
      "use strict";

      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.stringifyError = function (e, t = {}) {
        let n = "";
        const {
          includeStack: r = false
        } = t;
        if (e instanceof Error) {
          n = r && e.stack || e.message;
        } else {
          try {
            n = e.toString();
          } catch {
            n = "an error occured";
          }
        }
        return n;
      };
    },
    115: function (e, t, n) {
      "use strict";

      var r = this && this.__importDefault || function (e) {
        if (e && e.__esModule) {
          return e;
        } else {
          return {
            default: e
          };
        }
      };
      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.generateCloudCacheLsGameDataKey = t.CloudDataHandler = undefined;
      const i = r(n(922));
      const o = n(951);
      const s = n(583);
      function a(e) {
        return `SDK_DATA_CLOUD_CACHE_${e}`;
      }
      t.CloudDataHandler = class {
        constructor(e, t, n) {
          this.sdk = e;
          this.doNotSync = t;
          this.data = n;
          this.logger = new i.default("data");
          this.cacheLsKey = a(e.game.id);
          this.logger.log("Cloud data handler initialized. " + (this.doNotSync ? "Data will not be synced due to failed cloud load." : ""));
          this.logger.verbose("With this initial data: ", n);
        }
        clear() {
          this.data = {};
          this.saveData();
        }
        getItem(e) {
          return this.data[e] || null;
        }
        removeItem(e) {
          delete this.data[e];
          this.saveData();
        }
        setItem(e, t) {
          this.data[e] = `${t}`;
          this.saveData();
        }
        saveData() {
          const e = JSON.stringify(this.data);
          (0, o.checkDataLimits)(e);
          if (!this.doNotSync) {
            this.sdk.postMessage("saveSdkGameData", {
              jsonData: e
            });
          }
          const t = {
            data: this.data,
            metadata: {
              date: new Date()
            }
          };
          s.SafeLocalStorage.Instance.setItem(this.cacheLsKey, JSON.stringify(t));
        }
      };
      t.generateCloudCacheLsGameDataKey = a;
    },
    159: (e, t) => {
      "use strict";

      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.generateInviteLink = undefined;
      t.generateInviteLink = function (e, t) {
        if (!t) {
          return "An error happened when generating invite link";
        }
        const n = new URL(t);
        const r = n.searchParams;
        r.set("czy_invite", "true");
        r.set("utm_source", "invite");
        Object.keys(e).forEach(t => {
          r.set(t, e[t]);
        });
        return n.toString();
      };
    },
    223: (e, t) => {
      "use strict";

      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.ch = undefined;
      t.ch = function (e) {
        const t = JSON.parse(JSON.stringify(e));
        const n = Object.keys(t).filter(e => t[e] !== undefined && t[e] !== null).sort();
        let r = "";
        for (const e of n) {
          r += e + "_" + JSON.stringify(t[e]) + "_";
        }
        return function (e) {
          let t = 0;
          if (e.length === 0) {
            return t;
          }
          for (let n = 0; n < e.length; n++) {
            t = (t << 5) - t + e.charCodeAt(n);
            t |= 0;
          }
          return t;
        }(r);
      };
    },
    250: function (e, t, n) {
      "use strict";

      var r = this && this.__importDefault || function (e) {
        if (e && e.__esModule) {
          return e;
        } else {
          return {
            default: e
          };
        }
      };
      Object.defineProperty(t, "__esModule", {
        value: true
      });
      const i = n(557);
      const o = r(n(345));
      window.CrazyGames = {
        SDK: new o.default()
      };
      (0, i.addStyle)("\n.crazygames-banner-container {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n}\n");
    },
    307: (e, t) => {
      "use strict";

      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.GeneralError = t.INIT_STATE = t.SDKError = t.DOCS_URL = undefined;
      t.DOCS_URL = "docs.crazygames.com";
      class n extends Error {}
      var r;
      t.SDKError = n;
      (r = t.INIT_STATE ||= {})[r.UNINITIALIZED = 0] = "UNINITIALIZED";
      r[r.REQUESTED = 1] = "REQUESTED";
      r[r.INITIALIZED = 2] = "INITIALIZED";
      t.GeneralError = class {
        constructor(e, t) {
          this.code = e;
          this.message = t;
        }
      };
    },
    325: function (e, t, n) {
      "use strict";

      var r = this && this.__importDefault || function (e) {
        if (e && e.__esModule) {
          return e;
        } else {
          return {
            default: e
          };
        }
      };
      Object.defineProperty(t, "__esModule", {
        value: true
      });
      const i = n(307);
      const o = r(n(922));
      const s = n(115);
      const a = r(n(742));
      const u = n(409);
      const l = n(553);
      t.default = class {
        constructor(e, t) {
          this.sdk = e;
          this.logger = new o.default("data");
          this.alreadySent = [];
          if (t.handler === "local") {
            this.dataHandler = new l.LocalDataHandler(t.data, e.game.id);
          } else if (t.handler === "cloud") {
            this.dataHandler = new s.CloudDataHandler(e, !!t.doNotSync, t.data);
          } else {
            if (t.handler !== "disabled") {
              throw new i.GeneralError("unexpectedError", `Unknown data handler ${t.handler}`);
            }
            this.dataHandler = new u.DisabledDataHandler();
          }
        }
        clear() {
          this.dataHandler.clear();
          this.logger.log("Clear data");
          this.sdk.postMessage("useDataModule", {
            action: "clear"
          });
        }
        getItem(e) {
          const t = this.dataHandler.getItem(e);
          this.logger.log(`Get "${e}", returning ${t}`);
          this.debugEvent("getItem", e);
          this.sdk.postMessage("useDataModule", {
            action: "getItem"
          });
          return t;
        }
        removeItem(e) {
          this.dataHandler.removeItem(e);
          this.logger.log(`Remove "${e}"`);
          this.sdk.postMessage("useDataModule", {
            action: "removeItem"
          });
          this.debugEvent("removeItem", e);
        }
        setItem(e, t) {
          this.dataHandler.setItem(e, t);
          this.logger.log(`Set "${e}" = ${t}`);
          this.sdk.postMessage("useDataModule", {
            action: "setItem"
          });
          this.debugEvent("setItem", e, t);
        }
        syncUnityGameData() {
          this.logger.log("Requesting to sync unity game data");
          this.sdk.postMessage("syncUnityGameData", {});
        }
        debugEvent(e, t, n) {
          const r = `${e}-${t}`;
          if (!this.alreadySent.includes(r)) {
            this.alreadySent.push(r);
            a.default.getInstance().sendDebugEvent("dataEventWithoutSDKPS", {
              method: e,
              key: t,
              value: n
            }, e => !!e.dataModule && e.dataModule.apsStorageType !== "sdk");
          }
        }
      };
    },
    326: function (e, t, n) {
      "use strict";

      var r = this && this.__importDefault || function (e) {
        if (e && e.__esModule) {
          return e;
        } else {
          return {
            default: e
          };
        }
      };
      Object.defineProperty(t, "__esModule", {
        value: true
      });
      const i = r(n(922));
      const o = n(790);
      const s = n(529);
      const a = n(896);
      t.default = class {
        constructor(e, t, n, r) {
          this.sdk = e;
          this._systemInfo = t;
          this._userAccountAvailable = n;
          this.user = null;
          this.authDeferredPromise = null;
          this.accountLinkDeferredPromise = null;
          this.authListeners = [];
          this.userTokenResolvers = [];
          this.userTokenRequestInProgress = false;
          this.xsollaUserTokenRequestInProgress = false;
          this.xsollaUserTokenResolvers = [];
          this.logger = new i.default("user");
          this.user = r;
        }
        get isUserAccountAvailable() {
          this.sdk.postMessage("isUserAccountAvailable", {});
          return !!this._userAccountAvailable;
        }
        get systemInfo() {
          this.sdk.postMessage("getSystemInfo", {});
          return this._systemInfo;
        }
        async showAuthPrompt() {
          this.logger.log("Requesting auth prompt");
          if (this.authDeferredPromise) {
            throw new o.UserError("showAuthPromptInProgress", "The auth prompt is already opened");
          }
          if (this.user) {
            throw new o.UserError("userAlreadySignedIn", "The user is already signed in");
          }
          return new Promise((e, t) => {
            this.authDeferredPromise = {
              resolve: e,
              reject: t
            };
            this.sdk.postMessage("showAuthPrompt", {});
          });
        }
        handleAuthPromptResponse(e) {
          this.logger.log("Received auth prompt response", e);
          const {
            error: t,
            user: n
          } = e;
          if (t) {
            if (this.authDeferredPromise) {
              this.authDeferredPromise.reject(new o.UserError(t.code, t.message));
            }
          } else {
            this.user = n ?? null;
            this.callAuthChangeListeners();
            if (this.authDeferredPromise) {
              this.authDeferredPromise.resolve(this.user);
            }
          }
          this.authDeferredPromise = null;
        }
        async showAccountLinkPrompt() {
          this.logger.log("Requesting link account prompt");
          if (this.accountLinkDeferredPromise) {
            throw new o.UserError("showAccountLinkPromptInProgress", "The account link prompt is already displayed");
          }
          if (!this.user) {
            throw new o.UserError("userNotAuthenticated", "The user is not signed in");
          }
          return new Promise(async (e, t) => {
            this.accountLinkDeferredPromise = {
              resolve: e,
              reject: t
            };
            this.sdk.postMessage("showAccountLinkPrompt", {});
          });
        }
        handleAccountLinkPromptResponse(e) {
          this.logger.log("Received account link prompt response", e);
          const {
            response: t
          } = e.data;
          if (this.accountLinkDeferredPromise) {
            this.accountLinkDeferredPromise.resolve({
              response: t
            });
          }
          this.accountLinkDeferredPromise = null;
        }
        async getUser() {
          this.logger.log("Requesting user object");
          this.sdk.postMessage("getUser", {});
          return this.user;
        }
        async getUserToken() {
          this.logger.log("Requesting user token");
          if (this.tokenExpiresAtMs && this.tokenExpiresAtMs < Date.now()) {
            this.logger.log("User token expired, clean it so it is requested again");
            this.userToken = null;
            this.tokenExpiresAtMs = null;
          }
          if (this.tokenExpiresAtMs && !this.userTokenRequestInProgress && this.tokenExpiresAtMs - 30000 < Date.now()) {
            this.logger.log("User token expires soon, request new one in background");
            this.requestNewUserToken();
          }
          let e = this.userToken;
          if ((0, a.isDefined)(e) && (0, s.isJsSdkRequestUserTokenSuccessResponse)(e)) {
            this.logger.log("Returning cached user token");
            return e.token;
          }
          if (this.userTokenRequestInProgress) {
            this.logger.log("User token request to portal in progress");
          } else {
            this.logger.log("No user token present in the SDK, request one");
            this.requestNewUserToken();
          }
          await new Promise(e => {
            this.userTokenResolvers.push(async () => {
              e();
            });
          });
          e = this.userToken;
          if (!(0, a.isDefined)(e)) {
            this.logger.error("User token missing after portal request finished");
            throw new o.UserError("unexpectedError", "User token missing after portal request finished");
          }
          if ((0, s.isJsSdkRequestUserTokenErrorResponse)(e)) {
            throw new o.UserError(e.error.code, e.error.message);
          }
          if (!e.token) {
            this.logger.error("User token missing, even though there isn't any error");
            throw new o.UserError("unexpectedError", "User token missing, even though there isn't any error");
          }
          return e.token;
        }
        handleUserTokenResponse(e) {
          this.logger.log("Received token response from portal", e);
          this.userToken = e;
          this.userTokenRequestInProgress = false;
          if ((0, s.isJsSdkRequestUserTokenSuccessResponse)(e)) {
            this.tokenExpiresAtMs = Date.now() + e.expiresIn * 1000;
          }
          this.userTokenResolvers.forEach(e => e());
          this.userTokenResolvers = [];
        }
        requestNewUserToken() {
          this.logger.log("Requesting user token from portal");
          this.sdk.postMessage("requestUserToken", {});
          this.userTokenRequestInProgress = true;
        }
        async getXsollaUserToken() {
          this.logger.log("Requesting Xsolla user token");
          if (this.xsollaUserTokenExpiresAtMs && this.xsollaUserTokenExpiresAtMs < Date.now()) {
            this.logger.log("Xsolla user token expired, clean it so it is requested again");
            this.xsollaUserToken = null;
            this.xsollaUserTokenExpiresAtMs = null;
          }
          if (this.xsollaUserTokenExpiresAtMs && !this.xsollaUserTokenRequestInProgress && this.xsollaUserTokenExpiresAtMs - 30000 < Date.now()) {
            this.logger.log("Xsolla user token expires soon, request new one in background");
            this.requestNewXsollaUserToken();
          }
          let e = this.xsollaUserToken;
          if ((0, a.isDefined)(e) && (0, s.isJsSdkRequestXsollaUserTokenSuccessResponse)(e)) {
            this.logger.log("Returning cached Xsolla user token");
            return e.token;
          }
          if (this.xsollaUserTokenRequestInProgress) {
            this.logger.log("Xsolla user token request to portal in progress");
          } else {
            this.logger.log("No Xsolla user token present in the SDK, request one");
            this.requestNewXsollaUserToken();
          }
          await new Promise(e => {
            this.xsollaUserTokenResolvers.push(async () => {
              e();
            });
          });
          e = this.xsollaUserToken;
          if (!(0, a.isDefined)(e)) {
            this.logger.error("Xsolla user token response missing after portal request finished");
            throw new o.UserError("unexpectedError", "Xsolla user token missing after portal request finished");
          }
          if ((0, s.isJsSdkRequestXsollaUserTokenErrorResponse)(e)) {
            throw new o.UserError(e.error.code, e.error.message);
          }
          if (!e.token) {
            this.logger.error("Xsolla user token missing, even though there isn't any error");
            throw new o.UserError("unexpectedError", "Xsolla user token missing, even though there isn't any error");
          }
          return e.token;
        }
        handleXsollaUserTokenResponse(e) {
          this.logger.log("Received Xsolla user token response from portal", e);
          this.xsollaUserToken = e;
          this.xsollaUserTokenRequestInProgress = false;
          if ((0, s.isJsSdkRequestXsollaUserTokenSuccessResponse)(e)) {
            this.xsollaUserTokenExpiresAtMs = Date.now() + e.expiresIn * 1000;
          }
          this.xsollaUserTokenResolvers.forEach(e => e());
          this.xsollaUserTokenResolvers = [];
        }
        requestNewXsollaUserToken() {
          this.logger.log("Requesting Xsolla user token from portal");
          this.sdk.postMessage("requestXsollaUserToken", {});
          this.xsollaUserTokenRequestInProgress = true;
        }
        addScore(e) {
          this.logger.log("Requesting to add score", e);
          console.warn("addScore is temporarily disabled");
        }
        addScoreEncrypted(e, t) {
          this.logger.log("Requesting to add score encrypted. Score: ", e, "Encrypted: ", t);
          if (typeof e != "number" || isNaN(e)) {
            this.logger.error("Score input must be a number");
            throw new o.UserError("invalidScoreFormat", "Score input must be a number");
          }
          if (window.location.protocol !== "https:") {
            this.logger.error("AddScore is only supported on https");
            throw new o.UserError("unexpectedError", "AddScore is only supported on https");
          }
          this.sdk.postMessage("addScore", {
            score: e,
            encryptedScore: t
          });
        }
        handleEvent(e) {
          switch (e.type) {
            case "showAuthPromptResponse":
              this.handleAuthPromptResponse(e);
              break;
            case "linkAccountResponse":
              this.handleAccountLinkPromptResponse(e);
              break;
            case "userLoggedIn":
              this.handleUserLoggedIn(e);
              break;
            case "requestUserTokenResponse":
              this.handleUserTokenResponse(e);
              break;
            case "requestXsollaUserTokenResponse":
              this.handleXsollaUserTokenResponse(e);
          }
        }
        addAuthListener(e) {
          this.sdk.postMessage("addAuthListener", {});
          this.authListeners.push(e);
        }
        removeAuthListener(e) {
          this.sdk.postMessage("removeAuthListener", {});
          this.authListeners = this.authListeners.filter(t => t !== e);
        }
        handleUserLoggedIn(e) {
          this.user = e.data.user ?? null;
          this.callAuthChangeListeners();
        }
        callAuthChangeListeners() {
          this.authListeners.forEach(e => this.callAuthChangeListener(e));
        }
        callAuthChangeListener(e) {
          try {
            e(this.user);
          } catch (e) {
            console.error(e);
          }
        }
      };
    },
    342: (e, t) => {
      "use strict";

      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.isGfToSdkEvent = undefined;
      t.isGfToSdkEvent = function (e) {
        return e.messageTarget === "sdk";
      };
    },
    345: function (e, t, n) {
      "use strict";

      var r = this && this.__createBinding || (Object.create ? function (e, t, n, r = n) {
        var i = Object.getOwnPropertyDescriptor(t, n);
        if (!i || !!("get" in i ? !t.__esModule : i.writable || i.configurable)) {
          i = {
            enumerable: true,
            get: function () {
              return t[n];
            }
          };
        }
        Object.defineProperty(e, r, i);
      } : function (e, t, n, r = n) {
        e[r] = t[n];
      });
      var i = this && this.__setModuleDefault || (Object.create ? function (e, t) {
        Object.defineProperty(e, "default", {
          enumerable: true,
          value: t
        });
      } : function (e, t) {
        e.default = t;
      });
      var o = this && this.__importStar || function (e) {
        if (e && e.__esModule) {
          return e;
        }
        var t = {};
        if (e != null) {
          for (var n in e) {
            if (n !== "default" && Object.prototype.hasOwnProperty.call(e, n)) {
              r(t, e, n);
            }
          }
        }
        i(t, e);
        return t;
      };
      var s = this && this.__importDefault || function (e) {
        if (e && e.__esModule) {
          return e;
        } else {
          return {
            default: e
          };
        }
      };
      Object.defineProperty(t, "__esModule", {
        value: true
      });
      const a = n(100);
      const u = n(877);
      const l = n(307);
      const c = o(n(922));
      const h = n(951);
      const d = n(557);
      const f = n(67);
      const g = n(726);
      const p = s(n(689));
      const v = s(n(447));
      const y = s(n(373));
      const _ = s(n(605));
      t.default = class {
        constructor() {
          this.logger = new c.default("none");
          this.sdk = new _.default();
        }
        async init(e) {
          this.initializingPromise ||= new Promise(async (t, n) => {
            this.logger.log("Request init, options: ", e);
            const [r, i] = await Promise.all([(0, f.checkIsCrazyGames)(), (0, f.checkIsLocalhost)()]);
            if (i) {
              c.default.forceEnable = true;
              this.sdk = new y.default();
            } else if (r.isOnCrazyGames) {
              if (!f.GF_WINDOW) {
                return n(new l.GeneralError("unexpectedError", "Missing GF_WINDOW, even though running on CrazyGames"));
              }
              const [t, r] = await Promise.all([(0, f.initSdk)(e), (0, f.fetchSdkUser)()]);
              if (t === null) {
                throw new l.GeneralError("initFailed", "The SDK failed to initialize");
              }
              this.logger.log("Init response received from GF", t);
              const i = await (0, h.prepareInitialGameData)(r, t);
              this.sdk = new p.default(t, i, r);
              try {
                await (0, u.loadAdsIfNeeded)(t.rafvertizingUrl, this.sdk);
              } catch (e) {
                (0, d.sendErrorToGf)("ads-script-load-fail", "ad", {
                  error: (0, a.stringifyError)(e)
                });
                this.logger.error("Failed to load ads", e);
              }
            } else {
              this.sdk = new v.default();
            }
            console.log(...c.MAIN_BADGE, "CrazyGames HTML SDK initialized", {
              version: g.SDK_VERSION,
              environment: this.sdk.environment,
              initOptions: e
            });
            t();
          });
          return this.initializingPromise;
        }
        get ad() {
          return this.sdk.ad;
        }
        get banner() {
          return this.sdk.banner;
        }
        get game() {
          return this.sdk.game;
        }
        get user() {
          return this.sdk.user;
        }
        get data() {
          return this.sdk.data;
        }
        get analytics() {
          return this.sdk.analytics;
        }
        get environment() {
          return this.sdk.environment;
        }
        get isQaTool() {
          return this.sdk.isQaTool;
        }
      };
    },
    371: function (e, t, n) {
      "use strict";

      var r = this && this.__importDefault || function (e) {
        if (e && e.__esModule) {
          return e;
        } else {
          return {
            default: e
          };
        }
      };
      Object.defineProperty(t, "__esModule", {
        value: true
      });
      const i = n(65);
      const o = n(940);
      const s = r(n(922));
      const a = n(488);
      const u = n(891);
      t.default = class {
        constructor(e, t) {
          this.sdk = e;
          this.bannerQueue = {};
          this.overlayBanners = {};
          this.renderedBannerIds = new Set();
          this.logger = new s.default("banner");
          this.useTestAds = t.useTestAds || false;
          this.disableBannerCheck = t.disableBannerCheck || false;
        }
        async requestBanner(e) {
          this.logger.log("Requesting banner with automatic rendering", e);
          this.ensureVideoAdNotPlaying(e.id);
          const t = await this.prefetchBanner(e);
          return this.renderPrefetchedBanner(t);
        }
        async requestResponsiveBanner(e) {
          this.logger.log(`Requesting responsive banner with automatic rendering #${e}`);
          this.ensureVideoAdNotPlaying(e);
          const t = await (0, a.getBannerContainer)(e, !this.disableBannerCheck);
          const {
            width: n,
            height: r
          } = t.containerInfo.size;
          const i = await this.prefetchResponsiveBanner({
            id: e,
            width: n,
            height: r
          });
          return this.renderPrefetchedBanner(i);
        }
        async prefetchBanner(e) {
          this.logger.log("Prefetch banner", e);
          const t = (0, a.ContainerIdToInnerId)(e.id);
          const n = {
            ...e,
            id: t
          };
          return new Promise((e, t) => {
            this.bannerQueue[n.id] = {
              banner: n,
              resolve: e,
              reject: t
            };
            this.sdk.postMessage("requestBanner", [{
              containerId: n.id,
              size: (0, a.getBannerSizeAsText)(n)
            }]);
          });
        }
        async prefetchResponsiveBanner(e) {
          this.logger.log(`Prefetch responsive banner #${e.id}`);
          const {
            width: t,
            height: n
          } = e;
          const r = {
            id: (0, a.ContainerIdToInnerId)(e.id),
            width: t,
            height: n,
            isResponsive: true
          };
          return new Promise((e, i) => {
            this.bannerQueue[r.id] = {
              banner: r,
              resolve: e,
              reject: i
            };
            this.sdk.postMessage("requestResponsiveBanner", [{
              id: r.id,
              width: t,
              height: n
            }]);
          });
        }
        async renderPrefetchedBanner(e) {
          this.logger.log("Rendering prefetched banner", e);
          const t = (0, a.InnerIdToContainerId)(e.id);
          this.ensureVideoAdNotPlaying(t);
          await (0, a.getBannerContainer)(t, !this.disableBannerCheck);
          this.renderedBannerIds.add(t);
          return new Promise((t, n) => {
            const {
              CrazygamesAds: r
            } = window;
            const {
              id: i,
              banner: s
            } = e;
            r.render([i], {
              ...e.options,
              banner: {
                callback: e => {
                  delete this.bannerQueue[e.code];
                  if (!e.empty) {
                    this.logger.log("Banner rendered", s, "with options", e);
                    this.sdk.postMessage("bannerProcessed", {
                      containerId: s.id,
                      width: s.width,
                      height: s.height,
                      minPrice: e.minPrice,
                      houseAd: e.houseAd,
                      empty: e.empty
                    });
                    t();
                    return;
                  }
                  if (this.useTestAds) {
                    (0, o.renderFakeBanner)(s);
                    this.logger.log("Fake banner rendered", s);
                    t();
                  } else {
                    this.logger.log("No banner available", s);
                    const t = "Sorry, no banner is available for the moment, please retry";
                    this.sdk.postMessage("bannerProcessed", {
                      containerId: s.id,
                      width: s.width,
                      height: s.height,
                      error: t,
                      minPrice: e.minPrice,
                      houseAd: e.houseAd,
                      empty: e.empty
                    });
                    n(new u.BannerError("other", t, s.id));
                  }
                }
              }
            });
          });
        }
        requestOverlayBanners(e, t) {
          const n = e.map(e => e.id);
          Object.keys(this.overlayBanners).forEach(e => {
            if (!n.includes(e)) {
              this.logger.log("Remove overlay banner " + e);
              this.overlayBanners[e].destroy();
              delete this.overlayBanners[e];
            }
          });
          e.forEach(e => {
            if (this.overlayBanners[e.id]) {
              this.logger.log("Skip overlay banner update " + e.id);
              return;
            }
            this.logger.log("Create overlay banner " + e.id);
            const n = new i.OverlayBanner(e, this.disableBannerCheck, this, t);
            this.overlayBanners[e.id] = n;
          });
        }
        handleEvent(e) {
          switch (e.type) {
            case "bannerError":
              return this.handleBannerErrorEvent(e);
            case "requestBanner":
              return this.handleRequestBannerEvent(e);
          }
        }
        handleBannerErrorEvent(e) {
          const {
            error: t,
            containerId: n
          } = e;
          this.logger.log("Banner error happened", {
            error: t,
            containerId: n
          });
          const r = this.popFromBannerQueue(n);
          if (!r) {
            return;
          }
          const {
            reject: i
          } = r;
          i(new u.BannerError("other", `${t}`, n));
        }
        async handleRequestBannerEvent(e) {
          const {
            request: t
          } = e;
          this.logger.verbose("Received banner data from GF, will prefetch it now", t);
          const n = t.request.units[0].adUnit.code;
          const r = this.popFromBannerQueue(n);
          if (r) {
            try {
              const {
                CrazygamesAds: e
              } = window;
              await e.requestOnly(t.request, t.options);
              this.logger.verbose(`Banner ${n} prefetched`);
              r.resolve({
                id: n,
                banner: r.banner,
                options: t.options
              });
            } catch {
              r.reject(new u.BannerError("other", "Failed to prefetch the banner", n));
            }
          } else {
            this.logger.verbose(`Banner ${n} missing in queue, not prefetching.`);
          }
        }
        popFromBannerQueue(e) {
          const t = this.bannerQueue[e];
          if (t) {
            delete this.bannerQueue[e];
            return t;
          } else {
            this.logger.log(`Cannot retrieve element for id ${e} from the banner queue`);
            return null;
          }
        }
        clearBanner(e) {
          this.sdk.postMessage("clearBanner", {});
          const t = document.getElementById((0, a.ContainerIdToInnerId)(e));
          if (!t) {
            this.logger.log(`There isn't a banner in container #${e}, not clearing anything.`);
            return;
          }
          t.remove();
          this.renderedBannerIds.delete(e);
          const n = Object.values(this.overlayBanners).find(t => t.containerId === e);
          if (n) {
            n.destroy();
            delete this.overlayBanners[n.bannerRequest.id];
          }
          this.logger.log(`Cleared the banner from container #${e} ${n ? "(also overlay banner)" : ""}`);
        }
        clearAllBanners() {
          this.sdk.postMessage("clearAllBanners", {});
          const e = Array.from(this.renderedBannerIds.values());
          this.logger.log("Clearing all banners, ids: ", e.map(e => `#${e}`).join(", "));
          e.forEach(e => {
            this.clearBanner(e);
          });
        }
        ensureVideoAdNotPlaying(e) {
          if (this.sdk.ad.isAdPlaying) {
            throw new u.BannerError("videoAdPlaying", "Banners cannot be rendered while a video ad is playing", e);
          }
        }
        get activeBannersCount() {
          return this.renderedBannerIds.size;
        }
      };
    },
    373: function (e, t, n) {
      "use strict";

      var r = this && this.__importDefault || function (e) {
        if (e && e.__esModule) {
          return e;
        } else {
          return {
            default: e
          };
        }
      };
      Object.defineProperty(t, "__esModule", {
        value: true
      });
      const i = r(n(492));
      const o = r(n(927));
      const s = r(n(642));
      const a = n(557);
      const u = n(159);
      const l = r(n(922));
      const c = n(810);
      const h = r(n(446));
      const d = n(919);
      t.default = class {
        constructor() {
          this.adModule = new i.default(this);
          this.bannerModule = new o.default(this);
          this.userModule = new s.default();
          this.dataModule = new h.default(this);
          this.gameLogger = new l.default("game");
          this.analyticsLogger = new l.default("analytics");
          this.throttledHappyTime = (0, c.throttledMethod)(() => this.gameLogger.log("Requesting happytime (local)"), 1000, "happytime");
          this.throttledGameplayStart = (0, c.throttledMethod)(() => this.gameLogger.log("Requesting gameplay start (local)"), 1000, "gameplayStart");
          this.throttledGameplayStop = (0, c.throttledMethod)(() => this.gameLogger.log("Requesting gameplay stop (local)"), 1000, "gameplayStop");
          this.showInviteButton = e => {
            this.gameLogger.log("Show invite button (local)");
            const t = (0, u.generateInviteLink)(e, this.game.link);
            this.gameLogger.log(`Invite button link ${t}`);
            return t;
          };
          this.inviteLink = e => {
            this.gameLogger.log("Requesting invite link (local)");
            const t = (0, u.generateInviteLink)(e, this.game.link);
            this.gameLogger.log(`Invite link is ${t}`);
            return t;
          };
          this.adModule.init();
          this.bannerModule.disableBannerCheck = (0, a.getQueryStringValue)("disable_banner_check") === "true";
        }
        get ad() {
          return this.adModule;
        }
        get banner() {
          return this.bannerModule;
        }
        get user() {
          return this.userModule;
        }
        get data() {
          return this.dataModule;
        }
        get environment() {
          return "local";
        }
        get isQaTool() {
          return false;
        }
        get game() {
          return {
            link: "https://www.crazygames.com/game/your-game-will-appear-here",
            id: "local",
            isInstantJoin: window.location.search.includes("instantJoin=true"),
            isInstantMultiplayer: window.location.search.includes("instantJoin=true"),
            happytime: () => this.throttledHappyTime(),
            gameplayStart: () => this.throttledGameplayStart(),
            gameplayStop: () => this.throttledGameplayStop(),
            loadingStart: () => this.gameLogger.log("Requesting game loading start (local)"),
            loadingStop: () => this.gameLogger.log("Requesting game loading stop (local)"),
            inviteLink: this.inviteLink,
            showInviteButton: this.showInviteButton,
            hideInviteButton: () => this.gameLogger.log("Hide invite button (local)"),
            getInviteParam: e => new URLSearchParams(window.location.search).get(e),
            settings: {
              disableChat: false
            }
          };
        }
        get analytics() {
          return {
            trackOrder: (e, t) => {
              if (!(0, a.isXsollaOrderArgumentValid)(t)) {
                throw new d.AnalyticsError("invalidArgument", "Order must be a JSON object.");
              }
              if (!d.PAYMENT_PROVIDERS.includes(e)) {
                throw new d.AnalyticsError("invalidArgument", `Unsupported payment provider. Supported providers: ${d.PAYMENT_PROVIDERS.join(",")}`);
              }
              this.analyticsLogger.log(`Track "${e}" order`, t);
            }
          };
        }
      };
    },
    409: (e, t, n) => {
      "use strict";

      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.DisabledDataHandler = undefined;
      const r = n(307);
      t.DisabledDataHandler = class {
        constructor() {
          this.errorCode = "dataModuleDisabled";
          this.errorMessage = "The data module is disabled. To enabled it, please indicate on the Developer Portal that your game is using it.";
        }
        clear() {
          throw new r.GeneralError(this.errorCode, this.errorMessage);
        }
        getItem(e) {
          throw new r.GeneralError(this.errorCode, this.errorMessage);
        }
        removeItem(e) {
          throw new r.GeneralError(this.errorCode, this.errorMessage);
        }
        setItem(e, t) {
          throw new r.GeneralError(this.errorCode, this.errorMessage);
        }
      };
    },
    446: function (e, t, n) {
      "use strict";

      var r = this && this.__importDefault || function (e) {
        if (e && e.__esModule) {
          return e;
        } else {
          return {
            default: e
          };
        }
      };
      Object.defineProperty(t, "__esModule", {
        value: true
      });
      const i = r(n(922));
      const o = n(951);
      const s = n(553);
      t.default = class {
        constructor(e) {
          this.logger = new i.default("data");
          const t = (0, o.loadGameDataFromLs)(e.game.id);
          this.localDataHandler = new s.LocalDataHandler(t, e.game.id);
        }
        clear() {
          this.logger.log("Clear data");
          this.localDataHandler.clear();
        }
        getItem(e) {
          const t = this.localDataHandler.getItem(e);
          this.logger.log(`Get "${e}", returning ${t}`);
          return t;
        }
        removeItem(e) {
          this.logger.log(`Remove "${e}"`);
          this.localDataHandler.removeItem(e);
        }
        setItem(e, t) {
          this.logger.log(`Set "${e}" = ${t}`);
          this.localDataHandler.setItem(e, t);
        }
        syncUnityGameData() {
          this.logger.log("Requesting to sync unity PlayerPrefs (local)");
        }
      };
    },
    447: (e, t, n) => {
      "use strict";

      Object.defineProperty(t, "__esModule", {
        value: true
      });
      const r = n(307);
      t.default = class {
        constructor() {
          this.message = `CrazySDK is disabled on this domain. Check ${r.DOCS_URL} for more info.`;
          this.code = "sdkDisabled";
        }
        get ad() {
          throw new r.GeneralError(this.code, this.message);
        }
        get banner() {
          throw new r.GeneralError(this.code, this.message);
        }
        get game() {
          throw new r.GeneralError(this.code, this.message);
        }
        get user() {
          throw new r.GeneralError(this.code, this.message);
        }
        get data() {
          throw new r.GeneralError(this.code, this.message);
        }
        get analytics() {
          throw new r.GeneralError(this.code, this.message);
        }
        get environment() {
          return "disabled";
        }
        get isQaTool() {
          return false;
        }
      };
    },
    488: (e, t, n) => {
      "use strict";

      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.getBannerSizeAsText = t.getBannerContainer = t.InnerIdToContainerId = t.ContainerIdToInnerId = undefined;
      const r = n(891);
      const i = n(63);
      t.ContainerIdToInnerId = e => `${e}-crazygames-inner`;
      t.InnerIdToContainerId = e => `${e}`.replace("-crazygames-inner", "");
      t.getBannerContainer = async function (e, n) {
        var o;
        if (!e) {
          throw new r.BannerError("missingId", "Container id not specified", e);
        }
        const s = await (0, i.getContainerInfo)(e);
        const {
          visibleState: a
        } = s;
        if (n) {
          if (a === "notCreated") {
            throw new r.BannerError("notCreated", "Container is not present on the page", e);
          }
          if (a === "notVisible") {
            throw new r.BannerError("notVisible", "Container is not entirely visible on the page", e);
          }
        }
        const u = (0, t.ContainerIdToInnerId)(e);
        if (!document.getElementById(u)) {
          const t = document.createElement("div");
          t.id = u;
          t.classList.add("crazygames-banner-container");
          if ((o = document.getElementById(e)) !== null && o !== undefined) {
            o.append(t);
          }
        }
        return {
          mainContainerId: e,
          innerContainerId: u,
          containerInfo: s
        };
      };
      t.getBannerSizeAsText = function (e) {
        return `${e.width}x${e.height}`;
      };
    },
    492: function (e, t, n) {
      "use strict";

      var r = this && this.__importDefault || function (e) {
        if (e && e.__esModule) {
          return e;
        } else {
          return {
            default: e
          };
        }
      };
      Object.defineProperty(t, "__esModule", {
        value: true
      });
      const i = n(684);
      const o = n(557);
      const s = r(n(922));
      t.default = class {
        constructor(e) {
          this.sdk = e;
          this.requestInProgress = false;
          this.overlay = null;
          this.logger = new s.default("ad");
          this.adPlaying = false;
        }
        init() {
          this.overlay = document.createElement("div");
          this.overlay.id = "local-overlay";
          this.createOverlayStyle();
          document.body.appendChild(this.overlay);
        }
        prefetchAd(e) {
          this.logger.log(`Prefetching ${e} ad`);
        }
        async requestAd(e, t) {
          if (this.requestInProgress) {
            if (t == null ? undefined : t.adError) {
              const e = "An ad request is already in progress";
              (0, o.wrapUserFn)(t.adError)(new i.AdError("other", e));
            } else if (t == null ? undefined : t.adFinished) {
              (0, o.wrapUserFn)(t.adFinished)();
            }
          } else {
            this.adPlaying = true;
            if (t == null ? undefined : t.adStarted) {
              (0, o.wrapUserFn)(t.adStarted)();
            }
            if (this.sdk.banner.activeBannersCount > 0) {
              this.sdk.banner.clearAllBanners();
            }
            await this.renderFakeAd(e);
            this.adPlaying = false;
            if (t == null ? undefined : t.adFinished) {
              (0, o.wrapUserFn)(t.adFinished)();
            }
          }
        }
        async hasAdblock() {
          this.logger.log("Requesting adblock status (always false) (local)");
          return false;
        }
        async renderFakeAd(e) {
          this.logger.log(`Requesting ${e} ad`);
          this.requestInProgress = true;
          this.showOverlay();
          this.overlay.innerHTML = `<h1>A ${e} ad would appear here</h1>`;
          return new Promise(e => {
            window.setTimeout(() => {
              this.requestInProgress = false;
              this.hideOverlay();
              e();
            }, 5000);
          });
        }
        showOverlay() {
          this.overlay.style.display = "flex";
        }
        hideOverlay() {
          this.overlay.style.display = "none";
          this.overlay.innerHTML = "";
        }
        createOverlayStyle() {
          const e = {
            position: "fixed",
            display: "none",
            inset: 0,
            "font-family": "Arial, Helvetica, sans-serif",
            color: "white",
            "align-items": "center",
            "justify-content": "center",
            "background-color": "rgba(0,0,0,0.75)",
            "z-index": "10000"
          };
          for (const t in e) {
            this.overlay.style[t] = e[t];
          }
        }
        get isAdPlaying() {
          return this.adPlaying;
        }
      };
    },
    529: (e, t) => {
      "use strict";

      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.isJsSdkRequestUserTokenSuccessResponse = function (e) {
        return Object.hasOwn(e, "token");
      };
      t.isJsSdkRequestUserTokenErrorResponse = function (e) {
        return Object.hasOwn(e, "error");
      };
      t.isJsSdkRequestXsollaUserTokenSuccessResponse = function (e) {
        return Object.hasOwn(e, "token");
      };
      t.isJsSdkRequestXsollaUserTokenErrorResponse = function (e) {
        return Object.hasOwn(e, "error");
      };
    },
    533: function (e, t, n) {
      "use strict";

      var r = this && this.__importDefault || function (e) {
        if (e && e.__esModule) {
          return e;
        } else {
          return {
            default: e
          };
        }
      };
      Object.defineProperty(t, "__esModule", {
        value: true
      });
      const i = r(n(922));
      const o = n(557);
      const s = n(919);
      t.default = class {
        constructor(e) {
          this.sdk = e;
          this.logger = new i.default("analytics");
        }
        trackOrder(e, t) {
          if (!(0, o.isXsollaOrderArgumentValid)(t)) {
            throw new s.AnalyticsError("invalidArgument", "Order must be a JSON object.");
          }
          if (!s.PAYMENT_PROVIDERS.includes(e)) {
            throw new s.AnalyticsError("invalidArgument", `Unsupported payment provider. Supported providers: ${s.PAYMENT_PROVIDERS.join(",")}`);
          }
          this.logger.log(`Track "${e}" order`, t);
          this.sdk.postMessage("analyticsTrackIAPOrder", {
            paymentProvider: e,
            orderJson: JSON.stringify(t)
          });
        }
      };
    },
    553: function (e, t, n) {
      "use strict";

      var r = this && this.__importDefault || function (e) {
        if (e && e.__esModule) {
          return e;
        } else {
          return {
            default: e
          };
        }
      };
      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.generateLsGameDataKey = t.LocalDataHandler = undefined;
      const i = r(n(922));
      const o = n(583);
      const s = n(951);
      function a(e) {
        return `SDK_DATA_${e}`;
      }
      t.LocalDataHandler = class {
        constructor(e, t) {
          this.logger = new i.default("data");
          this.data = e;
          this.lsKey = a(t);
          this.logger.log("Local data handler initialized");
          this.logger.verbose("With this initial data: ", e);
        }
        clear() {
          this.data = {};
          this.saveData();
        }
        getItem(e) {
          return this.data[e] || null;
        }
        removeItem(e) {
          delete this.data[e];
          this.saveData();
        }
        setItem(e, t) {
          this.data[e] = `${t}`;
          this.saveData();
        }
        saveData() {
          (0, s.checkDataLimits)(JSON.stringify(this.data));
          const e = {
            data: this.data,
            metadata: {
              date: new Date()
            }
          };
          o.SafeLocalStorage.Instance.setItem(this.lsKey, JSON.stringify(e));
        }
      };
      t.generateLsGameDataKey = a;
    },
    557: (e, t, n) => {
      "use strict";

      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.sendErrorToGf = t.isXsollaOrderArgumentValid = t.wrapUserFn = t.loadScript = t.addStyle = t.getQueryStringValue = undefined;
      const r = n(100);
      const i = n(67);
      t.getQueryStringValue = function (e) {
        return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(e).replace(/[.+*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
      };
      t.addStyle = function (e) {
        const t = document.createElement("style");
        t.textContent = e;
        document.head.append(t);
      };
      t.loadScript = function (e) {
        return new Promise((t, n) => {
          const i = document.createElement("script");
          i.onload = () => t();
          i.onerror = (e, t, i, o, s) => {
            try {
              let a = "";
              a = typeof e == "string" ? e : `type: ${e.type} - target: ${e.currentTarget}`;
              n(new Error(`LoadScript error. Event [${a}]- source [${t}] - line/column [${i}/${o}] - error [${(0, r.stringifyError)(s)}]`));
            } catch (e) {
              n(e);
            }
          };
          i.src = e;
          i.async = true;
          document.head.appendChild(i);
        });
      };
      t.wrapUserFn = function (e) {
        return t => {
          try {
            e(t);
          } catch (e) {
            console.error(e);
          }
        };
      };
      t.isXsollaOrderArgumentValid = function (e) {
        return typeof e == "object" && e !== null && !Array.isArray(e);
      };
      t.sendErrorToGf = function (e, t, n) {
        if (!i.GF_WINDOW) {
          return;
        }
        const r = {
          type: "sdkError",
          data: {
            errorName: e,
            module: t,
            specificValues: n || {}
          }
        };
        i.GF_WINDOW.postMessage(r, "*");
      };
    },
    559: function (e, t, n) {
      "use strict";

      var r = this && this.__importDefault || function (e) {
        if (e && e.__esModule) {
          return e;
        } else {
          return {
            default: e
          };
        }
      };
      Object.defineProperty(t, "__esModule", {
        value: true
      });
      const i = n(159);
      const o = r(n(922));
      const s = n(810);
      const a = n(918);
      t.default = class {
        constructor(e, t) {
          this.sdk = e;
          this.logger = new o.default("game");
          this.settings = {
            disableChat: false
          };
          this.isInstantJoin = window.location.search.includes("instantJoin=true");
          this.isInstantMultiplayer = window.location.search.includes("instantJoin=true");
          this.loadStatsSent = false;
          this.throttledHappyTime = (0, s.throttledMethod)(() => {
            this.logger.log("Requesting happytime");
            this.sdk.postMessage("happytime", {});
          }, 1000, "happytime");
          this.throttledGameplayStart = (0, s.throttledMethod)(() => {
            this.logger.log("Requesting gameplay start");
            this.sdk.postMessage("gameplayStart", {});
          }, 1000, "gameplayStart");
          this.throttledGameplayStop = (0, s.throttledMethod)(() => {
            this.logger.log("Requesting gameplay stop");
            this.sdk.postMessage("gameplayStop", {});
          }, 1000, "gameplayStop");
          this.link = t.gameLink;
          this.id = t.gameId;
        }
        happytime() {
          this.throttledHappyTime();
        }
        gameplayStart() {
          this.throttledGameplayStart();
          if (!this.loadStatsSent) {
            this.loadStatsSent = true;
            let e = window.performance.getEntriesByType("resource").map(e => JSON.parse(JSON.stringify(e)));
            e = (0, a.uniqBy)(e, "name");
            this.sdk.postMessage("sdkGameLoadStats", {
              resources: e
            });
          }
        }
        gameplayStop() {
          this.throttledGameplayStop();
        }
        loadingStart() {
          this.logger.log("Requesting game loading start");
          this.sdk.postMessage("sdkGameLoadingStart", {});
        }
        loadingStop() {
          this.logger.log("Requesting game loading stop");
          this.sdk.postMessage("sdkGameLoadingStop", {});
        }
        inviteLink(e) {
          this.logger.log("Requesting invite link");
          const t = (0, i.generateInviteLink)(e, this.link);
          this.logger.log(`Invite link is ${t}`);
          this.sdk.postMessage("inviteUrl", {
            inviteUrl: t
          });
          return t;
        }
        showInviteButton(e) {
          this.logger.log("Show invite button");
          const t = (0, i.generateInviteLink)(e, this.link);
          this.logger.log(`Invite button link ${t}`);
          this.sdk.postMessage("showInviteButton", {
            inviteUrl: t
          });
          return t;
        }
        hideInviteButton() {
          this.logger.log("Hide invite button");
          this.sdk.postMessage("hideInviteButton", {});
        }
        getInviteParam(e) {
          return new URLSearchParams(window.location.search).get(e);
        }
        handleEvent(e) {
          if (e.type === "focusStealAttempt") {
            this.restoreCanvasFocus();
          }
        }
        restoreCanvasFocus() {
          try {
            const e = document.getElementsByTagName("canvas");
            if (e.length !== 1) {
              this.logger.log(`There are ${e.length} canvases, don't restore focus`);
            } else {
              this.logger.log("Restore focus to canvas");
              e[0].tabIndex = 1;
              e[0].focus();
            }
          } catch {
            this.logger.error("Failed to restore canvas focus");
          }
        }
      };
    },
    561: (e, t) => {
      "use strict";

      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.wait = undefined;
      t.wait = function (e) {
        return new Promise(t => setTimeout(t, e));
      };
    },
    583: function (e, t, n) {
      "use strict";

      var r = this && this.__importDefault || function (e) {
        if (e && e.__esModule) {
          return e;
        } else {
          return {
            default: e
          };
        }
      };
      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.SafeLocalStorage = t.InMemoryStorage = undefined;
      const i = r(n(922));
      class o {
        constructor() {
          this.data = {};
          this.clear();
        }
        setItem(e, t) {
          this.data[e] = String(t);
        }
        getItem(e) {
          if (this.data.hasOwnProperty(e)) {
            return this.data[e];
          } else {
            return undefined;
          }
        }
        removeItem(e) {
          delete this.data[e];
        }
        clear() {
          this.data = {};
        }
      }
      t.InMemoryStorage = o;
      t.SafeLocalStorage = class {
        constructor() {
          this.logger = new i.default("none");
          this.storage = this.getAvailableStorage();
        }
        static get Instance() {
          if (this._instance) {
            return this._instance;
          } else {
            return this._instance = new this();
          }
        }
        getItem(e) {
          return this.storage.getItem(e);
        }
        setItem(e, t) {
          this.storage.setItem(e, t);
        }
        removeItem(e) {
          this.storage.removeItem(e);
        }
        clear() {
          return this.storage.clear();
        }
        isFunctioningStorage(e) {
          try {
            const t = `__SafeLocalStorage__${Date.now()}`;
            const n = "test";
            e.setItem(t, n);
            return e.getItem(t) === n && (window.localStorage.removeItem(t), true);
          } catch {
            return false;
          }
        }
        getAvailableStorage() {
          try {
            if (this.hasWorkingLocalStorage()) {
              this.logger.verbose("[SafeLocalStorage] using localStorage");
              return window.localStorage;
            } else if (this.hasWorkingSessionStorage()) {
              this.logger.verbose("[SafeLocalStorage] fallback to sessionStorage");
              return window.sessionStorage;
            } else {
              this.logger.verbose("[SafeLocalStorage] fallback to InMemoryStorage");
              return new o();
            }
          } catch {
            this.logger.verbose("[SafeLocalStorage] fallback to InMemoryStorage");
            return new o();
          }
        }
        hasWorkingLocalStorage() {
          try {
            if (!window.hasOwnProperty("localStorage")) {
              return false;
            }
            const {
              localStorage: e
            } = window;
            return this.isFunctioningStorage(e);
          } catch {
            return false;
          }
        }
        hasWorkingSessionStorage() {
          try {
            if (!window.hasOwnProperty("sessionStorage")) {
              return false;
            }
            const {
              sessionStorage: e
            } = window;
            return this.isFunctioningStorage(e);
          } catch {
            return false;
          }
        }
      };
    },
    605: function (e, t, n) {
      "use strict";

      var r = this && this.__importDefault || function (e) {
        if (e && e.__esModule) {
          return e;
        } else {
          return {
            default: e
          };
        }
      };
      Object.defineProperty(t, "__esModule", {
        value: true
      });
      const i = n(307);
      const o = r(n(922));
      t.default = class {
        constructor() {
          this.logger = new o.default("none");
          this.code = "sdkNotInitialized";
          this.message = `CrazySDK is not initialized yet. Check ${i.DOCS_URL} for more info.`;
        }
        get ad() {
          throw new i.GeneralError(this.code, this.message);
        }
        get banner() {
          throw new i.GeneralError(this.code, this.message);
        }
        get game() {
          throw new i.GeneralError(this.code, this.message);
        }
        get user() {
          throw new i.GeneralError(this.code, this.message);
        }
        get data() {
          throw new i.GeneralError(this.code, this.message);
        }
        get analytics() {
          throw new i.GeneralError(this.code, this.message);
        }
        get environment() {
          return "uninitialized";
        }
        get isQaTool() {
          return false;
        }
      };
    },
    642: function (e, t, n) {
      "use strict";

      var r = this && this.__importDefault || function (e) {
        if (e && e.__esModule) {
          return e;
        } else {
          return {
            default: e
          };
        }
      };
      Object.defineProperty(t, "__esModule", {
        value: true
      });
      const i = n(790);
      const o = n(557);
      const s = r(n(922));
      function a() {
        const e = navigator.userAgent.toLowerCase();
        const t = /mobile/i.test(e);
        const n = /tablet/i.test(e) || t && /ipad/i.test(e);
        if (t) {
          return "mobile";
        } else if (n) {
          return "tablet";
        } else {
          return "desktop";
        }
      }
      t.default = class {
        constructor() {
          this.systemInfo = {
            browser: {
              name: "demo",
              version: "demo"
            },
            countryCode: "US",
            os: {
              name: "demo",
              version: "demo"
            },
            device: {
              type: a()
            }
          };
          this.isUserAccountAvailable = true;
          this.demoUser1 = {
            username: "User1",
            profilePictureUrl: "https://images.crazygames.com/userportal/avatars/1.png"
          };
          this.demoUser2 = {
            username: "User2",
            profilePictureUrl: "https://images.crazygames.com/userportal/avatars/2.png"
          };
          this.user1Token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJpZFVzZXIxIiwidXNlcm5hbWUiOiJVc2VyMSIsImdhbWVJZCI6InlvdXJHYW1lSWQiLCJwcm9maWxlUGljdHVyZVVybCI6Imh0dHBzOi8vaW1hZ2VzLmNyYXp5Z2FtZXMuY29tL3VzZXJwb3J0YWwvYXZhdGFycy8xLnBuZyIsImlhdCI6MTY2ODU5MzMxNCwiZXhwIjo0ODI0Mjg4NTE0fQ.u4N2DzCC6Vmo6Gys-XSl8rHQR0NUJAcWQWr29eLd54qMDPbCopPG0kye8TAidOU6dWAqNWO_kERbl75nTxNcJjbW4yqBS_bIPingIhuCCJsjvnQPkalfmVotmoZGQP21Q9MyZPfpjZNogioA3a0vm6APXAqzudTA9lTioztnT4YvgndISngOMQVNoDCJ_DgCbKy8GFQDcCN-AHFFb0WIVWiTYszv-9JZohUzULt-ueYL31pXVGHQ5C4rHESEg7LYzx1IaLKw1zcoYGxul0RxR35nm3yD_bGa6fQVzCfnKnhEBRifUZsIN1LfIHfNB23ZOh1llG7PEOdvtCSfIxP9ZK6t4gRkGn1VsqZFAMhq1LgJebO8hcm_Iqx0wF3WkdMysoQuWThTNKnwmphv9pguuALILYJluUP8UQll3qiF6gzoLPy1MfD_9l4TPZeP9Bv50B-Tm6Lk3OW248jyuFRKP_VgwZutTb5pJ7LggFcqWFXsBv5ZG3V2zsfVwpAPDhpmb4ykjoB2xLSuxjrvs1dzMhl02QAQjqTUgHj4fstgX-2jYowDyyPjj6JbT2ZC7vrrdmPvc8AcNvyCszamfRYjexElGaeJDDt6vtRuJw_JVwsCLaYHGif4UaKCoe6BECg3mRVUkH08Nm-qQPQw9slpYZmxckFEQQPCGkkPhgOBFkE";
          this.user2Token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJpZFVzZXIyIiwidXNlcm5hbWUiOiJVc2VyMiIsImdhbWVJZCI6InlvdXJHYW1lSWQiLCJwcm9maWxlUGljdHVyZVVybCI6Imh0dHBzOi8vaW1hZ2VzLmNyYXp5Z2FtZXMuY29tL3VzZXJwb3J0YWwvYXZhdGFycy8yLnBuZyIsImlhdCI6MTY2ODU5MzMxNCwiZXhwIjo0ODI0Mjg4NTE0fQ.kh60HYKR8txKvLoCB6dQ9hQG8Mu1UgtneTGs3Y15HvBWrZoLKp3x3pTf_Vhq8xzs7fQYJKr94zYAxxFRztHey7Tv7PBBmPESUFo8Le-_s2xDy982sFhpM6XDt84ohhvEuJEsOW8wIcCaCK6wzm6UWY6n1bpw1cO1KNASyZRSkDRhfyzDVJ5e167OLgGe3euodTHgClJPDv0ZYhle9KH86PepWamCm0429VrzyOu6QdbtFcRlRNZVnTtgNrCpyvss4AyDhnY5qV9yng7xHVt4zlocP_Z7btBL_kxrzYskhJi6KYuQAYmqLxqHSDnehlIvgO4cdEpJA_FOTeACTohhEu8zjXRrfdAFvEe0W6qqUo5HNFoElRoxYWf11WGSdrJCjpF4Qei9BPgprFaVH2Xi-ITAjKyElQxeKs5p6VmvaMAGwdqZgM4fm7OSex8QQGK0HFJ7wFoCTV5PLl-MBVvTSTfemJMWEwc8od124gwT_uGdDKrASovT2pijgBsAi3jxwgfEr1RPq8uCgZtksrTqaAM9TMv9Z6Zv35pdgTrWzTrOn-G-uc4EPZq7iQaEnglWEFj8Qsm_nMQMgtIM7MYG8KwPC4if3-Yc8KwaAL_taVvkqyMaV3W5j4MX9b1bbf_fw3jrGt74MACb7FtgzKudxoz2CXKZqTppadxS_IOnlMk";
          this.expiredToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJpZFVzZXIxIiwidXNlcm5hbWUiOiJVc2VyMSIsImdhbWVJZCI6InlvdXJHYW1lSWQiLCJwcm9maWxlUGljdHVyZVVybCI6Imh0dHBzOi8vaW1hZ2VzLmNyYXp5Z2FtZXMuY29tL3VzZXJwb3J0YWwvYXZhdGFycy8xLnBuZyIsImlhdCI6MTY2ODU5MzQ5MSwiZXhwIjoxNjY4NTkzNDkyfQ.l_0cyeD-suEM7n9l-Vb2nP5vTJi-e3HwZQWLUESJMdVTX1zPDuQhwnSgHhcGVGFnhG5Wvtni-ElpM8HnVNvY7hRthbeP23n2ScAJBvAX10vrzPuLJRn_Nj_5GcRQpK4fH813Ij8ZWuOaS2hD4gKaEUessZs5n5hNBTQN9T5j4wkNvfhuw9vqtVOha2aPveqeVy1eA5XAWI7IirHi31-Dw60MSVgsp3r4tpYEHTlUPktzLsQvO9Sk9IE7iybg9ycoFoS6L1eAvxGWVF1BMHRerPwdOV9CN0rtrqrTM3pyb1fpmFfgQpoA8AgPuVrU58mwyeTpUQ4WSrPrltGjxxfiGQOATBDBrJk5V173BfUgBEgAEP0TifWAQt02iijJa9G6q-V8p0GWto1EYSdvEDmG0YhoRBVxnOQH3U1Fu0yxMWGMm9VmZVVhVN8PpLjitEhP4Gn33IafpS05d1-Q0NFMb9-FvQCdtXjTaGbaBVIeBN-aO0r4ERvoBE9R0AUrywd9Z2zK_qKRvp35NyryLjnedsYt5Xrc9TA2uDMR77TjByyqsdQ_qv4zhLfhuiMiweXyPfYzltAiNJmEUohxlP7OvH33B6xpT7Qz2ZyEeMHBrQRQGGlT6MowcMYx_2LFNSK8PwZJNlMs0Uw_uCIu-4TvqleVleIg7sLhWiijw1cxtmM";
          this.logger = new s.default("user");
        }
        async showAuthPrompt() {
          this.logger.log("Requesting auth prompt (local)");
          switch ((0, o.getQueryStringValue)("show_auth_prompt_response")) {
            case "user1":
            default:
              return this.demoUser1;
            case "user2":
              return this.demoUser2;
            case "user_cancelled":
              throw new i.UserError("userCancelled", "User cancelled the auth prompt");
          }
        }
        async showAccountLinkPrompt() {
          this.logger.log("Requesting link account prompt (local)");
          switch ((0, o.getQueryStringValue)("link_account_response")) {
            case "yes":
            default:
              return {
                response: "yes"
              };
            case "no":
              return {
                response: "no"
              };
            case "logged_out":
              throw new i.UserError("userNotAuthenticated", "The user is not authenticated");
          }
        }
        async getUser() {
          this.logger.log("Requesting user object (local)");
          switch ((0, o.getQueryStringValue)("user_response")) {
            case "user1":
            default:
              return this.demoUser1;
            case "user2":
              return this.demoUser2;
            case "logged_out":
              return null;
          }
        }
        async getUserToken() {
          this.logger.log("Requesting user token (local)");
          switch ((0, o.getQueryStringValue)("token_response")) {
            case "user1":
            default:
              return this.user1Token;
            case "user2":
              return this.user2Token;
            case "expired_token":
              return this.expiredToken;
            case "logged_out":
              throw new i.UserError("userNotAuthenticated", "The user is not authenticated");
          }
        }
        async getXsollaUserToken() {
          this.logger.log("Requesting Xsolla user token (local). Xsolla token not supported locally.");
          return "Xsolla token not supported locally";
        }
        addScore(e) {
          this.logger.log("Requesting to add score (local)", e);
        }
        addScoreEncrypted(e, t) {
          this.logger.log("Requesting to add score (local). Score: ", e, "Encrypted score: ", t);
        }
        addAuthListener() {}
        removeAuthListener() {}
      };
    },
    684: (e, t, n) => {
      "use strict";

      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.AdError = undefined;
      const r = n(307);
      class i extends r.GeneralError {
        constructor(e, t) {
          super(e, t);
          this.code = e;
          this.message = t;
        }
      }
      t.AdError = i;
    },
    689: function (e, t, n) {
      "use strict";

      var r = this && this.__importDefault || function (e) {
        if (e && e.__esModule) {
          return e;
        } else {
          return {
            default: e
          };
        }
      };
      Object.defineProperty(t, "__esModule", {
        value: true
      });
      const i = r(n(371));
      const o = r(n(559));
      const s = r(n(88));
      const a = r(n(326));
      const u = n(342);
      const l = r(n(922));
      const c = r(n(325));
      const h = r(n(742));
      const d = n(67);
      const f = r(n(533));
      t.default = class {
        constructor(e, t, n) {
          this.logger = new l.default("none");
          this.receiveMessage = async e => {
            const t = e.data;
            if ((0, u.isGfToSdkEvent)(t) && t.type) {
              this.logger.verbose("Received message from GF", t);
              this.bannerModule.handleEvent(t);
              this.adModule.handleEvent(t);
              this.userModule.handleEvent(t);
              this.gameModule.handleEvent(t);
              h.default.getInstance().handleEvent(t);
            }
          };
          if (e.debug === true) {
            l.default.forceEnable = true;
          }
          this._isQaTool = e.isQaTool;
          this.adModule = new s.default(this);
          this.bannerModule = new i.default(this, e);
          this.gameModule = new o.default(this, e);
          this.userModule = new a.default(this, e.systemInfo, !!e.userAccountAvailable, n);
          this.dataModule = new c.default(this, t);
          this.analyticsModule = new f.default(this);
          window.addEventListener("message", this.receiveMessage, false);
          h.default.getInstance().init(this, e);
        }
        get environment() {
          this.postMessage("getEnvironment", {});
          return "crazygames";
        }
        get isQaTool() {
          this.postMessage("isQATool", {});
          return this._isQaTool;
        }
        get banner() {
          return this.bannerModule;
        }
        get game() {
          return this.gameModule;
        }
        get user() {
          return this.userModule;
        }
        get ad() {
          return this.adModule;
        }
        get data() {
          return this.dataModule;
        }
        get analytics() {
          return this.analyticsModule;
        }
        postMessage(e, t) {
          const n = {
            type: e,
            data: t
          };
          this.logger.verbose("Message to GF", n);
          if (d.GF_WINDOW) {
            d.GF_WINDOW.postMessage(n, "*");
          } else {
            this.logger.log("Missing GF_WINDOW, message won't be sent");
          }
        }
      };
    },
    726: (e, t) => {
      "use strict";

      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.SDK_VERSION = undefined;
      t.SDK_VERSION = "3.3.1";
    },
    742: (e, t, n) => {
      "use strict";

      Object.defineProperty(t, "__esModule", {
        value: true
      });
      const r = n(223);
      const i = "https://cza.crazygames.com/event";
      class o {
        constructor() {
          this.eventQueue = [];
          this.initTimedOut = false;
        }
        static getInstance() {
          o.instance ||= new o();
          return o.instance;
        }
        init(e, t) {
          this.initInfo = t;
          this.sdk = e;
          this.sdk.postMessage("requestAnalyticsInfoFromSDK", {});
          this.initTimeoutId = window.setTimeout(() => {
            if (!this.instanceId) {
              this.initTimedOut = true;
              this.eventQueue = [];
            }
          }, 10000);
        }
        sendDebugEvent(e, t, n) {
          if (this.initTimedOut) {
            return;
          }
          const r = {
            time: Date.now(),
            version: "3.6.0",
            source: "sdk",
            type: "debug",
            sampling: 1,
            userId: "",
            page: "",
            instanceId: "",
            gameId: "",
            buildId: "",
            name: e,
            data: JSON.stringify(t)
          };
          this.sendEvent(r, n);
        }
        handleEvent(e) {
          if (e.type === "analyticsInfoResponseFromGF") {
            if (this.initTimeoutId) {
              window.clearTimeout(this.initTimeoutId);
            }
            this.instanceId = e.instanceId;
            this.eventQueue.forEach(e => this.sendEvent(e.event, e.filter));
            this.eventQueue = [];
          }
        }
        sendEvent(e, t) {
          if (this.initInfo) {
            this.safeIdleCallback(() => {
              if (this.initInfo.isQaTool) {
                return;
              }
              if (t && !t(this.initInfo)) {
                return;
              }
              const o = {
                ...e,
                instanceId: this.instanceId,
                gameId: this.initInfo?.gameId,
                buildId: this.initInfo?.buildId
              };
              const s = (0, r.ch)(o);
              o.__i = s;
              this.sendData(o);
            });
          } else {
            this.eventQueue.push({
              event: e,
              filter: t
            });
          }
        }
        async sendData(e) {
          const t = e;
          const n = async () => {
            await window.fetch(i, {
              method: "post",
              body: JSON.stringify(t),
              headers: {
                "Content-Type": "text/plain"
              }
            });
          };
          if (window.navigator) {
            const e = {
              type: "text/plain"
            };
            const r = new Blob([JSON.stringify(t)], e);
            if (window.navigator.sendBeacon(i, r)) {
              return Promise.resolve();
            }
            await n();
          } else {
            await n();
          }
        }
        safeIdleCallback(e) {
          if (window.requestIdleCallback) {
            window.requestIdleCallback(e, {
              timeout: 2000
            });
          } else {
            window.setTimeout(e, 0);
          }
        }
      }
      t.default = o;
    },
    790: (e, t, n) => {
      "use strict";

      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.UserError = t.DEFAULT_MIN_TIME_BETWEEN_REWARDED_MS = t.DEFAULT_MIN_TIME_BETWEEN_MIDROLL_MS = undefined;
      const r = n(307);
      t.DEFAULT_MIN_TIME_BETWEEN_MIDROLL_MS = 180000;
      t.DEFAULT_MIN_TIME_BETWEEN_REWARDED_MS = 5000;
      class i extends r.GeneralError {
        constructor(e, t) {
          super(e, t);
          this.code = e;
          this.message = t;
        }
      }
      t.UserError = i;
    },
    809: (e, t, n) => {
      "use strict";

      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.DEFAULT_SAVE_INTERVAL_MS = t.MAX_DATA_LENGTH = t.DataError = undefined;
      const r = n(307);
      class i extends r.GeneralError {
        constructor(e, t) {
          super(e, t);
          this.code = e;
          this.message = t;
        }
      }
      t.DataError = i;
      t.MAX_DATA_LENGTH = 1048576;
      t.DEFAULT_SAVE_INTERVAL_MS = 1000;
    },
    810: function (e, t, n) {
      "use strict";

      var r = this && this.__importDefault || function (e) {
        if (e && e.__esModule) {
          return e;
        } else {
          return {
            default: e
          };
        }
      };
      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.throttledMethod = undefined;
      const i = new (r(n(922)).default)("none");
      t.throttledMethod = (e, t, n) => {
        let r = 0;
        return (...o) => {
          const s = new Date().getTime();
          if (s - r > t) {
            r = s;
            return e(...o);
          } else {
            if (n) {
              i.error(`${n}() call throttled, delay ${t}`);
            }
            return;
          }
        };
      };
    },
    877: (e, t, n) => {
      "use strict";

      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.loadAdsIfNeeded = undefined;
      const r = n(557);
      const i = n(100);
      let o;
      t.loadAdsIfNeeded = function (e, t) {
        if (window.CrazygamesAds) {
          return Promise.resolve();
        } else {
          return function (e, t) {
            return o || (o = (0, r.loadScript)(e).catch(t => {
              throw new Error(`Error while loading script ${e}. Reason: ${(0, i.stringifyError)(t)}`);
            }).then(() => {
              const e = window;
              const n = e => {
                t.postMessage("adsAnalyticsEvent", {
                  event: e
                });
              };
              try {
                e.CrazygamesAds.initAds({
                  analyticsEventHandler: n
                });
              } catch (e) {
                throw new Error(`Error in initAds. Reason: ${(0, i.stringifyError)(e)}`);
              }
            }), o);
          }(e, t);
        }
      };
    },
    891: (e, t, n) => {
      "use strict";

      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.BannerError = undefined;
      const r = n(307);
      class i extends r.GeneralError {
        constructor(e, t, n) {
          super(e, t);
          this.code = e;
          this.message = t;
          this.containerId = n;
        }
      }
      t.BannerError = i;
    },
    896: (e, t) => {
      "use strict";

      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.isDefined = function (e) {
        return e != null;
      };
    },
    918: function (e, t, n) {
      var r;
      e = n.nmd(e);
      (function () {
        var i;
        var o = "Expected a function";
        var s = "__lodash_hash_undefined__";
        var a = "__lodash_placeholder__";
        var u = 32;
        var l = 128;
        var c = Infinity;
        var h = 9007199254740991;
        var d = NaN;
        var f = 4294967295;
        var g = [["ary", l], ["bind", 1], ["bindKey", 2], ["curry", 8], ["curryRight", 16], ["flip", 512], ["partial", u], ["partialRight", 64], ["rearg", 256]];
        var p = "[object Arguments]";
        var v = "[object Array]";
        var y = "[object Boolean]";
        var _ = "[object Date]";
        var m = "[object Error]";
        var w = "[object Function]";
        var b = "[object GeneratorFunction]";
        var k = "[object Map]";
        var I = "[object Number]";
        var E = "[object Object]";
        var S = "[object Promise]";
        var A = "[object RegExp]";
        var M = "[object Set]";
        var T = "[object String]";
        var D = "[object Symbol]";
        var R = "[object WeakMap]";
        var P = "[object ArrayBuffer]";
        var O = "[object DataView]";
        var x = "[object Float32Array]";
        var L = "[object Float64Array]";
        var C = "[object Int8Array]";
        var B = "[object Int16Array]";
        var U = "[object Int32Array]";
        var j = "[object Uint8Array]";
        var G = "[object Uint8ClampedArray]";
        var N = "[object Uint16Array]";
        var q = "[object Uint32Array]";
        var z = /\b__p \+= '';/g;
        var F = /\b(__p \+=) '' \+/g;
        var W = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
        var V = /&(?:amp|lt|gt|quot|#39);/g;
        var $ = /[&<>"']/g;
        var J = RegExp(V.source);
        var Q = RegExp($.source);
        var H = /<%-([\s\S]+?)%>/g;
        var X = /<%([\s\S]+?)%>/g;
        var Z = /<%=([\s\S]+?)%>/g;
        var K = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
        var Y = /^\w*$/;
        var ee = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
        var te = /[\\^$.*+?()[\]{}|]/g;
        var ne = RegExp(te.source);
        var re = /^\s+/;
        var ie = /\s/;
        var oe = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/;
        var se = /\{\n\/\* \[wrapped with (.+)\] \*/;
        var ae = /,? & /;
        var ue = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
        var le = /[()=,{}\[\]\/\s]/;
        var ce = /\\(\\)?/g;
        var he = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
        var de = /\w*$/;
        var fe = /^[-+]0x[0-9a-f]+$/i;
        var ge = /^0b[01]+$/i;
        var pe = /^\[object .+?Constructor\]$/;
        var ve = /^0o[0-7]+$/i;
        var ye = /^(?:0|[1-9]\d*)$/;
        var _e = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
        var me = /($^)/;
        var we = /['\n\r\u2028\u2029\\]/g;
        var be = "\\ud800-\\udfff";
        var ke = "\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff";
        var Ie = "\\u2700-\\u27bf";
        var Ee = "a-z\\xdf-\\xf6\\xf8-\\xff";
        var Se = "A-Z\\xc0-\\xd6\\xd8-\\xde";
        var Ae = "\\ufe0e\\ufe0f";
        var Me = "\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000";
        var Te = "[" + be + "]";
        var De = "[" + Me + "]";
        var Re = "[" + ke + "]";
        var Pe = "\\d+";
        var Oe = "[" + Ie + "]";
        var xe = "[" + Ee + "]";
        var Le = "[^" + be + Me + Pe + Ie + Ee + Se + "]";
        var Ce = "\\ud83c[\\udffb-\\udfff]";
        var Be = "[^" + be + "]";
        var Ue = "(?:\\ud83c[\\udde6-\\uddff]){2}";
        var je = "[\\ud800-\\udbff][\\udc00-\\udfff]";
        var Ge = "[" + Se + "]";
        var Ne = "\\u200d";
        var qe = "(?:" + xe + "|" + Le + ")";
        var ze = "(?:" + Ge + "|" + Le + ")";
        var Fe = "(?:['’](?:d|ll|m|re|s|t|ve))?";
        var We = "(?:['’](?:D|LL|M|RE|S|T|VE))?";
        var Ve = "(?:" + Re + "|" + Ce + ")?";
        var $e = "[" + Ae + "]?";
        var Je = $e + Ve + "(?:" + Ne + "(?:" + [Be, Ue, je].join("|") + ")" + $e + Ve + ")*";
        var Qe = "(?:" + [Oe, Ue, je].join("|") + ")" + Je;
        var He = "(?:" + [Be + Re + "?", Re, Ue, je, Te].join("|") + ")";
        var Xe = RegExp("['’]", "g");
        var Ze = RegExp(Re, "g");
        var Ke = RegExp(Ce + "(?=" + Ce + ")|" + He + Je, "g");
        var Ye = RegExp([Ge + "?" + xe + "+" + Fe + "(?=" + [De, Ge, "$"].join("|") + ")", ze + "+" + We + "(?=" + [De, Ge + qe, "$"].join("|") + ")", Ge + "?" + qe + "+" + Fe, Ge + "+" + We, "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", Pe, Qe].join("|"), "g");
        var et = RegExp("[" + Ne + be + ke + Ae + "]");
        var tt = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
        var nt = ["Array", "Buffer", "DataView", "Date", "Error", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Map", "Math", "Object", "Promise", "RegExp", "Set", "String", "Symbol", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "WeakMap", "_", "clearTimeout", "isFinite", "parseInt", "setTimeout"];
        var rt = -1;
        var it = {};
        it[x] = it[L] = it[C] = it[B] = it[U] = it[j] = it[G] = it[N] = it[q] = true;
        it[p] = it[v] = it[P] = it[y] = it[O] = it[_] = it[m] = it[w] = it[k] = it[I] = it[E] = it[A] = it[M] = it[T] = it[R] = false;
        var ot = {};
        ot[p] = ot[v] = ot[P] = ot[O] = ot[y] = ot[_] = ot[x] = ot[L] = ot[C] = ot[B] = ot[U] = ot[k] = ot[I] = ot[E] = ot[A] = ot[M] = ot[T] = ot[D] = ot[j] = ot[G] = ot[N] = ot[q] = true;
        ot[m] = ot[w] = ot[R] = false;
        var st = {
          "\\": "\\",
          "'": "'",
          "\n": "n",
          "\r": "r",
          "\u2028": "u2028",
          "\u2029": "u2029"
        };
        var at = parseFloat;
        var ut = parseInt;
        var lt = typeof n.g == "object" && n.g && n.g.Object === Object && n.g;
        var ct = typeof self == "object" && self && self.Object === Object && self;
        var ht = lt || ct || Function("return this")();
        var dt = t && !t.nodeType && t;
        var ft = dt && e && !e.nodeType && e;
        var gt = ft && ft.exports === dt;
        var pt = gt && lt.process;
        var vt = function () {
          try {
            return ft && ft.require && ft.require("util").types || pt && pt.binding && pt.binding("util");
          } catch (e) {}
        }();
        var yt = vt && vt.isArrayBuffer;
        var _t = vt && vt.isDate;
        var mt = vt && vt.isMap;
        var wt = vt && vt.isRegExp;
        var bt = vt && vt.isSet;
        var kt = vt && vt.isTypedArray;
        function It(e, t, n) {
          switch (n.length) {
            case 0:
              return e.call(t);
            case 1:
              return e.call(t, n[0]);
            case 2:
              return e.call(t, n[0], n[1]);
            case 3:
              return e.call(t, n[0], n[1], n[2]);
          }
          return e.apply(t, n);
        }
        function Et(e, t, n, r) {
          for (var i = -1, o = e == null ? 0 : e.length; ++i < o;) {
            var s = e[i];
            t(r, s, n(s), e);
          }
          return r;
        }
        function St(e, t) {
          for (var n = -1, r = e == null ? 0 : e.length; ++n < r && t(e[n], n, e) !== false;);
          return e;
        }
        function At(e, t) {
          for (var n = e == null ? 0 : e.length; n-- && t(e[n], n, e) !== false;);
          return e;
        }
        function Mt(e, t) {
          for (var n = -1, r = e == null ? 0 : e.length; ++n < r;) {
            if (!t(e[n], n, e)) {
              return false;
            }
          }
          return true;
        }
        function Tt(e, t) {
          for (var n = -1, r = e == null ? 0 : e.length, i = 0, o = []; ++n < r;) {
            var s = e[n];
            if (t(s, n, e)) {
              o[i++] = s;
            }
          }
          return o;
        }
        function Dt(e, t) {
          return e != null && !!e.length && Gt(e, t, 0) > -1;
        }
        function Rt(e, t, n) {
          for (var r = -1, i = e == null ? 0 : e.length; ++r < i;) {
            if (n(t, e[r])) {
              return true;
            }
          }
          return false;
        }
        function Pt(e, t) {
          for (var n = -1, r = e == null ? 0 : e.length, i = Array(r); ++n < r;) {
            i[n] = t(e[n], n, e);
          }
          return i;
        }
        function Ot(e, t) {
          for (var n = -1, r = t.length, i = e.length; ++n < r;) {
            e[i + n] = t[n];
          }
          return e;
        }
        function xt(e, t, n, r) {
          var i = -1;
          var o = e == null ? 0 : e.length;
          for (r && o && (n = e[++i]); ++i < o;) {
            n = t(n, e[i], i, e);
          }
          return n;
        }
        function Lt(e, t, n, r) {
          var i = e == null ? 0 : e.length;
          for (r && i && (n = e[--i]); i--;) {
            n = t(n, e[i], i, e);
          }
          return n;
        }
        function Ct(e, t) {
          for (var n = -1, r = e == null ? 0 : e.length; ++n < r;) {
            if (t(e[n], n, e)) {
              return true;
            }
          }
          return false;
        }
        var Bt = Ft("length");
        function Ut(e, t, n) {
          var r;
          n(e, function (e, n, i) {
            if (t(e, n, i)) {
              r = n;
              return false;
            }
          });
          return r;
        }
        function jt(e, t, n, r) {
          for (var i = e.length, o = n + (r ? 1 : -1); r ? o-- : ++o < i;) {
            if (t(e[o], o, e)) {
              return o;
            }
          }
          return -1;
        }
        function Gt(e, t, n) {
          if (t == t) {
            return function (e, t, n) {
              for (var r = n - 1, i = e.length; ++r < i;) {
                if (e[r] === t) {
                  return r;
                }
              }
              return -1;
            }(e, t, n);
          } else {
            return jt(e, qt, n);
          }
        }
        function Nt(e, t, n, r) {
          for (var i = n - 1, o = e.length; ++i < o;) {
            if (r(e[i], t)) {
              return i;
            }
          }
          return -1;
        }
        function qt(e) {
          return e != e;
        }
        function zt(e, t) {
          var n = e == null ? 0 : e.length;
          if (n) {
            return $t(e, t) / n;
          } else {
            return d;
          }
        }
        function Ft(e) {
          return function (t) {
            if (t == null) {
              return i;
            } else {
              return t[e];
            }
          };
        }
        function Wt(e) {
          return function (t) {
            if (e == null) {
              return i;
            } else {
              return e[t];
            }
          };
        }
        function Vt(e, t, n, r, i) {
          i(e, function (e, i, o) {
            n = r ? (r = false, e) : t(n, e, i, o);
          });
          return n;
        }
        function $t(e, t) {
          var n;
          for (var r = -1, o = e.length; ++r < o;) {
            var s = t(e[r]);
            if (s !== i) {
              n = n === i ? s : n + s;
            }
          }
          return n;
        }
        function Jt(e, t) {
          for (var n = -1, r = Array(e); ++n < e;) {
            r[n] = t(n);
          }
          return r;
        }
        function Qt(e) {
          if (e) {
            return e.slice(0, dn(e) + 1).replace(re, "");
          } else {
            return e;
          }
        }
        function Ht(e) {
          return function (t) {
            return e(t);
          };
        }
        function Xt(e, t) {
          return Pt(t, function (t) {
            return e[t];
          });
        }
        function Zt(e, t) {
          return e.has(t);
        }
        function Kt(e, t) {
          for (var n = -1, r = e.length; ++n < r && Gt(t, e[n], 0) > -1;);
          return n;
        }
        function Yt(e, t) {
          for (var n = e.length; n-- && Gt(t, e[n], 0) > -1;);
          return n;
        }
        var en = Wt({
          À: "A",
          Á: "A",
          Â: "A",
          Ã: "A",
          Ä: "A",
          Å: "A",
          à: "a",
          á: "a",
          â: "a",
          ã: "a",
          ä: "a",
          å: "a",
          Ç: "C",
          ç: "c",
          Ð: "D",
          ð: "d",
          È: "E",
          É: "E",
          Ê: "E",
          Ë: "E",
          è: "e",
          é: "e",
          ê: "e",
          ë: "e",
          Ì: "I",
          Í: "I",
          Î: "I",
          Ï: "I",
          ì: "i",
          í: "i",
          î: "i",
          ï: "i",
          Ñ: "N",
          ñ: "n",
          Ò: "O",
          Ó: "O",
          Ô: "O",
          Õ: "O",
          Ö: "O",
          Ø: "O",
          ò: "o",
          ó: "o",
          ô: "o",
          õ: "o",
          ö: "o",
          ø: "o",
          Ù: "U",
          Ú: "U",
          Û: "U",
          Ü: "U",
          ù: "u",
          ú: "u",
          û: "u",
          ü: "u",
          Ý: "Y",
          ý: "y",
          ÿ: "y",
          Æ: "Ae",
          æ: "ae",
          Þ: "Th",
          þ: "th",
          ß: "ss",
          Ā: "A",
          Ă: "A",
          Ą: "A",
          ā: "a",
          ă: "a",
          ą: "a",
          Ć: "C",
          Ĉ: "C",
          Ċ: "C",
          Č: "C",
          ć: "c",
          ĉ: "c",
          ċ: "c",
          č: "c",
          Ď: "D",
          Đ: "D",
          ď: "d",
          đ: "d",
          Ē: "E",
          Ĕ: "E",
          Ė: "E",
          Ę: "E",
          Ě: "E",
          ē: "e",
          ĕ: "e",
          ė: "e",
          ę: "e",
          ě: "e",
          Ĝ: "G",
          Ğ: "G",
          Ġ: "G",
          Ģ: "G",
          ĝ: "g",
          ğ: "g",
          ġ: "g",
          ģ: "g",
          Ĥ: "H",
          Ħ: "H",
          ĥ: "h",
          ħ: "h",
          Ĩ: "I",
          Ī: "I",
          Ĭ: "I",
          Į: "I",
          İ: "I",
          ĩ: "i",
          ī: "i",
          ĭ: "i",
          į: "i",
          ı: "i",
          Ĵ: "J",
          ĵ: "j",
          Ķ: "K",
          ķ: "k",
          ĸ: "k",
          Ĺ: "L",
          Ļ: "L",
          Ľ: "L",
          Ŀ: "L",
          Ł: "L",
          ĺ: "l",
          ļ: "l",
          ľ: "l",
          ŀ: "l",
          ł: "l",
          Ń: "N",
          Ņ: "N",
          Ň: "N",
          Ŋ: "N",
          ń: "n",
          ņ: "n",
          ň: "n",
          ŋ: "n",
          Ō: "O",
          Ŏ: "O",
          Ő: "O",
          ō: "o",
          ŏ: "o",
          ő: "o",
          Ŕ: "R",
          Ŗ: "R",
          Ř: "R",
          ŕ: "r",
          ŗ: "r",
          ř: "r",
          Ś: "S",
          Ŝ: "S",
          Ş: "S",
          Š: "S",
          ś: "s",
          ŝ: "s",
          ş: "s",
          š: "s",
          Ţ: "T",
          Ť: "T",
          Ŧ: "T",
          ţ: "t",
          ť: "t",
          ŧ: "t",
          Ũ: "U",
          Ū: "U",
          Ŭ: "U",
          Ů: "U",
          Ű: "U",
          Ų: "U",
          ũ: "u",
          ū: "u",
          ŭ: "u",
          ů: "u",
          ű: "u",
          ų: "u",
          Ŵ: "W",
          ŵ: "w",
          Ŷ: "Y",
          ŷ: "y",
          Ÿ: "Y",
          Ź: "Z",
          Ż: "Z",
          Ž: "Z",
          ź: "z",
          ż: "z",
          ž: "z",
          Ĳ: "IJ",
          ĳ: "ij",
          Œ: "Oe",
          œ: "oe",
          ŉ: "'n",
          ſ: "s"
        });
        var tn = Wt({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "\"": "&quot;",
          "'": "&#39;"
        });
        function nn(e) {
          return "\\" + st[e];
        }
        function rn(e) {
          return et.test(e);
        }
        function on(e) {
          var t = -1;
          var n = Array(e.size);
          e.forEach(function (e, r) {
            n[++t] = [r, e];
          });
          return n;
        }
        function sn(e, t) {
          return function (n) {
            return e(t(n));
          };
        }
        function an(e, t) {
          for (var n = -1, r = e.length, i = 0, o = []; ++n < r;) {
            var s = e[n];
            if (s === t || s === a) {
              e[n] = a;
              o[i++] = n;
            }
          }
          return o;
        }
        function un(e) {
          var t = -1;
          var n = Array(e.size);
          e.forEach(function (e) {
            n[++t] = e;
          });
          return n;
        }
        function ln(e) {
          var t = -1;
          var n = Array(e.size);
          e.forEach(function (e) {
            n[++t] = [e, e];
          });
          return n;
        }
        function cn(e) {
          if (rn(e)) {
            return function (e) {
              var t = Ke.lastIndex = 0;
              while (Ke.test(e)) {
                ++t;
              }
              return t;
            }(e);
          } else {
            return Bt(e);
          }
        }
        function hn(e) {
          if (rn(e)) {
            return function (e) {
              return e.match(Ke) || [];
            }(e);
          } else {
            return function (e) {
              return e.split("");
            }(e);
          }
        }
        function dn(e) {
          for (var t = e.length; t-- && ie.test(e.charAt(t)););
          return t;
        }
        var fn = Wt({
          "&amp;": "&",
          "&lt;": "<",
          "&gt;": ">",
          "&quot;": "\"",
          "&#39;": "'"
        });
        var gn = function e(t) {
          var n;
          var r = (t = t == null ? ht : gn.defaults(ht.Object(), t, gn.pick(ht, nt))).Array;
          var ie = t.Date;
          var be = t.Error;
          var ke = t.Function;
          var Ie = t.Math;
          var Ee = t.Object;
          var Se = t.RegExp;
          var Ae = t.String;
          var Me = t.TypeError;
          var Te = r.prototype;
          var De = ke.prototype;
          var Re = Ee.prototype;
          var Pe = t["__core-js_shared__"];
          var Oe = De.toString;
          var xe = Re.hasOwnProperty;
          var Le = 0;
          var Ce = (n = /[^.]+$/.exec(Pe && Pe.keys && Pe.keys.IE_PROTO || "")) ? "Symbol(src)_1." + n : "";
          var Be = Re.toString;
          var Ue = Oe.call(Ee);
          var je = ht._;
          var Ge = Se("^" + Oe.call(xe).replace(te, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
          var Ne = gt ? t.Buffer : i;
          var qe = t.Symbol;
          var ze = t.Uint8Array;
          var Fe = Ne ? Ne.allocUnsafe : i;
          var We = sn(Ee.getPrototypeOf, Ee);
          var Ve = Ee.create;
          var $e = Re.propertyIsEnumerable;
          var Je = Te.splice;
          var Qe = qe ? qe.isConcatSpreadable : i;
          var He = qe ? qe.iterator : i;
          var Ke = qe ? qe.toStringTag : i;
          var et = function () {
            try {
              var e = uo(Ee, "defineProperty");
              e({}, "", {});
              return e;
            } catch (e) {}
          }();
          var st = t.clearTimeout !== ht.clearTimeout && t.clearTimeout;
          var lt = ie && ie.now !== ht.Date.now && ie.now;
          var ct = t.setTimeout !== ht.setTimeout && t.setTimeout;
          var dt = Ie.ceil;
          var ft = Ie.floor;
          var pt = Ee.getOwnPropertySymbols;
          var vt = Ne ? Ne.isBuffer : i;
          var Bt = t.isFinite;
          var Wt = Te.join;
          var pn = sn(Ee.keys, Ee);
          var vn = Ie.max;
          var yn = Ie.min;
          var _n = ie.now;
          var mn = t.parseInt;
          var wn = Ie.random;
          var bn = Te.reverse;
          var kn = uo(t, "DataView");
          var In = uo(t, "Map");
          var En = uo(t, "Promise");
          var Sn = uo(t, "Set");
          var An = uo(t, "WeakMap");
          var Mn = uo(Ee, "create");
          var Tn = An && new An();
          var Dn = {};
          var Rn = Uo(kn);
          var Pn = Uo(In);
          var On = Uo(En);
          var xn = Uo(Sn);
          var Ln = Uo(An);
          var Cn = qe ? qe.prototype : i;
          var Bn = Cn ? Cn.valueOf : i;
          var Un = Cn ? Cn.toString : i;
          function jn(e) {
            if (ea(e) && !Fs(e) && !(e instanceof zn)) {
              if (e instanceof qn) {
                return e;
              }
              if (xe.call(e, "__wrapped__")) {
                return jo(e);
              }
            }
            return new qn(e);
          }
          var Gn = function () {
            function e() {}
            return function (t) {
              if (!Ys(t)) {
                return {};
              }
              if (Ve) {
                return Ve(t);
              }
              e.prototype = t;
              var n = new e();
              e.prototype = i;
              return n;
            };
          }();
          function Nn() {}
          function qn(e, t) {
            this.__wrapped__ = e;
            this.__actions__ = [];
            this.__chain__ = !!t;
            this.__index__ = 0;
            this.__values__ = i;
          }
          function zn(e) {
            this.__wrapped__ = e;
            this.__actions__ = [];
            this.__dir__ = 1;
            this.__filtered__ = false;
            this.__iteratees__ = [];
            this.__takeCount__ = f;
            this.__views__ = [];
          }
          function Fn(e) {
            var t = -1;
            var n = e == null ? 0 : e.length;
            for (this.clear(); ++t < n;) {
              var r = e[t];
              this.set(r[0], r[1]);
            }
          }
          function Wn(e) {
            var t = -1;
            var n = e == null ? 0 : e.length;
            for (this.clear(); ++t < n;) {
              var r = e[t];
              this.set(r[0], r[1]);
            }
          }
          function Vn(e) {
            var t = -1;
            var n = e == null ? 0 : e.length;
            for (this.clear(); ++t < n;) {
              var r = e[t];
              this.set(r[0], r[1]);
            }
          }
          function $n(e) {
            var t = -1;
            var n = e == null ? 0 : e.length;
            for (this.__data__ = new Vn(); ++t < n;) {
              this.add(e[t]);
            }
          }
          function Jn(e) {
            var t = this.__data__ = new Wn(e);
            this.size = t.size;
          }
          function Qn(e, t) {
            var n = Fs(e);
            var r = !n && zs(e);
            var i = !n && !r && Js(e);
            var o = !n && !r && !i && ua(e);
            var s = n || r || i || o;
            var a = s ? Jt(e.length, Ae) : [];
            var u = a.length;
            for (var l in e) {
              if ((!!t || !!xe.call(e, l)) && (!s || l != "length" && (!i || l != "offset" && l != "parent") && (!o || l != "buffer" && l != "byteLength" && l != "byteOffset") && !vo(l, u))) {
                a.push(l);
              }
            }
            return a;
          }
          function Hn(e) {
            var t = e.length;
            if (t) {
              return e[Vr(0, t - 1)];
            } else {
              return i;
            }
          }
          function Xn(e, t) {
            return Oo(Ai(e), or(t, 0, e.length));
          }
          function Zn(e) {
            return Oo(Ai(e));
          }
          function Kn(e, t, n) {
            if (n !== i && !Gs(e[t], n) || n === i && !(t in e)) {
              rr(e, t, n);
            }
          }
          function Yn(e, t, n) {
            var r = e[t];
            if (!xe.call(e, t) || !Gs(r, n) || n === i && !(t in e)) {
              rr(e, t, n);
            }
          }
          function er(e, t) {
            for (var n = e.length; n--;) {
              if (Gs(e[n][0], t)) {
                return n;
              }
            }
            return -1;
          }
          function tr(e, t, n, r) {
            cr(e, function (e, i, o) {
              t(r, e, n(e), o);
            });
            return r;
          }
          function nr(e, t) {
            return e && Mi(t, Ra(t), e);
          }
          function rr(e, t, n) {
            if (t == "__proto__" && et) {
              et(e, t, {
                configurable: true,
                enumerable: true,
                value: n,
                writable: true
              });
            } else {
              e[t] = n;
            }
          }
          function ir(e, t) {
            for (var n = -1, o = t.length, s = r(o), a = e == null; ++n < o;) {
              s[n] = a ? i : Sa(e, t[n]);
            }
            return s;
          }
          function or(e, t, n) {
            if (e == e) {
              if (n !== i) {
                e = e <= n ? e : n;
              }
              if (t !== i) {
                e = e >= t ? e : t;
              }
            }
            return e;
          }
          function sr(e, t, n, r, o, s) {
            var a;
            var u = t & 1;
            var l = t & 2;
            var c = t & 4;
            if (n) {
              a = o ? n(e, r, o, s) : n(e);
            }
            if (a !== i) {
              return a;
            }
            if (!Ys(e)) {
              return e;
            }
            var h = Fs(e);
            if (h) {
              a = function (e) {
                var t = e.length;
                var n = new e.constructor(t);
                if (t && typeof e[0] == "string" && xe.call(e, "index")) {
                  n.index = e.index;
                  n.input = e.input;
                }
                return n;
              }(e);
              if (!u) {
                return Ai(e, a);
              }
            } else {
              var d = ho(e);
              var f = d == w || d == b;
              if (Js(e)) {
                return wi(e, u);
              }
              if (d == E || d == p || f && !o) {
                a = l || f ? {} : go(e);
                if (!u) {
                  if (l) {
                    return function (e, t) {
                      return Mi(e, co(e), t);
                    }(e, function (e, t) {
                      return e && Mi(t, Pa(t), e);
                    }(a, e));
                  } else {
                    return function (e, t) {
                      return Mi(e, lo(e), t);
                    }(e, nr(a, e));
                  }
                }
              } else {
                if (!ot[d]) {
                  if (o) {
                    return e;
                  } else {
                    return {};
                  }
                }
                a = function (e, t, n) {
                  var r;
                  var i = e.constructor;
                  switch (t) {
                    case P:
                      return bi(e);
                    case y:
                    case _:
                      return new i(+e);
                    case O:
                      return function (e, t) {
                        var n = t ? bi(e.buffer) : e.buffer;
                        return new e.constructor(n, e.byteOffset, e.byteLength);
                      }(e, n);
                    case x:
                    case L:
                    case C:
                    case B:
                    case U:
                    case j:
                    case G:
                    case N:
                    case q:
                      return ki(e, n);
                    case k:
                      return new i();
                    case I:
                    case T:
                      return new i(e);
                    case A:
                      return function (e) {
                        var t = new e.constructor(e.source, de.exec(e));
                        t.lastIndex = e.lastIndex;
                        return t;
                      }(e);
                    case M:
                      return new i();
                    case D:
                      r = e;
                      if (Bn) {
                        return Ee(Bn.call(r));
                      } else {
                        return {};
                      }
                  }
                }(e, d, u);
              }
            }
            s ||= new Jn();
            var g = s.get(e);
            if (g) {
              return g;
            }
            s.set(e, a);
            if (oa(e)) {
              e.forEach(function (r) {
                a.add(sr(r, t, n, r, e, s));
              });
            } else if (ta(e)) {
              e.forEach(function (r, i) {
                a.set(i, sr(r, t, n, i, e, s));
              });
            }
            var v = h ? i : (c ? l ? to : eo : l ? Pa : Ra)(e);
            St(v || e, function (r, i) {
              if (v) {
                r = e[i = r];
              }
              Yn(a, i, sr(r, t, n, i, e, s));
            });
            return a;
          }
          function ar(e, t, n) {
            var r = n.length;
            if (e == null) {
              return !r;
            }
            for (e = Ee(e); r--;) {
              var o = n[r];
              var s = t[o];
              var a = e[o];
              if (a === i && !(o in e) || !s(a)) {
                return false;
              }
            }
            return true;
          }
          function ur(e, t, n) {
            if (typeof e != "function") {
              throw new Me(o);
            }
            return To(function () {
              e.apply(i, n);
            }, t);
          }
          function lr(e, t, n, r) {
            var i = -1;
            var o = Dt;
            var s = true;
            var a = e.length;
            var u = [];
            var l = t.length;
            if (!a) {
              return u;
            }
            if (n) {
              t = Pt(t, Ht(n));
            }
            if (r) {
              o = Rt;
              s = false;
            } else if (t.length >= 200) {
              o = Zt;
              s = false;
              t = new $n(t);
            }
            e: while (++i < a) {
              var c = e[i];
              var h = n == null ? c : n(c);
              c = r || c !== 0 ? c : 0;
              if (s && h == h) {
                for (var d = l; d--;) {
                  if (t[d] === h) {
                    continue e;
                  }
                }
                u.push(c);
              } else if (!o(t, h, r)) {
                u.push(c);
              }
            }
            return u;
          }
          jn.templateSettings = {
            escape: H,
            evaluate: X,
            interpolate: Z,
            variable: "",
            imports: {
              _: jn
            }
          };
          jn.prototype = Nn.prototype;
          jn.prototype.constructor = jn;
          qn.prototype = Gn(Nn.prototype);
          qn.prototype.constructor = qn;
          zn.prototype = Gn(Nn.prototype);
          zn.prototype.constructor = zn;
          Fn.prototype.clear = function () {
            this.__data__ = Mn ? Mn(null) : {};
            this.size = 0;
          };
          Fn.prototype.delete = function (e) {
            var t = this.has(e) && delete this.__data__[e];
            this.size -= t ? 1 : 0;
            return t;
          };
          Fn.prototype.get = function (e) {
            var t = this.__data__;
            if (Mn) {
              var n = t[e];
              if (n === s) {
                return i;
              } else {
                return n;
              }
            }
            if (xe.call(t, e)) {
              return t[e];
            } else {
              return i;
            }
          };
          Fn.prototype.has = function (e) {
            var t = this.__data__;
            if (Mn) {
              return t[e] !== i;
            } else {
              return xe.call(t, e);
            }
          };
          Fn.prototype.set = function (e, t) {
            var n = this.__data__;
            this.size += this.has(e) ? 0 : 1;
            n[e] = Mn && t === i ? s : t;
            return this;
          };
          Wn.prototype.clear = function () {
            this.__data__ = [];
            this.size = 0;
          };
          Wn.prototype.delete = function (e) {
            var t = this.__data__;
            var n = er(t, e);
            return !(n < 0) && !(n == t.length - 1 ? t.pop() : Je.call(t, n, 1), --this.size, 0);
          };
          Wn.prototype.get = function (e) {
            var t = this.__data__;
            var n = er(t, e);
            if (n < 0) {
              return i;
            } else {
              return t[n][1];
            }
          };
          Wn.prototype.has = function (e) {
            return er(this.__data__, e) > -1;
          };
          Wn.prototype.set = function (e, t) {
            var n = this.__data__;
            var r = er(n, e);
            if (r < 0) {
              ++this.size;
              n.push([e, t]);
            } else {
              n[r][1] = t;
            }
            return this;
          };
          Vn.prototype.clear = function () {
            this.size = 0;
            this.__data__ = {
              hash: new Fn(),
              map: new (In || Wn)(),
              string: new Fn()
            };
          };
          Vn.prototype.delete = function (e) {
            var t = so(this, e).delete(e);
            this.size -= t ? 1 : 0;
            return t;
          };
          Vn.prototype.get = function (e) {
            return so(this, e).get(e);
          };
          Vn.prototype.has = function (e) {
            return so(this, e).has(e);
          };
          Vn.prototype.set = function (e, t) {
            var n = so(this, e);
            var r = n.size;
            n.set(e, t);
            this.size += n.size == r ? 0 : 1;
            return this;
          };
          $n.prototype.add = $n.prototype.push = function (e) {
            this.__data__.set(e, s);
            return this;
          };
          $n.prototype.has = function (e) {
            return this.__data__.has(e);
          };
          Jn.prototype.clear = function () {
            this.__data__ = new Wn();
            this.size = 0;
          };
          Jn.prototype.delete = function (e) {
            var t = this.__data__;
            var n = t.delete(e);
            this.size = t.size;
            return n;
          };
          Jn.prototype.get = function (e) {
            return this.__data__.get(e);
          };
          Jn.prototype.has = function (e) {
            return this.__data__.has(e);
          };
          Jn.prototype.set = function (e, t) {
            var n = this.__data__;
            if (n instanceof Wn) {
              var r = n.__data__;
              if (!In || r.length < 199) {
                r.push([e, t]);
                this.size = ++n.size;
                return this;
              }
              n = this.__data__ = new Vn(r);
            }
            n.set(e, t);
            this.size = n.size;
            return this;
          };
          var cr = Ri(_r);
          var hr = Ri(mr, true);
          function dr(e, t) {
            var n = true;
            cr(e, function (e, r, i) {
              return n = !!t(e, r, i);
            });
            return n;
          }
          function fr(e, t, n) {
            for (var r = -1, o = e.length; ++r < o;) {
              var s = e[r];
              var a = t(s);
              if (a != null && (u === i ? a == a && !aa(a) : n(a, u))) {
                var u = a;
                var l = s;
              }
            }
            return l;
          }
          function gr(e, t) {
            var n = [];
            cr(e, function (e, r, i) {
              if (t(e, r, i)) {
                n.push(e);
              }
            });
            return n;
          }
          function pr(e, t, n, r, i) {
            var o = -1;
            var s = e.length;
            n ||= po;
            i ||= [];
            while (++o < s) {
              var a = e[o];
              if (t > 0 && n(a)) {
                if (t > 1) {
                  pr(a, t - 1, n, r, i);
                } else {
                  Ot(i, a);
                }
              } else if (!r) {
                i[i.length] = a;
              }
            }
            return i;
          }
          var vr = Pi();
          var yr = Pi(true);
          function _r(e, t) {
            return e && vr(e, t, Ra);
          }
          function mr(e, t) {
            return e && yr(e, t, Ra);
          }
          function wr(e, t) {
            return Tt(t, function (t) {
              return Xs(e[t]);
            });
          }
          function br(e, t) {
            for (var n = 0, r = (t = vi(t, e)).length; e != null && n < r;) {
              e = e[Bo(t[n++])];
            }
            if (n && n == r) {
              return e;
            } else {
              return i;
            }
          }
          function kr(e, t, n) {
            var r = t(e);
            if (Fs(e)) {
              return r;
            } else {
              return Ot(r, n(e));
            }
          }
          function Ir(e) {
            if (e == null) {
              if (e === i) {
                return "[object Undefined]";
              } else {
                return "[object Null]";
              }
            } else if (Ke && Ke in Ee(e)) {
              return function (e) {
                var t = xe.call(e, Ke);
                var n = e[Ke];
                try {
                  e[Ke] = i;
                  var r = true;
                } catch (e) {}
                var o = Be.call(e);
                if (r) {
                  if (t) {
                    e[Ke] = n;
                  } else {
                    delete e[Ke];
                  }
                }
                return o;
              }(e);
            } else {
              return function (e) {
                return Be.call(e);
              }(e);
            }
          }
          function Er(e, t) {
            return e > t;
          }
          function Sr(e, t) {
            return e != null && xe.call(e, t);
          }
          function Ar(e, t) {
            return e != null && t in Ee(e);
          }
          function Mr(e, t, n) {
            var o = n ? Rt : Dt;
            var s = e[0].length;
            var a = e.length;
            for (var u = a, l = r(a), c = Infinity, h = []; u--;) {
              var d = e[u];
              if (u && t) {
                d = Pt(d, Ht(t));
              }
              c = yn(d.length, c);
              l[u] = !n && (t || s >= 120 && d.length >= 120) ? new $n(u && d) : i;
            }
            d = e[0];
            var f = -1;
            var g = l[0];
            e: while (++f < s && h.length < c) {
              var p = d[f];
              var v = t ? t(p) : p;
              p = n || p !== 0 ? p : 0;
              if (!(g ? Zt(g, v) : o(h, v, n))) {
                for (u = a; --u;) {
                  var y = l[u];
                  if (!(y ? Zt(y, v) : o(e[u], v, n))) {
                    continue e;
                  }
                }
                if (g) {
                  g.push(v);
                }
                h.push(p);
              }
            }
            return h;
          }
          function Tr(e, t, n) {
            var r = (e = So(e, t = vi(t, e))) == null ? e : e[Bo(Ho(t))];
            if (r == null) {
              return i;
            } else {
              return It(r, e, n);
            }
          }
          function Dr(e) {
            return ea(e) && Ir(e) == p;
          }
          function Rr(e, t, n, r, o) {
            return e === t || (e == null || t == null || !ea(e) && !ea(t) ? e != e && t != t : function (e, t, n, r, o, s) {
              var a = Fs(e);
              var u = Fs(t);
              var l = a ? v : ho(e);
              var c = u ? v : ho(t);
              var h = (l = l == p ? E : l) == E;
              var d = (c = c == p ? E : c) == E;
              var f = l == c;
              if (f && Js(e)) {
                if (!Js(t)) {
                  return false;
                }
                a = true;
                h = false;
              }
              if (f && !h) {
                s ||= new Jn();
                if (a || ua(e)) {
                  return Ki(e, t, n, r, o, s);
                } else {
                  return function (e, t, n, r, i, o, s) {
                    switch (n) {
                      case O:
                        if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset) {
                          return false;
                        }
                        e = e.buffer;
                        t = t.buffer;
                      case P:
                        return e.byteLength == t.byteLength && !!o(new ze(e), new ze(t));
                      case y:
                      case _:
                      case I:
                        return Gs(+e, +t);
                      case m:
                        return e.name == t.name && e.message == t.message;
                      case A:
                      case T:
                        return e == t + "";
                      case k:
                        var a = on;
                      case M:
                        var u = r & 1;
                        a ||= un;
                        if (e.size != t.size && !u) {
                          return false;
                        }
                        var l = s.get(e);
                        if (l) {
                          return l == t;
                        }
                        r |= 2;
                        s.set(e, t);
                        var c = Ki(a(e), a(t), r, i, o, s);
                        s.delete(e);
                        return c;
                      case D:
                        if (Bn) {
                          return Bn.call(e) == Bn.call(t);
                        }
                    }
                    return false;
                  }(e, t, l, n, r, o, s);
                }
              }
              if (!(n & 1)) {
                var g = h && xe.call(e, "__wrapped__");
                var w = d && xe.call(t, "__wrapped__");
                if (g || w) {
                  var b = g ? e.value() : e;
                  var S = w ? t.value() : t;
                  s ||= new Jn();
                  return o(b, S, n, r, s);
                }
              }
              return !!f && (s ||= new Jn(), function (e, t, n, r, o, s) {
                var a = n & 1;
                var u = eo(e);
                var l = u.length;
                if (l != eo(t).length && !a) {
                  return false;
                }
                for (var c = l; c--;) {
                  var h = u[c];
                  if (!(a ? h in t : xe.call(t, h))) {
                    return false;
                  }
                }
                var d = s.get(e);
                var f = s.get(t);
                if (d && f) {
                  return d == t && f == e;
                }
                var g = true;
                s.set(e, t);
                s.set(t, e);
                var p = a;
                for (; ++c < l;) {
                  var v = e[h = u[c]];
                  var y = t[h];
                  if (r) {
                    var _ = a ? r(y, v, h, t, e, s) : r(v, y, h, e, t, s);
                  }
                  if (!(_ === i ? v === y || o(v, y, n, r, s) : _)) {
                    g = false;
                    break;
                  }
                  p ||= h == "constructor";
                }
                if (g && !p) {
                  var m = e.constructor;
                  var w = t.constructor;
                  if (m != w && !!("constructor" in e) && !!("constructor" in t) && (typeof m != "function" || !(m instanceof m) || typeof w != "function" || !(w instanceof w))) {
                    g = false;
                  }
                }
                s.delete(e);
                s.delete(t);
                return g;
              }(e, t, n, r, o, s));
            }(e, t, n, r, Rr, o));
          }
          function Pr(e, t, n, r) {
            var o = n.length;
            var s = o;
            var a = !r;
            if (e == null) {
              return !s;
            }
            for (e = Ee(e); o--;) {
              var u = n[o];
              if (a && u[2] ? u[1] !== e[u[0]] : !(u[0] in e)) {
                return false;
              }
            }
            while (++o < s) {
              var l = (u = n[o])[0];
              var c = e[l];
              var h = u[1];
              if (a && u[2]) {
                if (c === i && !(l in e)) {
                  return false;
                }
              } else {
                var d = new Jn();
                if (r) {
                  var f = r(c, h, l, e, t, d);
                }
                if (!(f === i ? Rr(h, c, 3, r, d) : f)) {
                  return false;
                }
              }
            }
            return true;
          }
          function Or(e) {
            return !!Ys(e) && !(t = e, Ce && Ce in t) && (Xs(e) ? Ge : pe).test(Uo(e));
            var t;
          }
          function xr(e) {
            if (typeof e == "function") {
              return e;
            } else if (e == null) {
              return nu;
            } else if (typeof e == "object") {
              if (Fs(e)) {
                return jr(e[0], e[1]);
              } else {
                return Ur(e);
              }
            } else {
              return hu(e);
            }
          }
          function Lr(e) {
            if (!bo(e)) {
              return pn(e);
            }
            var t = [];
            for (var n in Ee(e)) {
              if (xe.call(e, n) && n != "constructor") {
                t.push(n);
              }
            }
            return t;
          }
          function Cr(e, t) {
            return e < t;
          }
          function Br(e, t) {
            var n = -1;
            var i = Vs(e) ? r(e.length) : [];
            cr(e, function (e, r, o) {
              i[++n] = t(e, r, o);
            });
            return i;
          }
          function Ur(e) {
            var t = ao(e);
            if (t.length == 1 && t[0][2]) {
              return Io(t[0][0], t[0][1]);
            } else {
              return function (n) {
                return n === e || Pr(n, e, t);
              };
            }
          }
          function jr(e, t) {
            if (_o(e) && ko(t)) {
              return Io(Bo(e), t);
            } else {
              return function (n) {
                var r = Sa(n, e);
                if (r === i && r === t) {
                  return Aa(n, e);
                } else {
                  return Rr(t, r, 3);
                }
              };
            }
          }
          function Gr(e, t, n, r, o) {
            if (e !== t) {
              vr(t, function (s, a) {
                o ||= new Jn();
                if (Ys(s)) {
                  (function (e, t, n, r, o, s, a) {
                    var u = Ao(e, n);
                    var l = Ao(t, n);
                    var c = a.get(l);
                    if (c) {
                      Kn(e, n, c);
                    } else {
                      var h = s ? s(u, l, n + "", e, t, a) : i;
                      var d = h === i;
                      if (d) {
                        var f = Fs(l);
                        var g = !f && Js(l);
                        var p = !f && !g && ua(l);
                        h = l;
                        if (f || g || p) {
                          if (Fs(u)) {
                            h = u;
                          } else if ($s(u)) {
                            h = Ai(u);
                          } else if (g) {
                            d = false;
                            h = wi(l, true);
                          } else if (p) {
                            d = false;
                            h = ki(l, true);
                          } else {
                            h = [];
                          }
                        } else if (ra(l) || zs(l)) {
                          h = u;
                          if (zs(u)) {
                            h = va(u);
                          } else if (!Ys(u) || !!Xs(u)) {
                            h = go(l);
                          }
                        } else {
                          d = false;
                        }
                      }
                      if (d) {
                        a.set(l, h);
                        o(h, l, r, s, a);
                        a.delete(l);
                      }
                      Kn(e, n, h);
                    }
                  })(e, t, a, n, Gr, r, o);
                } else {
                  var u = r ? r(Ao(e, a), s, a + "", e, t, o) : i;
                  if (u === i) {
                    u = s;
                  }
                  Kn(e, a, u);
                }
              }, Pa);
            }
          }
          function Nr(e, t) {
            var n = e.length;
            if (n) {
              if (vo(t += t < 0 ? n : 0, n)) {
                return e[t];
              } else {
                return i;
              }
            }
          }
          function qr(e, t, n) {
            t = t.length ? Pt(t, function (e) {
              if (Fs(e)) {
                return function (t) {
                  return br(t, e.length === 1 ? e[0] : e);
                };
              } else {
                return e;
              }
            }) : [nu];
            var r = -1;
            t = Pt(t, Ht(oo()));
            var i = Br(e, function (e, n, i) {
              var o = Pt(t, function (t) {
                return t(e);
              });
              return {
                criteria: o,
                index: ++r,
                value: e
              };
            });
            return function (e) {
              var t = e.length;
              for (e.sort(function (e, t) {
                return function (e, t, n) {
                  for (var r = -1, i = e.criteria, o = t.criteria, s = i.length, a = n.length; ++r < s;) {
                    var u = Ii(i[r], o[r]);
                    if (u) {
                      if (r >= a) {
                        return u;
                      } else {
                        return u * (n[r] == "desc" ? -1 : 1);
                      }
                    }
                  }
                  return e.index - t.index;
                }(e, t, n);
              }); t--;) {
                e[t] = e[t].value;
              }
              return e;
            }(i);
          }
          function zr(e, t, n) {
            for (var r = -1, i = t.length, o = {}; ++r < i;) {
              var s = t[r];
              var a = br(e, s);
              if (n(a, s)) {
                Xr(o, vi(s, e), a);
              }
            }
            return o;
          }
          function Fr(e, t, n, r) {
            var i = r ? Nt : Gt;
            var o = -1;
            var s = t.length;
            var a = e;
            if (e === t) {
              t = Ai(t);
            }
            if (n) {
              a = Pt(e, Ht(n));
            }
            while (++o < s) {
              for (var u = 0, l = t[o], c = n ? n(l) : l; (u = i(a, c, u, r)) > -1;) {
                if (a !== e) {
                  Je.call(a, u, 1);
                }
                Je.call(e, u, 1);
              }
            }
            return e;
          }
          function Wr(e, t) {
            for (var n = e ? t.length : 0, r = n - 1; n--;) {
              var i = t[n];
              if (n == r || i !== o) {
                var o = i;
                if (vo(i)) {
                  Je.call(e, i, 1);
                } else {
                  ui(e, i);
                }
              }
            }
            return e;
          }
          function Vr(e, t) {
            return e + ft(wn() * (t - e + 1));
          }
          function $r(e, t) {
            var n = "";
            if (!e || t < 1 || t > h) {
              return n;
            }
            do {
              if (t % 2) {
                n += e;
              }
              if (t = ft(t / 2)) {
                e += e;
              }
            } while (t);
            return n;
          }
          function Jr(e, t) {
            return Do(Eo(e, t, nu), e + "");
          }
          function Qr(e) {
            return Hn(Ga(e));
          }
          function Hr(e, t) {
            var n = Ga(e);
            return Oo(n, or(t, 0, n.length));
          }
          function Xr(e, t, n, r) {
            if (!Ys(e)) {
              return e;
            }
            for (var o = -1, s = (t = vi(t, e)).length, a = s - 1, u = e; u != null && ++o < s;) {
              var l = Bo(t[o]);
              var c = n;
              if (l === "__proto__" || l === "constructor" || l === "prototype") {
                return e;
              }
              if (o != a) {
                var h = u[l];
                if ((c = r ? r(h, l, u) : i) === i) {
                  c = Ys(h) ? h : vo(t[o + 1]) ? [] : {};
                }
              }
              Yn(u, l, c);
              u = u[l];
            }
            return e;
          }
          var Zr = Tn ? function (e, t) {
            Tn.set(e, t);
            return e;
          } : nu;
          var Kr = et ? function (e, t) {
            return et(e, "toString", {
              configurable: true,
              enumerable: false,
              value: Ya(t),
              writable: true
            });
          } : nu;
          function Yr(e) {
            return Oo(Ga(e));
          }
          function ei(e, t, n) {
            var i = -1;
            var o = e.length;
            if (t < 0) {
              t = -t > o ? 0 : o + t;
            }
            if ((n = n > o ? o : n) < 0) {
              n += o;
            }
            o = t > n ? 0 : n - t >>> 0;
            t >>>= 0;
            var s = r(o);
            for (; ++i < o;) {
              s[i] = e[i + t];
            }
            return s;
          }
          function ti(e, t) {
            var n;
            cr(e, function (e, r, i) {
              return !(n = t(e, r, i));
            });
            return !!n;
          }
          function ni(e, t, n) {
            var r = 0;
            var i = e == null ? r : e.length;
            if (typeof t == "number" && t == t && i <= 2147483647) {
              while (r < i) {
                var o = r + i >>> 1;
                var s = e[o];
                if (s !== null && !aa(s) && (n ? s <= t : s < t)) {
                  r = o + 1;
                } else {
                  i = o;
                }
              }
              return i;
            }
            return ri(e, t, nu, n);
          }
          function ri(e, t, n, r) {
            var o = 0;
            var s = e == null ? 0 : e.length;
            if (s === 0) {
              return 0;
            }
            var a = (t = n(t)) != t;
            var u = t === null;
            var l = aa(t);
            var c = t === i;
            for (; o < s;) {
              var h = ft((o + s) / 2);
              var d = n(e[h]);
              var f = d !== i;
              var g = d === null;
              var p = d == d;
              var v = aa(d);
              if (a) {
                var y = r || p;
              } else {
                y = c ? p && (r || f) : u ? p && f && (r || !g) : l ? p && f && !g && (r || !v) : !g && !v && (r ? d <= t : d < t);
              }
              if (y) {
                o = h + 1;
              } else {
                s = h;
              }
            }
            return yn(s, 4294967294);
          }
          function ii(e, t) {
            for (var n = -1, r = e.length, i = 0, o = []; ++n < r;) {
              var s = e[n];
              var a = t ? t(s) : s;
              if (!n || !Gs(a, u)) {
                var u = a;
                o[i++] = s === 0 ? 0 : s;
              }
            }
            return o;
          }
          function oi(e) {
            if (typeof e == "number") {
              return e;
            } else if (aa(e)) {
              return d;
            } else {
              return +e;
            }
          }
          function si(e) {
            if (typeof e == "string") {
              return e;
            }
            if (Fs(e)) {
              return Pt(e, si) + "";
            }
            if (aa(e)) {
              if (Un) {
                return Un.call(e);
              } else {
                return "";
              }
            }
            var t = e + "";
            if (t == "0" && 1 / e == -Infinity) {
              return "-0";
            } else {
              return t;
            }
          }
          function ai(e, t, n) {
            var r = -1;
            var i = Dt;
            var o = e.length;
            var s = true;
            var a = [];
            var u = a;
            if (n) {
              s = false;
              i = Rt;
            } else if (o >= 200) {
              var l = t ? null : $i(e);
              if (l) {
                return un(l);
              }
              s = false;
              i = Zt;
              u = new $n();
            } else {
              u = t ? [] : a;
            }
            e: while (++r < o) {
              var c = e[r];
              var h = t ? t(c) : c;
              c = n || c !== 0 ? c : 0;
              if (s && h == h) {
                for (var d = u.length; d--;) {
                  if (u[d] === h) {
                    continue e;
                  }
                }
                if (t) {
                  u.push(h);
                }
                a.push(c);
              } else if (!i(u, h, n)) {
                if (u !== a) {
                  u.push(h);
                }
                a.push(c);
              }
            }
            return a;
          }
          function ui(e, t) {
            return (e = So(e, t = vi(t, e))) == null || delete e[Bo(Ho(t))];
          }
          function li(e, t, n, r) {
            return Xr(e, t, n(br(e, t)), r);
          }
          function ci(e, t, n, r) {
            for (var i = e.length, o = r ? i : -1; (r ? o-- : ++o < i) && t(e[o], o, e););
            if (n) {
              return ei(e, r ? 0 : o, r ? o + 1 : i);
            } else {
              return ei(e, r ? o + 1 : 0, r ? i : o);
            }
          }
          function hi(e, t) {
            var n = e;
            if (n instanceof zn) {
              n = n.value();
            }
            return xt(t, function (e, t) {
              return t.func.apply(t.thisArg, Ot([e], t.args));
            }, n);
          }
          function di(e, t, n) {
            var i = e.length;
            if (i < 2) {
              if (i) {
                return ai(e[0]);
              } else {
                return [];
              }
            }
            for (var o = -1, s = r(i); ++o < i;) {
              var a = e[o];
              for (var u = -1; ++u < i;) {
                if (u != o) {
                  s[o] = lr(s[o] || a, e[u], t, n);
                }
              }
            }
            return ai(pr(s, 1), t, n);
          }
          function fi(e, t, n) {
            for (var r = -1, o = e.length, s = t.length, a = {}; ++r < o;) {
              var u = r < s ? t[r] : i;
              n(a, e[r], u);
            }
            return a;
          }
          function gi(e) {
            if ($s(e)) {
              return e;
            } else {
              return [];
            }
          }
          function pi(e) {
            if (typeof e == "function") {
              return e;
            } else {
              return nu;
            }
          }
          function vi(e, t) {
            if (Fs(e)) {
              return e;
            } else if (_o(e, t)) {
              return [e];
            } else {
              return Co(ya(e));
            }
          }
          var yi = Jr;
          function _i(e, t, n) {
            var r = e.length;
            n = n === i ? r : n;
            if (!t && n >= r) {
              return e;
            } else {
              return ei(e, t, n);
            }
          }
          var mi = st || function (e) {
            return ht.clearTimeout(e);
          };
          function wi(e, t) {
            if (t) {
              return e.slice();
            }
            var n = e.length;
            var r = Fe ? Fe(n) : new e.constructor(n);
            e.copy(r);
            return r;
          }
          function bi(e) {
            var t = new e.constructor(e.byteLength);
            new ze(t).set(new ze(e));
            return t;
          }
          function ki(e, t) {
            var n = t ? bi(e.buffer) : e.buffer;
            return new e.constructor(n, e.byteOffset, e.length);
          }
          function Ii(e, t) {
            if (e !== t) {
              var n = e !== i;
              var r = e === null;
              var o = e == e;
              var s = aa(e);
              var a = t !== i;
              var u = t === null;
              var l = t == t;
              var c = aa(t);
              if (!u && !c && !s && e > t || s && a && l && !u && !c || r && a && l || !n && l || !o) {
                return 1;
              }
              if (!r && !s && !c && e < t || c && n && o && !r && !s || u && n && o || !a && o || !l) {
                return -1;
              }
            }
            return 0;
          }
          function Ei(e, t, n, i) {
            var o = -1;
            var s = e.length;
            var a = n.length;
            for (var u = -1, l = t.length, c = vn(s - a, 0), h = r(l + c), d = !i; ++u < l;) {
              h[u] = t[u];
            }
            while (++o < a) {
              if (d || o < s) {
                h[n[o]] = e[o];
              }
            }
            while (c--) {
              h[u++] = e[o++];
            }
            return h;
          }
          function Si(e, t, n, i) {
            for (var o = -1, s = e.length, a = -1, u = n.length, l = -1, c = t.length, h = vn(s - u, 0), d = r(h + c), f = !i; ++o < h;) {
              d[o] = e[o];
            }
            var g = o;
            for (; ++l < c;) {
              d[g + l] = t[l];
            }
            while (++a < u) {
              if (f || o < s) {
                d[g + n[a]] = e[o++];
              }
            }
            return d;
          }
          function Ai(e, t) {
            var n = -1;
            var i = e.length;
            for (t ||= r(i); ++n < i;) {
              t[n] = e[n];
            }
            return t;
          }
          function Mi(e, t, n, r) {
            var o = !n;
            n ||= {};
            for (var s = -1, a = t.length; ++s < a;) {
              var u = t[s];
              var l = r ? r(n[u], e[u], u, n, e) : i;
              if (l === i) {
                l = e[u];
              }
              if (o) {
                rr(n, u, l);
              } else {
                Yn(n, u, l);
              }
            }
            return n;
          }
          function Ti(e, t) {
            return function (n, r) {
              var i = Fs(n) ? Et : tr;
              var o = t ? t() : {};
              return i(n, e, oo(r, 2), o);
            };
          }
          function Di(e) {
            return Jr(function (t, n) {
              var r = -1;
              var o = n.length;
              var s = o > 1 ? n[o - 1] : i;
              var a = o > 2 ? n[2] : i;
              s = e.length > 3 && typeof s == "function" ? (o--, s) : i;
              if (a && yo(n[0], n[1], a)) {
                s = o < 3 ? i : s;
                o = 1;
              }
              t = Ee(t);
              while (++r < o) {
                var u = n[r];
                if (u) {
                  e(t, u, r, s);
                }
              }
              return t;
            });
          }
          function Ri(e, t) {
            return function (n, r) {
              if (n == null) {
                return n;
              }
              if (!Vs(n)) {
                return e(n, r);
              }
              for (var i = n.length, o = t ? i : -1, s = Ee(n); (t ? o-- : ++o < i) && r(s[o], o, s) !== false;);
              return n;
            };
          }
          function Pi(e) {
            return function (t, n, r) {
              var i = -1;
              var o = Ee(t);
              var s = r(t);
              for (var a = s.length; a--;) {
                var u = s[e ? a : ++i];
                if (n(o[u], u, o) === false) {
                  break;
                }
              }
              return t;
            };
          }
          function Oi(e) {
            return function (t) {
              var n = rn(t = ya(t)) ? hn(t) : i;
              var r = n ? n[0] : t.charAt(0);
              var o = n ? _i(n, 1).join("") : t.slice(1);
              return r[e]() + o;
            };
          }
          function xi(e) {
            return function (t) {
              return xt(Xa(za(t).replace(Xe, "")), e, "");
            };
          }
          function Li(e) {
            return function () {
              var t = arguments;
              switch (t.length) {
                case 0:
                  return new e();
                case 1:
                  return new e(t[0]);
                case 2:
                  return new e(t[0], t[1]);
                case 3:
                  return new e(t[0], t[1], t[2]);
                case 4:
                  return new e(t[0], t[1], t[2], t[3]);
                case 5:
                  return new e(t[0], t[1], t[2], t[3], t[4]);
                case 6:
                  return new e(t[0], t[1], t[2], t[3], t[4], t[5]);
                case 7:
                  return new e(t[0], t[1], t[2], t[3], t[4], t[5], t[6]);
              }
              var n = Gn(e.prototype);
              var r = e.apply(n, t);
              if (Ys(r)) {
                return r;
              } else {
                return n;
              }
            };
          }
          function Ci(e) {
            return function (t, n, r) {
              var o = Ee(t);
              if (!Vs(t)) {
                var s = oo(n, 3);
                t = Ra(t);
                n = function (e) {
                  return s(o[e], e, o);
                };
              }
              var a = e(t, n, r);
              if (a > -1) {
                return o[s ? t[a] : a];
              } else {
                return i;
              }
            };
          }
          function Bi(e) {
            return Yi(function (t) {
              var n = t.length;
              var r = n;
              var s = qn.prototype.thru;
              for (e && t.reverse(); r--;) {
                var a = t[r];
                if (typeof a != "function") {
                  throw new Me(o);
                }
                if (s && !u && ro(a) == "wrapper") {
                  var u = new qn([], true);
                }
              }
              for (r = u ? r : n; ++r < n;) {
                var l = ro(a = t[r]);
                var c = l == "wrapper" ? no(a) : i;
                u = c && mo(c[0]) && c[1] == 424 && !c[4].length && c[9] == 1 ? u[ro(c[0])].apply(u, c[3]) : a.length == 1 && mo(a) ? u[l]() : u.thru(a);
              }
              return function () {
                var e = arguments;
                var r = e[0];
                if (u && e.length == 1 && Fs(r)) {
                  return u.plant(r).value();
                }
                for (var i = 0, o = n ? t[i].apply(this, e) : r; ++i < n;) {
                  o = t[i].call(this, o);
                }
                return o;
              };
            });
          }
          function Ui(e, t, n, o, s, a, u, c, h, d) {
            var f = t & l;
            var g = t & 1;
            var p = t & 2;
            var v = t & 24;
            var y = t & 512;
            var _ = p ? i : Li(e);
            return function l() {
              var m = arguments.length;
              var w = r(m);
              for (var b = m; b--;) {
                w[b] = arguments[b];
              }
              if (v) {
                var k = io(l);
                var I = function (e, t) {
                  for (var n = e.length, r = 0; n--;) {
                    if (e[n] === t) {
                      ++r;
                    }
                  }
                  return r;
                }(w, k);
              }
              if (o) {
                w = Ei(w, o, s, v);
              }
              if (a) {
                w = Si(w, a, u, v);
              }
              m -= I;
              if (v && m < d) {
                var E = an(w, k);
                return Wi(e, t, Ui, l.placeholder, n, w, E, c, h, d - m);
              }
              var S = g ? n : this;
              var A = p ? S[e] : e;
              m = w.length;
              if (c) {
                w = function (e, t) {
                  var n = e.length;
                  for (var r = yn(t.length, n), o = Ai(e); r--;) {
                    var s = t[r];
                    e[r] = vo(s, n) ? o[s] : i;
                  }
                  return e;
                }(w, c);
              } else if (y && m > 1) {
                w.reverse();
              }
              if (f && h < m) {
                w.length = h;
              }
              if (this && this !== ht && this instanceof l) {
                A = _ || Li(A);
              }
              return A.apply(S, w);
            };
          }
          function ji(e, t) {
            return function (n, r) {
              return function (e, t, n, r) {
                _r(e, function (e, i, o) {
                  t(r, n(e), i, o);
                });
                return r;
              }(n, e, t(r), {});
            };
          }
          function Gi(e, t) {
            return function (n, r) {
              var o;
              if (n === i && r === i) {
                return t;
              }
              if (n !== i) {
                o = n;
              }
              if (r !== i) {
                if (o === i) {
                  return r;
                }
                if (typeof n == "string" || typeof r == "string") {
                  n = si(n);
                  r = si(r);
                } else {
                  n = oi(n);
                  r = oi(r);
                }
                o = e(n, r);
              }
              return o;
            };
          }
          function Ni(e) {
            return Yi(function (t) {
              t = Pt(t, Ht(oo()));
              return Jr(function (n) {
                var r = this;
                return e(t, function (e) {
                  return It(e, r, n);
                });
              });
            });
          }
          function qi(e, t) {
            var n = (t = t === i ? " " : si(t)).length;
            if (n < 2) {
              if (n) {
                return $r(t, e);
              } else {
                return t;
              }
            }
            var r = $r(t, dt(e / cn(t)));
            if (rn(t)) {
              return _i(hn(r), 0, e).join("");
            } else {
              return r.slice(0, e);
            }
          }
          function zi(e) {
            return function (t, n, o) {
              if (o && typeof o != "number" && yo(t, n, o)) {
                n = o = i;
              }
              t = da(t);
              if (n === i) {
                n = t;
                t = 0;
              } else {
                n = da(n);
              }
              return function (e, t, n, i) {
                var o = -1;
                for (var s = vn(dt((t - e) / (n || 1)), 0), a = r(s); s--;) {
                  a[i ? s : ++o] = e;
                  e += n;
                }
                return a;
              }(t, n, o = o === i ? t < n ? 1 : -1 : da(o), e);
            };
          }
          function Fi(e) {
            return function (t, n) {
              if (typeof t != "string" || typeof n != "string") {
                t = pa(t);
                n = pa(n);
              }
              return e(t, n);
            };
          }
          function Wi(e, t, n, r, o, s, a, l, c, h) {
            var d = t & 8;
            t |= d ? u : 64;
            if (!((t &= ~(d ? 64 : u)) & 4)) {
              t &= -4;
            }
            var f = [e, t, o, d ? s : i, d ? a : i, d ? i : s, d ? i : a, l, c, h];
            var g = n.apply(i, f);
            if (mo(e)) {
              Mo(g, f);
            }
            g.placeholder = r;
            return Ro(g, e, t);
          }
          function Vi(e) {
            var t = Ie[e];
            return function (e, n) {
              e = pa(e);
              if ((n = n == null ? 0 : yn(fa(n), 292)) && Bt(e)) {
                var r = (ya(e) + "e").split("e");
                return +((r = (ya(t(r[0] + "e" + (+r[1] + n))) + "e").split("e"))[0] + "e" + (+r[1] - n));
              }
              return t(e);
            };
          }
          var $i = Sn && 1 / un(new Sn([, -0]))[1] == c ? function (e) {
            return new Sn(e);
          } : au;
          function Ji(e) {
            return function (t) {
              var n = ho(t);
              if (n == k) {
                return on(t);
              } else if (n == M) {
                return ln(t);
              } else {
                return function (e, t) {
                  return Pt(t, function (t) {
                    return [t, e[t]];
                  });
                }(t, e(t));
              }
            };
          }
          function Qi(e, t, n, s, c, h, d, f) {
            var g = t & 2;
            if (!g && typeof e != "function") {
              throw new Me(o);
            }
            var p = s ? s.length : 0;
            if (!p) {
              t &= -97;
              s = c = i;
            }
            d = d === i ? d : vn(fa(d), 0);
            f = f === i ? f : fa(f);
            p -= c ? c.length : 0;
            if (t & 64) {
              var v = s;
              var y = c;
              s = c = i;
            }
            var _ = g ? i : no(e);
            var m = [e, t, n, s, c, v, y, h, d, f];
            if (_) {
              (function (e, t) {
                var n = e[1];
                var r = t[1];
                var i = n | r;
                var o = i < 131;
                var s = r == l && n == 8 || r == l && n == 256 && e[7].length <= t[8] || r == 384 && t[7].length <= t[8] && n == 8;
                if (!o && !s) {
                  return e;
                }
                if (r & 1) {
                  e[2] = t[2];
                  i |= n & 1 ? 0 : 4;
                }
                var u = t[3];
                if (u) {
                  var c = e[3];
                  e[3] = c ? Ei(c, u, t[4]) : u;
                  e[4] = c ? an(e[3], a) : t[4];
                }
                if (u = t[5]) {
                  c = e[5];
                  e[5] = c ? Si(c, u, t[6]) : u;
                  e[6] = c ? an(e[5], a) : t[6];
                }
                if (u = t[7]) {
                  e[7] = u;
                }
                if (r & l) {
                  e[8] = e[8] == null ? t[8] : yn(e[8], t[8]);
                }
                if (e[9] == null) {
                  e[9] = t[9];
                }
                e[0] = t[0];
                e[1] = i;
              })(m, _);
            }
            e = m[0];
            t = m[1];
            n = m[2];
            s = m[3];
            c = m[4];
            if (!(f = m[9] = m[9] === i ? g ? 0 : e.length : vn(m[9] - p, 0)) && t & 24) {
              t &= -25;
            }
            if (t && t != 1) {
              w = t == 8 || t == 16 ? function (e, t, n) {
                var o = Li(e);
                return function s() {
                  var a = arguments.length;
                  var u = r(a);
                  for (var l = a, c = io(s); l--;) {
                    u[l] = arguments[l];
                  }
                  var h = a < 3 && u[0] !== c && u[a - 1] !== c ? [] : an(u, c);
                  if ((a -= h.length) < n) {
                    return Wi(e, t, Ui, s.placeholder, i, u, h, i, i, n - a);
                  } else {
                    return It(this && this !== ht && this instanceof s ? o : e, this, u);
                  }
                };
              }(e, t, f) : t != u && t != 33 || c.length ? Ui.apply(i, m) : function (e, t, n, i) {
                var o = t & 1;
                var s = Li(e);
                return function t() {
                  var a = -1;
                  var u = arguments.length;
                  for (var l = -1, c = i.length, h = r(c + u), d = this && this !== ht && this instanceof t ? s : e; ++l < c;) {
                    h[l] = i[l];
                  }
                  while (u--) {
                    h[l++] = arguments[++a];
                  }
                  return It(d, o ? n : this, h);
                };
              }(e, t, n, s);
            } else {
              var w = function (e, t, n) {
                var r = t & 1;
                var i = Li(e);
                return function t() {
                  return (this && this !== ht && this instanceof t ? i : e).apply(r ? n : this, arguments);
                };
              }(e, t, n);
            }
            return Ro((_ ? Zr : Mo)(w, m), e, t);
          }
          function Hi(e, t, n, r) {
            if (e === i || Gs(e, Re[n]) && !xe.call(r, n)) {
              return t;
            } else {
              return e;
            }
          }
          function Xi(e, t, n, r, o, s) {
            if (Ys(e) && Ys(t)) {
              s.set(t, e);
              Gr(e, t, i, Xi, s);
              s.delete(t);
            }
            return e;
          }
          function Zi(e) {
            if (ra(e)) {
              return i;
            } else {
              return e;
            }
          }
          function Ki(e, t, n, r, o, s) {
            var a = n & 1;
            var u = e.length;
            var l = t.length;
            if (u != l && (!a || !(l > u))) {
              return false;
            }
            var c = s.get(e);
            var h = s.get(t);
            if (c && h) {
              return c == t && h == e;
            }
            var d = -1;
            var f = true;
            var g = n & 2 ? new $n() : i;
            s.set(e, t);
            s.set(t, e);
            while (++d < u) {
              var p = e[d];
              var v = t[d];
              if (r) {
                var y = a ? r(v, p, d, t, e, s) : r(p, v, d, e, t, s);
              }
              if (y !== i) {
                if (y) {
                  continue;
                }
                f = false;
                break;
              }
              if (g) {
                if (!Ct(t, function (e, t) {
                  if (!Zt(g, t) && (p === e || o(p, e, n, r, s))) {
                    return g.push(t);
                  }
                })) {
                  f = false;
                  break;
                }
              } else if (p !== v && !o(p, v, n, r, s)) {
                f = false;
                break;
              }
            }
            s.delete(e);
            s.delete(t);
            return f;
          }
          function Yi(e) {
            return Do(Eo(e, i, Wo), e + "");
          }
          function eo(e) {
            return kr(e, Ra, lo);
          }
          function to(e) {
            return kr(e, Pa, co);
          }
          var no = Tn ? function (e) {
            return Tn.get(e);
          } : au;
          function ro(e) {
            var t = e.name + "";
            var n = Dn[t];
            for (var r = xe.call(Dn, t) ? n.length : 0; r--;) {
              var i = n[r];
              var o = i.func;
              if (o == null || o == e) {
                return i.name;
              }
            }
            return t;
          }
          function io(e) {
            return (xe.call(jn, "placeholder") ? jn : e).placeholder;
          }
          function oo() {
            var e = jn.iteratee || ru;
            e = e === ru ? xr : e;
            if (arguments.length) {
              return e(arguments[0], arguments[1]);
            } else {
              return e;
            }
          }
          function so(e, t) {
            var n;
            var r;
            var i = e.__data__;
            if ((r = typeof (n = t)) == "string" || r == "number" || r == "symbol" || r == "boolean" ? n !== "__proto__" : n === null) {
              return i[typeof t == "string" ? "string" : "hash"];
            } else {
              return i.map;
            }
          }
          function ao(e) {
            var t = Ra(e);
            for (var n = t.length; n--;) {
              var r = t[n];
              var i = e[r];
              t[n] = [r, i, ko(i)];
            }
            return t;
          }
          function uo(e, t) {
            var n = function (e, t) {
              if (e == null) {
                return i;
              } else {
                return e[t];
              }
            }(e, t);
            if (Or(n)) {
              return n;
            } else {
              return i;
            }
          }
          var lo = pt ? function (e) {
            if (e == null) {
              return [];
            } else {
              e = Ee(e);
              return Tt(pt(e), function (t) {
                return $e.call(e, t);
              });
            }
          } : gu;
          var co = pt ? function (e) {
            var t = [];
            for (; e;) {
              Ot(t, lo(e));
              e = We(e);
            }
            return t;
          } : gu;
          var ho = Ir;
          function fo(e, t, n) {
            for (var r = -1, i = (t = vi(t, e)).length, o = false; ++r < i;) {
              var s = Bo(t[r]);
              if (!(o = e != null && n(e, s))) {
                break;
              }
              e = e[s];
            }
            if (o || ++r != i) {
              return o;
            } else {
              return !!(i = e == null ? 0 : e.length) && Ks(i) && vo(s, i) && (Fs(e) || zs(e));
            }
          }
          function go(e) {
            if (typeof e.constructor != "function" || bo(e)) {
              return {};
            } else {
              return Gn(We(e));
            }
          }
          function po(e) {
            return Fs(e) || zs(e) || !!Qe && !!e && !!e[Qe];
          }
          function vo(e, t) {
            var n = typeof e;
            return !!(t = t == null ? h : t) && (n == "number" || n != "symbol" && ye.test(e)) && e > -1 && e % 1 == 0 && e < t;
          }
          function yo(e, t, n) {
            if (!Ys(n)) {
              return false;
            }
            var r = typeof t;
            return !!(r == "number" ? Vs(n) && vo(t, n.length) : r == "string" && t in n) && Gs(n[t], e);
          }
          function _o(e, t) {
            if (Fs(e)) {
              return false;
            }
            var n = typeof e;
            return n == "number" || n == "symbol" || n == "boolean" || e == null || !!aa(e) || Y.test(e) || !K.test(e) || t != null && e in Ee(t);
          }
          function mo(e) {
            var t = ro(e);
            var n = jn[t];
            if (typeof n != "function" || !(t in zn.prototype)) {
              return false;
            }
            if (e === n) {
              return true;
            }
            var r = no(n);
            return !!r && e === r[0];
          }
          if (kn && ho(new kn(new ArrayBuffer(1))) != O || In && ho(new In()) != k || En && ho(En.resolve()) != S || Sn && ho(new Sn()) != M || An && ho(new An()) != R) {
            ho = function (e) {
              var t = Ir(e);
              var n = t == E ? e.constructor : i;
              var r = n ? Uo(n) : "";
              if (r) {
                switch (r) {
                  case Rn:
                    return O;
                  case Pn:
                    return k;
                  case On:
                    return S;
                  case xn:
                    return M;
                  case Ln:
                    return R;
                }
              }
              return t;
            };
          }
          var wo = Pe ? Xs : pu;
          function bo(e) {
            var t = e && e.constructor;
            return e === (typeof t == "function" && t.prototype || Re);
          }
          function ko(e) {
            return e == e && !Ys(e);
          }
          function Io(e, t) {
            return function (n) {
              return n != null && n[e] === t && (t !== i || e in Ee(n));
            };
          }
          function Eo(e, t, n) {
            t = vn(t === i ? e.length - 1 : t, 0);
            return function () {
              var i = arguments;
              for (var o = -1, s = vn(i.length - t, 0), a = r(s); ++o < s;) {
                a[o] = i[t + o];
              }
              o = -1;
              var u = r(t + 1);
              for (; ++o < t;) {
                u[o] = i[o];
              }
              u[t] = n(a);
              return It(e, this, u);
            };
          }
          function So(e, t) {
            if (t.length < 2) {
              return e;
            } else {
              return br(e, ei(t, 0, -1));
            }
          }
          function Ao(e, t) {
            if ((t !== "constructor" || typeof e[t] != "function") && t != "__proto__") {
              return e[t];
            }
          }
          var Mo = Po(Zr);
          var To = ct || function (e, t) {
            return ht.setTimeout(e, t);
          };
          var Do = Po(Kr);
          function Ro(e, t, n) {
            var r = t + "";
            return Do(e, function (e, t) {
              var n = t.length;
              if (!n) {
                return e;
              }
              var r = n - 1;
              t[r] = (n > 1 ? "& " : "") + t[r];
              t = t.join(n > 2 ? ", " : " ");
              return e.replace(oe, "{\n/* [wrapped with " + t + "] */\n");
            }(r, function (e, t) {
              St(g, function (n) {
                var r = "_." + n[0];
                if (t & n[1] && !Dt(e, r)) {
                  e.push(r);
                }
              });
              return e.sort();
            }(function (e) {
              var t = e.match(se);
              if (t) {
                return t[1].split(ae);
              } else {
                return [];
              }
            }(r), n)));
          }
          function Po(e) {
            var t = 0;
            var n = 0;
            return function () {
              var r = _n();
              var o = 16 - (r - n);
              n = r;
              if (o > 0) {
                if (++t >= 800) {
                  return arguments[0];
                }
              } else {
                t = 0;
              }
              return e.apply(i, arguments);
            };
          }
          function Oo(e, t) {
            var n = -1;
            var r = e.length;
            var o = r - 1;
            for (t = t === i ? r : t; ++n < t;) {
              var s = Vr(n, o);
              var a = e[s];
              e[s] = e[n];
              e[n] = a;
            }
            e.length = t;
            return e;
          }
          var xo;
          var Lo;
          xo = xs(function (e) {
            var t = [];
            if (e.charCodeAt(0) === 46) {
              t.push("");
            }
            e.replace(ee, function (e, n, r, i) {
              t.push(r ? i.replace(ce, "$1") : n || e);
            });
            return t;
          }, function (e) {
            if (Lo.size === 500) {
              Lo.clear();
            }
            return e;
          });
          Lo = xo.cache;
          var Co = xo;
          function Bo(e) {
            if (typeof e == "string" || aa(e)) {
              return e;
            }
            var t = e + "";
            if (t == "0" && 1 / e == -Infinity) {
              return "-0";
            } else {
              return t;
            }
          }
          function Uo(e) {
            if (e != null) {
              try {
                return Oe.call(e);
              } catch (e) {}
              try {
                return e + "";
              } catch (e) {}
            }
            return "";
          }
          function jo(e) {
            if (e instanceof zn) {
              return e.clone();
            }
            var t = new qn(e.__wrapped__, e.__chain__);
            t.__actions__ = Ai(e.__actions__);
            t.__index__ = e.__index__;
            t.__values__ = e.__values__;
            return t;
          }
          var Go = Jr(function (e, t) {
            if ($s(e)) {
              return lr(e, pr(t, 1, $s, true));
            } else {
              return [];
            }
          });
          var No = Jr(function (e, t) {
            var n = Ho(t);
            if ($s(n)) {
              n = i;
            }
            if ($s(e)) {
              return lr(e, pr(t, 1, $s, true), oo(n, 2));
            } else {
              return [];
            }
          });
          var qo = Jr(function (e, t) {
            var n = Ho(t);
            if ($s(n)) {
              n = i;
            }
            if ($s(e)) {
              return lr(e, pr(t, 1, $s, true), i, n);
            } else {
              return [];
            }
          });
          function zo(e, t, n) {
            var r = e == null ? 0 : e.length;
            if (!r) {
              return -1;
            }
            var i = n == null ? 0 : fa(n);
            if (i < 0) {
              i = vn(r + i, 0);
            }
            return jt(e, oo(t, 3), i);
          }
          function Fo(e, t, n) {
            var r = e == null ? 0 : e.length;
            if (!r) {
              return -1;
            }
            var o = r - 1;
            if (n !== i) {
              o = fa(n);
              o = n < 0 ? vn(r + o, 0) : yn(o, r - 1);
            }
            return jt(e, oo(t, 3), o, true);
          }
          function Wo(e) {
            if (e != null && e.length) {
              return pr(e, 1);
            } else {
              return [];
            }
          }
          function Vo(e) {
            if (e && e.length) {
              return e[0];
            } else {
              return i;
            }
          }
          var $o = Jr(function (e) {
            var t = Pt(e, gi);
            if (t.length && t[0] === e[0]) {
              return Mr(t);
            } else {
              return [];
            }
          });
          var Jo = Jr(function (e) {
            var t = Ho(e);
            var n = Pt(e, gi);
            if (t === Ho(n)) {
              t = i;
            } else {
              n.pop();
            }
            if (n.length && n[0] === e[0]) {
              return Mr(n, oo(t, 2));
            } else {
              return [];
            }
          });
          var Qo = Jr(function (e) {
            var t = Ho(e);
            var n = Pt(e, gi);
            if (t = typeof t == "function" ? t : i) {
              n.pop();
            }
            if (n.length && n[0] === e[0]) {
              return Mr(n, i, t);
            } else {
              return [];
            }
          });
          function Ho(e) {
            var t = e == null ? 0 : e.length;
            if (t) {
              return e[t - 1];
            } else {
              return i;
            }
          }
          var Xo = Jr(Zo);
          function Zo(e, t) {
            if (e && e.length && t && t.length) {
              return Fr(e, t);
            } else {
              return e;
            }
          }
          var Ko = Yi(function (e, t) {
            var n = e == null ? 0 : e.length;
            var r = ir(e, t);
            Wr(e, Pt(t, function (e) {
              if (vo(e, n)) {
                return +e;
              } else {
                return e;
              }
            }).sort(Ii));
            return r;
          });
          function Yo(e) {
            if (e == null) {
              return e;
            } else {
              return bn.call(e);
            }
          }
          var es = Jr(function (e) {
            return ai(pr(e, 1, $s, true));
          });
          var ts = Jr(function (e) {
            var t = Ho(e);
            if ($s(t)) {
              t = i;
            }
            return ai(pr(e, 1, $s, true), oo(t, 2));
          });
          var ns = Jr(function (e) {
            var t = Ho(e);
            t = typeof t == "function" ? t : i;
            return ai(pr(e, 1, $s, true), i, t);
          });
          function rs(e) {
            if (!e || !e.length) {
              return [];
            }
            var t = 0;
            e = Tt(e, function (e) {
              if ($s(e)) {
                t = vn(e.length, t);
                return true;
              }
            });
            return Jt(t, function (t) {
              return Pt(e, Ft(t));
            });
          }
          function is(e, t) {
            if (!e || !e.length) {
              return [];
            }
            var n = rs(e);
            if (t == null) {
              return n;
            } else {
              return Pt(n, function (e) {
                return It(t, i, e);
              });
            }
          }
          var os = Jr(function (e, t) {
            if ($s(e)) {
              return lr(e, t);
            } else {
              return [];
            }
          });
          var ss = Jr(function (e) {
            return di(Tt(e, $s));
          });
          var as = Jr(function (e) {
            var t = Ho(e);
            if ($s(t)) {
              t = i;
            }
            return di(Tt(e, $s), oo(t, 2));
          });
          var us = Jr(function (e) {
            var t = Ho(e);
            t = typeof t == "function" ? t : i;
            return di(Tt(e, $s), i, t);
          });
          var ls = Jr(rs);
          var cs = Jr(function (e) {
            var t = e.length;
            var n = t > 1 ? e[t - 1] : i;
            n = typeof n == "function" ? (e.pop(), n) : i;
            return is(e, n);
          });
          function hs(e) {
            var t = jn(e);
            t.__chain__ = true;
            return t;
          }
          function ds(e, t) {
            return t(e);
          }
          var fs = Yi(function (e) {
            var t = e.length;
            var n = t ? e[0] : 0;
            var r = this.__wrapped__;
            function o(t) {
              return ir(t, e);
            }
            if (!(t > 1) && !this.__actions__.length && r instanceof zn && vo(n)) {
              (r = r.slice(n, +n + (t ? 1 : 0))).__actions__.push({
                func: ds,
                args: [o],
                thisArg: i
              });
              return new qn(r, this.__chain__).thru(function (e) {
                if (t && !e.length) {
                  e.push(i);
                }
                return e;
              });
            } else {
              return this.thru(o);
            }
          });
          var gs = Ti(function (e, t, n) {
            if (xe.call(e, n)) {
              ++e[n];
            } else {
              rr(e, n, 1);
            }
          });
          var ps = Ci(zo);
          var vs = Ci(Fo);
          function ys(e, t) {
            return (Fs(e) ? St : cr)(e, oo(t, 3));
          }
          function _s(e, t) {
            return (Fs(e) ? At : hr)(e, oo(t, 3));
          }
          var ms = Ti(function (e, t, n) {
            if (xe.call(e, n)) {
              e[n].push(t);
            } else {
              rr(e, n, [t]);
            }
          });
          var ws = Jr(function (e, t, n) {
            var i = -1;
            var o = typeof t == "function";
            var s = Vs(e) ? r(e.length) : [];
            cr(e, function (e) {
              s[++i] = o ? It(t, e, n) : Tr(e, t, n);
            });
            return s;
          });
          var bs = Ti(function (e, t, n) {
            rr(e, n, t);
          });
          function ks(e, t) {
            return (Fs(e) ? Pt : Br)(e, oo(t, 3));
          }
          var Is = Ti(function (e, t, n) {
            e[n ? 0 : 1].push(t);
          }, function () {
            return [[], []];
          });
          var Es = Jr(function (e, t) {
            if (e == null) {
              return [];
            }
            var n = t.length;
            if (n > 1 && yo(e, t[0], t[1])) {
              t = [];
            } else if (n > 2 && yo(t[0], t[1], t[2])) {
              t = [t[0]];
            }
            return qr(e, pr(t, 1), []);
          });
          var Ss = lt || function () {
            return ht.Date.now();
          };
          function As(e, t, n) {
            t = n ? i : t;
            t = e && t == null ? e.length : t;
            return Qi(e, l, i, i, i, i, t);
          }
          function Ms(e, t) {
            var n;
            if (typeof t != "function") {
              throw new Me(o);
            }
            e = fa(e);
            return function () {
              if (--e > 0) {
                n = t.apply(this, arguments);
              }
              if (e <= 1) {
                t = i;
              }
              return n;
            };
          }
          var Ts = Jr(function (e, t, n) {
            var r = 1;
            if (n.length) {
              var i = an(n, io(Ts));
              r |= u;
            }
            return Qi(e, r, t, n, i);
          });
          var Ds = Jr(function (e, t, n) {
            var r = 3;
            if (n.length) {
              var i = an(n, io(Ds));
              r |= u;
            }
            return Qi(t, r, e, n, i);
          });
          function Rs(e, t, n) {
            var r;
            var s;
            var a;
            var u;
            var l;
            var c;
            var h = 0;
            var d = false;
            var f = false;
            var g = true;
            if (typeof e != "function") {
              throw new Me(o);
            }
            function p(t) {
              var n = r;
              var o = s;
              r = s = i;
              h = t;
              return u = e.apply(o, n);
            }
            function v(e) {
              var n = e - c;
              return c === i || n >= t || n < 0 || f && e - h >= a;
            }
            function y() {
              var e = Ss();
              if (v(e)) {
                return _(e);
              }
              l = To(y, function (e) {
                var n = t - (e - c);
                if (f) {
                  return yn(n, a - (e - h));
                } else {
                  return n;
                }
              }(e));
            }
            function _(e) {
              l = i;
              if (g && r) {
                return p(e);
              } else {
                r = s = i;
                return u;
              }
            }
            function m() {
              var e = Ss();
              var n = v(e);
              r = arguments;
              s = this;
              c = e;
              if (n) {
                if (l === i) {
                  return function (e) {
                    h = e;
                    l = To(y, t);
                    if (d) {
                      return p(e);
                    } else {
                      return u;
                    }
                  }(c);
                }
                if (f) {
                  mi(l);
                  l = To(y, t);
                  return p(c);
                }
              }
              if (l === i) {
                l = To(y, t);
              }
              return u;
            }
            t = pa(t) || 0;
            if (Ys(n)) {
              d = !!n.leading;
              a = (f = "maxWait" in n) ? vn(pa(n.maxWait) || 0, t) : a;
              g = "trailing" in n ? !!n.trailing : g;
            }
            m.cancel = function () {
              if (l !== i) {
                mi(l);
              }
              h = 0;
              r = c = s = l = i;
            };
            m.flush = function () {
              if (l === i) {
                return u;
              } else {
                return _(Ss());
              }
            };
            return m;
          }
          var Ps = Jr(function (e, t) {
            return ur(e, 1, t);
          });
          var Os = Jr(function (e, t, n) {
            return ur(e, pa(t) || 0, n);
          });
          function xs(e, t) {
            if (typeof e != "function" || t != null && typeof t != "function") {
              throw new Me(o);
            }
            function n() {
              var r = arguments;
              var i = t ? t.apply(this, r) : r[0];
              var o = n.cache;
              if (o.has(i)) {
                return o.get(i);
              }
              var s = e.apply(this, r);
              n.cache = o.set(i, s) || o;
              return s;
            }
            n.cache = new (xs.Cache || Vn)();
            return n;
          }
          function Ls(e) {
            if (typeof e != "function") {
              throw new Me(o);
            }
            return function () {
              var t = arguments;
              switch (t.length) {
                case 0:
                  return !e.call(this);
                case 1:
                  return !e.call(this, t[0]);
                case 2:
                  return !e.call(this, t[0], t[1]);
                case 3:
                  return !e.call(this, t[0], t[1], t[2]);
              }
              return !e.apply(this, t);
            };
          }
          xs.Cache = Vn;
          var Cs = yi(function (e, t) {
            var n = (t = t.length == 1 && Fs(t[0]) ? Pt(t[0], Ht(oo())) : Pt(pr(t, 1), Ht(oo()))).length;
            return Jr(function (r) {
              for (var i = -1, o = yn(r.length, n); ++i < o;) {
                r[i] = t[i].call(this, r[i]);
              }
              return It(e, this, r);
            });
          });
          var Bs = Jr(function (e, t) {
            var n = an(t, io(Bs));
            return Qi(e, u, i, t, n);
          });
          var Us = Jr(function (e, t) {
            var n = an(t, io(Us));
            return Qi(e, 64, i, t, n);
          });
          var js = Yi(function (e, t) {
            return Qi(e, 256, i, i, i, t);
          });
          function Gs(e, t) {
            return e === t || e != e && t != t;
          }
          var Ns = Fi(Er);
          var qs = Fi(function (e, t) {
            return e >= t;
          });
          var zs = Dr(function () {
            return arguments;
          }()) ? Dr : function (e) {
            return ea(e) && xe.call(e, "callee") && !$e.call(e, "callee");
          };
          var Fs = r.isArray;
          var Ws = yt ? Ht(yt) : function (e) {
            return ea(e) && Ir(e) == P;
          };
          function Vs(e) {
            return e != null && Ks(e.length) && !Xs(e);
          }
          function $s(e) {
            return ea(e) && Vs(e);
          }
          var Js = vt || pu;
          var Qs = _t ? Ht(_t) : function (e) {
            return ea(e) && Ir(e) == _;
          };
          function Hs(e) {
            if (!ea(e)) {
              return false;
            }
            var t = Ir(e);
            return t == m || t == "[object DOMException]" || typeof e.message == "string" && typeof e.name == "string" && !ra(e);
          }
          function Xs(e) {
            if (!Ys(e)) {
              return false;
            }
            var t = Ir(e);
            return t == w || t == b || t == "[object AsyncFunction]" || t == "[object Proxy]";
          }
          function Zs(e) {
            return typeof e == "number" && e == fa(e);
          }
          function Ks(e) {
            return typeof e == "number" && e > -1 && e % 1 == 0 && e <= h;
          }
          function Ys(e) {
            var t = typeof e;
            return e != null && (t == "object" || t == "function");
          }
          function ea(e) {
            return e != null && typeof e == "object";
          }
          var ta = mt ? Ht(mt) : function (e) {
            return ea(e) && ho(e) == k;
          };
          function na(e) {
            return typeof e == "number" || ea(e) && Ir(e) == I;
          }
          function ra(e) {
            if (!ea(e) || Ir(e) != E) {
              return false;
            }
            var t = We(e);
            if (t === null) {
              return true;
            }
            var n = xe.call(t, "constructor") && t.constructor;
            return typeof n == "function" && n instanceof n && Oe.call(n) == Ue;
          }
          var ia = wt ? Ht(wt) : function (e) {
            return ea(e) && Ir(e) == A;
          };
          var oa = bt ? Ht(bt) : function (e) {
            return ea(e) && ho(e) == M;
          };
          function sa(e) {
            return typeof e == "string" || !Fs(e) && ea(e) && Ir(e) == T;
          }
          function aa(e) {
            return typeof e == "symbol" || ea(e) && Ir(e) == D;
          }
          var ua = kt ? Ht(kt) : function (e) {
            return ea(e) && Ks(e.length) && !!it[Ir(e)];
          };
          var la = Fi(Cr);
          var ca = Fi(function (e, t) {
            return e <= t;
          });
          function ha(e) {
            if (!e) {
              return [];
            }
            if (Vs(e)) {
              if (sa(e)) {
                return hn(e);
              } else {
                return Ai(e);
              }
            }
            if (He && e[He]) {
              return function (e) {
                for (var t, n = []; !(t = e.next()).done;) {
                  n.push(t.value);
                }
                return n;
              }(e[He]());
            }
            var t = ho(e);
            return (t == k ? on : t == M ? un : Ga)(e);
          }
          function da(e) {
            if (e) {
              if ((e = pa(e)) === c || e === -Infinity) {
                return (e < 0 ? -1 : 1) * 1.7976931348623157e+308;
              } else if (e == e) {
                return e;
              } else {
                return 0;
              }
            } else if (e === 0) {
              return e;
            } else {
              return 0;
            }
          }
          function fa(e) {
            var t = da(e);
            var n = t % 1;
            if (t == t) {
              if (n) {
                return t - n;
              } else {
                return t;
              }
            } else {
              return 0;
            }
          }
          function ga(e) {
            if (e) {
              return or(fa(e), 0, f);
            } else {
              return 0;
            }
          }
          function pa(e) {
            if (typeof e == "number") {
              return e;
            }
            if (aa(e)) {
              return d;
            }
            if (Ys(e)) {
              var t = typeof e.valueOf == "function" ? e.valueOf() : e;
              e = Ys(t) ? t + "" : t;
            }
            if (typeof e != "string") {
              if (e === 0) {
                return e;
              } else {
                return +e;
              }
            }
            e = Qt(e);
            var n = ge.test(e);
            if (n || ve.test(e)) {
              return ut(e.slice(2), n ? 2 : 8);
            } else if (fe.test(e)) {
              return d;
            } else {
              return +e;
            }
          }
          function va(e) {
            return Mi(e, Pa(e));
          }
          function ya(e) {
            if (e == null) {
              return "";
            } else {
              return si(e);
            }
          }
          var _a = Di(function (e, t) {
            if (bo(t) || Vs(t)) {
              Mi(t, Ra(t), e);
            } else {
              for (var n in t) {
                if (xe.call(t, n)) {
                  Yn(e, n, t[n]);
                }
              }
            }
          });
          var ma = Di(function (e, t) {
            Mi(t, Pa(t), e);
          });
          var wa = Di(function (e, t, n, r) {
            Mi(t, Pa(t), e, r);
          });
          var ba = Di(function (e, t, n, r) {
            Mi(t, Ra(t), e, r);
          });
          var ka = Yi(ir);
          var Ia = Jr(function (e, t) {
            e = Ee(e);
            var n = -1;
            var r = t.length;
            var o = r > 2 ? t[2] : i;
            for (o && yo(t[0], t[1], o) && (r = 1); ++n < r;) {
              var s = t[n];
              var a = Pa(s);
              for (var u = -1, l = a.length; ++u < l;) {
                var c = a[u];
                var h = e[c];
                if (h === i || Gs(h, Re[c]) && !xe.call(e, c)) {
                  e[c] = s[c];
                }
              }
            }
            return e;
          });
          var Ea = Jr(function (e) {
            e.push(i, Xi);
            return It(xa, i, e);
          });
          function Sa(e, t, n) {
            var r = e == null ? i : br(e, t);
            if (r === i) {
              return n;
            } else {
              return r;
            }
          }
          function Aa(e, t) {
            return e != null && fo(e, t, Ar);
          }
          var Ma = ji(function (e, t, n) {
            if (t != null && typeof t.toString != "function") {
              t = Be.call(t);
            }
            e[t] = n;
          }, Ya(nu));
          var Ta = ji(function (e, t, n) {
            if (t != null && typeof t.toString != "function") {
              t = Be.call(t);
            }
            if (xe.call(e, t)) {
              e[t].push(n);
            } else {
              e[t] = [n];
            }
          }, oo);
          var Da = Jr(Tr);
          function Ra(e) {
            if (Vs(e)) {
              return Qn(e);
            } else {
              return Lr(e);
            }
          }
          function Pa(e) {
            if (Vs(e)) {
              return Qn(e, true);
            } else {
              return function (e) {
                if (!Ys(e)) {
                  return function (e) {
                    var t = [];
                    if (e != null) {
                      for (var n in Ee(e)) {
                        t.push(n);
                      }
                    }
                    return t;
                  }(e);
                }
                var t = bo(e);
                var n = [];
                for (var r in e) {
                  if (r != "constructor" || !t && xe.call(e, r)) {
                    n.push(r);
                  }
                }
                return n;
              }(e);
            }
          }
          var Oa = Di(function (e, t, n) {
            Gr(e, t, n);
          });
          var xa = Di(function (e, t, n, r) {
            Gr(e, t, n, r);
          });
          var La = Yi(function (e, t) {
            var n = {};
            if (e == null) {
              return n;
            }
            var r = false;
            t = Pt(t, function (t) {
              t = vi(t, e);
              r ||= t.length > 1;
              return t;
            });
            Mi(e, to(e), n);
            if (r) {
              n = sr(n, 7, Zi);
            }
            for (var i = t.length; i--;) {
              ui(n, t[i]);
            }
            return n;
          });
          var Ca = Yi(function (e, t) {
            if (e == null) {
              return {};
            } else {
              return function (e, t) {
                return zr(e, t, function (t, n) {
                  return Aa(e, n);
                });
              }(e, t);
            }
          });
          function Ba(e, t) {
            if (e == null) {
              return {};
            }
            var n = Pt(to(e), function (e) {
              return [e];
            });
            t = oo(t);
            return zr(e, n, function (e, n) {
              return t(e, n[0]);
            });
          }
          var Ua = Ji(Ra);
          var ja = Ji(Pa);
          function Ga(e) {
            if (e == null) {
              return [];
            } else {
              return Xt(e, Ra(e));
            }
          }
          var Na = xi(function (e, t, n) {
            t = t.toLowerCase();
            return e + (n ? qa(t) : t);
          });
          function qa(e) {
            return Ha(ya(e).toLowerCase());
          }
          function za(e) {
            return (e = ya(e)) && e.replace(_e, en).replace(Ze, "");
          }
          var Fa = xi(function (e, t, n) {
            return e + (n ? "-" : "") + t.toLowerCase();
          });
          var Wa = xi(function (e, t, n) {
            return e + (n ? " " : "") + t.toLowerCase();
          });
          var Va = Oi("toLowerCase");
          var $a = xi(function (e, t, n) {
            return e + (n ? "_" : "") + t.toLowerCase();
          });
          var Ja = xi(function (e, t, n) {
            return e + (n ? " " : "") + Ha(t);
          });
          var Qa = xi(function (e, t, n) {
            return e + (n ? " " : "") + t.toUpperCase();
          });
          var Ha = Oi("toUpperCase");
          function Xa(e, t, n) {
            e = ya(e);
            if ((t = n ? i : t) === i) {
              if (function (e) {
                return tt.test(e);
              }(e)) {
                return function (e) {
                  return e.match(Ye) || [];
                }(e);
              } else {
                return function (e) {
                  return e.match(ue) || [];
                }(e);
              }
            } else {
              return e.match(t) || [];
            }
          }
          var Za = Jr(function (e, t) {
            try {
              return It(e, i, t);
            } catch (e) {
              if (Hs(e)) {
                return e;
              } else {
                return new be(e);
              }
            }
          });
          var Ka = Yi(function (e, t) {
            St(t, function (t) {
              t = Bo(t);
              rr(e, t, Ts(e[t], e));
            });
            return e;
          });
          function Ya(e) {
            return function () {
              return e;
            };
          }
          var eu = Bi();
          var tu = Bi(true);
          function nu(e) {
            return e;
          }
          function ru(e) {
            return xr(typeof e == "function" ? e : sr(e, 1));
          }
          var iu = Jr(function (e, t) {
            return function (n) {
              return Tr(n, e, t);
            };
          });
          var ou = Jr(function (e, t) {
            return function (n) {
              return Tr(e, n, t);
            };
          });
          function su(e, t, n) {
            var r = Ra(t);
            var i = wr(t, r);
            if (n == null && (!Ys(t) || !i.length && !!r.length)) {
              n = t;
              t = e;
              e = this;
              i = wr(t, Ra(t));
            }
            var o = !Ys(n) || !("chain" in n) || !!n.chain;
            var s = Xs(e);
            St(i, function (n) {
              var r = t[n];
              e[n] = r;
              if (s) {
                e.prototype[n] = function () {
                  var t = this.__chain__;
                  if (o || t) {
                    var n = e(this.__wrapped__);
                    (n.__actions__ = Ai(this.__actions__)).push({
                      func: r,
                      args: arguments,
                      thisArg: e
                    });
                    n.__chain__ = t;
                    return n;
                  }
                  return r.apply(e, Ot([this.value()], arguments));
                };
              }
            });
            return e;
          }
          function au() {}
          var uu = Ni(Pt);
          var lu = Ni(Mt);
          var cu = Ni(Ct);
          function hu(e) {
            if (_o(e)) {
              return Ft(Bo(e));
            } else {
              return function (e) {
                return function (t) {
                  return br(t, e);
                };
              }(e);
            }
          }
          var du = zi();
          var fu = zi(true);
          function gu() {
            return [];
          }
          function pu() {
            return false;
          }
          var vu;
          var yu = Gi(function (e, t) {
            return e + t;
          }, 0);
          var _u = Vi("ceil");
          var mu = Gi(function (e, t) {
            return e / t;
          }, 1);
          var wu = Vi("floor");
          var bu = Gi(function (e, t) {
            return e * t;
          }, 1);
          var ku = Vi("round");
          var Iu = Gi(function (e, t) {
            return e - t;
          }, 0);
          jn.after = function (e, t) {
            if (typeof t != "function") {
              throw new Me(o);
            }
            e = fa(e);
            return function () {
              if (--e < 1) {
                return t.apply(this, arguments);
              }
            };
          };
          jn.ary = As;
          jn.assign = _a;
          jn.assignIn = ma;
          jn.assignInWith = wa;
          jn.assignWith = ba;
          jn.at = ka;
          jn.before = Ms;
          jn.bind = Ts;
          jn.bindAll = Ka;
          jn.bindKey = Ds;
          jn.castArray = function () {
            if (!arguments.length) {
              return [];
            }
            var e = arguments[0];
            if (Fs(e)) {
              return e;
            } else {
              return [e];
            }
          };
          jn.chain = hs;
          jn.chunk = function (e, t, n) {
            t = (n ? yo(e, t, n) : t === i) ? 1 : vn(fa(t), 0);
            var o = e == null ? 0 : e.length;
            if (!o || t < 1) {
              return [];
            }
            for (var s = 0, a = 0, u = r(dt(o / t)); s < o;) {
              u[a++] = ei(e, s, s += t);
            }
            return u;
          };
          jn.compact = function (e) {
            for (var t = -1, n = e == null ? 0 : e.length, r = 0, i = []; ++t < n;) {
              var o = e[t];
              if (o) {
                i[r++] = o;
              }
            }
            return i;
          };
          jn.concat = function () {
            var e = arguments.length;
            if (!e) {
              return [];
            }
            var t = r(e - 1);
            var n = arguments[0];
            for (var i = e; i--;) {
              t[i - 1] = arguments[i];
            }
            return Ot(Fs(n) ? Ai(n) : [n], pr(t, 1));
          };
          jn.cond = function (e) {
            var t = e == null ? 0 : e.length;
            var n = oo();
            e = t ? Pt(e, function (e) {
              if (typeof e[1] != "function") {
                throw new Me(o);
              }
              return [n(e[0]), e[1]];
            }) : [];
            return Jr(function (n) {
              for (var r = -1; ++r < t;) {
                var i = e[r];
                if (It(i[0], this, n)) {
                  return It(i[1], this, n);
                }
              }
            });
          };
          jn.conforms = function (e) {
            return function (e) {
              var t = Ra(e);
              return function (n) {
                return ar(n, e, t);
              };
            }(sr(e, 1));
          };
          jn.constant = Ya;
          jn.countBy = gs;
          jn.create = function (e, t) {
            var n = Gn(e);
            if (t == null) {
              return n;
            } else {
              return nr(n, t);
            }
          };
          jn.curry = function e(t, n, r) {
            var o = Qi(t, 8, i, i, i, i, i, n = r ? i : n);
            o.placeholder = e.placeholder;
            return o;
          };
          jn.curryRight = function e(t, n, r) {
            var o = Qi(t, 16, i, i, i, i, i, n = r ? i : n);
            o.placeholder = e.placeholder;
            return o;
          };
          jn.debounce = Rs;
          jn.defaults = Ia;
          jn.defaultsDeep = Ea;
          jn.defer = Ps;
          jn.delay = Os;
          jn.difference = Go;
          jn.differenceBy = No;
          jn.differenceWith = qo;
          jn.drop = function (e, t, n) {
            var r = e == null ? 0 : e.length;
            if (r) {
              return ei(e, (t = n || t === i ? 1 : fa(t)) < 0 ? 0 : t, r);
            } else {
              return [];
            }
          };
          jn.dropRight = function (e, t, n) {
            var r = e == null ? 0 : e.length;
            if (r) {
              return ei(e, 0, (t = r - (t = n || t === i ? 1 : fa(t))) < 0 ? 0 : t);
            } else {
              return [];
            }
          };
          jn.dropRightWhile = function (e, t) {
            if (e && e.length) {
              return ci(e, oo(t, 3), true, true);
            } else {
              return [];
            }
          };
          jn.dropWhile = function (e, t) {
            if (e && e.length) {
              return ci(e, oo(t, 3), true);
            } else {
              return [];
            }
          };
          jn.fill = function (e, t, n, r) {
            var o = e == null ? 0 : e.length;
            if (o) {
              if (n && typeof n != "number" && yo(e, t, n)) {
                n = 0;
                r = o;
              }
              return function (e, t, n, r) {
                var o = e.length;
                if ((n = fa(n)) < 0) {
                  n = -n > o ? 0 : o + n;
                }
                if ((r = r === i || r > o ? o : fa(r)) < 0) {
                  r += o;
                }
                r = n > r ? 0 : ga(r);
                while (n < r) {
                  e[n++] = t;
                }
                return e;
              }(e, t, n, r);
            } else {
              return [];
            }
          };
          jn.filter = function (e, t) {
            return (Fs(e) ? Tt : gr)(e, oo(t, 3));
          };
          jn.flatMap = function (e, t) {
            return pr(ks(e, t), 1);
          };
          jn.flatMapDeep = function (e, t) {
            return pr(ks(e, t), c);
          };
          jn.flatMapDepth = function (e, t, n) {
            n = n === i ? 1 : fa(n);
            return pr(ks(e, t), n);
          };
          jn.flatten = Wo;
          jn.flattenDeep = function (e) {
            if (e != null && e.length) {
              return pr(e, c);
            } else {
              return [];
            }
          };
          jn.flattenDepth = function (e, t) {
            if (e != null && e.length) {
              return pr(e, t = t === i ? 1 : fa(t));
            } else {
              return [];
            }
          };
          jn.flip = function (e) {
            return Qi(e, 512);
          };
          jn.flow = eu;
          jn.flowRight = tu;
          jn.fromPairs = function (e) {
            for (var t = -1, n = e == null ? 0 : e.length, r = {}; ++t < n;) {
              var i = e[t];
              r[i[0]] = i[1];
            }
            return r;
          };
          jn.functions = function (e) {
            if (e == null) {
              return [];
            } else {
              return wr(e, Ra(e));
            }
          };
          jn.functionsIn = function (e) {
            if (e == null) {
              return [];
            } else {
              return wr(e, Pa(e));
            }
          };
          jn.groupBy = ms;
          jn.initial = function (e) {
            if (e != null && e.length) {
              return ei(e, 0, -1);
            } else {
              return [];
            }
          };
          jn.intersection = $o;
          jn.intersectionBy = Jo;
          jn.intersectionWith = Qo;
          jn.invert = Ma;
          jn.invertBy = Ta;
          jn.invokeMap = ws;
          jn.iteratee = ru;
          jn.keyBy = bs;
          jn.keys = Ra;
          jn.keysIn = Pa;
          jn.map = ks;
          jn.mapKeys = function (e, t) {
            var n = {};
            t = oo(t, 3);
            _r(e, function (e, r, i) {
              rr(n, t(e, r, i), e);
            });
            return n;
          };
          jn.mapValues = function (e, t) {
            var n = {};
            t = oo(t, 3);
            _r(e, function (e, r, i) {
              rr(n, r, t(e, r, i));
            });
            return n;
          };
          jn.matches = function (e) {
            return Ur(sr(e, 1));
          };
          jn.matchesProperty = function (e, t) {
            return jr(e, sr(t, 1));
          };
          jn.memoize = xs;
          jn.merge = Oa;
          jn.mergeWith = xa;
          jn.method = iu;
          jn.methodOf = ou;
          jn.mixin = su;
          jn.negate = Ls;
          jn.nthArg = function (e) {
            e = fa(e);
            return Jr(function (t) {
              return Nr(t, e);
            });
          };
          jn.omit = La;
          jn.omitBy = function (e, t) {
            return Ba(e, Ls(oo(t)));
          };
          jn.once = function (e) {
            return Ms(2, e);
          };
          jn.orderBy = function (e, t, n, r) {
            if (e == null) {
              return [];
            } else {
              if (!Fs(t)) {
                t = t == null ? [] : [t];
              }
              if (!Fs(n = r ? i : n)) {
                n = n == null ? [] : [n];
              }
              return qr(e, t, n);
            }
          };
          jn.over = uu;
          jn.overArgs = Cs;
          jn.overEvery = lu;
          jn.overSome = cu;
          jn.partial = Bs;
          jn.partialRight = Us;
          jn.partition = Is;
          jn.pick = Ca;
          jn.pickBy = Ba;
          jn.property = hu;
          jn.propertyOf = function (e) {
            return function (t) {
              if (e == null) {
                return i;
              } else {
                return br(e, t);
              }
            };
          };
          jn.pull = Xo;
          jn.pullAll = Zo;
          jn.pullAllBy = function (e, t, n) {
            if (e && e.length && t && t.length) {
              return Fr(e, t, oo(n, 2));
            } else {
              return e;
            }
          };
          jn.pullAllWith = function (e, t, n) {
            if (e && e.length && t && t.length) {
              return Fr(e, t, i, n);
            } else {
              return e;
            }
          };
          jn.pullAt = Ko;
          jn.range = du;
          jn.rangeRight = fu;
          jn.rearg = js;
          jn.reject = function (e, t) {
            return (Fs(e) ? Tt : gr)(e, Ls(oo(t, 3)));
          };
          jn.remove = function (e, t) {
            var n = [];
            if (!e || !e.length) {
              return n;
            }
            var r = -1;
            var i = [];
            var o = e.length;
            for (t = oo(t, 3); ++r < o;) {
              var s = e[r];
              if (t(s, r, e)) {
                n.push(s);
                i.push(r);
              }
            }
            Wr(e, i);
            return n;
          };
          jn.rest = function (e, t) {
            if (typeof e != "function") {
              throw new Me(o);
            }
            return Jr(e, t = t === i ? t : fa(t));
          };
          jn.reverse = Yo;
          jn.sampleSize = function (e, t, n) {
            t = (n ? yo(e, t, n) : t === i) ? 1 : fa(t);
            return (Fs(e) ? Xn : Hr)(e, t);
          };
          jn.set = function (e, t, n) {
            if (e == null) {
              return e;
            } else {
              return Xr(e, t, n);
            }
          };
          jn.setWith = function (e, t, n, r) {
            r = typeof r == "function" ? r : i;
            if (e == null) {
              return e;
            } else {
              return Xr(e, t, n, r);
            }
          };
          jn.shuffle = function (e) {
            return (Fs(e) ? Zn : Yr)(e);
          };
          jn.slice = function (e, t, n) {
            var r = e == null ? 0 : e.length;
            if (r) {
              if (n && typeof n != "number" && yo(e, t, n)) {
                t = 0;
                n = r;
              } else {
                t = t == null ? 0 : fa(t);
                n = n === i ? r : fa(n);
              }
              return ei(e, t, n);
            } else {
              return [];
            }
          };
          jn.sortBy = Es;
          jn.sortedUniq = function (e) {
            if (e && e.length) {
              return ii(e);
            } else {
              return [];
            }
          };
          jn.sortedUniqBy = function (e, t) {
            if (e && e.length) {
              return ii(e, oo(t, 2));
            } else {
              return [];
            }
          };
          jn.split = function (e, t, n) {
            if (n && typeof n != "number" && yo(e, t, n)) {
              t = n = i;
            }
            if (n = n === i ? f : n >>> 0) {
              if ((e = ya(e)) && (typeof t == "string" || t != null && !ia(t)) && !(t = si(t)) && rn(e)) {
                return _i(hn(e), 0, n);
              } else {
                return e.split(t, n);
              }
            } else {
              return [];
            }
          };
          jn.spread = function (e, t) {
            if (typeof e != "function") {
              throw new Me(o);
            }
            t = t == null ? 0 : vn(fa(t), 0);
            return Jr(function (n) {
              var r = n[t];
              var i = _i(n, 0, t);
              if (r) {
                Ot(i, r);
              }
              return It(e, this, i);
            });
          };
          jn.tail = function (e) {
            var t = e == null ? 0 : e.length;
            if (t) {
              return ei(e, 1, t);
            } else {
              return [];
            }
          };
          jn.take = function (e, t, n) {
            if (e && e.length) {
              return ei(e, 0, (t = n || t === i ? 1 : fa(t)) < 0 ? 0 : t);
            } else {
              return [];
            }
          };
          jn.takeRight = function (e, t, n) {
            var r = e == null ? 0 : e.length;
            if (r) {
              return ei(e, (t = r - (t = n || t === i ? 1 : fa(t))) < 0 ? 0 : t, r);
            } else {
              return [];
            }
          };
          jn.takeRightWhile = function (e, t) {
            if (e && e.length) {
              return ci(e, oo(t, 3), false, true);
            } else {
              return [];
            }
          };
          jn.takeWhile = function (e, t) {
            if (e && e.length) {
              return ci(e, oo(t, 3));
            } else {
              return [];
            }
          };
          jn.tap = function (e, t) {
            t(e);
            return e;
          };
          jn.throttle = function (e, t, n) {
            var r = true;
            var i = true;
            if (typeof e != "function") {
              throw new Me(o);
            }
            if (Ys(n)) {
              r = "leading" in n ? !!n.leading : r;
              i = "trailing" in n ? !!n.trailing : i;
            }
            return Rs(e, t, {
              leading: r,
              maxWait: t,
              trailing: i
            });
          };
          jn.thru = ds;
          jn.toArray = ha;
          jn.toPairs = Ua;
          jn.toPairsIn = ja;
          jn.toPath = function (e) {
            if (Fs(e)) {
              return Pt(e, Bo);
            } else if (aa(e)) {
              return [e];
            } else {
              return Ai(Co(ya(e)));
            }
          };
          jn.toPlainObject = va;
          jn.transform = function (e, t, n) {
            var r = Fs(e);
            var i = r || Js(e) || ua(e);
            t = oo(t, 4);
            if (n == null) {
              var o = e && e.constructor;
              n = i ? r ? new o() : [] : Ys(e) && Xs(o) ? Gn(We(e)) : {};
            }
            (i ? St : _r)(e, function (e, r, i) {
              return t(n, e, r, i);
            });
            return n;
          };
          jn.unary = function (e) {
            return As(e, 1);
          };
          jn.union = es;
          jn.unionBy = ts;
          jn.unionWith = ns;
          jn.uniq = function (e) {
            if (e && e.length) {
              return ai(e);
            } else {
              return [];
            }
          };
          jn.uniqBy = function (e, t) {
            if (e && e.length) {
              return ai(e, oo(t, 2));
            } else {
              return [];
            }
          };
          jn.uniqWith = function (e, t) {
            t = typeof t == "function" ? t : i;
            if (e && e.length) {
              return ai(e, i, t);
            } else {
              return [];
            }
          };
          jn.unset = function (e, t) {
            return e == null || ui(e, t);
          };
          jn.unzip = rs;
          jn.unzipWith = is;
          jn.update = function (e, t, n) {
            if (e == null) {
              return e;
            } else {
              return li(e, t, pi(n));
            }
          };
          jn.updateWith = function (e, t, n, r) {
            r = typeof r == "function" ? r : i;
            if (e == null) {
              return e;
            } else {
              return li(e, t, pi(n), r);
            }
          };
          jn.values = Ga;
          jn.valuesIn = function (e) {
            if (e == null) {
              return [];
            } else {
              return Xt(e, Pa(e));
            }
          };
          jn.without = os;
          jn.words = Xa;
          jn.wrap = function (e, t) {
            return Bs(pi(t), e);
          };
          jn.xor = ss;
          jn.xorBy = as;
          jn.xorWith = us;
          jn.zip = ls;
          jn.zipObject = function (e, t) {
            return fi(e || [], t || [], Yn);
          };
          jn.zipObjectDeep = function (e, t) {
            return fi(e || [], t || [], Xr);
          };
          jn.zipWith = cs;
          jn.entries = Ua;
          jn.entriesIn = ja;
          jn.extend = ma;
          jn.extendWith = wa;
          su(jn, jn);
          jn.add = yu;
          jn.attempt = Za;
          jn.camelCase = Na;
          jn.capitalize = qa;
          jn.ceil = _u;
          jn.clamp = function (e, t, n) {
            if (n === i) {
              n = t;
              t = i;
            }
            if (n !== i) {
              n = (n = pa(n)) == n ? n : 0;
            }
            if (t !== i) {
              t = (t = pa(t)) == t ? t : 0;
            }
            return or(pa(e), t, n);
          };
          jn.clone = function (e) {
            return sr(e, 4);
          };
          jn.cloneDeep = function (e) {
            return sr(e, 5);
          };
          jn.cloneDeepWith = function (e, t) {
            return sr(e, 5, t = typeof t == "function" ? t : i);
          };
          jn.cloneWith = function (e, t) {
            return sr(e, 4, t = typeof t == "function" ? t : i);
          };
          jn.conformsTo = function (e, t) {
            return t == null || ar(e, t, Ra(t));
          };
          jn.deburr = za;
          jn.defaultTo = function (e, t) {
            if (e == null || e != e) {
              return t;
            } else {
              return e;
            }
          };
          jn.divide = mu;
          jn.endsWith = function (e, t, n) {
            e = ya(e);
            t = si(t);
            var r = e.length;
            var o = n = n === i ? r : or(fa(n), 0, r);
            return (n -= t.length) >= 0 && e.slice(n, o) == t;
          };
          jn.eq = Gs;
          jn.escape = function (e) {
            if ((e = ya(e)) && Q.test(e)) {
              return e.replace($, tn);
            } else {
              return e;
            }
          };
          jn.escapeRegExp = function (e) {
            if ((e = ya(e)) && ne.test(e)) {
              return e.replace(te, "\\$&");
            } else {
              return e;
            }
          };
          jn.every = function (e, t, n) {
            var r = Fs(e) ? Mt : dr;
            if (n && yo(e, t, n)) {
              t = i;
            }
            return r(e, oo(t, 3));
          };
          jn.find = ps;
          jn.findIndex = zo;
          jn.findKey = function (e, t) {
            return Ut(e, oo(t, 3), _r);
          };
          jn.findLast = vs;
          jn.findLastIndex = Fo;
          jn.findLastKey = function (e, t) {
            return Ut(e, oo(t, 3), mr);
          };
          jn.floor = wu;
          jn.forEach = ys;
          jn.forEachRight = _s;
          jn.forIn = function (e, t) {
            if (e == null) {
              return e;
            } else {
              return vr(e, oo(t, 3), Pa);
            }
          };
          jn.forInRight = function (e, t) {
            if (e == null) {
              return e;
            } else {
              return yr(e, oo(t, 3), Pa);
            }
          };
          jn.forOwn = function (e, t) {
            return e && _r(e, oo(t, 3));
          };
          jn.forOwnRight = function (e, t) {
            return e && mr(e, oo(t, 3));
          };
          jn.get = Sa;
          jn.gt = Ns;
          jn.gte = qs;
          jn.has = function (e, t) {
            return e != null && fo(e, t, Sr);
          };
          jn.hasIn = Aa;
          jn.head = Vo;
          jn.identity = nu;
          jn.includes = function (e, t, n, r) {
            e = Vs(e) ? e : Ga(e);
            n = n && !r ? fa(n) : 0;
            var i = e.length;
            if (n < 0) {
              n = vn(i + n, 0);
            }
            if (sa(e)) {
              return n <= i && e.indexOf(t, n) > -1;
            } else {
              return !!i && Gt(e, t, n) > -1;
            }
          };
          jn.indexOf = function (e, t, n) {
            var r = e == null ? 0 : e.length;
            if (!r) {
              return -1;
            }
            var i = n == null ? 0 : fa(n);
            if (i < 0) {
              i = vn(r + i, 0);
            }
            return Gt(e, t, i);
          };
          jn.inRange = function (e, t, n) {
            t = da(t);
            if (n === i) {
              n = t;
              t = 0;
            } else {
              n = da(n);
            }
            return function (e, t, n) {
              return e >= yn(t, n) && e < vn(t, n);
            }(e = pa(e), t, n);
          };
          jn.invoke = Da;
          jn.isArguments = zs;
          jn.isArray = Fs;
          jn.isArrayBuffer = Ws;
          jn.isArrayLike = Vs;
          jn.isArrayLikeObject = $s;
          jn.isBoolean = function (e) {
            return e === true || e === false || ea(e) && Ir(e) == y;
          };
          jn.isBuffer = Js;
          jn.isDate = Qs;
          jn.isElement = function (e) {
            return ea(e) && e.nodeType === 1 && !ra(e);
          };
          jn.isEmpty = function (e) {
            if (e == null) {
              return true;
            }
            if (Vs(e) && (Fs(e) || typeof e == "string" || typeof e.splice == "function" || Js(e) || ua(e) || zs(e))) {
              return !e.length;
            }
            var t = ho(e);
            if (t == k || t == M) {
              return !e.size;
            }
            if (bo(e)) {
              return !Lr(e).length;
            }
            for (var n in e) {
              if (xe.call(e, n)) {
                return false;
              }
            }
            return true;
          };
          jn.isEqual = function (e, t) {
            return Rr(e, t);
          };
          jn.isEqualWith = function (e, t, n) {
            var r = (n = typeof n == "function" ? n : i) ? n(e, t) : i;
            if (r === i) {
              return Rr(e, t, i, n);
            } else {
              return !!r;
            }
          };
          jn.isError = Hs;
          jn.isFinite = function (e) {
            return typeof e == "number" && Bt(e);
          };
          jn.isFunction = Xs;
          jn.isInteger = Zs;
          jn.isLength = Ks;
          jn.isMap = ta;
          jn.isMatch = function (e, t) {
            return e === t || Pr(e, t, ao(t));
          };
          jn.isMatchWith = function (e, t, n) {
            n = typeof n == "function" ? n : i;
            return Pr(e, t, ao(t), n);
          };
          jn.isNaN = function (e) {
            return na(e) && e != +e;
          };
          jn.isNative = function (e) {
            if (wo(e)) {
              throw new be("Unsupported core-js use. Try https://npms.io/search?q=ponyfill.");
            }
            return Or(e);
          };
          jn.isNil = function (e) {
            return e == null;
          };
          jn.isNull = function (e) {
            return e === null;
          };
          jn.isNumber = na;
          jn.isObject = Ys;
          jn.isObjectLike = ea;
          jn.isPlainObject = ra;
          jn.isRegExp = ia;
          jn.isSafeInteger = function (e) {
            return Zs(e) && e >= -9007199254740991 && e <= h;
          };
          jn.isSet = oa;
          jn.isString = sa;
          jn.isSymbol = aa;
          jn.isTypedArray = ua;
          jn.isUndefined = function (e) {
            return e === i;
          };
          jn.isWeakMap = function (e) {
            return ea(e) && ho(e) == R;
          };
          jn.isWeakSet = function (e) {
            return ea(e) && Ir(e) == "[object WeakSet]";
          };
          jn.join = function (e, t) {
            if (e == null) {
              return "";
            } else {
              return Wt.call(e, t);
            }
          };
          jn.kebabCase = Fa;
          jn.last = Ho;
          jn.lastIndexOf = function (e, t, n) {
            var r = e == null ? 0 : e.length;
            if (!r) {
              return -1;
            }
            var o = r;
            if (n !== i) {
              o = (o = fa(n)) < 0 ? vn(r + o, 0) : yn(o, r - 1);
            }
            if (t == t) {
              return function (e, t, n) {
                for (var r = n + 1; r--;) {
                  if (e[r] === t) {
                    return r;
                  }
                }
                return r;
              }(e, t, o);
            } else {
              return jt(e, qt, o, true);
            }
          };
          jn.lowerCase = Wa;
          jn.lowerFirst = Va;
          jn.lt = la;
          jn.lte = ca;
          jn.max = function (e) {
            if (e && e.length) {
              return fr(e, nu, Er);
            } else {
              return i;
            }
          };
          jn.maxBy = function (e, t) {
            if (e && e.length) {
              return fr(e, oo(t, 2), Er);
            } else {
              return i;
            }
          };
          jn.mean = function (e) {
            return zt(e, nu);
          };
          jn.meanBy = function (e, t) {
            return zt(e, oo(t, 2));
          };
          jn.min = function (e) {
            if (e && e.length) {
              return fr(e, nu, Cr);
            } else {
              return i;
            }
          };
          jn.minBy = function (e, t) {
            if (e && e.length) {
              return fr(e, oo(t, 2), Cr);
            } else {
              return i;
            }
          };
          jn.stubArray = gu;
          jn.stubFalse = pu;
          jn.stubObject = function () {
            return {};
          };
          jn.stubString = function () {
            return "";
          };
          jn.stubTrue = function () {
            return true;
          };
          jn.multiply = bu;
          jn.nth = function (e, t) {
            if (e && e.length) {
              return Nr(e, fa(t));
            } else {
              return i;
            }
          };
          jn.noConflict = function () {
            if (ht._ === this) {
              ht._ = je;
            }
            return this;
          };
          jn.noop = au;
          jn.now = Ss;
          jn.pad = function (e, t, n) {
            e = ya(e);
            var r = (t = fa(t)) ? cn(e) : 0;
            if (!t || r >= t) {
              return e;
            }
            var i = (t - r) / 2;
            return qi(ft(i), n) + e + qi(dt(i), n);
          };
          jn.padEnd = function (e, t, n) {
            e = ya(e);
            var r = (t = fa(t)) ? cn(e) : 0;
            if (t && r < t) {
              return e + qi(t - r, n);
            } else {
              return e;
            }
          };
          jn.padStart = function (e, t, n) {
            e = ya(e);
            var r = (t = fa(t)) ? cn(e) : 0;
            if (t && r < t) {
              return qi(t - r, n) + e;
            } else {
              return e;
            }
          };
          jn.parseInt = function (e, t, n) {
            if (n || t == null) {
              t = 0;
            } else {
              t &&= +t;
            }
            return mn(ya(e).replace(re, ""), t || 0);
          };
          jn.random = function (e, t, n) {
            if (n && typeof n != "boolean" && yo(e, t, n)) {
              t = n = i;
            }
            if (n === i) {
              if (typeof t == "boolean") {
                n = t;
                t = i;
              } else if (typeof e == "boolean") {
                n = e;
                e = i;
              }
            }
            if (e === i && t === i) {
              e = 0;
              t = 1;
            } else {
              e = da(e);
              if (t === i) {
                t = e;
                e = 0;
              } else {
                t = da(t);
              }
            }
            if (e > t) {
              var r = e;
              e = t;
              t = r;
            }
            if (n || e % 1 || t % 1) {
              var o = wn();
              return yn(e + o * (t - e + at("1e-" + ((o + "").length - 1))), t);
            }
            return Vr(e, t);
          };
          jn.reduce = function (e, t, n) {
            var r = Fs(e) ? xt : Vt;
            var i = arguments.length < 3;
            return r(e, oo(t, 4), n, i, cr);
          };
          jn.reduceRight = function (e, t, n) {
            var r = Fs(e) ? Lt : Vt;
            var i = arguments.length < 3;
            return r(e, oo(t, 4), n, i, hr);
          };
          jn.repeat = function (e, t, n) {
            t = (n ? yo(e, t, n) : t === i) ? 1 : fa(t);
            return $r(ya(e), t);
          };
          jn.replace = function () {
            var e = arguments;
            var t = ya(e[0]);
            if (e.length < 3) {
              return t;
            } else {
              return t.replace(e[1], e[2]);
            }
          };
          jn.result = function (e, t, n) {
            var r = -1;
            var o = (t = vi(t, e)).length;
            for (o || (o = 1, e = i); ++r < o;) {
              var s = e == null ? i : e[Bo(t[r])];
              if (s === i) {
                r = o;
                s = n;
              }
              e = Xs(s) ? s.call(e) : s;
            }
            return e;
          };
          jn.round = ku;
          jn.runInContext = e;
          jn.sample = function (e) {
            return (Fs(e) ? Hn : Qr)(e);
          };
          jn.size = function (e) {
            if (e == null) {
              return 0;
            }
            if (Vs(e)) {
              if (sa(e)) {
                return cn(e);
              } else {
                return e.length;
              }
            }
            var t = ho(e);
            if (t == k || t == M) {
              return e.size;
            } else {
              return Lr(e).length;
            }
          };
          jn.snakeCase = $a;
          jn.some = function (e, t, n) {
            var r = Fs(e) ? Ct : ti;
            if (n && yo(e, t, n)) {
              t = i;
            }
            return r(e, oo(t, 3));
          };
          jn.sortedIndex = function (e, t) {
            return ni(e, t);
          };
          jn.sortedIndexBy = function (e, t, n) {
            return ri(e, t, oo(n, 2));
          };
          jn.sortedIndexOf = function (e, t) {
            var n = e == null ? 0 : e.length;
            if (n) {
              var r = ni(e, t);
              if (r < n && Gs(e[r], t)) {
                return r;
              }
            }
            return -1;
          };
          jn.sortedLastIndex = function (e, t) {
            return ni(e, t, true);
          };
          jn.sortedLastIndexBy = function (e, t, n) {
            return ri(e, t, oo(n, 2), true);
          };
          jn.sortedLastIndexOf = function (e, t) {
            if (e != null && e.length) {
              var n = ni(e, t, true) - 1;
              if (Gs(e[n], t)) {
                return n;
              }
            }
            return -1;
          };
          jn.startCase = Ja;
          jn.startsWith = function (e, t, n) {
            e = ya(e);
            n = n == null ? 0 : or(fa(n), 0, e.length);
            t = si(t);
            return e.slice(n, n + t.length) == t;
          };
          jn.subtract = Iu;
          jn.sum = function (e) {
            if (e && e.length) {
              return $t(e, nu);
            } else {
              return 0;
            }
          };
          jn.sumBy = function (e, t) {
            if (e && e.length) {
              return $t(e, oo(t, 2));
            } else {
              return 0;
            }
          };
          jn.template = function (e, t, n) {
            var r = jn.templateSettings;
            if (n && yo(e, t, n)) {
              t = i;
            }
            e = ya(e);
            t = wa({}, t, r, Hi);
            var o;
            var s;
            var a = wa({}, t.imports, r.imports, Hi);
            var u = Ra(a);
            var l = Xt(a, u);
            var c = 0;
            var h = t.interpolate || me;
            var d = "__p += '";
            var f = Se((t.escape || me).source + "|" + h.source + "|" + (h === Z ? he : me).source + "|" + (t.evaluate || me).source + "|$", "g");
            var g = "//# sourceURL=" + (xe.call(t, "sourceURL") ? (t.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++rt + "]") + "\n";
            e.replace(f, function (t, n, r, i, a, u) {
              r ||= i;
              d += e.slice(c, u).replace(we, nn);
              if (n) {
                o = true;
                d += "' +\n__e(" + n + ") +\n'";
              }
              if (a) {
                s = true;
                d += "';\n" + a + ";\n__p += '";
              }
              if (r) {
                d += "' +\n((__t = (" + r + ")) == null ? '' : __t) +\n'";
              }
              c = u + t.length;
              return t;
            });
            d += "';\n";
            var p = xe.call(t, "variable") && t.variable;
            if (p) {
              if (le.test(p)) {
                throw new be("Invalid `variable` option passed into `_.template`");
              }
            } else {
              d = "with (obj) {\n" + d + "\n}\n";
            }
            d = (s ? d.replace(z, "") : d).replace(F, "$1").replace(W, "$1;");
            d = "function(" + (p || "obj") + ") {\n" + (p ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (o ? ", __e = _.escape" : "") + (s ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + d + "return __p\n}";
            var v = Za(function () {
              return ke(u, g + "return " + d).apply(i, l);
            });
            v.source = d;
            if (Hs(v)) {
              throw v;
            }
            return v;
          };
          jn.times = function (e, t) {
            if ((e = fa(e)) < 1 || e > h) {
              return [];
            }
            var n = f;
            var r = yn(e, f);
            t = oo(t);
            e -= f;
            var i = Jt(r, t);
            for (; ++n < e;) {
              t(n);
            }
            return i;
          };
          jn.toFinite = da;
          jn.toInteger = fa;
          jn.toLength = ga;
          jn.toLower = function (e) {
            return ya(e).toLowerCase();
          };
          jn.toNumber = pa;
          jn.toSafeInteger = function (e) {
            if (e) {
              return or(fa(e), -9007199254740991, h);
            } else if (e === 0) {
              return e;
            } else {
              return 0;
            }
          };
          jn.toString = ya;
          jn.toUpper = function (e) {
            return ya(e).toUpperCase();
          };
          jn.trim = function (e, t, n) {
            if ((e = ya(e)) && (n || t === i)) {
              return Qt(e);
            }
            if (!e || !(t = si(t))) {
              return e;
            }
            var r = hn(e);
            var o = hn(t);
            return _i(r, Kt(r, o), Yt(r, o) + 1).join("");
          };
          jn.trimEnd = function (e, t, n) {
            if ((e = ya(e)) && (n || t === i)) {
              return e.slice(0, dn(e) + 1);
            }
            if (!e || !(t = si(t))) {
              return e;
            }
            var r = hn(e);
            return _i(r, 0, Yt(r, hn(t)) + 1).join("");
          };
          jn.trimStart = function (e, t, n) {
            if ((e = ya(e)) && (n || t === i)) {
              return e.replace(re, "");
            }
            if (!e || !(t = si(t))) {
              return e;
            }
            var r = hn(e);
            return _i(r, Kt(r, hn(t))).join("");
          };
          jn.truncate = function (e, t) {
            var n = 30;
            var r = "...";
            if (Ys(t)) {
              var o = "separator" in t ? t.separator : o;
              n = "length" in t ? fa(t.length) : n;
              r = "omission" in t ? si(t.omission) : r;
            }
            var s = (e = ya(e)).length;
            if (rn(e)) {
              var a = hn(e);
              s = a.length;
            }
            if (n >= s) {
              return e;
            }
            var u = n - cn(r);
            if (u < 1) {
              return r;
            }
            var l = a ? _i(a, 0, u).join("") : e.slice(0, u);
            if (o === i) {
              return l + r;
            }
            if (a) {
              u += l.length - u;
            }
            if (ia(o)) {
              if (e.slice(u).search(o)) {
                var c;
                var h = l;
                if (!o.global) {
                  o = Se(o.source, ya(de.exec(o)) + "g");
                }
                o.lastIndex = 0;
                while (c = o.exec(h)) {
                  var d = c.index;
                }
                l = l.slice(0, d === i ? u : d);
              }
            } else if (e.indexOf(si(o), u) != u) {
              var f = l.lastIndexOf(o);
              if (f > -1) {
                l = l.slice(0, f);
              }
            }
            return l + r;
          };
          jn.unescape = function (e) {
            if ((e = ya(e)) && J.test(e)) {
              return e.replace(V, fn);
            } else {
              return e;
            }
          };
          jn.uniqueId = function (e) {
            var t = ++Le;
            return ya(e) + t;
          };
          jn.upperCase = Qa;
          jn.upperFirst = Ha;
          jn.each = ys;
          jn.eachRight = _s;
          jn.first = Vo;
          su(jn, (vu = {}, _r(jn, function (e, t) {
            if (!xe.call(jn.prototype, t)) {
              vu[t] = e;
            }
          }), vu), {
            chain: false
          });
          jn.VERSION = "4.17.21";
          St(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function (e) {
            jn[e].placeholder = jn;
          });
          St(["drop", "take"], function (e, t) {
            zn.prototype[e] = function (n) {
              n = n === i ? 1 : vn(fa(n), 0);
              var r = this.__filtered__ && !t ? new zn(this) : this.clone();
              if (r.__filtered__) {
                r.__takeCount__ = yn(n, r.__takeCount__);
              } else {
                r.__views__.push({
                  size: yn(n, f),
                  type: e + (r.__dir__ < 0 ? "Right" : "")
                });
              }
              return r;
            };
            zn.prototype[e + "Right"] = function (t) {
              return this.reverse()[e](t).reverse();
            };
          });
          St(["filter", "map", "takeWhile"], function (e, t) {
            var n = t + 1;
            var r = n == 1 || n == 3;
            zn.prototype[e] = function (e) {
              var t = this.clone();
              t.__iteratees__.push({
                iteratee: oo(e, 3),
                type: n
              });
              t.__filtered__ = t.__filtered__ || r;
              return t;
            };
          });
          St(["head", "last"], function (e, t) {
            var n = "take" + (t ? "Right" : "");
            zn.prototype[e] = function () {
              return this[n](1).value()[0];
            };
          });
          St(["initial", "tail"], function (e, t) {
            var n = "drop" + (t ? "" : "Right");
            zn.prototype[e] = function () {
              if (this.__filtered__) {
                return new zn(this);
              } else {
                return this[n](1);
              }
            };
          });
          zn.prototype.compact = function () {
            return this.filter(nu);
          };
          zn.prototype.find = function (e) {
            return this.filter(e).head();
          };
          zn.prototype.findLast = function (e) {
            return this.reverse().find(e);
          };
          zn.prototype.invokeMap = Jr(function (e, t) {
            if (typeof e == "function") {
              return new zn(this);
            } else {
              return this.map(function (n) {
                return Tr(n, e, t);
              });
            }
          });
          zn.prototype.reject = function (e) {
            return this.filter(Ls(oo(e)));
          };
          zn.prototype.slice = function (e, t) {
            e = fa(e);
            var n = this;
            if (n.__filtered__ && (e > 0 || t < 0)) {
              return new zn(n);
            } else {
              if (e < 0) {
                n = n.takeRight(-e);
              } else if (e) {
                n = n.drop(e);
              }
              if (t !== i) {
                n = (t = fa(t)) < 0 ? n.dropRight(-t) : n.take(t - e);
              }
              return n;
            }
          };
          zn.prototype.takeRightWhile = function (e) {
            return this.reverse().takeWhile(e).reverse();
          };
          zn.prototype.toArray = function () {
            return this.take(f);
          };
          _r(zn.prototype, function (e, t) {
            var n = /^(?:filter|find|map|reject)|While$/.test(t);
            var r = /^(?:head|last)$/.test(t);
            var o = jn[r ? "take" + (t == "last" ? "Right" : "") : t];
            var s = r || /^find/.test(t);
            if (o) {
              jn.prototype[t] = function () {
                var t = this.__wrapped__;
                var a = r ? [1] : arguments;
                var u = t instanceof zn;
                var l = a[0];
                var c = u || Fs(t);
                function h(e) {
                  var t = o.apply(jn, Ot([e], a));
                  if (r && d) {
                    return t[0];
                  } else {
                    return t;
                  }
                }
                if (c && n && typeof l == "function" && l.length != 1) {
                  u = c = false;
                }
                var d = this.__chain__;
                var f = !!this.__actions__.length;
                var g = s && !d;
                var p = u && !f;
                if (!s && c) {
                  t = p ? t : new zn(this);
                  var v = e.apply(t, a);
                  v.__actions__.push({
                    func: ds,
                    args: [h],
                    thisArg: i
                  });
                  return new qn(v, d);
                }
                if (g && p) {
                  return e.apply(this, a);
                } else {
                  v = this.thru(h);
                  if (g) {
                    if (r) {
                      return v.value()[0];
                    } else {
                      return v.value();
                    }
                  } else {
                    return v;
                  }
                }
              };
            }
          });
          St(["pop", "push", "shift", "sort", "splice", "unshift"], function (e) {
            var t = Te[e];
            var n = /^(?:push|sort|unshift)$/.test(e) ? "tap" : "thru";
            var r = /^(?:pop|shift)$/.test(e);
            jn.prototype[e] = function () {
              var e = arguments;
              if (r && !this.__chain__) {
                var i = this.value();
                return t.apply(Fs(i) ? i : [], e);
              }
              return this[n](function (n) {
                return t.apply(Fs(n) ? n : [], e);
              });
            };
          });
          _r(zn.prototype, function (e, t) {
            var n = jn[t];
            if (n) {
              var r = n.name + "";
              if (!xe.call(Dn, r)) {
                Dn[r] = [];
              }
              Dn[r].push({
                name: t,
                func: n
              });
            }
          });
          Dn[Ui(i, 2).name] = [{
            name: "wrapper",
            func: i
          }];
          zn.prototype.clone = function () {
            var e = new zn(this.__wrapped__);
            e.__actions__ = Ai(this.__actions__);
            e.__dir__ = this.__dir__;
            e.__filtered__ = this.__filtered__;
            e.__iteratees__ = Ai(this.__iteratees__);
            e.__takeCount__ = this.__takeCount__;
            e.__views__ = Ai(this.__views__);
            return e;
          };
          zn.prototype.reverse = function () {
            if (this.__filtered__) {
              var e = new zn(this);
              e.__dir__ = -1;
              e.__filtered__ = true;
            } else {
              (e = this.clone()).__dir__ *= -1;
            }
            return e;
          };
          zn.prototype.value = function () {
            var e = this.__wrapped__.value();
            var t = this.__dir__;
            var n = Fs(e);
            var r = t < 0;
            var i = n ? e.length : 0;
            var o = function (e, t, n) {
              for (var r = -1, i = n.length; ++r < i;) {
                var o = n[r];
                var s = o.size;
                switch (o.type) {
                  case "drop":
                    e += s;
                    break;
                  case "dropRight":
                    t -= s;
                    break;
                  case "take":
                    t = yn(t, e + s);
                    break;
                  case "takeRight":
                    e = vn(e, t - s);
                }
              }
              return {
                start: e,
                end: t
              };
            }(0, i, this.__views__);
            var s = o.start;
            var a = o.end;
            var u = a - s;
            var l = r ? a : s - 1;
            var c = this.__iteratees__;
            var h = c.length;
            var d = 0;
            var f = yn(u, this.__takeCount__);
            if (!n || !r && i == u && f == u) {
              return hi(e, this.__actions__);
            }
            var g = [];
            e: while (u-- && d < f) {
              for (var p = -1, v = e[l += t]; ++p < h;) {
                var y = c[p];
                var _ = y.iteratee;
                var m = y.type;
                var w = _(v);
                if (m == 2) {
                  v = w;
                } else if (!w) {
                  if (m == 1) {
                    continue e;
                  }
                  break e;
                }
              }
              g[d++] = v;
            }
            return g;
          };
          jn.prototype.at = fs;
          jn.prototype.chain = function () {
            return hs(this);
          };
          jn.prototype.commit = function () {
            return new qn(this.value(), this.__chain__);
          };
          jn.prototype.next = function () {
            if (this.__values__ === i) {
              this.__values__ = ha(this.value());
            }
            var e = this.__index__ >= this.__values__.length;
            return {
              done: e,
              value: e ? i : this.__values__[this.__index__++]
            };
          };
          jn.prototype.plant = function (e) {
            var t;
            for (var n = this; n instanceof Nn;) {
              var r = jo(n);
              r.__index__ = 0;
              r.__values__ = i;
              if (t) {
                o.__wrapped__ = r;
              } else {
                t = r;
              }
              var o = r;
              n = n.__wrapped__;
            }
            o.__wrapped__ = e;
            return t;
          };
          jn.prototype.reverse = function () {
            var e = this.__wrapped__;
            if (e instanceof zn) {
              var t = e;
              if (this.__actions__.length) {
                t = new zn(this);
              }
              (t = t.reverse()).__actions__.push({
                func: ds,
                args: [Yo],
                thisArg: i
              });
              return new qn(t, this.__chain__);
            }
            return this.thru(Yo);
          };
          jn.prototype.toJSON = jn.prototype.valueOf = jn.prototype.value = function () {
            return hi(this.__wrapped__, this.__actions__);
          };
          jn.prototype.first = jn.prototype.head;
          if (He) {
            jn.prototype[He] = function () {
              return this;
            };
          }
          return jn;
        }();
        ht._ = gn;
        if ((r = function () {
          return gn;
        }.call(t, n, t, e)) !== i) {
          e.exports = r;
        }
      }).call(this);
    },
    919: (e, t, n) => {
      "use strict";

      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.AnalyticsError = t.PAYMENT_PROVIDERS = undefined;
      const r = n(307);
      t.PAYMENT_PROVIDERS = ["xsolla"];
      class i extends r.GeneralError {
        constructor(e, t) {
          super(e, t);
          this.code = e;
          this.message = t;
        }
      }
      t.AnalyticsError = i;
    },
    922: (e, t) => {
      "use strict";

      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.MAIN_BADGE = undefined;
      const n = "border-radius: 3px; padding: 0px 4px; color: white;";
      t.MAIN_BADGE = ["%cHTML5 SDK", `background-color: #6842FF; ${n}`];
      class r {
        constructor(e) {
          this.badge = e;
          this.debugFlagPresent = window.location.href.includes("sdk_debug=true");
        }
        isEnabled() {
          return this.debugFlagPresent || r.forceEnable;
        }
        log(e, ...r) {
          if (!this.isEnabled()) {
            return;
          }
          if (this.badge === "none") {
            return console.log(...t.MAIN_BADGE, e, ...(r.length > 0 ? r : []));
          }
          let i = [];
          switch (this.badge) {
            case "game":
              i = ["%cGAME", `background-color: #d48f06; ${n}`];
              break;
            case "user":
              i = ["%cUSER", `background-color: #3498DB; ${n}`];
              break;
            case "ad":
              i = ["%cAD", `background-color: #008A00; ${n}`];
              break;
            case "banner":
              i = ["%cBANNER", `background-color: #00ABA9; ${n}`];
              break;
            case "data":
              i = ["%cDATA", `background-color: #A21CAF; ${n}`];
              break;
            case "analytics":
              i = ["%cANALYTICS", `background-color: #5c5c5c; ${n}`];
          }
          console.log(`${t.MAIN_BADGE[0]}%c ${i[0]}`, t.MAIN_BADGE[1], "", i[1], e, ...(r.length > 0 ? r : []));
        }
        verbose(e, ...n) {
          if (this.isEnabled()) {
            console.debug(`${t.MAIN_BADGE[0]}%c %c${e}`, t.MAIN_BADGE[1], "", "color: #3d7fff", ...(n.length > 0 ? n : []));
          }
        }
        warn(e, ...n) {
          if (this.isEnabled()) {
            console.warn(...t.MAIN_BADGE, e, ...(n.length > 0 ? n : []));
          }
        }
        error(e, ...n) {
          console.error(...t.MAIN_BADGE, e, ...(n.length > 0 ? n : []));
        }
      }
      r.forceEnable = false;
      t.default = r;
    },
    927: function (e, t, n) {
      "use strict";

      var r = this && this.__importDefault || function (e) {
        if (e && e.__esModule) {
          return e;
        } else {
          return {
            default: e
          };
        }
      };
      Object.defineProperty(t, "__esModule", {
        value: true
      });
      const i = n(65);
      const o = n(940);
      const s = r(n(922));
      const a = n(488);
      const u = n(891);
      t.default = class {
        constructor(e) {
          this.sdk = e;
          this.disableBannerCheck = false;
          this.overlayBanners = {};
          this.renderedBannerIds = new Set();
          this.logger = new s.default("banner");
        }
        async requestBanner(e) {
          this.logger.log("Requesting banner with automatic rendering", e);
          this.ensureVideoAdNotPlaying(e.id);
          const t = await this.prefetchBanner(e);
          return this.renderPrefetchedBanner(t);
        }
        async requestResponsiveBanner(e) {
          this.logger.log(`Requesting responsive banner with automatic rendering #${e}`);
          this.ensureVideoAdNotPlaying(e);
          const t = await (0, a.getBannerContainer)(e, !this.disableBannerCheck);
          const {
            width: n,
            height: r
          } = t.containerInfo.size;
          const i = await this.prefetchResponsiveBanner({
            id: e,
            width: n,
            height: r
          });
          return this.renderPrefetchedBanner(i);
        }
        async prefetchBanner(e) {
          this.logger.log("Prefetch banner", e);
          const t = (0, a.ContainerIdToInnerId)(e.id);
          const n = {
            ...e,
            id: t
          };
          return {
            id: n.id,
            banner: n,
            options: {}
          };
        }
        async prefetchResponsiveBanner(e) {
          this.logger.log(`Prefetch responsive banner #${e.id}`);
          const {
            width: t,
            height: n
          } = e;
          const r = {
            id: (0, a.ContainerIdToInnerId)(e.id),
            width: t,
            height: n,
            isResponsive: true
          };
          return {
            id: r.id,
            banner: r,
            options: {}
          };
        }
        async renderPrefetchedBanner(e) {
          this.logger.log("Rendering prefetched banner", e);
          const t = (0, a.InnerIdToContainerId)(e.id);
          this.ensureVideoAdNotPlaying(t);
          await (0, a.getBannerContainer)(t, true);
          this.renderedBannerIds.add(t);
          (0, o.renderFakeBanner)(e.banner);
        }
        ensureVideoAdNotPlaying(e) {
          if (this.sdk.ad.isAdPlaying) {
            throw new u.BannerError("videoAdPlaying", "Banners cannot be rendered while a video ad is playing", e);
          }
        }
        requestOverlayBanners(e, t) {
          const n = e.map(e => e.id);
          Object.keys(this.overlayBanners).forEach(e => {
            if (!n.includes(e)) {
              this.logger.log("Remove overlay banner " + e);
              this.overlayBanners[e].destroy();
              delete this.overlayBanners[e];
            }
          });
          e.forEach(e => {
            if (this.overlayBanners[e.id]) {
              this.logger.log("Skip overlay banner update " + e.id);
              return;
            }
            this.logger.log("Create overlay banner " + e.id);
            const n = new i.OverlayBanner(e, this.disableBannerCheck, this, t);
            this.overlayBanners[e.id] = n;
          });
        }
        clearBanner(e) {
          const t = document.getElementById((0, a.ContainerIdToInnerId)(e));
          if (t) {
            t.remove();
            this.renderedBannerIds.delete(e);
            this.logger.log(`Cleared the banner from container #${e}`);
          } else {
            this.logger.log(`There isn't a banner in container #${e}, not clearing anything.`);
          }
        }
        clearAllBanners() {
          const e = Array.from(this.renderedBannerIds.values());
          this.logger.log("Clearing all banners, ids: ", e.map(e => `#${e}`).join(", "));
          e.forEach(e => {
            this.clearBanner(e);
          });
        }
        get activeBannersCount() {
          return this.renderedBannerIds.size;
        }
      };
    },
    940: function (e, t, n) {
      "use strict";

      var r = this && this.__importDefault || function (e) {
        if (e && e.__esModule) {
          return e;
        } else {
          return {
            default: e
          };
        }
      };
      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.renderFakeBanner = undefined;
      const i = r(n(922));
      const o = n(891);
      const s = n(918);
      const a = new i.default("banner");
      const u = [{
        width: 970,
        height: 90
      }, {
        width: 320,
        height: 50
      }, {
        width: 160,
        height: 600
      }, {
        width: 336,
        height: 280
      }, {
        width: 728,
        height: 90
      }, {
        width: 300,
        height: 600
      }, {
        width: 468,
        height: 60
      }, {
        width: 970,
        height: 250
      }, {
        width: 300,
        height: 250
      }, {
        width: 250,
        height: 250
      }, {
        width: 120,
        height: 600
      }];
      t.renderFakeBanner = function (e) {
        a.log("Rendering fake banner", e);
        const t = document.getElementById(e.id);
        if (!t) {
          console.error(`Didn't find container #${e.id} for rendering fake banner`);
          return;
        }
        let n = e.width;
        let r = e.height;
        if (e.isResponsive) {
          const e = (0, s.shuffle)(u).find(e => n >= e.width && r >= e.height);
          if (!e) {
            throw new o.BannerError("noAvailableSizes", "No available banner size has been found", t.id);
          }
          n = e.width;
          r = e.height;
        }
        t.innerHTML = "";
        const i = document.createElement("img");
        i.setAttribute("src", `https://images.crazygames.com/crazygames-sdk/${n}x${r}.png`);
        i.setAttribute("width", `${n}px`);
        i.setAttribute("height", `${r}px`);
        t.appendChild(i);
        t.style.backgroundColor = "rgb(191, 173, 255, 0.25)";
      };
    },
    951: function (e, t, n) {
      "use strict";

      var r = this && this.__importDefault || function (e) {
        if (e && e.__esModule) {
          return e;
        } else {
          return {
            default: e
          };
        }
      };
      Object.defineProperty(t, "__esModule", {
        value: true
      });
      t.prepareInitialGameData = t.checkDataLimits = t.loadCachedCloudGameDataFromLs = t.loadGameDataFromLs = undefined;
      const i = n(809);
      const o = r(n(922));
      const s = n(557);
      const a = n(67);
      const u = n(583);
      const l = n(115);
      const c = n(553);
      const h = new o.default("data");
      function d(e) {
        const t = (0, c.generateLsGameDataKey)(e);
        try {
          const e = u.SafeLocalStorage.Instance.getItem(t);
          return e && JSON.parse(e).data || {};
        } catch (e) {
          h.error(`Failed to retrieve local game data (${t}), initializing empty data. Error ${e}`);
          (0, s.sendErrorToGf)("load-ls-fail", "data");
          return {};
        }
      }
      function f(e) {
        const t = (0, l.generateCloudCacheLsGameDataKey)(e);
        try {
          const e = u.SafeLocalStorage.Instance.getItem(t);
          return e && JSON.parse(e).data || {};
        } catch (e) {
          h.error(`Failed to retrieve cached cloud game data from localStorage (${t}), initializing empty data. Error ${e}`);
          (0, s.sendErrorToGf)("load-cached-cloud-fail", "data");
          return {};
        }
      }
      t.loadGameDataFromLs = d;
      t.loadCachedCloudGameDataFromLs = f;
      t.checkDataLimits = function (e) {
        const t = new TextEncoder().encode(e);
        if (t.length > i.MAX_DATA_LENGTH) {
          (0, s.sendErrorToGf)("size-exceeded", "data", {
            maxSize: i.MAX_DATA_LENGTH,
            dataSize: t.length
          });
          throw new i.DataError("dataLimitExcedeed", `Game data when converted to a JSON string cannot exceed ${i.MAX_DATA_LENGTH} bytes. Data was not saved`);
        }
        if (t.length > i.MAX_DATA_LENGTH * 0.9) {
          h.warn(`You are approaching ${i.MAX_DATA_LENGTH} bytes data limit.`);
        }
      };
      t.prepareInitialGameData = async function (e, t) {
        if (t.isQaTool) {
          h.verbose("Running in QA tool, always using local data here");
          return {
            data: d(t.gameId),
            handler: "local"
          };
        } else if (t.dataModule.isEnabled) {
          if (e) {
            return new Promise(e => {
              let n;
              const r = async i => {
                if (i.data.type === "sdkGameDataResponseNew") {
                  h.verbose("Received game data from GF", i.data);
                  window.removeEventListener("message", r, false);
                  if (n !== undefined) {
                    window.clearTimeout(n);
                  }
                  const o = i.data.data;
                  if (o.status === "loaded") {
                    if (o.hasData) {
                      e({
                        data: o.data,
                        handler: "cloud"
                      });
                    } else {
                      (() => {
                        const n = (0, c.generateLsGameDataKey)(t.gameId);
                        if (u.SafeLocalStorage.Instance.getItem(n)) {
                          h.verbose("Cloud data missing but has local data, initialize with local data");
                          const n = d(t.gameId);
                          e({
                            data: n,
                            handler: "cloud"
                          });
                        } else {
                          h.verbose("Cloud data and local data missing, initialize with empty data");
                          e({
                            data: {},
                            handler: "cloud"
                          });
                        }
                      })();
                    }
                  } else {
                    h.error("GF failed to load cloud game data, will load cached cloud data.");
                    (0, s.sendErrorToGf)("gf-data-load-fail", "data");
                    const n = f(t.gameId);
                    h.verbose("Loaded cached cloud data, data will not be synced in this session", n);
                    e({
                      data: n,
                      handler: "cloud",
                      doNotSync: true
                    });
                  }
                }
              };
              h.verbose("Requesting game data from GF");
              window.addEventListener("message", r, false);
              a.GF_WINDOW.postMessage({
                type: "requestSdkGameDataNew"
              }, "*");
              n = window.setTimeout(() => {
                h.error("Did not get game data reply from GF in 10000ms. Using cached cloud data if present. Disable data sync for this session.");
                (0, s.sendErrorToGf)("gf-response-timeout", "data", {
                  timeoutMs: 10000
                });
                window.removeEventListener("message", r, false);
                const n = f(t.gameId);
                e({
                  data: n,
                  handler: "cloud",
                  doNotSync: true
                });
              }, 10000);
            });
          } else {
            h.verbose("User signed out, loading data from LocalStorage");
            return {
              data: d(t.gameId),
              handler: "local"
            };
          }
        } else {
          return {
            handler: "disabled"
          };
        }
      };
    }
  };
  var t = {};
  function n(r) {
    var i = t[r];
    if (i !== undefined) {
      return i.exports;
    }
    var o = t[r] = {
      id: r,
      loaded: false,
      exports: {}
    };
    e[r].call(o.exports, o, o.exports, n);
    o.loaded = true;
    return o.exports;
  }
  n.g = function () {
    if (typeof globalThis == "object") {
      return globalThis;
    }
    try {
      return this || new Function("return this")();
    } catch (e) {
      if (typeof window == "object") {
        return window;
      }
    }
  }();
  n.nmd = e => {
    e.paths = [];
    e.children ||= [];
    return e;
  };
  n(250);
})();