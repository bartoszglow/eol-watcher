<template>
  <div class="list-group">
    <li class="list-group-item" v-for="battle in $store.state.battles.all">
      <img class="img-circle media-object pull-left" :src="isInQueue(battle) ? 'assets/queue.png' : `http://elmaonline.net/images/map/${battle.level}`">
      <div class="media-body">
        <h2 class="battle-title"><strong>{{battle.levelname}}</strong> <small><i>by</i></small> <strong>{{battle.kuski}}</strong></h2>
        <p class="battle-description"><i>time:</i> <strong>{{battle.duration}} minutes</strong></p>
        <p class="battle-description"><i>type:</i> <strong>{{battle.type}}</strong></p>
      </div>
      <div class="media-object pull-right status-icon">
        <span class="icon icon-record icon-blue" :class="{'icon-blue': isInQueue(battle), 'icon-yellow': isInProgress(battle), 'icon-green': isFinished(battle)}"></span>
      </div>
    </li>
  </div>
</template>

<script>
  export default {
    name: 'queue',
    methods: {
      isInQueue: function(battle) {
        return battle.inqueue === 1
      },
      isInProgress: function(battle) {
        return battle.inqueue === 0 && battle.finished === 0
      },
      isFinished: function(battle) {
        return battle.finished === 1
      }
    }
  }
</script>

<style>
  .battle-title {
    font-size: 16px;
  }
  .battle-description {
    font-size: 14px;
  }
  .media-body {
    padding-left: 5px;
  }
  .status-icon {
    position: absolute;
    right: 10px;
    top: 10px;
    margin-top: 0;
    line-height: 66px;
  }
  .status-icon .icon {
    font-size: 20px;
  }
  .img-circle {
    margin-top: 0;
    width: 68px;
    height: 68px;
  }
  .icon-blue {
    color: #3498db;
  }
  .icon-yellow {
    color: #f1c40f;
  }
  .icon-green {
    color: #2ecc71;
  }
  /* https://flatuicolors.com/palette/defo */
</style>
