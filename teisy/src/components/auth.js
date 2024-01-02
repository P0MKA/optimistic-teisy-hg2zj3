import {useState} from 'react';
import {NavLink, Navigate} from 'react-router-dom';


function LoginForm ({getToken, setToken}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault();
    getToken(username, password, setToken);
  }

  return (
    <form onSubmit={(event) => handleSubmit(event)}>
      <input type="text" name='username' placeholder="login"
             onChange={({target}) => setUsername(target.value)}/>
      <input type="password" name='password' placeholder="password"
             onChange={({target}) => setPassword(target.value)}/>
      <input type="submit" value="Login"/>
    </form>
  );
}

export default LoginForm;