import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Auth = ()=>{
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState('');

  const auth = getAuth();

  const onChange = (e)=>{
    /*   
    console.log(e.target.name);

    setEmail(e.target.email);
    setPassword(e.target.password);

    if(e.target.name === 'email'){
      setEmail(e.target.email);
    } else if(e.target.name === 'password'){
      setPassword(e.target.password);
    }
    */
    const {target:{name, value}} = e;
    if(name === 'email'){
      setEmail(value);
    } else if(name === 'password'){
      setPassword(value);
    }

  }
  const onSubmit = (e)=>{
    e.preventDefault();
    if(newAccount){
      //회원가입
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        //계정생성완료후, 로그인완료   
        const user = userCredential.user; //생성된 계정의 유저정보 확인
        console.log(user);
      })
      .catch((error) => {
        //const errorCode = error.code;
        const errorMessage = error.message;  
        setError(errorMessage);
      });
    } else{
      //로그인
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        //const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
      });
    }
  }
  const toggleAccount = ()=>{
    setNewAccount(prev=>!prev);
  }
  const onGoogleSignIn = ()=>{
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(token, user);
      }).catch((error) => {
        //const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(email, credential);
        setError(errorMessage);
      });

  }

  return(
    <div className="container">
      <h1>{newAccount? '회원가입' : '로그인'}</h1>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="loginEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" name="email" onChange={onChange} placeholder="name@example.com" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="loginPW">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" onChange={onChange} />
        </Form.Group>        
        <Button variant="primary" type="submit">{newAccount? '회원가입' : '로그인'}</Button>
      </Form>
      <hr/>
        {newAccount ? (
          <Button variant="info" onClick={onGoogleSignIn}>구글로 회원가입</Button>
          ) : 
          (
          <Button variant="info" onClick={onGoogleSignIn}>구글로 로그인</Button>
          )}
        <div>{error}</div>
      <hr/>
      <Button variant="secondary" onClick={toggleAccount}>{newAccount? '로그인으로 전환' : '회원가입으로 전환'}</Button>
    </div>
  )
}
export default Auth;