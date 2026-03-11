export interface CreateAccountCheckoutDto {
  name: string;
  email: string;
  password?: string; 
  phone: string
}

export interface CheckoutResponse {
  url: string;
}