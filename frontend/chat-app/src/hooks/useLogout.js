import useAuth from "./useAuth";
export default function useLogout() {
    const {dispatch}=useAuth();
   const logout=()=>{ localStorage.removeItem("user");
    dispatch({type:'LOGOUT'});}
    return {logout}
}
