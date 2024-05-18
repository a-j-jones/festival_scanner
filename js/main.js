const loginButton = document.getElementById('login-button');
const artistList = document.getElementById('artist-list');

const spotifyApi = new SpotifyWebApi();

loginButton.addEventListener('click', () => {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${config.clientId}&response_type=token&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=user-library-read`;
  window.open(authUrl, '_blank', 'width=600,height=800');
});

window.addEventListener('message', event => {
  if (event.origin !== window.location.origin) return;
  if (event.data.type === 'access_token') {
    const accessToken = event.data.accessToken;
    spotifyApi.setAccessToken(accessToken);
    getMatchingArtists();
  }
});