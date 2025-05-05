import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
})
export class PrivacyPolicyComponent {
  /**
   * Initializes the PrivacyPolicyComponent with Location.
   */
  constructor(private location: Location) {}

  /**
   * Navigate back to the previous page.
   */
  backClicked() {
    this.location.back();
  }
}
