import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import './assets/fonts/Google-Sans/GoogleSans-Medium.ttf';

import ProtectedRoute from "./middleware/protected.route";
import ProtectedLoginRoute from "./middleware/protectedLogin.route";

import HomeView from "./views/HomeView";
import LoginView from "./views/LoginView";

import CreateNewView from "./views/CreateNewView";
import ManageNewView from "./views/ManageNewView";
import EditNewView from "./views/EditNewView";
import DeleteNewView from "./views/DeleteNewView";

import Error404 from "./views/Error404";
import NavigationNavbarComponent from "./components/Navigation/Navbar";
import ErrorNetwork from "./views/ErrorNetwork";

// MW Action

import AuthLoginView from './views/Auth/LoginView';

import ArticlesView from './views/Articles/ArticlesView';
import ArticlesCreateView from './views/Articles/CreateView';
import ArticlesCreateCategoryView from './views/Articles/CreateCategoryView';
import ArticlesCreateSubCategoryView from './views/Articles/CreateSubCategoryView';
import ArticlesEditView from './views/Articles/EditView';

function App() {

  return (
      <Router>
        <Switch>
          <ProtectedLoginRoute path="/user/login" component={AuthLoginView}/>
          <ProtectedRoute path="/articles/create" component={ArticlesCreateView}/>
          <ProtectedRoute path="/articles/edit/:id" component={ArticlesEditView}/>
          <ProtectedRoute path="/articles/category/create" component={ArticlesCreateCategoryView} />
          <ProtectedRoute path="/articles/subcategory/create" component={ArticlesCreateSubCategoryView} />
          <ProtectedRoute path="/articles" exact component={ArticlesView}/>
          <ProtectedRoute path="/news/manage/edit/:id" component={EditNewView}/>
          <ProtectedRoute path="/news/manage/delete/:id" component={DeleteNewView}/>
          <ProtectedRoute path="/" exact component={HomeView}/>
          <Route path="/user/error_network" component={ErrorNetwork}/>
          <Route>
            <Error404/>
          </Route>
        </Switch>
      </Router>
  );
}

export default App;
