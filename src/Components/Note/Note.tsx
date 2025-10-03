// import React, { useCallback, useEffect, useMemo, useRef } from 'react'
// import { Button, ColorPicker, Form, Input, Modal } from 'antd'
// import type { Color } from 'antd/es/color-picker'
// import TipTapEditor from './TipTapEditor'

// export interface NoteData {
//   id: number
//   title: string
//   description: string
//   color: string
//   position: { x: number; y: number }
// }

// interface NoteProps {
//   note: NoteData
//   isEditing: boolean
//   isDeleting: boolean
//   onStartEdit: (id: number) => void
//   onFinishEdit: (id: number) => void
//   onUpdate: (id: number, data: Partial<Pick<NoteData, 'title' | 'description' | 'color'>>) => void
//   onDelete: (id: number) => void
//   onDrag: (id: number, position: { x: number; y: number }) => void
// }

// const Note: React.FC<NoteProps> = ({
//   note,
//   isEditing,
//   isDeleting,
//   onStartEdit,
//   onFinishEdit,
//   onUpdate,
//   onDelete,
//   onDrag,
// }) => {
//   const [form] = Form.useForm()
//   const draggingRef = useRef({
//     isDragging: false,
//     startX: 0,
//     startY: 0,
//     initialX: note.position.x,
//     initialY: note.position.y,
//   })

//   useEffect(() => {
//     form.setFieldsValue({
//       title: note.title,
//       description: note.description,
//       color: note.color,
//     })
//   }, [form, note.title, note.description, note.color])

//   const handleMouseDown = useCallback((e: React.MouseEvent) => {
//     const target = e.target as HTMLElement
//     if (target.closest('.no-drag')) return

//     draggingRef.current.isDragging = true
//     draggingRef.current.startX = e.clientX
//     draggingRef.current.startY = e.clientY
//     draggingRef.current.initialX = note.position.x
//     draggingRef.current.initialY = note.position.y

//     const handleMouseMove = (moveEvent: MouseEvent) => {
//       if (!draggingRef.current.isDragging) return
//       const dx = moveEvent.clientX - draggingRef.current.startX
//       const dy = moveEvent.clientY - draggingRef.current.startY
//       onDrag(note.id, { x: draggingRef.current.initialX + dx, y: draggingRef.current.initialY + dy })
//     }

//     const handleMouseUp = () => {
//       draggingRef.current.isDragging = false
//       window.removeEventListener('mousemove', handleMouseMove)
//       window.removeEventListener('mouseup', handleMouseUp)
//     }

//     window.addEventListener('mousemove', handleMouseMove)
//     window.addEventListener('mouseup', handleMouseUp)
//   }, [note.id, note.position.x, note.position.y, onDrag])

//   const confirmDelete = useCallback(() => {
//     Modal.confirm({
//       title: 'Are you sure you want to delete this note?',
//       content: 'This action cannot be undone.',
//       okText: 'Yes, delete',
//       cancelText: 'Cancel',
//       okButtonProps: { danger: true },
//       onOk: () => onDelete(note.id),
//     })
//   }, [note.id, onDelete])

//   const onSubmit = useCallback(() => {
//     const values = form.getFieldsValue() as { title: string; description: string; color: string }
//     onUpdate(note.id, { title: values.title, description: values.description, color: values.color })
//     onFinishEdit(note.id)
//   }, [form, note.id, onFinishEdit, onUpdate])

//   const onCancelEdit = useCallback(() => {
//     form.setFieldsValue({ title: note.title, description: note.description, color: note.color })
//     onFinishEdit(note.id)
//   }, [form, note.title, note.description, note.color, note.id, onFinishEdit])

//   const cardClasses = useMemo(() => {
//     return [
//       'note-col',
//       'absolute',
//       isDeleting ? 'animate-delete' : '',
//       'w-[400px]',
//       'min-h-[200px]',
//       'border',
//       'border-white/10',
//       'flex',
//       'flex-col',
//       'rounded-xl',
//       'overflow-hidden',
//       'transition-transform',
//       'duration-300',
//       'shadow-md',
//     ].join(' ')
//   }, [isDeleting])

