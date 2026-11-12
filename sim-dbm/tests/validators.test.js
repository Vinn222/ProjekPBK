import { describe, expect, it } from 'vitest'
import { getBillDueStatus, getDueDate } from '../src/utils/billing'
import { validateCustomer } from '../src/validators/customer'
import { validateDelivery } from '../src/validators/delivery'
import { exchangeDayWarning, validateExchange } from '../src/validators/exchange'
import { validateNote } from '../src/validators/note'
import { validateOrder } from '../src/validators/order'
import { validatePayment } from '../src/validators/payment'
import { validatePrice } from '../src/validators/price'
import { validateProduct } from '../src/validators/product'
import { validateUser } from '../src/validators/user'

const price = () => 1000
const goodOrder = () => ({
  customer_id: 1, order_date: '2026-11-10', requested_delivery_date: '2026-11-12', channel: 'whatsapp',
  items: [{ product_id: 1, packing_design: 'Polos', quantity: '500' }]
})

describe('order', () => {
  it('valid', () => expect(validateOrder(goodOrder(), { findPrice: price })).toEqual({}))
  it('tanpa barang ditolak', () => expect(validateOrder({ ...goodOrder(), items: [] }, { findPrice: price }).items).toBeTruthy())
  it.each([['0'], ['-5'], ['1.5'], ['abc'], ['']])('jumlah %j ditolak', (q) => {
    const e = validateOrder({ ...goodOrder(), items: [{ product_id: 1, packing_design: 'Polos', quantity: q }] }, { findPrice: price })
    expect(e['items.0.quantity']).toBeTruthy()
  })
  it('batas 2000 diterima, 2001 ditolak', () => {
    const at = (q) => validateOrder({ ...goodOrder(), items: [{ product_id: 1, packing_design: 'Polos', quantity: q }] }, { findPrice: price })
    expect(at('2000')).toEqual({})
    expect(at('2001')['items.0.quantity']).toMatch(/2000/)
  })
  it('tanggal kirim sebelum tanggal order ditolak', () => {
    expect(validateOrder({ ...goodOrder(), requested_delivery_date: '2026-11-09' }, { findPrice: price }).requested_delivery_date).toBeTruthy()
  })
  it('tanggal kalender tidak valid ditolak', () => {
    expect(validateOrder({ ...goodOrder(), order_date: '2026-02-30' }, { findPrice: price }).order_date).toBeTruthy()
  })
  it('item ganda ditolak', () => {
    const item = { product_id: 1, packing_design: 'Polos', quantity: '5' }
    expect(validateOrder({ ...goodOrder(), items: [item, item] }, { findPrice: price })['items.1.product_id']).toBeTruthy()
  })
  it('harga belum diatur ditolak', () => {
    expect(validateOrder(goodOrder(), { findPrice: () => null })['items.0.packing_design']).toBeTruthy()
  })
})

describe('price', () => {
  const ok = { product_id: 1, packing_design: 'Polos', unit_price: '1200' }
  it('valid', () => expect(validatePrice(ok)).toEqual({}))
  it.each([['0'], ['-1'], [''], ['12.5']])('harga %j ditolak', (v) => expect(validatePrice({ ...ok, unit_price: v }).unit_price).toBeTruthy())
  it('duplikat ditolak', () => {
    expect(validatePrice(ok, { prices: [{ id: 9, product_id: 1, packing_design: 'polos' }] }).packing_design).toBeTruthy()
  })
})

describe('customer & product', () => {
  const c = { name: 'Hotel X', code: 'CUS-9', phone: '0812-345', exchange_day: 'monday' }
  it('customer valid', () => expect(validateCustomer(c)).toEqual({}))
  it('nama kosong', () => expect(validateCustomer({ ...c, name: '  ' }).name).toBeTruthy())
  it('kode duplikat', () => expect(validateCustomer(c, { customers: [{ id: 1, name: 'Lain', code: 'cus-9' }] }).code).toBeTruthy())
  it('telepon salah', () => expect(validateCustomer({ ...c, phone: 'abc' }).phone).toBeTruthy())
  it('produk nama duplikat', () => expect(validateProduct({ name: 'sabun', code: 'P9', unit: 'pcs' }, { products: [{ id: 1, name: 'Sabun', code: 'P1' }] }).name).toBeTruthy())
  it('produk satuan kosong', () => expect(validateProduct({ name: 'X', code: 'P9', unit: '' }).unit).toBeTruthy())
})

