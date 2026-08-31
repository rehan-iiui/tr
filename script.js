/* =========================================
   BRAIN TRAINER
   SCRIPT.JS
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const homeScreen =
    document.getElementById("homeScreen");

const gameScreen =
    document.getElementById("gameScreen");

const resultScreen =
    document.getElementById("resultScreen");

const scoreElement =
    document.getElementById("score");

const bestScoreElement =
    document.getElementById("bestScore");

const gameTitle =
    document.getElementById("gameTitle");

const gameIcon =
    document.getElementById("gameIcon");

const instruction =
    document.getElementById("instruction");

const challenge =
    document.getElementById("challenge");

const roundElement =
    document.getElementById("round");

const timerElement =
    document.getElementById("timer");

const livesElement =
    document.getElementById("lives");

const finalScore =
    document.getElementById("finalScore");

const finalRounds =
    document.getElementById("finalRounds");

const resultBest =
    document.getElementById("resultBest");

const backBtn =
    document.getElementById("backBtn");

const playAgainBtn =
    document.getElementById("playAgainBtn");

const resultMenuBtn =
    document.getElementById("resultMenuBtn");


/* =========================================
   GAME STATE
========================================= */

let currentGame = "";

let score = 0;

let bestScore =
    Number(
        localStorage.getItem(
            "brainTrainerBest"
        )
    ) || 0;

let round = 1;

let lives = 3;

let timer = 30;

let timerInterval = null;

let gameTimeout = null;

let gameActive = false;

let waitingForReaction = false;

let reactionStart = 0;

let currentNumber = "";

let patternSequence = [];

let playerPattern = [];

let targetTimeout = null;

let targetCount = 0;

let logicAnswer = "";

let logicOptions = [];


/* =========================================
   INITIAL UI
========================================= */

bestScoreElement.textContent =
    bestScore;


/* =========================================
   GAME DATA
========================================= */

const gameData = {

    reaction: {
        title: "Reaction Test",
        icon: "⚡"
    },

    memory: {
        title: "Number Memory",
        icon: "🔢"
    },

    pattern: {
        title: "Pattern Memory",
        icon: "🟦"
    },

    aim: {
        title: "Target Rush",
        icon: "🎯"
    },

    logic: {
        title: "Logic Challenge",
        icon: "🧩"
    },

    mixed: {
        title: "Brain Marathon",
        icon: "🧠"
    }

};


/* =========================================
   SCREEN CONTROL
========================================= */

function showScreen(screen) {

    homeScreen.classList.remove(
        "active"
    );

    gameScreen.classList.remove(
        "active"
    );

    resultScreen.classList.remove(
        "active"
    );


    screen.classList.add(
        "active"
    );

}


/* =========================================
   GAME CARD BUTTONS
========================================= */

document
    .querySelectorAll(".game-card")
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const selectedGame =
                    card.dataset.game;

                startGame(
                    selectedGame
                );

            }
        );

    });


/* =========================================
   START GAME
========================================= */

function startGame(gameName) {

    clearAllTimers();


    currentGame =
        gameName;

    score = 0;

    round = 1;

    lives = 3;

    timer = 30;

    gameActive = true;


    scoreElement.textContent =
        score;

    roundElement.textContent =
        round;

    timerElement.textContent =
        timer;

    updateLives();


    gameTitle.textContent =
        gameData[gameName].title;

    gameIcon.textContent =
        gameData[gameName].icon;


    showScreen(
        gameScreen
    );


    if (gameName === "reaction") {

        startReaction();

    }

    else if (gameName === "memory") {

        startMemory();

    }

    else if (gameName === "pattern") {

        startPattern();

    }

    else if (gameName === "aim") {

        startAim();

    }

    else if (gameName === "logic") {

        startLogic();

    }

    else if (gameName === "mixed") {

        startMixed();

    }

}


/* =========================================
   SCORE
========================================= */

function addScore(points) {

    score += points;

    scoreElement.textContent =
        score;


    if (score > bestScore) {

        bestScore =
            score;

        bestScoreElement.textContent =
            bestScore;

        localStorage.setItem(
            "brainTrainerBest",
            bestScore
        );

    }

}


