import React, { useState, useEffect } from 'react';
import AnswerFeed from './AnswerFeed.jsx';
import AnswerModal from './AnswerModal.jsx';
import axios from 'axios';

const QuestionEntry = (props) => {
  const [addAnswer, setAddAnswer] = useState(false);
  const [answerScrollable, setAnswerScrollable] = useState(true);
  const [clickedBefore, setClickedBefore] = useState(false);

  const answers = Object.keys(props.question.answers).map((key) => {
    return props.question.answers[key];
  }).sort((a, b) => {
    if (a.helpfulness > b.helpfulness) {
      return -1;
    }
    if (a.helpfulness < b.helpfulness) {
      return 1;
    }
    return 0;
  });

  const yesClicked = () => {
    if (!clickedBefore) {
      setClickedBefore(!clickedBefore);
      axios.put('/qa/questions/:question_id/helpful', {question: props.question.question_id})
        .then((res) => {
          console.log('successfully put question helpful');
        })
        .catch((err) => {
          console.log('error putting question helpful: ', err);
        });
    }
  };

  const addAnswerModal = () => {
    setAddAnswer(!addAnswer);
    setAnswerScrollable(!answerScrollable);
    answerScrollable ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'scroll';
  };

  return (
    <div className="question-entry" data-testid="question">
      <div className='question-line'>
        <div>
          <span><strong>Q: {props.question.question_body}</strong></span>
        </div>
        <div>
          <span>Helpful?   {!clickedBefore && <a className='qyes' onClick={() => { yesClicked(); props.interact('question helpful', 'Q&A'); }}>  Yes </a>}
            {!clickedBefore && `(${props.question.question_helpfulness})`}
            {clickedBefore && `(${props.question.question_helpfulness + 1})`}
          </span>
          <span className='qspacer'> | </span>
          <span><a onClick={() => { addAnswerModal(); props.interact('add answer', 'Q&A'); }}>  Add Answer</a></span>
        </div>
      </div>
      <AnswerFeed answers={answers} interact={props.interact} />
      {addAnswer && <AnswerModal get={props.get} close={addAnswerModal} question={props.question} currentProduct={props.currentProduct} interact={props.interact}/>}
    </div>
  );
};

export default QuestionEntry;