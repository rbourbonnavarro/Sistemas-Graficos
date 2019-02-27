
class WebGlProgram { 
	constructor(){
        this.vertexShader = null;
        this.fragmentShader = null;
        this.program = null;

        this.setupWebGL();
        //Guardo el codigo de los shaders definidos en los scripts mas arriba en formato texto
        var vertexShaderSourceCode = document.getElementById("v-shader").text;
        var fragmentShaderSourceCode = document.getElementById("f-shader").text;

        //Compilo los shaders con la funcion definida arriba y me guardo las referencias en 2 variables,
        //una para cada shader
        this.vertexShader = this.createShader(gl.VERTEX_SHADER, vertexShaderSourceCode);
        this.fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentShaderSourceCode);
        
        this.createProgram();
    }

    setupWebGL() {
        //establezco el color de fondo
        gl.clearColor(0.9, 0.9, 0.9, 1.0);     
        gl.enable(gl.DEPTH_TEST);                              
        gl.depthFunc(gl.LEQUAL); 
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);                
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }

    //Esta funcion sirve para crear un shader, ya sea de vertices o de fragmentos,
    //hay que llamarla por cada shader que se quiera compilar
    createShader(type, source){
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        var compilationSuccess = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if(compilationSuccess){
            return shader;
        }
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }


    createProgram() {
        program = gl.createProgram();
        // Asociamos cada shader compilado al programa.
        gl.attachShader(program, this.vertexShader);
        gl.attachShader(program, this.fragmentShader);
        // Linkeamos los shaders para generar el programa ejecutable.
        gl.linkProgram(program);
        // Chequeamos y reportamos si hubo algún error.
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            // Le decimos a WebGL que de aquí en adelante use el programa generado.
            gl.useProgram(program);
        }else {
            console.log(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
        }
    }
    getScene(){
        return new Scene();
    }
}