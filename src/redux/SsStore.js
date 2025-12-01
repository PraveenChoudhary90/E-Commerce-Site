import { configureStore } from "@reduxjs/toolkit";
import userInfoSlice from "./slice/UserInfoSlice";
import vendorManagementSlice from "./slice/vendorManagementSlice";
import  imageVideoSlice  from "./slice/ImageVideoSlice";


const SsStore = configureStore({
  reducer: {
    userInfo: userInfoSlice,
    vendorData: vendorManagementSlice,
    imageVideo: imageVideoSlice
  },
});

export default SsStore;
