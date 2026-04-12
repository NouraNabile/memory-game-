import type { IPrepare } from "./models/prepare.model"
import type { ICard } from "./models/card.model"

const prepare: IPrepare = {
    isBusy: false,
    
    
};
prepare.cards = [];
prepare.progress = 0;
prepare.audio = {
    fullTrack: new Audio('/assets/audio/fulltrack.mp3'),
    good: new Audio('/assets/audio/good.mp3'),
    fail: new Audio('/assets/audio/fail.mp3'),
    flip: new Audio('/assets/audio/flip.mp3'),
    gameOver: new Audio('/assets/audio/game-over.mp3'),
};

prepare.audio.fullTrack = new Audio('/assets/audio/fulltrack.mp3');
prepare.audio.good = new Audio('/assets/audio/good.mp3');
prepare.audio.fail = new Audio('/assets/audio/fail.mp3');
prepare.audio.flip = new Audio('/assets/audio/flip.mp3');
prepare.audio.gameOver = new Audio('/assets/audio/game-over.mp3');

prepare.audio.fullTrack.loop = true;

const numberOfCards = 20; //
const tempNumbers: number[] = [];
let cardsHtmlContent = '';

const getRandomInt = (min: number, max: number) => {
    let result: number;
    let exists = true;

    min = Math.ceil(min);
    max = Math.floor(max);

    while (exists) {
        result = Math.floor(Math.random() * (max - min + 1)) + min;

            if (!tempNumbers.includes(result)) {
            exists = false;
            tempNumbers.push(result);
        }
    }

    return result!;
};

//  التحكم في الضغط
const toggleFlip = (index: number) => {

    if (prepare.isBusy) return; //  stop during comp
    prepare.audio?.fullTrack?.play();

    const card = prepare.cards?.[index];

    if (card && card.clickable && !card.flip) {
        flip(card, index, true);
        selectCard(card, index);
    }
};

//  flip بالـ state
function flip(card: ICard, index: number, state?: boolean) {
    prepare.audio?.flip?.play();

    if (state !== undefined) {
        card.flip = state;
    } else {
        card.flip = !card.flip;
    }

    const element = document.getElementById(`card-flip-${index}`);
    element?.classList.toggle("flip", card.flip);
}

function selectCard(card: ICard, index: number) {

    if (!prepare.sCard_1) {
        prepare.sCard_1 = card;
        prepare.sIndex_1 = index;
        return;
    }

    if (!prepare.sCard_2) {
        prepare.sCard_2 = card;
        prepare.sIndex_2 = index;
    }

    if (prepare.sCard_1 && prepare.sCard_2) {

        prepare.isBusy = true; //  قفل اللعب

        if (prepare.sCard_1.src === prepare.sCard_2.src) {

            prepare.sCard_1.clickable = false;
            prepare.sCard_2.clickable = false;

            prepare.sCard_1 = null;
            prepare.sCard_2 = null;

            stopAudio(prepare.audio?.fail);
            stopAudio(prepare.audio?.gameOver);

            prepare.audio?.good?.play();

            changeProgress();
            checkFinish();

            prepare.isBusy = false; //  فتح اللعب

        } else {

            setTimeout(() => {

                stopAudio(prepare.audio?.fail);
                stopAudio(prepare.audio?.good);

                prepare.audio?.fail?.play();

                flip(prepare.sCard_1!, prepare.sIndex_1!, false);
                flip(prepare.sCard_2!, prepare.sIndex_2!, false);

                prepare.sCard_1 = null;
                prepare.sCard_2 = null;

                prepare.isBusy = false; //  فتح اللعب

            }, 1000);
        }
    }
}

function stopAudio(audio: HTMLAudioElement | undefined) {
    if (audio ) {
        audio.pause();
        audio.currentTime = 0;
    }
}

function changeProgress() {
    const progress = (prepare.cards?.filter(card => !card.clickable).length ?? 0) / numberOfCards * 100;

    const progressElement = document.getElementById('progress');

    if (progressElement) {
        progressElement.style.width = `${progress}%`;
        progressElement.innerHTML = `${Math.floor(progress)}%`;
    }
}
function stopSound() {
     if (prepare.audio?.fullTrack) {
        prepare.audio.fullTrack.loop = false;
        prepare.audio.fullTrack.pause();
        prepare.audio.fullTrack.currentTime = 0;
    }
}

const checkFinish = () => {
    if (prepare.cards?.filter(card => !card.clickable).length === numberOfCards) {

        stopAudio(prepare.audio?.fullTrack);
        stopAudio(prepare.audio?.fail);
        stopAudio(prepare.audio?.good);

        prepare.audio?.gameOver?.play();
    }
};

//create card
for (let index = 0; index < numberOfCards / 2; index++) {

    prepare.cards.push({
        id: getRandomInt(0, numberOfCards),
        src: `/assets/images/${index}.jpg`,
        flip: false,
        clickable: true,
        index
    });

    prepare.cards.push({
        id: getRandomInt(0, numberOfCards),
        src: `/assets/images/${index}.jpg`,
        flip: false,
        clickable: true,
        index
    });
}

// 
prepare.cards.sort((a, b) => a.id > b.id ? 1 : -1);

// احطهم بقي
prepare.cards.forEach((item, index) => {
    cardsHtmlContent += `
    <div class="col-sm-3 col-lg-2">
        <div onclick="toggleFlip(${index})" class="card-flip">
            <div id="card-flip-${index}" class="card-inner">

                <div class="front">
                    <div class="card">
                        <img class="card-image" src="/assets/back.jpg">
                        <span class="card-content">${index + 1}</span>
                    </div>
                </div>

                <div class="back">
                    <div class="card">
                        <img src="/assets/images/${item.index}.jpg">
                    </div>
                </div>

            </div>
        </div>
    </div>
    `;
});

const cardsElement = document.getElementById('cards');
if (cardsElement) {
    cardsElement.innerHTML = cardsHtmlContent;
}

//  onclick
(window as any).toggleFlip = toggleFlip;