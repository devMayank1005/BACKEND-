import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [notes, setNotes] = useState([]);

  function fetchNotes() {
    axios.get("http://localhost:3000/api/notes")
      .then((res) => setNotes(res.data.notes))
      .catch(console.error);
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    const title = e.target.title.value;
    const description = e.target.description.value;

    axios.post("http://localhost:3000/api/notes", { title, description })
      .then(() => {
        fetchNotes();
        e.target.reset();
      });
  }
  function handleDelete(id) {
    axios.delete(`http://localhost:3000/api/notes/${id}`)
      .then(() => {
        fetchNotes();
      });
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" required />
        <textarea name="description" placeholder="Description" required />
        <button type="submit">Add Note</button>
      </form>

      <div className="notes">
        {notes.map((note) => (
          <div className="note" key={note._id}>
            <h1>{note.title}</h1>
            <p>{note.description}</p>
            <button onClick={() => handleDelete(note._id)}>Delete </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
