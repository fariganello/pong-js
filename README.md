# Pong Game Refactored

A modern, refactored version of the classic Pong game built with HTML5 Canvas and Vanilla JavaScript.

## Features

*   **Modular Architecture**: Built using ES Modules for better code organization and maintainability.
*   **Enhanced Visuals**: Particle effects for collisions, scoring, and powerups.
*   **Powerups**:
    *   **Big Paddle**: Increases the player's paddle size.
    *   **Slow Ball**: Slows down the ball speed.
    *   **Multi Ball**: Spawns an additional ball.
*   **Dynamic Difficulty**: AI difficulty adjusts based on player performance (or can be manually selected).
*   **Sound Effects**: Custom sound effects for hits, scores, and game over events using the Web Audio API.
*   **Responsive Design**: Canvas scales to fit the window.

## How to Run

Since this project uses ES Modules, it must be served via a local web server (opening `index.html` directly will not work due to CORS policies).

### Option 1: Using the provided script (Windows)

1.  Double-click `start.bat` in the project folder.
2.  Open the URL displayed in the terminal (usually `http://127.0.0.1:8080`).

### Option 2: Using Node.js directly

If you have Node.js installed:

1.  Open a terminal in the project directory.
2.  Run:
    ```bash
    npx http-server
    ```
3.  Open `http://127.0.0.1:8080` in your browser.

## Controls

*   **Mouse**: Move your mouse up and down to control the left paddle.
*   **Goal**: Hit the ball past the computer's paddle (right side) to score. First to 5 wins!

## Project Structure

*   `index.html`: Main entry point.
*   `main.js`: Bootstrapper script.
*   `game.js`: Main game loop and state management.
*   `entities.js`: Game objects (Ball, Paddle, Powerup).
*   `renderer.js`: Canvas drawing logic.
*   `physics.js`: Collision detection and resolution.
*   `input.js`: Input handling (Mouse).
*   `audio.js`: Sound effects management.
*   `particles.js`: Particle system for visual effects.
*   `constants.js`: Game configuration and constants.
*   `utils.js`: Helper functions.