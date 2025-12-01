import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vendorData: null,
};

export const vendorManagementSlice = createSlice({
  name: "vendorData",
  initialState,
  reducers: {
    setVendorData: (state, action) => {
      state.vendorData = action.payload;
    },
  },
});

export const { setVendorData } = vendorManagementSlice.actions;
export default vendorManagementSlice.reducer;
