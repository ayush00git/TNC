import express from "express";
import { getAllProjects, postAProject, getProjectById, deleteProjectById, editProjectById } from "../controllers/project"
import { allowOnlyAuthenticatedUser } from "../middlewares/auth";

export const projectRoute = express.Router()

projectRoute.get("/:projectId", getProjectById);                                                // get a particular project
projectRoute.delete("/delete/:projectId", allowOnlyAuthenticatedUser, deleteProjectById);       // delete a project (auth)
projectRoute.put("/edit/:projectId", allowOnlyAuthenticatedUser, editProjectById);              // edit a project (auth)
projectRoute.get("/", getAllProjects);                                                          // get all the posted getAllProjects
projectRoute.post("/post", allowOnlyAuthenticatedUser, postAProject);                           // posting a project 
