import { UserEntity } from "src/auth/user.entity"
import { CreateTaskDto } from "./dto/create-task.dto"
import { GetTasksFilterDto } from "./dto/getTasks-filtered.dto"
import { TaskEntity } from "./task.entity"

import { EntityRepository, Repository } from "typeorm"
import { TaskStatus } from "./task-status.enum"
import { Logger } from '@nestjs/common';


@EntityRepository(TaskEntity)
export class TaskRepository extends Repository <TaskEntity> {
 
  //get all tasks 
  async getTasks(filterDto: GetTasksFilterDto, user:UserEntity): Promise<TaskEntity[]> {
   const {status,search} = filterDto
   const query = this.createQueryBuilder('task') 

   query.where('task.userId= :userId',{userId: user.id})

   //status and search filter
   if(status){
     query.andWhere('task.status = :status',{status:status})
   }
   if(search){
    query.andWhere('(task.title  LIKE :status OR task.description LIKE :search)',{search: `%${search}%` }) 
   }
   const allTasks = await query.getMany()
   return allTasks
  }

  //create new task
  async createNewTask(createTaskDto:CreateTaskDto ,user:UserEntity ) : Promise<TaskEntity> {
    const {title,description} = createTaskDto
    
    const newTask=new TaskEntity()
    
    newTask.title= title
    newTask.description= description
    newTask.status= TaskStatus.OPEN 
    newTask.user= user
    
    await newTask.save()
    delete newTask.user 
    
    //logger
    const logger = new Logger('createNewTask')
    logger.verbose(`new task created`)
    

    
    return newTask 
 }
}