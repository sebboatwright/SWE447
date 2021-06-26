var canvas;
var gl;
var V;
var P;
var near = 10;
var far = 120;


var time = 0.0;
var timeDelta = 0.5;

var ms = new MatrixStack();

function init() {
  canvas = document.getElementById("webgl-canvas");

  // Configure our WebGL environment
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) { alert("WebGL initialization failed"); }

  gl.clearColor(222/255, 222/255, 222/255, 1.0);
  gl.enable(gl.DEPTH_TEST);

  for (var name in Spheres ) {
    var sphere = Spheres[name].model = new Sphere();

    sphere.uniforms = { 
      color : gl.getUniformLocation(sphere.program, "color"),
      MV : gl.getUniformLocation(sphere.program, "MV"),
      P : gl.getUniformLocation(sphere.program, "P")
    };
  }

  for (var name in Cylinders) {
    var cylinder = Cylinders[name].model = new Cylinder();

    cylinder.uniforms = {
      color : gl.getUniformLocation(cylinder.program, "color"),
      MV : gl.getUniformLocation(cylinder.program, "MV"),
      P : gl.getUniformLocation(cylinder.program, "P")
    };
  }

  for (var name in BGs) {
    var backdrop = BGs[name].model = new BG(BGs[name].source);

    backdrop.uniforms = {
      texture : gl.getUniformLocation(backdrop.program, "uTexture"),
      MV : gl.getUniformLocation(backdrop.program, "MV"),
      P : gl.getUniformLocation(backdrop.program, "P")
    };
  }

  resize();

  window.requestAnimationFrame(render);  
}


function render() {
  time += timeDelta;

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  V = translate(0.0, 0.0, -0.5*(near + far));
  ms.load(V);  

  //drawBG();
  
  drawSpheres(Spheres["Tire"], ms);
  drawSpheres(Spheres["Wheel"], ms);
  drawSpheres(Spheres["Center"], ms);

  drawCylinders(Cylinders["Spoke1"], ms);
  drawCylinders(Cylinders["Spoke2"], ms);

  window.requestAnimationFrame(render);
}

