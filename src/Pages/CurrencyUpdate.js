import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Button,
  Input,
  InputGroup,
  Row,
  Col,
  FormGroup,
  Label,
  Card,
  CardBody,
  CardSubtitle,
  Alert,
} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useDataContext } from '../Context/dataContext';
import { NavBarAdm } from '../Components/NavBarAdm';
import { NotFound404 } from './NotFound404';
import Spain from '../Assets/Images/spain.png';
import Uk from '../Assets/Images/uk.png';
import Delivery from '../Assets/Images/image.png';
import Usa from '../Assets/Images/usa.png';
import Venezuela from '../Assets/Images/venezuela.png';
import { Spinner } from '../Components/Spinner';

function CurrencyUpdate() {
  const { accessAdminToken, url } = useDataContext();
  const [admin, setAdmin] = useState([]);
  const [currencyPrice, setCurrencyPrice] = useState([]);
  const [porcentPrice, setPorcentPrice] = useState([]);
  const [porcent, setPorcent] = useState([]);
  // Agrega esta línea al principio de tu componente CurrencyUpdate
  const [porcentId, setPorcentId] = useState(null);

  const [formDataPorcent, setFormDataPorcent] = useState({
    por_porcentGbp: '',
    por_porcentEur: '',
    por_porcentUsd: '',
    por_deliveryPrice: ''
  });
  const [formData, setFormData] = useState({
    cur_EurToBs: '',
    cur_EurToUsd: '',
    cur_GbpToBs: '',
    cur_GbpToUsd: '',
    cur_UsdToBs: '',
  });
  const [location, setLocation] = useState('Obligatorio'); // Estado inicial
  const [additionalInfo, setAdditionalInfo] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Tasa de cambios'); // Pestaña por defecto

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/CurrencyPrice`, {
        headers: {
          Authorization: `Bearer ${accessAdminToken.access_token}`
        }
      });
      setCurrencyPrice(response.data);
      // Set default values from the database
      setFormData(response.data[0]);
    } catch (error) {
      console.log(error);
    }
  }, [accessAdminToken, setFormData, url]);

  const fetchDataPorcents = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/PorcentPrice/`, {
        headers: {
          Authorization: `Bearer ${accessAdminToken.access_token}`
        }
      });
      setPorcentPrice(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [accessAdminToken, setPorcentPrice, url]);

  const fetchDataAdmin = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Auth/findByTokenAdmin/${accessAdminToken.access_token}`, {
        headers: {
          Authorization: `Bearer ${accessAdminToken.access_token}`,
        },
      });
      setAdmin(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [setAdmin, accessAdminToken,url]);

  useEffect(() => {
    fetchData();
    fetchDataAdmin();
    fetchDataPorcents();
    setTimeout(() => {
      setIsLoading(false);
    }, 900);
  }, [fetchDataAdmin, fetchData, fetchDataPorcents]);

  const handleEdit = async (event) => {
    event.preventDefault();

    try {
      await axios.put(`${url}/CurrencyPrice/1`, formData, {
        headers: {
          Authorization: `Bearer ${accessAdminToken.access_token}`
        }
      });

      fetchData();
      toast.success('¡Datos cambiados con éxito!', {
        position: 'bottom-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleFetchingPorcent = async (id) => {
    try {
      if (id) {
        setPorcentId(id);

        const response = await axios.get(`${url}/PorcentPrice/${id}`, {
          headers: {
            Authorization: `Bearer ${accessAdminToken.access_token}`
          }
        });
        setPorcent(response.data);

        setFormDataPorcent({
          por_porcentGbp: response.data.por_porcentGbp,
          por_porcentEur: response.data.por_porcentEur,
          por_porcentUsd: response.data.por_porcentUsd,
          por_deliveryPrice: response.data.por_deliveryPrice,
          por_status: response.data.por_status,
          por_comment: response.data.por_comment,
        });

        setLocation(response.data.por_status);
        setAdditionalInfo(response.data.por_comment);
      } else {
        setFormDataPorcent({
          por_porcentGbp: '',
          por_porcentEur: '',
          por_porcentUsd: '',
          por_deliveryPrice: '',
          por_status: '',
          por_comment: '',
        });

        setPorcent(null);

        setLocation('');
        setAdditionalInfo('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdatePorcentaje = async () => {
    try {
      const requestData = {
        por_porcentGbp: formDataPorcent.por_porcentGbp,
        por_porcentEur: formDataPorcent.por_porcentEur,
        por_porcentUsd: formDataPorcent.por_porcentUsd,
        por_deliveryPrice: formDataPorcent.por_deliveryPrice,
        por_status: location,
        por_comment: additionalInfo,
      };

      const id = porcentId;

      await axios.put(`${url}/PorcentPrice/${id}`, requestData, {
        headers: {
          Authorization: `Bearer ${accessAdminToken.access_token}`
        }
      });

      toast.success('¡Datos de porcentaje actualizados con éxito!', {
        position: 'bottom-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error('Error al actualizar los datos de porcentaje:', error);
    }
  };



  const handleInputChangePorcent = (e) => {
    setFormDataPorcent({
      ...formDataPorcent,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
    setAdditionalInfo('');
  };

  const handleAdditionalInfoChange = (e) => {
    setAdditionalInfo(e.target.value);
  };

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {admin.adm_role === 'A' ? (
            <div>
              <NavBarAdm />
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'Tasa de cambios' ? 'active' : ''}`}
                    onClick={() => toggleTab('Tasa de cambios')}
                  >
                    Tasa de cambios
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'Porcentaje de entrega en efectivo' ? 'active' : ''}`}
                    onClick={() => toggleTab('Porcentaje de entrega en efectivo')}
                  >
                    Porcentaje de entrega en efectivo
                  </button>
                </li>
              </ul>
              {activeTab === 'Tasa de cambios' && (
                <div className='currency'>
                  {currencyPrice.map(() => {
                    return (
                      <div className='currencyContainer'>
                        {/* Cambios */}
                        <div className='currency'>
                          {currencyPrice.map(() => {
                            return (
                              <div className="input-group-container">
                                <InputGroup className='Change-Input1'>
                                  <Button>
                                    <img src={Spain} width={45} alt='Spain' />
                                  </Button>
                                  <Input
                                    name="cur_EurToBs"
                                    value={formData.cur_EurToBs}
                                    className='centered-input'
                                    onChange={handleInputChange}
                                  />
                                  <Button >
                                    Bs <img src={Venezuela} alt='Venezuela' width={45} />
                                  </Button>
                                </InputGroup>



                                <InputGroup className='Change-Input1'>
                                  <Button>
                                    <img src={Uk} width={45} alt='Spain' />
                                  </Button>
                                  <Input
                                    name="cur_GbpToBs"
                                    value={formData.cur_GbpToBs}
                                    className='centered-input'
                                    onChange={handleInputChange}
                                  />
                                  <Button >
                                    Bs <img src={Venezuela} alt='Venezuela' width={45} />
                                  </Button>
                                </InputGroup>

                                <InputGroup className='Change-Input1'>
                                  <Button>
                                    <img src={Usa} width={45} alt='Spain' />
                                  </Button>
                                  <Input
                                    name="cur_UsdToBs"
                                    value={formData.cur_UsdToBs}
                                    className='centered-input'
                                    onChange={handleInputChange}
                                  />
                                  <Button >
                                    Bs <img src={Venezuela} alt='Venezuela' width={45} />
                                  </Button>
                                </InputGroup>

                                <InputGroup className='Change-Input1'>
                                  <Button>
                                    <img src={Uk} width={45} alt='Spain' />
                                  </Button>
                                  <Input
                                    name="cur_GbpToUsd"
                                    value={formData.cur_GbpToUsd}
                                    className='centered-input'
                                    onChange={handleInputChange}
                                  />
                                  <Button >
                                    Usd <img src={Usa} alt='Venezuela' width={45} />
                                  </Button>
                                </InputGroup>

                                <InputGroup className='Change-Input1'>
                                  <Button>
                                    <img src={Spain} width={45} alt='Spain' />
                                  </Button>
                                  <Input
                                    name="cur_EurToUsd"
                                    value={formData.cur_EurToUsd}
                                    className='centered-input'
                                    onChange={handleInputChange}
                                  />
                                  <Button >
                                    Usd <img src={Usa} alt='USA' width={45} />
                                  </Button>
                                </InputGroup>
                              </div>
                            )
                          })}
                          <Button clasName='update-button' style={{ width: '200px', height: '200px', margin: 'auto' }} color='success' onClick={handleEdit}>
                            Actualizar
                          </Button>
                          <ToastContainer />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              {activeTab === 'Porcentaje de entrega en efectivo' && (
                <div className=''>
                  <div className='currency'>
                    <Input
                      type="select"
                      name="porcentPrice"
                      id="porcentPrice"
                      onChange={(e) => handleFetchingPorcent(e.target.value)}
                    >
                      <option value="">Selecciona una opción</option>
                      {porcentPrice.map((por) => (
                        <option key={por.por_id} value={por.por_id}>
                          {por.por_stateLocation}
                        </option>
                      ))}
                    </Input>
                    <div className="input-group-container">
                      {porcent ? (
                        <Row>
                          <Col>
                            <FormGroup>
                              <Label for="euroInput">Euros</Label>
                              <InputGroup>
                                <Button>
                                  <img src={Spain} width={45} alt='Spain' />
                                </Button>
                                <Input
                                  type="text"
                                  name="por_porcentEur"
                                  id="euroInput"
                                  value={formDataPorcent.por_porcentEur}
                                  placeholder='Euros'
                                  onChange={handleInputChangePorcent}
                                  className='centered-input'
                                />
                              </InputGroup>
                            </FormGroup>
                          </Col>
                          <Col>
                            <FormGroup>
                              <Label for="dollarInput">Dólares</Label>
                              <InputGroup>
                                <Button>
                                  <img src={Usa} width={45} alt='USA' />
                                </Button>
                                <Input
                                  type="text"
                                  name="por_porcentUsd"
                                  id="dollarInput"
                                  value={formDataPorcent.por_porcentUsd}
                                  placeholder="Dólares"
                                  onChange={handleInputChangePorcent}
                                  className='centered-input'
                                />
                              </InputGroup>
                            </FormGroup>
                          </Col>
                          <Col>
                            <FormGroup>
                              <Label for="poundInput">Libras</Label>
                              <InputGroup>
                                <Button>
                                  <img src={Uk} width={45} alt='UK' />
                                </Button>
                                <Input
                                  type="text"
                                  name="por_porcentGbp"
                                  id="poundInput"
                                  value={formDataPorcent.por_porcentGbp}
                                  placeholder="Libras"
                                  onChange={handleInputChangePorcent}
                                  className='centered-input'
                                />
                              </InputGroup>
                            </FormGroup>
                          </Col>
                          <Col>
                            <FormGroup>
                              <Label for="deliveryPrice">Delivery</Label>
                              <InputGroup>
                                <Button>
                                  <img src={Delivery} width={45} alt='Delivery' />
                                </Button>
                                <Input
                                  type="text"
                                  name="por_deliveryPrice"
                                  id="deliveryPriceInput"
                                  value={formDataPorcent.por_deliveryPrice}
                                  placeholder="delivery"
                                  className='centered-input'
                                  onChange={handleInputChangePorcent}
                                />
                              </InputGroup>
                            </FormGroup>
                          </Col>
                        </Row>
                      ) : null}
                      <Row>
                        {/* <Col> */}
                        <FormGroup>
                          <div className="centered-content">
                            <Card>
                              <CardBody>
                                <h5>Delivery</h5>
                                <Button
                                  color="primary"
                                  onClick={() => handleLocationChange('Obligatorio')}
                                  className={location === 'Obligatorio' ? 'active' : ''}
                                >
                                  Obligatorio
                                </Button>{' '}
                                <Button
                                  color="primary"
                                  onClick={() => handleLocationChange('No obligatorio')}
                                  className={location === 'No obligatorio' ? 'active' : ''}
                                >
                                  No obligatorio
                                </Button>{' '}
                                <Button
                                  color="primary"
                                  onClick={() => handleLocationChange('Oficina')}
                                  className={location === 'Oficina' ? 'active' : ''}
                                >
                                  Oficina
                                </Button>
                                <Button
                                  color="danger"
                                  onClick={() => handleLocationChange('Desactivado')}
                                  className={location === 'Desactivado' ? 'active' : ''}
                                >
                                  Desactivado
                                </Button>
                                {location === 'Oficina' || location === 'No obligatorio' ? (
                                  <div>
                                    <h6>Información Adicional</h6>
                                    <textarea
                                      value={additionalInfo}
                                      onChange={handleAdditionalInfoChange}
                                      placeholder="Ingrese información adicional aquí..."
                                      className="form-control"
                                    />
                                  </div>
                                ) : null}
                                <CardSubtitle className="text-center">
                                  {location === 'Obligatorio' ? (
                                    <Alert color="success">Obligatorio</Alert>
                                  ) : location === 'No obligatorio' ? (
                                    <Alert color="warning">No obligatorio</Alert>
                                  ) : location === 'Oficina' ? (
                                    <Alert color="info">Oficina</Alert>
                                  ) : (
                                    <Alert color="danger">Desactivado</Alert>
                                  )}
                                </CardSubtitle>

                              </CardBody>
                            </Card>

                            <Button
                              color="success"
                              onClick={handleUpdatePorcentaje}
                            >
                              Actualizar Porcentaje
                            </Button>

                          </div>

                        </FormGroup>
                        {/* </Col> */}
                      </Row>
                    </div>
                  </div>

                </div>

              )}
              <ToastContainer />
            </div>
          ) : (
            <NotFound404 />
          )}
        </>
      )
      }
    </div >
  );
}

export { CurrencyUpdate };
