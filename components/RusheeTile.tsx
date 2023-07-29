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
}

const RusheeTile: React.FC<RusheeTileProps> = ({
    Rushee_Uniquename,
    Rushee_Name,
    Bio,
    Likes,
    Comments,
    Dislikes,
    imageUrl,
    Big
    }) => {

    const [alreadyLiked, setAlreadyLiked] = useState(false);
    const [alreadyDisliked, setAlreadyDisliked] = useState(false);
    const [likesCount, setLikes] = useState(Likes ? Likes.length : 0);
    const [dislikesCount, setDislikes] = useState(Dislikes ? Dislikes.length : 0);

    useEffect(() => {

        const checkLikedStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            console.log(user);
            
            if (user) {
                const { data, error } = await supabase
                .from('book')
                .select('Likes')
                .eq('Rushee_Uniquename', Rushee_Uniquename);

                if (error) {
                    console.log(error);
                } else {
                    console.log(data);
                    const likesArray = data[0]?.Likes || [];
                    if (likesArray.includes(user.email)) {
                        setAlreadyLiked(true);
                    }
                }
            }
        };

        const checkDisLikedStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            console.log(user);
            
            if (user) {
                const { data, error } = await supabase
                .from('book')
                .select('Dislikes')
                .eq('Rushee_Uniquename', Rushee_Uniquename);

                if (error) {
                    console.log(error);
                } else {
                    console.log(data);
                    const DislikesArray = data[0]?.Dislikes || [];
                    if (DislikesArray.includes(user.email)) {
                        setAlreadyDisliked(true);
                    }
                }
            }
        };

        checkLikedStatus();
        checkDisLikedStatus();
    }, []);


    
    const handleLike = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        console.log(user);
      
        if (user) {
          const { data, error } = await supabase
            .from('book')
            .select('Likes')
            .eq('Rushee_Uniquename', Rushee_Uniquename);
      
          if (error) {
            console.log(error);
          } else {
            console.log(data);
            const likesArray = data[0]?.Likes || [];
            const updatedLikes = [...likesArray, user.email];
      
            const { error: updateError } = await supabase
              .from('book')
              .update({ Likes: updatedLikes })
              .eq('Rushee_Uniquename', Rushee_Uniquename);
      
            if (updateError) {
              console.log(updateError);
            } else {
              // After successful update, set the state to reflect that the user has already liked
              setAlreadyLiked(true);
              setLikes(updatedLikes.length);
            }
          }
        }
      };

    const handleRemoveLike = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        console.log(user);
      
        if (user) {
          const { data, error } = await supabase
            .from('book')
            .select('Likes')
            .eq('Rushee_Uniquename', Rushee_Uniquename);
      
          if (error) {
            console.log(error);
          } else {
            console.log(data);
            const likesArray = data[0]?.Likes || [];
      
            // Remove the user's email from the Likes array
            const updatedLikes = likesArray.filter((email: string | undefined) => email !== user.email);
      
            const { error: updateError } = await supabase
              .from('book')
              .update({ Likes: updatedLikes })
              .eq('Rushee_Uniquename', Rushee_Uniquename);
      
            if (updateError) {
              console.log(updateError);
            } else {
              // After successful update, set the state or perform any other necessary actions
              console.log('Like removed successfully!');
              setAlreadyLiked(false); // Set the state to reflect that the user has not liked
              setLikes(updatedLikes.length);
            }
          }
        }
      };
      
      

    const handleDislike = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        console.log(user);
      
        if (user) {
          const { data, error } = await supabase
            .from('book')
            .select('Dislikes')
            .eq('Rushee_Uniquename', Rushee_Uniquename);
      
          if (error) {
            console.log(error);
          } else {
            console.log(data);
            const DislikesArray = data[0]?.Dislikes || [];
            const updatedDislikes = [...DislikesArray, user.email];
      
            const { error: updateError } = await supabase
              .from('book')
              .update({ Dislikes: updatedDislikes })
              .eq('Rushee_Uniquename', Rushee_Uniquename);
      
            if (updateError) {
              console.log(updateError);
            } else {
              // After successful update, set the state to reflect that the user has already disliked
              setAlreadyDisliked(true);
              setDislikes(updatedDislikes.length);
            }
          }
        }
      };

    const handleRemoveDislike = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        console.log(user);
      
        if (user) {
          const { data, error } = await supabase
            .from('book')
            .select('Dislikes')
            .eq('Rushee_Uniquename', Rushee_Uniquename);
      
          if (error) {
            console.log(error);
          } else {
            console.log(data);
            const DislikesArray = data[0]?.Dislikes || [];
            
            // Remove the user's email from the Dislikes array
            const updatedDislikes = DislikesArray.filter((email: string | undefined) => email !== user.email);
      
            const { error: updateError } = await supabase
              .from('book')
              .update({ Dislikes: updatedDislikes })
              .eq('Rushee_Uniquename', Rushee_Uniquename);
      
            if (updateError) {
              console.log(updateError);
            } else {
              // After successful update, set the state or perform any other necessary actions
              console.log('Dislike removed successfully!');
              setAlreadyDisliked(false); // Set the state to reflect that the user has not disliked
              setDislikes(updatedDislikes.length);
            }
          }
        }
      };

    const handleSeeMore = () => {
        Router.push(`/rushee/${Rushee_Uniquename}`);
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
                        <h3 className='p-2'> Likes: {likesCount} </h3> 
                        {
                            !alreadyLiked ? 
                            ( 
                              <a onClick={handleLike}>
                                <Image src={like} className='hover:scale-105'></Image>
                              </a>  
                            )
                            :
                            (
                              <a onClick={handleRemoveLike}>
                                <Image src={liked} className='hover:scale-105'></Image>
                              </a>  
                            )
                        }
                    </div>
                    <div className='flex items-center px-4'>   
                        <h3 className='p-2'> Dislikes: {dislikesCount} </h3>
                        {
                            !alreadyDisliked ? 
                            ( 
                              <a onClick={handleDislike}>
                                <Image src={dislike} className='hover:scale-105'></Image>
                              </a>  
                            )
                            :
                            (
                              <a onClick={handleRemoveDislike}>
                                <Image src={disliked} className='hover:scale-105'></Image>
                              </a>  
                            )
                        }
                    </div>
                </div>
                <h4 className='p-2'> Comments: {Comments}</h4>
            </div>
        </div>
    );
};

export default RusheeTile;

