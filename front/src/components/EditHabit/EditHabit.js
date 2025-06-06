import React, { useState } from 'react';
import styles from './EditHabit.module.css';
import { useHabit } from '../../hooks/useHabit';
import { useUpdateHabit } from '../../hooks/useUpdateHabit';
import { useHabitStore, useUserStore } from '../../store';
import axios from '../../axios.js';
import { useMutation } from '@tanstack/react-query';
import * as dateFnsTz from 'date-fns-tz';
import classNames from 'classnames';
import FrequencyPicker from '../FrequencyPicker/FrequencyPicker.js';

function EditHabit({ _id = '' }) {
  const updateHabitMutation = useUpdateHabit(_id);

  const data = useHabit(_id);
  const [habit, isLoading] = data;

  const initialHabit = useHabitStore((state) => state.initialHabit);
  const editingHabit = useHabitStore((state) => state.editingHabit);
  const userId = useUserStore((state) => state.currentUserId);

  const hideEditHabit = useHabitStore((state) => state.hideEditHabit);
  const setEditingHabit = useHabitStore((state) => state.hideEditHabit);

  // initial values
  const [title, setTitle] = useState(habit?.title || initialHabit.title);
  const [repeat, setRepeat] = useState(habit?.repeat || initialHabit.repeat);
  const [progress, setProgress] = useState(habit?.progress || initialHabit.progress);
  const [isDone, setIsDone] = useState(habit?.isDone || initialHabit.isDone);

  const [amount, setAmount] = useState(habit?.goal?.amount || initialHabit.goal.amount);
  const [unit, setUnit] = useState(habit?.goal?.unit || initialHabit.goal.unit);
  const [frequency, setFrequency] = useState(habit?.goal?.frequency || initialHabit.goal.frequency);

  const createdDate =
    habit?.createdDate ||
    dateFnsTz.format(new Date(), 'dd-MM-yyyy HH:mm', {
      timeZone: 'Europe/Warsaw',
    });

  const mutation = useMutation({
    mutationFn: async (newHabit) => {
      return await axios.post(`/users/${userId}/habits`, newHabit);
    },
    onSuccess: (data) => {
      setEditingHabit(data._id, 'add');
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  const handleEditSubmit = () => {
    updateHabitMutation.mutate({
      title: title,
      repeat: repeat,
      isDone: progress < amount ? false : true,
      goal: {
        amount: amount,
        unit: unit,
        frequency: frequency,
      },
      progress: progress,
      createdDate: createdDate,
    });
  };

  const handleAddSubmit = async () => {
    const newHabit = {
      title: title,
      repeat: repeat,
      isDone: isDone,
      goal: {
        amount: amount,
        unit: unit,
        frequency: frequency,
      },
      progress: progress,
      createdDate: createdDate,
    };
    mutation.mutate(newHabit);
  };

  return (
    <>
      {isLoading && 'Loading...'}
      {habit && (
        <form
          className={styles.editHabit}
          onSubmit={editingHabit.mode === 'edit' ? handleEditSubmit : handleAddSubmit}
        >
          <div className={styles.editHabit__top}>
            <h2 className={styles.editHabit_header}>
              {editingHabit.mode === 'edit' ? 'Edit habit' : 'Add new habit'}
            </h2>
          </div>

          <div className={styles.editHabit__middle}>
            <div className={classNames(styles.editHabit__field)}>
              <label>Title</label>
              <input
                id='input_title'
                className={styles.editHabit__input}
                type='text'
                name='title'
                minLength='1'
                maxLength='50'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className={classNames(styles.editHabit__field)}>
              <label>Goal</label>
              <div className={styles.editHabit__goal}>
                <input
                  id='input_amount'
                  type='number'
                  name='amount'
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min='1'
                  max='1000'
                />

                <select
                  id='select_unit'
                  name='unit'
                  onChange={(e) => setUnit(e.target.value)}
                  value={unit}
                >
                  <option value='razy'>Times</option>
                  <option value='min'>Min</option>
                </select>
                <p>per</p>
                <select
                  id='select_frequency'
                  name='frequency'
                  onChange={(e) => setFrequency(e.target.value)}
                  value={frequency}
                >
                  <option value='day'>Day</option>
                  <option value='week'>Week</option>
                  <option value='month'>Month</option>
                </select>
              </div>
            </div>

            <div className={classNames(styles.editHabit__field)}>
              <label>Repeat pattern</label>
              <FrequencyPicker
                goalRuleString={repeat}
                onChange={(newRuleString) => setRepeat(newRuleString)}
              />
            </div>

            {editingHabit.mode === 'edit' && (
              <div className={styles.editHabit__field}>
                <label>Progress</label>
                <span>
                  <input
                    type='number'
                    name='progress'
                    value={progress}
                    onChange={(e) => setProgress(e.target.value)}
                    min='0'
                    max='1000'
                  ></input>{' '}
                  &nbsp;/&nbsp; {amount}
                </span>
              </div>
            )}
          </div>

          <div className={styles.editHabit__bottom}>
            <button type='button' className='button-secondary' onClick={() => hideEditHabit()}>
              Cancel
            </button>
            <button type='submit' className='button-primary'>
              Save
            </button>
          </div>
        </form>
      )}
    </>
  );
}

export default EditHabit;
