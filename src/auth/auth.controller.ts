import { Body, Controller, Post, ValidationPipe,UseGuards,Req} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service'; //importing AuthService in AuthController
import { AuthGuard} from '@nestjs/passport'
import { UserEntity } from './user.entity';
import {GetUser} from './get-user.decorator'

@Controller('auth')
export class AuthController {

  //taking up the AuthService thats imported and storing it in a private variable so that it strictly only available for this class or module
  constructor(private authService: AuthService){}
  //route and controller

  //signup
  @Post('/signup')
  signup(@Body(ValidationPipe) authCredentialsDto:AuthCredentialsDto):Promise<void>{
   console.log(authCredentialsDto) //this will console {username: adam,password:1234}
   return this.authService.signup(authCredentialsDto)
  }

  //login 
  @Post('/login')
  login(@Body(ValidationPipe) authCredentialsDto:AuthCredentialsDto):Promise<{accessToken:string}>{
   //console.log(authCredentialsDto) //this will console {username: adam,password:1234}
   return this.authService.login(authCredentialsDto)
  }

  //testing route
  /* @Post('/test')
  @UseGuards(AuthGuard())  
  //test(@Req() req) { // when @Req is used ,entire request object will show
  test(@GetUser() user: UserEntity) {  
    console.log(user,'user object from request object')
  } */


}
 