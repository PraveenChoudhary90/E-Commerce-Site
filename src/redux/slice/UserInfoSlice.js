import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage if available
const initialState = {
  userInfoadmin: localStorage.getItem("userInfoadmin")
    ? JSON.parse(localStorage.getItem("userInfoadmin"))
    : null,
};

export const UserInfo = createSlice({
  name: "userInfoadmin",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfoadmin = action.payload;
      // Save to localStorage
      localStorage.setItem("userInfoadmin", JSON.stringify(action.payload));
    },
    updateUserInfo: (state, action) => {
      state.userInfoadmin = { ...state.userInfoadmin, ...action.payload };
      // Save updated info to localStorage
      localStorage.setItem("userInfoadmin", JSON.stringify(state.userInfoadmin));
    },
    clearUserInfo: (state) => {
      state.userInfoadmin = null;
      localStorage.removeItem("userInfoadmin");
    },
  },
});

export const { setUserInfo, updateUserInfo, clearUserInfo } = UserInfo.actions;
export default UserInfo.reducer;
