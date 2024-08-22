// frontend\src\App.jsx

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
// import SettingsPage from './pages/SettingsPage';
// import ArticlePage from './pages/ArticlePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* <Route path="/settings" element={<SettingsPage />} /> */}
        {/* <Route path="/article/:id" element={<ArticlePage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
