import { Pipe, PipeTransform } from '@angular/core';
import {TranslationService} from './providers/translation.service'

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {
  constructor(private ts:TranslationService){
}


  transform(value: string): string {
    return this.ts.getTranslation(value);
  }
}
