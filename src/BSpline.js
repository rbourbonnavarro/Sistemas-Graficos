class BSpline extends Segment{
	constructor(cPoints,dT){
		cPoints.push([0,0,0]);
		super(cPoints,dT);
	}

	base0(t){
		return 0.5*(1-t)*(1-t);
	};

	base1(t){
		return -t*t+t+0.5
	};

	base2(t){
		return 0.5*t*t;
	};

	base3(t){
		return 0;
	};

	base0der(t){
		return (t-1);
	};

	base1der(t){
		return -2*t+1;
	};

	base2der(t){
		return t;
	};

	base3der(t){
		return 0;
	};
}