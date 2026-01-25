import { Request, Response } from "express";
import Project from "../models/project.ts";


// get api endpoint for all the projects
export const getAllProjects = async (req: Request, res: Response) => {
  try{
    const projects = await Project.Find({}).populate("user", "name email");
    return res.status(200).json({
      "message": "Projects fetched successfully!",
      projects,
    });
  }catch(error) {
    console.log(`${error}`);
    throw new Error(`While fetching projects`);
  }
};

export const postAProject = async(req: Request, res: Response) => {
  const { title, description, tags, githubLink, liveLink } = req.body;
  const userId = req.user;

  if( !title || !description || !githubLink ) {
    return res.status(400).json({
      "success": "false",
      "message": "Title, Description and Github Link are required fields",
    });
  }

  try{
    const project = new Project{
      user: userId,
      title,
      description,
      tags,
      githubLink,
      liveLink,
    }
    await Project.save()
    return res.status(201).json({
      "success": "true",
      "message": "Project uploaded successfully!",
      project
    });
  }catch(error) {
    console.log(`${error}`);
    throw new Error(`While uploading a project`);    
  }
};

export const getProjectById = async(req: Request, res: Response) => {
  const { projectId } = req.params;
  try{
    const project = await Project.FindOne({ "_id": projectId }).populate("user", "name email");
    return res.status(200).json({
      "success": "true",
      project
    });
  }catch(error) {
    console.log(`${error}`);
    throw new Error(`While getting a project: ${projectId}`);
  }
};

export const deleteProjectById = async(req: Request, res: Response) => {
  const { projectId } = req.params;
  const userId = req.user._id;

  try{
    const reqProject = await Project.FindOne({ "_id": projectId });
    if reqProject.user._id.toString() !== userId.toString() {
      return res.status(401).json({
        "success": "false",
        "message": "You are not authorized for this action"
      });
    }
    
    const project = await Project.FindOneAndDelete({ "_id": projectId });
    return res.status(200).json({
      "success": "true",
      "message": "Project deleted successfully!",
      project
    });
  }catch(error) {
    console.log(`${error}`);
    throw new Error(`While deleting a project: ${projectId}`);
  }
};

