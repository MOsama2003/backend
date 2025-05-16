export declare class CreateCommentDto {
    parentCommentId?: string;
    commentText: string;
}
export declare class CommentListingDto {
    page: number;
    limit: number;
    parentCommentId?: string | null;
}
