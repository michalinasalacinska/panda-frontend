/**
 * Adds paragraphs with something similar to lorem ipsum anywhere you want
 *
 * @param {number} paragraphs Number of paragraphs
 * @param {number} words Number of words to include
 * @param {string} selector Name of css selector
 * @param {string} format Required format of data, preferably html or json
 */
const getIpsum = (paragraphs, words, selector, format) => {
  const url = 'http://dinoipsum.herokuapp.com/api/?format=';

  let loremElements = document.querySelectorAll(selector);

  fetch(url + format + '&paragraphs=' + paragraphs + '&words=' + words)
    .then(res => {
      if (format === 'json') return res.json();
      else return res.text();
    })
    .then(data => {
      let input = data;
      if (format === 'json') input = data[0].join(' ');

      loremElements.forEach(e => {
        e.innerHTML = input;
      });
    })
    .catch(function(err) {
      console.log('Fetch error', err);
    });
};

/**
 * Adds margin to header based on height of menu
 */
const innerHeaderTop = () => {
  let h = document.getElementById('menu').getBoundingClientRect().height;
  document.querySelector('#header-container').style.marginTop = h + 24 + 'px';
};

/**
 * Shows or hides menu, works on burger icon which is shown on smaller devices
 */
const showMenu = () => {
  let menu = document.getElementById('menu');
  document.getElementById('show-menu').addEventListener('click', () => {
    if (menu.classList.contains('show')) {
      menu.classList.remove('show');
    } else {
      menu.classList.add('show');
    }
  });
};

getIpsum(3, 10, '.lorem-container', 'html');
getIpsum(12, 10, '.lorem-article', 'html');
getIpsum(1, 8, '.lorem-aside', 'html');
getIpsum(1, 2, '.lorem-h', 'json');

window.addEventListener('load', function() {
  innerHeaderTop();
  showMenu();
});

let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

window.addEventListener('resize', function() {
  innerHeaderTop();
});
