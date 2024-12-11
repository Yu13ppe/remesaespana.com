import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  Button,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
} from 'reactstrap'
import { NotFound404 } from './NotFound404';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { useDataContext } from '../Context/dataContext'
import { NavBar } from '../Components/NavBar';
import { Spinner } from '../Components/Spinner'; // Ajusta la ruta de importación según tu estructura de archivos


function UserNoVerificated() {
  const { accessAdminToken, url } = useDataContext();
  const [users, setUsers] = useState([]);

  const [modalImageUser, setModalImageUser] = useState(false);
  const [modalUser, setModalUser] = useState(false);
  const [modalViewer, setModalViewer] = useState(false);

  const [select, setSelect] = useState([])
  const [searchQuery, setSearchQuery] = useState('');

  const [admin, setAdmin] = useState([]);

  const [use_img, setUserImage1] = useState('');
  const [use_imgDni, setUserImage2] = useState('');

  const [use_name, setNombre] = useState('');
  const [use_lastName, setLastName] = useState('');
  const [use_email, setEmail] = useState('');
  const [use_password, setPassword] = useState('');
  const [use_dni, setDNI] = useState('');
  const [use_phone, setPhone] = useState('');
  const [use_verif, setVerif] = useState('');
  const [use_amountEur, setAmountEur] = useState(Number);
  const [use_amountUsd, setAmountUsd] = useState(Number);
  const [use_amountGbp, setAmountGbp] = useState(Number);
  const [selectedUser, setSelectedUser] = useState(null);
  const videoRef = useRef(null);
  const [modalKYC, setModalKYC] = useState(false);
  const [kycLink, setKycLink] = useState('');

  const openKYCModal = (user) => {
    setSelectedUser(user);
    setModalKYC(true);
  };

  const closeKYCModal = () => {
    setModalKYC(false);
  };

  const handleSendKYC = async () => {
    if (!kycLink) {
      toast.error("El enlace de KYC no puede estar vacío.");
      return;
    }
  
    try {
      const response = await axios.get(`${url}/kyclink/user/${selectedUser.use_id}`, {
        headers: {
          Authorization: `Bearer ${accessAdminToken.access_token}`,
        },
      });
  
      const kycData = response.data;
  
      if (!kycData || !kycData.kyc_link_id) {
        toast.error("No se encontró el KYC para este usuario.");
        return;
      }
  
      const kycLinkId = kycData.kyc_link_id;
  
      // Actualizar el kyc_link del usuario en la base de datos usando el kyc_link_id
      await axios.put(
        `${url}/kyclink/${kycLinkId}`, // Usamos el kyc_link_id en lugar del use_id
        {
          kyc_link: kycLink,
          kyc_link_status: "Sent",  // Actualizamos el estado a 'Sent'
          kyc_link_date: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${accessAdminToken.access_token}`,
          },
        }
      );
  
      await axios.post(
        `${url}/Mailer/EmailKYC/${selectedUser.use_email}`,
        {
         
            "link": kycLink  
          
        },
        {
          headers: {
            Authorization: `Bearer ${accessAdminToken.access_token}`,
            'Content-Type': 'application/json',  // Indicamos que estamos enviando un objeto JSON
          },
        }
      );
  
      toast.success("¡Link KYC enviado exitosamente!");
      setModalKYC(false);
      setKycLink('');
    } catch (error) {
      console.log(error);
      toast.error("Hubo un problema al enviar el enlace KYC.");
    }
  };
  
  
  
  
  
  



  const toggleImageUser = () => setModalImageUser(!modalImageUser);
  const toggleUser = () => {
    setModalUser(!modalUser);
    if (modalUser === false) {
      setNombre('');
      setLastName('');
      setEmail('');
      setPassword('');
      setDNI('');
      setVerif('');
      setAmountEur('');
      setAmountUsd('');
      setAmountGbp('');
    }
  }

  const toggleViewer = () => setModalViewer(!modalViewer);

  const filteredUsuarios = users.filter(user => {
    const fullName = `${user.use_name} ${user.use_lastName} ${user.use_dni}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const handleSearch = event => {
    setSearchQuery(event.target.value);
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/users`, {
        headers: {
          Authorization: `Bearer ${accessAdminToken.access_token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [setUsers, accessAdminToken, url]);


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
  }, [setAdmin, accessAdminToken, url]);

  useEffect(() => {
    fetchData();
    fetchDataAdmin();
  }, [fetchData, fetchDataAdmin]);

  const handleEdit = async (user) => {
    setSelectedUser(user);
    toggleUser();

    setNombre(user.use_name);
    setLastName(user.use_lastName);
    setEmail(user.use_email);
    setPassword(user.use_password);
    setDNI(user.use_dni);
    setPhone(user.use_phone);
    setUserImage1(user.use_img);
    setUserImage2(user.use_imgDni);
    setVerif(user.use_verif);
    setAmountEur(user.use_amountEur);
    setAmountUsd(user.use_amountUsd);
    setAmountGbp(user.use_amountGbp);

    try {
      const response = await axios.get(`${url}/kyclink/${user.use_id}`, {
        headers: {
          Authorization: `Bearer ${accessAdminToken.access_token}`,
        },
      });

      // Si existe un link KYC para el usuario, establecemos su valor en el estado
      if (response.data && response.data.kyc_link) {
        setKycLink(response.data.kyc_link);
      } else {
        setKycLink(''); // Si no existe, lo dejamos vacío
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      if (selectedUser) {
        await axios.put(
          `${url}/Users/${selectedUser.use_id}`,
          {
            use_name,
            use_lastName,
            use_dni,
            use_phone,
            use_email,
            use_password,
            use_img,
            use_imgDni,
            use_verif,
            use_amountUsd,
            use_amountEur,
            use_amountGbp
          },
          {
            headers: {
              Authorization: `Bearer ${accessAdminToken.access_token}`,
            },
          }
        );

        if (use_verif === 'S') {
          await axios.post(
            `${url}/Mailer/EmailVVerif/${use_email}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${accessAdminToken.access_token}`,
                'Content-Type': 'application/json',
              },
            }
          );
        } else {
          await axios.post(
            `${url}/Mailer/EmailRVerif/${use_email}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${accessAdminToken.access_token}`,
                'Content-Type': 'application/json',
              },
            }
          );
        }

        setSelectedUser(null);

        fetchData();
        toggleUser();
        toggleViewer();

        toast.success('¡Cambio realizado con éxito!', {
          position: 'bottom-right',
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

      fetchData();
      toggleUser();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async id => {
    try {
      await axios.delete(
        `${url}/Users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessAdminToken.access_token}`,
          },
        }
      );

      fetchData();
      toggleViewer();
    } catch (error) {
      console.log(error);
    }
  };


  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 900); // Simula que la carga demora 2 segundos
  }, []);


  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {admin.adm_role === 'A' || admin.adm_role === 'C' ? (
            <div>
              <NavBar />
              <div className='userContent'>
                <h1 className='titleUser'>
                  Usuarios
                </h1>
                <div className="container">
                  <div className='row m-5 col-12'>
                    <div className='d-flex align-items-center col-12'>
                      <Input
                        type="text"
                        className="form-control search-input"
                        defaultValue={searchQuery}
                        onChange={handleSearch}
                        placeholder="Buscar Usuario..."
                      />
                    </div>
                  </div>
                </div>

                {/* Tabla De Usuarios */}
                <Table success bordered hover responsive striped className='userTable table-success'>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Telefono</th>
                      <th>DNI</th>
                      <th>Verificacion</th>
                      <th>Imagen</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      filteredUsuarios.filter((user) => user.use_verif === 'E').map((user) => (
                        <tr key={user.use_id}
                          onClick={() => {
                            setSelect(user);
                          }}>
                          <th scope="row">{user.use_id}</th>
                          <td>{user.use_name}</td>
                          <td>{user.use_lastName}</td>
                          <td>{user.use_phone}</td>
                          <td>{user.use_dni ? user.use_dni : <p>No se encontraron resultados</p>}</td>
                          <td><AiOutlineClockCircle style={{ color: "blue", fontSize: "2em" }} /></td>
                          <td>
                            <Button
                              color='primary'
                              onClick={() => {
                                toggleImageUser();
                              }}>
                              Ver Imagen
                            </Button>
                          </td>
                          <td>
                            <Button className='mr-5'
                              color="warning"
                              onClick={() => { handleEdit(user) }}
                            >
                              Editar
                            </Button>
                            <Button
                              color="danger"
                              id="PopoverLegacy"
                              type="button"
                            >
                              Eliminar
                            </Button>

                            <Button
                              color="info"
                              onClick={() => { openKYCModal(user) }}  // Nuevo botón para el KYC link
                            >
                              Enviar KYC Link
                            </Button>

                            <UncontrolledPopover
                              placement="top"
                              target="PopoverLegacy"
                              trigger="legacy"
                            >
                              <PopoverHeader className="align-item-centered">
                                ¿Estas segur@ que quieres eliminar?
                              </PopoverHeader>
                              <PopoverBody className="align-item-centered">
                                Una vez eliminado no podras volver a ver los datos de este usuario, ¿Estas segur@?
                                <Button
                                  color="danger"
                                  id="PopoverLegacy"
                                  type="button"
                                  onClick={() => handleDelete(select.use_id)}
                                >
                                  Eliminar
                                </Button>
                              </PopoverBody>
                            </UncontrolledPopover>
                          </td>

                        </tr>
                      ))}
                  </tbody>
                </Table>

                {/* Modal De Imagen Usuarios */}
                <Modal centered isOpen={modalImageUser} size='lg' toggle={toggleImageUser}>
                  <ModalHeader toggle={toggleImageUser}>
                    {select.use_name} {select.use_lastName}
                  </ModalHeader>
                  <ModalBody
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    {select && select.use_img && select.use_img.toLowerCase().includes('.pdf') ? (
                      <a href={`${url}/Users/image/${select.use_img}`} target='_blank' rel="noreferrer">
                        <Button color='success' style={{ margin: '5px' }}>
                          Descargar PDF de Usuario
                        </Button>
                      </a>
                    ) : null}
                    {select && select.use_imgDni && select.use_imgDni.toLowerCase().includes('.pdf') ? (
                      <a href={`${url}/Users/imageDni/${select.use_imgDni}`} target='_blank' rel="noreferrer">
                        <Button color='primary' style={{ margin: '10px' }}>
                          Descargar PDF de DNI de Usuario
                        </Button>
                      </a>
                    ) : null}
                    {select && select.use_img && !select.use_img.toLowerCase().includes('.pdf') ? (
                      (select.use_img.toLowerCase().includes('.mp4') ||
                        select.use_img.toLowerCase().includes('.mov') ||
                        select.use_img.toLowerCase().includes('.avi')) ? (
                        <video style={{ width: '100%' }} controls>
                          <source src={`${url}/Users/image/${select.use_img}`} type={
                            select.use_img.toLowerCase().includes('.mp4') ? 'video/mp4' :
                              select.use_img.toLowerCase().includes('.mov') ? 'video/quicktime' :
                                select.use_img.toLowerCase().includes('.avi') ? 'video/x-msvideo' : ''
                          } />
                          Tu navegador no soporta el elemento de video.
                        </video>
                      ) : (
                        <img
                          style={{ width: '100%' }}
                          alt='ImageUser1'
                          src={`${url}/Users/image/${select.use_img}`}
                        />
                      )
                    ) : null}

                    {select && select.use_imgDni && !select.use_imgDni.toLowerCase().includes('.pdf') ? (
                      (select.use_imgDni.toLowerCase().includes('.mp4') ||
                        select.use_imgDni.toLowerCase().includes('.mov') ||
                        select.use_imgDni.toLowerCase().includes('.avi')) ? (
                        <video style={{ width: '100%' }} ref={videoRef} preload="auto" controls playsInline muted autoPlay>
                          <source src={`${url}/Users/imageDni/${select.use_imgDni}`} type={
                            select.use_img.toLowerCase().includes('.mp4') ? 'video/mp4' :
                              select.use_img.toLowerCase().includes('.mov') ? 'video/quicktime' :
                                select.use_img.toLowerCase().includes('.avi') ? 'video/x-msvideo' : ''
                          } />
                          Tu navegador no soporta el elemento de video.
                        </video>
                      ) : (
                        <img
                          style={{ width: '100%' }}
                          alt='ImageUser2'
                          src={`${url}/Users/imageDni/${select.use_imgDni}`}
                        />
                      )
                    ) : null}

                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onClick={toggleImageUser}>
                      Volver
                    </Button>
                  </ModalFooter>
                </Modal>


                {/* Modal De Agregar Usuarios */}
                <Modal centered isOpen={modalUser} toggle={toggleUser}>
                  <ModalHeader toggle={toggleUser}>{selectedUser ? 'Editar Usuario' : 'Agregar Usuario'}</ModalHeader>
                  <ModalBody>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="nombre" className="form-label">
                          Nombre:
                        </label>
                        <Input
                          type="text"
                          defaultValue={use_name}
                          onChange={e => setNombre(e.target.value)}
                          className="form-control"
                          id="nombre"
                          disabled={selectedUser}
                          placeholder="Nombre"
                          maxLength="45"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="apellido" className="form-label">
                          Apellido:
                        </label>
                        <Input
                          type="text"
                          defaultValue={use_lastName}
                          onChange={e => setLastName(e.target.value)}
                          className="form-control"
                          id="aombre"
                          disabled={selectedUser}
                          placeholder="Apellido"
                          maxLength="45"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label">
                          Email:
                        </label>
                        <Input
                          type="email"
                          defaultValue={use_email}
                          onChange={e => setEmail(e.target.value)}
                          className="form-control"
                          id="email"
                          disabled={selectedUser}
                          placeholder="Email"
                          maxLength="45"
                          required
                        />
                      </div>
                      <div hidden={selectedUser} className="col-md-6">
                        <label htmlFor="password" className="form-label">
                          Contraseña:
                        </label>
                        <Input
                          type="password"
                          defaultValue={use_password}
                          onChange={e => setPassword(e.target.value)}
                          className="form-control"
                          id="password"
                          hidden={selectedUser}
                          placeholder="Password"
                          maxLength="45"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="dni" className="form-label">
                          DNI:
                        </label>
                        <Input
                          type="number"
                          defaultValue={use_dni}
                          onChange={e => setDNI(e.target.value)}
                          className="form-control"
                          disabled={selectedUser}
                          id="dni"
                          placeholder="DNI"
                        />
                        <div className="col-md-6">
                          <label htmlFor="dni" className="form-label">
                            Telefono
                          </label>
                          <Input
                            type="number"
                            defaultValue={use_phone}
                            onChange={e => setPhone(e.target.value)}
                            className="form-control"
                            disabled={selectedUser}
                            id="phone"
                            placeholder="Telefono"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          Verificación:
                        </label>
                        <div>
                          <Input
                            type="radio"
                            id="noVerificated"
                            value="N"
                            checked={use_verif === 'N'}
                            onChange={event => setVerif(event.target.value)}
                            name="N"
                          />
                          <label htmlFor="noVerificated" className="form-label">No Verificado</label>
                        </div>
                        <div>
                          <Input
                            type="radio"
                            id="Verificated"
                            name="Verificated"
                            value="S"
                            checked={use_verif === 'S'}
                            onChange={event => setVerif(event.target.value)}
                          ></Input>
                          <label htmlFor="Verificated" className="form-label">Verificado</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="Eur" className="form-label">
                          Euros:
                        </label>
                        <Input
                          type="number"
                          defaultValue={use_amountEur}
                          onChange={e => setAmountEur(e.target.value)}
                          className="form-control"
                          id="Eur"
                          disabled={selectedUser}
                          placeholder="Eur"
                          pattern="^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}$"
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="Usd" className="form-label">
                          Dolares:
                        </label>
                        <Input
                          type="number"
                          defaultValue={use_amountUsd}
                          onChange={e => setAmountUsd(e.target.value)}
                          className="form-control"
                          id="Usd"
                          disabled={selectedUser}
                          placeholder="Usd"
                          pattern="^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}$"
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="Gbp" className="form-label">
                          Libras:
                        </label>
                        <Input
                          type="number"
                          defaultValue={use_amountGbp}
                          onChange={e => setAmountGbp(e.target.value)}
                          className="form-control"
                          id="Gbp"
                          disabled={selectedUser}
                          placeholder="Gbp"
                          pattern="^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}$"
                        />
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={handleSubmit}>
                      {selectedUser ? 'Editar' : 'Agregar'}
                    </Button>
                    <Button color="secondary" onClick={toggleUser}>
                      Cancelar
                    </Button>
                  </ModalFooter>
                </Modal>

                <Modal centered isOpen={modalKYC} toggle={closeKYCModal}>
                  <ModalHeader toggle={closeKYCModal}>
                    Enviar Link de KYC a {selectedUser?.use_name} {selectedUser?.use_lastName}
                  </ModalHeader>
                  <ModalBody>
                    <p>¿Deseas enviar el siguiente enlace de KYC a {selectedUser?.use_email}?</p>
                    <Input
                      type="text"
                      value={kycLink}
                      onChange={e => setKycLink(e.target.value)}
                      placeholder="Introduce el enlace de KYC"
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={handleSendKYC}>
                      Enviar
                    </Button>
                    <Button color="secondary" onClick={closeKYCModal}>
                      Cancelar
                    </Button>
                  </ModalFooter>
                </Modal>

                <ToastContainer />

              </div >
            </div>
          ) : (
            <NotFound404 />
          )}
        </>
      )}
    </div>
  )
}

export { UserNoVerificated }