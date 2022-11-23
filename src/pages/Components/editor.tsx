import React, { Dispatch, SetStateAction, useRef, useEffect } from "react"
import styled from "styled-components"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

interface ArticleContentType {
  artiContent: string
  setArtiContent: Dispatch<SetStateAction<string>>
}
const toolbarOptions = [
  [{ header: [1, 2, false] }],
  ["bold", "strike", "blockquote"],
  [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
  ["link"],
]

const StyleQuill = styled(ReactQuill)`
  min-height: 300px;
  margin-top: 5px;
  border-radius: 5px;
  border: none;
  background-color: #fff;
  color: #2d2d2d;
  .ql-toolbar.ql-snow {
    border-radius: 5px;
    height: 40px;
    font-size: 40px;
  }
  .ql-container.ql-snow {
    border: none;
  }
  .ql-formats {
    height: 40px;
  }
  .ql-editor {
    font-size: 18px;
  }
`

function Editor(props: ArticleContentType) {
  const { artiContent, setArtiContent } = props

  // const quillRef = useRef<ReactQuill>(null)
  // useEffect(() => {
  //   if (quillRef.current) {
  //     console.log(quillRef.current)
  //     quillRef.current.focus()
  //   }
  // })

  return (
    <StyleQuill
      theme="snow"
      // ref={quillRef}
      value={artiContent}
      placeholder="What's on your mind?"
      onChange={setArtiContent}
      modules={{
        toolbar: toolbarOptions,
      }}
    />
  )
}

export default Editor
