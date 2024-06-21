import { formatTime } from '../utils/dateUtils.js';

export function createArtistCard(artist) {
  const col = document.createElement('div');
  col.classList.add('col-sm-6', 'col-md-4', 'col-lg-3', 'mb-4', 'file-item');
  
  col.innerHTML = `
    <div class="card bg-dark text-white h-100">
      <div class="image-container">
        <img src="${artist.images[0].url}" class="card-img-top" alt="${artist.name}" loading="lazy">
      </div>
      <div class="card-body position-relative">
        <h6 class="card-title">
          <span class="rank-span">#${artist.rank} - </span>
          <span>${artist.name}</span>
        </h6>
        <p class="card-text">${artist.stageName}</p>
        <p class="card-text">${formatTime(artist.startTime)} - ${formatTime(artist.endTime)}</p>
        <a href="https://open.spotify.com/artist/${artist.id}" class="stretched-link" target="_blank">
          <img src="static/Spotify_Icon_RGB_White.png" alt="Spotify Logo" class="spotify-logo">
        </a>
      </div>
    </div>
  `;

  return col;
}