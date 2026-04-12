const API_KEY = "f30d323a";

let allMovies = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];


window.onload = loadMovies;

async function loadMovies() {
  showLoading();

  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=avengers`);
    const data = await res.json();

    if (data.Search) {
      allMovies = data.Search;
      applyFilters();
    } else {
      showError("No movies found");
    }
  } catch {
    showError("Network error");
  }
}


async function searchMovies() {
  const query = document.getElementById("searchInput").value;

  if (!query) {
    loadMovies();
    return;
  }

  showLoading();

  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
    const data = await res.json();

    if (data.Search) {
      allMovies = data.Search;
      applyFilters();
    } else {
      showError("No results found");
    }
  } catch {
    showError("Error fetching data");
  }
}


function applyFilters() {
  let filtered = [...allMovies];

  const type = document.getElementById("filterType").value;
  const sort = document.getElementById("sortOption").value;

  if (type !== "all") {
    filtered = filtered.filter(m => m.Type === type);
  }

  if (sort === "yearAsc") {
    filtered = filtered.sort((a, b) => a.Year - b.Year);
  } else if (sort === "yearDesc") {
    filtered = filtered.sort((a, b) => b.Year - a.Year);
  }

  displayMovies(filtered);
}


function toggleFavorite(id) {
  const exists = favorites.find(m => m.imdbID === id);

  if (exists) {
    favorites = favorites.filter(m => m.imdbID !== id);
  } else {
    const movie = allMovies.find(m => m.imdbID === id);
    favorites.push(movie);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  applyFilters();
}

function displayMovies(movies) {
  const container = document.getElementById("moviesContainer");
  container.innerHTML = "";

  movies.map(movie => {
    const poster = movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/150";

    const fav = favorites.find(f => f.imdbID === movie.imdbID);

    container.innerHTML += `
      <div class="movie-card">
        <img src="${poster}">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>

        <button onclick="toggleFavorite('${movie.imdbID}')">
          ${fav ? " Remove" : "🤍 Fav"}
        </button>

        <button onclick="viewDetails('${movie.imdbID}')">
          View Details
        </button>
      </div>
    `;
  });
}

async function viewDetails(id) {
  showLoading();

  const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`);
  const data = await res.json();

  alert(`
Title: ${data.Title}
Year: ${data.Year}
Genre: ${data.Genre}
Plot: ${data.Plot}
  `);
}


function showLoading() {
  document.getElementById("moviesContainer").innerHTML = "<p>Loading...</p>";
}

// ❌ ERROR
function showError(msg) {
  document.getElementById("moviesContainer").innerHTML = `<p>${msg}</p>`;
}