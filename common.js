/* ============================================================
   COMMON.JS
   Shared data + sidebar rendering + now-playing bar logic.
   Include this on every page, before the page-specific script.
   ============================================================ */

// ---------- COLOR / EMOJI HELPERS ----------
const PALETTE = ['#8c67ab','#e8115b','#1e3264','#e13300','#5b8a3d','#af2896','#477d95','#7358ff','#148a08','#ba5d07','#503750','#e0af12'];
function colorFor(seed){
  let hash = 0;
  for(let i=0;i<seed.length;i++) hash = seed.charCodeAt(i) + ((hash<<5)-hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}
function monogram(name){
  return name.split(' ').filter(w=>w[0] && w[0] !== '&' && w[0] !== 'T' || true)
    .map(w=>w[0]).join('').replace(/[^A-Za-z0-9]/g,'').slice(0,2).toUpperCase() || name[0].toUpperCase();
}

// ---------- DATA MODEL ----------
const ARTISTS = [
  { id:'the-wanderers', name:'The Wanderers', genre:'Indie Rock', listeners:'2,340,912',
    bio:"The Wanderers formed in a basement rehearsal space and built a following on sprawling, atmospheric guitar work and diaristic lyrics. Their sound blends jangly indie rock with widescreen, cinematic production." },
  { id:'nova-skye', name:'Nova Skye', genre:'Dream Pop', listeners:'1,802,455',
    bio:"Nova Skye writes hazy, reverb-drenched pop songs about memory and distance. Her breakout record put her on festival main stages within a year of its release." },
  { id:'echo-bloom', name:'Echo Bloom', genre:'Electronic', listeners:'3,110,208',
    bio:"Echo Bloom is a producer known for lush, textured electronic soundscapes that sit somewhere between ambient and dance music." },
  { id:'lunar-drift', name:'Lunar Drift', genre:'Synthwave', listeners:'987,340',
    bio:"Lunar Drift makes retro-futuristic synth music built for late-night drives, drawing equally from 80s film scores and modern synthwave." },
  { id:'sable-and-rue', name:'Sable & Rue', genre:'Soul', listeners:'1,455,690',
    bio:"Sable & Rue is a duo blending classic soul songwriting with modern production, known for their tight vocal harmonies and live horn sections." },
  { id:'kepler-blue', name:'Kepler Blue', genre:'Alt Pop', listeners:'2,900,117',
    bio:"Kepler Blue writes anthemic alt-pop with sharp hooks and confessional lyrics, quickly becoming a fixture on radio and playlists alike." },
  { id:'static-fields', name:'Static Fields', genre:'Post-Rock', listeners:'640,233',
    bio:"Static Fields crafts instrumental post-rock built around slow-building crescendos and layered guitar textures." },
  { id:'coral-house', name:'Coral House', genre:'Jazz', listeners:'512,880',
    bio:"Coral House is a jazz collective reinterpreting classic standards alongside original compositions rooted in modern harmony." },
];
ARTISTS.forEach(a => { a.color = colorFor(a.id); a.mono = monogram(a.name); });

function artistById(id){ return ARTISTS.find(a=>a.id===id); }
function artistName(id){ const a = artistById(id); return a ? a.name : id; }

const ALBUMS = [
  { id:'neon-horizon', title:'Neon Horizon', artistId:'the-wanderers', year:2023,
    tracks:[
      {title:'Neon Horizon', duration:224},{title:'Static Lines', duration:198},
      {title:'Empty Rooms', duration:251},{title:'Halfway Home', duration:214},
      {title:'Glass and Gold', duration:267},{title:'Afterthought', duration:189},
    ]},
  { id:'paper-moons', title:'Paper Moons', artistId:'nova-skye', year:2022,
    tracks:[
      {title:'Paper Moons', duration:201},{title:'Slow Fade', duration:233},
      {title:'Weightless', duration:210},{title:'Reruns', duration:196},
      {title:'Blue Hour', duration:244},
    ]},
  { id:'static-bloom', title:'Static Bloom', artistId:'echo-bloom', year:2024,
    tracks:[
      {title:'Static Bloom', duration:257},{title:'Undertow', duration:222},
      {title:'Half Light', duration:239},{title:'Drift', duration:301},
    ]},
  { id:'kite-city', title:'Kite City', artistId:'lunar-drift', year:2021,
    tracks:[
      {title:'Kite City', duration:264},{title:'Night Drive', duration:248},
      {title:'Chrome', duration:212},{title:'Skyline', duration:229},
    ]},
  { id:'glass-rivers', title:'Glass Rivers', artistId:'sable-and-rue', year:2023,
    tracks:[
      {title:'Glass Rivers', duration:243},{title:'Hold On', duration:198},
      {title:'Lighthouse', duration:227},
    ]},
  { id:'afterglow', title:'Afterglow', artistId:'kepler-blue', year:2024,
    tracks:[
      {title:'Afterglow', duration:191},{title:'Say It Twice', duration:205},
      {title:'Comedown', duration:216},{title:'Fireproof', duration:199},
    ]},
];
ALBUMS.forEach(al => { al.color = colorFor(al.id); });

function albumById(id){ return ALBUMS.find(a=>a.id===id); }

const PLAYLISTS = [
  { id:'daily-mix-1', title:'Daily Mix 1', desc:'The Wanderers, Nova Skye, Echo Bloom and more',
    tracks:[
      {title:'Neon Horizon', artistId:'the-wanderers', duration:224},
      {title:'Paper Moons', artistId:'nova-skye', duration:201},
      {title:'Static Bloom', artistId:'echo-bloom', duration:257},
      {title:'Kite City', artistId:'lunar-drift', duration:264},
      {title:'Glass Rivers', artistId:'sable-and-rue', duration:243},
    ]},
  { id:'daily-mix-2', title:'Daily Mix 2', desc:'Lunar Drift, Static Fields, Kepler Blue and more',
    tracks:[
      {title:'Night Drive', artistId:'lunar-drift', duration:248},
      {title:'Afterglow', artistId:'kepler-blue', duration:191},
      {title:'Halfway Home', artistId:'the-wanderers', duration:214},
    ]},
  { id:'discover-weekly', title:'Discover Weekly', desc:'Your weekly mixtape of fresh music',
    tracks:[
      {title:'Undertow', artistId:'echo-bloom', duration:222},
      {title:'Weightless', artistId:'nova-skye', duration:210},
      {title:'Hold On', artistId:'sable-and-rue', duration:198},
    ]},
  { id:'release-radar', title:'Release Radar', desc:'Catch all the latest music from artists you follow',
    tracks:[
      {title:'Say It Twice', artistId:'kepler-blue', duration:205},
      {title:'Chrome', artistId:'lunar-drift', duration:212},
    ]},
  { id:'chill-vibes', title:'Chill Vibes', desc:'Laid-back tracks for slow afternoons',
    tracks:[
      {title:'Blue Hour', artistId:'nova-skye', duration:244},
      {title:'Lighthouse', artistId:'sable-and-rue', duration:227},
      {title:'Drift', artistId:'echo-bloom', duration:301},
    ]},
  { id:'rock-classics', title:'Rock Classics', desc:'Guitar-driven favorites',
    tracks:[
      {title:'Empty Rooms', artistId:'the-wanderers', duration:251},
      {title:'Skyline', artistId:'lunar-drift', duration:229},
    ]},
  { id:'deep-focus', title:'Deep Focus', desc:'Keep calm and focus with ambient sound',
    tracks:[
      {title:'Half Light', artistId:'echo-bloom', duration:239},
      {title:'Comedown', artistId:'kepler-blue', duration:216},
    ]},
  { id:'coffee-table-jazz', title:'Coffee Table Jazz', desc:'Jazz for the moments in between',
    tracks:[
      {title:'Fireproof', artistId:'kepler-blue', duration:199},
      {title:'Static Lines', artistId:'the-wanderers', duration:198},
    ]},
];
PLAYLISTS.forEach(p => { p.color = colorFor(p.id); });

function playlistById(id){ return PLAYLISTS.find(p=>p.id===id); }

const GENRES = [
  {name:'Pop', color:'#8c1932'},{name:'Hip-Hop', color:'#e8115b'},
  {name:'Rock', color:'#1e3264'},{name:'Indie', color:'#e13300'},
  {name:'Electronic', color:'#7358ff'},{name:'Jazz', color:'#477d95'},
  {name:'Soul', color:'#af2896'},{name:'Chill', color:'#148a08'},
  {name:'Focus', color:'#503750'},{name:'Synthwave', color:'#ba5d07'},
  {name:'Post-Rock', color:'#5b8a3d'},{name:'Alt Pop', color:'#e0af12'},
];

// A flat, searchable index of everything
function buildSearchIndex(){
  const idx = [];
  ARTISTS.forEach(a => idx.push({type:'Artist', title:a.name, sub:a.genre, id:a.id, color:a.color, mono:a.mono}));
  ALBUMS.forEach(al => idx.push({type:'Album', title:al.title, sub:artistName(al.artistId), id:al.id, color:al.color}));
  PLAYLISTS.forEach(p => idx.push({type:'Playlist', title:p.title, sub:p.desc, id:p.id, color:p.color}));
  ALBUMS.forEach(al => al.tracks.forEach(t => idx.push({type:'Song', title:t.title, sub:artistName(al.artistId), id:al.id, color:al.color})));
  return idx;
}

function fmtDuration(sec){
  const m = Math.floor(sec/60), s = sec % 60;
  return `${m}:${s.toString().padStart(2,'0')}`;
}

// ---------- LIBRARY SIDEBAR DATA ----------
const LIBRARY_ITEMS = [
  {name:'Liked Songs', sub:'Playlist · 214 songs', kind:'liked', emoji:'💚', href:null},
  {name:'Daily Mix 1', sub:'Playlist', kind:'playlist', id:'daily-mix-1', emoji:'🎧'},
  {name:'The Wanderers', sub:'Artist', kind:'artist', id:'the-wanderers', emoji:'🎤'},
  {name:'Neon Horizon', sub:'Album · The Wanderers', kind:'album', id:'neon-horizon', emoji:'💿'},
  {name:'Chill Vibes', sub:'Playlist · You', kind:'playlist', id:'chill-vibes', emoji:'🌙'},
  {name:'Nova Skye', sub:'Artist', kind:'artist', id:'nova-skye', emoji:'🎤'},
  {name:'Deep Focus', sub:'Playlist · Spotify', kind:'playlist', id:'deep-focus', emoji:'🧠'},
  {name:'Rock Classics', sub:'Playlist · Spotify', kind:'playlist', id:'rock-classics', emoji:'🎸'},
  {name:'Echo Bloom', sub:'Artist', kind:'artist', id:'echo-bloom', emoji:'🎤'},
  {name:'Coffee Table Jazz', sub:'Playlist · Spotify', kind:'playlist', id:'coffee-table-jazz', emoji:'☕'},
];

function hrefFor(kind, id){
  if(kind==='artist') return `artist.html?id=${id}`;
  if(kind==='album') return `playlist.html?type=album&id=${id}`;
  if(kind==='playlist') return `playlist.html?type=playlist&id=${id}`;
  return '#';
}

function renderSidebarLibrary(){
  const el = document.getElementById('libraryList');
  if(!el) return;
  LIBRARY_ITEMS.forEach((item,i)=>{
    const row = document.createElement('div');
    row.className = 'lib-item';
    const round = item.kind === 'artist';
    row.innerHTML = `
      <div class="lib-thumb ${round?'round':''}" style="background:${colorFor(item.name)}">${item.emoji}</div>
      <div class="lib-meta">
        <div class="lib-name">${item.name}</div>
        <div class="lib-sub">${item.sub}</div>
      </div>
      ${item.kind==='liked' ? '<span class="pin">📌</span>' : ''}
    `;
    row.addEventListener('click', ()=>{
      const href = item.kind==='liked' ? null : hrefFor(item.kind, item.id);
      if(href) window.location.href = href;
    });
    el.appendChild(row);
  });
}

function highlightNav(){
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item[data-page]').forEach(el=>{
    el.classList.toggle('active', el.getAttribute('data-page') === path);
  });
}

