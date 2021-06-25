var canvas;
var gl;

var Spheres = {
  Tire : undefined,
  // Wheel : undefined
};

var BGs = {
  BackGround : undefined
};

// Viewing transformation parameters
var V;  // matrix storing the viewing transformation

// Projection transformation parameters
var P;  // matrix storing the projection transformation
var near = 10;      // near clipping plane's distance
var far = 120;      // far clipping plane's distance

// Animation variables
var time = 0.0;      // time, our global time constant, which is 
                     // incremented every frame
var timeDelta = 0.5; // the amount that time is updated each fraime

var ms = new MatrixStack();

function init() {
  canvas = document.getElementById("webgl-canvas");

  // Configure our WebGL environment
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) { alert("WebGL initialization failed"); }

  gl.clearColor(222/255, 222/255, 222/255, 1.0);
  gl.enable(gl.DEPTH_TEST);

  for (var name in Spheres ) {
    var sphere = Spheres[name] = new Sphere();

    sphere.uniforms = { 
      texture : gl.getUniformLocation(sphere.program, "color"),
      MV : gl.getUniformLocation(sphere.program, "MV"),
      P : gl.getUniformLocation(sphere.program, "P")
    };
  }

  for (var name in BGs) {
    var backdrop = BGs[name] = new BG();

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

  drawBG();
  drawSphere();

  window.requestAnimationFrame(render);
}

function drawSphere() {
  var name, sphere, data;

  name = "Tire";
  sphere = Spheres[name];
  data = Objects[name];

  sphere.PointMode = false;

  ms.push();
  ms.rotate((time / 1) * 2, [0, 0, 1]);
  ms.scale(data.radius);
  gl.useProgram(sphere.program);
  gl.uniformMatrix4fv(sphere.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(sphere.uniforms.P, false, flatten(P));
  gl.uniform4fv(sphere.uniforms.color, flatten(data.color));
  sphere.render();
  ms.pop();
}

function drawBG() {
  var back = BGs["BackGround"];
  var data = Objects["BackGround"];

  back.PointMode = false;

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