import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context =createContext();

const ContextProvider=(props)=>{
    
    const [input , setInput]= useState("");
    const [recentPrompt,setRecentPrompt]= useState("");
    const [prevPromts, setPrevPrompts]= useState([]);
    const [showResult,setShowResult]= useState(false);
    const [loading,setLoading]= useState(false);
    const [resultData,setResultData]= useState("");
    // this is not working in my laptop 
    // const delayPara=(index , nextWord)=>{
    //     setTimeout(function (){
    //         setResultData(prev=> prev + nextWord)
    //     } ,75*index)
    // }
    
    const newChat=()=>{
        setLoading(false);
        setShowResult(false);
    }
    const onSent =async( prompt)=>{
        setResultData("");
        setLoading(true);
        setShowResult(true);
        let response;
        if(prompt !== undefined){
            response = await run(prompt);
            setRecentPrompt(prompt);
        }
        else{
            setRecentPrompt(input);
            setPrevPrompts(prev=>[...prev,input])
            response = await run(input);
        }
        
       let responseArray = response.split("**");
       let newResponse="";
       for(let i=0; i< responseArray.length ; i++){
        if(i=== 0 || i%2 !== 1){
            newResponse += responseArray[i]
        }
        else{
            newResponse+= "<b>"+ responseArray[i] +"</b>"
        }
       }
       let newResponse2 = newResponse.split("*").join("<br/>")
       setResultData(newResponse2);
    //    let newResponseArray = newResponse2.split(" ");
    //    for(let i=0; newResponseArray.length; i++){
    //         const nextWord= newResponseArray[i];
    //         delayPara(i, nextWord +" ");
    //    }
       setLoading(false);
       setInput("");
    }

   
    const contextValue ={
         prevPromts,
         setPrevPrompts,
         onSent,
         recentPrompt,
         setRecentPrompt,
         loading,
         showResult,
         resultData,
         input,
         setInput,
         newChat
    }
   return(
    <Context.Provider value={contextValue}>
        {props.children}
    </Context.Provider>
   )
}

export default ContextProvider;