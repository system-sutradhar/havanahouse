import { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { MyContext } from "../../App";
import { fetchDataFromApi, postData, editData, deleteData } from "../../utils/api";

const Notifications = () => {
  const [message, setMessage] = useState("");
  const [list, setList] = useState([]);
  const context = useContext(MyContext);

  const load = () => {
    fetchDataFromApi('/api/notifications').then(setList);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    load();
  }, []);

  const addNotification = () => {
    if (!message.trim()) return;
    context.setProgress(30);
    postData('/api/notifications', { message }).then(() => {
      setMessage("");
      load();
      context.setProgress(100);
    });
  };

  const publish = (id) => {
    editData(`/api/notifications/${id}/publish`).then(load);
  };

  const unpublish = (id) => {
    editData(`/api/notifications/${id}/unpublish`).then(load);
  };

  const remove = (id) => {
    deleteData(`/api/notifications/${id}`).then(load);
  };

  return (
    <div className="right-content w-100">
      <div className="card shadow border-0 w-100 flex-row p-4 align-items-center">
        <h5 className="mb-0">Notifications</h5>
      </div>

      <div className="card shadow border-0 p-3 mt-4">
        <div className="d-flex mb-3">
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            label="Notification Message"
            className="mr-3"
            fullWidth
            size="small"
          />
          <Button variant="contained" onClick={addNotification}>
            Add
          </Button>
        </div>
        <div className="table-responsive mt-3">
          <table className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.id}>
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
    </div>
  );
};

export default Notifications;

