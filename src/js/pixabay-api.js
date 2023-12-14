import axios from 'axios';

export default class PixabayApi {
  #API_KEY = '41263135-5ac40a18427d78ae06a8f01f3';
  BASE_URL = 'https://pixabay.com/api/';

  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.total = null;
    this.per_page = 40;
  }

  async fetchGallery() {
    const options = `${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.per_page}&page=${this.page}`;
    this.incrementPage();

    return await axios.get(
      `${this.BASE_URL}?key=${this.#API_KEY}&q=${options}`
    );
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  totalHits() {
    return this.total;
  }
}
