import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { handleNextStep, updateFormData } from "../redux/customVendorSlice";
import { Icon } from "@iconify/react";
import { postcodeValidator } from "postcode-validator";

const CustomVendorInformation = () => {
  const dispatch = useDispatch();
  const savedData = useSelector(
    (state) => state.customVendor.formData.customVendorInformation || {}
  );

  const fileInputRef = useRef(null);
  const [logoPreview, setLogoPreview] = useState(savedData.logo || null); // Base64 preview for display
  const [logoFile, setLogoFile] = useState(null); // Actual File object for submission

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      name: savedData.vendor_name || "",
      description: savedData.vendor_description || "",
      address_street1: savedData.vendor_address1 || "",
      address_street2: savedData.vendor_address2 || "",
      country: savedData.country || "",
      state: savedData.state || "",
      city: savedData.city || "",
      zip_code: savedData.zip_code || "",
    },
  });

  const selectedCountry = watch("country");
  const selectedState = watch("state");
  const zipCode = watch("zip_code");

  const [countriesList, setCountriesList] = useState([]);
  const [allCountriesData, setAllCountriesData] = useState([]);
  const [availableStates, setAvailableStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);

  
  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/states")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          const countries = data.data.map((c) => c.name).sort();
          setCountriesList(countries);
          setAllCountriesData(data.data);
        }
      })
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);

  
  useEffect(() => {
    if (!selectedCountry) {
      setAvailableStates([]);
      setAvailableCities([]);
      setValue("state", "");
      setValue("city", "");
      return;
    }

    const countryObj = allCountriesData.find((c) => c.name === selectedCountry);
    if (countryObj && Array.isArray(countryObj.states)) {
      const states = countryObj.states.map((s) => s.name).sort();
      setAvailableStates(states);
    } else {
      setAvailableStates([]);
    }

    setValue("state", "");
    setValue("city", "");
    setAvailableCities([]);
  }, [selectedCountry, allCountriesData, setValue]);

  // Fetch cities when state changes
  useEffect(() => {
    if (!selectedCountry || !selectedState) {
      setAvailableCities([]);
      setValue("city", "");
      return;
    }

    fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: selectedCountry, state: selectedState }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error && Array.isArray(data.data)) {
          const cities = data.data.sort();
          setAvailableCities(cities);
        } else {
          setAvailableCities([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching cities:", err);
        setAvailableCities([]);
      });

    setValue("city", "");
  }, [selectedState, selectedCountry, setValue]);

  // ZIP Code Validation
  const validateZipCode = (code, countryName) => {
    if (!code || !countryName) return true;

    const countryObj = allCountriesData.find((c) => c.name === countryName);
    const iso2 = countryObj?.iso2 || "";

    if (!iso2) return "Country not supported for ZIP validation";

    const isValid = postcodeValidator(code, iso2);
    return isValid || "Invalid ZIP/postal code";
  };

  const handleZipBlur = () => {
    const validation = validateZipCode(zipCode, selectedCountry);
    if (typeof validation === "string") {
      setError("zip_code", { type: "manual", message: validation });
    } else {
      clearErrors("zip_code");
    }
  };

  
  const handleLogoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLogoFile(file); 

    const reader = new FileReader();
    reader.onloadend = () => {
      const previewUrl = reader.result;
      setLogoPreview(previewUrl);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (formValues) => {
    // Final ZIP validation
    const zipValidation = validateZipCode(formValues.zip_code, formValues.country);
    if (typeof zipValidation === "string") {
      setError("zip_code", { type: "manual", message: zipValidation });
      return;
    }

    const finalData = {
      vendor_name: formValues.name?.trim() || "",
      vendor_description: formValues.description?.trim() || "",
      vendor_address1: formValues.address_street1?.trim() || "",
      vendor_address2: formValues.address_street2?.trim() || "",
      country: formValues.country || "",
      state: formValues.state || "",
      city: formValues.city || "",
      zip_code: formValues.zip_code?.trim() || "",
      logo: logoPreview || null,        
      logoFile: logoFile || null,      
    };

    console.log("Vendor Information Saved to Redux:", finalData);

    // Save to Redux
    dispatch(
      updateFormData({
        step: "customVendorInformation",
        data: finalData,
      })
    );

    // Go to next step
    dispatch(handleNextStep());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Vendor Name & Logo */}
      <div className="grid md:grid-cols-2 gap-16">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vendor Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("name", { required: "Vendor name is required" })}
            className="w-full border border-gray-300 bg-[#F9F9F9] p-2 focus:outline-none rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col justify-end">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleLogoUpload}
          />
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border border-gray-300 bg-[#027840] rounded-lg py-2 px-4 text-white hover:bg-green-700 transition"
            >
              Choose Logo
            </button>
            <Icon
              icon="streamline-flex:gallery-solid"
              width="24"
              height="24"
              className="text-[#027840]"
            />
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Vendor Logo Preview"
                className="h-20 w-auto max-w-xs object-contain border rounded-lg shadow-sm"
              />
            ) : (
              <div className="h-20 w-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                No logo selected
              </div>
            )}
          </div>
          {logoFile && (
            <p className="text-sm text-gray-600 mt-2">Selected: {logoFile.name}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("description", { required: "Description is required" })}
          className="md:w-1/2 w-full border border-gray-300 bg-[#F9F9F9] p-3 focus:outline-none rounded h-32 resize-none"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Address Lines */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address Line 1 <span className="text-red-500">*</span>
        </label>
        <input
          {...register("address_street1", { required: "Address line 1 is required" })}
          className="md:w-1/2 w-full border border-gray-300 bg-[#F9F9F9] p-2 rounded"
        />
        {errors.address_street1 && (
          <p className="text-red-500 text-sm mt-1">{errors.address_street1.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address Line 2
        </label>
        <input
          {...register("address_street2")}
          className="md:w-1/2 w-full border border-gray-300 bg-[#F9F9F9] p-2 rounded"
          placeholder="Optional"
        />
      </div>

      {/* Country */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country <span className="text-red-500">*</span>
        </label>
        <select
          {...register("country", { required: "Country is required" })}
          className="md:w-1/2 w-full border border-gray-300 bg-[#F9F9F9] p-2 rounded"
        >
          <option value="">Select Country</option>
          {countriesList.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        {errors.country && (
          <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
        )}
      </div>

      {/* State */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          State / Province <span className="text-red-500">*</span>
        </label>
        <select
          {...register("state", { required: "State is required" })}
          className="md:w-1/2 w-full border border-gray-300 bg-[#F9F9F9] p-2 rounded"
          disabled={!availableStates.length}
        >
          <option value="">
            {availableStates.length ? "Select State" : "Select Country First"}
          </option>
          {availableStates.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        {errors.state && (
          <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
        )}
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          City <span className="text-red-500">*</span>
        </label>
        <select
          {...register("city", { required: "City is required" })}
          className="md:w-1/2 w-full border border-gray-300 bg-[#F9F9F9] p-2 rounded"
          disabled={!availableCities.length}
        >
          <option value="">
            {availableCities.length ? "Select City" : "Select State First"}
          </option>
          {availableCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        {errors.city && (
          <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
        )}
      </div>

      {/* ZIP Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ZIP / Postal Code <span className="text-red-500">*</span>
        </label>
        <input
          {...register("zip_code", {
            required: "ZIP code is required",
            validate: (value) => validateZipCode(value, selectedCountry),
          })}
          onBlur={handleZipBlur}
          className={`md:w-1/2 w-full border p-2 bg-[#F9F9F9] rounded ${
            errors.zip_code ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.zip_code && (
          <p className="text-red-500 text-sm mt-1">{errors.zip_code.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-8">
        <button
          type="submit"
          className="bg-[#027840] text-white px-20 py-3 rounded-lg hover:bg-green-700 transition font-medium text-lg"
        >
          Next →
        </button>
      </div>
    </form>
  );
};

export default CustomVendorInformation;