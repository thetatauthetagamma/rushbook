import React from 'react'
import CreateRushbook from '../components/CreateRushbook.js';
import Cookies from 'js-cookie';

export default function createRushbooks() {
    const userEmail = Cookies.get('user_email');

  return (
    <div>
      <CreateRushbook currentEmail={userEmail}/>
    </div>
  )
}
