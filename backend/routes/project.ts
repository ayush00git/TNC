import express from "express";
import { getAllProjects, postAProject, getProjectById, deleteProjectById, editProjectById } from "../controllers/project.ts"

export const projectRoute = express.Router()

projectRoute.get("/", getAllProjects);    // get all the posted getAllProjects
projectRoute.post("/", postAProject);     // posting a project 
projectRoute.get("/:projectId", getProjectById);   // get a particular project
projectRoute.delete("/delete/:projectId", deleteProjectById);  // delete a project (auth)
projectRoute.put("/edit/:projectId", editProjectById);         // edit a project (auth)


