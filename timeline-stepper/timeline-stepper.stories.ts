import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'
import { provideAnimations } from '@angular/platform-browser/animations'
import type { Meta, StoryObj } from '@storybook/angular'
import { applicationConfig, moduleMetadata } from '@storybook/angular'
import {
  TimelineStepComponent,
  TimelineStepperComponent,
  TimelineStepperNextDirective,
  TimelineStepperPreviousDirective
} from '@tranglo1-frontend/shared/ui'

const showcaseStyles = `
  .timeline-stepper-story {
    min-height: 100%;
    padding: 2rem;
    background: linear-gradient(180deg, #f7f8fb 0%, #ffffff 100%);
  }

  .timeline-stepper-showcase__item {
    display: grid;
    gap: 1rem;
    max-width: 72rem;
    margin: 0 auto;
  }

  .timeline-stepper-showcase__item h3,
  .timeline-stepper-showcase__item p {
    margin: 0;
  }

  .timeline-stepper-showcase__actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .timeline-stepper-showcase__content,
  .timeline-stepper-showcase__card {
    display: grid;
    gap: 0.75rem;
  }

  .timeline-stepper-showcase__card {
    padding: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 0.75rem;
    background: #ffffff;
  }

  .timeline-stepper-showcase__field {
    display: grid;
    gap: 0.5rem;
    max-width: 22.5rem;
  }

  .timeline-stepper-showcase__field input {
    min-height: 2.75rem;
    padding: 0.75rem 1rem;
    border: 1px solid #cccccc;
    border-radius: 0.5rem;
    background: #ffffff;
  }
`

const withStoryShell = (content: string, props: Record<string, unknown> = {}) => ({
  props,
  styles: [showcaseStyles],
  template: `
    <section class="timeline-stepper-story">
      <div class="timeline-stepper-showcase__item">
        ${content}
      </div>
    </section>
  `
})

const meta: Meta<TimelineStepperComponent> = {
  title: 'Layout/Timeline Stepper',
  component: TimelineStepperComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, TimelineStepperComponent, TimelineStepComponent, TimelineStepperNextDirective, TimelineStepperPreviousDirective]
    }),
    applicationConfig({
      providers: [provideAnimations()]
    })
  ]
}

export default meta

type Story = StoryObj<TimelineStepperComponent>

export const FreeNavigation: Story = {
  render: () =>
    withStoryShell(`
      <h3>Free Navigation</h3>
      <p>Select any enabled step directly or move with the stepper directives.</p>

      <tranglo1-shared-ui-timeline-stepper>
        <tranglo1-shared-ui-timeline-step
          label="Transaction details"
          description="Static content example">
          <p>Consumers can place any markup inside a step.</p>
          <button
            type="button"
            class="primary-button-round"
            tranglo1TimelineStepperNext>
            Next
          </button>
        </tranglo1-shared-ui-timeline-step>

        <tranglo1-shared-ui-timeline-step
          label="Payer details"
          description="Mixed content example">
          <div class="timeline-stepper-showcase__content">
            <p>This step contains a paragraph and a list.</p>
            <ul>
              <li>Payer profile</li>
              <li>Address</li>
              <li>Funding source</li>
            </ul>
          </div>
          <div class="timeline-stepper-showcase__actions">
            <button
              type="button"
              class="secondary-button-round"
              tranglo1TimelineStepperPrevious>
              Back
            </button>
            <button
              type="button"
              class="primary-button-round"
              tranglo1TimelineStepperNext>
              Next
            </button>
          </div>
        </tranglo1-shared-ui-timeline-step>

        <tranglo1-shared-ui-timeline-step
          label="Payee details"
          description="Plain HTML block">
          <div class="timeline-stepper-showcase__card">
            <strong>Payee preview</strong>
            <p>Any custom HTML can live inside the current step panel.</p>
          </div>
          <div class="timeline-stepper-showcase__actions">
            <button
              type="button"
              class="secondary-button-round"
              tranglo1TimelineStepperPrevious>
              Back
            </button>
            <button
              type="button"
              class="primary-button-round"
              tranglo1TimelineStepperNext>
              Next
            </button>
          </div>
        </tranglo1-shared-ui-timeline-step>

        <tranglo1-shared-ui-timeline-step
          label="Confirmation"
          description="Last step">
          <p>Review and submit.</p>
          <button
            type="button"
            class="secondary-button-round"
            tranglo1TimelineStepperPrevious>
            Back
          </button>
        </tranglo1-shared-ui-timeline-step>
      </tranglo1-shared-ui-timeline-stepper>
    `)
}

