import React from "react"
import { GrEdit } from "react-icons/gr"

const EditIcon = ({ className = "", callback }) => {
  const handleEditIconClick = () => callback((prev) => !prev)

  return (
    <div className={"edit-icon mt-1 " + className}>
      <GrEdit onClick={handleEditIconClick} />
    </div>
  )
}

export default EditIcon
