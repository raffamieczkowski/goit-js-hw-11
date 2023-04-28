import './sass/index.css';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import axios from "axios";
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '35850831-e3d44e32187bf177fa8bbbda5';
let searchQuery = '';
let page = 1;


const fetchImages = () => {
  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

  axios.get(url)
    .then(response => {
      const { data } = response;
      const { hits, totalHits } = data;

      if (hits.length === 0) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return;
      }

      const imagesMarkup = hits.reduce((acc, { webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        const imageMarkup = `
          <div class="photo-card">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" data-source="${largeImageURL}" />
            <div class="info">
              <p class="info-item"><b>Likes:</b> ${likes}</p>
              <p class="info-item"><b>Views:</b> ${views}</p>
              <p class="info-item"><b>Comments:</b> ${comments}</p>
              <p class="info-item"><b>Downloads:</b> ${downloads}</p>
            </div>
          </div>
        `;
        return acc + imageMarkup;
      }, '');

      gallery.insertAdjacentHTML('beforeend', imagesMarkup);

      if (hits.length < 40 || gallery.children.length === totalHits) {
        loadMoreBtn.style.display = 'none';
        Notiflix.Notify.success('Congratulations, you have reached the end of the search results!');
      } else {
        loadMoreBtn.style.display = 'block';
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, something went wrong. Please try again later.');
    });
};

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('button[data-action="load-more"]');


const handleSearchFormSubmit = e => {
  e.preventDefault();
  searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  page = 1;
  gallery.innerHTML = '';
  loadMoreBtn.style.display = 'none';
  if (searchQuery === '') {
    Notiflix.Notify.warning('Please enter a search query.');
    return;
  }
  fetchImages();
};


const handleLoadMoreBtnClick = () => {
  page += 1;
  fetchImages();
};

searchForm.addEventListener('submit', handleSearchFormSubmit);
loadMoreBtn.addEventListener('click', handleLoadMoreBtnClick);
