import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState, useRef } from 'react';
import { httpRequest } from './httpfacade';
import PostsView from './postView';

const useStyles = makeStyles({
  root: {
    maxWidth: 545,
    width: 350,
  }
});

export function compositionDataCreatePost(httpType,inputfile,title) {
  const objectLiteral = {
    GET: () => JSON.stringify({}),
    POST: () => {
      const formData = new FormData();
      formData.append('image', inputfile, 'image.png');
      formData.append('title', title);
      return formData;
    },
  };
  return objectLiteral[httpType]();
}

function Login() {
  const classes = useStyles();
  const ChangeStoreFile= useRef();
  const ChangeStoreLogin = useRef({postTitle: '', username: '', password: '' });
  const [invalidRegistration, setinvalidRegistration] = useState(false);
  const [invalidLoggin, setinvalidLoggin] = useState(false);
  const [token, setToken] = useState(window.localStorage.getItem('tokenCapp'));
  const [postsStore, setPostsStore] = useState();



  function postOrGetPosts(requestType) {
    const data = compositionDataCreatePost(requestType,ChangeStoreFile.current,ChangeStoreLogin.current.postTitle);
    httpRequest(data, 'http://localhost:8080/posts/', requestType, {}).then((getPostsResult) => {
      console.log(getPostsResult);
      if (getPostsResult.erroLog) {
        alert(getPostsResult.erroLog);
      } else {
        console.log(getPostsResult, 'settint post store');
        if (requestType === 'POST') {
          let newpush = [];
          newpush.push(getPostsResult);
          newpush = [...newpush, ...postsStore];
          setPostsStore(newpush);
        } else {
          setPostsStore(getPostsResult.reverse());
        }
      }
    });
  }

  useEffect(() => {
    if (window.localStorage.getItem('tokenCapp')) {
      console.log('in');
      postOrGetPosts('GET');
    }
  }, []);
  const tokenSetup = (getToken) => {
    if (!getToken.erroLog) {
      setinvalidLoggin(false);
      setToken(getToken.token);
      window.localStorage.setItem('tokenCapp', getToken.token);
    } else {
      setinvalidLoggin(true);
      setinvalidRegistration(false);
    }
  };
  async function loginApi() {
    let getToken = null;
    getToken = await httpRequest(JSON.stringify(ChangeStoreLogin.current), 'http://localhost:8080/api-token-auth/', 'POST');
    tokenSetup(getToken);
    if (!getToken.erroLog) {
      postOrGetPosts('GET');
    }
  }
  async function registerApi() {
    const responseCreateUser = await httpRequest(JSON.stringify(ChangeStoreLogin.current), 'http://localhost:8080/create-user/', 'POST');
    if (responseCreateUser.erroLog) {
      setinvalidLoggin(false);
      setinvalidRegistration(true);
    } else {
      setinvalidRegistration(false);
      loginApi();
    }
  }

  const handleChangeText = (val, type2) => {
    ChangeStoreLogin.current={ ...ChangeStoreLogin.current, [type2]: val };
  };


  console.log(postsStore);
  return (
    <React.Fragment>
      <div style={{ height: '100%', backgroundColor: '#282828', width: '100%' }}>
        {token && <Button onClick={() => { setToken(''); localStorage.removeItem('tokenCapp'); setPostsStore([]); }} style={{ float: 'right', margin: '20px' }} variant="contained">logout</Button>}
      </div>

      <div style={{
        backgroundColor: '#282828', minHeight: '100vh', height: '100%', width: '100vw', flexDirection: 'row', flexWrap: 'wrap', display: 'flex', justifyContent: 'center', alignItems: 'center',
      }}
      >
        <Card
          className={classes.root}
          style={{
            margin: '40px', height: '500', width: '500', display: 'flex', justifyContent: 'center', alignItems: 'center',
          }}
        >
          <div>
            {!token
            && (
            <>
              <CardContent>
                <h2>Login or Register</h2>
                <form noValidate autoComplete="off">
                  <TextField onChange={(event) => handleChangeText(event.target.value, 'username')} label="Username" />
                  <br />
                  <TextField id="standard-password-input" type="password" autoComplete="current-password" onChange={(event) => handleChangeText(event.target.value, 'password')} label="Password" />
                </form>
              </CardContent>
              <CardActions>
                <div style={{ width: '100%' }}>
                  <div style={{
                    marginBottom: '30px', width: '100%', display: 'flex', justifyContent: 'space-between',
                  }}
                  >
                    <Button onClick={() => { loginApi(); }} variant="outlined">Sign in</Button>
                    <Button onClick={() => { registerApi(); }} variant="outlined">Register</Button>
                  </div>
                  {invalidRegistration && <p>Registration failed</p>}
                  {invalidLoggin && <p>Invalid Login</p>}
                </div>
              </CardActions>
            </>
            )}
            {token
            && (
            <>
              <CardContent>
                <h2>add post</h2>
                <form noValidate autoComplete="off">
                  <TextField id="postTitle" style={{ width: '100%' }} onChange={(event) => handleChangeText(event.target.value, 'postTitle')} label="Title" />
                  <br />
                  <br />
                  <input id="inpuFile" onChange={(event) => {ChangeStoreFile.current=event.target.files[0]}} style={{ width: '100%' }} type="file" accept="image/*" />
                </form>
              </CardContent>
              <CardActions>
                <Button style={{ marginBottom: '30px', marginLeft: '65%' }} onClick={() => { postOrGetPosts('POST'); }} variant="outlined">Create</Button>
              </CardActions>
            </>
            )}
          </div>
        </Card>
        {(token && postsStore) && <PostsView posts={postsStore} />}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', backgroundColor: '#282828' }} />
    </React.Fragment>
  );
}

export default Login;
