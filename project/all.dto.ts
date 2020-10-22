import {Dto} from "./dto.decorator";

@Dto()
class ResDto<T> {
    data?: T
    code: number;
    msg?: string
}

@Dto()
class ResPaginationDto<T> {
    data: Array<T>
    code: number;
    total: number
    msg?: string
}

export class Page {
    pageNo:number
    limit:number
}

export type Resp<T> = Promise<ResDto<T>>
/**
 * paginate Resp
 */
export type PagResp<T> = Promise<ResPaginationDto<T>>