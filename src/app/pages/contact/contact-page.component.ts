import { Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contact-page',
  imports: [],
  templateUrl: './contact-page.component.html',
})
export class ContactPageComponent implements OnInit {
  ngOnInit(): void {
    this.title.setTitle('Contact Page');
    this.meta.updateTag({
      name: 'description',
      content: 'Informacion de contacto',
    });

    this.meta.updateTag({
      property: 'og:title',
      content: 'Contact Page',
    });

    this.meta.updateTag({
      property: 'og:description',
      content: 'Informacion de contacto',
    });
  }
  private title = inject(Title);
  private meta = inject(Meta);
}
