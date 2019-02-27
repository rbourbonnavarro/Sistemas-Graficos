class CubicBezier extends Segment{
	constructor(controlPoints,deltaT){
		super(controlPoints,deltaT);

	}
	base0(t) {
    	return (1-t)*(1-t)*(1-t) // -t^3 + 3*t^2 - 3*t + 1  
	};
	
	base1(t){
    	return 3*(1-t)*(1-t)*t; // 3 * (t^2 - 2*t +1) * t = 3t^3 - 6t^2 +3t
	};
	
	base2(t){
    	return 3*(1-t)*t*t; // -3t^3 + 3t^2
	};
	
	base3(t){
    	return t*t*t; // t^3
	};
	
	base0der(t) {
    	return -3*t*t+6*t-3; // -3t^2 +6t - 3
	};
	
	base1der(t){
    	return 9*t*t-12*t+3; // 9t^2- 12t + 3
	};
	
	base2der(t){
    	return -9*t*t+6*t; // -9t^2 + 6t
	};
	
	base3der(t){
    	return 3*t*t; // 3t^2
	};
}