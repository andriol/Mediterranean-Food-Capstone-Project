import React from "react";
import "./SingleRecipeDetails.scss";

const SingleRecipeDetails = ({ recipe, show, handleToggle }) => {
  const { name, image, country, description, ingredients } = recipe;

  return (
    <>
      {show && (
        <div className="modal">
          <div onClick={handleToggle} className="overlay"></div>
          <div className="modal__content">
            <img className="modal__content-image" src={image} alt={name} />
            <div className="modal__content-textarea">
              <div className="modal__content-name">{name}</div>
              <div className="modal__content-country">{country}</div>
              <div className="modal__content-description">{description}</div>
              <div className="modal__content-ingredients">{ingredients}</div>
            </div>
            <button className="modal__content-button" onClick={handleToggle}>
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default SingleRecipeDetails;
