
// import React, { useEffect, useState } from 'react';
// import Nav from '../Nav/Nav';
// import { ColorPicker } from 'antd';
// import type { Color } from 'antd/es/color-picker';
// import 'antd/dist/reset.css';

// interface Note {
//   id: number;
//   title: string;
//   description: string;
//   color: string; 
//   position: {
//     x: number;
//     y: number;
//   };
// }

// const DEFAULT_COLOR = '#fff6ca';
// const DEFAULT_HEADER_COLOR = '#fceda1';

// const Index: React.FC = () => {

//   const [showModal, setShowModal] = useState(false);
//   const [noteTitle, setNoteTitle] = useState('');
//   const [noteDescription, setNoteDescription] = useState('');
//   const [notes, setNotes] = useState<Note[]>([]);
//   const [deletingId, setDeletingId] = useState<number | null>(null);
//   const [editingNote, setEditingNote] = useState<Note | null>(null);
//   const [hasLoaded, setHasLoaded] = useState(false);
//   const [pickedColor, setPickedColor] = useState<string>(DEFAULT_COLOR);
//   const [pickedHeaderColor, setPickedHeaderColor] = useState<string>(DEFAULT_HEADER_COLOR);

//   useEffect(() => {
//     try {
//       const storedNotes = localStorage.getItem('sticky_notes');
//       if (storedNotes) {
//         const parsed: Note[] = JSON.parse(storedNotes).map((note: any) => ({
//           ...note,
//           position: typeof note.position === 'string' ? JSON.parse(note.position) : note.position,
//         }));
//         setNotes(parsed);
//       }
//     } catch (err) {
//       console.error('Failed to load notes from localStorage', err);
//     } finally {
//       setHasLoaded(true);
//     }
//   }, []);

//   useEffect(() => {
//     if (!hasLoaded) return;
//     try {
//       localStorage.setItem('sticky_notes', JSON.stringify(notes));
//     } catch (err) {
//       console.error('Failed to save notes to localStorage');
//     }
//   }, [notes, hasLoaded]);

//   const openModal = () => {
//     setShowModal(true);
//     setPickedColor(DEFAULT_COLOR);
//     setPickedHeaderColor(DEFAULT_HEADER_COLOR);
//     setNoteTitle('');
//     setNoteDescription('');
//     setEditingNote(null);
//   };

//   const addOrUpdateNote = () => {
//     if (!noteTitle.trim() || !noteDescription.trim()) return;

//     if (editingNote) {
//       setNotes(prevNotes =>
//         prevNotes.map(n =>
//           n.id === editingNote.id
//             ? { ...n, title: noteTitle, description: noteDescription, color: pickedColor }
//             : n
//         )
//       );
//       setEditingNote(null);
//     } else {
//       const centerX = window.innerWidth / 3;
//       const centerY = window.innerHeight / 3;
//       const randomOffsetX = Math.floor(Math.random() * 200) - 100;
//       const randomOffsetY = Math.floor(Math.random() * 200) - 100;

//       const newNote: Note = {
//         id: Date.now(),
//         title: noteTitle,
//         description: noteDescription,
//         color: pickedColor,
//         position: {
//           x: centerX + randomOffsetX,
//           y: centerY + randomOffsetY,
//         },
//       };
//       setNotes([...notes, newNote]);
//     }

//     setNoteTitle('');
//     setNoteDescription('');
//     setShowModal(false);
//   };

//   const deleteNote = (id: number) => {
//     setDeletingId(id);
//     requestAnimationFrame(() => {
//       setTimeout(() => {
//         setNotes((prev) => prev.filter((note) => note.id !== id));
//         setDeletingId(null);
//       }, 600);
//     });
//   };

//   const editNote = (note: Note) => {
//     setEditingNote(note);
//     setNoteTitle(note.title);
//     setNoteDescription(note.description);
//     setPickedColor(note.color || DEFAULT_COLOR);
//     setShowModal(true);
//   };

