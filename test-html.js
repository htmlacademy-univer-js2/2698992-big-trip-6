const { JSDOM } = require("jsdom");
const html = `
<li class="trip-events__item">
      <div class="event">
        <h4 class="visually-hidden">Offers:</h4>
        <div class="event__selected-offers">
          <li class="event__offer">
      <span class="event__offer-title">Upgrade to a business class</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">120</span>
    </li>
        </div>
        <button class="event__favorite-btn " type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21..."/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
`;
const div = new JSDOM().window.document.createElement('div');
div.innerHTML = html;
console.log(div.firstElementChild.querySelector('.event__rollup-btn'));
