import React, { useEffect, useState } from 'react';
import supabase from '../supabase';
import Book from './Book';

const MyRushbooks = ({ currentEmail }) => {
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserBooks = async () => {
      try {
        // Fetch the user data including the "my_books" array
        const { data, error } = await supabase
          .from('Users')
          .select('my_books')
          .eq('email', currentEmail)
          .single();

        console.log(data);

        if (error) {
          console.error('Error fetching user data:', error);
        } else {
          setMyBooks(data.my_books || []);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBooks();
  }, [currentEmail]);

  return (
    <div className="p-4 bg-gray-100 h-full">
      <h1 className="text-6xl lg:text-8xl font-bold text-gray-800 py-2 text-center">My Rushbooks</h1>
      {loading ? (
        <p className="text-lg text-gray-600 text-center">Loading...</p>
      ) : myBooks.length === 0 ? (
        <p className="text-lg text-gray-600">No rushbooks found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {myBooks.map((book, index) => (
            <Book key={index} name={book.name} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRushbooks;
