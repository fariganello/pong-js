import { CANVAS_WIDTH, CANVAS_HEIGHT, GAME_CONFIG, POWERUP_TYPES } from '../utils/constants.js';
import { net } from '../entities/entities.js';

export class Renderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
    }

    drawRect(x, y, w, h, color) {
        this.ctx.fillStyle = color;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = color;
        this.ctx.fillRect(x, y, w, h);
        this.ctx.shadowBlur = 0;
    }

    drawCircle(x, y, r, color) {
        this.ctx.fillStyle = color;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI * 2, false);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }

    drawText(text, x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.font = "45px fantasy";
        this.ctx.fillText(text, x, y);
    }

    drawNet() {
        for (let i = 0; i <= CANVAS_HEIGHT; i += GAME_CONFIG.NET_GAP) {
            this.drawRect(net.x, net.y + i, net.width, net.height, net.color);
        }
    }

    drawPowerup(powerup) {
        if (powerup.active) {
            this.ctx.fillStyle = powerup.color;
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = powerup.color;
            this.ctx.fillRect(powerup.x - powerup.size / 2, powerup.y - powerup.size / 2, powerup.size, powerup.size);
            this.ctx.shadowBlur = 0;

            // Draw icon/text
            this.ctx.fillStyle = "#000";
            this.ctx.font = "15px Arial";
            let label = "P";
            if (powerup.type === POWERUP_TYPES.SLOW_BALL) label = "S";
            if (powerup.type === POWERUP_TYPES.MULTI_BALL) label = "M";
            this.ctx.fillText(label, powerup.x - 5, powerup.y + 5);
        }
    }

    drawParticles(particleSystem) {
        particleSystem.particles.forEach(p => {
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(p.x, p.y, 3, 3);
            this.ctx.globalAlpha = 1.0;
        });
    }

    clear() {
        this.drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, "#000");
    }

    render(user, com, balls, powerup, particleSystem) {
        this.clear();
        this.drawNet();
        this.drawText(user.score, CANVAS_WIDTH / 4, CANVAS_HEIGHT / 5, "WHITE");
        this.drawText(com.score, 3 * CANVAS_WIDTH / 4, CANVAS_HEIGHT / 5, "WHITE");
        this.drawRect(user.x, user.y, user.width, user.height, user.color);
        this.drawRect(com.x, com.y, com.width, com.height, com.color);

        balls.forEach(ball => {
            this.drawCircle(ball.x, ball.y, ball.radius, ball.color);
        });

        this.drawPowerup(powerup);

        if (particleSystem) {
            this.drawParticles(particleSystem);
        }
    }
}
