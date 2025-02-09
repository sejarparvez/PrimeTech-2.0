import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PopoverClose } from '@radix-ui/react-popover';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { COLORS, MORE_COLORS } from '../../constants/color';
import Icon from '../ui/Icon';
import ColorButton from './ColorButton';

interface ColorPickerProps {
  color: string;
  onChange?: (value: string) => void;
  onReset?: () => void;
}

const ColorPicker = (props: ColorPickerProps) => {
  const [activeTab, setActiveTab] = useState<'swatches' | 'custom'>('swatches');
  const [color, setColor] = useState(props.color);

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
      props.onChange?.(normalizeColor(color));
    }
  };

  const renderColorList = (colors: string[], label: string) => (
    <div>
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
    <div className="flex w-64 flex-col">
      <div className="-mx-1 flex border-b">
        {['swatches', 'custom'].map((tab) => (
          <Button
            key={tab}
            variant="ghost"
            data-active={activeTab === tab || undefined}
            onClick={() => setActiveTab(tab as 'swatches' | 'custom')}
            className={`relative w-full text-xs after:absolute after:right-[-2px] after:h-full after:w-[1px] after:border-l after:border-gray-300 ${
              activeTab === tab
                ? 'before:absolute before:bottom-[-0.5rem] before:left-[-0.5rem] before:h-[2px] before:w-full before:bg-blue-500 before:content-[""]'
                : ''
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>

      <div className="my-3 px-2">
        {activeTab === 'swatches' && (
          <div className="flex flex-col gap-[0.625rem]">
            {renderColorList(COLORS, 'Default Colors')}
            {renderColorList(MORE_COLORS, 'More Colors')}
          </div>
        )}

        {activeTab === 'custom' && (
          <div className="flex flex-col gap-[0.625rem]">
            <HexColorPicker
              className="w-full"
              color={color}
              onChange={handleColorChange}
            />
            <div className="flex items-center gap-2">
              <ColorButton color={color} tooltip={false} />
              <Input
                value={color!}
                className="uppercase"
                onChange={(e) => handleColorChange(e.target.value)}
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      <PopoverClose asChild>
        <div className="mb-2 mt-0.5 flex gap-2 px-2">
          <Button variant="secondary" size="icon" onClick={props.onReset}>
            <Icon name="PaletteOff" />
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
