import React, { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";
import { AJAX } from "../helper";

function CreateArea(props) {
  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  const [show, setShow] = useState(false);

  function display() {
    setShow(true);
  }

  function showContent() {
    return (
      <div>
        <textarea
          name="content"
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows="3"
        />
        <Zoom in={true}>
          <Fab type="submit" value="Submit">
            <AddIcon />
          </Fab>
        </Zoom>
      </div>
    );
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value,
      };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", note.title);
    formData.append("content", note.content);

    AJAX("/notes", {
      body: JSON.stringify(note),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    props.onAdd();
    setNote({
      title: "",
      content: "",
    });
    setShow(false);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="create-note">
        <input
          onClick={display}
          name="title"
          onChange={handleChange}
          value={note.title}
          placeholder="Title"
        />
        {show && showContent()}
      </form>
    </div>
  );
}

export default CreateArea;
