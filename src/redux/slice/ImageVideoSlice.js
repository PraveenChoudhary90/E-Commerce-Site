import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  imagesVideo:null
};

export const imageVideoSlice = createSlice({
  name: "ImageVideo",
  initialState,
  reducers: {
    setImageVideo: (state, action) => {
      state.imagesVideo = action.payload;
    },

    updateImageVideo: (state, action) => {
        state.imagesVideo = [...state.imagesVideo, ...action.payload];
    },
    deleteImageVideo: (state, action) => {
      state.imagesVideo = state.imagesVideo?.filter(
        (item) => item.id !== action.payload
      );
    },
    
  },
});

export const { setImageVideo,updateImageVideo, deleteImageVideo } = imageVideoSlice.actions;
export default imageVideoSlice.reducer;