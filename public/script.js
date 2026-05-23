const API_KEY = "0df0460b15fe55acc615e8e38332e860";

const BASE_URL = "https://api.themoviedb.org/3";

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const movieList = document.getElementById("movie-list");

const message = document.getElementById("message");

const searchInput = document.getElementById("search");

const btnSearch = document.getElementById("btnSearch");

function showMessage(text) {
  message.textContent = text;
}

async function fetchMovies(query = "") {

  try {

    showMessage("Carregando filmes...");

    let url = "";

    if (query) {

      url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${query}`;

    } else {

      url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR`;

    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Erro na requisição");
    }

    const data = await response.json();

    showMessage("");

    return data.results;

  } catch (error) {

    showMessage("Erro ao carregar filmes.");

    console.error(error);

    return [];
  }
}

function createMovieCard(movie) {

  const card = document.createElement("div");

  card.classList.add("movie-card");

  const poster = movie.poster_path
    ? `${IMAGE_URL}${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=Sem+Imagem";

  const year = movie.release_date
    ? movie.release_date.split("-")[0]
    : "Não informado";

  const overview = movie.overview
    ? movie.overview.slice(0, 120) + "..."
    : "Sem descrição disponível.";

  card.innerHTML = `
  
    <img src="${poster}" alt="${movie.title}">

    <div class="movie-info">

      <h2>${movie.title}</h2>

      <p><strong>Ano:</strong> ${year}</p>

      <p class="rating">${movie.vote_average}</p>

      <p>${overview}</p>

    </div>
  
  `;

  return card;
}

function renderMovies(movies) {

  movieList.innerHTML = "";

  if (movies.length === 0) {

    showMessage("Nenhum filme encontrado.");

    return;
  }

  movies.forEach(movie => {

    const card = createMovieCard(movie);

    movieList.appendChild(card);

  });
}

async function init() {

  const movies = await fetchMovies();

  renderMovies(movies);
}

btnSearch.addEventListener("click", async () => {

  const query = searchInput.value.trim();

  const movies = await fetchMovies(query);

  renderMovies(movies);
});

searchInput.addEventListener("keypress", async (event) => {

  if (event.key === "Enter") {

    const query = searchInput.value.trim();

    const movies = await fetchMovies(query);

    renderMovies(movies);
  }
});

init();