/* =========================================
   LIVES
========================================= */

function updateLives() {

    livesElement.textContent =
        "❤️ ".repeat(lives) +
        "🖤 ".repeat(
            3 - lives
        );

}


/* =========================================
   LOSE LIFE
========================================= */

function loseLife() {

    lives--;

    updateLives();


    if (lives <= 0) {

        finishGame();

    }

}


/* =========================================
   ROUND
========================================= */

function nextRound() {

    round++;

    roundElement.textContent =
        round;

}


/* =========================================
   TIMER
========================================= */

function startTimer(seconds) {

    clearInterval(
        timerInterval
    );


    timer = seconds;

    timerElement.textContent =
        timer;


    timerInterval =
        setInterval(
            () => {

                if (!gameActive) {
                    return;
                }


                timer--;

                timerElement.textContent =
                    timer;


                if (timer <= 0) {

                    clearInterval(
                        timerInterval
                    );

                    finishGame();

                }

            },
            1000
        );

}


/* =========================================
   CLEAR TIMERS
========================================= */

function clearAllTimers() {

    clearInterval(
        timerInterval
    );

    clearTimeout(
        gameTimeout
    );

    clearTimeout(
        targetTimeout
    );

}


/* =========================================
   REACTION TEST
========================================= */

function startReaction() {

    clearAllTimers();


    instruction.textContent =
        "Wait for GREEN, then click as fast as you can.";


    challenge.innerHTML = "";


    const box =
        document.createElement(
            "button"
        );


    box.textContent =
        "WAIT...";


    box.style.width =
        "260px";

    box.style.height =
        "180px";

    box.style.border =
        "none";

    box.style.borderRadius =
        "20px";

    box.style.background =
        "#334155";

    box.style.color =
        "white";

    box.style.fontSize =
        "22px";

    box.style.fontWeight =
        "bold";

    box.style.cursor =
        "pointer";


    challenge.appendChild(
        box
    );


    waitingForReaction =
        true;


    const delay =
        1200 +
        Math.random() *
        3000;


    gameTimeout =
        setTimeout(
            () => {

                if (!gameActive) {
                    return;
                }


                box.textContent =
                    "CLICK!";

                box.style.background =
                    "#22c55e";


                reactionStart =
                    performance.now();


                box.onclick =
                    () => {

                        const reactionTime =
                            Math.round(
                                performance.now() -
                                reactionStart
                            );


                        const points =
                            Math.max(
                                10,
                                100 -
                                Math.floor(
                                    reactionTime /
                                    5
                                )
                            );


                        addScore(
                            points
                        );


                        instruction.textContent =
                            reactionTime +
                            " ms — Great reaction!";


                        box.textContent =
                            reactionTime +
                            " ms";


                        box.style.background =
                            "#2563eb";


                        waitingForReaction =
                            false;


                        setTimeout(
                            () => {

                                if (
                                    gameActive
                                ) {

                                    nextRound();

                                    startReaction();

                                }

                            },
                            900
                        );

                    };

            },
            delay
        );


    box.onclick =
        () => {

            if (
                waitingForReaction &&
                reactionStart === 0
            ) {

                loseLife();

                instruction.textContent =
                    "Too early! Wait for GREEN.";

                box.textContent =
                    "TOO EARLY";

                box.style.background =
                    "#ef4444";


                setTimeout(
                    () => {

                        if (
                            gameActive
                        ) {

                            reactionStart = 0;

                            nextRound();

                            startReaction();

                        }

                    },
                    900
                );

            }

        };


    reactionStart = 0;

}


/* =========================================
   NUMBER MEMORY
========================================= */

function startMemory() {

    clearAllTimers();


    const length =
        Math.min(
            3 + round,
            12
        );


    currentNumber =
        generateNumber(
            length
        );


    instruction.textContent =
        "Remember this number.";


    challenge.innerHTML = `

        <div
            style="
                font-size:clamp(32px,8vw,68px);
                font-weight:bold;
                letter-spacing:8px;
                text-align:center;
            "
        >
            ${currentNumber}
        </div>

    `;


    gameTimeout =
        setTimeout(
            showMemoryInput,
            1800
        );

}


