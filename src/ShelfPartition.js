class ShelfPartition extends GraphicObject{
	constructor(obj,mvMatrix, row, column, material){
		super(obj,mvMatrix,material);
		this.isEmpty = true;
		this.row = row;
		this.column = column;
	}
	addObject(obj){
		var scale = mat4.create();
		mat4.scale(scale,scale,[1,10,1]);
		mat4.translate(scale,scale,[0,0.1,0]);
		obj.multiplymvMatrix(scale);
		this.addChild(obj);
		this.isEmpty = false;
	}
}