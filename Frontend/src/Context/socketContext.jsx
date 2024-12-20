import {createContext, useEffect, useState, useContext} from 'react'
import { useAuthContext } from './authContext'
import io from 'socket.io-client'



export const SocketContext = createContext()

export const useSocketContext = () => {
    return useContext(SocketContext)
}

export const SocketContextProvider = ({children}) =>{


    const [socket, setSocket] = useState()
    const [online, setOnline] = useState([])
    const {authUser} = useAuthContext()

    useEffect(()=>{
        // console.log();
        if (authUser) {
            const socket = io('http://localhost:5000',{
                query:{ userId: authUser.user.id}
            })
            setSocket(socket)

            socket.on('OnlineUser', (users)=>{
                setOnline(users)
            })
        
            return ()=> socket.close();
        }else{
            if (socket) {
                socket.close()
                setSocket(null)
        }    
            
        }
    },[authUser])


    return <SocketContext.Provider value={{socket, online}}>{children}</SocketContext.Provider>
} 

