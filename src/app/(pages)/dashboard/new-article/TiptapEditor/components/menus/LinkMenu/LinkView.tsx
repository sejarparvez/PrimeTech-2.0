import useCopyToClipboard from '../../../hooks/useCopyToClipboard';
import MenuButton from '../../MenuButton';

interface LinkViewProps {
  url: string;
  onEdit?: () => void;
  onRemove?: () => void;
}

const LinkView = ({ url, onEdit, onRemove }: LinkViewProps) => {
  const { copy, isCopied } = useCopyToClipboard();

  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 p-1.5">
      <MenuButton text="Edit link" hideText={false} onClick={onEdit} />
      <MenuButton
        icon="ExternalLink"
        text="Open in new tab"
        onClick={() => window.open(url, '_blank')}
      />
      <MenuButton
        icon={isCopied ? 'Check' : 'Clipboard'}
        text={isCopied ? 'Copied' : 'Copy link'}
        onClick={() => copy(url)}
      />
      <MenuButton icon="Unlink" text="Remove link" onClick={onRemove} />
    </div>
  );
};

export default LinkView;
