import { CODE_BLOCK_LANGUAGUES } from '@/app/(pages)/dashboard/new-article/TiptapEditor/constants/code-languages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useMemo, useState } from 'react';
import { TbCheck, TbChevronDown } from 'react-icons/tb';
import { useTiptapContext } from '../../Provider';

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
    return options.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const selectedOption = options.find((item) => item.value === value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex min-w-[6rem] items-center justify-between"
        >
          <span>
            {selectedOption ? selectedOption.label : 'Select language'}
          </span>
          <TbChevronDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-2">
        <Input
          className="mb-2 h-9 w-full"
          placeholder="Search language..."
          value={search}
          onChange={(e) => setSearch(e.target.value.trim())}
        />
        <div
          className="flex flex-col gap-1 overflow-auto"
          style={{
            maxHeight: `${
              ((contentElement.current as HTMLElement)?.clientHeight || 0) *
              0.375
            }px`,
          }}
        >
          {filterOptions.map((item) => (
            <div
              key={item.value}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm leading-5 hover:bg-accent"
              onClick={() => {
                onSelect(item.value);
                setSearch('');
              }}
            >
              {item.value === value ? (
                <TbCheck size={14} className="text-primary" />
              ) : (
                <span className="w-4" />
              )}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CodeDropdown;
