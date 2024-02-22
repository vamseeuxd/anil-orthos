import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
  Renderer2,
  inject,
} from "@angular/core";
import { IonSelect } from "@ionic/angular";

@Directive({
  selector: "[appSearchbar]",
  standalone: true,
})
export class SearchbarDirective {
  searchInputElement: HTMLInputElement = null;
  @Input() searchbarPlaceholder = "Search...";
  @Input() searchType: "search" | "text" | "number" | "email" = "search";
  @Output() searchInput: EventEmitter<Event> = new EventEmitter();
  @Output() searchChange: EventEmitter<Event> = new EventEmitter();
  private renderer: Renderer2 = inject(Renderer2);
  @HostListener("click") onClick() {
    setTimeout(() => {
      this.render();
    }, 100);
  }
  @HostListener("ionDismiss") onIonChange() {
    this.searchInputElement.remove();
    this.searchInputElement = null;
  }

  emitSearchChange(event: Event) {
    this.searchChange.emit(event);
  }
  emitSearchInput(event: Event) {
    this.searchInput.emit(event);
  }

  render() {
    if (this.searchInputElement == null) {
      this.searchInputElement = this.renderer.createElement("input");
      this.searchInputElement.type = this.searchType;
      this.searchInputElement.placeholder = this.searchbarPlaceholder;
      this.searchInputElement.style.width = "100%";
      this.searchInputElement.style.display = "block";
      this.searchInputElement.style.margin = "8px 0 0 0";
      this.searchInputElement.style.padding = "8px 8px";
      this.searchInputElement.style.border = "1px solid #b3b3b3";
      this.searchInputElement.style.fontSize = "16px";
      this.searchInputElement.addEventListener(
        "change",
        this.emitSearchChange.bind(this)
      );
      this.searchInputElement.addEventListener(
        "input",
        this.emitSearchInput.bind(this)
      );
      const header = document.querySelector(".alert-head");
      if (header) {
        header.appendChild(this.searchInputElement);
      }
    }
  }
}
