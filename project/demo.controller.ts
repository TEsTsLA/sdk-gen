import {Body, Controller, Get, Post, Query} from "@nestjs/common";
import {Resp} from "./all.dto";
import {CreateUserDto} from "./user.dto";


@Controller()
export class DemoController {
    @Get()
    async getDemo(): Resp<string> {
        const result = {
            msg: "getReturnTypeNode",
            code: 200
        }
        return {
            ...result
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
