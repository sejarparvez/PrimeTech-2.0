import { type CSSProperties, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useMount from '../../hooks/use-mount';
import { useTextStyle } from '../../hooks/use-text-style';
import ColorPicker from '../color-picker';
import { MenuButton } from '../menu-button';

const CompactColorPopover = () => {
  const [activeTab, setActiveTab] = useState<'text' | 'highlight'>('text');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mounted = useMount();

  const textStyle = useTextStyle('color');
  const bgStyle = useTextStyle('backgroundColor');

  const isActive = textStyle.currentValue || bgStyle.currentValue;

  const colorBarStyle: CSSProperties = {
    position: 'absolute',
    bottom: 1.5,
    insetInline: 4,
    height: 4,
    borderRadius: 4,
    pointerEvents: 'none',
    background: `linear-gradient(90deg, ${textStyle.currentValue || 'var(--rte-fg, black)'} 50%, ${bgStyle.currentValue || 'var(--rte-bg, white)'} 50%)`,
  };

  const renderBar =
    mounted && buttonRef.current
      ? createPortal(<div style={colorBarStyle} />, buttonRef.current)
      : null;

  return (
    <>
      <MenuButton
        ref={buttonRef}
        type='popover'
        icon='Palette'
        tooltip='Colors'
        active={isActive}
        hideArrow
      >
        <div className='w-full'>
          <div className='flex border-b'>
            <button
              type='button'
              className={`flex-1 px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'text'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('text')}
            >
              Text
            </button>
            <button
              type='button'
              className={`flex-1 px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'highlight'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('highlight')}
            >
              Highlight
            </button>
          </div>
          {activeTab === 'text' && (
            <ColorPicker
              color={textStyle.currentValue || 'DEFAULT'}
              onChange={(color) => textStyle.setValue(color)}
              onReset={() => textStyle.unsetValue()}
            />
          )}
          {activeTab === 'highlight' && (
            <ColorPicker
              color={bgStyle.currentValue || 'DEFAULT'}
              onChange={(color) => bgStyle.setValue(color)}
              onReset={() => bgStyle.unsetValue()}
            />
          )}
        </div>
      </MenuButton>
      {renderBar}
    </>
  );
};

export default CompactColorPopover;
