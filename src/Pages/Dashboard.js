import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
  Label,
  FormGroup,
  Alert,
} from "reactstrap";
import { FaArrowDown, FaArrowUp, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useDataContext } from "../Context/dataContext";
import { NavBarAdm } from "../Components/NavBarAdm";
import { NotFound404 } from "./NotFound404";
import { Spinner } from "../Components/Spinner";

function Dashboard() {
  const { accessAdminToken, url } = useDataContext();
  const [isLoading, setIsLoading] = useState(true);

  const [movements, setMovements] = useState([]);
  const [user, setUsers] = useState([]);
  const [select, setSelect] = useState(null);
  const [modalIngreso, setModalIngreso] = useState(false);
  const toggleModalIngreso = () => setModalIngreso(!modalIngreso);
  const [modalEgreso, setModalEgreso] = useState(false);
  const [isLoadingVerify, setIsLoadingVerify] = useState(false);

  const toggleModalEgreso = () => setModalEgreso(!modalEgreso);

  const [totalEur, setTotalEur] = useState([]);
  const [totalUsd, setTotalUsd] = useState([]);
  const [totalGbp, setTotalGbp] = useState([]);
  const [totalBs, setTotalBs] = useState([]);

  const [currencyPrice, setCurrencyPrice] = useState([]);

  const [admin, setAdmin] = useState([]);

  const [payment, setPayment] = useState("");
  const [amount, setAmount] = useState("");

  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentReject, setCommentReject] = useState("");

  const [bankOptionPay, setBankOptionPay] = useState("");
  const [banksBs, setBanksBS] = useState([]);
  const [banksUSD, setBanksUSD] = useState([]);
  const [mov_img, setMovImg] = useState("");

  const [modalImageMov, setModalImageMov] = useState(false);
  const toggleImageMov = () => setModalImageMov(!modalImageMov);

  const [modal, setModal] = useState(false);
  const toggle = (move) => {
    if (move.mov_type === "Deposito") {
      toggleModalIngreso();
      setAmount(move.mov_amount);
    } else if (move.mov_type === "Retiro") {
      toggleModalEgreso();
      setAmount(move.mov_amount);
    }
    setSelect(move);
    setModal(!modal);
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/movements`, {
        headers: {
          Authorization: `Bearer ${accessAdminToken.access_token}`,
        },
      });
      setMovements(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [accessAdminToken, setMovements, url]);

  const fetchDataAdmin = useCallback(async () => {
    try {
      const response = await axios.get(
        `${url}/Auth/findByTokenAdmin/${accessAdminToken.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${accessAdminToken.access_token}`,
          },
        }
      );
      setAdmin(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [setAdmin, accessAdminToken, url]);

  const fetchDataUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Users`, {
        headers: {
          Authorization: `Bearer ${accessAdminToken.access_token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [accessAdminToken, setUsers, url]);

  const fetchDataAccBs = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/AccBs`, {
        headers: {
          Authorization: `Bearer ${accessAdminToken.access_token}`,
        },
      });
      setBanksBS(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [accessAdminToken, setBanksBS, url]);

  const fetchDataAccUsd = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/AccUsd`, {
        headers: {
          Authorization: `Bearer ${accessAdminToken.access_token}`,
        },
      });
      setBanksUSD(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [accessAdminToken, setBanksUSD, url]);

  const fetchDataTotalEur = useCallback(async () => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

    try {
      const response = await axios.get(
        `${url}/Movements/totaleur/${formattedDate}/`,
        {
          headers: {
            Authorization: `Bearer ${accessAdminToken.access_token}`,
          },
        }
      );
      setTotalEur(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [accessAdminToken, setTotalEur, url]);

  const fetchDataTotalGbp = useCallback(async () => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

    try {
      const response = await axios.get(
        `${url}/Movements/totalgbp/${formattedDate}/`,
        {
          headers: {
            Authorization: `Bearer ${accessAdminToken.access_token}`,
          },
        }
      );
      setTotalGbp(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [accessAdminToken, setTotalGbp, url]);

  const fetchDataTotalUsd = useCallback(async () => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

    try {
      const response = await axios.get(
        `${url}/Movements/totalusd/${formattedDate}/`,
        {
          headers: {
            Authorization: `Bearer ${accessAdminToken.access_token}`,
          },
        }
      );
      setTotalUsd(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [accessAdminToken, setTotalUsd, url]);

  const fetchDataTotalBs = useCallback(async () => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

    try {
      const response = await axios.get(
        `${url}/Movements/totalbs/${formattedDate}/`,
        {
          headers: {
            Authorization: `Bearer ${accessAdminToken.access_token}`,
          },
        }
      );
      setTotalBs(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [accessAdminToken, setTotalBs, url]);

  const fetchDataCurrency = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/currencyPrice/1`, {
        headers: {
          Authorization: `Bearer ${accessAdminToken.access_token}`,
        },
      });
      setCurrencyPrice(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [accessAdminToken, setCurrencyPrice, url]);

  useEffect(() => {
    fetchData();
    fetchDataUsers();
    fetchDataAccBs();
    fetchDataAccUsd();
    fetchDataTotalEur();
    fetchDataTotalGbp();
    fetchDataTotalUsd();
    fetchDataTotalBs();
    fetchDataAdmin();
    fetchDataCurrency();
  }, [
    fetchDataAccBs,
    fetchDataAccUsd,
    fetchDataUsers,
    fetchData,
    fetchDataTotalEur,
    fetchDataTotalGbp,
    fetchDataTotalUsd,
    fetchDataTotalBs,
    fetchDataAdmin,
    fetchDataCurrency,
  ]);

  const handleSubmitSummary = () => {
    const totalAmountEur = parseFloat(select.User.use_amountEur);
    const totalAmountUsd = parseFloat(select.User.use_amountUsd);
    const totalAmountGbp = parseFloat(select.User.use_amountGbp);
    const formData = new FormData();
    if (select.mov_currency === "EUR") {
      formData.append("use_amountEur", totalAmountEur + amount);
    }
    if (select.mov_currency === "USD") {
      formData.append("use_amountUsd", totalAmountUsd + amount);
    }
    if (select.mov_currency === "GBP") {
      formData.append("use_amountGbp", totalAmountGbp + amount);
    }

    try {
      axios.put(`${url}/Users/${select.User.use_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessAdminToken.access_token}`,
        },
      });
      console.log("Request send successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmitSendVerify = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);

    if (select.mov_typeOutflow === "Efectivo") {
      formData.append("mov_currency", "USD");
      formData.append("mov_accEurId", 0);
      formData.append("mov_accGbpId", 0);
      formData.append("mov_amount", select.mov_amount);
      formData.append("mov_date", formattedDate);
    } else {
      formData.append(
        "mov_currency",
        select.mov_currency === "USD" ||
          select.mov_currency === "EUR" ||
          select.mov_currency === "GBP"
          ? payment
          : select.mov_currency
      );
      formData.append("mov_accEurId", 0);
      formData.append("mov_accGbpId", 0);
      formData.append(
        "mov_accUsdId",
        payment === "USD" ? parseInt(bankOptionPay) : 0
      );
      formData.append(
        "mov_accBsId",
        payment === "BS" ? parseInt(bankOptionPay) : 0
      );
      formData.append("mov_img", mov_img);
      formData.append(
        "mov_amount",
        select.mov_currency === payment
          ? parseFloat(select.mov_amount)
          : select.mov_currency === "USD" && select.mov_currency !== payment
          ? parseFloat(select.mov_amount) * currencyPrice.cur_UsdToBs
          : select.mov_currency === "EUR"
          ? parseFloat(select.mov_amount) * currencyPrice.cur_EurToBs
          : select.mov_currency === "GBP"
          ? parseFloat(select.mov_amount) * currencyPrice.cur_GbpToBs
          : parseFloat(select.mov_amount)
      );
      formData.append("mov_date", formattedDate);
    }

    try {
      await axios.put(`${url}/Movements/${select.mov_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessAdminToken.access_token}`,
        },
      });

      await axios.get(`${url}/Movements/verif/${select.mov_id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessAdminToken.access_token}`,
        },
      });

      await axios.post(
        `${url}/Mailer/EmailVtransfer/${select.User.use_email}/${select.mov_id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${accessAdminToken.access_token}`,
          },
        }
      );

      if (select.mov_currency === "EUR" && payment === "BS") {
        await axios.post(
          `${url}/TotalRegister/create`,
          {
            tor_accBsId: parseInt(bankOptionPay),
            tor_currencyPrice: parseFloat(currencyPrice.cur_EurToBs),
          },
          {
            headers: {
              Authorization: `Bearer ${accessAdminToken.access_token}`,
            },
          }
        );
      }
      if (select.mov_currency === "EUR" && payment === "USD") {
        await axios.post(
          `${url}/TotalRegister/create`,
          {
            tor_accUsdId: parseInt(bankOptionPay),
            tor_currencyPrice: parseInt(currencyPrice.cur_EurToUsd),
          },
          {
            headers: {
              Authorization: `Bearer ${accessAdminToken.access_token}`,
            },
          }
        );
      }
      if (select.mov_currency === "USD" && payment === "BS") {
        await axios.post(
          `${url}/TotalRegister/create`,
          {
            tor_accBsId: parseInt(bankOptionPay),
            tor_currencyPrice: parseFloat(currencyPrice.cur_UsdToBs),
          },
          {
            headers: {
              Authorization: `Bearer ${accessAdminToken.access_token}`,
            },
          }
        );
      }
      if (select.mov_currency === "USD" && payment === "USD") {
        await axios.post(
          `${url}/TotalRegister/create`,
          {
            tor_accUsdId: parseInt(bankOptionPay),
            tor_currencyPrice: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${accessAdminToken.access_token}`,
            },
          }
        );
      }
      if (select.mov_currency === "GBP" && payment === "BS") {
        await axios.post(
          `${url}/TotalRegister/create`,
          {
            tor_accBsId: parseInt(bankOptionPay),
            tor_currencyPrice: parseFloat(currencyPrice.cur_GbpToBs),
          },
          {
            headers: {
              Authorization: `Bearer ${accessAdminToken.access_token}`,
            },
          }
        );
      }
      if (select.mov_currency === "GBP" && payment === "USD") {
        await axios.post(
          `${url}/TotalRegister/create`,
          {
            tor_accUsdId: parseInt(bankOptionPay),
            tor_currencyPrice: parseFloat(currencyPrice.cur_GbpToUsd),
          },
          {
            headers: {
              Authorization: `Bearer ${accessAdminToken.access_token}`,
            },
          }
        );
      }

      // Cerrar el modal
      toggleModalEgreso();
      toast.success("¡Datos enviados con exito!", {
        position: "bottom-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      fetchData();

      console.log("Request send successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmitVerify = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    formData.append("mov_date", formattedDate);

    try {
      await axios.get(`${url}/Movements/verif/${select.mov_id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessAdminToken.access_token}`,
        },
      });

      await axios.put(`${url}/Movements/${select.mov_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessAdminToken.access_token}`,
        },
      });

      await axios.post(
        `${url}/Mailer/EmailVtransfer/${select.User.use_email}/${select.mov_id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${accessAdminToken.access_token}`,
          },
        }
      );

      if (select.mov_currency === "EUR") {
        await axios.post(
          `${url}/TotalRegister/create`,
          {
            tor_accEurId: select.AccountsEur.acceur_id,
            tor_currencyPrice: currencyPrice.cur_EurToBs,
            tor_date: formattedDate,
          },
          {
            headers: {
              Authorization: `Bearer ${accessAdminToken.access_token}`,
            },
          }
        );
      }
      if (select.mov_currency === "USD") {
        await axios.post(
          `${url}/TotalRegister/create`,
          {
            tor_accUsdId: select.AccountsUsd.accusd_id,
            tor_currencyPrice: currencyPrice.cur_UsdToBs,
            tor_date: formattedDate,
          },
          {
            headers: {
              Authorization: `Bearer ${accessAdminToken.access_token}`,
            },
          }
        );
      }
      if (select.mov_currency === "GBP") {
        await axios.post(
          `${url}/TotalRegister/create`,
          {
            tor_accGbpId: select.AccountsGbp.accgbp_id,
            tor_currencyPrice: currencyPrice.cur_GbpToBs,
            tor_date: formattedDate,
          },
          {
            headers: {
              Authorization: `Bearer ${accessAdminToken.access_token}`,
            },
          }
        );
      }

      toggleModalIngreso();
      toast.success("¡Datos enviados con éxito!", {
        position: "bottom-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      handleSubmitSummary();
      fetchData();

      console.log("Request sent successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmitCancel = async (event) => {
    event.preventDefault();

    try {
      await axios.get(`${url}/Movements/reject/${select.mov_id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessAdminToken.access_token}`,
        },
      });

      if (select.mov_type !== "Deposito") {
        await axios.put(
          `${url}/Movements/${select.mov_id}`,
          {
            mov_comment: commentReject,
          },
          {
            headers: {
              Authorization: `Bearer ${accessAdminToken.access_token}`,
            },
          }
        );
        handleSubmitSummary();
      }

      fetchData();

      await axios.post(
        `${url}/Mailer/EmailRtransfer/${select.User.use_email}/${select.mov_id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${accessAdminToken.access_token}`,
          },
        }
      );

      // Cerrar el modal
      toast.success("¡Datos enviados con éxito!", {
        position: "bottom-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      console.log("Request sent successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 900);
  }, []);

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {admin.adm_role === "A" ? (
            <>
              <NavBarAdm />
              <div className="DashboardBody">
                <Container>
                  <center>
                    <h1 className="my-4">Panel de control</h1>
                  </center>
                  <Row>
                    <Col md="6" lg="3">
                      <Link to="/Users">
                        <div className="stat-box total-users">
                          <h2>Total de usuarios</h2>
                          <p>{user ? user.length : <b>No hay usuarios</b>}</p>
                        </div>
                      </Link>
                    </Col>
                    <Col md="6" lg="3">
                      <div className="stat-box verified-users">
                        <h2>Usuario verificados</h2>
                        <p>
                          {user ? (
                            user.filter((user) => user.use_verif === "S").length
                          ) : (
                            <b>No hay usuarios</b>
                          )}
                        </p>
                      </div>
                    </Col>

                    <Col md="6" lg="3">
                      <Link to="/UserNoVerificated">
                        <div className="stat-box unverified-users">
                          <h2>Usuario sin verificación</h2>
                          <p>
                            {user ? (
                              user.filter((user) => user.use_verif === "E")
                                .length
                            ) : (
                              <b>No hay usuarios</b>
                            )}
                          </p>
                        </div>
                      </Link>
                    </Col>
                    <Col md="6" lg="3">
                      <Link to="/UserNyVerificated">
                        <div className="stat-box verified-users">
                          <h2>U. Sin documentos</h2>
                          <p>
                            {user ? (
                              user.filter((user) => user.use_verif === "N")
                                .length
                            ) : (
                              <b>No hay usuarios</b>
                            )}
                          </p>
                        </div>
                      </Link>
                    </Col>
                    <Col md="6" lg="3">
                      <div className="stat-box total-euros">
                        <h2>Total Euros</h2>
                        <p>{totalEur.totalIn}</p>
                      </div>
                    </Col>
                    <Col md="6" lg="3">
                      <div className="stat-box total-euros">
                        <h2>Total Libras</h2>
                        <p>{totalGbp.totalIn - totalGbp.totalOut}</p>
                      </div>
                    </Col>
                    <Col md="6" lg="3">
                      <div className="stat-box total-bolivars">
                        <h2>Total Dolares</h2>
                        <p>{totalUsd.totalIn - totalUsd.totalOut}</p>
                      </div>
                    </Col>
                    <Col md="6" lg="3">
                      <div className="stat-box total-bolivars">
                        <h2>Total Bolivares</h2>
                        <p>{totalBs.totalIn - totalBs.totalOut}</p>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <table className="transaction-table">
                        <thead>
                          <tr>
                            <th>Usuario</th>
                            <th>Moneda</th>
                            <th>Monto</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Tipo</th>
                            <th>Detalles</th>
                          </tr>
                        </thead>
                        <tbody>
                          {movements
                            .filter((mov) => mov.mov_status === "E")
                            .map((move) => (
                              <tr key={move.mov_id}>
                                <td>
                                  {move.User.use_name} {move.User.use_lastName}
                                </td>
                                <td>{move.mov_currency}</td>
                                <td>{move.mov_amount}</td>
                                <td>{move.mov_date}</td>
                                <td>
                                  {move.mov_status === "E" && (
                                    <FaClock className="pending-icon" />
                                  )}
                                </td>
                                <td>
                                  {move.mov_type === "Deposito" ? (
                                    <FaArrowDown color="green" />
                                  ) : null}
                                  {move.mov_type === "Retiro" ? (
                                    <FaArrowUp color="red" />
                                  ) : null}
                                </td>
                                <td>
                                  <button
                                    className="details-button"
                                    onClick={() => toggle(move)}
                                  >
                                    Ver detalles
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </Col>
                  </Row>
                </Container>
              </div>

              {/*  Ingreso */}
              <Modal
                centered
                isOpen={modalIngreso}
                size="lg"
                toggle={toggleModalIngreso}
              >
                <ModalHeader toggle={toggleModalIngreso}>
                  Verificar Ingreso
                </ModalHeader>
                <ModalBody>
                  <Row>
                    <Col>
                      <h5>Usuario</h5>
                      {select && (
                        <>
                          <p>
                            {select.User.use_name} {select.User.use_lastName}
                          </p>
                          <p>{select.User.use_email}</p>
                          <p>{select.User.use_dni}</p>
                        </>
                      )}
                    </Col>
                    <Col>
                      <h5>Transacción</h5>
                      {select && (
                        <>
                          <p>{select.mov_date}</p>
                          <p>{select.mov_amount}</p>
                          <p>{select.mov_currency}</p>
                          {select.mov_phone ? (
                            <p>Telefono {select.mov_phone}</p>
                          ) : null}

                          {select.mov_code ? (
                            <p>Codigo de retiro {select.mov_code}</p>
                          ) : null}
                        </>
                      )}
                      <Button
                        color="primary"
                        onClick={() => {
                          toggleImageMov();
                        }}
                      >
                        Ver Imagen
                      </Button>
                    </Col>
                  </Row>
                </ModalBody>
                <ModalFooter>
                  {select && (
                    <Button color="success" onClick={handleSubmitVerify}>
                      Aprobar
                    </Button>
                  )}
                  {select && (
                    <Button
                      color="danger"
                      onClick={(e) => {
                        handleSubmitCancel(e);
                        toggleModalIngreso();
                      }}
                    >
                      Rechazar
                    </Button>
                  )}
                  <Button color="secondary" onClick={toggleModalIngreso}>
                    Volver
                  </Button>
                </ModalFooter>
              </Modal>

              {/*  Egreso */}
              <Modal
                centered
                isOpen={modalEgreso}
                toggle={() => setModalEgreso(false)}
              >
                <ModalHeader toggle={() => setModalEgreso(false)}>
                  Generar retiro
                </ModalHeader>
                <ModalBody>
                  <Alert color="success">
                    <h4 className="alert-heading">Datos bancarios:</h4>
                    <p
                      dangerouslySetInnerHTML={{
                        __html:
                          select && select.mov_comment.replace(/\n/g, "<br/>"),
                      }}
                    />
                  </Alert>
                  {select && (
                    <FormGroup>
                      <Label for="amount">
                        {(select &&
                          select.mov_typeOutflow === "Cuenta Bancaria") ||
                        (select &&
                          select.mov_typeOutflow ===
                            "Transferencias por dólares") ||
                        (select && select.mov_typeOutflow === "Pago Movil")
                          ? "Monto a transferir"
                          : "Monto a Entregar"}
                      </Label>
                      <Input
                        type="text"
                        name="amount"
                        id="amount"
                        disabled
                        defaultValue={
                          select.mov_currency === "EUR" &&
                          select.mov_typeOutflow ===
                            "Transferencias por dólares"
                            ? parseFloat(select.mov_amount) -
                              parseFloat(select.mov_amount) *
                                (currencyPrice.cur_EurToUsd / 100)
                            : select.mov_currency === "GBP" &&
                              select.mov_typeOutflow ===
                                "Transferencias por dólares"
                            ? parseFloat(select.mov_amount) +
                              parseFloat(select.mov_amount) *
                                (currencyPrice.cur_GbpToUsd / 100)
                            : select.mov_currency === "USD" &&
                              select.mov_typeOutflow !== "Efectivo" &&
                              select.mov_typeOutflow !==
                                "Transferencias por dólares"
                            ? parseFloat(select.mov_amount) *
                              currencyPrice.cur_UsdToBs
                            : select.mov_currency === "EUR" &&
                              select.mov_typeOutflow !== "Efectivo" &&
                              select.mov_typeOutflow !==
                                "Transferencias por dólares"
                            ? parseFloat(select.mov_amount) *
                              currencyPrice.cur_EurToBs
                            : select.mov_currency === "GBP" &&
                              select.mov_typeOutflow !== "Efectivo" &&
                              select.mov_typeOutflow !==
                                "Transferencias por dólares"
                            ? parseFloat(select.mov_amount) *
                              currencyPrice.cur_GbpToBs
                            : select.mov_amount
                        }
                      />
                    </FormGroup>
                  )}
                  {((select && select.mov_typeOutflow === "Cuenta Bancaria") ||
                    (select &&
                      select.mov_typeOutflow ===
                        "Transferencias por dólares") ||
                    (select && select.mov_typeOutflow === "Pago Movil")) && (
                    <FormGroup>
                      <Label for="currency">Elige la Moneda</Label>
                      <Input
                        type="select"
                        id="payment"
                        defaultValue={payment}
                        onChange={(e) => setPayment(e.target.value)}
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="BS">Bolívar</option>
                        <option value="USD">Dólar</option>
                      </Input>
                    </FormGroup>
                  )}
                  {((select && select.mov_typeOutflow === "Cuenta Bancaria") ||
                    (select &&
                      select.mov_typeOutflow ===
                        "Transferencias por dólares") ||
                    (select && select.mov_typeOutflow === "Pago Movil")) && (
                    <FormGroup>
                      <Label>Selecciona el Banco a transferir</Label>
                      <Input
                        type="select"
                        id="bankOptionPaySelect"
                        defaultValue={bankOptionPay}
                        disabled={payment === ""}
                        onChange={(e) => {
                          setBankOptionPay(e.target.value);
                        }}
                      >
                        <option value="">Selecciona una opción</option>
                        {payment === "BS"
                          ? banksBs
                              .filter((bank) => bank.accbs_status === "Activo")
                              .map((bank) => {
                                return bank.accbs_bank ? (
                                  <option value={bank.accbs_id}>
                                    {bank.accbs_bank} ({bank.accbs_owner})
                                  </option>
                                ) : null;
                              })
                          : payment === "USD"
                          ? banksUSD
                              .filter((bank) => bank.accusd_status === "Activo")
                              .map((bank) => {
                                return bank.accusd_Bank ? (
                                  <option value={bank.accusd_id}>
                                    {bank.accusd_Bank} ({bank.accusd_owner})
                                  </option>
                                ) : null;
                              })
                          : null}
                      </Input>
                    </FormGroup>
                  )}
                  {((select && select.mov_typeOutflow === "Cuenta Bancaria") ||
                    (select &&
                      select.mov_typeOutflow ===
                        "Transferencias por dólares") ||
                    (select && select.mov_typeOutflow === "Pago Movil")) && (
                    <FormGroup>
                      <Label htmlFor="imageInput">Seleccionar Imagen:</Label>
                      <Input
                        type="file"
                        className="form-control-file"
                        id="imageInput"
                        disabled={payment === ""}
                        accept=".jpg,.jpeg,.png,.gif"
                        onChange={(e) => setMovImg(e.target.files[0])}
                      />
                    </FormGroup>
                  )}
                  {showCommentBox && (
                    <FormGroup>
                      <Label for="comment">Comentario</Label>
                      <Input
                        type="textarea"
                        name="comment"
                        id="comment"
                        onChange={(e) => setCommentReject(e.target.value)}
                      />
                    </FormGroup>
                  )}
                </ModalBody>
                <ModalFooter>
                  {!showCommentBox ? (
                    <>
                      <Button
                        color="danger"
                        onClick={() => setShowCommentBox(true)}
                      >
                        Rechazar
                      </Button>
                      <Button
                        color="success"
                        disabled={
                          ((select &&
                            select.mov_typeOutflow === "Cuenta Bancaria") ||
                            (select &&
                              select.mov_typeOutflow ===
                                "Transferencias por dólares") ||
                            (select &&
                              select.mov_typeOutflow === "Pago Movil")) &&
                          (payment === "" ||
                            bankOptionPay === "" ||
                            mov_img === "")
                        }
                        onClick={handleSubmitSendVerify}
                      >
                        Enviar
                      </Button>
                      <Button color="primary" onClick={toggleModalEgreso}>
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        color="warning"
                        onClick={(e) => {
                          handleSubmitCancel(e);
                          toggleModalEgreso();
                        }}
                      >
                        Enviar (Rechazado)
                      </Button>
                      <Button
                        color="secondary"
                        onClick={() => setShowCommentBox(false)}
                      >
                        Volver
                      </Button>
                      <Button color="primary" onClick={toggleModalEgreso}>
                        Cancelar
                      </Button>
                    </>
                  )}
                </ModalFooter>
              </Modal>

              {/* Modal De Imagen Movimientos */}
              <Modal
                isOpen={modalImageMov}
                size="lg"
                centered
                toggle={toggleImageMov}
              >
                <ModalHeader toggle={toggleImageMov}>
                  Verificación de imagen
                </ModalHeader>
                <ModalBody>
                  {select && select.mov_img.toLowerCase().includes(".pdf") && (
                    <a
                      href={`${url}/Movements/image/${select.mov_img}`}
                      target="_blank"
                      without
                      rel="noreferrer"
                      download
                    >
                      Descargar PDF
                    </a>
                  )}
                  {select && !select.mov_img.toLowerCase().includes(".pdf") && (
                    <img
                      style={{ width: "100%" }}
                      alt="ImageMovement"
                      src={`${url}/Movements/image/${select.mov_img}`}
                    />
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="secondary" onClick={toggleImageMov}>
                    Volver
                  </Button>
                </ModalFooter>
              </Modal>

              <ToastContainer />
            </>
          ) : admin.adm_role === "C" ? (
            <>
              <NavBarAdm />
              <div className="DashboardBody">
                <Container>
                  <center>
                    <h1 className="my-4">Panel de control</h1>
                  </center>
                  <Row>
                    <Col>
                      <Col md="6" lg="4">
                        <Link to="/UserNoVerificated">
                          <div className="stat-box unverified-users">
                            <h2>Usuario sin verificación</h2>
                            <p>
                              {user ? (
                                user.filter((user) => user.use_verif === "E")
                                  .length
                              ) : (
                                <b>No hay usuarios</b>
                              )}
                            </p>
                          </div>
                        </Link>
                      </Col>
                      <Col md="6" lg="3">
                        <Link to="/UserNyVerificated">
                          <div className="stat-box verified-users">
                            <h2>U. Sin documentos</h2>
                            <p>
                              {user ? (
                                user.filter((user) => user.use_verif === "N")
                                  .length
                              ) : (
                                <b>No hay usuarios</b>
                              )}
                            </p>
                          </div>
                        </Link>
                      </Col>

                      <table className="transaction-table">
                        <thead>
                          <tr>
                            <th>Usuario</th>
                            <th>Moneda</th>
                            <th>Monto</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Tipo</th>
                            <th>Detalles</th>
                          </tr>
                        </thead>
                        <tbody>
                          {movements
                            .filter(
                              (mov) =>
                                mov.mov_status === "E" &&
                                mov.mov_type !== "Retiro"
                            )
                            .map((move) => (
                              <tr key={move.mov_id}>
                                <td>
                                  {move.User.use_name} {move.User.use_lastName}
                                </td>
                                <td>{move.mov_currency}</td>
                                <td>{move.mov_amount}</td>
                                <td>{move.mov_date}</td>
                                <td>
                                  {move.mov_status === "E" && (
                                    <FaClock className="pending-icon" />
                                  )}
                                </td>
                                <td>
                                  {move.mov_type === "Deposito" ? (
                                    <FaArrowDown color="green" />
                                  ) : null}
                                  {move.mov_type === "Retiro" ? (
                                    <FaArrowUp color="red" />
                                  ) : null}
                                </td>
                                <td>
                                  <button
                                    className="details-button"
                                    onClick={() => toggle(move)}
                                  >
                                    Ver detalles
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </Col>
                  </Row>
                  <Row>
                    {/* Lógica para aprobar o rechazar ingresos específica para el rol "B" */}
                  </Row>
                  <Modal
                    centered
                    isOpen={modalIngreso}
                    size="lg"
                    toggle={toggleModalIngreso}
                  >
                    <ModalHeader toggle={toggleModalIngreso}>
                      Verificar Ingreso
                    </ModalHeader>
                    <ModalBody>
                      <Row>
                        <Col>
                          <h5>Usuario</h5>
                          {select && (
                            <>
                              <p>
                                {select.User.use_name}{" "}
                                {select.User.use_lastName}
                              </p>
                              <p>{select.User.use_email}</p>
                              <p>{select.User.use_dni}</p>
                            </>
                          )}
                        </Col>
                        <Col>
                          <h5>Transacción</h5>
                          {select && (
                            <>
                              <p>{select.mov_date}</p>
                              <p>{select.mov_amount}</p>
                              <p>{select.mov_currency}</p>
                              {select.mov_phone ? (
                                <p>Telefono {select.mov_phone}</p>
                              ) : null}

                              {select.mov_code ? (
                                <p>Codigo de retiro {select.mov_code}</p>
                              ) : null}
                            </>
                          )}
                          <Button
                            color="primary"
                            onClick={() => {
                              toggleImageMov();
                            }}
                          >
                            Ver Imagen
                          </Button>
                        </Col>
                      </Row>
                    </ModalBody>
                    <ModalFooter>
                      {select && (
                        <Button color="success" onClick={handleSubmitVerify}>
                          Aprobar
                        </Button>
                      )}
                      {select && (
                        <Button
                          color="danger"
                          onClick={async (e) => {
                            setIsLoadingVerify(true);
                            await handleSubmitCancel(e);
                            toggleModalIngreso();
                            setIsLoadingVerify(false);
                          }}
                          disabled={isLoadingVerify}
                        >
                          Rechazar
                        </Button>
                      )}
                      <Button
                        color="secondary"
                        onClick={toggleModalIngreso}
                        disabled={isLoadingVerify}
                      >
                        Volver
                      </Button>
                    </ModalFooter>
                  </Modal>

                  <Modal
                    isOpen={modalImageMov}
                    size="lg"
                    centered
                    toggle={toggleImageMov}
                  >
                    <ModalHeader toggle={toggleImageMov}>
                      Verificación de imagen
                    </ModalHeader>
                    <ModalBody>
                      {select && (
                        <img
                          style={{ width: "100%" }}
                          alt="ImageMovement"
                          src={`${url}/Movements/image/${select.mov_img}`}
                          // Agregar el encabezado 'Authorization' con el token Bearer del administrador
                          headers={{
                            Authorization: `Bearer ${accessAdminToken.access_token}`,
                          }}
                        />
                      )}
                    </ModalBody>
                    <ModalFooter>
                      <Button color="secondary" onClick={toggleImageMov}>
                        Volver
                      </Button>
                    </ModalFooter>
                  </Modal>
                </Container>
              </div>

              {/* Aquí puedes agregar otros elementos específicos para el rol "B" */}
            </>
          ) : admin.adm_role === "B" ? (
            <>
              <NavBarAdm />
              <div className="DashboardBody">
                <Container>
                  <center>
                    <h1 className="my-4">Panel de control</h1>
                  </center>
                  <Row>
                    <Col>
                      <table
                        success
                        bordered
                        hover
                        responsive
                        striped
                        className="transaction-table "
                      >
                        <thead>
                          <tr>
                            <th>Usuario</th>
                            <th>Moneda</th>
                            <th>Monto</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Tipo</th>
                            <th>Detalles</th>
                          </tr>
                        </thead>
                        <tbody>
                          {movements
                            .filter(
                              (mov) =>
                                mov.mov_status === "E" &&
                                mov.mov_type === "Retiro"
                            )
                            .map((move) => (
                              <tr key={move.mov_id}>
                                <td>
                                  {move.User.use_name} {move.User.use_lastName}
                                </td>
                                <td>{move.mov_currency}</td>
                                <td>{move.mov_amount}</td>
                                <td>{move.mov_date}</td>
                                <td>
                                  {move.mov_status === "E" && (
                                    <FaClock className="pending-icon" />
                                  )}
                                </td>
                                <td>
                                  {move.mov_type === "Retiro" ? (
                                    <FaArrowUp color="red" />
                                  ) : null}
                                </td>
                                <td>
                                  <button
                                    className="details-button"
                                    onClick={() => toggle(move)}
                                  >
                                    Ver detalles
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </Col>
                  </Row>
                  <Row></Row>

                  <Modal
                    centered
                    isOpen={modalEgreso}
                    toggle={() => setModalEgreso(false)}
                  >
                    <ModalHeader toggle={() => setModalEgreso(false)}>
                      Generar retiro
                    </ModalHeader>
                    <ModalBody>
                      <Alert color="success">
                        <h4 className="alert-heading">Datos bancarios:</h4>
                        <p
                          dangerouslySetInnerHTML={{
                            __html:
                              select &&
                              select.mov_comment.replace(/\n/g, "<br/>"),
                          }}
                        />
                      </Alert>
                      {select && (
                        <FormGroup>
                          <Label for="amount">
                            {(select &&
                              select.mov_typeOutflow === "Cuenta Bancaria") ||
                            (select &&
                              select.mov_typeOutflow ===
                                "Transferencias por dólares") ||
                            (select && select.mov_typeOutflow === "Pago Movil")
                              ? "Monto a transferir"
                              : "Monto a Entregar"}
                          </Label>
                          <Input
                            type="text"
                            name="amount"
                            id="amount"
                            disabled
                            defaultValue={
                              select &&
                              select.mov_currency === "USD" &&
                              select.mov_typeOutflow !== "Efectivo"
                                ? parseFloat(select.mov_amount) *
                                  parseFloat(currencyPrice.cur_UsdToBs)
                                : select.mov_currency === "EUR" &&
                                  select.mov_typeOutflow !== "Efectivo"
                                ? parseFloat(select.mov_amount) *
                                  parseFloat(currencyPrice.cur_EurToBs)
                                : select.mov_currency === "GBP" &&
                                  select.mov_typeOutflow !== "Efectivo"
                                ? parseFloat(select.mov_amount) *
                                  parseFloat(currencyPrice.cur_GbpToBs)
                                : select.mov_amount
                            }
                          />
                        </FormGroup>
                      )}
                      {((select &&
                        select.mov_typeOutflow === "Cuenta Bancaria") ||
                        (select &&
                          select.mov_typeOutflow ===
                            "Transferencias por dólares") ||
                        (select &&
                          select.mov_typeOutflow === "Pago Movil")) && (
                        <FormGroup>
                          <Label for="currency">Elige la Moneda</Label>
                          <Input
                            type="select"
                            id="payment"
                            defaultValue={payment}
                            onChange={(e) => setPayment(e.target.value)}
                          >
                            <option value="">Selecciona una opción</option>
                            <option value="BS">Bolívar</option>
                            <option value="USD">Dólar</option>
                          </Input>
                        </FormGroup>
                      )}
                      {((select &&
                        select.mov_typeOutflow === "Cuenta Bancaria") ||
                        (select &&
                          select.mov_typeOutflow ===
                            "Transferencias por dólares") ||
                        (select &&
                          select.mov_typeOutflow === "Pago Movil")) && (
                        <FormGroup>
                          <Label>Selecciona el Banco a transferir</Label>
                          <Input
                            type="select"
                            id="bankOptionPaySelect"
                            defaultValue={bankOptionPay}
                            disabled={payment === ""}
                            onChange={(e) => {
                              setBankOptionPay(e.target.value);
                            }}
                          >
                            <option value="">Selecciona una opción</option>
                            {payment === "BS"
                              ? banksBs
                                  .filter(
                                    (bank) => bank.accbs_status === "Activo"
                                  )
                                  .map((bank) => {
                                    return bank.accbs_bank ? (
                                      <option value={bank.accbs_id}>
                                        {bank.accbs_bank} ({bank.accbs_owner})
                                      </option>
                                    ) : null;
                                  })
                              : payment === "USD"
                              ? banksUSD
                                  .filter(
                                    (bank) => bank.accusd_status === "Activo"
                                  )
                                  .map((bank) => {
                                    return bank.accusd_Bank ? (
                                      <option value={bank.accusd_id}>
                                        {bank.accusd_Bank} ({bank.accusd_owner})
                                      </option>
                                    ) : null;
                                  })
                              : null}
                          </Input>
                        </FormGroup>
                      )}
                      {((select &&
                        select.mov_typeOutflow === "Cuenta Bancaria") ||
                        (select &&
                          select.mov_typeOutflow ===
                            "Transferencias por dólares") ||
                        (select &&
                          select.mov_typeOutflow === "Pago Movil")) && (
                        <FormGroup>
                          <Label htmlFor="imageInput">
                            Seleccionar Imagen:
                          </Label>
                          <Input
                            type="file"
                            className="form-control-file"
                            id="imageInput"
                            disabled={payment === ""}
                            accept=".jpg,.jpeg,.png,.gif"
                            onChange={(e) => setMovImg(e.target.files[0])}
                          />
                        </FormGroup>
                      )}
                      {showCommentBox && (
                        <FormGroup>
                          <Label for="comment">Comentario</Label>
                          <Input
                            type="textarea"
                            name="comment"
                            id="comment"
                            onChange={(e) => setCommentReject(e.target.value)}
                          />
                        </FormGroup>
                      )}
                    </ModalBody>
                    <ModalFooter>
                      {!showCommentBox ? (
                        <>
                          <Button
                            color="danger"
                            onClick={() => setShowCommentBox(true)}
                          >
                            Rechazar
                          </Button>
                          <Button
                            color="success"
                            disabled={
                              ((select &&
                                select.mov_typeOutflow === "Cuenta Bancaria") ||
                                (select &&
                                  select.mov_typeOutflow ===
                                    "Transferencias por dólares") ||
                                (select &&
                                  select.mov_typeOutflow === "Pago Movil")) &&
                              (payment === "" ||
                                bankOptionPay === "" ||
                                mov_img === "")
                            }
                            onClick={handleSubmitSendVerify}
                          >
                            Enviar
                          </Button>
                          <Button color="primary" onClick={toggleModalEgreso}>
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            color="warning"
                            onClick={(e) => {
                              handleSubmitCancel(e);
                              toggleModalEgreso();
                            }}
                          >
                            Enviar (Rechazado)
                          </Button>
                          <Button
                            color="secondary"
                            onClick={() => setShowCommentBox(false)}
                          >
                            Volver
                          </Button>
                          <Button color="primary" onClick={toggleModalEgreso}>
                            Cancelar
                          </Button>
                        </>
                      )}
                    </ModalFooter>
                  </Modal>
                </Container>
              </div>
            </>
          ) : (
            <NotFound404 />
          )}
        </>
      )}
    </div>
  );
}

export { Dashboard };
