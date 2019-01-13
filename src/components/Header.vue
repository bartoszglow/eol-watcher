<template>
  <header class="toolbar toolbar-header">
    <h1 class="title">Eol Watcher</h1>

    <div class="toolbar-actions">
      <router-link to="/">
        <button class="btn btn-default">
          <span class="icon icon-home"></span>
        </button>
      </router-link>

      <router-link to="/queue">
        <button class="btn btn-default">
          <span class="icon icon-menu icon-text"></span>
          Queue
        </button>
      </router-link>

      <router-link to="/filters">
        <button class="btn btn-default">
          <span class="icon icon-cog icon-text"></span>
          Filters
        </button>
      </router-link>

      <div class="pull-right">
        <button class="btn btn-default">
          <span class="icon icon-up-open-mini"></span>
        </button>
        <button class="btn btn-default">
          <span class="icon icon-cancel"></span>
        </button>
      </div>
    </div>
  </header>
</template>

<script>
  export default {
    name: 'header'
  }
</script>

<style>
  .title {
    font-size: 14px;
  }
</style>
