import {
  updateLocalStorage,
  watchListIconUpdate,
  getFilmResultsHtml,
  readMoreOrLess,
  handleReadMoreButtons,
  baseUrl,
  apiKey,
} from "./utility.js";

const searchInputEl = document.getElementById("search-input-el");
const searchResultsEl = document.getElementById("search-results");

document.addEventListener("click", (e) => {
  if (e.target.id === "search-button-el") {
    searchTitles();
  } else if (e.target.className === "watchlist-button") {
    updateLocalStorage(e.target.dataset.imdbId);
    watchListIconUpdate(e);
  } else if (e.target.parentElement.className === "watchlist-button") {
    updateLocalStorage(e.target.parentElement.dataset.imdbId);
    watchListIconUpdate(e);
  } else if (e.target.dataset.readMore) {
    readMoreOrLess(e);
  }
});

searchInputEl.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchTitles();
  }
});

window.addEventListener("resize", () => {
  handleReadMoreButtons();
});

async function searchTitles() {
  if (searchInputEl.value) {
    // SHOW BUFFER WHEEL
    searchResultsEl.innerHTML = `<i class="load-spinner fa-solid fa-spinner fa-spin-pulse"></i>`;

    const searchTerm = searchInputEl.value.toLowerCase();

    const titleSearchUrl = `${baseUrl}?apikey=${apiKey}&s=${searchTerm}`;

    const response = await fetch(titleSearchUrl);
    const data = await response.json();

    await handleDataResponse(data);
    handleReadMoreButtons();
  }
}

async function handleDataResponse(data) {
  if (data.Response === "True") {
    const imdbIDs = [];
    data.Search.forEach((film) => {
      imdbIDs.push(film.imdbID);
    });
    const filmResultsHtml = await getFilmResultsHtml(imdbIDs);
    searchResultsEl.innerHTML = filmResultsHtml;
  } else {
    searchResultsEl.innerHTML = `
          <div class="empty-search-results">
              Unable to find what you're looking for. Please try another search.
          </div>
      `;
  }
}
