import React, { useState } from "react";
import Card from "../../../components/shared/Card/Card";
import TextInput from "../../../components/shared/TextInput/TextInput";
import Button from "../../../components/shared/Button/Button";
import styles from "./StepName.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setName } from "../../../store/activateSlice";
const StepName = ({ onNext }) => {
  const { name } = useSelector((state) => state.activate);
  const dispatch = useDispatch();
  const [fullname, setFullName] = useState(name);

  function submit() {
    if (!fullname) {
      return;
    }
    dispatch(setName(fullname));
    onNext();
  }

  return (
    <div>
      <Card title="What’s your full name?" icon="goggle-emoji">
        <TextInput
          value={fullname}
          onChange={(e) => setFullName(e.target.value)}
        />
        <p className={styles.paragraph}>
          People use real names at codershouse :) !
        </p>
        <div>
          <Button onClick={submit} text="Next" />
        </div>
      </Card>
    </div>
  );
};

export default StepName;
