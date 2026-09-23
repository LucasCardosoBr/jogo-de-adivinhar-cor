let audioContext;

function getAudioContext(){
  if(!audioContext){
    const AudioContext=
      window.AudioContext||
      window.webkitAudioContext;

    if(!AudioContext)return null;

    audioContext=new AudioContext();
  }

  return audioContext;
}

export function playSound(
  type,
  enabled=true
){
  if(!enabled)return;

  try{
    const context=getAudioContext();

    if(!context)return;

    if(context.state==="suspended"){
      context.resume();
    }

    const oscillator=
      context.createOscillator();

    const gain=
      context.createGain();

    oscillator.connect(gain);
    gain.connect(context.destination);

    const sounds={
      success:{
        frequency:620,
        duration:.55,
        volume:.16
      },

      click:{
        frequency:380,
        duration:.30,
        volume:.12
      },

      error:{
        frequency:180,
        duration:.60,
        volume:.14
      }
    };

    const sound=
      sounds[type]||sounds.click;

    const now=context.currentTime;

    oscillator.type="sine";

    oscillator.frequency.setValueAtTime(
      sound.frequency,
      now
    );

    gain.gain.setValueAtTime(
      0.001,
      now
    );

    gain.gain.linearRampToValueAtTime(
      sound.volume,
      now+.05
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now+sound.duration
    );

    oscillator.start(now);

    oscillator.stop(
      now+sound.duration
    );

  }catch{
    // Áudio indisponível.
  }
}