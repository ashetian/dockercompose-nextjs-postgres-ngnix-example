'use client';

import React, { useEffect, useState } from 'react';
import AddNote from './AddNote'; // Assuming AddNote is a separate component

interface Note {
  id: number;
  title: string;
  content: string;
}

const NoteList = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch('/api/notes/list');
        if (!res.ok) throw new Error('Failed to fetch notes');
        const data = await res.json();
        setNotes(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotes();
  }, []);

  const addNote = (newNote: Note) => {
    setNotes((prevNotes) => [newNote, ...prevNotes]);
  };

  const deleteNote = async (id: number) => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete note');

      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold">Notes</h1>
      <AddNote onAdd={addNote} />
      <ul>
        {notes.map((note) => (
          <li key={note.id} className="my-4 ease-in-out delay-300">
            <h2 className="text-xl font-bold">{note.title}</h2>
            <p className="text-sm">{note.content}</p>
            <button
              onClick={() => deleteNote(note.id)}
              className="bg-red-500 hover:bg-red-700 ease-in-out delay-300 text-white px-2 py-1 rounded mt-2"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoteList;
