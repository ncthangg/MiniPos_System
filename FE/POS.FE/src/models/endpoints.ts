export const END_POINT = {
    PRODUCT: {
        GetAll: '/products',
    },
    ORDER: {
        GetAll: '/orders',
        GetById: (orderId: string) => `/orders/${orderId}`,
        Post: '/orders',
    }


}