import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBatteryEmpty,
  faBatteryQuarter,
  faBatteryHalf,
  faBatteryThreeQuarters,
  faBatteryFull,
  faCheckCircle,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import styles from './EnergyLevelModal.module.css';
import { useSaveEnergyLevel } from '../../hooks/user/useSaveEnergyLevel.js';

const EnergyLevelModal = ({ isOpen, onClose, totalHabits }) => {
  const [energyLevel, setEnergyLevel] = useState(5);
  const maxHabits = Math.max(totalHabits || 1, 1);
  const saveEnergyLevelMutation = useSaveEnergyLevel();

  // Calculate suggested habits based on energy level
  const getSuggestedHabits = () => {
    let suggested;
    if (energyLevel <= 3) {
      suggested = Math.max(1, Math.floor(maxHabits * 0.2));
    } else if (energyLevel <= 5) {
      suggested = Math.max(1, Math.floor(maxHabits * 0.4));
    } else if (energyLevel <= 7) {
      suggested = Math.max(1, Math.floor(maxHabits * 0.6));
    } else {
      suggested = Math.max(1, Math.floor(maxHabits * 0.8));
    }
    // Don't suggest more than available habits
    return Math.min(suggested, maxHabits);
  };

  const suggestedHabits = getSuggestedHabits();

  // Get energy level icon
  const getEnergyIcon = () => {
    if (energyLevel <= 2) return faBatteryEmpty;
    if (energyLevel <= 4) return faBatteryQuarter;
    if (energyLevel <= 6) return faBatteryHalf;
    if (energyLevel <= 8) return faBatteryThreeQuarters;
    return faBatteryFull;
  };

  // Get motivational message based on energy level
  const getMotivationalMessage = () => {
    if (energyLevel <= 3) {
      return {
        title: "It's okay to have a gentler day",
        message: `You're showing up, and that's what matters. Choose ${suggestedHabits} habit${
          suggestedHabits !== 1 ? 's' : ''
        } that feel manageable today. Every small step counts, and you're doing great just by being here.`,
        color: '#6B8E9F',
      };
    } else if (energyLevel <= 5) {
      return {
        title: "You've got this!",
        message: `You're in a good space today. Consider focusing on ${suggestedHabits} habit${
          suggestedHabits !== 1 ? 's' : ''
        } that will help you feel accomplished. Remember, progress over perfection!`,
        color: '#8B9DC3',
      };
    } else if (energyLevel <= 7) {
      return {
        title: "You're feeling strong!",
        message: `Your energy is flowing today! You might want to tackle ${suggestedHabits} habit${
          suggestedHabits !== 1 ? 's' : ''
        }. Trust yourself and celebrate each win, no matter how small.`,
        color: '#FFB347',
      };
    } else {
      return {
        title: "You're absolutely shining! ",
        message: `Wow, you're bringing amazing energy today! Consider taking on ${suggestedHabits} habit${
          suggestedHabits !== 1 ? 's' : ''
        }. You've got the power to make today incredible - let's do this!`,
        color: '#FF6B6B',
      };
    }
  };

  const motivation = getMotivationalMessage();

  const handleConfirm = () => {
    // Save energy level to backend
    saveEnergyLevelMutation.mutate(energyLevel, {
      onSuccess: () => {
        // Also save to localStorage for backward compatibility
        localStorage.setItem('todayEnergyLevel', energyLevel.toString());
        localStorage.setItem('todaySuggestedHabits', suggestedHabits.toString());
        onClose();
      },
      onError: (error) => {
        console.error('Error saving energy level:', error);
      },
    });
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
      ariaHideApp={false}
      closeTimeoutMS={200}
    >
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose} aria-label='Close'>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2 className={styles.title}>{motivation.title}</h2>

        <div className={styles.energySection}>
          <label className={styles.energyLabel}>
            How's your energy today?
            <FontAwesomeIcon icon={getEnergyIcon()} className={styles.batteryIcon} />
          </label>
          <div className={styles.sliderContainer}>
            <input
              type='range'
              min='1'
              max='10'
              value={energyLevel}
              onChange={(e) => setEnergyLevel(Number(e.target.value))}
              className={styles.slider}
            />
            <div className={styles.sliderLabels}>
              <span>Low</span>
              <span>High</span>
            </div>
            <div className={styles.energyValue}>
              <span className={styles.energyNumber}>{energyLevel}</span>
              <span className={styles.energyText}>/ 10</span>
            </div>
          </div>
        </div>

        <div className={styles.messageSection}>
          <p className={styles.message}>{motivation.message}</p>
          <div className={styles.suggestionBox}>
            <FontAwesomeIcon icon={faCheckCircle} className={styles.checkIcon} />
            <span className={styles.suggestionText}>
              Suggested focus:{' '}
              <strong>
                {suggestedHabits} habit{suggestedHabits !== 1 ? 's' : ''}
              </strong>{' '}
              today
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            onClick={handleConfirm}
            className='button-primary'
            disabled={saveEnergyLevelMutation.isPending}
          >
            {saveEnergyLevelMutation.isPending ? 'Saving...' : "Let's do this!"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EnergyLevelModal;
