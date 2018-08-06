// Global app controller
import Search from "./models/Search";
import Recipe from "./models/Recipe";
import { elements, renderLoader, clearLoader } from "./views/baseView";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import { stat } from "fs";


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
  }
  console.log(state.recipe);
});