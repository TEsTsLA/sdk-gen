import { type } from "os";
import { DemoController } from "./demo.controller";
import { } from 'rxjs'
import { Dto } from "./dto.decorator";

@Dto() class ResDto<T> {
  data?: T
  code: number;
  msg?: string
}

export type Resp<T> = Promise<ResDto<T>>