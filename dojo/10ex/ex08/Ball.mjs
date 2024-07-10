export class Ball
{   
    constructor (width, height, vx, vy)
    {   
        this.width = width;
        this.height = height;
        this.vx = vx;
        this.vy = vy;
    }
    speedUP()
    {
        this.vx += 0.2;
        this.vy += 0.2;
    }
    setVelocity(vx, vy)
    {
        this.vx += vx;
        this.vy += vy;
    }
}