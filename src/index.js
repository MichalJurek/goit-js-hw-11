import PixabayApi from './js/pixabay-api';
import createMarkupGallery from './js/gallery-markup';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import throttle from 'lodash.throttle';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox = new SimpleLightbox('.photo-card a', {
  captionsData: 'alt',
  captionDelay: 250,
  scrollZoom: false,
});

const refs = {
  searchForm: document.getElementById('search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  wrapOfGallery: document.querySelector('.gallery'),
};
const pixabayApi = new PixabayApi();

refs.searchForm.addEventListener('submit', onSearchClick);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);
refs.loadMoreBtn.classList.add('disabled');

async function onSearchClick(event) {
  event.preventDefault();
  clearGallery();

  pixabayApi.query = event.currentTarget.elements.searchQuery.value.trim();
  if (!pixabayApi.query) {
    refs.loadMoreBtn.disabled = true;
    return Notiflix.Notify.info('Please, enter your request');
  }

  pixabayApi.resetPage();

  try {
    const searchApi = await pixabayApi.fetchGallery();
    const resultApi = await searchApi.data.hits;
    if (resultApi.length === 0) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else appendGalleryMarkup(resultApi);
    lightbox.refresh();
    refs.loadMoreBtn.disabled = false;
    return Notiflix.Notify.success(
      `Hooray! We found ${searchApi.data.totalHits} images.`
    );
  } catch (err) {
    console.log(err);
  }
}

async function onLoadMoreClick() {
  const searchApi = await pixabayApi.fetchGallery();
  const resultApi = await searchApi.data.hits;
  const renderMoreImages = await appendGalleryMarkup(resultApi);
  lightbox.refresh();
  const totalPages = Math.ceil(searchApi.data.totalHits / pixabayApi.per_page);
  if (pixabayApi.page > totalPages) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
  return renderMoreImages;
}

function appendGalleryMarkup(hits) {
  refs.wrapOfGallery.insertAdjacentHTML('beforeend', createMarkupGallery(hits));
}

function clearGallery() {
  refs.wrapOfGallery.innerHTML = '';
}

async function checkPosition() {
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;

  const scrolled = window.scrollY;
  const threshold = height - screenHeight / 4;

  const position = scrolled + screenHeight;

  if (position >= threshold) {
    await onLoadMoreClick();
  }
}

(() => {
  window.addEventListener('scroll', throttle(checkPosition, 250));
  window.addEventListener('resize', throttle(checkPosition, 250));
})();

