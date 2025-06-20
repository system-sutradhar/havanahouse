import { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import { emphasize, styled } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import { MdClose } from "react-icons/md";
import { MyContext } from "../../App";
import { fetchDataFromApi, postData, editData, deleteData, uploadImage } from "../../utils/api";
import logger from "../../utils/logger";

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

const Notifications = () => {
  const [message, setMessage] = useState("");
  const [list, setList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState(null);
  const context = useContext(MyContext);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await uploadImage('/api/notifications/upload', formData);
      setImage(res.data.url);
      setPreview(res.data.url);
    } catch (err) {
      logger.error(err);
    }
  };

  const load = () => {
    fetchDataFromApi('/api/notifications')
      .then((res) => setList(Array.isArray(res) ? res : []))
      .catch((err) => {
        logger.error(err);
        context.setAlertBox({ open: true, error: true, msg: 'Failed to load' });
      });
  };

  useEffect(() => {
    let isMounted = true;
    window.scrollTo(0, 0);
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const addNotification = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    context.setProgress(30);
    postData('/api/notifications', { message, image })
      .then(() => {
        setMessage("");
        setImage("");
        setPreview(null);
        load();
        context.setProgress(100);
        context.setAlertBox({ open: true, error: false, msg: 'Added!' });
      })
      .catch((err) => {
        logger.error(err);
        context.setProgress(100);
        context.setAlertBox({ open: true, error: true, msg: 'Failed to add' });
      });
  };

  const publish = (id) => {
    editData(`/api/notifications/${id}/publish`)
      .then(() => {
        context.setAlertBox({ open: true, error: false, msg: 'Published!' });
        load();
      })
      .catch((err) => logger.error(err));
  };

  const unpublish = (id) => {
    editData(`/api/notifications/${id}/unpublish`)
      .then(() => {
        context.setAlertBox({ open: true, error: false, msg: 'Unpublished!' });
        load();
      })
      .catch((err) => logger.error(err));
  };

  const remove = (id) => {
    deleteData(`/api/notifications/${id}`)
      .then(() => {
        context.setAlertBox({ open: true, error: false, msg: 'Deleted!' });
        load();
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
          <h5 className="mb-0">Notifications</h5>
          <Box display="flex" alignItems="center">
            <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs_">
              <StyledBreadcrumb
                component="a"
                href="#"
                label="Dashboard"
                icon={<HomeIcon fontSize="small" />}
              />
              <StyledBreadcrumb label="Notifications" deleteIcon={<ExpandMoreIcon />} />
            </Breadcrumbs>
            <Button
              className="btn-blue ml-3 pl-3 pr-3"
              onClick={() => setOpenModal(true)}
            >
              Add Notification
            </Button>
          </Box>
        </Box>
      </div>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
        <DialogTitle className="d-flex justify-content-between align-items-center">
          Add Notification
          <IconButton onClick={() => setOpenModal(false)}>
            <MdClose />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <form id="add-notification-form" onSubmit={addNotification}>
            <TextField
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              label="Notification Message"
              fullWidth
              size="small"
              required
              sx={{ mb: 2 }}
            />
            <input type="file" accept="image/*" onChange={handleFile} />
            {preview && (
              <div className="mt-2">
                <img src={preview} alt="preview" width="100" loading="lazy" />
              </div>
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            form="add-notification-form"
            type="submit"
            className="btn-blue"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <div className="card shadow border-0 p-3 mt-4">
        <div className="table-responsive mt-3">
          <table className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Image</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.image && (
                      <img src={item.image} alt="banner" width="60" loading="lazy" />
                    )}
                  </td>
                  <td>{item.message}</td>
                  <td>{item.isPublished ? "Published" : "Draft"}</td>
                  <td>
                    {item.isPublished ? (
                      <Button size="small" onClick={() => unpublish(item.id)}>
                        Unpublish
                      </Button>
                    ) : (
                      <Button size="small" onClick={() => publish(item.id)}>
                        Publish
                      </Button>
                    )}
                    <Button color="error" size="small" onClick={() => remove(item.id)}>
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

export default Notifications;


