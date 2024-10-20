"use client"

import { useAppStore } from "@/src/store/useAppStore"
import { Product } from "@prisma/client"

type AddProductButtonProps = {
    product: Product
}

export default function AddProductButton({product}: AddProductButtonProps) {
    
    const addToCart = useAppStore((state) => state.addToCart)
    
    return (
        <button
            type="button"
            className=" bg-indigo-600 hover:bg-indigo-800 text-white w-full mt-5 p-3 rounded-md uppercase font-bold cursor-pointer"
            onClick={() => addToCart(product)}>
            Agregar
        </button>
    )
}
