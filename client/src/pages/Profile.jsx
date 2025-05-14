import "../styles/Profile.css"
import { useEffect, useState } from "react"
import { FaRegCircleCheck, FaRegCircleXmark } from "react-icons/fa6"
import { useTranslation } from "react-i18next"
import Button from "react-bootstrap/esm/Button"
import Col from "react-bootstrap/esm/Col"
import Container from "react-bootstrap/esm/Container"
import FloatingLabel from "react-bootstrap/esm/FloatingLabel"
import Form from "react-bootstrap/esm/Form"
import Spinner from "react-bootstrap/esm/Spinner"
import Row from "react-bootstrap/esm/Row"
import EditIcon from "../components/EditIcon"
import ProfileInfoItem from "../components/ProfileInfoItem"
import Swal from "sweetalert2"

const displayOrDash = (value) => value?.toString().trim() || "-"

const formatDate = (dateString) => {
  if (!dateString) return "-"
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const languages = [
  { id: "en", label: "🇺🇸 English" },
  { id: "es", label: "🇨🇱 Español" },
]

const Profile = () => {
  const [userInfo, setUserInfo] = useState({})
  const [address, setAddress] = useState({})
  const [preferences, setPreferences] = useState({})
  const [inputAddress, setInputAddress] = useState({})
  const [inputPreferences, setInputPreferences] = useState({})
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [isEditingPreferences, setIsEditingPreferences] = useState(false)
  const [isEditingAvatar, setIsEditingAvatar] = useState(false)
  const [inputAvatar, setInputAvatar] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const { i18n, t } = useTranslation("profile")

  const addressItems = [
    { id: "line1", label: t("address.line", { num: 1 }) },
    { id: "line2", label: t("address.line", { num: 2 }) },
    { id: "city", label: t("address.city") },
    { id: "state", label: t("address.state") },
    { id: "zip", label: t("address.zip") },
    { id: "country", label: t("address.country") },
  ]

useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        const data = await res.json()

        if (!res.ok) throw new Error(data.message)

        const { user } = data

        setUserInfo({
          avatar: user.avatar_url,
          name: user.name,
          email: user.email,
          birthday: user.birthday,
          favorites: "/user/favorites",
          purchases: "/user/purchases",
          publications: "/user/publications",
        })

        const address = {
          line1: user.address.line1,
          line2: user.address.line2,
          city: user.address.city,
          state: user.address.state,
          zip: user.address.zip_code,
          country: user.address.country,
        }

        const preferences = {
          language: user.preferences.language,
          notifications: [
            { id: 1001, isActive: user.preferences.notify_purchase, text: "preferences.notifications.purchase" },
            { id: 1002, isActive: user.preferences.notify_shipping, text: "preferences.notifications.shipped" },
            { id: 1003, isActive: user.preferences.notify_publication, text: "preferences.notifications.publish" },
            { id: 1004, isActive: user.preferences.notify_review, text: "preferences.notifications.review" },
            { id: 1005, isActive: user.preferences.notify_pass_change, text: "preferences.notifications.password" },
          ],
        }

        setAddress(address)
        setPreferences(preferences)
        setInputAddress(address)
        setInputPreferences(preferences)
      } catch (err) {
        console.error("Failed to fetch profile:", err)
      }
    }

    fetchProfile()
  }, [i18n.language])


const languageLabel = (id) => languages.find((el) => el.id == id)?.label

const handleSaveAvatar = async () => {
  if (!inputAvatar) {
    Swal.fire({
      icon: "info",
      title: t("alerts.no_changes"),
      text: t("alerts.no_avatar_change"),
    })
    return
  }

  setIsUploading(true)

  const formData = new FormData()
  formData.append("avatar", inputAvatar)

  try {
    const res = await fetch("http://localhost:3000/api/auth/profile/avatar", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message)

    setUserInfo((prev) => ({ ...prev, avatar: data.avatar_url }))
    setIsEditingAvatar(false)

    Swal.fire({
      icon: "success",
      title: t("alerts.avatar_updated"),
      text: t("alerts.avatar_success"),
      timer: 2000,
      showConfirmButton: true,
    })
  } catch (err) {
    console.error("Failed to update avatar:", err)
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: t("alerts.avatar_error"),
    })
  } finally {
    setIsUploading(false)
  }
}

