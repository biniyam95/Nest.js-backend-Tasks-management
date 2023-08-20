import { Injectable,UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService} from '@nestjs/jwt'
import { JwtPayload } from './jwt-payload.interface';
import { Logger } from '@nestjs/common';


@Injectable()
export class AuthService {
  constructor ( 
    @InjectRepository(UserRepository)
    private userRepository:UserRepository,
    private jwtService:JwtService ){}
   
    //logger
    private logger= new Logger('AuthService')
  
    //signup
  async signup(authCredentialsDto:AuthCredentialsDto):Promise<void>{
    return this.userRepository.signupHelper(authCredentialsDto)
  }

  //login
  async login(authCredentialsDto:AuthCredentialsDto):Promise<{accessToken:string}>{
   const username = await this.userRepository.validateUserPassword(authCredentialsDto)
   
   if(!username){
    throw new UnauthorizedException('Invalid credentials')
   }

   const payload:JwtPayload= {username}
   const accessToken=await this.jwtService.sign(payload)

   this.logger.debug('jwt token generated')
   

   return {accessToken} 
  }


}
