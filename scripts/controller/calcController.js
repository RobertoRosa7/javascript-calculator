
/*
* método construtor é chamado automaticamente quando é feita a instancia de uma classe
* atributos e métodos podem ser encapsulados usando um underline por convenção
*
* método nativo javaScript para conversão e formatação de data 
* toLocaleDateString('pt-BR', {day:'2-digit',month:'long',year:'numeric'}) | toLocaleTimeString('pt-BR')
*
* função nativa: split() para converter string em arrays
* função nativa: window.isNaN() - return true or false
* função nativa: indexOf(value) - 	verifica se existe determinado valor dentro do array se não encontrar 
* 									seu retorno será -1, case seja, retornar o índice do valor encontrado
*
* função nativa: join() - converte array para strings - com aspas duplas remove vírgulas
*
*/
class CalcController{

	constructor(){

		// audio
		this._audio = new Audio('click.mp3');
		// audio on/off
		this._audioOnOff = false;

		// last operator
		this._lastOperator = '';

		// last number
		this._lastNumber = '';

		// operation empty to receive values of number
		this._operation = [];

		// date
		this._dateEl = document.querySelector('#data');

		// time
		this._timeEl = document.querySelector('#hora');

		// display
		this._displayCalcEl = document.querySelector('#display');
		
		// current date
		this._currentDate;

		// Locale
		this._locale = 'pt-BR';

		// Format date
		this._formatDate = {day:'2-digit',month:'long',year:'numeric'};
		
		// initialize
		this.initialize();

		// init events
		this.initButtonsEvents();

		// init keyboard
		this.initKeyboard();

	}
	// paste on cliboard (CTRL+V)
	pasteFromClipboard(){

		// add events in all document
		document.addEventListener('paste', e => {

			// func native to paste data
			let text = e.clipboardData.getData('Text');

			// show to display
			this.displayCalc = parseFloat(text);

		});
	}
	// copy to paste (CTRL+C)
	copyToClipboard(){

		// create an element
		let input = document.createElement('input');

		// passing the value from display
		input.value = this.displayCalc;

		// add element to body
		document.body.appendChild(input);

		// selecting the element
		input.select();

		// execute the command copy
		document.execCommand('Copy');

		// remove input
		input.remove();
	}
	// initialize
	initialize(){
		
		// date & time 
		this.setDisplayDateTime();

		// interval 1000
		setInterval(()=>{	

			// update realtime
			this.setDisplayDateTime();

		}, 1000);

		// after initialize reset operation to zero
		this.setLastNumberToDisplay();

		// active paste clipboard
		this.pasteFromClipboard();

		document.querySelectorAll('.btn-ac').forEach(btn => {

			btn.addEventListener('dblclick', e => {

				// control audio - enable/disable
				this.toggleAudio();
			});
		});
	}
	// enable or disable audio
	toggleAudio(){
		
		this._audioOnOff = !this._audioOnOff;
		//this._audioOnOff = (this._audioOnOff) ? false : true;
		

	}
	// play audio
	playAudio(){

		// verify if authorify to play
		if(this._audioOnOff){
			
			// return to start audio
			this._audio.currentTime = 0;
			
			// play audio
			this._audio.play();
		}
	}
	// add one or more events over elements
	addEventListenerAll(element, events, func){

		// convert events in array and get all events
		events.split(' ').forEach(event => {

			// aply event on element - false for get just one event
			element.addEventListener(event, func, false);

		});
	}
	// init keyboard
	initKeyboard(){

		// add events on document to get keyboard
		document.addEventListener('keyup', e => {

			// play audio
			this.playAudio();

			// switch 
			switch(e.key){

				case 'Escape':
					this.clearAll();
					break;
				case 'Backspace':
					this.clearEntry();
					break;
				case '+':
				case '-':
				case '*':
				case '%':
				case '/':
					this.addOperation(e.key);
					break;
				
				case 'Enter':
				case '=':
					this.calc();
					break;

				case '.':
				//case ',':
					this.addDot();
					break;

				case '0':
				case '1':
				case '2':
				case '3':
				case '4':
				case '5':
				case '6':
				case '7':
				case '8':
				case '9':
					this.addOperation(parseInt(e.key));
					break;
				case 'c':
					if(e.ctrlKey) this.copyToClipboard();
					break;
			}
		});
	}
	// clear all on display
	clearAll(){

		this._operation = [];
		this._lastOperator = '';
		this._lastNumber = '';
		this.setLastNumberToDisplay();

	}
	// clear entry on display
	clearEntry(){

		this._operation.pop();
		this.setLastNumberToDisplay();

	}
	// get number
	getLastOperation(){

		// get last position of number
		return this._operation[this._operation.length -1];
	}
	// set last number of operation
	setLastOperation(value){
		
		this._operation[this._operation.length -1] = value;

	}
	// operators
	isOperator(value){

		// verify if exists into array the value return -1 or 0
		return (['+', '-', '*', '%', '/'].indexOf(value) > -1);

	}
	// resgister in array
	pushOperation(value){

		this._operation.push(value);

		// varify if operation > 3
		if(this._operation.length > 3){

			// calc
			this.calc();
		}
	}
	getResult(){
		try{
			
			return eval(this._operation.join(""));

		}catch(e){
				
			this.setError('Sem Operador');

		}

	}
	// method to calculate
	calc(){

		let last = '';
		
		// last operator
		this._lastOperator = this.getLastItem();

		if(this._operation.length < 3){
			
			let firstItem = this._operation[0];
			
			this._operation = [firstItem, this._lastOperator, this._lastNumber];
		}
		if(this._operation.length > 3){

			// remove the last operator
			last = this._operation.pop();	

			// keep result in egual button
			this._lastNumber = this.getResult();
		
		}else if(this._operation.length == 3){
	
			// keep the last operator and the last number
			this._lastNumber = this.getLastItem(false);
		
		}
		
		// convert array in string with join() and  making calc with eval()
		let result = this.getResult();

		// verify if % and doing calc
		if(last == '%'){

			result /= 100;

			// new operation
			this._operation = [result];

		}else {

			// new operation
			this._operation = [result];	

			if(last) this._operation.push(last);

		}

		// show result on display
		this.setLastNumberToDisplay();
	}
	// get the last item on operation
	getLastItem(isOperator = true){

		// last number
		let lastItem;
		
		// verify is not operator
		for(let i = this._operation.length -1; i >= 0; i--){

			if(this.isOperator(this._operation[i]) == isOperator){
				lastItem = this._operation[i];
				break;
			}
		}
		if(!lastItem){

			lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
		}
		return lastItem;
	}
	// get last number to display
	setLastNumberToDisplay(){

		// last number
		let lastNumber = this.getLastItem(false);

		// reset to zero
		if(!lastNumber) lastNumber = 0;

		// show the last number
		this.displayCalc = lastNumber;
	}
	// add operation on attr
	addOperation(value){

		// verify if is a number
		if(isNaN(this.getLastOperation())){
			// string

			// verify and change operator
			if(this.isOperator(value)){

				// get current operator
				this.setLastOperation(value);

			}else{

				this.pushOperation(value);
				this.setLastNumberToDisplay();

			}

		}else{

			if(this.isOperator(value)){

				this.pushOperation(value);

			}else {

				// number | convert to string | concat
				let newValue = this.getLastOperation().toString() + value.toString();
				this.setLastOperation(newValue);

				// update display
				this.setLastNumberToDisplay();
			}
		}
	}
	// error
	setError(value = 'error'){

		this.displayCalc = value;
	}
	// add (.) on display
	addDot(){

		let lastOperation = this.getLastOperation();

		if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

		if(this.isOperator(lastOperation) || !lastOperation){

			this.pushOperation('0.');
		}else{
			this.setLastOperation(lastOperation.toString() + '.');
		}
		this.setLastNumberToDisplay();
		//console.log('addDot: ',lastOperation);
	}
	// testing possible case on events buttons
	execBtn(value){

		// play audio
		this.playAudio();

		// switch 
		switch(value){

			case 'ac':
				this.clearAll();
				break;
			case 'ce':
				this.clearEntry();
				break;
			case 'soma':
				this.addOperation('+');
				break;
			case 'subtracao':
				this.addOperation('-');
				break;
			case 'divisao':
				this.addOperation('/');
				break;
			case 'porcento':
				this.addOperation('%');
				break;
			case 'multiplicacao':
				this.addOperation('*');
				break;
			case 'igual':
				this.calc();
				break;
			case 'ponto':
				this.addDot('.');
				break;

			case '0':
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
				this.addOperation(parseInt(value));
				break;
			
			default:
				this.setError();
		}
	}
	// init eventes in buttons
	initButtonsEvents(){

		// get all events on button child elements
		let buttons = document.querySelectorAll('#buttons > g, #parts > g');

		// listen events on button
		buttons.forEach((btn, index) => {

			// get events
			this.addEventListenerAll(btn, 'click drag', e =>{
				
				// extracting text from button
				let txt = btn.className.baseVal.replace('btn-','');

				// action btn
				this.execBtn(txt);


				//Debug get class from button 
				//console.log(btn.className.baseVal.replace('btn-',''));

			});

			// format cursor for all events on buttons
			this.addEventListenerAll(btn,'mouseover mouseup mousedown', e => {

				// cursor pointer
				btn.style.cursor = 'pointer';

			});

		});

	}
	// set display interval
	setDisplayDateTime(){

		this.displayDate = this.currentDate.toLocaleDateString(this._locale,this._formatDate);
		
		this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
	
	}
	// get
	get displayTime(){
		return this._timeEl.innerHTML;
	}
	get displayDate(){
		return this._dateEl.innerHTML;
	}
	get displayCalc(){
		return this._displayCalcEl.innerHTML;
	}
	get currentDate(){
		return new Date();
	}
	// set
	set displayTime(value){
		this._timeEl.innerHTML = value;
	}
	set displayDate(value){
		this._dateEl.innerHTML = value;
	}
	set currentDate(value){
		this._currentDate = value;
	}
	set displayCalc(value){
	
		// limit char on display
		if(value.toString().length > 10){

			this.setError();
			
			return false;
		}

		this._displayCalcEl.innerHTML = value;
	}
}