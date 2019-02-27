class LineObject{
	constructor(){
        this.children = [];
        this.drawMode = "LINES";
        this.nIndices = 0;
        this.position_buffer;
        this.color_buffer;
        this.texture_buffer;
        this.index_buffer;
        this.normal_buffer;
        this.tangent_buffer;
        //console.log("LineObject : ", this);
    }

    createIndexBuffer(){
        var index_buffer = [];
        for(var l= 0; l< this.nIndices; l++){
               index_buffer.push(l);
        }
        this.index_buffer = gl.createBuffer();

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index_buffer), gl.STATIC_DRAW);

    }

    setupWebGlBuffers(position,color,texture,normal,tangent,binormal){
        // 1. Creamos un buffer para las posicioens dentro del pipeline.
        this.position_buffer = gl.createBuffer();
        // 2. Le decimos a WebGL que las siguientes operaciones que vamos a ser se aplican sobre el buffer que
        // hemos creado.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.position_buffer);
        // 3. Cargamos datos de las posiciones en el buffer.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);
        
        if(color) {
            this.color_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.color_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);  
        }

        if(texture) {
            this.texture_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.texture_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture), gl.STATIC_DRAW);  
        }
        
        this.normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);

        if(tangent){
            //console.log("SE DEFINITIO TANGENTE PARA ", this);
            this.tangent_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.tangent_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangent), gl.STATIC_DRAW);            
        }else{
            //console.log("NO se definio tangete para: ", this);
        }

        if(binormal){
            //console.log("SE DEFINITIO BINORMAL PARA ", this);
            this.binormal_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.binormal_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(binormal), gl.STATIC_DRAW);            
        }else{
            //console.log("NO se definio binormal para: ", this);
        }
    }

}