/* ============================================================
   PLAYLIST.JS — renders a playlist or album detail page
   based on ?type=playlist|album and ?id=
   ============================================================ */

function trackIconSvg2(){
  return `<svg viewBox="0 0 24 24"><path d="M7.05 3.606c0-.995 1.083-1.609 1.933-1.101l11.54 6.394c.868.516.868 1.72 0 2.236L8.983 17.529c-.85.508-1.933-.106-1.933-1.101V3.606z"/></svg>`;
}

document.addEventListener('DOMContentLoaded', ()=>{
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type') || 'playlist';
  const id = params.get('id') || PLAYLISTS[0].id;

  let title, subtitle, color, tracks, kindLabel, ownerLine;

  if(type === 'album'){
    const album = albumById(id) || ALBUMS[0];
    title = album.title;
    color = album.color;
    kindLabel = 'Album';
    tracks = album.tracks.map(t => ({title:t.title, artistName: artistName(album.artistId), duration:t.duration, color}));
    ownerLine = `<b>${artistName(album.artistId)}</b> · ${album.year} · ${album.tracks.length} songs`;
  } else {
    const playlist = playlistById(id) || PLAYLISTS[0];
    title = playlist.title;
    color = playlist.color;
    kindLabel = 'Playlist';
    tracks = playlist.tracks.map(t => ({title:t.title, artistName: artistName(t.artistId), duration:t.duration, color: artistById(t.artistId)?.color || color}));
    ownerLine = `<b>Spotify</b> · ${playlist.desc} · ${playlist.tracks.length} songs`;
  }

  document.title = `${title} - Spotify Web Player Clone`;
  document.getElementById('mainPanel').style.background =
    `linear-gradient(180deg, ${color} 0, var(--bg) 340px)`;
  document.getElementById('heroArt').style.background = color;
  document.getElementById('heroArt').textContent = type === 'album' ? '💿' : '🎧';
  document.getElementById('heroKind').textContent = kindLabel;
  document.getElementById('heroTitle').textContent = title;
  document.getElementById('heroMeta').innerHTML = ownerLine;

  const bigPlay = document.getElementById('bigPlay');
  bigPlay.addEventListener('click', ()=>{
    if(tracks.length) loadTrack(tracks[0].title, tracks[0].artistName, tracks[0].color);
  });

  const tableEl = document.getElementById('trackTable');
  tracks.forEach((t,i)=>{
    const row = document.createElement('div');
    row.className = 'track-row';
    row.innerHTML = `
      <div class="track-index">${i+1}</div>
      <div class="track-main">
        <div class="track-thumb" style="background:${t.color}">🎵</div>
        <div class="track-info">
          <div class="track-title">${t.title}</div>
          <div class="track-artist">${t.artistName}</div>
        </div>
      </div>
      <div class="track-duration">${fmtDuration(t.duration)}</div>
    `;
    row.querySelector('.track-index').insertAdjacentHTML('afterend',
      `<div class="track-index-play">${trackIconSvg2()}</div>`);
    row.addEventListener('click', ()=> loadTrack(t.title, t.artistName, t.color));
    tableEl.appendChild(row);
  });
});
