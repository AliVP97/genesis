import Portal from 'components/modal/Portal';

export const WebPagePreview = ({ url, visible }: { url: string; visible: boolean }) => {
  return (
    <Portal visible={visible}>
      <div style={{ aspectRatio: '16 / 9' }}>
        <iframe src={url} title="گفتگوی آنلاین" width="100%" height="780" />
      </div>
    </Portal>
  );
};
