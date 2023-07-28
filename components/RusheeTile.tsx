import React, { useEffect , useState} from 'react'
import Image from "next/legacy/image"
import thtlogo from '../public/tht-logo.png'
import like from '../public/like.svg'
import dislike from '../public/dislike.svg'
import supabase from '@/supabase'


interface RusheeTileProps {
    Rushee_Uniquename: string;
    Rushee_Name: string;
    Bio: string;
    Likes?: string[];
    Comments?: string[];
    Dislikes?: string[];
    imageUrl: string;
}

const RusheeTile: React.FC<RusheeTileProps> = ({
    Rushee_Uniquename,
    Rushee_Name,
    Bio,
    Likes,
    Comments,
    Dislikes,
    imageUrl,
    }) => {

    const [alreadyLiked, setAlreadyLiked] = useState(false);
    const [alreadyDisliked, setAlreadyDisliked] = useState(false);

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
                    Likes = likesArray;
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
                    Dislikes = DislikesArray;
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
            }
          }
        }
      };

    return (
        <div className = 'flex flex-col sm:w-80 md:w-96 lg:w-96 max-w-xl mx-auto overflow-hidden bg-gradient-to-r from-amber-400 via-orange-800 to-red-950 rounded-lg shadow-md transform transition-all hover:scale-105 ease-in duration-200 hover:shadow-2xl'>
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
                <h1 className='p-2'>{Rushee_Name}</h1>
                <h2 className='p-2'> Bio: {Bio}</h2>
                <div className='flex items-center p-2'>
                    <div className='flex items-center px-4'>
                        <h3 className='p-2'> Likes: {Likes ? Likes.length : 0}</h3> 
                        {
                            !alreadyLiked && 
                            <a onClick={handleLike}>
                            <Image src={like} className='hover:scale-105'></Image>
                            </a>
                        }
                    </div>
                    <div className='flex items-center px-4'>   
                        <h3 className='p-2'> Dislikes: {Dislikes ? Dislikes.length : 0}</h3>
                        {
                            !alreadyDisliked && 
                            <a onClick={handleDislike}>
                            <Image src={dislike} className='hover:scale-105'></Image>
                            </a>
                        }
                    </div>
                </div>
                <h4 className='p-2'> Comments: {Comments}</h4>
            </div>
        </div>
    );
};

export default RusheeTile;

