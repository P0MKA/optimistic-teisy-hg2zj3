import {useState} from 'react';
import {Navigate} from 'react-router-dom';


function LoginForm({getToken, setToken, token}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault();
    getToken(username, password, setToken);
  }

  return (
      <div>
        <form onSubmit={(event) => handleSubmit(event)}>
          <input type="text" name='username' placeholder="login"
                 onChange={({target}) => setUsername(target.value)}/>
          <input type="password" name='password' placeholder="password"
                 onChange={({target}) => setPassword(target.value)}/>
          <input type="submit" value="Login"/>
        </form>
        {// тернарник, чтобы отправиться на главную в случае успешной авторизации
          (token)
            ? <Navigate to={'/'}/>
            : null
        }
      </div>

  );
}

export default LoginForm;