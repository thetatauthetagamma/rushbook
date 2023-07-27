import React from 'react'
import supabase from '../supabase.js';
import { useState } from 'react';
import RusheeTile from '../components/RusheeTile';
import Router from 'next/router';

export default function AddRushee() {

    const [uniqueName , setUniqueName] = useState(' ');
    const [rusheeName , setRusheeName] = useState(' ');
    const [rusheeBio , setRusheeBio] = useState(' ');
    const [imageUrl , setImageUrl] = useState('');
    const [avatarImg, setAvatarImg] = useState(null);


    const onImageChange = (e) => {
        const files = e.target.files[0];
        setImageUrl(files);

        const reader = new FileReader();

        reader.onloadend = () => {
            setAvatarImg(reader.result);
        };
        // read the file as a data URL
        if (files) reader.readAsDataURL(files);
    };
 

    const handleSubmit = async (event) => {
        event.preventDefault(); 
        const { error } = await supabase.from('book').insert([
            { Rushee_Uniquename: uniqueName, Rushee_Name: rusheeName, Bio: rusheeBio, Likes: [], Comments: []  }
        ])
        if (error) {
            console.log(error)
        }

        console.log("imageUrl:", imageUrl);
        
        if (imageUrl) {
            // Convert the file to a Blob
            const fileBlob = new Blob([imageUrl]);
    
            const { data: avatarData, error: AvatarError } = await supabase.storage
                .from('rushee')
                .upload(uniqueName, fileBlob);
                if (AvatarError) {
                    console.log("Error uploading avatar:", AvatarError);
                }
        }

        setUniqueName(' ');
        setRusheeName(' ');
        setRusheeBio(' ');
        setImageUrl(null);
        setAvatarImg(null);

        console.log("Form submitted!");
    }

    const BackToHome = async () => {
        Router.push('/')
      }

  return (
    <div className='flex flex-col items-center'>
        <h1 className='text-4xl font-bold bg-gradient-to-r from-amber-400 via-orange-800 to-red-950 bg-clip-text text-transparent py-2 pb-8 text-center'> Input Rushee Information</h1>
        <div className='flex flex-col sm:flex-row items-center pt-8'>
            <form className='flex flex-col w-full max-w-xl mx-auto bg-white shadow-xl rounded-md px-20'>
                <div className='flex items-center p-4'>
                    <label className='p-4 font-bold'> Uniquename: </label>
                    <input type="text" name="uniquename" value={uniqueName} onChange={(e) => setUniqueName(e.target.value)} className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-300 text-lg" />
                </div>
                <div className='flex items-center p-4'>
                    <label className='p-4 font-bold'> Name: </label>
                    <input type="text" name="name" value= {rusheeName} onChange={(e) => setRusheeName(e.target.value)} className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-300 text-lg" />
                </div>
                <div className='flex items-center p-4'>
                    <label className='p-4 font-bold'> Bio: </label>
                    <input type="text" name="bio" value={rusheeBio} onChange={(e) => setRusheeBio(e.target.value)} className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-300 text-lg" />
                </div>
                <div className='flex flex-col items-center p-4'>
                    <div className='flex p-4'>
                        <label className='p-4 font-bold'> Image: </label>
                        <input 
                            className='border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring focus:border-blue-300 text-lg'
                            type="file" 
                            name="image"
                            onChange={onImageChange} 
                            />
                    </div>
                </div>
                <button type='submit' className='bg-gradient-to-r from-amber-400 via-orange-800 to-red-950 text-white m-2 p-2 rounded-lg hover:scale-105 shadow-lg mb-4' onClick={(e) => handleSubmit(e)}> Add Rushee </button>
            </form>
            <div className='px-20'>
                <h1 className='text-4xl font-bold text-black bg-clip-text text-transparent py-2 text-center'> Preview </h1>
                <RusheeTile 
                    Rushee_Uniquename={uniqueName}
                    Rushee_Name={rusheeName}
                    Bio={rusheeBio}
                    imageUrl={avatarImg}
                />
            </div>
        </div>
        <button onClick={BackToHome} className='bg-gradient-to-r from-amber-400 via-orange-800 to-red-950 text-white m-6 p-2 rounded-lg hover:scale-105 shadow-lg mb-4'>Back to Home</button>
    </div>
  )
}