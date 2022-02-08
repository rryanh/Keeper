import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";

function Note(props) {
  function handleClick() {
    props.onDelete({ title: props.title, context: props.content });
  }

  return (
    <div className="b">
      <div className="card note ">
        <div className="card-body ">
          <h3 className="card-title">{props.title}</h3>
          <p className="card-text">{props.content}</p>
          <button className="trash" onClick={handleClick}>
            <DeleteIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Note;
