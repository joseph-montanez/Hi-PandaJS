(function(){
  var Darkcore;
  Darkcore = Darkcore || {};
  this.Darkcore = Darkcore;
}).call(this);

(function(){
  var Engine;
  Darkcore.Engine = Engine = (function(){
    Engine.displayName = 'Engine';
    var prototype = Engine.prototype, constructor = Engine;
    Engine.getTime = function(){
      if (typeof window.performance !== 'undefined') {
        return performance.now();
      } else {
        return Date.now();
      }
    };
    Engine.loop = function(fn, delay){
      if (typeof window.requestAnimationFrame !== 'undefined') {
        return window.requestAnimationFrame(fn);
      } else {
        return setTimeout(fn, delay);
      }
    };
    function Engine(width, height, title){
      title == null && (title = "");
      this.frames_per_second = 60;
      this.keys = null;
      this.mouse_x = 0;
      this.mouse_y = 0;
      this.gamestate = null;
      this.scenes = [];
      this.activeScene = false;
      this.done = false;
      this.interval = false;
      this.div = null;
      this.width = width;
      this.height = height;
      this.title = title;
      this.keys = new Darkcore.KeyState;
      this.id = Math.random() * 100;
      jQuery(window).on('keydown keyup', this, function(evt){
        return evt.data.onKeyboardEvent(evt, evt.type === "keydown" ? true : false);
      });
      jQuery(window).on('mousemove mousedown mouseup', this, function(evt){
        return evt.data.onMouseEvent(evt, evt.type === "mousedown" ? true : false);
      });
      jQuery(window).on('devicemotion', this, function(evt){
        return evt.data.onDeviceEvent(evt.originalEvent);
      });
      this.initVideo();
    }
    prototype.initVideo = function(){
      document.title = this.title;
      this.div = jQuery("<div id=\"Darkcore_frame\" style=\"width: " + this.width + "px; height:" + this.height + "px;\"></div>");
      return this.div.appendTo(document.body);
    };
    prototype.onDeviceEvent = function(evt){
      if (evt.acceleration.x > 0) {
        this.keys.d = true;
      } else {
        this.keys.d = false;
      }
      if (evt.acceleration.x < 0) {
        this.keys.a = true;
      } else {
        this.keys.a = false;
      }
      if (evt.acceleration.y > 0) {
        this.keys.w = true;
      } else {
        this.keys.w = false;
      }
      if (evt.acceleration.y < 0) {
        return this.keys.s = true;
      } else {
        return this.keys.s = false;
      }
    };
    prototype.onMouseEvent = function(evt, is_down){
      var scene, i$, ref$, len$, sprite;
      if (evt.type === "mousedown") {
        scene = this.getActiveScene();
        if (scene !== null) {
          for (i$ = 0, len$ = (ref$ = scene.sprites).length; i$ < len$; ++i$) {
            sprite = ref$[i$];
            if (sprite.div[0] === evt.target) {
              sprite.onLeftClick(evt);
              break;
            }
          }
        }
      }
      if (evt.type === "mousemove") {
        this.mouse_x = evt.clientX;
        return this.mouse_y = evt.clientY;
      } else if (evt.which === 1) {
        return this.keys.mouse_left = is_down;
      } else if (evt.which === 3) {
        return this.keys.mouse_right = is_down;
      } else if (evt.which === 2) {
        return this.keys.mouse_middle = is_down;
      }
    };
    prototype.onKeyboardEvent = function(evt, is_down){
      var letter;
      letter = String.fromCharCode(evt.which).toLocaleLowerCase();
      if (letter === "w") {
        return this.keys.w = is_down;
      } else if (letter === "s") {
        return this.keys.s = is_down;
      } else if (letter === "a") {
        return this.keys.a = is_down;
      } else if (letter === "d") {
        return this.keys.d = is_down;
      } else if (letter === "b") {
        return this.keys.b = is_down;
      } else if (evt.which === 38) {
        return this.keys.up = is_down;
      } else if (evt.which === 40) {
        return this.keys.down = is_down;
      } else if (evt.which === 37) {
        return this.keys.left = is_down;
      } else if (evt.which === 39) {
        return this.keys.right = is_down;
      } else if (evt.which === 32) {
        return this.keys.space = is_down;
      }
    };
    prototype.addScene = function(scene){
      scene.engine = this;
      return this.scenes.push(scene);
    };
    prototype.getActiveScene = function(){
      var active, i$, ref$, len$, i, scene;
      if (!this.activeScene) {
        active = false;
        for (i$ = 0, len$ = (ref$ = this.scenes).length; i$ < len$; ++i$) {
          i = i$;
          scene = ref$[i$];
          if (scene.active) {
            this.activeScene = i;
            active = true;
            break;
          }
        }
        if (!active) {
          this.activeScene = 0;
          this.scenes[0].setActive();
        }
      }
      return this.scenes[this.activeScene];
    };
    prototype.processEvents = function(){};
    prototype.render = function(){
      var old_time, last_time, fps, minticks, parent, render_loop;
      old_time = Darkcore.Engine.getTime();
      last_time = old_time;
      fps = 0;
      minticks = 1000 / 60;
      parent = this;
      render_loop = function(time){
        var new_time, fpsdelta, delta;
        if (parent.done) {
          cancelAnimationFrame(parent.interval);
          return;
        }
        new_time = Darkcore.Engine.getTime();
        fpsdelta = new_time - old_time;
        delta = (new_time - last_time) / 1000;
        parent.processEvents();
        if (parent.activeScene === false) {
          parent.scenes[0].setActive();
          parent.activeScene = 0;
        }
        parent.scenes[parent.activeScene].render(delta);
        fps++;
        last_time = new_time;
        if (fpsdelta > 1000) {
          old_time = new_time;
          parent.frames_per_second = fps;
          fps = 0;
        }
        return Darkcore.Engine.loop(render_loop, minticks);
      };
      return this.interval = Darkcore.Engine.loop(render_loop, minticks);
    };
    prototype.run = function(){
      return this.render();
    };
    return Engine;
  }());
  this.Darkcore.Engine = Darkcore.Engine;
}).call(this);

