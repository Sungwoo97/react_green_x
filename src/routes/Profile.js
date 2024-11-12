import React, { useEffect, useState } from 'react';
import { getAuth, signOut, updateProfile  } from "firebase/auth";
import {db} from "../firebase";
import { collection,  query, orderBy, where, limit, getDocs } from "firebase/firestore"; 
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytes, getDownloadURL  } from "firebase/storage";
import { authService } from '../firebase';
import Comment from '../components/Comment';
console.log(authService);

const Profile = ()=>{
  const user = authService.currentUser;
  const profilePath = `${process.env.PUBLIC_URL}/profile_icon.svg`;
  const [profile, setProfile] = useState(profilePath);
  const [comments, setComments] = useState([]); //조회된 글 배열
  const navigate = useNavigate();

  const getComments = async ()=>{
    
    const q = query(collection(db, "comments"), where("uid", "==", user.uid), orderBy("date", "desc"), limit(5));
    const querySnapshot = await getDocs(q);
    //const commentArr = querySnapshot.docs.map(doc=>{return {...doc.data(), id:doc.id}})
    const commentArr = querySnapshot.docs.map(doc=>({...doc.data(), id:doc.id}))
    setComments(commentArr);
    
  }

  useEffect(()=>{
    getComments();
  },[]) //최소 렌더링후 실행, 변동시 실행


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
  const updateLogo = async(e)=>{
    const file = e.target.files[0];
    const storage = getStorage();   // 파일 업로드 관련 함수 초기화
    const storageRef = ref(storage, `profile/${user.uid}`);    // 파일이 저장될 위치와 이름

    // 'file' comes from the Blob or File API
    const result = await uploadBytes(storageRef, file);   //업로드 후 결과를 result에 할당

    const profileURL = await getDownloadURL(result.ref);    //업로드된 이미지의 절대 경로
    setProfile(profileURL); // 새 이미지로 프로필 교체

    const auth = getAuth();
    await updateProfile(auth.currentUser, {
      photoURL: profileURL
    });
  }
  useEffect(()=>{
    console.log(authService.currentUser.photoURL);
    user.photoURL !== null && setProfile(user.photoURL);

    
  },[])   //최초 한번 실행, 값이 변경되면 실행

  return(
    <div className='container'>
      <h1>Profile Page</h1>
      <div className="profile">
        <img src={profile} alt="" />
      </div>
        <input type="file" accept="image/*" size="sm" className="hidden" name="profile" id="profile" onChange={updateLogo} />
        <div className="d-flex gap-1 mt-3">
          <label className='btn btn-primary' htmlFor="profile">프로필 이미지 변경</label>
          <Button variant="primary" onClick={onLogoutClick}>로그아웃</Button>
        </div>
      <hr/>
      <h3>My comment List</h3>
      <ListGroup>
        {comments.map(item=> 
          <Comment key={item.id} commentObj={item} isOwener={true} />
        )}        
      </ListGroup>
    </div>
  )
}
export default Profile;