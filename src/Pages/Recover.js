import React, { useState } from 'react';
import axios from 'axios';
import slogan from '../Assets/Images/sloganremesa.png';
import remesalogo from '../Assets/Images/remesalogo.png';
import { Input, Button } from 'reactstrap';
import { Link, useHistory, Redirect } from 'react-router-dom';
import { useDataContext } from '../Context/dataContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Recover() {
  const { logged, url } = useDataContext();
  const history = useHistory();
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true); 
      await axios.post(`${url}/Mailer/emailRecovery/${to}`);
      toast.success('El correo fue enviado con éxito');
      setTo('');
      setTimeout(() => {
        history.push('/Login');
      }, 3000);
    } catch (error) {
      console.log(error);
      toast.error('Hubo un error al enviar el correo');
    } finally {
      setLoading(false); 
    }
  };

  return (
    logged ? (
      <Redirect to="/Changes" />
    ) : (
      <div className='RecoverBody'>
        <div>
          <div className="card-recovertop">
            <img className="slogan" src={slogan} alt="slogan" />
            <p className="parrafo-login">
              ¿No tienes cuenta aún? <Link to='/Register' id='RegisterA'>¡Regístrate!</Link>
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
                type="email"
                name="email"
                id="to"
                onChange={(e) => setTo(e.target.value)}
                placeholder="Introduzca su correo"
              />
              <Button type="button" onClick={handleSubmit} color='primary'>
                {loading ? 'Enviando...' : 'Enviar Correo de recuperación'}
              </Button>
              <Link to='/Login'>
                <Button color='secondary'>
                  Volver
                </Button>
              </Link>
            </form>
          </div>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    )
  );
}

export { Recover };