(function(){
  var KeyState;
  Darkcore.KeyState = KeyState = (function(){
    KeyState.displayName = 'KeyState';
    var prototype = KeyState.prototype, constructor = KeyState;
    prototype.d = false;
    prototype.mouse_left = false;
    prototype.mouse_right = false;
    prototype.mouse_middle = false;
    prototype.up = false;
    prototype.down = false;
    prototype.left = false;
    prototype.right = false;
    prototype.space = false;
    prototype.w = false;
    prototype.s = false;
    prototype.a = false;
    prototype.b = false;
    prototype.is_up = function(){
      return this.up;
    };
    function KeyState(){}
    return KeyState;
  }());
  this.Darkcore.KeyState = Darkcore.KeyState;
}).call(this);

(function(){
  var Scene, out$ = typeof exports != 'undefined' && exports || this;
  Scene = (function(){
    Scene.displayName = 'Scene';
    var prototype = Scene.prototype, constructor = Scene;
    function Scene(name, engine){
      var engineId;
      this.camera_x = 0;
      this.camera_y = 0;
      this.last_camera = "";
      this.background_color = [255, 255, 255, 1.0];
      this.timed_events = [];
      this.render_events = [];
      this.remove_queue = [];
      this.textures = [];
      this.sounds = [];
      this.engine = null;
      this.gamestate = null;
      this.div = null;
      this.active = false;
      engineId = engine.addScene(this);
      this.id = "dc-scene-" + engineId;
      this.name = name;
      this.engine = engine;
      this.div = null;
      this.sprites = [];
    }
    prototype.createElement = function(){
      this.div = jQuery("<div id=\"" + this.id + "\" style=\"" + this.getStyles().join(';') + "\"></div>");
      this.div.appendTo(this.engine.div);
      if (this.isActive()) {
        return this.div.css('display', 'block');
      }
    };
    prototype.setInactive = function(){
      return this.active = false;
    };
    prototype.setActive = function(){
      return this.active = true;
    };
    prototype.isActive = function(){
      return this.active;
    };
    prototype.getStyles = function(styles){
      styles == null && (styles = []);
      styles.push("position: absolute");
      styles.push("left: 0");
      styles.push("top: 0");
      styles.push("animation-duration: 16ms");
      styles.push("animation-timing-function: linear");
      if (this.active) {
        styles.push("display: block");
      } else {
        styles.push("display: hidden");
      }
      styles.push("width: " + this.engine.width + "px");
      styles.push("height: " + this.engine.height + "px");
      if (Modernizr.csstransforms3d) {
        styles.push("-webkit-transform: translate3d(" + this.camera_x + "px, " + this.camera_y + "px, 0)");
        styles.push("-moz-transform: translate3d(" + this.camera_x + "px, " + this.camera_y + "px, 0)");
      } else {
        styles.push("-webkit-transform: translate(" + this.camera_x + "px, " + this.camera_y + "px)");
        styles.push("-moz-transform: translate(" + this.camera_x + "px, " + this.camera_y + "px)");
      }
      return styles;
    };
    prototype.draw = function(delta){
      var i$, ref$, len$, sprite, styles, item_index;
      for (i$ = 0, len$ = (ref$ = this.sprites).length; i$ < len$; ++i$) {
        sprite = ref$[i$];
        styles = sprite.onRender(delta);
        sprite.render(delta, styles);
      }
      if (this.remove_queue.length > 0) {
        for (i$ = 0, len$ = (ref$ = this.remove_queue).length; i$ < len$; ++i$) {
          sprite = ref$[i$];
          item_index = this.sprites.indexOf(sprite);
          if (item_index > -1) {
            this.div[0].removeChild(sprite.div[0]);
            this.sprites.splice(item_index, 1);
          }
        }
        this.remove_queue = [];
      }
      styles = this.getStyles([]).join(';');
      if (this.last_style !== styles) {
        this.div[0].style.cssText = styles;
        return this.last_style = styles;
      }
    };
    prototype.render = function(delta){
      var i$, ref$, len$, sprite, mgr, i;
      if (this.div === null) {
        this.createElement();
      }
      for (i$ = 0, len$ = (ref$ = this.sprites).length; i$ < len$; ++i$) {
        sprite = ref$[i$];
        sprite.onBeforeRender(delta);
      }
      for (i$ = 0, len$ = (ref$ = this.timed_events).length; i$ < len$; ++i$) {
        mgr = i$;
        i = ref$[i$];
        if (delta - mgr.getActiveTime() > mgr.getTimeout()) {
          mgr.callCallback();
          this.timed_events.splice(i, 1);
        }
      }
      return this.draw(delta);
    };
    prototype.addSound = function(sound){
      var ref$;
      sound.scene = this;
      return (ref$ = this.sounds)[ref$.length] = sound;
    };
    prototype.addSprite = function(sprite){
      var ref$;
      sprite.scene = this;
      return (ref$ = this.sprites)[ref$.length] = sprite;
    };
    prototype.removeSprite = function(sprite){
      return this.remove_queue.push(sprite);
    };
    prototype.addEvent = function(evtType, evt){
      var mgr;
      if (evtType === Darkcore.EventTypes.Render) {
        mgr = new Darkcore.EventManager;
        mgr.addCallback(evt);
        return this.render_events.push(mgr);
      }
    };
    prototype.addTimer = function(evt, timeout){
      var mgr;
      mgr = new Darkcore.EventManager;
      mgr.addCallbackTimer(evt, timeout);
      return this.timed_events.push(mgr);
    };
    prototype.setBackgroundColor = function(r, g, b, a){
      this.background_color = [r, g, b, a];
      return jQuery(this.div).css("background-color", "rgba(" + this.background_color[0] + ", " + this.background_color[1] + ", " + this.background_color[2] + ", " + this.background_color[3] + ")");
    };
    return Scene;
  }());
  out$.Scene = Darkcore.Scene = Scene;
}).call(this);

