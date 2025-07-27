import { RefObject, useState } from 'react';

import { takeScreenShot } from 'utils/helpers/takeScreenshot';
import { downloadFromLink } from 'utils/helpers/downloadFromLink';
import { shareBlob } from 'utils/helpers/shareBlob';
import { notify } from 'utils/notification';

const screenshotConfig = { windowWidth: 400, width: 400 };

export const useShareButtons = (ref?: RefObject<HTMLElement>, fileName = 'image.png') => {
  const [shareLoading, setShareLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [showLogo, setShowLogo] = useState(false);

  const handleShare = async (title?: string, text?: string) => {
    try {
      if (!ref) {
        throw new Error('You should provide correct html node');
      }

      setShowLogo(true);
      setShareLoading(true);

      const dataUrl = (await takeScreenShot(ref, screenshotConfig))?.toDataURL('image/png');

      if (dataUrl) {
        const blob = await (await fetch(dataUrl)).blob();

        shareBlob(blob, fileName, title, text);
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== 'AbortError') {
        notify({
          type: 'error',
          message: error.message || 'مشکلی پیش آمده است',
        });
      }
    } finally {
      setShowLogo(false);
      setShareLoading(false);
    }
  };

  const handleDownloadImage = async () => {
    try {
      if (!ref) {
        throw new Error('You should provide correct html node');
      }

      setShowLogo(true);
      setDownloadLoading(true);

      const dataURL = (await takeScreenShot(ref, screenshotConfig))?.toDataURL('image/png');

      if (dataURL) {
        downloadFromLink({ href: dataURL, download: fileName });
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== 'AbortError') {
        notify({
          type: 'error',
          message: error.message || 'مشکلی پیش آمده است',
        });
      }
    } finally {
      setDownloadLoading(false);
      setShowLogo(false);
    }
  };

  return {
    handleShare,
    handleDownloadImage,
    shareLoading,
    downloadLoading,
    showLogo,
  };
};
