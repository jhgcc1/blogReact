import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import React,{useEffect, useState} from 'react';
import {httpRequest} from './httpfacade'
import PostsView from './postView'
const useStyles = makeStyles({
    root: {
      maxWidth: 545,
      width:350
    }
  });
let firstLogin=true;

function Login() {
    const classes = useStyles();
    const [localStorePassword, setlocalStorePassword] = useState({postTitle:"",username:"",password:""});
    const [invalidRegistration, setinvalidRegistration] = useState(false);
    const [invalidLoggin, setinvalidLoggin] = useState(false);
    const [token, setToken] = useState(window.localStorage.getItem('tokenCapp'));
    const [postsStore, setPostsStore] = useState();
    console.log("rendering");
    
    useEffect(()=>{
        if(window.localStorage.getItem('tokenCapp') && firstLogin){
            firstLogin=false;
            postOrGetPosts("GET");
        }
    })


    async function registerApi(){
        const responseCreateUser = await httpRequest(JSON.stringify(localStorePassword),"http://localhost:8080/create-user/","POST");
        if(responseCreateUser.erroLog){
            setinvalidRegistration(true);
        } else{
            setinvalidRegistration(false);
            loginApi();
        }
    }

    const tokenSetup = (getToken)=>{
            if(!getToken.erroLog){
                setinvalidLoggin(false);
                setToken(getToken.token);
                window.localStorage.setItem('tokenCapp', getToken.token);
            } else {
                setinvalidLoggin(true);
            }
        }
    
    async function loginApi(){
        let getToken= null;
        getToken = await httpRequest(JSON.stringify(localStorePassword),"http://localhost:8080/api-token-auth/","POST");
        const setupToken = tokenSetup(getToken);
        if(!getToken.erroLog){
            postOrGetPosts("GET");
        }
    }
    
     let handleChangeText=(event,type2)=>{
        setlocalStorePassword({...localStorePassword,[type2]: event.target.value});
      }

      let promise = new Promise(function(resolve, reject) {
        // executor (the producing code, "singer")
      });
 
    function postOrGetPosts(requestType){
        let data=CompositionPostsObject(requestType)
         httpRequest(data,"http://localhost:8080/posts/",requestType).then(getPostsResult=>{
        if(getPostsResult.erroLog){
            alert(getPostsResult.erroLog)
        } else{
            console.log(getPostsResult,"settint post store");
            setPostsStore(getPostsResult);
        }})
    }

    function CompositionPostsObject(httpType){
        let objectLiteral={
            "GET":()=>JSON.stringify({}),
            "POST":()=>{
            let inputfile=document.getElementById("inpuFile");
            const formData = new FormData()
            let title=localStorePassword.postTitle;
            formData.append('image', inputfile.files[0],"image.png");
            formData.append('title', title);
            return formData
            }
        }
        return objectLiteral[httpType]()
    }

    console.log(postsStore)
  return (
    <React.Fragment>
    {(token && postsStore) && <PostsView posts={postsStore}></PostsView>}
        <div style={{height:"10vh",backgroundColor: "#282828",width:"100%"}}>
        {token && <Button onClick={(e)=>{setToken("");localStorage.removeItem('tokenCapp')}} style={{"float":"right","margin":"20px"}} variant="contained">logout</Button >}
        </div>
        <div style={{backgroundColor: "#282828",height:"90vh",width:"100vw",display:'flex',justifyContent:"center",alignItems:"center"}}>
        <Card style={{height:"500",width:"500",display:'flex',justifyContent:"center",alignItems:"center"}} className={classes.root}>
            <div>
            {!token &&
            <React.Fragment>
                <CardContent>
                    <h2>Login or Register</h2>
                    <form  noValidate autoComplete="off">
                    <TextField onChange={(event)=>handleChangeText(event,"username")} label="Username" />
                    <br/>
                    <TextField onChange={(event)=>handleChangeText(event,"password")}  label="Password" />
                    </form>
                </CardContent>
                <CardActions>
                    <div style={{width: "100%"}}>
                        <div style={{marginBottom:"30px",width: "100%",display:'flex',justifyContent:"space-between"}}>
                            <Button onClick={(e)=>{loginApi()}} variant="outlined">Sign in</Button>
                            <Button onClick={(e)=>{registerApi()}} variant="outlined">Register</Button>
                        </div>
                        {invalidRegistration && <p>Registration failed</p>}
                        {invalidLoggin && <p>Invalid loggin</p>}
                    </div>
                </CardActions>
            </React.Fragment>}
            {token && 
            <React.Fragment>
                <CardContent>
                    <h2>add post</h2>
                    <form  noValidate autoComplete="off">
                    <TextField  style={{width:"100%"}} onChange={(event)=>handleChangeText(event,"postTitle")} label="Title" />
                    <br/>
                    <br/>
                    <input id="inpuFile" style={{width:"100%"}} type="file" accept="image/*" />
                    </form>
                </CardContent>
                <CardActions>
                        <Button style={{marginBottom:"30px",marginLeft: "65%"}} onClick={(e)=>{postOrGetPosts("POST")}} variant="outlined">Create</Button>
                </CardActions>
            </React.Fragment>}
            </div>
            </Card>
        </div>

    </React.Fragment>
  );
}

export default Login;
