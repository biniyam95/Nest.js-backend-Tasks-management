  import { Injectable,NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/getTasks-filtered.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { UserEntity } from 'src/auth/user.entity';
//business logic is done here
//the helper functions that interact with the db.
//services are classes that are inherited to all other modules like controller module 
@Injectable()
export class TasksService {
  
   constructor (
      @InjectRepository(TaskRepository)
      private taskRepository:TaskRepository){}

      //create or add task
     /*  async createTask(createTaskDto:CreateTaskDto,user:UserEntity) : Promise<TaskEntity> {
         const {title,description} = createTaskDto
         
         const newTask=new TaskEntity()
         
         newTask.title= title
         newTask.description= description
         newTask.status= TaskStatus.OPEN 
         await newTask.save()
         
         return newTask 
      } */
      async createTask(createTaskDto:CreateTaskDto ,user:UserEntity ): Promise<TaskEntity> {
         return this.taskRepository.createNewTask(createTaskDto,user )
      }

      //get all tasks
      fetchAllTasks(filterDto:GetTasksFilterDto,user:UserEntity):Promise<TaskEntity[]> {
         return this.taskRepository.getTasks(filterDto,user)
    }
      
      //get one Task
      async fetchOneTask(id:number,user:UserEntity): Promise<TaskEntity>{
/*            const found=await this.taskRepository.findOne(id)
 */           const found=await this.taskRepository.findOne({where:{id,userId:user.id}}) //since we have user and task relation and we need both id and userId of the task
 
           if(!found) { 
             throw new NotFoundException(`task with this ${id} is not found`)
          }
          return found
       }
       
       //update the task status
         async updateTask(id:number,status:TaskStatus,user:UserEntity):Promise<TaskEntity>{
          const task =await this.fetchOneTask(id,user)
          task.status = status
          await task.save() // to save the changes in db
          return task
       } 

       //delete task
      async deleteATask(id:number,user:UserEntity):Promise<void>{
         //check out delete and remove query differences in docs
         const deleted= await this.taskRepository.delete({id,userId:user.id})

         if(deleted.affected === 0) {
            throw new NotFoundException(`task with this ${id} is not found`)
 
      } 
   }

 

      

      

      
      /* 
      createTask(createTaskDto:CreateTaskDto) : TaskModel {
      fetchAllTasks():TaskModel[]{
        return this.tasksArr
     } 
   
     fetchTasksbyFilter(filterDto:GetTasksFilterDto):TaskModel[]{
        const {status,search} = filterDto
   
        let tasks=this.fetchAllTasks()
   
        if(status){
         tasks =tasks.filter(item=>item.status===status)
        }
   
        if(search){
         tasks =tasks.filter(item=>
             item.title.includes(search) || item.description.includes(search),
            )
        }
        return tasks
     }
      const {title,description} = createTaskDto
   
       const task:TaskModel={
          id:uuidv4(),
          title,
          description,
          status:TaskStatus.OPEN
      }
   
      this.tasksArr.push(task)
      return task 
   }
 



updateTask(id:string,status:TaskStatus):TaskModel{
   const task =this.fetchOneTask(id)
   task.status = status
   return task
} 

deleteATask(id:string):void{
   const found= this.fetchOneTask(id)
   this.tasksArr=this.tasksArr.filter(item => item.id !== found.id)
} */


}
