import React, { useState, useEffect } from "react";
import "../css/Footer.css";
import { Zap} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
function Footer() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
   const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(Array.isArray(data) ? data : []);
        } else {
          console.error("Failed to fetch categories: server responded with status", response.status);
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };
    useEffect(() => {
      fetchCategories();
    }, []);



  return (
    <React.Fragment>
      <footer className="footer">

        {/* TOP FEATURES */}
    


        {/* MAIN FOOTER */}
        <div className="footer-main">

          <div className="footer-col brand">
            <h2> <Zap size={18}/> blinkit</h2>
            <p>
              Your everyday grocery store, delivering fresh and quality
              products in minutes.
            </p>
            <p className="">
              Follow us on social media
            </p>
            <p className="">
              <FaFacebookF size={24} className=" social-icons"/>
              <FaTwitter size={24} className="mx-3 social-icons"/>
              <FaInstagram size={24} className="mx-3 social-icons"/>
              <FaYoutube size={24} className="mx-3 social-icons"/>
            </p>

          </div>

          <div className="footer-col">
            <h3>Useful Links</h3>
            <ul>
              <li> <Link to="/about" className="link" onClick={scrollToTop}>About</Link> </li>
              <li> <Link to="/careers" className="link" onClick={scrollToTop}>Careers</Link> </li>
              <li> <Link to="/blog" className="link" onClick={scrollToTop}>Blog</Link> </li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Help</h3>
            <ul>
              <li> <Link to="/faqs" className="link" onClick={scrollToTop}>FAQ</Link> </li>
              <li> <Link to="/contactus" className="link" onClick={scrollToTop}>Contact Us</Link> </li>
              <li> <Link to="/terms" className="link" onClick={scrollToTop}>Terms & Conditions</Link> </li>
              <li> <Link to="/privacy" className="link" onClick={scrollToTop}>Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Categories</h3>
            <ul>
              {Array.isArray(categories) && categories
                .filter(item => item.showInFooter !== false)
                .map((item, index) => (
                <li key={index} onClick={() => { navigate(`/category/${item.slug}`); scrollToTop(); }}>
                  {item.name}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="footer-bottom">
          <p className="footer-para">

          © 2026 Blinkit Clone. All rights reserved.
          </p>
          <p className="footer-para">Designed and Developed by <a href="https://dddigitalsolution.com/" className="ddd" target="_blank" rel="noopener noreferrer">Darshand Digital Solution LLP</a></p>
        </div>

      </footer>
    </React.Fragment>
  )
}

export default Footer
