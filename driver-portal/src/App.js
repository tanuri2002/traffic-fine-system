import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import ProtectedRoute from './components/Common/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CreateOfficerPage from './pages/CreateOfficerPage';
import CreateFinePage from './pages/CreateFinePage';
import DetailsPage from './pages/DetailsPage';
import PaymentPage from './pages/PaymentPage';
import ConfirmationPage from './pages/ConfirmationPage';

function AppLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isAuth = location.pathname === '/login' || location.pathname === '/signin';
  const isFullWidth = isHome || isAuth;

  return (
    <div className="App">
      {!isHome && <Header />}
      <main className={isFullWidth ? 'main-content main-content-home' : 'main-content'}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-officer" element={<CreateOfficerPage />} />
          <Route
            path="/create-fine"
            element={
              <ProtectedRoute>
                <CreateFinePage />
              </ProtectedRoute>
            }
          />
          <Route path="/details" element={<DetailsPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/signin" element={<LoginPage />} />
        </Routes>
      </main>
      {!isHome && <Footer />}
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
