<template>
  <div style="flex-direction: row;"
  v-on:appear="appeared"
  v-on:disappear="disappeared">
  <slot></slot>
</div>
</template>

<style scoped>
.wrap {
  overflow: hidden;
}
</style>

<script>
function format (str) {
  if (str.length >= 2) {
    return str;
  } else {
    return '0' + str;
  }
}

function getTime(target, now) {
  var remain = parseInt((target - now) / 1000);
  var ss = format(String(remain));
  return {
      ss: ss,
  }
}

module.exports = {
  props: {
    remain: {
      default: 0
    }
  },
  data: function () {
    return {
      now: 0,
      target: 0,
      outofview: false
    }
  },
  mounted: function() {
    this.now = Date.now();
    this.target = this.now + this.remain * 1000;
    if (this.remain > 0) {
      this.run();
    }
  },
  methods: {
    run: function() {
      if (!this.outofview) {
        this.now = Date.now()
      }
      let time = getTime(this.target, this.now);
      if (this.target > this.now) {
        this.$emit('tick', time)
      } else {
        this.$emit('alarm', time);
        return
      }
      setTimeout(this.run.bind(this), 998)
    },
    appeared: function() {
      this.outofview = false
    },
    disappeared: function() {
      this.outofview = true
    }
  }
}
</script>
