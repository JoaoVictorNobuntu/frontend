import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})

export class CalculatorComponent {
  display = '';
  lastOperator = '';
  lastOperand = '';
  newCalculation = false;
  history: string[] = [];
  isVisible = true;
  decimalOperator: any;

  ngOnInit(): void {
        this.subscribeChangeLanguageEvent(this.translocoService);
        if(this.dialogInjectorData.formData===undefined || this.dialogInjectorData.formData ===null){
          this.display="";
        }else{
        this.display=this.dialogInjectorData.formData;
      }
      }
      

      private ngUnsubscribe = new Subject();

      subscribeChangeLanguageEvent(translocoService: TranslocoService){
              translocoService.events$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((eventResponse)=>{
                if(eventResponse.type == "langChanged"){
                  
                }
              });
            }


  constructor(private translocoService: TranslocoService,
        public dialogCalculatorRef: MatDialogRef<CalculatorComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public dialogInjectorData,
    ) {

      this.decimalOperator = this.translocoService.translate('componentsBase.filter-number-range-component.decimalOperator');
  }

  appendCharacter(char: string) {
    if (char === '.') {
    const parts = this.display.split(/[+\-*/]/);
    const lastPart = parts[parts.length - 1];
    if (lastPart.includes('.')) {
        return;
    }
}
    if (this.newCalculation && !'+-*/'.includes(char)) {
      this.display = char;
      this.newCalculation = false;
    } else {
      if (this.isOperator(char) && this.isOperator(this.display.slice(-1))) {
        this.display = this.display.slice(0, -1) + char;
      } else {
        this.display += char;
      }
      this.newCalculation = false;
    }
  }

  clear() {
    this.display = '';
    this.lastOperator = '';
    this.lastOperand = '';
    this.newCalculation = false;
  }

  backspace() {
    this.display = this.display.slice(0, -1);
  }

  calculate() {
    try {
      if (this.newCalculation && this.lastOperator && this.lastOperand) {
        const result = eval(`${this.display}${this.lastOperator}${this.lastOperand}`);
        this.display = result.toString();
        this.history.push(`${this.display}${this.lastOperator}${this.lastOperand} = ${result}`);
      } else {
        const result = parseFloat(eval(this.display).toFixed(2));

        this.history.push(`${this.display} = ${result}`);
        this.lastOperator = this.display.match(/[+\-*/]/g)?.pop() || '';
        this.lastOperand = this.display.split(/[+\-*/]/g).pop() || '';
        this.display = result.toString();
        this.newCalculation = true;
      }
    } catch {
      this.display = 'Erro';
    }
  }

  isOperator(char: string) {
    return '+-*/'.includes(char);
  }

  cancel() {
    this.dialogCalculatorRef.close(parseFloat(this.dialogInjectorData.formData));
  }

  confirm() {
    // Chame a função que você já tem pronta para inserir o número no formulário
    this.dialogCalculatorRef.close(parseFloat(this.display));
  }

  insertNumberIntoForm(number: string) {
    // Função de exemplo, substitua pela sua implementação real
    console.log(`Número inserido no formulário: ${number}`);
  }
     ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
}
}