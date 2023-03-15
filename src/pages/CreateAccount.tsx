import {
  Card,
  Button,
  Form,
  Alert,
  Stack,
  Modal,
  ToastContainer,
  Toast,
} from "react-bootstrap";
import { useFormik } from "formik";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IAccount,
  ICreateAccountForm,
  IUserCredential,
} from "../interfaces/interfaces";
import { useStoreAccounts, useStoreActions } from "../stores/useAccountsStore";
import uuid from "react-uuid";
import { emailSchema } from "../validation/YupValidationSchemas";

const CreateAccount = () => {
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const [showEmailExistAlert, setShowEmailExistAlert] =
    useState<boolean>(false);
  const [isFirstAccount, setIsFirstAccount] = useState(true);
  const navigate = useNavigate();
  const accountStore = useStoreAccounts();
  const accountActions = useStoreActions();

  const initialFormValues: IUserCredential = {
    fullName: "",
    email: "",
    password: "",
  };

  const formik = useFormik({
    initialValues: initialFormValues,
    onSubmit: (values, { resetForm }) => {
      const matchingEmail = accountStore?.find(
        (acc) => acc.credentials?.email === values.email
      );
      if (matchingEmail) {
        setShowEmailExistAlert(true);
      } else {
        const nAcc = {} as IAccount;
        nAcc.credentials = { ...values };
        nAcc.id = uuid();
        nAcc.balance = 0;
        nAcc.history = [];
        accountActions.addAccount(nAcc);
        accountActions.setActiveAccount(nAcc.id);
        setIsFirstAccount(false);
        setShowSuccessAlert(true);
        resetForm({ values: initialFormValues });
      }
    },
    validationSchema: emailSchema,
  });

  return (
    <Fragment>
      <Card className="shadow" style={{ width: "24em" }}>
        <Card.Header as="h5" className="text-center">
          Create New Account
        </Card.Header>
        <Card.Body>
          <Card.Text className="text-muted">
            Fill in your data to create a new account.
          </Card.Text>

          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicFullname">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                placeholder="Enter name..."
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.fullName && formik.touched.fullName ? (
                <Form.Label style={{ color: "red" }}>
                  {formik.errors.fullName}
                </Form.Label>
              ) : null}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                name="email"
                placeholder="Enter email..."
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.email && formik.touched.email ? (
                <Form.Label style={{ color: "red" }}>
                  {formik.errors.email}
                </Form.Label>
              ) : null}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password..."
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.password && formik.touched.password ? (
                <Form.Label style={{ color: "red" }}>
                  {formik.errors.password}
                </Form.Label>
              ) : null}
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={!(formik.isValid && formik.dirty)}
              style={{ width: "100%" }}
            >
              {isFirstAccount ? "Create Account" : "Create Another Account"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <ToastContainer className="p-3" position={"top-end"}>
        <Toast
          onClose={() => setShowEmailExistAlert(false)}
          show={showEmailExistAlert}
          delay={5000}
          autohide
          bg="danger"
        >
          <Toast.Header>
            <strong className="me-auto">Bad Bank Warning</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            This email address is already used!
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <ToastContainer className="p-3" position={"top-end"}>
        <Toast
          onClose={() => setShowSuccessAlert(false)}
          show={showSuccessAlert}
          delay={5000}
          autohide
          bg="success"
        >
          <Toast.Header>
            <strong className="me-auto">Bad Bank</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            Account created succesfully!
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* <Modal show={showSuccessAlert} onHide={() => setShowSuccessAlert(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="ms-auto">
            Account Creation Successful
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack className="text-center" gap={2}>
            <h6>Enjoy our dodgy bank services!</h6>
            <p>You are now logged in, you can either :</p>
            <Button
              variant="primary"
              style={{ width: "100%" }}
              onClick={() => navigate("/deposit")}
            >
              Deposit Money
            </Button>
            <Button
              variant="primary"
              style={{ width: "100%" }}
              onClick={() => navigate("/all-data")}
            >
              View Account Details
            </Button>
            <Button
              variant="primary"
              style={{ width: "100%" }}
              onClick={() => setShowSuccessAlert(false)}
            >
              Create Another Account
            </Button>
          </Stack>
        </Modal.Body>
      </Modal> */}
    </Fragment>
  );
};

export default CreateAccount;
