import NoteList from './_components/NoteList';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-start h-screen'>
      <h1 className='text-3xl mt-20 mb-20 font-bold'>Welcome to Notes App</h1>
      <NoteList />
    </div>
  );
}
