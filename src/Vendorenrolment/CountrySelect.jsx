import React, { useState } from "react";
import Autocomplete from "react-google-autocomplete";

const CountrySelect = () => {
  const [locationDetails, setLocationDetails] = useState({
    country: "",
    state: "",
    city: "",
    zipCode: "",
  });

  const handlePlaceSelected = (place) => {
    if (!place) return;

    const addressComponents = place.address_components;

    const getComponent = (types) =>
      addressComponents.find((component) =>
        component.types.some((type) => types.includes(type))
      )?.long_name;

    const country = getComponent(["country"]);
    const state = getComponent(["administrative_area_level_1"]);
    const city = getComponent(["locality", "administrative_area_level_2"]) || ""; 
    const zipCode = getComponent(["postal_code"]) || ""; 

    setLocationDetails({ country, state, city, zipCode });
  };

  const handleInputChange = (field, value) => {
    setLocationDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("Final Location Details:", locationDetails);
    alert("Details submitted successfully!");
    // Send details to the backend or save them as needed
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Geolocation API Project</h1>
      <Autocomplete
        // apiKey="AIzaSyAiBBG3mp9DjIydSmBo4FdHJKRsAREZgcc"
        apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        onPlaceSelected={handlePlaceSelected}
        options={{
          types: ["(regions)"], // Limit to regions (cities, states, countries)
        }}
        placeholder="Search for a location"
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
      <div style={{ marginTop: "20px" }}>
        <h3>Edit Location Details:</h3>
        <div>
          <label>Country:</label>
          <input
            type="text"
            value={locationDetails.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
            style={{ display: "block", marginBottom: "10px", padding: "5px" }}
          />
        </div>
        <div>
          <label>State:</label>
          <input
            type="text"
            value={locationDetails.state}
            onChange={(e) => handleInputChange("state", e.target.value)}
            style={{ display: "block", marginBottom: "10px", padding: "5px" }}
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            value={locationDetails.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            style={{ display: "block", marginBottom: "10px", padding: "5px" }}
          />
        </div>
        <div>
          <label>ZIP Code:</label>
          <input
            type="text"
            value={locationDetails.zipCode}
            onChange={(e) => handleInputChange("zipCode", e.target.value)}
            placeholder="Enter ZIP code if unavailable"
            style={{ display: "block", marginBottom: "10px", padding: "5px" }}
          />
        </div>
        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CountrySelect;
