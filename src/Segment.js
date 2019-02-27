class Segment {

    //NO PUEDO NO GUARDAR LOS DATOS DE LA POSITION Y TANGENTE, ya que los necesito para crear las normales a la curva
	constructor(controlPoints,deltaT){
		//super();
       	//this.drawMode = "LINE_STRIP";
        
        this.position = [];
        this.tangent = [];
        this.normal = [];
		this.color = [];
		this.texture = [];
        this.binormal = [];

        this.getVertices(controlPoints,deltaT);
        //this.createIndexBuffer();
	}

	getVertices(controlPoints,deltaT){
		let p0,p1,p2,p3;
        let position_buffer = [], tangent_buffer= [], normal_buffer= [];
        let binormal_buffer= [], color_buffer= [];
		for(var i = 0; i < (controlPoints.length-1)/3; ++i) {
        	p0 = controlPoints[i];
        	p1 = controlPoints[i+1];
        	p2 = controlPoints[i+2];
        	p3 = controlPoints[i+3];
			for (var t = 0; t <= 1 + 1e-5; t = deltaT + t) {
				t = (t > 1) ? 1 : t;
            	this.position.push(... this.getPosition(p0,p1,p2,p3,t));
            	this.tangent.push(... this.getTangent(p0,p1,p2,p3,t));
            	this.normal.push(... this.getNormal(p0,p1,p2,p3,t));
            	this.binormal.push(... this.getBinormal(p0,p1,p2,p3,t));
				this.color.push(...[0,1,0]);
				this.texture.push(...[0,1]);
        	}
    	}
        //this.nIndices = this.position.length/3;

        //this.setupWebGlBuffers(this.position,this.color,this.normal,this.tangent,this.binormal);
	}


	getPosition(p0, p1, p2, p3, t) {
    	var x, y,z;
    	x = p0[0]*this.base0(t) + p1[0]*this.base1(t) + p2[0]*this.base2(t) + p3[0]*this.base3(t);
    	y = p0[1]*this.base0(t) + p1[1]*this.base1(t) + p2[1]*this.base2(t) + p3[1]*this.base3(t);
    	z = p0[2]*this.base0(t) + p1[2]*this.base1(t) + p2[2]*this.base2(t) + p3[2]*this.base3(t);
    	return [x,y,z];
	};
	
	getDerivative(p0,p1,p2,p3,t) {
    	var x, y,z;
    	x = p0[0]*this.base0der(t) + p1[0]*this.base1der(t) + p2[0]*this.base2der(t) + p3[0]*this.base3der(t);
    	y = p0[1]*this.base0der(t) + p1[1]*this.base1der(t) + p2[1]*this.base2der(t) + p3[1]*this.base3der(t);
    	z = p0[2]*this.base0der(t) + p1[2]*this.base1der(t) + p2[2]*this.base2der(t) + p3[2]*this.base3der(t);
    	return [x,y,z];
	};
	
	getTangent(p0,p1,p2,p3,t) {
    	var res = [];
    	vec3.normalize(res,this.getDerivative(p0,p1,p2,p3,t));
    	return res;
	};
	
	getBinormal(p0,p1,p2,p3,t) {
    	return [0,0,-1];
	};
	
	getNormal(p0,p1,p2,p3,t) {
    	var tan = this.getTangent(p0,p1,p2,p3,t);
    	var biNormal = this.getBinormal(p0,p1,p2,p3,t);
    	var res = [];
    	vec3.cross(res,biNormal,tan);
    	vec3.normalize(res,res);
    	return res;
	};
    // NO SE SI DEBO DEJARLO A ESTO O SOLO USARLO PARA PROBAR Y DSPS FLETARLO
   	/* POR AHORA EL METODO PASO A CURVE
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
        console.log(position.length/3);
        normalLines.createIndexBuffer();
        normalLines.setupWebGlBuffers(position,color,normal);
        return normalLines;

    }
    */
}