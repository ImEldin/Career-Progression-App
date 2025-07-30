export class NotificationFilterCountDTO {
    filter: string;
    count: number;
  
    constructor(filter: string, count: number) {
      this.filter = filter;
      this.count = count;
    }
  }
  