'use strict';

///////////////////////////////////////
// HTML Elements
// Modal window
const header = document.querySelector('.header');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
// Navigation tab
const navigation = document.querySelector('.nav');
// Slider
const slides = document.querySelectorAll('.slide');
const sliderBtnLeft = document.querySelector('.slider__btn--left');
const sliderBtnRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');

// Open create account window.
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

// Close create account window.
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

// Close create account window on ESC button press.
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Scroll to section 1 (Learn more)
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Smooth Page navigation using event delegation
// Navigation bar link click handling.
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // Accept only click on links to sections.
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Click event handling in tabs container.
tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  // Accept only clicks on buttons and span inside of it.
  const clicked = e.target.closest('.operations__tab'); // return closest element with .operations__tab class
  // Ignore null values. Stop executing function.
  // Occurs when whitespace is pressed in operations__tab-container.
  if (!clicked) return;

  // Emphasize clicked tab.
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // Emphasize content area.
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Navigation bar fade animation.
// Fade all elements except one that is hovered.
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this; // this = opacity argument
    });
    logo.style.opacity = this;
  }
};

// Adding hover event listeners to navigation bar (mouseover and mouseout).
// Passing opacity value into handleOver function using bind method.
navigation.addEventListener('mouseover', handleHover.bind(0.5));
navigation.addEventListener('mouseout', handleHover.bind(1));

// Implementing Sticky Navigation using IntersectionObserver API.
const navigationHeight = navigation.getBoundingClientRect().height;
const stickyNavigationObserverCallback = function (entries) {
  const [entry] = entries; // entries[0]
  if (!entry.isIntersecting) navigation.classList.add('sticky');
  else navigation.classList.remove('sticky');
};

// Observe if header element reaches out of browser viewport.
const headerObserver = new IntersectionObserver(
  stickyNavigationObserverCallback,
  {
    root: null, // browser viewport
    threshold: 0, // when haeder reaches out of viewport
    rootMargin: `-${navigationHeight}px`, // box of 90px that will be applied outside of target element (height of nav bar = 90 px)
  }
);
headerObserver.observe(header);

// Implementing Revealing Elements on Scroll feature.
const allSections = document.querySelectorAll('.section');
const revealSectionCallback = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); // stop observing once callback function is called
};

// When section is 15 % visible call revealSectionCallback()
const sectionObserver = new IntersectionObserver(revealSectionCallback, {
  root: null,
  threshold: 0.15,
});

// Observe all sections and set all sections hidden when page loads.
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Implementing Lazy Loading Images feature.
const imageTargets = document.querySelectorAll('img[data-src]'); // CSS feature -> select img elements with data src attribute

const loadImage = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return; // isIntersecting = false -> target not visible
  // Replace src with path defined in data-src property
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img'); // remove blury filter from image
  });
  observer.unobserve(entry.target);
};

const lazyImageObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshod: 0,
  rootMargin: '200px', // 200 px before image appears
});
imageTargets.forEach(image => lazyImageObserver.observe(image));

// Implementing Slider Component
let curSlide = 0;
let maxSlide = slides.length;

// Go to slide by translating x axis of elements.
const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

const previousSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

sliderBtnLeft.addEventListener('click', previousSlide);
sliderBtnRight.addEventListener('click', nextSlide);

// Move slides using arrow left and right arrow keys.
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') previousSlide();
  if (e.key === 'ArrowRight') nextSlide();
});

// Moves slides using dots.
const createDots = function () {
  slides.forEach(function (_, i) {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

dotsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activateDot(slide);
  }
});

const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

// Initialize stuff when page is loaded.
const init = function () {
  goToSlide(0);
  createDots();
  activateDot(0);
};

init();
