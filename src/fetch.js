import axios from 'axios';

const API_KEY = '41263135-5ac40a18427d78ae06a8f01f3';
axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function fetchImages(query, page, perPage) {
  try {
    const response = await axios.get(
      `?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    return response;
  } catch (error) {
    console.log('error catch', error.response.status);
  }
}
