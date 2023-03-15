import { useFormik } from "formik";
import { Fragment, useState } from "react";
import { Alert, Stack, Button, Card, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ILogin } from "../interfaces/interfaces";
import { useStoreAccounts, useStoreActions } from "../stores/useAccountsStore";

const Login = () => {
  const [showFailLoginAlert, setShowFailLoginAlert] = useState<boolean>(false);
  const navigate = useNavigate();
  const accountStore = useStoreAccounts();
  const accountActions = useStoreActions();

  const initialFormValues: ILogin = {
    email: "",
    password: "",
  };

  const formik = useFormik({
    initialValues: initialFormValues,
    onSubmit: (values, { resetForm }) => {
      const existingAccounts = accountStore!;
      const matchingAccount = existingAccounts?.find(
        (acc) =>
          acc.credentials?.email === values.email &&
          acc.credentials?.password === values.password
      );

      if (matchingAccount) {
        accountActions.setActiveAccount(matchingAccount!.id!);
        resetForm({ values: initialFormValues });
        navigate("/all-data");
      } else {
        resetForm({ values: initialFormValues });
        setShowFailLoginAlert(true);
      }
    },
    validate: (values) => {
      let errors: ILogin = {};

      if (!values.email) {
        errors.email = "Field required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,10}$/i.test(values.email!)
      ) {
        errors.email = "This is not a valid email!";
      }
      if (!values.password) {
        errors.password = "Password required";
      } else if (values.password.length < 8) {
        errors.password = "Your password need to have at least 8 characters!";
      }
      return errors;
    },
  });

  return (
    <Fragment>
      <Modal
        show={showFailLoginAlert}
        onHide={() => setShowFailLoginAlert(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title className="ms-auto">Login Failed</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack className="text-center" gap={2}>
            <p>Sorry, this Email and Password does not match. </p>
            <Button
              variant="primary"
              style={{ width: "100%" }}
              onClick={() => setShowFailLoginAlert(false)}
            >
              Try Login Again
            </Button>
            <Button
              variant="primary"
              style={{ width: "100%" }}
              onClick={() => navigate("/create-account")}
            >
              Create New Account
            </Button>
          </Stack>
        </Modal.Body>
      </Modal>

      <Card className=" shadow" style={{ width: "24em" }}>
        <Card.Header as="h5" className="text-center">
          Login
        </Card.Header>
        <Card.Body>
          <Card.Text className="text-muted">
            Login into your accout to access our services.
          </Card.Text>

          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                name="email"
                placeholder="Enter email..."
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              {formik.errors.email ? (
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
              />
              {formik.errors.password ? (
                <Form.Label style={{ color: "red" }}>
                  {formik.errors.password}
                </Form.Label>
              ) : null}
            </Form.Group>
            {formik.errors.accountExist ? (
              <Form.Label style={{ color: "red" }}>
                {formik.errors.accountExist}
              </Form.Label>
            ) : null}
            <Button
              variant="primary"
              type="submit"
              disabled={!(formik.isValid && formik.dirty)}
              style={{ width: "100%" }}
            >
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default Login;
