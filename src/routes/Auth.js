import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "firebase/auth";

const Auth = ()=>{
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ newAccount, setNewAccount ] = useState(true);
  const [ error, setError ] = useState('');

  const auth = getAuth();



 
  const onChange = (e)=>{
    // const email = e.target.name;
    // const password = e.target.name;
    // const emailValue = e.target.email;
    // const passwordValue = e.target.password;

    const {target: {name, value}} = e;      // e.target 안의 name, value를 값을 변수로 지정
    if(name === 'email'){
      setEmail(value);
    }else if ( name === 'password'){
      setPassword(value);
    }

 
  }
  const onSubmit = (e)=>{ 
    e.preventDefault();
    if(newAccount){
      //회원가입
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // 계정 생성 완료 후 , 로그인 완료
          const user = userCredential.user;   // 생성된 계정의 유저 확인
          console.log(user);
        })
        .catch((error) => {
          // const errorCode = error.code;
          const errorMessage = error.message;
          setError(errorMessage);
        });
    }else{
      // 로그인
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        // const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
      });
    }
  }
  const toggleAccount = ()=>{
    setNewAccount(prev=>!prev);
  }
  return(
    <div className="container">
      <h1>{newAccount ? 'Account' : 'Login' } Form</h1>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="loginEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" name="email" onChange={onChange} placeholder="name@example.com" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="loginPW">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" onChange={onChange} />
        </Form.Group>
        <Button type="submit" variant="primary">{newAccount ? 'Account' : 'Login' }</Button>
        <div className="mt-3">{error}</div>
      </Form>
      <hr/>
      <Button  variant="secondary" onClick={toggleAccount}>{newAccount ? '로그인으로 전환' : '회원가입으로 전환' }</Button>
    </div>
  )
}
export default Auth;