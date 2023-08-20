import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import * as config from 'config';

const jwtConfig = config.get('jwt');

@Module({

  imports:[
    //typeOrm config for userRepository
    TypeOrmModule.forFeature([UserRepository]),
    //jwt config
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      }}),
    //passport config with jwt
    PassportModule.register({defaultStrategy:'jwt'})
  ],

  controllers: [AuthController ],

  providers: [AuthService,JwtStrategy ],

  //this JwtStrategy belongs to authModule as its provider but for importing or accessing anywhere outside of auth module such as task module( for AuthGuard()), we give as exports
  exports:[ JwtStrategy,PassportModule ],
})
export class AuthModule {}
