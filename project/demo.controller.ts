import {Body, Controller, Get, Post, Query} from "@nestjs/common";
import {Page, PagResp, Res, Resp as ReP} from "./all.dto";
import {CreateUserDto, User} from "./user.dto";

@Controller()
export class DemoController {
    @Get()
    getUser(): Res<CreateUserDto> {
        const result = {
            msg: "getReturnTypeNode",
            code: 200,
            data: {
                name: "name",
                age: 10
            }
        }
        return {
            ...result,
        };
    }

    /**
     *
     * @param demo 输入
     */
    @Post()
    async createUser(@Body() demo: CreateUserDto, @Query() q: CreateUserDto): ReP<Array<CreateUserDto>> {
        return {
            code: 200,
            data: [demo]
        };
    }

    /**
     * @param payload sss
     */
    @Post('/userList')
    async getUsers(@Body() payload: User, @Query() query: Page): PagResp<User> {
        return {
            code: 200,
            total: 1000,
            data: [payload]
        }
    }
}
