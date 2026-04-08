import React, { useState } from "react";
import { TextField, Button, Typography, Box, Container, Paper, Grid, IconButton } from "@mui/material";
import { Mail, Phone, MapPin, Send, ExternalLink } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "../css/Contact.css";
import banner from "../assets/contact-masthead.png";

function Contactus() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

  if (!formData.email.endsWith("@gmail.com")) {
    toast.error("Only Gmail addresses are allowed",
      {autoClose:800,position:"bottom-center"}
    );
    return;
  }
    setLoading(true);
    console.log(formData)

    try {
      const res = await fetch("http://localhost:8000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to send message");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Banner */}
      <div className="contact-banner-container">
        <div className="banner-overlay"></div>

        <div className="banner-content text-center">
          <Typography variant="h2" className="fw-bold mb-3 banner-title">
            Let's Connect!
          </Typography>
          <Typography variant="h6" className="banner-subtitle">
            We are here to help you. Reach out for any questions, feedback or just to say hi!
          </Typography>
        </div>

        <img src={banner} alt="banner" className="contact-banner-img" />
      </div>

      <Container maxWidth="lg" className="contact-container my-5">
        <Grid container spacing={5}>

          {/* LEFT SIDE: Contact Information */}
          <Grid item xs={12} md={5}>
            <Box className="contact-info-section">
              <Typography variant="h4" className="fw-bold text-success mb-4">
                Contact Information
              </Typography>
              
              <div className="info-cards-container">
                {/* Email */}
                <Box className="info-item d-flex align-items-center gap-4 mb-4">
                  <div className="icon-box">
                    <Mail size={24} color="white" />
                  </div>
                  <div>
                    <Typography className="fw-bold">Email Us</Typography>
                    <Typography className="text-muted">info@blinkit.com</Typography>
                  </div>
                </Box>

                {/* Phone */}
                <Box className="info-item d-flex align-items-center gap-4 mb-4">
                  <div className="icon-box">
                    <Phone size={24} color="white" />
                  </div>
                  <div>
                    <Typography className="fw-bold">Call Us</Typography>
                    <Typography className="text-muted">+91 123 456 7890</Typography>
                  </div>
                </Box>

                {/* Location */}
                <Box className="info-item d-flex align-items-center gap-4 mb-5">
                  <div className="icon-box">
                    <MapPin size={24} color="white" />
                  </div>
                  <div>
                    <Typography className="fw-bold">Our Location</Typography>
                    <Typography className="text-muted">
                      Digital Solution, Blinkit Clone HQ, India
                    </Typography>
                  </div>
                </Box>
              </div>

              {/* Social Icons */}
              <Box className="social-section mt-4 p-4 rounded bg-white shadow-sm border">
                <Typography className="fw-bold mb-3">Connect with us</Typography>
                <div className="d-flex gap-3">
                  <IconButton className="social-btn fb"><FaFacebook size={20} /></IconButton>
                  <IconButton className="social-btn tw"><FaTwitter size={20} /></IconButton>
                  <IconButton className="social-btn ig"><FaInstagram size={20} /></IconButton>
                  <IconButton className="social-btn li"><FaLinkedin size={20} /></IconButton>
                </div>
              </Box>

              {/* FAQ Shortcut */}
              <Box className="faq-shortcut mt-4 p-4 rounded bg-success-light border border-success-subtle">
                <Typography className="fw-bold text-success mb-2">
                  Have common questions?
                </Typography>
                <Link to="/faqs" className="text-success fw-bold d-flex align-items-center gap-2 text-decoration-none">
                  Check our FAQs <ExternalLink size={16} />
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* RIGHT SIDE: Contact Form */}
          <Grid item xs={12} md={7}>
            <Paper elevation={0} className="contact-form-paper p-5 shadow rounded border">
              <Typography variant="h4" className="fw-bold mb-4">Send a Message</Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      variant="filled"
                      className="custom-field"
                    />
                  </Grid>
                 <Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    label="Email Address"
    name="email"
    type="email"
    value={formData.email}
    onChange={handleChange}
    required
    variant="filled"
    className="custom-field"
    inputProps={{
      pattern: "^[a-zA-Z0-9._%+-]+@gmail\\.com$"
    }}
    helperText="Only Gmail addresses allowed"
  />
</Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      variant="filled"
                      className="custom-field"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message"
                      name="message"
                      multiline
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      variant="filled"
                      className="custom-field"
                    />
                  </Grid>
                  <Grid item xs={12} className="mt-2">
                    <Button
                      type="submit"
                      variant="contained"
                      className="submit-btn"
                      fullWidth
                      disabled={loading}
                      endIcon={!loading && <Send size={20} />}
                      sx={{ py: 2, fontSize: '1.1rem', borderRadius: '12px', backgroundColor: '#0c831f', '&:hover': { backgroundColor: '#096e1a' } }}
                    >
                      {loading ? "Sending Message..." : "Send Message"}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <div className="contact-formContainer">
        
      </div>
    </div>
  );
}

export default Contactus;