(function(){
  var Sprite, out$ = typeof exports != 'undefined' && exports || this;
  Sprite = (function(){
    Sprite.displayName = 'Sprite';
    var prototype = Sprite.prototype, constructor = Sprite;
    Sprite.fromTexture = function(scene, filename){
      var texture, sprite;
      texture = Darkcore.Texture(scene, filename);
      sprite = new Darkcore.Sprite(scene);
      sprite.textureIndex = texture.textureId;
      return sprite;
    };
    function Sprite(scene, width, height, x, y){
      width == null && (width = 0);
      height == null && (height = 0);
      x == null && (x = 0);
      y == null && (y = 0);
      this.rotation = 0.00;
      this.tile_width = 0.00;
      this.tile_height = 0.00;
      this.coords_top_left_x = 0.00;
      this.coords_top_left_y = 0.00;
      this.coords_bottom_left_x = 1.00;
      this.coords_bottom_left_y = 0.00;
      this.coords_bottom_right_x = 1.00;
      this.coords_bottom_right_y = 1.00;
      this.coords_top_right_x = 0.00;
      this.coords_top_right_y = 1.00;
      this.color = [-1, -1, -1];
      this.scale_x = 1.00;
      this.scale_y = 1.00;
      this.animation = false;
      this.animation_from = 0;
      this.animation_to = 0;
      this.animation_current = 0;
      this.animation_duration = 60;
      this.animation_last_tick = 0;
      this.textureIndex = -1;
      this.animation_event = null;
      this.div = null;
      this.last_style = "";
      this.backgroundPosition = [0, 0];
      scene.addSprite(this);
      this.scene = scene;
      this.width = width;
      this.height = height;
      this.x = x;
      this.y = y;
      this.id = "ds_" + Math.floor(Math.random() * 10000);
    }
    prototype.getTexture = function(){
      return this.scene.textures[this.textureIndex];
    };
    prototype.createElement = function(){
      this.div = jQuery("<div id=\"" + this.id + "\" style=\"" + this.getStyles().join(';') + "\"></div>");
      return this.div.appendTo(this.scene.div);
    };
    prototype.destory = function(){
      return false;
    };
    prototype.getId = function(){
      return this.id;
    };
    prototype.setColor = function(r, g, b){
      return this.color = [r, g, b];
    };
    prototype.getBoundingBox = function(mod_x, mod_y){
      var half_width, half_height, bounding_box;
      mod_x == null && (mod_x = 0.00);
      mod_y == null && (mod_y = 0.00);
      half_width = this.width / 2.00;
      half_height = this.height / 2.00;
      bounding_box = new Darkcore.Vector(4);
      bounding_box.set(0, this.x + mod_x - half_width);
      bounding_box.set(1, this.y + mod_y - half_height);
      bounding_box.set(2, this.x + mod_x + half_width);
      bounding_box.set(3, this.y + mod_y + half_height);
      return bounding_box;
    };
    prototype.animaTile = function(x, y){
      this.coords_top_left_x = 0.00 + this.tile_width * x;
      this.coords_top_left_y = 0.00 + this.tile_height * y;
      this.coords_bottom_left_x = this.tile_width + this.tile_width * x;
      this.coords_bottom_left_y = 0.00 + this.tile_height * y;
      this.coords_bottom_right_x = this.tile_width + this.tile_width * x;
      this.coords_bottom_right_y = this.tile_height + this.tile_height * y;
      this.coords_top_right_x = 0.00 + this.tile_width * x;
      return this.coords_top_right_y = this.tile_height + this.tile_height * y;
    };
    prototype.animaFlip = function(){
      var tmp_top_left_x, tmp_top_left_y, tmp_bottom_left_x, tmp_bottom_left_y, tmp_bottom_right_x, tmp_bottom_right_y, tmp_top_right_x, tmp_top_right_y;
      tmp_top_left_x = this.coords_top_left_x;
      tmp_top_left_y = this.coords_top_left_y;
      tmp_bottom_left_x = this.coords_bottom_left_x;
      tmp_bottom_left_y = this.coords_bottom_left_y;
      tmp_bottom_right_x = this.coords_bottom_right_x;
      tmp_bottom_right_y = this.coords_bottom_right_y;
      tmp_top_right_x = this.coords_top_right_x;
      tmp_top_right_y = this.coords_top_right_y;
      this.coords_top_left_x = tmp_bottom_left_x;
      this.coords_top_left_y = tmp_bottom_left_y;
      this.coords_bottom_left_x = tmp_top_left_x;
      this.coords_bottom_left_y = tmp_top_left_y;
      this.coords_bottom_right_x = tmp_top_right_x;
      this.coords_bottom_right_y = tmp_top_right_y;
      this.coords_top_right_x = tmp_bottom_right_x;
      return this.coords_top_right_y = tmp_bottom_right_y;
    };
    prototype.animationStart = function(from, to, delay){
      if (!this.animation) {
        this.animation = true;
        this.animation_duration = delay;
        this.animation_from = from;
        this.animation_current = from;
        this.animation_to = to;
        return this.animation_last_tick = Darkcore.Engine.getTime();
      }
    };
    prototype.animationStop = function(){
      return this.animation = false;
    };
    prototype.getTransformationMatrix = function(){
      var half_width, half_height, tx, ty, sx, sy, matrix, theta, rx, ry;
      half_width = this.width / 2;
      half_height = this.height / 2;
      tx = this.x - half_width;
      ty = this.scene.engine.height - this.y - half_height;
      sx = this.scale_x;
      sy = this.scale_y;
      matrix = [1.00, 0.00, 0.00, 1.00, tx, ty];
      /*
      | cos0  sin0 |
      | -sin0 cos0
      */
      if (this.rotation !== 0.00) {
        theta = this.rotation * 0.0174532925;
        rx = Math.cos(theta);
        ry = Math.sin(theta);
        matrix[0] = matrix[0] * rx;
        matrix[1] = matrix[1] !== 0.00 ? matrix[1] * ry : ry;
        matrix[2] = matrix[2] !== 0.00 ? matrix[1] * ry * -1 : ry;
        matrix[3] = matrix[3] * rx;
      }
      /*
      | sx  0 |
      | 0   sy|
      */
      if (sx !== 1.00) {
        matrix[0] = matrix[0] * sx;
        matrix[1] = matrix[1] * sx;
      }
      if (sy !== 1.00) {
        matrix[2] = matrix[2] * sy;
        matrix[3] = matrix[3] * sy;
      }
      if (Modernizr.csstransforms3d) {
        return [matrix[0], matrix[1], 0, 0, matrix[2], matrix[3], 0, 0, 0, 0, 1, 0, matrix[4], matrix[5], 0, 1];
      } else {
        return matrix;
      }
    };
    prototype.getStyles = function(styles){
      var texture, matrix, matrix_css;
      styles == null && (styles = []);
      styles.push("position: absolute");
      styles.push("left: 0");
      styles.push("top: 0");
      styles.push("animation-duration: 16ms");
      styles.push("animation-timing-function: linear");
      if (!deepEq$(this.color, [-1, -1, -1], '===')) {
        styles.push("background-color: rgb(" + this.color[0] + ", " + this.color[1] + ", " + this.color[2] + ")");
      }
      if (this.textureIndex > -1) {
        texture = this.getTexture();
        styles.push("background-image: url(" + texture.surface.src + ")");
        styles.push("background-position: " + this.backgroundPosition[0] + "px " + this.backgroundPosition[1] + "px");
      }
      styles.push("width: " + this.width + "px");
      styles.push("height: " + this.height + "px");
      matrix = this.getTransformationMatrix();
      if (Modernizr.csstransforms3d) {
        matrix_css = "matrix3d(" + matrix.join(',') + ")";
      } else {
        matrix_css = "matrix(" + matrix.join(',') + ")";
      }
      styles.push("-webkit-transform: " + matrix_css);
      styles.push("-moz-transform: " + matrix_css);
      return styles;
    };
    prototype.render = function(delta, styles){
      styles == null && (styles = []);
      styles = this.getStyles(styles).join(';');
      if (this.last_style !== styles) {
        this.div[0].style.cssText = styles;
        return this.last_style = styles;
      }
    };
    /**
     * Events
     */
    prototype.onBeforeRender = function(){};
    prototype.onRender = function(delta){
      if (this.div === null) {
        this.createElement();
      }
      return [];
    };
    prototype.onLeftClick = function(evt){};
    return Sprite;
  }());
  out$.Sprite = Darkcore.Sprite = Sprite;
  function deepEq$(x, y, type){
    var toString = {}.toString, hasOwnProperty = {}.hasOwnProperty,
        has = function (obj, key) { return hasOwnProperty.call(obj, key); };
    first = true;
    return eq(x, y, []);
    function eq(a, b, stack) {
      var className, length, size, result, alength, blength, r, key, ref, sizeB;
      if (a == null || b == null) { return a === b; }
      if (a.__placeholder__ || b.__placeholder__) { return true; }
      if (a === b) { return a !== 0 || 1 / a == 1 / b; }
      className = toString.call(a);
      if (toString.call(b) != className) { return false; }
      switch (className) {
        case '[object String]': return a == String(b);
        case '[object Number]':
          return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
        case '[object Date]':
        case '[object Boolean]':
          return +a == +b;
        case '[object RegExp]':
          return a.source == b.source &&
                 a.global == b.global &&
                 a.multiline == b.multiline &&
                 a.ignoreCase == b.ignoreCase;
      }
      if (typeof a != 'object' || typeof b != 'object') { return false; }
      length = stack.length;
      while (length--) { if (stack[length] == a) { return true; } }
      stack.push(a);
      size = 0;
      result = true;
      if (className == '[object Array]') {
        alength = a.length;
        blength = b.length;
        if (first) { 
          switch (type) {
          case '===': result = alength === blength; break;
          case '<==': result = alength <= blength; break;
          case '<<=': result = alength < blength; break;
          }
          size = alength;
          first = false;
        } else {
          result = alength === blength;
          size = alength;
        }
        if (result) {
          while (size--) {
            if (!(result = size in a == size in b && eq(a[size], b[size], stack))){ break; }
          }
        }
      } else {
        if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) {
          return false;
        }
        for (key in a) {
          if (has(a, key)) {
            size++;
            if (!(result = has(b, key) && eq(a[key], b[key], stack))) { break; }
          }
        }
        if (result) {
          sizeB = 0;
          for (key in b) {
            if (has(b, key)) { ++sizeB; }
          }
          if (first) {
            if (type === '<<=') {
              result = size < sizeB;
            } else if (type === '<==') {
              result = size <= sizeB
            } else {
              result = size === sizeB;
            }
          } else {
            first = false;
            result = size === sizeB;
          }
        }
      }
      stack.pop();
      return result;
    }
  }
}).call(this);

