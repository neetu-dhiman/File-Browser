import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { v4 } from 'uuid';
import { File} from '../file-explorer/Models/File';

export interface IFileService {
  add(file: File)
  delete(id: string)
  update(id: string, update: Partial<File>)
  queryInFolder(folderId: string): Observable<File[]>
  get(id: string): File
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private map = new Map<string, File>();

  constructor() { }

  add(file: File) {
    file.id = v4();
    let sameParentItems = [] ; 
    for (let k of this.map.keys()) {
      const item = this.map.get(k);
      if (item.parent === file.parent && item.isFolder === file.isFolder){
        sameParentItems.push(this.map.get(k));
      }
    }
    const filteredItem = sameParentItems.filter(item => item.name.toLowerCase() === file.name.toLowerCase());
    if(filteredItem.length > 0) {
      return false;
    }
    this.map.set(file.id, this.clone(file));
    return file;
  }

  delete(id: string) {
    this.map.delete(id);
  }

  update(id: string, update: Partial<File>) {
    let element = this.map.get(id);
    element = Object.assign(element, update);
    this.map.set(element.id, element);
  }

  private querySubject: BehaviorSubject<File[]>
  queryInFolder(folderId: string) {
    const result: File[] = [];
    this.map.forEach(element => {
      if (element.parent === folderId) {
        result.push(this.clone(element));
      }
    })
    if (!this.querySubject) {
      this.querySubject = new BehaviorSubject(result);
    } else {
      this.querySubject.next(result);
    }
    return this.querySubject.asObservable();
  }

  get(id: string) {
    return this.map.get(id);
  }

  clone(element: File) {
    return JSON.parse(JSON.stringify(element));
  }
}
