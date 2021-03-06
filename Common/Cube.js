function Cube( vertexShaderId, fragmentShaderId ) {

    // Initialize the shader pipeline for this object using either shader ids
    //   declared in the application's HTML header, or use the default names.
    //
    var vertShdr = vertexShaderId || "Cube-vertex-shader";
    var fragShdr = fragmentShaderId || "Cube-fragment-shader";

    this.program = initShaders(gl, vertShdr, fragShdr);

    if ( this.program < 0 ) {
        alert( "Error: Cube shader pipeline failed to compile.\n\n" +
            "\tvertex shader id:  \t" + vertShdr + "\n" +
            "\tfragment shader id:\t" + fragShdr + "\n" );
        return; 
    }

    this.positions = { 
        values : new Float32Array([
           // Add your list vertex positions here
           .5, .5, .5,      // 0
           -.5, .5, .5,     // 1
           .5, -.5, .5,     // 2
           -.5, -.5, .5,    // 3
           .5, .5, -.5,     // 4
           -.5, .5, -.5,    // 5
           .5, -.5, -.5,    // 6
           -.5, -.5, -.5    // 7
            ]),
        numComponents : 3
    };

    this.textures = {
        values : new Float32Array([
            1.0, 1.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 0.0,
            0.0, 1.0,
            1.0, 0.0,

            1.0, 1.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 0.0,
            0.0, 1.0,
            1.0, 0.0,

            1.0, 1.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 0.0,
            0.0, 1.0,
            1.0, 0.0,

            1.0, 1.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 0.0,
            0.0, 1.0,
            1.0, 0.0,

            1.0, 1.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 0.0,
            0.0, 1.0,
            1.0, 0.0,

            1.0, 1.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 0.0,
            0.0, 1.0,
            1.0, 0.0
        ]),
        numComponents : 2
    };
    
    this.indices = { 
        values : new Uint16Array([
            // Add your list of triangle indices here
            // Front
            0, 1, 3,
            3, 0, 2,

            // Top
            0, 1, 5,
            5, 0, 4,

            // Right
            0, 2, 6,
            6, 0, 4,

            // Left
            1, 3, 7,
            7, 1, 5,

            // Back
            4, 5, 6,
            6, 5, 7,

            // Bottom
            2, 3, 7,
            7, 2, 6 
        ])
    };

    this.indices.count = this.indices.values.length;

    function loadTexture(image, texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D. gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    initTexture();

    function initTexture() {
        texture = gl.createTexture();
        tImage = new Image();
        tImage.onload = function() {
            loadTexture(tImage, texture);
        };
        tImage.sec = "https://i.pinimg.com/474x/1b/e4/94/1be494c3c065c9c97da3231f7303ee85.jpg";
    }
    
    this.positions.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.positions.buffer );
    gl.bufferData( gl.ARRAY_BUFFER, this.positions.values, gl.STATIC_DRAW );

    this.indices.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, this.indices.values, gl.STATIC_DRAW );

    this.positions.attributeLoc = gl.getAttribLocation( this.program, "aPosition" );
    gl.enableVertexAttribArray( this.positions.attributeLoc );

    this.textures.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textures.buffer);
    gl.bufferData( gl.ARRAY_BUFFER, this.textures.values, gl.STATIC_DRAW );

    this.textures.attributeLoc = gl.getAttribLocation( this.program, "aTexCoord" );
	gl.enableVertexAttribArray( this.textures.attributeLoc );

    texLoc = gl.getUniformLocation(this.program, "uTexture");
    MVLoc = gl.getUniformLocation( this.program, "MV" );

    this.MV = undefined;

    this.render = function () {
        gl.useProgram( this.program );

        gl.bindBuffer( gl.ARRAY_BUFFER, this.positions.buffer );
        gl.vertexAttribPointer( this.positions.attributeLoc, this.positions.numComponents,
            gl.FLOAT, gl.FALSE, 0, 0 );
 
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer );

        gl.uniformMatrix4fv( MVLoc, gl.FALSE, flatten(this.MV) );

        gl.bindBuffer( gl.ARRAY_BUFFER, this.textures.buffer );
		gl.vertexAttribPointer( this.textures.attributeLoc, this.textures.numComponents, gl.FLOAT, gl.FALSE, 0, 0 );

        gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.uniform1i(texLoc, 0);

        // Draw the cube's base
        gl.drawElements( gl.TRIANGLES, this.indices.count, gl.UNSIGNED_SHORT, 0 );
    }
};