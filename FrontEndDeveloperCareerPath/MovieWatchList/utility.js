const baseUrl = "https://www.omdbapi.com/";
const apiKey = "f5d1bb34";

function updateLocalStorage(id) {
  const localIds = JSON.parse(localStorage.getItem("localIds"));
  // if id in local storage, remove it!
  if (isIdInLocalStorage(id)) {
    const idIndexInLocalIds = localIds.indexOf(id);
    localIds.splice(idIndexInLocalIds, 1);
    if (localIds.length) {
      localStorage.setItem("localIds", JSON.stringify(localIds));
    } else {
      localStorage.removeItem("localIds");
    }
  }
  // if id not in local storage, add it!
  else {
    if (localStorageExists()) {
      localIds.push(id);
      localStorage.setItem("localIds", JSON.stringify(localIds));
      // if local storage doesn't exist, initialize it!
    } else {
      localStorage.setItem("localIds", JSON.stringify([id]));
    }
  }
}

function isIdInLocalStorage(id) {
  const currentLocalStorage = JSON.parse(localStorage.getItem("localIds"));
  return localStorageExists() && currentLocalStorage.includes(id);
}

//short function used for sake of readability
function localStorageExists() {
  return !!localStorage.getItem("localIds");
}

function watchListIconUpdate(e) {
  let currentIconTarget;
  if (e.target.className === "watchlist-button") {
    currentIconTarget = e.target;
  } else {
    currentIconTarget = e.target.parentElement;
  }
  if (currentIconTarget.children[0].classList[1] === "fa-circle-plus") {
    currentIconTarget.innerHTML = `
      <i class="fa-solid fa-circle-minus"></i> Watchlist`;
  } else {
    currentIconTarget.innerHTML = `
      <i class="fa-solid fa-circle-plus"></i> Watchlist`;
  }
}

function readMoreOrLess(e) {
  const buttonText = e.target.textContent;
  if (buttonText === "read more") {
    e.target.parentElement.children[0].classList.remove("line-clamp-3");
    e.target.innerHTML = "read less";
  } else if (buttonText === "read less") {
    e.target.parentElement.children[0].classList.add("line-clamp-3");
    e.target.innerHTML = "read more";
  }
}

function handleReadMoreButtons() {
  const plots = document.getElementsByClassName("film-plot");
  Array.prototype.forEach.call(plots, (plot) => {
    if (
      plot.offsetHeight < plot.scrollHeight ||
      plot.offsetWidth < plot.scrollWidth
    ) {
      if (!plot.parentElement.children[1]) {
        //CONTENT IS TRUNCATED AND A BUTTON DOES NOT EXIST, CREATE A BUTTON
        plot.parentElement.innerHTML += `<button data-read-more="${plot.dataset.imdbId}"
        class="read-more-less-button"
        >read more</button>`;
      }
    } else {
      if (plot.parentElement.children[1]) {
        //CONTENT IS NOT TRUNCATED AND A BUTTON EXISTS, DELETE THE BUTTON & RESET THE LINE CLAMP
        plot.parentElement.children[1].remove();
        plot.parentElement.children[0].classList.add("line-clamp-3");
      }
    }
  });
}

async function getFilmResultsHtml(ids) {
  let html = "";

  for (let id of ids) {
    const imdbIdSearchUrl = `${baseUrl}?apikey=${apiKey}&i=${id}`;

    const response = await fetch(imdbIdSearchUrl);
    const data = await response.json();

    let watchlistIcon;
    if (isIdInLocalStorage(id)) {
      watchlistIcon = `minus`;
    } else {
      watchlistIcon = `plus`;
    }

    html += `
          <section class="film-summary">
              <div class="film-poster">
                  <img src="${data["Poster"]}" />
              </div>
              <div class="film-details-box">
                <div class="top">
                  <p class="film-title">${data["Title"]}</p>
                  <i class="fa-solid fa-star"></i>
                  <p class="film-rating">${data["imdbRating"]}</p>
                </div>
                <div class="middle">
                  <p class="film-details">${data["Runtime"]}</p>
                  <p class="film-details">${data["Genre"]}</p>
                  <button 
                  data-imdb-id="${id}" 
                  class="watchlist-button">
                    <i class="fa-solid fa-circle-${watchlistIcon}"></i>
                    Watchlist
                  </button>
                </div>
                <div class="bottom">
                  <p class="film-plot line-clamp-3" data-imdb-id="${id}">${data["Plot"]}</p>
                </div>
              </div>
          </section>
          `;
  }

  return html;
}

export {
  updateLocalStorage,
  getFilmResultsHtml,
  baseUrl,
  apiKey,
  watchListIconUpdate,
  readMoreOrLess,
  handleReadMoreButtons,
};
