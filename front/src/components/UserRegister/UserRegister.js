import { useState, useEffect, useRef } from 'react';
import styles from './UserRegister.module.css';
import axios from '../../axios.js';
import { useUserStore } from '../../store';

function UserRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const googleButtonRef = useRef(null);

  const loginUser = useUserStore((state) => state.loginUser);

  const handleGoogleSignIn = async (response) => {
    try {
      setErrorMessage('');
      const res = await axios.post('/users/auth/google', { token: response.credential });
      if (res.data.accessToken) {
        loginUser(res.data._id, res.data.accessToken);
      }
    } catch (error) {
      console.error('GOOGLE REGISTER ERROR:', error.response?.data);
      setErrorMessage(error.response?.data?.message || 'Google registration failed');
    }
  };

  useEffect(() => {
    // Initialize Google Sign-In when script loads
    const initGoogleSignIn = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signup_with',
        });
      }
    };

    // Check if Google is already loaded
    if (window.google) {
      initGoogleSignIn();
    } else {
      // Wait for Google script to load
      const checkGoogle = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogle);
          initGoogleSignIn();
        }
      }, 100);

      // Cleanup after 5 seconds
      setTimeout(() => clearInterval(checkGoogle), 5000);
    }

    return () => {
      if (window.google && googleButtonRef.current) {
        // Cleanup if needed
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    const userObject = {
      name: name,
      email: email,
      password: password,
    };
    try {
      const res = await axios.post('/users/signup', userObject);
      await axios
        .post('/users/signin', {
          email: email,
          password: password,
        })
        .then((res) => {
          if (res.data.accessToken) {
            loginUser(res.data._id);
          }
        });
    } catch (error) {
      console.error('REGISTER ERROR:', error.response.data.controller);
      setErrorMessage(error.response.data.message.message);
    }
  };

  return (
    <form className={styles.UserRegister} onSubmit={handleSubmit}>
      <label>Name:</label>
      <input
        id='input_name'
        type='text'
        name='name'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Email:</label>
      <input
        id='input_email'
        type='email'
        name='email'
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
      />
      <label>Password:</label>
      <input
        id='input_password'
        type='password'
        name='password'
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className='error-container'>{errorMessage}</div>
      <button className='button-primary'>Register</button>
      <div className={styles.divider}>or</div>
      <div ref={googleButtonRef} className={styles.googleButton}></div>
    </form>
  );
}

export default UserRegister;
