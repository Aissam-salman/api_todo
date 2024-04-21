import { Body, Controller, Delete, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { SignupDto } from "./dto/signup.dto.js";
import { SigninDto } from "./dto/signin.dto.js";
import { ResetPassDto } from "./dto/resetPass.dto.js";
import { ResetPassConfirmDto } from "./dto/resetPassConfirm.dto.js";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { DeleteUserDto } from "./dto/deleteUser.dto.js";


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('signup')
    signup(@Body() signupDto: SignupDto): any {
        return this.authService.signup(signupDto);
    }

    @Post('signin')
    signin(@Body() signinDto: SigninDto) {
        return this.authService.signin(signinDto);
    }

    @Post('reset-pass')
    resetPassDemand(@Body() resetPassDto: ResetPassDto) {
        return this.authService.resetPassDemand(resetPassDto);
    }

    @Post('reset-pass-confirm')
    resetPassDemandConfirm(@Body() resetPassConfirmDto: ResetPassConfirmDto) {
        return this.authService.resetPassDemandConfirm(resetPassConfirmDto);
    }

    // FIX: this problem
    @UseGuards(AuthGuard("jwt"))
    @Delete("delete")
    deleteUser(@Req() request: Request, @Body() deleteUserDto: DeleteUserDto) {
        const userId = request.user["userId"];
        return this.authService.deleteUser(userId, deleteUserDto);
    }

}

/**
 * Routes pour les utilisateurs :

    POST /auth/signup: Pour permettre aux utilisateurs de s'inscrire.
    POST /auth/signin: Pour permettre aux utilisateurs de se connecter.
    POST /auth/delete: Pour permettre aux utilisateurs de supprimer leur compte
    POST /auth/reset-pass: Permet aux utilisateurs de demander le reset de leur mot de passe (envoie d'un mail de confirmation avec un code et url)
    POST /auth/reset-pass-confirm: Permet aux utilisateurs de changer leur mot de passe (envoie d'un mail de confirmation avec un code)

    //TODO:
    GET /auth/profile: Pour récupérer les informations du profil de l'utilisateur connecté.
    POST /auth/logout: Pour permettre aux utilisateurs de se déconnecter.
*/