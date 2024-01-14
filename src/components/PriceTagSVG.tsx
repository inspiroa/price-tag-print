// src/components/PriceTagSVG.tsx
import React from 'react';
import priceTagSVG from '../assets/price-tag.svg'; // Adjust the import path based on your project structure
import '../App.css'

interface PriceTagSVGProps {
  data: string | number;
  price: number;
  discountPrice: number;
}

const PriceTagSVG: React.FC<PriceTagSVGProps> = ({ data, price, discountPrice }) => {
  return (
    <div className="price-tag-svg">
      <div className="price-tag-image">
        <img src={priceTagSVG} alt="Price Tag" />
        <div className="product-details">
          <div className="product-name">{data}</div>
          <div className="product-price">
            <span className="original-price">{new Intl.NumberFormat('ru-RU').format(price)}</span>
            <br />
            <span className="discounted-price">{new Intl.NumberFormat('ru-RU').format(discountPrice)}₽</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceTagSVG;
