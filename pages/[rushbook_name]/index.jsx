import React, { useEffect, useState } from 'react';
import supabase from '../../supabase';
import RusheeTile from '../../components/RusheeTile';
import Cookies from 'js-cookie';

export default function RushbookPage() {
  const [rushbookName, setRushbookName] = useState('');
  const [rusheesData, setRusheesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [imagesRequested, setImagesRequested] = useState(false);

  useEffect(() => {
    // Retrieve rushbook name from the cookie
    const rushbookNameFromCookie = Cookies.get('currentRushbook');

    if (rushbookNameFromCookie) {
      setRushbookName(rushbookNameFromCookie);

      const fetchData = async () => {
        try {
          const { data, error } = await supabase
            .from('Rushbooks')
            .select('rushees')
            .eq('name', rushbookNameFromCookie);

          if (error) {
            throw error;
          }

          setRusheesData(data[0]?.rushees || []);
        } catch (error) {
          console.error('Error fetching rushees data:', error);
        }
      };

      fetchData();
    }
  }, []);

  useEffect(() => {
    const fetchRusheeImages = async () => {
      try {
        const updatedRusheesData = await Promise.all(
          rusheesData.map(async (rushee) => {
            if (!rushee.email || rushee.imageUrl) {
              return rushee;
            } else {
              try {
                const { data: image, error } = await supabase.storage
                  .from('Rushees')
                  .download(`${rushee.email}.jpeg`);
  
                const imageUrl = URL.createObjectURL(image);
                return { ...rushee, imageUrl };
              } catch (downloadError) {
                console.error(`Error downloading image for rushee (${rushee.email}):`, downloadError);
                return rushee;
              }
            }
          })
        );
  
        setRusheesData(updatedRusheesData);
      } catch (error) {
        console.error('Error fetching rushee images:', error);
      }
    };
  
    // Fetch images only if there are rushees and they don't have images
    if (rusheesData.length > 0 && !imagesRequested) {
      fetchRusheeImages();
      setImagesRequested(true);
    }
  }, [rusheesData]);

  // Filter rushees by name based on the search term
  const filteredRushees = rusheesData.filter((rushee) => {
    const fullName = `${rushee.Firstname} ${rushee.Lastname}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Sort rushees by the number of likes minus dislikes
  const sortedRushees = filteredRushees.sort((a, b) => (b.Likes.length - b.Dislikes.length) - (a.Likes.length - a.Dislikes.length));

  return (
    <div className="p-4">
      <h1 className="text-6xl font-bold text-gray-800 text-center mb-6">{rushbookName}</h1>
      <div className="flex items-center justify-center mb-4">
        <input
          type="text"
          placeholder="Search by name"
          className="p-2 border border-gray-800 rounded-md w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedRushees.map((rushee) => (
          <RusheeTile
            key={rushee.email}
            RusheeEmail={rushee.email}
            Rushee_Name={`${rushee.Firstname} ${rushee.Lastname}`}
            Rushbook_Name={rushbookName}
            Bio={rushee.Bio}
            Likes={rushee.Likes}
            Comments={rushee.Comments}
            Dislikes={rushee.Dislikes}
            imageUrl={rushee.imageUrl}
            Major={rushee.Major}
            Year={rushee.Year}
            Pronouns={rushee.Pronouns}
            Big={false}
            alreadyLiked={rushee.alreadyLiked}
            alreadyDisliked={rushee.alreadyDisliked}
          />
        ))}
      </div>
    </div>
  );
}
