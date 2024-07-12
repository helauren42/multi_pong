// BUGS :
// super rare and super hard to replicate but there is a case where a player scores an own goal (ball hits his paddle and goes in goal, 
// tho it might be that it hit the paddle and the goal at the same time and it counts this as a player's goal, happend when moving fast as well
// not just because it hit the paddle and the goal at the same time

// major improvements on the lagging and sticking to the paddle after a fast movement but can still happen

// const INIT VARIBALES

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const player_top_colour = "blue";
const player_bottom_colour = "orange";
const player_left_colour = "green";
const player_right_colour = "purple";

const left_ai = true;
const right_ai = false;
const top_ai = true;
const bottom_ai = true;

// const single_player = false;

// INIT CANVAS AND WINDOW

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

// BUTTONS

// const btn = document.createElement('button');
// btn.innerText = "BUTTON";
// document.body.appendChild(btn);

let button_up = document.getElementById("button_up");
let button_down = document.getElementById("button_down"); // tried putting them both in the same class and using getElementByClassName(), but it somehow doesn't work

let font_size;
let position;

if(format == "height")
{
	position = (window.innerWidth - canvas.width) / 6;
	font_size = canvas.height / 60;

	[button_up, button_down].forEach(button => {
		button.style.backgroundColor = 'rgb(2, 2, 27)';
		button.style.color = 'white';
		button.style.cursor = 'pointer';
		button.style.margin = '5px 0'; // somehow modifying border-width and some other border params doesn't work here, so it's in the css file

		button.style.position = "absolute";

		button.style.left = position;

		button.style.height = "10%";
		button.style.width = "5%";
		button.style.fontSize = font_size;
	});

	button_up.style.top = "45%";
	button_up.innerText = "UP / RIGHT";

	button_down.style.top = "55%";
	button_down.innerText = "DOWN / LEFT";
}

if(format == "width")
{
	position = (window.innerHeight - canvas.height) / 6;
	font_size = canvas.height / 60;

	[button_up, button_down].forEach(button => {
		button.style.backgroundColor = 'rgb(2, 2, 27)';
		button.style.color = 'white';
		button.style.cursor = 'pointer';
		button.style.margin = '5px 0';

		button.style.position = "absolute";

		button.style.bottom = position;

		button.style.height = "5%";
		button.style.width = "10%";
		button.style.fontSize = font_size;
	});

	button_down.style.right = "45%";
	button_down.innerText = "DOWN / LEFT";

	button_up.style.right = "55%";
	button_up.innerText = "UP / RIGHT";
}

// button_up

