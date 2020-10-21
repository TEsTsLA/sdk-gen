import {Body, Controller, Get, Post, Query} from "@nestjs/common";
import {CreateUserDto} from "./user.dto";
import {Resp} from "./all.dto";


@Controller()
export class DemoController {
    @Get()
    async getDemo(): Resp<string> {
        return {
            msg: `hello world`,
            code: 200
        };
    }

    /**
     *
     * @param demo 输入
     */
    @Post()
    async postDemo(@Body() demo: CreateUserDto): Promise<string> {
        return `hello world`;
    }

    /**
     * @param payload sss
     */
    @Post('/createUser')
    async createUser(@Body() payload: CreateUserDto, @Query() query: CreateUserDto): Promise<CreateUserDto> {
        return payload
    }
}
