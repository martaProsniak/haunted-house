import {get} from "svelte/store";
import {volume} from "./gameState.svelte";

export class GameAudio {
    private audio: HTMLAudioElement;

    constructor(src: string, loop = false) {
        this.audio = new Audio(src);
        this.audio.volume = get(volume);
        this.audio.loop = loop;
    }

    async start() {
        if (get(volume) === 0) {
            return;
        }
        try {
            await this.audio.play();
        }
        catch (error) {
            console.log(error);
        }
    }

    reset() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    setVolume(volume: number) {
        this.audio.volume = volume;
    }

}