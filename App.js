(function(){
  jQuery(function(){
    var width, height, engine, scene, x$, panda, y$, logo, z$, fps, z1$, block1, z2$, block2, z3$, block3, z4$, block4, z5$, block6;
    width = jQuery(window).width();
    height = jQuery(window).height();
    engine = new Darkcore.Engine(width, height, 'Hi Panda!');
    scene = new Darkcore.Scene('game', engine);
    scene.gamestate = {
      blocks: []
    };
    x$ = panda = new Game.Panda(scene);
    x$.x = 100;
    x$.y = 200;
    x$.velocity_x = 0.5;
    y$ = logo = new Game.Logo(scene);
    y$.setTitle("Hi! Panda");
    y$.x = 300;
    y$.y = 300;
    y$.scale_x = 2.0;
    y$.scale_y = 2.0;
    z$ = fps = new Game.FPS(scene);
    z$.x = 400;
    z$.y = 100;
    z1$ = block1 = new Darkcore.Sprite(scene, 100, 100, 300, 100);
    z1$.id = "block1";
    z1$.setColor(255, 0, 0);
    scene.gamestate.blocks.push(block1);
    z2$ = block2 = new Darkcore.Sprite(scene, 100, 15, 100, 50);
    z2$.id = "block2";
    z2$.setColor(0, 255, 0);
    scene.gamestate.blocks.push(block2);
    z3$ = block3 = new Darkcore.Sprite(scene, engine.width, 20, engine.width / 2, 0);
    z3$.id = "block3";
    z3$.setColor(50, 50, 50);
    scene.gamestate.blocks.push(block3);
    z4$ = block4 = new Darkcore.Sprite(scene, 75, 20, 320, 10);
    z4$.id = "block4";
    z4$.setColor(50, 50, 50);
    scene.gamestate.blocks.push(block4);
    z5$ = block6 = new Darkcore.Sprite(scene, 75, 20, 200, 85);
    z5$.id = "block6";
    z5$.setColor(50, 50, 50);
    scene.gamestate.blocks.push(block6);
    engine.run();
    return setInterval(function(){
      var x$, b;
      x$ = b = new Game.Block(scene, 32, 32, 100, 150);
      x$.velocity_x = 1.0 + Math.random() * 5;
      x$.velocity_y = Math.random() * 7;
      return x$;
    }, 50);
  });
}).call(this);
