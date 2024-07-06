// import logo from './logo.svg';
import { useState } from 'react';
import UploadComponent from './UploadComponent';
import Navbar from './Navbar';
import './App.css';


function App() {

  return (
    <div className="App">
      {/* <h1>Upload to Google Drive</h1> */}
      {/* <Navbar/> */}
      <UploadComponent  />
    </div>
  );
}

export default App;
