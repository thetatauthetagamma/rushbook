import React from 'react'
import Image from 'next/image'

interface RusheeTileProps {
    Rushee_Uniquename: string;
    Rushee_Name: string;
    Bio: string;
    Likes: string[];
    Comments: string[];
    imageUrl: string;
  }

  const RusheeTile: React.FC<RusheeTileProps> = ({
    Rushee_Uniquename,
    Rushee_Name,
    Bio,
    Likes,
    Comments,
    imageUrl,
    }) => {

    return (
        <div className = 'flex flex-col sm:w-80 md:w-96 lg:w-96 max-w-xl mx-auto overflow-hidden bg-gradient-to-r from-slate-950 via-blue-800 to-blue-500 rounded-lg shadow-md hover:scale-105 hover:shadow-2xl'>
            <Image src={imageUrl} alt='rushee' layout='fill' objectFit='cover' className="rounded-lg w-full"></Image>
            <h1>{Rushee_Name}</h1>
            <h2>{Bio}</h2>
            <h3>{Likes}</h3>
            <h4>{Comments}</h4>
        </div>
    );
};

export default RusheeTile;

