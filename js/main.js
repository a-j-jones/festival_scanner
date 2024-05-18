const loginButton = document.getElementById('login-button');
const artistList = document.getElementById('artist-list');

const spotifyApi = new SpotifyWebApi();

function updateArtistList(artists) {
  artistList.innerHTML = '';
  artists.forEach(artist => {
    const artistElement = document.createElement('div');
    artistElement.textContent = artist.name;
    artistList.appendChild(artistElement);
  });
}

async function getArtists() {
  try {
    const response = await spotifyApi.getMySavedTracks({ limit: 20 });
    const tracks = response.items.map(item => item.track);
    const artists = new Set();
    tracks.forEach(track => {
      track.artists.forEach(artist => {
        artists.add(artist);
      });
    });
    updateArtistList(Array.from(artists));
  } catch (error) {
    console.error('Error retrieving artists:', error);
  }
}

loginButton.addEventListener('click', () => {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${config.clientId}&response_type=token&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=user-library-read`;
  window.open(authUrl, '_blank', 'width=600,height=800');
});

window.addEventListener('message', event => {
  if (event.origin !== window.location.origin) return;
  if (event.data.type === 'access_token') {
    const accessToken = event.data.accessToken;
    spotifyApi.setAccessToken(accessToken);
    getArtists();
  }
});