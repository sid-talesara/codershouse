import React, { useEffect, useState } from "react";
import Card from "../../../../components/shared/Card/Card";
import Button from "../../../../components/shared/Button/Button";
import TextInput from "../../../../components/shared/TextInput/TextInput";
import styles from "../StepPhoneEmail.module.css";
import { sendOtp } from "../../../../http/index";
import { useDispatch } from "react-redux";
import { setOtp } from "../../../../store/authSlice";

const Phone = ({ onNext }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [inputField, setInputField] = useState(false);
  const dispatch = useDispatch();

  async function submit() {
    if (!phoneNumber) return;

    if (phoneNumber.length < 10 || phoneNumber.length > 10) {
      setInputField(true);
      return;
    }
    const { data } = await sendOtp({ phone: phoneNumber });
    console.log(data);
    dispatch(setOtp({ phone: data.phone, hash: data.hash }));
    onNext();
  }

  useEffect(() => {
    setTimeout(() => {
      setInputField(false);
    }, 3000);
  }, [inputField]);
  return (
    <Card title="Enter you phone number" icon="phone">
      <TextInput
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <div>
        <div className={styles.actionButtonWrap}>
          <Button text="Next" onClick={submit} />
        </div>
        {inputField && (
          <p className={styles.phoneError}>Invalid Phone Number</p>
        )}
        <p className={styles.bottomParagraph}>
          By entering your number, you’re agreeing to our Terms of Service and
          Privacy Policy. Thanks!
        </p>
      </div>
    </Card>
  );
};

export default Phone;
