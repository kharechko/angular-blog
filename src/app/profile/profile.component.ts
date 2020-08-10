import { Component, OnInit, TemplateRef } from '@angular/core';
import { BlogsService } from './../shared/services/blogs.service';
import { UsersService } from './../shared/services/users.service';
import { IPost } from '../shared/interfaces/post.interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { User } from './../shared/models/user.model';
import { IUser } from './../shared/interfaces/user.interface';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Post } from './../shared/models/post.model';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [
    trigger('selectedImage', 
    [
      state('hideimage', style({
        opacity: 0,
      })),
      state('showImage', style({
        opacity: 1,
      })),
      transition('showImage => hideImage', [
        animate(0),
      ]),
      transition('hideImage => showImage', [
        animate(650)
      ])
    ]
    )
  ]
})


export class ProfileComponent implements OnInit {
  
  mode: ProgressSpinnerMode = 'determinate';
  imageState: string = 'showImage';
  spinnerValue = 0;
  sidebarToggler: boolean =  false;
  registerPage: boolean = true;
  hide = true;
  allPostsArray: Array<IPost>;
  dateFormat: string = 'hh:mm dd.MM.y';
  modalRef: BsModalRef;
  usersArray: Array<IUser> = [];
  registerName: string;
  registerPassword: string;
  registerEmail: string;
  userImage: any = "https://tse1.mm.bing.net/th?id=OIP.0h8fo76BwSZTehnXfYhcNQHaHc&pid=Api&P=0&w=300&h=300";
  postPhoto: any;
  userPassword: string = '';
  userEmail: string = '';
  usersPosts: Array<IPost> = [];
  notUserPosts: Array<IPost> = [];
  userProfileName: string;
  postDescr: string;
  postTitle: string;
  editedId: number;
  isEdited: boolean;
  isSpinned: boolean = true;
  

  constructor(
    private modalService: BsModalService,
    private blogsService: BlogsService,
    private usersService: UsersService,
    private snackBar: MatSnackBar
  ) {}


  ngOnInit(): void {
    this.getPosts();
    this.getUsers();
  }


getPosts(name?): void{
  this.blogsService.getPosts().subscribe( posts => {
    this.allPostsArray = posts;
    if(name){
      if(this.userProfileName === 'admin') {
        this.usersPosts = posts;
      } else {
        this.usersPosts = this.allPostsArray.filter( post =>  post.postedBy === name );
        this.notUserPosts = this.allPostsArray.filter( post =>  post.postedBy !== name );
      }
    }
   
  }, error => {
    console.log(error)
  })
}

openSnackBar(message: string, action: string, className: string) {
  this.snackBar.open(message, action, {
    duration: 2000
  });
}


openModal(modal: TemplateRef<any>, post?: IPost) {
  this.sidebarToggler = false;
  this.modalRef = this.modalService.show(modal);
  if(post) {
    this.isEdited = true;
    this.editedId = post.id;
    this.postDescr = post.message;
    this.postTitle = post.topic;
  } else {
    this.isEdited = false;
  }
}


  toggleSidebar(): void{
    this.sidebarToggler = !this.sidebarToggler;
  }



  uploadAvatarPhoto(event) {
    this.imageState = 'hideImage';
    if(event.target.files && event.target.files.length > 0){
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.userImage = e.target.result;
        this.imageState = 'showImage';
      };
      this.userImage = reader.readAsDataURL(event.target.files[0]);
     }
  }


  uploadPostPhoto(event){
    this.isSpinned = false;
    if(event.target.files && event.target.files.length > 0){
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.postPhoto = e.target.result;
        this.spinnerValue = 100;
      };
      this.postPhoto = reader.readAsDataURL(event.target.files[0]);
    }
  }


getUsers(): void{
  this.usersService.getUsers().subscribe( users => {
      this.usersArray = users;
  }, error => {
    console.log(error)
  });
}



validateRegisterForm(): boolean{
  this.getUsers();
  if(this.usersArray.length >= 1) {
    if(this.usersArray.some(user => { return this.registerEmail === user.email || this.registerName === user.username})) { return false}
    else { return true }
  }  else { return true }
}


signUp(): void{
   if(this.validateRegisterForm() && this.registerName && this.registerEmail && this.registerPassword) {
    const user: IUser = new User(1, this.registerName, this.registerEmail, this.registerPassword, this.userImage);
    if(this.usersArray.length >= 1){  user.id = this.usersArray.slice(-1)[0].id + 1;  }
    this.usersService.addUser(user).subscribe( () => {
      this.getUsers();
      this.modalRef.hide();
      this.resetRegisterForm();
    })
   }   
 }


signIn(): void{
  for(let user of this.usersArray){
    if(this.userEmail === user.email && this.userPassword === user.password){
      this.userProfileName = user.username;
      this.userImage = user.image;
      this.getPosts(user.username);
      this.modalRef.hide();
      this.registerPage = false;
      this.resetEnterForm();
    }
  }
}
 


resetEnterForm(): void{
 this.userEmail = '';
 this.userPassword = '';
}


resetRegisterForm(): void{
  this.userImage = 'https://tse1.mm.bing.net/th?id=OIP.0h8fo76BwSZTehnXfYhcNQHaHc&pid=Api&P=0&w=300&h=300';
  this.registerPassword = '';
  this.registerName = '';
  this.registerEmail = '';
}


addPost(): void{
  const post: IPost = new Post(1, this.userProfileName, this.postTitle, new Date(), this.postDescr, this.userImage, this.postPhoto);
  if(!this.isEdited) {
    if(this.allPostsArray.length >= 1){
      post.id = this.allPostsArray.slice(-1)[0].id + 1;
    }
    this.blogsService.addPost(post).subscribe( () => {
      this.modalRef.hide();
      this.getPosts(this.userProfileName);
      this.modalRef.hide();
      this.resetPostForm();
      this.spinnerValue = 0;
      this.isSpinned = true;
     })
  }
  else {
    post.id = this.editedId;
    this.blogsService.updatePost(post).subscribe( () => {
      this.getPosts(this.userProfileName);
      this.isSpinned = true;
      this.spinnerValue = 0;
      this.modalRef.hide();
      this.resetPostForm();
    })
  }
}


deletePost(post: IPost): void{
    this.blogsService.deletePost(post).subscribe( () => {
      this.getPosts(this.userProfileName);
      this.modalRef.hide();
      this.openSnackBar('post was successfully deleted 🙈', 'Close', 'red-snackbar')
    });
  }


resetPostForm(): void{
  this.postDescr = '';
  this.postTitle = '';
  this.postPhoto = '';
}

signOut(): void{
  this.notUserPosts = [];
  this.usersPosts = [];
  this.userProfileName = '';
  this.userImage = 'https://tse1.mm.bing.net/th?id=OIP.0h8fo76BwSZTehnXfYhcNQHaHc&pid=Api&P=0&w=300&h=300';
  this.registerPage = true;
  this.sidebarToggler = false;
 } 
}
