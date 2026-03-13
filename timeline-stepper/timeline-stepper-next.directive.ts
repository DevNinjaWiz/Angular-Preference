import { Directive, HostListener, inject } from '@angular/core'
import { TimelineStepperComponent } from './timeline-stepper.component'

@Directive({
  selector: '[tranglo1TimelineStepperNext]'
})
export class TimelineStepperNextDirective {
  readonly #stepper = inject(TimelineStepperComponent)

  @HostListener('click')
  onClick() {
    this.#stepper.onNext()
  }
}
