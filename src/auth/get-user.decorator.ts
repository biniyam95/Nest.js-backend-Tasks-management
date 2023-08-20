import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { UserEntity } from "./user.entity"

//to use or show only a small relevant chunk of data from request object. in this case 'user'
/* export const GetUser= createParamDecorator((data,req):UserEntity=>{
  console.log(req,'request')
  console.log(req.user,'req.user1111')
  return req.user
}) */


export const GetUser = createParamDecorator((data, ctx: ExecutionContext): UserEntity => {
  const req = ctx.switchToHttp().getRequest();
 // console.log(req,'request')
  //console.log(req.user,'req.user1111')
  return req.user;
});