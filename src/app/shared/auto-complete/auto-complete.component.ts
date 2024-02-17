import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  forwardRef,
} from "@angular/core";
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { IonInput, IonicModule } from "@ionic/angular";
import { debounceTime, distinctUntilChanged } from "rxjs";

export interface AutocompleteOption {
  id: any;
  label: string;
}

@Component({
  selector: "app-auto-complete",
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: "./auto-complete.component.html",
  styleUrl: "./auto-complete.component.css",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutoCompleteComponent),
      multi: true,
    },
  ],
})
export class AutoCompleteComponent implements ControlValueAccessor {
  @Input() options: AutocompleteOption[] = []; // Use AutocompleteOption[] type for options
  @Input() label: string = "Search";
  @Output() optionSelected = new EventEmitter<string>();

  filteredOptions: AutocompleteOption[] = [];
  showResults = true;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
  value = "";
  isDisabled = false;

  writeValue(value: any): void {
    const selectedOption = this.options.find((option) => option.id === value);
    if (selectedOption) {
      this.value = selectedOption.id;
    } else {
      this.value = "";
    }
  }

  registerOnChange(onChange: (value: any) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  filterOptions(value: string): AutocompleteOption[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.label.toLowerCase().includes(filterValue)
    );
  }

  selectOption(option: AutocompleteOption) {
    this.optionSelected.emit(option.id);
    this.writeValue(option.id);
    this.showResults = false;
  }

  onIonChange($event: InputEvent) {
    console.log(($event.target as unknown as IonInput).value);
  }
}
