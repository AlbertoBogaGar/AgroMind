<template>
  <div class="bg-white p-4 rounded-lg shadow-md w-full max-w-xl">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default {
  name: "SolGrafico",
  props: {
    salidaSol: String,     // formato HH:mm
    puestaSol: String,     // formato HH:mm
    horaActual: String     // formato HH:mm
  },
  mounted() {
    if (this.salidaSol && this.puestaSol && this.horaActual) {
      this.renderChart();
    } else {
      console.warn("Faltan datos para el gráfico del sol:", {
        salidaSol: this.salidaSol,
        puestaSol: this.puestaSol,
        horaActual: this.horaActual
      });
    }
  },
  methods: {
    parseTime(time) {
      const [h, m] = time.split(":").map(Number);
      return h + m / 60;
    },
    getColorScheme(actual, salida, puesta) {
      if (actual < salida) {
        return {
          borderColor: "#94a3b8", // gris amanecer
          backgroundColor: "rgba(148, 163, 184, 0.2)"
        };
      } else if (actual > puesta) {
        return {
          borderColor: "#334155", // gris noche
          backgroundColor: "rgba(51, 65, 85, 0.2)"
        };
      } else {
        return {
          borderColor: "#facc15", // sol
          backgroundColor: "rgba(250, 204, 21, 0.2)"
        };
      }
    },
    renderChart() {
      const ctx = this.$refs.canvas.getContext("2d");

      const salida = this.parseTime(this.salidaSol);
      const puesta = this.parseTime(this.puestaSol);
      const actual = this.parseTime(this.horaActual.replace(" p. m.", "").replace(" a. m.", ""));

      const inicio = Math.max(0, Math.floor(salida - 1));
      const fin = Math.min(24, Math.ceil(puesta + 1));

      const horas = [];
      for (let i = inicio; i <= fin; i++) {
        horas.push(`${String(i).padStart(2, "0")}h`);
      }

      const recorridoSol = [];
      for (let i = inicio; i <= fin; i++) {
        if (i >= salida && i <= puesta) {
          recorridoSol.push(Math.sin(((i - salida) / (puesta - salida)) * Math.PI));
        } else {
          recorridoSol.push(0);
        }
      }

      const puntoActual = [];
      for (let i = inicio; i <= fin; i++) {
        puntoActual.push(Math.abs(i - actual) < 0.5 ? 1.05 : null);
      }

      const colores = this.getColorScheme(actual, salida, puesta);

      new Chart(ctx, {
        type: "line",
        data: {
          labels: horas,
          datasets: [
            {
              label: "Recorrido del Sol",
              data: recorridoSol,
              fill: true,
              tension: 0.4,
              borderColor: colores.borderColor,
              backgroundColor: colores.backgroundColor
            },
            {
              label: "Hora actual",
              data: puntoActual,
              borderColor: "#3b82f6",
              pointBackgroundColor: "#3b82f6",
              pointRadius: 6,
              type: "scatter",
              showLine: false
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => `${ctx.dataset.label}: ${ctx.formattedValue}`
              }
            }
          },
          scales: {
            y: { display: false, min: 0, max: 1.2 },
            x: {
              title: {
                display: true,
                text: "Horas del día"
              },
              grid: {
                drawOnChartArea: false
              }
            }
          }
        }
      });
    }
  }
};
</script>
