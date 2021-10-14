import { ComponentType } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

interface PageProps {
  Layout?: ComponentType<{ page: JSX.Element }>
  routes: {
    path: string
    page: JSX.Element
    exact?: boolean
  }[]
}

export default function BaseRouter({ Layout, routes }: PageProps) {
  const pages = routes.map(routeData => {
    const { path, page, exact } = routeData;
    if (Layout) {
      return (
        <Route path={path} exact={exact}>
          <Layout page={page}/>
        </Route>
      );
    }
    return <Route path={path} exact={exact}>{page}</Route>;
  });

  return (
    <Router>
      <Switch>
        {pages}
      </Switch>
    </Router>
  );
}
