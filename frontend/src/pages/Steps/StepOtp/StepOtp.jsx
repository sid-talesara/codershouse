import React, { useState } from "react";
import Card from "../../../components/shared/Card/Card";
import TextInput from "../../../components/shared/TextInput/TextInput";
import Button from "../../../components/shared/Button/Button";
import styles from "./StepOtp.module.css";
import { verifyOtp } from "../../../http/index.js";
import { useSelector, useDispatch } from "react-redux";
import { setAuth } from "../../../store/authSlice.js";

const StepOtp = () => {
  const [otp, setOtp] = useState("");
  const [inputField, setInputField] = useState(false);
  const dispatch = useDispatch();
  const { phone, hash } = useSelector((state) => state.auth.otp);

  async function submit() {
    try {
      if (!otp || !phone || !hash) return;
      if (otp.length < 4 || otp.length > 4) {
        setInputField(true);
        return;
      }

      const { data } = await verifyOtp({ otp, phone, hash });
      console.log(data);
      dispatch(setAuth(data));
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div className={styles.cardWrapper}>
        <Card title="Enter the code we just texted you" icon="lock-emoji">
          <TextInput value={otp} onChange={(e) => setOtp(e.target.value)} />
          <div className={styles.actionButtonWrap}>
            <Button onClick={submit} text="Next" />
          </div>
          {inputField && <p className={styles.inputFieldError}>Invalid OTP</p>}
          <p className={styles.bottomParagraph}>
            By entering your number, you’re agreeing to our Terms of Service and
            Privacy Policy. Thanks!
          </p>
        </Card>
      </div>
    </>
  );
};

export default StepOtp;
