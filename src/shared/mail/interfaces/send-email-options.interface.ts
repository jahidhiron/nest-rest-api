import * as mailgun from 'mailgun-js';

export interface IBaseSendEmailOptions {
  to: string;
  subject: string;
  context?: Record<string, any>;
  text?: string;
  html?: string;
  from?: string;
  attachments?: mailgun.AttachmentData[];
}

interface INoTemplate {
  module?: undefined;
  template?: undefined;
}

interface IWithTemplate {
  module: string;
  template: string;
}

export type ISendEmailOptions = IBaseSendEmailOptions &
  (INoTemplate | IWithTemplate);
