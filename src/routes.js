import express from 'express';
import { body } from 'express-validator';
import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage, showOrganizationDetailsPage } from './controllers/organizations.js';
import { 
    showProjectsPage, 
    showProjectDetailsPage, 
    showEditProjectForm, 
    processEditProjectForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm
} from './controllers/projects.js';
import { 
    showCategoriesPage, 
    showCategoryDetailsPage,
    showAddCategoryForm,
    processAddCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
} from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

// Home route
router.get('/', showHomePage);

// Organization routes
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// Project routes
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// Edit Project routes (W04 Team Activity)
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', processEditProjectForm);

// Assign Categories to Project routes (W04 Assignment)
router.get('/project/:id/assign-categories', showAssignCategoriesForm);
router.post('/project/:id/assign-categories', processAssignCategoriesForm);

// Category routes
router.get('/categories', showCategoriesPage);

// Add Category routes 
router.get('/category/add', showAddCategoryForm);
router.post(
    '/category/add', 
    body('category_name').trim().notEmpty().withMessage('Category name is required.'),
    processAddCategoryForm
);

// Edit Category routes
router.get('/category/edit/:id', showEditCategoryForm);
router.post(
    '/category/edit/:id', 
    body('category_name').trim().notEmpty().withMessage('Category name is required.'),
    processEditCategoryForm
);

// Category Details route
router.get('/category/:id', showCategoryDetailsPage);

// Error testing route
router.get('/test-error', testErrorPage);

export default router;