import nodemailer from 'nodemailer'

class MailService {
  constructor() {
    const port = parseInt(process.env.SMTP_PORT, 10)
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      requireTLS: port === 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000
    })
  }

  async sendActivationMail(to, link) {
    if (process.env.SKIP_MAIL === 'true') {
      console.log('[MailService] SKIP_MAIL: ссылка активации (скопируйте в браузер):', link)
      return
    }

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: 'Активация аккаунта на ' + process.env.API_URL,
        text: `Для активации перейдите по ссылке ${link}`,
        html: `
          <div>
            <h1>Для активации перейдите по ссылке</h1>
            <a href="${link}">${link}</a>
          </div>
        `
      })
    } catch (err) {
      console.error('[MailService] Не удалось отправить письмо:', err.message)
      console.log('[MailService] Ссылка активации (скопируйте в браузер):', link)
    }
  }
}

export default new MailService()
