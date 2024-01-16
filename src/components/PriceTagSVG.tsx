import React, { useState, useEffect } from "react";
import priceTagSVG from "../assets/price-tag.svg"; // Adjust the import path based on your project structure
import "../App.css";

interface PriceTagSVGProps {
  data: string | number;
  price: number;
  discountPrice: number;
}

const PriceTagSVG: React.FC<PriceTagSVGProps> = ({
  data,
  price,
  discountPrice,
}) => {
  const [fontSize, setFontSize] = useState<number>(16);
  const [key, setKey] = useState<number>(0);

  useEffect(() => {
    const element = document.getElementById(`product-name-${data}`);
    if (element) {
      const isOverflown =
        element.scrollHeight > element.clientHeight ||
        element.scrollWidth > element.clientWidth;

      if (isOverflown) {
        setFontSize((prevFontSize) => Math.max(prevFontSize - 1, 2));
        setKey((prevKey) => prevKey + 1);
      }
    }
  }, [data, key]);

  return (
    <div className="price-tag-svg">
      <div className="price-tag-image">
        <img src={priceTagSVG} alt="Price Tag" />
        <div className="product-details">
          <div
            id={`product-name-${data}`}
            className="product-name"
            style={{ fontSize: `${fontSize}px` }}
            key={key}
          >
            {data}
          </div>
          <div className="product-price">
            <span className="original-price">
              {new Intl.NumberFormat("ru-RU").format(price)}
            </span>
            <br />
            <span className="discounted-price">
              {new Intl.NumberFormat("ru-RU").format(discountPrice)}₽
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceTagSVG;
