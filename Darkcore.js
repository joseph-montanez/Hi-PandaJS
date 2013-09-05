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
    prototype.width = 0;
    prototype.height = 0;
    prototype.frames_per_second = 60;
    prototype.keys = null;
    prototype.mouse_x = 0;
    prototype.mouse_y = 0;
    prototype.title = "";
    prototype.gamestate = null;
    prototype.scenes = [];
    prototype.active_scene = false;
    prototype.done = false;
    prototype.interval = false;
    prototype.div = null;
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
      this.width = width;
      this.height = height;
      this.title = title;
      this.keys = new Darkcore.KeyState;
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
      if (this.scenes.length === 0) {
        this.active_scene = 0;
      }
      return this.scenes.push(scene);
    };
    prototype.processEvents = function(){};
    prototype.render = function(){
      var old_time, last_time, fps, minticks, parent, x$, stats, render_loop;
      old_time = Darkcore.Engine.getTime();
      last_time = old_time;
      fps = 0;
      minticks = 1000 / 60;
      parent = this;
      x$ = stats = new Stats();
      x$.setMode(0);
      x$.domElement.style.position = 'absolute';
      x$.domElement.style.right = '0px';
      x$.domElement.style.top = '0px';
      document.body.appendChild(stats.domElement);
      render_loop = function(time){
        var new_time, fpsdelta, delta;
        stats.begin();
        if (parent.done) {
          cancelAnimationFrame(parent.interval);
          jQuery(jQuery.find("#Darkcore_frame")).text("Done");
          return;
        }
        new_time = Darkcore.Engine.getTime();
        fpsdelta = new_time - old_time;
        delta = (new_time - last_time) / 1000;
        parent.processEvents();
        parent.scenes[parent.active_scene].render(delta);
        fps++;
        last_time = new_time;
        if (fpsdelta > 1000) {
          old_time = new_time;
          parent.frames_per_second = fps;
          fps = 0;
        }
        stats.end();
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
  var Scene;
  Darkcore.Scene = Scene = (function(){
    Scene.displayName = 'Scene';
    var prototype = Scene.prototype, constructor = Scene;
    prototype.camera_x = 0;
    prototype.camera_y = 0;
    prototype.last_camera = "";
    prototype.background_color = [255, 255, 255, 1.0];
    prototype.timed_events = [];
    prototype.render_events = [];
    prototype.remove_queue = [];
    prototype.textures = [];
    prototype.sprites = [];
    prototype.sounds = [];
    prototype.engine = null;
    prototype.gamestate = null;
    prototype.div = null;
    prototype.id = "";
    function Scene(name, engine){
      this.id = "dc-scene-" + engine.addScene(this);
      this.name = name;
      this.engine = engine;
      this.div = jQuery("<div id=\"" + this.id + "\" style=\"\n	width: " + this.engine.width + "px;\n	height:" + this.engine.height + "px;\n	position: relative;\n	animation-duration: 16ms;\n	animation-timing-function: linear;\n\"></div>");
      this.div.appendTo(this.engine.div);
    }
    prototype.draw = function(delta){
      var i$, ref$, len$, sprite, item_index, new_camera, last_camera;
      for (i$ = 0, len$ = (ref$ = this.sprites).length; i$ < len$; ++i$) {
        sprite = ref$[i$];
        sprite.onRender(delta);
        sprite.render(delta);
      }
      if (this.remove_queue.length > 0) {
        for (i$ = 0, len$ = (ref$ = this.remove_queue).length; i$ < len$; ++i$) {
          sprite = ref$[i$];
          item_index = this.sprites.indexOf(sprite);
          if (item_index > -1) {
            sprite.destory();
            this.sprites.splice(item_index, 1);
          }
        }
        this.remove_queue = [];
      }
      new_camera = "translate3d(" + this.camera_x + "px, " + this.camera_y + "px, 0)";
      if (new_camera !== last_camera) {
        jQuery(this.div).css("transform", new_camera);
        return last_camera = new_camera;
      }
    };
    prototype.render = function(delta){
      var i$, ref$, len$, sprite, mgr, i;
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
    prototype.addSprite = function(sprite){
      sprite.scene = this;
      return this.sprites.push(sprite);
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
  this.Darkcore.Scene = Darkcore.Scene;
}).call(this);

(function(){
  var Vector;
  Darkcore.Vector = Vector = (function(){
    Vector.displayName = 'Vector';
    var prototype = Vector.prototype, constructor = Vector;
    prototype.data = null;
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

(function(){
  var Sprite;
  Darkcore.Sprite = Sprite = (function(){
    Sprite.displayName = 'Sprite';
    var prototype = Sprite.prototype, constructor = Sprite;
    prototype.id = "";
    prototype.x = 0.00;
    prototype.y = 0.00;
    prototype.rotation = 0.00;
    prototype.width = 32.00;
    prototype.height = 32.00;
    prototype.tile_width = 0.00;
    prototype.tile_height = 0.00;
    prototype.coords_top_left_x = 0.00;
    prototype.coords_top_left_y = 0.00;
    prototype.coords_bottom_left_x = 1.00;
    prototype.coords_bottom_left_y = 0.00;
    prototype.coords_bottom_right_x = 1.00;
    prototype.coords_bottom_right_y = 1.00;
    prototype.coords_top_right_x = 0.00;
    prototype.coords_top_right_y = 1.00;
    prototype.color_r = 255;
    prototype.color_g = 255;
    prototype.color_b = 255;
    prototype.scale_x = 1.00;
    prototype.scale_y = 1.00;
    prototype.animation = false;
    prototype.animation_from = 0;
    prototype.animation_to = 0;
    prototype.animation_current = 0;
    prototype.animation_duration = 60;
    prototype.animation_last_tick = 0;
    prototype.texture_index = -1;
    prototype.animation_event = null;
    prototype.div = null;
    prototype.scene = null;
    prototype.last_matrix = "";
    prototype.last_size = [0, 0];
    function Sprite(scene, width, height, x, y){
      var matrix3d;
      width == null && (width = 0);
      height == null && (height = 0);
      x == null && (x = 0);
      y == null && (y = 0);
      scene.addSprite(this);
      this.scene = scene;
      this.width = width;
      this.height = height;
      this.x = x;
      this.y = y;
      this.id = "ds_" + Math.floor(Math.random() * 10000);
      matrix3d = this.getTransformationMatrix();
      this.div = jQuery("<div id=\"" + this.id + "\" style=\"\n	matrix3d(" + matrix3d.join(',') + ");\n	width: " + this.width + "px;\n	height: " + this.height + "px;\n	position: absolute;\n	left: 0;\n	top: 0;\n	animation-duration: 16ms;\n	animation-timing-function: linear;\n	\"></div>");
      this.div.appendTo(this.scene.div);
    }
    prototype.destory = function(){
      return this.div.remove();
    };
    prototype.getId = function(){
      return this.id;
    };
    prototype.setColor = function(r, g, b){
      this.color_r = r;
      this.color_g = g;
      this.color_b = b;
      return jQuery(this.div).css("background-color", "rgb(" + this.color_r + ", " + this.color_g + ", " + this.color_b + ")");
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
      return [matrix[0], matrix[1], 0, 0, matrix[2], matrix[3], 0, 0, 0, 0, 1, 0, matrix[4], matrix[5], 0, 1];
    };
    prototype.onBeforeRender = function(){};
    prototype.onRender = function(delta){};
    prototype.render = function(delta){
      var matrix3d, matrix_css;
      if (this.last_size[0] !== this.width || this.last_size[1] !== this.height) {
        jQuery(this.div).css({
          width: this.width,
          height: this.height
        });
        this.last_size = [this.width, this.height];
      }
      matrix3d = this.getTransformationMatrix();
      matrix_css = "matrix3d(" + matrix3d.join(',') + ")";
      if (matrix_css !== this.last_matrix) {
        this.div[0].style.WebkitTransform = matrix_css;
        this.div[0].style.MozTransform = matrix_css;
      }
      return this.last_matrix = matrix_css;
    };
    return Sprite;
  }());
  this.Darkcore.Sprite = Darkcore.Sprite;
}).call(this);
