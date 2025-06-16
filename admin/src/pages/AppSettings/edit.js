import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { fetchDataFromApi, editData } from "../../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import { MyContext } from "../../App";
import logger from "../../utils/logger";

const DEFAULT_FORM_ID = "edit-setting-form";

const EditAppSetting = ({
  id: propId,
  onSuccess,
  onClose,
  formId = DEFAULT_FORM_ID,
  hideActions = false,
}) => {
  const params = useParams();
  const id = propId || params.id;
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
    let isMounted = true;
    fetchDataFromApi(`/api/appSettings/${id}`)
      .then((res) => {
        if (isMounted && res) setFormFields(res);
      })
      .catch((err) => logger.error(err));
    return () => {
      isMounted = false;
    };
  }, [id]);

  const submitForm = (e) => {
    e.preventDefault();
    editData(`/api/appSettings/${id}`, formFields)
      .then(() => {
        context.setAlertBox({ open: true, error: false, msg: "Updated!" });
        if (onSuccess) {
          onSuccess();
        } else {
          history("/appSettings");
        }
      })
      .catch((err) => {
        logger.error(err);
        context.setAlertBox({ open: true, error: true, msg: "Failed to update" });
      });
  };

  return (
    <form id={formId} className="form" onSubmit={submitForm}>
      <div className="card p-4 mt-0">
          <div className="form-group">
            <h6>NAME</h6>
            <input
              type="text"
              value={formFields.name}
              onChange={(e) =>
                setFormFields({ ...formFields, name: e.target.value })
              }
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
          {!hideActions && (
            <Button
              variant="contained"
              type="submit"
              className="btn-blue btn-lg btn-big mt-2"
              fullWidth
            >
              Update
            </Button>
          )}
        </div>
    </form>
  );
};

export default EditAppSetting;