const handleInputAddressChange = ({ target }) => {
    const { value, dataset } = target
    const { property } = dataset
    setInputAddress((prev) => ({ ...prev, [property]: value }))
}

const handleLanguageSelectionChange = ({ target: { value: language } }) => {
  setInputPreferences((prev) => ({ ...prev, language }))
}

const handleNotificationCheckChange = ({ target }) => {
  const { checked: isActive, dataset } = target
  const { id } = dataset
  const updateNotification = (nots) => nots.map((el) => (el.id == id ? { ...el, isActive } : el))
  setInputPreferences((prev) => ({ ...prev, notifications: updateNotification(prev.notifications) }))
}
const handleSaveAddress = async () => {
  const isUnchanged = JSON.stringify(inputAddress) === JSON.stringify(address);

  if (isUnchanged) {
    Swal.fire({
      icon: "info",
      title: t("alerts.no_changes"),
      text: t("alerts.no_address_change"),
      timer: 2000,
      showConfirmButton: true
    })
    return;
  }
  try {
    const res = await fetch("http://localhost:3000/api/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(inputAddress)

    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message)

    setAddress(inputAddress)
    setIsEditingAddress(false)
    Swal.fire({
      icon: "success",
      title: t("alerts.address_updated"),
      text: t("alerts.address_success"),
      timer: 2000,
      showConfirmButton: true,
    })
  } catch (err) {
    console.error("Failed to update address:", err)
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: t("alerts.address_error"),
      showConfirmButton: true,
    })

  }
}

const handleSavePreferences = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(preferencesToPayload(inputPreferences))

    })

    if (!res.ok) throw new Error("Failed to update preferences")

    i18n.changeLanguage(inputPreferences.language)
    setPreferences(inputPreferences)
    setIsEditingPreferences(false)

    Swal.fire({
      icon: "success",
      title: t("alerts.prefs_updated"),
      text: t("alerts.prefs_success"),
      timer: 2000,
      showConfirmButton: true,
    })
  } catch (err) {
    console.error(err)
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: t("alerts.prefs_error"),
      showConfirmButton: true,
      })
    }
  }

