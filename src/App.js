import React, { useState, useEffect } from 'react'
import './App.css';
import Expenselist from './Components/Expenselist';
import Expenseform from './Components/Expenseform';
import Alert from './Components/alert';
import {v4} from 'uuid'


// const initialExpenses = [
//   {id: v4(), charge: "rent", amount: 1600},
//   {id: v4(), charge: "food", amount: 1600}, 
//   {id: v4(), charge: "clothes", amount: 1600}
// ];

const initialExpenses = localStorage.getItem('expenses')? JSON.parse(localStorage.getItem('expenses')): [];


function App() {
  //----------state values---------
  const [expenses, setExpenses] = useState(initialExpenses)
  const [charge, setCharge] = useState('');
  const [amount, setAmount] = useState('');
  const [alert, setAlert] = useState({show: false})
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState(0);

//----------functionality---------
  //--------handles-------------

  const handleCharge = e => {
      setCharge(e.target.value)
    }
  const handleAmount = e => {
      setAmount(e.target.value)
    }
  const handleAlert = ({type, text}) => {
    setAlert({show: true, type, text});
    setTimeout(() => {
      setAlert({show: false})
    },3000)
  }
  const handleSubmit = e => {
      e.preventDefault();
      if(charge !== '' && amount > 0) {
        if(edit) {
          let tempExpenses = expenses.map( item => {
            return item.id === id ?{...item, charge, amount} :item
          })
          setExpenses(tempExpenses);
          setEdit(false);
          handleAlert({type: 'success', text: 'item edited'})
        } else {
          const singleExpense = {id: v4(), charge, amount}
          setExpenses([...expenses, singleExpense]);
          handleAlert({type: 'success', text: 'item added'})
        }
        setCharge('')
        setAmount('')
      } else {
        //handle alert called
        handleAlert({type: 'danger', text:`charge can't be empty value and amount has to be bigger than zero`})
      }
    }

    //-----------clear----------
  const clearItems = () => {
    setExpenses([]);
    handleAlert({type: 'danger', text: "all items deleted"})
  }
  
  const handleDelete = (id) => {
    let tempExpenses = expenses.filter(item => item.id !== id);
    setExpenses(tempExpenses);
    handleAlert({type: 'danger', text: "item deleted"})
  }

  const handleEdit = (id) => {
    let expense = expenses.find(item => item.id === id)
    let {charge, amount} = expense;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
  }

//------------effect------------

  useEffect(()=>{
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [])


 

  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} /> }
      <Alert />
      <h1>Budget calculator</h1>
      <main className="App">
        <Expenseform charge={charge} amount={amount} handleCharge={handleCharge} handleAmount={handleAmount} handleSubmit={handleSubmit} edit={edit}/>
        <Expenselist expenses={expenses} handleDelete={handleDelete} handleEdit={handleEdit} clearItems={clearItems}/>
      </main>
      <h1>
        Total spending : <span className='total'>
          ${expenses.reduce((acc, curr) => {
            return (acc += parseInt(curr.amount));
          }, 0)}
          </span>
      </h1>
    </>
  );
}

export default App;
