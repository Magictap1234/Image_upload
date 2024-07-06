import React from 'react';
import logo from './assets/images/HCL-logo.png'; // Adjust the path as necessary

export default function Navbar() {
  return (
    // <nav className="navbar bg-body-tertiary"  
    // style={{"background":" rgb(177,16,205)",
    //   "background": "linear-gradient(155deg, rgba(177,16,205,1) 36%, rgba(30,34,235,1) 90%)"}}
      // >
      <div className="container">
        <a className="navbar-brand" href="#">
          <img src={logo} alt="Bootstrap" width={120} height={60}/>
        </a>
      </div>
    // </nav>
  );
}