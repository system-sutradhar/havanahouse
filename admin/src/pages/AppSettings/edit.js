import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { fetchDataFromApi, editData } from "../../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import { MyContext } from "../../App";

const EditAppSetting = () => {
  const { id } = useParams();
  const [formFields, setFormFields] = useState({
    name: "",
    prelogin: false,
    postlogin: false,
    desktop: false,
    mobile: false,
  });

  const context = useContext(MyContext);
  const history = useNavigate();

  useEffect(() => {
    fetchDataFromApi(`/api/appSettings/${id}`).then((res) => {
      if (res) setFormFields(res);
    });
  }, [id]);

  const submitForm = () => {
    editData(`/api/appSettings/${id}`, formFields).then(() => {
      context.setAlertBox({ open: true, error: false, msg: "Updated!" });
      history("/appSettings");
    });
  };

  return (
    <div className="right-content w-100">
      <h5 className="mb-4">Edit App Setting</h5>
      <div className="form-group mb-3">
        <label>Name</label>
        <input
          type="text"
          className="form-control"
          value={formFields.name}
          onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
        />
      </div>
      <FormControlLabel
        control={
          <Switch
            checked={formFields.prelogin}
            onChange={(e) =>
              setFormFields({ ...formFields, prelogin: e.target.checked })
            }
          />
        }
        label="Pre Login"
        className="form-check"
      />
      <FormControlLabel
        control={
          <Switch
            checked={formFields.postlogin}
            onChange={(e) =>
              setFormFields({ ...formFields, postlogin: e.target.checked })
            }
          />
        }
        label="Post Login"
        className="form-check"
      />
      <FormControlLabel
        control={
          <Switch
            checked={formFields.desktop}
            onChange={(e) =>
              setFormFields({ ...formFields, desktop: e.target.checked })
            }
          />
        }
        label="Desktop"
        className="form-check"
      />
      <FormControlLabel
        control={
          <Switch
            checked={formFields.mobile}
            onChange={(e) =>
              setFormFields({ ...formFields, mobile: e.target.checked })
            }
          />
        }
        label="Mobile"
        className="form-check mb-4"
      />
      <Button variant="contained" onClick={submitForm}>
        Update
      </Button>
    </div>
  );
};

export default EditAppSetting;
