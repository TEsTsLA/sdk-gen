import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { Resp } from "./all.dto";
import { CreateUserDto, UpdUserDto } from "./user.dto";

/**
 * 用户接口
 */
@Controller('user')
export class UserController {
  @Get()
  async getUser(): Promise<string> {
    return `hello world`;
  }

  /**
   * 
   * @param demo 输入
   */
  @Delete('/:id')
  async delUser(@Param() id: number): Resp<null> {
    return {
      code: 200,
      msg: String(id)
    };
  }
  @Put('create')
  async updUser(@Body() data: UpdUserDto): Resp<UpdUserDto> {
    return { code: 200, data }
  }
  /**
   * @param payload sss
   */
  @Post('/createUser')
  async createUser(@Body() data: CreateUserDto): Resp<CreateUserDto> {
    return {
      code: 200,
      data
    }
  }
}
