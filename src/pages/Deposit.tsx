import {
  Card,
  Button,
  Form,
  Alert,
  Stack,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useFormik } from "formik";
import { ETransactionType, ITransaction } from "../interfaces/interfaces";
import {
  useStoreAccounts,
  useStoreActions,
  useStoreActiveAccountID,
} from "../stores/useAccountsStore";
import { useState } from "react";
import { format } from "date-fns";
import { transactionAmountSchema } from "../validation/YupValidationSchemas";

const Deposit = () => {
  const accounts = useStoreAccounts();
  const activeAccountID = useStoreActiveAccountID();
  const accountActions = useStoreActions();
  const activeAccount = accounts?.find(
    (account) => account.id === activeAccountID
  );

  const [showToast, setShowToast] = useState<boolean>(false);

  const initialFormValue: ITransaction = {
    sort: ETransactionType.DEPOSIT,
    amount: 0,
    date: undefined,
  };

  const formik = useFormik({
    initialValues: initialFormValue,
    onSubmit: (values, { resetForm }) => {
      values.date = new Date(Date.now());
      activeAccount!.balance = activeAccount!.balance! + values.amount!;
      activeAccount?.history?.push(values);
      accountActions.updateAccounts(activeAccount!);
      setShowToast(true);
      resetForm({ values: initialFormValue });
    },
    validationSchema: transactionAmountSchema,
  });

  return (
    <div>
      <Card className="shadow" style={{ width: "24em" }}>
        <Card.Header as="h5" className="text-center">
          Deposit
        </Card.Header>
        <Card.Body>
          <Card.Text className="text-muted">
            Deposit money in your account.
          </Card.Text>
          <Form onSubmit={formik.handleSubmit}>
            <Stack gap={1}>
              <Stack direction="horizontal" gap={2}>
                <div>Current Balance:</div>
                <div style={{ fontWeight: "bold" }}>
                  {activeAccount!.balance}$
                </div>
              </Stack>
              <Form.Group className="mb-3" controlId="formBasicDepositAmount">
                <Form.Label>Deposit Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  placeholder="Enter amount..."
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.amount ? (
                  <Form.Label style={{ color: "red" }}>
                    {formik.errors.amount}
                  </Form.Label>
                ) : null}
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                disabled={!(formik.isValid && formik.dirty)}
                style={{ width: "100%" }}
              >
                Deposit
              </Button>
            </Stack>
          </Form>
        </Card.Body>
      </Card>

      {!activeAccount?.history?.length ? null : (
        <ToastContainer className="p-3" position={"top-end"}>
          <Toast
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={5000}
            autohide
            bg="success"
          >
            <Toast.Header>
              <strong className="me-auto">Bad Bank</strong>
              <small>
                {format(
                  new Date(
                    activeAccount?.history![
                      activeAccount?.history!.length - 1
                    ].date!
                  ),
                  "EE dd MMMM yyyy HH:mm:ss"
                )}
              </small>
            </Toast.Header>
            <Toast.Body className="text-white">{`Succesfully deposited ${
              activeAccount?.history![activeAccount?.history!.length - 1].amount
            }$ to ${
              activeAccount?.credentials?.fullName
            }'s account!`}</Toast.Body>
          </Toast>
        </ToastContainer>
      )}
    </div>
  );
};

export default Deposit;
