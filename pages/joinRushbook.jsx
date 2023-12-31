import React from 'react';
import JoinRushbook from '../components/JoinRushbook';
import Cookies from 'js-cookie';

export default function JoinRushbookPage() {
  const userEmail = Cookies.get('user_email');

  return (
    <div>
      <JoinRushbook currentEmail={userEmail} />
    </div>
  );
}
