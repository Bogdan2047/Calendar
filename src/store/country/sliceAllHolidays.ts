import { createSlice } from "@reduxjs/toolkit";
import {
  AllCountriesData,
  CountriyHolidaysData,
} from "../../components/interface/interface";

type StateforAllHolidays = {
  allHolidays: CountriyHolidaysData[];
  isLoading: boolean;
  error: string;
};

const initialState = {
  allHolidays: [],
  isLoading: false,
  error: "",
};

export const allHolidaysSlice = createSlice({
  name: "allHolidays",
  initialState,
  reducers: {
    allHolidaysFetching(state) {
      state.isLoading = true;
    },
    allHolidaysFetchingSuccess(state, action) {
      state.isLoading = false;
      state.error = "";
      state.allHolidays = action.payload;
    },
    allHolidaysFetchingError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  allHolidaysFetching,
  allHolidaysFetchingSuccess,
  allHolidaysFetchingError,
} = allHolidaysSlice.actions;
export default allHolidaysSlice.reducer;
