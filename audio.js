export class SoundManager {
    constructor() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    resume() {
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    play(freq, type = 'square', duration = 0.1) {
        this.resume();

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = type;
        osc.frequency.value = freq;

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();

        gain.gain.exponentialRampToValueAtTime(0.00001, this.audioCtx.currentTime + duration);
        osc.stop(this.audioCtx.currentTime + duration);
    }

    playWallHit() {
        this.play(200, 'square', 0.1);
    }

    playPaddleHit() {
        this.play(400, 'square', 0.1);
    }

    playScoreWin() {
        this.play(600, 'sine', 0.3);
    }

    playScoreLoss() {
        this.play(100, 'sawtooth', 0.3);
    }

    playPowerup() {
        this.play(600, 'triangle', 0.2);
    }

    playWinGame() {
        this.play(800, 'sine', 0.5);
    }

    playLoseGame() {
        this.play(100, 'sawtooth', 0.5);
    }
}
