class Scene {
	//Crea la escena, setea la referencia al gl y al programa, crea una perspectiva y guarda la
	//localización de las variables uniformes que utiliza
	constructor(){
        //Acá se setearán los objetos del tp, piso, estanteria, robot, etc
        this.floor = null;
        this.shelf = null;
        this.printer = null;
        this.robot = null;
        this.robotPath = null;
        this.printedObject = [];
        this.printingVelocity = 0.01;
        this.movePrinter = {
            curve: null,
            printerStart: 1.25,
            printerLevel: [],
            goToOrigin: false,
            done: false
        };

        this.children = [];
        this.camera = new Camera();
        this.pMatrix = mat4.create();
        this.nMatrix = mat3.create();

        this.columnsControlPoints = [
        [[-3,0,3],[-2.7,0,3],[-2.7,0,0],[-2.7,0,-3]],
        [[-3,0,3],[-1.5,0,3],[-1.6,0,0],[-1.6,0,-3]],
        [[-3,0,3],[-0.5,0,3],[-0.5,0,0],[-0.5,0,-3]],
        [[-3,0,3],[0.5,0,3],[0.5,0,0],[0.5,0,-3]],
        [[-3,0,3],[1.6,0,3],[1.6,0,0],[1.6,0,-3]],
        [[-3,0,3],[2.6,0,3],[2.6,0,0],[2.6,0,-3]]
        ];

        this.extrusionCountoursControlPoints = [
        [//CONTORNO DE LA ESTRELLA B1
        [0,1,0],[0.25,0.6,0],[0.5,0.5,0],[1,0.5,0],[0.7,0.3,0],[0.7,-0.3,0],[1,-.5,0],[0.5,-0.5,0],[0.25,-0.6,0],[0,-1,0],
        [-0.25,-0.6,0],[-0.5,-0.5,0],[-1,-.5,0],[-0.7,-0.3,0],[-0.7,0.3,0],[-1,0.5,0],[-0.5,0.5,0],[-0.25,0.6,0],[0,1,0]
        ],

        [//CONTORNO FORMA B2
        [-.2,1,0],[-.15,0.8,0],[0.15,.8,0],[0.2,1,0],[.35,.95,0],[.45,.9,0],[.6,.8,0],[.5,.6,0],[.65,.45,0],[.9,.5,0],
        [.95,.4,0],[.97,.3,0],[1,.2,0],[.8,.15,0],[.8,-.15,0],[1,-.2,0],[.97,-.3,0],[.95,-.4,0],[.9,-.5,0],[.65,-.45,0],
        [.5,-.6,0],[.6,-.8,0],[.45,-.9,0],[.35,-.95,0],[0.2,-1,0],[0.15,-.8,0],[-.15,-0.8,0],[-.2,-1,0],[-.35,-.95,0],
        [-.45,-.9,0],[-.6,-.8,0],[-.5,-.6,0],[-.65,-.45,0],[-.9,-.5,0],[-.95,-.4,0],[-.97,-.3,0],[-1,-.2,0],[-.8,-.15,0],
        [-.8,.15,0],[-1,.2,0],[-.97,.3,0],[-.95,.4,0],[-.9,.5,0],[-.65,.45,0],[-.5,.6,0],[-.6,.8,0],[-.45,.9,0],[-.35,.95,0],
        [-.2,1,0]
        ],

        [//CONTORNO FORMA B3
        [-0.5,0.5,0],[-.5,1,0],[.5,1,0],[.5,.5,0],[.5,.25,0],[.5,-.25,0],[.5,-.5,0],[.5,-1,0],[-.5,-1,0],[-.5,-.5,0],[-.5,-.25,0],
        [-.5,.25,0],[-.5,.5,0]
        ]
        
        ];

        this.revolutionCountoursControlPoints = [
        [// CONTORNO JARRON A1
        [0,0,0],[0.5,0,0],[0.5,0.3,0],[0.35,0.8,0],[0.27,1.05,0],[0.14,1.23,0],[0.2,1.45,0],[0.26,1.67,0],[0.5,1.85,0],
        [0.4,1.9,0],[0.3,1.95,0],[0.3,1.97,0],[0.29,2,0]
        ],

        [//CONTORNO A2
        [-.4,2,0],[-.4,1.9,0],[-.4,1.8,0],[-.5,1.8,0],[-.6,1.8,0],[-1,1.7,0],[-1,1.6,0],[-1,1.4,0],[-1,1.3,0],[-1,1.2,0],[-1,1.1,0],[-1,.9,0],
        [-1,.9,0],[-1,.7,0],[-.5,.6,0],[-.2,.5,0],[-.2,.45,0],[-.2,.4,0],[-.2,.35,0],[-1,0,0],[-1,0,0],[-1,0,0],[-.66,0,0],
        [-.33,0,0],[0,0,0]
        ],

        [//CONTORNO A3
        [0,2,0],[-.33,2,0],[-.66,2,0],[-1,2,0],[-1,1.7,0],[-.8,1.7,0],[-.8,1.7,0],[-.8,1.7,0],[.4,1.6,0],[-.2,1.5,0],[-.8,1.4,0],[-.8,.6,0],
        [-.2,.5,0],[.4,.5,0],[-.8,.3,0],[-.8,.3,0],[-.8,.3,0],[-1,.3,0],[-1,0,0],[-.66,0,0],[-.33,0,0],[0,0,0]
        ]

        ];

        this.radiusProfileControlPoints = [
        [
        [1,0,0],[1,.15,0],[.74,.13,0],[.7,.3,0],[.68,.385,0],[.68,.615,0],[.7,.7,0],[.74,.87,0],[1,.85,0],[1,1,0]
        ],

        [
        [1,0,0],[.97,.5,0],[.84,.83,0],[.58,1,0]
        ],
        
        [
        [1,1,0],[1,1,0],[0.2,0.5,0],[0.2,0.5,0],[0.2,0.5,0],[1,0,0],[1,0,0]
        ]
        ];

        this.revolutionCountoursControlPoints[1].reverse();
        for(var i = 0; i < this.revolutionCountoursControlPoints[1].length; i++) {
            this.revolutionCountoursControlPoints[1][i][0] *= -1;
        }
        this.revolutionCountoursControlPoints[2].reverse();
        for(var i = 0; i < this.revolutionCountoursControlPoints[2].length; i++) {
            this.revolutionCountoursControlPoints[2][i][0] *= -1;
        }

        for(var j = 0; j<this.revolutionCountoursControlPoints.length; j++) {
            for(var i = 0; i < this.revolutionCountoursControlPoints[j].length; i++) {
                this.revolutionCountoursControlPoints[j][i][0] *= 0.4;
                this.revolutionCountoursControlPoints[j][i][1] *= 0.4;
                this.revolutionCountoursControlPoints[j][i][2] *= 0.4;
            }
        }
        
        for(var j = 0; j<this.extrusionCountoursControlPoints.length; j++) {
            for(var i = 0; i < this.extrusionCountoursControlPoints[j].length; i++) {
                this.extrusionCountoursControlPoints[j][i][0] *= 0.3;
                this.extrusionCountoursControlPoints[j][i][1] *= 0.3;
                this.extrusionCountoursControlPoints[j][i][2] *= 0.7;
            }
        }

        this.uniformProjectionMatrixLocation = gl.getUniformLocation(program, "uPMatrix");

        this.uniformLightPositions = [];
        this.uniformLightKd = [];
        this.uniformLightKa = [];
        this.uniformLightKs = [];
        this.uniformLightIntensities = [];
        for(var i = 0; i<4; i++) {
            this.uniformLightPositions.push(gl.getUniformLocation(program, "uLights[" + i + "].position"));
            this.uniformLightKd.push(gl.getUniformLocation(program, "uLights[" + i + "].kd"));
            this.uniformLightKa.push(gl.getUniformLocation(program, "uLights[" + i + "].ka"));
            this.uniformLightKs.push(gl.getUniformLocation(program, "uLights[" + i + "].ks"));
            this.uniformLightIntensities.push(gl.getUniformLocation(program, "uLights[" + i + "].intensity"));
        }

        this.uniformUseLighting = gl.getUniformLocation(program, "uUseLighting");

        this.uniformCameraPos = gl.getUniformLocation(program, "uCameraPos");

        this.lights = {
            
            position: [
                [7, 7, 7],
                [-7, 7, 7],
                [-7, 7, -7],
                [7, 7, -7]
            ],
            kd: [
                [1, 1, 1],
                [1, 1, 1],
                [1, 1, 1],
                [1, 1, 1]
            ],
            ks: [
                [1, 1, 1],
                [1, 1, 1],
                [1, 1, 1],
                [1, 1, 1]
            ]

        }

        let canvas = document.getElementById('my_canvas'),
        body = document.getElementsByTagName('body')[0];

        this.camera.handlersConfig(body, canvas);
        
        this.setupScene();
    }
    //Agrega un hijo, que puede ser un GridObject u otro Node3d
    addChild(child){
        this.children.push(child);
    }

