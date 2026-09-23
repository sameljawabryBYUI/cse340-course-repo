import { 
    getAllCategories, 
    getCategoryDetails, 
    createCategory, 
    updateCategory 
} from '../models/categories.js';
import { getProjectsByCategoryId } from '../models/projects.js';
import { body, validationResult } from 'express-validator'; // Imported 'body' here now!

// ----------------------------------------------------
// NEW: Reusable Validation Logic defined in the Controller (Criteria 4 & 5)
// ----------------------------------------------------
const validateCategoryRules = [
    body('category_name')
        .trim()
        .notEmpty().withMessage('Category name is required.')
        .isLength({ min: 3, max: 100 }).withMessage('Category name must be between 3 and 100 characters.')
];

const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';
    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const categoryDetails = await getCategoryDetails(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);
    const title = 'Category Details';
    res.render('category', { title, categoryDetails, projects });
};

const showAddCategoryForm = (req, res) => {
    const title = 'Add New Category';
    res.render('add-category', { title });
};

const processAddCategoryForm = async (req, res) => {
    const { category_name } = req.body;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        const title = 'Add New Category';
        return res.render('add-category', { title, category_name });
    }

    const newCategoryId = await createCategory(category_name);
    req.flash('success', 'Category added successfully!');
    res.redirect(`/category/${newCategoryId}`);
};

const showEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const categoryDetails = await getCategoryDetails(categoryId);
    
    const title = 'Edit Category';
    res.render('edit-category', { title, categoryDetails });
};

const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const { category_name } = req.body;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        const categoryDetails = { category_id: categoryId, category_name };
        const title = 'Edit Category';
        return res.render('edit-category', { title, categoryDetails });
    }

    await updateCategory(categoryId, category_name);
    req.flash('success', 'Category updated successfully!');
    res.redirect(`/category/${categoryId}`);
};

// Export the validation rules alongside the other functions
export { 
    showCategoriesPage, 
    showCategoryDetailsPage,
    showAddCategoryForm,
    processAddCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    validateCategoryRules
};