import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { countries } from '../Countries';
import { ArrowLeft } from 'react-feather';
import { Link } from 'react-router-dom';




const Walmart = () => {
  const store = useSelector(state => state.vendor.vendorData)

  const vendorName = (localStorage.getItem('vendorName'));
  //   console.log(vendorName);



  const [price, setPrice] = useState(false);
  const [quantity, setQuantity] = useState(false);
  const [business, setBusiness] = useState(false);
  const [warn, setWarn] = useState(false)
  const [copyright, setCopyright] = useState(false)

  // console.log(copyright);
  const [selectedCountry, setSelectedCountry] = useState("");

  const [sendMinPrice, setSendMinPrice] = useState(null);
  console.log(sendMinPrice);


  const Schema = yup.object().shape({
    marketplacename: yup.string().required(),
    storeid: yup.string().required(),
    paypalemail: yup.string().required(),
    fixed: yup.string().required(),
    marketfix: yup.string().required(),
    businessprice: yup.string().required(),
    roistrategy: yup.string().required(),
    minprofit: yup.string().required(),
    margin: yup.string().required(),
    maximumquantity: yup.string().required(),
  })

  const { register, handleSubmit, formState: { errors }, } = useForm({
    resolver: yupResolver(Schema)
  })

  const onSubmit = (data) => {
    const formData = { ...data, marketPlaceRegion: selectedCountry, sendMinPrice };
    console.log(formData);
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
    console.log(selectedCountry);
  };

  const handleCheckboxChange = (value) => {
    setSendMinPrice(value);
  };


  return (
    <>
      <div className="flex justify-between items-center mt-5">
        <div className="flex items-center gap-4">
          <Link to="/layout/mymarket" className="flex items-center gap-2 mt-5 hover:bg-orange-800 bg-orange-500 rounded-lg text-white p-2">
            <ArrowLeft size={20} />
            Return
          </Link>
        </div>
        <p className='relative lg:top-4 md:top-[-2px] lg:left-0 md:left-10 ms-3 top-[-4px] font-bold text-xl'>Edit Walmart Account</p>
      </div>
      <section className='bg-green-50 mb-10 '>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='bg-white lg:w-[100%] w-[93%] md:w-[90%] lg:ms-0 md:ms-10 lg:h-[20%] ms-3 py-10 lg:mt-8 mt-0'>
            <div>
              <h1 className='ms-5 lg:text-xl text-sm font-bold'>Account Information</h1>
              <div>
                <div className='flex lg:gap-28 md:gap-12  mt-5 px-5'>
                  <h3 className='pt-1 text-sm font-semibold h-[35px] w-[55%] md:w-[52%] lg:w-[30%]'>Marketplace Name:</h3>
                  <input {...register("marketplacename", { required: true })} type="text" className='border h-[35px] w-[50%] p-3 md:w-[201px] lg:w-[230px] border-gray-500 focus:outline-none py-1 rounded' />
                </div>
                <small className='text-red-600 md:ms-[59%] lg:ms-[50%] ms-[150px]'>{errors.marketplacename && <span>This field is required</span>}</small>
              </div>

              <div className='flex lg:ms-0 md:ms-0 ms-1 md:gap-12 lg:gap-28 border-gray-300 lg:p-5 p-4 focus:outline-border-gray-500'>
                <label className='mt-2 text-sm font-semibold h-8 lg:w-[30%] md:w-[52%] w-[55%]' htmlFor="">Marketplace Region:</label>
                <select
                  className="px-4 mb-4 lg:w-[230px] h-[38px] md:w-[201px] w-[50%] bg-white border border-black rounded-md shadow-sm focus:outline-none"
                  value={selectedCountry}
                  onChange={handleCountryChange}
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.name} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className='flex lg:gap-28 md:gap-12  mt-2 px-5'>
                  <h3 className='mt-2 text-sm font-semibold h-[25px]   w-[55%] md:w-[52%] lg:w-[30%]'>Store ID:</h3>
                  <input {...register("storeid", { required: true })} type="text" className='border h-[35px] w-[50%] p-3 md:w-[201px] lg:w-[230px] border-gray-500 focus:outline-none py-1 rounded' />
                </div>
                <small className='text-red-600 md:ms-[62%] lg:ms-[55%]  ms-[185px]'> {errors.storeid && <span>This field is required</span>}</small>
              </div>

              <div className='flex lg:gap-28 md:gap-12 mt-5 px-5'>
                <h3 className='mt-2 text-sm font-semibold h-[25px]  w-[55%] md:w-[52%]  lg:w-[30%]'>Store Logo:</h3>
                <input {...register("storelogo")} type="file" className='h-[35px] w-[50%] md:w-[201px] lg:w-[230px] border-gray-500 focus:outline-none py-1 rounded' />
              </div>

              <div className='border-b pb-2'>
                <div className='flex mt-10 lg:gap-28 md:gap-12 px-5'>
                  <h3 className='mt-2 text-sm font-semibold h-[35px] w-[55%] md:w-[52%] lg:w-[30%]'>PayPal Email:</h3>
                  <input {...register("paypalemail", { required: true })} type="text" className='border h-[35px] w-[50%] p-3 md:w-[201px] lg:w-[230px] border-gray-500 focus:outline-none pt-1 rounded' />
                </div>
                <small className='text-red-600 md:ms-[60%] lg:ms-[55%]  ms-[180px]'>{errors.paypalemail && <span>This field is required</span>}</small>
              </div>



              <h1 className='ms-5 lg:text-xl font-bold mt-5'>Marketplace Fees</h1>
              <div>
                <div className='flex lg:gap-28 md:gap-12  mt-5 px-5'>
                  <h3 className='mt-2 text-sm font-semibold h-[25px] w-[55%] md:w-[52%] lg:w-[30%]'>Fixed %:</h3>
                  <input {...register("fixed", { required: true })} type="text" className='border h-[35px] w-[50%] p-3 md:w-[201px] lg:w-[230px] border-gray-500 focus:outline-none py-1 rounded' />
                </div>
                <small className='text-red-600 md:ms-[62%] lg:ms-[55%]  ms-[200px]'>{errors.fixed && <span>This field is required</span>}</small>
              </div>

              <div>
                <div className='flex lg:gap-28 md:gap-12 mt-5 px-5'>
                  <h3 className='mt-2 text-sm font-semibold h-[25px] w-[55%] md:w-[52%] lg:w-[30%]'>Fixed $:</h3>
                  <input {...register("marketfix", { required: true })} type="text" className='border h-[35px] w-[50%] p-3 lg:w-[230px] md:w-[201px] border-gray-500 focus:outline-none py-1 rounded' />
                </div>
                <small className='text-red-600 md:ms-[62%] lg:ms-[55%]  ms-[190px]'>{errors.marketfix && <span>This field is required</span>}</small>
              </div>
              <div className='flex  lg:gap-28 md:gap-12 mt-5 h-10 px-5'>
                <h3 className='text-sm font-semibold w-[55%] md:w-[52%] lg:w-[30%]'>Enable Price Update:</h3>
                <input {...register("priceupdate")} type="checkbox" onChange={() => setPrice(!price)} checked={price} className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-green-500 checked:border-green-500 relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5" />
              </div>
              <div className='flex  lg:gap-28 md:gap-12 mt-5 h-10 px-5'>
                <h3 className='text-sm font-semibold w-[55%] md:w-[52%] lg:w-[30%]'>Enable Quantity Update:</h3>
                <input {...register("quantityupdate")} type="checkbox" onChange={() => setQuantity(!quantity)} checked={quantity} className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-green-500 checked:border-green-500 relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5" />
              </div>
              <div className='flex   lg:gap-28 md:gap-12 mt-5 h-10 px-5'>
                <h3 className='text-sm font-semibold w-[55%] md:w-[52%] lg:w-[30%]'>Enable Business Pricing:</h3>
                <input {...register("businesspricing")} type="checkbox" onChange={() => setBusiness(!business)} checked={business} className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-green-500 checked:border-green-500 relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5" />
              </div>

              <div>
                <div className='flex lg:gap-28 md:gap-12 mt-5 px-5'>
                  <h3 className='mt-2 text-sm font-semibold h-[25px] w-[55%] md:w-[52%] lg:w-[30%]'>Business Price Margin Type:</h3>
                  <input {...register("businessprice", { required: true })} type="text" className='border h-[35px]  w-[50%] md:w-[201px] lg:w-[230px] border-gray-500 focus:outline-none p-3 py-1 rounded' />
                </div>
                <small className='text-red-600 md:ms-[60%] lg:ms-[55%]  ms-[180px]'>{errors.businessprice && <span>This field is required</span>}</small>
              </div>

              <div>
                <div className='flex lg:gap-28 md:gap-12 mt-5 px-5'>
                  <h3 className='mt-2 text-sm font-semibold h-[35px] w-[55%] md:w-[52%] lg:w-[30%]'>ROI strategy:</h3>
                  <select className='border h-[35px] w-[50%] md:w-[201px] lg:w-[230px] border-gray-500 focus:outline-none p-3 py-1 rounded'>
                    <option value="">Select ROI Strategy</option>
                    <option value="ROI Strategy">ROI Strategy</option>
                    <option value="ROI Margin">ROI Margin</option>
                    <option value="ROI Fixed">ROI Fixed</option>
                  </select>
                </div>
                <small className='text-red-600 md:ms-[62%] lg:ms-[55%]  ms-[180px]'>{errors.roistrategy && <span>This field is required</span>}</small>
              </div>

              <div>
                <div className='flex lg:gap-28 md:gap-12 px-5'>
                  <h3 className='mt-2 text-sm font-semibold h-[35px] w-[55%] md:w-[52%] lg:w-[30%]'>Min Profit Margin:</h3>
                  <input {...register("minprofit", { required: true })} type="text" className='border h-[35px] w-[50%] md:w-[201px] lg:w-[230px] border-gray-500 focus:outline-none p-3 py-1 rounded' />
                </div>
                <small className='text-red-600 md:ms-[62%] lg:ms-[55%]  ms-[180px]'>{errors.minprofit && <span>This field is required</span>}</small>
              </div>

              <div>
                <div className='flex lg:gap-28 md:gap-12 px-5'>
                  <h3 className='mt-2 text-sm font-semibold h-[35px] w-[55%] md:w-[52%] lg:w-[30%]'>Margin:</h3>
                  <input {...register("margin", { required: true })} type="text" className='border h-[35px] w-[50%] md:w-[201px] lg:w-[230px] border-gray-500 focus:outline-none p-3 py-1 rounded' />
                </div>
                <small className='text-red-600 md:ms-[62%] lg:ms-[55%]  ms-[190px]'>{errors.margin && <span>This field is required</span>}</small>
              </div>

              <div className='flex px-5 lg:gap-28 md:gap-12'>
                <p className='text-sm lg:w-[30%] md:w-[52%] w-[55%] font-semibold'>Send Min Price?</p>
                <div className='flex gap-5'>
                  <div className='flex'>
                    <p>Yes</p>
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-green-500 checked:border-green-500 relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5 ml-2"
                      checked={sendMinPrice === 'yes'}
                      onChange={() => handleCheckboxChange("yes")}
                    />
                  </div>
                  <div className='flex'>
                    <p>No</p>
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-green-500 checked:border-green-500 relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5 ml-2"
                      checked={sendMinPrice === 'no'}
                      onChange={() => handleCheckboxChange("no")}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className='flex lg:gap-28 md:gap-12 px-5 mt-5'>
                  <h3 className='mt-2 text-sm font-semibold h-[35px] w-[55%] md:w-[52%] lg:w-[30%]'>Maximum Quantity:</h3>
                  <input {...register("maximumquantity", { required: true })} type="text" className='border h-[35px] w-[50%] md:w-[201px] lg:w-[230px] border-gray-500 focus:outline-none px-3 py-1 rounded' />
                </div>
                <small className='text-red-600 md:ms-[59%] lg:ms-[52%]  ms-[150px]'>{errors.maximumquantity && <span>This field is required</span>}</small>
              </div>
              <div className='flex mx-5 gap-32 my-5'>
                <p className='w-[65%] text-sm font-semibold'>Warn me when i try to list items known to cause copyright complaints.</p>
                <input type="checkbox" {...register("copyright")} onChange={() => setCopyright(!copyright)} checked={copyright} className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-green-500 checked:border-green-500 relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5" />
              </div>
              <div className='flex mx-5 gap-32 my-5'>
                <p className='w-[65%] text-sm font-semibold'>Warn me when i try to list items known to cause restriction violation.</p>
                <input {...register("warn")} type="checkbox" onChange={() => setWarn(!warn)} checked={warn} className="w-5 h-5 rounded-lg border border-gray-500 focus:outline-none appearance-none bg-white checked:bg-green-500 checked:border-green-500 relative checked:after:content-['✓'] checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:absolute checked:after:top-0 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:leading-5" />
              </div>
              <div className='flex gap-20 justify-center my-5 '>
                <button type='submit' className='bg-[#089451] text-white border py-1 px-5 rounded hover:bg-white font-bold hover:text-[#089451] border-[#089451]'>Submit</button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>

  );
};

export default Walmart