import axios from 'axios';
import React, { useEffect, useState } from 'react';
import gif from '../Images/gif.gif';
import { BsSearch, BsFillFilterSquareFill } from "react-icons/bs";
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { selectedData } from './selectedData';
import { FaList, FaTh } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { setProduct } from '../redux/vendor';


const Selectedproduct = () => {
  const token = (localStorage.getItem("token"));
  const vendorIdentifier = (localStorage.getItem('selectedProduct'));
  // console.log(vendorIdentifier);
  const userId = (localStorage.getItem('userId'))
  // console.log(userId);

  const store = useSelector(state => state.vendor.selectedProductName)
  console.log(store);
  const dispatch = useDispatch()

  const [productData, setProductData] = useState([]);
  const [error, setError] = useState(null);
  const [err, setErr] = useState(null);
  const [endpoint, setEndpoint] = useState("");
  const [loader, setLoader] = useState(false);
  const [myLoader, setMyLoader] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')
  const [paginatedItems, setPaginatedItems] = useState([])

  const navigate = useNavigate();

  useEffect(() => {
    // Set the endpoint based on the selected product
    const selectedProductData = selectedData.find(item => item.name === vendorIdentifier);
    if (selectedProductData) {
      const newEndpoint = `https://service.swiftsuite.app/vendor/vendor-identifiers/${vendorIdentifier}/`;
      setEndpoint(newEndpoint);
      // console.log(newEndpoint); 
    }
  }, [vendorIdentifier]);

  useEffect(() => {
    if (endpoint && token) {
      fetchData();
    }
  }, [endpoint, token]);

  const fetchData = async () => {
    setLoader(true);
    setError(null); // Clear previous errors
    try {
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        }
      });
      console.log(response.data);
      setProductData(response.data);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      if (error.response && error.response.data) {
        if (error.response.status === 401) {
          toast.error("Token has expired");
          localStorage.removeItem("token");
          navigate("/signin");
        } else {
          setError(error.response.data.message || "Sorry, we couldn't find any results");
        }
      } else {
        setError("Sorry, we couldn't find any results");
      }
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(0); // Reset currentPage when search query changes
  };

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === "list" ? "grid" : "list"));
  };


  useEffect(() => {
    if (selectedProduct && store.includes(selectedProduct)) {
      fetchSelectedProductData();
    }
  }, [selectedProduct, store]);

  const handleSelectChange = async (event) => {
    const user = event.target.value;
    setSelectedProduct(user);
    setMyLoader(true);
    dispatch(setProduct(user));
  };

  const fetchSelectedProductData = () => {
    axios.get(`https://service.swiftsuite.app/vendor/catalogue-${vendorIdentifier}/${userId}/${selectedProduct}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      }
    })
      .then(response => {
        console.log(response.data);
        setPaginatedItems(response.data);
        setMyLoader(false);
      })
      .catch(error => {
        console.error("Error fetching selected product data:", error);
        setMyLoader(false);
      });
  };
  return (
    <div>
      <section
        className="fixed border md:gap-14  w-[100%] top-14 bg-[#089451] mt-4 py-10  lg:ms-[22%] lg:me-[2] md:me-[5%]">
        <div className="flex h-[25%] lg:ms-[-260px]  md:gap-5 gap-3 md:mx-5 mx-2 justify-center ">
          <div className="rounded-2xl pt-1 focus:outline-none p-2 bg-white h-[40px] ">
            <button
              className="flex gap-1 "
            >
              <span className="mt-1">Filter</span>
              <span className="mt-[9px] text-[#089451]">
                <BsFillFilterSquareFill />
              </span>
            </button>
          </div>
          <div className="flex lg:w-[35%] md:w-[50%] rounded-2xl h-[40px]  md:ms-0 items-center lg:gap-[100px] md:gap-[100px] bg-white">
            <input
              className="py-3 bg-transparent outline-none px-2  w-[200px] md:w-[100%]"
              type="text"
              placeholder="Search by keyword..."
              value={searchQuery}
              onChange={handleSearch}
            />
            <button
              type="submit"
              className="text-white bg-[#089451] px-3 h-[34px] rounded-r-2xl cursor-pointer lg:ms-28"
            >
              <BsSearch className="" />
            </button>
          </div>
          {/* Toggle on big screen */}
          <div className="lg:block md:hidden hidden gap-2 bg-white rounded-xl p-2 h-[36px]">
            <button
              onClick={() => {
                toggleViewMode();
              }}
              className="text-[#089451]"
            >
              {viewMode === "list" ? <FaTh size={15} /> : <FaList size={15} />}
            </button>
          </div>
          {/* Toggle on medium and small screen */}
          <div className="lg:hidden md:block block gap-2 bg-white rounded-xl h-[36px] p-2">
            <button
              onClick={() => {
                toggleViewMode();
              }}
              className="text-[#089451]"
            >
              {viewMode === "list" ? <FaTh size={15} /> : <FaList size={15} />}
            </button>
          </div>
        </div>
      </section>
      {loader && (
        <div className="flex justify-center items-center mt-20">
          <img
            src={gif}
            alt="Loading..."
            className="lg:ms-[-100px] border p-3 shadow-xl rounded-xl w-[50px] mt-10"
          />
        </div>
      )}
      {error && (
        <p>Error fetching data: {error}</p>
      )}
      {!loader && !error && (
        productData.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <select className='mt-10 bg-black absolute text-white' value={selectedProduct} onChange={handleSelectChange}>
            <option value="" disabled>Select a product</option>
            {productData.map((item, i) => (
              <option key={i} value={item.vendor_identifier}>
                {item.vendor_identifier}
              </option>
            ))}
          </select>
        )
      )}
      <div className="lg:ms-[26%] py-40 bg-green-50 p-10">
        {myLoader && (
          <div className="flex justify-center items-center">
            <img
              src={gif}
              alt="Loading..."
              className="lg:ms-[-100px] border p-3 shadow-xl rounded-xl w-[50px] mt-10"
            />
          </div>
        )}
        {error ? (
          <div className="lg:ms-[36%] text-red-500 text-xl mb-4">{error}</div>
        ) : (
          <div className="flex gap-6 mb-34">
            <div className="rounded-lg overflow-hidden">
              {!myLoader && !error &&
                (paginatedItems.length === 0 ? (
                  <div className="text-red-500 bg-green-50 h-screen text-xl lg:ms-[100px] w-[90%] mt-20">
                    Sorry, we couldn't find any results
                  </div>
                ) : (
                  <>
                    {viewMode === "list" ? (
                      <div className="list-view-container">
                        {/* List view  */}
                        {paginatedItems.map((product, index) => (
                          <div
                            className="grid grid-cols-3 mt-10 shadow-xl cursor-pointer rounded-xl bg-white mb-5"
                            key={index}
                          >
                            <div className="">
                              {/* FRAGRANCEX */}
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.image}
                                  className="w-20 mt-10 flex justify-center items-center rounded-md mx-auto object-cover"
                                />
                              ) : (
                                ''
                              )}
                              {/* LIPSEY*/}
                              {product.imagename ? (
                                <img
                                  src={`https://www.lipseyscloud.com/images/${product.imagename}`}
                                  alt={product.imagename}
                                  className="w-20 mt-10 flex justify-center items-center rounded-md mx-auto object-cover"
                                />
                              ) : (
                                ''
                              )}
                              {/* CWR */}
                              {product.image_300x300_url ? (
                                <img
                                  src={product.image_300x300_url}
                                  alt={product.image_300x300_url}
                                  className="w-20 mt-5 flex justify-center items-center rounded-md mx-auto object-cover"
                                />
                              ) : (
                                ''
                              )}
                              {/* SSI */}
                              {product.imageurl ? (
                                <img
                                  src={product.imageurl}
                                  alt={product.imageurl}
                                  className="w-20 mt-5 flex justify-center items-center rounded-md mx-auto object-cover"
                                />
                              ) : (
                                ''
                              )}
                            </div>
                            {/* FragranceX */}

                            <div className="p-4 bg-green-50 my-5 flex flex-col justify-center m-0 rounded-xl">
                              {/* <p>{product.title ? `TITLE: ${product.title}` : ""}</p> */}
                              <p>{product.name ? `NAME: ${product.name}` : ""}</p>

                              {/* Lipsey */}
                              <p>{product.type || product.category_name || product.category ? `NAME: ${product.type || product.category_name || product.category} ` : ""}</p>
                              <p>{product.manufacturer || product.manufacturer_name ? `BRAND: ${product.manufacturer || product.manufacturer_name}` : ""}</p>
                              <p>{product.price ? `PRICE: ${product.price}` : ""}</p>
                            </div>
                            <div className="p-4 flex flex-col justify-center rounded-xl">
                              {/* FragranceX */}

                              <p>{product.model || product.title ? `TITLE: ${product.model || product.title}` : ""}</p>
                              <p>{product.brand ? `BRAND: ${product.brand}` : ""}</p>
                              <p>{product.gender ? `GENDER: ${product.gender}` : ""}</p>
                              {/* Lipsey */}

                              <p>{product.quantity || product.quantity_available_to_ship_combined ? `QUANTITY: ${product.quantity || product.quantity_available_to_ship_combined}` : ""}</p>
                              <p>{product.upc || product.upc_code || product.upccode ? `UPC: ${product.upc || product.upc_code || product.upccode}` : ""}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid gap-6 sm:grid-cols-2 lg:px-0 px-4 lg:grid-cols-4">
                        {/* Grid view  */}
                        {paginatedItems.map((product, index) => (
                          <div
                            onClick={() => handleProductClick(product)}
                            className={`${filterOpen
                              ? "mt-10 shadow-xl cursor-pointer rounded-xl bg-white mb-5"
                              : "mt-0 shadow-xl cursor-pointer rounded-xl bg-white mb-5"
                              }`}
                            key={index}
                          >
                            <div className="px-4">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.image}
                                  className="w-20 mt-10 flex justify-center items-center rounded-md mx-auto object-cover"
                                />
                              ) : (
                                ''
                              )}
                              {/* CWR */}
                              {product.image_300x300_url ? (
                                <img
                                  src={product.image_300x300_url}
                                  alt={product.image_300x300_url}
                                  className="w-20 mt-5 flex justify-center items-center rounded-md mx-auto object-cover"
                                />
                              ) : (
                                ''
                              )}
                              {/* LIPSEY*/}
                              {product.imagename ? (
                                <img
                                  src={`https://www.lipseyscloud.com/images/${product.imagename}`}
                                  alt={product.imagename}
                                  className="w-20 mt-10 flex justify-center items-center rounded-md mx-auto object-cover"
                                />
                              ) : (
                                ''
                              )}
                              {/* SSI */}
                              {product.imageurl ? (
                                <img
                                  src={product.imageurl}
                                  alt={product.imageurl}
                                  className="w-20 mt-5 flex justify-center items-center rounded-md mx-auto object-cover"
                                />
                              ) : (
                                ''
                              )}
                              {/* FragranceX */}
                              {/* <p>{product.title ? `TITLE: ${product.title}` : ""}</p> */}
                              <p>{product.name || product.category ? `NAME: ${product.name || product.category}` : ""}</p>
                              <p>{product.brand ? `BRAND: ${product.brand}` : ""}</p>
                              <p>{product.gender ? `GENDER: ${product.gender}` : ""}</p>

                              {/* Lipsey */}
                              <p>{product.model || product.title ? `TITLE: ${product.model || product.title}` : ""}</p>
                              <p>{product.manufacturer || product.manufacturer_name ? `BRAND: ${product.manufacturer || product.manufacturer_name}` : ""}</p>
                              <p>{product.price ? `PRICE: ${product.price}` : ""}</p>
                              <p>{product.quantity ? `QUANTITY: ${product.quantity}` : ""}</p>
                              <p>{product.upc || product.upccode ? `UPC: ${product.upc || product.upccode}` : ""}</p>
                              {/* cwr */}
                              {/* <p>{product.manufacturer_name && 'BRAND: '+ product.manufacturer_name}</p> */}
                              <p>{product.category_name && 'NAME: ' + product.category_name}</p>
                              <p>{product.upc_code && 'UPC: ' + product.upc_code}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>

                ))}
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Selectedproduct;
