export declare class StreamService {
    private serverClient;
    constructor();
    generateStreamToken(userId: number): string;
    createStreamUser(user: {
        id: number;
        name: string;
        email: string;
    }): Promise<import("stream-chat").APIResponse & {
        users: {
            [key: string]: import("stream-chat").UserResponse<import("stream-chat").DefaultGenerics>;
        };
    }>;
}
