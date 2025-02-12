import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  TbCheck,
  TbCopy,
  TbEdit,
  TbExternalLink,
  TbLinkOff,
} from 'react-icons/tb';
import useCopyToClipboard from '../../../hooks/useCopyToClipboard';

interface LinkViewProps {
  url: string;
  onEdit?: () => void;
  onRemove?: () => void;
}

const LinkView = ({ url, onEdit, onRemove }: LinkViewProps) => {
  const { copy, isCopied } = useCopyToClipboard();

  const handleOpenNewTab = () => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 p-1.5">
        {onEdit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                size="icon"
                onClick={onEdit}
              >
                <TbEdit size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit link</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              type="button"
              size="icon"
              onClick={handleOpenNewTab}
            >
              <TbExternalLink size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Open in new tab</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              type="button"
              size="icon"
              onClick={() => copy(url)}
            >
              {isCopied ? <TbCheck size={20} /> : <TbCopy size={20} />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isCopied ? 'Copied' : 'Copy link'}</TooltipContent>
        </Tooltip>

        {onRemove && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                size="icon"
                onClick={onRemove}
              >
                <TbLinkOff size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Unlink</TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};

export default LinkView;
