import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task-status.enum";

export class TaskStatusValidationPipe implements PipeTransform{
  readonly allowedStatuses=[
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ]
    
  
  transform(value: any, metadata: ArgumentMetadata) {
      value=value.toUpperCase()

      if(!this.isStatusValid(value)){
        throw new BadRequestException(`'${value}' is not a valid status`)
      }
       return value
  }

  //private function to check whether the status is included in allowedStatuses array
  private isStatusValid(status:any){
    const index= this.allowedStatuses.indexOf(status)
    return  index !==-1
  }
}