import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function HomeLoader() {
  return (
    <>
      <div className="container container-fluid">
        <section id="products" className="container mt-5">
          <div className="row">
            {Array(8)
              .fill()
              .map((item, index) => {
                return (
                  <div class="col-sm-12 col-md-6 col-lg-3 my-3">
                    <div className="card p-3 rounded" key={index}>
                      <SkeletonTheme color="lightGray">
                        <Skeleton height={180} width={"100%"} />
                        <Skeleton width={`80%`} count={2} />
                        <br />
                        <Skeleton count={3} width={`60%`} />
                      </SkeletonTheme>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      </div>
    </>
  );
}
