import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-folder-dialog',
  templateUrl: './new-folder-dialog.component.html',
  styleUrls: ['./new-folder-dialog.component.css']
})
export class NewFolderDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<NewFolderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  itemName: string;
  type: string;

  ngOnInit(): void {
    // console.log(this.data.type);
    this.type = this.data.type === 'folder' ? 'folder' : 'file';
    this.itemName = this.data.itemName ? this.data.itemName : '';
  }


}
