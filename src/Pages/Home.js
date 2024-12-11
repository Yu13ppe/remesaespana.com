import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios';
import {
  InputGroup,
  Input,
  Button
} from 'reactstrap';
import Reasons01 from '../Assets/Images/Reasons-01.png';
import Image1 from '../Assets/Images/0.png';
import Image2 from '../Assets/Images/clock.png';
import Image3 from '../Assets/Images/bank.png';
import Image4 from '../Assets/Images/20.png';
import {
  FaRegClock,
  FaSlackHash,
  FaRegEnvelope,
  FaPhone,
  FaInstagram,
  FaWhatsapp
} from 'react-icons/fa';
import Spain from '../Assets/Images/spain.png'
import Uk from '../Assets/Images/uk.png'
import Venezuela from '../Assets/Images/venezuela.png'
import Oval from '../Assets/Images/Oval.png'
import EEUU from '../Assets/Images/usa.png';
import { useDataContext } from '../Context/dataContext';
import { NavBar } from '../Components/NavBar';
import { Footer } from '../Components/Footer';
import { Link } from 'react-router-dom'
import { Spinner } from '../Components/Spinner'; // Ajusta la ruta de importación según tu estructura de archivos
import { CookiesC } from '../Components/CookiesC';
import { Contact } from '../Components/Contact';

