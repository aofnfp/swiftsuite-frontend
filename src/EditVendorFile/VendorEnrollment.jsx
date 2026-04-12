import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import axios from "axios";
import { Toaster, toast } from 'sonner';
import { useEditVendorStore } from "../stores/editVendorStore";

const VendorEnrollment = () => {
  const matchedVendor = useEditVendorStore((state) => state.matchedVendor);
  const setCurrentStep = useEditVendorStore((state) => state.setCurrentStep);

  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [stateSelectDisabled, setStateSelectDisabled] = useState(true);
  const [errorsVisible, setErrorsVisible] = useState(false);
  const [postalCode, setPostalCode] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [isZipValid, setIsZipValid] = useState(false);
  const [myForm, setMyForm] = useState(null);
  const [loading, setLoading] = useState(true); 

  const countries = [
    {
      name: "United States",
      code: "US",
      states: [
        "Alabama",
        "Alaska",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "Florida",
        "Georgia",
        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New Hampshire",
        "New Jersey",
        "New Mexico",
        "New York",
        "North Carolina",
        "North Dakota",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Pennsylvania",
        "Rhode Island",
        "South Carolina",
        "South Dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virginia",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming",
      ],
    },
    {
      name: "Canada",
      code: "CA",
      states: [
        "Alberta",
        "British Columbia",
        "Manitoba",
        "New Brunswick",
        "Newfoundland and Labrador",
        "Nova Scotia",
        "Ontario",
        "Prince Edward Island",
        "Quebec",
        "Saskatchewan",
      ],
    },
  ];

  const Schema = yup.object().shape({
    address_street1: yup.string().required(),
    city: yup.string().required(),
    zip_code: yup.string().required(),
    country: yup.string().required(),
    state: yup.string().required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(Schema),
  });
  

  useEffect(() => {
    if (matchedVendor) {
      const enrolment = matchedVendor.enrolment || matchedVendor.enrollment || {};
      if (Object.keys(enrolment).length > 0) {
        setMyForm(enrolment);
        setValue("address_street1", enrolment?.address_street1 || "");
        setValue("city", enrolment?.city || "");
        setValue("country", enrolment?.country || "");
        setValue("zip_code", enrolment?.zip_code || "");
        setValue("state", enrolment?.state || "");
        setValue("vendor_name", enrolment?.vendor_name || "");

        if (enrolment.state && enrolment?.country) {
          setCountry(enrolment?.country);
          setState(enrolment?.state);
          setStateSelectDisabled(false);
          setPostalCode(enrolment?.zip_code);
        }
      }
    }
    setLoading(false); 
  }, [matchedVendor, setValue]);

  const onSubmit = (data) => {
    if (!country) {
      toast.error("Please select a country");
      return;
    }
    if (!postalCode) {
      toast.error("Please enter a zip code");
      return;
    }
    if (error) {
      toast.error("Please enter a valid zip code.");
      return;
    }
    
    console.log("Form Data:", { ...data, country, state, zip_code: postalCode });
    setCurrentStep(1); // Adjust as needed
  };


  useEffect(() => {


    if (postalCode && country) {
      validatePostalCode();
    }

  }, [postalCode, country]);



  const validatePostalCode = async () => {
    setError("");
    setResult(null);
    setIsZipValid(false); // Assume invalid initially

    const selectedCountry = countries.find((c) => c.name === country);
    if (!selectedCountry) {
      setError("Please select a valid country.");
      return;
    }

    if (!postalCode) {
      setError("Please enter a ZIP code.");
      return;
    }

    try {
      const response = await axios.get(
        `https://api.zippopotam.us/${selectedCountry.code}/${postalCode}`
      );

      if (response.status === 200) {
        setResult(response.data);
        setIsZipValid(true); // ZIP is valid
      }
    } catch (err) {
      setError("Invalid postal code or region.");
      setIsZipValid(false); // ZIP is invalid
    }
  };



  // const handleCountryChange = (event) => {
  //   const selectedCountry = event.target.value;
  //   setCountry(selectedCountry);
  //   setStateSelectDisabled(false);
  //   setErrorsVisible(false);
  //   // setPostalCode(""); // Reset ZIP code whenever the country changes
  //   setIsZipValid(false); // Reset ZIP validation status
  // };

  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    setCountry(selectedCountry);
    // console.log(selectedCountry); 

    setState("");
    setStateSelectDisabled(false);
    setErrorsVisible(false);
  };



  const handleStateChange = (event) => {
    setState(event.target.value);
    setErrorsVisible(false);
  };

  const handleFocus = () => {
    setErrorsVisible(true);
  };


  return (
    <section className="bg-[#E7F2ED] mb-10">
      <form className="bg-white   py-10 lg:mt-8 mt-0"
        action=""
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="lg:text-xl text-sm font-semibold font-sans border-gray-500 border-b lg:p-4 p-0 py-2 px-4">
          Vendor Enrollment
        </h1>

        <div className="flex lg:gap-10 gap-3 border-gray-500 border-b lg:p-5 p-4">
          <label
            className="lg:mt-5 mt-2 lg:text-xl text-sm"
            htmlFor=""
          >
            Vendor Name:
          </label>
          <input
            {...register("vendor_name", { required: true })}
            type="text" disabled
            className='border p-3 border-black focus:outline-none py-2 lg:w-[52%] md:w-[46%] w-[58%] ms-12 lg:ms-6 md:ms-20 rounded lg:mt-3 mt-0'
          />
        </div>

        <h1 className="lg:text-xl text-sm font-semibold font-sans border-gray-500 border-b lg:0 p-5 px-5">
          Vendor Address
        </h1>
        <div className="px-5">
          <div className="mt-5">
            <div className="flex lg:gap-10 md:gap-8 lg:mt-0 mt-5">
              <label className=" w-[140px] mt-3" htmlFor="">
                Street:
              </label>
              <input
                {...register("address_street1", { required: true })}
                type="text"
                // value={`${myForm?.address_street11}`}   
                className={`border border-black focus:outline-none p-3 py-4 lg:w-[50%] md:w-[45%] rounded ${errors.address_street1 && <span>This field is required</span>
                  }`}
              />
            </div>
            <small className="text-red-600 ms-[42%]">
              {errors.address_street1 && <span>This field is required</span>}
            </small>
          </div>
          <div className="">
            <div className="flex lg:gap-10 md:gap-8 gap-2  lg:mt-0 mt-5">
              <label className="  w-[140px] mt-3" htmlFor="">
                City:
              </label>
              <input
                {...register("city", { required: true })}
                type="text"
                className={`border border-black focus:outline-none py-2 p-3  rounded ${errors.city?.message && "error"
                  }`}
              />
            </div>
            <small className="text-red-600 ms-[42%]">
              {errors.city && <span>This field is required</span>}
            </small>
          </div>


            <div className="">
          <div className="flex lg:gap-10 md:gap-8 gap-2 lg:mt-0 mt-5">
            <label className=" w-[140px] mt-3">ZIP Code</label>
            <div>
              <input
                {...register("zip_code", { required: true })}
                type="text"
                placeholder="Enter ZIP code"
                onChange={(e) => {
                  setPostalCode(e.target.value); 
                }}
                onBlur={() => {
                  if (postalCode && country) {
                    validatePostalCode(); 
                  } else {
                    setError("Please select a country and enter a ZIP code.");
                  }
                }}
                className="border border-black focus:outline-none py-2 p-3 rounded"
              />
            </div>
          </div>
          <small className="text-red-600 ms-[42%]">
            {errors.zip_code && <span>This field is required</span>}
          </small>
          <small className="text-red-600 me-10">
            {error && <span>{error}</span>}
          </small>
                  </div>


          <div className="flex flex-col">
            <div className="flex md:gap-8 lg:gap-10 gap-2 mt-5">
              <label className="mt-3 w-[140px]" htmlFor="">
                Country:
              </label>
              <select
                className="px-4 py-3 mb-4 lg:w-[50%] md:w-[45%] w-[250px] bg-white border border-black rounded-md shadow-sm focus:outline-none"
                value={country} onFocus={handleFocus} {...register("country")}
                onChange={handleCountryChange}
              >
                <option value="">Select Country</option>
                {countries.map((selectedCountry) => (
                  <option key={selectedCountry.name} value={selectedCountry.name}>
                    {selectedCountry.name}
                  </option>
                ))}
              </select>
            </div>
            <small className="text-red-600 ms-[42%]">
              {(errors.country && errorsVisible) && <span>This field is required</span>}
            </small>

            <div className="flex md:gap-8 lg:gap-10 gap-2">
              <label className="mt-3 w-[140px]" htmlFor="">
                State:
              </label>
              <select
                className={`px-4 py-3 mb-4 lg:w-[50%] md:w-[45%] w-[250px] bg-white border border-black rounded-md shadow-sm focus:outline-none  ${stateSelectDisabled && "opacity-50 pointer-events-none"
                  }`}
                value={state} onFocus={handleFocus} {...register("state")}
                onChange={handleStateChange}
                disabled={stateSelectDisabled}
              >
                <option value="">Select State</option>
                {country &&
                  countries
                    .find((selectedCountry) => selectedCountry.name === country)
                    .states.map((selectedState) => (
                      <option key={selectedState} value={selectedState}>
                        {selectedState}
                      </option>
                    ))}
              </select>
            </div>
            <small className="text-red-600 ms-[42%]">
              {(errors.state && errorsVisible) && <span>This field is required</span>}
            </small>
          </div>
        </div>
        <button
          type="submit"
          disabled={!postalCode || (!isZipValid && postalCode.trim() === "")}
          className={`${postalCode && (isZipValid || postalCode.trim() !== "")
              ? "bg-[#089451] hover:border hover:border-[#089451] hover:bg-white text-white hover:text-[#089451]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } rounded lg:ms-[50%] ms-[49%] lg:mt-1 mt-10 lg:p-2 p-2 lg:w-[20%] w-[105px]`}
        >
          Next
        </button>
      </form>
            <Toaster position="top-right" /> 
    </section>
  );
};

export default VendorEnrollment;
