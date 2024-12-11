import React, { useState } from 'react';
import axios from 'axios';
import remesalogo from '../Assets/Images/remesalogo.png';
import { Input, Button, Label, FormFeedback, InputGroup, Spinner } from 'reactstrap'; // Importa Spinner de reactstrap
import { Link, useHistory, Redirect } from 'react-router-dom';
import { FaUser, FaLock, FaRegEnvelope, FaPhone } from 'react-icons/fa'; // Agregar el icono de teléfono
import { ToastContainer, toast } from 'react-toastify';
import { useDataContext } from '../Context/dataContext';

function Register() {
  const { logged, url } = useDataContext();
  const history = useHistory();
  const [use_name, setUse_name] = useState('');
  const [use_lastName, setUse_lastName] = useState('');
  const [use_email, setUse_email] = useState('');
  const [use_password, setUse_password] = useState('');
  const [use_confirm, setUse_confirm] = useState('');
  const [use_phone, setUse_phone] = useState(''); // Nuevo estado para el número de teléfono
  const [termsCheckbox, setTermsCheckbox] = useState(false);
  const [loading, setLoading] = useState(false); // Estado para controlar la visibilidad del spinner

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      setLoading(true); // Muestra el spinner cuando se envía la solicitud
      await axios.post(
        `${url}/Auth/register`,
        {
          use_name,
          use_lastName,
          use_dni: '',
          use_email,
          use_password,
          use_verif: 'N',
          use_img: '',
          use_phone // Asegúrate de enviar el número de teléfono
        }
      );

      toast.success('¡Registro exitoso!', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      await axios.post(
        `${url}/Mailer/EmailWelcome/${use_email}`
      );

      history.push('/Login');

    } catch (error) {
      toast.error(error.response.data.message, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false); // Oculta el spinner cuando se complete la solicitud
    }
  };

  return (
    logged ? (
      <Redirect to="/Changes" />
    ) :
      <div className='RegisterBody'>
        <div className="card-register" style={{ width: '600px' }}>
          <Link to='/'>
            <img className="logo" src={remesalogo} alt="Logo" />
          </Link>
          <form onSubmit={handleSubmit} className="form">
            <div className='inputs'>
              <div className='row col-12'>
                <div className='d-flex align-items-center col-12'>
                  <FaUser style={{ marginTop: '30px', paddingTop: '5px', paddingRight: '5px', fontSize: '35px' }} />
                  <Input
                    className='input'
                    type="text"
                    placeholder="Nombre"
                    onChange={(e) => setUse_name(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className='row col-12'>
                <div className='d-flex align-items-center col-12'>
                  <FaUser style={{ marginTop: '30px', paddingTop: '5px', paddingRight: '5px', fontSize: '35px' }} />
                  <Input
                    className='input'
                    type="text"
                    placeholder="Apellido"
                    onChange={e => setUse_lastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className='row col-12'>
                <div className='d-flex align-items-center col-12'>
                  <FaRegEnvelope style={{ marginTop: '30px', paddingTop: '5px', paddingRight: '5px', fontSize: '35px' }} />
                  <Input
                    className='input'
                    type="email"
                    placeholder="Email"
                    onChange={e => setUse_email(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className='row col-12'>
                <div className='d-flex align-items-center col-12'>
                  <FaPhone style={{ marginTop: '30px', paddingTop: '5px', paddingRight: '5px', fontSize: '35px' }} />
                  <Input
                    className='input'
                    type="tel"
                    placeholder="Teléfono"
                    onChange={e => setUse_phone(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className='row col-12'>
                <InputGroup className='d-flex align-items-center col-12'>
                  <FaLock style={{ marginTop: '30px', paddingTop: '5px', paddingRight: '5px', fontSize: '35px' }} />
                  <Input
                    className='input'
                    type="password"
                    placeholder="Contraseña"
                    onChange={e => setUse_password(e.target.value)}
                    required
                    invalid={use_password.length < 8}
                  />
                  {use_password.length < 8 && (
                    <FormFeedback invalid>
                      Su contraseña debe contener mínimo 8 caracteres
                    </FormFeedback>
                  )}
                </InputGroup>
              </div>
              <div className='row col-12'>
                <div className='d-flex align-items-center col-12'>
                  <InputGroup>
                    <FaLock style={{ marginTop: '30px', paddingRight: '5px', fontSize: '35px' }} />
                    <Input
                      className='input'
                      type="password"
                      placeholder="Confirma tu contraseña"
                      onChange={e => setUse_confirm(e.target.value)}
                      required
                      invalid={use_confirm !== use_password}
                    />
                    {use_confirm !== use_password && (
                      <FormFeedback invalid>
                        Las claves deben ser iguales
                      </FormFeedback>
                    )}
                  </InputGroup>
                </div>
              </div>
            </div>

            <div className="checkboxes">
              <Input
                type="checkbox"
                className="form-check-input"
                id="termsCheckbox"
                checked={termsCheckbox}
                onChange={(e) => setTermsCheckbox(e.target.checked)}
              />
              <Label for="terms" check>
                Acepto las{" "}
                <a href="/Privacy">
                  Politicas de privacidad
                </a>
              </Label>
            </div>


            <div className="checkboxes">
              <Input
                type="checkbox"
                className="form-check-input"
                id="termsCheckbox"
                checked={termsCheckbox}
                onChange={(e) => setTermsCheckbox(e.target.checked)}
              />
              <Label for="terms" check>
                Acepto los{" "}
                <a href="/TermsAndConditions">
                  términos y condiciones
                </a>
              </Label>
            </div>

            {/* Agrega el spinner */}
            <Button
              type='submit'
              disabled={
                use_name === '' ||
                use_lastName === '' ||
                use_email === '' ||
                use_phone === '' || // Asegúrate de que el teléfono no esté vacío
                use_password === '' ||
                use_password.length < 8 ||
                use_confirm !== use_password ||
                !termsCheckbox
              }
            >
              {loading ? (
                <Spinner size="sm" color="light" /> // Muestra el spinner si loading es true
              ) : (
                "Registrar"
              )}
            </Button>
            <Link to='/Login'>
              <Button type='button' color='secondary'>Volver</Button>
            </Link>
          </form>

          <div>
          </div>
        </div>
        <ToastContainer />
      </div>
  );
}

export { Register };
