import { Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about-page',
  imports: [],
  templateUrl: './about-page.component.html',
})
export class AboutPageComponent implements OnInit {
  ngOnInit(): void {
    this.title.setTitle('About Page');
    this.meta.updateTag({
      name: 'description',
      content: 'Informacion sobre la aplicacion',
    });

    this.meta.updateTag({
      property: 'og:title',
      content: 'About Page',
    });

    this.meta.updateTag({
      property: 'og:description',
      content: 'Informacion sobre la aplicacion',
    });
  }
  private title = inject(Title);
  private meta = inject(Meta);
}