function drawSpheres(data, ms, pointMode) {
  var name, data, sphere;

  // Outer ring of wheel
  name = "Tire";
  sphere = Spheres[name];

  sphere.model.PointMode = false;

  ms.push();
  ms.rotate(time * 2, [0, 0, 1]);
  ms.translate(0, 0, (sphere.distance));
  ms.scale(sphere.radius);
  gl.useProgram(sphere.model.program);
  gl.uniformMatrix4fv(sphere.model.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(sphere.model.uniforms.P, false, flatten(P));
  gl.uniform4fv(sphere.model.uniforms.color, flatten(sphere.color));
  sphere.model.render();
  ms.pop();

  // "Background" circle of wheel
  name = "Wheel";
  sphere = Spheres[name];

  sphere.model.PointMode = false;

  ms.push();
  ms.rotate(time * 2, [0, 0, 1]);
  ms.translate(0, 0, (sphere.distance));
  ms.scale(sphere.radius);
  gl.useProgram(sphere.model.program);
  gl.uniformMatrix4fv(sphere.model.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(sphere.model.uniforms.P, false, flatten(P));
  gl.uniform4fv(sphere.model.uniforms.color, flatten(sphere.color));
  sphere.model.render();
  ms.pop();

  // Inner circle of wheel
  name = "Center";
  sphere = Spheres[name];

  sphere.model.PointMode = false;

  ms.push();
  ms.rotate(time * 2, [0, 0, 1]);
  ms.translate(0, 0, (sphere.distance));
  ms.scale(sphere.radius);
  gl.useProgram(sphere.model.program);
  gl.uniformMatrix4fv(sphere.model.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(sphere.model.uniforms.P, false, flatten(P));
  gl.uniform4fv(sphere.model.uniforms.color, flatten(sphere.color));
  sphere.model.render();
  ms.pop();
}

function drawCylinders(data, ms, pointMode) {
  var name, data, cylinder;

  // Wheel spokes
  name = "Spoke1";
  cylinder = Cylinders[name];

  cylinder.model.PointMode = false;

  ms.push();
  ms.rotate(90, [0, -1, 0]);
  ms.rotate(time * 2, [1, 0, 0]);
  ms.translate(20, 0, (cylinder.distance));
  ms.scale(cylinder.radius);
  ms.scale(1, 1, 7);
  gl.useProgram(cylinder.model.program);
  gl.uniformMatrix4fv(cylinder.model.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(cylinder.model.uniforms.P, false, flatten(P));
  gl.uniform4fv(cylinder.model.uniforms.color, flatten(cylinder.color));
  cylinder.model.render();
  ms.pop();


  name = "Spoke2";
  cylinder = Cylinders[name];

  cylinder.model.PointMode = false;

  ms.push();
  ms.rotate(90, [0, -1, 0]);
  ms.rotate(45, [1, 0, 0]);
  ms.rotate(time * 2, [1, 0, 0]);
  ms.translate(25, 0, (cylinder.distance));
  ms.scale(cylinder.radius);
  ms.scale(1, 1, 7);
  gl.useProgram(cylinder.model.program);
  gl.uniformMatrix4fv(cylinder.model.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(cylinder.model.uniforms.P, false, flatten(P));
  gl.uniform4fv(cylinder.model.uniforms.color, flatten(cylinder.color));
  cylinder.model.render();
  ms.pop();


  name = "Spoke3";
  cylinder = Cylinders[name];

  cylinder.model.PointMode = false;

  ms.push();
  ms.rotate(90, [0, -1, 0]);
  ms.rotate(90, [1, 0, 0]);
  ms.rotate(time * 2, [1, 0, 0]);
  ms.translate(25, 0, (cylinder.distance));
  ms.scale(cylinder.radius);
  ms.scale(1, 1, 7);
  gl.useProgram(cylinder.model.program);
  gl.uniformMatrix4fv(cylinder.model.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(cylinder.model.uniforms.P, false, flatten(P));
  gl.uniform4fv(cylinder.model.uniforms.color, flatten(cylinder.color));
  cylinder.model.render();
  ms.pop();


  name = "Spoke4";
  cylinder = Cylinders[name];

  cylinder.model.PointMode = false;

  ms.push();
  ms.rotate(90, [0, -1, 0]);
  ms.rotate(135, [1, 0, 0]);
  ms.rotate(time * 2, [1, 0, 0]);
  ms.translate(25, 0, (cylinder.distance));
  ms.scale(cylinder.radius);
  ms.scale(1, 1, 7);
  gl.useProgram(cylinder.model.program);
  gl.uniformMatrix4fv(cylinder.model.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(cylinder.model.uniforms.P, false, flatten(P));
  gl.uniform4fv(cylinder.model.uniforms.color, flatten(cylinder.color));
  cylinder.model.render();
  ms.pop();


  name = "Spoke5";
  cylinder = Cylinders[name];

  cylinder.model.PointMode = false;

  ms.push();
  ms.rotate(90, [0, -1, 0]);
  ms.rotate(180, [1, 0, 0]);
  ms.rotate(time * 2, [1, 0, 0]);
  ms.translate(25, 0, (cylinder.distance));
  ms.scale(cylinder.radius);
  ms.scale(1, 1, 7);
  gl.useProgram(cylinder.model.program);
  gl.uniformMatrix4fv(cylinder.model.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(cylinder.model.uniforms.P, false, flatten(P));
  gl.uniform4fv(cylinder.model.uniforms.color, flatten(cylinder.color));
  cylinder.model.render();
  ms.pop();


  name = "Spoke6";
  cylinder = Cylinders[name];

  cylinder.model.PointMode = false;

  ms.push();
  ms.rotate(90, [0, -1, 0]);
  ms.rotate(225, [1, 0, 0]);
  ms.rotate(time * 2, [1, 0, 0]);
  ms.translate(25, 0, (cylinder.distance));
  ms.scale(cylinder.radius);
  ms.scale(1, 1, 7);
  gl.useProgram(cylinder.model.program);
  gl.uniformMatrix4fv(cylinder.model.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(cylinder.model.uniforms.P, false, flatten(P));
  gl.uniform4fv(cylinder.model.uniforms.color, flatten(cylinder.color));
  cylinder.model.render();
  ms.pop();


  name = "Spoke7";
  cylinder = Cylinders[name];

  cylinder.model.PointMode = false;

  ms.push();
  ms.rotate(90, [0, -1, 0]);
  ms.rotate(270, [1, 0, 0]);
  ms.rotate(time * 2, [1, 0, 0]);
  ms.translate(25, 0, (cylinder.distance));
  ms.scale(cylinder.radius);
  ms.scale(1, 1, 7);
  gl.useProgram(cylinder.model.program);
  gl.uniformMatrix4fv(cylinder.model.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(cylinder.model.uniforms.P, false, flatten(P));
  gl.uniform4fv(cylinder.model.uniforms.color, flatten(cylinder.color));
  cylinder.model.render();
  ms.pop();


  name = "Spoke6";
  cylinder = Cylinders[name];

  cylinder.model.PointMode = false;

  ms.push();
  ms.rotate(90, [0, -1, 0]);
  ms.rotate(315, [1, 0, 0]);
  ms.rotate(time * 2, [1, 0, 0]);
  ms.translate(25, 0, (cylinder.distance));
  ms.scale(cylinder.radius);
  ms.scale(1, 1, 7);
  gl.useProgram(cylinder.model.program);
  gl.uniformMatrix4fv(cylinder.model.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(cylinder.model.uniforms.P, false, flatten(P));
  gl.uniform4fv(cylinder.model.uniforms.color, flatten(cylinder.color));
  cylinder.model.render();
  ms.pop();
}

function drawBG() {
  var name, back, data;

  name = "Background";
  back = BGs[name];
  data = Objects[name];

  ms.push();
  ms.rotate((time / 1) * 2, [0, 0, 1]);

  gl.useProgram(back.program);
  gl.uniformMatrix4fv(back.uniforms.MV, false, flatten(ms.current()));
	gl.uniformMatrix4fv(back.uniforms.P, false, flatten(P));
	gl.uniform1i(back.uniforms.texture, 0);
  back.render();
  ms.pop();
}

function resize() {
  var w = canvas.clientWidth;
  var h = canvas.clientHeight;

  gl.viewport(0, 0, w, h);

  var fovy = 75.0; // degrees
  var aspect = w / h;

  P = perspective(fovy, aspect, near, far);
}

window.onload = init;
window.onresize = resize;