import {
  allHolidaysFetching,
  allHolidaysFetchingError,
  allHolidaysFetchingSuccess,
} from "./sliceAllHolidays";

export const getAllHolidayFetch = () => async (dispatch: any) => {
  try {
    dispatch(allHolidaysFetching);
    const response = await fetch(
      `https://date.nager.at/api/v3/NextPublicHolidaysWorldwide`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch collections");
    }

    const countryHoliday = await response.json();
    if (countryHoliday) {
      dispatch(allHolidaysFetchingSuccess(countryHoliday));
    }
    console.log("countryHoliday", countryHoliday);
  } catch (error: any) {
    console.log("error", error.message);
    dispatch(allHolidaysFetchingError(error.message));
  }
};
