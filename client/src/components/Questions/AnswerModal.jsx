import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import {CloudinaryContext, Image} from 'cloudinary-react';
import { fetchPhotos, openUploadWidget } from '../../HelperFunctions/CloudinaryService.js';

const Button = styled.button`
  background: white;
  color: grey;
  font-size: .75em;
  margin: 15px 0 15px 0;
  padding: 0.25em 1em;
  border: 2px solid grey;
  border-radius: 3px;
`;

const AnswerModal = (props) => {
  const [answer, setAnswer] = useState('');
  const [answerUser, setAnswerUser] = useState('');
  const [answerEmail, setAnswerEmail] = useState('');

  const [images, setImages] = useState([]);
  const photosUrls = [];

  const onA = (e) => {
    setAnswer(e.target.value);
  };

  const onAUser = (e) => {
    setAnswerUser(e.target.value);
  };

  const onAEmail = (e) => {
    setAnswerEmail(e.target.value);
  };

  const beginUpload = tag => {
    const uploadOptions = {
      cloudName: 'dqmnjwd2c',
      tags: [tag, 'image'],
      uploadPreset: 'greyjoy_cloud'
    };

    openUploadWidget(uploadOptions, (error, photos) => {
      if (!error) {
        if (photos.event === 'success') {

          setImages([...images, photos.info.url]);
        }
      } else {
        console.log(error);
      }
    });
  };

  useEffect(() => {
    fetchPhotos('image', setImages);
  }, []);

  const submitAnswer = () => {
    axios.post('/qa/questions/:question_id/ansers', {
      body: answer,
      name: answerUser,
      email: answerEmail,
      photos: images,
      // eslint-disable-next-line camelcase
      question_id: props.question.question_id
    })
      .then((res) => {
        props.get();

        console.log('after submit get');
        props.close();
      })
      .catch((err) => {
        console.log('error posting answer:', err );
      });
  };

  const onSumbitA = () => {

    let alertA = false;
    let alertAUser = false;
    let alertAEmail = false;

    if (answer === '') {
      alertA = true;
    }
    if (answerUser === '') {
      alertAUser = true;
    }
    if (answerEmail === '') {
      alertAEmail = true;
    }
    if (alertA || alertAUser || alertAEmail) {
      let alertString = [{field: answer, div: 'Your answer'}, {field: answerUser, div: 'Your nickname'}, {field: answerEmail, div: 'Your Email'}].map((form) => {
        if (form.field === '') {
          return form.div;
        }
        return false;
      }).filter((empty) => { if (empty !== false) { return true; } }).join('\n');
      alert(`You must enter the following: \n ${alertString}`);
      return;
    }
    if (answerEmail.indexOf('@') === -1 || answerEmail.slice(answerEmail.indexOf('@')).indexOf('.') === -1) {
      alert('email missing @ or . after @, please reformatting to be able to submit');
      return;
    }
    if (images.length > 5) {
      alert('can only upload 5 photos');
    }

    submitAnswer();
  };

  return (
    <div className="modal-qa" data-testid="amodal">
      <div className="modal-pop-qa">
        <div className='qa-close'><button onClick={() => { props.close(); props.interact('add answer close', 'Q&A'); }} >x</button></div>
        <div className='qa-modal-container'>
          <h2>Submit Your Answer</h2>
          <h3>{props.currentProduct.name}: {props.question.question_body}</h3>
          <div>
            <div >Your Answer*</div>
            <textarea type="textarea" name="answer" maxLength="1000" onChange={onA} />
          </div>
          <br />
          <div>
            <div >What is your nickname*</div>
            <input type="text" placeholder="Example: jack543!" name="username" maxLength="60" onChange={onAUser} />
          </div>
          For privacy reasons, do not use your full name or email address
          <div>
            <br />
            <div >Your email*</div>
            <input type="text" placeholder="Example: jack@email.com" name="email" maxLength="60"onChange={onAEmail} />
          </div>
          For authentication reasons, you will not be emailed
          <br />
          <CloudinaryContext cloudName="dqmnjwd2c">
            <div>
              <Button type="button" onClick={() => { beginUpload('image'); props.interact('upload answer photo', 'Q&A'); }}>Upload Photos</Button>
              <section>
                {images.map(i => <Image
                  key={i}
                  publicId={i}
                  fetch-format="auto"
                  quality="auto"
                  height="80px"
                  width="80px"
                />)}
              </section>
            </div>
          </CloudinaryContext>
          <Button onClick={() => { onSumbitA(); props.interact('submit answer', 'Q&A'); }}>Submit Answer</Button>
        </div>
      </div>
      <div className="modal-overlay-qa"></div>
    </div>
  );
};

export default AnswerModal;