'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PopoverClose } from '@radix-ui/react-popover';
import { PaletteIcon } from 'lucide-react';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { COLORS, MORE_COLORS } from '../../constants/color';
import ColorButton from './ColorButton';

interface ColorPickerProps {
  color: string;
  onChange?: (value: string) => void;
  onReset?: () => void;
}

const ColorPicker = ({
  color: initialColor,
  onChange,
  onReset,
}: ColorPickerProps) => {
  const [color, setColor] = useState(initialColor);

  const normalizeColor = (color: string): string => {
    const normalized = color.startsWith('#') ? color : `#${color}`;
    return normalized.length === 4
      ? `${normalized}${normalized.slice(1)}`
      : normalized;
  };

  const isColorEqual = (a: string, b: string): boolean =>
    normalizeColor(a).toUpperCase() === normalizeColor(b).toUpperCase();

  const handleColorChange = (color: string) => {
    setColor(color);
  };

  const handleApply = () => {
    const regex = /^#?[0-9A-F]{3,6}$/i;
    if (color && regex.test(color)) {
      onChange?.(normalizeColor(color));
    }
  };

  const renderColorList = (colors: string[], label: string) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {colors.map((item) => (
          <ColorButton
            key={item}
            active={isColorEqual(item, color)}
            color={item}
            onClick={() => handleColorChange(item)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-72 space-y-4 p-4">
      <Tabs defaultValue="swatches" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="swatches">Swatches</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>
        <TabsContent value="swatches" className="mt-4 space-y-4">
          {renderColorList(COLORS, 'Default Colors')}
          {renderColorList(MORE_COLORS, 'More Colors')}
        </TabsContent>
        <TabsContent value="custom" className="mt-4 space-y-4">
          <HexColorPicker
            color={color}
            onChange={handleColorChange}
            className="w-full"
          />
          <div className="flex items-center space-x-2">
            <ColorButton color={color} tooltip={false} />
            <Input
              value={color}
              className="uppercase"
              onChange={(e) => handleColorChange(e.target.value)}
              autoFocus
            />
          </div>
        </TabsContent>
      </Tabs>

      <PopoverClose asChild>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={onReset}>
            <PaletteIcon className="h-4 w-4" />
          </Button>
          <Button className="w-full" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </PopoverClose>
    </div>
  );
};

export default ColorPicker;
