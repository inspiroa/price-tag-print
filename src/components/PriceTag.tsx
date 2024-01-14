import React from 'react';

interface PriceTagProps {
  data: string | number;
  price: number;
  discountPrice: number;
}

const PriceTag: React.FC<PriceTagProps> = ({ data, price, discountPrice }) => {
  return (
    <div className="price-tag">
      <div className="price-tag-body">
        <div className="product-name">{data}</div>
        <div className="product-price">
          <span className="original-price">{new Intl.NumberFormat('ru-RU').format(price)}</span>
          <br />
          <span className="discounted-price">{new Intl.NumberFormat('ru-RU').format(discountPrice)}₽</span>
        </div>
      </div>
    </div>
  );
};

export default PriceTag;
