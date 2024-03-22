import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { SetDynamicRoute } from "@/utils/setDynamicRoute"

const { getAccessToken } = require("@/utils/sessionTokenAccesor")

async function getAllProducts(){
    const url = `${process.env.DEMO_BACKEND_URL}/products`
    
    let accessToken = await getAccessToken()
    
    const resp = await fetch(url,{
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer "+accessToken
        }
    })

   

    if(resp.ok){
        const data = await resp.json()
        
        return data
    }

    throw new Error('Failed to fetch data. Status: ' + resp.status)
}

export default async function Products(){
    const session = await getServerSession(authOptions)

    if(session && session.roles?.includes('viewer')){
        try {
            const prod = await getAllProducts()
            const {products} = prod
            
            return (
                <main className="text-white">
                    <SetDynamicRoute></SetDynamicRoute>
                    <h1 className="text-4xl text-center">Products</h1>
                    <table className="border border-gray-500 text-lg ml-auto mr-auto mt-6">
                        <thead>
                            <tr>
                                <th className="bg-blue-900 p-2 border border-gray-500">Id</th>
                                <th className="bg-blue-900 p-2 border border-gray-500">Name</th>
                                <th className="bg-blue-900 p-2 border border-gray-500">
                                    Price
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p)=>(
                                <tr key={p._id}>
                                    <td className="p-1 border border-gray-500 text-white">{p._id}</td>
                                    <td className="p-1 border border-gray-500 text-white">{p.name}</td>
                                    <td className="p-1 border border-gray-500 text-white">{p.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
            )
        } catch (error) {
            console.error(error)
            return(
                <main>
                    <h1 className="text-4xl text-center">Products</h1>
                    <p className="text-red-600 text-center text-lg">
                        Sorry, an error happened. Check the server logs.
                    </p>
                </main>
            )
        }
    }

    redirect('/unauthorized')
}