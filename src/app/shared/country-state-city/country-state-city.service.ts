import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { City, Country, ICountry, IState, State } from "country-state-city";
import { Observable, of } from "rxjs";
import { AutocompleteOption } from "../auto-complete/auto-complete.component";

@Injectable({
  providedIn: "root",
})
export class CountryStateCityService {
  getCountries(): AutocompleteOption[] {
    return Country.getAllCountries().map((c) => ({
      id: c.isoCode,
      label: c.name,
    }));
  }

  getStates(country: string): AutocompleteOption[] {
    return State.getStatesOfCountry(country).map((c) => ({
      id: c.isoCode,
      label: c.name,
    }));
  }

  getCities(country: string, state: string): AutocompleteOption[] {
    return City.getCitiesOfState(country, state).map((c) => ({
      id: c.name,
      label: c.name,
    }));
  }
}
