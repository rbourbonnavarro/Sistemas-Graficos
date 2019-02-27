class Shelf extends GraphicObject{

	/*	<-----------------------------6.6----------------------------->
		 ______________________________________________________________
	^	|__|________________________________________________________|__| <-- 0.1
	|	|  |   ^	|	|		|   |		|	|		|	|		|  |
	|	|  |   1	|	|	 	|   |		|	|		|	|		|  |
	|	|  |   v	|	|		|   |		|	|		|	|		|  |
	|	|  |________|   |_______|   |_______|___|_______|   |_______|  |
	|	|  |________|	|_______|   |_______|   |_______|   |_______|  | <-- 0.1
	|	|  |   ^	|	|		|   |		|	|		|	|		|  |
	|	|  |   1	|	|	 	|   |		|	|		|	|		|  |
	|	|  |   v	|0.1|		|0.1|		|0.1|		|0.1|		|  |
	|	|  |________|   |_______|   |_______|   |_______|   |_______|  |
		|  |________|	|_______|   |_______|   |_______|   |_______|  | <-- 0.1
   4.3	|  |   ^	|	|		|   |		|	|		|	|		|  |
		|  |   1	|	|	 	|   |		|	|		|	|		|  |
	|	|  |   v	|	|		|   |		|	|		|	|		|  |
	|	|  |________|___|_______|   |_______|___|_______|___|_______|  |
	|	|  |		^												|  |
	|	|  |		|												|  |
	|	|  |		1												|  |
	|	|  |		|												|  |
	|	|  |		v												|  |				
	v	|__|____________________________6.5_________________________|__|
         ^															 ^
		 |															 |
		 0.05														0.05

	*/
	constructor(mvMatrix, material){
		super(undefined,mvMatrix);

		var cube = new Cube([0.88,0.24,0.82]);

		//base de la estanteria, 
		var mBase = mat4.create();
		mat4.scale(mBase,mBase,[6.5,1,1]);
		this.base = new GraphicObject(cube,mBase,material);
		this.addChild(this.base);

		var mBodyNode = mat4.create();
		mat4.scale(mBodyNode,mBodyNode,[1/6.5,1,1])
		mat4.translate(mBodyNode,mBodyNode,[0,1,0]);
		this.body = new GraphicObject(undefined,mBodyNode);
		this.base.addChild(this.body);

		//maderas laterales
		var latWoodScale = mat4.create();
		mat4.scale(latWoodScale,latWoodScale,[0.05,4.3,1]);

		var leftLatWood = mat4.create();
		mat4.translate(leftLatWood,leftLatWood,[-3.275,0,0]);
		mat4.multiply(leftLatWood,leftLatWood,latWoodScale);
		
		var rigthLatWood = mat4.create();
		mat4.translate(rigthLatWood,rigthLatWood,[3.275,0,0]);
		mat4.multiply(rigthLatWood,rigthLatWood,latWoodScale);		

		this.addChild(new GraphicObject(cube,leftLatWood,material));
		this.addChild(new GraphicObject(cube,rigthLatWood,material));

		//tabiques verticales
		var verticalPartitionScale = mat4.create();
		mat4.scale(verticalPartitionScale,verticalPartitionScale,[0.1,3.3,1]);

		var vertPartition1 = mat4.create();
		mat4.translate(vertPartition1, vertPartition1, [-2.2,0,0]);
		mat4.multiply(vertPartition1,vertPartition1,verticalPartitionScale);

		var vertPartition2 = mat4.create();
		mat4.translate(vertPartition2, vertPartition2, [-1.1,0,0]);
		mat4.multiply(vertPartition2,vertPartition2,verticalPartitionScale);

		var vertPartition3 = mat4.create();
		mat4.translate(vertPartition3, vertPartition3, [0,0,0]);
		mat4.multiply(vertPartition3,vertPartition3,verticalPartitionScale);

		var vertPartition4 = mat4.create();
		mat4.translate(vertPartition4, vertPartition4, [1.1,0,0]);
		mat4.multiply(vertPartition4,vertPartition4,verticalPartitionScale);

		var vertPartition5 = mat4.create();
		mat4.translate(vertPartition5, vertPartition5, [2.2,0,0]);
		mat4.multiply(vertPartition5,vertPartition5,verticalPartitionScale);
		
		this.body.addChild(new GraphicObject(cube,vertPartition1,material));
		this.body.addChild(new GraphicObject(cube,vertPartition2,material));
		this.body.addChild(new GraphicObject(cube,vertPartition3,material));
		this.body.addChild(new GraphicObject(cube,vertPartition4,material));
		this.body.addChild(new GraphicObject(cube,vertPartition5,material));

		//tabiques horizontales de la fila mas baja (no se grafican, son nodos vacios con la información de si estan llenos o no)
		var horPartitionScale = mat4.create();
		mat4.scale(horPartitionScale,horPartitionScale,[1,0.1,1]);

		let horPart1 = mat4.create();
		mat4.translate(horPart1,horPart1,[-2.75,-0.1,0]);
		mat4.multiply(horPart1,horPart1,horPartitionScale);

		let horPart2 = mat4.create();
		mat4.translate(horPart2,horPart2,[-1.65,-0.1,0]);
		mat4.multiply(horPart2,horPart2,horPartitionScale);
		
		let horPart3 = mat4.create();
		mat4.translate(horPart3,horPart3,[-0.55,-0.1,0]);
		mat4.multiply(horPart3,horPart3,horPartitionScale);

		let horPart4 = mat4.create();
		mat4.translate(horPart4,horPart4,[0.55,-0.1,0]);
		mat4.multiply(horPart4,horPart4,horPartitionScale);

		let horPart5 = mat4.create();
		mat4.translate(horPart5,horPart5,[1.65,-0.1,0]);
		mat4.multiply(horPart5,horPart5,horPartitionScale);

		let horPart6 = mat4.create();
		mat4.translate(horPart6,horPart6,[2.75,-0.1,0]);
		mat4.multiply(horPart6,horPart6,horPartitionScale);

		let horizontalPartition1 = new ShelfPartition(undefined,horPart1,1,1);
		let horizontalPartition2 = new ShelfPartition(undefined,horPart2,1,2);
		let horizontalPartition3 = new ShelfPartition(undefined,horPart3,1,3);
		let horizontalPartition4 = new ShelfPartition(undefined,horPart4,1,4);
		let horizontalPartition5 = new ShelfPartition(undefined,horPart5,1,5);
		let horizontalPartition6 = new ShelfPartition(undefined,horPart6,1,6);

		this.hPartitions= [horizontalPartition1,horizontalPartition2,horizontalPartition3,horizontalPartition4,horizontalPartition5,horizontalPartition6];

		this.body.addChild(horizontalPartition1);
		this.body.addChild(horizontalPartition2);
		this.body.addChild(horizontalPartition3);
		this.body.addChild(horizontalPartition4);
		this.body.addChild(horizontalPartition5);
		this.body.addChild(horizontalPartition6);

		//Tabiques horizontales
		horPart1 = mat4.create();
		mat4.translate(horPart1,horPart1,[-2.75,1.05,0]);
		mat4.multiply(horPart1,horPart1,horPartitionScale);

		horPart2 = mat4.create();
		mat4.translate(horPart2,horPart2,[-1.65,1.05,0]);
		mat4.multiply(horPart2,horPart2,horPartitionScale);

		horPart3 = mat4.create();
		mat4.translate(horPart3,horPart3,[-0.55,1.05,0]);
		mat4.multiply(horPart3,horPart3,horPartitionScale);

		horPart4 = mat4.create();
		mat4.translate(horPart4,horPart4,[0.55,1.05,0]);
		mat4.multiply(horPart4,horPart4,horPartitionScale);

		horPart5 = mat4.create();
		mat4.translate(horPart5,horPart5,[1.65,1.05,0]);
		mat4.multiply(horPart5,horPart5,horPartitionScale);

		horPart6 = mat4.create();
		mat4.translate(horPart6,horPart6,[2.75,1.05,0]);
		mat4.multiply(horPart6,horPart6,horPartitionScale);

		horizontalPartition1 = new ShelfPartition(cube,horPart1,2,1,material);
		horizontalPartition2 = new ShelfPartition(cube,horPart2,2,2,material);
		horizontalPartition3 = new ShelfPartition(cube,horPart3,2,3,material);
		horizontalPartition4 = new ShelfPartition(cube,horPart4,2,4,material);
		horizontalPartition5 = new ShelfPartition(cube,horPart5,2,5,material);
		horizontalPartition6 = new ShelfPartition(cube,horPart6,2,6,material);

		this.hPartitions.push(... [horizontalPartition1,horizontalPartition2,horizontalPartition3,horizontalPartition4,horizontalPartition5,horizontalPartition6]);

		this.body.addChild(horizontalPartition1);
		this.body.addChild(horizontalPartition2);
		this.body.addChild(horizontalPartition3);
		this.body.addChild(horizontalPartition4);
		this.body.addChild(horizontalPartition5);
		this.body.addChild(horizontalPartition6);

		horPart1 = mat4.create();
		mat4.translate(horPart1,horPart1,[-2.75,2.15,0]);
		mat4.multiply(horPart1,horPart1,horPartitionScale);

		horPart2 = mat4.create();
		mat4.translate(horPart2,horPart2,[-1.65,2.15,0]);
		mat4.multiply(horPart2,horPart2,horPartitionScale);

		horPart3 = mat4.create();
		mat4.translate(horPart3,horPart3,[-0.55,2.15,0]);
		mat4.multiply(horPart3,horPart3,horPartitionScale);

		horPart4 = mat4.create();
		mat4.translate(horPart4,horPart4,[0.55,2.15,0]);
		mat4.multiply(horPart4,horPart4,horPartitionScale);

		horPart5 = mat4.create();
		mat4.translate(horPart5,horPart5,[1.65,2.15,0]);
		mat4.multiply(horPart5,horPart5,horPartitionScale);

		horPart6 = mat4.create();
		mat4.translate(horPart6,horPart6,[2.75,2.15,0]);
		mat4.multiply(horPart6,horPart6,horPartitionScale);

		horizontalPartition1 = new ShelfPartition(cube,horPart1,3,1,material);
		horizontalPartition2 = new ShelfPartition(cube,horPart2,3,2,material);
		horizontalPartition3 = new ShelfPartition(cube,horPart3,3,3,material);
		horizontalPartition4 = new ShelfPartition(cube,horPart4,3,4,material);
		horizontalPartition5 = new ShelfPartition(cube,horPart5,3,5,material);
		horizontalPartition6 = new ShelfPartition(cube,horPart6,3,6,material);

		this.hPartitions.push(... [horizontalPartition1,horizontalPartition2,horizontalPartition3,horizontalPartition4,horizontalPartition5,horizontalPartition6]);
		
		this.body.addChild(horizontalPartition1);
		this.body.addChild(horizontalPartition2);
		this.body.addChild(horizontalPartition3);
		this.body.addChild(horizontalPartition4);
		this.body.addChild(horizontalPartition5);
		this.body.addChild(horizontalPartition6);

		var topWood = mat4.create();
		mat4.translate(topWood,topWood,[0,4.25,0]);
		mat4.scale(topWood,topWood,[6.6,0.1,1]);

		this.addChild(new GraphicObject(cube, topWood, material));
		console.log(this.hPartitions);
	}

	getFreePartition(){
		let partitionNotFounded = true;
		let index;
		let partition;

		while(partitionNotFounded){
			index = Math.floor(Math.random() * 18);
			partition = this.hPartitions[index];
			if(partition.isEmpty){
				partitionNotFounded = false;
			}
		}
		return partition;
	}
}