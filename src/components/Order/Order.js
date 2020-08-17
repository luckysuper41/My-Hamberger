import React from 'react';
import classes from './Order.css';

const order =(props) =>{
     const ingredients =[];

     for(let ingredientName in props.ingredients){
          ingredients.push(
               {
               name: ingredientName, 
               amount: props.ingredients[ingredientName]

               }
          );
     }

     const ingredientOutput = ingredients.map(ig =>{
     return <span 
          key={ig.name} 
          className={classes.igOutput}
          >{ig.name} ({ig.amount}) </span>
     });

     return(
     <div className={classes.Order}>
          <p>Ingredient: {ingredientOutput}</p>
          <p>Price: <strong>USD: {Number.parseFloat(props.price).toFixed(2)}</strong></p>
          <p>Date: {props.date}</p>
     </div>
     );
}

export default order;