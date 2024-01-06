import React from 'react';
import MyRushbooks from '../components/MyRushbooks.js';
import Cookies from 'js-cookie';
import greek4 from '../public/greek4.jpeg';

export default function MyRushbooksPage() {
  const userEmail = Cookies.get('user_email');

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Fading Background Image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.1)), url(${greek4.src})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <MyRushbooks currentEmail={userEmail} />
      </div>
    </div>
  );
}
