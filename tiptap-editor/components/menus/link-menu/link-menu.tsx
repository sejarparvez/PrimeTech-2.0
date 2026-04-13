import { useCallback, useEffect, useState } from 'react';
import { useLink } from '../../../hooks/use-link';
import LinkEdit from './link-edit';
import LinkView from './link-view';

export const LinkMenu = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { link, setLink, unsetLink, closeMenu } = useLink();

  useEffect(() => {
    if (!link?.href) {
      setIsEditing(true);
    }
  }, [link]);

  const handleSubmit = useCallback(
    (url: string, text?: string, target?: string) => {
      if (!url.trim()) return;
      setLink(url.trim(), text?.trim(), target);
      setIsEditing(false);
    },
    [setLink],
  );

  const handleRemoveLink = useCallback(() => {
    unsetLink();
  }, [unsetLink]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    closeMenu();
  }, [closeMenu]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  return isEditing ? (
    <LinkEdit
      initialUrl={link?.href ?? ''}
      initialText={link?.text ?? ''}
      initialTarget={link?.target ?? ''}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  ) : link ? (
    <LinkView
      url={link.href}
      target={link.target}
      onEdit={handleEdit}
      onRemove={handleRemoveLink}
    />
  ) : null;
};

export default LinkMenu;
