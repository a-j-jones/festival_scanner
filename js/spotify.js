
let matchingArtists = [];

function updateArtistList(artists) {
    artistList.innerHTML = '';
    const row = document.createElement('div');
    row.classList.add('row');

    artists.forEach(artist => {
        const col = document.createElement('div');
        col.classList.add('col-sm-6', 'col-md-4', 'col-lg-3', 'mb-4', 'file-item');
        col.setAttribute('data-src', artist.href);

        const card = document.createElement('div');
        card.classList.add('card', 'bg-dark', 'text-white', 'h-100');

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');

        const img = document.createElement('img');
        img.src = artist.images[0].url;
        img.classList.add('card-img-top');
        img.alt = artist.name;
        img.loading = 'lazy';

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const title = document.createElement('h6');
        title.classList.add('card-title');
        title.textContent = artist.name;

        const link = document.createElement('a');
        link.href = `https://open.spotify.com/artist/${artist.id}`;
        link.classList.add('stretched-link');
        link.target = '_blank';

        imageContainer.appendChild(img);
        cardBody.appendChild(title);
        cardBody.appendChild(link);
        card.appendChild(imageContainer);
        card.appendChild(cardBody);
        col.appendChild(card);
        row.appendChild(col);
    });

    artistList.appendChild(row);
}

async function getAllLikedTracks() {
    let tracks = [];
    let offset = 0;
    let limit = 20;

    while (true) {
        const results = await spotifyApi.getMySavedTracks({ limit, offset });
        const newTracks = results.items.map(item => {
            const track = item.track;
            const album = new Album(track.album.id, track.album.name);
            const artists = track.artists.map(
                artist => new Artist(
                    artist.id,
                    artist.name,
                    artist.href,
                    artist.type,
                    artist.uri,
                    artist.genres,
                    artist.externalUrls,
                    artist.followers,
                    track.album.images
                )
            );
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
async function getMatchingArtists() {
    try {
        artistList.innerHTML = '<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>';

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

        const matchesData = await fetch('data/matches.json').then(response => response.json());
        matchingArtists = artists.filter(artist => matchesData[artist.id]);

        updateArtistList(matchingArtists);
    } catch (error) {
        console.error('Error retrieving matching artists:', error);
        artistList.innerHTML = '<p class="text-danger">Error retrieving matching artists. Please try again later.</p>';
    }
}