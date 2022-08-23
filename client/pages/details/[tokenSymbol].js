import { useState , useEffect } from 'react'
import { useRouter } from 'next/router'
import { Ids } from '../../config'
import Header from '../components/Header'
export default function Details() {
    const  [fetchedData , setFetchedData] = useState()
    const [loadingState , setLoadingState] = useState("not-loaded")
    const router = useRouter()
    const {tokenSymbol} = router.query
    const Id = Ids[tokenSymbol]

    async function fetchData(Id){
      const response = await fetch(`https://api.coinpaprika.com/v1/ticker/${Id}`)
      const data = await response.json()
      setFetchedData(data)
      setLoadingState("loaded")
      
    }

    useEffect(()=>{
      
      if(Id) {
        fetchData(Id)
      }
        
    },[])

  if(loadingState=="loaded") return (
    <>
      <Header/>
      <div className='w-screen'>{fetchedData.Id}</div>
    </>
  )
}

