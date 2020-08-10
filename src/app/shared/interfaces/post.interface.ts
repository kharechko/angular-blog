export interface IPost{
    id: number;
    postedBy: string;
    topic: string;
    date: Date;
    message: string;
    avatar?: string
    image?: any;
}