describe('delivery, exchange, payment, note, user', () => {
  it('pengiriman sebelum tanggal order ditolak', () => {
    expect(validateDelivery({ order_id: 1, delivery_date: '2026-11-01', courier_id: 1 }, { orderDate: '2026-11-10', couriers: [{ id: 1 }] }).delivery_date).toBeTruthy()
  })
  it('pengantar wajib', () => expect(validateDelivery({ order_id: 1, delivery_date: '2026-11-12', courier_id: '' }, { couriers: [] }).courier_id).toBeTruthy())
  it('tukar faktur sebelum kirim ditolak', () => expect(validateExchange({ exchange_date: '2026-11-01' }, { deliveryDate: '2026-11-05' }).exchange_date).toBeTruthy())
  it('tukar faktur tanpa pengiriman ditolak', () => expect(validateExchange({ exchange_date: '2026-11-09' }).exchange_date).toBeTruthy())
  it('peringatan bukan hari Senin', () => {
    expect(exchangeDayWarning('2026-11-10', 'monday')).toMatch(/Senin/) // 10 Nov 2026 = Selasa
    expect(exchangeDayWarning('2026-11-09', 'monday')).toBe('')
  })
  const pay = { payment_date: '2026-11-10', amount: '1000', method: 'cash' }
  const ctx = { remaining: 1000, exchangeDate: '2026-11-09', today: '2026-11-11' }
  it('bayar valid (tunai tanpa batas)', () => expect(validatePayment({ ...pay, amount: '1000' }, ctx)).toEqual({}))
  it('bayar melebihi sisa ditolak', () => expect(validatePayment({ ...pay, amount: '1001' }, ctx).amount).toBeTruthy())
  it('bayar 0 / negatif ditolak', () => { expect(validatePayment({ ...pay, amount: '0' }, ctx).amount).toBeTruthy(); expect(validatePayment({ ...pay, amount: '-1' }, ctx).amount).toBeTruthy() })
  it('bayar sebelum tukar faktur ditolak', () => expect(validatePayment({ ...pay, payment_date: '2026-11-08' }, ctx).payment_date).toBeTruthy())
  it('bayar tanggal masa depan ditolak', () => expect(validatePayment({ ...pay, payment_date: '2026-11-12' }, ctx).payment_date).toBeTruthy())
  it('catatan penagihan kosong ditolak', () => expect(validateNote({ note_date: '2026-11-10', result: ' ' }).result).toBeTruthy())
  it('janji bayar sebelum catatan ditolak', () => expect(validateNote({ note_date: '2026-11-10', result: 'ok sip', promise_date: '2026-11-01' }).promise_date).toBeTruthy())
  it('user: role kosong, sandi pendek, username salah', () => {
    const e = validateUser({ name: 'A', username: 'Ab', password: '123', roles: [] })
    expect(e.roles && e.password && e.username).toBeTruthy()
  })
  it('user: edit tanpa sandi diperbolehkan', () => expect(validateUser({ name: 'A', username: 'abc', password: '', roles: ['admin'] }, { editingId: 5 })).toEqual({}))
})

describe('jatuh tempo', () => {
  const bill = (exchange_date, status = 'awaiting_payment') => ({ exchange_date, status })
  const today = '2026-11-10'
  it('jatuh tempo = tukar faktur + 14 hari', () => expect(getDueDate('2026-10-26')).toBe('2026-11-09'))
  it('lintas bulan dan tahun', () => expect(getDueDate('2026-12-24')).toBe('2027-01-07'))
  it('status', () => {
    expect(getBillDueStatus(bill(null, 'not_exchanged'), today)).toBe('awaiting_exchange')
    expect(getBillDueStatus(bill('2026-10-26'), today)).toBe('overdue')
    expect(getBillDueStatus(bill('2026-10-27'), today)).toBe('due_today')
    expect(getBillDueStatus(bill('2026-10-28'), today)).toBe('near_due')
    expect(getBillDueStatus(bill('2026-10-30'), today)).toBe('near_due') // tepat 3 hari
    expect(getBillDueStatus(bill('2026-10-31'), today)).toBe('not_due') // 4 hari
    expect(getBillDueStatus(bill('2026-10-01', 'paid'), today)).toBe('paid')
  })
})
