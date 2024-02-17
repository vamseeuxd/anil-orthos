import { Component, OnInit } from "@angular/core";
import { CountryStateCityService } from "./country-state-city.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ICountry } from "country-state-city";
import {
  AutoCompleteComponent,
  AutocompleteOption,
} from "../auto-complete/auto-complete.component";

@Component({
  selector: "app-country-state-city",
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AutoCompleteComponent,
  ],
  templateUrl: "./country-state-city.component.html",
  styleUrl: "./country-state-city.component.css",
})
export class CountryStateCityComponent implements OnInit {
  countries: AutocompleteOption[] = [];
  states: AutocompleteOption[] = [];
  cities: AutocompleteOption[] = [];

  selectedCity: string = "";
  selectedCountry: string = "";
  selectedState: string = "";

  constructor(private dataService: CountryStateCityService) {}

  ngOnInit(): void {
    this.countries = this.dataService.getCountries();
  }

  onCountryChange(): void {
    console.log(this.selectedCountry);
    this.states = this.dataService.getStates(this.selectedCountry);
    console.log(this.states);
  }

  onStateChange(): void {
    this.cities = this.dataService.getCities(
      this.selectedCountry,
      this.selectedState
    );
  }
}