// FUNCTION constructors

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
		this.pos_y = canvas.width / 4 * 3;
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
	this.speed_up = function()
	{
		this.ball_velocity_x += 0.08 * canvas.width / ball_velocity_div;
		this.ball_velocity_y += 0.08 * canvas.width / ball_velocity_div;
		this.ball_velocity_x += 0.08 * this.ball_velocity_x;
		this.ball_velocity_y += 0.08 * this.ball_velocity_y;
	}
	this.reposition_ball_above_paddle = function(last_touch)
	{
		console.log("Before: ", this);
		if(last_touch == "left")
			this.pos_x += Math.abs(this.ball_velocity_x);
		if(last_touch == "right")
			this.pos_x -= Math.abs(this.ball_velocity_x);
		if(last_touch == "top")
			this.pos_y += Math.abs(this.ball_velocity_y);
		if(last_touch == "bottom")
			this.pos_y -= Math.abs(this.ball_velocity_y);
		console.log("After: ", this);
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
	this.draw_big_scores1 = function(prev_scores)
	{
		for (key in this.goals)
		{
			ctx.fillStyle = this.colour[key];
			console.log("prev_scores.goals[] ", key, prev_scores.goals[key]);
			if(prev_scores.goals[key] == this.goals[key])
			{
				ctx.font = `${canvas.width / 20}px Orbitron`;
				console.log(`Font Size (if): ${canvas.width / 20}px`);
				ctx.fillText(this.goals[key], this.pos_x[key], this.pos_y, 100);
			}
			else
			{
				ctx.font = `${canvas.width / 15}px Orbitron`;
				console.log(`Font Size (else): ${canvas.width / 15}px`);
				ctx.fillText(prev_scores.goals[key], this.pos_x[key], this.pos_y, 100);
			}
		}
	}
	this.draw_big_scores2 = function(prev_scores)
	{
		for (key in this.goals)
		{
			if(key == "none")
				return ;
			ctx.fillStyle = this.colour[key];
			console.log(key, this.goals[key]);
			console.log(key, prev_scores.goals[key]);
			if(prev_scores.goals[key] == this.goals[key])
			{
				ctx.font = `${canvas.width / 20}px Orbitron`;
				console.log(`Font Size (if): ${canvas.width / 20}px`);
				ctx.fillText(this.goals[key], this.pos_x[key], this.pos_y, 100);
			}
			else
			{
				ctx.font = `${canvas.width / 15}px Orbitron`;
				console.log(`Font Size (else): ${canvas.width / 15}px`);
				ctx.fillText(this.goals[key], this.pos_x[key], this.pos_y, 200);
			}
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
let prev_scores = new make_scores();

const preSleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const realSleep = async (ms) => {
	await preSleep(ms);
};

function goal_animation_text (scorer)
{
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

// MOVING PADDLES

paddle_pace = Math.abs(canvas.width / 50);

function key_down(event)
{
	// if(event.key == "ArrowUp" || event.key == "ArrowRight")    // if user plays online best option is ArrowUp and ArrowRight work the same,
	// {															 and ArrowLeft and ArrowDown work the same 
	// 	if(paddle_bottom.pos_x + paddle_bottom.height < canvas.width)
	// 		paddle_bottom.pos_x += paddle_pace;
	// 	if(paddle_bottom.pos_x + paddle_bottom.height > canvas.width)
	// 		paddle_bottom.pos_x = canvas.width - paddle_bottom.height;
	// }
	// else if (event.key == "ArrowDown" || event.key == "ArrowLeft")
	// {
	// 	if(paddle_bottom.pos_x > 0)
	// 		paddle_bottom.pos_x -= paddle_pace;
	// 	if(paddle_bottom.pos_x < 0)
	// 		paddle_bottom.pos_x = 0;
	// }

	// STOP GETTING CONFUSED

	// ARROWS LEFT AND RIGHT MOVE THE TOP AND BOTTOM PADDLES, LEFT AND RIGHT
	// ARROWS UP AND DOWN MOVE THE LEFT AND RIGHT PADDLES, UP AND DOWN

	if(event.key == "ArrowLeft")
	{
		if(bottom_ai == false)
		{
			if(paddle_bottom.pos_x > 0)
				paddle_bottom.pos_x -= paddle_pace;
			if(paddle_bottom.pos_x < 0)
				paddle_bottom.pos_x = 0;
		}
		if(top_ai == false)
		{
			if(paddle_bottom.pos_x > 0)
				paddle_bottom.pos_x -= paddle_pace;
			if(paddle_bottom.pos_x < 0)
				paddle_bottom.pos_x = 0;
		}
	}
	else if (event.key == "ArrowRight")
	{
		if(bottom_ai == false)
		{
			if(paddle_bottom.pos_x + paddle_bottom.height < canvas.width)
				paddle_bottom.pos_x += paddle_pace;
			if(paddle_bottom.pos_x + paddle_bottom.height > canvas.width)
				paddle_bottom.pos_x = canvas.width - paddle_bottom.height;
		}
		if(top_ai == false)
		{
			if(paddle_top.pos_x + paddle_top.height < canvas.width)
				paddle_top.pos_x += paddle_pace;
			if(paddle_top.pos_x + paddle_top.height > canvas.width)
				paddle_top.pos_x = canvas.width - paddle_top.height;
		}
	}
	else if (event.key == "ArrowUp") // LEFT AND RIGHT
	{
		if(left_ai == false)
		{
			if(paddle_left.pos_y > 0)
				paddle_left.pos_y -= paddle_pace;
			if(paddle_left.pos_y < 0)
				paddle_left.pos_y = 0;
		}
		if(right_ai == false)
		{
			if(paddle_right.pos_y > 0)
				paddle_right.pos_y -= paddle_pace;
			if(paddle_right.pos_y < 0)
				paddle_right.pos_y = 0;
		}
	}
	else if (event.key == "ArrowDown")
	{
		if(left_ai == false)
		{
			if(paddle_left.pos_y + paddle_left.height < canvas.height)
				paddle_left.pos_y += paddle_pace;
			if(paddle_left.pos_y + paddle_left.height > canvas.height)
				paddle_left.pos_y = canvas.height - paddle_left.height;
		}
		if(right_ai == false)
		{
			if(paddle_right.pos_y + paddle_right.height < canvas.height)
				paddle_right.pos_y += paddle_pace;
			if(paddle_right.pos_y + paddle_right.height > canvas.height)
				paddle_right.pos_y = canvas.height - paddle_right.height;
		}

	}
}

function simple_AI (ball)
{
	if(left_ai == true && ball.ball_velocity_x < 0) // ball is moving LEFT
	{
		if (ball.pos_y <= paddle_left.pos_y) // ball is above the paddle
			paddle_left.pos_y -= paddle_pace;
		if (ball.pos_y >= paddle_left.pos_y + paddle_left.height) // ball is below the paddle
			paddle_left.pos_y += paddle_pace;
	}
	else if(right_ai == true && ball.ball_velocity_x > 0) // ball is moving RIGHT
	{
		if (ball.pos_y <= paddle_right.pos_y) // ball is above the paddle
			paddle_right.pos_y -= paddle_pace;
		if (ball.pos_y >= paddle_right.pos_y + paddle_right.height) // ball is below the paddle
			paddle_right.pos_y += paddle_pace;
	}
	if(top_ai == true && ball.ball_velocity_y < 0) // ball is moving TOP
	{
		if (ball.pos_x <= paddle_top.pos_x) // ball is left of the paddle
			paddle_top.pos_x -= paddle_pace;
		if (ball.pos_x >= paddle_top.pos_x + paddle_top.height) // ball is below the paddle
			paddle_top.pos_x += paddle_pace;
	}
	else if(bottom_ai == true && ball.ball_velocity_y > 0) // ball is moving BOTTOM
	{
		if (ball.pos_x <= paddle_bottom.pos_x) // ball is left of the paddle
			paddle_bottom.pos_x -= paddle_pace;
		if (ball.pos_x >= paddle_bottom.pos_x + paddle_bottom.height) // ball is below the paddle
			paddle_bottom.pos_x += paddle_pace;
	}
}

function medium_AI (ball)
{
	if(left_ai == true && ball.ball_velocity_x < 0) // ball is moving LEFT
	{
		if (ball.pos_y <= paddle_left.pos_y) // ball is above the paddle
			paddle_left.pos_y -= paddle_pace;
		if (ball.pos_y >= paddle_left.pos_y + paddle_left.height) // ball is below the paddle
			paddle_left.pos_y += paddle_pace;
	}
	else if(right_ai == true && ball.ball_velocity_x > 0) // ball is moving RIGHT
	{
		if (ball.pos_y <= paddle_right.pos_y) // ball is above the paddle
			paddle_right.pos_y -= paddle_pace;
		if (ball.pos_y >= paddle_right.pos_y + paddle_right.height) // ball is below the paddle
			paddle_right.pos_y += paddle_pace;
	}
	if(top_ai == true && ball.ball_velocity_y < 0) // ball is moving TOP
	{
		if (ball.pos_x <= paddle_top.pos_x) // ball is left of the paddle
			paddle_top.pos_x -= paddle_pace;
		if (ball.pos_x >= paddle_top.pos_x + paddle_top.height) // ball is below the paddle
			paddle_top.pos_x += paddle_pace;
	}
	else if(bottom_ai == true && ball.ball_velocity_y > 0) // ball is moving BOTTOM
	{
		if (ball.pos_x <= paddle_bottom.pos_x) // ball is left of the paddle
			paddle_bottom.pos_x -= paddle_pace;
		if (ball.pos_x >= paddle_bottom.pos_x + paddle_bottom.height) // ball is below the paddle
			paddle_bottom.pos_x += paddle_pace;
	}
}

gameLoop = async () =>
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (key in paddles)
		paddles[key].draw_paddle();
	if(isGoal == true || first == true)
	{
		if(first != true)
		{
			goal_animation_text(last_touch);
			prev_scores.draw_scores();
			await realSleep(300);
	
			goal_animation_text(last_touch);
			scores.draw_big_scores1(prev_scores);
			await realSleep(500);
	
			goal_animation_text(last_touch);
			scores.draw_big_scores2(prev_scores);
			await realSleep(500);
		}
		ball = new make_ball();
		for (key in paddles)
			paddles[key].init_position(paddles[key].player);
		first = false;
		isGoal = false;
		last_touch = "none";
		for(key in scores.goals)
			prev_scores.goals[key] = scores.goals[key];
	}
	simple_AI(ball);
	scores.draw_scores();
	ball.move_ball();
	ball.draw_ball();
	if(colliding_ball_paddle(ball, paddles) == true)
	{
		ball.speed_up();
		ball.move_ball();
		while(colliding_ball_paddle(ball, paddles) == true)
			ball.reposition_ball_above_paddle(last_touch);
		requestAnimationFrame(gameLoop); // handles case where it hits both the goal and the paddle at the same time
		return ; // return required for the above case or game speed is doubled
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
