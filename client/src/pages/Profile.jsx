import "../styles/Profile.css"
import { useEffect, useState } from "react"
import { FaRegCircleCheck, FaRegCircleXmark } from "react-icons/fa6"
import { useTranslation } from "react-i18next"
import Button from "react-bootstrap/esm/Button"
import Col from "react-bootstrap/esm/Col"
import Container from "react-bootstrap/esm/Container"
import FloatingLabel from "react-bootstrap/esm/FloatingLabel"
import Form from "react-bootstrap/esm/Form"
import Row from "react-bootstrap/esm/Row"
import EditIcon from "../components/EditIcon"
import ProfileInfoItem from "../components/ProfileInfoItem"

const addressItems = [
  { id: "line1", label: "Address Line 1" },
  { id: "line2", label: "Address Line 2" },
  { id: "city", label: "City" },
  { id: "state", label: "State" },
  { id: "zip", label: "ZIP" },
  { id: "country", label: "Country" },
]

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
  const { i18n, t } = useTranslation("user")

  /* Mock data */
  useEffect(() => {
    setUserInfo({
      avatar: "/vite.svg",
      name: "John Doe",
      email: "john.doe@mail.com",
      birthday: "01/01/2001",
      favorites: { text: "Favorites", href: "/user/favorites" },
      purchases: { text: "Purchases", href: "/user/purchases" },
      publications: { text: "Publications", href: "/user/publications" },
    })
    const a = {
      line1: "1234, 5th Ave.",
      line2: "",
      city: "New York",
      state: "New York",
      zip: 123456,
      country: "United States",
    }
    const p = {
      language: i18n.language,
      notifications: [
        { id: 1001, isActive: false, text: "notifications.purchase" },
        { id: 1002, isActive: true, text: "notifications.shipped" },
        { id: 1003, isActive: true, text: "notifications.publish" },
        { id: 1004, isActive: false, text: "notifications.review" },
        { id: 1005, isActive: false, text: "notifications.password" },
      ],
    }
    setAddress(a)
    setPreferences(p)
    setInputAddress(a)
    setInputPreferences(p)
  }, [i18n.language])

  const languageLabel = (id) => languages.find((el) => el.id == id)?.label

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

  const handleSaveAddress = () => {
    setAddress(inputAddress)
    setIsEditingAddress(false)
  }

  const handleSavePreferences = () => {
    i18n.changeLanguage(inputPreferences.language)
    setPreferences(inputPreferences)
    setIsEditingPreferences(false)
  }

  return (
    <Container>
      <h2>Profile</h2>
      <Row>
        <Col xs={12} md={5}>
          <div className="avatar-container">
            <img className="avatar-img" src={userInfo.avatar} alt="Avatar" />
            <EditIcon className="avatar-icon" type="edit" />
          </div>
          <div className="personal-info">
            <h4 className="user-name">{userInfo.name}</h4>
            <ProfileInfoItem icon="mail" iconColor="secondary" text={userInfo.email} />
            <ProfileInfoItem icon="bday" iconColor="secondary" text={userInfo.birthday} />
            <ProfileInfoItem
              icon="favs"
              iconColor="danger"
              text={userInfo.favorites?.text}
              href={userInfo.favorites?.href}
            />
            <ProfileInfoItem
              icon="purchases"
              iconColor="success"
              text={userInfo.purchases?.text}
              href={userInfo.purchases?.href}
            />
            <ProfileInfoItem
              icon="pubs"
              iconColor="warning"
              text={userInfo.publications?.text}
              href={userInfo.publications?.href}
            />
          </div>
        </Col>
        <Col xs={12} md={7}>
          <Row>
            <Col className="profile-section">
              <div className="title">
                <h4>Shipping Address</h4>
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
                    <Col xs={12}>{`Address: ${address.line1} ${address.line2}`}</Col>
                  </Row>
                  <hr className="my-2" />
                  <Row>
                    <Col xs={12} md={6}>{`City: ${address.city}`}</Col>
                    <Col xs={12} md={6}>{`State: ${address.state}`}</Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={6}>{`ZIP: ${address.zip}`}</Col>
                    <Col xs={12} md={6}>{`Country: ${address.country}`}</Col>
                  </Row>
                </>
              )}
            </Col>
          </Row>
          <Row>
            <Col className="profile-section">
              <div className="title">
                <h4>{t("preferences")}</h4>
                <EditIcon callback={setIsEditingPreferences} type="edit" />
              </div>
              {isEditingPreferences ? (
                <Form className="d-flex flex-column gap-2 pt-3">
                  <Form.Group className="d-flex align-items-center gap-3">
                    <Form.Label className="m-0">{t("language")}:</Form.Label>
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
                    {t("language")}: {languageLabel(preferences.language)}{" "}
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
