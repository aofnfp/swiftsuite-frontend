import { format, parseISO } from "date-fns";

// ✅ Pure utility, no hooks
export const formatDate = (isoDate) => {
  if (!isoDate || typeof isoDate !== "string") return "Invalid Date";
  try {
    return format(parseISO(isoDate), "dd/MM/yy");
  } catch (error) {
    return "Invalid Date";
  }
};

export const serverTimeFormat = (dateString) => {
  if (!dateString || dateString === "Null") return "";

  const date = new Date(dateString);

  return date.toLocaleString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

  export const formatInventoryDate = (dateString) => {
    if (!dateString || dateString === "Null") return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  export const formatDeliveryDate = (isoString) => {
  if (!isoString) return null;
  const date = new Date(isoString);
  const month = date.toLocaleString("en-US", { month: "short" }); // "Jan"
  const day = date.getDate();
  const year = date.getFullYear();

  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
      ? "nd"
      : day === 3 || day === 23
      ? "rd"
      : "th";

  return `${month}, ${day}${suffix} ${year}`; // e.g. "Feb, 11th 2026"
};

  export const safeJSONParse = (value) => {
    try {
      if (typeof value !== 'string') return null;
      const lower = value.trim().toLowerCase();
      if (lower === 'null' || lower === 'undefined') return null;
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  export const cleanObject = (obj) => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (
        value !== null &&
        value !== undefined &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        acc[key] =
          typeof value === "object" && !Array.isArray(value)
            ? cleanObject(value)
            : value;
      }
      return acc;
    }, {});
  };

export  const restrictToIntegers = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };

  // Function to restrict input to numbers and decimals
export const restrictToNumbersAndDecimals = (e) => {
    e.target.value = e.target.value.replace(/[^0-9.]/g, '');
    if (e.target.value.split('.').length > 2) {
      e.target.value = e.target.value.replace(/\.(?=.*\.)/g, '');
    }
  };

export const formatVendorName = (name) => {
  if (!name || typeof name !== "string") return name;
  const upperName = name.toUpperCase();
  if (upperName === "CWR" || upperName === "RSR" || upperName === "SSI") {
    return upperName;
  }
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

export const extractStoreId = (value) => {
  if (typeof value === "object" && value !== null && "store_id" in value) {
    return String(value.store_id || "");
  }
  return String(value || "");
};

export const formatPrice = (price) => {
  if (!price) return "0";
  return price.toLocaleString();
};

  // to convert to uppercase
  export const normalizeKeys = (obj) => {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key.toLowerCase(), value])
    );
  };

export const stripTags = (html) => html.replace(/<[^>]*>/g, "");

export const formatCurrency = (value) => {
  if (!value) return "0";
  return value.toLocaleString();
};

export const formatCurrencyWithSymbol = (value) => {
  if (!value) return "0";
  return "$" + value.toLocaleString();
};

export const formatCurrencyWithSymbolAndDecimal = (value) => {
  if (!value) return "0";
  return "$" + value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatCurrencyWithDecimal = (value) => {
  if (!value) return "0";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const parseItemSpecificFields = (product = {}) => {
  let brand = product.brand || "Unknown";
  let color = "Unknown";
  let upc = product.upc || "Unknown";

  const raw = product.item_specific_fields;

  if (!raw || typeof raw !== "string") {
    return { brand, color, upc };
  }

  try {
    // Remove wrapping braces
    const content = raw.trim().slice(1, -1);

    const fields = content.split(/,(?=\s*')/);

    const map = {};

    fields.forEach((field) => {
      const [key, ...rest] = field.split(":");
      if (!key || !rest.length) return;

      const cleanKey = key.replace(/'/g, "").trim().toLowerCase();
      const cleanValue = rest
        .join(":")
        .trim()
        .replace(/^'/, "")
        .replace(/'$/, "");

      map[cleanKey] = cleanValue;
    });

    brand = map.brand || brand;
    color = map.color || color;
    upc = map.upc || upc;

  } catch (err) {
    console.error("Failed to parse item_specific_fields", raw, err);
  }

  return { brand, color, upc };
};


export const mergeSavedAndSelected = (saved, selected) => {
  const result = {};
  Object.keys(saved).forEach(fieldName => {
    result[fieldName] = selected[fieldName] || saved[fieldName] || "";
  });
  Object.keys(selected).forEach(fieldName => {
    if (!result[fieldName]) {
      result[fieldName] = selected[fieldName];
    }
  });

  return result;
};

export const fixJSON = (str) => {
  if (!str || typeof str !== "string") return null;
  try {
    const fixed = str.replace(/'/g, '"').replace(/None/g, "null").replace(/\bFalse\b/g, "false").replace(/\bTrue\b/g, "true");
    return JSON.parse(fixed);
  } catch (e) {
    return null;
  }
};

export const formatTimeAgo = (dateString) => {
  const now = new Date();
  const createdAt = new Date(dateString);
  const diffInSeconds = Math.floor((now - createdAt) / 1000);

  if (diffInSeconds < 60) return "just now";

  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

export const safeParseItemSpecific = (raw) => {
  // Already an object
  if (raw && typeof raw === "object") return raw;

  if (!raw || typeof raw !== "string") return {};

  // 1️⃣ Try real JSON
  try {
    return JSON.parse(raw);
  } catch (_) {}

  // 2️⃣ Convert Python-style dict → JS object safely
  try {
    // Wrap keys in quotes only (do NOT touch values)
    const withQuotedKeys = raw.replace(
      /([{,]\s*)([A-Za-z0-9 _-]+)\s*:/g,
      '$1"$2":'
    );

    // Use Function constructor (safe here because data is trusted backend data)
    // This correctly handles apostrophes & escaped quotes
    return Function(`"use strict"; return (${withQuotedKeys});`)();
  } catch (_) {}

  return {};
};

export const getStatusStyles = (status) => {
  const s = status?.toLowerCase();
  if (s === "delivered" || s === "fulfilled") return "bg-green-100 text-green-800";
  if (s === "shipped") return "bg-yellow-100 text-yellow-800";
  if (s === "failed") return "bg-red-100 text-red-800";
  if (s === "completed") return "bg-teal-100 text-teal-800";
  if (s === "processing") return "bg-blue-100 text-blue-800";
  if (s === "pending") return "bg-orange-100 text-orange-800";
  return "bg-gray-100 text-gray-800";
};

export const parseDescription = (desc) => {
  if (!desc) return "";
  return desc
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/\\"/g, '"')
    .replace(/^"|"$/g, "");
};

export const getMarketLogoString = () => {
    if (typeof market_logos === "string") return market_logos;
    if (market_logos?.ebay_logo) return "EBAY_US";
    if (market_logos?.shopify_logo) return "SHOPIFY";
    if (market_logos?.woocommerce_logo) return "WOOCOMMERCE";
    if (market_logos?.walmart_logo) return "WALMART";
    if (market_logos?.amazon_logo) return "AMAZON";
    return "EBAY_US";
  };
