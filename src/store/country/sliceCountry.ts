import { createSlice } from "@reduxjs/toolkit";
import { AllCountriesData } from "../../components/interface/interface";

type StateforAllCountries = {
  allCountries: AllCountriesData[],
  isLoading: boolean,
  error: string,
};

const initialState = {
  allCountries: [],
  isLoading: false,
  error: "",
};

export const allCountriesSlice = createSlice({
  name: "allCountries",
  initialState,
  reducers: {
    allCountriesFetching(state) {
      state.isLoading = true;
    },
    allCountriesFetchingSuccess(state, action) {
      state.isLoading = false;
      state.error = "";
      state.allCountries = action.payload;
    },
    allCountriesFetchingError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  allCountriesFetching,
  allCountriesFetchingSuccess,
  allCountriesFetchingError,
} = allCountriesSlice.actions;
export default allCountriesSlice.reducer;
