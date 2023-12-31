import React from 'react';
import MyRushbooks from '../components/MyRushbooks.js';
import Cookies from 'js-cookie';

export default function MyRushbooksPage() {
  const userEmail = Cookies.get('user_email');

  return (
    <div>
      <MyRushbooks currentEmail={userEmail} />
    </div>
  );
}