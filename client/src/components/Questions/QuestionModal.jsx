import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Button = styled.button`
  background: white;
  color: grey;
  font-size: .75em;
  margin: 15px 0 15px 0;
  padding: 0.25em 1em;
  border: 2px solid grey;
  border-radius: 3px;
`;

const QuestionModal = (props) => {
  const [question, setQuestion] = useState('');
  const [questionUser, setQuestionUser] = useState('');
  const [questionEmail, setQuestionEmail] = useState('');

  const onQ = (e) => {
    setQuestion(e.target.value);
  };

  const onQUser = (e) => {
    setQuestionUser(e.target.value);
  };

  const onQEmail = (e) => {
    setQuestionEmail(e.target.value);
  };

  const submitQuestion = () => {
    axios.post('/qa/questions/', {
      body: question,
      name: questionUser,
      email: questionEmail,
      // eslint-disable-next-line camelcase
      product_id: props.product
    })
      .then((res) => {
        props.close();
      })
      .catch((err) => {
        console.log('error posting question:', err );
      });
  };

  const onSumbitQ = () => {

    let alertQ = false;
    let alertQUser = false;
    let alertQEmail = false;

    if (question === '') {
      alertQ = true;
    }
    if (questionUser === '') {
      alertQUser = true;
    }
    if (questionEmail === '') {
      alertQEmail = true;
    }
    if (alertQ || alertQUser || alertQEmail) {
      let alertString = [{field: question, div: 'Your Question'}, {field: questionUser, div: 'Your nickname'}, {field: questionEmail, div: 'Your Email'}].map((form) => {
        if (form.field === '') {
          return form.div;
        }
        return false;
      }).filter((empty) => { if (empty !== false) { return true; } }).join('\n');
      alert(`You must enter the following: \n ${alertString}`);
      return;
    }
    if (questionEmail.indexOf('@') === -1 || questionEmail.slice(questionEmail.indexOf('@')).indexOf('.') === -1) {
      alert('email missing @ or . after @, please reformatting to be able to submit');
      return;
    }

    submitQuestion();

  };


  return (
    <div className="modal-qa" data-testid="qmodal">
      <div className="modal-pop-qa">
        <div className='qa-close'> <button onClick={() => { props.close(); props.interact('close add question', 'Q&A'); }} >x</button> </div>
        <div className='qa-modal-container'>
          <h2>Ask Your Question</h2>
          <h3>About the {props.currentProduct.name}</h3>
          <div>
            <div >Your Question*</div>
            <textarea type="textarea" name="question" maxLength="1000" onChange={onQ} />
          </div>
          <br />
          <div>
            <div >What is your nickname*</div>
            <input type="text" placeholder="Example: jackson11!" name="username" maxLength="60"onChange={onQUser} />
          </div>
          For privacy reasons, do not use your full name or email address
          <div>
            <br />
            <div >Your email*</div>
            <input type="text" placeholder="Why did you like the product or not?" name="email" maxLength="60" onChange={onQEmail} />
          </div>
          For authentication reasons, you will not be emailed
          <Button onClick={() => { onSumbitQ(); props.interact('submit question', 'Q&A'); }}>Submit Question</Button>
        </div>
      </div>
      <div className="modal-overlay-qa"></div>
    </div>
  );
};

export default QuestionModal;