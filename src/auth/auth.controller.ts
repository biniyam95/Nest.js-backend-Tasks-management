import { Body, Controller, Post, ValidationPipe,UseGuards,Req} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service'; //importing AuthService in AuthController
import { AuthGuard} from '@nestjs/passport'
import { UserEntity } from './user.entity';
import {GetUser} from './get-user.decorator'

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService){}

  //signup
  @Post('/signup')
  signup(@Body(ValidationPipe) authCredentialsDto:AuthCredentialsDto):Promise<void>{
   console.log(authCredentialsDto) 
   return this.authService.signup(authCredentialsDto)
  }

  //login 
  @Post('/login')
  login(@Body(ValidationPipe) authCredentialsDto:AuthCredentialsDto):Promise<{accessToken:string}>{
   return this.authService.login(authCredentialsDto)
  }

}
 