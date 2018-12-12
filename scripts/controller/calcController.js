
/*
* método construtor é chamado automaticamente quando é feita a instancia de uma classe
* atributos e métodos podem ser encapsulados usando um underline por convenção
*/
class CalcController{

	constructor(){

		// private
		this._displayCalc = '0';
		
		this._currentDate;

		this.initialize();
	}
	
	// initialize
	initialize(){

		// date
		let dateEl = document.querySelector('#data');

		// time
		let timeEl = document.querySelector('#hora');

		// display
		let displayEl = document.querySelector('#display');

		displayEl.innerHTML = '1234';
		timeEl.innerHTML = '23:23';
		dateEl.innerHTML = '12/12/2018';

	}
	// get
	get displayCalc(){
		return this._displayCalc;
	}

	get currentDate(){
		return this._currentDate;
	}
	
	// set
	set currentDate(value){
		this._currentDate = value;
	}
	
	set displayCalc(value){
		this._displayCalc = value;
	}
}