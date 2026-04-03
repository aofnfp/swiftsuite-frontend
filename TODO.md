# TODO: Implement Backend Sorting for Orders (Date oldest/newest via ?ordering=creationDate / -creationDate)

Current Progress:

## Steps:
1. ✅ Added sortConfig state/actions to src/stores/orderStore.js
2. ✅ Updated src/api/authApi.js orderProduct to append ordering param for creationDate only (preserves search/filters)
3. ✅ Update src/OrderPage/Order.jsx: Integrate store sortConfig, pass to API, update sort dropdown to use store (Date toggle: ?ordering=creationDate / -creationDate)
4. ⏳ Test: Toggle Date sort → check Network ?ordering param + correct order
5. ⏳ Optionally remove client sort logic (backend now sorts)
6. ⏳ Complete

Next: Step 3 edits to Order.jsx
