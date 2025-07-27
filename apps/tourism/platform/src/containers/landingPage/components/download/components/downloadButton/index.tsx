import { AndroidIcon, DirectDownloadBlueIcon, IosIcon, PWAIcon } from 'assets/icons';
import Modal from 'components/modal';
import {
  androidDownloadInfo,
  DIRECT_DOWNLOAD,
  iosDownloadInfo,
  PWA_ACCESS_ADDRESS,
} from 'containers/landingPage/data';
import { IDownloadInformation } from 'containers/landingPage/types';

import { useState } from 'react';
import DownloadApplication from '../downloadModal';

const DownloadButton = () => {
  const [download, setDownload] = useState<boolean>(false);
  const [info, setInfo] = useState<IDownloadInformation>();

  const handleDownloadModal = (info: IDownloadInformation) => {
    setDownload(true);
    setInfo(info);
  };
  return (
    <>
      <div className="w-100">
        <div className="d-flex flex-nowrap gap-2">
          <button
            onClick={() => handleDownloadModal(iosDownloadInfo)}
            type="button"
            className="color-primary fs-2 fw-normal  w-50 text-center "
          >
            <IosIcon />
            <span className="pe-2">دانلود نسخه iOS</span>
          </button>
          <button
            type="button"
            className="color-primary fs-2 fw-normal lh-1 w-50 text-center "
            onClick={() => handleDownloadModal(androidDownloadInfo)}
          >
            <AndroidIcon />
            <span className="pe-2 ">دانلود نسخه اندروید</span>
          </button>
        </div>
        <div className="d-flex flex-nowrap gap-2 lh-1">
          <a href={DIRECT_DOWNLOAD} target="_blank" rel="noreferrer" className="w-50">
            <button className="color-primary w-100 h-75 fs-2 fw-normal text-center">
              <DirectDownloadBlueIcon />
              <span className="pe-2">دانلود از لینک مستقیم</span>
            </button>
          </a>
          <a href={PWA_ACCESS_ADDRESS} target="_blank" rel="noreferrer" className="w-50">
            <button className="color-primary w-100 h-75 fs-2 fw-normal text-center">
              <PWAIcon />
              <span className="pe-2">دانلود نسخه وب</span>
            </button>
          </a>
        </div>
      </div>
      <Modal onClose={() => setDownload(false)} visible={download}>
        <DownloadApplication
          close={() => setDownload(false)}
          buttons={info?.downloadBtns}
          title={info?.title}
        />
      </Modal>
    </>
  );
};

export default DownloadButton;
