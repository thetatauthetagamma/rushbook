import React from 'react'
import Image from "next/legacy/image"
import thtlogo from '../public/tht-logo.png'


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
        <div className = 'flex flex-col sm:w-80 md:w-96 lg:w-96 max-w-xl mx-auto overflow-hidden bg-gradient-to-r from-amber-400 via-orange-800 to-red-950 rounded-lg shadow-md transform transition-all hover:scale-105 ease-in duration-200 hover:shadow-2xl'>
            <div className="relative h-64 w-full">
                {imageUrl ? 
                (
                    <Image src={imageUrl} alt="Bar" layout='fill' objectFit="cover" className="rounded-lg w-full" />
                )
                :
                (
                    <Image src={thtlogo} alt="Bar" layout='fill' objectFit="cover" className="rounded-lg w-full" />
                )
                }
            </div>
            <div className='flex flex-col items-center text-white'>
                <h1 className='p-2'>{Rushee_Name}</h1>
                <h2 className='p-2'> Bio: {Bio}</h2>
                <div className='flex items-center p-2'>
                    <h3 className='p-2'> Likes: {Likes.length}</h3>
                    <h4 className='p-2'> Comments: {Comments}</h4>
                </div>
            </div>
        </div>
    );
};

export default RusheeTile;

