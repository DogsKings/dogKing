import { request } from "./request";

//添加购物车
export function addCart(data) {
    return request({
        url: '/api/carts',
        method: 'POST',
        data
    })
}

//修改购物车
export function changeCart(id, data) {
    return request({
        url: `/api/carts/${id}`,
        method: 'put',
        data,

    })
}


//选择商品的状态checked，所有选中的id
export function checkedCart(data) {
    return request({
        url: '/api/carts/checked',
        method: 'patch',
        data
    })
}


//获取购物车列表
export function getCart(data = '') {
    return request({
        url: '/api/carts?' + data,
        method: 'get',
    })
}


//删除购物车
export function deleteCart(id) {
    return request({
        url: `/api/carts/${id}`,
        method: 'DELETE',
    })
}

