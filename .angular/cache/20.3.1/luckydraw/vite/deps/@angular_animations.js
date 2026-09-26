import {
  AUTO_STYLE,
  AnimationGroupPlayer,
  AnimationMetadataType,
  NoopAnimationPlayer,
  animate,
  animateChild,
  animation,
  group,
  keyframes,
  query,
  sequence,
  stagger,
  state,
  style,
  transition,
  trigger,
  useAnimation,
  ɵPRE_STYLE
} from "./chunk-6LMADXH6.js";
import {
  ANIMATION_MODULE_TYPE,
  DOCUMENT,
  Inject,
  Injectable,
  RendererFactory2,
  RuntimeError,
  ViewEncapsulation,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-5SRJRJTV.js";
import "./chunk-5J6MTK63.js";
import "./chunk-JLWNR5KO.js";
import "./chunk-ANSFKXDE.js";
import "./chunk-DTIHH3SQ.js";
import {
  __name,
  __publicField
} from "./chunk-Y7LMDMBK.js";

// node_modules/@angular/animations/fesm2022/animations.mjs
var _AnimationBuilder = class _AnimationBuilder {
};
__name(_AnimationBuilder, "AnimationBuilder");
__publicField(_AnimationBuilder, "ɵfac", /* @__PURE__ */ __name(function AnimationBuilder_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AnimationBuilder)();
}, "AnimationBuilder_Factory"));
__publicField(_AnimationBuilder, "ɵprov", ɵɵdefineInjectable({
  token: _AnimationBuilder,
  factory: /* @__PURE__ */ __name(() => (() => inject(BrowserAnimationBuilder))(), "factory"),
  providedIn: "root"
}));
var AnimationBuilder = _AnimationBuilder;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AnimationBuilder, [{
    type: Injectable,
    args: [{
      providedIn: "root",
      useFactory: /* @__PURE__ */ __name(() => inject(BrowserAnimationBuilder), "useFactory")
    }]
  }], null, null);
})();
var _AnimationFactory = class _AnimationFactory {
};
__name(_AnimationFactory, "AnimationFactory");
var AnimationFactory = _AnimationFactory;
var _BrowserAnimationBuilder = class _BrowserAnimationBuilder extends AnimationBuilder {
  animationModuleType = inject(ANIMATION_MODULE_TYPE, {
    optional: true
  });
  _nextAnimationId = 0;
  _renderer;
  constructor(rootRenderer, doc) {
    super();
    const typeData = {
      id: "0",
      encapsulation: ViewEncapsulation.None,
      styles: [],
      data: {
        animation: []
      }
    };
    this._renderer = rootRenderer.createRenderer(doc.body, typeData);
    if (this.animationModuleType === null && !isAnimationRenderer(this._renderer)) {
      throw new RuntimeError(3600, (typeof ngDevMode === "undefined" || ngDevMode) && "Angular detected that the `AnimationBuilder` was injected, but animation support was not enabled. Please make sure that you enable animations in your application by calling `provideAnimations()` or `provideAnimationsAsync()` function.");
    }
  }
  build(animation2) {
    const id = this._nextAnimationId;
    this._nextAnimationId++;
    const entry = Array.isArray(animation2) ? sequence(animation2) : animation2;
    issueAnimationCommand(this._renderer, null, id, "register", [entry]);
    return new BrowserAnimationFactory(id, this._renderer);
  }
};
__name(_BrowserAnimationBuilder, "BrowserAnimationBuilder");
__publicField(_BrowserAnimationBuilder, "ɵfac", /* @__PURE__ */ __name(function BrowserAnimationBuilder_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _BrowserAnimationBuilder)(ɵɵinject(RendererFactory2), ɵɵinject(DOCUMENT));
}, "BrowserAnimationBuilder_Factory"));
__publicField(_BrowserAnimationBuilder, "ɵprov", ɵɵdefineInjectable({
  token: _BrowserAnimationBuilder,
  factory: _BrowserAnimationBuilder.ɵfac,
  providedIn: "root"
}));
var BrowserAnimationBuilder = _BrowserAnimationBuilder;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrowserAnimationBuilder, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: RendererFactory2
  }, {
    type: Document,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }], null);
})();
var _BrowserAnimationFactory = class _BrowserAnimationFactory extends AnimationFactory {
  _id;
  _renderer;
  constructor(_id, _renderer) {
    super();
    this._id = _id;
    this._renderer = _renderer;
  }
  create(element, options) {
    return new RendererAnimationPlayer(this._id, element, options || {}, this._renderer);
  }
};
__name(_BrowserAnimationFactory, "BrowserAnimationFactory");
var BrowserAnimationFactory = _BrowserAnimationFactory;
var _RendererAnimationPlayer = class _RendererAnimationPlayer {
  id;
  element;
  _renderer;
  parentPlayer = null;
  _started = false;
  constructor(id, element, options, _renderer) {
    this.id = id;
    this.element = element;
    this._renderer = _renderer;
    this._command("create", options);
  }
  _listen(eventName, callback) {
    return this._renderer.listen(this.element, `@@${this.id}:${eventName}`, callback);
  }
  _command(command, ...args) {
    issueAnimationCommand(this._renderer, this.element, this.id, command, args);
  }
  onDone(fn) {
    this._listen("done", fn);
  }
  onStart(fn) {
    this._listen("start", fn);
  }
  onDestroy(fn) {
    this._listen("destroy", fn);
  }
  init() {
    this._command("init");
  }
  hasStarted() {
    return this._started;
  }
  play() {
    this._command("play");
    this._started = true;
  }
  pause() {
    this._command("pause");
  }
  restart() {
    this._command("restart");
  }
  finish() {
    this._command("finish");
  }
  destroy() {
    this._command("destroy");
  }
  reset() {
    this._command("reset");
    this._started = false;
  }
  setPosition(p) {
    this._command("setPosition", p);
  }
  getPosition() {
    return unwrapAnimationRenderer(this._renderer)?.engine?.players[this.id]?.getPosition() ?? 0;
  }
  totalTime = 0;
};
__name(_RendererAnimationPlayer, "RendererAnimationPlayer");
var RendererAnimationPlayer = _RendererAnimationPlayer;
function issueAnimationCommand(renderer, element, id, command, args) {
  renderer.setProperty(element, `@@${id}:${command}`, args);
}
__name(issueAnimationCommand, "issueAnimationCommand");
function unwrapAnimationRenderer(renderer) {
  const type = renderer.ɵtype;
  if (type === 0) {
    return renderer;
  } else if (type === 1) {
    return renderer.animationRenderer;
  }
  return null;
}
__name(unwrapAnimationRenderer, "unwrapAnimationRenderer");
function isAnimationRenderer(renderer) {
  const type = renderer.ɵtype;
  return type === 0 || type === 1;
}
__name(isAnimationRenderer, "isAnimationRenderer");
export {
  AUTO_STYLE,
  AnimationBuilder,
  AnimationFactory,
  AnimationMetadataType,
  NoopAnimationPlayer,
  animate,
  animateChild,
  animation,
  group,
  keyframes,
  query,
  sequence,
  stagger,
  state,
  style,
  transition,
  trigger,
  useAnimation,
  AnimationGroupPlayer as ɵAnimationGroupPlayer,
  BrowserAnimationBuilder as ɵBrowserAnimationBuilder,
  ɵPRE_STYLE
};
/*! Bundled license information:

@angular/animations/fesm2022/animations.mjs:
  (**
   * @license Angular v20.3.1
   * (c) 2010-2025 Google LLC. https://angular.io/
   * License: MIT
   *)
*/
//# sourceMappingURL=@angular_animations.js.map
