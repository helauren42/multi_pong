// const INIT VARIBALES

const net_color = "gray";
const score_color = "green";
const ball_color = "green";
const paddle_color = "blue";
const bounce_color = "greenyellow";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// INIT VARIABLES WITH SIZES

let format;

if(window.innerWidth <= window.innerHeight)
{
	canvas.width=window.innerWidth - window.innerWidth / 40;
	canvas.height=canvas.width;
	format = "width";
}
else
{
	canvas.width=window.innerHeight - window.innerHeight / 40;
	canvas.height=canvas.width;
	format = "height";
}

function makeBall () {
	this.min_y = (canvas.width / 4),
	this.max_y = (canvas.width / 4) * 3,
	this.pos_x = canvas.height / 2,
	this.pos_y = Math.random() * ((canvas.width / 4 * 3) - (canvas.width / 4)) + (canvas.width / 4),
	this.radius = canvas.width / 40,
	this.direction = Math.random(),
	
	this.setVelocity = function()
	{
		if(this.direction <= 0.25) {
			this.ball_velocity_x = canvas.width / 300,
			this.ball_velocity_y = canvas.height / 300
		}
		else if(this.direction <= 0.5) {
			this.ball_velocity_x = - canvas.width / 300,
			this.ball_velocity_y = canvas.height / 300
		}
		else if(this.direction <= 0.75) {
			this.ball_velocity_x = canvas.width / 300,
			this.ball_velocity_y = - canvas.height / 300
		}
		else {
			this.ball_velocity_x = - canvas.width / 300,
			this.ball_velocity_y = - canvas.height / 300
		}
	};
	
	this.move_ball = function ()
	{
		// this.pos_x += this.ball_velocity_x;
		// this.pos_y += this.ball_velocity_y;
		this.pos_x += 0;
		this.pos_y += 4;
	};
	this.draw_ball = function ()
	{
		ctx.fillStyle = "red";
		ctx.beginPath();
		ctx.arc(this.pos_x, this.pos_y, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.strokeStyle = "red";
		ctx.stroke();
	}

	this.setVelocity(this.direction);
}

function Paddle(player) { // player is top || bottom || left || right
	this.player = player,
	this.width = canvas.width / 40;
	this.height = canvas.height / 5;

	this.setXY = function(player)
	{
		if(player == "top")
		{
			this.pos_x = canvas.width / 2 - this.height / 2;
			this.pos_y = 0;
		}
		if(player == "bottom")
		{
			this.pos_x = canvas.width / 2 - this.height / 2;
			this.pos_y = canvas.height - this.width;
		}
		if(player == "left")
		{
			this.pos_x = 0;
			this.pos_y = canvas.height / 2 - this.height / 2;
		}
		if(player == "right")
		{
			this.pos_x = canvas.width - this.width;
			this.pos_y = canvas.height / 2 - this.height / 2;
		}
	}
	this.draw_paddle = function ()
	{
		ctx.fillStyle = paddle_color;
		ctx.strokeStyle = paddle_color;
		if(this.player == "top" || this.player == "bottom")
		{
			ctx.fillRect(this.pos_x, this.pos_y, this.height, this.width);
			ctx.strokeRect(this.pos_x, this.pos_y, this.height, this.width);
		}
		if(this.player == "left" || this.player == "right")
		{
			ctx.fillRect(this.pos_x, this.pos_y, this.width, this.height);
			ctx.strokeRect(this.pos_x, this.pos_y, this.width, this.height);
		}
		
		console.log("PADDLE: ", this.pos_x, this.pos_y, this.width, this.height);
		console.log("CANVAS: ", canvas.width, canvas.height);
	}
		
	this.movePaddle = function(sign)
	{
		// store current pos_x pos_y so that if after the move, the paddle overflows the canvas, undo the move
		if(this.player == "top" || this.player == "bottom")
		{
			if(sign == "+")
				this.pos_x += canvas.width / 25;
			if(sign == "-")
				this.pos_x -= canvas.width / 25;
		}
		if(this.player == "left" || this.player == "right")
		{
			if(sign == "+")
				this.pos_y += canvas.width / 25;
			if(sign == "-")
				this.pos_y -= canvas.width / 25;
		}
	}
	this.setXY(player);
	this.draw_paddle();
}

function colliding_goal(ball)
{
	if(ball.pos_x <= ball.radius || ball.pos_y <= ball.radius)
		return (true);
	if(ball.pos_x + ball.radius >= canvas.width || ball.pos_y + ball.radius >= canvas.height)
		return (true);
	return (false);
}

function colliding_ball_paddle(ball, paddles)
{
	if(!(ball.pos_x <= ball.radius + paddles.width || ball.pos_y <= ball.radius + paddles.width 
		|| ball.pos_x >= canvas.width - (ball.radius + paddles.width) || ball.pos_y >= canvas.height - (ball.radius + paddles.width)))
		return false;
	if((ball.pos_x <= ball.radius + paddles.width) && ball.pos_y >= paddles.left.pos_y && ball.pos_y <= paddles.left.pos_y + paddles.left.height) // left paddle
	{
		ball.ball_velocity_x -= ball.ball_velocity_x;
		console.log("hit left paddle");
	}			
	if((ball.pos_y <= ball.radius + paddles.width) && ball.pos_x >= paddles.left.pos_x && ball.pos_x <= paddles.left.pos_x + paddles.left.height) // top paddle
	{
		ball.ball_velocity_y -= ball.ball_velocity_y;
		console.log("hit top paddle");
	}			
	if((ball.pos_x >= canvas.width - (ball.radius + paddles.width)) 
		&& ball.pos_y >= paddles.left.pos_y && ball.pos_y <= paddles.left.pos_y + paddles.left.height) // right paddle
	{
		ball.ball_velocity_x -= ball.ball_velocity_x;
		console.log("hit right paddle");
	}
	if((ball.pos_y >= canvas.height - (ball.radius + paddles.width))
		&& ball.pos_x >= paddles.left.pos_x && ball.pos_x <= paddles.left.pos_x + paddles.left.height) // top paddle
	{
		ball.ball_velocity_y -= ball.ball_velocity_y;
		console.log("hit top paddle");
	}		
}

// PLAY

let ball;
let isGoal = true;
let paddle_left;
let paddle_right;
let paddle_top;
let paddle_bottom;
let paddles;

function gameLoop()
{
	if(isGoal == true)
	{
		ball = new makeBall();
		paddle_left = Paddle("left");
		paddle_right = Paddle("right");
		paddle_top = Paddle("top");
		paddle_bottom = Paddle("bottom");
		paddles = {left: paddle_left, right: paddle_right, top: paddle_top, bottom:paddle_bottom};
		isGoal = false;
	}
	ctx.clearRect(ball.pos_x - ball.radius - 1, ball.pos_y - ball.radius - 1, ball.radius * 2 + 2, ball.radius * 2 + 2);
	requestAnimationFrame(gameLoop);
	ball.move_ball();
	ball.draw_ball();
	isGoal = colliding_goal(ball);
	colliding_ball_paddle(ball, paddles); // if ball hits paddle
}

requestAnimationFrame(gameLoop);



// function isColliding();
