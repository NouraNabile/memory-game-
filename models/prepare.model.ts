import type { ICard } from "./card.model"

export interface IPrepare{
    isBusy: boolean;
    cards?:ICard[];
    selectedCard_1?:ICard | null;
    selectedCard_2?:ICard | null;
    selectedIndex_1?:number;
    selectedIndex_2?:number;
    progress?:number;
    fullTrack?:HTMLAudioElement;
    flipAudio?:HTMLAudioElement;
    failAudio?:HTMLAudioElement;
    goodAudio?:HTMLAudioElement;
    gameOverAudio?:HTMLAudioElement;

}