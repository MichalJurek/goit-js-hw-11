import './css/styles.css';
import {fetchImages} from './fetch';
import {createGallery} from './render-gallery';
import SimpleLightbox from "simplelightbox";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import "simplelightbox/dist/simple-lightbox.min.css";
const submitSearch= document.getElementById('search-form')
const listDivEl= document.querySelector('.gallery-cards')
const listEnd= document.querySelector('.end-gallery')
const simplelightbox = new SimpleLightbox('.gallery-cards a', { 
  captions: true,
  captionsData: 'alt',
  captionDelay: 300,
});

let query = '';
let page = 1;
let perPage = 40;
let endRenderFlagUrl = false;
let totalPages = 1;
window.preventAction = true;

listEnd.classList.add('hidden');

submitSearch.addEventListener('submit', startSearch);

function onEntry(entry) {
  entry.forEach(change => {
    if (change.isIntersecting & !endRenderFlagUrl) {
      console.log('eND');
      page += 1;
      onSearchForm();
    }
  });
}
let options = { threshold: [0.5] };
let observer = new IntersectionObserver(onEntry, options);
let elements = document.querySelectorAll('.end-gallery');
for (let elm of elements) {
  observer.observe(elm);
}

function startSearch(e) {
  console.log('start search')
query = ''
page = 1
endRenderFlagUrl = false;
window.preventAction = true; 
listDivEl.innerHTML = '';
listEnd.classList.add('hidden');
onSearchForm(e)
}

function onSearchForm(e) {
  if(endRenderFlagUrl) return

  if (window.preventAction) {
    e.preventDefault();
    query = e.currentTarget.searchQuery.value.trim()
    window.preventAction = false;
  }


    fetchImages(query, page, perPage) 
        .then(({data}) => {
          totalPages = Math.ceil(data.totalHits/perPage)
          alertTotalHits(data);
            if (data.totalHits !== 0) {
              listDivEl.insertAdjacentHTML('beforeEnd', createGallery(data));
              simplelightbox.refresh();
              listEnd.classList.remove('hidden');
          }
            if (page === totalPages) {
            console.log('переключение флага endRenderFlagUrl')
              endRenderFlagUrl = true;
         }   
        }) 

        .catch(error => {
          Notify.failure(`Error server: ${error}`);
          endRenderFlagUrl = true;
        })
}

function alertTotalHits(data) {


  if (data.totalHits === 0) {
    Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    endRenderFlagUrl = true;
    return
  } 

  if (page === totalPages & page !==1) {
    Notify.warning("We're sorry, but you've reached the end of search results.")
    return;
  }  

  if (page === 1) {
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    return;
  }
}

