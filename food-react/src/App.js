import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthenticatedRoute from './utils/AuthenticatedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Categories from './pages/Categories';
import About from './pages/About';
import Contact from './pages/Contact';
import Signup from './pages/Signup';
import Login from './pages/Login';
import UserHome from './pages/User/UserHome';
import UserProfile from './pages/User/UserProfile';
// import CompleteProfile from './pages/User/CompleteProfile';
import DonateFood from './pages/User/DonateFood';
import Dashboard from './pages/User/Dashboard';
import SettingsProvider from './server/SettingsProvider';
import UserDonations from './pages/User/UserDonations';
import ViewDonation from './pages/User/ViewDonation';
import UserPurchases from './pages/User/UserPurchases';
import UserRequests from './pages/User/UserRequests';
import Userdonationrequests from './pages/User/Userdonationrequests';
import ViewRequests from './pages/User/ViewRequests';


// The App component wraps the entire application and sets up routing for all pages.
// It also provides settings to all components using the SettingsProvider.
function App() {
  return (
    <SettingsProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/userhome" element={<AuthenticatedRoute><UserHome /></AuthenticatedRoute>} />
            <Route path="/userprofile" element={<AuthenticatedRoute><UserProfile /></AuthenticatedRoute>} />
            {/* <Route path="/completeprofile" element={<AuthenticatedRoute><CompleteProfile /></AuthenticatedRoute>} /> */}
            <Route path="/donatefood" element={<AuthenticatedRoute><DonateFood /></AuthenticatedRoute>} />
            <Route path="/dashboard" element={<AuthenticatedRoute><Dashboard /></AuthenticatedRoute>} />
            <Route path="/userdonations" element={<AuthenticatedRoute><UserDonations /></AuthenticatedRoute>} />
            <Route path="/userpurchases" element={<AuthenticatedRoute><UserPurchases /></AuthenticatedRoute>} />
            <Route path="/userrequests" element={<AuthenticatedRoute><UserRequests/></AuthenticatedRoute>} />
            <Route path="/userdonationrequests" element={<AuthenticatedRoute><Userdonationrequests/></AuthenticatedRoute>} />
            <Route path="/donations/:id" element={<AuthenticatedRoute><ViewDonation /></AuthenticatedRoute>} />
            <Route path="/donations/requests/:id" element={<AuthenticatedRoute><ViewRequests /></AuthenticatedRoute>} />
            
          </Routes>
        </div>
      </Router>
    </SettingsProvider>
  );
}

export default App;

// The App component wraps the entire application and sets up routing for all pages.
// It also provides settings to all components using the SettingsProvider.
// Navbar is always rendered at the top, while other components are rendered based on the current route.
// The AuthenticatedRoute is used for routes that should only be accessible to authenticated users.