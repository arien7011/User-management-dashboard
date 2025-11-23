export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: { name: string };
  address: { street: string; city: string; zipcode: string };

}