function updateArtistList(artists) {
    artistList.innerHTML = '';
    artists.forEach(artist => {
        const artistElement = document.createElement('div');
        artistElement.textContent = artist.name;
        artistList.appendChild(artistElement);
    });
}

async function getAllLikedTracks() {
    let tracks = [];
    let offset = 0;
    let limit = 20;

    while (true) {
        const results = await spotifyApi.getMySavedTracks({ limit, offset });
        const newTracks = results.items.map(item => {
            const track = item.track;
            const album = new Album(track.album.id, track.album.name, track.album.artists.map(artist => new Artist(artist.id, artist.name)));
            const artists = track.artists.map(artist => new Artist(artist.id, artist.name));
            return new Track(track.id, track.name, album, artists);
        });
        tracks = tracks.concat(newTracks);

        if (newTracks.length === limit) {
            offset += limit;
        } else {
            break;
        }
    }

    return tracks;
}

async function getArtists() {
    try {
        const tracks = await getAllLikedTracks();
        const artistIds = new Set();
        const artists = [];

        tracks.forEach(track => {
            track.artists.forEach(artist => {
                if (!artistIds.has(artist.id)) {
                    artistIds.add(artist.id);
                    artists.push(artist);
                }
            });
        });

        updateArtistList(artists);
    } catch (error) {
        console.error('Error retrieving artists:', error);
    }
}