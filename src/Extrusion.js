class Extrusion extends GridObject{

	constructor(curve,height,levels,color,torsionAngle,radiusProfile){
		super(curve.position.length/3,levels+1);

		this.position = [];
		this.color = [];
		this.texture = [];
		this.normal = [];
		this.tangent = [];

		var normalVertex = [], tangentVertex = [];
		var posVector = [];

		let x,y,z,u,v,normX,normY,normZ,tanX,tanY,tanZ;

		if(torsionAngle == undefined){
			var angle = 0;
		}else{
			var angle = torsionAngle;
		}

		if(radiusProfile == undefined){

			for(var row = 0; row<=levels; row++){
				for(var col = 0;col<curve.position.length;col=col+3){
				
					x = curve.position[col];
					y = row * height/levels;
					z = curve.position[col+1];

					vec3.rotateY(posVector,[x,y,z],[0,0,0],row * angle/levels);

					normX = -curve.normal[col];
					normY = 0;
					normZ = -curve.normal[col+1];

					vec3.rotateY(normalVertex,[normX,normY,normZ],[0,0,0],row * angle/levels);

					tanX = curve.tangent[col];
					tanY = curve.tangent[col+1];
					tanZ = curve.tangent[col+2];

					vec3.rotateY(tangentVertex,[tanX,tanY,tanZ],[0,0,0],row * angle/levels);

					u = col/(curve.position.length - 1);
					v = row/levels;

					this.position.push(...posVector);
					this.color.push(...color);
					this.texture.push(...[u,v]);
					this.normal.push(...normalVertex);
					this.tangent.push(...tangentVertex);
				}
			}

		}else{	
			var radiusIndex = (radiusProfile.position.length/3 - 1)/levels;

			for(var row = 0; row<=levels; row++){
				for(var col = 0;col<curve.position.length;col=col+3){
				
					var radius = Math.floor(row*radiusIndex)*3;
					x = radiusProfile.position[radius]*curve.position[col];
					y = row * height/levels;
					z = radiusProfile.position[radius]*curve.position[col+1];

					vec3.rotateY(posVector,[x,y,z],[0,0,0],row * angle/levels);

					normX = -curve.normal[col];
					normY = radiusProfile.normal[radius+1];
					normZ = -curve.normal[col+1];

					vec3.normalize([normX,normY,normZ],[normX,normY,normZ]);

					vec3.rotateY(normalVertex,[normX,normY,normZ],[0,0,0],row * angle/levels);

					tanX = curve.tangent[col];
					tanY = curve.tangent[col+1];
					tanZ = curve.tangent[col+2];

					vec3.rotateY(tangentVertex,[tanX,tanY,tanZ],[0,0,0],row * angle/levels);

					u = col/(curve.position.length - 1);
					v = row/levels;

					this.position.push(...posVector);
					this.color.push(...color);
					this.texture.push(...[u,v]);
					this.normal.push(...normalVertex);
					this.tangent.push(...tangentVertex);
				}
			}
		}
		
		this.setupWebGlBuffers(this.position,this.color,this.texture,this.normal,this.tangent);
	}

}