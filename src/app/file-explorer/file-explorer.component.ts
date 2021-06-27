import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { File } from './Models/File';
import { NewFolderDialogComponent } from './modals/new-folder-dialog/new-folder-dialog.component';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})
export class FileExplorerComponent implements OnInit {
  @Input() fileElements: File[];
  @Input() canNavigateUp: string;
  @Input() path: string;

  @Output() folderAdded = new EventEmitter<{ name: string, type: string }>();
  @Output() elementRemoved = new EventEmitter<File>();
  @Output() elementRenamed = new EventEmitter<File>();
  @Output() elementMoved = new EventEmitter<{
    element: File
    moveTo: File
  }>();
  @Output() navigatedDown = new EventEmitter<File>();
  @Output() navigatedUp = new EventEmitter();

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  deleteElement(element: File) {
    this.elementRemoved.emit(element);
  }

  navigate(element: File) {
    if (element.isFolder) {
      this.navigatedDown.emit(element);
    }
  }

  navigateUp() {
    this.navigatedUp.emit();
  }

  moveItem(element: File, moveTo: File) {debugger;
    this.elementMoved.emit({ element: element, moveTo: moveTo });
  }

  openContextMenu(event: MouseEvent, viewChild: MatMenuTrigger, element: File) {
    event.preventDefault();
    viewChild.openMenu();
  }

  openNewItemDialog(type) {
    let dialogRef = this.dialog.open(NewFolderDialogComponent, { data: { type } });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.folderAdded.emit({ name: res, type });
      }
    });
  }

  openRenameDialog(element: File) {
    let dialogRef = this.dialog.open(NewFolderDialogComponent, 
      { data: 
        { 
          type: element.isFolder ? 'folder' : 'file', 
          itemName: element.name 
        }
      });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        element.name = res;
        this.elementRenamed.emit(element);
      }
    });
  }

}