//   return (
//     <div
//       className={cardClasses}
//       style={{ top: note.position.y, left: note.position.x, background: note.color, cursor: 'default' }}
//     >
//       <div
//         className="flex items-center justify-between px-4 py-2 transition-colors duration-300 select-none"
//         style={{ background: note.color }}
//         onMouseDown={handleMouseDown}
//         >
//         <div className="flex items-center gap-3 no-drag">
//             <i
//             className="ri-delete-bin-line cursor-pointer text-xl text-black"
//             aria-label="Delete note"
//             onMouseDown={(e) => e.stopPropagation()}
//             onClick={confirmDelete}
//             />
//             <i
//             className="ri-edit-line cursor-pointer text-xl text-black"
//             aria-label={isEditing ? 'Editing' : 'Edit note'}
//             onMouseDown={(e) => e.stopPropagation()}
//             onClick={() => onStartEdit(note.id)}
//             />
//         </div>

//         <div className="no-drag">
//             <ColorPicker
//             value={note.color}
//             onChange={(c: Color) => {
//                 const hex = c.toHexString()
//                 onUpdate(note.id, { color: hex })
//                 form.setFieldsValue({ color: hex })
//             }}
//             showText={false}
//             size="small"
//             />
//         </div>
//         </div>

//       {!isEditing && (
//         <div className="p-6" onDoubleClick={() => onStartEdit(note.id)}>
//           <h2 className="mb-5 text-black font-bricolage text-2xl break-words">{note.title}</h2>
//           <div className="text-black font-bricolage text-lg break-words max-w-none"
//                dangerouslySetInnerHTML={{ __html: note.description || '' }} />
//         </div>
//       )}

//       {isEditing && (
//         <div className="p-4">
//           <Form
//             form={form}
//             layout="vertical"
//             initialValues={{ title: note.title, description: note.description, color: note.color }}
//             onFinish={onSubmit}
//           >
//             <Form.Item
//               label="Title"
//               name="title"
//               rules={[{ required: true, message: 'Title is required' }]}
//             >
//               <Input placeholder="Note title" />
//             </Form.Item>

//             <Form.Item
//               label="Description"
//               name="description"
//               rules={[{ required: true, message: 'Description is required' }]}
//               valuePropName="value"
//             >
//               <TipTapEditor className="border border-gray-300 rounded bg-white text-black" />
//             </Form.Item>

//             <div className="flex justify-end gap-2">
//               <Button onClick={onCancelEdit}>Cancel</Button>
//               <Button type="primary" htmlType="submit">Save</Button>
//             </div>
//           </Form>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Note


// import React, { useCallback, useEffect, useMemo, useRef } from 'react'
// import { App as AntApp, Button, ColorPicker, Form, Input } from 'antd'
// import type { Color } from 'antd/es/color-picker'
// import TipTapEditor from './TipTapEditor'

// export interface NoteData {
//   id: number
//   title: string
//   description: string
//   color: string
//   position: { x: number; y: number }
// }

// interface NoteProps {
//   note: NoteData
//   isEditing: boolean
//   isDeleting: boolean
//   onStartEdit: (id: number) => void
//   onFinishEdit: (id: number) => void
//   onUpdate: (id: number, data: Partial<Pick<NoteData, 'title' | 'description' | 'color'>>) => void
//   onDelete: (id: number) => void
//   onDrag: (id: number, position: { x: number; y: number }) => void
// }

// const Note: React.FC<NoteProps> = ({
//   note,
//   isEditing,
//   isDeleting,
//   onStartEdit,
//   onFinishEdit,
//   onUpdate,
//   onDelete,
//   onDrag,
// }) => {
//   const [form] = Form.useForm()
//   const { modal } = AntApp.useApp()

