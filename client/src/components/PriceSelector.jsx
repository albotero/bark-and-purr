import "react-range-slider-input/dist/style.css"
import RangeSlider from "react-range-slider-input"
import { Chart as ChartJS, BarElement, Tooltip, CategoryScale, LinearScale } from "chart.js"
import { Bar } from "react-chartjs-2"
import { useTranslation } from "react-i18next"
import { useTheme } from "../context/ThemeContext"

ChartJS.register(BarElement, Tooltip, CategoryScale, LinearScale)

const PriceSelector = () => {
  const { t } = useTranslation("discover")
  const { theme } = useTheme()

  const options = {
    responsive: true,
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    plugins: {
      tooltip: {
        displayColors: false,
        callbacks: {
          label: ({ raw }) => `${raw} ${t("products")}`,
          title: ([{ label }]) => `$ ${label}`,
        },
      },
    },
  }

  const handleSlide = ([minPrice, maxPrice]) => {
    /* Call api for filter products between minPrice and maxPrice */
    console.log({ minPrice, maxPrice })
  }

  /* Mock Data */
  const data = {
    labels: [
      "100 - 200",
      "201 - 400",
      "401 - 600",
      "601 - 800",
      "801 - 600",
      "1.001 - 1.200",
      "1.201 - 1.400",
      "1.401 - 1.600",
      "1.601 - 1.800",
      "1.801 - 2.000",
    ],
    datasets: [
      {
        data: [0, 2, 8, 15, 26, 22, 19, 24, 10, 8, 3, 2],
        backgroundColor: theme === "dark" ? "rgba(245, 154, 49, 0.5)" : "rgba(38, 113, 252, 0.5)",
      },
    ],
  }
  const min = 0
  const max = 2000
  const step = 10
  const defaultValue = [500, 1500]

  return (
    <div className="w-100">
      <Bar options={options} data={data} className="price-chart" />
      <RangeSlider min={min} max={max} step={step} defaultValue={defaultValue} onInput={handleSlide} />
      <div className="d-flex justify-content-between mt-2">
        <span>$100</span>
        <span>$2.000</span>
      </div>
    </div>
  )
}

export default PriceSelector
