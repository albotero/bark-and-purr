import "../styles/EditIcon.css"
import { GiBroom } from "react-icons/gi"
import { GrEdit } from "react-icons/gr"

const EditIcon = ({ className = "", callback, type }) => {
  const handleEditIconClick = () => callback((prev) => !prev)

  return (
    <div className={"edit-icon mt-1 " + className}>
      {type === "edit" ? (
        <GrEdit onClick={handleEditIconClick} />
      ) : type === "clean" ? (
        <GiBroom onClick={handleEditIconClick} className="icon-danger" />
      ) : (
        <></>
      )}{" "}
    </div>
  )
}

export default EditIcon