//   const draggingRef = useRef({
//     isDragging: false,
//     startX: 0,
//     startY: 0,
//     initialX: note.position.x,
//     initialY: note.position.y,
//   })

//   useEffect(() => {
//     form.setFieldsValue({
//       title: note.title,
//       description: note.description,
//       color: note.color,
//     })
//   }, [form, note.title, note.description, note.color])

//   const handleMouseDown = useCallback((e: React.MouseEvent) => {
//     const target = e.target as HTMLElement
//     if (target.closest('.no-drag')) return

//     draggingRef.current.isDragging = true
//     draggingRef.current.startX = e.clientX
//     draggingRef.current.startY = e.clientY
//     draggingRef.current.initialX = note.position.x
//     draggingRef.current.initialY = note.position.y

//     const handleMouseMove = (moveEvent: MouseEvent) => {
//       if (!draggingRef.current.isDragging) return
//       const dx = moveEvent.clientX - draggingRef.current.startX
//       const dy = moveEvent.clientY - draggingRef.current.startY
//       onDrag(note.id, { x: draggingRef.current.initialX + dx, y: draggingRef.current.initialY + dy })
//     }

//     const handleMouseUp = () => {
//       draggingRef.current.isDragging = false
//       window.removeEventListener('mousemove', handleMouseMove)
//       window.removeEventListener('mouseup', handleMouseUp)
//     }

//     window.addEventListener('mousemove', handleMouseMove)
//     window.addEventListener('mouseup', handleMouseUp)
//   }, [note.id, note.position.x, note.position.y, onDrag])

//   const confirmDelete = useCallback(() => {
//     modal.confirm({
//       title: 'Are you sure you want to delete this note?',
//       content: 'This action cannot be undone.',
//       okText: 'Yes, delete',
//       cancelText: 'Cancel',
//       okButtonProps: { danger: true },
//       zIndex: 2000,
//       onOk: () => onDelete(note.id),
//     })
//   }, [modal, note.id, onDelete])

//   const onSubmit = useCallback(() => {
//     const values = form.getFieldsValue() as { title: string; description: string; color: string }
//     onUpdate(note.id, { title: values.title, description: values.description, color: values.color })
//     onFinishEdit(note.id)
//   }, [form, note.id, onFinishEdit, onUpdate])

//   const onCancelEdit = useCallback(() => {
//     form.setFieldsValue({ title: note.title, description: note.description, color: note.color })
//     onFinishEdit(note.id)
//   }, [form, note.title, note.description, note.color, note.id, onFinishEdit])

//   const cardClasses = useMemo(() => {
//     return [
//       'note-col',
//       'absolute',
//       isDeleting ? 'animate-delete' : '',
//       'w-[400px]',
//       'min-h-[200px]',
//       'border',
//       'border-white/10',
//       'flex',
//       'flex-col',
//       'rounded-xl',
//       'overflow-hidden',
//       'transition-transform',
//       'duration-300',
//       'shadow-md',
//     ].join(' ')
//   }, [isDeleting])

//   return (
//     <div
//       className={cardClasses}
//       style={{ top: note.position.y, left: note.position.x, background: note.color, cursor: 'default' }}
//     >
//       <div
//         className="flex items-center justify-between px-4 py-2 transition-colors duration-300 select-none"
//         style={{ background: note.color }}
//         onMouseDown={handleMouseDown}
//       >
//         <div className="flex items-center gap-3 no-drag">
//           <button
//             type="button"
//             className="ri-delete-bin-line cursor-pointer text-xl text-black"
//             aria-label="Delete note"
//             onMouseDown={(e) => { e.stopPropagation(); e.preventDefault() }}
//             onClick={(e) => { e.stopPropagation(); confirmDelete() }}
//           />
//           <button
//             type="button"
//             className="ri-edit-line cursor-pointer text-xl text-black"
//             aria-label={isEditing ? 'Editing' : 'Edit note'}
//             onMouseDown={(e) => { e.stopPropagation(); e.preventDefault() }}
//             onClick={(e) => { e.stopPropagation(); onStartEdit(note.id) }}
//           />
//         </div>

