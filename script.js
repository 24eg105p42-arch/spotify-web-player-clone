// ---------- DATA ----------
const colors = ['#8c67ab','#e8115b','#1e3264','#e13300','#5b8a3d','#af2896','#477d95','#7358ff','#148a08','#ba5d07','#503750','#e0af12'];
const noteEmoji = ['🎧','🎵','🎸','🥁','🎹','🎤','🎷','🪗'];
function rc(i){return colors[i % colors.length];}
function ne(i){return noteEmoji[i % noteEmoji.length];}

const quickPicks = [
  "Liked Songs","Daily Mix 1","Chill Vibes","Discover Weekly",
  "Release Radar","Rock Classics","Deep Focus","Coffee Table Jazz"
];

const madeForYou = [
  {title:"Daily Mix 1", sub:"The Wanderers, Nova Skye, Echo Bloom and more"},
  {title:"Daily Mix 2", sub:"Lunar Drift, Static Bloom, Kite City and more"},
  {title:"Discover Weekly", sub:"Your weekly mixtape of fresh music"},
  {title:"Release Radar", sub:"Catch all the latest music from artists you follow"},
  {title:"On Repeat", sub:"Songs you can't stop playing"},
  {title:"Time Capsule", sub:"Nostalgic tracks that once meant everything"},
];

const albums = [
  {title:"Neon Horizon", sub:"The Wanderers"},
  {title:"Paper Moons", sub:"Nova Skye"},
  {title:"Static Bloom", sub:"Echo Bloom"},
  {title:"Kite City", sub:"Lunar Drift"},
  {title:"Glass Rivers", sub:"Sable & Rue"},
  {title:"Afterglow", sub:"Kepler Blue"},
];

const artists = [
  "The Wanderers","Nova Skye","Echo Bloom","Lunar Drift","Sable & Rue","Kepler Blue"
];

const library = [
  {name:"Liked Songs", sub:"Playlist · 214 songs", type:"pin", emoji:"💚"},
  {name:"Daily Mix 1", sub:"Playlist", type:"round", emoji:"🎧"},
  {name:"The Wanderers", sub:"Artist", type:"round", emoji:"🎤"},
  {name:"Neon Horizon", sub:"Album · The Wanderers", type:"square", emoji:"💿"},
  {name:"Chill Vibes", sub:"Playlist · You", type:"square", emoji:"🌙"},
  {name:"Nova Skye", sub:"Artist", type:"round", emoji:"🎤"},
  {name:"Deep Focus", sub:"Playlist · Spotify", type:"square", emoji:"🧠"},
  {name:"Rock Classics", sub:"Playlist · Spotify", type:"square", emoji:"🎸"},
  {name:"Echo Bloom", sub:"Artist", type:"round", emoji:"🎤"},
  {name:"Coffee Table Jazz", sub:"Playlist · Spotify", type:"square", emoji:"☕"},
];

