
let matchingArtists = [];
let json_match = {};

function addArtistCard(artist, row) {
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
    cardBody.classList.add('card-body', 'position-relative');

    const title = document.createElement('h6');
    title.classList.add('card-title');
    title.textContent = artist.name;

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const stage = document.createElement('p');
    stage.classList.add('card-text');
    const stageDayDate = new Date(artist.stageDay * 1000);
    const stageDayOfWeek = daysOfWeek[stageDayDate.getDay()];
    stage.textContent = `${artist.stageName} - ${stageDayOfWeek}`;

    const schedule = document.createElement('p');
    schedule.classList.add('card-text');
    const startTime = new Date(artist.startTime * 1000);
    const endTime = new Date(artist.endTime * 1000);
    const formatTime = (date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };
    schedule.textContent = `${formatTime(startTime)} - ${formatTime(endTime)}`;

    const link = document.createElement('a');
    link.href = `https://open.spotify.com/artist/${artist.id}`;
    link.classList.add('stretched-link');
    link.target = '_blank';

    const spotifyLogo = document.createElement('img');
    spotifyLogo.src = 'static/Spotify_Icon_RGB_White.png';
    spotifyLogo.alt = 'Spotify Logo';
    spotifyLogo.classList.add('spotify-logo');

    imageContainer.appendChild(img);
    cardBody.appendChild(title);
    cardBody.appendChild(stage);
    cardBody.appendChild(schedule);
    cardBody.appendChild(spotifyLogo);
    card.appendChild(link);
    card.appendChild(imageContainer);
    card.appendChild(cardBody);
    col.appendChild(card);
    row.appendChild(col);
}

function updateArtistList(artists) {
    artistList.innerHTML = '';

    // Group artists by day
    const artistsByDay = {};
    artists.forEach(artist => {
        const day = new Date(artist.stageDay * 1000).toDateString();
        if (!artistsByDay[day]) {
            artistsByDay[day] = [];
        }
        artistsByDay[day].push(artist);
    });

    // Sort the days in ascending order
    const sortedDays = Object.keys(artistsByDay).sort((a, b) => {
        return new Date(a) - new Date(b);
    });

    // Loop over the days and create rows for each day
    sortedDays.forEach(day => {
        const dayRow = document.createElement('div');
        dayRow.classList.add('day-row');

        const dayHeading = document.createElement('h2');
        dayHeading.classList.add('day-heading');
        dayHeading.textContent = day;
        dayRow.appendChild(dayHeading);

        const horizontalRule = document.createElement('hr');
        horizontalRule.classList.add('horizontal-rule');
        dayRow.appendChild(horizontalRule);

        const artistsRow = document.createElement('div');
        artistsRow.classList.add('row');

        artistsByDay[day].forEach(artist => {
            addArtistCard(artist, artistsRow);
        });

        dayRow.appendChild(artistsRow);
        artistList.appendChild(dayRow);
    });
}

async function getAllArtists() {
    const limit = 20;

    const { total, items: firstBatchItems } = await spotifyApi.getMySavedTracks({ limit });
    const numRequests = Math.ceil((total - limit) / limit);
    const matchesData = await fetch('data/matches.json').then(response => response.json());

    const trackPromises = [
        Promise.resolve({ items: firstBatchItems }),
        ...Array.from({ length: numRequests }, (_, i) => {
            const offset = (i + 1) * limit;
            return spotifyApi.getMySavedTracks({ limit, offset });
        }),
    ];

    const trackResults = await Promise.all(trackPromises);
    const artistIds = new Set();
    const artists = [];

    for (const { items } of trackResults) {
        for (const item of items) {
            const track = item.track;

            for (const artist of track.artists) {
                const matchData = matchesData[artist.id] || {};
                if (artistIds.has(artist.id) || Object.keys(matchData).length === 0) continue;
                artistIds.add(artist.id);

                json_match = matchData;
                artists.push(
                    new Artist(
                        artist.id,
                        artist.name,
                        track.album.images,
                        matchData.start_time,
                        matchData.end_time,
                        matchData.stage_name,
                        matchData.stage_day
                    )
                );
            }
        }
    }

    return artists;
}

async function getMatchingArtists() {
    try {
        artistList.innerHTML = '<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>';

        const artists = await getAllArtists();
        matchingArtists = artists;
        updateArtistList(artists);

    } catch (error) {
        console.error('Error retrieving matching artists:', error);
        artistList.innerHTML = '<p class="text-danger">Error retrieving matching artists. Please try again later.</p>';
        localStorage.removeItem('accessToken');
        loginButton.hidden = false;
    }
}