//         <div className="no-drag">
//           <ColorPicker
//             value={note.color}
//             onChange={(c: Color) => {
//               const hex = c.toHexString()
//               onUpdate(note.id, { color: hex })
//               form.setFieldsValue({ color: hex })
//             }}
//             showText={false}
//             size="small"
//           />
//         </div>
//       </div>

//       {!isEditing && (
//         <div className="p-6 no-drag" onDoubleClick={() => onStartEdit(note.id)}>
//           <h2 className="mb-5 text-black font-bricolage text-2xl break-words">{note.title}</h2>
//           <div
//             className="text-black font-bricolage text-lg break-words max-w-none"
//             dangerouslySetInnerHTML={{ __html: note.description || '' }}
//           />
//         </div>
//       )}

//       {isEditing && (
//         <div className="p-4 no-drag">
//           <Form
//             form={form}
//             layout="vertical"
//             initialValues={{ title: note.title, description: note.description, color: note.color }}
//             onFinish={onSubmit}
//           >
//             <Form.Item
//               label="Title"
//               name="title"
//               rules={[{ required: true, message: 'Title is required' }]}
//             >
//               <Input placeholder="Note title" />
//             </Form.Item>

//             <Form.Item
//               label="Description"
//               name="description"
//               rules={[{ required: true, message: 'Description is required' }]}
//               valuePropName="value"
//             >
//               <TipTapEditor className="border border-gray-300 rounded bg-white text-black" />
//             </Form.Item>

//             <div className="flex justify-end gap-2">
//               <Button onClick={onCancelEdit}>Cancel</Button>
//               <Button type="primary" htmlType="submit">Save</Button>
//             </div>
//           </Form>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Note




import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { App as AntApp, Button, ColorPicker, Form, Input } from 'antd'
import type { Color } from 'antd/es/color-picker'
import TipTapEditor from './TipTapEditor'

export interface NoteData {
  id: number
  title: string
  description: string
  color: string
  position: { x: number; y: number }
}

interface NoteProps {
  note: NoteData
  isEditing: boolean
  isDeleting: boolean
  onStartEdit: (id: number) => void
  onFinishEdit: (id: number) => void
  onUpdate: (id: number, data: Partial<Pick<NoteData, 'title' | 'description' | 'color'>>) => void
  onDelete: (id: number) => void
  onDrag: (id: number, position: { x: number; y: number }) => void
  onBringToFront: (id: number) => void
}

