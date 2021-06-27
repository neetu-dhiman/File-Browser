import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ErrorComponent } from './file-explorer/modals/error/error.component';
import { File } from './file-explorer/Models/File';
import { FileService } from './service/file.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'File Browser';

  fileElements: Observable<File[]>;
  currentRoot: File;
  currentPath: string;
  canNavigateUp = false;

  constructor(private fileService: FileService, private dialogref: MatDialog) { }

  addNewItem(folder: { name: string, type: string }) {
    const res = this.fileService.add({ isFolder: folder.type === 'folder', name: folder.name, parent: this.currentRoot ? this.currentRoot.id : 'root' });
    if (!res) {
      let dialogRef = this.dialogref.open(ErrorComponent, { data: { message: `This destination already contained a ${folder.type} named ${folder.name}`} });
    }
    this.updateFileElementQuery();
  }

  removeItem(element: File) {
    this.fileService.delete(element.id);
    this.updateFileElementQuery();
  }

  moveItem(event: { element: File; moveTo: File }) {
    this.fileService.update(event.element.id, { parent: event.moveTo.id });
    this.updateFileElementQuery();
  }

  renameElement(element: File) {
    this.fileService.update(element.id, { name: element.name });
    this.updateFileElementQuery();
  }
  updateFileElementQuery() {
    this.fileElements = this.fileService.queryInFolder(this.currentRoot ? this.currentRoot.id : 'root');
  }

  navigateUp() {
    if (this.currentRoot && this.currentRoot.parent === 'root') {
      this.currentRoot = null;
      this.canNavigateUp = false;
      this.updateFileElementQuery();
    } else {
      this.currentRoot = this.fileService.get(this.currentRoot.parent);
      this.updateFileElementQuery();
    }
    this.currentPath = this.popFromPath(this.currentPath);
  }

  navigateToFolder(element: File) {
    this.currentRoot = element;
    this.updateFileElementQuery();
    this.currentPath = this.pushToPath(this.currentPath, element.name);
    this.canNavigateUp = true;
  }

  pushToPath(path: string, folderName: string) {
    let p = path ? path : '';
    p += `${folderName}/`;
    return p;
  }

  popFromPath(path: string) {
    let p = path ? path : '';
    let split = p.split('/');
    split.splice(split.length - 2, 1);
    p = split.join('/');
    return p;
  }
}
