import {Dto} from "./dto.decorator";

/**
 * User Create Dto
 */
@Dto()
export class CreateUserDto {
    /**
     * user name
     */
    name!: string;
    /**
     * user age
     */
    age!: number;
}

@Dto()
export class User {
    id: number
    name: string
    age: number
    friends: Array<User>
}

@Dto()
export class UpdUserDto {
    id: number;
    name: string;
    age: number
}