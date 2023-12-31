import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../supabase';

export default function CreateRushbook({ currentEmail}) {
  const [rushbookName, setRushbookName] = useState('');
  const [rushbookImagePrev, setRushbookImagePrev] = useState(null);
  const [rushbookImage, setRushbookImage] = useState(null);
  const [rushbookPassword, setRushbookPassword] = useState('');
  const [nameError, setNameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const handleNameChange = (e) => {
    setRushbookName(e.target.value);
    setNameError(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type === 'image/jpeg') {
      const image = URL.createObjectURL(file);
      setRushbookImage(file);
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setRushbookImagePrev(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      setRushbookImagePrev(null);
    }
  };

  const handlePasswordChange = (e) => {
    setRushbookPassword(e.target.value);
    setPasswordError(null);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resetFormState = () => {
      setRushbookName('');
      setRushbookImage(null);
      setRushbookPassword('');
      setPasswordError(null);
      setNameError(null);
      setConfirmPasswordError('');
      setConfirmPassword('');
      setRushbookImagePrev(null);
    };

    // Check if Rushbook name is taken
    const { data, error: nameCheckError } = await supabase
      .from('Rushbooks')
      .select('name')
      .eq('name', rushbookName)
      .single();

    if (nameCheckError) {
      console.log('Rushbook doesn\'t exist');
    }

    if (data) {
      setNameError('Rushbook name is already taken');
      return;
    }

    // Validate password length
    if (rushbookPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    // Check if passwords match
    if (rushbookPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }

    // Insert Rushbook entry into the "Rushbooks" table
    const { error: insertError } = await supabase
      .from('Rushbooks')
      .insert({ name: rushbookName, password: rushbookPassword });

    if (insertError) {
      console.log('Error creating Rushbook entry');
      console.log(insertError);
      setErrorMessage('Error creating Rushbook');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      resetFormState();
      return;
    }

    const storageRushbookName = rushbookName.replace(/\s+/g, '');

    // Insert image into the "Rushbooks" storage bucket
    const { error: storageError } = await supabase.storage
      .from('Rushbooks')
      .upload(`${storageRushbookName}.jpeg`, rushbookImage, {
        cacheControl: '3600',
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (storageError) {
      console.log('Error uploading Rushbook image');
      console.log(storageError);
      setErrorMessage('Error uploading Rushbook image');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      resetFormState();
      return;
    }


    // Fetch the user data to get the current my_books array
    const { data: userData, error: userError } = await supabase
      .from('Users')
      .select('my_books')
      .eq('email', currentEmail)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      setErrorMessage('Error fetching user data');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      resetFormState();
      return;
    }

    // Add the Rushbook to the user's "my_books" array with the role "Admin"
    const { error: userUpdateError } = await supabase
      .from('Users')
      .update({
        my_books: [...(userData.my_books || []), { name: rushbookName, role: 'Admin' }],
      })
      .eq('email', currentEmail);

    if (userUpdateError) {
      console.error('Error updating user data:', userUpdateError);
      setErrorMessage('Error updating user data');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      resetFormState();
      return;
    }

    setSuccessMessage('Rushbook created successfully!');
    setTimeout(() => {
      setSuccessMessage('');
      router.reload();
    }, 2000);
    router.push( '/myRushbooks');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Rushbook Name:</label>
          <input
            type="text"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              nameError ? 'border-red-500' : ''
            }`}
            value={rushbookName}
            onChange={handleNameChange}
          />
          {nameError && <p className="text-red-500 text-xs italic">{nameError}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Rushbook Image:</label>
          <input
            type="file"
            accept="image/jpeg"
            onChange={handleImageChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {rushbookImagePrev && (
            <img src={rushbookImagePrev} alt="Rushbook Preview" className="mt-2 max-w-full h-auto" />
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Rushbook Password:</label>
          <input
            type="password"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              passwordError ? 'border-red-500' : ''
            }`}
            value={rushbookPassword}
            onChange={handlePasswordChange}
          />
          {passwordError && <p className="text-red-500 text-xs italic">{passwordError}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password:</label>
          <input
            type="password"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              confirmPasswordError ? 'border-red-500' : ''
            }`}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          {confirmPasswordError && (
            <p className="text-red-500 text-xs italic">{confirmPasswordError}</p>
          )}
        </div>
        <div className="mb-4">
          <button
            type="submit"
            className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Rushbook
          </button>
        </div>
        {successMessage && (
          <p className="text-green-500 text-xs italic">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="text-red-500 text-xs italic">{errorMessage}</p>
        )}
      </form>
    </div>
  );
}
