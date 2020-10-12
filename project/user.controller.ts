import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { Resp } from "./all.dto";
import { CreateUserDto, UpdUserDto } from "./user.dto";


@Controller('/user')
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
      code: 200
    };
  }
  @Put()
  async updUser(@Body() data: UpdUserDto): Resp<null> {
    return { code: 200 }
  }
  /**
   * @param payload sss
   */
  @Post('/createUser')
  async createUser(@Body() data: CreateUserDto, @Query() query: CreateUserDto): Resp<CreateUserDto> {
    return {
      code: 200,
      data
    }
  }
}
