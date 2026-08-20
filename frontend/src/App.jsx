import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PartyDetails from './pages/PartyDetails';
import CreateParty from './pages/CreateParty';

function App() {
  return (
    <Router>
      {/* Flex layout ensures the footer pushes to the bottom if content is short */}
      <div className="min-h-screen bg-[#F9F9F8] font-sans flex flex-col">
        <Navbar />
        
        {/* Main Content Wrapper */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/party/:id" element={<PartyDetails />} />
            <Route path="/host" element={<CreateParty />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;