import Modal from 'components/modal';
import classNames from 'classnames';
import styles from './report.module.scss';
import Button from 'components/button';
import { THotelImageReportTypeTitles } from 'services/hotel/report';
import { CloseIcon } from 'assets/icons';
import { Device } from 'utils/interface';
import { useEffect, useState } from 'react';

export const ReportModal = ({
  cover,
  device,
  openReportModal,
  setOpenReportModal,
  reportTypes,
  reportType,
  setFormData,
  handleSubmitReportImage,
}: {
  cover: string;
  device: Device;
  reportType: string;
  openReportModal: boolean;
  setOpenReportModal: (s: boolean) => void;
  reportTypes: THotelImageReportTypeTitles;
  handleSubmitReportImage: () => void;
  setFormData: React.Dispatch<
    React.SetStateAction<{
      reportType?: string;
      description?: string;
      imageUrl?: string;
    }>
  >;
}) => {
  const [formConfirmation, setFormConfirmation] = useState({
    submit: true,
    textInput: false,
  });
  useEffect(() => {
    if (reportType === 'IMAGE_REPORT_TYPE_OTHER') {
      setFormConfirmation({
        submit: true,
        textInput: true,
      });
    } else {
      setFormConfirmation({
        submit: false,
        textInput: false,
      });
    }
  }, [reportType]);

  return (
    <Modal className="d-flex justify-content-center align-items-center" visible={openReportModal}>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={classNames(device !== 'desktop' ? styles.modal : styles['desktop-modal'])}
      >
        {device !== 'desktop' ? (
          <div
            onClick={() => {
              setOpenReportModal(false);
            }}
            className="right mb-3 w-100"
            style={{ textAlign: 'right' }}
          >
            گزارش مشکل تصویر
            <CloseIcon style={{ marginLeft: 18 }} />
          </div>
        ) : (
          <div className="right mb-3" style={{ textAlign: 'right' }}>
            گزارش مشکل تصویر
          </div>
        )}
        <img className={styles['cover-image']} width={100} src={cover} alt="Hotel" />
        <div className="mt-4 fw-light text-justify" dir="rtl" style={{ textAlign: 'right' }}>
          کاربر گرامی، در صورت مشاهده هرگونه ایراد یا مغایرت در تصاویر بارگذاری‌شده هتل‌ها، لطفاً با
          استفاده از گزینه‌های موجود، ما را از این موضوع مطلع کنید.
        </div>
        <div className="d-flex w-100 h-100 flex-column justify-content-between align-items-center mt-4">
          <div className="w-100">
            <div className="d-flex w-100 flex-column gap-3 justify-content-start align-items-end mt-4">
              {reportTypes?.reportType?.map((label, index) => (
                <div
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      reportType: String(label?.type),
                    }));
                  }}
                  key={index}
                >
                  <span className="right m-3 fw-light">{label?.title}</span>
                  <input
                    checked={label?.type === reportType}
                    className="form-check-input"
                    type="radio"
                    style={{ padding: 12 }}
                  />
                </div>
              ))}
            </div>

            {formConfirmation.textInput && (
              <>
                <textarea
                  style={{ minHeight: 120 }}
                  disabled={!formConfirmation.textInput}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                      imageUrl: cover,
                    }));
                    if (e.target.value?.length >= 1) {
                      setFormConfirmation({
                        submit: false,
                        textInput: true,
                      });
                    } else {
                      setFormConfirmation({
                        submit: true,
                        textInput: true,
                      });
                    }
                  }}
                  maxLength={100}
                  dir="rtl"
                  placeholder="توضیح دهید"
                  className={classNames('w-100 mt-4', styles['text-area-filed'])}
                />
                <p className="fw-light w-100 mt-2" dir="rtl">
                  100 کاراکتر
                </p>
              </>
            )}
          </div>

          <div className="w-100">
            {device !== 'desktop' ? (
              <Button
                onClick={() => {
                  handleSubmitReportImage();
                }}
                disabled={formConfirmation.submit}
                style={{ borderRadius: 12 }}
                className={classNames([
                  formConfirmation.submit
                    ? 'bg-gray text-disabled w-100 mt-5'
                    : [
                        'bg-primary text-white w-100',
                        !formConfirmation.textInput && styles['mt-75p'],
                      ],
                  [formConfirmation.textInput ?? styles['mt-25p']],
                ])}
              >
                تایید و ارسال
              </Button>
            ) : (
              <div className="d-flex gap-3 mt-1">
                <Button
                  onClick={() => {
                    handleSubmitReportImage();
                  }}
                  style={{ borderRadius: 12 }}
                  className={classNames(
                    formConfirmation.submit ? 'bg-gray text-disabled' : 'bg-primary text-white',
                  )}
                  disabled={formConfirmation.submit}
                >
                  تایید و ارسال
                </Button>
                <Button
                  onClick={() => {
                    setOpenReportModal(false);
                    setFormData((prev) => ({
                      ...prev,
                      reportType: 'IMAGE_REPORT_TYPE_UNREAL',
                      description: '',
                      imageUrl: '',
                    }));
                  }}
                  className="text-primary bg-white"
                >
                  انصراف
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
