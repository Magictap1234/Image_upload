import React, { useState, useRef, useEffect } from 'react';
import './UploadComponent.css';
import logo from './assets/images/HCL-logo.png'; 

const UploadComponent = () => {
  const [file, setFile] = useState(null);
  const [imgSrc, setImgSrc] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);
  const [text, setText] = useState('');
  const [isPhone, setIsPhone] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const url = "https://script.google.com/macros/s/AKfycby4TjanbY_CS_dTynjaeSehmT2pPkY-6PNVk7VE_qMkQqsUla-QmmJGKW5Uf8YyvfpCJQ/exec";

  useEffect(() => {
    // Detect if the user is on a phone
    const checkIfPhone = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      setIsPhone(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent));
    };
    checkIfPhone();
    window.addEventListener('resize', checkIfPhone);
    return () => window.removeEventListener('resize', checkIfPhone);
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      const res = reader.result;
      setImgSrc(res);

      const base64String = res.split("base64,")[1];
      const payload = {
        base64: base64String,
        type: selectedFile.type,
        name: selectedFile.name
      };

      fetch(url, {
        method: "POST",
        body: JSON.stringify(payload)
      })
      .then(response => response.text())
      .then(data => {
        console.log(data);
        // Clear image after upload
        setImgSrc('');
        setFile(null);
      })
      .catch(error => console.error('Error:', error));
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleTakeSelfie = () => {
    setIsCameraOn(true);
    setIsCaptured(false);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch(err => console.error('Error accessing camera: ', err));
  };

  const handleCapture = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const dataUrl = canvasRef.current.toDataURL('image/png');
    setImgSrc(dataUrl);
    videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    setIsCameraOn(false);
    setIsCaptured(true);
  };

  const handleNextStep = () => {
    if (isCaptured) {
      const base64String = imgSrc.split("base64,")[1];
      const payload = {
        base64: base64String,
        type: 'image/png',
        name: 'selfie.png'
      };

      fetch(url, {
        method: "POST",
        body: JSON.stringify(payload)
      })
      .then(response => response.text())
      .then(data => {
        console.log(data);
        // Clear form after upload
        setImgSrc('');
        setFile(null);
        setText('');
      })
      .catch(error => console.error('Error:', error));
    } else if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result;
        const base64String = res.split("base64,")[1];
        const payload = {
          base64: base64String,
          type: file.type,
          name: file.name
        };

        fetch(url, {
          method: "POST",
          body: JSON.stringify(payload)
        })
        .then(response => response.text())
        .then(data => {
          console.log(data);
          // Clear form after upload
          setImgSrc('');
          setFile(null);
          setText('');
        })
        .catch(error => console.error('Error:', error));
      };

      reader.readAsDataURL(file);
    } else {
      console.log('No image captured or selected');
    }
    // window.location.reload();
  };

  return (
    <div className='body'>
      <div className='logo'>
        {/* <img src={logo} alt="Bootstrap" width={240} height={120}/> */}
        <h1>HCLTech</h1>
      </div>
      <div className="form">
        <div className="image-upload" onClick={() => document.getElementById('file-input').click()}>
          <input id="file-input" type="file" accept="image/*" onChange={handleFileChange} />
          {imgSrc ? <img src={imgSrc} alt="Preview" /> : <p>+ ADD AN IMAGE<br /><span>or just drag and drop it here</span></p>}
        </div>
        {!isPhone && (
          <div>
            <button className="cancel-button">CANCEL</button>
            <button className="next-step-button" onClick={handleNextStep}>NEXT STEP</button>
          </div>
        )}
        {!isPhone && <button className="upload-button" onClick={handleTakeSelfie}>Take Selfie</button>}
        {isCameraOn && (
          <div className="video-container">
            <video ref={videoRef}></video>
            <button className="capture-button" onClick={handleCapture}>Capture</button>
          </div>
        )}
        {isCaptured && !isPhone && (
          <button className="retake-button" onClick={handleTakeSelfie}>Retake Selfie</button>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480"></canvas>
      </div>
    </div>
  );
};

export default UploadComponent;
