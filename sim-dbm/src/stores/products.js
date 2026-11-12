import seed from '@/seed/products.json'
import { defineCollectionStore } from './collection'

export const useProductsStore = defineCollectionStore('products', seed, {
  getters: { active: (state) => state.items.filter((product) => product.active) }
})
