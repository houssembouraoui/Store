import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { product } from "../../../dummyData";

import ALink from "../../features/alink.jsx";

function HeaderSearch() {
  const router = useRouter("");
  const [cat, setCat] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [searchProducts, { data }] = useState(product);
  const result = data && data.products.data;
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    document.querySelector("body").addEventListener("click", closeSearchForm);

    return () => {
      document
        .querySelector("body")
        .removeEventListener("click", closeSearchForm);
    };
  }, []);

  useEffect(() => {
    if (result && searchTerm.length > 2)
      setProducts(
        result.reduce((acc, product) => {
          let max = 0;
          let min = 999999;
          product.variants.map((item) => {
            if (min > item.price) min = item.price;
            if (max < item.price) max = item.price;
          }, []);

          if (product.variants.length == 0) {
            min = product.sale_price ? product.sale_price : product.price;
            max = product.price;
          }

          return [
            ...acc,
            {
              ...product,
              minPrice: min,
              maxPrice: max,
            },
          ];
        }, [])
      );
  }, [result, searchTerm]);

  useEffect(() => {
    if (searchTerm.length > 2) {
      if (timer) clearTimeout(timer);
      let timerId = setTimeout(() => {
        searchProducts({
          variables: {
            searchTerm: searchTerm,
            category: cat,
          },
        });
      }, 500);
      setTimer(timerId);
    }
  }, [searchTerm, cat]);

  useEffect(() => {
    document.querySelector(".header-search.show-results") &&
      document
        .querySelector(".header-search.show-results")
        .classList.remove("show-results");
  }, [router.pathname]);

  function matchEmphasize(name) {
    let regExp = new RegExp(searchTerm, "i");
    return name.replace(regExp, (match) => "<strong>" + match + "</strong>");
  }

  function closeSearchForm(e) {
    if (!e.target.closest(".header-search")) {
      document
        .querySelector(".header .search-toggle")
        .classList.remove("active");
      document
        .querySelector(".header .header-search-wrapper")
        .classList.remove("show");
    }
  }

  function onCatSelect(e) {
    setCat(e.target.value);
  }

  function onSearchChange(e) {
    setSearchTerm(e.target.value);
  }

  function onSearchToggle(e) {
    e.stopPropagation();
    document.querySelector(".header .search-toggle").classList.toggle("active");
    document
      .querySelector(".header .header-search-wrapper")
      .classList.toggle("show");
  }

  function showSearchForm(e) {
    e.stopPropagation();
    document.querySelector(".header .header-search").classList.add("show");
  }

  function onSubmitSearchForm(e) {
    e.preventDefault();
    router.push({
      pathname: "/shop/sidebar/list",
      query: {
        searchTerm: searchTerm,
        category: cat,
      },
    });
  }

  function goProductPage() {
    setSearchTerm("");
    setProducts([]);
  }

  return (
    <div className="header-search">
      <button className="search-toggle" onClick={onSearchToggle}>
        <i className="icon-search"></i>
      </button>

      <form
        action="#"
        method="get"
        onSubmit={onSubmitSearchForm}
        onClick={showSearchForm}
      >
        <div className="header-search-wrapper">
          <label htmlFor="q" className="sr-only" value={searchTerm} required>
            Search
          </label>
          <input
            type="text"
            onChange={onSearchChange}
            value={searchTerm}
            className="form-control"
            name="q"
            placeholder="Search product ..."
            required
          />
          <div className="live-search-list" onClick={goProductPage}>
            {products.length > 0 && searchTerm.length > 2 ? (
              <div className="autocomplete-suggestions">
                {searchTerm.length > 2 &&
                  products.map((product, index) => (
                    <ALink
                      href={`product/${product.id}`}
                      className="autocomplete-suggestion"
                      key={`search-result-${index}`}
                    >
                      <LazyLoadImage
                        src={
                          product.image[0]
                        }
                        width={40}
                        height={40}
                        alt="product"
                      />
                      <div
                        className="search-name"
                        dangerouslySetInnerHTML={safeContent(
                          matchEmphasize(product.name)
                        )}
                      ></div>
                      <span className="search-price">
                        {product.stock == 0 ? (
                          <div className="product-price mb-0">
                            <span className="out-price">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                        ) : product.minPrice == product.maxPrice ? (
                          <div className="product-price mb-0">
                            ${product.minPrice.toFixed(2)}
                          </div>
                        ) : product.variants.length == 0 ? (
                          <div className="product-price mb-0">
                            <span className="new-price">
                              ${product.minPrice.toFixed(2)}
                            </span>
                            <span className="old-price">
                              ${product.maxPrice.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <div className="product-price mb-0">
                            ${product.minPrice.toFixed(2)}&ndash;$
                            {product.maxPrice.toFixed(2)}
                          </div>
                        )}
                      </span>
                    </ALink>
                  ))}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default HeaderSearch;
