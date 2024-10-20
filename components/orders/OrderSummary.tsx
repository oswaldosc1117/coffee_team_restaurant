"use client"

import { useAppStore } from "@/src/store/useAppStore"
import ProductDetails from "./ProductDetails"
import { useMemo } from "react"
import { formatCurrency } from "@/src/utils"
import { createOrder } from "@/actions/create-order-action"
import { OrderSchema } from "@/src/schemas"
import { toast } from "react-toastify"

export default function OrderSummary() {

    const order = useAppStore((state) => state.order)
    const clearOrder = useAppStore((state) => state.clearOrder)

    const total = useMemo(() => order.reduce((total, item) => total + (item.quantity * item.price), 0), [order])

    const handleCreateOrder = async (formData: FormData) => {

        const data = {
            name: formData.get('name'),
            total,
            order
        }

        const result = OrderSchema.safeParse(data)

        if(!result.success) {
            result.error.issues.forEach((issue) => {
                toast.error(issue.message)
            })
            return
        }

        const response = await createOrder(data)

        if(response?.errors) {
            response.errors.forEach((issue) => {
                toast.error(issue.message)
            })
        }

        toast.success('Pedido Realizado Correctamente')
        clearOrder()
    }

    return (
        <aside className=" lg:h-screen lg:overflow-y-scroll md:w-64 lg:w-96 p-5">
            <h1 className=" text-4xl text-center font-black">Mi Pedido</h1>

            {order.length === 0 ? <p className=" text-center my-10">El pedido está vacío</p> : (
                <div className=" mt-5">
                    {order.map(item => (
                        <ProductDetails key={item.id} item={item}/>
                    ))}

                    <p className=" text-2xl text-center mt-20">Total a pagar: {''} <span className=" font-bold">{formatCurrency(total)}</span></p>

                    <form className=" w-full mt-10 space-y-5" action={handleCreateOrder}>

                        <input
                            type="text"
                            placeholder="Tu Nombre"
                            className=" bg-white border border-gray-100 rounded-lg p-2 w-full"
                            name="name"
                        />

                        <input
                            type="submit"
                            className=" py-2 rounded-lg uppercase font-bold text-white bg-black w-full text-center cursor-pointer"
                            value={'Confirmar Pedido'}
                        />
                    </form>
                </div>
            )}
        </aside>
    )
}
