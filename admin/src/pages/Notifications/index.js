import { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { AddButton, DeleteButton } from "../../components/common/ActionButtons";
import AdminPageLayout from "../../components/common/AdminPageLayout";
import BaseTable from "../../components/common/BaseTable";
import { MyContext } from "../../App";
import { fetchDataFromApi, editData, deleteData } from "../../utils/api";
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationForm from './NotificationForm';
import logger from "../../utils/logger";


const Notifications = () => {
  const [list, setList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const context = useContext(MyContext);

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

  if (showForm) {
    return (
      <NotificationForm
        onCancel={() => setShowForm(false)}
        onSuccess={() => {
          setShowForm(false);
          load();
        }}
      />
    );
  }

  return (
    <AdminPageLayout
      title="Notifications"
      breadcrumbPath={[
        { icon: <HomeIcon fontSize="inherit" />, label: 'Dashboard', href: '/' },
        { icon: <NotificationsIcon fontSize="inherit" />, label: 'Notifications', href: '/notifications' },
      ]}
      actions={<AddButton onClick={() => setShowForm(true)} label="Add Notification" />}
    >

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


