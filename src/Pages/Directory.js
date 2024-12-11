import React, { useState, useEffect, useCallback } from 'react';
import {
  Button, Table, Modal, ModalBody, ModalFooter, ModalHeader, Input, 
} from 'reactstrap';
import { NotFound404 } from './NotFound404';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useDataContext } from '../Context/dataContext';
import { NavBar } from '../Components/NavBar';
import { Spinner } from '../Components/Spinner';
import { Link } from 'react-router-dom'
import { useAxiosInterceptors } from "../Hooks/useAxiosInterceptors";


function Directory() {
  useAxiosInterceptors();
  const { logged, accessToken, url } = useDataContext();
  const [user, setUser] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [accbsUser_bank, setAccbsUser_bank] = useState('');
  const [accbsUser_owner, setAccbsUser_owner] = useState('');
  const [accbsUser_number, setAccbsUser_number] = useState('');
  const [accbsUser_dni, setAccbsUser_dni] = useState('');
  const [accbsUser_phone, setAccbsUser_phone] = useState('');
  const [accbsUser_type, setAccbsUser_type] = useState('');

  const [modalAddAccount, setModalAddAccount] = useState(false);

  const fetchDataUser = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Auth/findByToken/${accessToken.access_token}`, {
        headers: {
          Authorization: `Bearer ${accessToken.access_token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [accessToken, url]);

  const fetchAccounts = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/AccBsUser`, {
        headers: {
          Authorization: `Bearer ${accessToken.access_token}`,
        },
      });
      const allAccounts = response.data;
      const userAccounts = allAccounts.filter(account => account.accbsUser_user.use_id === user.use_id);
      setAccounts(userAccounts);
    } catch (error) {
      console.log(error);
    }
  }, [user, accessToken, url]);

  useEffect(() => {
    fetchDataUser();
  }, [fetchDataUser]);

  useEffect(() => {
    if (user.use_id) {
      fetchAccounts();
    }
  }, [user, fetchAccounts]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 900); 
  }, []);

  const toggleAddAccount = () => setModalAddAccount(!modalAddAccount);

  const handleAddAccountSubmit = async event => {
    event.preventDefault();
    try {
      await axios.post(`${url}/AccBsUser/create`,
        {
          accbsUser_bank,
          accbsUser_owner,
          accbsUser_number,
          accbsUser_dni,
          accbsUser_phone,
          accbsUser_type,
          accbsUser_userId: user.use_id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken.access_token}`,
          },
        },
      );

      // Refresh the page after adding account
      window.location.reload();

      toast.success('Cuenta agregada con éxito!', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.log(error);
      toast.error('Error al agregar la cuenta', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleDeleteAccount = async (accountId) => {
    try {
      await axios.delete(`${url}/AccBsUser/${accountId}`, {
        headers: {
          Authorization: `Bearer ${accessToken.access_token}`,
        },
      });
      setAccounts(accounts.filter(account => account.accbsUser_id !== accountId));
      toast.success('Cuenta eliminada con éxito!', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.log(error);
      toast.error('Error al eliminar la cuenta', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {logged ? (
            <div>
              <NavBar />
              <div className='accountContent'>
                <h2 className='titleAccount'>
                  Cuentas Bancarias
                </h2>
                <Button color="primary" onClick={toggleAddAccount}>
                  Agregar Cuenta
                </Button>
                <Link to="/changes">
                  <Button color="success">
                    Enviar dinero
                  </Button>
                </Link>
                <Table success bordered hover responsive striped className='accountTable table-success'>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Banco</th>
                      <th>Propietario</th>
                      <th>Número de Cuenta</th>
                      <th>Cédula</th>
                      <th>Teléfono</th>
                      <th>Tipo</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((account, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{account.accbsUser_bank}</td>
                        <td>{account.accbsUser_owner}</td>
                        <td>{account.accbsUser_number}</td>
                        <td>{account.accbsUser_dni}</td>
                        <td>{account.accbsUser_phone}</td>
                        <td>{account.accbsUser_type}</td>
                        <td>
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => handleDeleteAccount(account.accbsUser_id)}
                          >
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <Modal centered isOpen={modalAddAccount} toggle={toggleAddAccount}>
                <ModalHeader toggle={toggleAddAccount}>Agregar Cuenta</ModalHeader>
                <ModalBody>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="accbsUser_bank" className="form-label">
                        Banco:
                      </label>
                      <Input
                        type="select"
                        name="accbsUser_bank"
                        value={accbsUser_bank}
                        onChange={(e) => setAccbsUser_bank(e.target.value)}
                        className="form-control"
                        id="accbsUser_bank"
                        required
                      >
                        <option value="">Seleccione un banco</option>
                        <option value="(0108) BBVA Provincial">(0108) BBVA Provincial</option>
                        <option value="(0134) Banesco">(0134) Banesco Banco</option>
                        <option value="(0105) Mercantil Banco">(0105) Mercantil Banco</option>
                        <option value="(0191) Banco Nacional De Crédito">(0191) Banco Nacional De Crédito</option>
                        <option value="(0114) Banco Del Caribe">(0114) Banco Del Caribe</option>
                        <option value="(0115) Banco Exterior">(0115) Banco Exterior</option>
                        <option value="(0104) Venezolano De Crédito">(0104) Venezolano De Crédito</option>
                        <option value="(0151) Banco Fondo Común">(0151) Banco Fondo Común</option>
                        <option value="(0174) Banplus Banco Universal">(0174) Banplus Banco Universal</option>
                        <option value="(0138) Banco Plaza">(0138) Banco Plaza</option>
                        <option value="(0137) Banco Sofitasa">(0137) Banco Sofitasa</option>
                        <option value="(0128) Banco Caroní">(0128) Banco Caroní</option>
                        <option value="(0171) Banco Activo">(0171) Banco Activo</option>
                        <option value="(0157) Del Sur">(0157) Del Sur</option>
                        <option value="(0156) 100% Banco">(0156) 100% Banco</option>
                        <option value="(0172) Bancamiga">(0172) Bancamiga</option>
                        <option value="(0169) Banco Internacional de Desarrollo">(0169) Banco Internacional de Desarrollo</option>
                        <option value="(0102) Banco de Venezuela">(0102) Banco de Venezuela</option>
                        <option value="(0175) Banco Bicentenario">(0175) Banco Bicentenario</option>
                        <option value="(0163) Banco del Tesoro">(0163) Banco del Tesoro</option>
                        <option value="(0177) Banco de la Fuerza Armada Nacional Bolivariana">(0177) Banco de la Fuerza Armada Nacional Bolivariana</option>
                        <option value="(0166) Banco Agrícola De Venezuela">(0166) Banco Agrícola De Venezuela</option>
                      </Input>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="accbsUser_owner" className="form-label">
                        Propietario:
                      </label>
                      <Input
                        type="text"
                        name="accbsUser_owner"
                        value={accbsUser_owner}
                        onChange={(e) => setAccbsUser_owner(e.target.value)}
                        className="form-control"
                        id="accbsUser_owner"
                        placeholder="Propietario"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="accbsUser_number" className="form-label">
                        Número de Cuenta (Dejar en blanco en caso de ser pago movil):
                      </label>
                      <Input
                        type="text"
                        name="accbsUser_number"
                        value={accbsUser_number}
                        onChange={(e) => setAccbsUser_number(e.target.value)}
                        className="form-control"
                        id="accbsUser_number"
                        placeholder="Número de Cuenta"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="accbsUser_dni" className="form-label">
                        CEDULA:
                      </label>
                      <Input
                        type="text"
                        name="accbsUser_dni"
                        value={accbsUser_dni}
                        onChange={(e) => setAccbsUser_dni(e.target.value)}
                        className="form-control"
                        id="accbsUser_dni"
                        placeholder="CEDULA"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="accbsUser_phone" className="form-label">
                        Teléfono:
                      </label>
                      <Input
                        type="text"
                        name="accbsUser_phone"
                        value={accbsUser_phone}
                        onChange={(e) => setAccbsUser_phone(e.target.value)}
                        className="form-control"
                        id="accbsUser_phone"
                        placeholder="Teléfono"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="accbsUser_type" className="form-label">
                        Tipo:
                      </label>
                      <Input
                        type="select"
                        name="accbsUser_type"
                        value={accbsUser_type}
                        onChange={(e) => setAccbsUser_type(e.target.value)}
                        className="form-control"
                        id="accbsUser_type"
                        required
                      >
                        <option value="">Seleccione un tipo</option>
                        <option value="Cuenta bancaria">Cuenta bancaria</option>
                        <option value="Pago móvil">Pago móvil</option>
                      </Input>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="secondary" onClick={toggleAddAccount}>
                    Cancelar
                  </Button>
                  <Button color="primary" onClick={handleAddAccountSubmit}>
                    Guardar cuenta
                  </Button>
                </ModalFooter>
              </Modal>

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

export { Directory };