// ---------- NOW PLAYING BAR ----------
let isPlaying = false;
let progress = 0;
let duration = 210;
let volume = 0.7;
let lastVolume = 0.7;
let timer = null;

function fmtTime(sec){
  sec = Math.max(0, Math.floor(sec));
  return `${Math.floor(sec/60)}:${(sec%60).toString().padStart(2,'0')}`;
}

function initNowBar(){
  const playPauseBtn = document.getElementById('playPauseBtn');
  if(!playPauseBtn) return; // page has no now-bar

  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const seekTrack = document.getElementById('seekTrack');
  const seekFill = document.getElementById('seekFill');
  const seekThumb = document.getElementById('seekThumb');
  const curTimeEl = document.getElementById('curTime');
  const totalTimeEl = document.getElementById('totalTime');
  const volTrack = document.getElementById('volTrack');
  const volFill = document.getElementById('volFill');
  const volThumb = document.getElementById('volThumb');
  const muteBtn = document.getElementById('muteBtn');
  const likeBtn = document.getElementById('likeBtn');

  function updateSeekUI(){
    const pct = (progress*100).toFixed(2)+'%';
    seekFill.style.width = pct;
    seekThumb.style.left = pct;
    curTimeEl.textContent = fmtTime(progress*duration);
    totalTimeEl.textContent = fmtTime(duration);
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

  window.loadTrack = function(title, artist, color){
    document.getElementById('npTitle').textContent = title;
    document.getElementById('npArtist').textContent = artist;
    document.getElementById('npArt').style.background = color;
    document.getElementById('npArt').textContent = '🎵';
    progress = 0;
    duration = 180 + Math.floor(Math.random()*150);
    updateSeekUI();
    play();
  };

  likeBtn.addEventListener('click', ()=> likeBtn.classList.toggle('liked'));

  function seekFromEvent(e, track, isVol){
    const rect = track.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    let frac = Math.min(1, Math.max(0, x / rect.width));
    if(isVol){ volume = frac; updateVolUI(); }
    else { progress = frac; updateSeekUI(); }
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

  updateSeekUI();
  updateVolUI();
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderSidebarLibrary();
  highlightNav();
  initNowBar();
});