//   const handleDrag = (e: React.MouseEvent, id: number) => {
//     const cardRef = (e.target as HTMLElement).closest('.note-col') as HTMLElement | null;
//     if (!cardRef) return;

//     const note = notes.find((n) => n.id === id);
//     if (!note) return;

//     const startPos = { x: e.clientX, y: e.clientY };
//     const initialPos = note.position;

//     const handleMouseMove = (moveEvent: MouseEvent) => {
//       const dx = moveEvent.clientX - startPos.x;
//       const dy = moveEvent.clientY - startPos.y;

//       const newPos = {
//         x: initialPos.x + dx,
//         y: initialPos.y + dy,
//       };

//       setNotes((prevNotes) =>
//         prevNotes.map((n) => (n.id === id ? { ...n, position: newPos } : n))
//       );
//     };

//     const handleMouseUp = () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//       window.removeEventListener('mouseup', handleMouseUp);
//     };

//     window.addEventListener('mousemove', handleMouseMove);
//     window.addEventListener('mouseup', handleMouseUp);
//   };

//   return (
//     <>
//       <Nav onAddNote={openModal} />
//       <main className="w-full h-screen px-[12%] py-12 bg-background transition-colors duration-300 relative overflow-hidden">
//         <div className="relative w-full h-full">
//           {notes.map((note) => {
//             const { x, y } = note.position;
//             return (
//               <div
//                 key={note.id}
//                 className={`note-col absolute ${deletingId === note.id ? 'animate-delete' : ''} w-[400px] min-h-[200px] border border-white/10 flex flex-col rounded-xl overflow-hidden transition-transform duration-300`}
//                 style={{
//                   top: y,
//                   left: x,
//                   cursor: 'move',
//                   background: note.color || DEFAULT_COLOR,
//                 }}
//                 onMouseDown={(e) => handleDrag(e, note.id)}
//               >
//                 <div
//                   className="flex justify-between items-center px-5 py-2 transition-colors duration-300"
//                   style={{ background: note.color || DEFAULT_HEADER_COLOR }}
//                 >
//                   <i className="ri-delete-bin-line cursor-pointer text-xl text-black" onClick={() => deleteNote(note.id)}></i>
//                   <i className="ri-edit-line cursor-pointer text-xl text-black ml-2" onClick={() => editNote(note)}></i>
//                   {/* Color Picker for editing note color */}
//                   <ColorPicker
//                     value={note.color || DEFAULT_COLOR}
//                     onChange={(color: Color) => {
//                       setNotes((prev) =>
//                         prev.map((n) =>
//                           n.id === note.id ? { ...n, color: color.toHexString() } : n
//                         )
//                       );
//                     }}
//                     showText={false}
//                     size="small"
//                     style={{ marginLeft: 8 }}
//                   />
//                 </div>
//                 <div className="p-6">
//                   <h2 className="mb-5 text-black font-bricolage text-2xl">{note.title}</h2>
//                   <p className="text-black font-bricolage text-lg">{note.description}</p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//         {/* Modal */}
//         {showModal && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
//             <div className="bg-white p-8 rounded-2xl w-[90%] max-w-[400px] shadow-modal font-bricolage flex flex-col gap-4">
//               <h2 className="text-xl text-black font-bricolage font-bold mb-2">{editingNote ? 'Edit Note' : 'Add New Note'}</h2>
//               <input
//                 type="text"
//                 placeholder="Note title"
//                 value={noteTitle}
//                 onChange={(e) => setNoteTitle(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded focus:border-secondary mb-2"
//               />
//               <textarea
//                 rows={4}
//                 placeholder="Note Description"
//                 value={noteDescription}
//                 onChange={(e) => setNoteDescription(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded focus:border-secondary mb-2"
//               ></textarea>
//               <div className="flex items-center gap-4 mb-2">
//                 <span className="text-black font-medium">Color:</span>
//                 <ColorPicker
//                   value={pickedColor}
//                   onChange={(color: Color) => setPickedColor(color.toHexString())}
//                   showText={true}
//                   size="small"
//                 />
//               </div>
//               <div className="flex justify-end gap-2 mt-2">
//                 <button
//                   className="px-4 py-2 rounded bg-gray-300 font-bricolage text-base"
//                   onClick={() => {
//                     setShowModal(false);
//                     setEditingNote(null);
//                   }}
//                 >
//                   Close
//                 </button>
//                 <button
//                   className="px-4 py-2 rounded bg-primary text-white font-bricolage text-base transition duration-300 hover:bg-secondary font-bold"
//                   onClick={addOrUpdateNote}
//                 >
//                   {editingNote ? 'Save Changes' : 'Add Note'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </>
//   );
// };

