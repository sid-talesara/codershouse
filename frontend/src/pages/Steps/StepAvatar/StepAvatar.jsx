import React, { useState, useEffect } from "react";
import Card from "../../../components/shared/Card/Card";
import Button from "../../../components/shared/Button/Button";
import styles from "./StepAvatar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setAvatar } from "../../../store/activateSlice";
import { activate } from "../../../http";
import { setAuth } from "../../../store/authSlice";
import Loader from "../../../components/shared/Loader/Loader";

const StepName = ({ onNext }) => {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { name, avatar } = useSelector((state) => state.activate);
  const dispatch = useDispatch();
  const [image, setImage] = useState("/images/monkey-avatar.png");
  async function submit() {
    if (!name || !avatar) return;
    try {
      setLoading(true);
      const { data } = await activate({ name, avatar });
      if (data.auth) {
        // check
        if (!mounted) dispatch(setAuth(data));
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    return () => {
      setMounted(true);
    };
  }, []);

  function captureImage(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      setImage(reader.result);
      dispatch(setAvatar(reader.result));
    };
  }

  return (
    <>
      {loading && <Loader message="Activation in progress🗝️..." />}
      {!loading && (
        <Card title={`Okay, ${name}`} icon="monkey-emoji">
          <p className={styles.subHeading}>How’s this photo?</p>
          <div className={styles.avatarWrapper}>
            <img className={styles.avatarImage} src={image} alt="avatar" />
          </div>
          <div>
            <input
              onChange={captureImage}
              id="avatarInput"
              type="file"
              accept="image/x-png"
              className={styles.avatarInput}
            />
            <label className={styles.avatarLabel} htmlFor="avatarInput">
              Choose a different photo
            </label>
          </div>
          <div>
            <Button onClick={submit} text="Next" />
          </div>
        </Card>
      )}
    </>
  );
};

export default StepName;
