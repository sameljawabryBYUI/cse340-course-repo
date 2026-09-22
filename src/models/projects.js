import db from './db.js';

const getAllProjects = async () => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.project_date, o.name AS organization_name
        FROM public.project p
        JOIN public.organization o ON p.organization_id = o.organization_id;
    `;
    const result = await db.query(query);
    return result.rows;
};

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT project_id, organization_id, title, description, location, project_date
        FROM public.project
        WHERE organization_id = $1
        ORDER BY project_date;
    `;
    const result = await db.query(query, [organizationId]);
    return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.project_date, p.organization_id, o.name AS organization_name
        FROM public.project p
        JOIN public.organization o ON p.organization_id = o.organization_id
        WHERE p.project_date >= CURRENT_DATE
        ORDER BY p.project_date ASC
        LIMIT $1;
    `;
    const result = await db.query(query, [number_of_projects]);
    return result.rows;
};

const getProjectDetails = async (id) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.project_date, p.organization_id, o.name AS organization_name
        FROM public.project p
        JOIN public.organization o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.project_date, p.organization_id, o.name AS organization_name
        FROM public.project p
        JOIN public.project_category pc ON p.project_id = pc.project_id
        JOIN public.organization o ON p.organization_id = o.organization_id
        WHERE pc.category_id = $1;
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows;
};

const updateProject = async (projectId, title, description, location, projectDate, organizationId) => {
    const query = `
        UPDATE public.project
        SET title = $1, description = $2, location = $3, project_date = $4, organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;
    
    const queryParams = [title, description, location, projectDate, organizationId, projectId];
    const result = await db.query(query, queryParams);
    
    if (result.rows.length === 0) {
        throw new Error('Project not found or update failed');
    }
    
    return result.rows[0].project_id;
};

// NEW FUNCTION: Updates the category assignments for a project
const updateProjectCategories = async (projectId, categoryIds) => {
    // 1. Remove all existing category associations for this project
    await db.query('DELETE FROM public.project_category WHERE project_id = $1', [projectId]);
    
    // 2. If the user unchecked all boxes, categoryIds will be undefined. Stop here.
    if (!categoryIds) return;

    // 3. Ensure categoryIds is an array (Express sends a string if only 1 box is checked)
    const ids = Array.isArray(categoryIds) ? categoryIds : [categoryIds];

    // 4. Insert the new checked categories into the database
    for (const catId of ids) {
        await db.query('INSERT INTO public.project_category (project_id, category_id) VALUES ($1, $2)', [projectId, catId]);
    }
};

export { 
    getAllProjects, 
    getProjectsByOrganizationId, 
    getUpcomingProjects, 
    getProjectDetails, 
    getProjectsByCategoryId,
    updateProject,
    updateProjectCategories
};