const loginButton = document.getElementById('login-button');
const artistList = document.getElementById('artist-list');

const spotifyApi = new SpotifyWebApi();

let festivalValues = null;
let festivalSelected = null;
const festivalSelector = document.getElementById('selected-festival');
const festivalOptions = document.getElementById('festival-options');

async function getFestivals() {
  
  festivalsJson = await fetch('data/festivals.json').then(response => response.json());
  festivalValues = Object.entries(festivalsJson);

  festivalSelected = festivalValues[0];
  festivalSelector.textContent = festivalSelected[0];

  for (const [name, file] of festivalValues) {
    const festivalListItem = document.createElement('li');
    const festivalButton = document.createElement('button');
    festivalButton.classList.add('dropdown-item');
    festivalButton.textContent = name;
    festivalButton.addEventListener('click', () => {
      festivalSelected = [name, file];
      festivalSelector.textContent = name;
      getMatchingArtists(festivalFile=file);
    });
    festivalListItem.appendChild(festivalButton);
    festivalOptions.appendChild(festivalListItem);
  }
}

getFestivals();


const storedAccessToken = localStorage.getItem('accessToken');
if (storedAccessToken) {
  spotifyApi.setAccessToken(storedAccessToken);
  getMatchingArtists();
} else {
  loginButton.hidden = false;
}

loginButton.addEventListener('click', () => {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${config.clientId}&response_type=token&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=user-library-read,user-top-read`;
  window.open(authUrl, '_blank', 'width=600,height=800');
});

window.addEventListener('message', event => {
  if (event.origin !== window.location.origin) return;
  if (event.data.type === 'access_token') {
    const accessToken = event.data.accessToken;
    spotifyApi.setAccessToken(accessToken);
    
    localStorage.setItem('accessToken', accessToken);
    loginButton.hidden = true;

    getMatchingArtists();
  }
});