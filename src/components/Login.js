import { React, useState } from 'react'
import { useHistory } from 'react-router-dom'

const Login = (props) => {
    const [credentials, setCredentials] = useState({email: "", password: ""})
    let history = useHistory();

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({email: credentials.email, password: credentials.password})
          });
          // eslint-disable-next-line
          const json = await response.json();

          if(json.success){
            // save the authtoken and redirect
            localStorage.setItem('token', json.authtoken);
            props.showAlert("Logged In Successfully", "success");
            history.push("/");
          }
          else{
            props.showAlert("Invalid Credentials (╥﹏╥)", "danger");
          }
    }

    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

  return (
    <div className="login d-flex justify-content-center">
      <form onSubmit={handleSubmit}>
        <h2>Login to Continue to ikeepnotes.online</h2>
          <div className="form-group">
            <label className="mt-2" htmlFor="email">Email address</label>
            <input type="email" className="form-control" value={credentials.email} id="email" name="email" aria-describedby="emailHelp" onChange={onChange} placeholder="Enter email"/>
            <small id="emailHelp" className="form-text text-muted">Oh! We meet again (☞ ͡° ͜ʖ ͡°)☞</small>
          </div>
          <div className="form-group my-2">
            <label htmlFor="password">Password</label>
            <input type="password" className="form-control" value={credentials.password} id="password" name="password" onChange={onChange} placeholder="Password"/>
          </div>
          <div className="d-flex justify-content-center my-4">
            <button type="submit" className="btn btn-primary">Login</button>
          </div>
      </form>
    </div>
  )
}

export default Login
