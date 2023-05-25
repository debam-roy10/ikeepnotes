import { React, useState } from 'react'
import { useHistory } from 'react-router-dom'

const Signup = (props) => {
    const [credentials, setCredentials] = useState({name: "", email: "", password: "", cpassword: ""})
    let history = useHistory();

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const {name, email, password} = credentials;
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({name, email, password})
          });
          const json = await response.json();

        if(json.success){
            // save the authtoken and redirect
            localStorage.setItem('token', json.authtoken);
            history.push("/");
            props.showAlert("Account Created Successfully", "success");
        }
        else{
            props.showAlert("Invalid Details (╥﹏╥)", "danger");
        }
    }

    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

  return (
    <div className="signup d-flex justify-content-center">
      <form onSubmit={handleSubmit}>
      <h2 className="my-3">Create an account to use ikeepnotes.online</h2>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" className="form-control" value={credentials.name} id="name" name="name" aria-describedby="emailHelp" onChange={onChange} placeholder="Enter name"/>
        </div>
        <div className="form-group mt-2">
          <label htmlFor="email">Email address</label>
          <input type="email" className="form-control" value={credentials.email} id="email" name="email" aria-describedby="emailHelp" onChange={onChange} placeholder="Enter email"/>
          <small id="emailHelp" className="form-text text-muted">Hope, We can be of service (˶ᵔ ᵕ ᵔ˶)</small>
        </div>
        <div className="form-group mt-1">
          <label htmlFor="password">Password</label>
          <input type="password" className="form-control" value={credentials.password} id="password" name="password" onChange={onChange} minLength={5} required placeholder="Password"/>
        </div>
        <div className="form-group my-2">
          <label htmlFor="cpassword">Confirm Password</label>
          <input type="password" className="form-control" value={credentials.password} id="cpassword" name="cpassword" onChange={onChange} minLength={5} required placeholder="Password"/>
        </div>
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary my-3">Signup</button>
        </div>
      </form>
    </div>
  )
}

export default Signup
