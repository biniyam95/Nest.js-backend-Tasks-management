import { IsNotEmpty } from "class-validator"

//dto ir shape when creating new task
export class CreateTaskDto {
  @IsNotEmpty()
  title:string 

  @IsNotEmpty()
  description:string
}