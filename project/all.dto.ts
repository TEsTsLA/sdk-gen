import {Dto} from "./dto.decorator";

@Dto
class ResDto<T> {
    data?: T
    code: number;
    msg?: string
}

@Dto
class ResPaginationDto<T> {
    data: Array<T>
    code: number;
    total: number
    msg?: string
}

@Dto
export class Page {
    pageNo:number
    limit:number
}
@Dto
export class Res<T>{
    data:T
}

/**
 * @Dto this is a Dto
 */
export type Resp<T> = Promise<ResDto<T>>
/**
 * @Dto paginate Resp
 */
export type PagResp<T> = Promise<ResPaginationDto<T>>