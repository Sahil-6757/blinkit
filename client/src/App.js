import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Contactus from './pages/Contactus';
import Terms from './pages/Terms';
import Footer from './components/Footer';
import Privacy from './pages/Privacy';
import FAQs from './pages/FAQs';
import { Routes, Route, Navigate } from 'react-router-dom';
import Account from './components/Account';
import Cart from './components/Cart';
import Notfound from './components/Notfound';
import About from './pages/About';
import Careers from './pages/Career';
import Blog from './pages/Blog';
import BlogDetails from './pages/BlogDetails';
import Login from './components/Login';
import Search from './components/Search';
import Admin from './components/Admin';
import DynamicCategory from './components/category/DynamicCategory';

const ProtectedAdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('admin') === 'true';
  const user = JSON.parse(localStorage.getItem('user'));

  if (!isAdmin || !user || user.username.toLowerCase() !== 'admin') {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="*" element={<Notfound />} />
        <Route path="/" element={<Home />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/contactus" element={<Contactus />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/account" element={<Account />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/admin" element={
          <ProtectedAdminRoute>
            <Admin />
          </ProtectedAdminRoute>
        } />
        <Route path="/category/:slug" element={<DynamicCategory />} />
        <Route path="/search" element={<Search />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
