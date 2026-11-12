import seed from '@/seed/customer_prices.json'
import { defineCollectionStore } from './collection'

export const useCustomerPricesStore = defineCollectionStore('customer_prices', seed, {
  getters: {
    byCustomer: (state) => (customerId) =>
      state.items.filter((price) => price.customer_id === Number(customerId)),
    find: (state) => (customerId, productId, packingDesign) =>
      state.items.find(
        (price) =>
          price.customer_id === Number(customerId) &&
          price.product_id === Number(productId) &&
          price.packing_design === packingDesign
      ) ?? null
  }
})
