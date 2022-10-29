import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import StarRating from '../Stars/StarRating.jsx';
import RatingBar from './RatingBar.jsx';

const AverageNumContainer = styled.div`
  font-size: 40px;
  margin-right: 30px
`;

const StarBar = styled.div`
  display: flex;
  align-items: center;
  &:hover {
    background-color: #E8B90E;
  }
  margin-bottom: 5px;
`;

const Button = styled.button`
  background: inherit;
  color: grey;
  font-size: .75em;
  margin: 10px 0 0 0;
  padding: 0.25em 1em;
  border: 2px solid grey;
  border-radius: 3px;
`;

const Summary = ({metaData, reviewsList, setReviewsList, toggleObj, handleClick, handleSort, handleClearFilter}) => {

  if (!Object.keys(metaData).length) {
    return null;
  }

  const sizeDescr = ['A size too small', '1/2 a size too small', 'Perfect', '1/2 a size too big', 'A size too wide'];
  const widthDescr = ['Too narow', 'Slightly narrow', 'Perfect', 'Slightly wide', 'Too wide'];
  const comfortDescr = ['Uncomfortable', 'Slightly Uncomfortable', 'Ok', 'Comfortable', 'Perfect'];
  const qualityDescr = ['Poor', 'Below average', 'What I expected', 'Pretty great', 'Perfect'];
  const lengthDescr = ['Runs short', 'Runs slightly short', 'Perfect', 'Runs slightly long', 'Runs long'];
  const fitDescr = ['Runs tight', 'Runs slightly tight', 'Perfect', 'Runs slightly long', 'Runs long'];


  //Math for percentages
  const totalRatings = Object.values(metaData.ratings).reduce((a, b) => Number(a) + Number(b), 0);

  let rawAvg = (((1 * metaData.ratings[1]) + (2 * metaData.ratings[2]) + (3 * metaData.ratings[3]) + (4 * metaData.ratings[4]) + (5 * metaData.ratings[5])) / totalRatings);

  const averageRating = Math.round(rawAvg * 10) / 10;

  const percentRec = Math.round((metaData.recommended.true / totalRatings) * 100);

  return (
    <div>
      <div>
        <div className="average-and-stars">
          <AverageNumContainer>{averageRating}</AverageNumContainer>
          <div className="static-stars">
            <StarRating rating={averageRating}/>
          </div>
        </div>
        <div> Out of {totalRatings} total ratings</div>
      </div>
      <div><small>{percentRec}% of reviews recommend this product</small></div>
      <br/>
      <div>Rating Breakdown</div>

      {Object.values(toggleObj).includes(true) ?
        <span>
          <small>Filtered by: </small>
          {toggleObj[1] ? <span><small>1 Stars, </small></span>
            : <span/>}
          {toggleObj[2] ? <span><small>2 Stars, </small></span>
            : <span/>}
          {toggleObj[3] ? <span><small>3 Stars, </small></span>
            : <span/>}
          {toggleObj[4] ? <span><small>4 Stars, </small></span>
            : <span/>}
          {toggleObj[5] ? <span><small>5 Stars</small></span>
            : <span/>}
        </span>
        : <br/> }

      <div className="star-bars-container">
        <StarBar onClick={() => { handleClick(5); handleSort(); }}>
          <a>5 stars</a>
          <div className="bar-border">
            <div className="percentage-bar" style={{width: ((metaData.ratings[5] / totalRatings) * 182) }}></div>
          </div>
          <div><small>({metaData.ratings[5]})</small></div>
        </StarBar>
        <StarBar onClick={() => { handleClick(4); handleSort(); }}>
          <a>4 stars</a>
          <div className="bar-border">
            <div className="percentage-bar" style={{width: ((metaData.ratings[4] / totalRatings) * 182) }}></div>
          </div>
          <div><small>({metaData.ratings[4]})</small></div>
        </StarBar>
        <StarBar onClick={() => { handleClick(3); handleSort(); }}>
          <a>3 stars</a>
          <div className="bar-border">
            <div className="percentage-bar"style={{width: ((metaData.ratings[3] / totalRatings) * 182) }}></div>
          </div>
          <div><small>({metaData.ratings[3]})</small></div>
        </StarBar>
        <StarBar onClick={() => { handleClick(2); handleSort(); }}>
          <a>2 stars</a>
          <div className="bar-border">
            <div className="percentage-bar" style={{width: ((metaData.ratings[2] / totalRatings) * 182) }}></div>
          </div>
          <div><small>({metaData.ratings[2]})</small></div>
        </StarBar>
        <StarBar onClick={() => { handleClick(1); handleSort(); }}>
          <a>1 stars</a>
          <div className="bar-border">
            <div className="percentage-bar" style={{width: ((metaData.ratings[1] / totalRatings) * 182) }}></div>
          </div>
          <div><small>({metaData.ratings[1]})</small></div>
        </StarBar>
        {Object.values(toggleObj).includes(true) ?
          <Button onClick={() => handleClearFilter()}>Clear filters</Button>
          : <br/>}
      </div>
      <div className="char-bars-container">
        {metaData.characteristics.Size ?
          <div>
            <div>Size</div>
            <RatingBar
              val={metaData.characteristics.Size.value}
              descr={sizeDescr}/>
          </div> :
          null}
        <br/>
        {metaData.characteristics.Width ?
          <div>
            <div>Width</div>
            <RatingBar
              val={metaData.characteristics.Width.value}
              descr={widthDescr}/>
          </div> :
          null}
        <br/>
        {metaData.characteristics.Comfort ?
          <div>
            <div>Comfort</div>
            <RatingBar
              val={metaData.characteristics.Comfort.value}
              descr={comfortDescr}/>
          </div> :
          null}
        <br/>
        {metaData.characteristics.Quality ?
          <div>
            <div>Quality</div>
            <RatingBar
              val={metaData.characteristics.Quality.value}
              descr={qualityDescr}/>
          </div> :
          null}
        <br/>
        {metaData.characteristics.Length ?
          <div>
            <div>Length</div>
            <RatingBar
              val={metaData.characteristics.Length.value}
              descr={lengthDescr}/>
          </div> :
          null}
        <br/>
        {metaData.characteristics.Fit ?
          <div>
            <div>Fit</div>
            <RatingBar
              val={metaData.characteristics.Fit.value}
              descr={fitDescr}/>
          </div> :
          null}
        <br/>
      </div>
    </div>
  );
};

export default Summary;