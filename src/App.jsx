import { useEffect, useState } from "react";
import { fetchPopularMovies } from "./services/api";

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchPopularMovies().then(setMovies);
  }, []);

  return (
    <div>
      <h1>CineScope 🎬</h1>

      {movies.map((movie) => (
        <p key={movie.id}>{movie.title}</p>
      ))}
    </div>
  );
}

export default App;