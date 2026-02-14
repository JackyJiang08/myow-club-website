import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import CalendarPage from './pages/Calendar';
import Activities from './pages/Activities';
import Staff from './pages/Staff';
import About from './pages/About';
import Store from './pages/Store';
import Membership from './pages/Membership';
import { Instagram } from 'lucide-react';
// import Admin from './pages/Admin';
// import Login from './pages/Login';
// import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/about" element={<About />} />
            <Route path="/store" element={<Store />} />
            <Route path="/membership" element={<Membership />} />
            
            {/* 
            <Route path="/login" element={<Login />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } 
            /> 
            */}
          </Routes>
        </main>
        <footer className="bg-white border-t border-gray-100 mt-auto">
          <div className="container mx-auto px-8 lg:px-16 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
              {/* Left Side: Logo & Copyright */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 opacity-80">
                  <img 
                    src="/logo.png" 
                    alt="MYOW Logo" 
                    className="w-full h-full object-cover transform scale-150 translate-y-1"
                  />
                </div>
                <p>&copy; {new Date().getFullYear()} MYOW DIY Club @ UIUC. All rights reserved.</p>
              </div>

              {/* Right Side: Contact & Socials */}
              <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
                <span className="text-gray-500 font-medium">Contact Us</span>
                <a 
                  href="https://www.instagram.com/myow_diy_club/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-black transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