// ---------- RENDER ----------
function greetingText(){
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
document.getElementById('greeting').textContent = greetingText();

const quickGrid = document.getElementById('quickGrid');
quickPicks.forEach((name,i)=>{
  const el = document.createElement('div');
  el.className = 'quick-card';
  el.innerHTML = `
    <div class="thumb" style="background:${rc(i)}">${ne(i)}</div>
    <div class="qname">${name}</div>
    <div class="play-fab"><svg viewBox="0 0 24 24"><path d="M7.05 3.606c0-.995 1.083-1.609 1.933-1.101l11.54 6.394c.868.516.868 1.72 0 2.236L8.983 17.529c-.85.508-1.933-.106-1.933-1.101V3.606z"/></svg></div>
  `;
  el.addEventListener('click', ()=> loadTrack(name, artists[i % artists.length], rc(i)));
  quickGrid.appendChild(el);
});

function renderCardRow(containerId, items, round){
  const container = document.getElementById(containerId);
  items.forEach((item,i)=>{
    const el = document.createElement('div');
    el.className = 'music-card';
    el.innerHTML = `
      <div class="art ${round?'round':''}" style="background:${rc(i+3)}">${ne(i+2)}</div>
      <div class="card-title">${item.title || item}</div>
      ${item.sub ? `<div class="card-sub">${item.sub}</div>` : `<div class="card-sub">Artist</div>`}
      <div class="play-fab"><svg viewBox="0 0 24 24"><path d="M7.05 3.606c0-.995 1.083-1.609 1.933-1.101l11.54 6.394c.868.516.868 1.72 0 2.236L8.983 17.529c-.85.508-1.933-.106-1.933-1.101V3.606z"/></svg></div>
    `;
    const title = item.title || item;
    const sub = item.sub || 'Artist';
    el.addEventListener('click', ()=> loadTrack(title, round ? title : sub, rc(i+3)));
    container.appendChild(el);
  });
}
renderCardRow('madeForYou', madeForYou, false);
renderCardRow('popularAlbums', albums, false);
renderCardRow('topArtists', artists, true);

const libraryList = document.getElementById('libraryList');
library.forEach((item,i)=>{
  const el = document.createElement('div');
  el.className = 'lib-item';
  el.innerHTML = `
    <div class="lib-thumb ${item.type==='round'?'round':''}" style="background:${rc(i+5)}">${item.emoji}</div>
    <div class="lib-meta">
      <div class="lib-name">${item.name}</div>
      <div class="lib-sub">${item.sub}</div>
    </div>
    ${item.type==='pin' ? '<span class="pin">📌</span>' : ''}
  `;
  el.addEventListener('click', ()=> loadTrack(item.name, item.sub.split('·')[0].trim(), rc(i+5)));
  libraryList.appendChild(el);
});

// ---------- PLAYER LOGIC ----------
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const npTitle = document.getElementById('npTitle');
const npArtist = document.getElementById('npArtist');
const npArt = document.getElementById('npArt');
const likeBtn = document.getElementById('likeBtn');
const seekTrack = document.getElementById('seekTrack');
const seekFill = document.getElementById('seekFill');
const seekThumb = document.getElementById('seekThumb');
const curTimeEl = document.getElementById('curTime');
const totalTimeEl = document.getElementById('totalTime');
const volTrack = document.getElementById('volTrack');
const volFill = document.getElementById('volFill');
const volThumb = document.getElementById('volThumb');
const muteBtn = document.getElementById('muteBtn');

let isPlaying = false;
let progress = 0.22; // fraction
let duration = 287; // seconds ~ 4:47
let volume = 0.7;
let lastVolume = 0.7;
let timer = null;

function fmt(sec){
  sec = Math.max(0, Math.floor(sec));
  const m = Math.floor(sec/60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2,'0')}`;
}

function updateSeekUI(){
  const pct = (progress*100).toFixed(2)+'%';
  seekFill.style.width = pct;
  seekThumb.style.left = pct;
  curTimeEl.textContent = fmt(progress*duration);
  totalTimeEl.textContent = fmt(duration);
}
function updateVolUI(){
  const pct = (volume*100).toFixed(0)+'%';
  volFill.style.width = pct;
  volThumb.style.left = pct;
}

function play(){
  isPlaying = true;
  playIcon.style.display='none';
  pauseIcon.style.display='block';
  playPauseBtn.title = 'Pause';
  if(timer) clearInterval(timer);
  timer = setInterval(()=>{
    progress += 1/duration;
    if(progress >= 1){ progress = 0; }
    updateSeekUI();
  }, 1000);
}
function pause(){
  isPlaying = false;
  playIcon.style.display='block';
  pauseIcon.style.display='none';
  playPauseBtn.title = 'Play';
  if(timer) clearInterval(timer);
}
playPauseBtn.addEventListener('click', ()=> isPlaying ? pause() : play());

function loadTrack(title, artist, color){
  npTitle.textContent = title;
  npArtist.textContent = artist;
  npArt.style.background = color;
  progress = 0;
  duration = 180 + Math.floor(Math.random()*150);
  updateSeekUI();
  play();
}

likeBtn.addEventListener('click', ()=> likeBtn.classList.toggle('liked'));

function seekFromEvent(e, track, isVol){
  const rect = track.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  let frac = x / rect.width;
  frac = Math.min(1, Math.max(0, frac));
  if(isVol){
    volume = frac;
    updateVolUI();
  } else {
    progress = frac;
    updateSeekUI();
  }
}
function bindDrag(track, isVol){
  let dragging = false;
  track.addEventListener('mousedown', (e)=>{ dragging = true; seekFromEvent(e, track, isVol); });
  window.addEventListener('mousemove', (e)=>{ if(dragging) seekFromEvent(e, track, isVol); });
  window.addEventListener('mouseup', ()=> dragging = false);
  track.addEventListener('click', (e)=> seekFromEvent(e, track, isVol));
}
bindDrag(seekTrack, false);
bindDrag(volTrack, true);

muteBtn.addEventListener('click', ()=>{
  if(volume > 0){ lastVolume = volume; volume = 0; }
  else { volume = lastVolume || 0.7; }
  updateVolUI();
});

// init
updateSeekUI();
updateVolUI();
