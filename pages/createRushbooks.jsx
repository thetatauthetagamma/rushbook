import React from 'react';
import CreateRushbook from '../components/CreateRushbook';
import Cookies from 'js-cookie';
import greek2 from '../public/greek2.jpeg';

export default function CreateRushbooks() {
  const userEmail = Cookies.get('user_email');

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Fading Background Image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.1)), url(${greek2.src})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full">
        <CreateRushbook currentEmail={userEmail} />
      </div>
    </div>
  );
}
