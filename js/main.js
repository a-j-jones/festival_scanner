import config from './config/config.js';
import SpotifyService from './services/spotifyService.js';
import FestivalService from './services/festivalService.js';
import { createArtistCard } from './components/ArtistCard.js';
import { createFestivalSelector } from './components/FestivalSelector.js';
import { groupArtistsByDay } from './utils/dateUtils.js';

const loginButton = document.getElementById('login-button');
const artistList = document.getElementById('artist-list');

let selectedFestival = null;

async function init() {
  const festivals = await FestivalService.getFestivals();
  createFestivalSelector(festivals, selectFestival);
  
  const storedToken = SpotifyService.getStoredAccessToken();
  if (storedToken) {
    SpotifyService.setAccessToken(storedToken);
    loginButton.hidden = true;
    
    // Select the first festival by default
    const firstFestival = Object.entries(festivals)[0];
    selectFestival(firstFestival[0], firstFestival[1]);
    
    await getMatchingArtists();
  } else {
    loginButton.hidden = false;
  }
}

function selectFestival(name, file) {
  selectedFestival = { name, file };
  document.getElementById('selected-festival').textContent = name;
  getMatchingArtists();
}

async function getMatchingArtists(refresh = false) {
  if (!selectedFestival) return;

  try {
    artistList.innerHTML = '<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>';

    let spotifyArtists;
    if (refresh || !localStorage.getItem('spotifyArtists')) {
      spotifyArtists = await getAllSpotifyArtists();
      localStorage.setItem('spotifyArtists', JSON.stringify(spotifyArtists));
    } else {
      spotifyArtists = JSON.parse(localStorage.getItem('spotifyArtists'));
    }

    const festivalArtists = await FestivalService.getFestivalArtists(selectedFestival.file);
    const matchedArtists = FestivalService.matchArtistsWithFestival(spotifyArtists, festivalArtists);
    updateArtistList(matchedArtists);
  } catch (error) {
    console.error('Error retrieving matching artists:', error);
    artistList.innerHTML = '<p class="text-danger">Error retrieving matching artists. Please try again later.</p>';
    localStorage.removeItem('accessToken');
    loginButton.hidden = false;
  }
}

async function getAllSpotifyArtists() {
  const limit = 20;
  const maxLimit = 250;
  const { total, items: firstBatch } = await SpotifyService.getTopArtists(limit);
  const remainingRequests = Math.ceil((Math.min(total, maxLimit) - limit) / limit);

  const additionalBatches = await Promise.all(
    Array.from({ length: remainingRequests }, (_, i) => 
      SpotifyService.getTopArtists(limit, (i + 1) * limit)
    )
  );

  return [firstBatch, ...additionalBatches.map(batch => batch.items)].flat();
}

function updateArtistList(artists) {
  const groupedArtists = groupArtistsByDay(artists);
  
  artistList.innerHTML = Object.entries(groupedArtists)
    .sort(([dayA], [dayB]) => new Date(dayA) - new Date(dayB))
    .map(([day, dayArtists]) => `
      <div class="day-row">
        <h2 class="day-heading">${day}</h2>
        <hr class="horizontal-rule">
        <div class="row">
          ${dayArtists.map(artist => createArtistCard(artist).outerHTML).join('')}
        </div>
      </div>
    `)
    .join('');
}

loginButton.addEventListener('click', () => {
  window.open(SpotifyService.getAuthUrl(), '_blank', 'width=600,height=800');
});

window.addEventListener('message', event => {
  if (event.origin !== window.location.origin) return;
  if (event.data.type === 'access_token') {
    SpotifyService.setAccessToken(event.data.accessToken);
    loginButton.hidden = true;
    getMatchingArtists();
  }
});

window.app = {
  getMatchingArtists: getMatchingArtists
};

document.getElementById('refresh-button').addEventListener('click', () => {
  getMatchingArtists(true);
});

window.addEventListener('load', init);