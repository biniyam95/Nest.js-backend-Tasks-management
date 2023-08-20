import {BaseEntity,Entity, PrimaryGeneratedColumn,Column, ManyToOne} from 'typeorm'
import { TaskStatus } from './task-status.enum'
import { UserEntity } from 'src/auth/user.entity'

@Entity()
export class TaskEntity extends BaseEntity{
 @PrimaryGeneratedColumn() //primary key, auto generated
  id:number // in entity , id is defined as number 

  @Column() 
  title:string

  @Column() 
  description:string

  @Column() 
  status:TaskStatus

  //relationship
  @ManyToOne(type=>UserEntity,user=>user.tasks,{eager:false})
  user:UserEntity

  @Column()
  userId:number 


} 