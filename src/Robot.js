class Robot extends GraphicObject{

	constructor(matrix){
		super(undefined,matrix);

		this.initPos = [-3,0.65,3];
		this.initAngle = Math.PI/2;
		this.startPosition = null;
		this.reversePath = [];
		this.reverseAngle = [];
		this.goingForward = true;
		this.waitSignal = true;
		this.initTangent = [1,0,0];
		this.objectTaken = false;
		this.pincer= {
			currentAngle: 0,
			pincerOpened: false
		};
		this.leftPincer;
		this.rightPincer;
		this.currentHeight = 2.9;
		this.currentNeckLength = 2;
		this.dH = 0.02;
		this.initTurningPoints = 100;
		this.turningPoints = 100;
		this.waitingForPrinter = true;
		this.extensionPoints = 25;
		this.initExtensionPoints = 25;
		this.tookObjectSignal = false;
		this.objectToken = false;


		var cylinder = new Cylinder(50,50);
		var bodyProfile = new Polyline([[0,-1,0],[1,-1,0],[1,1,0],[0,1,0]],0.04);
        var rimProfile = new Polyline([[0.1,0,0],[0.1,0.2,0],[0.2,0.3,0],[0,0.3,0],[0.099,0.2,0],[0.099,0,0]],0.01);
        var tireProfile = new Polyline([[0,0.3,0], [0.2,0.3,0],[0.2,0.4,0],[0,0.4,0], [0,0.3,0]], 0.1);
        var tireFormFunc = function(x,y,z){
        	//phi estará entre 0 y 2*PI
        	var rho = Math.sqrt((y*y) + (z*z));
        	var phi = Math.acos(y/rho) ;
        	if(z<0){
        		phi =Math.PI * 2 -phi;
        	}
        	var v = -phi;
        	var u ;

        	if(x === 0){
        		u = (rho - 0.3) * 1.5;
        	}else if(x>0  && x<0.2 && rho > 0.33){
        		u = 0.15 + x /2 *7;
        	}else if(x === 0.2){
        		u = 0.85 + (rho-0.3)*1.5;
        	}else{
        		u = 0;
        	}
        	return [u,v];
        }


		var body = new RevolutionSurface(bodyProfile,160,"y",[0.7,0.1,0.3]);
		var cube = new Cube([0.7,0.1,0.3]);
        var tireForm = new RevolutionSurface(tireProfile,30,"x",undefined,tireFormFunc);
        var rimForm = new RevolutionSurface(rimProfile,30,"x");

		var mainNodeMatrix = mat4.create();
		mat4.translate(mainNodeMatrix,mainNodeMatrix,this.initPos);
		mat4.rotateY(mainNodeMatrix,mainNodeMatrix,this.initAngle);
		

		this.setmvMatrix(mainNodeMatrix);

		var bodyMaterial = new Material();
        bodyMaterial.setColor([1,1,1]);
        bodyMaterial.setSpecular([1,1,1]);
		bodyMaterial.setShininess(10);
		bodyMaterial.setDiffuseMap(textures["metalPintado"]);
		var bodyMatrix = mat4.create();
		mat4.scale(bodyMatrix,bodyMatrix,[0.6,0.4,0.6]);
		var bodyNode = new GraphicObject(body,bodyMatrix,bodyMaterial);
		this.addChild(bodyNode);

		var bodyTopMaterial = new Material();
        bodyTopMaterial.setColor([0.7,0.7,0.7]);
        bodyTopMaterial.setSpecular([1,1,1]);
        bodyTopMaterial.setShininess(10);
		var bodyTopMatrix = mat4.create();
		mat4.translate(bodyTopMatrix,bodyTopMatrix,[0,0.5,0]);
		mat4.scale(bodyTopMatrix,bodyTopMatrix,[0.3,0.1,0.3]);
		var bodyTopNode = new GraphicObject(body,bodyTopMatrix,bodyTopMaterial);
		this.addChild(bodyTopNode);

		//ACA SE ROTA LA PARTE SUPERIOR
		this.topMatrix = mat4.create();
		mat4.translate(this.topMatrix,this.topMatrix,[0,0,0]);
		mat4.rotate(this.topMatrix,this.topMatrix,Math.PI,[0,1,0]);
		mat4.translate(this.topMatrix,this.topMatrix,[0,1,0]);
		var top = new GraphicObject(undefined,this.topMatrix);
		this.addChild(top);

		var neckMaterial = new Material();
        neckMaterial.setColor([0.9,0.9,0.9]);
        neckMaterial.setSpecular([1,1,1]);
		neckMaterial.setShininess(10);
		neckMaterial.setCubemap(textures["cubemap_parque"]);
		this.neckMatrix = mat4.create();
		mat4.scale(this.neckMatrix,this.neckMatrix,[0.15,1,0.15]);
		var neck = new GraphicObject(body,this.neckMatrix,neckMaterial);
		top.addChild(neck);

		this.headNodeMatrix = mat4.create();
		var headNode = new GraphicObject(undefined,this.headNodeMatrix);
		top.addChild(headNode);

		var headMaterial = new Material();
        headMaterial.setColor([0.7,0.7,0.7]);
        headMaterial.setSpecular([1,1,1]);
        headMaterial.setShininess(10);
		var headMatrix = mat4.create();
		mat4.translate(headMatrix,headMatrix,[0,1,0]);
		mat4.scale(headMatrix,headMatrix,[0.5,0.5,0.5]);
		var head = new GraphicObject(cube,headMatrix,headMaterial);
		headNode.addChild(head);

		var headBackMaterial = new Material();
        headBackMaterial.setColor([0.7,0.7,0.7]);
        headBackMaterial.setSpecular([1,1,1]);
        headBackMaterial.setShininess(10);
		var headBackMatrix = mat4.create();
		mat4.translate(headBackMatrix,headBackMatrix,[0,1.25,-0.06]);
		mat4.scale(headBackMatrix,headBackMatrix,[0.2,0.2,0.6]);
		mat4.rotate(headBackMatrix,headBackMatrix,Math.PI/2,[1,0,0]);
		var headBack = new GraphicObject(body,headBackMatrix,headBackMaterial);
		headNode.addChild(headBack);

		this.frontNodeMatrix = mat4.create();
		mat4.translate(this.frontNodeMatrix,this.frontNodeMatrix,[0,1.25,0.2]);
		var frontNode = new GraphicObject(undefined,this.frontNodeMatrix);
		headNode.addChild(frontNode);

		var headFrontMaterial = new Material();
        headFrontMaterial.setColor([0.9,0.9,0.9]);
        headFrontMaterial.setSpecular([1,1,1]);
		headFrontMaterial.setShininess(10);
		headFrontMaterial.setCubemap(textures["cubemap_parque"]);
		var headFrontMatrix = mat4.create();
		mat4.scale(headFrontMatrix,headFrontMatrix,[0.1,0.1,0.8]);
		mat4.rotate(headFrontMatrix,headFrontMatrix,Math.PI/2,[1,0,0]);
		var headFront = new GraphicObject(body,headFrontMatrix,headFrontMaterial);
		frontNode.addChild(headFront);

		this.pincerNodeMatrix = mat4.create();
		mat4.translate(this.pincerNodeMatrix,this.pincerNodeMatrix,[0,-0.1,0.85]);
		this.pincerNode = new GraphicObject(undefined,this.pincerNodeMatrix);
		frontNode.addChild(this.pincerNode);

		this.objectNodeMatrix = mat4.create();
		mat4.translate(this.objectNodeMatrix,this.objectNodeMatrix,[0,-.2,.4]);
		this.objectNode = new GraphicObject(undefined,this.objectNodeMatrix)
		this.pincerNode.addChild(this.objectNode);

		var pincerBackMaterial = new Material();
        pincerBackMaterial.setColor([0.7,0.7,0.7]);
        pincerBackMaterial.setSpecular([1,1,1]);
        pincerBackMaterial.setShininess(10);
		var pincerBackMatrix = mat4.create();
		mat4.scale(pincerBackMatrix,pincerBackMatrix,[0.4,0.2,0.1]);
		var pincerBack = new GraphicObject(cube,pincerBackMatrix,pincerBackMaterial);
		this.pincerNode.addChild(pincerBack);

		var leftArticulationMaterial = new Material();
        leftArticulationMaterial.setColor([0.7,0.7,0.7]);
        leftArticulationMaterial.setSpecular([1,1,1]);
        leftArticulationMaterial.setShininess(10);
		var leftArticulationMatrix = mat4.create();
		mat4.translate(leftArticulationMatrix,leftArticulationMatrix,[0.2,0.1,0.05]);
		mat4.scale(leftArticulationMatrix,leftArticulationMatrix,[0.05,0.1,0.05]);
		var leftArticulation = new GraphicObject(body,leftArticulationMatrix,leftArticulationMaterial);
		this.pincerNode.addChild(leftArticulation);

		var leftPincerMaterial = new Material();
        leftPincerMaterial.setColor([0.7,0.7,0.7]);
        leftPincerMaterial.setSpecular([1,1,1]);
        leftPincerMaterial.setShininess(10);
		var leftPincerMatrix = mat4.create();
		mat4.translate(leftPincerMatrix,leftPincerMatrix,[0,0,5]);
		mat4.scale(leftPincerMatrix,leftPincerMatrix,[1,1,10]);
		this.leftPincer = new GraphicObject(cube,leftPincerMatrix,leftPincerMaterial);
		leftArticulation.addChild(this.leftPincer);

		var rightArticulationMaterial = new Material();
        rightArticulationMaterial.setColor([0.7,0.7,0.7]);
        rightArticulationMaterial.setSpecular([1,1,1]);
        rightArticulationMaterial.setShininess(10);
		var rightArticulationMatrix = mat4.create();
		mat4.translate(rightArticulationMatrix,rightArticulationMatrix,[-0.2,0.1,0.05]);
		mat4.scale(rightArticulationMatrix,rightArticulationMatrix,[0.05,0.1,0.05]);
		var rightArticulation = new GraphicObject(body,rightArticulationMatrix,rightArticulationMaterial);
		this.pincerNode.addChild(rightArticulation);

		var rightPincerMaterial = new Material();
        rightPincerMaterial.setColor([0.7,0.7,0.7]);
        rightPincerMaterial.setSpecular([1,1,1]);
        rightPincerMaterial.setShininess(10);
		var rightPincerMatrix = mat4.create();
		mat4.translate(rightPincerMatrix,rightPincerMatrix,[0,0,5]);
		mat4.scale(rightPincerMatrix,rightPincerMatrix,[1,1,10]);
		this.rightPincer = new GraphicObject(cube,rightPincerMatrix,rightPincerMaterial);
		rightArticulation.addChild(this.rightPincer);

		var wheelsAxisMatrix = mat4.create();
		mat4.translate(wheelsAxisMatrix,wheelsAxisMatrix,[0,-0.25,0]);
		this.wheelsAxis = new GraphicObject(undefined,wheelsAxisMatrix);
		this.addChild(this.wheelsAxis);


		// RUEDA 2.0
		let tireMaterial = new Material();
        tireMaterial.setColor([0.1,0.1,0.1]);
        tireMaterial.setSpecular([.1,.1,.1]);
		tireMaterial.setShininess(0.1);
		tireMaterial.setNormalMap(textures["cubierta_normal"]);
        var tireMatrix =  mat4.create();
        var tire = new GraphicObject(tireForm,tireMatrix, tireMaterial);
        

        //llanta
        var rimMatrix = mat4.create();
        var rimMaterial = new Material();
        rimMaterial.setColor([0.9,0.9,0.9]);
        rimMaterial.setSpecular([1,1,1]);
		rimMaterial.setShininess(10);
		rimMaterial.setCubemap(textures["cubemap_parque"]);
        var rim = new GraphicObject(rimForm,rimMatrix,rimMaterial);

		var leftWheelMatrix = mat4.create();
		mat4.translate(leftWheelMatrix,leftWheelMatrix,[0.6,0,0]);
		mat4.rotate(leftWheelMatrix,leftWheelMatrix,Math.PI/2,[0,0,0]);
		mat4.scale(leftWheelMatrix,leftWheelMatrix,[1,1,1]);
		var leftWheel = new GraphicObject(undefined,leftWheelMatrix);
		leftWheel.addChild(rim);
        leftWheel.addChild(tire);
		this.wheelsAxis.addChild(leftWheel);

		var rightWheelMatrix = mat4.create();
		mat4.translate(rightWheelMatrix,rightWheelMatrix,[-0.6,0,0]);
		mat4.rotate(rightWheelMatrix,rightWheelMatrix,Math.PI,[0,0,1]);
		mat4.scale(rightWheelMatrix,rightWheelMatrix,[1,1,1]);
		var rightWheel = new GraphicObject(undefined,rightWheelMatrix);
		var rightWheel = new GraphicObject(undefined,rightWheelMatrix);
		rightWheel.addChild(rim);
        rightWheel.addChild(tire);

		this.wheelsAxis.addChild(rightWheel);
	}

	move(path){
		if(this.waitSignal){
			//si no espera, y no debe avanzar, es porque está en el estante dejando el objeto
			if(!this.goingForward){
				if(this.riseDone){
					this.tookObjectSignal = true;
					this.openPincer();
					if(this.pincer.pincerOpened){
						this.partitionSelected.addObject(this.objectNode.children[0]);
						this.objectNode.children = [];
						this.waitSignal = false;
						this.riseDone = false;
					}
				}else{
					this.rise(this.partitionSelected.row + 0.7);
				}
			}else {

			}
		}
		else{
			if(this.goingForward){
				this.goForward(path);
			}else{
				this.goBackward(path);
			}
		}
	}

	goForward(path){
		if(this.turningPoints>0){
			this.turningPoints--;
			this.turnToShelf();
		}

		else{

		if(this.startPosition == null){
			this.startPosition = [path.position[0],path.position[1],path.position[2]];
		}

		var nextX = path.position.shift();
		var nextXTan = path.tangent.shift();
		this.reversePath.push(nextX);
		var nextY = path.position.shift();
		var nextYTan = path.tangent.shift();
		this.reversePath.push(nextY);
		var nextZ = path.position.shift();
		var nextZTan = path.tangent.shift();
		this.reversePath.push(nextZ);

		mat4.rotateX(this.wheelsAxis.mvMatrix,this.wheelsAxis.mvMatrix,Math.PI/30);

		var angle = vec3.angle(this.initTangent,[nextXTan,nextYTan,nextZTan]);
		this.reverseAngle.push(angle);
		vec3.rotateY(this.initTangent,this.initTangent,[0,0,0],angle);

		var matrix = mat4.create();
		mat4.copy(matrix, this.mvMatrix);
		mat4.rotateY(matrix,matrix,angle);
		matrix[12] = nextX;
		matrix[14] = nextZ;
		this.setmvMatrix(matrix);

		if(path.position.length == 0){
			this.startPosition = [nextX,nextY,nextZ];
			this.goingForward = false;
			this.wait();

		}

		}
	}

	goBackward(path){
		if(this.turningPoints<this.initTurningPoints){
			this.turningPoints++;
			this.turnToPrinter();
		}


		else{
		this.closePincer();
		this.rise(1.7);
		var nextZ = this.reversePath.pop();
		var nextY = this.reversePath.pop();
		var nextX = this.reversePath.pop();

		var angle = this.reverseAngle.pop();

		path.position.unshift(nextZ);
		path.position.unshift(nextY);
		path.position.unshift(nextX);

		mat4.rotateX(this.wheelsAxis.mvMatrix,this.wheelsAxis.mvMatrix,-Math.PI/30);

		var matrix = mat4.create();
		mat4.copy(matrix, this.mvMatrix);
		mat4.rotateY(matrix,matrix,-angle);
		matrix[12] = nextX;
		matrix[14] = nextZ;
		this.setmvMatrix(matrix);

		if(this.reversePath.length == 0){
			this.startPosition = null;
			this.goingForward = true;
			this.waitSignal = true;
			this.objectTaken = false;
			this.printingDone = false;
			this.riseDone = false;
			this.initTangent = [1,0,0];
			control.printingDone = false;
		}

		}
	}

	rise(h){
		var dL = this.dH*this.currentNeckLength;
		if(this.currentHeight < 0.99*h){
			mat4.scale(this.neckMatrix,this.neckMatrix,[1,1+this.dH,1]);
			mat4.translate(this.headNodeMatrix,this.headNodeMatrix,[0,dL/2,0]);
			mat4.translate(this.topMatrix,this.topMatrix,[0,dL/2,0]);
			this.currentNeckLength = this.currentNeckLength*(1+this.dH);
			this.currentHeight += dL;
		}else if(this.currentHeight >= 1.01*h){
			mat4.translate(this.topMatrix,this.topMatrix,[0,-dL/2,0]);
			mat4.translate(this.headNodeMatrix,this.headNodeMatrix,[0,-dL/2,0]);
			mat4.scale(this.neckMatrix,this.neckMatrix,[1,1-this.dH,1]);
			this.currentNeckLength = this.currentNeckLength*(1-this.dH);
			this.currentHeight -= dL;
		}
		if(this.currentHeight <= 1.01*h && this.currentHeight>= 0.99*h){
			this.riseDone = true;
		}
	}

	openPincer(){
		let rotationAngle = Math.PI/60;
		this.pincer.currentAngle += rotationAngle;
		if(this.pincer.currentAngle <= Math.PI/2){
			let m = mat4.create();
			mat4.rotateY(m,m, rotationAngle);
			this.leftPincer.multiplymvMatrix(m);

			m = mat4.create();
			mat4.rotateY(m,m, -rotationAngle);
			this.rightPincer.multiplymvMatrix(m);

		}else{
			this.pincer.currentAngle = Math.PI/2;
			this.pincer.pincerOpened = true;
		}

	}

	closePincer(){
		let rotationAngle = Math.PI/60;
		this.pincer.currentAngle -= rotationAngle;
		if(this.pincer.currentAngle >= 0){
			let m = mat4.create();
			mat4.rotateY(m,m, -rotationAngle);
			this.leftPincer.multiplymvMatrix(m);

			m = mat4.create();
			mat4.rotateY(m,m, rotationAngle);
			this.rightPincer.multiplymvMatrix(m);
		}else {
			this.pincer.currentAngle = 0;
			this.pincer.pincerOpened = false;
		}
	}

	wait(){
		this.waitSignal = true;
	}

	go(){
		this.waitSignal = false;
	}

	turnToShelf(){
		mat4.rotate(this.topMatrix,this.topMatrix,-Math.PI/this.initTurningPoints,[0,1,0]);
	}

	turnToPrinter(){
		mat4.rotate(this.topMatrix,this.topMatrix,Math.PI/this.initTurningPoints,[0,1,0]);
	}

	setObject(obj){
		this.objectNode.addChild(obj);
	}

	waitForPrinter(){
		this.waitingForPrinter = true;
	}

	dontWaitForPrinter(){
		this.waitingForPrinter = false;
	}

	tookObject(){
		if(this.extensionPoints > 0){
			mat4.translate(this.frontNodeMatrix,this.frontNodeMatrix,[0,0,0.45*1/this.initExtensionPoints]);
			this.extensionPoints--;
		}else{
			this.objectToken = true;
		}
	}

	retract(){
		if(this.extensionPoints < this.initExtensionPoints){
			mat4.translate(this.frontNodeMatrix,this.frontNodeMatrix,[0,0,-0.45*1/this.initExtensionPoints]);
			this.extensionPoints++;
		}else{
			this.tookObjectSignal = false;
			this.objectToken = false;
			this.waitingForPrinter = false;
		}
	}

}
