// components/AddNote.tsx
'use client';
import React, { useState } from 'react';

interface AddNoteProps {
  onAdd: (newNote: { id: number; title: string; content: string }) => void;
}

const AddNote: React.FC<AddNoteProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newNote = { title, content };
    const res = await fetch('/api/notes/create', {
      method: 'POST',
      body: JSON.stringify(newNote),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      const data = await res.json();
      console.log('Created note:', data);
      onAdd(data);
      setTitle('');
      setContent('');
    } else {
      console.error('Failed to add note');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="text-black border-2 border-black rounded p-2 w-full"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        className="text-black border-2 border-black rounded p-2 w-full"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        required
      />
      <button
        className="bg-purple-500 hover:bg-purple-700 rounded-full text-white font-bold py-2 px-4 ease-in-out duration-300"
        type="submit"
      >
        Add Note
      </button>
    </form>
  );
};

export default AddNote;
