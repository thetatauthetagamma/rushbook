import React from 'react'
import RusheeTile from "../../components/RusheeTile";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import supabase from "../../supabase";

export default function RusheePage() {
  const router = useRouter();
  const { Rushee_Email } = router.query;
  const [rusheeData, setRusheeData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    Likes: [],
    Dislikes: [],
    Bio: "",
    Major: "",
    Year: "",
    Gender: "",
    Comments: [],
  });
  const [imageUrl, setImageUrl] = useState("");
  const [alreadyLiked, setAlreadyLiked] = useState(false);
  const [alreadyDisliked, setAlreadyDisliked] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
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
  }, [Rushee_Email]);

  useEffect(() => {
    const fetchRushee = async () => {
      if (Rushee_Email) {
        const { data, error } = await supabase
          .from("Rushbooks")
          .select("*")
          .eq("Rushee_Email", Rushee_Email);

        if (error) {
          console.log(error);
        } else if (data && data.length > 0) {
          const rusheeData = data[0];
          setRusheeData(rusheeData);

          // Check if the current user has already liked or disliked the rushee
          if (userEmail) {
            setAlreadyLiked(rusheeData.Likes.includes(userEmail));
            setAlreadyDisliked(rusheeData.Dislikes.includes(userEmail));
          }
        }
      }
    };

    fetchRushee();
  }, [Rushee_Email, userEmail]);

  useEffect(() => {
    const fetchRusheeImage = async () => {
      const email = Rushee_Email;

      if (email) {
        const { data: ImageData, error } = await supabase
          .storage
          .from("rushee")
          .download(email);

        if (error) {
          console.log(error);
        } else {
          setImageUrl(URL.createObjectURL(ImageData));
        }
      }
    };

    fetchRusheeImage();
  }, [Rushee_Email]);

  const handleLikeDislike = async (field, add) => {
    if (userEmail) {
      // Update the state with the new liked or disliked status
      const updatedData = {
        ...rusheeData,
        [field]: add ? [...rusheeData[field], userEmail] : rusheeData[field].filter((email) => email !== userEmail),
      };
      setRusheeData(updatedData);

      // Update the database with the new liked or disliked status
      await supabase.from("V1-Book").update({ [field]: updatedData[field] }).eq("Rushee_Email", Rushee_Email);
    }
  };

  const handleLike = () => handleLikeDislike("Likes", true);
  const handleRemoveLike = () => handleLikeDislike("Likes", false);
  const handleDislike = () => handleLikeDislike("Dislikes", true);
  const handleRemoveDislike = () => handleLikeDislike("Dislikes", false);

  const handleHome = () => {
    router.push("/");
  };

  const handleComment = async (comment) => {
    if (Rushee_Email && userEmail) {
      try {
        const { data, error } = await supabase
          .from("Users")
          .select("*")
          .eq("email", userEmail);

        if (error) {
          console.log(error);
          return;
        }

        let firstName = "";
        let lastName = "";

        if (data && data.length > 0) {
          firstName = data[0].firstname;
          lastName = data[0].lastname;
        }

        const commentWithUser = `${firstName} ${lastName}: ${comment}`;

        // Update the state with the new comment
        const updatedComments = [...rusheeData.Comments, commentWithUser];
        setRusheeData({ ...rusheeData, Comments: updatedComments });

        // Update the database with the new comments
        await supabase.from("book").update({ Comments: updatedComments }).eq("Rushee_Email", Rushee_Email);

        console.log("Comment added to the database successfully.");
      } catch (error) {
        console.error("Error adding comment to the database:", error);
      }
    }
  };

  return (
      <div className="flex flex-col items-center m-8">
        <RusheeTile
          Rushee_Email={rusheeData.email}
          Rushee_Name={`${rusheeData.firstname} ${rusheeData.lastname}`}
          Likes={rusheeData.Likes}
          Comments={rusheeData.Comments}
          Dislikes={rusheeData.Dislikes}
          imageUrl={imageUrl}
          Major={rusheeData.Major}
          Year={rusheeData.Year}
          Gender={rusheeData.Gender}
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
        <button className="bg-black text-amber-400 m-2 p-2 rounded-lg hover:scale-105 shadow-lg mt-4" onClick={handleHome}>
          Back to Home
        </button>
      </div>
  );
}

