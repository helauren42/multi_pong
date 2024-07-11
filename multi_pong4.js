// const INIT VARIBALES

const net_color = "gray";
const score_color = "green";
const ball_color = "green";
const bounce_color = "greenyellow";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const player_top_colour = "blue";
const player_bottom_colour = "orange";
const player_left_colour = "green";
const player_right_colour = "purple";


// INIT VARIABLES WITH SIZES

let format;

if(window.innerWidth <= window.innerHeight)
{
	canvas.width=window.innerWidth - window.innerWidth / 20;
	canvas.height=canvas.width;
	format = "width";
}
else
{
	canvas.width=window.innerHeight - window.innerHeight / 20;
	canvas.height=canvas.width;
	format = "height";
}

const ball_velocity_div = 500;

function make_ball () {
	this.min_y = (canvas.width / 4),
	this.max_y = (canvas.width / 4) * 3,
	this.pos_x = canvas.height / 2,
	this.pos_y = Math.random() * ((canvas.width / 4 * 3) - (canvas.width / 4)) + (canvas.width / 4),
	this.radius = canvas.width / 60,
	this.direction = Math.random(),

	this.setVelocity = function()
	{
		if(this.direction <= 0.25) {
			this.ball_velocity_x = canvas.width / ball_velocity_div,
			this.ball_velocity_y = canvas.height / ball_velocity_div
		}
		else if(this.direction <= 0.5) {
			this.ball_velocity_x = - canvas.width / ball_velocity_div,
			this.ball_velocity_y = canvas.height / ball_velocity_div
		}
		else if(this.direction <= 0.75) {
			this.ball_velocity_x = canvas.width / ball_velocity_div,
			this.ball_velocity_y = - canvas.height / ball_velocity_div
		}
		else {
			this.ball_velocity_x = - canvas.width / ball_velocity_div,
			this.ball_velocity_y = - canvas.height / ball_velocity_div
		}
		this.ball_velocity_y = Math.abs(this.ball_velocity_y);
	};
	this.move_ball = function ()
	{
		this.pos_x += this.ball_velocity_x;
		this.pos_y += this.ball_velocity_y;
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

function make_paddle(player) { // player is top || bottom || left || right
	this.player = player,
	this.width = canvas.width / 75;
	this.height = canvas.height / 8;

	this.init_position = function(player)
	{
		if(player == "top")
		{
			this.pos_x = canvas.width / 2 - this.height / 2;
			this.pos_y = 0;
			this.player_color = player_top_colour;
		}
		if(player == "bottom")
		{
			this.pos_x = canvas.width / 2 - this.height / 2;
			this.pos_y = canvas.height - this.width;
			this.player_color = player_bottom_colour;
		}
		if(player == "left")
		{
			this.pos_x = 0;
			this.pos_y = canvas.height / 2 - this.height / 2;
			this.player_color = player_left_colour;
		}
		if(player == "right")
		{
			this.pos_x = canvas.width - this.width;
			this.pos_y = canvas.height / 2 - this.height / 2;
			this.player_color = player_right_colour;
		}
	}
	this.draw_paddle = function ()
	{
		ctx.fillStyle = this.player_color;
		ctx.strokeStyle = this.player_color;
		if(this.player == "top" || this.player == "bottom")
			ctx.fillRect(this.pos_x, this.pos_y, this.height, this.width);
		if(this.player == "left" || this.player == "right")
			ctx.fillRect(this.pos_x, this.pos_y, this.width, this.height);
	}
	this.delete_paddle = function()
	{
		if(this.player == "top" || this.player == "bottom")
			ctx.clearRect(this.pos_x, this.pos_y, this.height, this.width);
		if(this.player == "left" || this.player == "right")
			ctx.clearRect(this.pos_x, this.pos_y, this.width, this.height);
	}
	this.init_position(player);
	this.draw_paddle();
}

function make_scores()
{
	this.goals = {left: 0, right: 0, top: 0, bottom: 0};
	this.colour = {left: player_left_colour, right: player_right_colour, top: player_top_colour, bottom: player_bottom_colour};
	this.scores_width = canvas.width / 10;
	this.scores_height = canvas.height / 10;
	this.pos_y = canvas.height / 2;
	this.pos_x = {left: canvas.width / 2 - canvas.width / 6, top: canvas.width / 2 - canvas.width / 16,
		right: canvas.width / 2 + canvas.width / 6, bottom: canvas.width / 2 + canvas.width / 16};
	this.draw_scores = function()
	{
		for (key in this.goals)
		{
			ctx.fillStyle = this.colour[key];
			ctx.font = `${canvas.width / 20}px Orbitron`;
			ctx.fillText(this.goals[key], this.pos_x[key], this.pos_y, 100);
		}
	}
}

function colliding_goal(ball)
{
	if(ball.pos_x <= ball.radius || ball.pos_y <= ball.radius || ball.pos_x + ball.radius >= canvas.width || ball.pos_y + ball.radius >= canvas.height)
	{
		scores.goals[last_touch]++;
		if (ball.pos_x <= ball.radius)
			scores.goals["left"]--;
		if (ball.pos_y <= ball.radius)
			scores.goals["top"]--;
		if(ball.pos_x + ball.radius >= canvas.width)
			scores.goals["right"]--;
		if(ball.pos_y + ball.radius >= canvas.height)
			scores.goals["bottom"]--;
		return (true);
	}
	return (false);
}

let	last_touch = "none";
let	conceder = "none";

function colliding_ball_paddle(ball, paddles)
{
	if((ball.pos_x <= ball.radius + paddles.left.width) // LEFT PADDLE
		&& ball.pos_y >= paddles.left.pos_y - ball.radius && ball.pos_y <= paddles.left.pos_y + paddles.left.height + ball.radius) // left paddle
	{
		ball.ball_velocity_x = -ball.ball_velocity_x;

		if(ball.pos_y - ball.radius / 2 <= paddles.left.pos_y) // ball hits left paddle upper edge
			ball.ball_velocity_y = - Math.abs(ball.ball_velocity_y);
		if(ball.pos_y + ball.radius / 2 >= paddles.left.pos_y + paddles.left.height)
			ball.ball_velocity_y = Math.abs(ball.ball_velocity_y);
		last_touch = "left";
		return (true);
	}
	else if((ball.pos_y <= ball.radius + paddles.top.width) // TOP PADDLE
		&& ball.pos_x >= paddles.top.pos_x - ball.radius && ball.pos_x <= paddles.top.pos_x + paddles.top.height + ball.radius) // top paddle
	{
		ball.ball_velocity_y = -ball.ball_velocity_y;

		if(ball.pos_x - ball.radius / 2<= paddles.top.pos_x) // left edge
			ball.ball_velocity_x = - Math.abs(ball.ball_velocity_x);
		if(ball.pos_x + ball.radius / 2 >= paddles.top.pos_x + paddles.top.height)
			ball.ball_velocity_x = Math.abs(ball.ball_velocity_x);
		last_touch = "top";
		return (true);
	}
	else if((ball.pos_x >= canvas.width - (ball.radius + paddles.right.width)) // RIGHT PADDLE
		&& ball.pos_y >= paddles.right.pos_y - ball.radius && ball.pos_y <= paddles.right.pos_y + paddles.right.height + ball.radius) // right paddle
	{
		ball.ball_velocity_x = -ball.ball_velocity_x;

		if(ball.pos_y - ball.radius / 2 <= paddles.right.pos_y) // upper edge
			ball.ball_velocity_y = - Math.abs(ball.ball_velocity_y);
		if(ball.pos_y + ball.radius / 2 >= paddles.right.pos_y + paddles.right.height)
			ball.ball_velocity_y = Math.abs(ball.ball_velocity_y);
		last_touch = "right";
		return (true);
	}
	else if((ball.pos_y >= canvas.height - (ball.radius + paddles.bottom.width)) // BOTTOM PADDLE
		&& ball.pos_x >= paddles.bottom.pos_x - ball.radius && ball.pos_x <= paddles.bottom.pos_x + paddles.bottom.height + ball.radius) // bottom paddle
	{
		ball.ball_velocity_y = -ball.ball_velocity_y;

		if(ball.pos_x - ball.radius / 2 <= paddles.bottom.pos_x) // left edge
			ball.ball_velocity_x = - Math.abs(ball.ball_velocity_x);
		if(ball.pos_x + ball.radius / 2 >= paddles.bottom.pos_x + paddles.bottom.height)
			ball.ball_velocity_x = Math.abs(ball.ball_velocity_x);
		last_touch = "bottom";
		return (true);
	}
	return (false);
}

// PLAY

let scores = new make_scores();
let ball;
let paddle_left = new make_paddle("left");
let paddle_right = new make_paddle("right");
let paddle_top = new make_paddle("top");
let paddle_bottom = new make_paddle("bottom");
let paddles = {left: paddle_left, right: paddle_right, top: paddle_top, bottom:paddle_bottom};
let isGoal = false;
let	first = true;

function key_down(event)
{
	if(event.key == "ArrowUp" || event.key == "ArrowRight")
	{
		if(paddle_bottom.pos_x + paddle_bottom.height < canvas.width)
			paddle_bottom.pos_x += Math.abs(canvas.width / 50);
		if(paddle_bottom.pos_x + paddle_bottom.height > canvas.width)
			paddle_bottom.pos_x = canvas.width - paddle_bottom.height;
	}
	else if (event.key == "ArrowDown" || event.key == "ArrowLeft")
	{
		if(paddle_bottom.pos_x > 0)
			paddle_bottom.pos_x -= Math.abs(canvas.width / 50);
		if(paddle_bottom.pos_x < 0)
			paddle_bottom.pos_x = 0;
	}
}

const preSleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const realSleep = async (ms) => {
	console.log('Step 1 - Called');
	await preSleep(ms);
	console.log('Step 2 - Called');
};

const goal_animation_text = async (scorer) => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (scorer !== "none") {
		ctx.fillStyle = scores.colour[scorer];
		ctx.font = `${canvas.width / 40}px Orbitron`;
		let text = "Beautiful Goal by " + scorer;
		ctx.fillText(text, canvas.width / 2 - canvas.width / 7, canvas.height / 4 * 3);
	} else {
		ctx.fillStyle = "white";
		ctx.font = `${canvas.width / 40}px Orbitron`;
		ctx.fillText("OMG how did that go in ?!", canvas.width / 2 - canvas.width / 7, canvas.height / 4 * 3);
	}
};

gameLoop = async () =>
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (key in paddles)
		paddles[key].draw_paddle();
	if(isGoal == true || first == true)
	{
		goal_animation_text(last_touch);
		prev_scores.draw_scores();
		await realSleep(300);
		goal_animation_bigger();
		await realSleep();
		prev_scores.draw_scores();
		ball = new make_ball();
		for (key in paddles)
			paddles[key].init_position(paddles[key].player);
		first = false;
		isGoal = false;
		last_touch = "none";
	}
	let prev_scores = Object.assign({}, scores);
	scores.draw_scores();
	ball.move_ball();
	ball.draw_ball();
	if(colliding_ball_paddle(ball, paddles) == true)
	{
		ball.ball_velocity_x += 0.1 * ball.ball_velocity_x;
		ball.ball_velocity_y += 0.1 * ball.ball_velocity_y;
		requestAnimationFrame(gameLoop);
		return ;
	}
	isGoal = colliding_goal(ball);
	requestAnimationFrame(gameLoop);
	return ;
}

document.addEventListener('keydown', function(event) {
	key_down(event);
	return ;
});

requestAnimationFrame(gameLoop);



