import clsx from 'clsx';
import Tooltip from '../ui/Tooltip';

interface ColorButtonProps {
  color: string;
  active?: boolean;
  tooltip?: boolean;
  onClick?: (color: string) => void;
}

const ColorButton = ({
  color,
  tooltip = true,
  active,
  onClick,
}: ColorButtonProps) => {
  const content = (
    <button
      type="button"
      tabIndex={-1}
      data-active={active ? 'true' : undefined}
      className={clsx(
        'hover:scale-120 h-[1.25rem] min-w-[1.25rem] transform rounded border transition-transform duration-300 ease-in',
        active && 'shadow'
      )}
      style={{ background: color }}
      onClick={() => onClick?.(color)}
    />
  );
  return tooltip ? <Tooltip content={color}>{content}</Tooltip> : content;
};

export default ColorButton;
