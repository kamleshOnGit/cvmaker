import { Component, OnInit } from '@angular/core';
import { faPlay, faUpload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  playIcon = faPlay;
  uploadIcon = faUpload;

  constructor() { }

  ngOnInit() {
  }

}
