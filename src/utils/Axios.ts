import axios from 'axios';


  const config = {
    headers:{
      "Access-Control-Allow-Origin": "*",
    }
  };

  export function HttpGet(url:string, call:(response:any)=>void){
    axios.get(url, config).then(function (response:any){
        const code = response.data.code 
        if(code == 200){
            const data = response.data.data 
            call(data)
        }else{
            console.log("code:", code, "msg:", response.data.msg)
        }
    }).catch(function (error:any) {
        // handle error
        console.log("Error:", error);
    })
  }