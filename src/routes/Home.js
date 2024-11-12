import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import {db} from "../firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot  } from "firebase/firestore"; 
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import ListGroup from 'react-bootstrap/ListGroup';
import Comment from '../components/Comment';
import { v4 as uuidv4 } from 'uuid';    //파일 이름 암호화할 때 사용할 랜덤 함수

const Home = ({userObj})=>{
  const [comment, setComment] = useState(''); //입력하는 글 정보
  const [comments, setComments] = useState([]); //조회된 글 배열
  const [attachment, setAttachment] = useState(); //파일을 올렸을때 올라온 파일
  

  // Get a reference to the storage service, which is used to create references in your storage bucket
  const storage = getStorage();
  // Create a storage reference from our storage service
  const storageRef = ref(storage);

  const getComments = async ()=>{
     /*
    const q = query(collection(db, "comments"), orderBy("date", "desc"), limit(5));

    const querySnapshot = await getDocs(q);
   
    //const commentArr = querySnapshot.docs.map(doc=>{return {...doc.data(), id:doc.id}})
    const commentArr = querySnapshot.docs.map(doc=>({...doc.data(), id:doc.id}))
    setComments(commentArr);

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const commentObj = {
        ...doc.data(),
        id:doc.id
      }
      setComments(prev=>[commentObj, ...prev]);
    });
 */


    const q = query(collection(db, "comments"),  orderBy("date", "desc"), limit(5));
     onSnapshot(q, (querySnapshot) => {
      const commentArr = querySnapshot.docs.map(doc=>({...doc.data(), id:doc.id}))
      setComments(commentArr);
      });
  }

  useEffect(()=>{
    getComments();
  },[]) //최소 렌더링후 실행, 변동시 실행

  const onChange = (e)=>{
    // let value = e.target.value;
    const {target:{value}} = e;
    setComment(value);
  }
  const onSubmit = async (e)=>{
    e.preventDefault();
    const storageRef = ref(storage, `${userObj}/${uuidv4()}`);

    uploadString(storageRef, attachment, 'data_url').then(async(snapshot) => {
      const imageURL = await getDownloadURL(storageRef);
      try {
        await addDoc(collection(db, "comments"), {
          comment:comment,
          date:serverTimestamp(),
          uid:userObj,
          img:imageURL
        });
  
        document.querySelector('#comment').value='';
        setAttachment('');
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    });

  }
  const onFileChange = (e)=>{
    console.log(e.target.files[0]);
    const theFile = e.target.files[0];
    /*
    const { target : {files}} = e;  //비구조 할당
    const theFile = files[0];
    */
    const reader = new FileReader();
    /*
    reader.addEventListener(
      "load",
      (e) => {
        console.log(e.target.result);
      },
      false,
    ); */
    reader.onloadend = (e)=>{
      setAttachment(e.target.result);
    }
    if (theFile) {
      reader.readAsDataURL(theFile);
    }
  }
  const onClearFile = ()=>{
    setAttachment(null);
  }

  return(
    <div className="container">
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="comment">          
          <Form.Control type="text" onChange={onChange} placeholder="글을 입력해주세요" />
        </Form.Group>
        <Form.Group controlId="formFileSm" className="mb-3">
          <Form.Label>이미지</Form.Label>
          <Form.Control type="file" accept="image/*" size="sm" onChange={onFileChange} />
        </Form.Group>
        {attachment && <div>
          <img src={attachment} width="200"  alt="" />
          <Button variant="secondary" size="sm" type="button" onClick={onClearFile}>취소</Button>
        </div>}
        <Button variant="primary" type="submit">입력</Button>
      </Form>
      <hr/>
      <ListGroup>
        {comments.map(item=> 
          <Comment key={item.id} commentObj={item} isOwener={item.uid === userObj} />
        )}        
      </ListGroup>
    </div>
  )
}
export default Home;