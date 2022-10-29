import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import ReviewsList from './ReviewsList.jsx';
import Dropdown from './Dropdown.jsx';
import Summary from './Summary.jsx';
import Buttons from './Buttons.jsx';

const ReviewsContainer = styled.div`
padding: 10px;
margin: 32px;
margin-bottom: 0;
display: flex;
flex-direction: column;
flex-shrink: 0;
max-width:80%
`;

const SummaryListDivider = styled.div`
width: 100%;
display: flex;
flex-shrink: 0;
@media (max-width: 958px){
  flex-direction: column
}
`;

let visibleReviewsIndex = 2;

const Reviews = ({productId, metaData, currentProduct, theme}) => {

  const [reviewsList, setReviewsList] = useState([]);
  const [visibleReviews, setVisibleReviews] = useState([]);
  const [currentSort, setCurrentSort] = useState('relevance');
  const [starsFilter, setStarsFilter] = useState([]);

  const getReviews = (id = productId, sortSelection = 'relevant') => {

    //WRITE HELPFULNESS SORT: if sortSelection === helpfullness, array.sort on current list, set both visible and reviews list to sorted

    axios({
      url: '/reviews/',
      method: 'get',
      params: {
        id: productId,
        sort: sortSelection
      }
    })
      .then((response) => {
        setReviewsList(response.data.results);
        setVisibleReviews(response.data.results.slice(0, visibleReviewsIndex));
        if (sortSelection === 'helpful') {
          setCurrentSort('helpfulness');
        } else if (sortSelection === 'relevant') {
          setCurrentSort('relevance');
        } else {
          setCurrentSort(sortSelection);
        }
      })
      .catch((err) => {
        console.log('error in client request', err);
      });
  };


  const handleMoreReviews = () => {
    visibleReviewsIndex += 2;
    setVisibleReviews(reviewsList.slice(0, visibleReviewsIndex));
  };

  const [toggleObj, setToggleObj] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false
  });

  const fiveStars = reviewsList.filter(rev => rev.rating === 5);
  const fourStars = reviewsList.filter(rev => rev.rating === 4);
  const threeStars = reviewsList.filter(rev => rev.rating === 3);
  const twoStars = reviewsList.filter(rev => rev.rating === 2);
  const oneStars = reviewsList.filter(rev => rev.rating === 1);

  const ratingsArray = [null, oneStars, twoStars, threeStars, fourStars, fiveStars];

  const handleClick = (number) => {
    toggleObj[number] = !toggleObj[number];
    let temp = JSON.parse(JSON.stringify(toggleObj));
    setToggleObj(temp);
  };

  const handleSort = () => {

    const uniqueIds = [];
    if (Object.values(toggleObj).includes(true)) {

      for (let key in toggleObj) {
        if (toggleObj[key]) {
          let currentFilter = [...ratingsArray[key]];
          const uniqueReviews = currentFilter.filter(rev => {
            const isDuplicate = uniqueIds.includes(rev.review_id);
            if (!isDuplicate) {
              uniqueIds.push(rev);
            }
          });
        }
      }
      setStarsFilter([...uniqueIds]);
    } else {
      setStarsFilter(reviewsList.slice(0, visibleReviewsIndex));
    }
  };

  const handleClearFilter = () => {
    setStarsFilter(reviewsList.slice(0, visibleReviewsIndex));
    setToggleObj({
      1: false,
      2: false,
      3: false,
      4: false,
      5: false
    });
  };

  useEffect(() => {
    handleSort();
    setVisibleReviews(starsFilter);
  }, Object.values(toggleObj));

  useEffect(() => {
    getReviews(productId);
  }, []);
  return (
    <ReviewsContainer data-testid="rev-container">
      <div>
        <div>
          <h1 data-testid="rev-header" className="rev-header">RATINGS AND REVIEWS</h1>
        </div>
        <SummaryListDivider>
          <div className="summary">
            <Summary
              metaData={metaData}
              reviewsList={reviewsList}
              setReviewsList={setReviewsList}
              toggleObj={toggleObj}
              handleClick={handleClick}
              handleSort={handleSort}
              handleClearFilter={handleClearFilter}/>
          </div>
          <div className="list">
            <Dropdown reviewsList={reviewsList}
              getReviews={getReviews}
              currentSort={currentSort}/>
            <div className="rev-list-container">
              <ReviewsList
                reviewsList={reviewsList}
                visibleReviews={visibleReviews}/>
            </div>
            <Buttons handleMoreReviews={handleMoreReviews}
              reviewsList={reviewsList}
              visibleReviews={visibleReviews}
              productId={productId}
              getReviews={getReviews}
              metaData={metaData}
              toggleObj={toggleObj}
              theme={theme}/>
          </div>
        </SummaryListDivider>
      </div>
    </ReviewsContainer>
  );
};

export default Reviews;