import { Component, input, model } from '@angular/core'
import { AbstractControl } from '@angular/forms'

@Component({
  selector: 'tranglo1-shared-ui-timeline-step',
  template: `<ng-content></ng-content>`,
  host: {
    class: 'timeline-stepper-step',
    '[style.display]': 'active() ? "block" : "none"'
  }
})
export class TimelineStepComponent {
  readonly label = input.required<string>()
  readonly description = input<string>()
  readonly optional = input(false)
  readonly hasError = input(false)
  readonly disabled = input(false)
  readonly editable = input(true)
  readonly stepControl = input<AbstractControl | null>(null)
  readonly completed = model(false)
  readonly index = model(-1)
  readonly active = model(false)
}
