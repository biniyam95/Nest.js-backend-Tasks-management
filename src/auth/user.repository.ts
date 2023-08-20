import { EntityRepository, Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt'


@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity>{

  //signup
  async signupHelper(authCredentialsDto:AuthCredentialsDto):Promise<void>{
    const {username,password} =authCredentialsDto

    const newUser=new UserEntity()
    newUser.username=username
    newUser.salt=await bcrypt.genSalt() 
    newUser.password=await this.hashPassword(password,newUser.salt)
    
    try { 
      await newUser.save()
      
    } catch (error) {
      if(error.code ==='23505'){
        throw new ConflictException('Username already exists')
      }
      else{
        throw new InternalServerErrorException()
      }

    }


  }

  async validateUserPassword(authCredentialsDto:AuthCredentialsDto):Promise<string>{
    const {username, password} = authCredentialsDto
    
    const user=await this.findOne({username})

    if(user&& await user.validatePassword(password)){
      return user.username  
    }
    else{
      return null
    }

}

  private async hashPassword(password:string,salt:string): Promise<string>{
    return bcrypt.hash(password,salt)
  }
}