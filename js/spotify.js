const { Artist, Track } = require('./models');

function getArtistsFromTracks(tracks) {
  const existingArtists = new Set();

  tracks.forEach(track => {
    track.artists.forEach(artist => {
      if (!existingArtists.has(artist.id)) {
        existingArtists.add(new Artist(artist));
      }
    });
  });

  return Array.from(existingArtists);
}

async function getAllRecentlyPlayed(spotifyApi, limit = 50) {
  const response = await spotifyApi.getMyRecentlyPlayedTracks({ limit });
  const tracks = response.items.map(item => new Track(item.track));
  return tracks;
}

async function getAllLikedTracks(spotifyApi, limit = 20) {
  let tracks = [];
  let offset = 0;

  while (true) {
    const results = await spotifyApi.getMySavedTracks({ limit, offset });
    const newTracks = results.items.map(item => new Track(item.track));
    tracks = tracks.concat(newTracks);

    if (newTracks.length === limit) {
      offset += limit;
    } else {
      break;
    }
  }

  return tracks;
}


module.exports = {
  getArtistsFromTracks,
  getAllRecentlyPlayed,
  getAllLikedTracks,
};