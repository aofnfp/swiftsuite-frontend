import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from 'sonner';
import { handleNextStep } from "../redux/newVendor";
import { SlPicture } from "react-icons/sl";
import { postcodeValidator } from "postcode-validator";

const NewVendorInfo1 = () => {
  const store = useSelector((state) => state.newVendor.addNewVendor);
  const dispatch = useDispatch();

  const fileInput = useRef(null);

  const [countriesList, setCountriesList] = useState([]);
  const [allCountriesData, setAllCountriesData] = useState([]);
  const [availableStates, setAvailableStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [logo, setLogo] = useState(store.logo || "");
  const [isLoading, setIsLoading] = useState({
    countries: false,
    states: false,
    cities: false
  });

  const schema = yup.object().shape({
    vendor_name: yup.string().required("This field is required"),
    description: yup.string().required("This field is required"),
    address_street1: yup.string().required("This field is required"),
    address_street2: yup.string().optional(),
    city: yup.string().required("This field is required"),
    country: yup.string().required("This field is required"),
    state: yup.string().required("This field is required"),
    zip_code: yup
      .string()
      .required("This field is required")
      .test("valid-zip", "Invalid postal code format", function (value) {
        const { country } = this.parent;
        if (!value || !country) return true;
        const countryObj = allCountriesData.find((c) => c.name === country);
        const iso2 = countryObj?.iso2 || "";
        if (!iso2) return true;
        return postcodeValidator(value, iso2);
      }),
    logo: yup.string().optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      vendor_name: store.name || "",
      description: store.description || "",
      address_street1: store.address_street1 || "",
      address_street2: store.address_street2 || "",
      country: store.country || "",
      state: store.state || "",
      city: store.city || "",
      zip_code: store.zip_code || "",
      logo: store.logo || "",
    },
  });

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(prev => ({ ...prev, countries: true }));
      try {
        const response = await fetch("https://countriesnow.space/api/v0.1/countries/states");
        const data = await response.json();
        
        if (!data.error) {
          const sorted = data.data.map((c) => c.name).sort();
          setCountriesList(sorted);
          setAllCountriesData(data.data);
        }
      } catch (error) {
        console.error("Failed to load countries:", error);
        toast.error("Failed to load countries list");
      } finally {
        setIsLoading(prev => ({ ...prev, countries: false }));
      }
    };

    fetchCountries();
  }, []);

  
  const loadStatesForCountry = useCallback(async (countryName) => {
    if (!countryName || allCountriesData.length === 0) {
      setAvailableStates([]);
      setAvailableCities([]);
      return [];
    }

    setIsLoading(prev => ({ ...prev, states: true }));
    try {
      const countryObj = allCountriesData.find((c) => c.name === countryName);
      if (countryObj?.states && countryObj.states.length > 0) {
        const states = countryObj.states.map((s) => s.name).sort();
        setAvailableStates(states);
        return states;
      } else {
        setAvailableStates([]);
        return [];
      }
    } catch (error) {
      console.error("Failed to load states:", error);
      toast.error("Failed to load states");
      setAvailableStates([]);
      return [];
    } finally {
      setIsLoading(prev => ({ ...prev, states: false }));
    }
  }, [allCountriesData]);

  // Load cities when state changes
  const loadCitiesForState = useCallback(async (countryName, stateName) => {
    if (!countryName || !stateName) {
      setAvailableCities([]);
      return [];
    }

    setIsLoading(prev => ({ ...prev, cities: true }));
    try {
      const response = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          country: countryName, 
          state: stateName 
        }),
      });
      
      const data = await response.json();
      
      if (!data.error && Array.isArray(data.data)) {
        const cities = data.data.sort();
        setAvailableCities(cities);
        return cities;
      } else {
        setAvailableCities([]);
        return [];
      }
    } catch (error) {
      console.error("Failed to load cities:", error);
      toast.error("Failed to load cities");
      setAvailableCities([]);
      return [];
    } finally {
      setIsLoading(prev => ({ ...prev, cities: false }));
    }
  }, []);

  // Handle country change
  useEffect(() => {
    if (!selectedCountry) {
      setAvailableStates([]);
      setAvailableCities([]);
      setValue("state", "");
      setValue("city", "");
      return;
    }

    loadStatesForCountry(selectedCountry);
  }, [selectedCountry, loadStatesForCountry, setValue]);

  // Handle state change
  useEffect(() => {
    if (!selectedCountry || !selectedState) {
      setAvailableCities([]);
      setValue("city", "");
      return;
    }

    loadCitiesForState(selectedCountry, selectedState);
  }, [selectedState, selectedCountry, loadCitiesForState, setValue]);

  // Unified pre-fill logic - runs when all data is ready
  useEffect(() => {
    const prefillFormData = async () => {
      // Skip if no stored data or countries not loaded
      if (!store.country || allCountriesData.length === 0) return;

      try {
        // Step 1: Set country if it exists in the list
        if (countriesList.includes(store.country)) {
          setValue("country", store.country);
          await trigger("country");
          
          // Step 2: After country is set, load and set state
          const states = await loadStatesForCountry(store.country);
          if (store.state && states.includes(store.state)) {
            // Small delay to ensure state dropdown is populated
            await new Promise(resolve => setTimeout(resolve, 100));
            setValue("state", store.state);
            await trigger("state");
            
            // Step 3: After state is set, load and set city
            const cities = await loadCitiesForState(store.country, store.state);
            if (store.city) {
              // Find city with case-insensitive matching
              const normalizedStored = store.city.trim();
              const exactMatch = cities.includes(normalizedStored);
              const caseInsensitiveMatch = cities.find(
                (c) => c.toLowerCase() === normalizedStored.toLowerCase()
              );
              
              const match = exactMatch ? normalizedStored : caseInsensitiveMatch;
              if (match) {
                // Small delay to ensure city dropdown is populated
                await new Promise(resolve => setTimeout(resolve, 100));
                setValue("city", match);
                await trigger("city");
              }
            }
          }
        }
      } catch (error) {
        console.error("Error pre-filling form:", error);
      }
    };

    // Only run pre-fill when we have all necessary data
    if (countriesList.length > 0 && !isLoading.countries) {
      prefillFormData();
    }
  }, [
    store.country, 
    store.state, 
    store.city, 
    countriesList, 
    allCountriesData, 
    setValue, 
    trigger,
    loadStatesForCountry,
    loadCitiesForState,
    isLoading.countries
  ]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setLogo(base64);
      setValue("logo", base64);
    };
    reader.readAsDataURL(file);
    toast.success("Logo uploaded successfully!");
  };

  const onSubmit = (data) => {
  const transformedData = {
    name: data.vendor_name,          // <-- Map vendor_name → name
    description: data.description,
    address_street1: data.address_street1,
    address_street2: data.address_street2,
    country: data.country,
    state: data.state,
    city: data.city,
    zip_code: data.zip_code,
    logo: logo || data.logo,         // Keep logo handling
  };

  const updatedForm = {
    ...store,
    ...transformedData,
    increment: true,
  };

  dispatch(handleNextStep(updatedForm));
  toast.success("Proceeding to next step!");
};

  return (
    <div className="h-full">
      <section className="mb-10 shadow-[0_4px_25px_0_rgba(0,0,0,0.05)]">
        <form
          className="bg-white py-10 lg:mt-8 mt-0 border-2 rounded-[20px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="lg:text-xl text-sm font-bold font-sans border-gray-200 border-b lg:p-4 p-0 py-2 px-4">
            Vendor Information
          </h1>

          {/* Vendor Name */}
          <div className="px-5 mt-5">
            <div className="flex lg:gap-10 md:gap-8 lg:mt-0 mt-5">
              <label className="w-[140px] mt-3 font-semibold">
                Vendor name:<span className="text-red-600">*</span>
              </label>
              <input
                {...register("vendor_name")}
                type="text"
                className={`border border-black focus:outline-none p-3 py-2 lg:w-[50%] md:w-[45%] rounded ${
                  errors.vendor_name && "border-red-600"
                }`}
              />
            </div>
            <small className="text-red-600 ms-[42%]">
              {errors.vendor_name && <span>This field is required</span>}
            </small>
          </div>

          {/* Vendor Description */}
          <div className="px-5 mt-5">
            <div className="flex lg:gap-10 md:gap-8 lg:mt-0 mt-5">
              <label className="w-[140px] mt-3 font-semibold">
                Vendor Description:<span className="text-red-600">*</span>
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className={`border border-black focus:outline-none p-3 lg:w-[50%] md:w-[45%] rounded resize-none ${
                  errors.description && "border-red-600"
                }`}
              />
            </div>
            <small className="text-red-600 ms-[42%]">
              {errors.description && <span>This field is required</span>}
            </small>
          </div>

          {/* Logo Upload */}
          <div className="flex lg:gap-16 gap-3 border-gray-200 border-b lg:p-5 p-4">
            <label className="flex justify-center items-center font-semibold">Upload Logo:</label>
            <div
              className={`shadow-lg rounded-3xl border-2 border-dotted ${
                logo ? "border-green-500" : "border-gray-300"
              } flex flex-col items-center justify-center lg:w-[18%] md:w-[46%] w-[58%] h-[100px] ms-12 lg:ms-6 md:ms-20 rounded lg:mt-3 mt-0 p-4 relative overflow-hidden cursor-pointer`}
              onClick={() => fileInput.current?.click()}
            >
              {logo ? (
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="absolute inset-0 w-full h-full object-contain rounded-3xl"
                />
              ) : (
                <>
                  <SlPicture className="text-xl z-10" />
                  <span className="text-lg text-gray-500 z-10">Add Images</span>
                </>
              )}
              <input
                type="file"
                ref={fileInput}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>

          {/* Address Section */}
          <h1 className="lg:text-xl text-sm font-bold font-sans border-gray-200 border-b lg:p-5 p-5 px-5">
            Vendor Address
          </h1>

          <div className="px-5">
            {/* Address 1 */}
            <div className="mt-5">
              <div className="flex lg:gap-10 md:gap-8 lg:mt-0 mt-5">
                <label className="w-[140px] mt-3 font-semibold">
                  Address 1:<span className="text-red-600">*</span>
                </label>
                <input
                  {...register("address_street1")}
                  type="text"
                  className={`border border-black focus:outline-none p-3 py-4 lg:w-[50%] md:w-[45%] rounded ${
                    errors.address_street1 && "border-red-600"
                  }`}
                />
              </div>
              <small className="text-red-600 ms-[42%]">
                {errors.address_street1 && <span>This field is required</span>}
              </small>
            </div>

            {/* Address 2 */}
            <div className="mt-5">
              <div className="flex lg:gap-10 md:gap-8 lg:mt-0 mt-5">
                <label className="w-[140px] mt-3 font-semibold">Address 2:</label>
                <input
                  {...register("address_street2")}
                  type="text"
                  className="border border-black focus:outline-none p-3 py-4 lg:w-[50%] md:w-[45%] rounded"
                />
              </div>
            </div>

            {/* Country → State → City → ZIP */}
            <div className="flex flex-col mb-5 mt-5">
              {/* Country */}
              <div className="flex md:gap-8 lg:gap-10 gap-2">
                <label className="mt-3 w-[140px] font-semibold">
                  Country:<span className="text-red-600">*</span>
                </label>
                <select
                  {...register("country")}
                  className={`px-4 py-3 mb-4 lg:w-[50%] md:w-[45%] w-[250px] bg-white border border-black rounded-md shadow-sm focus:outline-none ${
                    errors.country && "border-red-600"
                  } ${isLoading.countries && "opacity-50"}`}
                  disabled={isLoading.countries}
                >
                  <option value="">
                    {isLoading.countries ? "Loading countries..." : "Select Country"}
                  </option>
                  {countriesList.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              {errors.country && (
                <small className="text-red-600 ms-[160px]">This field is required</small>
              )}

              {/* State */}
              <div className="flex md:gap-8 lg:gap-10 gap-2 mt-3">
                <label className="mt-3 w-[140px] font-semibold">
                  State:<span className="text-red-600">*</span>
                </label>
                <select
                  {...register("state")}
                  className={`px-4 py-3 mb-4 lg:w-[50%] md:w-[45%] w-[250px] bg-white border border-black rounded-md shadow-sm focus:outline-none ${
                    (!availableStates.length || isLoading.states) && "opacity-50 pointer-events-none"
                  } ${errors.state && "border-red-600"}`}
                  disabled={!availableStates.length || isLoading.states}
                >
                  <option value="">
                    {isLoading.states ? "Loading states..." : 
                     availableStates.length ? "Select State" : "Select Country First"}
                  </option>
                  {availableStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              {errors.state && (
                <small className="text-red-600 ms-[160px]">This field is required</small>
              )}

              {/* City */}
              <div className="flex md:gap-8 lg:gap-10 gap-2 mt-3">
                <label className="mt-3 w-[140px] font-semibold">
                  City:<span className="text-red-600">*</span>
                </label>
                <select
                  {...register("city")}
                  className={`px-4 py-3 mb-4 lg:w-[50%] md:w-[45%] w-[250px] bg-white border border-black rounded-md shadow-sm focus:outline-none ${
                    (!availableCities.length || isLoading.cities) && "opacity-50 pointer-events-none"
                  } ${errors.city && "border-red-600"}`}
                  disabled={!availableCities.length || isLoading.cities}
                >
                  <option value="">
                    {isLoading.cities ? "Loading cities..." :
                     availableCities.length ? "Select City" :
                     selectedState ? "No cities available" : "Select State First"}
                  </option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              {errors.city && (
                <small className="text-red-600 ms-[160px]">This field is required</small>
              )}

              {/* Postal Code */}
              <div className="flex md:gap-8 lg:gap-10 gap-2 mt-3">
                <label className="mt-3 w-[140px] font-semibold">
                  Postal Code (Zip):<span className="text-red-600">*</span>
                </label>
                <input
                  {...register("zip_code")}
                  type="text"
                  className={`border border-black focus:outline-none py-3 px-4 rounded-md lg:w-[50%] md:w-[45%] w-[250px] ${
                    errors.zip_code && "border-red-600"
                  }`}
                  placeholder={selectedCountry ? "Enter postal code" : "Select country first"}
                />
              </div>
              {errors.zip_code && (
                <small className="text-red-600 ms-[160px]">{errors.zip_code.message}</small>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#089451] hover:border hover:border-[#089451] hover:bg-white text-white hover:text-[#089451] rounded lg:ms-[50%] ms-[49%] lg:mt-1 mt-10 lg:p-2 p-2 lg:w-[20%] w-[105px] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading.countries || isLoading.states || isLoading.cities}
          >
            {isLoading.countries || isLoading.states || isLoading.cities ? "Loading..." : "Next"}
          </button>
        </form>
        <Toaster position="top-right" />
      </section>
    </div>
  );
};

export default NewVendorInfo1;