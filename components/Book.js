import React, { useState, useEffect } from 'react';
import supabase from '../supabase';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Book({ name }) {
    const router = useRouter();
  const [bookImage, setBookImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookImage = async () => {
      try {
        const imageName = name.replace(/\s+/g, '');

        // Fetch the book image from the Supabase storage bucket
        const { data, error } = await supabase.storage
          .from('Rushbooks')
          .download(`${imageName}.jpeg`); // Adjust the file extension based on your image format

        if (error) {
          console.error('Error fetching book image:', error);
        } else {
          const imageUrl = URL.createObjectURL(data);
          setBookImage(imageUrl);
        }
      } catch (error) {
        console.error('Error fetching book image:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookImage();
  }, [name]);

  function handleClick(){
    router.push(`/rushbook/${name}`);
  }

  return (
    <div className="bg-white shadow-md p-4 rounded-md mb-4">
      {loading ? (
        <p className="text-gray-600">Loading book...</p>
      ) : (
        <div onClick={handleClick} className='flex flex-col items-center hover:scale-105'>
          <h3 className="text-4xl font-semibold mb-2">{name}</h3>
          {bookImage && (
            <Image
              src={bookImage}
              alt={`${name} cover`}
              width={500}
              height={500}
              className="rounded-md"
            />
          )}
        </div>
      )}
    </div>
  );
}

