import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryEl = document.getElementById('gallery');
const loadBtnEl = document.getElementById('load');
const searchBtnEl = document.getElementById('search-btn');
const inputEl = document.getElementById('input');

let page = 1;
const per_page = 40;
loadBtnEl.style.visibility = 'hidden';

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
  return response;
};

function renderPhotos(photos) {
  return photos.data.hits
    .map(photo => {
      return `<div class="photo-card">
    <a href="${photo.largeImageURL}" class="photo-link">
    <img src="${photo.webformatURL} alt="${photo.tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b> ${photo.likes}
      </p>
      <p class="info-item">
        <b>Views</b> ${photo.views}
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
  fetchPhotos().then(photos => {
    console.log(photos);
    //console.log(photos.data.hits);
    //console.log(photos.data.hits.length);

    totalFoundLength = photos.data.total;

    if (photos.data.hits.length === 0) {
      alertNoMatch();
    }

    if (photos.data.total > per_page) {
      loadBtnEl.style.visibility = 'visible';
    } else {
      loadBtnEl.style.visibility = 'hidden';
    }

    if (photos.data.totalHits > 0 && !(inputEl.textContent = '')) {
      galleryEl.innerHTML = renderPhotos(photos);
      Notiflix.Notify.success(
        `Hooray! We found ${photos.data.totalHits} images.`
      );
      let lightbox = new SimpleLightbox('.gallery a');
    }
  });
};

function createMore() {
  fetchPhotos().then(photos => {
    if (photos.data.total > per_page) {
      Notiflix.Notify.success(
        `Hooray! We found ${photos.data.totalHits} images.`
      );
      loadBtnEl.style.visibility = 'visible';
    } else {
      loadBtnEl.style.visibility = 'hidden';
    }

    galleryEl.insertAdjacentHTML('beforeend', renderPhotos(photos));

    let lightbox = new SimpleLightbox('.gallery a');

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 11,
      behavior: 'smooth',
    });

    if (page >= photos.data.totalHits / per_page) {
      loadBtnEl.style.visibility = 'hidden';
      alertEndOfSearch();
    }
  });
}

function clearGallery() {
  galleryEl.innerHTML = '';
}

function alertEmpty() {
  Notiflix.Notify.failure(
    'The search bar cannot be empty. Please type any criteria in the search bar.'
  );
  clearGallery();
  loadBtnEl.style.visibility = 'hidden';
}

function alertNoMatch() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
  clearGallery();
}

function alertEndOfSearch() {
  Notiflix.Notify.failure(
    "We're sorry, but you've reached the end of search results."
  );
}

searchBtnEl.addEventListener('click', event => {
  console.log(inputEl.value);
  event.preventDefault();

  if (inputEl.value === null || inputEl.value === '') {
    return alertEmpty();
  }
  page = 1;
  createPhotos();
});

loadBtnEl.addEventListener('click', () => {
  page + 1;
  createMore();
});
