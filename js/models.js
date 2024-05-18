class Artist {
    constructor(id, name, href, type, uri, popularity, genres, externalUrls, followers) {
      this.id = id;
      this.name = name;
      this.href = href;
      this.type = type;
      this.uri = uri;
      this.popularity = popularity;
      this.genres = genres;
      this.externalUrls = externalUrls;
      this.followers = followers;
    }
  }
  
  class Album {
    constructor(id, name, artists) {
      this.id = id;
      this.name = name;
      this.artists = artists;
    }
  }
  
  class Track {
    constructor(id, name, album, artists) {
      this.id = id;
      this.name = name;
      this.album = album;
      this.artists = artists;
    }
  }