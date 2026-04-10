import React from 'react'

import lipsey from "../Images/vendorEnrol/lipseyImage.png";
import fragrancex from "../Images/vendorEnrol/fragrancexImage.png";
import zanders from "../Images/vendorEnrol/zandersImage.png";
import cwr from "../Images/vendorEnrol/cwrImage.png";
import ssi from "../Images/vendorEnrol/ssiImage.png";
import rsr from "../Images/vendorEnrol/rsrImage.png";

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