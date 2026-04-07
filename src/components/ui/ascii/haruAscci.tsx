import React from 'react';
import HARU_ASCII from './haru.txt';
import MI_VISION from './mi-vision.txt'

interface haruProps {
  isDarkMode: boolean
}

const HaruAscii: React.FC<haruProps> = ({ isDarkMode }) => {
  return (
    <pre
      className={`font-mono text-[4px] max-md:text-[4px] leading-tight select-none whitespace-pre overflow-hidden grid self-center justify-center ${
        isDarkMode ? 'text-[#ff000076] max-md:text-[#ffffff61]' : 'text-black'
      }`}
      aria-hidden="true"
    >
      {HARU_ASCII}
    </pre>
  );
};

export default HaruAscii;
