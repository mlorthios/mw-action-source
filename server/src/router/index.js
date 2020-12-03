import { Router } from 'express';

import HttpRoutesAPIAdminNewsFetchById from './api/admin/news/fetchById';
import HttpRoutesAPINewsFetchAll from './api/news/fetchAll';
import HttpRoutesAPIAdminNewsFetchAll from './api/admin/news/fetchAll';
import HttpRoutesAPIAdminNewsFetchCategory from './api/admin/news/fetchCategory';
import HttpRoutesAPIAdminNewsFetchSubCategory from './api/admin/news/fetchSubCategory';
import HttpRoutesAPIAdminNewsFetchAllSubCategory from './api/admin/news/fetchAllSubCategory';
import HttpRoutesAPIAdminNewsCreate from './api/admin/news/create';
import HttpRoutesAPIAdminNewsUpdate from './api/admin/news/update';
import HttpRoutesAPIAdminNewsDelete from './api/admin/news/delete';
import HttpRoutesAPIAdminNewsDisable from './api/admin/news/disable'
import HttpRoutesAPIAdminNewsActive from './api/admin/news/active';
import HttpRoutesAPIAdminNewsCreateCategory from './api/admin/news/createCategory';
import HttpRoutesAPIAdminNewsCreateSubCategory from './api/admin/news/createSubCategory';
import HttpRoutesAPIAdminNewsDeleteCategory from './api/admin/news/deleteCategory';
import HttpRoutesAPIAdminNewsDeleteSubCategory from './api/admin/news/deleteSubCategory';

import HttpRoutesAPIAuthenticationLogin from './api/authentication/login';
import HttpRoutesAPIAuthenticationRegister from './api/authentication/register';

import HttpRoutesAPIAuthentificationVerify from './api/authentication/verify';

import HttpRoutesAPINewsLike from './api/news/like';

export default class HttpRouter
{
    constructor()
    {
        this.router = Router();

        /* Public */
        
        // Articles
        this.router.get('/v1/news/fetchall', HttpRoutesAPINewsFetchAll);
        this.router.post('/v1/news/like', HttpRoutesAPINewsLike);

        // Authentification
        this.router.post('/v1/authentication/login', HttpRoutesAPIAuthenticationLogin);
        this.router.post('/v1/authentication/register', HttpRoutesAPIAuthenticationRegister);
        this.router.post('/v1/authentication/verify', HttpRoutesAPIAuthentificationVerify);

        /* Admin */

        // Articles
        this.router.get('/v1/admin/news/fetchall', HttpRoutesAPIAdminNewsFetchAll);
        this.router.get('/v1/admin/news/fetch', HttpRoutesAPIAdminNewsFetchById)
        this.router.get('/v1/admin/news/fetchcategory', HttpRoutesAPIAdminNewsFetchCategory);
        this.router.get('/v1/admin/news/fetchsubcategory', HttpRoutesAPIAdminNewsFetchSubCategory);
        this.router.get('/v1/admin/news/fetchallsubcategory', HttpRoutesAPIAdminNewsFetchAllSubCategory);

        this.router.post('/v1/admin/news/update', HttpRoutesAPIAdminNewsUpdate);
        this.router.post('/v1/admin/news/delete', HttpRoutesAPIAdminNewsDelete);
        this.router.post('/v1/admin/news/disable', HttpRoutesAPIAdminNewsDisable);
        this.router.post('/v1/admin/news/active', HttpRoutesAPIAdminNewsActive);

        this.router.post('/v1/admin/news/deletecategory', HttpRoutesAPIAdminNewsDeleteCategory);
        this.router.post('/v1/admin/news/deletesubcategory', HttpRoutesAPIAdminNewsDeleteSubCategory);

        this.router.post('/v1/admin/news/create', HttpRoutesAPIAdminNewsCreate);
        this.router.post('/v1/admin/news/createcategory', HttpRoutesAPIAdminNewsCreateCategory);
        this.router.post('/v1/admin/news/createsubcategory', HttpRoutesAPIAdminNewsCreateSubCategory);

        return this.router;
    }
}
