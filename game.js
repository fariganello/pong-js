import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS, GAME_CONFIG, POWERUP_TYPES } from './constants.js';
import { SoundManager } from './audio.js';
import { Ball, Paddle, Powerup } from './entities.js';
import { Renderer } from './renderer.js';
import { InputHandler } from './input.js';
import { checkCollision, checkWallCollision, resolvePaddleCollision, checkPowerupCollision } from './physics.js';
import { ParticleSystem } from './particles.js';

export class Game {
    constructor() {
        this.renderer = new Renderer('pong');
        this.audio = new SoundManager();
        this.particles = new ParticleSystem();

        this.user = new Paddle(0, (CANVAS_HEIGHT - GAME_CONFIG.PADDLE_HEIGHT) / 2, COLORS.PADDLE_USER);
        this.com = new Paddle(CANVAS_WIDTH - GAME_CONFIG.PADDLE_WIDTH, (CANVAS_HEIGHT - GAME_CONFIG.PADDLE_HEIGHT) / 2, COLORS.PADDLE_COM);

        this.balls = [];
        this.powerup = new Powerup();

        this.input = new InputHandler(this.renderer.canvas, this.user);

        this.gameState = 'MENU';
        this.winner = "";
        this.difficulty = 0.1;
        this.lastHitter = null;

        this.initUI();
        this.resetBall();

        // Start Loop
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    initUI() {
        this.menuOverlay = document.getElementById('menu-overlay');
        this.gameOverOverlay = document.getElementById('game-over-overlay');
        this.winnerText = document.getElementById('winner-text');
        this.startBtn = document.getElementById('start-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.diffBtns = document.querySelectorAll('.difficulty-select .btn');

        this.diffBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.diffBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.difficulty = parseFloat(btn.getAttribute('data-diff'));
            });
        });

        this.startBtn.addEventListener('click', () => {
            this.gameState = 'PLAYING';
            this.menuOverlay.classList.add('hidden');
            this.resetBall();
            this.audio.resume();
        });

        this.restartBtn.addEventListener('click', () => {
            this.gameState = 'PLAYING';
            this.gameOverOverlay.classList.add('hidden');
            this.user.score = 0;
            this.com.score = 0;
            this.resetBall();
        });
    }

    createBall() {
        return new Ball(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 5, 5);
    }

    resetBall() {
        this.balls = [this.createBall()];
        this.lastHitter = null;
    }

    activatePowerup(player, sourceBall) {
        this.audio.playPowerup();
        this.particles.spawn(this.powerup.x, this.powerup.y, this.powerup.color, 20, 3);

        if (this.powerup.type === POWERUP_TYPES.BIG_PADDLE) {
            player.height = player.originalHeight * 1.5;
            setTimeout(() => {
                player.height = player.originalHeight;
            }, 10000);
        } else if (this.powerup.type === POWERUP_TYPES.SLOW_BALL) {
            this.balls.forEach(b => {
                b.speed = Math.max(3, b.speed * 0.5);
            });
        } else if (this.powerup.type === POWERUP_TYPES.MULTI_BALL) {
            let b1 = sourceBall || this.balls[0];
            let b2 = this.createBall();
            b2.x = b1.x;
            b2.y = b1.y;
            b2.velocityX = b1.velocityX;
            b2.speed = b1.speed;
            b2.radius = b1.radius;
            b2.color = b1.color;

            b1.velocityY -= 3;
            b2.velocityY = b1.velocityY + 6;

            this.balls.push(b2);
        }

        this.powerup.active = false;
    }

    update() {
        if (this.gameState !== 'PLAYING') return;

        this.powerup.spawn();
        this.particles.update();

        // AI Logic
        let targetBall = null;
        let minDist = Infinity;
        this.balls.forEach(ball => {
            if (ball.velocityX > 0) {
                let dist = Math.abs(ball.x - this.com.x);
                if (dist < minDist) {
                    minDist = dist;
                    targetBall = ball;
                }
            }
        });
        if (!targetBall && this.balls.length > 0) targetBall = this.balls[0];

        if (targetBall) {
            this.com.y += (targetBall.y - (this.com.y + this.com.height / 2)) * this.difficulty;
        }
        // Clamp AI
        if (this.com.y < 0) this.com.y = 0;
        if (this.com.y + this.com.height > CANVAS_HEIGHT) this.com.y = CANVAS_HEIGHT - this.com.height;

        // Update Balls
        for (let i = this.balls.length - 1; i >= 0; i--) {
            let ball = this.balls[i];
            ball.x += ball.velocityX;
            ball.y += ball.velocityY;

            if (checkWallCollision(ball)) {
                this.audio.playWallHit();
                this.particles.spawn(ball.x, ball.y, "#fff", 10, 2);
            }

            let player = (ball.x + ball.radius < CANVAS_WIDTH / 2) ? this.user : this.com;

            if (checkCollision(ball, player)) {
                this.audio.playPaddleHit();
                this.particles.spawn(ball.x, ball.y, player.color, 15, 4);
                this.lastHitter = player;
                resolvePaddleCollision(ball, player);

                if (player === this.user) {
                    ball.velocityY += this.user.velocityY * 0.3;
                }
            }

            if (checkPowerupCollision(ball, this.powerup)) {
                if (this.lastHitter) {
                    this.activatePowerup(this.lastHitter, ball);
                } else {
                    this.powerup.active = false;
                }
            }

            // Scoring
            if (ball.x - ball.radius < 0) {
                this.com.score++;
                this.audio.playScoreLoss();
                this.particles.spawn(ball.x, ball.y, "#f00", 30, 5, 50); // Explosion
                this.balls.splice(i, 1);
                if (this.balls.length === 0) this.resetBall();
            } else if (ball.x + ball.radius > CANVAS_WIDTH) {
                this.user.score++;
                this.audio.playScoreWin();
                this.particles.spawn(ball.x, ball.y, "#0f0", 30, 5, 50); // Explosion
                this.balls.splice(i, 1);
                if (this.balls.length === 0) this.resetBall();
            }
        }

        // Game Over
        if (this.user.score >= GAME_CONFIG.WIN_SCORE || this.com.score >= GAME_CONFIG.WIN_SCORE) {
            this.winner = (this.user.score >= GAME_CONFIG.WIN_SCORE) ? "PLAYER" : "COMPUTER";
            this.gameState = 'GAMEOVER';
            this.winnerText.innerText = this.winner + " WINS";
            this.gameOverOverlay.classList.remove('hidden');

            if (this.winner === "PLAYER") this.audio.playWinGame();
            else this.audio.playLoseGame();
        }
    }

    loop() {
        this.update();
        this.renderer.render(this.user, this.com, this.balls, this.powerup, this.particles);
        requestAnimationFrame(this.loop);
    }
}
