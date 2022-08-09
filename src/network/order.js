import { request } from "./request";

//创建订单
export function createOrder(params) {
    return request({
        url: '/api/orders',
        method: 'POST',
        params
    })
}

//获取订单视图
export function getOredrPreview() {
    return request({
        url: '/api/orders/preview',
        method: 'get',
    })
}

//获取支付二维码
export function payOredr(order, params) {
    return request({
        url: `/api/orders/${order}/pay`,
        method: 'get',
        params

    })
}

//查询支付状态
export function payOrderStatus(order) {
    return request({
        url: `/api/orders/${order}/status`,
        method: 'GET',
    })
}

//获取订单列表 {page:1 , status:2 , include:'user,orderDetail.goods'}
export function getOrderList(params) {
    return request({
        url: '/api/orders',
        method: 'get',
        params
    })
}

//订单详情
export function getOrderDetail(order) {
    return request({
        url: `/api/orders/${order}`,
        method: 'get',
        params: {
            include: 'user,orderDetails.goods'
        }
    })
}

//确认订单
export function confirmOrder(order) {
    return request({
        url: `/api/orders/${order}/confirm`,
        method: 'patch',

    })
}


//获取物流信息
export function viewExpress(order) {
    return request({
        url: `/api/orders/${order}/express`,
        method: 'get',
    })
}