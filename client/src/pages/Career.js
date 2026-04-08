import React, { useState } from 'react';
import { Briefcase, MapPin, Send, User, Mail, Phone, Home, Globe, FileText, Award, Heart, Zap } from 'lucide-react';
import '../css/Career.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Career() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    jobTitle: '',
    resumeLink: '',
    message: ''
  });
  const [resumePdf, setResumePdf] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setResumePdf(files[0]);
    } else {
      if (name === 'phone' && value.length > 10) return;
      if (name === 'zip' && value.length > 6) return;
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      if (resumePdf) {
        data.append('resumePdf', resumePdf);
      }

      const response = await fetch('http://localhost:8000/careers', {
        method: 'POST',
        body: data, // FormData sets the correct headers automatically
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Application submitted successfully! Our team will contact you soon.");
        setFormData({
          name: '', email: '', phone: '', address: '', city: '',
          state: '', zip: '', country: '', jobTitle: '', resumeLink: '', message: ''
        });
        setResumePdf(null);
        // Clear file input manually if needed
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
      } else {
        toast.error(result.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className='career-page'>
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Hero Section */}
      <section className='career-hero'>
        <h1>Join the Future</h1>
        <p>Help us shape the next generation of rapid e-commerce. We're looking for passionate individuals to join our fast-growing team.</p>
      </section>

      {/* Benefits Section */}
      <section className='benefits-section'>
        <div className='benefit-card'>
          <Heart className='benefit-icon' size={32} />
          <h3>Inclusive Culture</h3>
          <p>We believe in diversity and strive to create an environment where everyone feels valued.</p>
        </div>
        <div className='benefit-card'>
          <Award className='benefit-icon' size={32} />
          <h3>Growth Mindset</h3>
          <p>Continuous learning and professional development are at the core of our values.</p>
        </div>
        <div className='benefit-card'>
          <Zap className='benefit-icon' size={32} />
          <h3>Fast Paced</h3>
          <p>Work on challenging problems in a dynamic environment that moves at the speed of light.</p>
        </div>
      </section>

      {/* Application Form */}
      <div className='career-form-container'>
        <div className='form-header'>
          <h2>Apply Now</h2>
          <p>Fill out the form below to apply for your dream role</p>
        </div>

        <form onSubmit={handleSubmit} className='career-form'>
          <div className='form-group'>
            <label><User size={16} /> Full Name</label>
            <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
          </div>

          <div className='form-group'>
            <label><Mail size={16} /> Email Address</label>
            <input type="email" name="email" placeholder="john@gmail.com" value={formData.email} onChange={handleChange} required pattern=".+@gmail\.com" title="Only @gmail.com emails are allowed" />
          </div>

          <div className='form-group'>
            <label><Phone size={16} /> Phone Number</label>
            <input type="number" name="phone" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} maxLength={10} required />
          </div>

          <div className='form-group'>
            <label><Briefcase size={16} /> Desired Job Title</label>
            <select name="jobTitle" value={formData.jobTitle} onChange={handleChange} required>
              <option value="">Select a role</option>
              <option value="Software Engineer">Software Engineer</option>
              <option value="Product Manager">Product Manager</option>
              <option value="UX/UI Designer">UX/UI Designer</option>
              <option value="Marketing Specialist">Marketing Specialist</option>
              <option value="Delivery Partner">Delivery Partner</option>
            </select>
          </div>

          <div className='form-group full-width'>
            <label><Home size={16} /> Street Address</label>
            <input type="text" name="address" placeholder="123 Main St" value={formData.address} onChange={handleChange} required />
          </div>

          <div className='form-group'>
            <label><MapPin size={16} /> City</label>
            <input type="text" name="city" placeholder="Mumbai" value={formData.city} onChange={handleChange} required />
          </div>

          <div className='form-group'>
            <label><Globe size={16} /> State</label>
            <input type="text" name="state" placeholder="Maharashtra" value={formData.state} onChange={handleChange} required />
          </div>

          <div className='form-group'>
            <label><MapPin size={16} /> Zip Code</label>
            <input type="number" name="zip" placeholder="400001" value={formData.zip} onChange={handleChange} maxLength={6} required />
          </div>

          <div className='form-group'>
            <label><Globe size={16} /> Country</label>
            <input type="text" name="country" placeholder="India" value={formData.country} onChange={handleChange} required />
          </div>

          <div className='form-group full-width'>
            <label><FileText size={16} /> Resume Link (Drive/Dropbox)</label>
            <input type="text" name="resumeLink" placeholder="https://link-to-your-resume.com" value={formData.resumeLink} onChange={handleChange} required />
          </div>
          <div className='form-group full-width'>
            <label><FileText size={16} /> Upload Resume</label>
            <input type="file" name="resumePdf" onChange={handleChange} required accept=".pdf,.docx" />
          </div>

          <div className='form-group full-width'>
            <label>Why do you want to join us?</label>
            <textarea name="message" rows="4" placeholder="Tell us about your passion..." value={formData.message} onChange={handleChange} required></textarea>
          </div>

          <div className='submit-container full-width'>
            <button type="submit" className='submit-btn'>
              <Send size={18} style={{marginRight: '8px'}} /> Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Career;