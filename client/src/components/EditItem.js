import React, { useState } from "react";
import { toast } from "react-toastify";

export default function EditItem({ item, setItemWasChanged }) {
  const [description, setDescription] = useState(item.description);

  const editText = async id => {
    try {
      const body = { description };

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      await fetch(`http://localhost:5000/dashboard/items/${id}`, {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(body),
      });

      setItemWasChanged(true);
    } catch (err) {
      console.error(err.message);
      toast.error("Error occured. Could not edit item. Try again.");
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn-sm btn-warning"
        data-toggle="modal"
        data-target={`#id${item.item_id}`}
      >
        Edit
      </button>

      <div
        className="modal fade"
        id={`id${item.item_id}`}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        onClick={() => setDescription(item.description)}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit Item
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <input
                className="form-control"
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
              ></input>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={() => setDescription(item.description)}
              >
                Close
              </button>
              <button
                onClick={() => editText(item.item_id)}
                type="button"
                className="btn btn-primary"
                data-dismiss="modal"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