function generateNumber(length) {

    let number = "";

    for (
        let i = 0;
        i < length;
        i++
    ) {

        number +=
            Math.floor(
                Math.random() * 10
            );

    }

    return number;

}


function showMemoryInput() {

    instruction.textContent =
        "Enter the number you remember.";


    challenge.innerHTML = `

        <input
            id="memoryInput"
            type="text"
            inputmode="numeric"
            autocomplete="off"
            maxlength="12"
            placeholder="Enter number"
            style="
                width:min(330px,90%);
                padding:18px;
                border-radius:12px;
                border:1px solid #475569;
                background:#111827;
                color:white;
                text-align:center;
                font-size:25px;
                outline:none;
            "
        >

        <button
            id="memorySubmit"
            style="
                margin-left:10px;
                padding:17px 22px;
                border:0;
                border-radius:12px;
                background:#2563eb;
                color:white;
                font-weight:bold;
                cursor:pointer;
            "
        >
            CHECK
        </button>

    `;


    const input =
        document.getElementById(
            "memoryInput"
        );

    const submit =
        document.getElementById(
            "memorySubmit"
        );


    input.focus();


    function checkAnswer() {

        if (!gameActive) {
            return;
        }


        if (
            input.value ===
            currentNumber
        ) {

            addScore(
                100 +
                round * 10
            );


            instruction.textContent =
                "Correct!";


            setTimeout(
                () => {

                    if (
                        gameActive
                    ) {

                        nextRound();

                        startMemory();

                    }

                },
                700
            );

        }

        else {

            loseLife();


            if (gameActive) {

                instruction.textContent =
                    "Not quite. The number was " +
                    currentNumber;


                setTimeout(
                    () => {

                        if (
                            gameActive
                        ) {

                            nextRound();

                            startMemory();

                        }

                    },
                    1000
                );

            }

        }

    }


    submit.onclick =
        checkAnswer;


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                checkAnswer();

            }

        }
    );

}


/* =========================================
   PATTERN MEMORY
========================================= */

function startPattern() {

    clearAllTimers();


    const size = 9;

    const count =
        Math.min(
            2 + round,
            6
        );


    patternSequence = [];


    while (
        patternSequence.length <
        count
    ) {

        const position =
            Math.floor(
                Math.random() * size
            );


        if (
            !patternSequence.includes(
                position
            )
        ) {

            patternSequence.push(
                position
            );

        }

    }


    playerPattern = [];


    instruction.textContent =
        "Remember the highlighted squares.";


    createPatternGrid(
        size,
        true
    );


    gameTimeout =
        setTimeout(
            () => {

                if (!gameActive) {
                    return;
                }


                instruction.textContent =
                    "Now repeat the pattern.";


                createPatternGrid(
                    size,
                    false
                );

            },
            1400
        );

}


function createPatternGrid(
    size,
    showing
) {

    challenge.innerHTML = "";


    const grid =
        document.createElement(
            "div"
        );


    grid.style.display =
        "grid";

    grid.style.gridTemplateColumns =
        "repeat(3, 70px)";

    grid.style.gap =
        "10px";


    for (
        let i = 0;
        i < size;
        i++
    ) {

        const square =
            document.createElement(
                "button"
            );


        square.dataset.index =
            i;


        square.style.width =
            "70px";

        square.style.height =
            "70px";

        square.style.border =
            "none";

        square.style.borderRadius =
            "12px";

        square.style.background =
            patternSequence.includes(i) &&
            showing
                ? "#6366f1"
                : "#1e293b";

        square.style.cursor =
            showing
                ? "default"
                : "pointer";


        if (!showing) {

            square.onclick =
                () => {

                    const index =
                        Number(
                            square.dataset.index
                        );


                    if (
                        playerPattern.includes(
                            index
                        )
                    ) {
                        return;
                    }


                    playerPattern.push(
                        index
                    );


                    square.style.background =
                        "#6366f1";


                    const expected =
                        patternSequence[
                            playerPattern.length - 1
                        ];


                    if (
                        index !== expected
                    ) {

                        loseLife();

                        instruction.textContent =
                            "Wrong square!";


                        setTimeout(
                            () => {

                                if (
                                    gameActive
                                ) {

                                    nextRound();

                                    startPattern();

                                }

                            },
                            800
                        );


                        return;

                    }


                    if (
                        playerPattern.length ===
                        patternSequence.length
                    ) {

                        addScore(
                            100 +
                            round * 10
                        );


                        instruction.textContent =
                            "Perfect pattern!";


                        setTimeout(
                            () => {

                                if (
                                    gameActive
                                ) {

                                    nextRound();

                                    startPattern();

                                }

                            },
                            700
                        );

                    }

                };

        }


        grid.appendChild(
            square
        );

    }


    challenge.appendChild(
        grid
    );

}


