import { useCallback } from 'react';
import { useCodeBlock } from '../../../hooks/use-code-block';
import { useCopyToClipboard } from '../../../hooks/use-copy-to-clipboard';
import { MenuButton } from '../../menu-button';
import { Toolbar, ToolbarDivider } from '../../ui/toolbar';
import { LanguageDropdown } from './language-dropdown';

export const CodeBlockMenu = () => {
  const { isCopied, copy } = useCopyToClipboard();
  const { language, setLanguage, deleteBlock, getContent } = useCodeBlock();

  const handleCopy = useCallback(() => {
    const content = getContent();
    if (content) {
      copy(content);
    }
  }, [copy, getContent]);

  return (
    <Toolbar>
      <LanguageDropdown value={language} onSelect={setLanguage} />
      <ToolbarDivider />
      <MenuButton
        icon={isCopied ? 'Check' : 'Clipboard'}
        onClick={handleCopy}
        tooltip='Copy code'
      />
      <MenuButton
        icon='Trash'
        tooltip='Delete code block'
        onClick={deleteBlock}
      />
    </Toolbar>
  );
};

export default CodeBlockMenu;
