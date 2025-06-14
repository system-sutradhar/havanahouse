import React, { useEffect, useState, useContext } from "react";
import { fetchDataFromApi, deleteData, editData } from "../../utils/api";
import logger from "../../utils/logger";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import AddAppSetting from "./add";
import Switch from "@mui/material/Switch";
import { MyContext } from "../../App";

const AppSettingsList = () => {
  const [settings, setSettings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const context = useContext(MyContext);

  const getData = () => {
    fetchDataFromApi("/api/appSettings")
      .then((res) => {
        if (Array.isArray(res)) setSettings(res);
      })
      .catch((err) => {
        logger.error(err);
        context.setAlertBox({ open: true, error: true, msg: "Failed to load" });
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const toggleField = (id, field, current) => {
    const item = settings.find((s) => s.id === id);
    if (!item) return;
    const updated = { ...item, [field]: !current };
    editData(`/api/appSettings/${id}`, updated)
      .then(() => getData())
      .catch((err) => logger.error(err));
  };

  const deleteItem = (id) => {
    deleteData(`/api/appSettings/${id}`)
      .then(() => {
        context.setAlertBox({ open: true, error: false, msg: "Deleted!" });
        getData();
      })
      .catch((err) => logger.error(err));
  };

  return (
    <div className="right-content w-100">
      <div className="card shadow border-0 w-100 flex-row p-4 align-items-center">
        <h5 className="mb-0">App Settings</h5>
        <div className="ml-auto">
          <Button variant="contained" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Close" : "Add Setting"}
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="card shadow border-0 p-3 mt-4">
          <AddAppSetting onSuccess={() => { setShowForm(false); getData(); }} />
        </div>
      )}

      <div className="card shadow border-0 p-3 mt-4">
        <div className="table-responsive mt-3">
          <table className="table table-bordered table-striped">
            <thead className="thead-dark">
              <tr>
                <th>Name</th>
                <th>Prelogin</th>
                <th>Postlogin</th>
                <th>Desktop</th>
                <th>Mobile</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {settings.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>
                    <Switch
                      checked={item.prelogin}
                      onChange={() => toggleField(item.id, "prelogin", item.prelogin)}
                    />
                  </td>
                  <td>
                    <Switch
                      checked={item.postlogin}
                      onChange={() => toggleField(item.id, "postlogin", item.postlogin)}
                    />
                  </td>
                  <td>
                    <Switch
                      checked={item.desktop}
                      onChange={() => toggleField(item.id, "desktop", item.desktop)}
                    />
                  </td>
                  <td>
                    <Switch
                      checked={item.mobile}
                      onChange={() => toggleField(item.id, "mobile", item.mobile)}
                    />
                  </td>
                  <td>
                    <Link to={`/appSettings/edit/${item.id}`}>Edit</Link>
                    {" | "}
                    <Button size="small" onClick={() => deleteItem(item.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AppSettingsList;

