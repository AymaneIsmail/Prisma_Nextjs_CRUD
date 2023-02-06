import Head from 'next/head'
import { useState } from 'react'
import { prisma } from 'lib/prisma'
import {useRouter} from 'next/router'

interface FormData {
  title: string
  content: string
  id: string
}

interface Notes {
  notes: {
    id: string
    title: string
    content: string
  }[]
}

export default function Home({ notes }: Notes) {
  const [form, setForm] = useState<FormData>({ title: '', content: '', id: '' })
  
  /**
   * Directly displays data 
   */
  const router = useRouter();
  function refreshData(){
    router.replace(router.asPath)
  }
  /**
   * Create Note
   */
  async function createNote(data: FormData) {
    if(data.id){
      console.log(data.id)
      console.log(form)
       updateNote(data.id, form);
       return;
    }
    try {
      const response = fetch('http://localhost:3000/api/create', {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })
      
      // Promise.all([response]).then(value => console.log(value))
      response.then(() => {
        setForm({ title: '', content: '', id: '' })
        refreshData()
      })
    
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Delete Note
   */
  async function deleteNote(id: string){
    try {
      const response = fetch(`http://localhost:3000/api/note/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      })
      
      // Promise.all([response]).then(value => console.log(value))
      response.then(() => {
        refreshData()
      })
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Update Note
   */

  async function updateNote(id: string, data: FormData) {
    try {
      const response = fetch(`http://localhost:3000/api/note/${id}`, {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PUT',
      })
      
      // Promise.all([response]).then(value => console.log(value))
      response.then(() => {
        refreshData()
      })
    }catch (error) {
      console.log(error)
    } 
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto mt-4">
        <h1 className="text-4xl text-black text-center mb-4">Prisma project</h1>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            createNote(form)
          }}
          className="w-auto min-w-[25%] max-w-min mx-auto space-y-6 flex flex-col items-stretch"
        >
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(event) =>
              setForm({ ...form, title: event.target.value })
            }
            className="border-2 rounded border-gray-600 p-1"
          />
          <textarea
            placeholder="Content"
            value={form.content}
            onChange={(event) =>
              setForm({ ...form, content: event.target.value })
            }
            className="border-2 rounded border-gray-600 p-1"
          />
          <button type="submit" className="bg-blue-500 text-white rounded p-1">
            Add +
          </button>
        </form>
        <div className="w-auto min-w-[25%] max-w-min mx-auto mt-20 space-y-6 flex flex-col items-stretch">
          <ul>
            {notes.map((note) => (
              <li key={note.id} className="border-b border-gray-400 p-2">
                <div className="flex justify-between">
                  <div className="flex-1">
                  <h3 className="font-bold">{note.title}</h3>
                  <p className="text-sm">{note.content}</p>
                  </div>
                  <button onClick={() => {
                    setForm({title: note.title, content: note.content, id: note.id});
                  }} 
                  className="bg-blue-600 py-1 px-6 rounded text-white text-sm"
                  >Update </button>
                  <button onClick={() => deleteNote(note.id)} 
                  className="bg-red-600 py-1 px-6 rounded text-white text-sm"
                  >Delete </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  )
}

export async function getServerSideProps() {
  const notes = await prisma.note.findMany({
    select: {
      title: true,
      content: true,
      id: true,
    },
  })

  return {
    props: {
      notes,
    },
  }
}