export const StrictSequentialFlow: Story = {
  render: () =>
    withStoryShell(`
      <h3>Strict Next / Previous Flow</h3>
      <p>When skip is disabled, the next step stays disabled until the current step advances with the directive button.</p>

      <tranglo1-shared-ui-timeline-stepper [allowSkipStep]="false">
        <tranglo1-shared-ui-timeline-step
          label="Transaction details"
          description="Current step must use Next">
          <p>Step 2 is disabled until this step advances through the stepper button.</p>
          <button
            type="button"
            class="primary-button-round"
            tranglo1TimelineStepperNext>
            Next
          </button>
        </tranglo1-shared-ui-timeline-step>

        <tranglo1-shared-ui-timeline-step
          label="Payer details"
          description="Back is still allowed">
          <p>You can go back, but step 3 only unlocks after pressing Next here.</p>
          <div class="timeline-stepper-showcase__actions">
            <button
              type="button"
              class="secondary-button-round"
              tranglo1TimelineStepperPrevious>
              Back
            </button>
            <button
              type="button"
              class="primary-button-round"
              tranglo1TimelineStepperNext>
              Next
            </button>
          </div>
        </tranglo1-shared-ui-timeline-step>

        <tranglo1-shared-ui-timeline-step
          label="Payee details"
          description="Strict sequential access">
          <p>Only the immediate next step unlocks after progression.</p>
          <div class="timeline-stepper-showcase__actions">
            <button
              type="button"
              class="secondary-button-round"
              tranglo1TimelineStepperPrevious>
              Back
            </button>
            <button
              type="button"
              class="primary-button-round"
              tranglo1TimelineStepperNext>
              Next
            </button>
          </div>
        </tranglo1-shared-ui-timeline-step>

        <tranglo1-shared-ui-timeline-step
          label="Confirmation"
          description="Last step">
          <p>Final content can be any custom markup.</p>
          <button
            type="button"
            class="secondary-button-round"
            tranglo1TimelineStepperPrevious>
            Back
          </button>
        </tranglo1-shared-ui-timeline-step>
      </tranglo1-shared-ui-timeline-stepper>
    `)
}

export const FormControlledStep: Story = {
  render: () => {
    const payerNameControl = new FormControl('', { nonNullable: true, validators: [Validators.required] })

    return withStoryShell(
      `
        <h3>Form-Controlled Step</h3>
        <p>This mirrors the Material pattern where the next step depends on form validity.</p>

        <tranglo1-shared-ui-timeline-stepper [allowSkipStep]="false">
          <tranglo1-shared-ui-timeline-step
            label="Payer details"
            description="Next uses the same button directive"
            [stepControl]="payerNameControl">
            <label class="timeline-stepper-showcase__field">
              <span>Payer name</span>
              <input
                type="text"
                [formControl]="payerNameControl"
                placeholder="Enter payer name" />
            </label>
            <div class="timeline-stepper-showcase__actions">
              <button
                type="button"
                class="primary-button-round"
                [disabled]="payerNameControl.invalid"
                tranglo1TimelineStepperNext>
                Next
              </button>
            </div>
          </tranglo1-shared-ui-timeline-step>

          <tranglo1-shared-ui-timeline-step
            label="Confirmation"
            description="Unlocked only after valid form + next">
            <p>Payer name: {{ payerNameControl.value }}</p>
            <button
              type="button"
              class="secondary-button-round"
              tranglo1TimelineStepperPrevious>
              Back
            </button>
          </tranglo1-shared-ui-timeline-step>
        </tranglo1-shared-ui-timeline-stepper>
      `,
      {
        payerNameControl
      }
    )
  }
}
