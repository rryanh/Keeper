import React, { useState } from "react";
import Note from "./Note";
import CreateArea from "./CreateArea";
import { AJAX } from "../helper";
import Masonry from "@mui/lab/Masonry";

export default function Home() {
  const [notes, setNotes] = useState([]);

  async function addNote() {
    const newNotes = await AJAX("/notes");

    if (newNotes === notes) return;

    setNotes(newNotes);
  }

  addNote();

  function deleteNote(note) {
    AJAX("/notes", {
      method: "DELETE",
      body: JSON.stringify(note),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    addNote();
  }

  function showCards() {
    return (
      <div>
        <CreateArea onAdd={addNote} />
        <div className="container">
          <Masonry columns={3} spacing={{ sm: 2, md: 3 }}>
            {notes.map((noteItem, index) => {
              return (
                <Note
                  key={index}
                  id={index}
                  title={noteItem.title}
                  content={noteItem.content}
                  onDelete={deleteNote}
                />
              );
            })}
          </Masonry>
        </div>
      </div>
    );
  }

  return showCards();
}
