import { prefix1, prefix2 } from "./url"

const getOrdersApi = (num) => prefix1 + `getOrders?page=${num}&`+ prefix2
const getOrderDetailApi = (id) => prefix1 + `orderDetail/${id}?`+ prefix2
const xyz = prefix1 + 'orderDetail/';

// `${prefix1}${id....}${prefix2}`

// export const Endpoints = {
//     getOrders: 
// }


export {getOrdersApi, getOrderDetailApi}