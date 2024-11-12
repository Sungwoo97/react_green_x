import React, { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { db } from '../firebase';


const Comment = ({commentObj, isOwener})=>{
  const [ edit, setEdit ] = useState(false);
  const [ comment, setComment ] = useState(commentObj.comment);
  
  const deleteComment = async()=>{
    const storage = getStorage();
    const deleteConfirm = window.confirm('정말 삭제할까요?');
    if(deleteConfirm){
      await deleteDoc(doc(db, "comments", commentObj.id));
      const storageRef = ref(storage, commentObj.img);

      // Delete the file
      deleteObject(storageRef);
    }
  }
  const toggleEditMode = ()=>{
    setEdit(prev=> !prev);  //이전 값의 반대로 출력
  }
  const onChange = (e)=>{
    // let value = e.target.value;
    const {target:{value}} = e;
    setComment(value);
  }
  const onSubmit = async (e)=>{
    e.preventDefault();
    const commentRef = doc(db, "comments", commentObj.id);

    // Set the "capital" field of the city 'DC'
    await updateDoc(commentRef, {
      comment: comment
    });
    setEdit(false);
  }

  return(
    <ListGroup.Item>
      <div className='d-flex flex-column'>
        {edit ? 
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="comment">          
              <Form.Control type="text" value={comment} onChange={onChange} placeholder="글을 입력해주세요" />
            </Form.Group>
            <div>
              <Button variant="info" type="button" onClick={toggleEditMode} >취소</Button>
              <Button variant="success" type="submit">입력</Button>
            </div>
          </Form>
        : 
        (
          <>
            {commentObj.comment}
            {commentObj.img && <div><img src={commentObj.img} width="200" alt="" /></div>}
            {isOwener &&            
              <div className='d-flex gap-1 align-self-end'>
                <Button variant="secondary" onClick={toggleEditMode} size="sm">수정</Button>
                <Button variant="danger" onClick={deleteComment} size="sm">삭제</Button>
              </div> 
            }
          </>
        )
      }
     
        
   
      </div>
    </ListGroup.Item> 
  )
}
export default Comment;