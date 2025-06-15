import React, { useContext, useState } from "react";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import logger from "../../utils/logger";

const AddAppSetting = ({ onSuccess }) => {
  const [formFields, setFormFields] = useState({
    name: "",
    prelogin: false,
    postlogin: false,
    desktop: false,
    mobile: false,
  });

  const context = useContext(MyContext);
  const history = useNavigate();

  const submitForm = (e) => {
    e.preventDefault();
    postData("/api/appSettings/create", formFields)
      .then(() => {
        context.setAlertBox({ open: true, error: false, msg: "Created!" });
        if (onSuccess) {
          onSuccess();
        } else {
          history("/appSettings");
        }
      })
      .catch((err) => {
        logger.error(err);
        context.setAlertBox({ open: true, error: true, msg: "Failed to create" });
      });
  };

  return (
    <div className="right-content w-100">
      <div className="card shadow border-0 w-100 flex-row p-4 mt-2">
        <h5 className="mb-0">Add App Setting</h5>
      </div>
      <form className="form" onSubmit={submitForm}>
        <div className="card p-4 mt-0">
          <div className="form-group">
            <h6>NAME</h6>
            <input
              type="text"
              value={formFields.name}
              onChange={(e) =>
                setFormFields({ ...formFields, name: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
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
          </div>
          <div className="form-group">
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
          </div>
          <div className="form-group">
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
          </div>
          <div className="form-group">
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
              className="form-check"
            />
          </div>
          <Button variant="contained" type="submit" className="mt-2">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddAppSetting;

