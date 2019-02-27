class GraphicObject{
	constructor(obj,mvMatrix,material){
		this.mvMatrix = mvMatrix;
        this.obj = obj;
        this.material = material;
        this.discardLevel = 10.0;
		this.children = [];
        program.u_model_view_matrix = gl.getUniformLocation(program, "uMVMatrix");
        program.u_model_matrix = gl.getUniformLocation(program, "uMMatrix");
        program.u_normal_matrix = gl.getUniformLocation(program, "uNMatrix");
        program.u_normal_model_matrix = gl.getUniformLocation(program, "uNMMatrix");

        program.u_discard_level = gl.getUniformLocation(program, "uDiscardLevel");

        program.vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
        program.vertexColorAttribute = gl.getAttribLocation(program, "aVertexColor");
        program.vertexTexCoordAttribute = gl.getAttribLocation(program, "aVertexTexCoord");
        program.vertexNormalAttribute = gl.getAttribLocation(program, "aVertexNormal");
        program.vertexTangentAttribute = gl.getAttribLocation(program, "aVertexTangent");
	}
	addChild(child){
        this.children.push(child);
    }

    setObj(obj) {
        this.obj = obj;
    }
    
    setmvMatrix(matrix){
        this.mvMatrix = matrix;
    }

    setDiscardLevel(mdiscardLevel) {
        this.discardLevel = mdiscardLevel;
    }

    multiplymvMatrix(matrix){
        mat4.multiply(this.mvMatrix,matrix,this.mvMatrix);
    }

    setupNormals() {

        let a = new LineObject();
        let position = [];
        let normal = [];
        let tangent = [];
        let color = [];
        let texture = [];

        for(let i = 0; i<this.obj.position.length/3; i++) {

            position.push(this.obj.position[i*3]);
            position.push(this.obj.position[i*3+1]);
            position.push(this.obj.position[i*3+2]);
            
            position.push(this.obj.position[i*3] + this.obj.normal[i*3] * 0.03);
            position.push(this.obj.position[i*3+1] + this.obj.normal[i*3+1] * 0.03);
            position.push(this.obj.position[i*3+2] + this.obj.normal[i*3+2] * 0.03);
            
            color.push(...[0,1,0,0,1,0]);

            texture.push(...[0,0,0,0]);
            
            normal.push(...[0,0,1,0,0,1]);

            tangent.push(...[1,0,0,1,0,0]);

        }
        a.nIndices = position.length/3;
        a.createIndexBuffer();
        a.setupWebGlBuffers(position,color,texture,normal,tangent);
        let aMaterial = new Material();
        aMaterial.setColor([0,1,0]);
        aMaterial.setSpecular([1,1,1]);
        aMaterial.setShininess(10);
        let ag = new GraphicObject(a, mat4.create(),aMaterial);
        this.addChild(ag);
        
    }

    // Esta función es la que se encarga de configurar todo lo necesario
    // para dibujar el VertexGrid.
    // En el caso del ejemplo puede observarse que la última línea del método
    // indica dibujar triángulos utilizando los 6 índices cargados en el Index_Buffer.
    draw(matrix){

        //var parentMatrix = this.mvMatrix;
        var m = [];
        mat4.multiply(m,matrix,this.mvMatrix);

        gl.uniformMatrix4fv(program.u_model_view_matrix, false, m);//console.log(gl + this.mvMatrix);
        gl.uniformMatrix4fv(program.u_model_matrix, false, this.mvMatrix);

        var nMatrix=[];
        
        mat3.normalFromMat4(nMatrix,this.mvMatrix);
        gl.uniformMatrix3fv(program.u_normal_model_matrix, false, nMatrix);
        
        mat3.normalFromMat4(nMatrix,m);
        gl.uniformMatrix3fv(program.u_normal_matrix, false, nMatrix);

        gl.uniform1f(program.u_discard_level, this.discardLevel);

        // si no tiene Obj bindeado (pensar si se puede llamar de otra forma), no se dibuja, se asume nodo acumulador vacio
        if(this.obj){
            gl.enableVertexAttribArray(program.vertexPositionAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.obj.position_buffer);
            gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

            gl.enableVertexAttribArray(program.vertexColorAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.obj.color_buffer);
            gl.vertexAttribPointer(program.vertexColorAttribute, 3, gl.FLOAT, false, 0, 0);

            if(this.obj.texture_buffer) {
                gl.enableVertexAttribArray(program.vertexTexCoordAttribute);
                gl.bindBuffer(gl.ARRAY_BUFFER, this.obj.texture_buffer);
                gl.vertexAttribPointer(program.vertexTexCoordAttribute, 2, gl.FLOAT, false, 0, 0);
            }
            
            this.material.setup();

            gl.enableVertexAttribArray(program.vertexNormalAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.obj.normal_buffer);
            gl.vertexAttribPointer(program.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

            if(this.obj.tangent_buffer) {
                gl.enableVertexAttribArray(program.vertexTangentAttribute);
                gl.bindBuffer(gl.ARRAY_BUFFER, this.obj.tangent_buffer);
                gl.vertexAttribPointer(program.vertexTangentAttribute, 3, gl.FLOAT, false, 0, 0);
            }

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.obj.index_buffer);

            // Dibujamos.
            gl.drawElements(gl[this.obj.drawMode], this.obj.nIndices, gl.UNSIGNED_SHORT, 0);
        }
        this.children.forEach(function(child){ 
            child.draw(m)});
    }
}