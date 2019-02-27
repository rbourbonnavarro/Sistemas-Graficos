class Plane extends GridObject{
	constructor(cols,rows, textures){
		super(cols,rows);
		// Esta función inicializa el this.position y el color buffer de forma de 
    	// crear un plano de color gris que se extiende sobre el plano XY, con Z=0
    	// El plano se genera centrado en el origen.
    	// El propósito de esta función es a modo de ejemplo de como inicializar y cargar
    	// los buffers de las posiciones y el color para cada vértice.
		    
        this.position = [];
        this.color = [];
        this.normal = [];
        this.tangent = [];
        this.texture = [];
        let x=0, y=0, u=0, v=0;
        let normalVertex;
        for (var i = 0.0; i < this.rows; i++) { 
            for (var j = 0.0; j < this.cols; j++) {
                // Para cada vértice definimos su posición
                // como coordenada (x, y, z=0)
                x = (j-(this.cols-1)/2.0) * 2.0 /this.cols;
                y = ((this.rows - 1)/2.0 - i) * 2.0 /this.rows;
                this.position.push(...[x,y,0]);

                // Para cada vértice definimos su color
                this.color.push(...[0.7,0.7,0.7]);

				normalVertex = vec3.fromValues(0,0,1);
                vec3.normalize(normalVertex,normalVertex);
                this.normal.push(...normalVertex);

                this.tangent.push(...[1, 0, 0]);

                u = j*5;
                v = i*5;
                this.texture.push(...[u,v]);

            };
        };
        this.setupWebGlBuffers(this.position,this.color,this.texture,this.normal,this.tangent);
    }

	
}