/* =========================================
   TARGET RUSH
========================================= */

function startAim() {

    clearAllTimers();


    targetCount = 0;


    instruction.textContent =
        "Click as many targets as you can!";


    challenge.innerHTML = "";


    const arena =
        document.createElement(
            "div"
        );


    arena.style.position =
        "relative";

    arena.style.width =
        "min(700px,95%)";

    arena.style.height =
        "350px";

    arena.style.background =
        "#0f172a";

    arena.style.borderRadius =
        "16px";

    arena.style.border =
        "1px solid #334155";

    arena.style.overflow =
        "hidden";


    challenge.appendChild(
        arena
    );


    createTarget(
        arena
    );


    startTimer(20);

}


function createTarget(arena) {

    if (!gameActive) {
        return;
    }


    const target =
        document.createElement(
            "button"
        );


    const size =
        Math.max(
            30,
            65 -
            round * 2
        );


    target.style.position =
        "absolute";

    target.style.width =
        size + "px";

    target.style.height =
        size + "px";

    target.style.border =
        "5px solid white";

    target.style.borderRadius =
        "50%";

    target.style.background =
        "#ef4444";

    target.style.cursor =
        "pointer";


    const maxX =
        700 - size;

    const maxY =
        350 - size;


    target.style.left =
        Math.random() *
        Math.max(
            20,
            maxX
        ) + "px";


    target.style.top =
        Math.random() *
        Math.max(
            20,
            maxY
        ) + "px";


    target.onclick =
        () => {

            if (!gameActive) {
                return;
            }


            targetCount++;


            addScore(
                10 +
                round
            );


            target.remove();


            createTarget(
                arena
            );

        };


    arena.appendChild(
        target
    );


    targetTimeout =
        setTimeout(
            () => {

                if (
                    target.parentNode
                ) {

                    target.remove();

                    createTarget(
                        arena
                    );

                }

            },
            1200
        );

}


/* =========================================
   LOGIC CHALLENGE
========================================= */

