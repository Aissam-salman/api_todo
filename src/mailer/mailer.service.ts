import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';


@Injectable()
export class MailerService {
    private async transporter() {
        const testAccount = await nodemailer.createTestAccount()
        const transport = nodemailer.createTransport({
            host: "localhost",
            port: 1025,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            }
        })
        return transport
    }

    async signupConfirm(userMail: string, userName: string) {
        // send mail with defined transport object
        const info = (await this.transporter()).sendMail({
            from: '"Lamja TodoIst 👻" <lamja@todoist.fr>', // sender address
            to: userMail, // list of receivers
            subject: "Confirmation d'inscription - Success ✔", // Subject line
            html:
                ` <h1>Bienvenu chez Todoist ${userName}</h1>
                On t'attends pour de nouvelle tache : <a href="http://localhost:3000/1/todos/">http://localhost:3000/1/todos/</a>`, // html body
        });
    }

    async sendResetPass(userMail: string, urlForm: string, token: string) {
        // send mail with defined transport object
        const info = (await this.transporter()).sendMail({
            from: '"Lamja TodoIst 👻" <lamja@todoist.fr>', // sender address
            to: userMail, // list of receivers
            subject: "reset password demand", // Subject line
            html:
                ` <h1>Reset your password</h1>
                <div>Go here : <a href="${urlForm}">change your password</a></div>
                <p>Secret code: <strong>${token}</strong></p>
                `, // html body
        });
    }
}
