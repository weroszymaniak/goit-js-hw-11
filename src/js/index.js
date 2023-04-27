import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

//const formEl = document.getElementById('search-form');
const galleryEl = document.getElementById('gallery');
const loadBtnEl = document.getElementById('load');
const searchBtnEl = document.getElementById('search-btn');
const inputEl = document.getElementById('input');

let page = 1;
const per_page = 40;
loadBtnEl.style.visibility = 'hidden';
let totalFoundLength = 0;
let totalFound = 0;
const fetchPhotos = async () => {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '35612803-f56ab8e28da93ed3650e10521';
  const response = await axios.get(`${BASE_URL}`, {
    params: {
      q: inputEl.value,
      page: page,
      per_page: per_page,
      key: API_KEY,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    },
  });
  //console.log(response);

  return response;
};

function renderPhotos(photos) {
  return photos.data.hits
    .map(photo => {
      return `<div class="photo-card">
    <img src="${photo.webformatURL} alt="${photo.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</b>${photo.likes}
      </p>
      <p class="info-item">
        <b>Views</b>${photo.views}
      </p>
      <p class="info-item">
        <b>Comments</b> ${photo.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b> ${photo.downloads}
      </p>
    </div>
  </div> `;
    })
    .join('');
}

const createPhotos = () => {
  fetchPhotos()
    .then(photos => {
      console.log(photos.data.hits);
      totalFoundLength = photos.data.total;
      totalFound = photos.data.hits;
      galleryEl.innerHTML = renderPhotos(photos);
      alertFound();

      if (totalFoundLength === 0) {
        alertEmpty();
      } else if (totalFoundLength > 40) {
        console.log('oki');
        loadBtnEl.style.visibility = 'visible';
        createMore();
      }
    })
    .catch(error => {
      alertNoMatch();
    });
};

function createMore() {
  fetchPhotos().then(photos => {
    totalFoundLength = photos.data.total;
    galleryEl.insertAdjacentHTML('beforeend', renderPhotos(photos));
    let gallery = new SimpleLightbox('.gallery a');

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 11,
      behavior: 'smooth',
    });
  });
}

function alertFound() {
  Notiflix.Notify.success(`Hooray! We found ${totalFound} images.`);
}

function alertEmpty() {
  Notiflix.Notify.failure(
    'The search bar cannot be empty. Please type any criteria in the search bar.'
  );
}

function alertNoMatch() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function alertEndOfSearch() {
  Notiflix.Notify.failure(
    "We're sorry, but you've reached the end of search results."
  );
}

searchBtnEl.addEventListener('click', event => {
  event.preventDefault();
  page = 1;
  createPhotos();
});

loadBtnEl.addEventListener('click', () => {
  page++;
  createMore();
});
