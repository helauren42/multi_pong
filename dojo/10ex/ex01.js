function Ball (vx, vy) {
			this.radius = 10,
			this.vel_x = vx,
			this.vel_y = vy,
			this.color = ball_color,
			speedUp(amount)
			{
				this.vel_x += amount;
				this.vel_y += amount;
			}
}