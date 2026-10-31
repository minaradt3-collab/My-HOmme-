/* ============ ✏️ EDIT HERE ============ */
const CONFIG = {
  // Photos: put image file names/URLs in "src". Leave src empty to show a placeholder.
  photos: [
    {src:'1.jpg'},
    {src:'2.jpg'},
    {src:'3.jpg'},
    {src:'4.jpg'},
    {src:'5.jpg'},
    {src:'6.jpg'},
    {src:'7.jpg'},
    {src:'8.jpg'},
    {src:'9.jpg'}
  ],
  question: 'Do you want to keep going and read what Manon made for you?',
  goodGirl: 'My Sodo',
  letter: 'You’ll always be my first and my last choice, and as long as you’re in my life, I don’t care who stays and who leaves. ❤️\n\nI’ll always see you as the best thing that ever happened to me, and I’ll never find anyone more beautiful or more tender than you. ❤️\n\nI promise I have no one but you, and my love for you grows manifold, because I feel peaceful and happy with you. ❤️',
  signature: 'Your Manon',
};
/* ===================================== */

const $=id=>document.getElementById(id);
const SONG1='song1.mp3',SONG2='song2.mp3';
let isMuted=false;const song1=$('song1'),song2=$('song2');song1.src=SONG1;song2.src=SONG2;
function fade(a,to,ms,stop){const from=a.volume,t0=performance.now();(function s(t){const p=Math.min((t-t0)/ms,1);try{a.volume=from+(to-from)*p}catch(e){}if(p<1)requestAnimationFrame(s);else if(stop)a.pause()})(t0)}
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('on'));$(id).classList.add('on')}

/* floating hearts background */
const cv=$('fx'),cx=cv.getContext('2d');let W,H,hs=[];
function rs(){W=cv.width=innerWidth;H=cv.height=innerHeight}rs();addEventListener('resize',rs);
function spawn(){hs.push({x:Math.random()*W,y:H+20,s:8+Math.random()*18,v:.6+Math.random()*1.4,a:.15+Math.random()*.5,w:Math.random()*6})}
function heart(x,y,s){cx.beginPath();cx.moveTo(x,y+s*.3);cx.bezierCurveTo(x,y,x-s*.5,y,x-s*.5,y+s*.3);cx.bezierCurveTo(x-s*.5,y+s*.65,x,y+s*.8,x,y+s);cx.bezierCurveTo(x,y+s*.8,x+s*.5,y+s*.65,x+s*.5,y+s*.3);cx.bezierCurveTo(x+s*.5,y,x,y,x,y+s*.3);cx.fill()}
(function loop(){cx.clearRect(0,0,W,H);if(Math.random()<.12)spawn();
  hs=hs.filter(h=>h.y>-40);
  hs.forEach(h=>{h.y-=h.v;h.w+=.03;cx.fillStyle='rgba(255,77,141,'+h.a+')';heart(h.x+Math.sin(h.w)*12,h.y,h.s)});
  requestAnimationFrame(loop)})();

/* build photos */
const P=CONFIG.photos;
P.forEach((p,i)=>{
  const d=document.createElement('div');d.className='slide';
  if(p.src){d.style.backgroundImage='url("'+p.src+'")'}
  else{d.textContent=p.emoji;d.style.background='linear-gradient(135deg,#ff4d8d,#7b2cbf)'}
  $('frame').appendChild(d);
  const dot=document.createElement('i');$('dots').appendChild(dot)
});

let started=false;
$('intro').addEventListener('click',()=>{
  if(started)return;started=true;
  song1.volume=.8;song1.play().catch(()=>{});song2.muted=true;song2.play().then(()=>{song2.pause();song2.currentTime=0;song2.muted=isMuted}).catch(()=>{song2.muted=isMuted});$('mute').style.display='block';
  burst();setTimeout(startPhotos,900)
});
function burst(){for(let i=0;i<40;i++)setTimeout(spawn,i*15)}

function startPhotos(){
  show('photos');let i=0;
  const slides=document.querySelectorAll('.slide'),dots=document.querySelectorAll('.dots i'),nx=$('next'),pv=$('prev');
  function go(n){
    if(n<0)return;
    if(n>=P.length){ask();return}
    i=n;
    slides.forEach(s=>s.classList.remove('show'));dots.forEach(d=>d.classList.remove('a'));
    slides[i].classList.add('show');dots[i].classList.add('a');
    pv.style.visibility=i?'visible':'hidden';
    nx.textContent=i===P.length-1?'♥':'›';
  }
  nx.onclick=()=>go(i+1);pv.onclick=()=>go(i-1);
  let x0=null;const fr=$('frame');
  fr.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});
  fr.addEventListener('touchend',e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>40)go(dx<0?i+1:i-1);else go(i+1)});
  go(0)
}

/* question */
function ask(){
  $('q').textContent=CONFIG.question;show('ask');burst()
}
let scale=1;
const no=$('no'),yes=$('yes');
function dodge(e){
  e&&e.preventDefault();
  no.classList.add('run');
  const w=no.offsetWidth,h=no.offsetHeight;
  no.style.left=Math.random()*(innerWidth-w-20)+10+'px';
  no.style.top=Math.random()*(innerHeight-h-20)+10+'px';
  scale=Math.min(scale+.12,1.8);yes.style.transform='scale('+scale+')'
}
no.addEventListener('pointerenter',dodge);
no.addEventListener('touchstart',dodge,{passive:false});
no.addEventListener('click',dodge);

yes.addEventListener('click',()=>{
  show('letter');burst();fade(song1,0,1200,true);song2.muted=isMuted;song2.currentTime=0;try{song2.volume=0}catch(e){}const pp=song2.play();if(pp)pp.catch(()=>{document.addEventListener('touchstart',()=>song2.play(),{once:true})});fade(song2,.85,1800);
  $('good').textContent=CONFIG.goodGirl;
  type(CONFIG.letter,$('msg'),()=>{$('letter').classList.add('done');$('sign').textContent=CONFIG.signature;$('sign').classList.add('on')})
});
function type(t,el,cb){t=Array.from(t);let k=0;(function n(){el.textContent=t.slice(0,k++).join('');el.scrollIntoView({block:'end'});
  if(k<=t.length)setTimeout(n,45);else cb&&cb()})()}

$('mute').addEventListener('click',()=>{const m=!isMuted;isMuted=m;song1.muted=song2.muted=m;$('mute').textContent=m?'🔇':'🔊'});
