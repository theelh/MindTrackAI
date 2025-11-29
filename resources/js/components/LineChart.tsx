import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  labels: string[];
  happyUsers: number[];
  emotions: number[];
}

export default function LineChart({ labels, happyUsers, emotions }: Props) {
  const data = {
    labels,
    datasets: [
      {
        label: "Progress",
        data: happyUsers,
        borderColor: "#4556FE",
        backgroundColor: "rgba(69, 86, 254, 0.3)",
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
        fill: true,
      },
      {
        label: "Emotion",
        data: emotions,
        borderColor: "#FF4971",
        backgroundColor: "rgba(255, 73, 113, 0.3)",
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return <Line data={data} options={options} />;
}