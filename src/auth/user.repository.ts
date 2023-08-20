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
    
    /* const newUser=new UserEntity()
    newUser.username=username
    newUser.password=password */

    const newUser=new UserEntity()
    newUser.username=username
    newUser.salt=await bcrypt.genSalt() 
    newUser.password=await this.hashPassword(password,newUser.salt)

    //console.log(newUser.salt,'salt generated for the new user')
    //console.log(newUser.password,'password hashed')
    

    //since saving is the final step of saving the data onto db after its created,when we find some problems like validationError or smth, we need to do it here. also because this thing waits till everything is clear and ok, only after all those will this execute. 
    //so when some error occurs , that will throw and wont reach this step. it will happen before this.
    //thats why its a good place to check if there is any problem let this step handle the problem.
    //this place specifically deals with success and failure of the action
    try { 
      //if everything is ok, save it
      await newUser.save()
      
    } catch (error) {
      //if error was encountered, this wants to know what type of error it was , and it will bubble up here. if this is not defined ,it will bubble up further to nestjs and nestjs will declare it internal server error
      if(error.code ==='23505'){//duplicate username errorcode
        throw new ConflictException('Username already exists')//throws 409 conflict error
      }
      else{
        throw new InternalServerErrorException()
      }

    }


  }

  //validate the password entered by the user
  async validateUserPassword(authCredentialsDto:AuthCredentialsDto):Promise<string>{
    const {username, password} = authCredentialsDto
    
    //checking if user exists
    const user=await this.findOne({username})

    //if user exists,then checks if his password is true which a custom method return as true or false
    if(user&& await user.validatePassword(password)){
      return user.username // if the validation is true ,this is gonna return username 
    }
    else{
      return null
    }

}



  //encrypt the password with the salt
  private async hashPassword(password:string,salt:string): Promise<string>{
    return bcrypt.hash(password,salt)
  }
}