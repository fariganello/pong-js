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

        // Touch support
        this.canvas.addEventListener("touchmove", (evt) => this.getTouchPos(evt), { passive: false });
        this.canvas.addEventListener("touchstart", (evt) => this.getTouchPos(evt), { passive: false });
    }

    getMousePos(evt) {
        if (this.game.gameState !== 'PLAYING') return;

        let rect = this.canvas.getBoundingClientRect();
        let scaleY = CANVAS_HEIGHT / rect.height;
        let newY = (evt.clientY - rect.top) * scaleY - this.userPaddle.height / 2;
        this.updatePaddlePos(newY);
    }

    getTouchPos(evt) {
        if (this.game.gameState !== 'PLAYING') return;

        // Prevent scrolling while playing
        if (evt.cancelable) evt.preventDefault();

        let rect = this.canvas.getBoundingClientRect();
        let scaleY = CANVAS_HEIGHT / rect.height;
        let touch = evt.touches[0];
        let newY = (touch.clientY - rect.top) * scaleY - this.userPaddle.height / 2;

        this.updatePaddlePos(newY);
    }

    updatePaddlePos(newY) {
        // Clamp User Position
        if (newY < 0) newY = 0;
        if (newY + this.userPaddle.height > CANVAS_HEIGHT) newY = CANVAS_HEIGHT - this.userPaddle.height;

        // Calculate velocity (current - previous)
        this.userPaddle.velocityY = newY - this.userPaddle.y;

        this.userPaddle.y = newY;
    }
}
