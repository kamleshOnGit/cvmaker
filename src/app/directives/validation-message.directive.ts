import { AfterViewInit, Directive, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[formControlName]'
})
export class ValidationMessageDirective implements AfterViewInit, OnDestroy {
  private messageElement: HTMLElement;
  private subscriptions: Subscription[] = [];

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private ngControl: NgControl
  ) { }

  ngAfterViewInit() {
    this.createMessageElement();

    if (this.ngControl?.control) {
      this.subscriptions.push(
        this.ngControl.control.statusChanges.subscribe(() => this.updateMessage()),
        this.ngControl.control.valueChanges.subscribe(() => this.updateMessage())
      );
    }

    this.renderer.listen(this.elementRef.nativeElement, 'blur', () => this.updateMessage());
    setTimeout(() => this.updateMessage());
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private createMessageElement() {
    this.messageElement = this.renderer.createElement('div');
    this.renderer.addClass(this.messageElement, 'control-error-message');
    this.renderer.setStyle(this.messageElement, 'display', 'none');

    const parent = this.elementRef.nativeElement.parentNode;
    this.renderer.appendChild(parent, this.messageElement);
  }

  private updateMessage() {
    const control = this.ngControl?.control;

    if (!control || !this.messageElement) {
      return;
    }

    const shouldShow = control.invalid && (control.touched || control.dirty);

    if (!shouldShow) {
      this.renderer.setStyle(this.messageElement, 'display', 'none');
      this.renderer.setProperty(this.messageElement, 'textContent', '');
      return;
    }

    this.renderer.setProperty(this.messageElement, 'textContent', this.getMessage());
    this.renderer.setStyle(this.messageElement, 'display', 'block');
  }

  private getMessage(): string {
    const control = this.ngControl.control;
    const label = this.getLabel();

    if (control.hasError('required')) {
      return `${label} is required`;
    }

    if (control.hasError('email')) {
      return `${label} is wrong`;
    }

    if (control.hasError('pattern')) {
      return `${label} format is wrong`;
    }

    if (control.hasError('minlength')) {
      return `${label} is too short`;
    }

    if (control.hasError('maxlength')) {
      return `${label} is too long`;
    }

    return `${label} is invalid`;
  }

  private getLabel(): string {
    const element = this.elementRef.nativeElement as HTMLElement;
    const formGroup = element.closest('.form-group');
    const label = formGroup?.querySelector('label')?.textContent?.trim();
    const controlName = this.ngControl.name?.toString() || 'This field';

    return label || this.toReadableLabel(controlName);
  }

  private toReadableLabel(value: string): string {
    return value
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, char => char.toUpperCase())
      .trim();
  }
}
