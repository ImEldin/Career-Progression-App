import { Pipe, PipeTransform } from '@angular/core';
import { TIME_INTERVALS_IN_SECONDS } from '../utils/time.constants';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';

    const date = typeof value === 'string' ? new Date(value) : value;
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    for (const [unit, secondsInUnit] of Object.entries(TIME_INTERVALS_IN_SECONDS)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return interval === 1 ? `${interval} ${unit} ago` : `${interval} ${unit}s ago`;
      }
    }

    return 'Just now';
  }
}