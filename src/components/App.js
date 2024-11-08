import React, { useEffect, useState } from 'react';
import { authService } from '../firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AppRouter from './Router';
import { getAuth, onAuthStateChanged } from "firebase/auth";
console.log(authService);


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ init, setInit ] = useState(false);    //로그인 확인 시작 여부

  useEffect(()=>{
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        //유저 정보가 있다면
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  },[])

  return (
    <>
      {/* 로그인 확인 전에 메세지를 띄워주고 확인 이후 페이지를 보여준다 */}
      {init ? <AppRouter isLoggedIn={isLoggedIn}/> : "Initializing..."}
      
    </>
  );
}

export default App;
