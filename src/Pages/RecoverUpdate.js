import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import slogan from '../Assets/Images/sloganremesa.png';
import remesalogo from '../Assets/Images/remesalogo.png';
import { Input,
   Button,
    FormFeedback } from 'reactstrap';
import { Link, useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { useDataContext } from '../Context/dataContext';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

function RecoverUpdate() {
  const history = useHistory();
  const [userEmail, setUserEmail] = useState([]);
  const [use_password, setUse_password] = useState('');
  const [use_Confirmpassword, setUse_Confirmpassword] = useState('');
  const { url } = useDataContext();
  const { id, email } = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.put(
        `${url}/Users/PasswordRecovery/${id}`,
        {
          use_password
        },
      );
      toast.success('Contraseña actualizada');
      setTimeout(() => {
        history.push('/Login');
      }, 5000);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Users/email/${email}`);
      setUserEmail(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [setUserEmail, email, url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className='RecoverBody'>
      <div>
        <div className="card-recovertop">
          <img className="slogan" src={slogan} alt="slogan" />
          <p className="parrafo-login">
            ¿No tienes cuenta aún? {email} <Link to='/Register' id='RegisterA'>¡Regístrate!</Link>
          </p>
        </div>
        <div className="card-recovertop2"></div>
        <div className="card-recover">
          <Link to='/'>
            <img className="logo" src={remesalogo} alt="Logo" />
          </Link>
          <form className="form">
            <Input
              className='containerCorreo'
              type="password"
              name="text"
              onChange={(e) => setUse_password(e.target.value)}
              id="to"
              invalid={use_password.length < 8}
              placeholder="Introduzca su contraseña"
            />
            {use_password.length < 8 && (
              <FormFeedback invalid>
                Su contraseña debe contener mínimo 8 caracteres
              </FormFeedback>
            )}
            <Input
              className='containerCorreo'
              type="password"
              name="Confirm Password"
              onChange={(e) => setUse_Confirmpassword(e.target.value)}
              id="to"
              invalid={use_Confirmpassword !== use_password}
              placeholder="Introduzca su contraseña"
            />
            {use_Confirmpassword !== use_password && (
              <FormFeedback invalid>
                Las claves deben ser iguales
              </FormFeedback>
            )}
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={use_password !== use_Confirmpassword || use_password.length < 8 || email !== userEmail.use_email || parseInt(id) !== userEmail.use_id}
              color='primary'>
              Recuperar contraseña
            </Button>
            {(email !== userEmail.use_email || parseInt(id) !== userEmail.use_id) && (
              <FormFeedback>
                Los datos no coinciden
              </FormFeedback>
            )}
            <Link to='/Login'>
              <Button color='secondary'>
                Volver
              </Button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export { RecoverUpdate };