//SI llegase a haber otra forma simple que se dibuje con gl.TRIANGLES hay que extraer la parte correspondiente de este codigo y crear una clase padre TrianglesObject
class Cube{
	constructor(color){
		this.trianglesQuantity = 24;

		this.position = [];
		this.normal = [];
		this.tangent = [];
		this.texture = [];
		
		this.position_buffer;
		this.color_buffer;
		this.texture_buffer;
		this.index_buffer;
		this.normal_buffer;
		this.tangent_buffer;

		this.drawMode = "TRIANGLES";
		this.nIndices = 0;

		this.createIndexBuffer();
		this.createBufferData(color);
	}

	createIndexBuffer(){
		var index_buffer = [];
		for(var i=0; i < this.trianglesQuantity ; i += 4){
			index_buffer.push(...[i,i+1,i+2,i,i+2,i+3]);
		}
		this.index_buffer = gl.createBuffer();
        this.nIndices = index_buffer.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index_buffer), gl.STATIC_DRAW);
	}

	setupWebGlBuffers(position,color,texture,normal,tangent){
		// 1. Creamos un buffer para las posicioens dentro del pipeline.
        this.position_buffer = gl.createBuffer();
        // 2. Le decimos a WebGL que las siguientes operaciones que vamos a ser se aplican sobre el buffer que
        // hemos creado.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.position_buffer);
        // 3. Cargamos datos de las posiciones en el buffer.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);
        
        this.color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.color_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);

		this.texture_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texture_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture), gl.STATIC_DRAW);
        
        this.normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normal_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
		
		this.tangent_buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tangent_buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangent), gl.STATIC_DRAW);
	}
	

	createBufferData(_color){
		this.position = [
		// Cara frontal
		-0.5, 0,  0.5,
		0.5, 0,  0.5,
		0.5,  1,  0.5,
		-0.5, 1,  0.5,
					
		// Cara de atrás
		-0.5, 0, -0.5,
		-0.5,  1, -0.5,
		0.5,  1, -0.5,
		0.5, 0, -0.5,
					
		// Cara de arriba
		-0.5,  1, -0.5,
		-0.5,  1,  0.5,
		0.5,  1,  0.5,
		0.5,  1, -0.5,
					
		// Cara de abajo
		-0.5, 0, -0.5,
		 0.5, 0, -0.5,
		 0.5, 0,  0.5,
		-0.5, 0,  0.5,
					
		// Cara de la derecha
		 0.5, 0, -0.5,
		 0.5,  1, -0.5,
		 0.5,  1,  0.5,
		 0.5, 0,  0.5,
					
		// Cara de la izquierda
		-0.5, 0, -0.5,
		-0.5, 0,  0.5,
		-0.5,  1,  0.5,
		-0.5,  1, -0.5
		];

		this.normal = [
		// Cara frontal
		0,0,1,
		0,0,1,
		0,0,1,
		0,0,1,
					
		// Cara de atrás
		0,0,-1,
		0,0,-1,
		0,0,-1,
		0,0,-1,
					
		// Cara de arriba
		0,1,0,
		0,1,0,
		0,1,0,
		0,1,0,
					
		// Cara de abajo
		0,-1,0,
		0,-1,0,
		0,-1,0,
		0,-1,0,
					
		// Cara de la derecha
		1,0,0,
		1,0,0,
		1,0,0,
		1,0,0,
					
		// Cara de la izquierda
		-1,0,0,
		-1,0,0,
		-1,0,0,
		-1,0,0
		];

		this.tangent = [
		// Cara frontal
		1,0,0,
		1,0,0,
		1,0,0,
		1,0,0,
					
		// Cara de atrás
		-1,0,0,
		-1,0,0,
		-1,0,0,
		-1,0,0,
					
		// Cara de arriba
		1,0,0,
		1,0,0,
		1,0,0,
		1,0,0,
					
		// Cara de abajo
		1,0,0,
		1,0,0,
		1,0,0,
		1,0,0,
					
		// Cara de la derecha
		0,0,-1,
		0,0,-1,
		0,0,-1,
		0,0,-1,
					
		// Cara de la izquierda
		0,0,1,
		0,0,1,
		0,0,1,
		0,0,1
		]

		this.texture = [
		// Cara frontal
		0,0,
		2,0,
		2,2,
		0,2,
					
		// Cara de atrás
		0,2,
		0,0,
		2,0,
		2,2,
					
		// Cara de arriba
		0,2,
		0,0,
		2,0,
		2,2,
					
		// Cara de abajo
		0,0,
		2,0,
		2,2,
		0,2,
					
		// Cara de la derecha
		2,0,
		2,2,
		0,2,
		0,0,
					
		// Cara de la izquierda
		0,0,
		2,0,
		2,2,
		0,2
		]

		var color = []
		for (var i= 0; i<this.trianglesQuantity*3; i+=3){
			color.push(..._color);
			
		}
		this.setupWebGlBuffers(this.position,color,this.texture,this.normal,this.tangent);
	}
}