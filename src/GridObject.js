class GridObject{
    constructor(_cols,_rows){
        this.cols = _cols;
        this.rows = _rows;
        
        this.position_buffer;
        this.color_buffer;
        this.texture_buffer;
        this.index_buffer;
        this.normal_buffer;
        this.tangent_buffer;

        this.drawMode = "TRIANGLE_STRIP";
        this.nIndices = 0;
        
        this.createIndexBuffer();
        
    }

    createIndexBuffer(){
        var index_buffer = [];
        for(var row= 0; row< this.rows - 1; row++){
            for(var column= 0; column < this.cols; column++){
                index_buffer.push(column + row * this.cols);
                index_buffer.push(column + (row+1)*this.cols);
            }
            if(row < (this.rows - 2)){
                index_buffer.push(column - 1 + (row + 1) * this.cols);
                index_buffer.push(column + row * this.cols);
            }   
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

        if(tangent) {
            this.tangent_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.tangent_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangent), gl.STATIC_DRAW);
        }
    }

}

