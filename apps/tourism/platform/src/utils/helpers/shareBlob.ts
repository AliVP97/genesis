export const shareBlob = async (blob: Blob, fileName: string, title?: string, text?: string) => {
  const file = new File([blob!], fileName, {
    type: blob.type,
  });

  const shareData: ShareData = {
    title,
    text,
    files: [file],
  };

  if (!navigator.canShare?.(shareData)) {
    throw new Error('این قابلیت با دستگاه شما سازگار نیست');
  }

  await navigator.share(shareData);
};
