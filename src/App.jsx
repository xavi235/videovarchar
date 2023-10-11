import React from 'react';
import './App.css';

import { BrowserRouter as Router } from 'react-router-dom';

import Header from './components/MenuNavegacion/ubicacionImagen'
import App2 from './components/Plantilla/plantilla'

function App() {
  return (
    <Router>
    <div className="App">
      <Header/>
        <App2/>
    </div>
    </Router>
  );
}

export default App;
