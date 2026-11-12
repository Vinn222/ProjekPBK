import seed from '@/seed/payments.json'
import { defineCollectionStore } from './collection'

export const usePaymentsStore = defineCollectionStore('payments', seed, {
  getters: {
    byBill: (state) => (billId) => state.items.filter((payment) => payment.bill_id === Number(billId)),
    totalByBill() {
      return (billId) => this.byBill(billId).reduce((sum, payment) => sum + payment.amount, 0)
    }
  }
})
