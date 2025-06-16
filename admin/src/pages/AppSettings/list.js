import React, { useEffect, useState, useContext } from "react";
import { fetchDataFromApi, deleteData, editData } from "../../utils/api";
import logger from "../../utils/logger";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import AddAppSetting from "./add";
import Switch from "@mui/material/Switch";
import { MyContext } from "../../App";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import { emphasize, styled } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

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
    <Container className="right-content" maxWidth={false}>
      <div className="card shadow border-0 w-100 p-4">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
        >
          <h5 className="mb-0">App Settings</h5>
          <Box display="flex" alignItems="center">
            <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs_">
              <StyledBreadcrumb
                component="a"
                href="#"
                label="Dashboard"
                icon={<HomeIcon fontSize="small" />}
              />
              <StyledBreadcrumb label="App Settings" deleteIcon={<ExpandMoreIcon />} />
            </Breadcrumbs>
            <Button
              variant="contained"
              className="ml-3"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Close" : "Add Setting"}
            </Button>
          </Box>
        </Box>
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
    </Container>
  );
};

export default AppSettingsList;

