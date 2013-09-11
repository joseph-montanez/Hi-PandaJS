(function(){
  var out$ = typeof exports != 'undefined' && exports || this;
  jQuery(function(){
    var width, height, engine, menu, x$, title, y$, startgame, z$, toggleMusic, scene, z1$, panda, z2$, logo, z3$, block1, z4$, block2, z5$, block3, z6$, block4, z7$, block6, z8$, fps;
    width = jQuery(window).width();
    height = jQuery(window).height();
    engine = new Darkcore.Engine(640, 480, 'Hi Panda!');
    menu = new Darkcore.Scene('menu', engine);
    x$ = title = new Darkcore.Sprite.Text(menu, "Hi! Panda", 150, 25, engine.width / 2, engine.height / 2 + 50);
    x$.id = "title";
    x$.setTextColor(0, 0, 0);
    x$.setTextSize(24);
    x$.setTextWeight(900);
    x$.setTextAlign('center');
    y$ = startgame = new Darkcore.Sprite.Text(menu, "Start Game", 100, 25, engine.width / 2, engine.height / 2 + 15);
    y$.id = "start";
    y$.setColor(255, 0, 0);
    y$.setTextColor(255, 255, 255);
    y$.setTextAlign('center');
    y$.onLeftClick = function(evt){
      return engine.queueScene(scene);
    };
    z$ = toggleMusic = new Darkcore.Sprite.Text(menu, "Stop Music", 100, 25, engine.width / 2, engine.height / 2 - 15);
    z$.id = "toggleMusic";
    z$.onLeftClick = function(evt){
      if (this.text === "Stop Music") {
        this.setText("Start Music");
        return music.stop();
      } else {
        this.setText("Stop Music");
        return music.play();
      }
    };
    z$.setColor(100, 255, 100);
    z$.setTextColor(255, 255, 255);
    z$.setTextAlign('center');
    scene = new Darkcore.Scene('game', engine);
    scene.gamestate = {
      blocks: []
    };
    z1$ = panda = new Game.Panda(scene);
    z1$.x = 100;
    z1$.y = 200;
    z1$.velocity_x = 0.5;
    z2$ = logo = new Game.Logo(scene);
    z2$.setText("Hi! Panda");
    z2$.x = 300;
    z2$.y = 300;
    z2$.scale_x = 2.0;
    z2$.scale_y = 2.0;
    z3$ = block1 = new Game.Grass(scene, 256, 192, 500, 0);
    z3$.id = "block1";
    scene.gamestate.blocks.push(block1);
    z4$ = block2 = new Darkcore.Sprite(scene, 100, 15, 100, 50);
    z4$.id = "block2";
    z4$.setColor(0, 255, 0);
    scene.gamestate.blocks.push(block2);
    z5$ = block3 = new Darkcore.Sprite(scene, engine.width, 20, engine.width / 2, 0);
    z5$.id = "block3";
    z5$.setColor(50, 50, 50);
    scene.gamestate.blocks.push(block3);
    z6$ = block4 = new Darkcore.Sprite(scene, 75, 20, 320, 10);
    z6$.id = "block4";
    z6$.setColor(50, 50, 50);
    scene.gamestate.blocks.push(block4);
    z7$ = block6 = new Darkcore.Sprite(scene, 75, 20, 200, 85);
    z7$.id = "block6";
    z7$.setColor(50, 50, 50);
    scene.gamestate.blocks.push(block6);
    z8$ = fps = new Game.FPS(scene);
    z8$.x = 400;
    z8$.y = 100;
    engine.run();
    return out$.engine = engine = engine;
  });
}).call(this);
