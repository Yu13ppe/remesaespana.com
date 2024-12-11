import React, { useState, useEffect, useCallback } from "react";
import { useDataContext } from "../Context/dataContext";
import {
  InputGroup,
  Input,
  Button,
  Label,
  FormGroup,
  Form,
  Modal,
  ModalHeader,
  ModalBody,
  Alert,
  FormFeedback,
  Table,
  ModalFooter,
  Spinner,
} from "reactstrap";
import { FaExclamationCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import changes from "../Assets/Images/changes.png";
import Spain from "../Assets/Images/spain.png";
import Uk from "../Assets/Images/uk.png";
import Usa from "../Assets/Images/usa.png";
import Venezuela from "../Assets/Images/venezuela.png";
import VerificationImage from "../Assets/Images/verification.png";
import ImageVerification from "../Assets/Images/ImageVerification.png";
import DniVerification from "../Assets/Images/DniVerification.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavBar } from "../Components/NavBar";
import { NotFound404 } from "../Pages/NotFound404";
import { FixeedAlert } from "../Components/FixeedAlert";
import {
  FaPercentage,
  FaMapMarkerAlt,
  FaTruck,
  FaBuilding,
} from "react-icons/fa"; // Importa los iconos necesarios
import { clearLocalStorage } from "../Hooks/useLocalStorage";

function Changes() {
  const [modalOpen, setModalOpen] = useState(false);
  const [secondModalOpen, setSecondModalOpen] = useState(false);
  const [tridModalOpen, setTridModalOpen] = useState(false);
  const [forthModalOpen, setForthModalOpen] = useState(false);
  const [fifthModalOpen, setFifthModalOpen] = useState(false);
  const [sixModalOpen, setSixModalOpen] = useState(false);
  const [receiveAmount, setReceiveAmount] = useState(0);
  const [receiveUsdAmount, setReceiveUsdAmount] = useState(0);
  const [receiveUsdAmountBofa, setReceiveUsdAmountBofa] = useState(0);
  const [bankOptionPay, setBankOptionPay] = useState("");
  const [note, setNote] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [use_dni, setUseDNI] = useState("");
  const [use_phone, setUsePhone] = useState("");
  const [use_img, setUseImg] = useState("");
  const [termsCheckbox, setTermsCheckbox] = useState(false);
  const [banksEUR, setBanksEUR] = useState([]);
  const [banksGBP, setBanksGBP] = useState([]);
  const [banksUSD, setBanksUSD] = useState([]);
  const [user, setUser] = useState([]);
  const [use_imgDni, setUseImgDni] = useState("");
  const { logged, accessToken, url } = useDataContext();
  const [mov_img, setMov_img] = useState("");
  const [payment, setPayment] = useState("");
  const [sendOption, setSendOption] = useState("");
  const [accNumber, setAccNumber] = useState("");
  const [accBank, setAccBank] = useState("");
  const [accOwner, setAccOwner] = useState("");
  const [accTlf, setAccTlf] = useState("");
  const [accDni, setAccDni] = useState("");
  const [showAccNumber, setShowAccNumber] = useState(false);
  const [porcents, setPorcents] = useState([]);
  const [porcent, setPorcent] = useState(null);
  const [delivery, setDelivery] = useState("");
  const [length, setLength] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showConfirmationr, setShowConfirmationr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmationMobile, setShowConfirmationMobile] = useState(false);
  const [showConfirmationCash, setShowConfirmationCash] = useState(false);
  const [showConfirmationBank, setShowConfirmationBank] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [setSelectedPorcent] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedIdAccount, setSelectedIdAccount] = useState("");
  const [currencyPrice, setCurrencyPrice] = useState([]);
  const [cash, setCash] = useState('');
  const [cashPhone, setCashPhone] = useState('');

  const fetchAccounts = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/AccBsUser/user/${user.use_id}`, {
        headers: {
          Authorization: `Bearer ${accessToken.access_token}`,
        },
      });
      setAccounts(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [user, accessToken, url]);

  const fetchCurrencyData = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/currencyPrice`);
      setCurrencyPrice(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [setCurrencyPrice, url]); // Agregar setCurrencyPrice como dependencia

  useEffect(() => {
    if (user.use_id) {
      fetchAccounts();
    }
  }, [user, fetchAccounts]);

  const clearLocal = () => {
    clearLocalStorage();
    setTimeout(() => {
      window.location.href = "/Login";
    }, 500);
  };

  const fetchDataPorcentId = async (id) => {
    try {
      const response = await axios.get(`${url}/PorcentPrice/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken.access_token}`,
        },
      });
      setPorcent(response.data);
      setSelectedPorcent(response.data); // Agregar esta línea para seleccionar el porcentaje
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (sendOption === "Efectivo" && sendAmount !== "" && porcent) {
      const selectedPercentage =
        payment === "EUR"
          ? porcent.por_porcentEur
          : payment === "USD"
          ? porcent.por_porcentUsd
          : payment === "GBP"
          ? porcent.por_porcentGbp
          : 0; // Ajusta según las monedas que necesites

      const amountToDebit =
        parseFloat(sendAmount) +
        parseFloat(sendAmount) * (selectedPercentage / 100);
      setReceiveAmount(amountToDebit);

      if (payment === "EUR") {
        setReceiveUsdAmount(amountToDebit + porcent.por_deliveryPrice);
      } else {
        setReceiveUsdAmount(amountToDebit);
      }
    }

    async function fetchData() {
      try {
        const response = await axios.get(`${url}/PorcentPrice`, {
          headers: {
            Authorization: `Bearer ${accessToken.access_token}`,
          },
        });

        // Procesar la respuesta y almacenarla en el estado
        if (response.status === 200) {
          setApiData(response.data);
        } else {
          // Manejar errores o mostrar un mensaje de error
          console.error("Hubo un problema al obtener los datos.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    // Llama a la función fetchData
    fetchData();
  }, [sendOption, sendAmount, porcent, payment, url, accessToken]);

  const toggleSixModal = () => {
    setSixModalOpen(!sixModalOpen);
  };

  const toggleTridModal = () => {
    setTridModalOpen(!tridModalOpen);
    setPayment("");
    setReceiveAmount("");
    setSendOption("");
    setSendAmount("");
    setBankOptionPay("");
    setDelivery("");
    setPayment("");
    setNote("");
  };
  const toggleforthModal = () => {
    setForthModalOpen(!forthModalOpen);
    setPayment("");
    setSendAmount("");
    setBankOptionPay("");
  };

  const toggleSecondModal = () => {
    setModalOpen(false);
    setSecondModalOpen(!secondModalOpen);
    document.body.style.paddingRight = "0";
  };
  const toggleFifthModal = () => {
    setSecondModalOpen(false);
    setFifthModalOpen(!fifthModalOpen);
    document.body.style.paddingRight = "0";
  };

  const fetchDataPorcent = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/PorcentPrice`, {
        headers: {
          Authorization: `Bearer ${accessToken.access_token}`,
        },
      });
      setPorcents(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [url, accessToken]);

  const fetchDataAccEur = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Acceur`, {
        headers: {
          Authorization: `Bearer ${accessToken.access_token}`,
        },
      });
      setBanksEUR(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [url, accessToken]);

  const fetchDataAccGbp = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/AccGbp`, {
        headers: {
          Authorization: `Bearer ${accessToken.access_token}`,
        },
      });
      setBanksGBP(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [url, accessToken]);

  const fetchDataAccUsd = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/AccUsd`, {
        headers: {
          Authorization: `Bearer ${accessToken.access_token}`,
        },
      });
      setBanksUSD(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [url, accessToken]);
  const fetchDataUser = useCallback(async () => {
    try {
      const response = await axios.get(
        `${url}/Auth/findByToken/${accessToken.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken.access_token}`,
          },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [setUser, accessToken, url]);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  useEffect(() => {
    const toggleModal = () => {
      setModalOpen(!modalOpen);
    };

    const showUserStatusAlert = (userStatus) => {
      if (userStatus === "N") {
        setAlertMessage(
          <span style={{ cursor: "pointer" }} onClick={toggleModal}>
            Usuario no verificado ¡Haz click aquí para verificarte!
          </span>
        );
        setAlertType("error");
      } else if (userStatus === "E") {
        setAlertMessage("Usuario en proceso de verificación");
        setAlertType("info");
      } else if (userStatus === "S") {
        setAlertMessage("Usuario verificado");
        setAlertType("success");
      }
      setShowAlert(true);
    };

    fetchDataAccEur();
    fetchDataAccGbp();
    fetchDataAccUsd();
    fetchDataUser();
    fetchDataPorcent();
    fetchCurrencyData();
    showUserStatusAlert(user.use_verif);
  }, [
    fetchDataUser,
    user,
    fetchDataAccEur,
    fetchDataAccGbp,
    fetchDataAccUsd,
    fetchDataPorcent,
    fetchCurrencyData,
    modalOpen,
    setModalOpen,
  ]);

  const handleAmountChange = (e) => {
    const inputAmount = e.target.value;
    setSendAmount(inputAmount);

    currencyPrice.forEach((coin) => {
      if (payment === "EUR") {
        setReceiveAmount(parseFloat(inputAmount) * coin.cur_EurToBs);
        if (sendOption === "Efectivo" && porcent.por_status === "Obligatorio") {
          setReceiveUsdAmount(
            parseFloat(inputAmount) +
              (parseFloat(inputAmount) *
                (parseFloat(porcent.por_porcentEur) / 100) +
                porcent.por_deliveryPrice)
          );
        }
        if (
          sendOption === "Efectivo" &&
          porcent.por_status === "No obligatorio"
        ) {
          setReceiveUsdAmount(
            parseFloat(inputAmount) +
              (parseFloat(inputAmount) *
                (parseFloat(porcent.por_porcentEur) / 100) +
                parseFloat(delivery))
          );
        }
        if (sendOption === "Efectivo" && porcent.por_status === "Oficina") {
          setReceiveUsdAmount(
            parseFloat(inputAmount) +
              parseFloat(inputAmount) *
                (parseFloat(porcent.por_porcentEur) / 100)
          );
        }
      } else if (payment === "GBP") {
        setReceiveAmount(parseFloat(inputAmount) * coin.cur_GbpToBs);
        if (sendOption === "Efectivo" && porcent.por_status === "Obligatorio") {
          setReceiveUsdAmount(
            parseFloat(inputAmount) +
              (parseFloat(inputAmount) *
                (parseFloat(porcent.por_porcentGbp) / 100) +
                porcent.por_deliveryPrice)
          );
        }
        if (
          sendOption === "Efectivo" &&
          porcent.por_status === "No obligatorio"
        ) {
          setReceiveUsdAmount(
            parseFloat(inputAmount) +
              (parseFloat(inputAmount) *
                (parseFloat(porcent.por_porcentGbp) / 100) +
                parseFloat(delivery))
          );
        }
        if (sendOption === "Efectivo" && porcent.por_status === "Oficina") {
          setReceiveUsdAmount(
            parseFloat(inputAmount) +
              parseFloat(inputAmount) *
                (parseFloat(porcent.por_porcentGbp) / 100)
          );
        }
      } else if (payment === "USD") {
        setReceiveAmount(parseFloat(inputAmount) * coin.cur_UsdToBs);
        if (sendOption === "Efectivo" && porcent.por_status === "Obligatorio") {
          setReceiveUsdAmount(
            parseFloat(inputAmount) +
              (parseFloat(inputAmount) *
                (parseFloat(porcent.por_porcentUsd) / 100) +
                porcent.por_deliveryPrice)
          );
        }
        if (
          sendOption === "Efectivo" &&
          porcent.por_status === "No obligatorio"
        ) {
          setReceiveUsdAmount(
            parseFloat(inputAmount) +
              (parseFloat(inputAmount) *
                (parseFloat(porcent.por_porcentUsd) / 100) +
                parseFloat(delivery))
          );
        }
        if (sendOption === "Efectivo" && porcent.por_status === "Oficina") {
          setReceiveUsdAmount(
            parseFloat(inputAmount) +
              parseFloat(inputAmount) *
                (parseFloat(porcent.por_porcentUsd) / 100)
          );
        }
      }
    });
  };

  const handleAmountChangeBs = (e) => {
    const inputAmount = e.target.value;
    setSendAmount(inputAmount);

    currencyPrice.forEach((coin) => {
      if (payment === "EUR") {
        setReceiveAmount(parseFloat(inputAmount) * coin.cur_EurToBs);
      } else if (payment === "GBP") {
        setReceiveAmount(parseFloat(inputAmount) * coin.cur_GbpToBs);
      } else if (payment === "USD") {
        setReceiveAmount(parseFloat(inputAmount) * coin.cur_UsdToBs);
      }
    });
  };

  const handleAmountChangeUsd = (e) => {
    const inputAmount = e.target.value;
    setSendAmount(inputAmount);

    currencyPrice.forEach((coin) => {
      if (payment === "EUR") {
        setReceiveUsdAmountBofa(
          parseFloat(inputAmount) -
            parseFloat(inputAmount) * (coin.cur_EurToUsd / 100)
        );
      } else if (payment === "GBP") {
        setReceiveUsdAmountBofa(
          parseFloat(inputAmount) +
            parseFloat(inputAmount) * (coin.cur_GbpToUsd / 100)
        );
      }
    });
  };
  const sendApprovalNotification = async () => {
    try {
      await axios.post(
        `${url}/Mailer/pendantTransfer/Recibirnotificacionesdeaprobacion@hotmail.com`
      );
      console.log("Approval notification sent successfully");
    } catch (error) {
      console.error("Error sending approval notification:", error);
    }
  };

  // Función para enviar notificaciones de pago
  const sendPaymentNotification = async () => {
    try {
      await axios.post(
        `${url}/Mailer/pendantTransfer/Recibirnotificacionesdepago@hotmail.com`
      );
      console.log("Payment notification sent successfully");
    } catch (error) {
      console.error("Error sending payment notification:", error);
    }
  };

  //Enviar a espera una carga
  const handleSubmitLoad = async (event) => {
    event.preventDefault();

    const findBankName = () => {
      if (payment === "USD") {
        const bank = banksUSD.find(
          (bank) => bank.accusd_id === parseInt(bankOptionPay)
        );
        if (bank) {
          return bank.accusd_Bank;
        }
      }
      if (payment === "EUR") {
        const bank = banksEUR.find(
          (bank) => bank.acceur_id === parseInt(bankOptionPay)
        );
        if (bank) {
          return bank.acceur_Bank;
        }
      }
      if (payment === "GBP") {
        const bank = banksGBP.find(
          (bank) => bank.accgbp_id === parseInt(bankOptionPay)
        );
        if (bank) {
          return bank.accgbp_Bank;
        }
      }
    };

    const formData = new FormData();
    formData.append("mov_currency", payment);
    formData.append("mov_amount", sendAmount);
    formData.append("mov_type", "Deposito");
    formData.append("mov_status", "E");
    formData.append("mov_comment", findBankName());
    formData.append("mov_code", cash);
    formData.append("mov_phone", cashPhone);
    formData.append("mov_img", mov_img);
    formData.append(
      "mov_accEurId",
      payment === "EUR" ? parseInt(bankOptionPay) : 0
    );
    formData.append(
      "mov_accUsdId",
      payment === "USD" ? parseInt(bankOptionPay) : 0
    );
    formData.append(
      "mov_accGbpId",
      payment === "GBP" ? parseInt(bankOptionPay) : 0
    );
    formData.append("mov_userId", user.use_id);

    try {
      setLoading(true);
      axios.post(`${url}/Movements/create`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken.access_token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      await sendApprovalNotification();

      toggleforthModal();
      toast.success(
        "Cambio realizado con exito!, En un momento se vera reflejado tu ingreso en la plataforma",
        {
          position: "bottom-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );

      setShowConfirmationr(false);

      console.log("Request sent successfully");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  //Enviar a espera un retiro
  const handleSubmitSend = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("mov_currency", payment);
    formData.append("mov_amount", sendAmount);
    formData.append("mov_type", "Retiro");
    formData.append("mov_status", "E");
    const selectedAccount = accounts.find(
      (account) =>
        parseInt(account.accbsUser_id) === parseInt(selectedIdAccount)
    );
    formData.append(
      "mov_comment",
      `${
        (sendOption === "Cuenta Bancaria" || sendOption === "Pago Movil") &&
        `Banco: ` +
          selectedAccount.accbsUser_bank +
          `\n Propietario: ` +
          selectedAccount.accbsUser_owner +
          `\n Número de cuenta: ` +
          selectedAccount.accbsUser_number +
          `\n DNI: ` +
          selectedAccount.accbsUser_dni +
          `\n Teléfono: ` +
          selectedAccount.accbsUser_phone +
          `\n Tipo de cuenta: ` +
          selectedAccount.accbsUser_type +
          `\n` +
          sendOption
      } ${
        sendOption === "Transferencias por dólares" &&
        accNumber + accBank + accOwner + accTlf + accDni + sendOption
      } ${
        sendOption === "Efectivo" && porcent
          ? `\n` +
            porcent.por_stateLocation +
            `\n` +
            accNumber +
            accBank +
            accOwner +
            accTlf +
            accDni +
            `\n`
          : ""
      } ${
        sendOption === "Efectivo" && porcent.por_comment !== ""
          ? porcent.por_comment + "\n"
          : ""
      }` + note
    );
    formData.append("mov_img", "Retiro de Divisa");
    formData.append("mov_typeOutflow", sendOption);
    formData.append("mov_accEurId", payment === "EUR" ? 99 : 0);
    formData.append("mov_accUsdId", payment === "USD" ? 99 : 0);
    formData.append("mov_accGbpId", payment === "GBP" ? 99 : 0);
    formData.append("mov_userId", user.use_id);

    const formDataUser = new FormData();
    if (sendOption === "Efectivo") {
      formDataUser.append(
        "use_amountUsd",
        payment === "USD"
          ? user.use_amountUsd - receiveUsdAmount
          : user.use_amountUsd
      );
      formDataUser.append(
        "use_amountGbp",
        payment === "GBP"
          ? user.use_amountGbp - receiveUsdAmount
          : user.use_amountGbp
      );
      formDataUser.append(
        "use_amountEur",
        payment === "EUR"
          ? user.use_amountEur - receiveUsdAmount
          : user.use_amountEur
      );
    } else {
      formDataUser.append(
        "use_amountUsd",
        payment === "USD" ? user.use_amountUsd - sendAmount : user.use_amountUsd
      );
      formDataUser.append(
        "use_amountGbp",
        payment === "GBP" ? user.use_amountGbp - sendAmount : user.use_amountGbp
      );
      formDataUser.append(
        "use_amountEur",
        payment === "EUR" ? user.use_amountEur - sendAmount : user.use_amountEur
      );
    }

    try {
      setLoading(true);
      axios.post(`${url}/Movements/create`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken.access_token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      await sendPaymentNotification();
      await sendApprovalNotification();

      await axios.put(`${url}/Users/${user.use_id}`, formDataUser, {
        headers: {
          Authorization: `Bearer ${accessToken.access_token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toggleTridModal();
      toast.success(
        "Cambio realizado con exito!, En un momento tu egreso será procesado",
        {
          position: "bottom-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );

      setShowConfirmationMobile(false);
      setShowConfirmationBank(false);
      setShowConfirmationCash(false);

      console.log("Request sent successfully");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Verificacion DNI
  const handleSubmitVerifyDni = () => {
    const formData = new FormData();
    formData.append("use_imgDni", use_imgDni);

    try {
      axios.put(`${url}/Users/dni/${user.use_id}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken.access_token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Request edit successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Verificacion User
  const handleSubmitVerify = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("use_dni", use_dni);
    formData.append("use_img", use_img);
    formData.append("use_phone", use_phone);
    formData.append("use_verif", "E");

    try {
      await axios.put(`${url}/Users/${user.use_id}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken.access_token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      handleSubmitVerifyDni();
      toggleSecondModal();
      toast.success(
        "¡Datos enviados con exito!. En minutos un administrador verificará tus datos",
        {
          position: "bottom-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );

      console.log("Request edit successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <div className="changesContainer">
        {logged ? (
          user.use_verif === "S" ? (
            <div style={{ height: "100vh" }}>
              <NavBar />
              <img className="changesMen" alt="changesMen" src={changes} />
              <div className="textchanges">
                <h2>
                  Hola {user.use_name} {user.use_lastName}
                </h2>
                <h3>
                  ${user.use_amountUsd ? user.use_amountUsd : 0} | €
                  {user.use_amountEur ? user.use_amountEur : 0} | £
                  {user.use_amountGbp ? user.use_amountGbp : 0}
                </h3>
                <h6 style={{ color: "#686868" }}>Disponible</h6>
              </div>

              {/* Cambios */}
              <div className="changes">
                {/* Spain - Bs */}
                <InputGroup className="Change-Input1">
                  <Button>
                    <img src={Spain} width={45} alt="Spain" /> Eur
                  </Button>
                  <Input
                    disabled
                    className="centered-input"
                    placeholder={
                      "1  =  " + currencyPrice.map((coin) => coin.cur_EurToBs)
                    }
                  />
                  <Button>
                    Bs <img src={Venezuela} alt="Venezuela" width={45} />
                  </Button>
                </InputGroup>

                {/* Uk - Bs */}
                <InputGroup className="Change-Input1">
                  <Button>
                    <img src={Uk} width={45} alt="Uk" /> Gbp
                  </Button>
                  <Input
                    disabled
                    className="centered-input"
                    placeholder={
                      "1  =  " + currencyPrice.map((coin) => coin.cur_GbpToBs)
                    }
                  />
                  <Button>
                    Bs <img src={Venezuela} alt="Venezuela" width={45} />
                  </Button>
                </InputGroup>

                {/* Usa - Bs */}
                <InputGroup className="Change-Input1">
                  <Button>
                    <img src={Usa} alt="Usa" width={45} /> Usd
                  </Button>
                  <Input
                    disabled
                    className="centered-input"
                    placeholder={
                      "1  =  " + currencyPrice.map((coin) => coin.cur_UsdToBs)
                    }
                  ></Input>
                  <Button>
                    Bs <img src={Venezuela} alt="Venezuela" width={45} />
                  </Button>
                </InputGroup>
                {/* Eur - Usd */}
                <InputGroup className="Change-Input1">
                  <Button>
                    <img src={Spain} alt="Spain" width={45} /> Eur
                  </Button>
                  <Input
                    disabled
                    className="centered-input"
                    placeholder={
                      currencyPrice.map((coin) => coin.cur_EurToUsd) + "%"
                    }
                  ></Input>
                  <Button>
                    Usd <img src={Usa} alt="Venezuela" width={45} />
                  </Button>
                </InputGroup>
                {/* Gbp - Usd */}
                <InputGroup className="Change-Input1">
                  <Button>
                    <img src={Uk} alt="Gbp" width={45} /> Gbp
                  </Button>
                  <Input
                    disabled
                    className="centered-input"
                    placeholder={
                      currencyPrice.map((coin) => coin.cur_GbpToUsd) + "%"
                    }
                  ></Input>
                  <Button>
                    Usd <img src={Usa} alt="Usa" width={45} />
                  </Button>
                </InputGroup>

                {/* Spain - Usa */}
                <InputGroup className="Change-Input1" onClick={toggleSixModal}>
                  <Button style={{ backgroundColor: "#cfd" }}>
                    <img src={Spain} alt="Spain" width={45} /> Eur
                  </Button>
                  <Input
                    style={{
                      cursor: "pointer",
                      color: "transparent",
                      backgroundColor: "#cfd",
                    }}
                    value=""
                    className="centered-input"
                    placeholder="Consultar estado de entrega por efectivo"
                    onClick={toggleSixModal}
                  ></Input>
                  <Button style={{ backgroundColor: "#cfd" }}>
                    Usd <img src={Usa} alt="Usa" width={45} />
                  </Button>
                </InputGroup>

                {/* Buttons */}
                <InputGroup className="changesBtn">
                  <div className="Btn">
                    <Button color="primary" onClick={toggleforthModal}>
                      Recargar
                    </Button>
                    <Button color="success" onClick={toggleTridModal}>
                      Retirar
                    </Button>
                  </div>
                </InputGroup>
              </div>

              {/* Retirar */}
              <Modal
                isOpen={tridModalOpen}
                size="xl"
                centered
                toggle={toggleTridModal}
              >
                <ModalHeader toggle={toggleTridModal}>
                  Ingresa tus datos bancarios
                </ModalHeader>
                <ModalBody>
                  <Form>
                    {/* Seleccionar Moneda a debitar */}
                    <FormGroup>
                      <Label>Selecciona el tipo de moneda a retirar</Label>
                      <Input
                        type="select"
                        id="payment"
                        defaultValue={payment}
                        onChange={(e) => setPayment(e.target.value)}
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="EUR">Euro</option>
                        <option value="GBP">Libra Esterlina</option>
                        <option value="USD">Dolar</option>
                      </Input>
                    </FormGroup>

                    {/* Seleccionar Metodo de recibo */}
                    <FormGroup>
                      <Label>Ingresa tus datos bancarios</Label>
                      <Input
                        type="select"
                        id="bankOptionSelect"
                        defaultValue={sendOption}
                        disabled={payment === ""}
                        onChange={(e) => {
                          setSendOption(e.target.value);
                          setShowAccNumber(
                            e.target.value === "Cuenta Bancaria"
                          );
                          console.log(showAccNumber);
                        }}
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="Efectivo">Efectivo (Dolares)</option>
                        <option value="Cuenta Bancaria">Cuenta Bancaria</option>
                        <option value="Pago Movil">Pago Móvil</option>
                        <option value="Transferencias por dólares">
                          Transferencias por dólares
                        </option>
                      </Input>
                    </FormGroup>

                    {/* SendOption en Efectivo */}
                    {/* Seleccionar Lugar de Retiro */}
                    {sendOption === "Transferencias por dólares" && (
                      <div>
                        <FormGroup>
                          <Label>Titular</Label>
                          <Input
                            type="text"
                            id="titular"
                            onChange={(e) =>
                              setAccOwner(`Titular: ${e.target.value} \n`)
                            }
                            placeholder="Nombre del titular"
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label>Banco</Label>
                          <Input
                            type="text"
                            id="banco"
                            onChange={(e) =>
                              setAccBank(`Banco: ${e.target.value} \n`)
                            }
                            placeholder="Nombre del banco"
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label>Identificación</Label>
                          <Input
                            type="text"
                            id="identificacion"
                            onChange={(e) =>
                              setAccDni(`DNI: ${e.target.value} \n`)
                            }
                            placeholder="Identificación del titular"
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label>Número de Cuenta</Label>
                          <Input
                            type="text"
                            id="numeroCuenta"
                            onChange={(e) => {
                              const target = e.target.value;
                              setLength(target.length);
                              console.log(length);
                              setAccNumber(`Numero de cuenta: ${target} \n`);
                            }}
                            placeholder="Número de cuenta"
                          />
                        </FormGroup>
                      </div>
                    )}

                    {sendOption === "Efectivo" && (
                      <FormGroup>
                        <Label>Ingresa tu Localidad</Label>
                        <Input
                          type="select"
                          id="bankOptionSelect"
                          defaultValue={sendOption}
                          disabled={payment === ""}
                          onChange={(e) => {
                            fetchDataPorcentId(e.target.value);
                          }}
                        >
                          <option value="">Selecciona una opción</option>
                          {porcents.map((por) => {
                            if (por.por_status === "Desactivado") {
                              return null;
                            }
                            return (
                              <option value={por.por_id}>
                                {por.por_stateLocation}
                              </option>
                            );
                          })}
                        </Input>
                      </FormGroup>
                    )}

                    {porcent &&
                      porcent.por_status === "No obligatorio" &&
                      sendOption === "Efectivo" && (
                        <FormGroup>
                          <Label>¿Desea delivery?</Label>
                          <Input
                            type="select"
                            id="delivery"
                            onChange={(e) => {
                              setDelivery(e.target.value);
                            }}
                          >
                            <option value="">Selecciona una opción</option>
                            <option value={0}>No</option>
                            {porcent && (
                              <option value={porcent.por_deliveryPrice}>
                                Si
                              </option>
                            )}
                          </Input>
                        </FormGroup>
                      )}

                    {porcent &&
                      ((porcent.por_status === "No obligatorio" &&
                        delivery === "0") ||
                        porcent.por_status === "Oficina") &&
                      sendOption === "Efectivo" && (
                        <FormGroup>
                          <Label>Pase por Oficina</Label>
                          <Input
                            type="textarea"
                            id="comment"
                            placeholder="Ej. Pase por oficina"
                            value={porcent.por_comment}
                            disabled
                          ></Input>
                        </FormGroup>
                      )}

                    {porcent &&
                      porcent.por_status === "Obligatorio" &&
                      sendOption === "Efectivo" && (
                        <FormGroup>
                          <Label>Delivery</Label>
                          <Input type="select" id="delivery" disabled>
                            {porcent && (
                              <option value={porcent.por_deliveryPrice}>
                                Si
                              </option>
                            )}
                          </Input>
                        </FormGroup>
                      )}

                    {sendOption === "Efectivo" && porcent && (
                      <FormGroup>
                        <Label for="amountInput">
                          Monto a recibir en dolares
                        </Label>
                        <InputGroup>
                          <Input
                            type="number"
                            id="sendAmount"
                            placeholder="Ej. 100"
                            defaultValue={sendAmount}
                            disabled={
                              payment === "" ||
                              sendOption === "" ||
                              (porcent.por_status === "No obligatorio" &&
                                delivery === "")
                            }
                            onChange={(e) => {
                              handleAmountChange(e);
                            }}
                            invalid={
                              sendAmount === "" ||
                              sendAmount < 100 ||
                              sendAmount % 20 !== 0 ||
                              (payment === "EUR" &&
                                user.use_amountEur < sendAmount) ||
                              (payment === "USD" &&
                                user.use_amountUsd < sendAmount) ||
                              (payment === "GBP" &&
                                user.use_amountGbp < sendAmount)
                            }
                          />
                          {(sendAmount !== "" && sendAmount < 100 ? (
                            <FormFeedback>
                              El monto mínimo a retirar es de 100
                            </FormFeedback>
                          ) : null) ||
                            (sendOption === "Efectivo" &&
                            sendAmount % 20 !== 0 ? (
                              <FormFeedback>
                                {sendAmount % 20 !== 0
                                  ? "El monto debe ser un múltiplo de 20"
                                  : "El monto mínimo a retirar en efectivo es de 100"}
                              </FormFeedback>
                            ) : null) ||
                            (payment === "EUR" ? (
                              user.use_amountEur < sendAmount ? (
                                <FormFeedback>
                                  El monto excede la cantidad que tiene
                                  disponible en su cuenta
                                </FormFeedback>
                              ) : null
                            ) : null) ||
                            (payment === "USD" ? (
                              user.use_amountUsd < sendAmount ? (
                                <FormFeedback>
                                  El monto excede la cantidad que tiene
                                  disponible en su cuenta
                                </FormFeedback>
                              ) : null
                            ) : null) ||
                            (payment === "GBP" ? (
                              user.use_amountGbp < sendAmount ? (
                                <FormFeedback>
                                  El monto excede la cantidad que tiene
                                  disponible en su cuenta
                                </FormFeedback>
                              ) : null
                            ) : null)}
                        </InputGroup>
                      </FormGroup>
                    )}

                    {porcent && sendOption === "Efectivo" ? (
                      <FormGroup>
                        <Label for="receiveUsdAmountInput">
                          Monto a debitar
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            id="receiveUsdAmountInput"
                            value={receiveUsdAmount}
                            disabled
                            invalid={
                              (payment === "EUR" &&
                                user.use_amountEur < receiveUsdAmount) ||
                              (payment === "USD" &&
                                user.use_amountUsd < receiveUsdAmount) ||
                              (payment === "GBP" &&
                                user.use_amountGbp < receiveUsdAmount)
                            }
                          />
                          {(payment === "EUR" ? (
                            user.use_amountEur < receiveUsdAmount ? (
                              <FormFeedback>
                                El monto excede la cantidad que tiene disponible
                                en su cuenta
                              </FormFeedback>
                            ) : null
                          ) : null) ||
                            (payment === "USD" ? (
                              user.use_amountUsd < receiveUsdAmount ? (
                                <FormFeedback>
                                  El monto excede la cantidad que tiene
                                  disponible en su cuenta
                                </FormFeedback>
                              ) : null
                            ) : null) ||
                            (payment === "GBP" ? (
                              user.use_amountGbp < receiveUsdAmount ? (
                                <FormFeedback>
                                  El monto excede la cantidad que tiene
                                  disponible en su cuenta
                                </FormFeedback>
                              ) : null
                            ) : null)}
                        </InputGroup>
                      </FormGroup>
                    ) : null}

                    {sendOption === "Efectivo" ? (
                      <div className="row col-12">
                        <FormGroup className="col-6">
                          <Label for="receiveAmountInput">
                            Nombre completo de quien recibe
                          </Label>
                          <Input
                            type="text"
                            id="accBank"
                            maxLength={45}
                            placeholder="Juan Medina"
                            onChange={(e) =>
                              setAccBank(
                                `Persona a recibir: ${e.target.value} \n`
                              )
                            }
                          />
                        </FormGroup>
                        <FormGroup className="col-6">
                          <Label for="receiveAmountInput">
                            Cédula de quien recibe
                          </Label>
                          <Input
                            type="text"
                            id="accDni"
                            maxLength={11}
                            placeholder="00000000"
                            onChange={(e) =>
                              setAccDni(`DNI: ${e.target.value} \n`)
                            }
                          />
                        </FormGroup>
                        <FormGroup className="col-6">
                          <Label for="receiveAmountInput">
                            ¿Quien le envia?
                          </Label>
                          <Input
                            type="text"
                            id="setAccOwner"
                            maxLength={45}
                            placeholder="Maria Gonzalez"
                            onChange={(e) =>
                              setAccOwner(`Propietario: ${e.target.value} \n`)
                            }
                          />
                        </FormGroup>
                        <FormGroup className="col-6">
                          <Label for="receiveAmountInput">
                            Telefono de contacto
                          </Label>
                          <Input
                            type="text"
                            id="accTlf"
                            maxLength={15}
                            placeholder="0414-000-0000"
                            onChange={(e) =>
                              setAccTlf(
                                `Número Telefónico: ${e.target.value} \n`
                              )
                            }
                          />
                        </FormGroup>
                      </div>
                    ) : null}

                    {porcent && sendOption === "Efectivo" ? (
                      <FormGroup>
                        <Label for="receiveAmountInput">
                          Ingrese la direccion de entrega{" "}
                        </Label>
                        <Input
                          type="textarea"
                          id="noteTextArea"
                          rows="4"
                          disabled={
                            payment === "" ||
                            porcent.por_status === "Oficina" ||
                            (porcent.por_status === "No obligatorio" &&
                              delivery === "0")
                          }
                          placeholder="Direccion de entrega"
                          onChange={(e) => setNote(`Nota: ${e.target.value}`)}
                        />
                      </FormGroup>
                    ) : null}

                    {porcent && sendOption === "Efectivo" && (
                      <Button
                        disabled={
                          payment === "" ||
                          sendOption === "" ||
                          sendAmount === "" ||
                          ((porcent.por_status === "Obligatorio" ||
                            (porcent.por_status === "No obligatorio" &&
                              (delivery !== "0" || delivery !== ""))) &&
                            note === "") ||
                          (porcent.por_status === "No obligatorio" &&
                            delivery === "" &&
                            note !== "") ||
                          (porcent.por_status === "Obligatorio" &&
                            note === "") ||
                          // (porcent.por_status === 'No obligatorio' && delivery === '' && note !== '') ||
                          // (porcent.por_status === 'No obligatorio' && delivery === '0' && note !== '') ||
                          // (porcent.por_status === 'Oficina' && note === "") ||
                          accDni === "" ||
                          accOwner === "" ||
                          accTlf === "" ||
                          accBank === "" ||
                          sendAmount < 20 ||
                          sendAmount === "" ||
                          sendAmount < 100 ||
                          sendAmount % 20 !== 0 ||
                          loading ||
                          (payment === "EUR"
                            ? user.use_amountEur < sendAmount
                            : null) ||
                          (payment === "EUR" &&
                            user.use_amountEur < receiveUsdAmount) ||
                          (payment === "USD"
                            ? user.use_amountUsd < sendAmount
                            : null) ||
                          (payment === "USD" &&
                            user.use_amountUsd < receiveUsdAmount) ||
                          (payment === "GBP"
                            ? user.use_amountGbp < sendAmount
                            : null) ||
                          (payment === "GBP" &&
                            user.use_amountGbp < receiveUsdAmount)
                        }
                        onClick={() => setShowConfirmationCash(true)}
                        className="btn col-md-12"
                        color="success"
                      >
                        {loading ? (
                          <Spinner size="sm" color="light" />
                        ) : (
                          "Enviar"
                        )}
                      </Button>
                    )}

                    {/* Monto a debitar */}
                    {(sendOption === "Cuenta Bancaria" ||
                      sendOption === "Pago Movil") && (
                      <FormGroup>
                        <Label for="amountInput">
                          Coloca el monto que deseas retirar
                        </Label>
                        <InputGroup>
                          <Input
                            type="number"
                            id="sendAmount"
                            placeholder="Ej. 100"
                            defaultValue={sendAmount}
                            disabled={payment === "" || sendOption === ""}
                            onChange={(e) => {
                              handleAmountChange(e);
                            }}
                            invalid={
                              (sendAmount !== "" && sendAmount < 20) ||
                              (sendOption === "Efectivo"
                                ? sendAmount < 100 && sendAmount % 2 !== 0
                                : null) ||
                              (payment === "EUR"
                                ? user.use_amountEur < sendAmount
                                : null) ||
                              (payment === "USD"
                                ? user.use_amountUsd < sendAmount
                                : null) ||
                              (payment === "GBP"
                                ? user.use_amountGbp < sendAmount
                                : null)
                            }
                          />
                          {(sendAmount !== "" && sendAmount < 20 ? (
                            <FormFeedback>
                              El monto mínimo a retirar es de 20
                            </FormFeedback>
                          ) : null) ||
                            (sendOption === "Efectivo" ? (
                              sendAmount < 100 && sendAmount % 2 !== 0 ? (
                                <FormFeedback>
                                  El monto mínimo a retirar en efectivo es de
                                  100
                                </FormFeedback>
                              ) : null
                            ) : null) ||
                            (payment === "EUR" ? (
                              user.use_amountEur < sendAmount ? (
                                <FormFeedback>
                                  El monto excede la cantidad que tiene
                                  disponible en su cuenta
                                </FormFeedback>
                              ) : null
                            ) : null) ||
                            (payment === "USD" ? (
                              user.use_amountUsd < sendAmount ? (
                                <FormFeedback>
                                  El monto excede la cantidad que tiene
                                  disponible en su cuenta
                                </FormFeedback>
                              ) : null
                            ) : null) ||
                            (payment === "GBP" ? (
                              user.use_amountGbp < sendAmount ? (
                                <FormFeedback>
                                  El monto excede la cantidad que tiene
                                  disponible en su cuenta
                                </FormFeedback>
                              ) : null
                            ) : null)}
                        </InputGroup>
                      </FormGroup>
                    )}

                    {sendOption === "Transferencias por dólares" && (
                      <FormGroup>
                        <Label for="amountInput">Monto a debitar</Label>
                        <InputGroup>
                          <Input
                            type="number"
                            id="sendAmount"
                            placeholder="Ej. 100"
                            defaultValue={sendAmount}
                            disabled={payment === "" || sendOption === ""}
                            onChange={(e) => {
                              handleAmountChangeUsd(e);
                            }}
                            invalid={
                              (sendAmount !== "" && sendAmount < 20) ||
                              (sendOption === "Efectivo"
                                ? sendAmount < 100 && sendAmount % 2 !== 0
                                : null) ||
                              (payment === "EUR"
                                ? user.use_amountEur < sendAmount
                                : null) ||
                              (payment === "USD"
                                ? user.use_amountUsd < sendAmount
                                : null) ||
                              (payment === "GBP"
                                ? user.use_amountGbp < sendAmount
                                : null)
                            }
                          />
                          {(sendAmount !== "" && sendAmount < 20 ? (
                            <FormFeedback>
                              El monto mínimo a retirar es de 20
                            </FormFeedback>
                          ) : null) ||
                            (sendOption === "Efectivo" ? (
                              sendAmount < 100 && sendAmount % 2 !== 0 ? (
                                <FormFeedback>
                                  El monto mínimo a retirar en efectivo es de
                                  100
                                </FormFeedback>
                              ) : null
                            ) : null) ||
                            (payment === "EUR" ? (
                              user.use_amountEur < sendAmount ? (
                                <FormFeedback>
                                  El monto excede la cantidad que tiene
                                  disponible en su cuenta
                                </FormFeedback>
                              ) : null
                            ) : null) ||
                            (payment === "USD" ? (
                              user.use_amountUsd < sendAmount ? (
                                <FormFeedback>
                                  El monto excede la cantidad que tiene
                                  disponible en su cuenta
                                </FormFeedback>
                              ) : null
                            ) : null) ||
                            (payment === "GBP" ? (
                              user.use_amountGbp < sendAmount ? (
                                <FormFeedback>
                                  El monto excede la cantidad que tiene
                                  disponible en su cuenta
                                </FormFeedback>
                              ) : null
                            ) : null)}
                        </InputGroup>
                      </FormGroup>
                    )}

                    {sendOption === "Transferencias por dólares" && (
                      <FormGroup>
                        <Label for="receiveUsdAmountInput">
                          Monto a recibir
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            id="receiveUsdAmountInput"
                            value={receiveUsdAmountBofa}
                            disabled
                          />
                        </InputGroup>
                      </FormGroup>
                    )}

                    {/* Seleccionar forma de pago a recibir */}
                    {sendOption === "Cuenta Bancaria" ? (
                      <FormGroup>
                        <Label for="receiveAmountInput">
                          Monto a recibir en Bolivares
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            id="receiveAmountInput"
                            value={receiveAmount}
                            disabled
                          />
                        </InputGroup>
                      </FormGroup>
                    ) : null}

                    {sendOption === "Pago Movil" ? (
                      <FormGroup>
                        <Label for="receiveAmountInput">
                          Monto a recibir en Bolivares
                        </Label>
                        <InputGroup>
                          <Input
                            type="text"
                            id="receiveAmountInput"
                            value={parseFloat(receiveAmount)}
                            disabled
                          />
                        </InputGroup>
                      </FormGroup>
                    ) : null}

                    {/* Datos para Nota */}
                    {sendOption === "Cuenta Bancaria" ||
                    sendOption === "Pago Movil" ? (
                      <FormGroup>
                        <p style={{ color: "#a91111", padding: "10px" }}>
                          <strong>IMPORTANTE:</strong> Hemos implementado el{" "}
                          <strong>directorio</strong>, para poder realizar
                          retiros debes tener cuentas agregadas.
                          <Link to="/Directory">
                            <Button color="success">Añadir cuenta</Button>
                          </Link>
                        </p>

                        <Label for="selectAccount">Seleccione una cuenta</Label>

                        <Input
                          type="select"
                          id="selectAccount"
                          value={selectedIdAccount}
                          onChange={(e) => {
                            setSelectedIdAccount(e.target.value);
                            console.log(e.target.value);
                          }}
                        >
                          <option value="">Selecciona una cuenta</option>
                          {accounts.map((account) => (
                            <option
                              key={account.accbsUser_id}
                              value={account.accbsUser_id}
                            >
                              {`${account.accbsUser_bank} - ${account.accbsUser_owner} - ${account.accbsUser_number}`}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    ) : null}

                    {sendOption === "Pago Movil" ||
                    sendOption === "Cuenta Bancaria" ? (
                      <FormGroup>
                        <Label for="receiveAmountInput">
                          Ingrese un comentario (opcional)
                        </Label>
                        <Input
                          type="textarea"
                          id="noteTextArea"
                          rows="4"
                          disabled={payment === ""}
                          placeholder="Ingrese algun comentario"
                          onChange={(e) => setNote(`Nota: ${e.target.value}`)}
                        />
                      </FormGroup>
                    ) : null}

                    {sendOption === "Pago Movil" && (
                      <Button
                        disabled={
                          payment === "" ||
                          sendOption === "" ||
                          selectedIdAccount === "" ||
                          sendAmount === "" ||
                          sendAmount < 20 ||
                          loading ||
                          (payment === "EUR"
                            ? user.use_amountEur < sendAmount
                            : null) ||
                          (payment === "USD"
                            ? user.use_amountUsd < sendAmount
                            : null) ||
                          (payment === "GBP"
                            ? user.use_amountGbp < sendAmount
                            : null)
                        }
                        onClick={() => setShowConfirmationMobile(true)}
                        className="btn col-md-12"
                        color="success"
                      >
                        {loading ? (
                          <Spinner size="sm" color="light" />
                        ) : (
                          "Enviar"
                        )}
                      </Button>
                    )}

                    {sendOption === "Cuenta Bancaria" && (
                      <Button
                        disabled={
                          payment === "" ||
                          sendOption === "" ||
                          selectedIdAccount === "" ||
                          sendAmount === "" ||
                          sendAmount < 20 ||
                          loading ||
                          (payment === "EUR"
                            ? user.use_amountEur < sendAmount
                            : null) ||
                          (payment === "USD"
                            ? user.use_amountUsd < sendAmount
                            : null) ||
                          (payment === "GBP"
                            ? user.use_amountGbp < sendAmount
                            : null)
                        }
                        onClick={() => setShowConfirmationBank(true)}
                        className="btn col-md-12"
                        color="success"
                      >
                        {loading ? (
                          <Spinner size="sm" color="light" />
                        ) : (
                          "Enviar"
                        )}
                      </Button>
                    )}
                    {sendOption === "Transferencias por dólares" && (
                      <div>
                        {/* ... Campos de entrada anteriores ... */}

                        <Button
                          color="success"
                          onClick={handleSubmitSend} // Define la función de manejo de clic aquí
                          className="btn col-md-12"
                        >
                          {loading ? (
                            <Spinner size="sm" color="light" />
                          ) : (
                            "Enviar"
                          )}
                        </Button>
                      </div>
                    )}
                  </Form>
                </ModalBody>
              </Modal>

              {/* Confirmacion Pago Movil */}
              <Modal
                isOpen={showConfirmationMobile}
                centered
                toggle={() =>
                  setShowConfirmationMobile(!showConfirmationMobile)
                }
              >
                <ModalHeader
                  toggle={() =>
                    setShowConfirmationMobile(!showConfirmationMobile)
                  }
                >
                  Confirmación de Datos
                </ModalHeader>
                <ModalBody>
                  <h5>Tipo de Moneda: {payment}</h5>
                  <h5>Monto a Retirar: {sendAmount}</h5>
                  <Button
                    color="primary"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent the default form submission behavior
                      handleSubmitSend(e); // Pass the event object to the function
                      setShowConfirmationMobile(false);
                    }}
                  >
                    {loading ? (
                      <Spinner size="sm" color="light" />
                    ) : (
                      "Confirmar"
                    )}
                  </Button>{" "}
                  <Button
                    color="secondary"
                    onClick={() => setShowConfirmationMobile(false)} // Cierra el modal de confirmación
                  >
                    Cancelar
                  </Button>
                </ModalBody>
              </Modal>

              <Modal
                isOpen={showConfirmationr}
                centered
                toggle={() => setShowConfirmationr(!showConfirmationr)}
              >
                <ModalHeader
                  toggle={() => setShowConfirmationr(!showConfirmationr)}
                >
                  Confirmación de Datos
                </ModalHeader>
                <ModalBody>
                  <h5>Tipo de Moneda: {payment}</h5>
                  <h5>Monto a Recargar: {sendAmount}</h5>
                  <Button
                    color="primary"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent the default form submission behavior
                      handleSubmitLoad(e); // Pass the event object to the function
                      setShowConfirmationr(false);
                    }}
                  >
                    {loading ? (
                      <Spinner size="sm" color="light" />
                    ) : (
                      "Confirmar"
                    )}
                  </Button>{" "}
                  <Button
                    color="secondary"
                    onClick={() => setShowConfirmationr(false)} // Cierra el modal de confirmación
                  >
                    Cancelar
                  </Button>
                </ModalBody>
              </Modal>

              {/* Confirmacion Transferencias Bancarias */}
              <Modal
                isOpen={showConfirmationBank}
                centered
                toggle={() => setShowConfirmationBank(!showConfirmationBank)}
              >
                <ModalHeader
                  toggle={() => setShowConfirmationBank(!showConfirmationBank)}
                >
                  Confirmación de Datos
                </ModalHeader>
                <ModalBody>
                  <h5>Tipo de Moneda: {payment}</h5>
                  <h5>Monto a Retirar: {sendAmount}</h5>
                  <Button
                    color="primary"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent the default form submission behavior
                      handleSubmitSend(e); // Pass the event object to the function
                      setShowConfirmationBank(false);
                    }}
                  >
                    {loading ? (
                      <Spinner size="sm" color="light" />
                    ) : (
                      "Confirmar"
                    )}
                  </Button>{" "}
                  <Button
                    color="secondary"
                    onClick={() => setShowConfirmationBank(false)} // Cierra el modal de confirmación
                  >
                    Cancelar
                  </Button>
                </ModalBody>
              </Modal>

              {/* Consultar estado */}
              <Modal isOpen={sixModalOpen} size="lg" toggle={toggleSixModal}>
                <ModalHeader toggle={toggleSixModal}>
                  Consultar Estado
                </ModalHeader>
                <ModalBody>
                  <div className="table-responsive">
                    <Table>
                      <thead>
                        <tr>
                          <th>Porcentaje GBP</th>
                          <th>Porcentaje USD</th>
                          <th>Porcentaje EUR</th>
                          <th>Ubicación</th>
                          <th>Delivery</th>
                          <th>Oficina</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          /* Muestra los datos de la API aquí después de filtrar */
                          apiData
                            .filter((item) => item.por_status !== "Desactivado")
                            .map((item) => (
                              <tr key={item.por_id}>
                                <td>
                                  <FaPercentage /> {item.por_porcentGbp}
                                </td>
                                <td>
                                  <FaPercentage /> {item.por_porcentUsd}
                                </td>
                                <td>
                                  <FaPercentage /> {item.por_porcentEur}
                                </td>
                                <td>
                                  <FaMapMarkerAlt /> {item.por_stateLocation}
                                </td>
                                <td>
                                  <FaTruck /> {item.por_deliveryPrice}
                                </td>
                                <td>
                                  <FaBuilding />
                                  {item.por_comment}
                                </td>
                                {/* Agrega más campos según tus necesidades */}
                              </tr>
                            ))
                        }
                      </tbody>
                    </Table>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="secondary" onClick={toggleSixModal}>
                    Cerrar
                  </Button>
                </ModalFooter>
              </Modal>

              {/* Confirmacion Efectivo */}
              <Modal
                isOpen={showConfirmationCash}
                centered
                toggle={() => setShowConfirmationCash(!showConfirmationCash)}
              >
                <ModalHeader
                  toggle={() => setShowConfirmationCash(!showConfirmationCash)}
                >
                  Confirmación de Datos
                </ModalHeader>
                <ModalBody>
                  <h5>Tipo de Moneda: {payment}</h5>
                  <h5>Monto a Retirar: {sendAmount}</h5>
                  <Button
                    color="primary"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent the default form submission behavior
                      handleSubmitSend(e); // Pass the event object to the function
                      setShowConfirmationCash(false);
                    }}
                  >
                    {loading ? (
                      <Spinner size="sm" color="light" />
                    ) : (
                      "Confirmar"
                    )}
                  </Button>{" "}
                  <Button
                    color="secondary"
                    onClick={() => setShowConfirmationCash(false)} // Cierra el modal de confirmación
                  >
                    Cancelar
                  </Button>
                </ModalBody>
              </Modal>

              {/* Cargar */}
              <Modal
                centered
                isOpen={forthModalOpen}
                size="lg"
                toggle={toggleforthModal}
              >
                <ModalHeader toggle={toggleforthModal}>
                  Realiza tu Carga
                </ModalHeader>
                <ModalBody>
                  <Form>
                    <FormGroup>
                      <Label>Selecciona el tipo de moneda a cargar</Label>
                      <Input
                        type="select"
                        id="payment"
                        defaultValue={payment}
                        onChange={(e) => setPayment(e.target.value)}
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="EUR">Euro</option>
                        <option value="GBP">Libra Esterlina</option>
                        <option value="USD">Dolar</option>
                      </Input>
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="sendAmount">
                        Coloca el monto que deseas cargar
                      </Label>
                      <InputGroup>
                        <Input
                          type="number"
                          id="sendAmount"
                          placeholder="Ej. 100"
                          value={sendAmount}
                          disabled={payment === ""}
                          onChange={(e) => handleAmountChangeBs(e)}
                          invalid={
                            sendAmount !== "" &&
                            (sendAmount < 20 ||
                              sendAmount.toString().length > 6)
                          }
                        />
                        {sendAmount !== "" &&
                          sendAmount.toString().length > 6 && (
                            <FormFeedback>
                              El monto debe contener 6 cifras o menos.
                            </FormFeedback>
                          )}
                        {sendAmount !== "" && sendAmount < 20 && (
                          <FormFeedback>
                            El monto mínimo a retirar es de 20.
                          </FormFeedback>
                        )}
                      </InputGroup>
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="bankOptionPaySelect">
                        Selecciona el método de carga
                      </Label>
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
                        {payment === "EUR"
                          ? banksEUR
                              .filter((bank) => bank.acceur_status === "Activo")
                              .map((bank) => {
                                return bank.acceur_Bank ? (
                                  <option value={bank.acceur_id}>
                                    {bank.acceur_Bank}
                                  </option>
                                ) : null;
                              })
                          : payment === "USD"
                          ? banksUSD
                              .filter((bank) => bank.accusd_status === "Activo")
                              .map((bank) => {
                                return bank.accusd_Bank ? (
                                  <option value={bank.accusd_id}>
                                    {bank.accusd_Bank}
                                  </option>
                                ) : null;
                              })
                          : payment === "GBP"
                          ? banksGBP
                              .filter((bank) => bank.accgbp_status === "Activo")
                              .map((bank) => {
                                return bank.accgbp_Bank ? (
                                  <option value={bank.accgbp_id}>
                                    {bank.accgbp_Bank}
                                  </option>
                                ) : null;
                              })
                          : null}
                      </Input>
                    </FormGroup>

                    {bankOptionPay === "" ? null : (
                      <Alert>
                        <h4 className="alert-heading">Cuenta Bancaria:</h4>
                        {payment === "EUR"
                          ? banksEUR.map((bank) => {
                              return bank.acceur_id ===
                                parseInt(bankOptionPay) &&
                                bank.acceur_status === "Activo" &&
                                bank.acceur_type === "Efectivo Movil" ? (
                                <p>
                                  En el momento de realizar la carga, deberá colocar su número de teléfono móvil y el código de retiro que le proporcionará el banco.
                                  <br />
                                </p>
                              ) : bank.acceur_id === parseInt(bankOptionPay) &&
                                bank.acceur_status === "Activo" ? (
                                <p>
                                  Banco: {bank.acceur_Bank}
                                  <br />
                                  Cuenta: {bank.acceur_number}
                                  <br />
                                  NIE/NIF: {bank.acceur_nie}
                                  <br />
                                  Propietario: {bank.acceur_owner}
                                </p>
                              ) : null;
                            })
                          : payment === "USD"
                          ? banksUSD.map((bank) => {
                              return bank.accusd_id ===
                                parseInt(bankOptionPay) ? (
                                <p>
                                  Banco: {bank.accusd_Bank}
                                  <br />
                                  {bank.accusd_number}
                                  <br />
                                  Propietario: {bank.accusd_owner}
                                  <br />
                                  Email: {bank.accusd_email}
                                </p>
                              ) : null;
                            })
                          : payment === "GBP"
                          ? banksGBP.map((bank) => {
                              return bank.accgbp_id ===
                                parseInt(bankOptionPay) ? (
                                <p>
                                  Banco: {bank.accgbp_Bank}
                                  <br />
                                  Cuenta: {bank.accgbp_number}
                                  <br />
                                  DNI: {bank.accgbp_Ident}
                                  <br />
                                  Propietario: {bank.accgbp_owner}
                                </p>
                              ) : null;
                            })
                          : null}
                        <hr />
                        <p className="mb-0">
                          Al culminar la verificación del pago, el monto se verá
                          reflejado en su plataforma.
                        </p>
                      </Alert>
                    )}

                    <FormGroup>
                    {banksEUR.map((bank) => {
                      return bank.acceur_id === parseInt(bankOptionPay) &&
                        bank.acceur_status === "Activo" &&
                        bank.acceur_type === "Efectivo Movil" ? (
                        <div>
                          <Label htmlFor="imageInput">
                            Adjuntar Codigo de retiro
                          </Label>
                          <Input
                            type="text"
                            className="form-control-file"
                            id="imageInput"
                            disabled={payment === ""}
                            maxLength={4}
                            onChange={(e) => setCash(e.target.value)}
                          />
                          <Label htmlFor="imageInput">
                            Adjuntar número Telefónico
                          </Label>
                          <Input
                            type="text"
                            className="form-control-file"
                            id="imageInput"
                            disabled={payment === ""}
                            onChange={(e) => setCashPhone(e.target.value)}
                          />
                        </div>
                      ) : null;
                    })}
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="imageInput">
                        Adjuntar Comprobante de pago
                      </Label>
                      <Input
                        type="file"
                        className="form-control-file"
                        id="imageInput"
                        disabled={payment === ""}
                        accept=".jpg,.jpeg,.png,.gif,.pdf"
                        onChange={(e) => setMov_img(e.target.files[0])}
                      />
                    </FormGroup>

                    <Button
                      disabled={
                        payment === "" ||
                        mov_img === "" ||
                        sendAmount === "" ||
                        sendAmount === "" ||
                        sendAmount < 20 ||
                        loading ||
                        (sendAmount !== "" && sendAmount.toString().length > 6)
                      }
                      color="primary"
                      onClick={() => setShowConfirmationr(true)}
                      className="btn col-md-12"
                    >
                      {loading ? <Spinner size="sm" color="light" /> : "Enviar"}
                    </Button>
                  </Form>
                </ModalBody>
              </Modal>

              <Modal
                isOpen={showConfirmation}
                centered
                toggle={() => setShowConfirmation(!showConfirmation)}
              >
                <ModalHeader
                  toggle={() => setShowConfirmation(!showConfirmation)}
                >
                  Confirmación de Datos
                </ModalHeader>
                <ModalBody>
                  <h5>Tipo de Moneda: {payment}</h5>
                  <h5>Monto a Retirar: {sendAmount}</h5>
                  <Button
                    color="primary"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent the default form submission behavior
                      handleSubmitLoad(e); // Pass the event object to the function
                      setShowConfirmation(false);
                    }}
                  >
                    {loading ? (
                      <Spinner size="sm" color="light" />
                    ) : (
                      "Confirmar"
                    )}{" "}
                  </Button>{" "}
                  <Button
                    color="secondary"
                    onClick={() => setShowConfirmation(false)} // Cierra el modal de confirmación
                  >
                    Cancelar
                  </Button>
                </ModalBody>
              </Modal>

              <ToastContainer />
            </div>
          ) : (
            <div style={{ height: "100vh" }}>
              <NavBar />
              {showAlert && (
                <FixeedAlert message={alertMessage} type={alertType} />
              )}
              <img className="changesMen" alt="changesMen" src={changes} />
              <div className="textchanges">
                <h2>
                  Hola {user.use_name} {user.use_lastName}
                </h2>
                <h3>
                  ${user.use_amountUsd ? user.use_amountUsd : 0} | €
                  {user.use_amountEur ? user.use_amountEur : 0} | £
                  {user.use_amountGbp ? user.use_amountGbp : 0}
                </h3>
                <h6 style={{ color: "#686868" }}>Disponible</h6>
              </div>

              {/* Cambios */}
              <div className="changes">
                {/* Spain - Bs */}
                <InputGroup className="Change-Input1">
                  <Button>
                    <img src={Spain} width={45} alt="Spain" /> Eur
                  </Button>
                  <Input
                    disabled
                    className="centered-input"
                    placeholder={
                      "1  =  " + currencyPrice.map((coin) => coin.cur_EurToBs)
                    }
                  />
                  <Button>
                    Bs <img src={Venezuela} alt="Venezuela" width={45} />
                  </Button>
                </InputGroup>

                {/* Uk - Bs */}
                <InputGroup className="Change-Input1">
                  <Button>
                    <img src={Uk} width={45} alt="Uk" /> Gbp
                  </Button>
                  <Input
                    disabled
                    className="centered-input"
                    placeholder={
                      "1  =  " + currencyPrice.map((coin) => coin.cur_GbpToBs)
                    }
                  />
                  <Button>
                    Bs <img src={Venezuela} alt="Venezuela" width={45} />
                  </Button>
                </InputGroup>

                {/* Usa - Bs */}
                <InputGroup className="Change-Input1">
                  <Button>
                    <img src={Usa} alt="Usa" width={45} /> Usd
                  </Button>
                  <Input
                    disabled
                    className="centered-input"
                    placeholder={
                      "1  =  " + currencyPrice.map((coin) => coin.cur_UsdToBs)
                    }
                  ></Input>
                  <Button>
                    Bs <img src={Venezuela} alt="Venezuela" width={45} />
                  </Button>
                </InputGroup>
                {/* Usa - Bs */}
                <InputGroup className="Change-Input1">
                  <Button>
                    <img src={Spain} alt="Usa" width={45} /> Eur
                  </Button>
                  <Input
                    disabled
                    className="centered-input"
                    placeholder={
                      "1  =  " + currencyPrice.map((coin) => coin.cur_EurToUsd)
                    }
                  ></Input>
                  <Button>
                    Usd <img src={Usa} alt="Venezuela" width={45} />
                  </Button>
                </InputGroup>

                {/* Spain - Usa */}
                <InputGroup className="Change-Input1">
                  <Button>
                    <img src={Spain} alt="Spain" width={45} /> Eur
                  </Button>
                  <Input
                    disabled
                    className="centered-input"
                    placeholder="Consultar estado entrega efectivo"
                    onClick={toggleTridModal} // Abre el modal al hacer clic en el input
                  ></Input>
                  <Button>
                    Usd <img src={Usa} alt="Usa" width={45} />
                  </Button>
                </InputGroup>

                <InputGroup className="changesBtn">
                  <div className="Btn">
                    <Button
                      color="primary"
                      onClick={
                        user.use_verif === "N"
                          ? toggleModal
                          : user.use_verif === "E"
                          ? toggleFifthModal
                          : clearLocal
                      }
                    >
                      Recargar
                    </Button>
                    <Button
                      color="success"
                      onClick={
                        user.use_verif === "N"
                          ? toggleModal
                          : user.use_verif === "E"
                          ? toggleFifthModal
                          : clearLocal
                      }
                    >
                      Retirar
                    </Button>
                    <Button
                      color="warning"
                      onClick={
                        user.use_verif === "N"
                          ? toggleModal
                          : user.use_verif === "E"
                          ? toggleFifthModal
                          : clearLocal
                      }
                    >
                      Consultar Porcentaje
                    </Button>
                  </div>
                </InputGroup>
              </div>

              {/* Alert */}
              <Modal
                isOpen={modalOpen}
                centered
                toggle={toggleModal}
                className="responsive-modal"
              >
                <ModalHeader>
                  <b style={{ fontFamily: "Roboto", fontWeight: "900" }}>
                    {" "}
                    ¡Necesitas verificación!{" "}
                  </b>
                </ModalHeader>
                <ModalBody className="custom-modal-content">
                  <img
                    src={VerificationImage}
                    style={{ float: "right" }}
                    alt="Exclamation Triangle"
                    width={120}
                    className="modal-image"
                  />
                  <Button
                    style={{
                      background: "#409192",
                      border: "none",
                      borderRadius: "15px",
                      marginLeft: "15px",
                    }}
                    onClick={toggleSecondModal}
                  >
                    NECESITAS VERIFICACIÓN
                  </Button>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <div className="modal-text" style={{ marginRight: "10px" }}>
                      <p
                        style={{
                          color: "rgba(33, 33, 33, 0.6)",
                          marginTop: ".5em",
                        }}
                      >
                        Para realizar el cambio de divisas necesitamos verificar
                        que eres el propietario de la cuenta.
                      </p>
                      <p>Verifica tu identidad para empezar a cambiar.</p>
                    </div>
                  </div>
                </ModalBody>
              </Modal>

              {/* Verificación de Identidad */}
              <Modal
                isOpen={secondModalOpen}
                size="lg"
                centered
                toggle={toggleSecondModal}
                className="responsive-modal"
              >
                <ModalHeader toggle={toggleSecondModal}>
                  Verificación de Identidad
                </ModalHeader>
                <ModalBody>
                  <form onSubmit={handleSubmitVerify}>
                    <div className="form-group">
                      <Label htmlFor="dniInput">
                        Número de Documento de Identidad:
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="dniInput"
                        placeholder="Ingresa tu DNI"
                        value={use_dni}
                        onChange={(e) => setUseDNI(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <Label htmlFor="dniInput">Número de Telefono:</Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="dniInput"
                        placeholder="Ingresa tu telefono"
                        value={use_phone}
                        onChange={(e) => setUsePhone(e.target.value)}
                      />
                    </div>
                    <p
                      style={{
                        color: "rgba(33, 33, 33, 0.6)",
                        marginTop: ".5em",
                      }}
                    >
                      Ingresa el número de documento de identidad. Lo
                      utilizaremos para comprobar que eres realmente tú quien
                      utilizará la plataforma.
                    </p>
                    <p style={{ color: "#a91111", padding: "10px" }}>
                      <strong>IMPORTANTE:</strong> Debes subir la imágen de tu
                      DNI o Pasaporte y otra imágen junto a tu rostro como en el
                      ejemplo que se muestra. Los datos deben ser legibles y no
                      debes cubrirlos de ninguna manera. El uso de esta
                      información será únicamente para comprobar que realmente
                      eres tú quien realizará el cambio.
                    </p>
                    <div className="form-group">
                      <Label htmlFor="imageInput">
                        Seleccionar Imagen del Dni:
                      </Label>
                      <Input
                        type="file"
                        className="form-control-file"
                        id="imageInput"
                        accept=".jpg,.jpeg,.png,.gif,.pdf"
                        onChange={(e) => setUseImg(e.target.files[0])}
                      />
                    </div>
                    <img
                      style={{
                        marginLeft: "3%",
                        marginTop: "1em",
                        width: "200px",
                      }}
                      src={DniVerification}
                      alt="Dni"
                      className="modal-image1"
                    />
                    <div className="form-group">
                      <Label htmlFor="imageInput">
                        Seleccionar Imagen Tipo Selfie:
                      </Label>
                      <Input
                        type="file"
                        className="form-control-file"
                        id="imageInputDNI"
                        accept=".jpg,.jpeg,.png,.gif,.pdf"
                        onChange={(e) => setUseImgDni(e.target.files[0])}
                      />
                    </div>
                    <img
                      style={{ marginLeft: "3%" }}
                      src={ImageVerification}
                      alt="ImageVerification"
                      className="modal-image1"
                    />
                    <div
                      style={{ marginTop: "1em", marginLeft: ".5em" }}
                      className="form-check"
                    >
                      <Input
                        type="checkbox"
                        className="form-check-input"
                        id="termsCheckbox"
                        checked={termsCheckbox}
                        onChange={(e) => setTermsCheckbox(e.target.checked)}
                      />
                      <Label
                        className="form-check-label"
                        htmlFor="termsCheckbox"
                      >
                        {" "}
                        Acepto los
                        <Link
                          to="/TermsAndConditions"
                          style={{ paddingLeft: "5px" }}
                        >
                          términos y condiciones
                        </Link>
                      </Label>
                    </div>

                    <Button
                      disabled={
                        !termsCheckbox ||
                        use_dni === "" ||
                        use_phone === "" ||
                        use_img === "" ||
                        use_imgDni === ""
                      }
                      type="submit"
                      className="btn col-md-12"
                      color="success"
                    >
                      Enviar
                    </Button>
                  </form>
                </ModalBody>
              </Modal>

              {/* Verificación en proceso */}
              <Modal isOpen={fifthModalOpen} centered toggle={toggleFifthModal}>
                <ModalHeader toggle={toggleFifthModal}>
                  Verificación en proceso
                </ModalHeader>
                <ModalBody>
                  <div style={{ textAlign: "center" }}>
                    <FaExclamationCircle
                      style={{
                        fontSize: "48px",
                        marginBottom: "20px",
                        color: "red",
                      }}
                    />
                    <p>Tu usuario está en proceso de verificación.</p>
                    <p>Espera a que un administrador apruebe tu identidad.</p>
                    <p>
                      El tiempo estimado de verificación dentro de nuestro
                      horario laboral es de aproximadamente 20 minutos.
                    </p>
                  </div>
                </ModalBody>
              </Modal>

              <ToastContainer />
            </div>
          )
        ) : (
          <NotFound404 />
        )}
      </div>
    </div>
  );
}

export { Changes };
