import React, { useState, useEffect } from 'react';
import styles from './UserProfile.module.css';
import { useFetchUser } from '../../hooks/user/useFetchUser.js';
import { useUpdateProfile } from '../../hooks/user/useUpdateProfile.js';
import { useUpdatePassword } from '../../hooks/user/useUpdatePassword.js';

import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function UserProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordErrors, setPasswordErrors] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [user, isLoadingUser] = useFetchUser();
  const updateProfileMutation = useUpdateProfile();
  const updatePasswordMutation = useUpdatePassword();

  useEffect(() => {
    if (user) {
      setName(user.name.charAt(0).toUpperCase() + user.name.slice(1) || '');
      setEmail(user.email || '');
    }
  }, [user, isLoadingUser]);

  const validatePassword = (password) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  };

  const validatePasswordMatch = (newPass, confirmPass) => {
    if (confirmPass && newPass !== confirmPass) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handleNewPasswordChange = (value) => {
    setNewPassword(value);
    const error = validatePassword(value);
    setPasswordErrors((prev) => ({ ...prev, newPassword: error }));
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    const error = validatePasswordMatch(newPassword, value);
    setPasswordErrors((prev) => ({ ...prev, confirmPassword: error }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMessage('');

    updateProfileMutation.mutate(
      { name },
      {
        onSuccess: () => {
          setMessage('Profile updated successfully');
        },
        onError: (error) => {
          setErrorMessage(error.response?.data?.message || 'Error updating profile');
        },
      }
    );
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMessage('');

    if (passwordErrors.newPassword || passwordErrors.confirmPassword) {
      setErrorMessage('Please fix form errors');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    updatePasswordMutation.mutate(
      {
        currentPassword,
        newPassword,
      },
      {
        onSuccess: () => {
          setMessage('Password changed successfully');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setPasswordErrors({ newPassword: '', confirmPassword: '' });
        },
        onError: (error) => {
          setErrorMessage(error.response?.data?.message || 'Error changing password');
        },
      }
    );
  };

  return (
    <div className={styles['user-profile']}>
      <div className={styles['user-profile__section']}>
        <h3 className={styles['user-profile__section-title']}>Basic information</h3>
        <form onSubmit={handleUpdateProfile} className={styles['user-profile__form']}>
          <div className={styles['user-profile__form-group']}>
            <label htmlFor='name' className={styles['user-profile__label']}>
              Name:
            </label>
            <input
              type='text'
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles['user-profile__input']}
            />
          </div>

          <div className={styles['user-profile__form-group']}>
            <label htmlFor='email' className={styles['user-profile__label']}>
              Email (read-only):
            </label>
            <input
              type='email'
              id='email'
              value={email}
              disabled
              className={`${styles['user-profile__input']} ${styles['user-profile__input--disabled']}`}
            />
          </div>

          <button
            type='submit'
            disabled={updateProfileMutation.isPending || isLoadingUser}
            className={`button-primary ${styles['user-profile__button']}`}
          >
            {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className={styles['user-profile__section']}>
        <h3 className={styles['user-profile__section-title']}>Change password</h3>
        <form onSubmit={handleChangePassword} className={styles['user-profile__form']}>
          <div className={styles['user-profile__form-group']}>
            <label htmlFor='currentPassword' className={styles['user-profile__label']}>
              Current password:
            </label>
            <div className={styles['user-profile__password-input']}>
              <input
                type={showPasswords.current ? 'text' : 'password'}
                id='currentPassword'
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className={styles['user-profile__input']}
              />
              <button
                type='button'
                className={styles['user-profile__password-toggle']}
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPasswords.current ? (
                  <FontAwesomeIcon icon={faEyeSlash} />
                ) : (
                  <FontAwesomeIcon icon={faEye} />
                )}
              </button>
            </div>
          </div>

          <div className={styles['user-profile__form-group']}>
            <label htmlFor='newPassword' className={styles['user-profile__label']}>
              New password:
            </label>
            <div className={styles['user-profile__password-input']}>
              <input
                type={showPasswords.new ? 'text' : 'password'}
                id='newPassword'
                value={newPassword}
                onChange={(e) => handleNewPasswordChange(e.target.value)}
                required
                minLength='6'
                className={styles['user-profile__input']}
              />
              <button
                type='button'
                className={styles['user-profile__password-toggle']}
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? (
                  <FontAwesomeIcon icon={faEyeSlash} />
                ) : (
                  <FontAwesomeIcon icon={faEye} />
                )}
              </button>
            </div>
            {passwordErrors.newPassword && (
              <div className={styles['user-profile__error']}>{passwordErrors.newPassword}</div>
            )}
          </div>

          <div className={styles['user-profile__form-group']}>
            <label htmlFor='confirmPassword' className={styles['user-profile__label']}>
              Confirm new password:
            </label>
            <div className={styles['user-profile__password-input']}>
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                id='confirmPassword'
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                required
                minLength='6'
                className={styles['user-profile__input']}
              />
              <button
                type='button'
                className={styles['user-profile__password-toggle']}
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? (
                  <FontAwesomeIcon icon={faEyeSlash} />
                ) : (
                  <FontAwesomeIcon icon={faEye} />
                )}
              </button>
            </div>
            {passwordErrors.confirmPassword && (
              <div className={styles['user-profile__error']}>{passwordErrors.confirmPassword}</div>
            )}
          </div>

          <button
            type='submit'
            disabled={updatePasswordMutation.isPending || isLoadingUser}
            className={`button-primary ${styles['user-profile__button']}`}
          >
            {updatePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>

      {message && <div className={styles['user-profile__message']}>{message}</div>}
      {errorMessage && <div className={styles['user-profile__error']}>{errorMessage}</div>}
    </div>
  );
}

export default UserProfile;
