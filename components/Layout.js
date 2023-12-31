import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    
      <div className="flex flex-col min-h-screen font-custom">
        <Navbar/> 
     
        <div className="flex flex-col flex-grow">
          {children}
        </div>
            
        <div className="flex-row bottom-0">
          <Footer />
        </div>

      </div>
    
  );
}
