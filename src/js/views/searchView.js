import { elements } from "./baseView";

// get the input field value
export const getInput = () => elements.searchInput.value;

// render all recipes
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  // define which results to show
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  // slice results array and render recipes
  recipes.slice(start, end).forEach(renderRecipe);

  // render buttons
  renderButtons(page, recipes.length, resPerPage);
}

// render one recipe
const renderRecipe = recipe => {
  // html markup for recipe
  const html = `
    <li>
      <a class="results__link" href="#${recipe.recipe_id}">
          <figure class="results__fig">
              <img src="${recipe.image_url}" alt="${limitRecipeTitle(recipe.title)}">
          </figure>
          <div class="results__data">
              <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
              <p class="results__author">${recipe.publisher}</p>
          </div>
      </a>
    </li>
  `;
  // put recepie before end of ul
  elements.searchResList.insertAdjacentHTML("beforeend", html);
}

// clear input
export const clearInput = () => {
  elements.searchInput.value = '';
};

// clear results
export const clearResList = () => {
  // clear results and buttons div
  elements.searchResList.innerHTML = '';
  elements.searchResPages.innerHTML = '';
};

// limit title 
const limitRecipeTitle = (title, limit = 19) => {
  const newTitle = [];

  // check if title is longer than limit
  if(title.length > limit) {
    // reduce title arr, check for length
    title.split(" ").reduce((acc, el) => {
      if(acc + el.length <= limit) {
        newTitle.push(el);
      }
      return acc + el.length;
    }, 0);

    return `${newTitle.join(" ")} ...`;
  } else return title;
};

const renderButtons = (page, numResults, resPerPage) => {
  // get max number of pages
  const pages = Math.ceil(numResults / resPerPage);
  let button;

  // generate buttons
  if(page === 1 && pages > 1) {
    button = createButton(page, 'next');
  } else if(page < pages) {
    button = `
    ${createButton(page, 'prev')}
    ${createButton(page, 'next')}
    `;
  } else if(page === pages && pages > 1) {
    button = createButton(page, 'prev');
  }

  // add buttons to html
  elements.searchResPages.insertAdjacentHTML("afterbegin", button);
}

// generate button based on it's type
const createButton = (page, type) => `
  <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page-1 : page+1}>
    <span>Page ${type === 'prev' ? page-1 : page+1}</span> 
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
  </button>
`; 