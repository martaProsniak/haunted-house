import {get} from "svelte/store";
import {volume} from "./gameState.svelte";

interface Options {
    loop?: boolean;
    maxVolume?: number;
}

export class GameAudio {
    private audio: HTMLAudioElement;
    maxVolume: number;

    constructor(src: string, options?: Options) {
        this.audio = new Audio(src);
        this.audio.loop = options?.loop ?? false;
        this.maxVolume = options?.maxVolume ?? 1;
        this.audio.volume = get(volume) > this.maxVolume ? this.maxVolume : get(volume);
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
        this.audio.volume = volume < this.maxVolume ? volume : this.maxVolume;
    }

}