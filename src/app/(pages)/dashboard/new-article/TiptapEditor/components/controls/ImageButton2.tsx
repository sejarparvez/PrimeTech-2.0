import Dialog from "@/app/(pages)/dashboard/new-article/TiptapEditor/components/ui/Dialog";
import useModal from "@/app/(pages)/dashboard/new-article/TiptapEditor/hooks/useModal";
import MediaLibrary from "@/app/(pages)/dashboard/new-article/TiptapEditor/components/MediaLibrary";
import { useEditorState } from "@tiptap/react";
import MenuButton from "../MenuButton";
import { useTiptapContext } from "../Provider";

const ImageButton = () => {
  const { editor } = useTiptapContext();
  const state = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        active: ctx.editor.isActive("image"),
        disabled: !ctx.editor.isEditable,
      };
    },
  });

  const { open, handleOpen, handleClose } = useModal();

  return (
    <>
      <MenuButton
        icon="Image"
        tooltip="Image"
        {...state}
        onClick={handleOpen}
      />
      <Dialog open={open} onOpenChange={handleClose}>
        <MediaLibrary
          onClose={handleClose}
          onInsert={(image) => {
            editor
              .chain()
              .focus()
              .insertImage({
                src: image.url,
                width: image.width,
                height: image.height,
              })
              .run();
            handleClose();
          }}
        />
      </Dialog>
    </>
  );
};

export default ImageButton;