const Note: React.FC<NoteProps> = ({
  note,
  isEditing,
  isDeleting,
  onStartEdit,
  onFinishEdit,
  onUpdate,
  onDelete,
  onDrag,
  onBringToFront,
}) => {
  const [form] = Form.useForm()
  const { modal } = AntApp.useApp()
  const [localColor, setLocalColor] = useState(note.color)

  const draggingRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    initialX: note.position.x,
    initialY: note.position.y,
  })

  useEffect(() => {
    form.setFieldsValue({
      title: note.title,
      description: note.description,
      color: note.color,
    })
  }, [form, note.title, note.description, note.color])

  useEffect(() => {
    setLocalColor(note.color)
  }, [note.color])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('.no-drag')) return

    onBringToFront(note.id)

    draggingRef.current.isDragging = true
    draggingRef.current.startX = e.clientX
    draggingRef.current.startY = e.clientY
    draggingRef.current.initialX = note.position.x
    draggingRef.current.initialY = note.position.y

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!draggingRef.current.isDragging) return
      const dx = moveEvent.clientX - draggingRef.current.startX
      const dy = moveEvent.clientY - draggingRef.current.startY
      onDrag(note.id, { x: draggingRef.current.initialX + dx, y: draggingRef.current.initialY + dy })
    }

    const handleMouseUp = () => {
      draggingRef.current.isDragging = false
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }, [note.id, note.position.x, note.position.y, onDrag, onBringToFront])

  const confirmDelete = useCallback(() => {
    modal.confirm({
      title: 'Are you sure you want to delete this note?',
      content: 'This action cannot be undone.',
      okText: 'Yes, delete',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      zIndex: 2000,
      onOk: () => onDelete(note.id),
    })
  }, [modal, note.id, onDelete])

  const onSubmit = useCallback(() => {
    const values = form.getFieldsValue() as { title: string; description: string; color: string }
    onUpdate(note.id, { title: values.title, description: values.description, color: values.color })
    onFinishEdit(note.id)
  }, [form, note.id, onFinishEdit, onUpdate])

  const onCancelEdit = useCallback(() => {
    form.setFieldsValue({ title: note.title, description: note.description, color: note.color })
    onFinishEdit(note.id)
  }, [form, note.title, note.description, note.color, note.id, onFinishEdit])

  const cardClasses = useMemo(() => {
    return [
      'note-col',
      'absolute',
      isDeleting ? 'animate-delete' : '',
      'w-[400px]',
      'min-h-[200px]',
      'border',
      'border-white/10',
      'flex',
      'flex-col',
      'rounded-xl',
      'overflow-hidden',
      'transition-transform',
      'duration-300',
      'shadow-md',
    ].join(' ')
  }, [isDeleting])

  return (
    <div
      className={cardClasses}
      style={{ top: note.position.y, left: note.position.x, background: localColor, cursor: 'default' }}
    >
      <div
        className="flex items-center justify-between px-4 py-2 transition-colors duration-300 select-none"
        style={{ background: localColor }}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3 no-drag">
          <button
            type="button"
            className="ri-delete-bin-line cursor-pointer text-xl text-black"
            aria-label="Delete note"
            onMouseDown={(e) => { e.stopPropagation(); e.preventDefault() }}
            onClick={(e) => { e.stopPropagation(); confirmDelete() }}
          />
          <button
            type="button"
            className="ri-edit-line cursor-pointer text-xl text-black"
            aria-label={isEditing ? 'Editing' : 'Edit note'}
            onMouseDown={(e) => { e.stopPropagation(); e.preventDefault() }}
            onClick={(e) => { e.stopPropagation(); onBringToFront(note.id); onStartEdit(note.id) }}
          />
        </div>

        <div className="no-drag">
          <ColorPicker
            value={localColor}
            onChange={(c: Color) => {
              const hex = c.toHexString()
              setLocalColor(hex) // instant UI update
            }}
            onChangeComplete={(c: Color) => {
              const hex = c.toHexString()
              onUpdate(note.id, { color: hex }) // persist
              form.setFieldsValue({ color: hex })
            }}
            showText={false}
            size="small"
          />

        </div>
      </div>

      {!isEditing && (
        <div className="p-6 no-drag" onDoubleClick={() => { onBringToFront(note.id); onStartEdit(note.id) }}>
          <h2 className="mb-5 text-black font-bricolage text-2xl break-words">{note.title}</h2>
          <div
            className="text-black font-bricolage text-lg break-words max-w-none"
            dangerouslySetInnerHTML={{ __html: note.description || '' }}
          />
        </div>
      )}

      {isEditing && (
        <div className="p-4 no-drag">
          <Form
            form={form}
            layout="vertical"
            initialValues={{ title: note.title, description: note.description, color: note.color }}
            onFinish={onSubmit}
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: 'Title is required' }]}
            >
              <Input placeholder="Note title" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Description is required' }]}
              valuePropName="value"
            >
              <TipTapEditor className="border border-gray-300 rounded bg-white text-black" />
            </Form.Item>

            <div className="flex justify-end gap-2">
              <Button onClick={onCancelEdit}>Cancel</Button>
              <Button type="primary" htmlType="submit">Save</Button>
            </div>
          </Form>
        </div>
      )}
    </div>
  )
}

export default Note