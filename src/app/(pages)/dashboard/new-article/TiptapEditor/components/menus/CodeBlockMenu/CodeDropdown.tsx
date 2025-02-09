import { CODE_BLOCK_LANGUAGUES } from '@/app/(pages)/dashboard/new-article/TiptapEditor/constants/code-languages';
import { Input } from '@/components/ui/input';
import { Popover } from '@/components/ui/popover';
import { useMemo, useState } from 'react';
import MenuButton from '../../MenuButton';
import { useTiptapContext } from '../../Provider';
import Icon from '../../ui/Icon';

interface CodeDropdownProps {
  value: string;
  onSelect: (value: string) => void;
}

const CodeDropdown = ({ value, onSelect }: CodeDropdownProps) => {
  const { contentElement } = useTiptapContext();
  const [search, setSearch] = useState('');

  const options = CODE_BLOCK_LANGUAGUES.map((item) => ({
    label: item.label,
    value: item.syntax,
  }));
  const filterOptions = useMemo(() => {
    if (!search) return options;
    return options.filter((item) => item.label.includes(search));
  }, [options, search]);

  return (
    <MenuButton
      type="popover"
      text={options.find((item) => item.value === value)?.label}
      hideText={false}
      tooltip={false}
      buttonStyle={{ minWidth: '6rem' }}
      dropdownClass="flex flex-col gap-2 p-2"
      dropdownStyle={{
        minWidth: '10rem',
      }}
    >
      <Input
        className="h-9 w-40"
        placeholder="Search language..."
        value={search}
        onChange={(e) => setSearch(e.target.value.trim())}
      />
      <div
        className="flex flex-col gap-1 overflow-auto"
        style={{
          maxHeight: `${((contentElement.current as HTMLElement)?.clientHeight || 0) * 0.375}px`,
        }}
      >
        {filterOptions.map((item) => (
          <Popover key={item.value}>
            <div
              className="relative flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 pl-7 text-sm leading-5 hover:bg-accent"
              onClick={() => {
                onSelect(item.value);
                setSearch('');
              }}
            >
              {item.label}
              {item.value === value && (
                <Icon
                  name="Check"
                  className="absolute left-1.5"
                  size={14}
                  strokeWidth={2.5}
                />
              )}
            </div>
          </Popover>
        ))}
      </div>
    </MenuButton>
  );
};

export default CodeDropdown;
