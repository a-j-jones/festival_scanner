const config = {
  clientId: '44908711b91a459e90eb7ac1b4c2b8da',
  get redirectUri() {
    const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    return isLocalhost
      ? 'http://localhost:8000/callback.html'
      : 'https://a-j-jones.github.io/festival_scanner/callback';
  },
  spotifyAuthUrl: 'https://accounts.spotify.com/authorize',
  spotifyScopes: ['user-library-read', 'user-top-read'],
};

export default config;