// export default Index;



// import React, { useEffect, useMemo, useState } from 'react'
// import Nav from '../Nav/Nav'
// import Note from '../Note/Note'
// import type { NoteData } from '../Note/Note'

// const DEFAULT_COLOR = '#fff6ca'

// const Index: React.FC = () => {
//   const [notes, setNotes] = useState<NoteData[]>([])
//   const [deletingId, setDeletingId] = useState<number | null>(null)
//   const [hasLoaded, setHasLoaded] = useState(false)
//   const [editingIds, setEditingIds] = useState<Set<number>>(new Set())

//   useEffect(() => {
//     try {
//       const stored = localStorage.getItem('sticky_notes')
//       if (stored) {
//         const parsed: NoteData[] = JSON.parse(stored).map((n: any) => ({
//           id: n.id,
//           title: n.title || '',
//           description: n.description || '',
//           color: n.color || DEFAULT_COLOR,
//           position: typeof n.position === 'string' ? JSON.parse(n.position) : n.position,
//         }))
//         setNotes(parsed)
//       }
//     } catch (err) {
//       console.error('Failed to load notes from localStorage', err)
//     } finally {
//       setHasLoaded(true)
//     }
//   }, [])

//   useEffect(() => {
//     if (!hasLoaded) return
//     try {
//       localStorage.setItem('sticky_notes', JSON.stringify(notes))
//     } catch {
//       console.error('Failed to save notes to localStorage')
//     }
//   }, [notes, hasLoaded])

//   const addNote = () => {
//     const centerX = window.innerWidth / 3
//     const centerY = window.innerHeight / 3
//     const randomOffsetX = Math.floor(Math.random() * 200) - 100
//     const randomOffsetY = Math.floor(Math.random() * 200) - 100

//     const newNote: NoteData = {
//       id: Date.now(),
//       title: '',
//       description: '',
//       color: DEFAULT_COLOR,
//       position: { x: centerX + randomOffsetX, y: centerY + randomOffsetY },
//     }

//     setNotes(prev => [...prev, newNote])
//     setEditingIds(prev => new Set([...prev, newNote.id]))
//   }

//   const deleteNote = (id: number) => {
//     setDeletingId(id)
//     requestAnimationFrame(() => {
//       setTimeout(() => {
//         setNotes(prev => prev.filter(n => n.id !== id))
//         setDeletingId(null)
//         setEditingIds(prev => {
//           const next = new Set(prev)
//           next.delete(id)
//           return next
//         })
//       }, 600)
//     })
//   }

//   const updateNote = (id: number, data: Partial<Pick<NoteData, 'title' | 'description' | 'color'>>) => {
//     setNotes(prev => prev.map(n => (n.id === id ? { ...n, ...data } : n)))
//   }

//   const dragNote = (id: number, position: { x: number; y: number }) => {
//     setNotes(prev => prev.map(n => (n.id === id ? { ...n, position } : n)))
//   }

//   const startEdit = (id: number) => {
//     setEditingIds(prev => new Set([...prev, id]))
//   }

//   const finishEdit = (id: number) => {
//     setEditingIds(prev => {
//       const next = new Set(prev)
//       next.delete(id)
//       return next
//     })
//   }

//   const notesToRender = useMemo(() => notes, [notes])

