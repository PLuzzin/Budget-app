class Expense {
    constructor(year, month, day, type, description, amount){
        this.year = year
        this.month = month
        this.day = day
        this.type = type
        this.description = description
        this.amount = amount
    }
    isDataValid(){ // validatioin against empty fields.
        if(year.value == undefined || year.value == '' || year.value == null){
            return false
        }else if(month.value == undefined || month.value == '' || month.value == null){
            return false
        }else if(day.value == undefined || day.value == '' || day.value == null){
            return false
        }else if(type.value == undefined || type.value == '' || type.value == null){
            return false
        }else if(description.value == undefined || description.value == '' || description.value == null){
            return false
        }else if(amount.value == undefined || amount.value == '' || amount.value == null){
            return false                
        }
        return true
    }
}

class Db{
    constructor(){
        // check if id has been created
        let id = localStorage.getItem('id')
        if(id === null){ // if no id, create one
            localStorage.setItem('id', 0) // (key, value)
        }
    }
    // check last id created, set next id
    getNewId(){
        let newId = localStorage.getItem('id')
        return parseInt(newId) + 1
    }
    saveData(data){
        // create id
        let id = this.getNewId()
        localStorage.setItem(id, JSON.stringify(data)) //(key, value)
        localStorage.setItem('id', id) //(key, value)
    }
    showAllExpenses(){
        // create array expenses
        let expenses = Array()
        let id = localStorage.getItem('id')

        // read localStorage: check if there is any id available
        for(let x = 1; x <= id; x++){
            let expense = JSON.parse(localStorage.getItem(x))
            if(expense === null){
                continue
            }
            // save data from localStorage into the Array
            expense.id = x
            expenses.push(expense)
        }
        return expenses // array
    }
    filterSearch(expense){ // year, month, day, type, description, amount
        // create new array for filter
        let expensesFiltered = Array()
        // insert all data into the array
        expensesFiltered = this.showAllExpenses()

        if(expense.year != ''){
            console.log("filtro de ano")
            expensesFiltered = expensesFiltered.filter(function(valor){
                return valor.year == expense.year
            })
        }
        if(expense.month != ''){
            console.log("filtro month")
            expensesFiltered = expensesFiltered.filter(valor => valor.month == expense.month)
        }
        if(expense.day != ''){
            console.log("filtro day")
            expensesFiltered = expensesFiltered.filter(valor => valor.day == expense.day)
        }
        if(expense.type != ''){
            console.log("filtro type")
            expensesFiltered = expensesFiltered.filter(valor => valor.type == expense.type)
        }
        if(expense.description != ''){
            console.log("filtro description")
            expensesFiltered = expensesFiltered.filter(valor => valor.description == expense.description)
        }
        if(expense.amount != ''){
            console.log("filtro amount")
            expensesFiltered = expensesFiltered.filter(valor => valor.amount == expense.amount)
        }
        return expensesFiltered
    }
    deleteItem(id){
        localStorage.removeItem(id)
    }
    
}
let db = new Db()

// get form fields value
let year = document.getElementById('year')
let month = document.getElementById('month')
let day = document.getElementById('day')
let type = document.getElementById('type')
let description = document.getElementById('description')
let amount = document.getElementById('amount')

// List Table
let expenseList = document.getElementById('expenseList')

// modal
let modalSaveExpense = document.getElementById('modalSaveExpense')
let modalTitle = document.getElementById('modalTitle')
let headerBtnClose = document.getElementById('headerBtnClose')
let modalBody = document.getElementById('modalBody')
let footerBtnOk = document.getElementById('footerBtnOk')
let footerBtnClose = document.getElementById('footerBtnClose')



// save expenses on localStorage
function saveExpenses(){
    // get value from form fields
    let expense = new Expense(year.value, month.value, day.value, type.value, description.value, amount.value)

    if(expense.isDataValid()){
        // save into localStorage
        db.saveData(expense)

        // clear form
        year.value = ''
        month.value = ''
        day.value = ''
        type.value = ''
        description.value = ''
        amount.value = ''

        // modal success
        modalTitle.innerHTML = 'Success!'
        modalTitle.className = 'modal-title text-success fs-5'
        modalBody.innerHTML = 'Information successfully saved.'
        footerBtnOk.innerHTML = 'Ok'
        footerBtnOk.className = 'btn btn-success'
        
        // show success modal - JQuery from Bootstrap
        $('#modalSaveExpense').modal('show')
    }else {
        // modal success
        modalTitle.innerHTML = 'Error!'
        modalTitle.className = 'modal-title text-danger fs-5'
        modalBody.innerHTML = 'Please fill all information.'
        footerBtnOk.innerHTML = 'Go back'
        footerBtnOk.className = 'btn btn-danger'

        // show success modal - JQuery from Bootstrap
        $('#modalSaveExpense').modal('show')
    }
}

// Show saved data into table
function showExpenseList(expenses = Array(), filter = false){
    // if there is no filter applied; show all data on the table
    if(expenses.length == 0 && filter == false){
        expenses = db.showAllExpenses()
    }

    // clear table
    expenseList.innerHTML = ''
    
    // read array expenses
    expenses.forEach(function(expense){ // year, month, day, type, description, amount
        // create <tr>
        let row = expenseList.insertRow()
        // create columns
        row.insertCell(0).innerHTML = `${expense.day}/${expense.month}/${expense.year}`
        // show select type value
        switch(expense.type){
            case '1': expense.type = 'Food'
                break
            case '2': expense.type = 'Education'
                break
            case '3': expense.type = 'Fun'
                break
            case '4': expense.type = 'Health'
                break
            case '5': expense.type = 'Transport'
                break
        }
        row.insertCell(1).innerHTML = expense.type
        row.insertCell(2).innerHTML = expense.description
        row.insertCell(3).innerHTML = expense.amount

        // create delete item button
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = 'delete'
        btn.id = `id_expense_${expense.id}`
        btn.onclick = function(){
            // only get number
            let id = this.id.replace('id_expense_', '')
            db.deleteItem(id)
            // reload the page to show updated table
            window.location.reload()
        }
        row.insertCell(4).append(btn)
    })
}

// Search specific expense
function searchExpense(){
    let expense = new Expense(year.value, month.value, day.value, type.value, description.value, amount.value)
    let expenses = db.filterSearch(expense)
    this.showExpenseList(expenses, true)
}