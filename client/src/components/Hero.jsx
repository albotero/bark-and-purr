import "../styles/Hero.css";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation("home");

  return (
    <div
      className="hero"
      style={{
        position: "relative",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        overflow: "hidden",
        lineHeight: 0,
      }}
    >
      <div className="text-center text-white px-3">
        <h1>{t("hero.title")}</h1>
        <p>{t("hero.subtitle")}</p>
      </div>
    </div>
  );
};

export default Hero;
