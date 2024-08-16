import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";

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
          className="bg-white flex items-center text-[#2D3748] text-md px-4 py-2 rounded-md shadow hover:bg-gray-100 transition-all"
        > <ArrowDownTrayIcon className="w-6 h-6 mr-2" />
          Download Images
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
