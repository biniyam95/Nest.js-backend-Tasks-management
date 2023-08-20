import { UserEntity } from "src/auth/user.entity"
import { CreateTaskDto } from "./dto/create-task.dto"
import { GetTasksFilterDto } from "./dto/getTasks-filtered.dto"
import { TaskEntity } from "./task.entity"

import { EntityRepository, Repository } from "typeorm"
import { TaskStatus } from "./task-status.enum"
import { Logger } from '@nestjs/common';


@EntityRepository(TaskEntity)
export class TaskRepository extends Repository <TaskEntity> {
 
  //get all tasks with or without filter. this is a custom method or function we are writing instead of findOne ,remove,delete, etc
  async getTasks(filterDto: GetTasksFilterDto, user:UserEntity): Promise<TaskEntity[]> {
   const {status,search} = filterDto
   const query = this.createQueryBuilder('task') //alias for our table 'task_entity' in db , we can use any alias

   //to fetch the tasks as per the user
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

  //create new task, this is the exact same thing from service.just took it from there and pasted here and called this function inside server
  async createNewTask(createTaskDto:CreateTaskDto ,user:UserEntity ) : Promise<TaskEntity> {
    const {title,description} = createTaskDto
    
    const newTask=new TaskEntity()
    
    newTask.title= title
    newTask.description= description
    newTask.status= TaskStatus.OPEN 
    newTask.user= user
    
    await newTask.save()
    delete newTask.user //newTask.user is already saved in the db. this deleting doesnt affect that. this only deletes this in the newTask returned from this function.
    
    //logger
    const logger = new Logger('createNewTask')
    logger.verbose(`new task created`)
    //console.log('new task created')
    //logger.verbose(`${JSON.stringify(newTask)} is the new task created`)


    
    return newTask 
 }
}