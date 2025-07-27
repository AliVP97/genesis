export type TrainVerifyCaptchaRequestBody = {
  captchaToken: string;
};

export type TrainVerifyCaptchResponse = {
  success: boolean;
  message: string;
};
