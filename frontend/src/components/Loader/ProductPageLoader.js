import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ProductPageLoader() {
  return (
    <div class="container container-fluid">
      <div class="row f-flex justify-content-around">
        <div class="col-12 col-lg-5 img-fluid" id="product_image">
          <SkeletonTheme color="lightGray">
            <Skeleton height={500} width={500} />
          </SkeletonTheme>
        </div>
        <div class="col-12 col-lg-5 mt-5">
          <SkeletonTheme color="lightGray">
            <Skeleton count={2} width={`100%`} />
            <Skeleton count={3} width={`70%`} />
            <br />
            <Skeleton count={5} width={`50%`} />
            <Skeleton height={200} width={500} />
            <br />
            <Skeleton width={`30%`} />
            <br />
          </SkeletonTheme>
          <div className="d-flex" style={{ columnGap: "10px" }}>
            {Array(8)
              .fill()
              .map((item, index) => {
                return (
                  <div>
                    <SkeletonTheme color="lightGray">
                      <Skeleton circle width={40} height={40} />
                    </SkeletonTheme>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
