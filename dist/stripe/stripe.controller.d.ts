import { StripeService } from './stripe.service';
export declare class StripeController {
    private readonly stripeService;
    constructor(stripeService: StripeService);
    createPaymentIntent(amount: number): Promise<{
        clientSecret: string | null;
    }>;
}
