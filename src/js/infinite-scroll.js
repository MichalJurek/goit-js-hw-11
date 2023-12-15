import throttle from 'lodash.throttle';

export default async function checkPosition() {
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;
  const scrolled = window.scrollY;
  const threshold = height - screenHeight / 4;
  const position = scrolled + screenHeight;

  if (position >= threshold) {
    await onLoadMoreClick();
  }
}

const handleScroll = () => {
  checkPosition();
};

const handleResize = () => {
  checkPosition();
};

(() => {
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleResize);
})();
