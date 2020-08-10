import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from './../interfaces/user.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IPost } from '../interfaces/post.interface';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private htttp: HttpClient,
  ) {}

getUsers(): Observable<Array<IUser>>{
    return this.htttp.get<Array<IUser>>(environment.url + 'users');
}

addUser(user: IUser): Observable<Array<IUser>>{
  return this.htttp.post<Array<IUser>>(environment.url + 'users', user);
}




}
