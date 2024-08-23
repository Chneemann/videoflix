import { Component, Input, input } from '@angular/core';
import { BtnLargeComponent } from '../buttons/btn-large/btn-large.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [BtnLargeComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() browse: boolean = false;

  constructor(private router: Router) {}

  reloadPage() {
    window.location.href = '/browse/';
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}
