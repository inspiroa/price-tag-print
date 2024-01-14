// src/components/PriceTagList.tsx
import React from 'react';
import PriceTagSVG from './PriceTagSVG';

interface PriceTagListProps {
  items: {
    id: number;
    data: string | number;
    price: number;
    discountPrice: number;
  }[];
}

const PriceTagList: React.FC<PriceTagListProps> = ({ items }) => {
  return (
    <div className="price-tags">
      {items.map((item) => (
        <div key={item.id} className="price-tag">
          <PriceTagSVG data={item.data} price={item.price} discountPrice={item.discountPrice} />
        </div>
      ))}
    </div>
  );
};

export default PriceTagList;
