// import axios for AJAX call
import axios from "axios";


export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    const key = `650874ccbd06f7b55be4dd806a060f46`;
    const proxy = `https://cors-anywhere.herokuapp.com/`;
    
    try {
      const result = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.recipes = result.data.recipes;
    } catch(err) {
      console.log(err);
    }
  }
}