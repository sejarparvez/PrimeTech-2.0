import React, { type CSSProperties, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { getShortcutKey } from '../helpers/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown';
import Icon, { type IconProps } from './ui/icon';
import Tooltip from './ui/tooltip';

type ShadcnButtonProps = React.ComponentPropsWithoutRef<typeof Button>;

interface MenuButtonProps extends Omit<ShadcnButtonProps, 'ref' | 'type'> {
  icon?: IconProps['name'];
  type?: 'button' | 'dropdown' | 'popover';
  buttonType?: ShadcnButtonProps['type'];
  text?: string;
  active?: boolean;
  shortcuts?: string[];
  hideText?: boolean;
  hideArrow?: boolean;
  tooltip?: string | boolean;
  buttonClass?: string;
  buttonStyle?: CSSProperties;
  dropdownClass?: string;
  dropdownStyle?: CSSProperties;
}

export const MenuButton = React.forwardRef<HTMLButtonElement, MenuButtonProps>(
  (
    {
      active,
      icon,
      text,
      shortcuts,
      className,
      children,
      type,
      buttonType = 'button',
      hideText = true,
      hideArrow = false,
      tooltip = true,
      buttonClass,
      buttonStyle,
      dropdownClass,
      dropdownStyle,
      disabled,
      ...props
    },
    ref,
  ) => {
    const hasArrowIcon =
      !hideArrow && (type === 'dropdown' || type === 'popover');
    const hasIconOnly = hideText && !hasArrowIcon;

    const tooltipContent = useMemo(() => {
      if (!tooltip) return null;
      const title = typeof tooltip === 'string' ? tooltip : text;
      const shortcut = shortcuts
        ? `${shortcuts.map(getShortcutKey).join(' + ')})`
        : '';
      return title ? `${title} ${shortcut}` : null;
    }, [tooltip, text, shortcuts]);

    const renderIcon = useMemo(
      () => (icon ? <Icon name={icon} className='rte-button-icon' /> : null),
      [icon],
    );

    const renderButton = (
      <Button
        ref={ref}
        type={buttonType}
        variant={active ? 'default' : 'ghost'}
        size={hasIconOnly ? 'icon' : 'default'}
        style={buttonStyle}
        onFocusCapture={(e) => e.stopPropagation()}
        data-active={active || undefined}
        aria-label={typeof tooltip === 'string' ? tooltip : text}
        disabled={disabled}
        {...props}
      >
        {!hasIconOnly && renderIcon}

        {hasIconOnly ? (
          renderIcon
        ) : !hideText && text ? (
          <span className='rte-button__text'>{text}</span>
        ) : null}

        {hasArrowIcon && (
          <span className='rte-icon-arrow'>
            <Icon name='ChevronDown' size={14} />
          </span>
        )}
      </Button>
    );

    const renderContent = tooltipContent ? (
      <Tooltip content={tooltipContent}>{renderButton}</Tooltip>
    ) : (
      renderButton
    );

    if (type === 'dropdown') {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>{renderContent}</DropdownMenuTrigger>
          <DropdownMenuContent
            className={dropdownClass}
            style={dropdownStyle}
            avoidCollisions={false}
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            {children}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    if (type === 'popover') {
      return (
        <Popover>
          <PopoverTrigger asChild>{renderContent}</PopoverTrigger>
          <PopoverContent
            className={dropdownClass}
            style={dropdownStyle}
            avoidCollisions={false}
            onCloseAutoFocus={(e) => e.preventDefault()}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            {children}
          </PopoverContent>
        </Popover>
      );
    }

    return renderContent;
  },
);

MenuButton.displayName = 'MenuButton';
export default MenuButton;
