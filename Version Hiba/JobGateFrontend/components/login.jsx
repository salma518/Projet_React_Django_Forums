import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function LoginPage(){
    let [datauser,setdatauser]=useState({email:"",password:""})
    const navigate = useNavigate()
    const getvalue = (event) =>{
        setdatauser((prev)=>({
            ...prev,
            [event.target.name]:event.target.value
        }))
    }
    const login = () =>{
        axios.post('http://127.0.0.1:8000/api/auth/',datauser).then((response)=>{
            if(response.status === 200){
                // AuthentificationUsers from views
                console.log(response.data)
                localStorage.setItem("token-login",response.data.access)
                localStorage.setItem("user",response.data.user)
                if (response.data.user_type === "Talent")
                    navigate('/user')
                else
                    navigate('/Recruteur')
            }
        }).catch((error)=>{
            console.log(error)
        })
    }

    console.log(datauser)
    return <>
        <label htmlFor="">Email </label>
        <input type="email" name="email" id="" onChange={getvalue}/><br />
        <label htmlFor="">Password </label>
        <input type="password" name="password" id="" onChange={getvalue}/><br />
        <button type="button" onClick={login}>Se connecter</button>
    </>
}