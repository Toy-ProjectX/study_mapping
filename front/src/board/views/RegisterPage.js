import React, { useState, useEffect } from 'react'
import {useDispatch, useSelector, shallowEqual} from "react-redux"
import RegisterOrEdit from './RegisterOrEdit'
import {articleActions} from "../sagas/articleSlice"

function RegisterPage(props) {
  console.log("registerpage 호출");
    const dispatch = useDispatch();
  
    const { id, views, date, editDate, title, content } = useSelector(
      (state) => ({
        id: state.articleReducers.id,
        views: state.articleReducers.views,
        date: state.articleReducers.date,
        editDate: state.articleReducers.editDate,
        title: state.articleReducers.title,
        content: state.articleReducers.content,
      }),
      shallowEqual
    );
  
    const [IsForUpdate, setIsForUpdate] = useState(false);
  
    useEffect(() => {
      const searchParams = new URLSearchParams(props.location.search);
      if (searchParams.get("isForEdit") === "true") {
        dispatch(articleActions.fetchArticle(props.match.params.articleId));
        setIsForUpdate(true);
      }
    }, [id]);
  
    const onRegisterChange = (event) => {
      const { name, value } = event.target;
      dispatch(articleActions.changeRegisterInput({ name: name, value: value }));
    };
  
    const onSubmitArticle = (event) => {
      event.preventDefault();
  
      if (title === "" || title === null || title === undefined) {
        alert("제목을 작성하십시오.");
        return false;
      }
  
      if (content === "" || content === null || content === undefined) {
        alert("내용을 작성하십시오.");
        return false;
      }
  
      const article = {
        id: id, ///
        title: title,
        content: content,
        views: views,
        date: date,
        editDate: IsForUpdate ? Date.now() : editDate,
      };
  
      if (IsForUpdate) {
        dispatch(articleActions.updateArticle(article));
      } else {
        dispatch(articleActions.registerArticle(article));
      }
    };
  
    return (
      <>
        <RegisterOrEdit
          titleValue={title}
          contentValue={content}
          handleRegisterChange={onRegisterChange}
          handleSubmit={onSubmitArticle}
          updateRequest={IsForUpdate}
        />
      </>
    );
  }
  
  export default RegisterPage;
  
  // query 나 프로퍼티에  edit/${id}/////?isEdit=true => (api 부분에서 true 이면)(edit이면) getArticleDetail(id) data, useEffect false는 data null, 아니면 set initialState
  // 버튼도 isEdit 여부에 따라 바뀌어야 함
  // onClick 이벤트도 다르게 넣어서 dispatch registerArticle editArticle 따로 타야 함
  
  // 아니면 registerPage만 container처럼 만들어서 container에서 edit/register에 따라 props 다르게 넣어주면 되긴 함
  // https://medium.com/@ghur2002/react-router%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%98%EC%97%AC-component%EA%B0%84%EC%97%90-props-%EB%84%98%EA%B2%A8%EC%A3%BC%EA%B8%B0-610de3511c67
  // https://soldonii.tistory.com/115?category=862200
  // https://soldonii.tistory.com/112?category=862200
  // https://gongbu-ing.tistory.com/44
  
  //  =>>>> container로 빼자! (react router 의 match, search 이용, qs parse Location 이용)
  
  // 조회수는 reducer에서 처리