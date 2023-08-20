import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique,} from "typeorm";
import * as bcrypt from 'bcrypt'
import { TaskEntity } from "src/tasks/task.entity";



@Entity()
@Unique(['username'])
export class UserEntity extends BaseEntity{
  @PrimaryGeneratedColumn() 
  id:number 

  @Column()
  username:string 

  @Column()
  password:string

  @Column()
  salt:string

  @OneToMany(type=>TaskEntity,task=>task.user,{eager:true})
  tasks:TaskEntity[]

  //custom method
  async validatePassword(password:string): Promise<boolean>{
    const hashed= await bcrypt.hash(password,this.salt)
    return hashed===this.password
  }
}