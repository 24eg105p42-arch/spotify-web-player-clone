/* ============================================================
   HOME.JS — renders the homepage sections using data from common.js
   ============================================================ */

function greetingText(){
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function noteEmoji(i){
  const notes = ['🎧','🎵','🎸','🥁','🎹','🎤','🎷','🪗'];
  return notes[i % notes.length];
}

function makePlayFab(onPlay){
  const fab = document.createElement('div');
  fab.className = 'play-fab';
  fab.innerHTML = `<svg viewBox="0 0 24 24"><path d="M7.05 3.606c0-.995 1.083-1.609 1.933-1.101l11.54 6.394c.868.516.868 1.72 0 2.236L8.983 17.529c-.85.508-1.933-.106-1.933-1.101V3.606z"/></svg>`;
  fab.addEventListener('click', (e)=>{ e.stopPropagation(); onPlay(); });
  return fab;
}

document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('greeting').textContent = greetingText();

  // ---- Quick picks (mix of playlists) ----
  const quickGrid = document.getElementById('quickGrid');
  PLAYLISTS.slice(0,8).forEach((p,i)=>{
    const el = document.createElement('div');
    el.className = 'quick-card';
    el.innerHTML = `<div class="thumb" style="background:${p.color}">${noteEmoji(i)}</div><div class="qname">${p.title}</div>`;
    el.appendChild(makePlayFab(()=> loadTrack(p.tracks[0].title, artistName(p.tracks[0].artistId), p.color)));
    el.addEventListener('click', ()=> window.location.href = `playlist.html?type=playlist&id=${p.id}`);
    quickGrid.appendChild(el);
  });

  // ---- Made for you (playlists) ----
  const madeForYou = document.getElementById('madeForYou');
  PLAYLISTS.forEach((p,i)=>{
    const el = document.createElement('div');
    el.className = 'music-card';
    el.innerHTML = `
      <div class="art" style="background:${p.color}">${noteEmoji(i+2)}</div>
      <div class="card-title">${p.title}</div>
      <div class="card-sub">${p.desc}</div>
    `;
    el.appendChild(makePlayFab(()=> loadTrack(p.tracks[0].title, artistName(p.tracks[0].artistId), p.color)));
    el.addEventListener('click', ()=> window.location.href = `playlist.html?type=playlist&id=${p.id}`);
    madeForYou.appendChild(el);
  });

  // ---- Popular albums ----
  const popularAlbums = document.getElementById('popularAlbums');
  ALBUMS.forEach((al,i)=>{
    const el = document.createElement('div');
    el.className = 'music-card';
    el.innerHTML = `
      <div class="art" style="background:${al.color}">${noteEmoji(i+3)}</div>
      <div class="card-title">${al.title}</div>
      <div class="card-sub">${artistName(al.artistId)}</div>
    `;
    el.appendChild(makePlayFab(()=> loadTrack(al.tracks[0].title, artistName(al.artistId), al.color)));
    el.addEventListener('click', ()=> window.location.href = `playlist.html?type=album&id=${al.id}`);
    popularAlbums.appendChild(el);
  });

  // ---- Top artists ----
  const topArtists = document.getElementById('topArtists');
  ARTISTS.forEach((a,i)=>{
    const el = document.createElement('div');
    el.className = 'music-card';
    el.innerHTML = `
      <div class="art round avatar" style="background:${a.color}"><span>${a.mono}</span></div>
      <div class="card-title">${a.name}</div>
      <div class="card-sub">Artist</div>
    `;
    el.appendChild(makePlayFab(()=>{
      const al = ALBUMS.find(x=>x.artistId===a.id);
      loadTrack(al ? al.tracks[0].title : a.name, a.name, a.color);
    }));
    el.addEventListener('click', ()=> window.location.href = `artist.html?id=${a.id}`);
    topArtists.appendChild(el);
  });
});
