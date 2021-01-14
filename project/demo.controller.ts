import {Body, Controller, Get, Post} from "@nestjs/common";
import {PagResp, Res, Resp as ReP} from "./all.dto";
import {CreateUserDto, User} from "./user.dto";

@Controller()
export class DemoController {
    /**
     * 获取用户
     */
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
    async createUser(@Body() demo: CreateUserDto): ReP<Array<CreateUserDto>> {
        return {
            code: 200,
            data: [demo]
        };
    }

    /**
     * @param payload sss
     */
    @Post('/userList')
    async getUsers(@Body() payload: User): PagResp<User> {
        return {
            code: 200,
            total: 1000,
            data: [payload]
        }
    }
}
