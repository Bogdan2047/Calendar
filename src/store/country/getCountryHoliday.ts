import {
  holidaysFetching,
  holidaysFetchingError,
  holidaysFetchingSuccess,
} from "./sliceHolidays";

interface CountryHolidayFetchParams {
  countryCode: string;
}

export const getCountryHolidayFetch =
  ({ countryCode }: CountryHolidayFetchParams) =>
  async (dispatch: any) => {
    try {
      dispatch(holidaysFetching());
      const response = await fetch(
        `https://date.nager.at/api/v3/NextPublicHolidays/${countryCode}`,
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
        dispatch(holidaysFetchingSuccess(countryHoliday));
      }
      console.log("countryHoliday", countryHoliday);
    } catch (error: any) {
      console.log("error", error.message);
      dispatch(holidaysFetchingError(error.message));
    }
  };
