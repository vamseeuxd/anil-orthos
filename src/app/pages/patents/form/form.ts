import { Component } from "@angular/core";

import { FormsModule, NgForm, ReactiveFormsModule } from "@angular/forms";
import { BehaviorSubject, Observable, debounceTime, of, switchMap } from "rxjs";
import { CommonModule } from "@angular/common";
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatRadioModule } from "@angular/material/radio";
import { IonicModule } from "@ionic/angular";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CountryStateCityService } from "../../../shared/country-state-city/country-state-city.service";
import { AutocompleteOption } from "../../../shared/auto-complete/auto-complete.component";
import { map } from "cypress/types/jquery";

@Component({
  selector: "patent-form",
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatRadioModule,
    MatInputModule,
    MatSelectModule,
  ],
  styleUrls: ["./form.scss"],
  templateUrl: "form.html",
})
export class FormPage {
  defaultHref = "/app/tabs/patents";
  countrySearch = new BehaviorSubject<string>("");
  statesSearch = new BehaviorSubject<string>("");
  citiesSearch = new BehaviorSubject<string>("");
  countries$: Observable<AutocompleteOption[]>;
  states$: Observable<AutocompleteOption[]>;
  cities$: Observable<AutocompleteOption[]>;

  constructor(private service: CountryStateCityService) {
    this.countries$ = this.initializeAutocompleteStream(this.countrySearch, this.service.getCountries());
    this.states$ = this.initializeAutocompleteStream(this.statesSearch, []);
    this.cities$ = this.initializeAutocompleteStream(this.citiesSearch, []);
  }

  private initializeAutocompleteStream(searchSource: BehaviorSubject<string>, initialOptions: AutocompleteOption[]): Observable<AutocompleteOption[]> {
    return searchSource.pipe(
      debounceTime(100),
      switchMap((search: string) =>
        of(
          search.trim().toLowerCase().length
            ? initialOptions.filter(({ label }) =>
                label.toLowerCase().includes(search.trim().toLowerCase())
              )
            : initialOptions
        )
      )
    );
  }

  filterStatesByCountry($event: MatAutocompleteSelectedEvent): void {
    this.states$ = this.initializeAutocompleteStream(this.statesSearch, this.service.getStates($event.option.value.id));
  }

  filterCitiesByState(form: NgForm): void {
    this.cities$ = this.initializeAutocompleteStream(
      this.citiesSearch,
      this.service.getCities(form.value.country.id, form.value.state.id)
    );
  }

  submitForm(form: { valid: any; value: any }): void {
    if (form.valid) {
      console.log(form.value);
    }
  }

  filterOptions($event: InputEvent, source: BehaviorSubject<string>) {
    source.next(($event.target as HTMLInputElement).value);
  }

  displayWith(option: AutocompleteOption): string {
    return option && option.label ? option.label : "";
  }
}
