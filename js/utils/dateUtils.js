export function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  export function groupArtistsByDay(artists) {
    return artists.reduce((acc, artist) => {
      const day = new Date(artist.stageDay * 1000).toDateString();
      if (!acc[day]) acc[day] = [];
      acc[day].push(artist);
      return acc;
    }, {});
  }