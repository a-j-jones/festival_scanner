const config = {
    clientId: '44908711b91a459e90eb7ac1b4c2b8da',
    get redirectUri() {
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:8000/callback.html';
      } else {
        return 'https://a-j-jones.github.io/festival_scanner/callback';
      }
    }
  };