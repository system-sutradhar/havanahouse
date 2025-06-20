import { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { AddButton, SaveButton, CancelButton, DeleteButton } from "../../components/common/ActionButtons";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import AdminFormLayout from "../../components/common/AdminFormLayout";
import Box from "@mui/material/Box";
import AdminPageLayout from "../../components/common/AdminPageLayout";
import AppBreadcrumbs from "../../components/common/AppBreadcrumbs";
import BaseModal from "../../components/common/BaseModal";
import BaseTable from "../../components/common/BaseTable";
import { MyContext } from "../../App";
import { fetchDataFromApi, postData, editData, deleteData, uploadImage } from "../../utils/api";
import logger from "../../utils/logger";


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
    <AdminPageLayout
      title="Notifications"
      breadcrumbPath={[{ label: 'Dashboard', href: '/' }]}
      actions={<AddButton onClick={() => setOpenModal(true)} label="Add Notification" />}
    >

      <BaseModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Add Notification"
        actions={
          <>
            <CancelButton onClick={() => setOpenModal(false)} />
            <AddButton form="add-notification-form" type="submit" label="Add" />
          </>
        }
      >
        <AdminFormLayout>
          <Grid container spacing={3} id="add-notification-form" component="form" onSubmit={addNotification}>
            <Grid item xs={12}>
              <TextField
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                label="Notification Message"
                fullWidth
                size="small"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <input type="file" accept="image/*" onChange={handleFile} />
              {preview && (
                <Box mt={2}>
                  <img src={preview} alt="preview" width={100} loading="lazy" />
                </Box>
              )}
            </Grid>
          </Grid>
        </AdminFormLayout>
      </BaseModal>

      <div className="card shadow border-0 p-3 mt-4">
        <BaseTable
          columns={[
            {
              label: 'Image',
              field: 'image',
              render: (row) =>
                row.image ? <img src={row.image} alt="banner" width={60} loading="lazy" /> : null,
            },
            { label: 'Message', field: 'message' },
            {
              label: 'Status',
              field: 'isPublished',
              render: (row) =>
                row.isPublished ? (
                  <Button size="small" onClick={() => unpublish(row.id)}>
                    Unpublish
                  </Button>
                ) : (
                  <Button size="small" onClick={() => publish(row.id)}>
                    Publish
                  </Button>
                ),
            },
          ]}
          rows={list}
          onDelete={(row) => remove(row.id)}
        />
      </div>
    </AdminPageLayout>
  );
};

export default Notifications;


