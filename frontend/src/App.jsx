import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import PartyDetails from './pages/PartyDetails';
import CreateParty from './pages/CreateParty';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import HostDashboard from './pages/HostDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="bottom-right" richColors />
        <div className="min-h-screen bg-[#F9F9F8] font-sans flex flex-col">
          <Navbar />
          
          {/* Main Content Wrapper */}
          <main className="flex-grow">  
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/party/:id" element={<PartyDetails />} />
              <Route path="/host" element={<CreateParty />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<HostDashboard />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;