function startLogic() {

    clearAllTimers();


    const problems = [

        {
            question:
                "What comes next? 2, 4, 8, 16, ?",

            answer:
                "32",

            options:
                ["24", "30", "32", "36"]

        },

        {
            question:
                "What comes next? 3, 6, 9, 12, ?",

            answer:
                "15",

            options:
                ["14", "15", "16", "18"]

        },

        {
            question:
                "Which number is different? 2, 4, 6, 9, 10",

            answer:
                "9",

            options:
                ["2", "6", "9", "10"]

        },

        {
            question:
                "What comes next? 1, 1, 2, 3, 5, ?",

            answer:
                "8",

            options:
                ["6", "7", "8", "9"]

        },

        {
            question:
                "If all Zips are Zaps and all Zaps are Zops, are all Zips Zops?",

            answer:
                "Yes",

            options:
                ["Yes", "No", "Maybe", "Impossible"]

        }

    ];


    const problem =
        problems[
            Math.floor(
                Math.random() *
                problems.length
            )
        ];


    logicAnswer =
        problem.answer;

    logicOptions =
        problem.options;


    instruction.textContent =
        "Think carefully and choose the answer.";


    challenge.innerHTML = `

        <div
            style="
                width:min(700px,95%);
                text-align:center;
            "
        >

            <div
                style="
                    font-size:24px;
                    font-weight:bold;
                    line-height:1.5;
                    margin-bottom:30px;
                "
            >
                ${problem.question}
            </div>

            <div
                id="logicOptions"
                style="
                    display:grid;
                    grid-template-columns:
                    repeat(2,1fr);
                    gap:12px;
                "
            >
            </div>

        </div>

    `;


    const optionsContainer =
        document.getElementById(
            "logicOptions"
        );


    logicOptions.forEach(
        option => {

            const button =
                document.createElement(
                    "button"
                );


            button.textContent =
                option;


            button.style.padding =
                "16px";

            button.style.border =
                "1px solid #334155";

            button.style.borderRadius =
                "12px";

            button.style.background =
                "#172033";

            button.style.color =
                "white";

            button.style.fontSize =
                "16px";

            button.style.fontWeight =
                "bold";

            button.style.cursor =
                "pointer";


            button.onclick =
                () => {

                    checkLogic(
                        option,
                        button
                    );

                };


            optionsContainer.appendChild(
                button
            );

        }
    );

}


function checkLogic(
    answer,
    button
) {

    if (!gameActive) {
        return;
    }


    if (
        answer ===
        logicAnswer
    ) {

        button.style.background =
            "#16a34a";


        addScore(
            100 +
            round * 10
        );


        instruction.textContent =
            "Correct!";


        setTimeout(
            () => {

                if (
                    gameActive
                ) {

                    nextRound();

                    startLogic();

                }

            },
            700
        );

    }

    else {

        button.style.background =
            "#dc2626";


        loseLife();


        if (gameActive) {

            instruction.textContent =
                "Wrong answer!";


            setTimeout(
                () => {

                    if (
                        gameActive
                    ) {

                        nextRound();

                        startLogic();

                    }

                },
                900
            );

        }

    }

}


/* =========================================
   BRAIN MARATHON
========================================= */

function startMixed() {

    const games = [
        "reaction",
        "memory",
        "pattern",
        "aim",
        "logic"
    ];


    const selected =
        games[
            (round - 1) %
            games.length
        ];


    currentGame =
        "mixed";


    gameTitle.textContent =
        "Brain Marathon";

    gameIcon.textContent =
        "🧠";


    if (
        selected ===
        "reaction"
    ) {

        startReaction();

    }

    else if (
        selected ===
        "memory"
    ) {

        startMemory();

    }

    else if (
        selected ===
        "pattern"
    ) {

        startPattern();

    }

    else if (
        selected ===
        "aim"
    ) {

        startAim();

    }

    else {

        startLogic();

    }

}


/* =========================================
   FINISH GAME
========================================= */

function finishGame() {

    if (!gameActive) {
        return;
    }


    gameActive = false;


    clearAllTimers();


    finalScore.textContent =
        score;

    finalRounds.textContent =
        Math.max(
            0,
            round - 1
        );

    resultBest.textContent =
        bestScore;


    showScreen(
        resultScreen
    );

}


/* =========================================
   BACK TO MENU
========================================= */

backBtn.addEventListener(
    "click",
    () => {

        gameActive = false;

        clearAllTimers();

        showScreen(
            homeScreen
        );

    }
);


/* =========================================
   PLAY AGAIN
========================================= */

playAgainBtn.addEventListener(
    "click",
    () => {

        startGame(
            currentGame === "mixed"
                ? "mixed"
                : currentGame
        );

    }
);


/* =========================================
   RESULT MENU
========================================= */

resultMenuBtn.addEventListener(
    "click",
    () => {

        gameActive = false;

        clearAllTimers();

        showScreen(
            homeScreen
        );

    }
);


/* =========================================
   KEYBOARD SHORTCUT
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            gameActive
        ) {

            gameActive = false;

            clearAllTimers();

            showScreen(
                homeScreen
            );

        }

    }
);
```
