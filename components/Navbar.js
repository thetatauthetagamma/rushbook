import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../supabase';
import Cookies from 'js-cookie';
import menuIcon from '../public/menu.svg';
import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';

export default function Navbar() {
  const router = useRouter();
  const [userExists, setUserExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentEmail, setCurrentEmail] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [noAccount, setNoAccount] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: 1023 });

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await supabase.auth.getSession();
        if (session) {
          setCurrentEmail(session.data.session?.user.email || '');
          Cookies.set('user_email', session.data.session?.user.email || '');
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSession();

    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setCurrentEmail(session.user?.email || '');
        Cookies.set('user_email', session.user?.email || '');
      }
      if (event === 'SIGNED_OUT') {
        setCurrentEmail('');
        Cookies.set('user_email', '');
        router.push('/');
      }
    });
  }, [currentEmail]);

  const handleGoogleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    console.log('here');
    console.log(data);
    console.log(error);
  };

  const handleGoogleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    setUserExists(false);
    console.log(error);
  };

  useEffect(() => {
    const checkUser = async () => {
      if (currentEmail) {
        try {
          const { data, error } = await supabase
            .from('Users')
            .select('email')
            .eq('email', currentEmail)
            .single();

          console.log(data);
          console.log(error);

          if (!error && data.email) {
            setUserExists(true);
          } else {
            setNoAccount(true);
            router.push('/createAccount');
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
  }, [currentEmail]);

  const handleDisplayRushbooks = () => {
    router.push('/myRushbooks');
    setShowDropdown(false);
  };

  const handleDisplayCreateRushbook = () => {
    router.push('/createRushbooks');
    setShowDropdown(false);
  };

  const handleDisplayJoinRushbook = () => {
    router.push('/joinRushbook');
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex items-center justify-between relative">
        <h1 className="text-3xl font-bold">Rushbook</h1>
        {noAccount ? null : (
          <>
            {isMobile && (
              <div className="lg:hidden cursor-pointer" onClick={toggleDropdown}>
                <Image src={menuIcon} alt="Menu Icon" className="w-6 h-6" />
              </div>
            )}
            {showDropdown && isMobile && (
              <div className="lg:hidden absolute top-full right-0 bg-gray-800 bg-opacity-75 z-50" onClick={toggleDropdown}>
                <div className="container mx-auto p-4">
                  {userExists ? (
                    <div className="flex flex-col items-center space-y-4">
                      <button onClick={handleDisplayRushbooks} className="text-lg font-semibold">
                        My Rushbooks
                      </button>
                      <button onClick={handleDisplayCreateRushbook} className="text-lg font-semibold">
                        Create New Rushbook
                      </button>
                      <button onClick={handleDisplayJoinRushbook} className="text-lg font-semibold">
                        Join a Rushbook
                      </button>
                      <button onClick={handleGoogleSignOut} className="text-lg font-semibold">
                        Sign out
                      </button>
                    </div>
                  ) : (
                    <button onClick={handleGoogleSignIn} className="text-lg font-semibold">
                      Sign in
                    </button>
                  )}
                </div>
              </div>
            )}
            {!loading && (
              <div className={`lg:flex space-x-6 ${isMobile ? 'hidden' : 'flex'}`}>
                {userExists ? (
                  <div className="lg:flex items-center space-x-4">
                    <button onClick={handleDisplayRushbooks} className="text-lg font-semibold">
                      My Rushbooks
                    </button>
                    <button onClick={handleDisplayCreateRushbook} className="text-lg font-semibold">
                      Create New Rushbook
                    </button>
                    <button onClick={handleDisplayJoinRushbook} className="text-lg font-semibold">
                      Join a Rushbook
                    </button>
                    <button onClick={handleGoogleSignOut} className="text-lg font-semibold">
                      Sign out
                    </button>
                  </div>
                ) : (
                  <button onClick={handleGoogleSignIn} className="text-lg font-semibold">
                    Sign in
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );  
}
