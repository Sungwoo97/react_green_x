import React from 'react';
import { getAuth, signOut } from "firebase/auth";
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

const Profile = ()=>{
  const navigate = useNavigate();
  const onLogoutClick = () =>{
    const auth = getAuth();

    signOut(auth).then(() => {
      // Sign-out successful.
      alert('로그아웃 되었습니다.');
      navigate('/');
    }).catch((error) => {
      // An error happened.
      alert(error);
    });
  }
  return(
    <div className='container'>
      <h1>Profile Page</h1>
      <Button variant="primary" onClick={onLogoutClick}>로그아웃</Button>
    </div>
  )
}
export default Profile;