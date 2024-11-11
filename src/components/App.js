import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AppRouter from './Router';
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [init, setInit] = useState(false); //로그인 확인 시작 여부
  const [userObj, setUserObj] = useState(null);

  useEffect(()=>{
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        //유저정보가 있다면
        setIsLoggedIn(true);
        setUserObj(user.uid);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  },[])

  return (
    <>
      {init ? <AppRouter userObj={userObj} isLoggedIn={isLoggedIn}/>: "Initializing..."}
      
    </>
  );
}

export default App;
