import{
  hsl,
  calculateScore
}from"./color-utils.js";

import{
  createMatchRound,
  createSpeedRound,
  createSequenceRound,
  getSettings
}from"./modes.js";

import{ColorMatchUI}from"./color-match-ui.js";

import{
  applySavedTheme,
  toggleTheme
}from"./theme.js";

import{playSound}from"../audio.js";

const ui=new ColorMatchUI();

let score=0;
let streak=0;
let lives=5;
let round=1;

let currentRound=null;
let timer=null;
let locked=false;
let sequenceAnswer=[];

const difficultySettings={
  easy:{lives:5},
  medium:{lives:4},
  hard:{lives:3}
};

function soundEnabled(){
  return localStorage.getItem(
    "colorGameSound"
  )!=="off";
}

function sound(type){
  playSound(
    type,
    soundEnabled()
  );
}

function getDifficultySettings(){
  return difficultySettings[
    ui.getDifficulty()
  ]||difficultySettings.easy;
}

function startRound(){
  clearInterval(timer);

  locked=true;
  sequenceAnswer=[];

  ui.hideResult();
  ui.hideControls();
  ui.setCheckEnabled(false);
  ui.setNextEnabled(false);

  ui.resetSliders();
  ui.clearSequencePreview();

  const mode=ui.getMode();

  sound("click");

  if(mode==="match"){
    startMatchRound();
  }else if(mode==="speed"){
    startSpeedRound();
  }else{
    startSequenceRound();
  }

  ui.updateStats(
    score,
    streak,
    lives,
    round
  );
}

function startMatchRound(){
  currentRound=createMatchRound();

  const settings=
    getSettings(ui.getDifficulty());

  let time=settings.time;

  ui.showTarget(
    hsl(currentRound.target),
    "Memorize esta cor!"
  );

  ui.setTimer(time);

  timer=setInterval(()=>{
    time=Math.max(
      0,
      time-.1
    );

    ui.setTimer(time);

    if(time<=0){
      clearInterval(timer);
      finishMatchMemory();
    }
  },100);
}

function finishMatchMemory(){
  ui.hideTarget(
    "Agora recrie a cor!"
  );

  ui.showModeControls("match");
  ui.setCheckEnabled(true);

  updatePreview();

  locked=false;
}

function updatePreview(){
  if(locked)return;

  ui.updatePreview(
    hsl(ui.getGuess())
  );
}

function checkMatch(){
  if(locked)return;

  locked=true;
  ui.setCheckEnabled(false);

  sound("click");

  const guess=ui.getGuess();

  const points=calculateScore(
    currentRound.target,
    guess
  );

  processScore(points);

  sound(
    points>=500
      ?"success"
      :"error"
  );

  ui.showResult(
    hsl(currentRound.target),
    hsl(guess),
    points,
    getResultMessage(points)
  );

  finishAttempt();
}

function startSpeedRound(){
  currentRound=createSpeedRound();

  const settings=
    getSettings(ui.getDifficulty());

  let time=settings.time;

  ui.showTarget(
    hsl(currentRound.target),
    "Memorize esta cor!"
  );

  ui.setTimer(time);

  timer=setInterval(()=>{
    time=Math.max(
      0,
      time-.1
    );

    ui.setTimer(time);

    if(time<=0){
      clearInterval(timer);
      finishSpeedMemory();
    }
  },100);
}

function finishSpeedMemory(){
  ui.hideTarget(
    "Qual era a cor?"
  );

  ui.showModeControls("speed");

  ui.setSpeedPreview(
    hsl(currentRound.target)
  );

  ui.setSpeedOptions(
    currentRound.options.map(hsl)
  );

  ui.setTimer(0);

  locked=false;
}

function checkSpeed(index){
  if(locked)return;

  locked=true;

  ui.disableSpeedOptions();

  sound("click");

  const correct=
    Number(index)===
    currentRound.correctIndex;

  const points=
    correct?1000:0;

  processScore(points);

  sound(
    correct
      ?"success"
      :"error"
  );

  const correctColor=
    hsl(
      currentRound.options[
        currentRound.correctIndex
      ]
    );

  const selectedColor=
    hsl(
      currentRound.options[index]
    );

  ui.showResult(
    correctColor,
    selectedColor,
    points,
    correct
      ?"Perfeito! Você acertou a cor."
      :"Você errou. Observe melhor a próxima cor."
  );

  finishAttempt();
}

function startSequenceRound(){
  currentRound=
    createSequenceRound(
      ui.getDifficulty()
    );

  sequenceAnswer=[];

  ui.setSequenceProgress(
    0,
    currentRound.sequence.length
  );

  ui.setSequenceMessage(
    "Observe a sequência de cores."
  );

  ui.showModeControls(
    "sequence"
  );

  showSequence();
}

function showSequence(){
  const sequenceColors=
    currentRound.sequence.map(
      index=>
        hsl(
          currentRound.palette[index]
        )
    );

  ui.setSequencePreview(
    sequenceColors
  );

  const settings=
    getSettings(ui.getDifficulty());

  let time=settings.time;

  ui.setTimer(time);

  timer=setInterval(()=>{
    time=Math.max(
      0,
      time-.1
    );

    ui.setTimer(time);

    if(time<=0){
      clearInterval(timer);
      finishSequenceMemory();
    }
  },100);
}

