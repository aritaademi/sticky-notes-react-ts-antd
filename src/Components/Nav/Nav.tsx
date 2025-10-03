
import React from 'react';

interface NavProps {
  onAddNote: () => void;
}

const Nav: React.FC<NavProps> = ({ onAddNote }) => {
  return (
    <nav className="w-full h-[100px] flex justify-between items-center px-[12%] shadow-nav bg-background transition-colors duration-300">
      <div className="flex items-center gap-2">
        <button
          onClick={onAddNote}
          className="bg-notecolorlight1 hover:bg-notecolors1 text-black w-[150px] h-10 rounded font-semibold font-bricolage border-none transition duration-300 shadow-md hover:shadow-lg"
        >
          <i className="ri-add-large-fill"></i> &nbsp; Add Note
        </button>
      </div>
    </nav>
  );
};

export default Nav;