const preferencesToPayload = (prefs) => {
  if (!prefs || !Array.isArray(prefs.notifications)) {
    return {
      language: prefs?.language || "es", // fallback
      notify_shipping: true,
      notify_purchase: true,
      notify_publication: true,
      notify_review: true,
      notify_pass_change: true
    }
  }

  const notifications = prefs.notifications.reduce((acc, curr) => {
    if (curr.text.includes("purchase")) acc.notify_purchase = curr.isActive
    if (curr.text.includes("shipped")) acc.notify_shipping = curr.isActive
    if (curr.text.includes("publish")) acc.notify_publication = curr.isActive
    if (curr.text.includes("review")) acc.notify_review = curr.isActive
    if (curr.text.includes("password")) acc.notify_pass_change = curr.isActive
    return acc
  }, {})

  return {
    language: prefs.language,
    ...notifications,
  }
}
t

  return (
    <Container className="section-padding">
      <h2>{t("profile")}</h2>
      <Row>
        <Col xs={12} md={5}>
          <div className="avatar-container position-relative">
            <img className="avatar-img" src={userInfo.avatar} alt="Avatar" />
            <EditIcon className="avatar-icon" type="edit" callback={() => {
              setIsEditingAvatar(true)
              setInputAvatar(null)
            }} />
          </div>
          
          {isEditingAvatar && (
            <Form className="pt-3">
              <Form.Group className="mb-4">
                <Form.Label>{t("form.select_avatar")}</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  id="hidden-avatar-input"
                  style={{ display: "none" }}
                  onChange={(e) => setInputAvatar(e.target.files[0])}
                />

                <div className="d-flex flex-column flex-md-row gap-2 w-100">
                  <div className="d-grid w-100">
                    <Button
                      variant="outline-secondary"
                      onClick={() => document.getElementById("hidden-avatar-input").click()}
                    >
                      {t("form.choose_file")}
                    </Button>
                  </div>

                  <div className="d-grid w-100">
                  <Button
                    onClick={handleSaveAvatar}
                    disabled={!inputAvatar || isUploading}
                    variant="primary"
                    className="d-flex align-items-center justify-content-center"
                  >
                    {isUploading ? (
                      <Spinner animation="border" size="sm" role="status" className="me-2" />
                    ) : null}
                    {t("form.save_avatar")}
                  </Button>
                  </div>
                </div>

                {inputAvatar && (
                  <div className="text-muted mt-2" style={{ fontSize: "0.9em" }}>
                    {t("form.selected_file")}: <strong>{inputAvatar.name}</strong>
                  </div>
                )}
              </Form.Group>
            </Form>
          )}
          <div className="personal-info">
            <h3 className="user-name">{userInfo.name}</h3>
            <ProfileInfoItem icon="mail" iconColor="secondary" text={userInfo.email} />
            <ProfileInfoItem icon="bday" iconColor="secondary" text={formatDate(userInfo.birthday)} />
            <ProfileInfoItem icon="favs" iconColor="danger" text={t("user_info.favorites")} href={userInfo.favorites} />
            <ProfileInfoItem
              icon="purchases"
              iconColor="success"
              text={t("user_info.purchases")}
              href={userInfo.purchases}
            />
            <ProfileInfoItem
              icon="pubs"
              iconColor="warning"
              text={t("user_info.publications")}
              href={userInfo.publications}
            />
          </div>
        </Col>
        <Col xs={12} md={7}>
          <Row>
            <Col className="profile-section">
              <div className="title">
                <h4>{t("address.title")}</h4>
                <EditIcon callback={setIsEditingAddress} type="edit" />
              </div>
              {isEditingAddress ? (
                <Form className="d-flex flex-column gap-2 pt-3">
                  {addressItems.map(({ id, label }) => (
                    <FloatingLabel key={id} controlId={`address-${id}`} label={label}>
                      <Form.Control
                        type="text"
                        placeholder={label}
                        value={inputAddress[id] || ""}
                        data-property={id}
                        onChange={handleInputAddressChange}
                      />
                    </FloatingLabel>
                  ))}
                  <div className="my-4 mx-auto">
                    <Button onClick={handleSaveAddress}>{t("save_changes")}</Button>
                  </div>
                </Form>
              ) : (
                <>
                <Row>
                  <Col xs={12}>
                    {`${t("address.address")}: ${displayOrDash(address.line1)} ${displayOrDash(address.line2)}`}
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>{`${t("address.city")}: ${displayOrDash(address.city)}`}</Col>
                  <Col xs={12} md={6}>{`${t("address.state")}: ${displayOrDash(address.state)}`}</Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>{`${t("address.zip")}: ${displayOrDash(address.zip)}`}</Col>
                  <Col xs={12} md={6}>{`${t("address.country")}: ${displayOrDash(address.country)}`}</Col>
                </Row>
                </>
              )}
            </Col>
          </Row>
          <Row>
            <Col className="profile-section">
              <div className="title">
                <h4>{t("preferences.title")}</h4>
                <EditIcon callback={setIsEditingPreferences} type="edit" />
              </div>
              {isEditingPreferences ? (
                <Form className="d-flex flex-column gap-2 pt-3">
                  <Form.Group className="d-flex align-items-center gap-3">
                    <Form.Label className="m-0">{t("preferences.language")}:</Form.Label>
                    <Form.Select value={inputPreferences.language} onChange={handleLanguageSelectionChange}>
                      {languages.map(({ id: l }) => (
                        <option key={l} value={l}>
                          {languageLabel(l)}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <hr />
                  {inputPreferences.notifications?.map(({ id, isActive, text }) => (
                    <Form.Check
                      key={id}
                      label={t(text)}
                      checked={isActive}
                      data-id={id}
                      id={`notify-check-${id}`}
                      onChange={handleNotificationCheckChange}
                    />
                  ))}
                  <div className="my-4 mx-auto">
                    <Button onClick={handleSavePreferences}>{t("save_changes")}</Button>
                  </div>
                </Form>
              ) : (
                <>
                  <p>
                    {t("preferences.language")}: {languageLabel(preferences.language)}{" "}
                  </p>
                  <hr />
                  {preferences.notifications?.map(({ id, isActive, text }) => (
                    <p key={id} className="my-1 d-flex align-items-start gap-2">
                      <span>
                        {isActive ? (
                          <FaRegCircleCheck className="text-success" />
                        ) : (
                          <FaRegCircleXmark className="text-danger" />
                        )}
                      </span>
                      <span>{t(text)}</span>
                    </p>
                  ))}
                </>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

export default Profile
