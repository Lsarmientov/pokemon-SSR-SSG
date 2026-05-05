import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pricing-page',
  imports: [],
  templateUrl: './pricing-page.component.html',
})
export class PricingPageComponent implements OnInit {
  ngOnInit(): void {
    // this.title.setTitle('Pricing Page');
    this.meta.updateTag({
      name: 'description',
      content: 'Informacion de precios',
    });

    this.meta.updateTag({
      property: 'og:title',
      content: 'Pricing Page',
    });

    this.meta.updateTag({
      property: 'og:description',
      content: 'Informacion de precios',
    });

    // if (isPlatformBrowser(this.platform)) {
    //   document.title = 'Pricing Page';
    //   console.log(document.title);
    // }
  }
  private title = inject(Title);
  private meta = inject(Meta);
  private platform = inject(PLATFORM_ID);
}
