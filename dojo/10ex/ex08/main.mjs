import { createBall } from './BallFactory.mjs';

// Create a fast ball
const fastBall = createBall('fast');
console.log(fastBall);


// Modify the velocity of fastBall
fastBall.setVelocity(25, 25);
console.log(fastBall); // Ball { width: 10, height: 10, vx: 25, vy: 25 }

// Create a slow ball
const slowBall = createBall('slow');
console.log(slowBall); // Ball { width: 10, height: 10, vx: 2, vy: 2 }

// Create a large ball
const largeBall = createBall('large');
console.log(largeBall); // Ball { width: 50, height: 50, vx: 5, vy: 5 }

// Create a default ball
const defaultBall = createBall();
console.log(defaultBall); // Ball { width: 10, height: 10, vx: 10, vy: 10 }