    //borra el dibujo anterior, bindea la matriz de proyección y de luz y grafica los hijos
    drawScene(){
        var m = mat4.create();
        mat4.rotate(m,m,0.01,[0,0,1]);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        // Preparamos una matriz de perspectiva.
        mat4.perspective(this.pMatrix, 45, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 200);

        gl.uniformMatrix4fv(this.uniformProjectionMatrixLocation, false, this.pMatrix);

        for(var i = 0; i<this.lights.position.length; i++) {
            var uniform = "this.uniformLight" + i;
            var lightPosition = vec3.create();
            vec3.transformMat4(lightPosition, this.lights.position[i], this.camera.getmvMatrix());
            gl.uniform3fv(this.uniformLightPositions[i], lightPosition);
            gl.uniform3fv(this.uniformLightKd[i], this.lights.kd[i]);
            var lightKa = vec3.create();
            vec3.scale(lightKa, this.lights.kd[i], 1/3);
            gl.uniform3fv(this.uniformLightKa[i], lightKa);
            gl.uniform3fv(this.uniformLightKs[i], this.lights.ks[i]);
            gl.uniform1f(this.uniformLightIntensities[i], eval("control.lightIntensity" + (i + 1)));// [control.lightIntensity1, control.lightIntensity2, control.lightIntensity3, control.lightIntensity4]);
        }

        gl.uniform1i(this.uniformUseLighting, true);

        gl.uniform3fv(this.uniformCameraPos, this.camera.getPosition());

 		this.children.forEach(function(child){
            //child.multiplymvMatrix(a)
            if(this.mode === "orbital") {
                this.orbitalCameraSetCenter();
                this.mvMatrix = this.getmvMatrix();
            }
            child.draw(this.mvMatrix);
 		},this.camera);
    }

