import { CANVAS_HEIGHT } from '../utils/constants.js';

export class InputHandler {
    constructor(canvas, userPaddle, game) {
        this.canvas = canvas;
        this.userPaddle = userPaddle;
        this.game = game;

        this.initListeners();
    }

    initListeners() {
        window.addEventListener("mousemove", (evt) => this.getMousePos(evt));
    }

    getMousePos(evt) {
        if (this.game.gameState !== 'PLAYING') return;

        let rect = this.canvas.getBoundingClientRect();
        let newY = evt.clientY - rect.top - this.userPaddle.height / 2;

        // Clamp User Position
        if (newY < 0) newY = 0;
        if (newY + this.userPaddle.height > CANVAS_HEIGHT) newY = CANVAS_HEIGHT - this.userPaddle.height;

        // Calculate velocity (current - previous)
        this.userPaddle.velocityY = newY - this.userPaddle.y;

        this.userPaddle.y = newY;
    }
}
