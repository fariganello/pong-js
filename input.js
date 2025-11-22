import { CANVAS_HEIGHT } from './constants.js';

export class InputHandler {
    constructor(canvas, userPaddle) {
        this.canvas = canvas;
        this.userPaddle = userPaddle;
        this.gameState = 'MENU'; // Will be synced with Game class

        this.initListeners();
    }

    initListeners() {
        window.addEventListener("mousemove", (evt) => this.getMousePos(evt));
    }

    getMousePos(evt) {
        // We only control paddle if playing, but we don't check state here strictly
        // The Game class will decide when to update physics
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
