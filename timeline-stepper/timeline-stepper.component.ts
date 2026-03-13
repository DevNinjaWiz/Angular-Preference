import { AfterContentInit, Component, OnDestroy, computed, contentChildren, model, output } from '@angular/core'
import { toObservable } from '@angular/core/rxjs-interop'
import { Subject, filter, merge, takeUntil, tap } from 'rxjs'
import { TimelineStepComponent } from './timeline-step.component'

export type TimelineStepperOrientation = 'horizontal' | 'vertical'

const clampStepIndex = (index: number, totalSteps: number) =>
  Math.min(index, Math.max(totalSteps - 1, 0))

@Component({
  selector: 'tranglo1-shared-ui-timeline-stepper',
  templateUrl: './timeline-stepper.component.html',
  styleUrl: './timeline-stepper.component.scss'
})
export class TimelineStepperComponent implements AfterContentInit, OnDestroy {
  readonly #toNextStep = new Subject<void>()
  readonly #toPreviousStep = new Subject<void>()
  readonly #toSelectStep = new Subject<number>()
  readonly #destroy$ = new Subject<void>()

  readonly stepComponents = contentChildren(TimelineStepComponent, { descendants: true })
  readonly stepComponents$ = toObservable(this.stepComponents)
  readonly displayLayout = model<TimelineStepperOrientation>('horizontal')
  readonly allowSkipStep = model(true)
  readonly currentStep = model(0)
  readonly selectedStep = output<number>()

  readonly totalSteps = computed(() => this.stepComponents().length)
  readonly canGoBack = computed(() => this.currentStep() > 0)
  readonly viewSteps = computed(() =>
    this.stepComponents().map((step, index) => ({
      index,
      label: step.label(),
      completed: this.shouldShowStepAsCompleted(index),
      active: index === this.currentStep(),
      disabled: this.isStepDisabled(index)
    }))
  )

  ngAfterContentInit() {
    this.initWatcher()
  }

  private initWatcher() {
    const watchStepComponentChanges = this.stepComponents$.pipe(
      tap(() => {
        this.syncStepState(this.currentStep())
      })
    )

    const watchNextStep = this.#toNextStep.pipe(
      filter(() => this.canGoNext()),
      tap(() => {
        if (!this.allowSkipStep()) {
          this.setStepCompletion(this.currentStep(), true)
        }

        this.activateStep(this.currentStep() + 1)
      })
    )

    const watchPreviousStep = this.#toPreviousStep.pipe(
      filter(() => this.canGoBack()),
      tap(() => {
        const previousStepIndex = this.currentStep() - 1

        if (!this.allowSkipStep()) {
          this.clearCompletedStepsFrom(previousStepIndex)
        }

        this.activateStep(previousStepIndex)
      })
    )

    const watchSelectedStep = this.#toSelectStep.pipe(
      filter((index) => index !== this.currentStep()),
      filter((index) => this.canSelectStep(index)),
      tap((index) => {
        if (!this.allowSkipStep() && index < this.currentStep()) {
          this.clearCompletedStepsFrom(index)
        }

        this.activateStep(index)
      })
    )

    merge(
      watchStepComponentChanges,
      watchNextStep,
      watchPreviousStep,
      watchSelectedStep
    )
      .pipe(takeUntil(this.#destroy$))
      .subscribe()
  }

  ngOnDestroy() {
    this.#destroy$.next()
    this.#destroy$.complete()
  }

  onNext() {
    this.#toNextStep.next()
  }

  onPrevious() {
    this.#toPreviousStep.next()
  }

  private canGoNext(): boolean {
    const nextIndex = this.currentStep() + 1
    if (nextIndex >= this.totalSteps()) {
      return false
    }

    const nextStep = this.stepComponents()[nextIndex]
    if (!nextStep || nextStep.disabled()) {
      return false
    }

    return this.allowSkipStep() || this.canAdvanceFrom(this.currentStep())
  }

  onSelectStep(index: number) {
    this.#toSelectStep.next(index)
  }

  private activateStep(index: number) {
    this.syncStepState(index)
    this.selectedStep.emit(this.currentStep())
  }

  private syncStepState(index: number) {
    const clampedIndex = clampStepIndex(index, this.totalSteps())

    this.currentStep.set(clampedIndex)
    this.stepComponents().forEach((step, stepIndex) => {
      step.index.set(stepIndex)
      step.active.set(stepIndex === clampedIndex)
    })
  }

  private canSelectStep(index: number): boolean {
    const step = this.stepComponents()[index]
    if (!step || step.disabled()) {
      return false
    }

    if (this.allowSkipStep()) {
      return true
    }

    return index < this.currentStep() && step.editable()
  }

  private isStepDisabled(index: number): boolean {
    const step = this.stepComponents()[index]
    if (!step || step.disabled()) {
      return true
    }

    if (index === this.currentStep()) {
      return false
    }

    return !this.canSelectStep(index)
  }

  private canAdvanceFrom(index: number): boolean {
    const step = this.stepComponents()[index]
    if (!step || step.disabled()) {
      return false
    }

    if (step.optional()) {
      return true
    }

    const stepControl = step.stepControl()
    return stepControl ? stepControl.valid : true
  }

  private shouldShowStepAsCompleted(index: number): boolean {
    if (this.allowSkipStep()) {
      return false
    }

    const step = this.stepComponents()[index]
    if (!step) {
      return false
    }

    if (step.completed()) {
      return true
    }

    if (step.optional()) {
      return true
    }

    const stepControl = step.stepControl()
    return stepControl ? stepControl.valid && index < this.currentStep() : false
  }

  private setStepCompletion(index: number, completed: boolean) {
    const step = this.stepComponents()[index]
    step?.completed.set(completed)
  }

  private clearCompletedStepsFrom(index: number) {
    this.stepComponents()
      .slice(index)
      .forEach((step) => step.completed.set(false))
  }
}
