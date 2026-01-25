import { Request, Response } from "express";
import Project from "../models/project.ts";


// get api endpoint for all the projects
export const getAllProjects = async (req: Request, res: Response) => {
  try{
    const projects = await Project.Find({});
    return res.status(200).json({
      "message": "Projects fetched successfully!",
      projects,
    });
  }catch(error) {
    console.log(`${error}`);
    throw new Error(`While fetching projects`);
  }
};