function finishSequenceMemory(){
  ui.clearSequencePreview();

  ui.setSequenceMessage(
    "Agora repita a sequência."
  );

  ui.setSequenceOptions(
    currentRound.palette.map(hsl)
  );

  ui.setSequenceProgress(
    0,
    currentRound.sequence.length
  );

  ui.setTimer(0);

  locked=false;
}

function selectSequenceColor(index){
  if(locked)return;

  sound("click");

  sequenceAnswer.push(
    Number(index)
  );

  const current=
    sequenceAnswer.length;

  const total=
    currentRound.sequence.length;

  ui.setSequenceProgress(
    current,
    total
  );

  if(
    sequenceAnswer[current-1] !==
    currentRound.sequence[current-1]
  ){
    finishSequence(false);
    return;
  }

  if(current===total){
    finishSequence(true);
  }
}

function finishSequence(correct){
  locked=true;

  ui.disableSequenceOptions();

  const points=
    correct?1000:0;

  processScore(points);

  sound(
    correct
      ?"success"
      :"error"
  );

  const firstColor=
    hsl(
      currentRound.palette[
        currentRound.sequence[0]
      ]
    );

  const selectedIndex=
    sequenceAnswer[
      Math.max(
        0,
        sequenceAnswer.length-1
      )
    ]||0;

  const selectedColor=
    hsl(
      currentRound.palette[
        selectedIndex
      ]
    );

  ui.showResult(
    firstColor,
    selectedColor,
    points,
    correct
      ?"Excelente! Você repetiu toda a sequência."
      :"Sequência incorreta. Tente memorizar melhor."
  );

  finishAttempt();
}

function processScore(points){
  score+=points;

  if(points>=800){
    streak++;
  }else{
    streak=0;
  }

  if(points<500){
    lives--;
    streak=0;
  }

  ui.updateStats(
    score,
    streak,
    lives,
    round
  );
}

function finishAttempt(){
  if(lives<=0){
    endGame();
    return;
  }

  ui.setNextEnabled(true);
}

function nextRound(){
  if(lives<=0)return;

  sound("click");

  round++;

  startRound();
}

function endGame(){
  clearInterval(timer);

  locked=true;

  sound("error");

  ui.hideControls();
  ui.setCheckEnabled(false);
  ui.setNextEnabled(false);

  ui.showEndGame(
    score,
    round
  );

  ui.targetMessage.textContent=
    `Fim de jogo! Pontuação: ${score}`;
}

function changeDifficulty(){
  clearInterval(timer);

  sound("click");

  const settings=
    getDifficultySettings();

  score=0;
  streak=0;
  round=1;
  lives=settings.lives;

  startRound();
}

function changeMode(){
  clearInterval(timer);

  sound("click");

  const settings=
    getDifficultySettings();

  score=0;
  streak=0;
  round=1;
  lives=settings.lives;

  startRound();
}

function getResultMessage(points){
  if(points===1000){
    return"Perfeito! Você acertou exatamente.";
  }

  if(points>=900){
    return"Quase perfeito! Excelente percepção.";
  }

  if(points>=800){
    return"Excelente! Você chegou muito perto.";
  }

  if(points>=650){
    return"Muito bom! Continue assim.";
  }

  if(points>=500){
    return"Bom trabalho! Ainda dá para melhorar.";
  }

  if(points>=300){
    return"A cor ficou um pouco distante.";
  }

  return"Você ficou bem longe da resposta.";
}

function updateSoundButton(){
  ui.setSoundButton(
    soundEnabled()
  );
}

function toggleSound(){
  const enabled=
    soundEnabled();

  localStorage.setItem(
    "colorGameSound",
    enabled?"off":"on"
  );

  if(!enabled){
    sound("success");
  }

  updateSoundButton();
}

ui.hue.addEventListener(
  "input",
  updatePreview
);

ui.saturation.addEventListener(
  "input",
  ()=>{
    ui.updateValues();
    updatePreview();
  }
);

ui.lightness.addEventListener(
  "input",
  ()=>{
    ui.updateValues();
    updatePreview();
  }
);

ui.checkButton.addEventListener(
  "click",
  checkMatch
);

ui.nextButton.addEventListener(
  "click",
  nextRound
);

ui.difficulty.addEventListener(
  "change",
  changeDifficulty
);

ui.gameMode.addEventListener(
  "change",
  changeMode
);

ui.soundButton.addEventListener(
  "click",
  toggleSound
);

ui.themeButton.addEventListener(
  "click",
  ()=>{
    const theme=toggleTheme();

    ui.setThemeButton(
      theme==="dark"
    );

    sound("click");
  }
);

ui.speedOptions
  .querySelectorAll(".color-option")
  .forEach(button=>{
    button.addEventListener(
      "click",
      ()=>{
        checkSpeed(
          button.dataset.index
        );
      }
    );
  });

ui.sequenceOptions
  .querySelectorAll(".sequence-color")
  .forEach(button=>{
    button.addEventListener(
      "click",
      ()=>{
        selectSequenceColor(
          button.dataset.index
        );
      }
    );
  });

applySavedTheme();

ui.setThemeButton(
  document.documentElement.dataset.theme==="dark"
);

updateSoundButton();

ui.updateValues();

startRound();