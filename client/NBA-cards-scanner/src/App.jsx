import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar/Navbar';
import { ArrowUpTrayIcon } from '@heroicons/react/24/solid';
import './App.css';
import './index.css';

const App = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5000');

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.files && Array.isArray(data.files)) {
          const newImages = data.files.map((file) => ({
            url: `http://localhost:5000/${file.filename}`,
            name: file.originalname,
          }));
          setImages((prevImages) => [...prevImages, ...newImages]);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

    return () => socket.close();
  }, []);

  const handleUpload = async (event) => {
    const files = event.target.files;
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('images', file);
    });

    try {
      await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center bg-white min-h-screen p-4">
        <input
          type="file"
          multiple
          onChange={handleUpload}
          id="file-input"
          className="hidden"
        />

        <label
          htmlFor="file-input"
          className="mb-4 cursor-pointer flex items-center px-4 py-2 bg-[#0D9488] hover:bg-[#0F766E] text-white rounded-md shadow-md transition-colors duration-300 ease-in-out"
        >
          <ArrowUpTrayIcon className="h-6 w-6 mr-2" /> {/* Upload Icon */}
          Upload Images
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <div key={index} className="w-full sm:w-64 h-96 flex justify-center border-2 rounded-md shadow-lg overflow-hidden transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
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
