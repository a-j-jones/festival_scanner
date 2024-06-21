import config from '../config/config.js';

class SpotifyService {
  constructor() {
    this.api = new SpotifyWebApi();
  }

  setAccessToken(token) {
    this.api.setAccessToken(token);
    localStorage.setItem('accessToken', token);
  }

  getStoredAccessToken() {
    return localStorage.getItem('accessToken');
  }

  async getTopArtists(limit = 20, offset = 0) {
    return this.api.getMyTopArtists({ limit, offset });
  }

  getAuthUrl() {
    const params = new URLSearchParams({
      client_id: config.clientId,
      response_type: 'token',
      redirect_uri: config.redirectUri,
      scope: config.spotifyScopes.join(','),
    });
    return `${config.spotifyAuthUrl}?${params.toString()}`;
  }
}

export default new SpotifyService();