import React from 'react';
import about1 from '../assets/about1.png';
import about2 from '../assets/about2.png';
import about3 from '../assets/about3.png';
import about4 from '../assets/about4.png';
import '../css/About.css';
const About = () => {
    return (
        <div className="container">
            <h2 style={{ textAlign: "center", color: "green" }}>About us</h2>
            <hr />
            <div className="subContainer my-2">
                <div className="right">
                    <img src={about1} alt="About Us" className="About-img" />
                </div>
                <div className="left">
                    <h3 className="text-success">Who we are?</h3>
                    <p className="About-para">
                        Welcome to our platform — your one-stop destination for fast, reliable, and convenient grocery delivery.

                        We are building a modern quick-commerce experience inspired by the need for speed and simplicity in everyday shopping. Our mission is to deliver fresh groceries, daily essentials, and household items to your doorstep in just minutes, saving you time and effort.
                    </p>
                </div>
            </div>

            <div className="subContainer my-2">
                <div className="left">
                    <h3 className="text-success">Our Vision</h3>
                    <p className="About-para">
                        We aim to revolutionize the way people shop for daily essentials by combining technology, efficiency, and customer-first thinking. Our goal is to make grocery shopping effortless, quick, and accessible for everyone.
                    </p>
                </div>
                <div className="right">
                    <img src={about2} alt="About Us" className="About-img" />
                </div>
            </div>
            {/* <div className="weOffer">
        <h3 style={{ color: "blue", textAlign: "center" }}>What we offer?</h3>
        <div className="offer">
        <ul className="offer-list">
          <li>Fresh and seasonal fruits </li>
          <li>Information about fruit benefits and nutrition </li>
          <li>Healthy recipes and diet tips </li>
          <li>Guides on choosing and storing fruits </li>
          <li>Insights into organic and farm-fresh produce </li>
        </ul>
      </div>
      </div> */}
            <div className="subContainer my-2">
                <div className="right">
                    <img src={about3} alt="About Us" className="About-img" />
                </div>
                <div className="left">
                    <h3 className="text-success">What we offer?</h3>
                    <div className="offerr">
                        <ul className="offer-list">
                           <li>Super superfast delivery within minutes</li>
                           <li>range of products – fruits, vegetables, dairy, snacks, beverages, and more</li>
                           <li>Best prices with exciting offers</li>
                           <li>Easy ordering with a smooth and user-friendly interface</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="subContainer my-2">
                <div className="left">
                    <h3 className="text-success">Our Story</h3>
                    <p className="About-para">
                        Our journey began with a simple idea — why should grocery shopping take so much time and effort?

In today’s fast-paced world, people are busier than ever. Standing in long queues, dealing with traffic, or waiting days for deliveries didn’t make sense anymore. We saw an opportunity to simplify everyday life by bringing essentials to people instantly.
                    </p>
                </div>
                <div className="right">
                    <img src={about4} alt="About Us" className="About-img" />
                </div>
            </div>

        </div>
    );
};

export default About;
