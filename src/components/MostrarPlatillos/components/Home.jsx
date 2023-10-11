import React, { useState } from 'react';
import Recipe from './Recipe';

const Home = () => {
  const [showRecipe, setShowRecipe] = useState(true);

  const toggleRecipe = () => {
    setShowRecipe(!showRecipe);
  };

  return (
    <div>
      <h1>Platos Tradicionales Registrados</h1>
      <button onClick={toggleRecipe}>
        {showRecipe ? 'Ocultar Receta' : 'Mostrar Receta'}
      </button>
      {showRecipe && <Recipe />}
    </div>
    
  );
};

export default Home;
