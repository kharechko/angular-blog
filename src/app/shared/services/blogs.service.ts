import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPost } from './../interfaces/post.interface';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogsService {

  constructor(
    private http: HttpClient
  ) { }



getPosts(): Observable<Array<IPost>>{
  return this.http.get<Array<IPost>>(environment.url + 'blogs');
}


addPost(post: IPost):Observable<Array<IPost>>{
  return this.http.post<Array<IPost>>(environment.url + 'blogs', post);
}


deletePost(post: IPost): Observable<Array<IPost>>{
  return this.http.delete<Array<IPost>>(environment.url + 'blogs/' + post.id);
}

updatePost(post: IPost): Observable<Array<IPost>>{
    return this.http.put<Array<IPost>>(environment.url + 'blogs/' + post.id, post);
}
}