//   return (
//     <>
//       <Nav onAddNote={addNote} />
//       <main className="w-full h-screen px-[12%] py-12 bg-background transition-colors duration-300 relative overflow-hidden">
//         <div className="relative w-full h-full">
//           {notesToRender.map(note => (
//             <Note
//               key={note.id}
//               note={note}
//               isEditing={editingIds.has(note.id)}
//               isDeleting={deletingId === note.id}
//               onStartEdit={startEdit}
//               onFinishEdit={finishEdit}
//               onUpdate={updateNote}
//               onDelete={deleteNote}
//               onDrag={dragNote}
//             />
//           ))}
//         </div>
//       </main>
//     </>
//   )
// }

// export default Index



import React, { useEffect, useMemo, useState } from 'react'
import Nav from '../Nav/Nav'
import Note from '../Note/Note'
import type { NoteData } from '../Note/Note'

const DEFAULT_COLOR = '#fff6ca'

const Index: React.FC = () => {
  const [notes, setNotes] = useState<NoteData[]>([])
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [editingIds, setEditingIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sticky_notes')
      if (stored) {
        const parsed: NoteData[] = JSON.parse(stored).map((n: any) => ({
          id: n.id,
          title: n.title || '',
          description: n.description || '',
          color: n.color || DEFAULT_COLOR,
          position: typeof n.position === 'string' ? JSON.parse(n.position) : n.position,
        }))
        setNotes(parsed)
      }
    } catch (err) {
      console.error('Failed to load notes from localStorage', err)
    } finally {
      setHasLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (!hasLoaded) return
    try {
      localStorage.setItem('sticky_notes', JSON.stringify(notes))
    } catch {
      console.error('Failed to save notes to localStorage')
    }
  }, [notes, hasLoaded])

  const addNote = () => {
    const centerX = window.innerWidth / 3
    const centerY = window.innerHeight / 3
    const randomOffsetX = Math.floor(Math.random() * 200) - 100
    const randomOffsetY = Math.floor(Math.random() * 200) - 100

    const newNote: NoteData = {
      id: Date.now(),
      title: '',
      description: '',
      color: DEFAULT_COLOR,
      position: { x: centerX + randomOffsetX, y: centerY + randomOffsetY },
    }

    setNotes(prev => [...prev, newNote])
    setEditingIds(prev => new Set([...prev, newNote.id]))
  }

  const deleteNote = (id: number) => {
    setDeletingId(id)
    requestAnimationFrame(() => {
      setTimeout(() => {
        setNotes(prev => prev.filter(n => n.id !== id))
        setDeletingId(null)
        setEditingIds(prev => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      }, 600)
    })
  }

  const updateNote = (id: number, data: Partial<Pick<NoteData, 'title' | 'description' | 'color'>>) => {
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, ...data } : n)))
  }

  const dragNote = (id: number, position: { x: number; y: number }) => {
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, position } : n)))
  }

  const bringToFront = (id: number) => {
    setNotes(prev => {
      const idx = prev.findIndex(n => n.id === id)
      if (idx === -1 || idx === prev.length - 1) return prev
      const next = prev.slice()
      const [item] = next.splice(idx, 1)
      next.push(item)
      return next
    })
  }

  const startEdit = (id: number) => {
    setEditingIds(prev => new Set([...prev, id]))
  }

  const finishEdit = (id: number) => {
    setEditingIds(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const notesToRender = useMemo(() => notes, [notes])

  return (
    <>
      <Nav onAddNote={addNote} />
      <main className="w-full h-screen px-[12%] py-12 bg-background transition-colors duration-300 relative overflow-hidden">
        <div className="relative w-full h-full">
          {notesToRender.map(note => (
            <Note
              key={note.id}
              note={note}
              isEditing={editingIds.has(note.id)}
              isDeleting={deletingId === note.id}
              onStartEdit={startEdit}
              onFinishEdit={finishEdit}
              onUpdate={updateNote}
              onDelete={deleteNote}
              onDrag={dragNote}
              onBringToFront={bringToFront}
            />
          ))}
        </div>
      </main>
    </>
  )
}

export default Index