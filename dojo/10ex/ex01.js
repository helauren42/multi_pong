// class Ball {
//     constructor(vx, vy) {
//		 this.radius = 10;
//		 this.vel_x = vx;
//		 this.vel_y = vy;
//		 this.color = "red";
//     }

//     speedUp(amount) {
//		 this.vel_x += amount;
//		 this.vel_y += amount;
//     }
// }

class Ball {
	constructor(vx, vy)
	{
		this.radius = 10;
		this.vel_x = vx;
		this.vel_y = vy;
		this.color = "red";
	}
	speedUp(amount)
	{
		this.vel_x += amount;
		this.vel_y += amount;
	}
}

let footBall = new Ball(5, 8);
console.log(footBall);
footBall.speedUp(3);
console.log(footBall);
