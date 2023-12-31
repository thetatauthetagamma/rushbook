import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../supabase';
import Cookies from 'js-cookie';

export default function Navbar() {
  const router = useRouter();
  const [userExists, setUserExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentEmail, setCurrentEmail] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await supabase.auth.getSession();
        if (session) {
          console.log(session);
          const userEmail = session.data.session?.user.email || '';
          setCurrentEmail(userEmail);
          Cookies.set('user_email', userEmail); // Set the user_email cookie
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSession();

    // Listen for changes in the authentication state
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const userEmail = session.user?.email || '';
        setCurrentEmail(userEmail);
        Cookies.set('user_email', userEmail); // Set the user_email cookie
      }
      if (event === 'SIGNED_OUT') {
        setCurrentEmail('');
        Cookies.remove('user_email'); // Remove the user_email cookie
      }
    });

    // Cleanup the listener on component unmount
    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    // Handle the Google sign in
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    console.log('here');
    console.log(data);
    console.log(error);
  };

  const handleGoogleSignOut = async () => {
    // Handle the Google sign out
    const { error } = await supabase.auth.signOut();
    setUserExists(false);
    console.log(error);
  };

  useEffect(() => {
    const checkUser = async () => {
      const userEmailFromCookie = Cookies.get('user_email');

      if (userEmailFromCookie) {
        setCurrentEmail(userEmailFromCookie);
        try {
          const { data, error } = await supabase
            .from('Users')
            .select('email')
            .eq('email', userEmailFromCookie)
            .single();

          console.log(data);

          if (!error && data.email) {
            setUserExists(true);
          } else {
            // If user does not exist, redirect to /createAccount with email as query parameter
            router.push({
              pathname: '/createAccount',
              query: { email: userEmailFromCookie },
            });
          }
        } catch (error) {
          console.error('Error checking user authentication:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  function handleDisplayRushbooks() {
    router.push({
      pathname: '/myRushbooks',
    });
  }

  function handleDisplayCreateRushbook() {
    router.push({
      pathname: '/createRushbooks',
    });
  }

  function handleDisplayJoinRushbook() {
    router.push({
      pathname: '/joinRushbook',
    });
  }

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">Rushbook</h1>
        {!loading && (
          <div className="flex space-x-4">
            {userExists ? (
              <>
                <button onClick={handleDisplayRushbooks} className="nav-button">
                  My Rushbooks
                </button>
                <button onClick={handleDisplayCreateRushbook} className="nav-button">
                  Create New Rushbook
                </button>
                <button onClick={handleDisplayJoinRushbook} className="nav-button">
                  Join a Rushbook
                </button>
                <button onClick={handleGoogleSignOut} className="nav-button">
                  Sign out
                </button>
              </>
            ) : (
              <button onClick={handleGoogleSignIn} className="nav-button">
                Sign in
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
