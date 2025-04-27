import { Link } from "react-router"

const ProfileInfoItem = ({ icon, text, href }) => {
  return (
    <div className="d-flex gap-2 align-items-center">
      <p className="fs-4 m-0">{icon}</p>
      <p className="m-0">{href ? <Link to={href}>{text}</Link> : text}</p>
    </div>
  )
}

export default ProfileInfoItem
