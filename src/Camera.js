class Camera{
	constructor(){
		this.mvMatrix = mat4.create();
		this.mode = null;
		this.radiusShift = 0.2;

		this.mouse = {
			lastXPosition : 0.0,
			lastYPosition : 0.0,
			isClick : false,
			velocityFactor: 0.005
        }

		this.orbitalCamera = {
			center: [0.0 ,0.0,0.0],
			radius: 20.0,
			alpha: 0.0,
			beta: Math.PI/3.0,
            position: [0.0,0.0,0.0],
            spottedObject: {
                object: null,
                offset: []
            },
            spots: {
                objects: [],
                offsets: []
            },
			up: [0.0,1.0,0.0]
        }
        
        this.firstPersonCamera = {
            position: [0.0, -5.0, -15.0],
            alpha: 0.0,
            beta: 0.0
        }
	}

	handlersConfig(body,canvas) {
		////console.log(body,canvas);
		body.addEventListener("keydown", this.cameraOnKeyDown.bind(this), false);
        body.addEventListener("mouseup", this.cameraOnMouseUp.bind(this), false);
        canvas.addEventListener("mousedown", this.cameraOnMouseDown.bind(this), false);
        canvas.addEventListener("mousemove", this.cameraOnMouseMove.bind(this), false);
        canvas.addEventListener("wheel", this.cameraOnWheel.bind(this), false);

	}

	orbitalCameraConfig(orbitalCameraObjectsToSpot, orbitalCameraObjectsToSpotOffsets){

        this.mode = "orbital";
        this.orbitalCamera.spots.objects = orbitalCameraObjectsToSpot;
        this.orbitalCamera.spots.offsets = orbitalCameraObjectsToSpotOffsets;
        this.orbitalCamera.spottedObject.object = this.orbitalCamera.spots.objects[0];
        this.orbitalCamera.spottedObject.offset = this.orbitalCamera.spots.offsets[0];
        this.orbitalCameraSetCenter();
		this.mvMatrix = this.getmvMatrix();
    }
    
    orbitalCameraSetCenter() {
        var viewMatrix = this.orbitalCamera.spottedObject.object.mvMatrix;
        this.orbitalCamera.center = [viewMatrix[12], viewMatrix[13], viewMatrix[14]];
        vec3.add(this.orbitalCamera.center, this.orbitalCamera.center, this.orbitalCamera.spottedObject.offset);
    }

	firstPersonCameraConfig(){
		this.mode = "first_person";
		this.mvMatrix = this.getmvMatrix();
	}

	cameraOnKeyDown(e) {
        
        switch (e.keyCode) {

            case 107:		// '+'
                if(this.mode === "orbital") {
                    this.orbitalCamera.radius -= this.radiusShift;
                    if (this.orbitalCamera.radius < 0) {
                        this.orbitalCamera.radius = 0;
                    }
                    this.mvMatrix = this.getmvMatrix();
                }
                break;

            case 109:		// '-'
                if(this.mode === "orbital") {
                    this.orbitalCamera.radius += this.radiusShift;
                    if (this.orbitalCamera.radius < 0) {
                        this.orbitalCamera.radius = 0;
                    }
                    this.mvMatrix = this.getmvMatrix();
                }
                break;

            case 49:		// '1'
                this.mode = "orbital";
                this.orbitalCamera.spottedObject.object = this.orbitalCamera.spots.objects[0];
                this.orbitalCamera.spottedObject.offset = this.orbitalCamera.spots.offsets[0];
                this.orbitalCameraSetCenter();
                this.mvMatrix = this.getmvMatrix();
                break;

            case 50:		// '2'
                this.mode = "orbital";
                this.orbitalCamera.spottedObject.object = this.orbitalCamera.spots.objects[1];
                this.orbitalCamera.spottedObject.offset = this.orbitalCamera.spots.offsets[1];
                this.orbitalCameraSetCenter();
                this.mvMatrix = this.getmvMatrix();
                break;

            case 51:		// '3'
                this.mode = "orbital";
                this.orbitalCamera.spottedObject.object = this.orbitalCamera.spots.objects[2];
                this.orbitalCamera.spottedObject.offset = this.orbitalCamera.spots.offsets[2];
                this.orbitalCameraSetCenter();
                this.mvMatrix = this.getmvMatrix();
                break;

            case 52:		// '4'
                this.mode = "orbital";
                this.orbitalCamera.spottedObject.object = this.orbitalCamera.spots.objects[3];
                this.orbitalCamera.spottedObject.offset = this.orbitalCamera.spots.offsets[3];
                this.orbitalCamera.radius = 5;
                this.orbitalCameraSetCenter();
                this.mvMatrix = this.getmvMatrix();
                break;

            case 53:		// '5'
                if(this.mode === "orbital") {
                    this.firstPersonCameraConfig();
                }
                break;

                case 87:
                case 38:			// 'W' o 'ArrowUp'
                    this.firstPersonCamera.position[2] += Math.cos(this.firstPersonCamera.alpha) * control.velocityFactor/10;
                    this.firstPersonCamera.position[0] += Math.sin(this.firstPersonCamera.alpha) * control.velocityFactor/10;
                    this.mvMatrix = this.getmvMatrix();
                    break;
    
                case 65:
                case 37:			// 'A' o 'ArrowLeft'
                    this.firstPersonCamera.position[2] += Math.cos(this.firstPersonCamera.alpha + Math.PI/2) * control.velocityFactor/10;
                    this.firstPersonCamera.position[0] += Math.sin(this.firstPersonCamera.alpha + Math.PI/2) * control.velocityFactor/10;
                    this.mvMatrix = this.getmvMatrix();
                    break;
    
                case 83:
                case 40:			// 'S' o 'ArrowDown'
                    this.firstPersonCamera.position[2] -= Math.cos(this.firstPersonCamera.alpha) * control.velocityFactor/10;
                    this.firstPersonCamera.position[0] -= Math.sin(this.firstPersonCamera.alpha) * control.velocityFactor/10;
                    this.mvMatrix = this.getmvMatrix();
                    break;
    
                case 68:
                case 39:			// 'D' o 'ArrowRight'
                    this.firstPersonCamera.position[2] += Math.cos(this.firstPersonCamera.alpha - Math.PI/2) * control.velocityFactor/10;
                    this.firstPersonCamera.position[0] += Math.sin(this.firstPersonCamera.alpha - Math.PI/2) * control.velocityFactor/10;
                    this.mvMatrix = this.getmvMatrix();
                    break;
    
                case 81:			// 'Q'
                    this.firstPersonCamera.position[1] -= control.velocityFactor/10;
                    this.mvMatrix = this.getmvMatrix();
                    break;

                case 69:			// 'E'
                    this.firstPersonCamera.position[1] += control.velocityFactor/10;
                    this.mvMatrix = this.getmvMatrix();
                    break;

        }

    }

    cameraOnMouseDown(event){

        if(this.mode === "orbital") {
            this.mouse.lastXPosition = event.clientX;
            this.mouse.lastYPosition = event.clientY;

            this.mouse.isClick = true;
        }

    }

    cameraOnMouseMove(e) {

        if(this.mode === "orbital" && this.mouse.isClick) {

            var newXPosition = e.clientX, 
            	newYPosition = e.clientY;
            
            var deltaX = newXPosition - this.mouse.lastXPosition, 
            	deltaY = newYPosition - this.mouse.lastYPosition;

            this.orbitalCamera.alpha -= deltaX * this.mouse.velocityFactor;
            var beta = this.orbitalCamera.beta - deltaY * this.mouse.velocityFactor;
    
            if (beta > 0 && beta < Math.PI) {
                this.orbitalCamera.beta = beta;
            }

            this.mouse.lastXPosition = newXPosition; 
            this.mouse.lastYPosition = newYPosition;

            this.mvMatrix = this.getmvMatrix();
            //console.log(this);
        } else if(this.mode === "first_person") {
            
            var newXPosition = e.clientX, newYPosition = e.clientY;
            
            var deltaX = newXPosition - this.mouse.lastXPosition, deltaY = newYPosition - this.mouse.lastYPosition;

            this.firstPersonCamera.alpha -= deltaX * this.mouse.velocityFactor;
            var beta = this.firstPersonCamera.beta - deltaY * this.mouse.velocityFactor;
    
            if (beta > -Math.PI/2 && beta < Math.PI/2) {
                this.firstPersonCamera.beta = beta;
            }

            this.mouse.lastXPosition = newXPosition; this.mouse.lastYPosition = newYPosition;

            this.mvMatrix = this.getmvMatrix();

        }
    }

    cameraOnMouseUp (e) {
        this.mouse.isClick = false;
    }

    cameraOnWheel(e) {
        e.preventDefault();
        
        if(this.mode === "orbital") {
            (e.deltaY < 0) ? this.orbitalCamera.radius -= this.radiusShift : 
            	this.orbitalCamera.radius += this.radiusShift;

            if (this.orbitalCamera.radius < 0) {
                this.orbitalCamera.radius = 0;
            }
        }
        //console.log(this);
        this.mvMatrix = this.getmvMatrix();

    }

    getmvMatrix() {

        var mvMatrix = mat4.create();

        if (this.mode === "orbital") {
        	this.orbitalCamera.position = [
        		this.orbitalCamera.radius * Math.sin(this.orbitalCamera.alpha) * Math.sin(this.orbitalCamera.beta),
        		this.orbitalCamera.radius * Math.cos(this.orbitalCamera.beta),
        		this.orbitalCamera.radius * Math.cos(this.orbitalCamera.alpha) * Math.sin(this.orbitalCamera.beta)
        	]
        	////console.log("getmvMatrix, orbitalCamera: ", this.orbitalCamera);
            vec3.add(this.orbitalCamera.position, this.orbitalCamera.position, this.orbitalCamera.center);
            //vec3.add(camaraOrbital.position, camaraOrbital.position, [1e-6, 0.0, 0.0]);

            mat4.lookAt(mvMatrix, this.orbitalCamera.position, this.orbitalCamera.center, this.orbitalCamera.up);
            ////console.log(mvMatrix);
            return mvMatrix;	
            
        }else if(this.mode === "first_person") {

            mat4.rotate(mvMatrix, mvMatrix, this.firstPersonCamera.beta, [-1.0, 0.0, 0.0]);
			mat4.rotate(mvMatrix, mvMatrix, this.firstPersonCamera.alpha, [0.0, -1.0, 0.0]);
            mat4.translate(mvMatrix, mvMatrix, this.firstPersonCamera.position);
            
            return mvMatrix;

        }

    }

    getPosition() {

        if (this.mode === "first_person") {
			return this.firstPersonCamera.position;
		}
		if (this.mode === "orbital") {

			let pos = vec3.create();
			
			pos[2] -= this.orbitalCamera.radius * Math.cos(this.orbitalCamera.alpha) * Math.sin(this.orbitalCamera.beta);
			pos[0] -= this.orbitalCamera.radius * Math.sin(this.orbitalCamera.alpha) * Math.sin(this.orbitalCamera.beta);
            pos[1] -= this.orbitalCamera.radius * Math.cos(this.orbitalCamera.beta);
            
            return pos;
            
		} else {
            return [0.0, 0.0, 0.0];
        }
        
    }

}