function Home() {
  const [currencyImage, setCurrencyImage] = useState(Spain);
  const { currencyPrice, setCurrencyPrice, url } = useDataContext();

  const handleCurrencyChange = () => {
    if (currencyImage === Spain) {
      setCurrencyImage(EEUU);
    } else if (currencyImage === EEUU) {
      setCurrencyImage(Uk);
    } else {
      setCurrencyImage(Spain);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/currencyPrice`);
      setCurrencyPrice(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [setCurrencyPrice, url]); // Agregar setCurrencyPrice como dependencia

  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchData();
    setTimeout(() => {
      setIsLoading(false);
    }, 1300); // Simula que la carga demora 2 segundos
  }, [fetchData]); // Agregar fetchData como dependencia




  return (

    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <NavBar />
          <CookiesC />
          <Contact />

          <div className='Segmento-1'>
            <img className='Oval' alt='Oval' src={Oval} />
            <div className='text'>
              <h1>Envía remesas a</h1>
              <div className='bgVzla'>
              </div>
              <h2>Venezuela</h2>
              <p>Líder en envíos de divisas en Europa a  <br /> Venezuela y E.E.U.U</p>
            </div>
            <div>
              <InputGroup className='Change-Input'>
                <Button onClick={handleCurrencyChange}>
                  {currencyImage === Spain ?
                    <span><img src={Spain} alt='Spain' width={45} /> €</span> : null}
                  {currencyImage === Uk ?
                    <span><img src={Uk} alt='Uk' width={45} /> £</span> : null}
                  {currencyImage === EEUU ?
                    <span><img src={EEUU} alt='EEUU' width={45} /> $</span> : null}
                </Button>
                {currencyImage === Spain ?
                  <Input disabled className='centered-input' placeholder={'  1     =     ' + (currencyPrice.map(coin => coin.cur_EurToBs))} />
                  : null
                }
                {currencyImage === Uk ?
                  <Input disabled placeholder={'  1     =     ' + (currencyPrice.map(coin => coin.cur_GbpToBs))} />
                  : null
                }
                {currencyImage === EEUU ?
                  <Input disabled placeholder={'  1     =     ' + (currencyPrice.map(coin => coin.cur_UsdToBs))} />
                  : null
                }
                <Button>
                  Bs <img src={Venezuela} alt='Venezuela' width={45} />
                </Button>
              </InputGroup>

              <Link to='/Login'>
                <Button className='letsGo'>
                  ¡HAZLO YA!
                </Button>
              </Link>
            </div>
          </div>

          <div className='Segmento-2'>
            <div className="container_all" id="container__all">
              <div className="body__page">

                <div className="container__card">

                  <div className="card c3">
                    <div className="icon">
                      <img src={Image1} alt='Image1' />
                    </div>
                    <div className="info__description">
                      <p>Sin Comisiones.</p>
                      <p>Nuestros cambios son totalmente libre de comisiones.</p>
                      <Link to="/Login">  <input type="button" value="Cambia ya!" /> </Link>
                    </div>
                  </div>

                  <div className="card c3">
                    <div className="icon">
                      <img src={Image2} alt='Image2' />
                    </div>
                    <div className="info__description">
                      <p>Recibe tu Remesa en Pocos Minutos.</p>
                      <p>Tus remesas llegan a tu cuenta en un promedio de 10 minutos</p>
                      <Link to="/Login">  <input type="button" value="Cambia ya!" /></Link> </div>
                  </div>

                  <div className="card c3">
                    <div className="icon">
                      <img src={Image3} alt='Image3' />
                    </div>
                    <div className="info__description">
                      <p>
                        Disponemos de Todos los Bancos de Venezuela, Como BBVA,
                        Banesco, Banco nacional de crédito, Mercantil, PagoMovil
                        entre muchos otros
                      </p>
                      <Link to="/Login">  <input type="button" value="Cambia ya!" /></Link>
                    </div>
                  </div>

                  <div className="card c3">
                    <div className="icon">
                      <img src={Image4} alt='Image4' />
                    </div>
                    <div className="info__description">
                      <p>
                        RemesaEspana te ofrece cambios de hasta un minimo de 20 euros,
                        ¿Que esperas para cambiar con nosotros?.
                      </p>
                      <Link to="/Login">  <input type="button" value="Cambia ya!" /> </Link>                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="Segmento-3">
            <div className="card1">
              <div className="content">
                <div className="title">
                  <h3>PASOS PARA EMPEZAR</h3>
                </div>
                <div className="text">
                  <li>Regístrate en nuestra web y llena todos los campos.</li>
                  <li>Revisa tu correo electrónico, de esta manera te enviamos las notificaciones de tus cambios</li>
                  <li>Toma una foto legible de tu identificación.</li>
                  <li>Sube tu identificación a la web.</li>
                  <li>¡Espera tu validación y empieza a cambiar!</li>
                </div>
                <br></br>
                <div className="btn-container">
                  <Link to='/Login'>
                    <Button>Empieza ya</Button>
                  </Link>
                </div>
              </div>
              <div className="img-card"></div>
            </div>

            {/* <div className="Segmento-3-Content">
                <div className="Texto-Izquierdo">
                    <h2>Pasos para empezar:</h2>
                    <ol>
                        <li>Regístrate en nuestra web y llena todos los campos.</li>
                        <li>Revisa tu correo electrónico y verifica el código de validación que te enviamos.</li>
                        <li>Toma una foto legible de tu identificación.</li>
                        <li>Sube tu identificación a la web.</li>
                        <li>¡Espera tu validación y empieza a cambiar!</li>
                    </ol>
                </div>
            </div> */}
            {/* <div className="Imagen-Derecho">
                <img src={Segmento3} alt="Imagen de ejemplo" />
            </div> */}
          </div>

          <div className='Segmento-4'>
            <section id="hero" className="d-flex align-items-center">
              <div className="container position-relative" data-aos="fade-up" data-aos-delay="500">
                <h1>COMO PODEMOS AYUDARTE</h1>
                <h2>Ofrecemos el mejor servicio al mejor precio</h2>
                <p>
                  Sabemos lo mucho que trabajas, así que te
                  facilitamos el envío de dinero a familiares y amigos.
                  Haremos que tu dinero llegue de manera cómoda,
                  rápida y segura, con las mejores tasas de cambio,
                  para que el dinero que tanto te cuesta ganar llegue
                  más lejos.
                  <br />
                  <br />
                  Remesa Espana lleva más de 4 años ofreciendo
                  servicios de envío de dinero desde cualquier parte
                  de la Unión Europea, Reino Unido y E.E.U.U a
                  Venezuela con la mayor seguridad y rápidez que
                  merecen nuestros clientes.
                  <br />
                  <br />
                  Contamos con un equipo de atención personalizada
                  para aclarar dudas y soluciones en pocos minutos,
                  por eso mas de 1.000 de nuestros clientes nos
                  recomiendan y somos su empresa de envio más
                  confiable.
                </p>
                <Link to='/Login' className="btn-get-started scrollto">Empieza Con Nosotros</Link>
              </div>
            </section>
          </div>

          <div className="Segmento-5">
            <img src={Reasons01} alt="Imagen de razones" />
          </div>

          <div id='about' className='Segmento-6'>

            <section id='hero2'>
              <div id="contact" className="contact">
                <div className="container">

                  <div className="section-title">
                    <p style={{
                      color: '#002a3a',
                      fontSize: '2.8em',
                    }}>
                      Si tienes alguna duda o sugerencia, no dudes en contactarnos.</p>
                  </div>

                  <div className="row mt-2">

                    <div className="col-md-12 d-flex align-items-stretch">
                      <div className="info-box">
                        <div className="icon">
                          <FaRegClock style={{ fontSize: '30px' }} />
                        </div>
                        <div className="info">
                          <h3>Horario</h3>
                          <p>Lunes a Sabado desde las 12:00-22:00 Hora española</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-12 d-flex align-items-stretch">
                      <div className="info-box">
                        <div className='icon'>
                          <FaSlackHash style={{ fontSize: '30px' }} />
                        </div>
                        <div className='info'>
                          <h3>Redes sociales</h3>
                          <p>
                            <a href='https://www.instagram.com/remesaespana/' className="instagram">
                              <FaInstagram style={{ fontSize: '25px', marginTop: '.2em' }} />
                            </a>
                            <a href='https://wa.me/+34722850962' className="Whatsapp">
                              <FaWhatsapp style={{ fontSize: '25px', marginTop: '.2em' }} />
                            </a>
                            <a href="mailto:info@remesaespana.com" className="Email" target="_blank" rel="noopener noreferrer">
                              <FaRegEnvelope style={{ fontSize: '25px', marginTop: '.2em' }} />
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-12 d-flex align-items-stretch">
                      <div className="info-box">
                        <div className='icon'>
                          <FaRegEnvelope style={{ fontSize: '30px' }} />
                        </div>
                        <div className='info'>
                          <h3>Correo electrónico</h3>
                          <p>info@remesaespana.com</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 d-flex align-items-stretch">
                      <div className="info-box">
                        <div className='icon'>
                          <FaPhone style={{ fontSize: '30px' }} />
                        </div>
                        <div className='info'>
                          <h3>Número teléfonico</h3>
                          <p>+34 722 850962</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <form className="php-email-form mt-4" name="contact-jp" method="POST" data-netlify="true">
                <div className="row">
                  <div className="col-md-6 form-group">
                    <Input type="text" name="name" className="form-control" id="name" placeholder="Your Name" required />
                  </div>
                  <div className="col-md-6 form-group mt-3 mt-md-0">
                    <Input type="email" className="form-control" name="email" id="email" placeholder="Your Email" required />
                  </div>
                </div>
                <div className="form-group mt-3">
                  <Input type="text" className="form-control" name="subject" id="subject" placeholder="Subject" required />
                </div>
                <div className="form-group mt-3">
                  <textarea className="form-control" name="message" rows="5" placeholder="Message" required></textarea>
                </div>
                <div className="my-3">
                  <div className="loading">Loading</div>
                  <div className="error-message"></div>
                  <div className="sent-message">Your message has been sent. Thank you!</div>
                </div>
                <div className="text-center"><button type="submit" value="send" name="send">Send Message</button></div>
              </form> */}
                </div>
              </div>
            </section>
          </div>
          <Footer />
        </>
      )}
    </div>
  )
}

export { Home }