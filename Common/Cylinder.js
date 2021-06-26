"use strict";

function Cylinder( slices, stacks, vertexShader, fragmentShader )
{ 
    var i, j;
	
    var program = initShaders(gl, vertexShader || "object-vertex-shader", fragmentShader || "object-fragment-shader");
	
    var nSlices = slices || 20;
    var nStacks = stacks || 12;
    var dZ = 2.0 / (nStacks - 1);
    var dTheta = 2.0 * Math.PI / nSlices;
	
	//Add vertices.
    var positions = [];
	
	//Add the north pole to the cylinder.
    positions.push(0.0, 0.0, 1.0);
	
	//Pushes in the vertices for the cylinder
	//using cylinder-to-rectangle coordinates.
	//This is essentially the only edit I made
	//to the original sphere file.
    for (j = 0; j < nStacks; ++j)
	{
        var z = 1.0 - (j * dZ);
		
        for (i = 0; i < nSlices; ++i)
		{
            var theta = i * dTheta;
            var x = Math.cos(theta);
            var y = Math.sin(theta);
			
            positions.push(x, y, z);
        }
    }
	
	//Add the south pole to the cylinder.
    positions.push(0.0, 0.0, -1.0);
	
	//Add indices.
    var indices = [];
    var drawCalls = [];
	
	//These variables serve to offset
	//the index count so that we can
	//render in batches.
    var start = indices.length;
    var offset = start * 2;
	
    var n = 1;
    var m;
	
	//First, we push the indices for the
	//north pole and the first stack of
	//the cylinder.
    indices.push(0);
	
	//Just load the indices in sequentially.
    for (i = 0; i < nSlices; ++i)
	{
        indices.push(n + i);
    }
	
	//And the last one.
    indices.push(n);
	
	//Now push the first round of indices
	//into the draw calls to render them.
    drawCalls.push({
        type: gl.TRIANGLE_FAN,
        count: indices.length,
        offset: offset
    });
	
	//Reset the offsets for rendering the
	//body of the cylinder.
    start = indices.length;
    offset = start * 2;
	
	//This mess of a double for-loop handles
	//calculating the indices for all but the
	//first and last stacks of the cylinder.
    for (j = 0; j < nStacks - 1; ++j)
	{
        for (i = 0; i < nSlices; ++i)
		{
            m = n + i;
            indices.push(m);
            indices.push(m + nSlices);
        }
		
        indices.push(n);
        indices.push(n + nSlices);
		
        n += nSlices;
		
		//Push the layer into the draw call.
        drawCalls.push({
            type: gl.TRIANGLE_STRIP,
            count: indices.length - start,
            offset: offset
        });
		
		//Reset the offsets for the next
		//layer of the cylinder.
        start = indices.length;
        offset = start * 2;
    }
	
    indices.push(n + nSlices);
    indices.push(n);
	
	//Finally, handle the weird logic
	//for rendering the south pole.
    for (i = 0; i < nSlices; ++i)
	{
        m = n + this.slices - i - 1;
        indices.push(m);
    }
	
	//Push the south pole into the draw call.
    drawCalls.push({
        type: gl.TRIANGLE_FAN,
        count: indices.length - start,
        offset: offset
    });
	
    var vPosition = {
        numComponents: 3,
        buffer: gl.createBuffer(),
        location: gl.getAttribLocation(program, "vPosition")
    };
	
    gl.bindBuffer(gl.ARRAY_BUFFER, vPosition.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	
    var elementArray = {
        buffer: gl.createBuffer()
    };
	
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementArray.buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	
    this.PointMode = false;
    this.program = program;
	
    this.render = function ()
	{
        gl.useProgram(program);
		
		gl.enableVertexAttribArray(vPosition.location);
        gl.bindBuffer(gl.ARRAY_BUFFER, vPosition.buffer);
        gl.vertexAttribPointer(vPosition.location, vPosition.numComponents, gl.FLOAT, gl.FALSE, 0, 0);
		
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementArray.buffer);
		
        for (i = 0; i < drawCalls.length; ++i )
		{
            var p = drawCalls[i];
            gl.drawElements(this.PointMode ? gl.POINTS : p.type, p.count, gl.UNSIGNED_SHORT, p.offset);
        }
    };
};
