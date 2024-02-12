import { createSlice } from "@reduxjs/toolkit";
import { CountriyHolidaysData } from "../../components/interface/interface";

type StateforHolidays = {
  holidays: CountriyHolidaysData[];
  isLoading: boolean;
  error: string;
};

const initialState = {
  holidays: [],
  isLoading: false,
  error: "",
};

export const holidaysSlice = createSlice({
  name: "holidays",
  initialState,
  reducers: {
    holidaysFetching(state) {
      state.isLoading = true;
    },
    holidaysFetchingSuccess(state, action) {
      state.isLoading = false;
      state.error = "";
      state.holidays = action.payload;
    },
    holidaysFetchingError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  holidaysFetching,
  holidaysFetchingSuccess,
  holidaysFetchingError,
} = holidaysSlice.actions;
export default holidaysSlice.reducer;
