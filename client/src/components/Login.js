import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { User, Mail, Lock, LogIn, MapPin, UserPlus } from 'lucide-react'
import '../css/Login.css'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    email: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isRegister && !formData.email.endsWith('@gmail.com')) {
      toast.error('Only @gmail.com emails are allowed');
      return;
    }

    if (isRegister && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    const endpoint = isRegister ? 'http://localhost:8000/register' : 'http://localhost:8000/login';
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      

      if (response.ok) {
        console.log(data)
        toast.success(data.message);
        if (!isRegister) {
          localStorage.setItem('user', JSON.stringify(data.user));
          // Dispatch custom event to update Navbar
          window.dispatchEvent(new Event("authChange"));
          
          const uname = data.user?.username?.toLowerCase() || '';
          const hasRole = !!data.user?.role;
          const hasPost = !!data.user?.post;

          if (uname === 'admin' || hasRole || hasPost) {
            localStorage.setItem('admin', 'true');
            navigate('/admin');
          } else {
            localStorage.setItem('admin', 'false');
            navigate('/');
          }
        } else {
          localStorage.setItem('user', JSON.stringify(data.user));
          window.dispatchEvent(new Event("authChange"));
          navigate('/');
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-page-wrapper'>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className='login-card'>
        {loading ? (
          <div className='loading-container'>
            <DotLottieReact
              src="https://lottie.host/6b83ad5b-45ef-4201-ba7b-095636301824/8I9Cf02wuq.lottie"
              loop
              autoplay
              style={{ width: '200px', height: '200px' }}
            />
            <p className='loading-text'>{isRegister ? 'Creating your account...' : 'Logging you in...'}</p>
          </div>
        ) : (
          <>
            <div className='login-header'>
              <h1>{isRegister ? 'Welcome!' : 'Hello Again!'}</h1>
              <p>{isRegister ? 'Create an account to start shopping' : 'Welcome back, please login to your account'}</p>
            </div>

            <form onSubmit={handleSubmit}>
              {isRegister && (
                <>
                  <div className='login-form-group'>
                    <div className='input-with-icon'>
                      <input
                        className='login-input'
                        type='text'
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                      <User className='input-icon' size={20} />
                    </div>
                  </div>
                  <div className='login-form-group'>
                    <div className='input-with-icon'>
                      <input
                        className='login-input'
                        type='email'
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        pattern=".+@gmail\.com"
                        title="Only @gmail.com emails are allowed"
                      />
                      <Mail className='input-icon' size={20} />
                    </div>
                  </div>
               
                </>
              )}
              
              <div className='login-form-group'>
                <div className='input-with-icon'>
                  <input
                    className='login-input'
                    type='text'
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                  <User className='input-icon' size={20} />
                </div>
              </div>

              <div className='login-form-group'>
                <div className='input-with-icon'>
                  <input
                    type='password'
                    className='login-input'
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <Lock className='input-icon' size={20} />
                </div>
               
              </div>
                 {
                   isRegister && (
                    <>
                    
                     <div className='login-form-group'>
                       <div className='input-with-icon'>
                         <input
                           type='password'
                           className='login-input'
                           name="confirmPassword"
                           placeholder="Confirm Password"
                           value={formData.confirmPassword}
                           onChange={handleChange}
                           required
                         />
                         <Lock className='input-icon' size={20} />
                       </div>

                       
                     </div>
                       <div className='input-with-icon'>
                         <input
                           type='text'
                           className='login-input'
                           name="address"
                           placeholder="Address"
                           value={formData.address}
                           onChange={handleChange}
                           required
                         />
                         <MapPin className='input-icon' size={20} />
                       </div>
                     </>
                   )
                 }

              <button type='submit' className='login-submit-btn'>
                {isRegister ? (
                  <><UserPlus size={20} style={{marginRight: '8px'}} /> Register</>
                ) : (
                  <><LogIn size={20} style={{marginRight: '8px'}} /> Login</>
                )}
              </button>

              <div className='login-toggle-text'>
                {isRegister ? 'Already have an account?' : "Don't have an account?"}
                <span
                  className='login-toggle-link'
                  onClick={() => setIsRegister(!isRegister)}
                >
                  {isRegister ? 'Login now' : 'Register now'}
                </span>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default Login
