import { useEffect, useRef, useState } from "react"
import { getDatabase, ref, set } from "firebase/database";
import { app, getData, writeData } from "./firebase";
function App() {

let key=window.location.pathname

let [text,setText]=useState("")

let [isDataFetched,setIsDataFetched]=useState(false)

let [isTyping,setIsTyping]=useState(false)

useEffect(()=>
  {
     async function readData()
    {

      let data= await getData(key)
      
      setIsDataFetched(true)
      console.log("Data Fetched",data)
      if(isTyping)
        return 
      setText(data)
    //  navigator.clipboard.writeText(data)
    }
   let interval= setInterval(()=>
    {
      readData()
    },5000)
    return ()=>
      {
        clearInterval(interval)

      } 

  },[isTyping])


useEffect(()=>
  {
    
   
    console.log("Text" ,text)
   
    
    let timmer=setTimeout(()=>
    {
      let write= async ()=>
      {


          await writeData(key,text)
          setIsTyping(false)

      }
      write()
    
    }
      
      ,1000)


      return ()=>
      {
        clearTimeout(timmer)
        
      }
  },[text])

  

// setInterval(fetchContent,5000);
  return (
    <>
      <div>    
        <textarea disabled={!isDataFetched} rows={"35"} cols={"170"} value={text} onChange={(e)=>{setText(e.target.value)
setIsTyping(true)

        }}>
          
        </textarea>
      </div>
    </>
  )
}

export default App
