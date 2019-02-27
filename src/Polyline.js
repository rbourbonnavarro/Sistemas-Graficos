class Polyline extends LineObject{

	constructor(points,dT){
		super();

		this.drawMode = "LINE_STRIP";

		this.position = [];
		this.tangent = [];
        this.normal = [];
		this.color = [];
		this.texture = [];
        this.binormal = [];

        let xDir, yDir, zDir;

        let tan = [];
        let norm = [];

		for(var i = 0; i<points.length-1; i++){
			xDir = points[i+1][0]-points[i][0];
			yDir = points[i+1][1]-points[i][1];
			zDir = points[i+1][2]-points[i][2];

			for(var k = 0; k <= 1/dT; k++){
				this.position.push(...[points[i][0]+k*dT*xDir,points[i][1]+k*dT*yDir,points[i][2]+k*dT*zDir]);
				vec3.normalize(tan,[xDir,yDir,zDir]);
				this.tangent.push(...tan);
				this.binormal.push(...[0,0,-1]);
				vec3.cross(norm,[0,0,-1],tan);
				this.normal.push(...norm);
				this.color.push(...[0,0,0]);
				this.texture.push(...[0,0]);
			}
		}
		this.nIndices = this.position.length/3;
		this.setupWebGlBuffers(this.position,this.color,this.texture,this.normal,this.tangent,this.binormal);
		this.createIndexBuffer();
	}

}