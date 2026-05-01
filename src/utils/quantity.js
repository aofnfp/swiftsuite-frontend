// Frontend stopgap for the eb:N|su:M quantity-format bug documented in
// /LISTING_QUANTITY_VENDOR_PREFIX_BUG.md. Two backend sync sites
// (`marketplaceApp/util.py:126` and `inventoryApp/update_market.py:289`)
// write `InventoryModel.quantity` as `eb:{ebay_qty}|su:{supplier_qty}`
// instead of a plain integer. The string flows unparsed into the listing
// pipeline and produces:
//   - a React DOM warning on the <input type="number"> Quantity field
//   - <Quantity>eb:6|su:6</Quantity> in the eBay Trading API call,
//     which eBay rejects with HTTP 400
//
// This parser extracts the eBay-current quantity from either the
// prefixed string or a plain integer string, returning a clean numeric
// string ready for an API call or a number input. Any unparseable input
// returns "" so the caller can decide on a fallback (most callers use
// `|| "Null"`, matching the existing pattern in listingDataBuilder.js).
//
// Examples:
//   parseQuantity("eb:6|su:6")  → "6"
//   parseQuantity("eb:0|su:12") → "0"
//   parseQuantity("su:6|eb:3")  → "3"  (order-independent — picks eb side)
//   parseQuantity("12")         → "12"
//   parseQuantity("")           → ""
//   parseQuantity(undefined)    → ""
//
// Remove this util once the backend write sites are fixed and a
// migration scrubs existing rows (see Option A in the bug doc).
export const parseQuantity = (raw) => {
  if (raw == null) return "";
  const s = String(raw);
  const m = s.match(/(?:^|\|)eb:(\d+)/i);
  if (m) return m[1];
  return /^\d+$/.test(s) ? s : "";
};
