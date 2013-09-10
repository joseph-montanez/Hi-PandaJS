(function(){
  var Game;
  Game = Game || {};
  this.Game = Game;
}).call(this);

(function(){
  var Panda;
  Panda = (function(superclass){
    var prototype = extend$((import$(Panda, superclass).displayName = 'Panda', Panda), superclass).prototype, constructor = Panda;
    prototype.velocity_x = 0.00;
    prototype.velocity_y = 0.00;
    prototype.jumping = true;
    prototype.has_gun = false;
    prototype.jumping_from = null;
    function Panda(scene){
      var texture;
      Panda.superclass.call(this, scene);
      texture = Darkcore.Texture.fromFile(scene, "resources/Panda_ClausKruuskopf.png");
      this.textureIndex = texture.textureId;
      this.backgroundPosition = [-1, 0];
      this.width = 17;
      this.height = 22;
    }
    prototype.onBeforeRender = function(delta){
      var max_vx, min_vx, gravity, half_width, half_height, state, hit, on_ground, i$, ref$, len$, block, bounding_box1, bounding_box2, bounding_box3, block_half_width, block_half_height, distance_x, distance_y, distance, top_distance, left_distance, right_distance, bottom_distance;
      max_vx = 150.00 * delta;
      min_vx = -150.00 * delta;
      gravity = 7.0 * delta;
      half_width = this.width / 2;
      half_height = this.height / 2;
      if (this.jumping && this.jumping_from !== null && this.y - this.jumping_from.get(1) >= 20) {
        this.jumping_from = null;
      }
      if (this.scene.engine.keys.w && this.jumping_from !== null && this.y - this.jumping_from.get(1) < 20) {
        this.velocity_y += 30 * delta;
        this.jumping = true;
      }
      if (this.scene.engine.keys.s) {
        this.velocity_y -= 20 * delta;
      }
      if (this.scene.engine.keys.d && this.velocity_x < max_vx) {
        this.velocity_x += 30 * delta;
      }
      if (this.scene.engine.keys.a && this.velocity_x > min_vx) {
        this.velocity_x -= 30 * delta;
      }
      if (this.jumping) {
        this.velocity_y -= gravity;
      }
      if (!this.jumping && this.scene.engine.keys.s && this.velocity_y < 0) {
        this.backgroundPosition = [-17 * 3, -22 * 2];
      } else if (this.scene.engine.keys.d && this.velocity_x >= 0) {
        this.scale_x = 1.0;
        this.backgroundPosition = [-17 * 1, -22 * 4];
      } else if (this.scene.engine.keys.a && this.velocity_x < 0) {
        this.scale_x = -1.0;
        this.backgroundPosition = [-17 * 1, -22 * 4];
      } else if (!this.jumping && !this.scene.engine.keys.s && this.velocity_x === 0) {
        this.backgroundPosition = [-1, 0];
      }
      if (this.velocity_x < 0.50 && this.velocity_x > -0.50) {
        this.velocity_x = 0.00;
      } else if (this.velocity_x > 0.00 && !this.jumping) {
        this.velocity_x -= 24.00 * delta;
      } else if (this.velocity_x < 0.00 && !this.jumping) {
        this.velocity_x += 24.00 * delta;
      } else if (this.velocity_x < 0.00 && this.jumping) {
        this.velocity_x -= 0.35 * delta;
      }
      if (this.velocity_x > 0.00 && this.jumping) {
        this.velocity_x += 0.35 * delta;
      }
      if (this.x + this.velocity_x + half_width >= this.scene.engine.width) {
        this.velocity_x = 0;
      } else if (this.x + this.velocity_x - half_width <= 0) {
        this.velocity_x = 0;
      }
      if (this.velocity_x > max_vx) {
        this.velocity_x = max_vx;
      } else if (this.velocity_x < min_vx) {
        this.velocity_x = min_vx;
      }
      state = this.scene.gamestate;
      hit = false;
      on_ground = false;
      for (i$ = 0, len$ = (ref$ = state.blocks).length; i$ < len$; ++i$) {
        block = ref$[i$];
        bounding_box1 = block.getBoundingBox();
        bounding_box2 = this.getBoundingBox(this.velocity_x, this.velocity_y);
        bounding_box3 = this.getBoundingBox();
        block_half_width = block.width / 2;
        block_half_height = block.height / 2;
        hit = bounding_box1.get(0) < bounding_box2.get(2) && bounding_box1.get(2) > bounding_box2.get(0) && bounding_box1.get(1) < bounding_box2.get(3) && bounding_box1.get(3) > bounding_box2.get(1);
        if (hit) {
          distance_x = this.x - block.x;
          distance_y = this.y - block.y;
          distance = Math.sqrt(Math.abs(distance_x)) + Math.sqrt(Math.abs(distance_y));
          if (distance_y > 0 && distance_x < 0) {
            top_distance = Math.abs(bounding_box1.get(3) - bounding_box2.get(1));
            left_distance = Math.abs(bounding_box1.get(0) - bounding_box2.get(2));
            if (top_distance < left_distance) {
              this.velocity_y = 0;
              this.y = bounding_box1.get(3) + half_height;
              this.jumping_from = new Darkcore.Vector(2);
              this.jumping_from.set(0, this.x);
              this.jumping_from.set(1, this.y);
              on_ground = true;
            } else {
              this.velocity_x = 0;
              this.x = bounding_box1.get(0) - half_width;
            }
          } else if (distance_y > 0 && distance_x > 0) {
            top_distance = Math.abs(bounding_box1.get(3) - bounding_box2.get(1));
            right_distance = Math.abs(bounding_box1.get(2) - bounding_box2.get(0));
            if (top_distance < right_distance) {
              this.velocity_y = 0;
              this.y = bounding_box1.get(3) + half_height;
              this.jumping_from = new Darkcore.Vector(2);
              this.jumping_from.set(0, this.x);
              this.jumping_from.set(1, this.y);
              on_ground = true;
            } else {
              this.velocity_x = 0;
              this.x = bounding_box1.get(2) + half_width;
            }
          } else if (distance_y < 0 && distance_x < 0) {
            bottom_distance = Math.abs(bounding_box1.get(1) - bounding_box2.get(3));
            left_distance = Math.abs(bounding_box1.get(0) - bounding_box2.get(2));
            if (bottom_distance < left_distance) {
              this.velocity_y = 0;
              this.y = bounding_box1.get(1) - half_height;
            } else {
              this.velocity_x = 0;
              this.x = bounding_box1.get(0) - half_width;
            }
          } else if (distance_y < 0 && distance_x > 0) {
            bottom_distance = Math.abs(bounding_box1.get(1) - bounding_box2.get(3));
            right_distance = Math.abs(bounding_box1.get(2) - bounding_box2.get(0));
            if (bottom_distance < right_distance) {
              this.velocity_y = 0;
              this.y = bounding_box1.get(1) - half_height;
            } else {
              this.velocity_x = 0;
              this.x = bounding_box1.get(2) + half_width;
            }
          }
        }
      }
      if (this.y + this.velocity_y + half_height >= this.scene.engine.height) {
        this.velocity_y = 0;
      } else if (this.y + this.velocity_y - half_height <= 0) {
        on_ground = true;
        this.velocity_y = 0;
        this.y = half_height;
        this.jumping_from = new Darkcore.Vector(2);
        this.jumping_from.set(0, this.x);
        this.jumping_from.set(1, this.y);
        on_ground = true;
      }
      if (on_ground) {
        this.jumping = false;
      } else {
        this.jumping = true;
      }
      this.y += this.velocity_y;
      this.x += this.velocity_x;
      this.scene.camera_x = this.scene.engine.width - this.x - this.scene.engine.width / 2;
      return this.scene.camera_y = this.y - this.scene.engine.height / 2;
    };
    return Panda;
  }(Darkcore.Sprite));
  this.Game.Panda = Panda;
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
  var Block;
  Block = (function(superclass){
    var prototype = extend$((import$(Block, superclass).displayName = 'Block', Block), superclass).prototype, constructor = Block;
    function Block(scene, width, height, x, y){
      var texture;
      this.velocity_x = 0.00;
      this.velocity_y = 0.00;
      Block.superclass.call(this, scene, width, height, x, y);
      texture = Darkcore.Texture.fromFile(scene, "resources/Weapons_ThyLordRoot.png");
      this.textureIndex = texture.textureId;
      this.backgroundPosition = [64, 96];
    }
    prototype.onBeforeRender = function(delta){
      var gravity, state, remove, i$, ref$, len$, block, bounding_box1, bounding_box2, bounding_box3, hit;
      gravity = 7.0 * delta;
      this.velocity_y -= gravity;
      state = this.scene.gamestate;
      remove = false;
      for (i$ = 0, len$ = (ref$ = state.blocks).length; i$ < len$; ++i$) {
        block = ref$[i$];
        bounding_box1 = block.getBoundingBox();
        bounding_box2 = this.getBoundingBox(this.velocity_x, this.velocity_y);
        bounding_box3 = this.getBoundingBox();
        hit = bounding_box1.get(0) < bounding_box2.get(2) && bounding_box1.get(2) > bounding_box2.get(0) && bounding_box1.get(1) < bounding_box2.get(3) && bounding_box1.get(3) > bounding_box2.get(1);
        if (hit) {
          remove = true;
        }
      }
      this.y += this.velocity_y;
      this.x += this.velocity_x;
      if (this.x > this.scene.engine.width || this.x < 0) {
        remove = true;
      } else if (this.y > this.scene.engine.height || this.y < 0) {
        remove = true;
      }
      if (remove) {
        return this.scene.removeSprite(this);
      }
    };
    return Block;
  }(Darkcore.Sprite));
  this.Game.Block = Block;
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
  var Logo;
  Logo = (function(superclass){
    var prototype = extend$((import$(Logo, superclass).displayName = 'Logo', Logo), superclass).prototype, constructor = Logo;
    function Logo(scene, width, height, x, y){
      Logo.superclass.call(this, scene, width, height, x, y);
      jQuery(this.div).css("font-family", "'Caesar Dressing', cursive");
    }
    return Logo;
  }(Darkcore.Sprite.Text));
  this.Game.Logo = Logo;
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
  var FPS;
  FPS = (function(superclass){
    var prototype = extend$((import$(FPS, superclass).displayName = 'FPS', FPS), superclass).prototype, constructor = FPS;
    function FPS(scene){
      FPS.superclass.call(this, scene);
      jQuery(this.div).css("font-family", "'Caesar Dressing', cursive");
    }
    prototype.onRender = function(delta){
      superclass.prototype.onRender.call(this, delta);
      this.setTitle("FPS: " + this.scene.engine.frames_per_second);
      return [];
    };
    prototype.setTitle = function(title){
      return jQuery(this.div).text(title);
    };
    return FPS;
  }(Darkcore.Sprite.Text));
  this.Game.FPS = FPS;
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
  var Grass;
  Grass = (function(superclass){
    var prototype = extend$((import$(Grass, superclass).displayName = 'Grass', Grass), superclass).prototype, constructor = Grass;
    function Grass(scene, width, height, x, y){
      this.velocity_x = 0.00;
      this.velocity_y = 0.00;
      this.texture = Darkcore.Texture.fromFile(scene, "resources/grass.png");
      Grass.superclass.call(this, scene, width, height, x, y);
      this.init = false;
    }
    prototype.onRender = function(delta){
      var styles;
      styles = superclass.prototype.onRender.call(this, delta);
      if (!this.init) {
        this.div.html("<div style=\"\n	background-image: url(resources/grass.png);\n	margin-top: -53px;\n	width: 256px;\n	height: 256px;\n	background-position: 0px -28px;\n	background-size: 125%;\n\">\n</div>");
      }
      return styles;
    };
    return Grass;
  }(Darkcore.Sprite));
  this.Game.Grass = Grass;
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
