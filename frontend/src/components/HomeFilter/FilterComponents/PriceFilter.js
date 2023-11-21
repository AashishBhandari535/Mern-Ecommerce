import React from "react";

export default function PriceFilter({ changePrice, setPrice, setChangePrice }) {
  const priceHandler = (e) => {
    e.preventDefault();
    setPrice([changePrice.min, changePrice.max]);
  };
  return (
    <>
      <form onSubmit={priceHandler}>
        <h4 className="pb-2">Price Range:</h4>
        <div className="d-flex mb-3" style={{ columnGap: "10px" }}>
          <input
            type="number"
            min={changePrice.min}
            placeholder="0"
            name="min"
            className="w-50 form-control"
            onChange={(e) => {
              const { name, value } = e.target;
              setChangePrice((prevData) => ({
                ...prevData,
                [name]: value,
              }));
            }}
          />
          <input
            type="number"
            max={changePrice.max}
            placeholder="1000"
            name="max"
            className="w-50 form-control"
            onChange={(e) => {
              const { name, value } = e.target;
              setChangePrice((prevData) => ({
                ...prevData,
                [name]: value,
              }));
            }}
          />
        </div>
        <button className="btn btn-block" id="view_btn">
          Apply
        </button>
      </form>
    </>
  );
}
