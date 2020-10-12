import { Dto } from "./dto.decorator";

@Dto()
export class CreateUserDto {
  name!: string;
  age!: number;
}