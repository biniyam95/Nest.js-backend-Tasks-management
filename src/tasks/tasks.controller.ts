import { Body, Controller, Get, Post,Delete, Param, Patch,Query, UsePipes, ValidationPipe, ParseIntPipe,UseGuards} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/getTasks-filtered.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskEntity } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard} from '@nestjs/passport'
import { UserEntity } from 'src/auth/user.entity';
import {GetUser} from 'src/auth/get-user.decorator'
import { Logger } from '@nestjs/common';


@Controller('tasks')
 @UseGuards(AuthGuard()) 
export class TasksController {
//to use the tasks service or helper 
constructor (private tasksService:TasksService){}

//logger
private logger=new Logger('TasksController')

  //add task
  @Post()
  @UsePipes(ValidationPipe)
  addTask(
    @Body() createTaskDto:CreateTaskDto,
    @GetUser() user:UserEntity 
    ):Promise<TaskEntity>{
     return this.tasksService.createTask(createTaskDto ,user )
  }
  //get all tasks
  @Get() 
  getAllTasks(
    @Query(ValidationPipe) filterDto:GetTasksFilterDto,
    @GetUser() user:UserEntity
  ):Promise<TaskEntity[]>{

    //both these logs are same, but logger highlight in color and a standard format, it will also specify which class or context it is coming from
    console.log(`user "${user.username}" retriving all tasks`);  
    this.logger.verbose(`user "${user.username}" retriving all tasks`)
    
    return this.tasksService.fetchAllTasks(filterDto,user)
  }

  //get a task
  @Get('/:id') 
  getATask(
    @Param('id',ParseIntPipe ) id:number,
    @GetUser() user:UserEntity
    ):Promise<TaskEntity> {
      return this.tasksService.fetchOneTask(id,user)
    }
    
    //update task
    @Patch('/:id/status')
    updateTaskStatus(
      @Param('id',ParseIntPipe) id:number, 
      @Body('status',TaskStatusValidationPipe) status:TaskStatus,
      @GetUser() user:UserEntity
      ):Promise<TaskEntity>{
      return this.tasksService.updateTask(id, status, user)
    }

    //delete a task
  @Delete('/:id')
  deleteTask(
    @Param('id',ParseIntPipe) id:number,
    @GetUser() user:UserEntity
  ) :Promise<void>{
  return this.tasksService.deleteATask(id,user)
  }



  /* 
  @Post()
  @UsePipes(ValidationPipe)
  addTask(@Body() createTaskDto:CreateTaskDto):TaskModel{
    
    return this.tasksService.createTask(createTaskDto)
  }
  
  
  @Get() 
  getAllTasks(@Query(ValidationPipe) filterDto:GetTasksFilterDto):TaskModel[] {
    if(Object.keys(filterDto).length){ 
      return this.tasksService.fetchTasksbyFilter(filterDto)
    }
    return this.tasksService.fetchAllTasks() 
  } 
  
  

 


  @Patch('/:id/status')
  updateTaskStatus(@Param('id') id:string, @Body('status',TaskStatusValidationPipe) status:TaskStatus):TaskModel{
    return this.tasksService.updateTask(id, status)
  }

  @Delete('/:id')
  deleteTask(@Param('id') id:string):void{
   this.tasksService.deleteATask(id)
  } */

}
