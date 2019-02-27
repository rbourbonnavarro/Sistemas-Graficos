class Curve extends LineObject{
	constructor(cPoints,dT,curveType){
		super();
		this.drawMode = "LINE_STRIP";

		this.position = [];
        this.tangent = [];
        this.normal = [];
		this.color = [];
		this.texture = [];
        this.binormal = [];
		
		var maxCount;
		var recoil;
        var count = 0;
		var i = 0;
		var segmentsArrays = [];
		var segments = [];
		var segment = [];

		if(curveType == "bspline") {
			maxCount = 3;
			recoil = 2;
		}
		else if(curveType == "bezier") {
			maxCount = 4;
			recoil = 1;
		}

		for(; i < cPoints.length; i++){
			segment.push(cPoints[i]);
			count++;
			if(count == maxCount){
				segmentsArrays.push(segment);
				segment = [];
				count = 0;
				if(i<cPoints.length-1){ 
					i=i-recoil; 
				}
			}
		}

		for(var i = 0;i<segmentsArrays.length;i++){
			if(curveType == "bspline") {
				segments.push(new BSpline(segmentsArrays[i],dT));
			}
			else if(curveType == "bezier") {
				segments.push(new CubicBezier(segmentsArrays[i],dT));
			}
			if(i > 0) {
				for(var j = 0; j<3; j++) {
					segments[i].position.shift();
					segments[i].tangent.shift();
					segments[i].normal.shift();
					segments[i].color.shift();
					segments[i].binormal.shift();
				}
				segments[i].texture.shift();
				segments[i].texture.shift();
			}
			this.position.push(... segments[i].position);
			this.tangent.push(... segments[i].tangent);
			this.normal.push(... segments[i].normal);
			this.color.push(... segments[i].color);
			this.texture.push(... segments[i].texture);
			this.binormal.push(... segments[i].binormal);
			//this.segments.push(new GraphicObject(this.bsplines[i],mat4.create()));
			//this.segments[i].addChild(new GraphicObject(this.bsplines[i].getNormals(),mat4.create()));

		}

		this.nIndices = this.position.length/3;
		this.setupWebGlBuffers(this.position,this.color,this.texture,this.normal,this.tangent,this.binormal);
		this.createIndexBuffer();
	}

	setPosition() {

		this.setupWebGlBuffers(this.position,this.color,this.normal,this.tangent,this.binormal);
	
	}

	rotate(axis, angle) {

		let epsilon = 1e-6;
		
		for(let i = 0; i<this.position.length/3; i++) {

			let rotatedPoint = [
				this.position[3*i],
				this.position[3*i + 1],
				this.position[3*i + 2]
			];

			switch(axis) {
				case "x"://console.log("antes " + rotatedPoint);
					vec3.rotateX(rotatedPoint, rotatedPoint, [0,0,0], angle);//console.log("despues " + rotatedPoint);
					break;
				case "y":
					vec3.rotateY(rotatedPoint, rotatedPoint, [0,0,0], angle);
					break;
				case "z":
					vec3.rotateZ(rotatedPoint, rotatedPoint, [0,0,0], angle);
					break;
			}

			this.position[3*i] = (Math.abs(rotatedPoint[0]) < epsilon) ? 0 : rotatedPoint[0];
			this.position[3*i + 1] = (Math.abs(rotatedPoint[1]) < epsilon) ? 0 : rotatedPoint[1];
			this.position[3*i + 2] = (Math.abs(rotatedPoint[2]) < epsilon) ? 0 : rotatedPoint[2];

		}

		this.setPosition();

	}

	scale(scale) {

		for(let i = 0; i<this.position.length/3; i++) {
			
			this.position[3*i] *= scale[0];
			this.position[3*i + 1] *= scale[1];
			this.position[3*i + 2] *= scale[2];

		}

		this.setPosition();

	}
	
	getNormals() {

        var normalLines = new LineObject();

        let position = [];
        let color = [];
        let normal = [];

        for(var i = 0; i<this.nIndices; i++) {
            position.push(this.position[i*3]);
            position.push(this.position[i*3+1]);
            position.push(this.position[i*3+2]);
            
            position.push(this.position[i*3] + this.normal[i*3]);
            position.push(this.position[i*3+1] + this.normal[i*3+1]);
            position.push(this.position[i*3+2] + this.normal[i*3+2]);
            
            color.push(...[0,1,0,0,1,0]);
            
            normal.push(...[0,0,1,0,0,1]);
        }
        normalLines.nIndices = position.length/3;
        normalLines.createIndexBuffer();
        normalLines.setupWebGlBuffers(position,color,normal);
        return normalLines;

    }

}