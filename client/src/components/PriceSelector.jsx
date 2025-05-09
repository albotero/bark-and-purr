import { useEffect, useState } from "react"
import "react-range-slider-input/dist/style.css"
import RangeSlider from "react-range-slider-input"
import { Chart as ChartJS, BarElement, Tooltip, CategoryScale, LinearScale } from "chart.js"
import { Bar } from "react-chartjs-2"
import { useTranslation } from "react-i18next"
import { useTheme } from "../context/ThemeContext"
import { useApi } from "../hooks/useApi"

const totalSteps = 10
ChartJS.register(BarElement, Tooltip, CategoryScale, LinearScale)

const PriceSelector = ({ histogram, url, setIsLoading, setProductsData }) => {
  const [selPrice, setSelPrice] = useState([])
  const { t } = useTranslation("discover")
  const { theme } = useTheme()
  const [fetchProducts] = useApi()

  const maxPrice = Math.floor(histogram?.max_price / 100) * 100
  const step = maxPrice / totalSteps

  useEffect(() => {
    if (maxPrice) setSelPrice([1, maxPrice + step])
  }, [maxPrice, step])

  const options = {
    responsive: true,
    scales: {
      x: { display: false },
      y: { display: false },
    },
    plugins: {
      tooltip: {
        displayColors: false,
        callbacks: {
          label: ({ raw }) => `${raw} ${t("products")}`,
          title: ([{ label }]) => label,
        },
      },
    },
  }

  const handleSlide = ([min, max]) => {
    setSelPrice([min, max === min ? max : max - 1])
  }

  const handleDrag = async () => {
    /* Call api to filter products between min and max price */
    const [min, max] = selPrice
    setIsLoading(true)
    const fullUrl = url
      // Remove previous filters
      .replace(/(min_price|max_price|(?<!results_per_)page)=\d+&?/g, "")
      // Remove trailing &
      .replace(/&$/, "")
      // Append new filters
      .concat(`&min_price=${min}&max_price=${max}&page=1`)
    const data = await fetchProducts({ fullUrl })
    setProductsData(data)
    setIsLoading(false)
  }

  const barData = {
    labels: histogram?.values?.map(({ from, to }) => `$${from.toLocaleString()} - $${to.toLocaleString()}`) || [],
    datasets: [
      {
        data: histogram?.values?.map(({ count }) => count.toLocaleString()) || [],
        backgroundColor: theme === "dark" ? "rgba(245, 154, 49, 0.5)" : "rgba(38, 113, 252, 0.5)",
      },
    ],
  }

  return (
    <div className="w-100">
      <Bar options={options} data={barData} className="price-chart" />
      <RangeSlider
        min={1}
        max={maxPrice + step + totalSteps}
        step={step}
        value={selPrice}
        onThumbDragEnd={handleDrag}
        onRangeDragEnd={handleDrag}
        onInput={handleSlide}
      />
      <div className="d-flex justify-content-between mt-2">
        <span>${selPrice[0]?.toLocaleString()}</span>
        <span>${selPrice[1]?.toLocaleString()}</span>
      </div>
    </div>
  )
}

export default PriceSelector
