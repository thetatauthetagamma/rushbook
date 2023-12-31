import React, { useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../supabase.js';

export default function CreateAccount() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleInitial, setMiddleInitial] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Get email from query parameter
  const { email } = router.query;

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleMiddleInitialChange = (e) => {
    setMiddleInitial(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Assuming you have a "Users" table in your Supabase database
      const { error } = await supabase.from('Users').insert([
        {
          email: email,
          firstname: firstName,
          lastname: lastName,
          middle_initial: middleInitial,
        },
      ]);

      if (error) {
        setError('Error creating user account');
      } else {
        setSuccess(true);
        // Redirect to myRushbooks page after a successful form submission
        setTimeout(() => {
          window.location.reload(); // Force a complete page reload
        }, 2000);

        router.push('/myRushbooks');

      }
    } catch (error) {
      setError('Error creating user account');
    }
  };

  return (
    <div className='max-w-lg w-full mx-auto mt-10 p-6 bg-white rounded-md shadow-md'>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>First Name:</label>
          <input
            type='text'
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            value={firstName}
            placeholder='John'
            onChange={handleFirstNameChange}
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>Middle Initial (if none Leave Blank):</label>
          <input
            type='text'
            maxLength='1'
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            value={middleInitial}
            placeholder='J'
            onChange={handleMiddleInitialChange}
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>Last Name:</label>
          <input
            type='text'
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            value={lastName}
            placeholder='Doe'
            onChange={handleLastNameChange}
          />
        </div>
        <div className='mb-4'>
          <button
            type='submit'
            className='bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          >
            Create Account
          </button>
        </div>

        {error && <p className='text-red-500 text-xs italic'>{error}</p>}
        {success && <p className='text-green-500 text-xs italic'>Account created successfully!</p>}
      </form>
    </div>
  );
}
