var gl = null;

function init() {
    var canvas = document.getElementById( "webgl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );

    if ( !gl ) {
        alert("Unable to setup WebGL");
        return;
    }
    
    Cone(gl);
    render();
}

function render() {
    Cone.render();
}

window.onload = init;