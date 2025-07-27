import { notify } from 'utils/notification';

type TOnCopy = (text: string) => Promise<boolean>;

export const useCopyToClipboard = (): {
  onCopy: TOnCopy;
} => {
  const onCopy: TOnCopy = async (text) => {
    if (!navigator?.clipboard) {
      notify({ type: 'error', message: 'Clipboard not supported' });
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      notify({ type: 'success', message: ' ' + 'کپی شد' });
      return true;
    } catch (error) {
      return false;
    }
  };

  return { onCopy };
};
