import Artist from '../models/Artist.js';

class FestivalService {
  async getFestivals() {
    const response = await fetch('data/festivals.json');
    return response.json();
  }

  async getFestivalArtists(festivalFile) {
    const response = await fetch(`data/${festivalFile}`);
    return response.json();
  }

  matchArtistsWithFestival(spotifyArtists, festivalArtists) {
    return spotifyArtists.reduce((acc, artist, index) => {
      const festivalData = festivalArtists[artist.id];
      if (festivalData) {
        acc.push(new Artist({
          ...artist,
          ...festivalData,
          rank: index + 1,
        }));
      }
      return acc;
    }, []);
  }
}

export default new FestivalService();