/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import * as mailgun from 'mailgun-js';
import { Mailgun as MailgunClient, messages } from 'mailgun-js';
import { ConfigService } from '@/config';
import { AppLogger } from '@/common';
import { ISendEmailOptions } from './interfaces';

@Injectable()
export class MailgunService {
  private readonly mailgun: MailgunClient;
  private readonly templatesBaseDir: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: AppLogger,
  ) {
    const mail = this.configService.mail;

    const mailgunOptions: mailgun.ConstructorParams = {
      apiKey: mail.mailgunApiKey,
      domain: mail.mailgunDomain,
    };

    this.mailgun = mailgun(mailgunOptions);

    const baseDir = process.cwd();
    const distDir = path.join(baseDir, 'dist');
    const srcDir = path.join(baseDir, 'src');

    this.templatesBaseDir = fs.existsSync(distDir) ? distDir : srcDir;
  }

  private findModulePath(moduleName: string): string | null {
    try {
      const searchDir = (dirPath: string): string | null => {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });

        for (const entry of entries) {
          if (entry.isDirectory()) {
            const fullPath = path.join(dirPath, entry.name);

            if (entry.name.toLowerCase() === moduleName.toLowerCase()) {
              return fullPath;
            }

            const nestedResult = searchDir(fullPath);
            if (nestedResult) {
              return nestedResult;
            }
          }
        }

        return null;
      };

      return searchDir(this.templatesBaseDir);
    } catch (error) {
      this.logger.error(
        `Error scanning for module path: ${(error as Error).message}`,
      );
      return null;
    }
  }

  private compileTemplate(
    templatePath: string,
    context: Record<string, any>,
  ): string {
    try {
      const source = fs.readFileSync(templatePath, 'utf-8');
      const template = Handlebars.compile(source);
      return template(context) as string;
    } catch (error) {
      this.logger.error(
        `Template compilation error: ${(error as Error).message}`,
      );
      throw new Error('Failed to compile email template');
    }
  }

  async sendEmail(options: ISendEmailOptions): Promise<void> {
    try {
      const from = options.from || this.configService.mail.mailgunSenderEmail;

      if (!options.to || !options.subject) {
        throw new Error('Email must include both "to" and "subject" fields');
      }

      let htmlContent = options.html;
      if (options.template && options.module) {
        const modulePath = this.findModulePath(options.module);
        if (!modulePath) {
          throw new Error(
            `Module folder named "${options.module}" not found under ${this.templatesBaseDir}`,
          );
        }

        const templateDir = path.join(modulePath, 'templates', 'emails');
        const templatePath = path.join(templateDir, `${options.template}.hbs`);

        if (!fs.existsSync(templatePath)) {
          throw new Error(`Template file not found: ${templatePath}`);
        }

        htmlContent = this.compileTemplate(templatePath, options.context || {});
      }

      if (!htmlContent && !options.text) {
        throw new Error(
          'Either "text", "html", or "templateName" must be provided',
        );
      }

      const message: messages.SendData = {
        from,
        to: options.to,
        subject: options.subject,
        html: htmlContent,
        text: options.text,
        attachment: options.attachments || [],
      };

      try {
        await this.mailgun.messages().send(message);
        this.logger.log(`Email sent to ${options.to}: ${options.subject}`);
      } catch (error) {
        this.logger.error(
          `Failed to send email: ${(error as Error).message}`,
          error as string,
        );
        throw error;
      }
    } catch (error) {
      this.logger.error(`sendEmail error: ${(error as Error).message}`);
      // Optionally rethrow or handle the error here
    }
  }
}
