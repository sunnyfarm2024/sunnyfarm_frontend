import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/pages/Login/Login';
import Register from './components/pages/Register/Register';
import Main from './components/pages/Main/Main';
import Location from './components/pages/Location/Location';
import Shop from './components/pages/Shop/Shop';
import './App.css';

const App = () => {
  return (
    <div className="container">
    <div className="content">
      <div className="inner-content">
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/location" element={<Location />} />
        <Route path="/main" element={<Main />} />
        <Route path="/shop" element={<Shop />} />
      </Routes>
    </Router>
    </div>
    </div>
    </div>
  );
};

export default App;