(function(){
  var Text, out$ = typeof exports != 'undefined' && exports || this;
  Text = (function(superclass){
    var prototype = extend$((import$(Text, superclass).displayName = 'Text', Text), superclass).prototype, constructor = Text;
    function Text(scene, text, width, height, x, y){
      text == null && (text = "");
      this.text = text;
      this.lastText = "";
      this.textColor = [0, 0, 0];
      this.textAlign = 'left';
      this.padding = 0;
      Text.superclass.call(this, scene, width, height, x, y);
    }
    prototype.setText = function(text){
      return this.text = text;
    };
    prototype.setTextColor = function(r, g, b){
      return this.textColor = [r, g, b];
    };
    prototype.getTextColor = function(){
      return this.textColor;
    };
    prototype.setTextAlign = function(alignment){
      return this.textAlign = alignment;
    };
    prototype.getTextAlign = function(){
      return this.textAlign;
    };
    prototype.setPadding = function(padding){
      return this.padding = padding;
    };
    prototype.getPadding = function(){
      return this.padding;
    };
    prototype.createElement = function(){
      var matrix3d;
      matrix3d = this.getTransformationMatrix();
      this.div = jQuery("<div id=\"" + this.id + "\" style=\"" + this.getStyles().join(';') + "\">" + this.text + "</div>");
      return this.div.appendTo(this.scene.div);
    };
    prototype.getStyles = function(){
      var styles;
      styles = superclass.prototype.getStyles.call(this);
      styles.push("text-align: " + this.textAlign);
      styles.push("color: rgb(" + this.textColor.join(',') + ")");
      styles.push("padding: " + this.padding + "px");
      return styles;
    };
    /**
     * Events
     */
    prototype.onRender = function(delta){
      var styles;
      styles = superclass.prototype.onRender.call(this, delta);
      if (this.text !== this.lastText) {
        jQuery(this.div).text(this.text);
        this.lastText = this.text;
      }
      return styles;
    };
    return Text;
  }(Darkcore.Sprite));
  out$.Text = Darkcore.Sprite.Text = Text;
  function extend$(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);

(function(){
  var Sound, out$ = typeof exports != 'undefined' && exports || this;
  Sound = (function(){
    Sound.displayName = 'Sound';
    var prototype = Sound.prototype, constructor = Sound;
    function Sound(filename){
      filename == null && (filename = "");
      this.filename = filename;
      this.loaded = false;
      this.audio = null;
      this.source = null;
      this.response = null;
      this.buffer = null;
    }
    prototype._createSource = function(inBuffer, callback, decode){
      var x$, parent;
      callback == null && (callback = false);
      decode == null && (decode = false);
      x$ = this.source = this.audio.createBufferSource();
      x$.connect(this.audio.destination);
      if (decode) {
        parent = this;
        return this.audio.decodeAudioData(inBuffer, function(outBuffer){
          parent.buffer = outBuffer;
          parent.source.buffer = parent.buffer;
          parent.loaded = true;
          if (callback !== false) {
            return callback(parent);
          }
        });
      }
    };
    prototype.load = function(callback){
      var soundfile, parent, x$, request;
      callback == null && (callback = false);
      if (this.buffer !== null) {
        return this._createSource(this.response, callback, true);
      } else if (this.filename.length > 0) {
        if (Modernizr.audio.ogg) {
          soundfile = this.filename.replace(/\.(mp3|ogg|m4a)/, '.ogg');
        } else if (Modernizr.audio.mp3) {
          soundfile = this.filename.replace(/\.(mp3|ogg|m4a)/, '.mp3');
        }
        this.audio = new webkitAudioContext();
        parent = this;
        x$ = request = new XMLHttpRequest();
        x$.open("GET", soundfile, true);
        x$.responseType = 'arraybuffer';
        x$.onload = function(){
          parent.response = request.response;
          return parent._createSource(request.response, callback, true);
        };
        x$.send();
        return x$;
      }
    };
    prototype.play = function(replay){
      replay == null && (replay = false);
      if (this.loaded === false) {
        this.load(function(sound){
          return sound.play();
        });
      }
      if (this.source !== null) {
        this.source.loop = replay ? true : false;
        return this.source.start(0);
      }
    };
    prototype.stop = function(){
      this.loaded = false;
      return this.source.stop(0.0);
    };
    return Sound;
  }());
  out$.Sound = Darkcore.Sound = Sound;
}).call(this);

(function(){
  var Texture, out$ = typeof exports != 'undefined' && exports || this;
  Texture = (function(){
    Texture.displayName = 'Texture';
    var prototype = Texture.prototype, constructor = Texture;
    Texture.fromFile = function(scene, filename){
      var has_texture, texture;
      has_texture = scene.textures.indexOf(filename);
      if (has_texture > -1) {
        return scene.textures[has_texture];
      } else {
        texture = new Darkcore.Texture(filename, scene);
        return texture;
      }
    };
    function Texture(filename, scene){
      var that;
      this.scene = scene;
      this.surface = 0;
      this.texture = 0;
      this.texture_format = 0;
      this.nOfColors = 0;
      this.loaded = false;
      this.width = 0;
      this.height = 0;
      this.textureId = this.scene.textures.push(this) - 1;
      that = this;
      this.surface = new Image;
      this.surface.onload = function(evt){
        return that.loaded = true;
      };
      this.surface.src = filename;
    }
    return Texture;
  }());
  out$.Texture = Darkcore.Texture = Texture;
}).call(this);

(function(){
  var Vector;
  Darkcore.Vector = Vector = (function(){
    Vector.displayName = 'Vector';
    var prototype = Vector.prototype, constructor = Vector;
    function Vector(length){
      this.data = [];
    }
    Vector.from_array = function(arr){
      var new_vector, i$, to$, i;
      new_vector = new Darkcore.Vector(arr.length);
      for (i$ = 0, to$ = arr.length; i$ <= to$; ++i$) {
        i = i$;
        new_vector.set(i, arr[i]);
      }
      return new_vector;
    };
    Vector.copy = function(vector){
      var new_vector, i$, to$, i;
      new_vector = new Darkcore.Vector(vector.length);
      for (i$ = 0, to$ = vector.length; i$ <= to$; ++i$) {
        i = i$;
        new_vector.set(i, vector.get(i));
      }
      return new_vector;
    };
    prototype.scale = function(val){
      var len, i$, i, results$ = [];
      len = this.data.length - 1;
      for (i$ = 0; i$ <= len; ++i$) {
        i = i$;
        results$.push(this.data[i] *= val);
      }
      return results$;
    };
    prototype.add = function(val){
      var len, i$, i, results$ = [];
      len = this.data.length - 1;
      for (i$ = 0; i$ <= len; ++i$) {
        i = i$;
        results$.push(this.data[i] += val);
      }
      return results$;
    };
    prototype.sub = function(val){
      var len, i$, i, results$ = [];
      this.add;
      len = this.data.length - 1;
      for (i$ = 0; i$ <= len; ++i$) {
        i = i$;
        results$.push(this.data[i] += val);
      }
      return results$;
    };
    prototype.mulScalar = function(val){
      return this.scale(val);
    };
    prototype.divScalar = function(val){
      return this.scale(1 / val);
    };
    prototype.addScalar = function(val){
      return this.add(val);
    };
    prototype.subScalar = function(val){
      return this.add(-val);
    };
    prototype.get = function(index){
      return this.data[index];
    };
    prototype.set = function(index, val){
      return this.data[index] = val;
    };
    prototype.distance = function(vector){
      var a_x, a_y, b_x, b_y;
      a_x = this.get(0);
      a_y = this.get(1);
      b_x = vector.get(0);
      b_y = vector.get(1);
      return Darkcore.Vector.from_array([Math.abs(a_x - b_x), Math.abs(a_y - b_y)]);
    };
    prototype.dot = function(vector){
      var len, result, i$, i;
      len = this.data.length - 1;
      result = 0.00;
      for (i$ = 0; i$ <= len; ++i$) {
        i = i$;
        result += this.get(i) * vector.get(i);
      }
      return result;
    };
    prototype.normalize = function(){
      var vx, vy, len_v, v;
      vx = this.get(0);
      vy = this.get(1);
      len_v = Math.sqrt(vx * vx + vy * vy);
      vx /= len_v;
      vy /= len_v;
      v = Darkcore.Vector.from_array([vx, vy]);
      return v;
    };
    prototype.length = function(){
      var len, result, i$, i;
      len = this.data.length - 1;
      result = 0.00;
      for (i$ = 0; i$ <= len; ++i$) {
        i = i$;
        result += this.get(i) * this.get(i);
      }
      return result;
    };
    prototype.toString = function(){
      var len, result, i$, i;
      len = this.data.length - 1;
      result = "(";
      for (i$ = 0; i$ <= len; ++i$) {
        i = i$;
        if (i !== 0) {
          result += ", ";
        }
        result += "" + this.get(i);
      }
      result += ")";
      return result;
    };
    return Vector;
  }());
  this.Darkcore.Vector = Darkcore.Vector;
}).call(this);
