import React, { useState, useEffect, useRef } from 'react';

interface AlphabetFilterProps {
  selectedLetter: string;
  onSelect: (letter: string) => void;
}

const letters: string[] = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);

const AlphabetFilter: React.FC<AlphabetFilterProps> = ({
  selectedLetter,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const [lastClicked, setLastClicked] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setOpen((prev) => !prev);

  const handleClick = (letter: string) => {
    if (letter === selectedLetter && lastClicked === letter) {
      onSelect('');
    } else {
      onSelect(letter);
    }
    setLastClicked(letter);
    setOpen(false); // auto-close after selection
  };

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 border rounded  shadow text-sm"
      >
        {selectedLetter || 'Filter by Alphabet'}
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-64 bg-white border rounded shadow p-3 max-h-64 overflow-y-auto grid grid-cols-5 gap-2">
          {letters.map((letter) => (
            <button
              key={letter}
              onClick={() => handleClick(letter)}
              className={`px-3 py-1 rounded border text-sm font-medium ${
                selectedLetter === letter
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-black border-gray-300'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlphabetFilter;
