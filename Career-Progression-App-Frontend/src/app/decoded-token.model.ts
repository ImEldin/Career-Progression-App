export class DecodedToken {
  email: string;
  sub: string;
  name: string;
  exp: number;
  role?:string;
  constructor(email: string, sub: string, name: string, exp: number,role:string) {
    this.email = email;
    this.sub = sub;
    this.name = name;
    this.exp = exp;
    this.role = role;
  }

}
