import { request } from "./request";

export function getGoodsDetali(id) {
    return request({
        url: '/api/goods/' + id
    })
}