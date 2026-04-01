import { createSlice } from "@reduxjs/toolkit";

const savedPermissions = JSON.parse(localStorage.getItem("permissions")) || {
  subscribed: false,
  isAdmin: false,
};

const permissionSlice = createSlice({
  name: "permission",
  initialState: savedPermissions,
  reducers: {
    setPermissions: (state, action) => {
      state.subscribed = action.payload.subscribed;
      state.isAdmin = action.payload.isAdmin;

      localStorage.setItem(
        "permissions",
        JSON.stringify({
          subscribed: state.subscribed,
          isAdmin: state.isAdmin,
        })
      );
    },
    clearPermissions: (state) => {
      state.subscribed = false;
      state.isAdmin = false;
      localStorage.removeItem("permissions");
    },
  },
});

export const { setPermissions, clearPermissions } = permissionSlice.actions;
export default permissionSlice.reducer;
