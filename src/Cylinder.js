class Cylinder extends GridObject{
	//Crea un cilindro de altura 1 y radio 1
	constructor(cols,rows){
		super(cols,rows);
		let position_buffer = [];
		let color_buffer = [];
		let texture_buffer = [];
		let normal_buffer = [];
		let tangent_buffer = [];

		let rho = 1;
		let x, y, z = 0;
		let u, v = 0;
		let normalVertex = [];
		for(let row= 0; row < this.rows; row++){
			for(let col=0; col < this.cols; col++){
				//Para cada vertice defino su posición como una rotación sobre el eje Y
				x = rho * Math.cos(col * Math.PI *2 /(this.cols -1));
				y = rho * Math.sin(col * Math.PI * 2 / (this.cols -1));
				z = ((this.rows - 1)/2 - row) / (this.rows/2);
                
				position_buffer.push(...[x,y,z]);
                
				// Para cada vértice definimos su color
				
				color_buffer.push(...[0.7,0.1,0.3]);

				normalVertex = vec3.fromValues(x,y,0);
                vec3.normalize(normalVertex,normalVertex);
				normal_buffer.push(...normalVertex);
				
				let tan = [Math.sin(col * Math.PI * 2 / (this.cols -1)), Math.cos(col * Math.PI *2 /(this.cols -1)), 0];
                vec3.rotateY(tan, tan, [0, 0, 0], Math.PI/2);
                vec3.normalize(tan, tan);
				tangent_buffer.push(...tan);
				
				u = row/(this.rows - 1);
                v = col/(this.cols - 1);
                texture_buffer.push(...[u,v]);
			}
		}
		this.setupWebGlBuffers(position_buffer,color_buffer,texture_buffer,normal_buffer,tangent_buffer);
	}
}