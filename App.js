// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import LoginModal from "./components/LoginModal";
import Planner from "./components/Planner";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Open the login modal
  const handleOpenModal = () => setIsModalOpen(true);

  // Close the login modal
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 🏠 Hero (Landing) Page */}
          <Route
            path="/"
            element={<Hero onGetStarted={handleOpenModal} />}
          />

          {/* 📅 Planner Page */}
          <Route path="/planner" element={<Planner />} />
        </Routes>

        {/* 🔐 Login Modal (appears on Hero page) */}
        {isModalOpen && (
          <LoginModal
            onClose={handleCloseModal}
            onLoginSuccess={() => {
              handleCloseModal();
              window.location.href = "/planner"; // Redirect after login
            }}
          />
        )}
      </div>
    </Router>
  );
}

export default App;  