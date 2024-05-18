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
    constructor(id, name, artists, href, type, albumType, releaseDate, releaseDatePrecision, totalTracks, uri) {
      this.id = id;
      this.name = name;
      this.artists = artists;
      this.href = href;
      this.type = type;
      this.albumType = albumType;
      this.releaseDate = releaseDate;
      this.releaseDatePrecision = releaseDatePrecision;
      this.totalTracks = totalTracks;
      this.uri = uri;
    }
  }
  
  class Track {
    constructor(id, name, album, artists, href, type, discNumber, durationMs, explicit, externalIds, externalUrls, isLocal, popularity, previewUrl, trackNumber, uri) {
      this.id = id;
      this.name = name;
      this.album = album;
      this.artists = artists;
      this.href = href;
      this.type = type;
      this.discNumber = discNumber;
      this.durationMs = durationMs;
      this.explicit = explicit;
      this.externalIds = externalIds;
      this.externalUrls = externalUrls;
      this.isLocal = isLocal;
      this.popularity = popularity;
      this.previewUrl = previewUrl;
      this.trackNumber = trackNumber;
      this.uri = uri;
    }
  }
  
  module.exports = {
    Artist,
    Album,
    Track,
  };