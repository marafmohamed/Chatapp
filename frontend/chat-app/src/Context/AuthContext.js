import React, {  useEffect, useState } from 'react'
import { createContext , useReducer  } from 'react'

const AuthReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload };
    case 'LOGOUT':
      return { user:null };
    default:
      return state;
  }
};
export const AuthContext = createContext();
export const AuthProvider=({children})=> {
  const [user, dispatch ]=useReducer(AuthReducer,{
    user:null
  });
  const [load,setLoad]=useState(false)
  useEffect(()=>{
    setLoad(true)
    const U=JSON.parse(localStorage.getItem('user'));
    if(U){
      dispatch({type :'LOGIN', payload: U});
    }
    setLoad(false);
  },[])
  return (
    <AuthContext.Provider value={{...user, dispatch,load}}>
      {children}
    </AuthContext.Provider>
  )
}
