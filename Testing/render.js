var img = 'midterm-bg.png';

var BGs = {
    Background : {
        model : undefined,
        distance : 10,
        source : img,
    }
};

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

  drawBG(BGs[name], ms);

  window.requestAnimationFrame(render);
}

function drawBG(data, ms) {
  var name, back, data;

  name = "Background";
  back = BGs[name];

  back.model.PointMode = false;

  ms.push();
  gl.useProgram(back.model.program);
  gl.uniformMatrix4fv(back.model.uniforms.MV, false, flatten(ms.current()));
  gl.uniformMatrix4fv(back.model.uniforms.P, false, flatten(P));
  gl.uniform1i(back.model.uniforms.texture, 0);
  back.model.render();
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