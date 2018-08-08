// Global app controller
import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import { elements, renderLoader, clearLoader, elementStrings } from "./views/baseView";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";


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
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

    } catch(err) {
      console.log(err);
    }

  }
}

// add listener on hash change
window.addEventListener('hashchange', controlRecipe);
window.addEventListener("load", controlRecipe);

// listend fod update servings 
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
  } else if(event.target.matches(".recipe__love, .recipe__loce *")) {
    controlLike;
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


// like controller
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentId = state.recipe.id;

  if (!state.likes.isLiked) {
    // is not already liked
    // add new like to state
    const {title, author, img} = state.recipe;
    const newLike = state.likes.addLike(currentId, title, author, img); 
    console.log(state.likes);
    // toggle like btn
    likesView.toggleLikeBtn(true);
    // add to ui
    likesView.renderLike(newLike);
  } else {
    // is already liked
    // remove from state
    state.likes.deleteLike(currentId);
    console.log(state.likes);
    // toggle btn
    likesView.toggleLikeBtn(false);
    // remove like
    likesView.deleteLike(currentId);
  }
  // toggle btn
  likesView.toggleLikeMenu(state.likes.getNumLikes());
}

// resotre likes on page load 
window.addEventListener("load", () => {
  // creat enew likes arr
  state.likes = new Likes();
  // restore likes
  state.likes.readStorage();
  // toggle btn
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  // render existing likes
  state.likes.likes.forEach(like => likesView.renderLike(like));
})