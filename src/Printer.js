class Printer extends GraphicObject{
	/*	
		 <---------2------->
		  __________________
	^	 |__________________| <-- 0.25
	|	  |  |		   |  |
   	|	  |  |   ^	   |  |
	|	  |  |   1	   |  |
	|	 0.05|   v	  0.05|
	|	 _|__|_________|__|_
   2.5	|  	^			 	|
	|	|   |			    |	
	|	|  	1.25   			|
	|	|  	|	   			|
	|	|  	v	   			|				
	v	|___________________|
        
        <---------1--------->



        Riel
         <---------  1  ------------>		 < 0.025>
		 ___________________________		  ______
    ^   |						    |		 |		|
   0.1  |							|		 |		|
    v   |___________________________|		 |______|

	*/

	constructor(mvMatrix){
		super(undefined,mvMatrix);
		this.cube = new Cube([0.92,0.875,0.44]);

		this.structureMaterial = new Material();
        this.structureMaterial.setColor([0.92,0.875,0.44]);
        this.structureMaterial.setSpecular([1,1,1]);
		this.structureMaterial.setShininess(10);
		// this.structureMaterial.setDiffuseMap(textures["madera"]);
		// this.structureMaterial.setNormalMap(textures["madera"]);
		
		this.railsSupportMaterial = new Material();
        this.railsSupportMaterial.setColor([0.976,0.679,0.777]);
        this.railsSupportMaterial.setSpecular([1,1,1]);
		this.railsSupportMaterial.setShininess(10);
		// this.railsSupportMaterial.setDiffuseMap(textures["madera"]);
		// this.railsSupportMaterial.setNormalMap(textures["madera"]);
		
		this.railsMaterial = new Material();
        this.railsMaterial.setColor([0.039,0.473,0.0468]);
        this.railsMaterial.setSpecular([1,1,1]);
		this.railsMaterial.setShininess(10);
		// this.railsMaterial.setDiffuseMap(textures["metalPintado"]);
		// this.railsMaterial.setNormalMap(textures["madera"]);
		
		
		this.wheelsMaterial = new Material();
        this.wheelsMaterial.setColor([0.1,0.1,0.1]);
        this.wheelsMaterial.setSpecular([1,1,1]);
		this.wheelsMaterial.setShininess(10);
		// this.wheelsMaterial.setDiffuseMap(textures["metalPintado"]);
		// // this.wheelsMaterial.setNormalMap(textures["madera"]);

		//base		
		this.base = new GraphicObject(this.cube,mat4.create(),this.structureMaterial);
		this.base.heigth = 1.25;
		this.base.width = 1;
		this.setupBase();

		//columnas
		this.columns = new GraphicObject();
		this.columns.heigth = 1;
		this.columns.width = 0.025;
		this.setupColumns();

		//techo
		this.roof = new GraphicObject(this.cube,undefined,this.structureMaterial);
		this.roof.heigth = 0.25;
		this.setupRoof();

		//soporte para los rieles
		//como tiene otro color, debo crear un buffer distinto de cubo
		this.cube = new Cube([0.976,0.679,0.777]);
		this.rails = new GraphicObject();
		this.rails.heigth = 0.1;
		this.rails.width = 0.025;
		this.setupRailsSupport();

		//ruedas del riel ortogonal
		this.railsWheels = new GraphicObject(undefined,mat4.create());
		this.railsWheels.heigth = 0.05;
		this.railsWheels.width = 0.025;

		this.cube = new Cube([0.039,0.473,0.0468])
		//estructura del riel
		this.orthogonalRailEstructure = new GraphicObject(undefined,mat4.create());
		//riel - conexiones
		this.connectionAndRail = new GraphicObject(undefined,mat4.create());
		this.orthogonalRailEstructure.zPosition = 0;
		//conexiones
		this.railConnection = new GraphicObject(this.cube,mat4.create(),this.railsMaterial);
		this.railConnection.heigth = 0.025;
		this.railConnection.width = 0.05;
		this.railConnection.depth = 0.03;

		this.orthogonalRail =new GraphicObject(this.cube,mat4.create(),this.railsMaterial);
		this.orthogonalRail.width = 1 - this.columns.width * 3  - this.railsWheels.width *2 ;
		this.orthogonalRail.heigth = this.railConnection.depth;
		this.orthogonalRail.depth = this.railConnection.depth;

		//cabezal - rueda
		let mwandp = mat4.create();
		mat4.scale(mwandp,mwandp,[1/this.orthogonalRail.width,1/this.orthogonalRail.heigth,1/this.orthogonalRail.depth])
		this.wheelAndPrinthead = new GraphicObject(undefined,mwandp);
		this.wheelAndPrinthead.xPosition = 0;

		this.printHead = new GraphicObject(undefined,mat4.create());

		this.printHeadHolder = new GraphicObject(undefined,mat4.create());		
		this.printHeadHolder.heigth = this.orthogonalRail.heigth + this.railsWheels.heigth*6/10 ;
		this.printHeadHolder.width = this.railsWheels.width/2;
		this.printHeadHolder.depth = this.printHeadHolder.width;

		this.printHeadBulk = new GraphicObject(this.cube,mat4.create(),this.railsMaterial);
		this.printHeadBulk.heigth = 0.04;
		this.printHeadBulk.width =0.06;
		this.printHeadBulk.depth = this.printHeadBulk.width;

		this.printerHeadTip = new GraphicObject(undefined,mat4.create);
		this.printerHeadTip.heigth = this.rails.heigth + this.railsWheels.heigth/2 - this.railConnection.heigth  -this.orthogonalRail.heigth-this.printHeadBulk.heigth;
		this.printerHeadTip.width = this.printHeadBulk.width/2;
		this.printerHeadTip.depth = this.printerHeadTip.width;

		//this.
 		this.setupOrthogonalRailEstructure();

	}	

	setupBase(){
		let base = mat4.create();
		mat4.scale(base,base,[this.base.width,this.base.heigth,this.base.width]);
		this.base.setmvMatrix(base);
		this.addChild(this.base);
	}

	setupColumns(){
		let mvColumns = mat4.create();
		mat4.scale(mvColumns,mvColumns,[1/this.base.width, 1/this.base.heigth, 1/this.base.width]);
		mat4.translate(mvColumns, mvColumns, [0,this.base.heigth,0]);
		this.columns.setmvMatrix(mvColumns);
		this.base.addChild(this.columns);

		let colum1 = mat4.create();
		mat4.translate(colum1,colum1,[-this.base.width/2 + this.columns.width
			,0,this.base.width/2 - this.columns.width]);
		mat4.scale(colum1, colum1,[this.columns.width,this.columns.heigth,this.columns.width]);

		let colum2 = mat4.create();
		mat4.translate(colum2,colum2,[this.base.width/2 - this.columns.width
			,0,this.base.width/2 - this.columns.width])
		mat4.scale(colum2, colum2,[this.columns.width,this.columns.heigth,this.columns.width]);

		let colum3 = mat4.create();
		mat4.translate(colum3,colum3,[this.base.width/2 - this.columns.width
			,0,-this.base.width/2 + this.columns.width])
		mat4.scale(colum3, colum3,[this.columns.width,this.columns.heigth,this.columns.width]);

		let colum4 = mat4.create();
		mat4.translate(colum4,colum4,[-this.base.width/2 + this.columns.width
			,0,-this.base.width/2 + this.columns.width]);
		mat4.scale(colum4, colum4,[this.columns.width,this.columns.heigth,this.columns.width]);

		this.columns.addChild(new GraphicObject(this.cube,colum1,this.structureMaterial));
		this.columns.addChild(new GraphicObject(this.cube,colum2,this.structureMaterial));
		this.columns.addChild(new GraphicObject(this.cube,colum3,this.structureMaterial));
		this.columns.addChild(new GraphicObject(this.cube,colum4,this.structureMaterial));
	}

	setupRoof(){
		let mvRoof = mat4.create();
		mat4.translate(mvRoof,mvRoof,[0,this.columns.heigth,0]);
		mat4.scale(mvRoof,mvRoof,[this.base.width,this.roof.heigth,this.base.width]);
		this.roof.setmvMatrix(mvRoof);
		this.columns.addChild(this.roof);

	}

	/*
	* 	Creará dos rectangulos de color rosado, que son los soportes a los rieles.
	*	Su movimiento estará limitado, por ser hijo de columns, a moverse en el
	*	eje Y desde 0 hasta this.columns.heigth - this.rails.heigth
	*/
	setupRailsSupport(){

		this.rails.yPosition = 0;
		let mvRails = mat4.create();
		mat4.translate(mvRails,mvRails,[0,this.rails.yPosition,0]);
		this.rails.setmvMatrix(mvRails);
		this.columns.addChild(this.rails);

		//Desplazamiento en x de los rieles (en modulo);
		let railXshift =  this.base.width/2 - 2 * this.columns.width;
		let mvRailLeft = mat4.create();
		mat4.translate(mvRailLeft,mvRailLeft,[-railXshift,0,0]);
		mat4.scale(mvRailLeft,mvRailLeft, [this.rails.width, this.rails.heigth, 1]);
		this.rails.addChild(new GraphicObject(this.cube,mvRailLeft,this.railsSupportMaterial));

		let mvRailRigth = mat4.create();
		mat4.translate(mvRailRigth,mvRailRigth,[railXshift,0,0]);
		mat4.scale(mvRailRigth,mvRailRigth, [this.rails.width, this.rails.heigth, 1]);
		this.rails.addChild(new GraphicObject(this.cube,mvRailRigth,this.railsSupportMaterial));
	}

	setupOrthogonalRailEstructure(){
		let mOrthRail = mat4.create();
		mat4.translate(mOrthRail,mOrthRail,[0,this.rails.heigth + this.railsWheels.heigth /2,0]);
		this.orthogonalRailEstructure.setmvMatrix(mOrthRail);
		this.rails.addChild(this.orthogonalRailEstructure);

        let curve = new Polyline([[0.5,0,0],[0.5,0.5,0],[-0.5,0.5,0],[-0.5,0,0]],0.5);
		let wheel = new RevolutionSurface(curve,360,"x");
		let mWheels = mat4.create();
		mat4.scale(mWheels,mWheels,[this.railsWheels.width,this.railsWheels.heigth, this.railsWheels.heigth]);

		let wheelXshift =  this.base.width/2 - 2 * this.columns.width;
		let mLWheel = mat4.create();
		mat4.translate(mLWheel,mLWheel,[-wheelXshift,0,0]);
		mat4.multiply(mLWheel, mLWheel, mWheels);

		let mRWheel = mat4.create();
		mat4.translate(mRWheel,mRWheel,[wheelXshift,0,0]);
		mat4.multiply(mRWheel, mRWheel, mWheels);

		this.railsWheels.addChild(new GraphicObject(wheel,mLWheel,this.wheelsMaterial));
		this.railsWheels.addChild(new GraphicObject(wheel,mRWheel,this.wheelsMaterial));
		this.orthogonalRailEstructure.addChild(this.railsWheels);

		this.setupOrthogonalRail();

	}

	setupOrthogonalRail(){
		let railXshift =  this.base.width/2 - 2 * this.columns.width - this.railConnection.width + this.rails.width /2;
		let mRailConnectionScale = mat4.create();
		mat4.scale(mRailConnectionScale,mRailConnectionScale,
			[this.railConnection.width, this.railConnection.heigth, this.railConnection.depth]);
		
		let mLConn = mat4.create();
		mat4.translate(mLConn,mLConn,[railXshift,0, 0]);
		mat4.multiply(mLConn,mLConn,mRailConnectionScale);

		let mRConn = mat4.create();
		mat4.translate(mRConn,mRConn,[-railXshift, 0, 0]);
		mat4.multiply(mRConn,mRConn,mRailConnectionScale);		

		this.connectionAndRail.addChild(new GraphicObject(this.cube,mLConn,this.railsMaterial));
		this.connectionAndRail.addChild(new GraphicObject(this.cube,mRConn,this.railsMaterial));

		let railYshift = - this.railsWheels.heigth/2;
		let mConnAndRail = mat4.create();
		mat4.translate(mConnAndRail,mConnAndRail,[0,railYshift,0]);
		this.connectionAndRail.setmvMatrix(mConnAndRail);
		this.orthogonalRailEstructure.addChild(this.connectionAndRail);

		let mRail = mat4.create();
		mat4.translate(mRail,mRail,[0,-this.orthogonalRail.heigth,0]);
		mat4.scale(mRail,mRail,[this.orthogonalRail.width,this.orthogonalRail.heigth,this.orthogonalRail.depth]);
		
		this.orthogonalRail.setmvMatrix(mRail);
		this.connectionAndRail.addChild(this.orthogonalRail);

		this.setupWheelAndPrinthead();
	}

	setupWheelAndPrinthead(){
		let curve = new Polyline([[0.5,0,0],[0.5,0.5,0],[-0.5,0.5,0],[-0.5,0,0]],0.5);
		let wheel = new RevolutionSurface(curve,360,"x");
		let mWheel = mat4.create();
		mat4.translate(mWheel,mWheel,[0,this.orthogonalRail.heigth + this.railsWheels.heigth/2,0]);
		mat4.rotate(mWheel,mWheel,Math.PI/2, [0,1,0]);
		mat4.scale(mWheel,mWheel,[this.railsWheels.width,this.railsWheels.heigth, this.railsWheels.heigth]);

		this.printHeadWheel = new GraphicObject(wheel, mWheel, this.wheelsMaterial);
		this.wheelAndPrinthead.addChild(this.printHeadWheel);
		this.orthogonalRail.addChild(this.wheelAndPrinthead);

		let frontHolder = mat4.create();
		mat4.translate(frontHolder,frontHolder,[0,-this.railsWheels.heigth/10,this.orthogonalRail.depth/2 + this.printHeadHolder.depth/2]);
		mat4.scale(frontHolder,frontHolder,[this.printHeadHolder.width,this.printHeadHolder.heigth,this.printHeadHolder.depth]);

		let backHolder = mat4.create();
		mat4.translate(backHolder,backHolder,[0,-this.railsWheels.heigth/10,-(this.orthogonalRail.depth/2 + this.printHeadHolder.depth/2)]);
		mat4.scale(backHolder,backHolder,[this.printHeadHolder.width,this.printHeadHolder.heigth,this.printHeadHolder.depth]);

		this.printHeadHolder.addChild(new GraphicObject(this.cube,frontHolder,this.railsMaterial));
		this.printHeadHolder.addChild(new GraphicObject(this.cube,backHolder,this.railsMaterial));
		this.wheelAndPrinthead.addChild(this.printHeadHolder);

		let bulk = mat4.create();
		mat4.translate(bulk,bulk,[0,-this.printHeadBulk.heigth,0]);
		mat4.scale(bulk,bulk,[this.printHeadBulk.width, this.printHeadBulk.heigth, this.printHeadBulk.depth]);
		this.printHeadBulk.setmvMatrix(bulk);
		this.printHeadHolder.addChild(this.printHeadBulk);

		let fcone = new RevolutionSurface(new Polyline([[-this.printerHeadTip.width,0,0],[0,-this.printerHeadTip.heigth,0]],0.1), 50,"y",[0.039,0.473,0.0468]);
		let mcone = mat4.create();
		mat4.scale(mcone,mcone,[1/this.printHeadBulk.width, 1/this.printHeadBulk.heigth, 1/this.printHeadBulk.depth]);
		let cone = new GraphicObject(fcone,mcone,this.railsMaterial);
		this.printHeadBulk.addChild(cone);


	}

	movePrintHead(x){
		if(x){
			//primero muevo todo el conjunto
			let maxPosition = (this.orthogonalRail.width- this.railConnection.width)/2;
			let lastPosition = this.wheelAndPrinthead.xPosition;
			this.wheelAndPrinthead.xPosition = (x>= maxPosition)? maxPosition : (x <= -maxPosition)? -maxPosition: x;
			let deltaX = this.wheelAndPrinthead.xPosition - lastPosition;
			
			let mWPh = mat4.create();
			mat4.translate(mWPh,mWPh,[this.wheelAndPrinthead.xPosition, 0,0]); 
			mat4.scale(mWPh,mWPh,[1/this.orthogonalRail.width,1/this.orthogonalRail.heigth,1/this.orthogonalRail.depth]);
			this.wheelAndPrinthead.setmvMatrix(mWPh);

			//rotación de la rueda
			let wheelRotation = mat4.create();
			mat4.translate(wheelRotation,wheelRotation,[0,this.orthogonalRail.heigth + this.railsWheels.heigth/2,0]);
			if( deltaX > 0){				
				mat4.rotateZ(wheelRotation,wheelRotation,-Math.PI /20);
			}else if(deltaX < 0){
				mat4.rotateZ(wheelRotation,wheelRotation, Math.PI /20);
			}
			mat4.translate(wheelRotation,wheelRotation,[0,-(this.orthogonalRail.heigth + this.railsWheels.heigth/2),0]);
			this.printHeadWheel.multiplymvMatrix(wheelRotation);
		}
	}


	moveRails(y){
		if(y){
			let maxHeigth = this.columns.heigth - this.rails.heigth - this.railsWheels.heigth;
			this.rails.yPosition =	(y >= maxHeigth) ? maxHeigth : (y <= 0)? 0 : y;
	
			let mrails = mat4.create();
			mat4.translate(mrails,mrails,[0,this.rails.yPosition,0]);
			this.rails.setmvMatrix(mrails);

		}
	}

	moveWheels(z){
		if(z){
			let maxPosition = this.base.width/2;
			let lastPosition = this.orthogonalRailEstructure.zPosition ;
			//let mvMatrix = this.railsWheels.mvMatrix;
			let mvMatrix = mat4.create();
			//calculo la posición en z siguiente
			this.orthogonalRailEstructure.zPosition = (z >= maxPosition) ? maxPosition : (z<= -maxPosition)? -maxPosition : z;
			let deltaZ = this.orthogonalRailEstructure.zPosition - lastPosition;

			//traslado en z
			let mEstructure = this.orthogonalRailEstructure.mvMatrix;
			mat4.translate(mEstructure,mEstructure,[0,0,this.orthogonalRailEstructure.zPosition - lastPosition])
			this.orthogonalRailEstructure.setmvMatrix(mEstructure);

			//calculo la rotación del estado siguiente
			if(deltaZ > 0){
				mat4.rotateX(mvMatrix,mvMatrix,Math.PI /20);
			}else if(deltaZ < 0){
				mat4.rotateX(mvMatrix,mvMatrix,- Math.PI /20);
			}
			this.railsWheels.multiplymvMatrix(mvMatrix);

		}
	}

	moveOrthogonalWheel(x){

	}
	move(point){
		this.movePrintHead(point[0]);
		this.moveRails(point[1]);
		this.moveWheels(point[2]);
	}
}