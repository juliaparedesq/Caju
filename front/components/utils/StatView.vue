<template>
  <div>
  <v-row ref="mainarea" no-gutters>
    <v-col sm="2" class="px-4">
      <v-card outlined>
        <v-card-title class="primary white--text pa-2">
          <span class="text-body-1 text-center text-break" v-if="!timechart">Medición Adherencia</span>
          <span class="text-body-1 text-center text-break" v-else>Medición Tiempos</span>
        </v-card-title>
        <v-card-text class="text-center pt-4">
          <span class="text-h3 d-block">{{ total }}</span>
          <span>Pacientes</span>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col sm="5" v-if="!timechart">
      <v-card outlined>
        <v-card-title class="primary white--text pa-2">
          <span class="text-body-1 text-center text-break">{{ind}}: {{ descriptions[ind] }}</span>
        </v-card-title>
        <v-card-text class="text-center pt-4">
          <v-chart :options="options" class="stat-chart" autoresize/>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col sm="5" v-if="!timechart && !meta.hideSecondChart">
      <v-card outlined :class="meta.scolval ? 'card-border-primary' : ''">
        <v-card-title class="primary white--text pa-2">
          <span class="text-body-1 text-center text-break">{{ sdesc }}</span>
        </v-card-title>
        <v-card-text class="text-center px-0 pt-4 second-chart" :class="meta.scolval ? 'hl-primary' : ''">
          <v-chart :options="options2" class="stat-chart" autoresize/>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col sm="2" v-if="timechart" class="px-4">
      <v-card outlined>
        <v-card-title class="primary white--text pa-2">
          <span class="text-body-1 text-center text-break">Tiempo Cumplimiento</span>
        </v-card-title>
        <v-card-text class="text-center pt-4">
          <span class="text-h3 d-block">{{ timeGoal }}</span>
          <span>Días</span>
        </v-card-text>
      </v-card>
      <v-card class="mt-4" outlined>
        <v-card-title class="primary white--text pa-2">
          <span class="text-body-1 text-center text-break">Mediana Tiempo</span>
        </v-card-title>
        <v-card-text class="text-center pt-4">
          <span class="text-h3 d-block">{{ timeMedian }}</span>
          <span>Días</span>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col sm="8" v-if="timechart">
      <v-card outlined>
        <v-card-title class="primary white--text pa-2">
          <span class="text-body-1 text-center text-break">{{ind}}: {{ descriptions[ind] }}</span>
        </v-card-title>
        <v-card-text class="text-center pt-4">
          <v-chart :options="options3" class="stat-chart" autoresize/>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
    <v-row class="pb-10">
      <v-col></v-col>
      <!-- <v-col v-if="!timechart && !meta.hideSecondChart">
        <v-slider max="360" min="0" v-model="rot" dense @end="changeAngle"
                  color="grey lighten-2" track-color="grey lighten-2"/>
      </v-col> -->
      <v-col class="text-right">
        <v-btn small text color="grey" @click="downloadChart">
          <v-icon small>mdi-download</v-icon> Descargar Imagen
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { saveAs } from 'file-saver';

const tratamientosColors = {
  "CIRUGIA": "#FF9800",
  "RADIOTERAPIA": "#00386b",
  "QUIMIOTERAPIA": "#03A9F4",
  "HORMONOTERAPIA": "#29B6F6",
  "INMUNOTERAPIA": "#039BE5",
  "TERAPIA DIRIGIDA": "#4FC3F7",
};

const translations = {
  "OTRA_CIRUGIA": "CIRUGIA",
  "OTRA_QT": "QUIMIOTERAPIA",
};

const colors = ['#3F51B5', '#43A047', '#F57C00', '#29B6F6',
  '#D84315', '#9C27B0', '#546E7A', '#C0CA33',
  '#E91E63', '#F9A825', '#009688', '#795548',
  '#1976D2', '#2E7D32', '#616161', '#F44336' ];

