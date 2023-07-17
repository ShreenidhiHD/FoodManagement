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
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminDonations from './pages/Admin/AdminDonations';
import AdminViewPurchases from './pages/Admin/AdminViewPurchases';
import AdminVerifyUsers from './pages/Admin/AdminVerifyUsers';
import AdminCharity from './pages/Admin/AdminCharity';
import ForgetPassword from './pages/ForgetPassword';
import CompleteProfile from './pages/User/CompleteProfile';
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
            <Route path="/forgetpassword" element={<ForgetPassword />} />
            <Route path="/userhome" element={<AuthenticatedRoute><UserHome /></AuthenticatedRoute>} />
            <Route path="/userprofile" element={<AuthenticatedRoute><UserProfile /></AuthenticatedRoute>} />
            <Route path="/donatefood" element={<AuthenticatedRoute><DonateFood /></AuthenticatedRoute>} />
            <Route path="/dashboard" element={<AuthenticatedRoute><Dashboard /></AuthenticatedRoute>} />
            <Route path="/userdonations" element={<AuthenticatedRoute><UserDonations /></AuthenticatedRoute>} />
            <Route path="/userpurchases" element={<AuthenticatedRoute><UserPurchases /></AuthenticatedRoute>} />
            <Route path="/userrequests" element={<AuthenticatedRoute><UserRequests/></AuthenticatedRoute>} />
            <Route path="/userdonationrequests" element={<AuthenticatedRoute><Userdonationrequests/></AuthenticatedRoute>} />
            <Route path="/donations/:id" element={<AuthenticatedRoute><ViewDonation /></AuthenticatedRoute>} />
            <Route path="/donations/requests/:id/:eventname" element={<AuthenticatedRoute><ViewRequests /></AuthenticatedRoute>} />
            <Route path="/admindashboard" element={<AuthenticatedRoute><AdminDashboard /></AuthenticatedRoute>} />
            <Route path="/adminusers" element={<AuthenticatedRoute><AdminUsers /></AuthenticatedRoute>} />
            <Route path="/admindonations" element={<AuthenticatedRoute><AdminDonations /></AuthenticatedRoute>} />
            <Route path="/adminviewpurchases/:id" element={<AuthenticatedRoute><AdminViewPurchases /></AuthenticatedRoute>} />
            <Route path="/adminverifyusers" element={<AuthenticatedRoute><AdminVerifyUsers /></AuthenticatedRoute>} />
            <Route path="/admincharity" element={<AuthenticatedRoute><AdminCharity /></AuthenticatedRoute>} />
           
            <Route path="/completeprofile" element={<AuthenticatedRoute skipProfileCheck><CompleteProfile /></AuthenticatedRoute>} />

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