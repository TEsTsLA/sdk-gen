import { type } from "os";
import { Dto } from "./dto.decorator";

@Dto() class ResDto<T> {
  data?: T
  code: number;
  msg?: string
}

export type Resp<T> = Promise<ResDto<T>>