    setupScene(){
        var materialFloor = new Material();
        materialFloor.setColor([0.7,0.7,0.7]);
        materialFloor.setSpecular([1,1,1]);
        materialFloor.setShininess(10);
        materialFloor.setDiffuseMap(textures["baldosaSquare"]);
        materialFloor.setDiffuseMapIntensity(1);
        materialFloor.setNormalMap(textures["baldosaSquare_normal"]);
        var mFloor = mat4.create();
        mat4.rotate(mFloor,mFloor,-Math.PI/2, [1,0,0]);
        mat4.scale(mFloor,mFloor,[10,10,1]);
        this.floor = new GraphicObject(new Plane(4,4), mFloor, materialFloor);
        this.addChild(this.floor);

        var materialShelf = new Material();
        materialShelf.setColor([0.88,0.24,0.82]);
        materialShelf.setSpecular([1,1,1]);
        materialShelf.setShininess(10);
        materialShelf.setDiffuseMap(textures["parquet"]);
        materialShelf.setDiffuseMapIntensity(1);
        materialShelf.setNormalMap(textures["parquet_normal"]);
        var mShelf = mat4.create();
        mat4.translate(mShelf,mShelf,[0,0,-5]);
        this.shelf = new Shelf(mShelf, materialShelf);
        this.addChild(this.shelf);

        var mRobot = mat4.create();
        mat4.translate(mRobot,mRobot,mat4.create());
       	this.robot = new Robot(mRobot);
       	this.addChild(this.robot);

        var mPrinter = mat4.create();
  		mat4.translate(mPrinter,mPrinter,[-5,0,3]);
        this.printer = new Printer(mPrinter);
        this.addChild(this.printer);

        var mmaterials = new Material();
        mmaterials.setColor([1,1,1]);
        mmaterials.setSpecular([1,1,1]);
        mmaterials.setShininess(10);
        // mmaterials.setDiffuseMap(textures["parquet"]);
        // mmaterials.setNormalMap(textures["parquet_normal"]);
        // mmaterials.setCubemap(textures["cubemap_parque"]);
        // let s = new Sphere(20, 20);
        // let ms = mat4.create();
        // let os = new GraphicObject(s, ms, mmaterials);
        // this.addChild(os);

        var mSceneCenter = mat4.create();
        var sceneCenter = new GraphicObject(undefined, mSceneCenter);
        this.camera.orbitalCameraConfig([sceneCenter, this.printer, this.shelf, this.robot], [[0, 0, 0], [0, 1.75, 0], [0, 2.15, 0], [0, 1.8, 0]]);
    }	

