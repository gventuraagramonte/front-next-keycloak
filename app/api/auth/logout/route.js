import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import { getIdToken } from "@/utils/sessionTokenAccesor";



export async function GET(){
    const session = await getServerSession(authOptions)
    if(session){
        const idToken = await getIdToken()

          // this will log out the user on Keycloak side
    var url = `${process.env.END_SESSION_URL}?id_token_hint=${idToken}&post_logout_redirect_uri=${encodeURIComponent(process.env.NEXTAUTH_URL)}`;

    try {
        const resp = await fetch(url,{method:'GET'})
    } catch (error) {
        console.error(error)
        return new Response({status:500})
    }
    }
    return new Response({status:200})
}