import { Directive, HostListener, inject } from '@angular/core'
import { TimelineStepperComponent } from './timeline-stepper.component'

@Directive({
  selector: '[tranglo1TimelineStepperPrevious]'
})
export class TimelineStepperPreviousDirective {
  readonly #stepper = inject(TimelineStepperComponent)

  @HostListener('click')
  onClick() {
    this.#stepper.onPrevious()
  }
}
