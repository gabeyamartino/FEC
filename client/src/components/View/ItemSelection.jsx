import React, { useState, useEffect } from 'react';
import { DropDownContainer, DropDownHeader, DropDownListContainer, DropDownList, ListItem } from './Styled/DropDownStyles.jsx';
import { Button, CartContainer } from './Styled/Form.styled.jsx';
import { FaChevronDown, FaMinus, FaPlus } from 'react-icons/fa';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const ItemSelection = ({ currentDisplayedStyle, productId, addToCart, cartContents }) => {

  const [sizeDropdownIsOpen, setSizeDropDownOpen] = useState(false);
  const [quantityDropdownIsOpen, setQuantityDropDownOpen] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);
  const [sizeChosen, setSizeChosen] = useState(false);
  const [qtyChosen, setQtyChosen] = useState(0);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});



  //makes array of sku-sizes objects
  const sizeArrayMaker = (obj) => {
    const styleArr = [];
    for (let key in obj.skus) {
      let newObj = obj.skus[key];
      if (obj.skus[key].quantity === null) {
        setOutOfStock(true);
      }
      newObj.sku = key;
      newObj.product_id = productId;
      newObj.style_id = obj.style_id;
      styleArr.push(newObj);
    }

    return styleArr;
  };

  //handlers for size and quantity dropdowns
  const toggleSizeDropdown = () => {
    console.log('size dropdown should be toggled');
    setSizeDropDownOpen(!sizeDropdownIsOpen);
  };

  const toggleQuantityDropdown = () => {
    console.log('quantity dropdown should be toggled');
    setQuantityDropDownOpen(!quantityDropdownIsOpen);
  };

  // Closes the dropdowns when the mouse stops hovering
  const handleMouseLeavingSizeDropDown = (event) => {
    setSizeDropDownOpen(false);
  };

  const handleMouseLeavingQuantityDropDown = (event) => {
    setQuantityDropDownOpen(false);
  };

  //sets selected Sku/size for quantity/cart
  const handleSizeSelection = (index) => {
    let skuObj = {};
    Object.assign(skuObj, items[index]);
    // console.log(skuObj);
    setSizeChosen(true);
    setSelectedItem(skuObj);
    setSizeDropDownOpen(false);
  };

  //When a sku / size has been selected, the fn below should make an arr with the appropriate quantity represented.
  const quantityArrayMaker = () => {
    // console.log('inside quantityArrayMaker');
    // console.log('these are the currentCartContents >', cartContents);
    let quantityArr = [];
    let correctQty;

    if (cartContents.length > 0) {
      cartContents.forEach(cartObj => {
        console.log(cartObj, '<--- cart is being checked');
        if (cartObj.sku === selectedItem.sku
          && cartObj.product_id === selectedItem.product_id
          && cartObj.style_id === selectedItem.style_id) {
          correctQty = cartObj.quantity;
        } else {
          correctQty = selectedItem.quantity;
        }
      });
    } else {
      correctQty = selectedItem.quantity;
    }
    /* if the selected thing is already in cart, use qty available in the cart. When setting the cart contents, update quantity availble by subtracting the selectedQty from quantity */
    if (correctQty >= 15) {
      quantityArr = Array.from(Array(16).keys());

    } else if (correctQty === 0) {
      // quantityArr make it so it says it's out of stock
      quantityArr.push(0);
      console.log('this item is out of stock');
    } else {
      quantityArr = Array.from(Array(correctQty + 1).keys());
    }
    quantityArr.splice(0, 1);
    return quantityArr;
  };

  //Fn - when a quantity has been chosen, it will update the current sku obj
  const updateSelectedQty = (qty = 1) => {
    let newObj = {};
    Object.assign(newObj, selectedItem);
    newObj.selectedQty = qty;
    setSelectedItem(newObj);
    setQtyChosen(qty);
  };

  //button to add selected items to cart
  const onSubmitButton = (event) => {
    if (sizeChosen) {
      addToCart(selectedItem);
      setQtyChosen(0);
      setSizeChosen(false);
    }
  };

  //useEffect to ensure that the sizing updates to newly selected style and resets size dropdown
  useEffect(() => {
    setItems(sizeArrayMaker(currentDisplayedStyle));
    setSizeChosen(false);
  }, [currentDisplayedStyle]);

  return (
    <CartContainer>
      {/* <Dropdown options={items}/> */}
      {
        outOfStock && <DropDownContainer className="dropdown-size-container">
          <DropDownHeader>
            Out of Stock
          </DropDownHeader>
        </DropDownContainer>
      }
      {
        !outOfStock && <DropDownContainer className="dropdown-size-container"
        onMouseLeave={(e) => { handleMouseLeavingSizeDropDown(); }}
        >
          <DropDownHeader onClick={toggleSizeDropdown}>
            {
              sizeChosen && <>
                <span>{selectedItem.size}</span>
                <FaChevronDown style={{ color: '#B0B0B0' }} />
              </>
            }
            {
              !sizeChosen && <>
                Select Size
                <FaChevronDown style={{ color: '#B0B0B0' }} />

              </>
            }
          </DropDownHeader>
          <DropDownListContainer className="dropdown-size-container">
            {
              sizeDropdownIsOpen && <DropDownList>
                {items.map((item, index) => {
                  return (
                    <ListItem key={index} onClick={(e) => { handleSizeSelection(index); }} value={item.sku}>
                      {item.size}
                    </ListItem>
                  );
                })}
              </DropDownList>

            }
          </DropDownListContainer>

        </DropDownContainer>
      }
      {
        !sizeChosen && <DropDownContainer className="dropdown-qty-container">
          <DropDownHeader>
            <FaMinus style={{ color: '#B0B0B0' }} /> <FaChevronDown style={{ color: '#B0B0B0' }} />
          </DropDownHeader> </DropDownContainer>
      }
      {
        sizeChosen && <DropDownContainer className="dropdown-qty-container" onClick={toggleQuantityDropdown} onMouseLeave={handleMouseLeavingQuantityDropDown}>
          {
            !qtyChosen && <DropDownHeader>
              1 {<FaChevronDown style={{ color: '#B0B0B0' }} />}
            </DropDownHeader>
          }
          {
            qtyChosen > 0 && <DropDownHeader>
              {qtyChosen} <FaChevronDown style={{ color: '#B0B0B0' }} />
            </DropDownHeader>
          }
          <DropDownListContainer>
            {
              quantityDropdownIsOpen && <DropDownList>
                {
                  quantityArrayMaker().map((num, index) => {
                    return (<ListItem key={index} value={num} onClick={(event) => { updateSelectedQty(num); }}>{num}</ListItem>);
                  })
                }
              </DropDownList>
            }
          </DropDownListContainer>
        </DropDownContainer>
      }

      <Button onClick={onSubmitButton}>Add to Cart{<FaPlus style={{ color: '#B0B0B0' }} />}</Button>
    </CartContainer>
  );
};

export default ItemSelection;

// export {DropDownContainer, DropDownHeader, DropDownListContainer, DropDownList, ListItem};