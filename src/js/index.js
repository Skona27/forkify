// Global app controller
import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import { elements, renderLoader, clearLoader, elementStrings } from "./views/baseView";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";


// State
const state = {};

// search controller
const controlSearch = async () => {
  // get input value from the view
  const query = searchView.getInput();

  if(query) {
    // prepare search and add result to state
    state.search = new Search(query);
      
    // prepare UI
    searchView.clearInput();
    searchView.clearResList();
    renderLoader(elements.searchRes);

    try {
      // search for recipes
    await state.search.getResults();

    // render the view with data
    clearLoader();

    // render result
    searchView.renderResults(state.search.recipes);
    } catch(err) {
      console.log(err);
    }   
  }
}

elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});

// listen for click on buttons div
elements.searchResPages.addEventListener("click", e => {
  // find closest btn
  const btn = e.target.closest(".btn-inline");

  if(btn) {
    // specify page number
    const goToPage = parseInt(btn.dataset.goto, 10);
    // clear results
    searchView.clearResList();
    // render new results
    searchView.renderResults(state.search.recipes, goToPage);
  }
});


// recipe controller
const controlRecipe = async () => {
  // get the hash from URL
  const id = window.location.hash.replace("#", "");
  
  if(id) {
    // prepare ui
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // highlight recipe
    if(state.search) recipeView.highlightSelected(id);

    // create new recipe
    state.recipe = new Recipe(id);

    // get recipe data
    try {
      await state.recipe.getRecipe();

      // parse ingredients
      state.recipe.parseIngredients();

      // calculate time and servings
      state.recipe.calcTime();
      state.recipe.calcServings();

      // render the view
      clearLoader();
      recipeView.renderRecipe(state.recipe);

    } catch(err) {
      console.log(err);
    }

  }
}

// add listener on hash change
window.addEventListener('hashchange', controlRecipe);
window.addEventListener("load", controlRecipe);

elements.recipe.addEventListener("click", event => {
  if(event.target.matches(".btn-decrease, .btn-decrease *")) {
    if(state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if(event.target.matches(".btn-increase, .btn-increase *")) {
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (event.target.matches('.recipe__btn, .recipe__btn *')) {
    controlList();
  }
});


const controlList = () => {
  // create a new list
  if (!state.list) state.list = new List();

  // add ingredient to the list and ui
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
}

// handle delete and update list 
elements.shopping.addEventListener("click", e => {
  const id = e.target.closest(".shopping__item").dataset.itemid;
 
  if(e.target.matches(".shopping__delete, .shopping__delete *")) {
    // delete from state
    state.list.deleteItem(id);
    // delete from ui
    listView.deleteItem(id);
  } else if(e.target.matches(".shoppin__count-value")) {
    // check for update amount
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});