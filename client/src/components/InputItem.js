import React, { useState } from "react";
// import { phrson-check} from "boostrap-icons"

export default function InputItem({ name, guestName, setItemWasChanged }) {
  const [description, setDescription] = useState("");

  const handleUserInput = e => setDescription(e.target.value);

  const handleFormSubmit = async e => {
    e.preventDefault();
    try {
      const body = { description };

      const myHeaders = new Headers();

      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("token", localStorage.token);

      await fetch("http://localhost:5000/dashboard/items", {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(body),
      });

      setItemWasChanged(true);
      setDescription("");
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <div className="text-center">
        <h1 className="display-4 my-2">Sidebar List</h1>
        {name && (
          <>
            <p>
              <i className="bi bi-person-check px-1"></i>
              {`${name} signed in`}
            </p>
          </>
        )}
        {guestName && (
          <p>
            <i className="bi bi-people px-1"></i>
            {`${guestName} can edit this list`}
          </p>
        )}
      </div>
      <div className="justify-content-center">
        <form
          className="d-flex justify-content-center"
          onSubmit={handleFormSubmit}
        >
          <input
            type="text"
            placeholder="add item"
            className="form-control mx-1 col-xs-2 col-sm-4 col-md-5"
            value={description}
            onChange={handleUserInput}
          ></input>
          <button className="btn btn-success">add</button>
        </form>
      </div>
    </>
  );
}
