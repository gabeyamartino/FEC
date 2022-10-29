import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StarRating from '../Stars/StarRating.jsx';
import Characteristic from './Characteristic.jsx';
import styled from 'styled-components';
import {CloudinaryContext, Image} from 'cloudinary-react';
import { fetchPhotos, openUploadWidget } from '../../HelperFunctions/CloudinaryService.js';


const Button = styled.button`
  background: inherit;
  color: grey;
  font-size: .75em;
  margin: 15px 0 15px 0;
  padding: 0.25em 1em;
  border: 2px solid grey;
  border-radius: 3px;
`;

let postableObj = {};


const ReviewModal = ({toggle, productId, getReviews, metaData, theme}) => {

  let name;
  if (productId === 37311) {
    name = 'Camo Onesie';
  } else if (productId === 37312) {
    name = 'Bright Future Sunglasses';
  } else if (productId === 37313) {
    name = 'Morning Joggers';
  } else if (productId === 37314) {
    name = 'Slacker\'s Slacks';
  }

  const [recommend, setRecommend] = useState(null);
  const [stars, setStars] = useState(0);

  const [size, setSize] = useState(0);
  const sizeDescr = ['A size too small', '1/2 a size too small', 'Perfect', '1/2 a size too big', 'A size too wide'];


  const [width, setWidth] = useState(0);
  const widthDescr = ['Too narow', 'Slightly narrow', 'Perfect', 'Slightly wide', 'Too wide'];

  const [comfort, setComfort] = useState(0);
  const comfortDescr = ['Uncomfortable', 'Slightly Uncomfortable', 'Ok', 'Comfortable', 'Perfect'];

  const [quality, setQuality] = useState(0);
  const qualityDescr = ['Poor', 'Below average', 'What I expected', 'Pretty great', 'Perfect'];

  const [length, setLength] = useState(0);
  const lengthDescr = ['Runs short', 'Runs slightly short', 'Perfect', 'Runs slightly long', 'Runs long'];

  const [fit, setFit] = useState(0);
  const fitDescr = ['Runs tight', 'Runs slightly tight', 'Perfect', 'Runs slightly long', 'Runs long'];

  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');

  const [minCounter, setMinCounter] = useState(50);

  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');

  const [images, setImages] = useState([]);
  const photosUrls = [];

  const lightTheme = '#D5D8E7';
  const darkTheme = '#1F2224';

  const beginUpload = tag => {
    const uploadOptions = {
      cloudName: 'dqmnjwd2c',
      tags: [tag, 'image'],
      uploadPreset: 'greyjoy_cloud'
    };

    openUploadWidget(uploadOptions, (error, photos) => {
      if (!error) {
        console.log(photos);
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

  const selectStars = (int) => {
    setStars(int);
  };

  const handleSubmit = (e) => {

    axios({
      url: '/reviews',
      method: 'post',
      data: {
        'product_id': productId,
        rating: stars,
        summary: summary,
        body: body,
        recommend: recommend,
        name: nickname,
        email: email,
        photos: images,
        characteristics: postableObj
      }
    })
      .then((response) => {

      })
      .catch((err) => {
        console.log('IN CLIENT POST', err);
      });
  };



  return (
    <div>
      <div data-testid="rev-modal" className="modal">
        <div style={theme === 'light' ? {background: lightTheme} : {background: darkTheme}} className="rev-modal-pop" role="dialog" aria-modal="true">
          <button className="rev-modal-close" type="button" onClick={() => toggle()}>Close</button>
          <form>
            <h2 data-testid="write-rev" className="write-rev">Write Your Review</h2>
            <h3>About the {name}</h3>
            <br/>
            <div>
              <div>
                <div>Overall Rating <small>*</small></div>
                <div className="dynamic-stars">
                  <StarRating selectStars={selectStars} stars={stars}/>
                </div>
              </div>
              <br/>
              <div>
                <div>Do you recommend this product? <small>*</small></div>
                <input type="radio" id="yes" name="rec" required onClick={() => setRecommend(true)}/>
                <label htmlFor="yes">Yes</label>
                <input type="radio" id="no" name="rec" onClick={() => setRecommend(false)}/>
                <label htmlFor="no">No</label>
              </div>
              <br/>
              <div>Please select an option for each characteristic below <small>*</small></div>
              {metaData.characteristics.Size ?
                <Characteristic
                  char={size}
                  setChar={setSize}
                  name={'Size'}
                  descr={sizeDescr}
                  postableObj={postableObj}
                  charId={metaData.characteristics.Size.id}/>
                : null}
              {metaData.characteristics.Width ?
                <Characteristic
                  char={width}
                  setChar={setWidth}
                  name={'Width'}
                  descr={widthDescr}
                  postableObj={postableObj}
                  charId={metaData.characteristics.Width.id}/>
                : null}
              <br/>
              {metaData.characteristics.Comfort ?
                <Characteristic
                  char={comfort}
                  setChar={setComfort}
                  name={'Comfort'}
                  descr={comfortDescr}
                  postableObj={postableObj}
                  charId={metaData.characteristics.Comfort.id}/>
                : null}
              <br/>
              {metaData.characteristics.Quality ?
                <Characteristic
                  char={quality}
                  setChar={setQuality}
                  name={'Quality'}
                  descr={qualityDescr}
                  postableObj={postableObj}
                  charId={metaData.characteristics.Quality.id}/>
                : null}
              <br/>
              {metaData.characteristics.Length ?
                <Characteristic
                  char={length}
                  setChar={setLength}
                  name={'Length'}
                  descr={lengthDescr}
                  postableObj={postableObj}
                  charId={metaData.characteristics.Length.id}/>
                : null}
              <br/>
              {metaData.characteristics.Fit ?
                <Characteristic
                  char={fit}
                  setChar={setFit}
                  name={'Fit'}
                  descr={fitDescr}
                  postableObj={postableObj}
                  charId={metaData.characteristics.Fit.id}/>
                : null}
              <br/>
              <br/>
              <div>
                <div className="sum-container">
                  <div>Review Summary</div>
                  <input
                    onChange={(e) => setSummary(e.target.value)}
                    type="text"
                    placeholder="Example: Best purchase ever!"
                    maxLength="60"
                  />
                </div>
                <br/>
                <div>Review Body <small>*</small></div>
                <textarea
                  className="rev-body-input"
                  onChange={(e) => setBody(e.target.value)}
                  type="textarea"
                  required
                  placeholder="Why did you like the product or not?"
                  maxLength="1000"
                  minLength="50"
                />
              </div>
              {body.length >= 50 ?
                <div><small>Minimum reached</small></div>
                : <div><small>Minimum required characters left: {minCounter - body.length}</small></div>}
            </div>
            <CloudinaryContext cloudName="dqmnjwd2c">
              <div>
                <Button type="button" onClick={() => beginUpload('image')}>Upload Photos</Button>
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
            <div>
              <div>What is your nickname? <small>*</small></div>
              <input
                onChange={(e) => setNickname(e.target.value)}
                type="text"
                placeholder="Example: FrodoSwaggins" />
            </div>
            <br/>
            <div>
              <div>Your email <small>*</small></div>
              <input
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                placeholder="Example: frodo11@email.com" />
            </div>
            <br/>
            <Button type="submit" onClick={(e) => handleSubmit(e)}>Submit</Button>
          </form>
        </div>
        <div className="modal-overlay" ></div>
      </div>
    </div>
  );
};

export default ReviewModal;