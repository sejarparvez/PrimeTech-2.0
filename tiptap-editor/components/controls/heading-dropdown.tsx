import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  HEADING_LEVELS,
  type HeadingType,
  useHeading,
} from '../../hooks/use-heading';
import { MenuButton } from '../menu-button';

const HeadingDropdown = () => {
  const { currentType, canToggle, toggleHeading } = useHeading();

  const options = [
    {
      value: 'paragraph',
      label: 'P',
      display: 'p',
    },
    ...HEADING_LEVELS.map((level) => ({
      value: `heading${level}`,
      label: `H ${level}`,
      display: `h${level}`,
    })),
  ] as { value: HeadingType; label: string; display: string }[];

  const currentLabel =
    options.find((item) => item.value === currentType)?.label || 'Headings';

  return (
    <MenuButton
      type='dropdown'
      text={currentLabel}
      tooltip='Headings'
      hideText={false}
      disabled={!canToggle}
      dropdownClass="w-40 [&_[data-heading='p']]:text-sm [&_[data-heading='h1']]:text-2xl [&_[data-heading='h1']]:font-bold [&_[data-heading='h2']]:text-xl [&_[data-heading='h2']]:font-bold [&_[data-heading='h3']]:text-lg [&_[data-heading='h3']]:font-bold [&_[data-heading='h4']]:text-base [&_[data-heading='h4']]:font-bold"
    >
      {options.map((item) => (
        <DropdownMenuItem
          key={item.value}
          data-active={item.value === currentType || undefined}
          data-heading={item.display}
          onSelect={() => toggleHeading(item.value)}
        >
          {item.label}
        </DropdownMenuItem>
      ))}
    </MenuButton>
  );
};

export default HeadingDropdown;
