import {
  allCountriesFetching,
  allCountriesFetchingError,
  allCountriesFetchingSuccess,
} from "./sliceCountry";

export const getAllCountriesFetch = () => async (dispatch: any) => {
  try {
    dispatch(allCountriesFetching());
    const response = await fetch(
      "https://date.nager.at/api/v3/AvailableCountries",
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

    const countries = await response.json();
    if (countries) {
      dispatch(allCountriesFetchingSuccess(countries));
    }
    console.log("country", countries);
  } catch (error: any) {
    console.log("error", error.message);
    dispatch(allCountriesFetchingError(error.message));
  }
};
