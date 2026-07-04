/* ============================================================
   ARTIST.JS — renders an artist detail page based on ?id=
   ============================================================ */

function trackIconSvg(){
  return `<svg viewBox="0 0 24 24"><path d="M7.05 3.606c0-.995 1.083-1.609 1.933-1.101l11.54 6.394c.868.516.868 1.72 0 2.236L8.983 17.529c-.85.508-1.933-.106-1.933-1.101V3.606z"/></svg>`;
}

document.addEventListener('DOMContentLoaded', ()=>{
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || ARTISTS[0].id;
  const artist = artistById(id) || ARTISTS[0];

  // ---- Hero ----
  document.getElementById('mainPanel').style.background =
    `linear-gradient(180deg, ${artist.color} 0, var(--bg) 340px)`;
  document.getElementById('heroArt').style.background = artist.color;
  document.getElementById('heroArt').innerHTML = `<span>${artist.mono}</span>`;
  document.getElementById('heroTitle').textContent = artist.name;
  document.getElementById('heroListeners').textContent = artist.listeners;
  document.getElementById('bioText').textContent = artist.bio;
  document.title = `${artist.name} - Spotify Web Player Clone`;

  // ---- Popular tracks (pulled from this artist's albums) ----
  const artistAlbums = ALBUMS.filter(a => a.artistId === artist.id);
  const popularTracks = [];
  artistAlbums.forEach(al => al.tracks.forEach(t => popularTracks.push({...t, albumColor: al.color})));
  const topFive = popularTracks.slice(0, 5);

  const bigPlay = document.getElementById('bigPlay');
  bigPlay.addEventListener('click', ()=>{
    if(topFive.length) loadTrack(topFive[0].title, artist.name, artist.color);
  });

  const followBtn = document.getElementById('followBtn');
  let following = false;
  followBtn.addEventListener('click', ()=>{
    following = !following;
    followBtn.textContent = following ? 'Following' : 'Follow';
    followBtn.style.borderColor = following ? 'var(--text-white)' : '#727272';
  });

  const popularEl = document.getElementById('popularTracks');
  topFive.forEach((t,i)=>{
    const row = document.createElement('div');
    row.className = 'track-row';
    row.innerHTML = `
      <div class="track-index">${i+1}</div>
      <div class="track-main">
        <div class="track-thumb" style="background:${t.albumColor}">🎵</div>
        <div class="track-info">
          <div class="track-title">${t.title}</div>
          <div class="track-artist">${artist.name}</div>
        </div>
      </div>
      <div class="track-duration">${fmtDuration(t.duration)}</div>
    `;
    row.querySelector('.track-index').insertAdjacentHTML('afterend',
      `<div class="track-index-play">${trackIconSvg()}</div>`);
    row.addEventListener('click', ()=> loadTrack(t.title, artist.name, t.albumColor));
    popularEl.appendChild(row);
  });
  if(topFive.length === 0){
    popularEl.innerHTML = '<p style="color:var(--text-subdued); padding:12px;">No tracks yet.</p>';
  }

  // ---- Discography ----
  const discoEl = document.getElementById('discography');
  if(artistAlbums.length === 0){
    document.querySelectorAll('.section-title')[1]?.closest('.section')?.remove();
  }
  artistAlbums.forEach(al=>{
    const el = document.createElement('div');
    el.className = 'music-card';
    el.innerHTML = `
      <div class="art" style="background:${al.color}">💿</div>
      <div class="card-title">${al.title}</div>
      <div class="card-sub">${al.year} · Album</div>
    `;
    el.addEventListener('click', ()=> window.location.href = `playlist.html?type=album&id=${al.id}`);
    discoEl.appendChild(el);
  });

  // ---- Fans also like (other artists) ----
  const similarEl = document.getElementById('similarArtists');
  ARTISTS.filter(a=>a.id !== artist.id).slice(0,6).forEach(a=>{
    const el = document.createElement('div');
    el.className = 'music-card';
    el.innerHTML = `
      <div class="art round avatar" style="background:${a.color}"><span>${a.mono}</span></div>
      <div class="card-title">${a.name}</div>
      <div class="card-sub">Artist</div>
    `;
    el.addEventListener('click', ()=> window.location.href = `artist.html?id=${a.id}`);
    similarEl.appendChild(el);
  });
});
