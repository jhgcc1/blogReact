export function httpRequest(bodyObject,url,method,headers={'Accept': 'application/json','Content-Type': 'application/json'}){
    let TokenLocal=window.localStorage.getItem('tokenCapp');
    let headersExtra={};
    if(TokenLocal){
        headersExtra= {'Authorization': `Token ${TokenLocal}`};
    }
    let objectContruction ={
        method:method,
        headers: {
          ...headers,
          ...headersExtra
        }
    }
    objectContruction= method==="POST"?{...objectContruction,body:bodyObject}:objectContruction

    return(fetch(url, objectContruction).then(response => {
        console.log(response,"response")
        if (response.status >= 400 && response.status < 600) {
            throw new Error("Bad response from server");
        }
        return response.json()
    })
    .catch(error =>{
        return {"erroLog":error}
    }))
}