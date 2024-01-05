import React from 'react';
import RusheeTile from "../../components/RusheeTile";
import { useEffect, useState } from "react";
import supabase from "../../supabase";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function RusheePage() {
  const router = useRouter();
  const [rusheeData, setRusheeData] = useState({
    Bio: "",
    Year: "",
    Likes: [],
    Major: "",
    email: "",
    Gender: "",
    Comments: [],
    Dislikes: [],
    Lastname: "",
    Pronouns: "",
    Firstname: "",
  });
  const [imageUrl, setImageUrl] = useState("");
  const [alreadyLiked, setAlreadyLiked] = useState(false);
  const [alreadyDisliked, setAlreadyDisliked] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [currentRushee, setCurrentRushee] = useState("");
  const [rushbookName, setRushbookName] = useState("");
  const [rushbookData, setRushbookData] = useState(null);

  useEffect(() => {
    // Get cookies when the component mounts
    const cookieRushee = Cookies.get('currentRushee');
    const cookieRushbook = Cookies.get('currentRushbook');

    if (cookieRushee && cookieRushbook) {
      setCurrentRushee(cookieRushee);
      setRushbookName(cookieRushbook);
    }

    const fetchSession = async () => {
      try {
        const session = await supabase.auth.getSession();
        if (session) {
          setUserEmail(session.data.session?.user.email || "");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    const fetchRushee = async () => {
      if (currentRushee) {
        try {
          const { data, error } = await supabase
            .from("Rushbooks")
            .select("rushees")
            .eq("name", rushbookName);
  
          if (error) {
            console.log(error);
          } else if (data && data.length > 0) {
            const rushee = data[0].rushees.find((r) => r.email === currentRushee);
            setRusheeData(rushee);
            // Save the fetched data to a state variable
            setRushbookData(data[0]);
            // Check if the current user has already liked or disliked the rushee
          }
        } catch (error) {
          console.error("Error fetching rushee data:", error);
        }
      }
    };
  
    fetchRushee();
  }, [currentRushee, rushbookName, userEmail]);

    // Log statements moved into the useEffect that depends on rusheeData changes
    useEffect(() => {
      // Check if the current user has already liked or disliked the rushee
      if (userEmail && rusheeData) {
        setAlreadyLiked(rusheeData.Likes.includes(userEmail));
        setAlreadyDisliked(rusheeData.Dislikes.includes(userEmail));
        console.log(alreadyLiked);
        console.log(alreadyDisliked);
      }
    }, [rusheeData, userEmail]);

  useEffect(() => {
    const fetchRusheeImage = async () => {
      if (currentRushee) {
        try {
          const { data, error } = await supabase
            .storage
            .from("Rushees")
            .download(`${currentRushee}.jpeg`);

          if (error) {
            console.log(error);
          } else {
            setImageUrl(URL.createObjectURL(data));
          }
        } catch (error) {
          console.error("Error fetching rushee image:", error);
        }
      }
    };

    fetchRusheeImage();
  }, [currentRushee]);

  const handleLike = async () => {
    if (userEmail && !alreadyLiked && rushbookData) {
      const updatedLikes = [...rusheeData.Likes, userEmail];
      setRusheeData(prevData => ({ ...prevData, Likes: updatedLikes }));
      setAlreadyLiked(true);
  
      await supabase.from('Rushbooks')
        .update({
          rushees: rushbookData.rushees.map(r => (r.email === currentRushee) ? { ...r, Likes: updatedLikes } : r)
        })
        .eq('name', rushbookName);
    }
  };
  
  const handleRemoveLike = async () => {
    if (userEmail && alreadyLiked && rushbookData) {
      const updatedLikes = rusheeData.Likes.filter((email) => email !== userEmail);
      setRusheeData(prevData => ({ ...prevData, Likes: updatedLikes }));
      setAlreadyLiked(false);
  
      await supabase.from('Rushbooks')
        .update({
          rushees: rushbookData.rushees.map(r => (r.email === currentRushee) ? { ...r, Likes: updatedLikes } : r)
        })
        .eq('name', rushbookName);
    }
  };
  
  const handleDislike = async () => {
    if (userEmail && !alreadyDisliked && rushbookData) {
      const updatedDislikes = [...rusheeData.Dislikes, userEmail];
      setRusheeData(prevData => ({ ...prevData, Dislikes: updatedDislikes }));
      setAlreadyDisliked(true);
  
      await supabase.from('Rushbooks')
        .update({
          rushees: rushbookData.rushees.map(r => (r.email === currentRushee) ? { ...r, Dislikes: updatedDislikes } : r)
        })
        .eq('name', rushbookName);
    }
  };
  
  const handleRemoveDislike = async () => {
    if (userEmail && alreadyDisliked && rushbookData) {
      const updatedDislikes = rusheeData.Dislikes.filter((email) => email !== userEmail);
      setRusheeData(prevData => ({ ...prevData, Dislikes: updatedDislikes }));
      setAlreadyDisliked(false);
  
      await supabase.from('Rushbooks')
        .update({
          rushees: rushbookData.rushees.map(r => (r.email === currentRushee) ? { ...r, Dislikes: updatedDislikes } : r)
        })
        .eq('name', rushbookName);
    }
  };
  
  const handleComment = async (comment) => {
    if (currentRushee && userEmail && rushbookData) {
      try {
        const { data, error } = await supabase
          .from("Users")
          .select("*")
          .eq("email", userEmail);
  
        if (error) {
          console.error("Error fetching user data:", error);
          return;
        }
  
        let firstName = "";
        let lastName = "";
  
        if (data && data.length > 0) {
          firstName = data[0].firstname;
          lastName = data[0].lastname;
        }
  
        const commentWithUser = `${firstName} ${lastName}: ${comment}`;
  
        setRusheeData(prevData => ({ ...prevData, Comments: [...prevData.Comments, commentWithUser] }));
  
        await supabase.from('Rushbooks')
          .update({
            rushees: rushbookData.rushees.map(r => (r.email === currentRushee) ? { ...r, Comments: [...r.Comments, commentWithUser] } : r)
          })
          .eq('name', rushbookName);
      } catch (error) {
        console.error("Error adding comment to the database:", error);
      }
    }
  };

  const handleHome = () => {
    router.push(`/${rushbookName}`);
  };

  return (
    <div className="flex flex-col items-center m-8">
      <RusheeTile
        Rushee_Email={rusheeData.email}
        Rushee_Name={`${rusheeData.Firstname} ${rusheeData.Lastname}`}
        Likes={rusheeData.Likes}
        Bio={rusheeData.Bio}
        Comments={rusheeData.Comments}
        Dislikes={rusheeData.Dislikes}
        imageUrl={imageUrl}
        Major={rusheeData.Major}
        Year={rusheeData.Year}
        Gender={rusheeData.Gender}
        Pronouns={rusheeData.Pronouns}
        Big={true}
        alreadyLiked={alreadyLiked}
        alreadyDisliked={alreadyDisliked}
        userEmail={userEmail}
        onLike={handleLike}
        onDislike={handleDislike}
        onRemoveLike={handleRemoveLike}
        onRemoveDislike={handleRemoveDislike}
        onComment={handleComment}
      />
      <button className="bg-gray-800 text-white m-2 p-2 rounded-lg hover:scale-105 shadow-lg mt-4" onClick={handleHome}>
        Back to Home
      </button>
    </div>
  );
}

