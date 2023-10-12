import { prefix1, prefix2 } from "./url"

const getOrdersApi = prefix1 + 'getOrders?page=&' + prefix2
const getOrderDetailApi = (id) => prefix1 + `orderDetail/${id}?`+ prefix2
const xyz = prefix1 + 'orderDetail/';

// `${prefix1}${id....}${prefix2}`

// export const Endpoints = {
//     getOrders: 
// }


export {getOrdersApi, getOrderDetailApi}