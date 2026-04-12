import type { ICard } from "./card.model"
import type { IAudio } from "./Audio"

export interface IPrepare{
    isBusy: boolean;
    cards?:ICard[];
    sCard_1?:ICard | null;
    sCard_2?:ICard | null;
    sIndex_1?:number;
    sIndex_2?:number;
    progress?:number;
    audio?: IAudio;
}