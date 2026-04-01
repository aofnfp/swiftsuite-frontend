import React from 'react'

import lipsey from "../../public/image/vendor enrol/lipsey.png";
import fragrancex from "../../public/image/vendor enrol/fragrancex.png";
import zanders from "../../public/image/vendor enrol/zanders.png";
import cwr from "../../public/image/vendor enrol/cwr.png";
import ssi from "../../public/image/vendor enrol/ssi.png";
import rsr from "../../public/image/vendor enrol/rsr.png";

const vendorLogos = {
  fragrancex,
  lipsey,
  rsr,
  zanders,
  cwr,
  ssi,
};


const VendorLogo = ({ vendor, className = "w-20 h-10", alt }) => {
  if (!vendor) return null;

  const logoSrc = vendorLogos[vendor.toLowerCase()];
  if (!logoSrc) return null;

  return <img src={logoSrc} className={className} alt={alt || vendor} />;
};

export default VendorLogo