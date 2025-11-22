import { GAME_CONFIG, COLORS, POWERUP_TYPES, CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';

export class Ball {
    constructor(x, y, velocityX, velocityY, speed = GAME_CONFIG.BALL_SPEED) {
        this.x = x;
        this.y = y;
        this.radius = GAME_CONFIG.BALL_RADIUS;
        this.speed = speed;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.color = COLORS.BALL;
    }
}

export class Paddle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.width = GAME_CONFIG.PADDLE_WIDTH;
        this.height = GAME_CONFIG.PADDLE_HEIGHT;
        this.originalHeight = GAME_CONFIG.PADDLE_HEIGHT;
        this.color = color;
        this.score = 0;
        this.velocityY = 0;
    }

    reset() {
        this.height = this.originalHeight;
    }
}

export class Powerup {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.size = 20;
        this.active = false;
        this.type = POWERUP_TYPES.NONE;
        this.color = COLORS.POWERUP_BIG;
    }

    spawn() {
        if (!this.active && Math.random() < 0.002) {
            this.active = true;
            this.x = CANVAS_WIDTH / 4 + Math.random() * (CANVAS_WIDTH / 2);
            this.y = CANVAS_HEIGHT / 4 + Math.random() * (CANVAS_HEIGHT / 2);

            let rand = Math.random();
            if (rand < 0.33) {
                this.type = POWERUP_TYPES.BIG_PADDLE;
                this.color = COLORS.POWERUP_BIG;
            } else if (rand < 0.66) {
                this.type = POWERUP_TYPES.SLOW_BALL;
                this.color = COLORS.POWERUP_SLOW;
            } else {
                this.type = POWERUP_TYPES.MULTI_BALL;
                this.color = COLORS.POWERUP_MULTI;
            }
        }
    }

    reset() {
        this.active = false;
    }
}

export const net = {
    x: (CANVAS_WIDTH - GAME_CONFIG.NET_WIDTH) / 2,
    y: 0,
    width: GAME_CONFIG.NET_WIDTH,
    height: GAME_CONFIG.NET_HEIGHT,
    color: COLORS.NET
};
