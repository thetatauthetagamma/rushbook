import React from 'react';
import JoinRushbook from '../components/JoinRushbook';
import Cookies from 'js-cookie';
import Greek3 from '../public/Greek3.jpeg';

export default function JoinRushbookPage() {
  const userEmail = Cookies.get('user_email');

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Fading Background Image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.1)), url(${Greek3.src})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full">
        <JoinRushbook currentEmail={userEmail} />
      </div>
    </div>
  );
}
