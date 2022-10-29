import React, { useState, useEffect } from 'react';
import formattedDate from '../../HelperFunctions/formattedDate.js';
import axios from 'axios';
import styled from 'styled-components';
import PhotosModal from '../Reviews/PhotosModal.jsx';

const QAThumbnail = styled.img`
  width: 40px;
  height: 40px;
  padding: 15px 0 15px 0;
`;


const Answers = (props) => {

  const formattedPhotosList = () => {
    return (props.answer.photos.map((pho) => {
      return { url: pho, clicked: false };
    }));
  };

  const [clickedYesBefore, setClickedYesBefore] = useState(false);
  const [clickedReportBefore, setClickedReportBefore] = useState(false);
  const [showPhoModal, setShowPhoModal] = useState(false);
  const [AnsPhotoClicked, setAnsPhotoClicked] = useState(true);
  const [formattedPhotos, setFormattedPhotos] = useState(formattedPhotosList());
  const [phoIsScrollable, setPhoIsScrollable] = useState(true);




  const helpfulClicked = () => {
    if (!clickedYesBefore) {
      setClickedYesBefore(!clickedYesBefore);
      axios.put('/qa/answers/:answer_id/helpful', {answer: props.answer.id})
        .then((res) => {
          console.log('successfully put answer helpful', res);
        })
        .catch((err) => {
          console.log('error putting answer helpful: ', err);
        });
    }
  };

  const reportClicked = () => {
    if (!clickedReportBefore) {
      setClickedReportBefore(!clickedReportBefore);
      axios.put('/qa/answers/:answer_id/report', {answer: props.answer.id})
        .then((res) => {
          console.log('successfully reported answer', res);
        })
        .catch((err) => {
          console.log('error putting answer helpful: ', err);
        });
    }
  };

  const toggleAnsPhoto = () => {
    setShowPhoModal(!showPhoModal);
    setPhoIsScrollable(!phoIsScrollable);
    phoIsScrollable ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'scroll';
  };

  const toggleAnsPhotoClicked = (ansPho) => {
    ansPho.clicked = AnsPhotoClicked;
    setAnsPhotoClicked(!AnsPhotoClicked);
  };

  return (
    <div className="answer" data-testid="answer">
      <span>{props.answer.body}</span>
      <br/>
      {props.answer.photos.length > 0 && <div className="thumbnails-container">
        {formattedPhotos.map((photo, i) => (
          <div className="thumbnail" key={i}>
            <QAThumbnail src={photo.url} onClick={() => { toggleAnsPhoto(); toggleAnsPhotoClicked(photo); props.interact('answer thumbnail', 'Q&A'); }} />
            {showPhoModal ? <PhotosModal toggle={toggleAnsPhoto} visible={showPhoModal} photo={photo} togglePhotoClicked={toggleAnsPhotoClicked} /> : null}
          </div>
        ))}
      </div>}
      <span>by {props.answer.answerer_name}, {formattedDate(props.answer.date)}</span>
      <span className='qspacer'> | </span>
      <span>Helpful? {!clickedYesBefore && <a className='qyes' onClick={() => { helpfulClicked(); props.interact('answer helpful', 'Q&A'); }}>Yes</a>}
        {!clickedYesBefore && `(${props.answer.helpfulness})`}
        {clickedYesBefore && `(${props.answer.helpfulness + 1})`}
      </span>
      <span className='qspacer'> | </span>
      <span>{!clickedReportBefore && <a onClick={() => { reportClicked(); props.interact('report answer', 'Q&A'); }}>Report</a>}{clickedReportBefore && <span>Reported</span>}</span>
      <br/>
    </div>
  );
};

export default Answers;