    animate(){

        if(this.robot.tookObjectSignal && !this.robot.objectToken){
            this.robot.tookObject();
        }
        if(this.robot.tookObjectSignal && this.robot.objectToken){
            this.robot.retract();
        }
        
        if(control.printFlag) {
            
            var printedObjectMaterial = new Material();
            var kd = vec3.create();
            var ks = vec3.create();
            vec3.scale(kd, control.kd, 1/255);
            vec3.scale(ks, control.ks, 1/255);
            printedObjectMaterial.setColor(kd);
            printedObjectMaterial.setSpecular(ks);
            printedObjectMaterial.setShininess(control.shininess);
            printedObjectMaterial.setDiffuseMap(control.objectToPrint.texture.diffuseMap);
            printedObjectMaterial.setDiffuseMapIntensity(control.diffuseMapIntensity);
            printedObjectMaterial.setNormalMap(control.objectToPrint.texture.normalMap);

            var mPrintedObject = mat4.create();
            
            if(control.objectToPrint.revolution.draw) {

                var printedModel = new RevolutionSurface(new Curve(this.revolutionCountoursControlPoints[control.objectToPrint.revolution.curve], 0.1, "bezier"), 30, "y", [0.8, 0.8, 0.8]);

                this.movePrinter.curve = new RevolutionSurface(new Curve(this.revolutionCountoursControlPoints[control.objectToPrint.revolution.curve], 0.1, "bezier"), 30, "y", [0.8, 0.8, 0.8]);

            } else if(control.objectToPrint.extrusion.draw) {

                if(control.objectToPrint.extrusion.radiusProfile !== undefined) {
                    var radiusProfileCurve = new Curve(this.radiusProfileControlPoints[control.objectToPrint.extrusion.radiusProfile],0.1,"bezier");
                } else {
                    var radiusProfileCurve = undefined;
                }

                var printedModel = new Extrusion(new Curve(this.extrusionCountoursControlPoints[control.objectToPrint.extrusion.curve],0.1,"bezier"),0.7,20,[0.5, 0.5, 0.5],control.torsionAngle,radiusProfileCurve);

                this.movePrinter.curve = new Extrusion(new Curve(this.extrusionCountoursControlPoints[control.objectToPrint.extrusion.curve],0.1,"bezier"),0.7,20,[0.5, 0.5, 0.5],control.torsionAngle,radiusProfileCurve);

            }

            this.printedObject.push(new GraphicObject(printedModel,mPrintedObject,printedObjectMaterial));
            this.idxPrintedObject = this.printedObject.length -1;
            this.printer.columns.addChild(this.printedObject[this.idxPrintedObject]);
            
            this.printedObject[this.idxPrintedObject].setDiscardLevel(0.0);

            this.movePrinter.done = false;
            
            control.printFlag = false;
            control.printing = true;
        
        }

        if(control.printing) {
            
            if(this.movePrinter.curve.position.length > 0) {
                
                if(this.movePrinter.done && this.printedObject[this.idxPrintedObject].discardLevel < 2.0) {

                    this.movePrinter.printerLevel = [this.movePrinter.curve.position[0],this.movePrinter.curve.position[1], this.movePrinter.curve.position[2]];
                    this.movePrinter.done = false;

                    this.printedObject[this.idxPrintedObject].setDiscardLevel(this.movePrinter.curve.position[1]);
                
                } else {

                    if(this.movePrinter.printerLevel[1] === this.movePrinter.curve.position[1]) {
                        var moveLevel = [this.movePrinter.curve.position.shift(),this.movePrinter.curve.position.shift(), this.movePrinter.curve.position.shift()];
                        this.printer.move([moveLevel[0], moveLevel[1] , moveLevel[2]]);
                        this.movePrinter.printerLevel = moveLevel;
                    } else {
                        this.movePrinter.done = true;
                    }
            
                }

            } else {
                control.printing = false;
                this.robot.partitionSelected = this.shelf.getFreePartition();
                console.log(this.robot.partitionSelected);
              	this.robotPath = new Curve(this.columnsControlPoints[this.robot.partitionSelected.column - 1],0.01,"bezier");
	        	//this.addChild(new GraphicObject(this.robotPath,mat4.create()));
	        	control.printingDone = true;
                this.robot.go();
            }

        }

        if(this.movePrinter.goToOrigin && !this.movePrinter.done) {
            if(this.movePrinter.curve.position.length > 0) {
                var moveLevel = [this.movePrinter.curve.position.shift(),this.movePrinter.curve.position.shift(), this.movePrinter.curve.position.shift()];
                this.printer.move(moveLevel);
                this.movePrinter.printerLevel = moveLevel;
            } else {
                this.movePrinter.goToOrigin = false;
                this.movePrinter.done = true;
            }
        }

        if(control.printingDone){
   	        if(this.robot.goingForward && !this.robot.objectTaken && !this.robot.riseDone){
	   	        this.robot.rise(1.7);
    	    }
        	if(this.robot.riseDone && !this.robot.objectTaken){
        		if(this.robot.pincer.pincerOpened){
                	this.robot.closePincer();
                	if(!this.robot.pincer.pincerOpened){
    					this.printer.columns.children.splice(this.printer.children.indexOf(this.printedObject[this.idxPrintedObject]),1);
	            	    this.robot.setObject(this.printedObject[this.idxPrintedObject]);
                		this.robot.objectTaken = true;
                	}
				}else {
					this.robot.openPincer();
                    this.robot.tookObjectSignal = true;
				}
			}
			if(this.robot.objectTaken){
                this.movePrinter.curve = new Polyline([this.movePrinter.printerLevel, [0,0,0]],0.01);
                this.movePrinter.goToOrigin = true;
                this.movePrinter.done = false;
				if(!this.robot.waitSignal){
					this.robot.riseDone = false;

				}
	    	    this.robot.move(this.robotPath);
			}
        }
        
    }

}
