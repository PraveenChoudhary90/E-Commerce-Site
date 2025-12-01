
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null, 
};

export const UserInfo = createSlice({
  name: "UserInfo",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    updateUserInfo: (state, action) => {
      state.userInfo = { ...state.userInfo, ...action.payload }; 
    },
  },
});

export const { setUserInfo, updateUserInfo } = UserInfo.actions;
export default UserInfo.reducer;
