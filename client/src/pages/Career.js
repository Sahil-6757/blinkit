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

  // File upload
  if (type === "file") {
    setResumePdf(files[0]);
    return;
  }

  // Name → only alphabets
  if (name === "name") {
    const onlyText = value.replace(/[^A-Za-z ]/g, "");
    setFormData((prev) => ({ ...prev, name: onlyText }));
    return;
  }

  // Phone → max 10 digits
  if (name === "phone") {
    const onlyNumbers = value.replace(/[^0-9]/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: onlyNumbers }));
    return;
  }

  // Zip → max 6 digits
  if (name === "zip") {
    const onlyNumbers = value.replace(/[^0-9]/g, "").slice(0, 6);
    setFormData((prev) => ({ ...prev, zip: onlyNumbers }));
    return;
  }

  if (name === "phone") {
  // Allow only numbers
  let onlyNumbers = value.replace(/[^0-9]/g, "");

  // Restrict first digit (must be 9,8,7,6)
  if (onlyNumbers.length === 1 && !/[9876]/.test(onlyNumbers)) {
    return; // block invalid first digit
  }

  // Limit to 10 digits
  onlyNumbers = onlyNumbers.slice(0, 10);

  setFormData((prev) => ({ ...prev, phone: onlyNumbers }));
  return;
}

  // Default
  setFormData((prev) => ({ ...prev, [name]: value }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.resumeLink) {
      toast.error("Please provide a resume link");
      return;
    }
    if (!formData.message) {
      toast.error("Please provide a message");
      return;
    }
  
   
 

    if (!formData.name) {
      toast.error("Please provide a name");
      return;
    }
        if (!formData.email) {
      toast.error("Please provide an email");
      return;
    }

       if (!formData.phone) {
      toast.error("Please provide a phone number");
      return;
    }

      if (!formData.jobTitle) {
      toast.error("Please provide a job title");
      return;
    }
       if (!formData.city) {
      toast.error("Please provide a city");
      return;
    }

     if (!formData.address) {
      toast.error("Please provide an address");
      return;
    }
 
    if (!formData.state) {
      toast.error("Please provide a state");
      return;
    }
    if (!formData.zip) {
      toast.error("Please provide a zip code");
      return;
    }
    if (!formData.country) {
      toast.error("Please provide a country");
      return;
    }
    
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
            <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} />
          </div>

          <div className='form-group'>
            <label><Mail size={16} /> Email Address</label>
            <input type="email" name="email" placeholder="john@gmail.com" value={formData.email} onChange={handleChange} pattern=".+@gmail\.com" title="Only @gmail.com emails are allowed" />
          </div>

          <div className='form-group'>
            <label><Phone size={16} /> Phone Number</label>
          <input
  type="text"
  name="phone"
  placeholder="9876543210"
  value={formData.phone}
  onChange={handleChange}
  pattern="[6-9]{1}[0-9]{9}"
  title="Phone must start with 9,8,7,6 and be 10 digits"
/> </div>

          <div className='form-group'>
            <label><Briefcase size={16} /> Desired Job Title</label>
            <select name="jobTitle" value={formData.jobTitle} onChange={handleChange}>
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
            <input type="text" name="address" placeholder="123 Main St" value={formData.address} onChange={handleChange} />
          </div>

          <div className='form-group'>
            <label><MapPin size={16} /> City</label>
            <input type="text" name="city" placeholder="Mumbai" value={formData.city} onChange={handleChange} />
          </div>

          <div className='form-group'>
            <label><Globe size={16} /> State</label>
            <input type="text" name="state" placeholder="Maharashtra" value={formData.state} onChange={handleChange} />
          </div>

          <div className='form-group'>
            <label><MapPin size={16} /> Zip Code</label>
            <input type="number" name="zip" placeholder="400001" value={formData.zip} onChange={handleChange} maxLength={6} />
          </div>

          <div className='form-group'>
            <label><Globe size={16} /> Country</label>
            <input type="text" name="country" placeholder="India" value={formData.country} onChange={handleChange} />
          </div>

          <div className='form-group full-width'>
            <label><FileText size={16} /> Resume Link (Drive/Dropbox)</label>
            <input type="url" name="resumeLink" placeholder="https://link-to-your-resume.com" value={formData.resumeLink} onChange={handleChange} />
          </div>
          <div className='form-group full-width'>
            <label><FileText size={16} /> Upload Resume</label>
            <input type="file" name="resumePdf" onChange={handleChange} accept=".pdf,.docx" />
          </div>

          <div className='form-group full-width'>
            <label>Why do you want to join us?</label>
            <textarea name="message" rows="4" placeholder="Tell us about your passion..." value={formData.message} onChange={handleChange}></textarea>
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