class Circumference extends LineObject {

    constructor(radius, dT, color) {

        super();

        this.position = [];
        this.tangent = [];
        this.normal = [];
        this.color = [];
        this.binormal = [];

        var x, y, z, tanX, tanY, tanZ, normX, normY, normZ;
        
        for(var i = 0; i < 1/dT; i++) {
            x = radius*Math.cos(2*Math.PI*dT*i);
            y = 0.0;
            z = radius*Math.sin(2*Math.PI*dT*i);

            this.position.push(... [x, y, z]);

            tanX = -radius*Math.sin(2*Math.PI*dT*i);
            tanY = 0.0;
            tanZ = radius*Math.cos(2*Math.PI*dT*i);

            this.tangent.push(... [tanX, tanY, tanZ]);

            normX = -radius*Math.cos(2*Math.PI*dT*i);
            normY = 0.0;
            normZ = radius*Math.sin(2*Math.PI*dT*i);

            this.normal.push(... [normX, normY, normZ]);

            this.binormal.push(... [0, 1, 0]);

            if(!color) {
                color = [0.5, 0.5, 0.5];
            }

            this.color.push(... color);

            this.nIndices = this.position.length/3;
            this.setupWebGlBuffers(this.position,this.color,this.normal,this.tangent,this.binormal);
            this.createIndexBuffer();
        }

    }

}
