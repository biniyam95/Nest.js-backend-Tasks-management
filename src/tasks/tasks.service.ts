  import { Injectable,NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/getTasks-filtered.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { UserEntity } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  
   constructor (
      @InjectRepository(TaskRepository)
      private taskRepository:TaskRepository){}

      async createTask(createTaskDto:CreateTaskDto ,user:UserEntity ): Promise<TaskEntity> {
         return this.taskRepository.createNewTask(createTaskDto,user )
      }

      //get all tasks
      fetchAllTasks(filterDto:GetTasksFilterDto,user:UserEntity):Promise<TaskEntity[]> {
         return this.taskRepository.getTasks(filterDto,user)
    }
      
      //get one Task
      async fetchOneTask(id:number,user:UserEntity): Promise<TaskEntity>{
           const found=await this.taskRepository.findOne({where:{id,userId:user.id}}) 
 
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
         const deleted= await this.taskRepository.delete({id,userId:user.id})

         if(deleted.affected === 0) {
            throw new NotFoundException(`task with this ${id} is not found`)
 
      } 
   }  


}
