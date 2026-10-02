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

const createProject = async (title, description, location, projectDate, organizationId) => {
    const query = `
        INSERT INTO public.project (title, description, location, project_date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;
    const result = await db.query(query, [title, description, location, projectDate, organizationId]);
    return result.rows[0].project_id;
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

const updateProjectCategories = async (projectId, categoryIds) => {
    await db.query('DELETE FROM public.project_category WHERE project_id = $1', [projectId]);
    if (!categoryIds) return;
    const ids = Array.isArray(categoryIds) ? categoryIds : [categoryIds];
    for (const catId of ids) {
        await db.query('INSERT INTO public.project_category (project_id, category_id) VALUES ($1, $2)', [projectId, catId]);
    }
};

// --- NEW FUNCTIONS FOR VOLUNTEERING (W06 Feature) ---

const addVolunteerToProject = async (userId, projectId) => {
    const query = `
        INSERT INTO public.project_volunteer (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
    `;
    await db.query(query, [userId, projectId]);
};

const removeVolunteerFromProject = async (userId, projectId) => {
    const query = `
        DELETE FROM public.project_volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;
    await db.query(query, [userId, projectId]);
};

const checkIfUserIsVolunteering = async (userId, projectId) => {
    const query = `
        SELECT 1 FROM public.project_volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
};

const getVolunteeredProjectsForUser = async (userId) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.project_date, p.organization_id, o.name AS organization_name
        FROM public.project p
        JOIN public.project_volunteer pv ON p.project_id = pv.project_id
        JOIN public.organization o ON p.organization_id = o.organization_id
        WHERE pv.user_id = $1
        ORDER BY p.project_date ASC;
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

export { 
    getAllProjects, 
    getProjectsByOrganizationId, 
    getUpcomingProjects, 
    getProjectDetails, 
    getProjectsByCategoryId,
    createProject,
    updateProject,
    updateProjectCategories,
    addVolunteerToProject,
    removeVolunteerFromProject,
    checkIfUserIsVolunteering,
    getVolunteeredProjectsForUser
};