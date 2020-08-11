import React, {Component} from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import {Route} from "react-router-dom";
import ContactData from './ContacteData/ContactData';


class Checkout extends Component {

     state={
          ingredients:null,
          price:0
     }

     componentWillMount(){
          const query = new URLSearchParams(this.props.location.search);
          const ingredients = {};
          let price = 0;

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
          for(let param of query.entries()){
               // ['salad', '1']
               if(param[0] === 'price'){
                    price = param[1];
               }else{
                    ingredients[param[0]] =+ param[1];
               }
               
          }
          this.setState({ingredients: ingredients});
          this.setState({price: price});
          this.setState({date:date});
     }

     checkoutCancelledHandler=()=>{
          this.props.history.goBack();
     }    

     checkoutContinuedHandler=()=>{
          this.props.history.replace('/checkout/contact-data');
     }

     render(){
          return(
               <div>
                    <CheckoutSummary 
                    ingredients={this.state.ingredients}
                    checkoutCancelled={this.checkoutCancelledHandler}
                    checkoutContinued={this.checkoutContinuedHandler}
                    />
                    <Route path={this.props.match.path + '/contact-data'} 
                    //render props pour utiliser history in ComtactData.js
                    render={(props)=>(<ContactData ingredients={this.state.ingredients} price={this.state.price} date={this.state.date} {...props} />)} />
               </div>
          );
     }
}

export default Checkout;