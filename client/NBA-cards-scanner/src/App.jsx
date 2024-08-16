import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar/Navbar';
import './App.css';
import './index.css';

const App = () => {
  const [images, setImages] = useState([]);

  // Open WebSocket connection when the component mounts
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5000');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.files) {
        const newImages = data.files.map((file) => ({
          url: `http://localhost:5000/${file.filename}`,
          name: file.originalname,
        }));
        setImages((prevImages) => [...prevImages, ...newImages]);
      }
    };

    // Clean up WebSocket connection when component unmounts
    return () => socket.close();
  }, []);

  const handleUpload = async (event) => {
    const files = event.target.files;
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('images', file);
    });

    await axios.post('http://localhost:5000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center bg-white min-h-screen p-4">
        <input
          type="file"
          multiple
          onChange={handleUpload}
          className="mb-4 p-2 bg-white text-black rounded shadow"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <div key={index} className="w-full sm:w-64 h-96 flex justify-center border-2 rounded-md shadow-lg overflow-hidden">
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-full object-cover border border-white rounded-md"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
