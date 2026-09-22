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

// Edit Project routes
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', processEditProjectForm);

// Assign Categories to Project routes
router.get('/project/:id/assign-categories', showAssignCategoriesForm);
router.post('/project/:id/assign-categories', processAssignCategoriesForm);

// Category routes
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

// ----------------------------------------------------
// NEW EXACT ROUTES & VALIDATION FOR 100% MASTERY
// ----------------------------------------------------

// Add Category routes (/new-category)
router.get('/new-category', showAddCategoryForm);
router.post(
    '/new-category', 
    body('category_name')
        .trim()
        .notEmpty().withMessage('Category name is required.')
        .isLength({ min: 3, max: 100 }).withMessage('Category name must be between 3 and 100 characters.'),
    processAddCategoryForm
);

// Edit Category routes (/edit-category/:id)
router.get('/edit-category/:id', showEditCategoryForm);
router.post(
    '/edit-category/:id', 
    body('category_name')
        .trim()
        .notEmpty().withMessage('Category name is required.')
        .isLength({ min: 3, max: 100 }).withMessage('Category name must be between 3 and 100 characters.'),
    processEditCategoryForm
);

// Error testing route
router.get('/test-error', testErrorPage);

export default router;