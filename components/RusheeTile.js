import React, { useEffect , useState} from 'react'
import Image from "next/legacy/image"
import thtlogo from '../public/tht-logo.png'
import like from '../public/like.svg'
import liked from '../public/liked.svg'
import dislike from '../public/dislike.svg'
import disliked from '../public/disliked.svg'
import supabase from '@/supabase'

export default function RusheeTile ({
    Rushee_Uniquename,
    Rushee_Name,
    q1,
    q2,
    q3,
    Likes,
    Comments,
    Dislikes,
    imageUrl,
    Major,
    Year,
    Pronouns,
    Big,
    alreadyLiked,
    alreadyDisliked,
    userEmail,
    onLike,
    onDislike,
    onRemoveLike,
    onRemoveDislike,
    onComment
    })
    {

    const [newComment, setNewComment] = useState('');

    const handleSeeMore = () => {
      if(!Big){
        Router.push(`/rushee/${Rushee_Uniquename}`);
      }
    };

    const handleAddComment = () => {
      console.log(newComment)
      if (newComment.trim() === '') {
        return; // Prevent adding empty comments
      }
      // Call the onComment prop and pass the new comment to the parent component
      if (onComment) {
        onComment(newComment);
      }
      // Clear the input box after adding the comment
      setNewComment('');
    };

    return (
        <div onClick={handleSeeMore} className = {`flex flex-col ${Big ? 'w-10/12 sm:w-10/12 md:w-7/12' : 'w-80 sm:w-86 md:w-96 lg:w-96 max-w-xl'} mx-auto overflow-hidden bg-gradient-to-r from-amber-400 via-orange-800 to-red-950 rounded-lg shadow-md ${Big ? '' : 'transform transition-all hover:scale-105 ease-in duration-200 hover:shadow-2xl'}`}>
            <div className={`relative ${Big? 'h-96' : 'h-64'} w-full`}>
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
              <div className='flex flex-col items-center'>
                <h1 className='flex p-2 font-bold text-3xl text-center'>{Rushee_Name}</h1>
                <h3 className='flex text-md mb-2'>{Major} | {Year} | {Pronouns}</h3>
              </div>
                <hr className={`w-full border-white ${Big ? 'mb-4' : ''}`} />

                {Big && 
                  (
                    <div className='flex flex-col items-center'>
                      <div className='mb-4'>
                          <h3 className='text-center font-bold underline mb-2'>Write a few sentences about any interests you have?</h3>
                        <h3 className={`text-center whitespace-normal px-2`}>
                          {q1}
                        </h3>
                      </div>
                      <div className='mb-4'>
                        <h3 className='text-center font-bold underline mb-2'>Why do you want to join Theta Tau?</h3>
                        <h3 className={`text-center whitespace-normal px-2`}>
                          {q2}
                        </h3>
                      </div>
                      <div className='mb-4'>
                        <h3 className='text-center font-bold underline mb-2'>Tell us a Joke</h3>
                        <h3 className={`text-center whitespace-normal px-2`}>
                          {q3}
                        </h3>
                      </div>
                    </div>
                  )
                }
                <div className='flex items-center pt-2'>
                    <div className='flex items-center px-4'>
                        <h3 className='p-2 font-bold'> Likes: {Likes?.length} </h3> 
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
                        <h3 className='p-2 font-bold'> Dislikes: {Dislikes?.length} </h3>
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
                <div>
                      <h3 className='pb-2 font-bold'> Comments: {Comments?.length} </h3>
                </div>
                {
                  Big && 
                  ( 
                    <div className='flex flex-col items-center w-10/12'>
                      <h1 className='p-2 font-bold'>
                        Comments
                      </h1>
                      <div className="h-40 border border-white w-full overflow-y-auto p-2 bg-white rounded-lg">
                        {Comments && Comments.map((comment, index) => (
                          <div key={index} className="mb-2 text-black">
                            <p>{comment}</p>
                            <hr className={`w-full h-1 bg-gradient-to-r from-amber-400 via-orange-800 to-red-950`} />
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col items-center mt-2 w-full">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="w-full p-2 border border-red rounded-md text-black"
                          placeholder="Add a comment..."
                        />
                        <button
                          className="bg-white text-red-900 mt-2 p-2 rounded-lg mb-4 hover:scale-105 shadow-lg"
                          onClick={handleAddComment}
                        >
                          Add Comment
                        </button>
                  </div>
                    </div>
                    
                  )
                }
            </div>
        </div>
    );
};