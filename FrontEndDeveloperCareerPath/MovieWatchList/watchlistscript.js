import {
  updateLocalStorage,
  getFilmResultsHtml,
  handleReadMoreButtons,
  readMoreOrLess,
} from "./utility.js";

const watchListEl = document.getElementById("watchlist");

document.addEventListener("click", (e) => {
  if (e.target.className === "watchlist-button") {
    updateLocalStorage(e.target.dataset.imdbId);
    renderWatchListHtml();
  } else if (e.target.parentElement.className === "watchlist-button") {
    updateLocalStorage(e.target.parentElement.dataset.imdbId);
    renderWatchListHtml();
  } else if (e.target.dataset.readMore) {
    readMoreOrLess(e);
  }
});

window.addEventListener("resize", () => {
  handleReadMoreButtons();
});

renderWatchListHtml();

async function renderWatchListHtml() {
  const watchlist = localStorage.getItem("localIds");

  if (watchlist) {
    const filmResultsHtml = await getFilmResultsHtml(JSON.parse(watchlist));
    watchListEl.innerHTML = filmResultsHtml;
    handleReadMoreButtons();
  } else {
    watchListEl.innerHTML = `
      <div class="empty-watchlist-notice">
        <p>Your watchlist is looking a little empty...</p>
        <a href="./index.html">
          <i class="fa-solid fa-circle-plus"></i> Let's add some movies!
        </a>
      </div>
    `;
  }
}
