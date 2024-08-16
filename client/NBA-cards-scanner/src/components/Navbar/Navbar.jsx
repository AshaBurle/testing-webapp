import React from 'react';

const Navbar = () => {
  const handleDownload = () => {
    // Handle the download action (assuming you have a backend route for downloading)
    window.open('http://localhost:5000/download-images');
  };

  return (
    <nav className="bg-[#2D3748] p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-2xl font-bold">
          
          NBA Card Scanner
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="bg-white text-[#2D3748] text-md px-4 py-2 rounded-md shadow hover:bg-gray-100 transition-all"
        >
          Download Images
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
