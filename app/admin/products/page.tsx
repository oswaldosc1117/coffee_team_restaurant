import ProductsPagination from "@/components/products/ProductsPagination";
import ProductsSearchForm from "@/components/products/ProductsSearchForm";
import ProductTable from "@/components/products/ProductsTable";
import Heading from "@/components/ui/Heading";
import { prisma } from "@/src/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

async function productCount() {
    return await prisma.product.count()
}

async function getProducts(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize
    const products = await prisma.product.findMany({
        take: pageSize,
        skip: skip,
        include: {
            category: true
        }
    })

    return products
}

export type ProductsWithCategory = Awaited<ReturnType<typeof getProducts>>

export default async function page({searchParams} : {searchParams : {page: string}}) {

    const page = +searchParams.page || 1
    const pageSize = 10

    if(page < 0 ) redirect('/admin/products')


    const productsData = await getProducts(page, pageSize)
    const totalProductsData = await productCount()

    const [products, totalProducts] = await Promise.all([productsData, totalProductsData]) // NG - 1.
    const totalPages = Math.ceil(totalProducts / pageSize)

    if(page > totalPages ) redirect('/admin/products')

    return (
        <>
            <Heading>Administrar Productos</Heading>

            <div className=" flex flex-col lg:flex-row lg:justify-between gap-5">
                <Link
                    href={'/admin/products/new'}
                    className=" bg-amber-400 w-full rounded-lg lg:w-auto text-xl px-10 py-3 text-center font-bold cursor-pointer">
                        Crear Producto
                    </Link>

                    <ProductsSearchForm/>
            </div>

            <ProductTable products={products}/>

            <ProductsPagination page={page} totalPages={totalPages}/>
        </>
    )
}

/** NOTAS GENERALES
 * 
 * 1.- Tambien puedo utilizar un Promise.all() o en su defecto, un Promise.allSettled() en el lado del frontend. NEXT.js recomienda utlizar el 1ero cuando se
 * emplee del lado del cliente.
*/
