import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as action from '../../../store/actions/index';
import {updateObject, checkValidity} from '../../../shared/utility';

import {connect} from 'react-redux';

class ContactData extends Component {

     state={
          orderForm:{
               name: {
                    elementType: 'input',
                    elementConfig:{
                         type:'text',
                         placeholder:'Your name'
                    },
                    value: '',
                    validation:{
                         required: true
                    },
                    valid: false,
                    touched:false
               },
               street: {
                    elementType: 'input',
                    elementConfig:{
                         type:'text',
                         placeholder:'Street'
                    },
                    value: '',
                    validation:{
                         required: true
                    },
                    valid: false,
                    touched:false
               },
               zipCode: {
                    elementType: 'input',
                    elementConfig:{
                         type:'text',
                         placeholder:'ZIP Code'
                    },
                    value: '',
                    validation:{
                         required: true,
                         minLength: 5,
                         maxLength: 5,
                         isNumeric: true
                    },
                    valid: false,
                    touched:false
               },
               country: {
                    elementType: 'input',
                    elementConfig:{
                         type:'text',
                         placeholder:'Country'
                    },
                    value: '',
                    validation:{
                         required: true
                    },
                    valid: false,
                    touched:false
               },
               email: {
                    elementType: 'input',
                    elementConfig:{
                         type:'email',
                         placeholder:'Your Email'
                    },
                    value: '',
                    validation:{
                         required: true,
                         isEmail: true
                    },
                    valid: false,
                    touched:false
               },
               deliveryMethod: {
                    elementType: 'select',
                    elementConfig:{
                         options:[
                              {value: 'fastest', displayValue: 'Fastest'},
                              {value: 'cheapest', displayValue: 'Cheapest'}
                         ]
                    },
                    value: 'fastest',
                    validation:{},
                    valid: true,
               }
          },
          formIsValid:false
     }

     orderHandler=(event)=>{
          event.preventDefault();
          const formData ={};
          for(let formElementIdentifier in this.state.orderForm){
               formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
          }
          const order ={
               ingredients: this.props.ings,
               price: this.props.price,
               date: this.props.date,
               orderData: formData,
               userId: this.props.userId
          }

          this.props.onOrderBurger(order,this.props.token);
          
     }

     inputChangedHandler =(event, inputIdentifier)=>{
          
          const updatedFormElement = updateObject(this.state.orderForm[inputIdentifier],{
               value: event.target.value,
               valid: checkValidity(event.target.value, this.state.orderForm[inputIdentifier].validation),
               touched: true
          });

          const updatedOrderForm = updateObject(this.state.orderForm,{
               [inputIdentifier]:  updatedFormElement
          });

          let formIsValid =true;
          for(let inputIdentifier in updatedOrderForm){
               formIsValid =updatedOrderForm[inputIdentifier].valid && formIsValid;
          }
          this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
     }

     render(){

          const formElementsArray=[];
          for(let key in this.state.orderForm){
               formElementsArray.push({
                    id: key,
                    config: this.state.orderForm[key]
               });
          }

          let form =(
               <form onSubmit={this.orderHandler}>
                    {formElementsArray.map(formElement =>(
                         <Input 
                         key={formElement.id}
                         elementType={formElement.config.elementType} 
                         elementConfig={formElement.config.elementConfig}
                         value ={formElement.config.value}
                         invalid={!formElement.config.valid}
                         shouldValidate={formElement.config.validation}
                         touched={formElement.config.touched}
                         changed={(event)=> this.inputChangedHandler(event, formElement.id)}
                         />
                    ))}
                    
                    <Button btnType="Success" clicked={this.orderHandler} disabled={!this.state.formIsValid} >ORDER</Button>
                    </form>
          );
          if (this.props.loading){
               form = <Spinner/>
          }
          return(
               <div className={classes.ContactData}>
                    <h4>Enter your Contact Data</h4>
                    {form}
               </div>
          )
     }
}

const mapStateToProps = state =>{
     //date
     let today = new Date();
     let dd = today.getDate();
     let mm = today.getMonth();
     let yyyy = today.getFullYear();
     let hours = today.getHours();
     let minute = today.getMinutes();

     if(minute <10){
          minute = '0'+minute;
     };
     if(dd<10){
          dd = '0'+dd;
     };
     if(mm<10){
          mm = '0'+mm;
     };

     let time = hours+'h'+minute+'min';
     let day = dd+'/'+mm+'/'+yyyy;

     let date = day+'-'+time;

     return{
          ings: state.burgerBuilder.ingredients,
          price: state.burgerBuilder.totalPrice,
          date: date,
          loading: state.order.loading,
          token: state.auth.token,
          userId: state.auth.userId
     }
};

const mapDispatchToProps = dispatch => {
     return{
          onOrderBurger: (orderData, token) => dispatch(action.purchaseBurger(orderData,token))
     };
     
};

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(ContactData , axios));