class Ball {
    static instanceCount = 0;

    constructor(width, height, vx, vy) {
        this.width = width;
        this.height = height;
        this.vx = vx;
        this.vy = vy;
        this.x = 0;  // Initial x position
        this.y = 0;  // Initial y position

        Ball.instanceCount++;
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;
    }

    static getInstanceCount() {
        return Ball.instanceCount;
    }
}

// Creating instances of Ball
const ball1 = new Ball(50, 50, 5, 3);
const ball2 = new Ball(30, 30, 2, 4);

// Using the move method
ball1.move();
ball2.move();

// Logging positions
console.log(`Ball 1 position: x=${ball1.x}, y=${ball1.y}`);
console.log(`Ball 2 position: x=${ball2.x}, y=${ball2.y}`);

// Getting the total number of instances
console.log(`Total Ball instances: ${Ball.getInstanceCount()}`);
