import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import HomePage from './pages/HomePage';
import DetailsPage from './pages/DetailsPage';
import PaymentPage from './pages/PaymentPage';
import ConfirmationPage from './pages/ConfirmationPage';

function AppLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const showAppChrome = !isHomePage;

  return (
    <div className="App">
      {showAppChrome && <Header />}
      <main className={`main-content ${isHomePage ? 'main-content-home' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/details" element={<DetailsPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
        </Routes>
      </main>
      {showAppChrome && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