export default {
  name: "StatView",
  data() {
    return {
      rot: 90,
      options: {},
      options2: {},
      options3: {},
      total: 0,
      timeMedian: 0,
      timeGoal: 30,
      ind: "CX",
      sdesc: "",
      descriptions: {
        C1: "Realización de prestaciones claves del diagnóstico",
        C2: "Realización de comité oncológico",
        C3: "Realización confirmación diagnóstica previo a comité",
        C4: "Realización comité oncológico previo a primer tto",
        C5: "Decisión comité corresponde a tto clave de la RC",
        C6: "Realización de ttos claves con comité previo",
        C7: "Realización de ttos claves sin comité previo",
        T1: "Tiempo desde la primera consulta hasta la confirmación diagnóstica",
        T2: "Tiempo desde el examen principal hasta la confirmación diagnóstica",
        T3: "Tiempo desde la confirmación diagnóstica hasta el comité oncológico",
        T4: "Tiempo desde la confirmación diagnóstica hasta el primer tratamiento",
        T5: "Tiempo desde el comité oncológico hasta el primer tratamiento",
      }
    }
  },
  props: {
    patients: Array,
    meta: Object,
    timechart: Boolean,
  },
  mounted() {
    this.options = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        top: 0,
        data: ['No cumple', 'Cumple', "Sin información"]
      },
      color: ["#BDBDBD", "#00386b", "#F48FB1"],
      series: [
        {
          name: 'CX',
          type: 'pie',
          right: "2%",
          radius: ['30%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            formatter: "{c}\n({d}%)",
            color: "black",
            overflow: "break"
          },
          startAngle: 0,
          emphasis: {
            label: {
              fontWeight: 'bold'
            }
          },
          data: [
            {value: 0, name: 'No cumple'},
            {value: 0, name: 'Cumple'},
            {value: 0, name: 'Sin información'},
          ]
        }
      ]
    };

    /* this.options2 = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 0,
        data: []
      },
      color: [],
      series: [
        {
          name: 'C1',
          type: 'pie',
          radius: ['30%', '70%'],
          avoidLabelOverlap: false,
          right: "20%",
          startAngle: 90,
          label: {
            show: true,
            formatter: "{c}\n({d}%)",
            color: "black"
          },
          emphasis: {
            label: {
              fontWeight: 'bold'
            }
          },
          data: []
        }
      ]
    }; */

    this.options2 = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: '{b}: {c}'
      },
      legend: {
        data: [ ]
      },
      color: [ "#135ec5" ],
      label: {
        show: true,
        position: "right",
        color: "black",
        formatter: p => `${p.data ? p.data.value : p.value}\n(${p.data ? p.data.pc : p.pc}%)`
      },
      grid: {
        left: '2%',
        right: '8%',
        bottom: '6%',
        top: "3%",
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: "Cantidad de Pacientes",
        position: "bottom",
        nameLocation: "middle",
        nameGap: 24,
      },
      yAxis: {
        type: 'category',
        data: []
      },
      series: [
        {
          type: 'bar',
          data: []
        },
      ]
    };

    this.options3 = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: "{b} <br> {c}%"
      },
      legend: {
        data: [ ]
      },
      color: [ "#135ec5" ],
      label: {
        show: true,
        position: "right",
        color: "black",
        formatter: "{c}%"
      },
      grid: {
        left: '2%',
        right: '8%',
        bottom: '6%',
        top: "3%",
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: "% Pacientes",
        position: "bottom",
        nameLocation: "middle",
        nameGap: 24,
      },
      yAxis: {
        type: 'category',
        data: []
      },
      series: [
        {
          type: 'bar',
          data: []
        },
      ]
    };
  },
  methods: {
    computeChartData() {
      let { col, scol, scolval, sdesc, timeGoal } = this.meta;

      this.ind = col;

      if(!this.timechart) {
        this.sdesc = sdesc;
        let p = this.patients.filter(e => e[col] != null);
        this.total = p.length;
        this.options.series[0].name = col;

        // PRINCIPAL
        let c0 = p.filter(e => e[col] == 0).length;
        let c1 = p.filter(e => e[col] > 0).length;
        let cna = p.filter(e => e[col] < 0).length;

        if (cna <= 0) {
          this.options.series[0].data = [
            {value: c0, name: 'No cumple'},
            {value: c1, name: 'Cumple'},
          ];
          this.options.legend.data = ['No cumple', 'Cumple'];
        }
        else {
          this.options.series[0].data = [
            {value: c0, name: 'No cumple'},
            {value: c1, name: 'Cumple'},
            {value: cna, name: 'Sin información'},
          ];
          this.options.legend.data = ['No cumple', 'Cumple', "Sin información"];
        }

        if(!this.meta.scolval){
          this.options.series[0].startAngle = c0 / this.total * 90;
        }
        else {
          this.options.series[0].startAngle = c0 / this.total * 360 + c1 / this.total * 90;
        }

        // SECUNDARIO
        let ps = p.filter(e => scolval ? e[col] > 0 : e[col] == 0).map(e => e[scol])
            .map(e => translations[e] ? translations[e] : e);

        let qmap = {};
        ps.forEach(p => {
          if (!qmap[p]) {
            qmap[p] = 1;
          } else {
            qmap[p] += 1;
          }
        });

        let sleg = Object.keys(qmap);
        let sdata = sleg.map(e => ({
          name: e,
          value: qmap[e],
          itemStyle: {
            color: tratamientosColors[e] || "#135ec5"
          },
          pc: Math.round(100 * qmap[e] / ps.length)
        }));
        // console.log(sdata);
        // let scolors = sleg.map((e, i) => ).filter(e => !!e);

        this.options2.yAxis.data = sleg;
        this.options2.series[0].data = sdata;
        // this.options2.color = scolors;
      }
      else {
        let t = this.patients.map(e => e[col]).filter(e => e != null);
        this.total = t.length;
        this.timeGoal = timeGoal;
        let ts = t.sort((a,b) => b - a);
        if(ts.length % 2 == 0){
          let ihv = ts.length / 2;
          this.timeMedian = (ts[ihv] + ts[ihv-1])/2;
        }
        else {
          this.timeMedian = ts[~~(ts.length / 2)];
        }

        let ranges = [-15, 0, 15, 30, 45, 60, 75, 90];
        if(timeGoal > 0 && col != "T1"){
          ranges = [];
          for (let i = 1; i <= 8; i++) {
            let v = ~~(timeGoal / 2 * i - timeGoal);
            ranges.push(v == 0 ? -1 : v);
          }
        }
        else if(timeGoal > 0){
          ranges = [];
          for (let i = 1; i <= 6; i++) {
            let v = ~~(timeGoal / 2 * i);
            ranges.push(v);
          }
        }

        console.log(ranges);

        let sdata = [];
        let sleg = [];
        for (let i = 0; i <= ranges.length; i++) {
          let rf = ranges[i] != null ? ranges[i] : 600;
          let ri = ranges[i - 1] != null ? (ranges[i - 1] + 1) : -300;
          let c = Math.round(t.filter(e => e <= rf && e >= ri).length / t.length * 100);
          let n = `${i > 0 ? ri : col != "T1" ? 'menor' : 0} ${i < ranges.length ? 'a ' + rf : 'o más'}`;
          sleg.push(n);
          sdata.push({ name: n, value: c });
        }
        this.options3.yAxis.data = sleg;
        this.options3.series[0].data = sdata;
      }


    },
    async downloadChart(){
      const el = this.$refs.mainarea;
      let canvas = await this.$html2canvas(el);
      canvas.toBlob(blob => {
        saveAs(blob, `${this.ind}.png`);
      });
    },
    changeAngle(){
      this.options2.series[0].startAngle = this.rot;
      console.log(this.options2);
    }
  },
  watch: {
    patients(){
      this.computeChartData();
    },
    meta(){
      this.computeChartData();
    },
  }
}
</script>

<style scoped>
.stat-chart {
  width: 100%;
  height: 320px;
}

.second-chart:after{
  content: "";
  position: absolute;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  border-right: 20px solid #e0e0e0;
  top: 50%;
  left: -20px;
}

.second-chart.hl-primary:after {
  border-right: 20px solid #13396b;
}

.second-chart:before{
  content: "";
  position: absolute;
  border: 1px solid #00000026;
  width: calc(50% - 108px);
  top: calc(50% + 19px);
  left: calc(-50% + 108px);
}

.second-chart.hl-primary:before {
  border: 1px solid #13396b;
}

.card-border-primary{
  border-color: #133a6b;
}

</style>