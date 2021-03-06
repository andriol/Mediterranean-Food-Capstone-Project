import React, { Component } from "react";
import { Route } from "react-router-dom";
import SearchBox from "../searchBox/SearchBox";
import RecipeList from "../recipeList/RecipeList";
import RecipeDetails from "../recipeDetails/RecipeDetails";
import axios from "axios";

//`${API_URL}/mediterranean`
class BrowseRecipes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
      selectedRecipe: {},
      searchField: "",
      show: false,
    };
  }

  handleToggle = () => {
    this.setState({ show: !this.state.show });
  };
  // async/await
  browseRecipes = async () => {
    const response = await fetch("http://localhost:8080/mediterranean");
    console.log(response);
    const data = await response.json();
    console.log(data);
    this.setState({
      recipes: data,
    });
  };
  //axios
  getIndividualRecipe = (mediterraneanId) => {
    return axios
      .get(`http://localhost:8080/mediterranean/${mediterraneanId}`)
      .then((res) => {
        console.log(res);
        this.setState({
          selectedRecipe: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.browseRecipes();
    this.getIndividualRecipe();
  }
  render() {
    const { recipes, searchField } = this.state;
    const filteredRecipes = recipes.filter((recipe) =>
      recipe.country.toLowerCase().includes(searchField.toLowerCase())
    );

    return (
      <div>
        <SearchBox
          placeholder="Search by country..."
          handleChange={(e) => this.setState({ searchField: e.target.value })}
        />
        <RecipeList
          recipes={filteredRecipes}
          handleToggle={this.handleToggle}
        />

        <Route
          path="/mediterranean/:mediterraneanId"
          render={(props) => (
            <RecipeDetails
              getIndividualRecipe={this.getIndividualRecipe}
              browseRecipes={this.browseRecipes}
              recipe={this.state.selectedRecipe}
              {...props}
              show={this.state.show}
              handleToggle={this.handleToggle}
            />
          )}
        />
      </div>
    );
  }
}
export default BrowseRecipes;
