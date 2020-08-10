import { IPost } from "../interfaces/post.interface";

export class Post implements IPost{
    constructor(
        public id: number,
        public postedBy: string,
        public topic: string,
        public date: Date,
        public message: string,
        public avatar?: string,
        public image?: string
    ){}
}


