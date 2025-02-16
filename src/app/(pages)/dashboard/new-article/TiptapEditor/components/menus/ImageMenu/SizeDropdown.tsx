'use client';

import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { TbRuler } from 'react-icons/tb';

interface SizeDropdownProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

const SizeDropdown: React.FC<SizeDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const options = [null, 25, 50, 75, 100];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: number | null) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        className="space-x-1.5"
        size="sm"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <TbRuler size={20} />
        <span>{value ? `${value}%` : 'Default'}</span>
        <ChevronDown size={20} />
      </Button>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-40 rounded-md bg-popover shadow-lg">
          <div className="py-1">
            {options.map((option, index) => (
              <Button
                variant="ghost"
                key={index}
                className="block w-full text-left"
                type="button"
                onClick={() => handleOptionClick(option)}
              >
                {option ? `${option}% width` : 'Default'}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeDropdown;
