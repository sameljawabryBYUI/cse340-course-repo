import db from './db.js';

const getAllCategories = async () => {
    const query = `
        SELECT category_id, category_name
        FROM public.category;
    `;
    const result = await db.query(query);
    return result.rows;
};

const getCategoryDetails = async (categoryId) => {
    const query = `
        SELECT category_id, category_name
        FROM public.category
        WHERE category_id = $1;
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.category_name
        FROM public.category c
        JOIN public.project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
};

const createCategory = async (categoryName) => {
    const query = `
        INSERT INTO public.category (category_name)
        VALUES ($1)
        RETURNING category_id;
    `;
    const result = await db.query(query, [categoryName]);
    
    if (result.rows.length === 0) {
        throw new Error('Failed to create category');
    }
    
    return result.rows[0].category_id;
};

const updateCategory = async (categoryId, categoryName) => {
    const query = `
        UPDATE public.category
        SET category_name = $1
        WHERE category_id = $2
        RETURNING category_id;
    `;
    const result = await db.query(query, [categoryName, categoryId]);
    
    if (result.rows.length === 0) {
        throw new Error('Category not found or update failed');
    }
    
    return result.rows[0].category_id;
};

export { 
    getAllCategories, 
    getCategoryDetails, 
    getCategoriesByProjectId,
    createCategory,
    updateCategory
};