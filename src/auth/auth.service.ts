import { MailerService } from './../mailer/mailer.service';
import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import { SigninDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ResetPassDto } from './dto/resetPass.dto';
import { ResetPassConfirmDto } from './dto/resetPassConfirm.dto';
import { DeleteUserDto } from './dto/deleteUser.dto.js';

@Injectable()
export class AuthService {


    private readonly secret = speakeasy.generateSecret({ length: 20 })

    constructor(
        private readonly prismaService: PrismaService,
        private readonly mailerService: MailerService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async signup(signupDto: SignupDto) {
        const prismaUser = this.prismaService.user

        const { email, password, username } = signupDto

        // verif si l'user n'existe pas deja
        const user = await prismaUser.findUnique({
            where: {
                email: email
            }
        })
        if (user) throw new ConflictException("user already exists")

        // hash le mot de passe
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        // enregistrer l'user dans la db
        const newUser = await prismaUser.create({
            data: {
                email: email,
                username: username,
                password: hashPassword,
            },
        })

        if (newUser) {
            // send mail de confirmation
            await this.mailerService.signupConfirm(email, username)
        } else {
            throw new BadRequestException("error to create user in database")
        }
        // return rep success
        return { data: "Success to sign up" }

    }

    async signin(signinDto: SigninDto) {

        //verif si l'user est deja existe
        const { email, password } = signinDto;

        const user = await this.prismaService.user.findUnique({
            where: {
                email: email
            }
        })

        if (!user) throw new NotFoundException("user not found")


        // compare le password
        const isMatch = await bcrypt.compare(password, user?.password);

        if (!isMatch) {
            throw new UnauthorizedException("incorrect password")
        }
        // retour un token jwt ??
        const payload = {
            sub: user.userId,
            email: user.email
        }
        return {
            access_token: this.jwtService.sign(payload, {
                expiresIn: "2h",
                secret: this.configService.get("SECRET_KEY")
            }),
            user: {
                username: user.username,
                email: user.email,
            }
        }
    }

    async resetPassDemand(resetPassDto: ResetPassDto) {
        const { email } = resetPassDto;

        const user = await this.prismaService.user.findUnique({
            where: {
                email: email
            }
        })

        if (!user) throw new NotFoundException("user not found")


        const token = speakeasy.totp({
            secret: this.secret.base32,
            encoding: 'base32',
            digits: 5,
            step: 60 * 15,
        })

        //renvoie vers formulaire front
        const url = "http://localhost:3000/auth/reset-password-confirm";
        await this.mailerService.sendResetPass(email, url, token)
        return {
            data: "Reset password mail has been send"
        }
    }

    async resetPassDemandConfirm(resetPassConfirmDto: ResetPassConfirmDto) {
        const { email, password, token } = resetPassConfirmDto;
        const user = await this.prismaService.user.findUnique({ where: { email: email } });
        if (!user) throw new NotFoundException("user not found");

        const isMatch = speakeasy.totp.verify({
            secret: this.secret.base32,
            token: token,
            encoding: 'base32',
            digits: 5,
            step: 60 * 15,
        })

        if (!isMatch) throw new UnauthorizedException("Invalid or expired token")

        // hash le mot de passe
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        await this.prismaService.user.update({
            where: { email: email },
            data: {
                password: hashPassword
            },
        })

        return { data: "Password updated" }
    }

    async deleteUser(userId: number, deleteUserDto: DeleteUserDto) {
        const { password } = deleteUserDto
        const user = await this.prismaService.user.findUnique({ where: { userId } });
        if (!user) throw new NotFoundException("user not found");

        // compare le deleteUserDto au password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException("incorrect password")
        }

        await this.prismaService.user.delete({
            where: {
                userId
            }
        })

        return { data: "user success deleted" }
    }
}
