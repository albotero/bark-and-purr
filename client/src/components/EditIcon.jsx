import React from "react"

const EditIcon = ({ className, callback }) => {
  const handleEditIconClick = () => callback((prev) => !prev)

  return (
    <div className={"edit-icon " + className} onClick={handleEditIconClick}>
      ✏️
    </div>
  )
}

export default EditIcon
