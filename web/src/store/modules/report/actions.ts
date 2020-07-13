import { ActionContext } from 'vuex';
import Axios from 'axios';
import { Route } from 'vue-router';
import { ReportState, Mutations } from '.';
import { RootState } from '@/store';
import { reasonToError } from '@/plugins/http';

export function fetchCurrentReport<S extends ReportState, R extends RootState>(context: ActionContext<S, R>, reportID: string): Promise<void> {
  return new Promise((resolve) => {
    context.commit(Mutations.START_REPORT_LOADING);
    Axios.get<Report[]>(`${context.rootState.base}/api/v1/reports/${reportID}`, {
      params: {
        latest: true
      }
    })
      .then((response) => {
        if (response.data.length <= 0) {
          context.commit(Mutations.SET_REPORT_CURRENT, undefined);
          context.commit(Mutations.SET_REPORT_ERROR, new Error('report not found'));
        } else {
          context.commit(Mutations.SET_REPORT_CURRENT, response.data[0]);
        }
      })
      .catch(reason => {
        context.commit(Mutations.SET_REPORT_CURRENT, undefined);
        context.commit(Mutations.SET_REPORT_ERROR, reasonToError(reason));
      })
      .finally(() => {
        context.commit(Mutations.STOP_REPORT_LOADING);
        resolve();
      });
  });
}

export function fetchSource<S extends ReportState, R extends RootState>(context: ActionContext<S, R>, to: Route): Promise<void> {
  return new Promise(resolve => {
    context.commit(Mutations.START_REPORT_LOADING);
    const base = context.rootState.base;
    const { scm, namespace, name, path } = to.params;
    let params = {};
    if (context.state.current) {
      params = {
        ref: context.state.current.commit
      };
    }
    Axios.get<string>(
      `${base}/api/v1/repos/${scm}/${namespace}/${name}/content/${path}`,
      {
        params: params
      })
      .then(response => {
        context.commit(Mutations.SET_REPORT_SOURCE, response.data);
      })
      .catch(reason => {
        context.commit(Mutations.SET_REPORT_ERROR, reasonToError(reason));
      })
      .finally(() => {
        context.commit(Mutations.STOP_REPORT_LOADING);
        resolve();
      });
  });
}