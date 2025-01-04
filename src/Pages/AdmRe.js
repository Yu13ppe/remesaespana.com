import React, { useState } from 'react';
import axios from 'axios';
import remesalogo from '../Assets/Images/remesalogo.png';
import { Input, Alert } from 'reactstrap';
import { Link, useHistory } from 'react-router-dom';
import { useDataContext } from '../Context/dataContext';
import { FaUser, FaLock, } from 'react-icons/fa';

function AdmRe() {
  const history = useHistory();
  const [adm_email, setEmail] = useState('');
  const [adm_password, setPassword] = useState('');
  const [tkn, setTkn] = useState('');
  const [error, setError] = useState("");
  const [attemps, setAttemps] = useState(3);
  const { setLogged, setAccessAdminToken, url } = useDataContext();
  const [alertVisible, setAlertVisible] = useState(false);

  const fetchData = async (email, password) => {
    try {
      const response = await axios.get(`${url}/Auth/loginAdmin/${email}/${password}`);
      setAccessAdminToken(response.data.data);
      const response2 = await axios.get(`${url}/Auth/findByTokenAdmin/${response.data.data.access_token}`);
      setTkn(response2.data);
      setLogged(true);
      history.push({
        pathname: "/Dashboard",
        state: {
          user: tkn,
        }
      });
    } catch (error) {
      console.log(error);
      await axios.get(
        `${url}/Auth/logoutAdmin/${email}`
      );
    }
    
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault(); 
  
    try {
      await fetchData(adm_email, adm_password);
  
 
    } catch (error) {
      if (attemps === 0) {
        setError("Has superado el número de intentos. Intenta más tarde.");
        setAlertVisible(true);
      } else {
        setAttemps(attemps - 1);
        const errorMessage = `Correo o contraseña incorrectos. Inténtalo de nuevo. Intentos restantes: ${attemps}`;
        setError(errorMessage);
        setAlertVisible(true);
      }
    }
  };
  
  
  

  return (
    <div className='AdmBody'>
      <div className="card-admtop2"></div>
      <div className="card-adm">
        <Link to='/'>
          <img className="logo" src={remesalogo} alt="Logo" />
        </Link>
        <form className="form" onSubmit={handleSubmit}>
          {error && (
            <Alert color="danger" isOpen={alertVisible}>
              {error}
            </Alert>)}
          <div className="container">
            <div className='row col-12'>
              <div className='d-flex align-items-center col-12'>
                <FaUser />
                <Input className='containerCorreo'
                  type="email"
                  value={adm_email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                  id="exampleEmail"
                  placeholder="Introduzca su correo">
                </Input>

              </div>
            </div>

            <div className='row col-12'>
              <div className='d-flex align-items-center col-12'>
                <FaLock />
                <Input
                  className='containerPassword'
                  id="examplePassword"
                  name="password"
                  placeholder="Introduzca su contraseña"
                  type="password"
                  value={adm_password}
                  onChange={(e) => setPassword(e.target.value)}>
                </Input>
              </div>
            </div>
          </div>
          <button type="submit" className='botonInicio btnLogin'>
            Iniciar Sesión
          </button>
        </form>
        <div>
          <Link className="Recover" to="/Recover">¿Olvidaste la contraseña?</Link>
        </div>
      </div>
    </div>
  );
}

export { AdmRe }