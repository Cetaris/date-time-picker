/**
 * timer-box.component
 */

import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    exportAs: 'owlDateTimeTimerBox',
    selector: 'owl-date-time-timer-box',
    templateUrl: './timer-box.component.html',
    styleUrls: ['./timer-box.component.scss'],
    preserveWhitespaces: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.owl-dt-timer-box]': 'owlDTTimerBoxClass'
    }
})

export class OwlTimerBoxComponent implements OnInit, OnDestroy {

    @Input() showDivider = false;

    @Input() upBtnAriaLabel: string;

    @Input() upBtnDisabled: boolean;

    @Input() downBtnAriaLabel: string;

    @Input() downBtnDisabled: boolean;

    /**
     * Value would be displayed in the box
     * If it is null, the box would display [value]
     * */
    @Input() boxValue: number;

    @Input() value: number;

    @Input() min: number;

    @Input() max: number;
    
    @Input() maxlength: number = 2;

    @Input() step = 1;

    @Input() inputLabel: string;

    @Output() valueChange = new EventEmitter<number>();

    @Output() inputChange = new EventEmitter<number>();

    private inputStream = new Subject<string>();

    private inputStreamSub = Subscription.EMPTY;

    get displayValue(): number {
        return this.boxValue || this.value;
    }

    get owlDTTimerBoxClass(): boolean {
        return true;
    }

    constructor() {
    }

    public ngOnInit() {
        this.inputStreamSub = this.inputStream.subscribe(( val: string ) => {
            if (val) {
                const inputValue = coerceNumberProperty(val, 0);
                this.updateValueViaInput(inputValue);
            }
        })
    }

    public ngOnDestroy(): void {
        this.inputStreamSub.unsubscribe();
    }

    public upBtnClicked(): void {
        this.updateValue(this.value + this.step);
    }

    public downBtnClicked(): void {
        this.updateValue(this.value - this.step);
    }

    // Christopher: Added value to remove non-numeric characters
    private stripNonNumbers(value: string) {
        let newString = "";
        const validKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

        if (value) {
            for (let i = 0; i < value.length; i++) {
                if (validKeys.indexOf(value[i]) !== -1) {
                    newString += value[i];
                }
            }
        }

        return newString;
    }

    public handleInputChange( val: string ): void {
        const hourEl: any = document.querySelector(".hour");
        const minuteEl: any = document.querySelector(".minute");
        let numValue: string;

        if (val.length <= this.maxlength) {
            numValue = this.stripNonNumbers(val)
            
            if (this.inputLabel === 'Minute') {
                minuteEl.value = parseInt(numValue);
            }
            else {
                hourEl.value = parseInt(numValue);
            }

            this.inputStream.next(numValue);
        }
        else {
            const strippedValue = this.stripNonNumbers(val);
            const newValue = strippedValue.substr(strippedValue.length - this.maxlength)

            if (this.inputLabel === 'Minute') {
                // Force the UI to display only 2 values
                this.value = parseInt(newValue);
                minuteEl.value = newValue;
            }
            else {
                this.boxValue = parseInt(newValue);
                hourEl.value = newValue;
            }

            this.inputStream.next(newValue);
        }
    }

    private updateValue( value: number ): void {
        this.valueChange.emit(value);
    }

    private updateValueViaInput( value: number ): void {
        if (value > this.max || value < this.min) {
            return;
        }

        this.inputChange.emit(value);
    }
}
