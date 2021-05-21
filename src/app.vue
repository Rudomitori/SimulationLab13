<template>
  <main class="tile is-ancestor is-vertical m-0">
    <div class="tile is-parent">
      <div class="tile is-child field has-addons box">
        <div class="control">
          <span class="button is-static">Среднее:</span>
        </div>

        <div class="control">
          <input class="input" v-model="lambda" type="number" placeholder="λ" min="0" increment="0.5"/>
        </div>

        <div class="control">
          <span class="button is-static">Кол-во экспериментов:</span>
        </div>

        <div class="control">
          <input class="input" v-model="N" type="number" placeholder="N" min="0"/>
        </div>

        <div class="control">
          <button class="button is-primary" @click="calculate">
            Запуск
          </button>
        </div>
      </div>
    </div>
    <div class="tile is-parent">
      <div class="tile is-child panel">
        <p class="panel-heading">
          {{ Calculated.N }} экспериментов для λ = {{ Calculated.lambda }}
        </p>
        <div class="panel-block">
          <h2>
            Среднее: {{ format(Calculated.avarage) }} ({{ format(Math.abs(Calculated.avarage - Calculated.mean) / Calculated.mean * 100)}}%)
          </h2>
        </div>
        <div class="panel-block">
          <h2>
            Дисперсия: {{ format(Calculated.empiricVariance) }} ({{format(Math.abs(Calculated.variance - Calculated.empiricVariance) / Calculated.variance * 100)}}%)
          </h2>
        </div>
        <div class="panel-block">
          <h2>
            {{
              Calculated.chiSquare > Approximate(0.05, Calculated.arr.length)
              ? `Хи-квадрат: ${format(Calculated.chiSquare)} > ${format(Approximate(0.05, Calculated.arr.length))}`
                  : `Хи-квадрат: ${format(Calculated.chiSquare)} < ${format(Approximate(0.05, Calculated.arr.length))}`
            }}
          </h2>
        </div>
        <div class="panel-block" v-for="tuple of Calculated.arr" v-if="tuple !== undefined">
          <b-progress class="container" :value="tuple.x * 100.0 / Calculated.max" show-value>
            {{tuple.i}} | {{ tuple.x }} | {{ tuple.x / Calculated.N }}
          </b-progress>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import Vue from "vue";
import {getPoisson, getProbability} from "./domain/PoissonDistribution";

export default Vue.extend({
  data() {
    return {
      lambda: 5,
      N: 10,
      Calculated: {
        arr: [] as { i:number, x:number }[],
        N: 0,
        max: 0,
        lambda: 0,
        mean: 0,
        avarage: 0,
        variance: 0,
        empiricVariance: 0,
        chiSquare: 0
      }
    }
  },
  methods: {
    calculate() {
      let res: { i:number, x:number }[] = []
      for(let i = 0; i < this.N; i++) {
        let value = getPoisson(this.lambda)
        if(res[value] === undefined) res[value] = {i:value, x:0}
        res[value].x++
      }
      let max = 0;
      for (let x of res) {
        if(x !== undefined && x.x > max) max = x.x
      }

      let mean = this.lambda
      let avarage = 0
      for (let i = 0; i < res.length; i++) {
        avarage += (res[i]?.x || 0) / this.N * (i + 1)
      }

      let variance = this.lambda
      let empiricVariance = 0
      for (let i = 0; i < res.length; i++) {
        empiricVariance += (res[i]?.x || 0) / this.N * Math.pow(i + 1 - avarage, 2)
      }

      let chiSquare = -this.N
      for (let i = 0; i < res.length; i++) {
        console.log(getProbability(i, this.lambda))

        chiSquare += (res[i]?.x || 0) * (res[i]?.x || 0)
            / getProbability(i, this.lambda) / this.N
      }

      this.Calculated.max = max
      this.Calculated.arr = res
      this.Calculated.N = this.N
      this.Calculated.lambda = this.lambda
      this.Calculated.mean = mean
      this.Calculated.avarage = avarage
      this.Calculated.variance = variance
      this.Calculated.empiricVariance = empiricVariance
      this.Calculated.chiSquare = chiSquare
    },
    format: new Intl.NumberFormat("ru-RU", {
      maximumFractionDigits: 2
    }).format,
    Approximate(alpha: number, k: number)
    {
      alpha = 1 - alpha
      // https://ru.wikipedia.org/wiki/%D0%9A%D0%B2%D0%B0%D0%BD%D1%82%D0%B8%D0%BB%D0%B8_%D1%80%D0%B0%D1%81%D0%BF%D1%80%D0%B5%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F_%D1%85%D0%B8-%D0%BA%D0%B2%D0%B0%D0%B4%D1%80%D0%B0%D1%82
      let n = k - 1
      let d = 0
      if (alpha >= 0.5 && alpha < 1) {
        d = 2.0637 * Math.pow(Math.log(1 / (1 - alpha)) - 0.16, 0.4274) - 1.5774
      }
      else if (alpha >= 0.001 && alpha < 0.5) {
        d = -2.0637 * Math.pow(Math.log(1 / alpha) - 0.16, 0.4274) + 1.5774
      }

      let A = d * Math.sqrt(2)
      let B = 2.0 / 3 * (d * d - 1)
      let C = d * (d * d - 7) / 9 / Math.sqrt(2)
      let D = (6 * Math.pow(d, 4) + 14 * d * d - 32) / 405
      let E = d * (9 * Math.pow(d, 4) + 256 * d * d - 433) / 4860 / Math.sqrt(2)
      return n + A * Math.sqrt(n) + B + C / Math.sqrt(n) + D / n + E / n / Math.sqrt(n)
    }
  }
});
</script>