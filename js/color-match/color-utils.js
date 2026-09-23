export function randomHSL(){
  return{
    h:Math.floor(Math.random()*361),
    s:Math.floor(Math.random()*56)+35,
    l:Math.floor(Math.random()*51)+25
  };
}

export function hsl({h,s,l}){
  return `hsl(${h},${s}%,${l}%)`;
}

export function colorDistance(a,b){
  const h=Math.min(Math.abs(a.h-b.h),360-Math.abs(a.h-b.h))/180;
  const s=Math.abs(a.s-b.s)/100;
  const l=Math.abs(a.l-b.l)/100;

  return h*.5+s*.3+l*.2;
}

export function calculateScore(target,guess){
  return Math.max(0,Math.round((1-colorDistance(target,guess))*1000));
}