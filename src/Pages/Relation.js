import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { NavBarAdm } from '../Components/NavBarAdm';
import { useDataContext } from '../Context/dataContext';
import { NotFound404 } from './NotFound404';
import { toast, ToastContainer } from 'react-toastify';
import { Table, Input, Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert } from 'reactstrap';
import { Spinner } from '../Components/Spinner';

function Relation() {
  const { accessAdminToken, url } = useDataContext();
  const [admin, setAdmin] = useState([]);
  const [banksEUR, setBanksEUR] = useState([]);
  const [banksGBP, setBanksGBP] = useState([]);
  const [banksUSD, setBanksUSD] = useState([]);
  const [banksBS, setBanksBS] = useState([]);
  const [movs, setMovs] = useState([]);
  const [modalOpenUsers, setModalOpenUsers] = useState(false);
  const [usersWithPositiveBalance, setUsersWithPositiveBalance] = useState([]);
  const [totalPositiveBalance, setTotalPositiveBalance] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [usdData, setUsdData] = useState([]);
  const [gbpData, setGbpData] = useState([]);
  const [eurData, setEurData] = useState([]);
  const [bsData, setBsData] = useState([]);
  const [efectivoData, setEfectivoData] = useState([]);


  const [totalsByCurrency, setTotalsByCurrency] = useState({
    USD: 0,
    GBP: 0,
    EUR: 0,
    BS: 0,
  });

  // Función para calcular los totales por moneda
  const calculateTotalsByCurrency = useCallback(() => {
    const newTotalsByCurrency = {
      USD: 0,
      GBP: 0,
      EUR: 0,
      BS: 0,
      // USDE: 0,
    };

    movs
      .filter((mov) => mov.mov_status === 'V') // Filtrar por movimientos con estado "V"
      .forEach((mov) => {
        const currency = mov.mov_currency;
        const amount = parseFloat(mov.mov_amount);

        // Verificar si la moneda es válida antes de sumar
        if (newTotalsByCurrency.hasOwnProperty(currency)) {
          newTotalsByCurrency[currency] += amount;
        }
      });

    // Actualizar el estado con los nuevos totales por moneda
    setTotalsByCurrency(newTotalsByCurrency);
  }, [movs, setTotalsByCurrency]);

  const calculateTotalEfectivoAmount = () => {
    const currentDate = new Date().toISOString().slice(0, 10); // Obtiene la fecha actual en formato yyyy-mm-dd
    const totalEfectivoAmount = efectivoData
      .filter((mov) => mov.mov_date.slice(0, 10) === currentDate) // Filtra los registros del día del sistema
      .reduce((total, mov) => total + parseFloat(mov.mov_amount), 0); // Suma los mov_amount
    return totalEfectivoAmount;
  };




  const fetchEfectivoData = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Movements/`, {
        headers: {
          Authorization: `Bearer ${accessAdminToken.access_token}`,
        },
      });

      // Obtiene la fecha actual en formato yyyy-mm-dd
      const currentDate = new Date().toISOString().slice(0, 10);

      // Filtra los movimientos cuya fecha sea igual a la fecha actual
      const efectivoMovimientos = response.data.filter((mov) => {
        return mov.mov_typeOutflow === "Efectivo" && mov.mov_date.slice(0, 10) === currentDate;
      });

      setEfectivoData(efectivoMovimientos);
    } catch (error) {
      console.error(error);
    }
  }, [url, accessAdminToken]);


  // Llamar a la función de cálculo de totales por moneda cuando cambie la lista de movimientos
  useEffect(() => {
    calculateTotalsByCurrency();
  }, [calculateTotalsByCurrency, movs, totalsByCurrency]);
  const [selectedTab, setSelectedTab] = useState('USD'); // Valor predeterminado es Dólares
  const calculateUsersWithPositiveBalance = () => {
    const usersWithPositiveBalance = users.filter((user) => {
      const totalUsd = user.use_amountUsd;
      const totalEur = user.use_amountEur;
      const totalGbp = user.use_amountGbp;
      return totalUsd > 0 || totalEur > 0 || totalGbp > 0;
    });

    const totalPositiveBalance = {
      USD: usersWithPositiveBalance.reduce(
        (total, user) => total + user.use_amountUsd,
        0
      ),
      EUR: usersWithPositiveBalance.reduce(
        (total, user) => total + user.use_amountEur,
        0
      ),
      GBP: usersWithPositiveBalance.reduce(
        (total, user) => total + user.use_amountGbp,
        0
      ),
    };

    setUsersWithPositiveBalance(usersWithPositiveBalance);
    setTotalPositiveBalance(totalPositiveBalance);
  };

  const [users, setUsers] = useState([]);

  const fetchDataUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/users`, {
        headers: {
          Authorization: `Bearer ${accessAdminToken.access_token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [accessAdminToken, setUsers, url]);



  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [operationType, setOperationType] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');
  const [amount, setAmount] = useState(0);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 900);
  }, []);

  const handleSubmit = async event => {
    event.preventDefault();
    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(selectedDate);

    if (!isValidDate) {
      // Mostrar un mensaje de error si la fecha no tiene el formato correcto
      alert('Por favor, ingresa la fecha en el formato "aaaa-mm-dd".');
      return;
    }

    if (operationType === 'Ingreso') {
      const formData = new FormData();
      formData.append('bal_currency', selectedCurrency);
      formData.append('bal_amount', amount);
      formData.append('bal_type', 'Deposito');
      formData.append('bal_comment', 'Ingreso de Administración');
      formData.append('bal_accEurId', (selectedCurrency === 'EUR' ? parseInt(selectedBank) : 0));
      formData.append('bal_accUsdId', (selectedCurrency === 'USD' ? parseInt(selectedBank) : 0));
      formData.append('bal_accGbpId', (selectedCurrency === 'GBP' ? parseInt(selectedBank) : 0));
      formData.append('bal_accBsId', (selectedCurrency === 'BS' ? parseInt(selectedBank) : 0));
      formData.append('bal_date', selectedDate);

      try {
        await axios.post(
          `${url}/BalanceAcc/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessAdminToken.access_token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (selectedCurrency === 'EUR') {
          await axios.post(
            `${url}/TotalRegister/create`,
            {
              tor_accEurId: parseInt(selectedBank),
              tor_date: (selectedDate),
            },
            {
              headers: {
                Authorization: `Bearer ${accessAdminToken.access_token}`,
                'Content-Type': 'application/json',
              },
            });
        }
        if (selectedCurrency === 'USD') {
          await axios.post(
            `${url}/TotalRegister/create`,
            {
              tor_accUsdsId: parseInt(selectedBank),
              tor_date: (selectedDate),
            },
            {
              headers: {
                Authorization: `Bearer ${accessAdminToken.access_token}`,
                'Content-Type': 'application/json',
              },
            });
        }
        if (selectedCurrency === 'GBP') {
          await axios.post(
            `${url}/TotalRegister/create`,
            {
              tor_accGbpId: parseInt(selectedBank),
              tor_date: (selectedDate),
            },
            {
              headers: {
                Authorization: `Bearer ${accessAdminToken.access_token}`,
                'Content-Type': 'application/json',
              },
            });
        }
        if (selectedCurrency === 'BS') {
          await axios.post(
            `${url}/TotalRegister/create`,
            {
              tor_accBsId: parseInt(selectedBank),
              tor_date: (selectedDate),
            },
            {
              headers: {
                Authorization: `Bearer ${accessAdminToken.access_token}`,
                'Content-Type': 'application/json',
              },
            });
        }

        toggleModal();
        toast.success('Cambio realizado con éxito!', {
          position: 'bottom-right',
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        console.log('Request sent successfully');
      } catch (error) {
        console.error('Error:', error);
      }
    }

    if (operationType === 'Egreso') {
      const formData = new FormData();
      formData.append('bal_currency', selectedCurrency);
      formData.append('bal_amount', amount);
      formData.append('bal_type', 'Retiro');
      formData.append('bal_comment', 'Retiro de Administración');
      formData.append('bal_accEurId', (selectedCurrency === 'EUR' ? parseInt(selectedBank) : 0));
      formData.append('bal_accUsdId', (selectedCurrency === 'USD' ? parseInt(selectedBank) : 0));
      formData.append('bal_accGbpId', (selectedCurrency === 'GBP' ? parseInt(selectedBank) : 0));
      formData.append('bal_accBsId', (selectedCurrency === 'BS' ? parseInt(selectedBank) : 0));
      formData.append('bal_date', selectedDate);

      try {
        await axios.post(
          `${url}/BalanceAcc/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessAdminToken.access_token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (selectedCurrency === 'EUR') {
          await axios.post(
            `${url}/TotalRegister/create`,
            {
              tor_accEurId: parseInt(selectedBank),
              tor_date: (selectedDate),
            },
            {
              headers: {
                Authorization: `Bearer ${accessAdminToken.access_token}`,
                'Content-Type': 'application/json',
              },
            });
        }
        if (selectedCurrency === 'USD') {
          await axios.post(
            `${url}/TotalRegister/create`,
            {
              tor_accUsdsId: parseInt(selectedBank),
              tor_date: (selectedDate),
            },
            {
              headers: {
                Authorization: `Bearer ${accessAdminToken.access_token}`,
                'Content-Type': 'application/json',
              },
            });
        }
        if (selectedCurrency === 'GBP') {
          await axios.post(
            `${url}/TotalRegister/create`,
            {
              tor_accGbpId: parseInt(selectedBank),
              tor_date: (selectedDate),
            },
            {
              headers: {
                Authorization: `Bearer ${accessAdminToken.access_token}`,
                'Content-Type': 'application/json',
              },
            });
        }
        if (selectedCurrency === 'BS') {
          await axios.post(
            `${url}/TotalRegister/create`,
            {
              tor_accBsId: parseInt(selectedBank),
              tor_date: (selectedDate),
            },
            {
              headers: {
                Authorization: `Bearer ${accessAdminToken.access_token}`,
                'Content-Type': 'application/json',
              },
            });
        }

        toggleModal();
        toast.success('Cambio realizado con éxito!', {
          position: 'bottom-right',
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        console.log('Request sent successfully');
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };








  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };



  const fetchDataMovs = useCallback(async () => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    try {
      const response = await axios.get(`${url}/Movements/date/${formattedDate}`, {
        headers: {
          Authorization: `Bearer ${accessAdminToken.access_token}`,
        },
      });
      setMovs(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [accessAdminToken, setMovs, url]);

  const fetchDataAdmin = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Auth/findByTokenAdmin/${accessAdminToken.access_token}`, {
        headers: {
          Authorization: `Bearer ${accessAdminToken.access_token}`,
        },
      });
      setAdmin(response.data);
    } catch (error) {
    }
  }, [accessAdminToken, setAdmin, url]);

  const fetchDataEUR = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Acceur`, {
        headers: {
          Authorization: `Bearer ${accessAdminToken.access_token}`,
        },
      });
      setBanksEUR(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [accessAdminToken, setBanksEUR, url]);

  const fetchDataGBP = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Accgbp`, {
        headers: {
          Authorization: `Bearer ${accessAdminToken.access_token}`,
        },
      });
      setBanksGBP(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [accessAdminToken, setBanksGBP, url]);

  const fetchDataUSD = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Accusd`, {
        headers: {
          Authorization: `Bearer ${accessAdminToken.access_token}`,
        },
      });
      setBanksUSD(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [accessAdminToken, setBanksUSD, url]);

  const fetchDataBS = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Accbs`, {
        headers: {
          Authorization: `Bearer ${accessAdminToken.access_token}`,
        },
      });
      setBanksBS(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [accessAdminToken, setBanksBS, url]);


  useEffect(() => {
    fetchDataAdmin();
    fetchDataEUR();
    fetchDataGBP();
    fetchDataUSD();
    fetchDataBS();
    fetchDataMovs();
    fetchDataUsers();
    fetchEfectivoData();
  }, [fetchDataAdmin, fetchDataMovs, fetchDataEUR, fetchDataGBP, fetchDataUSD, fetchDataBS, fetchDataUsers, fetchEfectivoData]);



  useEffect(() => {


    const categorizeDataByCurrency = () => {
      const usd = [];
      const gbp = [];
      const eur = [];
      const bs = [];

      movs.filter((mov) => mov.mov_status === 'V').forEach((mov) => {
        switch (mov.mov_currency) {
          case 'USD':
            usd.push(mov);
            break;
          case 'GBP':
            gbp.push(mov);
            break;
          case 'EUR':
            eur.push(mov);
            break;
          case 'BS':
            bs.push(mov);
            break;
          default:
            break;
        }
      });

      setUsdData(usd);
      setGbpData(gbp);
      setEurData(eur);
      setBsData(bs);
    };

    categorizeDataByCurrency();
  }, [movs]);


  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {admin.adm_role === 'A' ? (
            <div>
              <NavBarAdm />
              <div className='userContent'>
                <h1 className='titleUser'>Relación</h1>
                <div className="container">
                  <div className='row m-5 col-12'>
                    <div className='d-flex align-items-center col-12'>
                      <Input
                        type="text"
                        className="form-control search-input"
                        defaultValue={searchQuery}
                        onChange={handleSearch}
                        placeholder="Buscar Relacion..."
                      />
                    </div>
                  </div>





                </div>

                <Modal
                  isOpen={modalOpenUsers}
                  size="lg"
                  centered
                  toggle={() => setModalOpenUsers(false)}
                >
                  <ModalHeader toggle={() => setModalOpenUsers(false)}>
                    Usuarios con Saldo Positivo
                  </ModalHeader>
                  <ModalBody>
                    <p>Total a Deber en USD: {totalPositiveBalance.USD}</p>
                    <p>Total a Deber en EUR: {totalPositiveBalance.EUR}</p>
                    <p>Total a Deber en GBP: {totalPositiveBalance.GBP}</p>
                    <Table>
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Saldo USD</th>
                          <th>Saldo EUR</th>
                          <th>Saldo GBP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersWithPositiveBalance.map((user) => (
                          <tr key={user.use_id}>
                            <td>
                              {user.use_name} {user.use_lastName}
                            </td>
                            <td>{user.use_amountUsd}</td>
                            <td>{user.use_amountEur}</td>
                            <td>{user.use_amountGbp}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </ModalBody>
                </Modal>

                <Button color="primary" onClick={toggleModal}>Agregar Ingreso/Egreso</Button>
                <Button
                  color="danger"
                  onClick={() => {
                    calculateUsersWithPositiveBalance();
                    setModalOpenUsers(true);
                  }}
                  style={{ marginLeft: '20px' }}

                >
                  Ver Usuarios con Saldo Positivo
                </Button>

                <div className="currency-tabs" style={{ marginTop: '15px' }}>
                  <Button
                    className={`currency-tab ${selectedTab === 'USD' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('USD')} color='warning' style={{ marginRight: '5px' }}
                  >
                    Dólares
                  </Button>
                  <Button
                    className={`currency-tab ${selectedTab === 'GBP' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('GBP')} color='warning' style={{ marginRight: '5px', marginLeft: '5px' }}
                  >
                    Libras
                  </Button>
                  <Button
                    className={`currency-tab ${selectedTab === 'EUR' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('EUR')} color='warning' style={{ marginRight: '5px', marginLeft: '5px' }}
                  >
                    Euros
                  </Button>
                  <Button
                    className={`currency-tab ${selectedTab === 'BS' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('BS')} color='warning' style={{ marginLeft: '5px' }}
                  >
                    Bolívares
                  </Button>
                  <Button
                    className={`currency-tab ${selectedTab === 'Efectivo' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('Efectivo')} color='warning' style={{ marginLeft: '5px' }}
                  >
                    Efectivo
                  </Button>
                </div>

                <Table responsive className='userTable'>
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Moneda</th>
                      <th>Monto</th>
                      <th>Fecha</th>
                      <th>Tipo</th>
                      <th>Banco</th>
                      <th>Detalles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTab === 'USD' && usdData.map((mov) => (
                      <tr key={mov.mov_id}>
                        <td>{mov.User.use_name} {mov.User.use_lastName}</td>
                        <td>{mov.mov_currency}</td>
                        <td>{mov.mov_amount}</td>
                        <td>{mov.mov_date}</td>
                        <td>{mov.mov_type}</td>
                        <td>{mov.mov_comment}</td>
                        <td>{mov.mov_typeOutflow ? mov.mov_typeOutflow : 'Depósito'}</td>
                      </tr>
                    ))}
                    {selectedTab === 'GBP' && gbpData.map((mov) => (
                      <tr key={mov.mov_id}>
                        <td>{mov.User.use_name} {mov.User.use_lastName}</td>
                        <td>{mov.mov_currency}</td>
                        <td>{mov.mov_amount}</td>
                        <td>{mov.mov_date}</td>
                        <td>{mov.mov_type}</td>
                        <td>{mov.mov_comment}</td>
                        <td>{mov.mov_typeOutflow ? mov.mov_typeOutflow : 'Depósito'}</td>
                      </tr>
                    ))}
                    {selectedTab === 'EUR' && eurData.map((mov) => (
                      <tr key={mov.mov_id}>
                        <td>{mov.User.use_name} {mov.User.use_lastName}</td>
                        <td>{mov.mov_currency}</td>
                        <td>{mov.mov_amount}</td>
                        <td>{mov.mov_date}</td>
                        <td>{mov.mov_type}</td>
                        <td>{mov.mov_comment}</td>
                        <td>
                          {/* Mostrar mov_phone y mov_code si existen, de lo contrario mostrar mov_typeOutflow */}
                          {mov.mov_phone && mov.mov_code ? (
                            <>
                              Teléfono: {mov.mov_phone} <br />
                              Código: {mov.mov_code}
                            </>
                          ) : (
                            mov.mov_typeOutflow
                          )}
                        </td>
                      </tr>
                    ))}

                    {selectedTab === 'BS' && bsData.map((mov) => (
                      <tr key={mov.mov_id}>
                        <td>{mov.User.use_name} {mov.User.use_lastName}</td>
                        <td>{mov.mov_currency}</td>
                        <td>{mov.mov_amount}</td>
                        <td>{mov.mov_date}</td>
                        <td>{mov.mov_type}</td>
                        <td>{mov.mov_comment}</td>

                        <td>{mov.mov_typeOutflow ? mov.mov_typeOutflow : 'Depósito'}</td>
                      </tr>
                    ))}
                    {selectedTab === 'Efectivo' && efectivoData.map((mov) => (
                      <tr key={mov.mov_id}>
                        <td>{mov.User.use_name} {mov.User.use_lastName}</td>
                        <td>{mov.mov_currency}</td>
                        <td>{mov.mov_amount}</td>
                        <td>{mov.mov_date}</td>
                        <td>{mov.mov_comment}</td>

                        <td>{mov.mov_typeOutflow}</td>
                      </tr>
                    ))}

                    <tr>
                      <td colSpan="2">Totales por Moneda:</td>
                      <td>USD {totalsByCurrency.USD}</td>
                      <td>GBP {totalsByCurrency.GBP}</td>
                      <td>EUR {totalsByCurrency.EUR}</td>
                      <td>BS {totalsByCurrency.BS}</td>
                      <td>Efectivo Total del Día: {calculateTotalEfectivoAmount()}</td>

                      <td></td>
                    </tr>
                  </tbody>
                </Table>

                <Modal isOpen={modalOpen} size='lg' centered toggle={toggleModal}>
                  <ModalHeader toggle={toggleModal}>Agregar Ingreso/Egreso</ModalHeader>
                  <ModalBody>
                    <form>
                      <div className="form-group">
                        <label htmlFor="operationType">Tipo de Operación:</label>
                        <select
                          id="operationType"
                          className="form-control"
                          value={operationType}
                          onChange={(e) => setOperationType(e.target.value)}>
                          <option value="">Seleccione una opción</option>
                          <option value="Ingreso">Ingreso</option>
                          <option value="Egreso">Egreso</option>
                        </select>
                      </div>
                      {operationType && (
                        <div className="form-group">
                          <label htmlFor="currency">Seleccionar Moneda:</label>
                          <select
                            id="currency"
                            className="form-control"
                            defaultValue={selectedCurrency}
                            onChange={(e) => setSelectedCurrency(e.target.value)}
                          >
                            <option value="">Seleccione una opción</option>
                            <option value="EUR">Euro</option>
                            <option value="GBP">Libra Esterlina</option>
                            <option value="USD">Dolar</option>
                            <option value="BS">Bolívares</option>
                          </select>
                        </div>
                      )}
                      {operationType && (
                        <div className="form-group" hidden={selectedCurrency === ''}>
                          <label htmlFor="bank">Seleccionar Banco:</label>
                          <select
                            id="bank"
                            className="form-control"
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                          >
                            <option value="">Selecciona una opción</option>
                            {selectedCurrency === 'EUR' ?
                              banksEUR.filter((bank) => bank.acceur_Bank !== 'Ghost').map((bank) => (
                                <option key={bank.acceur_id} value={bank.acceur_id}>
                                  {bank.acceur_Bank} ({bank.acceur_owner})
                                </option>)
                              ) : null
                            }
                            {selectedCurrency === 'GBP' ?
                              banksGBP.filter((bank) => bank.accgbp_Bank !== 'Ghost').map((bank) => (
                                <option key={bank.accgbp_id} value={bank.accgbp_id}>
                                  {bank.accgbp_Bank} ({bank.accgbp_owner})
                                </option>)
                              ) : null
                            }
                            {selectedCurrency === 'USD' ?
                              banksUSD.filter((bank) => bank.accusd_Bank !== 'Ghost').map((bank) => (
                                <option key={bank.accusd_id} value={bank.accusd_id}>
                                  {bank.accusd_Bank} ({bank.accusd_owner})
                                </option>)
                              ) : null
                            }
                            {selectedCurrency === 'BS' ?
                              banksBS.filter((bank) => bank.accbs_bank !== 'Ghost').map((bank) => (
                                <option key={bank.accbs_id} value={bank.accbs_id}>
                                  {bank.accbs_bank} ({bank.accbs_owner})
                                </option>)
                              ) : null
                            }
                          </select>
                        </div>
                      )}

                      {operationType !== 'Ingreso' || selectedBank === "" ? null :
                        <Alert>
                          <h4 className="alert-heading">
                            Cuenta Bancaria:
                          </h4>
                          {selectedCurrency === 'EUR' ?
                            banksEUR.map((bank) => {
                              return bank.acceur_id === parseInt(selectedBank) ?
                                <p>
                                  Banco: {bank.acceur_Bank}
                                  <br />
                                  Cuenta: {bank.acceur_number}
                                  <br />
                                  NIE/NIF: {bank.acceur_nie}
                                  <br />
                                  Propietario: {bank.acceur_owner}
                                </p>
                                : null
                            })
                            : selectedCurrency === 'USD' ?
                              banksUSD.map((bank) => {
                                return bank.accusd_id === parseInt(selectedBank) ?
                                  <p>
                                    Banco: {bank.accusd_Bank}

                                    <br />
                                    Cuenta: {bank.accusd_number}
                                    <br />
                                    Propietario: {bank.accusd_owner}
                                    <br />
                                    Email: {bank.accusd_email}
                                  </p>
                                  : null
                              })
                              : selectedCurrency === 'GBP' ?
                                banksGBP.map((bank) => {
                                  return bank.accgbp_id === parseInt(selectedBank) ?
                                    <p>
                                      Banco: {bank.accgbp_Bank}
                                      <br />
                                      Cuenta: {bank.accgbp_number}
                                      <br />
                                      DNI: {bank.accgbp_Ident}
                                      <br />
                                      Propietario: {bank.accgbp_owner}
                                    </p>
                                    : null
                                })
                                :
                                banksBS.map((bank) => {
                                  return bank.accbs_id === parseInt(selectedBank) ?
                                    <p>
                                      Banco: {bank.accbs_bank}
                                      <br />
                                      Cuenta: {bank.accbs_number}
                                      <br />
                                      Propietario: {bank.accbs_owner}
                                    </p>
                                    : null
                                })
                          }
                          <hr />
                          <p className="mb-0">
                            Al culminar la verificación del pago, el monto se verá reflejado en su plataforma.
                          </p>
                        </Alert>
                      }
                      {operationType && (
                        <div className="form-group" hidden={selectedCurrency === ''}>
                          <label htmlFor="amount">Monto:</label>
                          <input
                            type="number"
                            id="amount"
                            className="form-control"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                        </div>
                      )}
                      {operationType && (
                        <div className="form-group" hidden={selectedCurrency === ''}>
                          <label htmlFor="date">Fecha (aaaa-mm-dd):</label>
                          <input
                            type="text"
                            id="date"
                            className="form-control"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            placeholder="aaaa-mm-dd"
                          />
                        </div>
                      )}
                    </form>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={handleSubmit}>
                      Realizar Operación
                    </Button>{' '}
                    <Button color="secondary" onClick={toggleModal}>
                      Cancelar
                    </Button>
                  </ModalFooter>
                </Modal>
              </div>
              <ToastContainer />
            </div>

          ) : (
            <NotFound404 />
          )}
        </>
      )}
    </div>
  );
}

export { Relation };