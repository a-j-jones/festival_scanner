class Artist {
    constructor(id, name, href, type, uri, genres, externalUrls, followers, images) {
      this.id = id;
      this.name = name;
      this.href = href;
      this.type = type;
      this.uri = uri;
      this.genres = genres;
      this.externalUrls = externalUrls;
      this.followers = followers;
      this.images = images;
    }
  }
  
  class Album {
    constructor(id, name) {
      this.id = id;
      this.name = name;
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