import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NgModel } from '@angular/forms';
import { TimepickerConfig } from './angular-timepicker';
// tslint:disable-next-line:one-variable-per-declaration
declare var $: any, jQuery: any;
@Directive({
    selector: 'input[timepickerOptions]',
    // tslint:disable-next-line:use-host-property-decorator
    host: {
      '(change)': 'onChange($event.target.value)', '(blur)': 'onChange($event.target.value)'
    },
    providers: [NgModel]
  })
  export class AngularTimePickerDirective implements OnInit, ControlValueAccessor, AfterViewInit, OnChanges {
    @Input() timepickerOptions: TimepickerConfig | undefined;
    @Output()
    changeTime:EventEmitter<object> = new EventEmitter();
    @Output()
    timeFormatError:EventEmitter<object> = new EventEmitter();
    @Output()
    hideTimepicker:EventEmitter<object> = new EventEmitter();
    @Output()
    selectTime:EventEmitter<object> = new EventEmitter();
    @Output()
    showTimepicker:EventEmitter<object> = new EventEmitter();
    @Output()
    timeRangeError:EventEmitter<object> = new EventEmitter();
    $timepicker: any;
  
    constructor(
        private _renderer: Renderer2, 
        private _elementRef:ElementRef,
        private _ngModel:NgModel
        ) {
          if (typeof $ === 'undefined' && typeof jQuery !== 'undefined') {
            $ = jQuery;
        }
    }

    ngOnInit() {
      if ((typeof window !== 'undefined') && $ && typeof $.fn.owlCarousel === 'function') {
        this.$timepicker = $(this._elementRef.nativeElement);
      }
    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes['timepickerOptions'].previousValue) {
        this.$timepicker.timepicker('option', 'minTime', changes['timepickerOptions'].currentValue.minTime);
        this.$timepicker.timepicker('option', 'durationTime', changes['timepickerOptions'].currentValue.durationTime);
      }
    }

    ngAfterViewInit() {
      this.initTimePicker();
    }

    initTimePicker() {
      const self = this;
      this.$timepicker.timepicker('remove');
      this.$timepicker.timepicker(this.timepickerOptions);
      this.$timepicker.on('changeTime', (event: object | undefined) => {
        self.onUpdate(event);
        self.changeTime.emit(event);
      });
      this.$timepicker.on('timeFormatError', (event: object | undefined) => {
        self.timeFormatError.emit(event);
      });
      this.$timepicker.on('hideTimepicker', (event: object | undefined) => {
        self.hideTimepicker.emit(event);
      });
      this.$timepicker.on('selectTime', (event: object | undefined) => {
        self.selectTime.emit(event);
      });
      this.$timepicker.on('showTimepicker', (event: object | undefined) => {
        self.showTimepicker.emit(event);
      });
      this.$timepicker.on('timeRangeError', (event: object | undefined)  =>{
        self.timeRangeError.emit(event);
      });
    }
  
    // tslint:disable-next-line:no-empty
    onChange = (_:any) => {};
  
    // tslint:disable-next-line:no-empty
    onTouched = () => {
    };
  
    writeValue(value: any): void {
      this._renderer.setAttribute(this._elementRef.nativeElement, 'value', value);
    }
    
  
    registerOnChange(fn: () => any): void { this.onChange = fn; }
    registerOnTouched(fn: () => any): void { this.onTouched = fn; }

    private onUpdate(event:any) {
      let value = this._elementRef.nativeElement.value;
      this.writeValue(value);
      this._ngModel.viewToModelUpdate(value);
      this._elementRef.nativeElement.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }