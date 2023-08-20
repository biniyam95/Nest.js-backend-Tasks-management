import {PassportStrategy} from '@nestjs/passport'
import {Strategy,ExtractJwt} from 'passport-jwt'
import { JwtPayload } from './jwt-payload.interface'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRepository } from './user.repository'
import { UserEntity } from './user.entity'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as config from 'config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ){
    super({
       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),//extracts jwt from request's bearer token
       secretOrKey: config.get('jwt.secret'),
    })
  }

  //strategy validation
  async validate(payload:JwtPayload):Promise<UserEntity>{
    const {username}=payload
    const user= await this.userRepository.findOne({username})
    
    if(!user){
      throw new UnauthorizedException()
    }

    return user
  }
}