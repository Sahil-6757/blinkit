import React from "react";
import "../css/Footer.css";
import { Zap} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
function Footer() {
  const navigate = useNavigate();
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }



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
              <li onClick={()=>navigate("category/fruits-vegetables")}>Fruits & Vegetables</li>
              <li onClick={()=>navigate("category/dairy-bread-eggs")}>Dairy, Bread & Eggs</li>
              <li onClick={()=>navigate("category/snacks-munchies")}>Snacks & Munchies</li>
              <li onClick={()=>navigate("category/cold-drinks-juices")}>Cold Drinks & Juices</li>
              <li onClick={()=>navigate("category/breakfast-instant-food")}>Breakfast & Instant Food</li>
              <li onClick={()=>navigate("category/bakery-biscuits")}>Bakery Biscuits</li>
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
