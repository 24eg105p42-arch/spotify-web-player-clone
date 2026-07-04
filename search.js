/* ============================================================
   SEARCH.JS — genre browsing + live search filtering
   ============================================================ */

document.addEventListener('DOMContentLoaded', ()=>{
  const genreGrid = document.getElementById('genreGrid');
  GENRES.forEach(g=>{
    const el = document.createElement('div');
    el.className = 'genre-tile';
    el.style.background = g.color;
    el.textContent = g.name;
    el.addEventListener('click', ()=>{
      document.getElementById('searchInput').value = g.name;
      runSearch(g.name);
    });
    genreGrid.appendChild(el);
  });

  const index = buildSearchIndex();
  const input = document.getElementById('searchInput');
  const browseSection = document.getElementById('browseSection');
  const resultsSection = document.getElementById('resultsSection');
  const resultsList = document.getElementById('resultsList');

  function hrefForResult(item){
    if(item.type === 'Artist') return `artist.html?id=${item.id}`;
    if(item.type === 'Album') return `playlist.html?type=album&id=${item.id}`;
    if(item.type === 'Playlist') return `playlist.html?type=playlist&id=${item.id}`;
    // Song -> open its album
    return `playlist.html?type=album&id=${item.id}`;
  }

  function runSearch(query){
    const q = query.trim().toLowerCase();
    if(!q){
      browseSection.style.display = '';
      resultsSection.style.display = 'none';
      return;
    }
    const matches = index.filter(item =>
      item.title.toLowerCase().includes(q) || (item.sub && item.sub.toLowerCase().includes(q))
    ).slice(0, 20);

    browseSection.style.display = 'none';
    resultsSection.style.display = '';
    resultsList.innerHTML = '';

    if(matches.length === 0){
      resultsList.innerHTML = `<p style="color:var(--text-subdued); padding:12px;">No results found for "${query}"</p>`;
      return;
    }

    matches.forEach(item=>{
      const row = document.createElement('div');
      row.className = 'result-row';
      const round = item.type === 'Artist';
      row.innerHTML = `
        <div class="result-thumb ${round?'round':''}" style="background:${item.color}">${round ? (item.mono||'') : '🎵'}</div>
        <div>
          <div class="result-title">${item.title}</div>
          <div class="result-sub">${item.sub || ''}</div>
        </div>
        <div class="result-type">${item.type}</div>
      `;
      row.addEventListener('click', ()=>{
        if(item.type === 'Song'){
          loadTrack(item.title, item.sub, item.color);
        } else {
          window.location.href = hrefForResult(item);
        }
      });
      resultsList.appendChild(row);
    });
  }

  input.addEventListener('input', ()=> runSearch(input.value));
});
