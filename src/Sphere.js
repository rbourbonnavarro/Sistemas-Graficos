class Sphere extends GridObject{

	//Crea una esfera de radio 1 centrado en el origen
	constructor(_cols,_rows){
        super(_cols,_rows);
        let rho = 1;
        let x, y, z = 0;
        let u, v = 0;
        let normalVertex;

        this.position = [];
        this.color = [];
        this.texture = [];
        this.normal = [];
        this.tangent = [];

        //console.log(this);

        for(let row= 0; row < this.rows; row++){
            for(let col=0; col < this.cols; col++){
                //Para cada vertice defino su posición como una rotación sobre el eje Y
                y = rho * Math.cos(col * Math.PI *2 /(this.cols -1)) * Math.sin(row * Math.PI / (this.rows - 1));
                x = rho * Math.sin(col * Math.PI * 2 / (this.cols -1)) * Math.sin(row * Math.PI / (this.rows - 1));
                z = rho * Math.cos(row * Math.PI / (this.rows - 1));
                this.position.push(... [x,y,z]);
        
                // Para cada vértice definimos su this.color
                if(col * Math.PI * 2 / (this.cols -1) < Math.PI ){
                    this.color.push(...[0,0.5,0.5]);
                }else{
                    this.color.push(...[0.5,0.5,0]);
                }
                normalVertex = vec3.fromValues(x,y,z);
                vec3.normalize(normalVertex,normalVertex);
                this.normal.push(...normalVertex);

                let tan = [Math.sin(col * Math.PI * 2 / (this.cols -1)), Math.cos(col * Math.PI *2 /(this.cols -1)), 0];
                vec3.rotateY(tan, tan, [0, 0, 0], Math.PI/2);
                vec3.normalize(tan, tan);
                this.tangent.push(...tan);

                u = col/(this.cols - 1);
                v = row/(this.rows - 1);
                this.texture.push(...[u,v]);
            }
        }
        this.setupWebGlBuffers(this.position,this.color,this.texture,this.normal,this.tangent);
        
	}
}