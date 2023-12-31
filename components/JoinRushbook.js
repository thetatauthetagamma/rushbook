import React, { useState, useEffect } from 'react';
import supabase from '../supabase';
import { useRouter } from 'next/router';

export default function JoinRushbook({ currentEmail }) {
  const router = useRouter();
  const [rushbookName, setRushbookName] = useState('');
  const [rushbookPassword, setRushbookPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleNameChange = (e) => {
    setRushbookName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setRushbookPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Fetch the current user data
      const { data: userData, error: userError } = await supabase
        .from('Users')
        .select('my_books')
        .eq('email', currentEmail)
        .single();

        console.log(userData)

      if (userError) {
        console.error('Error fetching user data:', userError);
        setMessage('Error joining Rushbook');
        return;
      }

      // Check if the Rushbook already exists in the user's array
      if (userData.my_books && userData.my_books.some((book) => book.name === rushbookName)) {
        setMessage('Error rushbook already joined');
        return;
      }

      // Check if the Rushbook exists
      const { data: rushbookData, error: rushbookError } = await supabase
        .from('Rushbooks')
        .select('name, password')
        .eq('name', rushbookName)
        .single();

      if (rushbookError) {
        console.error('Error checking for existing Rushbook:', rushbookError);
        setMessage('Error joining Rushbook');
        return;
      }

      if (!rushbookData) {
        setMessage('Rushbook not found');
        return;
      }

      // Check if the password matches
      if (rushbookData.password !== rushbookPassword) {
        setMessage('Wrong password');
        return;
      }

      // Update the user's data by adding the Rushbook to the "my_books" array
      const updatedMyBooks = [
        ...(userData.my_books || []),
        { name: rushbookName, role: 'Member' },
      ];

      console.log(updatedMyBooks);

      const { error: updateError } = await supabase
        .from('Users')
        .update({ my_books: updatedMyBooks })
        .eq('email', currentEmail);

      if (updateError) {
        console.error('Error updating user data:', updateError);
        setMessage('Error joining Rushbook');
        return;
      }

      setMessage(`Successfully joined Rushbook: ${rushbookName}`);

      setTimeout(() => {
        router.push('/myRushbooks')
      }, 1000);
    } catch (error) {
      console.error('Error joining Rushbook:', error);
      setMessage('Error joining Rushbook');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Rushbook Name:</label>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={rushbookName}
            onChange={handleNameChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Rushbook Password:</label>
          <input
            type="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={rushbookPassword}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div className="mb-4">
          <button
            type="submit"
            className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Join Rushbook
          </button>
        </div>
        {message && (
          <p className={`${message.includes('Error') ? 'text-red-500' : 'text-green-500'} text-xs italic`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
