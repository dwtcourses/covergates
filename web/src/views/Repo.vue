<template>
  <perfect-scrollbar class="page-container">
    <v-container>
      <v-row align="center" justify="center" class="fill-height">
        <v-col class="subtitle-1 text-center" cols="12" v-show="loading">Getting Repositories</v-col>
        <v-col cols="6" v-show="loading">
          <v-progress-linear indeterminate rounded height="6"></v-progress-linear>
        </v-col>
        <v-col sm="12" md="6" v-show="!loading">
          <repo-list v-if="!loading" :repos="repositories"></repo-list>
        </v-col>
      </v-row>
    </v-container>
  </perfect-scrollbar>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Vue from '@/vue';
import RepoList from '@/components/RepoList.vue';
import { Actions } from '@/store';

@Component({
  components: {
    RepoList
  }
})
export default class Repo extends Vue {
  mounted() {
    this.$store.dispatch(Actions.FETCH_REPOSITORY_LIST);
  }

  get loading(): boolean {
    return this.$store.state.repository.loading;
  }

  get repositories(): Repository[] {
    const repos = [] as Repository[];
    repos.push(...this.$store.state.repository.list);
    repos.sort((a, b) => {
      if (a.ReportID && b.ReportID) {
        return a.URL.localeCompare(b.URL);
      } else if (a.ReportID) {
        return -1;
      } else if (b.ReportID) {
        return 1;
      } else {
        return a.URL.localeCompare(b.URL);
      }
    });
    return repos;
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  overflow-y: auto;
  height: 100%;
}
</style>
