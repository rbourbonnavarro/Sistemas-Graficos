class RevolutionSurface extends GridObject{

	constructor(curve,columns,axis,color,textureFunc){
		super(columns,curve.position.length/3);

		this.position = [];
		this.color = [];
		this.texture = [];
		this.normal = [];
		this.tangent = [];

		var x,y,z,normX,normY,normZ,tanX,tanY,tanZ,u,v;
		var normalVertex = [], tangentVertex = [];

		for(var row=0;row<curve.position.length;row = row+3){
			for(var col=0;col<columns;col++){
				if(axis == "x"){		
					y = curve.position[row+1]*Math.cos(col*2*Math.PI/(columns-1));
					x = curve.position[row];
					z = curve.position[row+1]*Math.sin(col * 2*Math.PI/(columns-1));
					normY = curve.normal[row+1]*Math.cos(col*2*Math.PI/(columns-1));
					normX = curve.normal[row];
					normZ = curve.normal[row+1]*Math.sin(col * 2*Math.PI/(columns-1));
					tanX = curve.tangent[row];
					tanY = curve.tangent[row+1];
					tanZ = curve.tangent[row+2];
					vec3.rotateX(tangentVertex, [tanX,tanY,tanZ], [0, 0, 0], col*2*Math.PI/(columns-1));
					vec3.normalize(tangentVertex, tangentVertex);
				}
				else if(axis == "y"){
					x = curve.position[row]*Math.cos(col*2*Math.PI/(columns-1));
					y = curve.position[row+1];
					z = curve.position[row]*Math.sin(col * 2*Math.PI/(columns-1));
					normX = curve.normal[row]*Math.cos(col*2*Math.PI/(columns-1));
					normY = curve.normal[row+1];
					normZ = curve.normal[row]*Math.sin(col * 2*Math.PI/(columns-1));
					tanX = curve.tangent[row];
					tanY = curve.tangent[row+1];
					tanZ = curve.tangent[row+2];
					vec3.rotateX(tangentVertex, [tanX,tanY,tanZ], [0, 0, 0], col*2*Math.PI/(columns-1));
					vec3.normalize(tangentVertex, tangentVertex);
				}

				this.position.push(...[x,y,z]);
				if(color){
					this.color.push(...color);
				} else	if(col/columns<1/4 || (col/columns>1/2 && col/columns<3/4)){
					this.color.push(...[0.1,0.1,0.1]);
				}else{
					this.color.push(...[0.9,0.9,0.9]);
				}

				if(textureFunc){
					var uv = textureFunc(x,y,z);
					this.texture.push(...uv)
				}else{
					u = col/(columns - 1);
					v = row/(curve.position.length - 1);
					this.texture.push(...[u, v]);

				}
				this.normal.push(...[normX,normY,normZ]);
				
				this.tangent.push(...tangentVertex);
			}
		}
		if(textureFunc){
		console.log(this.position);			
		console.log(this.texture)
		}
		//console.log(this.position.length);
		this.setupWebGlBuffers(this.position,this.color,this.texture,this.normal,this.tangent);
	}

}