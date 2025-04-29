import { Link } from "react-router"
import { HiOutlineShoppingBag } from "react-icons/hi2"

import { IoIosMail } from "react-icons/io"
import { IoCalendarOutline, IoHeart, IoPaw } from "react-icons/io5"

const icons = {
  mail: IoIosMail,
  bday: IoCalendarOutline,
  favs: IoHeart,
  purchases: HiOutlineShoppingBag,
  pubs: IoPaw,
}

const ProfileInfoItem = ({ icon, iconColor, text, href }) => {
  const Icon = icons[icon]

  return (
    <div className="d-flex gap-2 align-items-center">
      <Icon className={`fs-4 m-0 text-${iconColor}`} />
      <p className="m-0">{href ? <Link to={href}>{text}</Link> : text}</p>
    </div>
  )
}

export default ProfileInfoItem
