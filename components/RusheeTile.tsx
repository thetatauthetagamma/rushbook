import React, { useEffect , useState} from 'react'
import Image from "next/legacy/image"
import thtlogo from '../public/tht-logo.png'
import like from '../public/like.svg'
import liked from '../public/liked.svg'
import dislike from '../public/dislike.svg'
import disliked from '../public/disliked.svg'
import supabase from '@/supabase'
import Router from 'next/router'


interface RusheeTileProps {
    Rushee_Uniquename: string;
    Rushee_Name: string;
    Bio: string;
    Likes?: string[];
    Comments?: string[];
    Dislikes?: string[];
    imageUrl?: string;
    Big: boolean;
    alreadyLiked?: boolean;
    alreadyDisliked?: boolean;
    userEmail: string;
    onLike?: () => void;
    onDislike?: () => void;
    onRemoveLike?: () => void;
    onRemoveDislike?: () => void;
}

const RusheeTile: React.FC<RusheeTileProps> = ({
    Rushee_Uniquename,
    Rushee_Name,
    Bio,
    Likes,
    Comments,
    Dislikes,
    imageUrl,
    Big,
    alreadyLiked,
    alreadyDisliked,
    userEmail,
    onLike,
    onDislike,
    onRemoveLike,
    onRemoveDislike
    }) => {

    const handleSeeMore = () => {
      if(!Big){
        Router.push(`/rushee/${Rushee_Uniquename}`);
      }
    };

    return (
        <div onClick={handleSeeMore} className = {`flex flex-col ${Big ? 'w-5/12' : 'w-80 sm:w-80 md:w-96 lg:w-96 max-w-xl'} mx-auto overflow-hidden bg-gradient-to-r from-amber-400 via-orange-800 to-red-950 rounded-lg shadow-md ${Big ? '' : 'transform transition-all hover:scale-105 ease-in duration-200 hover:shadow-2xl'}`}>
            <div className="relative h-64 w-full">
                {imageUrl ? 
                (
                    <Image src={imageUrl} alt="Rushee" layout='fill' objectFit="cover" className="rounded-lg w-full" />
                )
                :
                (
                    <Image src={thtlogo} alt="Rushee" layout='fill' objectFit="cover" className="rounded-lg w-full" />
                )
                }
            </div>
            <div className='flex flex-col items-center text-white'>
                <h1 className='flex p-2 font-bold text-xl'>{Rushee_Name}</h1>
                <hr className='w-full border-white mb-4' />
                <h3 className={`text-center ${Big ? '' : 'line-clamp-2 truncate'} whitespace-normal px-2`}>
                  {Bio}
                </h3>
                <div className='flex items-center p-2'>
                    <div className='flex items-center px-4'>
                        <h3 className='p-2'> Likes: {Likes?.length} </h3> 
                        {
                            Big && (!alreadyLiked ? 
                            ( 
                              <a onClick={onLike}>
                                <Image src={like} className='hover:scale-105'></Image>
                              </a>  
                            )
                            :
                            (
                              <a onClick={onRemoveLike}>
                                <Image src={liked} className='hover:scale-105'></Image>
                              </a>  
                            ))
                        }
                    </div>
                    <div className='flex items-center px-4'>   
                        <h3 className='p-2'> Dislikes: {Dislikes?.length} </h3>
                        { 
                            Big && (!alreadyDisliked ? 
                            ( 
                              <a onClick={onDislike}>
                                <Image src={dislike} className='hover:scale-105'></Image>
                              </a>  
                            )
                            :
                            (
                              <a onClick={onRemoveDislike}>
                                <Image src={disliked} className='hover:scale-105'></Image>
                              </a>  
                            ))
                        }
                    </div>
                </div>
                <h4 className='p-2'> Comments: {Comments}</h4>
            </div>
        </div>
    );
};

export default RusheeTile;

