import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { postcodeValidator } from "postcode-validator";

const CustomVendorInfo = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countriesList, setCountriesList] = useState([]);
  const [allCountriesData, setAllCountriesData] = useState([]);
  const [availableStates, setAvailableStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [logoError, setLogoError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      name: "",
      vendor_description: "",
      address_street1: "",
      address_street2: "",
      country: "",
      state: "",
      city: "",
      zip_code: "",
    },
  });

  const selectedCountry = watch("country");
  const selectedState = watch("state");
  const zipCode = watch("zip_code");

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          const countries = data.data.map((c) => c.name).sort();
          setCountriesList(countries);
          setAllCountriesData(data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching countries:", err);
        toast.error("Failed to load countries");
      });
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
        toast.error("Failed to load cities");
      });

    setValue("city", "");
  }, [selectedState, selectedCountry, setValue]);

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
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setLogoError("Please upload a valid image file (JPEG, PNG, GIF, or WebP)");
        setLogoFile(null);
        setLogoPreview(null);
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setLogoError("Image size must be less than 5MB");
        setLogoFile(null);
        setLogoPreview(null);
        return;
      }

      setLogoFile(file);
      setLogoError("");

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCleanErrorMessage = (errorData) => {
    if (typeof errorData === "string") {
      return errorData;
    }

    if (typeof errorData === "object") {
      const keys = Object.keys(errorData);
      for (const key of keys) {
        const value = errorData[key];
        if (Array.isArray(value)) {
          return value[0] || `Error in ${key}`;
        }
        if (typeof value === "string") {
          return value;
        }
      }
    }

    return "An error occurred. Please try again.";
  };

  const onSubmit = async (formValues) => {
    if (!logoFile) {
      setLogoError("Logo is required");
      toast.error("Please upload a logo");
      return;
    }

    const zipValidation = validateZipCode(formValues.zip_code, formValues.country);
    if (typeof zipValidation === "string") {
      setError("zip_code", { type: "manual", message: zipValidation });
      toast.error("Please enter a valid ZIP/postal code");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", formValues.name);
    formData.append("vendor_description", formValues.vendor_description);
    formData.append("address_street1", formValues.address_street1);
    formData.append("address_street2", formValues.address_street2);
    formData.append("country", formValues.country);
    formData.append("state", formValues.state);
    formData.append("city", formValues.city);
    formData.append("zip_code", formValues.zip_code);
    formData.append("request_type", "regular");
    formData.append("logo", logoFile, logoFile.name);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found in localStorage");

      const response = await fetch(
        "https://service.swiftsuite.app/api/v2/vendor-request/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = getCleanErrorMessage(result);
        throw new Error(errorMessage);
      }

      toast.success("Vendor request submitted successfully!");
      console.log("Vendor request submitted:", result);

      reset();
      setLogoPreview(null);
      setLogoFile(null);
      setLogoError("");
      navigate("/vendors/payment-success");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error submitting vendor request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 py-20 max-w-4xl mx-auto">
      <h1 className="font-semibold text-2xl">Request Vendor Integration</h1>
      <p className="text-xl font-semibold">Vendor Information</p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-10 rounded-2xl"
      >
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vendor Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name", { required: "Vendor name is required" })}
              className="w-full border border-gray-300 bg-[#F9F9F9] p-2 focus:outline-none"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="flex flex-col justify-end">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo <span className="text-red-500">*</span>
            </label>
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
                className="border border-gray-300 bg-[#027840] rounded-lg py-2 w-1/3 text-white hover:bg-green-700 transition"
              >
                Choose File
              </button>
              <Icon
                icon="streamline-flex:gallery-solid"
                width="20"
                height="20"
                className="text-[#027840] cursor-pointer"
              />
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="h-16 w-auto object-contain rounded"
                />
              )}
            </div>
            {logoFile && (
              <p className="text-sm text-gray-600 mt-2">Selected: {logoFile.name}</p>
            )}
            {logoError && (
              <p className="text-red-500 text-sm mt-1">{logoError}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vendor Description <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("vendor_description", {
              required: "Vendor description is required",
            })}
            className="md:w-1/2 w-full border border-gray-300 bg-[#F9F9F9] p-2 focus:outline-none h-32"
          />
          {errors.vendor_description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.vendor_description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address Line 1 <span className="text-red-500">*</span>
          </label>
          <input
            {...register("address_street1", {
              required: "Address line 1 is required",
            })}
            className="md:w-1/2 w-full border border-gray-300 p-2 bg-[#F9F9F9]"
          />
          {errors.address_street1 && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address_street1.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address Line 2 <span className="text-red-500">*</span>
          </label>
          <input
            {...register("address_street2", {
              required: "Address line 2 is required",
            })}
            className="md:w-1/2 w-full border border-gray-300 p-2 bg-[#F9F9F9]"
          />
          {errors.address_street2 && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address_street2.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            {...register("country", { required: "Country is required" })}
            className="md:w-1/2 w-full border border-gray-300 p-2 bg-[#F9F9F9]"
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State / Province <span className="text-red-500">*</span>
          </label>
          <select
            {...register("state", { required: "State is required" })}
            className="md:w-1/2 w-full border border-gray-300 p-2 bg-[#F9F9F9]"
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <select
            {...register("city", { required: "City is required" })}
            className="md:w-1/2 w-full border border-gray-300 p-2 bg-[#F9F9F9]"
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
            className={`md:w-1/2 w-full border p-2 bg-[#F9F9F9] ${
              errors.zip_code ? "border-red-500" : "border-gray-300"
            }`}
            autoComplete="off"
          />
          {errors.zip_code && (
            <p className="text-red-500 text-sm mt-1">{errors.zip_code.message}</p>
          )}
        </div>

        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#027840] text-white px-16 py-2 rounded-lg transition hover:bg-green-700 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3H4z"
                ></path>
              </svg>
            )}
            {loading ? "Submitting..." : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
};

    export const CircleLoader = ({ className = "h-5 w-5 text-white" }) => (
      <svg
        className={`animate-spin ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3H4z"
        ></path>
      </svg>
    );

export default CustomVendorInfo;