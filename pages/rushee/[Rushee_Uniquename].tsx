import RusheeTile from "../../components/RusheeTile";
import { useRouter } from "next/router";
import { useEffect , useState } from "react";
import supabase from "../../supabase";

export default function RusheePage() {

    const router = useRouter();
    const { Rushee_Uniquename } = router.query;
    const [uniqueName, setUniqueName] = useState('');
    const [name , setName] = useState('');
    const [bio, setBio] = useState('');
    const [likes, setLikes] = useState([]);
    const [comments, setComments] = useState([]);
    const [dislikes, setDislikes] = useState([]);
    const [imageUrl, setImageUrl] = useState('');

    useEffect (() => {

        const fetchRushee = async () => {

            if (Rushee_Uniquename){
                const { data, error } = await supabase.from('book').select('*').eq('Rushee_Uniquename', Rushee_Uniquename);
                if (error) {
                    console.log(error);
                } else {
                    console.log(data);
                    setUniqueName(data[0].Rushee_Uniquename);
                    setName(data[0].Rushee_Name);
                    setBio(data[0].Bio);
                    setLikes(data[0].Likes);
                    setComments(data[0].Comments);
                    setDislikes(data[0].Dislikes);
                }
            }
        };
        fetchRushee();
    }, [Rushee_Uniquename]);

    useEffect(() => {
        const fetchRusheeImage = async () => {
          // Explicitly cast Rushee_Uniquename to string
          const uniqueName = Rushee_Uniquename as string;
    
          if (uniqueName) {
            const { data: ImageData, error } = await supabase
              .storage
              .from('rushee')
              .download(uniqueName);
    
            if (error) {
                console.log(error);
                }
            else {
                    setImageUrl(URL.createObjectURL(ImageData));
                }
          }
        };
        fetchRusheeImage();
      }, [Rushee_Uniquename]);

    const handleHome = () => {
        router.push('/');
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className='text-6xl lg:text-8xl font-bold bg-gradient-to-r from-amber-400 via-orange-800 to-red-950 bg-clip-text text-transparent pb-2 text-center'>THT Rushbook</h1>
            <hr className='h-2 my-4 w-full rounded bg-gradient-to-r from-amber-400 via-orange-800 to-red-950 mb-20' />
            <RusheeTile Rushee_Uniquename={uniqueName} Rushee_Name={name} Bio={bio} Likes={likes} Comments={comments} Dislikes={dislikes} imageUrl={imageUrl} Big={true}/>
            <button className='bg-gradient-to-r from-amber-400 via-orange-800 to-red-950 text-white m-2 p-2 rounded-lg hover:scale-105 shadow-lg mt-4' onClick={handleHome}>Back to Home</button>
        </div>
    );
}