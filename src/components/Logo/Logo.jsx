import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center gap-2 font-bold text-xl md:text-2xl lg:text-3xl">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4 md:w-6 md:h-6"
        >
          <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.5 1.5 0 00-.82 1.296v3.84a49.442 49.442 0 00-6.087-1.113.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
          <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282.75.75 0 01.231 1.337 49.558 49.558 0 00-9.902 3.912l-.003.002a.75.75 0 01-.707 0 50.41 50.41 0 00-2.56-1.119v2.379l.34.18a.75.75 0 01-.34 1.376l-.003-.001a49.487 49.487 0 00-6.088-1.113.75.75 0 01-.23-1.338 60.653 60.653 0 0110.35-2.913.75.75 0 01.6 0z" />
          <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.214.902.435 1.347.662a6.742 6.742 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
        </svg>
      </div>
      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Edusync
      </span>
    </div>
  );
};

export default Logo;
