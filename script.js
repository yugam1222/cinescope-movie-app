const API_KEY = "f30d323a";

async function searchMovies() {
  const query = document.getElementById("searchInput").value;
  const container = document.getElementById("moviesContainer");

  if (!query) {
    container.innerHTML = "<p>Please enter a movie name</p>";
    return;
  }

  container.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
    const data = await response.json();

    if (data.Search) {
      displayMovies(data.Search);
    } else {
      container.innerHTML = "<p>No results found</p>";
    }

  } catch (error) {
    container.innerHTML = "<p>Error fetching data</p>";
    console.error(error);
  }
}

function displayMovies(movies) {
  const container = document.getElementById("moviesContainer");
  container.innerHTML = "";

  movies.forEach(movie => {
    let poster;

    if (movie.Poster !== "N/A") {
      poster = movie.Poster;
    } else {
      poster = "https://via.placeholder.com/200x300?text=No+Image";
    }

    const movieCard = `
      <div class="movie-card">
        <img src="${poster}" alt="${movie.Title}">
        <h3>${movie.Title}</h3>
        <p>Year: ${movie.Year}</p>
        <p>Type: ${movie.Type}</p>
      </div>
    `;

    container.innerHTML += movieCard;
  });
}