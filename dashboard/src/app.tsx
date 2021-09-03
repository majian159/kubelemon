import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { history, Link } from 'umi';

import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import { PageLoading } from '@ant-design/pro-layout';

import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';

import type { RequestConfig, RunTimeLayoutConfig } from 'umi';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // login page, stop
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}

// ProLayout api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // no authorization, redirect login page
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI Docs</span>
          </Link>,
          <Link to="/~docs">
            <BookOutlined />
            <span>Docs</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // custom 403 page
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};

export const request: RequestConfig = {
  prefix: '/api/v1alpha1',
  errorConfig: {
    adaptor: (data, ctx) => {
      const { res } = ctx;

      if (res === '') {
        return { success: true };
      }
      const { status }: Response = res;

      if (typeof data === 'string') {
        return { success: status < 400, errorMessage: data ?? '' };
      }
      return data;
    },
  },
};
