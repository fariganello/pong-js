import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../utils/constants.js';

export function checkCollision(ball, paddle) {
    ball.top = ball.y - ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x + ball.radius;

    paddle.top = paddle.y;
    paddle.bottom = paddle.y + paddle.height;
    paddle.left = paddle.x;
    paddle.right = paddle.x + paddle.width;

    return ball.right > paddle.left && ball.top < paddle.bottom && ball.left < paddle.right && ball.bottom > paddle.top;
}

export function checkWallCollision(ball) {
    // Top wall
    if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.velocityY = -ball.velocityY;
        return true;
    }
    // Bottom wall
    if (ball.y + ball.radius > CANVAS_HEIGHT) {
        ball.y = CANVAS_HEIGHT - ball.radius;
        ball.velocityY = -ball.velocityY;
        return true;
    }
    return false;
}

export function resolvePaddleCollision(ball, paddle) {
    // Where the ball hit the player
    let collidePoint = ball.y - (paddle.y + paddle.height / 2);

    // Normalization
    collidePoint = collidePoint / (paddle.height / 2);

    // Calculate angle in Radian
    let angleRad = (Math.PI / 4) * collidePoint;

    // X direction of the ball when it's hit
    let direction = (ball.x + ball.radius < CANVAS_WIDTH / 2) ? 1 : -1;

    // Change velocity X and Y
    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);

    // Speed up the ball every time a paddle hits it
    ball.speed += 0.1;

    // Push ball out to avoid sticking
    if (direction === 1) { // Hit left paddle (user)
        ball.x = paddle.x + paddle.width + ball.radius;
    } else { // Hit right paddle (com)
        ball.x = paddle.x - ball.radius;
    }
}

export function checkPowerupCollision(ball, powerup) {
    if (!powerup.active) return false;

    return ball.x + ball.radius > powerup.x - powerup.size / 2 &&
        ball.x - ball.radius < powerup.x + powerup.size / 2 &&
        ball.y + ball.radius > powerup.y - powerup.size / 2 &&
        ball.y - ball.radius < powerup.y + powerup.size / 2;
}
