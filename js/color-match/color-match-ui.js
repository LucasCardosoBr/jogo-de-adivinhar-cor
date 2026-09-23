export class ColorMatchUI{
  constructor(){
    this.$=id=>document.getElementById(id);

    // Opções
    this.gameMode=this.$("gameMode");
    this.difficulty=this.$("difficulty");
    this.soundButton=this.$("soundButton");
    this.themeButton=this.$("themeButton");

    // Estatísticas
    this.score=this.$("score");
    this.streak=this.$("streak");
    this.lives=this.$("lives");
    this.round=this.$("round");
    this.timer=this.$("timer");

    // Área da cor
    this.target=this.$("colorTarget");
    this.targetMessage=this.$("targetMessage");

    // Modo combinação
    this.matchControls=this.$("matchControls");
    this.preview=this.$("colorPreview");

    this.hue=this.$("hue");
    this.saturation=this.$("saturation");
    this.lightness=this.$("lightness");

    this.hueValue=this.$("hueValue");
    this.saturationValue=this.$("saturationValue");
    this.lightnessValue=this.$("lightnessValue");

    this.checkButton=this.$("checkButton");

    // Modo relâmpago
    this.speedControls=this.$("speedControls");
    this.speedPreview=this.$("speedPreview");
    this.speedOptions=this.$("speedOptions");

    // Modo sequência
    this.sequenceControls=this.$("sequenceControls");
    this.sequenceMessage=this.$("sequenceMessage");
    this.sequencePreview=this.$("sequencePreview");
    this.sequenceOptions=this.$("sequenceOptions");
    this.sequenceProgress=this.$("sequenceProgress");

    // Resultado
    this.result=this.$("result");
    this.resultTitle=this.$("resultTitle");
    this.originalColor=this.$("originalColor");
    this.guessedColor=this.$("guessedColor");
    this.scoreResult=this.$("scoreResult");
    this.resultMessage=this.$("resultMessage");
    this.nextButton=this.$("nextButton");
  }

  getMode(){
    return this.gameMode.value;
  }

  getDifficulty(){
    return this.difficulty.value;
  }

  getGuess(){
    return{
      h:Number(this.hue.value),
      s:Number(this.saturation.value),
      l:Number(this.lightness.value)
    };
  }

  setColor(element,color){
    if(element)element.style.background=color;
  }

  setTimer(value){
    this.timer.textContent=Math.max(0,value).toFixed(1);
  }

  showTarget(color,message="Memorize esta cor!"){
    this.setColor(this.target,color);
    this.target.classList.remove("hidden-color");
    this.targetMessage.textContent=message;
  }

  hideTarget(message="Agora responda!"){
    this.target.classList.add("hidden-color");
    this.targetMessage.textContent=message;
  }

  showModeControls(mode){
    this.matchControls.classList.add("hidden");
    this.speedControls.classList.add("hidden");
    this.sequenceControls.classList.add("hidden");

    if(mode==="match"){
      this.matchControls.classList.remove("hidden");
    }

    if(mode==="speed"){
      this.speedControls.classList.remove("hidden");
    }

    if(mode==="sequence"){
      this.sequenceControls.classList.remove("hidden");
    }
  }

  hideControls(){
    this.matchControls.classList.add("hidden");
    this.speedControls.classList.add("hidden");
    this.sequenceControls.classList.add("hidden");
  }

  showControls(){
    this.showModeControls(this.getMode());
  }

  hideResult(){
    this.result.classList.add("hidden");
  }

  showResult(target,guess,score,message){
    this.setColor(this.originalColor,target);
    this.setColor(this.guessedColor,guess);

    this.scoreResult.textContent=`${score} / 1000`;
    this.resultMessage.textContent=message;

    this.resultTitle.textContent=
      score>=800
        ?"Excelente!"
        :score>=500
          ?"Muito bom!"
          :"Tente novamente!";

    this.result.classList.remove("hidden");
  }

  showEndGame(score,round){
    this.resultTitle.textContent="Fim de jogo!";
    this.scoreResult.textContent=`${score} pontos`;
    this.resultMessage.textContent=
      `Você chegou à rodada ${round}.`;
    this.result.classList.remove("hidden");
  }

  updatePreview(color){
    this.setColor(this.preview,color);
  }

  updateValues(){
    this.hueValue.textContent=`${this.hue.value}°`;
    this.saturationValue.textContent=`${this.saturation.value}%`;
    this.lightnessValue.textContent=`${this.lightness.value}%`;
  }

  resetSliders(){
    this.hue.value=180;
    this.saturation.value=50;
    this.lightness.value=50;
    this.updateValues();
  }

  updateStats(score,streak,lives,round){
    this.score.textContent=score;
    this.streak.textContent=streak;
    this.lives.textContent=lives;
    this.round.textContent=round;
  }

  setCheckEnabled(enabled){
    this.checkButton.disabled=!enabled;
  }

  setNextEnabled(enabled){
    this.nextButton.disabled=!enabled;
  }

  setSpeedOptions(colors){
    const buttons=[
      ...this.speedOptions.querySelectorAll(".color-option")
    ];

    buttons.forEach((button,index)=>{
      button.disabled=false;
      button.dataset.index=index;

      if(colors[index]){
        this.setColor(button,colors[index]);
      }
    });
  }

  disableSpeedOptions(){
    this.speedOptions
      .querySelectorAll(".color-option")
      .forEach(button=>{
        button.disabled=true;
      });
  }

  setSpeedPreview(color){
    this.setColor(this.speedPreview,color);
  }

  setSequenceOptions(colors){
    const buttons=[
      ...this.sequenceOptions.querySelectorAll(".sequence-color")
    ];

    buttons.forEach((button,index)=>{
      button.disabled=false;
      button.dataset.index=index;

      if(colors[index]){
        this.setColor(button,colors[index]);
      }
    });
  }

  disableSequenceOptions(){
    this.sequenceOptions
      .querySelectorAll(".sequence-color")
      .forEach(button=>{
        button.disabled=true;
      });
  }

  setSequencePreview(colors){
    this.sequencePreview.innerHTML="";

    colors.forEach(color=>{
      const item=document.createElement("span");

      this.setColor(item,color);
      this.sequencePreview.appendChild(item);
    });
  }

  clearSequencePreview(){
    this.sequencePreview.innerHTML="";
  }

  setSequenceProgress(current,total){
    this.sequenceProgress.textContent=`${current} / ${total}`;
  }

  setSequenceMessage(message){
    this.sequenceMessage.textContent=message;
  }

  setSoundButton(enabled){
    this.soundButton.textContent=enabled?"🔊":"🔇";

    this.soundButton.setAttribute(
      "aria-label",
      enabled?"Desativar som":"Ativar som"
    );

    this.soundButton.title=enabled?"Som ligado":"Som desligado";
  }

  setThemeButton(isDark){
    this.themeButton.textContent=isDark?"☀️":"🌙";

    this.themeButton.setAttribute(
      "aria-label",
      isDark
        ?"Ativar tema claro"
        :"Ativar tema escuro"
    );

    this.themeButton.title=
      isDark?"Tema claro":"Tema escuro";
  }

  setTargetVisible(visible){
    this.target.classList.toggle(
      "hidden-color",
      !visible
    );
  }

  reset(){
    this.hideResult();
    this.hideControls();
    this.clearSequencePreview();

    this.setCheckEnabled(false);
    this.setNextEnabled(false);

    this.disableSpeedOptions();
    this.disableSequenceOptions();

    this.setSequenceProgress(0,0);
    this.setTimer(0);
  }
}